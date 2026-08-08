from __future__ import annotations

import argparse
import base64
import collections
import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from tools.compile_source_vault_tei_ingestion import (
    ROOT,
    canonical_json,
    json_sql,
    read_verified_object,
    sha256_bytes,
    sql_quote,
)


CONTRACT = "DEVAM_PROJECT_GUTENBERG_TEI_EDITION_INGESTION_V1"
COPY_POLICY = "reference_only_no_duplicate_payload"
DIV_TAG = re.compile(rb"<div(?:\s[^>]*)?>|</div\s*>", re.IGNORECASE)


def normalize(node: ET.Element) -> str:
    return " ".join("".join(node.itertext()).split())


def strict_utf8(data: bytes, label: str) -> tuple[str, bool]:
    bom = data.startswith(b"\xef\xbb\xbf")
    try:
        text = data.decode("utf-8-sig", errors="strict")
    except UnicodeDecodeError as exc:
        raise ValueError(f"{label} is not strict UTF-8") from exc
    rebuilt = ((b"\xef\xbb\xbf" if bom else b"") + text.encode("utf-8"))
    if rebuilt != data:
        raise ValueError(f"{label} fails BOM-aware UTF-8 byte roundtrip")
    return text, bom


def dollar_quote(value: str) -> str:
    tag = f"$devam_{sha256_bytes(value.encode('utf-8'))[:16]}$"
    if tag in value:
        raise ValueError("Deterministic SQL dollar-quote tag collides with source text")
    return f"{tag}{value}{tag}"


def roman_to_int(value: str) -> int:
    table = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000}
    total = 0
    previous = 0
    for character in reversed(value.upper()):
        current = table[character]
        total += -current if current < previous else current
        previous = max(previous, current)
    return total


def validate_plan(plan: dict[str, Any]) -> None:
    if plan.get("contract") != CONTRACT or plan.get("source_copy_policy") != COPY_POLICY:
        raise ValueError("Contract or reference-only policy drift")
    if plan["rights"] != {
        "lane": "private_evidence",
        "provider_rights_literal": "Public domain in the USA.",
        "carrier_geography_warning": "If you are not located in the United States, you will have to check the laws of the country where you are located before using this eBook.",
        "license_reference": "https://www.gutenberg.org/policy/license.html",
        "status": "provider_public_domain_usa_geography_specific_product_clearance_not_yet_recorded",
    }:
        raise ValueError("Rights boundary drift")
    if set(plan["completion_denials"]) != {
        "complete_valmiki_ramayana_sanskrit_source",
        "complete_griffith_translation_without_omissions",
        "uttarakanda_main_book_present",
        "complete_ramayana_tradition_or_all_recensions",
        "hindi_translation_present",
        "ramayana_hero_universe_complete",
        "mvp_library_complete",
        "public_product_clearance",
    } or not all(value is False for value in plan["completion_denials"].values()):
        raise ValueError("Completion-denial contract drift")
    expression = plan["expression"]
    if expression["is_source_original"] is not False or expression["ai_generated"] is not False:
        raise ValueError("Translation/electronic-edition identity drift")
    if plan["structure"]["publication_state"] != "review":
        raise ValueError("Packet must remain review-only")
    if plan["carrier_census"]["database_indexing_boundary"] != (
        "six_structurally_useful_representations_only_full_600_carrier_universe_remains_preserved_in_source_vault"
    ):
        raise ValueError("Lean indexing boundary drift")


def normalized_census_rows(prefix: str) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    provenance_path = ROOT / "source_vault" / "provenance-map.jsonl"
    for line in provenance_path.read_text(encoding="utf-8").splitlines():
        row = json.loads(line)
        if row["source_path"].startswith(prefix):
            rows.append({key: row[key] for key in ("name", "sha256", "bytes", "object_path")})
    rows.sort(key=lambda row: (row["name"].casefold(), row["name"]))
    return rows


def verify_carrier_census(plan: dict[str, Any]) -> list[dict[str, Any]]:
    census = plan["carrier_census"]
    universes = [normalized_census_rows(prefix) for prefix in census["provenance_prefixes"]]
    if not universes or any(rows != universes[0] for rows in universes[1:]):
        raise ValueError("The two retained provenance lineages do not normalize to one carrier universe")
    rows = universes[0]
    root = sha256_bytes(canonical_json(rows).encode("utf-8"))
    observed = {
        "record_count": len(rows),
        "unique_sha256_count": len({row["sha256"] for row in rows}),
        "total_bytes": sum(row["bytes"] for row in rows),
        "normalized_root_sha256": root,
    }
    for key, value in observed.items():
        if census[key] != value:
            raise ValueError(f"Carrier census {key} drift: {value}")
    return rows


def scan_div_spans(raw: bytes) -> list[tuple[int, int]]:
    stack: list[int] = []
    spans: list[tuple[int, int]] = []
    for match in DIV_TAG.finditer(raw):
        token = match.group(0).lower()
        if token.startswith(b"</"):
            if not stack:
                raise ValueError("Unbalanced closing div tag")
            spans.append((stack.pop(), match.end()))
        else:
            stack.append(match.start())
    if stack:
        raise ValueError("Unbalanced opening div tag")
    return sorted(spans)


def classify_leaf(
    node: ET.Element,
    parents: dict[ET.Element, ET.Element],
    body_tops: list[ET.Element],
) -> tuple[str, int | None, int | None, str]:
    cursor = node
    top = node
    section = ""
    while cursor in parents:
        parent = parents[cursor]
        if parent.tag in {"front", "body", "back"}:
            section = parent.tag
            top = cursor
            break
        cursor = parent
    if not section:
        raise ValueError("Leaf div is not within text front/body/back")
    if section == "front":
        return "front_matter", None, None, section
    if section == "back":
        back_tops = parents[top].findall("div")
        return ("footnotes" if back_tops.index(top) == 0 else "project_gutenberg_footer"), None, None, section
    top_index = body_tops.index(top)
    if top_index == 0:
        return "invocation", None, None, section
    if 1 <= top_index <= 6:
        direct = top.findall("div")
        return "canto", top_index, direct.index(node) + 1, section
    if top_index == 7:
        return "appendix_section", None, top.findall("div").index(node) + 1, section
    if top_index == 8:
        return "additional_note", None, top.findall("div").index(node) + 1, section
    if top_index == 9:
        return "index", None, None, section
    raise ValueError("Unexpected body leaf classification")


def extract_passages(tei_bytes: bytes, plan: dict[str, Any]) -> list[dict[str, Any]]:
    structure = plan["structure"]
    entity = structure["undefined_entity"]
    literal = entity["literal"].encode("ascii")
    if tei_bytes.count(literal) != entity["count"] or tei_bytes.index(literal) != entity["byte_offset"]:
        raise ValueError("Undefined entity location/count drift")
    if tei_bytes.count(b"\n", 0, entity["byte_offset"]) + 1 != entity["line"]:
        raise ValueError("Undefined entity line drift")
    projected = tei_bytes.replace(literal, entity["replacement"].encode("utf-8"))
    if len(projected) != entity["projected_bytes"] or sha256_bytes(projected) != entity["projected_sha256"]:
        raise ValueError("Declared parse-projection drift")
    root = ET.fromstring(projected.decode("utf-8-sig"))
    if root.tag != plan["identity"]["tei_root_literal"] or root.get("lang") != plan["identity"]["language"]:
        raise ValueError("TEI root/language identity drift")
    title = root.find("./teiHeader/fileDesc/titleStmt/title")
    editor = root.find("./teiHeader/fileDesc/titleStmt/editor")
    source_desc = root.find("./teiHeader/fileDesc/sourceDesc")
    if title is None or normalize(title) != plan["identity"]["tei_title"]:
        raise ValueError("TEI title drift")
    if editor is None or normalize(editor) != plan["identity"]["tei_contributor_literal"]:
        raise ValueError("TEI contributor drift")
    if source_desc is None or normalize(source_desc) != plan["identity"]["tei_source_description_literal"]:
        raise ValueError("TEI source description drift")
    if len(root.findall(".//pb")) != structure["page_break_count"]:
        raise ValueError("Page-break count drift")
    if len(root.findall(".//l")) != structure["line_count"] or len(root.findall(".//lg")) != structure["line_group_count"]:
        raise ValueError("Line/line-group count drift")

    div_nodes = list(root.iter("div"))
    div_spans = scan_div_spans(tei_bytes)
    if len(div_nodes) != structure["raw_div_count"] or len(div_spans) != len(div_nodes):
        raise ValueError("TEI div universe drift")
    span_by_node = {node: span for node, span in zip(div_nodes, div_spans, strict=True)}
    parents = {child: parent for parent in root.iter() for child in parent}
    body_tops = root.findall("./text/body/div")
    if len(body_tops) != 10:
        raise ValueError("Body top-level div universe drift")

    book_profiles = {row["book"]: row for row in structure["book_profiles"]}
    if sorted(book_profiles) != list(range(1, 7)):
        raise ValueError("Book profile universe drift")
    for book in range(1, 7):
        canto_nodes = body_tops[book].findall("div")
        literal_numbers = []
        for canto in canto_nodes:
            head = canto.find("head")
            heading = normalize(head) if head is not None else ""
            match = re.match(r"Canto\s+([IVXLCDM]+)\b", heading, re.IGNORECASE)
            if not match:
                raise ValueError(f"Unparseable canto heading in book {book}: {heading[:80]}")
            literal_numbers.append(roman_to_int(match.group(1)))
        if literal_numbers != sorted(literal_numbers) or len(literal_numbers) != len(set(literal_numbers)):
            raise ValueError(f"Non-increasing or duplicate canto markers in book {book}")
        observed = {
            "book": book,
            "canto_div_count": len(canto_nodes),
            "first_literal": literal_numbers[0],
            "last_literal": literal_numbers[-1],
            "missing_literal_numbers": sorted(set(range(1, literal_numbers[-1] + 1)) - set(literal_numbers)),
        }
        if observed != book_profiles[book]:
            raise ValueError(f"Book {book} profile drift: {observed}")
    if structure["book_five_omission_literal"] not in normalize(body_tops[5].find("head")):
        raise ValueError("Book V explicit omission statement drift")
    if len(body_tops[7].findall("div")) != structure["appendix_direct_section_count"]:
        raise ValueError("Appendix section count drift")
    if len(body_tops[8].findall("div")) != structure["additional_notes_direct_section_count"]:
        raise ValueError("Additional-notes section count drift")

    passages: list[dict[str, Any]] = []
    section_counts: collections.Counter[str] = collections.Counter()
    empty_profiles: list[dict[str, Any]] = []
    for node in div_nodes:
        if node.findall("div"):
            continue
        start, end = span_by_node[node]
        unit_kind, book, local_ordinal, section = classify_leaf(node, parents, body_tops)
        head = node.find("head")
        heading = normalize(head) if head is not None else ""
        literal_marker = None
        literal_number = None
        numbering_status = "not_applicable"
        if unit_kind == "canto":
            match = re.match(r"Canto\s+([IVXLCDM]+)\b", heading, re.IGNORECASE)
            if not match:
                raise ValueError("Canto heading marker vanished during passage extraction")
            literal_marker = match.group(1)
            literal_number = roman_to_int(literal_marker)
            numbering_status = (
                "literal_sequence_contains_declared_gaps_in_this_book"
                if book_profiles[book]["missing_literal_numbers"]
                else "literal_sequence_contiguous_in_this_book"
            )
        exact_text = normalize(node)
        if not exact_text:
            divgen = node.find("divGen")
            if divgen is None or not divgen.get("type"):
                raise ValueError(f"Unexplained empty leaf div at byte {start}")
            empty_profiles.append({
                "byte_start": start,
                "byte_end_exclusive": end,
                "line_start": tei_bytes.count(b"\n", 0, start) + 1,
                "line_end": tei_bytes.count(b"\n", 0, end) + 1,
                "span_sha256": sha256_bytes(tei_bytes[start:end]),
                "divgen_type": divgen.get("type"),
            })
            continue
        section_counts[section] += 1
        passages.append({
            "source_ordinal": len(passages) + 1,
            "locator": {
                "contract": "DEVAM_PG_TEI_LEAF_DIV_BYTE_SPAN_V1",
                "section": section,
                "unit_kind": unit_kind,
                "book": book,
                "section_local_ordinal": local_ordinal,
                "literal_heading": heading or None,
                "literal_canto_marker": literal_marker,
                "literal_canto_number": literal_number,
                "numbering_status": numbering_status,
                "byte_start": start,
                "byte_end_exclusive": end,
                "line_start": tei_bytes.count(b"\n", 0, start) + 1,
                "line_end": tei_bytes.count(b"\n", 0, end) + 1,
            },
            "language_code": plan["expression"]["language_code"],
            "script_code": plan["expression"]["script_code"],
            "exact_text": exact_text,
            "span_sha256": sha256_bytes(tei_bytes[start:end]),
        })
    if len(passages) != structure["leaf_div_passage_count"]:
        raise ValueError("Leaf passage count drift")
    if len(passages) + len(empty_profiles) != structure["raw_leaf_div_count"]:
        raise ValueError("Raw leaf div count drift")
    if len(empty_profiles) != structure["empty_generated_leaf_count"] or empty_profiles != structure["empty_generated_leaf_profiles"]:
        raise ValueError(f"Empty generated leaf profiles drift: {empty_profiles}")
    if section_counts != collections.Counter({
        "front": structure["front_leaf_count"],
        "body": structure["body_leaf_count"],
        "back": structure["back_leaf_count"],
    }):
        raise ValueError(f"Front/body/back leaf counts drift: {section_counts}")
    canto_passages = [row for row in passages if row["locator"]["unit_kind"] == "canto"]
    if len(canto_passages) != structure["main_canto_count"]:
        raise ValueError("Main canto passage count drift")
    return passages


def compile_packet(plan_path: Path) -> dict[str, Any]:
    plan = json.loads(plan_path.read_text(encoding="utf-8"))
    validate_plan(plan)
    census_rows = verify_carrier_census(plan)
    sources = {source["role"]: source for source in plan["source_objects"]}
    expected_roles = {
        "provider_rdf_metadata", "canonical_utf8_text", "bom_utf8_text",
        "access_html", "access_pdf", "structural_tei",
    }
    if set(sources) != expected_roles or len(plan["source_objects"]) != 6:
        raise ValueError("Exact six-representation indexed source universe drift")
    census_by_name = {row["name"]: row for row in census_rows}
    source_bytes: dict[str, bytes] = {}
    for role, source in sources.items():
        if census_by_name.get(source["name"]) != {key: source[key] for key in ("name", "sha256", "bytes", "object_path")}:
            raise ValueError(f"Indexed source {role} does not exactly match carrier census")
        source_bytes[role] = read_verified_object(source)

    text_values: dict[str, tuple[str, bool]] = {}
    for role in expected_roles - {"access_pdf"}:
        text_values[role] = strict_utf8(source_bytes[role], role)
    canonical_text = text_values["canonical_utf8_text"][0]
    if plan["identity"]["provider_title"] not in canonical_text:
        raise ValueError("Provider title drift")
    if f"Author: {plan['identity']['source_author']}" not in canonical_text:
        raise ValueError("Source author drift")
    if f"Translator: {plan['identity']['translator']}" not in canonical_text:
        raise ValueError("Translator drift")
    for literal_key in ("printed_title_literal", "printed_translation_literal", "printed_imprint_literal"):
        if " ".join(plan["identity"][literal_key].split()) not in " ".join(canonical_text.split()):
            raise ValueError(f"Printed identity literal drift: {literal_key}")
    if plan["rights"]["carrier_geography_warning"] not in " ".join(canonical_text.split()):
        raise ValueError("Carrier geography warning drift")
    rdf_text = text_values["provider_rdf_metadata"][0]
    if plan["rights"]["provider_rights_literal"] not in rdf_text:
        raise ValueError("Provider RDF public-domain literal drift")
    observations = {row["role"]: row for row in plan["live_observations"]}
    if set(observations) != expected_roles or len(plan["live_observations"]) != 6:
        raise ValueError("Live observation universe drift")
    for role, source in sources.items():
        text_observation = role != "access_pdf"
        expected = {
            "role": role,
            "status": 200,
            "final_url": source["final_url"],
            "bytes": source["bytes"],
            "sha256": source["sha256"],
            "strict_utf8": True if text_observation else None,
            "bom": text_values[role][1] if text_observation else None,
            "roundtrip": True if text_observation else None,
        }
        if observations[role] != expected:
            raise ValueError(f"Live observation drift for {role}")
    passages = extract_passages(source_bytes["structural_tei"], plan)
    core = {
        **plan,
        "passages": passages,
        "source_object_count": len(sources),
        "passage_count": len(passages),
    }
    return {**core, "packet_sha256": sha256_bytes(canonical_json(core).encode("utf-8"))}


def compile_statements(packet: dict[str, Any]) -> list[str]:
    work = packet["work"]
    expression = packet["expression"]
    edition = packet["edition"]
    rights = packet["rights"]
    structure = packet["structure"]
    statements = [
        f"""insert into public.works (slug, canonical_title, work_kind, tradition_scope, summary, rights_lane, publication_state)
values ({sql_quote(work['slug'])}, {sql_quote(work['canonical_title'])}, {sql_quote(work['work_kind'])}, array[{','.join(sql_quote(value) for value in work['tradition_scope'])}]::text[], {sql_quote(work['summary'])}, {sql_quote(rights['lane'])}, 'review')
on conflict (slug) do update set canonical_title=excluded.canonical_title, work_kind=excluded.work_kind, tradition_scope=excluded.tradition_scope, summary=excluded.summary, rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;""",
        f"""insert into public.expressions (work_id, language_code, script_code, expression_kind, attribution, is_source_original, ai_generated, rights_lane, publication_state)
select w.id, {sql_quote(expression['language_code'])}, {sql_quote(expression['script_code'])}, {sql_quote(expression['expression_kind'])}, {sql_quote(expression['attribution'])}, false, false, {sql_quote(rights['lane'])}, 'review'
from public.works w where w.slug={sql_quote(work['slug'])}
and not exists (select 1 from public.expressions e where e.work_id=w.id and e.language_code={sql_quote(expression['language_code'])} and e.expression_kind={sql_quote(expression['expression_kind'])} and e.attribution={sql_quote(expression['attribution'])});""",
        f"""update public.expressions e set script_code={sql_quote(expression['script_code'])}, is_source_original=false, ai_generated=false, rights_lane={sql_quote(rights['lane'])}, publication_state='review'
from public.works w where e.work_id=w.id and w.slug={sql_quote(work['slug'])} and e.language_code={sql_quote(expression['language_code'])} and e.expression_kind={sql_quote(expression['expression_kind'])} and e.attribution={sql_quote(expression['attribution'])};""",
        f"""insert into public.editions (expression_id, edition_title, publisher, publication_place, publication_year, edition_statement, identifiers, rights_lane, publication_state)
select e.id, {sql_quote(edition['edition_title'])}, {sql_quote(edition['publisher'])}, null, {edition['publication_year']}, {sql_quote(edition['edition_statement'])}, {json_sql(edition['identifiers'])}, {sql_quote(rights['lane'])}, 'review'
from public.expressions e join public.works w on w.id=e.work_id where w.slug={sql_quote(work['slug'])} and e.language_code={sql_quote(expression['language_code'])} and e.expression_kind={sql_quote(expression['expression_kind'])} and e.attribution={sql_quote(expression['attribution'])}
and not exists (select 1 from public.editions d where d.expression_id=e.id and d.edition_title={sql_quote(edition['edition_title'])});""",
    ]
    rights_basis = {
        **rights,
        "live_observations": packet["live_observations"],
        "legal_conclusion": "not_recorded",
    }
    for source in packet["source_objects"]:
        provenance = {
            "ingestion_contract": CONTRACT,
            "ingestion_pilot_id": packet["pilot_id"],
            "ingestion_packet_sha256": packet["packet_sha256"],
            "source_copy_policy": COPY_POLICY,
            "representation_role": source["role"],
            "object_path": source["object_path"],
            "carrier_census": packet["carrier_census"],
            "source_identity": packet["identity"],
            "completion_denials": packet["completion_denials"],
        }
        statements.append(f"""insert into public.source_objects (edition_id, sha256, byte_count, media_type, storage_backend, storage_bucket, storage_key, provider, provider_identifier, source_url, acquired_at, provenance, completeness_status, rights_lane, rights_basis)
select d.id, {sql_quote(source['sha256'])}, {source['bytes']}, {sql_quote(source['media_type'])}, 'local_vault', null, {sql_quote(source['object_path'])}, {sql_quote(packet['provider']['name'])}, {sql_quote('pg:24869:' + source['role'])}, {sql_quote(source['request_url'])}, {sql_quote(packet['provider']['acquired_at'])}::timestamptz, {json_sql(provenance)}, {sql_quote(structure['edition_completeness_status'])}, {sql_quote(rights['lane'])}, {json_sql(rights_basis)}
from public.editions d join public.expressions e on e.id=d.expression_id join public.works w on w.id=e.work_id where w.slug={sql_quote(work['slug'])} and e.language_code={sql_quote(expression['language_code'])} and e.expression_kind={sql_quote(expression['expression_kind'])} and e.attribution={sql_quote(expression['attribution'])} and d.edition_title={sql_quote(edition['edition_title'])}
on conflict (sha256) do update set edition_id=excluded.edition_id, byte_count=excluded.byte_count, media_type=excluded.media_type, storage_backend=excluded.storage_backend, storage_bucket=excluded.storage_bucket, storage_key=excluded.storage_key, provider=excluded.provider, provider_identifier=excluded.provider_identifier, source_url=excluded.source_url, acquired_at=excluded.acquired_at, provenance=excluded.provenance, completeness_status=excluded.completeness_status, rights_lane=excluded.rights_lane, rights_basis=excluded.rights_basis;""")
    canonical_sha = next(source["sha256"] for source in packet["source_objects"] if source["role"] == "structural_tei")
    for passage in packet["passages"]:
        statements.append(f"""insert into public.passages (source_object_id, source_ordinal, locator, language_code, script_code, exact_text, text_status, span_sha256, rights_lane, publication_state)
select s.id, {passage['source_ordinal']}, {json_sql(passage['locator'])}, {sql_quote(passage['language_code'])}, {sql_quote(passage['script_code'])}, {dollar_quote(passage['exact_text'])}, {sql_quote(structure['text_status'])}, {sql_quote(passage['span_sha256'])}, {sql_quote(rights['lane'])}, 'review'
from public.source_objects s where s.sha256={sql_quote(canonical_sha)}
on conflict (source_object_id, source_ordinal) do update set locator=excluded.locator, language_code=excluded.language_code, script_code=excluded.script_code, exact_text=excluded.exact_text, text_status=excluded.text_status, span_sha256=excluded.span_sha256, rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;""")
    return statements


def compile_sql(packet: dict[str, Any]) -> str:
    return "\n\n".join(["begin;", *compile_statements(packet), "commit;"]) + "\n"


def compile_batches(packet: dict[str, Any], max_passage_sql_chars: int = 28000) -> list[str]:
    statements = compile_statements(packet)
    metadata_count = 4 + packet["source_object_count"]
    metadata = statements[:metadata_count]
    passages = statements[metadata_count:]
    batches = ["\n\n".join(["begin;", *metadata, "commit;"]) + "\n"]
    current: list[str] = []
    current_chars = 0
    for statement in passages:
        if current and current_chars + len(statement) > max_passage_sql_chars:
            batches.append("\n\n".join(["begin;", *current, "commit;"]) + "\n")
            current = []
            current_chars = 0
        current.append(statement)
        current_chars += len(statement)
    if current:
        batches.append("\n\n".join(["begin;", *current, "commit;"]) + "\n")
    return batches


def passage_root(packet: dict[str, Any]) -> str:
    rows = [
        f"{row['source_ordinal']}\t{row['span_sha256']}\t{sha256_bytes(row['exact_text'].encode('utf-8'))}\t{canonical_json(row['locator'])}"
        for row in packet["passages"]
    ]
    return sha256_bytes("\n".join(rows).encode("utf-8"))


def main() -> int:
    parser = argparse.ArgumentParser(description="Compile the Project Gutenberg Griffith Ramayana edition packet.")
    parser.add_argument("--plan", required=True, type=Path)
    parser.add_argument("--format", choices=("report", "sql", "sql-batch", "sql-base64", "sql-batch-base64"), default="report")
    parser.add_argument("--batch-index", type=int)
    args = parser.parse_args()
    path = args.plan.resolve(strict=True)
    if not path.is_relative_to(ROOT / "ingestion" / "plans"):
        raise ValueError("Plan must be inside ingestion/plans")
    packet = compile_packet(path)
    sql = compile_sql(packet)
    batches = compile_batches(packet)
    if args.format == "sql":
        sys.stdout.write(sql)
    elif args.format == "sql-batch":
        if args.batch_index is None or not 0 <= args.batch_index < len(batches):
            raise ValueError("Invalid batch index")
        sys.stdout.write(batches[args.batch_index])
    elif args.format == "sql-base64":
        sys.stdout.write(base64.b64encode(sql.encode("utf-8")).decode("ascii"))
    elif args.format == "sql-batch-base64":
        if args.batch_index is None or not 0 <= args.batch_index < len(batches):
            raise ValueError("Invalid batch index")
        sys.stdout.write(base64.b64encode(batches[args.batch_index].encode("utf-8")).decode("ascii"))
    else:
        report = {
            "result": "PASS",
            "contract": CONTRACT,
            "pilot_id": packet["pilot_id"],
            "packet_sha256": packet["packet_sha256"],
            "sql_sha256": sha256_bytes(sql.encode("utf-8")),
            "sql_batch_count": len(batches),
            "sql_batch_sha256": [sha256_bytes(batch.encode("utf-8")) for batch in batches],
            "carrier_census_record_count": packet["carrier_census"]["record_count"],
            "carrier_census_bytes": packet["carrier_census"]["total_bytes"],
            "carrier_census_root_sha256": packet["carrier_census"]["normalized_root_sha256"],
            "indexed_source_object_count": packet["source_object_count"],
            "indexed_source_object_bytes": sum(source["bytes"] for source in packet["source_objects"]),
            "passage_count": packet["passage_count"],
            "main_canto_count": packet["structure"]["main_canto_count"],
            "passage_content_root_sha256": passage_root(packet),
            "source_payloads_copied": False,
            **packet["completion_denials"],
        }
        print(json.dumps(report, ensure_ascii=False, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

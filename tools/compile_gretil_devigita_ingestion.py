from __future__ import annotations

import argparse
import base64
import csv
import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from tools.compile_source_vault_tei_ingestion import ROOT, TEI_NS, canonical_json, json_sql, read_verified_object, sha256_bytes, sql_quote


CONTRACT = "DEVAM_GRETIL_DEVIGITA_INGESTION_V1"
COPY_POLICY = "reference_only_no_duplicate_payload"
XML_ID = "{http://www.w3.org/XML/1998/namespace}id"
XML_LANG = "{http://www.w3.org/XML/1998/namespace}lang"
DIV_RAW = re.compile(rb"<div>.*?</div>", re.DOTALL)
CHILD_RAW = re.compile(rb"<(?P<tag>p|lg|l)>.*?</(?P=tag)>", re.DOTALL)
MARKER = re.compile(r"Dg_(\d+)\.(\d+)\s*=\s*DbhP_7,(\d+)\.(\d+)")


def normalize(node: ET.Element) -> str:
    return " ".join("".join(node.itertext()).split())


def strict_utf8(data: bytes, label: str) -> str:
    try:
        text = data.decode("utf-8", errors="strict")
    except UnicodeDecodeError as exc:
        raise ValueError(f"{label} is not strict UTF-8") from exc
    if text.encode("utf-8") != data:
        raise ValueError(f"{label} fails UTF-8 byte roundtrip")
    return text


def utf8_base64_sql(value: str) -> str:
    encoded = base64.b64encode(value.encode("utf-8")).decode("ascii")
    return f"convert_from(decode('{encoded}', 'base64'), 'UTF8')"


def catalog_row(path: Path, key: str, value: str) -> dict[str, str]:
    with path.open(encoding="utf-8-sig", newline="") as handle:
        rows = [row for row in csv.DictReader(handle) if row.get(key) == value]
    if len(rows) != 1:
        raise ValueError(f"Expected one catalog row for {key}={value}")
    return rows[0]


def validate_plan(plan: dict[str, Any]) -> None:
    if plan.get("contract") != CONTRACT or plan.get("source_copy_policy") != COPY_POLICY:
        raise ValueError("Contract or source-copy policy drift")
    if plan["provider"]["provider_item_id"] != "GRE-00088" or plan["provider"]["legacy_queue_id"] != "AQ-00712":
        raise ValueError("Provider route drift")
    identity = plan["identity"]
    if (identity["parent_work"], identity["parent_book"], identity["parent_chapter_start"], identity["parent_chapter_end"]) != ("Devībhāgavata Purāṇa", 7, 31, 40):
        raise ValueError("Devigita parent-work boundary drift")
    if identity["underlying_source_edition_identified"] is not False or identity["source_description_literal"] != "":
        raise ValueError("Unidentified source-edition boundary drift")
    if plan["rights"] != {
        "lane": "private_evidence",
        "license": "CC-BY-NC-SA-4.0",
        "required_literal": "Distributed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.",
        "status": "noncommercial_sharealike_internal_review_only",
        "product_clearance": False,
    }:
        raise ValueError("Rights boundary drift")
    if any(plan["completion_denials"].values()) or plan["expression"]["is_source_original"] or plan["expression"]["ai_generated"]:
        raise ValueError("Identity or completion denial drift")
    evidence = plan["catalog_evidence"]
    provider_path, lead_path = ROOT / evidence["provider_catalog_path"], ROOT / evidence["source_leads_path"]
    if sha256_bytes(provider_path.read_bytes()) != evidence["provider_catalog_sha256"] or sha256_bytes(lead_path.read_bytes()) != evidence["source_leads_sha256"]:
        raise ValueError("Catalog file drift")
    provider = catalog_row(provider_path, "gretil_item_id", evidence["provider_row_key"])
    lead = catalog_row(lead_path, "queue_id", evidence["source_lead_key"])
    if sha256_bytes(canonical_json(provider).encode()) != evidence["provider_row_sha256"] or sha256_bytes(canonical_json(lead).encode()) != evidence["source_lead_row_sha256"]:
        raise ValueError("Exact catalog row drift")
    if provider["downloadable_url_count"] != "3" or lead["source_record_id"] != "GRE-00088":
        raise ValueError("Three-representation catalog universe drift")


def extract_passages(tei: bytes, plan: dict[str, Any]) -> list[dict[str, Any]]:
    root = ET.fromstring(tei)
    identity, structure = plan["identity"], plan["structure"]
    title = root.find(".//tei:titleStmt/tei:title", TEI_NS)
    author = root.find(".//tei:titleStmt/tei:author", TEI_NS)
    source = root.find(".//tei:sourceDesc", TEI_NS)
    text = root.find(".//tei:text", TEI_NS)
    if title is None or normalize(title) != identity["tei_title"]:
        raise ValueError("TEI title drift")
    if author is None or normalize(author) != identity["tei_author_literal"]:
        raise ValueError("TEI author literal drift")
    if source is None or normalize(source) != identity["source_description_literal"]:
        raise ValueError("Source description drift")
    if root.get(XML_ID) != identity["tei_xml_id"] or text is None or text.get(XML_LANG) != identity["tei_language"]:
        raise ValueError("TEI root/text identity drift")
    availability = root.find(".//tei:availability", TEI_NS)
    if availability is None or plan["rights"]["required_literal"] not in normalize(availability):
        raise ValueError("License literal drift")
    responses = [normalize(node) for node in root.findall(".//tei:respStmt", TEI_NS)]
    expected_responses = [
        f"data entry {identity['data_entry']}", f"contribution to GRETIL {identity['gretil_contribution']}",
        f"initial normalization and conversion to legacy GRETIL formats {identity['legacy_normalization']}",
        f"normalization and conversion to TEI-conformant markup {identity['tei_conversion']}",
    ]
    if responses != expected_responses:
        raise ValueError("Contributor role/order drift")

    divs = root.findall(".//tei:text/tei:body/tei:div", TEI_NS)
    raw_divs = list(DIV_RAW.finditer(tei))
    profiles = structure["chapter_profiles"]
    if len(divs) != structure["source_div_count"] or len(raw_divs) != len(divs) or len(profiles) != 10:
        raise ValueError("Chapter div universe drift")
    passages, marker_rows, global_ordinal = [], [], 0
    observed_types = {"p": 0, "lg": 0, "l": 0}
    for chapter, (div, raw_div, profile) in enumerate(zip(divs, raw_divs, profiles, strict=True), 1):
        if profile["chapter"] != chapter or profile["parent_chapter"] != 30 + chapter:
            raise ValueError("Chapter profile order drift")
        if (raw_div.start(), raw_div.end(), sha256_bytes(raw_div.group())) != (profile["div_start"], profile["div_end_exclusive"], profile["div_span_sha256"]):
            raise ValueError(f"Chapter {chapter} raw div drift")
        children = list(div)
        raw_children = list(CHILD_RAW.finditer(raw_div.group()))
        if len(children) != profile["passage_count"] or len(raw_children) != len(children):
            raise ValueError(f"Chapter {chapter} source-element universe drift")
        chapter_passages, chapter_markers = [], []
        for chapter_ordinal, (child, raw_child) in enumerate(zip(children, raw_children, strict=True), 1):
            element = child.tag.split("}")[-1]
            if raw_child.group("tag").decode("ascii") != element or element not in observed_types:
                raise ValueError(f"Chapter {chapter} parsed/raw source-element order drift")
            observed_types[element] += 1
            exact_text = normalize(child)
            markers = [tuple(map(int, values)) for values in MARKER.findall(exact_text)]
            if len(markers) > 1:
                raise ValueError("A source element unexpectedly contains multiple verse markers")
            for marker in markers:
                if marker[0] != chapter or marker[2] != 30 + chapter or marker[1] != marker[3]:
                    raise ValueError(f"Devigita/parent marker crosswalk drift in chapter {chapter}")
                chapter_markers.append(marker)
                marker_rows.append(f"Dg_{marker[0]}.{marker[1]}=DbhP_7,{marker[2]}.{marker[3]}")
            global_ordinal += 1
            start, end = raw_div.start() + raw_child.start(), raw_div.start() + raw_child.end()
            if markers:
                role = "verse_source_element"
            elif "iti devīgītāyāṃ" in exact_text:
                role = "chapter_colophon"
            else:
                role = "prose_context"
            passage = {
                "source_ordinal": global_ordinal,
                "chapter": chapter,
                "locator": {
                    "contract": "DEVAM_GRETIL_TEI_SOURCE_ELEMENT_BYTE_SPAN_V1",
                    "devigita_chapter": chapter,
                    "devibhagavata_book": 7,
                    "devibhagavata_chapter": 30 + chapter,
                    "chapter_source_ordinal": chapter_ordinal,
                    "source_element": element,
                    "structural_role": role,
                    "literal_markers": [f"Dg_{a}.{b} = DbhP_7,{c}.{d}" for a, b, c, d in markers],
                    "byte_start": start,
                    "byte_end_exclusive": end,
                    "line_start": tei.count(b"\n", 0, start) + 1,
                    "line_end": tei.count(b"\n", 0, end) + 1,
                },
                "language_code": plan["expression"]["language_code"],
                "script_code": plan["expression"]["script_code"],
                "exact_text": exact_text,
                "span_sha256": sha256_bytes(tei[start:end]),
            }
            chapter_passages.append(passage)
            passages.append(passage)
        numbers = [marker[1] for marker in chapter_markers]
        observed = {
            "passage_count": len(chapter_passages), "direct_p_count": sum(p["locator"]["source_element"] == "p" for p in chapter_passages),
            "lg_count": sum(p["locator"]["source_element"] == "lg" for p in chapter_passages), "direct_l_count": sum(p["locator"]["source_element"] == "l" for p in chapter_passages),
            "verse_count": len(numbers),
        }
        if any(observed[key] != profile[key] for key in observed) or numbers != list(range(1, len(numbers) + 1)):
            raise ValueError(f"Chapter {chapter} count or verse sequence drift: {observed}")
        chapter_root = sha256_bytes("\n".join(
            f"{index}\t{row['span_sha256']}\t{sha256_bytes(row['exact_text'].encode())}" for index, row in enumerate(chapter_passages, 1)
        ).encode())
        if chapter_root != profile["passage_root_sha256"]:
            raise ValueError(f"Chapter {chapter} passage root drift")
    if observed_types != {"p": structure["direct_p_count"], "lg": structure["lg_count"], "l": structure["direct_l_count"]}:
        raise ValueError("Global source-element type counts drift")
    if len(passages) != structure["passage_count"] or len(marker_rows) != structure["verse_marker_count"]:
        raise ValueError("Global passage or marker count drift")
    if sha256_bytes("\n".join(marker_rows).encode()) != structure["verse_marker_root_sha256"]:
        raise ValueError("Global verse marker root drift")
    span_root = sha256_bytes("\n".join(f"{p['chapter']}:{p['locator']['chapter_source_ordinal']}\t{p['span_sha256']}" for p in passages).encode())
    content_root = sha256_bytes("\n".join(f"{p['chapter']}:{p['locator']['chapter_source_ordinal']}\t{p['span_sha256']}\t{sha256_bytes(p['exact_text'].encode())}" for p in passages).encode())
    if span_root != structure["source_child_span_root_sha256"] or content_root != structure["source_child_content_root_sha256"]:
        raise ValueError("Global source-element root drift")
    if structure["terminal_formula"] not in passages[-1]["exact_text"]:
        raise ValueError("Devigita terminal formula drift")
    return passages


def compile_packet(plan_path: Path) -> dict[str, Any]:
    plan = json.loads(plan_path.read_text(encoding="utf-8"))
    validate_plan(plan)
    sources = {row["role"]: row for row in plan["source_objects"]}
    if set(sources) != {"canonical_tei", "access_text", "access_html"} or len(sources) != 3:
        raise ValueError("Exact three-representation source universe drift")
    source_bytes = {role: read_verified_object(row) for role, row in sources.items()}
    for role, data in source_bytes.items():
        text = strict_utf8(data, role)
        if " ".join(plan["rights"]["required_literal"].split()) not in " ".join(text.split()):
            raise ValueError(f"License literal absent from {role}")
    observations = {row["role"]: row for row in plan["live_observations"]}
    if set(observations) != set(sources):
        raise ValueError("Live observation universe drift")
    for role, source in sources.items():
        if observations[role] != {"role": role, "status": 200, "final_url": source["source_url"], "bytes": source["bytes"], "sha256": source["sha256"], "strict_utf8": True, "license_evidence_present": True}:
            raise ValueError(f"Live observation drift for {role}")
    passages = extract_passages(source_bytes["canonical_tei"], plan)
    core = {**plan, "passages": passages, "source_object_count": 3, "passage_count": len(passages)}
    return {**core, "packet_sha256": sha256_bytes(canonical_json(core).encode())}


def compile_statements(packet: dict[str, Any]) -> list[str]:
    work, expression, edition, rights, structure = packet["work"], packet["expression"], packet["edition"], packet["rights"], packet["structure"]
    year_sql = "null" if edition["publication_year"] is None else str(edition["publication_year"])
    statements = [
        f"""insert into public.works (slug, canonical_title, work_kind, tradition_scope, summary, rights_lane, publication_state) values ({sql_quote(work['slug'])}, {sql_quote(work['canonical_title'])}, {sql_quote(work['work_kind'])}, array[{','.join(sql_quote(v) for v in work['tradition_scope'])}]::text[], {sql_quote(work['summary'])}, {sql_quote(rights['lane'])}, 'review') on conflict (slug) do update set canonical_title=excluded.canonical_title, work_kind=excluded.work_kind, tradition_scope=excluded.tradition_scope, summary=excluded.summary, rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;""",
        f"""insert into public.expressions (work_id, language_code, script_code, expression_kind, attribution, is_source_original, ai_generated, rights_lane, publication_state) select w.id, {sql_quote(expression['language_code'])}, {sql_quote(expression['script_code'])}, {sql_quote(expression['expression_kind'])}, {sql_quote(expression['attribution'])}, false, false, {sql_quote(rights['lane'])}, 'review' from public.works w where w.slug={sql_quote(work['slug'])} and not exists (select 1 from public.expressions e where e.work_id=w.id and e.language_code={sql_quote(expression['language_code'])} and e.expression_kind={sql_quote(expression['expression_kind'])} and e.attribution={sql_quote(expression['attribution'])});""",
        f"""update public.expressions e set script_code={sql_quote(expression['script_code'])}, is_source_original=false, ai_generated=false, rights_lane={sql_quote(rights['lane'])}, publication_state='review' from public.works w where e.work_id=w.id and w.slug={sql_quote(work['slug'])} and e.language_code={sql_quote(expression['language_code'])} and e.expression_kind={sql_quote(expression['expression_kind'])} and e.attribution={sql_quote(expression['attribution'])};""",
        f"""insert into public.editions (expression_id, edition_title, publisher, publication_place, publication_year, edition_statement, identifiers, rights_lane, publication_state) select e.id, {sql_quote(edition['edition_title'])}, {sql_quote(edition['publisher'])}, {sql_quote(edition['publication_place'])}, {year_sql}, {sql_quote(edition['edition_statement'])}, {json_sql(edition['identifiers'])}, {sql_quote(rights['lane'])}, 'review' from public.expressions e join public.works w on w.id=e.work_id where w.slug={sql_quote(work['slug'])} and e.language_code={sql_quote(expression['language_code'])} and e.expression_kind={sql_quote(expression['expression_kind'])} and e.attribution={sql_quote(expression['attribution'])} and not exists (select 1 from public.editions d where d.expression_id=e.id and d.edition_title={sql_quote(edition['edition_title'])});""",
    ]
    rights_basis = {**rights, "live_observations": packet["live_observations"]}
    for source in packet["source_objects"]:
        provenance = {"ingestion_contract": CONTRACT, "ingestion_pilot_id": packet["pilot_id"], "ingestion_packet_sha256": packet["packet_sha256"], "source_copy_policy": COPY_POLICY, "representation_role": source["role"], "object_path": source["object_path"], "source_identity": packet["identity"], "catalog_evidence": packet["catalog_evidence"], "completion_denials": packet["completion_denials"]}
        statements.append(f"""insert into public.source_objects (edition_id, sha256, byte_count, media_type, storage_backend, storage_bucket, storage_key, provider, provider_identifier, source_url, acquired_at, provenance, completeness_status, rights_lane, rights_basis) select d.id, {sql_quote(source['sha256'])}, {source['bytes']}, {sql_quote(source['media_type'])}, 'local_vault', null, {sql_quote(source['object_path'])}, 'GRETIL', {sql_quote('gretil:GRE-00088:' + source['role'])}, {sql_quote(source['source_url'])}, {sql_quote(packet['provider']['acquired_at'])}::timestamptz, {json_sql(provenance)}, {sql_quote(structure['edition_completeness_status'])}, {sql_quote(rights['lane'])}, {json_sql(rights_basis)} from public.editions d join public.expressions e on e.id=d.expression_id join public.works w on w.id=e.work_id where w.slug={sql_quote(work['slug'])} and e.language_code={sql_quote(expression['language_code'])} and e.expression_kind={sql_quote(expression['expression_kind'])} and e.attribution={sql_quote(expression['attribution'])} and d.edition_title={sql_quote(edition['edition_title'])} on conflict (sha256) do update set edition_id=excluded.edition_id, byte_count=excluded.byte_count, media_type=excluded.media_type, storage_backend=excluded.storage_backend, storage_bucket=excluded.storage_bucket, storage_key=excluded.storage_key, provider=excluded.provider, provider_identifier=excluded.provider_identifier, source_url=excluded.source_url, acquired_at=excluded.acquired_at, provenance=excluded.provenance, completeness_status=excluded.completeness_status, rights_lane=excluded.rights_lane, rights_basis=excluded.rights_basis;""")
    canonical_sha = next(row["sha256"] for row in packet["source_objects"] if row["role"] == "canonical_tei")
    for passage in packet["passages"]:
        statements.append(f"""insert into public.passages (source_object_id, source_ordinal, locator, language_code, script_code, exact_text, text_status, span_sha256, rights_lane, publication_state) select s.id, {passage['source_ordinal']}, {json_sql(passage['locator'])}, {sql_quote(passage['language_code'])}, {sql_quote(passage['script_code'])}, {utf8_base64_sql(passage['exact_text'])}, {sql_quote(structure['text_status'])}, {sql_quote(passage['span_sha256'])}, {sql_quote(rights['lane'])}, 'review' from public.source_objects s where s.sha256={sql_quote(canonical_sha)} on conflict (source_object_id, source_ordinal) do update set locator=excluded.locator, language_code=excluded.language_code, script_code=excluded.script_code, exact_text=excluded.exact_text, text_status=excluded.text_status, span_sha256=excluded.span_sha256, rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;""")
    return statements


def compile_sql(packet: dict[str, Any]) -> str:
    return "\n\n".join(["begin;", *compile_statements(packet), "commit;"]) + "\n"


def compile_batches(packet: dict[str, Any], max_chars: int = 28000) -> list[str]:
    statements = compile_statements(packet)
    metadata_count = 4 + packet["source_object_count"]
    batches = ["\n\n".join(["begin;", *statements[:4], "commit;"]) + "\n"]
    batches.extend("\n\n".join(["begin;", statement, "commit;"]) + "\n" for statement in statements[4:metadata_count])
    current, size = [], 0
    for statement in statements[metadata_count:]:
        if current and size + len(statement) > max_chars:
            batches.append("\n\n".join(["begin;", *current, "commit;"]) + "\n")
            current, size = [], 0
        current.append(statement); size += len(statement)
    if current:
        batches.append("\n\n".join(["begin;", *current, "commit;"]) + "\n")
    return batches


def passage_root(packet: dict[str, Any], include_locator: bool = True) -> str:
    rows = []
    for p in packet["passages"]:
        row = f"{p['source_ordinal']}\t{p['span_sha256']}\t{sha256_bytes(p['exact_text'].encode())}"
        if include_locator: row += f"\t{canonical_json(p['locator'])}"
        rows.append(row)
    return sha256_bytes("\n".join(rows).encode())


def main() -> int:
    parser = argparse.ArgumentParser(description="Compile the GRETIL Devigita packet.")
    parser.add_argument("--plan", required=True, type=Path)
    parser.add_argument("--format", choices=("report", "sql-batch"), default="report")
    parser.add_argument("--batch-index", type=int)
    args = parser.parse_args(); path = args.plan.resolve(strict=True)
    if not path.is_relative_to(ROOT / "ingestion" / "plans"): raise ValueError("Plan must be inside ingestion/plans")
    packet = compile_packet(path); sql = compile_sql(packet); batches = compile_batches(packet)
    if args.format == "sql-batch":
        if args.batch_index is None or not 0 <= args.batch_index < len(batches): raise ValueError("Invalid batch index")
        sys.stdout.write(batches[args.batch_index])
    else:
        print(json.dumps({"result": "PASS", "contract": CONTRACT, "pilot_id": packet["pilot_id"], "packet_sha256": packet["packet_sha256"], "sql_sha256": sha256_bytes(sql.encode()), "sql_batch_count": len(batches), "source_object_count": 3, "source_object_bytes": sum(row["bytes"] for row in packet["source_objects"]), "passage_count": packet["passage_count"], "verse_marker_count": packet["structure"]["verse_marker_count"], "passage_content_root_sha256": passage_root(packet), "hosted_text_span_root_sha256": passage_root(packet, False), "source_payloads_copied": False, **packet["completion_denials"]}, ensure_ascii=False, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__": raise SystemExit(main())

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
    TEI_NS,
    canonical_json,
    json_sql,
    read_verified_object,
    sha256_bytes,
    sql_quote,
)


CONTRACT = "DEVAM_GRETIL_SANSKRIT_EPIC_INGESTION_V1"
COPY_POLICY = "reference_only_no_duplicate_payload"
XML_ID = "{http://www.w3.org/XML/1998/namespace}id"
XML_LANG = "{http://www.w3.org/XML/1998/namespace}lang"
LG_RAW = re.compile(rb'<lg\s+xml:id="(R_\d+\.\d+\.\d+)"[^>]*>.*?</lg>', re.DOTALL)
ID_PATTERN = re.compile(r"R_(\d+)\.(\d+)\.(\d+)")
DCS_ID_PATTERN = re.compile(r"^# id = (R\.\d+\.\d+\.\d+)\s*$", re.MULTILINE)


def normalize(node: ET.Element) -> str:
    return " ".join("".join(node.itertext()).split())


def strict_utf8(data: bytes, label: str) -> str:
    try:
        value = data.decode("utf-8", errors="strict")
    except UnicodeDecodeError as exc:
        raise ValueError(f"{label} is not strict UTF-8") from exc
    if value.encode("utf-8") != data:
        raise ValueError(f"{label} fails UTF-8 byte roundtrip")
    return value


def dollar_quote(value: str) -> str:
    tag = f"$devam_{sha256_bytes(value.encode('utf-8'))[:16]}$"
    if tag in value:
        raise ValueError("Deterministic SQL dollar-quote tag collides with source text")
    return f"{tag}{value}{tag}"


def utf8_base64_sql(value: str) -> str:
    """Transport exact UTF-8 text through ASCII-only SQL without newline rewriting."""
    encoded = base64.b64encode(value.encode("utf-8")).decode("ascii")
    return f"convert_from(decode('{encoded}', 'base64'), 'UTF8')"


def validate_plan(plan: dict[str, Any]) -> None:
    if plan.get("contract") != CONTRACT or plan.get("source_copy_policy") != COPY_POLICY:
        raise ValueError("Contract or reference-only policy drift")
    if plan["rights"] != {
        "lane": "private_evidence",
        "license": "CC-BY-NC-SA-4.0",
        "required_literal": "Distributed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.",
        "status": "noncommercial_sharealike_internal_review_only",
    }:
        raise ValueError("Rights contract drift")
    if set(plan["completion_denials"]) != {
        "identified_print_or_manuscript_edition", "critical_edition",
        "complete_valmiki_ramayana_textual_tradition", "all_recensions_and_variants",
        "hindi_translation_present", "english_translation_present_in_this_expression",
        "ramayana_hero_universe_complete", "mvp_library_complete", "public_product_clearance",
    } or not all(value is False for value in plan["completion_denials"].values()):
        raise ValueError("Completion-denial contract drift")
    if plan["expression"]["is_source_original"] is not False or plan["expression"]["ai_generated"] is not False:
        raise ValueError("Electronic transcription identity drift")
    if plan["structure"]["publication_state"] != "review":
        raise ValueError("Packet must remain review-only")


def verify_related_dcs(plan: dict[str, Any], gretil_ids: list[str]) -> None:
    related = plan["related_dcs_source"]
    readme_path = ROOT / "source_vault" / "objects" / "sha256" / related["readme_sha256"][:2] / related["readme_sha256"]
    data_path = ROOT / "source_vault" / "objects" / "sha256" / related["data_sha256"][:2] / related["data_sha256"]
    if not readme_path.is_file() or sha256_bytes(readme_path.read_bytes()) != related["readme_sha256"]:
        raise ValueError("DCS README evidence drift")
    readme = strict_utf8(readme_path.read_bytes(), "DCS README")
    if "Source: Oliver Hellwig: Digital Corpus of Sanskrit (DCS). 2010-2021." not in readme or "License: CC-BY 4.0" not in readme:
        raise ValueError("DCS source/license literal drift")
    if not data_path.is_file() or sha256_bytes(data_path.read_bytes()) != related["data_sha256"]:
        raise ValueError("DCS Ramayana source drift")
    dcs_text = strict_utf8(data_path.read_bytes(), "DCS Ramayana")
    dcs_ids = DCS_ID_PATTERN.findall(dcs_text)
    if len(dcs_ids) != related["dcs_verse_id_count"] or len(dcs_ids) != len(set(dcs_ids)):
        raise ValueError("DCS verse ID count/uniqueness drift")
    if sha256_bytes("\n".join(dcs_ids).encode("utf-8")) != related["dcs_verse_id_root_sha256"]:
        raise ValueError("DCS verse ID root drift")
    normalized = [value.replace("R.", "R_").replace(".", ".", 1) for value in dcs_ids]
    # DCS uses R.1.1.1 while GRETIL pads sarga/verse fields. Compare numerically.
    dcs_tuples = [tuple(map(int, value[2:].split("."))) for value in dcs_ids]
    gretil_tuples = [tuple(map(int, ID_PATTERN.fullmatch(value).groups())) for value in gretil_ids]
    dcs_set = set(dcs_tuples)
    gretil_set = set(gretil_tuples)
    if not dcs_set.issubset(gretil_set) or len(gretil_set - dcs_set) != related["gretil_additional_verse_id_count"]:
        raise ValueError("DCS/GRETIL verse universe relationship drift")
    anomalies = sum(1 for left, right in zip(dcs_tuples, dcs_tuples[1:]) if right <= left)
    if anomalies != related["dcs_source_order_anomaly_count"]:
        raise ValueError("DCS source-order anomaly count drift")


def extract_sargas(tei_bytes: bytes, plan: dict[str, Any]) -> list[dict[str, Any]]:
    root = ET.fromstring(tei_bytes)
    title = root.find(".//tei:titleStmt/tei:title", TEI_NS)
    author = root.find(".//tei:titleStmt/tei:author", TEI_NS)
    source = root.find(".//tei:sourceDesc", TEI_NS)
    text = root.find(".//tei:text", TEI_NS)
    if title is None or normalize(title) != plan["identity"]["tei_title"]:
        raise ValueError("TEI title drift")
    if author is None or normalize(author) != plan["identity"]["tei_author"]:
        raise ValueError("TEI author drift")
    if source is None or normalize(source) != plan["identity"]["source_description_literal"]:
        raise ValueError("TEI source description drift")
    if text is None or text.get(XML_LANG) != plan["identity"]["tei_language"] or text.get(XML_ID) != plan["identity"]["text_xml_id"]:
        raise ValueError("TEI text language/ID drift")
    availability = root.find(".//tei:availability", TEI_NS)
    if availability is None or plan["rights"]["required_literal"] not in normalize(availability):
        raise ValueError("TEI rights literal drift")
    resp_values = [normalize(node) for node in root.findall(".//tei:respStmt", TEI_NS)]
    for literal in (
        f"data entry {plan['identity']['data_entry']}",
        f"first revision {plan['identity']['first_revision']}",
        f"contribution to GRETIL {plan['identity']['gretil_contribution']}",
    ):
        if literal not in resp_values:
            raise ValueError(f"Contributor role drift: {literal}")

    lg_nodes = root.findall(".//tei:lg", TEI_NS)
    raw_matches = list(LG_RAW.finditer(tei_bytes))
    structure = plan["structure"]
    if len(lg_nodes) != structure["verse_group_count"] or len(raw_matches) != len(lg_nodes):
        raise ValueError("Verse-group universe drift")
    ids = [node.get(XML_ID) for node in lg_nodes]
    raw_ids = [match.group(1).decode("ascii") for match in raw_matches]
    if ids != raw_ids or any(ID_PATTERN.fullmatch(value or "") is None for value in ids):
        raise ValueError("Parsed/raw verse ID order drift")
    if ids[0] != structure["first_verse_id"] or ids[-1] != structure["last_verse_id"]:
        raise ValueError("First/last verse ID drift")
    if sha256_bytes("\n".join(ids).encode("utf-8")) != structure["verse_id_root_sha256"]:
        raise ValueError("Verse ID root drift")
    if len(root.findall(".//tei:l", TEI_NS)) != structure["line_count"]:
        raise ValueError("Line count drift")

    grouped: collections.OrderedDict[tuple[int, int], list[tuple[ET.Element, re.Match[bytes], int]]] = collections.OrderedDict()
    for node, match, identifier in zip(lg_nodes, raw_matches, ids, strict=True):
        book, sarga, verse = map(int, ID_PATTERN.fullmatch(identifier).groups())
        grouped.setdefault((book, sarga), []).append((node, match, verse))
    if len(grouped) != structure["sarga_count"]:
        raise ValueError("Sarga universe drift")
    book_profiles = {row["book"]: row for row in structure["book_profiles"]}
    observed_profiles = []
    for book in range(1, 8):
        rows = [(key, value) for key, value in grouped.items() if key[0] == book]
        observed_profiles.append({
            "book": book,
            "sarga_count": len(rows),
            "verse_group_count": sum(len(value) for _, value in rows),
            "first_sarga": rows[0][0][1],
            "last_sarga": rows[-1][0][1],
        })
    if observed_profiles != structure["book_profiles"] or len(book_profiles) != 7:
        raise ValueError(f"Book profiles drift: {observed_profiles}")

    passages = []
    for (book, sarga), rows in grouped.items():
        verse_numbers = [row[2] for row in rows]
        if verse_numbers != list(range(1, verse_numbers[-1] + 1)):
            raise ValueError(f"Noncontiguous verse sequence at {book}.{sarga}")
        start = rows[0][1].start()
        end = rows[-1][1].end()
        exact_text = "\n".join(normalize(row[0]) for row in rows)
        passages.append({
            "source_ordinal": len(passages) + 1,
            "locator": {
                "contract": "DEVAM_GRETIL_TEI_SARGA_BYTE_SPAN_V1",
                "book": book,
                "sarga": sarga,
                "literal_locator": f"{book}.{sarga}",
                "first_verse_id": rows[0][0].get(XML_ID),
                "last_verse_id": rows[-1][0].get(XML_ID),
                "verse_group_count": len(rows),
                "verse_sequence_status": "literal_ids_contiguous",
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
    if plan["structure"]["terminal_verse_literal"] not in passages[-1]["exact_text"]:
        raise ValueError("Terminal verse literal drift")
    verify_related_dcs(plan, ids)
    return passages


def compile_packet(plan_path: Path) -> dict[str, Any]:
    plan = json.loads(plan_path.read_text(encoding="utf-8"))
    validate_plan(plan)
    sources = {row["role"]: row for row in plan["source_objects"]}
    if set(sources) != {"canonical_tei", "access_text", "access_html"} or len(plan["source_objects"]) != 3:
        raise ValueError("Exact three-representation source universe drift")
    source_bytes = {role: read_verified_object(row) for role, row in sources.items()}
    for role, data in source_bytes.items():
        text = strict_utf8(data, role)
        if " ".join(plan["rights"]["required_literal"].split()) not in " ".join(text.split()):
            raise ValueError(f"Rights literal absent from {role}")
    observations = {row["role"]: row for row in plan["live_observations"]}
    if set(observations) != set(sources) or len(observations) != 3:
        raise ValueError("Live observation universe drift")
    for role, source in sources.items():
        if observations[role] != {
            "role": role, "status": 200, "final_url": source["source_url"],
            "bytes": source["bytes"], "sha256": source["sha256"], "strict_utf8": True,
        }:
            raise ValueError(f"Live observation drift for {role}")
    passages = extract_sargas(source_bytes["canonical_tei"], plan)
    core = {**plan, "passages": passages, "source_object_count": 3, "passage_count": len(passages)}
    return {**core, "packet_sha256": sha256_bytes(canonical_json(core).encode("utf-8"))}


def compile_statements(packet: dict[str, Any]) -> list[str]:
    work, expression, edition = packet["work"], packet["expression"], packet["edition"]
    rights, structure = packet["rights"], packet["structure"]
    statements = [
        f"""insert into public.works (slug, canonical_title, work_kind, tradition_scope, summary, rights_lane, publication_state)
values ({sql_quote(work['slug'])}, {sql_quote(work['canonical_title'])}, {sql_quote(work['work_kind'])}, array[{','.join(sql_quote(value) for value in work['tradition_scope'])}]::text[], {sql_quote(work['summary'])}, {sql_quote(rights['lane'])}, 'review')
on conflict (slug) do update set canonical_title=excluded.canonical_title, work_kind=excluded.work_kind, tradition_scope=excluded.tradition_scope, summary=excluded.summary, rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;""",
        f"""insert into public.expressions (work_id, language_code, script_code, expression_kind, attribution, is_source_original, ai_generated, rights_lane, publication_state)
select w.id, {sql_quote(expression['language_code'])}, {sql_quote(expression['script_code'])}, {sql_quote(expression['expression_kind'])}, {sql_quote(expression['attribution'])}, false, false, {sql_quote(rights['lane'])}, 'review' from public.works w where w.slug={sql_quote(work['slug'])}
and not exists (select 1 from public.expressions e where e.work_id=w.id and e.language_code={sql_quote(expression['language_code'])} and e.expression_kind={sql_quote(expression['expression_kind'])} and e.attribution={sql_quote(expression['attribution'])});""",
        f"""update public.expressions e set script_code={sql_quote(expression['script_code'])}, is_source_original=false, ai_generated=false, rights_lane={sql_quote(rights['lane'])}, publication_state='review' from public.works w where e.work_id=w.id and w.slug={sql_quote(work['slug'])} and e.language_code={sql_quote(expression['language_code'])} and e.expression_kind={sql_quote(expression['expression_kind'])} and e.attribution={sql_quote(expression['attribution'])};""",
        f"""insert into public.editions (expression_id, edition_title, publisher, publication_place, publication_year, edition_statement, identifiers, rights_lane, publication_state)
select e.id, {sql_quote(edition['edition_title'])}, {sql_quote(edition['publisher'])}, {sql_quote(edition['publication_place'])}, {edition['publication_year']}, {sql_quote(edition['edition_statement'])}, {json_sql(edition['identifiers'])}, {sql_quote(rights['lane'])}, 'review' from public.expressions e join public.works w on w.id=e.work_id where w.slug={sql_quote(work['slug'])} and e.language_code={sql_quote(expression['language_code'])} and e.expression_kind={sql_quote(expression['expression_kind'])} and e.attribution={sql_quote(expression['attribution'])}
and not exists (select 1 from public.editions d where d.expression_id=e.id and d.edition_title={sql_quote(edition['edition_title'])});""",
    ]
    rights_basis = {**rights, "live_observations": packet["live_observations"]}
    for source in packet["source_objects"]:
        provenance = {
            "ingestion_contract": CONTRACT, "ingestion_pilot_id": packet["pilot_id"],
            "ingestion_packet_sha256": packet["packet_sha256"], "source_copy_policy": COPY_POLICY,
            "representation_role": source["role"], "object_path": source["object_path"],
            "source_identity": packet["identity"], "related_dcs_source": packet["related_dcs_source"],
            "completion_denials": packet["completion_denials"],
        }
        statements.append(f"""insert into public.source_objects (edition_id, sha256, byte_count, media_type, storage_backend, storage_bucket, storage_key, provider, provider_identifier, source_url, acquired_at, provenance, completeness_status, rights_lane, rights_basis)
select d.id, {sql_quote(source['sha256'])}, {source['bytes']}, {sql_quote(source['media_type'])}, 'local_vault', null, {sql_quote(source['object_path'])}, {sql_quote(packet['provider']['name'])}, {sql_quote('gretil:sa_rAmAyaNa:' + source['role'])}, {sql_quote(source['source_url'])}, {sql_quote(packet['provider']['acquired_at'])}::timestamptz, {json_sql(provenance)}, {sql_quote(structure['edition_completeness_status'])}, {sql_quote(rights['lane'])}, {json_sql(rights_basis)} from public.editions d join public.expressions e on e.id=d.expression_id join public.works w on w.id=e.work_id where w.slug={sql_quote(work['slug'])} and e.language_code={sql_quote(expression['language_code'])} and e.expression_kind={sql_quote(expression['expression_kind'])} and e.attribution={sql_quote(expression['attribution'])} and d.edition_title={sql_quote(edition['edition_title'])}
on conflict (sha256) do update set edition_id=excluded.edition_id, byte_count=excluded.byte_count, media_type=excluded.media_type, storage_backend=excluded.storage_backend, storage_bucket=excluded.storage_bucket, storage_key=excluded.storage_key, provider=excluded.provider, provider_identifier=excluded.provider_identifier, source_url=excluded.source_url, acquired_at=excluded.acquired_at, provenance=excluded.provenance, completeness_status=excluded.completeness_status, rights_lane=excluded.rights_lane, rights_basis=excluded.rights_basis;""")
    canonical_sha = next(row["sha256"] for row in packet["source_objects"] if row["role"] == "canonical_tei")
    for passage in packet["passages"]:
        statements.append(f"""insert into public.passages (source_object_id, source_ordinal, locator, language_code, script_code, exact_text, text_status, span_sha256, rights_lane, publication_state)
select s.id, {passage['source_ordinal']}, {json_sql(passage['locator'])}, {sql_quote(passage['language_code'])}, {sql_quote(passage['script_code'])}, {utf8_base64_sql(passage['exact_text'])}, {sql_quote(structure['text_status'])}, {sql_quote(passage['span_sha256'])}, {sql_quote(rights['lane'])}, 'review' from public.source_objects s where s.sha256={sql_quote(canonical_sha)}
on conflict (source_object_id, source_ordinal) do update set locator=excluded.locator, language_code=excluded.language_code, script_code=excluded.script_code, exact_text=excluded.exact_text, text_status=excluded.text_status, span_sha256=excluded.span_sha256, rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;""")
    return statements


def compile_sql(packet: dict[str, Any]) -> str:
    return "\n\n".join(["begin;", *compile_statements(packet), "commit;"]) + "\n"


def compile_batches(packet: dict[str, Any], max_passage_sql_chars: int = 28000) -> list[str]:
    statements = compile_statements(packet)
    metadata = statements[:4 + packet["source_object_count"]]
    passages = statements[4 + packet["source_object_count"]:]
    batches = ["\n\n".join(["begin;", *metadata, "commit;"]) + "\n"]
    current: list[str] = []
    current_chars = 0
    for statement in passages:
        if current and current_chars + len(statement) > max_passage_sql_chars:
            batches.append("\n\n".join(["begin;", *current, "commit;"]) + "\n")
            current, current_chars = [], 0
        current.append(statement)
        current_chars += len(statement)
    if current:
        batches.append("\n\n".join(["begin;", *current, "commit;"]) + "\n")
    return batches


def passage_root(packet: dict[str, Any], include_locator: bool = True) -> str:
    rows = []
    for passage in packet["passages"]:
        row = f"{passage['source_ordinal']}\t{passage['span_sha256']}\t{sha256_bytes(passage['exact_text'].encode('utf-8'))}"
        if include_locator:
            row += f"\t{canonical_json(passage['locator'])}"
        rows.append(row)
    return sha256_bytes("\n".join(rows).encode("utf-8"))


def main() -> int:
    parser = argparse.ArgumentParser(description="Compile the Tokunaga/Smith GRETIL Sanskrit Ramayana packet.")
    parser.add_argument("--plan", required=True, type=Path)
    parser.add_argument("--format", choices=("report", "sql-batch"), default="report")
    parser.add_argument("--batch-index", type=int)
    args = parser.parse_args()
    path = args.plan.resolve(strict=True)
    if not path.is_relative_to(ROOT / "ingestion" / "plans"):
        raise ValueError("Plan must be inside ingestion/plans")
    packet = compile_packet(path)
    sql = compile_sql(packet)
    batches = compile_batches(packet)
    if args.format == "sql-batch":
        if args.batch_index is None or not 0 <= args.batch_index < len(batches):
            raise ValueError("Invalid batch index")
        sys.stdout.write(batches[args.batch_index])
    else:
        print(json.dumps({
            "result": "PASS", "contract": CONTRACT, "pilot_id": packet["pilot_id"],
            "packet_sha256": packet["packet_sha256"], "sql_sha256": sha256_bytes(sql.encode("utf-8")),
            "sql_batch_count": len(batches), "source_object_count": packet["source_object_count"],
            "source_object_bytes": sum(row["bytes"] for row in packet["source_objects"]),
            "passage_count": packet["passage_count"], "verse_group_count": packet["structure"]["verse_group_count"],
            "passage_content_root_sha256": passage_root(packet),
            "hosted_text_span_root_sha256": passage_root(packet, include_locator=False),
            "source_payloads_copied": False, **packet["completion_denials"],
        }, ensure_ascii=False, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

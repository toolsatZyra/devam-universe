from __future__ import annotations

import argparse
import base64
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
    VAULT,
    TEI_NS,
    canonical_json,
    extract_passages,
    json_sql,
    read_verified_object,
    sha256_bytes,
    sql_quote,
    validate_append_only_vault,
)


CONTRACT = "DEVAM_SOURCE_VAULT_TEI_BATCH_INGESTION_V1"
SOURCE_COPY_POLICY = "reference_only_no_duplicate_payload"
EXPECTED_WORK_COUNT = 7
EXPECTED_SOURCE_COUNT = 14
EXPECTED_PASSAGE_COUNT = 80


def expected_counts(plan: dict[str, Any]) -> tuple[int, int, int]:
    counts = plan.get("expected_counts")
    if counts is None:
        return EXPECTED_WORK_COUNT, EXPECTED_SOURCE_COUNT, EXPECTED_PASSAGE_COUNT
    if set(counts) != {"work_count", "source_object_count", "passage_count"}:
        raise ValueError("Expected-count key set drift")
    values = (counts["work_count"], counts["source_object_count"], counts["passage_count"])
    if any(not isinstance(value, int) or value <= 0 for value in values):
        raise ValueError("Expected counts must be positive integers")
    return values


def nullable_sql(value: str | None) -> str:
    return "null" if value is None else sql_quote(value)


def strict_utf8(data: bytes, label: str) -> str:
    try:
        text = data.decode("utf-8", errors="strict")
    except UnicodeDecodeError as exc:
        raise ValueError(f"{label} is not strict UTF-8") from exc
    if text.encode("utf-8") != data:
        raise ValueError(f"{label} fails UTF-8 byte roundtrip")
    return text


def normalized_element_text(node: ET.Element) -> str:
    return " ".join("".join(node.itertext()).split())


def validate_live_observations(plan: dict[str, Any], slugs: list[str]) -> dict[str, dict[str, Any]]:
    rows = plan["live_rights_observations"]
    expected_work_count, _, _ = expected_counts(plan)
    if len(rows) != expected_work_count:
        raise ValueError("Live rights observation count drift")
    by_slug: dict[str, dict[str, Any]] = {}
    for row in rows:
        slug = row["slug"]
        if slug in by_slug:
            raise ValueError(f"Duplicate live observation for {slug}")
        expected_url = f"https://ambuda.org/texts/{slug}/about"
        if row["url"] != expected_url or row["final_url"] != expected_url:
            raise ValueError(f"Live URL identity drift for {slug}")
        if row["status"] != 200 or row["bytes"] <= 0:
            raise ValueError(f"Live observation failed for {slug}")
        if row["strict_utf8"] is not True or row["cc0_literal_present"] is not True:
            raise ValueError(f"Live encoding or rights evidence failed for {slug}")
        if not re.fullmatch(r"[0-9a-f]{64}", row["sha256"]):
            raise ValueError(f"Invalid live SHA-256 for {slug}")
        by_slug[slug] = row
    if sorted(by_slug) != sorted(slugs):
        raise ValueError("Live observation/work slug universe mismatch")
    return by_slug


def validate_work(plan: dict[str, Any], work: dict[str, Any]) -> dict[str, Any]:
    slug = work["slug"]
    work_kind = plan.get("required_work_kind", "stotra")
    tradition_member = plan.get("required_tradition_scope_member", "ganesha")
    if work["work_kind"] != work_kind or tradition_member not in work["tradition_scope"]:
        raise ValueError(f"Work scope drift for {slug}")
    expression = work["expression"]
    if expression != {
        "language_code": "sa",
        "script_code": "Deva",
        "expression_kind": "electronic_transcription",
        "attribution": "Ambuda; machine-readable version by Arun Prasad",
        "is_source_original": False,
        "ai_generated": False,
    }:
        raise ValueError(f"Expression identity drift for {slug}")
    structure = work["structure"]
    if structure["publication_state"] != "review" or structure["text_status"] != "tei_extracted_unreviewed":
        raise ValueError(f"Review-state boundary drift for {slug}")
    if "structure_authority_unresolved" not in structure["completeness_status"]:
        raise ValueError(f"Completeness uncertainty is absent for {slug}")

    sources = {item["role"]: item for item in work["source_objects"]}
    if set(sources) != {"canonical_tei", "access_text"} or len(work["source_objects"]) != 2:
        raise ValueError(f"Source universe must be exactly TEI plus access text for {slug}")
    tei_bytes = read_verified_object(sources["canonical_tei"])
    access_bytes = read_verified_object(sources["access_text"])
    access_text = strict_utf8(access_bytes, f"{slug} access text")
    identity = work["identity"]
    required_headers = (
        f"# title: {identity['access_title']}",
        f"# slug: {slug}",
        "# language: sa",
        f"# license: {plan['rights']['required_literal']}",
    )
    for literal in required_headers:
        if literal not in access_text.splitlines()[:16]:
            raise ValueError(f"Missing exact access-text header for {slug}: {literal}")

    root = ET.fromstring(tei_bytes)
    title_nodes = root.findall('.//tei:title[@type="main"]', TEI_NS)
    if len(title_nodes) != 1 or normalized_element_text(title_nodes[0]) != identity["main_title"]:
        raise ValueError(f"TEI main-title identity drift for {slug}")
    text_nodes = root.findall(".//tei:text", TEI_NS)
    xml_id_key = "{http://www.w3.org/XML/1998/namespace}id"
    lang_key = "{http://www.w3.org/XML/1998/namespace}lang"
    if len(text_nodes) != 1 or text_nodes[0].get(xml_id_key) != identity["text_xml_id"]:
        raise ValueError(f"TEI xml:id identity drift for {slug}")
    if text_nodes[0].get(lang_key) != identity["language_code"]:
        raise ValueError(f"TEI language identity drift for {slug}")
    trailers = [normalized_element_text(node) for node in root.findall(".//tei:trailer", TEI_NS)]
    expected_trailer = identity["trailer"]
    if trailers != ([] if expected_trailer is None else [expected_trailer]):
        raise ValueError(f"Trailer identity drift for {slug}")
    if structure["terminal_formula_observed"] is not (expected_trailer is not None):
        raise ValueError(f"Terminal observation drift for {slug}")

    shim = {
        "rights": plan["rights"],
        "structure": structure,
        "expression": expression,
    }
    passages = extract_passages(tei_bytes, shim)
    if [passage["source_ordinal"] for passage in passages] != list(range(1, structure["expected_observed_units"] + 1)):
        raise ValueError(f"Passage order drift for {slug}")
    if structure["expected_literal_markers"] != [1, len(passages)]:
        raise ValueError(f"Marker boundary drift for {slug}")
    return {
        **work,
        "passages": passages,
        "source_object_count": len(sources),
        "passage_count": len(passages),
    }


def compile_packet(plan_path: Path) -> dict[str, Any]:
    plan = json.loads(plan_path.read_text(encoding="utf-8"))
    if plan.get("contract") != CONTRACT:
        raise ValueError(f"Unsupported batch contract: {plan.get('contract')}")
    if plan.get("source_copy_policy") != SOURCE_COPY_POLICY:
        raise ValueError("Source-copy policy must remain reference-only")
    rights = plan["rights"]
    if rights["lane"] != "derivative_allowed" or rights["license"] != "CC0-1.0":
        raise ValueError("Rights lane or license drift")
    if rights["status"] != "rights_supported_structure_unresolved":
        raise ValueError("Rights/structure status drift")

    validate_append_only_vault(plan["vault"])

    works = plan["works"]
    expected_work_count, expected_source_count, expected_passage_count = expected_counts(plan)
    if len(works) != expected_work_count:
        raise ValueError("Work count drift")
    slugs = [work["slug"] for work in works]
    if len(set(slugs)) != expected_work_count or slugs != sorted(slugs):
        raise ValueError("Work slugs must be unique and canonically sorted")
    validate_live_observations(plan, slugs)
    compiled_works = [validate_work(plan, work) for work in works]

    source_hashes = [source["sha256"] for work in compiled_works for source in work["source_objects"]]
    if len(source_hashes) != expected_source_count or len(set(source_hashes)) != expected_source_count:
        raise ValueError("Source-object count or uniqueness drift")
    total_passages = sum(work["passage_count"] for work in compiled_works)
    if total_passages != expected_passage_count:
        raise ValueError(f"Expected {expected_passage_count} passages, found {total_passages}")

    coverage_theme = plan.get("coverage_theme", "ganesha")
    if not re.fullmatch(r"[a-z][a-z0-9_]*", coverage_theme):
        raise ValueError("Invalid coverage theme")

    core = {
        "contract": CONTRACT,
        "batch_id": plan["batch_id"],
        "source_copy_policy": SOURCE_COPY_POLICY,
        "provider": plan["provider"],
        "rights": rights,
        "vault": plan["vault"],
        "live_rights_observations": plan["live_rights_observations"],
        "works": compiled_works,
        "work_count": len(compiled_works),
        "source_object_count": len(source_hashes),
        "passage_count": total_passages,
        f"broad_{coverage_theme}_coverage_complete": False,
        "mvp_library_complete": False,
    }
    if "coverage_theme" in plan:
        core["coverage_theme"] = coverage_theme
    return {**core, "packet_sha256": sha256_bytes(canonical_json(core).encode("utf-8"))}


def compile_sql(packet: dict[str, Any]) -> str:
    rights = packet["rights"]
    provider = packet["provider"]
    statements = ["begin;"]
    rights_basis = {
        "license": rights["license"],
        "literal": rights["required_literal"],
        "status": rights["status"],
        "live_observations": packet["live_rights_observations"],
    }
    for work in packet["works"]:
        expression = work["expression"]
        edition = work["edition"]
        structure = work["structure"]
        statements.append(
            f"""insert into public.works (slug, canonical_title, work_kind, tradition_scope, summary, rights_lane, publication_state)
values ({sql_quote(work['slug'])}, {sql_quote(work['canonical_title'])}, {sql_quote(work['work_kind'])}, array[{','.join(sql_quote(v) for v in work['tradition_scope'])}]::text[], {sql_quote(work['summary'])}, {sql_quote(rights['lane'])}, {sql_quote(structure['publication_state'])})
on conflict (slug) do update set canonical_title = excluded.canonical_title, work_kind = excluded.work_kind, tradition_scope = excluded.tradition_scope, summary = excluded.summary, rights_lane = excluded.rights_lane, publication_state = excluded.publication_state;"""
        )
        statements.append(
            f"""insert into public.expressions (work_id, language_code, script_code, expression_kind, attribution, is_source_original, ai_generated, rights_lane, publication_state)
select w.id, {sql_quote(expression['language_code'])}, {sql_quote(expression['script_code'])}, {sql_quote(expression['expression_kind'])}, {sql_quote(expression['attribution'])}, false, false, {sql_quote(rights['lane'])}, {sql_quote(structure['publication_state'])}
from public.works w where w.slug = {sql_quote(work['slug'])}
and not exists (select 1 from public.expressions e where e.work_id = w.id and e.language_code = {sql_quote(expression['language_code'])} and e.expression_kind = {sql_quote(expression['expression_kind'])} and e.attribution = {sql_quote(expression['attribution'])});"""
        )
        statements.append(
            f"""update public.expressions e
set script_code = {sql_quote(expression['script_code'])}, is_source_original = false, ai_generated = false, rights_lane = {sql_quote(rights['lane'])}, publication_state = {sql_quote(structure['publication_state'])}
from public.works w
where e.work_id = w.id and w.slug = {sql_quote(work['slug'])} and e.language_code = {sql_quote(expression['language_code'])} and e.expression_kind = {sql_quote(expression['expression_kind'])} and e.attribution = {sql_quote(expression['attribution'])};"""
        )
        statements.append(
            f"""insert into public.editions (expression_id, edition_title, publisher, publication_place, publication_year, edition_statement, identifiers, rights_lane, publication_state)
select e.id, {sql_quote(edition['edition_title'])}, {sql_quote(edition['publisher'])}, {nullable_sql(edition['publication_place'])}, {edition['publication_year']}, {sql_quote(edition['edition_statement'])}, {json_sql(edition['identifiers'])}, {sql_quote(rights['lane'])}, {sql_quote(structure['publication_state'])}
from public.expressions e join public.works w on w.id = e.work_id
where w.slug = {sql_quote(work['slug'])} and e.language_code = {sql_quote(expression['language_code'])} and e.expression_kind = {sql_quote(expression['expression_kind'])} and e.attribution = {sql_quote(expression['attribution'])}
and not exists (select 1 from public.editions d where d.expression_id = e.id and d.edition_title = {sql_quote(edition['edition_title'])} and d.publication_year = {edition['publication_year']});"""
        )
        provenance_base = {
            "ingestion_contract": CONTRACT,
            "ingestion_batch_id": packet["batch_id"],
            "ingestion_packet_sha256": packet["packet_sha256"],
            "source_vault": packet["vault"],
            "live_rights_observation": next(row for row in packet["live_rights_observations"] if row["slug"] == work["slug"]),
            "source_copy_policy": SOURCE_COPY_POLICY,
            "source_identity": work["identity"],
        }
        for source in work["source_objects"]:
            provenance = {**provenance_base, "representation_role": source["role"], "object_path": source["object_path"]}
            statements.append(
                f"""insert into public.source_objects (edition_id, sha256, byte_count, media_type, storage_backend, storage_bucket, storage_key, provider, provider_identifier, source_url, acquired_at, provenance, completeness_status, rights_lane, rights_basis)
select d.id, {sql_quote(source['sha256'])}, {source['bytes']}, {sql_quote(source['media_type'])}, 'local_vault', null, {sql_quote(source['object_path'])}, {sql_quote(provider['name'])}, {sql_quote(work['slug'] + ':' + source['role'])}, {sql_quote('https://ambuda.org/texts/' + work['slug'] + '/about')}, {sql_quote(provider['acquired_at'])}::timestamptz, {json_sql(provenance)}, {sql_quote(structure['completeness_status'])}, {sql_quote(rights['lane'])}, {json_sql(rights_basis)}
from public.editions d join public.expressions e on e.id = d.expression_id join public.works w on w.id = e.work_id
where w.slug = {sql_quote(work['slug'])} and d.edition_title = {sql_quote(edition['edition_title'])}
on conflict (sha256) do update set edition_id = excluded.edition_id, byte_count = excluded.byte_count, media_type = excluded.media_type, storage_backend = excluded.storage_backend, storage_bucket = excluded.storage_bucket, storage_key = excluded.storage_key, provider = excluded.provider, provider_identifier = excluded.provider_identifier, source_url = excluded.source_url, acquired_at = excluded.acquired_at, provenance = excluded.provenance, completeness_status = excluded.completeness_status, rights_lane = excluded.rights_lane, rights_basis = excluded.rights_basis;"""
            )
        canonical_sha = next(source["sha256"] for source in work["source_objects"] if source["role"] == "canonical_tei")
        for passage in work["passages"]:
            statements.append(
                f"""insert into public.passages (source_object_id, source_ordinal, locator, language_code, script_code, exact_text, text_status, span_sha256, rights_lane, publication_state)
select s.id, {passage['source_ordinal']}, {json_sql(passage['locator'])}, {sql_quote(passage['language_code'])}, {sql_quote(passage['script_code'])}, {sql_quote(passage['exact_text'])}, {sql_quote(structure['text_status'])}, {sql_quote(passage['span_sha256'])}, {sql_quote(rights['lane'])}, {sql_quote(structure['publication_state'])}
from public.source_objects s where s.sha256 = {sql_quote(canonical_sha)}
on conflict (source_object_id, source_ordinal) do update set locator = excluded.locator, language_code = excluded.language_code, script_code = excluded.script_code, exact_text = excluded.exact_text, text_status = excluded.text_status, span_sha256 = excluded.span_sha256, rights_lane = excluded.rights_lane, publication_state = excluded.publication_state;"""
            )
    statements.append("commit;")
    return "\n\n".join(statements) + "\n"


def compile_sql_batches(sql: str, batch_size: int = 12) -> list[str]:
    parts = sql.strip().split("\n\n")
    if parts[0] != "begin;" or parts[-1] != "commit;":
        raise ValueError("Compiled SQL transaction boundary is invalid")
    statements = parts[1:-1]
    return [
        "\n\n".join(["begin;", *statements[index:index + batch_size], "commit;"]) + "\n"
        for index in range(0, len(statements), batch_size)
    ]


def passage_root(packet: dict[str, Any]) -> str:
    rows = []
    for work in packet["works"]:
        for passage in work["passages"]:
            rows.append(
                f"{work['slug']}\t{passage['source_ordinal']}\t{passage['span_sha256']}\t"
                f"{sha256_bytes(passage['exact_text'].encode('utf-8'))}"
            )
    return sha256_bytes("\n".join(rows).encode("utf-8"))


def source_inventory_root(packet: dict[str, Any]) -> str:
    rows: list[tuple[str, str]] = []
    for work in packet["works"]:
        for source in work["source_objects"]:
            rows.append((
                f"{work['slug']}\t{source['role']}",
                f"{work['slug']}\t{source['role']}\t{source['sha256']}\t{source['bytes']}\t"
                f"{source['media_type']}\t{source['object_path']}",
            ))
    return sha256_bytes("\n".join(row for _, row in sorted(rows)).encode("utf-8"))


def main() -> int:
    parser = argparse.ArgumentParser(description="Compile a verified multi-work Ambuda TEI ingestion packet.")
    parser.add_argument("--plan", required=True, type=Path)
    parser.add_argument("--format", choices=("report", "sql-base64", "sql-batch-base64"), default="report")
    parser.add_argument("--batch-index", type=int)
    args = parser.parse_args()
    plan_path = args.plan.resolve(strict=True)
    if not plan_path.is_relative_to(ROOT / "ingestion" / "plans"):
        raise ValueError("Plan must be inside ingestion/plans")
    packet = compile_packet(plan_path)
    sql = compile_sql(packet)
    batches = compile_sql_batches(sql)
    if args.format == "sql-base64":
        sys.stdout.write(base64.b64encode(sql.encode("utf-8")).decode("ascii"))
    elif args.format == "sql-batch-base64":
        if args.batch_index is None or not 0 <= args.batch_index < len(batches):
            raise ValueError(f"--batch-index must be between 0 and {len(batches) - 1}")
        sys.stdout.write(base64.b64encode(batches[args.batch_index].encode("utf-8")).decode("ascii"))
    else:
        report = {
            "result": "PASS",
            "contract": CONTRACT,
            "batch_id": packet["batch_id"],
            "packet_sha256": packet["packet_sha256"],
            "sql_sha256": sha256_bytes(sql.encode("utf-8")),
            "sql_batch_count": len(batches),
            "sql_batch_sha256": [sha256_bytes(batch.encode("utf-8")) for batch in batches],
            "work_count": packet["work_count"],
            "source_object_count": packet["source_object_count"],
            "source_object_bytes": sum(source["bytes"] for work in packet["works"] for source in work["source_objects"]),
            "source_inventory_root_sha256": source_inventory_root(packet),
            "passage_count": packet["passage_count"],
            "passage_content_root_sha256": passage_root(packet),
            "work_passage_counts": {work["slug"]: work["passage_count"] for work in packet["works"]},
            "all_expressions_are_transcriptions": all(not work["expression"]["is_source_original"] for work in packet["works"]),
            "all_records_remain_review_only": all(work["structure"]["publication_state"] == "review" for work in packet["works"]),
            "source_payloads_copied": False,
            f"broad_{packet.get('coverage_theme', 'ganesha')}_coverage_complete": False,
            "mvp_library_complete": False,
        }
        if "coverage_theme" in packet:
            report["coverage_theme"] = packet["coverage_theme"]
        print(json.dumps(report, ensure_ascii=False, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

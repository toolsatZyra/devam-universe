from __future__ import annotations

import argparse
import base64
import hashlib
import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
VAULT = ROOT / "source_vault"
CONTRACT = "DEVAM_SOURCE_VAULT_TEI_INGESTION_V1"
TEI_NS = {"tei": "http://www.tei-c.org/ns/1.0"}


def canonical_json(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def read_verified_object(record: dict[str, Any]) -> bytes:
    relative = Path(record["object_path"])
    if relative.is_absolute() or ".." in relative.parts or relative.parts[:2] != ("objects", "sha256"):
        raise ValueError(f"Unsafe object path: {relative}")
    path = (VAULT / relative).resolve(strict=True)
    if not path.is_relative_to(VAULT.resolve()):
        raise ValueError(f"Object escapes source vault: {relative}")
    data = path.read_bytes()
    if len(data) != record["bytes"]:
        raise ValueError(f"Byte mismatch for {relative}: {len(data)} != {record['bytes']}")
    actual = sha256_bytes(data)
    if actual != record["sha256"]:
        raise ValueError(f"SHA-256 mismatch for {relative}: {actual}")
    if actual not in path.name:
        raise ValueError(f"Content-addressed path mismatch for {relative}")
    return data


def sql_quote(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def json_sql(value: Any) -> str:
    return f"{sql_quote(canonical_json(value))}::jsonb"


def source_text_without_note_anchors(node: ET.Element) -> str:
    """Extract source text while excluding editorial footnote-anchor labels.

    The immutable TEI byte span remains the citation authority. Ambuda encodes
    printed note callouts as ``<ref type="noteAnchor">N</ref>`` inside a line;
    the anchor label is editorial apparatus, not a Sanskrit character in the
    work. Child tails are retained exactly so removing the label does not remove
    the surrounding source text.
    """
    parts: list[str] = []

    def visit(element: ET.Element) -> None:
        if element.text:
            parts.append(element.text)
        for child in element:
            is_note_anchor = child.tag == f"{{{TEI_NS['tei']}}}ref" and child.get("type") == "noteAnchor"
            if not is_note_anchor:
                visit(child)
            if child.tail:
                if is_note_anchor and parts and not parts[-1][-1].isspace() and not child.tail[0].isspace():
                    parts.append(" ")
                parts.append(child.tail)

    visit(node)
    return "".join(parts).strip()


def extract_passages(tei_bytes: bytes, plan: dict[str, Any]) -> list[dict[str, Any]]:
    root = ET.fromstring(tei_bytes)
    license_text = " ".join(
        " ".join("".join(node.itertext()).split())
        for node in root.findall(".//tei:availability", TEI_NS)
    )
    required_license = plan["rights"]["required_literal"]
    if required_license not in license_text:
        raise ValueError("Required CC0 license literal is absent from the TEI header.")

    elements = root.findall(".//tei:lg", TEI_NS)
    expected_count = plan["structure"]["expected_observed_units"]
    if len(elements) != expected_count:
        raise ValueError(f"Expected {expected_count} TEI lg elements, found {len(elements)}")
    markers = [element.get("n") for element in elements]
    expected_markers = [str(value) for value in range(1, expected_count + 1)]
    if markers != expected_markers:
        raise ValueError(f"Literal lg markers are not exactly 1..{expected_count}: {markers}")

    byte_matches = list(re.finditer(rb'<lg\s+n="([^"]+)"[^>]*>.*?</lg>', tei_bytes, re.DOTALL))
    if len(byte_matches) != expected_count:
        raise ValueError(f"Expected {expected_count} exact byte spans, found {len(byte_matches)}")

    passages: list[dict[str, Any]] = []
    for ordinal, (element, match) in enumerate(zip(elements, byte_matches, strict=True), start=1):
        marker = match.group(1).decode("ascii")
        if marker != str(ordinal) or element.get("n") != marker:
            raise ValueError(f"Element/byte marker mismatch at ordinal {ordinal}")
        lines = [source_text_without_note_anchors(line) for line in element.findall("tei:l", TEI_NS)]
        if not lines or any(not line for line in lines):
            raise ValueError(f"Empty extracted line in unit {ordinal}")
        start, end = match.span()
        raw_span = tei_bytes[start:end]
        passages.append(
            {
                "source_ordinal": ordinal,
                "locator": {
                    "contract": "DEVAM_TEI_BYTE_SPAN_V1",
                    "element": "lg",
                    "literal_marker": marker,
                    "byte_start": start,
                    "byte_end_exclusive": end,
                    "line_start": tei_bytes.count(b"\n", 0, start) + 1,
                    "line_end": tei_bytes.count(b"\n", 0, end) + 1,
                },
                "language_code": plan["expression"]["language_code"],
                "script_code": plan["expression"]["script_code"],
                "exact_text": "\n".join(lines),
                "span_sha256": sha256_bytes(raw_span),
            }
        )
    return passages


def validate_append_only_vault(baseline: dict[str, Any]) -> dict[str, Any]:
    """Validate the current vault while allowing legitimate append-only growth.

    A packet's original vault snapshot is historical provenance, not a lock on
    the global library. Exact packet objects are still rehashed separately.
    """
    summary_bytes = (VAULT / "summary.json").read_bytes()
    summary = json.loads(summary_bytes.decode("utf-8", errors="strict"))
    if summary.get("contract") != "DEVAM_LEAN_SOURCE_VAULT_V1":
        raise ValueError("Unexpected source-vault contract")
    if summary.get("object_count", 0) < baseline["object_count"] or summary.get("object_bytes", 0) < baseline["object_bytes"]:
        raise ValueError("Source vault is smaller than the packet's historical baseline")
    if sha256_bytes((VAULT / "objects.jsonl").read_bytes()) != summary["objects_manifest_sha256"]:
        raise ValueError("Current objects manifest does not match current vault summary")
    if sha256_bytes((VAULT / "provenance-map.jsonl").read_bytes()) != summary["provenance_map_sha256"]:
        raise ValueError("Current provenance map does not match current vault summary")
    for key in ("objects_manifest_sha256", "provenance_map_sha256", "summary_sha256"):
        if not isinstance(baseline.get(key), str) or len(baseline[key]) != 64:
            raise ValueError(f"Historical vault baseline field is invalid: {key}")
    return summary


def compile_packet(plan_path: Path) -> dict[str, Any]:
    plan = json.loads(plan_path.read_text(encoding="utf-8"))
    if plan.get("contract") != CONTRACT:
        raise ValueError(f"Unsupported ingestion contract: {plan.get('contract')}")

    validate_append_only_vault(plan["vault"])

    sources = {item["role"]: item for item in plan["source_objects"]}
    if set(sources) != {"canonical_tei", "access_text"}:
        raise ValueError("Pilot requires exactly canonical_tei and access_text source objects")
    tei_bytes = read_verified_object(sources["canonical_tei"])
    read_verified_object(sources["access_text"])
    for evidence in plan["retained_evidence"]:
        read_verified_object(evidence)

    passages = extract_passages(tei_bytes, plan)
    packet_core = {
        "contract": CONTRACT,
        "pilot_id": plan["pilot_id"],
        "work": plan["work"],
        "expression": plan["expression"],
        "edition": plan["edition"],
        "source_objects": plan["source_objects"],
        "provider": plan["provider"],
        "rights": plan["rights"],
        "structure": plan["structure"],
        "retained_evidence": plan["retained_evidence"],
        "vault": plan["vault"],
        "live_rights_observations": plan["live_rights_observations"],
        "passages": passages,
    }
    packet_hash = sha256_bytes(canonical_json(packet_core).encode("utf-8"))
    return {**packet_core, "packet_sha256": packet_hash}


def compile_sql(packet: dict[str, Any]) -> str:
    work = packet["work"]
    expression = packet["expression"]
    edition = packet["edition"]
    provider = packet["provider"]
    rights = packet["rights"]
    structure = packet["structure"]
    provenance_base = {
        "ingestion_contract": CONTRACT,
        "ingestion_pilot_id": packet["pilot_id"],
        "ingestion_packet_sha256": packet["packet_sha256"],
        "source_vault": packet["vault"],
        "retained_evidence": packet["retained_evidence"],
        "live_rights_observations": packet["live_rights_observations"],
        "source_copy_policy": "reference_only_no_duplicate_payload",
    }
    rights_basis = {
        "license": rights["license"],
        "literal": rights["required_literal"],
        "status": rights["status"],
        "evidence": packet["retained_evidence"],
        "live_observations": packet["live_rights_observations"],
    }

    statements = [
        "begin;",
        f"""insert into public.works (slug, canonical_title, work_kind, tradition_scope, summary, rights_lane, publication_state)
values ({sql_quote(work['slug'])}, {sql_quote(work['canonical_title'])}, {sql_quote(work['work_kind'])}, array[{','.join(sql_quote(v) for v in work['tradition_scope'])}]::text[], null, {sql_quote(rights['lane'])}, {sql_quote(structure['publication_state'])})
on conflict (slug) do update set canonical_title = excluded.canonical_title, work_kind = excluded.work_kind, tradition_scope = excluded.tradition_scope, rights_lane = excluded.rights_lane, publication_state = excluded.publication_state;""",
        f"""insert into public.expressions (work_id, language_code, script_code, expression_kind, attribution, is_source_original, ai_generated, rights_lane, publication_state)
select w.id, {sql_quote(expression['language_code'])}, {sql_quote(expression['script_code'])}, {sql_quote(expression['expression_kind'])}, {sql_quote(expression['attribution'])}, {str(expression['is_source_original']).lower()}, {str(expression['ai_generated']).lower()}, {sql_quote(rights['lane'])}, {sql_quote(structure['publication_state'])}
from public.works w where w.slug = {sql_quote(work['slug'])}
and not exists (select 1 from public.expressions e where e.work_id = w.id and e.language_code = {sql_quote(expression['language_code'])} and e.expression_kind = {sql_quote(expression['expression_kind'])} and e.attribution = {sql_quote(expression['attribution'])});""",
        f"""update public.expressions e
set script_code = {sql_quote(expression['script_code'])}, is_source_original = {str(expression['is_source_original']).lower()}, ai_generated = {str(expression['ai_generated']).lower()}, rights_lane = {sql_quote(rights['lane'])}, publication_state = {sql_quote(structure['publication_state'])}
from public.works w
where e.work_id = w.id and w.slug = {sql_quote(work['slug'])} and e.language_code = {sql_quote(expression['language_code'])} and e.expression_kind = {sql_quote(expression['expression_kind'])} and e.attribution = {sql_quote(expression['attribution'])};""",
        f"""insert into public.editions (expression_id, edition_title, publisher, publication_place, publication_year, edition_statement, identifiers, rights_lane, publication_state)
select e.id, {sql_quote(edition['edition_title'])}, {sql_quote(edition['publisher'])}, {sql_quote(edition['publication_place'])}, {edition['publication_year']}, {sql_quote(edition['edition_statement'])}, {json_sql(edition['identifiers'])}, {sql_quote(rights['lane'])}, {sql_quote(structure['publication_state'])}
from public.expressions e join public.works w on w.id = e.work_id
where w.slug = {sql_quote(work['slug'])} and e.language_code = {sql_quote(expression['language_code'])} and e.expression_kind = {sql_quote(expression['expression_kind'])} and e.attribution = {sql_quote(expression['attribution'])}
and not exists (select 1 from public.editions d where d.expression_id = e.id and d.edition_title = {sql_quote(edition['edition_title'])} and d.publication_year = {edition['publication_year']});""",
    ]

    for source in packet["source_objects"]:
        source_provenance = {**provenance_base, "representation_role": source["role"], "object_path": source["object_path"]}
        statements.append(
            f"""insert into public.source_objects (edition_id, sha256, byte_count, media_type, storage_backend, storage_bucket, storage_key, provider, provider_identifier, source_url, acquired_at, provenance, completeness_status, rights_lane, rights_basis)
select d.id, {sql_quote(source['sha256'])}, {source['bytes']}, {sql_quote(source['media_type'])}, 'local_vault', null, {sql_quote(source['object_path'])}, {sql_quote(provider['name'])}, {sql_quote(provider['identifier'] + ':' + source['role'])}, {sql_quote(provider['source_url'])}, {sql_quote(provider['acquired_at'])}::timestamptz, {json_sql(source_provenance)}, {sql_quote(structure['completeness_status'])}, {sql_quote(rights['lane'])}, {json_sql(rights_basis)}
from public.editions d join public.expressions e on e.id = d.expression_id join public.works w on w.id = e.work_id
where w.slug = {sql_quote(work['slug'])} and d.edition_title = {sql_quote(edition['edition_title'])}
on conflict (sha256) do update set edition_id = excluded.edition_id, byte_count = excluded.byte_count, media_type = excluded.media_type, storage_backend = excluded.storage_backend, storage_bucket = excluded.storage_bucket, storage_key = excluded.storage_key, provider = excluded.provider, provider_identifier = excluded.provider_identifier, source_url = excluded.source_url, acquired_at = excluded.acquired_at, provenance = excluded.provenance, completeness_status = excluded.completeness_status, rights_lane = excluded.rights_lane, rights_basis = excluded.rights_basis;"""
        )

    canonical_sha = next(item["sha256"] for item in packet["source_objects"] if item["role"] == "canonical_tei")
    for passage in packet["passages"]:
        statements.append(
            f"""insert into public.passages (source_object_id, source_ordinal, locator, language_code, script_code, exact_text, text_status, span_sha256, rights_lane, publication_state)
select s.id, {passage['source_ordinal']}, {json_sql(passage['locator'])}, {sql_quote(passage['language_code'])}, {sql_quote(passage['script_code'])}, {sql_quote(passage['exact_text'])}, {sql_quote(structure['text_status'])}, {sql_quote(passage['span_sha256'])}, {sql_quote(rights['lane'])}, {sql_quote(structure['publication_state'])}
from public.source_objects s where s.sha256 = {sql_quote(canonical_sha)}
on conflict (source_object_id, source_ordinal) do update set locator = excluded.locator, language_code = excluded.language_code, script_code = excluded.script_code, exact_text = excluded.exact_text, text_status = excluded.text_status, span_sha256 = excluded.span_sha256, rights_lane = excluded.rights_lane, publication_state = excluded.publication_state;"""
        )
    statements.append("commit;")
    return "\n\n".join(statements) + "\n"


def compile_sql_batches(sql: str, batch_size: int = 8) -> list[str]:
    parts = sql.strip().split("\n\n")
    if parts[0] != "begin;" or parts[-1] != "commit;":
        raise ValueError("Compiled SQL transaction boundary is invalid")
    statements = parts[1:-1]
    return [
        "\n\n".join(["begin;", *statements[index : index + batch_size], "commit;"]) + "\n"
        for index in range(0, len(statements), batch_size)
    ]


def main() -> int:
    parser = argparse.ArgumentParser(description="Compile a verified TEI source-vault ingestion packet.")
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
    passage_content_root = sha256_bytes(
        "\n".join(
            f"{passage['source_ordinal']}\t{passage['span_sha256']}\t{sha256_bytes(passage['exact_text'].encode('utf-8'))}"
            for passage in packet["passages"]
        ).encode("utf-8")
    )
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
            "pilot_id": packet["pilot_id"],
            "packet_sha256": packet["packet_sha256"],
            "sql_sha256": sha256_bytes(sql.encode("utf-8")),
            "sql_batch_count": len(batches),
            "sql_batch_sha256": [sha256_bytes(batch.encode("utf-8")) for batch in batches],
            "source_objects": [{key: item[key] for key in ("role", "sha256", "bytes", "object_path")} for item in packet["source_objects"]],
            "passage_count": len(packet["passages"]),
            "passage_content_root_sha256": passage_content_root,
            "first_locator": packet["passages"][0]["locator"],
            "last_locator": packet["passages"][-1]["locator"],
            "all_structure_and_completion_claims_remain_unpublished": packet["structure"]["publication_state"] != "published",
            "source_payloads_copied": False,
        }
        sys.stdout.write(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

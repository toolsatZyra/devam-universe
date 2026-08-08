from __future__ import annotations

import argparse
import base64
import collections
import json
import re
import sys
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


CONTRACT = "DEVAM_AMBUDA_DCS_SANSKRIT_EPIC_INGESTION_V1"
COPY_POLICY = "reference_only_no_duplicate_payload"
PROJECTION_CONTRACT = "DEVAM_DCS_SARGA_SURFACE_PROJECTION_V1"
HEADER = re.compile(rb"(?m)^# id = (R\.(\d+)\.(\d+)\.(\d+))\r?\n")
ID_PATTERN = re.compile(r"R\.(\d+)\.(\d+)\.(\d+)")


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


def nullable_sql(value: str | None) -> str:
    return "null" if value is None else sql_quote(value)


def validate_plan(plan: dict[str, Any]) -> None:
    if plan.get("contract") != CONTRACT or plan.get("source_copy_policy") != COPY_POLICY:
        raise ValueError("Contract or reference-only policy drift")
    if plan["rights"] != {
        "lane": "product_allowed",
        "license": "CC-BY-4.0",
        "required_literals": [
            "Source: Oliver Hellwig: Digital Corpus of Sanskrit (DCS). 2010-2021.",
            "License: CC-BY 4.0",
        ],
        "status": "product_use_allowed_with_attribution",
        "attribution_required": True,
        "license_scope_boundary": "The CC BY 4.0 statement is provider evidence for this exact Ambuda/DCS corpus; it does not license unrelated Rāmāyaṇa editions, translations, scans, or traditions.",
    }:
        raise ValueError("Rights contract drift")
    if plan["structure"]["publication_state"] != "published":
        raise ValueError("Product-compatible DCS corpus must be published")
    if plan["structure"]["text_status"] != "exact_provider_surface_token_projection_from_verified_record_spans":
        raise ValueError("Surface-projection status drift")
    if plan["expression"]["is_source_original"] is not False or plan["expression"]["ai_generated"] is not False:
        raise ValueError("Electronic-corpus identity drift")
    expected_denials = {
        "underlying_print_or_manuscript_edition_identified",
        "critical_edition",
        "gap_free_provider_record_sequence",
        "source_order_monotonic_everywhere",
        "complete_valmiki_ramayana_textual_tradition",
        "all_recensions_and_variants",
        "hindi_translation_present",
        "english_translation_present",
        "ramcharitmanas_present",
        "ramayana_hero_universe_complete",
        "mvp_library_complete",
    }
    if set(plan["completion_denials"]) != expected_denials or any(plan["completion_denials"].values()):
        raise ValueError("Completion-denial contract drift")
    if plan["projection"]["contract"] != PROJECTION_CONTRACT:
        raise ValueError("Projection contract drift")


def parse_records(data: bytes) -> list[dict[str, Any]]:
    matches = list(HEADER.finditer(data))
    if not matches or matches[0].start() != 0:
        raise ValueError("Corpus does not begin with a DCS record header")
    records: list[dict[str, Any]] = []
    cumulative_newlines = 0
    for index, match in enumerate(matches):
        start = match.start()
        end = matches[index + 1].start() if index + 1 < len(matches) else len(data)
        raw = data[start:end]
        text = strict_utf8(raw, f"record {index + 1}")
        lines = text.splitlines()
        identifier = match.group(1).decode("ascii")
        expected_header = f"# id = {identifier}"
        if not lines or lines[0] != expected_header:
            raise ValueError(f"Record header drift at {identifier}")
        token_lines = [line for line in lines[1:] if line]
        if not token_lines:
            raise ValueError(f"Record has no token lines: {identifier}")
        surfaces: list[str] = []
        for line in token_lines:
            fields = line.split("\t")
            if len(fields) != 3 or not all(fields):
                raise ValueError(f"Malformed token line in {identifier}: {line!r}")
            surfaces.append(fields[0])
        book, sarga, verse = map(int, match.groups()[1:])
        line_start = cumulative_newlines + 1
        cumulative_newlines += raw.count(b"\n")
        records.append({
            "source_record_ordinal": index + 1,
            "id": identifier,
            "book": book,
            "sarga": sarga,
            "verse": verse,
            "byte_start": start,
            "byte_end_exclusive": end,
            "line_start": line_start,
            "line_end": cumulative_newlines,
            "raw_span_sha256": sha256_bytes(raw),
            "surfaces": surfaces,
            "token_line_count": len(token_lines),
        })
    return records


def expected_missing_ids(records: list[dict[str, Any]]) -> list[str]:
    grouped: collections.OrderedDict[tuple[int, int], list[int]] = collections.OrderedDict()
    for record in records:
        grouped.setdefault((record["book"], record["sarga"]), []).append(record["verse"])
    missing: list[str] = []
    for (book, sarga), verses in grouped.items():
        present = set(verses)
        missing.extend(f"R.{book}.{sarga}.{verse}" for verse in range(1, max(verses) + 1) if verse not in present)
    return missing


def source_order_anomalies(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    anomalies = []
    for left, right in zip(records, records[1:]):
        left_key = (left["book"], left["sarga"], left["verse"])
        right_key = (right["book"], right["sarga"], right["verse"])
        if right_key <= left_key:
            anomalies.append({
                "source_pair_ordinal": left["source_record_ordinal"],
                "left": left["id"],
                "right": right["id"],
            })
    return anomalies


def extract_passages(data: bytes, plan: dict[str, Any]) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    records = parse_records(data)
    structure = plan["structure"]
    ids = [record["id"] for record in records]
    if len(records) != structure["verse_record_count"] or len(set(ids)) != len(ids):
        raise ValueError("Verse-record count or uniqueness drift")
    if sum(record["token_line_count"] for record in records) != structure["token_line_count"]:
        raise ValueError("Token-line count drift")
    if ids[0] != structure["first_verse_id"] or ids[-1] != structure["last_verse_id"]:
        raise ValueError("First/last verse ID drift")
    if sha256_bytes("\n".join(ids).encode("utf-8")) != structure["verse_id_root_sha256"]:
        raise ValueError("Verse-ID root drift")
    if expected_missing_ids(records) != structure["literal_missing_verse_ids"]:
        raise ValueError("Literal missing-ID universe drift")
    if len(structure["literal_missing_verse_ids"]) != structure["literal_missing_verse_id_count"]:
        raise ValueError("Literal missing-ID count drift")
    anomalies = source_order_anomalies(records)
    if anomalies != structure["source_order_anomalies"] or len(anomalies) != structure["source_order_anomaly_count"]:
        raise ValueError("Source-order anomaly drift")

    grouped: collections.OrderedDict[tuple[int, int], list[dict[str, Any]]] = collections.OrderedDict()
    for record in records:
        grouped.setdefault((record["book"], record["sarga"]), []).append(record)
    if len(grouped) != structure["sarga_count"]:
        raise ValueError("Sarga universe drift")
    profiles = []
    for book in range(1, 8):
        rows = [(key, value) for key, value in grouped.items() if key[0] == book]
        profiles.append({
            "book": book,
            "sarga_count": len(rows),
            "verse_record_count": sum(len(value) for _, value in rows),
            "first_sarga": rows[0][0][1],
            "last_sarga": rows[-1][0][1],
        })
    if profiles != structure["book_profiles"] or len(profiles) != structure["kanda_count"]:
        raise ValueError(f"Book-profile drift: {profiles}")
    if list(grouped) != sorted(grouped):
        raise ValueError("Book/sarga source order is not monotonic")

    missing_by_sarga: dict[tuple[int, int], list[str]] = collections.defaultdict(list)
    for identifier in structure["literal_missing_verse_ids"]:
        match = ID_PATTERN.fullmatch(identifier)
        if match is None:
            raise ValueError(f"Malformed missing ID: {identifier}")
        book, sarga, _ = map(int, match.groups())
        missing_by_sarga[(book, sarga)].append(identifier)
    anomaly_by_sarga: dict[tuple[int, int], list[dict[str, Any]]] = collections.defaultdict(list)
    for anomaly in anomalies:
        match = ID_PATTERN.fullmatch(anomaly["left"])
        assert match is not None
        anomaly_by_sarga[(int(match.group(1)), int(match.group(2)))].append(anomaly)

    passages = []
    for (book, sarga), rows in grouped.items():
        start, end = rows[0]["byte_start"], rows[-1]["byte_end_exclusive"]
        exact_text = "\n".join(f"{row['id']} {' '.join(row['surfaces'])}" for row in rows)
        record_id_root = sha256_bytes("\n".join(row["id"] for row in rows).encode("utf-8"))
        record_span_root = sha256_bytes("\n".join(row["raw_span_sha256"] for row in rows).encode("utf-8"))
        passages.append({
            "source_ordinal": len(passages) + 1,
            "locator": {
                "contract": "DEVAM_DCS_SARGA_BYTE_SPAN_V1",
                "projection_contract": PROJECTION_CONTRACT,
                "book": book,
                "sarga": sarga,
                "literal_locator": f"{book}.{sarga}",
                "first_source_record_id": rows[0]["id"],
                "last_source_record_id": rows[-1]["id"],
                "source_record_count": len(rows),
                "source_record_id_root_sha256": record_id_root,
                "source_record_span_root_sha256": record_span_root,
                "literal_missing_verse_ids": missing_by_sarga[(book, sarga)],
                "source_order_anomalies": anomaly_by_sarga[(book, sarga)],
                "byte_start": start,
                "byte_end_exclusive": end,
                "line_start": rows[0]["line_start"],
                "line_end": rows[-1]["line_end"],
            },
            "language_code": plan["expression"]["language_code"],
            "script_code": plan["expression"]["script_code"],
            "exact_text": exact_text,
            "span_sha256": sha256_bytes(data[start:end]),
        })
    return passages, records


def compile_packet(plan_path: Path) -> dict[str, Any]:
    plan = json.loads(plan_path.read_text(encoding="utf-8"))
    validate_plan(plan)
    sources = {row["role"]: row for row in plan["source_objects"]}
    if set(sources) != {"rights_and_source_readme", "canonical_morphological_corpus"} or len(sources) != 2:
        raise ValueError("Exact two-object source universe drift")
    readme_bytes = read_verified_object(sources["rights_and_source_readme"])
    data = read_verified_object(sources["canonical_morphological_corpus"])
    readme = strict_utf8(readme_bytes, "Ambuda/DCS README")
    strict_utf8(data, "Ambuda/DCS Rāmāyaṇa corpus")
    normalized_readme = " ".join(readme.split())
    for literal in [*plan["rights"]["required_literals"], plan["identity"]["correction_literal"]]:
        if literal not in readme and " ".join(literal.split()) not in normalized_readme:
            raise ValueError(f"README evidence literal absent: {literal}")
    passages, records = extract_passages(data, plan)
    record_span_root = sha256_bytes(
        "\n".join(record["raw_span_sha256"] for record in records).encode("utf-8")
    )
    core = {
        **plan,
        "passages": passages,
        "source_object_count": 2,
        "passage_count": len(passages),
        "record_span_root_sha256": record_span_root,
    }
    return {**core, "packet_sha256": sha256_bytes(canonical_json(core).encode("utf-8"))}


def compile_statements(packet: dict[str, Any]) -> list[str]:
    work, expression, edition = packet["work"], packet["expression"], packet["edition"]
    rights, structure = packet["rights"], packet["structure"]
    state, lane = structure["publication_state"], rights["lane"]
    statements = [
        f"""insert into public.works (slug, canonical_title, work_kind, tradition_scope, summary, rights_lane, publication_state)
values ({utf8_base64_sql(work['slug'])}, {utf8_base64_sql(work['canonical_title'])}, {sql_quote(work['work_kind'])}, array[{','.join(sql_quote(value) for value in work['tradition_scope'])}]::text[], {utf8_base64_sql(work['summary'])}, {sql_quote(lane)}, {sql_quote(state)})
on conflict (slug) do update set canonical_title=excluded.canonical_title, work_kind=excluded.work_kind, tradition_scope=excluded.tradition_scope, summary=excluded.summary, rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;""",
        f"""insert into public.expressions (work_id, language_code, script_code, expression_kind, attribution, is_source_original, ai_generated, rights_lane, publication_state)
select w.id, {sql_quote(expression['language_code'])}, {sql_quote(expression['script_code'])}, {sql_quote(expression['expression_kind'])}, {utf8_base64_sql(expression['attribution'])}, false, false, {sql_quote(lane)}, {sql_quote(state)} from public.works w where w.slug={sql_quote(work['slug'])}
on conflict (work_id, language_code, expression_kind, attribution) do update set script_code=excluded.script_code, is_source_original=false, ai_generated=false, rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;""",
        f"""insert into public.editions (expression_id, edition_title, publisher, publication_place, publication_year, edition_statement, identifiers, rights_lane, publication_state)
select e.id, {utf8_base64_sql(edition['edition_title'])}, {utf8_base64_sql(edition['publisher'])}, {nullable_sql(edition['publication_place'])}, {edition['publication_year']}, {utf8_base64_sql(edition['edition_statement'])}, {json_sql(edition['identifiers'])}, {sql_quote(lane)}, {sql_quote(state)} from public.expressions e join public.works w on w.id=e.work_id where w.slug={sql_quote(work['slug'])} and e.expression_kind={sql_quote(expression['expression_kind'])} and e.attribution={utf8_base64_sql(expression['attribution'])}
and not exists (select 1 from public.editions d where d.expression_id=e.id and d.edition_title={utf8_base64_sql(edition['edition_title'])});""",
    ]
    rights_basis = {
        **rights,
        "evidence_source_sha256": next(row["sha256"] for row in packet["source_objects"] if row["role"] == "rights_and_source_readme"),
    }
    for source in packet["source_objects"]:
        provenance = {
            "ingestion_contract": CONTRACT,
            "ingestion_pilot_id": packet["pilot_id"],
            "ingestion_packet_sha256": packet["packet_sha256"],
            "source_copy_policy": COPY_POLICY,
            "representation_role": source["role"],
            "object_path": source["object_path"],
            "source_identity": packet["identity"],
            "structure": {key: structure[key] for key in (
                "kanda_count", "sarga_count", "verse_record_count", "token_line_count",
                "literal_missing_verse_id_count", "source_order_anomaly_count",
                "indexed_scope_status", "edition_completeness_status",
            )},
            "completion_denials": packet["completion_denials"],
        }
        statements.append(f"""insert into public.source_objects (edition_id, sha256, byte_count, media_type, storage_backend, storage_bucket, storage_key, provider, provider_identifier, source_url, acquired_at, provenance, completeness_status, rights_lane, rights_basis)
select d.id, {sql_quote(source['sha256'])}, {source['bytes']}, {sql_quote(source['media_type'])}, 'local_vault', null, {sql_quote(source['object_path'])}, {sql_quote(packet['provider']['name'])}, {sql_quote('ambuda-dcs:ramayanam:' + source['role'])}, {sql_quote(source['source_url'])}, {sql_quote(packet['provider']['acquired_at'])}::timestamptz, {json_sql(provenance)}, {sql_quote(structure['edition_completeness_status'])}, {sql_quote(lane)}, {json_sql(rights_basis)} from public.editions d join public.expressions e on e.id=d.expression_id join public.works w on w.id=e.work_id where w.slug={sql_quote(work['slug'])} and e.expression_kind={sql_quote(expression['expression_kind'])} and e.attribution={utf8_base64_sql(expression['attribution'])} and d.edition_title={utf8_base64_sql(edition['edition_title'])}
on conflict (sha256) do update set edition_id=excluded.edition_id, byte_count=excluded.byte_count, media_type=excluded.media_type, storage_backend=excluded.storage_backend, storage_bucket=excluded.storage_bucket, storage_key=excluded.storage_key, provider=excluded.provider, provider_identifier=excluded.provider_identifier, source_url=excluded.source_url, acquired_at=excluded.acquired_at, provenance=excluded.provenance, completeness_status=excluded.completeness_status, rights_lane=excluded.rights_lane, rights_basis=excluded.rights_basis;""")
    canonical_sha = next(row["sha256"] for row in packet["source_objects"] if row["role"] == "canonical_morphological_corpus")
    for passage in packet["passages"]:
        statements.append(f"""insert into public.passages (source_object_id, source_ordinal, locator, language_code, script_code, exact_text, text_status, span_sha256, rights_lane, publication_state)
select s.id, {passage['source_ordinal']}, {json_sql(passage['locator'])}, {sql_quote(passage['language_code'])}, {sql_quote(passage['script_code'])}, {utf8_base64_sql(passage['exact_text'])}, {sql_quote(structure['text_status'])}, {sql_quote(passage['span_sha256'])}, {sql_quote(lane)}, {sql_quote(state)} from public.source_objects s where s.sha256={sql_quote(canonical_sha)}
on conflict (source_object_id, source_ordinal) do update set locator=excluded.locator, language_code=excluded.language_code, script_code=excluded.script_code, exact_text=excluded.exact_text, text_status=excluded.text_status, span_sha256=excluded.span_sha256, rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;""")
    return statements


def compile_sql(packet: dict[str, Any]) -> str:
    return "\n\n".join(["begin;", *compile_statements(packet), "commit;"]) + "\n"


def compile_batches(packet: dict[str, Any], max_passage_sql_chars: int = 28000) -> list[str]:
    statements = compile_statements(packet)
    metadata_count = 3 + packet["source_object_count"]
    metadata, passages = statements[:metadata_count], statements[metadata_count:]
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


def report(packet: dict[str, Any]) -> dict[str, Any]:
    sql = compile_sql(packet)
    batches = compile_batches(packet)
    batch_hashes = [sha256_bytes(batch.encode("utf-8")) for batch in batches]
    return {
        "result": "PASS",
        "contract": CONTRACT,
        "pilot_id": packet["pilot_id"],
        "packet_sha256": packet["packet_sha256"],
        "sql_sha256": sha256_bytes(sql.encode("utf-8")),
        "sql_batch_count": len(batches),
        "sql_batch_sha256": batch_hashes,
        "sql_batch_root_sha256": sha256_bytes("\n".join(batch_hashes).encode("ascii")),
        "source_object_count": packet["source_object_count"],
        "source_object_bytes": sum(row["bytes"] for row in packet["source_objects"]),
        "passage_count": packet["passage_count"],
        "verse_record_count": packet["structure"]["verse_record_count"],
        "token_line_count": packet["structure"]["token_line_count"],
        "literal_missing_verse_id_count": packet["structure"]["literal_missing_verse_id_count"],
        "source_order_anomaly_count": packet["structure"]["source_order_anomaly_count"],
        "record_span_root_sha256": packet["record_span_root_sha256"],
        "passage_content_root_sha256": passage_root(packet),
        "hosted_text_span_root_sha256": passage_root(packet, include_locator=False),
        "publication_state": packet["structure"]["publication_state"],
        "rights_lane": packet["rights"]["lane"],
        "source_payloads_copied": False,
        **packet["completion_denials"],
    }


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Compile the product-compatible Ambuda/DCS Sanskrit Rāmāyaṇa corpus.")
    parser.add_argument("--plan", required=True, type=Path)
    parser.add_argument("--format", choices=("report", "sql-batch"), default="report")
    parser.add_argument("--batch-index", type=int)
    args = parser.parse_args()
    path = args.plan.resolve(strict=True)
    if not path.is_relative_to(ROOT / "ingestion" / "plans"):
        raise ValueError("Plan must be inside ingestion/plans")
    packet = compile_packet(path)
    batches = compile_batches(packet)
    if args.format == "sql-batch":
        if args.batch_index is None or not 0 <= args.batch_index < len(batches):
            raise ValueError("Invalid batch index")
        sys.stdout.write(batches[args.batch_index])
    else:
        print(json.dumps(report(packet), ensure_ascii=False, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

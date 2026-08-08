from __future__ import annotations

import argparse
import base64
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


CONTRACT = "DEVAM_WIKISOURCE_WIKITEXT_INGESTION_V1"
DEVANAGARI_DIGITS = "०१२३४५६७८९"


def devanagari_number(value: str) -> int:
    return int("".join(str(DEVANAGARI_DIGITS.index(char)) for char in value))


def utf8_base64_sql(value: str) -> str:
    encoded = base64.b64encode(value.encode("utf-8")).decode("ascii")
    return f"convert_from(decode({sql_quote(encoded)}, 'base64'), 'UTF8')"


def strict_utf8(data: bytes, role: str) -> str:
    text = data.decode("utf-8", errors="strict")
    if text.encode("utf-8") != data:
        raise ValueError(f"UTF-8 roundtrip failed: {role}")
    return text


def extract_passages(data: bytes, plan: dict[str, Any]) -> list[dict[str, Any]]:
    text = strict_utf8(data, "canonical_wikitext")
    structure = plan["structure"]
    if not text.startswith(structure["opening_tag"]):
        raise ValueError("Wikitext opening boundary drift")
    close_at = text.find(structure["closing_tag"])
    if close_at < 0 or text.find(structure["closing_tag"], close_at + 1) >= 0:
        raise ValueError("Wikitext closing boundary is absent or ambiguous")
    body_start = len(structure["opening_tag"])
    body = text[body_start:close_at]
    heading_at = body.find(structure["first_numbered_heading"])
    if heading_at < 0:
        raise ValueError("First numbered-unit heading drift")
    marker_pattern = re.compile(r"॥\s*([०-९]+)\s*॥")
    matches = list(marker_pattern.finditer(body))
    numbers = [devanagari_number(match.group(1)) for match in matches]
    expected = list(range(1, structure["expected_numbered_units"] + 1))
    if numbers != expected:
        raise ValueError(f"Numbered-unit sequence drift: {numbers}")
    terminal = structure["terminal_formula"]
    if terminal not in body[matches[-1].end():]:
        raise ValueError("Terminal formula is absent after numbered unit 14")

    body_boundaries = [(0, heading_at, "opening", None, None)]
    start = heading_at
    for number, match in zip(numbers, matches):
        body_boundaries.append((start, match.end(), "numbered_unit", number, match.group(0)))
        start = match.end()
    body_boundaries.append((start, len(body), "closing", None, None))
    if len(body_boundaries) != structure["expected_passages"]:
        raise ValueError("Passage count drift")
    if "".join(body[a:b] for a, b, *_ in body_boundaries) != body:
        raise ValueError("Passage spans do not reconstruct the poem body losslessly")

    prefix_bytes = len(text[:body_start].encode("utf-8"))
    passages = []
    for ordinal, (start_char, end_char, kind, marker, literal_marker) in enumerate(body_boundaries):
        raw_segment = body[start_char:end_char]
        byte_start = prefix_bytes + len(body[:start_char].encode("utf-8"))
        byte_end = prefix_bytes + len(body[:end_char].encode("utf-8"))
        raw_bytes = data[byte_start:byte_end]
        if raw_bytes.decode("utf-8") != raw_segment:
            raise ValueError("Byte/character span mismatch")
        exact_text = raw_segment.strip()
        if not exact_text:
            raise ValueError("Empty citation passage")
        passages.append({
            "source_ordinal": ordinal,
            "locator": {
                "provider": plan["provider"]["name"],
                "page_id": plan["provider"]["page_id"],
                "revision_id": plan["provider"]["revision_id"],
                "segment_kind": kind,
                "numbered_unit": marker,
                "literal_marker": literal_marker,
                "source_byte_start": byte_start,
                "source_byte_end_exclusive": byte_end,
                "underlying_print_edition_identified": False,
            },
            "language_code": "sa",
            "script_code": "Deva",
            "exact_text": exact_text,
            "span_sha256": sha256_bytes(raw_bytes),
        })
    return passages


def compile_packet(plan_path: Path) -> dict[str, Any]:
    plan = json.loads(plan_path.read_text(encoding="utf-8"))
    if plan.get("contract") != CONTRACT:
        raise ValueError("Unsupported Wikisource ingestion contract")
    if plan["rights"]["lane"] != "derivative_allowed" or plan["publication"]["state"] != "published":
        raise ValueError("This compiler requires an explicit product-compatible publication lane")
    if plan["rights"]["underlying_print_edition_rights_inferred"]:
        raise ValueError("Underlying print-edition rights must not be inferred")
    if any(plan["completion_denials"].values()):
        raise ValueError("All completion denials must remain false")
    sources = {row["role"]: row for row in plan["source_objects"]}
    if set(sources) != {"canonical_wikitext", "revision_metadata"}:
        raise ValueError("Exact two-representation source universe drift")
    source_data = {role: read_verified_object(row) for role, row in sources.items()}
    revision = json.loads(strict_utf8(source_data["revision_metadata"], "revision_metadata"))
    page = revision["query"]["pages"][0]
    rev = page["revisions"][0]
    raw_text = strict_utf8(source_data["canonical_wikitext"], "canonical_wikitext")
    if page["pageid"] != plan["provider"]["page_id"] or rev["revid"] != plan["provider"]["revision_id"]:
        raise ValueError("Provider page or revision identity drift")
    if rev["timestamp"] != plan["provider"]["revision_timestamp"] or rev["sha1"] != plan["provider"]["revision_sha1"]:
        raise ValueError("Provider revision fixity drift")
    if rev["slots"]["main"]["content"] != raw_text:
        raise ValueError("Raw wikitext differs from the revision API content")
    passages = extract_passages(source_data["canonical_wikitext"], plan)
    core = {**plan, "passages": passages, "source_object_count": 2, "passage_count": len(passages)}
    return {**core, "packet_sha256": sha256_bytes(canonical_json(core).encode("utf-8"))}


def compile_statements(packet: dict[str, Any]) -> list[str]:
    work, expression, edition = packet["work"], packet["expression"], packet["edition"]
    rights, structure = packet["rights"], packet["structure"]
    state, lane = packet["publication"]["state"], rights["lane"]
    summary = "Exact Sanskrit Wikisource transcription at revision 415703; the underlying print edition and recension remain unidentified."
    statements = [
        f"""insert into public.works (slug, canonical_title, work_kind, tradition_scope, summary, rights_lane, publication_state) values ({sql_quote(work['slug'])}, {sql_quote(work['canonical_title'])}, {sql_quote(work['work_kind'])}, array[{','.join(sql_quote(v) for v in work['tradition_scope'])}]::text[], {sql_quote(summary)}, {sql_quote(lane)}, {sql_quote(state)}) on conflict (slug) do update set canonical_title=excluded.canonical_title, work_kind=excluded.work_kind, tradition_scope=excluded.tradition_scope, summary=excluded.summary, rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;""",
        f"""insert into public.expressions (work_id, language_code, script_code, expression_kind, attribution, is_source_original, ai_generated, rights_lane, publication_state) select w.id, {sql_quote(expression['language_code'])}, {sql_quote(expression['script_code'])}, {sql_quote(expression['expression_kind'])}, {sql_quote(expression['attribution'])}, false, false, {sql_quote(lane)}, {sql_quote(state)} from public.works w where w.slug={sql_quote(work['slug'])} on conflict (work_id, language_code, expression_kind, attribution) do update set script_code=excluded.script_code, is_source_original=false, ai_generated=false, rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;""",
        f"""insert into public.editions (expression_id, edition_title, publisher, publication_place, publication_year, edition_statement, identifiers, rights_lane, publication_state) select e.id, {sql_quote(edition['edition_title'])}, {sql_quote(edition['publisher'])}, {sql_quote(edition['publication_place'])}, {edition['publication_year']}, {sql_quote(edition['edition_statement'])}, {json_sql(edition['identifiers'])}, {sql_quote(lane)}, {sql_quote(state)} from public.expressions e join public.works w on w.id=e.work_id where w.slug={sql_quote(work['slug'])} and e.attribution={sql_quote(expression['attribution'])} and not exists (select 1 from public.editions d where d.expression_id=e.id and d.edition_title={sql_quote(edition['edition_title'])});""",
    ]
    for source in packet["source_objects"]:
        provenance = {
            "ingestion_contract": CONTRACT,
            "pilot_id": packet["pilot_id"],
            "packet_sha256": packet["packet_sha256"],
            "representation_role": source["role"],
            "object_path": source["object_path"],
            "completion_denials": packet["completion_denials"],
            "no_payload_copy_into_app": True,
        }
        provider_identifier = f"wikisource:sa:page-137:revision-415703:{source['role']}"
        statements.append(f"""insert into public.source_objects (edition_id, sha256, byte_count, media_type, storage_backend, storage_bucket, storage_key, provider, provider_identifier, source_url, acquired_at, provenance, completeness_status, rights_lane, rights_basis) select d.id, {sql_quote(source['sha256'])}, {source['bytes']}, {sql_quote(source['media_type'])}, 'local_vault', null, {sql_quote(source['object_path'])}, {sql_quote(packet['provider']['name'])}, {sql_quote(provider_identifier)}, {sql_quote(source['source_url'])}, {sql_quote(packet['provider']['acquired_at'])}::timestamptz, {json_sql(provenance)}, {sql_quote(structure['completeness_status'])}, {sql_quote(lane)}, {json_sql(rights)} from public.editions d join public.expressions e on e.id=d.expression_id join public.works w on w.id=e.work_id where w.slug={sql_quote(work['slug'])} and d.edition_title={sql_quote(edition['edition_title'])} on conflict (sha256) do update set edition_id=excluded.edition_id, byte_count=excluded.byte_count, media_type=excluded.media_type, storage_backend=excluded.storage_backend, storage_bucket=excluded.storage_bucket, storage_key=excluded.storage_key, provider=excluded.provider, provider_identifier=excluded.provider_identifier, source_url=excluded.source_url, acquired_at=excluded.acquired_at, provenance=excluded.provenance, completeness_status=excluded.completeness_status, rights_lane=excluded.rights_lane, rights_basis=excluded.rights_basis;""")
    canonical_sha = next(row["sha256"] for row in packet["source_objects"] if row["role"] == "canonical_wikitext")
    for passage in packet["passages"]:
        statements.append(f"""insert into public.passages (source_object_id, source_ordinal, locator, language_code, script_code, exact_text, text_status, span_sha256, rights_lane, publication_state) select s.id, {passage['source_ordinal']}, {json_sql(passage['locator'])}, 'sa', 'Deva', {utf8_base64_sql(passage['exact_text'])}, {sql_quote(structure['text_status'])}, {sql_quote(passage['span_sha256'])}, {sql_quote(lane)}, {sql_quote(state)} from public.source_objects s where s.sha256={sql_quote(canonical_sha)} on conflict (source_object_id, source_ordinal) do update set locator=excluded.locator, exact_text=excluded.exact_text, text_status=excluded.text_status, span_sha256=excluded.span_sha256, rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;""")
    return statements


def compile_batches(packet: dict[str, Any], max_chars: int = 28000) -> list[str]:
    statements = compile_statements(packet)
    metadata_count = 3 + packet["source_object_count"]
    batches = ["\n\n".join(["begin;", *statements[:3], "commit;"]) + "\n"]
    batches.extend("\n\n".join(["begin;", statement, "commit;"]) + "\n" for statement in statements[3:metadata_count])
    current: list[str] = []
    size = 0
    for statement in statements[metadata_count:]:
        if current and size + len(statement) > max_chars:
            batches.append("\n\n".join(["begin;", *current, "commit;"]) + "\n")
            current, size = [], 0
        current.append(statement)
        size += len(statement)
    if current:
        batches.append("\n\n".join(["begin;", *current, "commit;"]) + "\n")
    return batches


def main() -> int:
    parser = argparse.ArgumentParser(description="Compile an exact Wikisource wikitext revision into Devam's evidence model.")
    parser.add_argument("--plan", required=True, type=Path)
    parser.add_argument("--format", choices=("report", "sql-batch"), default="report")
    parser.add_argument("--batch-index", type=int)
    args = parser.parse_args()
    path = args.plan.resolve(strict=True)
    if not path.is_relative_to(ROOT / "ingestion" / "plans"):
        raise ValueError("Plan must be inside ingestion/plans")
    packet = compile_packet(path)
    batches = compile_batches(packet)
    sql = "\n".join(batches)
    if args.format == "sql-batch":
        if args.batch_index is None or not 0 <= args.batch_index < len(batches):
            raise ValueError("Invalid batch index")
        sys.stdout.write(batches[args.batch_index])
    else:
        print(json.dumps({
            "result": "PASS",
            "contract": CONTRACT,
            "pilot_id": packet["pilot_id"],
            "packet_sha256": packet["packet_sha256"],
            "sql_sha256": sha256_bytes(sql.encode("utf-8")),
            "sql_batch_count": len(batches),
            "source_object_count": packet["source_object_count"],
            "source_object_bytes": sum(row["bytes"] for row in packet["source_objects"]),
            "passage_count": packet["passage_count"],
            "passage_content_root_sha256": sha256_bytes("\n".join(f"{p['source_ordinal']}\t{p['span_sha256']}\t{sha256_bytes(p['exact_text'].encode('utf-8'))}" for p in packet["passages"]).encode("utf-8")),
            "published_exact_sanskrit_transcription": True,
            **packet["completion_denials"],
        }, ensure_ascii=False, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

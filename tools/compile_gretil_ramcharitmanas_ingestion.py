from __future__ import annotations

import argparse
import base64
import csv
import html
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


CONTRACT = "DEVAM_GRETIL_RAMCHARITMANAS_INGESTION_V1"
COPY_POLICY = "reference_only_no_duplicate_payload"
TAG_PATTERN = re.compile(rb"<[^>]+>")
LINE_PATTERN = re.compile(rb".*?(?:\r\n|\n|\r|\Z)")
MARKER_PATTERN = re.compile(r"//\s*([0-9]+(?:\([^)]*\))?)\s*//")
AARTI_LITERAL = "ārati śrīrāmāyanajī kī"


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


def plain_line(raw: bytes) -> str:
    return html.unescape(TAG_PATTERN.sub(b"", raw).decode("utf-8", errors="strict")).strip()


def catalog_row(path: Path, key: str, value: str) -> dict[str, str]:
    with path.open(encoding="utf-8-sig", newline="") as handle:
        rows = [row for row in csv.DictReader(handle) if row.get(key) == value]
    if len(rows) != 1:
        raise ValueError(f"Expected one catalog row for {key}={value}, got {len(rows)}")
    return rows[0]


def validate_catalog_evidence(plan: dict[str, Any]) -> None:
    evidence = plan["catalog_evidence"]
    provider_path = ROOT / evidence["provider_catalog_path"]
    leads_path = ROOT / evidence["source_leads_path"]
    if sha256_bytes(provider_path.read_bytes()) != evidence["provider_catalog_sha256"]:
        raise ValueError("Provider catalog drift")
    if sha256_bytes(leads_path.read_bytes()) != evidence["source_leads_sha256"]:
        raise ValueError("Source-leads catalog drift")
    provider_row = catalog_row(provider_path, "gretil_item_id", evidence["provider_row_key"])
    lead_row = catalog_row(leads_path, "queue_id", evidence["source_lead_key"])
    if sha256_bytes(canonical_json(provider_row).encode("utf-8")) != evidence["provider_row_sha256"]:
        raise ValueError("Exact provider row drift")
    if sha256_bytes(canonical_json(lead_row).encode("utf-8")) != evidence["source_lead_row_sha256"]:
        raise ValueError("Exact source-lead row drift")
    if provider_row["downloadable_url_count"] != "7" or lead_row["source_record_id"] != plan["provider"]["provider_item_id"]:
        raise ValueError("Catalog route or seven-carrier universe drift")


def validate_plan(plan: dict[str, Any]) -> None:
    if plan.get("contract") != CONTRACT or plan.get("source_copy_policy") != COPY_POLICY:
        raise ValueError("Contract or reference-only source policy drift")
    if plan["provider"] != {
        "name": "GRETIL",
        "provider_item_id": "GRE-00883",
        "legacy_queue_id": "AQ-01507",
        "catalogue_source_url": "https://gretil.sub.uni-goettingen.de/gretil.html",
        "acquired_at": "2026-07-12T00:00:00Z",
    }:
        raise ValueError("Provider route drift")
    if plan["rights"] != {
        "lane": "private_evidence",
        "license": None,
        "required_literals": [
            "THIS GRETIL TEXT FILE IS FOR REFERENCE PURPOSES ONLY!",
            "COPYRIGHT AND TERMS OF USAGE AS FOR SOURCE FILE.",
        ],
        "status": "source_file_terms_unidentified_internal_review_only",
        "product_clearance": False,
    }:
        raise ValueError("Rights boundary drift")
    expected_denials = {
        "underlying_source_edition_identified",
        "source_file_rights_resolved",
        "product_or_public_use_cleared",
        "complete_ramcharitmanas_textual_tradition",
        "all_editions_commentaries_scripts_and_translations",
        "complete_valmiki_ramayana_or_other_ramayana_works",
        "complete_ramayana_hero_universe",
        "mvp_library_complete",
    }
    if set(plan["completion_denials"]) != expected_denials or any(plan["completion_denials"].values()):
        raise ValueError("Completion denials drift")
    if plan["expression"]["is_source_original"] or plan["expression"]["ai_generated"]:
        raise ValueError("Electronic transliteration identity drift")
    if plan["structure"]["publication_state"] != "review" or plan["structure"]["sopana_count"] != 7:
        raise ValueError("Review-only seven-sopana structure drift")
    validate_catalog_evidence(plan)


def physical_lines(data: bytes, header_end: int, body_end: int) -> list[dict[str, Any]]:
    rows = []
    for match in LINE_PATTERN.finditer(data):
        if match.end() <= header_end or match.start() >= body_end or match.start() == match.end():
            continue
        end = min(match.end(), body_end)
        raw = data[match.start():end].rstrip(b"\r\n")
        rows.append({
            "byte_start": match.start(),
            "byte_end_exclusive": end,
            "line": data.count(b"\n", 0, match.start()) + 1,
            "raw": raw,
            "text": plain_line(raw),
        })
    return rows


def extract_part(data: bytes, source: dict[str, Any], profile: dict[str, Any], plan: dict[str, Any]) -> list[dict[str, Any]]:
    strict_utf8(data, source["role"])
    identity = plan["identity"]
    visible_text = " ".join(html.unescape(TAG_PATTERN.sub(b"", data).decode("utf-8")).split())
    for literal in [identity["header_title_literal"], identity["input_literal"], *plan["rights"]["required_literals"], source["title"]]:
        if " ".join(literal.split()) not in visible_text:
            raise ValueError(f"Required source literal absent from part {source['part']}: {literal}")
    hr_matches = list(re.finditer(rb"<hr\s*>", data, re.IGNORECASE))
    body_close = re.search(rb"</body\s*>", data, re.IGNORECASE)
    if not hr_matches or body_close is None:
        raise ValueError(f"HTML content boundary absent from part {source['part']}")
    rows = physical_lines(data, hr_matches[-1].end(), body_close.start())
    first = next(index for index, row in enumerate(rows) if row["text"])
    last = len(rows) - 1 - next(index for index, row in enumerate(reversed(rows)) if row["text"])
    content = rows[first:last + 1]
    if content[0]["byte_start"] != profile["body_start"] or content[-1]["byte_end_exclusive"] != profile["body_end_exclusive"]:
        raise ValueError(f"Body boundary drift in part {source['part']}")
    if sha256_bytes(data[profile["body_start"]:profile["body_end_exclusive"]]) != profile["body_span_sha256"]:
        raise ValueError(f"Body span drift in part {source['part']}")
    if data.count(b"\n") + 1 != profile["line_count"]:
        raise ValueError(f"Physical line count drift in part {source['part']}")

    groups: list[list[dict[str, Any]]] = []
    current: list[dict[str, Any]] = []
    for row in content:
        if row["text"]:
            if row["text"].startswith(AARTI_LITERAL) and current:
                groups.append(current)
                current = []
            current.append(row)
        elif current:
            groups.append(current)
            current = []
    if current:
        groups.append(current)
    if len(groups) != profile["passage_count"]:
        raise ValueError(f"Passage count drift in part {source['part']}: {len(groups)}")

    markers: list[str] = []
    passages = []
    for ordinal, group in enumerate(groups, 1):
        exact_text = "\n".join(row["text"] for row in group)
        literal_markers = MARKER_PATTERN.findall(exact_text)
        markers.extend(literal_markers)
        start, end = group[0]["byte_start"], group[-1]["byte_end_exclusive"]
        if ordinal == profile["closure_passage_ordinal"]:
            role = "sopana_closure"
        elif profile["trailing_aarti_start_ordinal"] and ordinal >= profile["trailing_aarti_start_ordinal"]:
            role = "trailing_aarti"
        else:
            role = "source_text_block"
        passages.append({
            "part": source["part"],
            "source_sha256": source["sha256"],
            "source_ordinal": ordinal,
            "locator": {
                "contract": "DEVAM_GRETIL_HTML_SOURCE_BLOCK_BYTE_SPAN_V1",
                "part": source["part"],
                "sopana_title": source["title"],
                "source_relative_ordinal": ordinal,
                "structural_role": role,
                "literal_number_markers": literal_markers,
                "literal_markers_are_unique_ids": False,
                "byte_start": start,
                "byte_end_exclusive": end,
                "line_start": group[0]["line"],
                "line_end": group[-1]["line"],
            },
            "language_code": plan["expression"]["language_code"],
            "script_code": plan["expression"]["script_code"],
            "exact_text": exact_text,
            "span_sha256": sha256_bytes(data[start:end]),
        })
    if len(markers) != profile["literal_marker_count"] or sha256_bytes("\n".join(markers).encode("utf-8")) != profile["literal_marker_root_sha256"]:
        raise ValueError(f"Literal marker universe drift in part {source['part']}")
    if profile["terminal_literal"] not in passages[profile["closure_passage_ordinal"] - 1]["exact_text"]:
        raise ValueError(f"Terminal closure drift in part {source['part']}")
    if profile["trailing_aarti_start_ordinal"]:
        if not passages[profile["trailing_aarti_start_ordinal"] - 1]["exact_text"].startswith(AARTI_LITERAL):
            raise ValueError("Trailing aarti boundary drift")
    root_rows = [
        f"{row['source_ordinal']}\t{row['span_sha256']}\t{sha256_bytes(row['exact_text'].encode('utf-8'))}"
        for row in passages
    ]
    if sha256_bytes("\n".join(root_rows).encode("utf-8")) != profile["passage_root_sha256"]:
        raise ValueError(f"Passage content/span root drift in part {source['part']}")
    return passages


def compile_packet(plan_path: Path) -> dict[str, Any]:
    plan = json.loads(plan_path.read_text(encoding="utf-8"))
    validate_plan(plan)
    sources = sorted(plan["source_objects"], key=lambda row: row["part"])
    profiles = sorted(plan["structure"]["part_profiles"], key=lambda row: row["part"])
    if [row["part"] for row in sources] != list(range(1, 8)) or [row["part"] for row in profiles] != list(range(1, 8)):
        raise ValueError("Exact seven-part source/profile universe drift")
    observations = sorted(plan["live_observations"], key=lambda row: row["part"])
    if len(observations) != 7:
        raise ValueError("Live observation universe drift")
    all_passages = []
    all_markers = []
    for source, profile, observation in zip(sources, profiles, observations, strict=True):
        if observation != {
            "part": source["part"], "status": 200, "final_url": source["source_url"],
            "bytes": source["bytes"], "sha256": source["sha256"], "strict_utf8": True,
        }:
            raise ValueError(f"Live observation drift in part {source['part']}")
        data = read_verified_object(source)
        passages = extract_part(data, source, profile, plan)
        all_passages.extend(passages)
        for passage in passages:
            all_markers.extend(f"{source['part']}:{value}" for value in passage["locator"]["literal_number_markers"])
    if len(all_passages) != plan["structure"]["passage_count"]:
        raise ValueError("Global passage count drift")
    if len(all_markers) != plan["structure"]["literal_number_marker_count"]:
        raise ValueError("Global literal marker count drift")
    if sha256_bytes("\n".join(all_markers).encode("utf-8")) != plan["structure"]["global_literal_marker_root_sha256"]:
        raise ValueError("Global literal marker root drift")
    core = {**plan, "passages": all_passages, "source_object_count": 7, "passage_count": len(all_passages)}
    return {**core, "packet_sha256": sha256_bytes(canonical_json(core).encode("utf-8"))}


def compile_statements(packet: dict[str, Any]) -> list[str]:
    work, expression, edition = packet["work"], packet["expression"], packet["edition"]
    rights, structure = packet["rights"], packet["structure"]
    year_sql = "null" if edition["publication_year"] is None else str(edition["publication_year"])
    statements = [
        f"""insert into public.works (slug, canonical_title, work_kind, tradition_scope, summary, rights_lane, publication_state)
values ({sql_quote(work['slug'])}, {sql_quote(work['canonical_title'])}, {sql_quote(work['work_kind'])}, array[{','.join(sql_quote(value) for value in work['tradition_scope'])}]::text[], {sql_quote(work['summary'])}, {sql_quote(rights['lane'])}, 'review')
on conflict (slug) do update set canonical_title=excluded.canonical_title, work_kind=excluded.work_kind, tradition_scope=excluded.tradition_scope, summary=excluded.summary, rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;""",
        f"""insert into public.expressions (work_id, language_code, script_code, expression_kind, attribution, is_source_original, ai_generated, rights_lane, publication_state)
select w.id, {sql_quote(expression['language_code'])}, {sql_quote(expression['script_code'])}, {sql_quote(expression['expression_kind'])}, {sql_quote(expression['attribution'])}, false, false, {sql_quote(rights['lane'])}, 'review' from public.works w where w.slug={sql_quote(work['slug'])}
and not exists (select 1 from public.expressions e where e.work_id=w.id and e.language_code={sql_quote(expression['language_code'])} and e.expression_kind={sql_quote(expression['expression_kind'])} and e.attribution={sql_quote(expression['attribution'])});""",
        f"""update public.expressions e set script_code={sql_quote(expression['script_code'])}, is_source_original=false, ai_generated=false, rights_lane={sql_quote(rights['lane'])}, publication_state='review' from public.works w where e.work_id=w.id and w.slug={sql_quote(work['slug'])} and e.language_code={sql_quote(expression['language_code'])} and e.expression_kind={sql_quote(expression['expression_kind'])} and e.attribution={sql_quote(expression['attribution'])};""",
        f"""insert into public.editions (expression_id, edition_title, publisher, publication_place, publication_year, edition_statement, identifiers, rights_lane, publication_state)
select e.id, {sql_quote(edition['edition_title'])}, {sql_quote(edition['publisher'])}, {sql_quote(edition['publication_place'])}, {year_sql}, {sql_quote(edition['edition_statement'])}, {json_sql(edition['identifiers'])}, {sql_quote(rights['lane'])}, 'review' from public.expressions e join public.works w on w.id=e.work_id where w.slug={sql_quote(work['slug'])} and e.language_code={sql_quote(expression['language_code'])} and e.expression_kind={sql_quote(expression['expression_kind'])} and e.attribution={sql_quote(expression['attribution'])}
and not exists (select 1 from public.editions d where d.expression_id=e.id and d.edition_title={sql_quote(edition['edition_title'])});""",
    ]
    rights_basis = {**rights, "live_observations": packet["live_observations"]}
    for source in packet["source_objects"]:
        provenance = {
            "ingestion_contract": CONTRACT,
            "ingestion_pilot_id": packet["pilot_id"],
            "ingestion_packet_sha256": packet["packet_sha256"],
            "source_copy_policy": COPY_POLICY,
            "representation_role": source["role"],
            "object_path": source["object_path"],
            "source_identity": packet["identity"],
            "catalog_evidence": packet["catalog_evidence"],
            "completion_denials": packet["completion_denials"],
        }
        statements.append(f"""insert into public.source_objects (edition_id, sha256, byte_count, media_type, storage_backend, storage_bucket, storage_key, provider, provider_identifier, source_url, acquired_at, provenance, completeness_status, rights_lane, rights_basis)
select d.id, {sql_quote(source['sha256'])}, {source['bytes']}, {sql_quote(source['media_type'])}, 'local_vault', null, {sql_quote(source['object_path'])}, {sql_quote(packet['provider']['name'])}, {sql_quote('gretil:GRE-00883:' + source['role'])}, {sql_quote(source['source_url'])}, {sql_quote(packet['provider']['acquired_at'])}::timestamptz, {json_sql(provenance)}, {sql_quote(structure['edition_completeness_status'])}, {sql_quote(rights['lane'])}, {json_sql(rights_basis)} from public.editions d join public.expressions e on e.id=d.expression_id join public.works w on w.id=e.work_id where w.slug={sql_quote(work['slug'])} and e.language_code={sql_quote(expression['language_code'])} and e.expression_kind={sql_quote(expression['expression_kind'])} and e.attribution={sql_quote(expression['attribution'])} and d.edition_title={sql_quote(edition['edition_title'])}
on conflict (sha256) do update set edition_id=excluded.edition_id, byte_count=excluded.byte_count, media_type=excluded.media_type, storage_backend=excluded.storage_backend, storage_bucket=excluded.storage_bucket, storage_key=excluded.storage_key, provider=excluded.provider, provider_identifier=excluded.provider_identifier, source_url=excluded.source_url, acquired_at=excluded.acquired_at, provenance=excluded.provenance, completeness_status=excluded.completeness_status, rights_lane=excluded.rights_lane, rights_basis=excluded.rights_basis;""")
    for passage in packet["passages"]:
        statements.append(f"""insert into public.passages (source_object_id, source_ordinal, locator, language_code, script_code, exact_text, text_status, span_sha256, rights_lane, publication_state)
select s.id, {passage['source_ordinal']}, {json_sql(passage['locator'])}, {sql_quote(passage['language_code'])}, {sql_quote(passage['script_code'])}, {utf8_base64_sql(passage['exact_text'])}, {sql_quote(structure['text_status'])}, {sql_quote(passage['span_sha256'])}, {sql_quote(rights['lane'])}, 'review' from public.source_objects s where s.sha256={sql_quote(passage['source_sha256'])}
on conflict (source_object_id, source_ordinal) do update set locator=excluded.locator, language_code=excluded.language_code, script_code=excluded.script_code, exact_text=excluded.exact_text, text_status=excluded.text_status, span_sha256=excluded.span_sha256, rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;""")
    return statements


def compile_sql(packet: dict[str, Any]) -> str:
    return "\n\n".join(["begin;", *compile_statements(packet), "commit;"]) + "\n"


def compile_batches(packet: dict[str, Any], max_passage_sql_chars: int = 28000) -> list[str]:
    statements = compile_statements(packet)
    metadata_count = 4 + packet["source_object_count"]
    # Keep the repeated provenance/rights JSON for each source object in its own
    # transaction. The database connector may truncate a single oversized
    # metadata request even though each individual statement is valid SQL.
    batches = ["\n\n".join(["begin;", *statements[:4], "commit;"]) + "\n"]
    batches.extend(
        "\n\n".join(["begin;", statement, "commit;"]) + "\n"
        for statement in statements[4:metadata_count]
    )
    current: list[str] = []
    current_chars = 0
    for statement in statements[metadata_count:]:
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
        row = f"{passage['part']}:{passage['source_ordinal']}\t{passage['span_sha256']}\t{sha256_bytes(passage['exact_text'].encode('utf-8'))}"
        if include_locator:
            row += f"\t{canonical_json(passage['locator'])}"
        rows.append(row)
    return sha256_bytes("\n".join(rows).encode("utf-8"))


def main() -> int:
    parser = argparse.ArgumentParser(description="Compile the seven-part GRETIL Ramcharitmanas packet.")
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
            "result": "PASS",
            "contract": CONTRACT,
            "pilot_id": packet["pilot_id"],
            "packet_sha256": packet["packet_sha256"],
            "sql_sha256": sha256_bytes(sql.encode("utf-8")),
            "sql_batch_count": len(batches),
            "source_object_count": packet["source_object_count"],
            "source_object_bytes": sum(row["bytes"] for row in packet["source_objects"]),
            "sopana_count": packet["structure"]["sopana_count"],
            "passage_count": packet["passage_count"],
            "literal_number_marker_count": packet["structure"]["literal_number_marker_count"],
            "passage_content_root_sha256": passage_root(packet),
            "hosted_text_span_root_sha256": passage_root(packet, include_locator=False),
            "source_payloads_copied": False,
            **packet["completion_denials"],
        }, ensure_ascii=False, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

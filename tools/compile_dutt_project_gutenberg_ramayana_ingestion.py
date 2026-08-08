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


CONTRACT = "DEVAM_DUTT_RAMAYANA_PROJECT_GUTENBERG_INGESTION_V1"
COPY_POLICY = "reference_only_no_duplicate_payload"
SECTION_LINE = re.compile(rb"SECTION ([IVXLCDM]+)\.")


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


def line_records(raw: bytes) -> list[tuple[int, int, bytes]]:
    records: list[tuple[int, int, bytes]] = []
    offset = 0
    for line in raw.splitlines(keepends=True):
        end = offset + len(line)
        records.append((offset, end, line.rstrip(b"\r\n")))
        offset = end
    if offset < len(raw):
        records.append((offset, len(raw), raw[offset:]))
    return records


def find_unique_line(records: list[tuple[int, int, bytes]], literal: str, label: str) -> int:
    encoded = literal.encode("utf-8")
    matches = [start for start, _end, line in records if line.strip() == encoded]
    if len(matches) != 1:
        raise ValueError(f"Expected one {label} line {literal!r}, found {len(matches)}")
    return matches[0]


def find_last_exact_line(records: list[tuple[int, int, bytes]], literal: str, label: str) -> int:
    encoded = literal.encode("utf-8")
    matches = [start for start, _end, line in records if line.strip() == encoded]
    if not matches:
        raise ValueError(f"Expected at least one {label} line {literal!r}")
    return matches[-1]


def sequence_profile(numbers: list[int]) -> dict[str, Any]:
    counts = collections.Counter(numbers)
    missing = sorted(set(range(1, numbers[-1] + 1)) - set(numbers))
    duplicates = sorted(number for number, count in counts.items() if count > 1)
    nonincreasing = [
        {"source_ordinal": ordinal, "from": previous, "to": current}
        for ordinal, (previous, current) in enumerate(zip(numbers, numbers[1:]), start=2)
        if current <= previous
    ]
    return {
        "section_count": len(numbers),
        "first_literal_number": numbers[0],
        "last_literal_number": numbers[-1],
        "missing_literal_numbers": missing,
        "duplicate_literal_numbers": duplicates,
        "nonincreasing_transitions": nonincreasing,
    }


def validate_plan(plan: dict[str, Any]) -> None:
    if plan.get("contract") != CONTRACT:
        raise ValueError("Contract drift")
    if plan.get("action") != "register_existing_source_references_and_publish_exact_narrative_sections_without_copying_source_payloads":
        raise ValueError("Action/copy boundary drift")
    if plan["structure"]["passage_count"] != 652 or plan["structure"]["kanda_count"] != 7:
        raise ValueError("Expected seven kāṇḍas and 652 literal section units")
    if len(plan["source_objects"]) != 4 or [row["volume"] for row in plan["source_objects"]] != [1, 2, 3, 4]:
        raise ValueError("Expected exact four-volume source universe")
    if len(plan["structure"]["kanda_profiles"]) != 7:
        raise ValueError("Expected exact seven-kāṇḍa profile universe")
    if plan["rights_decision"]["lane"] != "product_allowed" or plan["rights_decision"]["publication_state"] != "published":
        raise ValueError("Product rights/publication boundary drift")
    denials = plan["product_boundary"]["completion_denials"]
    if set(denials) != {
        "page_by_page_reconciliation_to_all_seven_print_scans_complete",
        "literal_section_numbering_gap_free_or_corrected",
        "complete_valmiki_sanskrit_source_or_critical_edition",
        "complete_ramayana_tradition_or_all_recensions",
        "all_ramayana_translations_commentaries_and_adaptations",
        "hindi_translation_present_in_this_expression",
        "ramayana_hero_universe_complete",
        "mvp_library_complete",
    } or any(denials.values()):
        raise ValueError("Completion-denial contract drift")
    if plan["mutation_boundary"] != {
        "copy_or_download_source_payload": False,
        "create_reader_payload": False,
        "modify_existing_source_bytes": False,
        "silently_correct_literal_section_labels": False,
        "promote_unrelated_expression_or_edition": False,
    }:
        raise ValueError("Mutation boundary drift")
    expression = plan["expression"]
    if expression["is_source_original"] is not False or expression["ai_generated"] is not False:
        raise ValueError("Translation identity drift")


def verify_upstream_acquisition(plan: dict[str, Any]) -> str:
    upstream = ROOT / plan["upstream_acquisition"]["plan_path"]
    upstream = upstream.resolve(strict=True)
    if not upstream.is_relative_to((ROOT / "ingestion" / "plans").resolve()):
        raise ValueError("Upstream acquisition plan escapes ingestion/plans")
    raw = upstream.read_bytes()
    acquisition = json.loads(raw.decode("utf-8", errors="strict"))
    if acquisition.get("contract") != plan["upstream_acquisition"]["expected_contract"]:
        raise ValueError("Upstream acquisition contract drift")
    expected = [
        {
            "name": source["name"],
            "url": source["source_url"],
            "final_url": source["source_url"],
            "bytes": source["bytes"],
            "sha256": source["sha256"],
            "media_type": source["media_type"],
            "strict_utf8": True,
        }
        for source in plan["source_objects"]
    ]
    observed = [
        {key: row[key] for key in ("name", "url", "final_url", "bytes", "sha256", "media_type", "strict_utf8")}
        for row in acquisition["files"]
    ]
    if observed != expected:
        raise ValueError("Product plan source universe differs from frozen acquisition")
    return sha256_bytes(raw)


def locate_sections(raw: bytes, source: dict[str, Any], profiles: list[dict[str, Any]]) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    try:
        text = raw.decode("utf-8", errors="strict")
    except UnicodeDecodeError as exc:
        raise ValueError(f"Volume {source['volume']} is not strict UTF-8") from exc
    if text.encode("utf-8") != raw:
        raise ValueError(f"Volume {source['volume']} fails UTF-8 byte roundtrip")
    for literal in (
        f"Title: {source['provider_title']}",
        "Creator: Valmiki",
        "Translator: Manmatha Nath Dutt",
        source["start_marker"],
        source["end_marker"],
    ):
        if text.count(literal) != 1:
            raise ValueError(f"Volume {source['volume']} identity literal drift: {literal}")
    records = line_records(raw)
    end_offset = find_unique_line(records, source["end_marker"], "Project Gutenberg END marker")
    # The first-volume front matter repeats some kāṇḍa titles. The body header
    # is the last exact title line before that kāṇḍa's SECTION sequence.
    header_offsets = [find_last_exact_line(records, profile["header_literal"], f"{profile['kanda_slug']} header") for profile in profiles]
    if header_offsets != sorted(header_offsets) or not all(offset < end_offset for offset in header_offsets):
        raise ValueError(f"Volume {source['volume']} kāṇḍa order drift")

    passages: list[dict[str, Any]] = []
    body_start = header_offsets[0]
    global_in_volume = 0
    for index, profile in enumerate(profiles):
        kanda_start = header_offsets[index]
        kanda_end = header_offsets[index + 1] if index + 1 < len(header_offsets) else end_offset
        section_rows: list[tuple[int, str, int]] = []
        for start, _line_end, line in records:
            if not kanda_start <= start < kanda_end:
                continue
            match = SECTION_LINE.fullmatch(line.strip())
            if match:
                marker = match.group(1).decode("ascii")
                section_rows.append((start, marker, roman_to_int(marker)))
        if not section_rows:
            raise ValueError(f"No SECTION headings in {profile['kanda_slug']}")
        numbers = [row[2] for row in section_rows]
        observed_profile = sequence_profile(numbers)
        expected_profile = {key: profile[key] for key in observed_profile}
        if observed_profile != expected_profile:
            raise ValueError(f"Literal section sequence drift in {profile['kanda_slug']}: {observed_profile}")
        counts = collections.Counter(numbers)
        for local_ordinal, (heading_start, marker, number) in enumerate(section_rows, start=1):
            global_in_volume += 1
            span_start = kanda_start if local_ordinal == 1 else heading_start
            span_end = section_rows[local_ordinal][0] if local_ordinal < len(section_rows) else kanda_end
            raw_span = raw[span_start:span_end]
            exact_text = " ".join(raw_span.decode("utf-8", errors="strict").split())
            if not exact_text or "SECTION " not in exact_text:
                raise ValueError(f"Empty or unlabelled passage at volume {source['volume']} ordinal {global_in_volume}")
            lowered = exact_text.casefold()
            if any(forbidden in lowered for forbidden in ("project gutenberg", "gutenberg.org", "project gutenberg license")):
                raise ValueError("Project Gutenberg license/trademark framing leaked into a product passage")
            statuses: list[str] = []
            if counts[number] > 1:
                statuses.append("duplicate_literal_number")
            if local_ordinal > 1:
                previous = numbers[local_ordinal - 2]
                if number <= previous:
                    statuses.append("nonincreasing_literal_transition")
                elif number != previous + 1:
                    statuses.append("literal_number_gap_or_jump_before_unit")
            if not statuses:
                statuses.append("literal_label_preserved")
            passages.append({
                "source_sha256": source["sha256"],
                "source_ordinal": global_in_volume,
                "locator": {
                    "contract": "DEVAM_DUTT_PG_SECTION_BYTE_SPAN_V1",
                    "work_slug": "valmiki-ramayana",
                    "provider": "Project Gutenberg",
                    "ebook_id": source["ebook_id"],
                    "source_sha256": source["sha256"],
                    "volume": source["volume"],
                    "kanda_ordinal": profile["kanda_ordinal"],
                    "kanda_slug": profile["kanda_slug"],
                    "kanda_title": profile["kanda_title"],
                    "kanda_source_ordinal": local_ordinal,
                    "literal_marker": marker,
                    "literal_section_number": number,
                    "source_relative_ordinal": global_in_volume,
                    "byte_start": span_start,
                    "byte_end_exclusive": span_end,
                    "line_start": raw.count(b"\n", 0, span_start) + 1,
                    "line_end": raw.count(b"\n", 0, max(span_start, span_end - 1)) + 1,
                    "span_sha256": sha256_bytes(raw_span),
                    "numbering_status": statuses,
                    "printed_number_not_unique_key": True,
                },
                "language_code": "en",
                "script_code": "Latn",
                "exact_text": exact_text,
                "span_sha256": sha256_bytes(raw_span),
            })
        terminal = profile["terminal_literal"]
        if terminal is not None and terminal.casefold() not in raw[kanda_start:kanda_end].decode("utf-8").casefold():
            raise ValueError(f"Terminal literal missing for {profile['kanda_slug']}")
        if terminal is None:
            if profile["kanda_slug"] != "bala" or index + 1 >= len(profiles) or profiles[index + 1]["kanda_slug"] != "ayodhya":
                raise ValueError("Only the bounded Bāla-to-Ayodhyā transition may use terminal evidence without an end formula")
            if not profile.get("terminal_evidence"):
                raise ValueError("Bāla transition evidence is absent")

    body = raw[body_start:end_offset]
    covered = b"".join(raw[row["locator"]["byte_start"]:row["locator"]["byte_end_exclusive"]] for row in passages)
    if covered != body:
        raise ValueError(f"Volume {source['volume']} passage spans do not losslessly cover the narrative body")
    return passages, {
        "volume": source["volume"],
        "source_sha256": source["sha256"],
        "body_byte_start": body_start,
        "body_byte_end_exclusive": end_offset,
        "body_bytes": len(body),
        "body_sha256": sha256_bytes(body),
        "passage_count": len(passages),
        "lossless_span_coverage": True,
    }


def compile_packet(plan_path: Path) -> dict[str, Any]:
    plan_bytes = plan_path.read_bytes()
    plan = json.loads(plan_bytes.decode("utf-8", errors="strict"))
    validate_plan(plan)
    acquisition_sha = verify_upstream_acquisition(plan)
    profiles_by_volume: dict[int, list[dict[str, Any]]] = collections.defaultdict(list)
    for profile in plan["structure"]["kanda_profiles"]:
        profiles_by_volume[profile["volume"]].append(profile)
    passages: list[dict[str, Any]] = []
    bodies: list[dict[str, Any]] = []
    for source in plan["source_objects"]:
        raw = read_verified_object(source)
        source_passages, body = locate_sections(raw, source, profiles_by_volume[source["volume"]])
        passages.extend(source_passages)
        bodies.append(body)
    if len(passages) != plan["structure"]["passage_count"]:
        raise ValueError(f"Passage universe drift: {len(passages)}")
    core = {
        **plan,
        "source_copy_policy": COPY_POLICY,
        "plan_sha256": sha256_bytes(plan_bytes),
        "upstream_acquisition_plan_sha256": acquisition_sha,
        "passages": passages,
        "body_profiles": bodies,
        "source_object_count": len(plan["source_objects"]),
        "passage_count": len(passages),
    }
    return {**core, "packet_sha256": sha256_bytes(canonical_json(core).encode("utf-8"))}


def compile_statements(packet: dict[str, Any]) -> list[str]:
    work = packet["work"]
    expression = packet["expression"]
    edition = packet["edition"]
    rights = packet["rights_decision"]
    structure = packet["structure"]
    statements = [
        f"""insert into public.works (slug, canonical_title, work_kind, tradition_scope, summary, rights_lane, publication_state)
values ({sql_quote(work['slug'])}, {sql_quote(work['canonical_title'])}, {sql_quote(work['work_kind'])}, array[{','.join(sql_quote(value) for value in work['tradition_scope'])}]::text[], {sql_quote(work['summary'])}, 'product_allowed', 'published')
on conflict (slug) do update set canonical_title=excluded.canonical_title, work_kind=excluded.work_kind, tradition_scope=excluded.tradition_scope, summary=excluded.summary, rights_lane='product_allowed', publication_state='published';""",
        f"""insert into public.expressions (work_id, language_code, script_code, expression_kind, attribution, is_source_original, ai_generated, rights_lane, publication_state)
select w.id, {sql_quote(expression['language_code'])}, {sql_quote(expression['script_code'])}, {sql_quote(expression['expression_kind'])}, {sql_quote(expression['attribution'])}, false, false, 'product_allowed', 'published'
from public.works w where w.slug={sql_quote(work['slug'])}
on conflict (work_id, language_code, expression_kind, attribution) do update set script_code=excluded.script_code, is_source_original=false, ai_generated=false, rights_lane='product_allowed', publication_state='published';""",
        f"""insert into public.editions (expression_id, edition_title, publisher, publication_place, publication_year, edition_statement, identifiers, rights_lane, publication_state)
select e.id, {sql_quote(edition['edition_title'])}, {sql_quote(edition['publisher'])}, null, {edition['publication_year']}, {sql_quote(edition['edition_statement'])}, {json_sql(edition['identifiers'])}, 'product_allowed', 'published'
from public.expressions e join public.works w on w.id=e.work_id
where w.slug={sql_quote(work['slug'])} and e.language_code={sql_quote(expression['language_code'])} and e.expression_kind={sql_quote(expression['expression_kind'])} and e.attribution={sql_quote(expression['attribution'])}
and not exists (select 1 from public.editions d where d.expression_id=e.id and d.edition_title={sql_quote(edition['edition_title'])});""",
        f"""update public.editions d set publisher={sql_quote(edition['publisher'])}, publication_place=null, publication_year={edition['publication_year']}, edition_statement={sql_quote(edition['edition_statement'])}, identifiers={json_sql(edition['identifiers'])}, rights_lane='product_allowed', publication_state='published'
from public.expressions e join public.works w on w.id=e.work_id
where d.expression_id=e.id and w.slug={sql_quote(work['slug'])} and e.language_code={sql_quote(expression['language_code'])} and e.expression_kind={sql_quote(expression['expression_kind'])} and e.attribution={sql_quote(expression['attribution'])} and d.edition_title={sql_quote(edition['edition_title'])};""",
    ]
    for source in packet["source_objects"]:
        provenance = {
            "ingestion_contract": CONTRACT,
            "ingestion_id": packet["ingestion_id"],
            "ingestion_packet_sha256": packet["packet_sha256"],
            "source_copy_policy": COPY_POLICY,
            "object_path": source["object_path"],
            "volume": source["volume"],
            "ebook_id": source["ebook_id"],
            "body_profile": next(row for row in packet["body_profiles"] if row["volume"] == source["volume"]),
            "product_boundary": packet["product_boundary"],
            "mutation_boundary": packet["mutation_boundary"],
        }
        statements.append(f"""insert into public.source_objects (edition_id, sha256, byte_count, media_type, storage_backend, storage_bucket, storage_key, provider, provider_identifier, source_url, acquired_at, provenance, completeness_status, rights_lane, rights_basis)
select d.id, {sql_quote(source['sha256'])}, {source['bytes']}, {sql_quote(source['media_type'])}, 'local_vault', null, {sql_quote(source['object_path'])}, {sql_quote(packet['provider']['name'])}, {sql_quote('pg:' + str(source['ebook_id']) + ':text')}, {sql_quote(source['source_url'])}, {sql_quote(packet['provider']['acquired_at'])}::timestamptz, {json_sql(provenance)}, {sql_quote(structure['edition_completeness_status'])}, 'product_allowed', {json_sql(rights)}
from public.editions d join public.expressions e on e.id=d.expression_id join public.works w on w.id=e.work_id
where w.slug={sql_quote(work['slug'])} and e.language_code={sql_quote(expression['language_code'])} and e.expression_kind={sql_quote(expression['expression_kind'])} and e.attribution={sql_quote(expression['attribution'])} and d.edition_title={sql_quote(edition['edition_title'])}
on conflict (sha256) do update set edition_id=excluded.edition_id, byte_count=excluded.byte_count, media_type=excluded.media_type, storage_backend=excluded.storage_backend, storage_bucket=excluded.storage_bucket, storage_key=excluded.storage_key, provider=excluded.provider, provider_identifier=excluded.provider_identifier, source_url=excluded.source_url, acquired_at=excluded.acquired_at, provenance=excluded.provenance, completeness_status=excluded.completeness_status, rights_lane='product_allowed', rights_basis=excluded.rights_basis;""")
    for passage in packet["passages"]:
        statements.append(f"""insert into public.passages (source_object_id, source_ordinal, locator, language_code, script_code, exact_text, text_status, span_sha256, rights_lane, publication_state)
select s.id, {passage['source_ordinal']}, {json_sql(passage['locator'])}, 'en', 'Latn', {dollar_quote(passage['exact_text'])}, {sql_quote(structure['text_status'])}, {sql_quote(passage['span_sha256'])}, 'product_allowed', 'published'
from public.source_objects s where s.sha256={sql_quote(passage['source_sha256'])}
on conflict (source_object_id, source_ordinal) do update set locator=excluded.locator, language_code='en', script_code='Latn', exact_text=excluded.exact_text, text_status=excluded.text_status, span_sha256=excluded.span_sha256, rights_lane='product_allowed', publication_state='published';""")
    return statements


def compile_sql(packet: dict[str, Any]) -> str:
    return "\n\n".join(["begin;", *compile_statements(packet), "commit;"]) + "\n"


def compile_batches(packet: dict[str, Any], max_chars: int = 28000) -> list[str]:
    statements = compile_statements(packet)
    metadata_count = 4 + packet["source_object_count"]
    batches = ["\n\n".join(["begin;", *statements[:metadata_count], "commit;"]) + "\n"]
    current: list[str] = []
    chars = 0
    for statement in statements[metadata_count:]:
        if current and chars + len(statement) > max_chars:
            batches.append("\n\n".join(["begin;", *current, "commit;"]) + "\n")
            current, chars = [], 0
        current.append(statement)
        chars += len(statement)
    if current:
        batches.append("\n\n".join(["begin;", *current, "commit;"]) + "\n")
    return batches


def passage_root(packet: dict[str, Any]) -> str:
    rows = [
        f"{row['source_sha256']}\t{row['source_ordinal']}\t{row['span_sha256']}\t{sha256_bytes(row['exact_text'].encode('utf-8'))}\t{canonical_json(row['locator'])}"
        for row in packet["passages"]
    ]
    return sha256_bytes("\n".join(rows).encode("utf-8"))


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Compile Dutt's four-volume Project Gutenberg Ramayana electronic edition.")
    parser.add_argument("--plan", required=True, type=Path)
    parser.add_argument("--format", choices=("report", "sql", "sql-batch", "sql-base64", "sql-batch-base64"), default="report")
    parser.add_argument("--batch-index", type=int)
    parser.add_argument("--write-report", type=Path)
    args = parser.parse_args()
    path = args.plan.resolve(strict=True)
    if not path.is_relative_to((ROOT / "ingestion" / "plans").resolve()):
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
            "ingestion_id": packet["ingestion_id"],
            "plan_sha256": packet["plan_sha256"],
            "upstream_acquisition_plan_sha256": packet["upstream_acquisition_plan_sha256"],
            "packet_sha256": packet["packet_sha256"],
            "sql_sha256": sha256_bytes(sql.encode("utf-8")),
            "sql_batch_count": len(batches),
            "sql_batch_sha256": [sha256_bytes(batch.encode("utf-8")) for batch in batches],
            "source_object_count": packet["source_object_count"],
            "source_object_bytes": sum(source["bytes"] for source in packet["source_objects"]),
            "kanda_count": packet["structure"]["kanda_count"],
            "passage_count": packet["passage_count"],
            "passage_content_root_sha256": passage_root(packet),
            "body_profiles": packet["body_profiles"],
            "source_payloads_copied": False,
            "positive_claim": packet["product_boundary"]["positive_claim"],
            **packet["product_boundary"]["completion_denials"],
        }
        rendered = json.dumps(report, ensure_ascii=False, indent=2, sort_keys=True) + "\n"
        if args.write_report:
            output = args.write_report.resolve()
            if not output.is_relative_to((ROOT / "ingestion" / "reports").resolve()):
                raise ValueError("Report must be inside ingestion/reports")
            output.parent.mkdir(parents=True, exist_ok=True)
            output.write_text(rendered, encoding="utf-8", newline="\n")
        sys.stdout.write(rendered)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

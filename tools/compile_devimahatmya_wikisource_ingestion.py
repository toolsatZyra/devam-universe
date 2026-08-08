from __future__ import annotations

import argparse
import base64
import hashlib
import json
import re
import sys
from pathlib import Path
from typing import Any

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from tools.compile_source_vault_tei_ingestion import (
    ROOT,
    json_sql,
    read_verified_object,
    sql_quote,
)


CONTRACT = "DEVAM_DEVIMAHATMYA_WIKISOURCE_INGESTION_V1"
PLAN = ROOT / "ingestion/plans/devimahatmya-wikisource-sanskrit-v1.json"
ACQUISITION_PLAN = ROOT / "ingestion/plans/devimahatmya-wikisource-sanskrit-source-acquisition-v1.json"
ACQUISITION_REPORT = ROOT / "ingestion/reports/devimahatmya-wikisource-sanskrit-source-acquisition-v1.json"
REPORT = ROOT / "ingestion/reports/devimahatmya-wikisource-sanskrit-ingestion-v1.json"

DEVANAGARI_DIGITS = "०१२३४५६७८९"
DHYAYA = "ध्याय"
ITI = "इति"
DOUBLE_DANDA = "॥"
VERSE_RE = re.compile(
    DOUBLE_DANDA
    + r"\s*(?P<chapter>[०-९]+)\.\s*(?P<verse>[०-९]+)\s*"
    + DOUBLE_DANDA
)
DIGIT_RE = re.compile(r"[०-९]+")
TAG_RE = re.compile(r"</?(?:poem|span)\b[^>]*>", re.IGNORECASE)
WIKILINK_RE = re.compile(r"\[\[(?:[^\]|]+\|)?([^\]]+)\]\]")
EXTERNAL_LINK_RE = re.compile(r"\[https?://[^\s\]]+\s+([^\]]+)\]")
SIMPLE_TEMPLATE_RE = re.compile(r"\{\{[^{}]*\}\}")


def canonical_json(value: object) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def sha256_path(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def devanagari_number(value: str) -> int:
    return int("".join(str(DEVANAGARI_DIGITS.index(char)) for char in value))


def utf8_sql(value: str) -> str:
    encoded = base64.b64encode(value.encode("utf-8")).decode("ascii")
    return f"convert_from(decode({sql_quote(encoded)}, 'base64'), 'UTF8')"


def strict_utf8(data: bytes, label: str) -> str:
    text = data.decode("utf-8", errors="strict")
    if text.encode("utf-8") != data:
        raise ValueError(f"UTF-8 roundtrip failed: {label}")
    return text


def clean_projection(raw: bytes) -> str:
    text = strict_utf8(raw, "verse span")
    text = TAG_RE.sub(" ", text)
    text = SIMPLE_TEMPLATE_RE.sub(" ", text)
    text = WIKILINK_RE.sub(lambda match: match.group(1), text)
    text = EXTERNAL_LINK_RE.sub(lambda match: match.group(1), text)
    text = text.replace("'''", "").replace("''", "")
    return re.sub(r"\s+", " ", text).strip()


def line_number(data: bytes, offset: int) -> int:
    return data.count(b"\n", 0, offset) + 1


def find_headings(text: str, expected: list[int]) -> list[dict[str, Any]]:
    headings: list[dict[str, Any]] = []
    cursor = 0
    for line in text.splitlines(keepends=True):
        stripped = line.strip()
        numbers = DIGIT_RE.findall(stripped)
        if (
            DHYAYA in stripped
            and numbers
            and not stripped.startswith(ITI)
            and not stripped.startswith("|")
            and not stripped.startswith("[")
        ):
            chapter = devanagari_number(numbers[-1])
            if chapter in expected:
                headings.append(
                    {
                        "chapter": chapter,
                        "heading_literal": stripped,
                        "char_start": cursor,
                        "char_end": cursor + len(line),
                    }
                )
        cursor += len(line)
    if [row["chapter"] for row in headings] != expected:
        raise ValueError(f"Chapter-heading sequence drift: {[row['chapter'] for row in headings]}")
    return headings


def parse_source(source: dict[str, Any], data: bytes, global_ordinal: int) -> tuple[list[dict[str, Any]], list[dict[str, Any]], int]:
    text = strict_utf8(data, source["name"])
    expected_chapters = list(range(source["chapter_start"], source["chapter_end"] + 1))
    headings = find_headings(text, expected_chapters)
    chapter_spans: list[dict[str, Any]] = []
    passages: list[dict[str, Any]] = []
    local_ordinal = 0

    for index, heading in enumerate(headings):
        chapter = heading["chapter"]
        chapter_start_char = heading["char_start"]
        content_start_char = heading["char_end"]
        chapter_end_char = headings[index + 1]["char_start"] if index + 1 < len(headings) else len(text)
        chapter_start_byte = len(text[:chapter_start_char].encode("utf-8"))
        chapter_end_byte = len(text[:chapter_end_char].encode("utf-8"))
        chapter_raw = data[chapter_start_byte:chapter_end_byte]
        matches = list(VERSE_RE.finditer(text, content_start_char, chapter_end_char))
        sequence = [
            (devanagari_number(match.group("chapter")), devanagari_number(match.group("verse")))
            for match in matches
        ]
        expected_count = int(load_plan()["expected_verse_counts"][str(chapter)])
        expected_sequence = [(chapter, verse) for verse in range(1, expected_count + 1)]
        if sequence != expected_sequence:
            raise ValueError(f"Verse sequence drift in chapter {chapter}: {sequence}")

        chapter_spans.append(
            {
                "chapter": chapter,
                "heading_literal": heading["heading_literal"],
                "source_sha256": source["sha256"],
                "source_byte_start": chapter_start_byte,
                "source_byte_end_exclusive": chapter_end_byte,
                "source_line_start": line_number(data, chapter_start_byte),
                "source_line_end": line_number(data, chapter_end_byte),
                "verse_count": expected_count,
                "span_sha256": sha256_bytes(chapter_raw),
            }
        )

        previous_end_char = content_start_char
        for verse_index, match in enumerate(matches):
            verse = verse_index + 1
            end_char = chapter_end_char if verse == expected_count else match.end()
            start_byte = len(text[:previous_end_char].encode("utf-8"))
            end_byte = len(text[:end_char].encode("utf-8"))
            raw_span = data[start_byte:end_byte]
            exact_text = clean_projection(raw_span)
            if not exact_text or match.group(0) not in strict_utf8(raw_span, "verse marker span"):
                raise ValueError(f"Empty or markerless verse projection: {chapter}.{verse}")
            local_ordinal += 1
            global_ordinal += 1
            passages.append(
                {
                    "source_sha256": source["sha256"],
                    "source_ordinal": local_ordinal,
                    "citation_ordinal": global_ordinal,
                    "locator": {
                        "provider": "Sanskrit Wikisource",
                        "page_id": source["page_id"],
                        "revision_id": source["revision_id"],
                        "chapter": chapter,
                        "verse": verse,
                        "citation_ordinal": global_ordinal,
                        "literal_marker": match.group(0),
                        "source_byte_start": start_byte,
                        "source_byte_end_exclusive": end_byte,
                        "source_line_start": line_number(data, start_byte),
                        "source_line_end": line_number(data, end_byte),
                        "underlying_print_edition_identified": False,
                        "textual_recension_identified": False,
                    },
                    "exact_text": exact_text,
                    "span_sha256": sha256_bytes(raw_span),
                }
            )
            previous_end_char = match.end()

        reconstructed = b"".join(
            data[row["locator"]["source_byte_start"] : row["locator"]["source_byte_end_exclusive"]]
            for row in passages
            if row["source_sha256"] == source["sha256"] and row["locator"]["chapter"] == chapter
        )
        expected_body = data[len(text[:content_start_char].encode("utf-8")) : chapter_end_byte]
        if reconstructed != expected_body:
            raise ValueError(f"Verse spans do not losslessly reconstruct chapter {chapter} body")

    return chapter_spans, passages, global_ordinal


_PLAN_CACHE: dict[str, Any] | None = None


def load_plan() -> dict[str, Any]:
    global _PLAN_CACHE
    if _PLAN_CACHE is None:
        _PLAN_CACHE = json.loads(PLAN.read_text(encoding="utf-8"))
    return _PLAN_CACHE


def validate_inputs(plan: dict[str, Any]) -> None:
    if plan.get("contract") != CONTRACT or plan.get("profile_id") != "devimahatmya-wikisource-sanskrit-v1":
        raise ValueError("Ingestion plan identity drift")
    if sha256_path(ACQUISITION_PLAN) != plan["acquisition_plan_sha256"]:
        raise ValueError("Acquisition plan hash drift")
    if sha256_path(ACQUISITION_REPORT) != plan["acquisition_report_sha256"]:
        raise ValueError("Acquisition report hash drift")
    if plan["rights"]["lane"] != "derivative_allowed" or plan["publication"]["state"] != "published":
        raise ValueError("Product publication boundary drift")
    if plan["rights"]["underlying_print_edition_rights_inferred"]:
        raise ValueError("Underlying print-edition rights must not be inferred")
    if any(plan["completion_denials"].values()):
        raise ValueError("All completion denials must remain false")
    sources = plan["source_objects"]
    if len(sources) != 3 or [(row["chapter_start"], row["chapter_end"]) for row in sources] != [(81, 85), (86, 90), (91, 93)]:
        raise ValueError("Three-carrier chapter universe drift")
    if sum(plan["expected_verse_counts"].values()) != 588:
        raise ValueError("Expected verse count must remain 588")


def compile_packet() -> dict[str, Any]:
    plan = load_plan()
    validate_inputs(plan)
    chapter_spans: list[dict[str, Any]] = []
    passages: list[dict[str, Any]] = []
    global_ordinal = 0
    for source in plan["source_objects"]:
        data = read_verified_object(source)
        source_chapters, source_passages, global_ordinal = parse_source(source, data, global_ordinal)
        chapter_spans.extend(source_chapters)
        passages.extend(source_passages)
    if [row["chapter"] for row in chapter_spans] != list(range(81, 94)) or len(passages) != 588:
        raise ValueError("Complete 13-chapter/588-verse structure not proved")
    terminal_chapter = next(row for row in chapter_spans if row["chapter"] == 93)
    terminal_data = read_verified_object(plan["source_objects"][-1])[
        terminal_chapter["source_byte_start"] : terminal_chapter["source_byte_end_exclusive"]
    ]
    terminal_text = strict_utf8(terminal_data, "chapter 93 terminal")
    if "वरप्रदानं नाम त्रिनवतितमोऽध्यायः" not in terminal_text:
        raise ValueError("Chapter 93 terminal colophon drift")
    core = {**plan, "chapter_spans": chapter_spans, "passages": passages}
    return {**core, "packet_sha256": sha256_bytes(canonical_json(core).encode("utf-8"))}


def compile_statements(packet: dict[str, Any]) -> list[str]:
    work, expression, edition = packet["work"], packet["expression"], packet["edition"]
    rights, state, text_status = packet["rights"], packet["publication"]["state"], packet["publication"]["text_status"]
    completeness = "complete_exact_wikisource_chapters_81_93_13_chapter_588_verse_provider_revision_unidentified_print_edition_and_recension"
    summary = (
        "Mārkaṇḍeyapurāṇa represented by product-compatible historical and digital expressions. "
        "The pinned Sanskrit Wikisource expression covers chapters 81-93 with 588 verse markers; its underlying print edition and recension remain unidentified."
    )
    statements = [
        f"""insert into public.works (slug, canonical_title, work_kind, tradition_scope, summary, rights_lane, publication_state) values ({sql_quote(work['slug'])}, {utf8_sql(work['canonical_title'])}, {sql_quote(work['work_kind'])}, array[{','.join(sql_quote(value) for value in work['tradition_scope'])}]::text[], {utf8_sql(summary)}, 'product_allowed', 'published') on conflict (slug) do update set canonical_title=excluded.canonical_title, work_kind=excluded.work_kind, tradition_scope=excluded.tradition_scope, summary=excluded.summary;""",
        f"""insert into public.expressions (work_id, language_code, script_code, expression_kind, attribution, is_source_original, ai_generated, rights_lane, publication_state) select w.id, {sql_quote(expression['language_code'])}, {sql_quote(expression['script_code'])}, {sql_quote(expression['expression_kind'])}, {utf8_sql(expression['attribution'])}, false, false, 'derivative_allowed', {sql_quote(state)} from public.works w where w.slug={sql_quote(work['slug'])} on conflict (work_id, language_code, expression_kind, attribution) do update set script_code=excluded.script_code, is_source_original=false, ai_generated=false, rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;""",
        f"""insert into public.editions (expression_id, edition_title, publisher, publication_place, publication_year, edition_statement, identifiers, rights_lane, publication_state) select e.id, {utf8_sql(edition['edition_title'])}, {utf8_sql(edition['publisher'])}, null, null, {utf8_sql(edition['edition_statement'])}, {json_sql(edition['identifiers'])}, 'derivative_allowed', {sql_quote(state)} from public.expressions e join public.works w on w.id=e.work_id where w.slug={sql_quote(work['slug'])} and e.attribution={utf8_sql(expression['attribution'])} and not exists (select 1 from public.editions d where d.expression_id=e.id and d.edition_title={utf8_sql(edition['edition_title'])});""",
    ]
    for source in packet["source_objects"]:
        provenance = {
            "contract": CONTRACT,
            "profile_id": packet["profile_id"],
            "packet_sha256": packet["packet_sha256"],
            "source_path": source["source_path"],
            "chapter_range": [source["chapter_start"], source["chapter_end"]],
            "completion_denials": packet["completion_denials"],
            "source_payloads_copied_into_app": False,
        }
        provider_identifier = f"wikisource:sa:page-{source['page_id']}:revision-{source['revision_id']}"
        statements.append(
            f"""insert into public.source_objects (edition_id, sha256, byte_count, media_type, storage_backend, storage_bucket, storage_key, provider, provider_identifier, source_url, acquired_at, provenance, completeness_status, rights_lane, rights_basis) select d.id, {sql_quote(source['sha256'])}, {source['bytes']}, {sql_quote(source['media_type'])}, 'local_vault', null, {sql_quote(source['object_path'])}, 'Sanskrit Wikisource', {sql_quote(provider_identifier)}, {sql_quote(next(row['url'] for row in json.loads(ACQUISITION_PLAN.read_text(encoding='utf-8'))['files'] if row['sha256'] == source['sha256']))}, {sql_quote(json.loads(ACQUISITION_REPORT.read_text(encoding='utf-8'))['source_vault_after'].get('verified_at', '2026-08-08T07:29:35.1687927+05:30'))}::timestamptz, {json_sql(provenance)}, {sql_quote(completeness)}, 'derivative_allowed', {json_sql(rights)} from public.editions d join public.expressions e on e.id=d.expression_id join public.works w on w.id=e.work_id where w.slug={sql_quote(work['slug'])} and d.edition_title={utf8_sql(edition['edition_title'])} on conflict (sha256) do update set edition_id=excluded.edition_id, byte_count=excluded.byte_count, media_type=excluded.media_type, storage_backend=excluded.storage_backend, storage_bucket=excluded.storage_bucket, storage_key=excluded.storage_key, provider=excluded.provider, provider_identifier=excluded.provider_identifier, source_url=excluded.source_url, acquired_at=excluded.acquired_at, provenance=excluded.provenance, completeness_status=excluded.completeness_status, rights_lane=excluded.rights_lane, rights_basis=excluded.rights_basis;"""
        )
    for passage in packet["passages"]:
        statements.append(
            f"""insert into public.passages (source_object_id, source_ordinal, locator, language_code, script_code, exact_text, text_status, span_sha256, rights_lane, publication_state) select s.id, {passage['source_ordinal']}, {json_sql(passage['locator'])}, 'sa', 'Deva', {utf8_sql(passage['exact_text'])}, {sql_quote(text_status)}, {sql_quote(passage['span_sha256'])}, 'derivative_allowed', {sql_quote(state)} from public.source_objects s where s.sha256={sql_quote(passage['source_sha256'])} on conflict (source_object_id, source_ordinal) do update set locator=excluded.locator, language_code=excluded.language_code, script_code=excluded.script_code, exact_text=excluded.exact_text, text_status=excluded.text_status, span_sha256=excluded.span_sha256, rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;"""
        )
    statements.extend(
        [
            """insert into public.entities (slug, entity_kind, canonical_name, description, rights_lane, publication_state) values ('durga', 'deity', 'Durgā', 'The Goddess represented through distinct textual, theological, ritual, regional, and living-practice evidence.', 'derivative_allowed', 'published') on conflict (slug) do update set entity_kind=excluded.entity_kind, canonical_name=excluded.canonical_name, description=excluded.description, rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;""",
            """insert into public.entities (slug, entity_kind, canonical_name, description, rights_lane, publication_state) values ('devi-mahatmya', 'scripture', 'Devī Māhātmya', 'A separately bounded thirteen-chapter sequence within the Mārkaṇḍeyapurāṇa, represented here by one exact pinned Sanskrit Wikisource transcription.', 'derivative_allowed', 'published') on conflict (slug) do update set entity_kind=excluded.entity_kind, canonical_name=excluded.canonical_name, description=excluded.description, rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;""",
            """insert into public.relationships (subject_entity_id, predicate, object_entity_id, applicability, rights_lane, publication_state) select text.id, 'sacred_text_of', deity.id, '{\"source_boundary\":\"exact pinned Sanskrit Wikisource transcription; not every Devi Mahatmya witness or Shakta tradition\"}'::jsonb, 'derivative_allowed', 'published' from public.entities text join public.entities deity on deity.slug='durga' where text.slug='devi-mahatmya' and not exists (select 1 from public.relationships r where r.subject_entity_id=text.id and r.predicate='sacred_text_of' and r.object_entity_id=deity.id and r.claim_id is null);""",
            """insert into public.claims (stable_key, subject_entity_id, statement, language_code, claim_kind, evidence_class, confidence, applicability, uncertainty_note, rights_lane, publication_state) select 'devimahatmya-wikisource-81-93-588-structure-en', e.id, 'Devam''s pinned Sanskrit Wikisource transcription contains Mārkaṇḍeyapurāṇa chapters 81 through 93 as thirteen ordered chapters with 588 ordered verse markers.', 'en', 'source_structure', 'provider_revision_structure', 1.000, '{\"source_boundary\":\"three exact Sanskrit Wikisource revisions\"}'::jsonb, 'This proves the exact provider-revision structure, not an identified print edition, critical recension, complete Mārkaṇḍeyapurāṇa, every Devī Māhātmya witness, translation, commentary, or ritual authority.', 'derivative_allowed', 'published' from public.entities e where e.slug='devi-mahatmya' on conflict (stable_key) do update set subject_entity_id=excluded.subject_entity_id, statement=excluded.statement, language_code=excluded.language_code, claim_kind=excluded.claim_kind, evidence_class=excluded.evidence_class, confidence=excluded.confidence, applicability=excluded.applicability, uncertainty_note=excluded.uncertainty_note, rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;""",
            """update public.atlas_nodes n set entity_id=e.id from public.entities e where n.slug='devi-mahatmya' and e.slug='devi-mahatmya';""",
        ]
    )
    terminal_verses = [row for row in packet["passages"] if (row["locator"]["chapter"], row["locator"]["verse"]) in {(85, 79), (90, 27), (93, 17)}]
    for row in terminal_verses:
        statements.append(
            f"""insert into public.claim_evidence (claim_id, passage_id, evidence_role, note) select c.id, p.id, 'supports', {json_sql({'profile_id': packet['profile_id'], 'chapter': row['locator']['chapter'], 'role': 'terminal verse and following chapter colophon within one pinned carrier'})} from public.claims c join public.source_objects s on s.sha256={sql_quote(row['source_sha256'])} join public.passages p on p.source_object_id=s.id and p.source_ordinal={row['source_ordinal']} where c.stable_key='devimahatmya-wikisource-81-93-588-structure-en' on conflict (claim_id, passage_id, evidence_role) do update set note=excluded.note;"""
        )
    return statements


def compile_batches(statements: list[str], max_chars: int = 20_000) -> list[str]:
    batches: list[str] = []
    current: list[str] = []
    size = 0
    for statement in statements:
        if current and size + len(statement) > max_chars:
            batches.append("\n\n".join(["begin;", *current, "commit;"]) + "\n")
            current, size = [], 0
        current.append(statement)
        size += len(statement)
    if current:
        batches.append("\n\n".join(["begin;", *current, "commit;"]) + "\n")
    return batches


def build_report(packet: dict[str, Any], batches: list[str]) -> dict[str, Any]:
    passage_rows = [
        f"{row['citation_ordinal']}\t{row['source_sha256']}\t{row['locator']['chapter']}.{row['locator']['verse']}\t{row['span_sha256']}\t{sha256_bytes(row['exact_text'].encode('utf-8'))}"
        for row in packet["passages"]
    ]
    chapter_rows = [
        f"{row['chapter']}\t{row['source_sha256']}\t{row['source_byte_start']}\t{row['source_byte_end_exclusive']}\t{row['verse_count']}\t{row['span_sha256']}"
        for row in packet["chapter_spans"]
    ]
    return {
        "result": "PASS",
        "contract": CONTRACT,
        "profile_id": packet["profile_id"],
        "packet_sha256": packet["packet_sha256"],
        "source_object_count": len(packet["source_objects"]),
        "source_object_bytes": sum(row["bytes"] for row in packet["source_objects"]),
        "chapter_count": len(packet["chapter_spans"]),
        "verse_passage_count": len(packet["passages"]),
        "chapter_span_root_sha256": sha256_bytes("\n".join(chapter_rows).encode("utf-8")),
        "passage_root_sha256": sha256_bytes("\n".join(passage_rows).encode("utf-8")),
        "sql_batch_count": len(batches),
        "sql_batch_sha256": [sha256_bytes(batch.encode("utf-8")) for batch in batches],
        "positive_boundary": packet["scope"]["positive"],
        "scope_boundary": packet["scope"]["boundary"],
        "completion_denials": packet["completion_denials"],
        "source_payloads_copied_into_app": False,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Compile the exact pinned Sanskrit Wikisource Devī Māhātmya transcription.")
    parser.add_argument("--format", choices=("report", "sql-batch", "sql-batch-base64"), default="report")
    parser.add_argument("--batch-index", type=int)
    parser.add_argument("--write-report", action="store_true")
    args = parser.parse_args()
    packet = compile_packet()
    batches = compile_batches(compile_statements(packet))
    report = build_report(packet, batches)
    if args.format in {"sql-batch", "sql-batch-base64"}:
        if args.batch_index is None or not 0 <= args.batch_index < len(batches):
            raise ValueError(f"--batch-index must be between 0 and {len(batches) - 1}")
        if args.format == "sql-batch-base64":
            sys.stdout.write(base64.b64encode(batches[args.batch_index].encode("utf-8")).decode("ascii"))
        else:
            sys.stdout.write(batches[args.batch_index])
        return 0
    rendered = json.dumps(report, ensure_ascii=False, indent=2, sort_keys=True) + "\n"
    if args.write_report:
        with REPORT.open("x", encoding="utf-8", newline="\n") as stream:
            stream.write(rendered)
    print(rendered, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

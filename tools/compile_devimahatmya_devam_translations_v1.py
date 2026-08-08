from __future__ import annotations

import argparse
import base64
import json
import sys
from pathlib import Path
from typing import Any

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from tools.compile_devimahatmya_wikisource_ingestion import (
    compile_packet as compile_source_packet,
)
from tools.compile_source_vault_tei_ingestion import (
    ROOT,
    canonical_json,
    sha256_bytes,
    sql_quote,
)
from tools.validate_devimahatmya_translation_draft_v1 import (
    DRAFT,
    load_rows,
    validate,
)


CONTRACT = "DEVAM_DEVIMAHATMYA_SOURCE_ALIGNED_TRANSLATION_PACK_V1"
PACK_ID = "durga-devimahatmya-wikisource-devam-translations-v1"
REPORT = ROOT / "ingestion/reports/devimahatmya-devam-translations-v1.json"
EXPECTED_DRAFT_SHA256 = "c2250ef4e7254f77600ea3e3751ff69f5c72c64ba36765c4152db8973ac46396"
EXPECTED_SOURCE_PACKET_SHA256 = "a895ab56eb74a2ed01d1b92f64ecffe7beb4f66b71327c741929f05bf4eb7d4f"
EXPECTED_SOURCE_PASSAGE_ROOT_SHA256 = "787a25875cdcab14e6b8ffee9c9772f71c7ade6c615abc20accb8471fe728b93"
EXPECTED_SOURCE_SHA256S = {
    "c7fe701aedeedffde57a51b21aa4f8fec697a7922939fb59ffa985e22cc9b7ae",
    "4459b0ca01f9a4173f1a137bf7c64908afbf326565b0b3f2dd2d2f5f830850fe",
    "446fb91efc40b94d7b59aa1d5b3116dd665b79ec68044985a8953483c8721814",
}
TRANSLATION = {
    "attribution": "Devam source-aligned translation v1",
    "method": "AI-assisted editorial translation from the exact pinned Sanskrit Wikisource passages, checked passage-by-passage against the frozen source coordinates",
    "review_status": "internal_beta_ai_assisted_not_independently_sanskrit_reviewed",
    "is_source_original": False,
    "ai_generated": True,
    "rights_lane": "derivative_allowed",
    "license_literal": "Creative Commons Attribution-ShareAlike 4.0 International",
    "license_url": "https://creativecommons.org/licenses/by-sa/4.0/",
    "attribution_required": True,
    "share_alike_required": True,
    "publication_state": "published",
}
COMPLETION = {
    "exact_source_passages_translated_en": 588,
    "exact_source_passages_translated_hi": 588,
    "exact_provider_revision_translation_coverage_complete": True,
    "independent_sanskrit_human_review_complete": False,
    "underlying_print_edition_identified": False,
    "textual_recension_identified": False,
    "all_textual_variants_complete": False,
    "formal_ritual_authority_established": False,
    "traditional_benefits_empirically_guaranteed": False,
    "complete_devimahatmya_tradition": False,
    "complete_markandeya_purana": False,
}


def _source_passage_root(passages: list[dict[str, Any]]) -> str:
    records = [
        f"{row['citation_ordinal']}\t{row['source_sha256']}\t{row['locator']['chapter']}.{row['locator']['verse']}\t{row['span_sha256']}\t{sha256_bytes(row['exact_text'].encode('utf-8'))}"
        for row in passages
    ]
    return sha256_bytes("\n".join(records).encode("utf-8"))


def _translation_content_root(rows: list[dict[str, Any]]) -> str:
    records = [
        {
            "citation_ordinal": row["citation_ordinal"],
            "source_sha256": row["source_sha256"],
            "source_ordinal": row["source_ordinal"],
            "source_span_sha256": row["source_span_sha256"],
            "english_sha256": sha256_bytes(row["english"].encode("utf-8")),
            "hindi_sha256": sha256_bytes(row["hindi"].encode("utf-8")),
            "confidence": row["confidence"],
            "note_sha256": sha256_bytes(row["note"].encode("utf-8")),
        }
        for row in rows
    ]
    return sha256_bytes(canonical_json(records).encode("utf-8"))


def load_pack(path: Path = DRAFT) -> dict[str, Any]:
    validation = validate(path, require_complete=True)
    data, rows = load_rows(path)
    if validation["draft_sha256"] != EXPECTED_DRAFT_SHA256 or sha256_bytes(data) != EXPECTED_DRAFT_SHA256:
        raise ValueError("Frozen complete translation draft drift")
    source_packet = compile_source_packet()
    if source_packet["packet_sha256"] != EXPECTED_SOURCE_PACKET_SHA256:
        raise ValueError("Frozen Sanskrit ingestion packet drift")
    if {row["sha256"] for row in source_packet["source_objects"]} != EXPECTED_SOURCE_SHA256S:
        raise ValueError("Frozen Sanskrit source-object universe drift")
    if _source_passage_root(source_packet["passages"]) != EXPECTED_SOURCE_PASSAGE_ROOT_SHA256:
        raise ValueError("Frozen Sanskrit passage root drift")
    if len(rows) != 588 or len(source_packet["passages"]) != 588:
        raise ValueError("Expected exactly 588 source-aligned translation rows")
    source_by_citation = {row["citation_ordinal"]: row for row in source_packet["passages"]}
    if sorted(source_by_citation) != list(range(1, 589)):
        raise ValueError("Sanskrit citation ordinal universe drift")
    for row in rows:
        source = source_by_citation[row["citation_ordinal"]]
        expected = (
            source["source_sha256"],
            source["source_ordinal"],
            source["span_sha256"],
            source["locator"]["chapter"],
            source["locator"]["verse"],
        )
        observed = (
            row["source_sha256"],
            row["source_ordinal"],
            row["source_span_sha256"],
            row["chapter"],
            row["verse"],
        )
        if observed != expected:
            raise ValueError(f"Source alignment drift at citation {row['citation_ordinal']}")
    return {
        "contract": CONTRACT,
        "pack_id": PACK_ID,
        "draft_path": str(path.relative_to(ROOT)).replace("\\", "/"),
        "draft_sha256": EXPECTED_DRAFT_SHA256,
        "translation_content_root_sha256": _translation_content_root(rows),
        "translation": TRANSLATION,
        "completion": COMPLETION,
        "source_packet": source_packet,
        "rows": rows,
    }


def stable_key(citation_ordinal: int, language_code: str) -> str:
    return f"durga-devimahatmya-wikisource-translation-{citation_ordinal:04d}-{language_code}"


def expected_claim_records(pack: dict[str, Any]) -> list[dict[str, Any]]:
    source_by_citation = {row["citation_ordinal"]: row for row in pack["source_packet"]["passages"]}
    records: list[dict[str, Any]] = []
    for row in pack["rows"]:
        source = source_by_citation[row["citation_ordinal"]]
        locator = source["locator"]
        for language_code, field, language_name in (("en", "english", "English"), ("hi", "hindi", "Hindi")):
            applicability = {
                "pack_id": PACK_ID,
                "work_slug": "markandeya-purana",
                "bounded_text": "devimahatmya_chapters_81_93",
                "source_profile_id": pack["source_packet"]["profile_id"],
                "provider": locator["provider"],
                "provider_revision_id": locator["revision_id"],
                "citation_ordinal": row["citation_ordinal"],
                "chapter": row["chapter"],
                "verse": row["verse"],
                "scope": "this_exact_three_revision_source_universe_only",
                "translation_status": TRANSLATION["review_status"],
                "translation_is_source_original": False,
            }
            uncertainty_note = (
                f"Devam source-aligned {language_name} translation of the exact pinned Sanskrit Wikisource passage at "
                f"Mārkaṇḍeyapurāṇa chapter {row['chapter']}, verse {row['verse']}, global citation {row['citation_ordinal']}. "
                "It is AI-assisted and is not a source original, identified print edition, critical recension, complete tradition, "
                f"independently Sanskrit-reviewed translation, ritual instruction, or empirical guarantee. {row['note']}"
            )
            evidence_note = {
                "contract": CONTRACT,
                "pack_id": PACK_ID,
                "draft_sha256": pack["draft_sha256"],
                "translation_content_root_sha256": pack["translation_content_root_sha256"],
                "translation_attribution": TRANSLATION["attribution"],
                "translation_review_status": TRANSLATION["review_status"],
                "translation_is_source_original": False,
                "source_packet_sha256": EXPECTED_SOURCE_PACKET_SHA256,
                "source_passage_root_sha256": EXPECTED_SOURCE_PASSAGE_ROOT_SHA256,
                "source_profile_id": pack["source_packet"]["profile_id"],
                "source_sha256": row["source_sha256"],
                "source_ordinal": row["source_ordinal"],
                "source_span_sha256": row["source_span_sha256"],
                "citation_ordinal": row["citation_ordinal"],
                "chapter": row["chapter"],
                "verse": row["verse"],
                "source_boundary": "this_exact_three_revision_source_universe_only",
                "license_literal": TRANSLATION["license_literal"],
                "license_url": TRANSLATION["license_url"],
                "attribution_required": True,
                "share_alike_required": True,
            }
            records.append(
                {
                    "stable_key": stable_key(row["citation_ordinal"], language_code),
                    "statement": row[field],
                    "language_code": language_code,
                    "claim_kind": "source_aligned_translation",
                    "evidence_class": "devam_synthesis",
                    "confidence": row["confidence"],
                    "applicability": applicability,
                    "uncertainty_note": uncertainty_note,
                    "rights_lane": TRANSLATION["rights_lane"],
                    "publication_state": TRANSLATION["publication_state"],
                    "source_sha256": row["source_sha256"],
                    "source_ordinal": row["source_ordinal"],
                    "source_span_sha256": row["source_span_sha256"],
                    "citation_ordinal": row["citation_ordinal"],
                    "chapter": row["chapter"],
                    "verse": row["verse"],
                    "row_note": row["note"],
                    "evidence_note": evidence_note,
                }
            )
    return records


def _bulk_upsert_statement(pack: dict[str, Any], records: list[dict[str, Any]]) -> str:
    values = ",\n    ".join(
        "(" + ", ".join(
            [
                sql_quote(row["stable_key"]),
                sql_quote(row["statement"]),
                sql_quote(row["language_code"]),
                str(row["confidence"]),
                sql_quote(row["source_sha256"]),
                str(row["source_ordinal"]),
                sql_quote(row["source_span_sha256"]),
                str(row["citation_ordinal"]),
                str(row["chapter"]),
                str(row["verse"]),
                sql_quote(row["row_note"]),
            ]
        ) + ")"
        for row in records
    )
    language_name = "case when i.language_code='en' then 'English' else 'Hindi' end"
    uncertainty = (
        f"'Devam source-aligned ' || {language_name} || ' translation of the exact pinned Sanskrit Wikisource passage at "
        "Mārkaṇḍeyapurāṇa chapter ' || i.chapter || ', verse ' || i.verse || ', global citation ' || i.citation_ordinal || '. "
        "It is AI-assisted and is not a source original, identified print edition, critical recension, complete tradition, "
        "independently Sanskrit-reviewed translation, ritual instruction, or empirical guarantee. ' || i.row_note"
    )
    return f"""with input(stable_key, statement, language_code, confidence, source_sha256, source_ordinal, source_span_sha256, citation_ordinal, chapter, verse, row_note) as (values
    {values}
), upserted as (
  insert into public.claims (stable_key, subject_entity_id, statement, language_code, claim_kind, evidence_class, confidence, applicability, uncertainty_note, rights_lane, publication_state)
  select i.stable_key, e.id, i.statement, i.language_code, 'source_aligned_translation', 'devam_synthesis', i.confidence,
    jsonb_build_object(
      'pack_id', {sql_quote(PACK_ID)}, 'work_slug', 'markandeya-purana', 'bounded_text', 'devimahatmya_chapters_81_93',
      'source_profile_id', 'devimahatmya-wikisource-sanskrit-v1', 'provider', 'Sanskrit Wikisource',
      'provider_revision_id', (p.locator->>'revision_id')::integer, 'citation_ordinal', i.citation_ordinal,
      'chapter', i.chapter, 'verse', i.verse, 'scope', 'this_exact_three_revision_source_universe_only',
      'translation_status', {sql_quote(TRANSLATION['review_status'])}, 'translation_is_source_original', false
    ), {uncertainty}, 'derivative_allowed', 'published'
  from input i
  join public.source_objects s on s.sha256=i.source_sha256
  join public.passages p on p.source_object_id=s.id and p.source_ordinal=i.source_ordinal and p.span_sha256=i.source_span_sha256
  cross join public.entities e
  where e.slug='devi-mahatmya'
  on conflict (stable_key) do update set
    subject_entity_id=excluded.subject_entity_id, statement=excluded.statement, language_code=excluded.language_code,
    claim_kind=excluded.claim_kind, evidence_class=excluded.evidence_class, confidence=excluded.confidence,
    applicability=excluded.applicability, uncertainty_note=excluded.uncertainty_note,
    rights_lane=excluded.rights_lane, publication_state=excluded.publication_state
  returning id, stable_key
)
insert into public.claim_evidence (claim_id, passage_id, evidence_role, note)
select c.id, p.id, 'supports', jsonb_build_object(
  'contract', {sql_quote(CONTRACT)}, 'pack_id', {sql_quote(PACK_ID)},
  'draft_sha256', {sql_quote(pack['draft_sha256'])},
  'translation_content_root_sha256', {sql_quote(pack['translation_content_root_sha256'])},
  'translation_attribution', {sql_quote(TRANSLATION['attribution'])},
  'translation_review_status', {sql_quote(TRANSLATION['review_status'])},
  'translation_is_source_original', false,
  'source_packet_sha256', {sql_quote(EXPECTED_SOURCE_PACKET_SHA256)},
  'source_passage_root_sha256', {sql_quote(EXPECTED_SOURCE_PASSAGE_ROOT_SHA256)},
  'source_profile_id', 'devimahatmya-wikisource-sanskrit-v1',
  'source_sha256', i.source_sha256, 'source_ordinal', i.source_ordinal,
  'source_span_sha256', i.source_span_sha256, 'citation_ordinal', i.citation_ordinal,
  'chapter', i.chapter, 'verse', i.verse,
  'source_boundary', 'this_exact_three_revision_source_universe_only',
  'license_literal', {sql_quote(TRANSLATION['license_literal'])},
  'license_url', {sql_quote(TRANSLATION['license_url'])},
  'attribution_required', true, 'share_alike_required', true
)::text
from input i
join upserted c on c.stable_key=i.stable_key
join public.source_objects s on s.sha256=i.source_sha256
join public.passages p on p.source_object_id=s.id and p.source_ordinal=i.source_ordinal and p.span_sha256=i.source_span_sha256
on conflict (claim_id, passage_id, evidence_role) do update set note=excluded.note;"""


def compile_statements(pack: dict[str, Any], records_per_statement: int = 8) -> list[str]:
    source_array = ", ".join(sql_quote(value) for value in sorted(EXPECTED_SOURCE_SHA256S))
    statements = [f"""do $$
declare live_root text;
begin
  if (select count(*) from public.source_objects where sha256 = any(array[{source_array}]) and rights_lane='derivative_allowed') <> 3 then
    raise exception 'Pinned Sanskrit source-object universe is absent, duplicated, or rights-incompatible';
  end if;
  if (select count(*) from public.passages p join public.source_objects s on s.id=p.source_object_id where s.sha256 = any(array[{source_array}]) and p.publication_state='published' and p.rights_lane='derivative_allowed') <> 588 then
    raise exception 'Pinned Sanskrit passage universe is incomplete';
  end if;
  select encode(digest(convert_to(string_agg(concat_ws(E'\\t', p.locator->>'citation_ordinal', s.sha256, (p.locator->>'chapter') || '.' || (p.locator->>'verse'), p.span_sha256, encode(digest(convert_to(p.exact_text, 'UTF8'), 'sha256'), 'hex')), E'\\n' order by (p.locator->>'citation_ordinal')::integer), 'UTF8'), 'sha256'), 'hex')
    into live_root
  from public.passages p join public.source_objects s on s.id=p.source_object_id
  where s.sha256 = any(array[{source_array}]);
  if live_root <> {sql_quote(EXPECTED_SOURCE_PASSAGE_ROOT_SHA256)} then
    raise exception 'Pinned Sanskrit source-passage fixity drift';
  end if;
  if (select count(*) from public.entities where slug='devi-mahatmya' and publication_state='published') <> 1 then
    raise exception 'Published Devī Māhātmya entity is absent or duplicated';
  end if;
end $$;"""]
    records = expected_claim_records(pack)
    for start in range(0, len(records), records_per_statement):
        statements.append(_bulk_upsert_statement(pack, records[start : start + records_per_statement]))
    return statements


def compile_batches(pack: dict[str, Any], max_chars: int = 16000) -> list[str]:
    batches: list[str] = []
    current: list[str] = []
    size = 0
    for statement in compile_statements(pack):
        if current and size + len(statement) > max_chars:
            batches.append("\n\n".join(["begin;", *current, "commit;"]) + "\n")
            current, size = [], 0
        current.append(statement)
        size += len(statement)
    if current:
        batches.append("\n\n".join(["begin;", *current, "commit;"]) + "\n")
    return batches


def _verification_roots(records: list[dict[str, Any]]) -> dict[str, str]:
    ordered = sorted(records, key=lambda row: row["stable_key"])
    statement_lines = [f"{row['stable_key']}\t{sha256_bytes(row['statement'].encode('utf-8'))}" for row in ordered]
    uncertainty_lines = [f"{row['stable_key']}\t{sha256_bytes(row['uncertainty_note'].encode('utf-8'))}" for row in ordered]
    common_lines = [
        "\t".join(
            [
                row["stable_key"],
                row["language_code"],
                row["claim_kind"],
                row["evidence_class"],
                f"{row['confidence']:.3f}",
                row["rights_lane"],
                row["publication_state"],
                row["source_sha256"],
                str(row["source_ordinal"]),
                row["source_span_sha256"],
            ]
        )
        for row in ordered
    ]
    return {
        "statement": sha256_bytes("\n".join(statement_lines).encode("utf-8")),
        "uncertainty": sha256_bytes("\n".join(uncertainty_lines).encode("utf-8")),
        "common": sha256_bytes("\n".join(common_lines).encode("utf-8")),
    }


def compile_verification_sql(pack: dict[str, Any]) -> str:
    roots = _verification_roots(expected_claim_records(pack))
    prefix = "durga-devimahatmya-wikisource-translation-%"
    source_array = ", ".join(sql_quote(value) for value in sorted(EXPECTED_SOURCE_SHA256S))
    return f"""with actual as (
  select c.stable_key, c.statement, c.language_code, c.claim_kind, c.evidence_class,
    c.confidence, c.applicability, c.uncertainty_note, c.rights_lane, c.publication_state,
    s.sha256 as source_sha256, p.source_ordinal, p.span_sha256 as source_span_sha256,
    p.locator as source_locator,
    ce.note::jsonb as evidence_note
  from public.claims c
  join public.claim_evidence ce on ce.claim_id=c.id and ce.evidence_role='supports'
  join public.passages p on p.id=ce.passage_id
  join public.source_objects s on s.id=p.source_object_id
  where c.stable_key like {sql_quote(prefix)} and s.sha256 = any(array[{source_array}])
), roots as (
  select count(*) as actual_rows, count(distinct stable_key) as distinct_keys,
    encode(digest(convert_to(string_agg(stable_key || E'\\t' || encode(digest(convert_to(statement, 'UTF8'), 'sha256'), 'hex'), E'\\n' order by stable_key), 'UTF8'), 'sha256'), 'hex') as statement_root,
    encode(digest(convert_to(string_agg(stable_key || E'\\t' || encode(digest(convert_to(uncertainty_note, 'UTF8'), 'sha256'), 'hex'), E'\\n' order by stable_key), 'UTF8'), 'sha256'), 'hex') as uncertainty_root,
    encode(digest(convert_to(string_agg(concat_ws(E'\\t', stable_key, language_code, claim_kind, evidence_class, confidence::text, rights_lane, publication_state, source_sha256, source_ordinal::text, source_span_sha256), E'\\n' order by stable_key), 'UTF8'), 'sha256'), 'hex') as common_root,
    count(*) filter (where
      (select count(*) from jsonb_object_keys(applicability)) <> 12 or
      applicability->>'pack_id' <> {sql_quote(PACK_ID)} or
      applicability->>'work_slug' <> 'markandeya-purana' or
      applicability->>'bounded_text' <> 'devimahatmya_chapters_81_93' or
      applicability->>'source_profile_id' <> 'devimahatmya-wikisource-sanskrit-v1' or
      applicability->>'provider' <> 'Sanskrit Wikisource' or
      (applicability->>'provider_revision_id')::integer <> (source_locator->>'revision_id')::integer or
      (applicability->>'citation_ordinal')::integer <> (source_locator->>'citation_ordinal')::integer or
      (applicability->>'chapter')::integer <> (source_locator->>'chapter')::integer or
      (applicability->>'verse')::integer <> (source_locator->>'verse')::integer or
      applicability->>'scope' <> 'this_exact_three_revision_source_universe_only' or
      applicability->>'translation_status' <> {sql_quote(TRANSLATION['review_status'])} or
      (applicability->>'translation_is_source_original')::boolean is not false
    ) as applicability_violations,
    count(*) filter (where
      (select count(*) from jsonb_object_keys(evidence_note)) <> 21 or
      evidence_note->>'contract' <> {sql_quote(CONTRACT)} or
      evidence_note->>'pack_id' <> {sql_quote(PACK_ID)} or
      evidence_note->>'draft_sha256' <> {sql_quote(EXPECTED_DRAFT_SHA256)} or
      evidence_note->>'translation_content_root_sha256' <> {sql_quote(pack['translation_content_root_sha256'])} or
      evidence_note->>'translation_attribution' <> {sql_quote(TRANSLATION['attribution'])} or
      evidence_note->>'translation_review_status' <> {sql_quote(TRANSLATION['review_status'])} or
      evidence_note->>'source_packet_sha256' <> {sql_quote(EXPECTED_SOURCE_PACKET_SHA256)} or
      evidence_note->>'source_passage_root_sha256' <> {sql_quote(EXPECTED_SOURCE_PASSAGE_ROOT_SHA256)} or
      evidence_note->>'source_profile_id' <> 'devimahatmya-wikisource-sanskrit-v1' or
      evidence_note->>'source_sha256' <> source_sha256 or
      (evidence_note->>'source_ordinal')::integer <> source_ordinal or
      evidence_note->>'source_span_sha256' <> source_span_sha256 or
      (evidence_note->>'citation_ordinal')::integer <> (source_locator->>'citation_ordinal')::integer or
      (evidence_note->>'chapter')::integer <> (source_locator->>'chapter')::integer or
      (evidence_note->>'verse')::integer <> (source_locator->>'verse')::integer or
      evidence_note->>'source_boundary' <> 'this_exact_three_revision_source_universe_only' or
      (evidence_note->>'translation_is_source_original')::boolean is not false or
      evidence_note->>'license_literal' <> {sql_quote(TRANSLATION['license_literal'])} or
      evidence_note->>'license_url' <> {sql_quote(TRANSLATION['license_url'])} or
      (evidence_note->>'attribution_required')::boolean is not true or
      (evidence_note->>'share_alike_required')::boolean is not true
    ) as evidence_violations
  from actual
)
select jsonb_build_object(
  'result', case when actual_rows=1176 and distinct_keys=1176
    and statement_root={sql_quote(roots['statement'])}
    and uncertainty_root={sql_quote(roots['uncertainty'])}
    and common_root={sql_quote(roots['common'])}
    and applicability_violations=0 and evidence_violations=0
    and (select count(*) from public.claims where stable_key like {sql_quote(prefix)})=1176
    and (select count(*) from public.claim_evidence ce join public.claims c on c.id=ce.claim_id where c.stable_key like {sql_quote(prefix)} and ce.evidence_role='supports')=1176
    then 'PASS' else 'FAIL' end,
  'expected_rows', 1176, 'actual_rows', actual_rows, 'distinct_keys', distinct_keys,
  'statement_root', statement_root, 'statement_root_matches', statement_root={sql_quote(roots['statement'])},
  'uncertainty_root', uncertainty_root, 'uncertainty_root_matches', uncertainty_root={sql_quote(roots['uncertainty'])},
  'common_root', common_root, 'common_root_matches', common_root={sql_quote(roots['common'])},
  'applicability_violations', applicability_violations, 'evidence_violations', evidence_violations,
  'all_prefixed_claims', (select count(*) from public.claims where stable_key like {sql_quote(prefix)}),
  'all_support_links', (select count(*) from public.claim_evidence ce join public.claims c on c.id=ce.claim_id where c.stable_key like {sql_quote(prefix)} and ce.evidence_role='supports')
) as verification from roots;"""


def build_report(pack: dict[str, Any]) -> dict[str, Any]:
    records = expected_claim_records(pack)
    batches = compile_batches(pack)
    roots = _verification_roots(records)
    return {
        "result": "PASS",
        "contract": CONTRACT,
        "pack_id": PACK_ID,
        "draft_path": pack["draft_path"],
        "draft_sha256": pack["draft_sha256"],
        "translation_content_root_sha256": pack["translation_content_root_sha256"],
        "source_packet_sha256": EXPECTED_SOURCE_PACKET_SHA256,
        "source_passage_root_sha256": EXPECTED_SOURCE_PASSAGE_ROOT_SHA256,
        "source_object_count": 3,
        "source_passage_count": 588,
        "translation_count": 1176,
        "language_counts": {"en": 588, "hi": 588},
        "claim_count": 1176,
        "evidence_link_count": 1176,
        "sql_batch_count": len(batches),
        "sql_batch_sha256": [sha256_bytes(batch.encode("utf-8")) for batch in batches],
        "verification_roots": roots,
        "translation": TRANSLATION,
        "completion": COMPLETION,
        "positive_boundary": "Complete English and Hindi Devam beta translation coverage of all 588 exact source-aligned passages in the three pinned Sanskrit Wikisource revisions for Mārkaṇḍeyapurāṇa chapters 81-93.",
        "scope_boundary": "This is an AI-assisted Devam beta translation of one exact provider-revision universe, not a source original, identified print edition, critical recension, independently Sanskrit-reviewed translation, complete Devī Māhātmya tradition, complete Mārkaṇḍeyapurāṇa, ritual authority, or empirical guarantee of devotional results.",
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Compile the exact-revision Devī Māhātmya Devam translations.")
    parser.add_argument("--draft", type=Path, default=DRAFT)
    parser.add_argument("--format", choices=("report", "sql-batch", "sql-batch-base64", "verification-sql"), default="report")
    parser.add_argument("--batch-index", type=int)
    parser.add_argument("--write-report", action="store_true")
    args = parser.parse_args()
    pack = load_pack(args.draft)
    batches = compile_batches(pack)
    if args.format in {"sql-batch", "sql-batch-base64"}:
        if args.batch_index is None or not 0 <= args.batch_index < len(batches):
            raise ValueError(f"--batch-index must be between 0 and {len(batches) - 1}")
        output = batches[args.batch_index]
        if args.format == "sql-batch-base64":
            output = base64.b64encode(output.encode("utf-8")).decode("ascii")
        sys.stdout.write(output)
        return 0
    if args.batch_index is not None:
        raise ValueError("--batch-index is valid only for SQL batch output")
    if args.format == "verification-sql":
        sys.stdout.write(compile_verification_sql(pack))
        return 0
    report = build_report(pack)
    rendered = json.dumps(report, ensure_ascii=False, indent=2, sort_keys=True) + "\n"
    if args.write_report:
        REPORT.parent.mkdir(parents=True, exist_ok=True)
        with REPORT.open("x", encoding="utf-8", newline="\n") as stream:
            stream.write(rendered)
    print(rendered, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

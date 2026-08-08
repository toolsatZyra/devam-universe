from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from tools.compile_source_vault_tei_ingestion import (
    ROOT,
    canonical_json,
    json_sql,
    sha256_bytes,
    sql_quote,
)
from tools.compile_wikisource_wikitext_ingestion import compile_packet as compile_source_packet


CONTRACT = "DEVAM_SOURCE_ALIGNED_TRANSLATION_PACK_V1"
SOURCE_PLAN = ROOT / "ingestion" / "plans" / "ganapatyatharvashirsha-wikisource-v1.json"
EXPECTED_PACK_ID = "ganesha-ganapatyatharvashirsha-devam-translations-v1"
EXPECTED_SOURCE = {
    "work_slug": "ganapatyatharvashirsha",
    "provider_revision_id": 415703,
    "canonical_wikitext_sha256": "43d5f6ca8a2ee7d7a62480a85cdbd526cee04b816db46ac7c3fd8d90757a5178",
    "required_ingestion_packet_sha256": "46943518b9f94d43daa26272fb3e746f81b4de16e86877956efad227058350b0",
    "source_passage_count": 16,
    "underlying_print_edition_identified": False,
    "recension_identified": False,
}
EXPECTED_TRANSLATION = {
    "attribution": "Devam source-aligned translation v1",
    "method": "AI-assisted editorial translation from the exact Sanskrit Wikisource revision, checked passage-by-passage against the frozen source and comparison witnesses",
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
EXPECTED_COMPLETION = {
    "exact_source_passages_translated_en": 16,
    "exact_source_passages_translated_hi": 16,
    "exact_provider_revision_translation_coverage_complete": True,
    "independent_sanskrit_human_review_complete": False,
    "pronunciation_layer_complete": False,
    "underlying_print_edition_identified": False,
    "recension_identified": False,
    "all_textual_variants_complete": False,
    "formal_ritual_authority_established": False,
    "traditional_benefits_empirically_guaranteed": False,
    "ganesha_hero_universe_complete": False,
}
PASSAGE_KEYS = {
    "source_ordinal",
    "source_span_sha256",
    "english",
    "hindi",
    "confidence",
    "note",
}


def _require_exact_keys(value: dict[str, Any], keys: set[str], role: str) -> None:
    if set(value) != keys:
        raise ValueError(f"{role} key set drift: {sorted(set(value) ^ keys)}")


def _strict_utf8(path: Path) -> tuple[bytes, str]:
    data = path.read_bytes()
    text = data.decode("utf-8", errors="strict")
    if text.encode("utf-8") != data:
        raise ValueError("Translation pack is not strict round-trip UTF-8")
    return data, text


def _content_root(passages: list[dict[str, Any]]) -> str:
    records = []
    for row in passages:
        records.append(
            {
                "source_ordinal": row["source_ordinal"],
                "source_span_sha256": row["source_span_sha256"],
                "english_sha256": sha256_bytes(row["english"].encode("utf-8")),
                "hindi_sha256": sha256_bytes(row["hindi"].encode("utf-8")),
                "confidence": row["confidence"],
                "note_sha256": sha256_bytes(row["note"].encode("utf-8")),
            }
        )
    return sha256_bytes(canonical_json(records).encode("utf-8"))


def load_pack(path: Path) -> dict[str, Any]:
    resolved = path.resolve(strict=True)
    if not resolved.is_relative_to((ROOT / "knowledge_packs").resolve(strict=True)):
        raise ValueError("Translation pack must be inside knowledge_packs")
    data, text = _strict_utf8(resolved)
    pack = json.loads(text)
    _require_exact_keys(
        pack,
        {"contract", "pack_id", "source", "translation", "comparison_witnesses", "passages", "completion"},
        "pack",
    )
    if pack["contract"] != CONTRACT or pack["pack_id"] != EXPECTED_PACK_ID:
        raise ValueError("Translation pack contract or identity drift")
    if pack["source"] != EXPECTED_SOURCE:
        raise ValueError("Pinned source contract drift")
    if pack["translation"] != EXPECTED_TRANSLATION:
        raise ValueError("Translation expression, rights, review, or publication contract drift")
    if pack["completion"] != EXPECTED_COMPLETION:
        raise ValueError("Translation completion boundary drift")

    witnesses = pack["comparison_witnesses"]
    if not isinstance(witnesses, list) or len(witnesses) != 2:
        raise ValueError("Expected exactly two comparison-witness records")
    restricted, source_witness = witnesses
    if (
        restricted.get("url") != "https://sanskritdocuments.org/doc_ganesha/saarthaatharva.html"
        or restricted.get("use") != "in-memory lexical comparison only"
        or restricted.get("product_carrier") is not False
        or "no provider translation text is incorporated" not in restricted.get("restriction", "")
    ):
        raise ValueError("Restricted comparison-witness isolation drift")
    if (
        source_witness.get("url") != "https://sa.wikisource.org/wiki/%E0%A4%97%E0%A4%A3%E0%A4%AA%E0%A4%A4%E0%A5%8D%E0%A4%AF%E0%A4%A5%E0%A4%B0%E0%A5%8D%E0%A4%B5%E0%A4%B6%E0%A5%80%E0%A4%B0%E0%A5%8D%E0%A4%B7%E0%A4%AE%E0%A5%8D"
        or source_witness.get("use") != "sole source text for alignment"
        or source_witness.get("product_carrier") is not True
    ):
        raise ValueError("Sole source-witness identity drift")

    source_packet = compile_source_packet(SOURCE_PLAN)
    if source_packet["packet_sha256"] != EXPECTED_SOURCE["required_ingestion_packet_sha256"]:
        raise ValueError("Frozen source ingestion packet drift")
    canonical_source = next(row for row in source_packet["source_objects"] if row["role"] == "canonical_wikitext")
    if canonical_source["sha256"] != EXPECTED_SOURCE["canonical_wikitext_sha256"]:
        raise ValueError("Frozen canonical source object drift")
    source_passages = {row["source_ordinal"]: row for row in source_packet["passages"]}

    passages = pack["passages"]
    if not isinstance(passages, list) or len(passages) != 16:
        raise ValueError("Expected exactly 16 translated source units")
    if [row.get("source_ordinal") for row in passages] != list(range(16)):
        raise ValueError("Translated source ordinals must be exact, unique, and ordered 0 through 15")
    for row in passages:
        _require_exact_keys(row, PASSAGE_KEYS, f"translation passage {row.get('source_ordinal')}")
        ordinal = row["source_ordinal"]
        if row["source_span_sha256"] != source_passages[ordinal]["span_sha256"]:
            raise ValueError(f"Source span drift at ordinal {ordinal}")
        if not isinstance(row["english"], str) or not row["english"].strip():
            raise ValueError(f"Missing English translation at ordinal {ordinal}")
        if not isinstance(row["hindi"], str) or not row["hindi"].strip():
            raise ValueError(f"Missing Hindi translation at ordinal {ordinal}")
        if not isinstance(row["confidence"], (int, float)) or not 0 < row["confidence"] <= 1:
            raise ValueError(f"Invalid confidence at ordinal {ordinal}")
        if not isinstance(row["note"], str) or not row["note"].strip():
            raise ValueError(f"Missing uncertainty/source-boundary note at ordinal {ordinal}")
    if "ब्रह्माद्याचरणं" not in passages[12]["note"] or "ब्रह्माद्यावरणं" not in passages[12]["note"]:
        raise ValueError("The material ordinal-12 source variant is not preserved")
    for ordinal in (11, 12, 13, 14):
        note = passages[ordinal]["note"].lower()
        if not any(term in note for term in ("not empirical", "not a ritual", "not guaranteed", "source report")):
            raise ValueError(f"Traditional result boundary missing at ordinal {ordinal}")

    pack_file_sha256 = sha256_bytes(data)
    pack_content_sha256 = sha256_bytes(canonical_json(pack).encode("utf-8"))
    return {
        **pack,
        "pack_file_sha256": pack_file_sha256,
        "pack_content_sha256": pack_content_sha256,
        "translation_content_root_sha256": _content_root(passages),
        "source_packet": source_packet,
    }


def stable_key(ordinal: int, language_code: str) -> str:
    return f"ganapati-ganapatyatharvashirsha-rev415703-translation-{ordinal:02d}-{language_code}"


def expected_claim_records(pack: dict[str, Any]) -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    for row in pack["passages"]:
        ordinal = row["source_ordinal"]
        for language_code, field, language_name in (("en", "english", "English"), ("hi", "hindi", "Hindi")):
            applicability = {
                "pack_id": pack["pack_id"],
                "work_slug": pack["source"]["work_slug"],
                "provider_revision_id": pack["source"]["provider_revision_id"],
                "source_ordinal": ordinal,
                "scope": "this_exact_source_revision_only",
                "translation_status": pack["translation"]["review_status"],
                "translation_is_source_original": False,
            }
            uncertainty_note = (
                f"Devam source-aligned {language_name} translation of Sanskrit Wikisource revision 415703, "
                f"source unit {ordinal}. It is AI-assisted, not a source original, critical edition, pronunciation guide, "
                f"ritual authorization, or independently Sanskrit-reviewed translation. {row['note']}"
            )
            evidence_note = {
                "contract": CONTRACT,
                "pack_id": pack["pack_id"],
                "pack_file_sha256": pack["pack_file_sha256"],
                "pack_content_sha256": pack["pack_content_sha256"],
                "translation_content_root_sha256": pack["translation_content_root_sha256"],
                "translation_attribution": pack["translation"]["attribution"],
                "translation_review_status": pack["translation"]["review_status"],
                "translation_is_source_original": False,
                "source_revision_id": pack["source"]["provider_revision_id"],
                "source_ordinal": ordinal,
                "source_span_sha256": row["source_span_sha256"],
                "source_boundary": "this_exact_source_revision_only",
                "comparison_witness_text_copied": False,
                "license_literal": pack["translation"]["license_literal"],
                "license_url": pack["translation"]["license_url"],
                "attribution_required": True,
                "share_alike_required": True,
            }
            records.append(
                {
                    "stable_key": stable_key(ordinal, language_code),
                    "statement": row[field],
                    "language_code": language_code,
                    "claim_kind": "source_aligned_translation",
                    "evidence_class": "devam_synthesis",
                    "confidence": row["confidence"],
                    "applicability": applicability,
                    "uncertainty_note": uncertainty_note,
                    "rights_lane": pack["translation"]["rights_lane"],
                    "publication_state": pack["translation"]["publication_state"],
                    "source_ordinal": ordinal,
                    "source_span_sha256": row["source_span_sha256"],
                    "evidence_note": evidence_note,
                }
            )
    return records


def compile_statements(pack: dict[str, Any]) -> list[str]:
    source_sha = pack["source"]["canonical_wikitext_sha256"]
    lane = pack["translation"]["rights_lane"]
    state = pack["translation"]["publication_state"]
    expected_rows = ",\n    ".join(
        f"({row['source_ordinal']}, {sql_quote(row['source_span_sha256'])})" for row in pack["passages"]
    )
    statements = [f"""do $$
begin
  if (select count(*) from public.source_objects where sha256={sql_quote(source_sha)} and rights_lane={sql_quote(lane)}) <> 1 then
    raise exception 'Pinned Sanskrit source object is absent, duplicated, or rights-incompatible';
  end if;
  if (select count(*) from public.passages p join public.source_objects s on s.id=p.source_object_id where s.sha256={sql_quote(source_sha)} and p.publication_state='published' and p.rights_lane={sql_quote(lane)}) <> 16 then
    raise exception 'Pinned Sanskrit source passage universe is incomplete';
  end if;
  if exists (
    with expected(source_ordinal, span_sha256) as (values
    {expected_rows}
    )
    select 1 from expected e
    left join public.source_objects s on s.sha256={sql_quote(source_sha)}
    left join public.passages p on p.source_object_id=s.id and p.source_ordinal=e.source_ordinal
    where p.id is null or p.span_sha256 <> e.span_sha256
  ) then
    raise exception 'Pinned Sanskrit source passage fixity drift';
  end if;
  if (select count(*) from public.works where slug='ganapatyatharvashirsha' and publication_state='published') <> 1 then
    raise exception 'Published Ganapati Atharvashirsha work is absent or duplicated';
  end if;
  if (select count(*) from public.entities where slug='ganapati' and publication_state='published') <> 1 then
    raise exception 'Published Ganapati entity is absent or duplicated';
  end if;
end $$;"""]

    for record in expected_claim_records(pack):
            key = record["stable_key"]
            statements.append(
                f"""insert into public.claims (stable_key, subject_entity_id, statement, language_code, claim_kind, evidence_class, confidence, applicability, uncertainty_note, rights_lane, publication_state) select {sql_quote(key)}, e.id, {sql_quote(record['statement'])}, {sql_quote(record['language_code'])}, {sql_quote(record['claim_kind'])}, {sql_quote(record['evidence_class'])}, {record['confidence']}, {json_sql(record['applicability'])}, {sql_quote(record['uncertainty_note'])}, {sql_quote(lane)}, {sql_quote(state)} from public.entities e where e.slug='ganapati' on conflict (stable_key) do update set subject_entity_id=excluded.subject_entity_id, statement=excluded.statement, language_code=excluded.language_code, claim_kind=excluded.claim_kind, evidence_class=excluded.evidence_class, confidence=excluded.confidence, applicability=excluded.applicability, uncertainty_note=excluded.uncertainty_note, rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;"""
            )
            statements.append(
                f"""insert into public.claim_evidence (claim_id, passage_id, evidence_role, note) select c.id, p.id, 'supports', {json_sql(record['evidence_note'])} from public.claims c join public.source_objects s on s.sha256={sql_quote(source_sha)} join public.passages p on p.source_object_id=s.id and p.source_ordinal={record['source_ordinal']} where c.stable_key={sql_quote(key)} on conflict (claim_id, passage_id, evidence_role) do update set note=excluded.note;"""
            )
    return statements


def compile_verification_sql(pack: dict[str, Any]) -> str:
    records = sorted(expected_claim_records(pack), key=lambda row: row["stable_key"])

    def root_for(field: str, transform=lambda value: str(value)) -> str:
        lines = [f"{row['stable_key']}\t{sha256_bytes(transform(row[field]).encode('utf-8'))}" for row in records]
        return sha256_bytes("\n".join(lines).encode("utf-8"))

    common_lines = []
    for row in records:
        common_lines.append(
            "\t".join(
                [
                    row["stable_key"],
                    row["language_code"],
                    row["claim_kind"],
                    row["evidence_class"],
                    f"{row['confidence']:.3f}",
                    row["rights_lane"],
                    row["publication_state"],
                    str(row["source_ordinal"]),
                    row["source_span_sha256"],
                ]
            )
        )
    roots = {
        "statement": root_for("statement"),
        "uncertainty": root_for("uncertainty_note"),
        "common": sha256_bytes("\n".join(common_lines).encode("utf-8")),
    }
    source_sha = pack["source"]["canonical_wikitext_sha256"]
    prefix = "ganapati-ganapatyatharvashirsha-rev415703-translation-%"
    return f"""with actual as (
  select c.stable_key, c.statement, c.language_code, c.claim_kind,
    c.evidence_class, c.confidence, c.applicability, c.uncertainty_note,
    c.rights_lane, c.publication_state, p.source_ordinal,
    p.span_sha256 as source_span_sha256, ce.note::jsonb as evidence_note
  from public.claims c
  join public.claim_evidence ce on ce.claim_id=c.id and ce.evidence_role='supports'
  join public.passages p on p.id=ce.passage_id
  join public.source_objects s on s.id=p.source_object_id
  where c.stable_key like {sql_quote(prefix)}
    and s.sha256={sql_quote(source_sha)}
), roots as (
  select
    count(*) as actual_rows,
    count(distinct stable_key) as distinct_keys,
    encode(digest(convert_to(string_agg(stable_key || E'\\t' || encode(digest(convert_to(statement, 'UTF8'), 'sha256'), 'hex'), E'\\n' order by stable_key), 'UTF8'), 'sha256'), 'hex') as statement_root,
    encode(digest(convert_to(string_agg(stable_key || E'\\t' || encode(digest(convert_to(uncertainty_note, 'UTF8'), 'sha256'), 'hex'), E'\\n' order by stable_key), 'UTF8'), 'sha256'), 'hex') as uncertainty_root,
    encode(digest(convert_to(string_agg(concat_ws(E'\\t', stable_key, language_code, claim_kind, evidence_class, confidence::text, rights_lane, publication_state, source_ordinal::text, source_span_sha256), E'\\n' order by stable_key), 'UTF8'), 'sha256'), 'hex') as common_root,
    count(*) filter (where
      (select count(*) from jsonb_object_keys(applicability)) <> 7 or
      applicability->>'pack_id' <> {sql_quote(pack['pack_id'])} or
      applicability->>'work_slug' <> {sql_quote(pack['source']['work_slug'])} or
      (applicability->>'provider_revision_id')::integer <> 415703 or
      (applicability->>'source_ordinal')::integer <> source_ordinal or
      applicability->>'scope' <> 'this_exact_source_revision_only' or
      applicability->>'translation_status' <> {sql_quote(pack['translation']['review_status'])} or
      (applicability->>'translation_is_source_original')::boolean is not false
    ) as applicability_violations,
    count(*) filter (where
      (select count(*) from jsonb_object_keys(evidence_note)) <> 17 or
      evidence_note->>'contract' <> {sql_quote(CONTRACT)} or
      evidence_note->>'pack_id' <> {sql_quote(pack['pack_id'])} or
      evidence_note->>'pack_file_sha256' <> {sql_quote(pack['pack_file_sha256'])} or
      evidence_note->>'pack_content_sha256' <> {sql_quote(pack['pack_content_sha256'])} or
      evidence_note->>'translation_content_root_sha256' <> {sql_quote(pack['translation_content_root_sha256'])} or
      evidence_note->>'translation_attribution' <> {sql_quote(pack['translation']['attribution'])} or
      evidence_note->>'translation_review_status' <> {sql_quote(pack['translation']['review_status'])} or
      (evidence_note->>'translation_is_source_original')::boolean is not false or
      (evidence_note->>'source_revision_id')::integer <> 415703 or
      (evidence_note->>'source_ordinal')::integer <> source_ordinal or
      evidence_note->>'source_span_sha256' <> source_span_sha256 or
      evidence_note->>'source_boundary' <> 'this_exact_source_revision_only' or
      (evidence_note->>'comparison_witness_text_copied')::boolean is not false or
      evidence_note->>'license_literal' <> {sql_quote(pack['translation']['license_literal'])} or
      evidence_note->>'license_url' <> {sql_quote(pack['translation']['license_url'])} or
      (evidence_note->>'attribution_required')::boolean is not true or
      (evidence_note->>'share_alike_required')::boolean is not true
    ) as evidence_violations
  from actual
)
select jsonb_build_object(
  'result', case when
    actual_rows=32 and distinct_keys=32 and
    statement_root={sql_quote(roots['statement'])} and
    uncertainty_root={sql_quote(roots['uncertainty'])} and
    common_root={sql_quote(roots['common'])} and
    applicability_violations=0 and evidence_violations=0 and
    (select count(*) from public.claims where stable_key like {sql_quote(prefix)})=32 and
    (select count(*) from public.source_objects where sha256={sql_quote(source_sha)})=1 and
    (select count(*) from public.passages p join public.source_objects s on s.id=p.source_object_id where s.sha256={sql_quote(source_sha)})=16
    then 'PASS' else 'FAIL' end,
  'expected_rows', 32,
  'actual_rows', actual_rows,
  'distinct_keys', distinct_keys,
  'statement_root', statement_root,
  'statement_root_matches', statement_root={sql_quote(roots['statement'])},
  'uncertainty_root_matches', uncertainty_root={sql_quote(roots['uncertainty'])},
  'common_root_matches', common_root={sql_quote(roots['common'])},
  'applicability_violations', applicability_violations,
  'evidence_violations', evidence_violations,
  'all_prefixed_claims', (select count(*) from public.claims where stable_key like {sql_quote(prefix)}),
  'source_objects', (select count(*) from public.source_objects where sha256={sql_quote(source_sha)}),
  'source_passages', (select count(*) from public.passages p join public.source_objects s on s.id=p.source_object_id where s.sha256={sql_quote(source_sha)})
) as verification
from roots;"""


def compile_batches(pack: dict[str, Any], max_chars: int = 28000) -> list[str]:
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


def build_report(pack: dict[str, Any]) -> dict[str, Any]:
    batches = compile_batches(pack)
    sql = "\n".join(batches)
    return {
        "result": "PASS",
        "contract": CONTRACT,
        "pack_id": pack["pack_id"],
        "pack_file_sha256": pack["pack_file_sha256"],
        "pack_content_sha256": pack["pack_content_sha256"],
        "translation_content_root_sha256": pack["translation_content_root_sha256"],
        "canonical_wikitext_sha256": pack["source"]["canonical_wikitext_sha256"],
        "source_packet_sha256": pack["source"]["required_ingestion_packet_sha256"],
        "source_passage_count": 16,
        "translation_count": 32,
        "language_counts": {"en": 16, "hi": 16},
        "claim_count": 32,
        "evidence_link_count": 32,
        "sql_batch_count": len(batches),
        "sql_sha256": sha256_bytes(sql.encode("utf-8")),
        **pack["completion"],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Compile the exact-revision Ganapati Atharvashirsha Devam translations.")
    parser.add_argument("--pack", required=True, type=Path)
    parser.add_argument("--format", choices=("report", "sql-batch", "verification-sql"), default="report")
    parser.add_argument("--batch-index", type=int)
    args = parser.parse_args()
    pack = load_pack(args.pack)
    batches = compile_batches(pack)
    if args.format == "sql-batch":
        if args.batch_index is None or not 0 <= args.batch_index < len(batches):
            raise ValueError("Invalid batch index")
        sys.stdout.write(batches[args.batch_index])
    elif args.format == "verification-sql":
        if args.batch_index is not None:
            raise ValueError("Verification SQL does not accept a batch index")
        sys.stdout.write(compile_verification_sql(pack))
    else:
        print(json.dumps(build_report(pack), ensure_ascii=False, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

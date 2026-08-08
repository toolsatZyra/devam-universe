from __future__ import annotations

import argparse
import base64
import hashlib
import json
import sys
from pathlib import Path
from typing import Any

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from tools.compile_source_vault_tei_ingestion import (
    ROOT,
    canonical_json,
    compile_packet as compile_source_packet,
    json_sql,
    sha256_bytes,
    sql_quote,
)


CONTRACT = "DEVAM_SOURCE_BOUNDED_KNOWLEDGE_PACK_V1"
SOURCE_PLAN = ROOT / "ingestion" / "plans" / "ganesha-shriganapatimantraksharavali-v1.json"
ALLOWED_PUBLICATION_STATE = "published"
ALLOWED_RIGHTS_LANE = "derivative_allowed"


def load_pack(pack_path: Path) -> dict[str, Any]:
    pack = json.loads(pack_path.read_text(encoding="utf-8"))
    if pack.get("contract") != CONTRACT:
        raise ValueError(f"Unsupported knowledge-pack contract: {pack.get('contract')}")
    if pack["source"]["publication_state"] != ALLOWED_PUBLICATION_STATE:
        raise ValueError("This pilot must remain in review state.")
    if pack["source"]["rights_lane"] != ALLOWED_RIGHTS_LANE:
        raise ValueError("Knowledge-pack rights must match the derivative-allowed source lane.")
    alignment = pack["objective_alignment"]
    if alignment.get("hero_universe_complete") is not False or not alignment.get("uncovered_priority_targets"):
        raise ValueError("The pack must preserve its non-exhaustive boundary and explicit coverage gaps.")

    source_packet = compile_source_packet(SOURCE_PLAN)
    if source_packet["packet_sha256"] != pack["source"]["required_ingestion_packet_sha256"]:
        raise ValueError("The pinned source-ingestion packet has drifted.")
    canonical_source = next(item for item in source_packet["source_objects"] if item["role"] == "canonical_tei")
    if canonical_source["sha256"] != pack["source"]["canonical_tei_sha256"]:
        raise ValueError("The knowledge pack is not bound to the canonical TEI source.")
    if source_packet["work"]["slug"] != pack["source"]["work_slug"]:
        raise ValueError("The knowledge pack's work route does not match the source packet.")
    if source_packet["rights"]["lane"] != ALLOWED_RIGHTS_LANE:
        raise ValueError("The source packet no longer has the required rights lane.")
    if source_packet["structure"]["completeness_status"] != pack["source"]["structure_status"]:
        raise ValueError("The source structure status has drifted.")

    passages = {row["source_ordinal"]: row for row in source_packet["passages"]}
    entity_slugs = [item["slug"] for item in pack["entities"]]
    claim_keys = [item["stable_key"] for item in pack["claims"]]
    procedure_slugs = [item["procedure_slug"] for item in pack["reading_practices"]]
    if len(entity_slugs) != len(set(entity_slugs)):
        raise ValueError("Entity slugs must be unique.")
    if len(claim_keys) != len(set(claim_keys)):
        raise ValueError("Claim keys must be unique.")
    if len(procedure_slugs) != len(set(procedure_slugs)):
        raise ValueError("Procedure slugs must be unique.")
    entity_set = set(entity_slugs)
    claim_set = set(claim_keys)

    for entity in pack["entities"]:
        preferred_languages = {name["language_code"] for name in entity["names"] if name["is_preferred"]}
        if not {"en", "hi", "sa"}.issubset(preferred_languages):
            raise ValueError(f"Entity {entity['slug']} lacks preferred English, Hindi, or Sanskrit naming.")

    for claim in pack["claims"]:
        if claim["subject_slug"] not in entity_set:
            raise ValueError(f"Unknown claim subject: {claim['subject_slug']}")
        if claim["language_code"] not in {"en", "hi"}:
            raise ValueError(f"MVP claim language is unsupported: {claim['language_code']}")
        if claim["applicability"].get("scope") != "this_source_only":
            raise ValueError(f"Claim {claim['stable_key']} exceeds the source boundary.")
        if not claim.get("uncertainty_note"):
            raise ValueError(f"Claim {claim['stable_key']} lacks an uncertainty boundary.")
        for evidence in claim["evidence"]:
            passage = passages.get(evidence["marker"])
            if not passage:
                raise ValueError(f"Claim {claim['stable_key']} cites an absent marker.")
            if evidence["required_text"] not in passage["exact_text"]:
                raise ValueError(f"Claim {claim['stable_key']} evidence text is absent from marker {evidence['marker']}.")

    for relationship in pack["relationships"]:
        if relationship["subject_slug"] not in entity_set or relationship["object_slug"] not in entity_set:
            raise ValueError("Relationship references an unknown entity.")
        if relationship["claim_key"] not in claim_set:
            raise ValueError("Relationship references an unknown claim.")

    for practice in pack["reading_practices"]:
        if practice["evidence_status"] != "source_bounded_devam_synthesis_beta":
            raise ValueError("Reading practices must remain explicit source-bounded beta synthesis.")
        if "not a universal" not in practice["observance_summary"]:
            raise ValueError("Reading practice must deny universal puja authority.")
        ordinals = [step["ordinal"] for step in practice["steps"]]
        if ordinals != list(range(1, len(ordinals) + 1)):
            raise ValueError(f"Procedure {practice['procedure_slug']} has non-contiguous steps.")
        for step in practice["steps"]:
            if step["claim_key"] is not None and step["claim_key"] not in claim_set:
                raise ValueError("Reading step references an unknown claim.")

    core = {**pack, "source_passage_count": len(passages)}
    return {**core, "pack_sha256": sha256_bytes(canonical_json(core).encode("utf-8"))}


def compile_sql(pack: dict[str, Any]) -> str:
    rights = ALLOWED_RIGHTS_LANE
    state = ALLOWED_PUBLICATION_STATE
    source_sha = pack["source"]["canonical_tei_sha256"]
    statements = ["begin;"]

    evidence_markers = sorted({
        evidence["marker"]
        for claim in pack["claims"]
        for evidence in claim["evidence"]
    })
    marker_sql = ", ".join(str(marker) for marker in evidence_markers)
    work_slug = pack["source"]["work_slug"]
    statements.append(
        f"""do $$
begin
  if (select count(*) from public.source_objects where sha256 = {sql_quote(source_sha)}) <> 1 then
    raise exception 'Pinned source object is absent or duplicated';
  end if;
  if (select count(*) from public.passages p join public.source_objects s on s.id = p.source_object_id where s.sha256 = {sql_quote(source_sha)}) <> {pack['source_passage_count']} then
    raise exception 'Pinned source passage universe is incomplete';
  end if;
end $$;"""
    )
    statements.append(
        f"""update public.works set rights_lane = {sql_quote(rights)}, publication_state = {sql_quote(state)}
where slug = {sql_quote(work_slug)};"""
    )
    statements.append(
        f"""update public.expressions set rights_lane = {sql_quote(rights)}, publication_state = {sql_quote(state)}
where work_id = (select id from public.works where slug = {sql_quote(work_slug)});"""
    )
    statements.append(
        f"""update public.editions set rights_lane = {sql_quote(rights)}, publication_state = {sql_quote(state)}
where expression_id in (select id from public.expressions where work_id = (select id from public.works where slug = {sql_quote(work_slug)}));"""
    )
    statements.append(
        f"""update public.passages set rights_lane = {sql_quote(rights)}, publication_state = {sql_quote(state)}
where source_object_id = (select id from public.source_objects where sha256 = {sql_quote(source_sha)})
  and source_ordinal in ({marker_sql});"""
    )

    for entity in pack["entities"]:
        statements.append(
            f"""insert into public.entities (slug, entity_kind, canonical_name, description, temporal_scope, geographic_scope, rights_lane, publication_state)
values ({sql_quote(entity['slug'])}, {sql_quote(entity['entity_kind'])}, {sql_quote(entity['canonical_name'])}, {sql_quote(entity['description'])}, '{{}}'::jsonb, '{{}}'::jsonb, {sql_quote(rights)}, {sql_quote(state)})
on conflict (slug) do update set entity_kind = excluded.entity_kind, canonical_name = excluded.canonical_name, description = excluded.description, rights_lane = excluded.rights_lane, publication_state = excluded.publication_state;"""
        )
        for name in entity["names"]:
            statements.append(
                f"""insert into public.entity_names (entity_id, name, language_code, script_code, name_kind, is_preferred)
select e.id, {sql_quote(name['name'])}, {sql_quote(name['language_code'])}, {sql_quote(name['script_code'])}, {sql_quote(name['name_kind'])}, {str(name['is_preferred']).lower()}
from public.entities e where e.slug = {sql_quote(entity['slug'])}
on conflict (entity_id, name, language_code, name_kind) do update set script_code = excluded.script_code, is_preferred = excluded.is_preferred;"""
            )

    for claim in pack["claims"]:
        statements.append(
            f"""insert into public.claims (stable_key, subject_entity_id, statement, language_code, claim_kind, evidence_class, confidence, applicability, uncertainty_note, rights_lane, publication_state)
select {sql_quote(claim['stable_key'])}, e.id, {sql_quote(claim['statement'])}, {sql_quote(claim['language_code'])}, {sql_quote(claim['claim_kind'])}, {sql_quote(claim['evidence_class'])}, {claim['confidence']}, {json_sql(claim['applicability'])}, {sql_quote(claim['uncertainty_note'])}, {sql_quote(rights)}, {sql_quote(state)}
from public.entities e where e.slug = {sql_quote(claim['subject_slug'])}
on conflict (stable_key) do update set subject_entity_id = excluded.subject_entity_id, statement = excluded.statement, language_code = excluded.language_code, claim_kind = excluded.claim_kind, evidence_class = excluded.evidence_class, confidence = excluded.confidence, applicability = excluded.applicability, uncertainty_note = excluded.uncertainty_note, rights_lane = excluded.rights_lane, publication_state = excluded.publication_state;"""
        )
        for evidence in claim["evidence"]:
            note = {
                "pack_id": pack["pack_id"],
                "pack_sha256": pack["pack_sha256"],
                "required_text": evidence["required_text"],
                "source_boundary": "this_source_only",
            }
            statements.append(
                f"""insert into public.claim_evidence (claim_id, passage_id, evidence_role, note)
select c.id, p.id, {sql_quote(evidence['role'])}, {sql_quote(canonical_json(note))}
from public.claims c
join public.source_objects s on s.sha256 = {sql_quote(source_sha)}
join public.passages p on p.source_object_id = s.id and p.source_ordinal = {evidence['marker']}
where c.stable_key = {sql_quote(claim['stable_key'])}
on conflict (claim_id, passage_id, evidence_role) do update set note = excluded.note;"""
            )

    for relationship in pack["relationships"]:
        applicability = {
            "pack_id": pack["pack_id"],
            "work_slug": pack["source"]["work_slug"],
            "scope": "this_source_only",
        }
        statements.append(
            f"""insert into public.relationships (subject_entity_id, predicate, object_entity_id, claim_id, applicability, rights_lane, publication_state)
select subject.id, {sql_quote(relationship['predicate'])}, object.id, c.id, {json_sql(applicability)}, {sql_quote(rights)}, {sql_quote(state)}
from public.entities subject, public.entities object, public.claims c
where subject.slug = {sql_quote(relationship['subject_slug'])} and object.slug = {sql_quote(relationship['object_slug'])} and c.stable_key = {sql_quote(relationship['claim_key'])}
on conflict (subject_entity_id, predicate, object_entity_id, claim_id) do update set applicability = excluded.applicability, rights_lane = excluded.rights_lane, publication_state = excluded.publication_state;"""
        )

    seen_observances: set[str] = set()
    for practice in pack["reading_practices"]:
        if practice["observance_slug"] not in seen_observances:
            seen_observances.add(practice["observance_slug"])
            statements.append(
                f"""insert into public.observances (slug, entity_id, canonical_name, observance_kind, summary, rights_lane, publication_state)
select {sql_quote(practice['observance_slug'])}, e.id, {sql_quote(practice['observance_name'])}, 'devotional_reading', {sql_quote(practice['observance_summary'])}, {sql_quote(rights)}, {sql_quote(state)}
from public.entities e where e.slug = 'ganapati'
on conflict (slug) do update set entity_id = excluded.entity_id, canonical_name = excluded.canonical_name, observance_kind = excluded.observance_kind, summary = excluded.summary, rights_lane = excluded.rights_lane, publication_state = excluded.publication_state;"""
            )
        applicability = {
            "pack_id": pack["pack_id"],
            "work_slug": pack["source"]["work_slug"],
            "scope": "this_source_only",
            "formal_puja_vidhi": False,
        }
        statements.append(
            f"""insert into public.ritual_procedures (slug, observance_id, title, language_code, region_codes, sampradaya_codes, family_practice_note, applicability, evidence_status, rights_lane, publication_state)
select {sql_quote(practice['procedure_slug'])}, o.id, {sql_quote(practice['title'])}, {sql_quote(practice['language_code'])}, '{{}}'::text[], '{{}}'::text[], {sql_quote(practice['family_practice_note'])}, {json_sql(applicability)}, {sql_quote(practice['evidence_status'])}, {sql_quote(rights)}, {sql_quote(state)}
from public.observances o where o.slug = {sql_quote(practice['observance_slug'])}
on conflict (slug) do update set observance_id = excluded.observance_id, title = excluded.title, language_code = excluded.language_code, region_codes = excluded.region_codes, sampradaya_codes = excluded.sampradaya_codes, family_practice_note = excluded.family_practice_note, applicability = excluded.applicability, evidence_status = excluded.evidence_status, rights_lane = excluded.rights_lane, publication_state = excluded.publication_state;"""
        )
        for step in practice["steps"]:
            claim_select = "null::uuid" if step["claim_key"] is None else f"(select id from public.claims where stable_key = {sql_quote(step['claim_key'])})"
            statements.append(
                f"""insert into public.ritual_steps (procedure_id, step_ordinal, instruction, rationale, is_optional, variation_note, claim_id, rights_lane, publication_state)
select rp.id, {step['ordinal']}, {sql_quote(step['instruction'])}, {sql_quote(step['rationale'])}, {str(step['optional']).lower()}, null, {claim_select}, {sql_quote(rights)}, {sql_quote(state)}
from public.ritual_procedures rp where rp.slug = {sql_quote(practice['procedure_slug'])}
on conflict (procedure_id, step_ordinal) do update set instruction = excluded.instruction, rationale = excluded.rationale, is_optional = excluded.is_optional, variation_note = excluded.variation_note, claim_id = excluded.claim_id, rights_lane = excluded.rights_lane, publication_state = excluded.publication_state;"""
            )

    statements.append("commit;")
    return "\n\n".join(statements) + "\n"


def compile_sql_batches(sql: str, batch_size: int = 10) -> list[str]:
    parts = sql.strip().split("\n\n")
    if parts[0] != "begin;" or parts[-1] != "commit;":
        raise ValueError("Compiled SQL transaction boundary is invalid.")
    statements = parts[1:-1]
    return [
        "\n\n".join(["begin;", *statements[index:index + batch_size], "commit;"]) + "\n"
        for index in range(0, len(statements), batch_size)
    ]


def main() -> int:
    parser = argparse.ArgumentParser(description="Compile a source-bounded Devam knowledge pack.")
    parser.add_argument("--pack", required=True, type=Path)
    parser.add_argument("--format", choices=("report", "sql-base64", "sql-batch-base64"), default="report")
    parser.add_argument("--batch-index", type=int)
    args = parser.parse_args()
    pack_path = args.pack.resolve(strict=True)
    if not pack_path.is_relative_to(ROOT / "knowledge_packs"):
        raise ValueError("Knowledge pack must be inside knowledge_packs.")
    pack = load_pack(pack_path)
    sql = compile_sql(pack)
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
            "pack_id": pack["pack_id"],
            "pack_sha256": pack["pack_sha256"],
            "sql_sha256": sha256_bytes(sql.encode("utf-8")),
            "sql_batch_count": len(batches),
            "sql_batch_sha256": [sha256_bytes(batch.encode("utf-8")) for batch in batches],
            "entity_count": len(pack["entities"]),
            "claim_count": len(pack["claims"]),
            "relationship_count": len(pack["relationships"]),
            "reading_procedure_count": len(pack["reading_practices"]),
            "reading_step_count": sum(len(item["steps"]) for item in pack["reading_practices"]),
            "source_passage_count": pack["source_passage_count"],
            "source_payloads_copied": False,
            "public_records_created": False,
            "compiled_publication_state": ALLOWED_PUBLICATION_STATE,
            "public_records_would_be_upserted": True,
            "published_evidence_passage_count": len({
                evidence["marker"]
                for claim in pack["claims"]
                for evidence in claim["evidence"]
            }),
            "formal_puja_authority_claimed": False,
            "hero_universe_complete": False,
            "uncovered_priority_target_count": len(pack["objective_alignment"]["uncovered_priority_targets"]),
        }
        print(json.dumps(report, ensure_ascii=False, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

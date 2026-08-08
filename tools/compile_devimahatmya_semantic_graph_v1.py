from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
PACK_PATH = ROOT / "knowledge_packs/durga/devimahatmya-semantic-graph-v1.json"
TRANSLATION_PATH = ROOT / "knowledge_packs/durga/devimahatmya-devam-translations-v1.jsonl"
MIGRATION_PATH = ROOT / "supabase/migrations/20260809123000_expand_devimahatmya_narrative_constellation.sql"
CONTRACT = "DEVAM_SOURCE_BOUNDED_SEMANTIC_GRAPH_V1"
SOURCE_SHA256 = "c7fe701aedeedffde57a51b21aa4f8fec697a7922939fb59ffa985e22cc9b7ae"
SOURCE_SHA256S = (
    SOURCE_SHA256,
    "4459b0ca01f9a4173f1a137bf7c64908afbf326565b0b3f2dd2d2f5f830850fe",
    "446fb91efc40b94d7b59aa1d5b3116dd665b79ec68044985a8953483c8721814",
)


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def canonical_json(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def sql_quote(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def stable_key(claim_slug: str, language_code: str) -> str:
    return f"durga-devimahatmya-semantic-{claim_slug}-{language_code}"


def load_pack() -> dict[str, Any]:
    pack = json.loads(PACK_PATH.read_text(encoding="utf-8"))
    boundary = pack.get("source_boundary", {})
    if pack.get("contract") != CONTRACT:
        raise ValueError("Semantic graph contract drift")
    if boundary.get("source_sha256") != SOURCE_SHA256:
        raise ValueError("Semantic graph source identity drift")
    if tuple(boundary.get("source_sha256s", [])) != SOURCE_SHA256S:
        raise ValueError("Semantic graph source-set identity drift")
    if boundary.get("rights_lane") != "derivative_allowed" or boundary.get("publication_state") != "published":
        raise ValueError("Semantic graph rights or publication boundary drift")
    if boundary.get("scope") != "this_exact_three_revision_source_universe_only":
        raise ValueError("Semantic graph scope ceiling drift")
    if any(value is not False for value in pack.get("denials", {}).values()):
        raise ValueError("Every semantic graph overclaim denial must remain false")
    if len(pack.get("entities", [])) != 20 or len(pack.get("claims", [])) != 20:
        raise ValueError("Semantic graph bounded inventory drift")

    entity_slugs = [entity["slug"] for entity in pack["entities"]]
    if len(entity_slugs) != len(set(entity_slugs)):
        raise ValueError("Semantic graph entity slugs are not unique")
    for entity in pack["entities"]:
        preferred = {name["language_code"] for name in entity["names"] if name["is_preferred"]}
        if preferred != {"en", "hi", "sa"}:
            raise ValueError(f"Entity {entity['slug']} lacks the exact trilingual preferred-name set")

    translations = {
        row["citation_ordinal"]: row
        for row in (
            json.loads(line)
            for line in TRANSLATION_PATH.read_text(encoding="utf-8").splitlines()
            if line.strip()
        )
    }
    claim_slugs: set[str] = set()
    for claim in pack["claims"]:
        if claim["claim_slug"] in claim_slugs:
            raise ValueError("Semantic graph claim slugs are not unique")
        claim_slugs.add(claim["claim_slug"])
        if claim["object_slug"] not in entity_slugs or claim["predicate"] != "contains_narrative_of":
            raise ValueError("Semantic relationship exceeds the bounded predicate inventory")
        if set(claim["statements"]) != {"en", "hi"} or not all(claim["statements"].values()):
            raise ValueError("Semantic claim is not bilingual")
        evidence = claim["evidence"]
        row = translations.get(evidence["citation_ordinal"])
        observed = None if row is None else (
            row["chapter"], row["verse"], row["source_sha256"], row["source_ordinal"], row["source_span_sha256"]
        )
        expected = (
            evidence["chapter"], evidence["verse"], evidence["source_sha256"], evidence["source_ordinal"], evidence["source_span_sha256"]
        )
        if observed != expected:
            raise ValueError(f"Semantic evidence drift for {claim['claim_slug']}")
        claim["_confidence"] = row["confidence"]
        claim["_translation_note"] = row["note"]
    return pack


def pack_sha256(pack: dict[str, Any]) -> str:
    clean = {key: value for key, value in pack.items() if not key.startswith("_")}
    clean["claims"] = [
        {key: value for key, value in claim.items() if not key.startswith("_")}
        for claim in pack["claims"]
    ]
    return sha256_bytes(canonical_json(clean).encode("utf-8"))


def sql_values(rows: list[list[str]]) -> str:
    return ",\n  ".join("(" + ", ".join(row) + ")" for row in rows)


def compile_sql(pack: dict[str, Any]) -> str:
    boundary = pack["source_boundary"]
    subject_slug = pack["existing_subject"]["slug"]
    pack_hash = pack_sha256(pack)
    entity_values = sql_values([
        [sql_quote(entity["slug"]), sql_quote(entity["entity_kind"]), sql_quote(entity["canonical_name"]), sql_quote(entity["description"])]
        for entity in pack["entities"]
    ])
    name_values = sql_values([
        [sql_quote(entity["slug"]), sql_quote(name["name"]), sql_quote(name["language_code"]), sql_quote(name["script_code"]), sql_quote(name["name_kind"]), str(name["is_preferred"]).lower()]
        for entity in pack["entities"] for name in entity["names"]
    ])
    claim_rows: list[list[str]] = []
    for claim in pack["claims"]:
        evidence = claim["evidence"]
        for language_code in ("en", "hi"):
            uncertainty = (
                f"Devam source-bounded narrative index for one exact Sanskrit Wikisource provider revision at chapter {evidence['chapter']}, "
                f"verse {evidence['verse']}. It is not a source-original translation, identified print edition, critical recension, "
                "complete Devimahatmya or Shakta tradition, festival origin, ritual authority, historical claim, or label for living people or groups."
            )
            claim_rows.append([
                sql_quote(stable_key(claim["claim_slug"], language_code)), sql_quote(claim["statements"][language_code]),
                sql_quote(language_code), str(claim["_confidence"]), sql_quote(evidence["source_sha256"]), str(evidence["citation_ordinal"]), str(evidence["chapter"]),
                str(evidence["verse"]), str(evidence["source_ordinal"]), sql_quote(evidence["source_span_sha256"]),
                sql_quote(claim["_translation_note"]), sql_quote(uncertainty),
            ])
    claim_values = sql_values(claim_rows)
    relationship_values = sql_values([
        [sql_quote(claim["object_slug"]), sql_quote(claim["predicate"]), sql_quote(stable_key(claim["claim_slug"], "en"))]
        for claim in pack["claims"]
    ])
    entity_array = ", ".join(sql_quote(entity["slug"]) for entity in pack["entities"])
    evidence_coordinates = sorted({
        (claim["evidence"]["source_sha256"], claim["evidence"]["source_ordinal"], claim["evidence"]["source_span_sha256"])
        for claim in pack["claims"]
    })
    evidence_values = sql_values([
        [sql_quote(source_sha256), str(source_ordinal), sql_quote(source_span_sha256)]
        for source_sha256, source_ordinal, source_span_sha256 in evidence_coordinates
    ])
    entity_count = len(pack["entities"])
    preferred_name_count = sum(len(entity["names"]) for entity in pack["entities"])
    bilingual_claim_count = len(pack["claims"]) * 2
    relationship_count = len(pack["claims"])
    evidence_passage_count = len(evidence_coordinates)
    prefix = "durga-devimahatmya-semantic-"
    return f"""-- Generated by tools/compile_devimahatmya_semantic_graph_v1.py.
-- Source-bounded semantic indexing only; no source payload is copied.

begin;

do $$
begin
  if (select count(*) from public.entities where slug={sql_quote(subject_slug)} and publication_state='published') <> 1 then
    raise exception 'Published Devimahatmya subject entity is absent or duplicated';
  end if;
  if (select count(*) from public.source_objects where sha256=any(array[{", ".join(sql_quote(value) for value in SOURCE_SHA256S)}]) and rights_lane='derivative_allowed') <> {len(SOURCE_SHA256S)} then
    raise exception 'Pinned Devimahatmya source object set is absent, duplicated, or rights-incompatible';
  end if;
  if (select count(*) from (values
    {evidence_values}
  ) expected(source_sha256, source_ordinal, source_span_sha256)
  join public.source_objects source on source.sha256=expected.source_sha256
  join public.passages passage on passage.source_object_id=source.id
    and passage.source_ordinal=expected.source_ordinal and passage.span_sha256=expected.source_span_sha256
    and passage.publication_state='published' and passage.rights_lane='derivative_allowed') <> {evidence_passage_count} then
    raise exception 'Pinned semantic evidence passage set is incomplete';
  end if;
end $$;

with input(slug, entity_kind, canonical_name, description) as (values
  {entity_values}
)
insert into public.entities (slug, entity_kind, canonical_name, description, temporal_scope, geographic_scope, rights_lane, publication_state)
select slug, entity_kind, canonical_name, description, '{{}}'::jsonb, '{{}}'::jsonb, 'derivative_allowed', 'published' from input
on conflict (slug) do update set entity_kind=excluded.entity_kind, canonical_name=excluded.canonical_name, description=excluded.description, temporal_scope=excluded.temporal_scope, geographic_scope=excluded.geographic_scope, rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;

with input(entity_slug, name, language_code, script_code, name_kind, is_preferred) as (values
  {name_values}
)
insert into public.entity_names (entity_id, name, language_code, script_code, name_kind, is_preferred)
select e.id, i.name, i.language_code, i.script_code, i.name_kind, i.is_preferred
from input i join public.entities e on e.slug=i.entity_slug
on conflict (entity_id, name, language_code, name_kind) do update set script_code=excluded.script_code, is_preferred=excluded.is_preferred;

with input(stable_key, statement, language_code, confidence, source_sha256, citation_ordinal, chapter, verse, source_ordinal, source_span_sha256, translation_note, uncertainty_note) as (values
  {claim_values}
)
insert into public.claims (stable_key, subject_entity_id, statement, language_code, claim_kind, evidence_class, confidence, applicability, uncertainty_note, rights_lane, publication_state)
select i.stable_key, subject.id, i.statement, i.language_code, 'source_bounded_narrative_index', 'devam_synthesis', i.confidence,
  jsonb_build_object('pack_id', {sql_quote(pack['pack_id'])}, 'pack_sha256', {sql_quote(pack_hash)}, 'work_slug', {sql_quote(boundary['work_slug'])},
    'bounded_text', {sql_quote(boundary['bounded_text'])}, 'source_profile_id', {sql_quote(boundary['source_profile_id'])}, 'provider', {sql_quote(boundary['provider'])},
    'source_sha256', i.source_sha256, 'citation_ordinal', i.citation_ordinal, 'chapter', i.chapter, 'verse', i.verse, 'scope', {sql_quote(boundary['scope'])},
    'translation_status', 'devam_beta_source_aligned_not_independently_sanskrit_reviewed', 'translation_is_source_original', false),
  i.uncertainty_note, 'derivative_allowed', 'published'
from input i cross join public.entities subject where subject.slug={sql_quote(subject_slug)}
on conflict (stable_key) do update set subject_entity_id=excluded.subject_entity_id, statement=excluded.statement, language_code=excluded.language_code, claim_kind=excluded.claim_kind, evidence_class=excluded.evidence_class, confidence=excluded.confidence, applicability=excluded.applicability, uncertainty_note=excluded.uncertainty_note, rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;

with input(stable_key, statement, language_code, confidence, source_sha256, citation_ordinal, chapter, verse, source_ordinal, source_span_sha256, translation_note, uncertainty_note) as (values
  {claim_values}
)
insert into public.claim_evidence (claim_id, passage_id, evidence_role, note)
select c.id, p.id, 'supports', jsonb_build_object(
  'contract', {sql_quote(CONTRACT)}, 'pack_id', {sql_quote(pack['pack_id'])}, 'pack_sha256', {sql_quote(pack_hash)},
  'source_sha256', i.source_sha256, 'source_ordinal', i.source_ordinal, 'source_span_sha256', i.source_span_sha256,
  'citation_ordinal', i.citation_ordinal, 'chapter', i.chapter, 'verse', i.verse, 'source_boundary', {sql_quote(boundary['scope'])},
  'translation_claim_stable_key', 'durga-devimahatmya-wikisource-translation-' || lpad(i.citation_ordinal::text, 4, '0') || '-' || i.language_code,
  'translation_is_source_original', false, 'translation_note', i.translation_note, 'source_payload_duplicated', false)::text
from input i join public.claims c on c.stable_key=i.stable_key
join public.source_objects s on s.sha256=i.source_sha256
join public.passages p on p.source_object_id=s.id and p.source_ordinal=i.source_ordinal and p.span_sha256=i.source_span_sha256
on conflict (claim_id, passage_id, evidence_role) do update set note=excluded.note;

with input(object_slug, predicate, claim_key) as (values
  {relationship_values}
)
insert into public.relationships (subject_entity_id, predicate, object_entity_id, claim_id, applicability, rights_lane, publication_state)
select subject.id, i.predicate, object.id, c.id,
  jsonb_build_object('pack_id', {sql_quote(pack['pack_id'])}, 'pack_sha256', {sql_quote(pack_hash)}, 'source_boundary', {sql_quote(boundary['scope'])},
    'relationship_kind', 'text_contains_narrative_identity', 'not_historical_or_universal', true),
  'derivative_allowed', 'published'
from input i cross join public.entities subject join public.entities object on object.slug=i.object_slug join public.claims c on c.stable_key=i.claim_key
where subject.slug={sql_quote(subject_slug)}
on conflict (subject_entity_id, predicate, object_entity_id, claim_id) do update set applicability=excluded.applicability, rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;

do $$
begin
  if (select count(*) from public.entities where slug=any(array[{entity_array}]) and rights_lane='derivative_allowed' and publication_state='published') <> {entity_count} then raise exception 'Devimahatmya semantic entity verification failed'; end if;
  if (select count(*) from public.entity_names n join public.entities e on e.id=n.entity_id where e.slug=any(array[{entity_array}]) and n.is_preferred) <> {preferred_name_count} then raise exception 'Devimahatmya semantic preferred-name verification failed'; end if;
  if (select count(*) from public.claims where stable_key like {sql_quote(prefix + '%')} and claim_kind='source_bounded_narrative_index' and evidence_class='devam_synthesis' and rights_lane='derivative_allowed' and publication_state='published') <> {bilingual_claim_count} then raise exception 'Devimahatmya semantic claim verification failed'; end if;
  if (select count(*) from public.claim_evidence ce join public.claims c on c.id=ce.claim_id where c.stable_key like {sql_quote(prefix + '%')} and ce.evidence_role='supports') <> {bilingual_claim_count} then raise exception 'Devimahatmya semantic evidence verification failed'; end if;
  if (select count(*) from public.relationships r join public.entities s on s.id=r.subject_entity_id join public.entities o on o.id=r.object_entity_id join public.claims c on c.id=r.claim_id where s.slug={sql_quote(subject_slug)} and o.slug=any(array[{entity_array}]) and r.predicate='contains_narrative_of' and c.stable_key like {sql_quote(prefix + '%')} and r.rights_lane='derivative_allowed' and r.publication_state='published') <> {relationship_count} then raise exception 'Devimahatmya semantic relationship verification failed'; end if;
end $$;

commit;
"""


def build_report(pack: dict[str, Any]) -> dict[str, Any]:
    sql = compile_sql(pack)
    migration_matches = MIGRATION_PATH.exists() and MIGRATION_PATH.read_text(encoding="utf-8") == sql
    return {
        "result": "PASS" if migration_matches else "STALE_OR_MISSING_MIGRATION",
        "contract": CONTRACT,
        "pack_id": pack["pack_id"],
        "pack_sha256": pack_sha256(pack),
        "sql_sha256": sha256_bytes(sql.encode("utf-8")),
        "migration_path": str(MIGRATION_PATH.relative_to(ROOT)).replace("\\", "/"),
        "migration_matches": migration_matches,
        "entity_count": len(pack["entities"]),
        "preferred_name_count": sum(len(entity["names"]) for entity in pack["entities"]),
        "bilingual_claim_count": len(pack["claims"]) * 2,
        "relationship_count": len(pack["claims"]),
        "evidence_passage_count": len({claim["evidence"]["citation_ordinal"] for claim in pack["claims"]}),
        "source_payloads_copied": False,
        "claim_ceiling": pack["source_boundary"]["claim_ceiling"],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Compile the bounded Devimahatmya semantic graph increment.")
    parser.add_argument("--format", choices=("report", "sql"), default="report")
    parser.add_argument("--output", type=Path, help="Write generated SQL to this path instead of stdout.")
    args = parser.parse_args()
    pack = load_pack()
    rendered = compile_sql(pack) if args.format == "sql" else json.dumps(build_report(pack), ensure_ascii=False, indent=2, sort_keys=True) + "\n"
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(rendered, encoding="utf-8", newline="\n")
    else:
        print(rendered, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

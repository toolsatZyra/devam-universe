from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from tools.compile_source_vault_tei_ingestion import ROOT, canonical_json, json_sql, sha256_bytes, sql_quote
from tools.compile_wikisource_wikitext_ingestion import compile_packet as compile_source_packet


CONTRACT = "DEVAM_SOURCE_BOUNDED_WIKISOURCE_KNOWLEDGE_PACK_V1"
SOURCE_PLAN = ROOT / "ingestion" / "plans" / "ganapatyatharvashirsha-wikisource-v1.json"


def load_pack(path: Path) -> dict[str, Any]:
    pack = json.loads(path.read_text(encoding="utf-8"))
    if pack.get("contract") != CONTRACT:
        raise ValueError("Unsupported Wikisource knowledge-pack contract")
    if pack["source"]["rights_lane"] != "derivative_allowed" or pack["source"]["publication_state"] != "published":
        raise ValueError("Knowledge pack is outside the product-compatible publication lane")
    if pack["source"]["underlying_print_edition_identified"]:
        raise ValueError("Underlying edition must remain unresolved")
    if any(pack["completion_denials"].values()):
        raise ValueError("All completion denials must remain false")
    source = compile_source_packet(SOURCE_PLAN)
    if source["packet_sha256"] != pack["source"]["required_ingestion_packet_sha256"]:
        raise ValueError("Pinned source packet drift")
    if source["work"]["slug"] != pack["source"]["work_slug"]:
        raise ValueError("Work route drift")
    canonical = next(row for row in source["source_objects"] if row["role"] == "canonical_wikitext")
    if canonical["sha256"] != pack["source"]["canonical_wikitext_sha256"]:
        raise ValueError("Canonical source drift")
    passages = {row["source_ordinal"]: row for row in source["passages"]}
    keys = [claim["stable_key"] for claim in pack["claims"]]
    if len(keys) != len(set(keys)) or len(pack["claims"]) != 10:
        raise ValueError("Expected ten unique bilingual claims")
    for claim in pack["claims"]:
        if claim["subject_slug"] != "ganapati" or claim["language_code"] not in {"en", "hi"}:
            raise ValueError("Claim route or language drift")
        passage = passages.get(claim["source_ordinal"])
        if passage is None or claim["required_text"] not in passage["exact_text"]:
            raise ValueError(f"Claim evidence drift: {claim['stable_key']}")
        if not claim["uncertainty_note"]:
            raise ValueError("Every claim needs a source boundary")
    core = {**pack, "source_passage_count": len(passages)}
    return {**core, "pack_sha256": sha256_bytes(canonical_json(core).encode("utf-8"))}


def compile_statements(pack: dict[str, Any]) -> list[str]:
    source_sha = pack["source"]["canonical_wikitext_sha256"]
    lane, state = pack["source"]["rights_lane"], pack["source"]["publication_state"]
    statements = [f"""do $$
begin
  if (select count(*) from public.source_objects where sha256={sql_quote(source_sha)} and rights_lane={sql_quote(lane)}) <> 1 then
    raise exception 'Pinned source object is absent, duplicated, or rights-incompatible';
  end if;
  if (select count(*) from public.passages p join public.source_objects s on s.id=p.source_object_id where s.sha256={sql_quote(source_sha)} and p.publication_state={sql_quote(state)} and p.rights_lane={sql_quote(lane)}) <> {pack['source_passage_count']} then
    raise exception 'Pinned source passage universe is incomplete';
  end if;
  if (select count(*) from public.entities where slug='ganapati' and publication_state='published') <> 1 then
    raise exception 'Published Ganapati entity is absent or duplicated';
  end if;
end $$;"""]
    for claim in pack["claims"]:
        applicability = {
            "pack_id": pack["pack_id"],
            "work_slug": pack["source"]["work_slug"],
            "provider_revision_id": pack["source"]["provider_revision_id"],
            "scope": "this_source_only",
        }
        statements.append(f"""insert into public.claims (stable_key, subject_entity_id, statement, language_code, claim_kind, evidence_class, confidence, applicability, uncertainty_note, rights_lane, publication_state) select {sql_quote(claim['stable_key'])}, e.id, {sql_quote(claim['statement'])}, {sql_quote(claim['language_code'])}, {sql_quote(claim['claim_kind'])}, {sql_quote(claim['evidence_class'])}, {claim['confidence']}, {json_sql(applicability)}, {sql_quote(claim['uncertainty_note'])}, {sql_quote(lane)}, {sql_quote(state)} from public.entities e where e.slug='ganapati' on conflict (stable_key) do update set subject_entity_id=excluded.subject_entity_id, statement=excluded.statement, language_code=excluded.language_code, claim_kind=excluded.claim_kind, evidence_class=excluded.evidence_class, confidence=excluded.confidence, applicability=excluded.applicability, uncertainty_note=excluded.uncertainty_note, rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;""")
        note = {
            "pack_id": pack["pack_id"],
            "pack_sha256": pack["pack_sha256"],
            "required_text": claim["required_text"],
            "source_boundary": "this_source_only",
            "source_aligned_devam_rendering": True,
        }
        statements.append(f"""insert into public.claim_evidence (claim_id, passage_id, evidence_role, note) select c.id, p.id, 'supports', {json_sql(note)} from public.claims c join public.source_objects s on s.sha256={sql_quote(source_sha)} join public.passages p on p.source_object_id=s.id and p.source_ordinal={claim['source_ordinal']} where c.stable_key={sql_quote(claim['stable_key'])} on conflict (claim_id, passage_id, evidence_role) do update set note=excluded.note;""")
    return statements


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


def main() -> int:
    parser = argparse.ArgumentParser(description="Compile a source-bounded Wikisource knowledge pack.")
    parser.add_argument("--pack", required=True, type=Path)
    parser.add_argument("--format", choices=("report", "sql-batch"), default="report")
    parser.add_argument("--batch-index", type=int)
    args = parser.parse_args()
    path = args.pack.resolve(strict=True)
    if not path.is_relative_to(ROOT / "knowledge_packs"):
        raise ValueError("Pack must be inside knowledge_packs")
    pack = load_pack(path)
    batches = compile_batches(pack)
    if args.format == "sql-batch":
        if args.batch_index is None or not 0 <= args.batch_index < len(batches):
            raise ValueError("Invalid batch index")
        sys.stdout.write(batches[args.batch_index])
    else:
        sql = "\n".join(batches)
        print(json.dumps({
            "result": "PASS",
            "contract": CONTRACT,
            "pack_id": pack["pack_id"],
            "pack_sha256": pack["pack_sha256"],
            "sql_sha256": sha256_bytes(sql.encode("utf-8")),
            "sql_batch_count": len(batches),
            "claim_count": len(pack["claims"]),
            "evidence_link_count": len(pack["claims"]),
            **pack["completion_denials"],
        }, ensure_ascii=False, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

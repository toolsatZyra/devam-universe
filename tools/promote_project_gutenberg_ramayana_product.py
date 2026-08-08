from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path
from typing import Any

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from tools.compile_project_gutenberg_ramayana_ingestion import (
    ROOT,
    canonical_json,
    compile_packet as compile_upstream_packet,
    passage_root,
    sql_quote,
)


CONTRACT = "DEVAM_GRIFFITH_RAMAYANA_PRODUCT_PROMOTION_V1"
REPORT_CONTRACT = "DEVAM_GRIFFITH_RAMAYANA_PRODUCT_PROMOTION_REPORT_V1"
UPSTREAM_PLAN = ROOT / "ingestion" / "plans" / "ramayana-griffith-project-gutenberg-v1.json"
EXPECTED_UPSTREAM_PLAN_SHA256 = "c154f3ab85079c8b5e16c191a355ea5dc2bfcb4107a318a56b4f825f5fb3fac4"
EXPECTED_UPSTREAM_PACKET_SHA256 = "80a64ddf9897573f450783db885f3e434ef5d1e3f8672512c070aec512cfbf2f"
EXPECTED_PASSAGE_ROOT = "e0c62543a911092244d9ec03d413cca178b968cd99de2b9fe8f10d261cebe5d4"
EXPECTED_STRUCTURAL_TEI_SHA256 = "1fa8d3e9da23d83abd334661db3a95574bfd6290943441c374d9bce4ef142ed9"


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def validate_plan(plan: dict[str, Any], plan_path: Path) -> dict[str, Any]:
    if plan_path.parent != ROOT / "ingestion" / "plans":
        raise ValueError("Promotion plan must be inside ingestion/plans")
    if plan.get("contract") != CONTRACT:
        raise ValueError("Promotion contract drift")
    if plan.get("action") != "metadata_and_passage_status_promotion_only_no_source_payload_copy":
        raise ValueError("Promotion action drift")

    upstream_bytes = UPSTREAM_PLAN.read_bytes()
    if sha256_bytes(upstream_bytes) != EXPECTED_UPSTREAM_PLAN_SHA256:
        raise ValueError("Frozen upstream plan hash drift")
    upstream = compile_upstream_packet(UPSTREAM_PLAN)
    if upstream["packet_sha256"] != EXPECTED_UPSTREAM_PACKET_SHA256:
        raise ValueError("Frozen upstream packet hash drift")
    if passage_root(upstream) != EXPECTED_PASSAGE_ROOT or upstream["passage_count"] != 560:
        raise ValueError("Frozen upstream passage universe drift")
    if plan["upstream"] != {
        "plan_path": "ingestion/plans/ramayana-griffith-project-gutenberg-v1.json",
        "plan_sha256": EXPECTED_UPSTREAM_PLAN_SHA256,
        "packet_sha256": EXPECTED_UPSTREAM_PACKET_SHA256,
        "passage_content_root_sha256": EXPECTED_PASSAGE_ROOT,
    }:
        raise ValueError("Promotion upstream binding drift")

    identity = plan["database_identity"]
    expected_identity = {
        "work_slug": upstream["work"]["slug"],
        "expression_language_code": upstream["expression"]["language_code"],
        "expression_kind": upstream["expression"]["expression_kind"],
        "expression_attribution": upstream["expression"]["attribution"],
        "edition_title": upstream["edition"]["edition_title"],
        "promoted_source_sha256": EXPECTED_STRUCTURAL_TEI_SHA256,
        "expected_expression_count": 1,
        "expected_edition_count": 1,
        "expected_indexed_source_count": 6,
        "expected_promoted_source_count": 1,
        "expected_passage_count": 560,
        "expected_min_source_ordinal": 1,
        "expected_max_source_ordinal": 560,
    }
    if identity != expected_identity:
        raise ValueError("Exact database identity drift")
    source_shas = {row["sha256"] for row in upstream["source_objects"]}
    if len(source_shas) != 6 or EXPECTED_STRUCTURAL_TEI_SHA256 not in source_shas:
        raise ValueError("Upstream indexed-source universe drift")

    rights = plan["rights_decision"]
    if rights["lane"] != "product_allowed" or rights["publication_state"] != "published":
        raise ValueError("Product rights state drift")
    if rights["target_product_geography"] != ["India", "United States"]:
        raise ValueError("Jurisdiction scope drift")
    if rights["underlying_translation"]["translator_death_date"] != "1906-11-07":
        raise ValueError("Translator death evidence drift")
    if rights["underlying_translation"]["publication_years"] != "1870-1874":
        raise ValueError("Publication evidence drift")
    electronic = rights["electronic_text_and_trademark_boundary"]
    if electronic != {
        "provider_rights_literal": "Public domain in the USA.",
        "provider_permission_summary": "Project Gutenberg states that the underlying text may be reused when the Project Gutenberg license and trademark references are removed; bibliographic acknowledgements and source references are not treated as trademark use.",
        "project_gutenberg_license_or_trademark_present_in_product_passages": False,
        "product_passages_containing_project_gutenberg_reference": 0,
        "empty_generated_pgheader_pgfooter_divs_excluded": True,
        "project_gutenberg_name_use": "bibliographic_source_and_provenance_reference_only_not_product_branding",
        "commercial_project_gutenberg_trademark_use": False,
    }:
        raise ValueError("Project Gutenberg trademark/content boundary drift")
    forbidden = ("Project Gutenberg", "Gutenberg", "www.gutenberg.org", "Project Gutenberg-tm License")
    if any(any(token in row["exact_text"] for token in forbidden) for row in upstream["passages"]):
        raise ValueError("A product passage contains Project Gutenberg license/trademark framing")

    observations = {row["evidence_id"]: row for row in plan["evidence_observations"]}
    if set(observations) != {
        "india-copyright-act-section-22",
        "project-gutenberg-license",
        "griffith-dnb-biography",
        "worldcat-edition-record",
        "us-copyright-office-public-domain-cutoff",
    }:
        raise ValueError("Rights evidence universe drift")
    if any(row.get("status") != 200 for row in observations.values()):
        raise ValueError("Rights evidence status drift")

    boundary = plan["product_boundary"]
    if boundary["full_reading_layout_complete"] is not False:
        raise ValueError("Normalized passages must not claim full reading layout")
    if set(boundary["completion_denials"]) != {
        "complete_griffith_translation_without_omissions",
        "uttarakanda_main_book_present",
        "complete_valmiki_ramayana_sanskrit_source",
        "complete_ramayana_tradition_or_all_recensions",
        "page_layout_or_verse_lineation_preserved_in_normalized_passages",
        "critical_or_authoritative_sanskrit_edition",
        "hindi_translation_present",
        "ramayana_hero_universe_complete",
        "mvp_library_complete",
    } or any(boundary["completion_denials"].values()):
        raise ValueError("Completion-denial boundary drift")
    if any(plan["mutation_boundary"].values()):
        raise ValueError("Mutation boundary must remain entirely false")
    return upstream


def rights_basis(plan: dict[str, Any]) -> dict[str, Any]:
    return {
        "decision_contract": CONTRACT,
        "promotion_id": plan["promotion_id"],
        "decision": plan["rights_decision"],
        "evidence_observations": plan["evidence_observations"],
        "product_boundary": plan["product_boundary"],
        "upstream": plan["upstream"],
    }


def json_sql(value: Any) -> str:
    return f"{sql_quote(canonical_json(value))}::jsonb"


def compile_sql(plan: dict[str, Any], upstream: dict[str, Any]) -> str:
    i = plan["database_identity"]
    text_status = plan["product_boundary"]["text_status"]
    basis = rights_basis(plan)
    shas = ",".join(sql_quote(row["sha256"]) for row in upstream["source_objects"])
    return f"""begin;

do $devam_preflight$
declare
  expression_count integer;
  edition_count integer;
  source_count integer;
  promoted_source_count integer;
  passage_count integer;
  pg_reference_count integer;
begin
  select count(*) into expression_count
  from public.expressions e join public.works w on w.id=e.work_id
  where w.slug={sql_quote(i['work_slug'])}
    and e.language_code={sql_quote(i['expression_language_code'])}
    and e.expression_kind={sql_quote(i['expression_kind'])}
    and e.attribution={sql_quote(i['expression_attribution'])};
  if expression_count <> 1 then raise exception 'Griffith expression count drift: %', expression_count; end if;

  select count(*) into edition_count
  from public.editions d join public.expressions e on e.id=d.expression_id join public.works w on w.id=e.work_id
  where w.slug={sql_quote(i['work_slug'])}
    and e.language_code={sql_quote(i['expression_language_code'])}
    and e.expression_kind={sql_quote(i['expression_kind'])}
    and e.attribution={sql_quote(i['expression_attribution'])}
    and d.edition_title={sql_quote(i['edition_title'])};
  if edition_count <> 1 then raise exception 'Griffith edition count drift: %', edition_count; end if;

  select count(*) into source_count from public.source_objects where sha256 in ({shas});
  if source_count <> 6 then raise exception 'Griffith indexed source universe drift: %', source_count; end if;
  select count(*) into promoted_source_count from public.source_objects where sha256={sql_quote(i['promoted_source_sha256'])};
  if promoted_source_count <> 1 then raise exception 'Griffith structural TEI source count drift: %', promoted_source_count; end if;

  select count(*) into passage_count from public.passages p join public.source_objects s on s.id=p.source_object_id
  where s.sha256={sql_quote(i['promoted_source_sha256'])};
  if passage_count <> 560 then raise exception 'Griffith passage count drift: %', passage_count; end if;
  if (select min(p.source_ordinal) from public.passages p join public.source_objects s on s.id=p.source_object_id where s.sha256={sql_quote(i['promoted_source_sha256'])}) <> 1
     or (select max(p.source_ordinal) from public.passages p join public.source_objects s on s.id=p.source_object_id where s.sha256={sql_quote(i['promoted_source_sha256'])}) <> 560
     or (select count(distinct p.source_ordinal) from public.passages p join public.source_objects s on s.id=p.source_object_id where s.sha256={sql_quote(i['promoted_source_sha256'])}) <> 560
  then raise exception 'Griffith passage ordinal universe drift'; end if;

  select count(*) into pg_reference_count
  from public.passages p join public.source_objects s on s.id=p.source_object_id
  where s.sha256={sql_quote(i['promoted_source_sha256'])}
    and (p.exact_text ilike '%Project Gutenberg%' or p.exact_text ilike '%www.gutenberg.org%' or p.exact_text ilike '%Gutenberg-tm%');
  if pg_reference_count <> 0 then raise exception 'Project Gutenberg framing leaked into product passages: %', pg_reference_count; end if;
end
$devam_preflight$;

update public.expressions e
set rights_lane='product_allowed', publication_state='published'
from public.works w
where e.work_id=w.id and w.slug={sql_quote(i['work_slug'])}
  and e.language_code={sql_quote(i['expression_language_code'])}
  and e.expression_kind={sql_quote(i['expression_kind'])}
  and e.attribution={sql_quote(i['expression_attribution'])};

update public.editions d
set rights_lane='product_allowed', publication_state='published'
from public.expressions e, public.works w
where d.expression_id=e.id and e.work_id=w.id and w.slug={sql_quote(i['work_slug'])}
  and e.language_code={sql_quote(i['expression_language_code'])}
  and e.expression_kind={sql_quote(i['expression_kind'])}
  and e.attribution={sql_quote(i['expression_attribution'])}
  and d.edition_title={sql_quote(i['edition_title'])};

update public.source_objects
set rights_lane='product_allowed', rights_basis={json_sql(basis)}
where sha256={sql_quote(i['promoted_source_sha256'])};

update public.passages p
set rights_lane='product_allowed', publication_state='published', text_status={sql_quote(text_status)}
from public.source_objects s
where p.source_object_id=s.id and s.sha256={sql_quote(i['promoted_source_sha256'])};

do $devam_postflight$
begin
  if (select count(*) from public.passages p join public.source_objects s on s.id=p.source_object_id
      where s.sha256={sql_quote(i['promoted_source_sha256'])} and p.rights_lane='product_allowed' and p.publication_state='published'
        and p.text_status={sql_quote(text_status)}) <> 560
  then raise exception 'Griffith product passage postflight failed'; end if;
  if (select count(*) from public.source_objects where sha256 in ({shas}) and sha256 <> {sql_quote(i['promoted_source_sha256'])}
      and rights_lane <> 'private_evidence') <> 0
  then raise exception 'Non-TEI Griffith source lane drift'; end if;
end
$devam_postflight$;

commit;
"""


def build_report(plan_path: Path) -> dict[str, Any]:
    plan = read_json(plan_path)
    upstream = validate_plan(plan, plan_path)
    sql = compile_sql(plan, upstream)
    return {
        "contract": REPORT_CONTRACT,
        "result": "PASS",
        "promotion_id": plan["promotion_id"],
        "plan_sha256": sha256_bytes(plan_path.read_bytes()),
        "upstream_plan_sha256": EXPECTED_UPSTREAM_PLAN_SHA256,
        "upstream_packet_sha256": upstream["packet_sha256"],
        "upstream_passage_content_root_sha256": passage_root(upstream),
        "sql_sha256": sha256_bytes(sql.encode("utf-8")),
        "promoted_source_sha256": EXPECTED_STRUCTURAL_TEI_SHA256,
        "promoted_source_object_count": 1,
        "promoted_passage_count": len(upstream["passages"]),
        "product_passages_containing_project_gutenberg_reference": 0,
        "source_payloads_copied_or_downloaded": False,
        "reader_payload_created": False,
        "positive_boundary": plan["product_boundary"]["positive_claim"],
        "completion_denials": plan["product_boundary"]["completion_denials"],
        "hosted_import": {"attempted": False, "status": "NOT_RUN"},
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Promote the exact Griffith/Project Gutenberg Ramayana text lane.")
    parser.add_argument("--plan", required=True, type=Path)
    parser.add_argument("--format", choices=("report", "sql"), default="report")
    args = parser.parse_args()
    plan_path = args.plan.resolve(strict=True)
    plan = read_json(plan_path)
    upstream = validate_plan(plan, plan_path)
    if args.format == "sql":
        sys.stdout.write(compile_sql(plan, upstream))
    else:
        print(json.dumps(build_report(plan_path), ensure_ascii=False, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

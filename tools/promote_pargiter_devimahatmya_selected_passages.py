from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path
from typing import Any

ROOT_DIR = Path(__file__).resolve().parents[1]
TOOLS_DIR = ROOT_DIR / "tools"
for import_root in (ROOT_DIR, TOOLS_DIR):
    if str(import_root) not in sys.path:
        sys.path.insert(0, str(import_root))

from tools.compile_markandeya_purana_pargiter_1904_ingestion import (
    ROOT,
    canonical_json,
    compile_packet as compile_upstream_packet,
    sql_quote,
)


CONTRACT = "DEVAM_PARGITER_DEVIMAHATMYA_SELECTED_PASSAGES_V1"
REPORT_CONTRACT = "DEVAM_PARGITER_DEVIMAHATMYA_SELECTED_PASSAGES_REPORT_V1"
UPSTREAM_PLAN = ROOT / "ingestion" / "plans" / "markandeya-purana-pargiter-1904-v1.json"
EXPECTED_UPSTREAM_PLAN_SHA256 = "fe1102e0624286cf2676da7249b52e7bca69f3310ba6008b82312b1fc04c9773"
EXPECTED_UPSTREAM_PACKET_SHA256 = "9b7ccd43163cadd84f3c41a8c4fbacf40205e4539678c2b51da16829fe257969"
EXPECTED_OCR_ROOT = "c845a52904fdc92134e93f3c46064445eecb400e08db459b7d235d10bfca9a65"
PDF_SHA256 = "f7023e3aa0127b9a093b88664c68374da72d469e4f790c4a7bd4606a392e7300"
OCR_SHA256 = "13bdc99c6fa799eb68b6fe1526e6a696ad912c2d6a2c620022c07f40b31a531b"
TEXT_STATUS = "visually_verified_source_aligned_normalized_transcription_from_fixed_pdf_page"
EXPECTED_CANTOS = [82, 83, 85, 90, 91, 92, 93]
EXPECTED_PDF_PAGES = [517, 524, 534, 553, 556, 562, 566]
COMPLETION_DENIAL_KEYS = {
    "complete_transcription_of_cantos_81_93",
    "complete_devimahatmya_tradition_or_all_recensions",
    "complete_markandeya_purana_tradition",
    "sanskrit_source_original_present_in_this_expression",
    "provider_ocr_product_ready",
    "page_layout_or_footnotes_preserved",
    "universal_ritual_authority",
    "divine_outcome_guaranteed_by_devam_or_sarthi",
    "durga_hero_universe_complete",
    "mvp_library_complete",
}


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8", errors="strict"))


def passage_root(passages: list[dict[str, Any]]) -> str:
    rows = [
        f"{row['source_ordinal']}\t{row['passage_key']}\t{sha256_bytes(row['exact_text'].encode('utf-8'))}"
        for row in passages
    ]
    return sha256_bytes("\n".join(rows).encode("utf-8"))


def upstream_ocr_root(packet: dict[str, Any]) -> str:
    rows = [
        f"{row['source_ordinal']}\t{row['span_sha256']}\t{row['locator']['ocr_text_sha256']}\t{row['locator']['structural_role']}"
        for row in packet["passages"]
    ]
    return sha256_bytes("\n".join(rows).encode("utf-8"))


def validate_plan(plan: dict[str, Any], plan_path: Path) -> dict[str, Any]:
    if plan_path.parent != ROOT / "ingestion" / "plans":
        raise ValueError("Promotion plan must be inside ingestion/plans")
    if plan.get("contract") != CONTRACT:
        raise ValueError("Promotion contract drift")
    if plan.get("action") != "insert_seven_visually_verified_selected_passages_and_promote_only_the_pargiter_pdf_lane":
        raise ValueError("Promotion action drift")

    if sha256_bytes(UPSTREAM_PLAN.read_bytes()) != EXPECTED_UPSTREAM_PLAN_SHA256:
        raise ValueError("Frozen upstream plan hash drift")
    upstream = compile_upstream_packet(UPSTREAM_PLAN)
    if upstream["packet_sha256"] != EXPECTED_UPSTREAM_PACKET_SHA256:
        raise ValueError("Frozen upstream packet hash drift")
    if upstream_ocr_root(upstream) != EXPECTED_OCR_ROOT or upstream["passage_count"] != 778:
        raise ValueError("Frozen quarantined OCR universe drift")
    if plan["upstream"] != {
        "plan_path": "ingestion/plans/markandeya-purana-pargiter-1904-v1.json",
        "plan_sha256": EXPECTED_UPSTREAM_PLAN_SHA256,
        "packet_sha256": EXPECTED_UPSTREAM_PACKET_SHA256,
        "quarantined_ocr_passage_content_root_sha256": EXPECTED_OCR_ROOT,
    }:
        raise ValueError("Upstream binding drift")

    identity = plan["database_identity"]
    expected_identity = {
        "work_slug": upstream["work"]["slug"],
        "work_title": upstream["work"]["canonical_title"],
        "expression_language_code": upstream["expression"]["language_code"],
        "expression_kind": upstream["expression"]["expression_kind"],
        "expression_attribution": upstream["expression"]["attribution"],
        "edition_title": upstream["edition"]["edition_title"],
        "pdf_source_sha256": PDF_SHA256,
        "pdf_source_bytes": 47426809,
        "ocr_source_sha256": OCR_SHA256,
        "expected_quarantined_ocr_passage_count": 778,
        "expected_selected_passage_count": 7,
    }
    if identity != expected_identity:
        raise ValueError("Exact database identity drift")
    pdf_path = ROOT / "source_vault" / "objects" / "sha256" / PDF_SHA256[:2] / PDF_SHA256
    if pdf_path.stat().st_size != identity["pdf_source_bytes"] or sha256_bytes(pdf_path.read_bytes()) != PDF_SHA256:
        raise ValueError("Fixed Pargiter PDF drift")

    method = plan["transcription_method"]
    if method["text_status"] != TEXT_STATUS or method["human_visual_review_completed"] is not True:
        raise ValueError("Visual transcription status drift")
    if any(method[key] is not True for key in (
        "page_rendering_is_not_a_retained_source_payload",
        "provider_ocr_used_only_for_page_discovery",
        "comparison_witness_used_only_in_memory",
        "comparison_witness_is_not_a_product_source",
    )) or method["provider_ocr_promoted"] is not False:
        raise ValueError("Transcription provenance boundary drift")

    witnesses = plan["comparison_witness_observations"]
    if [row["canto"] for row in witnesses] != EXPECTED_CANTOS or any(row["status"] != 200 for row in witnesses):
        raise ValueError("Comparison witness observation universe drift")
    if any(row["url"] != row["final_url"] or len(row["response_sha256"]) != 64 for row in witnesses):
        raise ValueError("Comparison witness URL or hash drift")
    if witnesses[2]["strict_utf8"] is not False or any(row["strict_utf8"] is not True for row in witnesses[:2] + witnesses[3:]):
        raise ValueError("Comparison witness encoding observation drift")

    passages = plan["passages"]
    if [row["source_ordinal"] for row in passages] != list(range(1, 8)):
        raise ValueError("Selected passage ordinal universe drift")
    if [row["canto"] for row in passages] != EXPECTED_CANTOS:
        raise ValueError("Selected canto universe drift")
    if [row["pdf_pages"] for row in passages] != [[page, page] for page in EXPECTED_PDF_PAGES]:
        raise ValueError("Selected PDF page universe drift")
    if any(row["printed_pages"] != [row["pdf_pages"][0] - 43] * 2 for row in passages):
        raise ValueError("Printed/PDF page crosswalk drift")
    if len({row["passage_key"].casefold() for row in passages}) != 7:
        raise ValueError("Selected passage key collision")
    if any(row["language_code"] != "en" or row["script_code"] != "Latn" for row in passages):
        raise ValueError("Selected passage language drift")
    if any(not row["exact_text"].strip() or "  " in row["exact_text"] or "\n" in row["exact_text"] for row in passages):
        raise ValueError("Selected passage text is empty or non-canonical")
    required_anchors = [
        "energies of the other gods became the auspicious goddess",
        "The goddess struck off his head",
        "form of Sleep",
        "truly alone I stand now",
        "heart of every living creature",
        "this poem of my majesty must be read",
        "the goddess vanished forthwith",
    ]
    if any(anchor not in row["exact_text"] for anchor, row in zip(required_anchors, passages, strict=True)):
        raise ValueError("Selected passage visual anchor drift")

    rights = plan["rights_decision"]
    if rights["lane"] != "product_allowed" or rights["publication_state"] != "published":
        raise ValueError("Product rights state drift")
    if rights["target_product_geography"] != ["India", "United States"]:
        raise ValueError("Product geography drift")
    if rights["translation_publication_year"] != 1904 or rights["translator_death_year"] != 1927:
        raise ValueError("Historical rights identity drift")
    if rights["provider_top_level_rights"] is not None or rights["provider_top_level_licenseurl"] is not None:
        raise ValueError("Provider top-level rights null boundary drift")
    if rights["comparison_witness_rights_not_inherited"] is not True:
        raise ValueError("Comparison witness rights isolation drift")

    boundary = plan["product_boundary"]
    if boundary["full_reading_text_complete"] is not False or boundary["source_divine_promises_are_reported_as_source_claims_not_devam_guarantees"] is not True:
        raise ValueError("Product interpretation boundary drift")
    denials = boundary["completion_denials"]
    if set(denials) != COMPLETION_DENIAL_KEYS or any(denials.values()):
        raise ValueError("Completion-denial boundary drift")
    if any(plan["mutation_boundary"].values()):
        raise ValueError("Mutation boundary must remain entirely false")
    return upstream


def json_sql(value: Any) -> str:
    return f"{sql_quote(canonical_json(value))}::jsonb"


def locator(row: dict[str, Any], plan: dict[str, Any]) -> dict[str, Any]:
    return {
        "contract": "DEVAM_VISUALLY_VERIFIED_PDF_PASSAGE_V1",
        "passage_key": row["passage_key"],
        "canto": row["canto"],
        "pdf_page_start": row["pdf_pages"][0],
        "pdf_page_end": row["pdf_pages"][1],
        "printed_page_start": row["printed_pages"][0],
        "printed_page_end": row["printed_pages"][1],
        "literal_marker": row["literal_marker"],
        "pdf_source_sha256": PDF_SHA256,
        "normalized_text_sha256": sha256_bytes(row["exact_text"].encode("utf-8")),
        "normalization": plan["transcription_method"]["text_policy"],
        "provider_ocr_promoted": False,
        "comparison_witness_is_product_source": False,
    }


def compile_sql(plan: dict[str, Any], upstream: dict[str, Any]) -> str:
    del upstream
    identity = plan["database_identity"]
    passages = plan["passages"]
    values = ",\n".join(
        "(" + ", ".join((
            str(row["source_ordinal"]),
            json_sql(locator(row, plan)),
            sql_quote(row["language_code"]),
            sql_quote(row["script_code"]),
            sql_quote(row["exact_text"]),
            sql_quote(TEXT_STATUS),
        )) + ")"
        for row in passages
    )
    basis = {
        "decision_contract": CONTRACT,
        "promotion_id": plan["promotion_id"],
        "rights_decision": plan["rights_decision"],
        "transcription_method": plan["transcription_method"],
        "product_boundary": plan["product_boundary"],
        "upstream": plan["upstream"],
    }
    return f"""begin;

do $devam_preflight$
declare
  work_count integer;
  expression_count integer;
  edition_count integer;
  pdf_count integer;
  ocr_count integer;
  ocr_passage_count integer;
  selected_count integer;
begin
  select count(*) into work_count from public.works where slug={sql_quote(identity['work_slug'])};
  if work_count <> 1 then raise exception 'Markandeya work count drift: %', work_count; end if;
  select count(*) into expression_count from public.expressions e join public.works w on w.id=e.work_id
    where w.slug={sql_quote(identity['work_slug'])} and e.language_code='en'
      and e.expression_kind={sql_quote(identity['expression_kind'])} and e.attribution={sql_quote(identity['expression_attribution'])};
  if expression_count <> 1 then raise exception 'Pargiter expression count drift: %', expression_count; end if;
  select count(*) into edition_count from public.editions d join public.expressions e on e.id=d.expression_id join public.works w on w.id=e.work_id
    where w.slug={sql_quote(identity['work_slug'])} and d.edition_title={sql_quote(identity['edition_title'])};
  if edition_count <> 1 then raise exception 'Pargiter edition count drift: %', edition_count; end if;
  select count(*) into pdf_count from public.source_objects where sha256={sql_quote(PDF_SHA256)} and byte_count=47426809;
  if pdf_count <> 1 then raise exception 'Pargiter PDF source drift: %', pdf_count; end if;
  select count(*) into ocr_count from public.source_objects where sha256={sql_quote(OCR_SHA256)};
  if ocr_count <> 1 then raise exception 'Pargiter OCR source drift: %', ocr_count; end if;
  select count(*) into ocr_passage_count from public.passages p join public.source_objects s on s.id=p.source_object_id
    where s.sha256={sql_quote(OCR_SHA256)} and p.publication_state='review'
      and p.text_status='provider_ocr_quarantined_unreviewed';
  if ocr_passage_count <> 778 then raise exception 'Quarantined OCR passage universe drift: %', ocr_passage_count; end if;
  select count(*) into selected_count from public.passages p join public.source_objects s on s.id=p.source_object_id
    where s.sha256={sql_quote(PDF_SHA256)};
  if selected_count not in (0, 7) then raise exception 'Selected Pargiter PDF passage count drift: %', selected_count; end if;
end
$devam_preflight$;

update public.works set rights_lane='product_allowed', publication_state='published'
where slug={sql_quote(identity['work_slug'])};

update public.expressions e set rights_lane='product_allowed', publication_state='published'
from public.works w where e.work_id=w.id and w.slug={sql_quote(identity['work_slug'])}
  and e.language_code='en' and e.expression_kind={sql_quote(identity['expression_kind'])}
  and e.attribution={sql_quote(identity['expression_attribution'])};

update public.editions d set rights_lane='product_allowed', publication_state='published'
from public.expressions e, public.works w where d.expression_id=e.id and e.work_id=w.id
  and w.slug={sql_quote(identity['work_slug'])} and d.edition_title={sql_quote(identity['edition_title'])};

update public.source_objects set rights_lane='product_allowed', rights_basis={json_sql(basis)}
where sha256={sql_quote(PDF_SHA256)};

with selected(source_ordinal, locator, language_code, script_code, exact_text, text_status) as (
  values
{values}
), target as (
  select id from public.source_objects where sha256={sql_quote(PDF_SHA256)}
)
insert into public.passages (
  source_object_id, source_ordinal, locator, language_code, script_code, exact_text,
  text_status, span_sha256, rights_lane, publication_state
)
select target.id, selected.source_ordinal, selected.locator, selected.language_code,
  selected.script_code, selected.exact_text, selected.text_status, null, 'product_allowed', 'published'
from selected cross join target
on conflict (source_object_id, source_ordinal) do nothing;

do $devam_postflight$
begin
  if (select count(*) from public.passages p join public.source_objects s on s.id=p.source_object_id
      where s.sha256={sql_quote(PDF_SHA256)} and p.rights_lane='product_allowed'
        and p.publication_state='published' and p.text_status={sql_quote(TEXT_STATUS)}) <> 7
  then raise exception 'Selected Pargiter product passage postflight failed'; end if;
  if (select count(*) from public.passages p join public.source_objects s on s.id=p.source_object_id
      where s.sha256={sql_quote(OCR_SHA256)} and (p.publication_state <> 'review'
        or p.text_status <> 'provider_ocr_quarantined_unreviewed')) <> 0
  then raise exception 'Quarantined OCR lane was promoted or altered'; end if;
  if (select count(*) from public.expressions e join public.works w on w.id=e.work_id
      where w.slug={sql_quote(identity['work_slug'])} and e.language_code='sa'
        and (e.rights_lane <> 'private_evidence' or e.publication_state <> 'review')) <> 0
  then raise exception 'Private Sanskrit sibling expression drift'; end if;
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
        "quarantined_ocr_passage_content_root_sha256": upstream_ocr_root(upstream),
        "selected_passage_count": len(plan["passages"]),
        "selected_passage_content_root_sha256": passage_root(plan["passages"]),
        "selected_text_sha256": [sha256_bytes(row["exact_text"].encode("utf-8")) for row in plan["passages"]],
        "sql_sha256": sha256_bytes(sql.encode("utf-8")),
        "source_payloads_copied_or_downloaded": False,
        "provider_ocr_promoted": False,
        "comparison_witness_saved_or_promoted": False,
        "positive_boundary": plan["product_boundary"]["positive_claim"],
        "completion_denials": plan["product_boundary"]["completion_denials"],
        "hosted_import": {"attempted": False, "status": "NOT_RUN"},
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Promote seven visually verified Pargiter Devimahatmya passages.")
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

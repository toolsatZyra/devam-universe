"""Compile a payload-free product structure pack for the Dutt Ramayana lane."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

from compile_dutt_project_gutenberg_ramayana_ingestion import compile_packet


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_PLAN = ROOT / "ingestion/plans/ramayana-manmatha-nath-dutt-project-gutenberg-product-v1.json"
DEFAULT_REPORT = ROOT / "ingestion/reports/ramayana-manmatha-nath-dutt-project-gutenberg-product-v1.json"
DEFAULT_OUTPUT = ROOT / "knowledge_packs/ramayana/dutt-project-gutenberg-structure-search-v1.json"
EXPECTED_PLAN_SHA256 = "3eca2354bbe81418a11a2d9372237643d8c522e04ce88ce90018ba08ebdfeb5c"
EXPECTED_REPORT_SHA256 = "747b5bf11ff769c969f7052e0c80e648a1e7e00602ece5ebe6222618bdcdd20f"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def citation_endpoint(passage: dict) -> dict:
    return {
        "source_sha256": passage["source_sha256"],
        "source_ordinal": passage["source_ordinal"],
        "span_sha256": passage["span_sha256"],
        "locator": passage["locator"],
    }


def compile_pack(plan_path: Path = DEFAULT_PLAN, report_path: Path = DEFAULT_REPORT) -> dict:
    if sha256(plan_path) != EXPECTED_PLAN_SHA256:
        raise ValueError("Dutt product plan drift")
    if sha256(report_path) != EXPECTED_REPORT_SHA256:
        raise ValueError("Dutt product report drift")
    report = json.loads(report_path.read_text(encoding="utf-8"))
    packet = compile_packet(plan_path)
    if report["result"] != "PASS" or report["packet_sha256"] != packet["packet_sha256"]:
        raise ValueError("Dutt product packet/report mismatch")

    kandas = []
    for profile in packet["structure"]["kanda_profiles"]:
        passages = [row for row in packet["passages"] if row["locator"]["kanda_slug"] == profile["kanda_slug"]]
        kandas.append({
            **profile,
            "opening": citation_endpoint(passages[0]),
            "closing": citation_endpoint(passages[-1]),
        })

    return {
        "contract": "DEVAM_DUTT_STRUCTURE_SEARCH_PACK_V1",
        "pack_id": "dutt-project-gutenberg-structure-search-v1",
        "source_contract": packet["contract"],
        "plan_sha256": EXPECTED_PLAN_SHA256,
        "report_sha256": EXPECTED_REPORT_SHA256,
        "packet_sha256": packet["packet_sha256"],
        "passage_content_root_sha256": report["passage_content_root_sha256"],
        "hosted_text_span_root_sha256": "3226377be38be511463e8c09d56898a6b9f658d649cb376e51e3ac7c94a81c42",
        "edition_title": packet["edition"]["edition_title"],
        "attribution": packet["expression"]["attribution"],
        "positive_boundary": report["positive_claim"],
        "rights_lane": "product_allowed",
        "language_code": "en",
        "source_object_count": report["source_object_count"],
        "source_object_bytes": report["source_object_bytes"],
        "kanda_count": report["kanda_count"],
        "passage_count": report["passage_count"],
        "kandas": kandas,
        "completion_denials": {
            "literal_section_numbering_gap_free_or_corrected": False,
            "page_by_page_reconciliation_to_all_seven_print_scans_complete": False,
            "complete_valmiki_sanskrit_source_or_critical_edition": False,
            "hindi_translation_present_in_this_expression": False,
            "complete_ramayana_tradition_or_all_recensions": False,
            "ramayana_hero_universe_complete": False,
            "mvp_library_complete": False,
        },
        "source_payloads_copied": False,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()
    pack = compile_pack()
    args.output.write_text(json.dumps(pack, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8", newline="\n")
    print(args.output)


if __name__ == "__main__":
    main()

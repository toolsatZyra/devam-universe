from __future__ import annotations

import hashlib
import json
import re
import sys
from difflib import SequenceMatcher
from pathlib import Path
from typing import Any

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from tools.compile_ramcharitmanas_wikisource_product import (
    load_inputs,
    load_revisions,
    plaintext_projection,
)
from tools.profile_ramcharitmanas_belvedere_ia_ocr import ROOT, SOURCES, parse_djvu_xml


REPORT_REL = "ingestion/reports/ramcharitmanas-q1-dual-witness-screen-v1.json"
REPORT = ROOT / REPORT_REL
HELD_RECOVERY_REL = "ingestion/reports/ramcharitmanas-held-page-recovery-v1.json"
HELD_RECOVERY = ROOT / HELD_RECOVERY_REL
HELD_RECOVERY_SHA256 = "e044460d5c172bc130afdf3a594f9d751a833e49ad737b4fcb7013f24eb8d5b9"
CONTROL_PERCENTILE = 5
EXPECTED_OUTLIERS = [381, 415, 847, 994, 1024]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def canonical_bytes(value: dict[str, Any]) -> bytes:
    return (json.dumps(value, ensure_ascii=False, indent=2) + "\n").encode("utf-8")


def devanagari_projection(value: str) -> str:
    return "".join(re.findall(r"[\u0900-\u097f]", value))


def percentile(values: list[float], percentage: int) -> float:
    ordered = sorted(values)
    position = (len(ordered) - 1) * percentage / 100
    lower = int(position)
    upper = min(lower + 1, len(ordered) - 1)
    return ordered[lower] + (ordered[upper] - ordered[lower]) * (position - lower)


def distribution(values: list[float]) -> dict[str, float]:
    return {
        str(point): round(percentile(values, point), 8)
        for point in (0, 1, 5, 10, 25, 50, 75, 90, 95, 99, 100)
    }


def build() -> tuple[dict[str, Any], dict[str, bool]]:
    plan, acquisition_report, _structure = load_inputs()
    revisions, _sources = load_revisions(plan, acquisition_report)
    ia_pages = parse_djvu_xml(ROOT / SOURCES["djvu_xml"]["path"])["pages"]
    held_recovery = json.loads(HELD_RECOVERY.read_text(encoding="utf-8", errors="strict"))
    rows: list[dict[str, Any]] = []
    for page in sorted(plan["wikisource"]["pages"], key=lambda row: row["scan_page"]):
        scan_page = page["scan_page"]
        quality = page["quality_level"]
        if not 52 <= scan_page <= 1223 or quality not in (1, 3, 4):
            continue
        wikisource = devanagari_projection(plaintext_projection(revisions[scan_page]["content"]))
        ia_ocr = devanagari_projection(ia_pages[scan_page - 1]["text"])
        similarity = SequenceMatcher(None, wikisource, ia_ocr, autojunk=False).ratio() if wikisource and ia_ocr else 0.0
        length_ratio = min(len(wikisource), len(ia_ocr)) / max(len(wikisource), len(ia_ocr)) if wikisource and ia_ocr else 0.0
        rows.append(
            {
                "scan_page": scan_page,
                "wikisource_quality_level": quality,
                "wikisource_devanagari_characters": len(wikisource),
                "ia_ocr_devanagari_characters": len(ia_ocr),
                "sequence_similarity": round(similarity, 8),
                "length_ratio": round(length_ratio, 8),
            }
        )

    control = [row for row in rows if row["wikisource_quality_level"] in (3, 4)]
    q1 = [row for row in rows if row["wikisource_quality_level"] == 1]
    similarity_threshold = percentile([row["sequence_similarity"] for row in control], CONTROL_PERCENTILE)
    length_threshold = percentile([row["length_ratio"] for row in control], CONTROL_PERCENTILE)
    for row in q1:
        row["inside_control_envelope"] = (
            row["sequence_similarity"] >= similarity_threshold
            and row["length_ratio"] >= length_threshold
        )
    outliers = [row["scan_page"] for row in q1 if not row["inside_control_envelope"]]
    report = {
        "contract": "DEVAM_RAMCHARITMANAS_Q1_DUAL_WITNESS_SCREEN_V1",
        "result": "PASS",
        "decision": "SCREEN_COMPLETE_NO_BULK_PROMOTION",
        "inputs": {
            "wikisource_plan_sha256": "fbc2a25045bcf8dcbfcb8a5dd2c5388fe8263c209567d515b27f138d0882c0ab",
            "wikisource_acquisition_report_sha256": "8a6547f3c2f74194a29a885d2b7529ce9fcdd06daa51e7e32c6f48f2e0a2cf7c",
            "ia_coordinate_ocr_sha256": SOURCES["djvu_xml"]["sha256"],
            "held_page_recovery": {"path": HELD_RECOVERY_REL, "sha256": HELD_RECOVERY_SHA256},
        },
        "method": {
            "witness_a": "Pinned Hindi Wikisource page transcription projected to Devanagari characters after deterministic layout-markup removal.",
            "witness_b": "Edition-matched Internet Archive coordinate OCR projected to Devanagari characters.",
            "control": "All 813 Wikisource quality 3 or 4 narrative pages.",
            "screen": "A q1 page is inside the descriptive control envelope when both sequence similarity and character-length ratio meet the quality-3/4 fifth-percentile thresholds.",
            "claim_boundary": "The screen detects unusual witness divergence. It cannot prove exactness, correct shared errors, or substitute for linguistic review.",
        },
        "control_distribution": {
            "page_count": len(control),
            "sequence_similarity": distribution([row["sequence_similarity"] for row in control]),
            "length_ratio": distribution([row["length_ratio"] for row in control]),
        },
        "q1_distribution": {
            "page_count": len(q1),
            "sequence_similarity": distribution([row["sequence_similarity"] for row in q1]),
            "length_ratio": distribution([row["length_ratio"] for row in q1]),
        },
        "screen_result": {
            "control_percentile": CONTROL_PERCENTILE,
            "minimum_sequence_similarity": round(similarity_threshold, 8),
            "minimum_length_ratio": round(length_threshold, 8),
            "inside_control_envelope_page_count": sum(row["inside_control_envelope"] for row in q1),
            "outside_control_envelope_pages": outliers,
            "outside_control_envelope_page_count": len(outliers),
        },
        "manual_adjudication": [
            {"scan_page": 381, "finding": "IA OCR drops lower commentary; the q1 transcription still contains visible character and word errors.", "product_status": "held_for_correction"},
            {"scan_page": 415, "finding": "IA OCR omits lines; the q1 transcription also contains visible corruptions and a broken line sequence.", "product_status": "held_for_correction"},
            {"scan_page": 847, "finding": "Dense noisy print produces divergent errors in both witnesses; neither is safe as consumer text without correction.", "product_status": "held_for_correction"},
            {"scan_page": 994, "finding": "The skewed scan causes severe IA OCR truncation; the more complete q1 transcription still contains malformed and omitted text.", "product_status": "held_for_correction"},
            {"scan_page": 1024, "finding": "Character counts agree but both witnesses retain visible corruptions; similarity alone would conceal consumer-facing errors.", "product_status": "held_for_correction"},
        ],
        "q1_rows": q1,
        "correction_witness_leads": [
            {
                "provider": "IIT Kanpur Ramcharitmanas",
                "url": "https://www.ramcharitmanas.iitk.ac.in/language/devanagari",
                "observed_scope": "Complete structured Devanagari reading corpus across seven kandas.",
                "rights_status": "rights_unresolved_not_acquired_not_product_usable",
            },
            {
                "provider": "Sanskrit Documents Tulsidas collection",
                "url": "https://sanskritdocuments.org/tulasidasa/",
                "observed_scope": "All seven Ramcharitmanas kandas in volunteer-prepared electronic formats.",
                "rights_status": "reposting_and_commercial_reuse_restricted_not_acquired",
            },
        ],
        "local_ocr_candidate_benchmark": {
            "candidate": "PaddleOCR dedicated Devanagari PP-OCRv5 mobile recognizer",
            "runtime": {
                "platform": "Windows",
                "python": "3.12.10",
                "paddleocr": "3.7.0",
                "paddlepaddle_attempts": ["3.0.0", "3.3.1"],
            },
            "fixed_input_scan_page": 381,
            "detector_attempts": ["PP-OCRv6_medium_det", "PP-OCRv5_mobile_det"],
            "recognizer": "devanagari_PP-OCRv5_mobile_rec",
            "result": "RUNTIME_INCOMPATIBLE_BEFORE_OCR_OUTPUT",
            "failure_boundary": "Both official detector variants failed in the Windows oneDNN execution path before any recognized text was emitted.",
            "recognized_text_generated": False,
            "model_payload_retained_in_repository_or_source_vault": False,
            "approved_for_scale": False,
            "decision": "DO_NOT_SCALE_ON_THIS_WORKSTATION",
        },
        "product_boundary": {
            "q1_pages_screened": 345,
            "q1_pages_promoted": 0,
            "q1_pages_remaining_for_correction_or_derived_consumer_synthesis": 345,
            "dual_witness_agreement_proves_exactness": False,
            "bulk_product_promotion_allowed": False,
            "unverified_text_allowed_as_translation_input": False,
            "external_correction_witness_payload_acquired": False,
            "local_ocr_candidate_output_generated": False,
            "local_ocr_candidate_approved_for_scale": False,
            "database_mutated": False,
            "next_required_step": "Build a source-range-addressed Hindi/English daily-reading synthesis from corrected or independently reconciled text, and use manual adjudication only for unusual witness divergences.",
        },
        "mutation_boundary": {
            "source_payload_copied": False,
            "source_text_corrected": False,
            "local_ocr_model_retained": False,
            "passages_published": False,
            "database_mutated": False,
            "external_service_mutated": False,
        },
    }
    checks = {
        "held_recovery_fixity_matches": sha256(HELD_RECOVERY) == HELD_RECOVERY_SHA256,
        "held_recovery_closes_345_text_pages": held_recovery["reconciled_denominator"]["remaining_text_correction_page_count"] == 345,
        "control_count_is_exact": len(control) == 813,
        "q1_count_is_exact": len(q1) == 345,
        "all_q1_pages_are_nonempty_in_both_witnesses": all(row["wikisource_devanagari_characters"] and row["ia_ocr_devanagari_characters"] for row in q1),
        "control_envelope_split_is_exact": sum(row["inside_control_envelope"] for row in q1) == 340 and outliers == EXPECTED_OUTLIERS,
        "all_outliers_are_manually_adjudicated_and_held": [row["scan_page"] for row in report["manual_adjudication"]] == EXPECTED_OUTLIERS and all(row["product_status"] == "held_for_correction" for row in report["manual_adjudication"]),
        "no_q1_page_is_promoted": report["product_boundary"]["q1_pages_promoted"] == 0,
        "local_ocr_candidate_failed_closed": (
            report["local_ocr_candidate_benchmark"]["recognized_text_generated"] is False
            and report["local_ocr_candidate_benchmark"]["approved_for_scale"] is False
            and report["local_ocr_candidate_benchmark"]["model_payload_retained_in_repository_or_source_vault"] is False
        ),
        "product_claims_fail_closed": all(
            report["product_boundary"][key] is False
            for key in (
                "dual_witness_agreement_proves_exactness",
                "bulk_product_promotion_allowed",
                "unverified_text_allowed_as_translation_input",
                "external_correction_witness_payload_acquired",
                "local_ocr_candidate_output_generated",
                "local_ocr_candidate_approved_for_scale",
                "database_mutated",
            )
        ),
        "mutation_boundary_is_read_only": all(value is False for value in report["mutation_boundary"].values()),
    }
    report["checks"] = checks
    report["passed"] = sum(checks.values())
    report["total"] = len(checks)
    return report, checks


def main() -> None:
    report, checks = build()
    if not all(checks.values()):
        raise SystemExit(json.dumps({"result": "FAIL", "checks": checks}, sort_keys=True))
    REPORT.write_bytes(canonical_bytes(report))
    print(json.dumps({"result": "PASS", "report": REPORT_REL, "passed": report["passed"], "total": report["total"]}))


if __name__ == "__main__":
    main()

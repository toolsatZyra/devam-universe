from __future__ import annotations

import hashlib
import importlib.metadata
import json
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
PLAN_REL = "ingestion/plans/ramcharitmanas-wikisource-belvedere-pages-v1.json"
PLAN = ROOT / PLAN_REL
IA_PROFILE_REL = "ingestion/profiles/ramcharitmanas-belvedere-1925-ia-ocr-alignment-profile-v1.json"
IA_PROFILE = ROOT / IA_PROFILE_REL
REPORT_REL = "ingestion/reports/ramcharitmanas-held-page-recovery-v1.json"
REPORT = ROOT / REPORT_REL
PDF_REL = "source_vault/objects/sha256/6d/6d570d531ebada1912f6e930212393fec2200765a0b731b73b8e7135ea0f70f2"
PDF = ROOT / PDF_REL
DJVU_XML_REL = "source_vault/objects/sha256/4d/4dba066cfbe3677601fa07c81c08de4fe1f99051c201cee3d45d097af93686b6"
DJVU_XML = ROOT / DJVU_XML_REL

PLAN_SHA256 = "fbc2a25045bcf8dcbfcb8a5dd2c5388fe8263c209567d515b27f138d0882c0ab"
IA_PROFILE_SHA256 = "2876993199c7e7cf7ddcaadee9c6b9d2ef55a2d5b927d626d3f76352879cfd9a"
PDF_SHA256 = "6d570d531ebada1912f6e930212393fec2200765a0b731b73b8e7135ea0f70f2"
DJVU_XML_SHA256 = "4dba066cfbe3677601fa07c81c08de4fe1f99051c201cee3d45d097af93686b6"
EXPECTED_Q0_PAGES = [150, 185, 266, 330, 529, 792, 820, 829, 840, 853, 866, 941, 1075, 1088]
EXPECTED_STRUCTURAL_BLANK_PAGES = EXPECTED_Q0_PAGES
EXPECTED_TEXT_BEARING_Q0_PAGES: list[int] = []
RENDER_SCALE = 0.5
DARK_PIXEL_THRESHOLD = 245
BLANK_MAX_DARK_PIXEL_RATIO = 0.001
TEXT_BEARING_MIN_DARK_PIXEL_RATIO = 0.05


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def canonical_bytes(value: dict[str, Any]) -> bytes:
    return (json.dumps(value, ensure_ascii=False, indent=2) + "\n").encode("utf-8")


def q0_pages_from_plan(plan: dict[str, Any]) -> list[int]:
    return sorted(
        row["scan_page"]
        for row in plan["wikisource"]["pages"]
        if 52 <= row["scan_page"] <= 1223 and row["quality_level"] == 0
    )


def ia_word_counts(path: Path, selected_pages: set[int]) -> dict[int, int]:
    counts: dict[int, int] = {}
    pdf_page = 0
    for _event, element in ET.iterparse(path, events=("end",)):
        if element.tag != "OBJECT":
            continue
        pdf_page += 1
        if pdf_page in selected_pages:
            counts[pdf_page] = sum(1 for _ in element.iter("WORD"))
        element.clear()
    return counts


def render_rows(pdf_path: Path, pages: list[int]) -> list[dict[str, Any]]:
    try:
        import pypdfium2 as pdfium
    except ImportError as error:
        raise RuntimeError(
            "pypdfium2 is required to reproduce the held-page scan classification"
        ) from error

    document = pdfium.PdfDocument(pdf_path)
    try:
        if len(document) != 1240:
            raise ValueError("fixed Ramcharitmanas PDF page count drift")
        rows: list[dict[str, Any]] = []
        for pdf_page in pages:
            image = document[pdf_page - 1].render(
                scale=RENDER_SCALE, grayscale=True
            ).to_pil()
            pixels = image.tobytes()
            dark_pixels = sum(value < DARK_PIXEL_THRESHOLD for value in pixels)
            dark_ratio = dark_pixels / len(pixels)
            if dark_ratio <= BLANK_MAX_DARK_PIXEL_RATIO:
                classification = "structural_blank_scan_page"
            elif dark_ratio >= TEXT_BEARING_MIN_DARK_PIXEL_RATIO:
                classification = "text_bearing_page_missing_transcription"
            else:
                classification = "ambiguous_manual_review_required"
            rows.append(
                {
                    "pdf_page": pdf_page,
                    "classification": classification,
                    "render_width": image.width,
                    "render_height": image.height,
                    "grayscale_pixel_sha256": hashlib.sha256(pixels).hexdigest(),
                    "dark_pixel_count": dark_pixels,
                    "dark_pixel_ratio": round(dark_ratio, 8),
                    "nonwhite_pixel_count": sum(value < 255 for value in pixels),
                }
            )
        return rows
    finally:
        document.close()


def build() -> tuple[dict[str, Any], dict[str, bool]]:
    plan = json.loads(PLAN.read_text(encoding="utf-8", errors="strict"))
    ia_profile = json.loads(IA_PROFILE.read_text(encoding="utf-8", errors="strict"))
    q0_pages = q0_pages_from_plan(plan)
    word_counts = ia_word_counts(DJVU_XML, set(q0_pages))
    rows = render_rows(PDF, q0_pages)
    for row in rows:
        row["ia_coordinate_ocr_word_count"] = word_counts[row["pdf_page"]]

    blank_pages = [
        row["pdf_page"]
        for row in rows
        if row["classification"] == "structural_blank_scan_page"
    ]
    text_pages = [
        row["pdf_page"]
        for row in rows
        if row["classification"] == "text_bearing_page_missing_transcription"
    ]
    ambiguous_pages = [
        row["pdf_page"]
        for row in rows
        if row["classification"] == "ambiguous_manual_review_required"
    ]
    unproofread_pages = sum(
        1
        for row in plan["wikisource"]["pages"]
        if 52 <= row["scan_page"] <= 1223 and row["quality_level"] == 1
    )
    report = {
        "contract": "DEVAM_RAMCHARITMANAS_HELD_PAGE_RECOVERY_V1",
        "result": "PASS",
        "decision": "FOURTEEN_STRUCTURAL_BLANKS_NO_MISSING_Q0_TRANSCRIPTIONS",
        "inputs": {
            "wikisource_plan": {"path": PLAN_REL, "sha256": PLAN_SHA256},
            "ia_ocr_profile": {"path": IA_PROFILE_REL, "sha256": IA_PROFILE_SHA256},
            "fixed_pdf": {"path": PDF_REL, "bytes": 78_560_265, "sha256": PDF_SHA256, "pages": 1240},
            "ia_coordinate_ocr": {"path": DJVU_XML_REL, "bytes": 39_359_478, "sha256": DJVU_XML_SHA256},
        },
        "method": {
            "renderer": "pypdfium2",
            "renderer_version": importlib.metadata.version("pypdfium2"),
            "scale": RENDER_SCALE,
            "grayscale": True,
            "dark_pixel_definition": f"pixel value < {DARK_PIXEL_THRESHOLD}",
            "structural_blank_max_dark_pixel_ratio": BLANK_MAX_DARK_PIXEL_RATIO,
            "text_bearing_min_dark_pixel_ratio": TEXT_BEARING_MIN_DARK_PIXEL_RATIO,
            "manual_visual_confirmation_pages": [150, 1075, 1088],
            "boundary": "Pixel density classifies whether a fixed scan leaf contains print. It does not validate or correct the wording of any transcription.",
        },
        "rows": rows,
        "reconciled_denominator": {
            "carrier_narrative_coordinate_pages": 1172,
            "prepared_text_pages": 813,
            "unproofread_text_bearing_pages": unproofread_pages,
            "structural_blank_pages": blank_pages,
            "structural_blank_page_count": len(blank_pages),
            "missing_transcription_text_bearing_pages": text_pages,
            "missing_transcription_text_bearing_page_count": len(text_pages),
            "remaining_text_correction_page_count": unproofread_pages + len(text_pages),
            "text_bearing_page_denominator": 1172 - len(blank_pages),
            "ambiguous_pages": ambiguous_pages,
        },
        "product_boundary": {
            "prepared_product_page_count_changed": False,
            "prepared_product_page_count": 813,
            "structural_blanks_are_missing_story_text": False,
            "remaining_text_pages_corrected": False,
            "complete_product_searchable_ramcharitmanas_text": False,
            "public_search_sarthi_or_atlas_mutated": False,
            "next_required_step": "Qualify or correct the 345 unproofread text-bearing pages against the fixed scan before claiming the selected expression complete.",
        },
        "mutation_boundary": {
            "source_payload_copied": False,
            "source_text_corrected": False,
            "passages_published": False,
            "database_mutated": False,
            "external_service_mutated": False,
        },
    }
    checks = {
        "tracked_plan_fixity_matches": sha256(PLAN) == PLAN_SHA256,
        "tracked_ia_profile_fixity_matches": sha256(IA_PROFILE) == IA_PROFILE_SHA256,
        "fixed_pdf_fixity_matches": PDF.stat().st_size == 78_560_265 and sha256(PDF) == PDF_SHA256,
        "ia_coordinate_ocr_fixity_matches": DJVU_XML.stat().st_size == 39_359_478 and sha256(DJVU_XML) == DJVU_XML_SHA256,
        "q0_queue_is_exact": q0_pages == EXPECTED_Q0_PAGES,
        "all_q0_pages_have_empty_ia_ocr": set(word_counts) == set(q0_pages) and all(value == 0 for value in word_counts.values()),
        "structural_blank_set_is_exact": blank_pages == EXPECTED_STRUCTURAL_BLANK_PAGES,
        "text_bearing_missing_transcription_set_is_exact": text_pages == EXPECTED_TEXT_BEARING_Q0_PAGES,
        "no_ambiguous_q0_pages": ambiguous_pages == [],
        "reconciled_text_denominator_closes": 813 + unproofread_pages + len(text_pages) == 1172 - len(blank_pages),
        "product_boundary_fails_closed": all(
            report["product_boundary"][key] is False
            for key in (
                "prepared_product_page_count_changed",
                "structural_blanks_are_missing_story_text",
                "remaining_text_pages_corrected",
                "complete_product_searchable_ramcharitmanas_text",
                "public_search_sarthi_or_atlas_mutated",
            )
        ),
        "upstream_ocr_stays_quarantined": ia_profile["product_boundary"]["ocr_product_usable"] is False,
    }
    report["checks"] = checks
    report["passed"] = sum(checks.values())
    report["total"] = len(checks)
    return report, checks


def main() -> None:
    report, checks = build()
    if not all(checks.values()):
        raise SystemExit(json.dumps({"result": "FAIL", "checks": checks}, sort_keys=True))
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_bytes(canonical_bytes(report))
    print(json.dumps({"result": "PASS", "report": REPORT_REL, "passed": report["passed"], "total": report["total"]}))


if __name__ == "__main__":
    main()

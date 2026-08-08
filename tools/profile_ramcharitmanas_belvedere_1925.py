from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any

from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
SOURCE_REL = "source_vault/objects/sha256/6d/6d570d531ebada1912f6e930212393fec2200765a0b731b73b8e7135ea0f70f2"
SOURCE = ROOT / SOURCE_REL
PLAN_REL = "ingestion/plans/ramcharitmanas-belvedere-1925-commons-source-acquisition-v1.json"
PLAN = ROOT / PLAN_REL
PROFILE_REL = "ingestion/profiles/ramcharitmanas-belvedere-1925-fixed-carrier-profile-v1.json"
PROFILE = ROOT / PROFILE_REL
REPORT_REL = "ingestion/reports/ramcharitmanas-belvedere-1925-structure-v1.json"
REPORT = ROOT / REPORT_REL

SOURCE_SHA256 = "6d570d531ebada1912f6e930212393fec2200765a0b731b73b8e7135ea0f70f2"
SOURCE_BYTES = 78_560_265
PLAN_SHA256 = "c752fad4615fe643247715a97c614ecdba76670e72ef1650b8cf82dcc08f8c42"
PDF_PAGES = 1_240


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def canonical_bytes(value: dict[str, Any]) -> bytes:
    return (json.dumps(value, ensure_ascii=False, indent=2) + "\n").encode("utf-8")


def build_profile() -> dict[str, Any]:
    return {
        "contract": "DEVAM_FIXED_CARRIER_STRUCTURE_PROFILE_V1",
        "profile_id": "RAMCHARITMANAS-BELVEDERE-SECOND-EDITION-1925-FIXED-CARRIER-V1",
        "decision": "FIXED_CARRIER_STRUCTURALLY_COMPLETE_SEVEN_SOPANA_SECOND_EDITION_PUBLIC_DOMAIN_SCAN_TEXT_NOT_READY",
        "source_object": {
            "object_path": SOURCE_REL,
            "bytes": SOURCE_BYTES,
            "sha256": SOURCE_SHA256,
            "media_type": "application/pdf",
            "pdf_pages": PDF_PAGES,
            "embedded_text_layer_present": False,
            "unique_payload_copy_in_source_vault": True,
            "payload_copied_by_profiler": False,
        },
        "acquisition_evidence": {
            "plan_path": PLAN_REL,
            "plan_sha256": PLAN_SHA256,
            "provider": "Wikimedia Commons",
            "commons_file_title": "File:रामचरितमानस.pdf",
            "dli_identifier": "in.ernet.dli.2015.342236",
            "dli_barcode": "99999990231847",
        },
        "identity": {
            "carrier_title_literal": "सटीक रामचरितमानस",
            "work": "रामचरितमानस",
            "author_literal": "गोस्वामी तुलसीदास जी",
            "author": "Tulsidas",
            "editor_literal": "महावीर प्रसाद मालवीय वैद्य 'वीर'",
            "publisher_literal": "बेलवेडियर प्रेस, प्रयाग",
            "edition_literal": "द्वितीय संस्करण",
            "printed_date_literal": "कार्तिक कृष्ण २ सोमवार, संवत् १९८२ वि०",
            "hindi_wikisource_year_literal": 1925,
            "dli_description_year_literal": 1926,
            "year_resolution": "The fixed preface prints Vikram Samvat 1982 and identifies this as the second edition. That supports the Hindi Wikisource 1925 catalogue date; the DLI description's 1926 value remains separately preserved rather than silently overwritten.",
            "language": "Awadhi with Hindi editorial matter",
            "script": "Devanagari",
            "identity_pages": [4, 6, 9, 20],
            "identity_boundary": "One illustrated, annotated second-edition Belvedere Press scan of Tulsidas's Ramcharitmanas. It is not every edition, recension, manuscript, commentary, translation, script, performance tradition, regional tradition, or the complete Ramayana universe.",
        },
        "front_matter": {
            "pdf_pages": [1, 51],
            "page_count": 51,
            "units": [
                {"kind": "blank", "pdf_pages": [1, 1]},
                {"kind": "contents_overview", "pdf_pages": [2, 2]},
                {"kind": "blank", "pdf_pages": [3, 3]},
                {"kind": "second_edition_preface", "pdf_pages": [4, 5], "printed_pages": [1, 2]},
                {"kind": "illustrated_title", "pdf_pages": [6, 6]},
                {"kind": "blank", "pdf_pages": [7, 7]},
                {"kind": "second_edition_preface", "pdf_pages": [8, 9], "printed_pages": [3, 4]},
                {"kind": "story_contents", "pdf_pages": [10, 15], "printed_pages": [1, 6]},
                {"kind": "illustration_guide", "pdf_pages": [16, 17], "printed_pages": [1, 2]},
                {"kind": "scholarly_opinions", "pdf_pages": [18, 19], "printed_pages": [1, 2]},
                {"kind": "publisher_notice", "pdf_pages": [20, 20]},
                {"kind": "publisher_advertisements", "pdf_pages": [21, 23]},
                {"kind": "blank", "pdf_pages": [24, 24]},
                {"kind": "tulsidas_biography", "pdf_pages": [25, 46], "printed_pages": [1, 22]},
                {"kind": "publisher_advertisements", "pdf_pages": [47, 49]},
                {"kind": "tulsidas_portrait", "pdf_pages": [50, 50]},
                {"kind": "blank", "pdf_pages": [51, 51]},
            ],
        },
        "structure": {
            "sopana_count": 7,
            "printed_main_pages": 1_144,
            "main_pdf_pages": [52, 1223],
            "main_carrier_page_count": 1_172,
            "carrier_pages_above_printed_number_count": 28,
            "carrier_page_surplus_boundary": "The exact PDF span contains 28 more leaves than the continuous printed page-number range because title/illustration leaves occur within the main span. This profile does not fabricate printed numbers for those leaves.",
            "sopanas": [
                {
                    "ordinal": 1,
                    "name": "बालकाण्ड",
                    "pdf_pages": [52, 424],
                    "printed_pages": [1, 365],
                    "start_observation": "PDF page 52 begins printed page 1 under the first sopana, Balakanda.",
                    "close_literal": "इति श्रीरामचरितमानसे सकलकलिकलुषविध्वंसने विमलसन्तोषसम्पादनो नाम प्रथमः सोपानः समाप्तः।",
                },
                {
                    "ordinal": 2,
                    "name": "अयोध्याकाण्ड",
                    "pdf_pages": [425, 738],
                    "printed_pages": [366, 677],
                    "start_observation": "PDF page 425 is the ornate second-sopana Ayodhyakanda start.",
                    "close_literal": "इति श्रीरामचरितमानसे सकल कलिकलुष विध्वंसने विमल विज्ञान वैराग्य सम्पादनो नाम द्वितीयः सोपानः समाप्तः।",
                },
                {
                    "ordinal": 3,
                    "name": "अरण्यकाण्ड",
                    "pdf_pages": [739, 807],
                    "printed_pages": [678, 744],
                    "start_observation": "PDF page 739 is the ornate third-sopana Aranyakanda start.",
                    "close_literal": "इति श्रीरामचरितमानसे सकल कलि कलुष विध्वंसने वैराग्य सम्पादनो नाम तृतीयः सोपानः समाप्तः।",
                },
                {
                    "ordinal": 4,
                    "name": "किष्किन्धाकाण्ड",
                    "pdf_pages": [808, 849],
                    "printed_pages": [745, 780],
                    "start_observation": "PDF page 808 is the ornate fourth-sopana Kishkindhakanda start.",
                    "close_literal": "इति श्रीरामचरितमानसे सकल कलिकलुषविध्वंसने विशुद्ध सन्तोष सम्पादनो नाम चतुर्थः सोपानः समाप्तः।",
                },
                {
                    "ordinal": 5,
                    "name": "सुन्दरकाण्ड",
                    "pdf_pages": [850, 921],
                    "printed_pages": [781, 848],
                    "start_observation": "PDF page 850 is the ornate fifth-sopana Sundarakanda start.",
                    "close_literal": "इति श्रीरामचरितमानसे सकलकलिकलुष विध्वंसने ज्ञान सम्पादनो नाम पञ्चमः सोपानः समाप्तः।",
                },
                {
                    "ordinal": 6,
                    "name": "लङ्काकाण्ड",
                    "pdf_pages": [922, 1070],
                    "printed_pages": [849, 995],
                    "start_observation": "PDF page 922 is the ornate sixth-sopana Lankakanda start.",
                    "close_literal": "इति श्रीरामचरितमानसे सकलकलिकलुष विध्वंसने विशुद्ध सन्तोष सम्पादनो नाम षष्ठः सोपानः समाप्तः।",
                },
                {
                    "ordinal": 7,
                    "name": "उत्तरकाण्ड",
                    "pdf_pages": [1071, 1223],
                    "printed_pages": [996, 1144],
                    "start_observation": "PDF page 1071 is the ornate seventh-sopana Uttarakanda start.",
                    "close_literal": "इति श्रीरामचरितमानसे सकलकलिकलुषविध्वंसने अविरल हरिभक्ति सम्पादनो नाम सप्तमः सोपानः समाप्तः।",
                    "whole_main_work_close": True,
                },
            ],
        },
        "appendices_and_trailing_matter": [
            {
                "kind": "रामायण की आरती",
                "pdf_pages": [1224, 1224],
                "terminal_literal": "इतिशुभम्",
                "printer_literal": "PRINTED AT THE BELVEDERE PRINTING WORKS, ALLAHABAD, BY E. HALL.",
            },
            {
                "kind": "मानस-पिङ्गल",
                "pdf_pages": [1225, 1236],
                "printed_pages": [1, 12],
                "terminal_literal": "इति मानस-पिङ्गल समाप्तः।",
            },
            {"kind": "publisher_advertisement", "pdf_pages": [1237, 1237], "title_literal": "मनोरमा"},
            {"kind": "publisher_catalogue", "pdf_pages": [1238, 1239], "title_literal": "सत्सानी पुस्तकशाला"},
            {"kind": "blank", "pdf_pages": [1240, 1240]},
        ],
        "rights_and_product_boundary": {
            "rights_lane": "product_compatible_public_domain_scan",
            "commons_license_short_name": "Public domain",
            "commons_attribution_required": False,
            "commons_copyrighted": False,
            "commons_restrictions_literal": "",
            "fixed_carrier_identity_verified": True,
            "fixed_carrier_seven_sopana_structure_verified": True,
            "fixed_carrier_terminal_verified": True,
            "source_discovery_allowed": True,
            "carrier_image_use_rights_compatible": True,
            "carrier_published_by_devam": False,
            "exact_text_ready": False,
            "verified_ocr_available": False,
            "verified_transcription_available": False,
            "passage_indexed": False,
            "product_passages_allowed": False,
            "public_search_sarthi_api_vector_training_allowed": False,
            "complete_all_ramcharitmanas_editions_recensions_commentaries_translations_traditions": False,
            "complete_ramayana_universe": False,
        },
        "text_readiness": {
            "embedded_text_nonempty_page_count": 0,
            "ocr_status": "ABSENT_OR_UNVERIFIED_NOT_ACQUIRED",
            "partial_hindi_wikisource_transcription_not_substituted": True,
            "next_required_step": "Acquire or produce a complete source-aligned transcription/OCR, validate it against the fixed scan with page and passage citations, and keep corrections attributable before Search or Sarthi promotion.",
        },
        "held_alternatives": [
            "Partial Hindi Wikisource transcription",
            "GRETIL noncommercial seven-sopana transliteration",
            "Modern Gita Press editions and commentaries",
            "Internet Archive/DLI representations not yet proved byte-distinct",
        ],
    }


def validate(profile: dict[str, Any]) -> dict[str, bool]:
    reader = PdfReader(SOURCE)
    sopanas = profile["structure"]["sopanas"]
    front_units = profile["front_matter"]["units"]
    trailing = profile["appendices_and_trailing_matter"]
    covered: list[int] = []
    for unit in front_units:
        covered.extend(range(unit["pdf_pages"][0], unit["pdf_pages"][1] + 1))
    for unit in sopanas:
        covered.extend(range(unit["pdf_pages"][0], unit["pdf_pages"][1] + 1))
    for unit in trailing:
        covered.extend(range(unit["pdf_pages"][0], unit["pdf_pages"][1] + 1))
    text_pages = sum(bool((page.extract_text() or "").strip()) for page in reader.pages)
    boundary = profile["rights_and_product_boundary"]
    return {
        "source_sha256_matches": sha256(SOURCE) == SOURCE_SHA256,
        "source_bytes_match": SOURCE.stat().st_size == SOURCE_BYTES,
        "acquisition_plan_sha256_matches": sha256(PLAN) == PLAN_SHA256,
        "pdf_page_count_matches": len(reader.pages) == PDF_PAGES,
        "embedded_text_absent": text_pages == 0,
        "all_pdf_pages_accounted_once": covered == list(range(1, PDF_PAGES + 1)),
        "seven_sopanas_present": len(sopanas) == 7,
        "sopana_ordinals_contiguous": [row["ordinal"] for row in sopanas] == list(range(1, 8)),
        "printed_ranges_contiguous": all(
            left["printed_pages"][1] + 1 == right["printed_pages"][0]
            for left, right in zip(sopanas, sopanas[1:])
        ),
        "printed_range_is_1_through_1144": sopanas[0]["printed_pages"][0] == 1
        and sopanas[-1]["printed_pages"][1] == 1144,
        "fixed_carrier_positive_boundary_exact": profile["decision"]
        == "FIXED_CARRIER_STRUCTURALLY_COMPLETE_SEVEN_SOPANA_SECOND_EDITION_PUBLIC_DOMAIN_SCAN_TEXT_NOT_READY",
        "text_and_product_denials_fail_closed": all(
            boundary[key] is False
            for key in (
                "carrier_published_by_devam",
                "exact_text_ready",
                "verified_ocr_available",
                "verified_transcription_available",
                "passage_indexed",
                "product_passages_allowed",
                "public_search_sarthi_api_vector_training_allowed",
                "complete_all_ramcharitmanas_editions_recensions_commentaries_translations_traditions",
                "complete_ramayana_universe",
            )
        ),
    }


def main() -> None:
    if not SOURCE.is_file() or not PLAN.is_file():
        raise SystemExit("required fixed source or acquisition evidence is absent")
    profile = build_profile()
    checks = validate(profile)
    if not all(checks.values()):
        raise SystemExit(json.dumps({"result": "FAIL", "checks": checks}, sort_keys=True))
    PROFILE.parent.mkdir(parents=True, exist_ok=True)
    PROFILE.write_bytes(canonical_bytes(profile))
    report = {
        "contract": "DEVAM_FIXED_CARRIER_STRUCTURE_PROFILE_RESULT_V1",
        "result": "PASS",
        "profile_path": PROFILE_REL,
        "profile_sha256": sha256(PROFILE),
        "source_sha256": SOURCE_SHA256,
        "acquisition_plan_sha256": PLAN_SHA256,
        "checks": checks,
        "passed": sum(checks.values()),
        "total": len(checks),
        "mutation_boundary": {
            "source_payload_copied": False,
            "ocr_generated": False,
            "reader_generated": False,
            "database_mutated": False,
            "external_service_mutated": False,
        },
    }
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_bytes(canonical_bytes(report))
    print(json.dumps({"result": "PASS", "profile": PROFILE_REL, "report": REPORT_REL, "passed": report["passed"], "total": report["total"]}))


if __name__ == "__main__":
    main()

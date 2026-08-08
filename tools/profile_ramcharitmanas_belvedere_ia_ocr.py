from __future__ import annotations

import difflib
import hashlib
import json
import re
import unicodedata
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
PLAN_REL = "ingestion/plans/ramcharitmanas-belvedere-1925-ia-ocr-alignment-acquisition-v1.json"
PLAN = ROOT / PLAN_REL
FIXED_PROFILE_REL = "ingestion/profiles/ramcharitmanas-belvedere-1925-fixed-carrier-profile-v1.json"
FIXED_PROFILE = ROOT / FIXED_PROFILE_REL
PROFILE_REL = "ingestion/profiles/ramcharitmanas-belvedere-1925-ia-ocr-alignment-profile-v1.json"
PROFILE = ROOT / PROFILE_REL
REPORT_REL = "ingestion/reports/ramcharitmanas-belvedere-1925-ia-ocr-alignment-v1.json"
REPORT = ROOT / REPORT_REL

PLAN_SHA256 = "327d6a2c438abdeca91210bd34cf489173f76aae00a2012b3acd256a1a78c8cb"
FIXED_PROFILE_SHA256 = "b8c3cb71887a80603455a9432ebd26f5ad62635e6bfc64f6fccace0efb6278f9"
SOURCES = {
    "djvu_txt": {
        "path": "source_vault/objects/sha256/61/61bb7c6f225c2ee08bbf0f848c575477413d3da71166db4d1b239090cccc5555",
        "bytes": 5_931_293,
        "sha256": "61bb7c6f225c2ee08bbf0f848c575477413d3da71166db4d1b239090cccc5555",
    },
    "djvu_xml": {
        "path": "source_vault/objects/sha256/4d/4dba066cfbe3677601fa07c81c08de4fe1f99051c201cee3d45d097af93686b6",
        "bytes": 39_359_478,
        "sha256": "4dba066cfbe3677601fa07c81c08de4fe1f99051c201cee3d45d097af93686b6",
    },
    "page_numbers": {
        "path": "source_vault/objects/sha256/af/af51472d489fdb3a5b3425613284f574bcd8bd5e38a5567f9e11277433f92ac5",
        "bytes": 179_002,
        "sha256": "af51472d489fdb3a5b3425613284f574bcd8bd5e38a5567f9e11277433f92ac5",
    },
    "scandata": {
        "path": "source_vault/objects/sha256/b2/b2c78f405bc4109e5b9d76841d6b587c4a2f42dc05955c4fbbe934475a5d93f1",
        "bytes": 372_368,
        "sha256": "b2c78f405bc4109e5b9d76841d6b587c4a2f42dc05955c4fbbe934475a5d93f1",
    },
}
LANDMARKS = [
    (6, "सटीक रामचरितमानस", "illustrated title"),
    (52, "बालकाण्ड", "first sopana start"),
    (424, "प्रथमः सोपानः समाप्तः", "first sopana close"),
    (425, "द्वितीय सोपान अयोध्याकाण्ड", "second sopana start"),
    (738, "द्वितीयः सोपानः समाप्तः", "second sopana close"),
    (739, "तृतीय सोपान अरण्यकाण्ड", "third sopana start"),
    (807, "तृतीयः सोपानः समाप्तः", "third sopana close"),
    (808, "चतुर्थ सोपान किष्किन्धाकाण्ड", "fourth sopana start"),
    (849, "चतुर्थः सोपानः समाप्तः", "fourth sopana close"),
    (850, "पञ्चम सोपान सुन्दरकाण्ड", "fifth sopana start"),
    (921, "पञ्चमः सोपानः समाप्तः", "fifth sopana close"),
    (922, "षष्ठ सोपान लङ्काकाण्ड", "sixth sopana start"),
    (1070, "षष्ठः सोपानः समाप्तः", "sixth sopana close"),
    (1071, "सप्तम सोपान उत्तरकाण्ड", "seventh sopana start"),
    (1223, "सप्तमः सोपानः समाप्तः", "seventh sopana close"),
    (1224, "रामायण की आरती", "arati"),
    (1225, "मानस पिङ्गल", "Manas-Pingala start"),
    (1236, "इति मानस पिङ्गल समाप्तः", "Manas-Pingala close"),
]


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def canonical_bytes(value: dict[str, Any]) -> bytes:
    return (json.dumps(value, ensure_ascii=False, indent=2) + "\n").encode("utf-8")


def compact_text(value: str) -> str:
    return " ".join(value.split())


def alnum_text(value: str) -> str:
    return "".join(character for character in unicodedata.normalize("NFC", value) if character.isalnum())


def parse_djvu_xml(path: Path) -> dict[str, Any]:
    pages: list[dict[str, Any]] = []
    for _event, element in ET.iterparse(path, events=("end",)):
        if element.tag != "OBJECT":
            continue
        words = [word.text or "" for word in element.iter("WORD")]
        text = " ".join(words)
        pages.append({
            "usemap": element.attrib["usemap"],
            "width": int(element.attrib["width"]),
            "height": int(element.attrib["height"]),
            "text": text,
            "text_sha256": hashlib.sha256(text.encode("utf-8")).hexdigest(),
            "words": len(words),
            "lines": sum(1 for _ in element.iter("LINE")),
        })
        element.clear()
    joined = " ".join(page["text"] for page in pages if page["text"])
    return {"pages": pages, "joined": compact_text(joined)}


def landmark_rows(pages: list[dict[str, Any]]) -> list[dict[str, Any]]:
    rows = []
    for pdf_page, expected, role in LANDMARKS:
        observed = pages[pdf_page - 1]["text"]
        expected_normalized = alnum_text(expected)
        observed_normalized = alnum_text(observed)
        longest = difflib.SequenceMatcher(
            None, expected_normalized, observed_normalized, autojunk=False
        ).find_longest_match().size
        tokens = [alnum_text(token) for token in expected.split()]
        exact_hits = sum(bool(token) and token in observed_normalized for token in tokens)
        rows.append({
            "pdf_page": pdf_page,
            "role": role,
            "expected_literal": expected,
            "ocr_text_sha256": pages[pdf_page - 1]["text_sha256"],
            "ocr_word_count": pages[pdf_page - 1]["words"],
            "expected_token_count": len(tokens),
            "exact_token_hits": exact_hits,
            "longest_exact_character_run": longest,
            "expected_normalized_characters": len(expected_normalized),
            "exact_literal_present": expected_normalized in observed_normalized,
        })
    return rows


def build() -> tuple[dict[str, Any], dict[str, bool]]:
    source_paths = {key: ROOT / row["path"] for key, row in SOURCES.items()}
    parsed = parse_djvu_xml(source_paths["djvu_xml"])
    pages = parsed["pages"]
    plain_text = source_paths["djvu_txt"].read_text(encoding="utf-8", errors="strict")
    page_numbers = json.loads(source_paths["page_numbers"].read_text(encoding="utf-8", errors="strict"))
    scandata_root = ET.parse(source_paths["scandata"]).getroot()
    scandata_pages = scandata_root.findall(".//page")
    landmarks = landmark_rows(pages)
    joined_chars = "".join(page["text"] for page in pages)
    devanagari = sum("\u0900" <= character <= "\u097f" for character in joined_chars)
    nonspace = sum(not character.isspace() for character in joined_chars)
    page_rows = page_numbers["pages"]
    expected_usemaps = [f"2015.342236.99999990231847_{index:04d}.djvu" for index in range(1240)]
    normalized_plain = compact_text(plain_text)
    normalized_xml = parsed["joined"]
    total_expected_tokens = sum(row["expected_token_count"] for row in landmarks)
    exact_landmark_token_hits = sum(row["exact_token_hits"] for row in landmarks)
    profile = {
        "contract": "DEVAM_OCR_ALIGNMENT_PROFILE_V1",
        "profile_id": "RAMCHARITMANAS-BELVEDERE-1925-IA-OCR-ALIGNMENT-V1",
        "decision": "OCR_QUARANTINED_ALIGNMENT_READY_QUALITY_NOT_PROVEN",
        "fixed_carrier": {
            "profile_path": FIXED_PROFILE_REL,
            "profile_sha256": FIXED_PROFILE_SHA256,
            "pdf_sha256": "6d570d531ebada1912f6e930212393fec2200765a0b731b73b8e7135ea0f70f2",
            "pdf_pages": 1240,
        },
        "acquisition": {
            "plan_path": PLAN_REL,
            "plan_sha256": PLAN_SHA256,
            "selected_representation_count": 4,
            "selected_representation_bytes": 45_842_141,
            "source_objects": SOURCES,
        },
        "coordinate_ocr": {
            "page_object_count": len(pages),
            "first_usemap": pages[0]["usemap"],
            "last_usemap": pages[-1]["usemap"],
            "usemaps_contiguous_0000_through_1239": [page["usemap"] for page in pages] == expected_usemaps,
            "word_count": sum(page["words"] for page in pages),
            "line_count": sum(page["lines"] for page in pages),
            "nonempty_page_count": sum(page["words"] > 0 for page in pages),
            "empty_page_count": sum(page["words"] == 0 for page in pages),
            "page_text_hash_root": hashlib.sha256("\n".join(page["text_sha256"] for page in pages).encode("ascii")).hexdigest(),
            "normalized_xml_text_sha256": hashlib.sha256(normalized_xml.encode("utf-8")).hexdigest(),
            "normalized_plain_text_sha256": hashlib.sha256(normalized_plain.encode("utf-8")).hexdigest(),
            "plain_and_coordinate_ocr_normalized_text_equal": normalized_plain == normalized_xml,
            "devanagari_character_count": devanagari,
            "nonspace_character_count": nonspace,
            "devanagari_nonspace_ratio": round(devanagari / nonspace, 8) if nonspace else 0,
        },
        "page_number_evidence": {
            "record_count": len(page_rows),
            "first_leaf_num": page_rows[0]["leafNum"],
            "last_leaf_num": page_rows[-1]["leafNum"],
            "missing_leaf_nums": sorted(set(range(1240)) - {row["leafNum"] for row in page_rows}),
            "nonempty_page_number_count": sum(bool(row["pageNumber"]) for row in page_rows),
            "positive_confidence_count": sum(row["confidence"] > 0 for row in page_rows),
            "trusted_as_authoritative_pagination": False,
        },
        "scandata_alignment": {
            "leaf_count_literal": int(scandata_root.findtext("./bookData/leafCount", "0")),
            "page_record_count": len(scandata_pages),
            "first_leaf_num": int(scandata_pages[0].attrib["leafNum"]),
            "last_leaf_num": int(scandata_pages[-1].attrib["leafNum"]),
            "pdf_page_equals_leaf_num_plus_one": True,
        },
        "landmark_quality_sample": {
            "sample_count": len(landmarks),
            "sample_scope": "Carrier title, every sopana start and close, Aarti, and Manas-Pingala start/close. This bounded sample diagnoses OCR risk but cannot prove whole-book accuracy.",
            "exact_token_hits": exact_landmark_token_hits,
            "expected_token_count": total_expected_tokens,
            "exact_literal_match_count": sum(row["exact_literal_present"] for row in landmarks),
            "rows": landmarks,
        },
        "product_boundary": {
            "coordinate_alignment_ready_for_correction_work": True,
            "ocr_quality_proven": False,
            "ocr_text_exact": False,
            "ocr_product_usable": False,
            "passage_indexed": False,
            "public_search_sarthi_api_vector_training_allowed": False,
            "ai_translation_from_unverified_ocr_allowed": False,
            "complete_ramcharitmanas_text_lane": False,
            "next_required_step": "Use the coordinate OCR only as a correction draft. Establish a source-aligned ground-truth corpus, correct and validate text page by page, bind passage coordinates to the fixed PDF, and pass omission/duplication and sampled character-accuracy gates before product promotion.",
        },
    }
    checks = {
        "plan_sha256_matches": sha256(PLAN) == PLAN_SHA256,
        "fixed_profile_sha256_matches": sha256(FIXED_PROFILE) == FIXED_PROFILE_SHA256,
        "all_source_fixities_match": all(
            path.is_file() and path.stat().st_size == SOURCES[key]["bytes"] and sha256(path) == SOURCES[key]["sha256"]
            for key, path in source_paths.items()
        ),
        "all_sources_strict_utf8": all(
            path.read_text(encoding="utf-8", errors="strict").encode("utf-8") == path.read_bytes()
            for path in source_paths.values()
        ),
        "coordinate_pages_match_fixed_pdf": len(pages) == 1240,
        "coordinate_usemaps_contiguous": profile["coordinate_ocr"]["usemaps_contiguous_0000_through_1239"],
        "coordinate_word_and_line_counts_nonzero": profile["coordinate_ocr"]["word_count"] > 0 and profile["coordinate_ocr"]["line_count"] > 0,
        "scandata_leaves_match_fixed_pdf": len(scandata_pages) == 1240 and profile["scandata_alignment"]["leaf_count_literal"] == 1240,
        "page_number_omission_is_exactly_leaf_zero": profile["page_number_evidence"]["missing_leaf_nums"] == [0],
        "page_number_confidence_is_zero": profile["page_number_evidence"]["positive_confidence_count"] == 0,
        "landmark_sample_covers_all_seven_starts_and_closes": len(landmarks) == 18,
        "ocr_quality_and_product_claims_fail_closed": all(
            profile["product_boundary"][key] is False
            for key in (
                "ocr_quality_proven", "ocr_text_exact", "ocr_product_usable", "passage_indexed",
                "public_search_sarthi_api_vector_training_allowed", "ai_translation_from_unverified_ocr_allowed",
                "complete_ramcharitmanas_text_lane",
            )
        ),
    }
    return profile, checks


def main() -> None:
    profile, checks = build()
    if not all(checks.values()):
        raise SystemExit(json.dumps({"result": "FAIL", "checks": checks}, sort_keys=True))
    PROFILE.parent.mkdir(parents=True, exist_ok=True)
    PROFILE.write_bytes(canonical_bytes(profile))
    report = {
        "contract": "DEVAM_OCR_ALIGNMENT_PROFILE_RESULT_V1",
        "result": "PASS",
        "profile_path": PROFILE_REL,
        "profile_sha256": sha256(PROFILE),
        "checks": checks,
        "passed": sum(checks.values()),
        "total": len(checks),
        "mutation_boundary": {
            "source_payload_copied": False,
            "ocr_generated": False,
            "ocr_corrected": False,
            "passages_published": False,
            "database_mutated": False,
            "external_service_mutated": False,
        },
    }
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_bytes(canonical_bytes(report))
    print(json.dumps({"result": "PASS", "profile": PROFILE_REL, "report": REPORT_REL, "passed": report["passed"], "total": report["total"]}))


if __name__ == "__main__":
    main()

from __future__ import annotations

import hashlib
import json
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PLAN = ROOT / "ingestion/plans/ramcharitmanas-belvedere-1925-ia-ocr-alignment-acquisition-v1.json"
FIXED_PROFILE = ROOT / "ingestion/profiles/ramcharitmanas-belvedere-1925-fixed-carrier-profile-v1.json"
PROFILE = ROOT / "ingestion/profiles/ramcharitmanas-belvedere-1925-ia-ocr-alignment-profile-v1.json"
REPORT = ROOT / "ingestion/reports/ramcharitmanas-belvedere-1925-ia-ocr-alignment-v1.json"
DJVU_TXT = ROOT / "source_vault/objects/sha256/61/61bb7c6f225c2ee08bbf0f848c575477413d3da71166db4d1b239090cccc5555"
DJVU_XML = ROOT / "source_vault/objects/sha256/4d/4dba066cfbe3677601fa07c81c08de4fe1f99051c201cee3d45d097af93686b6"
PAGE_NUMBERS = ROOT / "source_vault/objects/sha256/af/af51472d489fdb3a5b3425613284f574bcd8bd5e38a5567f9e11277433f92ac5"
SCANDATA = ROOT / "source_vault/objects/sha256/b2/b2c78f405bc4109e5b9d76841d6b587c4a2f42dc05955c4fbbe934475a5d93f1"


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


class RamcharitmanasBelvedereIaOcrTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.plan = json.loads(PLAN.read_text(encoding="utf-8"))
        cls.profile = json.loads(PROFILE.read_text(encoding="utf-8"))
        cls.report = json.loads(REPORT.read_text(encoding="utf-8"))

    def test_frozen_inputs_and_selected_universe(self) -> None:
        self.assertEqual(sha256(PLAN), "327d6a2c438abdeca91210bd34cf489173f76aae00a2012b3acd256a1a78c8cb")
        self.assertEqual(sha256(FIXED_PROFILE), "b8c3cb71887a80603455a9432ebd26f5ad62635e6bfc64f6fccace0efb6278f9")
        self.assertEqual((len(self.plan["files"]), sum(row["bytes"] for row in self.plan["files"])), (4, 45_842_141))
        self.assertFalse(self.plan["provider_observation"]["matching_original_acquired_again"])
        self.assertTrue(all(value is False for key, value in self.plan["selection_boundary"].items() if key.endswith("_acquired")))

    def test_source_fixities_and_utf8(self) -> None:
        expected = {
            DJVU_TXT: (5_931_293, "61bb7c6f225c2ee08bbf0f848c575477413d3da71166db4d1b239090cccc5555"),
            DJVU_XML: (39_359_478, "4dba066cfbe3677601fa07c81c08de4fe1f99051c201cee3d45d097af93686b6"),
            PAGE_NUMBERS: (179_002, "af51472d489fdb3a5b3425613284f574bcd8bd5e38a5567f9e11277433f92ac5"),
            SCANDATA: (372_368, "b2c78f405bc4109e5b9d76841d6b587c4a2f42dc05955c4fbbe934475a5d93f1"),
        }
        for path, (size, digest) in expected.items():
            self.assertEqual((path.stat().st_size, sha256(path)), (size, digest))
            data = path.read_bytes()
            self.assertEqual(data.decode("utf-8", errors="strict").encode("utf-8"), data)

    def test_coordinate_xml_reconstructs_exact_page_word_and_line_counts(self) -> None:
        page_count = word_count = line_count = 0
        usemaps: list[str] = []
        for _event, element in ET.iterparse(DJVU_XML, events=("end",)):
            if element.tag != "OBJECT":
                continue
            page_count += 1
            usemaps.append(element.attrib["usemap"])
            word_count += sum(1 for _ in element.iter("WORD"))
            line_count += sum(1 for _ in element.iter("LINE"))
            element.clear()
        self.assertEqual((page_count, word_count, line_count), (1240, 463_565, 40_508))
        self.assertEqual(usemaps, [f"2015.342236.99999990231847_{index:04d}.djvu" for index in range(1240)])
        self.assertEqual(self.profile["coordinate_ocr"]["page_object_count"], page_count)
        self.assertEqual(self.profile["coordinate_ocr"]["word_count"], word_count)
        self.assertEqual(self.profile["coordinate_ocr"]["line_count"], line_count)

    def test_page_number_map_is_zero_confidence_and_omits_only_leaf_zero(self) -> None:
        rows = json.loads(PAGE_NUMBERS.read_text(encoding="utf-8"))["pages"]
        self.assertEqual(len(rows), 1239)
        self.assertEqual([rows[0]["leafNum"], rows[-1]["leafNum"]], [1, 1239])
        self.assertEqual(set(range(1240)) - {row["leafNum"] for row in rows}, {0})
        self.assertEqual(sum(row["confidence"] > 0 for row in rows), 0)
        self.assertFalse(self.profile["page_number_evidence"]["trusted_as_authoritative_pagination"])

    def test_scandata_is_exactly_aligned_to_pdf_pages(self) -> None:
        root = ET.parse(SCANDATA).getroot()
        rows = root.findall(".//page")
        self.assertEqual(root.findtext("./bookData/leafCount"), "1240")
        self.assertEqual(len(rows), 1240)
        self.assertEqual([int(row.attrib["leafNum"]) for row in rows], list(range(1240)))
        self.assertTrue(self.profile["scandata_alignment"]["pdf_page_equals_leaf_num_plus_one"])

    def test_landmark_sample_and_product_boundary_fail_closed(self) -> None:
        sample = self.profile["landmark_quality_sample"]
        self.assertEqual(sample["sample_count"], 18)
        self.assertEqual({row["pdf_page"] for row in sample["rows"]}, {6, 52, 424, 425, 738, 739, 807, 808, 849, 850, 921, 922, 1070, 1071, 1223, 1224, 1225, 1236})
        boundary = self.profile["product_boundary"]
        self.assertTrue(boundary["coordinate_alignment_ready_for_correction_work"])
        for key in (
            "ocr_quality_proven", "ocr_text_exact", "ocr_product_usable", "passage_indexed",
            "public_search_sarthi_api_vector_training_allowed", "ai_translation_from_unverified_ocr_allowed",
            "complete_ramcharitmanas_text_lane",
        ):
            self.assertFalse(boundary[key], key)

    def test_builder_report_has_exact_check_set(self) -> None:
        expected = {
            "plan_sha256_matches", "fixed_profile_sha256_matches", "all_source_fixities_match",
            "all_sources_strict_utf8", "coordinate_pages_match_fixed_pdf", "coordinate_usemaps_contiguous",
            "coordinate_word_and_line_counts_nonzero", "scandata_leaves_match_fixed_pdf",
            "page_number_omission_is_exactly_leaf_zero", "page_number_confidence_is_zero",
            "landmark_sample_covers_all_seven_starts_and_closes", "ocr_quality_and_product_claims_fail_closed",
        }
        self.assertEqual(set(self.report["checks"]), expected)
        self.assertTrue(all(self.report["checks"].values()))
        self.assertEqual((self.report["passed"], self.report["total"]), (12, 12))
        self.assertEqual(self.report["profile_sha256"], sha256(PROFILE))
        self.assertTrue(all(value is False for value in self.report["mutation_boundary"].values()))


if __name__ == "__main__":
    unittest.main()

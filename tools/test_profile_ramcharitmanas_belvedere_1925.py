from __future__ import annotations

import hashlib
import json
import unittest
from pathlib import Path

from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "source_vault/objects/sha256/6d/6d570d531ebada1912f6e930212393fec2200765a0b731b73b8e7135ea0f70f2"
PLAN = ROOT / "ingestion/plans/ramcharitmanas-belvedere-1925-commons-source-acquisition-v1.json"
PROFILE = ROOT / "ingestion/profiles/ramcharitmanas-belvedere-1925-fixed-carrier-profile-v1.json"
REPORT = ROOT / "ingestion/reports/ramcharitmanas-belvedere-1925-structure-v1.json"
EXPECTED_SOURCE_SHA256 = "6d570d531ebada1912f6e930212393fec2200765a0b731b73b8e7135ea0f70f2"
EXPECTED_PLAN_SHA256 = "c752fad4615fe643247715a97c614ecdba76670e72ef1650b8cf82dcc08f8c42"


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


class RamcharitmanasBelvedereFixedCarrierTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.profile = json.loads(PROFILE.read_text(encoding="utf-8"))
        cls.report = json.loads(REPORT.read_text(encoding="utf-8"))
        cls.reader = PdfReader(SOURCE)

    def test_source_and_plan_fixities(self) -> None:
        self.assertEqual(sha256(SOURCE), EXPECTED_SOURCE_SHA256)
        self.assertEqual(SOURCE.stat().st_size, 78_560_265)
        self.assertEqual(sha256(PLAN), EXPECTED_PLAN_SHA256)
        self.assertEqual(self.report["source_sha256"], EXPECTED_SOURCE_SHA256)
        self.assertEqual(self.report["acquisition_plan_sha256"], EXPECTED_PLAN_SHA256)
        self.assertEqual(self.report["profile_sha256"], sha256(PROFILE))

    def test_pdf_is_image_only_and_exactly_1240_pages(self) -> None:
        self.assertEqual(len(self.reader.pages), 1_240)
        self.assertEqual(sum(bool((page.extract_text() or "").strip()) for page in self.reader.pages), 0)
        self.assertFalse(self.profile["source_object"]["embedded_text_layer_present"])

    def test_full_pdf_page_accounting_is_exact_and_unique(self) -> None:
        pages: list[int] = []
        for row in self.profile["front_matter"]["units"]:
            pages.extend(range(row["pdf_pages"][0], row["pdf_pages"][1] + 1))
        for row in self.profile["structure"]["sopanas"]:
            pages.extend(range(row["pdf_pages"][0], row["pdf_pages"][1] + 1))
        for row in self.profile["appendices_and_trailing_matter"]:
            pages.extend(range(row["pdf_pages"][0], row["pdf_pages"][1] + 1))
        self.assertEqual(pages, list(range(1, 1_241)))
        self.assertEqual(len(pages), len(set(pages)))

    def test_seven_sopana_structure_and_terminals(self) -> None:
        rows = self.profile["structure"]["sopanas"]
        self.assertEqual([row["ordinal"] for row in rows], list(range(1, 8)))
        self.assertEqual([row["name"] for row in rows], [
            "बालकाण्ड", "अयोध्याकाण्ड", "अरण्यकाण्ड", "किष्किन्धाकाण्ड",
            "सुन्दरकाण्ड", "लङ्काकाण्ड", "उत्तरकाण्ड",
        ])
        self.assertEqual(rows[0]["pdf_pages"], [52, 424])
        self.assertEqual(rows[-1]["pdf_pages"], [1071, 1223])
        self.assertEqual(rows[0]["printed_pages"], [1, 365])
        self.assertEqual(rows[-1]["printed_pages"], [996, 1144])
        self.assertTrue(all("सोपानः समाप्तः" in row["close_literal"] for row in rows))
        self.assertTrue(rows[-1]["whole_main_work_close"])

    def test_front_identity_and_year_discrepancy_are_preserved(self) -> None:
        identity = self.profile["identity"]
        self.assertEqual(identity["carrier_title_literal"], "सटीक रामचरितमानस")
        self.assertEqual(identity["edition_literal"], "द्वितीय संस्करण")
        self.assertIn("संवत् १९८२", identity["printed_date_literal"])
        self.assertEqual(identity["hindi_wikisource_year_literal"], 1925)
        self.assertEqual(identity["dli_description_year_literal"], 1926)
        self.assertIn("separately preserved", identity["year_resolution"])

    def test_appendices_and_final_blank_are_not_silently_folded_into_main_work(self) -> None:
        rows = self.profile["appendices_and_trailing_matter"]
        self.assertEqual(rows[0]["kind"], "रामायण की आरती")
        self.assertEqual(rows[1]["kind"], "मानस-पिङ्गल")
        self.assertEqual(rows[1]["terminal_literal"], "इति मानस-पिङ्गल समाप्तः।")
        self.assertEqual(rows[-1], {"kind": "blank", "pdf_pages": [1240, 1240]})

    def test_product_boundary_is_positive_for_scan_but_fail_closed_for_text(self) -> None:
        boundary = self.profile["rights_and_product_boundary"]
        self.assertEqual(boundary["rights_lane"], "product_compatible_public_domain_scan")
        self.assertTrue(boundary["fixed_carrier_identity_verified"])
        self.assertTrue(boundary["fixed_carrier_seven_sopana_structure_verified"])
        self.assertTrue(boundary["fixed_carrier_terminal_verified"])
        for key in (
            "carrier_published_by_devam", "exact_text_ready", "verified_ocr_available",
            "verified_transcription_available", "passage_indexed", "product_passages_allowed",
            "public_search_sarthi_api_vector_training_allowed",
            "complete_all_ramcharitmanas_editions_recensions_commentaries_translations_traditions",
            "complete_ramayana_universe",
        ):
            self.assertFalse(boundary[key], key)

    def test_builder_report_is_complete_and_passes(self) -> None:
        expected_keys = {
            "source_sha256_matches", "source_bytes_match", "acquisition_plan_sha256_matches",
            "pdf_page_count_matches", "embedded_text_absent", "all_pdf_pages_accounted_once",
            "seven_sopanas_present", "sopana_ordinals_contiguous", "printed_ranges_contiguous",
            "printed_range_is_1_through_1144", "fixed_carrier_positive_boundary_exact",
            "text_and_product_denials_fail_closed",
        }
        self.assertEqual(set(self.report["checks"]), expected_keys)
        self.assertTrue(all(self.report["checks"].values()))
        self.assertEqual((self.report["passed"], self.report["total"]), (12, 12))
        self.assertTrue(all(value is False for value in self.report["mutation_boundary"].values()))


if __name__ == "__main__":
    unittest.main()

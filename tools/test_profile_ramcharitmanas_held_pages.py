from __future__ import annotations

import hashlib
import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PLAN = ROOT / "ingestion/plans/ramcharitmanas-wikisource-belvedere-pages-v1.json"
IA_PROFILE = ROOT / "ingestion/profiles/ramcharitmanas-belvedere-1925-ia-ocr-alignment-profile-v1.json"
REPORT = ROOT / "ingestion/reports/ramcharitmanas-held-page-recovery-v1.json"
PDF = ROOT / "source_vault/objects/sha256/6d/6d570d531ebada1912f6e930212393fec2200765a0b731b73b8e7135ea0f70f2"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class RamcharitmanasHeldPageRecoveryTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.report = json.loads(REPORT.read_text(encoding="utf-8"))

    def test_tracked_inputs_and_report_contract_are_fixed(self) -> None:
        self.assertEqual(sha256(PLAN), "fbc2a25045bcf8dcbfcb8a5dd2c5388fe8263c209567d515b27f138d0882c0ab")
        self.assertEqual(sha256(IA_PROFILE), "2876993199c7e7cf7ddcaadee9c6b9d2ef55a2d5b927d626d3f76352879cfd9a")
        self.assertEqual(self.report["contract"], "DEVAM_RAMCHARITMANAS_HELD_PAGE_RECOVERY_V1")
        self.assertEqual(self.report["result"], "PASS")
        self.assertTrue(all(self.report["checks"].values()))
        self.assertEqual((self.report["passed"], self.report["total"]), (12, 12))

    def test_q0_pages_split_into_structural_blanks_and_missing_text(self) -> None:
        rows = self.report["rows"]
        self.assertEqual([row["pdf_page"] for row in rows], [150, 185, 266, 330, 529, 792, 820, 829, 840, 853, 866, 941, 1075, 1088])
        self.assertTrue(all(row["ia_coordinate_ocr_word_count"] == 0 for row in rows))
        denominator = self.report["reconciled_denominator"]
        self.assertEqual(denominator["structural_blank_pages"], [150, 185, 266, 330, 529, 792, 820, 829, 840, 853, 866, 941, 1075, 1088])
        self.assertEqual(denominator["missing_transcription_text_bearing_pages"], [])
        self.assertEqual(denominator["ambiguous_pages"], [])

    def test_reconciled_text_denominator_closes_without_promotion(self) -> None:
        denominator = self.report["reconciled_denominator"]
        self.assertEqual(denominator["carrier_narrative_coordinate_pages"], 1172)
        self.assertEqual(denominator["prepared_text_pages"], 813)
        self.assertEqual(denominator["unproofread_text_bearing_pages"], 345)
        self.assertEqual(denominator["structural_blank_page_count"], 14)
        self.assertEqual(denominator["missing_transcription_text_bearing_page_count"], 0)
        self.assertEqual(denominator["remaining_text_correction_page_count"], 345)
        self.assertEqual(denominator["text_bearing_page_denominator"], 1158)
        self.assertEqual(813 + 345, 1158)
        boundary = self.report["product_boundary"]
        self.assertEqual(boundary["prepared_product_page_count"], 813)
        for key in (
            "prepared_product_page_count_changed",
            "structural_blanks_are_missing_story_text",
            "remaining_text_pages_corrected",
            "complete_product_searchable_ramcharitmanas_text",
            "public_search_sarthi_or_atlas_mutated",
        ):
            self.assertFalse(boundary[key], key)

    def test_render_reproduction_when_fixed_vault_is_present(self) -> None:
        if not PDF.is_file():
            self.skipTest("fixed source vault PDF is not present")
        try:
            import pypdfium2  # noqa: F401
            from tools.profile_ramcharitmanas_held_pages import build
        except ImportError as error:
            self.skipTest(f"render dependency unavailable: {error}")
        rebuilt, checks = build()
        self.assertTrue(all(checks.values()))
        self.assertEqual(rebuilt, self.report)


if __name__ == "__main__":
    unittest.main()

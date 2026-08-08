from __future__ import annotations

import json
import unittest

from tools.acquire_ramcharitmanas_wikisource_pages import (
    EXPECTED_NARRATIVE_QUALITY_COUNTS,
    EXPECTED_PAGE_COUNT,
    EXPECTED_QUALITY_COUNTS,
    PLAN,
    REPORT,
    counts_for,
    page_number,
    validate_page_rows,
    validate_profile,
)


class RamcharitmanasWikisourceAcquisitionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.plan = json.loads(PLAN.read_text(encoding="utf-8"))
        cls.report = json.loads(REPORT.read_text(encoding="utf-8"))

    def test_profile_is_self_authenticating_and_exact(self) -> None:
        validate_profile(self.plan)
        rows = self.plan["wikisource"]["pages"]
        self.assertEqual(len(rows), EXPECTED_PAGE_COUNT)
        self.assertEqual(counts_for(rows), EXPECTED_QUALITY_COUNTS)
        self.assertEqual(counts_for(rows, 52, 1223), EXPECTED_NARRATIVE_QUALITY_COUNTS)

    def test_page_number_is_devanagari_and_prefix_bound(self) -> None:
        self.assertEqual(page_number("पृष्ठ:रामचरितमानस.pdf/१"), 1)
        self.assertEqual(page_number("पृष्ठ:रामचरितमानस.pdf/१२४०"), 1240)
        with self.assertRaises(RuntimeError):
            page_number("पृष्ठ:रामचरितमानस.pdf/01")
        with self.assertRaises(RuntimeError):
            page_number("पृष्ठ:दूसरा.pdf/१")

    def test_page_universe_rejects_loss_or_duplication(self) -> None:
        rows = self.plan["wikisource"]["pages"]
        validate_page_rows(rows)
        with self.assertRaises(RuntimeError):
            validate_page_rows(rows[:-1])
        with self.assertRaises(RuntimeError):
            validate_page_rows([*rows, rows[-1]])

    def test_report_keeps_product_boundary_fail_closed(self) -> None:
        self.assertEqual(self.report["result"], "PASS")
        self.assertEqual(self.report["profile_id"], self.plan["profile_id"])
        self.assertEqual(self.report["page_count"], 1240)
        self.assertEqual(self.report["narrative_page_count"], 1172)
        self.assertEqual(self.report["product_candidate_page_count"], 813)
        self.assertEqual(self.report["correction_required_page_count"], 359)
        self.assertFalse(self.report["complete_product_searchable_ramcharitmanas_text"])
        self.assertFalse(self.report["source_payloads_copied_into_app"])


if __name__ == "__main__":
    unittest.main()

from __future__ import annotations

import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / "ingestion/reports/ramcharitmanas-q1-dual-witness-screen-v1.json"
VAULT_REVISION = ROOT / "source_vault/objects/sha256/c9/c9c6a1436bbecc2be41e89fc81155e65cf2e58e54d1a5ee7e3aeef94c8e88106"


class RamcharitmanasQ1DualWitnessTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.report = json.loads(REPORT.read_text(encoding="utf-8"))

    def test_screen_closes_the_exact_q1_universe_without_promotion(self) -> None:
        self.assertEqual(self.report["contract"], "DEVAM_RAMCHARITMANAS_Q1_DUAL_WITNESS_SCREEN_V1")
        self.assertEqual(self.report["decision"], "SCREEN_COMPLETE_NO_BULK_PROMOTION")
        self.assertEqual(self.report["control_distribution"]["page_count"], 813)
        self.assertEqual(self.report["q1_distribution"]["page_count"], 345)
        self.assertEqual(self.report["screen_result"]["inside_control_envelope_page_count"], 340)
        self.assertEqual(self.report["screen_result"]["outside_control_envelope_pages"], [381, 415, 847, 994, 1024])
        self.assertEqual(self.report["product_boundary"]["q1_pages_promoted"], 0)
        self.assertEqual(self.report["product_boundary"]["q1_pages_remaining_for_correction_or_derived_consumer_synthesis"], 345)

    def test_manual_adjudication_holds_every_outlier(self) -> None:
        rows = self.report["manual_adjudication"]
        self.assertEqual([row["scan_page"] for row in rows], [381, 415, 847, 994, 1024])
        self.assertTrue(all(row["product_status"] == "held_for_correction" for row in rows))
        self.assertTrue(all(len(row["finding"]) >= 80 for row in rows))

    def test_external_witnesses_are_catalogued_without_acquisition(self) -> None:
        leads = self.report["correction_witness_leads"]
        self.assertEqual({row["provider"] for row in leads}, {"IIT Kanpur Ramcharitmanas", "Sanskrit Documents Tulsidas collection"})
        self.assertTrue(all("not_acquired" in row["rights_status"] for row in leads))
        self.assertFalse(self.report["product_boundary"]["external_correction_witness_payload_acquired"])

    def test_local_ocr_candidate_failed_before_output_and_is_not_scaled(self) -> None:
        benchmark = self.report["local_ocr_candidate_benchmark"]
        self.assertEqual(benchmark["fixed_input_scan_page"], 381)
        self.assertEqual(benchmark["result"], "RUNTIME_INCOMPATIBLE_BEFORE_OCR_OUTPUT")
        self.assertFalse(benchmark["recognized_text_generated"])
        self.assertFalse(benchmark["approved_for_scale"])
        self.assertFalse(benchmark["model_payload_retained_in_repository_or_source_vault"])

    def test_report_checks_and_mutation_boundary_are_closed(self) -> None:
        self.assertTrue(all(self.report["checks"].values()))
        self.assertEqual((self.report["passed"], self.report["total"]), (11, 11))
        self.assertTrue(all(value is False for value in self.report["mutation_boundary"].values()))
        for key in (
            "dual_witness_agreement_proves_exactness",
            "bulk_product_promotion_allowed",
            "unverified_text_allowed_as_translation_input",
            "external_correction_witness_payload_acquired",
            "local_ocr_candidate_output_generated",
            "local_ocr_candidate_approved_for_scale",
            "database_mutated",
        ):
            self.assertFalse(self.report["product_boundary"][key], key)

    def test_rebuild_when_source_vault_revision_batches_are_present(self) -> None:
        if not VAULT_REVISION.is_file():
            self.skipTest("source-vault revision batches are not present")
        from tools.profile_ramcharitmanas_q1_dual_witness import build

        rebuilt, checks = build()
        self.assertTrue(all(checks.values()))
        self.assertEqual(rebuilt, self.report)


if __name__ == "__main__":
    unittest.main()

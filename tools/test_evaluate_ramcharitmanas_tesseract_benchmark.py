from __future__ import annotations

import hashlib
import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / "ingestion/reports/ramcharitmanas-belvedere-tesseract-benchmark-v1.json"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class RamcharitmanasTesseractBenchmarkTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.report = json.loads(REPORT.read_text(encoding="utf-8"))

    def test_report_fixity_and_exact_configuration_results(self) -> None:
        self.assertEqual(sha256(REPORT), "bd86460781c361bdf0f829c6cebb0f29244fd72b64a85db4343fa1d27603049e")
        observed = [
            (row["model"], row["psm"], row["exact_literal_matches"], row["exact_token_hits"], row["longest_exact_character_run_total"])
            for row in self.report["configurations"]
        ]
        self.assertEqual(observed, [
            ("fast", 3, 3, 30, 119),
            ("fast", 6, 3, 29, 117),
            ("best", 3, 1, 33, 111),
            ("best", 6, 0, 32, 104),
        ])

    def test_decision_compares_against_legacy_without_false_promotion(self) -> None:
        self.assertEqual(self.report["legacy_ia_ocr_baseline"], {
            "exact_literal_matches": 3,
            "exact_token_hits": 32,
            "expected_tokens": 51,
        })
        self.assertEqual(self.report["decision"], "DO_NOT_SCALE_LOCAL_TESSERACT")
        self.assertFalse(self.report["materially_better_than_legacy_on_both_exact_literals_and_tokens"])
        self.assertEqual(self.report["best_configuration"]["model"], "fast")
        self.assertEqual(self.report["best_configuration"]["psm"], 3)
        self.assertTrue(all(value is False for value in self.report["product_boundary"].values()))

    def test_exact_source_model_and_render_provenance_is_bound(self) -> None:
        self.assertEqual(
            self.report["fixed_source_sha256"],
            "6d570d531ebada1912f6e930212393fec2200765a0b731b73b8e7135ea0f70f2",
        )
        self.assertEqual(self.report["rendering"]["page_count"], 18)
        self.assertFalse(self.report["rendering"]["renders_persisted"])
        self.assertEqual(self.report["models"]["fast"]["sha256"], "4c73ffc59d497c186b19d1e90f5d721d678ea6b2e277b719bee4e2af12271825")
        self.assertEqual(self.report["models"]["best"]["sha256"], "bd2e65a2184af08a167b0be2439e91fa5edbc4394399ca2f692b843ae26e78d6")


if __name__ == "__main__":
    unittest.main()

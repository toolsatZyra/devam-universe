import hashlib
import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / "ingestion" / "reports" / "ramayana-dwarka-prasad-sharma-hindi-1927-structural-review-v1.json"
PLAN = ROOT / "ingestion" / "plans" / "ramayana-dwarka-prasad-sharma-hindi-1927-source-acquisition-v1.json"
OBJECTS = ROOT / "source_vault" / "objects.jsonl"


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


class DpSharmaRamayana1927StructuralReviewTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.report = json.loads(REPORT.read_text(encoding="utf-8"))
        cls.objects = {
            row["sha256"]: row
            for line in OBJECTS.read_text(encoding="utf-8").splitlines()
            if line
            for row in [json.loads(line)]
        }

    def test_frozen_acquisition_and_identity_boundary(self) -> None:
        self.assertEqual(self.report["contract"], "DEVAM_LEAN_FIXED_EDITION_STRUCTURAL_REVIEW_V1")
        self.assertEqual(self.report["result"], "PASS_INTERNAL_EVIDENCE_ONLY")
        self.assertEqual(sha256(PLAN), self.report["acquisition"]["plan_sha256"])
        self.assertEqual(self.report["acquisition"]["source_object_count"], 10)
        self.assertIn("not Ramcharitmanas", self.report["identity"]["edition_boundary"])
        self.assertIn("does not prove", self.report["aggregate"]["not_proved"].casefold())
        self.assertIn("every recension", self.report["aggregate"]["not_proved"].casefold())

    def test_all_ten_fixed_carriers_and_boundaries(self) -> None:
        volumes = self.report["volumes"]
        self.assertEqual([row["volume"] for row in volumes], list(range(1, 11)))
        self.assertEqual(sum(row["bytes"] for row in volumes), 191_180_148)
        self.assertEqual(sum(row["pdf_pages"] for row in volumes), 6_195)
        self.assertEqual(self.report["aggregate"]["main_divisions"], 7)
        for row in volumes:
            obj = self.objects[row["sha256"]]
            self.assertEqual(obj["bytes"], row["bytes"])
            carrier = ROOT / "source_vault" / obj["object_path"]
            self.assertTrue(carrier.is_file())
            self.assertEqual(carrier.stat().st_size, row["bytes"])
            self.assertEqual(sha256(carrier), row["sha256"])
            self.assertGreaterEqual(row["main_text_terminal_pdf_page"], row["title_evidence_pdf_page"])
            self.assertLess(row["main_text_terminal_pdf_page"], row["trailing_matter_start_pdf_page"])
            self.assertLessEqual(row["trailing_matter_start_pdf_page"], row["pdf_pages"])

    def test_ocr_and_product_lanes_remain_fail_closed(self) -> None:
        self.assertEqual(self.report["ocr_locator_evidence"]["status"], "LIVE_IN_MEMORY_ONLY_NOT_ACQUIRED_NOT_TRUSTED")
        self.assertFalse(self.report["ocr_locator_evidence"]["selected_as_source"])
        self.assertFalse(self.report["ocr_locator_evidence"]["servable"])
        rights = self.report["rights_and_serving"]
        self.assertTrue(rights["internal_library_preservation"])
        for lane in ("commercial_product_compatible", "translator_term_resolved", "search", "sarthi", "api", "vector", "training", "atlas", "public_product"):
            self.assertFalse(rights[lane], lane)


if __name__ == "__main__":
    unittest.main()

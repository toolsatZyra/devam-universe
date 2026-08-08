from __future__ import annotations

import hashlib
import json
import unittest
from pathlib import Path

from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
PLAN = ROOT / "ingestion" / "plans" / "mudgala-purana-mahasabde-1976-source-acquisition-v1.json"
REPORT = ROOT / "ingestion" / "reports" / "mudgala-purana-mahasabde-1976-source-acquisition-v1.json"
PROFILE = ROOT / "ingestion" / "profiles" / "mudgala-purana-mahasabde-1976-fixed-carrier-profile-v1.json"
EXPECTED_SOURCE_SHA256 = "678edb439abdc43fa3db1148296d4b4f984cfd30cf750982465d16fdf97af8cc"
EXPECTED_PLAN_SHA256 = "96c4fb4d41f628ac91afe52adeaa61624a83ec876bea060100ffb2cce95717d5"


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


class MudgalaPuranaFixedCarrierProfileTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.plan = json.loads(PLAN.read_text(encoding="utf-8"))
        cls.report = json.loads(REPORT.read_text(encoding="utf-8"))
        cls.profile = json.loads(PROFILE.read_text(encoding="utf-8"))
        cls.source = ROOT / cls.profile["source_object"]["object_path"]

    def test_acquisition_and_source_fixities(self) -> None:
        self.assertEqual(sha256(PLAN), EXPECTED_PLAN_SHA256)
        self.assertEqual(self.report["plan_sha256"], EXPECTED_PLAN_SHA256)
        self.assertEqual(sha256(self.source), EXPECTED_SOURCE_SHA256)
        self.assertEqual(self.source.stat().st_size, 63_438_893)
        self.assertEqual(self.report["source_object"]["sha256"], EXPECTED_SOURCE_SHA256)
        self.assertTrue(self.report["source_object"]["provider_fixities_match"])
        self.assertEqual(self.report["source_object"]["payload_copies_created"], 1)

    def test_pdf_and_structure_accounting(self) -> None:
        self.assertEqual(len(PdfReader(self.source).pages), 1023)
        structure = self.profile["structure"]
        self.assertEqual(structure["khanda_count"], 9)
        self.assertEqual(sum(row["chapters"] for row in structure["khandas"]), 459)
        self.assertEqual(sum(row["printed_pages"][1] - row["printed_pages"][0] + 1 for row in structure["khandas"]), 1003)

        owned_pages: list[int] = []
        for row in structure["khandas"]:
            if row["start_card_pdf_page"] is not None:
                owned_pages.append(row["start_card_pdf_page"])
            owned_pages.extend(range(row["text_pdf_pages"][0], row["text_pdf_pages"][1] + 1))
            owned_pages.append(row["close_pdf_page"])
            if "trailing_pdf_pages" in row:
                owned_pages.extend(range(row["trailing_pdf_pages"][0], row["trailing_pdf_pages"][1] + 1))
            if "whole_work_close_pdf_page" in row:
                owned_pages.append(row["whole_work_close_pdf_page"])
        self.assertEqual(len(owned_pages), len(set(owned_pages)))
        self.assertEqual(sorted(owned_pages), list(range(1, 1024)))
        self.assertEqual(len(owned_pages) - structure["printed_text_pages"], structure["non_text_boundary_pages"])

    def test_identity_rights_and_ocr_stay_fail_closed(self) -> None:
        self.assertFalse(self.profile["identity"]["carrier_contains_title_or_publication_leaf"])
        self.assertFalse(self.profile["identity"]["mahasabde_1976_nirnaya_sagar_identity_page_proved"])
        boundary = self.profile["rights_and_product_boundary"]
        self.assertEqual(boundary["rights_lane"], "internal_only_rights_review_pending")
        self.assertTrue(all(value is False for key, value in boundary.items() if key.endswith("allowed") or key.startswith("complete_") or key.endswith("available") or key.endswith("page_proved")))
        self.assertFalse(self.profile["ocr_navigation_evidence"]["acquired"])
        self.assertFalse(self.profile["ocr_navigation_evidence"]["product_usable"])

    def test_terminal_is_bounded_to_the_fixed_carrier(self) -> None:
        self.assertEqual([row["pdf_page"] for row in self.profile["terminal_evidence"]], [1021, 1021, 1022, 1023])
        self.assertEqual(self.profile["decision"], "FIXED_CARRIER_STRUCTURALLY_COMPLETE_NINE_KHANDA_EDITION_INTERNAL_ONLY")
        self.assertFalse(self.profile["rights_and_product_boundary"]["complete_all_mudgala_purana_editions_recensions_translations"])


if __name__ == "__main__":
    unittest.main()

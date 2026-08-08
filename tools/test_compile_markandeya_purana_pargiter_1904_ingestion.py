from __future__ import annotations

import hashlib
import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TOOLS = ROOT / "tools"
if str(TOOLS) not in sys.path:
    sys.path.insert(0, str(TOOLS))

from compile_markandeya_purana_pargiter_1904_ingestion import (  # noqa: E402
    CONTRACT,
    OCR_SHA256,
    build_report,
    compile_packet,
    compile_sql,
    compile_sql_batches,
)


PLAN = ROOT / "ingestion" / "plans" / "markandeya-purana-pargiter-1904-v1.json"
OCR_PATH = ROOT / "source_vault" / "objects" / "sha256" / "13" / OCR_SHA256


class PargiterMarkandeyaPuranaIngestionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.packet = compile_packet(PLAN)
        cls.sql = compile_sql(cls.packet)
        cls.batches = compile_sql_batches(cls.sql)

    def test_identity_scope_and_rights_are_fail_closed(self) -> None:
        self.assertEqual(self.packet["contract"], CONTRACT)
        self.assertEqual(self.packet["work"]["slug"], "markandeya-purana")
        self.assertEqual(self.packet["identity"]["translator"], "F. Eden Pargiter, B.A.")
        self.assertEqual(self.packet["edition"]["publication_year"], 1904)
        self.assertEqual(self.packet["rights"]["lane"], "derivative_allowed")
        self.assertEqual(self.packet["work"]["aggregate_rights_lane"], "private_evidence")
        self.assertFalse(self.packet["rights"]["ocr_product_ready"])
        self.assertIsNone(self.packet["rights"]["provider_top_level_rights"])
        self.assertIsNone(self.packet["rights"]["provider_top_level_licenseurl"])
        self.assertTrue(all(value is False for value in self.packet["completion_denials"].values()))

    def test_exact_source_universe_is_reference_only(self) -> None:
        self.assertEqual(self.packet["source_object_count"], 4)
        self.assertEqual(
            [source["role"] for source in self.packet["source_objects"]],
            ["citation_image_pdf", "provider_ocr_text", "provider_ocr_xml", "provider_scandata"],
        )
        self.assertEqual(sum(source["bytes"] for source in self.packet["source_objects"]), 65517930)
        self.assertEqual(self.packet["source_copy_policy"], "reference_only_no_duplicate_payload")
        self.assertTrue(all(source["object_path"].startswith("objects/sha256/") for source in self.packet["source_objects"]))

    def test_all_image_pages_have_unambiguous_quarantined_citations(self) -> None:
        passages = self.packet["passages"]
        self.assertEqual(len(passages), 778)
        self.assertEqual([row["source_ordinal"] for row in passages], list(range(1, 779)))
        self.assertEqual(
            [row["source_ordinal"] for row in passages if row["exact_text"] is None],
            [2, 3, 4, 5, 9, 43, 774, 775, 776, 777],
        )
        for page, row in enumerate(passages, start=1):
            locator = row["locator"]
            self.assertEqual(locator["pdf_page"], page)
            self.assertEqual(locator["djvu_object_ordinal"], page)
            self.assertEqual(locator["ocr_source_sha256"], OCR_SHA256)
            self.assertTrue(locator["ocr_quarantined"])
            self.assertEqual(row["text_status"], "provider_ocr_quarantined_unreviewed")
            self.assertGreater(locator["image_width"], 0)
            self.assertGreater(locator["image_height"], 0)

    def test_every_ocr_byte_span_rehashes_from_fixed_source(self) -> None:
        data = OCR_PATH.read_bytes()
        previous_end = 0
        for row in self.packet["passages"]:
            locator = row["locator"]
            start = locator["xml_byte_start"]
            end = locator["xml_byte_end_exclusive"]
            self.assertGreaterEqual(start, previous_end)
            self.assertGreater(end, start)
            self.assertEqual(hashlib.sha256(data[start:end]).hexdigest(), row["span_sha256"])
            text = row["exact_text"] or ""
            self.assertEqual(hashlib.sha256(text.encode("utf-8")).hexdigest(), locator["ocr_text_sha256"])
            previous_end = end

    def test_printed_and_structural_boundaries_are_exact(self) -> None:
        passages = self.packet["passages"]
        self.assertEqual(passages[43]["locator"]["printed_page"], "1")
        self.assertEqual(passages[730]["locator"]["printed_page"], "688")
        self.assertEqual(passages[731]["locator"]["printed_page"], "689")
        self.assertEqual(passages[772]["locator"]["printed_page"], "730")
        self.assertEqual(passages[508]["locator"]["structural_role"], "devimahatmya_context_canto_81")
        self.assertEqual(passages[515]["locator"]["structural_role"], "devimahatmya_proper_cantos_82_92")
        self.assertEqual(passages[564]["locator"]["structural_role"], "devimahatmya_context_canto_93")
        self.assertEqual(passages[731]["locator"]["structural_role"], "alternate_calcutta_ending")
        self.assertIn("End of the Markandeya Parana", passages[730]["exact_text"])
        self.assertIn("DIFFERENT ENDING", passages[731]["exact_text"])

    def test_devimahatmya_proper_and_context_are_not_conflated(self) -> None:
        boundary = self.packet["structure"]["devimahatmya_boundary"]
        self.assertEqual(boundary["context_opening_canto"], 81)
        self.assertEqual(boundary["proper_cantos"], [82, 92])
        self.assertEqual(boundary["context_closing_canto"], 93)
        self.assertEqual(boundary["proper_pdf_pages"], [516, 564])
        self.assertEqual(boundary["context_pdf_pages"], [509, 566])

    def test_sql_and_report_preserve_quarantine_and_are_deterministic(self) -> None:
        self.assertEqual(self.sql.count("insert into public.passages"), 778)
        self.assertEqual(self.sql.count("provider_ocr_quarantined_unreviewed"), 778)
        self.assertNotIn("'published'", self.sql)
        self.assertNotIn("storage.objects", self.sql)
        self.assertTrue(self.sql.isascii(), "SQL transport must remain ASCII-safe; all UTF-8 values use base64 decoding")
        self.assertEqual(self.sql, compile_sql(compile_packet(PLAN)))
        report = build_report(self.packet, self.sql, self.batches)
        self.assertEqual(report["result"], "PASS")
        self.assertEqual(report["source_object_count"], 4)
        self.assertEqual(report["source_bytes"], 65517930)
        self.assertEqual(report["passage_count"], 778)
        self.assertEqual(report["nonempty_ocr_passage_count"], 768)
        self.assertFalse(report["ocr_product_ready"])
        self.assertFalse(report["source_payloads_copied"])


if __name__ == "__main__":
    unittest.main()

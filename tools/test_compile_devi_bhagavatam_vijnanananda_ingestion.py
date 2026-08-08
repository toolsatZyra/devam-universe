from __future__ import annotations

import hashlib
import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TOOLS = ROOT / "tools"
if str(TOOLS) not in sys.path:
    sys.path.insert(0, str(TOOLS))

from compile_devi_bhagavatam_vijnanananda_ingestion import (  # noqa: E402
    BOOK_STARTS, CONTRACT, OCR_SHA256, build_report, compile_packet, compile_sql, compile_sql_batches,
)


PLAN = ROOT / "ingestion" / "plans" / "devi-bhagavatam-vijnanananda-english-v1.json"
OCR_PATH = ROOT / "source_vault" / "objects" / "sha256" / "eb" / OCR_SHA256


class DeviBhagavatamVijnananandaIngestionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.packet = compile_packet(PLAN)
        cls.sql = compile_sql(cls.packet)
        cls.batches = compile_sql_batches(cls.sql)

    def test_identity_scope_and_rights_are_fail_closed(self) -> None:
        self.assertEqual(self.packet["contract"], CONTRACT)
        self.assertEqual(self.packet["work"]["slug"], "devi-bhagavata-purana")
        self.assertEqual(self.packet["identity"]["translator"], "Swami Vijnanananda")
        self.assertIn("not an original", self.packet["identity"]["carrier_identity"])
        self.assertEqual(self.packet["rights"]["lane"], "derivative_allowed")
        self.assertEqual(self.packet["work"]["aggregate_rights_lane"], "private_evidence")
        self.assertFalse(self.packet["rights"]["ocr_product_ready"])
        self.assertTrue(all(value is False for value in self.packet["completion_denials"].values()))

    def test_exact_source_universe_is_reference_only(self) -> None:
        self.assertEqual(self.packet["source_object_count"], 4)
        self.assertEqual(sum(source["bytes"] for source in self.packet["source_objects"]), 34679135)
        self.assertEqual(self.packet["source_copy_policy"], "reference_only_no_duplicate_payload")
        self.assertTrue(all(source["object_path"].startswith("objects/sha256/") for source in self.packet["source_objects"]))

    def test_all_pages_have_unambiguous_quarantined_citations(self) -> None:
        passages = self.packet["passages"]
        self.assertEqual(len(passages), 865)
        self.assertEqual([row["source_ordinal"] for row in passages], list(range(1, 866)))
        self.assertEqual([row["source_ordinal"] for row in passages if row["exact_text"] is None], [5])
        for page, row in enumerate(passages, start=1):
            locator = row["locator"]
            self.assertEqual(locator["pdf_page"], page)
            self.assertEqual(locator["djvu_object_ordinal"], page)
            self.assertEqual(locator["ocr_source_sha256"], OCR_SHA256)
            self.assertTrue(locator["ocr_quarantined"])
            self.assertTrue(locator["historical_source_not_normative_advice"])
            self.assertEqual(row["text_status"], "provider_ocr_quarantined_unreviewed")

    def test_every_ocr_byte_span_rehashes(self) -> None:
        data = OCR_PATH.read_bytes()
        prior = 0
        for row in self.packet["passages"]:
            locator = row["locator"]
            start, end = locator["xml_byte_start"], locator["xml_byte_end_exclusive"]
            self.assertGreaterEqual(start, prior)
            self.assertEqual(hashlib.sha256(data[start:end]).hexdigest(), row["span_sha256"])
            self.assertEqual(hashlib.sha256((row["exact_text"] or "").encode()).hexdigest(), locator["ocr_text_sha256"])
            prior = end

    def test_book_terminal_and_navaratri_boundaries(self) -> None:
        passages = self.packet["passages"]
        self.assertEqual(self.packet["structure"]["book_start_pages"], BOOK_STARTS)
        for book, page in enumerate(BOOK_STARTS, start=1):
            self.assertEqual(passages[page - 1]["locator"]["book"], book)
        self.assertIn("what are to be done in the Navaratri", passages[177]["exact_text"])
        self.assertIn("performance of that by Rama", passages[192]["exact_text"])
        terminal = " ".join(passages[864]["exact_text"].split())
        self.assertIn("Devi Bhagavatam ends and is fully completed", terminal)
        self.assertIn("Om Tat Sat", passages[864]["exact_text"])

    def test_sql_and_report_are_deterministic_and_private(self) -> None:
        self.assertEqual(self.sql.count("insert into public.passages"), 865)
        self.assertTrue(self.sql.isascii())
        self.assertNotIn("storage.objects", self.sql)
        self.assertNotIn("'published'", self.sql)
        self.assertEqual(self.sql, compile_sql(compile_packet(PLAN)))
        report = build_report(self.packet, self.sql, self.batches)
        self.assertEqual(report["result"], "PASS")
        self.assertEqual(report["source_bytes"], 34679135)
        self.assertEqual(report["passage_count"], 865)
        self.assertEqual(report["nonempty_ocr_passage_count"], 864)
        self.assertFalse(report["ocr_product_ready"])
        self.assertFalse(report["source_payloads_copied"])


if __name__ == "__main__":
    unittest.main()

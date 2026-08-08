from __future__ import annotations

import hashlib
import json
import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TOOLS = ROOT / "tools"
if str(TOOLS) not in sys.path:
    sys.path.insert(0, str(TOOLS))

from compile_durga_puja_ghosha_1871_ingestion import (  # noqa: E402
    CONTRACT,
    OCR_SHA256,
    build_report,
    compile_packet,
    compile_sql,
    compile_sql_batches,
)


PLAN = ROOT / "ingestion" / "plans" / "durga-puja-ghosha-1871-v1.json"
OCR_PATH = ROOT / "source_vault" / "objects" / "sha256" / "21" / OCR_SHA256


class GhoshaDurgaPujaIngestionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.plan = json.loads(PLAN.read_text(encoding="utf-8", errors="strict"))
        cls.packet = compile_packet(PLAN)
        cls.sql = compile_sql(cls.packet)
        cls.batches = compile_sql_batches(cls.sql)

    def test_identity_scope_and_rights_are_fail_closed(self) -> None:
        self.assertEqual(self.packet["contract"], CONTRACT)
        self.assertEqual(self.packet["work"]["canonical_title"], "Durga Puja: With Notes and Illustrations")
        self.assertEqual(self.packet["edition"]["publication_year"], 1871)
        self.assertEqual(self.packet["identity"]["illustrator"], "Babu Tulsidas Pal")
        self.assertEqual(self.packet["rights"]["lane"], "derivative_allowed")
        self.assertFalse(self.packet["rights"]["ocr_product_ready"])
        self.assertEqual(self.packet["structure"]["publication_state"], "review")
        self.assertTrue(all(value is False for value in self.packet["completion_denials"].values()))
        self.assertIn("not a universal or current prescriptive vidhi", self.packet["work"]["summary"])

    def test_exact_source_universe_is_reference_only(self) -> None:
        self.assertEqual(self.packet["source_object_count"], 6)
        self.assertEqual(
            [source["role"] for source in self.packet["source_objects"]],
            [
                "page_images_djvu", "citation_image_pdf", "provider_ocr_text",
                "provider_ocr_xml", "provider_page_numbers", "provider_scandata",
            ],
        )
        self.assertEqual(sum(source["bytes"] for source in self.packet["source_objects"]), 14811580)
        self.assertEqual(self.packet["source_copy_policy"], "reference_only_no_duplicate_payload")
        self.assertTrue(all(source["object_path"].startswith("objects/sha256/") for source in self.packet["source_objects"]))

    def test_all_image_pages_have_unambiguous_quarantined_citations(self) -> None:
        passages = self.packet["passages"]
        self.assertEqual(len(passages), 193)
        self.assertEqual([row["source_ordinal"] for row in passages], list(range(1, 194)))
        self.assertEqual(
            [row["source_ordinal"] for row in passages if row["exact_text"] is None],
            [2, 4, 5, 6, 7, 11, 117, 189, 190, 193],
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

    def test_printed_page_and_terminal_boundaries_are_exact(self) -> None:
        passages = self.packet["passages"]
        self.assertEqual(passages[33]["locator"]["printed_page"], "1")
        self.assertEqual(passages[115]["locator"]["printed_page"], "83")
        self.assertEqual(passages[117]["locator"]["printed_page"], "i")
        self.assertEqual(passages[186]["locator"]["printed_page"], "lxx")
        self.assertEqual(passages[116]["locator"]["structural_role"], "blank_separator")
        self.assertIn("(59.)", passages[186]["exact_text"])
        self.assertEqual(passages[190]["locator"]["structural_role"], "library_binding_leaf")
        self.assertEqual(passages[191]["locator"]["structural_role"], "library_circulation_leaf")

    def test_visual_heading_profile_is_ordered_and_bounded(self) -> None:
        headings = self.packet["structure"]["main_headings"]
        self.assertEqual([row["ordinal"] for row in headings], list(range(1, 14)))
        self.assertEqual([row["pdf_page"] for row in headings], [34, 46, 47, 52, 58, 73, 88, 93, 99, 102, 107, 111, 112])
        self.assertEqual(headings[0]["literal"], "THE PRATIMA OR THE GROUP OF FIGURES.—CONSTRUCTION.")
        self.assertEqual(headings[-1]["literal"], "THE DASAMI PUJA.")
        boundaries = {row["role"]: row for row in self.packet["structure"]["visual_boundaries"]}
        self.assertEqual(boundaries["title_page"]["pdf_page"], 8)
        self.assertEqual(boundaries["intellectual_content_end"]["pdf_page"], 187)

    def test_sql_and_report_preserve_quarantine_and_are_deterministic(self) -> None:
        self.assertEqual(self.sql.count("insert into public.passages"), 193)
        self.assertEqual(self.sql.count("provider_ocr_quarantined_unreviewed"), 193)
        self.assertNotIn("'published'", self.sql)
        self.assertNotIn("storage.objects", self.sql)
        self.assertEqual(self.sql, compile_sql(compile_packet(PLAN)))
        report = build_report(self.packet, self.sql, self.batches)
        self.assertEqual(report["result"], "PASS")
        self.assertEqual(report["source_object_count"], 6)
        self.assertEqual(report["source_bytes"], 14811580)
        self.assertEqual(report["passage_count"], 193)
        self.assertEqual(report["nonempty_ocr_passage_count"], 183)
        self.assertFalse(report["ocr_product_ready"])
        self.assertFalse(report["source_payloads_copied"])


if __name__ == "__main__":
    unittest.main()

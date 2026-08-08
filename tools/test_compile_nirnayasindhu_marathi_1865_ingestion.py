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

from compile_nirnayasindhu_marathi_1865_ingestion import (  # noqa: E402
    CONTRACT,
    EXPECTED_SOURCE_BYTES,
    OCR_SHA256,
    PAGE_NUMBERS_SHA256,
    build_report,
    compile_packet,
    compile_sql,
    compile_sql_batches,
)


PLAN = ROOT / "ingestion" / "plans" / "nirnayasindhu-marathi-1865-v1.json"
OCR_PATH = ROOT / "source_vault" / "objects" / "sha256" / "83" / OCR_SHA256
PAGE_MAP_PATH = ROOT / "source_vault" / "objects" / "sha256" / "7f" / PAGE_NUMBERS_SHA256


class NirnayasindhuMarathi1865IngestionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.packet = compile_packet(PLAN)
        cls.sql = compile_sql(cls.packet)
        cls.batches = compile_sql_batches(cls.sql)

    def test_identity_scope_rights_and_safety_are_fail_closed(self) -> None:
        packet = self.packet
        self.assertEqual(packet["contract"], CONTRACT)
        self.assertEqual(packet["work"]["slug"], "nirnayasindhu")
        self.assertEqual(packet["identity"]["original_author"], "Kamalākarabhaṭṭa, son of Rāmakṛṣṇabhaṭṭa")
        self.assertIn("कृष्णशर्मा", packet["identity"]["translator_editor_literal"])
        self.assertEqual(packet["edition"]["publication_year"], 1865)
        self.assertEqual(packet["rights"]["lane"], "private_evidence")
        self.assertEqual(packet["work"]["aggregate_rights_lane"], "private_evidence")
        self.assertFalse(packet["rights"]["ocr_product_ready"])
        self.assertFalse(packet["rights"]["modern_ritual_guidance_ready"])
        self.assertIsNone(packet["rights"]["provider_top_level_rights"])
        self.assertIsNone(packet["rights"]["provider_top_level_licenseurl"])
        self.assertTrue(packet["safety_boundary"]["historical_normative_material_present"])
        self.assertTrue(all(value is False for value in packet["completion_denials"].values()))

    def test_exact_reference_only_source_universe_and_provider_fixities(self) -> None:
        sources = self.packet["source_objects"]
        self.assertEqual(self.packet["source_object_count"], 5)
        self.assertEqual(
            [source["role"] for source in sources],
            ["citation_image_pdf", "provider_ocr_text", "provider_ocr_xml", "provider_page_numbers", "provider_scandata"],
        )
        self.assertEqual(sum(source["bytes"] for source in sources), EXPECTED_SOURCE_BYTES)
        self.assertEqual(self.packet["source_copy_policy"], "reference_only_no_duplicate_payload")
        self.assertTrue(all(source["object_path"].startswith("objects/sha256/") for source in sources))
        self.assertTrue(all(len(source["provider_md5"]) == 32 for source in sources))
        self.assertTrue(all(len(source["provider_sha1"]) == 40 for source in sources))
        self.assertTrue(all(len(source["provider_crc32"]) == 8 for source in sources))

    def test_all_pages_have_unambiguous_image_and_quarantined_ocr_coordinates(self) -> None:
        passages = self.packet["passages"]
        self.assertEqual(len(passages), 670)
        self.assertEqual([row["source_ordinal"] for row in passages], list(range(1, 671)))
        self.assertEqual([row["source_ordinal"] for row in passages if row["exact_text"] is None], [1, 17, 95, 670])
        for page, row in enumerate(passages, start=1):
            locator = row["locator"]
            self.assertEqual(locator["pdf_page"], page)
            self.assertEqual(locator["djvu_object_ordinal"], page)
            self.assertEqual(locator["scandata_leaf_num"], page - 1)
            self.assertEqual(locator["ocr_source_sha256"], OCR_SHA256)
            self.assertEqual(locator["page_number_source_sha256"], PAGE_NUMBERS_SHA256)
            self.assertTrue(locator["provider_page_number_untrusted"])
            self.assertTrue(locator["ocr_quarantined"])
            self.assertEqual(row["text_status"], "provider_ocr_quarantined_unreviewed")
            self.assertGreater(locator["image_width"], 0)
            self.assertGreater(locator["image_height"], 0)

    def test_every_ocr_byte_span_and_text_rehash_from_fixed_source(self) -> None:
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

    def test_provider_page_map_is_preserved_but_never_promoted_to_unique_citation(self) -> None:
        page_map = json.loads(PAGE_MAP_PATH.read_text(encoding="utf-8", errors="strict"))
        self.assertEqual(len(page_map["pages"]), 670)
        self.assertEqual(self.packet["structure"]["provider_page_number_discontinuities"], [
            {"previous_leaf": 325, "previous_value": 309, "leaf": 328, "value": 112},
            {"previous_leaf": 332, "previous_value": 116, "leaf": 342, "value": 122},
            {"previous_leaf": 369, "previous_value": 149, "leaf": 370, "value": 350},
        ])
        self.assertEqual(self.packet["passages"][17]["locator"]["visually_confirmed_printed_page"], "1")
        self.assertEqual(self.packet["passages"][391]["locator"]["visually_confirmed_printed_page"], "371")
        self.assertEqual(self.packet["passages"][656]["locator"]["visually_confirmed_printed_page"], "636")
        self.assertFalse(self.packet["completion_denials"]["provider_page_numbers_reliable_as_unique_citations"])

    def test_structural_and_ritual_boundaries_remain_bounded(self) -> None:
        passages = self.packet["passages"]
        expected_roles = {
            2: "title_page",
            3: "marathi_preface",
            18: "first_pariccheda_start",
            94: "first_pariccheda_end",
            96: "second_pariccheda_start",
            247: "second_pariccheda_end",
            248: "third_pariccheda_purvardha_start",
            392: "third_pariccheda_purvardha_end",
            393: "third_pariccheda_uttarardha_start",
            657: "translated_work_end",
            658: "translator_editor_addendum_start",
            669: "translator_editor_addendum_end",
            670: "blank_terminal_leaf",
        }
        for page, role in expected_roles.items():
            self.assertEqual(passages[page - 1]["locator"]["structural_role"], role)
        self.assertEqual(passages[49]["locator"]["ritual_evidence_keys"], ["ganesha_chaturthi"])
        self.assertEqual(passages[51]["locator"]["ritual_evidence_keys"], ["ekadashi"])
        self.assertEqual(passages[177]["locator"]["ritual_evidence_keys"], ["navaratri_durga_puja"])
        self.assertEqual(passages[205]["locator"]["ritual_evidence_keys"], ["vijayadashami"])
        self.assertEqual(passages[215]["locator"]["ritual_evidence_keys"], ["dipavali_lakshmi_puja"])
        self.assertEqual(passages[221]["locator"]["ritual_evidence_keys"], [])
        self.assertIn("निर्णयसिंधु समाप्त", passages[656]["exact_text"])
        self.assertIn("साधारण इतिकतेव्यता समात", passages[668]["exact_text"])

    def test_sql_and_report_are_deterministic_private_and_payload_free(self) -> None:
        self.assertEqual(self.sql.count("insert into public.passages"), 670)
        self.assertEqual(self.sql.count("provider_ocr_quarantined_unreviewed"), 670)
        self.assertNotIn("'published'", self.sql)
        self.assertNotIn("storage.objects", self.sql)
        self.assertTrue(self.sql.isascii(), "SQL transport must remain ASCII-safe")
        self.assertEqual(self.sql, compile_sql(compile_packet(PLAN)))
        report = build_report(self.packet, self.sql, self.batches)
        self.assertEqual(report["result"], "PASS")
        self.assertEqual(report["source_object_count"], 5)
        self.assertEqual(report["source_bytes"], EXPECTED_SOURCE_BYTES)
        self.assertEqual(report["passage_count"], 670)
        self.assertEqual(report["nonempty_ocr_passage_count"], 666)
        self.assertFalse(report["ocr_product_ready"])
        self.assertFalse(report["source_payloads_copied"])


if __name__ == "__main__":
    unittest.main()

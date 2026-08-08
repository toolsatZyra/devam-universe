from __future__ import annotations

import hashlib
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from tools import compile_ganesha_purana_wikisource_ingestion as compiler
from tools.compile_source_vault_tei_ingestion import ROOT, read_verified_object


class GaneshaPuranaWikisourceIngestionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.packet = compiler.compile_packet()

    def test_exact_page_and_chapter_range_coverage(self) -> None:
        passages = self.packet["passages"]
        self.assertEqual(len(passages), 62)
        by_khanda = {"upasana": [], "krida": []}
        for passage in passages:
            locator = passage["locator"]
            by_khanda[locator["khanda"]].extend(
                range(locator["chapter_start"], locator["chapter_end"] + 1)
            )
        self.assertEqual(sorted(by_khanda["upasana"]), list(range(1, 93)))
        self.assertEqual(sorted(by_khanda["krida"]), list(range(1, 156)))
        self.assertEqual(sum(len(values) for values in by_khanda.values()), 247)

    def test_every_passage_rehashes_from_its_exact_revision_content(self) -> None:
        pages: dict[str, dict] = {}
        for source in self.packet["source_objects"]:
            if source["sha256"] == compiler.SITE_RIGHTS_SHA256:
                continue
            payload = json.loads(read_verified_object(source).decode("utf-8"))
            pages.update({page["title"]: page for page in payload["query"]["pages"]})
        self.assertEqual(len(pages), 65)
        for passage in self.packet["passages"]:
            locator = passage["locator"]
            page = pages[locator["provider_page_title"]]
            content = page["revisions"][0]["slots"]["main"]["content"].encode("utf-8")
            start = locator["revision_content_byte_start"]
            end = locator["revision_content_byte_end_exclusive"]
            span = content[start:end]
            self.assertEqual(hashlib.sha256(span).hexdigest(), passage["span_sha256"])
            self.assertEqual(span.decode("utf-8"), passage["exact_text"])
            self.assertEqual(hashlib.sha256(content).hexdigest(), locator["revision_content_sha256"])

    def test_terminal_and_rights_boundaries_are_exact(self) -> None:
        final_upasana = next(
            passage
            for passage in self.packet["passages"]
            if passage["locator"]["khanda"] == "upasana"
            and passage["locator"]["chapter_end"] == 92
        )
        final_krida = next(
            passage
            for passage in self.packet["passages"]
            if passage["locator"]["khanda"] == "krida"
            and passage["locator"]["chapter_end"] == 155
        )
        self.assertIn("उपासना खण्डं समाप्तम्", final_upasana["exact_text"])
        self.assertIn("श्रीगजाननार्पणमस्तु", final_krida["exact_text"])
        self.assertIn("शुभं भवतु", final_krida["exact_text"])
        self.assertEqual(self.packet["rights"]["provider_license_literal"], compiler.LICENSE_LITERAL)
        self.assertTrue(self.packet["rights"]["attribution_required"])
        self.assertTrue(self.packet["rights"]["share_alike_required"])
        self.assertFalse(self.packet["rights"]["internal_1993_scan_product_served"])
        self.assertTrue(all(value is False for value in self.packet["completion_denials"].values()))

    def test_sql_wires_library_search_sarthi_and_atlas_without_internal_scan(self) -> None:
        statements = compiler.compile_sql(self.packet)
        sql = "\n".join(statements)
        self.assertEqual(sum("insert into public.passages" in row for row in statements), 62)
        self.assertIn("ganesha-purana-wikisource-two-khanda-structure-en", sql)
        self.assertIn("insert into public.atlas_nodes", sql)
        self.assertIn("target.slug='ganesha-purana'", sql)
        self.assertNotIn(compiler.INTERNAL_SCAN_SHA256, sql)
        self.assertNotIn("Ganesha_Purana_Nag_Publishers_reprint_1993.pdf", sql)
        self.assertEqual(len(compiler.compile_batches(statements)), 13)

    def test_acquisition_claim_tampering_fails_closed(self) -> None:
        original = json.loads(compiler.ACQUISITION_REPORT.read_text(encoding="utf-8"))
        original["claims"]["all_ganesha_literature_complete"] = True
        with tempfile.TemporaryDirectory(dir=ROOT / "tmp") as directory:
            path = Path(directory) / "tampered-report.json"
            path.write_text(json.dumps(original, ensure_ascii=False), encoding="utf-8")
            tampered_hash = hashlib.sha256(path.read_bytes()).hexdigest()
            with patch.object(compiler, "ACQUISITION_REPORT", path), patch.object(
                compiler, "ACQUISITION_REPORT_SHA256", tampered_hash
            ):
                with self.assertRaisesRegex(ValueError, "claims boundary drift"):
                    compiler.compile_packet()


if __name__ == "__main__":
    unittest.main()

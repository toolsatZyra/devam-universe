from __future__ import annotations

import json
import unittest

from tools.compile_ramcharitmanas_wikisource_product import (
    EXPECTED_CORRECTION_PAGES,
    EXPECTED_PRODUCT_PAGES,
    EXPECTED_PROJECTION_ANOMALIES,
    INGESTION_REPORT,
    PROJECTION_CONTRACT,
    build_report,
    compile_batches,
    compile_packet,
    compile_sql,
    plaintext_projection,
)


class RamcharitmanasWikisourceProductTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.packet = compile_packet()
        cls.batches = compile_batches(compile_sql(cls.packet))

    def test_projection_removes_layout_markup_without_correcting_source(self) -> None:
        raw = (
            '<noinclude><pagequality level="3" user="x" />{{rh|१|शीर्षक|}}</noinclude>'
            '{{block center|<poem>{{larger|\'\'\'राम\'\'\'}}<br>{{sic|मूल|सुधार}}</poem>}}'
            '<noinclude></noinclude>'
        )
        self.assertEqual(plaintext_projection(raw), "राम\nमूल")
        with self.assertRaises(ValueError):
            plaintext_projection("{{unknown|text}}")

    def test_packet_contains_only_qualified_page_passages(self) -> None:
        self.assertEqual(len(self.packet["passages"]), EXPECTED_PRODUCT_PAGES)
        self.assertEqual(len(self.packet["source_objects"]), 26)
        self.assertEqual(self.packet["scope"]["correction_required_page_count"], EXPECTED_CORRECTION_PAGES)
        self.assertEqual(self.packet["scope"]["projection_anomaly_count"], EXPECTED_PROJECTION_ANOMALIES)
        pages = [row["locator"]["scan_page"] for row in self.packet["passages"]]
        self.assertEqual(len(pages), len(set(pages)))
        self.assertTrue(all(52 <= page <= 1223 for page in pages))
        self.assertTrue(all(row["locator"]["proofread_page_quality_level"] in (3, 4) for row in self.packet["passages"]))
        self.assertTrue(all(row["locator"]["projection_contract"] == PROJECTION_CONTRACT for row in self.packet["passages"]))
        self.assertTrue(all(row["locator"]["printed_page_number_inferred"] is False for row in self.packet["passages"]))

    def test_every_sopana_is_searchable_but_completion_stays_false(self) -> None:
        self.assertEqual({row["locator"]["sopana_ordinal"] for row in self.packet["passages"]}, set(range(1, 8)))
        self.assertTrue(all(value is False for value in self.packet["completion_denials"].values()))
        self.assertFalse(self.packet["source_payloads_copied_into_app"])
        self.assertIn("359", self.packet["work"]["summary"])
        self.assertIn("11", self.packet["work"]["summary"])

    def test_sql_is_bounded_and_does_not_claim_database_application(self) -> None:
        self.assertGreater(len(self.batches), 1)
        sql = "\n".join(self.batches)
        self.assertEqual(sql.count("insert into public.passages"), EXPECTED_PRODUCT_PAGES)
        self.assertNotIn("service_role", sql.casefold())
        report = build_report(self.packet, self.batches)
        self.assertFalse(report["database_applied_by_this_compiler"])
        self.assertEqual(report["published_passage_count"], EXPECTED_PRODUCT_PAGES)
        self.assertEqual(report["quality_counts"], {"3": 797, "4": 5})
        self.assertEqual(report["total_narrative_pages_not_product_indexed"], 370)

    def test_frozen_report_matches_recompiled_report(self) -> None:
        frozen = json.loads(INGESTION_REPORT.read_text(encoding="utf-8"))
        self.assertEqual(frozen, build_report(self.packet, self.batches))


if __name__ == "__main__":
    unittest.main()

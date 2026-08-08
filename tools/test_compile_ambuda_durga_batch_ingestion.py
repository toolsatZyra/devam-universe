from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from tools.compile_ambuda_tei_batch_ingestion import ROOT, compile_packet, compile_sql


PLAN = ROOT / "ingestion" / "plans" / "durga-ambuda-five-stotras-v1.json"


class AmbudaDurgaBatchCompilerTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.packet = compile_packet(PLAN)
        cls.sql = compile_sql(cls.packet)

    def compile_tampered(self, mutate) -> None:
        plan = json.loads(PLAN.read_text(encoding="utf-8"))
        mutate(plan)
        with tempfile.TemporaryDirectory(dir=PLAN.parent) as temporary:
            path = Path(temporary) / "tampered.json"
            path.write_text(json.dumps(plan, ensure_ascii=False), encoding="utf-8")
            with self.assertRaises(ValueError):
                compile_packet(path)

    def test_exact_batch_universe_and_scope(self) -> None:
        self.assertEqual(self.packet["coverage_theme"], "durga")
        self.assertEqual(self.packet["work_count"], 5)
        self.assertEqual(self.packet["source_object_count"], 10)
        self.assertEqual(self.packet["passage_count"], 132)
        self.assertFalse(self.packet["broad_durga_coverage_complete"])
        self.assertFalse(self.packet["mvp_library_complete"])
        self.assertEqual(
            {work["slug"]: work["passage_count"] for work in self.packet["works"]},
            {
                "bhavanibhujangam": 17,
                "bhramarambashtakam": 9,
                "devibhujangastotram": 28,
                "devicatuhshashtyupacarapujastotram": 72,
                "lalitapancaratnam": 6,
            },
        )
        self.assertTrue(all("shakta" in work["tradition_scope"] for work in self.packet["works"]))

    def test_source_objects_and_passages_are_exact_and_distinct(self) -> None:
        hashes = [source["sha256"] for work in self.packet["works"] for source in work["source_objects"]]
        self.assertEqual(len(hashes), len(set(hashes)))
        for work in self.packet["works"]:
            passages = work["passages"]
            self.assertEqual([row["source_ordinal"] for row in passages], list(range(1, len(passages) + 1)))
            self.assertEqual([row["locator"]["literal_marker"] for row in passages], [str(i) for i in range(1, len(passages) + 1)])
            self.assertTrue(work["structure"]["terminal_formula_observed"])
            self.assertIn("structure_authority_unresolved", work["structure"]["completeness_status"])

    def test_rights_and_product_boundaries(self) -> None:
        self.assertEqual(self.packet["rights"]["license"], "CC0-1.0")
        self.assertTrue(all(row["cc0_literal_present"] for row in self.packet["live_rights_observations"]))
        self.assertTrue(all(work["structure"]["publication_state"] == "review" for work in self.packet["works"]))
        self.assertIn("not represented as a universal", next(work for work in self.packet["works"] if work["slug"] == "devicatuhshashtyupacarapujastotram")["summary"])
        self.assertIn("'local_vault', null", self.sql)
        self.assertNotIn("supabase_storage", self.sql)
        self.assertNotIn("'published'", self.sql)

    def test_tampered_counts_scope_and_live_rights_fail_closed(self) -> None:
        self.compile_tampered(lambda plan: plan["expected_counts"].__setitem__("passage_count", 131))
        self.compile_tampered(lambda plan: plan.__setitem__("required_tradition_scope_member", "ganesha"))
        self.compile_tampered(lambda plan: plan["live_rights_observations"][0].__setitem__("cc0_literal_present", False))


if __name__ == "__main__":
    unittest.main()

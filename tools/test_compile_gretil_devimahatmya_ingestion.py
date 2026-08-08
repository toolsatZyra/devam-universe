from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from tools.compile_gretil_devimahatmya_ingestion import ROOT, compile_packet, compile_sql


PLAN = ROOT / "ingestion" / "plans" / "durga-markandeya-purana-devimahatmya-v1.json"


class DeviMahatmyaCompilerTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.packet = compile_packet(PLAN)
        cls.sql = compile_sql(cls.packet)

    def tampered_fails(self, mutate) -> None:
        plan = json.loads(PLAN.read_text(encoding="utf-8"))
        mutate(plan)
        with tempfile.TemporaryDirectory(dir=PLAN.parent) as directory:
            path = Path(directory) / "tampered.json"
            path.write_text(json.dumps(plan, ensure_ascii=False), encoding="utf-8")
            with self.assertRaises(ValueError):
                compile_packet(path)

    def test_exact_source_and_embedded_chapter_universe(self) -> None:
        self.assertEqual(self.packet["source_object_count"], 3)
        self.assertEqual(self.packet["passage_count"], 13)
        self.assertEqual([row["chapter"] for row in self.packet["passages"]], list(range(81, 94)))
        self.assertEqual(self.packet["passages"][5]["locator"]["literal_reference_gap"], [6])
        self.assertTrue(all(a["locator"]["byte_end_exclusive"] <= b["locator"]["byte_start"] for a, b in zip(self.packet["passages"], self.packet["passages"][1:])))

    def test_sql_remains_internal_reference_only_and_review_only(self) -> None:
        self.assertIn("'local_vault', null", self.sql)
        self.assertNotIn("supabase_storage", self.sql)
        self.assertIn("'private_evidence'", self.sql)
        self.assertNotIn("'published'", self.sql)
        self.assertIn("is_source_original=false", self.sql)

    def test_tampered_source_hash_fails(self) -> None:
        self.tampered_fails(lambda plan: plan["source_objects"][0].__setitem__("sha256", "0" * 64))

    def test_tampered_chapter_profile_fails(self) -> None:
        self.tampered_fails(lambda plan: plan["structure"]["chapter_profiles"][5].__setitem__("missing_references", []))

    def test_tampered_rights_lane_fails(self) -> None:
        self.tampered_fails(lambda plan: plan["rights"].__setitem__("lane", "derivative_allowed"))


if __name__ == "__main__":
    unittest.main()

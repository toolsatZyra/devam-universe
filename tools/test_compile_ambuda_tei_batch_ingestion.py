from __future__ import annotations

import copy
import json
import tempfile
import unittest
from pathlib import Path

from tools.compile_ambuda_tei_batch_ingestion import (
    EXPECTED_PASSAGE_COUNT,
    EXPECTED_SOURCE_COUNT,
    EXPECTED_WORK_COUNT,
    ROOT,
    compile_packet,
    compile_sql,
)


PLAN = ROOT / "ingestion" / "plans" / "ganesha-ambuda-seven-hymns-v1.json"


class AmbudaBatchCompilerTest(unittest.TestCase):
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

    def test_exact_batch_universe(self) -> None:
        self.assertEqual(self.packet["work_count"], EXPECTED_WORK_COUNT)
        self.assertEqual(self.packet["source_object_count"], EXPECTED_SOURCE_COUNT)
        self.assertEqual(self.packet["passage_count"], EXPECTED_PASSAGE_COUNT)
        self.assertEqual(
            [work["passage_count"] for work in self.packet["works"]],
            [9, 6, 13, 10, 8, 9, 25],
        )
        hashes = [source["sha256"] for work in self.packet["works"] for source in work["source_objects"]]
        self.assertEqual(len(hashes), len(set(hashes)))

    def test_literal_markers_and_boundaries(self) -> None:
        for work in self.packet["works"]:
            passages = work["passages"]
            self.assertEqual([row["source_ordinal"] for row in passages], list(range(1, len(passages) + 1)))
            self.assertEqual([row["locator"]["literal_marker"] for row in passages], [str(i) for i in range(1, len(passages) + 1)])
            self.assertTrue(all(a["locator"]["byte_end_exclusive"] <= b["locator"]["byte_start"] for a, b in zip(passages, passages[1:])))

    def test_provider_and_tei_identity_mismatch_is_preserved(self) -> None:
        part_two = next(work for work in self.packet["works"] if work["slug"] == "shriganeshashtakam-2")
        self.assertEqual(part_two["identity"]["text_xml_id"], "shriganeshashtakam")
        self.assertTrue(part_two["identity"]["provider_slug_differs_from_text_xml_id"])
        self.assertEqual(part_two["identity"]["access_title"], "श्रीगणेशाष्टकम् (२)")
        self.assertNotEqual(part_two["identity"]["access_title"], part_two["identity"]["main_title"])

    def test_sql_is_reference_only_review_only_and_not_source_original(self) -> None:
        self.assertIn("'local_vault', null", self.sql)
        self.assertNotIn("supabase_storage", self.sql)
        self.assertNotIn("'published'", self.sql)
        self.assertEqual(self.sql.count("false, false, 'derivative_allowed', 'review'"), EXPECTED_WORK_COUNT)

    def test_tampered_work_title_fails_closed(self) -> None:
        self.compile_tampered(lambda plan: plan["works"][0]["identity"].__setitem__("main_title", "tampered"))

    def test_tampered_rights_fails_closed(self) -> None:
        self.compile_tampered(lambda plan: plan["rights"].__setitem__("license", "unknown"))

    def test_tampered_object_hash_fails_closed(self) -> None:
        self.compile_tampered(lambda plan: plan["works"][0]["source_objects"][0].__setitem__("sha256", "0" * 64))


if __name__ == "__main__":
    unittest.main()

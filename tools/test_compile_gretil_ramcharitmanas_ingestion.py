from __future__ import annotations

import json
import tempfile
import unittest
from collections import defaultdict
from pathlib import Path

from tools.compile_gretil_ramcharitmanas_ingestion import (
    ROOT,
    compile_batches,
    compile_packet,
    compile_sql,
    passage_root,
)
from tools.compile_source_vault_tei_ingestion import sha256_bytes


PLAN = ROOT / "ingestion" / "plans" / "ramcharitmanas-gretil-ratlam-v1.json"


class GretilRamcharitmanasCompilerTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.packet = compile_packet(PLAN)
        cls.sql = compile_sql(cls.packet)
        cls.batches = compile_batches(cls.packet)
        cls.source_bytes = {
            row["sha256"]: (ROOT / "source_vault" / row["object_path"]).read_bytes()
            for row in cls.packet["source_objects"]
        }

    def tampered_fails(self, mutate) -> None:
        plan = json.loads(PLAN.read_text(encoding="utf-8"))
        mutate(plan)
        with tempfile.TemporaryDirectory(dir=PLAN.parent) as directory:
            path = Path(directory) / "tampered.json"
            path.write_text(json.dumps(plan, ensure_ascii=False), encoding="utf-8")
            with self.assertRaises(ValueError):
                compile_packet(path)

    def test_exact_seven_part_structure(self) -> None:
        self.assertEqual(self.packet["source_object_count"], 7)
        self.assertEqual(sum(row["bytes"] for row in self.packet["source_objects"]), 1046633)
        self.assertEqual(self.packet["passage_count"], 2540)
        self.assertEqual(self.packet["structure"]["literal_number_marker_count"], 1343)
        self.assertEqual([row["passage_count"] for row in self.packet["structure"]["part_profiles"]], [824, 665, 125, 67, 133, 333, 393])

    def test_every_span_rehashes_and_ordinals_are_source_relative(self) -> None:
        grouped = defaultdict(list)
        for passage in self.packet["passages"]:
            grouped[passage["part"]].append(passage)
            locator = passage["locator"]
            data = self.source_bytes[passage["source_sha256"]]
            self.assertEqual(sha256_bytes(data[locator["byte_start"]:locator["byte_end_exclusive"]]), passage["span_sha256"])
            self.assertFalse(locator["literal_markers_are_unique_ids"])
        for part, rows in grouped.items():
            self.assertEqual([row["source_ordinal"] for row in rows], list(range(1, len(rows) + 1)), part)

    def test_all_seven_closures_and_trailing_aarti_are_distinct(self) -> None:
        profiles = self.packet["structure"]["part_profiles"]
        grouped = defaultdict(list)
        for row in self.packet["passages"]:
            grouped[row["part"]].append(row)
        for profile in profiles:
            closure = grouped[profile["part"]][profile["closure_passage_ordinal"] - 1]
            self.assertIn(profile["terminal_literal"], closure["exact_text"])
            self.assertEqual(closure["locator"]["structural_role"], "sopana_closure")
        self.assertEqual(grouped[7][389]["locator"]["structural_role"], "trailing_aarti")
        self.assertTrue(grouped[7][389]["exact_text"].startswith("ārati śrīrāmāyanajī kī"))

    def test_sql_is_reference_only_private_review_evidence(self) -> None:
        self.assertIn("'local_vault', null", self.sql)
        self.assertNotIn("supabase_storage", self.sql)
        self.assertNotIn("'published'", self.sql)
        self.assertIn("is_source_original=false", self.sql)
        self.assertIn("convert_from(decode(", self.sql)
        self.assertTrue(all(value is False for value in self.packet["completion_denials"].values()))

    def test_packet_roots_and_adaptive_batches_are_deterministic(self) -> None:
        self.assertEqual(self.packet["packet_sha256"], compile_packet(PLAN)["packet_sha256"])
        self.assertEqual(passage_root(self.packet), passage_root(compile_packet(PLAN)))
        self.assertGreater(len(self.batches), 100)
        self.assertTrue(all(batch.startswith("begin;") and batch.endswith("commit;\n") for batch in self.batches))

    def test_tampered_identity_rights_structure_or_route_fails_closed(self) -> None:
        self.tampered_fails(lambda plan: plan["rights"].__setitem__("lane", "product_allowed"))
        self.tampered_fails(lambda plan: plan["structure"]["part_profiles"][6].__setitem__("passage_count", 392))
        self.tampered_fails(lambda plan: plan["provider"].__setitem__("legacy_queue_id", "AQ-00000"))
        self.tampered_fails(lambda plan: plan["completion_denials"].__setitem__("mvp_library_complete", True))


if __name__ == "__main__":
    unittest.main()

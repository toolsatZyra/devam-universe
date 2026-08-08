from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from tools.compile_gretil_devigita_ingestion import ROOT, compile_batches, compile_packet, compile_sql, passage_root
from tools.compile_source_vault_tei_ingestion import sha256_bytes


PLAN = ROOT / "ingestion" / "plans" / "devigita-gretil-honegger-v1.json"
TEI = ROOT / "source_vault" / "objects" / "sha256" / "b5" / "b5fd8a711a2b06583f4b4208ee680e06f3d645507b8ccea82ba64b3a4a4fddfe"


class GretilDevigitaCompilerTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.packet = compile_packet(PLAN); cls.sql = compile_sql(cls.packet); cls.batches = compile_batches(cls.packet); cls.tei = TEI.read_bytes()

    def tampered_fails(self, mutate) -> None:
        plan = json.loads(PLAN.read_text(encoding="utf-8")); mutate(plan)
        with tempfile.TemporaryDirectory(dir=PLAN.parent) as directory:
            path = Path(directory) / "tampered.json"; path.write_text(json.dumps(plan, ensure_ascii=False), encoding="utf-8")
            with self.assertRaises(ValueError): compile_packet(path)

    def test_exact_source_and_parent_chapter_universe(self) -> None:
        self.assertEqual(self.packet["source_object_count"], 3); self.assertEqual(sum(r["bytes"] for r in self.packet["source_objects"]), 296605)
        self.assertEqual(self.packet["passage_count"], 559); self.assertEqual(self.packet["structure"]["verse_marker_count"], 510)
        self.assertEqual([r["verse_count"] for r in self.packet["structure"]["chapter_profiles"]], [74, 50, 56, 50, 63, 30, 45, 50, 47, 45])

    def test_all_source_element_spans_rehash(self) -> None:
        self.assertEqual([p["source_ordinal"] for p in self.packet["passages"]], list(range(1, 560)))
        for p in self.packet["passages"]:
            loc = p["locator"]; self.assertEqual(sha256_bytes(self.tei[loc["byte_start"]:loc["byte_end_exclusive"]]), p["span_sha256"])
            self.assertEqual(loc["devibhagavata_chapter"], 30 + loc["devigita_chapter"])

    def test_verse_and_nonverse_roles_preserve_complete_text_children(self) -> None:
        roles = [p["locator"]["structural_role"] for p in self.packet["passages"]]
        self.assertEqual(roles.count("verse_source_element"), 510); self.assertEqual(len(roles) - roles.count("verse_source_element"), 49)
        self.assertIn(self.packet["structure"]["terminal_formula"], self.packet["passages"][-1]["exact_text"])

    def test_sql_is_reference_only_private_review_evidence(self) -> None:
        self.assertIn("'local_vault', null", self.sql); self.assertNotIn("supabase_storage", self.sql); self.assertNotIn("'published'", self.sql)
        self.assertIn("convert_from(decode(", self.sql); self.assertTrue(all(v is False for v in self.packet["completion_denials"].values()))

    def test_packet_and_roots_are_deterministic(self) -> None:
        again = compile_packet(PLAN); self.assertEqual(self.packet["packet_sha256"], again["packet_sha256"])
        self.assertEqual(passage_root(self.packet), passage_root(again)); self.assertGreater(len(self.batches), 20)

    def test_tampered_rights_identity_structure_or_route_fails(self) -> None:
        self.tampered_fails(lambda p: p["rights"].__setitem__("lane", "product_allowed"))
        self.tampered_fails(lambda p: p["identity"].__setitem__("parent_chapter_end", 41))
        self.tampered_fails(lambda p: p["structure"]["chapter_profiles"][9].__setitem__("verse_count", 44))
        self.tampered_fails(lambda p: p["provider"].__setitem__("legacy_queue_id", "AQ-00000"))


if __name__ == "__main__": unittest.main()

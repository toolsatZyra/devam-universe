from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from tools.compile_gretil_bhagavadgita_four_commentaries_ingestion import (
    ROOT,
    compile_batches,
    compile_packet,
    compile_sql,
    passage_root,
)
from tools.compile_source_vault_tei_ingestion import sha256_bytes


PLAN = ROOT / "ingestion" / "plans" / "bhagavadgita-gretil-four-commentaries-v1.json"
TEI = ROOT / "source_vault" / "objects" / "sha256" / "e1" / "e10352273ea29958205dbc72b7b81a0df95eb3623a0b6439141e3e2a2d54b505"


class GretilBhagavadgitaFourCommentariesCompilerTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.packet = compile_packet(PLAN)
        cls.sql = compile_sql(cls.packet)
        cls.batches = compile_batches(cls.packet)
        cls.tei = TEI.read_bytes()

    def tampered_fails(self, mutate) -> None:
        plan = json.loads(PLAN.read_text(encoding="utf-8"))
        mutate(plan)
        with tempfile.TemporaryDirectory(dir=PLAN.parent) as directory:
            path = Path(directory) / "tampered.json"
            path.write_text(json.dumps(plan, ensure_ascii=False), encoding="utf-8")
            with self.assertRaises(ValueError):
                compile_packet(path)

    def test_exact_three_representation_reference_only_universe(self) -> None:
        self.assertEqual(self.packet["source_object_count"], 3)
        self.assertEqual(sum(row["bytes"] for row in self.packet["source_objects"]), 6_474_059)
        self.assertEqual({row["role"] for row in self.packet["source_objects"]}, {"canonical_tei", "access_text", "access_html"})

    def test_all_636_div_spans_rehash_and_preserve_special_units(self) -> None:
        passages = self.packet["passages"]
        self.assertEqual([row["source_ordinal"] for row in passages], list(range(1, 637)))
        for row in passages:
            locator = row["locator"]
            self.assertEqual(
                sha256_bytes(self.tei[locator["byte_start"]:locator["byte_end_exclusive"]]),
                row["span_sha256"],
            )
        self.assertEqual(passages[437]["locator"], {
            "contract": "DEVAM_GRETIL_TEI_DIV_BYTE_SPAN_V1",
            "structural_role": "verse_commentary_unit_marker_anomaly",
            "literal_marker": "Verses6-7",
            "marker_status": "chapter_context_inferred_from_bounding_source_order",
            "chapter": 12,
            "verse_start": 6,
            "verse_end": 7,
            "commentary_labels_observed": ["sridhara", "madhusudana", "visvanatha", "baladeva"],
            "byte_start": 1_471_562,
            "byte_end_exclusive": 1_477_586,
            "line_start": 12_483,
            "line_end": 12_529,
        })
        self.assertEqual(passages[474]["locator"]["structural_role"], "endnote_unit")
        self.assertEqual(passages[635]["locator"]["structural_role"], "empty_terminal_div")
        self.assertEqual(passages[635]["exact_text"], "")

    def test_marker_anomalies_and_explicit_commentary_deficit_remain_fail_closed(self) -> None:
        structure = self.packet["structure"]
        self.assertEqual(structure["expanded_literal_marker_count"], 684)
        self.assertEqual(structure["standard_bhg_marker_unit_count"], 633)
        self.assertEqual(structure["explicit_commentary_deficit"]["verse_range"], "18.74-18.78")
        self.assertEqual(structure["chapter_profiles"][0]["duplicate_literal_marker_numbers"], [21, 22, 23])
        self.assertEqual(structure["chapter_profiles"][12]["missing_literal_marker_numbers"], [13, 15, 16, 17, 35])
        self.assertTrue(all(value is False for value in self.packet["completion_denials"].values()))

    def test_sql_builds_private_graph_and_server_only_exact_index_without_copying_payloads(self) -> None:
        self.assertIn("'bhagavad-gita', 'scripture'", self.sql)
        self.assertIn("'mahabharata', 'epic'", self.sql)
        self.assertIn("'part_of'", self.sql)
        self.assertIn("insert into public.passages", self.sql)
        self.assertIn("'local_vault', null", self.sql)
        self.assertNotIn("supabase_storage", self.sql)
        self.assertNotIn("grant execute", self.sql.lower())
        self.assertNotIn("'published'", self.sql)
        self.assertGreater(len(self.batches), 20)

    def test_packet_sql_and_passage_roots_are_deterministic(self) -> None:
        again = compile_packet(PLAN)
        self.assertEqual(self.packet["packet_sha256"], "86eecb307effc8fb03c32888596f2b0c3538e325d41fa92c5281e9e9de3974f3")
        self.assertEqual(sha256_bytes(self.sql.encode()), "322d537984582ef053cbea8578286cde5dc732c3e82fd6b11da5ad00ee7fb911")
        self.assertEqual(passage_root(self.packet), "7d0b5406bb981603d328d82fa9694bc5cf7a975f7253faf66497d12c0d211f35")
        self.assertEqual(self.packet["packet_sha256"], again["packet_sha256"])
        self.assertEqual(sha256_bytes(self.sql.encode()), sha256_bytes(compile_sql(again).encode()))
        self.assertEqual(passage_root(self.packet), passage_root(again))

    def test_tampered_route_rights_structure_or_deficit_fails(self) -> None:
        self.tampered_fails(lambda plan: plan["provider"].__setitem__("provider_item_id", "GRE-00077"))
        self.tampered_fails(lambda plan: plan["rights"].__setitem__("lane", "product_allowed"))
        self.tampered_fails(lambda plan: plan["structure"]["chapter_profiles"][12].__setitem__("missing_literal_marker_numbers", []))
        self.tampered_fails(lambda plan: plan["structure"]["explicit_commentary_deficit"].__setitem__("verse_range", ""))


if __name__ == "__main__":
    unittest.main()

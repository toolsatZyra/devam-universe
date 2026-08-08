from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from tools.compile_gretil_ramayana_ingestion import (
    ROOT,
    compile_batches,
    compile_packet,
    compile_sql,
    passage_root,
)
from tools.compile_source_vault_tei_ingestion import sha256_bytes


PLAN = ROOT / "ingestion" / "plans" / "ramayana-gretil-tokunaga-smith-v1.json"
TEI = ROOT / "source_vault" / "objects" / "sha256" / "a5" / "a569551e8a972935d540bc53e57effa919868367234ab3b5334d07a1e7f84901"


class GretilRamayanaCompilerTest(unittest.TestCase):
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

    def test_exact_packet_and_seven_kanda_structure(self) -> None:
        self.assertEqual(self.packet["packet_sha256"], "8c098135b883469878f1fa747b1aba4129ac63219238a1b8ed7ee88b1735cc34")
        self.assertEqual(self.packet["source_object_count"], 3)
        self.assertEqual(self.packet["passage_count"], 606)
        self.assertEqual(self.packet["structure"]["verse_group_count"], 18761)
        self.assertEqual([row["sarga_count"] for row in self.packet["structure"]["book_profiles"]], [76, 111, 71, 66, 66, 116, 100])
        self.assertEqual(len(self.batches), 149)

    def test_every_sarga_span_rehashes_and_literal_sequences_are_contiguous(self) -> None:
        self.assertEqual([row["source_ordinal"] for row in self.packet["passages"]], list(range(1, 607)))
        previous = -1
        for row in self.packet["passages"]:
            locator = row["locator"]
            self.assertGreater(locator["byte_start"], previous)
            self.assertEqual(sha256_bytes(self.tei[locator["byte_start"]:locator["byte_end_exclusive"]]), row["span_sha256"])
            self.assertEqual(locator["verse_sequence_status"], "literal_ids_contiguous")
            previous = locator["byte_end_exclusive"]
        self.assertEqual(passage_root(self.packet), "054bb80efe4c31a477f35f6c335de9c26140445c282df503891019f755b421ca")
        self.assertEqual(passage_root(self.packet, include_locator=False), "e244d2cc2257598d017b1602c053aaab87e1aeac04e64974bbfc9e400e427f1a")

    def test_dcs_source_is_bound_but_not_merged(self) -> None:
        related = self.packet["related_dcs_source"]
        self.assertEqual(related["dcs_verse_id_count"], 18713)
        self.assertEqual(related["gretil_additional_verse_id_count"], 48)
        self.assertEqual(related["dcs_source_order_anomaly_count"], 3)
        self.assertEqual(related["relationship"], "separate_current_ambuda_dcs_source_do_not_merge")

    def test_sql_is_reference_only_private_review_evidence(self) -> None:
        self.assertIn("'local_vault', null", self.sql)
        self.assertNotIn("supabase_storage", self.sql)
        self.assertNotIn("'published'", self.sql)
        self.assertIn("is_source_original=false", self.sql)
        self.assertEqual(self.sql.count("'private_evidence'"), 613)

    def test_all_broad_completion_claims_remain_false(self) -> None:
        self.assertTrue(all(value is False for value in self.packet["completion_denials"].values()))
        self.assertFalse(self.packet["identity"]["underlying_print_edition_identified"])

    def test_tampered_rights_structure_or_dcs_fails_closed(self) -> None:
        self.tampered_fails(lambda plan: plan["rights"].__setitem__("lane", "product_allowed"))
        self.tampered_fails(lambda plan: plan["structure"]["book_profiles"][6].__setitem__("sarga_count", 99))
        self.tampered_fails(lambda plan: plan["related_dcs_source"].__setitem__("gretil_additional_verse_id_count", 0))


if __name__ == "__main__":
    unittest.main()

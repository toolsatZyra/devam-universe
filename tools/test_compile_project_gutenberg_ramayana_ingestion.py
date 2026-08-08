from __future__ import annotations

import collections
import json
import tempfile
import unittest
from pathlib import Path

from tools.compile_project_gutenberg_ramayana_ingestion import (
    ROOT,
    compile_batches,
    compile_packet,
    compile_sql,
    passage_root,
)
from tools.compile_source_vault_tei_ingestion import sha256_bytes


PLAN = ROOT / "ingestion" / "plans" / "ramayana-griffith-project-gutenberg-v1.json"
TEI = ROOT / "source_vault" / "objects" / "sha256" / "1f" / "1fa8d3e9da23d83abd334661db3a95574bfd6290943441c374d9bce4ef142ed9"


class ProjectGutenbergRamayanaCompilerTest(unittest.TestCase):
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

    def test_exact_packet_and_carrier_universe(self) -> None:
        self.assertEqual(self.packet["packet_sha256"], "80a64ddf9897573f450783db885f3e434ef5d1e3f8672512c070aec512cfbf2f")
        self.assertEqual(self.packet["carrier_census"]["record_count"], 600)
        self.assertEqual(self.packet["carrier_census"]["unique_sha256_count"], 600)
        self.assertEqual(self.packet["carrier_census"]["total_bytes"], 124221436)
        self.assertEqual(self.packet["source_object_count"], 6)
        self.assertEqual(self.packet["passage_count"], 560)
        self.assertEqual(len(self.batches), 118)

    def test_structure_unit_counts_and_literal_numbering_gaps(self) -> None:
        kinds = collections.Counter(row["locator"]["unit_kind"] for row in self.packet["passages"])
        self.assertEqual(kinds, collections.Counter({
            "canto": 493,
            "additional_note": 57,
            "appendix_section": 5,
            "front_matter": 2,
            "invocation": 1,
            "index": 1,
            "footnotes": 1,
        }))
        self.assertEqual(
            [row["missing_literal_numbers"] for row in self.packet["structure"]["book_profiles"]],
            [[37, 38], [], [], [], [5, 28, 29, 39, 40, 59, 60, 61, 62, 63, 64], [55, 56, 57, 58, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 94, 95, 97, 98, 99, 104, 105, 107]],
        )

    def test_every_passage_rehashes_from_the_exact_source_span(self) -> None:
        self.assertEqual([row["source_ordinal"] for row in self.packet["passages"]], list(range(1, 561)))
        previous_end = -1
        for row in self.packet["passages"]:
            locator = row["locator"]
            start = locator["byte_start"]
            end = locator["byte_end_exclusive"]
            self.assertGreater(start, previous_end)
            self.assertEqual(sha256_bytes(self.tei[start:end]), row["span_sha256"])
            previous_end = end
        self.assertEqual(passage_root(self.packet), "e0c62543a911092244d9ec03d413cca178b968cd99de2b9fe8f10d261cebe5d4")

    def test_sql_remains_reference_only_private_and_review_only(self) -> None:
        self.assertIn("'local_vault', null", self.sql)
        self.assertNotIn("supabase_storage", self.sql)
        self.assertNotIn("'published'", self.sql)
        self.assertIn("is_source_original=false", self.sql)
        self.assertEqual(self.sql.count("'private_evidence'"), 570)

    def test_all_broad_completion_claims_remain_false(self) -> None:
        self.assertTrue(self.packet["completion_denials"])
        self.assertTrue(all(value is False for value in self.packet["completion_denials"].values()))
        self.assertIn("I have omitted none of the action", self.packet["structure"]["book_five_omission_literal"])

    def test_tampered_carrier_census_fails_closed(self) -> None:
        self.tampered_fails(lambda plan: plan["carrier_census"].__setitem__("record_count", 599))

    def test_tampered_rights_or_structure_fails_closed(self) -> None:
        self.tampered_fails(lambda plan: plan["rights"].__setitem__("lane", "product_allowed"))
        self.tampered_fails(lambda plan: plan["structure"]["book_profiles"][4].__setitem__("missing_literal_numbers", []))


if __name__ == "__main__":
    unittest.main()

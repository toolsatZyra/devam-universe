from __future__ import annotations

import json
import collections
import re
import tempfile
import unittest
from pathlib import Path

from tools.compile_ambuda_dcs_ramayana_ingestion import (
    ROOT,
    compile_batches,
    compile_packet,
    compile_sql,
    passage_root,
    report,
)
from tools.compile_source_vault_tei_ingestion import sha256_bytes


PLAN = ROOT / "ingestion" / "plans" / "ramayana-ambuda-dcs-product-v1.json"
SOURCE = ROOT / "source_vault" / "objects" / "sha256" / "f8" / "f8d45c1289b15182867bd0c94d15886f8d8b1b10c4e7fc9a9b6a78fd5142e3b8"


class AmbudaDcsRamayanaCompilerTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.packet = compile_packet(PLAN)
        cls.sql = compile_sql(cls.packet)
        cls.batches = compile_batches(cls.packet)
        cls.report = report(cls.packet)
        cls.source = SOURCE.read_bytes()

    def tampered_fails(self, mutate) -> None:
        plan = json.loads(PLAN.read_text(encoding="utf-8"))
        mutate(plan)
        with tempfile.TemporaryDirectory(dir=PLAN.parent) as directory:
            path = Path(directory) / "tampered.json"
            path.write_text(json.dumps(plan, ensure_ascii=False), encoding="utf-8")
            with self.assertRaises(ValueError):
                compile_packet(path)

    def test_exact_product_packet_and_seven_kanda_structure(self) -> None:
        self.assertEqual(self.packet["packet_sha256"], "a74dacd012bf920627dd40c6f475fac531c919fd40b998820d40fc1c55ec8aed")
        self.assertEqual(self.report["sql_sha256"], "f5afcb32e4fd72dfc5d7b3ccd4e1f484cfff4eb052d445592b77966bd04f98d0")
        self.assertEqual(self.packet["source_object_count"], 2)
        self.assertEqual(self.packet["passage_count"], 606)
        self.assertEqual(self.packet["structure"]["verse_record_count"], 18713)
        self.assertEqual(self.packet["structure"]["token_line_count"], 250660)
        self.assertEqual([row["sarga_count"] for row in self.packet["structure"]["book_profiles"]], [76, 111, 71, 66, 66, 116, 100])
        self.assertEqual(len(self.batches), 137)

    def test_every_sarga_span_rehashes_and_projection_is_stable(self) -> None:
        self.assertEqual([row["source_ordinal"] for row in self.packet["passages"]], list(range(1, 607)))
        previous = 0
        for row in self.packet["passages"]:
            locator = row["locator"]
            self.assertEqual(locator["byte_start"], previous)
            self.assertEqual(
                sha256_bytes(self.source[locator["byte_start"]:locator["byte_end_exclusive"]]),
                row["span_sha256"],
            )
            self.assertEqual(locator["projection_contract"], "DEVAM_DCS_SARGA_SURFACE_PROJECTION_V1")
            self.assertTrue(row["exact_text"].splitlines()[0].startswith(locator["first_source_record_id"] + " "))
            previous = locator["byte_end_exclusive"]
        self.assertEqual(passage_root(self.packet), "28da24e57a8c9e1dfd9f7c096254d40130582621a3c163254e64a4e64a8718df")
        self.assertEqual(passage_root(self.packet, include_locator=False), "5960a0bbd19dc0308e6075c18c906179408a8d1109f1a864e9cb6163cbd61460")
        self.assertEqual(self.packet["record_span_root_sha256"], "0e216e6781636fe6d34c1aaf2d19ccee36527c0df80c9568ad8be4b5db284ba9")

    def test_all_literal_gaps_and_order_anomalies_are_exposed(self) -> None:
        structure = self.packet["structure"]
        self.assertEqual(len(structure["literal_missing_verse_ids"]), 46)
        self.assertEqual(sum(len(row["locator"]["literal_missing_verse_ids"]) for row in self.packet["passages"]), 46)
        self.assertEqual(structure["source_order_anomalies"], [
            {"source_pair_ordinal": 8513, "left": "R.4.42.17", "right": "R.4.42.14"},
            {"source_pair_ordinal": 8517, "left": "R.4.42.23", "right": "R.4.42.18"},
            {"source_pair_ordinal": 15493, "left": "R.6.101.40", "right": "R.6.101.29"},
        ])
        self.assertEqual(sum(len(row["locator"]["source_order_anomalies"]) for row in self.packet["passages"]), 3)

    def test_independent_raw_reconstruction_matches_frozen_structure(self) -> None:
        text = self.source.decode("utf-8", errors="strict")
        matches = re.findall(r"^# id = (R\.(\d+)\.(\d+)\.(\d+))$", text, re.MULTILINE)
        ids = [row[0] for row in matches]
        tuples = [(int(row[1]), int(row[2]), int(row[3])) for row in matches]
        self.assertEqual(len(ids), 18713)
        self.assertEqual(len(set(ids)), 18713)
        self.assertEqual(sha256_bytes("\n".join(ids).encode("utf-8")), "e029ab682e3edeac03c26ff29eb51b1dbdd20803ec55f9a599f17e18ff068e95")
        token_lines = [line for line in text.splitlines() if line and not line.startswith("# id = ")]
        self.assertEqual(len(token_lines), 250660)
        self.assertTrue(all(len(line.split("\t")) == 3 for line in token_lines))
        grouped: collections.OrderedDict[tuple[int, int], list[int]] = collections.OrderedDict()
        for book, sarga, verse in tuples:
            grouped.setdefault((book, sarga), []).append(verse)
        missing = [
            f"R.{book}.{sarga}.{verse}"
            for (book, sarga), verses in grouped.items()
            for verse in range(1, max(verses) + 1)
            if verse not in set(verses)
        ]
        self.assertEqual(missing, self.packet["structure"]["literal_missing_verse_ids"])
        anomalies = [
            {"source_pair_ordinal": ordinal, "left": ids[ordinal - 1], "right": ids[ordinal]}
            for ordinal, (left, right) in enumerate(zip(tuples, tuples[1:]), start=1)
            if right <= left
        ]
        self.assertEqual(anomalies, self.packet["structure"]["source_order_anomalies"])

    def test_sql_is_reference_only_product_compatible_and_deterministic(self) -> None:
        self.assertIn("'local_vault', null", self.sql)
        self.assertNotIn("supabase_storage", self.sql)
        self.assertNotIn("'private_evidence'", self.sql)
        self.assertIn("'product_allowed'", self.sql)
        self.assertIn("'published'", self.sql)
        self.assertEqual(self.sql.count("insert into public.passages"), 606)
        self.assertEqual(self.batches, compile_batches(self.packet))
        self.assertFalse(self.report["source_payloads_copied"])

    def test_rights_identity_and_all_broad_claims_remain_bounded(self) -> None:
        self.assertEqual(self.packet["rights"]["license"], "CC-BY-4.0")
        self.assertEqual(self.packet["rights"]["lane"], "product_allowed")
        self.assertFalse(self.packet["identity"]["underlying_print_or_manuscript_edition_identified"])
        self.assertTrue(all(value is False for value in self.packet["completion_denials"].values()))
        self.assertIn("not_gap_free", self.packet["structure"]["edition_completeness_status"])

    def test_tampered_rights_structure_projection_or_denials_fail_closed(self) -> None:
        self.tampered_fails(lambda plan: plan["rights"].__setitem__("lane", "private_evidence"))
        self.tampered_fails(lambda plan: plan["structure"].__setitem__("verse_record_count", 18714))
        self.tampered_fails(lambda plan: plan["structure"]["literal_missing_verse_ids"].pop())
        self.tampered_fails(lambda plan: plan["structure"]["source_order_anomalies"][0].__setitem__("right", "R.4.42.15"))
        self.tampered_fails(lambda plan: plan["projection"].__setitem__("contract", "UNSAFE"))
        self.tampered_fails(lambda plan: plan["completion_denials"].__setitem__("critical_edition", True))


if __name__ == "__main__":
    unittest.main()

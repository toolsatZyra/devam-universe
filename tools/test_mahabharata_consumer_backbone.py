from __future__ import annotations

import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PACK_PATH = ROOT / "knowledge_packs" / "inventories" / "mahabharata-consumer-backbone-v1.json"
REPORT_PATH = ROOT / "ingestion" / "reports" / "mahabharata-kisari-mohan-ganguli-project-gutenberg-source-qualification-v1.json"


class MahabharataConsumerBackboneTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.pack = json.loads(PACK_PATH.read_text(encoding="utf-8"))
        cls.report = json.loads(REPORT_PATH.read_text(encoding="utf-8"))

    def test_expected_consumer_architecture(self) -> None:
        self.assertEqual("DEVAM_MAHABHARATA_CONSUMER_BACKBONE_V1", self.pack["contract"])
        self.assertEqual(12, len(self.pack["arcs"]))
        self.assertEqual(77, len(self.pack["turns"]))
        self.assertEqual(12, self.pack["architecture"]["arc_count"])
        self.assertEqual(77, self.pack["architecture"]["backbone_turn_count"])
        self.assertIn("pending", self.pack["architecture"]["current_state"])
        self.assertFalse(self.pack["source_qualification"]["harivamsha_included"])

    def test_every_fixed_source_unit_is_partitioned_exactly_once(self) -> None:
        parvas = {row["parva_slug"]: row for row in self.report["parva_profiles"]}
        covered_total = 0
        for slug, profile in parvas.items():
            ranges = [turn["source_range"] for turn in self.pack["turns"] if turn["source_range"]["parva_slug"] == slug]
            observed: list[int] = []
            for source_range in ranges:
                self.assertLessEqual(source_range["start_ordinal"], source_range["end_ordinal"])
                observed.extend(range(source_range["start_ordinal"], source_range["end_ordinal"] + 1))
            expected = list(range(1, profile["section_count"] + 1))
            self.assertEqual(expected, observed, slug)
            self.assertEqual(len(observed), len(set(observed)), slug)
            covered_total += len(observed)
        self.assertEqual(2107, covered_total)
        self.assertEqual(self.report["source_unit_root_sha256"], self.pack["source_qualification"]["source_unit_root_sha256"])

    def test_turn_order_follows_the_fixed_source_expression(self) -> None:
        parva_ordinals = {row["parva_slug"]: row["parva_ordinal"] for row in self.report["parva_profiles"]}
        keys = [
            (parva_ordinals[turn["source_range"]["parva_slug"]], turn["source_range"]["start_ordinal"])
            for turn in self.pack["turns"]
        ]
        self.assertEqual(sorted(keys), keys)
        self.assertEqual(len(keys), len(set(keys)))

    def test_every_turn_is_bilingual_and_multidimensional(self) -> None:
        arc_ids = {row["id"] for row in self.pack["arcs"]}
        turn_ids: set[str] = set()
        for turn in self.pack["turns"]:
            self.assertNotIn(turn["id"], turn_ids)
            turn_ids.add(turn["id"])
            self.assertIn(turn["arc_id"], arc_ids)
            self.assertEqual("planned_not_playable", turn["status"])
            for language in ("en", "hi"):
                self.assertGreaterEqual(len(turn["title"][language].strip()), 6)
                self.assertGreaterEqual(len(turn["story_promise"][language].strip()), 45)
            for facet in ("characters", "places", "kingdoms", "threads"):
                self.assertTrue(turn[facet], f"{turn['id']} has no {facet}")

    def test_consumer_promises_name_harm_and_do_not_claim_playability(self) -> None:
        turns = {row["id"]: row for row in self.pack["turns"]}
        self.assertIn("humiliat", turns["dice-destroys-law"]["story_promise"]["en"])
        self.assertIn("killed by many", turns["abhimanyu-formation"]["story_promise"]["en"])
        self.assertIn("sleeping survivors", turns["ashvatthama-sleeping-camp"]["story_promise"]["en"])
        self.assertIn("women", turns["women-battlefield-karna-truth"]["story_promise"]["en"].casefold())
        self.assertIn("historical world", turns["gifts-hospitality-cows"]["story_promise"]["en"])
        self.assertTrue(all(turn["status"] != "playable" for turn in self.pack["turns"]))


if __name__ == "__main__":
    unittest.main()

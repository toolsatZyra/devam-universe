from __future__ import annotations

import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INVENTORY_PATH = ROOT / "knowledge_packs" / "inventories" / "story-universe-coverage-v1.json"
MVP_PATH = ROOT / "knowledge_packs" / "inventories" / "consumer-content-mvp-v1.json"
ANCHOR_PATH = ROOT / "knowledge_packs" / "inventories" / "canonical-consumer-anchors-v1.json"
MAHABHARATA_PATH = ROOT / "knowledge_packs" / "inventories" / "mahabharata-consumer-backbone-v1.json"
RAMAYANA_EXPECTED_PATH = ROOT / "knowledge_packs" / "inventories" / "ramayana-expected-story-checklist-v1.json"


class StoryUniverseCoverageInventoryTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.inventory = json.loads(INVENTORY_PATH.read_text(encoding="utf-8"))
        cls.mvp = json.loads(MVP_PATH.read_text(encoding="utf-8"))
        cls.anchors = json.loads(ANCHOR_PATH.read_text(encoding="utf-8"))
        cls.mahabharata = json.loads(MAHABHARATA_PATH.read_text(encoding="utf-8"))
        cls.ramayana_expected = json.loads(RAMAYANA_EXPECTED_PATH.read_text(encoding="utf-8"))

    def test_contract_has_one_ordered_selected_scope_denominator(self) -> None:
        self.assertEqual("DEVAM_STORY_UNIVERSE_COVERAGE_V1", self.inventory["contract"])
        self.assertEqual(1, self.inventory["version"])
        self.assertEqual("active_goal_scope", self.inventory["approval_state"])
        collections = self.inventory["collections"]
        self.assertEqual(list(range(1, len(collections) + 1)), [item["priority"] for item in collections])
        self.assertEqual(len(collections), len({item["collection_id"] for item in collections}))
        self.assertIn("never civilizational completeness", self.inventory["boundary"])

    def test_inventory_covers_every_dimension_and_named_priority_world(self) -> None:
        self.assertEqual(
            {
                "work", "story_cycle", "episode", "character", "deity", "place", "temple",
                "festival", "ritual", "historical_connection", "living_practice_connection",
            },
            set(self.inventory["required_dimensions"]),
        )
        ids = {item["collection_id"] for item in self.inventory["collections"]}
        required = {
            "ramayana-selected-dutt-expression",
            "mahabharata-selected-ganguli-expression",
            "ramcharitmanas-daily-reading",
            "hanuman-chalisa-reading-and-meaning",
            "ganesha-story-world",
            "durga-navaratri-durga-puja-story-world",
            "kali-and-kali-puja-story-world",
            "lakshmi-story-world",
            "saraswati-story-world",
            "shiva-parvati-story-world",
            "rama-hanuman-beyond-selected-expression",
            "krishna-story-world",
            "vishnu-major-avatar-story-worlds",
            "diwali-deepavali-multi-tradition-world",
            "september-december-festival-and-ritual-layer",
            "panchatantra-selected-expression",
            "prioritized-puranic-and-devotional-story-families",
            "connected-places-temples-and-sacred-geographies",
            "kings-kingdoms-and-cultural-history",
            "yoga-and-meditation-story-and-practice-world",
        }
        self.assertEqual(required, ids)

    def test_every_collection_has_an_authoritative_enumerator_and_honest_state(self) -> None:
        allowed = set(self.inventory["completion_states"])
        for item in self.inventory["collections"]:
            with self.subTest(collection=item["collection_id"]):
                self.assertTrue(item["denominator"]["authoritative_enumerator"])
                self.assertIn(item["completion"]["state"], allowed)
                self.assertTrue(item["remaining_boundary"])
                self.assertTrue(set(item["required_dimensions"]).issubset(self.inventory["required_dimensions"]))
        self.assertNotIn("consumer_complete_en_hi", {item["completion"]["state"] for item in self.inventory["collections"]})

    def test_all_canonical_anchor_references_resolve(self) -> None:
        anchor_ids = {anchor["canonical_id"] for anchor in self.anchors["anchors"]}
        referenced = {
            anchor_id
            for item in self.inventory["collections"]
            for anchor_id in item["canonical_anchor_ids"]
        }
        self.assertTrue(referenced)
        self.assertEqual(set(), referenced - anchor_ids)

    def test_epic_counts_match_the_authoritative_current_inventories(self) -> None:
        collections = {item["collection_id"]: item for item in self.inventory["collections"]}
        lanes = {lane["lane_id"]: lane for lane in self.mvp["lanes"]}
        ramayana = collections["ramayana-selected-dutt-expression"]
        ramayana_current = lanes["ramayana-consumer-story"]["current"]
        self.assertEqual(ramayana_current["selected_expression_source_units"], ramayana["denominator"]["source_units"])
        self.assertEqual(ramayana_current["whole_story_turns"], ramayana["denominator"]["story_cycles"])
        self.assertEqual(ramayana_current["playable_scenes"], ramayana["denominator"]["current_episodes"])
        self.assertEqual(ramayana_current["bilingual_beats"], ramayana["completion"]["substantial_bilingual_beats"])
        self.assertEqual(self.ramayana_expected["counters"]["total_expected_story_rows"], ramayana["denominator"]["consumer_expected_story_rows"])
        self.assertEqual(self.ramayana_expected["counters"]["supplemental_expected_stories"], ramayana["denominator"]["supplemental_expected_story_rows"])
        self.assertEqual(self.ramayana_expected["counters"]["supplemental_rows_complete_en_hi"], ramayana["completion"]["supplemental_expected_story_rows_complete_en_hi"])
        self.assertEqual(ramayana_current["supplemental_expected_story_rows_complete_en_hi"], ramayana["completion"]["supplemental_expected_story_rows_complete_en_hi"])
        self.assertEqual(ramayana_current["supplemental_expected_story_rows_open"], ramayana["completion"]["supplemental_expected_story_rows_open"])

        mahabharata = collections["mahabharata-selected-ganguli-expression"]
        mahabharata_current = lanes["mahabharata-consumer-story"]["current"]
        self.assertEqual(self.mahabharata["source_qualification"]["fixed_source_units"], mahabharata["denominator"]["source_units"])
        self.assertEqual(len(self.mahabharata["turns"]), mahabharata["denominator"]["story_cycles"])
        self.assertEqual(mahabharata_current["turns_with_authored_scenes"], mahabharata["denominator"]["current_authored_story_cycles"])
        self.assertEqual(mahabharata_current["substantial_bilingual_scenes"], mahabharata["completion"]["current_episodes"])
        self.assertEqual(mahabharata_current["substantial_bilingual_beats"], mahabharata["completion"]["substantial_bilingual_beats"])

    def test_missing_denominators_are_not_disguised_as_completion(self) -> None:
        missing = [item for item in self.inventory["collections"] if item["denominator"]["state"] == "missing"]
        self.assertGreaterEqual(len(missing), 10)
        self.assertTrue(all(item["completion"]["state"] == "denominator_missing" for item in missing))
        self.assertIn("not a completed consumer story", self.inventory["completion_rule"])


if __name__ == "__main__":
    unittest.main()

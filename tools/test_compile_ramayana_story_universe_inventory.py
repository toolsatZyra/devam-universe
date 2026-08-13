import json
import subprocess
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INVENTORY = ROOT / "knowledge_packs" / "inventories" / "ramayana-story-universe-v1.json"
FESTIVAL_PACK = ROOT / "knowledge_packs" / "library_lanes" / "ramayana" / "festivals-and-performances-v1.json"
PLACE_PACK = ROOT / "knowledge_packs" / "library_lanes" / "ramayana" / "living-places-v1.json"
TEMPLE_PACK = ROOT / "knowledge_packs" / "library_lanes" / "ramayana" / "temples-v1.json"


class RamayanaStoryUniverseInventoryTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = json.loads(INVENTORY.read_text(encoding="utf-8"))
        cls.festival_pack = json.loads(FESTIVAL_PACK.read_text(encoding="utf-8"))
        cls.place_pack = json.loads(PLACE_PACK.read_text(encoding="utf-8"))
        cls.temple_pack = json.loads(TEMPLE_PACK.read_text(encoding="utf-8"))

    def test_generated_inventory_is_current(self):
        result = subprocess.run(
            ["node", "tools/compile_ramayana_story_universe_inventory.cjs", "--check"],
            cwd=ROOT,
            capture_output=True,
            text=True,
            check=True,
        )
        self.assertIn("is current", result.stdout)

    def test_selected_narrative_is_fully_enumerated(self):
        narrative = self.data["selected_narrative"]
        self.assertEqual(narrative["source_units"], 652)
        self.assertEqual(len(narrative["story_cycles"]), 49)
        self.assertEqual(len(narrative["episodes"]), narrative["counters"]["playableScenes"])
        self.assertEqual(sum(item["beat_count"] for item in narrative["episodes"]), narrative["counters"]["bilingualBeats"])
        self.assertEqual(len({item["episode_id"] for item in narrative["episodes"]}), len(narrative["episodes"]))

    def test_living_world_has_explicit_breadth_and_boundaries(self):
        living = self.data["living_world"]
        self.assertGreaterEqual(len(living["places"]), 18)
        self.assertGreaterEqual(len(living["temples"]), 18)
        self.assertGreaterEqual(len(living["festivals_and_performances"]), 12)
        self.assertTrue(all(item["evidence_source_ids"] for item in living["places"]))
        self.assertTrue(all(item["evidence_source_ids"] for item in living["temples"]))
        self.assertTrue(all(item.get("scope_boundary") for item in living["festivals_and_performances"]))

    def test_registered_festival_layer_is_complete_and_leaves_the_queue(self):
        festivals = self.data["living_world"]["festivals_and_performances"]
        self.assertTrue(all(item["content_state"] == "consumer_complete_en_hi" for item in festivals))
        self.assertTrue(all(item.get("consumer_content_pack") for item in festivals))
        festival_ids = {item["item_id"] for item in festivals}
        queue = set(self.data["next_authoring_queue"]["living_items_needing_bilingual_content"])
        self.assertFalse(festival_ids & queue)

    def test_registered_place_layer_is_complete_and_leaves_the_queue(self):
        places = self.data["living_world"]["places"]
        self.assertEqual(len(places), 18)
        self.assertTrue(all(item["content_state"] == "consumer_complete_en_hi" for item in places))
        self.assertTrue(all(item.get("consumer_content_pack") for item in places))
        place_ids = {item["place_id"] for item in places}
        queue = set(self.data["next_authoring_queue"]["living_items_needing_bilingual_content"])
        self.assertFalse(place_ids & queue)

    def test_registered_temple_layer_is_complete_and_leaves_the_queue(self):
        temples = self.data["living_world"]["temples"]
        self.assertEqual(len(temples), 18)
        self.assertTrue(all(item["content_state"] == "consumer_complete_en_hi" for item in temples))
        self.assertTrue(all(item.get("consumer_content_pack") for item in temples))
        temple_ids = {item["temple_id"] for item in temples}
        queue = set(self.data["next_authoring_queue"]["living_items_needing_bilingual_content"])
        self.assertFalse(temple_ids & queue)

    def test_festival_content_is_substantial_bilingual_and_evidence_linked(self):
        records = self.festival_pack["records"]
        evidence_ids = {item["source_id"] for item in self.data["evidence_sources"]}
        self.assertEqual(len(records), 12)
        self.assertEqual(len({item["item_id"] for item in records}), 12)
        for item in records:
            self.assertGreaterEqual(len(item["story_anchor"]["en"].split()), 35, item["item_id"])
            self.assertGreaterEqual(len(item["living_experience"]["en"].split()), 35, item["item_id"])
            self.assertRegex(item["story_anchor"]["hi"], r"[\u0900-\u097f]", item["item_id"])
            self.assertRegex(item["living_experience"]["hi"], r"[\u0900-\u097f]", item["item_id"])
            self.assertGreaterEqual(len(item["typical_actions_not_commands"]), 3, item["item_id"])
            self.assertTrue(set(item["evidence_source_ids"]) <= evidence_ids, item["item_id"])
            self.assertEqual(item["completion_state"], "consumer_complete_en_hi")
            self.assertTrue(item["variation_boundary"], item["item_id"])

    def test_place_content_is_substantial_bilingual_and_evidence_linked(self):
        records = self.place_pack["records"]
        evidence_ids = {item["source_id"] for item in self.data["evidence_sources"]}
        self.assertEqual(len(records), 18)
        self.assertEqual(len({item["place_id"] for item in records}), 18)
        for item in records:
            self.assertGreaterEqual(len(item["story_anchor"]["en"].split()), 45, item["place_id"])
            self.assertGreaterEqual(len(item["living_experience"]["en"].split()), 45, item["place_id"])
            self.assertRegex(item["story_anchor"]["hi"], r"[\u0900-\u097f]", item["place_id"])
            self.assertRegex(item["living_experience"]["hi"], r"[\u0900-\u097f]", item["place_id"])
            self.assertGreaterEqual(len(item["exploration_prompts"]), 3, item["place_id"])
            self.assertTrue(set(item["evidence_source_ids"]) <= evidence_ids, item["place_id"])
            self.assertEqual(item["completion_state"], "consumer_complete_en_hi")
            self.assertTrue(item["claim_boundary"], item["place_id"])

    def test_temple_content_is_substantial_bilingual_and_evidence_linked(self):
        records = self.temple_pack["records"]
        evidence_ids = {item["source_id"] for item in self.data["evidence_sources"]}
        self.assertEqual(len(records), 18)
        self.assertEqual(len({item["temple_id"] for item in records}), 18)
        for item in records:
            self.assertGreaterEqual(len(item["story_connection"]["en"].split()), 40, item["temple_id"])
            self.assertGreaterEqual(len(item["visitor_experience"]["en"].split()), 40, item["temple_id"])
            self.assertRegex(item["story_connection"]["hi"], r"[\u0900-\u097f]", item["temple_id"])
            self.assertRegex(item["visitor_experience"]["hi"], r"[\u0900-\u097f]", item["temple_id"])
            self.assertGreaterEqual(len(item["exploration_links"]), 3, item["temple_id"])
            self.assertTrue(set(item["evidence_source_ids"]) <= evidence_ids, item["temple_id"])
            self.assertEqual(item["completion_state"], "consumer_complete_en_hi")
            self.assertTrue(item["claim_boundary"], item["temple_id"])


if __name__ == "__main__":
    unittest.main()

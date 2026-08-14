from __future__ import annotations

import json
import re
import subprocess
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PACK_PATH = ROOT / "knowledge_packs/library_lanes/ramayana/expected-stories-later-devotional-v1.json"
SUPPLEMENTS_PATH = ROOT / "knowledge_packs/inventories/ramayana-expected-story-supplements-v1.json"
CHECKLIST_PATH = ROOT / "knowledge_packs/inventories/ramayana-expected-story-checklist-v1.json"
SELECTED_PATH = ROOT / "knowledge_packs/inventories/ramayana-story-universe-v1.json"
MIGRATION_PATH = ROOT / "supabase/migrations/20260814030000_seed_ramayana_expected_stories_later_devotional.sql"
PACK_ID = "ramayana-expected-stories-later-devotional-v1"


class RamayanaExpectedStoryLaterDevotionalBatchTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.pack = json.loads(PACK_PATH.read_text(encoding="utf-8"))
        cls.supplements = json.loads(SUPPLEMENTS_PATH.read_text(encoding="utf-8"))
        cls.checklist = json.loads(CHECKLIST_PATH.read_text(encoding="utf-8"))
        cls.selected = json.loads(SELECTED_PATH.read_text(encoding="utf-8"))

    def test_exact_final_five_story_and_forty_five_episode_denominator(self) -> None:
        expected = [
            "popular-sulochana-meghnad",
            "regional-ahiravana-mahiravana-rescue",
            "popular-luv-kush-ashvamedha-confrontation",
            "popular-hanuman-opens-chest",
            "popular-hanuman-sindoor",
        ]
        stories = self.pack["stories"]
        self.assertEqual([row["expectation_id"] for row in stories], expected)
        self.assertEqual([len(row["episodes"]) for row in stories], [7, 12, 12, 7, 7])
        self.assertEqual(sum(len(row["episodes"]) for row in stories), 45)
        self.assertEqual(self.pack["batch_counters"]["episodes"], 45)
        self.assertEqual(self.pack["batch_counters"]["selected_expression_backprojections"], 0)

    def test_every_episode_is_substantial_bilingual_contiguous_unique_and_valid_utf8(self) -> None:
        forbidden = ("\ufffd", "ÃƒÆ’", "Ãƒâ€š", "à¤", "à¥")
        ids: set[str] = set()
        for story in self.pack["stories"]:
            self.assertEqual(story["consumer_state"], "consumer_complete_en_hi")
            self.assertEqual(
                [episode["ordinal"] for episode in story["episodes"]],
                list(range(1, len(story["episodes"]) + 1)),
            )
            self.assertTrue(story["transition"]["en"].strip())
            self.assertTrue(story["transition"]["hi"].strip())
            for episode in story["episodes"]:
                self.assertNotIn(episode["episode_id"], ids)
                ids.add(episode["episode_id"])
                self.assertGreaterEqual(len(episode["narration"]["en"].split()), 35)
                self.assertGreaterEqual(len(episode["narration"]["hi"].split()), 35)
                self.assertTrue(episode["source_refs"])
                for language in ("en", "hi"):
                    value = episode["title"][language] + " " + episode["narration"][language]
                    self.assertFalse(any(marker in value for marker in forbidden), value)
                    if language == "hi":
                        self.assertIsNone(re.search(r"[A-Za-z]{3,}", value), value)

    def test_source_references_resolve_and_rights_are_noncopying(self) -> None:
        sources = {row["source_id"]: row for row in self.pack["source_registry"]}
        self.assertEqual(len(sources), len(self.pack["source_registry"]))
        for story in self.pack["stories"]:
            self.assertTrue(set(story["source_alignment"]["source_refs"]).issubset(sources))
            for episode in story["episodes"]:
                self.assertTrue(set(episode["source_refs"]).issubset(sources))
        self.assertEqual(sources["sagar-ramayan-series"]["rights_lane"], "coverage_cue_only_no_copying")
        self.assertTrue(all("product_allowed" not in row.get("rights_lane", "") for row in sources.values()))

    def test_material_variant_and_sensitive_boundaries_are_not_flattened(self) -> None:
        by_id = {row["expectation_id"]: row for row in self.pack["stories"]}
        ahiravana = by_id["regional-ahiravana-mahiravana-rescue"]
        titles = [episode["title"]["en"] for episode in ahiravana["episodes"]]
        self.assertTrue(any(title.startswith("Branch A:") for title in titles))
        self.assertTrue(any(title.startswith("Branch B:") for title in titles))
        self.assertIn("not silently treated as one", ahiravana["source_alignment"]["alignment_note"])
        self.assertIn("harmful", " ".join(self.pack["shared_boundaries"]).casefold())
        self.assertIn("no known premodern textual source", by_id["popular-hanuman-sindoor"]["source_alignment"]["selected_expression_relation"])
        self.assertIn("not a Valmiki", by_id["popular-hanuman-opens-chest"]["expression_scope"])

    def test_character_place_and_relationship_identifiers_resolve(self) -> None:
        selected_entities = {
            row["entity_id"] for row in self.selected["selected_narrative"]["authored_story_entities"]
        }
        local_entities = {row["entity_id"] for row in self.pack["canonical_local_entities"]}
        local_places = {row["place_id"] for row in self.pack["canonical_local_places"]}
        selected_cycles = {
            row["story_cycle_id"] for row in self.selected["selected_narrative"]["story_cycles"]
        }
        story_ids = {row["story_id"] for row in self.pack["stories"]}
        living_stubs = {
            row["connection_id"] for row in self.pack["connection_stubs"] if row["kind"] == "living_practice"
        }
        registries = {
            "entity": selected_entities | local_entities,
            "story_cycle": selected_cycles,
            "story": story_ids,
            "living_practice": living_stubs,
            "devotional_text": {"hanuman-chalisa"},
        }
        for story in self.pack["stories"]:
            self.assertTrue(set(story["characters"]).issubset(selected_entities | local_entities))
            self.assertTrue(set(story["places"]).issubset(local_places))
            for edge in story["relationships"]:
                self.assertTrue(edge["bidirectional"])
                self.assertIn(edge["target_id"], registries[edge["target_kind"]])

    def test_all_supplement_rows_now_resolve_and_checklist_is_closed(self) -> None:
        pack_stories = {row["expectation_id"]: row for row in self.pack["stories"]}
        completed = [
            row for row in self.supplements["supplements"]
            if row.get("consumer_story_pack_id") == PACK_ID
        ]
        self.assertEqual(len(completed), 5)
        for row in completed:
            self.assertEqual(row["coverage_state"], "consumer_complete_en_hi")
            self.assertEqual(row["consumer_story_id"], pack_stories[row["expectation_id"]]["story_id"])
        self.assertEqual(self.checklist["counters"]["supplemental_rows_complete_en_hi"], 22)
        self.assertEqual(self.checklist["counters"]["supplemental_rows_open"], 0)
        self.assertEqual(self.checklist["completion_state"], "approved_version_complete")

    def test_generated_migration_is_current_draft_only_and_payload_free(self) -> None:
        result = subprocess.run(
            ["python", "tools/compile_ramayana_expected_story_later_devotional_batch.py", "--check"],
            cwd=ROOT,
            capture_output=True,
            text=True,
            check=False,
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        sql = MIGRATION_PATH.read_text(encoding="utf-8")
        self.assertIn("Expected 5 later and devotional Ramayana stories", sql)
        self.assertIn("Expected 45 later and devotional Ramayana story beats", sql)
        self.assertIn("Expected 90 bilingual beat texts", sql)
        self.assertIn("devam_bilingual_source_bounded_synthesis", sql)
        self.assertNotIn("insert into public.narrative_evidence", sql)
        self.assertIn("'draft'", sql)
        self.assertNotIn("source_vault/objects", sql)
        self.assertNotIn("http://", sql)


if __name__ == "__main__":
    unittest.main()

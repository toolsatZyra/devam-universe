from __future__ import annotations

import json
import re
import subprocess
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PACK_PATH = ROOT / "knowledge_packs/library_lanes/ramayana/expected-stories-popular-living-bridges-v1.json"
PRIOR_PACK_PATHS = [
    ROOT / "knowledge_packs/library_lanes/ramayana/expected-stories-beginnings-exile-v1.json",
    ROOT / "knowledge_packs/library_lanes/ramayana/expected-stories-war-messengers-v1.json",
    ROOT / "knowledge_packs/library_lanes/ramayana/expected-stories-uttarkanda-frames-v1.json",
]
SUPPLEMENTS_PATH = ROOT / "knowledge_packs/inventories/ramayana-expected-story-supplements-v1.json"
SELECTED_PATH = ROOT / "knowledge_packs/inventories/ramayana-story-universe-v1.json"
LIVING_PLACES_PATH = ROOT / "knowledge_packs/library_lanes/ramayana/living-places-v1.json"
TEMPLES_PATH = ROOT / "knowledge_packs/library_lanes/ramayana/temples-v1.json"
FESTIVALS_PATH = ROOT / "knowledge_packs/library_lanes/ramayana/festivals-and-performances-v1.json"
MIGRATION_PATH = ROOT / "supabase/migrations/20260814013000_seed_ramayana_expected_stories_popular_living_bridges.sql"
PACK_ID = "ramayana-expected-stories-popular-living-bridges-v1"


class RamayanaExpectedStoryPopularLivingBatchTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.pack = json.loads(PACK_PATH.read_text(encoding="utf-8"))
        cls.prior_packs = [json.loads(path.read_text(encoding="utf-8")) for path in PRIOR_PACK_PATHS]
        cls.supplements = json.loads(SUPPLEMENTS_PATH.read_text(encoding="utf-8"))
        cls.selected = json.loads(SELECTED_PATH.read_text(encoding="utf-8"))
        cls.living_places = json.loads(LIVING_PLACES_PATH.read_text(encoding="utf-8"))
        cls.temples = json.loads(TEMPLES_PATH.read_text(encoding="utf-8"))
        cls.festivals = json.loads(FESTIVALS_PATH.read_text(encoding="utf-8"))

    def test_exact_five_story_denominator_and_thirty_five_episode_sequence(self) -> None:
        expected = [
            "popular-lakshman-rekha",
            "popular-shabari-tasted-berries",
            "regional-bridge-squirrel",
            "living-rameswaram-linga-tradition",
            "living-diwali-rama-homecoming",
        ]
        stories = self.pack["stories"]
        self.assertEqual([row["expectation_id"] for row in stories], expected)
        self.assertEqual([len(row["episodes"]) for row in stories], [6, 6, 6, 9, 8])
        self.assertEqual(sum(len(row["episodes"]) for row in stories), 35)
        self.assertEqual(self.pack["batch_counters"]["episode_count"], 35)
        self.assertEqual(self.pack["batch_counters"]["selected_dutt_expression_claims_added"], 0)

    def test_every_episode_is_substantial_bilingual_contiguous_and_valid_utf8(self) -> None:
        forbidden = ("\ufffd", "ÃƒÂ Ã‚Â¤", "ÃƒÂ Ã‚Â¥", "ÃƒÆ’", "Ãƒâ€š")
        episode_ids: set[str] = set()
        titles = {"en": set(), "hi": set()}
        narrations = {"en": set(), "hi": set()}
        for story in self.pack["stories"]:
            self.assertEqual(story["consumer_state"], "consumer_complete_en_hi")
            self.assertEqual(
                [episode["ordinal"] for episode in story["episodes"]],
                list(range(1, len(story["episodes"]) + 1)),
            )
            self.assertTrue(story["transition"]["en"].strip())
            self.assertTrue(story["transition"]["hi"].strip())
            self.assertTrue(story["boundary_note"].strip())
            for episode in story["episodes"]:
                self.assertNotIn(episode["episode_id"], episode_ids)
                episode_ids.add(episode["episode_id"])
                self.assertGreaterEqual(len(episode["narration"]["en"].split()), 28)
                self.assertGreaterEqual(len(episode["narration"]["hi"].split()), 22)
                self.assertTrue(episode["source_refs"])
                for language in ("en", "hi"):
                    title = episode["title"][language].strip().casefold()
                    narration = " ".join(episode["narration"][language].split()).casefold()
                    self.assertNotIn(title, titles[language])
                    self.assertNotIn(narration, narrations[language])
                    titles[language].add(title)
                    narrations[language].add(narration)
                    value = episode["title"][language] + " " + episode["narration"][language]
                    self.assertFalse(any(marker in value for marker in forbidden), value)
                    if language == "hi":
                        self.assertIsNone(re.search(r"[A-Za-z]{3,}", value), value)

    def test_source_references_resolve_and_reception_rights_remain_bounded(self) -> None:
        source_by_id = {row["source_id"]: row for row in self.pack["source_registry"]}
        self.assertEqual(len(source_by_id), len(self.pack["source_registry"]))
        self.assertEqual(source_by_id["sagar-ramayan-series"]["rights_lane"], "coverage_cue_only_no_copying")
        self.assertIn("no script", source_by_id["sagar-ramayan-series"]["evidence_role"].casefold())
        for story in self.pack["stories"]:
            self.assertTrue(set(story["source_alignment"]["source_refs"]).issubset(source_by_id))
            for episode in story["episodes"]:
                self.assertTrue(set(episode["source_refs"]).issubset(source_by_id))

    def test_relationships_resolve_and_cross_story_link_is_reciprocal(self) -> None:
        story_ids = {row["story_id"] for row in self.pack["stories"]}
        registries = {
            "story": story_ids,
            "story_cycle": {row["story_cycle_id"] for row in self.selected["selected_narrative"]["story_cycles"]},
            "entity": {row["entity_id"] for row in self.selected["selected_narrative"]["authored_story_entities"]},
            "living_place": {row["place_id"] for row in self.living_places["records"]},
            "temple": {row["temple_id"] for row in self.temples["records"]},
            "festival": {row["item_id"] for row in self.festivals["records"]},
        }
        edges: set[tuple[str, str, str, str]] = set()
        for story in self.pack["stories"]:
            self.assertGreaterEqual(len(story["relationships"]), 4)
            for edge in story["relationships"]:
                self.assertTrue(edge["bidirectional"])
                self.assertIn(edge["target_id"], registries[edge["target_kind"]])
                edges.add((story["story_id"], edge["target_id"], edge["relationship"], edge["inverse_relationship"]))
        cross_story = [edge for edge in edges if edge[1] in story_ids]
        self.assertEqual(len(cross_story), 2)
        for source_id, target_id, relationship, inverse in cross_story:
            self.assertIn((target_id, source_id, inverse, relationship), edges)

    def test_episode_ids_titles_and_narration_do_not_duplicate_prior_batches(self) -> None:
        def episode_rows(pack: dict) -> list[dict]:
            return [episode for story in pack["stories"] for episode in story["episodes"]]

        prior = [episode for pack in self.prior_packs for episode in episode_rows(pack)]
        current = episode_rows(self.pack)
        self.assertTrue({row["episode_id"] for row in prior}.isdisjoint({row["episode_id"] for row in current}))
        for language in ("en", "hi"):
            prior_titles = {row["title"][language].strip().casefold() for row in prior}
            prior_narration = {" ".join(row["narration"][language].split()).casefold() for row in prior}
            self.assertTrue(prior_titles.isdisjoint({row["title"][language].strip().casefold() for row in current}))
            self.assertTrue(
                prior_narration.isdisjoint(
                    {" ".join(row["narration"][language].split()).casefold() for row in current}
                )
            )

    def test_completed_supplement_rows_resolve_to_this_pack(self) -> None:
        pack_by_expectation = {row["expectation_id"]: row for row in self.pack["stories"]}
        completed = [
            row
            for row in self.supplements["supplements"]
            if row.get("consumer_story_pack_id") == PACK_ID
        ]
        self.assertEqual(len(completed), 5)
        for row in completed:
            self.assertEqual(row["coverage_state"], "consumer_complete_en_hi")
            self.assertEqual(row["consumer_story_id"], pack_by_expectation[row["expectation_id"]]["story_id"])
            self.assertTrue(any(marker in row["source_alignment_state"] for marker in ("aligned", "grounded")))

    def test_sensitive_story_boundaries_are_explicit(self) -> None:
        by_id = {row["expectation_id"]: row for row in self.pack["stories"]}
        self.assertIn("blame Sita", by_id["popular-lakshman-rekha"]["boundary_note"])
        self.assertIn("every Ramayana", by_id["popular-shabari-tasted-berries"]["boundary_note"])
        self.assertIn("zoological", by_id["regional-bridge-squirrel"]["boundary_note"])
        self.assertIn("proof of epic geography", by_id["living-rameswaram-linga-tradition"]["boundary_note"])
        self.assertIn("not every Diwali", by_id["living-diwali-rama-homecoming"]["boundary_note"])
        self.assertIn("not silently attributed", " ".join(self.pack["shared_boundaries"]))

    def test_generated_migration_is_current_draft_only_and_payload_free(self) -> None:
        result = subprocess.run(
            ["python", "tools/compile_ramayana_expected_story_popular_living_batch.py", "--check"],
            cwd=ROOT,
            capture_output=True,
            text=True,
            check=False,
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        sql = MIGRATION_PATH.read_text(encoding="utf-8")
        self.assertIn("Expected 5 popular and living bridge stories", sql)
        self.assertIn("Expected 35 popular and living bridge story beats", sql)
        self.assertIn("Expected 70 bilingual beat texts", sql)
        self.assertIn("devam_bilingual_source_bounded_synthesis", sql)
        self.assertIn('"sourceRefs"', sql)
        self.assertNotIn("insert into public.narrative_evidence", sql)
        self.assertIn("'draft'", sql)
        self.assertNotIn("source_vault/objects", sql)
        self.assertNotIn("http://", sql)


if __name__ == "__main__":
    unittest.main()

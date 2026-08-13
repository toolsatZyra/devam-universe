from __future__ import annotations

import json
import re
import subprocess
import unittest
from pathlib import Path

from tools.compile_ramcharitmanas_wikisource_product import (
    SCAN_SHA256,
    load_inputs,
    load_revisions,
    plaintext_projection,
    sopana_for_page,
)


ROOT = Path(__file__).resolve().parents[1]
PACK_PATH = ROOT / "knowledge_packs/library_lanes/ramayana/expected-stories-war-messengers-v1.json"
BEGINNINGS_PACK_PATH = ROOT / "knowledge_packs/library_lanes/ramayana/expected-stories-beginnings-exile-v1.json"
SUPPLEMENTS_PATH = ROOT / "knowledge_packs/inventories/ramayana-expected-story-supplements-v1.json"
SELECTED_PATH = ROOT / "knowledge_packs/inventories/ramayana-story-universe-v1.json"
MIGRATION_PATH = ROOT / "supabase/migrations/20260813163000_seed_ramayana_expected_stories_war_messengers.sql"
PACK_ID = "ramayana-expected-stories-war-messengers-v1"


class RamayanaExpectedStoryWarBatchTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.pack = json.loads(PACK_PATH.read_text(encoding="utf-8"))
        cls.beginnings_pack = json.loads(BEGINNINGS_PACK_PATH.read_text(encoding="utf-8"))
        cls.supplements = json.loads(SUPPLEMENTS_PATH.read_text(encoding="utf-8"))
        cls.selected = json.loads(SELECTED_PATH.read_text(encoding="utf-8"))
        cls.plan, cls.report, cls.structure = load_inputs()
        cls.pages, _ = load_revisions(cls.plan, cls.report)

    def test_exact_three_story_denominator_and_twenty_five_episode_sequence(self) -> None:
        expected = [
            "manas-angada-immovable-foot",
            "manas-kalnemi-deception",
            "manas-bharata-shoots-hanuman",
        ]
        stories = self.pack["stories"]
        self.assertEqual([row["expectation_id"] for row in stories], expected)
        self.assertEqual(sum(len(row["episodes"]) for row in stories), 25)
        self.assertEqual(self.pack["batch_counters"]["episode_count"], 25)
        self.assertEqual(self.pack["batch_counters"]["selected_dutt_expression_claims_added"], 0)

    def test_every_episode_is_substantial_bilingual_contiguous_and_valid_utf8(self) -> None:
        forbidden = ("\ufffd", "Ã Â¤", "Ã Â¥", "Ãƒ", "Ã‚")
        episode_ids: set[str] = set()
        for story in self.pack["stories"]:
            with self.subTest(story=story["expectation_id"]):
                self.assertEqual(story["consumer_state"], "consumer_complete_en_hi")
                self.assertGreaterEqual(len(story["episodes"]), 7)
                self.assertEqual(
                    [row["ordinal"] for row in story["episodes"]],
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
                    for language in ("en", "hi"):
                        value = episode["title"][language] + " " + episode["narration"][language]
                        self.assertFalse(any(marker in value for marker in forbidden), value)

    def test_exact_ranges_resolve_to_lankakanda_fixed_carrier(self) -> None:
        expected_ranges = {
            "manas-angada-immovable-foot": ([943, 965], [17, 34]),
            "manas-kalnemi-deception": ([985, 988], [55, 58]),
            "manas-bharata-shoots-hanuman": ([988, 991], [58, 60]),
        }
        self.assertEqual(self.pack["source_registry"][0]["scan_sha256"], SCAN_SHA256)
        page_union: set[int] = set()
        for story in self.pack["stories"]:
            scan_range, doha_range = expected_ranges[story["expectation_id"]]
            alignment = story["source_alignment"]
            self.assertEqual(alignment["scan_pages_inclusive"], scan_range)
            self.assertEqual(alignment["doha_range_inclusive"], doha_range)
            self.assertEqual(alignment["kanda"], "Lankakanda")
            valid_pages = set(range(scan_range[0], scan_range[1] + 1))
            for scan_page in valid_pages:
                self.assertIn(scan_page, self.pages)
                self.assertEqual(sopana_for_page(self.structure, scan_page)["ordinal"], 6)
                page_union.add(scan_page)
            for episode in story["episodes"]:
                self.assertTrue(set(episode["source_scan_pages"]).issubset(valid_pages))
        self.assertEqual(len(page_union), 30)
        self.assertEqual(len(page_union), self.pack["batch_counters"]["source_scan_page_union_count"])

    def test_consumer_hindi_does_not_copy_eighteen_token_source_runs(self) -> None:
        def normalize(value: str) -> str:
            return " ".join(re.findall(r"[\w\u0900-\u097f]+", value.casefold()))

        for story in self.pack["stories"]:
            start, end = story["source_alignment"]["scan_pages_inclusive"]
            chunks = []
            for scan_page in range(start, end + 1):
                try:
                    chunks.append(plaintext_projection(self.pages[scan_page]["content"]))
                except ValueError:
                    continue
            source = " " + normalize(" ".join(chunks)) + " "
            for episode in story["episodes"]:
                tokens = normalize(episode["narration"]["hi"]).split()
                for offset in range(max(0, len(tokens) - 17)):
                    window = " " + " ".join(tokens[offset : offset + 18]) + " "
                    self.assertNotIn(window, source, f"long copied source run in {episode['episode_id']}")

    def test_episode_ids_titles_and_narration_do_not_duplicate_prior_batch(self) -> None:
        def episode_rows(pack: dict) -> list[dict]:
            return [episode for story in pack["stories"] for episode in story["episodes"]]

        prior = episode_rows(self.beginnings_pack)
        current = episode_rows(self.pack)
        for field in ("episode_id",):
            self.assertTrue({row[field] for row in prior}.isdisjoint({row[field] for row in current}))
        for language in ("en", "hi"):
            prior_titles = {row["title"][language].strip().casefold() for row in prior}
            prior_narration = {" ".join(row["narration"][language].split()).casefold() for row in prior}
            self.assertTrue(prior_titles.isdisjoint({row["title"][language].strip().casefold() for row in current}))
            self.assertTrue(
                prior_narration.isdisjoint(
                    {" ".join(row["narration"][language].split()).casefold() for row in current}
                )
            )

    def test_relationships_resolve_and_cross_story_links_are_reciprocal(self) -> None:
        story_ids = {row["story_id"] for row in self.pack["stories"]}
        cycle_ids = {row["story_cycle_id"] for row in self.selected["selected_narrative"]["story_cycles"]}
        entity_ids = {row["entity_id"] for row in self.selected["selected_narrative"]["authored_story_entities"]}
        registries = {"story": story_ids, "story_cycle": cycle_ids, "entity": entity_ids}
        edges: set[tuple[str, str, str, str]] = set()
        for story in self.pack["stories"]:
            self.assertGreaterEqual(len(story["relationships"]), 4)
            for edge in story["relationships"]:
                self.assertTrue(edge["bidirectional"])
                self.assertIn(edge["target_id"], registries[edge["target_kind"]])
                edges.add((story["story_id"], edge["target_id"], edge["relationship"], edge["inverse_relationship"]))
        cross_story = [edge for edge in edges if edge[1] in story_ids]
        for source_id, target_id, relationship, inverse in cross_story:
            self.assertIn((target_id, source_id, inverse, relationship), edges)

    def test_completed_supplement_rows_resolve_to_this_pack(self) -> None:
        pack_by_expectation = {row["expectation_id"]: row for row in self.pack["stories"]}
        completed = [
            row
            for row in self.supplements["supplements"]
            if row.get("consumer_story_pack_id") == PACK_ID
        ]
        self.assertEqual(len(completed), 3)
        for row in completed:
            self.assertEqual(row["coverage_state"], "consumer_complete_en_hi")
            self.assertEqual(row["consumer_story_id"], pack_by_expectation[row["expectation_id"]]["story_id"])
            self.assertIn("aligned", row["source_alignment_state"])

    def test_generated_migration_is_current_draft_only_and_payload_free(self) -> None:
        result = subprocess.run(
            ["python", "tools/compile_ramayana_expected_story_war_batch.py", "--check"],
            cwd=ROOT,
            capture_output=True,
            text=True,
            check=False,
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        sql = MIGRATION_PATH.read_text(encoding="utf-8")
        self.assertIn("Expected 3 Ramcharitmanas expected stories", sql)
        self.assertIn("Expected 25 Ramcharitmanas expected-story beats", sql)
        self.assertIn("Expected 50 bilingual beat texts", sql)
        self.assertIn("'draft'", sql)
        self.assertNotIn("source_vault/objects", sql)
        self.assertNotIn("http://", sql)


if __name__ == "__main__":
    unittest.main()

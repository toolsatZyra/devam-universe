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
PACK_PATH = ROOT / "knowledge_packs/library_lanes/ramayana/expected-stories-beginnings-exile-v1.json"
SUPPLEMENTS_PATH = ROOT / "knowledge_packs/inventories/ramayana-expected-story-supplements-v1.json"
SELECTED_PATH = ROOT / "knowledge_packs/inventories/ramayana-story-universe-v1.json"
LIVING_PLACES_PATH = ROOT / "knowledge_packs/library_lanes/ramayana/living-places-v1.json"
MIGRATION_PATH = ROOT / "supabase/migrations/20260813130000_seed_ramayana_expected_stories_beginnings_exile.sql"


class RamayanaExpectedStoryBatchTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.pack = json.loads(PACK_PATH.read_text(encoding="utf-8"))
        cls.supplements = json.loads(SUPPLEMENTS_PATH.read_text(encoding="utf-8"))
        cls.selected = json.loads(SELECTED_PATH.read_text(encoding="utf-8"))
        cls.living_places = json.loads(LIVING_PLACES_PATH.read_text(encoding="utf-8"))
        cls.plan, cls.report, cls.structure = load_inputs()
        cls.pages, _ = load_revisions(cls.plan, cls.report)

    def test_exact_batch_denominator_and_sequence(self) -> None:
        expected = [
            "manas-shiva-sati-parvati-frame",
            "manas-narada-delusion",
            "manas-manu-shatarupa-boon",
            "manas-pratapbhanu-curse",
            "popular-rama-childhood-and-education",
            "manas-pushpavatika-gauri-prayer",
            "manas-kevat-crossing",
        ]
        stories = self.pack["stories"]
        self.assertEqual([row["expectation_id"] for row in stories], expected)
        self.assertEqual(sum(len(row["episodes"]) for row in stories), 69)
        self.assertEqual(self.pack["batch_counters"]["episode_count"], 69)
        self.assertEqual(self.pack["batch_counters"]["selected_dutt_expression_claims_added"], 0)

    def test_every_story_is_substantial_bilingual_and_contiguous(self) -> None:
        forbidden = ("\ufffd", "à¤", "à¥", "Ã", "Â")
        all_episode_ids: set[str] = set()
        for story in self.pack["stories"]:
            with self.subTest(story=story["expectation_id"]):
                self.assertEqual(story["consumer_state"], "consumer_complete_en_hi")
                self.assertGreaterEqual(len(story["episodes"]), 7)
                self.assertEqual([row["ordinal"] for row in story["episodes"]], list(range(1, len(story["episodes"]) + 1)))
                self.assertTrue(story["transition"]["en"].strip())
                self.assertTrue(story["transition"]["hi"].strip())
                self.assertTrue(story["boundary_note"].strip())
                for episode in story["episodes"]:
                    self.assertNotIn(episode["episode_id"], all_episode_ids)
                    all_episode_ids.add(episode["episode_id"])
                    self.assertGreaterEqual(len(episode["narration"]["en"].split()), 28)
                    self.assertGreaterEqual(len(episode["narration"]["hi"].split()), 22)
                    for language in ("en", "hi"):
                        value = episode["title"][language] + " " + episode["narration"][language]
                        self.assertFalse(any(marker in value for marker in forbidden), value)

    def test_exact_scan_ranges_resolve_to_the_fixed_carrier_and_correct_kanda(self) -> None:
        expected_ranges = {
            "manas-shiva-sati-parvati-frame": ([113, 172], [47, 107], "Balakanda"),
            "manas-narada-delusion": ([188, 201], [123, 139], "Balakanda"),
            "manas-manu-shatarupa-boon": ([202, 212], [140, 152], "Balakanda"),
            "manas-pratapbhanu-curse": ([212, 244], [152, 187], "Balakanda"),
            "popular-rama-childhood-and-education": ([254, 260], [198, 205], "Balakanda"),
            "manas-pushpavatika-gauri-prayer": ([283, 297], [226, 236], "Balakanda"),
            "manas-kevat-crossing": ([525, 531], [100, 102], "Ayodhyakanda"),
        }
        self.assertEqual(self.pack["source_registry"][0]["scan_sha256"], SCAN_SHA256)
        page_union: set[int] = set()
        for story in self.pack["stories"]:
            alignment = story["source_alignment"]
            scan_range, doha_range, kanda = expected_ranges[story["expectation_id"]]
            self.assertEqual(alignment["scan_pages_inclusive"], scan_range)
            self.assertEqual(alignment["doha_range_inclusive"], doha_range)
            self.assertEqual(alignment["kanda"], kanda)
            for scan_page in range(scan_range[0], scan_range[1] + 1):
                self.assertIn(scan_page, self.pages)
                mapped = sopana_for_page(self.structure, scan_page)
                expected_ordinal = 1 if kanda == "Balakanda" else 2
                self.assertEqual(mapped["ordinal"], expected_ordinal)
                page_union.add(scan_page)
            for episode in story["episodes"]:
                self.assertTrue(set(episode["source_scan_pages"]).issubset(set(range(scan_range[0], scan_range[1] + 1))))
        self.assertEqual(len(page_union), self.pack["batch_counters"]["source_scan_page_union_count"])

    def test_consumer_narration_does_not_copy_long_source_runs(self) -> None:
        def normalize(value: str) -> str:
            return " ".join(re.findall(r"[\w\u0900-\u097f]+", value.casefold()))

        for story in self.pack["stories"]:
            start, end = story["source_alignment"]["scan_pages_inclusive"]
            source_chunks = []
            for page in range(start, end + 1):
                try:
                    source_chunks.append(plaintext_projection(self.pages[page]["content"]))
                except ValueError:
                    continue
            source = " " + normalize(" ".join(source_chunks)) + " "
            for episode in story["episodes"]:
                hindi_tokens = normalize(episode["narration"]["hi"]).split()
                for offset in range(max(0, len(hindi_tokens) - 17)):
                    window = " " + " ".join(hindi_tokens[offset : offset + 18]) + " "
                    self.assertNotIn(window, source, f"long copied source run in {episode['episode_id']}")

    def test_relationship_targets_resolve_and_are_bidirectional_contracts(self) -> None:
        story_ids = {row["story_id"] for row in self.pack["stories"]}
        cycle_ids = {row["story_cycle_id"] for row in self.selected["selected_narrative"]["story_cycles"]}
        entity_ids = {row["entity_id"] for row in self.selected["selected_narrative"]["authored_story_entities"]}
        place_ids = {row["place_id"] for row in self.living_places["records"]}
        registries = {"story": story_ids, "story_cycle": cycle_ids, "entity": entity_ids, "place": place_ids}
        for story in self.pack["stories"]:
            self.assertGreaterEqual(len(story["relationships"]), 4)
            for edge in story["relationships"]:
                self.assertTrue(edge["bidirectional"])
                self.assertTrue(edge["inverse_relationship"])
                self.assertIn(edge["target_id"], registries[edge["target_kind"]])

    def test_completed_supplement_rows_resolve_back_to_this_pack(self) -> None:
        pack_by_expectation = {row["expectation_id"]: row for row in self.pack["stories"]}
        completed = [
            row
            for row in self.supplements["supplements"]
            if row.get("consumer_story_pack_id") == "ramayana-expected-stories-beginnings-exile-v1"
        ]
        self.assertEqual(len(completed), 7)
        for row in completed:
            self.assertEqual(row["consumer_story_pack_id"], "ramayana-expected-stories-beginnings-exile-v1")
            self.assertEqual(row["consumer_story_id"], pack_by_expectation[row["expectation_id"]]["story_id"])
            self.assertIn("aligned", row["source_alignment_state"])

    def test_generated_draft_migration_is_current_and_payload_free(self) -> None:
        result = subprocess.run(
            ["python", "tools/compile_ramayana_expected_story_batch.py", "--check"],
            cwd=ROOT,
            capture_output=True,
            text=True,
            check=False,
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        sql = MIGRATION_PATH.read_text(encoding="utf-8")
        self.assertIn("Expected 7 Ramcharitmanas expected stories", sql)
        self.assertIn("Expected 69 Ramcharitmanas expected-story beats", sql)
        self.assertIn("Expected 138 bilingual beat texts", sql)
        self.assertIn("insert into public.works", sql)
        self.assertIn("insert into public.expressions", sql)
        self.assertIn("fixed_scan_alignment", sql)
        self.assertIn("on conflict (slug) do nothing", sql)
        self.assertIn("'draft'", sql)
        self.assertNotIn("source_vault/objects", sql)
        self.assertNotIn("http://", sql)


if __name__ == "__main__":
    unittest.main()

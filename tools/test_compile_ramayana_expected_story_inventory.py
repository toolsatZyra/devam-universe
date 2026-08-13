import json
import subprocess
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "knowledge_packs/inventories/ramayana-expected-story-checklist-v1.json"
SUPPLEMENTS = ROOT / "knowledge_packs/inventories/ramayana-expected-story-supplements-v1.json"


class RamayanaExpectedStoryInventoryTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = json.loads(OUTPUT.read_text(encoding="utf-8"))
        cls.supplements = json.loads(SUPPLEMENTS.read_text(encoding="utf-8"))

    def test_compiled_inventory_is_current(self):
        result = subprocess.run(
            ["python", "tools/compile_ramayana_expected_story_inventory.py", "--check"],
            cwd=ROOT,
            capture_output=True,
            text=True,
            check=True,
        )
        self.assertIn("is current", result.stdout)

    def test_selected_expression_is_exactly_the_existing_49_cycle_denominator(self):
        rows = self.data["selected_expression_rows"]
        self.assertEqual(len(rows), 49)
        self.assertEqual(len({row["selected_story_cycle_id"] for row in rows}), 49)
        self.assertTrue(all(row["coverage_state"] == "consumer_complete_en_hi_selected_expression" for row in rows))

    def test_supplements_are_unique_bilingual_and_bounded(self):
        rows = self.supplements["supplements"]
        selected_cycle_ids = {row["selected_story_cycle_id"] for row in self.data["selected_expression_rows"]}
        source_ids = {row["source_id"] for row in self.supplements["source_registry"]}
        self.assertGreaterEqual(len(rows), 20)
        self.assertEqual(len({row["expectation_id"] for row in rows}), len(rows))
        for row in rows:
            self.assertTrue(row["title"]["en"].strip())
            self.assertTrue(row["title"]["hi"].strip())
            self.assertNotIn("\ufffd", row["title"]["hi"])
            self.assertNotIn("\u00e0\u00a4", row["title"]["hi"])
            self.assertTrue(row["expression_scopes"])
            self.assertTrue(row["boundary"].strip())
            self.assertNotEqual(row["coverage_state"], "consumer_complete_en_hi_selected_expression")
            self.assertTrue(set(row["nearest_selected_cycle_ids"]).issubset(selected_cycle_ids))
            self.assertTrue(set(row["evidence_source_ids"]).issubset(source_ids))
            self.assertTrue(row["evidence_source_ids"] or "research_needed" in row["source_alignment_state"])

    def test_familiar_later_motifs_are_not_back_projected_into_dutt(self):
        by_id = {row["expectation_id"]: row for row in self.supplements["supplements"]}
        for expectation_id in {
            "popular-lakshman-rekha",
            "popular-shabari-tasted-berries",
            "regional-bridge-squirrel",
            "popular-hanuman-opens-chest",
        }:
            row = by_id[expectation_id]
            self.assertNotIn("ramayana-dutt-selected-expression", row["expression_scopes"])
            if row["coverage_state"] == "consumer_complete_en_hi":
                self.assertTrue(row["consumer_story_id"].startswith("ramayana-"))
                self.assertNotEqual(row["consumer_story_pack_id"], "ramayana-dutt-consumer-v1")

    def test_counters_keep_selected_and_supplemental_claims_separate(self):
        counters = self.data["counters"]
        self.assertEqual(counters["selected_expression_story_cycles"], 49)
        self.assertEqual(counters["supplemental_expected_stories"], len(self.data["supplemental_rows"]))
        self.assertEqual(counters["supplemental_rows_complete_en_hi"], 17)
        self.assertEqual(counters["supplemental_rows_open"], len(self.data["supplemental_rows"]) - 17)
        self.assertEqual(self.data["completion_state"], "supplemental_expected_story_authoring_required")

    def test_four_major_batches_project_exactly_seventeen_canonical_story_ids(self):
        completed = [row for row in self.data["supplemental_rows"] if row["coverage_state"] == "consumer_complete_en_hi"]
        self.assertEqual(len(completed), 17)
        self.assertEqual(len({row["consumer_story_id"] for row in completed}), 17)
        self.assertEqual(
            {row["consumer_story_pack_id"] for row in completed},
            {
                "ramayana-expected-stories-beginnings-exile-v1",
                "ramayana-expected-stories-war-messengers-v1",
                "ramayana-expected-stories-uttarkanda-frames-v1",
                "ramayana-expected-stories-popular-living-bridges-v1",
            },
        )
        self.assertEqual(
            self.data["authoritative_inputs"]["consumer_story_packs"],
            [
                "knowledge_packs/library_lanes/ramayana/expected-stories-beginnings-exile-v1.json",
                "knowledge_packs/library_lanes/ramayana/expected-stories-war-messengers-v1.json",
                "knowledge_packs/library_lanes/ramayana/expected-stories-uttarkanda-frames-v1.json",
                "knowledge_packs/library_lanes/ramayana/expected-stories-popular-living-bridges-v1.json",
            ],
        )

    def test_compiled_checklist_does_not_duplicate_authored_titles_boundaries_or_sources(self):
        self.assertEqual(
            {row["expectation_id"] for row in self.data["supplemental_rows"]},
            {row["expectation_id"] for row in self.supplements["supplements"]},
        )
        self.assertTrue(all("title" not in row and "boundary" not in row and "evidence_source_ids" not in row for row in self.data["supplemental_rows"]))
        self.assertEqual(set(self.data["source_registry_ids"]), {row["source_id"] for row in self.supplements["source_registry"]})


if __name__ == "__main__":
    unittest.main()

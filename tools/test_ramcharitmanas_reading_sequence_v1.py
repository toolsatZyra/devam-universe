import json
import unittest
from pathlib import Path

from tools.validate_ramcharitmanas_reading_sequence_v1 import validate_sequence


ROOT = Path(__file__).resolve().parents[1]
MVP_PATH = ROOT / "knowledge_packs/inventories/consumer-content-mvp-v1.json"
COVERAGE_PATH = ROOT / "knowledge_packs/inventories/story-universe-coverage-v1.json"
MIGRATION_PATH = ROOT / "supabase/migrations/20260814040000_add_devotional_reading_model.sql"


class RamcharitmanasReadingSequenceTests(unittest.TestCase):
    def test_all_registered_batches_share_one_gapless_sequence(self) -> None:
        result = validate_sequence()
        self.assertEqual(result["result"], "PASS")
        self.assertEqual(result["completed_passages"], 109)
        self.assertEqual(result["completed_source_units"], 578)
        self.assertEqual(result["ayodhya_forward_endpoint"], 39)
        self.assertEqual(result["complete_full_kandas"], 0)
        self.assertFalse(result["complete_work"])

    def test_inventories_and_reusable_resume_schema_match(self) -> None:
        mvp = json.loads(MVP_PATH.read_text(encoding="utf-8"))
        coverage = json.loads(COVERAGE_PATH.read_text(encoding="utf-8"))
        mvp_lane = next(row for row in mvp["lanes"] if row["lane_id"] == "ramcharitmanas-daily-reading")
        coverage_lane = next(row for row in coverage["collections"] if row["collection_id"] == "ramcharitmanas-daily-reading")
        self.assertEqual(mvp_lane["current"]["consumer_complete_source_units"], 578)
        self.assertEqual(coverage_lane["denominator"]["completed_source_units"], 578)
        self.assertEqual(mvp_lane["current"]["contiguous_forward_endpoint"], "Ayodhyakanda doha 39")
        migration = MIGRATION_PATH.read_text(encoding="utf-8")
        for token in ("reading_sequences", "reading_passages", "reading_units", "user_reading_progress", "last_completed_unit_key"):
            self.assertIn(token, migration)
        self.assertNotIn("ramcharitmanas-ayodhyakanda-0023", migration)


if __name__ == "__main__":
    unittest.main()

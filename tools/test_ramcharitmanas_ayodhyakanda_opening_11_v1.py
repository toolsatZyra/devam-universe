import json
import unittest
from pathlib import Path

from tools.validate_ramcharitmanas_ayodhyakanda_opening_11_v1 import load_pack, validate_pack


ROOT = Path(__file__).resolve().parents[1]
CONTRACT_PATH = ROOT / "knowledge_packs/devotional/ramcharitmanas-reading-contract-v1.json"
MVP_PATH = ROOT / "knowledge_packs/inventories/consumer-content-mvp-v1.json"
COVERAGE_PATH = ROOT / "knowledge_packs/inventories/story-universe-coverage-v1.json"
MIGRATION_PATH = ROOT / "supabase/migrations/20260814040000_add_devotional_reading_model.sql"


class RamcharitmanasAyodhyakandaOpening11Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.pack = load_pack()
        cls.contract = json.loads(CONTRACT_PATH.read_text(encoding="utf-8"))
        cls.mvp = json.loads(MVP_PATH.read_text(encoding="utf-8"))
        cls.coverage = json.loads(COVERAGE_PATH.read_text(encoding="utf-8"))

    def test_pack_validation(self) -> None:
        result = validate_pack(self.pack)
        self.assertEqual(result["result"], "PASS")
        self.assertEqual(result["passage_count"], 12)
        self.assertEqual(result["source_unit_count"], 59)
        self.assertEqual(result["bilingual_meaning_count"], 24)
        self.assertFalse(result["complete_work"])

    def test_invocation_and_groups_are_contiguous(self) -> None:
        labels = [row["canonical_group_label"] for row in self.pack["passages"]]
        self.assertEqual(labels, ["invocation"] + [str(value) for value in range(1, 12)])
        self.assertEqual(self.pack["passages"][0]["source_order_key"], "02:0000")
        self.assertEqual(self.pack["passages"][-1]["source_order_key"], "02:0011")
        self.assertIsNone(self.pack["passages"][0]["previous_passage_id"])
        self.assertEqual(
            self.pack["passages"][-1]["next_passage_id"],
            "ramcharitmanas-ayodhyakanda-0012",
        )

    def test_full_book_remains_primary_and_daily_modes_are_optional(self) -> None:
        reading = self.pack["reading_contract"]
        self.assertIn("full selected lawful expression", reading["whole_work"])
        self.assertIn("one incomplete interval", reading["whole_work"])
        self.assertIn("may stop", reading["one_passage_daily"])
        self.assertIn("may stop", reading["one_source_unit_daily"])
        self.assertIn("Exact position", reading["resume"])
        self.assertFalse(self.pack["selected_scope"]["complete_work"])

    def test_contract_counts_and_forward_endpoint_match(self) -> None:
        progress = self.contract["canonical_reading_progress"]
        self.assertEqual(progress["completed_passages"], 212)
        self.assertEqual(progress["completed_source_units"], 1097)
        self.assertEqual(progress["completed_full_divisions"], 0)
        self.assertEqual(len(progress["completed_contiguous_batches"]), 6)
        opening = progress["completed_contiguous_batches"][1]
        self.assertEqual(opening["canonical_group_start"], "invocation")
        self.assertEqual(opening["canonical_group_end"], 11)
        self.assertFalse(opening["complete_division"])

    def test_inventories_match_the_reviewed_selected_scope(self) -> None:
        mvp_lane = next(row for row in self.mvp["lanes"] if row["lane_id"] == "ramcharitmanas-daily-reading")
        coverage_lane = next(row for row in self.coverage["collections"] if row["collection_id"] == "ramcharitmanas-daily-reading")
        self.assertEqual(mvp_lane["current"]["consumer_complete_contiguous_passages"], 212)
        self.assertEqual(mvp_lane["current"]["consumer_complete_source_units"], 1097)
        self.assertEqual(mvp_lane["current"]["contiguous_forward_endpoint"], "Ayodhyakanda doha 142")
        self.assertEqual(coverage_lane["denominator"]["completed_contiguous_passages"], 212)
        self.assertEqual(coverage_lane["denominator"]["completed_source_units"], 1097)
        self.assertEqual(coverage_lane["denominator"]["contiguous_forward_endpoint"], "Ayodhyakanda doha 142")
        self.assertFalse(mvp_lane["current"]["complete_end_to_end_reading_available"])
        self.assertEqual(coverage_lane["completion"]["consumer_complete_full_kandas"], 0)

    def test_existing_migration_supports_exact_resume_without_payload_copy(self) -> None:
        migration = MIGRATION_PATH.read_text(encoding="utf-8")
        for token in (
            "reading_sequences", "reading_passages", "reading_units",
            "user_reading_progress", "last_completed_unit_key", "source_order_key",
        ):
            self.assertIn(token, migration)
        self.assertNotIn("ramcharitmanas-ayodhyakanda", migration)


if __name__ == "__main__":
    unittest.main()

import json
import unittest
from pathlib import Path

from tools.validate_ramcharitmanas_ayodhyakanda_12_22_v1 import load_pack, validate_pack


ROOT = Path(__file__).resolve().parents[1]
CONTRACT_PATH = ROOT / "knowledge_packs/devotional/ramcharitmanas-reading-contract-v1.json"
MVP_PATH = ROOT / "knowledge_packs/inventories/consumer-content-mvp-v1.json"
COVERAGE_PATH = ROOT / "knowledge_packs/inventories/story-universe-coverage-v1.json"
MIGRATION_PATH = ROOT / "supabase/migrations/20260814040000_add_devotional_reading_model.sql"


class RamcharitmanasAyodhyakanda12To22Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.pack = load_pack()
        cls.contract = json.loads(CONTRACT_PATH.read_text(encoding="utf-8"))
        cls.mvp = json.loads(MVP_PATH.read_text(encoding="utf-8"))
        cls.coverage = json.loads(COVERAGE_PATH.read_text(encoding="utf-8"))

    def test_pack_validation(self) -> None:
        result = validate_pack(self.pack)
        self.assertEqual(result["result"], "PASS")
        self.assertEqual(result["passage_count"], 11)
        self.assertEqual(result["source_unit_count"], 55)
        self.assertEqual(result["bilingual_meaning_count"], 22)
        self.assertFalse(result["complete_work"])

    def test_episode_is_contiguous_and_stops_before_kaikeyi_acts(self) -> None:
        passages = self.pack["passages"]
        self.assertEqual([int(row["canonical_group_label"]) for row in passages], list(range(12, 23)))
        self.assertEqual(passages[0]["source_order_key"], "02:0012")
        self.assertEqual(passages[-1]["source_order_key"], "02:0022")
        self.assertIn("anger-chamber", self.pack["selected_scope"]["boundary"])
        self.assertIn("group 23", self.pack["selected_scope"]["boundary"])

    def test_bilingual_aids_preserve_manipulation_and_safety_boundaries(self) -> None:
        combined = json.dumps(self.pack["passages"], ensure_ascii=False).lower()
        for term in ("manipulation", "disability", "self-harm", "coercive", "not verified"):
            self.assertIn(term, combined)
        for term in ("विकलांगता", "दबाव", "शपथ", "वनवास", "कोपभवन"):
            self.assertIn(term, combined)
        self.assertEqual(len({row["meaning"]["en"] for row in self.pack["passages"]}), 11)
        self.assertEqual(len({row["meaning"]["hi"] for row in self.pack["passages"]}), 11)

    def test_whole_book_remains_primary_and_daily_pacing_optional(self) -> None:
        reading = self.pack["reading_contract"]
        self.assertIn("full selected lawful expression", reading["whole_work"])
        self.assertIn("may stop", reading["one_passage_daily"])
        self.assertIn("may stop", reading["one_source_unit_daily"])
        self.assertFalse(self.pack["selected_scope"]["complete_division"])
        self.assertFalse(self.pack["selected_scope"]["complete_work"])

    def test_contract_and_inventories_agree_on_cumulative_boundary(self) -> None:
        progress = self.contract["canonical_reading_progress"]
        self.assertEqual(progress["completed_passages"], 258)
        self.assertEqual(progress["completed_source_units"], 1329)
        self.assertEqual(len(progress["completed_contiguous_batches"]), 7)
        this_batch = progress["completed_contiguous_batches"][2]
        self.assertEqual((this_batch["canonical_group_start"], this_batch["canonical_group_end"]), (12, 22))
        mvp_lane = next(row for row in self.mvp["lanes"] if row["lane_id"] == "ramcharitmanas-daily-reading")
        coverage_lane = next(row for row in self.coverage["collections"] if row["collection_id"] == "ramcharitmanas-daily-reading")
        self.assertEqual(mvp_lane["current"]["contiguous_forward_endpoint"], "Ayodhyakanda doha 188")
        self.assertEqual(coverage_lane["denominator"]["completed_source_units"], 1329)
        self.assertEqual(coverage_lane["completion"]["consumer_complete_full_kandas"], 0)

    def test_existing_schema_supports_sequence_and_exact_resume_without_payload_copy(self) -> None:
        migration = MIGRATION_PATH.read_text(encoding="utf-8")
        for token in ("reading_sequences", "reading_passages", "reading_units", "user_reading_progress", "last_completed_unit_key"):
            self.assertIn(token, migration)
        self.assertNotIn("ramcharitmanas-ayodhyakanda-0012", migration)


if __name__ == "__main__":
    unittest.main()

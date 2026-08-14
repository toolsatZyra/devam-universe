import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MANAS_PATH = ROOT / "knowledge_packs/devotional/ramcharitmanas-reading-contract-v1.json"
MANAS_REPORT_PATH = ROOT / "ingestion/reports/ramcharitmanas-wikisource-product-ingestion-v1.json"
CHALISA_PATH = ROOT / "knowledge_packs/devotional/hanuman-chalisa-consumer-v1.json"
CONSUMER_INVENTORY_PATH = ROOT / "knowledge_packs/inventories/consumer-content-mvp-v1.json"
COVERAGE_INVENTORY_PATH = ROOT / "knowledge_packs/inventories/story-universe-coverage-v1.json"


class DevotionalEndToEndReadingContractTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.manas = json.loads(MANAS_PATH.read_text(encoding="utf-8"))
        cls.manas_report = json.loads(MANAS_REPORT_PATH.read_text(encoding="utf-8"))
        cls.chalisa = json.loads(CHALISA_PATH.read_text(encoding="utf-8"))
        cls.consumer_inventory = json.loads(CONSUMER_INVENTORY_PATH.read_text(encoding="utf-8"))
        cls.coverage_inventory = json.loads(COVERAGE_INVENTORY_PATH.read_text(encoding="utf-8"))

    def test_ramcharitmanas_denominator_matches_the_fixed_source_report(self):
        denominator = self.manas["source_denominator"]
        self.assertEqual(denominator["text_bearing_pages"], self.manas_report["text_bearing_page_denominator"])
        self.assertEqual(denominator["prepared_product_passages"], self.manas_report["published_passage_count"])
        self.assertEqual(denominator["held_text_bearing_pages"], self.manas_report["remaining_text_correction_page_count"])
        self.assertEqual(denominator["text_bearing_pages"], denominator["prepared_product_passages"] + denominator["held_text_bearing_pages"])
        self.assertEqual(denominator["scan_coordinates"], denominator["text_bearing_pages"] + denominator["structural_blank_pages"])

    def test_ramcharitmanas_modes_cover_whole_page_passage_kanda_and_resume_reading(self):
        modes = {row["mode_id"]: row for row in self.manas["reading_modes"]}
        self.assertEqual(
            {"complete_work_continuous", "one_page_daily", "short_passage_daily", "one_source_unit_daily", "kanda_progression", "resume_exact_position"},
            set(modes),
        )
        self.assertEqual(modes["complete_work_continuous"]["progression"], "first_source_unit_to_last_without_gaps")
        self.assertEqual(modes["one_source_unit_daily"]["progression"], "next_unread_source_unit")
        self.assertIn("chaupai, doha, soratha, chhand", modes["one_source_unit_daily"]["boundary"])
        self.assertEqual(modes["kanda_progression"]["progression"], "1_to_7")
        self.assertTrue(all(row["label"]["en"] and row["label"]["hi"] for row in modes.values()))
        self.assertTrue(all(row["availability"] != "consumer_complete" for row in modes.values()))
        self.assertIn("beginning to end", self.manas["completion_rule"])
        self.assertIn("Story summaries", self.manas["completion_rule"])
        self.assertEqual(self.manas["canonical_reading_progress"]["completed_passages"], 258)
        self.assertEqual(self.manas["canonical_reading_progress"]["completed_source_units"], 1329)
        self.assertEqual(self.manas["canonical_reading_progress"]["completed_full_divisions"], 0)
        batches = self.manas["canonical_reading_progress"]["completed_contiguous_batches"]
        self.assertEqual(len(batches), 7)
        batch = batches[0]
        self.assertTrue(batch["reaches_division_end"])
        self.assertFalse(batch["complete_division"])
        self.assertEqual(batches[1]["canonical_group_start"], "invocation")
        self.assertEqual(batches[1]["canonical_group_end"], 11)
        self.assertFalse(batches[1]["reaches_division_end"])
        self.assertEqual(batches[2]["canonical_group_start"], 12)
        self.assertEqual(batches[2]["canonical_group_end"], 22)
        self.assertEqual(batches[3]["canonical_group_start"], 23)
        self.assertEqual(batches[3]["canonical_group_end"], 39)
        self.assertEqual(batches[4]["canonical_group_start"], 40)
        self.assertEqual(batches[4]["canonical_group_end"], 78)
        self.assertEqual(batches[5]["canonical_group_start"], 79)
        self.assertEqual(batches[5]["canonical_group_end"], 142)
        self.assertEqual(batches[6]["canonical_group_start"], 143)
        self.assertEqual(batches[6]["canonical_group_end"], 188)
        self.assertIn("commentary", self.manas["canonical_reading_progress"]["boundary"])
        consumer_lane = next(row for row in self.consumer_inventory["lanes"] if row["lane_id"] == "ramcharitmanas-daily-reading")
        coverage_lane = next(row for row in self.coverage_inventory["collections"] if row["collection_id"] == "ramcharitmanas-daily-reading")
        self.assertEqual(consumer_lane["current"]["defined_reading_modes"], len(modes))
        self.assertEqual(coverage_lane["denominator"]["reading_modes"], len(modes))

    def test_hanuman_chalisa_is_complete_in_source_order_with_bilingual_meaning(self):
        readings = self.chalisa["readings"]
        self.assertEqual(len(readings), 43)
        self.assertEqual([row["ordinal"] for row in readings], list(range(1, 44)))
        self.assertTrue(all(row["text"].strip() for row in readings))
        self.assertTrue(all(row["meaning"]["hi"].strip() and row["meaning"]["en"].strip() for row in readings))

    def test_hanuman_chalisa_supports_complete_daily_and_resume_modes_without_prescription(self):
        modes = {row["mode_id"]: row for row in self.chalisa["reading_modes"]}
        self.assertEqual({"complete_recitation", "one_reading_unit_daily", "resume_exact_position"}, set(modes))
        self.assertEqual(modes["complete_recitation"]["availability"], "consumer_content_available")
        self.assertEqual(modes["one_reading_unit_daily"]["availability"], "consumer_content_available")
        self.assertEqual(modes["resume_exact_position"]["availability"], "product_persistence_pending")
        self.assertTrue(all("boundary" in row for row in modes.values()))
        self.assertIn("end-to-end recitation", self.chalisa["daily_path"]["completion_state"])

    def test_hindi_labels_are_valid_utf8_not_mojibake(self):
        raw = MANAS_PATH.read_text(encoding="utf-8") + CHALISA_PATH.read_text(encoding="utf-8")
        self.assertNotIn("�", raw)
        self.assertNotIn("à¤", raw)


if __name__ == "__main__":
    unittest.main()

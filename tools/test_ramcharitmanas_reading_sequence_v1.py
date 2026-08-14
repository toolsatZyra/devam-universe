import json
import unittest
from pathlib import Path

from tools.validate_ramcharitmanas_reading_sequence_v1 import validate_sequence


ROOT = Path(__file__).resolve().parents[1]
MVP_PATH = ROOT / "knowledge_packs/inventories/consumer-content-mvp-v1.json"
COVERAGE_PATH = ROOT / "knowledge_packs/inventories/story-universe-coverage-v1.json"
MIGRATION_PATH = ROOT / "supabase/migrations/20260814040000_add_devotional_reading_model.sql"
FAMILY_ARC_PATH = ROOT / "knowledge_packs/devotional/ramcharitmanas-ayodhyakanda-40-78-v1.json"
JOURNEY_ARC_PATH = ROOT / "knowledge_packs/devotional/ramcharitmanas-ayodhyakanda-79-142-v1.json"


class RamcharitmanasReadingSequenceTests(unittest.TestCase):
    def test_all_registered_batches_share_one_gapless_sequence(self) -> None:
        result = validate_sequence()
        self.assertEqual(result["result"], "PASS")
        self.assertEqual(result["completed_passages"], 212)
        self.assertEqual(result["completed_source_units"], 1097)
        self.assertEqual(result["ayodhya_forward_endpoint"], 142)
        self.assertEqual(result["complete_full_kandas"], 0)
        self.assertFalse(result["complete_work"])

    def test_family_decision_arc_is_source_ordered_and_bilingual(self) -> None:
        pack = json.loads(FAMILY_ARC_PATH.read_text(encoding="utf-8"))
        passages = pack["passages"]
        units = [unit for passage in passages for unit in passage["source_units"]]
        self.assertEqual([int(row["canonical_group_label"]) for row in passages], list(range(40, 79)))
        self.assertEqual(len(passages), 39)
        self.assertEqual(len(units), 197)
        self.assertEqual(passages[0]["source_locator"]["scan_pages"], [466])
        self.assertEqual(passages[-1]["source_locator"]["scan_pages"], [503, 504])
        self.assertTrue(all(len(row["meaning"]["en"]) >= 250 for row in passages))
        self.assertTrue(all(len(row["meaning"]["hi"]) >= 200 for row in passages))
        self.assertTrue(all(row["source_units"][-1]["unit_kind"] in {"doha", "soratha"} for row in passages))
        self.assertTrue(all(
            [evidence["scan_page"] for evidence in row["source_locator"]["page_evidence"]]
            == row["source_locator"]["scan_pages"]
            for row in passages
        ))

    def test_departure_to_chitrakoot_arc_is_source_ordered_and_bilingual(self) -> None:
        pack = json.loads(JOURNEY_ARC_PATH.read_text(encoding="utf-8"))
        passages = pack["passages"]
        units = [unit for passage in passages for unit in passage["source_units"]]
        self.assertEqual([int(row["canonical_group_label"]) for row in passages], list(range(79, 143)))
        self.assertEqual(len(passages), 64)
        self.assertEqual(len(units), 322)
        self.assertEqual(passages[0]["source_locator"]["scan_pages"], [504, 505])
        self.assertEqual(passages[-1]["source_locator"]["scan_pages"], [567])
        self.assertTrue(all(len(row["meaning"]["en"]) >= 180 for row in passages))
        self.assertTrue(all(len(row["meaning"]["hi"]) >= 140 for row in passages))
        self.assertTrue(all(row["source_units"][-1]["unit_kind"] in {"doha", "soratha"} for row in passages))
        self.assertEqual([unit["batch_unit_ordinal"] for unit in units], list(range(1, 323)))
        self.assertTrue(all(
            [evidence["scan_page"] for evidence in row["source_locator"]["page_evidence"]]
            == row["source_locator"]["scan_pages"]
            for row in passages
        ))
        combined = json.dumps(passages, ensure_ascii=False).lower()
        for term in ("unpaid labour", "stated agency", "local expertise", "not verified", "not universal"):
            self.assertIn(term, combined)
        for term in ("बिना मजदूरी", "व्यक्त इच्छा", "स्थानीय ज्ञान", "सत्यापित", "अनिवार्य"):
            self.assertIn(term, combined)

    def test_inventories_and_reusable_resume_schema_match(self) -> None:
        mvp = json.loads(MVP_PATH.read_text(encoding="utf-8"))
        coverage = json.loads(COVERAGE_PATH.read_text(encoding="utf-8"))
        mvp_lane = next(row for row in mvp["lanes"] if row["lane_id"] == "ramcharitmanas-daily-reading")
        coverage_lane = next(row for row in coverage["collections"] if row["collection_id"] == "ramcharitmanas-daily-reading")
        self.assertEqual(mvp_lane["current"]["consumer_complete_source_units"], 1097)
        self.assertEqual(coverage_lane["denominator"]["completed_source_units"], 1097)
        self.assertEqual(mvp_lane["current"]["contiguous_forward_endpoint"], "Ayodhyakanda doha 142")
        migration = MIGRATION_PATH.read_text(encoding="utf-8")
        for token in ("reading_sequences", "reading_passages", "reading_units", "user_reading_progress", "last_completed_unit_key"):
            self.assertIn(token, migration)
        self.assertNotIn("ramcharitmanas-ayodhyakanda-0023", migration)
        self.assertNotIn("ramcharitmanas-ayodhyakanda-0079", migration)


if __name__ == "__main__":
    unittest.main()

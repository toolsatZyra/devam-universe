import hashlib
import json
import unittest
from pathlib import Path

from tools.validate_ramcharitmanas_balakanda_293_339_v1 import expected_kinds_for_group, load_pack, validate_pack
from tools.compile_source_vault_tei_ingestion import canonical_json


ROOT = Path(__file__).resolve().parents[1]
PACK_PATH = ROOT / "knowledge_packs/devotional/ramcharitmanas-balakanda-293-339-v1.json"
CONTRACT_PATH = ROOT / "knowledge_packs/devotional/ramcharitmanas-reading-contract-v1.json"
MODEL_MIGRATION = ROOT / "supabase/migrations/20260814040000_add_devotional_reading_model.sql"


class RamcharitmanasBalakanda293To339Test(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pack = json.loads(PACK_PATH.read_text(encoding="utf-8", errors="strict"))
        cls.contract = json.loads(CONTRACT_PATH.read_text(encoding="utf-8", errors="strict"))

    def test_pack_is_deterministic_and_fixed_to_the_pinned_source_evidence(self):
        self.assertEqual(load_pack(), self.pack)
        report = validate_pack(self.pack)
        self.assertEqual(report["result"], "PASS")
        self.assertEqual(report["tracked_corpus_copies"], 1)
        core = {key: value for key, value in self.pack.items() if key != "pack_sha256"}
        expected = hashlib.sha256(canonical_json(core).encode("utf-8")).hexdigest()
        self.assertEqual(expected, self.pack["pack_sha256"])
        self.assertEqual(
            self.pack["source_and_rights"]["fixed_scan_sha256"],
            "6d570d531ebada1912f6e930212393fec2200765a0b731b73b8e7135ea0f70f2",
        )

    def test_interval_is_exactly_forty_seven_contiguous_passages_and_264_units(self):
        passages = self.pack["passages"]
        self.assertEqual([int(row["canonical_group_label"]) for row in passages], list(range(293, 340)))
        self.assertEqual(len(passages), 47)
        self.assertEqual(sum(row["source_unit_count"] for row in passages), 264)
        units = [unit for passage in passages for unit in passage["source_units"]]
        self.assertEqual([unit["batch_unit_ordinal"] for unit in units], list(range(1, 265)))
        self.assertEqual([unit["source_order_key"] for unit in units], sorted(unit["source_order_key"] for unit in units))
        self.assertEqual(len({unit["unit_id"] for unit in units}), 264)
        self.assertTrue(all(unit["exact_text"].strip() for unit in units))

    def test_each_passage_preserves_its_natural_chaupai_chhand_and_closing_units(self):
        for passage in self.pack["passages"]:
            kinds = [unit["unit_kind"] for unit in passage["source_units"]]
            self.assertEqual(kinds[:4], ["chaupai"] * 4)
            group = int(passage["canonical_group_label"])
            expected = expected_kinds_for_group(group)
            self.assertEqual(kinds, expected)
            self.assertEqual(passage["source_unit_count"], len(expected))

    def test_every_passage_has_fresh_approachable_hindi_and_english_meaning(self):
        for passage in self.pack["passages"]:
            self.assertGreaterEqual(len(passage["meaning"]["hi"]), 180)
            self.assertGreaterEqual(len(passage["meaning"]["en"]), 180)
            self.assertTrue(passage["title"]["hi"].strip())
            self.assertTrue(passage["title"]["en"].strip())
        self.assertEqual(self.pack["completion_state"], "consumer_complete_en_hi_for_selected_contiguous_interval")
        self.assertFalse(self.pack["selected_scope"]["complete_work"])
        self.assertIn("remains incomplete", self.pack["complete_work_denial"])

    def test_new_interval_keeps_devotional_poetic_and_social_claims_bounded(self):
        meanings = {int(row["canonical_group_label"]): row["meaning"] for row in self.pack["passages"]}
        self.assertIn("not to modern event reporting", meanings[306]["en"])
        self.assertIn("hierarchy is descriptive", meanings[308]["en"])
        self.assertIn("not presented as a mandatory rule", meanings[310]["en"])
        self.assertIn("not scientific certainty", meanings[312]["en"])
        self.assertIn("not as a claim of historically recorded aerial travel", meanings[314]["en"])
        self.assertIn("not a consumer guarantee", meanings[315]["en"])
        self.assertIn("not zoology", meanings[316]["en"])
        self.assertIn("not approval of punishment or deception", meanings[317]["en"])
        self.assertIn("intentionally miraculous devotional scene", meanings[318]["en"])
        self.assertIn("not a mandatory modern wedding checklist", meanings[319]["en"])
        self.assertIn("does not establish a universal social ranking", meanings[320]["en"])
        self.assertIn("not eyewitness history", meanings[321]["en"])
        self.assertIn("not be turned into a body standard", meanings[322]["en"])
        self.assertIn("does not license invented dialogue or motives", meanings[323]["en"])
        self.assertIn("claim that a bride is property", meanings[324]["en"])
        self.assertIn("individual brides' deliberations are not narrated", meanings[325]["en"])
        self.assertIn("not endorsed as a modern dowry", meanings[326]["en"])
        self.assertIn("not body standards, mandatory rites", meanings[327]["en"])
        self.assertIn("not authorize insults, harassment", meanings[329]["en"])
        self.assertIn("not a verified inventory", meanings[331]["en"])
        self.assertIn("not audited logistics", meanings[333]["en"])
        self.assertIn("not universal relationship guidance", meanings[334]["en"])
        self.assertIn("Sita does not speak here", meanings[336]["en"])
        self.assertIn("not zoological evidence", meanings[338]["en"])
        self.assertIn("not modern prescriptions", meanings[339]["en"])

    def test_scan_coordinates_and_reference_only_boundary_are_explicit(self):
        pages = {page for passage in self.pack["passages"] for page in passage["source_locator"]["scan_pages"]}
        self.assertEqual(pages, set(range(354, 405)))
        for passage in self.pack["passages"]:
            evidence = passage["source_locator"]["page_evidence"]
            self.assertEqual([row["scan_page"] for row in evidence], passage["source_locator"]["scan_pages"])
            self.assertTrue(all(row["provider_revision_id"] > 0 for row in evidence))
            self.assertTrue(all(len(row["revision_content_sha256"]) == 64 for row in evidence))
        references = self.pack["source_and_rights"]["reference_only_not_product_carriers"]
        self.assertTrue(all("not" in row["role"].lower() for row in references))
        self.assertIn("not retained or copied", references[0]["role"])

    def test_reading_contract_counts_the_batch_without_counting_old_commentary(self):
        progress = self.contract["canonical_reading_progress"]
        self.assertEqual(progress["completed_passages"], 47)
        self.assertEqual(progress["completed_source_units"], 264)
        self.assertIn("not the remaining consumer source-text denominator", progress["boundary"])
        self.assertIn("Old-edition commentary is optional", self.contract["completion_rule"])
        self.assertIn("Story summaries", self.contract["completion_rule"])

    def test_reading_schema_supports_sequence_passage_unit_and_exact_user_progress(self):
        sql = MODEL_MIGRATION.read_text(encoding="utf-8", errors="strict")
        for table in (
            "reading_sequences",
            "reading_passages",
            "reading_passage_texts",
            "reading_units",
            "user_reading_progress",
        ):
            self.assertIn(f"public.{table}", sql)
        self.assertIn("auth.uid() = user_id", sql)
        self.assertIn("last_completed_passage_key", sql)
        self.assertIn("last_completed_unit_key", sql)
        self.assertNotIn("service_role", sql)

    def test_corpus_payload_is_not_duplicated_into_a_seed_migration_or_validator(self):
        seed = ROOT / "supabase/migrations/20260814041000_seed_ramcharitmanas_balakanda_293_305.sql"
        validator = ROOT / "tools/validate_ramcharitmanas_balakanda_293_339_v1.py"
        self.assertFalse(seed.exists())
        validator_text = validator.read_text(encoding="utf-8", errors="strict")
        self.assertNotIn(self.pack["passages"][0]["source_units"][0]["exact_text"], validator_text)
        self.assertNotIn(self.pack["passages"][0]["meaning"]["en"], validator_text)

    def test_utf8_is_valid_without_common_mojibake(self):
        raw = PACK_PATH.read_bytes()
        text = raw.decode("utf-8", errors="strict")
        self.assertEqual(text.encode("utf-8"), raw)
        self.assertNotIn("ï¿½", text)
        self.assertNotIn("Ã Â¤", text)
        self.assertIn("तदपि प्रीति कै रीति सुहाई", text)
        self.assertNotIn("तदपि प्रीति कै प्रीति सुहाई", text)


if __name__ == "__main__":
    unittest.main()

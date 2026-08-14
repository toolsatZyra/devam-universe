from __future__ import annotations

import hashlib
import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PACK = ROOT / "knowledge_packs/devotional/hanuman-chalisa-consumer-v1.json"


class HanumanChalisaConsumerPackTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        raw = PACK.read_bytes()
        cls.raw = raw
        cls.pack = json.loads(raw.decode("utf-8", errors="strict"))

    def test_complete_source_order_and_bilingual_meaning(self) -> None:
        readings = self.pack["readings"]
        self.assertEqual([row["ordinal"] for row in readings], list(range(1, 44)))
        self.assertEqual([row["source_number"] for row in readings if row["kind"] == "chaupai"], list(range(1, 41)))
        self.assertIn("printed labels 1-20", self.pack["source_expression"]["numbering_note"])
        self.assertEqual(sum(row["kind"] == "opening_doha" for row in readings), 2)
        self.assertEqual(sum(row["kind"] == "chaupai" for row in readings), 40)
        self.assertEqual(sum(row["kind"] == "closing_doha" for row in readings), 1)
        self.assertTrue(all("\n" in row["text"] and "�" not in row["text"] for row in readings))
        self.assertTrue(all(len(row["meaning"]["en"]) >= 60 and len(row["meaning"]["hi"]) >= 50 for row in readings))

    def test_fixed_carrier_and_rights_revision_are_one_copy_vault_objects(self) -> None:
        source = self.pack["source_expression"]
        image = ROOT / "source_vault" / source["fixed_carrier_object"]
        rights = ROOT / "source_vault/objects/sha256/ca/ca3a6f1ee697889245befa79e3311278452eb9daf29d5241c60ae936744750cb"
        self.assertEqual(image.stat().st_size, source["fixed_carrier_bytes"])
        self.assertEqual(hashlib.sha256(image.read_bytes()).hexdigest(), source["fixed_carrier_sha256"])
        self.assertEqual(hashlib.sha256(rights.read_bytes()).hexdigest(), source["rights_revision_sha256"])
        rights_payload = json.loads(rights.read_text(encoding="utf-8"))
        revision = rights_payload["query"]["pages"][0]["revisions"][0]
        self.assertEqual(revision["revid"], 1187801078)
        self.assertIn("{{self|cc-by-sa-4.0}}", revision["slots"]["main"]["content"])

    def test_scope_is_consumer_first_without_overclaiming(self) -> None:
        self.assertEqual(self.pack["status"], "beta_product_ready")
        self.assertEqual(self.pack["work"]["language_code"], "awa")
        self.assertIn("not a Sanskrit text", self.pack["work"]["consumer_note"]["en"])
        self.assertFalse(self.pack["source_expression"]["source_original_claimed"])
        self.assertFalse(self.pack["source_expression"]["critical_edition_claimed"])
        self.assertEqual(self.pack["source_expression"]["rights_lane"], "derivative_allowed")
        self.assertIn("medical advice", self.pack["scope"]["devotional_claim_boundary"]["en"])
        self.assertEqual(self.pack["daily_path"]["cycle_length"], 43)
        self.assertIn("All 43 units", self.pack["daily_path"]["completion_state"])


if __name__ == "__main__":
    unittest.main()

import json
import subprocess
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "knowledge_packs/inventories/ramayana-source-term-reconciliation-v1.json"


class RamayanaSourceTermReconciliationTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = json.loads(OUTPUT.read_text(encoding="utf-8"))

    def test_compiled_inventory_is_current(self):
        result = subprocess.run(
            ["python", "tools/compile_ramayana_source_term_reconciliation.py", "--check"],
            cwd=ROOT,
            capture_output=True,
            text=True,
            check=True,
        )
        self.assertIn("is current", result.stdout)

    def test_covers_exact_selected_source_denominator_without_copying_prose(self):
        self.assertEqual(self.data["source_expression"]["source_unit_count"], 652)
        self.assertFalse(self.data["source_payloads_copied"])
        self.assertGreater(self.data["counters"]["candidate_terms"], 1000)
        self.assertEqual(
            len(self.data["resolved_records"]),
            self.data["counters"]["exact_authored_lexeme_matched"] + self.data["counters"]["curated_alias_matched"],
        )
        self.assertLessEqual(len(self.data["unresolved_frequency_sample"]), 50)

    def test_records_are_unique_located_and_explicitly_classified(self):
        records = self.data["resolved_records"]
        self.assertEqual(len({row["normalized_term"] for row in records}), len(records))
        for row in records:
            self.assertGreater(row["occurrence_count"], 0)
            self.assertGreater(row["source_unit_count"], 0)
            self.assertIn(row["reconciliation_state"], {"exact_authored_lexeme_matched", "curated_alias_matched"})
            self.assertIn(row["authored_metadata_coverage_state"], {"covered_in_all_mentioned_source_units", "canonical_match_missing_from_some_covering_episodes"})

    def test_high_frequency_transliteration_aliases_do_not_fork_people(self):
        by_term = {row["normalized_term"]: row for row in self.data["resolved_records"]}
        expected = {
            "dacaratha": "king-dasharatha",
            "kaucalya": "kausalya",
            "vicwamitra": "vishvamitra",
            "bibhishana": "vibhishana",
            "vaidehi": "sita",
            "saumitri": "lakshmana",
            "sakra": "indra",
            "kuvera": "kubera",
        }
        for source_term, canonical_id in expected.items():
            self.assertEqual(by_term[source_term]["reconciliation_state"], "curated_alias_matched")
            self.assertEqual(by_term[source_term]["canonical_matches"][0]["canonical_id"], canonical_id)

    def test_unresolved_noise_is_counted_but_not_materialized_as_a_blocking_queue(self):
        self.assertGreater(self.data["counters"]["source_term_review_needed"], 1000)
        self.assertEqual(self.data["completion_state"], "supplementary_nonblocking_diagnostic")
        self.assertTrue(self.data["unresolved_frequency_sample"])

    def test_resolved_terms_audit_the_covering_episode_metadata(self):
        resolved = self.data["resolved_records"]
        partial = [row for row in resolved if row["authored_metadata_coverage_state"] == "canonical_match_missing_from_some_covering_episodes"]
        self.assertEqual(len(partial), self.data["counters"]["resolved_terms_missing_from_some_covering_episodes"])
        self.assertTrue(all(row["missing_authored_metadata_source_address_keys"] for row in partial))


if __name__ == "__main__":
    unittest.main()

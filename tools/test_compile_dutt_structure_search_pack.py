import json
import tempfile
import unittest
from pathlib import Path

from compile_dutt_structure_search_pack import DEFAULT_OUTPUT, compile_pack


class DuttStructureSearchPackTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pack = compile_pack()

    def test_contract_and_complete_selected_edition_structure(self):
        self.assertEqual(self.pack["contract"], "DEVAM_DUTT_STRUCTURE_SEARCH_PACK_V1")
        self.assertEqual(self.pack["kanda_count"], 7)
        self.assertEqual(self.pack["passage_count"], 652)
        self.assertEqual(sum(row["section_count"] for row in self.pack["kandas"]), 652)
        self.assertEqual([row["kanda_slug"] for row in self.pack["kandas"]], ["bala", "ayodhya", "aranya", "kishkindha", "sundara", "yuddha", "uttara"])

    def test_exact_endpoint_citations_and_denials(self):
        self.assertEqual(self.pack["kandas"][0]["opening"]["locator"]["byte_start"], 33570)
        self.assertEqual(self.pack["kandas"][-1]["closing"]["source_ordinal"], 123)
        self.assertEqual(self.pack["kandas"][-1]["closing"]["locator"]["literal_marker"], "CXXIV")
        self.assertFalse(self.pack["completion_denials"]["literal_section_numbering_gap_free_or_corrected"])
        self.assertFalse(self.pack["completion_denials"]["complete_valmiki_sanskrit_source_or_critical_edition"])

    def test_pack_contains_no_source_payload_or_vault_path(self):
        encoded = json.dumps(self.pack, ensure_ascii=False)
        self.assertNotIn("exact_text", encoded)
        self.assertNotIn("object_path", encoded)
        self.assertNotIn("objects/sha256", encoded)
        self.assertFalse(self.pack["source_payloads_copied"])

    def test_checked_in_pack_is_deterministic(self):
        self.assertEqual(json.loads(DEFAULT_OUTPUT.read_text(encoding="utf-8")), self.pack)


if __name__ == "__main__":
    unittest.main()

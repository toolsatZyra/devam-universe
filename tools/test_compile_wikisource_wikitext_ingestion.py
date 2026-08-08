from __future__ import annotations

import unittest
from pathlib import Path

from tools.compile_source_vault_tei_ingestion import ROOT
from tools.compile_wikisource_wikitext_ingestion import compile_batches, compile_packet


PLAN = ROOT / "ingestion" / "plans" / "ganapatyatharvashirsha-wikisource-v1.json"


class WikisourceWikitextIngestionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.packet = compile_packet(PLAN)

    def test_exact_source_universe_and_passages(self) -> None:
        self.assertEqual(self.packet["source_object_count"], 2)
        self.assertEqual(self.packet["passage_count"], 16)
        markers = [row["locator"]["numbered_unit"] for row in self.packet["passages"] if row["locator"]["segment_kind"] == "numbered_unit"]
        self.assertEqual(markers, list(range(1, 15)))
        self.assertIn(self.packet["structure"]["terminal_formula"], self.packet["passages"][-1]["exact_text"])

    def test_publication_and_scope_remain_fail_closed(self) -> None:
        self.assertEqual(self.packet["rights"]["lane"], "derivative_allowed")
        self.assertEqual(self.packet["publication"]["state"], "published")
        self.assertFalse(self.packet["rights"]["underlying_print_edition_rights_inferred"])
        self.assertTrue(all(value is False for value in self.packet["completion_denials"].values()))

    def test_sql_is_bounded_and_idempotent(self) -> None:
        sql = "\n".join(compile_batches(self.packet))
        self.assertEqual(sql.count("insert into public.passages"), 16)
        self.assertIn("on conflict (source_object_id, source_ordinal)", sql)
        self.assertNotIn("service_role", sql)


if __name__ == "__main__":
    unittest.main()

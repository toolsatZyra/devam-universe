from __future__ import annotations

import unittest

from tools.compile_source_vault_tei_ingestion import ROOT
from tools.compile_wikisource_source_bounded_knowledge_pack import compile_batches, load_pack


PACK = ROOT / "knowledge_packs" / "ganesha" / "ganapatyatharvashirsha-wikisource-v1.json"


class WikisourceKnowledgePackTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.pack = load_pack(PACK)

    def test_bilingual_claim_universe(self) -> None:
        self.assertEqual(len(self.pack["claims"]), 10)
        self.assertEqual({row["language_code"] for row in self.pack["claims"]}, {"en", "hi"})
        self.assertEqual({row["source_ordinal"] for row in self.pack["claims"]}, {1, 7, 9, 10, 11})

    def test_scope_denials(self) -> None:
        self.assertFalse(self.pack["source"]["underlying_print_edition_identified"])
        self.assertTrue(all(value is False for value in self.pack["completion_denials"].values()))

    def test_sql_is_bounded(self) -> None:
        sql = "\n".join(compile_batches(self.pack))
        self.assertEqual(sql.count("insert into public.claims"), 10)
        self.assertEqual(sql.count("insert into public.claim_evidence"), 10)
        self.assertNotIn("insert into public.passages", sql)
        self.assertIn("scope\":\"this_source_only", sql)


if __name__ == "__main__":
    unittest.main()

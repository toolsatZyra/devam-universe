import unittest

from tools.compile_devimahatmya_semantic_graph_v1 import (
    MIGRATION_PATH,
    build_report,
    compile_sql,
    load_pack,
)


class DevimahatmyaSemanticGraphCompilerTests(unittest.TestCase):
    def test_semantic_graph_migration_reconstructs_exactly(self) -> None:
        pack = load_pack()
        sql = compile_sql(pack)
        report = build_report(pack)
        self.assertEqual(MIGRATION_PATH.read_text(encoding="utf-8"), sql)
        self.assertEqual(report["result"], "PASS")
        self.assertIs(report["migration_matches"], True)
        self.assertEqual(report["entity_count"], 4)
        self.assertEqual(report["preferred_name_count"], 12)
        self.assertEqual(report["bilingual_claim_count"], 8)
        self.assertEqual(report["relationship_count"], 4)
        self.assertEqual(report["evidence_passage_count"], 3)
        self.assertIs(report["source_payloads_copied"], False)

    def test_semantic_graph_sql_preserves_evidence_and_claim_ceiling(self) -> None:
        sql = compile_sql(load_pack())
        self.assertIn("source_bounded_narrative_index", sql)
        self.assertIn("contains_narrative_of", sql)
        self.assertIn("translation_is_source_original', false", sql)
        self.assertIn("source_payload_duplicated', false", sql)
        self.assertIn("not_historical_or_universal', true", sql)
        self.assertNotIn("source_vault/objects", sql)
        self.assertIn("insert into public.relationships", sql)
        self.assertIn("join public.claims c on c.stable_key=i.claim_key", sql)


if __name__ == "__main__":
    unittest.main()

from __future__ import annotations

import json
import unittest

from tools.compile_devimahatmya_devam_translations_v1 import (
    COMPLETION,
    CONTRACT,
    EXPECTED_DRAFT_SHA256,
    PACK_ID,
    TRANSLATION,
    build_report,
    compile_batches,
    compile_verification_sql,
    expected_claim_records,
    load_pack,
    stable_key,
)
from tools.compile_source_vault_tei_ingestion import canonical_json


class DevimahatmyaDevamTranslationCompilerTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.pack = load_pack()
        cls.records = expected_claim_records(cls.pack)

    def test_exact_complete_bilingual_alignment(self) -> None:
        self.assertEqual(len(self.pack["rows"]), 588)
        self.assertEqual([row["citation_ordinal"] for row in self.pack["rows"]], list(range(1, 589)))
        self.assertEqual(len(self.records), 1176)
        self.assertEqual(len({row["stable_key"] for row in self.records}), 1176)
        self.assertEqual({row["language_code"] for row in self.records}, {"en", "hi"})
        self.assertEqual(stable_key(1, "en"), "durga-devimahatmya-wikisource-translation-0001-en")
        self.assertEqual(stable_key(588, "hi"), "durga-devimahatmya-wikisource-translation-0588-hi")

    def test_translation_and_completion_boundaries(self) -> None:
        self.assertEqual(self.pack["contract"], CONTRACT)
        self.assertEqual(self.pack["pack_id"], PACK_ID)
        self.assertEqual(self.pack["draft_sha256"], EXPECTED_DRAFT_SHA256)
        self.assertEqual(self.pack["translation"], TRANSLATION)
        self.assertEqual(self.pack["completion"], COMPLETION)
        self.assertTrue(COMPLETION["exact_provider_revision_translation_coverage_complete"])
        self.assertTrue(all(value is False for key, value in COMPLETION.items() if key not in {"exact_source_passages_translated_en", "exact_source_passages_translated_hi", "exact_provider_revision_translation_coverage_complete"}))
        self.assertFalse(TRANSLATION["is_source_original"])
        self.assertTrue(TRANSLATION["ai_generated"])
        self.assertEqual(TRANSLATION["review_status"], "internal_beta_ai_assisted_not_independently_sanskrit_reviewed")

    def test_every_claim_is_source_bounded_and_evidenced(self) -> None:
        for record in self.records:
            self.assertEqual(record["claim_kind"], "source_aligned_translation")
            self.assertEqual(record["evidence_class"], "devam_synthesis")
            self.assertEqual(record["rights_lane"], "derivative_allowed")
            self.assertFalse(record["applicability"]["translation_is_source_original"])
            self.assertEqual(record["evidence_note"]["source_span_sha256"], record["source_span_sha256"])
            self.assertIn("not a source original", record["uncertainty_note"])
            self.assertIn("ritual instruction", record["uncertainty_note"])
        self.assertIn("not a verified or guaranteed outcome", self.records[(534 - 1) * 2]["uncertainty_note"])
        self.assertIn("never recommend self-injury", self.records[(579 - 1) * 2]["uncertainty_note"])
        self.assertIn("provider-added speculative commentary", self.records[(585 - 1) * 2]["uncertainty_note"])

    def test_sql_only_adds_claims_and_evidence(self) -> None:
        sql = "\n".join(compile_batches(self.pack))
        self.assertEqual(sql.count("insert into public.claims"), 147)
        self.assertEqual(sql.count("insert into public.claim_evidence"), 147)
        self.assertEqual(sql.count("durga-devimahatmya-wikisource-translation-"), 1176)
        self.assertNotIn("insert into public.source_objects", sql)
        self.assertNotIn("insert into public.passages", sql)
        self.assertIn("Pinned Sanskrit source-passage fixity drift", sql)
        self.assertIn("source_passage_root_sha256", sql)
        self.assertIn("this_exact_three_revision_source_universe_only", sql)
        self.assertIn("translation_is_source_original", sql)

    def test_verification_is_exact_and_compact(self) -> None:
        sql = compile_verification_sql(self.pack)
        self.assertIn("actual_rows=1176", sql)
        self.assertIn("statement_root_matches", sql)
        self.assertIn("uncertainty_root_matches", sql)
        self.assertIn("common_root_matches", sql)
        self.assertIn("applicability_violations", sql)
        self.assertIn("evidence_violations", sql)
        self.assertIn("all_support_links", sql)
        self.assertLess(len(sql), 12000)

    def test_report_is_deterministic(self) -> None:
        first = build_report(self.pack)
        second = build_report(load_pack())
        self.assertEqual(canonical_json(first), canonical_json(second))
        self.assertEqual(first["result"], "PASS")
        self.assertEqual(first["translation_count"], 1176)
        self.assertEqual(first["language_counts"], {"en": 588, "hi": 588})
        self.assertEqual(first["claim_count"], 1176)
        self.assertEqual(first["evidence_link_count"], 1176)
        self.assertRegex(first["translation_content_root_sha256"], r"^[0-9a-f]{64}$")
        self.assertTrue(first["sql_batch_sha256"])
        self.assertEqual(json.loads(canonical_json(first)), first)


if __name__ == "__main__":
    unittest.main()

from __future__ import annotations

import json
import unittest

from tools.compile_ganapatyatharvashirsha_devam_translations_v1 import (
    CONTRACT,
    EXPECTED_COMPLETION,
    compile_batches,
    compile_verification_sql,
    build_report,
    expected_claim_records,
    load_pack,
    stable_key,
)
from tools.compile_source_vault_tei_ingestion import ROOT, canonical_json


PACK = ROOT / "knowledge_packs" / "ganesha" / "ganapatyatharvashirsha-devam-translations-v1.json"


class GanapatiAtharvashirshaDevamTranslationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.pack = load_pack(PACK)

    def test_exact_bilingual_source_alignment(self) -> None:
        self.assertEqual([row["source_ordinal"] for row in self.pack["passages"]], list(range(16)))
        source = {row["source_ordinal"]: row for row in self.pack["source_packet"]["passages"]}
        self.assertTrue(all(row["source_span_sha256"] == source[row["source_ordinal"]]["span_sha256"] for row in self.pack["passages"]))
        self.assertTrue(all(row["english"].strip() and row["hindi"].strip() for row in self.pack["passages"]))
        self.assertEqual(len({stable_key(i, lang) for i in range(16) for lang in ("en", "hi")}), 32)

    def test_translation_is_a_separate_attributed_derivative(self) -> None:
        translation = self.pack["translation"]
        self.assertEqual(translation["attribution"], "Devam source-aligned translation v1")
        self.assertFalse(translation["is_source_original"])
        self.assertTrue(translation["ai_generated"])
        self.assertEqual(translation["review_status"], "internal_beta_ai_assisted_not_independently_sanskrit_reviewed")
        self.assertEqual(translation["rights_lane"], "derivative_allowed")
        self.assertTrue(translation["attribution_required"])
        self.assertTrue(translation["share_alike_required"])
        self.assertFalse(any("exact_text" in row for row in self.pack["passages"]))

    def test_variant_and_traditional_result_boundaries(self) -> None:
        variant_note = self.pack["passages"][12]["note"]
        self.assertIn("ब्रह्माद्याचरणं", variant_note)
        self.assertIn("ब्रह्माद्यावरणं", variant_note)
        self.assertLess(self.pack["passages"][12]["confidence"], 0.8)
        for ordinal in (11, 12, 13, 14):
            combined = (self.pack["passages"][ordinal]["english"] + " " + self.pack["passages"][ordinal]["note"]).lower()
            self.assertIn("text says", combined)
            self.assertTrue(any(boundary in combined for boundary in ("not empirical", "not a ritual", "not guaranteed", "source report")))

    def test_completion_boundary_is_exact(self) -> None:
        self.assertEqual(self.pack["completion"], EXPECTED_COMPLETION)
        self.assertTrue(self.pack["completion"]["exact_provider_revision_translation_coverage_complete"])
        negative = {key: value for key, value in self.pack["completion"].items() if key not in {"exact_source_passages_translated_en", "exact_source_passages_translated_hi", "exact_provider_revision_translation_coverage_complete"}}
        self.assertTrue(all(value is False for value in negative.values()))

    def test_sql_is_bounded_and_fixity_checked(self) -> None:
        sql = "\n".join(compile_batches(self.pack))
        self.assertEqual(sql.count("insert into public.claims"), 32)
        self.assertEqual(sql.count("insert into public.claim_evidence"), 32)
        self.assertNotIn("insert into public.source_objects", sql)
        self.assertNotIn("insert into public.passages", sql)
        self.assertIn("Pinned Sanskrit source passage fixity drift", sql)
        self.assertIn("this_exact_source_revision_only", sql)
        self.assertIn("source_aligned_translation", sql)
        self.assertIn("devam_synthesis", sql)
        self.assertIn("comparison_witness_text_copied\":false", sql)

    def test_exact_live_verification_contract_is_generated(self) -> None:
        records = expected_claim_records(self.pack)
        self.assertEqual(len(records), 32)
        self.assertEqual(len({row["stable_key"] for row in records}), 32)
        verification = compile_verification_sql(self.pack)
        self.assertIn("statement_root_matches", verification)
        self.assertIn("uncertainty_root_matches", verification)
        self.assertIn("applicability_violations", verification)
        self.assertIn("evidence_violations", verification)
        self.assertIn("jsonb_object_keys(applicability)", verification)
        self.assertIn("jsonb_object_keys(evidence_note)", verification)
        self.assertIn("common_root_matches", verification)
        self.assertIn("digest(convert_to", verification)
        self.assertLess(len(verification), 10000)

    def test_report_is_deterministic_and_complete(self) -> None:
        first = build_report(self.pack)
        second = build_report(load_pack(PACK))
        self.assertEqual(canonical_json(first), canonical_json(second))
        self.assertEqual(first["result"], "PASS")
        self.assertEqual(first["contract"], CONTRACT)
        self.assertEqual(first["translation_count"], 32)
        self.assertEqual(first["claim_count"], 32)
        self.assertEqual(first["evidence_link_count"], 32)
        self.assertEqual(first["language_counts"], {"en": 16, "hi": 16})
        self.assertRegex(first["pack_file_sha256"], r"^[0-9a-f]{64}$")
        self.assertRegex(first["translation_content_root_sha256"], r"^[0-9a-f]{64}$")
        self.assertRegex(first["sql_sha256"], r"^[0-9a-f]{64}$")
        self.assertEqual(json.loads(canonical_json(first)), first)


if __name__ == "__main__":
    unittest.main()

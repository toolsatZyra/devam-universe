from __future__ import annotations

import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from tools.promote_pargiter_devimahatmya_selected_passages import (  # noqa: E402
    COMPLETION_DENIAL_KEYS,
    EXPECTED_CANTOS,
    EXPECTED_OCR_ROOT,
    EXPECTED_PDF_PAGES,
    OCR_SHA256,
    PDF_SHA256,
    TEXT_STATUS,
    build_report,
    compile_sql,
    passage_root,
    read_json,
    validate_plan,
)


PLAN = ROOT / "ingestion" / "plans" / "markandeya-purana-pargiter-devimahatmya-selected-passages-v1.json"
EXPECTED_SELECTED_ROOT = "94d4ca27d343fb78283c702c5bfee7109931417fa84c5b962eb6a0f6d16be17b"


class PargiterDevimahatmyaSelectedPassageTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.plan = read_json(PLAN)
        cls.upstream = validate_plan(cls.plan, PLAN)
        cls.sql = compile_sql(cls.plan, cls.upstream)
        cls.report = build_report(PLAN)

    def test_exact_selected_universe_and_fixity(self) -> None:
        passages = self.plan["passages"]
        self.assertEqual([row["source_ordinal"] for row in passages], list(range(1, 8)))
        self.assertEqual([row["canto"] for row in passages], EXPECTED_CANTOS)
        self.assertEqual([row["pdf_pages"][0] for row in passages], EXPECTED_PDF_PAGES)
        self.assertEqual(passage_root(passages), EXPECTED_SELECTED_ROOT)
        self.assertEqual(self.report["selected_passage_content_root_sha256"], EXPECTED_SELECTED_ROOT)

    def test_source_identity_is_fixed_and_reference_only(self) -> None:
        identity = self.plan["database_identity"]
        self.assertEqual(identity["pdf_source_sha256"], PDF_SHA256)
        self.assertEqual(identity["ocr_source_sha256"], OCR_SHA256)
        self.assertEqual(identity["pdf_source_bytes"], 47426809)
        self.assertEqual(self.report["quarantined_ocr_passage_content_root_sha256"], EXPECTED_OCR_ROOT)
        self.assertFalse(self.report["source_payloads_copied_or_downloaded"])
        self.assertFalse(self.report["comparison_witness_saved_or_promoted"])

    def test_visual_transcription_and_normalization_are_explicit(self) -> None:
        method = self.plan["transcription_method"]
        self.assertEqual(method["text_status"], TEXT_STATUS)
        self.assertTrue(method["human_visual_review_completed"])
        self.assertTrue(method["page_rendering_is_not_a_retained_source_payload"])
        self.assertFalse(method["provider_ocr_promoted"])
        self.assertTrue(method["comparison_witness_is_not_a_product_source"])
        self.assertTrue(all(row["literal_marker"] for row in self.plan["passages"]))

    def test_rights_and_completion_are_fail_closed(self) -> None:
        rights = self.plan["rights_decision"]
        self.assertEqual(rights["lane"], "product_allowed")
        self.assertEqual(rights["target_product_geography"], ["India", "United States"])
        self.assertIsNone(rights["provider_top_level_rights"])
        self.assertIsNone(rights["provider_top_level_licenseurl"])
        self.assertTrue(rights["comparison_witness_rights_not_inherited"])
        denials = self.plan["product_boundary"]["completion_denials"]
        self.assertEqual(set(denials), COMPLETION_DENIAL_KEYS)
        self.assertTrue(all(value is False for value in denials.values()))
        self.assertTrue(self.plan["product_boundary"]["source_divine_promises_are_reported_as_source_claims_not_devam_guarantees"])

    def test_sql_promotes_only_pdf_selected_passages(self) -> None:
        self.assertIn(f"where sha256='{PDF_SHA256}'", self.sql)
        self.assertIn(f"where s.sha256='{OCR_SHA256}'", self.sql)
        self.assertEqual(self.sql.count('"contract":"DEVAM_VISUALLY_VERIFIED_PDF_PASSAGE_V1"'), 7)
        self.assertIn("on conflict (source_object_id, source_ordinal) do nothing", self.sql)
        self.assertIn("p.text_status='provider_ocr_quarantined_unreviewed'", self.sql)
        self.assertNotIn("wisdomlib.org", self.sql)
        self.assertNotIn("insert into public.source_objects", self.sql)

    def test_private_sanskrit_and_ocr_lanes_have_postflight_guards(self) -> None:
        self.assertIn("Private Sanskrit sibling expression drift", self.sql)
        self.assertIn("Quarantined OCR lane was promoted or altered", self.sql)
        self.assertIn("e.language_code='sa'", self.sql)
        self.assertIn("e.rights_lane <> 'private_evidence'", self.sql)

    def test_report_and_sql_are_deterministic(self) -> None:
        self.assertEqual(self.report["result"], "PASS")
        self.assertEqual(self.report["selected_passage_count"], 7)
        self.assertFalse(self.report["provider_ocr_promoted"])
        self.assertEqual(self.sql, compile_sql(self.plan, validate_plan(self.plan, PLAN)))
        self.assertEqual(self.report, build_report(PLAN))


if __name__ == "__main__":
    unittest.main()

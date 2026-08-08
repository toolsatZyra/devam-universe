import unittest

from tools.compile_ganesha_tei_text_correction import (
    NEW_TEXT_STATUS,
    PUBLISHED_ORDINALS,
    compile_correction,
)


class GaneshaTeiTextCorrectionTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.sql, cls.report = compile_correction()

    def test_correction_is_exact_and_preserves_publication_boundary(self) -> None:
        self.assertEqual(self.report["passage_count"], 32)
        self.assertEqual(
            self.report["changed_ordinals"],
            [5, 6, 9, 10, 15, 17, 18, 20, 21, 22, 23, 24, 25, 27, 30, 32],
        )
        self.assertEqual(self.report["published_ordinals_preserved"], sorted(PUBLISHED_ORDINALS))
        self.assertFalse(self.report["source_payload_mutated"])
        self.assertFalse(self.report["completion_claim_changed"])

    def test_sql_fails_closed_and_changes_only_derived_text_provenance(self) -> None:
        self.assertIn("p.exact_text is distinct from c.expected_old_text", self.sql)
        self.assertIn("p.publication_state <> c.expected_state", self.sql)
        self.assertIn(f"text_status = '{NEW_TEXT_STATUS}'", self.sql)
        self.assertIn("p.exact_text ~ '[0-9]'", self.sql)
        self.assertNotIn("update public.source_objects", self.sql)
        self.assertNotIn("update public.works", self.sql)
        self.assertNotIn("update public.editions", self.sql)

    def test_report_fixities_are_deterministic(self) -> None:
        self.assertEqual(
            self.report["sql_sha256"],
            "c57f99b0abf5e97a9ebb821d98fb73d16034167e00bcc6efac1b0fc4d7bf74d7",
        )
        self.assertEqual(
            self.report["corrected_knowledge_pack_sha256"],
            "18c7aa230668b2d8062ebc31c9b366eb43f000d2210a39d84a2761843e7e0596",
        )


if __name__ == "__main__":
    unittest.main()

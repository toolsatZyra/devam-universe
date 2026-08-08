from pathlib import Path
import unittest

from tools.compile_source_vault_tei_ingestion import (
    ROOT,
    compile_packet,
    compile_sql,
    compile_sql_batches,
    sha256_bytes,
)


PLAN = ROOT / "ingestion" / "plans" / "ganesha-shriganapatimantraksharavali-v1.json"


class IngestionCompilerTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.packet = compile_packet(PLAN)
        cls.sql = compile_sql(cls.packet)

    def test_packet_identity_is_deterministic(self) -> None:
        self.assertEqual(
            self.packet["packet_sha256"],
            "11a92e0c6421adc8a73104d4e8c2c22b86e28b02f24e0dc5888e8df8f8f2e97c",
        )
        self.assertEqual(
            sha256_bytes(self.sql.encode("utf-8")),
            "8078b17cb25895c5408082e00458ed03a7cd08fa2e2e98bc7907feaa3f297a0a",
        )

    def test_exact_observed_structure_is_preserved(self) -> None:
        passages = self.packet["passages"]
        self.assertEqual(len(passages), 32)
        self.assertEqual([row["source_ordinal"] for row in passages], list(range(1, 33)))
        self.assertEqual(passages[0]["locator"]["byte_start"], 1882)
        self.assertEqual(passages[-1]["locator"]["byte_end_exclusive"], 12964)
        self.assertTrue(all(left["locator"]["byte_end_exclusive"] <= right["locator"]["byte_start"] for left, right in zip(passages, passages[1:])))

    def test_editorial_note_anchor_labels_are_not_source_text(self) -> None:
        passages = {row["source_ordinal"]: row for row in self.packet["passages"]}
        for ordinal in (5, 6, 9, 10, 15, 17, 18, 20, 21, 22, 23, 24, 25, 27, 30, 32):
            self.assertNotRegex(passages[ordinal]["exact_text"], r"[0-9]")
        self.assertIn("महाकल्पं महोदयम्", passages[5]["exact_text"])
        self.assertIn("इति मन्त्रावलिस्तोत्रं", passages[32]["exact_text"])
        self.assertIn("सम्पादय शिवे शिवम्", passages[32]["exact_text"])
        self.assertEqual(
            self.packet["structure"]["text_status"],
            "tei_text_note_anchors_excluded_unverified_against_print",
        )

    def test_sql_is_bounded_and_keeps_payload_reference_only(self) -> None:
        batches = compile_sql_batches(self.sql)
        self.assertEqual(len(batches), 5)
        self.assertTrue(all(batch.startswith("begin;") and batch.endswith("commit;\n") for batch in batches))
        self.assertIn("'local_vault', null", self.sql)
        self.assertNotIn("'supabase_storage'", self.sql)


if __name__ == "__main__":
    unittest.main()

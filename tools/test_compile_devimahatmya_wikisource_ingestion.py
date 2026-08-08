from __future__ import annotations

import hashlib
import unittest

from tools.compile_devimahatmya_wikisource_ingestion import (
    compile_batches,
    compile_packet,
    compile_statements,
)


class DevimahatmyaWikisourceIngestionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.packet = compile_packet()
        cls.statements = compile_statements(cls.packet)
        cls.batches = compile_batches(cls.statements)

    def test_exact_source_universe_and_scope(self) -> None:
        self.assertEqual(len(self.packet["source_objects"]), 3)
        self.assertEqual(sum(row["bytes"] for row in self.packet["source_objects"]), 161_075)
        self.assertEqual([row["chapter"] for row in self.packet["chapter_spans"]], list(range(81, 94)))
        self.assertEqual(len(self.packet["passages"]), 588)
        self.assertEqual(
            self.packet["packet_sha256"],
            "a895ab56eb74a2ed01d1b92f64ecffe7beb4f66b71327c741929f05bf4eb7d4f",
        )

    def test_every_chapter_has_complete_ordered_verse_sequence(self) -> None:
        expected = self.packet["expected_verse_counts"]
        for chapter in range(81, 94):
            verses = [
                row["locator"]["verse"]
                for row in self.packet["passages"]
                if row["locator"]["chapter"] == chapter
            ]
            self.assertEqual(verses, list(range(1, int(expected[str(chapter)]) + 1)))

    def test_citations_are_unique_and_byte_addressed(self) -> None:
        citation_ids = {
            (row["source_sha256"], row["source_ordinal"])
            for row in self.packet["passages"]
        }
        self.assertEqual(len(citation_ids), 588)
        self.assertEqual(
            [row["citation_ordinal"] for row in self.packet["passages"]],
            list(range(1, 589)),
        )
        for row in self.packet["passages"]:
            locator = row["locator"]
            self.assertLess(locator["source_byte_start"], locator["source_byte_end_exclusive"])
            self.assertFalse(locator["underlying_print_edition_identified"])
            self.assertFalse(locator["textual_recension_identified"])
            self.assertTrue(row["exact_text"])

    def test_fixed_roots_and_terminal(self) -> None:
        chapter_rows = [
            f"{row['chapter']}\t{row['source_sha256']}\t{row['source_byte_start']}\t{row['source_byte_end_exclusive']}\t{row['verse_count']}\t{row['span_sha256']}"
            for row in self.packet["chapter_spans"]
        ]
        passage_rows = [
            f"{row['citation_ordinal']}\t{row['source_sha256']}\t{row['locator']['chapter']}.{row['locator']['verse']}\t{row['span_sha256']}\t{hashlib.sha256(row['exact_text'].encode('utf-8')).hexdigest()}"
            for row in self.packet["passages"]
        ]
        self.assertEqual(
            hashlib.sha256("\n".join(chapter_rows).encode()).hexdigest(),
            "9af7156e6144dfb57d58a8c91c229a679035c4575ebd969df6574c97f176ad98",
        )
        self.assertEqual(
            hashlib.sha256("\n".join(passage_rows).encode()).hexdigest(),
            "787a25875cdcab14e6b8ffee9c9772f71c7ade6c615abc20accb8471fe728b93",
        )
        terminal = next(
            row for row in self.packet["passages"]
            if row["locator"]["chapter"] == 93 and row["locator"]["verse"] == 17
        )
        self.assertIn("वरप्रदानं नाम त्रिनवतितमोऽध्यायः", terminal["exact_text"])

    def test_rights_and_completion_boundaries_remain_fail_closed(self) -> None:
        self.assertEqual(self.packet["rights"]["lane"], "derivative_allowed")
        self.assertTrue(self.packet["rights"]["attribution_required"])
        self.assertTrue(self.packet["rights"]["share_alike_required"])
        self.assertFalse(any(self.packet["completion_denials"].values()))
        self.assertFalse(self.packet["completion_denials"]["hindi_translation_included"])
        self.assertFalse(self.packet["completion_denials"]["english_translation_included"])

    def test_sql_is_bounded_and_product_published(self) -> None:
        sql = "\n".join(self.batches)
        self.assertGreater(len(self.batches), 20)
        self.assertLess(len(self.batches), 80)
        self.assertEqual(sql.count("insert into public.passages"), 588)
        self.assertIn("source_aligned_plain_text_projection_from_exact_pinned_wikisource_wikitext_span", sql)
        self.assertIn("on conflict (source_object_id, source_ordinal) do update", sql)
        self.assertNotIn("source_vault/objects/sha256", sql)
        self.assertNotIn("private_evidence", sql)


if __name__ == "__main__":
    unittest.main()

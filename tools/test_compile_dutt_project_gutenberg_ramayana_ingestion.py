from __future__ import annotations

import hashlib
import json
import unittest
from pathlib import Path

from tools.compile_dutt_project_gutenberg_ramayana_ingestion import (
    CONTRACT,
    compile_batches,
    compile_packet,
    compile_statements,
    compile_sql,
    passage_root,
)


ROOT = Path(__file__).resolve().parents[1]
PLAN = ROOT / "ingestion" / "plans" / "ramayana-manmatha-nath-dutt-project-gutenberg-product-v1.json"


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


class DuttProjectGutenbergRamayanaIngestionTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.packet = compile_packet(PLAN)
        cls.plan = json.loads(PLAN.read_text(encoding="utf-8"))

    def test_exact_source_and_kanda_universe(self) -> None:
        self.assertEqual(CONTRACT, self.packet["contract"])
        self.assertEqual(4, self.packet["source_object_count"])
        self.assertEqual([1, 2, 3, 4], [row["volume"] for row in self.packet["source_objects"]])
        self.assertEqual(7, self.packet["structure"]["kanda_count"])
        self.assertEqual(652, self.packet["passage_count"])
        self.assertEqual([75, 118, 75, 67, 66, 128, 123], [row["section_count"] for row in self.packet["structure"]["kanda_profiles"]])

    def test_every_source_is_exact_strict_utf8(self) -> None:
        for source in self.packet["source_objects"]:
            raw = (ROOT / "source_vault" / source["object_path"]).read_bytes()
            self.assertEqual(source["bytes"], len(raw))
            self.assertEqual(source["sha256"], sha256(raw))
            self.assertEqual(raw, raw.decode("utf-8", errors="strict").encode("utf-8"))

    def test_passage_coordinates_rehash_and_normalize_independently(self) -> None:
        seen: set[tuple[str, int]] = set()
        sources = {row["sha256"]: row for row in self.packet["source_objects"]}
        for passage in self.packet["passages"]:
            key = (passage["source_sha256"], passage["source_ordinal"])
            self.assertNotIn(key, seen)
            seen.add(key)
            raw = (ROOT / "source_vault" / sources[key[0]]["object_path"]).read_bytes()
            locator = passage["locator"]
            span = raw[locator["byte_start"]:locator["byte_end_exclusive"]]
            self.assertEqual(passage["span_sha256"], sha256(span))
            self.assertEqual(passage["span_sha256"], locator["span_sha256"])
            self.assertEqual(passage["exact_text"], " ".join(span.decode("utf-8", errors="strict").split()))
            self.assertTrue(locator["printed_number_not_unique_key"])
        self.assertEqual(652, len(seen))

    def test_volume_bodies_are_losslessly_covered_once(self) -> None:
        sources = {row["sha256"]: row for row in self.packet["source_objects"]}
        for body in self.packet["body_profiles"]:
            raw = (ROOT / "source_vault" / sources[body["source_sha256"]]["object_path"]).read_bytes()
            rows = [row for row in self.packet["passages"] if row["source_sha256"] == body["source_sha256"]]
            covered = b"".join(raw[row["locator"]["byte_start"]:row["locator"]["byte_end_exclusive"]] for row in rows)
            expected = raw[body["body_byte_start"]:body["body_byte_end_exclusive"]]
            self.assertEqual(expected, covered)
            self.assertEqual(body["body_bytes"], len(expected))
            self.assertEqual(body["body_sha256"], sha256(expected))
            self.assertTrue(body["lossless_span_coverage"])

    def test_literal_numbering_defects_are_preserved(self) -> None:
        by_kanda: dict[str, list[dict]] = {}
        for passage in self.packet["passages"]:
            by_kanda.setdefault(passage["locator"]["kanda_slug"], []).append(passage)
        for profile in self.packet["structure"]["kanda_profiles"]:
            rows = by_kanda[profile["kanda_slug"]]
            self.assertEqual(profile["section_count"], len(rows))
            self.assertEqual(profile["first_literal_number"], rows[0]["locator"]["literal_section_number"])
            self.assertEqual(profile["last_literal_number"], rows[-1]["locator"]["literal_section_number"])
        duplicates = [row for row in self.packet["passages"] if "duplicate_literal_number" in row["locator"]["numbering_status"]]
        self.assertGreater(len(duplicates), 0)
        self.assertFalse(self.packet["product_boundary"]["completion_denials"]["literal_section_numbering_gap_free_or_corrected"])

    def test_product_text_excludes_provider_framing(self) -> None:
        for passage in self.packet["passages"]:
            lowered = passage["exact_text"].casefold()
            self.assertNotIn("project gutenberg", lowered)
            self.assertNotIn("gutenberg.org", lowered)
        self.assertFalse(self.packet["rights_decision"]["file_and_electronic_text_evidence"]["license_or_trademark_framing_present_in_product_passages"])

    def test_rights_scope_and_completion_denials_are_fail_closed(self) -> None:
        self.assertEqual("product_allowed", self.packet["rights_decision"]["lane"])
        self.assertEqual("published", self.packet["rights_decision"]["publication_state"])
        self.assertTrue(self.packet["rights_decision"]["legal_characterization"].endswith("not_legal_advice"))
        self.assertTrue(all(value is False for value in self.packet["product_boundary"]["completion_denials"].values()))
        self.assertEqual({
            "copy_or_download_source_payload": False,
            "create_reader_payload": False,
            "modify_existing_source_bytes": False,
            "silently_correct_literal_section_labels": False,
            "promote_unrelated_expression_or_edition": False,
        }, self.packet["mutation_boundary"])

    def test_sql_is_deterministic_and_product_bounded(self) -> None:
        sql_a = compile_sql(self.packet)
        sql_b = compile_sql(compile_packet(PLAN))
        self.assertEqual(sql_a, sql_b)
        self.assertIn("'product_allowed', 'published'", sql_a)
        self.assertNotIn("insert into public.claims", sql_a.casefold())
        batches = compile_batches(self.packet)
        self.assertGreater(len(batches), 1)
        self.assertEqual(sql_a, "\n\n".join(["begin;", *compile_statements(self.packet), "commit;"]) + "\n")

    def test_packet_and_passage_roots_are_deterministic(self) -> None:
        rebuilt = compile_packet(PLAN)
        self.assertEqual(self.packet["packet_sha256"], rebuilt["packet_sha256"])
        self.assertEqual(passage_root(self.packet), passage_root(rebuilt))
        self.assertEqual(PLAN.read_bytes(), PLAN.read_text(encoding="utf-8").encode("utf-8"))


if __name__ == "__main__":
    unittest.main()

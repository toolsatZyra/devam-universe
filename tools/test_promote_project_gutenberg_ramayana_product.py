from __future__ import annotations

import json
import unittest
from pathlib import Path

from tools.compile_project_gutenberg_ramayana_ingestion import compile_packet, passage_root
from tools.promote_project_gutenberg_ramayana_product import (
    EXPECTED_PASSAGE_ROOT,
    EXPECTED_STRUCTURAL_TEI_SHA256,
    EXPECTED_UPSTREAM_PACKET_SHA256,
    ROOT,
    build_report,
    compile_sql,
    read_json,
    validate_plan,
)


PLAN = ROOT / "ingestion" / "plans" / "ramayana-griffith-project-gutenberg-product-promotion-v1.json"
UPSTREAM_PLAN = ROOT / "ingestion" / "plans" / "ramayana-griffith-project-gutenberg-v1.json"


class GriffithProductPromotionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.plan = read_json(PLAN)
        cls.upstream = validate_plan(cls.plan, PLAN)
        cls.sql = compile_sql(cls.plan, cls.upstream)

    def test_independent_upstream_reconstruction(self) -> None:
        packet = compile_packet(UPSTREAM_PLAN)
        self.assertEqual(packet["packet_sha256"], EXPECTED_UPSTREAM_PACKET_SHA256)
        self.assertEqual(passage_root(packet), EXPECTED_PASSAGE_ROOT)
        self.assertEqual(len(packet["passages"]), 560)
        self.assertEqual({row["source_ordinal"] for row in packet["passages"]}, set(range(1, 561)))

    def test_no_project_gutenberg_framing_in_product_passages(self) -> None:
        forbidden = ("Project Gutenberg", "www.gutenberg.org", "Gutenberg-tm")
        self.assertFalse(any(any(token in row["exact_text"] for token in forbidden) for row in self.upstream["passages"]))
        empty_types = {row["divgen_type"] for row in self.upstream["structure"]["empty_generated_leaf_profiles"]}
        self.assertEqual(empty_types, {"pgheader", "encodingDesc", "pgfooter"})

    def test_sql_is_exact_and_fail_closed(self) -> None:
        self.assertIn("Griffith expression count drift", self.sql)
        self.assertIn("Griffith edition count drift", self.sql)
        self.assertIn("Griffith indexed source universe drift", self.sql)
        self.assertIn("Project Gutenberg framing leaked into product passages", self.sql)
        self.assertIn("Non-TEI Griffith source lane drift", self.sql)
        self.assertEqual(self.sql.count("update public.expressions"), 1)
        self.assertEqual(self.sql.count("update public.editions"), 1)
        self.assertEqual(self.sql.count("update public.source_objects"), 1)
        self.assertEqual(self.sql.count("update public.passages"), 1)
        self.assertIn(EXPECTED_STRUCTURAL_TEI_SHA256, self.sql)

    def test_only_structural_tei_source_is_promoted(self) -> None:
        source_shas = {row["sha256"] for row in self.upstream["source_objects"]}
        self.assertEqual(len(source_shas), 6)
        self.assertIn(EXPECTED_STRUCTURAL_TEI_SHA256, source_shas)
        self.assertIn("sha256 <> '" + EXPECTED_STRUCTURAL_TEI_SHA256 + "'", self.sql)

    def test_boundaries_remain_false(self) -> None:
        denials = self.plan["product_boundary"]["completion_denials"]
        self.assertEqual(len(denials), 9)
        self.assertFalse(any(denials.values()))
        self.assertFalse(any(self.plan["mutation_boundary"].values()))

    def test_report_is_deterministic_and_not_prematurely_hosted(self) -> None:
        left = build_report(PLAN)
        right = build_report(PLAN)
        self.assertEqual(left, right)
        self.assertEqual(left["result"], "PASS")
        self.assertEqual(left["promoted_passage_count"], 560)
        self.assertEqual(left["hosted_import"], {"attempted": False, "status": "NOT_RUN"})

    def test_plan_json_round_trip(self) -> None:
        raw = PLAN.read_text(encoding="utf-8")
        self.assertEqual(json.loads(raw), self.plan)


if __name__ == "__main__":
    unittest.main()

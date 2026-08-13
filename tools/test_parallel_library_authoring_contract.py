from __future__ import annotations

import json
import unittest
from pathlib import Path, PurePosixPath


ROOT = Path(__file__).resolve().parents[1]
WORK_PATH = ROOT / "knowledge_packs" / "inventories" / "parallel-library-work-v1.json"
ANCHOR_PATH = ROOT / "knowledge_packs" / "inventories" / "canonical-consumer-anchors-v1.json"
SCHEMA_PATH = ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json"
CONTRACT_PATH = ROOT / "docs" / "PARALLEL_LIBRARY_AUTHORING_CONTRACT.md"


class ParallelLibraryAuthoringContractTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.work = json.loads(WORK_PATH.read_text(encoding="utf-8"))
        cls.anchors = json.loads(ANCHOR_PATH.read_text(encoding="utf-8"))
        cls.schema = json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))
        cls.contract_text = CONTRACT_PATH.read_text(encoding="utf-8")

    def test_expected_lanes_and_one_shared_state_owner(self) -> None:
        self.assertEqual("DEVAM_PARALLEL_LIBRARY_WORK_V1", self.work["contract"])
        lanes = {lane["lane_id"]: lane for lane in self.work["lanes"]}
        self.assertEqual(
            {
                "epics-integration",
                "ganesha-consumer",
                "devi-consumer",
                "diwali-consumer",
                "ritual-calendar",
            },
            set(lanes),
        )
        owners = [lane["lane_id"] for lane in lanes.values() if lane["sole_shared_state_owner"]]
        self.assertEqual([self.work["shared_state_owner_lane_id"]], owners)
        self.assertEqual("current_task", lanes["epics-integration"]["task_kind"])
        self.assertTrue(
            all(lanes[lane_id]["task_kind"] == "isolated_worktree_task" for lane_id in lanes if lane_id != "epics-integration")
        )
        self.assertTrue(all(lane["initial_denominator"]["completion_rule"] for lane in lanes.values()))

    def test_parallel_lane_write_globs_are_disjoint_and_lane_owned(self) -> None:
        lanes = [lane for lane in self.work["lanes"] if not lane["sole_shared_state_owner"]]
        observed: set[str] = set()
        for lane in lanes:
            lane_token = lane["lane_id"].removesuffix("-consumer")
            for glob in lane["exclusive_write_globs"]:
                self.assertNotIn(glob, observed, glob)
                observed.add(glob)
                path = PurePosixPath(glob.replace("**", "owned"))
                self.assertNotIn("inventories", path.parts, glob)
                self.assertNotIn("apps", path.parts, glob)
                self.assertNotIn("supabase", path.parts, glob)
            self.assertIn(lane_token, " ".join(lane["exclusive_write_globs"]))
            self.assertGreater(len(lane["formal_goal"]), 450)
            self.assertIn("cross-link proposals", lane["formal_goal"])

    def test_shared_anchor_ids_and_existing_refs_are_unique(self) -> None:
        self.assertEqual("DEVAM_CANONICAL_CONSUMER_ANCHORS_V1", self.anchors["contract"])
        lane_ids = {lane["lane_id"] for lane in self.work["lanes"]}
        canonical_ids: set[str] = set()
        external_refs: set[tuple[str, str]] = set()
        for anchor in self.anchors["anchors"]:
            self.assertNotIn(anchor["canonical_id"], canonical_ids)
            canonical_ids.add(anchor["canonical_id"])
            self.assertTrue(anchor["canonical_id"].startswith("devam:"))
            self.assertIn(anchor["owner_lane_id"], lane_ids)
            self.assertTrue(anchor["preferred_name"]["en"].strip())
            self.assertTrue(anchor["preferred_name"]["hi"].strip())
            for key, value in anchor["existing_refs"].items():
                ref = (key, value)
                self.assertNotIn(ref, external_refs, ref)
                external_refs.add(ref)

    def test_cross_link_schema_is_proposal_only_and_rejects_flattening_predicates(self) -> None:
        self.assertEqual(
            "DEVAM_CROSS_LANE_LINK_PROPOSALS_V1",
            self.schema["properties"]["contract"]["const"],
        )
        self.assertEqual("proposed_for_integration", self.schema["properties"]["status"]["const"])
        predicate = self.schema["$defs"]["proposal"]["properties"]["predicate"]
        self.assertEqual(
            {"related_to", "same_as", "is_form_of", "origin_of"},
            set(predicate["not"]["enum"]),
        )
        self.assertEqual("proposed", self.schema["$defs"]["proposal"]["properties"]["integration_status"]["const"])

    def test_contract_preserves_content_and_ritual_boundaries(self) -> None:
        normalized = " ".join(self.contract_text.split())
        required = (
            "Model knowledge may accelerate discovery",
            "It is not final evidence",
            "Unresolved targets are valid",
            "There is no finite, universal list",
            "Never use `git add .`",
            "Hosted Supabase, Vercel and production state remain unchanged",
        )
        for text in required:
            self.assertIn(text, normalized)


if __name__ == "__main__":
    unittest.main()

import json
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LANE = ROOT / "knowledge_packs" / "library_lanes" / "devi"
DEVANAGARI = re.compile(r"[\u0900-\u097f]")


def load(relative: str):
    return json.loads((ROOT / relative).read_text(encoding="utf-8"))


class DeviLaneTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.denominator = load("knowledge_packs/library_lanes/devi/devi-consumer-denominator-v1.json")
        cls.story = load("knowledge_packs/library_lanes/devi/stories/devimahatmya-consumer-story-v1.json")
        cls.practices = load("knowledge_packs/library_lanes/devi/practices/devi-practice-index-v1.json")
        cls.identities = load("knowledge_packs/library_lanes/devi/identities/devi-identity-variants-v1.json")
        cls.places = load("knowledge_packs/library_lanes/devi/places/devi-living-places-v1.json")
        cls.links = load("knowledge_packs/library_lanes/devi/cross-links/devi-cross-lane-links-v1.json")
        cls.translations = [
            json.loads(line)
            for line in (ROOT / "knowledge_packs/durga/devimahatmya-devam-translations-v1.jsonl")
            .read_text(encoding="utf-8")
            .splitlines()
            if line.strip()
        ]

    def test_denominator_is_frozen_at_coordination_commit(self):
        self.assertEqual(self.denominator["status"], "frozen_before_new_authoring")
        self.assertEqual(
            self.denominator["coordination_commit"],
            "cf0e9406ea2120a77d9b2c4cd5552148e0a9aaaf",
        )
        self.assertIn("not completion", self.denominator["completion_claim_boundary"].lower())

    def test_story_covers_every_source_unit_exactly_once(self):
        expected = [(row["chapter"], row["verse"]) for row in self.translations]
        covered = []
        for moment in self.story["moments"]:
            covered.extend(
                (moment["chapter"], verse)
                for verse in range(moment["source_range"]["start_verse"], moment["source_range"]["end_verse"] + 1)
            )
        self.assertEqual(len(expected), 588)
        self.assertEqual(covered, expected)
        self.assertEqual(len(covered), len(set(covered)))

    def test_story_has_26_ordered_substantial_bilingual_moments(self):
        moments = self.story["moments"]
        self.assertEqual(len(moments), 26)
        self.assertEqual([m["ordinal"] for m in moments], list(range(1, 27)))
        self.assertEqual(len({m["moment_id"] for m in moments}), 26)
        for moment in moments:
            self.assertGreaterEqual(len(moment["narrative"]["en"]), 280, moment["moment_id"])
            self.assertGreaterEqual(len(moment["narrative"]["hi"]), 180, moment["moment_id"])
            self.assertTrue(DEVANAGARI.search(moment["narrative"]["hi"]), moment["moment_id"])
            self.assertEqual(len(moment["beats"]), 3, moment["moment_id"])
            for beat in moment["beats"]:
                self.assertTrue(beat["en"].strip())
                self.assertTrue(DEVANAGARI.search(beat["hi"]))

    def test_story_keeps_source_and_product_boundaries(self):
        self.assertEqual(self.story["status"], "authored_not_projected")
        source = self.story["source_boundary"]
        self.assertEqual(source["chapters"], 13)
        self.assertEqual(source["source_units"], 588)
        self.assertIn("not independently Sanskrit-reviewed", source["translation_status"])
        self.assertIn("does not stand", source["scope_note"])

    def test_all_selected_practice_lanes_are_present_and_actionable(self):
        expected = self.denominator["selected_denominator"]["owned_practice_lanes"]
        lanes = self.practices["practice_lanes"]
        actual = [lane["practice_id"].split("/", 1)[1] for lane in lanes]
        self.assertEqual(actual, expected)
        self.assertEqual(len(lanes), 7)
        for lane in lanes:
            self.assertIn(lane["classification"], {"user_complete_lane", "user_complete_lane_reused"})
            self.assertGreaterEqual(len(lane["action_path"]), 4)
            self.assertTrue(lane["applies_when"]["geography"])
            self.assertTrue(lane["applies_when"]["tradition"])
            self.assertTrue(DEVANAGARI.search(lane["consumer_summary"]["hi"]))

    def test_cross_lane_rituals_are_referenced_not_duplicated(self):
        connections = self.practices["cross_lane_connections"]
        self.assertEqual(
            {item["observance"] for item in connections},
            {"devam:observance:bengal-kali-puja", "devam:observance:diwali-lakshmi-puja"},
        )
        for item in connections:
            self.assertEqual(item["owner_lane"], "diwali-consumer")
            self.assertIn("rather than duplicate", item["devi_lane_contribution"])

    def test_identity_dossiers_preserve_non_equivalence(self):
        dossiers = self.identities["dossiers"]
        self.assertEqual(len(dossiers), 6)
        text = json.dumps(self.identities, ensure_ascii=False).lower()
        for required in ("kaushiki", "kalika", "chamunda", "bhavatarini", "navadurga", "kojagara"):
            self.assertIn(required, text)
        self.assertIn("prohibit automatic same_as", text)
        self.assertIn("must not map one-to-one", text)

    def test_place_dossiers_separate_claim_scopes_and_freshness(self):
        places = self.places["places"]
        self.assertEqual(len(places), 7)
        self.assertIn("2026-11-13", self.places["freshness_boundary"])
        for place in places:
            for key in ("current_identity", "history_and_institution", "sacred_narrative", "visitor_boundary"):
                self.assertTrue(place[key]["en"].strip())
                self.assertTrue(DEVANAGARI.search(place[key]["hi"]), (place["place_id"], key))
            self.assertTrue(place["evidence"])
            for evidence in place["evidence"]:
                self.assertTrue(evidence["url"].startswith("https://"))

    def test_cross_link_pack_conforms_to_repository_schema(self):
        try:
            import jsonschema
        except ImportError as exc:  # pragma: no cover
            self.fail(f"jsonschema is required for lane validation: {exc}")
        schema = load("schemas/cross-lane-link-proposal-v1.schema.json")
        jsonschema.Draft202012Validator(schema).validate(self.links)
        self.assertEqual(self.links["status"], "proposed_for_integration")
        self.assertGreaterEqual(len(self.links["proposals"]), 10)

    def test_cross_link_predicates_and_targets_are_narrow(self):
        prohibited = {"related_to", "same_as", "is_form_of", "origin_of"}
        proposal_ids = set()
        for proposal in self.links["proposals"]:
            self.assertNotIn(proposal["predicate"], prohibited)
            self.assertNotIn(proposal["proposal_id"], proposal_ids)
            proposal_ids.add(proposal["proposal_id"])
            self.assertEqual(proposal["integration_status"], "proposed")
            self.assertTrue(proposal["scope"]["statement"])
            self.assertTrue(proposal["evidence_refs"])

    def test_lane_has_no_large_payloads(self):
        files = [path for path in LANE.rglob("*") if path.is_file()]
        self.assertTrue(files)
        for path in files:
            self.assertLess(path.stat().st_size, 500_000, path)
            self.assertNotIn(path.suffix.lower(), {".pdf", ".djvu", ".png", ".jpg", ".webp"})


if __name__ == "__main__":
    unittest.main()

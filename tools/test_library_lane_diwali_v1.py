"""Lane-local acceptance checks for the frozen Diwali consumer-MVP denominator."""

from __future__ import annotations

import hashlib
import json
import re
import subprocess
import unittest
from pathlib import Path

import jsonschema


ROOT = Path(__file__).resolve().parents[1]
LANE = ROOT / "knowledge_packs" / "library_lanes" / "diwali"
DENOMINATOR = LANE / "selected-scope-denominator-v1.json"
WORLDS = LANE / "worlds" / "consumer-worlds-v1.json"
ENTITIES = LANE / "entities" / "characters-and-places-v1.json"
SOURCES = LANE / "research" / "source-register-v1.json"
PROPOSALS = LANE / "cross-links" / "diwali-cross-lane-link-proposals-v1.json"
COMPLETION = LANE / "completion-report-v1.json"
STORY_DIR = LANE / "stories"

EXPECTED_WORLD_IDS = {
    "maharashtra-vasu-baras", "north-west-dhantrayodashi",
    "north-west-yama-deepam", "maharashtra-naraka-chaturdashi",
    "tamil-dawn-deepavali", "baps-gujarat-kali-chaudash",
    "north-india-rama-homecoming-association", "west-india-lakshmi-puja",
    "bengal-kali-puja", "maharashtra-bali-pratipada",
    "karnataka-balipadyami", "baps-gujarati-new-year",
    "gujarati-new-year-household", "iskcon-bangalore-govardhana-annakut",
    "nathdwara-shrinathji-annakut", "north-india-bhai-dooj",
    "maharashtra-bhau-beej", "bengal-bhai-phota",
    "jain-diwali-lay-remembrance", "sgpc-bandi-chhor-divas",
}
EXPECTED_STORY_IDS = {
    "rama-return-ayodhya", "ocean-churning-dhanvantari",
    "ocean-churning-lakshmi", "king-hima-yama-lamp-tradition",
    "narakasura-krishna-satyabhama", "bengal-shyama-puja-development",
    "vamana-bali-three-steps", "krishna-govardhana-shelter",
    "yama-yamuna-sibling-hospitality", "krishna-subhadra-sibling-variant",
    "mahavira-nirvana-pavapuri", "guru-hargobind-gwalior-release",
    "baps-kali-chaudash-hanuman-association",
}
EXPECTED_PLACE_IDS = {
    "ayodhya", "ocean-of-milk-narrative-place",
    "pragjyotisha-narrative-place", "vraja-govardhan", "pavapuri",
    "gwalior-fort", "amritsar", "dakshineswar-kali-temple",
    "kalighat-kali-temple", "shrinathji-temple-nathdwara",
    "iskcon-bangalore", "jal-mandir-pavapuri",
    "gurdwara-data-bandi-chhor-gwalior", "sri-harmandir-sahib",
}
MOJIBAKE = ("à¤", "à¥", "â€™", "â€œ", "â€", "ï¿½", "\ufffd")


def load(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def walk_evidence_refs(value):
    if isinstance(value, dict):
        for key, child in value.items():
            if key == "evidence_refs" and isinstance(child, list):
                for item in child:
                    if isinstance(item, str):
                        yield item
            yield from walk_evidence_refs(child)
    elif isinstance(value, list):
        for child in value:
            yield from walk_evidence_refs(child)


class TestDiwaliLane(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.denominator = load(DENOMINATOR)
        cls.world_pack = load(WORLDS)
        cls.entities = load(ENTITIES)
        cls.source_pack = load(SOURCES)
        cls.proposal_pack = load(PROPOSALS)
        cls.completion = load(COMPLETION)
        cls.story_packs = [load(path) for path in sorted(STORY_DIR.glob("*.json"))]
        cls.stories = [story for pack in cls.story_packs for story in pack["stories"]]
        cls.story_sources = {
            source["source_id"] for pack in cls.story_packs for source in pack["sources"]
        }
        cls.registered_sources = {source["source_id"] for source in cls.source_pack["sources"]}

    def test_exact_frozen_denominator(self):
        d = self.denominator
        self.assertEqual(d["state"], "frozen_before_new_authoring")
        self.assertEqual(d["coordination_ancestry"], "cf0e9406ea2120a77d9b2c4cd5552148e0a9aaaf")
        self.assertEqual(set(d["world_ids"]), EXPECTED_WORLD_IDS)
        self.assertEqual(set(d["story_family_ids"]), EXPECTED_STORY_IDS)
        self.assertEqual(set(d["selected_place_ids"]), EXPECTED_PLACE_IDS)
        self.assertEqual(d["target_counts"], {
            "worlds": 20, "story_families": 13,
            "selected_places_and_institutions": 14, "consumer_languages": 2,
        })
        self.assertEqual(len(d["prohibited_collapses"]), len(set(d["prohibited_collapses"])))

    def test_completion_report_has_zero_selected_scope_gaps(self):
        report = self.completion
        self.assertEqual(report["status"], "selected_scope_complete_authored_not_projected")
        self.assertEqual(report["denominator"], {
            "worlds": 20, "story_families": 13, "story_moments": 68,
            "selected_places_and_institutions": 14, "consumer_languages": ["en", "hi"],
        })
        self.assertTrue(all(value == 0 for value in report["remaining_selected_scope"].values()))
        self.assertEqual(report["blocked_selected_scope"], [])
        self.assertTrue(all(value is False for value in report["projection_state"].values()))

    def test_all_selected_stories_are_substantial_and_bilingual(self):
        by_id = {story["story_id"]: story for story in self.stories}
        self.assertEqual(set(by_id), EXPECTED_STORY_IDS)
        self.assertEqual(len(self.stories), 13)
        self.assertEqual(sum(len(story["moments"]) for story in self.stories), 68)
        for story_id, story in by_id.items():
            self.assertGreaterEqual(len(story["moments"]), 4, story_id)
            self.assertGreaterEqual(len(story["story_scope"]), 60, story_id)
            self.assertTrue(story["source_ids"], story_id)
            ordinals = [moment["ordinal"] for moment in story["moments"]]
            self.assertEqual(ordinals, list(range(1, len(ordinals) + 1)), story_id)
            for moment in story["moments"]:
                for language in ("en", "hi"):
                    self.assertGreaterEqual(len(moment["title"][language]), 8, (story_id, language))
                    self.assertGreaterEqual(len(moment["narrative"][language]), 180, (story_id, moment["ordinal"], language))
                for field in ("action", "motivation", "consequence"):
                    self.assertGreaterEqual(len(moment[field]), 20, (story_id, moment["ordinal"], field))

    def test_story_source_ids_resolve(self):
        for story in self.stories:
            for source_id in story["source_ids"]:
                self.assertIn(source_id, self.story_sources, (story["story_id"], source_id))
                self.assertIn(source_id, self.registered_sources, (story["story_id"], source_id))

    def test_twenty_worlds_resolve_practices_stories_characters_and_places(self):
        worlds = self.world_pack["worlds"]
        self.assertEqual({world["world_id"] for world in worlds}, EXPECTED_WORLD_IDS)
        self.assertEqual(len(worlds), 20)
        story_ids = {story["story_id"] for story in self.stories}
        character_ids = {item["character_id"] for item in self.entities["characters"]}
        place_ids = {item["place_id"] for item in self.entities["places"]}
        shared_practices = {item["ref_id"] for item in self.world_pack["shared_practice_refs"]}
        local_practices = {item["practice_id"] for item in self.world_pack["lane_local_practices"]}
        for world in worlds:
            self.assertEqual(world["status"], "complete_selected_scope", world["world_id"])
            self.assertGreaterEqual(len(world["title"]["en"]), 4, world["world_id"])
            self.assertGreaterEqual(len(world["title"]["hi"]), 3, world["world_id"])
            self.assertGreaterEqual(len(world["applicability"]), 25, world["world_id"])
            self.assertTrue(set(world["story_ids"]).issubset(story_ids), world["world_id"])
            self.assertIn(world["practice_ref"], shared_practices | local_practices, world["world_id"])
            self.assertTrue(set(world["character_ids"]).issubset(character_ids), world["world_id"])
            self.assertTrue(set(world["place_ids"]).issubset(place_ids), world["world_id"])

    def test_shared_practice_references_are_immutable_and_present(self):
        refs = self.world_pack["shared_practice_refs"]
        self.assertEqual(len(refs), 15)
        self.assertEqual(len({item["ref_id"] for item in refs}), 15)
        for item in refs:
            path = ROOT / item["path"]
            self.assertTrue(path.is_file(), item["path"])
            self.assertEqual(sha256(path), item["sha256"], item["path"])

    def test_five_local_practices_meet_actionable_contract(self):
        practices = self.world_pack["lane_local_practices"]
        self.assertEqual(len(practices), 5)
        required = {
            "practice_id", "classification", "applicability", "timing", "meaning",
            "story_ids", "typical_practice", "procedures", "materials_and_substitutions",
            "variants", "closing", "safety", "evidence_refs",
        }
        for practice in practices:
            self.assertTrue(required.issubset(practice), practice["practice_id"])
            self.assertTrue(practice["applicability"]["ask"], practice["practice_id"])
            self.assertIn("dependency", practice["timing"], practice["practice_id"])
            for field in ("meaning", "typical_practice", "materials_and_substitutions", "closing"):
                self.assertIn("en", practice[field], (practice["practice_id"], field))
                self.assertIn("hi", practice[field], (practice["practice_id"], field))
            self.assertGreaterEqual(len(practice["procedures"]), 2, practice["practice_id"])
            self.assertGreaterEqual(len(practice["variants"]), 2, practice["practice_id"])
            self.assertTrue(practice["safety"], practice["practice_id"])
            self.assertTrue(practice["evidence_refs"], practice["practice_id"])

    def test_selected_places_are_present_and_claim_scoped(self):
        places = {place["place_id"]: place for place in self.entities["places"]}
        self.assertTrue(EXPECTED_PLACE_IDS.issubset(places))
        for place_id in EXPECTED_PLACE_IDS:
            place = places[place_id]
            self.assertGreaterEqual(len(place["description"]["en"]), 35, place_id)
            self.assertGreaterEqual(len(place["description"]["hi"]), 20, place_id)
            self.assertGreaterEqual(len(place["claim_scope"]), 12, place_id)
        for place in places.values():
            if place["type"].startswith("living_"):
                self.assertNotIn("timeless", place["claim_scope"].lower(), place["place_id"])

    def test_all_evidence_references_resolve_to_lane_source_register(self):
        documents = [self.world_pack, self.entities, *self.story_packs]
        unresolved = sorted({ref for doc in documents for ref in walk_evidence_refs(doc)} - self.registered_sources)
        self.assertEqual(unresolved, [])
        self.assertEqual(len(self.registered_sources), 30)

    def test_cross_link_proposals_conform_and_avoid_unsafe_predicates(self):
        schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
        jsonschema.Draft202012Validator(schema).validate(self.proposal_pack)
        proposals = self.proposal_pack["proposals"]
        self.assertEqual(len(proposals), 12)
        self.assertEqual(len({item["proposal_id"] for item in proposals}), 12)
        self.assertFalse({item["predicate"] for item in proposals} & {"related_to", "same_as", "is_form_of", "origin_of"})
        for item in proposals:
            for evidence in item["evidence_refs"]:
                self.assertIn(evidence["ref"], self.registered_sources | {
                    "practice-dhantrayodashi", "practice-west-lakshmi-puja"
                })

    def test_utf8_and_no_mojibake_or_completion_placeholders(self):
        forbidden = ("missing", "unclassified", "draft_placeholder", "todo", "tbd")
        bilingual_paths = {WORLDS, ENTITIES, PROPOSALS} | set(STORY_DIR.glob("*.json"))
        for path in sorted(LANE.rglob("*.json")):
            raw = path.read_bytes()
            text = raw.decode("utf-8", errors="strict")
            if path in bilingual_paths:
                self.assertTrue(any("\u0900" <= char <= "\u097f" for char in text), path)
            for marker in MOJIBAKE:
                self.assertNotIn(marker, text, path)
            lowered = text.lower()
            for marker in forbidden:
                self.assertNotIn(f'"status":"{marker}"', lowered, path)

    def test_changed_files_remain_inside_exclusive_lane_globs(self):
        result = subprocess.run(
            ["git", "status", "--porcelain=v1", "-uall"], cwd=ROOT,
            check=True, capture_output=True, text=True, encoding="utf-8",
        )
        allowed = (
            "knowledge_packs/library_lanes/diwali/",
            "docs/library_lanes/diwali/",
            "tools/test_library_lane_diwali",
        )
        outside = []
        for line in result.stdout.splitlines():
            path = line[3:].replace("\\", "/")
            if " -> " in path:
                path = path.split(" -> ", 1)[1]
            if not path.startswith(allowed):
                outside.append(path)
        self.assertEqual(outside, [])


if __name__ == "__main__":
    unittest.main(verbosity=2)

import json
import subprocess
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LANE = ROOT / "knowledge_packs" / "library_lanes" / "ganesha"


def load(relative):
    path = ROOT / relative
    return json.loads(path.read_text(encoding="utf-8"))


def has_devanagari(value):
    return any("\u0900" <= char <= "\u097f" for char in value)


class GaneshaLaneContentTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.denominator = load("knowledge_packs/library_lanes/ganesha/ganesha-consumer-denominator-v1.json")
        cls.sources = load("knowledge_packs/library_lanes/ganesha/source-registry-v1.json")
        cls.reconciliation = load("knowledge_packs/library_lanes/ganesha/stories/ganesha-purana-krida-reconciliation-v1.json")
        cls.gp = load("knowledge_packs/library_lanes/ganesha/stories/ganesha-purana-four-yuga-spine-v1.json")
        cls.shiva = load("knowledge_packs/library_lanes/ganesha/stories/shiva-purana-family-cycle-v1.json")
        cls.short = load("knowledge_packs/library_lanes/ganesha/stories/scribe-tusk-tulasi-stories-v1.json")
        cls.practices = load("knowledge_packs/library_lanes/ganesha/practices/ganesh-chaturthi-regional-practices-v1.json")
        cls.temples = load("knowledge_packs/library_lanes/ganesha/places/ganesha-living-temples-v1.json")
        cls.world = load("knowledge_packs/library_lanes/ganesha/ganesha-world-index-v1.json")
        cls.links = load("knowledge_packs/library_lanes/ganesha/cross-lane-link-proposals-v1.json")

    def all_stories(self):
        gp_story = {
            "story_family_id": self.gp["story_family_id"],
            "scenes": [scene for movement in self.gp["movements"] for scene in movement["scenes"]],
        }
        return [gp_story, *self.shiva["families"], *self.short["stories"]]

    def test_all_json_is_utf8_without_replacement_characters(self):
        for path in LANE.rglob("*.json"):
            text = path.read_text(encoding="utf-8")
            self.assertNotIn("\ufffd", text, path)
            json.loads(text)

    def test_frozen_denominator_counts(self):
        counts = self.denominator["freeze_counts"]
        self.assertEqual(6, counts["accepted_story_families"])
        self.assertEqual(4, counts["accepted_practice_lanes"])
        self.assertEqual(12, counts["selected_temples"])
        self.assertEqual(2, counts["blocked_story_extensions"])
        self.assertEqual("cf0e9406ea2120a77d9b2c4cd5552148e0a9aaaf", self.denominator["coordination_commit"])

    def test_denominator_source_refs_resolve_to_lane_registry(self):
        known = {
            item["source_id"]
            for section in ("narrative_sources", "current_authoritative_sources")
            for item in self.sources[section]
        }
        referenced = {
            source_ref
            for family in self.denominator["story_families"]
            for source_ref in family["source_refs"]
        }
        self.assertTrue(referenced.issubset(known), sorted(referenced - known))

    def test_krida_reconciliation_covers_each_chapter_once(self):
        chapters = []
        for movement in self.reconciliation["movements"]:
            for item in movement["ranges"]:
                chapters.extend(range(item["start"], item["end"] + 1))
        self.assertEqual(list(range(1, 156)), chapters)
        self.assertEqual(155, self.reconciliation["audit"]["covered_chapter_count"])
        self.assertTrue(self.reconciliation["audit"]["source_end_verified"])

    def test_every_story_family_is_substantial_bilingual_and_terminal(self):
        accepted = {item["story_family_id"] for item in self.denominator["story_families"]}
        stories = self.all_stories()
        self.assertEqual(accepted, {item["story_family_id"] for item in stories})
        total_scenes = 0
        total_beats = 0
        for story in stories:
            scenes = story["scenes"]
            self.assertGreaterEqual(len(scenes), 3, story["story_family_id"])
            total_scenes += len(scenes)
            previous = 0
            for scene in scenes:
                source_order = scene.get("source_start_ordinal", scene.get("ordinal"))
                self.assertIsNotNone(source_order, scene["scene_id"])
                self.assertGreaterEqual(source_order, previous)
                previous = source_order
                self.assertGreaterEqual(len(scene["beats"]), 2, scene["scene_id"])
                self.assertGreaterEqual(len(scene["decisive_change"]["en"]), 45)
                self.assertGreaterEqual(len(scene["decisive_change"]["hi"]), 30)
                self.assertTrue(has_devanagari(scene["decisive_change"]["hi"]), scene["scene_id"])
                for beat in scene["beats"]:
                    total_beats += 1
                    self.assertGreaterEqual(len(beat["narration"]["en"]), 150, beat["beat_id"])
                    self.assertGreaterEqual(len(beat["narration"]["hi"]), 100, beat["beat_id"])
                    self.assertTrue(has_devanagari(beat["narration"]["hi"]), beat["beat_id"])
        self.assertEqual(46, total_scenes)
        self.assertEqual(99, total_beats)

    def test_story_variant_and_reception_boundaries(self):
        payload = json.dumps([self.gp, self.shiva, self.short], ensure_ascii=False).lower()
        for phrase in ["critical-edition main text", "does not say", "other", "not a romance template", "source-specific"]:
            self.assertIn(phrase, payload)
        beat_payload = json.dumps(
            [beat for story in self.all_stories() for scene in story["scenes"] for beat in scene["beats"]],
            ensure_ascii=False,
        ).lower()
        self.assertNotIn("tusk to use as the pen", beat_payload)

    def test_practice_denominator_and_contract_fields(self):
        accepted = {item["practice_lane_id"] for item in self.denominator["practice_lanes"]}
        actual = {item["practice_lane_id"] for item in self.practices["practice_lanes"]}
        self.assertEqual(accepted, actual)
        self.assertEqual(4, self.practices["coverage"]["completed_practice_lanes"])
        for lane in self.practices["practice_lanes"]:
            self.assertIn("applicability", lane)
            if lane["completion_state"].startswith("reused"):
                self.assertIn("content_ref", lane)
                self.assertIn("contract_fields_present", lane["audit"])
                continue
            for field in ["meaning", "origin_narratives", "typical_practice", "materials", "ordered_guidance", "closing", "safety", "variants", "source_ids"]:
                self.assertIn(field, lane, (lane["practice_lane_id"], field))
            ordinals = [item["ordinal"] for item in lane["ordered_guidance"]]
            self.assertEqual(list(range(1, len(ordinals) + 1)), ordinals)
            self.assertGreaterEqual(len(ordinals), 6)
            self.assertTrue(all("substitution" in item for item in lane["materials"]))
            self.assertTrue(all(has_devanagari(item["instruction"]["hi"]) for item in lane["ordered_guidance"]))
        payload = json.dumps(self.practices, ensure_ascii=False).lower()
        for phrase in ["family_practice_overrides", "must not guess", "do not enter water", "permanent image", "not a universal"]:
            self.assertIn(phrase, payload)

    def test_temple_denominator_and_claim_layers(self):
        expected = {item["temple_id"] for item in self.denominator["temples"]}
        actual = {item["temple_id"] for item in self.temples["temples"]}
        self.assertEqual(expected, actual)
        self.assertEqual(12, len(actual))
        for temple in self.temples["temples"]:
            self.assertTrue(has_devanagari(temple["name"]["hi"]), temple["temple_id"])
            self.assertIn("current_identity", temple)
            self.assertIn("visitor_orientation", temple)
            self.assertGreaterEqual(len(temple["source_ids"]), 1)
        self.assertIn("archaeology_boundary", next(x for x in self.temples["temples"] if x["temple_id"] == "girijatmaj-lenyadri"))
        self.assertIn("history_boundary", next(x for x in self.temples["temples"] if x["temple_id"] == "uchi-pillayar-tiruchirappalli"))

    def test_world_index_reconciles_required_entities_and_places(self):
        self.assertEqual(6, self.world["coverage"]["story_families"])
        self.assertEqual(8, self.world["coverage"]["character_families"])
        self.assertEqual(7, self.world["coverage"]["place_families"])
        self.assertEqual(4, self.world["coverage"]["practice_units"])
        self.assertEqual(12, self.world["coverage"]["temple_units"])
        self.assertEqual(2, self.world["coverage"]["temple_groups"])
        ashtavinayak = next(item for item in self.world["temple_groups"] if item["group_id"] == "ashtavinayak-living-circuit")
        self.assertEqual(8, len(ashtavinayak["members"]))
        self.assertEqual(8, len(set(ashtavinayak["members"])))
        self.assertTrue(set(ashtavinayak["members"]).issubset(set(self.world["temple_units"])))

    def test_cross_lane_proposals_validate_and_avoid_broad_predicates(self):
        schema = load("schemas/cross-lane-link-proposal-v1.schema.json")
        try:
            from jsonschema import Draft202012Validator
        except ImportError:  # pragma: no cover - repository CI provides jsonschema
            self.skipTest("jsonschema is not installed")
        errors = list(Draft202012Validator(schema).iter_errors(self.links))
        self.assertEqual([], [f"{e.json_path}: {e.message}" for e in errors])
        forbidden = {"related_to", "same_as", "is_form_of", "origin_of"}
        predicates = {item["predicate"] for item in self.links["proposals"]}
        self.assertFalse(forbidden & predicates)
        linked_story_ids = {
            item["from_ref"].get("lane_local_id")
            for item in self.links["proposals"]
            if item["relationship_family"] == "story"
        }
        self.assertTrue({item["lane_local_id"] for item in self.world["story_units"]}.issubset(linked_story_ids))

    def test_authored_state_is_not_projection_or_release(self):
        payload = json.dumps([self.gp, self.shiva, self.short, self.practices, self.temples], ensure_ascii=False)
        self.assertIn("authored_not_projected", payload)
        self.assertNotIn('"projected": true', payload.lower())
        self.assertNotIn('"hosted": true', payload.lower())
        self.assertNotIn('"independently_reviewed": true', payload.lower())

    def test_only_exclusive_lane_paths_are_changed(self):
        result = subprocess.run(
            ["git", "status", "--porcelain", "--untracked-files=all"],
            cwd=ROOT,
            check=True,
            capture_output=True,
            text=True,
            encoding="utf-8",
        )
        allowed_prefixes = (
            "docs/library_lanes/ganesha/",
            "knowledge_packs/library_lanes/ganesha/",
            "tools/test_library_lane_ganesha",
        )
        unexpected = []
        for line in result.stdout.splitlines():
            path = line[3:].replace("\\", "/")
            if " -> " in path:
                path = path.split(" -> ", 1)[1]
            if not path.startswith(allowed_prefixes):
                unexpected.append(path)
        self.assertEqual([], unexpected)


if __name__ == "__main__":
    unittest.main()

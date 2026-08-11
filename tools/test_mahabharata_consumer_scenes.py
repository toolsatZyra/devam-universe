from __future__ import annotations

import hashlib
import json
import re
import unittest
from pathlib import Path

from tools.qualify_ganguli_mahabharata_sources import compile_qualification


ROOT = Path(__file__).resolve().parents[1]
PACK_PATHS = [
    ROOT / "knowledge_packs" / "mahabharata" / "consumer-scenes-opening-v1.json",
    ROOT / "knowledge_packs" / "mahabharata" / "consumer-scenes-astika-v1.json",
    ROOT / "knowledge_packs" / "mahabharata" / "consumer-scenes-shakuntala-v1.json",
    ROOT / "knowledge_packs" / "mahabharata" / "consumer-scenes-yayati-origins-v1.json",
]
PLAN_PATH = ROOT / "ingestion" / "plans" / "mahabharata-kisari-mohan-ganguli-project-gutenberg-source-qualification-v1.json"
BACKBONE_PATH = ROOT / "knowledge_packs" / "inventories" / "mahabharata-consumer-backbone-v1.json"


class MahabharataConsumerScenesTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.packs = [json.loads(path.read_text(encoding="utf-8")) for path in PACK_PATHS]
        cls.scenes = [scene for pack in cls.packs for scene in pack["scenes"]]
        cls.plan = json.loads(PLAN_PATH.read_text(encoding="utf-8"))
        cls.backbone = json.loads(BACKBONE_PATH.read_text(encoding="utf-8"))
        _report, cls.units = compile_qualification()
        cls.sources = {
            source["volume"]: (ROOT / "source_vault" / source["object_path"]).read_bytes()
            for source in cls.plan["source_objects"]
        }

    def test_batch_contract_and_honest_status(self) -> None:
        self.assertTrue(all(pack["contract"] == "DEVAM_MAHABHARATA_CONSUMER_SCENES_V1" for pack in self.packs))
        self.assertTrue(all(pack["status"] == "authored_not_projected" for pack in self.packs))
        self.assertEqual(25, len(self.scenes))
        self.assertEqual(110, sum(len(scene["beats"]) for scene in self.scenes))
        self.assertEqual(25, sum(pack["coverage"]["scene_count"] for pack in self.packs))
        self.assertEqual(110, sum(pack["coverage"]["beat_count"] for pack in self.packs))
        self.assertTrue(all(scene["status"] == "authored_not_projected" for scene in self.scenes))

    def test_scenes_partition_the_first_two_backbone_turns_exactly(self) -> None:
        turns = {turn["id"]: turn for turn in self.backbone["turns"]}
        by_turn: dict[str, list[int]] = {}
        for scene in self.scenes:
            source_range = scene["source_range"]
            by_turn.setdefault(scene["turn_id"], []).extend(
                range(source_range["start_ordinal"], source_range["end_ordinal"] + 1)
            )
        for turn_id in [
            "story-enters-sacrifice",
            "vows-curses-ruru",
            "astika-stops-destruction",
            "gods-shakuntala-bharata",
        ]:
            source_range = turns[turn_id]["source_range"]
            self.assertEqual(
                list(range(source_range["start_ordinal"], source_range["end_ordinal"] + 1)),
                by_turn[turn_id],
                turn_id,
            )
            self.assertEqual(len(by_turn[turn_id]), len(set(by_turn[turn_id])), turn_id)

    def test_partial_yayati_batch_names_its_remaining_range(self) -> None:
        pack = next(pack for pack in self.packs if pack["batch_id"] == "yayati-origins-kacha-devayani-sharmishtha")
        self.assertFalse(pack["coverage"]["completes_backbone_turn"])
        self.assertEqual(75, pack["coverage"]["source_start_ordinal"])
        self.assertEqual(80, pack["coverage"]["source_end_ordinal"])
        self.assertEqual(81, pack["coverage"]["remaining_source_start_ordinal"])
        self.assertEqual(94, pack["coverage"]["remaining_source_end_ordinal"])

    def test_every_scene_reconstructs_from_the_fixed_source(self) -> None:
        units = {
            (unit["parva_slug"], unit["parva_source_ordinal"]): unit
            for unit in self.units
        }
        for scene in self.scenes:
            source_range = scene["source_range"]
            selected = [
                units[(source_range["parva_slug"], ordinal)]
                for ordinal in range(source_range["start_ordinal"], source_range["end_ordinal"] + 1)
            ]
            self.assertEqual(1, len({unit["volume"] for unit in selected}), scene["id"])
            raw = self.sources[selected[0]["volume"]]
            span = raw[selected[0]["byte_start"]:selected[-1]["byte_end_exclusive"]]
            self.assertEqual(source_range["span_sha256"], hashlib.sha256(span).hexdigest(), scene["id"])

    def test_scenes_are_bilingual_visual_and_substantial(self) -> None:
        scene_ids: set[str] = set()
        beat_ids: set[str] = set()
        for scene in self.scenes:
            self.assertNotIn(scene["id"], scene_ids)
            scene_ids.add(scene["id"])
            self.assertGreaterEqual(len(scene["beats"]), 4, scene["id"])
            self.assertGreater(len(scene["visual_identity"]), 100, scene["id"])
            self.assertTrue(scene["characters"], scene["id"])
            self.assertTrue(scene["places"], scene["id"])
            for language in ("en", "hi"):
                self.assertGreater(len(scene["title"][language]), 20, scene["id"])
                self.assertGreater(len(scene["decisive_change"][language]), 90, scene["id"])
            for beat in scene["beats"]:
                self.assertNotIn(beat["id"], beat_ids)
                beat_ids.add(beat["id"])
                self.assertTrue(beat["character_ids"], beat["id"])
                self.assertGreater(len(beat["visual_direction"]), 100, beat["id"])
                self.assertGreater(len(beat["title"]["en"]), 15, beat["id"])
                self.assertGreater(len(beat["title"]["hi"]), 12, beat["id"])
                self.assertGreater(len(beat["narration"]["en"]), 200, beat["id"])
                self.assertGreater(len(beat["narration"]["hi"]), 170, beat["id"])

    def test_consumer_copy_does_not_lead_with_source_apparatus(self) -> None:
        forbidden = ("sha256", "section ", "project gutenberg", "citation", "footnote")
        for scene in self.scenes:
            public_copy = " ".join(
                [scene["title"]["en"], scene["decisive_change"]["en"]]
                + [beat["title"]["en"] for beat in scene["beats"]]
                + [beat["narration"]["en"] for beat in scene["beats"]]
            ).casefold()
            for term in forbidden:
                self.assertIsNone(
                    re.search(rf"(?<![a-z]){re.escape(term.strip())}(?![a-z])", public_copy),
                    f"{scene['id']} exposes {term!r}",
                )


if __name__ == "__main__":
    unittest.main()

"""Compile the popular-reception and living-bridge Ramayana story batch."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

try:
    from tools.compile_ramayana_expected_story_batch import compile_sql
except ModuleNotFoundError:  # Direct `python tools/...` execution.
    from compile_ramayana_expected_story_batch import compile_sql


ROOT = Path(__file__).resolve().parents[1]
PACK = ROOT / "knowledge_packs/library_lanes/ramayana/expected-stories-popular-living-bridges-v1.json"
OUTPUT = ROOT / "supabase/migrations/20260814013000_seed_ramayana_expected_stories_popular_living_bridges.sql"
CONTRACT = "DEVAM_RAMAYANA_EXPECTED_STORIES_POPULAR_LIVING_BRIDGES_V1"
SERIES_SLUG = "ramayana-expected-stories-popular-living-bridges-v1"
SNAPSHOT = "DEVAM_RAMAYANA_EXPECTED_STORIES_POPULAR_LIVING_BRIDGES_DB_V1"


def load_pack() -> dict:
    data = json.loads(PACK.read_text(encoding="utf-8"))
    if data.get("contract") != CONTRACT or data.get("version") != 1:
        raise ValueError("popular and living bridge batch contract drift")
    stories = data.get("stories", [])
    expected = [
        "popular-lakshman-rekha",
        "popular-shabari-tasted-berries",
        "regional-bridge-squirrel",
        "living-rameswaram-linga-tradition",
        "living-diwali-rama-homecoming",
    ]
    if [row.get("expectation_id") for row in stories] != expected:
        raise ValueError("popular and living bridge story denominator or order drift")
    if any(row.get("consumer_state") != "consumer_complete_en_hi" for row in stories):
        raise ValueError("every projected popular or living bridge story must be consumer_complete_en_hi")
    if sum(len(row.get("episodes", [])) for row in stories) != 35:
        raise ValueError("popular and living bridge episode denominator drift")
    return data


def story_source_range(data: dict, story: dict, snapshot: str) -> dict:
    alignment = story["source_alignment"]
    return {
        "snapshotContract": snapshot,
        "expectationId": story["expectation_id"],
        "storyId": story["story_id"],
        "sourceFamily": alignment["source_family"],
        "sourceRefs": alignment["source_refs"],
        "selectedExpressionRelation": alignment["selected_expression_relation"],
        "alignmentNote": alignment["alignment_note"],
    }


def beat_source_range(data: dict, story: dict, episode: dict, snapshot: str) -> dict:
    return {
        "snapshotContract": snapshot,
        "storyId": story["story_id"],
        "sourceFamily": story["source_alignment"]["source_family"],
        "sourceRefs": episode["source_refs"],
    }


def render() -> str:
    return compile_sql(
        load_pack(),
        series_slug=SERIES_SLUG,
        snapshot=SNAPSHOT,
        arcs=[
            ("exile_reception", 1, "Forest reception stories", "वन की लोक-स्मृति कथाएँ"),
            ("bridge_reception", 2, "Bridge reception story", "सेतु की लोक-स्मृति कथा"),
            ("living_afterlife", 3, "Living India connections", "जीवित भारत से जुड़ी कथाएँ"),
        ],
        series_title="Ramayana expected stories: popular and living bridges",
        series_boundary=(
            "Five source-bounded Devam consumer stories across popular reception, regional telling, "
            "living Rameswaram temple tradition and the North Indian Diwali homecoming association. "
            "They are not one source expression, every Ramayana, every Rameswaram tradition, or every Diwali."
        ),
        work_spec={
            "slug": "ramayana-popular-and-living-bridges-v1",
            "canonical_title": "Ramayana popular and living bridges",
            "work_kind": "composite_story_reception",
            "tradition_scope": ["Sanatana Dharma", "Rama traditions", "Living India"],
            "summary": "A bounded Devam synthesis of separately labelled reception and living-world stories; not an ancient source text or universal tradition.",
            "language_code": "en",
            "script_code": "Latn",
            "expression_kind": "devam_bilingual_source_bounded_synthesis",
            "attribution": "Devam popular-reception and living-bridge synthesis v1",
            "is_source_original": False,
            "ai_generated": True,
        },
        source_range_factory=story_source_range,
        beat_source_range_factory=beat_source_range,
        include_passage_evidence=False,
        projection_label="popular-reception and living-world supplement",
        check_label="popular and living bridge stories",
        beat_check_label="popular and living bridge story",
        total_source_units=5,
        link_label="curated reception and living-world traversal",
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    rendered = render()
    if args.check:
        if not OUTPUT.exists() or OUTPUT.read_text(encoding="utf-8") != rendered:
            raise SystemExit("popular and living bridge migration is stale; run the compiler")
        print("PASS: popular and living bridge migration is current")
        return
    OUTPUT.write_text(rendered, encoding="utf-8", newline="\n")
    print(f"Wrote {OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

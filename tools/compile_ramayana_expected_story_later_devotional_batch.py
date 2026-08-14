"""Compile the final later-performance, regional, and devotional Ramayana v1 batch."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

try:
    from tools.compile_ramayana_expected_story_batch import compile_sql
except ModuleNotFoundError:  # Direct `python tools/...` execution.
    from compile_ramayana_expected_story_batch import compile_sql


ROOT = Path(__file__).resolve().parents[1]
PACK = ROOT / "knowledge_packs/library_lanes/ramayana/expected-stories-later-devotional-v1.json"
OUTPUT = ROOT / "supabase/migrations/20260814030000_seed_ramayana_expected_stories_later_devotional.sql"
CONTRACT = "DEVAM_RAMAYANA_EXPECTED_STORIES_LATER_DEVOTIONAL_V1"
SERIES_SLUG = "ramayana-expected-stories-later-devotional-v1"
SNAPSHOT = "DEVAM_RAMAYANA_EXPECTED_STORIES_LATER_DEVOTIONAL_DB_V1"


def load_pack() -> dict:
    data = json.loads(PACK.read_text(encoding="utf-8"))
    if data.get("contract") != CONTRACT or data.get("version") != 1:
        raise ValueError("later devotional batch contract drift")
    stories = data.get("stories", [])
    expected = [
        "popular-sulochana-meghnad",
        "regional-ahiravana-mahiravana-rescue",
        "popular-luv-kush-ashvamedha-confrontation",
        "popular-hanuman-opens-chest",
        "popular-hanuman-sindoor",
    ]
    if [row.get("expectation_id") for row in stories] != expected:
        raise ValueError("later devotional story denominator or order drift")
    if any(row.get("consumer_state") != "consumer_complete_en_hi" for row in stories):
        raise ValueError("every projected later devotional story must be consumer_complete_en_hi")
    episode_count = sum(len(row.get("episodes", [])) for row in stories)
    if episode_count != 45 or data.get("batch_counters", {}).get("episodes") != 45:
        raise ValueError("later devotional episode denominator drift")
    for story in stories:
        episodes = story["episodes"]
        if [row["ordinal"] for row in episodes] != list(range(1, len(episodes) + 1)):
            raise ValueError(f"non-contiguous episode ordinals: {story['story_id']}")
        for episode in episodes:
            for language in ("en", "hi"):
                if len(episode["narration"][language].split()) < 22:
                    raise ValueError(
                        f"compressed narration: {story['story_id']} / {episode['episode_id']} / {language}"
                    )
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
            ("war_performance", 1, "War performance afterlife", "युद्ध की प्रदर्शन-परंपरा"),
            ("war_regional", 2, "Regional underworld rescue", "क्षेत्रीय पाताल-उद्धार कथा"),
            ("aftermath_reception", 3, "Lava-Kusha reception story", "लव-कुश लोक-स्वीकृति कथा"),
            ("devotional_afterlife", 4, "Hanuman devotional stories", "हनुमान भक्तिपरक कथाएँ"),
        ],
        series_title="Ramayana expected stories: later and devotional reception",
        series_boundary=(
            "Five source-bounded Devam consumer stories across later performance, regional branches, "
            "an institutional popular retelling, and modern Hanuman devotion. They are not one source "
            "expression, the selected Dutt Ramayana, or every Rama and Hanuman tradition."
        ),
        work_spec={
            "slug": "ramayana-later-and-devotional-reception-v1",
            "canonical_title": "Ramayana later and devotional reception",
            "work_kind": "composite_story_reception",
            "tradition_scope": ["Sanatana Dharma", "Rama traditions", "Hanuman devotion"],
            "summary": "A bounded Devam synthesis of separately labelled later performance, regional, and devotional stories; not an ancient source text or universal tradition.",
            "language_code": "en",
            "script_code": "Latn",
            "expression_kind": "devam_bilingual_source_bounded_synthesis",
            "attribution": "Devam later-performance and devotional synthesis v1",
            "is_source_original": False,
            "ai_generated": True,
        },
        source_range_factory=story_source_range,
        beat_source_range_factory=beat_source_range,
        include_passage_evidence=False,
        projection_label="later-performance, regional, and devotional supplement",
        check_label="later and devotional Ramayana stories",
        beat_check_label="later and devotional Ramayana story",
        total_source_units=5,
        link_label="curated later-reception traversal",
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    rendered = render()
    if args.check:
        if not OUTPUT.exists() or OUTPUT.read_text(encoding="utf-8") != rendered:
            raise SystemExit("later devotional migration is stale; run the compiler")
        print("PASS: later devotional migration is current")
        return
    OUTPUT.write_text(rendered, encoding="utf-8", newline="\n")
    print(f"Wrote {OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

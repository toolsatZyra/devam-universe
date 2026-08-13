"""Compile the Ramcharitmanas war-messengers expected-story batch."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

try:
    from tools.compile_ramayana_expected_story_batch import compile_sql
except ModuleNotFoundError:  # Direct `python tools/...` execution.
    from compile_ramayana_expected_story_batch import compile_sql


ROOT = Path(__file__).resolve().parents[1]
PACK = ROOT / "knowledge_packs/library_lanes/ramayana/expected-stories-war-messengers-v1.json"
OUTPUT = ROOT / "supabase/migrations/20260813163000_seed_ramayana_expected_stories_war_messengers.sql"
CONTRACT = "DEVAM_RAMAYANA_EXPECTED_STORIES_WAR_MESSENGERS_V1"
SERIES_SLUG = "ramcharitmanas-expected-stories-war-messengers-v1"
SNAPSHOT = "DEVAM_RAMAYANA_EXPECTED_STORIES_WAR_MESSENGERS_DB_V1"


def load_pack() -> dict:
    data = json.loads(PACK.read_text(encoding="utf-8"))
    if data.get("contract") != CONTRACT or data.get("version") != 1:
        raise ValueError("war-messengers batch contract drift")
    stories = data.get("stories", [])
    expected = [
        "manas-angada-immovable-foot",
        "manas-kalnemi-deception",
        "manas-bharata-shoots-hanuman",
    ]
    if [row.get("expectation_id") for row in stories] != expected:
        raise ValueError("war-messengers story denominator or order drift")
    if any(row.get("consumer_state") != "consumer_complete_en_hi" for row in stories):
        raise ValueError("every projected war story must be consumer_complete_en_hi")
    if sum(len(row.get("episodes", [])) for row in stories) != 25:
        raise ValueError("war-messengers episode denominator drift")
    return data


def render() -> str:
    return compile_sql(
        load_pack(),
        series_slug=SERIES_SLUG,
        snapshot=SNAPSHOT,
        arcs=[("war", 1, "War messengers", "युद्ध के दूत")],
        series_title="Ramcharitmanas expected stories: war messengers",
        series_boundary=(
            "Three source-aligned consumer stories from labelled Ramcharitmanas war ranges. "
            "This is not a complete Ramcharitmanas story map, every medicine-mountain telling, "
            "or the selected Dutt expression."
        ),
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    rendered = render()
    if args.check:
        if not OUTPUT.exists() or OUTPUT.read_text(encoding="utf-8") != rendered:
            raise SystemExit("Ramayana war-messengers migration is stale; run the compiler")
        print("PASS: Ramayana war-messengers migration is current")
        return
    OUTPUT.write_text(rendered, encoding="utf-8", newline="\n")
    print(f"Wrote {OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

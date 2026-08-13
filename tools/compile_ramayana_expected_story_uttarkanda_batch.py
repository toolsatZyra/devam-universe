"""Compile the Ramcharitmanas Uttarkanda expected-story batch."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

try:
    from tools.compile_ramayana_expected_story_batch import compile_sql
except ModuleNotFoundError:  # Direct `python tools/...` execution.
    from compile_ramayana_expected_story_batch import compile_sql


ROOT = Path(__file__).resolve().parents[1]
PACK = ROOT / "knowledge_packs/library_lanes/ramayana/expected-stories-uttarkanda-frames-v1.json"
OUTPUT = ROOT / "supabase/migrations/20260813235500_seed_ramayana_expected_stories_uttarkanda_frames.sql"
CONTRACT = "DEVAM_RAMAYANA_EXPECTED_STORIES_UTTARKANDA_FRAMES_V1"
SERIES_SLUG = "ramcharitmanas-expected-stories-uttarkanda-frames-v1"
SNAPSHOT = "DEVAM_RAMAYANA_EXPECTED_STORIES_UTTARKANDA_FRAMES_DB_V1"


def load_pack() -> dict:
    data = json.loads(PACK.read_text(encoding="utf-8"))
    if data.get("contract") != CONTRACT or data.get("version") != 1:
        raise ValueError("Uttarkanda batch contract drift")
    stories = data.get("stories", [])
    expected = [
        "manas-uttar-kanda-bhakti-teachings",
        "manas-kakabhushundi-garuda-dialogue",
    ]
    if [row.get("expectation_id") for row in stories] != expected:
        raise ValueError("Uttarkanda story denominator or order drift")
    if any(row.get("consumer_state") != "consumer_complete_en_hi" for row in stories):
        raise ValueError("every projected Uttarkanda story must be consumer_complete_en_hi")
    if sum(len(row.get("episodes", [])) for row in stories) != 46:
        raise ValueError("Uttarkanda episode denominator drift")
    return data


def render() -> str:
    return compile_sql(
        load_pack(),
        series_slug=SERIES_SLUG,
        snapshot=SNAPSHOT,
        arcs=[("aftermath", 1, "Aftermath and closing frames", "उत्तरकथा और अंतिम कथा-भूमिकाएँ")],
        series_title="Ramcharitmanas expected stories: Uttarkanda frames",
        series_boundary=(
            "Two source-aligned consumer sequences covering the Uttarkanda public aftermath and "
            "Kakabhushundi-Garuda frame. This is not the complete page-by-page reading work, every "
            "Ramayana aftermath, or the selected Dutt expression."
        ),
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    rendered = render()
    if args.check:
        if not OUTPUT.exists() or OUTPUT.read_text(encoding="utf-8") != rendered:
            raise SystemExit("Ramayana Uttarkanda migration is stale; run the compiler")
        print("PASS: Ramayana Uttarkanda migration is current")
        return
    OUTPUT.write_text(rendered, encoding="utf-8", newline="\n")
    print(f"Wrote {OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

"""Compile one lean Ramayana consumer-expectation denominator."""

from __future__ import annotations

import argparse
import json
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SELECTED = ROOT / "knowledge_packs/inventories/ramayana-story-universe-v1.json"
SUPPLEMENTS = ROOT / "knowledge_packs/inventories/ramayana-expected-story-supplements-v1.json"
OUTPUT = ROOT / "knowledge_packs/inventories/ramayana-expected-story-checklist-v1.json"


def compile_inventory() -> dict:
    selected = json.loads(SELECTED.read_text(encoding="utf-8"))
    supplements = json.loads(SUPPLEMENTS.read_text(encoding="utf-8"))
    cycles = selected["selected_narrative"]["story_cycles"]
    supplement_rows = supplements["supplements"]
    if len(cycles) != 49:
        raise ValueError("Selected Dutt cycle denominator drift")
    if len({row["expectation_id"] for row in supplement_rows}) != len(supplement_rows):
        raise ValueError("Supplement expectation identifiers must be unique")
    selected_rows = [
        {
            "expectation_id": f"dutt-{cycle['story_cycle_id']}",
            "sequence_group": cycle["arc_id"],
            "selected_story_cycle_id": cycle["story_cycle_id"],
            "episode_count": cycle["episode_count"],
            "bilingual_beat_count": cycle["bilingual_beat_count"],
            "coverage_state": "consumer_complete_en_hi_selected_expression",
        }
        for cycle in cycles
    ]
    compiled_supplements = [
        {
            "expectation_id": row["expectation_id"],
            "sequence_group": row["sequence_group"],
            "expression_scopes": row["expression_scopes"],
            "nearest_selected_cycle_ids": row["nearest_selected_cycle_ids"],
            "coverage_state": row["coverage_state"],
            "source_alignment_state": row["source_alignment_state"],
        }
        for row in supplement_rows
    ]
    state_counts = Counter(row["coverage_state"] for row in supplement_rows)
    return {
        "contract": "DEVAM_RAMAYANA_EXPECTED_STORY_CHECKLIST_V1",
        "version": 1,
        "generated_at": "2026-08-13",
        "audience": supplements["audience"],
        "boundary": supplements["boundary"],
        "completion_rule": "A selected-expression row is complete only inside that expression. Every supplemental expectation must become consumer_complete_en_hi in its labelled expression, or be explicitly excluded with a reviewed scope reason.",
        "authoritative_inputs": {
            "selected_expression_inventory": str(SELECTED.relative_to(ROOT)).replace("\\", "/"),
            "expected_story_supplements": str(SUPPLEMENTS.relative_to(ROOT)).replace("\\", "/"),
        },
        "counters": {
            "selected_expression_story_cycles": len(selected_rows),
            "supplemental_expected_stories": len(supplement_rows),
            "total_expected_story_rows": len(selected_rows) + len(supplement_rows),
            "selected_expression_rows_complete_en_hi": len(selected_rows),
            "supplemental_rows_complete_en_hi": state_counts["consumer_complete_en_hi"],
            "supplemental_rows_open": len(supplement_rows) - state_counts["consumer_complete_en_hi"],
            "supplemental_coverage_states": dict(sorted(state_counts.items())),
        },
        "selected_expression_rows": selected_rows,
        "supplemental_rows": compiled_supplements,
        "source_registry_ids": [row["source_id"] for row in supplements["source_registry"]],
        "completion_state": "supplemental_expected_story_authoring_required" if any(row["coverage_state"] != "consumer_complete_en_hi" for row in supplement_rows) else "approved_version_complete",
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    rendered = json.dumps(compile_inventory(), ensure_ascii=False, indent=2) + "\n"
    if args.check:
        if not OUTPUT.exists() or OUTPUT.read_text(encoding="utf-8") != rendered:
            raise SystemExit("Ramayana expected-story checklist is stale; run the compiler")
        print("Ramayana expected-story checklist is current")
        return
    OUTPUT.write_text(rendered, encoding="utf-8")
    print(f"Wrote {OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

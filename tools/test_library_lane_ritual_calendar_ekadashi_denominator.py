import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DISPOSITION = ROOT / "knowledge_packs/library_lanes/ritual-calendar/inventory/ritual-calendar-candidate-disposition-ekadashi-v1.json"
FREEZE = ROOT / "docs/library_lanes/ritual-calendar/EKADASHI_AUTHORING_DENOMINATOR_2026-08-13.md"


def load(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def test_ekadashi_denominator_is_exact_and_named():
    data = load(DISPOSITION)
    counts = data["counts"]
    assert counts == {
        "source_labels_dispositioned": 41,
        "accepted_distinct_lane": 30,
        "alias_of_accepted_lane": 11,
        "ordinary_monthly_instances": 24,
        "gauna_or_vaishnava_variants": 6,
    }

    accepted = [entry for entry in data["entries"] if entry["disposition"] == "accepted_distinct_lane"]
    aliases = [entry for entry in data["entries"] if entry["disposition"] == "alias_of_accepted_lane"]
    assert len(accepted) == 30
    assert len(aliases) == 11
    assert len({entry["canonical_candidate_id"] for entry in accepted}) == 30
    assert {entry["required_applicability_context"] for entry in accepted} == {
        "ordinary-monthly-ekadashi",
        "gauna-date-variant",
        "vaishnava-tradition-date-variant",
    }
    assert {entry["canonical_candidate_id"] for entry in aliases} <= {
        entry["canonical_candidate_id"] for entry in accepted
    }


def test_ekadashi_freeze_preserves_major_variant_rule_and_progress():
    text = FREEZE.read_text(encoding="utf-8")
    for required in (
        "30 named applicability work items",
        "24 ordinary named Ekadashi lanes",
        "six material date/tradition lanes",
        "eleven regional-name aliases",
        "Language, spelling, ordinary flowers or fruit, dress",
        "Saphala occurs twice",
        "16/208 completed, 192 remaining",
        "0/19,480",
    ):
        assert required in text
    assert "generic national Ekadashi ritual" in text
    assert "do not add work items unless evidence" in text


if __name__ == "__main__":
    tests = [value for name, value in globals().items() if name.startswith("test_") and callable(value)]
    for test in tests:
        test()
    print(f"PASS: {len(tests)} Ekadashi denominator checks")

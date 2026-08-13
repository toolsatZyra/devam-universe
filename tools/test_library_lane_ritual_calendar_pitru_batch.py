"""Adversarial contract checks for the 13-lane Pitru Paksha tithi batch."""

from __future__ import annotations

import json
from pathlib import Path

from jsonschema import Draft202012Validator


ROOT = Path(__file__).resolve().parents[1]
LANE = ROOT / "knowledge_packs" / "library_lanes" / "ritual-calendar"
KEYS = [
    "purnima", "pratipada", "dwitiya", "tritiya", "chaturthi", "panchami",
    "shashthi", "saptami", "ashtami", "navami", "dashami", "ekadashi",
    "chaturdashi",
]
PACKS = {
    key: LANE / "packs" / f"{key}-shraddha-north-west-authority-router-2027-v1.json"
    for key in KEYS
}
LINKS = LANE / "cross-links" / "pitru-paksha-tithi-batch-13-owner-and-story-proposals-v1.json"
PROGRESS = LANE / "inventory" / "ritual-calendar-authoring-progress-v1.json"
RESEARCH = LANE / "research" / "pitru-paksha-tithi-batch-13-evidence-matrix-2027-v1.md"


def load(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def walk_source_ids(value):
    if isinstance(value, dict):
        for key, child in value.items():
            if key in {"source_ids", "resolution_source_ids"}:
                yield from child
            yield from walk_source_ids(child)
    elif isinstance(value, list):
        for child in value:
            yield from walk_source_ids(child)


def localized_text(pack, language):
    return json.dumps(
        next(x for x in pack["localized_content"] if x["language_code"] == language),
        ensure_ascii=False,
    ).lower()


def test_pitru_batch_schema_utf8_source_closure_and_bilingual_parity():
    schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    for key, path in PACKS.items():
        raw = path.read_bytes()
        text = raw.decode("utf-8", errors="strict")
        assert "\ufffd" not in text
        pack = json.loads(text)
        Draft202012Validator(schema).validate(pack)
        assert pack["lane_id"] == f"{key}-shraddha-north-west-authority-router-2027-v1"
        assert pack["observance_slugs"] == [f"{key}-shraddha"]
        assert {x["language_code"] for x in pack["localized_content"]} == {"en", "hi"}
        assert all(len(x["procedures"]) == 3 for x in pack["localized_content"])
        assert all(len(x["origin_narratives"]) == 2 for x in pack["localized_content"])
        declared = {x["source_id"] for x in pack["sources"]}
        assert set(walk_source_ids(pack)) <= declared
        assert pack["calendar"]["location_aware"] is True
        assert pack["calendar"]["tradition_aware"] is True
        assert pack["calendar"]["live_schedule_required"] is True
        assert pack["product_status"]["classification"] == "user_complete_lane"
        assert pack["product_status"]["review_status"] == "internal_beta_reviewed"
        assert all(pack["product_status"]["completed_dimensions"].values())


def test_pitru_batch_major_variants_only_and_selected_state_coverage():
    required_regions = {
        "north-india", "west-india", "IN-MH", "IN-WB", "IN-BR", "IN-CG",
        "IN-KA", "IN-TN", "IN-KL", "IN-OD", "IN-AP",
    }
    for pack in map(load, PACKS.values()):
        assert required_regions <= set(pack["applicability"]["region_codes"])
        for localized in pack["localized_content"]:
            variants = localized["variants"]
            assert len(variants) == 4
            minor = [x for x in variants if not x["separate_lane_required"]]
            assert len(minor) == 1
            assert "cosmetic-state-split" in minor[0]["variant_id"]
            assert all(
                any(term in x["difference"].lower() for term in (
                    "timing", "eligibility", "performer", "actions", "materials",
                    "safety", "closing", "unknown", "death-tithi", "death tithi",
                    "amavasya", "authority", "applicability",
                    "does not merge", "merge नहीं", "remains separate", "अलग रहती",
                ))
                for x in variants if x["separate_lane_required"]
            )


def test_pitru_batch_rejects_universal_vidhi_benefit_and_same_tithi_mergers():
    forbidden = [
        "must fast", "son must", "male performer is required", "guarantees liberation",
        "guarantees peace", "dreams are ancestor messages", "copy this formal sequence home",
        "all states perform", "universal national ritual",
    ]
    required = [
        "no fast", "medicine", "no one owes", "pitru dosha", "112", "not",
        "named", "aparaahna", "no ancestor-contact",
    ]
    for key, pack in ((k, load(v)) for k, v in PACKS.items()):
        en = localized_text(pack, "en")
        assert all(term not in en for term in forbidden), key
        assert all(term in en for term in required), (key, [x for x in required if x not in en])
        assert "language, spelling, dress, ordinary food" in en
        assert "not one national procedure" in en or "not formal" in en
    assert "women's teej vrata" in localized_text(load(PACKS["tritiya"]), "en")
    assert "ganesha or sankashti" in localized_text(load(PACKS["chaturthi"]), "en")
    assert "surya-oriented chhath puja" in localized_text(load(PACKS["shashthi"]), "en")
    assert "jivitputrika" in localized_text(load(PACKS["ashtami"]), "en")
    assert "not indira ekadashi fasting" in localized_text(load(PACKS["ekadashi"]), "en")


def test_pitru_batch_preserves_special_applicability_and_dashami_contradiction():
    expected = {
        "purnima": ("purnima death-tithi", "amavasya"),
        "pratipada": ("maternal grandparents", "named family authority"),
        "panchami": ("unmarried", "does not infer marital history"),
        "navami": ("mother", "deceased women"),
        "dashami": ("copy error", "second accepted authority"),
    }
    for key, terms in expected.items():
        en = localized_text(load(PACKS[key]), "en")
        assert all(term in en for term in terms), (key, terms)

    chaturdashi = localized_text(load(PACKS["chaturdashi"]), "en")
    for term in (
        "weapon death", "accident", "suicide", "murder", "never classifies cause",
        "timing tension", "never romanticise suicide", "method details", "tele-manas",
        "14416", "1800-89-14416",
    ):
        assert term in chaturdashi
    for forbidden in ("suicide is a sin", "curse caused", "method:", "deserved death"):
        assert forbidden not in chaturdashi


def test_pitru_batch_cross_links_and_progress_reconcile():
    schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    links = load(LINKS)
    Draft202012Validator(schema).validate(links)
    ids = [x["proposal_id"] for x in links["proposals"]]
    assert len(ids) == len(set(ids))
    for key in KEYS:
        for suffix in ("to-existing-remembrance", "to-sarva-pitru", "to-formal-owner", "to-nachiketa-story"):
            assert f"{key}-{suffix}" in ids
    assert "chaturdashi-to-current-crisis-support" in ids

    progress = load(PROGRESS)
    assert progress["accepted_authoring_denominator"] == 208
    assert progress["completed_after_freeze"] == 116
    assert progress["remaining_authoring_items"] == 92
    assert progress["completed_after_freeze"] + progress["remaining_authoring_items"] == 208
    for key in KEYS:
        lane_id = f"{key}-shraddha-north-west-authority-router-2027-v1"
        assert progress["completed_lane_ids"].count(lane_id) == 1
        assert progress["completed_pack_refs"].count(
            f"knowledge_packs/library_lanes/ritual-calendar/packs/{lane_id}.json"
        ) == 1


def test_pitru_batch_research_matrix_is_complete_and_honest():
    text = RESEARCH.read_bytes().decode("utf-8", errors="strict")
    assert "\ufffd" not in text
    for key in KEYS:
        title = load(PACKS[key])["localized_content"][0]["title"]
        assert title in text
    for term in (
        "No reviewed source established a materially different state-by-state",
        "internal copy error",
        "does not count any lane",
        "Tele-MANAS",
        "Major-variant threshold",
    ):
        assert term in text

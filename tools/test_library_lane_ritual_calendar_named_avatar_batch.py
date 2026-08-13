"""Adversarial validation for nine named avatar-remembrance lanes."""
import json
from pathlib import Path

from jsonschema import Draft202012Validator

ROOT = Path(__file__).resolve().parents[1]
LANE = ROOT / "knowledge_packs" / "library_lanes" / "ritual-calendar"
SLUGS = [
    "matsyavathara-dinam", "parashurama-jayanti", "narasimha-jayanti",
    "kurma-jayanti", "kurmavathara-dinam", "kalki-jayanti",
    "varaha-jayanti", "balarama-jayanti", "vamana-jayanti",
]
DATES = [
    "8 April 2027", "8 May 2027", "18 May 2027",
    "19-20 May 2027 by reviewed location", "19 May 2027 Malayalam reference",
    "7 August 2027", "3 September 2027", "6 September 2027", "12 September 2027",
]
IDS = [f"{slug}-avatar-remembrance-household-participant-2027-v1" for slug in SLUGS]


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def pack(slug):
    return load(LANE / "packs" / f"{slug}-avatar-remembrance-household-participant-2027-v1.json")


def refs(value):
    if isinstance(value, dict):
        for key, child in value.items():
            if key in {"source_ids", "resolution_source_ids"}:
                yield from child
            yield from refs(child)
    elif isinstance(value, list):
        for child in value:
            yield from refs(child)


def test_exact_9_schema_utf8_source_closure_and_bilingual_completion():
    schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    for slug, lane, date in zip(SLUGS, IDS, DATES):
        raw = (LANE / "packs" / f"{lane}.json").read_bytes()
        text = raw.decode("utf-8", "strict")
        assert b"\xef\xbf\xbd" not in raw
        item = json.loads(text)
        Draft202012Validator(schema).validate(item)
        assert item["lane_id"] == lane and item["observance_slugs"] == [slug]
        assert {entry["language_code"] for entry in item["localized_content"]} == {"en", "hi"}
        assert set(refs(item)) <= {source["source_id"] for source in item["sources"]}
        assert date in item["calendar"]["freshness_note"]
        assert "Recompute" in item["calendar"]["freshness_note"]
        assert "Never copy" in item["calendar"]["freshness_note"]
        assert all(item["product_status"]["completed_dimensions"].values())
        for localized in item["localized_content"]:
            assert len(localized["origin_narratives"]) == 2
            assert all(not narrative["universal_origin_claimed"] for narrative in localized["origin_narratives"])
            assert [procedure["tier"] for procedure in localized["procedures"]] == ["minimum", "standard", "elaborate"]


def test_family_specific_distinctions_and_story_limits():
    expected = {
        "matsyavathara-dinam": ["malayalam", "not matsya dwadashi"],
        "parashurama-jayanti": ["weapons are story", "caste domination"],
        "narasimha-jayanti": ["prahlada", "full named narratives"],
        "kurma-jayanti": ["19-20 may", "city/day conflict"],
        "kurmavathara-dinam": ["malayalam", "not silently collapsed"],
        "kalki-jayanti": ["future-avatar", "no apocalypse prediction"],
        "varaha-jayanti": ["earth rescue", "animal form"],
        "balarama-jayanti": ["dashavatara list differs", "6 september"],
        "vamana-jayanti": ["not vamana dwadashi", "12 september"],
    }
    for slug, terms in expected.items():
        whole = json.dumps(pack(slug), ensure_ascii=False).lower()
        assert all(term in whole for term in terms), (slug, [term for term in terms if term not in whole])


def test_rejects_universalization_predictions_and_harmful_instruction():
    forbidden = [
        "all hindus must", "every indian must", "you must fast", "guarantees liberation",
        "guarantees rescue", "take up a weapon", "caste domination is required",
        "the apocalypse will occur", "this gita passage founded the observance",
    ]
    for slug in SLUGS:
        whole = json.dumps(pack(slug), ensure_ascii=False).lower()
        assert all(term not in whole for term in forbidden), slug


def test_links_progress_matrix_and_unprojected_boundary():
    links = load(LANE / "cross-links" / "named-avatar-remembrance-batch-9-owner-proposals-v1.json")
    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    Draft202012Validator(link_schema).validate(links)
    assert len(links["proposals"]) == 9
    assert all(proposal["target_resolution"] == "unresolved_owner_lane" for proposal in links["proposals"])
    progress = load(LANE / "inventory" / "ritual-calendar-authoring-progress-v1.json")
    assert progress["completed_after_freeze"] == 170
    assert progress["remaining_authoring_items"] == 38
    for lane in IDS:
        assert progress["completed_lane_ids"].count(lane) == 1
        ref = f"knowledge_packs/library_lanes/ritual-calendar/packs/{lane}.json"
        assert progress["completed_pack_refs"].count(ref) == 1
    matrix = (LANE / "research" / "named-avatar-remembrance-batch-9-evidence-matrix-2027-v1.md").read_text(encoding="utf-8")
    for term in ("nine accepted named answers", "Major variants only", "0 of 19,480"):
        assert term in matrix

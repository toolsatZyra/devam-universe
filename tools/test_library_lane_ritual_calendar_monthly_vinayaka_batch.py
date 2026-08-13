"""Adversarial validation for four named monthly Vinayaka Chaturthi lanes."""
import json
from pathlib import Path

from jsonschema import Draft202012Validator

ROOT = Path(__file__).resolve().parents[1]
LANE = ROOT / "knowledge_packs" / "library_lanes" / "ritual-calendar"
SLUGS = ["vasudeva-chaturthi", "sankarshana-chaturthi", "pradyumna-chaturthi", "aniruddha-chaturthi"]
DATES = ["10 April 2027", "9 May 2027", "8 June 2027", "7 July 2027"]
IDS = [f"{slug}-monthly-vinayaka-household-participant-2027-v1" for slug in SLUGS]


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def pack(slug):
    return load(LANE / "packs" / f"{slug}-monthly-vinayaka-household-participant-2027-v1.json")


def refs(value):
    if isinstance(value, dict):
        for key, child in value.items():
            if key in {"source_ids", "resolution_source_ids"}:
                yield from child
            yield from refs(child)
    elif isinstance(value, list):
        for child in value:
            yield from refs(child)


def test_exact_four_schema_utf8_sources_timing_and_bilingual_completion():
    schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    for slug, lane_id, date in zip(SLUGS, IDS, DATES):
        path = LANE / "packs" / f"{lane_id}.json"
        raw = path.read_bytes()
        text = raw.decode("utf-8", "strict")
        assert b"\xef\xbf\xbd" not in raw
        assert sum(0x0900 <= ord(char) <= 0x097F for char in text) > 1000
        item = json.loads(text)
        Draft202012Validator(schema).validate(item)
        assert item["lane_id"] == lane_id and item["observance_slugs"] == [slug]
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
            assert all(not material["required"] and material["substitutions"] for procedure in localized["procedures"] for material in procedure["materials"])


def test_named_ganesha_identity_story_detail_and_major_differences():
    expected = {
        "vasudeva-chaturthi": ["chandrapriya", "shobhabhadra", "gold-coin donation", "caste enforcement"],
        "sankarshana-chaturthi": ["brahmapriya", "five wives", "sumukha", "conch-shell donation", "menstruation blame"],
        "pradyumna-chaturthi": ["kardama", "bharadwaja", "sexual-health", "fruit and root donation", "sexual assault"],
        "aniruddha-chaturthi": ["bhadrasena", "bakadalbhya", "rats", "gourd-vessel donation", "humane pest"],
    }
    for slug, terms in expected.items():
        whole = json.dumps(pack(slug), ensure_ascii=False).lower()
        assert "monthly ganesha/vinayaka route" in whole
        assert all(term in whole for term in terms), (slug, [term for term in terms if term not in whole])


def test_rejects_cure_compulsion_caste_harm_and_false_krishna_identity():
    forbidden = [
        "you must fast", "every hindu must", "all indians must", "fasting cures",
        "ritual cures diabetes", "omitted worship causes illness", "omitted worship causes pests",
        "menstruation causes death", "caste enforcement is required", "kill the animals",
        "guarantees prosperity", "guarantees liberation", "is krishna's son anniversary",
    ]
    for slug in SLUGS:
        whole = json.dumps(pack(slug), ensure_ascii=False).lower()
        assert all(term not in whole for term in forbidden), slug


def test_links_progress_matrix_and_unprojected_boundary():
    links = load(LANE / "cross-links" / "monthly-vinayaka-named-chaturthi-batch-4-owner-proposals-v1.json")
    Draft202012Validator(load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")).validate(links)
    assert len(links["proposals"]) == 4
    assert all(proposal["target_resolution"] == "unresolved_owner_lane" for proposal in links["proposals"])
    progress = load(LANE / "inventory" / "ritual-calendar-authoring-progress-v1.json")
    assert progress["completed_after_freeze"] == 183
    assert progress["remaining_authoring_items"] == 25
    for lane_id in IDS:
        assert progress["completed_lane_ids"].count(lane_id) == 1
        ref = f"knowledge_packs/library_lanes/ritual-calendar/packs/{lane_id}.json"
        assert progress["completed_pack_refs"].count(ref) == 1
    matrix = (LANE / "research" / "monthly-vinayaka-named-chaturthi-batch-4-evidence-matrix-2027-v1.md").read_text(encoding="utf-8")
    for term in ("Four accepted denominator items", "not silently reinterpreted", "0 of 19,480"):
        assert term in matrix

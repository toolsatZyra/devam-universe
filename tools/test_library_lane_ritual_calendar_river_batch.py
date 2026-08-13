"""Adversarial validation for four Ganga-Yamuna river-observance lanes."""
import json
from pathlib import Path

from jsonschema import Draft202012Validator

ROOT = Path(__file__).resolve().parents[1]
LANE = ROOT / "knowledge_packs" / "library_lanes" / "ritual-calendar"
SLUGS = ["ganga-dussehra", "ganga-puja", "ganga-saptami", "yamuna-chhath"]
DATES = ["13 June 2027", "13 June 2027", "12 May 2027", "12 April 2027"]
IDS = [f"{slug}-river-observance-household-participant-2027-v1" for slug in SLUGS]


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def pack(slug):
    return load(LANE / "packs" / f"{slug}-river-observance-household-participant-2027-v1.json")


def refs(value):
    if isinstance(value, dict):
        for key, child in value.items():
            if key in {"source_ids", "resolution_source_ids"}:
                yield from child
            yield from refs(child)
    elif isinstance(value, list):
        for child in value:
            yield from refs(child)


def test_exact_four_schema_utf8_source_closure_and_bilingual_completion():
    schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    for slug, lane_id, date in zip(SLUGS, IDS, DATES):
        raw = (LANE / "packs" / f"{lane_id}.json").read_bytes()
        text = raw.decode("utf-8", "strict")
        assert b"\xef\xbf\xbd" not in raw
        assert sum(0x0900 <= ord(char) <= 0x097F for char in text) > 1000
        item = json.loads(text)
        Draft202012Validator(schema).validate(item)
        assert item["lane_id"] == lane_id and item["observance_slugs"] == [slug]
        assert {entry["language_code"] for entry in item["localized_content"]} == {"en", "hi"}
        assert set(refs(item)) <= {source["source_id"] for source in item["sources"]}
        assert date in item["calendar"]["freshness_note"]
        assert "Recompute" in item["calendar"]["freshness_note"] and "Never copy" in item["calendar"]["freshness_note"]
        assert all(item["product_status"]["completed_dimensions"].values())
        for localized in item["localized_content"]:
            assert len(localized["origin_narratives"]) == 2
            assert all(not story["universal_origin_claimed"] for story in localized["origin_narratives"])
            assert [procedure["tier"] for procedure in localized["procedures"]] == ["minimum", "standard", "elaborate"]
            assert all(not material["required"] and material["substitutions"] for procedure in localized["procedures"] for material in procedure["materials"])


def test_material_route_distinctions_and_story_detail():
    expected = {
        "ganga-dussehra": ["gangavataran", "bhagiratha", "shiva", "jyeshtha shukla dashami"],
        "ganga-puja": ["bengali/assamese", "jyeshtha shukla dashami", "named community/temple route"],
        "ganga-saptami": ["jahnu", "jahnavi", "vaishakha shukla saptami"],
        "yamuna-chhath": ["braj", "mathura", "vishram ghat", "distinct from november surya chhath"],
    }
    for slug, terms in expected.items():
        whole = json.dumps(pack(slug), ensure_ascii=False).lower()
        assert all(term in whole for term in terms), (slug, [term for term in terms if term not in whole])


def test_rejects_unsafe_water_actions_pollution_and_result_promises():
    forbidden = [
        "you must enter the river", "drink river water", "immerse the flowers",
        "throw offerings", "every hindu must bathe", "guarantees purification",
        "guarantees merit", "erases wrongdoing", "children may enter alone",
        "ganga puja is identical everywhere", "yamuna chhath is surya chhath",
    ]
    for slug in SLUGS:
        whole = json.dumps(pack(slug), ensure_ascii=False).lower()
        assert all(term not in whole for term in forbidden), slug
        for required in ("no river entry", "water bodies", "112", "environmental"):
            assert required in whole, (slug, required)


def test_links_progress_matrix_and_unprojected_boundary():
    links = load(LANE / "cross-links" / "ganga-yamuna-river-observance-batch-4-owner-proposals-v1.json")
    Draft202012Validator(load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")).validate(links)
    assert len(links["proposals"]) == 4
    assert all(proposal["target_resolution"] == "unresolved_owner_lane" for proposal in links["proposals"])
    progress = load(LANE / "inventory" / "ritual-calendar-authoring-progress-v1.json")
    assert progress["completed_after_freeze"] == 176 and progress["remaining_authoring_items"] == 32
    for lane_id in IDS:
        assert progress["completed_lane_ids"].count(lane_id) == 1
        assert progress["completed_pack_refs"].count(f"knowledge_packs/library_lanes/ritual-calendar/packs/{lane_id}.json") == 1
    matrix = (LANE / "research" / "ganga-yamuna-river-observance-batch-4-evidence-matrix-2027-v1.md").read_text(encoding="utf-8")
    for term in ("Four accepted", "Bengali/Assamese", "0 of 19,480"):
        assert term in matrix

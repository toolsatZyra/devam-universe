"""Adversarial checks for eleven named Dwadashi applicability lanes."""

import json
from pathlib import Path
from jsonschema import Draft202012Validator

ROOT = Path(__file__).resolve().parents[1]
LANE = ROOT / "knowledge_packs" / "library_lanes" / "ritual-calendar"
ITEMS = {
    "kurma": ("Pausha Shukla Dwadashi", "19 January 2027"),
    "bhishma": ("Magha Shukla Dwadashi", "18 February 2027"),
    "narasimha": ("Phalguna Shukla Dwadashi", "19 March 2027"),
    "ramalakshmana": ("Jyeshtha Shukla Dwadashi", "15 June 2027"),
    "vasudeva": ("Ashadha Shukla Dwadashi", "14 July 2027"),
    "damodara": ("Shravana Shukla Dwadashi", "13 August 2027"),
    "kalki": ("Bhadrapada Shukla Dwadashi", "12 September 2027"),
    "padmanabha": ("Ashwina Shukla Dwadashi", "11 October 2027"),
    "yogeshwara": ("Kartika Shukla Dwadashi", "10 November 2027"),
    "matsya": ("Margashirsha Shukla Dwadashi", "10 December 2027"),
    "bachha-baras": ("Gujarati Shravana Vad Dwadashi", "28 August 2027"),
}
IDS = [f"{x}-dwadashi-{'gujarat-animal-safe-household' if x == 'bachha-baras' else 'telugu-calendar-household'}-2027-v1" for x in ITEMS]


def load(path): return json.loads(path.read_text(encoding="utf-8"))
def pack(lane_id): return load(LANE / "packs" / f"{lane_id}.json")


def refs(value):
    if isinstance(value, dict):
        for key, child in value.items():
            if key in {"source_ids", "resolution_source_ids"}: yield from child
            yield from refs(child)
    elif isinstance(value, list):
        for child in value: yield from refs(child)


def test_exact_denominator_schema_utf8_sources_and_contract_dimensions():
    assert len(IDS) == 11 and len(set(IDS)) == 11
    schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    for lane_id in IDS:
        raw = (LANE / "packs" / f"{lane_id}.json").read_bytes()
        text = raw.decode("utf-8", errors="strict"); assert "\ufffd" not in text
        item = json.loads(text); Draft202012Validator(schema).validate(item)
        assert item["lane_id"] == lane_id
        assert {x["language_code"] for x in item["localized_content"]} == {"en", "hi"}
        assert item["calendar"]["timing_kind"] == "mixed"
        assert item["calendar"]["location_aware"] and item["calendar"]["tradition_aware"]
        declared = {x["source_id"] for x in item["sources"]}
        assert set(refs(item)) <= declared
        for lc in item["localized_content"]:
            assert len(lc["origin_narratives"]) == 2
            assert all(not x["universal_origin_claimed"] for x in lc["origin_narratives"])
            assert [x["tier"] for x in lc["procedures"]] == ["minimum", "standard", "elaborate"]
            assert all(not m["required"] and m["substitutions"] for p in lc["procedures"] for m in p["materials"])
            assert len([x for x in lc["variants"] if not x["separate_lane_required"]]) == 1


def test_dates_are_fixtures_and_no_universal_or_unsafe_template():
    forbidden = ["every hindu must", "all indians must", "you must fast", "fasting is required", "must recite", "this observance guarantees cure", "this observance guarantees protection", "living person is evil", "donation is mandatory"]
    for slug,(lunar,date) in ITEMS.items():
        item = pack(f"{slug}-dwadashi-{'gujarat-animal-safe-household' if slug == 'bachha-baras' else 'telugu-calendar-household'}-2027-v1")
        whole = json.dumps(item, ensure_ascii=False).lower()
        assert lunar.lower() in whole and date.lower() in whole
        assert "recompute" in whole and "never copy" in whole
        assert "no fast" in whole and "112" in whole
        assert all(x not in whole for x in forbidden)


def test_vishnu_story_is_bounded_and_bachha_is_animal_safe():
    for lane_id in IDS[:-1]:
        whole = json.dumps(pack(lane_id), ensure_ascii=False).lower()
        for term in ("bhagavad gita 4.4-8", "arjuna", "vivasvan", "dharma declines", "not say this dwadashi began there", "no person is a demon"):
            assert term in whole, (lane_id, term)
    bachha = json.dumps(pack(IDS[-1]), ensure_ascii=False).lower()
    for term in ("nandini", "cow with her calf", "no live animal", "responsible keeper", "unknown, distressed, tethered or feeding"):
        assert term in bachha
    assert "iitk-gita" not in bachha


def test_crosslinks_progress_matrix_and_unprojected_boundary():
    links = load(LANE / "cross-links" / "named-dwadashi-batch-11-owner-and-story-proposals-v1.json")
    schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    Draft202012Validator(schema).validate(links)
    assert len(links["proposals"]) == 22
    assert len({x["proposal_id"] for x in links["proposals"]}) == 22
    assert all(x["target_resolution"] == "unresolved_owner_lane" for x in links["proposals"])
    p = load(LANE / "inventory" / "ritual-calendar-authoring-progress-v1.json")
    assert p["completed_after_freeze"] == 183 and p["remaining_authoring_items"] == 25
    assert p["completed_after_freeze"] + p["remaining_authoring_items"] == 208
    for lane_id in IDS:
        assert p["completed_lane_ids"].count(lane_id) == 1
        assert p["completed_pack_refs"].count(f"knowledge_packs/library_lanes/ritual-calendar/packs/{lane_id}.json") == 1
    matrix = (LANE / "research" / "named-dwadashi-batch-11-evidence-matrix-2027-v1.md").read_text(encoding="utf-8")
    for term in ("ten Telugu-calendar", "Gujarati dark-half", "Major variants only", "does not count a lane as authored", "19,480"):
        assert term in matrix

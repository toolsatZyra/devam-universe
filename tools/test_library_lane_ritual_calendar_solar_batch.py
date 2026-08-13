"""Adversarial contract checks for the 29-item solar-ingress batch."""

from __future__ import annotations

import json
from pathlib import Path

from jsonschema import Draft202012Validator

ROOT = Path(__file__).resolve().parents[1]
LANE = ROOT / "knowledge_packs" / "library_lanes" / "ritual-calendar"
PROGRESS = LANE / "inventory" / "ritual-calendar-authoring-progress-v1.json"
RESEARCH = LANE / "research" / "solar-ingress-batch-29-evidence-matrix-2027-v1.md"
LINKS = LANE / "cross-links" / "solar-ingress-batch-29-owner-and-story-proposals-v1.json"

NORTH = ["dhanu", "karka", "kumbha", "meena", "mesha", "mithuna", "simha", "tula", "vrishabha", "vrishchika"]
MAL = ["chingam", "dhanu", "itavam", "karkatakam", "kumbham", "makaram", "meenam", "metam", "mithunam", "thulam", "vrischikam"]
ODIA = ["bichha", "brusha", "dakhinaya-karkata", "garbhana", "mahabisuba-pana", "raja", "singha", "uttarayana-makar"]
LANE_IDS = (
    [f"{x}-sankranti-north-west-shared-household-2027-v1" for x in NORTH]
    + [f"{x}-sankramam-kerala-malayalam-solar-household-2027-v1" for x in MAL]
    + [
        "bichha-sankranti-odisha-household-2027-v1",
        "brusha-sankranti-odisha-household-2027-v1",
        "dakhinaya-karkata-sankranti-odisha-household-2027-v1",
        "garbhana-sankranti-odisha-household-2027-v1",
        "mahabisuba-pana-sankranti-odisha-household-2027-v1",
        "raja-sankranti-odisha-family-community-participant-2027-v1",
        "singha-sankranti-odisha-household-2027-v1",
        "uttarayana-makar-sankranti-odisha-household-2027-v1",
    ]
)


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def pack(lane_id):
    return load(LANE / "packs" / f"{lane_id}.json")


def walk_source_ids(value):
    if isinstance(value, dict):
        for key, child in value.items():
            if key in {"source_ids", "resolution_source_ids"}:
                yield from child
            yield from walk_source_ids(child)
    elif isinstance(value, list):
        for child in value:
            yield from walk_source_ids(child)


def test_exact_29_denominator_schema_utf8_source_closure_and_bilingual_parity():
    assert len(LANE_IDS) == 29 and len(set(LANE_IDS)) == 29
    schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    for lane_id in LANE_IDS:
        path = LANE / "packs" / f"{lane_id}.json"
        raw = path.read_bytes(); text = raw.decode("utf-8", errors="strict")
        assert "\ufffd" not in text
        item = json.loads(text); Draft202012Validator(schema).validate(item)
        assert item["lane_id"] == lane_id
        assert {x["language_code"] for x in item["localized_content"]} == {"en", "hi"}
        assert all(len(x["origin_narratives"]) >= 2 for x in item["localized_content"])
        assert all(len(x["procedures"]) == 3 for x in item["localized_content"])
        assert all(x["variants"] for x in item["localized_content"])
        assert all(x["safety_and_boundaries"] for x in item["localized_content"])
        assert item["calendar"]["location_aware"] and item["calendar"]["tradition_aware"]
        assert item["product_status"]["classification"] == "user_complete_lane"
        declared = {x["source_id"] for x in item["sources"]}
        assert set(walk_source_ids(item)) <= declared


def test_no_portable_clock_national_puja_or_unsafe_generic_instruction():
    forbidden = [
        "every hindu must", "all indians must", "all states perform",
        "must stare at the sun", "look directly at the sun to receive", "you must fast",
        "bathe in a river", "donation is mandatory", "this ritual guarantees victory",
        "real person is ravana", "women are impure", "menstruation is impure",
    ]
    for lane_id in LANE_IDS:
        item = pack(lane_id)
        en = json.dumps(next(x for x in item["localized_content"] if x["language_code"] == "en"), ensure_ascii=False).lower()
        whole = json.dumps(item, ensure_ascii=False).lower()
        assert "recompute" in whole and "punya-kala" in whole
        assert "no material" in en or "material-free" in en
        assert "medicine" in en and "112" in en
        assert all(term not in en for term in forbidden), lane_id


def test_contexts_are_split_only_for_material_calendar_or_practice_differences():
    for lane_id in LANE_IDS[:10]:
        item = pack(lane_id)
        assert "north-india" in item["applicability"]["region_codes"]
    for lane_id in LANE_IDS[10:21]:
        item = pack(lane_id)
        assert item["applicability"]["region_codes"] == ["IN-KL"]
        assert "malayalam-solar" in item["applicability"]["tradition_codes"]
        en = json.dumps(item, ensure_ascii=False).lower()
        assert "no separate household action" in en or "material-free" in en
    for lane_id in LANE_IDS[21:]:
        assert pack(lane_id)["applicability"]["region_codes"] == ["IN-OD"]
    for lane_id in LANE_IDS:
        for lc in pack(lane_id)["localized_content"]:
            minor = [x for x in lc["variants"] if not x["separate_lane_required"]]
            assert len(minor) == 1


def test_pana_and_raja_preserve_material_living_practice_and_safety():
    pana = json.dumps(pack("mahabisuba-pana-sankranti-odisha-household-2027-v1"), ensure_ascii=False).lower()
    for term in ("fruit", "milk", "curd", "allergen", "potable water", "clean utensils", "no-consumption", "hanging-pot"):
        assert term in pana
    assert "otdc.odisha.gov.in" in pana

    raja = json.dumps(pack("raja-sankranti-odisha-family-community-participant-2027-v1"), ensure_ascii=False).lower()
    for term in ("pahili raja", "basi raja", "basumati puja", "agricultural", "swing", "menstruation", "trans", "impure", "consent"):
        assert term in raja
    assert "odishatourism.gov.in" in raja and "utsav.gov.in" in raja
    assert "everyone must menstruate" not in raja and "women are impure" not in raja


def test_links_progress_research_and_unprojected_status_reconcile():
    schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    links = load(LINKS); Draft202012Validator(schema).validate(links)
    assert len(links["proposals"]) == 58
    assert len({x["proposal_id"] for x in links["proposals"]}) == 58
    assert all(x["target_resolution"] == "unresolved_owner_lane" for x in links["proposals"])

    progress = load(PROGRESS)
    assert progress["accepted_authoring_denominator"] == 208
    assert progress["completed_after_freeze"] == 170
    assert progress["remaining_authoring_items"] == 38
    assert progress["completed_after_freeze"] + progress["remaining_authoring_items"] == 208
    for lane_id in LANE_IDS:
        assert progress["completed_lane_ids"].count(lane_id) == 1
        assert progress["completed_pack_refs"].count(f"knowledge_packs/library_lanes/ritual-calendar/packs/{lane_id}.json") == 1

    research = RESEARCH.read_bytes().decode("utf-8", errors="strict")
    for term in ("10 North/shared + 11 Malayalam + 8 Odia", "Calendar identity does not by itself establish a puja", "Major variants only", "does not count a lane as authored", "19,480"):
        assert term in research

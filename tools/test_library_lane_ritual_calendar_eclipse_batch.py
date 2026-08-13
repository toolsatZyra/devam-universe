"""Adversarial validation for three location-routed eclipse observance lanes."""
import json
from pathlib import Path

from jsonschema import Draft202012Validator

ROOT = Path(__file__).resolve().parents[1]
LANE = ROOT / "knowledge_packs" / "library_lanes" / "ritual-calendar"
EVENTS = {
    "chandra-grahan-upachchaya": "chandra-grahan-upachchaya-eclipse-observance-household-2027-v1",
    "surya-grahan-purna": "surya-grahan-purna-eclipse-observance-household-participant-2027-v1",
    "surya-grahan-valayakara": "surya-grahan-valayakara-eclipse-observance-household-participant-2027-v1",
}


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def pack(slug):
    return load(LANE / "packs" / f"{EVENTS[slug]}.json")


def refs(value):
    if isinstance(value, dict):
        for key, child in value.items():
            if key in {"source_ids", "resolution_source_ids"}:
                yield from child
            yield from refs(child)
    elif isinstance(value, list):
        for child in value:
            yield from refs(child)


def test_exact_three_schema_utf8_source_closure_and_full_bilingual_contract():
    schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    for slug, lane_id in EVENTS.items():
        path = LANE / "packs" / f"{lane_id}.json"
        raw = path.read_bytes()
        text = raw.decode("utf-8", "strict")
        assert b"\xef\xbf\xbd" not in raw
        assert sum(0x0900 <= ord(char) <= 0x097F for char in text) > 900
        item = json.loads(text)
        Draft202012Validator(schema).validate(item)
        assert item["lane_id"] == lane_id and item["observance_slugs"] == [slug]
        assert {entry["language_code"] for entry in item["localized_content"]} == {"en", "hi"}
        assert set(refs(item)) <= {source["source_id"] for source in item["sources"]}
        assert all(item["product_status"]["completed_dimensions"].values())
        for localized in item["localized_content"]:
            assert len(localized["origin_narratives"]) == 2
            assert all(not story["universal_origin_claimed"] for story in localized["origin_narratives"])
            assert [procedure["tier"] for procedure in localized["procedures"]] == ["minimum", "standard", "elaborate"]
            assert all(not material["required"] and material["substitutions"] for procedure in localized["procedures"] for material in procedure["materials"])


def test_astronomy_story_and_local_visibility_are_not_conflated():
    lunar = json.dumps(pack("chandra-grahan-upachchaya"), ensure_ascii=False).lower()
    total = json.dumps(pack("surya-grahan-purna"), ensure_ascii=False).lower()
    annular = json.dumps(pack("surya-grahan-valayakara"), ensure_ascii=False).lower()
    for whole in (lunar, total, annular):
        for term in ("rahu", "surya", "soma", "section xix", "not the physical mechanism"):
            assert term in whole
    assert all(term in lunar for term in ("penumbral", "no umbral phase", "sutak not applicable", "safe to view unaided"))
    assert all(term in total for term in ("globally total", "not india", "only a partial phase", "no totality exception"))
    assert all(term in annular for term in ("chile", "argentina", "not visible in india", "no indian visible-eclipse"))


def test_solar_safety_and_non_universal_practice_are_enforced():
    for slug in ("surya-grahan-purna", "surya-grahan-valayakara"):
        whole = json.dumps(pack(slug), ensure_ascii=False).lower()
        for required in ("iso 12312-2", "sunglasses", "binoculars", "pinhole", "do not observe the sun"):
            assert required in whole, (slug, required)
    forbidden = [
        "every hindu must", "pregnant women must", "discard all food",
        "look directly without", "sunglasses are safe", "india will see totality",
        "this guarantees merit", "this erases sin", "sutak always applies",
    ]
    for slug in EVENTS:
        whole = json.dumps(pack(slug), ensure_ascii=False).lower()
        assert all(term not in whole for term in forbidden), slug
        for required in ("medicine", "hydration", "pregnancy care", "112", "not universal"):
            assert required in whole, (slug, required)


def test_links_progress_matrix_and_unprojected_boundary():
    links = load(LANE / "cross-links" / "eclipse-observance-batch-3-owner-proposals-v1.json")
    Draft202012Validator(load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")).validate(links)
    assert len(links["proposals"]) == 3
    assert all(proposal["target_resolution"] == "unresolved_owner_lane" for proposal in links["proposals"])
    progress = load(LANE / "inventory" / "ritual-calendar-authoring-progress-v1.json")
    assert progress["completed_after_freeze"] == 183 and progress["remaining_authoring_items"] == 25
    for lane_id in EVENTS.values():
        assert progress["completed_lane_ids"].count(lane_id) == 1
        assert progress["completed_pack_refs"].count(f"knowledge_packs/library_lanes/ritual-calendar/packs/{lane_id}.json") == 1
    matrix = (LANE / "research" / "eclipse-observance-batch-3-evidence-matrix-2027-v1.md").read_text(encoding="utf-8")
    for term in ("exactly three", "global eclipse label", "India has no totality exception", "No source payload was copied"):
        assert term in matrix

import hashlib
import json
from pathlib import Path

from jsonschema import Draft202012Validator


ROOT = Path(__file__).resolve().parents[1]
LANE = ROOT / "knowledge_packs" / "library_lanes" / "ritual-calendar"
PACK = LANE / "packs" / "mahashivaratri-north-west-smarta-household-2027-v1.json"
INVENTORY = LANE / "inventory" / "ritual-calendar-selected-scope-v1.json"
ALL_YEAR_SEED = LANE / "inventory" / "ritual-calendar-selected-scope-v2.json"
COMPREHENSIVE_CENSUS = (
    LANE / "inventory" / "ritual-calendar-comprehensive-census-v3.json"
)
LINKS = LANE / "cross-links" / "mahashivaratri-cross-lane-proposals-v1.json"


def load(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def test_frozen_denominator_is_exact_and_nonduplicative():
    inventory = load(INVENTORY)
    calendar = inventory["resolved_calendar_slugs"]
    ritual_only = inventory["ritual_only_slugs"]
    assert len(calendar) == len(set(calendar)) == 79
    assert len(ritual_only) == len(set(ritual_only)) == 25
    assert set(calendar).isdisjoint(ritual_only)
    assert inventory["selected_item_count"] == 105
    assert len(inventory["expansion_items"]) == 1
    assert inventory["baseline_audit"]["audit_sha256"] == "544c69218f3baf74a8858e21e34cc4928ed0d4d367da4ddd9067f66624d365dc"
    hero_owned = {
        slug
        for slugs in inventory["hero_owned_reuse_only"].values()
        for slug in slugs
    }
    assert hero_owned <= set(calendar + ritual_only)
    assert "mahashivaratri" not in set(calendar + ritual_only)


def test_pack_conforms_to_shared_ritual_schema():
    schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    Draft202012Validator(schema).validate(load(PACK))


def test_comprehensive_census_has_exact_geography_day_and_setting_denominators():
    census = load(COMPREHENSIVE_CENSUS)
    assert census["contract"] == "DEVAM_RITUAL_CALENDAR_COMPREHENSIVE_CENSUS_V3"
    assert census["selected_date_window"] == {
        "start": "2026-09-01",
        "end": "2027-12-31",
        "civil_days": 487,
        "note": (
            "Retains the completed September-December 2026 starting layer and "
            "adds a full 2027 discovery/audit year."
        ),
    }
    state_codes = [route["code"] for route in census["selected_state_routes"]]
    assert len(state_codes) == len(set(state_codes)) == 20
    assert census["selected_settings"] == ["household", "temple_participation"]
    assert census["day_answer_denominator"]["cells"] == 487 * 20 * 2 == 19_480
    assert census["supersedes_as_completion_boundary"] == [
        "knowledge_packs/library_lanes/ritual-calendar/inventory/"
        "ritual-calendar-selected-scope-v2.json"
    ]
    assert load(ALL_YEAR_SEED)["selected_item_count"] == 132


def test_comprehensive_census_candidates_are_exact_and_auditable():
    census = load(COMPREHENSIVE_CENSUS)
    calendars = census["source_calendars"]
    calendar_ids = {calendar["calendar_system_id"] for calendar in calendars}
    assert len(calendars) == len(calendar_ids) == 10
    assert sum(calendar["event_occurrences"] for calendar in calendars) == 971
    assert census["source_label_occurrences"] == 971
    assert all("year=2027" in calendar["url"] for calendar in calendars)
    assert all("geoname-id=" in calendar["url"] for calendar in calendars)

    candidates = census["candidates"]
    labels = [candidate["source_label"] for candidate in candidates]
    assert len(labels) == len(set(labels)) == census["unique_source_label_count"] == 425
    assert labels == sorted(labels)
    assert all(candidate["state"] == "undispositioned" for candidate in candidates)
    assert all(candidate["calendar_system_ids"] for candidate in candidates)
    assert all(
        set(candidate["calendar_system_ids"]) <= calendar_ids
        for candidate in candidates
    )


def test_major_difference_rule_prevents_state_copy_proliferation():
    census = load(COMPREHENSIVE_CENSUS)
    rule = census["material_variant_rule"]
    assert len(rule["separate_lane_when"]) == 6
    assert len(rule["note_within_lane_when"]) == 3
    assert "state copy solely because the state name differs" in rule["prohibition"]
    excluded = census["settings_boundary"]["excluded_from_diy"]
    assert "priest-led temple liturgy" in excluded
    assert "initiation-restricted practice" in excluded


def test_cross_link_pack_conforms_and_uses_canonical_anchor():
    schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    pack = load(LINKS)
    Draft202012Validator(schema).validate(pack)
    assert pack["proposals"][0]["to_ref"]["canonical_id"] == "devam:observance:mahashivaratri"
    assert pack["proposals"][0]["predicate"] not in {"related_to", "same_as", "is_form_of", "origin_of"}


def test_bilingual_contract_depth_and_step_evidence():
    pack = load(PACK)
    assert pack["product_status"]["classification"] == "user_complete_lane"
    assert all(pack["product_status"]["completed_dimensions"].values())
    assert pack["product_status"]["open_gaps"] == []
    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    source_ids = {source["source_id"] for source in pack["sources"]}
    assert len(source_ids) >= 7
    for language, entry in localized.items():
        assert len(entry["origin_narratives"]) >= 3
        assert all(not story["universal_origin_claimed"] for story in entry["origin_narratives"])
        assert len(entry["typical_practices"]) >= 3
        procedures = {procedure["tier"]: procedure for procedure in entry["procedures"]}
        assert set(procedures) == {"minimum", "standard", "elaborate"}
        assert procedures["standard"]["form"] == "traditional_household"
        assert procedures["elaborate"]["form"] == "institutional_participation"
        for procedure in procedures.values():
            ordinals = [step["ordinal"] for step in procedure["steps"]]
            assert ordinals == list(range(1, len(ordinals) + 1))
            assert all(step["source_ids"] for step in procedure["steps"])
            assert all(set(step["source_ids"]) <= source_ids for step in procedure["steps"])
            assert procedure["closing"]["source_ids"]
            for material in procedure["materials"]:
                assert "substitutions" in material
                assert set(material["source_ids"]) <= source_ids
        assert len(entry["variants"]) >= 4
        assert any(variant["separate_lane_required"] for variant in entry["variants"])
        safety = " ".join(entry["safety_and_boundaries"]).lower()
        if language == "en":
            for term in ("fast", "medication", "flame", "crowd", "sleep"):
                assert term in safety
        else:
            for term in ("उपवास", "दवा", "लौ", "भीड़", "नींद"):
                assert term in safety


def test_timing_is_local_and_live_programmes_expire():
    pack = load(PACK)
    calendar = pack["calendar"]
    assert calendar["location_aware"] is True
    assert calendar["tradition_aware"] is True
    assert calendar["live_schedule_required"] is True
    assert "Delhi" in calendar["freshness_note"]
    assert "another location" in calendar["freshness_note"]
    source = next(source for source in pack["sources"] if source["source_id"] == "sringeri-mahashivaratri-2026")
    assert source["citation_coordinates"]["reuse_as_2027_schedule"] is False


def test_no_large_payloads_and_utf8_hindi_is_real():
    assert PACK.stat().st_size < 100_000
    raw = PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "महाशिवरात्रि".encode() in raw
    assert hashlib.sha256(raw).hexdigest()


def test_lane_files_stay_inside_exclusive_paths():
    expected_roots = {
        (ROOT / "knowledge_packs" / "library_lanes" / "ritual-calendar").resolve(),
        (ROOT / "docs" / "library_lanes" / "ritual-calendar").resolve(),
    }
    for path in LANE.rglob("*"):
        if path.is_file():
            assert any(root == path.resolve() or root in path.resolve().parents for root in expected_roots)

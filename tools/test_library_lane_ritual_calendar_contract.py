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
RECURRING_DISPOSITION = (
    LANE
    / "inventory"
    / "ritual-calendar-candidate-disposition-recurring-v1.json"
)
SOLAR_DISPOSITION = (
    LANE / "inventory" / "ritual-calendar-candidate-disposition-solar-v1.json"
)
LUNAR_PHASE_DISPOSITION = (
    LANE
    / "inventory"
    / "ritual-calendar-candidate-disposition-lunar-phase-v1.json"
)
EKADASHI_DISPOSITION = (
    LANE / "inventory" / "ritual-calendar-candidate-disposition-ekadashi-v1.json"
)
HERO_OWNER_DISPOSITION = (
    LANE
    / "inventory"
    / "ritual-calendar-candidate-disposition-hero-owners-v1.json"
)
HERO_OWNER_SUPPLEMENTAL_DISPOSITION = (
    LANE
    / "inventory"
    / "ritual-calendar-candidate-disposition-hero-owners-supplemental-v1.json"
)
ANNUAL_ALIAS_DISPOSITION = (
    LANE
    / "inventory"
    / "ritual-calendar-candidate-disposition-annual-aliases-v1.json"
)
LINKS = LANE / "cross-links" / "mahashivaratri-cross-lane-proposals-v1.json"
SANKASHTI_LINKS = (
    LANE / "cross-links" / "sankashti-recurring-owner-proposals-v1.json"
)
SHAKAMBHARI_LINKS = (
    LANE / "cross-links" / "shakambhari-purnima-owner-proposal-v1.json"
)
HERO_OWNER_LINKS = [
    LANE / "cross-links" / "ganesha-owner-candidates-v1.json",
    LANE / "cross-links" / "devi-owner-candidates-v1.json",
    LANE / "cross-links" / "diwali-owner-candidates-v1.json",
]
HERO_OWNER_SUPPLEMENTAL_LINKS = [
    LANE / "cross-links" / "ganesha-owner-supplemental-v1.json",
    LANE / "cross-links" / "devi-owner-supplemental-v1.json",
    LANE / "cross-links" / "diwali-owner-supplemental-v1.json",
]


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


def test_recurring_candidate_disposition_is_exact_nonoverlapping_and_in_census():
    census = load(COMPREHENSIVE_CENSUS)
    batch = load(RECURRING_DISPOSITION)
    candidate_labels = {candidate["source_label"] for candidate in census["candidates"]}
    entries = batch["entries"]
    labels = [entry["source_label"] for entry in entries]
    assert len(labels) == len(set(labels)) == 43
    assert set(labels) <= candidate_labels
    assert batch["counts"] == {
        "source_labels_dispositioned": 43,
        "hero_owned_cross_link_only": 12,
        "alias_of_hero_owned_candidate": 24,
        "alias_of_accepted_lane": 7,
    }
    allowed = set(census["candidate_disposition_states"])
    assert all(entry["disposition"] in allowed for entry in entries)
    assert len(candidate_labels - set(labels)) == 382
    sankashti = [entry for entry in entries if "sankasht" in entry["source_label"].lower()]
    assert len(sankashti) == 36
    assert len({entry["canonical_candidate_id"] for entry in sankashti}) == 12
    pradosha = [entry for entry in entries if "Pradosh" in entry["source_label"]]
    assert len(pradosha) == 7
    assert {entry["canonical_candidate_id"] for entry in pradosha} == {
        "pradosha-recurring"
    }


def test_sankashti_owner_proposals_are_typed_and_unresolved_without_placeholders():
    schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    pack = load(SANKASHTI_LINKS)
    Draft202012Validator(schema).validate(pack)
    assert len(pack["proposals"]) == 12
    assert all(
        proposal["target_resolution"] == "unresolved_owner_lane"
        for proposal in pack["proposals"]
    )
    assert all(
        proposal["predicate"] == "requests_owner_scoped_recurring_instance"
        for proposal in pack["proposals"]
    )
    assert len(
        {proposal["to_ref"]["lane_local_id"] for proposal in pack["proposals"]}
    ) == 12


def test_solar_disposition_preserves_material_regional_timing_contexts():
    census = load(COMPREHENSIVE_CENSUS)
    recurring = load(RECURRING_DISPOSITION)
    solar = load(SOLAR_DISPOSITION)
    candidate_labels = {candidate["source_label"] for candidate in census["candidates"]}
    recurring_labels = {entry["source_label"] for entry in recurring["entries"]}
    entries = solar["entries"]
    labels = [entry["source_label"] for entry in entries]
    assert len(labels) == len(set(labels)) == 32
    assert set(labels) <= candidate_labels
    assert set(labels).isdisjoint(recurring_labels)
    assert len({entry["canonical_family_id"] for entry in entries}) == 12
    assert all(entry["disposition"] == "accepted_distinct_lane" for entry in entries)
    assert solar["counts"] == {
        "source_labels_dispositioned": 32,
        "accepted_distinct_lane": 32,
        "canonical_solar_families": 12,
    }
    by_label = {entry["source_label"]: entry for entry in entries}
    assert {
        by_label["Makara Sankranti"]["canonical_family_id"],
        by_label["Uttarayana Makar Sankranti"]["canonical_family_id"],
        by_label["Makaram Sankramam"]["canonical_family_id"],
    } == {"solar-ingress-makara"}
    assert by_label["Mahabisuba Pana Sankranti"][
        "required_applicability_context"
    ] == "odia_solar"
    assert by_label["Karkatakam Sankramam"][
        "required_applicability_context"
    ] == "malayalam_solar"
    assert len(candidate_labels - recurring_labels - set(labels)) == 350


def test_lunar_phase_disposition_preserves_overlays_scope_and_explicit_block():
    census = load(COMPREHENSIVE_CENSUS)
    prior_batches = [load(RECURRING_DISPOSITION), load(SOLAR_DISPOSITION)]
    prior_labels = {
        entry["source_label"]
        for batch in prior_batches
        for entry in batch["entries"]
    }
    lunar = load(LUNAR_PHASE_DISPOSITION)
    entries = lunar["entries"]
    labels = [entry["source_label"] for entry in entries]
    candidate_labels = {candidate["source_label"] for candidate in census["candidates"]}
    assert len(labels) == len(set(labels)) == 33
    assert set(labels) <= candidate_labels
    assert set(labels).isdisjoint(prior_labels)
    assert lunar["counts"] == {
        "source_labels_dispositioned": 33,
        "accepted_distinct_lane": 29,
        "alias_of_accepted_lane": 1,
        "outside_selected_sanatana_scope": 1,
        "hero_owned_cross_link_only": 1,
        "blocked_requires_authority_or_source": 1,
    }
    by_label = {entry["source_label"]: entry for entry in entries}
    assert by_label["Guru Poornima"]["canonical_candidate_id"] == "guru-purnima"
    assert by_label["Buddha Purnima"]["disposition"] == (
        "outside_selected_sanatana_scope"
    )
    assert by_label["Shakambhari Purnima"]["disposition"] == (
        "hero_owned_cross_link_only"
    )
    assert by_label["Jandhyala Purnima"]["disposition"] == (
        "blocked_requires_authority_or_source"
    )
    assert len(candidate_labels - prior_labels - set(labels)) == 317


def test_shakambhari_proposal_preserves_devi_ownership():
    schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    pack = load(SHAKAMBHARI_LINKS)
    Draft202012Validator(schema).validate(pack)
    assert len(pack["proposals"]) == 1
    proposal = pack["proposals"][0]
    assert proposal["to_ref"]["lane_local_id"] == (
        "devi-consumer/shakambhari-purnima"
    )
    assert proposal["target_resolution"] == "unresolved_owner_lane"
    assert proposal["predicate"] == "requests_owner_scoped_observance_lane"


def test_ekadashi_disposition_preserves_regional_aliases_and_date_variants():
    census = load(COMPREHENSIVE_CENSUS)
    prior_batches = [
        load(RECURRING_DISPOSITION),
        load(SOLAR_DISPOSITION),
        load(LUNAR_PHASE_DISPOSITION),
    ]
    prior_labels = {
        entry["source_label"]
        for batch in prior_batches
        for entry in batch["entries"]
    }
    ekadashi = load(EKADASHI_DISPOSITION)
    entries = ekadashi["entries"]
    labels = [entry["source_label"] for entry in entries]
    candidate_labels = {candidate["source_label"] for candidate in census["candidates"]}
    assert len(labels) == len(set(labels)) == 41
    assert set(labels) <= candidate_labels
    assert set(labels).isdisjoint(prior_labels)
    assert ekadashi["counts"] == {
        "source_labels_dispositioned": 41,
        "accepted_distinct_lane": 30,
        "alias_of_accepted_lane": 11,
        "ordinary_monthly_instances": 24,
        "gauna_or_vaishnava_variants": 6,
    }
    by_label = {entry["source_label"]: entry for entry in entries}
    assert by_label["Pankoddhar Ekadashi"]["canonical_candidate_id"] == (
        "ekadashi-vijaya"
    )
    assert by_label["Gomati Ekadashi"]["canonical_candidate_id"] == (
        "ekadashi-mokshada"
    )
    assert by_label["Vaishnava Rama Ekadashi"]["disposition"] == (
        "accepted_distinct_lane"
    )
    assert by_label["Gauna Kamika Ekadashi"][
        "required_applicability_context"
    ] == "gauna-date-variant"
    assert len(candidate_labels - prior_labels - set(labels)) == 276


def test_hero_owner_disposition_is_exact_and_all_batches_are_globally_disjoint():
    census = load(COMPREHENSIVE_CENSUS)
    batches = [
        load(RECURRING_DISPOSITION),
        load(SOLAR_DISPOSITION),
        load(LUNAR_PHASE_DISPOSITION),
        load(EKADASHI_DISPOSITION),
        load(HERO_OWNER_DISPOSITION),
        load(HERO_OWNER_SUPPLEMENTAL_DISPOSITION),
        load(ANNUAL_ALIAS_DISPOSITION),
    ]
    all_labels = [
        entry["source_label"]
        for batch in batches
        for entry in batch["entries"]
    ]
    candidate_labels = {candidate["source_label"] for candidate in census["candidates"]}
    assert len(all_labels) == len(set(all_labels)) == 292
    assert set(all_labels) <= candidate_labels
    assert len(candidate_labels - set(all_labels)) == 133

    owner = load(HERO_OWNER_DISPOSITION)
    assert owner["counts"] == {
        "source_labels_dispositioned": 54,
        "ganesha_consumer": 12,
        "devi_consumer": 23,
        "diwali_consumer": 19,
        "normalized_owner_targets": 45,
    }
    assert all(
        entry["disposition"] == "hero_owned_cross_link_only"
        for entry in owner["entries"]
    )


def test_clear_hero_owner_proposals_are_schema_valid_and_target_only_owner_lanes():
    schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    expected = {
        "ganesha-consumer": 12,
        "devi-consumer": 17,
        "diwali-consumer": 16,
    }
    total = 0
    for path in HERO_OWNER_LINKS:
        pack = load(path)
        Draft202012Validator(schema).validate(pack)
        proposals = pack["proposals"]
        total += len(proposals)
        target_owner = next(iter(expected))
        for owner in expected:
            if owner.split("-")[0] in path.name:
                target_owner = owner
                break
        assert len(proposals) == expected[target_owner]
        assert all(
            proposal["to_ref"]["lane_local_id"].startswith(target_owner + "/")
            for proposal in proposals
        )
        assert all(
            proposal["target_resolution"] == "unresolved_owner_lane"
            for proposal in proposals
        )
    assert total == 45


def test_supplemental_owner_routes_regional_names_without_claiming_vasant_panchami():
    census = load(COMPREHENSIVE_CENSUS)
    batch = load(HERO_OWNER_SUPPLEMENTAL_DISPOSITION)
    entries = batch["entries"]
    assert batch["counts"] == {
        "source_labels_dispositioned": 32,
        "ganesha_consumer": 2,
        "devi_consumer": 22,
        "diwali_consumer": 8,
        "normalized_owner_targets": 26,
    }
    labels = {entry["source_label"] for entry in entries}
    assert "Vasant Panchami" not in labels
    assert "Sri Panchami" in labels
    assert "Ayutha Poojai" in labels
    assert "Maha Sangada Hara Chathurti" in labels
    candidate_labels = {candidate["source_label"] for candidate in census["candidates"]}
    assert labels <= candidate_labels

    schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    expected = {"ganesha": 2, "devi": 17, "diwali": 6}
    total = 0
    for path in HERO_OWNER_SUPPLEMENTAL_LINKS:
        pack = load(path)
        Draft202012Validator(schema).validate(pack)
        owner_key = next(key for key in expected if path.name.startswith(key))
        assert len(pack["proposals"]) == expected[owner_key]
        total += len(pack["proposals"])
    assert total == 25


def test_annual_alias_batch_preserves_verified_material_date_differences():
    batch = load(ANNUAL_ALIAS_DISPOSITION)
    assert batch["counts"] == {
        "source_labels_dispositioned": 57,
        "accepted_distinct_lane": 22,
        "alias_of_accepted_lane": 35,
    }
    entries = batch["entries"]
    labels = [entry["source_label"] for entry in entries]
    assert len(labels) == len(set(labels)) == 57
    by_label = {entry["source_label"]: entry for entry in entries}
    assert by_label["Parashurama Dwadashi"]["canonical_candidate_id"] == (
        "parashurama-dwadashi"
    )
    assert by_label["Parashurama Dwadashi"]["disposition"] == (
        "accepted_distinct_lane"
    )
    assert by_label["Vamana Dwadashi"]["canonical_candidate_id"] == (
        "vamana-dwadashi"
    )
    assert by_label["Vamana Dwadashi"]["disposition"] == "accepted_distinct_lane"
    assert by_label["Hanuman Jayanthi *Tamil"]["canonical_candidate_id"] == (
        "hanuman-jayanthi-tamil"
    )
    assert by_label["Nagula Chavithi"]["canonical_candidate_id"] == (
        "nagula-chavithi"
    )
    assert by_label["Chhoti Holi"]["canonical_candidate_id"] == "holika-dahan"


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

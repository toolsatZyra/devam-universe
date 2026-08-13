import hashlib
import json
from pathlib import Path

from jsonschema import Draft202012Validator


ROOT = Path(__file__).resolve().parents[1]
LANE = ROOT / "knowledge_packs" / "library_lanes" / "ritual-calendar"
PACK = LANE / "packs" / "mahashivaratri-north-west-smarta-household-2027-v1.json"
MAKAR_PACK = (
    LANE / "packs" / "makar-sankranti-north-west-household-2027-v1.json"
)
PONGAL_PACK = (
    LANE / "packs" / "thai-pongal-tamil-household-participant-2027-v1.json"
)
BASANT_PACK = (
    LANE / "packs" / "basant-panchami-north-and-east-household-participant-2027-v1.json"
)
BASANT_OWNER_LINK = (
    LANE / "cross-links" / "basant-panchami-saraswati-owner-link-v1.json"
)
HOLIKA_PACK = (
    LANE / "packs" / "holika-dahan-north-india-household-participant-2027-v1.json"
)
HOLI_PACK = (
    LANE / "packs" / "holi-dhulandi-north-india-consent-led-household-2027-v1.json"
)
GUDI_PADWA_PACK = (
    LANE / "packs" / "gudi-padwa-maharashtra-household-2027-v1.json"
)
UGADI_YUGADI_PACK = (
    LANE
    / "packs"
    / "ugadi-yugadi-karnataka-andhra-telangana-household-2027-v1.json"
)
RAMA_NAVAMI_PACK = (
    LANE / "packs" / "ram-navami-north-india-household-participant-2027-v1.json"
)
RAMA_NAVAMI_LINKS = (
    LANE / "cross-links" / "ram-navami-epic-owner-links-v1.json"
)
HANUMAN_JAYANTI_PACK = (
    LANE
    / "packs"
    / "hanuman-jayanti-north-india-household-participant-2027-v1.json"
)
HANUMAN_JAYANTI_LINKS = (
    LANE / "cross-links" / "hanuman-jayanti-epic-owner-links-v1.json"
)
AKSHAYA_TRITIYA_PACK = (
    LANE / "packs" / "akshaya-tritiya-north-west-household-participant-2027-v1.json"
)
AKSHAYA_TRITIYA_LINK = (
    LANE / "cross-links" / "akshaya-tritiya-mahabharata-owner-link-v1.json"
)
VAT_SAVITRI_NORTH_PACK = (
    LANE
    / "packs"
    / "vat-savitri-north-amavasya-household-participant-2027-v1.json"
)
VAT_SAVITRI_LINKS = (
    LANE / "cross-links" / "vat-savitri-mahabharata-owner-links-v1.json"
)
AUTHORING_PROGRESS = (
    LANE / "inventory" / "ritual-calendar-authoring-progress-v1.json"
)
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
FINAL_DISPOSITION = (
    LANE / "inventory" / "ritual-calendar-candidate-disposition-final-v1.json"
)
NORMALIZED_DENOMINATOR = (
    LANE / "inventory" / "ritual-calendar-normalized-denominator-v4.json"
)
LINKS = LANE / "cross-links" / "mahashivaratri-cross-lane-proposals-v1.json"
SANKASHTI_LINKS = (
    LANE / "cross-links" / "sankashti-recurring-owner-proposals-v1.json"
)
SHAKAMBHARI_LINKS = (
    LANE / "cross-links" / "shakambhari-purnima-owner-proposal-v1.json"
)
BANADA_LINKS = LANE / "cross-links" / "banada-ashtami-owner-proposal-v1.json"
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
        load(FINAL_DISPOSITION),
    ]
    all_labels = [
        entry["source_label"]
        for batch in batches
        for entry in batch["entries"]
    ]
    candidate_labels = {candidate["source_label"] for candidate in census["candidates"]}
    assert len(all_labels) == len(set(all_labels)) == 425
    assert set(all_labels) <= candidate_labels
    assert candidate_labels == set(all_labels)

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


def test_final_disposition_closes_raw_census_without_claiming_authoring_complete():
    final = load(FINAL_DISPOSITION)
    assert final["counts"] == {
        "source_labels_dispositioned": 133,
        "accepted_distinct_lane": 95,
        "alias_of_accepted_lane": 25,
        "blocked_requires_authority_or_source": 5,
        "hero_owned_cross_link_only": 4,
        "descriptive_calendar_event_not_puja_or_observance": 3,
        "outside_selected_sanatana_scope": 1,
    }
    by_label = {entry["source_label"]: entry for entry in final["entries"]}
    for label in (
        "Avani Avittam",
        "Avani Avittam *Rigveda",
        "Avani Avittam *Samaveda",
        "Avani Avittam *Yajurveda",
        "Gayathri Japam",
    ):
        assert by_label[label]["disposition"] == (
            "blocked_requires_authority_or_source"
        )
    assert by_label["Solar New Year"]["disposition"] == (
        "descriptive_calendar_event_not_puja_or_observance"
    )
    assert by_label["Rabindranath Tagore Jayanti"]["disposition"] == (
        "outside_selected_sanatana_scope"
    )
    assert by_label["Balarama Jayanti"]["disposition"] == "accepted_distinct_lane"


def test_v4_normalized_denominator_and_all_owner_proposals_are_exact():
    denominator = load(NORMALIZED_DENOMINATOR)
    assert denominator["raw_census_audit"] == {
        "source_labels": 425,
        "dispositioned_source_labels": 425,
        "undispositioned_source_labels": 0,
        "state_counts": {
            "accepted_distinct_lane": 208,
            "alias_of_accepted_lane": 79,
            "hero_owned_cross_link_only": 103,
            "alias_of_hero_owned_candidate": 24,
            "blocked_requires_authority_or_source": 6,
            "descriptive_calendar_event_not_puja_or_observance": 3,
            "outside_selected_sanatana_scope": 2,
        },
    }
    assert denominator["normalized_named_work_items"] == {
        "selected_denominator": 403,
        "completed_starting_layer": 105,
        "incomplete_ritual_calendar_authoring": 208,
        "owner_targets_with_typed_proposals": 84,
        "blocked_with_concrete_authority_gap": 6,
    }
    assert 105 + 208 + 84 + 6 == 403
    assert denominator["day_answer_denominator"]["cells"] == 19_480
    assert denominator["day_answer_denominator"][
        "verified_complete_cells_at_freeze"
    ] == 0

    schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    owner_paths = (
        [SANKASHTI_LINKS, SHAKAMBHARI_LINKS, BANADA_LINKS]
        + HERO_OWNER_LINKS
        + HERO_OWNER_SUPPLEMENTAL_LINKS
    )
    proposal_count = 0
    for path in owner_paths:
        pack = load(path)
        Draft202012Validator(schema).validate(pack)
        proposal_count += len(pack["proposals"])
    assert proposal_count == 84


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


def test_makar_sankranti_pack_conforms_and_closes_all_source_references():
    schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    pack = load(MAKAR_PACK)
    Draft202012Validator(schema).validate(pack)
    assert pack["lane_id"] == "makar-sankranti-north-west-household-2027-v1"
    assert pack["product_status"]["classification"] == "user_complete_lane"
    assert all(pack["product_status"]["completed_dimensions"].values())
    assert pack["product_status"]["open_gaps"] == []

    source_ids = {source["source_id"] for source in pack["sources"]}
    assert len(source_ids) == len(pack["sources"]) >= 14

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    assert set(child) <= source_ids
                walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)


def test_makar_sankranti_is_bilingual_actionable_and_location_aware():
    pack = load(MAKAR_PACK)
    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    assert pack["calendar"]["location_aware"] is True
    assert pack["calendar"]["tradition_aware"] is True
    assert pack["calendar"]["live_schedule_required"] is True
    assert "15 January 2027" in pack["calendar"]["freshness_note"]
    assert "Recompute" in pack["calendar"]["freshness_note"]

    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 4
        assert all(
            narrative["universal_origin_claimed"] is False
            for narrative in entry["origin_narratives"]
        )
        procedures = {procedure["tier"]: procedure for procedure in entry["procedures"]}
        assert set(procedures) == {"minimum", "standard", "elaborate"}
        assert procedures["standard"]["form"] == "traditional_household"
        assert procedures["elaborate"]["form"] == "institutional_participation"
        for procedure in procedures.values():
            ordinals = [step["ordinal"] for step in procedure["steps"]]
            assert ordinals == list(range(1, len(ordinals) + 1))
            assert procedure["closing"]["text"]
            assert all("substitutions" in material for material in procedure["materials"])


def test_makar_major_difference_rule_does_not_clone_minor_state_customs():
    pack = load(MAKAR_PACK)
    for entry in pack["localized_content"]:
        variants = {variant["variant_id"]: variant for variant in entry["variants"]}
        assert variants["gujarat-uttarayan-kite"]["separate_lane_required"] is False
        assert variants["bihar-chhattisgarh-sesame-foods"]["separate_lane_required"] is False
        assert variants["madhya-pradesh-sidhi-river-fair"]["separate_lane_required"] is False
        for variant_id in (
            "punjab-haryana-maghi",
            "tamil-pongal",
            "assam-magh-bihu",
            "bengal-poush-sankranti",
            "odia-makar-observance",
            "priest-led-shraddha",
        ):
            assert variants[variant_id]["separate_lane_required"] is True


def test_makar_adversarial_safety_boundaries_are_explicit_in_both_languages():
    localized = {
        entry["language_code"]: " ".join(entry["safety_and_boundaries"]).lower()
        for entry in load(MAKAR_PACK)["localized_content"]
    }
    for term in (
        "insulin",
        "sesame",
        "directly at the sun",
        "authorised supervised",
        "synthetic",
        "power lines",
        "shraddha",
        "no donation",
    ):
        assert term in localized["en"]
    for term in (
        "इंसुलिन",
        "तिल एलर्जेन",
        "सूर्य को सीधे",
        "अधिकृत निगरानी",
        "सिंथेटिक",
        "बिजली तार",
        "श्राद्ध",
        "गारंटी नहीं",
    ):
        assert term in localized["hi"]

    raw = MAKAR_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "मकर संक्रांति".encode("utf-8") in raw
    assert MAKAR_PACK.stat().st_size < 100_000


def test_authoring_progress_reconciles_to_frozen_v4_denominator():
    denominator = load(NORMALIZED_DENOMINATOR)
    progress = load(AUTHORING_PROGRESS)
    assert progress["denominator_ref"].endswith(
        "ritual-calendar-normalized-denominator-v4.json"
    )
    assert progress["accepted_authoring_denominator"] == 208
    assert progress["completed_after_freeze"] == 10
    assert progress["remaining_authoring_items"] == 198
    assert progress["completed_after_freeze"] + progress["remaining_authoring_items"] == 208
    assert progress["completed_lane_ids"] == [
        "makar-sankranti-north-west-household-2027-v1",
        "thai-pongal-tamil-household-participant-2027-v1",
        "basant-panchami-north-and-east-household-participant-2027-v1",
        "holika-dahan-north-india-household-participant-2027-v1",
        "holi-dhulandi-north-india-consent-led-household-2027-v1",
        "gudi-padwa-maharashtra-household-2027-v1",
        "ugadi-yugadi-karnataka-andhra-telangana-household-2027-v1",
        "ram-navami-north-india-household-participant-2027-v1",
        "hanuman-jayanti-north-india-household-participant-2027-v1",
        "akshaya-tritiya-north-west-household-participant-2027-v1",
    ]
    assert denominator["day_answer_denominator"]["verified_complete_cells_at_freeze"] == 0
    assert progress["verified_complete_day_cells"] == 0


def test_thai_pongal_pack_conforms_and_closes_all_source_references():
    schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    pack = load(PONGAL_PACK)
    Draft202012Validator(schema).validate(pack)
    assert pack["observance_slugs"] == [
        "bhogi-tamil",
        "thai-pongal",
        "mattu-pongal",
        "kaanum-pongal",
    ]
    assert pack["product_status"]["classification"] == "user_complete_lane"
    assert all(pack["product_status"]["completed_dimensions"].values())
    assert pack["product_status"]["open_gaps"] == []
    source_ids = {source["source_id"] for source in pack["sources"]}
    assert len(source_ids) == len(pack["sources"]) >= 12

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    assert set(child) <= source_ids
                walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)


def test_thai_pongal_is_bilingual_four_day_and_actionable():
    pack = load(PONGAL_PACK)
    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    for entry in localized.values():
        assert [day["ordinal"] for day in entry["daily_sequence"]] == [1, 2, 3, 4]
        assert len(entry["origin_narratives"]) >= 3
        assert all(not story["universal_origin_claimed"] for story in entry["origin_narratives"])
        procedures = {procedure["tier"]: procedure for procedure in entry["procedures"]}
        assert set(procedures) == {"minimum", "standard", "elaborate"}
        assert procedures["standard"]["form"] == "traditional_household"
        assert procedures["elaborate"]["form"] == "institutional_participation"
        for procedure in procedures.values():
            ordinals = [step["ordinal"] for step in procedure["steps"]]
            assert ordinals == list(range(1, len(ordinals) + 1))
            assert procedure["closing"]["text"]
            assert all("substitutions" in material for material in procedure["materials"])


def test_thai_pongal_preserves_only_material_variants_as_separate():
    for entry in load(PONGAL_PACK)["localized_content"]:
        variants = {variant["variant_id"]: variant for variant in entry["variants"]}
        for variant_id in (
            "apartment-or-urban-household",
            "sweet-or-savoury-pongal",
            "farming-household-mattu",
            "temple-or-public-pongal",
        ):
            assert variants[variant_id]["separate_lane_required"] is False
        for variant_id in (
            "andhra-telangana-sankranti-sequence",
            "jallikattu-or-regulated-animal-event",
            "family-specific-kolam-prayer-and-offering",
        ):
            assert variants[variant_id]["separate_lane_required"] is True


def test_thai_pongal_adversarial_safety_and_calendar_boundaries():
    pack = load(PONGAL_PACK)
    calendar = pack["calendar"]
    assert calendar["location_aware"] is True
    assert calendar["tradition_aware"] is True
    assert calendar["live_schedule_required"] is True
    for date in ("14 January", "15 January", "16 January", "17 January"):
        assert date in calendar["freshness_note"]

    localized = {
        entry["language_code"]: " ".join(entry["safety_and_boundaries"]).lower()
        for entry in pack["localized_content"]
    }
    for term in (
        "tyres",
        "severe burns",
        "unpasteurised milk",
        "allergens",
        "directly at the sun",
        "unfamiliar cattle",
        "jallikattu",
        "live facts",
        "is not promised",
    ):
        assert term in localized["en"]
    for term in (
        "टायर",
        "गंभीर जलन",
        "अपाश्चुरीकृत दूध",
        "एलर्जेन",
        "सूर्य को सीधे",
        "अपरिचित पशु",
        "जल्लीकट्टू",
        "जीवित तथ्य",
        "गारंटी नहीं",
    ):
        assert term in localized["hi"]

    raw = PONGAL_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "थाई पोंगल".encode("utf-8") in raw
    assert PONGAL_PACK.stat().st_size < 100_000


def test_basant_pack_conforms_and_closes_all_source_references():
    schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    pack = load(BASANT_PACK)
    Draft202012Validator(schema).validate(pack)
    assert pack["observance_slugs"] == ["vasant-panchami"]
    assert pack["product_status"]["classification"] == "user_complete_lane"
    assert all(pack["product_status"]["completed_dimensions"].values())
    assert pack["product_status"]["open_gaps"] == []
    source_ids = {source["source_id"] for source in pack["sources"]}
    assert len(source_ids) == len(pack["sources"]) >= 12

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    assert set(child) <= source_ids
                walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)


def test_basant_is_bilingual_actionable_and_owner_bounded():
    pack = load(BASANT_PACK)
    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    assert pack["applicability"]["region_codes"] == [
        "IN-DL",
        "north-india",
        "IN-BR",
        "IN-WB",
    ]
    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 3
        assert all(not story["universal_origin_claimed"] for story in entry["origin_narratives"])
        procedures = {procedure["tier"]: procedure for procedure in entry["procedures"]}
        assert set(procedures) == {"minimum", "standard", "elaborate"}
        assert procedures["standard"]["form"] == "traditional_household"
        assert procedures["elaborate"]["form"] == "institutional_participation"
        for procedure in procedures.values():
            ordinals = [step["ordinal"] for step in procedure["steps"]]
            assert ordinals == list(range(1, len(ordinals) + 1))
            assert procedure["closing"]["text"]
            assert all("substitutions" in material for material in procedure["materials"])

    schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    link = load(BASANT_OWNER_LINK)
    Draft202012Validator(schema).validate(link)
    proposal = link["proposals"][0]
    assert proposal["to_ref"]["lane_local_id"] == (
        "devi-consumer/saraswati-puja-multi-context"
    )
    assert proposal["target_resolution"] == "unresolved_owner_lane"
    existing = load(LANE / "cross-links" / "devi-owner-candidates-v1.json")
    existing_targets = {
        item["to_ref"]["lane_local_id"] for item in existing["proposals"]
    }
    assert proposal["to_ref"]["lane_local_id"] in existing_targets


def test_basant_major_difference_and_adversarial_safety_boundaries():
    pack = load(BASANT_PACK)
    assert pack["calendar"]["location_aware"] is True
    assert pack["calendar"]["tradition_aware"] is True
    assert pack["calendar"]["live_schedule_required"] is True
    assert "11 February" in pack["calendar"]["freshness_note"]
    for entry in pack["localized_content"]:
        variants = {variant["variant_id"]: variant for variant in entry["variants"]}
        for variant_id in (
            "yellow-material-expression",
            "west-bengal-bihar-student-public-puja",
            "household-without-image-or-mantra",
        ):
            assert variants[variant_id]["separate_lane_required"] is False
        for variant_id in (
            "institution-led-idol-lifecycle",
            "child-vidyarambha-akshara-initiation",
            "navaratri-saraswati-puja",
            "other-basant-traditions",
        ):
            assert variants[variant_id]["separate_lane_required"] is True

    localized = {
        entry["language_code"]: " ".join(entry["safety_and_boundaries"]).lower()
        for entry in pack["localized_content"]
    }
    for term in (
        "electronics",
        "essential textbooks",
        "allergens",
        "children",
        "blocked passages",
        "immerse",
        "priest-led",
        "guarantees marks",
        "local/live",
    ):
        assert term in localized["en"]
    for term in (
        "इलेक्ट्रॉनिक्स",
        "जरूरी पाठ्यपुस्तक",
        "एलर्जी",
        "बच्चों",
        "बंद मार्ग",
        "विसर्जित",
        "पुरोहितीय",
        "अंक",
        "स्थानीय/जीवित",
    ):
        assert term in localized["hi"]

    raw = BASANT_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "बसंत पंचमी".encode("utf-8") in raw
    assert BASANT_PACK.stat().st_size < 100_000


def test_holika_pack_conforms_and_closes_all_source_references():
    schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    pack = load(HOLIKA_PACK)
    Draft202012Validator(schema).validate(pack)
    assert pack["observance_slugs"] == ["holika-dahan"]
    assert pack["product_status"]["classification"] == "user_complete_lane"
    assert all(pack["product_status"]["completed_dimensions"].values())
    assert pack["product_status"]["open_gaps"] == []
    source_ids = {source["source_id"] for source in pack["sources"]}
    assert len(source_ids) == len(pack["sources"]) >= 9

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    assert set(child) <= source_ids
                walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)


def test_holika_is_bilingual_actionable_and_keeps_story_sources_separate():
    pack = load(HOLIKA_PACK)
    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 3
        assert all(
            not story["universal_origin_claimed"]
            for story in entry["origin_narratives"]
        )
        procedures = {procedure["tier"]: procedure for procedure in entry["procedures"]}
        assert set(procedures) == {"minimum", "standard", "elaborate"}
        assert procedures["standard"]["form"] == "traditional_household"
        assert procedures["elaborate"]["form"] == "institutional_participation"
        for procedure in procedures.values():
            ordinals = [step["ordinal"] for step in procedure["steps"]]
            assert ordinals == list(range(1, len(ordinals) + 1))
            assert procedure["closing"]["text"]
            assert all("substitutions" in material for material in procedure["materials"])

    english_stories = " ".join(
        story["summary"] for story in localized["en"]["origin_narratives"]
    ).lower()
    assert "does not contain holika's fire episode" in english_stories
    assert "living festival story" in english_stories


def test_holika_major_difference_timing_and_adversarial_safety_boundaries():
    pack = load(HOLIKA_PACK)
    calendar = pack["calendar"]
    assert calendar["location_aware"] is True
    assert calendar["tradition_aware"] is True
    assert calendar["live_schedule_required"] is True
    assert "21 March" in calendar["freshness_note"]
    assert "Banaras" in calendar["freshness_note"]

    for entry in pack["localized_content"]:
        variants = {
            variant["variant_id"].removesuffix("-hi"): variant
            for variant in entry["variants"]
        }
        for variant_id in (
            "fire-free-home-versus-public-attendance",
            "family-material-or-prayer-choice",
        ):
            assert variants[variant_id]["separate_lane_required"] is False
        for variant_id in (
            "banaras-after-midnight-timing",
            "priest-or-organiser-fire-rite",
            "holi-dhulandi-colour-day",
            "dol-hola-lathmar",
            "other-regional-fire-tradition",
        ):
            assert variants[variant_id]["separate_lane_required"] is True

    localized = {
        entry["language_code"]: " ".join(entry["safety_and_boundaries"]).lower()
        for entry in pack["localized_content"]
    }
    for term in (
        "roof or balcony",
        "plastic",
        "children",
        "blocked",
        "aqi",
        "asthma",
        "breathlessness",
        "throw offerings",
        "does not guarantee",
        "does not contain",
        "local/live",
    ):
        assert term in localized["en"]
    for term in (
        "छत, बालकनी",
        "प्लास्टिक",
        "बच्चों",
        "बंद",
        "aqi",
        "अस्थमा",
        "सांस फूलना",
        "सामग्री न फेंकें",
        "गारंटी नहीं",
        "घटना नहीं है",
        "स्थानीय/जीवित",
    ):
        assert term in localized["hi"]

    raw = HOLIKA_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "होलिका दहन".encode("utf-8") in raw
    assert HOLIKA_PACK.stat().st_size < 100_000


def test_holi_pack_conforms_and_closes_all_source_references():
    schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    pack = load(HOLI_PACK)
    Draft202012Validator(schema).validate(pack)
    assert pack["observance_slugs"] == ["holi-colour-day"]
    assert pack["product_status"]["classification"] == "user_complete_lane"
    assert all(pack["product_status"]["completed_dimensions"].values())
    assert pack["product_status"]["open_gaps"] == []
    source_ids = {source["source_id"] for source in pack["sources"]}
    assert len(source_ids) == len(pack["sources"]) >= 11

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    assert set(child) <= source_ids
                walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)


def test_holi_is_bilingual_actionable_with_complete_no_colour_form():
    pack = load(HOLI_PACK)
    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 3
        assert len(entry["typical_practices"]) == 4
        assert all(not story["universal_origin_claimed"] for story in entry["origin_narratives"])
        procedures = {procedure["tier"]: procedure for procedure in entry["procedures"]}
        assert set(procedures) == {"minimum", "standard", "elaborate"}
        assert procedures["minimum"]["form"] == "accessible_short"
        assert procedures["standard"]["form"] == "traditional_household"
        assert procedures["elaborate"]["form"] == "institutional_participation"
        for procedure in procedures.values():
            ordinals = [step["ordinal"] for step in procedure["steps"]]
            assert ordinals == list(range(1, len(ordinals) + 1))
            assert procedure["closing"]["text"]
            assert all("substitutions" in material for material in procedure["materials"])

    assert "greeting-only holi" in localized["en"]["procedures"][0]["label"].lower()
    assert "केवल-अभिवादन होली" in localized["hi"]["procedures"][0]["label"]


def test_holi_consent_safety_timing_and_major_difference_boundaries():
    pack = load(HOLI_PACK)
    calendar = pack["calendar"]
    assert calendar["location_aware"] is True
    assert calendar["tradition_aware"] is True
    assert calendar["live_schedule_required"] is True
    assert "22 March" in calendar["freshness_note"]

    for entry in pack["localized_content"]:
        variants = {
            variant["variant_id"].removesuffix("-hi"): variant
            for variant in entry["variants"]
        }
        for variant_id in (
            "greeting-dry-or-limited-water",
            "natural-colour-food-music-choice",
            "north-colour-day-aliases",
        ):
            assert variants[variant_id]["separate_lane_required"] is False
        for variant_id in (
            "rang-panchami-later-day",
            "dol-hola-shigmo-yaoshang-lathmar",
            "temple-deity-colour-service",
            "intoxicant-preparation-or-service",
        ):
            assert variants[variant_id]["separate_lane_required"] is True

    localized = {
        entry["language_code"]: " ".join(entry["safety_and_boundaries"]).lower()
        for entry in pack["localized_content"]
    }
    for term in (
        "consent is not implied",
        "reversible",
        "separate choices",
        "no balloons",
        "does not mean hypoallergenic",
        "do not rub",
        "children",
        "never colour pets",
        "disclose allergens",
        "never hide bhang",
        "does not guarantee",
        "112",
    ):
        assert term in localized["en"]
    for term in (
        "सहमति निहित नहीं",
        "वापस ली जा सकती",
        "अलग चुनाव",
        "गुब्बारा",
        "एलर्जी-मुक्त नहीं",
        "आंख न रगड़ें",
        "बच्चे",
        "पालतू",
        "एलर्जेन",
        "भांग/शराब/नशा न छिपाएं",
        "गारंटी नहीं",
        "112",
    ):
        assert term in localized["hi"]

    raw = HOLI_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "होली / धुलंडी".encode("utf-8") in raw
    assert HOLI_PACK.stat().st_size < 100_000


def test_gudi_padwa_pack_conforms_and_closes_all_source_references():
    schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    pack = load(GUDI_PADWA_PACK)
    Draft202012Validator(schema).validate(pack)
    assert pack["observance_slugs"] == ["gudi-padwa"]
    assert pack["applicability"]["region_codes"] == ["IN-MH"]
    assert pack["product_status"]["classification"] == "user_complete_lane"
    assert all(pack["product_status"]["completed_dimensions"].values())
    assert pack["product_status"]["open_gaps"] == []
    source_ids = {source["source_id"] for source in pack["sources"]}
    assert len(source_ids) == len(pack["sources"]) >= 12

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    assert set(child) <= source_ids
                walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)


def test_gudi_padwa_is_bilingual_actionable_and_accessible_without_height():
    pack = load(GUDI_PADWA_PACK)
    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 4
        assert len(entry["typical_practices"]) == 4
        assert all(not story["universal_origin_claimed"] for story in entry["origin_narratives"])
        procedures = {procedure["tier"]: procedure for procedure in entry["procedures"]}
        assert set(procedures) == {"minimum", "standard", "elaborate"}
        assert procedures["minimum"]["form"] == "accessible_short"
        assert procedures["standard"]["form"] == "traditional_household"
        assert procedures["elaborate"]["form"] == "institutional_participation"
        for procedure in procedures.values():
            ordinals = [step["ordinal"] for step in procedure["steps"]]
            assert ordinals == list(range(1, len(ordinals) + 1))
            assert procedure["closing"]["text"]
            assert all("substitutions" in material for material in procedure["materials"])

    assert "material-light" in localized["en"]["procedures"][0]["label"].lower()
    standard_materials = " ".join(
        material["item"] + " " + " ".join(material["substitutions"])
        for material in localized["en"]["procedures"][1]["materials"]
    ).lower()
    assert "tabletop" in standard_materials


def test_gudi_padwa_major_difference_timing_and_adversarial_boundaries():
    pack = load(GUDI_PADWA_PACK)
    calendar = pack["calendar"]
    assert calendar["location_aware"] is True
    assert calendar["tradition_aware"] is True
    assert calendar["live_schedule_required"] is True
    assert "7 April" in calendar["freshness_note"]

    for entry in pack["localized_content"]:
        variants = {
            variant["variant_id"].removesuffix("-hi"): variant
            for variant in entry["variants"]
        }
        for variant_id in (
            "material-light-tabletop-or-raised",
            "cloth-flower-vessel-food",
            "neem-jaggery-optional",
            "apartment-housing-restriction",
        ):
            assert variants[variant_id]["separate_lane_required"] is False
        for variant_id in (
            "public-shobhayatra",
            "temple-priest-led-service",
            "ugadi-yugadi",
            "other-new-year-or-navaratri",
        ):
            assert variants[variant_id]["separate_lane_required"] is True

    localized = {
        entry["language_code"]: " ".join(entry["safety_and_boundaries"]).lower()
        for entry in pack["localized_content"]
    }
    for term in (
        "one hindu or indian new year",
        "overhead wires",
        "balcony/window",
        "tabletop form is complete",
        "secure or omit",
        "away from diya",
        "non-slip",
        "national flag",
        "neem-jaggery is optional",
        "allergens",
        "take the gudi down",
        "not verified history",
        "local/live",
    ):
        assert term in localized["en"]
    for term in (
        "एकमात्र हिंदू या भारतीय नववर्ष",
        "ऊपरी तार",
        "बालकनी/खिड़की",
        "मेज-रूप पूर्ण",
        "बंधा/हटा",
        "दीया",
        "गैर-फिसलन",
        "राष्ट्रीय ध्वज",
        "नीम-गुड़ वैकल्पिक",
        "एलर्जेन",
        "गुड़ी उतारें",
        "सत्यापित इतिहास",
        "स्थानीय/जीवित",
    ):
        assert term in localized["hi"]

    raw = GUDI_PADWA_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "गुड़ी पड़वा".encode("utf-8") in raw
    assert GUDI_PADWA_PACK.stat().st_size < 100_000


def test_ugadi_yugadi_pack_conforms_and_closes_all_source_references():
    schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    pack = load(UGADI_YUGADI_PACK)
    Draft202012Validator(schema).validate(pack)
    assert pack["observance_slugs"] == ["ugadi-yugadi"]
    assert pack["applicability"]["region_codes"] == ["IN-KA", "IN-AP", "IN-TG"]
    assert pack["product_status"]["classification"] == "user_complete_lane"
    assert all(pack["product_status"]["completed_dimensions"].values())
    assert pack["product_status"]["open_gaps"] == []
    source_ids = {source["source_id"] for source in pack["sources"]}
    assert len(source_ids) == len(pack["sources"]) >= 10

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    assert set(child) <= source_ids
                walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)


def test_ugadi_yugadi_is_bilingual_actionable_and_state_routed():
    pack = load(UGADI_YUGADI_PACK)
    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 4
        assert len(entry["typical_practices"]) == 4
        assert all(
            not story["universal_origin_claimed"]
            for story in entry["origin_narratives"]
        )
        procedures = {procedure["tier"]: procedure for procedure in entry["procedures"]}
        assert set(procedures) == {"minimum", "standard", "elaborate"}
        assert procedures["minimum"]["form"] == "accessible_short"
        assert procedures["standard"]["form"] == "traditional_household"
        assert procedures["elaborate"]["form"] == "institutional_participation"
        for procedure in procedures.values():
            ordinals = [step["ordinal"] for step in procedure["steps"]]
            assert ordinals == list(range(1, len(ordinals) + 1))
            assert procedure["closing"]["text"]
            assert all("substitutions" in material for material in procedure["materials"])

    english_standard = localized["en"]["procedures"][1]
    standard_text = " ".join(step["instruction"] for step in english_standard["steps"])
    assert "Karnataka may use trusted family Bevu Bella" in standard_text
    assert "Andhra Pradesh/Telangana may use trusted family Ugadi Pachadi" in standard_text
    assert "taste nothing" in standard_text


def test_ugadi_yugadi_major_difference_timing_and_adversarial_boundaries():
    pack = load(UGADI_YUGADI_PACK)
    calendar = pack["calendar"]
    assert calendar["location_aware"] is True
    assert calendar["tradition_aware"] is True
    assert calendar["live_schedule_required"] is True
    assert "7 April" in calendar["freshness_note"]

    for entry in pack["localized_content"]:
        variants = {
            variant["variant_id"].removesuffix("-hi"): variant
            for variant in entry["variants"]
        }
        for variant_id in (
            "karnataka-bevu-bella",
            "andhra-telangana-ugadi-pachadi",
            "minor-household-materials",
            "no-taste-accessible-form",
        ):
            assert variants[variant_id]["separate_lane_required"] is False
        for variant_id in (
            "temple-or-public-panchanga",
            "family-sampradaya-deity-puja",
            "gudi-padwa-or-other-new-year",
            "chaitra-navaratri",
        ):
            assert variants[variant_id]["separate_lane_required"] is True

    localized = {
        entry["language_code"]: " ".join(entry["safety_and_boundaries"]).lower()
        for entry in pack["localized_content"]
    }
    for term in (
        "one hindu or indian new year",
        "difference is major",
        "optional, not medicine",
        "unknown neem",
        "allergens",
        "balcony/window",
        "non-slip",
        "oil bath",
        "touching feet require consent",
        "not verified history",
        "annual forecasts",
        "institution-owned",
        "local/live",
    ):
        assert term in localized["en"]
    for term in (
        "एकमात्र हिंदू या भारतीय नववर्ष",
        "अंतर मुख्य है",
        "औषधि",
        "अज्ञात नीम",
        "एलर्जेन",
        "बालकनी/खिड़की",
        "गैर-फिसलन",
        "तेल-स्नान",
        "पैर छूना सहमति",
        "सत्यापित इतिहास",
        "वार्षिक फलादेश",
        "संस्था-स्वामित्व",
        "स्थानीय/जीवित",
    ):
        assert term in localized["hi"]

    raw = UGADI_YUGADI_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "उगादी / युगादी".encode("utf-8") in raw
    assert UGADI_YUGADI_PACK.stat().st_size < 100_000


def test_rama_navami_pack_and_epic_owner_links_are_schema_valid():
    ritual_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    pack = load(RAMA_NAVAMI_PACK)
    Draft202012Validator(ritual_schema).validate(pack)
    assert pack["observance_slugs"] == ["rama-navami"]
    assert pack["applicability"]["region_codes"] == [
        "north-india", "IN-UP", "IN-DL", "IN-BR", "IN-CG"
    ]
    assert pack["product_status"]["classification"] == "user_complete_lane"
    assert all(pack["product_status"]["completed_dimensions"].values())
    assert pack["product_status"]["open_gaps"] == []
    source_ids = {source["source_id"] for source in pack["sources"]}
    assert len(source_ids) == len(pack["sources"]) >= 12

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    assert set(child) <= source_ids
                walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)

    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    links = load(RAMA_NAVAMI_LINKS)
    Draft202012Validator(link_schema).validate(links)
    assert len(links["proposals"]) == 2
    assert {proposal["to_ref"]["canonical_id"] for proposal in links["proposals"]} == {
        "devam:source-expression:ramayana-dutt-consumer-v1",
        "devam:text:ramcharitmanas",
    }
    assert all(
        proposal["target_resolution"] == "existing_anchor"
        for proposal in links["proposals"]
    )


def test_rama_navami_is_bilingual_actionable_and_keeps_story_owner_boundary():
    pack = load(RAMA_NAVAMI_PACK)
    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 4
        assert len(entry["typical_practices"]) == 4
        assert all(
            not story["universal_origin_claimed"]
            for story in entry["origin_narratives"]
        )
        procedures = {procedure["tier"]: procedure for procedure in entry["procedures"]}
        assert set(procedures) == {"minimum", "standard", "elaborate"}
        assert procedures["minimum"]["form"] == "accessible_short"
        assert procedures["standard"]["form"] == "traditional_household"
        assert procedures["elaborate"]["form"] == "institutional_participation"
        for procedure in procedures.values():
            ordinals = [step["ordinal"] for step in procedure["steps"]]
            assert ordinals == list(range(1, len(ordinals) + 1))
            assert procedure["closing"]["text"]
            assert all("substitutions" in material for material in procedure["materials"])

    dutt = next(source for source in pack["sources"] if source["source_id"] == "dutt-ramayana-bala-18-birth")
    assert dutt["artifact_sha256"] == (
        "7d3b9e1613d60dfacea39f2564243e943cf38703eadb7245d92337b238082034"
    )
    assert dutt["citation_coordinates"]["section"] == "Bala Kanda XVIII"
    english_stories = " ".join(
        story["summary"] for story in localized["en"]["origin_narratives"]
    ).lower()
    assert "concise pointer" in english_stories
    assert "not the full story" in english_stories


def test_rama_navami_major_difference_timing_fasting_and_temple_boundaries():
    pack = load(RAMA_NAVAMI_PACK)
    calendar = pack["calendar"]
    assert calendar["location_aware"] is True
    assert calendar["tradition_aware"] is True
    assert calendar["live_schedule_required"] is True
    assert "15 April" in calendar["freshness_note"]
    assert "11:04–13:38" in calendar["freshness_note"]
    assert "never copy" in calendar["freshness_note"].lower()

    for entry in pack["localized_content"]:
        variants = {
            variant["variant_id"].removesuffix("-hi"): variant
            for variant in entry["variants"]
        }
        for variant_id in (
            "non-fasting-or-family-fast",
            "local-madhyahna-or-practical-time",
            "minor-household-materials",
            "image-book-or-material-light",
        ):
            assert variants[variant_id]["separate_lane_required"] is False
        for variant_id in (
            "temple-birth-service",
            "ayodhya-mela-or-procession",
            "chaitra-navaratri",
            "regional-kalyanam-or-other-institution",
            "full-rama-story-and-text",
        ):
            assert variants[variant_id]["separate_lane_required"] is True

    localized = {
        entry["language_code"]: " ".join(entry["safety_and_boundaries"]).lower()
        for entry in pack["localized_content"]
    }
    for term in (
        "not a universal national ritual",
        "full rama story",
        "fasting is optional",
        "insulin",
        "pregnancy",
        "eating-disorder history",
        "needed water or food",
        "allergens",
        "diya unattended",
        "not a national clock time",
        "institution-owned",
        "local/live",
        "sarayu",
        "do not promise merit",
    ):
        assert term in localized["en"]
    for term in (
        "सार्वभौम राष्ट्रीय अनुष्ठान नहीं",
        "पूर्ण राम-कथा",
        "उपवास वैकल्पिक",
        "इंसुलिन",
        "गर्भावस्था",
        "भोजन-विकार का इतिहास",
        "जरूरी जल/भोजन",
        "एलर्जेन",
        "दीया कभी अकेला",
        "राष्ट्रीय घड़ी नहीं",
        "संस्था-स्वामित्व",
        "स्थानीय/जीवित",
        "सरयू",
        "गारंटी न दें",
    ):
        assert term in localized["hi"]

    raw = RAMA_NAVAMI_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "राम नवमी".encode("utf-8") in raw
    assert RAMA_NAVAMI_PACK.stat().st_size < 100_000


def test_hanuman_jayanti_pack_and_owner_links_are_schema_valid():
    ritual_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    pack = load(HANUMAN_JAYANTI_PACK)
    Draft202012Validator(ritual_schema).validate(pack)
    assert pack["observance_slugs"] == ["hanuman-jayanti"]
    assert pack["product_status"]["classification"] == "user_complete_lane"
    assert all(pack["product_status"]["completed_dimensions"].values())
    assert pack["product_status"]["open_gaps"] == []
    source_ids = {source["source_id"] for source in pack["sources"]}
    assert len(source_ids) == len(pack["sources"]) >= 15

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    assert set(child) <= source_ids
                walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)
    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    links = load(HANUMAN_JAYANTI_LINKS)
    Draft202012Validator(link_schema).validate(links)
    assert len(links["proposals"]) == 2
    assert {proposal["to_ref"]["canonical_id"] for proposal in links["proposals"]} == {
        "devam:source-expression:ramayana-dutt-consumer-v1",
        "devam:text:hanuman-chalisa",
    }
    assert all(proposal["target_resolution"] == "existing_anchor" for proposal in links["proposals"])


def test_hanuman_jayanti_is_bilingual_actionable_and_source_bounded():
    pack = load(HANUMAN_JAYANTI_PACK)
    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 4
        assert len(entry["typical_practices"]) == 4
        assert all(not story["universal_origin_claimed"] for story in entry["origin_narratives"])
        procedures = {procedure["tier"]: procedure for procedure in entry["procedures"]}
        assert set(procedures) == {"minimum", "standard", "elaborate"}
        assert procedures["minimum"]["form"] == "accessible_short"
        assert procedures["standard"]["form"] == "traditional_household"
        assert procedures["elaborate"]["form"] == "institutional_participation"
        for procedure in procedures.values():
            ordinals = [step["ordinal"] for step in procedure["steps"]]
            assert ordinals == list(range(1, len(ordinals) + 1))
            assert procedure["closing"]["text"]
            assert all("substitutions" in material for material in procedure["materials"])

    dutt = next(source for source in pack["sources"] if source["source_id"] == "dutt-ramayana-uttara-40-hanuman")
    assert dutt["artifact_sha256"] == "076d03a68387f8ccd43b0cc211829f017ef120746d7b0f68a401f1c6fb4b221d"
    assert dutt["citation_coordinates"]["section"] == "Uttara Kanda XL"
    stories = " ".join(story["summary"] for story in localized["en"]["origin_narratives"]).lower()
    assert "concise source pointer" in stories
    assert "one textual account" in stories
    assert "left jaw breaks" in stories


def test_hanuman_jayanti_major_date_material_and_safety_boundaries():
    pack = load(HANUMAN_JAYANTI_PACK)
    calendar = pack["calendar"]
    assert calendar["location_aware"] is True
    assert calendar["tradition_aware"] is True
    assert calendar["live_schedule_required"] is True
    assert "20 April" in calendar["freshness_note"]
    assert "Tamil 27 December" in calendar["freshness_note"]
    assert "Kannada 11 December" in calendar["freshness_note"]
    assert "never copy" in calendar["freshness_note"]

    for entry in pack["localized_content"]:
        variants = {variant["variant_id"].removesuffix("-hi"): variant for variant in entry["variants"]}
        for variant_id in (
            "non-fasting-or-family-fast",
            "chalisa-bhajan-ramayana-or-silence",
            "flower-food-sindoor-oil-or-material-light",
            "minor-state-household-preferences",
        ):
            assert variants[variant_id]["separate_lane_required"] is False
        for variant_id in (
            "tamil-hanuman-jayanthi-date",
            "kannada-hanuman-jayanti-date",
            "kartika-named-institution-date",
            "multi-day-temple-liturgy-or-procession",
            "full-hanuman-story-and-chalisa-text",
        ):
            assert variants[variant_id]["separate_lane_required"] is True

    localized = {
        entry["language_code"]: " ".join(entry["safety_and_boundaries"]).lower()
        for entry in pack["localized_content"]
    }
    for term in (
        "not a universal national ritual",
        "full hanuman story",
        "fasting is optional",
        "insulin",
        "eating-disorder history",
        "never ingest sindoor",
        "documented lead risk",
        "real monkeys are wildlife",
        "do not feed",
        "allergens",
        "not a national clock/date",
        "institution-owned",
        "local/live",
        "do not promise strength",
    ):
        assert term in localized["en"]
    for term in (
        "सार्वभौम राष्ट्रीय अनुष्ठान",
        "पूर्ण हनुमान-कथा",
        "उपवास वैकल्पिक",
        "इंसुलिन",
        "भोजन-विकार का इतिहास",
        "कभी न निगलें",
        "सीसा-जोखिम",
        "वास्तविक बंदर वन्यजीव",
        "न खिलाएँ",
        "एलर्जेन",
        "राष्ट्रीय घड़ी/तिथि नहीं",
        "संस्था-स्वामित्व",
        "स्थानीय/जीवित",
        "गारंटी न दें",
    ):
        assert term in localized["hi"]

    raw = HANUMAN_JAYANTI_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "हनुमान जयंती".encode("utf-8") in raw
    assert HANUMAN_JAYANTI_PACK.stat().st_size < 100_000


def test_akshaya_tritiya_pack_and_mahabharata_link_are_schema_valid():
    ritual_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    pack = load(AKSHAYA_TRITIYA_PACK)
    Draft202012Validator(ritual_schema).validate(pack)
    assert pack["observance_slugs"] == ["akshaya-tritiya"]
    assert pack["product_status"]["classification"] == "user_complete_lane"
    assert all(pack["product_status"]["completed_dimensions"].values())
    assert pack["product_status"]["open_gaps"] == []
    source_ids = {source["source_id"] for source in pack["sources"]}
    assert len(source_ids) == len(pack["sources"]) >= 15

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    assert set(child) <= source_ids
                walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)
    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    links = load(AKSHAYA_TRITIYA_LINK)
    Draft202012Validator(link_schema).validate(links)
    assert len(links["proposals"]) == 1
    proposal = links["proposals"][0]
    assert proposal["to_ref"]["canonical_id"] == "devam:source-expression:mahabharata-ganguli-consumer-v1"
    assert proposal["target_resolution"] == "existing_anchor"


def test_akshaya_tritiya_is_bilingual_actionable_and_keeps_evidence_layers_separate():
    pack = load(AKSHAYA_TRITIYA_PACK)
    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 4
        assert len(entry["typical_practices"]) == 4
        assert all(not story["universal_origin_claimed"] for story in entry["origin_narratives"])
        procedures = {procedure["tier"]: procedure for procedure in entry["procedures"]}
        assert set(procedures) == {"minimum", "standard", "elaborate"}
        assert procedures["minimum"]["form"] == "accessible_short"
        assert procedures["standard"]["form"] == "traditional_household"
        assert procedures["elaborate"]["form"] == "institutional_participation"
        for procedure in procedures.values():
            ordinals = [step["ordinal"] for step in procedure["steps"]]
            assert ordinals == list(range(1, len(ordinals) + 1))
            assert procedure["closing"]["text"]
            assert all("substitutions" in material for material in procedure["materials"])

    dutt = next(source for source in pack["sources"] if source["source_id"] == "ganguli-mahabharata-vana-3-vessel")
    assert dutt["artifact_sha256"] == "246325dcb8966a13990ab66f38b1cab230724fe0b1ad135bd6fb12222baa4826"
    english = " ".join(story["summary"] for story in localized["en"]["origin_narratives"]).lower()
    assert "text does not name akshaya tritiya" in english
    assert "does not turn it into advice" in english
    assert "current festival association" in english


def test_akshaya_tritiya_major_difference_financial_legal_and_authority_boundaries():
    pack = load(AKSHAYA_TRITIYA_PACK)
    calendar = pack["calendar"]
    assert calendar["location_aware"] is True
    assert calendar["tradition_aware"] is True
    assert calendar["live_schedule_required"] is True
    assert "9 May" in calendar["freshness_note"]
    assert "never copy" in calendar["freshness_note"].lower()
    assert "not the ritual completion rule" in calendar["freshness_note"]

    for entry in pack["localized_content"]:
        variants = {variant["variant_id"].removesuffix("-hi"): variant for variant in entry["variants"]}
        for variant_id in (
            "no-purchase-or-adult-gold-purchase",
            "non-fasting-or-family-fast",
            "prayer-food-charity-or-material-light",
            "akha-teej-regional-name",
        ):
            assert variants[variant_id]["separate_lane_required"] is False
        for variant_id in (
            "adult-wedding-and-child-protection",
            "odisha-jagannath-akshaya-trutiya",
            "char-dham-portal-opening",
            "parashurama-jayanti",
            "jain-akshaya-tritiya",
            "tarpan-havan-or-priest-led-service",
            "full-mahabharata-story",
        ):
            assert variants[variant_id]["separate_lane_required"] is True

    boundaries = {entry["language_code"]: " ".join(entry["safety_and_boundaries"]).lower() for entry in pack["localized_content"]}
    for term in (
        "not a universal national ritual", "does not date", "not a household rule",
        "no purchase is required", "six-character huid", "do not promise prosperity",
        "recipient privacy", "fasting is optional", "eating-disorder history",
        "allergens", "child marriage is prohibited", "1098", "free consent",
        "not legal or financial advice", "local/live", "not a national clock interval",
    ):
        assert term in boundaries["en"]
    for term in (
        "सार्वभौम राष्ट्रीय अनुष्ठान", "तिथि नहीं देता", "गृह-नियम नहीं",
        "कोई खरीद आवश्यक नहीं", "छह-अक्षरी huid", "गारंटी न दें",
        "फोटो या प्रचार", "उपवास वैकल्पिक", "भोजन-विकार का इतिहास",
        "एलर्जेन", "बाल विवाह प्रतिबंधित", "1098", "स्वतंत्र सहमति",
        "कानूनी/वित्तीय सलाह नहीं", "स्थानीय/जीवित", "राष्ट्रीय घड़ी नहीं",
    ):
        assert term in boundaries["hi"]

    raw = AKSHAYA_TRITIYA_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "अक्षय तृतीया".encode("utf-8") in raw
    assert AKSHAYA_TRITIYA_PACK.stat().st_size < 100_000


def test_vat_savitri_north_pack_and_owner_link_are_schema_valid_without_progress_credit():
    ritual_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    pack = load(VAT_SAVITRI_NORTH_PACK)
    Draft202012Validator(ritual_schema).validate(pack)
    assert pack["lane_id"] == (
        "vat-savitri-north-amavasya-household-participant-2027-v1"
    )
    assert pack["observance_slugs"] == ["vat-savitri"]
    assert pack["product_status"]["classification"] == "user_complete_lane"
    assert all(pack["product_status"]["completed_dimensions"].values())
    assert pack["product_status"]["open_gaps"] == []

    source_ids = {source["source_id"] for source in pack["sources"]}
    assert len(source_ids) == len(pack["sources"]) >= 12
    referenced = []

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key == "source_ids":
                    referenced.extend(child)
                else:
                    walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)
    assert set(referenced) <= source_ids

    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    links = load(VAT_SAVITRI_LINKS)
    Draft202012Validator(link_schema).validate(links)
    assert len(links["proposals"]) == 1
    proposal = links["proposals"][0]
    assert proposal["to_ref"]["canonical_id"] == (
        "devam:source-expression:mahabharata-ganguli-consumer-v1"
    )
    assert proposal["target_resolution"] == "existing_anchor"
    assert proposal["predicate"] == (
        "uses_source_labelled_savitri_satyavan_context_from"
    )

    # The frozen umbrella item is not complete until its West Purnima companion passes.
    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 10
    assert progress["remaining_authoring_items"] == 198
    assert pack["lane_id"] not in progress["completed_lane_ids"]


def test_vat_savitri_north_is_bilingual_actionable_and_preserves_major_timing_split():
    pack = load(VAT_SAVITRI_NORTH_PACK)
    calendar = pack["calendar"]
    assert calendar["location_aware"] is True
    assert calendar["tradition_aware"] is True
    assert calendar["live_schedule_required"] is True
    assert "4 June" in calendar["freshness_note"]
    assert "18 June" in calendar["freshness_note"]
    assert "West Purnima" in calendar["freshness_note"]

    localized = {
        entry["language_code"]: entry for entry in pack["localized_content"]
    }
    assert set(localized) == {"en", "hi"}
    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 4
        assert len(entry["typical_practices"]) == 4
        assert all(
            not story["universal_origin_claimed"]
            for story in entry["origin_narratives"]
        )
        procedures = {procedure["tier"]: procedure for procedure in entry["procedures"]}
        assert set(procedures) == {"minimum", "standard", "elaborate"}
        assert len(procedures["minimum"]["steps"]) >= 5
        assert len(procedures["standard"]["steps"]) >= 8
        assert len(procedures["elaborate"]["steps"]) >= 6
        assert all(procedure["closing"]["text"] for procedure in entry["procedures"])

        variants = {variant["variant_id"]: variant for variant in entry["variants"]}
        suffix = "-hi" if entry["language_code"] == "hi" else ""
        for base in (
            "nonfast-or-known-family-fast",
            "thread-colour-count-or-no-thread",
            "married-woman-formal-or-inclusive-reflection",
            "minor-north-food-dress-language",
        ):
            assert variants[base + suffix]["separate_lane_required"] is False
        for base in (
            "vat-purnima-west",
            "formal-priest-led-or-three-night-vrata",
            "full-mahabharata-story",
        ):
            assert variants[base + suffix]["separate_lane_required"] is True

    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in (
        "not a universal national ritual",
        "severe three-night fast",
        "non-fasting is complete",
        "not proof that a vrata can resurrect",
        "urgent symptoms require medical action",
        "no wife or partner is responsible",
        "consent is specific and revocable",
        "do not nail, cut, scrape, paint or constrict",
        "caretaker permission",
        "west purnima companion",
    ):
        assert term in english

    hindi = json.dumps(localized["hi"], ensure_ascii=False)
    for term in (
        "सार्वभौम राष्ट्रीय अनुष्ठान नहीं",
        "तीन-रात्रि उपवास",
        "बिना उपवास पूर्ण",
        "पुनर्जीवन",
        "चिकित्सकीय सहायता",
        "जिम्मेदारी नहीं",
        "सहमति",
        "कील",
        "पालक अनुमति",
        "पश्चिम पूर्णिमा साथी",
    ):
        assert term in hindi

    ganguli = next(
        source for source in pack["sources"]
        if source["source_id"] == "ganguli-mahabharata-savitri"
    )
    assert ganguli["artifact_sha256"] == (
        "246325dcb8966a13990ab66f38b1cab230724fe0b1ad135bd6fb12222baa4826"
    )
    raw = VAT_SAVITRI_NORTH_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "वट सावित्री".encode("utf-8") in raw
    assert VAT_SAVITRI_NORTH_PACK.stat().st_size < 100_000

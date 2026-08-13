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
VAT_PURNIMA_WEST_PACK = (
    LANE / "packs" / "vat-purnima-west-household-participant-2027-v1.json"
)
VAT_SAVITRI_LINKS = (
    LANE / "cross-links" / "vat-savitri-mahabharata-owner-links-v1.json"
)
GURU_PURNIMA_PACK = (
    LANE
    / "packs"
    / "guru-purnima-general-gratitude-household-participant-2027-v1.json"
)
GURU_PURNIMA_LINK = (
    LANE / "cross-links" / "guru-purnima-mahabharata-owner-link-v1.json"
)
RAKSHA_BANDHAN_PACK = (
    LANE
    / "packs"
    / "raksha-bandhan-consent-led-sibling-household-2027-v1.json"
)
RAKSHA_BANDHAN_LINKS = (
    LANE / "cross-links" / "raksha-bandhan-story-owner-proposals-v1.json"
)
VARALAKSHMI_PACK = (
    LANE / "packs" / "varalakshmi-vratam-south-india-household-participant-2027-v1.json"
)
VARALAKSHMI_LINK = (
    LANE / "cross-links" / "varalakshmi-vratam-devi-owner-link-v1.json"
)
ONAM_PACK = LANE / "packs" / "onam-kerala-household-participant-2027-v1.json"
ONAM_LINK = (
    LANE / "cross-links" / "onam-vamana-mahabali-story-owner-proposal-v1.json"
)
NARALI_PACK = (
    LANE / "packs" / "narali-purnima-maharashtra-coastal-participant-2027-v1.json"
)
NARALI_LINK = (
    LANE / "cross-links" / "narali-purnima-koli-living-tradition-owner-v1.json"
)
SAPHALA_PACK = (
    LANE / "packs" / "saphala-ekadashi-north-west-smarta-household-2027-v1.json"
)
SAPHALA_LINK = (
    LANE
    / "cross-links"
    / "saphala-ekadashi-padma-purana-story-owner-proposal-v1.json"
)
PAUSHA_PUTRADA_PACK = (
    LANE
    / "packs"
    / "pausha-putrada-ekadashi-north-west-smarta-household-2027-v1.json"
)
PAUSHA_PUTRADA_LINK = (
    LANE
    / "cross-links"
    / "pausha-putrada-padma-purana-story-owner-proposal-v1.json"
)
SHATTILA_PACK = (
    LANE / "packs" / "shattila-ekadashi-north-west-smarta-household-2027-v1.json"
)
SHATTILA_LINK = (
    LANE / "cross-links" / "shattila-padma-purana-story-owner-proposal-v1.json"
)
JAYA_PACK = (
    LANE / "packs" / "jaya-ekadashi-north-west-smarta-household-2027-v1.json"
)
JAYA_LINK = (
    LANE / "cross-links" / "jaya-padma-purana-story-owner-proposal-v1.json"
)
VIJAYA_PACK = (
    LANE / "packs" / "vijaya-ekadashi-north-west-smarta-household-2027-v1.json"
)
VIJAYA_LINKS = (
    LANE / "cross-links" / "vijaya-story-and-pankoddhar-owner-proposals-v1.json"
)
AMALAKI_PACK = (
    LANE / "packs" / "amalaki-ekadashi-north-west-smarta-household-2027-v1.json"
)
AMALAKI_LINK = (
    LANE / "cross-links" / "amalaki-padma-purana-story-owner-proposal-v1.json"
)
PAPAMOCHANI_PACK = (
    LANE / "packs" / "papamochani-ekadashi-north-west-smarta-household-2027-v1.json"
)
PAPAMOCHANI_LINK = (
    LANE / "cross-links" / "papamochani-padma-purana-story-owner-proposal-v1.json"
)
KAMADA_PACK = (
    LANE / "packs" / "kamada-ekadashi-north-west-smarta-household-2027-v1.json"
)
KAMADA_LINK = (
    LANE / "cross-links" / "kamada-padma-purana-story-owner-proposal-v1.json"
)
VARUTHINI_PACK = LANE / "packs" / "varuthini-ekadashi-north-west-smarta-household-2027-v1.json"
VARUTHINI_LINK = LANE / "cross-links" / "varuthini-padma-purana-story-owner-proposal-v1.json"
MOHINI_PACK = LANE / "packs" / "mohini-ekadashi-north-west-smarta-household-2027-v1.json"
MOHINI_LINK = LANE / "cross-links" / "mohini-padma-purana-story-owner-proposal-v1.json"
APARA_PACK = LANE / "packs" / "apara-ekadashi-north-west-smarta-household-2027-v1.json"
APARA_LINK = LANE / "cross-links" / "apara-padma-purana-source-owner-proposal-v1.json"
NIRJALA_PACK = LANE / "packs" / "nirjala-ekadashi-north-west-smarta-household-2027-v1.json"
NIRJALA_LINK = LANE / "cross-links" / "nirjala-padma-purana-bhima-vyasa-story-owner-proposal-v1.json"
YOGINI_PACK = LANE / "packs" / "yogini-ekadashi-north-west-smarta-household-2027-v1.json"
YOGINI_LINK = LANE / "cross-links" / "yogini-padma-purana-hemamali-story-owner-proposal-v1.json"
DEVSHAYANI_PACK = LANE / "packs" / "devshayani-ekadashi-north-west-smarta-household-2027-v1.json"
DEVSHAYANI_LINK = LANE / "cross-links" / "devshayani-padma-purana-vamana-bali-story-owner-proposal-v1.json"
ASHADHI_WARI_PACK = LANE / "packs" / "ashadhi-ekadashi-maharashtra-varkari-participant-2027-v1.json"
ASHADHI_WARI_LINK = LANE / "cross-links" / "ashadhi-varkari-living-tradition-owner-proposal-v1.json"
KAMIKA_ORDINARY_PACK = LANE / "packs" / "kamika-ekadashi-north-west-smarta-household-2027-v1.json"
KAMIKA_ORDINARY_LINK = LANE / "cross-links" / "kamika-padma-purana-source-owner-proposal-v1.json"
GAUNA_KAMIKA_PACK = LANE / "packs" / "gauna-kamika-ekadashi-india-calendar-authority-2027-v1.json"
GAUNA_KAMIKA_LINK = LANE / "cross-links" / "gauna-kamika-padma-purana-source-owner-proposal-v1.json"
VAISHNAVA_KAMIKA_PACK = LANE / "packs" / "vaishnava-kamika-ekadashi-india-authority-router-2027-v1.json"
VAISHNAVA_KAMIKA_LINK = LANE / "cross-links" / "vaishnava-kamika-padma-purana-source-owner-proposal-v1.json"
SHRAVANA_PUTRADA_PACK = LANE / "packs" / "shravana-putrada-ekadashi-north-west-smarta-household-2027-v1.json"
SHRAVANA_PUTRADA_LINK = LANE / "cross-links" / "shravana-putrada-padma-purana-story-owner-proposal-v1.json"
AJA_PACK = LANE / "packs" / "aja-ekadashi-north-west-smarta-household-2027-v1.json"
AJA_LINK = LANE / "cross-links" / "aja-ekadashi-padma-purana-story-owner-proposal-v1.json"
PARSVA_PACK = LANE / "packs" / "parsva-parivartini-ekadashi-north-west-smarta-household-2027-v1.json"
PARSVA_LINK = LANE / "cross-links" / "parsva-parivartini-source-owner-proposals-v1.json"
INDIRA_PACK = LANE / "packs" / "indira-ekadashi-north-west-smarta-household-2027-v1.json"
INDIRA_LINK = LANE / "cross-links" / "indira-ekadashi-source-owner-proposals-v1.json"
PAPANKUSHA_PACK = LANE / "packs" / "papankusha-pashankusha-ekadashi-north-west-smarta-household-2027-v1.json"
PAPANKUSHA_LINK = LANE / "cross-links" / "papankusha-padma-purana-source-owner-proposal-v1.json"
RAMA_PACK = LANE / "packs" / "rama-ekadashi-north-west-smarta-household-2027-v1.json"
RAMA_LINK = LANE / "cross-links" / "rama-ekadashi-padma-purana-story-owner-proposal-v1.json"
DEVUTTHANA_PACK = LANE / "packs" / "devutthana-prabodhini-ekadashi-north-west-smarta-household-2027-v1.json"
DEVUTTHANA_LINK = LANE / "cross-links" / "devutthana-prabodhini-source-owner-proposals-v1.json"
UTPANNA_PACK = LANE / "packs" / "utpanna-utpatti-ekadashi-north-west-smarta-household-2027-v1.json"
UTPANNA_LINK = LANE / "cross-links" / "utpanna-ekadashi-padma-purana-story-owner-proposal-v1.json"
MOKSHADA_PACK = LANE / "packs" / "mokshada-gomati-ekadashi-north-west-smarta-household-2027-v1.json"
MOKSHADA_LINK = LANE / "cross-links" / "mokshada-ekadashi-source-and-gita-owner-proposals-v1.json"
VAISHNAVA_RAMA_PACK = (
    LANE / "packs" / "vaishnava-rama-ekadashi-india-authority-router-2027-v1.json"
)
VAISHNAVA_RAMA_LINK = (
    LANE / "cross-links" / "vaishnava-rama-authority-and-story-owner-proposals-v1.json"
)
KANYA_PACK = (
    LANE / "packs" / "kanya-sankranti-north-west-shared-household-2027-v1.json"
)
KANYA_LINK = (
    LANE / "cross-links" / "kanya-sankranti-vishwakarma-and-ramayana-owner-proposals-v1.json"
)
BHADRAPADA_PACK = LANE / "packs" / "bhadrapada-purnima-recurring-household-2027-v1.json"
BHADRAPADA_LINK = LANE / "cross-links" / "bhadrapada-purnima-practice-and-story-owner-proposals-v1.json"
KANNI_PACK = LANE / "packs" / "kanni-sankramam-kerala-malayalam-solar-household-2027-v1.json"
KANNI_LINK = LANE / "cross-links" / "kanni-sankramam-kanya-vishwakarma-and-story-owner-proposals-v1.json"
MAHA_BHARANI_PACK = LANE / "packs" / "maha-bharani-ancestor-remembrance-authority-router-2027-v1.json"
MAHA_BHARANI_LINK = LANE / "cross-links" / "maha-bharani-pitru-story-and-formal-owner-proposals-v1.json"
MAHALAYA_PACK = LANE / "packs" / "mahalaya-bengal-transition-listening-participant-2027-v1.json"
MAHALAYA_LINK = LANE / "cross-links" / "mahalaya-pitru-devi-regional-and-broadcast-owner-proposals-v1.json"
SARVA_PITRU_PACK = LANE / "packs" / "sarva-pitru-amavasya-north-west-authority-router-2027-v1.json"
SARVA_PITRU_LINK = LANE / "cross-links" / "sarva-pitru-regional-story-and-formal-owner-proposals-v1.json"
AUTHORING_PROGRESS = (
    LANE / "inventory" / "ritual-calendar-authoring-progress-v1.json"
)
DENOMINATOR_CORRECTIONS = (
    LANE / "inventory" / "ritual-calendar-denominator-correction-candidates-v1.json"
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
    assert progress["completed_after_freeze"] == 49
    assert progress["remaining_authoring_items"] == 159
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
        "vat-savitri-north-amavasya-household-participant-2027-v1",
        "vat-purnima-west-household-participant-2027-v1",
        "guru-purnima-general-gratitude-household-participant-2027-v1",
        "raksha-bandhan-consent-led-sibling-household-2027-v1",
        "varalakshmi-vratam-south-india-household-participant-2027-v1",
        "onam-kerala-household-participant-2027-v1",
        "narali-purnima-maharashtra-coastal-participant-2027-v1",
        "saphala-ekadashi-north-west-smarta-household-2027-v1",
        "pausha-putrada-ekadashi-north-west-smarta-household-2027-v1",
        "shattila-ekadashi-north-west-smarta-household-2027-v1",
        "jaya-ekadashi-north-west-smarta-household-2027-v1",
        "vijaya-ekadashi-north-west-smarta-household-2027-v1",
        "amalaki-ekadashi-north-west-smarta-household-2027-v1",
        "papamochani-ekadashi-north-west-smarta-household-2027-v1",
        "kamada-ekadashi-north-west-smarta-household-2027-v1",
        "varuthini-ekadashi-north-west-smarta-household-2027-v1",
        "mohini-ekadashi-north-west-smarta-household-2027-v1",
        "apara-ekadashi-north-west-smarta-household-2027-v1",
        "nirjala-ekadashi-north-west-smarta-household-2027-v1",
        "yogini-ekadashi-north-west-smarta-household-2027-v1",
        "devshayani-ekadashi-north-west-smarta-household-2027-v1",
        "ashadhi-ekadashi-maharashtra-varkari-participant-2027-v1",
        "kamika-ekadashi-north-west-smarta-household-2027-v1",
        "gauna-kamika-ekadashi-india-calendar-authority-2027-v1",
        "vaishnava-kamika-ekadashi-india-authority-router-2027-v1",
        "shravana-putrada-ekadashi-north-west-smarta-household-2027-v1",
        "aja-ekadashi-north-west-smarta-household-2027-v1",
        "parsva-parivartini-ekadashi-north-west-smarta-household-2027-v1",
        "indira-ekadashi-north-west-smarta-household-2027-v1",
        "papankusha-pashankusha-ekadashi-north-west-smarta-household-2027-v1",
        "rama-ekadashi-north-west-smarta-household-2027-v1",
        "devutthana-prabodhini-ekadashi-north-west-smarta-household-2027-v1",
        "utpanna-utpatti-ekadashi-north-west-smarta-household-2027-v1",
        "mokshada-gomati-ekadashi-north-west-smarta-household-2027-v1",
        "vaishnava-rama-ekadashi-india-authority-router-2027-v1",
        "kanya-sankranti-north-west-shared-household-2027-v1",
        "bhadrapada-purnima-recurring-household-2027-v1",
        "kanni-sankramam-kerala-malayalam-solar-household-2027-v1",
        "maha-bharani-ancestor-remembrance-authority-router-2027-v1",
        "mahalaya-bengal-transition-listening-participant-2027-v1",
        "sarva-pitru-amavasya-north-west-authority-router-2027-v1",
    ]
    assert progress["completed_umbrella_components"] == {
        "vat-savitri-north-west-participant-v1": [
            "vat-savitri-north-amavasya-household-participant-2027-v1",
            "vat-purnima-west-household-participant-2027-v1",
        ],
        "devshayani-ekadashi-v1": [
            "devshayani-ekadashi-north-west-smarta-household-2027-v1",
            "ashadhi-ekadashi-maharashtra-varkari-participant-2027-v1",
        ],
    }
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


def test_vat_savitri_north_pack_and_owner_link_are_schema_valid_with_single_umbrella_credit():
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
    assert len(links["proposals"]) == 2
    proposal = next(
        item for item in links["proposals"]
        if item["proposal_id"].startswith("vat-savitri-north-amavasya")
    )
    assert proposal["to_ref"]["canonical_id"] == (
        "devam:source-expression:mahabharata-ganguli-consumer-v1"
    )
    assert proposal["target_resolution"] == "existing_anchor"
    assert proposal["predicate"] == (
        "uses_source_labelled_savitri_satyavan_context_from"
    )

    # Two material applicability packs complete one frozen umbrella item, not two.
    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49
    assert progress["remaining_authoring_items"] == 159
    assert pack["lane_id"] in progress["completed_lane_ids"]
    assert VAT_PURNIMA_WEST_PACK.stem in progress["completed_lane_ids"]
    assert progress["completed_umbrella_components"][
        "vat-savitri-north-west-participant-v1"
    ] == [pack["lane_id"], VAT_PURNIMA_WEST_PACK.stem]


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


def test_vat_purnima_west_is_a_distinct_bilingual_complete_lane():
    schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    pack = load(VAT_PURNIMA_WEST_PACK)
    Draft202012Validator(schema).validate(pack)
    assert pack["lane_id"] == "vat-purnima-west-household-participant-2027-v1"
    assert pack["applicability"]["region_codes"] == [
        "west-india", "IN-MH", "IN-GJ", "IN-KA"
    ]
    assert pack["product_status"]["classification"] == "user_complete_lane"
    assert all(pack["product_status"]["completed_dimensions"].values())
    assert pack["product_status"]["open_gaps"] == []

    source_ids = {source["source_id"] for source in pack["sources"]}
    assert len(source_ids) == len(pack["sources"]) >= 11
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

    calendar = pack["calendar"]
    assert calendar["location_aware"] is True
    assert calendar["tradition_aware"] is True
    assert "Friday 18 June" in calendar["freshness_note"]
    assert "Paris location, not an Indian clock" in calendar["freshness_note"]
    assert "North Amavasya fixture of Friday 4 June" in calendar["freshness_note"]

    localized = {
        entry["language_code"]: entry for entry in pack["localized_content"]
    }
    assert set(localized) == {"en", "hi"}
    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 4
        assert len(entry["typical_practices"]) == 4
        assert all(not story["universal_origin_claimed"] for story in entry["origin_narratives"])
        procedures = {procedure["tier"]: procedure for procedure in entry["procedures"]}
        assert set(procedures) == {"minimum", "standard", "elaborate"}
        assert [len(procedures[tier]["steps"]) for tier in ("minimum", "standard", "elaborate")] == [5, 8, 6]

        variants = {variant["variant_id"]: variant for variant in entry["variants"]}
        suffix = "-hi" if entry["language_code"] == "hi" else ""
        for base in (
            "nonfast-or-known-family-fast",
            "thread-colour-count-or-no-thread",
            "married-woman-formal-or-inclusive-reflection",
            "minor-west-food-dress-language",
        ):
            assert variants[base + suffix]["separate_lane_required"] is False
        for base in (
            "vat-savitri-north-amavasya",
            "formal-priest-led-or-three-night-vrata",
            "full-mahabharata-story",
        ):
            assert variants[base + suffix]["separate_lane_required"] is True

    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in (
        "maharashtra's current state description",
        "strict fast",
        "flowers, coconut and turmeric",
        "north amavasya",
        "non-fasting is complete",
        "not proof that a vrata can resurrect",
        "consent is specific and revocable",
        "do not nail, cut, scrape, paint or constrict",
    ):
        assert term in english

    hindi = json.dumps(localized["hi"], ensure_ascii=False)
    for term in (
        "महाराष्ट्र का वर्तमान राज्य-वर्णन",
        "कठोर उपवास",
        "फूल, नारियल, हल्दी",
        "उत्तर अमावस्या",
        "बिना उपवास पूर्ण",
        "पुनर्जीवन",
        "सहमति",
        "कील",
    ):
        assert term in hindi

    links = load(VAT_SAVITRI_LINKS)
    west = next(
        proposal for proposal in links["proposals"]
        if proposal["proposal_id"].startswith("vat-purnima-west")
    )
    assert west["to_ref"]["canonical_id"] == (
        "devam:source-expression:mahabharata-ganguli-consumer-v1"
    )
    assert west["target_resolution"] == "existing_anchor"
    assert west["predicate"] == "uses_source_labelled_savitri_satyavan_context_from"

    raw = VAT_PURNIMA_WEST_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "वट सावित्री".encode("utf-8") in raw
    assert VAT_PURNIMA_WEST_PACK.stat().st_size < 100_000


def test_guru_purnima_pack_and_mahabharata_link_are_schema_valid_and_complete():
    ritual_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    pack = load(GURU_PURNIMA_PACK)
    Draft202012Validator(ritual_schema).validate(pack)
    assert pack["lane_id"] == (
        "guru-purnima-general-gratitude-household-participant-2027-v1"
    )
    assert pack["observance_slugs"] == ["guru-purnima"]
    assert pack["product_status"]["classification"] == "user_complete_lane"
    assert all(pack["product_status"]["completed_dimensions"].values())
    assert pack["product_status"]["open_gaps"] == []

    source_ids = {source["source_id"] for source in pack["sources"]}
    assert len(source_ids) == len(pack["sources"]) >= 13
    referenced = []

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    referenced.extend(child)
                else:
                    walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)
    assert set(referenced) <= source_ids

    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    links = load(GURU_PURNIMA_LINK)
    Draft202012Validator(link_schema).validate(links)
    assert len(links["proposals"]) == 1
    proposal = links["proposals"][0]
    assert proposal["to_ref"]["canonical_id"] == (
        "devam:source-expression:mahabharata-ganguli-consumer-v1"
    )
    assert proposal["target_resolution"] == "existing_anchor"
    assert proposal["predicate"] == (
        "uses_source_labelled_vyasa_knowledge_transmission_context_from"
    )

    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49
    assert progress["remaining_authoring_items"] == 159
    assert pack["lane_id"] in progress["completed_lane_ids"]
    assert (
        "knowledge_packs/library_lanes/ritual-calendar/packs/"
        + pack["lane_id"]
        + ".json"
    ) in progress["completed_pack_refs"]


def test_guru_purnima_is_bilingual_actionable_source_layered_and_power_safe():
    pack = load(GURU_PURNIMA_PACK)
    calendar = pack["calendar"]
    assert calendar["location_aware"] is True
    assert calendar["tradition_aware"] is True
    assert calendar["live_schedule_required"] is True
    assert "Sunday 18 July" in calendar["freshness_note"]
    assert "Washington, D.C." in calendar["freshness_note"]
    assert "not Indian clock times" in calendar["freshness_note"]
    assert "Recompute" in calendar["freshness_note"]

    localized = {
        entry["language_code"]: entry for entry in pack["localized_content"]
    }
    assert set(localized) == {"en", "hi"}
    shapes = []
    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 4
        assert len(entry["typical_practices"]) == 4
        assert all(
            not story["universal_origin_claimed"]
            for story in entry["origin_narratives"]
        )
        procedures = {procedure["tier"]: procedure for procedure in entry["procedures"]}
        assert set(procedures) == {"minimum", "standard", "elaborate"}
        shape = [
            (tier, len(procedures[tier]["materials"]), len(procedures[tier]["steps"]))
            for tier in ("minimum", "standard", "elaborate")
        ]
        assert shape == [
            ("minimum", 2, 6),
            ("standard", 6, 8),
            ("elaborate", 3, 7),
        ]
        shapes.append(shape)
        assert all(procedure["closing"]["text"] for procedure in entry["procedures"])

        variants = {variant["variant_id"]: variant for variant in entry["variants"]}
        suffix = "-hi" if entry["language_code"] == "hi" else ""
        for base in (
            "parent-teacher-mentor-or-spiritual-teacher",
            "living-deceased-contact-or-private-remembrance",
            "gift-flower-message-service-or-no-material",
            "fast-nonfast-food-language-or-dress",
        ):
            assert variants[base + suffix]["separate_lane_required"] is False
        for base in (
            "diksha-guru-sampradaya-puja",
            "formal-vyasa-puja",
            "buddhist-ashadha-purnima",
            "jain-guru-purnima",
            "named-pilgrimage-or-institution-programme",
            "full-mahabharata-vyasa-context",
        ):
            assert variants[base + suffix]["separate_lane_required"] is True
    assert shapes[0] == shapes[1]

    english_stories = " ".join(
        story["summary"] for story in localized["en"]["origin_narratives"]
    ).lower()
    assert "not a festival-dated event" in english_stories
    assert "does not supply the festival date or birth claim" in english_stories
    assert "living festival association" in english_stories

    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in (
        "not a universal national guru puja",
        "teaching guru, diksha guru",
        "gratitude is voluntary",
        "withdrawal of a complaint",
        "no child privately contacts",
        "reverence never requires silence",
        "consent is specific, revocable",
        "never borrow, transfer property, share pin/otp",
        "non-fasting is complete",
        "washington 09:18-11:44 interval is not an indian clock",
        "no blessing, liberation, knowledge, examination result",
    ):
        assert term in english

    hindi = json.dumps(localized["hi"], ensure_ascii=False)
    for term in (
        "सार्वभौम राष्ट्रीय गुरु-पूजा नहीं",
        "शिक्षा-गुरु, दीक्षा-गुरु",
        "कृतज्ञता स्वैच्छिक",
        "शिकायत वापसी",
        "कोई बच्चा",
        "श्रद्धा दुर्व्यवहार",
        "सहमति विशिष्ट/वापस लेने योग्य",
        "PIN/OTP",
        "बिना उपवास पूर्ण",
        "वॉशिंगटन 09:18-11:44 भारतीय घड़ी नहीं",
        "आशीर्वाद, मुक्ति, ज्ञान, परीक्षा फल",
    ):
        assert term in hindi

    ganguli = next(
        source for source in pack["sources"]
        if source["source_id"] == "ganguli-mahabharata-vyasa-transmission"
    )
    assert ganguli["artifact_sha256"] == (
        "246325dcb8966a13990ab66f38b1cab230724fe0b1ad135bd6fb12222baa4826"
    )
    raw = GURU_PURNIMA_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "गुरु पूर्णिमा".encode("utf-8") in raw
    assert GURU_PURNIMA_PACK.stat().st_size < 100_000


def test_raksha_bandhan_pack_links_and_progress_are_schema_valid():
    ritual_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    pack = load(RAKSHA_BANDHAN_PACK)
    Draft202012Validator(ritual_schema).validate(pack)
    assert pack["lane_id"] == (
        "raksha-bandhan-consent-led-sibling-household-2027-v1"
    )
    assert pack["observance_slugs"] == ["raksha-bandhan"]
    assert pack["product_status"]["classification"] == "user_complete_lane"
    assert all(pack["product_status"]["completed_dimensions"].values())

    source_ids = {source["source_id"] for source in pack["sources"]}
    assert len(source_ids) == len(pack["sources"]) >= 9
    referenced = []

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    referenced.extend(child)
                else:
                    walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)
    assert set(referenced) <= source_ids

    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    links = load(RAKSHA_BANDHAN_LINKS)
    Draft202012Validator(link_schema).validate(links)
    assert len(links["proposals"]) == 2
    by_id = {proposal["proposal_id"]: proposal for proposal in links["proposals"]}
    draupadi = by_id["raksha-bandhan-draupadi-krishna-popular-association-audit"]
    assert draupadi["confidence"] == "contested"
    assert draupadi["target_resolution"] == "existing_anchor"
    assert draupadi["to_ref"]["canonical_id"] == (
        "devam:source-expression:mahabharata-ganguli-consumer-v1"
    )
    tagore = by_id["raksha-bandhan-tagore-1905-history-owner"]
    assert tagore["target_resolution"] == "unresolved_owner_lane"

    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49
    assert progress["remaining_authoring_items"] == 159
    assert pack["lane_id"] in progress["completed_lane_ids"]
    assert (
        "knowledge_packs/library_lanes/ritual-calendar/packs/"
        + pack["lane_id"]
        + ".json"
    ) in progress["completed_pack_refs"]


def test_raksha_bandhan_is_bilingual_consent_led_and_major_variant_bounded():
    pack = load(RAKSHA_BANDHAN_PACK)
    calendar = pack["calendar"]
    assert calendar["location_aware"] is True
    assert calendar["tradition_aware"] is True
    assert calendar["live_schedule_required"] is False
    assert "Monday 16 August" in calendar["freshness_note"]
    assert "Washington, D.C." in calendar["freshness_note"]
    assert "never copy" in calendar["freshness_note"]
    assert "Recompute" in calendar["freshness_note"]

    localized = {
        entry["language_code"]: entry for entry in pack["localized_content"]
    }
    assert set(localized) == {"en", "hi"}
    shapes = []
    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 3
        assert len(entry["typical_practices"]) == 3
        assert all(
            not story["universal_origin_claimed"]
            for story in entry["origin_narratives"]
        )
        procedures = {procedure["tier"]: procedure for procedure in entry["procedures"]}
        assert set(procedures) == {"minimum", "standard", "elaborate"}
        shape = [
            (tier, len(procedures[tier]["materials"]), len(procedures[tier]["steps"]))
            for tier in ("minimum", "standard", "elaborate")
        ]
        assert shape == [
            ("minimum", 1, 5),
            ("standard", 5, 8),
            ("elaborate", 2, 5),
        ]
        shapes.append(shape)
        assert all(procedure["closing"]["text"] for procedure in entry["procedures"])

        variants = {variant["variant_id"]: variant for variant in entry["variants"]}
        suffix = "-hi" if entry["language_code"] == "hi" else ""
        for base in ("relationship-and-gender", "materials-language-and-food"):
            assert variants[base + suffix]["separate_lane_required"] is False
        for base in (
            "narali-purnima",
            "upakarma-avani-avittam",
            "priest-or-temple-raksha-sutra",
            "named-public-programme",
        ):
            assert variants[base + suffix]["separate_lane_required"] is True
    assert shapes[0] == shapes[1]

    english_stories = " ".join(
        story["summary"] for story in localized["en"]["origin_narratives"]
    ).lower()
    assert "has not established it as a fixed mahabharata passage" in english_stories
    assert "not a verified universal origin" in english_stories
    assert "current official historical retelling" in english_stories

    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in (
        "ask before touch or tying",
        "familiar sister-ties/brother-gifts form is common, not compulsory",
        "relationship affection does not replace consent",
        "without demanding a protection promise",
        "one-way protection vow",
        "no-gift form is complete",
        "never share otp, pin, password",
        "mutual care never authorizes surveillance",
        "staying home is complete",
    ):
        assert term in english

    hindi = json.dumps(localized["hi"], ensure_ascii=False)
    for term in (
        "सहमति-आधारित",
        "प्रचलित रूप है, बाध्यता नहीं",
        "संबंध का स्नेह सहमति का स्थान नहीं लेता",
        "रक्षा-वचन",
        "बिना उपहार का रूप पूर्ण है",
        "ओटीपी, पिन, पासवर्ड",
        "निगरानी या नियंत्रण",
        "घर पर रहना भी पूर्ण है",
    ):
        assert term in hindi

    raw = RAKSHA_BANDHAN_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "रक्षा बंधन".encode("utf-8") in raw
    assert RAKSHA_BANDHAN_PACK.stat().st_size < 100_000


def test_varalakshmi_participant_pack_and_devi_link_are_schema_valid():
    ritual_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    pack = load(VARALAKSHMI_PACK)
    Draft202012Validator(ritual_schema).validate(pack)
    assert pack["lane_id"] == "varalakshmi-vratam-south-india-household-participant-2027-v1"
    assert pack["product_status"]["classification"] == "user_complete_lane"
    assert all(pack["product_status"]["completed_dimensions"].values())
    source_ids = {source["source_id"] for source in pack["sources"]}
    assert len(source_ids) == len(pack["sources"]) >= 8
    refs = []

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    refs.extend(child)
                else:
                    walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)
    assert set(refs) <= source_ids

    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    links = load(VARALAKSHMI_LINK)
    Draft202012Validator(link_schema).validate(links)
    proposal = links["proposals"][0]
    assert proposal["to_ref"]["lane_local_id"] == "devi-consumer/varalakshmi-vratam"
    assert proposal["target_resolution"] == "unresolved_owner_lane"
    assert proposal["predicate"] == "requests_owned_identity_story_and_theology_context"

    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49
    assert progress["remaining_authoring_items"] == 159
    assert pack["lane_id"] in progress["completed_lane_ids"]


def test_varalakshmi_is_bilingual_actionable_and_authority_bounded():
    pack = load(VARALAKSHMI_PACK)
    calendar = pack["calendar"]
    assert calendar["location_aware"] is True
    assert calendar["tradition_aware"] is True
    assert calendar["live_schedule_required"] is True
    assert "Friday 13 August" in calendar["freshness_note"]
    assert "Bangkok" in calendar["freshness_note"]
    assert "do not copy" in calendar["freshness_note"]

    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    shapes = []
    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 2
        assert len(entry["typical_practices"]) == 2
        assert all(not story["universal_origin_claimed"] for story in entry["origin_narratives"])
        procedures = {procedure["tier"]: procedure for procedure in entry["procedures"]}
        assert set(procedures) == {"minimum", "elaborate"}
        shape = [(tier, len(procedures[tier]["materials"]), len(procedures[tier]["steps"])) for tier in ("minimum", "elaborate")]
        assert shape == [("minimum", 2, 6), ("elaborate", 1, 4)]
        shapes.append(shape)
        variants = {variant["variant_id"]: variant for variant in entry["variants"]}
        suffix = "-hi" if entry["language_code"] == "hi" else ""
        for base in ("state-language-material-style", "gender-marital-and-fast"):
            assert variants[base + suffix]["separate_lane_required"] is False
        for base in ("formal-household-vrata", "named-temple-programme", "devi-identity-and-full-story"):
            assert variants[base + suffix]["separate_lane_required"] is True
    assert shapes[0] == shapes[1]

    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in (
        "not a verified primary-text passage",
        "do not assume gender, marriage or fasting eligibility",
        "do not copy kalasha, anga puja, names or threads",
        "non-fasting, no-thread, no-kalasha, no-gift form is complete",
        "a woman is not responsible for a husband's lifespan",
        "never borrow, buy gold, transfer property, share otp",
    ):
        assert term in english
    hindi = json.dumps(localized["hi"], ensure_ascii=False)
    for term in (
        "प्राथमिक-पाठ प्रमाण",
        "लिंग, विवाह या उपवास की पात्रता न मान लें",
        "बिना उपवास, धागा, कलश और उपहार का रूप",
        "महिला पति की आयु की जिम्मेदार नहीं",
        "ओटीपी",
    ):
        assert term in hindi

    raw = VARALAKSHMI_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "वरलक्ष्मी व्रतम".encode("utf-8") in raw
    assert VARALAKSHMI_PACK.stat().st_size < 100_000


def test_onam_pack_and_unresolved_story_link_are_schema_valid():
    ritual_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    pack = load(ONAM_PACK)
    Draft202012Validator(ritual_schema).validate(pack)
    assert pack["lane_id"] == "onam-kerala-household-participant-2027-v1"
    assert pack["observance_slugs"] == ["onam", "thiruvonam"]
    assert pack["product_status"]["classification"] == "user_complete_lane"
    assert all(pack["product_status"]["completed_dimensions"].values())
    source_ids = {source["source_id"] for source in pack["sources"]}
    assert len(source_ids) == len(pack["sources"]) >= 10
    refs = []

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    refs.extend(child)
                else:
                    walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)
    assert set(refs) <= source_ids

    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    links = load(ONAM_LINK)
    Draft202012Validator(link_schema).validate(links)
    proposal = links["proposals"][0]
    assert proposal["to_ref"]["lane_local_id"] == "story/vamana-mahabali-source-context"
    assert proposal["target_resolution"] == "unresolved_owner_lane"
    assert proposal["predicate"] == "requests_full_source_labelled_vamana_mahabali_context"

    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49
    assert progress["remaining_authoring_items"] == 159
    assert pack["lane_id"] in progress["completed_lane_ids"]


def test_onam_is_bilingual_actionable_and_major_variant_bounded():
    pack = load(ONAM_PACK)
    calendar = pack["calendar"]
    assert calendar["location_aware"] is True
    assert calendar["tradition_aware"] is True
    assert calendar["live_schedule_required"] is True
    assert "Sunday 12 September" in calendar["freshness_note"]
    assert "02:58" in calendar["freshness_note"]
    assert "06:04" in calendar["freshness_note"]
    assert "every named temple or public event" in calendar["freshness_note"]

    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    shapes = []
    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 4
        assert len(entry["typical_practices"]) == 3
        assert all(not story["universal_origin_claimed"] for story in entry["origin_narratives"])
        procedures = {procedure["tier"]: procedure for procedure in entry["procedures"]}
        assert set(procedures) == {"minimum", "standard", "elaborate"}
        shape = [(tier, len(procedures[tier]["materials"]), len(procedures[tier]["steps"])) for tier in ("minimum", "standard", "elaborate")]
        assert shape == [("minimum", 3, 7), ("standard", 1, 4), ("elaborate", 1, 4)]
        shapes.append(shape)
        variants = {variant["variant_id"]: variant for variant in entry["variants"]}
        suffix = "-hi" if entry["language_code"] == "hi" else ""
        assert variants["household-language-framing-and-intensity" + suffix]["separate_lane_required"] is False
        for base in (
            "thrikkakara-appan-mathevar-household-worship",
            "thrikkakara-temple-mahotsavam",
            "named-public-arts-water-or-parade-event",
            "onathaar",
            "animal-or-insect-offering",
        ):
            assert variants[base + suffix]["separate_lane_required"] is True
    assert shapes[0] == shapes[1]

    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in (
        "not proof of a historical golden age",
        "does not turn bodily surrender or obedience to power",
        "a cultural welcome without worship is complete",
        "no one must overeat, fast, cook or serve",
        "staying home or watching remotely is complete",
        "women, elders, domestic workers and hosts are not obligated",
    ):
        assert term in english
    hindi = json.dumps(localized["hi"], ensure_ascii=False)
    for term in (
        "ऐतिहासिक स्वर्णयुग का प्रमाण",
        "आत्म-समर्पण निर्देश",
        "बिना पूजा सांस्कृतिक स्वागत पूर्ण है",
        "अधिक खाना, उपवास, पकाना या परोसना अनिवार्य नहीं",
        "महिलाएँ, बुज़ुर्ग, घरेलू कर्मी और मेजबान",
        "घर रहना या दूर से देखना पूर्ण है",
    ):
        assert term in hindi

    raw = ONAM_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "ओणम".encode("utf-8") in raw
    assert ONAM_PACK.stat().st_size < 100_000


def test_narali_pack_and_koli_owner_link_are_schema_valid():
    ritual_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    pack = load(NARALI_PACK)
    Draft202012Validator(ritual_schema).validate(pack)
    assert pack["lane_id"] == "narali-purnima-maharashtra-coastal-participant-2027-v1"
    assert pack["product_status"]["classification"] == "user_complete_lane"
    assert all(pack["product_status"]["completed_dimensions"].values())
    source_ids = {source["source_id"] for source in pack["sources"]}
    assert len(source_ids) == len(pack["sources"]) >= 11
    refs = []

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    refs.extend(child)
                else:
                    walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)
    assert set(refs) <= source_ids

    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    links = load(NARALI_LINK)
    Draft202012Validator(link_schema).validate(links)
    proposal = links["proposals"][0]
    assert proposal["to_ref"]["lane_local_id"] == "living-traditions/koli-narali-purnima-community-practice"
    assert proposal["target_resolution"] == "unresolved_owner_lane"
    assert proposal["predicate"] == "requests_community_reviewed_prayer_offering_and_livelihood_context"

    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49
    assert progress["remaining_authoring_items"] == 159
    assert pack["lane_id"] in progress["completed_lane_ids"]


def test_narali_is_bilingual_shore_safe_and_maritime_bounded():
    pack = load(NARALI_PACK)
    calendar = pack["calendar"]
    assert calendar["location_aware"] is True
    assert calendar["tradition_aware"] is True
    assert calendar["live_schedule_required"] is True
    assert "Tuesday 17 August" in calendar["freshness_note"]
    assert "Monday 16 August" in calendar["freshness_note"]
    assert "not portable" in calendar["freshness_note"]

    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    shapes = []
    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 3
        assert len(entry["typical_practices"]) == 3
        assert all(not story["universal_origin_claimed"] for story in entry["origin_narratives"])
        procedures = {procedure["tier"]: procedure for procedure in entry["procedures"]}
        assert set(procedures) == {"minimum", "standard", "elaborate"}
        shape = [(tier, len(procedures[tier]["materials"]), len(procedures[tier]["steps"])) for tier in ("minimum", "standard", "elaborate")]
        assert shape == [("minimum", 2, 5), ("standard", 1, 5), ("elaborate", 1, 3)]
        shapes.append(shape)
        variants = {variant["variant_id"]: variant for variant in entry["variants"]}
        suffix = "-hi" if entry["language_code"] == "hi" else ""
        assert variants["language-food-dress-and-symbol" + suffix]["separate_lane_required"] is False
        for base in (
            "koli-community-varuna-sea-offering",
            "boat-puja-procession-or-trip",
            "commercial-fishing-resumption",
            "inland-water-varuna-offering",
            "other-shravana-purnima-observance",
        ):
            assert variants[base + suffix]["separate_lane_required"] is True
    assert shapes[0] == shapes[1]

    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in (
        "not an origin myth",
        "do not invent a varuna mantra",
        "do not throw anything into sea, river or drain",
        "never enter surf, rocks, jetty or breakwater",
        "do not board any vessel under this procedure",
        "festival timing supplies no clearance",
        "guarantees no calm sea, disaster protection, catch, income",
    ):
        assert term in english
    hindi = json.dumps(localized["hi"], ensure_ascii=False)
    for term in (
        "उत्पत्ति-कथा",
        "वरुण मंत्र न गढ़ें",
        "समुद्र, नदी या नाली में कुछ न फेंकें",
        "लहर, चट्टान, जेटी, ब्रेकवॉटर में न जाएँ",
        "इस क्रम में नाव पर न चढ़ें",
        "त्योहार समय कोई अनुमति",
        "शांत समुद्र, आपदा सुरक्षा, पकड़, आय",
    ):
        assert term in hindi

    raw = NARALI_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "नारळी पूर्णिमा".encode("utf-8") in raw
    assert NARALI_PACK.stat().st_size < 100_000


def test_saphala_pack_is_schema_valid_source_closed_and_counted_once():
    ritual_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    pack = load(SAPHALA_PACK)
    Draft202012Validator(ritual_schema).validate(pack)
    assert pack["lane_id"] == "saphala-ekadashi-north-west-smarta-household-2027-v1"
    assert pack["observance_slugs"] == ["saphala-ekadashi"]
    assert pack["product_status"]["classification"] == "user_complete_lane"
    assert all(pack["product_status"]["completed_dimensions"].values())
    source_ids = {source["source_id"] for source in pack["sources"]}
    assert len(source_ids) == len(pack["sources"]) >= 6
    refs = []

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    refs.extend(child)
                else:
                    walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)
    assert set(refs) <= source_ids

    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49
    assert progress["remaining_authoring_items"] == 159
    assert progress["completed_lane_ids"].count(pack["lane_id"]) == 1
    assert progress["completed_pack_refs"].count(
        "knowledge_packs/library_lanes/ritual-calendar/packs/"
        "saphala-ekadashi-north-west-smarta-household-2027-v1.json"
    ) == 1

    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    links = load(SAPHALA_LINK)
    Draft202012Validator(link_schema).validate(links)
    proposal = links["proposals"][0]
    assert proposal["to_ref"]["lane_local_id"] == (
        "story/padma-purana-saphala-lumpaka-source-context"
    )
    assert proposal["target_resolution"] == "unresolved_owner_lane"
    assert proposal["predicate"] == (
        "requests_full_source_labelled_saphala_lumpaka_context"
    )


def test_saphala_is_bilingual_nonfast_and_major_variant_bounded():
    pack = load(SAPHALA_PACK)
    calendar = pack["calendar"]
    assert calendar["location_aware"] is True
    assert calendar["tradition_aware"] is True
    assert calendar["live_schedule_required"] is True
    assert "Sunday 3 January 2027" in calendar["freshness_note"]
    assert "Thursday 23 December 2027" in calendar["freshness_note"]
    assert "one named authoring lane" in calendar["freshness_note"]

    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    shapes = []
    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 1
        assert len(entry["typical_practices"]) == 2
        assert all(not story["universal_origin_claimed"] for story in entry["origin_narratives"])
        procedures = {procedure["tier"]: procedure for procedure in entry["procedures"]}
        assert set(procedures) == {"minimum", "standard", "elaborate"}
        shape = [
            (tier, len(procedures[tier]["materials"]), len(procedures[tier]["steps"]))
            for tier in ("minimum", "standard", "elaborate")
        ]
        assert shape == [("minimum", 2, 7), ("standard", 2, 5), ("elaborate", 1, 4)]
        shapes.append(shape)
        variants = {variant["variant_id"]: variant for variant in entry["variants"]}
        suffix = "-hi" if entry["language_code"] == "hi" else ""
        for base in ("language-fruit-flower-image-and-prayer", "voluntary-fast-or-nonfast"):
            assert variants[base + suffix]["separate_lane_required"] is False
        for base in ("gauna-or-vaishnava-date", "named-temple-liturgy", "other-named-ekadashi"):
            assert variants[base + suffix]["separate_lane_required"] is True
    assert shapes[0] == shapes[1]

    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in (
        "a non-fasting, no-flame, no-purchase, image-free and material-free form is complete",
        "never copy lumpaka's hunger, cold exposure, faintness, forest isolation or sleeplessness",
        "sleep deprivation is not a test of devotion",
        "do not leave fruit under public trees",
        "does not replace accountability, restitution, law or safeguarding",
        "no success, wealth, kingdom, family, health, forgiveness, merit, liberation",
    ):
        assert term in english
    hindi = json.dumps(localized["hi"], ensure_ascii=False)
    for term in (
        "बिना उपवास, लौ, खरीद, चित्र और सामग्री का रूप पूर्ण है",
        "भूख, ठंड, बेहोशी, वन-एकांत या नींद-रहित अवस्था",
        "नींद से वंचित होना भक्ति की परीक्षा नहीं है",
        "सार्वजनिक वृक्ष के नीचे फल न छोड़ें",
        "जवाबदेही, प्रतिपूर्ति, कानून या सुरक्षा का विकल्प नहीं",
        "सफलता, धन, राज्य, परिवार, स्वास्थ्य, क्षमा, पुण्य, मुक्ति",
    ):
        assert term in hindi

    raw = SAPHALA_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "सफला एकादशी".encode("utf-8") in raw
    assert SAPHALA_PACK.stat().st_size < 100_000


def test_pausha_putrada_pack_link_and_progress_are_valid():
    ritual_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    pack = load(PAUSHA_PUTRADA_PACK)
    Draft202012Validator(ritual_schema).validate(pack)
    assert pack["lane_id"] == "pausha-putrada-ekadashi-north-west-smarta-household-2027-v1"
    assert pack["observance_slugs"] == ["pausha-putrada-ekadashi"]
    assert pack["product_status"]["classification"] == "user_complete_lane"
    assert all(pack["product_status"]["completed_dimensions"].values())
    source_ids = {source["source_id"] for source in pack["sources"]}
    assert len(source_ids) == len(pack["sources"]) >= 8
    refs = []

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    refs.extend(child)
                else:
                    walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)
    assert set(refs) <= source_ids

    links = load(PAUSHA_PUTRADA_LINK)
    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    Draft202012Validator(link_schema).validate(links)
    proposal = links["proposals"][0]
    assert proposal["to_ref"]["lane_local_id"] == (
        "story/padma-purana-putrada-suketumat-campaka-source-context"
    )
    assert proposal["target_resolution"] == "unresolved_owner_lane"
    assert proposal["predicate"] == (
        "requests_full_source_labelled_putrada_suketumat_campaka_context"
    )

    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49
    assert progress["remaining_authoring_items"] == 159
    assert progress["completed_lane_ids"].count(pack["lane_id"]) == 1


def test_pausha_putrada_is_bilingual_equal_worth_crisis_safe_and_materially_split():
    pack = load(PAUSHA_PUTRADA_PACK)
    calendar = pack["calendar"]
    assert calendar["location_aware"] is True
    assert calendar["tradition_aware"] is True
    assert calendar["live_schedule_required"] is True
    assert "Monday 18 January" in calendar["freshness_note"]
    assert "Tuesday 19 January" in calendar["freshness_note"]
    assert "different authority lane" in calendar["freshness_note"]

    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    shapes = []
    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 1
        assert len(entry["typical_practices"]) == 2
        assert all(not story["universal_origin_claimed"] for story in entry["origin_narratives"])
        procedures = {procedure["tier"]: procedure for procedure in entry["procedures"]}
        assert set(procedures) == {"minimum", "standard", "elaborate"}
        shape = [
            (tier, len(procedures[tier]["materials"]), len(procedures[tier]["steps"]))
            for tier in ("minimum", "standard", "elaborate")
        ]
        assert shape == [("minimum", 2, 7), ("standard", 2, 5), ("elaborate", 1, 4)]
        shapes.append(shape)
        variants = {variant["variant_id"]: variant for variant in entry["variants"]}
        suffix = "-hi" if entry["language_code"] == "hi" else ""
        assert variants["language-material-image-and-family-form" + suffix]["separate_lane_required"] is False
        for base in (
            "gauna-or-vaishnava-next-day",
            "fertility-or-priest-led-rite",
            "named-temple-programme",
            "shravana-putrada-ekadashi",
        ):
            assert variants[base + suffix]["separate_lane_required"] is True
    assert shapes[0] == shapes[1]

    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in (
        "daughters and children of every gender have equal worth",
        "is not sin, deficient devotion, family failure or unpaid ancestral debt",
        "never pressure anyone to conceive",
        "cannot diagnose infertility, ensure conception, determine a child's sex",
        "call 112",
        "tele-manas lists 14416 and 1800-89-14416",
        "no son, child, conception, child's sex",
    ):
        assert term in english
    hindi = json.dumps(localized["hi"], ensure_ascii=False)
    for term in (
        "बेटियों और हर लिंग के बच्चों का समान मूल्य है",
        "निस्संतानता, बांझपन, गर्भ-हानि",
        "किसी पर गर्भधारण",
        "बांझपन का निदान, गर्भधारण, बच्चे का लिंग",
        "112 पर कॉल करें",
        "Tele-MANAS 14416 और 1800-89-14416",
        "पुत्र, बच्चा, गर्भधारण, बच्चे का लिंग",
    ):
        assert term in hindi

    raw = PAUSHA_PUTRADA_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "पौष पुत्रदा एकादशी".encode("utf-8") in raw
    assert PAUSHA_PUTRADA_PACK.stat().st_size < 100_000


def test_shattila_pack_link_and_progress_are_valid():
    ritual_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    pack = load(SHATTILA_PACK)
    Draft202012Validator(ritual_schema).validate(pack)
    assert pack["lane_id"] == "shattila-ekadashi-north-west-smarta-household-2027-v1"
    assert pack["observance_slugs"] == ["shattila-ekadashi"]
    assert pack["product_status"]["classification"] == "user_complete_lane"
    assert all(pack["product_status"]["completed_dimensions"].values())
    source_ids = {source["source_id"] for source in pack["sources"]}
    assert len(source_ids) == len(pack["sources"]) >= 7
    refs = []

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    refs.extend(child)
                else:
                    walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)
    assert set(refs) <= source_ids

    links = load(SHATTILA_LINK)
    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    Draft202012Validator(link_schema).validate(links)
    proposal = links["proposals"][0]
    assert proposal["to_ref"]["lane_local_id"] == (
        "story/padma-purana-shattila-unnamed-woman-source-context"
    )
    assert proposal["target_resolution"] == "unresolved_owner_lane"
    assert proposal["predicate"] == (
        "requests_full_source_labelled_shattila_unnamed_woman_context"
    )

    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49
    assert progress["remaining_authoring_items"] == 159
    assert progress["completed_lane_ids"].count(pack["lane_id"]) == 1


def test_shattila_is_bilingual_sesame_safe_and_major_variant_bounded():
    pack = load(SHATTILA_PACK)
    calendar = pack["calendar"]
    assert calendar["location_aware"] is True
    assert calendar["tradition_aware"] is True
    assert calendar["live_schedule_required"] is True
    assert "Tuesday 2 February 2027" in calendar["freshness_note"]
    assert "Sattila and Shat Tila are searchable aliases" in calendar["freshness_note"]

    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    shapes = []
    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 1
        assert len(entry["typical_practices"]) == 2
        assert all(not story["universal_origin_claimed"] for story in entry["origin_narratives"])
        procedures = {procedure["tier"]: procedure for procedure in entry["procedures"]}
        assert set(procedures) == {"minimum", "standard", "elaborate"}
        shape = [
            (tier, len(procedures[tier]["materials"]), len(procedures[tier]["steps"]))
            for tier in ("minimum", "standard", "elaborate")
        ]
        assert shape == [("minimum", 2, 7), ("standard", 2, 5), ("elaborate", 1, 4)]
        shapes.append(shape)
        variants = {variant["variant_id"]: variant for variant in entry["variants"]}
        suffix = "-hi" if entry["language_code"] == "hi" else ""
        assert variants["name-language-sesame-and-household-form" + suffix]["separate_lane_required"] is False
        for base in (
            "formal-six-sesame-body-fire-rite",
            "formal-recipient-and-gift-hierarchy",
            "named-temple-programme",
            "other-named-ekadashi",
        ):
            assert variants[base + suffix]["separate_lane_required"] is True
    assert shapes[0] == shapes[1]

    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in (
        "a sesame-free, non-fasting, no-flame, no-purchase, image-free and material-free form is complete",
        "sesame and sesame products are food allergens",
        "skin application is not an allergy test",
        "six sesame uses are a textual list, not six mandatory consumer steps",
        "bodily mortification is not a model",
        "charity must not cause debt",
        "no absolution, heaven, beauty, grain, clothing, wealth, health",
    ):
        assert term in english
    hindi = json.dumps(localized["hi"], ensure_ascii=False)
    for term in (
        "तिल-रहित, बिना उपवास, लौ, खरीद, चित्र और सामग्री का रूप पूर्ण है",
        "तिल और तिल-उत्पाद खाद्य एलर्जेन हैं",
        "त्वचा-लेप एलर्जी-परीक्षण नहीं है",
        "तिल के छह उपयोग ग्रंथ-सूची हैं",
        "शरीर-कष्ट आदर्श नहीं",
        "दान से कर्ज न हो",
        "पाप-मुक्ति, स्वर्ग, सौंदर्य, अन्न, वस्त्र, धन, स्वास्थ्य",
    ):
        assert term in hindi

    raw = SHATTILA_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "षटतिला एकादशी".encode("utf-8") in raw
    assert SHATTILA_PACK.stat().st_size < 100_000


def test_jaya_pack_link_and_progress_are_valid():
    ritual_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    pack = load(JAYA_PACK)
    Draft202012Validator(ritual_schema).validate(pack)
    assert pack["lane_id"] == "jaya-ekadashi-north-west-smarta-household-2027-v1"
    assert pack["observance_slugs"] == ["jaya-ekadashi"]
    assert pack["product_status"]["classification"] == "user_complete_lane"
    assert all(pack["product_status"]["completed_dimensions"].values())
    source_ids = {source["source_id"] for source in pack["sources"]}
    assert len(source_ids) == len(pack["sources"]) >= 6
    refs = []

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    refs.extend(child)
                else:
                    walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)
    assert set(refs) <= source_ids

    links = load(JAYA_LINK)
    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    Draft202012Validator(link_schema).validate(links)
    proposal = links["proposals"][0]
    assert proposal["to_ref"]["lane_local_id"] == (
        "story/padma-purana-jaya-malyavat-pushpavati-source-context"
    )
    assert proposal["target_resolution"] == "unresolved_owner_lane"
    assert proposal["predicate"] == (
        "requests_full_source_labelled_jaya_malyavat_pushpavati_context"
    )

    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49
    assert progress["remaining_authoring_items"] == 159
    assert progress["completed_lane_ids"].count(pack["lane_id"]) == 1
    assert progress["completed_pack_refs"].count(
        "knowledge_packs/library_lanes/ritual-calendar/packs/"
        "jaya-ekadashi-north-west-smarta-household-2027-v1.json"
    ) == 1


def test_jaya_is_bilingual_safe_and_only_major_variants_split():
    pack = load(JAYA_PACK)
    calendar = pack["calendar"]
    assert calendar["location_aware"] is True
    assert calendar["tradition_aware"] is True
    assert calendar["live_schedule_required"] is True
    assert "Wednesday 17 February 2027" in calendar["freshness_note"]
    assert "same date does not prove the same story" in calendar["freshness_note"]

    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    shapes = []
    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 1
        assert len(entry["typical_practices"]) == 2
        assert all(not story["universal_origin_claimed"] for story in entry["origin_narratives"])
        procedures = {procedure["tier"]: procedure for procedure in entry["procedures"]}
        assert set(procedures) == {"minimum", "standard", "elaborate"}
        shape = [
            (tier, len(procedures[tier]["materials"]), len(procedures[tier]["steps"]))
            for tier in ("minimum", "standard", "elaborate")
        ]
        assert shape == [("minimum", 2, 7), ("standard", 2, 5), ("elaborate", 1, 4)]
        shapes.append(shape)
        variants = {variant["variant_id"]: variant for variant in entry["variants"]}
        suffix = "-hi" if entry["language_code"] == "hi" else ""
        assert variants["language-material-music-and-household-form" + suffix][
            "separate_lane_required"
        ] is False
        for base in (
            "bhaimi-or-named-vaishnava-authority",
            "formal-fast-vigil-or-parana",
            "curse-possession-or-exorcism",
            "named-temple-programme",
            "other-named-ekadashi",
        ):
            assert variants[base + suffix]["separate_lane_required"] is True
    assert shapes[0] == shapes[1]

    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in (
        "a warm, rested, non-fasting, no-touch, no-flame, no-purchase, image-free and material-free form is complete",
        "attraction, consensual affection, sexuality and a performance mistake are not treated as sin",
        "objectifying body inventory is omitted",
        "cannot justify restraint, beating, isolation, forced fasting, medication withdrawal or exorcism",
        "does not require silence, forgiveness, reconciliation, or return to an unsafe leader",
        "no absolution, purification, supernatural transformation, curse removal",
    ):
        assert term in english
    for forbidden in (
        "must fast",
        "must stay awake",
        "must embrace",
        "attraction is sin",
        "performance error is sin",
        "you should diagnose possession",
        "you should perform exorcism",
        "curse removal is guaranteed",
    ):
        assert forbidden not in english

    hindi = json.dumps(localized["hi"], ensure_ascii=False)
    for term in (
        "गर्म, विश्रामयुक्त, बिना उपवास, स्पर्श, लौ, खरीद, चित्र और सामग्री का रूप पूर्ण है",
        "आपसी आकर्षण, सहमति-युक्त स्नेह, यौनिकता और प्रस्तुति-त्रुटि को यह मार्ग पाप नहीं मानता",
        "दवा रोकना या झाड़-फूँक उचित नहीं होते",
        "क्षमा, मेल-मिलाप या असुरक्षित नेता, कार्यस्थल या संबंध में लौटना अनिवार्य नहीं करता",
    ):
        assert term in hindi

    raw = JAYA_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "जया एकादशी".encode("utf-8") in raw
    assert JAYA_PACK.stat().st_size < 100_000


def test_vijaya_pack_links_and_progress_are_valid():
    ritual_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    pack = load(VIJAYA_PACK)
    Draft202012Validator(ritual_schema).validate(pack)
    assert pack["lane_id"] == "vijaya-ekadashi-north-west-smarta-household-2027-v1"
    assert pack["observance_slugs"] == ["vijaya-ekadashi"]
    assert pack["product_status"]["classification"] == "user_complete_lane"
    assert all(pack["product_status"]["completed_dimensions"].values())
    source_ids = {source["source_id"] for source in pack["sources"]}
    assert len(source_ids) == len(pack["sources"]) >= 8
    refs = []

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    refs.extend(child)
                else:
                    walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)
    assert set(refs) <= source_ids

    links = load(VIJAYA_LINKS)
    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    Draft202012Validator(link_schema).validate(links)
    assert len(links["proposals"]) == 2
    story, pankoddhar = links["proposals"]
    assert story["to_ref"]["lane_local_id"] == (
        "story/padma-purana-vijaya-rama-bakadalbhya-source-context"
    )
    assert story["target_resolution"] == "unresolved_owner_lane"
    assert pankoddhar["to_ref"]["lane_local_id"] == (
        "place/sri-lokanath-temple-puri-pankoddhar-observance"
    )
    assert pankoddhar["predicate"] == (
        "routes_pankoddhar_to_live_sri_lokanath_institution_context"
    )
    assert pankoddhar["target_resolution"] == "unresolved_owner_lane"

    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49
    assert progress["remaining_authoring_items"] == 159
    assert progress["completed_lane_ids"].count(pack["lane_id"]) == 1
    assert progress["completed_pack_refs"].count(
        "knowledge_packs/library_lanes/ritual-calendar/packs/"
        "vijaya-ekadashi-north-west-smarta-household-2027-v1.json"
    ) == 1
    assert progress["open_denominator_correction_refs"] == [
        "knowledge_packs/library_lanes/ritual-calendar/inventory/"
        "ritual-calendar-denominator-correction-candidates-v1.json"
    ]
    corrections = load(DENOMINATOR_CORRECTIONS)
    assert corrections["frozen_accepted_authoring_denominator"] == 208
    assert len(corrections["correction_candidates"]) == 1
    correction = corrections["correction_candidates"][0]
    assert correction["evidence_result"] == "prior_alias_assumption_contradicted"
    assert correction["proposed_count_effect_if_accepted"] == 1
    assert correction["current_count_effect"] == 0
    assert pack["lane_id"] in correction["not_completed_by_lane_ids"]


def test_vijaya_is_bilingual_water_safe_and_only_major_variants_split():
    pack = load(VIJAYA_PACK)
    assert "Thursday 4 March 2027" in pack["calendar"]["freshness_note"]
    assert pack["calendar"]["location_aware"] is True
    assert pack["calendar"]["tradition_aware"] is True
    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    shapes = []
    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 1
        assert len(entry["typical_practices"]) == 2
        assert all(not story["universal_origin_claimed"] for story in entry["origin_narratives"])
        procedures = {procedure["tier"]: procedure for procedure in entry["procedures"]}
        assert set(procedures) == {"minimum", "standard", "elaborate"}
        shape = [
            (tier, len(procedures[tier]["materials"]), len(procedures[tier]["steps"]))
            for tier in ("minimum", "standard", "elaborate")
        ]
        assert shape == [("minimum", 2, 7), ("standard", 2, 5), ("elaborate", 1, 4)]
        shapes.append(shape)
        variants = {variant["variant_id"]: variant for variant in entry["variants"]}
        suffix = "-hi" if entry["language_code"] == "hi" else ""
        assert variants["language-material-and-household-form" + suffix][
            "separate_lane_required"
        ] is False
        for base in (
            "formal-pitcher-grain-vigil-river-gift-rite",
            "gauna-or-vaishnava-authority",
            "pankoddhar-sri-lokanath-puri",
            "named-temple-programme",
            "other-named-ekadashi",
        ):
            assert variants[base + suffix]["separate_lane_required"] is True
    assert shapes[0] == shapes[1]

    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in (
        "a non-fasting, well-rested, no-flame, no-water-visit, no-purchase, image-free and material-free form is complete",
        "sita's abduction is violence against her",
        "not instructions to identify a human enemy",
        "not universal household steps",
        "do not enter a river, stream, sea, pond, ghat or sanctum",
        "giving is voluntary, affordable, useful and consent-based",
        "no victory, recovery, release, profit, exam result, legal outcome",
    ):
        assert term in english
    for forbidden in (
        "you must fast",
        "you must keep awake",
        "immerse the pitcher",
        "identify your enemy",
        "defeat your enemy",
        "victory is guaranteed",
        "sita was responsible",
    ):
        assert forbidden not in english

    hindi = json.dumps(localized["hi"], ensure_ascii=False)
    for term in (
        "बिना उपवास, विश्रामयुक्त, बिना लौ, जल-यात्रा, खरीद, चित्र और सामग्री का रूप पूर्ण है",
        "सीता का अपहरण उनके विरुद्ध हिंसा है",
        "किसी मनुष्य को शत्रु कहना",
        "कोई सामग्री विसर्जित या परित्यक्त न करें",
        "विजय, इलाज, मुक्ति, लाभ, परीक्षा, मुकदमा",
    ):
        assert term in hindi

    raw = VIJAYA_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "विजया एकादशी".encode("utf-8") in raw
    assert VIJAYA_PACK.stat().st_size < 100_000


def test_amalaki_pack_link_and_progress_are_valid():
    ritual_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    pack = load(AMALAKI_PACK)
    Draft202012Validator(ritual_schema).validate(pack)
    assert pack["lane_id"] == "amalaki-ekadashi-north-west-smarta-household-2027-v1"
    assert pack["observance_slugs"] == ["amalaki-ekadashi"]
    assert pack["product_status"]["classification"] == "user_complete_lane"
    assert all(pack["product_status"]["completed_dimensions"].values())
    source_ids = {source["source_id"] for source in pack["sources"]}
    assert len(source_ids) == len(pack["sources"]) >= 8
    refs = []

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    refs.extend(child)
                else:
                    walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)
    assert set(refs) <= source_ids

    links = load(AMALAKI_LINK)
    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    Draft202012Validator(link_schema).validate(links)
    proposal = links["proposals"][0]
    assert proposal["to_ref"]["lane_local_id"] == (
        "story/padma-purana-amalaki-tree-and-formal-vow-source-context"
    )
    assert proposal["predicate"] == (
        "requests_full_source_labelled_amalaki_tree_and_formal_vow_context"
    )
    assert proposal["target_resolution"] == "unresolved_owner_lane"

    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49
    assert progress["remaining_authoring_items"] == 159
    assert progress["completed_lane_ids"].count(pack["lane_id"]) == 1
    assert progress["completed_pack_refs"].count(
        "knowledge_packs/library_lanes/ritual-calendar/packs/"
        "amalaki-ekadashi-north-west-smarta-household-2027-v1.json"
    ) == 1
    assert progress["open_denominator_correction_refs"] == [
        "knowledge_packs/library_lanes/ritual-calendar/inventory/"
        "ritual-calendar-denominator-correction-candidates-v1.json"
    ]


def test_amalaki_is_bilingual_tree_safe_and_only_major_variants_split():
    pack = load(AMALAKI_PACK)
    assert "Thursday 18 March 2027" in pack["calendar"]["freshness_note"]
    assert pack["calendar"]["location_aware"] is True
    assert pack["calendar"]["tradition_aware"] is True
    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    shapes = []
    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 1
        assert len(entry["typical_practices"]) == 2
        assert all(not story["universal_origin_claimed"] for story in entry["origin_narratives"])
        procedures = {procedure["tier"]: procedure for procedure in entry["procedures"]}
        assert set(procedures) == {"minimum", "standard", "elaborate"}
        shape = [
            (tier, len(procedures[tier]["materials"]), len(procedures[tier]["steps"]))
            for tier in ("minimum", "standard", "elaborate")
        ]
        assert shape == [("minimum", 2, 7), ("standard", 2, 5), ("elaborate", 1, 4)]
        shapes.append(shape)
        variants = {variant["variant_id"]: variant for variant in entry["variants"]}
        suffix = "-hi" if entry["language_code"] == "hi" else ""
        assert variants["language-fruit-image-and-household-form" + suffix][
            "separate_lane_required"
        ] is False
        for base in (
            "formal-tree-parashurama-image-vigil-gift-rite",
            "gauna-vaishnava-or-dvadashi-pushya-authority",
            "named-tree-site-or-temple-programme",
            "hunter-king-vasuratha-story-expression",
            "other-named-ekadashi",
        ):
            assert variants[base + suffix]["separate_lane_required"] is True
    assert shapes[0] == shapes[1]

    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in (
        "a no-tree, no-fruit, non-fasting, well-rested, no-flame, no-purchase, image-free and material-free form is complete",
        "source theology, not botanical, historical or medical fact",
        "do not shun, label or deny ordinary care",
        "not universal household steps",
        "do not enter private or hazardous land",
        "amla fruit is optional food, not medicine here",
        "no cure, immunity, longevity, sin removal, wealth",
        "hunter/king vasuratha story is not present",
    ):
        assert term in english
    for forbidden in (
        "you must fast",
        "you must stay awake",
        "tie thread around the tree",
        "light lamps around the tree",
        "amla cures",
        "amla prevents disease",
        "shun heretics",
        "a hunter observed the vow",
    ):
        assert forbidden not in english

    hindi = json.dumps(localized["hi"], ensure_ascii=False)
    for term in (
        "बिना वृक्ष, फल, उपवास, जागरण, लौ, खरीद, चित्र और सामग्री का रूप पूर्ण है",
        "वनस्पति, इतिहास या चिकित्सा-तथ्य नहीं",
        "सामान्य देखभाल/भोजन/सेवा/गरिमा से वंचित न करें",
        "आँवला वैकल्पिक भोजन है, यहाँ दवा नहीं",
        "इलाज, प्रतिरक्षा, आयु, पाप-नाश, धन",
    ):
        assert term in hindi

    raw = AMALAKI_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "आमलकी एकादशी".encode("utf-8") in raw
    assert AMALAKI_PACK.stat().st_size < 100_000


def test_papamochani_pack_link_and_progress_are_valid():
    ritual_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    pack = load(PAPAMOCHANI_PACK)
    Draft202012Validator(ritual_schema).validate(pack)
    assert pack["lane_id"] == "papamochani-ekadashi-north-west-smarta-household-2027-v1"
    assert pack["observance_slugs"] == ["papamochani-ekadashi"]
    assert pack["product_status"]["classification"] == "user_complete_lane"
    assert all(pack["product_status"]["completed_dimensions"].values())
    source_ids = {source["source_id"] for source in pack["sources"]}
    assert len(source_ids) == len(pack["sources"]) >= 7
    refs = []

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    refs.extend(child)
                else:
                    walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)
    assert set(refs) <= source_ids

    links = load(PAPAMOCHANI_LINK)
    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    Draft202012Validator(link_schema).validate(links)
    proposal = links["proposals"][0]
    assert proposal["to_ref"]["lane_local_id"] == (
        "story/padma-purana-papamochani-manjughosha-medhavin-source-context"
    )
    assert proposal["predicate"] == (
        "requests_full_source_labelled_papamochani_manjughosha_medhavin_context"
    )
    assert proposal["target_resolution"] == "unresolved_owner_lane"

    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49
    assert progress["remaining_authoring_items"] == 159
    assert progress["completed_lane_ids"].count(pack["lane_id"]) == 1
    assert progress["completed_pack_refs"].count(
        "knowledge_packs/library_lanes/ritual-calendar/packs/"
        "papamochani-ekadashi-north-west-smarta-household-2027-v1.json"
    ) == 1
    assert len(progress["open_denominator_correction_refs"]) == 1


def test_papamochani_is_bilingual_consent_safe_and_major_variant_bounded():
    pack = load(PAPAMOCHANI_PACK)
    assert "Friday 2 April 2027" in pack["calendar"]["freshness_note"]
    assert pack["calendar"]["location_aware"] is True
    assert pack["calendar"]["tradition_aware"] is True
    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    shapes = []
    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 1
        assert len(entry["typical_practices"]) == 2
        assert all(not story["universal_origin_claimed"] for story in entry["origin_narratives"])
        procedures = {procedure["tier"]: procedure for procedure in entry["procedures"]}
        assert set(procedures) == {"minimum", "standard", "elaborate"}
        shape = [
            (tier, len(procedures[tier]["materials"]), len(procedures[tier]["steps"]))
            for tier in ("minimum", "standard", "elaborate")
        ]
        assert shape == [("minimum", 2, 7), ("standard", 2, 5), ("elaborate", 1, 4)]
        shapes.append(shape)
        variants = {variant["variant_id"]: variant for variant in entry["variants"]}
        suffix = "-hi" if entry["language_code"] == "hi" else ""
        assert variants["language-image-writing-and-household-form" + suffix][
            "separate_lane_required"
        ] is False
        for base in (
            "formal-expiation-confession-or-restitution-rite",
            "gauna-or-vaishnava-authority",
            "curse-possession-or-exorcism",
            "named-temple-programme",
            "qualified-professional-support",
            "other-named-ekadashi",
        ):
            assert variants[base + suffix]["separate_lane_required"] is True
    assert shapes[0] == shapes[1]

    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in (
        "a private, non-fasting, well-rested, no-touch, no-flame, no-purchase, image-free, writing-free and material-free form is complete",
        "attraction, consensual affection, sexuality, music and a woman's body are not sin or pollution",
        "fear of curse, punishment, authority, exposure or retaliation undermines free choice",
        "prior intimacy is not permanent consent",
        "cannot diagnose possession, curse, mental illness",
        "no public confession, names, sexual details or allegation investigation is required",
        "serious harm, abuse, coercion, assault, exploitation, theft or misconduct is not erased",
        "no sin removal, curse release, restored merit, heaven, purity, acquittal",
    ):
        assert term in english
    for forbidden in (
        "women are temptresses",
        "sexuality is sin",
        "she deserved the curse",
        "consent cannot be withdrawn",
        "you must confess",
        "you should perform exorcism",
        "ritual erases the crime",
        "forgiveness is guaranteed",
    ):
        assert forbidden not in english

    hindi = json.dumps(localized["hi"], ensure_ascii=False)
    for term in (
        "निजी, बिना उपवास, विश्रामयुक्त, बिना स्पर्श, लौ, खरीद, चित्र, लेखन और सामग्री का रूप पूर्ण है",
        "आकर्षण, सहमति-युक्त स्नेह, यौनिकता, संगीत और स्त्री का शरीर पाप या अशुद्धि नहीं",
        "पहले की निकटता स्थायी सहमति नहीं",
        "जबरन उपवास, दवा रोकना या झाड़-फूँक न करें",
        "गंभीर हानि, दुर्व्यवहार, दबाव, हमला, शोषण, चोरी या दुराचार",
    ):
        assert term in hindi

    raw = PAPAMOCHANI_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "पापमोचनी एकादशी".encode("utf-8") in raw
    assert PAPAMOCHANI_PACK.stat().st_size < 100_000


def test_kamada_pack_link_and_progress_are_valid():
    ritual_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    pack = load(KAMADA_PACK)
    Draft202012Validator(ritual_schema).validate(pack)
    assert pack["lane_id"] == "kamada-ekadashi-north-west-smarta-household-2027-v1"
    assert pack["observance_slugs"] == ["kamada-ekadashi"]
    assert pack["product_status"]["classification"] == "user_complete_lane"
    assert all(pack["product_status"]["completed_dimensions"].values())
    source_ids = {source["source_id"] for source in pack["sources"]}
    assert len(source_ids) == len(pack["sources"]) >= 7
    refs = []

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    refs.extend(child)
                else:
                    walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)
    assert set(refs) <= source_ids

    links = load(KAMADA_LINK)
    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    Draft202012Validator(link_schema).validate(links)
    proposal = links["proposals"][0]
    assert proposal["to_ref"]["lane_local_id"] == (
        "story/padma-purana-kamada-lalita-lalita-source-context"
    )
    assert proposal["predicate"] == (
        "requests_full_source_labelled_kamada_lalita_lalita_context"
    )
    assert proposal["target_resolution"] == "unresolved_owner_lane"

    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49
    assert progress["remaining_authoring_items"] == 159
    assert progress["completed_lane_ids"].count(pack["lane_id"]) == 1
    assert progress["completed_pack_refs"].count(
        "knowledge_packs/library_lanes/ritual-calendar/packs/"
        "kamada-ekadashi-north-west-smarta-household-2027-v1.json"
    ) == 1
    assert len(progress["open_denominator_correction_refs"]) == 1


def test_kamada_is_bilingual_support_safe_and_major_variant_bounded():
    pack = load(KAMADA_PACK)
    assert "Saturday 17 April 2027" in pack["calendar"]["freshness_note"]
    assert pack["calendar"]["decision_rule_id"] == (
        "kamada-shukla-ekadashi-local-smarta-v1"
    )
    assert pack["calendar"]["location_aware"] is True
    assert pack["calendar"]["tradition_aware"] is True
    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    shapes = []
    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 1
        assert len(entry["typical_practices"]) == 2
        assert all(not story["universal_origin_claimed"] for story in entry["origin_narratives"])
        procedures = {procedure["tier"]: procedure for procedure in entry["procedures"]}
        assert set(procedures) == {"minimum", "standard", "elaborate"}
        shape = [
            (tier, len(procedures[tier]["materials"]), len(procedures[tier]["steps"]))
            for tier in ("minimum", "standard", "elaborate")
        ]
        assert shape == [("minimum", 2, 7), ("standard", 2, 5), ("elaborate", 1, 4)]
        shapes.append(shape)
        variants = {variant["variant_id"]: variant for variant in entry["variants"]}
        suffix = "-hi" if entry["language_code"] == "hi" else ""
        assert variants["language-image-writing-and-household-form" + suffix][
            "separate_lane_required"
        ] is False
        formal_id = "formal-vow-or-merit-dedication-" + entry["language_code"]
        assert variants[formal_id]["separate_lane_required"] is True
        for base in (
            "gauna-or-vaishnava-authority",
            "curse-possession-or-exorcism",
            "named-temple-programme",
            "qualified-professional-support",
            "other-named-ekadashi",
        ):
            assert variants[base + suffix]["separate_lane_required"] is True
    assert shapes[0] == shapes[1]

    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in (
        "a private, non-fasting, rested, no-touch, no-flame, no-purchase, image-free, writing-free and material-free form is complete",
        "affection, remembering a loved one and a performance mistake are not sin",
        "the grotesque demon-body inventory is omitted",
        "no spouse, woman, child or carer owes rescue",
        "support requires consent and may be refused or withdrawn",
        "does not diagnose possession, curse, mental illness",
        "do not hide abuse, coercion, exploitation, theft or professional misconduct",
        "is not a guarantee of a chosen person, marriage, pregnancy, cure, wealth",
    ):
        assert term in english
    for forbidden in (
        "you must fast",
        "a wife must save her husband",
        "the curse caused mental illness",
        "perform an exorcism",
        "your desire will be fulfilled",
        "marriage is guaranteed",
        "stay with an unsafe partner",
    ):
        assert forbidden not in english

    hindi = json.dumps(localized["hi"], ensure_ascii=False)
    for term in (
        "कामदा एकादशी: स्वयं को मिटाए बिना सहायता",
        "प्रदर्शन की गलती पाप या अपमान",
        "जीवनसाथी, स्त्री, बच्चा या देखभालकर्ता बचाव",
        "सहायता के लिए सहमति चाहिए",
        "जबरन उपवास, दवा रोकना या झाड़-फूँक न करें",
        "चुना साथी, विवाह, गर्भ, इलाज, धन, नौकरी",
    ):
        assert term in hindi

    raw = KAMADA_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "कामदा एकादशी".encode("utf-8") in raw
    assert b"????? ??????" not in raw
    assert KAMADA_PACK.stat().st_size < 100_000


def test_varuthini_pack_link_progress_and_safety_contract():
    pack = load(VARUTHINI_PACK)
    Draft202012Validator(load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")).validate(pack)
    assert pack["lane_id"] == "varuthini-ekadashi-north-west-smarta-household-2027-v1"
    assert "Sunday 2 May 2027" in pack["calendar"]["freshness_note"]
    source_ids = {source["source_id"] for source in pack["sources"]}
    refs = []

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    refs.extend(child)
                else:
                    walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)
    assert set(refs) <= source_ids
    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    for entry in localized.values():
        assert entry["origin_narratives"][0]["universal_origin_claimed"] is False
        procedures = {item["tier"]: item for item in entry["procedures"]}
        assert [(tier, len(procedures[tier]["materials"]), len(procedures[tier]["steps"])) for tier in ("minimum", "standard", "elaborate")] == [("minimum", 2, 7), ("standard", 2, 5), ("elaborate", 1, 4)]
        variants = entry["variants"]
        assert sum(not item["separate_lane_required"] for item in variants) == 1
        assert all(item["separate_lane_required"] for item in variants[1:])
    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in (
        "a woman, daughter, spouse or any person is not property",
        "do not give, demand, negotiate, hide or facilitate dowry",
        "the reviewed chapter contains no bear attack, lost leg or bodily restoration story",
        "a gift creates no debt",
        "normally fed, hydrated, rested",
        "no protection, good fortune, desired object",
    ):
        assert term in english
    for forbidden in ("you must fast", "a daughter is a gift", "dowry is permitted", "the bear restored his leg", "protection is guaranteed"):
        assert forbidden not in english
    raw = VARUTHINI_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "वरूथिनी एकादशी".encode("utf-8") in raw
    assert VARUTHINI_PACK.stat().st_size < 100_000

    links = load(VARUTHINI_LINK)
    Draft202012Validator(load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")).validate(links)
    proposal = links["proposals"][0]
    assert proposal["target_resolution"] == "unresolved_owner_lane"
    assert "claims-gifts-restrictions" in proposal["to_ref"]["lane_local_id"]
    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49
    assert progress["remaining_authoring_items"] == 159
    assert progress["completed_lane_ids"].count(pack["lane_id"]) == 1


def test_mohini_pack_link_progress_and_adversarial_contract():
    pack = load(MOHINI_PACK)
    Draft202012Validator(load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")).validate(pack)
    assert pack["lane_id"] == "mohini-ekadashi-north-west-smarta-household-2027-v1"
    assert pack["observance_slugs"] == ["mohini-ekadashi"]
    assert "Sunday 16 May 2027" in pack["calendar"]["freshness_note"]
    assert "bright half" in pack["calendar"]["freshness_note"]
    assert "dark-half" in pack["calendar"]["freshness_note"]
    source_ids = {source["source_id"] for source in pack["sources"]}
    refs = []

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    refs.extend(child)
                else:
                    walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)
    assert set(refs) <= source_ids
    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    for entry in localized.values():
        assert entry["origin_narratives"][0]["universal_origin_claimed"] is False
        procedures = {item["tier"]: item for item in entry["procedures"]}
        assert [(tier, len(procedures[tier]["materials"]), len(procedures[tier]["steps"])) for tier in ("minimum", "standard", "elaborate")] == [("minimum", 2, 7), ("standard", 2, 5), ("elaborate", 1, 4)]
        assert sum(not item["separate_lane_required"] for item in entry["variants"]) == 1
        assert all(item["separate_lane_required"] for item in entry["variants"][1:])
    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in (
        "adult consensual sexuality and sex workers are not impurity",
        "never bind, beat, whip, starve, strip, isolate, expel",
        "garment contact is a source event, not absolution or treatment",
        "do not approach wildlife, enter forests, carry weapons or reproduce hunting",
        "rama's separation grief does not reduce sita's experience",
        "no sin removal, absolution, purity, divine body, recovery",
        "mohini-avatar stories",
    ):
        assert term in english
    for forbidden in (
        "you must fast",
        "touch the sage's garment",
        "sex workers cause sin",
        "whipping corrects wrongdoing",
        "hunt animals",
        "sita should return",
        "absolution is guaranteed",
    ):
        assert forbidden not in english
    raw = MOHINI_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "मोहिनी एकादशी".encode("utf-8") in raw
    assert MOHINI_PACK.stat().st_size < 100_000

    links = load(MOHINI_LINK)
    Draft202012Validator(load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")).validate(links)
    proposal = links["proposals"][0]
    assert proposal["target_resolution"] == "unresolved_owner_lane"
    assert proposal["to_ref"]["lane_local_id"] == "story/padma-purana-mohini-dhrishtabuddhi-source-context"
    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49
    assert progress["remaining_authoring_items"] == 159
    assert progress["completed_lane_ids"].count(pack["lane_id"]) == 1
    assert progress["completed_pack_refs"].count("knowledge_packs/library_lanes/ritual-calendar/packs/mohini-ekadashi-north-west-smarta-household-2027-v1.json") == 1


def test_apara_pack_link_progress_and_adversarial_contract():
    pack = load(APARA_PACK)
    Draft202012Validator(load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")).validate(pack)
    assert pack["lane_id"] == "apara-ekadashi-north-west-smarta-household-2027-v1"
    assert "Tuesday 1 June 2027" in pack["calendar"]["freshness_note"]
    source_ids = {source["source_id"] for source in pack["sources"]}
    refs = []

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    refs.extend(child)
                else:
                    walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)
    assert set(refs) <= source_ids
    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    for entry in localized.values():
        assert entry["origin_narratives"][0]["universal_origin_claimed"] is False
        procedures = {item["tier"]: item for item in entry["procedures"]}
        assert [(tier, len(procedures[tier]["materials"]), len(procedures[tier]["steps"])) for tier in ("minimum", "standard", "elaborate")] == [("minimum", 2, 7), ("standard", 2, 5), ("elaborate", 1, 4)]
        assert sum(not item["separate_lane_required"] for item in entry["variants"]) == 1
        assert all(item["separate_lane_required"] for item in entry["variants"][1:])
    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in (
        "mahatmya catalogue, not a developed character story",
        "never ask about pregnancy, abortion, miscarriage, fertility",
        "do not rank dignity by caste, occupation, military service",
        "do not silence complaints, whistleblowing, review, disagreement",
        "do not accuse a doctor, astrologer, teacher, merchant, witness",
        "serious violence, killing, false testimony, fraud or professional misconduct is not erased",
        "chapter 50 contains no developed origin story",
        "no sin removal, acquittal, professional licence or clearance",
    ):
        assert term in english
    for forbidden in (
        "you must fast",
        "abortion is always a sin",
        "a kshatriya must fight",
        "never criticise a teacher",
        "this doctor is fraudulent",
        "confess your pregnancy",
        "ritual erases fraud",
    ):
        assert forbidden not in english
    raw = APARA_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "अपरा एकादशी".encode("utf-8") in raw
    assert APARA_PACK.stat().st_size < 100_000

    links = load(APARA_LINK)
    Draft202012Validator(load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")).validate(links)
    proposal = links["proposals"][0]
    assert proposal["target_resolution"] == "unresolved_owner_lane"
    assert proposal["to_ref"]["lane_local_id"] == "story/padma-purana-apara-mahatmya-list-source-context"
    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49
    assert progress["remaining_authoring_items"] == 159
    assert progress["completed_lane_ids"].count(pack["lane_id"]) == 1
    assert progress["completed_pack_refs"].count("knowledge_packs/library_lanes/ritual-calendar/packs/apara-ekadashi-north-west-smarta-household-2027-v1.json") == 1


def test_nirjala_pack_link_progress_and_adversarial_contract():
    pack = load(NIRJALA_PACK)
    Draft202012Validator(load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")).validate(pack)
    assert pack["lane_id"] == "nirjala-ekadashi-north-west-smarta-household-2027-v1"
    assert "Monday 14 June 2027" in pack["calendar"]["freshness_note"]
    source_ids = {source["source_id"] for source in pack["sources"]}
    refs = []

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    refs.extend(child)
                else:
                    walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)
    assert set(refs) <= source_ids
    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    for entry in localized.values():
        assert entry["origin_narratives"][0]["universal_origin_claimed"] is False
        procedures = {item["tier"]: item for item in entry["procedures"]}
        assert [(tier, len(procedures[tier]["materials"]), len(procedures[tier]["steps"])) for tier in ("minimum", "standard", "elaborate")] == [("minimum", 2, 7), ("standard", 2, 5), ("elaborate", 1, 4)]
        assert sum(not item["separate_lane_required"] for item in entry["variants"]) == 1
        assert all(item["separate_lane_required"] for item in entry["variants"][1:])
    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in (
        "do not undertake a waterless fast from this guide",
        "bhima says yudhishthira, kunti, draupadi, arjuna, nakula and sahadeva fast",
        "never withhold water, food, breastmilk or infant feeding",
        "do not demand fasting proof or monitor another person's intake",
        "bhima's strength, appetite and family do not create",
        "pandava dwadashi is source context here, not a duplicated observance lane",
        "no yearly-ekadashi equivalence, health, fertility, sons, wealth",
        "complete ordinary form is non-fasting, fed, hydrated, rested",
    ):
        assert term in english
    for forbidden in (
        "you must fast",
        "do not drink water",
        "skip your medicine",
        "prove your fast",
        "sons are guaranteed",
        "hell is certain",
        "pandava dwadashi household procedure",
    ):
        assert forbidden not in english
    raw = NIRJALA_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "निर्जला एकादशी".encode("utf-8") in raw
    assert NIRJALA_PACK.stat().st_size < 100_000

    links = load(NIRJALA_LINK)
    Draft202012Validator(load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")).validate(links)
    proposal = links["proposals"][0]
    assert proposal["target_resolution"] == "unresolved_owner_lane"
    assert proposal["to_ref"]["lane_local_id"] == "story/padma-purana-nirjala-bhima-vyasa-source-context"
    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49
    assert progress["remaining_authoring_items"] == 159
    assert progress["completed_lane_ids"].count(pack["lane_id"]) == 1
    assert progress["completed_pack_refs"].count("knowledge_packs/library_lanes/ritual-calendar/packs/nirjala-ekadashi-north-west-smarta-household-2027-v1.json") == 1


def test_yogini_pack_link_progress_and_adversarial_contract():
    pack = load(YOGINI_PACK)
    Draft202012Validator(load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")).validate(pack)
    assert pack["lane_id"] == "yogini-ekadashi-north-west-smarta-household-2027-v1"
    assert "Wednesday 30 June 2027" in pack["calendar"]["freshness_note"]
    source_ids = {source["source_id"] for source in pack["sources"]}
    refs = []

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    refs.extend(child)
                else:
                    walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)
    assert set(refs) <= source_ids
    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    for entry in localized.values():
        assert entry["origin_narratives"][0]["universal_origin_claimed"] is False
        procedures = {item["tier"]: item for item in entry["procedures"]}
        assert [(tier, len(procedures[tier]["materials"]), len(procedures[tier]["steps"])) for tier in ("minimum", "standard", "elaborate")] == [("minimum", 2, 7), ("standard", 2, 5), ("elaborate", 1, 4)]
        assert sum(not item["separate_lane_required"] for item in entry["variants"]) == 1
        assert all(item["separate_lane_required"] for item in entry["variants"][1:])
    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in (
        "leprosy is a disease, not a curse, sexual consequence, sin, impurity or punishment",
        "ritual does not diagnose or cure it",
        "do not blame vishalakshi, a spouse, woman, worker, patient",
        "adult consensual affection is not wrongdoing",
        "a missed responsibility does not justify kubera's insults, curse, separation, expulsion",
        "no one owes confession, employer access to sexual or medical information",
        "no cure, sin removal, purity, restored body, job, relationship",
        "complete ordinary form is non-fasting, fed, hydrated, treated, rested",
    ):
        assert term in english
    for forbidden in (
        "you must fast",
        "leprosy is a curse",
        "vishalakshi caused",
        "kubera was right to expel",
        "inspect the skin",
        "confess to your employer",
        "the vow cures leprosy",
        "merit is guaranteed",
    ):
        assert forbidden not in english
    raw = YOGINI_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "योगिनी एकादशी".encode("utf-8") in raw
    assert YOGINI_PACK.stat().st_size < 100_000

    links = load(YOGINI_LINK)
    Draft202012Validator(load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")).validate(links)
    proposal = links["proposals"][0]
    assert proposal["target_resolution"] == "unresolved_owner_lane"
    assert proposal["to_ref"]["lane_local_id"] == "story/padma-purana-yogini-hemamali-kubera-markandeya-source-context"
    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49
    assert progress["remaining_authoring_items"] == 159
    assert progress["completed_lane_ids"].count(pack["lane_id"]) == 1
    assert progress["completed_pack_refs"].count("knowledge_packs/library_lanes/ritual-calendar/packs/yogini-ekadashi-north-west-smarta-household-2027-v1.json") == 1


def test_devshayani_two_component_pack_links_progress_and_adversarial_contract():
    content_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    ordinary = load(DEVSHAYANI_PACK)
    wari = load(ASHADHI_WARI_PACK)
    for pack in (ordinary, wari):
        Draft202012Validator(content_schema).validate(pack)
        source_ids = {source["source_id"] for source in pack["sources"]}
        refs = []

        def walk(value):
            if isinstance(value, dict):
                for key, child in value.items():
                    if key in {"source_ids", "resolution_source_ids"}:
                        refs.extend(child)
                    else:
                        walk(child)
            elif isinstance(value, list):
                for child in value:
                    walk(child)

        walk(pack)
        assert set(refs) <= source_ids
        localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
        assert set(localized) == {"en", "hi"}
        for entry in localized.values():
            assert entry["origin_narratives"][0]["universal_origin_claimed"] is False
            procedures = {item["tier"]: item for item in entry["procedures"]}
            assert [(tier, len(procedures[tier]["materials"]), len(procedures[tier]["steps"])) for tier in ("minimum", "standard", "elaborate")] == [("minimum", 2, 7), ("standard", 2, 5), ("elaborate", 1, 4)]
            assert sum(not item["separate_lane_required"] for item in entry["variants"]) == 1
            assert all(item["separate_lane_required"] for item in entry["variants"][1:])

    assert ordinary["lane_id"] == "devshayani-ekadashi-north-west-smarta-household-2027-v1"
    assert set(ordinary["observance_slugs"]) == {"devshayani-ekadashi", "harishayan-ekadashi"}
    assert "Wednesday 14 July 2027" in ordinary["calendar"]["freshness_note"]
    assert "Kamika" in ordinary["calendar"]["freshness_note"]
    ordinary_en = json.dumps({x["language_code"]: x for x in ordinary["localized_content"]}["en"], ensure_ascii=False).lower()
    for term in (
        "complete ordinary form is non-fasting, fed, hydrated, rested, bed-using",
        "do not remove vegetables, curd, milk, pulses, legumes",
        "do not stay awake, sleep on the ground, stop using a bed, impose celibacy",
        "do not use vamana-bali to justify deceit, pressured consent, land or property taking",
        "vishnu's sleep is source theology, not divine unavailability",
        "do not merge this chapter with onam/mahabali",
        "chapter's two uses of kamika are not silently harmonised",
        "no heaven, salvation, sin removal, purity, sacrificial merit",
    ):
        assert term in ordinary_en
    for forbidden in (
        "you must fast", "avoid vegetables", "give up milk", "sleep on the ground tonight",
        "remain celibate", "bali was evil", "take land by force", "marriages are forbidden",
    ):
        assert forbidden not in ordinary_en

    assert wari["lane_id"] == "ashadhi-ekadashi-maharashtra-varkari-participant-2027-v1"
    assert wari["calendar"]["live_schedule_required"] is True
    assert "reviewed 2025 route is not a 2027 itinerary" in wari["calendar"]["freshness_note"]
    wari_en = json.dumps({x["language_code"]: x for x in wari["localized_content"]}["en"], ensure_ascii=False).lower()
    for term in (
        "complete remote form is fed, hydrated, rested, footwear-using",
        "never copy the reviewed 2025 route into 2027",
        "do not enter the chandrabhaga or bhima river",
        "do not begin long-distance or barefoot walking from this guide",
        "do not press into a dindi, touch a palkhi, block a route",
        "a remote or cancelled form is complete",
        "no darshan, merit, health, success, safety, liberation",
    ):
        assert term in wari_en
    for forbidden in (
        "follow the 2025 route", "bathe in the river", "walk barefoot to pandharpur", "you must join a dindi",
        "touch the palkhi", "darshan is guaranteed", "fast for the wari",
    ):
        assert forbidden not in wari_en

    for path in (DEVSHAYANI_PACK, ASHADHI_WARI_PACK):
        raw = path.read_bytes()
        raw.decode("utf-8", errors="strict")
        assert path.stat().st_size < 100_000
    assert "देवशयनी एकादशी".encode("utf-8") in DEVSHAYANI_PACK.read_bytes()
    assert "आषाढ़ी एकादशी".encode("utf-8") in ASHADHI_WARI_PACK.read_bytes()

    ordinary_links = load(DEVSHAYANI_LINK)
    wari_links = load(ASHADHI_WARI_LINK)
    Draft202012Validator(link_schema).validate(ordinary_links)
    Draft202012Validator(link_schema).validate(wari_links)
    assert ordinary_links["proposals"][0]["target_resolution"] == "unresolved_owner_lane"
    assert ordinary_links["proposals"][0]["to_ref"]["lane_local_id"] == "story/padma-purana-devshayani-vamana-bali-source-context"
    assert wari_links["proposals"][0]["target_resolution"] == "unresolved_owner_lane"
    assert wari_links["proposals"][0]["to_ref"]["lane_local_id"] == "living-tradition/maharashtra-varkari-ashadhi-wari-source-context"

    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49
    assert progress["remaining_authoring_items"] == 159
    assert progress["completed_umbrella_components"]["devshayani-ekadashi-v1"] == [ordinary["lane_id"], wari["lane_id"]]
    for pack in (ordinary, wari):
        assert progress["completed_lane_ids"].count(pack["lane_id"]) == 1
    assert progress["completed_pack_refs"].count("knowledge_packs/library_lanes/ritual-calendar/packs/devshayani-ekadashi-north-west-smarta-household-2027-v1.json") == 1
    assert progress["completed_pack_refs"].count("knowledge_packs/library_lanes/ritual-calendar/packs/ashadhi-ekadashi-maharashtra-varkari-participant-2027-v1.json") == 1


def test_ordinary_kamika_pack_link_progress_and_adversarial_contract():
    content_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    pack = load(KAMIKA_ORDINARY_PACK)
    Draft202012Validator(content_schema).validate(pack)

    assert pack["lane_id"] == "kamika-ekadashi-north-west-smarta-household-2027-v1"
    assert pack["observance_slugs"] == ["kamika-ekadashi"]
    freshness = pack["calendar"]["freshness_note"]
    assert "Thursday 29 July 2027" in freshness
    assert "Friday 30 July 2027" in freshness
    assert "materially separate" in freshness
    assert "chapter 53" in freshness

    source_ids = {source["source_id"] for source in pack["sources"]}
    refs = []

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    refs.extend(child)
                else:
                    walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)
    assert set(refs) <= source_ids
    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    for entry in localized.values():
        assert entry["origin_narratives"][0]["universal_origin_claimed"] is False
        procedures = {item["tier"]: item for item in entry["procedures"]}
        assert [
            (tier, len(procedures[tier]["materials"]), len(procedures[tier]["steps"]))
            for tier in ("minimum", "standard", "elaborate")
        ] == [("minimum", 2, 7), ("standard", 2, 5), ("elaborate", 1, 4)]
        assert sum(not item["separate_lane_required"] for item in entry["variants"]) == 1
        assert all(item["separate_lane_required"] for item in entry["variants"][1:])

    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in (
        "complete ordinary form is non-fasting, fed, hydrated, rested, no-vigil",
        "do not pluck, touch, ingest, apply, sprinkle, plant, buy, water or distribute tulasi",
        "do not stay awake overnight",
        "never ask about pregnancy, abortion, miscarriage, fertility",
        "do not rank dignity by caste",
        "serious killing, violence, abuse or other harm is not erased",
        "contains no developed origin story",
        "no disease removal, bodily purification",
    ):
        assert term in english
    for forbidden in (
        "you must fast",
        "tulasi cures disease",
        "pluck tulasi leaves",
        "light a lamp all night",
        "stay awake all night",
        "abortion is always sin",
        "a brahmana is worth more",
        "ritual erases killing",
    ):
        assert forbidden not in english

    raw = KAMIKA_ORDINARY_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "कामिका एकादशी".encode("utf-8") in raw
    assert KAMIKA_ORDINARY_PACK.stat().st_size < 100_000

    links = load(KAMIKA_ORDINARY_LINK)
    Draft202012Validator(link_schema).validate(links)
    proposal = links["proposals"][0]
    assert proposal["target_resolution"] == "unresolved_owner_lane"
    assert proposal["to_ref"]["lane_local_id"] == "story/padma-purana-kamika-mahatmya-source-context"

    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49
    assert progress["remaining_authoring_items"] == 159
    assert progress["completed_after_freeze"] + progress["remaining_authoring_items"] == 208
    assert progress["completed_lane_ids"].count(pack["lane_id"]) == 1
    assert progress["completed_pack_refs"].count(
        "knowledge_packs/library_lanes/ritual-calendar/packs/kamika-ekadashi-north-west-smarta-household-2027-v1.json"
    ) == 1


def test_gauna_kamika_pack_link_progress_and_adversarial_contract():
    content_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    pack = load(GAUNA_KAMIKA_PACK)
    Draft202012Validator(content_schema).validate(pack)
    assert pack["lane_id"] == "gauna-kamika-ekadashi-india-calendar-authority-2027-v1"
    assert pack["observance_slugs"] == ["gauna-kamika-ekadashi"]
    freshness = pack["calendar"]["freshness_note"]
    assert "ordinary Kamika on Thursday 29 July 2027" in freshness
    assert "Gauna Kamika on Friday 30 July 2027" in freshness
    assert "shared date does not merge authority" in freshness
    assert "publish no portable parana" in freshness

    source_ids = {source["source_id"] for source in pack["sources"]}
    refs = []

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    refs.extend(child)
                else:
                    walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)
    assert set(refs) <= source_ids
    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    for entry in localized.values():
        assert entry["origin_narratives"][0]["universal_origin_claimed"] is False
        procedures = {item["tier"]: item for item in entry["procedures"]}
        assert [
            (tier, len(procedures[tier]["materials"]), len(procedures[tier]["steps"]))
            for tier in ("minimum", "standard", "elaborate")
        ] == [("minimum", 2, 7), ("standard", 2, 5), ("elaborate", 1, 4)]
        assert sum(not item["separate_lane_required"] for item in entry["variants"]) == 1
        assert all(item["separate_lane_required"] for item in entry["variants"][1:])

    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in (
        "accepted local panchang or inherited authority explicitly says gauna kamika",
        "do not substitute ordinary 29 july",
        "same-date vaishnava label is equivalent",
        "begin no fast, food restriction, overnight vigil or parana",
        "no developed origin story and no gauna calculation rule",
        "publish or calculate no parana",
        "complete gauna route is non-fasting, fed, hydrated, rested, no-vigil",
        "never ask about pregnancy, abortion, miscarriage, fertility",
        "do not rank dignity by caste",
        "serious killing, violence, abuse or other harm is not erased",
        "no disease removal, bodily purification",
    ):
        assert term in english
    for forbidden in (
        "choose the later date",
        "gauna and vaishnava are the same authority",
        "you must fast",
        "calculate parana at home",
        "tulasi cures disease",
        "pluck tulasi leaves",
        "light a lamp all night",
        "abortion is always sin",
        "ritual erases killing",
    ):
        assert forbidden not in english

    raw = GAUNA_KAMIKA_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "गौण कामिका".encode("utf-8") in raw
    assert GAUNA_KAMIKA_PACK.stat().st_size < 100_000

    links = load(GAUNA_KAMIKA_LINK)
    Draft202012Validator(link_schema).validate(links)
    proposal = links["proposals"][0]
    assert proposal["target_resolution"] == "unresolved_owner_lane"
    assert proposal["to_ref"]["lane_local_id"] == "story/padma-purana-kamika-mahatmya-source-context"

    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49
    assert progress["remaining_authoring_items"] == 159
    assert progress["completed_after_freeze"] + progress["remaining_authoring_items"] == 208
    assert progress["completed_lane_ids"].count(pack["lane_id"]) == 1
    assert progress["completed_pack_refs"].count(
        "knowledge_packs/library_lanes/ritual-calendar/packs/gauna-kamika-ekadashi-india-calendar-authority-2027-v1.json"
    ) == 1


def test_vaishnava_kamika_router_link_progress_and_adversarial_contract():
    content_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    pack = load(VAISHNAVA_KAMIKA_PACK)
    Draft202012Validator(content_schema).validate(pack)
    assert pack["lane_id"] == "vaishnava-kamika-ekadashi-india-authority-router-2027-v1"
    assert pack["observance_slugs"] == ["vaishnava-kamika-ekadashi"]
    freshness = pack["calendar"]["freshness_note"]
    assert "New Delhi ISKCON-profile fixture" in freshness
    assert "Friday 30 July 2027" in freshness
    assert "ordinary Kamika on 29 July" in freshness
    assert "same discovery date as Gauna Kamika" in freshness
    assert "does not prove every Vaishnava authority" in freshness
    assert "publish no portable date, tithi time, food rule or parana" in freshness

    source_ids = {source["source_id"] for source in pack["sources"]}
    refs = []

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    refs.extend(child)
                else:
                    walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)
    assert set(refs) <= source_ids
    for required_source in (
        "drik-iskcon-vaishnava-kamika-new-delhi-2027",
        "iskcon-official-festival-lunar-calendar",
        "iskcon-gbc-2001-vaishnava-calendar",
        "iskcon-gbc-2013-gcal",
        "iskcon-bangalore-calendar-2026-2027",
        "devam-vaishnava-kamika-research",
    ):
        assert required_source in source_ids
    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    for entry in localized.values():
        assert entry["origin_narratives"][0]["universal_origin_claimed"] is False
        procedures = {item["tier"]: item for item in entry["procedures"]}
        assert [(tier, len(procedures[tier]["materials"]), len(procedures[tier]["steps"])) for tier in ("minimum", "standard", "elaborate")] == [("minimum", 2, 7), ("standard", 2, 5), ("elaborate", 1, 4)]
        assert sum(not item["separate_lane_required"] for item in entry["variants"]) == 1
        assert all(item["separate_lane_required"] for item in entry["variants"][1:])

    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in (
        "name your vaishnava sampradaya, inherited family calendar or institution",
        "does not govern every vaishnava or merge same-date gauna",
        "no developed origin story or generic vaishnava calculation rule",
        "do not generalise it or merge same-date gauna",
        "publish or calculate no parana",
        "iskcon evidence is not universal vaishnava evidence",
        "complete authority-unknown vaishnava fallback is non-fasting, fed, hydrated, rested, no-vigil",
        "do not extend iskcon evidence to every vaishnava community",
        "never ask about pregnancy, abortion, miscarriage, fertility",
        "do not rank dignity by caste",
        "serious killing, violence, abuse or other harm is not erased",
    ):
        assert term in english
    for forbidden in (
        "all vaishnavas must",
        "iskcon rules apply to every vaishnava",
        "choose 30 july",
        "calculate parana at home",
        "you must fast",
        "tulasi cures disease",
        "pluck tulasi leaves",
        "ritual erases killing",
    ):
        assert forbidden not in english

    raw = VAISHNAVA_KAMIKA_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "वैष्णव कामिका".encode("utf-8") in raw
    assert VAISHNAVA_KAMIKA_PACK.stat().st_size < 100_000
    links = load(VAISHNAVA_KAMIKA_LINK)
    Draft202012Validator(link_schema).validate(links)
    proposal = links["proposals"][0]
    assert proposal["target_resolution"] == "unresolved_owner_lane"
    assert proposal["to_ref"]["lane_local_id"] == "story/padma-purana-kamika-mahatmya-source-context"

    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49
    assert progress["remaining_authoring_items"] == 159
    assert progress["completed_after_freeze"] + progress["remaining_authoring_items"] == 208
    assert progress["completed_lane_ids"].count(pack["lane_id"]) == 1
    assert progress["completed_pack_refs"].count("knowledge_packs/library_lanes/ritual-calendar/packs/vaishnava-kamika-ekadashi-india-authority-router-2027-v1.json") == 1


def test_shravana_putrada_pack_link_progress_and_adversarial_contract():
    content_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    pack = load(SHRAVANA_PUTRADA_PACK)
    Draft202012Validator(content_schema).validate(pack)
    assert pack["lane_id"] == "shravana-putrada-ekadashi-north-west-smarta-household-2027-v1"
    assert set(pack["observance_slugs"]) == {"shravana-putrada-ekadashi", "pavitra-ekadashi"}
    freshness = pack["calendar"]["freshness_note"]
    assert "Thursday 12 August 2027" in freshness
    assert "Pavitra alias on the same civil date and paksha/tithi" in freshness
    assert "Do not copy a tithi clock time, parana, formal pavitraka" in freshness

    source_ids = {source["source_id"] for source in pack["sources"]}
    refs = []

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    refs.extend(child)
                else:
                    walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)
    assert set(refs) <= source_ids
    for required_source in (
        "padma-purana-shravana-putrada-deshpande",
        "padma-purana-shravana-putrada-sanskrit",
        "drik-shravana-putrada-pavitra-2027",
        "india-code-mtp-act",
        "icmr-type1-diabetes-fasting",
        "devam-shravana-putrada-research",
    ):
        assert required_source in source_ids

    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    for entry in localized.values():
        assert entry["origin_narratives"][0]["universal_origin_claimed"] is False
        procedures = {item["tier"]: item for item in entry["procedures"]}
        assert [(tier, len(procedures[tier]["materials"]), len(procedures[tier]["steps"])) for tier in ("minimum", "standard", "elaborate")] == [("minimum", 2, 7), ("standard", 2, 5), ("elaborate", 1, 4)]
        assert sum(not item["separate_lane_required"] for item in entry["variants"]) == 1
        assert all(item["separate_lane_required"] for item in entry["variants"][1:])

    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in (
        "pavitra is a same-day alias, not a second gujarat ritual",
        "childlessness is not punishment",
        "queen's absent agency is not consent",
        "fasting or merit transfer does not cause or guarantee conception",
        "do not promise a son, conception, pregnancy, healthy birth",
        "do not approach, touch, feed, water, restrain or rescue an unfamiliar animal",
        "do not rank dignity by caste, tribe, birth",
        "no one owes fasting, vigil, merit transfer",
        "formal pavitraka passage, not this ordinary procedure",
        "serious harm is not erased by fasting, merit transfer, pavitraka",
        "complete ordinary form is non-fasting, fed, hydrated, rested, no-vigil",
    ):
        assert term in english
    for forbidden in (
        "childlessness is punishment",
        "you must have a son",
        "the vow guarantees conception",
        "the queen consented",
        "transfer your merit",
        "make a pavitraka at home",
        "approach a cow and give it water",
        "brahmanas are spiritually superior",
        "you must fast",
    ):
        assert forbidden not in english

    raw = SHRAVANA_PUTRADA_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "श्रावण पुत्रदा".encode("utf-8") in raw
    assert "पवित्रा".encode("utf-8") in raw
    assert SHRAVANA_PUTRADA_PACK.stat().st_size < 100_000

    links = load(SHRAVANA_PUTRADA_LINK)
    Draft202012Validator(link_schema).validate(links)
    proposal = links["proposals"][0]
    assert proposal["target_resolution"] == "unresolved_owner_lane"
    assert proposal["to_ref"]["lane_local_id"] == "story/padma-purana-shravana-putrada-mahijit-lomasha-pavitraka-source-context"

    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49
    assert progress["remaining_authoring_items"] == 159
    assert progress["completed_after_freeze"] + progress["remaining_authoring_items"] == 208
    assert progress["completed_lane_ids"].count(pack["lane_id"]) == 1
    assert progress["completed_pack_refs"].count("knowledge_packs/library_lanes/ritual-calendar/packs/shravana-putrada-ekadashi-north-west-smarta-household-2027-v1.json") == 1


def test_aja_pack_link_progress_and_adversarial_contract():
    content_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    pack = load(AJA_PACK)
    Draft202012Validator(content_schema).validate(pack)
    assert pack["lane_id"] == "aja-ekadashi-north-west-smarta-household-2027-v1"
    assert set(pack["observance_slugs"]) == {"aja-ekadashi", "kaliyadalan-ekadashi"}
    freshness = pack["calendar"]["freshness_note"]
    assert "Saturday 28 August 2027" in freshness
    assert "ISKCON calls the occurrence Annada" in freshness
    assert "Recompute city, sunrise, tithi/day-boundary and accepted authority" in freshness

    source_ids = {source["source_id"] for source in pack["sources"]}
    refs = []

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    refs.extend(child)
                else:
                    walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)
    assert set(refs) <= source_ids
    for required_source in (
        "padma-purana-aja-deshpande",
        "padma-purana-aja-sanskrit",
        "drik-aja-annada-kaliyadalan-2027",
        "india-code-bonded-labour",
        "india-code-bns-trafficking",
        "icmr-type1-diabetes-fasting",
        "devam-aja-research",
    ):
        assert required_source in source_ids

    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    for entry in localized.values():
        assert all(item["universal_origin_claimed"] is False for item in entry["origin_narratives"])
        procedures = {item["tier"]: item for item in entry["procedures"]}
        assert [(tier, len(procedures[tier]["materials"]), len(procedures[tier]["steps"])) for tier in ("minimum", "standard", "elaborate")] == [("minimum", 2, 7), ("standard", 2, 7), ("elaborate", 1, 6)]
        assert sum(not item["separate_lane_required"] for item in entry["variants"]) == 1
        assert all(item["separate_lane_required"] for item in entry["variants"][1:])

    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in (
        "absent consent is not consent",
        "no person can be sold or owned",
        "suffering is not proof of sin",
        "caste and work do not rank dignity",
        "do not approach, touch, move, undress, wash, photograph or handle a dead body",
        "serious harm is not erased by fasting, vigil, hearing, truth claims or regret",
        "do not promise reunion, resurrection, custody",
        "complete ordinary form is non-fasting, fed, hydrated, rested, no-vigil",
        "odisha kaliyadalan is retained as a same-date, same-paksha/tithi alias",
        "annada is the current iskcon name",
        "no contact, disclosure, money, reconciliation or action is required",
    ):
        assert term in english
    for forbidden in (
        "you may sell a person",
        "the wife consented",
        "suffering proves sin",
        "chandalas are impure",
        "go handle a dead body",
        "you must fast",
        "you must stay awake",
        "the vow guarantees reunion",
        "the dead will return",
        "pay your debt to complete the ritual",
    ):
        assert forbidden not in english

    raw = AJA_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "अजा एकादशी".encode("utf-8") in raw
    assert "कालियादलन".encode("utf-8") in raw
    assert AJA_PACK.stat().st_size < 100_000

    links = load(AJA_LINK)
    Draft202012Validator(link_schema).validate(links)
    proposal = links["proposals"][0]
    assert proposal["target_resolution"] == "unresolved_owner_lane"
    assert proposal["to_ref"]["lane_local_id"] == "story/padma-purana-aja-harishchandra-gautama-source-context"

    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49
    assert progress["remaining_authoring_items"] == 159
    assert progress["completed_after_freeze"] + progress["remaining_authoring_items"] == 208
    assert progress["completed_lane_ids"].count(pack["lane_id"]) == 1
    assert progress["completed_pack_refs"].count("knowledge_packs/library_lanes/ritual-calendar/packs/aja-ekadashi-north-west-smarta-household-2027-v1.json") == 1


def test_parsva_pack_links_progress_and_adversarial_contract():
    content_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    pack = load(PARSVA_PACK)
    Draft202012Validator(content_schema).validate(pack)
    assert pack["lane_id"] == "parsva-parivartini-ekadashi-north-west-smarta-household-2027-v1"
    assert set(pack["observance_slugs"]) == {"parsva-ekadashi", "parivartani-ekadashi", "parswa-paribartan-ekadashi"}
    freshness = pack["calendar"]["freshness_note"]
    assert "Saturday 11 September 2027" in freshness
    assert "Sunday 12 September" in freshness
    assert "Vamana Dwadashi is a separate annual item" in freshness
    assert "Recompute city, sunrise, tithi/day-boundary and authority" in freshness

    source_ids = {source["source_id"] for source in pack["sources"]}
    refs = []

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    refs.extend(child)
                else:
                    walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)
    assert set(refs) <= source_ids
    for required_source in (
        "padma-purana-parsva-deshpande",
        "narada-purana-padma-parivartini",
        "drik-parsva-aliases-2027",
        "baps-jal-jhilani",
        "baps-kishore-pravesh",
        "icmr-type1-diabetes-fasting",
        "devam-parsva-research",
    ):
        assert required_source in source_ids

    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 2
        assert all(item["universal_origin_claimed"] is False for item in entry["origin_narratives"])
        procedures = {item["tier"]: item for item in entry["procedures"]}
        assert [(tier, len(procedures[tier]["materials"]), len(procedures[tier]["steps"])) for tier in ("minimum", "standard", "elaborate")] == [("minimum", 2, 8), ("standard", 2, 8), ("elaborate", 1, 6)]
        assert sum(not item["separate_lane_required"] for item in entry["variants"]) == 1
        assert all(item["separate_lane_required"] for item in entry["variants"][1:])

    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in (
        "mandhatri explicitly refuses to kill an innocent person",
        "angiras's caste blame and killing proposal are source speech that mandhatri refuses",
        "no caste or person causes drought",
        "violence is not a remedy",
        "ritual guarantees no rain or harvest",
        "do not enter water, reservoir, river, pond, lake, bank, boat",
        "do not move, bathe, turn, immerse or transport an image",
        "complete ordinary form is non-fasting, fed, hydrated, rested, no-vigil",
        "odisha parswa paribartan are same-date aliases, not separate state rituals",
        "baps sources describe waterless fasting, murti, boat/water, yoghurt and arti",
        "vamana dwadashi is a separate annual item",
        "serious violence, discrimination, negligence or public harm is not erased",
        "no one owes a fast, waterless fast, vigil, prayer, donation, caste role",
    ):
        assert term in english
    for forbidden in (
        "the chandala caused the drought",
        "kill the chandala",
        "lower castes must not pray",
        "the vow guarantees rain",
        "move your image to a reservoir",
        "turn your murti on its side",
        "you must fast without water",
        "everyone must observe together",
        "donate curd and rice to make it rain",
        "jal jhilani is observed by all hindus",
        "parswa paribartan requires a separate odisha ritual",
    ):
        assert forbidden not in english

    raw = PARSVA_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "पार्श्व / परिवर्तिनी एकादशी".encode("utf-8") in raw
    assert "मांधाता".encode("utf-8") in raw
    assert "अंगिरा".encode("utf-8") in raw
    assert PARSVA_PACK.stat().st_size < 100_000

    links = load(PARSVA_LINK)
    Draft202012Validator(link_schema).validate(links)
    assert len(links["proposals"]) == 2
    by_id = {item["proposal_id"]: item for item in links["proposals"]}
    assert by_id["parsva-to-padma-mandhatri-angiras-owner"]["to_ref"]["lane_local_id"] == "story/padma-purana-parsva-mandhatri-angiras-source-context"
    assert by_id["parsva-to-turning-vamana-bali-source-owner"]["to_ref"]["lane_local_id"] == "story/parsva-parivartini-turning-vamana-bali-source-context"
    assert by_id["parsva-to-turning-vamana-bali-source-owner"]["confidence"] == "contested"
    assert all(item["target_resolution"] == "unresolved_owner_lane" for item in links["proposals"])

    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49
    assert progress["remaining_authoring_items"] == 159
    assert progress["completed_after_freeze"] + progress["remaining_authoring_items"] == 208
    assert progress["completed_lane_ids"].count(pack["lane_id"]) == 1
    assert progress["completed_pack_refs"].count("knowledge_packs/library_lanes/ritual-calendar/packs/parsva-parivartini-ekadashi-north-west-smarta-household-2027-v1.json") == 1


def test_indira_pack_links_progress_and_adversarial_contract():
    content_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    pack = load(INDIRA_PACK)
    Draft202012Validator(content_schema).validate(pack)
    assert pack["lane_id"] == "indira-ekadashi-north-west-smarta-household-2027-v1"
    assert pack["observance_slugs"] == ["indira-ekadashi"]
    assert {"IN-WB", "IN-BR", "IN-CG", "IN-KA", "IN-TN", "IN-KL", "IN-MH", "IN-OD", "IN-AP"} <= set(pack["applicability"]["region_codes"])
    freshness = pack["calendar"]["freshness_note"]
    assert "Sunday 26 September 2027" in freshness
    assert "Ekadashi Shraddha" in freshness
    assert "separate denominator item" in freshness
    assert "Recompute city, sunrise, tithi/day-boundary and accepted authority" in freshness

    source_ids = {source["source_id"] for source in pack["sources"]}
    refs = []

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    refs.extend(child)
                else:
                    walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)
    assert set(refs) <= source_ids
    for required_source in (
        "padma-purana-indira-deshpande",
        "padma-purana-indira-sanskrit",
        "narada-purana-indira-formal",
        "drik-indira-shraddha-2027",
        "icmr-type1-diabetes-fasting",
        "mohfw-tele-manas",
        "devam-pitru-paksha-remembrance-boundary",
        "devam-indira-research",
    ):
        assert required_source in source_ids

    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 2
        assert all(item["universal_origin_claimed"] is False for item in entry["origin_narratives"])
        procedures = {item["tier"]: item for item in entry["procedures"]}
        assert [(tier, len(procedures[tier]["materials"]), len(procedures[tier]["steps"])) for tier in ("minimum", "standard", "elaborate")] == [("minimum", 2, 8), ("standard", 2, 7), ("elaborate", 1, 6)]
        assert sum(not item["separate_lane_required"] for item in entry["variants"]) == 1
        assert all(item["separate_lane_required"] for item in entry["variants"][1:])

    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in (
        "these are source claims, not proof that a deceased person suffers",
        "a descendant owes rescue",
        "ritual changes the afterlife",
        "ekadashi shraddha and formal ancestor rites are separate lanes",
        "do not ask for death tithi, cause, image, family history",
        "no son, heir, priest, debtor, rescuer or recipient role is assigned",
        "do not handle salagrama, food, pinda, water, remains",
        "five reviewed calendar systems share the indira identity",
        "minor differences, not separate state rituals",
        "complete ordinary form is non-fasting, fed, hydrated, rested, normal dental care",
        "do not perform pinda, tarpana or shraddha",
        "grief has no required display or timetable",
        "no one owes fasting, vigil, merit transfer",
        "serious harm, neglect, abuse or legal duties are not erased",
    ):
        assert term in english
    for forbidden in (
        "your father is suffering in yama's world",
        "you must save your ancestor",
        "you must transfer merit",
        "you must fast",
        "do not clean your teeth",
        "sleep on the ground",
        "perform shraddha at home",
        "bathe a salagrama",
        "feed brahmanas to uplift your ancestors",
        "indira guarantees heaven",
        "every state needs a separate indira ritual",
    ):
        assert forbidden not in english

    raw = INDIRA_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "इंदिरा एकादशी".encode("utf-8") in raw
    assert "इंद्रसेन".encode("utf-8") in raw
    assert "एकादशी श्राद्ध".encode("utf-8") in raw
    assert b"\xef\xbf\xbd" not in raw
    assert INDIRA_PACK.stat().st_size < 100_000

    links = load(INDIRA_LINK)
    Draft202012Validator(link_schema).validate(links)
    assert len(links["proposals"]) == 2
    by_id = {item["proposal_id"]: item for item in links["proposals"]}
    assert by_id["indira-to-padma-indrasena-owner"]["to_ref"]["lane_local_id"] == "story/padma-purana-indira-indrasena-narada-father-source-context"
    assert by_id["indira-to-formal-shraddha-owner"]["to_ref"]["lane_local_id"] == "practice/indira-ekadashi-formal-shraddha-source-context"
    assert all(item["target_resolution"] == "unresolved_owner_lane" for item in links["proposals"])

    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49
    assert progress["remaining_authoring_items"] == 159
    assert progress["completed_after_freeze"] + progress["remaining_authoring_items"] == 208
    assert progress["completed_lane_ids"].count(pack["lane_id"]) == 1
    assert progress["completed_pack_refs"].count("knowledge_packs/library_lanes/ritual-calendar/packs/indira-ekadashi-north-west-smarta-household-2027-v1.json") == 1


def test_papankusha_pack_link_progress_and_adversarial_contract():
    content_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    pack = load(PAPANKUSHA_PACK)
    Draft202012Validator(content_schema).validate(pack)
    assert pack["lane_id"] == "papankusha-pashankusha-ekadashi-north-west-smarta-household-2027-v1"
    assert set(pack["observance_slugs"]) == {"papankusha-ekadashi", "pashankusha-ekadashi"}
    assert {"IN-WB", "IN-BR", "IN-CG", "IN-KA", "IN-TN", "IN-KL", "IN-MH", "IN-OD", "IN-AP"} <= set(pack["applicability"]["region_codes"])
    freshness = pack["calendar"]["freshness_note"]
    assert "Monday 11 October 2027" in freshness
    assert "Padmanabha Dwadashi" in freshness
    assert "separately accepted denominator item" in freshness
    assert "Recompute city, sunrise, tithi/day-boundary and accepted authority" in freshness

    source_ids = {source["source_id"] for source in pack["sources"]}
    refs = []

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    refs.extend(child)
                else:
                    walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)
    assert set(refs) <= source_ids
    for required_source in (
        "padma-purana-papankusha-deshpande",
        "padma-purana-papankusha-sanskrit",
        "drik-papankusha-pashankusha-2027",
        "icmr-type1-diabetes-fasting",
        "devam-ekadashi-rule-audit",
        "devam-ekadashi-recurring-scaffold",
        "devam-papankusha-research",
    ):
        assert required_source in source_ids

    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 1
        assert entry["origin_narratives"][0]["universal_origin_claimed"] is False
        procedures = {item["tier"]: item for item in entry["procedures"]}
        assert [(tier, len(procedures[tier]["materials"]), len(procedures[tier]["steps"])) for tier in ("minimum", "standard", "elaborate")] == [("minimum", 2, 7), ("standard", 2, 7), ("elaborate", 1, 6)]
        assert sum(not item["separate_lane_required"] for item in entry["variants"]) == 1
        assert all(item["separate_lane_required"] for item in entry["variants"][1:])

    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in (
        "mahatmya catalogue rather than a developed plot",
        "reciprocal hell threats for vaishnava criticism of shiva and shaiva/pashupata criticism of vishnu",
        "these are source claims, not afterlife facts",
        "not separate state rituals",
        "shared civil-date display does not merge ekadashi and dwadashi",
        "shiva, vishnu, shaiva, vaishnava, pashupata and every person retain equal dignity",
        "no confession, disclosure, confrontation, contact, apology, restitution or money is required",
        "do not transfer money, gold, land, an animal",
        "complete ordinary form is non-fasting, fed, hydrated, rested",
        "a spouse is not a reward",
        "serious harm is not erased by fasting, vigil, prayer, gifts, hearing, accidental observance",
        "no one owes fasting, vigil, prayer, confession, apology, contact, money, donation",
    ):
        assert term in english
    for forbidden in (
        "shaivas will go to hell",
        "vaishnavas will go to hell",
        "fasting erases every crime",
        "you must fast",
        "you must stay awake",
        "the vow guarantees a wife",
        "the vow guarantees sons",
        "the vow cures disease",
        "donate your land",
        "donate a cow",
        "poor people must donate",
        "every state has a separate papankusha ritual",
        "padmanabha dwadashi is the same ritual",
    ):
        assert forbidden not in english

    raw = PAPANKUSHA_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "पापांकुशा / पाशांकुशा एकादशी".encode("utf-8") in raw
    assert "पद्मनाभ द्वादशी".encode("utf-8") in raw
    assert "समान गरिमा".encode("utf-8") in raw
    assert b"\xef\xbf\xbd" not in raw
    assert PAPANKUSHA_PACK.stat().st_size < 100_000

    links = load(PAPANKUSHA_LINK)
    Draft202012Validator(link_schema).validate(links)
    assert len(links["proposals"]) == 1
    proposal = links["proposals"][0]
    assert proposal["target_resolution"] == "unresolved_owner_lane"
    assert proposal["to_ref"]["lane_local_id"] == "story/padma-purana-papankusha-mahatmya-source-context"
    assert "not an invented plot" in proposal["scope"]["statement"]

    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49
    assert progress["remaining_authoring_items"] == 159
    assert progress["completed_after_freeze"] + progress["remaining_authoring_items"] == 208
    assert progress["completed_lane_ids"].count(pack["lane_id"]) == 1
    assert progress["completed_pack_refs"].count("knowledge_packs/library_lanes/ritual-calendar/packs/papankusha-pashankusha-ekadashi-north-west-smarta-household-2027-v1.json") == 1


def test_rama_pack_link_progress_and_adversarial_contract():
    content_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    pack = load(RAMA_PACK)
    Draft202012Validator(content_schema).validate(pack)
    assert pack["lane_id"] == "rama-ekadashi-north-west-smarta-household-2027-v1"
    assert pack["observance_slugs"] == ["rama-ekadashi"]
    assert {"IN-WB", "IN-BR", "IN-CG", "IN-KA", "IN-TN", "IN-KL", "IN-MH", "IN-OD", "IN-AP"} <= set(pack["applicability"]["region_codes"])
    freshness = pack["calendar"]["freshness_note"]
    assert "Monday 25 October 2027" in freshness
    assert "Gauna/Vaishnava Rama on Tuesday 26 October" in freshness
    assert "separately accepted denominator item" in freshness
    assert "Recompute city, sunrise, tithi/day-boundary and accepted authority" in freshness

    source_ids = {source["source_id"] for source in pack["sources"]}
    refs = []

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    refs.extend(child)
                else:
                    walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)
    assert set(refs) <= source_ids
    for required_source in (
        "padma-purana-rama-deshpande",
        "padma-purana-rama-sanskrit",
        "drik-rama-gauna-vaishnava-2027",
        "icmr-type1-diabetes-fasting",
        "india-code-pca-act-1960",
        "india-emergency-112",
        "devam-ekadashi-rule-audit",
        "devam-rama-research",
    ):
        assert required_source in source_ids

    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 1
        assert entry["origin_narratives"][0]["universal_origin_claimed"] is False
        procedures = {item["tier"]: item for item in entry["procedures"]}
        assert [(tier, len(procedures[tier]["materials"]), len(procedures[tier]["steps"])) for tier in ("minimum", "standard", "elaborate")] == [("minimum", 2, 7), ("standard", 2, 7), ("elaborate", 1, 6)]
        assert sum(not item["separate_lane_required"] for item in entry["variants"]) == 1
        assert all(item["separate_lane_required"] for item in entry["variants"][1:])

    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in (
        "coercion is not consent",
        "death is not ritual success",
        "no survivor owes merit or reunion",
        "food and water denied to animals",
        "candrabhaga does not abandon her body with him and remains alive",
        "her survival after his death is not disloyalty",
        "recreate the decree or use censure",
        "do not enact death, cremation, dead-person messages, vedic sprinkling, merit transfer or reunion",
        "five reviewed ordinary calendar systems share the rama identity",
        "not separate state rituals",
        "separately accepted gauna/vaishnava rama denominator",
        "complete ordinary form is non-fasting, fed, hydrated, rested",
        "never withhold food or water from an animal",
        "a spouse is not property, enforcement labour, merit supply or rescue duty",
        "no person owes self-harm, sati, death, widowhood conduct, reunion",
        "do not claim contact with the dead",
        "no one owes fasting, vigil, prayer, merit, belief, disclosure, contact",
    ):
        assert term in english
    for forbidden in (
        "you must fast",
        "you must stay awake",
        "withhold water from animals",
        "children should fast from age eight",
        "shobhana's death proves devotion",
        "candrabhaga caused his death",
        "a widow should die with her husband",
        "cremate the body yourself",
        "somasharman proves we can contact the dead",
        "wives must transfer merit",
        "the vow guarantees reunion",
        "weak faith causes instability",
        "gauna rama is the same universal date",
        "every state has a separate rama ritual",
    ):
        assert forbidden not in english

    raw = RAMA_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "रमा एकादशी".encode("utf-8") in raw
    assert "चंद्रभागा".encode("utf-8") in raw
    assert "मृत्यु अनुष्ठान की सफलता नहीं".encode("utf-8") in raw
    assert b"\xef\xbf\xbd" not in raw
    assert RAMA_PACK.stat().st_size < 100_000

    links = load(RAMA_LINK)
    Draft202012Validator(link_schema).validate(links)
    assert len(links["proposals"]) == 1
    proposal = links["proposals"][0]
    assert proposal["target_resolution"] == "unresolved_owner_lane"
    assert proposal["to_ref"]["lane_local_id"] == "story/padma-purana-rama-mucukunda-candrabhaga-shobhana-source-context"
    assert "Candrabhaga's explicit survival" in proposal["scope"]["statement"]

    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49
    assert progress["remaining_authoring_items"] == 159
    assert progress["completed_after_freeze"] + progress["remaining_authoring_items"] == 208
    assert progress["completed_lane_ids"].count(pack["lane_id"]) == 1
    assert progress["completed_pack_refs"].count("knowledge_packs/library_lanes/ritual-calendar/packs/rama-ekadashi-north-west-smarta-household-2027-v1.json") == 1


def test_devutthana_pack_links_progress_and_adversarial_contract():
    content_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    pack = load(DEVUTTHANA_PACK)
    Draft202012Validator(content_schema).validate(pack)
    assert pack["lane_id"] == "devutthana-prabodhini-ekadashi-north-west-smarta-household-2027-v1"
    assert pack["observance_slugs"] == ["devutthana-ekadashi"]
    assert {"IN-WB", "IN-BR", "IN-CG", "IN-KA", "IN-TN", "IN-KL", "IN-MH", "IN-OD", "IN-AP"} <= set(pack["applicability"]["region_codes"])
    freshness = pack["calendar"]["freshness_note"]
    assert "Wednesday 10 November 2027" in freshness
    assert "Tulasi Vivah fixture on Thursday 11 November" in freshness
    assert "Recompute city, sunrise, tithi/day-boundary, Mahadwadashi, parana and named authority" in freshness

    source_ids = {source["source_id"] for source in pack["sources"]}
    refs = []

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    refs.extend(child)
                else:
                    walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)
    assert set(refs) <= source_ids
    for required_source in (
        "padma-purana-devutthana-deshpande",
        "padma-purana-devutthana-sanskrit",
        "drik-devutthana-tulasi-2027",
        "baps-prabodhini-ekadashi",
        "icmr-type1-diabetes-fasting",
        "devam-ekadashi-rule-audit",
        "devam-ekadashi-recurring-scaffold",
        "devam-devutthana-research",
    ):
        assert required_source in source_ids

    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 1
        assert entry["origin_narratives"][0]["universal_origin_claimed"] is False
        procedures = {item["tier"]: item for item in entry["procedures"]}
        assert [(tier, len(procedures[tier]["materials"]), len(procedures[tier]["steps"])) for tier in ("minimum", "standard", "elaborate")] == [("minimum", 2, 8), ("standard", 2, 7), ("elaborate", 2, 6)]
        assert sum(not item["separate_lane_required"] for item in entry["variants"]) == 1
        assert all(item["separate_lane_required"] for item in entry["variants"][1:])

    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in (
        "68-verse mahatmya and practice catalogue, not a developed human plot",
        "ritual does not erase harm or accountability",
        "cannot be universalised as a gujarat, west india or household rule",
        "keep gauna/vaishnava timing, tulasi vivah and baps prabodhini separate",
        "complete ordinary form is non-fasting, fed, hydrated, rested",
        "do not enact tulasi vivah inside this ekadashi household form",
        "do not reject safe food from another household, caste, community, school or workplace",
        "do not create state variants for language, spelling, dress, food preference",
        "nobody owes fasting, vigil, song, dance, prayer, plant care, donation",
        "not a claim that household action controls a deity or cosmic time",
    ):
        assert term in english
    for forbidden in (
        "you must fast",
        "you must stay awake",
        "ritual erases violence",
        "brahmana lives matter more",
        "non-observance destroys your merit",
        "the vow guarantees sons",
        "reject food from other households",
        "plant or pluck tulasi now",
        "perform tulasi vivah on 10 november",
        "all gujarati households make hatadi",
        "every state needs a separate devutthana ritual",
        "the padma purana tells of a king who wakes vishnu",
    ):
        assert forbidden not in english

    raw = DEVUTTHANA_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "देवउठनी / प्रबोधिनी एकादशी".encode("utf-8") in raw
    assert "अनुष्ठान हानि या उत्तरदायित्व नहीं मिटाता".encode("utf-8") in raw
    assert "अलग महत्वपूर्ण मार्ग".encode("utf-8") in raw
    assert b"\xef\xbf\xbd" not in raw
    assert DEVUTTHANA_PACK.stat().st_size < 100_000

    links = load(DEVUTTHANA_LINK)
    Draft202012Validator(link_schema).validate(links)
    assert len(links["proposals"]) == 2
    assert {proposal["target_resolution"] for proposal in links["proposals"]} == {"unresolved_owner_lane"}
    targets = {proposal["to_ref"]["lane_local_id"] for proposal in links["proposals"]}
    assert targets == {
        "story/padma-purana-devutthana-prabodhini-mahatmya-source-context",
        "living-tradition/baps-prabodhini-hatadi-source-context",
    }

    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49
    assert progress["remaining_authoring_items"] == 159
    assert progress["completed_after_freeze"] + progress["remaining_authoring_items"] == 208
    assert progress["completed_lane_ids"].count(pack["lane_id"]) == 1
    assert progress["completed_pack_refs"].count("knowledge_packs/library_lanes/ritual-calendar/packs/devutthana-prabodhini-ekadashi-north-west-smarta-household-2027-v1.json") == 1


def test_utpanna_pack_link_progress_and_adversarial_contract():
    content_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    pack = load(UTPANNA_PACK)
    Draft202012Validator(content_schema).validate(pack)
    assert pack["lane_id"] == "utpanna-utpatti-ekadashi-north-west-smarta-household-2027-v1"
    assert pack["observance_slugs"] == ["utpanna-ekadashi"]
    assert {"IN-WB", "IN-BR", "IN-CG", "IN-KA", "IN-TN", "IN-KL", "IN-MH", "IN-OD", "IN-AP"} <= set(pack["applicability"]["region_codes"])
    freshness = pack["calendar"]["freshness_note"]
    assert "Wednesday 24 November 2027" in freshness
    assert "Chennai ISKCON Paksha Vardhini Mahadwadashi shift" in freshness
    assert "Recompute city, sunrise, arunodaya, tithi/day-boundary, Mahadwadashi, authority and parana" in freshness
    assert "never copy displayed times or infer a national Vaishnava date" in freshness

    source_ids = {source["source_id"] for source in pack["sources"]}
    refs = []

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    refs.extend(child)
                else:
                    walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)
    assert set(refs) <= source_ids
    for required_source in (
        "padma-purana-utpanna-deshpande",
        "padma-purana-utpanna-sanskrit",
        "narada-purana-utpanna-utpatti",
        "drik-utpanna-india-2027",
        "devam-ekadashi-rule-research",
        "devam-ekadashi-recurring-scaffold",
        "icmr-type1-diabetes-fasting",
        "india-emergency-112",
        "devam-utpanna-research",
    ):
        assert required_source in source_ids

    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 1
        assert entry["origin_narratives"][0]["universal_origin_claimed"] is False
        procedures = {item["tier"]: item for item in entry["procedures"]}
        assert [(tier, len(procedures[tier]["materials"]), len(procedures[tier]["steps"])) for tier in ("minimum", "standard", "elaborate")] == [("minimum", 2, 8), ("standard", 2, 7), ("elaborate", 2, 6)]
        assert sum(not item["separate_lane_required"] for item in entry["variants"]) == 1
        assert all(item["separate_lane_required"] for item in entry["variants"][1:])

    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in (
        "mahadwadashi and vow catalogue, caste exclusion",
        "the armed maiden's independent emergence and combat",
        "preserve ekadashi devi's own speech, protection, combat and boon negotiation",
        "do not reduce it to ‘vishnu killed mura’",
        "mythic combat does not permit calling a real person an enemy or demon",
        "do not enact or instruct warfare, pursuit, attack during sleep",
        "no woman or child owes protection of a man, family or religion",
        "never deny conversation, food, dignity, safety, justice, worship or entry by caste",
        "ritual does not erase harm or legal and ethical accountability",
        "do not wake, touch, frighten, watch, test or approach a sleeping person without authority",
        "do not create state variants for language, spelling, purnimanta/amanta terms",
        "current local computation is required",
    ):
        assert term in english
    for forbidden in (
        "you must fast",
        "you must stay awake",
        "destroy your inner demon",
        "identify the mura in your life",
        "vishnu killed mura while asleep",
        "women must protect men",
        "avoid speaking to shudras",
        "untouchables should be excluded",
        "the vow erases violence",
        "the fast guarantees wealth",
        "wake a sleeping relative",
        "shout humkara at an enemy",
        "every state needs a separate utpanna ritual",
        "paksha vardhini applies nationally",
    ):
        assert forbidden not in english

    raw = UTPANNA_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "उत्पन्ना / उत्पत्ति एकादशी".encode("utf-8") in raw
    assert "एकादशी देवी की अपनी वाणी".encode("utf-8") in raw
    assert "किसी वास्तविक व्यक्ति".encode("utf-8") in raw
    assert b"\xef\xbf\xbd" not in raw
    assert UTPANNA_PACK.stat().st_size < 100_000

    links = load(UTPANNA_LINK)
    Draft202012Validator(link_schema).validate(links)
    assert len(links["proposals"]) == 1
    proposal = links["proposals"][0]
    assert proposal["target_resolution"] == "unresolved_owner_lane"
    assert proposal["to_ref"]["lane_local_id"] == "story/padma-purana-utpanna-mura-ekadashi-devi-source-context"
    assert "the armed maiden's independent emergence" in proposal["scope"]["statement"]
    assert "caste hierarchy" in proposal["scope"]["statement"]

    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49
    assert progress["remaining_authoring_items"] == 159
    assert progress["completed_after_freeze"] + progress["remaining_authoring_items"] == 208
    assert progress["completed_lane_ids"].count(pack["lane_id"]) == 1
    assert progress["completed_pack_refs"].count("knowledge_packs/library_lanes/ritual-calendar/packs/utpanna-utpatti-ekadashi-north-west-smarta-household-2027-v1.json") == 1


def test_mokshada_pack_links_progress_and_adversarial_contract():
    content_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    pack = load(MOKSHADA_PACK)
    Draft202012Validator(content_schema).validate(pack)
    assert pack["lane_id"] == "mokshada-gomati-ekadashi-north-west-smarta-household-2027-v1"
    assert pack["observance_slugs"] == ["mokshada-ekadashi"]
    assert {"IN-WB", "IN-BR", "IN-CG", "IN-KA", "IN-TN", "IN-KL", "IN-MH", "IN-OD", "IN-AP"} <= set(pack["applicability"]["region_codes"])
    freshness = pack["calendar"]["freshness_note"]
    assert "Thursday 9 December 2027" in freshness
    assert "Gita Jayanti and Guruvayur Ekadashi also displayed that day" in freshness
    assert "Older fixtures prove Gauna/Vaishnava Mokshada can differ" in freshness
    assert "Recompute city, sunrise, arunodaya, tithi/day-boundary, Mahadwadashi, authority and parana" in freshness
    assert "never merge same-day identities or infer permanent agreement" in freshness

    source_ids = {source["source_id"] for source in pack["sources"]}
    refs = []

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    refs.extend(child)
                else:
                    walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)
    assert set(refs) <= source_ids
    for required_source in (
        "padma-purana-mokshada-deshpande",
        "padma-purana-mokshada-sanskrit",
        "narada-purana-mokshada",
        "drik-mokshada-india-2027",
        "devam-gita-jayanti-reading-lane",
        "devam-ekadashi-rule-audit",
        "devam-ekadashi-recurring-scaffold",
        "icmr-type1-diabetes-fasting",
        "india-emergency-112",
        "devam-mokshada-research",
    ):
        assert required_source in source_ids

    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 1
        assert entry["origin_narratives"][0]["universal_origin_claimed"] is False
        procedures = {item["tier"]: item for item in entry["procedures"]}
        assert [(tier, len(procedures[tier]["materials"]), len(procedures[tier]["steps"])) for tier in ("minimum", "standard", "elaborate")] == [("minimum", 2, 8), ("standard", 2, 7), ("elaborate", 2, 6)]
        assert sum(not item["separate_lane_required"] for item in entry["variants"]) == 1
        assert all(item["separate_lane_required"] for item in entry["variants"][1:])

    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in (
        "the father's alleged conception-time sexual fault",
        "consent is required every time",
        "fear of hell creates no duty to sex or conception",
        "no son, daughter, descendant, spouse or mourner owes ancestor rescue",
        "the dream and sky voice are source events, not verified messages",
        "do not treat a dream, sky voice, flower, coincidence or feeling as a dead-person message",
        "ritual does not erase abuse, sexual coercion, violence, neglect",
        "same-day identity is not the same procedure",
        "gita jayanti reading and the guruvayur temple route are same-day material variants",
        "do not create state variants for language, spelling, dress, food preference",
        "current local computation is required",
    ):
        assert term in english
    for forbidden in (
        "you must fast",
        "you must stay awake",
        "a wife must conceive during her fertile period",
        "a husband sins by refusing sex",
        "sons must rescue their fathers",
        "your dream is a message from your ancestors",
        "transfer your merit now",
        "the vow guarantees ancestor salvation",
        "brahmanas alone can interpret dreams",
        "contact the dead",
        "read all eighteen gita chapters",
        "guruvayur is the kerala version of mokshada",
        "gauna mokshada always falls the next day",
        "every state needs a separate mokshada ritual",
    ):
        assert forbidden not in english

    raw = MOKSHADA_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "मोक्षदा / गोमती एकादशी".encode("utf-8") in raw
    assert "हर बार consent जरूरी है".encode("utf-8") in raw
    assert "कोई पुत्र, पुत्री".encode("utf-8") in raw
    assert b"\xef\xbf\xbd" not in raw
    assert MOKSHADA_PACK.stat().st_size < 100_000

    links = load(MOKSHADA_LINK)
    Draft202012Validator(link_schema).validate(links)
    assert len(links["proposals"]) == 2
    by_id = {proposal["proposal_id"]: proposal for proposal in links["proposals"]}
    story = by_id["mokshada-to-padma-vaikhanasa-owner"]
    assert story["target_resolution"] == "unresolved_owner_lane"
    assert story["to_ref"]["lane_local_id"] == "story/padma-purana-mokshada-vaikhanasa-ancestors-source-context"
    assert "sexual/reproductive premise" in story["scope"]["statement"]
    gita = by_id["mokshada-to-existing-gita-jayanti-reading-lane"]
    assert gita["target_resolution"] == "lane_local"
    assert gita["to_ref"]["lane_local_id"] == "ritual/gita-jayanti-reading-reflection-content-v1"
    assert "do not duplicate it" in gita["scope"]["statement"]

    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49
    assert progress["remaining_authoring_items"] == 159
    assert progress["completed_after_freeze"] + progress["remaining_authoring_items"] == 208
    assert progress["completed_lane_ids"].count(pack["lane_id"]) == 1
    assert progress["completed_pack_refs"].count("knowledge_packs/library_lanes/ritual-calendar/packs/mokshada-gomati-ekadashi-north-west-smarta-household-2027-v1.json") == 1


def test_vaishnava_rama_router_links_progress_and_adversarial_contract():
    content_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    pack = load(VAISHNAVA_RAMA_PACK)
    Draft202012Validator(content_schema).validate(pack)
    assert pack["lane_id"] == "vaishnava-rama-ekadashi-india-authority-router-2027-v1"
    assert pack["observance_slugs"] == ["rama-ekadashi-vaishnava"]
    assert {"IN-WB", "IN-BR", "IN-CG", "IN-KA", "IN-TN", "IN-KL", "IN-MH", "IN-OD", "IN-AP"} <= set(pack["applicability"]["region_codes"])
    assert pack["applicability"]["institution_codes"] == []
    assert pack["calendar"]["timing_kind"] == "mixed"
    assert pack["calendar"]["location_aware"] is True
    assert pack["calendar"]["tradition_aware"] is True
    freshness = pack["calendar"]["freshness_note"]
    assert "ordinary Rama on Monday 25 October 2027" in freshness
    assert "Vaishnava route on Tuesday 26 October" in freshness
    assert "Confirm current city, named official authority" in freshness
    assert "never copy either date" in freshness

    source_ids = {source["source_id"] for source in pack["sources"]}
    refs = []

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    refs.extend(child)
                else:
                    walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)
    assert set(refs) <= source_ids
    for required_source in (
        "padma-purana-rama-deshpande",
        "padma-purana-rama-sanskrit",
        "drik-rama-vijayawada-2027",
        "drik-vaishnava-rama-korba-2027",
        "drik-vaishnava-rama-kolkata-2027",
        "devam-ekadashi-rule-audit",
        "devam-ekadashi-recurring-scaffold",
        "icmr-type1-diabetes-fasting",
        "india-code-pca-act-1960",
        "india-emergency-112",
        "devam-rama-research",
        "devam-vaishnava-rama-research",
    ):
        assert required_source in source_ids
    source_by_id = {source["source_id"]: source for source in pack["sources"]}
    assert "geoname-id=1253184" in source_by_id["drik-rama-vijayawada-2027"]["url"]
    assert "geoname-id=1266122" in source_by_id["drik-vaishnava-rama-korba-2027"]["url"]
    assert "geoname-id=1275004" in source_by_id["drik-vaishnava-rama-kolkata-2027"]["url"]

    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 1
        assert entry["origin_narratives"][0]["universal_origin_claimed"] is False
        assert len(entry["origin_narratives"][0]["summary"]) > 800
        procedures = {item["tier"]: item for item in entry["procedures"]}
        assert [(tier, len(procedures[tier]["steps"])) for tier in ("minimum", "standard", "elaborate")] == [("minimum", 7), ("standard", 7), ("elaborate", 6)]
        assert [step["ordinal"] for procedure in procedures.values() for step in procedure["steps"]] == list(range(1, 8)) + list(range(1, 8)) + list(range(1, 7))
        assert sum(not item["separate_lane_required"] for item in entry["variants"]) == 1
        assert all(item["separate_lane_required"] for item in entry["variants"][1:])

    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in (
        "named current vaishnava authority",
        "ordinary rama on 25 october 2027 and the vaishnava route on 26 october",
        "no date or parana is universal",
        "a state label or the word vaishnava does not determine",
        "begin no fast, vigil or parana from this router",
        "animal deprivation, known weakness, pressure, severe hunger, death",
        "candrabhaga's survival",
        "death is not ritual success",
        "no survivor owes merit, self-harm or reunion",
        "independent fixtures are discovery evidence, not official gbc",
        "do not copy the public rite or displayed parana home",
        "sampled state fixtures do not create state rituals",
        "language, spelling, month vocabulary, dress, food preference",
    ):
        assert term in english
    for forbidden in (
        "all vaishnavas observe",
        "all iskcon temples",
        "26 october is the universal date",
        "follow this parana time",
        "you must fast",
        "you must stay awake",
        "death proves devotion",
        "candrabhaga caused his death",
        "a widow must transfer merit",
        "contact the dead",
        "the vow guarantees reunion",
        "every state needs a separate vaishnava rama ritual",
    ):
        assert forbidden not in english

    raw = VAISHNAVA_RAMA_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "वैष्णव रमा एकादशी".encode("utf-8") in raw
    assert "राज्य का नाम या केवल ‘वैष्णव’ शब्द".encode("utf-8") in raw
    assert "मृत्यु सफलता नहीं".encode("utf-8") in raw
    assert b"\xef\xbf\xbd" not in raw
    assert VAISHNAVA_RAMA_PACK.stat().st_size < 100_000

    links = load(VAISHNAVA_RAMA_LINK)
    Draft202012Validator(link_schema).validate(links)
    assert len(links["proposals"]) == 2
    by_id = {proposal["proposal_id"]: proposal for proposal in links["proposals"]}
    story = by_id["vaishnava-rama-shares-padma-story-with-ordinary-rama"]
    assert story["target_resolution"] == "lane_local"
    assert story["to_ref"]["lane_local_id"] == "ritual-calendar/rama-ekadashi-north-west-smarta-household-2027-v1"
    assert "date and authority applicability remain distinct" in story["scope"]["statement"]
    authority = by_id["vaishnava-rama-requires-named-current-calendar-authority"]
    assert authority["target_resolution"] == "unresolved_owner_lane"
    assert authority["to_ref"]["lane_local_id"] == "ritual-calendar/named-vaishnava-current-calendar-authority"
    assert "no universal institution is asserted" in authority["scope"]["statement"]

    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49
    assert progress["remaining_authoring_items"] == 159
    assert progress["completed_after_freeze"] + progress["remaining_authoring_items"] == 208
    assert progress["completed_lane_ids"].count(pack["lane_id"]) == 1
    assert progress["completed_pack_refs"].count("knowledge_packs/library_lanes/ritual-calendar/packs/vaishnava-rama-ekadashi-india-authority-router-2027-v1.json") == 1


def test_kanya_sankranti_household_links_progress_and_adversarial_contract():
    content_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    pack = load(KANYA_PACK)
    Draft202012Validator(content_schema).validate(pack)
    assert pack["lane_id"] == "kanya-sankranti-north-west-shared-household-2027-v1"
    assert pack["observance_slugs"] == ["kanya-sankranti"]
    selected_states = {"IN-WB", "IN-BR", "IN-CG", "IN-KA", "IN-TN", "IN-MH", "IN-OD", "IN-AP"}
    assert selected_states <= set(pack["applicability"]["region_codes"])
    assert "IN-KL" not in pack["applicability"]["region_codes"]
    assert pack["calendar"]["timing_kind"] == "astronomical"
    assert pack["calendar"]["location_aware"] is True
    assert pack["calendar"]["tradition_aware"] is True
    freshness = pack["calendar"]["freshness_note"]
    assert "Friday 17 September 2027" in freshness
    assert "punya-kala remains unresolved" in freshness
    assert "Never copy the date, ingress time, punya-kala" in freshness

    source_ids = {source["source_id"] for source in pack["sources"]}
    source_by_id = {source["source_id"]: source for source in pack["sources"]}
    refs = []

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    assert len(child) == len(set(child))
                    refs.extend(child)
                else:
                    walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(pack)
    assert set(refs) <= source_ids
    for required_source in (
        "drik-kanya-new-delhi-2027",
        "devam-kanya-2026-fixture",
        "iitk-valmiki-aditya-hridaya",
        "devam-sankranti-general-scaffold",
        "devam-solar-rule-audit",
        "devam-vishwakarma-bengal-lane",
        "pib-direct-sun-eye-safety",
        "gidm-holy-dip-safety-2025",
        "mohfw-diabetes-prolonged-fasting-faq43",
        "india-emergency-112",
        "devam-kanya-research",
    ):
        assert required_source in source_ids
    assert "geoname-id=1273294" in source_by_id["drik-kanya-new-delhi-2027"]["url"]
    assert "field_sarga_value=107" in source_by_id["iitk-valmiki-aditya-hridaya"]["url"]

    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 2
        assert all(item["universal_origin_claimed"] is False for item in entry["origin_narratives"])
        assert len(entry["origin_narratives"][1]["summary"]) > 900
        procedures = {item["tier"]: item for item in entry["procedures"]}
        assert [(tier, len(procedures[tier]["steps"])) for tier in ("minimum", "standard", "elaborate")] == [("minimum", 7), ("standard", 7), ("elaborate", 6)]
        assert [step["ordinal"] for procedure in procedures.values() for step in procedure["steps"]] == list(range(1, 8)) + list(range(1, 8)) + list(range(1, 7))
        assert len(entry["variants"]) == 6
        assert sum(not item["separate_lane_required"] for item in entry["variants"]) == 1
        assert all(item["separate_lane_required"] for item in entry["variants"][1:])

    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in (
        "simha-to-kanya",
        "not kanya sankranti's origin",
        "no real person is an enemy or demon",
        "do not look directly at the sun",
        "no victory, cure, longevity or sorrow-removal",
        "kanni sankramam",
        "tools, machinery, workplace",
        "dwitiya shraddha",
        "language, spelling, dress, food preference",
    ):
        assert term in english
    for forbidden in (
        "all indians must observe",
        "all hindus must observe",
        "recite three times to defeat an enemy",
        "identify ravana in your life",
        "mantra guarantees victory",
        "kanni is the same as kanya",
        "vishwakarma is generic kanya",
        "enter the river",
        "you must fast",
        "donation is mandatory",
        "sankranti phala predicts your fate",
        "every state needs a separate kanya ritual",
    ):
        assert forbidden not in english

    raw = KANYA_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    assert "कन्या संक्रांति".encode("utf-8") in raw
    assert "कोई वास्तविक व्यक्ति शत्रु या राक्षस नहीं".encode("utf-8") in raw
    assert "सूर्य को सीधे न देखें".encode("utf-8") in raw
    assert "कन्नि संक्रामम".encode("utf-8") in raw
    assert b"\xef\xbf\xbd" not in raw
    assert KANYA_PACK.stat().st_size < 100_000

    links = load(KANYA_LINK)
    Draft202012Validator(link_schema).validate(links)
    assert len(links["proposals"]) == 2
    by_id = {proposal["proposal_id"]: proposal for proposal in links["proposals"]}
    vishwakarma = by_id["kanya-to-existing-bengal-vishwakarma-workplace-lane"]
    assert vishwakarma["target_resolution"] == "lane_local"
    assert vishwakarma["to_ref"]["lane_local_id"] == "ritual/vishwakarma-puja-bengal-workplace-content-v1"
    story = by_id["kanya-to-aditya-hridaya-ramayana-owner"]
    assert story["target_resolution"] == "unresolved_owner_lane"
    assert story["to_ref"]["lane_local_id"] == "story/valmiki-ramayana-aditya-hridaya-source-context"
    assert "not as Kanya Sankranti's origin" in story["scope"]["statement"]
    assert "not" in story["scope"]["statement"] and "result guarantee" in story["scope"]["statement"]

    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49
    assert progress["remaining_authoring_items"] == 159
    assert progress["completed_after_freeze"] + progress["remaining_authoring_items"] == 208
    assert progress["completed_lane_ids"].count(pack["lane_id"]) == 1
    assert progress["completed_pack_refs"].count("knowledge_packs/library_lanes/ritual-calendar/packs/kanya-sankranti-north-west-shared-household-2027-v1.json") == 1


def test_bhadrapada_purnima_links_progress_and_adversarial_contract():
    content_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    pack = load(BHADRAPADA_PACK)
    Draft202012Validator(content_schema).validate(pack)
    assert pack["lane_id"] == "bhadrapada-purnima-recurring-household-2027-v1"
    assert pack["observance_slugs"] == ["bhadrapada-purnima"]
    assert {"IN-WB", "IN-BR", "IN-CG", "IN-KA", "IN-TN", "IN-KL", "IN-MH", "IN-OD", "IN-AP"} <= set(pack["applicability"]["region_codes"])
    assert pack["calendar"]["timing_kind"] == "astronomical"
    assert pack["calendar"]["location_aware"] and pack["calendar"]["tradition_aware"]
    assert "Wednesday 15 September 2027" in pack["calendar"]["freshness_note"]
    assert "Never copy the displayed 02:50:11-04:35:02 interval" in pack["calendar"]["freshness_note"]

    source_ids = {source["source_id"] for source in pack["sources"]}
    refs = []
    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    assert len(child) == len(set(child)); refs.extend(child)
                else: walk(child)
        elif isinstance(value, list):
            for child in value: walk(child)
    walk(pack)
    assert set(refs) <= source_ids
    assert {"astrosage-bhadrapada-new-delhi-2027", "drik-purnima-india-2027", "ganguli-mahabharata-soma-prabhasa", "kumbhaghonam-shalya-soma-sanskrit", "devam-lunar-phase-disposition", "devam-pitru-paksha-partial", "gita-press-satyanarayana-lead", "mohfw-diabetes-prolonged-fasting-faq43", "gidm-holy-dip-safety-2025", "india-emergency-112", "devam-bhadrapada-research"} <= source_ids

    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 2
        assert all(not story["universal_origin_claimed"] for story in entry["origin_narratives"])
        assert len(entry["origin_narratives"][1]["summary"]) > 1200
        procedures = {item["tier"]: item for item in entry["procedures"]}
        assert [(tier, len(procedures[tier]["steps"])) for tier in ("minimum", "standard", "elaborate")] == [("minimum", 7), ("standard", 7), ("elaborate", 6)]
        assert [s["ordinal"] for p in procedures.values() for s in p["steps"]] == list(range(1,8)) + list(range(1,8)) + list(range(1,7))
        assert len(entry["variants"]) == 7
        assert sum(not variant["separate_lane_required"] for variant in entry["variants"]) == 1
        assert all(variant["separate_lane_required"] for variant in entry["variants"][1:])

    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in ("not bhadrapada purnima's universal origin", "illness is not punishment", "no person owes marriage, affection, sex, equal intimacy", "satyanarayana puja", "uma-maheshwar", "purnima shraddha", "anvadhan/ishti", "language, spelling, purnima/pournami vocabulary", "do not copy the temple's mantra", "no fast, dehydration"):
        assert term in english
    for forbidden in ("all hindus must fast", "bathe in a sacred river", "the moon cures", "illness is a curse", "a wife must obey", "equal sex is required", "satyanarayana is generic purnima", "contact your ancestors", "donation is mandatory", "every state needs a separate purnima ritual"):
        assert forbidden not in english

    raw = BHADRAPADA_PACK.read_bytes(); raw.decode("utf-8", errors="strict")
    for phrase in ("भाद्रपद पूर्णिमा", "रोग दण्ड नहीं", "कोई व्यक्ति विवाह, स्नेह, यौन सम्बन्ध", "सत्यनारायण", "पूर्णिमा श्राद्ध"):
        assert phrase.encode("utf-8") in raw
    assert b"\xef\xbf\xbd" not in raw and BHADRAPADA_PACK.stat().st_size < 100_000

    links = load(BHADRAPADA_LINK); Draft202012Validator(link_schema).validate(links)
    assert len(links["proposals"]) == 3
    by_id = {item["proposal_id"]: item for item in links["proposals"]}
    assert by_id["bhadrapada-to-satyanarayana-owner"]["target_resolution"] == "unresolved_owner_lane"
    assert "permission-pending" in by_id["bhadrapada-to-satyanarayana-owner"]["scope"]["statement"]
    assert by_id["bhadrapada-to-existing-pitru-paksha-partial"]["target_resolution"] == "lane_local"
    assert by_id["bhadrapada-to-existing-pitru-paksha-partial"]["to_ref"]["lane_local_id"] == "ritual/pitru-paksha-delhi-remembrance-content-v1"
    assert by_id["bhadrapada-to-soma-prabhasa-story-owner"]["target_resolution"] == "unresolved_owner_lane"
    assert "not as Bhadrapada Purnima's origin" in by_id["bhadrapada-to-soma-prabhasa-story-owner"]["scope"]["statement"]

    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49 and progress["remaining_authoring_items"] == 159
    assert progress["completed_after_freeze"] + progress["remaining_authoring_items"] == 208
    assert progress["completed_lane_ids"].count(pack["lane_id"]) == 1
    assert progress["completed_pack_refs"].count("knowledge_packs/library_lanes/ritual-calendar/packs/bhadrapada-purnima-recurring-household-2027-v1.json") == 1


def test_kanni_sankramam_links_progress_and_adversarial_contract():
    content_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    pack = load(KANNI_PACK)
    Draft202012Validator(content_schema).validate(pack)
    assert pack["lane_id"] == "kanni-sankramam-kerala-malayalam-solar-household-2027-v1"
    assert pack["observance_slugs"] == ["kanni-sankramam"]
    assert pack["applicability"]["region_codes"] == ["IN-KL"]
    assert "malayalam-solar" in pack["applicability"]["tradition_codes"]
    assert pack["calendar"]["timing_kind"] == "astronomical"
    assert pack["calendar"]["location_aware"] and pack["calendar"]["tradition_aware"]
    assert "Friday 17 September 2027" in pack["calendar"]["freshness_note"]
    assert "Chingam-to-Kanni" in pack["calendar"]["freshness_note"]
    assert "Punya-kala remains unresolved" in pack["calendar"]["freshness_note"]

    source_ids = {s["source_id"] for s in pack["sources"]}
    source_by_id = {s["source_id"]: s for s in pack["sources"]}
    refs = []
    def walk(v):
        if isinstance(v, dict):
            for k, x in v.items():
                if k in {"source_ids", "resolution_source_ids"}:
                    assert len(x) == len(set(x)); refs.extend(x)
                else: walk(x)
        elif isinstance(v, list):
            for x in v: walk(x)
    walk(pack)
    assert set(refs) <= source_ids
    assert {"drik-kanni-thiruvananthapuram-2027", "devam-malayalam-calendar-census", "iitk-valmiki-aditya-hridaya", "devam-kanya-reviewed-pack", "devam-solar-rule-audit", "devam-vishwakarma-bengal-lane", "pib-direct-sun-eye-safety", "gidm-holy-dip-safety-2025", "mohfw-diabetes-prolonged-fasting-faq43", "india-emergency-112", "devam-kanni-research"} <= source_ids
    assert "geoname-id=1254163" in source_by_id["drik-kanni-thiruvananthapuram-2027"]["url"]

    localized = {x["language_code"]: x for x in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    for loc in localized.values():
        assert len(loc["origin_narratives"]) == 2
        assert all(not n["universal_origin_claimed"] for n in loc["origin_narratives"])
        assert len(loc["origin_narratives"][1]["summary"]) > 900
        procedures = {p["tier"]: p for p in loc["procedures"]}
        assert [(tier, len(procedures[tier]["steps"])) for tier in ("minimum", "standard", "elaborate")] == [("minimum", 7), ("standard", 7), ("elaborate", 6)]
        assert [s["ordinal"] for p in procedures.values() for s in p["steps"]] == list(range(1,8)) + list(range(1,8)) + list(range(1,7))
        assert len(loc["variants"]) == 6
        assert sum(not v["separate_lane_required"] for v in loc["variants"]) == 1
        assert all(v["separate_lane_required"] for v in loc["variants"][1:])

    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in ("chingam-to-kanni", "not kanni's origin", "no invented kerala-wide puja", "no real person is an enemy or demon", "do not look directly at the sun", "north/shared kanya sankranti", "tools, machinery, workplace", "language, spelling", "punya-kala"):
        assert term in english
    for forbidden in ("every malayali must perform", "all keralites must", "kanni is a universal kerala puja", "accepted kanya panchang", "you should stare at the sun", "you must fast", "donation is mandatory", "kanni is just a translation of kanya", "vishwakarma is kanni puja", "every district needs a separate ritual"):
        assert forbidden not in english
    raw = KANNI_PACK.read_bytes(); raw.decode("utf-8", errors="strict")
    for phrase in ("कन्नि संक्रामम", "चिंगम-से-कन्नि", "सूर्य को सीधे न देखें", "कोई वास्तविक व्यक्ति शत्रु या राक्षस नहीं", "सार्वभौमिक केरल पूजा"):
        assert phrase.encode("utf-8") in raw
    assert b"\xef\xbf\xbd" not in raw and KANNI_PACK.stat().st_size < 100_000

    links = load(KANNI_LINK); Draft202012Validator(link_schema).validate(links)
    assert len(links["proposals"]) == 3
    by_id = {x["proposal_id"]: x for x in links["proposals"]}
    kanya = by_id["kanni-to-reviewed-kanya-calendar-route"]
    assert kanya["target_resolution"] == "lane_local"
    assert kanya["to_ref"]["lane_local_id"] == "ritual-calendar/kanya-sankranti-north-west-shared-household-2027-v1"
    assert "distinct regional naming and accepted calendar/date authority" in kanya["scope"]["statement"]
    assert by_id["kanni-to-existing-bengal-vishwakarma-workplace-lane"]["target_resolution"] == "lane_local"
    story = by_id["kanni-to-aditya-hridaya-story-owner"]
    assert story["target_resolution"] == "unresolved_owner_lane"
    assert "not as Kanni Sankramam's origin" in story["scope"]["statement"]

    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49 and progress["remaining_authoring_items"] == 159
    assert progress["completed_after_freeze"] + progress["remaining_authoring_items"] == 208
    assert progress["completed_lane_ids"].count(pack["lane_id"]) == 1
    assert progress["completed_pack_refs"].count("knowledge_packs/library_lanes/ritual-calendar/packs/kanni-sankramam-kerala-malayalam-solar-household-2027-v1.json") == 1


def test_maha_bharani_authority_router_links_progress_and_adversarial_contract():
    content_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    pack = load(MAHA_BHARANI_PACK)
    Draft202012Validator(content_schema).validate(pack)
    assert pack["lane_id"] == "maha-bharani-ancestor-remembrance-authority-router-2027-v1"
    assert pack["observance_slugs"] == ["maha-bharani"]
    assert {"north-india", "west-india", "IN-WB", "IN-BR", "IN-CG", "IN-KA", "IN-TN", "IN-KL", "IN-MH", "IN-OD", "IN-AP"} <= set(pack["applicability"]["region_codes"])
    assert "authority-routed-shraddha" in pack["applicability"]["tradition_codes"]
    assert pack["calendar"]["timing_kind"] == "mixed"
    assert pack["calendar"]["location_aware"] and pack["calendar"]["tradition_aware"]
    freshness = pack["calendar"]["freshness_note"]
    assert "20 September 2027" in freshness and "19 September" in freshness
    assert "Bharani Nakshatra interval" in freshness and "Pitru Paksha/aparahna" in freshness
    assert "Never copy either date" in freshness

    source_ids = {source["source_id"] for source in pack["sources"]}
    refs = []
    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    assert len(child) == len(set(child))
                    refs.extend(child)
                else:
                    walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)
    walk(pack)
    assert set(refs) <= source_ids
    assert {"drik-bharani-madhubani-rule", "birthastro-shraddha-delhi-2027", "drik-pitru-leavenworth-2027", "maharashtra-gazetteer-yavatmal", "max-muller-katha-upanishad", "devam-pitru-paksha-delhi-2026", "devam-pitru-paksha-remembrance-content", "devam-final-disposition", "india-emergency-112", "devam-maha-bharani-research"} == source_ids
    assert next(source for source in pack["sources"] if source["source_id"] == "max-muller-katha-upanishad")["rights_lane"] == "product_cleared"

    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 2
        assert all(not narrative["universal_origin_claimed"] for narrative in entry["origin_narratives"])
        assert len(entry["origin_narratives"][1]["summary"]) > 800
        procedures = {procedure["tier"]: procedure for procedure in entry["procedures"]}
        assert [(tier, len(procedures[tier]["steps"])) for tier in ("minimum", "standard", "elaborate")] == [("minimum", 7), ("standard", 7), ("elaborate", 6)]
        assert [step["ordinal"] for procedure in procedures.values() for step in procedure["steps"]] == list(range(1, 8)) + list(range(1, 8)) + list(range(1, 7))
        assert all(not material["required"] for procedure in procedures.values() for material in procedure["materials"])
        assert len(entry["variants"]) == 7
        assert sum(not variant["separate_lane_required"] for variant in entry["variants"]) == 1
        assert all(variant["separate_lane_required"] for variant in entry["variants"][1:])

    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in ("not by one fixed tithi or national civil date", "calendar label alone does not decide", "not the observance's origin or shraddha vidhi", "child danger", "good from the merely pleasant", "no item, fast, priest, donation", "do not interpret dreams", "pinda, til, kusa", "once-after-death versus annual", "kodungallur bharani", "language, spelling, dress"):
        assert term in english
    for forbidden in ("all hindus must", "every son must", "only a son may", "women cannot perform", "you must fast", "make a pinda", "offer black sesame", "contact your ancestor", "your ancestor is speaking", "gaya-equivalent merit is guaranteed", "a child should obey the father", "maha bharani is kodungallur bharani", "every state needs a separate ritual"):
        assert forbidden not in english

    raw = MAHA_BHARANI_PACK.read_bytes()
    raw.decode("utf-8", errors="strict")
    for phrase in ("महा भरणी", "नचिकेता", "कोई गढ़ी हुई Shraddha procedure", "सपने, पक्षी, लौ", "Kodungallur Bharani अलग है"):
        assert phrase.encode("utf-8") in raw
    assert b"\xef\xbf\xbd" not in raw and MAHA_BHARANI_PACK.stat().st_size < 100_000

    links = load(MAHA_BHARANI_LINK)
    Draft202012Validator(link_schema).validate(links)
    assert len(links["proposals"]) == 4
    by_id = {proposal["proposal_id"]: proposal for proposal in links["proposals"]}
    existing = by_id["maha-bharani-to-existing-pitru-remembrance"]
    assert existing["target_resolution"] == "lane_local"
    assert existing["to_ref"]["lane_local_id"] == "ritual/pitru-paksha-delhi-remembrance-content-v1"
    assert by_id["maha-bharani-to-formal-shraddha-owner"]["target_resolution"] == "unresolved_owner_lane"
    assert by_id["maha-bharani-to-nachiketa-story-owner"]["target_resolution"] == "unresolved_owner_lane"
    confusion = by_id["maha-bharani-not-kodungallur-bharani"]
    assert confusion["predicate"] == "must_not_be_confused_with"
    assert confusion["target_resolution"] == "unresolved_owner_lane"

    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49 and progress["remaining_authoring_items"] == 159
    assert progress["completed_after_freeze"] + progress["remaining_authoring_items"] == 208
    assert progress["completed_lane_ids"].count(pack["lane_id"]) == 1
    assert progress["completed_pack_refs"].count("knowledge_packs/library_lanes/ritual-calendar/packs/maha-bharani-ancestor-remembrance-authority-router-2027-v1.json") == 1


def test_mahalaya_listening_links_progress_and_adversarial_contract():
    content_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    pack = load(MAHALAYA_PACK)
    Draft202012Validator(content_schema).validate(pack)
    assert pack["lane_id"] == "mahalaya-bengal-transition-listening-participant-2027-v1"
    assert pack["observance_slugs"] == ["mahalaya"]
    assert pack["applicability"]["region_codes"] == ["IN-WB", "bengali-associated-households"]
    assert pack["calendar"]["timing_kind"] == "mixed"
    assert pack["calendar"]["location_aware"] and pack["calendar"]["tradition_aware"]
    freshness = pack["calendar"]["freshness_note"]
    assert "Wednesday 29 September 2027" in freshness
    assert "Resolve every broadcast" in freshness and "current official schedule" in freshness
    assert "Never copy the date, dawn time, station" in freshness

    source_ids = {source["source_id"] for source in pack["sources"]}
    refs = []
    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    assert len(child) == len(set(child)); refs.extend(child)
                else: walk(child)
        elif isinstance(value, list):
            for child in value: walk(child)
    walk(pack)
    assert set(refs) <= source_ids
    assert {"drik-bengali-mahalaya-2027", "drik-pitru-paksha-2027", "wb-aasan-puja-portal-2026", "prasar-annual-2023-24", "prasar-navratri-2021", "devam-pitru-paksha-2026", "devam-pitru-remembrance-content", "devam-final-disposition", "devam-lunar-phase-disposition", "devam-purnima-amavasya-audit", "india-emergency-112", "devam-mahalaya-research"} == source_ids

    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 2
        assert all(not narrative["universal_origin_claimed"] for narrative in entry["origin_narratives"])
        assert len(entry["origin_narratives"][1]["summary"]) > 600
        procedures = {procedure["tier"]: procedure for procedure in entry["procedures"]}
        assert [(tier, len(procedures[tier]["steps"])) for tier in ("minimum", "standard", "elaborate")] == [("minimum", 7), ("standard", 7), ("elaborate", 6)]
        assert [step["ordinal"] for procedure in procedures.values() for step in procedure["steps"]] == list(range(1, 8)) + list(range(1, 8)) + list(range(1, 7))
        assert all(not material["required"] and material["substitutions"] for procedure in procedures.values() for material in procedure["materials"])
        assert len(entry["variants"]) == 8
        assert sum(not variant["separate_lane_required"] for variant in entry["variants"]) == 1
        assert all(variant["separate_lane_required"] for variant in entry["variants"][1:])

    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in ("not automatically sarva pitru shraddha", "not one universal ancestor rite", "does not provide a 2027 schedule", "programme text, music and audio remain protected", "no dawn alarm", "do not record, transcribe, upload, rebroadcast", "no real person or community is a demon or enemy", "tamil mahalaya amavasai", "odia mahalaya amabasya", "language, spelling, dress"):
        assert term in english
    for forbidden in ("every bengali must", "all hindus should wake", "you must listen at dawn", "record the programme", "copy the chandi path", "perform tarpan", "light a lamp", "the goddess will arrive", "your ancestors are speaking", "mahishasura is your enemy", "every state needs a separate mahalaya ritual"):
        assert forbidden not in english

    raw = MAHALAYA_PACK.read_bytes(); raw.decode("utf-8", errors="strict")
    for phrase in ("महालया", "कोई invented Shraddha"):
        assert phrase.encode("utf-8") in raw
    assert "Protected text, music या audio".encode("utf-8") in raw
    assert b"\xef\xbf\xbd" not in raw and MAHALAYA_PACK.stat().st_size < 100_000

    links = load(MAHALAYA_LINK); Draft202012Validator(link_schema).validate(links)
    assert len(links["proposals"]) == 6
    by_id = {proposal["proposal_id"]: proposal for proposal in links["proposals"]}
    assert by_id["mahalaya-to-existing-pitru-remembrance"]["target_resolution"] == "lane_local"
    assert by_id["mahalaya-to-existing-pitru-remembrance"]["to_ref"]["lane_local_id"] == "ritual/pitru-paksha-delhi-remembrance-content-v1"
    for proposal_id in ("mahalaya-to-sarva-pitru-owner", "mahalaya-to-tamil-amavasai-owner", "mahalaya-to-odia-amabasya-owner", "mahalaya-to-devi-owner", "mahalaya-to-current-broadcast-owner"):
        assert by_id[proposal_id]["target_resolution"] == "unresolved_owner_lane"
    assert by_id["mahalaya-to-current-broadcast-owner"]["predicate"] == "requires_current_authorised_schedule_from"

    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49 and progress["remaining_authoring_items"] == 159
    assert progress["completed_after_freeze"] + progress["remaining_authoring_items"] == 208
    assert progress["completed_lane_ids"].count(pack["lane_id"]) == 1
    assert progress["completed_pack_refs"].count("knowledge_packs/library_lanes/ritual-calendar/packs/mahalaya-bengal-transition-listening-participant-2027-v1.json") == 1


def test_sarva_pitru_authority_router_links_progress_and_adversarial_contract():
    content_schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    link_schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    pack = load(SARVA_PITRU_PACK)
    Draft202012Validator(content_schema).validate(pack)
    assert pack["lane_id"] == "sarva-pitru-amavasya-north-west-authority-router-2027-v1"
    assert pack["observance_slugs"] == ["sarva-pitru-amavasya"]
    assert {"north-india", "west-india", "IN-WB", "IN-BR", "IN-CG", "IN-KA", "IN-TN", "IN-KL", "IN-MH", "IN-OD", "IN-AP"} <= set(pack["applicability"]["region_codes"])
    assert "authority-routed-shraddha" in pack["applicability"]["tradition_codes"]
    assert pack["calendar"]["timing_kind"] == "mixed"
    assert pack["calendar"]["location_aware"] and pack["calendar"]["tradition_aware"]
    freshness = pack["calendar"]["freshness_note"]
    assert "Wednesday 29 September 2027" in freshness
    assert "10:54 on 29 September to 08:05 on 30 September" in freshness
    assert "Never copy the date, interval, formal window, ancestors, performer" in freshness

    source_ids = {source["source_id"] for source in pack["sources"]}
    refs = []
    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"source_ids", "resolution_source_ids"}:
                    assert len(child) == len(set(child)); refs.extend(child)
                else: walk(child)
        elif isinstance(value, list):
            for child in value: walk(child)
    walk(pack)
    assert set(refs) <= source_ids
    assert {"drik-pitru-paksha-2027", "drik-amavasya-pandharpur-2027", "drik-amavasya-patna-2027", "utsav-pitra-paksha", "nirnayasindhu-1865-mahalaya-section", "max-muller-katha-upanishad", "devam-pitru-paksha-2026", "devam-pitru-remembrance-content", "devam-lunar-phase-disposition", "devam-purnima-amavasya-audit", "devam-maha-bharani-lane", "devam-mahalaya-listening-lane", "india-emergency-112", "devam-sarva-pitru-research"} == source_ids
    assert next(source for source in pack["sources"] if source["source_id"] == "max-muller-katha-upanishad")["rights_lane"] == "product_cleared"
    assert next(source for source in pack["sources"] if source["source_id"] == "nirnayasindhu-1865-mahalaya-section")["artifact_sha256"] == "a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b"

    localized = {entry["language_code"]: entry for entry in pack["localized_content"]}
    assert set(localized) == {"en", "hi"}
    for entry in localized.values():
        assert len(entry["origin_narratives"]) == 2
        assert all(not narrative["universal_origin_claimed"] for narrative in entry["origin_narratives"])
        assert len(entry["origin_narratives"][1]["summary"]) > 800
        procedures = {procedure["tier"]: procedure for procedure in entry["procedures"]}
        assert [(tier, len(procedures[tier]["steps"])) for tier in ("minimum", "standard", "elaborate")] == [("minimum", 7), ("standard", 7), ("elaborate", 6)]
        assert [step["ordinal"] for procedure in procedures.values() for step in procedure["steps"]] == list(range(1, 8)) + list(range(1, 8)) + list(range(1, 7))
        assert all(not material["required"] and material["substitutions"] for procedure in procedures.values() for material in procedure["materials"])
        assert len(entry["variants"]) == 8
        assert sum(not variant["separate_lane_required"] for variant in entry["variants"]) == 1
        assert all(variant["separate_lane_required"] for variant in entry["variants"][1:])

    english = json.dumps(localized["en"], ensure_ascii=False).lower()
    for term in ("‘sarva’ does not automatically assign every ancestor or performer", "not a universal procedure for every hindu household", "not this observance's origin or shraddha vidhi", "good from the merely pleasant", "the phrase ‘all ancestors’ does not automatically establish eligibility", "do not assemble pinda, til, kusa", "attributed claims, not devam guarantees", "tamil mahalaya amavasai", "odia mahalaya amabasya", "bengal mahalaya transition/listening", "language, spelling, dress"):
        assert term in english
    for forbidden in ("every hindu must", "every son must", "only men may", "women cannot perform", "you must fast", "bathe in a river", "make a pinda", "feed a cow", "donation is mandatory", "your ancestors are satisfied", "pitru debt will be removed", "marriage is guaranteed", "progeny is guaranteed", "a child should obey the father", "every state needs a separate ritual"):
        assert forbidden not in english

    raw = SARVA_PITRU_PACK.read_bytes(); raw.decode("utf-8", errors="strict")
    for phrase in ("सर्वपितृ अमावस्या", "‘Sarva’ automatically हर ancestor", "Liberation, satisfaction, debt release"):
        assert phrase.encode("utf-8") in raw
    assert b"\xef\xbf\xbd" not in raw and SARVA_PITRU_PACK.stat().st_size < 100_000

    links = load(SARVA_PITRU_LINK); Draft202012Validator(link_schema).validate(links)
    assert len(links["proposals"]) == 8
    by_id = {proposal["proposal_id"]: proposal for proposal in links["proposals"]}
    for proposal_id in ("sarva-pitru-to-existing-remembrance", "sarva-pitru-to-maha-bharani", "sarva-pitru-to-mahalaya-listening"):
        assert by_id[proposal_id]["target_resolution"] == "lane_local"
    for proposal_id in ("sarva-pitru-to-formal-owner", "sarva-pitru-to-tamil-owner", "sarva-pitru-to-odia-owner", "sarva-pitru-to-nachiketa-story", "sarva-pitru-to-gaya-ghat-owner"):
        assert by_id[proposal_id]["target_resolution"] == "unresolved_owner_lane"
    assert by_id["sarva-pitru-to-maha-bharani"]["directionality"] == "bidirectional"
    assert by_id["sarva-pitru-to-mahalaya-listening"]["directionality"] == "bidirectional"

    progress = load(AUTHORING_PROGRESS)
    assert progress["completed_after_freeze"] == 49 and progress["remaining_authoring_items"] == 159
    assert progress["completed_after_freeze"] + progress["remaining_authoring_items"] == 208
    assert progress["completed_lane_ids"].count(pack["lane_id"]) == 1
    assert progress["completed_pack_refs"].count("knowledge_packs/library_lanes/ritual-calendar/packs/sarva-pitru-amavasya-north-west-authority-router-2027-v1.json") == 1

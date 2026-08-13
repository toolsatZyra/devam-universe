"""Adversarial contract checks for eleven monthly-Purnima lanes."""

from __future__ import annotations

import json
from pathlib import Path

from jsonschema import Draft202012Validator


ROOT = Path(__file__).resolve().parents[1]
LANE = ROOT / "knowledge_packs" / "library_lanes" / "ritual-calendar"
KEYS = [
    "pausha", "magha", "phalguna", "chaitra", "vaishakha", "jyeshtha",
    "ashadha", "shravana", "ashwina", "kartika", "margashirsha",
]
PACKS = {
    key: LANE / "packs" / f"{key}-purnima-recurring-household-2027-v1.json"
    for key in KEYS
}
LINKS = LANE / "cross-links" / "monthly-purnima-batch-11-owner-and-story-proposals-v1.json"
PROGRESS = LANE / "inventory" / "ritual-calendar-authoring-progress-v1.json"
RESEARCH = LANE / "research" / "monthly-purnima-batch-11-evidence-matrix-2027-v1.md"


def load(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def localized(pack, lang):
    return next(x for x in pack["localized_content"] if x["language_code"] == lang)


def lower_text(pack, lang):
    return json.dumps(localized(pack, lang), ensure_ascii=False).lower()


def walk_source_ids(value):
    if isinstance(value, dict):
        for key, child in value.items():
            if key in {"source_ids", "resolution_source_ids"}:
                yield from child
            yield from walk_source_ids(child)
    elif isinstance(value, list):
        for child in value:
            yield from walk_source_ids(child)


def test_purnima_batch_schema_utf8_source_closure_and_parity():
    schema = load(ROOT / "schemas" / "ritual-observance-content-v1.schema.json")
    for key, path in PACKS.items():
        raw = path.read_bytes()
        text = raw.decode("utf-8", errors="strict")
        assert "\ufffd" not in text
        pack = json.loads(text)
        Draft202012Validator(schema).validate(pack)
        assert pack["lane_id"] == f"{key}-purnima-recurring-household-2027-v1"
        assert pack["observance_slugs"] == [f"{key}-purnima"]
        assert {x["language_code"] for x in pack["localized_content"]} == {"en", "hi"}
        assert all(len(x["procedures"]) == 3 for x in pack["localized_content"])
        assert all(len(x["origin_narratives"]) == 2 for x in pack["localized_content"])
        declared = {x["source_id"] for x in pack["sources"]}
        assert set(walk_source_ids(pack)) <= declared
        assert pack["calendar"]["location_aware"] is True
        assert pack["calendar"]["tradition_aware"] is True
        assert pack["calendar"]["live_schedule_required"] is True
        assert pack["product_status"]["classification"] == "user_complete_lane"
        assert all(pack["product_status"]["completed_dimensions"].values())


def test_purnima_batch_rejects_template_leaks_and_portable_dates():
    expected_dates = {
        "pausha": "22 january 2027", "magha": "20 february 2027",
        "phalguna": "22 march 2027", "chaitra": "20 april 2027",
        "vaishakha": "20 may 2027", "jyeshtha": "18 june 2027",
        "ashadha": "18 july 2027", "shravana": "17 august 2027",
        "ashwina": "15 october 2027", "kartika": "14 november 2027",
        "margashirsha": "13 december 2027",
    }
    for key, pack in ((k, load(p)) for k, p in PACKS.items()):
        en = lower_text(pack, "en")
        assert expected_dates[key] in en
        whole = json.dumps(pack, ensure_ascii=False).lower()
        assert "fixture" in en and "recompute" in whole
        body = json.dumps({k: pack[k] for k in ("lane_id", "observance_slugs", "applicability", "calendar", "localized_content")}, ensure_ascii=False).lower()
        body = body.replace("devam-bhadrapada-purnima-lane", "reviewed-base")
        for leak in ("bhadrapada", "भाद्रपद", "15 september 2027", "02:50:11", "04:35:02"):
            assert leak not in body, (key, leak)
        assert "displayed local tithi interval" in whole or "clock" in whole


def test_purnima_batch_major_variants_only_selected_states_and_owner_routing():
    required_regions = {
        "north-india", "west-india", "IN-MH", "IN-WB", "IN-BR", "IN-CG",
        "IN-KA", "IN-TN", "IN-KL", "IN-OD", "IN-AP",
    }
    for pack in map(load, PACKS.values()):
        assert required_regions <= set(pack["applicability"]["region_codes"])
        for lc in pack["localized_content"]:
            variants = lc["variants"]
            minor = [x for x in variants if not x["separate_lane_required"]]
            assert len(minor) == 1
            assert "selected-states-minor-expression" in minor[0]["variant_id"]
            assert ("language" in minor[0]["difference"].lower() or "भाषा" in minor[0]["difference"])
            assert any("named-overlay-owner" in x["variant_id"] for x in variants)
            for variant in variants:
                if variant["separate_lane_required"]:
                    assert any(term in variant["difference"].lower() for term in (
                        "timing", "date", "owner", "separate", "authority", "eligibility",
                        "materials", "fire", "water", "crowd", "schedule", "ritual",
                        "practice", "fast", "temple", "vidhi", "route", "कार्यक्रम",
                        "narrative", "officiation", "offerings", "prasada", "story",
                        "अलग", "owner", "institutions",
                    )), variant


def test_purnima_batch_safe_generic_answer_and_no_universal_named_rite():
    required = [
        "normal", "medicine", "fast", "required", "moon visibility",
        "donation", "112", "illness", "not this day's universal origin",
    ]
    forbidden = [
        "everyone must fast", "must take a holy dip", "must view the moon",
        "perform satyanarayana puja as follows", "guarantees prosperity",
        "illness is punishment", "all states perform this ritual",
    ]
    for key, pack in ((k, load(p)) for k, p in PACKS.items()):
        en = lower_text(pack, "en")
        assert all(term in en for term in required), (key, [x for x in required if x not in en])
        assert all(term not in en for term in forbidden), key
        for term in ("satyanarayana", "shraddha", "anvadhan/ishti", "named"):
            assert term in en
        assert "soma" in en and "rohini" in en and "daksha" in en and "prabhasa" in en


def test_purnima_batch_preserves_material_month_overlays_and_vrat_splits():
    expected = {
        "pausha": ("shakambhari",),
        "magha": ("holy-dip", "masi magam"),
        "phalguna": ("holika dahan", "dol purnima"),
        "chaitra": ("hanuman jayanti",),
        "vaishakha": ("buddha purnima", "outside this selected sanatana lane"),
        "jyeshtha": ("vat purnima", "snana yatra"),
        "ashadha": ("guru/vyasa purnima", "buddhist ashadha"),
        "shravana": ("raksha bandhan", "narali/gamha", "upakarma/jandhyala"),
        "ashwina": ("sharad purnima", "kojagari lakshmi"),
        "kartika": ("dev deepawali", "tripurari", "boita"),
        "margashirsha": ("dattatreya jayanti", "annapurna"),
    }
    for key, terms in expected.items():
        en = lower_text(load(PACKS[key]), "en")
        assert all(term in en for term in terms), (key, terms)
    for key, actual, vrat in (("shravana", "17 august", "16 august"), ("kartika", "14 november", "13 november")):
        pack = load(PACKS[key])
        en = lower_text(pack, "en")
        assert actual in en and vrat in en
        assert any("actual-versus-vrat-date" in x["variant_id"] for x in localized(pack, "en")["variants"])
        assert "not silently merged" in en


def test_purnima_batch_cross_links_and_progress_reconcile():
    schema = load(ROOT / "schemas" / "cross-lane-link-proposal-v1.schema.json")
    links = load(LINKS)
    Draft202012Validator(schema).validate(links)
    ids = [x["proposal_id"] for x in links["proposals"]]
    assert len(ids) == len(set(ids))
    for key in KEYS:
        for suffix in ("to-generic-base", "to-soma-story", "to-satyanarayana-owner", "to-institution-owner"):
            assert f"{key}-purnima-{suffix}" in ids
    by_id = {x["proposal_id"]: x for x in links["proposals"]}
    assert by_id["chaitra-purnima-to-hanuman-owner"]["target_resolution"] == "lane_local"
    assert by_id["jyeshtha-purnima-to-vat-owner"]["target_resolution"] == "lane_local"
    assert by_id["ashadha-purnima-to-guru-owner"]["target_resolution"] == "lane_local"
    assert by_id["shravana-purnima-to-upakarma-owner"]["target_resolution"] == "unresolved_owner_lane"

    progress = load(PROGRESS)
    assert progress["accepted_authoring_denominator"] == 208
    assert progress["completed_after_freeze"] == 170
    assert progress["remaining_authoring_items"] == 38
    assert progress["completed_after_freeze"] + progress["remaining_authoring_items"] == 208
    for key in KEYS:
        lane_id = f"{key}-purnima-recurring-household-2027-v1"
        assert progress["completed_lane_ids"].count(lane_id) == 1
        assert progress["completed_pack_refs"].count(
            f"knowledge_packs/library_lanes/ritual-calendar/packs/{lane_id}.json"
        ) == 1


def test_purnima_batch_research_matrix_complete_and_honest():
    text = RESEARCH.read_bytes().decode("utf-8", errors="strict")
    assert "\ufffd" not in text
    for title in ("Pausha", "Magha", "Phalguna", "Chaitra", "Vaishakha", "Jyeshtha", "Ashadha", "Shravana", "Ashwina", "Kartika", "Margashirsha"):
        assert f"{title} Purnima" in text
    for term in (
        "does not count a lane as authored",
        "actual Purnima day from a Purnima-vrat",
        "No reviewed evidence establishes a generic state-by-state",
        "permission/partnership pending",
        "Major variants only",
    ):
        assert term in text

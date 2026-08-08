#!/usr/bin/env python3
"""Migrate the retained Pradosha and generic lunar-day packs to the current contract."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any

from build_early_diwali_content_batch_v1 import convert_procedures, source, status
from build_late_diwali_content_batch_v1 import assert_source_references


ROOT = Path(__file__).resolve().parents[1]
PACK_DIR = ROOT / "knowledge_packs" / "rituals"
INPUTS = {
    "pradosha-north-west-v1.json": (21638, "d773662d7751fed4e6a3704ef3cb40432cddff7be8298e9786293295ad6b647a"),
    "purnima-amavasya-north-west-india-v1.json": (27855, "fe870a95c60212300f0fae8e3bd0b21e826f64391f805e8c6f3990bcb09e957d"),
}
OUTPUTS = {
    "pradosha": PACK_DIR / "pradosha-north-west-content-v1.json",
    "lunar_days": PACK_DIR / "purnima-amavasya-north-west-india-content-v1.json",
}


def load_fixed(name: str) -> dict[str, Any]:
    path = PACK_DIR / name
    payload = path.read_bytes()
    expected_size, expected_hash = INPUTS[name]
    if len(payload) != expected_size or hashlib.sha256(payload).hexdigest() != expected_hash:
        raise ValueError(f"retained input drift: {name}")
    return json.loads(payload.decode("utf-8"))


def convert_sources(legacy: dict[str, Any], legacy_name: str) -> list[dict[str, Any]]:
    rights = {
        "reference_only": "citation_only",
        "private_evidence": "internal_only",
        "derivative_allowed": "derivative_allowed",
    }
    converted = []
    for item in legacy["sources"]:
        converted.append(source(
            item["source_id"],
            item["title"],
            item["publisher"],
            item.get("evidence_role", item.get("source_class", "Retained bounded evidence")),
            rights[item["rights_lane"]],
            url=item.get("url"),
            artifact_sha256=item.get("artifact_sha256"),
            citation_coordinates={"legacy_pack": f"knowledge_packs/rituals/{legacy_name}"} if item.get("artifact_sha256") else None,
            observed_fetch=item.get("observed_fetch"),
        ))
    return converted


def pradosha_details(language: str) -> dict[str, Any]:
    english = language == "en"
    return {
        "significance": {
            "text": (
                "In this bounded North/West India Smarta lane, Pradosha is the locally resolved Trayodashi twilight for Shiva-Parvati remembrance. The fortnightly Krishna and Shukla occurrences remain distinct, and a weekday label does not create a planetary remedy or promised result."
                if english else
                "इस सीमित उत्तर/पश्चिम भारत स्मार्त मार्ग में प्रदोष स्थानीय त्रयोदशी-संध्या पर शिव-पार्वती स्मरण का समय है। कृष्ण और शुक्ल पक्ष के अवसर अलग रहते हैं; वार का नाम किसी ग्रह-उपाय या निश्चित फल का निर्देश नहीं बनता।"
            ),
            "source_ids": ["devam-pradosha-calendar-fixture", "nirnayasindhu-1865-general-naktavrata-context", "drikpanchang-delhi-pradosha-2026"],
            "scope_note": "Complete only as an accessible remembrance lane for the eight resolved occurrences; it is not a universal fast, puja, abhisheka, mantra, temple programme, or Shaiva doctrine.",
        },
        "origin_narratives": [{
            "narrative_id": "surutapalli-regional-pradosha-account",
            "title": "A regional Pradosha account" if english else "प्रदोष की एक क्षेत्रीय कथा",
            "summary": (
                "The official Surutapalli account preserves one regional Shiva-Parvati and Nandi context. It is offered as an attributable story, not as the universal origin of Pradosha or a North/West India home procedure."
                if english else
                "सुरुट्टपल्ली का आधिकारिक विवरण शिव-पार्वती और नंदी से जुड़ा एक क्षेत्रीय संदर्भ सुरक्षित रखता है। यह स्रोत-चिह्नित कथा है, प्रदोष की सार्वभौमिक उत्पत्ति या उत्तर/पश्चिम भारत की गृह-विधि नहीं।"
            ),
            "tradition_scope": "Surutapalli regional account only",
            "source_ids": ["incredible-india-surutapalli-pradosha-context"],
            "universal_origin_claimed": False,
        }],
        "typical_practices": [
            {
                "practice_id": "family-known-shiva-parvati-remembrance",
                "population_scope": "Supported North/West India Smarta individual or household context",
                "description": "A familiar prayer, identified reading, quiet reflection, and responsible action form an accessible non-fasting companion; exact family practice overrides it." if english else "परिचित प्रार्थना, पहचाना हुआ पाठ, शांत चिंतन और एक जिम्मेदार कार्य सरल गैर-उपवास सहचर बनाते हैं; परिवार की स्थापित रीति को प्राथमिकता है।",
                "source_ids": ["devam-pradosha-safety-boundary", "incredible-india-surutapalli-pradosha-context"],
                "instructional": False,
            },
            {
                "practice_id": "institutional-temple-pradosham",
                "population_scope": "Named institutional temple programme only",
                "description": "The New York temple page demonstrates a temple-led Pradosham programme; its liturgy is not exported into the home sequence." if english else "न्यूयॉर्क मंदिर का पृष्ठ मंदिर-नेतृत्व वाले प्रदोष कार्यक्रम का उदाहरण देता है; उसकी विधि गृह-क्रम में नहीं लाई जाती।",
                "source_ids": ["nyganeshtemple-pradosham-institutional-context"],
                "instructional": False,
            },
        ],
        "variants": [
            {"variant_id": "krishna-and-shukla-paksha", "scope": "Eight September-December 2026 occurrences", "difference": "Krishna and Shukla Paksha occurrences retain their own date identity even though the accessible companion is shared.", "source_ids": ["devam-pradosha-calendar-fixture", "drikpanchang-delhi-pradosha-2026"], "separate_lane_required": False},
            {"variant_id": "surutapalli-regional-context", "scope": "Surutapalli regional tradition", "difference": "The official regional account and Nandi context remain attributable and are not universalized.", "source_ids": ["incredible-india-surutapalli-pradosha-context"], "separate_lane_required": True},
            {"variant_id": "institutional-temple-programme", "scope": "Named temple programmes", "difference": "Temple worship remains under the responsible institution and is not a generic home vidhi.", "source_ids": ["nyganeshtemple-pradosham-institutional-context"], "separate_lane_required": True},
        ],
        "safety_and_boundaries": [
            "Do not start, extend, or break a fast from this guide.",
            "No food, health, abhisheka, lingam, Nandi, mantra, aarti, offering, pradakshina, muhurta, parana, priestly, planetary-remedy, or promised-outcome instruction is supplied.",
            "Use the material-free and flame-free form whenever it suits the user or setting.",
            "A family, temple, sampradaya, or initiated authority controls any established formal practice.",
        ],
    }


def build_pradosha() -> dict[str, Any]:
    legacy_name = "pradosha-north-west-v1.json"
    legacy = load_fixed(legacy_name)
    if legacy["contract"] != "DEVAM_MULTI_LANE_RITUAL_PROCEDURE_PACK_V1" or legacy["pack_id"] != "devam-pradosha-north-west-v1":
        raise ValueError("Pradosha identity drift")
    lane_id = "pradosha-north-west-content-v1"
    localized = []
    for guide in legacy["guides"]:
        language = guide["language_code"]
        details = pradosha_details(language)
        localized.append({
            "language_code": language,
            "title": guide["title"],
            "short_answer": guide["summary"],
            "significance": details["significance"],
            "origin_narratives": details["origin_narratives"],
            "typical_practices": details["typical_practices"],
            "procedures": convert_procedures(
                guide, lane_id,
                {"minimum": "Self-guided remembrance", "standard": "Individual or household reflection", "elaborate": "Established family- or temple-led participation"},
                ["devam-pradosha-safety-boundary"],
                ["devam-pradosha-safety-boundary"],
            ),
            "variants": details["variants"],
            "safety_and_boundaries": details["safety_and_boundaries"],
        })
    pack = {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1",
        "lane_id": lane_id,
        "supersedes_legacy_pack_ids": [legacy["pack_id"]],
        "observance_slugs": legacy["observance_slugs"],
        "applicability": {
            "region_codes": ["north-india", "west-india"],
            "tradition_codes": ["smarta-north-india", "smarta-west-india"],
            "context_pairs": legacy["scope"]["supported_pairs"],
            "settings": ["individual", "household", "family_led", "temple"],
            "family_practice_overrides_generic_guidance": True,
            "material_context_questions": legacy["guides"][0]["context_prompts"],
        },
        "calendar": {
            "resolution_source_ids": ["devam-pradosha-calendar-fixture", "nirnayasindhu-1865-general-naktavrata-context", "drikpanchang-delhi-pradosha-2026"],
            "timing_kind": "textual_rule",
            "location_aware": True,
            "tradition_aware": True,
            "decision_rule_id": "devam-pradosha-trayodashi-twilight-v1",
            "closing_decision_rule_id": None,
            "live_schedule_required": True,
            "freshness_note": "Resolve Trayodashi overlap with local Pradosha for the user's place. The guide supplies no generic puja muhurta or parana.",
        },
        "sources": convert_sources(legacy, legacy_name),
        "localized_content": localized,
        "product_status": status(),
    }
    assert_source_references(pack)
    return pack


def lunar_details(kind: str, language: str) -> dict[str, Any]:
    english = language == "en"
    purnima = kind == "purnima"
    safety = "devam-purnima-amavasya-safety-boundary"
    calendar_source = "drikpanchang-delhi-purnima-2026" if purnima else "drikpanchang-delhi-amavasya-2026"
    return {
        "significance": {
            "text": (
                ("This bounded Purnima calendar-day lane supports gratitude, attributable study, completion, and voluntary service while keeping every named Purnima vrata or festival separate.")
                if purnima else
                ("This bounded Amavasya calendar-day lane supports private remembrance, review, responsibility, and repair without impersonating shraddha, tarpan, Darsha, or another inherited rite.")
            ) if english else (
                ("यह सीमित पूर्णिमा पंचांग-दिवस कृतज्ञता, स्रोत-चिह्नित अध्ययन, पूर्णता और स्वैच्छिक सेवा का सहचर है; हर नामित पूर्णिमा व्रत या पर्व अलग रहता है।")
                if purnima else
                ("यह सीमित अमावस्या पंचांग-दिवस निजी स्मरण, समीक्षा, जिम्मेदारी और सुधार का सहचर है; यह श्राद्ध, तर्पण, दर्श या किसी विरासत-विधि का अभिनय नहीं करता।")
            ),
            "source_ids": ["nirnayasindhu-1865-purnima-amavasya-calendar-rule", calendar_source, safety],
            "scope_note": "Complete only for the generic named calendar-day companion; special festivals, vratas, ancestor rites, temple programmes, and regional procedures require their own evidence lanes.",
        },
        "origin_narratives": [{
            "narrative_id": f"generic-{kind}-no-universal-origin",
            "title": "No universal origin narrative" if english else "कोई एक सार्वभौमिक उत्पत्ति-कथा नहीं",
            "summary": (
                "The retained evidence resolves a generic lunar calendar day but does not establish one origin story for all observances that share it. Named stories remain attached to their own festival or tradition."
                if english else
                "संचित साक्ष्य सामान्य चंद्र-दिवस को तय करता है, पर उस दिन आने वाले सभी अनुष्ठानों की एक उत्पत्ति-कथा सिद्ध नहीं करता। नामित कथाएँ अपने पर्व या परम्परा के साथ रहती हैं।"
            ),
            "tradition_scope": "Generic calendar-day boundary only",
            "source_ids": ["nirnayasindhu-1865-purnima-amavasya-calendar-rule", calendar_source, safety],
            "universal_origin_claimed": False,
        }],
        "typical_practices": [{
            "practice_id": f"generic-{kind}-reflection",
            "population_scope": "Supported North/West India Smarta generic calendar-day companion",
            "description": (
                ("Gratitude, source-labelled study, review of completed responsibilities, and optional service are bounded non-fasting practices; named Purnima worship remains separate.")
                if purnima else
                ("Private remembrance, review of inherited care, responsibility, and a small repair or service action are bounded practices; formal ancestor rites remain separate.")
            ) if english else (
                ("कृतज्ञता, स्रोत-चिह्नित अध्ययन, पूरी हुई जिम्मेदारियों की समीक्षा और वैकल्पिक सेवा सीमित गैर-उपवास अभ्यास हैं; नामित पूर्णिमा-पूजन अलग है।")
                if purnima else
                ("निजी स्मरण, मिली हुई देखभाल की समीक्षा, जिम्मेदारी और छोटा सुधार या सेवा-कार्य सीमित अभ्यास हैं; औपचारिक पितृ-कर्म अलग हैं।")
            ),
            "source_ids": [safety, calendar_source],
            "instructional": False,
        }],
        "variants": [
            {"variant_id": f"named-{kind}-observances", "scope": f"Named {kind.title()} festivals and vratas", "difference": "A shared lunar date does not merge their stories, authorities, timing windows, or procedures into this generic companion.", "source_ids": [calendar_source, safety], "separate_lane_required": True},
            {"variant_id": "family-and-regional-practice", "scope": "Family, regional, temple, vrata, and sampradaya forms", "difference": "Living inherited practice overrides the generic reflection and requires its own authority and evidence.", "source_ids": [safety], "separate_lane_required": True},
        ],
        "safety_and_boundaries": [
            "Do not begin, extend, or break a fast from this generic companion.",
            "No food, medical, ritual-bath, moon-worship, offering, mantra, temple-procedure, shraddha, tarpan, Darsha, ancestor-rite, or promised-outcome instruction is supplied.",
            "Coincident Kojagara, Kartika Purnima, Dev Deepawali, Diwali, and every other named observance remain separate.",
            "A family or responsible living authority controls any inherited practice.",
        ],
    }


def build_lunar_days() -> dict[str, Any]:
    legacy_name = "purnima-amavasya-north-west-india-v1.json"
    legacy = load_fixed(legacy_name)
    if legacy["contract"] != "DEVAM_RECURRING_RITUAL_PROCEDURE_PACK_V1" or legacy["pack_id"] != "devam-purnima-amavasya-north-west-india-v1":
        raise ValueError("Purnima/Amavasya identity drift")
    lane_id = "purnima-amavasya-north-west-india-content-v1"
    slug_groups = {
        "purnima": [slug for slug in legacy["observance_slugs"] if "purnima" in slug],
        "amavasya": [slug for slug in legacy["observance_slugs"] if "amavasya" in slug],
    }
    localized = []
    for guide in legacy["guides"]:
        kind = guide["guide_kind"]
        language = guide["language_code"]
        details = lunar_details(kind, language)
        localized.append({
            "language_code": language,
            "observance_slugs": slug_groups[kind],
            "title": guide["title"],
            "short_answer": guide["summary"],
            "significance": details["significance"],
            "origin_narratives": details["origin_narratives"],
            "typical_practices": details["typical_practices"],
            "procedures": convert_procedures(
                guide, f"{lane_id}-{kind}",
                {"minimum": "Self-guided reflection", "standard": "Individual or household reflection", "elaborate": "Established family- or community-led participation"},
                ["devam-purnima-amavasya-safety-boundary"],
                ["devam-purnima-amavasya-safety-boundary"],
            ),
            "variants": details["variants"],
            "safety_and_boundaries": details["safety_and_boundaries"],
        })
    pack = {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1",
        "lane_id": lane_id,
        "supersedes_legacy_pack_ids": [legacy["pack_id"]],
        "observance_slugs": legacy["observance_slugs"],
        "applicability": {
            "region_codes": ["north-india", "west-india"],
            "tradition_codes": ["smarta-north-india", "smarta-west-india"],
            "context_pairs": legacy["scope"]["region_tradition_pairs"],
            "settings": ["individual", "household", "family_led", "community"],
            "family_practice_overrides_generic_guidance": True,
            "material_context_questions": legacy["guides"][0]["context_prompts"],
        },
        "calendar": {
            "resolution_source_ids": ["nirnayasindhu-1865-purnima-amavasya-calendar-rule", "drikpanchang-delhi-purnima-2026", "drikpanchang-delhi-amavasya-2026"],
            "timing_kind": "textual_rule",
            "location_aware": True,
            "tradition_aware": True,
            "decision_rule_id": "devam-generic-purnima-amavasya-calendar-day-v1",
            "closing_decision_rule_id": None,
            "live_schedule_required": True,
            "freshness_note": "Resolve the named lunar day for the user's location and profile. A coincident named festival or inherited rite remains a separate lane.",
        },
        "sources": convert_sources(legacy, legacy_name),
        "localized_content": localized,
        "product_status": status(),
    }
    assert_source_references(pack)
    return pack


def render(pack: dict[str, Any]) -> bytes:
    return (json.dumps(pack, ensure_ascii=False, indent=2, sort_keys=True) + "\n").encode("utf-8")


def main() -> None:
    if any(path.exists() for path in OUTPUTS.values()):
        raise FileExistsError("Refusing to overwrite a current-contract output")
    built = {"pradosha": build_pradosha(), "lunar_days": build_lunar_days()}
    results = []
    for key, pack in built.items():
        payload = render(pack)
        OUTPUTS[key].write_bytes(payload)
        results.append({"path": str(OUTPUTS[key].relative_to(ROOT)), "bytes": len(payload), "sha256": hashlib.sha256(payload).hexdigest()})
    print(json.dumps(results, ensure_ascii=False))


if __name__ == "__main__":
    main()

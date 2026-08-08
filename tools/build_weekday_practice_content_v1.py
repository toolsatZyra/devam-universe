#!/usr/bin/env python3
"""Expand the bounded West India weekday template into seven current product lanes."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any

from build_early_diwali_content_batch_v1 import convert_procedures, load, source, status
from build_late_diwali_content_batch_v1 import assert_source_references


ROOT = Path(__file__).resolve().parents[1]
PACK_DIR = ROOT / "knowledge_packs" / "rituals"
OUTPUT = PACK_DIR / "weekday-practice-west-india-content-v1.json"
LEGACY_PATH = PACK_DIR / "weekday-practice-west-india-v1.json"
EXPECTED = (26488, "7d207a537763600529f59002cfa89ece4d9cdb3f904538aad9b398756ec09269")


def verify_input() -> None:
    payload = LEGACY_PATH.read_bytes()
    if len(payload) != EXPECTED[0] or hashlib.sha256(payload).hexdigest() != EXPECTED[1]:
        raise ValueError("Weekday practice frozen input drift")


def render(value: Any, replacements: dict[str, str]) -> Any:
    if isinstance(value, str):
        for key, replacement in replacements.items():
            value = value.replace("{" + key + "}", replacement)
        return value
    if isinstance(value, list):
        return [render(item, replacements) for item in value]
    if isinstance(value, dict):
        return {key: render(item, replacements) for key, item in value.items()}
    return value


def details(profile: dict[str, Any], language: str) -> dict[str, Any]:
    english = language == "en"
    display = profile["display_name_en" if english else "display_name_hi"]
    focus = profile["focus_en" if english else "focus_hi"]
    reflection = profile["reflection_en" if english else "reflection_hi"]
    safety = profile["safety_note_en" if english else "safety_note_hi"]
    if english:
        return {
            "significance": {
                "text": f"{display} can provide a gentle weekly rhythm around {focus}. The cited mapping is one Maharashtra/West India practice context, so the useful product claim is an optional rhythm of remembrance, reflection and action—not a universal rule for the day.",
                "source_ids": list(dict.fromkeys(profile["source_ids"] + ["baps-daily-puja"])),
                "scope_note": "Family, kula, sampradaya and temple practice override this optional West India suggestion.",
            },
            "origin_narratives": [{
                "narrative_id": f"{profile['practice_slug']}-regional-association",
                "title": f"The cited {display} association",
                "summary": f"The Maharashtra state encyclopaedia preserves one regional weekday mapping. This lane keeps {focus} attached to that source and does not turn the mapping into an exclusive national origin story.",
                "tradition_scope": "One cited Maharashtra/West India association",
                "source_ids": profile["source_ids"],
                "universal_origin_claimed": False,
            }],
            "typical_practices": [
                {
                    "practice_id": f"{profile['practice_slug']}-simple-rhythm",
                    "population_scope": "West India Smarta individual or household when the association fits family practice",
                    "description": f"Use a known name, prayer, reading or quiet remembrance connected with {focus}, then express {reflection} through one practical decision or act of service.",
                    "source_ids": list(dict.fromkeys(profile["source_ids"] + ["maharashtra-gazetteer-household-puja", "baps-daily-puja", "devam-weekday-safety-boundary"])),
                    "instructional": False,
                },
                {
                    "practice_id": f"{profile['practice_slug']}-established-family-form",
                    "population_scope": "Family, temple or sampradaya participant",
                    "description": "Use the established local sequence when one exists; otherwise the accessible form remains complete without adding a fast, formal mantra, remedy or elaborate material.",
                    "source_ids": ["maharashtra-gazetteer-household-puja", "baps-daily-puja", "devam-weekday-safety-boundary"],
                    "instructional": False,
                },
            ],
            "variants": [
                {
                    "variant_id": f"{profile['practice_slug']}-family-mapping",
                    "scope": "Family, regional, temple and sampradaya weekday associations",
                    "difference": f"Another household may use a different deity, prayer, vrata or no special observance on {display}; Sarthi should ask rather than assume.",
                    "source_ids": profile["source_ids"] + ["devam-weekday-safety-boundary"],
                    "separate_lane_required": True,
                },
                {
                    "variant_id": f"{profile['practice_slug']}-practice-depth",
                    "scope": "Five-minute, fifteen-minute and family-led forms",
                    "difference": "More time deepens known prayer, reading and service; it does not authorize invented rites or imply that the short form is deficient.",
                    "source_ids": ["baps-daily-puja", "devam-weekday-safety-boundary"],
                    "separate_lane_required": False,
                },
            ],
            "safety_and_boundaries": [
                safety,
                "No fast, food rule, health advice, astrological remedy, planetary appeasement, priest-led mantra or guaranteed outcome is supplied.",
                "A lamp, incense, water, flower, food offering, purchase or temple visit is optional and must be safe and already appropriate to the user's practice.",
                "The app does not replace a living guru, family elder, temple or sampradaya authority.",
            ],
        }
    return {
        "significance": {
            "text": f"{display} को {focus} के साथ एक कोमल साप्ताहिक लय बनाया जा सकता है। उद्धृत सम्बन्ध महाराष्ट्र/पश्चिम भारत के एक अभ्यास का संदर्भ है; उपयोगी दावा वैकल्पिक स्मरण, चिंतन और कर्म है—दिन का सार्वभौमिक नियम नहीं।",
            "source_ids": list(dict.fromkeys(profile["source_ids"] + ["baps-daily-puja"])),
            "scope_note": "परिवार, कुल, सम्प्रदाय और मंदिर की परम्परा इस वैकल्पिक पश्चिम भारत सुझाव से पहले आती है।",
        },
        "origin_narratives": [{
            "narrative_id": f"{profile['practice_slug']}-regional-association",
            "title": f"उद्धृत {display} सम्बन्ध",
            "summary": f"महाराष्ट्र राज्य विश्वकोश एक क्षेत्रीय वार-सम्बन्ध सुरक्षित रखता है। यह मार्ग {focus} को उसी स्रोत से जोड़ता है और उसे पूरे भारत की एकमात्र मूल-कथा नहीं बनाता।",
            "tradition_scope": "एक उद्धृत महाराष्ट्र/पश्चिम भारत सम्बन्ध",
            "source_ids": profile["source_ids"],
            "universal_origin_claimed": False,
        }],
        "typical_practices": [
            {
                "practice_id": f"{profile['practice_slug']}-simple-rhythm",
                "population_scope": "जब पारिवारिक अभ्यास से मेल हो तब पश्चिम भारत स्मार्त व्यक्ति या परिवार",
                "description": f"{focus} से जुड़ा परिचित नाम, प्रार्थना, पाठ या मौन स्मरण लें और {reflection} को एक व्यावहारिक निर्णय या सेवा में उतारें।",
                "source_ids": list(dict.fromkeys(profile["source_ids"] + ["maharashtra-gazetteer-household-puja", "baps-daily-puja", "devam-weekday-safety-boundary"])),
                "instructional": False,
            },
            {
                "practice_id": f"{profile['practice_slug']}-established-family-form",
                "population_scope": "परिवार, मंदिर या सम्प्रदाय सहभागी",
                "description": "स्थापित स्थानीय क्रम हो तो उसे मानें; अन्यथा सुलभ रूप उपवास, औपचारिक मंत्र, उपाय या विस्तृत सामग्री जोड़े बिना पूर्ण है।",
                "source_ids": ["maharashtra-gazetteer-household-puja", "baps-daily-puja", "devam-weekday-safety-boundary"],
                "instructional": False,
            },
        ],
        "variants": [
            {
                "variant_id": f"{profile['practice_slug']}-family-mapping",
                "scope": "पारिवारिक, क्षेत्रीय, मंदिर और सम्प्रदायिक वार-सम्बन्ध",
                "difference": f"दूसरा परिवार {display} पर अलग देवता, प्रार्थना, व्रत या कोई विशेष पालन न रख सकता है; Sārthi को मान लेने के बजाय पूछना चाहिए।",
                "source_ids": profile["source_ids"] + ["devam-weekday-safety-boundary"],
                "separate_lane_required": True,
            },
            {
                "variant_id": f"{profile['practice_slug']}-practice-depth",
                "scope": "पाँच-मिनट, पन्द्रह-मिनट और परिवार-निर्देशित रूप",
                "difference": "अधिक समय परिचित प्रार्थना, पाठ और सेवा को गहरा करता है; वह गढ़ी विधि का अधिकार नहीं देता और छोटे रूप को अधूरा नहीं बनाता।",
                "source_ids": ["baps-daily-puja", "devam-weekday-safety-boundary"],
                "separate_lane_required": False,
            },
        ],
        "safety_and_boundaries": [
            safety,
            "उपवास, भोजन-नियम, स्वास्थ्य-सलाह, ज्योतिषीय उपाय, ग्रह-शान्ति, पुरोहित-मंत्र या निश्चित फल नहीं दिया जाता।",
            "दीप, धूप, जल, फूल, भोजन-अर्पण, खरीद या मंदिर-यात्रा वैकल्पिक और उपयोगकर्ता की परम्परा में सुरक्षित होनी चाहिए।",
            "ऐप जीवित गुरु, परिवार के बुज़ुर्ग, मंदिर या सम्प्रदाय के अधिकार का स्थान नहीं लेता।",
        ],
    }


def build() -> dict[str, Any]:
    verify_input()
    legacy = load("weekday-practice-west-india-v1.json")
    lane_id = "weekday-practice-west-india-content-v1"
    sources = [source(
        item["source_id"], item["title"], item["publisher"], item["source_class"].replace("_", " "),
        "citation_only" if item["rights_lane"] == "reference_only" else item["rights_lane"], url=item.get("url"),
    ) for item in legacy["sources"]]
    sources.append(source(
        "devam-weekday-safety-boundary", "Devam weekday attribution and safety boundary", "Devam",
        "Keeps regional mappings optional and excludes fasting, health, astrological, fire, authority and outcome claims", "derivative_allowed",
    ))

    localized: list[dict[str, Any]] = []
    context_notes = []
    context_pairs = []
    slugs = []
    for profile in legacy["weekday_profiles"]:
        slug = profile["practice_slug"]
        slugs.append(slug)
        context_pairs.append({"observance_slug": slug, "region_code": "west-india", "tradition_code": "smarta-west-india"})
        for language in ("en", "hi"):
            template = legacy["language_templates"][language]
            replacements = {
                "display": profile["display_name_en" if language == "en" else "display_name_hi"],
                "focus": profile["focus_en" if language == "en" else "focus_hi"],
                "reflection": profile["reflection_en" if language == "en" else "reflection_hi"],
                "safety": profile["safety_note_en" if language == "en" else "safety_note_hi"],
            }
            guide = render(template, replacements)
            guide["language_code"] = language
            guide["tiers"] = render(guide["tiers"], replacements)
            procedures = convert_procedures(
                guide, lane_id,
                {"minimum": "self_guided_optional_weekly_rhythm", "standard": "household_optional_weekly_rhythm", "elaborate": "established_family_temple_or_sampradaya_guided"},
                ["devam-weekday-safety-boundary"], ["devam-weekday-safety-boundary"],
                {"__WEEKDAY__": profile["source_ids"][0]},
            )
            content = {"language_code": language, "observance_slugs": [slug], "title": guide["title"], "short_answer": guide["summary"], "procedures": procedures, **details(profile, language)}
            localized.append(content)
            context_notes.append({"observance_slug": slug, "language_code": language, "note": guide["family_practice_note"]})

    pack = {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1", "lane_id": lane_id,
        "supersedes_legacy_pack_ids": [legacy["pack_id"]], "observance_slugs": slugs,
        "applicability": {
            "region_codes": ["west-india"], "tradition_codes": ["smarta-west-india"],
            "context_pairs": context_pairs, "observance_context_notes": context_notes,
            "settings": ["individual", "household", "family_led", "teacher_led", "temple", "community"],
            "family_practice_overrides_generic_guidance": True,
            "material_context_questions": legacy["language_templates"]["en"]["context_prompts"],
        },
        "calendar": {
            "resolution_source_ids": ["maharashtra-vishwakosh-vara-1"], "timing_kind": "customary",
            "location_aware": False, "tradition_aware": True,
            "decision_rule_id": "civil-weekday-in-requested-local-time-v1", "live_schedule_required": False,
            "freshness_note": "Use the user's local civil weekday. The West India association remains optional and subordinate to family, kula, temple and sampradaya practice.",
        },
        "sources": sources, "localized_content": localized, "product_status": status(),
    }
    assert_source_references(pack)
    return pack


def main() -> None:
    payload = (json.dumps(build(), ensure_ascii=False, indent=2, sort_keys=True) + "\n").encode("utf-8")
    if OUTPUT.exists():
        raise FileExistsError(f"Refusing to overwrite {OUTPUT}")
    OUTPUT.write_bytes(payload)
    print(json.dumps({"path": str(OUTPUT.relative_to(ROOT)), "bytes": len(payload), "sha256": hashlib.sha256(payload).hexdigest()}))


if __name__ == "__main__":
    main()

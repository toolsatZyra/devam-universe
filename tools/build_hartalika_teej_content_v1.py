#!/usr/bin/env python3
"""Build the current-contract North/West India Hartalika Teej participant lane."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any

from build_early_diwali_content_batch_v1 import load, source, status
from build_late_diwali_content_batch_v1 import assert_source_references, fetch, localized_content


ROOT = Path(__file__).resolve().parents[1]
PACK_DIR = ROOT / "knowledge_packs" / "rituals"
OUTPUT = PACK_DIR / "hartalika-teej-north-west-india-participant-content-v1.json"

DRIK_FETCH = fetch(
    "https://www.drikpanchang.com/festivals/teej/hartalika-teej-date-time.html?geoname-id=1273294&year=2026",
    66646,
    "3290659498b1154fcf24fb131ef1b4ff952adbb43a17cbb5694fc85df5599cf0",
)
UTSAV_FETCH = fetch(
    "https://utsav.gov.in/public/view-event/hartalika-teej-2025-1",
    34611,
    "265d7eaee47d80d8d33455e06048b6c518724fc5209a99a2686a66d3d392af8c",
)
INCREDIBLE_FETCH = fetch(
    "https://www.incredibleindia.gov.in/en/festivals-and-events/teej",
    528363,
    "640d149c90f67f7d8ae29a9c935ed2025dc701572dc32434f1a1223865b486b4",
)
HARYANA_FETCH = fetch(
    "https://artandculturalaffairshry.gov.in/teej-festival/",
    94379,
    "5d77d98ef15cf2d0f37be6bc5855e9a8c10ec20085b18743db7a46494c51a5e0",
)


def details(language: str) -> dict[str, Any]:
    if language == "en":
        return {
            "significance": {
                "text": "Hartalika Teej is a North and West Indian Parvati-Shiva observance associated with devotion, relationship and family bonds, monsoon-season community life, songs, stories and prayer. This lane supports participation without treating one gender, marital status, fast or promised outcome as universal.",
                "source_ids": ["utsav-hartalika-teej-rajasthan", "incredible-india-teej", "haryana-art-culture-teej"],
                "scope_note": "Official cultural sources describe living regional practice; they are not a universal liturgical manual.",
            },
            "origin_narratives": [
                {
                    "narrative_id": "parvati-shiva-hartalika-teej",
                    "title": "Parvati's resolve and reunion with Shiva",
                    "summary": "Official tourism accounts connect Teej with Parvati's sustained resolve and eventual union or reunion with Shiva. Devam presents this as an attributable festival narrative, not a single historical origin or a guarantee about marriage.",
                    "tradition_scope": "North and West Indian official cultural retellings",
                    "source_ids": ["utsav-hartalika-teej-rajasthan", "incredible-india-teej", "haryana-art-culture-teej"],
                    "universal_origin_claimed": False,
                }
            ],
            "typical_practices": [
                {
                    "practice_id": "rajasthan-hartalika-participation",
                    "population_scope": "Rajasthan Hartalika Teej public and family context described by Utsav India",
                    "description": "Prayer, Parvati-Shiva remembrance, a familiar katha or song, temple or community gathering, and family participation appear in the regional account. Exact puja, fast and close remain with the household or living authority.",
                    "source_ids": ["utsav-hartalika-teej-rajasthan"],
                    "instructional": False,
                },
                {
                    "practice_id": "north-india-teej-cultural-context",
                    "population_scope": "Haryana and broader North Indian Teej contexts described by official cultural sources",
                    "description": "Songs, swings, dance, festive clothing or mehendi, temple prayer, offerings, fasting and feasting are documented as variable living practices; none is imposed by this participant lane.",
                    "source_ids": ["incredible-india-teej", "haryana-art-culture-teej"],
                    "instructional": False,
                },
            ],
            "variants": [
                {
                    "variant_id": "rajasthan-haryana-and-family-forms",
                    "scope": "Rajasthan, Haryana and family practice",
                    "difference": "Stories, songs, gatherings, swings, adornment, food, fast, temple participation and closing forms vary by place and household.",
                    "source_ids": ["utsav-hartalika-teej-rajasthan", "incredible-india-teej", "haryana-art-culture-teej"],
                    "separate_lane_required": True,
                },
                {
                    "variant_id": "other-teej-and-gowri-habba",
                    "scope": "Hariyali Teej, Kajari Teej, Gowri Habba, Nepal and other regional observances",
                    "difference": "Related names and Parvati themes do not make these observances interchangeable with this Hartalika participant lane.",
                    "source_ids": ["devam-hartalika-calendar-fixture", "devam-hartalika-safety-boundary"],
                    "separate_lane_required": True,
                },
            ],
            "safety_and_boundaries": [
                "The ordinary fast is described but never prescribed or treated as medical advice; health, pregnancy, breastfeeding, medication, age and eating-disorder risks require appropriate care.",
                "Formal sankalpa, katha, mantra, image worship, offerings and closing remain with the family, temple or qualified living authority.",
                "Clothing, jewellery, mehendi, swings, gifts, sweets, flowers and purchases are optional and context-specific.",
                "No action guarantees marriage, spouse longevity, progeny, family prosperity, harmony, merit or another outcome.",
            ],
        }
    return {
        "significance": {
            "text": "हरतालिका तीज उत्तर और पश्चिम भारत की पार्वती-शिव परम्पराओं से जुड़ा पालन है, जिसमें भक्ति, सम्बन्ध और परिवार, वर्षा-ऋतु का सामुदायिक जीवन, गीत, कथा और प्रार्थना आते हैं। यह मार्ग सहभागिता देता है, पर किसी एक लिंग, वैवाहिक स्थिति, उपवास या फल को सार्वभौमिक नहीं बनाता।",
            "source_ids": ["utsav-hartalika-teej-rajasthan", "incredible-india-teej", "haryana-art-culture-teej"],
            "scope_note": "सरकारी सांस्कृतिक स्रोत क्षेत्रीय जीवित व्यवहार बताते हैं; वे सार्वभौमिक पूजा-पद्धति नहीं हैं।",
        },
        "origin_narratives": [
            {
                "narrative_id": "parvati-shiva-hartalika-teej",
                "title": "पार्वती का संकल्प और शिव से मिलन",
                "summary": "सरकारी पर्यटन विवरण तीज को पार्वती के दीर्घ संकल्प और शिव से मिलन या पुनर्मिलन से जोड़ते हैं। Devam इसे स्रोत-सहित उत्सव-कथा रखता है, अकेला ऐतिहासिक मूल या वैवाहिक फल की गारंटी नहीं।",
                "tradition_scope": "उत्तर और पश्चिम भारत के सरकारी सांस्कृतिक पुनर्कथन",
                "source_ids": ["utsav-hartalika-teej-rajasthan", "incredible-india-teej", "haryana-art-culture-teej"],
                "universal_origin_claimed": False,
            }
        ],
        "typical_practices": [
            {
                "practice_id": "rajasthan-hartalika-participation",
                "population_scope": "Utsav India में वर्णित राजस्थान का हरतालिका तीज पारिवारिक और सार्वजनिक सन्दर्भ",
                "description": "क्षेत्रीय विवरण में प्रार्थना, पार्वती-शिव स्मरण, परिचित कथा या गीत, मन्दिर या सामुदायिक मिलन और पारिवारिक सहभागिता आते हैं। ठीक पूजा, उपवास और समापन परिवार या जीवित प्राधिकारी के पास रहते हैं।",
                "source_ids": ["utsav-hartalika-teej-rajasthan"],
                "instructional": False,
            },
            {
                "practice_id": "north-india-teej-cultural-context",
                "population_scope": "सरकारी सांस्कृतिक स्रोतों में वर्णित हरियाणा और व्यापक उत्तर भारतीय तीज सन्दर्भ",
                "description": "गीत, झूले, नृत्य, उत्सवी वस्त्र या मेहंदी, मन्दिर-प्रार्थना, अर्पण, उपवास और भोज अलग-अलग जीवित व्यवहार हैं; यह सहभागिता मार्ग किसी को अनिवार्य नहीं करता।",
                "source_ids": ["incredible-india-teej", "haryana-art-culture-teej"],
                "instructional": False,
            },
        ],
        "variants": [
            {
                "variant_id": "rajasthan-haryana-and-family-forms",
                "scope": "राजस्थान, हरियाणा और पारिवारिक व्यवहार",
                "difference": "कथाएँ, गीत, मिलन, झूले, श्रृंगार, भोजन, उपवास, मन्दिर-सहभागिता और समापन स्थान व परिवार के अनुसार बदलते हैं।",
                "source_ids": ["utsav-hartalika-teej-rajasthan", "incredible-india-teej", "haryana-art-culture-teej"],
                "separate_lane_required": True,
            },
            {
                "variant_id": "other-teej-and-gowri-habba",
                "scope": "हरियाली तीज, कजरी तीज, गौरी हब्बा, नेपाल और अन्य क्षेत्रीय पालन",
                "difference": "समान नाम और पार्वती-विषय इन पालनों को इस हरतालिका सहभागिता मार्ग के समान नहीं बनाते।",
                "source_ids": ["devam-hartalika-calendar-fixture", "devam-hartalika-safety-boundary"],
                "separate_lane_required": True,
            },
        ],
        "safety_and_boundaries": [
            "सामान्य उपवास का वर्णन है, पर वह निर्देश या चिकित्सा-सलाह नहीं; स्वास्थ्य, गर्भावस्था, स्तनपान, दवा, आयु और भोजन-विकार में उचित देखभाल लें।",
            "औपचारिक संकल्प, कथा, मन्त्र, प्रतिमा-पूजा, अर्पण और समापन परिवार, मन्दिर या योग्य जीवित प्राधिकारी के पास हैं।",
            "वस्त्र, आभूषण, मेहंदी, झूला, उपहार, मिठाई, फूल और खरीद वैकल्पिक और सन्दर्भ-विशिष्ट हैं।",
            "कोई कर्म विवाह, जीवनसाथी की आयु, सन्तान, पारिवारिक समृद्धि, सामंजस्य, पुण्य या अन्य फल की गारंटी नहीं देता।",
        ],
    }


def build() -> dict[str, Any]:
    legacy = load("hartalika-teej-north-west-india-v1.json")
    lane_id = "hartalika-teej-north-west-india-participant-content-v1"
    pack = {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1",
        "lane_id": lane_id,
        "supersedes_legacy_pack_ids": [legacy["pack_id"]],
        "observance_slugs": [legacy["observance_slug"]],
        "applicability": {
            "region_codes": ["north-india", "west-india"],
            "tradition_codes": ["smarta-north-india", "smarta-west-india"],
            "context_pairs": [
                {"region_code": "north-india", "tradition_code": "smarta-north-india"},
                {"region_code": "west-india", "tradition_code": "smarta-west-india"},
            ],
            "settings": ["individual", "household", "family_led", "community", "temple"],
            "family_practice_overrides_generic_guidance": True,
            "material_context_questions": legacy["guides"][0]["context_prompts"],
        },
        "calendar": {
            "resolution_source_ids": ["devam-hartalika-calendar-fixture", "nirnayasindhu-1865-hartalika-decision"],
            "timing_kind": "mixed",
            "location_aware": True,
            "tradition_aware": True,
            "decision_rule_id": "nirnayasindhu-1865-hartalika-later-sunrise-day-v1",
            "live_schedule_required": True,
            "freshness_note": "The Delhi 2026 date lane is deterministic; temple, community and family timings must be checked with the current responsible authority.",
        },
        "sources": [
            source("devam-hartalika-calendar-fixture", "Bounded Delhi Hartalika Teej calendar fixture", "Devam", "Deterministic Delhi 2026 date and scope fixture; not ritual authority", "derivative_allowed", artifact_sha256="bef1772cbb368da2fa712740598d1881b98ffc1b6d8c4a99cfc93e02fa3420a3", citation_coordinates={"path": "knowledge_packs/panchang/hartalika-teej-delhi-2026-v1.json"}),
            source("nirnayasindhu-1865-hartalika-decision", "Nirnayasindhu Hartalika-vrata decision context", "Mumbai, 1865 Marathi translation; retained by Devam", "Historical later-day calendar rule only; not a modern household procedure", "citation_only", artifact_sha256="a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b", citation_coordinates={"pdf_pages": [150], "printed_page": "133", "source_text_returned_by_api": False}),
            source("drikpanchang-hartalika-delhi-2026", "Hartalika Teej date and time for Delhi, 2026", "Drik Panchang", "Current practitioner identity, date and practice context; not product text or universal vidhi", "citation_only", url="https://www.drikpanchang.com/festivals/teej/hartalika-teej-date-time.html?geoname-id=1273294&year=2026", observed_fetch=DRIK_FETCH),
            source("utsav-hartalika-teej-rajasthan", "Hartalika Teej in Rajasthan - When Devotion Meets Celebration", "Utsav, Ministry of Tourism, Government of India", "Official Rajasthan Parvati-Shiva story, prayer, song, katha, temple and gathering context", "citation_only", url="https://utsav.gov.in/public/view-event/hartalika-teej-2025-1", observed_fetch=UTSAV_FETCH),
            source("incredible-india-teej", "Teej: Celebrating love, devotion, and monsoons", "Incredible India, Ministry of Tourism, Government of India", "Official broader Teej story, cultural and regional-practice context; not Hartalika liturgical authority", "citation_only", url="https://www.incredibleindia.gov.in/en/festivals-and-events/teej", observed_fetch=INCREDIBLE_FETCH),
            source("haryana-art-culture-teej", "Teej Festival", "Art and Cultural Affairs Department, Government of Haryana", "Official Haryana regional story and living-practice context", "citation_only", url="https://artandculturalaffairshry.gov.in/teej-festival/", observed_fetch=HARYANA_FETCH),
            source("devam-hartalika-safety-boundary", "Devam Hartalika Teej participation, health, materials and outcome boundary", "Devam", "Editorial safety and scope boundary; not ritual authority", "internal_only"),
        ],
        "localized_content": localized_content(
            legacy,
            lane_id,
            {
                "minimum": "Accessible non-fasting participant form",
                "standard": "Bounded family-known participant and remembrance form",
                "elaborate": "Established family-, temple- or community-led participation",
            },
            ["utsav-hartalika-teej-rajasthan", "devam-hartalika-safety-boundary"],
            ["devam-hartalika-safety-boundary"],
            details,
        ),
        "product_status": status(),
    }
    assert_source_references(pack)
    return pack


def main() -> int:
    payload = (json.dumps(build(), ensure_ascii=False, indent=2, sort_keys=True) + "\n").encode("utf-8")
    OUTPUT.write_bytes(payload)
    print(json.dumps({"path": OUTPUT.relative_to(ROOT).as_posix(), "bytes": len(payload), "sha256": hashlib.sha256(payload).hexdigest()}, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

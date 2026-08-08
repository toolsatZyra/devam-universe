#!/usr/bin/env python3
"""Build the current-contract ISKCON Radha Ashtami participant lane."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any

from build_early_diwali_content_batch_v1 import load, source, status
from build_late_diwali_content_batch_v1 import assert_source_references, fetch, localized_content


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "knowledge_packs" / "rituals" / "radha-ashtami-iskcon-participant-content-v1.json"

DRIK_FETCH = fetch(
    "https://www.drikpanchang.com/festivals/radha-ashtami/radha-ashtami-date-time.html?geoname-id=1273294&year=2026",
    67117,
    "270dc023e97cc993593990dd0e63deaa0b8cafe4a962934411cc9d759e20dd2c",
)
ISKCON_EVENT_FETCH = fetch(
    "https://www.iskconbangalore.org/sri-radhashtami/",
    116081,
    "150133c782373d0ccb539e6662b61366215cb79f26934bf43d4bca2f399f6f61",
)
ISKCON_CALENDAR_FETCH = fetch(
    "https://www.iskconbangalore.org/vaishnava-calendar/",
    100515,
    "a623a1e3fe41181c45a37efaecc6fe4f6c4af069dfd15e45255ed01276be9f6f",
)


def details(language: str) -> dict[str, Any]:
    if language == "en":
        return {
            "significance": {
                "text": "In the ISKCON Bangalore tradition represented here, Radha Ashtami marks Srimati Radharani's appearance day and centres glorification, kirtan, prayer, teaching and devotional service. This participant lane does not universalize that theology or programme to every Gaudiya Vaishnava, Vaishnava, Smarta or family tradition.",
                "source_ids": ["iskcon-bangalore-radhashtami-2026", "iskcon-bangalore-vaishnava-calendar-2026"],
                "scope_note": "The meaning and practice are attributable to the named ISKCON institutional context.",
            },
            "origin_narratives": [
                {
                    "narrative_id": "iskcon-radharani-appearance-and-hladini",
                    "title": "Radharani's appearance and devotional identity",
                    "summary": "ISKCON Bangalore identifies the day as Srimati Radharani's appearance and describes her as Krishna's hladini-shakti or pleasure potency. Devam preserves this as the named institution's theological account, not a universal historical biography.",
                    "tradition_scope": "ISKCON Bangalore institutional teaching",
                    "source_ids": ["iskcon-bangalore-radhashtami-2026"],
                    "universal_origin_claimed": False,
                }
            ],
            "typical_practices": [
                {
                    "practice_id": "iskcon-bangalore-radhashtami-temple-programme",
                    "population_scope": "ISKCON Bangalore temple celebration",
                    "description": "The official page describes fasting until noon, deity decoration, kirtan and songs, abhisheka, arati, flower shower, bhoga and a concluding temple procession. These are descriptive institutional practices, not unsupervised home instructions.",
                    "source_ids": ["iskcon-bangalore-radhashtami-2026", "iskcon-bangalore-vaishnava-calendar-2026"],
                    "instructional": False,
                },
                {
                    "practice_id": "iskcon-home-and-temple-participation",
                    "population_scope": "ISKCON-aligned household or temple participant",
                    "description": "A participant may use a familiar teaching, prayer, song, kirtan or service reflection at home, or join the current local ISKCON programme under that temple's direction.",
                    "source_ids": ["iskcon-bangalore-radhashtami-2026", "devam-radha-ashtami-safety-boundary"],
                    "instructional": False,
                },
            ],
            "variants": [
                {
                    "variant_id": "home-remembrance-and-institutional-programme",
                    "scope": "ISKCON-aligned home remembrance versus official temple programme",
                    "difference": "Home prayer, song, reading and service reflection do not copy the temple's abhisheka, arati, homa, dressing, offering or programme schedule.",
                    "source_ids": ["iskcon-bangalore-radhashtami-2026", "devam-radha-ashtami-safety-boundary"],
                    "separate_lane_required": False,
                },
                {
                    "variant_id": "other-radha-ashtami-traditions",
                    "scope": "Other Gaudiya Vaishnava, Vaishnava, Smarta, regional and family traditions",
                    "difference": "Their calendars, theology, stories, fasts, songs, puja and closing forms require separately attributable evidence.",
                    "source_ids": ["devam-radha-ashtami-iskcon-calendar-fixture", "devam-radha-ashtami-safety-boundary"],
                    "separate_lane_required": True,
                },
            ],
            "safety_and_boundaries": [
                "The official fast until noon is documented but never prescribed or treated as medical advice.",
                "Abhisheka, arati, homa, deity dressing, kalasha, flower shower, bhoga and formal puja remain with the responsible temple or established family authority.",
                "Do not copy Bangalore programme times to another temple or date; verify the current local institution.",
                "Sponsorship, donations, purchases, new dress and chappan bhog are never required by this participant lane.",
                "No action guarantees mercy, perfection, progress, protection, merit or another spiritual or worldly outcome.",
            ],
        }
    return {
        "significance": {
            "text": "यहाँ दर्शाई गई ISKCON Bangalore परम्परा में राधाष्टमी श्रीमती राधारानी का प्राकट्य-दिवस है और स्तुति, कीर्तन, प्रार्थना, शिक्षा तथा भक्ति-सेवा पर केन्द्रित है। यह सहभागिता मार्ग उस धर्म-दृष्टि या कार्यक्रम को हर गौड़ीय वैष्णव, वैष्णव, स्मार्त या पारिवारिक परम्परा पर लागू नहीं करता।",
            "source_ids": ["iskcon-bangalore-radhashtami-2026", "iskcon-bangalore-vaishnava-calendar-2026"],
            "scope_note": "अर्थ और व्यवहार नामित ISKCON संस्थागत सन्दर्भ के हैं।",
        },
        "origin_narratives": [
            {
                "narrative_id": "iskcon-radharani-appearance-and-hladini",
                "title": "राधारानी का प्राकट्य और भक्ति-परिचय",
                "summary": "ISKCON Bangalore इस दिन को श्रीमती राधारानी का प्राकट्य बताता है और उन्हें कृष्ण की ह्लादिनी-शक्ति कहता है। Devam इसे नामित संस्था की धर्म-दृष्टि रखता है, सार्वभौमिक ऐतिहासिक जीवनी नहीं।",
                "tradition_scope": "ISKCON Bangalore संस्थागत शिक्षा",
                "source_ids": ["iskcon-bangalore-radhashtami-2026"],
                "universal_origin_claimed": False,
            }
        ],
        "typical_practices": [
            {
                "practice_id": "iskcon-bangalore-radhashtami-temple-programme",
                "population_scope": "ISKCON Bangalore मन्दिर उत्सव",
                "description": "आधिकारिक पृष्ठ दोपहर तक उपवास, विग्रह-श्रृंगार, कीर्तन और गीत, अभिषेक, आरती, पुष्प-वृष्टि, भोग और समापन मन्दिर-यात्रा का वर्णन करता है। ये संस्थागत व्यवहार हैं, बिना मार्गदर्शन घर की विधि नहीं।",
                "source_ids": ["iskcon-bangalore-radhashtami-2026", "iskcon-bangalore-vaishnava-calendar-2026"],
                "instructional": False,
            },
            {
                "practice_id": "iskcon-home-and-temple-participation",
                "population_scope": "ISKCON-संबद्ध घर या मन्दिर सहभागी",
                "description": "सहभागी घर पर परिचित शिक्षा, प्रार्थना, गीत, कीर्तन या सेवा-चिन्तन कर सकता है, अथवा स्थानीय ISKCON मन्दिर के वर्तमान निर्देश में कार्यक्रम से जुड़ सकता है।",
                "source_ids": ["iskcon-bangalore-radhashtami-2026", "devam-radha-ashtami-safety-boundary"],
                "instructional": False,
            },
        ],
        "variants": [
            {
                "variant_id": "home-remembrance-and-institutional-programme",
                "scope": "ISKCON-संबद्ध घरेलू स्मरण और आधिकारिक मन्दिर कार्यक्रम",
                "difference": "घर की प्रार्थना, गीत, पाठ और सेवा-चिन्तन मन्दिर के अभिषेक, आरती, होम, श्रृंगार, अर्पण या समय-सारणी की नकल नहीं करते।",
                "source_ids": ["iskcon-bangalore-radhashtami-2026", "devam-radha-ashtami-safety-boundary"],
                "separate_lane_required": False,
            },
            {
                "variant_id": "other-radha-ashtami-traditions",
                "scope": "अन्य गौड़ीय वैष्णव, वैष्णव, स्मार्त, क्षेत्रीय और पारिवारिक परम्पराएँ",
                "difference": "उनके पंचांग, धर्म-दृष्टि, कथा, उपवास, गीत, पूजा और समापन के लिए अलग स्रोत चाहिए।",
                "source_ids": ["devam-radha-ashtami-iskcon-calendar-fixture", "devam-radha-ashtami-safety-boundary"],
                "separate_lane_required": True,
            },
        ],
        "safety_and_boundaries": [
            "आधिकारिक दोपहर तक उपवास का वर्णन है, पर वह निर्देश या चिकित्सा-सलाह नहीं है।",
            "अभिषेक, आरती, होम, विग्रह-श्रृंगार, कलश, पुष्प-वृष्टि, भोग और औपचारिक पूजा जिम्मेदार मन्दिर या स्थापित पारिवारिक प्राधिकारी के पास हैं।",
            "Bangalore का कार्यक्रम-समय दूसरे मन्दिर या तिथि पर न लगाएँ; वर्तमान स्थानीय संस्था से जाँचें।",
            "प्रायोजन, दान, खरीद, नया वस्त्र और छप्पन भोग इस सहभागिता मार्ग में अनिवार्य नहीं।",
            "कोई कर्म कृपा, सिद्धि, प्रगति, रक्षा, पुण्य या अन्य आध्यात्मिक अथवा सांसारिक फल की गारंटी नहीं देता।",
        ],
    }


def build() -> dict[str, Any]:
    legacy = load("radha-ashtami-iskcon-participation-v1.json")
    lane_id = "radha-ashtami-iskcon-participant-content-v1"
    pack = {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1",
        "lane_id": lane_id,
        "supersedes_legacy_pack_ids": [legacy["pack_id"]],
        "observance_slugs": [legacy["observance_slug"]],
        "applicability": {
            "region_codes": ["iskcon-india"],
            "tradition_codes": ["vaishnava-iskcon"],
            "context_pairs": [{"region_code": "iskcon-india", "tradition_code": "vaishnava-iskcon"}],
            "settings": ["individual", "household", "family_led", "community", "temple"],
            "family_practice_overrides_generic_guidance": True,
            "material_context_questions": legacy["guides"][0]["context_prompts"],
        },
        "calendar": {
            "resolution_source_ids": ["devam-radha-ashtami-iskcon-calendar-fixture", "drikpanchang-radha-ashtami-delhi-iskcon-2026"],
            "timing_kind": "mixed",
            "location_aware": True,
            "tradition_aware": True,
            "decision_rule_id": "devam-radha-ashtami-iskcon-madhyahna-overlap-v1",
            "live_schedule_required": True,
            "freshness_note": "The Delhi 2026 date is bounded; every temple programme, fast close and public schedule must be confirmed with the current local ISKCON authority.",
        },
        "sources": [
            source("devam-radha-ashtami-iskcon-calendar-fixture", "Bounded Delhi ISKCON Radha Ashtami calendar fixture", "Devam", "Deterministic Delhi 2026 ISKCON date and scope fixture; not ritual authority", "derivative_allowed", artifact_sha256="93f9fc2539ff87495012d31d9c87115c68b317eab679dbfc1725877ed9455867", citation_coordinates={"path": "knowledge_packs/panchang/radha-ashtami-delhi-iskcon-2026-v1.json"}),
            source("nirnayasindhu-1865-general-shukla-ashtami-context", "Nirnayasindhu general Shukla Ashtami context", "Mumbai, 1865 Marathi translation; retained by Devam", "Historical general Ashtami context; not Radha identity or ISKCON practice authority", "citation_only", artifact_sha256="a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b", citation_coordinates={"pdf_pages": [51, 52], "source_text_returned_by_api": False}),
            source("drikpanchang-radha-ashtami-delhi-iskcon-2026", "Radha Ashtami date and time for Delhi, ISKCON lane, 2026", "Drik Panchang", "Current practitioner identity, madhyahna and location-specific date context", "citation_only", url="https://www.drikpanchang.com/festivals/radha-ashtami/radha-ashtami-date-time.html?geoname-id=1273294&year=2026", observed_fetch=DRIK_FETCH),
            source("iskcon-bangalore-radhashtami-2026", "Sri Radhashtami - 19 Sep 2026", "ISKCON Bangalore", "Official ISKCON appearance-day teaching and temple-practice context", "citation_only", url="https://www.iskconbangalore.org/sri-radhashtami/", observed_fetch=ISKCON_EVENT_FETCH),
            source("iskcon-bangalore-vaishnava-calendar-2026", "ISKCON Bangalore Vaishnava Calendar 2026-2027", "ISKCON Bangalore", "Official institutional date and descriptive fast context; not a health instruction", "citation_only", url="https://www.iskconbangalore.org/vaishnava-calendar/", observed_fetch=ISKCON_CALENDAR_FETCH),
            source("devam-radha-ashtami-safety-boundary", "Devam Radha Ashtami institutional, fasting, purchase and outcome boundary", "Devam", "Editorial safety and scope boundary; not ritual authority", "internal_only"),
        ],
        "localized_content": localized_content(
            legacy,
            lane_id,
            {
                "minimum": "Accessible ISKCON-aligned home remembrance",
                "standard": "Bounded family-known prayer, kirtan and service form",
                "elaborate": "Current local ISKCON temple programme participation",
            },
            ["iskcon-bangalore-radhashtami-2026", "devam-radha-ashtami-safety-boundary"],
            ["devam-radha-ashtami-safety-boundary"],
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

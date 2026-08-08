#!/usr/bin/env python3
"""Build bounded current-contract Jain Diwali, Bandi Chhor, and Ahoi lanes."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any

from build_early_diwali_content_batch_v1 import DIMENSIONS, load, source, status
from build_late_diwali_content_batch_v1 import assert_source_references, fetch, localized_content


ROOT = Path(__file__).resolve().parents[1]
PACK_DIR = ROOT / "knowledge_packs" / "rituals"

AHOI_VIDHI_FETCH = fetch(
    "https://www.drikpanchang.com/festivals/ahoi-ashtami/info/ahoi-ashtami-puja-vidhi.html",
    61590,
    "564c6ddb8a695b6e0bba772125bee6ae5111213346025801247ee80895543dd2",
)
AHOI_STORY_FETCH = fetch(
    "https://www.drikpanchang.com/festivals/ahoi-ashtami/legends/ahoi-ashtami-vrat-katha.html",
    57286,
    "99e75a7df2d38982ea86849db7b13fae6390bfda3d8450107333a55c40c7a432",
)
JAINA_2019_FETCH = fetch(
    "https://www.jaina.org/page/10_26_2019_ENewsletter",
    72450,
    "b7eaf080e00b96ccc8aac932da39f7dca083806fb40cf4724a52da112e6a7503",
)
JAINA_2023_FETCH = fetch(
    "https://www.jaina.org/mpage/11242023_ENewsletter",
    170183,
    "c7fd1377145a0d5e43ba083a467380abcdb042967526e3757bb4696d688734e2",
)
JAINA_2017_FETCH = fetch(
    "https://www.jaina.org/page/10_19_2017_Newslette",
    60623,
    "57c937eb87b663361eecc9e98c285ba7f0954fb3a7af2881ed4fb40ac4c3a010",
)
SGPC_FETCH = fetch(
    "https://sgpc.net/union-culture-ministrys-removal-of-bandi-chhor-diwas-post-unfortunate-harjinder-singh-dhami/",
    99340,
    "54458fd2cfe2518bac763994e81857c4bdf98420e02fedc918ebc40ddb54e0ec",
)
BARU_FETCH = fetch(
    "https://barusahib.org/general/bandichhod-diwas-di-lakh-lakh-wadhai/",
    229213,
    "16fdfa85260c9186a9c012f27589019ae91ca9ddd3547f9b7a70fa00e69c893d",
)


def partial_status() -> dict[str, Any]:
    completed = {dimension: True for dimension in DIMENSIONS}
    completed["actionable_vidhi"] = False
    return {
        "classification": "participation_companion",
        "completed_dimensions": completed,
        "open_gaps": [
            "No single umbrella procedure can stand in for Shvetambara, Digambara, Sthanakavasi, sangh, temple, or family practice.",
            "Sect- and community-specific Diwali, Nirvan Kalyanak, New Year, and Gyan Panchami vidhi lanes remain to be acquired separately.",
        ],
        "review_status": "internal_beta_reviewed",
    }


def jain_details(language: str) -> dict[str, Any]:
    if language == "en":
        return {
            "significance": {"text": "Jain Diwali commemorates Bhagwan Mahavira's nirvana at Pavapuri and turns the festival of lights toward inner illumination, self-effort, ahimsa, restraint, and the preservation of his teaching.", "source_ids": ["jaina-diwali-mahavir-nirvana", "jaina-mahavira-nirvana-values"]},
            "origin_narratives": [
                {"narrative_id": "mahavira-nirvana-pavapuri", "title": "Mahavira's nirvana and the lamps", "summary": "JAINA relates Mahavira's final discourse and nirvana at Pavapuri, followed by lamps lit to remember the teacher and the light of knowledge.", "tradition_scope": "JAINA umbrella account; not a substitute for sect-specific textual adjudication", "source_ids": ["jaina-diwali-mahavir-nirvana"], "universal_origin_claimed": False},
                {"narrative_id": "gautam-swami-new-year-sequence", "title": "Gautam Swami and the following New Year", "summary": "The JAINA account places Gautam Swami remembrance and New Year observance after the nirvana day; the exact calendar and liturgy remain community-specific.", "tradition_scope": "JAINA-described sequence", "source_ids": ["jaina-diwali-mahavir-nirvana", "jaina-diwali-practice-context"], "universal_origin_claimed": False},
            ],
            "typical_practices": [
                {"practice_id": "jaina-described-diwali-practice", "population_scope": "JAINA-described Jain households and communities", "description": "Accounts describe temple visits, scripture or Uttaradhyayan reading, hymns or jaap, lamps as symbols of knowledge, restraint or fasting in some communities, greetings, and sweets; none is universalized here.", "source_ids": ["jaina-diwali-mahavir-nirvana", "jaina-diwali-practice-context"], "instructional": False}
            ],
            "variants": [
                {"variant_id": "jain-sect-and-sangh-vidhi", "scope": "Shvetambara, Digambara, Sthanakavasi, temple, sangh, and family", "difference": "Texts, timing, fasting, puja, jaap, Nirvan Ladoo, and the New Year sequence vary and require separate authoritative lanes.", "source_ids": ["devam-jain-diwali-safety-boundary", "jaina-diwali-practice-context"], "separate_lane_required": True},
                {"variant_id": "nirvan-and-new-year-dates", "scope": "Bounded 2026 Jain calendar variants", "difference": "The 8 November umbrella date remains separate from preserved 9 November Nirvan/Digambara variants and the 10 November New Year lane.", "source_ids": ["devam-jain-diwali-date-fixture"], "separate_lane_required": True},
            ],
            "safety_and_boundaries": ["Do not begin a fast or austerity from this umbrella companion; use family, sangh, and appropriate health guidance.", "Use a flame-free light when needed and avoid fireworks.", "No reflection or action guarantees merit, moksha, prosperity, or protection.", "This is not a complete Jain Diwali vidhi and does not merge Hindu or Sikh observances."],
        }
    return {
        "significance": {"text": "जैन दीपावली भगवान महावीर के पावापुरी निर्वाण का स्मरण करती है और प्रकाश को आत्म-ज्योति, पुरुषार्थ, अहिंसा, संयम तथा उपदेश-संरक्षण से जोड़ती है।", "source_ids": ["jaina-diwali-mahavir-nirvana", "jaina-mahavira-nirvana-values"]},
        "origin_narratives": [
            {"narrative_id": "mahavira-nirvana-pavapuri", "title": "महावीर निर्वाण और दीप", "summary": "JAINA का वर्णन महावीर के अंतिम उपदेश और पावापुरी में निर्वाण के बाद गुरु तथा ज्ञान-ज्योति की स्मृति में दीप जलाने को जोड़ता है।", "tradition_scope": "JAINA का व्यापक वर्णन; सम्प्रदाय-विशिष्ट पाठ का विकल्प नहीं", "source_ids": ["jaina-diwali-mahavir-nirvana"], "universal_origin_claimed": False},
            {"narrative_id": "gautam-swami-new-year-sequence", "title": "गौतम स्वामी और अगला नववर्ष", "summary": "JAINA निर्वाण-दिवस के बाद गौतम स्वामी स्मरण और नववर्ष रखता है; ठीक तिथि और विधि समुदाय-विशिष्ट रहती है।", "tradition_scope": "JAINA-वर्णित क्रम", "source_ids": ["jaina-diwali-mahavir-nirvana", "jaina-diwali-practice-context"], "universal_origin_claimed": False},
        ],
        "typical_practices": [
            {"practice_id": "jaina-described-diwali-practice", "population_scope": "JAINA-वर्णित जैन परिवार और समुदाय", "description": "वर्णनों में मंदिर-दर्शन, उत्तराध्ययन या अन्य पाठ, स्तवन/जाप, ज्ञान के प्रतीक दीप, कुछ समुदायों में संयम/उपवास, शुभकामना और मिठाई आते हैं; यहाँ कोई रूप सार्वभौमिक नहीं कहा गया है।", "source_ids": ["jaina-diwali-mahavir-nirvana", "jaina-diwali-practice-context"], "instructional": False}
        ],
        "variants": [
            {"variant_id": "jain-sect-and-sangh-vidhi", "scope": "श्वेताम्बर, दिगम्बर, स्थानकवासी, मंदिर, संघ और परिवार", "difference": "पाठ, समय, उपवास, पूजा, जाप, निर्वाण लाडू और नववर्ष क्रम बदलते हैं; इनके अलग प्रामाणिक मार्ग चाहिए।", "source_ids": ["devam-jain-diwali-safety-boundary", "jaina-diwali-practice-context"], "separate_lane_required": True},
            {"variant_id": "nirvan-and-new-year-dates", "scope": "सीमित 2026 जैन तिथि-रूप", "difference": "8 नवम्बर की व्यापक तिथि 9 नवम्बर के निर्वाण/दिगम्बर रूपों और 10 नवम्बर नववर्ष से अलग रहती है।", "source_ids": ["devam-jain-diwali-date-fixture"], "separate_lane_required": True},
        ],
        "safety_and_boundaries": ["इस व्यापक सहायक से उपवास या तप आरम्भ न करें; परिवार, संघ और उचित स्वास्थ्य-मार्गदर्शन लें।", "जहाँ आवश्यक हो लौ-रहित प्रकाश लें और पटाखों से बचें।", "चिंतन या क्रिया से पुण्य, मोक्ष, समृद्धि या रक्षा की गारंटी नहीं।", "यह पूर्ण जैन दीपावली विधि नहीं और हिन्दू या सिख पालन से मिश्रित नहीं है।"],
    }


def jain_diwali() -> dict[str, Any]:
    legacy = load("jain-diwali-umbrella-reflection-v1.json")
    lane_id = "jain-diwali-umbrella-companion-content-v1"
    pack = {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1",
        "lane_id": lane_id,
        "supersedes_legacy_pack_ids": [legacy["pack_id"]],
        "observance_slugs": [legacy["observance_slug"]],
        "applicability": {"region_codes": ["jain-india"], "tradition_codes": ["jain-umbrella"], "context_pairs": [{"region_code": "jain-india", "tradition_code": "jain-umbrella"}], "settings": ["individual", "household", "temple", "community"], "family_practice_overrides_generic_guidance": True, "material_context_questions": legacy["guides"][0]["context_prompts"]},
        "calendar": {"resolution_source_ids": ["devam-jain-diwali-date-fixture"], "timing_kind": "mixed", "location_aware": True, "tradition_aware": True, "decision_rule_id": "devam-jain-diwali-delhi-2026-umbrella-v1", "live_schedule_required": True, "freshness_note": "The Delhi 2026 umbrella date is resolved; sect, sangh, temple, Nirvan Kalyanak, and New Year programmes require current local confirmation."},
        "sources": [
            source("devam-jain-diwali-date-fixture", "Devam Jain Diwali Delhi 2026 date evidence fixture", "Devam", "Bounded date and variant evidence; not ritual authority", "derivative_allowed", artifact_sha256="1b72b1eb9710d35e90618e02e840e4cb6129e0aa726df667fa637e42e62f117d", citation_coordinates={"path": "knowledge_packs/panchang/jain-diwali-delhi-2026-v1.json"}),
            source("jaina-diwali-mahavir-nirvana", "Diwali and Mahavira Nirvana", "JAINA", "Jain umbrella identity, Pavapuri narrative, inner-light meaning, scripture and New Year context; not a universal vidhi", "citation_only", url="https://www.jaina.org/page/10_26_2019_ENewsletter", observed_fetch=JAINA_2019_FETCH),
            source("jaina-mahavira-nirvana-values", "Mahavira Nirvana 2550", "JAINA", "Ahimsa, non-absolutism, self-effort, and restraint context", "citation_only", url="https://www.jaina.org/mpage/11242023_ENewsletter", observed_fetch=JAINA_2023_FETCH),
            source("jaina-diwali-practice-context", "JAINA Diwali special newsletter", "JAINA", "Descriptive temple, reading, hymn, austerity, lamp, and sequence evidence; not one cross-sect prescription", "citation_only", url="https://www.jaina.org/page/10_19_2017_Newslette", observed_fetch=JAINA_2017_FETCH),
            source("devam-jain-diwali-safety-boundary", "Devam Jain Diwali scope, flame, austerity, and outcome boundary", "Devam", "Editorial safety and scope boundary; not Jain authority", "internal_only"),
        ],
        "localized_content": localized_content(legacy, lane_id, {"minimum": "Source-grounded Jain Diwali reflection", "standard": "Family- or sangh-confirmed Jain Diwali remembrance", "elaborate": "Established temple, sangh, or teacher-led participation only"}, ["jaina-diwali-mahavir-nirvana", "devam-jain-diwali-safety-boundary"], ["devam-jain-diwali-safety-boundary"], jain_details),
        "product_status": partial_status(),
    }
    assert_source_references(pack)
    return pack


def bandi_details(language: str) -> dict[str, Any]:
    if language == "en":
        return {
            "significance": {"text": "Bandi Chhor Divas remembers Guru Hargobind Sahib's release from Gwalior Fort together with 52 detained rulers, placing freedom alongside courage, justice, dignity, and responsibility for others.", "source_ids": ["sgpc-bandi-chhor-identity", "baru-sahib-bandi-chhor-history"]},
            "origin_narratives": [{"narrative_id": "guru-hargobind-and-52-rulers", "title": "Freedom shared with the detained rulers", "summary": "The Sikh institutional account remembers Guru Hargobind Sahib refusing an isolated freedom and leaving Gwalior with 52 rulers.", "tradition_scope": "Sikh institutional remembrance", "source_ids": ["sgpc-bandi-chhor-identity", "baru-sahib-bandi-chhor-history"], "universal_origin_claimed": False}],
            "typical_practices": [{"practice_id": "gurdwara-remembrance-kirtan-langar", "population_scope": "Sikh gurdwara communities described by the sources", "description": "Communities gather for remembrance, prayer or kirtan, seva and langar under gurdwara direction; exact paath, ardas, Hukamnama, lighting, and schedule are local programmes.", "source_ids": ["baru-sahib-bandi-chhor-history", "devam-bandi-chhor-safety-boundary"], "instructional": False}],
            "variants": [{"variant_id": "local-gurdwara-programmes", "scope": "SGPC, local gurdwaras, families, and diaspora communities", "difference": "Programme, schedule, language, lighting, seva roles, and food arrangements remain institution-specific.", "source_ids": ["sgpc-bandi-chhor-identity", "devam-bandi-chhor-safety-boundary"], "separate_lane_required": True}],
            "safety_and_boundaries": ["Follow gurdwara directions for covering, footwear, seating, photography, prayer, langar, access, and seva.", "Do not start a flame, fireworks display, food-handling role, collection, or liturgical act independently.", "This lane does not merge Bandi Chhor Divas with Hindu or Jain Diwali.", "No act promises merit, protection, or success."],
        }
    return {
        "significance": {"text": "बंदी छोड़ दिवस गुरु हरगोबिंद साहिब के ग्वालियर किले से 52 बंदी राजाओं सहित निकलने का स्मरण करता है और स्वतंत्रता को साहस, न्याय, गरिमा तथा दूसरों की जिम्मेदारी से जोड़ता है।", "source_ids": ["sgpc-bandi-chhor-identity", "baru-sahib-bandi-chhor-history"]},
        "origin_narratives": [{"narrative_id": "guru-hargobind-and-52-rulers", "title": "बंदी राजाओं के साथ साझा मुक्ति", "summary": "सिख संस्थागत वर्णन गुरु हरगोबिंद साहिब द्वारा केवल अपनी मुक्ति न स्वीकारकर 52 राजाओं के साथ ग्वालियर से निकलने को याद करता है।", "tradition_scope": "सिख संस्थागत स्मरण", "source_ids": ["sgpc-bandi-chhor-identity", "baru-sahib-bandi-chhor-history"], "universal_origin_claimed": False}],
        "typical_practices": [{"practice_id": "gurdwara-remembrance-kirtan-langar", "population_scope": "स्रोतों में वर्णित सिख गुरुद्वारा समुदाय", "description": "समुदाय गुरुद्वारा-निर्देशन में स्मरण, प्रार्थना/कीर्तन, सेवा और लंगर के लिए जुटते हैं; ठीक पाठ, अरदास, हुकमनामा, प्रकाश और समय स्थानीय कार्यक्रम हैं।", "source_ids": ["baru-sahib-bandi-chhor-history", "devam-bandi-chhor-safety-boundary"], "instructional": False}],
        "variants": [{"variant_id": "local-gurdwara-programmes", "scope": "SGPC, स्थानीय गुरुद्वारा, परिवार और प्रवासी समुदाय", "difference": "कार्यक्रम, समय, भाषा, प्रकाश, सेवा और भोजन-व्यवस्था संस्था के अनुसार बदलते हैं।", "source_ids": ["sgpc-bandi-chhor-identity", "devam-bandi-chhor-safety-boundary"], "separate_lane_required": True}],
        "safety_and_boundaries": ["सिर ढकने, जूते, बैठने, फोटो, प्रार्थना, लंगर, प्रवेश और सेवा के गुरुद्वारा निर्देश मानें।", "स्वयं से लौ, पटाखे, भोजन-कार्य, संग्रह या धार्मिक पाठ आरम्भ न करें।", "यह मार्ग बंदी छोड़ को हिन्दू या जैन दीपावली में नहीं मिलाता।", "किसी कर्म से पुण्य, रक्षा या सफलता की गारंटी नहीं।"],
    }


def adjust_bandi(procedures: list[dict[str, Any]]) -> None:
    for procedure in procedures:
        if procedure["tier"] == "standard":
            procedure["setting"] = "community_participation"
            procedure["form"] = "institutional_participation"
        elif procedure["tier"] == "elaborate":
            procedure["setting"] = "community_participation"
            procedure["form"] = "institutional_participation"


def bandi_chhor() -> dict[str, Any]:
    legacy = load("bandi-chhor-sgpc-participation-v1.json")
    lane_id = "bandi-chhor-sgpc-participant-content-v1"
    pack = {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1", "lane_id": lane_id, "supersedes_legacy_pack_ids": [legacy["pack_id"]], "observance_slugs": [legacy["observance_slug"]],
        "applicability": {"region_codes": ["sikh-punjab"], "tradition_codes": ["sikh-sgpc"], "institution_codes": ["sgpc-context"], "context_pairs": [{"region_code": "sikh-punjab", "tradition_code": "sikh-sgpc"}], "settings": ["individual", "household", "community", "temple"], "family_practice_overrides_generic_guidance": True, "material_context_questions": legacy["guides"][0]["context_prompts"]},
        "calendar": {"resolution_source_ids": ["devam-bandi-chhor-date-fixture"], "timing_kind": "institutional_schedule", "location_aware": True, "tradition_aware": True, "decision_rule_id": "devam-sgpc-nanakshahi-23-kattak-bandi-chhor-v1", "live_schedule_required": True, "freshness_note": "The SGPC 2026 date is resolved; every gurdwara programme and access schedule must be checked live."},
        "sources": [
            source("devam-bandi-chhor-date-fixture", "Devam Bandi Chhor Amritsar 2026 date evidence fixture", "Devam", "Official-calendar-bound date and identity evidence; not a gurdwara programme", "derivative_allowed", artifact_sha256="01536637248ca6fe97b426ffc1bc6e42f7e33e611c0d461e59f40a46b6573a7b", citation_coordinates={"path": "knowledge_packs/panchang/bandi-chhor-amritsar-2026-v1.json"}),
            source("sgpc-bandi-chhor-identity", "SGPC Bandi Chhor Divas identity statement", "Shiromani Gurdwara Parbandhak Committee", "Official Sikh identity and historical context; not a complete programme", "citation_only", url="https://sgpc.net/union-culture-ministrys-removal-of-bandi-chhor-diwas-post-unfortunate-harjinder-singh-dhami/", observed_fetch=SGPC_FETCH),
            source("baru-sahib-bandi-chhor-history", "Bandi Chhor Divas: Guru Hargobind and the 52 rulers", "The Kalgidhar Trust / Baru Sahib", "Sikh institutional history, kirtan, and langar context; not universal liturgy", "citation_only", url="https://barusahib.org/general/bandichhod-diwas-di-lakh-lakh-wadhai/", observed_fetch=BARU_FETCH),
            source("devam-bandi-chhor-safety-boundary", "Devam gurdwara, flame, food, donation, and liturgy boundary", "Devam", "Editorial participation and safety boundary; not Sikh authority", "internal_only"),
        ],
        "localized_content": localized_content(legacy, lane_id, {"minimum": "Source-grounded personal or household remembrance", "standard": "Gurdwara-directed participant form", "elaborate": "Established gurdwara programme participation only"}, ["baru-sahib-bandi-chhor-history", "devam-bandi-chhor-safety-boundary"], ["devam-bandi-chhor-safety-boundary"], bandi_details, procedure_adjuster=adjust_bandi),
        "product_status": status(),
    }
    assert_source_references(pack)
    return pack


def ahoi_details(language: str) -> dict[str, Any]:
    if language == "en":
        return {
            "significance": {"text": "Ahoi Ashtami is a North Indian family observance centred on Mata Ahoi and children's wellbeing. The ordinary practice may include a dawn-to-evening fast, evening image worship and story, and a family-specific close after seeing stars or the moon.", "source_ids": ["drikpanchang-ahoi-practice-context"]},
            "origin_narratives": [{"narrative_id": "ahoi-mata-seven-sons-story", "title": "The accidental harm and Ahoi Mata story", "summary": "A common practitioner-retold katha tells of a woman who accidentally kills an animal's young while digging, suffers loss, and observes Ahoi Mata worship; versions and moral emphases vary by family.", "tradition_scope": "Current North Indian practitioner-retold story; not universal history", "source_ids": ["drikpanchang-ahoi-katha"], "universal_origin_claimed": False}],
            "typical_practices": [{"practice_id": "north-india-ahoi-household", "population_scope": "North Indian families described by the current practitioner source", "description": "Women commonly prepare before sunset, use a family Ahoi image, narrate the katha, offer simple food or water, perform aarti, and close after seeing stars or, in some families, the moon; fasting and materials vary.", "source_ids": ["drikpanchang-ahoi-practice-context"], "instructional": False}],
            "variants": [
                {"variant_id": "star-or-moon-close", "scope": "North Indian family practice", "difference": "Some families close after stars and others after moonrise; the family rule controls.", "source_ids": ["drikpanchang-ahoi-practice-context", "devam-ahoi-ashtami-date-fixture"], "separate_lane_required": False},
                {"variant_id": "family-image-and-offerings", "scope": "Household and local practice", "difference": "Wall drawing, printed image, silver Syau, grass or cotton, foods, arghya vessel, and story version differ.", "source_ids": ["drikpanchang-ahoi-practice-context"], "separate_lane_required": False},
                {"variant_id": "radha-kunda-krishnashtami", "scope": "Radha Kunda fertility-associated observance", "difference": "The pre-dawn bath and Kushmanda offering are a distinct place- and need-specific lane and are not included here.", "source_ids": ["drikpanchang-ahoi-practice-context", "devam-ahoi-safety-boundary"], "separate_lane_required": True},
            ],
            "safety_and_boundaries": ["Fasting is described, not mandatory medical advice; do not begin or continue it when pregnant, breastfeeding, unwell, medicated, very young, elderly, or otherwise at risk without appropriate guidance.", "Never supervise children, use rooftops, or handle flames unsafely while waiting for stars or moonrise.", "Use inclusive child-wellbeing language; the historical sons-only wording is not universalized.", "No practice guarantees fertility, longevity, protection, merit, or success."],
        }
    return {
        "significance": {"text": "अहोई अष्टमी उत्तर भारतीय पारिवारिक पालन है जिसका केन्द्र अहोई माता और बच्चों की कुशलता है। सामान्य रूप में प्रातः से संध्या उपवास, शाम को चित्र-पूजन और कथा, तथा परिवार के अनुसार तारा या चन्द्र-दर्शन के बाद समापन हो सकता है।", "source_ids": ["drikpanchang-ahoi-practice-context"]},
        "origin_narratives": [{"narrative_id": "ahoi-mata-seven-sons-story", "title": "अनजाने अहित और अहोई माता की कथा", "summary": "एक प्रचलित वर्तमान कथा में मिट्टी खोदते समय पशु-शिशुओं की अनजाने मृत्यु, पारिवारिक हानि और अहोई माता पालन आता है; परिवारों में रूप और अर्थ बदल सकते हैं।", "tradition_scope": "वर्तमान उत्तर भारतीय पुनर्कथन; सार्वभौमिक इतिहास नहीं", "source_ids": ["drikpanchang-ahoi-katha"], "universal_origin_claimed": False}],
        "typical_practices": [{"practice_id": "north-india-ahoi-household", "population_scope": "वर्तमान स्रोत में वर्णित उत्तर भारतीय परिवार", "description": "आमतौर पर महिलाएँ सूर्यास्त से पहले तैयारी करती हैं, परिचित अहोई चित्र रखती हैं, कथा सुनाती हैं, सरल अर्पण/जल देती हैं, आरती करती हैं और तारे या कुछ परिवारों में चन्द्रमा देखकर समापन करती हैं; उपवास और सामग्री बदलते हैं।", "source_ids": ["drikpanchang-ahoi-practice-context"], "instructional": False}],
        "variants": [
            {"variant_id": "star-or-moon-close", "scope": "उत्तर भारतीय पारिवारिक रीति", "difference": "कुछ परिवार तारे और कुछ चन्द्र-दर्शन के बाद समापन करते हैं; परिवार की रीति मान्य है।", "source_ids": ["drikpanchang-ahoi-practice-context", "devam-ahoi-ashtami-date-fixture"], "separate_lane_required": False},
            {"variant_id": "family-image-and-offerings", "scope": "पारिवारिक और स्थानीय रीति", "difference": "दीवार-चित्र, छपा चित्र, चाँदी की स्याउ, घास/रुई, भोजन, अर्घ्य-पात्र और कथा बदल सकते हैं।", "source_ids": ["drikpanchang-ahoi-practice-context"], "separate_lane_required": False},
            {"variant_id": "radha-kunda-krishnashtami", "scope": "राधा कुण्ड का संतान-संबंधी पालन", "difference": "अरुणोदय स्नान और कूष्माण्ड अर्पण अलग स्थान/आवश्यकता-विशिष्ट मार्ग हैं और यहाँ शामिल नहीं।", "source_ids": ["drikpanchang-ahoi-practice-context", "devam-ahoi-safety-boundary"], "separate_lane_required": True},
        ],
        "safety_and_boundaries": ["उपवास का वर्णन है, चिकित्सा-निर्देश नहीं; गर्भावस्था, स्तनपान, बीमारी, दवा, कम/अधिक आयु या अन्य जोखिम में उचित मार्गदर्शन के बिना आरम्भ या जारी न करें।", "तारे/चन्द्रमा देखते समय बच्चों, छत/बालकनी और लौ की सुरक्षा रखें।", "सभी बच्चों की कुशलता की समावेशी भाषा लें; पुत्र-मात्र ऐतिहासिक भाषा सार्वभौमिक नहीं।", "कोई पालन संतान, आयु, रक्षा, पुण्य या सफलता की गारंटी नहीं देता।"],
    }


def adjust_ahoi(procedures: list[dict[str, Any]]) -> None:
    for procedure in procedures:
        language = "hi" if "-hi-" in procedure["procedure_id"] else "en"
        if procedure["tier"] != "standard":
            continue
        procedure["authority_scope"] = "Bounded North Indian household form; family image, story, fast, offerings, star-or-moon close, and words override it"
        procedure["estimated_minutes"] = 35
        if language == "en":
            procedure["materials"] = [
                {"item": "Family's Ahoi Mata image or a simple respectful representation", "required": False, "substitutions": ["Family-owned digital or printed image", "Material-free remembrance"], "source_ids": ["drikpanchang-ahoi-practice-context", "devam-ahoi-safety-boundary"]},
                {"item": "Water vessel and simple family-approved offering", "required": False, "substitutions": ["Plain water only", "No food offering"], "source_ids": ["drikpanchang-ahoi-practice-context", "devam-ahoi-safety-boundary"]},
                {"item": "Optional supervised lamp", "required": False, "substitutions": ["Electric lamp", "No light"], "source_ids": ["devam-ahoi-safety-boundary"]},
            ]
            instructions = [
                ("Confirm the local date and ask whether your family follows a star or moon close, a particular image or story, and a fast.", "The deterministic date is bounded; the household controls the living form.", ["devam-ahoi-ashtami-date-fixture", "drikpanchang-ahoi-practice-context"]),
                ("If a healthy adult freely follows the family fast, begin only with appropriate health judgment; everyone else may join the puja and care actions without fasting.", "The source describes fasting, while safety and inclusion prevent it becoming universal medical advice.", ["drikpanchang-ahoi-practice-context", "devam-ahoi-safety-boundary"]),
                ("Before sunset, prepare a clean place with the family's Ahoi image or a simple substitute, water, and any familiar offering.", "The source places preparation before the evening puja and records several material variants.", ["drikpanchang-ahoi-practice-context"]),
                ("At the family evening time, remember Ahoi Mata, use the family's familiar prayer or silence, and narrate or read the family's katha without presenting one version as history.", "Image worship and katha are ordinary practice, but wording and story versions vary.", ["drikpanchang-ahoi-practice-context", "drikpanchang-ahoi-katha"]),
                ("Offer water to the visible stars or moon only according to family practice and from a safe place; if visibility fails, ask the family how it closes rather than inventing a rule.", "The source explicitly preserves star and moon variants.", ["drikpanchang-ahoi-practice-context", "devam-ahoi-safety-boundary"]),
                ("Complete the familiar close, share or distribute food only as the family safely does, and choose one concrete act supporting a child or caregiver.", "This connects the observance to wellbeing without promising an outcome.", ["drikpanchang-ahoi-practice-context", "devam-ahoi-safety-boundary"]),
            ]
        else:
            procedure["authority_scope"] = "सीमित उत्तर भारतीय पारिवारिक रूप; परिवार का चित्र, कथा, उपवास, अर्पण, तारा/चन्द्र समापन और शब्द सर्वोपरि"
            procedure["materials"] = [
                {"item": "परिवार का अहोई माता चित्र या सरल सम्मानपूर्ण रूप", "required": False, "substitutions": ["परिवार का डिजिटल/छपा चित्र", "बिना सामग्री स्मरण"], "source_ids": ["drikpanchang-ahoi-practice-context", "devam-ahoi-safety-boundary"]},
                {"item": "जल-पात्र और परिवार-स्वीकृत सरल अर्पण", "required": False, "substitutions": ["केवल सादा जल", "बिना भोजन-अर्पण"], "source_ids": ["drikpanchang-ahoi-practice-context", "devam-ahoi-safety-boundary"]},
                {"item": "वैकल्पिक देखरेख वाला दीप", "required": False, "substitutions": ["बिजली का दीप", "बिना प्रकाश"], "source_ids": ["devam-ahoi-safety-boundary"]},
            ]
            instructions = [
                ("स्थानीय तिथि की पुष्टि करके पूछें कि परिवार तारा या चन्द्र समापन, कौन-सा चित्र/कथा और उपवास मानता है।", "तिथि सीमित रूप में तय है; जीवित रूप परिवार तय करता है।", ["devam-ahoi-ashtami-date-fixture", "drikpanchang-ahoi-practice-context"]),
                ("स्वस्थ वयस्क अपनी इच्छा से पारिवारिक उपवास करे तो उचित स्वास्थ्य-विवेक से ही आरम्भ करे; अन्य सभी बिना उपवास पूजा और देखभाल के कार्य में जुड़ सकते हैं।", "स्रोत उपवास बताता है, पर सुरक्षा और समावेशन उसे सार्वभौमिक चिकित्सा-निर्देश नहीं बनने देते।", ["drikpanchang-ahoi-practice-context", "devam-ahoi-safety-boundary"]),
                ("सूर्यास्त से पहले साफ स्थान पर परिवार का अहोई चित्र या सरल विकल्प, जल और परिचित अर्पण तैयार करें।", "स्रोत संध्या-पूजा से पहले तैयारी और सामग्री के अनेक रूप बताता है।", ["drikpanchang-ahoi-practice-context"]),
                ("पारिवारिक संध्या-समय अहोई माता का स्मरण, परिचित प्रार्थना या मौन, और परिवार की कथा का पाठ/वाचन करें; एक कथा को इतिहास न कहें।", "चित्र-पूजन और कथा सामान्य हैं, पर शब्द और कथा-रूप बदलते हैं।", ["drikpanchang-ahoi-practice-context", "drikpanchang-ahoi-katha"]),
                ("परिवार की रीति हो तो सुरक्षित स्थान से दिखाई देने वाले तारे या चन्द्रमा को जल दें; दृश्यता न हो तो परिवार से समापन पूछें, नया नियम न गढ़ें।", "स्रोत तारा और चन्द्र दोनों रूप सुरक्षित रखता है।", ["drikpanchang-ahoi-practice-context", "devam-ahoi-safety-boundary"]),
                ("परिचित समापन करें, भोजन परिवार की सुरक्षित रीति से बाँटें और किसी बच्चे या देखभालकर्ता के लिए एक ठोस सहायता चुनें।", "यह फल की गारंटी के बिना पालन को कुशलता से जोड़ता है।", ["drikpanchang-ahoi-practice-context", "devam-ahoi-safety-boundary"]),
            ]
        procedure["steps"] = [{"ordinal": i + 1, "instruction": item[0], "why": item[1], "source_ids": item[2], "optional": False} for i, item in enumerate(instructions)]
        procedure["source_ids"] = list(dict.fromkeys(source_id for step in procedure["steps"] for source_id in step["source_ids"] if source_id))
        for material in procedure["materials"]:
            for source_id in material["source_ids"]:
                if source_id not in procedure["source_ids"]:
                    procedure["source_ids"].append(source_id)
        for source_id in procedure["closing"]["source_ids"]:
            if source_id not in procedure["source_ids"]:
                procedure["source_ids"].append(source_id)


def ahoi_ashtami() -> dict[str, Any]:
    legacy = load("ahoi-ashtami-north-india-family-v1.json")
    lane_id = "ahoi-ashtami-north-india-household-content-v1"
    pack = {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1", "lane_id": lane_id, "supersedes_legacy_pack_ids": [legacy["pack_id"]], "observance_slugs": [legacy["observance_slug"]],
        "applicability": {"region_codes": ["north-india"], "tradition_codes": ["smarta-north-india"], "context_pairs": [{"region_code": "north-india", "tradition_code": "smarta-north-india"}], "settings": ["individual", "household", "family_led"], "family_practice_overrides_generic_guidance": True, "material_context_questions": legacy["guides"][0]["context_prompts"]},
        "calendar": {"resolution_source_ids": ["devam-ahoi-ashtami-date-fixture"], "timing_kind": "mixed", "location_aware": True, "tradition_aware": True, "decision_rule_id": "devam-current-practitioner-ahoi-ashtami-unique-pradosha-ashtami-v1", "closing_decision_rule_id": "family-star-or-moon-close-not-universalized", "live_schedule_required": False, "freshness_note": "The Delhi 2026 date is resolved. Actual star visibility, moonrise, family close, and any temple programme remain local."},
        "sources": [
            source("devam-ahoi-ashtami-date-fixture", "Devam Ahoi Ashtami Delhi 2026 date evidence fixture", "Devam", "Deterministic Delhi date and star-or-moon variant evidence; not household authority", "derivative_allowed", artifact_sha256="f35053c40b788f82da8264ae8d7675e706ea5152b925f6ee86fd6c87d9a3831c", citation_coordinates={"path": "knowledge_packs/panchang/ahoi-ashtami-delhi-2026-v1.json"}),
            source("drikpanchang-ahoi-practice-context", "Ahoi Ashtami Puja Vidhi", "Drik Panchang", "Current practitioner evidence for timing, preparation, image, katha, aarti, offerings, fast, and star-or-moon variants", "citation_only", url="https://www.drikpanchang.com/festivals/ahoi-ashtami/info/ahoi-ashtami-puja-vidhi.html", observed_fetch=AHOI_VIDHI_FETCH),
            source("drikpanchang-ahoi-katha", "Ahoi Ashtami Vrat Katha", "Drik Panchang", "Current practitioner-retold story; not universal history", "citation_only", url="https://www.drikpanchang.com/festivals/ahoi-ashtami/legends/ahoi-ashtami-vrat-katha.html", observed_fetch=AHOI_STORY_FETCH),
            source("devam-ahoi-safety-boundary", "Devam inclusive child-wellbeing, fasting, health, flame, and outcome boundary", "Devam", "Editorial safety, inclusion, and authority boundary; not ritual authority", "internal_only"),
        ],
        "localized_content": localized_content(legacy, lane_id, {"minimum": "Accessible child-wellbeing remembrance", "standard": "Bounded North Indian household Ahoi form", "elaborate": "Established family- or temple-led form only"}, ["drikpanchang-ahoi-practice-context", "devam-ahoi-safety-boundary"], ["devam-ahoi-safety-boundary"], ahoi_details, procedure_adjuster=adjust_ahoi),
        "product_status": status(),
    }
    assert_source_references(pack)
    return pack


def main() -> int:
    outputs = {
        "jain-diwali-umbrella-companion-content-v1.json": jain_diwali(),
        "bandi-chhor-sgpc-participant-content-v1.json": bandi_chhor(),
        "ahoi-ashtami-north-india-household-content-v1.json": ahoi_ashtami(),
    }
    reports = []
    for filename, value in outputs.items():
        payload = (json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n").encode("utf-8")
        path = PACK_DIR / filename
        path.write_bytes(payload)
        reports.append({"path": path.relative_to(ROOT).as_posix(), "bytes": len(payload), "sha256": hashlib.sha256(payload).hexdigest(), "classification": value["product_status"]["classification"]})
    print(json.dumps(reports, ensure_ascii=False, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

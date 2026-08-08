#!/usr/bin/env python3
"""Build current-contract recurring Sankashti and Masika Durgashtami lanes."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any

from build_early_diwali_content_batch_v1 import load, source, status
from build_late_diwali_content_batch_v1 import assert_source_references, localized_content


ROOT = Path(__file__).resolve().parents[1]
PACK_DIR = ROOT / "knowledge_packs" / "rituals"
PANCHANG_DIR = ROOT / "knowledge_packs" / "panchang"
GANESHA_PACK = ROOT / "knowledge_packs" / "ganesha" / "shriganapatimantraksharavali-v1.json"
PARGITER_PLAN = ROOT / "ingestion" / "plans" / "markandeya-purana-pargiter-1904-v1.json"
SANKASHTI_OUTPUT = PACK_DIR / "sankashti-chaturthi-west-india-content-v1.json"
DURGASHTAMI_OUTPUT = PACK_DIR / "masika-durgashtami-north-west-content-v1.json"

SANKASHTI_LEGACY = PACK_DIR / "sankashti-chaturthi-west-india-family-v1.json"
SANKASHTI_FIXTURE = PANCHANG_DIR / "sankashti-chaturthi-delhi-mumbai-september-december-2026-v1.json"
DURGASHTAMI_LEGACY = PACK_DIR / "masika-durgashtami-north-west-v1.json"
DURGASHTAMI_FIXTURE = PANCHANG_DIR / "masika-durgashtami-delhi-september-december-2026-v1.json"

EXPECTED = {
    SANKASHTI_LEGACY: (22108, "19cf87fe0be455f0bc4f8fdc0028b6511c03bbc1df71b563bafe680a9e248b50"),
    SANKASHTI_FIXTURE: (7629, "d14c3552f4ff41bae44bc4cabf4c0f24265d5e099bcfe707f28349f248701944"),
    GANESHA_PACK: (17225, "492bafe94124f81de32acee6329b798fe09970eace160bdd1a9db646d5959d2d"),
    DURGASHTAMI_LEGACY: (19914, "323c481459207eeb9e1937d8f69618ab891a4f2c2a602be4fd51ff9721e744fd"),
    DURGASHTAMI_FIXTURE: (4225, "68130406f9cff8b5f2c12cff08b5b75d8d06cdef02e2d35653f34f2dbf8edcae"),
    PARGITER_PLAN: (11171, "fe1102e0624286cf2676da7249b52e7bca69f3310ba6008b82312b1fc04c9773"),
}


def verify_inputs() -> None:
    for path, (size, digest) in EXPECTED.items():
        payload = path.read_bytes()
        if len(payload) != size or hashlib.sha256(payload).hexdigest() != digest:
            raise ValueError(f"Recurring Ganesha/Durga frozen input drift: {path}")


def observed(value: dict[str, Any]) -> dict[str, Any]:
    return {
        "status": value["status"],
        "final_url": value["final_url"],
        "response_bytes": value["response_bytes"],
        "response_sha256": value["response_sha256"],
        "strict_utf8": value["strict_utf8"],
        "observed_at": value.get("fetched_at_utc"),
    }


def sankashti_details(language: str) -> dict[str, Any]:
    if language == "en":
        return {
            "significance": {
                "text": "In the bounded West India Smarta lane, Sankashti Chaturthi is a recurring Krishna-paksha Chaturthi centred on Ganesha remembrance. The retained Maharashtra evidence also records prayer and moon-observation context, while the date, monthly name, local moonrise and family close remain location- and practice-specific.",
                "source_ids": ["devam-sankashti-date-and-practice-fixture", "maharashtra-tourism-ranjangaon-sankashti", "siddhivinayak-trust-sankashti-dates"],
                "scope_note": "This is a non-fasting West India family companion for four resolved 2026 lanes, not a universal Sankashti vrata, katha, puja, arghya or food rule.",
            },
            "origin_narratives": [
                {
                    "narrative_id": "monthly-sankashti-source-boundary",
                    "title": "A recurring Ganesha observance with distinct monthly identities",
                    "summary": "The official Maharashtra and temple evidence supports a recurring Ganesha observance and separate monthly dates, names and moonrise context. It does not establish one universal origin katha for every month, so Devam preserves a family's named katha or temple account separately instead of inventing or merging it.",
                    "tradition_scope": "Bounded Maharashtra and West India living-practice context",
                    "source_ids": ["devam-sankashti-date-and-practice-fixture", "maharashtra-tourism-ranjangaon-sankashti", "siddhivinayak-trust-sankashti-dates"],
                    "universal_origin_claimed": False,
                },
                {
                    "narrative_id": "ganesha-vighna-source-teaching",
                    "title": "Ganesha and impediments in one identified hymn",
                    "summary": "The separately retained Shri Ganapatimantraksharavali hymn praises Ganapati through obstacle-related epithets. This supports an attributable reflection on meeting an obstacle; it is not the origin of Sankashti and does not guarantee that an obstacle will disappear.",
                    "tradition_scope": "One source-bounded Sanskrit hymn and Devam reading guide",
                    "source_ids": ["devam-ganesha-hymn-pack-v1", "devam-sankashti-safety-boundary"],
                    "universal_origin_claimed": False,
                },
            ],
            "typical_practices": [
                {
                    "practice_id": "west-india-family-ganesha-prayer",
                    "population_scope": "West India families that already observe monthly Sankashti",
                    "description": "A family may use its familiar Ganesha name, prayer, arati, katha, image or temple connection, with optional suitable offerings. The app's source-bounded hymn reading is an accessible companion and not a replacement for that practice.",
                    "source_ids": ["maharashtra-tourism-ranjangaon-sankashti", "devam-ganesha-hymn-pack-v1", "devam-sankashti-safety-boundary"],
                    "instructional": False,
                },
                {
                    "practice_id": "safe-local-moonrise-close",
                    "population_scope": "Families whose established Sankashti practice includes moon observation",
                    "description": "Where the family observes the moon, it uses a safe local moonrise and its known close. Provider city tables corroborate evidence but are never reused as another user's calculated moonrise.",
                    "source_ids": ["devam-sankashti-date-and-practice-fixture", "siddhivinayak-trust-sankashti-dates", "devam-sankashti-safety-boundary"],
                    "instructional": False,
                },
            ],
            "variants": [
                {
                    "variant_id": "monthly-name-and-katha-remain-separate",
                    "scope": "September-December 2026 named Sankashti observances",
                    "difference": "Vighnaraja, Vakratunda, Ganadhipa and Akhuratha labels are preserved as provider observations. Their kathas, promises and special rites are not inferred from one another.",
                    "source_ids": ["devam-sankashti-date-and-practice-fixture", "devam-sankashti-safety-boundary"],
                    "separate_lane_required": True,
                },
                {
                    "variant_id": "local-moonrise-and-family-close",
                    "scope": "Location and household practice",
                    "difference": "The applicable date and moonrise depend on the user's place, while moon observation, arghya, food and the close depend on family or temple practice.",
                    "source_ids": ["devam-sankashti-date-and-practice-fixture", "siddhivinayak-trust-sankashti-dates"],
                    "separate_lane_required": False,
                },
                {
                    "variant_id": "coincident-observances-remain-distinct",
                    "scope": "Ganesh Chaturthi and same-day Karwa Chauth",
                    "difference": "Annual Ganesh Chaturthi and Karwa Chauth retain their own calendar, meaning and procedure even when a civil date or Ganesha theme appears nearby.",
                    "source_ids": ["devam-sankashti-date-and-practice-fixture", "devam-sankashti-safety-boundary"],
                    "separate_lane_required": True,
                },
            ],
            "safety_and_boundaries": [
                "Use the runtime's location-specific date and moonrise; do not copy a Delhi or Mumbai provider time to another location.",
                "No fast, nirjala practice, food rule or medical advice is prescribed.",
                "Moon observation, rooftop or balcony access, flame, offerings, arghya, katha, mantra and close remain optional or family-directed.",
                "No obstacle removal, success, protection, merit or other result is guaranteed.",
                "Ganesh Chaturthi, Karwa Chauth and every regional Sankashti tradition remain separate.",
            ],
        }
    return {
        "significance": {
            "text": "इस सीमित पश्चिम भारतीय स्मार्त मार्ग में संकष्टी चतुर्थी कृष्ण-पक्ष की आवर्ती चतुर्थी है, जिसका केन्द्र गणेश-स्मरण है। सुरक्षित महाराष्ट्र-साक्ष्य प्रार्थना और चन्द्र-दर्शन का संदर्भ भी देता है; तिथि, मासिक नाम, स्थानीय चन्द्रोदय और पारिवारिक समापन स्थान तथा परम्परा के अनुसार रहते हैं।",
            "source_ids": ["devam-sankashti-date-and-practice-fixture", "maharashtra-tourism-ranjangaon-sankashti", "siddhivinayak-trust-sankashti-dates"],
            "scope_note": "यह 2026 के चार तय मार्गों के लिए बिना उपवास वाला पश्चिम भारतीय पारिवारिक सहचर है; सार्वभौमिक संकष्टी-व्रत, कथा, पूजा, अर्घ्य या भोजन-नियम नहीं।",
        },
        "origin_narratives": [
            {
                "narrative_id": "monthly-sankashti-source-boundary",
                "title": "अलग मासिक पहचानों वाला आवर्ती गणेश-पर्व",
                "summary": "आधिकारिक महाराष्ट्र और मंदिर-साक्ष्य आवर्ती गणेश-पर्व तथा अलग मासिक तिथियों, नामों और चन्द्रोदय-संदर्भ का समर्थन करता है। वह हर महीने के लिए एक सार्वभौमिक मूल-कथा सिद्ध नहीं करता; इसलिए Devam परिवार की नामित कथा या मंदिर-वृत्तान्त को अलग रखता है, गढ़ता या मिलाता नहीं।",
                "tradition_scope": "सीमित महाराष्ट्र और पश्चिम भारतीय जीवित-परम्परा संदर्भ",
                "source_ids": ["devam-sankashti-date-and-practice-fixture", "maharashtra-tourism-ranjangaon-sankashti", "siddhivinayak-trust-sankashti-dates"],
                "universal_origin_claimed": False,
            },
            {
                "narrative_id": "ganesha-vighna-source-teaching",
                "title": "एक पहचाने स्तोत्र में गणेश और विघ्न",
                "summary": "अलग सुरक्षित श्रीगणपतिमन्त्राक्षरावली स्तोत्र गणपति को विघ्न-संबंधी नामों से स्तुति करता है। यह किसी बाधा पर स्रोत-स्पष्ट चिंतन का आधार है; संकष्टी की उत्पत्ति नहीं और बाधा दूर होने की गारंटी नहीं।",
                "tradition_scope": "एक स्रोत-बद्ध संस्कृत स्तोत्र और Devam पाठ-सहचर",
                "source_ids": ["devam-ganesha-hymn-pack-v1", "devam-sankashti-safety-boundary"],
                "universal_origin_claimed": False,
            },
        ],
        "typical_practices": [
            {
                "practice_id": "west-india-family-ganesha-prayer",
                "population_scope": "मासिक संकष्टी मानने वाले पश्चिम भारतीय परिवार",
                "description": "परिवार परिचित गणेश-नाम, प्रार्थना, आरती, कथा, विग्रह या मंदिर-संबंध और इच्छानुसार उपयुक्त अर्पण रख सकता है। ऐप का स्रोत-बद्ध स्तोत्र-पाठ सुलभ सहचर है, पारिवारिक रीति का स्थानापन्न नहीं।",
                "source_ids": ["maharashtra-tourism-ranjangaon-sankashti", "devam-ganesha-hymn-pack-v1", "devam-sankashti-safety-boundary"],
                "instructional": False,
            },
            {
                "practice_id": "safe-local-moonrise-close",
                "population_scope": "वे परिवार जिनकी स्थापित संकष्टी रीति में चन्द्र-दर्शन है",
                "description": "जहाँ परिवार चन्द्र-दर्शन करता है, वहाँ सुरक्षित स्थानीय चन्द्रोदय और परिचित समापन लिया जाता है। प्रदाता की नगर-तालिकाएँ साक्ष्य-जाँच हैं; किसी दूसरे उपयोगकर्ता का गणितीय चन्द्रोदय नहीं।",
                "source_ids": ["devam-sankashti-date-and-practice-fixture", "siddhivinayak-trust-sankashti-dates", "devam-sankashti-safety-boundary"],
                "instructional": False,
            },
        ],
        "variants": [
            {
                "variant_id": "monthly-name-and-katha-remain-separate",
                "scope": "सितम्बर-दिसम्बर 2026 की नामित संकष्टियाँ",
                "difference": "विघ्नराज, वक्रतुण्ड, गणाधिप और आखुरथ नाम प्रदाता-अवलोकन के रूप में सुरक्षित हैं। उनकी कथाएँ, फल और विशेष विधियाँ एक-दूसरे से अनुमानित नहीं होतीं।",
                "source_ids": ["devam-sankashti-date-and-practice-fixture", "devam-sankashti-safety-boundary"],
                "separate_lane_required": True,
            },
            {
                "variant_id": "local-moonrise-and-family-close",
                "scope": "स्थान और पारिवारिक रीति",
                "difference": "लागू तिथि और चन्द्रोदय उपयोगकर्ता के स्थान पर निर्भर हैं; चन्द्र-दर्शन, अर्घ्य, भोजन और समापन परिवार या मंदिर-रीति पर।",
                "source_ids": ["devam-sankashti-date-and-practice-fixture", "siddhivinayak-trust-sankashti-dates"],
                "separate_lane_required": False,
            },
            {
                "variant_id": "coincident-observances-remain-distinct",
                "scope": "गणेश चतुर्थी और उसी दिन का करवा चौथ",
                "difference": "वार्षिक गणेश चतुर्थी और करवा चौथ अपनी अलग तिथि, अर्थ और विधि रखते हैं, भले नागरिक दिन या गणेश-विषय पास दिखाई दे।",
                "source_ids": ["devam-sankashti-date-and-practice-fixture", "devam-sankashti-safety-boundary"],
                "separate_lane_required": True,
            },
        ],
        "safety_and_boundaries": [
            "रनटाइम का स्थान-विशिष्ट दिन और चन्द्रोदय लें; दिल्ली या मुंबई का प्रदाता-समय दूसरे स्थान पर न लगाएँ।",
            "उपवास, निर्जला अभ्यास, भोजन-नियम या चिकित्सा-सलाह निर्धारित नहीं की जाती।",
            "चन्द्र-दर्शन, छत या बालकनी, लौ, अर्पण, अर्घ्य, कथा, मंत्र और समापन वैकल्पिक या परिवार-निर्देशित रहते हैं।",
            "विघ्न-नाश, सफलता, रक्षा, पुण्य या अन्य फल की गारंटी नहीं।",
            "गणेश चतुर्थी, करवा चौथ और हर क्षेत्रीय संकष्टी-परम्परा अलग रहती है।",
        ],
    }


def durgashtami_details(language: str) -> dict[str, Any]:
    if language == "en":
        return {
            "significance": {
                "text": "Masika Durgashtami is the recurring Shukla-paksha Ashtami lane used here for a bounded North/West India Durga remembrance. It offers an attributable Devi reading, reflection on courageous care and one practical act, while family, temple and sampradaya practice retain authority over formal worship and fasting.",
                "source_ids": ["devam-masika-durgashtami-calendar-fixture", "nirnayasindhu-1865-general-shukla-ashtami-context", "devam-markandeya-purana-pargiter-devimahatmya"],
                "scope_note": "This is not Shardiya Mahashtami, Bengal Durga Puja, a complete monthly vrata, or one universal Devi procedure.",
            },
            "origin_narratives": [{
                "narrative_id": "devimahatmya-durga-mahishasura-account",
                "title": "Durga and Mahishasura in one identified Devimahatmya expression",
                "summary": "The edition-identified Pargiter translation preserves the Devimahatmya account of the Goddess and the conflict with Mahishasura. Devam offers it as an attributable textual lens for Durga remembrance, not as the sole origin of every monthly Ashtami or every Devi tradition.",
                "tradition_scope": "One 1904 English translation with notes of the Markandeya Purana/Devimahatmya",
                "source_ids": ["devam-markandeya-purana-pargiter-devimahatmya", "devam-masika-durgashtami-safety-boundary"],
                "universal_origin_claimed": False,
            }],
            "typical_practices": [
                {
                    "practice_id": "monthly-durga-remembrance-and-reading",
                    "population_scope": "North/West India individuals or households using this bounded monthly lane",
                    "description": "A person may use a familiar Devi prayer, name, song or one identified passage, then reflect on courageous care, dignity and resistance to harm through one practical act of service or repair.",
                    "source_ids": ["devam-markandeya-purana-pargiter-devimahatmya", "devam-masika-durgashtami-safety-boundary"],
                    "instructional": False,
                },
                {
                    "practice_id": "family-or-temple-led-form",
                    "population_scope": "Families, temples and sampradayas with an established monthly Durga practice",
                    "description": "An established authority may retain its own Devi form, fast, prayer, text, image, offering, arati and close. Current programme details are checked locally and are not reconstructed from a date page.",
                    "source_ids": ["drikpanchang-delhi-masika-durgashtami-2026", "devam-masika-durgashtami-safety-boundary"],
                    "instructional": False,
                },
            ],
            "variants": [
                {
                    "variant_id": "monthly-versus-shardiya-and-bengal-ashtami",
                    "scope": "Monthly, Shardiya Navaratri and Bengal Durga Puja contexts",
                    "difference": "Monthly Durgashtami does not inherit Shardiya Mahashtami, Sandhi Puja, Kumari Puja, Bengal Durga Puja or other regional Ashtami procedures merely because each uses the word Ashtami.",
                    "source_ids": ["devam-masika-durgashtami-calendar-fixture", "devam-masika-durgashtami-safety-boundary"],
                    "separate_lane_required": True,
                },
                {
                    "variant_id": "north-and-west-family-forms",
                    "scope": "North and West India Smarta contexts",
                    "difference": "The current lane shares a bounded remembrance core; exact Devi form, story, prayer, fast, offering and close remain family-, temple- or sampradaya-specific.",
                    "source_ids": ["devam-masika-durgashtami-safety-boundary"],
                    "separate_lane_required": False,
                },
                {
                    "variant_id": "source-reading-versus-formal-recitation",
                    "scope": "Individual reading and formal Devi practice",
                    "difference": "One edition-identified passage is not a complete Chandi or Durga Saptashati recitation, mantra, homa, bali, Kumari worship or priest-led puja.",
                    "source_ids": ["devam-markandeya-purana-pargiter-devimahatmya", "devam-masika-durgashtami-safety-boundary"],
                    "separate_lane_required": True,
                },
            ],
            "safety_and_boundaries": [
                "Resolve the date for the user's actual location; the Delhi fixture is evidence for a bounded rule, not a universal India date.",
                "No fast, food, medical, mantra, image, offering, arati, Chandi recitation, homa, bali or Kumari Puja is prescribed.",
                "The Pargiter translation is one identified historical expression, not the Sanskrit original or the complete Devimahatmya tradition.",
                "Monthly Durgashtami, Shardiya Mahashtami and Bengal Durga Puja remain separate.",
                "No victory, protection, merit, prosperity or other result is guaranteed.",
            ],
        }
    return {
        "significance": {
            "text": "मासिक दुर्गाष्टमी यहाँ उत्तर/पश्चिम भारत के सीमित दुर्गा-स्मरण के लिए शुक्ल-पक्ष अष्टमी का आवर्ती मार्ग है। इसमें स्रोत-स्पष्ट देवी-पाठ, साहसी देखभाल पर चिंतन और एक व्यावहारिक कर्म मिलता है; औपचारिक पूजा और उपवास का अधिकार परिवार, मंदिर और सम्प्रदाय के पास रहता है।",
            "source_ids": ["devam-masika-durgashtami-calendar-fixture", "nirnayasindhu-1865-general-shukla-ashtami-context", "devam-markandeya-purana-pargiter-devimahatmya"],
            "scope_note": "यह शारदीय महाष्टमी, बंगाल दुर्गा पूजा, पूर्ण मासिक व्रत या एक सार्वभौमिक देवी-विधि नहीं।",
        },
        "origin_narratives": [{
            "narrative_id": "devimahatmya-durga-mahishasura-account",
            "title": "देवीमाहात्म्य की एक पहचानी अभिव्यक्ति में दुर्गा और महिषासुर",
            "summary": "संस्करण-पहचानयुक्त पार्जिटर अनुवाद देवीमाहात्म्य में देवी और महिषासुर-संघर्ष का वृत्तान्त सुरक्षित रखता है। Devam इसे दुर्गा-स्मरण के लिए स्रोत-स्पष्ट पाठ-दृष्टि देता है, हर मासिक अष्टमी या हर देवी-परम्परा की एकमात्र उत्पत्ति नहीं।",
            "tradition_scope": "मार्कण्डेय पुराण/देवीमाहात्म्य का 1904 का एक अंग्रेज़ी टिप्पणी-सहित अनुवाद",
            "source_ids": ["devam-markandeya-purana-pargiter-devimahatmya", "devam-masika-durgashtami-safety-boundary"],
            "universal_origin_claimed": False,
        }],
        "typical_practices": [
            {
                "practice_id": "monthly-durga-remembrance-and-reading",
                "population_scope": "इस सीमित मासिक मार्ग का उपयोग करने वाले उत्तर/पश्चिम भारतीय व्यक्ति या परिवार",
                "description": "व्यक्ति परिचित देवी-प्रार्थना, नाम, गीत या एक पहचाना पाठ ले सकता है, फिर साहसी देखभाल, गरिमा और हानि-प्रतिरोध पर विचार करके सेवा या सुधार का एक काम चुन सकता है।",
                "source_ids": ["devam-markandeya-purana-pargiter-devimahatmya", "devam-masika-durgashtami-safety-boundary"],
                "instructional": False,
            },
            {
                "practice_id": "family-or-temple-led-form",
                "population_scope": "स्थापित मासिक दुर्गा-रीति वाले परिवार, मंदिर और सम्प्रदाय",
                "description": "स्थापित अधिकारी अपना देवी-रूप, उपवास, प्रार्थना, ग्रन्थ, प्रतिमा, अर्पण, आरती और समापन रख सकता है। वर्तमान कार्यक्रम स्थानीय रूप से जाँचा जाता है; तिथि-पृष्ठ से पुनर्निर्मित नहीं।",
                "source_ids": ["drikpanchang-delhi-masika-durgashtami-2026", "devam-masika-durgashtami-safety-boundary"],
                "instructional": False,
            },
        ],
        "variants": [
            {
                "variant_id": "monthly-versus-shardiya-and-bengal-ashtami",
                "scope": "मासिक, शारदीय नवरात्रि और बंगाल दुर्गा पूजा संदर्भ",
                "difference": "केवल अष्टमी शब्द साझा होने से मासिक दुर्गाष्टमी में शारदीय महाष्टमी, संधि पूजा, कुमारी पूजा, बंगाल दुर्गा पूजा या अन्य क्षेत्रीय अष्टमी-विधियाँ नहीं आ जातीं।",
                "source_ids": ["devam-masika-durgashtami-calendar-fixture", "devam-masika-durgashtami-safety-boundary"],
                "separate_lane_required": True,
            },
            {
                "variant_id": "north-and-west-family-forms",
                "scope": "उत्तर और पश्चिम भारत के स्मार्त संदर्भ",
                "difference": "वर्तमान मार्ग सीमित स्मरण-मूल साझा करता है; देवी-रूप, कथा, प्रार्थना, उपवास, अर्पण और समापन परिवार, मंदिर या सम्प्रदाय के अनुसार रहते हैं।",
                "source_ids": ["devam-masika-durgashtami-safety-boundary"],
                "separate_lane_required": False,
            },
            {
                "variant_id": "source-reading-versus-formal-recitation",
                "scope": "व्यक्तिगत पाठ और औपचारिक देवी-अनुष्ठान",
                "difference": "एक संस्करण-पहचानयुक्त पाठ पूर्ण चण्डी या दुर्गा सप्तशती-पाठ, मंत्र, होम, बलि, कुमारी पूजा या पुरोहित-विधि नहीं।",
                "source_ids": ["devam-markandeya-purana-pargiter-devimahatmya", "devam-masika-durgashtami-safety-boundary"],
                "separate_lane_required": True,
            },
        ],
        "safety_and_boundaries": [
            "उपयोगकर्ता के वास्तविक स्थान पर तिथि तय करें; दिल्ली फिक्स्चर सीमित नियम का साक्ष्य है, सार्वभौमिक भारत-तिथि नहीं।",
            "उपवास, भोजन, चिकित्सा, मंत्र, प्रतिमा, अर्पण, आरती, चण्डी-पाठ, होम, बलि या कुमारी पूजा निर्धारित नहीं की जाती।",
            "पार्जिटर अनुवाद एक पहचानी ऐतिहासिक अभिव्यक्ति है, संस्कृत मूल या पूर्ण देवीमाहात्म्य-परम्परा नहीं।",
            "मासिक दुर्गाष्टमी, शारदीय महाष्टमी और बंगाल दुर्गा पूजा अलग रहती हैं।",
            "विजय, रक्षा, पुण्य, समृद्धि या अन्य फल की गारंटी नहीं।",
        ],
    }


def build_sankashti() -> dict[str, Any]:
    legacy = load(SANKASHTI_LEGACY.name)
    fixture = json.loads(SANKASHTI_FIXTURE.read_text(encoding="utf-8"))
    slugs = legacy["observance_slugs"]
    if legacy["contract"] != "DEVAM_RECURRING_RITUAL_PROCEDURE_PACK_V1" or legacy["pack_id"] != "devam-sankashti-chaturthi-west-india-family-v1":
        raise ValueError("Sankashti legacy identity drift")
    if fixture["contract"] != "DEVAM_SANKASHTI_CHATURTHI_DELHI_MUMBAI_DATE_EVIDENCE_FIXTURE_V1" or [row["observance_slug"] for row in fixture["observances"]] != slugs:
        raise ValueError("Sankashti fixture universe drift")
    if any(fixture["denials"].values()) or fixture["rule"]["provider_moonrise_reused_as_engine_output"] is not False:
        raise ValueError("Sankashti denial drift")
    fixture_sources = {item["source_id"]: item for item in fixture["sources"]}
    lane_id = "sankashti-chaturthi-west-india-content-v1"
    localized = localized_content(
        legacy,
        lane_id,
        {
            "minimum": "Self-guided Ganesha remembrance and reflection",
            "standard": "Family-known West India Sankashti remembrance",
            "elaborate": "Established family-, elder- or temple-led Sankashti form",
        },
        ["maharashtra-tourism-ranjangaon-sankashti", "devam-sankashti-safety-boundary"],
        ["devam-sankashti-safety-boundary"],
        sankashti_details,
    )
    pack = {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1",
        "lane_id": lane_id,
        "supersedes_legacy_pack_ids": [legacy["pack_id"]],
        "observance_slugs": slugs,
        "applicability": {
            "region_codes": ["west-india"],
            "tradition_codes": ["smarta-west-india"],
            "context_pairs": [{"region_code": "west-india", "tradition_code": "smarta-west-india"}],
            "settings": ["individual", "household", "family_led", "temple"],
            "family_practice_overrides_generic_guidance": True,
            "material_context_questions": legacy["guides"][0]["context_prompts"],
        },
        "calendar": {
            "resolution_source_ids": ["devam-sankashti-date-and-practice-fixture", "siddhivinayak-trust-sankashti-dates"],
            "timing_kind": "mixed",
            "location_aware": True,
            "tradition_aware": True,
            "decision_rule_id": "devam-local-krishna-chaturthi-at-moonrise-v1",
            "closing_decision_rule_id": "family-known-sankashti-close-after-local-moonrise-when-applicable",
            "live_schedule_required": True,
            "freshness_note": "Resolve the exact date and moonrise for the user's location. Provider Delhi/Mumbai times are evidence observations only; family or temple practice controls moon observation, fasting, arghya, food and the close.",
        },
        "sources": [
            source("devam-sankashti-date-and-practice-fixture", legacy["sources"][0]["title"], "Devam", "Fixed historical-rule and current-provider semantic fixture; not a universal vidhi", "derivative_allowed", artifact_sha256=EXPECTED[SANKASHTI_FIXTURE][1], citation_coordinates={"path": "knowledge_packs/panchang/sankashti-chaturthi-delhi-mumbai-september-december-2026-v1.json"}),
            source("siddhivinayak-trust-sankashti-dates", legacy["sources"][1]["title"], legacy["sources"][1]["publisher"], "Official Mumbai dates and moonrise corroboration; not universal ritual authority", "citation_only", url=legacy["sources"][1]["url"], observed_fetch=observed(fixture_sources["siddhivinayak-trust-important-dates-2026"]["observed_fetch"])),
            source("maharashtra-tourism-ranjangaon-sankashti", legacy["sources"][2]["title"], legacy["sources"][2]["publisher"], "Official Maharashtra monthly prayer and moon-observation context; not a universal vidhi", "citation_only", url=legacy["sources"][2]["url"], observed_fetch=observed(fixture_sources["maharashtra-tourism-ranjangaon-sankashti-context"]["observed_fetch"])),
            source("devam-ganesha-hymn-pack-v1", legacy["sources"][3]["title"], "Devam", "Optional source-bounded Ganesha reading; not Sankashti ritual authority", "derivative_allowed", artifact_sha256=EXPECTED[GANESHA_PACK][1], citation_coordinates={"path": "knowledge_packs/ganesha/shriganapatimantraksharavali-v1.json"}),
            source("devam-sankashti-safety-boundary", legacy["sources"][4]["title"], "Devam", "Editorial fasting, health, moon-viewing, flame, food and outcome boundary", "internal_only"),
        ],
        "localized_content": localized,
        "product_status": status(),
    }
    assert_source_references(pack)
    return pack


def build_durgashtami() -> dict[str, Any]:
    legacy = load(DURGASHTAMI_LEGACY.name)
    fixture = json.loads(DURGASHTAMI_FIXTURE.read_text(encoding="utf-8"))
    slugs = legacy["observance_slugs"]
    if legacy["contract"] != "DEVAM_MULTI_LANE_RITUAL_PROCEDURE_PACK_V1" or legacy["pack_id"] != "devam-masika-durgashtami-north-west-v1":
        raise ValueError("Masika Durgashtami legacy identity drift")
    if fixture["contract"] != "DEVAM_BOUNDED_MASIKA_DURGASHTAMI_CALENDAR_FIXTURE_V1" or [row["observance_slug"] for row in fixture["observances"]] != slugs:
        raise ValueError("Masika Durgashtami fixture universe drift")
    if any(fixture["denials"].values()) or fixture["scope"]["universal_india_claim"] is not False:
        raise ValueError("Masika Durgashtami denial drift")
    lane_id = "masika-durgashtami-north-west-content-v1"
    localized = localized_content(
        legacy,
        lane_id,
        {
            "minimum": "Self-guided monthly Durga remembrance",
            "standard": "Source-labelled individual or household reflection",
            "elaborate": "Established family-, teacher- or temple-connected form",
        },
        ["devam-markandeya-purana-pargiter-devimahatmya", "devam-masika-durgashtami-safety-boundary"],
        ["devam-masika-durgashtami-safety-boundary"],
        durgashtami_details,
    )
    current = legacy["sources"][2]
    pack = {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1",
        "lane_id": lane_id,
        "supersedes_legacy_pack_ids": [legacy["pack_id"]],
        "observance_slugs": slugs,
        "applicability": {
            "region_codes": legacy["scope"]["region_codes"],
            "tradition_codes": legacy["scope"]["tradition_codes"],
            "context_pairs": legacy["scope"]["supported_pairs"],
            "settings": ["individual", "household", "family_led", "teacher_led", "temple"],
            "family_practice_overrides_generic_guidance": True,
            "material_context_questions": legacy["guides"][0]["context_prompts"],
        },
        "calendar": {
            "resolution_source_ids": ["devam-masika-durgashtami-calendar-fixture", "nirnayasindhu-1865-general-shukla-ashtami-context", "drikpanchang-delhi-masika-durgashtami-2026"],
            "timing_kind": "textual_rule",
            "location_aware": True,
            "tradition_aware": True,
            "decision_rule_id": "devam-later-shukla-ashtami-at-local-sunrise-v1",
            "closing_decision_rule_id": None,
            "live_schedule_required": True,
            "freshness_note": "Resolve the monthly Ashtami for the user's actual location. A temple or family authority controls current programme details, formal worship, fasting and the close.",
        },
        "sources": [
            source("devam-masika-durgashtami-calendar-fixture", legacy["sources"][0]["title"], "Devam", "Fixed Delhi 2026 calendar evidence; not universal India timing or ritual authority", "derivative_allowed", artifact_sha256=EXPECTED[DURGASHTAMI_FIXTURE][1], citation_coordinates={"path": "knowledge_packs/panchang/masika-durgashtami-delhi-september-december-2026-v1.json"}),
            source("nirnayasindhu-1865-general-shukla-ashtami-context", legacy["sources"][1]["title"], legacy["sources"][1]["publisher"], "Historical Shukla Ashtami and Shiva-Shakti festival context; not modern monthly vidhi", "internal_only", url=legacy["sources"][1]["url"], artifact_sha256=legacy["sources"][1]["artifact_sha256"], citation_coordinates={"pdf_pages": legacy["sources"][1]["pdf_pages"], "source_vault_object": "source_vault/objects/sha256/a6/a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b"}),
            source("drikpanchang-delhi-masika-durgashtami-2026", current["title"], current["publisher"], "Current practitioner identity and Delhi date evidence; not complete vidhi", "citation_only", url=current["url"], observed_fetch={**current["observed_fetch"], "observed_at": "2026-08-06T18:31:15Z"}),
            source("devam-markandeya-purana-pargiter-devimahatmya", legacy["sources"][3]["title"], legacy["sources"][3]["publisher"], "One historical English translation for source-labelled Devi reading; not monthly ritual authority or complete tradition", "derivative_allowed", url=legacy["sources"][3]["url"], citation_coordinates={"ingestion_plan": legacy["sources"][3]["ingestion_plan"], "ingestion_plan_sha256": EXPECTED[PARGITER_PLAN][1], "packet_sha256": legacy["sources"][3]["packet_sha256"], "devimahatmya_context_pdf_pages": [509, 566]}),
            source("devam-masika-durgashtami-safety-boundary", legacy["sources"][4]["title"], "Devam", "Editorial attribution, practice, safety and cross-observance boundary", "internal_only"),
        ],
        "localized_content": localized,
        "product_status": status(),
    }
    assert_source_references(pack)
    return pack


def render(pack: dict[str, Any]) -> bytes:
    return (json.dumps(pack, ensure_ascii=False, indent=2, sort_keys=True) + "\n").encode("utf-8")


def main() -> None:
    verify_inputs()
    outputs = {
        SANKASHTI_OUTPUT: render(build_sankashti()),
        DURGASHTAMI_OUTPUT: render(build_durgashtami()),
    }
    existing = [str(path) for path in outputs if path.exists()]
    if existing:
        raise FileExistsError(f"Refusing to overwrite current packs: {existing}")
    for path, payload in outputs.items():
        path.write_bytes(payload)
        print(json.dumps({"path": str(path.relative_to(ROOT)), "bytes": len(payload), "sha256": hashlib.sha256(payload).hexdigest()}))


if __name__ == "__main__":
    main()

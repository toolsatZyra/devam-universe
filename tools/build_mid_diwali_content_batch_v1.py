#!/usr/bin/env python3
"""Build three distinct current-contract Naraka/Deepavali/Kali-Chaudash lanes."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any

from build_early_diwali_content_batch_v1 import convert_procedures, load, source, status


ROOT = Path(__file__).resolve().parents[1]
PACK_DIR = ROOT / "knowledge_packs" / "rituals"


def fetch(final_url: str, response_bytes: int, response_sha256: str) -> dict[str, Any]:
    return {
        "status": 200,
        "final_url": final_url,
        "response_bytes": response_bytes,
        "response_sha256": response_sha256,
        "strict_utf8": True,
        "observed_at": "2026-08-07",
    }


DRIK_NARAKA_FETCH = fetch(
    "https://www.drikpanchang.com/festivals/abhyangsnan/festivals-abhyangsnan-timings.html?geoname-id=1275339&year=2026",
    80461,
    "01bee07f16ab541d146831ed04b161ca310de19ca02e4acb8d60d58f5317877f",
)
MAHARASHTRA_TOURISM_FETCH = fetch(
    "https://maharashtratourism.gov.in/festivals/diwali/",
    627481,
    "34d855cd52999bcdc93fe630860e28789ac7c347c8eb073f82fd618dfdb74a36",
)
DD_NARAKA_FETCH = fetch(
    "https://newsonair.gov.in/bulletins-detail/parikrama-531/",
    109196,
    "d38e208037bfcc520e8f899e04de6ff5029e85e0bfb2883a8eb6dda2b8ff3725",
)
DD_TAMIL_FETCH = fetch(
    "https://newsonair.gov.in/bulletins-detail/parikrama-524/",
    109950,
    "1adc84398a8bfddc9aca106f8d0cf9f9ac05e37eb05e052e64e9ad130a117116",
)
UTSAV_TAMIL_FETCH = fetch(
    "https://www.utsav.gov.in/public/view-event/deepa-oli-arulmigu-arunchalaeswarar-temple-tiruvannamalai-1",
    34782,
    "0cb8fd0a478ffaa46a0e0e0d032eb5e0d62d72a5941a2e99d528342ac017ea48",
)
BAPS_FESTIVAL_FETCH = fetch(
    "https://www.baps.org/Calendar/2026/FestivalList.aspx",
    115443,
    "d7a128a20cf176416a33c744cc31735501760a4e6bf512309ba20f2635db2e2b",
)
BAPS_NIRNAY_FETCH = fetch(
    "https://www.baps.org/Calendar/2026/Nirnay.aspx",
    213996,
    "6d08b0f92a4615b3ca97ef701f1e591c72f4c141c7774881c9d54d8495dcd6ec",
)
BAPS_STORY_FETCH = fetch(
    "https://www.baps.org/Article/2011/Chaturmaas-Part-III-2207.aspx",
    235863,
    "6d613ee36b5c50b94eef83d4a00c14f643fe98ae8fab2c36d844070fe94cd3c4",
)
DRIK_GUJARATI_FETCH = fetch(
    "https://www.drikpanchang.com/gujarati/calendar/gujarati-calendar.html?geoname-id=1279233&year=2026",
    216717,
    "1630a84fa2228f843512b6a1d7e352dfa9dbfe9faf2934f7fcf6d2975e3951cc",
)


def naraka_chaturdashi() -> dict[str, Any]:
    legacy = load("naraka-chaturdashi-maharashtra-household-v1.json")
    lane_id = "naraka-chaturdashi-maharashtra-content-v1"
    sources = [
        source(
            "devam-naraka-date-fixture",
            "Devam Naraka Chaturdashi Mumbai 2026 date evidence fixture",
            "Devam",
            "Deterministic Mumbai date and moonrise-to-sunrise decision; not a copied provider muhurta or ritual authority",
            "derivative_allowed",
            artifact_sha256="adf5c3d43e6f2fb19ef3ecc75fc92d2cfc671105c2eed87edda11872d34a33a5",
            citation_coordinates={"path": "knowledge_packs/panchang/naraka-chaturdashi-mumbai-2026-v1.json"},
        ),
        source(
            "drik-abhyang-snan-mumbai-2026",
            "2026 Abhyang Snan on Narak Chaturdashi for Mumbai",
            "Drik Panchang",
            "Current practitioner identity, date, moonrise-to-sunrise Abhyanga boundary, and explicit separation from Kali Chaudas; not universal household authority",
            "citation_only",
            url="https://www.drikpanchang.com/festivals/abhyangsnan/festivals-abhyangsnan-timings.html?geoname-id=1275339&year=2026",
            observed_fetch=DRIK_NARAKA_FETCH,
        ),
        source(
            "maharashtra-tourism-diwali-narak",
            "Diwali",
            "Department of Tourism, Government of Maharashtra",
            "Official current Maharashtra sequence and victory-over-harm meaning; not a complete household procedure",
            "citation_only",
            url="https://maharashtratourism.gov.in/festivals/diwali/",
            observed_fetch=MAHARASHTRA_TOURISM_FETCH,
        ),
        source(
            "dd-news-on-air-naraka-current-account",
            "Parikrama: Choti Diwali / Narak Chaturdashi",
            "Akashvani / News on AIR",
            "Official current public-broadcaster Narakasura story and broad Abhyanga-practice account; explicitly not Maharashtra-specific or universal",
            "citation_only",
            url="https://www.newsonair.gov.in/bulletins-detail/parikrama-531/",
            observed_fetch=DD_NARAKA_FETCH,
        ),
        source(
            "devam-naraka-household-safety-boundary",
            "Devam Naraka Chaturdashi bathing, flame, fireworks, food, and regional boundary",
            "Devam",
            "Editorial safety and scope boundary; not scripture, medicine, or ritual authority",
            "internal_only",
        ),
    ]
    localized = []
    for guide in legacy["guides"]:
        english = guide["language_code"] == "en"
        significance = {
            "text": (
                "In this bounded Maharashtra household lane, Naraka Chaturdashi joins a locally timed morning bath with remembrance of liberation from harmful conduct and preparation for Diwali."
                if english else
                "इस सीमित महाराष्ट्र गृह-परम्परा में नरक चतुर्दशी स्थानीय समय के प्रातः स्नान, हानिकारक आचरण से मुक्ति के स्मरण और दीपावली की तैयारी को जोड़ती है।"
            ),
            "source_ids": ["drik-abhyang-snan-mumbai-2026", "maharashtra-tourism-diwali-narak", "dd-news-on-air-naraka-current-account"],
            "scope_note": (
                "The broadcaster account is broader than Maharashtra; family practice controls oil, ubtan, prayer, food, clothing, and the exact close."
                if english else
                "प्रसारक का वर्णन महाराष्ट्र से व्यापक है; तेल, उबटन, प्रार्थना, भोजन, वस्त्र और समापन का ठीक रूप परिवार की परम्परा तय करती है।"
            ),
        }
        narratives = [{
            "narrative_id": "krishna-narakasura-liberation-current-account",
            "title": "Krishna and Narakasura" if english else "श्रीकृष्ण और नरकासुर",
            "summary": (
                "Akashvani's current Choti Diwali account tells of Krishna defeating the oppressive Narakasura and freeing his captives, presenting the day as liberation, justice, and inner cleansing. Devam treats this as an attributable festival retelling, not verified history or the only origin."
                if english else
                "आकाशवाणी का वर्तमान छोटी दीपावली-वर्णन श्रीकृष्ण द्वारा अत्याचारी नरकासुर को पराजित कर बंदियों को मुक्त करने की कथा कहता है और दिन को मुक्ति, न्याय तथा आन्तरिक शुद्धि से जोड़ता है। देवम् इसे स्रोत-सम्बद्ध पर्व-कथा मानता है, सत्यापित इतिहास या एकमात्र उत्पत्ति नहीं।"
            ),
            "tradition_scope": "Current Akashvani Choti Diwali retelling; not Maharashtra-exclusive" if english else "आकाशवाणी की वर्तमान छोटी दीपावली-कथा; केवल महाराष्ट्र तक सीमित नहीं",
            "source_ids": ["dd-news-on-air-naraka-current-account"],
            "universal_origin_claimed": False,
        }]
        practices = [{
            "practice_id": "maharashtra-abhyanga-morning-household",
            "population_scope": "Maharashtra households that keep Naraka Chaturdashi Abhyanga Snan" if english else "नरक चतुर्दशी अभ्यंग स्नान मानने वाले महाराष्ट्र परिवार",
            "description": (
                "The day is kept before sunrise with a family-led bath; some households use familiar oil or ubtan, clean clothes, prayer or story, greetings, and prepared food. Those details are descriptive and family-specific, not requirements for every user."
                if english else
                "दिन सूर्योदय से पहले परिवार-निर्देशित स्नान से रखा जाता है; कुछ घर परिचित तेल या उबटन, स्वच्छ वस्त्र, प्रार्थना या कथा, अभिवादन और तैयार भोजन रखते हैं। ये विवरण वर्णनात्मक और परिवार-विशिष्ट हैं, सबके लिए अनिवार्य नहीं।"
            ),
            "source_ids": ["drik-abhyang-snan-mumbai-2026", "dd-news-on-air-naraka-current-account"],
            "instructional": False,
        }]
        variants = [
            {
                "variant_id": "oil-ubtan-family-variation",
                "scope": "Household bathing practice" if english else "पारिवारिक स्नान-रीति",
                "difference": "Oil, ubtan, who applies it, exact prayer, food, and clothing vary; a normal safe bath is the supported fallback." if english else "तेल, उबटन, लगाने वाला व्यक्ति, ठीक प्रार्थना, भोजन और वस्त्र बदलते हैं; सामान्य सुरक्षित स्नान समर्थित विकल्प है।",
                "source_ids": ["dd-news-on-air-naraka-current-account", "devam-naraka-household-safety-boundary"],
                "separate_lane_required": False,
            },
            {
                "variant_id": "kali-chaudas-and-tamil-deepavali-separate",
                "scope": "Adjacent regional observances" if english else "निकटवर्ती क्षेत्रीय पर्व",
                "difference": "BAPS/Gujarati Kali Chaudas and Tamil Deepavali have their own dates, authorities, and practices and are not completed by this Maharashtra lane." if english else "BAPS/गुजराती काली चौदस और तमिल दीपावली की अपनी तिथियाँ, प्रामाणिकताएँ और रीतियाँ हैं; यह महाराष्ट्र-धारा उन्हें पूरा नहीं करती।",
                "source_ids": ["drik-abhyang-snan-mumbai-2026"],
                "separate_lane_required": True,
            },
        ]
        boundaries = [
            "Oil, ubtan, karita, new clothes, purchases, food, flame, and fireworks are not required; use a normal safe bath whenever appropriate." if english else "तेल, उबटन, करीत, नए वस्त्र, खरीद, भोजन, लौ और पटाखे अनिवार्य नहीं; उपयुक्त हो तो सामान्य सुरक्षित स्नान करें।",
            "No skin, pregnancy, mobility, medication, or medical suitability advice is provided." if english else "त्वचा, गर्भावस्था, गतिशीलता, दवा या चिकित्सा-उपयुक्तता की सलाह नहीं दी जाती।",
            "The exact family prayer, mixture, blessing, and close remain with the household or responsible living authority." if english else "ठीक पारिवारिक प्रार्थना, मिश्रण, आशीर्वाद और समापन घर या उत्तरदायी जीवित परम्परा के अनुसार रहें।",
            "Kali Chaudas and Tamil Deepavali remain separate; no spiritual or material outcome is guaranteed." if english else "काली चौदस और तमिल दीपावली अलग रहें; किसी आध्यात्मिक या भौतिक फल की गारंटी नहीं है।",
        ]
        localized.append({
            "language_code": guide["language_code"],
            "title": guide["title"],
            "short_answer": guide["summary"],
            "significance": significance,
            "origin_narratives": narratives,
            "typical_practices": practices,
            "procedures": convert_procedures(
                guide,
                lane_id,
                {"minimum": "Short Maharashtra household form", "standard": "Maharashtra family-led household form", "elaborate": "Established elder- or family-text-led Maharashtra form"},
                ["drik-abhyang-snan-mumbai-2026", "dd-news-on-air-naraka-current-account", "devam-naraka-household-safety-boundary"],
                ["maharashtra-tourism-diwali-narak", "devam-naraka-household-safety-boundary"],
                {"maharashtra-gazetteers-naraka-context": "dd-news-on-air-naraka-current-account"},
            ),
            "variants": variants,
            "safety_and_boundaries": boundaries,
        })
    return {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1",
        "lane_id": lane_id,
        "supersedes_legacy_pack_ids": [legacy["pack_id"]],
        "observance_slugs": [legacy["observance_slug"]],
        "applicability": {
            "region_codes": ["west-india"],
            "tradition_codes": ["smarta-west-india"],
            "context_pairs": [{"region_code": "west-india", "tradition_code": "smarta-west-india"}],
            "settings": ["household", "individual", "family_led"],
            "family_practice_overrides_generic_guidance": True,
            "material_context_questions": legacy["guides"][0]["context_prompts"],
        },
        "calendar": {
            "resolution_source_ids": ["devam-naraka-date-fixture", "drik-abhyang-snan-mumbai-2026"],
            "timing_kind": "mixed",
            "location_aware": True,
            "tradition_aware": True,
            "decision_rule_id": "devam-current-practitioner-maharashtra-naraka-moonrise-to-sunrise-v1",
            "live_schedule_required": False,
            "freshness_note": "The bounded Mumbai 2026 lane resolves Sunday, 8 November. Today recalculates the local moonrise-to-sunrise decision; a family bath sequence remains family-specific.",
        },
        "sources": sources,
        "localized_content": localized,
        "product_status": status(),
    }


def tamil_deepavali() -> dict[str, Any]:
    legacy = load("tamil-deepavali-household-v1.json")
    lane_id = "tamil-deepavali-household-content-v1"
    sources = [
        source("devam-tamil-deepavali-date-fixture", "Devam Tamil Deepavali Chennai 2026 date evidence fixture", "Devam", "Deterministic Chennai Brahma-Muhurta/Chaturdashi decision; not a copied provider muhurta or ritual authority", "derivative_allowed", artifact_sha256="97319c8fc4f1e6bb157c7540f6bcfc3379c0bccabdabb22b57493e085feac7de", citation_coordinates={"path": "knowledge_packs/panchang/tamil-deepavali-chennai-2026-v1.json"}),
        source("dd-news-tamil-nadu-deepavali-2025", "Parikrama: Deepavali in Tamil Nadu", "Akashvani / News on AIR", "Official public-broadcaster regional Krishna-Narakasura story, early oil bath, elder blessing, food, and clothing context; not universal ritual authority", "citation_only", url="https://www.newsonair.gov.in/bulletins-detail/parikrama-524/", observed_fetch=DD_TAMIL_FETCH),
        source("ministry-tourism-deepa-oli-tiruvannamalai", "Deepa Oli - Arulmigu Arunachaleswarar Temple, Tiruvannamalai", "Utsav, Ministry of Tourism, Government of India", "Official Tamil Nadu regional story and morning oil-bath/practice corroboration; temple programmes are not copied into the household guide", "citation_only", url="https://www.utsav.gov.in/public/view-event/deepa-oli-arulmigu-arunchalaeswarar-temple-tiruvannamalai-1", observed_fetch=UTSAV_TAMIL_FETCH),
        source("devam-bath-and-flame-safety-boundary", "Devam household bath, food, and flame-safety boundary", "Devam", "Editorial safety and scope boundary; not scripture, medicine, or ritual authority", "internal_only"),
    ]
    localized = []
    for guide in legacy["guides"]:
        english = guide["language_code"] == "en"
        localized.append({
            "language_code": guide["language_code"],
            "title": guide["title"],
            "short_answer": guide["summary"],
            "significance": {
                "text": "In this bounded Tamil household lane, Deepavali marks Krishna's victory over Narakasura and begins with a family-led pre-sunrise bath, blessings, and celebration." if english else "इस सीमित तमिल गृह-परम्परा में दीपावली श्रीकृष्ण की नरकासुर-विजय का स्मरण करती है और परिवार-निर्देशित सूर्योदय-पूर्व स्नान, आशीर्वाद तथा उत्सव से आरम्भ होती है।",
                "source_ids": ["dd-news-tamil-nadu-deepavali-2025", "ministry-tourism-deepa-oli-tiruvannamalai"],
                "scope_note": "This is a Tamil/South India household lane, not one procedure for every Tamil, South Indian, or Smarta family." if english else "यह तमिल/दक्षिण भारतीय गृह-धारा है, हर तमिल, दक्षिण भारतीय या स्मार्त परिवार की एक ही विधि नहीं।",
            },
            "origin_narratives": [
                {
                    "narrative_id": "tamil-krishna-narakasura-current-account",
                    "title": "Krishna's victory over Narakasura" if english else "श्रीकृष्ण की नरकासुर पर विजय",
                    "summary": "Akashvani's Tamil Nadu account centres Krishna's victory over Narakasura and the joy and relief that followed. Devam labels this as a current regional festival retelling, not verified history or the only origin." if english else "आकाशवाणी का तमिलनाडु-वर्णन श्रीकृष्ण की नरकासुर पर विजय और उसके बाद के हर्ष तथा राहत को केन्द्र में रखता है। देवम् इसे वर्तमान क्षेत्रीय पर्व-कथा मानता है, सत्यापित इतिहास या एकमात्र उत्पत्ति नहीं।",
                    "tradition_scope": "Current Akashvani Tamil Nadu account" if english else "आकाशवाणी का वर्तमान तमिलनाडु-वर्णन",
                    "source_ids": ["dd-news-tamil-nadu-deepavali-2025"],
                    "universal_origin_claimed": False,
                },
                {
                    "narrative_id": "tiruvannamalai-krishna-satyabhama-kali-account",
                    "title": "The Tiruvannamalai Deepa Oli account" if english else "तिरुवन्नामलै दीप ओलि-वर्णन",
                    "summary": "The Ministry of Tourism page names Krishna, Satyabhama, and Kali in Narakasura's defeat. Devam preserves that attribution difference instead of silently replacing it with the Krishna-only account." if english else "पर्यटन मंत्रालय का पृष्ठ नरकासुर-वध में श्रीकृष्ण, सत्यभामा और काली का नाम लेता है। देवम् इस भिन्न श्रेय को कृष्ण-केन्द्रित कथा से चुपचाप बदलता नहीं।",
                    "tradition_scope": "Current Tiruvannamalai official-tourism account" if english else "वर्तमान तिरुवन्नामलै आधिकारिक पर्यटन-वर्णन",
                    "source_ids": ["ministry-tourism-deepa-oli-tiruvannamalai"],
                    "universal_origin_claimed": False,
                },
            ],
            "typical_practices": [{
                "practice_id": "tamil-deepavali-pre-sunrise-family-morning",
                "population_scope": "Tamil Nadu households represented by the two current official accounts" if english else "दो वर्तमान आधिकारिक वर्णनों में दर्शाए तमिलनाडु परिवार",
                "description": "Families commonly keep an early oil bath, elder blessings, clean or festive clothes, food, and prayer or Narakasura remembrance; exact oil, foods, words, and temple participation vary by family." if english else "परिवार प्रायः प्रातः तेल-स्नान, बुज़ुर्गों का आशीर्वाद, स्वच्छ या उत्सवी वस्त्र, भोजन और प्रार्थना या नरकासुर-स्मरण रखते हैं; ठीक तेल, भोजन, शब्द और मंदिर-सहभागिता परिवार के अनुसार बदलते हैं।",
                "source_ids": ["dd-news-tamil-nadu-deepavali-2025", "ministry-tourism-deepa-oli-tiruvannamalai"],
                "instructional": False,
            }],
            "procedures": convert_procedures(
                guide,
                lane_id,
                {"minimum": "Short Tamil household form", "standard": "Tamil family-led household morning", "elaborate": "Established elder- or family-text-led Tamil form"},
                ["dd-news-tamil-nadu-deepavali-2025", "ministry-tourism-deepa-oli-tiruvannamalai", "devam-bath-and-flame-safety-boundary"],
                ["dd-news-tamil-nadu-deepavali-2025", "devam-bath-and-flame-safety-boundary"],
            ),
            "variants": [
                {"variant_id": "oil-blessing-and-food-family-variation", "scope": "Tamil household morning" if english else "तमिल पारिवारिक प्रातः-रीति", "difference": "Oil type, elder blessing, clothing, foods, prayer, and temple visit vary; an ordinary safe bath is the supported fallback." if english else "तेल का प्रकार, बुज़ुर्ग का आशीर्वाद, वस्त्र, भोजन, प्रार्थना और मंदिर-दर्शन बदलते हैं; सामान्य सुरक्षित स्नान समर्थित विकल्प है।", "source_ids": ["dd-news-tamil-nadu-deepavali-2025", "ministry-tourism-deepa-oli-tiruvannamalai", "devam-bath-and-flame-safety-boundary"], "separate_lane_required": False},
                {"variant_id": "narakasura-attribution-difference", "scope": "Source-labelled story attribution" if english else "स्रोत-सम्बद्ध कथा-श्रेय", "difference": "Akashvani centres Krishna; the Tiruvannamalai page names Krishna, Satyabhama, and Kali. Both remain attributable variants." if english else "आकाशवाणी श्रीकृष्ण को केन्द्र में रखता है; तिरुवन्नामलै-पृष्ठ श्रीकृष्ण, सत्यभामा और काली का नाम लेता है। दोनों स्रोत-सम्बद्ध रूप में सुरक्षित हैं।", "source_ids": ["dd-news-tamil-nadu-deepavali-2025", "ministry-tourism-deepa-oli-tiruvannamalai"], "separate_lane_required": False},
                {"variant_id": "north-west-lakshmi-puja-separate", "scope": "Different regional Diwali lane" if english else "भिन्न क्षेत्रीय दीपावली-धारा", "difference": "The North/West Lakshmi Puja evening and Maharashtra Naraka Chaturdashi are separate routes and are not completed here." if english else "उत्तर/पश्चिम की लक्ष्मी-पूजा संध्या और महाराष्ट्र नरक चतुर्दशी अलग मार्ग हैं और यहाँ पूर्ण नहीं होते।", "source_ids": ["devam-tamil-deepavali-date-fixture"], "separate_lane_required": True},
            ],
            "safety_and_boundaries": [
                "Oil is optional and suitability-dependent; an ordinary safe bath is always acceptable." if english else "तेल वैकल्पिक और उपयुक्तता-निर्भर है; सामान्य सुरक्षित स्नान सदैव स्वीकार्य है।",
                "No medical, dermatological, hot-water, herbal, food, or fasting prescription is given." if english else "कोई चिकित्सा, त्वचा, गर्म पानी, जड़ी-बूटी, भोजन या व्रत-निर्देश नहीं दिया जाता।",
                "Fireworks, purchases, and new clothes are not devotional requirements." if english else "पटाखे, खरीद और नए वस्त्र धार्मिक अनिवार्यता नहीं हैं।",
                "Temple programmes and North/West Lakshmi Puja remain separate; no outcome is guaranteed." if english else "मंदिर-कार्यक्रम और उत्तर/पश्चिम लक्ष्मी-पूजा अलग रहें; किसी फल की गारंटी नहीं है।",
            ],
        })
    return {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1",
        "lane_id": lane_id,
        "supersedes_legacy_pack_ids": [legacy["pack_id"]],
        "observance_slugs": [legacy["observance_slug"]],
        "applicability": {"region_codes": ["south-india"], "tradition_codes": ["smarta-south-india"], "context_pairs": [{"region_code": "south-india", "tradition_code": "smarta-south-india"}], "settings": ["household", "individual", "family_led"], "family_practice_overrides_generic_guidance": True, "material_context_questions": legacy["guides"][0]["context_prompts"]},
        "calendar": {"resolution_source_ids": ["devam-tamil-deepavali-date-fixture", "dd-news-tamil-nadu-deepavali-2025"], "timing_kind": "mixed", "location_aware": True, "tradition_aware": True, "decision_rule_id": "devam-current-practitioner-tamil-deepavali-unique-brahma-muhurta-chaturdashi-overlap-v1", "live_schedule_required": False, "freshness_note": "The bounded Chennai 2026 lane resolves Sunday, 8 November. Today recalculates the local pre-sunrise decision; family oil, blessing, prayer, food, and temple details remain family-specific."},
        "sources": sources,
        "localized_content": localized,
        "product_status": status(),
    }


def kali_chaudash_baps() -> dict[str, Any]:
    legacy = load("kali-chaudas-baps-gujarat-v1.json")
    lane_id = "kali-chaudas-baps-gujarat-content-v1"
    sources = [
        source("devam-kali-chaudas-baps-date-fixture", "Devam Kali Chaudash Ahmedabad BAPS 2026 date evidence fixture", "Devam", "Deterministic Ahmedabad BAPS date/Nishita decision; not a copied provider interval or ritual authority", "derivative_allowed", artifact_sha256="31e02af522ad6de07346e27330c6a6709b3f20eb93f12f14885ac6b53c4ba769", citation_coordinates={"path": "knowledge_packs/panchang/kali-chaudas-ahmedabad-baps-2026-v1.json"}),
        source("baps-festival-list-2026-kali-chaudash", "BAPS Festival List 2026: Kali Chaudash", "BAPS Swaminarayan Sanstha", "Official sampradaya identity, date, and protection-prayer meaning; belief language is not a guaranteed outcome", "citation_only", url="https://www.baps.org/Calendar/2026/FestivalList.aspx", observed_fetch=BAPS_FESTIVAL_FETCH),
        source("baps-nirnay-2026-kali-chaudash", "BAPS Nirnay 2026: Kali Chaudash and Hanuman Puja", "BAPS Swaminarayan Sanstha", "Official sampradaya date, Hanuman Puja identity, and institutional intervals; not a complete home liturgy", "citation_only", url="https://www.baps.org/Calendar/2026/Nirnay.aspx", observed_fetch=BAPS_NIRNAY_FETCH),
        source("baps-chaturmaas-kali-chaudasha-story", "Chaturmaas Part III: Kaali Chaudasha", "BAPS Swaminarayan Sanstha", "BAPS-authored festival narrative and Hanuman-worship context; not an exact Bhagavata passage or universal history", "citation_only", url="https://www.baps.org/Article/2011/Chaturmaas-Part-III-2207.aspx", observed_fetch=BAPS_STORY_FETCH),
        source("drik-gujarati-calendar-ahmedabad-2026", "2026 Gujarati Calendar for Ahmedabad", "Drik Panchang", "Current Ahmedabad corroboration separating 7 November Kali Chaudas/Hanuman Puja from 8 November Roop Chaudas/Naraka Chaturdashi", "citation_only", url="https://www.drikpanchang.com/gujarati/calendar/gujarati-calendar.html?geoname-id=1279233&year=2026", observed_fetch=DRIK_GUJARATI_FETCH),
        source("devam-kali-chaudas-safety-boundary", "Devam Kali Chaudas household safety and non-occult boundary", "Devam", "Editorial safety and scope boundary; not scripture, medicine, occult instruction, or ritual authority", "internal_only"),
    ]
    localized = []
    for guide in legacy["guides"]:
        english = guide["language_code"] == "en"
        localized.append({
            "language_code": guide["language_code"],
            "title": guide["title"],
            "short_answer": guide["summary"],
            "significance": {"text": "In this exact BAPS Gujarat lane, Kali Chaudash is a day of Hanuman remembrance, prayer, courage, devotion, and turning away from harmful influence or conduct." if english else "इस ठीक BAPS गुजरात-धारा में काली चौदश हनुमान-स्मरण, प्रार्थना, साहस, भक्ति और हानिकारक प्रभाव या आचरण से मुड़ने का दिन है।", "source_ids": ["baps-festival-list-2026-kali-chaudash", "baps-nirnay-2026-kali-chaudash", "baps-chaturmaas-kali-chaudasha-story"], "scope_note": "BAPS protection language is preserved as belief and prayer, never as a supernatural guarantee or permission for self-directed occult practice." if english else "BAPS का सुरक्षा-संबन्धी कथन आस्था और प्रार्थना के रूप में सुरक्षित है, अलौकिक गारंटी या स्वयं-निर्देशित तांत्रिक अभ्यास की अनुमति के रूप में नहीं।"},
            "origin_narratives": [{"narrative_id": "baps-krishna-naraka-account", "title": "The BAPS Krishna-Naraka account" if english else "BAPS का श्रीकृष्ण-नरकासुर वर्णन", "summary": "The BAPS-authored festival article recounts Krishna defeating Naraka, recovering Aditi's earrings, and freeing his captives, while naming Hanuman worship as the day's BAPS practice. It points to the Bhagavata but is preserved as a later BAPS retelling, not an exact scriptural quotation or the only origin." if english else "BAPS-लेख श्रीकृष्ण द्वारा नरक को पराजित करने, अदिति के कुण्डल लौटाने और बंदियों को मुक्त करने की कथा कहता है तथा हनुमान-पूजा को इस दिन की BAPS रीति बताता है। लेख भागवत की ओर संकेत करता है, पर इसे बाद का BAPS-वर्णन माना गया है, ठीक शास्त्रीय उद्धरण या एकमात्र उत्पत्ति नहीं।", "tradition_scope": "BAPS Swaminarayan published festival account" if english else "BAPS स्वामिनारायण का प्रकाशित पर्व-वर्णन", "source_ids": ["baps-chaturmaas-kali-chaudasha-story"], "universal_origin_claimed": False}],
            "typical_practices": [{"practice_id": "baps-kali-chaudash-hanuman-puja-participation", "population_scope": "BAPS families and mandirs represented by official BAPS sources" if english else "आधिकारिक BAPS स्रोतों में दर्शाए BAPS परिवार और मंदिर", "description": "BAPS sources identify Kali Chaudash with Hanuman Puja and prayer. Formal worship remains led by the established family or mandir; this app lane documents safe participation, remembrance, reflection, and seva rather than inventing liturgy." if english else "BAPS स्रोत काली चौदश को हनुमान-पूजा और प्रार्थना से जोड़ते हैं। औपचारिक पूजा स्थापित परिवार या मंदिर के नेतृत्व में रहती है; यह ऐप-धारा पूजा-विधान गढ़ने के बजाय सुरक्षित सहभागिता, स्मरण, चिंतन और सेवा बताती है।", "source_ids": ["baps-festival-list-2026-kali-chaudash", "baps-nirnay-2026-kali-chaudash", "baps-chaturmaas-kali-chaudasha-story"], "instructional": False}],
            "procedures": convert_procedures(guide, lane_id, {"minimum": "Short BAPS family remembrance", "standard": "BAPS family-led prayer and seva", "elaborate": "Established BAPS family- or mandir-led participation"}, ["baps-festival-list-2026-kali-chaudash", "baps-nirnay-2026-kali-chaudash", "baps-chaturmaas-kali-chaudasha-story", "devam-kali-chaudas-safety-boundary"], ["baps-nirnay-2026-kali-chaudash", "devam-kali-chaudas-safety-boundary"]),
            "variants": [
                {"variant_id": "formal-baps-hanuman-puja-authority", "scope": "Family or mandir authority" if english else "परिवार या मंदिर-प्रामाणिकता", "difference": "Official BAPS sources name Hanuman Puja, but the full liturgy, mantras, materials, and participant roles remain with the established family or BAPS mandir." if english else "आधिकारिक BAPS स्रोत हनुमान-पूजा का नाम लेते हैं, पर पूर्ण विधान, मंत्र, सामग्री और सहभागी भूमिकाएँ स्थापित परिवार या BAPS मंदिर के पास रहती हैं।", "source_ids": ["baps-nirnay-2026-kali-chaudash"], "separate_lane_required": False},
                {"variant_id": "roop-naraka-chaturdashi-separate-next-day", "scope": "Ahmedabad adjacent calendar lane" if english else "अहमदाबाद की निकटवर्ती पंचांग-धारा", "difference": "The current Ahmedabad calendar places Kali Chaudas and Hanuman Puja on 7 November but Roop Chaudas/Naraka Chaturdashi on 8 November; this lane does not merge them." if english else "वर्तमान अहमदाबाद पंचांग काली चौदस और हनुमान-पूजा 7 नवम्बर को, पर रूप चौदस/नरक चतुर्दशी 8 नवम्बर को रखता है; यह धारा उन्हें नहीं मिलाती।", "source_ids": ["drik-gujarati-calendar-ahmedabad-2026"], "separate_lane_required": True},
                {"variant_id": "non-baps-gujarati-kali-chaudas-separate", "scope": "Other Gujarati traditions" if english else "अन्य गुजराती परम्पराएँ", "difference": "Non-BAPS Gujarati household, temple, folk, and regional Kali Chaudas traditions require their own evidence and are not completed by this sampradaya lane." if english else "गैर-BAPS गुजराती गृह, मंदिर, लोक और क्षेत्रीय काली चौदस परम्पराओं को अपना प्रमाण चाहिए; यह सम्प्रदाय-धारा उन्हें पूर्ण नहीं करती।", "source_ids": ["baps-festival-list-2026-kali-chaudash"], "separate_lane_required": True},
            ],
            "safety_and_boundaries": [
                "Use only a prayer, reading, Hanuman remembrance, or seva already known in the family or BAPS mandir; the app does not generate formal Hanuman Puja or mantras." if english else "केवल परिवार या BAPS मंदिर में परिचित प्रार्थना, पाठ, हनुमान-स्मरण या सेवा लें; ऐप औपचारिक हनुमान-पूजा या मंत्र नहीं बनाता।",
                "No tantric, occult, exorcistic, chilli-lemon, smoke, harm, animal, fear, or coercive practice is supplied." if english else "कोई तांत्रिक, गुप्त, झाड़-फूँक, मिर्च-नींबू, धुआँ, हानि, पशु, भय या बाध्यकारी अभ्यास नहीं दिया जाता।",
                "No fast, fixed offering, purchase, firework, real flame, or protection guarantee is required." if english else "कोई व्रत, निश्चित अर्पण, खरीद, पटाखा, वास्तविक लौ या सुरक्षा-गारंटी अनिवार्य नहीं।",
                "Maharashtra Naraka Chaturdashi, Tamil Deepavali, Bengal Kali Puja, and non-BAPS Gujarati traditions remain separate." if english else "महाराष्ट्र नरक चतुर्दशी, तमिल दीपावली, बंगाल काली पूजा और गैर-BAPS गुजराती परम्पराएँ अलग रहें।",
            ],
        })
    return {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1",
        "lane_id": lane_id,
        "supersedes_legacy_pack_ids": [legacy["pack_id"]],
        "observance_slugs": [legacy["observance_slug"]],
        "applicability": {"region_codes": ["baps-gujarat"], "tradition_codes": ["swaminarayan-baps"], "institution_codes": ["baps"], "context_pairs": [{"region_code": "baps-gujarat", "tradition_code": "swaminarayan-baps"}], "settings": ["household", "individual", "family_led", "temple"], "family_practice_overrides_generic_guidance": True, "material_context_questions": legacy["guides"][0]["context_prompts"]},
        "calendar": {"resolution_source_ids": ["devam-kali-chaudas-baps-date-fixture", "baps-festival-list-2026-kali-chaudash", "baps-nirnay-2026-kali-chaudash", "drik-gujarati-calendar-ahmedabad-2026"], "timing_kind": "mixed", "location_aware": True, "tradition_aware": True, "decision_rule_id": "devam-baps-kali-chaudash-unique-full-nishita-chaturdashi-v1", "live_schedule_required": True, "freshness_note": "The bounded Ahmedabad BAPS 2026 lane resolves Saturday, 7 November. Recheck the user's BAPS mandir for a live programme; the app does not reproduce the published institutional intervals or formal Hanuman Puja."},
        "sources": sources,
        "localized_content": localized,
        "product_status": status(),
    }


def main() -> int:
    outputs = {
        "naraka-chaturdashi-maharashtra-content-v1.json": naraka_chaturdashi(),
        "tamil-deepavali-household-content-v1.json": tamil_deepavali(),
        "kali-chaudas-baps-gujarat-content-v1.json": kali_chaudash_baps(),
    }
    reports = []
    for filename, value in outputs.items():
        payload = (json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n").encode("utf-8")
        path = PACK_DIR / filename
        path.write_bytes(payload)
        reports.append({"path": path.relative_to(ROOT).as_posix(), "bytes": len(payload), "sha256": hashlib.sha256(payload).hexdigest()})
    print(json.dumps(reports, ensure_ascii=False, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

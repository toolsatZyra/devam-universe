#!/usr/bin/env python3
"""Build three distinct, current-contract early-Diwali ritual lanes."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
PACK_DIR = ROOT / "knowledge_packs" / "rituals"
DIMENSIONS = (
    "applicability",
    "timing",
    "significance",
    "origin_narratives",
    "typical_practice",
    "actionable_vidhi",
    "materials_and_substitutions",
    "variants",
    "evidence",
)
MH_FETCH = {
    "status": 200,
    "final_url": "https://maharashtratourism.gov.in/festivals/diwali/",
    "response_bytes": 627474,
    "response_sha256": "0628c7135a7c1177aa92392fd416476aa98ce8aa47d41c4cd0db766bb74e9d92",
    "strict_utf8": True,
    "observed_at": "2026-08-07",
}


def load(name: str) -> dict[str, Any]:
    return json.loads((PACK_DIR / name).read_text(encoding="utf-8"))


def source(
    source_id: str,
    title: str,
    publisher: str,
    role: str,
    rights: str,
    *,
    url: str | None = None,
    artifact_sha256: str | None = None,
    citation_coordinates: dict[str, Any] | None = None,
    observed_fetch: dict[str, Any] | None = None,
) -> dict[str, Any]:
    return {
        "source_id": source_id,
        "title": title,
        "publisher": publisher,
        "source_role": role,
        "rights_lane": rights,
        "url": url,
        "artifact_sha256": artifact_sha256,
        "citation_coordinates": citation_coordinates,
        "observed_fetch": observed_fetch,
    }


def convert_procedures(
    guide: dict[str, Any],
    lane_id: str,
    authority: dict[str, str],
    material_sources: list[str],
    closing_sources: list[str],
    source_map: dict[str, str] | None = None,
) -> list[dict[str, Any]]:
    source_map = source_map or {}
    forms = {
        "minimum": "accessible_short",
        "standard": "traditional_household",
        "elaborate": "fuller_family_or_teacher_led",
    }
    settings = {"minimum": "individual", "standard": "household", "elaborate": "family_led"}
    language = guide["language_code"]
    closing_text = (
        "Close the familiar family form safely, clear the space, and leave every flame extinguished or continuously supervised."
        if language == "en"
        else "परिवार का परिचित रूप सुरक्षित ढंग से पूरा करें, स्थान समेटें और हर लौ बुझा दें या निरन्तर देखरेख में रखें।"
    )
    procedures: list[dict[str, Any]] = []
    for tier in guide["tiers"]:
        step_sources = [
            source_map.get(source_id, source_id)
            for step in tier["steps"]
            for source_id in step["source_ids"]
        ]
        procedure_sources = list(dict.fromkeys(step_sources + material_sources + closing_sources))
        procedures.append(
            {
                "procedure_id": f"{lane_id}-{language}-{tier['tier']}-v1",
                "label": tier["label"],
                "tier": tier["tier"],
                "setting": settings[tier["tier"]],
                "authority_scope": authority[tier["tier"]],
                "form": forms[tier["tier"]],
                "estimated_minutes": tier["estimated_minutes"],
                "materials": [
                    {
                        "item": item["item"],
                        "required": not item["optional"],
                        "substitutions": item["substitutions"],
                        "source_ids": material_sources,
                    }
                    for item in tier["materials"]
                ],
                "steps": [
                    {
                        "ordinal": step["ordinal"],
                        "instruction": step["instruction"],
                        "why": step["why"],
                        "source_ids": list(
                            dict.fromkeys(source_map.get(value, value) for value in step["source_ids"])
                        ),
                        "optional": step["optional"],
                    }
                    for step in tier["steps"]
                ],
                "closing": {
                    "text": closing_text,
                    "source_ids": closing_sources,
                    "scope_note": (
                        "The family or responsible living authority controls the exact close."
                        if language == "en"
                        else "समापन का ठीक रूप परिवार या उत्तरदायी जीवित परम्परा के अनुसार होगा।"
                    ),
                },
                "source_ids": procedure_sources,
            }
        )
    return procedures


def status() -> dict[str, Any]:
    return {
        "classification": "user_complete_lane",
        "completed_dimensions": {dimension: True for dimension in DIMENSIONS},
        "open_gaps": [],
        "review_status": "internal_beta_reviewed",
    }


def vasu_baras() -> dict[str, Any]:
    legacy = load("vasu-baras-maharashtra-family-v1.json")
    lane_id = "vasu-baras-maharashtra-family-content-v1"
    sources = [
        source(
            "devam-vasu-baras-date-fixture",
            "Devam Vasu Baras Mumbai 2026 date evidence fixture",
            "Devam",
            "Deterministic Mumbai 2026 date selection; not ritual authority",
            "derivative_allowed",
            artifact_sha256="901142c4c16503ac46125420b8788fa7585600d60a9c1ec07a18c6e3a15d9ea6",
            citation_coordinates={"path": "knowledge_packs/panchang/vasu-baras-mumbai-2026-v1.json"},
        ),
        source(
            "maharashtra-tourism-diwali-vasubaras",
            "Diwali — pre-celebrations start from Vasubaras",
            "Department of Tourism, Government of Maharashtra",
            "Current official Maharashtra sequence and regional-diversity context; not a complete ritual manual",
            "citation_only",
            url="https://maharashtratourism.gov.in/festivals/diwali/",
            observed_fetch=MH_FETCH,
        ),
        source(
            "drikpanchang-govatsa-dwadashi-katha",
            "Govatsa Dwadashi Vrat Katha",
            "Drik Panchang",
            "Current practitioner-retold Govatsa narrative; source-labelled story evidence only, not universal history or household authority",
            "citation_only",
            url="https://www.drikpanchang.com/vrat-katha/dwadashi/govatsa/govatsa-dwadashi-vrat-katha.html?lang=en",
            observed_fetch={
                "status": 200,
                "final_url": "https://www.drikpanchang.com/vrat-katha/dwadashi/govatsa/govatsa-dwadashi-vrat-katha.html?lang=en",
                "response_bytes": 94770,
                "response_sha256": "b365d1a72cd7029c2a490bd33526ca50c22c9cfaeef529a085d1f5fb22f6d4da",
                "strict_utf8": True,
                "observed_at": "2026-08-07",
            },
        ),
        source(
            "devam-vasu-baras-animal-welfare-and-scope-boundary",
            "Devam Vasu Baras animal-welfare and scope boundary",
            "Devam",
            "Editorial safety and authority boundary; not scripture, history, or ritual authority",
            "internal_only",
        ),
    ]
    localized = []
    for guide in legacy["guides"]:
        hi = guide["language_code"] == "hi"
        authority = {
            "minimum": "महाराष्ट्र परिवार का बिना पशु-सम्पर्क वाला संक्षिप्त स्मरण" if hi else "Short no-contact remembrance for a Maharashtra family",
            "standard": "परिवार द्वारा परिचित वसुबारस स्मरण; पशु-संभाल का निर्देश नहीं" if hi else "Family-led familiar Vasu Baras remembrance; not animal-handling instruction",
            "elaborate": "केवल पशु-मालिक या प्रशिक्षित देखभालकर्ता के नेतृत्व में स्थापित आयोजन" if hi else "Established event led by the animal owner or trained keeper only",
        }
        if hi:
            significance = {"text": "महाराष्ट्र की इस सीमित पारिवारिक धारा में वसुबारस दीपावली-पूर्व आरम्भ है और गाय-बछड़े, पोषण, कृषि-जीवन तथा उत्तरदायी देखभाल के प्रति कृतज्ञता का अवसर है। जीवित पशु से सम्पर्क इसकी अनिवार्यता नहीं है।", "source_ids": ["maharashtra-tourism-diwali-vasubaras", "drikpanchang-govatsa-dwadashi-katha"], "scope_note": "यह महाराष्ट्र की एक गृह-धारा है; सभी गोवत्स, वाघ बारस या क्षेत्रीय परम्पराओं का सार्वभौम विधान नहीं।"}
            narratives = [{"narrative_id": "govatsa-dwadashi-nandini-account", "title": "नन्दिनी और सवत्सा गौ का गोवत्स-द्वादशी आख्यान", "summary": "ड्रिक पंचांग की वर्तमान व्रत-कथा कृष्ण और युधिष्ठिर के संवाद के रूप में सवत्सा गौ तथा नन्दिनी-पूजन का विस्तृत आख्यान देती है। Devam इसे एक स्रोत-चिह्नित प्रचलित कथा के रूप में रखता है, इतिहास या प्रत्येक महाराष्ट्र परिवार की अनिवार्य मान्यता के रूप में नहीं।", "tradition_scope": "वर्तमान व्रत-कथा पुनर्कथन", "source_ids": ["drikpanchang-govatsa-dwadashi-katha"], "universal_origin_claimed": False}]
            practices = [{"practice_id": "maharashtra-vasubaras-family-remembrance", "population_scope": "वसुबारस मानने वाले महाराष्ट्र परिवार", "description": "परिवार गाय-बछड़े और उनसे जुड़े पोषण तथा कृषि-जीवन को स्मरण कर सकते हैं; शहर या बिना पशु वाले घर में चित्र, मौन या कृतज्ञता पर्याप्त है। जीवित पशु के पास कोई भी गतिविधि उसके मालिक या प्रशिक्षित देखभालकर्ता के अधिकार में रहती है।", "source_ids": ["maharashtra-tourism-diwali-vasubaras", "devam-vasu-baras-animal-welfare-and-scope-boundary"], "instructional": False}]
            variants = [
                {"variant_id": "home-or-keeper-led-setting", "scope": "स्थान और पशु-सम्पर्क", "difference": "घर का बिना सम्पर्क स्मरण और परिचित खेत/गोशाला का देखभालकर्ता-नेतृत्व वाला आयोजन अलग भूमिकाएँ हैं।", "source_ids": ["devam-vasu-baras-animal-welfare-and-scope-boundary"], "separate_lane_required": False},
                {"variant_id": "other-cattle-dwadashi-traditions", "scope": "क्षेत्रीय पहचान", "difference": "गुजरात की वाघ बारस, बछ बारस, गुरु द्वादशी, नन्दिनी-व्रत और अन्य रूप इस महाराष्ट्र धारा में पूर्ण नहीं माने गए हैं।", "source_ids": ["maharashtra-tourism-diwali-vasubaras", "drikpanchang-govatsa-dwadashi-katha"], "separate_lane_required": True},
            ]
            boundaries = ["जीवित पशु को ऐप के निर्देश से न छुएँ, खिलाएँ, धोएँ, बाँधें, सजाएँ या उसके पास लौ न ले जाएँ।", "उपवास, विशेष आहार, खरीद, दान या फल-गारंटी आवश्यक नहीं है।", "परिवार की परम्परा और पशु के जिम्मेदार देखभालकर्ता का निर्णय सामान्य मार्गदर्शन से ऊपर है।"]
        else:
            significance = {"text": "In this bounded Maharashtra family lane, Vasu Baras opens the pre-Diwali sequence and offers a moment of gratitude for cows and calves, nourishment, agrarian life, and responsible care. Contact with a live animal is not required.", "source_ids": ["maharashtra-tourism-diwali-vasubaras", "drikpanchang-govatsa-dwadashi-katha"], "scope_note": "This is one Maharashtra household lane, not a universal rule for every Govatsa, Wagh Baras, or regional cattle tradition."}
            narratives = [{"narrative_id": "govatsa-dwadashi-nandini-account", "title": "The Govatsa Dwadashi account of Nandini and the cow with her calf", "summary": "The current Drik Panchang vrat-katha presents an extended Krishna–Yudhishthira account involving a cow with her calf and the worship of Nandini. Devam keeps it as one source-labelled circulating narrative, not verified history or a belief mandatory for every Maharashtra family.", "tradition_scope": "Current practitioner vrat-katha retelling", "source_ids": ["drikpanchang-govatsa-dwadashi-katha"], "universal_origin_claimed": False}]
            practices = [{"practice_id": "maharashtra-vasubaras-family-remembrance", "population_scope": "Maharashtra families that keep Vasu Baras", "description": "Families may remember cows, calves, nourishment, and agrarian life; an urban or animal-free home can use an image, silence, or gratitude. Any live-animal activity remains under the animal owner's or trained keeper's authority.", "source_ids": ["maharashtra-tourism-diwali-vasubaras", "devam-vasu-baras-animal-welfare-and-scope-boundary"], "instructional": False}]
            variants = [
                {"variant_id": "home-or-keeper-led-setting", "scope": "Setting and animal contact", "difference": "A no-contact household remembrance and a keeper-led event at a known farm or gaushala are different participation roles.", "source_ids": ["devam-vasu-baras-animal-welfare-and-scope-boundary"], "separate_lane_required": False},
                {"variant_id": "other-cattle-dwadashi-traditions", "scope": "Regional identity", "difference": "Gujarat Wagh Baras, Bachha Baras, Guru Dwadashi, Nandini Vrat, and other forms are not completed by this Maharashtra lane.", "source_ids": ["maharashtra-tourism-diwali-vasubaras", "drikpanchang-govatsa-dwadashi-katha"], "separate_lane_required": True},
            ]
            boundaries = ["Do not use app guidance to touch, feed, wash, restrain, decorate, or bring flame near a live animal.", "No fast, special diet, purchase, donation, or promised outcome is required.", "Family practice and the responsible animal keeper override generic guidance."]
        localized.append({
            "language_code": guide["language_code"], "title": guide["title"], "short_answer": guide["summary"],
            "significance": significance, "origin_narratives": narratives, "typical_practices": practices,
            "procedures": convert_procedures(guide, lane_id, authority, ["drikpanchang-govatsa-dwadashi-katha", "devam-vasu-baras-animal-welfare-and-scope-boundary"], ["devam-vasu-baras-animal-welfare-and-scope-boundary"], {"ansi-rural-livestock-markets-vasubaras": "devam-vasu-baras-animal-welfare-and-scope-boundary"}),
            "variants": variants, "safety_and_boundaries": boundaries,
        })
    return {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1", "lane_id": lane_id,
        "supersedes_legacy_pack_ids": [legacy["pack_id"]], "observance_slugs": [legacy["observance_slug"]],
        "applicability": {"region_codes": ["west-india"], "tradition_codes": ["smarta-west-india"], "context_pairs": [{"region_code": "west-india", "tradition_code": "smarta-west-india"}], "settings": ["household", "individual", "family_led", "community"], "family_practice_overrides_generic_guidance": True, "material_context_questions": legacy["guides"][0]["context_prompts"]},
        "calendar": {"resolution_source_ids": ["devam-vasu-baras-date-fixture"], "timing_kind": "mixed", "location_aware": True, "tradition_aware": True, "decision_rule_id": "devam-kartika-krishna-dwadashi-pradosha-mumbai-v1", "live_schedule_required": False, "freshness_note": "The bounded Mumbai/Maharashtra 2026 lane resolves Thursday, 5 November. Other Govatsa Dwadashi and regional cattle observances remain separate."},
        "sources": sources, "localized_content": localized, "product_status": status(),
    }


def dhantrayodashi() -> dict[str, Any]:
    legacy = load("dhantrayodashi-north-west-india-v1.json")
    lane_id = "dhantrayodashi-north-west-india-content-v1"
    sources = [
        source("devam-dhantrayodashi-date-fixture", "Devam Dhantrayodashi New Delhi 2026 date evidence fixture", "Devam", "Deterministic New Delhi 2026 date selection; not a complete puja muhurta or ritual authority", "derivative_allowed", artifact_sha256="c88547ab6e858c28ed6b60f209ff26ca1194d1e6820e3c5c6fce958b72d7347a", citation_coordinates={"path": "knowledge_packs/panchang/dhantrayodashi-delhi-2026-v1.json"}),
        source("maharashtra-tourism-diwali-2026", "Diwali: the festival of light, joy, and togetherness", "Department of Tourism, Government of Maharashtra", "Official current Maharashtra sequence and regional context; not a complete ritual manual", "citation_only", url="https://maharashtratourism.gov.in/festivals/diwali/", observed_fetch=MH_FETCH),
        source("dd-news-on-air-dhanteras-identity-2026", "Dhanteras: auspicious day for worship and new purchases", "Akashvani / News on AIR", "Official public-broadcaster evidence for Dhantrayodashi, Dhanvantari-Jayanti, and current Dhanvantari, Kubera, and Lakshmi associations", "citation_only", url="https://newsonair.gov.in/dhanteras-auspicious-day-for-worship-and-new-purchases/", observed_fetch={"status": 200, "final_url": "https://newsonair.gov.in/dhanteras-auspicious-day-for-worship-and-new-purchases/", "response_bytes": 77901, "response_sha256": "59b9b2b48b98688967a78b9568cd24493f57bfc010caa4365180aa0ccde651e2", "strict_utf8": True, "observed_at": "2026-08-07"}),
        source("drikpanchang-dhanteras-practice", "Dhanteras Puja and Dhantrayodashi context", "Drik Panchang", "Current practitioner date, pradosha, and deity-association reference; not universal family authority", "citation_only", url="https://www.drikpanchang.com/festivals/dhanteras/festivals-dhanteras-puja-timings.html?geoname-id=1261481&year=2026", observed_fetch={"status": 200, "final_url": "https://www.drikpanchang.com/festivals/dhanteras/festivals-dhanteras-puja-timings.html?geoname-id=1261481&year=2026", "response_bytes": 81810, "response_sha256": "93b2fc7172ba3d5226e9b4b2e833e5339f51f3d5d6d73c3d5dd458304c5e5e41", "strict_utf8": True, "observed_at": "2026-08-07"}),
        source("drikpanchang-dhanteras-lakshmi-farmer-legend", "Dhanteras Story — Goddess Lakshmi and the Farmer", "Drik Panchang", "Current practitioner-retold Dhanteras legend; story evidence only, not universal history or ritual authority", "citation_only", url="https://www.drikpanchang.com/festivals/dhanteras/legends/dhanteras-legends.html", observed_fetch={"status": 200, "final_url": "https://www.drikpanchang.com/festivals/dhanteras/legends/dhanteras-legends.html", "response_bytes": 62931, "response_sha256": "316108d41d84bb5d6e9c4ab6b2cc32b8842e282c57715cd7c39f66d0a57ca57e", "strict_utf8": True, "observed_at": "2026-08-07"}),
        source("devam-dhantrayodashi-safety-boundary", "Devam Dhantrayodashi health, finance, purchase, and flame boundary", "Devam", "Editorial product-safety boundary; not scripture, medicine, finance, or ritual authority", "internal_only"),
    ]
    localized = []
    for guide in legacy["guides"]:
        hi = guide["language_code"] == "hi"
        authority = {"minimum": "उत्तर/पश्चिम भारतीय परिवार का संक्षिप्त गृह-स्मरण" if hi else "Short North/West India household remembrance", "standard": "परिवार-परिचित धनत्रयोदशी गृह-रूप" if hi else "Family-familiar Dhantrayodashi household form", "elaborate": "मान्य पारिवारिक ग्रन्थ या जानकार के नेतृत्व का विस्तृत रूप" if hi else "Expanded form led by a recognised family text or practitioner"}
        if hi:
            significance = {"text": "उत्तर और पश्चिम भारत की इस सीमित गृह-धारा में धनत्रयोदशी स्वास्थ्य, आजीविका, संसाधनों के नैतिक उपयोग और दीपावली की तैयारी के प्रति कृतज्ञता का अवसर है। वर्तमान स्रोत धन्वन्तरी, कुबेर और लक्ष्मी के अलग-अलग पारिवारिक केन्द्रों को सुरक्षित रखते हैं; खरीदारी भक्ति की अनिवार्यता नहीं है।", "source_ids": ["dd-news-on-air-dhanteras-identity-2026", "maharashtra-tourism-diwali-2026"], "scope_note": "यह चिकित्सा या वित्तीय सलाह नहीं और न ही पूरे भारत की एकमात्र धनतेरस-विधि है।"}
            narratives = [{"narrative_id": "dhanteras-lakshmi-farmer-legend", "title": "लक्ष्मी और किसान की धनतेरस-कथा", "summary": "ड्रिक पंचांग की वर्तमान कथा में लक्ष्मी किसान के घर आती हैं और कृष्ण त्रयोदशी पर घर स्वच्छ कर उनका स्वागत करने की परम्परा का आख्यान दिया गया है। Devam इसे एक प्रचलित, स्रोत-चिह्नित कथा के रूप में रखता है—इतिहास, सार्वभौम उत्पत्ति या खरीदारी के आदेश के रूप में नहीं।", "tradition_scope": "वर्तमान धनतेरस व्रत-कथा पुनर्कथन", "source_ids": ["drikpanchang-dhanteras-lakshmi-farmer-legend"], "universal_origin_claimed": False}, {"narrative_id": "dhanvantari-jayanti-current-account", "title": "धन्वन्तरी-जयंती का वर्तमान सम्बन्ध", "summary": "आकाशवाणी का वर्तमान विवरण इस दिन को धनत्रयोदशी और धन्वन्तरी-जयंती दोनों कहता है तथा धन्वन्तरी, कुबेर और लक्ष्मी की पूजा का उल्लेख करता है। यह वर्तमान सार्वजनिक पहचान है, चिकित्सा उपचार या एक सार्वभौम देवता-क्रम का प्रमाण नहीं।", "tradition_scope": "वर्तमान सार्वजनिक-प्रसारण विवरण", "source_ids": ["dd-news-on-air-dhanteras-identity-2026"], "universal_origin_claimed": False}]
            practices = [{"practice_id": "north-west-dhantrayodashi-household", "population_scope": "सम्बन्धित उत्तर/पश्चिम भारतीय परिवार", "description": "परिवार सायंकाल घर को व्यवस्थित कर धन्वन्तरी, लक्ष्मी-कुबेर, आजीविका के साधन या केवल दीपावली-तैयारी में से अपनी परिचित धारा चुनते हैं; परिचित अर्पण और प्रार्थना करते हैं। खरीद एक प्रचलित रीति हो सकती है, आवश्यकता नहीं।", "source_ids": ["dd-news-on-air-dhanteras-identity-2026", "drikpanchang-dhanteras-practice"], "instructional": False}]
            variants = [{"variant_id": "dhanvantari-lakshmi-kubera-or-livelihood-focus", "scope": "परिवार का उपासना-केन्द्र", "difference": "धन्वन्तरी, लक्ष्मी-कुबेर, बही/औजार या सरल तैयारी के केन्द्र अलग हो सकते हैं; परिवार की परम्परा चुनती है।", "source_ids": ["dd-news-on-air-dhanteras-identity-2026", "drikpanchang-dhanteras-practice"], "separate_lane_required": False}, {"variant_id": "yama-deepam-separate", "scope": "समीपवर्ती त्रयोदशी रीति", "difference": "यम दीपम का समय, अर्थ और दीप-दान अपनी अलग धारा में है; यह धनत्रयोदशी पूजा में स्वतः नहीं मिलाया गया।", "source_ids": ["devam-dhantrayodashi-date-fixture"], "separate_lane_required": True}]
            boundaries = ["नई वस्तु, धातु, आभूषण, औषधि या वाहन खरीदना अनिवार्य नहीं और वित्तीय सलाह नहीं है।", "धन्वन्तरी-स्मरण चिकित्सकीय उपचार का स्थान नहीं लेता और स्वास्थ्य-फल की गारंटी नहीं देता।", "सटीक औपचारिक मुहूर्त और मन्त्र परिवार के पंचांग, ग्रन्थ या जानकार से लें।", "हर लौ की देखरेख करें और जाते समय बुझाएँ।"]
        else:
            significance = {"text": "In this bounded North/West India household lane, Dhantrayodashi is a time for gratitude for health, livelihood, ethical stewardship of resources, and the beginning of Diwali preparation. Current sources preserve distinct Dhanvantari, Kubera, and Lakshmi family focuses; shopping is not a devotional requirement.", "source_ids": ["dd-news-on-air-dhanteras-identity-2026", "maharashtra-tourism-diwali-2026"], "scope_note": "This is neither medical or financial advice nor the only Dhanteras form across India."}
            narratives = [{"narrative_id": "dhanteras-lakshmi-farmer-legend", "title": "The Dhanteras story of Lakshmi and the farmer", "summary": "The current Drik Panchang account tells of Lakshmi visiting a farmer's home and presents cleaning the home to welcome her on Krishna Trayodashi as a circulating Dhanteras legend. Devam labels it as a story, not verified history, a universal origin, or a command to purchase.", "tradition_scope": "Current practitioner Dhanteras legend retelling", "source_ids": ["drikpanchang-dhanteras-lakshmi-farmer-legend"], "universal_origin_claimed": False}, {"narrative_id": "dhanvantari-jayanti-current-account", "title": "The current Dhanvantari Jayanti association", "summary": "The current Akashvani account names the day both Dhantrayodashi and Dhanvantari Jayanti and notes worship of Dhanvantari, Kubera, and Lakshmi. This is a public current identity account, not medical treatment or proof of one universal deity sequence.", "tradition_scope": "Current official public-broadcaster account", "source_ids": ["dd-news-on-air-dhanteras-identity-2026"], "universal_origin_claimed": False}]
            practices = [{"practice_id": "north-west-dhantrayodashi-household", "population_scope": "Relevant North/West India households", "description": "Families may prepare the home in the evening and choose their familiar focus—Dhanvantari, Lakshmi-Kubera, tools of livelihood, or simple Diwali preparation—then make familiar offerings and prayers. Purchasing is a common custom for some, not a requirement.", "source_ids": ["dd-news-on-air-dhanteras-identity-2026", "drikpanchang-dhanteras-practice"], "instructional": False}]
            variants = [{"variant_id": "dhanvantari-lakshmi-kubera-or-livelihood-focus", "scope": "Household devotional focus", "difference": "Dhanvantari, Lakshmi-Kubera, account/tool, and preparation-centred forms differ; family practice selects the form.", "source_ids": ["dd-news-on-air-dhanteras-identity-2026", "drikpanchang-dhanteras-practice"], "separate_lane_required": False}, {"variant_id": "yama-deepam-separate", "scope": "Adjacent Trayodashi observance", "difference": "Yama Deepam has its own timing, meaning, and light offering and is not automatically merged into this Dhantrayodashi puja.", "source_ids": ["devam-dhantrayodashi-date-fixture"], "separate_lane_required": True}]
            boundaries = ["Buying a new object, metal, jewellery, medicine, or vehicle is not required and is not financial advice.", "Remembering Dhanvantari does not replace medical care or promise a health outcome.", "Obtain a formal precise muhurta and mantra sequence from the family calendar, text, or practitioner.", "Supervise every flame and extinguish it before leaving."]
        localized.append({"language_code": guide["language_code"], "title": guide["title"], "short_answer": guide["summary"], "significance": significance, "origin_narratives": narratives, "typical_practices": practices, "procedures": convert_procedures(guide, lane_id, authority, ["dd-news-on-air-dhanteras-identity-2026", "devam-dhantrayodashi-safety-boundary"], ["devam-dhantrayodashi-safety-boundary"]), "variants": variants, "safety_and_boundaries": boundaries})
    return {"contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1", "lane_id": lane_id, "supersedes_legacy_pack_ids": [legacy["pack_id"]], "observance_slugs": [legacy["observance_slug"]], "applicability": {"region_codes": ["north-india", "west-india"], "tradition_codes": ["smarta-north-india", "smarta-west-india"], "context_pairs": [{"region_code": "north-india", "tradition_code": "smarta-north-india"}, {"region_code": "west-india", "tradition_code": "smarta-west-india"}], "settings": ["household", "individual", "family_led"], "family_practice_overrides_generic_guidance": True, "material_context_questions": legacy["guides"][0]["context_prompts"]}, "calendar": {"resolution_source_ids": ["devam-dhantrayodashi-date-fixture", "drikpanchang-dhanteras-practice"], "timing_kind": "mixed", "location_aware": True, "tradition_aware": True, "decision_rule_id": "devam-krishna-trayodashi-pradosha-delhi-v1", "live_schedule_required": False, "freshness_note": "The bounded New Delhi 2026 lane resolves Friday, 6 November. Use Devam's local pradosha decision; a provider Sthir-Lagna interval or formal family muhurta is a separate decision."}, "sources": sources, "localized_content": localized, "product_status": status()}


def yama_deepam() -> dict[str, Any]:
    legacy = load("yama-deepam-north-west-india-v1.json")
    lane_id = "yama-deepam-north-west-india-content-v1"
    sources = [
        source("devam-yama-deepam-date-practice-fixture", "Devam Yama Deepam Delhi 2026 date and practice evidence fixture", "Devam", "Deterministic New Delhi 2026 date and bounded practice crosswalk", "derivative_allowed", artifact_sha256="3264642732a7415def579db19fb62144ca1a262e523077b90eed5f4bd865af96", citation_coordinates={"path": "knowledge_packs/panchang/yama-deepam-delhi-2026-v1.json"}),
        source("drikpanchang-yama-deepam-practice", "2026 Yama Deepam date during Diwali for New Delhi", "Drik Panchang", "Current practitioner evidence for Trayodashi Sandhya, an outside-home light, the Deepdan identity, and the associated protection belief; not a guaranteed outcome", "citation_only", url="https://www.drikpanchang.com/diwali/yama-deepam/yama-deepam-date-time.html?geoname-id=1261481&year=2026&lang=en", observed_fetch={"status": 200, "final_url": "https://www.drikpanchang.com/diwali/yama-deepam/yama-deepam-date-time.html?geoname-id=1261481&year=2026&lang=en", "response_bytes": 77850, "response_sha256": "55cb81240c4efbf4d70f38d81a9b19e5ce34198b5fc64ea5fd75b425208621eb", "strict_utf8": True, "observed_at": "2026-08-07"}),
        source("nirnayasindhu-yama-deepa-context", "Nirnayasindhu Marathi edition, Kartika Trayodashi page 213", "Devam retained source vault", "Fixed historical Trayodashi context at the inspected page; not public text or a complete modern household manual", "citation_only", artifact_sha256="a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b", citation_coordinates={"pdf_page": 213}),
        source("devam-flame-safety-boundary", "Devam household flame-safety and family-context boundary", "Devam", "Editorial safety boundary; not scripture or ritual authority", "internal_only"),
    ]
    localized = []
    for guide in legacy["guides"]:
        hi = guide["language_code"] == "hi"
        authority = {"minimum": "उत्तर/पश्चिम भारतीय परिवार का एक सुरक्षित सायंकालीन प्रकाश" if hi else "One safe evening light for a North/West India household", "standard": "परिवार-परिचित यम दीप अर्पण" if hi else "Family-familiar Yama Deepa offering", "elaborate": "मान्य पारिवारिक ग्रन्थ या जानकार के नेतृत्व का विस्तृत रूप" if hi else "Expanded form led by a recognised family text or practitioner"}
        if hi:
            significance = {"text": "इस सीमित उत्तर/पश्चिम भारतीय गृह-धारा में यम दीपम त्रयोदशी की संध्या पर यमराज को घर के बाहर सुरक्षित प्रकाश अर्पित करने और मृत्यु, धर्म तथा उत्तरदायित्व पर स्मरण का अवसर है। सुरक्षा या दीर्घायु का फल श्रद्धा का दावा है, ऐप की गारंटी नहीं।", "source_ids": ["drikpanchang-yama-deepam-practice", "nirnayasindhu-yama-deepa-context"], "scope_note": "दिशा, दीप-संख्या, तेल, बाती, मन्त्र और तर्पण इस सीमित धारा में सार्वभौम नहीं माने गए हैं।"}
            narratives = [{"narrative_id": "yama-deepdan-current-belief-account", "title": "यमराज के लिए दीपदान का वर्तमान विश्वास-विवरण", "summary": "ड्रिक पंचांग का वर्तमान विवरण त्रयोदशी-संध्या पर घर के बाहर यमराज के लिए दीप जलाने को दीपदान कहता है और अकाल-मृत्यु से रक्षा की श्रद्धा बताता है। Devam इस फल-वाक्य को विश्वास के रूप में रखता है, निश्चित परिणाम के रूप में नहीं।", "tradition_scope": "वर्तमान उत्तर भारतीय पंचांग/व्यवहार-विवरण", "source_ids": ["drikpanchang-yama-deepam-practice"], "universal_origin_claimed": False}]
            practices = [{"practice_id": "north-west-yama-deepam-evening-light", "population_scope": "यम दीपम अलग से रखने वाले उत्तर/पश्चिम भारतीय परिवार", "description": "परिवार त्रयोदशी की संध्या में सुरक्षित बाहरी स्थान पर यमराज के लिए दीप या बिना लौ का प्रकाश रख सकते हैं और परिचित प्रार्थना करते हैं। दिशा, संख्या और सामग्री परिवार के अनुसार बदलती है।", "source_ids": ["drikpanchang-yama-deepam-practice", "devam-flame-safety-boundary"], "instructional": False}]
            variants = [{"variant_id": "direction-count-oil-and-prayer", "scope": "पारिवारिक दीप-विन्यास", "difference": "दिशा, दीपों की संख्या, तेल, बाती और प्रार्थना परिवारानुसार बदलते हैं; सीमित रूप केवल एक सुरक्षित प्रकाश रखता है।", "source_ids": ["devam-yama-deepam-date-practice-fixture"], "separate_lane_required": False}, {"variant_id": "dhantrayodashi-separate", "scope": "समीपवर्ती त्रयोदशी पूजा", "difference": "धन्वन्तरी/लक्ष्मी-कुबेर केन्द्रित धनत्रयोदशी पूजा अलग अर्थ और प्रक्रिया वाली धारा है।", "source_ids": ["devam-yama-deepam-date-practice-fixture"], "separate_lane_required": True}]
            boundaries = ["दीप को कभी अकेला या रात भर जलता न छोड़ें; असुरक्षित स्थान में बिना लौ का प्रकाश लें।", "दक्षिण दिशा, निश्चित संख्या, तेल, बाती, मन्त्र या तर्पण सामान्य रूप से न गढ़ें।", "रक्षा या दीर्घायु की गारंटी न दें।", "धनत्रयोदशी पूजा को इस छोटे दीपदान में न मिलाएँ।"]
        else:
            significance = {"text": "In this bounded North/West India household lane, Yama Deepam is an evening offering of safe light outside the home for Yamaraj and an occasion to remember mortality, dharma, and unfinished responsibilities. Protection or longevity is a belief claim, not an app guarantee.", "source_ids": ["drikpanchang-yama-deepam-practice", "nirnayasindhu-yama-deepa-context"], "scope_note": "Direction, lamp count, oil, wick, mantra, and tarpan are not treated as universal in this bounded lane."}
            narratives = [{"narrative_id": "yama-deepdan-current-belief-account", "title": "The current account of Deepdan for Yamaraj", "summary": "The current Drik Panchang account calls the outside-home Trayodashi evening light Deepdan for Yamaraj and records a belief that it protects the family from untimely death. Devam preserves that outcome as a belief, not a certain result.", "tradition_scope": "Current North India practitioner-calendar account", "source_ids": ["drikpanchang-yama-deepam-practice"], "universal_origin_claimed": False}]
            practices = [{"practice_id": "north-west-yama-deepam-evening-light", "population_scope": "North/West India households that separately keep Yama Deepam", "description": "A household may place a lamp or flame-free light for Yamaraj at a safe outside location during Trayodashi evening and use a familiar prayer. Direction, count, and materials vary by family.", "source_ids": ["drikpanchang-yama-deepam-practice", "devam-flame-safety-boundary"], "instructional": False}]
            variants = [{"variant_id": "direction-count-oil-and-prayer", "scope": "Family lamp arrangement", "difference": "Direction, lamp count, oil, wick, and prayer differ by household; the bounded form uses one safe light only.", "source_ids": ["devam-yama-deepam-date-practice-fixture"], "separate_lane_required": False}, {"variant_id": "dhantrayodashi-separate", "scope": "Adjacent Trayodashi puja", "difference": "Dhantrayodashi worship centred on Dhanvantari or Lakshmi-Kubera is a separate lane with a different meaning and procedure.", "source_ids": ["devam-yama-deepam-date-practice-fixture"], "separate_lane_required": True}]
            boundaries = ["Never leave the lamp unattended or burning overnight; use a flame-free light where the location is unsafe.", "Do not invent a universal south-facing direction, count, oil, wick, mantra, or tarpan.", "Do not promise protection or longevity.", "Do not merge the separate Dhantrayodashi puja into this short Deepdan."]
        localized.append({"language_code": guide["language_code"], "title": guide["title"], "short_answer": guide["summary"], "significance": significance, "origin_narratives": narratives, "typical_practices": practices, "procedures": convert_procedures(guide, lane_id, authority, ["drikpanchang-yama-deepam-practice", "devam-flame-safety-boundary"], ["devam-flame-safety-boundary"]), "variants": variants, "safety_and_boundaries": boundaries})
    return {"contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1", "lane_id": lane_id, "supersedes_legacy_pack_ids": [legacy["pack_id"]], "observance_slugs": [legacy["observance_slug"]], "applicability": {"region_codes": ["north-india", "west-india"], "tradition_codes": ["smarta-north-india", "smarta-west-india"], "context_pairs": [{"region_code": "north-india", "tradition_code": "smarta-north-india"}, {"region_code": "west-india", "tradition_code": "smarta-west-india"}], "settings": ["household", "individual", "family_led"], "family_practice_overrides_generic_guidance": True, "material_context_questions": legacy["guides"][0]["context_prompts"]}, "calendar": {"resolution_source_ids": ["devam-yama-deepam-date-practice-fixture", "drikpanchang-yama-deepam-practice"], "timing_kind": "mixed", "location_aware": True, "tradition_aware": True, "decision_rule_id": "devam-krishna-trayodashi-pradosha-yama-deepam-delhi-v1", "live_schedule_required": False, "freshness_note": "The bounded New Delhi 2026 lane resolves Friday, 6 November. Use Devam's location-aware evening; the provider interval and family-specific formal details remain separate."}, "sources": sources, "localized_content": localized, "product_status": status()}


def main() -> int:
    outputs = {
        "vasu-baras-maharashtra-family-content-v1.json": vasu_baras(),
        "dhantrayodashi-north-west-india-content-v1.json": dhantrayodashi(),
        "yama-deepam-north-west-india-content-v1.json": yama_deepam(),
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

#!/usr/bin/env python3
"""Build current-contract Karwa Chauth, Chhath, and Dev Deepawali lanes."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any

from build_early_diwali_content_batch_v1 import load, source, status
from build_late_diwali_content_batch_v1 import assert_source_references, fetch, localized_content


ROOT = Path(__file__).resolve().parents[1]
PACK_DIR = ROOT / "knowledge_packs" / "rituals"

KARWA_FETCH = fetch("https://www.incredibleindia.gov.in/en/festivals-and-events/karva-chauth", 469344, "e6cbfcb9df0a6dc75cbe7972a8597514122c921670e76ed5bd06a26d7693f493")
CHHATH_EN_FETCH = fetch("https://tourism.bihar.gov.in/en/experiences/festivals-and-fairs/festivals/chhath-puja", 77773, "32f0c746ce7cef900c7584a8963e70aa580206e9e636b17869230587dc4189db")
CHHATH_HI_FETCH = fetch("https://tourism.bihar.gov.in/hi/experiences/festivals-and-fairs/festivals/chhath-puja", 84178, "f82cfba83400a3753aa62225cb67a5e669bcd7752688e8b11cce27b62be74044")
PRESIDENT_CHHATH_FETCH = fetch("https://www.presidentofindia.gov.in/press_releases/presidents-greetings-chhath-puja", 42811, "016e0c927c4faf37e9f15c7d46b7e8f6a0cd741e64c1af0ea9fd757249d5ce68")
DEV_IDENTITY_FETCH = fetch("https://www.incredibleindia.gov.in/en/uttar-pradesh/varanasi/10-unmissable-travel-and-food-experiences", 477739, "c3e1756e2eb39ed49fc829ad25dc882ede9832fc4e5b1bb4991849e49218df23")
DEV_CITY_FETCH = fetch("https://www.incredibleindia.gov.in/en/uttar-pradesh/varanasi", 595856, "2811c7169ce321ae1d94d72e5ad0f41b64075219b2b98f6e3b3c081100ad67f6")
DEV_UTSAV_FETCH = fetch("https://utsav.gov.in/public/view-event/dev-deepawali-1", 30920, "48521d0e83e6fc10a2fda42f50241ab6d702a2c86f3470e60a862e33bb0966ff")


def karwa_details(language: str) -> dict[str, Any]:
    if language == "en":
        return {
            "significance": {"text": "Karwa Chauth is a North Indian household observance of marital and family bonds. The official living-practice account describes a dawn-to-moonrise fast, Sargi, group prayer and katha, and a moonrise close, while also recording newer reciprocal participation.", "source_ids": ["incredible-india-karva-chauth-context"]},
            "origin_narratives": [
                {"narrative_id": "savitri-satyavan-karwa-context", "title": "Savitri and Satyavan", "summary": "The tourism source presents Savitri's steadfast action for Satyavan as one Karwa Chauth story; it is a festival retelling, not the only textual origin.", "tradition_scope": "Current official tourism retelling", "source_ids": ["incredible-india-karva-chauth-context"], "universal_origin_claimed": False},
                {"narrative_id": "veervati-karwa-context", "title": "Veervati and the false moonrise", "summary": "A second account tells of Veervati's brothers creating a false moonrise and her later devotion; families may narrate different versions.", "tradition_scope": "Current official tourism retelling", "source_ids": ["incredible-india-karva-chauth-context"], "universal_origin_claimed": False},
            ],
            "typical_practices": [
                {"practice_id": "punjab-karwa-chauth", "population_scope": "Punjab households described by Incredible India", "description": "The account describes pre-dawn Sargi, Bayaa, an afternoon gathering with thalis and Gaura Maa, elder-led katha and thali rotation, and a moonrise close with a sieve, water, food, and spouse participation.", "source_ids": ["incredible-india-karva-chauth-context"], "instructional": False},
                {"practice_id": "uttar-pradesh-karwa-chauth", "population_scope": "Uttar Pradesh households described by Incredible India", "description": "The account describes Sargi, adornment and evening prayers; in some places a moon image is made with rice paste and water is offered with a karwa. This is not merged with the Punjab sequence.", "source_ids": ["incredible-india-karva-chauth-context"], "instructional": False},
            ],
            "variants": [
                {"variant_id": "punjab-and-uttar-pradesh", "scope": "Punjab and Uttar Pradesh", "difference": "Food, Bayaa, Gaura Maa, thali rotation, moon representation, offerings, and close differ.", "source_ids": ["incredible-india-karva-chauth-context"], "separate_lane_required": True},
                {"variant_id": "reciprocal-participation", "scope": "Contemporary couples and families", "difference": "Some spouses participate reciprocally; a women-only or married-only eligibility rule is not imposed by this lane.", "source_ids": ["incredible-india-karva-chauth-context", "devam-karwa-chauth-safety-boundary"], "separate_lane_required": False},
            ],
            "safety_and_boundaries": ["The ordinary fast is documented but never made compulsory or treated as medical advice; pregnancy, breastfeeding, illness, medication, age, eating disorders, and other risks require appropriate care.", "Use safe moon-viewing access; do not climb or crowd rooftops, stare at bright lights, or leave a flame unattended.", "Sargi, Bayaa, clothing, jewellery, gifts, sieve, karwa, seven rotations, and spouse-fed close are family-specific rather than purchase requirements.", "No act guarantees a spouse's health, longevity, marriage outcome, protection, merit, or success."],
        }
    return {
        "significance": {"text": "करवा चौथ उत्तर भारतीय पारिवारिक पालन है जो वैवाहिक और पारिवारिक सम्बन्धों पर केन्द्रित है। आधिकारिक जीवन्त-वर्णन में प्रातः से चन्द्रोदय उपवास, सरगी, सामूहिक प्रार्थना/कथा और चन्द्र-समापन आते हैं, साथ ही नए पारस्परिक रूप भी दर्ज हैं।", "source_ids": ["incredible-india-karva-chauth-context"]},
        "origin_narratives": [
            {"narrative_id": "savitri-satyavan-karwa-context", "title": "सावित्री और सत्यवान", "summary": "पर्यटन स्रोत सावित्री के सत्यवान के लिए दृढ़ प्रयास को एक करवा चौथ कथा के रूप में देता है; यह एक पुनर्कथन है, अकेला मूल नहीं।", "tradition_scope": "वर्तमान सरकारी पर्यटन पुनर्कथन", "source_ids": ["incredible-india-karva-chauth-context"], "universal_origin_claimed": False},
            {"narrative_id": "veervati-karwa-context", "title": "वीरवती और झूठा चन्द्रोदय", "summary": "दूसरी कथा में वीरवती के भाइयों का कृत्रिम चन्द्रोदय और उसकी बाद की साधना आती है; परिवारों में रूप बदलते हैं।", "tradition_scope": "वर्तमान सरकारी पर्यटन पुनर्कथन", "source_ids": ["incredible-india-karva-chauth-context"], "universal_origin_claimed": False},
        ],
        "typical_practices": [
            {"practice_id": "punjab-karwa-chauth", "population_scope": "Incredible India में वर्णित पंजाब परिवार", "description": "वर्णन में प्रातः सरगी, बाया, दोपहर थाली/गौरा माँ के साथ सभा, बुज़ुर्ग की कथा और थाली फेरना, तथा छलनी, जल, भोजन और पति की सहभागिता वाला चन्द्र-समापन आता है।", "source_ids": ["incredible-india-karva-chauth-context"], "instructional": False},
            {"practice_id": "uttar-pradesh-karwa-chauth", "population_scope": "Incredible India में वर्णित उत्तर प्रदेश परिवार", "description": "वर्णन में सरगी, श्रृंगार और संध्या-प्रार्थना; कुछ स्थानों पर चावल के लेप का चन्द्र-चित्र और करवे से जल आता है। इसे पंजाब क्रम में नहीं मिलाया गया है।", "source_ids": ["incredible-india-karva-chauth-context"], "instructional": False},
        ],
        "variants": [
            {"variant_id": "punjab-and-uttar-pradesh", "scope": "पंजाब और उत्तर प्रदेश", "difference": "भोजन, बाया, गौरा माँ, थाली फेरना, चन्द्र-रूप, अर्पण और समापन बदलते हैं।", "source_ids": ["incredible-india-karva-chauth-context"], "separate_lane_required": True},
            {"variant_id": "reciprocal-participation", "scope": "वर्तमान दम्पती और परिवार", "difference": "कुछ पति-पत्नी पारस्परिक रूप से जुड़ते हैं; यह मार्ग केवल महिलाओं या विवाहितों की सार्वभौमिक पात्रता नहीं बनाता।", "source_ids": ["incredible-india-karva-chauth-context", "devam-karwa-chauth-safety-boundary"], "separate_lane_required": False},
        ],
        "safety_and_boundaries": ["सामान्य उपवास का वर्णन है, पर वह अनिवार्य या चिकित्सा-निर्देश नहीं; गर्भावस्था, स्तनपान, बीमारी, दवा, आयु, भोजन-विकार और अन्य जोखिम में उचित देखभाल लें।", "चन्द्र-दर्शन सुरक्षित स्थान से करें; असुरक्षित छत/भीड़ में न जाएँ और लौ बिना निगरानी न छोड़ें।", "सरगी, बाया, वस्त्र, आभूषण, उपहार, छलनी, करवा, सात फेरे और पति से समापन परिवार-विशिष्ट हैं, खरीद की शर्त नहीं।", "किसी कर्म से जीवनसाथी की आयु/स्वास्थ्य, विवाह, रक्षा, पुण्य या सफलता की गारंटी नहीं।"],
    }


def adjust_karwa(procedures: list[dict[str, Any]]) -> None:
    for procedure in procedures:
        if procedure["tier"] != "standard":
            continue
        hindi = "-hi-" in procedure["procedure_id"]
        procedure["estimated_minutes"] = 40
        procedure["authority_scope"] = "सीमित उत्तर भारतीय पारिवारिक रूप; परिवार और स्वास्थ्य-सन्दर्भ सर्वोपरि" if hindi else "Bounded North Indian household form; family and health context override it"
        if hindi:
            procedure["materials"] = [
                {"item": "परिवार की परिचित थाली/करवा/चित्र", "required": False, "substitutions": ["सरल जल-पात्र", "बिना सामग्री स्मरण"], "source_ids": ["incredible-india-karva-chauth-context", "devam-karwa-chauth-safety-boundary"]},
                {"item": "परिवार की कथा या प्रार्थना", "required": False, "substitutions": ["मौन कृतज्ञता", "परिचित पारिवारिक शब्द"], "source_ids": ["incredible-india-karva-chauth-context"]},
                {"item": "वैकल्पिक छलनी और सुरक्षित दीप", "required": False, "substitutions": ["बिना छलनी चन्द्र-दर्शन", "बिजली का दीप", "बिना लौ"], "source_ids": ["incredible-india-karva-chauth-context", "devam-karwa-chauth-safety-boundary"]},
            ]
            items = [
                ("स्थानीय तिथि की पुष्टि करके परिवार से पंजाब/उत्तर प्रदेश या अन्य लागू क्रम, सरगी, बाया, कथा, चन्द्र-दर्शन और समापन पूछें।", "तिथि तय हो सकती है, पर जीवित पारिवारिक रूप अलग हैं।"),
                ("परिवार में सरगी हो और कोई स्वस्थ वयस्क स्वेच्छा से उपवास करे तो स्वास्थ्य-विवेक से करे; अन्य सहभागी बिना उपवास के जुड़ सकते हैं।", "स्रोत सामान्य उपवास बताता है, उसे सार्वभौमिक स्वास्थ्य-निर्देश नहीं बनाता।"),
                ("दिन में एक-दूसरे की देखभाल, आराम और काम बाँटें; परिचित थाली, करवा या कथा हो तो संध्या के लिए तैयार रखें।", "पारस्परिक देखभाल पालन को दैनिक जीवन से जोड़ती है।"),
                ("संध्या में परिवार या समुदाय की परिचित प्रार्थना/कथा करें; पंजाब की थाली-रीति या उत्तर प्रदेश के चन्द्र-रूप को परस्पर न मिलाएँ।", "स्रोत दोनों क्षेत्रीय रूपों का भेद रखता है।"),
                ("चन्द्रोदय पर सुरक्षित जगह से परिवार का जल, छलनी या अन्य परिचित समापन करें; दृश्यता न हो तो परिवार से विकल्प पूछें।", "चन्द्र-समापन सामान्य है, पर सामग्री और क्रम बदलते हैं।"),
                ("परिचित भोजन/जल-समापन करें, किसी के उपवास को नियंत्रित न करें और परस्पर देखभाल का एक ठोस संकल्प रखें।", "फल का वादा किए बिना सम्बन्ध-केंद्रित अर्थ बना रहता है।"),
            ]
        else:
            procedure["materials"] = [
                {"item": "Family's familiar thali, karwa, or image", "required": False, "substitutions": ["A simple water vessel", "Material-free remembrance"], "source_ids": ["incredible-india-karva-chauth-context", "devam-karwa-chauth-safety-boundary"]},
                {"item": "Family katha or prayer", "required": False, "substitutions": ["Quiet gratitude", "Familiar family words"], "source_ids": ["incredible-india-karva-chauth-context"]},
                {"item": "Optional sieve and safe light", "required": False, "substitutions": ["View the moon without a sieve", "Electric light", "No flame"], "source_ids": ["incredible-india-karva-chauth-context", "devam-karwa-chauth-safety-boundary"]},
            ]
            items = [
                ("Confirm the local date and ask which Punjab, Uttar Pradesh, or other family sequence, Sargi, Bayaa, story, moon-viewing, and close apply.", "The date can be resolved while the living household form remains distinct."),
                ("If Sargi is family practice and a healthy adult freely chooses the fast, use appropriate health judgment; everyone else may participate without fasting.", "The source describes the ordinary fast without turning it into universal health advice."),
                ("During the day, share care, rest, and practical work; prepare any familiar thali, karwa, or story for the evening.", "Mutual care connects the observance to everyday life."),
                ("At the family evening time, use the familiar prayer or katha; do not merge the Punjab thali sequence with Uttar Pradesh moon representations.", "The source preserves both regional forms separately."),
                ("At moonrise, use a safe place and follow the family's water, sieve, or other close; if visibility fails, ask the family rather than inventing a substitute as tradition.", "Moonrise is common, but materials and order vary."),
                ("Complete the familiar food or water close, do not police another person's fast, and name one concrete mutual-care commitment.", "The relationship-centred meaning remains without a promised outcome."),
            ]
        sources = ["incredible-india-karva-chauth-context", "devam-karwa-chauth-safety-boundary"]
        procedure["steps"] = [{"ordinal": index + 1, "instruction": item[0], "why": item[1], "source_ids": (["devam-karwa-chauth-date-and-practice-fixture"] + sources if index in (0, 4) else sources), "optional": False} for index, item in enumerate(items)]
        procedure["source_ids"] = ["devam-karwa-chauth-date-and-practice-fixture", *sources]


def karwa_chauth() -> dict[str, Any]:
    legacy = load("karwa-chauth-north-india-family-v1.json")
    lane_id = "karwa-chauth-north-india-household-content-v1"
    pack = {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1", "lane_id": lane_id, "supersedes_legacy_pack_ids": [legacy["pack_id"]], "observance_slugs": [legacy["observance_slug"]],
        "applicability": {"region_codes": ["north-india"], "tradition_codes": ["smarta-north-india"], "context_pairs": [{"region_code": "north-india", "tradition_code": "smarta-north-india"}], "settings": ["individual", "household", "family_led", "community"], "family_practice_overrides_generic_guidance": True, "material_context_questions": legacy["guides"][0]["context_prompts"]},
        "calendar": {"resolution_source_ids": ["devam-karwa-chauth-date-and-practice-fixture"], "timing_kind": "mixed", "location_aware": True, "tradition_aware": True, "decision_rule_id": "devam-current-practitioner-karwa-chauth-chaturthi-at-moonrise-v1", "closing_decision_rule_id": "family-moonrise-close-not-universalized", "live_schedule_required": False, "freshness_note": "The Delhi 2026 date and moonrise relevance are resolved; visibility, family sequence, and community programme remain local."},
        "sources": [
            source("devam-karwa-chauth-date-and-practice-fixture", "Devam Karwa Chauth Delhi and North India 2026 evidence fixture", "Devam", "Deterministic date and current-practice semantic fixture; not ritual authority", "derivative_allowed", artifact_sha256="c04a1d84ce766c312bb7e40c60025ceb01eb5cb5da7a3f6ccdb03e293ab53591", citation_coordinates={"path": "knowledge_packs/panchang/karwa-chauth-delhi-north-india-2026-v1.json"}),
            source("incredible-india-karva-chauth-context", "Karva Chauth: A celebration of love and matrimony", "Incredible India, Ministry of Tourism, Government of India", "Official current North India identity, stories, ordinary fast, Punjab and Uttar Pradesh practice, and reciprocal-participation evidence", "citation_only", url="https://www.incredibleindia.gov.in/en/festivals-and-events/karva-chauth", observed_fetch=KARWA_FETCH),
            source("devam-karwa-chauth-safety-boundary", "Devam fasting, health, flame, rooftop, inclusion, and outcome boundary", "Devam", "Editorial safety and scope boundary; not ritual authority", "internal_only"),
        ],
        "localized_content": localized_content(legacy, lane_id, {"minimum": "Accessible mutual-care reflection", "standard": "Bounded North India household form", "elaborate": "Established family- or community-led form only"}, ["incredible-india-karva-chauth-context", "devam-karwa-chauth-safety-boundary"], ["devam-karwa-chauth-safety-boundary"], karwa_details, procedure_adjuster=adjust_karwa),
        "product_status": status(),
    }
    assert_source_references(pack)
    return pack


def chhath_details(language: str) -> dict[str, Any]:
    if language == "en":
        return {
            "significance": {"text": "Chhath is a four-day Bihar and Purvanchal observance of gratitude and devotion to Surya, distinguished by arghya to both the setting and rising Sun, rigorous family discipline, nature, cleanliness, and collective support.", "source_ids": ["bihar-tourism-chhath-en", "president-of-india-chhath-2025"]},
            "origin_narratives": [{"narrative_id": "surya-setting-and-rising-sequence", "title": "Honouring the setting and rising Sun", "summary": "Bihar Tourism presents Chhath's distinctive four-day living sequence—Nahay Khay, Kharna, Sandhya Arghya, and Usha Arghya—rather than one universal mythic origin.", "tradition_scope": "Official Bihar living-practice account", "source_ids": ["bihar-tourism-chhath-en", "bihar-tourism-chhath-hi"], "universal_origin_claimed": False}],
            "typical_practices": [{"practice_id": "bihar-four-day-chhath", "population_scope": "Bihar and eastern Uttar Pradesh households described by Bihar Tourism", "description": "The official account describes bathing and cleaning on day one, Kharna and a day fast on day two, prasad preparation and sunset arghya on day three, and pre-dawn sunrise arghya, fast completion, and prasad sharing on day four.", "source_ids": ["bihar-tourism-chhath-en", "bihar-tourism-chhath-hi"], "instructional": False}],
            "variants": [{"variant_id": "family-parvaitin-and-setting", "scope": "Parvaitin, household, community, ghat, courtyard, and home", "difference": "Fast, food, purity, prasad, songs, Kosi, water setting, materials, and close remain family- and community-led; helpers do not assume the parvaitin role.", "source_ids": ["bihar-tourism-chhath-en", "devam-chhath-safety-boundary"], "separate_lane_required": False}],
            "safety_and_boundaries": ["This participant lane documents the strict vrata but never directs a newcomer to begin nirjala fasting or override medication, pregnancy, illness, age, or health needs.", "Never stare at the Sun, enter unsafe water, stand beyond barriers, or improvise at an unmanaged ghat.", "Food hygiene, flame, crowd, transport, child, elder, mobility, weather, and pre-dawn lighting plans belong to responsible family and organisers.", "The minimum or helper form is not equivalent to completing the full parvaitin vrata."],
        }
    return {
        "significance": {"text": "छठ बिहार और पूर्वांचल का चार-दिवसीय सूर्य-कृतज्ञता और भक्ति पालन है, जिसमें अस्त और उदय दोनों सूर्य को अर्घ्य, कठोर पारिवारिक अनुशासन, प्रकृति, स्वच्छता और सामूहिक सहयोग विशिष्ट हैं।", "source_ids": ["bihar-tourism-chhath-hi", "president-of-india-chhath-2025"]},
        "origin_narratives": [{"narrative_id": "surya-setting-and-rising-sequence", "title": "अस्त और उदय सूर्य का सम्मान", "summary": "बिहार पर्यटन किसी एक सार्वभौमिक पौराणिक मूल के बजाय नहाय खाय, खरना, संध्या अर्घ्य और उषा अर्घ्य का जीवित चार-दिवसीय क्रम देता है।", "tradition_scope": "आधिकारिक बिहार जीवन्त-परम्परा वर्णन", "source_ids": ["bihar-tourism-chhath-en", "bihar-tourism-chhath-hi"], "universal_origin_claimed": False}],
        "typical_practices": [{"practice_id": "bihar-four-day-chhath", "population_scope": "बिहार पर्यटन में वर्णित बिहार और पूर्वी उत्तर प्रदेश परिवार", "description": "आधिकारिक क्रम में पहले दिन स्नान/स्वच्छता, दूसरे दिन खरना और दिनभर उपवास, तीसरे दिन प्रसाद और संध्या अर्घ्य, तथा चौथे दिन प्रातः उषा अर्घ्य, पारण और प्रसाद-वितरण आते हैं।", "source_ids": ["bihar-tourism-chhath-en", "bihar-tourism-chhath-hi"], "instructional": False}],
        "variants": [{"variant_id": "family-parvaitin-and-setting", "scope": "परवैतिन, परिवार, समुदाय, घाट, आँगन और घर", "difference": "व्रत, भोजन, शुद्धता, प्रसाद, गीत, कोसी, जल-स्थल, सामग्री और समापन परिवार/समुदाय तय करते हैं; सहयोगी परवैतिन की भूमिका नहीं मानता।", "source_ids": ["bihar-tourism-chhath-hi", "devam-chhath-safety-boundary"], "separate_lane_required": False}],
        "safety_and_boundaries": ["यह सहभागिता मार्ग कठोर व्रत का वर्णन करता है, पर नए व्यक्ति को निर्जला व्रत या दवा, गर्भावस्था, बीमारी, आयु और स्वास्थ्य-आवश्यकता बदलने को नहीं कहता।", "सूर्य को सीधे न देखें, असुरक्षित जल में न उतरें, अवरोध न पार करें और अव्यवस्थित घाट पर क्रिया न गढ़ें।", "भोजन-स्वच्छता, लौ, भीड़, यात्रा, बच्चों/बुज़ुर्गों, चलने, मौसम और भोर के प्रकाश की योजना परिवार/आयोजक की है।", "न्यूनतम या सहयोगी रूप पूर्ण परवैतिन व्रत के बराबर नहीं।"],
    }


def adjust_chhath(procedures: list[dict[str, Any]]) -> None:
    for procedure in procedures:
        if procedure["tier"] in ("standard", "elaborate"):
            procedure["setting"] = "family_led" if procedure["tier"] == "standard" else "community_participation"
            procedure["form"] = "institutional_participation"


def chhath() -> dict[str, Any]:
    legacy = load("chhath-bihar-purvanchal-v1.json")
    lane_id = "chhath-bihar-purvanchal-participant-content-v1"
    pack = {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1", "lane_id": lane_id, "supersedes_legacy_pack_ids": [legacy["pack_id"]], "observance_slugs": [legacy["observance_slug"]],
        "applicability": {"region_codes": ["bihar-purvanchal"], "tradition_codes": ["surya-chhath-bihar-purvanchal"], "context_pairs": [{"region_code": "bihar-purvanchal", "tradition_code": "surya-chhath-bihar-purvanchal"}], "settings": ["household", "family_led", "community", "individual"], "family_practice_overrides_generic_guidance": True, "material_context_questions": legacy["guides"][0]["context_prompts"]},
        "calendar": {"resolution_source_ids": ["devam-chhath-date-fixture"], "timing_kind": "mixed", "location_aware": True, "tradition_aware": True, "decision_rule_id": "devam-chhath-patna-delhi-2026-crosswalk-v1", "closing_decision_rule_id": "family-usha-arghya-and-parana", "live_schedule_required": True, "freshness_note": "The bounded 2026 sequence resolves Sandhya Arghya on 15 November and Usha Arghya on 16 November; live ghat, weather, access, and family directions remain required."},
        "sources": [
            source("devam-chhath-date-fixture", "Devam Chhath Patna–Delhi 2026 date evidence fixture", "Devam", "Deterministic four-day date crosswalk; not practice authority", "derivative_allowed", artifact_sha256="b7eaedaf748be5a721b21a663799f56787cff7ded4afd402d638108c62b9b53e", citation_coordinates={"path": "knowledge_packs/panchang/chhath-patna-delhi-2026-v1.json"}),
            source("bihar-tourism-chhath-en", "Chhath Puja", "Department of Tourism, Government of Bihar", "Official regional English four-day sequence and setting/rising Sun practice evidence", "citation_only", url="https://tourism.bihar.gov.in/en/experiences/festivals-and-fairs/festivals/chhath-puja", observed_fetch=CHHATH_EN_FETCH),
            source("bihar-tourism-chhath-hi", "छठ पूजा", "Department of Tourism, Government of Bihar", "Official regional Hindi four-day sequence and setting/rising Sun practice evidence", "citation_only", url="https://tourism.bihar.gov.in/hi/experiences/festivals-and-fairs/festivals/chhath-puja", observed_fetch=CHHATH_HI_FETCH),
            source("president-of-india-chhath-2025", "President's greetings on Chhath Puja", "Rashtrapati Bhavan", "Official gratitude, nature, cleanliness, and social-harmony meaning context", "citation_only", url="https://www.presidentofindia.gov.in/press_releases/presidents-greetings-chhath-puja", observed_fetch=PRESIDENT_CHHATH_FETCH),
            source("devam-chhath-safety-boundary", "Devam Chhath fasting, Sun, water, crowd, food, and helper-role boundary", "Devam", "Editorial participant safety and authority boundary; not ritual authority", "internal_only"),
        ],
        "localized_content": localized_content(legacy, lane_id, {"minimum": "Newcomer or family-helper participation", "standard": "Family-led four-day participant/support path", "elaborate": "Established parvaitin- and community-led programme participation"}, ["bihar-tourism-chhath-en", "bihar-tourism-chhath-hi", "devam-chhath-safety-boundary"], ["bihar-tourism-chhath-en", "bihar-tourism-chhath-hi", "devam-chhath-safety-boundary"], chhath_details, procedure_adjuster=adjust_chhath, source_map={"devam-chhath-date-fixture": "devam-chhath-date-fixture"}),
        "product_status": status(),
    }
    assert_source_references(pack)
    return pack


def dev_details(language: str) -> dict[str, Any]:
    if language == "en":
        return {
            "significance": {"text": "Varanasi Dev Deepawali is a Kartika full-moon public festival in which the Ganga ghats are illuminated and filled with prayer, chants, music, and cultural participation. A home light-and-reflection form remains separate from live ghat operations.", "source_ids": ["incredible-india-dev-deepawali-ghats", "utsav-india-dev-deepawali"]},
            "origin_narratives": [{"narrative_id": "shiva-tripurasura-dev-deepawali", "title": "Shiva and Tripurasura", "summary": "Incredible India connects the festival with a Shiva-Tripurasura victory account. Devam preserves it as one festival story tradition rather than the only historical origin.", "tradition_scope": "Current official tourism story variant", "source_ids": ["incredible-india-dev-deepawali-identity"], "universal_origin_claimed": False}],
            "typical_practices": [{"practice_id": "varanasi-ghat-public-festival", "population_scope": "Varanasi public festival described by official tourism sources", "description": "The ghats are illuminated with lamps and host prayer, chants, music, dance, and public gathering; live Ganga Aarti, boats, access, crowd flow, and river operations are not inferred from the recurring description.", "source_ids": ["incredible-india-dev-deepawali-ghats", "utsav-india-dev-deepawali"], "instructional": False}],
            "variants": [
                {"variant_id": "home-and-live-ghat", "scope": "Home remembrance versus Varanasi public programme", "difference": "A safe home light/reflection can be followed from anywhere; ghat participation requires current local authority and organiser information.", "source_ids": ["incredible-india-dev-deepawali-ghats", "devam-dev-deepawali-safety-boundary"], "separate_lane_required": False},
                {"variant_id": "kartika-purnima-and-other-dev-diwali", "scope": "Generic Kartika Purnima, BAPS Dev Diwali, and other regional observances", "difference": "They are not merged with the Varanasi public-festival lane.", "source_ids": ["devam-dev-deepawali-date-fixture", "devam-dev-deepawali-safety-boundary"], "separate_lane_required": True},
            ],
            "safety_and_boundaries": ["Use a flame-free option or a stable supervised lamp; do not release lamps or waste into a river.", "Do not enter water, board a boat, use fireworks, or rely on crowd/route/access advice from this content.", "Formal Ganga Aarti, temple puja, mantra, and priest liturgy remain with recognised local authorities.", "No act guarantees purification, sin removal, merit, protection, or another outcome."],
        }
    return {
        "significance": {"text": "वाराणसी देव दीपावली कार्तिक पूर्णिमा का सार्वजनिक उत्सव है जिसमें गंगा-घाट दीपों, प्रार्थना, जप, संगीत और सांस्कृतिक सहभागिता से प्रकाशित होते हैं। घर का प्रकाश/चिंतन रूप जीवित घाट-संचालन से अलग है।", "source_ids": ["incredible-india-dev-deepawali-ghats", "utsav-india-dev-deepawali"]},
        "origin_narratives": [{"narrative_id": "shiva-tripurasura-dev-deepawali", "title": "शिव और त्रिपुरासुर", "summary": "Incredible India उत्सव को शिव-त्रिपुरासुर विजय-कथा से जोड़ता है। Devam इसे एक कथा-परम्परा रखता है, अकेला ऐतिहासिक मूल नहीं।", "tradition_scope": "वर्तमान सरकारी पर्यटन कथा-रूप", "source_ids": ["incredible-india-dev-deepawali-identity"], "universal_origin_claimed": False}],
        "typical_practices": [{"practice_id": "varanasi-ghat-public-festival", "population_scope": "आधिकारिक पर्यटन स्रोतों में वर्णित वाराणसी सार्वजनिक उत्सव", "description": "घाट दीपों से प्रकाशित होते हैं और प्रार्थना, जप, संगीत, नृत्य व जन-सहभागिता होती है; जीवित गंगा आरती, नाव, प्रवेश, भीड़ और नदी-संचालन आवर्ती वर्णन से नहीं निकाले जाते।", "source_ids": ["incredible-india-dev-deepawali-ghats", "utsav-india-dev-deepawali"], "instructional": False}],
        "variants": [
            {"variant_id": "home-and-live-ghat", "scope": "घर का स्मरण और वाराणसी सार्वजनिक कार्यक्रम", "difference": "सुरक्षित घर-प्रकाश/चिंतन कहीं भी हो सकता है; घाट-सहभागिता के लिए वर्तमान स्थानीय निर्देश चाहिए।", "source_ids": ["incredible-india-dev-deepawali-ghats", "devam-dev-deepawali-safety-boundary"], "separate_lane_required": False},
            {"variant_id": "kartika-purnima-and-other-dev-diwali", "scope": "सामान्य कार्तिक पूर्णिमा, BAPS देव दिवाली और अन्य क्षेत्रीय रूप", "difference": "इन्हें वाराणसी सार्वजनिक-उत्सव मार्ग में नहीं मिलाया गया है।", "source_ids": ["devam-dev-deepawali-date-fixture", "devam-dev-deepawali-safety-boundary"], "separate_lane_required": True},
        ],
        "safety_and_boundaries": ["बिना लौ का विकल्प या स्थिर निगरानी वाला दीप लें; नदी में दीप या कचरा न छोड़ें।", "इस सामग्री के आधार पर जल में न उतरें, नाव न लें, पटाखे न चलाएँ या भीड़/मार्ग/प्रवेश सलाह न मानें।", "औपचारिक गंगा आरती, मंदिर पूजा, मन्त्र और पुरोहित-विधि मान्य स्थानीय नेतृत्व के पास हैं।", "किसी कर्म से शुद्धि, पाप-नाश, पुण्य, रक्षा या अन्य फल की गारंटी नहीं।"],
    }


def adjust_dev(procedures: list[dict[str, Any]]) -> None:
    for procedure in procedures:
        if procedure["tier"] == "elaborate":
            procedure["setting"] = "community_participation"
            procedure["form"] = "institutional_participation"


def dev_deepawali() -> dict[str, Any]:
    legacy = load("dev-deepawali-varanasi-participation-v1.json")
    lane_id = "dev-deepawali-varanasi-participant-content-v1"
    pack = {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1", "lane_id": lane_id, "supersedes_legacy_pack_ids": [legacy["pack_id"]], "observance_slugs": [legacy["observance_slug"]],
        "applicability": {"region_codes": ["kashi-varanasi"], "tradition_codes": ["regional-kashi-varanasi"], "context_pairs": [{"region_code": "kashi-varanasi", "tradition_code": "regional-kashi-varanasi"}], "settings": ["individual", "household", "community", "temple"], "family_practice_overrides_generic_guidance": True, "material_context_questions": legacy["guides"][0]["context_prompts"]},
        "calendar": {"resolution_source_ids": ["devam-dev-deepawali-date-fixture"], "timing_kind": "mixed", "location_aware": True, "tradition_aware": True, "decision_rule_id": "devam-varanasi-dev-deepawali-kartika-purnima-v1", "live_schedule_required": True, "freshness_note": "The bounded Varanasi 2026 date is resolved; ghat, temple, district, police, boat, access, and public-event operations must be checked live."},
        "sources": [
            source("devam-dev-deepawali-date-fixture", "Devam Varanasi Dev Deepawali 2026 evidence fixture", "Devam", "Bounded date, identity, and variant fixture; not public-event operations", "derivative_allowed", artifact_sha256="84fb6f87eedb403c354312a414f6073b24b8a378c979e9da1a9b02f13921f1e8", citation_coordinates={"path": "knowledge_packs/panchang/dev-deepawali-varanasi-2026-v1.json"}),
            source("incredible-india-dev-deepawali-identity", "Varanasi Dev Deepawali full-moon identity and story context", "Ministry of Tourism, Government of India", "Official place, full-moon, light, and Shiva-Tripurasura story evidence; not ritual authority", "citation_only", url="https://www.incredibleindia.gov.in/en/uttar-pradesh/varanasi/10-unmissable-travel-and-food-experiences", observed_fetch=DEV_IDENTITY_FETCH),
            source("incredible-india-dev-deepawali-ghats", "Varanasi public-festival context", "Ministry of Tourism, Government of India", "Official ghat, lamp, and public-festival context; not safety or vidhi authority", "citation_only", url="https://www.incredibleindia.gov.in/en/uttar-pradesh/varanasi", observed_fetch=DEV_CITY_FETCH),
            source("utsav-india-dev-deepawali", "Dev Deepawali", "Ministry of Tourism, Government of India / Uttar Pradesh Tourism", "Official recurring public-event context; not 2026 operations or ritual authority", "citation_only", url="https://utsav.gov.in/public/view-event/dev-deepawali-1", observed_fetch=DEV_UTSAV_FETCH),
            source("devam-dev-deepawali-safety-boundary", "Devam flame, river, boat, crowd, travel, outcome, and scope boundary", "Devam", "Editorial safety and scope boundary; not ritual authority", "internal_only"),
        ],
        "localized_content": localized_content(legacy, lane_id, {"minimum": "Accessible home remembrance", "standard": "Bounded home light-and-reflection form", "elaborate": "Current organiser-led Varanasi public participation only"}, ["incredible-india-dev-deepawali-ghats", "devam-dev-deepawali-safety-boundary"], ["devam-dev-deepawali-safety-boundary"], dev_details, procedure_adjuster=adjust_dev),
        "product_status": status(),
    }
    assert_source_references(pack)
    return pack


def main() -> int:
    outputs = {
        "karwa-chauth-north-india-household-content-v1.json": karwa_chauth(),
        "chhath-bihar-purvanchal-participant-content-v1.json": chhath(),
        "dev-deepawali-varanasi-participant-content-v1.json": dev_deepawali(),
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

#!/usr/bin/env python3
"""Build three distinct current-contract regional Diwali expansion lanes."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any

from build_early_diwali_content_batch_v1 import load, source, status
from build_late_diwali_content_batch_v1 import assert_source_references, fetch, localized_content


ROOT = Path(__file__).resolve().parents[1]
PACK_DIR = ROOT / "knowledge_packs" / "rituals"

AASAN_FETCH = fetch("https://aasan.wb.gov.in/", 33705, "e141c492c1a5bdc008ff71ac32889028ef17c0ef7bd9dd88563775ed47b452ed")
RKM_KALI_FETCH = fetch("https://varanasimath.rkmm.org/festivals-celebrations", 130731, "810240b3e69b1b769d5e9bac16651afff127411f355729398e24ecd49fc2bf54")
BAPS_LIST_FETCH = fetch("https://www.baps.org/Calendar/2026/FestivalList.aspx", 115443, "db452d70d395f020b0ec90401d86e39f063f30c48d089320c04303fa11f7ff02")
BAPS_ANNAKUT_FETCH = fetch("https://www.baps.org/cultureandheritage/Traditions/AnnualCelebrationsandFestivals/NutanVarsh/NewYearAnnakut.aspx", 101585, "df6c643988a598f44ba995e1443112dea2bcece7d1e5ab2ae39955e9408a43d6")
AIR_GUJARAT_FETCH = fetch("https://newsonair.gov.in/gujarati-new-year-being-celebrated-today/", 78470, "ebee3846da44dd0b4196fc73fad5bb4070cef8492f19be2410eb51be66f7a0e2")
KARNATAKA_TOURISM_FETCH = fetch("https://karnatakatourism.org/en/blogs/deepavali-celebrations-in-karnataka-a-festival-of-lights-and-joy", 57273, "bd3699de8298dcfd1ec2efc2bc8c75b79b712fe092c8212a46ed07a0ae06ffeb")
AIR_KARNATAKA_FETCH = fetch("https://newsonair.gov.in/karnataka-celebrates-bali-padyami-festival/", 78254, "42a39ef8f66fce02a6ef3248efca3639b078bf9e7647c156ea5e6fd7ddf74cbc")


def kali_details(language: str) -> dict[str, Any]:
    en = language == "en"
    return {
        "significance": {
            "text": (
                "In this bounded Bengal Shakta participation lane, Kali Puja—also called Shyama Puja or Mahanisha Puja—honours Goddess Kali through family, temple, or public-puja participation on the Kartik Amavasya night."
                if en else
                "इस सीमित बंगाल शाक्त सहभागिता-धारा में काली पूजा—जिसे श्यामा पूजा या महानिशा पूजा भी कहा जाता है—कार्तिक अमावस्या की रात्रि में परिवार, मंदिर या सार्वजनिक पूजा की सहभागिता से देवी काली का सम्मान करती है।"
            ),
            "source_ids": ["west-bengal-aasan-kali-puja", "ramakrishna-math-kali-puja-night-context"],
            "scope_note": "The sources establish regional identity and participation context, not one universal Bengali liturgy." if en else "स्रोत क्षेत्रीय पहचान और सहभागिता-संदर्भ बताते हैं, एक सार्वभौमिक बंगाली पूजा-विधान नहीं।",
        },
        "origin_narratives": [{
            "narrative_id": "bengal-kali-strength-and-good-over-harm",
            "title": "Kali as strength and the triumph of good over harm" if en else "शक्ति और अहित पर शुभ की विजय के रूप में काली",
            "summary": (
                "West Bengal's AASAN portal describes Kali as representing strength, power, and the triumph of good over evil. Devam preserves that current official meaning as an attributable festival account, not verified history or the only Shakta interpretation."
                if en else
                "पश्चिम बंगाल का AASAN पोर्टल काली को शक्ति, सामर्थ्य और अशुभ पर शुभ की विजय का प्रतीक बताता है। देवम इस वर्तमान आधिकारिक अर्थ को स्रोत-सम्बद्ध पर्व-वर्णन के रूप में रखता है, सत्यापित इतिहास या एकमात्र शाक्त व्याख्या के रूप में नहीं।"
            ),
            "tradition_scope": "West Bengal official public-puja context" if en else "पश्चिम बंगाल का आधिकारिक सार्वजनिक-पूजा संदर्भ",
            "source_ids": ["west-bengal-aasan-kali-puja"],
            "universal_origin_claimed": False,
        }],
        "typical_practices": [{
            "practice_id": "bengal-kali-puja-home-temple-public-participation",
            "population_scope": "Bengal Shakta family, temple, and public-puja participants" if en else "बंगाल शाक्त परिवार, मंदिर और सार्वजनिक-पूजा सहभागी",
            "description": (
                "The official regional portal names elaborate puja, devotional songs, prayers, offerings, decorations, and public celebration; Ramakrishna Math documents an institution-led night-long Kali Puja. The app supports respectful participation but does not reproduce liturgy or promise a live programme."
                if en else
                "आधिकारिक क्षेत्रीय पोर्टल विस्तृत पूजा, भक्ति-गीत, प्रार्थना, अर्पण, सजावट और सार्वजनिक उत्सव बताता है; रामकृष्ण मठ संस्था-नेतृत्व वाली रात्रि-भर काली पूजा का वर्णन करता है। ऐप सम्मानजनक सहभागिता देता है, विधि या जीवंत कार्यक्रम की गारंटी नहीं।"
            ),
            "source_ids": ["west-bengal-aasan-kali-puja", "ramakrishna-math-kali-puja-night-context", "devam-kali-puja-safety-and-authority-boundary"],
            "instructional": False,
        }],
        "variants": [
            {"variant_id": "home-temple-and-public-puja-authorities", "scope": "Participation setting" if en else "सहभागिता का स्थान", "difference": "Home remembrance, temple attendance, and public-pandal participation have different leaders, materials, schedules, queues, and closes." if en else "गृह-स्मरण, मंदिर-दर्शन और सार्वजनिक पंडाल सहभागिता के नेता, सामग्री, समय, कतार और समापन अलग होते हैं।", "source_ids": ["west-bengal-aasan-kali-puja", "devam-kali-puja-safety-and-authority-boundary"], "separate_lane_required": False},
            {"variant_id": "ramakrishna-institutional-form-distinct", "scope": "Ramakrishna institutional practice" if en else "रामकृष्ण संस्थागत रीति", "difference": "The cited Ramakrishna Math night-long programme is one institution's practice and is not copied into home or public-pandal guidance." if en else "उद्धृत रामकृष्ण मठ का रात्रि-भर कार्यक्रम एक संस्था की रीति है; उसे घर या सार्वजनिक पंडाल के मार्ग में नहीं मिलाया जाता।", "source_ids": ["ramakrishna-math-kali-puja-night-context"], "separate_lane_required": True},
            {"variant_id": "other-shakta-lineages-remain-open", "scope": "Other Bengal and Shakta traditions" if en else "अन्य बंगाल और शाक्त परम्पराएँ", "difference": "Lineage, household, temple, tantric, initiatory, regional, and diaspora forms need their own authorities and remain open." if en else "वंश, घर, मंदिर, तांत्रिक, दीक्षित, क्षेत्रीय और प्रवासी रूपों के अपने प्रामाणिक स्रोत चाहिए और वे खुले हैं।", "source_ids": ["devam-kali-puja-safety-and-authority-boundary"], "separate_lane_required": True},
        ],
        "safety_and_boundaries": [
            "Use only familiar prayer, song, reading, or an offering accepted by the home, temple, or public-puja setting." if en else "केवल परिचित प्रार्थना, गीत, पाठ या घर, मंदिर अथवा सार्वजनिक पूजा में स्वीकार्य अर्पण लें।",
            "Formal mantra, consecration, tantric or initiatory practice, bali, homa, fasting, all-night vigil, and priest-led worship remain with qualified living authority." if en else "औपचारिक मंत्र, प्राण-प्रतिष्ठा, तांत्रिक या दीक्षित साधना, बलि, होम, उपवास, रात्रि-जागरण और पुरोहित-नेतृत्व वाली पूजा योग्य जीवित प्रामाणिकता के पास रहती है।",
            "Do not infer live venue schedules, crowd access, immersion, food handling, donations, or safe travel from this pack." if en else "इस पैक से जीवंत समय, भीड़-प्रवेश, विसर्जन, भोजन-व्यवस्था, दान या सुरक्षित यात्रा का अनुमान न लगाएँ।",
            "West India Lakshmi Puja and other Diwali traditions remain separate." if en else "पश्चिम भारत लक्ष्मी पूजा और अन्य दिवाली परम्पराएँ अलग हैं।",
        ],
    }


def adjust_temple_elaborate(procedures: list[dict[str, Any]]) -> None:
    for procedure in procedures:
        if procedure["tier"] == "elaborate":
            procedure["setting"] = "temple_participation"
            procedure["form"] = "institutional_participation"


def bengal_kali_puja() -> dict[str, Any]:
    legacy = load("bengal-kali-puja-participation-v1.json")
    lane = "bengal-kali-puja-participant-content-v1"
    pack = {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1", "lane_id": lane,
        "supersedes_legacy_pack_ids": [legacy["pack_id"]], "observance_slugs": [legacy["observance_slug"]],
        "applicability": {"region_codes": ["bengal"], "tradition_codes": ["shakta-bengal"], "context_pairs": [{"region_code": "bengal", "tradition_code": "shakta-bengal"}], "settings": ["household", "temple", "community", "individual", "family_led"], "family_practice_overrides_generic_guidance": True, "material_context_questions": legacy["guides"][0]["context_prompts"]},
        "calendar": {"resolution_source_ids": ["devam-bengal-kali-puja-date-fixture", "west-bengal-aasan-kali-puja", "ramakrishna-math-kali-puja-night-context"], "timing_kind": "mixed", "location_aware": True, "tradition_aware": True, "decision_rule_id": "devam-bengal-kali-puja-amavasya-nishita-v1", "live_schedule_required": True, "freshness_note": "The bounded Kolkata/Bengal 2026 lane resolves Sunday, 8 November. Recheck the responsible home, temple, or organiser for live timings and participation rules."},
        "sources": [
            source("devam-bengal-kali-puja-date-fixture", "Devam Bengal Kali Puja Kolkata 2026 date evidence fixture", "Devam", "Deterministic Kolkata date decision; not ritual authority", "derivative_allowed", artifact_sha256="faa675ee7ece5ed1513f75b49fef6db2ab0f9b0ea324f58a40990864c46c165c", citation_coordinates={"path": "knowledge_packs/panchang/kali-puja-kolkata-2026-v1.json"}),
            source("west-bengal-aasan-kali-puja", "AASAN — Kali Puja", "Government of West Bengal", "Official regional identity, aliases, public-puja, song, prayer, and offering context; not a complete liturgy", "citation_only", url="https://aasan.wb.gov.in/", observed_fetch=AASAN_FETCH),
            source("ramakrishna-math-kali-puja-night-context", "Festivals & Celebrations — Kali Puja", "Ramakrishna Advaita Ashrama, Varanasi", "Official living-institution Kartik Amavasya night context; not Bengal-wide or household authority", "citation_only", url="https://varanasimath.rkmm.org/festivals-celebrations", observed_fetch=RKM_KALI_FETCH),
            source("devam-kali-puja-safety-and-authority-boundary", "Devam Kali Puja specialist-practice, crowd, food, flame, and authority boundary", "Devam", "Editorial safety and scope boundary; not scripture or ritual authority", "internal_only"),
        ],
        "localized_content": localized_content(legacy, lane, {"minimum": "Short Bengal Shakta remembrance or respectful visit", "standard": "Family-, temple-, or public-puja-led participation", "elaborate": "Established temple or public-puja participation only"}, ["west-bengal-aasan-kali-puja", "devam-kali-puja-safety-and-authority-boundary"], ["devam-kali-puja-safety-and-authority-boundary"], kali_details, procedure_adjuster=adjust_temple_elaborate),
        "product_status": status(),
    }
    assert_source_references(pack)
    return pack


def gujarati_details(language: str) -> dict[str, Any]:
    en = language == "en"
    return {
        "significance": {"text": "In this exact BAPS Gujarat lane, Kartak Sud 1 is Bestu Varash/Nutan Varsh: a day of gratitude, prayer, greetings, seva, and Annakut participation under family or mandir authority." if en else "इस ठीक BAPS गुजरात-धारा में कार्तक सुद 1 बेस्टु वर्ष/नूतन वर्ष है—परिवार या मंदिर के अधिकार में कृतज्ञता, प्रार्थना, शुभकामना, सेवा और अन्नकूट सहभागिता का दिन।", "source_ids": ["baps-festival-list-2026-new-year", "baps-nutan-varsh-new-year-annakut", "akashvani-gujarati-new-year-context"], "scope_note": "BAPS institutional practice and wider Gujarati household or business customs are not one universal procedure." if en else "BAPS संस्थागत रीति और व्यापक गुजराती घरेलू या व्यापारिक रीतियाँ एक सार्वभौमिक विधि नहीं हैं।"},
        "origin_narratives": [{"narrative_id": "baps-annakut-gratitude-account", "title": "Annakut as gratitude at the New Year" if en else "नववर्ष में कृतज्ञता के रूप में अन्नकूट", "summary": "BAPS describes Kartak Sud 1 as the New Year and Annakut as a mountain of vegetarian food offered in appreciation and gratitude. Devam preserves this as BAPS practice, without requiring a large food display or reproducing thal, aarti, or formal worship." if en else "BAPS कार्तक सुद 1 को नववर्ष और अन्नकूट को कृतज्ञता में अर्पित शाकाहारी भोजन का पर्वत बताता है। देवम इसे BAPS रीति के रूप में रखता है, बड़े भोजन-प्रदर्शन, थाल, आरती या औपचारिक पूजा को अनिवार्य नहीं करता।", "tradition_scope": "BAPS Swaminarayan published festival account" if en else "BAPS स्वामिनारायण का प्रकाशित पर्व-वर्णन", "source_ids": ["baps-nutan-varsh-new-year-annakut"], "universal_origin_claimed": False}],
        "typical_practices": [{"practice_id": "baps-gujarati-new-year-family-mandir-participation", "population_scope": "BAPS families and mandirs in the bounded Gujarat lane" if en else "सीमित गुजरात-धारा के BAPS परिवार और मंदिर", "description": "BAPS names Annakut, the first aarti, and New Year greetings; Akashvani independently describes temple visits, home cleaning, rangoli, greetings, and distinct business customs across Gujarat. The app supports family or mandir participation but does not merge those settings." if en else "BAPS अन्नकूट, पहली आरती और नववर्ष शुभकामना बताता है; आकाशवाणी गुजरात में मंदिर-दर्शन, घर की सफाई, रंगोली, शुभकामना और अलग व्यापारिक रीतियाँ बताती है। ऐप परिवार या मंदिर सहभागिता देता है, इन स्थानों को मिलाता नहीं।", "source_ids": ["baps-festival-list-2026-new-year", "baps-nutan-varsh-new-year-annakut", "akashvani-gujarati-new-year-context", "devam-gujarati-new-year-safety-boundary"], "instructional": False}],
        "variants": [
            {"variant_id": "baps-home-and-mandir-forms", "scope": "BAPS family or mandir" if en else "BAPS परिवार या मंदिर", "difference": "A simple home prayer, greeting, seva, or familiar offering differs from institution-led Annakut, thal, aarti, food handling, and live programme." if en else "सरल गृह-प्रार्थना, शुभकामना, सेवा या परिचित अर्पण संस्था-नेतृत्व वाले अन्नकूट, थाल, आरती, भोजन-व्यवस्था और कार्यक्रम से अलग है।", "source_ids": ["baps-nutan-varsh-new-year-annakut", "devam-gujarati-new-year-safety-boundary"], "separate_lane_required": False},
            {"variant_id": "business-customs-not-imported", "scope": "Gujarati business New Year" if en else "गुजराती व्यापारिक नववर्ष", "difference": "Akashvani describes business-place puja and closures, but this BAPS family/mandir lane does not turn them into household requirements." if en else "आकाशवाणी व्यापार-स्थल पूजा और अवकाश का वर्णन करती है, पर यह BAPS परिवार/मंदिर मार्ग उन्हें घरेलू अनिवार्यता नहीं बनाता।", "source_ids": ["akashvani-gujarati-new-year-context"], "separate_lane_required": True},
            {"variant_id": "other-gujarati-new-year-traditions-open", "scope": "Non-BAPS Gujarati practices" if en else "गैर-BAPS गुजराती परम्पराएँ", "difference": "Other sampradaya, family, business, temple, caste-community, regional, and diaspora forms require separate sources." if en else "अन्य सम्प्रदाय, परिवार, व्यापार, मंदिर, जाति-समुदाय, क्षेत्रीय और प्रवासी रूपों के अलग स्रोत चाहिए।", "source_ids": ["akashvani-gujarati-new-year-context"], "separate_lane_required": True},
        ],
        "safety_and_boundaries": [
            "Use only prayer, greeting, seva, rangoli, or one simple suitable vegetarian offering already recognised by the family or mandir." if en else "केवल परिवार या मंदिर में परिचित प्रार्थना, शुभकामना, सेवा, रंगोली या एक सरल उपयुक्त शाकाहारी अर्पण लें।",
            "Formal Annakut, thal, aarti, mantra, large food preparation, crowd access, and prasadam handling remain with the mandir." if en else "औपचारिक अन्नकूट, थाल, आरती, मंत्र, बड़े भोजन की तैयारी, भीड़-प्रवेश और प्रसाद-व्यवस्था मंदिर के पास रहती है।",
            "No business rite, new clothes, purchase, sweets, gift, real flame, or prosperity outcome is required." if en else "व्यापार-विधि, नए वस्त्र, खरीद, मिठाई, उपहार, वास्तविक लौ या समृद्धि-फल अनिवार्य नहीं है।",
            "Bali Pratipada, Govardhana Puja, Balipadyami, and non-BAPS New Year traditions remain separate." if en else "बलि प्रतिपदा, गोवर्धन पूजा, बलिपाड्यमी और गैर-BAPS नववर्ष परम्पराएँ अलग हैं।",
        ],
    }


def gujarati_new_year() -> dict[str, Any]:
    legacy = load("gujarati-new-year-baps-family-v1.json")
    lane = "gujarati-new-year-baps-content-v1"
    pack = {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1", "lane_id": lane, "supersedes_legacy_pack_ids": [legacy["pack_id"]], "observance_slugs": [legacy["observance_slug"]],
        "applicability": {"region_codes": ["baps-gujarat"], "tradition_codes": ["swaminarayan-baps"], "institution_codes": ["baps"], "context_pairs": [{"region_code": "baps-gujarat", "tradition_code": "swaminarayan-baps"}], "settings": ["household", "temple", "community", "individual", "family_led"], "family_practice_overrides_generic_guidance": True, "material_context_questions": legacy["guides"][0]["context_prompts"]},
        "calendar": {"resolution_source_ids": ["devam-gujarati-new-year-date-fixture", "baps-festival-list-2026-new-year", "akashvani-gujarati-new-year-context"], "timing_kind": "mixed", "location_aware": True, "tradition_aware": True, "decision_rule_id": "devam-baps-gujarati-new-year-kartak-sud-one-v1", "live_schedule_required": True, "freshness_note": "The bounded Ahmedabad BAPS 2026 lane resolves Tuesday, 10 November. Recheck the BAPS mandir for live Annakut, aarti, access, and food-participation details."},
        "sources": [
            source("devam-gujarati-new-year-date-fixture", "Devam Gujarati New Year Ahmedabad BAPS 2026 date evidence fixture", "Devam", "Deterministic Ahmedabad BAPS date decision; not ritual authority", "derivative_allowed", artifact_sha256="afa7230ef7879b18a6dac1653e416db978946cc0c03c40ba7f0cefc0f54603f5", citation_coordinates={"path": "knowledge_packs/panchang/gujarati-new-year-ahmedabad-baps-2026-v1.json"}),
            source("baps-festival-list-2026-new-year", "BAPS Festival List 2026 — Annakut and Bestu Varash", "BAPS Swaminarayan Sanstha", "Official sampradaya date, first-day, and food-offering identity; not a complete liturgy", "citation_only", url="https://www.baps.org/Calendar/2026/FestivalList.aspx", observed_fetch=BAPS_LIST_FETCH),
            source("baps-nutan-varsh-new-year-annakut", "Nutan Varsh / New Year Annakut", "BAPS Swaminarayan Sanstha", "Official sampradaya Annakut, gratitude, food, thal, aarti, and greeting context; institution controls practice", "citation_only", url="https://www.baps.org/cultureandheritage/Traditions/AnnualCelebrationsandFestivals/NutanVarsh/NewYearAnnakut.aspx", observed_fetch=BAPS_ANNAKUT_FETCH),
            source("akashvani-gujarati-new-year-context", "Gujarati New Year being celebrated today", "Akashvani / News on AIR", "Official public-broadcaster Gujarat context for Bestu Varas, temple visits, rangoli, greetings, and distinct business practice", "citation_only", url="https://newsonair.gov.in/gujarati-new-year-being-celebrated-today/", observed_fetch=AIR_GUJARAT_FETCH),
            source("devam-gujarati-new-year-safety-boundary", "Devam Gujarati New Year food, flame, spending, business, and cross-tradition boundary", "Devam", "Editorial safety and scope boundary; not ritual authority", "internal_only"),
        ],
        "localized_content": localized_content(legacy, lane, {"minimum": "Short BAPS family New Year remembrance", "standard": "BAPS family-led prayer, greeting, and seva", "elaborate": "Established BAPS mandir participation only"}, ["baps-festival-list-2026-new-year", "baps-nutan-varsh-new-year-annakut", "akashvani-gujarati-new-year-context", "devam-gujarati-new-year-safety-boundary"], ["baps-nutan-varsh-new-year-annakut", "devam-gujarati-new-year-safety-boundary"], gujarati_details, procedure_adjuster=adjust_temple_elaborate),
        "product_status": status(),
    }
    assert_source_references(pack)
    return pack


def balipadyami_details(language: str) -> dict[str, Any]:
    en = language == "en"
    return {
        "significance": {"text": "In this bounded Karnataka Smarta lane, Bali Padyami remembers King Bali, generosity, righteousness, family or temple devotion, and service while preserving coastal and household variation." if en else "इस सीमित कर्नाटक स्मार्त परम्परा में बलि पाड्यमी राजा बलि, उदारता, धर्म, परिवार या मंदिर की भक्ति और सेवा का स्मरण है, साथ ही तटीय और घरेलू विविधता सुरक्षित रहती है।", "source_ids": ["karnataka-tourism-deepavali-balipratipada", "akashvani-karnataka-bali-padyami"], "scope_note": "Published descriptions of images, lamps, abhisheka, prosperity, and regional customs are descriptive, not universal instructions." if en else "प्रतिमा, दीप, अभिषेक, समृद्धि और क्षेत्रीय रीति के प्रकाशित विवरण वर्णनात्मक हैं, सार्वभौमिक निर्देश नहीं।"},
        "origin_narratives": [{"narrative_id": "karnataka-bali-vamana-return-account", "title": "King Bali's return in the Vamana account" if en else "वामन-कथा में राजा बलि की वापसी", "summary": "Akashvani Karnataka recounts the belief that Bali Chakravarty visits the earthly realm under a boon given by Vishnu in the Vamana avatar. Karnataka Tourism separately connects the day with King Bali's generosity and righteousness. Devam preserves both as attributable living festival accounts, not verified history or a single universal theology." if en else "आकाशवाणी कर्नाटक उस मान्यता का वर्णन करता है कि वामन अवतार में विष्णु के वर से बलि चक्रवर्ती पृथ्वी पर आते हैं। कर्नाटक पर्यटन दिन को राजा बलि की उदारता और धर्म से जोड़ता है। देवम दोनों को स्रोत-सम्बद्ध जीवित पर्व-कथाओं के रूप में रखता है, सत्यापित इतिहास या एक सार्वभौमिक धर्मकथा के रूप में नहीं।", "tradition_scope": "Current Karnataka official and public-broadcaster festival accounts" if en else "वर्तमान कर्नाटक आधिकारिक और सार्वजनिक-प्रसारक पर्व-वर्णन", "source_ids": ["karnataka-tourism-deepavali-balipratipada", "akashvani-karnataka-bali-padyami"], "universal_origin_claimed": False}],
        "typical_practices": [{"practice_id": "karnataka-balipadyami-family-temple-participation", "population_scope": "Karnataka families and temples represented by the current sources" if en else "वर्तमान स्रोतों में दर्शाए कर्नाटक परिवार और मंदिर", "description": "Sources describe prayers for King Bali, coastal variations, rangoli, lamps, temple abhisheka, and some household Bali representations. The app supports a material-free remembrance or a family-known form; temple rites and representation materials remain with responsible living authority." if en else "स्रोत राजा बलि की प्रार्थना, तटीय विविधता, रंगोली, दीप, मंदिर अभिषेक और कुछ घरेलू बलि-प्रतिनिधित्व बताते हैं। ऐप सामग्री-रहित स्मरण या परिवार-परिचित रूप देता है; मंदिर-विधि और प्रतिनिधित्व सामग्री जीवित प्रामाणिकता के पास रहती है।", "source_ids": ["karnataka-tourism-deepavali-balipratipada", "akashvani-karnataka-bali-padyami", "devam-balipadyami-safety-boundary"], "instructional": False}],
        "variants": [
            {"variant_id": "representation-and-material-free-forms", "scope": "Household form" if en else "घरेलू रूप", "difference": "A family-known clay or cow-dung representation is one described form; a spoken, written, floral, or material-free remembrance is the supported fallback." if en else "परिवार-परिचित मिट्टी या गोबर का प्रतिनिधित्व एक वर्णित रूप है; मौखिक, लिखित, पुष्प या सामग्री-रहित स्मरण समर्थित विकल्प है।", "source_ids": ["akashvani-karnataka-bali-padyami", "devam-balipadyami-safety-boundary"], "separate_lane_required": False},
            {"variant_id": "coastal-karnataka-forms-remain-open", "scope": "Coastal Karnataka" if en else "तटीय कर्नाटक", "difference": "Karnataka Tourism explicitly notes special coastal rituals and prayers; their detailed procedures require separate local authority." if en else "कर्नाटक पर्यटन विशेष तटीय विधि और प्रार्थना का उल्लेख करता है; उनकी विस्तृत प्रक्रिया के लिए अलग स्थानीय प्रामाणिकता चाहिए।", "source_ids": ["karnataka-tourism-deepavali-balipratipada"], "separate_lane_required": True},
            {"variant_id": "other-pratipada-traditions-separate", "scope": "Maharashtra, BAPS, Govardhana, and other South India traditions" if en else "महाराष्ट्र, BAPS, गोवर्धन और अन्य दक्षिण भारतीय परम्पराएँ", "difference": "Maharashtra Padwa, BAPS New Year, Govardhana Puja, and other regional Balipadyami forms retain their own sources and procedures." if en else "महाराष्ट्र पाडवा, BAPS नववर्ष, गोवर्धन पूजा और अन्य क्षेत्रीय बलिपाड्यमी रूप अपने स्रोत और विधियाँ रखते हैं।", "source_ids": ["devam-balipadyami-safety-boundary"], "separate_lane_required": True},
        ],
        "safety_and_boundaries": [
            "A Bali representation is optional only when already known; use no clay, cow dung, flame, or material if unfamiliar, unavailable, or unsuitable." if en else "बलि-प्रतिनिधित्व केवल परिवार में परिचित हो तो वैकल्पिक है; अपरिचित, अनुपलब्ध या अनुपयुक्त हो तो मिट्टी, गोबर, लौ या सामग्री न लें।",
            "Formal temple abhisheka, mantra, large lamp display, offerings, and live programme remain with the temple." if en else "औपचारिक मंदिर अभिषेक, मंत्र, बड़े दीप-प्रदर्शन, अर्पण और जीवंत कार्यक्रम मंदिर के पास रहते हैं।",
            "No fast, food, gift, purchase, special clothing, animal handling, donation, or prosperity outcome is required." if en else "उपवास, भोजन, उपहार, खरीद, विशेष वस्त्र, पशु-संपर्क, दान या समृद्धि-फल अनिवार्य नहीं है।",
            "Maharashtra Bali Pratipada, BAPS Gujarati New Year, and Govardhana Puja remain separate." if en else "महाराष्ट्र बलि प्रतिपदा, BAPS गुजराती नववर्ष और गोवर्धन पूजा अलग हैं।",
        ],
    }


def balipadyami() -> dict[str, Any]:
    legacy = load("balipadyami-karnataka-family-v1.json")
    lane = "balipadyami-karnataka-content-v1"
    pack = {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1", "lane_id": lane, "supersedes_legacy_pack_ids": [legacy["pack_id"]], "observance_slugs": [legacy["observance_slug"]],
        "applicability": {"region_codes": ["south-india"], "tradition_codes": ["smarta-south-india"], "context_pairs": [{"region_code": "south-india", "tradition_code": "smarta-south-india"}], "settings": ["household", "temple", "individual", "family_led"], "family_practice_overrides_generic_guidance": True, "material_context_questions": legacy["guides"][0]["context_prompts"]},
        "calendar": {"resolution_source_ids": ["devam-balipadyami-date-fixture", "karnataka-tourism-deepavali-balipratipada", "akashvani-karnataka-bali-padyami"], "timing_kind": "mixed", "location_aware": True, "tradition_aware": True, "decision_rule_id": "devam-karnataka-balipadyami-pratipada-sunrise-v1", "live_schedule_required": True, "freshness_note": "The bounded Bengaluru/Karnataka 2026 lane resolves Tuesday, 10 November. Recheck the family or temple for exact representation, prayer, abhisheka, and live programme details."},
        "sources": [
            source("devam-balipadyami-date-fixture", "Devam Balipadyami Bengaluru 2026 date evidence fixture", "Devam", "Deterministic Bengaluru date decision; not ritual authority", "derivative_allowed", artifact_sha256="2378195e40a1cd93e0a0f700e1903ecf8bedea665a711b95eaa9a27fcdb09fcc", citation_coordinates={"path": "knowledge_packs/panchang/balipadyami-bengaluru-2026-v1.json"}),
            source("karnataka-tourism-deepavali-balipratipada", "Deepavali Celebrations in Karnataka", "Karnataka Tourism", "Official regional sequence, King Bali, generosity, righteousness, and coastal-variation context; not a complete procedure", "citation_only", url="https://karnatakatourism.org/en/blogs/deepavali-celebrations-in-karnataka-a-festival-of-lights-and-joy", observed_fetch=KARNATAKA_TOURISM_FETCH),
            source("akashvani-karnataka-bali-padyami", "Karnataka celebrates Bali Padyami festival", "Akashvani / News on AIR", "Official public-broadcaster identity, Vamana-Bali account, and descriptive household/temple context; not universal instruction", "citation_only", url="https://www.newsonair.gov.in/karnataka-celebrates-bali-padyami-festival/", observed_fetch=AIR_KARNATAKA_FETCH),
            source("devam-balipadyami-safety-boundary", "Devam Balipadyami material, flame, temple, animal, and cross-tradition boundary", "Devam", "Editorial safety and scope boundary; not scripture or ritual authority", "internal_only"),
        ],
        "localized_content": localized_content(legacy, lane, {"minimum": "Short material-free Karnataka King Bali remembrance", "standard": "Karnataka family-led familiar form", "elaborate": "Established family- or temple-led Karnataka participation"}, ["karnataka-tourism-deepavali-balipratipada", "akashvani-karnataka-bali-padyami", "devam-balipadyami-safety-boundary"], ["devam-balipadyami-safety-boundary"], balipadyami_details, source_map={"iskcon-bangalore-public-calendar-2026-balipadyami": "devam-balipadyami-date-fixture"}),
        "product_status": status(),
    }
    assert_source_references(pack)
    return pack


def main() -> int:
    outputs = {
        "bengal-kali-puja-participant-content-v1.json": bengal_kali_puja(),
        "gujarati-new-year-baps-content-v1.json": gujarati_new_year(),
        "balipadyami-karnataka-content-v1.json": balipadyami(),
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

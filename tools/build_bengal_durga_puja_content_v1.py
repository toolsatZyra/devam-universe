#!/usr/bin/env python3
"""Build the shared-contract Bengal Durga Puja participant campaign lane."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "knowledge_packs" / "rituals" / "bengal-durga-puja-participation-v1.json"
CAMPAIGN = ROOT / "knowledge_packs" / "campaigns" / "durga-puja-kolkata-2026-v1.json"
OUTPUT = ROOT / "knowledge_packs" / "rituals" / "bengal-durga-puja-participant-content-v1.json"
SOURCE_SHA256 = "78b96891f2197405086ac3c3a1b50e68a6fbb83c129794a6ae0c8fc13b0ab396"
CAMPAIGN_SHA256 = "c8bec184a2de4f245b1354e386daaa0fbdb9113dbc3b35e53fc335dd99b7204a"


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def convert_procedures(guide: dict) -> list[dict]:
    language = guide["language_code"]
    settings = {"minimum": "individual", "standard": "individual", "elaborate": "community_participation"}
    forms = {"minimum": "accessible_short", "standard": "accessible_short", "elaborate": "institutional_participation"}
    authority = {
        "en": {
            "minimum": "Bengal Shakta participant or visitor remembrance; local family, temple, or puja committee remains authoritative",
            "standard": "Source-labelled home reflection or visitor preparation; this is not ritual installation or priestly Puja",
            "elaborate": "Participation in an established family, temple, bonedi bari, or community programme under its responsible authority",
        },
        "hi": {
            "minimum": "बंगाल शाक्त सहभागी या आगन्तुक-स्मरण; स्थानीय परिवार, मन्दिर या पूजा-समिति ही प्रामाणिक अधिकारी है",
            "standard": "स्रोत-पहचानयुक्त गृह-चिंतन या यात्रा-तैयारी; यह अनुष्ठानिक स्थापना या पुरोहित-पूजा नहीं है",
            "elaborate": "जिम्मेदार अधिकारी के अधीन स्थापित परिवार, मन्दिर, बोनेदी बाड़ी या सामुदायिक कार्यक्रम में सहभागिता",
        },
    }
    material_sources = {
        "minimum": ["belur-math-durga-puja-institutional-context", "devam-bengal-durga-puja-safety-boundary"],
        "standard": ["incredible-india-durga-puja-2026", "belur-math-durga-puja-institutional-context"],
        "elaborate": ["belur-math-durga-puja-institutional-context", "west-bengal-aasan-durga-puja-context", "devam-bengal-durga-puja-safety-boundary"],
    }
    closing = {
        "en": "Close with gratitude to Devi and to the family, artisans, organisers, workers, and community; follow the responsible authority for every formal close and live operation.",
        "hi": "देवी तथा परिवार, कलाकारों, आयोजकों, श्रमिकों और समुदाय के प्रति कृतज्ञता से समापन करें; हर औपचारिक समापन और लाइव व्यवस्था के लिए जिम्मेदार अधिकारी का निर्देश मानें।",
    }
    procedures = []
    for tier in guide["tiers"]:
        step_refs = sorted({source_id for step in tier["steps"] for source_id in step["source_ids"]})
        procedures.append(
            {
                "procedure_id": f"bengal-durga-puja-participant-{language}-{tier['tier']}-v1",
                "label": tier["label"],
                "tier": tier["tier"],
                "setting": settings[tier["tier"]],
                "authority_scope": authority[language][tier["tier"]],
                "form": forms[tier["tier"]],
                "estimated_minutes": tier["estimated_minutes"],
                "materials": [
                    {
                        "item": material["item"],
                        "required": not material["optional"],
                        "substitutions": material["substitutions"],
                        "source_ids": material_sources[tier["tier"]],
                    }
                    for material in tier["materials"]
                ],
                "steps": [
                    {
                        "ordinal": step["ordinal"],
                        "instruction": step["instruction"],
                        "why": step["why"],
                        "source_ids": step["source_ids"],
                        "optional": step["optional"],
                    }
                    for step in tier["steps"]
                ],
                "closing": {"text": closing[language], "source_ids": ["belur-math-durga-puja-institutional-context", "devam-bengal-durga-puja-safety-boundary"], "scope_note": "Formal Puja and live programme closure remain with the responsible local authority." if language == "en" else "औपचारिक पूजा और लाइव कार्यक्रम का समापन जिम्मेदार स्थानीय अधिकारी के अधीन रहता है।"},
                "source_ids": step_refs,
            }
        )
    return procedures


def daily_sequence(language: str, campaign: dict) -> list[dict]:
    hindi_names = {
        "Bilva Nimantran": "बिल्व निमन्त्रण",
        "Kalparambha and Maha Shashthi": "कल्पारम्भ और महाषष्ठी",
        "Maha Saptami": "महासप्तमी",
        "Maha Ashtami": "महाअष्टमी",
        "Maha Navami": "महानवमी",
        "Vijayadashami and Bengal Durga Visarjan": "विजयादशमी और बंगाल दुर्गा विसर्जन",
    }
    english_reflections = [
        "Orient yourself to the exact local calendar and programme; the Panchami and practitioner day-one labels differ.",
        "Notice the opening and invitation themes, while leaving Bodhan, Amantran, Adhivas, and installation to the responsible authority.",
        "Honour the devotional, artistic, and community labour of the Puja; follow local directions for any programme.",
        "Remember Durga and participate under local guidance; Kumari and Sandhi Puja remain priest- or institution-led rites.",
        "Reflect on courage and care, without treating homa, balidan, or early visarjan labels as app instructions.",
        "Offer gratitude and farewell; do not enter water or join an immersion operation except under current local authority and safety rules.",
    ]
    hindi_reflections = [
        "ठीक स्थानीय कैलेंडर और कार्यक्रम पहचानें; पंचमी और साधक-कैलेंडर के प्रथम-दिन के नाम अलग हैं।",
        "आरम्भ और निमन्त्रण के भाव को समझें; बोधन, आमन्त्रण, अधिवास और स्थापना जिम्मेदार अधिकारी पर छोड़ें।",
        "पूजा के भक्तिभाव, कला और सामुदायिक श्रम का सम्मान करें; किसी कार्यक्रम में स्थानीय निर्देश मानें।",
        "दुर्गा का स्मरण करें और स्थानीय मार्गदर्शन में भाग लें; कुमारी और सन्धि पूजा पुरोहित या संस्था-नेतृत्व वाली विधियाँ हैं।",
        "साहस और देखभाल पर मनन करें; होम, बलिदान या शीघ्र विसर्जन के नामों को ऐप-निर्देश न मानें।",
        "कृतज्ञता और विदाई रखें; वर्तमान स्थानीय अधिकारी और सुरक्षा-नियम के बिना जल या विसर्जन-कार्य में प्रवेश न करें।",
    ]
    reflections = english_reflections if language == "en" else hindi_reflections
    return [
        {
            "ordinal": day["ordinal"],
            "common_name": day["common_name"] if language == "en" else hindi_names[day["common_name"]],
            "reflection": reflections[index],
            "ritual_requirement": False,
            "source_ids": ["devam-bengal-durga-puja-campaign-fixture", "drikpanchang-kolkata-durga-puja-2026"],
            "calendar_status": "partially_resolved_distinct_lanes" if day.get("label_divergence") else "resolved_for_bounded_2026_context",
            "calendar_note": day.get("label_divergence", "The exact live programme and ritual leader remain local-authority questions."),
        }
        for index, day in enumerate(campaign["days"])
    ]


def localized_content(guide: dict, campaign: dict) -> dict:
    language = guide["language_code"]
    if language == "en":
        significance = {
            "text": "Bengal Durga Puja is a devotional, artistic, and community festival centred on Devi Durga. The bounded participant lane follows the six-day Kolkata/Bengal 2026 sequence while keeping family, bonedi bari, temple, Ramakrishna, community-pandal, and visitor contexts distinct.",
            "source_ids": ["incredible-india-durga-puja-2026", "west-bengal-aasan-durga-puja-context", "devam-bengal-durga-puja-campaign-fixture"],
            "scope_note": "This explains safe remembrance and participation; it does not reconstruct household consecration or priest-led Durga Puja.",
        }
        narratives = [
            {
                "narrative_id": "durga-mahishasura-bengal-festival-account",
                "title": "Durga's victory over Mahishasura",
                "summary": "The current national and West Bengal sources connect the festival with Durga's victory over Mahishasura. Devam keeps that public account beside the edition-identified Devimahatmya boundary in Pargiter's 1904 Markandeya Purana translation rather than presenting one retelling as every community's only meaning.",
                "tradition_scope": "Current Bengal public-festival accounts and one identified English Devimahatmya expression",
                "source_ids": ["incredible-india-durga-puja-2026", "west-bengal-aasan-durga-puja-context", "markandeya-purana-pargiter-1904-devimahatmya"],
                "universal_origin_claimed": False,
            },
            {
                "narrative_id": "akal-bodhan-rama-krittivasi-account",
                "title": "Rama and the untimely awakening of Durga",
                "summary": "Belur Math explains the autumnal Bodhan through an account in the Bengali Krittivasi Ramayana: Rama awakens and worships Durga before the battle with Ravana. The page also notes other Puranic accounts. Devam preserves this as an institution-attributed Bengali narrative, not the universal textual origin of Durga Puja.",
                "tradition_scope": "Belur Math's account of a Bengali Krittivasi Ramayana tradition, with acknowledged alternative accounts",
                "source_ids": ["belur-math-durga-puja-institutional-context"],
                "universal_origin_claimed": False,
            },
            {
                "narrative_id": "belur-math-1901-institutional-history",
                "title": "Durga Puja at Belur Math from 1901",
                "summary": "Belur Math records that its Durga Puja was first celebrated in 1901 and describes the circumstances and intentions of that institution's observance. This is one modern institutional history, not the beginning of Durga worship or every Bengali Puja.",
                "tradition_scope": "Ramakrishna Math institutional history",
                "source_ids": ["belur-math-durga-puja-institutional-context"],
                "universal_origin_claimed": False,
            },
        ]
        practices = [
            {
                "practice_id": "bengal-public-pandal-devotion-art-community",
                "population_scope": "Public/community Durga Puja in West Bengal as represented by current official sources",
                "description": "Temporary pandals, images, artistry, dhaak, community gathering, devotion, food and cultural programmes form a public festival world. Operations and access remain with current organisers and authorities.",
                "source_ids": ["incredible-india-durga-puja-2026", "west-bengal-aasan-durga-puja-context"],
                "instructional": False,
            },
            {
                "practice_id": "belur-math-led-ritual-sequence",
                "population_scope": "Ramakrishna Math and Belur Math institutional context",
                "description": "Belur Math describes an authority-led sequence including Chandi recitation, Bodhan, Kumari Puja, Sandhi Puja, offerings, and conclusion. Its detail demonstrates why a participant guide must not turn institutional liturgy into a universal home procedure.",
                "source_ids": ["belur-math-durga-puja-institutional-context"],
                "instructional": False,
            },
        ]
        variants = [
            {"variant_id": "family-bonedi-temple-pandal-visitor", "scope": "Setting and authority", "difference": "Family puja, bonedi bari, temple, institutional, community-pandal, and visitor contexts have different leaders, access, offerings, dress, food, and closing rules; ask which setting applies.", "source_ids": ["incredible-india-durga-puja-2026", "belur-math-durga-puja-institutional-context"], "separate_lane_required": True},
            {"variant_id": "calendar-label-divergence", "scope": "2026 civil date and festival label", "difference": "The frozen campaign preserves Panchami versus practitioner day-one labels and Navami/early-visarjan overlaps rather than silently forcing one label set.", "source_ids": ["devam-bengal-durga-puja-campaign-fixture", "drikpanchang-kolkata-durga-puja-2026"], "separate_lane_required": False},
            {"variant_id": "participant-versus-led-ritual", "scope": "Actionable role", "difference": "Remembrance, learning, respectful attendance, and service are participant actions; Bodhan, Navapatrika, consecration, anjali leadership, Kumari Puja, Sandhi Puja, homa, bali, and visarjan operations stay with responsible authorities.", "source_ids": ["belur-math-durga-puja-institutional-context", "devam-bengal-durga-puja-safety-boundary"], "separate_lane_required": True},
            {"variant_id": "sindoor-khela-participation", "scope": "Marital-status and local custom", "difference": "Current public sources describe Sindoor Khela as a married-women's custom; the app neither requires it nor generalizes participation beyond the local programme's rules.", "source_ids": ["west-bengal-aasan-durga-puja-context", "devam-bengal-durga-puja-safety-boundary"], "separate_lane_required": True},
        ]
        safety = [
            "Follow the current family, temple, bonedi bari, puja committee, venue, police, transport, food, accessibility, and crowd directions.",
            "Do not perform Bodhan, Navapatrika, consecration, Kumari Puja, Sandhi Puja, homa, bali, priestly offerings, or immersion operations from this participant guide.",
            "Never pressure a child or another person to become a ritual subject; use only the responsible institution's safeguarding process.",
            "Do not enter water, handle an image, join a procession, light a flame, fast, or consume unfamiliar prasad without appropriate current safety and personal-health judgment.",
            "The six daily reflections are orientation aids, not mandatory rites or guaranteed spiritual outcomes.",
            "North/West Navaratri, Gujarati Garba, South Indian Kolu/Golu, Nepal Dashain, and other Durga worlds remain separate.",
        ]
    else:
        significance = {
            "text": "बंगाल दुर्गा पूजा देवी दुर्गा पर केन्द्रित भक्तिपूर्ण, कलात्मक और सामुदायिक पर्व है। सीमित सहभागी-रूप कोलकाता/बंगाल के 2026 के छह दिनों का अनुसरण करता है और परिवार, बोनेदी बाड़ी, मन्दिर, रामकृष्ण, सामुदायिक पंडाल तथा आगन्तुक संदर्भ अलग रखता है।",
            "source_ids": ["incredible-india-durga-puja-2026", "west-bengal-aasan-durga-puja-context", "devam-bengal-durga-puja-campaign-fixture"],
            "scope_note": "यह सुरक्षित स्मरण और सहभागिता बताता है; गृह-प्रतिष्ठा या पुरोहित-नेतृत्व वाली दुर्गा पूजा पुनर्निर्मित नहीं करता।",
        }
        narratives = [
            {"narrative_id": "durga-mahishasura-bengal-festival-account", "title": "दुर्गा की महिषासुर पर विजय", "summary": "वर्तमान राष्ट्रीय और पश्चिम बंगाल स्रोत पर्व को दुर्गा की महिषासुर पर विजय से जोड़ते हैं। देवम् इस सार्वजनिक विवरण को पार्जिटर के 1904 मार्कण्डेय पुराण अनुवाद में संस्करण-पहचानयुक्त देवीमाहात्म्य-सीमा के साथ रखता है और इसे हर समुदाय का एकमात्र अर्थ नहीं बनाता।", "tradition_scope": "वर्तमान बंगाल सार्वजनिक-पर्व विवरण और देवीमाहात्म्य की एक पहचानी अंग्रेज़ी अभिव्यक्ति", "source_ids": ["incredible-india-durga-puja-2026", "west-bengal-aasan-durga-puja-context", "markandeya-purana-pargiter-1904-devimahatmya"], "universal_origin_claimed": False},
            {"narrative_id": "akal-bodhan-rama-krittivasi-account", "title": "राम और दुर्गा का अकाल बोधन", "summary": "बेलूर मठ शरद-बोधन को बंगाली कृत्तिवासी रामायण की कथा से समझाता है: रावण से युद्ध से पहले राम दुर्गा को जगाकर पूजते हैं। पृष्ठ अन्य पौराणिक विवरण भी मानता है। देवम् इसे संस्था-श्रेययुक्त बंगाली कथा रखता है, दुर्गा पूजा की सार्वभौमिक ग्रन्थीय उत्पत्ति नहीं।", "tradition_scope": "वैकल्पिक विवरणों की स्वीकृति सहित बंगाली कृत्तिवासी रामायण पर बेलूर मठ का विवरण", "source_ids": ["belur-math-durga-puja-institutional-context"], "universal_origin_claimed": False},
            {"narrative_id": "belur-math-1901-institutional-history", "title": "1901 से बेलूर मठ की दुर्गा पूजा", "summary": "बेलूर मठ लिखता है कि वहाँ दुर्गा पूजा पहली बार 1901 में हुई और उस संस्था के अनुष्ठान की परिस्थितियाँ तथा उद्देश्य बताता है। यह एक आधुनिक संस्थागत इतिहास है, दुर्गा-उपासना या हर बंगाली पूजा की शुरुआत नहीं।", "tradition_scope": "रामकृष्ण मठ का संस्थागत इतिहास", "source_ids": ["belur-math-durga-puja-institutional-context"], "universal_origin_claimed": False},
        ]
        practices = [
            {"practice_id": "bengal-public-pandal-devotion-art-community", "population_scope": "वर्तमान आधिकारिक स्रोतों में वर्णित पश्चिम बंगाल की सार्वजनिक/सामुदायिक दुर्गा पूजा", "description": "अस्थायी पंडाल, प्रतिमा, कला, ढाक, समुदाय, भक्ति, भोजन और सांस्कृतिक कार्यक्रम सार्वजनिक पर्व-जगत बनाते हैं। संचालन और प्रवेश वर्तमान आयोजकों व अधिकारियों के अधीन हैं।", "source_ids": ["incredible-india-durga-puja-2026", "west-bengal-aasan-durga-puja-context"], "instructional": False},
            {"practice_id": "belur-math-led-ritual-sequence", "population_scope": "रामकृष्ण मठ और बेलूर मठ का संस्थागत संदर्भ", "description": "बेलूर मठ चण्डी-पाठ, बोधन, कुमारी पूजा, सन्धि पूजा, अर्पण और समापन सहित अधिकारी-नेतृत्व वाला क्रम बताता है। यह विस्तार दिखाता है कि सहभागी मार्गदर्शिका संस्थागत विधान को सार्वभौमिक गृह-विधि क्यों नहीं बना सकती।", "source_ids": ["belur-math-durga-puja-institutional-context"], "instructional": False},
        ]
        variants = [
            {"variant_id": "family-bonedi-temple-pandal-visitor", "scope": "स्थान और अधिकार", "difference": "पारिवारिक पूजा, बोनेदी बाड़ी, मन्दिर, संस्था, सामुदायिक पंडाल और आगन्तुक संदर्भों में नेता, प्रवेश, अर्पण, वेश, भोजन और समापन अलग हैं; पहले लागू संदर्भ पूछें।", "source_ids": ["incredible-india-durga-puja-2026", "belur-math-durga-puja-institutional-context"], "separate_lane_required": True},
            {"variant_id": "calendar-label-divergence", "scope": "2026 नागरिक तिथि और पर्व-नाम", "difference": "स्थिर अभियान पंचमी बनाम साधक-कैलेंडर प्रथम-दिन और नवमी/शीघ्र-विसर्जन के अतिव्यापन को चुपचाप एक नाम में नहीं मिलाता।", "source_ids": ["devam-bengal-durga-puja-campaign-fixture", "drikpanchang-kolkata-durga-puja-2026"], "separate_lane_required": False},
            {"variant_id": "participant-versus-led-ritual", "scope": "सहभागी भूमिका", "difference": "स्मरण, सीखना, सम्मानपूर्ण उपस्थिति और सेवा सहभागी कार्य हैं; बोधन, नवपत्रिका, प्रतिष्ठा, अंजलि-नेतृत्व, कुमारी पूजा, सन्धि पूजा, होम, बलि और विसर्जन-संचालन जिम्मेदार अधिकारियों के अधीन हैं।", "source_ids": ["belur-math-durga-puja-institutional-context", "devam-bengal-durga-puja-safety-boundary"], "separate_lane_required": True},
            {"variant_id": "sindoor-khela-participation", "scope": "वैवाहिक स्थिति और स्थानीय रीति", "difference": "वर्तमान सार्वजनिक स्रोत सिन्दूर खेला को विवाहित महिलाओं की रीति बताते हैं; ऐप न इसे अनिवार्य करता है, न स्थानीय कार्यक्रम से बाहर सहभागिता सामान्य बनाता है।", "source_ids": ["west-bengal-aasan-durga-puja-context", "devam-bengal-durga-puja-safety-boundary"], "separate_lane_required": True},
        ]
        safety = [
            "वर्तमान परिवार, मन्दिर, बोनेदी बाड़ी, पूजा-समिति, स्थल, पुलिस, यातायात, भोजन, सुगमता और भीड़-निर्देश मानें।",
            "इस सहभागी मार्गदर्शिका से बोधन, नवपत्रिका, प्रतिष्ठा, कुमारी पूजा, सन्धि पूजा, होम, बलि, पुरोहित-अर्पण या विसर्जन-संचालन न करें।",
            "किसी बच्चे या व्यक्ति पर अनुष्ठानिक विषय बनने का दबाव न डालें; जिम्मेदार संस्था की सुरक्षा-प्रक्रिया ही अपनाएँ।",
            "वर्तमान सुरक्षा और निजी स्वास्थ्य-विवेक के बिना जल में प्रवेश, प्रतिमा-स्पर्श, जुलूस, दीप, उपवास या अपरिचित प्रसाद न लें।",
            "छह दैनिक चिंतन परिचय-सहायक हैं, अनिवार्य कर्म या निश्चित आध्यात्मिक फल नहीं।",
            "उत्तर/पश्चिम नवरात्रि, गुजरात गरबा, दक्षिण भारत कोलू/गोलू, नेपाल दशैं और अन्य दुर्गा-जगत अलग हैं।",
        ]
    return {
        "language_code": language,
        "title": guide["title"],
        "short_answer": guide["summary"],
        "significance": significance,
        "origin_narratives": narratives,
        "typical_practices": practices,
        "procedures": convert_procedures(guide),
        "variants": variants,
        "daily_sequence": daily_sequence(language, campaign),
        "safety_and_boundaries": safety,
    }


def build() -> dict:
    source_bytes = SOURCE.read_bytes()
    campaign_bytes = CAMPAIGN.read_bytes()
    if sha256(source_bytes) != SOURCE_SHA256 or sha256(campaign_bytes) != CAMPAIGN_SHA256:
        raise RuntimeError("Bengal Durga Puja input drift")
    legacy = json.loads(source_bytes.decode("utf-8"))
    campaign = json.loads(campaign_bytes.decode("utf-8"))
    if legacy.get("pack_id") != "devam-bengal-durga-puja-participation-v1" or campaign.get("campaign_id") != "durga-puja-2026-bengal-shakta":
        raise RuntimeError("Bengal Durga Puja identity drift")
    sources = [
        {"source_id": "devam-bengal-durga-puja-campaign-fixture", "title": "Bounded Kolkata/Bengal Durga Puja 2026 campaign fixture", "publisher": "Devam", "source_role": "Deterministic six-date Kolkata/Bengal campaign with preserved label divergences; not ritual authority", "rights_lane": "internal_only", "url": None, "artifact_sha256": CAMPAIGN_SHA256, "citation_coordinates": {"artifact_path": "knowledge_packs/campaigns/durga-puja-kolkata-2026-v1.json"}},
        {"source_id": "incredible-india-durga-puja-2026", "title": "Durga Puja: An incomparable celebration of devotion and art", "publisher": "Incredible India, Ministry of Tourism, Government of India", "source_role": "Current official devotional, Mahishasura, art, community, and Kolkata festival context", "rights_lane": "citation_only", "url": "https://www.incredibleindia.gov.in/en/festivals-and-events/durga-puja", "artifact_sha256": None, "citation_coordinates": None, "observed_fetch": {"status": 200, "final_url": "https://www.incredibleindia.gov.in/en/festivals-and-events/durga-puja", "response_bytes": 512560, "response_sha256": "bf370460363d541e1a6eaf98073a38555cdcfb398a930caeaae1a66072a06237", "strict_utf8": True, "observed_at": "2026-08-07"}},
        {"source_id": "west-bengal-aasan-durga-puja-context", "title": "AASAN Puja Permission Portal", "publisher": "Government of West Bengal", "source_role": "Current official state context for community, artistry, pandals, unity, dhaak, Sindoor Khela, and organiser authority; displayed 2025 dates are not used for 2026 resolution", "rights_lane": "citation_only", "url": "https://aasan.wb.gov.in/SiteController/", "artifact_sha256": None, "citation_coordinates": None, "observed_fetch": {"status": 200, "final_url": "https://aasan.wb.gov.in/SiteController/", "response_bytes": 33712, "response_sha256": "a4e79a8e61ba128d065de1a677c403329424416c87940ba9b198b334442f02d1", "strict_utf8": True, "observed_at": "2026-08-07"}},
        {"source_id": "belur-math-durga-puja-institutional-context", "title": "Durga Puja at Belur Math", "publisher": "Ramakrishna Math and Ramakrishna Mission, Belur Math", "source_role": "Official institutional history, Rama-Bodhan narrative, meaning, and led ritual sequence; not universal household procedure", "rights_lane": "citation_only", "url": "https://belurmath.org/durga-puja-at-belur-math/", "artifact_sha256": None, "citation_coordinates": None, "observed_fetch": {"status": 200, "final_url": "https://belurmath.org/durga-puja-at-belur-math/", "response_bytes": 180057, "response_sha256": "c171509ad40b19aa9302a98937ecf65a35f69074ec3b82624e0e69257e928780", "strict_utf8": True, "observed_at": "2026-08-07"}},
        {"source_id": "drikpanchang-kolkata-durga-puja-2026", "title": "2026 Durga Puja Calendar for Kolkata", "publisher": "Drik Panchang", "source_role": "Current Kolkata six-day date and event-label evidence; practitioner reference, not priestly or universal authority", "rights_lane": "citation_only", "url": "https://www.drikpanchang.com/navratri/durga-puja/durga-puja-calendar.html?geoname-id=1275004&year=2026", "artifact_sha256": None, "citation_coordinates": None, "observed_fetch": {"status": 200, "final_url": "https://www.drikpanchang.com/navratri/durga-puja/durga-puja-calendar.html?geoname-id=1275004&year=2026", "response_bytes": 88076, "response_sha256": "c4da3040551ca051f98c961c043ac3381bcf5127e96491052d85445b0d3bf4c1", "strict_utf8": True, "observed_at": "2026-08-07"}},
        {"source_id": "markandeya-purana-pargiter-1904-devimahatmya", "title": "The Markandeya Purana — Pargiter translation, Calcutta 1904", "publisher": "The Asiatic Society; retained by Devam", "source_role": "Complete fixed edition boundary for the Devimahatmya narrative in one historical English translation; provider OCR remains quarantined", "rights_lane": "derivative_allowed", "url": "https://archive.org/details/in.ernet.dli.2015.47519", "artifact_sha256": "f7023e3aa0127b9a093b88664c68374da72d469e4f790c4a7bd4606a392e7300", "citation_coordinates": {"context_pdf_pages": [509, 566], "proper_pdf_pages": [516, 564], "ingestion_plan": "ingestion/plans/markandeya-purana-pargiter-1904-v1.json", "ingestion_plan_sha256": "fe1102e0624286cf2676da7249b52e7bca69f3310ba6008b82312b1fc04c9773"}},
        {"source_id": "devam-bengal-durga-puja-safety-boundary", "title": "Devam Bengal Durga Puja participant-safety and authority boundary", "publisher": "Devam", "source_role": "Editorial product-safety and authority policy; not scripture, tradition evidence, or ritual authority", "rights_lane": "internal_only", "url": None, "artifact_sha256": None, "citation_coordinates": None},
    ]
    return {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1",
        "lane_id": "bengal-durga-puja-participant-content-v1",
        "supersedes_legacy_pack_ids": ["devam-bengal-durga-puja-participation-v1"],
        "observance_slugs": ["bengal-durga-puja-campaign"],
        "applicability": {
            "region_codes": ["bengal"],
            "tradition_codes": ["shakta-bengal"],
            "context_pairs": [{"region_code": "bengal", "tradition_code": "shakta-bengal"}],
            "settings": ["individual", "family_led", "temple", "community"],
            "family_practice_overrides_generic_guidance": True,
            "material_context_questions": legacy["guides"][0]["context_prompts"],
        },
        "calendar": {
            "resolution_source_ids": ["devam-bengal-durga-puja-campaign-fixture", "drikpanchang-kolkata-durga-puja-2026"],
            "timing_kind": "institutional_schedule",
            "location_aware": True,
            "tradition_aware": True,
            "decision_rule_id": None,
            "live_schedule_required": True,
            "freshness_note": "The bounded Kolkata/Bengal 2026 campaign runs 16-21 October with preserved label divergences. Confirm every live venue, access, ritual, food, transport, crowd, and safety detail with the responsible current authority.",
        },
        "sources": sources,
        "localized_content": [localized_content(guide, campaign) for guide in legacy["guides"]],
        "product_status": {"classification": "user_complete_lane", "completed_dimensions": {"applicability": True, "timing": True, "significance": True, "origin_narratives": True, "typical_practice": True, "actionable_vidhi": True, "materials_and_substitutions": True, "variants": True, "evidence": True}, "open_gaps": [], "review_status": "internal_beta_reviewed"},
    }


def main() -> None:
    payload = json.dumps(build(), ensure_ascii=False, indent=2, sort_keys=True).encode("utf-8") + b"\n"
    OUTPUT.write_bytes(payload)
    print(json.dumps({"path": str(OUTPUT.relative_to(ROOT)), "bytes": len(payload), "sha256": sha256(payload)}, sort_keys=True))


if __name__ == "__main__":
    main()

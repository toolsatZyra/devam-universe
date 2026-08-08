#!/usr/bin/env python3
"""Build the shared-contract North/West India Shardiya Navaratri household lane."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "knowledge_packs" / "rituals" / "shardiya-navaratri-north-west-india-v1.json"
OUTPUT = ROOT / "knowledge_packs" / "rituals" / "shardiya-navaratri-north-west-india-content-v1.json"
SOURCE_SHA256 = "d25a2d4d1d16fe56e119ff78ad03d6d825ef09c5a40611c03e411ddb995fcbb9"


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def verified_refs(source_ids: list[str]) -> list[str]:
    replacements = {
        "devam-devi-bhagavatam-vijnanananda-navaratri": "devi-bhagavatam-vijnanananda-navaratri-pages-178-197",
        "devam-markandeya-purana-pargiter-devimahatmya": "markandeya-purana-pargiter-1904-devimahatmya",
    }
    return list(dict.fromkeys(replacements.get(source_id, source_id) for source_id in source_ids))


def convert_procedures(guide: dict) -> list[dict]:
    language = guide["language_code"]
    settings = {"minimum": "individual", "standard": "household", "elaborate": "teacher_led"}
    forms = {"minimum": "accessible_short", "standard": "traditional_household", "elaborate": "fuller_family_or_teacher_led"}
    authority = {
        "en": {
            "minimum": "North/West India Smarta household or individual; familiar family practice takes priority",
            "standard": "North/West India Smarta household Ghatasthapana lane when it is already part of family practice",
            "elaborate": "Family-text or competent practitioner-led form; Devam does not generate priestly liturgy",
        },
        "hi": {
            "minimum": "उत्तर/पश्चिम भारत का स्मार्त गृह या व्यक्ति; परिचित पारिवारिक परम्परा को प्राथमिकता है",
            "standard": "उत्तर/पश्चिम भारत का स्मार्त गृह-घटस्थापना रूप, जब वह पहले से पारिवारिक परम्परा हो",
            "elaborate": "पारिवारिक ग्रन्थ या सक्षम जानकार द्वारा निर्देशित रूप; देवम् पुरोहित-विधान नहीं गढ़ता",
        },
    }
    closing = {
        "en": "Close the daily prayer with the family prayer or arati you know, share safe offerings appropriately, and extinguish every ordinary flame before it is unattended.",
        "hi": "दैनिक प्रार्थना का समापन परिचित पारिवारिक प्रार्थना या आरती से करें, सुरक्षित अर्पण उचित रूप से बाँटें और बिना देखरेख छोड़ने से पहले हर सामान्य लौ बुझा दें।",
    }
    material_sources = {
        "minimum": ["maharashtra-tourism-ghatasthapana-2026", "incredible-india-navratri-2026"],
        "standard": ["maharashtra-tourism-ghatasthapana-2026", "drikpanchang-kalasha-sthapana-2026"],
        "elaborate": ["drikpanchang-kalasha-sthapana-2026", "art-of-living-durga-saptashati-2026"],
    }
    procedures = []
    for tier in guide["tiers"]:
        procedure_source_ids = sorted({source_id for step in tier["steps"] for source_id in verified_refs(step["source_ids"])})
        procedures.append(
            {
                "procedure_id": f"shardiya-navaratri-north-west-india-{language}-{tier['tier']}-v1",
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
                        "source_ids": verified_refs(step["source_ids"]),
                        "optional": step["optional"],
                    }
                    for step in tier["steps"]
                ],
                "closing": {
                    "text": closing[language],
                    "source_ids": ["maharashtra-tourism-ghatasthapana-2026"],
                    "scope_note": "The exact daily and terminal close follows established family practice." if language == "en" else "दैनिक और अन्तिम समापन का ठीक रूप स्थापित पारिवारिक परम्परा के अनुसार होगा।",
                },
                "source_ids": procedure_source_ids,
            }
        )
    return procedures


def localized_content(guide: dict) -> dict:
    language = guide["language_code"]
    if language == "en":
        significance = {
            "text": "Shardiya Navaratri is a nine-night period of worship and reflection centred on Devi. The bounded North/West India lane begins with Ashvina Shukla Pratipada; some households establish a ghata or kalasha and maintain it through the observance, while a sustainable daily prayer is complete in its own stated scope.",
            "source_ids": ["incredible-india-navratri-2026", "maharashtra-tourism-ghatasthapana-2026", "nirnayasindhu-marathi-1865-pages-178-207"],
            "scope_note": "This is one North/West India Smarta household lane, not a universal Navaratri procedure or a substitute for family practice.",
        }
        narratives = [
            {
                "narrative_id": "devimahatmya-mahishasura-account",
                "title": "Durga and Mahishasura",
                "summary": "The current Incredible India account connects Navaratri with Durga's victory over Mahishasura. Devam keeps that familiar festival account beside the edition-identified Devimahatmya boundary in Pargiter's 1904 Markandeya Purana translation; it does not turn one telling into the only origin of every Navaratri tradition.",
                "tradition_scope": "Current national festival account and one identified English Devimahatmya expression",
                "source_ids": ["incredible-india-navratri-2026", "markandeya-purana-pargiter-1904-devimahatmya"],
                "universal_origin_claimed": False,
            },
            {
                "narrative_id": "devi-bhagavatam-rama-navaratri-account",
                "title": "Rama's Navaratri observance",
                "summary": "The Vijnanananda English expression of the Devi Bhagavatam preserves a chapter in which Narada explains the Navaratra ceremony and Rama performs it. This is an attributable Shakta Puranic account and a bridge to the Ramayana world, not a claim that every household derives its practice from this episode.",
                "tradition_scope": "One identified Vijnanananda English expression of a Shakta Puranic account",
                "source_ids": ["devi-bhagavatam-vijnanananda-navaratri-pages-178-197"],
                "universal_origin_claimed": False,
            },
        ]
        practices = [
            {
                "practice_id": "north-west-household-ghatasthapana",
                "population_scope": "North/West India households that already practise Ghatasthapana",
                "description": "A clean place is prepared, barley is sown in soil, and a water-filled kalasha is established as a focus for daily care. The setup creates a multi-day responsibility and is optional where it is not the family's practice.",
                "source_ids": ["maharashtra-tourism-ghatasthapana-2026", "drikpanchang-kalasha-sthapana-2026"],
                "instructional": False,
            },
            {
                "practice_id": "devi-prayer-and-source-identified-reading",
                "population_scope": "Households choosing prayer, familiar arati, or an edition-identified Devi reading",
                "description": "Daily worship may use a familiar Devi prayer, name, arati, or source-identified reading. Durga Saptashati has multiple recitation frames, including division of its thirteen chapters across Navaratri; the app summary is never the recitation itself.",
                "source_ids": ["incredible-india-navratri-2026", "art-of-living-durga-saptashati-2026", "markandeya-purana-pargiter-1904-devimahatmya"],
                "instructional": False,
            },
        ]
        variants = [
            {"variant_id": "simple-prayer-versus-ghatasthapana", "scope": "Household commitment", "difference": "A short daily prayer and a maintained Ghatasthapana setup are different commitments; establish the latter only when it matches family practice and can be cared for safely.", "source_ids": ["maharashtra-tourism-ghatasthapana-2026"], "separate_lane_required": False},
            {"variant_id": "regional-navaratri-worlds", "scope": "Region and public form", "difference": "Gujarati Garba, Bengal Durga Puja, North Indian Ramlila, and South Indian Kolu/Golu are distinct practice worlds. This lane names them for orientation but does not supply their procedures.", "source_ids": ["incredible-india-navratri-2026"], "separate_lane_required": True},
            {"variant_id": "household-versus-formal-recitation", "scope": "Textual authority and ritual leader", "difference": "A familiar household prayer is not the same as a complete Durga Saptashati recitation, homa, Kumari worship, fasting discipline, or priest-led installation; those require their own source and authority contract.", "source_ids": ["art-of-living-durga-saptashati-2026", "devi-bhagavatam-vijnanananda-navaratri-pages-178-197"], "separate_lane_required": True},
        ]
        safety = [
            "Family and sampradaya practice overrides this generic household lane when known.",
            "Use open flame or incense only with ventilation and continuous adult supervision; a flame-free prayer is valid.",
            "Do not start an akhand flame unless uninterrupted responsible adult supervision is genuinely possible.",
            "Do not undertake fasting, homa, Kumari worship, initiation-bound mantra, or priestly liturgy from this compact guide.",
            "The ten daily reflection prompts are editorial aids, not mandatory ritual claims or a universal Navadurga calendar.",
            "Bengal Durga Puja, Gujarati Garba, South Indian Kolu/Golu, Nepal Dashain, temple programmes and live venue schedules remain separate.",
        ]
    else:
        significance = {
            "text": "शारदीय नवरात्रि देवी की उपासना और मनन का नौ-रात्रि काल है। सीमित उत्तर/पश्चिम भारतीय रूप आश्विन शुक्ल प्रतिपदा से आरम्भ होता है; कुछ परिवार घट या कलश स्थापित करके उसकी देखभाल करते हैं, जबकि अपने बताए हुए दायरे में निभ सकने वाली दैनिक प्रार्थना भी पूर्ण है।",
            "source_ids": ["incredible-india-navratri-2026", "maharashtra-tourism-ghatasthapana-2026", "nirnayasindhu-marathi-1865-pages-178-207"],
            "scope_note": "यह उत्तर/पश्चिम भारत का एक स्मार्त गृह-रूप है, सार्वभौमिक नवरात्रि-विधि या पारिवारिक परम्परा का विकल्प नहीं।",
        }
        narratives = [
            {
                "narrative_id": "devimahatmya-mahishasura-account",
                "title": "दुर्गा और महिषासुर",
                "summary": "Incredible India का वर्तमान विवरण नवरात्रि को दुर्गा की महिषासुर पर विजय से जोड़ता है। देवम् इस परिचित उत्सव-विवरण को पार्जिटर के 1904 मार्कण्डेय पुराण अनुवाद में संस्करण-पहचानयुक्त देवीमाहात्म्य-सीमा के साथ रखता है; एक कथा को हर नवरात्रि-परम्परा की एकमात्र उत्पत्ति नहीं बताता।",
                "tradition_scope": "वर्तमान राष्ट्रीय उत्सव-विवरण और देवीमाहात्म्य की एक पहचानी हुई अंग्रेज़ी अभिव्यक्ति",
                "source_ids": ["incredible-india-navratri-2026", "markandeya-purana-pargiter-1904-devimahatmya"],
                "universal_origin_claimed": False,
            },
            {
                "narrative_id": "devi-bhagavatam-rama-navaratri-account",
                "title": "राम का नवरात्रि-अनुष्ठान",
                "summary": "देवी भागवत की विज्ञानानन्द अंग्रेज़ी अभिव्यक्ति में एक अध्याय है जिसमें नारद नवरात्र-विधि बताते हैं और राम उसका अनुष्ठान करते हैं। यह एक श्रेययुक्त शाक्त पौराणिक विवरण और रामायण-जगत से सेतु है, हर गृह-परम्परा की एकमात्र जड़ होने का दावा नहीं।",
                "tradition_scope": "एक पहचानी हुई विज्ञानानन्द अंग्रेज़ी अभिव्यक्ति में शाक्त पौराणिक विवरण",
                "source_ids": ["devi-bhagavatam-vijnanananda-navaratri-pages-178-197"],
                "universal_origin_claimed": False,
            },
        ]
        practices = [
            {
                "practice_id": "north-west-household-ghatasthapana",
                "population_scope": "वे उत्तर/पश्चिम भारतीय गृह जहाँ घटस्थापना पहले से प्रचलित है",
                "description": "स्वच्छ स्थान बनाया जाता है, मिट्टी में जौ बोए जाते हैं और जल-भरा कलश दैनिक सेवा के केन्द्र के रूप में स्थापित होता है। यह बहुदिवसीय जिम्मेदारी है और जहाँ पारिवारिक प्रथा न हो वहाँ वैकल्पिक है।",
                "source_ids": ["maharashtra-tourism-ghatasthapana-2026", "drikpanchang-kalasha-sthapana-2026"],
                "instructional": False,
            },
            {
                "practice_id": "devi-prayer-and-source-identified-reading",
                "population_scope": "प्रार्थना, परिचित आरती या संस्करण-पहचानयुक्त देवी-पाठ चुनने वाले गृह",
                "description": "दैनिक उपासना में परिचित देवी-प्रार्थना, नाम, आरती या स्रोत-पहचानयुक्त पाठ हो सकता है। दुर्गा सप्तशती के अनेक पाठ-क्रम हैं, जिनमें तेरह अध्यायों को नवरात्रि में बाँटना भी है; ऐप का सार स्वयं पाठ नहीं है।",
                "source_ids": ["incredible-india-navratri-2026", "art-of-living-durga-saptashati-2026", "markandeya-purana-pargiter-1904-devimahatmya"],
                "instructional": False,
            },
        ]
        variants = [
            {"variant_id": "simple-prayer-versus-ghatasthapana", "scope": "गृह-संकल्प", "difference": "संक्षिप्त दैनिक प्रार्थना और निरन्तर सेवा वाली घटस्थापना अलग संकल्प हैं; घट केवल तभी स्थापित करें जब वह पारिवारिक प्रथा हो और सुरक्षित देखभाल सम्भव हो।", "source_ids": ["maharashtra-tourism-ghatasthapana-2026"], "separate_lane_required": False},
            {"variant_id": "regional-navaratri-worlds", "scope": "क्षेत्र और सार्वजनिक रूप", "difference": "गुजरात का गरबा, बंगाल की दुर्गा पूजा, उत्तर भारत की रामलीला और दक्षिण भारत का कोलू/गोलू अलग परम्परा-जगत हैं। यह रूप परिचय के लिए नाम लेता है, उनकी विधि नहीं देता।", "source_ids": ["incredible-india-navratri-2026"], "separate_lane_required": True},
            {"variant_id": "household-versus-formal-recitation", "scope": "ग्रन्थ-अधिकार और अनुष्ठान-नेता", "difference": "परिचित गृह-प्रार्थना पूर्ण दुर्गा सप्तशती-पाठ, होम, कुमारी-पूजन, उपवास-विधान या पुरोहित-निर्देशित स्थापना के समान नहीं; उनके लिए अलग स्रोत और अधिकार चाहिए।", "source_ids": ["art-of-living-durga-saptashati-2026", "devi-bhagavatam-vijnanananda-navaratri-pages-178-197"], "separate_lane_required": True},
        ]
        safety = [
            "ज्ञात पारिवारिक और सम्प्रदायिक परम्परा इस सामान्य गृह-रूप से ऊपर है।",
            "दीप या धूप केवल वायु और निरन्तर वयस्क देखरेख में रखें; अग्नि-रहित प्रार्थना मान्य है।",
            "अखण्ड ज्योति तभी लें जब निरन्तर जिम्मेदार वयस्क देखरेख वास्तव में सम्भव हो।",
            "इस संक्षिप्त मार्गदर्शिका से उपवास, होम, कुमारी-पूजन, दीक्षा-मन्त्र या पुरोहित-विधान आरम्भ न करें।",
            "दस दैनिक चिंतन सम्पादकीय सहायक हैं, अनिवार्य कर्म या सार्वभौमिक नवदुर्गा-कैलेंडर नहीं।",
            "बंगाल दुर्गा पूजा, गुजरात गरबा, दक्षिण भारत कोलू/गोलू, नेपाल दशैं, मन्दिर-कार्यक्रम और लाइव स्थल-समय अलग हैं।",
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
        "daily_sequence": [
            {**entry, "source_ids": verified_refs(entry["source_ids"])}
            for entry in guide["daily_sequence"]
        ],
        "safety_and_boundaries": safety,
    }


def build() -> dict:
    source_bytes = SOURCE.read_bytes()
    if sha256(source_bytes) != SOURCE_SHA256:
        raise RuntimeError("legacy Shardiya Navaratri pack drift")
    legacy = json.loads(source_bytes.decode("utf-8"))
    if legacy.get("contract") != "DEVAM_RITUAL_PROCEDURE_PACK_V1" or legacy.get("pack_id") != "devam-shardiya-navaratri-north-west-india-practice-v1":
        raise RuntimeError("legacy Shardiya Navaratri identity drift")
    sources = [
        {
            "source_id": "maharashtra-tourism-ghatasthapana-2026",
            "title": "Ghatasthapana",
            "publisher": "Directorate of Tourism, Government of Maharashtra",
            "source_role": "Current official evidence for the Navaratri opening, clean space, soil, barley, kalasha, multi-day care and regional variation",
            "rights_lane": "citation_only",
            "url": "https://maharashtratourism.gov.in/festivals/ghatasthapana/",
            "artifact_sha256": None,
            "citation_coordinates": None,
            "observed_fetch": {"status": 200, "final_url": "https://maharashtratourism.gov.in/festivals/ghatasthapana/", "response_bytes": 624498, "response_sha256": "603460653a7bc5597133f0cbe8b8312e794cff9ae2d63de672e14a658922ca37", "strict_utf8": True, "observed_at": "2026-08-07"},
        },
        {
            "source_id": "incredible-india-navratri-2026",
            "title": "Navratri: Nine nights of divine celebration",
            "publisher": "Incredible India, Ministry of Tourism, Government of India",
            "source_role": "Current official overview of nine nights, Navadurga, Durga-Mahishasura account, prayer and distinct regional worlds",
            "rights_lane": "citation_only",
            "url": "https://www.incredibleindia.gov.in/en/festivals-and-events/navratri",
            "artifact_sha256": None,
            "citation_coordinates": None,
            "observed_fetch": {"status": 200, "final_url": "https://www.incredibleindia.gov.in/en/festivals-and-events/navratri", "response_bytes": 467895, "response_sha256": "60ac4f74fb3214972a9eef15ed79e6808707abcdf11b42f29a6194134e6c7a02", "strict_utf8": True, "observed_at": "2026-08-07"},
        },
        {
            "source_id": "drikpanchang-kalasha-sthapana-2026",
            "title": "Kalasha Sthapana Vidhi",
            "publisher": "Drik Panchang",
            "source_role": "Current practitioner reference for expanded kalasha materials and formal mantra-rich installation boundary",
            "rights_lane": "citation_only",
            "url": "https://www.drikpanchang.com/puja-vidhi/kalash-sthapana/kalash-sthapana.html",
            "artifact_sha256": None,
            "citation_coordinates": None,
            "observed_fetch": {"status": 200, "final_url": "https://www.drikpanchang.com/puja-vidhi/kalash-sthapana/kalash-sthapana.html", "response_bytes": 72733, "response_sha256": "4d42d734f64c0ad31cf3553744e875d41a523ec0d006cff6231dd0eef4d407ef", "strict_utf8": True, "observed_at": "2026-08-07"},
        },
        {
            "source_id": "art-of-living-durga-saptashati-2026",
            "title": "Durga Saptashati: A glorious song to the Divine Mother",
            "publisher": "The Art of Living",
            "source_role": "Living-tradition evidence for thirteen chapters and multiple Navaratri recitation frames; not a universal household authority",
            "rights_lane": "citation_only",
            "url": "https://www.artofliving.org/in-en/navratri/durga-saptashati-a-glorious-song-to-the-divine-mother",
            "artifact_sha256": None,
            "citation_coordinates": None,
            "observed_fetch": {"status": 200, "final_url": "https://www.artofliving.org/in-en/navratri/durga-saptashati-a-glorious-song-to-the-divine-mother", "response_bytes": 128788, "response_sha256": "349da21b1892eb1c20c3d7cc95af4f5a2c470864e676b98a2a321e5669484cbe", "strict_utf8": True, "observed_at": "2026-08-07"},
        },
        {
            "source_id": "nirnayasindhu-marathi-1865-pages-178-207",
            "title": "Nirnayasindhu — Marathi translation, Mumbai 1865",
            "publisher": "Ganapati Krishnaji's Press; retained by Devam",
            "source_role": "Historical Ashvina Navaratri opening and Vijayadashami timing context; not promoted as a complete modern household procedure",
            "rights_lane": "internal_only",
            "url": "https://archive.org/details/in.ernet.dli.2015.365977",
            "artifact_sha256": "a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b",
            "citation_coordinates": {"pdf_pages": list(range(178, 208)), "ingestion_plan": "ingestion/plans/nirnayasindhu-marathi-1865-v1.json", "ingestion_plan_sha256": "7d120d9565081a585dc7de59c8c83173341615fe1f16d965b568fdddccaad815"},
        },
        {
            "source_id": "devi-bhagavatam-vijnanananda-navaratri-pages-178-197",
            "title": "Srimad Devi Bhagavatam — Vijnanananda English digital compilation",
            "publisher": "Historical translation by Swami Vijnanananda; retained by Devam",
            "source_role": "Edition-identified Navaratri chapters, Kumari-worship boundary, and Rama-Narada Navaratri account; provider OCR remains quarantined",
            "rights_lane": "derivative_allowed",
            "url": "https://archive.org/details/SrimadDeviBhagavatamEnglish",
            "artifact_sha256": "baff9c1c119394a514b3f2f2c6671dfac888ef4f104d9188cf927de31adad1bc",
            "citation_coordinates": {"pdf_pages": list(range(178, 198)), "ingestion_plan": "ingestion/plans/devi-bhagavatam-vijnanananda-english-v1.json", "ingestion_plan_sha256": "9271edd25eacf823c8ed79d43cf4ca5d4ff40beea235b90491e98f0a75d9481", "packet_sha256": "4410de730dc585de7ee65c8b223ccfcfab7b0dace4f77256fbabb08c414f0c5e"},
        },
        {
            "source_id": "markandeya-purana-pargiter-1904-devimahatmya",
            "title": "The Markandeya Purana — Pargiter translation, Calcutta 1904",
            "publisher": "The Asiatic Society; retained by Devam",
            "source_role": "Complete fixed edition boundary for the Devimahatmya narrative in one historical English translation; provider OCR remains quarantined",
            "rights_lane": "derivative_allowed",
            "url": "https://archive.org/details/in.ernet.dli.2015.47519",
            "artifact_sha256": "f7023e3aa0127b9a093b88664c68374da72d469e4f790c4a7bd4606a392e7300",
            "citation_coordinates": {"context_pdf_pages": [509, 566], "proper_pdf_pages": [516, 564], "ingestion_plan": "ingestion/plans/markandeya-purana-pargiter-1904-v1.json", "ingestion_plan_sha256": "fe1102e0624286cf2676da7249b52e7bca69f3310ba6008b82312b1fc04c9773", "packet_sha256": "9b7ccd43163cadd84f3c41a8c4fbacf40205e4539678c2b51da16829fe257969"},
        },
    ]
    return {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1",
        "lane_id": "shardiya-navaratri-north-west-india-content-v1",
        "supersedes_legacy_pack_ids": ["devam-shardiya-navaratri-north-west-india-practice-v1"],
        "observance_slugs": ["shardiya-navaratri-begins"],
        "applicability": {
            "region_codes": legacy["scope"]["region_codes"],
            "tradition_codes": legacy["scope"]["tradition_codes"],
            "settings": ["household", "individual", "family_led"],
            "context_pairs": [
                {"region_code": "north-india", "tradition_code": "smarta-north-india"},
                {"region_code": "west-india", "tradition_code": "smarta-west-india"},
            ],
            "family_practice_overrides_generic_guidance": True,
            "material_context_questions": legacy["guides"][0]["context_prompts"],
        },
        "calendar": {
            "timing_kind": "mixed",
            "decision_rule_id": "nirnayasindhu-1865-ashvina-shukla-pratipada-sunrise-v1",
            "closing_decision_rule_id": "nirnayasindhu-1865-ashvina-shukla-dashami-aparahna-v1",
            "live_schedule_required": False,
            "location_aware": True,
            "tradition_aware": True,
            "freshness_note": "The bounded 2026 North/West India lane opens Sunday, 11 October and closes with the general Vijayadashami lane on Tuesday, 20 October. Use Devam's location-aware decision windows; family Ghatasthapana, daily worship and conclusion remain household choices.",
            "resolution_source_ids": ["nirnayasindhu-marathi-1865-pages-178-207", "maharashtra-tourism-ghatasthapana-2026"],
        },
        "sources": sources,
        "localized_content": [localized_content(guide) for guide in legacy["guides"]],
        "product_status": {
            "classification": "user_complete_lane",
            "completed_dimensions": {
                "actionable_vidhi": True,
                "applicability": True,
                "evidence": True,
                "materials_and_substitutions": True,
                "origin_narratives": True,
                "significance": True,
                "timing": True,
                "typical_practice": True,
                "variants": True,
            },
            "open_gaps": [],
            "review_status": "internal_beta_reviewed",
        },
    }


def main() -> None:
    payload = json.dumps(build(), ensure_ascii=False, indent=2, sort_keys=True).encode("utf-8") + b"\n"
    OUTPUT.write_bytes(payload)
    print(json.dumps({"path": str(OUTPUT.relative_to(ROOT)), "bytes": len(payload), "sha256": sha256(payload)}, sort_keys=True))


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Build the bounded Delhi 2026 Pitru Paksha remembrance/preparation lane."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
FIXTURE = ROOT / "knowledge_packs/panchang/pitru-paksha-delhi-2026-v1.json"
OUTPUT = ROOT / "knowledge_packs/rituals/pitru-paksha-delhi-remembrance-content-v1.json"
FIXTURE_SHA256 = "d88a379b5bec6f73801d486e0133767593b19dd882b530ebad43ef33bfe86f22"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def source(source_id: str, title: str, publisher: str, role: str, rights_lane: str, **extra: object) -> dict:
    row = {"source_id": source_id, "title": title, "publisher": publisher, "source_role": role, "rights_lane": rights_lane, "url": None, "artifact_sha256": None, "citation_coordinates": None, "observed_fetch": None}
    row.update(extra)
    return row


def materials(language: str) -> list[dict]:
    if language == "hi":
        return [
            {"item": "यदि सहज हो तो पूर्वज का नाम, चित्र या लिखी हुई स्मृति", "required": False, "substitutions": ["बिना चित्र या नाम के मौन स्मरण"], "source_ids": ["devam-pitru-paksha-care-boundary"]},
            {"item": "परिवार की जानकारी लिखने के लिए कागज या निजी नोट", "required": False, "substitutions": ["विश्वसनीय परिवारजन से मौखिक बातचीत"], "source_ids": ["devam-pitru-paksha-care-boundary"]},
            {"item": "परिवार या पुरोहित द्वारा बताई गई सामग्री", "required": False, "substitutions": ["सामग्री न जुटाएँ और केवल व्यक्तिगत स्मरण करें"], "source_ids": ["nirnayasindhu-1865-mahalaya-section"]},
        ]
    return [
        {"item": "An ancestor's name, photograph or written memory, only if comfortable", "required": False, "substitutions": ["Remember privately without a name or image"], "source_ids": ["devam-pitru-paksha-care-boundary"]},
        {"item": "Paper or a private note for family information", "required": False, "substitutions": ["Speak with a trusted family member instead"], "source_ids": ["devam-pitru-paksha-care-boundary"]},
        {"item": "Only the materials specified by the responsible family or priestly authority", "required": False, "substitutions": ["Gather nothing and use the personal remembrance form"], "source_ids": ["nirnayasindhu-1865-mahalaya-section"]},
    ]


def procedures(language: str) -> list[dict]:
    hi = language == "hi"
    common = ["devam-pitru-paksha-delhi-calendar-fixture", "nirnayasindhu-1865-mahalaya-section", "devam-pitru-paksha-care-boundary"]
    if hi:
        definitions = [
            ("minimum", "व्यक्तिगत स्मरण—बिना औपचारिक श्राद्ध शुरू किए", "accessible_short", 10, [
                ("Today में दिन का नाम देखें, पर यह न मानें कि वही तिथि आपके किसी पूर्वज पर लागू होती है।", "मृत्यु-तिथि, संबंध और पात्रता का निर्णय अलग पारिवारिक या धार्मिक प्रश्न है।"),
                ("जिस पूर्वज या परिवारजन को याद करना सहज हो, उनका नाम लें या उनसे मिली किसी सीख, देखभाल या जिम्मेदारी को मौन में याद करें।", "सम्मानपूर्ण स्मरण बिना औपचारिक मंत्र या अर्पण के भी किया जा सकता है।"),
                ("उनकी स्मृति में दया, सेवा, दान या परिवार की किसी उपेक्षित जिम्मेदारी का एक छोटा काम करें।", "स्मरण को जिम्मेदार जीवन से जोड़ता है, बिना किसी फल की गारंटी के।"),
            ]),
            ("standard", "परिवार की विधि के लिए तैयारी", "traditional_household", 25, [
                ("परिवार के किसी विश्वसनीय बड़े से पूछें कि कौन-सी मृत्यु-तिथि, नाम, गोत्र, कर्ता और पारिवारिक विधि लागू होती है; जो अज्ञात है उसे अज्ञात ही लिखें।", "दिन का कैलेंडर-लेबल व्यक्तिगत पात्रता तय नहीं करता।"),
                ("यदि परिवार औपचारिक श्राद्ध करता है तो पुरोहित या जिम्मेदार परंपरा-अधिकारी से समय, सामग्री, भोजन, दान, मंत्र और समापन की सूची लें।", "पूर्ण विधि को जीवित और उत्तरदायी परंपरा के पास रखता है।"),
                ("सहमति से एक छोटी पारिवारिक स्मृति साझा करें और किसी जरूरतमंद व्यक्ति की सुरक्षित सहायता करें; पशु, नदी, आग या भोजन-सुरक्षा के जोखिम न लें।", "अतिथ्य और दान के अर्थ को सुरक्षित वर्तमान व्यवहार से जोड़ता है।"),
                ("जो पारिवारिक जानकारी मिली उसे निजी रूप से दर्ज करें और असहमति या शोक में किसी पर दबाव न डालें।", "भविष्य की पीढ़ियों के लिए संदर्भ बचता है और व्यक्ति की agency बनी रहती है।"),
            ]),
            ("elaborate", "परिवार या पुरोहित-निर्देशित सहभागिता", "fuller_family_or_teacher_led", 60, [
                ("मान्यता-प्राप्त परिवारजन या पुरोहित से आज की तिथि, कर्ता और जिन पूर्वजों के लिए कर्म है उनकी पुष्टि कराएँ।", "तिथि और पात्रता को ऐप अनुमान से नहीं भर सकता।"),
                ("पिण्ड, तर्पण, कुश, तिल, मंत्र, भोजन, दान और समापन सहित हर औपचारिक चरण उसी अधिकारी के निर्देश से करें; अनजान चरण न गढ़ें।", "श्राद्ध एक जटिल और परंपरा-विशिष्ट कर्म हो सकता है।"),
                ("यदि केवल सहभागी हैं तो तैयारी, अतिथि-सत्कार, स्वच्छता और सेवा में सहायता करें; जल या आग के पास जिम्मेदार व्यक्ति के निर्देश मानें।", "सुरक्षित सहभागिता संभव है बिना पुरोहित की भूमिका अपनाए।"),
                ("समापन के बाद परिवार की स्मृतियों, कृतज्ञता और जीवित जिम्मेदारियों के लिए समय रखें।", "अनुष्ठान को संबंध और जिम्मेदारी से जोड़ता है।"),
            ]),
        ]
    else:
        definitions = [
            ("minimum", "Personal remembrance without initiating formal Shraddha", "accessible_short", 10, [
                ("Read today's label in Today, but do not assume that it is the applicable death-tithi for one of your ancestors.", "The death-tithi, relationship and performer eligibility are separate family or religious decisions."),
                ("Remember an ancestor or family member you are comfortable naming, or quietly recall one lesson, care or responsibility received through them.", "Respectful remembrance is possible without inventing a formal mantra or offering."),
                ("Do one small act of kindness, service, donation or neglected family responsibility in their memory.", "This connects remembrance to responsible living without guaranteeing an outcome."),
            ]),
            ("standard", "Prepare for the family's established practice", "traditional_household", 25, [
                ("Ask a trusted elder which death-tithi, names, gotra, performer and family procedure apply; record unknown details as unknown.", "The calendar label does not decide personal applicability."),
                ("If the family performs formal Shraddha, obtain the actual timing, materials, food, donation, mantra and closing list from its priest or responsible tradition authority.", "The complete rite remains with an accountable living tradition."),
                ("With consent, share one family memory and offer safe help to a person in need; do not create animal, river, fire or food-safety risks.", "This translates remembrance and generosity into safe current action."),
                ("Keep any family information private and do not pressure anyone who is grieving, estranged or follows a different practice.", "It preserves future context while protecting agency."),
            ]),
            ("elaborate", "Family- or priest-directed participation", "fuller_family_or_teacher_led", 60, [
                ("Have the recognised family or priestly authority confirm today's tithi, performer and the ancestors for whom the rite is intended.", "The app cannot infer tithi applicability or eligibility."),
                ("Perform every formal step—including pinda, tarpana, kusha, sesame, mantra, food, donation and close—only as directed by that authority; do not reconstruct unknown steps.", "Shraddha can be a complex, tradition-specific rite."),
                ("If you are participating rather than leading, help with preparation, hospitality, cleanliness and service, following the responsible person's directions near water or flame.", "This allows safe participation without impersonating priestly authority."),
                ("After the close, make space for family memories, gratitude and responsibilities toward living relatives.", "The observance remains connected to relationship and responsibility."),
            ]),
        ]
    result = []
    for tier, label, form, minutes, steps in definitions:
        result.append({
            "procedure_id": f"pitru-paksha-delhi-remembrance-content-v1-{language}-{tier}-v1",
            "label": label,
            "tier": tier,
            "setting": "individual" if tier == "minimum" else "family_led",
            "authority_scope": "Personal remembrance only" if tier == "minimum" else "Established family or priestly authority",
            "form": form,
            "estimated_minutes": minutes,
            "materials": materials(language),
            "steps": [{"ordinal": index, "instruction": instruction, "why": why, "source_ids": common, "optional": False} for index, (instruction, why) in enumerate(steps, start=1)],
            "closing": {"text": "कृतज्ञता, गोपनीयता और जीवित परिवार के प्रति जिम्मेदारी के साथ समाप्त करें।" if hi else "Close with gratitude, privacy and responsibility toward the living family.", "source_ids": ["devam-pitru-paksha-care-boundary"], "scope_note": "औपचारिक समापन परिवार या पुरोहित के अधीन है।" if hi else "The formal ritual close belongs to the family or priestly authority."},
            "source_ids": common,
        })
    return result


def localized(language: str, slugs: list[str]) -> dict:
    hi = language == "hi"
    if hi:
        return {
            "language_code": "hi",
            "observance_slugs": slugs,
            "title": "पितृ पक्ष—व्यक्तिगत स्मरण और पारिवारिक तैयारी",
            "short_answer": "आज का श्राद्ध-लेबल दिल्ली 2026 कैलेंडर की पहचान है; यह अपने-आप यह तय नहीं करता कि किस पूर्वज, मृत्यु-तिथि, कर्ता या विधि पर लागू होता है। आप बिना औपचारिक श्राद्ध शुरू किए व्यक्तिगत स्मरण कर सकते हैं, या परिवार/पुरोहित से सही विधि की तैयारी कर सकते हैं।",
            "significance": {"text": "पितृ पक्ष पूर्वजों को याद करने और सम्मान देने की अवधि है। भोजन, जल, तर्पण, पिण्ड और दान जैसी विधियाँ स्रोतों में वर्णित हैं, पर उनकी पात्रता और क्रम परिवार, तिथि, क्षेत्र और परंपरा पर निर्भर हैं।", "source_ids": ["utsav-pitra-paksha", "nirnayasindhu-1865-mahalaya-section"], "scope_note": "यह पथ व्यक्तिगत स्मरण और औपचारिक विधि की तैयारी में पूर्ण है; यह स्वयं पूर्ण श्राद्ध-विधि नहीं है।"},
            "origin_narratives": [{"narrative_id": "pitru-paksha-ancestor-remembrance", "title": "पूर्वज-स्मरण का पक्ष", "summary": "सरकारी उत्सव-विवरण पितृ पक्ष को पूर्वजों के लिए प्रार्थना, भोजन और जल अर्पित करने की अवधि बताता है। देवम इसे एक वर्णित आस्था और प्रथा के रूप में रखता है, न कि हर परिवार के लिए समान विधि या निश्चित फल के रूप में।", "tradition_scope": "सामान्य सार्वजनिक सांस्कृतिक विवरण", "source_ids": ["utsav-pitra-paksha"], "universal_origin_claimed": False}],
            "typical_practices": [{"practice_id": "pitru-paksha-shraddha-tarpana-described", "population_scope": "वे परिवार जो पितृ पक्ष श्राद्ध मानते हैं", "description": "प्रार्थना, भोजन या जल अर्पण, श्राद्ध और तर्पण वर्णित प्रथाएँ हैं; सही मृत्यु-तिथि और पारिवारिक/पुरोहित मार्गदर्शन इनके वास्तविक प्रयोग को नियंत्रित करते हैं।", "source_ids": ["utsav-pitra-paksha", "drikpanchang-delhi-pitru-paksha-2026", "nirnayasindhu-1865-mahalaya-section"], "instructional": False}],
            "procedures": procedures("hi"),
            "variants": [{"variant_id": "pitru-paksha-tithi-and-family-variation", "scope": "मृत्यु-तिथि, परिवार, क्षेत्र और परंपरा", "difference": "पंद्रह दिल्ली तिथियों और अठारह लेबलों को व्यक्तिगत पात्रता न समझें; विशेष भरणी, मघा, अमावस्या, कर्ता और अपवाद अलग निर्णय हैं।", "source_ids": ["devam-pitru-paksha-delhi-calendar-fixture", "nirnayasindhu-1865-mahalaya-section"], "separate_lane_required": True}, {"variant_id": "tamil-mahalaya-amavasai-tharpanam", "scope": "तिरुचिरापल्ली/तमिलनाडु क्षेत्रीय सहभागिता", "difference": "कावेरी में महालय अमावस्या तर्पण की सार्वजनिक परंपरा एक अलग क्षेत्रीय, जल-सुरक्षा और पुरोहित-अधिकार वाला पथ है।", "source_ids": ["utsav-mahalaya-amavasai-tharpanam"], "separate_lane_required": True}],
            "safety_and_boundaries": ["औपचारिक श्राद्ध, तर्पण, पिण्डदान, मंत्र, कुश, तिल, भोजन, दान, कर्ता या समय का अनुमान ऐप से न लगाएँ।", "शोक, गोद, विवाह, जाति, लिंग, पारिवारिक दूरी या अलग विश्वास के कारण किसी पर दबाव न डालें।", "प्रदूषित या असुरक्षित जल में प्रवेश न करें; आग, भोजन और भीड़ की स्थानीय सुरक्षा मानें।", "पितृदोष, श्राप, बाधा, मुक्ति, समृद्धि या पूर्वज-तृप्ति का कोई परिणाम सुनिश्चित नहीं किया जाता।", "निजी नाम, मृत्यु-विवरण और पारिवारिक इतिहास सहमति के बिना साझा न करें।"],
        }
    return {
        "language_code": "en",
        "observance_slugs": slugs,
        "title": "Pitru Paksha—personal remembrance and family preparation",
        "short_answer": "Today's Shraddha label is a Delhi 2026 calendar identity; it does not by itself decide the ancestor, death-tithi, performer or procedure that applies. You can use the personal remembrance form without initiating formal Shraddha, or prepare the right questions for your family or priestly authority.",
        "significance": {"text": "Pitru Paksha is a period for remembering and honouring ancestors. Food, water, tarpana, pinda and donation practices are described in the sources, but their applicability and sequence depend on family, tithi, region and tradition.", "source_ids": ["utsav-pitra-paksha", "nirnayasindhu-1865-mahalaya-section"], "scope_note": "This lane is complete for personal remembrance and preparation for an established formal practice; it is not itself a complete Shraddha rite."},
        "origin_narratives": [{"narrative_id": "pitru-paksha-ancestor-remembrance", "title": "A fortnight of ancestor remembrance", "summary": "The official festival account describes Pitru Paksha as a period when prayers, food and water are offered to ancestors. Devam preserves this as an attributable belief and practice, not one identical procedure or guaranteed result for every family.", "tradition_scope": "General public-cultural account", "source_ids": ["utsav-pitra-paksha"], "universal_origin_claimed": False}],
        "typical_practices": [{"practice_id": "pitru-paksha-shraddha-tarpana-described", "population_scope": "Families that observe Pitru Paksha Shraddha", "description": "Prayer, food or water offerings, Shraddha and tarpana are described practices; the applicable death-tithi and family or priestly guidance govern their actual use.", "source_ids": ["utsav-pitra-paksha", "drikpanchang-delhi-pitru-paksha-2026", "nirnayasindhu-1865-mahalaya-section"], "instructional": False}],
        "procedures": procedures("en"),
        "variants": [{"variant_id": "pitru-paksha-tithi-and-family-variation", "scope": "Death-tithi, family, region and tradition", "difference": "Do not treat the fifteen Delhi dates and eighteen labels as personal applicability; Bharani, Magha, Amavasya, performer and exception rules are separate decisions.", "source_ids": ["devam-pitru-paksha-delhi-calendar-fixture", "nirnayasindhu-1865-mahalaya-section"], "separate_lane_required": True}, {"variant_id": "tamil-mahalaya-amavasai-tharpanam", "scope": "Tiruchirappalli/Tamil Nadu regional participation", "difference": "The public Kaveri Mahalaya Amavasai tharpanam tradition is a separate regional, water-safety and priestly-authority lane.", "source_ids": ["utsav-mahalaya-amavasai-tharpanam"], "separate_lane_required": True}],
        "safety_and_boundaries": ["Do not infer formal Shraddha, tarpana, pinda-dana, mantra, kusha, sesame, food, donation, performer or timing instructions from the app.", "Do not pressure anyone because of grief, adoption, marriage, caste, gender, estrangement or different belief.", "Do not enter polluted or unsafe water; follow local fire, food and crowd safety.", "No pitru-dosha, curse, obstacle, liberation, prosperity or ancestor-satisfaction outcome is guaranteed.", "Do not expose names, death details or family history without consent."],
    }


def main() -> None:
    if sha256(FIXTURE) != FIXTURE_SHA256:
        raise SystemExit("Pitru Paksha fixture drift")
    fixture = json.loads(FIXTURE.read_text(encoding="utf-8"))
    labels = [dict(label, civil_date=day["civil_date"], basis=label["basis"]) for day in fixture["days"] for label in day["labels"]]
    calendar_slugs = [label["slug"] for label in labels]
    if len(labels) != 18 or len(set(calendar_slugs)) != 18 or len(fixture["days"]) != 15:
        raise SystemExit("Pitru Paksha day/label universe drift")
    slugs = ["pitru-paksha-general", *calendar_slugs]
    notes = [
        {"observance_slug": "pitru-paksha-general", "language_code": "en", "note": "The bounded Delhi 2026 Pitru Paksha calendar runs from 26 September through 10 October. Ask which death-tithi and family practice apply before initiating a formal rite."},
        {"observance_slug": "pitru-paksha-general", "language_code": "hi", "note": "दिल्ली 2026 का सीमित पितृ पक्ष कैलेंडर 26 सितंबर से 10 अक्टूबर तक है। औपचारिक कर्म शुरू करने से पहले सही मृत्यु-तिथि और पारिवारिक विधि पूछें।"},
    ]
    for label in labels:
        date_en = __import__("datetime").date.fromisoformat(label["civil_date"]).strftime("%-d %B %Y") if __import__("os").name != "nt" else __import__("datetime").date.fromisoformat(label["civil_date"]).strftime("%#d %B %Y")
        notes.extend([
            {"observance_slug": label["slug"], "language_code": "en", "note": f"{label['en']} is labelled on {date_en} for the Delhi 2026 calendar ({label['basis']}). This label does not decide whether it applies to a particular ancestor or who should perform a formal rite."},
            {"observance_slug": label["slug"], "language_code": "hi", "note": f"दिल्ली 2026 कैलेंडर में {label['hi']} {date_en} को है ({label['basis']})। यह लेबल अपने-आप किसी विशेष पूर्वज की पात्रता या औपचारिक कर्म के कर्ता को तय नहीं करता।"},
        ])
    pack = {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1",
        "lane_id": "pitru-paksha-delhi-remembrance-content-v1",
        "observance_slugs": slugs,
        "applicability": {"region_codes": ["north-india"], "tradition_codes": ["smarta-north-india"], "context_pairs": [{"region_code": "north-india", "tradition_code": "smarta-north-india"}], "settings": ["household", "individual", "family_led", "temple"], "family_practice_overrides_generic_guidance": True, "material_context_questions": ["Which city and Panchang tradition apply?", "Do you know the ancestor's lunar death-tithi, or is that information uncertain?", "Does your family have an established Shraddha practice and a responsible elder or priest who guides it?", "Do you want a private remembrance, help preparing for the family rite, or guidance for participating without leading it?"], "observance_context_notes": notes},
        "calendar": {"resolution_source_ids": ["devam-pitru-paksha-delhi-calendar-fixture", "drikpanchang-delhi-pitru-paksha-2026", "drikpanchang-delhi-pitru-paksha-hindi-2026"], "timing_kind": "mixed", "location_aware": True, "tradition_aware": True, "decision_rule_id": "devam-pitru-paksha-delhi-2026-v1", "closing_decision_rule_id": None, "live_schedule_required": True, "freshness_note": "The Delhi 2026 calendar resolves fifteen dates and eighteen labels only. Personal ancestor applicability, death-tithi, performer, Kutup/Rohina/Aparahna timing and formal procedure remain with the family and responsible religious authority."},
        "sources": [
            source("devam-pitru-paksha-delhi-calendar-fixture", "Devam Delhi 2026 Pitru Paksha calendar context", "Devam", "Deterministic fifteen-date/eighteen-label identity and explicit non-procedure boundary", "derivative_allowed", artifact_sha256=FIXTURE_SHA256, citation_coordinates={"path": "knowledge_packs/panchang/pitru-paksha-delhi-2026-v1.json", "pointer": "/days"}),
            source("nirnayasindhu-1865-mahalaya-section", "Nirnayasindhu, 1865 Marathi edition, Mahalaya section", "Devam retained source vault", "Historical Mahalaya interval, ancestor/applicability and exception context; not a universal modern household manual", "citation_only", artifact_sha256="a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b", citation_coordinates={"pdf_pages": [163, 164, 165, 166, 167, 168, 169, 170], "source_text_returned_by_api": False}),
            source("drikpanchang-delhi-pitru-paksha-2026", "2026 Pitru Paksha Shraddha Dates for Delhi", "Drik Panchang", "Current practitioner English date/label and tithi-applicability reference; not universal ritual authority", "citation_only", url=fixture["sources"][1]["url"], observed_fetch={"status": 200, "final_url": fixture["sources"][1]["final_url"], "response_bytes": fixture["sources"][1]["observed_responses"][0]["response_bytes"], "response_sha256": fixture["sources"][1]["observed_responses"][0]["response_sha256"], "strict_utf8": True, "observed_at": fixture["generated_at"]}),
            source("drikpanchang-delhi-pitru-paksha-hindi-2026", "2026 पितृ पक्ष श्राद्ध के दिन दिल्ली के लिए", "Drik Panchang", "Current practitioner Hindi label and explanation reference", "citation_only", url=fixture["sources"][2]["url"], observed_fetch={"status": 200, "final_url": fixture["sources"][2]["final_url"], "response_bytes": fixture["sources"][2]["response_bytes"], "response_sha256": fixture["sources"][2]["response_sha256"], "strict_utf8": True, "observed_at": fixture["generated_at"]}),
            source("utsav-pitra-paksha", "Pitra Paksha", "Utsav, Ministry of Tourism, Government of India", "Official public-cultural account of ancestor remembrance, prayer, food and water offerings; belief descriptions are not guaranteed outcomes", "citation_only", url="https://utsav.gov.in/public/view-event/pitra-paksha-1", observed_fetch={"status": 200, "final_url": "https://utsav.gov.in/public/view-event/pitra-paksha-1", "response_bytes": 32177, "response_sha256": "f8f2c2e6ec2a2a6a2a342f616c7eac2c2a822b0bd63e56dca7286ea8d3c62b0f", "strict_utf8": True, "observed_at": "2026-08-07"}),
            source("utsav-mahalaya-amavasai-tharpanam", "Mahalaya Ammavasai Tharpanam", "Utsav, Ministry of Tourism, Government of India", "Official Tiruchirappalli/Tamil Nadu regional context; not a universal instruction or safe-water authorisation", "citation_only", url="https://utsav.gov.in/view-event/mahalaya-ammavasai-tharpanam-1", observed_fetch={"status": 200, "final_url": "https://utsav.gov.in/view-event/mahalaya-ammavasai-tharpanam-1", "response_bytes": 33120, "response_sha256": "11713c0133bc8338cfd5b786732681c14223d419c525e15bf3a13aa48f33541c", "strict_utf8": True, "observed_at": "2026-08-07"}),
            source("devam-pitru-paksha-care-boundary", "Devam ancestor-remembrance care and authority boundary", "Devam", "Editorial safety, privacy, grief, non-coercion and no-invented-ritual boundary", "product_cleared"),
        ],
        "localized_content": [localized("en", slugs), localized("hi", slugs)],
        "product_status": {"classification": "user_complete_lane", "completed_dimensions": {"applicability": True, "timing": True, "significance": True, "origin_narratives": True, "typical_practice": True, "actionable_vidhi": True, "materials_and_substitutions": True, "variants": True, "evidence": True}, "open_gaps": [], "review_status": "internal_beta_reviewed"},
    }
    rendered = json.dumps(pack, ensure_ascii=False, indent=2, sort_keys=True) + "\n"
    if OUTPUT.exists() and OUTPUT.read_text(encoding="utf-8") != rendered:
        raise SystemExit("Existing Pitru Paksha output drift")
    if not OUTPUT.exists():
        OUTPUT.write_text(rendered, encoding="utf-8", newline="\n")
    print(json.dumps({"result": "PASS", "output": OUTPUT.relative_to(ROOT).as_posix(), "bytes": len(rendered.encode("utf-8")), "sha256": sha256(OUTPUT), "calendar_days": len(fixture["days"]), "calendar_observance_slugs": len(calendar_slugs), "total_observance_slugs": len(slugs)}, ensure_ascii=False))


if __name__ == "__main__":
    main()

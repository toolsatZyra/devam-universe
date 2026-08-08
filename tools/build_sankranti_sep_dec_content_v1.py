#!/usr/bin/env python3
"""Build the bounded September-December Sankranti actionability lane."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
FIXTURE = ROOT / "knowledge_packs/panchang/sankranti-india-september-december-2026-v1.json"
OUTPUT = ROOT / "knowledge_packs/rituals/sankranti-september-december-general-content-v1.json"
FIXTURE_SHA256 = "61f14143db751cafc99375871d2304994d7661c433f37bb8e847ae8cef01ca0f"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def source(
    source_id: str,
    title: str,
    publisher: str,
    source_role: str,
    rights_lane: str,
    *,
    url: str | None = None,
    artifact_sha256: str | None = None,
    citation_coordinates: dict | None = None,
    observed_fetch: dict | None = None,
) -> dict:
    return {
        "source_id": source_id,
        "title": title,
        "publisher": publisher,
        "source_role": source_role,
        "rights_lane": rights_lane,
        "url": url,
        "artifact_sha256": artifact_sha256,
        "citation_coordinates": citation_coordinates,
        "observed_fetch": observed_fetch,
    }


CONFIG = {
    "kanya-sankranti": {
        "name_en": "Kanya Sankranti",
        "name_hi": "कन्या संक्रांति",
        "date": "17 September 2026",
        "date_hi": "17 सितंबर 2026",
        "transition_en": "the Sun's sidereal transition from Simha to Kanya",
        "transition_hi": "सूर्य का निरयन सिंह से कन्या राशि में प्रवेश",
        "variant_en": "In Bengal, the same date is associated with Vishwakarma Puja. That workplace and artisan lane is separate and should be used only when the user's region and practice match it.",
        "variant_hi": "बंगाल में यही दिन विश्वकर्मा पूजा से जुड़ता है। कार्यस्थल और शिल्पकारों की वह विधि अलग है और केवल उपयुक्त क्षेत्र तथा परंपरा में ही लागू होती है।",
        "variant_sources": ["devam-vishwakarma-bengal-lane"],
    },
    "tula-sankranti": {
        "name_en": "Tula Sankranti",
        "name_hi": "तुला संक्रांति",
        "date": "17 October 2026",
        "date_hi": "17 अक्टूबर 2026",
        "transition_en": "the Sun's sidereal transition from Kanya to Tula",
        "transition_hi": "सूर्य का निरयन कन्या से तुला राशि में प्रवेश",
        "variant_en": "At Talakaveri in Kodagu, Karnataka, Tula Sankramana is observed as Kaveri Sankramana and centres on the temple's Theerthodbhava. Temple travel, bathing and live schedules belong to that separate regional participant lane.",
        "variant_hi": "कर्नाटक के कोडगु स्थित तलकावेरी में तुला संक्रमण को कावेरी संक्रमण के रूप में मनाया जाता है और मंदिर का तीर्थोद्भव इसका केंद्र है। मंदिर-यात्रा, स्नान और जीवंत समय-सारिणी उस अलग क्षेत्रीय सहभागिता-पथ के विषय हैं।",
        "variant_sources": ["utsav-tula-kaveri-sankramana"],
    },
    "vrishchika-sankranti": {
        "name_en": "Vrishchika Sankranti",
        "name_hi": "वृश्चिक संक्रांति",
        "date": "16 November 2026",
        "date_hi": "16 नवंबर 2026",
        "transition_en": "the Sun's sidereal transition from Tula to Vrishchika",
        "transition_hi": "सूर्य का निरयन तुला से वृश्चिक राशि में प्रवेश",
        "variant_en": "This lane offers only a general personal remembrance. A family, temple or regional Vrishchika Sankranti procedure is not inferred from the solar ingress alone.",
        "variant_hi": "यह पथ केवल सामान्य व्यक्तिगत स्मरण देता है। केवल सौर प्रवेश के आधार पर किसी परिवार, मंदिर या क्षेत्र की वृश्चिक संक्रांति विधि नहीं मानी जाती।",
        "variant_sources": ["devam-sankranti-editorial-boundary"],
    },
    "dhanu-sankranti": {
        "name_en": "Dhanu Sankranti",
        "name_hi": "धनु संक्रांति",
        "date": "16 December 2026",
        "date_hi": "16 दिसंबर 2026",
        "transition_en": "the Sun's sidereal transition from Vrishchika to Dhanu",
        "transition_hi": "सूर्य का निरयन वृश्चिक से धनु राशि में प्रवेश",
        "variant_en": "Dhanu-named month, temple and regional observances are not automatically the same as this ingress-day personal lane; use the user's family or local authority for any fuller form.",
        "variant_hi": "धनु नाम वाले मासिक, मंदिर और क्षेत्रीय उत्सव अपने-आप इस प्रवेश-दिवस के व्यक्तिगत पथ के समान नहीं हैं; विस्तृत विधि के लिए परिवार या स्थानीय अधिकारी का अनुसरण करें।",
        "variant_sources": ["devam-sankranti-editorial-boundary"],
    },
}


def materials(language: str, authority_source: str) -> list[dict]:
    if language == "hi":
        return [
            {"item": "एक शांत, साफ स्थान", "required": True, "substitutions": ["जहाँ हैं वहीं कुछ क्षण शांत बैठें"], "source_ids": [authority_source]},
            {"item": "सुरक्षित हो तो जल का छोटा पात्र या दीप", "required": False, "substitutions": ["बिना किसी सामग्री के प्रार्थना करें"], "source_ids": [authority_source]},
            {"item": "अपनी सामर्थ्य के अनुसार दान या सेवा", "required": False, "substitutions": ["किसी व्यक्ति की व्यावहारिक सहायता या समय दें"], "source_ids": ["drikpanchang-sankranti-calendar-delhi-2026"]},
        ]
    return [
        {"item": "A quiet, clean place", "required": True, "substitutions": ["Pause where you are without arranging an altar"], "source_ids": [authority_source]},
        {"item": "A small vessel of clean water or a lamp, only when safe and already familiar", "required": False, "substitutions": ["Pray without materials"], "source_ids": [authority_source]},
        {"item": "A donation or act of service within your means", "required": False, "substitutions": ["Offer practical help or time instead of money or goods"], "source_ids": ["drikpanchang-sankranti-calendar-delhi-2026"]},
    ]


def procedures(slug: str, language: str, cfg: dict) -> list[dict]:
    hi = language == "hi"
    date = cfg["date_hi" if hi else "date"]
    common_sources = ["devam-sankranti-sep-dec-date-fixture", "drikpanchang-sankranti-calendar-delhi-2026", "devam-sankranti-editorial-boundary"]
    mats = materials(language, "devam-sankranti-editorial-boundary")
    if hi:
        tier_data = [
            ("minimum", "पाँच मिनट का संक्रांति स्मरण", "accessible_short", 5, [
                (f"इस दिल्ली/भारत 2026 संदर्भ में {date} को इस संक्रांति का दिन मानें; पुण्यकाल या स्थानीय विधि के लिए अपने स्थान का पंचांग पूछें।", "तिथि तय है, पर एक सार्वभौम पुण्यकाल तय नहीं है।"),
                ("सूर्य और समय के परिवर्तन को याद करते हुए परिचित प्रार्थना कहें या कुछ क्षण कृतज्ञता में मौन रहें।", "यह बिना गढ़े हुए मंत्र के एक सुलभ स्मरण है।"),
                ("अपनी सामर्थ्य के अनुसार भोजन, वस्त्र, धन, समय या उपयोगी सहायता दें।", "सामान्य संक्रांति संदर्भ में दान को प्रमुख आचरण बताया गया है।"),
            ]),
            ("standard", "घर का सरल संक्रांति क्रम", "traditional_household", 15, [
                (f"परिवार की परंपरा और स्थानीय पंचांग से {date} तथा उपयुक्त समय की पुष्टि करें।", "क्षेत्र और स्थान के अनुसार समय तथा विधि बदल सकती है।"),
                ("स्नान या सामान्य स्वच्छता के बाद शांत स्थान तैयार करें; असुरक्षित नदी, आग या भीड़ में न जाएँ।", "स्वच्छता को सुरक्षित घरेलू रूप में रखा गया है।"),
                ("परिवार-परिचित सूर्य प्रार्थना करें; सुरक्षित और परिचित हो तो जल या दीप रखें, अन्यथा बिना सामग्री के स्मरण करें।", "औपचारिक मंत्र या अर्घ्य-विधि का आविष्कार नहीं किया जाता।"),
                ("दान या सेवा करके परिवार के परिचित समापन का पालन करें।", "कर्म और कृतज्ञता को दिन के अर्थ से जोड़ता है।"),
            ]),
            ("elaborate", "परिवार, गुरु या मंदिर-निर्देशित पूर्ण रूप", "fuller_family_or_teacher_led", 30, [
                ("पहले यह तय करें कि कौन-सा परिवार, मंदिर, गुरु या क्षेत्रीय पंचांग इस विधि का अधिकारी है।", "सौर प्रवेश अकेले पूर्ण अनुष्ठान सिद्ध नहीं करता।"),
                ("उसी अधिकारी से पुण्यकाल, संकल्प, मंत्र, अर्घ्य, नैवेद्य, दान और समापन की वास्तविक सूची लें।", "विस्तृत विधि को जिम्मेदार जीवित परंपरा के पास रखा जाता है।"),
                ("केवल वही सामग्री और क्रम अपनाएँ जिन्हें आप समझते हैं और सुरक्षित रूप से कर सकते हैं; शेष को छोड़ें।", "अनुमानित विधि से बचते हुए सहभागिता संभव रहती है।"),
            ]),
        ]
    else:
        tier_data = [
            ("minimum", "Five-minute Sankranti remembrance", "accessible_short", 5, [
                (f"Use {date} for this Delhi/India 2026 reference; ask a location-specific Panchang for punya kala or a local procedure.", "The civil date is resolved, but one universal ritual window is not."),
                ("Remember the Sun and the transition of time with a familiar prayer or a quiet moment of gratitude.", "This is an accessible remembrance without inventing a mantra."),
                ("Offer food, clothing, money, time or useful help within your means.", "The general Sankranti reference identifies charity as a central activity."),
            ]),
            ("standard", "Simple household Sankranti sequence", "traditional_household", 15, [
                (f"Confirm {date} and the relevant time with the family tradition and a Panchang for your location.", "Timing and practice can change with place and authority."),
                ("After an ordinary bath or wash, prepare a quiet place; do not enter unsafe water, use unsafe flame or join an unmanaged crowd.", "This preserves cleanliness in a safe household form."),
                ("Say a family-known Surya prayer; keep water or a lamp only if that is familiar and safe, otherwise remember without materials.", "The lane does not invent formal mantra or arghya rules."),
                ("Make a donation or perform one useful act of service, then follow the family's familiar close.", "This joins the day's charitable emphasis to practical action."),
            ]),
            ("elaborate", "Family-, teacher- or temple-directed fuller form", "fuller_family_or_teacher_led", 30, [
                ("First identify the family, temple, teacher or regional Panchang that has authority for the fuller procedure.", "A solar ingress alone does not establish a complete ritual."),
                ("Ask that authority for the actual punya kala, sankalpa, mantra, arghya, offering, donation and closing sequence.", "Detailed practice remains with a responsible living tradition."),
                ("Use only materials and steps you understand and can perform safely; omit the rest.", "Participation remains possible without guessing missing ritual instructions."),
            ]),
        ]
    result = []
    for tier, label, form, minutes, steps in tier_data:
        result.append({
            "procedure_id": f"sankranti-september-december-general-content-v1-{slug}-{language}-{tier}-v1",
            "label": label,
            "tier": tier,
            "setting": "individual" if tier == "minimum" else "family_led",
            "authority_scope": "Accessible personal remembrance" if tier == "minimum" else "Family- or living-authority-led observance",
            "form": form,
            "estimated_minutes": minutes,
            "materials": mats,
            "steps": [
                {"ordinal": index, "instruction": instruction, "why": why, "source_ids": common_sources, "optional": False}
                for index, (instruction, why) in enumerate(steps, start=1)
            ],
            "closing": {
                "text": "अपनी प्रार्थना को कृतज्ञता और एक जिम्मेदार कार्य के साथ समाप्त करें।" if hi else "Close with gratitude and one responsible action.",
                "source_ids": ["devam-sankranti-editorial-boundary"],
                "scope_note": "परिवार की विधि को प्राथमिकता दें।" if hi else "Family practice takes priority.",
            },
            "source_ids": common_sources,
        })
    return result


def localized(slug: str, language: str, cfg: dict) -> dict:
    hi = language == "hi"
    name = cfg["name_hi" if hi else "name_en"]
    date = cfg["date_hi" if hi else "date"]
    transition = cfg["transition_hi" if hi else "transition_en"]
    variant = cfg["variant_hi" if hi else "variant_en"]
    if hi:
        short = f"{name} इस दिल्ली/भारत संदर्भ में {date} को है। सटीक पुण्यकाल स्थान के अनुसार लें; छोटा सुरक्षित रूप सूर्य-स्मरण, कृतज्ञता और सामर्थ्य के अनुसार दान या सेवा है।"
        significance = f"यह दिन {transition} को चिह्नित करता है। संक्रांति सौर मास-परिवर्तन की पहचान है; इससे एक ही राष्ट्रीय कथा या एक ही घरेलू विधि सिद्ध नहीं होती।"
        origin_title = "एक सौर संक्रमण, कोई एक सार्वभौम उत्पत्ति-कथा नहीं"
        origin_summary = f"{name} का नाम {transition} से आता है। यह कैलेंडर-आधारित पहचान है; अलग क्षेत्रों में इसके साथ अलग देवता, नदी, मंदिर, दान और उत्सव-परंपराएँ जुड़ सकती हैं।"
        typical = "सामान्य संक्रांति संदर्भ दान को उपयुक्त मानता है। सूर्य-स्मरण, स्नान, अर्घ्य, भोजन और मंदिर-भागीदारी परिवार तथा क्षेत्र के अनुसार बदलते हैं और इस पथ में अनिवार्य नहीं हैं।"
        safety = ["असुरक्षित या प्रदूषित जल में प्रवेश न करें।", "दीप को बिना देखरेख न छोड़ें और जल, आग या अर्पण को विद्युत उपकरणों के पास न रखें।", "व्रत, आहार, औषधि, मंत्र या फल की कोई सार्वभौम सलाह नहीं दी जाती।", "परिवार, मंदिर या स्थानीय पंचांग की विधि इस सामान्य पथ पर प्राथमिकता रखती है।"]
    else:
        short = f"{name} falls on {date} in this Delhi/India reference. Obtain the exact punya kala for your location; a safe short form is Surya remembrance, gratitude, and charity or service within your means."
        significance = f"The day marks {transition}. Sankranti identifies a solar-month transition; it does not establish one national origin story or one universal household procedure."
        origin_title = "A solar transition, not one universal origin story"
        origin_summary = f"{name} is named for {transition}. This is a calendrical identity; different regions may attach distinct deity, river, temple, donation and festival traditions to it."
        typical = "The general Sankranti reference treats charity as appropriate. Surya remembrance, bathing, arghya, foods and temple participation vary by family and region and are not made mandatory in this lane."
        safety = ["Do not enter unsafe or polluted water.", "Do not leave a lamp unattended or place water, flame or offerings near electrical equipment.", "No universal fasting, food, medical, mantra or promised-outcome advice is supplied.", "Family, temple and location-specific Panchang practice overrides this general lane."]
    return {
        "language_code": language,
        "observance_slugs": [slug],
        "title": name,
        "short_answer": short,
        "significance": {"text": significance, "source_ids": ["devam-sankranti-sep-dec-date-fixture", "drikpanchang-sankranti-calendar-delhi-2026"], "scope_note": "Bounded general India personal lane; regional forms remain separate."},
        "origin_narratives": [{"narrative_id": f"{slug}-solar-transition", "title": origin_title, "summary": origin_summary, "tradition_scope": "General calendrical explanation", "source_ids": ["drikpanchang-sankranti-calendar-delhi-2026"], "universal_origin_claimed": False}],
        "typical_practices": [{"practice_id": f"{slug}-charity-and-remembrance", "population_scope": "General personal observance where Sankranti is already recognised", "description": typical, "source_ids": ["drikpanchang-sankranti-calendar-delhi-2026", "devam-sankranti-editorial-boundary"], "instructional": False}],
        "procedures": procedures(slug, language, cfg),
        "variants": [{"variant_id": f"{slug}-regional-boundary", "scope": "Regional and family variation", "difference": variant, "source_ids": cfg["variant_sources"], "separate_lane_required": True}],
        "safety_and_boundaries": safety,
    }


def main() -> None:
    if sha256(FIXTURE) != FIXTURE_SHA256:
        raise SystemExit("Sankranti calendar fixture drift")
    fixture = json.loads(FIXTURE.read_text(encoding="utf-8"))
    expected = [(slug, cfg["date"]) for slug, cfg in CONFIG.items()]
    actual = [(row["observance_slug"], f"{int(row['civil_date'][8:10])} " + {"09": "September", "10": "October", "11": "November", "12": "December"}[row["civil_date"][5:7]] + f" {row['civil_date'][:4]}") for row in fixture["ingresses"]]
    if actual != expected:
        raise SystemExit(f"Sankranti fixture identity drift: {actual}")

    slugs = list(CONFIG)
    pack = {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1",
        "lane_id": "sankranti-september-december-general-content-v1",
        "observance_slugs": slugs,
        "applicability": {
            "region_codes": ["general-india", "north-india", "west-india", "south-india", "bengal", "kashi-varanasi", "bihar-purvanchal"],
            "tradition_codes": ["family-specific-hindu", "smarta-north-india", "smarta-west-india", "smarta-south-india", "regional-bengal", "regional-kashi-varanasi", "surya-chhath-bihar-purvanchal"],
            "context_pairs": [
                {"region_code": "general-india", "tradition_code": "family-specific-hindu"},
                {"region_code": "north-india", "tradition_code": "smarta-north-india"},
                {"region_code": "west-india", "tradition_code": "smarta-west-india"},
                {"region_code": "south-india", "tradition_code": "smarta-south-india"},
                {"region_code": "bengal", "tradition_code": "regional-bengal"},
                {"region_code": "kashi-varanasi", "tradition_code": "regional-kashi-varanasi"},
                {"region_code": "bihar-purvanchal", "tradition_code": "surya-chhath-bihar-purvanchal"},
            ],
            "settings": ["household", "individual", "family_led", "temple"],
            "family_practice_overrides_generic_guidance": True,
            "material_context_questions": ["Which city and timezone apply?", "Does your family treat this Sankranti as a personal remembrance, a household observance, or part of a named regional festival?", "Do you have a family priest, temple or Panchang that supplies the local punya kala and fuller procedure?"],
        },
        "calendar": {"resolution_source_ids": ["devam-sankranti-sep-dec-date-fixture", "drikpanchang-sankranti-calendar-delhi-2026"], "timing_kind": "astronomical", "location_aware": True, "tradition_aware": True, "decision_rule_id": "devam-india-sankranti-september-december-2026-v1", "closing_decision_rule_id": None, "live_schedule_required": True, "freshness_note": "The four civil dates are fixed for the Delhi/India 2026 reference. Punya kala and any fuller regional or temple practice must be resolved for the user's location and authority."},
        "sources": [
            source("devam-sankranti-sep-dec-date-fixture", "Devam September-December 2026 Sankranti date fixture", "Devam", "Deterministic Delhi/India civil-date and sidereal ingress identity; no ritual timing or procedure", "derivative_allowed", artifact_sha256=FIXTURE_SHA256, citation_coordinates={"path": "knowledge_packs/panchang/sankranti-india-september-december-2026-v1.json", "pointers": ["/ingresses/0", "/ingresses/1", "/ingresses/2", "/ingresses/3"]}),
            source("drikpanchang-sankranti-calendar-delhi-2026", "2026 Sankranti Calendar for New Delhi", "Drik Panchang", "Current practitioner date/ingress comparison and general charity context; not universal ritual authority", "citation_only", url=fixture["source"]["url"], observed_fetch={"status": fixture["source"]["status"], "final_url": fixture["source"]["final_url"], "response_bytes": fixture["source"]["response_bytes"], "response_sha256": fixture["source"]["response_sha256"], "strict_utf8": fixture["source"]["strict_utf8"], "observed_at": fixture["source"]["fetched_at_utc"]}),
            source("utsav-tula-kaveri-sankramana", "Tula Sankramana / Kaveri Sankramana", "Utsav, Ministry of Tourism, Government of India", "Official Karnataka regional context for Talakaveri and Theerthodbhava; not the generic household procedure", "citation_only", url="https://utsav.gov.in/view-event/tula-sankramana-kaveri-sankramana", observed_fetch={"status": 200, "final_url": "https://utsav.gov.in/view-event/tula-sankramana-kaveri-sankramana", "response_bytes": 33405, "response_sha256": "dbf800f0b4ec66770292cdd51299edfd41bd6052d71255bca7758f8076bc57d7", "strict_utf8": True, "observed_at": "2026-08-07"}),
            source("devam-vishwakarma-bengal-lane", "Bengal Vishwakarma Puja workplace content lane", "Devam", "Separate, source-grounded Bengal Kanya Sankranti association and actionability lane", "derivative_allowed", artifact_sha256="1d57c055654685481e90f4e8dc190385adfa06486313f8a844bfcfd6840b4b39", citation_coordinates={"path": "knowledge_packs/rituals/vishwakarma-puja-bengal-workplace-content-v1.json"}),
            source("devam-sankranti-editorial-boundary", "Devam Sankranti safety and authority boundary", "Devam", "Editorial constraint preventing unsafe bathing/flame, invented liturgy, universal timing and regional conflation", "product_cleared"),
        ],
        "localized_content": [localized(slug, language, cfg) for slug, cfg in CONFIG.items() for language in ("en", "hi")],
        "product_status": {"classification": "user_complete_lane", "completed_dimensions": {"applicability": True, "timing": True, "significance": True, "origin_narratives": True, "typical_practice": True, "actionable_vidhi": True, "materials_and_substitutions": True, "variants": True, "evidence": True}, "open_gaps": [], "review_status": "internal_beta_reviewed"},
    }
    rendered = json.dumps(pack, ensure_ascii=False, indent=2, sort_keys=True) + "\n"
    if OUTPUT.exists() and OUTPUT.read_text(encoding="utf-8") != rendered:
        raise SystemExit("Existing Sankranti output drift")
    if not OUTPUT.exists():
        OUTPUT.write_text(rendered, encoding="utf-8", newline="\n")
    print(json.dumps({"result": "PASS", "output": OUTPUT.relative_to(ROOT).as_posix(), "bytes": len(rendered.encode("utf-8")), "sha256": sha256(OUTPUT), "observance_slugs": slugs}, ensure_ascii=False))


if __name__ == "__main__":
    main()

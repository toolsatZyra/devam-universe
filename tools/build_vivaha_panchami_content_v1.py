#!/usr/bin/env python3
"""Build the bounded current-contract North India Vivaha Panchami lane."""

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
OUTPUT = PACK_DIR / "vivaha-panchami-north-india-content-v1.json"
LEGACY_PATH = PACK_DIR / "vivaha-panchami-north-india-v1.json"
FIXTURE_PATH = PANCHANG_DIR / "vivaha-panchami-delhi-2026-v1.json"
EXPECTED = {
    LEGACY_PATH: (20333, "938384b6ddc596245047c420810f1db2428cd64cdd40ee02a7434505371e8f5d"),
    FIXTURE_PATH: (5468, "5ac334e9efa8fe548b572ef6ce5d4d982206cc774a4a2672735c75b665a7770c"),
}


def verify_inputs() -> None:
    for path, (size, digest) in EXPECTED.items():
        payload = path.read_bytes()
        if len(payload) != size or hashlib.sha256(payload).hexdigest() != digest:
            raise ValueError(f"Vivaha Panchami frozen input drift: {path}")


def details(language: str) -> dict[str, Any]:
    if language == "en":
        return {
            "significance": {
                "text": "Vivaha Panchami commemorates the Rama-Sita marriage on Margashirsha Shukla Panchami. This North India Smarta lane uses an identified Ramayana or family account for remembrance and turns the theme toward mutual respect, trust and responsibility without reconstructing a wedding or puja.",
                "source_ids": ["drikpanchang-delhi-vivaha-panchami-2026", "incredible-india-orchha-vivaha-panchami-2026", "pib-ayodhya-vivaha-panchami-context"],
                "scope_note": "The festival identity is attributable; the interpretation and home form are bounded Devam synthesis, not one universal Ramayana or ritual rule.",
            },
            "origin_narratives": [{
                "narrative_id": "rama-sita-marriage-commemoration",
                "title": "The Rama-Sita marriage remembrance",
                "summary": "The current sources identify Vivaha Panchami with the divine marriage or union of Rama and Sita and connect the observance with Mithila or Janakpur, Ayodhya and Orchha. Devam does not blend their public forms or claim that one retelling settles every Ramayana tradition.",
                "tradition_scope": "North India festival identity with distinct regional public contexts",
                "source_ids": ["drikpanchang-delhi-vivaha-panchami-2026", "incredible-india-orchha-vivaha-panchami-2026", "pib-ayodhya-vivaha-panchami-context"],
                "universal_origin_claimed": False,
            }],
            "typical_practices": [
                {
                    "practice_id": "source-labelled-rama-sita-remembrance",
                    "population_scope": "North India Smarta individual or household",
                    "description": "Use a familiar, identified Ramayana passage, retelling, prayer or teacher-led account; preserve its edition and variant, reflect on respectful responsibility, and choose one practical act.",
                    "source_ids": ["drikpanchang-delhi-vivaha-panchami-2026", "devam-vivaha-panchami-safety-boundary"],
                    "instructional": False,
                },
                {
                    "practice_id": "established-public-or-temple-participation",
                    "population_scope": "Family, temple or public-festival participant",
                    "description": "Orchha, Ayodhya and Janakpur-related settings may have distinct programmes and wedding imagery. Participate only through the responsible current organiser rather than copying a procession or liturgy at home.",
                    "source_ids": ["incredible-india-orchha-vivaha-panchami-2026", "pib-ayodhya-vivaha-panchami-context", "devam-vivaha-panchami-safety-boundary"],
                    "instructional": False,
                },
            ],
            "variants": [
                {
                    "variant_id": "janakpur-ayodhya-orchha",
                    "scope": "Janakpur or Mithila, Ayodhya and Orchha public contexts",
                    "difference": "Their local institutions, stories, calendars, processions and temple programmes remain separately attributable and are not one generic household procedure.",
                    "source_ids": ["drikpanchang-delhi-vivaha-panchami-2026", "incredible-india-orchha-vivaha-panchami-2026", "pib-ayodhya-vivaha-panchami-context"],
                    "separate_lane_required": True,
                },
                {
                    "variant_id": "ramayana-version",
                    "scope": "Valmiki, Ramcharitmanas and other Ramayana tellings",
                    "difference": "Narrative details and interpretation must stay attached to the edition, retelling, region or teacher used; this lane supplies no synthetic universal episode.",
                    "source_ids": ["devam-vivaha-panchami-safety-boundary"],
                    "separate_lane_required": True,
                },
                {
                    "variant_id": "home-remembrance-and-formal-programme",
                    "scope": "Material-free home reflection versus established family, temple or public programme",
                    "difference": "Reading, gratitude and one act of respect do not import formal wedding reenactment, puja, mantra, offering, procession or vow.",
                    "source_ids": ["incredible-india-orchha-vivaha-panchami-2026", "devam-vivaha-panchami-safety-boundary"],
                    "separate_lane_required": False,
                },
            ],
            "safety_and_boundaries": [
                "Identify the Ramayana edition, retelling, temple, region or teacher used; do not present a synthesis as source text.",
                "Janakpur, Ayodhya and Orchha remain distinct contexts with current local organisers.",
                "No fast, food rule, medical advice, formal wedding reenactment, puja, mantra, offering, procession or vow is prescribed.",
                "No real-world marriage or gender role is imposed, and no outcome about spouse, fertility, progeny, prosperity or merit is promised.",
                "The current public-event schedule, access, crowd and travel situation must be verified separately.",
            ],
        }
    return {
        "significance": {
            "text": "विवाह पंचमी मार्गशीर्ष शुक्ल पंचमी पर राम-सीता विवाह का स्मरण है। यह उत्तर भारत स्मार्त मार्ग किसी पहचाने हुए रामायण या पारिवारिक वृत्तान्त से स्मरण करता है और बिना विवाह या पूजा की पुनर्रचना किए परस्पर सम्मान, विश्वास और जिम्मेदारी पर चिंतन कराता है।",
            "source_ids": ["drikpanchang-delhi-vivaha-panchami-2026", "incredible-india-orchha-vivaha-panchami-2026", "pib-ayodhya-vivaha-panchami-context"],
            "scope_note": "उत्सव-पहचान स्रोत-समर्थित है; अर्थ और घरेलू रूप सीमित Devam संश्लेषण है, सार्वभौमिक रामायण या अनुष्ठान-नियम नहीं।",
        },
        "origin_narratives": [{
            "narrative_id": "rama-sita-marriage-commemoration",
            "title": "राम-सीता विवाह का स्मरण",
            "summary": "वर्तमान स्रोत विवाह पंचमी को राम और सीता के दिव्य विवाह या मिलन से जोड़ते हैं और मिथिला या जनकपुर, अयोध्या तथा ओरछा का संदर्भ देते हैं। Devam उनके सार्वजनिक रूपों को मिलाता नहीं और किसी एक कथा को हर रामायण परम्परा का अंतिम रूप नहीं मानता।",
            "tradition_scope": "अलग क्षेत्रीय सार्वजनिक संदर्भों सहित उत्तर भारत उत्सव-पहचान",
            "source_ids": ["drikpanchang-delhi-vivaha-panchami-2026", "incredible-india-orchha-vivaha-panchami-2026", "pib-ayodhya-vivaha-panchami-context"],
            "universal_origin_claimed": False,
        }],
        "typical_practices": [
            {
                "practice_id": "source-labelled-rama-sita-remembrance",
                "population_scope": "उत्तर भारत स्मार्त व्यक्ति या परिवार",
                "description": "परिचित और पहचाने हुए रामायण-अंश, पुनर्कथा, प्रार्थना या शिक्षक-वृत्तान्त का उपयोग करें; संस्करण और भिन्नता सुरक्षित रखें, सम्मानपूर्ण जिम्मेदारी पर सोचें और एक व्यावहारिक कर्म चुनें।",
                "source_ids": ["drikpanchang-delhi-vivaha-panchami-2026", "devam-vivaha-panchami-safety-boundary"],
                "instructional": False,
            },
            {
                "practice_id": "established-public-or-temple-participation",
                "population_scope": "परिवार, मंदिर या सार्वजनिक उत्सव सहभागी",
                "description": "ओरछा, अयोध्या और जनकपुर-संबंधित स्थानों में अलग कार्यक्रम और विवाह-रूपक हो सकते हैं। घर में जुलूस या विधि की नकल करने के बजाय वर्तमान जिम्मेदार आयोजक के निर्देश में भाग लें।",
                "source_ids": ["incredible-india-orchha-vivaha-panchami-2026", "pib-ayodhya-vivaha-panchami-context", "devam-vivaha-panchami-safety-boundary"],
                "instructional": False,
            },
        ],
        "variants": [
            {
                "variant_id": "janakpur-ayodhya-orchha",
                "scope": "जनकपुर या मिथिला, अयोध्या और ओरछा सार्वजनिक संदर्भ",
                "difference": "स्थानीय संस्था, कथा, पंचांग, जुलूस और मंदिर-कार्यक्रम अलग स्रोतों से जुड़े रहें; वे एक सामान्य घरेलू विधि नहीं हैं।",
                "source_ids": ["drikpanchang-delhi-vivaha-panchami-2026", "incredible-india-orchha-vivaha-panchami-2026", "pib-ayodhya-vivaha-panchami-context"],
                "separate_lane_required": True,
            },
            {
                "variant_id": "ramayana-version",
                "scope": "वाल्मीकि, रामचरितमानस और अन्य रामायण कथाएँ",
                "difference": "कथा-विवरण और अर्थ उपयोग किए गए संस्करण, पुनर्कथा, क्षेत्र या शिक्षक से जुड़े रहें; यह मार्ग एक मिली-जुली सार्वभौमिक कथा नहीं बनाता।",
                "source_ids": ["devam-vivaha-panchami-safety-boundary"],
                "separate_lane_required": True,
            },
            {
                "variant_id": "home-remembrance-and-formal-programme",
                "scope": "सामग्री-रहित घरेलू चिंतन और स्थापित परिवार, मंदिर या सार्वजनिक कार्यक्रम",
                "difference": "पाठ, कृतज्ञता और सम्मान का कर्म औपचारिक विवाह-अभिनय, पूजा, मंत्र, अर्पण, जुलूस या व्रत को आयात नहीं करते।",
                "source_ids": ["incredible-india-orchha-vivaha-panchami-2026", "devam-vivaha-panchami-safety-boundary"],
                "separate_lane_required": False,
            },
        ],
        "safety_and_boundaries": [
            "उपयोग किए गए रामायण संस्करण, पुनर्कथा, मंदिर, क्षेत्र या शिक्षक की पहचान रखें; संश्लेषण को मूल पाठ न कहें।",
            "जनकपुर, अयोध्या और ओरछा अलग संदर्भ हैं और वर्तमान स्थानीय आयोजक जिम्मेदार हैं।",
            "उपवास, आहार, चिकित्सा-सलाह, औपचारिक विवाह-अभिनय, पूजा, मंत्र, अर्पण, जुलूस या व्रत नहीं बताया जाता।",
            "वास्तविक विवाह या लैंगिक भूमिका नहीं थोपी जाती और जीवनसाथी, संतान, समृद्धि या पुण्य का फल नहीं वादा किया जाता।",
            "सार्वजनिक कार्यक्रम, प्रवेश, भीड़ और यात्रा की स्थिति अलग से जाँचें।",
        ],
    }


def build() -> dict[str, Any]:
    verify_inputs()
    legacy = load("vivaha-panchami-north-india-v1.json")
    fixture = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    if fixture["contract"] != "DEVAM_BOUNDED_VIVAHA_PANCHAMI_CALENDAR_FIXTURE_V1" or fixture["scope"]["selected_civil_date"] != "2026-12-14":
        raise ValueError("Vivaha Panchami fixture identity drift")
    if fixture["scope"]["universal_india_claim"] is not False or any(fixture["denials"].values()):
        raise ValueError("Vivaha Panchami scope or denial drift")

    observed = {item["source_id"]: item for item in fixture["sources"]}
    lane_id = "vivaha-panchami-north-india-content-v1"
    sources = [
        source("devam-vivaha-panchami-calendar-fixture", "Bounded Delhi Vivaha Panchami calendar fixture", "Devam", "Deterministic Delhi 2026 date and scope fixture; not ritual authority", "derivative_allowed", artifact_sha256=EXPECTED[FIXTURE_PATH][1], citation_coordinates={"path": "knowledge_packs/panchang/vivaha-panchami-delhi-2026-v1.json"}),
        source("drikpanchang-delhi-vivaha-panchami-2026", observed["drikpanchang-delhi-vivaha-panchami-2026"]["title"], observed["drikpanchang-delhi-vivaha-panchami-2026"]["publisher"], "Current practitioner identity, tithi and Delhi date context; not complete calendar or vidhi authority", "citation_only", url=observed["drikpanchang-delhi-vivaha-panchami-2026"]["url"], observed_fetch=observed["drikpanchang-delhi-vivaha-panchami-2026"]["observed_fetch"]),
        source("incredible-india-orchha-vivaha-panchami-2026", observed["incredible-india-orchha-vivaha-panchami-2026"]["title"], observed["incredible-india-orchha-vivaha-panchami-2026"]["publisher"], "Official Orchha identity and public-festival context; not universal household procedure", "citation_only", url=observed["incredible-india-orchha-vivaha-panchami-2026"]["url"], observed_fetch=observed["incredible-india-orchha-vivaha-panchami-2026"]["observed_fetch"]),
        source("pib-ayodhya-vivaha-panchami-context", observed["pib-ayodhya-vivaha-panchami-context"]["title"], observed["pib-ayodhya-vivaha-panchami-context"]["publisher"], "Official Ayodhya and Margashirsha Shukla Panchami context; not calendar computation or household vidhi", "citation_only", url=observed["pib-ayodhya-vivaha-panchami-context"]["url"], observed_fetch=observed["pib-ayodhya-vivaha-panchami-context"]["observed_fetch"]),
        source("devam-vivaha-panchami-safety-boundary", "Devam Vivaha Panchami attribution and safety boundary", "Devam", "Editorial attribution, public-event, relationship, outcome and scope boundary; not Ramayana text or ritual authority", "derivative_allowed"),
    ]
    localized = localized_content(
        legacy,
        lane_id,
        {"minimum": "self_guided_identified_source", "standard": "family_or_teacher_guided", "elaborate": "established_family_temple_or_public_programme_guided"},
        ["devam-vivaha-panchami-safety-boundary"],
        ["devam-vivaha-panchami-safety-boundary"],
        details,
    )
    for content in localized:
        hindi = content["language_code"] == "hi"
        for procedure in content["procedures"]:
            procedure["closing"]["text"] = (
                "Close with one practical act of listening, honesty, respect, care or responsibility; retain the named story source and promise no relationship or spiritual outcome."
                if not hindi else
                "सुनने, ईमानदारी, सम्मान, देखभाल या जिम्मेदारी के एक व्यावहारिक कर्म से पूरा करें; कथा-स्रोत का नाम रखें और सम्बन्ध या आध्यात्मिक फल का वादा न करें।"
            )
            procedure["closing"]["scope_note"] = (
                "An established family, teacher, temple or organiser controls any formal close."
                if not hindi else
                "औपचारिक समापन स्थापित परिवार, शिक्षक, मंदिर या आयोजक के अनुसार होगा।"
            )
    pack = {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1",
        "lane_id": lane_id,
        "supersedes_legacy_pack_ids": [legacy["pack_id"]],
        "observance_slugs": ["vivaha-panchami"],
        "applicability": {
            "region_codes": ["north-india"],
            "tradition_codes": ["smarta-north-india"],
            "context_pairs": [{"region_code": "north-india", "tradition_code": "smarta-north-india"}],
            "settings": ["individual", "household", "family_led", "teacher_led", "temple", "community"],
            "family_practice_overrides_generic_guidance": True,
            "material_context_questions": legacy["guides"][0]["context_prompts"],
        },
        "calendar": {
            "resolution_source_ids": ["devam-vivaha-panchami-calendar-fixture", "drikpanchang-delhi-vivaha-panchami-2026", "incredible-india-orchha-vivaha-panchami-2026", "pib-ayodhya-vivaha-panchami-context"],
            "timing_kind": "mixed",
            "location_aware": True,
            "tradition_aware": True,
            "decision_rule_id": "devam-current-practitioner-vivaha-panchami-unique-sunrise-2026-v1",
            "live_schedule_required": True,
            "freshness_note": "The bounded Delhi/North India date is 14 December 2026; verify Janakpur, Ayodhya, Orchha, temple and public-programme details with their current local organisers.",
        },
        "sources": sources,
        "localized_content": localized,
        "product_status": status(),
    }
    assert_source_references(pack)
    if [item["language_code"] for item in localized] != ["en", "hi"]:
        raise ValueError("Vivaha Panchami language drift")
    if any([procedure["tier"] for procedure in item["procedures"]] != ["minimum", "standard", "elaborate"] for item in localized):
        raise ValueError("Vivaha Panchami tier drift")
    return pack


def main() -> None:
    pack = build()
    payload = (json.dumps(pack, ensure_ascii=False, indent=2, sort_keys=True) + "\n").encode("utf-8")
    OUTPUT.write_bytes(payload)
    print(json.dumps({"path": str(OUTPUT.relative_to(ROOT)), "bytes": len(payload), "sha256": hashlib.sha256(payload).hexdigest()}))


if __name__ == "__main__":
    main()

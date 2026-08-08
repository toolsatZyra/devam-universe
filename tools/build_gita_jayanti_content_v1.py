#!/usr/bin/env python3
"""Build the bounded current-contract Gita Jayanti reading/reflection lane."""

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
OUTPUT = PACK_DIR / "gita-jayanti-reading-reflection-content-v1.json"

LEGACY_PATH = PACK_DIR / "gita-jayanti-reading-reflection-v1.json"
FIXTURE_PATH = PANCHANG_DIR / "gita-jayanti-2026-v1.json"
EKADASHI_PATH = PANCHANG_DIR / "ekadashi-delhi-mumbai-chennai-september-december-2026-v1.json"
GRETIL_PATH = ROOT / "source_vault" / "objects" / "sha256" / "e1" / "e10352273ea29958205dbc72b7b81a0df95eb3623a0b6439141e3e2a2d54b505"

EXPECTED = {
    LEGACY_PATH: (21052, "a3e96f43d276e60cf3d7782861da2a120f2d2ac53f78a50102a715a2c018afbb"),
    FIXTURE_PATH: (6664, "20e6f9f473cbdf5a68282b36af4a08a6471a0f814665132743e22fca6bd44930"),
    EKADASHI_PATH: (16807, "6c860d6f2d778739c4a25b4b281b03a16975e8d43021baee24c55b1e1b72433d"),
    GRETIL_PATH: (2056476, "e10352273ea29958205dbc72b7b81a0df95eb3623a0b6439141e3e2a2d54b505"),
}


def verify_inputs() -> None:
    for path, (size, digest) in EXPECTED.items():
        payload = path.read_bytes()
        if len(payload) != size or hashlib.sha256(payload).hexdigest() != digest:
            raise ValueError(f"Gita Jayanti frozen input drift: {path}")


def details(language: str) -> dict[str, Any]:
    if language == "en":
        return {
            "significance": {
                "text": "Gita Jayanti commemorates the Bhagavad Gita dialogue of Krishna and Arjuna on Margashirsha Shukla Ekadashi. This lane makes the day useful through attributable reading, reflection and action while keeping Mokshada Ekadashi fasting, parana and temple practice separate.",
                "source_ids": ["utsav-international-geeta-mahotsav", "kurukshetra-jyotisar-events", "iitk-gita-supersite-introduction"],
                "scope_note": "The commemoration identity is source-supported; no one translation, commentary or application is declared universal.",
            },
            "origin_narratives": [
                {
                    "narrative_id": "krishna-arjuna-dialogue-at-kurukshetra",
                    "title": "The dialogue remembered at Kurukshetra",
                    "summary": "Government sources describe the day as commemorating Krishna's teaching to Arjuna at Kurukshetra. IIT Kanpur identifies the Bhagavad Gita as an eighteen-chapter dialogue within the Mahabharata's Bhishma Parva and records textual-count and commentary variation.",
                    "tradition_scope": "Official commemoration context and academic work identity",
                    "source_ids": ["utsav-international-geeta-mahotsav", "kurukshetra-jyotisar-events", "iitk-gita-supersite-introduction"],
                    "universal_origin_claimed": False,
                }
            ],
            "typical_practices": [
                {
                    "practice_id": "attributable-gita-reading-and-reflection",
                    "population_scope": "Individual, household or study-group participant",
                    "description": "Read or listen to a named edition, keep source verse, translation, commentary and personal application distinct, and carry one bounded insight into action.",
                    "source_ids": ["iitk-gita-supersite-introduction", "gretil-bhagavadgita-four-commentaries-tei", "devam-gita-reading-safety-boundary"],
                    "instructional": False,
                },
                {
                    "practice_id": "kurukshetra-and-institutional-programmes",
                    "population_scope": "Public festival, temple, teacher or established study programme",
                    "description": "Official pages describe recitation, discourse, bhajan, cultural and public-programme contexts. The responsible organiser controls the current edition, schedule, access and any separate Ekadashi observance.",
                    "source_ids": ["utsav-international-geeta-mahotsav", "kurukshetra-jyotisar-events", "devam-gita-reading-safety-boundary"],
                    "instructional": False,
                },
            ],
            "variants": [
                {
                    "variant_id": "translation-and-commentary-attribution",
                    "scope": "Text, translation and commentarial traditions",
                    "difference": "Verse counts, translations and interpretations vary; every quoted or applied teaching must retain its edition, translator and commentator when known.",
                    "source_ids": ["iitk-gita-supersite-introduction", "gretil-bhagavadgita-four-commentaries-tei"],
                    "separate_lane_required": False,
                },
                {
                    "variant_id": "reading-versus-ekadashi-vrata",
                    "scope": "Gita Jayanti study and Mokshada Ekadashi observance",
                    "difference": "The reading/reflection path is complete without fasting; food, health, vrata and parana guidance requires separately established family or sampradaya authority.",
                    "source_ids": ["devam-gita-jayanti-evidence-fixture", "devam-gita-reading-safety-boundary"],
                    "separate_lane_required": True,
                },
                {
                    "variant_id": "home-study-and-live-programme",
                    "scope": "Private reading versus institutional participation",
                    "difference": "A home reader can use a named edition without importing a temple, Kurukshetra or study group's current programme, recitation format or crowd operations.",
                    "source_ids": ["utsav-international-geeta-mahotsav", "kurukshetra-jyotisar-events", "devam-gita-reading-safety-boundary"],
                    "separate_lane_required": False,
                },
            ],
            "safety_and_boundaries": [
                "Name the edition, translator and commentary when known; an AI paraphrase is not the source verse.",
                "Gita Jayanti reading is not treated as the same procedure as every Mokshada or Vaikuntha Ekadashi vrata.",
                "No fast, diet, parana, bath, deep-daan, formal puja, mantra or priestly liturgy is prescribed here.",
                "Current public events, temple programmes and accessibility must be confirmed with their organisers.",
                "No reading, recitation or action guarantees moksha, merit, clarity, success or another outcome.",
            ],
        }
    return {
        "significance": {
            "text": "गीता जयंती मार्गशीर्ष शुक्ल एकादशी पर कृष्ण और अर्जुन के भगवद्गीता संवाद का स्मरण है। यह मार्ग स्रोत-पहचान वाले पाठ, चिंतन और कर्म से दिन को उपयोगी बनाता है, जबकि मोक्षदा एकादशी का उपवास, पारण और मंदिर-विधि अलग रखता है।",
            "source_ids": ["utsav-international-geeta-mahotsav", "kurukshetra-jyotisar-events", "iitk-gita-supersite-introduction"],
            "scope_note": "स्मरण की पहचान स्रोत-समर्थित है; किसी एक अनुवाद, टीका या अनुप्रयोग को सार्वभौमिक नहीं कहा गया है।",
        },
        "origin_narratives": [
            {
                "narrative_id": "krishna-arjuna-dialogue-at-kurukshetra",
                "title": "कुरुक्षेत्र में स्मरण किया जाने वाला संवाद",
                "summary": "सरकारी स्रोत इस दिन को कुरुक्षेत्र में अर्जुन को कृष्ण की शिक्षा के स्मरण से जोड़ते हैं। IIT कानपुर भगवद्गीता को महाभारत के भीष्म पर्व में अठारह अध्यायों का संवाद बताता है और पाठ-संख्या तथा टीका-भिन्नता को सुरक्षित रखता है।",
                "tradition_scope": "आधिकारिक स्मरण-संदर्भ और अकादमिक ग्रंथ-पहचान",
                "source_ids": ["utsav-international-geeta-mahotsav", "kurukshetra-jyotisar-events", "iitk-gita-supersite-introduction"],
                "universal_origin_claimed": False,
            }
        ],
        "typical_practices": [
            {
                "practice_id": "attributable-gita-reading-and-reflection",
                "population_scope": "व्यक्ति, परिवार या अध्ययन-समूह सहभागी",
                "description": "नामित संस्करण पढ़ें या सुनें, मूल श्लोक, अनुवाद, टीका और अपना अनुप्रयोग अलग रखें, और एक सीमित सीख को कर्म में लाएँ।",
                "source_ids": ["iitk-gita-supersite-introduction", "gretil-bhagavadgita-four-commentaries-tei", "devam-gita-reading-safety-boundary"],
                "instructional": False,
            },
            {
                "practice_id": "kurukshetra-and-institutional-programmes",
                "population_scope": "सार्वजनिक उत्सव, मंदिर, शिक्षक या स्थापित अध्ययन कार्यक्रम",
                "description": "आधिकारिक पृष्ठ पाठ, प्रवचन, भजन, सांस्कृतिक और सार्वजनिक कार्यक्रमों का वर्णन करते हैं। वर्तमान संस्करण, समय, प्रवेश और अलग एकादशी आचरण की जिम्मेदारी आयोजक की है।",
                "source_ids": ["utsav-international-geeta-mahotsav", "kurukshetra-jyotisar-events", "devam-gita-reading-safety-boundary"],
                "instructional": False,
            },
        ],
        "variants": [
            {
                "variant_id": "translation-and-commentary-attribution",
                "scope": "पाठ, अनुवाद और टीका-परम्पराएँ",
                "difference": "श्लोक-संख्या, अनुवाद और व्याख्या बदल सकती हैं; हर उद्धरण या अनुप्रयोग में उपलब्ध संस्करण, अनुवादक और टीकाकार की पहचान रखें।",
                "source_ids": ["iitk-gita-supersite-introduction", "gretil-bhagavadgita-four-commentaries-tei"],
                "separate_lane_required": False,
            },
            {
                "variant_id": "reading-versus-ekadashi-vrata",
                "scope": "गीता जयंती अध्ययन और मोक्षदा एकादशी व्रत",
                "difference": "पाठ-चिंतन बिना उपवास के पूर्ण है; आहार, स्वास्थ्य, व्रत और पारण के लिए अलग स्थापित परिवार या सम्प्रदाय-प्राधिकार चाहिए।",
                "source_ids": ["devam-gita-jayanti-evidence-fixture", "devam-gita-reading-safety-boundary"],
                "separate_lane_required": True,
            },
            {
                "variant_id": "home-study-and-live-programme",
                "scope": "निजी अध्ययन और संस्थागत सहभागिता",
                "difference": "घर का पाठ किसी मंदिर, कुरुक्षेत्र या अध्ययन-समूह की वर्तमान समय-सारणी, पाठ-रूप या भीड़-व्यवस्था को घर की सार्वभौमिक विधि नहीं बनाता।",
                "source_ids": ["utsav-international-geeta-mahotsav", "kurukshetra-jyotisar-events", "devam-gita-reading-safety-boundary"],
                "separate_lane_required": False,
            },
        ],
        "safety_and_boundaries": [
            "जहाँ ज्ञात हो, संस्करण, अनुवादक और टीका का नाम रखें; AI सार मूल श्लोक नहीं है।",
            "गीता जयंती पाठ को हर मोक्षदा या वैकुण्ठ एकादशी व्रत की समान विधि नहीं माना गया है।",
            "यहाँ उपवास, आहार, पारण, स्नान, दीपदान, औपचारिक पूजा, मंत्र या पुरोहित-विधि नहीं बताई जाती।",
            "वर्तमान सार्वजनिक कार्यक्रम, मंदिर-समय और प्रवेश आयोजक से जाँचें।",
            "कोई पाठ, पारायण या कर्म मोक्ष, पुण्य, स्पष्टता, सफलता या अन्य फल की गारंटी नहीं देता।",
        ],
    }


def fixture_source(fixture: dict[str, Any], source_id: str) -> dict[str, Any]:
    return next(item for item in fixture["sources"] if item["source_id"] == source_id)


def build() -> dict[str, Any]:
    verify_inputs()
    legacy = load("gita-jayanti-reading-reflection-v1.json")
    fixture = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    if fixture["contract"] != "DEVAM_GITA_JAYANTI_2026_EVIDENCE_FIXTURE_V1" or fixture["scope"]["selected_civil_date"] != "2026-12-20":
        raise ValueError("Gita Jayanti fixture identity drift")
    if fixture["scope"]["universal_india_date_or_procedure_claim"] is not False or any(fixture["denials"].values()):
        raise ValueError("Gita Jayanti fixture widened or denial drifted")

    lane_id = "gita-jayanti-reading-reflection-content-v1"
    sources = [
        source("devam-gita-jayanti-evidence-fixture", "Devam Gita Jayanti 2026 evidence fixture", "Devam", "Bounded 20 December 2026 identity, source and separation fixture; not ritual authority", "derivative_allowed", artifact_sha256=EXPECTED[FIXTURE_PATH][1], citation_coordinates={"path": "knowledge_packs/panchang/gita-jayanti-2026-v1.json"}),
        source("devam-ekadashi-date-fixture", "Devam Delhi, Mumbai and Chennai Ekadashi date fixture", "Devam", "Deterministic location/tradition date evidence; not Gita teaching or vrata authority", "derivative_allowed", artifact_sha256=EXPECTED[EKADASHI_PATH][1], citation_coordinates={"path": "knowledge_packs/panchang/ekadashi-delhi-mumbai-chennai-september-december-2026-v1.json", "selected_date": "2026-12-20"}),
    ]
    for source_id, role in [
        ("utsav-international-geeta-mahotsav", "Official recurring Gita Jayanti identity and public-programme context; not universal home vidhi"),
        ("kurukshetra-jyotisar-events", "Official Kurukshetra identity and recitation context; not home vidhi"),
        ("iitk-gita-supersite-introduction", "Academic work identity, structure and variant context; not one interpretation authority"),
        ("incredible-india-iskcon-kolkata-geeta-jayanti", "Official tourism corroboration of an ISKCON identity; not global ISKCON procedure authority"),
    ]:
        item = fixture_source(fixture, source_id)
        sources.append(source(source_id, item["title"], item["publisher"], role, "citation_only", url=item["url"], observed_fetch=item["observed_fetch"]))
    sources.extend([
        source("gretil-bhagavadgita-four-commentaries-tei", "Bhagavadgita with four attributable Sanskrit commentaries", "GRETIL / SUB Göttingen; data contribution by Gaudiya Grantha Mandira", "Existing private library source and commentary-variant reference; no user-facing source text", "internal_only", artifact_sha256=EXPECTED[GRETIL_PATH][1], citation_coordinates={"path": str(GRETIL_PATH.relative_to(ROOT)).replace("\\", "/"), "bytes": EXPECTED[GRETIL_PATH][0], "source_text_returned_by_api": False}),
        source("devam-gita-reading-safety-boundary", "Devam source attribution, fasting, outcome and scope boundary", "Devam", "Editorial safety and scope boundary; not scriptural or ritual authority", "derivative_allowed"),
    ])

    localized = localized_content(
        legacy,
        lane_id,
        {"minimum": "self_guided_named_source", "standard": "family_teacher_or_study_group_guided", "elaborate": "established_teacher_temple_or_institution_guided"},
        ["iitk-gita-supersite-introduction", "devam-gita-reading-safety-boundary"],
        ["devam-gita-reading-safety-boundary"],
        details,
    )
    for content in localized:
        hindi = content["language_code"] == "hi"
        for procedure in content["procedures"]:
            procedure["closing"]["text"] = (
                "Close by recording one bounded action and the exact edition or teacher used; retain one open question and claim no guaranteed outcome."
                if not hindi
                else "एक सीमित कर्म और उपयोग किए गए ठीक संस्करण या शिक्षक का नाम लिखकर पूरा करें; एक खुला प्रश्न रखें और किसी फल की गारंटी न मानें।"
            )
            procedure["closing"]["scope_note"] = (
                "The selected edition, family, teacher or programme controls any recitation or ritual close."
                if not hindi
                else "पाठ या अनुष्ठान का समापन चुने संस्करण, परिवार, शिक्षक या कार्यक्रम के अनुसार होगा।"
            )

    pack = {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1",
        "lane_id": lane_id,
        "supersedes_legacy_pack_ids": [legacy["pack_id"]],
        "observance_slugs": ["mokshada-ekadashi"],
        "applicability": {
            "region_codes": ["north-india", "west-india", "south-india", "iskcon-india"],
            "tradition_codes": ["smarta-north-india", "smarta-west-india", "smarta-south-india", "vaishnava-iskcon"],
            "context_pairs": [
                {"region_code": "north-india", "tradition_code": "smarta-north-india"},
                {"region_code": "west-india", "tradition_code": "smarta-west-india"},
                {"region_code": "south-india", "tradition_code": "smarta-south-india"},
                {"region_code": "iskcon-india", "tradition_code": "vaishnava-iskcon"},
            ],
            "settings": ["individual", "household", "family_led", "teacher_led", "temple", "community"],
            "family_practice_overrides_generic_guidance": True,
            "material_context_questions": legacy["guides"][0]["context_prompts"],
        },
        "calendar": {
            "resolution_source_ids": ["devam-gita-jayanti-evidence-fixture", "devam-ekadashi-date-fixture", "utsav-international-geeta-mahotsav", "kurukshetra-jyotisar-events"],
            "timing_kind": "mixed",
            "location_aware": True,
            "tradition_aware": True,
            "decision_rule_id": "devam-mokshada-ekadashi-gita-jayanti-2026-v1",
            "live_schedule_required": True,
            "freshness_note": "The bounded 2026 date is 20 December for the supported profiles; recheck any live temple, Kurukshetra, study-group or public programme with its current organiser.",
        },
        "sources": sources,
        "localized_content": localized,
        "product_status": status(),
    }
    assert_source_references(pack)
    if [content["language_code"] for content in localized] != ["en", "hi"]:
        raise ValueError("Gita Jayanti language drift")
    if any([procedure["tier"] for procedure in content["procedures"]] != ["minimum", "standard", "elaborate"] for content in localized):
        raise ValueError("Gita Jayanti procedure tiers drift")
    return pack


def main() -> None:
    pack = build()
    payload = (json.dumps(pack, ensure_ascii=False, indent=2, sort_keys=True) + "\n").encode("utf-8")
    OUTPUT.write_bytes(payload)
    print(json.dumps({"path": str(OUTPUT.relative_to(ROOT)), "bytes": len(payload), "sha256": hashlib.sha256(payload).hexdigest()}))


if __name__ == "__main__":
    main()

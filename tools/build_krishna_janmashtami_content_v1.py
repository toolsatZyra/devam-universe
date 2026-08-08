#!/usr/bin/env python3
"""Build the bounded current-contract Smarta and ISKCON Janmashtami lane."""

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
OUTPUT = PACK_DIR / "krishna-janmashtami-smarta-iskcon-content-v1.json"
LEGACY_PATH = PACK_DIR / "krishna-janmashtami-smarta-iskcon-v1.json"
FIXTURE_PATH = PANCHANG_DIR / "krishna-janmashtami-delhi-2026-v1.json"
EXPECTED = {
    LEGACY_PATH: (21331, "0b7ce19875a7783b4f39a263d4e40952a7ae9c26c407db579652eb2835cf5793"),
    FIXTURE_PATH: (4499, "a05f45a558061686e16fbe739b4d78dc5e86f9cf0c809c7f8eec28063123bdf1"),
}


def verify_inputs() -> None:
    for path, (size, digest) in EXPECTED.items():
        payload = path.read_bytes()
        if len(payload) != size or hashlib.sha256(payload).hexdigest() != digest:
            raise ValueError(f"Janmashtami frozen input drift: {path}")


def details(language: str) -> dict[str, Any]:
    if language == "en":
        return {
            "significance": {
                "text": "Krishna Janmashtami commemorates Krishna's birth through joy, remembrance, prayer, singing, story and teaching. This shared devotional core opens only inside a separately resolved Smarta North/West India or ISKCON lane and does not imply that their calendar rules or ritual authorities are identical.",
                "source_ids": ["devam-janmashtami-calendar-fixture", "incredible-india-janmashtami", "iskcon-bangalore-janmashtami-2026"],
                "scope_note": "Festival identity and living-practice contexts are attributable; the accessible home companion is bounded Devam synthesis, not a universal Janmashtami liturgy.",
            },
            "origin_narratives": [{
                "narrative_id": "krishna-birth-remembrance",
                "title": "Krishna's birth remembrance",
                "summary": "The reviewed national and living-sampradaya sources identify the festival with Krishna's birth and preserve devotional expressions such as prayer, bhajan, kirtan, stories and temple participation. A complete Bhagavata, Harivamsha or regional narrative is not reproduced or merged here.",
                "tradition_scope": "Shared festival identity with source-specific Smarta, ISKCON, Dwarka and regional expressions",
                "source_ids": ["incredible-india-janmashtami", "incredible-india-dwarka-janmashtami-2026", "iskcon-bangalore-janmashtami-2026"],
                "universal_origin_claimed": False,
            }],
            "typical_practices": [
                {
                    "practice_id": "attributable-krishna-remembrance",
                    "population_scope": "Smarta household or ISKCON participant after exact lane selection",
                    "description": "Use a known Krishna name, prayer, song, story or teaching, preserve its source, and carry one teaching into a practical act of kindness, courage, friendship, duty or service.",
                    "source_ids": ["incredible-india-janmashtami", "iskcon-bangalore-janmashtami-2026", "devam-janmashtami-safety-boundary"],
                    "instructional": False,
                },
                {
                    "practice_id": "established-family-temple-or-stream-participation",
                    "population_scope": "Family, temple or official programme participant",
                    "description": "Follow the responsible family or institution for its known programme. A temple's abhisheka, arati, offerings, midnight schedule or fast is not converted into universal home instructions.",
                    "source_ids": ["incredible-india-dwarka-janmashtami-2026", "iskcon-bangalore-janmashtami-2026", "devam-janmashtami-safety-boundary"],
                    "instructional": False,
                },
            ],
            "variants": [
                {
                    "variant_id": "smarta-and-iskcon-lanes",
                    "scope": "North/West India Smarta household and ISKCON",
                    "difference": "Their 2026 civil date may match while their decision rules, authority, parana and programme remain separate.",
                    "source_ids": ["devam-janmashtami-calendar-fixture", "nirnayasindhu-1865-janmashtami-decision", "iskcon-bangalore-janmashtami-2026"],
                    "separate_lane_required": True,
                },
                {
                    "variant_id": "regional-and-temple-expressions",
                    "scope": "Dwarka, Mathura-Vrindavan, household, temple and other regional contexts",
                    "difference": "Stories, timings, processions, music, images and community practice remain attributable to their own place and authority.",
                    "source_ids": ["incredible-india-janmashtami", "incredible-india-dwarka-janmashtami-2026"],
                    "separate_lane_required": True,
                },
                {
                    "variant_id": "accessible-companion-and-formal-observance",
                    "scope": "Material-free, flame-free and non-fasting reflection versus established household or temple practice",
                    "difference": "The shared devotional core imports no fast, food rule, midnight vigil, abhisheka, offering, cradle, footprints, Dahi Handi, parana or promised outcome.",
                    "source_ids": ["devam-janmashtami-safety-boundary"],
                    "separate_lane_required": False,
                },
            ],
            "safety_and_boundaries": [
                "Select the exact Smarta or ISKCON lane; a matching civil date does not prove rule equivalence.",
                "Identify the source, edition, retelling, teacher, family or institution behind a Krishna story or teaching.",
                "No fasting, food, medical, exact muhurta, midnight vigil or parana instruction is supplied.",
                "No abhisheka, arati, offering, cradle, image dressing, footprints or priest-led rite is prescribed.",
                "Dahi Handi and human-pyramid participation, live travel and crowd operations remain outside this guide.",
                "No blessing, protection, merit, prosperity or other outcome is guaranteed.",
            ],
        }
    return {
        "significance": {
            "text": "कृष्ण जन्माष्टमी कृष्ण-जन्म का आनन्द, स्मरण, प्रार्थना, गायन, कथा और शिक्षा के माध्यम से उत्सव है। यह साझा भक्ति-मूल केवल अलग से निर्धारित उत्तर/पश्चिम भारत स्मार्त या इस्कॉन मार्ग में खुलता है; इससे उनके पंचांग-नियम या अनुष्ठानिक अधिकार समान नहीं हो जाते।",
            "source_ids": ["devam-janmashtami-calendar-fixture", "incredible-india-janmashtami", "iskcon-bangalore-janmashtami-2026"],
            "scope_note": "उत्सव-पहचान और जीवित अभ्यास स्रोत-नामित हैं; सुलभ घरेलू सहचर सीमित Devam संश्लेषण है, सार्वभौमिक जन्माष्टमी-विधि नहीं।",
        },
        "origin_narratives": [{
            "narrative_id": "krishna-birth-remembrance",
            "title": "कृष्ण-जन्म का स्मरण",
            "summary": "समीक्षित राष्ट्रीय और जीवित-सम्प्रदाय स्रोत उत्सव को कृष्ण-जन्म से जोड़ते हैं और प्रार्थना, भजन, कीर्तन, कथा तथा मंदिर-सहभागिता जैसे भक्ति-रूप सुरक्षित रखते हैं। पूर्ण भागवत, हरिवंश या क्षेत्रीय वृत्तान्त यहाँ न दोहराया जाता है, न मिलाया जाता है।",
            "tradition_scope": "स्रोत-विशिष्ट स्मार्त, इस्कॉन, द्वारका और क्षेत्रीय रूपों सहित साझा उत्सव-पहचान",
            "source_ids": ["incredible-india-janmashtami", "incredible-india-dwarka-janmashtami-2026", "iskcon-bangalore-janmashtami-2026"],
            "universal_origin_claimed": False,
        }],
        "typical_practices": [
            {
                "practice_id": "attributable-krishna-remembrance",
                "population_scope": "सटीक मार्ग चुनने के बाद स्मार्त परिवार या इस्कॉन सहभागी",
                "description": "परिचित कृष्ण-नाम, प्रार्थना, गीत, कथा या शिक्षा का स्रोत सुरक्षित रखें और दया, साहस, मित्रता, कर्तव्य या सेवा के एक व्यावहारिक काम में उसे उतारें।",
                "source_ids": ["incredible-india-janmashtami", "iskcon-bangalore-janmashtami-2026", "devam-janmashtami-safety-boundary"],
                "instructional": False,
            },
            {
                "practice_id": "established-family-temple-or-stream-participation",
                "population_scope": "परिवार, मंदिर या आधिकारिक कार्यक्रम सहभागी",
                "description": "परिचित कार्यक्रम के लिए उत्तरदायी परिवार या संस्था का मार्ग मानें। मंदिर का अभिषेक, आरती, अर्पण, मध्यरात्रि समय या उपवास सार्वभौमिक गृह-विधि नहीं बनता।",
                "source_ids": ["incredible-india-dwarka-janmashtami-2026", "iskcon-bangalore-janmashtami-2026", "devam-janmashtami-safety-boundary"],
                "instructional": False,
            },
        ],
        "variants": [
            {
                "variant_id": "smarta-and-iskcon-lanes",
                "scope": "उत्तर/पश्चिम भारत स्मार्त गृह और इस्कॉन",
                "difference": "2026 का नागरिक दिन समान हो सकता है, पर निर्णय-नियम, अधिकार, पारण और कार्यक्रम अलग रहते हैं।",
                "source_ids": ["devam-janmashtami-calendar-fixture", "nirnayasindhu-1865-janmashtami-decision", "iskcon-bangalore-janmashtami-2026"],
                "separate_lane_required": True,
            },
            {
                "variant_id": "regional-and-temple-expressions",
                "scope": "द्वारका, मथुरा-वृन्दावन, गृह, मंदिर और अन्य क्षेत्रीय संदर्भ",
                "difference": "कथाएँ, समय, जुलूस, संगीत, छवियाँ और सामुदायिक अभ्यास अपने स्थान और अधिकार से जुड़े रहते हैं।",
                "source_ids": ["incredible-india-janmashtami", "incredible-india-dwarka-janmashtami-2026"],
                "separate_lane_required": True,
            },
            {
                "variant_id": "accessible-companion-and-formal-observance",
                "scope": "सामग्री-रहित, लौ-रहित, बिना उपवास चिंतन और स्थापित गृह या मंदिर अभ्यास",
                "difference": "साझा भक्ति-मूल उपवास, भोजन-नियम, मध्यरात्रि-जागरण, अभिषेक, अर्पण, झूला, चरण-चिह्न, दही-हांडी, पारण या फल का दावा आयात नहीं करता।",
                "source_ids": ["devam-janmashtami-safety-boundary"],
                "separate_lane_required": False,
            },
        ],
        "safety_and_boundaries": [
            "सटीक स्मार्त या इस्कॉन मार्ग चुनें; समान नागरिक दिन नियम-समानता सिद्ध नहीं करता।",
            "कृष्ण-कथा या शिक्षा के स्रोत, संस्करण, पुनर्कथा, शिक्षक, परिवार या संस्था की पहचान रखें।",
            "उपवास, भोजन, चिकित्सा, सटीक मुहूर्त, मध्यरात्रि-जागरण या पारण निर्देश नहीं दिया जाता।",
            "अभिषेक, आरती, अर्पण, झूला, मूर्ति-वस्त्र, चरण-चिह्न या पुरोहित-विधि नहीं बताई जाती।",
            "दही-हांडी, मानव-पिरामिड, यात्रा और भीड़-संचालन इस मार्ग से बाहर हैं।",
            "आशीर्वाद, सुरक्षा, पुण्य, समृद्धि या अन्य फल की गारंटी नहीं दी जाती।",
        ],
    }


def mapped_sources(legacy: dict[str, Any]) -> list[dict[str, Any]]:
    result = []
    for item in legacy["sources"]:
        result.append(source(
            item["source_id"], item["title"], item["publisher"],
            item["evidence_role"].replace("_", " "),
            "citation_only" if item["rights_lane"] == "reference_only" else item["rights_lane"],
            url=item.get("url"), artifact_sha256=item.get("artifact_sha256"),
            citation_coordinates={"path": "knowledge_packs/panchang/krishna-janmashtami-delhi-2026-v1.json"} if item["source_id"] == "devam-janmashtami-calendar-fixture" else None,
            observed_fetch=item.get("observed_fetch"),
        ))
    return result


def build() -> dict[str, Any]:
    verify_inputs()
    legacy = load("krishna-janmashtami-smarta-iskcon-v1.json")
    fixture = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    if fixture["contract"] != "DEVAM_BOUNDED_KRISHNA_JANMASHTAMI_CALENDAR_FIXTURE_V1" or fixture["scope"]["universal_india_claim"] is not False:
        raise ValueError("Janmashtami fixture identity drift")
    if any(fixture["denials"].values()):
        raise ValueError("Janmashtami fixture denial drift")

    lane_id = "krishna-janmashtami-smarta-iskcon-content-v1"
    localized = localized_content(
        legacy, lane_id,
        {"minimum": "self_guided_shared_devotional_core", "standard": "family_or_source_guided", "elaborate": "established_family_temple_or_iskcon_programme_guided"},
        ["devam-janmashtami-safety-boundary"], ["devam-janmashtami-safety-boundary"], details,
    )
    pack = {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1",
        "lane_id": lane_id,
        "supersedes_legacy_pack_ids": [legacy["pack_id"]],
        "observance_slugs": legacy["observance_slugs"],
        "applicability": {
            "region_codes": ["north-india", "west-india", "iskcon-india"],
            "tradition_codes": ["smarta-north-india", "smarta-west-india", "vaishnava-iskcon"],
            "context_pairs": legacy["scope"]["lane_pairs"],
            "observance_context_notes": [
                {"observance_slug": slug, "language_code": language, "note": note}
                for language, notes in legacy["lane_notes"].items()
                for slug, note in notes.items()
            ],
            "settings": ["individual", "household", "family_led", "teacher_led", "temple", "community"],
            "family_practice_overrides_generic_guidance": True,
            "material_context_questions": legacy["guides"][0]["context_prompts"],
        },
        "calendar": {
            "resolution_source_ids": ["devam-janmashtami-calendar-fixture", "nirnayasindhu-1865-janmashtami-decision", "iskcon-bangalore-janmashtami-2026"],
            "timing_kind": "mixed", "location_aware": True, "tradition_aware": True,
            "decision_rule_id": "devam-bounded-smarta-or-iskcon-janmashtami-nishita-2026-v1",
            "closing_decision_rule_id": None, "live_schedule_required": True,
            "freshness_note": "Use only after Today resolves the exact Smarta or ISKCON lane. Verify fasting, parana, temple programmes, midnight schedules, access and crowd conditions with the responsible current authority.",
        },
        "sources": mapped_sources(legacy),
        "localized_content": localized,
        "product_status": status(),
    }
    assert_source_references(pack)
    if [item["language_code"] for item in localized] != ["en", "hi"]:
        raise ValueError("Janmashtami language drift")
    if any([procedure["tier"] for procedure in item["procedures"]] != ["minimum", "standard", "elaborate"] for item in localized):
        raise ValueError("Janmashtami tier drift")
    return pack


def main() -> None:
    payload = (json.dumps(build(), ensure_ascii=False, indent=2, sort_keys=True) + "\n").encode("utf-8")
    if OUTPUT.exists():
        raise FileExistsError(f"Refusing to overwrite {OUTPUT}")
    OUTPUT.write_bytes(payload)
    print(json.dumps({"path": str(OUTPUT.relative_to(ROOT)), "bytes": len(payload), "sha256": hashlib.sha256(payload).hexdigest()}))


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Build one bounded current-contract companion for resolved recurring Ekadashis."""

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
OUTPUT = PACK_DIR / "ekadashi-recurring-devotional-content-v1.json"
LEGACY_PATH = PACK_DIR / "ekadashi-recurring-devotional-practice-v1.json"
FIXTURE_PATH = PANCHANG_DIR / "ekadashi-delhi-mumbai-chennai-september-december-2026-v1.json"
EXPECTED = {
    LEGACY_PATH: (21962, "b8d38f8b85277c700df4da480633cbdcf3c86ae6d022babd8daa3facb6d38201"),
    FIXTURE_PATH: (16807, "6c860d6f2d778739c4a25b4b281b03a16975e8d43021baee24c55b1e1b72433d"),
}


def verify_inputs() -> None:
    for path, (size, digest) in EXPECTED.items():
        payload = path.read_bytes()
        if len(payload) != size or hashlib.sha256(payload).hexdigest() != digest:
            raise ValueError(f"Ekadashi frozen input drift: {path}")


def details(language: str) -> dict[str, Any]:
    if language == "en":
        return {
            "significance": {
                "text": "Ekadashi is a recurring lunar observance associated in these sources with Vishnu or Krishna devotion, restraint, prayer, study and service. Exact civil dates and established vrata practice differ by place and sampradaya, so this lane begins only after the matching Smarta or ISKCON calendar profile has resolved the day.",
                "source_ids": ["devam-ekadashi-calendar-fixture", "iskcon-bangalore-ekadashi-practice", "drikpanchang-ekadashi-vidhi"],
                "scope_note": "This is a source-labelled, non-fasting devotional companion, not a universal Ekadashi vrata, dietary rule, parana calculation or medical recommendation.",
            },
            "origin_narratives": [{
                "narrative_id": "named-ekadashi-meanings-remain-attributable",
                "title": "Named Ekadashis carry distinct teachings",
                "summary": "The reviewed living-tradition sources attach particular meanings and practices to named Ekadashis. Devam therefore preserves those accounts under their source and sampradaya instead of inventing one origin story for every Ekadashi.",
                "tradition_scope": "Source-specific Smarta and Vaishnava contexts",
                "source_ids": ["iskcon-bangalore-ekadashi-practice", "baps-prabodhini-ekadashi", "drikpanchang-ekadashi-vidhi"],
                "universal_origin_claimed": False,
            }],
            "typical_practices": [
                {
                    "practice_id": "non-fasting-vishnu-krishna-remembrance",
                    "population_scope": "Individual or household after exact calendar resolution",
                    "description": "Use a family-known Vishnu or Krishna remembrance, one attributable reading or teaching, quiet reflection and a practical act of restraint, repair, generosity or service.",
                    "source_ids": ["iskcon-bangalore-ekadashi-practice", "drikpanchang-ekadashi-vidhi", "devam-ekadashi-safety-boundary"],
                    "instructional": False,
                },
                {
                    "practice_id": "established-vrata-or-community-practice",
                    "population_scope": "Family, temple or sampradaya participant",
                    "description": "When an established vrata, kirtan, study, seva or parana practice applies, follow that responsible living authority; this companion adds no unfamiliar rite or food rule.",
                    "source_ids": ["nirnayasindhu-1865-ekadashi-decision-chapter", "iskcon-bangalore-ekadashi-practice", "devam-ekadashi-safety-boundary"],
                    "instructional": False,
                },
            ],
            "variants": [
                {
                    "variant_id": "smarta-and-iskcon-calendar-lanes",
                    "scope": "Smarta household and ISKCON/Vaishnava profiles",
                    "difference": "The same lunar observance may resolve to different civil dates or close rules; the app must retain the selected location and tradition profile.",
                    "source_ids": ["devam-ekadashi-calendar-fixture", "nirnayasindhu-1865-ekadashi-decision-chapter"],
                    "separate_lane_required": True,
                },
                {
                    "variant_id": "named-ekadashi-identity",
                    "scope": "Aja, Parsva, Indira, Papankusha, Rama, Devutthana and Utpanna Ekadashi",
                    "difference": "The current companion shares only a bounded devotional core. Each name, story, promise and special practice remains separately attributable and is not inferred from another Ekadashi.",
                    "source_ids": ["baps-prabodhini-ekadashi", "devam-ekadashi-safety-boundary"],
                    "separate_lane_required": True,
                },
                {
                    "variant_id": "companion-versus-vrata",
                    "scope": "Material-free non-fasting reflection versus established family or sampradaya vrata",
                    "difference": "The accessible companion does not prescribe, modify or end a fast, select foods, calculate unresolved Smarta parana, or claim equivalence to a complete vrata.",
                    "source_ids": ["devam-ekadashi-calendar-fixture", "devam-ekadashi-safety-boundary"],
                    "separate_lane_required": False,
                },
            ],
            "safety_and_boundaries": [
                "Confirm the exact location and Smarta or Vaishnava calendar lane before using the guide.",
                "Family, temple and sampradaya authority overrides this generic devotional sequence.",
                "No fast, nirjala practice, food rule, medical advice or unresolved Smarta parana time is supplied.",
                "No universal mantra, katha, puja or named-Ekadashi story is invented.",
                "No sin-removal, merit, liberation, health, prosperity or other outcome is guaranteed.",
            ],
        }
    return {
        "significance": {
            "text": "इन स्रोतों में एकादशी विष्णु या कृष्ण भक्ति, संयम, प्रार्थना, अध्ययन और सेवा से जुड़ी आवर्ती चन्द्र-तिथि है। नागरिक दिन और स्थापित व्रत-विधि स्थान तथा सम्प्रदाय के अनुसार बदल सकते हैं, इसलिए यह मार्ग केवल सही स्मार्त या इस्कॉन पंचांग-प्रोफाइल में दिन तय होने के बाद खुलता है।",
            "source_ids": ["devam-ekadashi-calendar-fixture", "iskcon-bangalore-ekadashi-practice", "drikpanchang-ekadashi-vidhi"],
            "scope_note": "यह स्रोत-नामित, बिना उपवास वाला भक्ति-सहचर है; सार्वभौमिक एकादशी-व्रत, आहार-नियम, पारण-गणना या चिकित्सा-सलाह नहीं।",
        },
        "origin_narratives": [{
            "narrative_id": "named-ekadashi-meanings-remain-attributable",
            "title": "नामित एकादशियों की शिक्षाएँ अलग रहती हैं",
            "summary": "समीक्षित जीवित-परम्परा स्रोत अलग नामित एकादशियों से विशिष्ट अर्थ और अभ्यास जोड़ते हैं। इसलिए Devam हर एकादशी के लिए एक गढ़ी हुई मूल-कथा बनाने के बजाय उन वृत्तान्तों को स्रोत और सम्प्रदाय के साथ सुरक्षित रखता है।",
            "tradition_scope": "स्रोत-विशिष्ट स्मार्त और वैष्णव संदर्भ",
            "source_ids": ["iskcon-bangalore-ekadashi-practice", "baps-prabodhini-ekadashi", "drikpanchang-ekadashi-vidhi"],
            "universal_origin_claimed": False,
        }],
        "typical_practices": [
            {
                "practice_id": "non-fasting-vishnu-krishna-remembrance",
                "population_scope": "सटीक पंचांग-निर्णय के बाद व्यक्ति या परिवार",
                "description": "परिवार-परिचित विष्णु या कृष्ण स्मरण, एक स्रोत-नामित पाठ या शिक्षा, शांत चिंतन और संयम, सुधार, उदारता या सेवा का एक व्यावहारिक काम चुनें।",
                "source_ids": ["iskcon-bangalore-ekadashi-practice", "drikpanchang-ekadashi-vidhi", "devam-ekadashi-safety-boundary"],
                "instructional": False,
            },
            {
                "practice_id": "established-vrata-or-community-practice",
                "population_scope": "परिवार, मंदिर या सम्प्रदाय सहभागी",
                "description": "स्थापित व्रत, कीर्तन, अध्ययन, सेवा या पारण लागू हो तो उस उत्तरदायी जीवित परम्परा का पालन करें; यह सहचर कोई अपरिचित विधि या आहार-नियम नहीं जोड़ता।",
                "source_ids": ["nirnayasindhu-1865-ekadashi-decision-chapter", "iskcon-bangalore-ekadashi-practice", "devam-ekadashi-safety-boundary"],
                "instructional": False,
            },
        ],
        "variants": [
            {
                "variant_id": "smarta-and-iskcon-calendar-lanes",
                "scope": "स्मार्त गृह और इस्कॉन/वैष्णव प्रोफाइल",
                "difference": "एक ही चन्द्र-पर्व अलग नागरिक दिन या समापन-नियम पर आ सकता है; ऐप चुने हुए स्थान और परम्परा-प्रोफाइल को सुरक्षित रखता है।",
                "source_ids": ["devam-ekadashi-calendar-fixture", "nirnayasindhu-1865-ekadashi-decision-chapter"],
                "separate_lane_required": True,
            },
            {
                "variant_id": "named-ekadashi-identity",
                "scope": "अजा, पार्श्व, इन्दिरा, पापांकुशा, रमा, देवुत्थान और उत्पन्ना एकादशी",
                "difference": "वर्तमान सहचर केवल सीमित भक्ति-मूल साझा करता है। हर नाम, कथा, फल और विशेष अभ्यास अलग स्रोत से जुड़ा रहता है और दूसरी एकादशी से अनुमानित नहीं होता।",
                "source_ids": ["baps-prabodhini-ekadashi", "devam-ekadashi-safety-boundary"],
                "separate_lane_required": True,
            },
            {
                "variant_id": "companion-versus-vrata",
                "scope": "सामग्री-रहित बिना उपवास चिंतन और स्थापित पारिवारिक या सम्प्रदायिक व्रत",
                "difference": "सुलभ सहचर उपवास बताता, बदलता या खोलता नहीं; भोजन नहीं चुनता, अपुष्ट स्मार्त पारण नहीं गणता और पूर्ण व्रत के समान होने का दावा नहीं करता।",
                "source_ids": ["devam-ekadashi-calendar-fixture", "devam-ekadashi-safety-boundary"],
                "separate_lane_required": False,
            },
        ],
        "safety_and_boundaries": [
            "मार्ग उपयोग करने से पहले सटीक स्थान और स्मार्त या वैष्णव पंचांग-मार्ग की पुष्टि करें।",
            "परिवार, मंदिर और सम्प्रदाय का स्थापित मार्ग इस सामान्य भक्ति-क्रम से पहले आता है।",
            "उपवास, निर्जला अभ्यास, भोजन-नियम, चिकित्सा-सलाह या अपुष्ट स्मार्त पारण-समय नहीं दिया जाता।",
            "सार्वभौमिक मंत्र, कथा, पूजा या नामित-एकादशी कथा नहीं गढ़ी जाती।",
            "पाप-नाश, पुण्य, मुक्ति, स्वास्थ्य, समृद्धि या अन्य फल की गारंटी नहीं दी जाती।",
        ],
    }


def mapped_sources(legacy: dict[str, Any]) -> list[dict[str, Any]]:
    result = []
    for item in legacy["sources"]:
        result.append(source(
            item["source_id"],
            item["title"],
            item["publisher"],
            item["evidence_role"].replace("_", " "),
            "citation_only" if item["rights_lane"] == "reference_only" else item["rights_lane"],
            url=item.get("url"),
            artifact_sha256=item.get("artifact_sha256"),
            citation_coordinates={"path": "knowledge_packs/panchang/ekadashi-delhi-mumbai-chennai-september-december-2026-v1.json"} if item["source_id"] == "devam-ekadashi-calendar-fixture" else None,
            observed_fetch=item.get("observed_fetch"),
        ))
    return result


def build() -> dict[str, Any]:
    verify_inputs()
    legacy = load("ekadashi-recurring-devotional-practice-v1.json")
    fixture = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    if fixture["contract"] != "DEVAM_BOUNDED_EKADASHI_CALENDAR_FIXTURE_V1" or fixture["scope"]["universal_india_claim"] is not False:
        raise ValueError("Ekadashi fixture identity drift")
    if any(fixture["denials"].values()):
        raise ValueError("Ekadashi fixture denial drift")

    lane_id = "ekadashi-recurring-devotional-content-v1"
    localized = localized_content(
        legacy,
        lane_id,
        {"minimum": "self_guided_non_fasting", "standard": "family_guided_non_fasting", "elaborate": "established_family_temple_or_sampradaya_guided"},
        ["devam-ekadashi-safety-boundary"],
        ["devam-ekadashi-safety-boundary"],
        details,
    )
    pack = {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1",
        "lane_id": lane_id,
        "supersedes_legacy_pack_ids": [legacy["pack_id"]],
        "observance_slugs": legacy["observance_slugs"],
        "applicability": {
            "region_codes": ["north-india", "west-india", "south-india", "iskcon-india"],
            "tradition_codes": ["smarta-north-india", "smarta-west-india", "smarta-south-india", "vaishnava-iskcon"],
            "context_pairs": legacy["scope"]["region_tradition_pairs"],
            "settings": ["individual", "household", "family_led", "teacher_led", "temple", "community"],
            "family_practice_overrides_generic_guidance": True,
            "material_context_questions": legacy["guides"][0]["context_prompts"],
        },
        "calendar": {
            "resolution_source_ids": ["devam-ekadashi-calendar-fixture", "nirnayasindhu-1865-ekadashi-decision-chapter", "iskcon-bangalore-ekadashi-practice"],
            "timing_kind": "mixed",
            "location_aware": True,
            "tradition_aware": True,
            "decision_rule_id": "devam-bounded-smarta-or-iskcon-ekadashi-profile-2026-v1",
            "closing_decision_rule_id": None,
            "live_schedule_required": True,
            "freshness_note": "Use only after Today resolves the exact observance for the requested location and tradition. Verify any fast, food rule, parana or live programme with the responsible family, temple or sampradaya authority.",
        },
        "sources": mapped_sources(legacy),
        "localized_content": localized,
        "product_status": status(),
    }
    assert_source_references(pack)
    if [item["language_code"] for item in localized] != ["en", "hi"]:
        raise ValueError("Ekadashi language drift")
    if any([procedure["tier"] for procedure in item["procedures"]] != ["minimum", "standard", "elaborate"] for item in localized):
        raise ValueError("Ekadashi tier drift")
    return pack


def main() -> None:
    pack = build()
    payload = (json.dumps(pack, ensure_ascii=False, indent=2, sort_keys=True) + "\n").encode("utf-8")
    if OUTPUT.exists():
        raise FileExistsError(f"Refusing to overwrite {OUTPUT}")
    OUTPUT.write_bytes(payload)
    print(json.dumps({"path": str(OUTPUT.relative_to(ROOT)), "bytes": len(payload), "sha256": hashlib.sha256(payload).hexdigest()}))


if __name__ == "__main__":
    main()

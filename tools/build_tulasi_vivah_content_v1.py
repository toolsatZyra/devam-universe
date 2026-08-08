#!/usr/bin/env python3
"""Build the bounded current-contract general and BAPS Tulasi Vivah lanes."""

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
OUTPUT = PACK_DIR / "tulasi-vivah-general-baps-content-v1.json"
LEGACY_PATH = PACK_DIR / "tulasi-vivah-participation-v1.json"
FIXTURE_PATH = PANCHANG_DIR / "tulasi-vivah-2026-v1.json"
EXPECTED = {
    LEGACY_PATH: (30064, "88dddb92d3bf9ab43ba40125e4475581faf408f1755d497df64e3810a58eacc8"),
    FIXTURE_PATH: (6414, "fa33540adba85a7e4e79b454d98c80677c0b7c92b0e557a26ea6168b7f038257"),
}


def verify_inputs() -> None:
    for path, (size, digest) in EXPECTED.items():
        payload = path.read_bytes()
        if len(payload) != size or hashlib.sha256(payload).hexdigest() != digest:
            raise ValueError(f"Tulasi Vivah frozen input drift: {path}")


def details(language: str) -> dict[str, Any]:
    if language == "en":
        return {
            "significance": {
                "text": "Tulasi Vivah remembers a divine union associated in these sources with Tulasi and Vishnu or Krishna. The general North/West India lane and the separately dated BAPS sequence remain distinct; gratitude, prayer, gentle care and responsible participation form the bounded shared core.",
                "source_ids": ["devam-tulasi-vivah-date-fixture", "incredible-india-tulsi-vivah", "drikpanchang-tulasi-vivah", "baps-tulsi-vivah-sequence"],
                "scope_note": "Festival identity and institutional sequences are attributable; the home forms are Devam synthesis and do not reconstruct a universal wedding liturgy.",
            },
            "origin_narratives": [{
                "narrative_id": "tulasi-vishnu-krishna-union-traditions",
                "title": "Tulasi's divine-union traditions",
                "summary": "The reviewed sources connect Tulasi Vivah with Tulasi and Vishnu or Krishna through more than one story and living practice. Devam preserves the source and tradition behind each account instead of selecting one universal origin narrative.",
                "tradition_scope": "General North/West India and separately attributable BAPS contexts",
                "source_ids": ["incredible-india-tulsi-vivah", "drikpanchang-tulasi-vivah", "baps-tulsi-vivah-sequence"],
                "universal_origin_claimed": False,
            }],
            "typical_practices": [
                {
                    "practice_id": "gentle-home-remembrance",
                    "population_scope": "North/West India Smarta individual or household",
                    "description": "Remember the divine relationship through a family-known prayer or story, gratitude and one act of gentle care. A mental or image-based remembrance is available when no living plant is present.",
                    "source_ids": ["incredible-india-tulsi-vivah", "drikpanchang-tulasi-vivah", "devam-tulasi-vivah-safety-boundary"],
                    "instructional": False,
                },
                {
                    "practice_id": "baps-sequence-participation",
                    "population_scope": "BAPS family or mandir participant",
                    "description": "Follow the official BAPS November 21-24 sequence only through the family's or mandir's established programme; Devam does not reconstruct its liturgy.",
                    "source_ids": ["devam-tulasi-vivah-date-fixture", "baps-tulsi-vivah-sequence", "devam-tulasi-vivah-safety-boundary"],
                    "instructional": False,
                },
            ],
            "variants": [
                {
                    "variant_id": "general-and-baps-dates",
                    "scope": "General North/West India lane and BAPS begin/end sequence",
                    "difference": "Their dates and responsible authorities are separately resolved and never collapsed into one universal Tulasi Vivah day.",
                    "source_ids": ["devam-tulasi-vivah-date-fixture", "drikpanchang-tulasi-vivah", "baps-tulsi-vivah-sequence"],
                    "separate_lane_required": True,
                },
                {
                    "variant_id": "living-plant-and-plant-free",
                    "scope": "Existing Tulasi plant, image, remembered teaching or plant-free reflection",
                    "difference": "A living plant is optional. No plucking, pruning, ingestion, overwatering, chemical decoration or new purchase is instructed.",
                    "source_ids": ["devam-tulasi-vivah-safety-boundary"],
                    "separate_lane_required": False,
                },
                {
                    "variant_id": "remembrance-and-formal-wedding-liturgy",
                    "scope": "Accessible remembrance versus established family, temple or BAPS ritual",
                    "difference": "The companion imports no priest-led mantra, sankalpa, kanyadan, wedding sequence, fast, offering or real-world marriage role.",
                    "source_ids": ["incredible-india-tulsi-vivah", "baps-tulsi-vivah-sequence", "devam-tulasi-vivah-safety-boundary"],
                    "separate_lane_required": True,
                },
            ],
            "safety_and_boundaries": [
                "Use the exact general or BAPS date lane and follow the responsible family, temple or institution for formal practice.",
                "A living plant is optional; do not pluck, prune, ingest, overwater or chemically decorate one because of this guide.",
                "No fast, dietary, medical, herbal, fertility, marriage or prosperity advice is supplied.",
                "No priest-led mantra, sankalpa, kanyadan, wedding reenactment, purchase, gift or gender role is prescribed.",
                "No marriage, fertility, prosperity, merit or other outcome is guaranteed.",
            ],
        }
    return {
        "significance": {
            "text": "इन स्रोतों में तुलसी विवाह तुलसी और विष्णु या कृष्ण से जुड़े दिव्य सम्बन्ध का स्मरण है। सामान्य उत्तर/पश्चिम भारत मार्ग और अलग तिथियों वाला BAPS क्रम अलग रहते हैं; कृतज्ञता, प्रार्थना, कोमल देखभाल और उत्तरदायी सहभागिता सीमित साझा मूल हैं।",
            "source_ids": ["devam-tulasi-vivah-date-fixture", "incredible-india-tulsi-vivah", "drikpanchang-tulasi-vivah", "baps-tulsi-vivah-sequence"],
            "scope_note": "उत्सव-पहचान और संस्थागत क्रम स्रोत-नामित हैं; घरेलू रूप Devam संश्लेषण हैं और सार्वभौमिक विवाह-विधि की पुनर्रचना नहीं करते।",
        },
        "origin_narratives": [{
            "narrative_id": "tulasi-vishnu-krishna-union-traditions",
            "title": "तुलसी की दिव्य-सम्बन्ध परम्पराएँ",
            "summary": "समीक्षित स्रोत तुलसी विवाह को तुलसी और विष्णु या कृष्ण से एक से अधिक कथाओं और जीवित अभ्यासों द्वारा जोड़ते हैं। Devam एक सार्वभौमिक मूल-कथा चुनने के बजाय हर वृत्तान्त का स्रोत और परम्परा सुरक्षित रखता है।",
            "tradition_scope": "सामान्य उत्तर/पश्चिम भारत और अलग स्रोत-नामित BAPS संदर्भ",
            "source_ids": ["incredible-india-tulsi-vivah", "drikpanchang-tulasi-vivah", "baps-tulsi-vivah-sequence"],
            "universal_origin_claimed": False,
        }],
        "typical_practices": [
            {
                "practice_id": "gentle-home-remembrance",
                "population_scope": "उत्तर/पश्चिम भारत स्मार्त व्यक्ति या परिवार",
                "description": "परिवार-परिचित प्रार्थना या कथा, कृतज्ञता और कोमल देखभाल के एक काम से दिव्य सम्बन्ध स्मरण करें। जीवित पौधा न हो तो मानसिक या चित्र-आधारित स्मरण उपलब्ध है।",
                "source_ids": ["incredible-india-tulsi-vivah", "drikpanchang-tulasi-vivah", "devam-tulasi-vivah-safety-boundary"],
                "instructional": False,
            },
            {
                "practice_id": "baps-sequence-participation",
                "population_scope": "BAPS परिवार या मंदिर सहभागी",
                "description": "आधिकारिक BAPS 21-24 नवम्बर क्रम का पालन केवल परिवार या मंदिर के स्थापित कार्यक्रम से करें; Devam उसकी विधि की पुनर्रचना नहीं करता।",
                "source_ids": ["devam-tulasi-vivah-date-fixture", "baps-tulsi-vivah-sequence", "devam-tulasi-vivah-safety-boundary"],
                "instructional": False,
            },
        ],
        "variants": [
            {
                "variant_id": "general-and-baps-dates",
                "scope": "सामान्य उत्तर/पश्चिम भारत मार्ग और BAPS आरम्भ/समापन क्रम",
                "difference": "उनकी तिथियाँ और उत्तरदायी अधिकार अलग तय होते हैं और एक सार्वभौमिक तुलसी विवाह दिन में नहीं मिलाए जाते।",
                "source_ids": ["devam-tulasi-vivah-date-fixture", "drikpanchang-tulasi-vivah", "baps-tulsi-vivah-sequence"],
                "separate_lane_required": True,
            },
            {
                "variant_id": "living-plant-and-plant-free",
                "scope": "स्थापित तुलसी पौधा, चित्र, स्मरण की शिक्षा या पौधा-रहित चिंतन",
                "difference": "जीवित पौधा वैकल्पिक है। इस मार्ग के कारण तोड़ना, काटना, खाना, अधिक पानी, रासायनिक सजावट या नई खरीद नहीं बताई जाती।",
                "source_ids": ["devam-tulasi-vivah-safety-boundary"],
                "separate_lane_required": False,
            },
            {
                "variant_id": "remembrance-and-formal-wedding-liturgy",
                "scope": "सुलभ स्मरण और स्थापित परिवार, मंदिर या BAPS विधि",
                "difference": "सहचर पुरोहित-मंत्र, संकल्प, कन्यादान, विवाह-क्रम, उपवास, अर्पण या वास्तविक विवाह-भूमिका आयात नहीं करता।",
                "source_ids": ["incredible-india-tulsi-vivah", "baps-tulsi-vivah-sequence", "devam-tulasi-vivah-safety-boundary"],
                "separate_lane_required": True,
            },
        ],
        "safety_and_boundaries": [
            "सटीक सामान्य या BAPS तिथि-मार्ग उपयोग करें और औपचारिक अभ्यास के लिए उत्तरदायी परिवार, मंदिर या संस्था का मार्ग मानें।",
            "जीवित पौधा वैकल्पिक है; इस मार्ग के कारण उसे तोड़ें, काटें, खाएँ, अधिक पानी या रासायनिक सजावट न दें।",
            "उपवास, भोजन, चिकित्सा, औषधीय, उर्वरता, विवाह या समृद्धि सलाह नहीं दी जाती।",
            "पुरोहित-मंत्र, संकल्प, कन्यादान, विवाह-अभिनय, खरीद, उपहार या लैंगिक भूमिका नहीं बताई जाती।",
            "विवाह, उर्वरता, समृद्धि, पुण्य या अन्य फल की गारंटी नहीं दी जाती।",
        ],
    }


def mapped_sources(legacy: dict[str, Any]) -> list[dict[str, Any]]:
    fixture = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    fetch_by_url = {item.get("url"): item.get("observed_fetch") for item in fixture["sources"] if item.get("url")}
    return [source(
        item["source_id"], item["title"], item["publisher"], item.get("evidence_role", item["source_class"]).replace("_", " "),
        "citation_only" if item["rights_lane"] == "reference_only" else item["rights_lane"],
        url=item.get("url"), artifact_sha256=item.get("artifact_sha256"),
        citation_coordinates={"path": "knowledge_packs/panchang/tulasi-vivah-2026-v1.json"} if item["source_id"] == "devam-tulasi-vivah-date-fixture" else None,
        observed_fetch=item.get("observed_fetch") or fetch_by_url.get(item.get("url")),
    ) for item in legacy["sources"]]


def guide_slugs(guide_id: str) -> list[str]:
    return ["tulasi-vivah-dwadashi"] if "general" in guide_id else ["tulsi-vivah-baps-begins", "tulsi-vivah-baps-samapt"]


def build() -> dict[str, Any]:
    verify_inputs()
    legacy = load("tulasi-vivah-participation-v1.json")
    fixture = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    if fixture["contract"] != "DEVAM_TULASI_VIVAH_2026_DATE_EVIDENCE_FIXTURE_V1" or any(lane.get("universal_india_claim") or lane.get("universal_hindu_claim") for lane in fixture["lanes"]):
        raise ValueError("Tulasi Vivah fixture identity drift")
    if any(fixture["denials"].values()):
        raise ValueError("Tulasi Vivah fixture denial drift")

    lane_id = "tulasi-vivah-general-baps-content-v1"
    localized = localized_content(
        legacy, lane_id,
        {"minimum": "self_guided_accessible_remembrance", "standard": "family_or_source_guided", "elaborate": "established_family_temple_or_baps_programme_guided"},
        ["devam-tulasi-vivah-safety-boundary"], ["devam-tulasi-vivah-safety-boundary"], details,
    )
    for guide, content in zip(legacy["guides"], localized, strict=True):
        content["observance_slugs"] = guide_slugs(guide["guide_id"])

    context_pairs = [
        {"observance_slug": "tulasi-vivah-dwadashi", "region_code": "north-india", "tradition_code": "smarta-north-india"},
        {"observance_slug": "tulasi-vivah-dwadashi", "region_code": "west-india", "tradition_code": "smarta-west-india"},
        {"observance_slug": "tulsi-vivah-baps-begins", "region_code": "baps-gujarat", "tradition_code": "swaminarayan-baps"},
        {"observance_slug": "tulsi-vivah-baps-samapt", "region_code": "baps-gujarat", "tradition_code": "swaminarayan-baps"},
    ]
    notes = [
        {"observance_slug": slug, "language_code": guide["language_code"], "note": guide["family_practice_note"]}
        for guide in legacy["guides"] for slug in guide_slugs(guide["guide_id"])
    ]
    pack = {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1", "lane_id": lane_id,
        "supersedes_legacy_pack_ids": [legacy["pack_id"]], "observance_slugs": legacy["observance_slugs"],
        "applicability": {
            "region_codes": ["north-india", "west-india", "baps-gujarat"],
            "tradition_codes": ["smarta-north-india", "smarta-west-india", "swaminarayan-baps"],
            "context_pairs": context_pairs, "observance_context_notes": notes,
            "settings": ["individual", "household", "family_led", "teacher_led", "temple", "community"],
            "family_practice_overrides_generic_guidance": True,
            "material_context_questions": legacy["guides"][0]["context_prompts"],
        },
        "calendar": {
            "resolution_source_ids": ["devam-tulasi-vivah-date-fixture", "drikpanchang-tulasi-vivah", "baps-tulsi-vivah-sequence"],
            "timing_kind": "mixed", "location_aware": True, "tradition_aware": True,
            "decision_rule_id": "devam-bounded-general-or-baps-tulasi-vivah-2026-v1",
            "closing_decision_rule_id": None, "live_schedule_required": True,
            "freshness_note": "Use the exact general or BAPS calendar lane and verify any family, temple or institutional programme with its current responsible authority.",
        },
        "sources": mapped_sources(legacy), "localized_content": localized, "product_status": status(),
    }
    assert_source_references(pack)
    return pack


def main() -> None:
    payload = (json.dumps(build(), ensure_ascii=False, indent=2, sort_keys=True) + "\n").encode("utf-8")
    if OUTPUT.exists():
        raise FileExistsError(f"Refusing to overwrite {OUTPUT}")
    OUTPUT.write_bytes(payload)
    print(json.dumps({"path": str(OUTPUT.relative_to(ROOT)), "bytes": len(payload), "sha256": hashlib.sha256(payload).hexdigest()}))


if __name__ == "__main__":
    main()

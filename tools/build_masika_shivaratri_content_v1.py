#!/usr/bin/env python3
"""Build the current-contract September-December Masika Shivaratri lane."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any

from build_early_diwali_content_batch_v1 import load, source, status
from build_late_diwali_content_batch_v1 import assert_source_references, localized_content

ROOT = Path(__file__).resolve().parents[1]
LEGACY = ROOT / "knowledge_packs/rituals/masika-shivaratri-north-west-india-v1.json"
OUTPUT = ROOT / "knowledge_packs/rituals/masika-shivaratri-north-west-india-content-v1.json"
LEGACY_SIZE = 20998
LEGACY_SHA256 = "e80bcba5a71b9df57e3cda56e2889c979fe1a221036811c32fe98957507bdca6"


def details(language: str) -> dict[str, Any]:
    english = language == "en"
    return {
        "significance": {
            "text": (
                "In this bounded North/West India Smarta lane, Masika Shivaratri is a recurring Krishna-paksha Chaturdashi night for Shiva remembrance. Devam resolves the night through the retained pradosha-nishita rule while family, temple, or initiated Shaiva practice controls any formal observance."
                if english else
                "इस सीमित उत्तर/पश्चिम भारत स्मार्त मार्ग में मासिक शिवरात्रि कृष्ण-पक्ष चतुर्दशी की शिव-स्मरण रात्रि है। देवम संचित प्रदोष-निशीथ नियम से रात्रि तय करता है; औपचारिक आचरण परिवार, मंदिर या दीक्षित शैव परम्परा के अधीन रहता है।"
            ),
            "source_ids": ["nirnayasindhu-1865-masika-shivaratri-rule", "drikpanchang-delhi-masika-shivaratri-2026", "mhada-masika-shivaratri-identity"],
            "scope_note": "This completes only the named four-month remembrance and participant lane; it is not annual Mahashivaratri or a universal vrata, fast, vigil, abhisheka, mantra, offering, or parana.",
        },
        "origin_narratives": [{
            "narrative_id": "monthly-shivaratri-identity",
            "title": "Monthly Shiva remembrance" if english else "मासिक शिव-स्मरण",
            "summary": (
                "The historical rule, current practitioner calendar, Maharashtra calendar identity, and Somnath programme independently support a recurring monthly Shiva night. They do not establish one universal origin story or one household procedure."
                if english else
                "ऐतिहासिक नियम, वर्तमान पंचांग, महाराष्ट्र की मासिक पहचान और सोमनाथ कार्यक्रम मासिक शिव-रात्रि की पुष्टि करते हैं; वे एक सार्वभौमिक उत्पत्ति-कथा या गृह-विधि सिद्ध नहीं करते।"
            ),
            "tradition_scope": "Named historical, current practitioner, Maharashtra, and Somnath evidence",
            "source_ids": ["nirnayasindhu-1865-masika-shivaratri-rule", "drikpanchang-delhi-masika-shivaratri-2026", "ministry-tourism-somnath-monthly-shivratri", "mhada-masika-shivaratri-identity"],
            "universal_origin_claimed": False,
        }],
        "typical_practices": [
            {
                "practice_id": "shiva-prayer-meditation-reflection",
                "population_scope": "Official Maharashtra annual context used only for bounded devotional vocabulary",
                "description": "Prayer, meditation, reflection, and family devotion are attributable Shiva contexts; this lane offers them without importing the annual festival's formal practices." if english else "प्रार्थना, ध्यान, चिंतन और पारिवारिक भक्ति शिव-सन्दर्भ हैं; यह मार्ग वार्षिक पर्व की औपचारिक विधियां मासिक रूप में नहीं लाता।",
                "source_ids": ["maharashtra-tourism-mahashivaratri-context", "devam-masika-shivaratri-safety-boundary"],
                "instructional": False,
            },
            {
                "practice_id": "somnath-monthly-temple-programme",
                "population_scope": "Somnath temple programme only",
                "description": "The official Somnath listing supports temple-led monthly puja, aarti, and darshan as one attributable institutional lane, not a home script." if english else "आधिकारिक सोमनाथ विवरण मंदिर-नेतृत्व वाले मासिक पूजन, आरती और दर्शन का एक संस्थागत मार्ग बताता है, गृह-विधि नहीं।",
                "source_ids": ["ministry-tourism-somnath-monthly-shivratri"],
                "instructional": False,
            },
        ],
        "variants": [
            {"variant_id": "north-west-smarta-pairs", "scope": "Supported date/practice pairs", "difference": "North and West India Smarta pairs share this accessible companion, but local date, family practice, temple programme, and closing remain contextual.", "source_ids": ["nirnayasindhu-1865-masika-shivaratri-rule", "drikpanchang-delhi-masika-shivaratri-2026", "devam-masika-shivaratri-safety-boundary"], "separate_lane_required": False},
            {"variant_id": "somnath-institutional-lane", "scope": "Somnath temple", "difference": "Somnath's monthly puja, aarti, and darshan remain under that institution and are not copied into the household sequence.", "source_ids": ["ministry-tourism-somnath-monthly-shivratri"], "separate_lane_required": True},
            {"variant_id": "annual-mahashivaratri-separate", "scope": "Annual Mahashivaratri", "difference": "Annual Mahashivaratri stories, fasting, vigil, abhisheka, liturgy, crowds, and regional forms are not monthly defaults.", "source_ids": ["maharashtra-tourism-mahashivaratri-context", "devam-masika-shivaratri-safety-boundary"], "separate_lane_required": True},
        ],
        "safety_and_boundaries": [
            "Do not begin, extend, or break a fast from this companion.",
            "No food, medical, vigil, parana, abhisheka ingredient, home-lingam, mantra-count, priestly, or promised-outcome instruction is supplied.",
            "Use a material-free and flame-free form whenever it suits the user or setting.",
            "A family, temple, or initiated authority controls any established formal practice.",
        ],
    }


def build() -> dict[str, Any]:
    payload = LEGACY.read_bytes()
    if len(payload) != LEGACY_SIZE or hashlib.sha256(payload).hexdigest() != LEGACY_SHA256:
        raise ValueError("Masika Shivaratri retained input drift")
    legacy = load(LEGACY.name)
    if legacy["contract"] != "DEVAM_RECURRING_RITUAL_PROCEDURE_PACK_V1" or legacy["pack_id"] != "devam-masika-shivaratri-north-west-india-v1":
        raise ValueError("Masika Shivaratri identity drift")
    lane_id = "masika-shivaratri-north-west-india-content-v1"
    localized = localized_content(
        legacy, lane_id,
        {"minimum": "Self-guided remembrance", "standard": "Individual or household reflection", "elaborate": "Established family- or temple-led participation"},
        ["devam-masika-shivaratri-safety-boundary"],
        ["devam-masika-shivaratri-safety-boundary"],
        details,
    )
    sources = []
    for item in legacy["sources"]:
        rights_lane = "citation_only" if item["rights_lane"] == "reference_only" else item["rights_lane"]
        sources.append(source(
            item["source_id"], item["title"], item["publisher"], item["evidence_role"], rights_lane,
            url=item.get("url"), artifact_sha256=item.get("artifact_sha256"),
            citation_coordinates={"legacy_pack": "knowledge_packs/rituals/masika-shivaratri-north-west-india-v1.json"} if item.get("artifact_sha256") else None,
            observed_fetch=item.get("observed_fetch"),
        ))
    pack = {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1",
        "lane_id": lane_id,
        "supersedes_legacy_pack_ids": [legacy["pack_id"]],
        "observance_slugs": legacy["observance_slugs"],
        "applicability": {
            "region_codes": ["north-india", "west-india"],
            "tradition_codes": ["smarta-north-india", "smarta-west-india"],
            "context_pairs": legacy["scope"]["region_tradition_pairs"],
            "settings": ["individual", "household", "family_led", "temple"],
            "family_practice_overrides_generic_guidance": True,
            "material_context_questions": legacy["guides"][0]["context_prompts"],
        },
        "calendar": {
            "resolution_source_ids": ["nirnayasindhu-1865-masika-shivaratri-rule", "drikpanchang-delhi-masika-shivaratri-2026"],
            "timing_kind": "textual_rule",
            "location_aware": True,
            "tradition_aware": True,
            "decision_rule_id": "devam-masika-shivaratri-pradosha-nishita-v1",
            "closing_decision_rule_id": None,
            "live_schedule_required": True,
            "freshness_note": "Resolve the night for the user's location and profile. Family or temple authority controls formal timing, fasting, offerings, vigil, and close.",
        },
        "sources": sources,
        "localized_content": localized,
        "product_status": status(),
    }
    assert_source_references(pack)
    return pack


def render(pack: dict[str, Any]) -> bytes:
    return (json.dumps(pack, ensure_ascii=False, indent=2, sort_keys=True) + "\n").encode("utf-8")


def main() -> None:
    if OUTPUT.exists():
        raise FileExistsError(f"Refusing to overwrite {OUTPUT}")
    payload = render(build())
    OUTPUT.write_bytes(payload)
    print(json.dumps({"path": str(OUTPUT.relative_to(ROOT)), "bytes": len(payload), "sha256": hashlib.sha256(payload).hexdigest()}))


if __name__ == "__main__":
    main()

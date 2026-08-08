#!/usr/bin/env python3
"""Migrate the final four retained ritual packs to Devam's current contract."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any

from build_early_diwali_content_batch_v1 import convert_procedures, source, status
from build_late_diwali_content_batch_v1 import assert_source_references


ROOT = Path(__file__).resolve().parents[1]
PACK_DIR = ROOT / "knowledge_packs" / "rituals"
SPECS: dict[str, dict[str, Any]] = {
    "ananta": {
        "input": "ananta-chaturdashi-north-west-v1.json", "size": 21316, "sha": "d64e500329df8611688cfdf709dd75adf740046258a8a90e39e1d057142bfa6b",
        "contract": "DEVAM_RITUAL_PROCEDURE_PACK_V1", "legacy_id": "devam-ananta-chaturdashi-north-west-v1", "slug": "ananta-chaturdashi", "lane": "ananta-chaturdashi-north-west-content-v1",
        "output": "ananta-chaturdashi-north-west-content-v1.json", "calendar": ["nirnayasindhu-1865-ananta-chaturdashi", "drikpanchang-ananta-chaturdashi-mumbai-2026"],
        "decision": "devam-ananta-chaturdashi-mumbai-v1", "regions": ["north-india", "west-india"], "traditions": ["smarta-north-india", "smarta-west-india"], "safety": "devam-ananta-chaturdashi-safety-boundary",
    },
    "kalabhairava": {
        "input": "kalabhairava-jayanti-north-kashi-v1.json", "size": 19889, "sha": "9f465cfabc9a0e6ed9d30eaca83dc8ef0fe21e425137651069d60272928cb73a",
        "contract": "DEVAM_RITUAL_PROCEDURE_PACK_V1", "legacy_id": "devam-kalabhairava-jayanti-north-kashi-v1", "slug": "kalabhairava-jayanti", "lane": "kalabhairava-jayanti-north-kashi-content-v1",
        "output": "kalabhairava-jayanti-north-kashi-content-v1.json", "calendar": ["devam-kalabhairava-calendar-fixture", "drikpanchang-delhi-masika-kalashtami-2026"],
        "decision": "devam-kalabhairava-jayanti-night-ashtami-v1", "regions": ["north-india", "kashi-varanasi"], "traditions": ["smarta-north-india", "regional-kashi-varanasi"], "safety": "devam-kalabhairava-safety-boundary",
    },
    "kojagara": {
        "input": "kojagara-sharad-purnima-north-west-v1.json", "size": 29295, "sha": "4c1e78a6d3a1a4b9b7002f6534a8a80ef92d5e5cdfdd3f01b992b258a901c340",
        "contract": "DEVAM_RITUAL_PROCEDURE_PACK_V1", "legacy_id": "devam-kojagara-sharad-purnima-north-west-v1", "slug": "kojagara-puja-sharad-purnima", "lane": "kojagara-sharad-purnima-north-west-content-v1",
        "output": "kojagara-sharad-purnima-north-west-content-v1.json", "calendar": ["devam-kojagara-calendar-fixture", "nirnayasindhu-1865-ashvayuja-kojagari", "drikpanchang-delhi-kojagara-2026"],
        "decision": "devam-kojagara-purnima-nishita-v1", "regions": ["north-india", "west-india"], "traditions": ["smarta-north-india", "smarta-west-india"], "safety": "devam-kojagara-safety-boundary",
    },
    "rishi": {
        "input": "rishi-panchami-saptarishi-reflection-v1.json", "size": 20668, "sha": "88f37cba2d005f7b11617ab557a45d9a93037c7158869634c4efaf8fd67ad23c",
        "contract": "DEVAM_RITUAL_PROCEDURE_PACK_V1", "legacy_id": "devam-rishi-panchami-saptarishi-reflection-v1", "slug": "rishi-panchami", "lane": "rishi-panchami-saptarishi-reflection-content-v1",
        "output": "rishi-panchami-saptarishi-reflection-content-v1.json", "calendar": ["devam-rishi-panchami-calendar-fixture", "nirnayasindhu-1865-rishi-panchami-decision", "drikpanchang-rishi-panchami-delhi-2026"],
        "decision": "devam-rishi-panchami-delhi-v1", "regions": ["north-india", "west-india"], "traditions": ["smarta-north-india", "smarta-west-india"], "safety": "devam-rishi-panchami-safety-boundary",
    },
}


def load_fixed(spec: dict[str, Any]) -> dict[str, Any]:
    payload = (PACK_DIR / spec["input"]).read_bytes()
    if len(payload) != spec["size"] or hashlib.sha256(payload).hexdigest() != spec["sha"]:
        raise ValueError(f"retained input drift: {spec['input']}")
    pack = json.loads(payload.decode("utf-8"))
    if pack["contract"] != spec["contract"] or pack["pack_id"] != spec["legacy_id"]:
        raise ValueError(f"retained identity drift: {spec['input']}")
    return pack


def convert_sources(legacy: dict[str, Any], legacy_name: str) -> list[dict[str, Any]]:
    rights = {"reference_only": "citation_only", "private_evidence": "internal_only", "derivative_allowed": "derivative_allowed"}
    def normalized_fetch(item: dict[str, Any]) -> dict[str, Any] | None:
        observed = item.get("observed_fetch")
        if not observed:
            return None
        result = dict(observed)
        if "fetched_at_utc" in result:
            result["observed_at"] = result.pop("fetched_at_utc")
        return result
    return [source(
        item["source_id"], item["title"], item["publisher"],
        item.get("evidence_role", item.get("source_class", "Retained bounded evidence")), rights[item["rights_lane"]],
        url=item.get("url"), artifact_sha256=item.get("artifact_sha256"),
        citation_coordinates={"legacy_pack": f"knowledge_packs/rituals/{legacy_name}"} if item.get("artifact_sha256") else None,
        observed_fetch=normalized_fetch(item),
    ) for item in legacy["sources"]]


def details(kind: str, language: str) -> dict[str, Any]:
    en = language == "en"
    if kind == "ananta":
        return {
            "significance": {"text": "This bounded North/West India Smarta lane remembers Ananta/Vishnu through continuity, responsibility, and one sustainable commitment; Ananta-vrata and Ganesh Visarjan remain separate." if en else "यह सीमित उत्तर/पश्चिम भारत स्मार्त मार्ग अनन्त/विष्णु का स्मरण निरन्तरता, जिम्मेदारी और एक टिकाऊ संकल्प से करता है; अनन्त-व्रत और गणेश विसर्जन अलग रहते हैं।", "source_ids": ["nirnayasindhu-1865-ananta-chaturdashi", "drikpanchang-ananta-chaturdashi-mumbai-2026", "devam-ananta-chaturdashi-safety-boundary"], "scope_note": "No universal Ananta-vrata, Ganesh immersion, thread, fast, puja, or outcome is supplied."},
            "origin_narratives": [{"narrative_id": "ananta-vishnu-attributable-account", "title": "Ananta/Vishnu remembrance" if en else "अनन्त/विष्णु स्मरण", "summary": "The retained historical and practitioner evidence supports an attributable Ananta/Vishnu observance, but not one universal story, theology, or procedure." if en else "संचित ऐतिहासिक और व्यवहारिक साक्ष्य अनन्त/विष्णु के स्रोत-चिह्नित स्मरण का समर्थन करते हैं, पर एक सार्वभौमिक कथा, दर्शन या विधि का नहीं।", "tradition_scope": "Bounded North/West India Smarta evidence", "source_ids": ["nirnayasindhu-1865-ananta-chaturdashi", "drikpanchang-ananta-chaturdashi-mumbai-2026"], "universal_origin_claimed": False}],
            "typical_practices": [{"practice_id": "ananta-reading-reflection-commitment", "population_scope": "Supported family or individual remembrance", "description": "A family-known prayer or attributable reading, reflection on continuity, and one responsible commitment form the accessible lane." if en else "परिवार-परिचित प्रार्थना या स्रोत-चिह्नित पाठ, निरन्तरता पर चिंतन और एक जिम्मेदार संकल्प सरल मार्ग बनाते हैं।", "source_ids": ["devam-ananta-chaturdashi-safety-boundary", "nirnayasindhu-1865-ananta-chaturdashi"], "instructional": False}],
            "variants": [{"variant_id": "ananta-vrata-separate", "scope": "Established Ananta-vrata", "difference": "Formal vrata, thread, image, kalasha, mantra, offerings, and close remain with the responsible tradition.", "source_ids": ["nirnayasindhu-1865-ananta-chaturdashi", "devam-ananta-chaturdashi-safety-boundary"], "separate_lane_required": True}, {"variant_id": "ganesh-visarjan-separate", "scope": "Maharashtra Ganesh Visarjan", "difference": "The coincident immersion festival keeps its own authority, safety, and procedure.", "source_ids": ["maharashtra-tourism-ganesh-chaturthi-visarjan", "incredible-india-ganesh-chaturthi-visarjan"], "separate_lane_required": True}],
            "safety_and_boundaries": ["Do not begin or manage a fast from this guide.", "No kalasha, serpent image, mantra, offering, homa, fourteen-knot thread, immersion, food, medical, or promised-outcome instruction is supplied.", "Use family or sampradaya authority for any established vrata."],
        }
    if kind == "kalabhairava":
        return {
            "significance": {"text": "This bounded North India Smarta and Kashi regional lane supports Shiva/Bhairava remembrance, courage, discipline, responsible guardianship, and safe temple participation." if en else "यह सीमित उत्तर भारत स्मार्त और काशी क्षेत्रीय मार्ग शिव/भैरव स्मरण, साहस, अनुशासन, जिम्मेदार संरक्षण और सुरक्षित मंदिर सहभागिता का समर्थन करता है।", "source_ids": ["devam-kalabhairava-calendar-fixture", "drikpanchang-delhi-masika-kalashtami-2026", "kashi-official-shri-kaal-bhairav-temple"], "scope_note": "Kashi's temple identity is regional context, not a universal home, tantric, protection, or exorcistic procedure."},
            "origin_narratives": [{"narrative_id": "kashi-regional-kaal-bhairav-identity", "title": "Kashi's regional Kaal Bhairav identity" if en else "काशी की क्षेत्रीय काल भैरव पहचान", "summary": "The official Kashi temple source preserves one regional Bhairava identity. It does not establish one origin story or home procedure for every Bhairava form or Kalashtami tradition." if en else "काशी का आधिकारिक मंदिर-स्रोत भैरव की एक क्षेत्रीय पहचान सुरक्षित रखता है। यह हर भैरव रूप या कालाष्टमी परम्परा की एक उत्पत्ति-कथा या गृह-विधि सिद्ध नहीं करता।", "tradition_scope": "Kashi regional temple context", "source_ids": ["kashi-official-shri-kaal-bhairav-temple"], "universal_origin_claimed": False}],
            "typical_practices": [{"practice_id": "bhairava-reading-discipline-service", "population_scope": "Supported home reflection or safe temple participation", "description": "An attributable Shiva/Bhairava reading, reflection on courage and discipline, and one act of responsible guardianship form the accessible lane." if en else "स्रोत-चिह्नित शिव/भैरव पाठ, साहस और अनुशासन पर चिंतन तथा जिम्मेदार संरक्षण का एक काम सरल मार्ग बनाते हैं।", "source_ids": ["kashi-official-shri-kaal-bhairav-temple", "devam-kalabhairava-safety-boundary"], "instructional": False}],
            "variants": [{"variant_id": "north-and-kashi-contexts", "scope": "North India Smarta and Kashi regional lanes", "difference": "Kashi's guardian-temple identity remains regional and is not copied into every household.", "source_ids": ["kashi-official-shri-kaal-bhairav-temple", "devam-kalabhairava-safety-boundary"], "separate_lane_required": True}, {"variant_id": "north-south-month-names", "scope": "Lunar-month naming", "difference": "North Margashirsha and South Kartika month names are preserved without declaring their practices identical.", "source_ids": ["drikpanchang-delhi-masika-kalashtami-2026"], "separate_lane_required": True}],
            "safety_and_boundaries": ["No fast, food, medicine, formal puja, mantra, tantra, oil, thread, offering, alcohol, meat, animal offering, harm, occult, exorcistic, or fear-based protection rite is supplied.", "No night vigil or unsafe travel is required.", "Use the responsible family, temple, or sampradaya authority for formal practice."],
        }
    if kind == "kojagara":
        return {
            "significance": {"text": "This bounded North/West India Smarta lane preserves Kojagara/Sharad Purnima as a night of source-attributable Lakshmi, Krishna-Raas, harvest, music, prayer, family, and community contexts." if en else "यह सीमित उत्तर/पश्चिम भारत स्मार्त मार्ग कोजागरा/शरद पूर्णिमा को लक्ष्मी, कृष्ण-रास, फसल, संगीत, प्रार्थना, परिवार और समुदाय के स्रोत-चिह्नित संदर्भों सहित सुरक्षित रखता है।", "source_ids": ["devam-kojagara-calendar-fixture", "nirnayasindhu-1865-ashvayuja-kojagari", "drikpanchang-delhi-kojagara-2026", "maharashtra-tourism-kojagiri-purnima-2026"], "scope_note": "Bengal Kojagari Lakshmi Puja and the next-day Ashwina Purnima calendar lane remain separate."},
            "origin_narratives": [{"narrative_id": "multiple-kojagara-tradition-contexts", "title": "Several attributable Kojagara contexts" if en else "कोजागरा के कई स्रोत-चिह्नित संदर्भ", "summary": "The retained sources preserve Lakshmi, Krishna-Raas, harvest, music, prayer, and community framings. They are related living contexts, not one universal origin story or theology." if en else "संचित स्रोत लक्ष्मी, कृष्ण-रास, फसल, संगीत, प्रार्थना और सामुदायिक रूप सुरक्षित रखते हैं। ये संबंधित जीवित संदर्भ हैं, एक सार्वभौमिक उत्पत्ति-कथा या दर्शन नहीं।", "tradition_scope": "North/West India source-labelled contexts", "source_ids": ["maharashtra-tourism-kojagiri-purnima-2026", "incredible-india-kojagiri-mahotsav-sagar-2026", "utsav-sharad-purnima-nadabet-2024"], "universal_origin_claimed": False}],
            "typical_practices": [{"practice_id": "family-prayer-music-moonlit-gathering", "population_scope": "Attributable North/West family and community contexts", "description": "Prayer, music, family or community gathering, and moonlit reflection are attributable practices; food is optional only where family-established and is never presented as medicine." if en else "प्रार्थना, संगीत, परिवार या समुदाय का मिलना और चाँदनी में चिंतन स्रोत-चिह्नित अभ्यास हैं; भोजन केवल परिवार में स्थापित हो तो वैकल्पिक है और औषधि नहीं।", "source_ids": ["maharashtra-tourism-kojagiri-purnima-2026", "incredible-india-kojagiri-mahotsav-sagar-2026", "utsav-sharad-purnima-nadabet-2024", "devam-kojagara-safety-boundary"], "instructional": False}],
            "variants": [{"variant_id": "north-west-contexts", "scope": "North and West India family/community forms", "difference": "Lakshmi, Krishna-Raas, harvest, music, and local gathering emphases remain source-labelled.", "source_ids": ["maharashtra-tourism-kojagiri-purnima-2026", "incredible-india-kojagiri-mahotsav-sagar-2026", "utsav-sharad-purnima-nadabet-2024"], "separate_lane_required": False}, {"variant_id": "bengal-kojagari-lakshmi-puja", "scope": "Bengal Shakta household and community practice", "difference": "Bengali Kojagari Lakshmi Puja requires its own evidence and procedure lane.", "source_ids": ["devam-kojagara-safety-boundary"], "separate_lane_required": True}, {"variant_id": "ashwina-purnima-calendar-day", "scope": "Next-day generic Ashwina Purnima", "difference": "The sunrise-based calendar day remains separate from the Nishita-selected Kojagara night.", "source_ids": ["devam-kojagara-calendar-fixture", "drikpanchang-delhi-kojagara-2026"], "separate_lane_required": True}],
            "safety_and_boundaries": ["No fast, food rule, health advice, formal Lakshmi Puja, arati, deepdaan, offering, moon worship, vigil, gambling, or promised outcome is supplied.", "Do not claim medicinal or curative benefit from moonlight or food.", "Use safe flame-free and food-safe options; family and regional practice controls formal observance."],
        }
    return {
        "significance": {"text": "This bounded North/West India Smarta lane supports Saptarishi remembrance, attributable study, gratitude to teachers, careful inquiry, and knowledge service while preserving multiple lists and interpretations." if en else "यह सीमित उत्तर/पश्चिम भारत स्मार्त मार्ग सप्तर्षि स्मरण, स्रोत-चिह्नित अध्ययन, गुरु-कृतज्ञता, सावधान जिज्ञासा और ज्ञान-सेवा का समर्थन करता है तथा अनेक सूचियों और व्याख्याओं को सुरक्षित रखता है।", "source_ids": ["devam-rishi-panchami-calendar-fixture", "nirnayasindhu-1865-rishi-panchami-decision", "drikpanchang-rishi-panchami-delhi-2026", "pib-rishi-panchami-sages-knowledge"], "scope_note": "Historical purity, menstruation, atonement, guilt, and guaranteed purification claims are not promoted."},
        "origin_narratives": [{"narrative_id": "multiple-saptarishi-lists", "title": "Several Saptarishi lists and source layers" if en else "सप्तर्षि की अनेक सूचियाँ और स्रोत-परतें", "summary": "The sources support remembrance of sages and knowledge traditions while requiring lists and interpretations to stay attributable; no single list is declared universal." if en else "स्रोत ऋषियों और ज्ञान-परम्पराओं के स्मरण का समर्थन करते हैं, पर सूचियों और व्याख्याओं को स्रोत-चिह्नित रखते हैं; कोई एक सूची सार्वभौमिक नहीं मानी जाती।", "tradition_scope": "Source-labelled Saptarishi and knowledge traditions", "source_ids": ["nirnayasindhu-1865-rishi-panchami-decision", "pib-rishi-panchami-sages-knowledge", "devam-rishi-panchami-safety-boundary"], "universal_origin_claimed": False}],
        "typical_practices": [{"practice_id": "study-teacher-gratitude-knowledge-service", "population_scope": "Supported North/West India learning and reflection lane", "description": "Attributable study, gratitude to teachers, one careful question, and a practical act of knowledge service form the accessible practice." if en else "स्रोत-चिह्नित अध्ययन, गुरु-कृतज्ञता, एक सावधान प्रश्न और ज्ञान-सेवा का व्यावहारिक कार्य सरल अभ्यास बनाते हैं।", "source_ids": ["pib-rishi-panchami-sages-knowledge", "devam-rishi-panchami-safety-boundary"], "instructional": False}],
        "variants": [{"variant_id": "multiple-saptarishi-lists", "scope": "Textual and sampradaya lists", "difference": "Names, lists, and interpretations remain attributable rather than silently harmonized.", "source_ids": ["nirnayasindhu-1865-rishi-panchami-decision", "devam-rishi-panchami-safety-boundary"], "separate_lane_required": True}, {"variant_id": "bhai-panchami", "scope": "Named Bhai Panchami context", "difference": "Bhai Panchami is not merged into this generic Saptarishi learning lane.", "source_ids": ["utsav-rishi-panchami-jaipur", "devam-rishi-panchami-safety-boundary"], "separate_lane_required": True}],
        "safety_and_boundaries": ["No fast, diet, bathing, ingestion, formal puja, mantra, offering, atonement, or promised outcome is supplied.", "Menstruation and no person are described as impure; rajaswala-dosha, guilt, or women-only participation is not promoted.", "Use a family, teacher, or sampradaya authority for established formal practice."],
    }


def build(kind: str) -> dict[str, Any]:
    spec = SPECS[kind]
    legacy = load_fixed(spec)
    pairs = legacy["scope"].get("supported_pairs") or [
        {"region_code": region, "tradition_code": tradition}
        for region, tradition in zip(spec["regions"], spec["traditions"], strict=True)
    ]
    localized = []
    for guide in legacy["guides"]:
        language = guide["language_code"]
        content = details(kind, language)
        localized.append({
            "language_code": language, "title": guide["title"], "short_answer": guide["summary"],
            "significance": content["significance"], "origin_narratives": content["origin_narratives"],
            "typical_practices": content["typical_practices"],
            "procedures": convert_procedures(guide, spec["lane"], {"minimum": "Self-guided reflection", "standard": "Individual or household reflection", "elaborate": "Established family-, teacher-, community-, or temple-led participation"}, [spec["safety"]], [spec["safety"]]),
            "variants": content["variants"], "safety_and_boundaries": content["safety_and_boundaries"],
        })
    pack = {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1", "lane_id": spec["lane"],
        "supersedes_legacy_pack_ids": [legacy["pack_id"]], "observance_slugs": [spec["slug"]],
        "applicability": {
            "region_codes": spec["regions"], "tradition_codes": spec["traditions"], "context_pairs": pairs,
            "settings": ["individual", "household", "family_led", "temple"],
            "family_practice_overrides_generic_guidance": True,
            "material_context_questions": legacy["guides"][0]["context_prompts"],
            "observance_context_notes": [
                {"observance_slug": spec["slug"], "language_code": guide["language_code"], "note": guide["family_practice_note"]}
                for guide in legacy["guides"]
            ],
        },
        "calendar": {"resolution_source_ids": spec["calendar"], "timing_kind": "textual_rule", "location_aware": True, "tradition_aware": True, "decision_rule_id": spec["decision"], "closing_decision_rule_id": None, "live_schedule_required": True, "freshness_note": "Resolve the named observance for the user's location and tradition. Family, temple, teacher, or sampradaya authority controls formal practice and close."},
        "sources": convert_sources(legacy, spec["input"]), "localized_content": localized, "product_status": status(),
    }
    assert_source_references(pack)
    return pack


def render(pack: dict[str, Any]) -> bytes:
    return (json.dumps(pack, ensure_ascii=False, indent=2, sort_keys=True) + "\n").encode("utf-8")


def main() -> None:
    paths = [PACK_DIR / spec["output"] for spec in SPECS.values()]
    if any(path.exists() for path in paths):
        raise FileExistsError("Refusing to overwrite a current-contract output")
    results = []
    for kind, spec in SPECS.items():
        payload = render(build(kind))
        path = PACK_DIR / spec["output"]
        path.write_bytes(payload)
        results.append({"path": str(path.relative_to(ROOT)), "bytes": len(payload), "sha256": hashlib.sha256(payload).hexdigest()})
    print(json.dumps(results, ensure_ascii=False))


if __name__ == "__main__":
    main()

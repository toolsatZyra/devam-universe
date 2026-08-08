#!/usr/bin/env python3
"""Build the shared-contract West India Ganesh Chaturthi household lane."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "knowledge_packs" / "rituals" / "ganesh-chaturthi-west-india-v1.json"
OUTPUT = ROOT / "knowledge_packs" / "rituals" / "ganesh-chaturthi-west-india-content-v1.json"
SOURCE_SHA256 = "2c90bfba1e8eda5539186c96baca7027db3af7dd6ce6a293b3c86a9e7e47fa34"


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def verified_refs(source_ids: list[str]) -> list[str]:
    result: list[str] = []
    for source_id in source_ids:
        replacements = (
            ["maharashtra-tourism-ganesh-chaturthi-2026", "siddhivinayak-trust-pooja-details-2026"]
            if source_id == "sanatan-sanstha-ganesh-pujavidhi-2026"
            else [source_id]
        )
        for replacement in replacements:
            if replacement not in result:
                result.append(replacement)
    return result


def material_refs(tier: str) -> list[str]:
    if tier == "elaborate":
        return ["siddhivinayak-trust-pooja-details-2026", "maharashtra-tourism-ganesh-chaturthi-2026"]
    return ["maharashtra-tourism-ganesh-chaturthi-2026", "siddhivinayak-trust-pooja-details-2026"]


def convert_procedures(guide: dict) -> list[dict]:
    language = guide["language_code"]
    settings = {"minimum": "individual", "standard": "household", "elaborate": "teacher_led"}
    forms = {"minimum": "accessible_short", "standard": "traditional_household", "elaborate": "fuller_family_or_teacher_led"}
    authority = {
        "en": {
            "minimum": "West India Smarta household or individual; familiar family practice takes priority",
            "standard": "West India Smarta household practice, keeping permanent and temporary images separate",
            "elaborate": "Family-text or competent practitioner-led form; Devam does not generate priestly liturgy",
        },
        "hi": {
            "minimum": "पश्चिम भारत का स्मार्त गृह या व्यक्ति; परिचित पारिवारिक परम्परा को प्राथमिकता है",
            "standard": "पश्चिम भारत की स्मार्त गृह-परम्परा, जिसमें स्थायी और अस्थायी विग्रह अलग रखे जाते हैं",
            "elaborate": "पारिवारिक ग्रन्थ या सक्षम जानकार द्वारा निर्देशित रूप; देवम् पुरोहित-विधान नहीं गढ़ता",
        },
    }
    closing = {
        "en": "Close with the prayer or arati your family knows, share the offered food appropriately, and extinguish every flame before it is unattended.",
        "hi": "परिवार की परिचित प्रार्थना या आरती से समापन करें, नैवेद्य उचित रूप से बाँटें और हर लौ को बिना निगरानी छोड़ने से पहले बुझा दें।",
    }
    converted: list[dict] = []
    for tier in guide["tiers"]:
        step_refs = sorted({source_id for step in tier["steps"] for source_id in verified_refs(step["source_ids"])})
        converted.append(
            {
                "procedure_id": f"ganesh-chaturthi-west-india-{language}-{tier['tier']}-v1",
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
                        "source_ids": material_refs(tier["tier"]),
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
                    "source_ids": ["maharashtra-tourism-ganesh-chaturthi-2026"],
                    "scope_note": "The exact closing follows established family practice." if language == "en" else "समापन का ठीक रूप स्थापित पारिवारिक परम्परा के अनुसार होगा।",
                },
                "source_ids": step_refs,
            }
        )
    return converted


def localized_content(guide: dict) -> dict:
    language = guide["language_code"]
    if language == "en":
        significance = {
            "text": "Ganesh Chaturthi marks Ganesha's festival and birth-day identity in current Maharashtra practice. The Ganapatyatharvashirsha source separately addresses Ganapati as the directly perceptible principle and the creator, sustainer and dissolver; that theological voice is one identified text, not every Ganesha tradition.",
            "source_ids": ["maharashtra-tourism-ganesh-chaturthi-2026", "ganapatyatharvashirsha-wikisource-415703"],
            "scope_note": "This combines one current Maharashtra festival account with one exact product-usable Sanskrit transcription; neither alone is a universal explanation.",
        }
        narratives = [
            {
                "narrative_id": "maharashtra-birth-day-festival-account",
                "title": "The festival as Ganesha's birth day",
                "summary": "The Maharashtra Tourism account identifies the Chaturthi observance as marking Ganesha's birth and connects it with beginnings, wisdom and the removal of obstacles. It reports the current popular festival meaning rather than establishing one complete Puranic birth narrative.",
                "tradition_scope": "Current Maharashtra public-festival account",
                "source_ids": ["maharashtra-tourism-ganesh-chaturthi-2026"],
                "universal_origin_claimed": False,
            },
            {
                "narrative_id": "tilak-public-ganeshotsav-account",
                "title": "From household worship to public Ganeshotsav",
                "summary": "The same official account says Lokmanya Tilak transformed Ganesh Chaturthi into a large public celebration in 1893 to build unity during the independence movement. This is a history of the modern public form, not the origin of Ganesha worship itself.",
                "tradition_scope": "Modern Maharashtra public-festival history",
                "source_ids": ["maharashtra-tourism-ganesh-chaturthi-2026"],
                "universal_origin_claimed": False,
            },
        ]
        practices = [
            {
                "practice_id": "maharashtra-home-and-community-ganeshotsav",
                "population_scope": "Maharashtra homes and community pandals represented by the official current source",
                "description": "Images are placed in homes and community pandals; prayers and aratis continue during the chosen stay, with vegetarian naivedya such as modak shared in family and community settings.",
                "source_ids": ["maharashtra-tourism-ganesh-chaturthi-2026"],
                "instructional": False,
            },
            {
                "practice_id": "temple-expanded-service-boundary",
                "population_scope": "Shree Siddhivinayak temple service context",
                "description": "The temple distinguishes Atharvashirsha recitation, Panchamrut, Shodashopchar and other expanded services. Their presence shows why a compact household guide must not impersonate a complete priest-led liturgy.",
                "source_ids": ["siddhivinayak-trust-pooja-details-2026"],
                "instructional": False,
            },
        ]
        variants = [
            {"variant_id": "permanent-versus-temporary-image", "scope": "Image and ritual lifecycle", "difference": "A permanent home image is not newly installed or immersed; a temporary festival murti brings a chosen stay, daily care, uttarpuja and locally responsible visarjan.", "source_ids": ["maharashtra-tourism-ganesh-chaturthi-2026"], "separate_lane_required": False},
            {"variant_id": "family-chosen-duration", "scope": "Festival duration", "difference": "One-and-a-half-day, five-, seven-, eleven-day and other established family durations are not one mandatory national sequence.", "source_ids": ["maharashtra-tourism-ganesh-chaturthi-2026"], "separate_lane_required": False},
            {"variant_id": "household-versus-temple-or-pandal", "scope": "Authority and setting", "difference": "Household, temple and public-pandal forms have different leaders, inventories and operational rules; use the responsible authority for the setting.", "source_ids": ["maharashtra-tourism-ganesh-chaturthi-2026", "siddhivinayak-trust-pooja-details-2026"], "separate_lane_required": True},
        ]
        safety = [
            "Do not pour liquids on painted, electrical, fragile or unsuitable images.",
            "Use open flame or incense only with ventilation, supervision and a safe exit path; flame-free practice is valid.",
            "Never immerse a permanent home image. Follow local authority and environmental rules for any temporary-murti visarjan.",
            "Devam does not create unfamiliar initiation-bound mantras, homa instruction, priestly liturgy or a guaranteed outcome.",
            "Family and sampradaya practice overrides this generic household lane when known.",
        ]
    else:
        significance = {
            "text": "वर्तमान महाराष्ट्र परम्परा में गणेश चतुर्थी गणेशोत्सव और गणेश-जन्म की पहचान रखती है। गणपत्यथर्वशीर्ष का अलग स्रोत गणपति को प्रत्यक्ष तत्त्व और कर्ता-धर्ता-हर्ता कहकर सम्बोधित करता है; यह एक पहचाने हुए ग्रन्थ की वाणी है, हर गणेश-परम्परा की सार्वभौम व्याख्या नहीं।",
            "source_ids": ["maharashtra-tourism-ganesh-chaturthi-2026", "ganapatyatharvashirsha-wikisource-415703"],
            "scope_note": "यह एक वर्तमान महाराष्ट्र उत्सव-विवरण और एक सटीक, उत्पाद-उपयोगी संस्कृत प्रतिलेखन को अलग-अलग पहचानता है; कोई भी अकेला सार्वभौम विवरण नहीं है।",
        }
        narratives = [
            {
                "narrative_id": "maharashtra-birth-day-festival-account",
                "title": "गणेश-जन्म के दिन के रूप में उत्सव",
                "summary": "महाराष्ट्र पर्यटन का विवरण चतुर्थी को गणेश-जन्म से जोड़ता है और नयी शुरुआत, बुद्धि तथा विघ्न-निवारण के वर्तमान लोकप्रिय अर्थ बताता है। यह एक सम्पूर्ण पौराणिक जन्म-कथा निर्धारित नहीं करता।",
                "tradition_scope": "वर्तमान महाराष्ट्र सार्वजनिक-उत्सव विवरण",
                "source_ids": ["maharashtra-tourism-ganesh-chaturthi-2026"],
                "universal_origin_claimed": False,
            },
            {
                "narrative_id": "tilak-public-ganeshotsav-account",
                "title": "गृह-पूजा से सार्वजनिक गणेशोत्सव",
                "summary": "वही आधिकारिक विवरण कहता है कि लोकमान्य तिलक ने 1893 में स्वतंत्रता आन्दोलन के समय एकता के लिए गणेश चतुर्थी को बड़े सार्वजनिक उत्सव का रूप दिया। यह आधुनिक सार्वजनिक रूप का इतिहास है, गणेश-उपासना की उत्पत्ति नहीं।",
                "tradition_scope": "आधुनिक महाराष्ट्र सार्वजनिक-उत्सव इतिहास",
                "source_ids": ["maharashtra-tourism-ganesh-chaturthi-2026"],
                "universal_origin_claimed": False,
            },
        ]
        practices = [
            {
                "practice_id": "maharashtra-home-and-community-ganeshotsav",
                "population_scope": "आधिकारिक वर्तमान स्रोत में वर्णित महाराष्ट्र के घर और सार्वजनिक पण्डाल",
                "description": "घर और पण्डाल में गणेश-विग्रह रखे जाते हैं; चुनी गयी अवधि में प्रार्थना और आरती होती है तथा मोदक जैसे शाकाहारी नैवेद्य परिवार और समुदाय में बाँटे जाते हैं।",
                "source_ids": ["maharashtra-tourism-ganesh-chaturthi-2026"],
                "instructional": False,
            },
            {
                "practice_id": "temple-expanded-service-boundary",
                "population_scope": "श्री सिद्धिविनायक मन्दिर की सेवा-परम्परा",
                "description": "मन्दिर अथर्वशीर्ष-पाठ, पंचामृत, षोडशोपचार और अन्य विस्तृत सेवाओं को अलग रखता है। इसलिए संक्षिप्त गृह-मार्गदर्शिका सम्पूर्ण पुरोहित-विधान का रूप नहीं ले सकती।",
                "source_ids": ["siddhivinayak-trust-pooja-details-2026"],
                "instructional": False,
            },
        ]
        variants = [
            {"variant_id": "permanent-versus-temporary-image", "scope": "विग्रह और अनुष्ठान-चक्र", "difference": "स्थायी गृह-विग्रह की नयी स्थापना या विसर्जन नहीं होता; अस्थायी उत्सव-विग्रह में चुनी अवधि, दैनिक सेवा, उत्तरपूजा और स्थानीय नियमों के अनुसार विसर्जन जुड़ते हैं।", "source_ids": ["maharashtra-tourism-ganesh-chaturthi-2026"], "separate_lane_required": False},
            {"variant_id": "family-chosen-duration", "scope": "उत्सव की अवधि", "difference": "डेढ़, पाँच, सात, ग्यारह दिन और अन्य स्थापित पारिवारिक अवधियाँ एक अनिवार्य राष्ट्रीय क्रम नहीं हैं।", "source_ids": ["maharashtra-tourism-ganesh-chaturthi-2026"], "separate_lane_required": False},
            {"variant_id": "household-versus-temple-or-pandal", "scope": "अधिकार और स्थान", "difference": "गृह, मन्दिर और सार्वजनिक पण्डाल के नेता, सामग्री और संचालन-नियम अलग होते हैं; उसी स्थान के जिम्मेदार अधिकारी का पालन करें।", "source_ids": ["maharashtra-tourism-ganesh-chaturthi-2026", "siddhivinayak-trust-pooja-details-2026"], "separate_lane_required": True},
        ]
        safety = [
            "रँगे हुए, बिजली वाले, नाजुक या अनुपयुक्त विग्रह पर द्रव न डालें।",
            "दीप या धूप केवल हवा, निगरानी और सुरक्षित निकास के साथ रखें; अग्नि-रहित साधना मान्य है।",
            "स्थायी गृह-विग्रह का विसर्जन कभी न करें। अस्थायी विग्रह के लिए स्थानीय और पर्यावरणीय नियम मानें।",
            "देवम् अपरिचित दीक्षा-मन्त्र, होम-विधान, पुरोहित-विधान या निश्चित फल नहीं गढ़ता।",
            "ज्ञात पारिवारिक और सम्प्रदायिक परम्परा इस सामान्य गृह-मार्गदर्शिका से ऊपर है।",
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
        "safety_and_boundaries": safety,
    }


def build() -> dict:
    source_bytes = SOURCE.read_bytes()
    if sha256(source_bytes) != SOURCE_SHA256:
        raise RuntimeError("legacy Ganesh Chaturthi pack drift")
    legacy = json.loads(source_bytes.decode("utf-8"))
    if legacy.get("contract") != "DEVAM_RITUAL_PROCEDURE_PACK_V1" or legacy.get("pack_id") != "devam-ganesh-chaturthi-west-india-practice-v1":
        raise RuntimeError("legacy Ganesh Chaturthi identity drift")
    sources = [
        {
            "source_id": "maharashtra-tourism-ganesh-chaturthi-2026",
            "title": "Ganesh Chaturthi",
            "publisher": "Directorate of Tourism, Government of Maharashtra",
            "source_role": "Current Maharashtra birth-day identity, home and community practice, duration, Tilak public-festival history, naivedya, clay and environmental context",
            "rights_lane": "citation_only",
            "url": "https://maharashtratourism.gov.in/festivals/ganesh-chaturthi/",
            "artifact_sha256": None,
            "citation_coordinates": None,
            "observed_fetch": {"status": 200, "final_url": "https://maharashtratourism.gov.in/festivals/ganesh-chaturthi/", "response_bytes": 626642, "response_sha256": "5a962b870d9506479cca7e1c87cb5a44499596d53c624a2af1bdfbb1cec1a287", "strict_utf8": True, "observed_at": "2026-08-07"},
        },
        {
            "source_id": "siddhivinayak-trust-pooja-details-2026",
            "title": "Pooja Details",
            "publisher": "Shree Siddhivinayak Ganapati Mandir Trust",
            "source_role": "Official temple evidence for distinct Atharvashirsha, Panchamrut, Shodashopchar and expanded service levels; not a universal household liturgy",
            "rights_lane": "citation_only",
            "url": "https://www.siddhivinayak.org/pooja-details-2/",
            "artifact_sha256": None,
            "citation_coordinates": None,
            "observed_fetch": {"status": 200, "final_url": "https://www.siddhivinayak.org/pooja-details-2/", "response_bytes": 73936, "response_sha256": "a26a2c5e9cc0bcd9646b670be75b9a021c5c9e3acda8f473b820f52c56ecd75b", "strict_utf8": True, "observed_at": "2026-08-07"},
        },
        {
            "source_id": "nirnayasindhu-marathi-1865-pages-50-51",
            "title": "Nirnayasindhu — Marathi translation, Mumbai 1865",
            "publisher": "Ganapati Krishnaji's Press; retained by Devam",
            "source_role": "Historical Ganesh-vrata and Bhadrapada Shukla Chaturthi timing context; not promoted as a complete modern household procedure",
            "rights_lane": "internal_only",
            "url": "https://archive.org/details/in.ernet.dli.2015.365977",
            "artifact_sha256": "a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b",
            "citation_coordinates": {"pdf_pages": [50, 51], "ingestion_plan": "ingestion/plans/nirnayasindhu-marathi-1865-v1.json"},
            "observed_fetch": None,
        },
        {
            "source_id": "ganapatyatharvashirsha-wikisource-415703",
            "title": "Ganapatyatharvashirsha, Sanskrit Wikisource revision 415703",
            "publisher": "Sanskrit Wikisource contributors",
            "source_role": "Exact product-usable Sanskrit transcription and source-aligned significance statements; underlying print edition and recension remain unidentified",
            "rights_lane": "derivative_allowed",
            "url": "https://sa.wikisource.org/wiki/गणपत्यथर्वशीर्षम्",
            "artifact_sha256": "43d5f6ca8a2ee7d7a62480a85cdbd526cee04b816db46ac7c3fd8d90757a5178",
            "citation_coordinates": {"revision_id": 415703, "source_ordinals": [1, 9, 10], "knowledge_pack": "knowledge_packs/ganesha/ganapatyatharvashirsha-wikisource-v1.json"},
            "observed_fetch": None,
        },
        {
            "source_id": "devam-ganesha-hymn-pack-v1",
            "title": "Shriganapatimantraksharavali exact-source knowledge pack",
            "publisher": "Devam, from an Ambuda CC0 source object",
            "source_role": "Optional four-step Sanskrit devotional reading with exact source ordinals; not a complete Ganesh Puja liturgy",
            "rights_lane": "derivative_allowed",
            "url": None,
            "artifact_sha256": "21e5909392249ecca6677410c30d70323402d886975df807df2b865697fd9e6d",
            "citation_coordinates": {"pack_id": "ganesha-shriganapatimantraksharavali-v1"},
            "observed_fetch": None,
        },
    ]
    return {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1",
        "lane_id": "ganesh-chaturthi-west-india-content-v1",
        "supersedes_legacy_pack_ids": ["devam-ganesh-chaturthi-west-india-practice-v1"],
        "observance_slugs": ["ganesh-chaturthi"],
        "applicability": {
            "region_codes": ["west-india"],
            "tradition_codes": ["smarta-west-india"],
            "institution_codes": [],
            "settings": ["household", "individual", "family_led"],
            "family_practice_overrides_generic_guidance": True,
            "material_context_questions": legacy["guides"][0]["context_prompts"],
        },
        "calendar": {
            "resolution_source_ids": ["nirnayasindhu-marathi-1865-pages-50-51", "maharashtra-tourism-ganesh-chaturthi-2026"],
            "timing_kind": "mixed",
            "location_aware": True,
            "tradition_aware": True,
            "decision_rule_id": "nirnayasindhu-1865-bhadrapada-shukla-chaturthi-madhyahna-v1",
            "live_schedule_required": False,
            "freshness_note": "The bounded 2026 West India lane resolves Monday, 14 September. Use Devam's location-aware madhyahna decision window; family installation, daily care and visarjan duration remain household choices.",
        },
        "sources": sources,
        "localized_content": [localized_content(guide) for guide in legacy["guides"]],
        "product_status": {
            "classification": "user_complete_lane",
            "completed_dimensions": {key: True for key in ("applicability", "timing", "significance", "origin_narratives", "typical_practice", "actionable_vidhi", "materials_and_substitutions", "variants", "evidence")},
            "open_gaps": [],
            "review_status": "internal_beta_reviewed",
        },
    }


def main() -> int:
    payload = (json.dumps(build(), ensure_ascii=False, indent=2, sort_keys=True) + "\n").encode("utf-8")
    OUTPUT.write_bytes(payload)
    print(json.dumps({"path": OUTPUT.relative_to(ROOT).as_posix(), "bytes": len(payload), "sha256": sha256(payload)}, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

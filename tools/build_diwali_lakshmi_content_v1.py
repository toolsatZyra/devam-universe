#!/usr/bin/env python3
"""Build the V1 user-complete Lakshmi Puja household lane from the reviewed legacy guide."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "knowledge_packs" / "rituals" / "diwali-lakshmi-puja-west-india-v1.json"
OUTPUT = ROOT / "knowledge_packs" / "rituals" / "diwali-lakshmi-puja-west-india-content-v1.json"
SOURCE_SHA256 = "c73343da9b873400ed7bcc307b30aedb7de751c38c6e672ac41f98de05b389c1"


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def material_sources(item: str) -> list[str]:
    lowered = item.lower()
    if any(word in lowered for word in ("lamp", "light", "rangoli", "decoration", "दीप", "रंगोली", "सजावट")):
        return ["maharashtra-tourism-diwali-2026"]
    if any(word in lowered for word in ("account", "livelihood", "study", "बही", "व्यापार", "अध्ययन")):
        return ["drikpanchang-diwali-puja-vidhi-2026", "maharashtra-tourism-diwali-2026"]
    return ["drikpanchang-diwali-puja-vidhi-2026", "maharashtra-tourism-diwali-2026"]


def convert_procedures(guide: dict) -> list[dict]:
    converted = []
    settings = {"minimum": "individual", "standard": "household", "elaborate": "family_led"}
    forms = {"minimum": "accessible_short", "standard": "traditional_household", "elaborate": "fuller_family_or_teacher_led"}
    authority = {
        "en": {
            "minimum": "West India Smarta household or individual using a familiar family focus; not a formal consecration",
            "standard": "West India Smarta family household practice with family custom taking priority",
            "elaborate": "Family-text or practitioner-led West India household practice; the app does not supply the formal liturgy",
        },
        "hi": {
            "minimum": "पश्चिम भारत का स्मार्त गृह या व्यक्ति, अपने परिचित पारिवारिक रूप में; यह औपचारिक प्रतिष्ठा नहीं है",
            "standard": "पश्चिम भारत की स्मार्त पारिवारिक गृह-परम्परा, जिसमें परिवार की विधि को प्राथमिकता है",
            "elaborate": "पारिवारिक ग्रन्थ या जानकार द्वारा निर्देशित पश्चिम भारतीय गृह-परम्परा; ऐप औपचारिक विधान नहीं देता",
        },
    }
    closing = {
        "en": "Close with the prayer or arati your family knows, share the offered food appropriately, and extinguish every flame before it is unattended.",
        "hi": "परिवार की परिचित प्रार्थना या आरती से समापन करें, नैवेद्य उचित रूप से बाँटें और हर लौ को बिना निगरानी छोड़ने से पहले बुझा दें।",
    }
    language = guide["language_code"]
    for tier in guide["tiers"]:
        source_ids = sorted({"maharashtra-tourism-diwali-2026" if source == "maharashtra-gazetteer-diwali-household" else source for step in tier["steps"] for source in step["source_ids"]})
        converted.append(
            {
                "procedure_id": f"diwali-lakshmi-puja-west-india-{language}-{tier['tier']}-v1",
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
                        "source_ids": material_sources(material["item"]),
                    }
                    for material in tier["materials"]
                ],
                "steps": [
                    {
                        "ordinal": step["ordinal"],
                        "instruction": step["instruction"],
                        "why": step["why"],
                        "source_ids": list(dict.fromkeys("maharashtra-tourism-diwali-2026" if source == "maharashtra-gazetteer-diwali-household" else source for source in step["source_ids"])),
                        "optional": step["optional"],
                    }
                    for step in tier["steps"]
                ],
                "closing": {
                    "text": closing[language],
                    "source_ids": ["maharashtra-tourism-diwali-2026"],
                    "scope_note": "Family practice controls the exact closing form." if language == "en" else "समापन का ठीक रूप पारिवारिक परम्परा के अनुसार होगा।",
                },
                "source_ids": source_ids,
            }
        )
    return converted


def localized_content(guide: dict) -> dict:
    language = guide["language_code"]
    if language == "en":
        significance = {
            "text": "In this West India Smarta household lane, Diwali Lakshmi Puja brings together light, welcome, gratitude, household wellbeing, ethical prosperity, family sharing and generosity. The represented Maharashtra source places Lakshmi Pujan on the main festival day and describes both Lakshmi and Ganesha worship, while the historical Maharashtra account preserves an evening household setting.",
            "source_ids": ["maharashtra-tourism-diwali-2026"],
            "scope_note": "This is one West India household interpretation, not the meaning or procedure of every Diwali tradition.",
        }
        narratives = [
            {
                "narrative_id": "vishnu-purana-lakshmi-ocean-emergence",
                "title": "Lakshmi emerges from the ocean of milk",
                "summary": "In Book I, Chapter IX of H. H. Wilson's 1864 English translation of the Vishnu Purana, the gods and anti-gods churn the ocean of milk and Sri rises radiant from its waves before taking her place with Vishnu. The source presents this as one account of Lakshmi's manifestation; it is not, by itself, a complete origin story for Diwali or a household ritual manual.",
                "tradition_scope": "Vishnu Purana narrative in the Wilson 1864 English translation",
                "source_ids": ["vishnu-purana-wilson-1864-book-1-chapter-9"],
                "universal_origin_claimed": False,
            },
            {
                "narrative_id": "maharashtra-diwali-lakshmi-day",
                "title": "Lakshmi Pujan in the Maharashtra Diwali sequence",
                "summary": "The current Maharashtra Tourism account presents Lakshmi Pujan as the principal festival day dedicated to Lakshmi, associated with lamps, household worship, prosperity, family and social bonds. This is current regional context rather than proof that every Indian Diwali follows the same sequence.",
                "tradition_scope": "Current Maharashtra public-festival account",
                "source_ids": ["maharashtra-tourism-diwali-2026"],
                "universal_origin_claimed": False,
            },
        ]
        practices = [
            {
                "practice_id": "west-india-household-lakshmi-pujan",
                "population_scope": "West India Smarta households represented by the current and historical Maharashtra sources",
                "description": "Households clean and illuminate the home, gather for Lakshmi or Lakshmi-Ganesha worship in the evening, make familiar offerings and prayers, share sweets or food, and may include livelihood or account-book traditions where established.",
                "source_ids": ["maharashtra-tourism-diwali-2026", "drikpanchang-diwali-puja-vidhi-2026"],
                "instructional": False,
            },
            {
                "practice_id": "expanded-formal-puja-is-contextual",
                "population_scope": "Households following a detailed family text or practitioner",
                "description": "Expanded forms may include Ganesha, Lakshmi, Kubera, a kalasha, account books, tools of livelihood, additional offerings and formal recitation. These elements are contextual and should not be imposed as one national checklist.",
                "source_ids": ["drikpanchang-diwali-puja-vidhi-2026", "maharashtra-tourism-diwali-2026"],
                "instructional": False,
            },
        ]
        variants = [
            {"variant_id": "lakshmi-alone-or-lakshmi-ganesha", "scope": "Household deity focus", "difference": "Some homes centre Lakshmi while others worship Lakshmi with Ganesha; follow the form already established in the household.", "source_ids": ["maharashtra-tourism-diwali-2026", "drikpanchang-diwali-puja-vidhi-2026"], "separate_lane_required": False},
            {"variant_id": "chopda-bahi-khata-or-livelihood-tools", "scope": "Business and livelihood custom", "difference": "Account-book, Chopda, Bahi-Khata, coins or livelihood-tool worship belongs to particular family and business traditions and is optional in this household lane.", "source_ids": ["drikpanchang-diwali-puja-vidhi-2026", "maharashtra-tourism-diwali-2026"], "separate_lane_required": False},
            {"variant_id": "coincident-diwali-traditions", "scope": "Regional and religious identity", "difference": "Bengal Kali Puja, Tamil or South Indian Deepavali, Jain Diwali, Bandi Chhor Divas and Nepal Tihar remain separate traditions even when dates coincide.", "source_ids": ["maharashtra-tourism-diwali-2026"], "separate_lane_required": True},
        ]
        boundaries = [
            "No purchase, new image, fast, food restriction, firework, unattended flame, financial advice or promised wealth outcome is required.",
            "The date and local pradosha decision window do not substitute for a family-specific formal muhurta.",
            "Formal mantra, consecration, shodashopachara and priest-led liturgy remain with the family's text, teacher or practitioner.",
            "Family, sampradaya and accessibility needs override the generic sequence.",
        ]
    else:
        significance = {
            "text": "पश्चिम भारत की इस स्मार्त गृह-परम्परा में दीपावली लक्ष्मी-पूजन प्रकाश, स्वागत, कृतज्ञता, गृह-कल्याण, धर्मसम्मत समृद्धि, परिवार के साथ बाँटने और उदारता को जोड़ता है। महाराष्ट्र का वर्तमान स्रोत मुख्य पर्व-दिन पर लक्ष्मी-पूजन तथा लक्ष्मी-गणेश उपासना का वर्णन करता है, जबकि ऐतिहासिक महाराष्ट्र स्रोत सायंकालीन गृह-सन्दर्भ को सुरक्षित रखता है।",
            "source_ids": ["maharashtra-tourism-diwali-2026"],
            "scope_note": "यह पश्चिम भारत की एक गृह-व्याख्या है; हर दीपावली परम्परा का एकमात्र अर्थ या विधान नहीं।",
        }
        narratives = [
            {
                "narrative_id": "vishnu-purana-lakshmi-ocean-emergence",
                "title": "क्षीर-सागर से लक्ष्मी का प्राकट्य",
                "summary": "एच. एच. विल्सन के 1864 के अंग्रेज़ी विष्णु पुराण अनुवाद के प्रथम अंश, अध्याय 9 में देव और दैत्य क्षीर-सागर का मन्थन करते हैं और श्री उसकी लहरों से प्रकट होकर विष्णु के साथ विराजती हैं। यह लक्ष्मी के प्राकट्य की एक ग्रन्थ-सम्बद्ध कथा है; अपने-आप में दीपावली की सम्पूर्ण उत्पत्ति-कथा या गृह-विधि नहीं।",
                "tradition_scope": "विल्सन 1864 अंग्रेज़ी अनुवाद में विष्णु पुराण की कथा",
                "source_ids": ["vishnu-purana-wilson-1864-book-1-chapter-9"],
                "universal_origin_claimed": False,
            },
            {
                "narrative_id": "maharashtra-diwali-lakshmi-day",
                "title": "महाराष्ट्र के दीपावली-क्रम में लक्ष्मी-पूजन",
                "summary": "महाराष्ट्र पर्यटन का वर्तमान विवरण लक्ष्मी-पूजन को देवी लक्ष्मी को समर्पित मुख्य पर्व-दिन बताता है और इसे दीप, गृह-पूजा, समृद्धि, परिवार तथा सामाजिक सम्बन्धों से जोड़ता है। यह वर्तमान क्षेत्रीय सन्दर्भ है, पूरे भारत की एक समान दीपावली-विधि का प्रमाण नहीं।",
                "tradition_scope": "महाराष्ट्र का वर्तमान सार्वजनिक पर्व-विवरण",
                "source_ids": ["maharashtra-tourism-diwali-2026"],
                "universal_origin_claimed": False,
            },
        ]
        practices = [
            {
                "practice_id": "west-india-household-lakshmi-pujan",
                "population_scope": "वर्तमान और ऐतिहासिक महाराष्ट्र स्रोतों में वर्णित पश्चिम भारतीय स्मार्त गृह",
                "description": "परिवार घर को स्वच्छ और प्रकाशित करते हैं, सायंकाल लक्ष्मी या लक्ष्मी-गणेश की परिचित गृह-पूजा के लिए एकत्र होते हैं, अर्पण और प्रार्थना करते हैं, मिठाई या भोजन बाँटते हैं और जहाँ प्रचलित हो वहाँ आजीविका या बही-खाता परम्परा जोड़ते हैं।",
                "source_ids": ["maharashtra-tourism-diwali-2026", "drikpanchang-diwali-puja-vidhi-2026"],
                "instructional": False,
            },
            {
                "practice_id": "expanded-formal-puja-is-contextual",
                "population_scope": "विस्तृत पारिवारिक ग्रन्थ या जानकार का अनुसरण करने वाले गृह",
                "description": "विस्तृत रूप में गणेश, लक्ष्मी, कुबेर, कलश, बही-खाते, आजीविका के साधन, अधिक अर्पण और औपचारिक पाठ हो सकते हैं। ये सन्दर्भानुसार हैं और एक राष्ट्रीय सूची के रूप में नहीं थोपे जाने चाहिए।",
                "source_ids": ["drikpanchang-diwali-puja-vidhi-2026", "maharashtra-tourism-diwali-2026"],
                "instructional": False,
            },
        ]
        variants = [
            {"variant_id": "lakshmi-alone-or-lakshmi-ganesha", "scope": "गृह का देवता-केन्द्र", "difference": "कुछ घरों में लक्ष्मी और कुछ में लक्ष्मी-गणेश केन्द्र में होते हैं; घर में पहले से स्थापित रूप का पालन करें।", "source_ids": ["maharashtra-tourism-diwali-2026", "drikpanchang-diwali-puja-vidhi-2026"], "separate_lane_required": False},
            {"variant_id": "chopda-bahi-khata-or-livelihood-tools", "scope": "व्यापार और आजीविका की परम्परा", "difference": "बही-खाता, चोपड़ा, सिक्के या आजीविका-साधन की पूजा विशेष परिवार और व्यापार परम्पराओं की है; इस गृह-विधि में वैकल्पिक है।", "source_ids": ["drikpanchang-diwali-puja-vidhi-2026", "maharashtra-tourism-diwali-2026"], "separate_lane_required": False},
            {"variant_id": "coincident-diwali-traditions", "scope": "क्षेत्रीय और धार्मिक पहचान", "difference": "बंगाल की काली पूजा, तमिल या दक्षिण भारतीय दीपावली, जैन दीपावली, बन्दी छोड़ दिवस और नेपाल तिहार तिथि मिलने पर भी अलग परम्पराएँ हैं।", "source_ids": ["maharashtra-tourism-diwali-2026"], "separate_lane_required": True},
        ]
        boundaries = [
            "कोई खरीद, नई मूर्ति, उपवास, आहार-प्रतिबन्ध, पटाखा, बिना निगरानी की लौ, वित्तीय सलाह या निश्चित धन-फल आवश्यक नहीं है।",
            "तिथि और स्थानीय प्रदोष-निर्णय-अवधि परिवार के विशिष्ट औपचारिक मुहूर्त का विकल्प नहीं है।",
            "औपचारिक मन्त्र, प्रतिष्ठा, षोडशोपचार और पुरोहित-विधान परिवार के ग्रन्थ, गुरु या जानकार के अधीन हैं।",
            "परिवार, सम्प्रदाय और सुगम्यता की आवश्यकता सामान्य क्रम से ऊपर है।",
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
        "safety_and_boundaries": boundaries,
    }


def build() -> dict:
    source_bytes = SOURCE.read_bytes()
    if sha256(source_bytes) != SOURCE_SHA256:
        raise RuntimeError("Reviewed legacy Lakshmi Puja guide drifted")
    legacy = json.loads(source_bytes.decode("utf-8"))
    if legacy["contract"] != "DEVAM_RITUAL_PROCEDURE_PACK_V1" or legacy["pack_id"] != "devam-diwali-lakshmi-puja-west-india-v1":
        raise RuntimeError("Legacy Lakshmi Puja identity drifted")
    sources = []
    for source in legacy["sources"]:
        if source["source_id"] == "maharashtra-gazetteer-diwali-household":
            continue
        converted = {
            "source_id": source["source_id"],
            "title": source["title"],
            "publisher": source["publisher"],
            "source_role": "; ".join(source["supports"]),
            "rights_lane": "internal_only" if source["rights_lane"] == "private_evidence" else "citation_only",
            "url": source["url"],
            "artifact_sha256": source.get("citation", {}).get("pdf_sha256"),
            "citation_coordinates": source.get("citation"),
        }
        if source["source_id"] == "maharashtra-tourism-diwali-2026":
            converted["observed_fetch"] = {"status": 200, "final_url": source["url"], "response_bytes": 627481, "response_sha256": "bcbbfee5a28b41b62e737ac75b14254c5dbb86f16ce48180eb19829144f1f479", "strict_utf8": True, "observed_at": "2026-08-07"}
        if source["source_id"] == "drikpanchang-diwali-puja-vidhi-2026":
            converted["observed_fetch"] = {"status": 200, "final_url": source["url"], "response_bytes": 73555, "response_sha256": "6942aa54edf978abef57f7369917552ed9a9300f0ca7d08b638eefaa0a3a99ee", "strict_utf8": True, "observed_at": "2026-08-07"}
        sources.append(converted)
    sources.append(
        {
            "source_id": "vishnu-purana-wilson-1864-book-1-chapter-9",
            "title": "The Vishnu Purana, Volume I, translated by H. H. Wilson, 1864",
            "publisher": "Trübner & Co.; Internet Archive access copy",
            "source_role": "source-labelled Book I Chapter IX account of Sri-Lakshmi emerging from the ocean of milk; not a universal Diwali-origin or ritual authority",
            "rights_lane": "citation_only",
            "url": "https://archive.org/details/TheVishnuPuranaVolI",
            "artifact_sha256": None,
            "citation_coordinates": {"book": 1, "chapter": 9, "printed_pages": [144, 145, 150, 151], "access_text_sha256": "0fc8adb4ecd572e49e012650fec14a147707755ed1c1f10b4b59e4351958e5bf"},
            "observed_fetch": {"status": 200, "final_url": "https://archive.org/metadata/TheVishnuPuranaVolI", "response_bytes": 162645, "response_sha256": "3f2092de8e1d97ba8cd676a352ea8fbc88354f511c61fc864570542af7b93592", "strict_utf8": True, "observed_at": "2026-08-07"},
        }
    )
    dimensions = {key: True for key in ("applicability", "timing", "significance", "origin_narratives", "typical_practice", "actionable_vidhi", "materials_and_substitutions", "variants", "evidence")}
    return {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1",
        "lane_id": "diwali-lakshmi-puja-west-india-content-v1",
        "supersedes_legacy_pack_ids": ["devam-diwali-lakshmi-puja-west-india-v1"],
        "observance_slugs": ["diwali-lakshmi-puja"],
        "applicability": {
            "region_codes": ["west-india"],
            "tradition_codes": ["smarta-west-india"],
            "institution_codes": [],
            "settings": ["household", "individual", "family_led"],
            "family_practice_overrides_generic_guidance": True,
            "material_context_questions": legacy["guides"][0]["context_prompts"],
        },
        "calendar": {
            "resolution_source_ids": ["devam-nirnayasindhu-diwali-rule", "drikpanchang-diwali-puja-vidhi-2026"],
            "timing_kind": "mixed",
            "location_aware": True,
            "tradition_aware": True,
            "decision_rule_id": "nirnayasindhu-1865-kartika-amavasya-pradosha-v1",
            "live_schedule_required": False,
            "freshness_note": "For 2026 the bounded West India lane resolves Sunday, 8 November. Use the location-aware pradosha decision window shown by Devam; a formal family muhurta remains a separate local-calendar or practitioner decision.",
        },
        "sources": sources,
        "localized_content": [localized_content(guide) for guide in legacy["guides"]],
        "product_status": {"classification": "user_complete_lane", "completed_dimensions": dimensions, "open_gaps": [], "review_status": "internal_beta_reviewed"},
    }


def main() -> None:
    payload = (json.dumps(build(), ensure_ascii=False, indent=2) + "\n").encode("utf-8")
    OUTPUT.write_bytes(payload)
    print(json.dumps({"path": OUTPUT.relative_to(ROOT).as_posix(), "bytes": len(payload), "sha256": sha256(payload)}, sort_keys=True))


if __name__ == "__main__":
    main()

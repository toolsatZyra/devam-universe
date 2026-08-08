#!/usr/bin/env python3
"""Build three distinct current-contract post-Diwali observance lanes."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any, Callable

from build_early_diwali_content_batch_v1 import convert_procedures, load, source, status


ROOT = Path(__file__).resolve().parents[1]
PACK_DIR = ROOT / "knowledge_packs" / "rituals"


def fetch(final_url: str, response_bytes: int, response_sha256: str) -> dict[str, Any]:
    return {
        "status": 200,
        "final_url": final_url,
        "response_bytes": response_bytes,
        "response_sha256": response_sha256,
        "strict_utf8": True,
        "observed_at": "2026-08-07",
    }


MH_TOURISM_FETCH = fetch(
    "https://maharashtratourism.gov.in/festivals/diwali/",
    627481,
    "41feab01d441e23fed6a2febdb7b6fc407144c545702b2d4f55e6af3a3c20b2a",
)
ISKCON_GOVARDHANA_FETCH = fetch(
    "https://www.iskconbangalore.org/govardhana-puja/",
    114978,
    "a749341bf47bb0219b4f846afe10b6b05d953b5939e12b8b246298fc3b85322a",
)
BAPS_ANNAKUT_FETCH = fetch(
    "https://www.baps.org/cultureandheritage/Traditions/AnnualCelebrationsandFestivals/NutanVarsh/NewYearAnnakut.aspx",
    101585,
    "68bd60c45bdd9ae53073cbce5e2dae56687bcf2123263e80322e3c975804e069",
)
INCREDIBLE_INDIA_BHAI_DOOJ_FETCH = fetch(
    "https://www.incredibleindia.gov.in/en/festivals-and-events/bhai-dooj",
    477821,
    "d0ae202731bf2e98580a9fe9a302894d39dfb4ad3873ace5538639d85578d98a",
)
NEWS_ON_AIR_BHAI_DOOJ_FETCH = fetch(
    "https://newsonair.gov.in/bulletins-detail/morning-news-532/",
    93552,
    "fb6eb8498b8ca103989a4ea1bbf73195d4e3ee85362e54a60a487cdfb5cb8cc7",
)


def localized_content(
    legacy: dict[str, Any],
    lane_id: str,
    authority: dict[str, str],
    material_sources: list[str],
    closing_sources: list[str],
    details: Callable[[str], dict[str, Any]],
    *,
    procedure_adjuster: Callable[[list[dict[str, Any]]], None] | None = None,
    source_map: dict[str, str] | None = None,
) -> list[dict[str, Any]]:
    result = []
    for guide in legacy["guides"]:
        language = guide["language_code"]
        content = details(language)
        procedures = convert_procedures(
            guide,
            lane_id,
            authority,
            material_sources,
            closing_sources,
            source_map,
        )
        if procedure_adjuster:
            procedure_adjuster(procedures)
        result.append(
            {
                "language_code": language,
                "title": guide["title"],
                "short_answer": guide["summary"],
                "significance": content["significance"],
                "origin_narratives": content["origin_narratives"],
                "typical_practices": content["typical_practices"],
                "procedures": procedures,
                "variants": content["variants"],
                "safety_and_boundaries": content["safety_and_boundaries"],
            }
        )
    return result


def assert_source_references(pack: dict[str, Any]) -> None:
    source_ids = {item["source_id"] for item in pack["sources"]}
    if len(source_ids) != len(pack["sources"]):
        raise ValueError(f"duplicate source id in {pack['lane_id']}")
    referenced = set(pack["calendar"]["resolution_source_ids"])
    for localized in pack["localized_content"]:
        referenced.update(localized["significance"]["source_ids"])
        for key in ("origin_narratives", "typical_practices", "variants"):
            for value in localized[key]:
                referenced.update(value["source_ids"])
        for procedure in localized["procedures"]:
            referenced.update(procedure["source_ids"])
            referenced.update(procedure["closing"]["source_ids"])
            for material in procedure["materials"]:
                referenced.update(material["source_ids"])
            for step in procedure["steps"]:
                referenced.update(step["source_ids"])
    missing = referenced - source_ids
    if missing:
        raise ValueError(f"unknown source ids in {pack['lane_id']}: {sorted(missing)}")


def bali_details(language: str) -> dict[str, Any]:
    english = language == "en"
    return {
        "significance": {
            "text": (
                "In this bounded Maharashtra lane, Bali Pratipada or Diwali Padwa honours King Bali and centres joyful, intentional family time. It does not prescribe one universal Bali theology, spouse rite, business rite, gift, or offering."
                if english
                else "इस सीमित महाराष्ट्र परम्परा में बलि प्रतिपदा या दिवाली पाडवा राजा बलि के सम्मान और परिवार के साथ प्रसन्न, सार्थक समय का अवसर है। यह राजा बलि की एक ही सार्वभौमिक धर्मकथा, दाम्पत्य-विधि, व्यापार-विधि, उपहार या अर्पण को अनिवार्य नहीं बनाती।"
            ),
            "source_ids": ["maharashtra-tourism-diwali-balipratipada"],
            "scope_note": (
                "The official Maharashtra page establishes the regional identity and family focus, not a complete liturgy."
                if english
                else "महाराष्ट्र का आधिकारिक पृष्ठ क्षेत्रीय पहचान और पारिवारिक केन्द्र बताता है, पूर्ण पूजा-विधान नहीं।"
            ),
        },
        "origin_narratives": [
            {
                "narrative_id": "maharashtra-king-bali-remembrance",
                "title": "King Bali in Maharashtra's Diwali sequence" if english else "महाराष्ट्र की दिवाली-परम्परा में राजा बलि",
                "summary": (
                    "Maharashtra Tourism names the fourth day Balipratipada/Padwa and says it honours King Bali. Devam preserves that attributable remembrance without supplying an unsupported Vamana-Bali episode or treating one theological interpretation as universal."
                    if english
                    else "महाराष्ट्र पर्यटन चौथे दिन को बलिप्रतिपदा/पाडवा कहता है और इसे राजा बलि के सम्मान से जोड़ता है। देवम इस स्रोत-सम्बद्ध स्मरण को सुरक्षित रखता है, पर अप्रमाणित वामन-बलि प्रसंग नहीं गढ़ता और किसी एक धार्मिक व्याख्या को सार्वभौमिक नहीं कहता।"
                ),
                "tradition_scope": "Current Maharashtra official festival account" if english else "वर्तमान महाराष्ट्र आधिकारिक पर्व-विवरण",
                "source_ids": ["maharashtra-tourism-diwali-balipratipada"],
                "universal_origin_claimed": False,
            }
        ],
        "typical_practices": [
            {
                "practice_id": "maharashtra-bali-padwa-family-remembrance",
                "population_scope": "Maharashtra families that keep Bali Pratipada/Padwa" if english else "बलि प्रतिपदा/पाडवा मानने वाले महाराष्ट्र परिवार",
                "description": (
                    "The supported modern core is King Bali remembrance and joyful family time. A household may add its established prayer, story, meal, greeting, light, spouse custom, gift, or business custom, but those elements remain descriptive and family-specific."
                    if english
                    else "समर्थित आधुनिक केन्द्र राजा बलि का स्मरण और परिवार के साथ प्रसन्न समय है। घर अपनी स्थापित प्रार्थना, कथा, भोजन, शुभकामना, प्रकाश, दाम्पत्य-रीति, उपहार या व्यापार-रीति जोड़ सकता है, पर ये तत्व वर्णनात्मक और परिवार-विशिष्ट रहते हैं।"
                ),
                "source_ids": ["maharashtra-tourism-diwali-balipratipada", "devam-bali-pratipada-safety-and-boundary"],
                "instructional": False,
            }
        ],
        "variants": [
            {
                "variant_id": "maharashtra-family-form-varies",
                "scope": "Maharashtra family practice" if english else "महाराष्ट्र पारिवारिक रीति",
                "difference": (
                    "Names, stories, prayers, spouse or elder roles, meals, gifts, lights, and business customs vary by family; the app's minimum path does not replace them."
                    if english
                    else "नाम, कथा, प्रार्थना, दाम्पत्य या बुज़ुर्ग की भूमिका, भोजन, उपहार, प्रकाश और व्यापार-रीति परिवार के अनुसार बदलते हैं; ऐप का सरल मार्ग उनका स्थान नहीं लेता।"
                ),
                "source_ids": ["maharashtra-tourism-diwali-balipratipada", "devam-bali-pratipada-safety-and-boundary"],
                "separate_lane_required": False,
            },
            {
                "variant_id": "coincident-pratipada-traditions-remain-separate",
                "scope": "Adjacent Diwali traditions" if english else "निकटवर्ती दिवाली परम्पराएँ",
                "difference": (
                    "Govardhana/Annakut, BAPS or other Gujarati New Year, and South Indian Balipadyami require their own sources and procedures and are not completed here."
                    if english
                    else "गोवर्धन/अन्नकूट, BAPS या अन्य गुजराती नववर्ष और दक्षिण भारतीय बलिपाड्यमी के अपने स्रोत और विधियाँ चाहिए; वे इस मार्ग से पूर्ण नहीं होते।"
                ),
                "source_ids": ["devam-bali-pratipada-safety-and-boundary"],
                "separate_lane_required": True,
            },
        ],
        "safety_and_boundaries": [
            "Use only a prayer, story, symbol, food, spouse custom, or family role already recognised by the household; the app does not invent formal liturgy." if english else "केवल वही प्रार्थना, कथा, प्रतीक, भोजन, दाम्पत्य-रीति या भूमिका लें जिसे परिवार पहले से मानता है; ऐप औपचारिक विधि नहीं गढ़ता।",
            "No real flame, touch, travel, gift, spending, fasting, food, or gendered role is required." if english else "वास्तविक लौ, स्पर्श, यात्रा, उपहार, खर्च, उपवास, भोजन या लैंगिक भूमिका अनिवार्य नहीं है।",
            "No prosperity, marital, spiritual, or material outcome is guaranteed." if english else "समृद्धि, दाम्पत्य, आध्यात्मिक या भौतिक फल की कोई गारंटी नहीं है।",
            "Govardhana/Annakut, Gujarati New Year, and Balipadyami remain separate lanes." if english else "गोवर्धन/अन्नकूट, गुजराती नववर्ष और बलिपाड्यमी अलग मार्ग हैं।",
        ],
    }


def bali_pratipada() -> dict[str, Any]:
    legacy = load("bali-pratipada-maharashtra-family-v1.json")
    lane_id = "bali-pratipada-maharashtra-content-v1"
    pack = {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1",
        "lane_id": lane_id,
        "supersedes_legacy_pack_ids": [legacy["pack_id"]],
        "observance_slugs": [legacy["observance_slug"]],
        "applicability": {
            "region_codes": ["west-india"],
            "tradition_codes": ["smarta-west-india"],
            "context_pairs": [{"region_code": "west-india", "tradition_code": "smarta-west-india"}],
            "settings": ["household", "individual", "family_led"],
            "family_practice_overrides_generic_guidance": True,
            "material_context_questions": legacy["guides"][0]["context_prompts"],
        },
        "calendar": {
            "resolution_source_ids": ["devam-bali-pratipada-date-fixture", "maharashtra-tourism-diwali-balipratipada"],
            "timing_kind": "mixed",
            "location_aware": True,
            "tradition_aware": True,
            "decision_rule_id": "devam-maharashtra-bali-pratipada-pratipada-sunrise-v1",
            "live_schedule_required": False,
            "freshness_note": "The bounded Mumbai 2026 lane resolves Tuesday, 10 November. Family prayer, spouse, business, meal, gift, and close remain household-specific.",
        },
        "sources": [
            source("devam-bali-pratipada-date-fixture", "Devam Bali Pratipada Mumbai 2026 date evidence fixture", "Devam", "Deterministic Mumbai date decision; not ritual authority", "derivative_allowed", artifact_sha256="c53a49bc816473be9f3d4ba1b942cdfe23658b67ca5cc1548fa347ed66360480", citation_coordinates={"path": "knowledge_packs/panchang/bali-pratipada-mumbai-2026-v1.json"}),
            source("maharashtra-tourism-diwali-balipratipada", "Diwali — Balipratipada/Padwa", "Department of Tourism, Government of Maharashtra", "Official Maharashtra identity, King Bali remembrance, and family focus; not a complete household procedure", "citation_only", url="https://maharashtratourism.gov.in/festivals/diwali/", observed_fetch=MH_TOURISM_FETCH),
            source("devam-bali-pratipada-safety-and-boundary", "Devam Bali Pratipada family, flame, spending, gender, and cross-tradition boundary", "Devam", "Editorial safety and scope boundary; not scripture, history, or ritual authority", "internal_only"),
        ],
        "localized_content": localized_content(
            legacy,
            lane_id,
            {"minimum": "Short Maharashtra King Bali remembrance", "standard": "Maharashtra family-led Padwa form", "elaborate": "Established elder-, family-, temple-, or sampradaya-led Maharashtra form"},
            ["maharashtra-tourism-diwali-balipratipada", "devam-bali-pratipada-safety-and-boundary"],
            ["devam-bali-pratipada-safety-and-boundary"],
            bali_details,
        ),
        "product_status": status(),
    }
    assert_source_references(pack)
    return pack


def govardhana_details(language: str) -> dict[str, Any]:
    english = language == "en"
    return {
        "significance": {
            "text": (
                "In this exact ISKCON Bangalore lane, Govardhana Puja remembers Krishna lifting Govardhana Hill and centres gratitude, devotional singing, a suitable vegetarian offering, and temple or family participation."
                if english
                else "इस ठीक ISKCON बेंगलुरु परम्परा में गोवर्धन पूजा श्रीकृष्ण द्वारा गोवर्धन पर्वत उठाने का स्मरण है और कृतज्ञता, भक्ति-गान, उपयुक्त शाकाहारी अर्पण तथा मंदिर या पारिवारिक सहभागिता पर केन्द्रित है।"
            ),
            "source_ids": ["iskcon-bangalore-govardhana-puja"],
            "scope_note": (
                "This is participation guidance for one living Vaishnava institution, not a universal Govardhana or Annakut procedure."
                if english
                else "यह एक जीवित वैष्णव संस्था की सहभागिता-धारा है, सार्वभौमिक गोवर्धन या अन्नकूट-विधि नहीं।"
            ),
        },
        "origin_narratives": [
            {
                "narrative_id": "iskcon-krishna-lifts-govardhana",
                "title": "Krishna lifts Govardhana" if english else "श्रीकृष्ण गोवर्धन उठाते हैं",
                "summary": (
                    "ISKCON Bangalore recounts Krishna asking Vraja to honour Govardhana and the cows, Indra sending destructive rain, and Krishna sheltering the community beneath the lifted hill. Devam preserves this as ISKCON's published festival account, not verified history or the only Vaishnava interpretation."
                    if english
                    else "ISKCON बेंगलुरु का पर्व-विवरण बताता है कि श्रीकृष्ण ने व्रजवासियों से गोवर्धन और गौओं का सम्मान करने को कहा, इन्द्र ने विनाशकारी वर्षा भेजी और श्रीकृष्ण ने उठाए हुए पर्वत के नीचे समुदाय को आश्रय दिया। देवम इसे ISKCON का प्रकाशित पर्व-वर्णन मानता है, सत्यापित इतिहास या एकमात्र वैष्णव व्याख्या नहीं।"
                ),
                "tradition_scope": "ISKCON Bangalore published festival account" if english else "ISKCON बेंगलुरु का प्रकाशित पर्व-वर्णन",
                "source_ids": ["iskcon-bangalore-govardhana-puja"],
                "universal_origin_claimed": False,
            }
        ],
        "typical_practices": [
            {
                "practice_id": "iskcon-govardhana-annakuta-participation",
                "population_scope": "ISKCON Bangalore devotees and visitors" if english else "ISKCON बेंगलुरु के भक्त और आगंतुक",
                "description": (
                    "The official page identifies Govardhana Puja, go-puja, Annakuta, a hill-shaped food offering, kirtan or festival worship, and prasadam distribution. Institutional handling, schedules, cow contact, offerings, and liturgy remain under the temple."
                    if english
                    else "आधिकारिक पृष्ठ गोवर्धन पूजा, गो-पूजा, अन्नकूट, पर्वताकार खाद्य-अर्पण, कीर्तन या उत्सव-उपासना और प्रसाद-वितरण का उल्लेख करता है। संस्थागत व्यवस्था, समय, गौ-संपर्क, अर्पण और विधि मंदिर के अधिकार में रहते हैं।"
                ),
                "source_ids": ["iskcon-bangalore-govardhana-puja", "devam-govardhana-safety-boundary"],
                "instructional": False,
            }
        ],
        "variants": [
            {
                "variant_id": "home-and-iskcon-temple-participation",
                "scope": "Participation setting" if english else "सहभागिता का स्थान",
                "difference": (
                    "A home remembrance with a simple suitable vegetarian offering and an ISKCON temple programme have different authorities, materials, schedules, and participant roles."
                    if english
                    else "घर का सरल स्मरण और उपयुक्त शाकाहारी अर्पण तथा ISKCON मंदिर का कार्यक्रम अलग अधिकार, सामग्री, समय और सहभागी भूमिकाएँ रखते हैं।"
                ),
                "source_ids": ["iskcon-bangalore-govardhana-puja", "devam-govardhana-safety-boundary"],
                "separate_lane_required": False,
            },
            {
                "variant_id": "baps-annakut-remains-separate",
                "scope": "Distinct sampradaya Annakut" if english else "अलग सम्प्रदाय का अन्नकूट",
                "difference": (
                    "BAPS places Annakut within its Nutan Varsh observance with its own mandir practices; that comparative context is not imported into this ISKCON lane."
                    if english
                    else "BAPS अन्नकूट को अपने नूतन वर्ष पर्व में अपनी मंदिर-परम्पराओं के साथ रखता है; उस तुलनात्मक संदर्भ को इस ISKCON मार्ग में नहीं मिलाया जाता।"
                ),
                "source_ids": ["baps-annakut-comparative-context"],
                "separate_lane_required": True,
            },
            {
                "variant_id": "other-vaishnava-and-regional-forms-open",
                "scope": "Other Vaishnava and regional traditions" if english else "अन्य वैष्णव और क्षेत्रीय परम्पराएँ",
                "difference": (
                    "Other Govardhana, Annakut, Gopuja, Bali Pratipada, and regional practices need their own evidence and are not completed here."
                    if english
                    else "अन्य गोवर्धन, अन्नकूट, गो-पूजा, बलि प्रतिपदा और क्षेत्रीय परम्पराओं के अपने प्रमाण चाहिए; वे यहाँ पूर्ण नहीं होते।"
                ),
                "source_ids": ["devam-govardhana-safety-boundary"],
                "separate_lane_required": True,
            },
        ],
        "safety_and_boundaries": [
            "Do not touch, feed, wash, restrain, decorate, or approach a cow except under the animal owner's or trained keeper's direction." if english else "गाय को केवल मालिक या प्रशिक्षित देखभालकर्ता के निर्देश में ही छुएँ, खिलाएँ, धोएँ, बाँधें, सजाएँ या पास जाएँ।",
            "Use only vegetarian food suitable to the household and institution; do not copy a large Annakut or distribute food without responsible handling." if english else "केवल घर और संस्था के लिए उपयुक्त शाकाहारी भोजन लें; बड़े अन्नकूट की नकल या जिम्मेदार व्यवस्था के बिना भोजन-वितरण न करें।",
            "No formal mantra, fast, barefoot or long parikrama, real flame, large offering, donation, or promised outcome is required." if english else "औपचारिक मंत्र, उपवास, नंगे पाँव या लम्बी परिक्रमा, वास्तविक लौ, बड़ा अर्पण, दान या फल-गारंटी अनिवार्य नहीं है।",
            "Bali Pratipada, BAPS New Year Annakut, and other traditions remain separate." if english else "बलि प्रतिपदा, BAPS नववर्ष अन्नकूट और अन्य परम्पराएँ अलग रहती हैं।",
        ],
    }


def adjust_govardhana_procedures(procedures: list[dict[str, Any]]) -> None:
    for procedure in procedures:
        if procedure["tier"] == "elaborate":
            procedure["setting"] = "temple_participation"
            procedure["form"] = "institutional_participation"


def govardhana_puja() -> dict[str, Any]:
    legacy = load("govardhana-puja-iskcon-participation-v1.json")
    lane_id = "govardhana-puja-iskcon-content-v1"
    pack = {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1",
        "lane_id": lane_id,
        "supersedes_legacy_pack_ids": [legacy["pack_id"]],
        "observance_slugs": [legacy["observance_slug"]],
        "applicability": {
            "region_codes": ["iskcon-india"],
            "tradition_codes": ["vaishnava-iskcon"],
            "institution_codes": ["iskcon-bangalore"],
            "context_pairs": [{"region_code": "iskcon-india", "tradition_code": "vaishnava-iskcon"}],
            "settings": ["household", "temple", "community", "individual", "family_led"],
            "family_practice_overrides_generic_guidance": True,
            "material_context_questions": legacy["guides"][0]["context_prompts"],
        },
        "calendar": {
            "resolution_source_ids": ["devam-govardhana-date-fixture", "iskcon-bangalore-govardhana-puja"],
            "timing_kind": "mixed",
            "location_aware": True,
            "tradition_aware": True,
            "decision_rule_id": "devam-iskcon-bangalore-govardhana-puja-pratipada-v1",
            "live_schedule_required": True,
            "freshness_note": "The bounded ISKCON Bangalore 2026 lane resolves Tuesday, 10 November. Recheck the temple for live programme, access, offering, prasadam, and participation instructions.",
        },
        "sources": [
            source("devam-govardhana-date-fixture", "Devam Govardhana Puja ISKCON 2026 date evidence fixture", "Devam", "Deterministic ISKCON Bangalore date crosswalk; not ritual authority", "derivative_allowed", artifact_sha256="dc150f253eb67a2c7caccba62e20b6c4a3a70cc91e8e48150e1a7d753274ab82", citation_coordinates={"path": "knowledge_packs/panchang/govardhana-puja-iskcon-2026-v1.json"}),
            source("iskcon-bangalore-govardhana-puja", "Govardhana Puja — 10 Nov 2026", "ISKCON Bangalore", "Official living-tradition identity, story, date, and participation context; temple controls live programme and formal practice", "citation_only", url="https://www.iskconbangalore.org/govardhana-puja/", observed_fetch=ISKCON_GOVARDHANA_FETCH),
            source("baps-annakut-comparative-context", "Nutan Varsh / New Year Annakut", "BAPS Swaminarayan Sanstha", "Official distinct-sampradaya comparative Annakut context; not merged into the ISKCON lane", "citation_only", url="https://www.baps.org/cultureandheritage/Traditions/AnnualCelebrationsandFestivals/NutanVarsh/NewYearAnnakut.aspx", observed_fetch=BAPS_ANNAKUT_FETCH),
            source("devam-govardhana-safety-boundary", "Devam Govardhana participation, food, animal, and safety boundary", "Devam", "Editorial safety and authority boundary; not scripture or ritual authority", "internal_only"),
        ],
        "localized_content": localized_content(
            legacy,
            lane_id,
            {"minimum": "Short ISKCON-aligned household remembrance", "standard": "Family-led ISKCON-aligned household participation", "elaborate": "ISKCON temple-led participation only"},
            ["iskcon-bangalore-govardhana-puja", "devam-govardhana-safety-boundary"],
            ["iskcon-bangalore-govardhana-puja", "devam-govardhana-safety-boundary"],
            govardhana_details,
            procedure_adjuster=adjust_govardhana_procedures,
        ),
        "product_status": status(),
    }
    assert_source_references(pack)
    return pack


def bhai_dooj_details(language: str) -> dict[str, Any]:
    english = language == "en"
    return {
        "significance": {
            "text": (
                "In this bounded North India household lane, Bhai Dooj celebrates the sibling bond through welcome, a familiar tika or spoken blessing, prayer for wellbeing, shared food when suitable, gratitude, and reciprocal support."
                if english
                else "इस सीमित उत्तर भारत गृह-परम्परा में भाई दूज स्वागत, परिचित टीका या मौखिक आशीर्वाद, कुशलता की प्रार्थना, उपयुक्त हो तो साझा भोजन, कृतज्ञता और परस्पर सहयोग से भाई-बहन के बन्धन का उत्सव है।"
            ),
            "source_ids": ["incredible-india-bhai-dooj", "newsonair-bhai-dooj-regional-names"],
            "scope_note": (
                "Consent, skin and food safety, real family circumstances, and regional practice override a generic sequence."
                if english
                else "सहमति, त्वचा और भोजन-सुरक्षा, वास्तविक पारिवारिक परिस्थिति और क्षेत्रीय रीति सामान्य क्रम से ऊपर हैं।"
            ),
        },
        "origin_narratives": [
            {
                "narrative_id": "yama-yamuna-bhai-dooj-account",
                "title": "Yama visits Yamuna" if english else "यम का यमुना से मिलना",
                "summary": (
                    "Incredible India presents an account in which Yama visits his sister Yamuna, receives her welcome and tika, and grants a blessing associated with the day. Devam keeps this as one official festival retelling, not verified history or a guaranteed result."
                    if english
                    else "इन्क्रेडिबल इंडिया एक कथा बताता है जिसमें यम अपनी बहन यमुना से मिलने आते हैं, उनका स्वागत और टीका स्वीकार करते हैं और दिन से जुड़ा आशीर्वाद देते हैं। देवम इसे एक आधिकारिक पर्व-कथा मानता है, सत्यापित इतिहास या सुनिश्चित फल नहीं।"
                ),
                "tradition_scope": "Incredible India festival retelling" if english else "इन्क्रेडिबल इंडिया का पर्व-पुनर्कथन",
                "source_ids": ["incredible-india-bhai-dooj"],
                "universal_origin_claimed": False,
            },
            {
                "narrative_id": "krishna-subhadra-bhai-dooj-account",
                "title": "Krishna and Subhadra" if english else "श्रीकृष्ण और सुभद्रा",
                "summary": (
                    "The same official page also gives a Krishna-Subhadra account connected with welcome, tika, sweets, and affection after Krishna's return. It is preserved alongside, rather than replacing, the Yama-Yamuna account."
                    if english
                    else "उसी आधिकारिक पृष्ठ पर श्रीकृष्ण की वापसी पर सुभद्रा के स्वागत, टीका, मिठाई और स्नेह से जुड़ी दूसरी कथा भी है। इसे यम-यमुना कथा के स्थान पर नहीं, उसके साथ सुरक्षित रखा गया है।"
                ),
                "tradition_scope": "Incredible India alternative festival retelling" if english else "इन्क्रेडिबल इंडिया का वैकल्पिक पर्व-पुनर्कथन",
                "source_ids": ["incredible-india-bhai-dooj"],
                "universal_origin_claimed": False,
            },
        ],
        "typical_practices": [
            {
                "practice_id": "north-india-bhai-dooj-household-core",
                "population_scope": "North India families represented by the two current official sources" if english else "दो वर्तमान आधिकारिक स्रोतों में दर्शाए उत्तर भारत परिवार",
                "description": (
                    "The common published core is a sibling meeting or connection, sister-led tika and prayer in the conventional form, and affectionate hospitality such as sweets or a meal. Gifts, ingredients, roles, and exact order vary and are not compulsory."
                    if english
                    else "प्रकाशित सामान्य केन्द्र भाई-बहन का मिलना या सम्पर्क, प्रचलित रूप में बहन द्वारा टीका और प्रार्थना तथा मिठाई या भोजन जैसे स्नेहपूर्ण आतिथ्य हैं। उपहार, सामग्री, भूमिकाएँ और ठीक क्रम बदलते हैं और अनिवार्य नहीं हैं।"
                ),
                "source_ids": ["incredible-india-bhai-dooj", "newsonair-bhai-dooj-regional-names", "devam-bhai-dooj-safety-and-inclusion-boundary"],
                "instructional": False,
            }
        ],
        "variants": [
            {
                "variant_id": "north-india-family-form-varies",
                "scope": "Household roles and materials" if english else "घरेलू भूमिकाएँ और सामग्री",
                "difference": (
                    "Who hosts, who applies tika, the ingredients, prayer, flame, meal, gift, travel, and close follow consent and family practice."
                    if english
                    else "मेज़बानी, टीका लगाने वाला, सामग्री, प्रार्थना, लौ, भोजन, उपहार, यात्रा और समापन सहमति और पारिवारिक रीति के अनुसार होते हैं।"
                ),
                "source_ids": ["incredible-india-bhai-dooj", "devam-bhai-dooj-safety-and-inclusion-boundary"],
                "separate_lane_required": False,
            },
            {
                "variant_id": "regional-sibling-festivals-remain-separate",
                "scope": "Bhau Beej, Bhai Phota, Bhai Tika, and Yama Dwitiya" if english else "भाऊ बीज, भाई फोटा, भाई टीका और यम द्वितीया",
                "difference": (
                    "The broadcaster confirms these regional names, but their procedures and meanings require separate regional evidence and are not completed by this North India lane."
                    if english
                    else "प्रसारक इन क्षेत्रीय नामों की पुष्टि करता है, पर उनकी विधि और अर्थ के लिए अलग क्षेत्रीय प्रमाण चाहिए; वे इस उत्तर भारत मार्ग से पूर्ण नहीं होते।"
                ),
                "source_ids": ["newsonair-bhai-dooj-regional-names"],
                "separate_lane_required": True,
            },
        ],
        "safety_and_boundaries": [
            "Ask before touch or tika; use a familiar skin-safe material or a spoken or symbolic blessing instead." if english else "स्पर्श या टीका से पहले सहमति लें; परिचित त्वचा-सुरक्षित सामग्री या मौखिक अथवा प्रतीकात्मक आशीर्वाद लें।",
            "Use a continuously supervised flame or a flame-free light; respect allergies, dietary needs, distance, grief, estrangement, and chosen family." if english else "निरन्तर देखरेख वाली लौ या बिना लौ का प्रकाश लें; एलर्जी, आहार, दूरी, शोक, अलगाव और चुने हुए परिवार का सम्मान करें।",
            "No travel, reconciliation, gift, spending, fast, fixed recipe, gendered protection promise, or guaranteed longevity is required." if english else "यात्रा, मेल-मिलाप, उपहार, खर्च, उपवास, निश्चित टीका-विधि, लैंगिक सुरक्षा-वचन या दीर्घायु की गारंटी अनिवार्य नहीं है।",
            "Bhau Beej, Bhai Phota, Bhai Tika, and Bihar Yama Dwitiya remain separate regional lanes." if english else "भाऊ बीज, भाई फोटा, भाई टीका और बिहार यम द्वितीया अलग क्षेत्रीय मार्ग हैं।",
        ],
    }


def bhai_dooj() -> dict[str, Any]:
    legacy = load("bhai-dooj-north-india-household-v1.json")
    lane_id = "bhai-dooj-north-india-content-v1"
    pack = {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1",
        "lane_id": lane_id,
        "supersedes_legacy_pack_ids": [legacy["pack_id"]],
        "observance_slugs": [legacy["observance_slug"]],
        "applicability": {
            "region_codes": ["north-india"],
            "tradition_codes": ["smarta-north-india"],
            "context_pairs": [{"region_code": "north-india", "tradition_code": "smarta-north-india"}],
            "settings": ["household", "individual", "family_led"],
            "family_practice_overrides_generic_guidance": True,
            "material_context_questions": legacy["guides"][0]["context_prompts"],
        },
        "calendar": {
            "resolution_source_ids": ["devam-bhai-dooj-date-fixture", "newsonair-bhai-dooj-regional-names"],
            "timing_kind": "mixed",
            "location_aware": True,
            "tradition_aware": True,
            "decision_rule_id": "devam-north-india-bhai-dooj-dvitiya-aparahna-v1",
            "live_schedule_required": False,
            "freshness_note": "The bounded Delhi/North India 2026 lane resolves Wednesday, 11 November. Regional names, roles, materials, and exact family timing remain separate or family-specific.",
        },
        "sources": [
            source("devam-bhai-dooj-date-fixture", "Devam Bhai Dooj Delhi 2026 date evidence fixture", "Devam", "Deterministic Delhi date decision; not ritual authority", "derivative_allowed", artifact_sha256="b6156e6532521a91db78c9c049de91d5ac07f8cfdafe960d54d7112a8fe609d6", citation_coordinates={"path": "knowledge_packs/panchang/bhai-dooj-delhi-2026-v1.json"}),
            source("incredible-india-bhai-dooj", "Bhai Dooj: A timeless tradition celebrating sibling love", "Incredible India, Ministry of Tourism", "Official identity, two source-labelled stories, and household-practice core; not a complete regional liturgy", "citation_only", url="https://www.incredibleindia.gov.in/en/festivals-and-events/bhai-dooj", observed_fetch=INCREDIBLE_INDIA_BHAI_DOOJ_FETCH),
            source("newsonair-bhai-dooj-regional-names", "Morning News — Bhai Dooj regional names", "Akashvani / News on AIR", "Official current regional-name and tika/prayer corroboration; not proof that regional procedures are identical", "citation_only", url="https://www.newsonair.gov.in/bulletins-detail/morning-news-532/", observed_fetch=NEWS_ON_AIR_BHAI_DOOJ_FETCH),
            source("devam-bhai-dooj-safety-and-inclusion-boundary", "Devam Bhai Dooj flame, skin, food, gift, family, and inclusion boundary", "Devam", "Editorial safety and scope boundary; not scripture, history, or ritual authority", "internal_only"),
        ],
        "localized_content": localized_content(
            legacy,
            lane_id,
            {"minimum": "Short consent-led North India sibling form", "standard": "North India family-led tika and meal form", "elaborate": "Established elder- or family-led North India gathering"},
            ["incredible-india-bhai-dooj", "newsonair-bhai-dooj-regional-names", "devam-bhai-dooj-safety-and-inclusion-boundary"],
            ["incredible-india-bhai-dooj", "devam-bhai-dooj-safety-and-inclusion-boundary"],
            bhai_dooj_details,
        ),
        "product_status": status(),
    }
    assert_source_references(pack)
    return pack


def main() -> int:
    outputs = {
        "bali-pratipada-maharashtra-content-v1.json": bali_pratipada(),
        "govardhana-puja-iskcon-content-v1.json": govardhana_puja(),
        "bhai-dooj-north-india-content-v1.json": bhai_dooj(),
    }
    reports = []
    for filename, value in outputs.items():
        payload = (json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n").encode("utf-8")
        path = PACK_DIR / filename
        path.write_bytes(payload)
        reports.append(
            {
                "path": path.relative_to(ROOT).as_posix(),
                "bytes": len(payload),
                "sha256": hashlib.sha256(payload).hexdigest(),
            }
        )
    print(json.dumps(reports, ensure_ascii=False, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

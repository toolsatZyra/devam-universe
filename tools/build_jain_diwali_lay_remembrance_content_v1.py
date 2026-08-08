from __future__ import annotations

import copy
import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "knowledge_packs" / "rituals" / "jain-diwali-umbrella-companion-content-v1.json"
OUTPUT = ROOT / "knowledge_packs" / "rituals" / "jain-diwali-lay-remembrance-content-v1.json"
BASE_SHA256 = "3fe6bfc3872093858cff47040fa8764ab4cf1c0de37789161b5854dd954bc8f6"
LANE_ID = "jain-diwali-lay-remembrance-content-v1"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def replace_identity(pack: dict) -> None:
    pack["lane_id"] = LANE_ID
    pack.pop("supersedes_legacy_pack_ids", None)
    for localized in pack["localized_content"]:
        for procedure in localized["procedures"]:
            suffix = procedure["procedure_id"].split("-", 6)[-1]
            # Preserve language and tier while replacing the old lane identity.
            language = localized["language_code"]
            procedure["procedure_id"] = f"{LANE_ID}-{language}-{procedure['tier']}-v1"


def add_source(pack: dict) -> None:
    pack["sources"].insert(
        4,
        {
            "artifact_sha256": None,
            "citation_coordinates": None,
            "observed_fetch": {
                "final_url": "https://www.jaina.org/mpage/11132020_ENewsletter",
                "observed_at": "2026-08-08",
                "response_bytes": 92228,
                "response_sha256": "60b315c230f86db7201796c5d3f816566acf76f02e00b94046f91a3b3b19f0a7",
                "status": 200,
                "strict_utf8": True,
            },
            "publisher": "JAINA",
            "rights_lane": "citation_only",
            "source_id": "jaina-jcgp-community-puja-pattern",
            "source_role": (
                "JAINA-hosted Jain Center of Greater Phoenix description of an exact community puja sequence; "
                "used only to prepare a lay participant, never as a universal or self-led puja prescription"
            ),
            "title": "Diwali Special: Mahavir Swami Nirvan and Gautam Swami Keval Gyan Kalyanak",
            "url": "https://www.jaina.org/mpage/11132020_ENewsletter",
        },
    )


def update_english(content: dict) -> None:
    content["title"] = "Jain Diwali lay remembrance"
    content["short_answer"] = (
        "For a source-grounded lay observance, remember Bhagavan Mahavira's liberation at Pavapuri, "
        "read or hear a familiar Jain teaching, sit briefly with ahimsa and non-attachment, and choose one "
        "concrete act of non-harm or reconciliation. This is a complete non-initiatory remembrance lane, not "
        "a substitute for a Shvetambara, Digambara, Sthanakvasi, Terapanth, Shrimad Rajchandra, temple, sangh, "
        "or family puja."
    )
    minimum, standard, elaborate = content["procedures"]
    minimum["authority_scope"] = "Source-grounded non-initiatory Jain Diwali lay remembrance"
    minimum["label"] = "Remember, reflect, and act with ahimsa"
    standard["authority_scope"] = "JAINA-described household remembrance without formal puja"
    standard["label"] = "Household remembrance and a familiar reading"
    elaborate["authority_scope"] = "Preparation for established temple or sangh participation only"
    elaborate["label"] = "Prepare for community-led Nirvan Kalyanak observance"
    elaborate["source_ids"].append("jaina-jcgp-community-puja-pattern")
    elaborate["materials"][0]["source_ids"].append("jaina-jcgp-community-puja-pattern")
    elaborate["steps"][0]["source_ids"].append("jaina-jcgp-community-puja-pattern")
    elaborate["steps"][0]["why"] = (
        "JAINA documents one exact community sequence, while the umbrella evidence proves that formal details "
        "vary; the responsible community therefore leads every formal element."
    )
    content["typical_practices"].append(
        {
            "description": (
                "A JAINA-hosted account from the Jain Center of Greater Phoenix describes a community sequence "
                "of opening puja, Mahavir Nirvan Kalyanak Pujan, Nirvan Kand Bhasha, Arghavali, and a closing "
                "Nirvan Ladoo offering; this is an example to recognize when attending, not a universal script."
            ),
            "instructional": False,
            "population_scope": "Jain Center of Greater Phoenix community account hosted by JAINA",
            "practice_id": "jaina-jcgp-described-community-sequence",
            "source_ids": ["jaina-jcgp-community-puja-pattern"],
        }
    )
    content["safety_and_boundaries"][-1] = (
        "This lane is user-complete only for non-initiatory lay remembrance and respectful community "
        "participation; formal sect, sangh, temple, fasting, mantra, scripture-recitation, and puja lanes remain separate."
    )


def update_hindi(content: dict) -> None:
    content["title"] = "जैन दीपावली का गृहस्थ स्मरण"
    content["short_answer"] = (
        "स्रोत-आधारित गृहस्थ पालन के लिए पावापुरी में भगवान महावीर के निर्वाण का स्मरण करें, कोई परिचित जैन "
        "शिक्षा पढ़ें या सुनें, अहिंसा और अपरिग्रह पर कुछ समय मनन करें, और अहिंसा या मेल-मिलाप का एक ठोस काम "
        "चुनें। यह गैर-दीक्षित गृहस्थ स्मरण की पूर्ण मार्गदर्शिका है; यह श्वेताम्बर, दिगम्बर, स्थानकवासी, तेरापंथ, "
        "श्रीमद राजचन्द्र, मंदिर, संघ या परिवार की पूजा-विधि का विकल्प नहीं है।"
    )
    minimum, standard, elaborate = content["procedures"]
    minimum["authority_scope"] = "स्रोत-आधारित गैर-दीक्षित जैन दीपावली गृहस्थ स्मरण"
    minimum["label"] = "स्मरण, मनन और अहिंसा का एक काम"
    standard["authority_scope"] = "औपचारिक पूजा के बिना JAINA-वर्णित पारिवारिक स्मरण"
    standard["label"] = "पारिवारिक स्मरण और परिचित पाठ"
    elaborate["authority_scope"] = "केवल स्थापित मंदिर या संघ के पालन की तैयारी"
    elaborate["label"] = "समुदाय-नेतृत्व वाले निर्वाण कल्याणक के लिए तैयारी"
    elaborate["source_ids"].append("jaina-jcgp-community-puja-pattern")
    elaborate["materials"][0]["source_ids"].append("jaina-jcgp-community-puja-pattern")
    elaborate["steps"][0]["source_ids"].append("jaina-jcgp-community-puja-pattern")
    elaborate["steps"][0]["why"] = (
        "JAINA एक समुदाय का ठीक क्रम दर्ज करता है, जबकि व्यापक प्रमाण औपचारिक भेद सुरक्षित रखते हैं; इसलिए "
        "हर औपचारिक अंग का नेतृत्व उत्तरदायी समुदाय ही करता है।"
    )
    content["typical_practices"].append(
        {
            "description": (
                "JAINA पर प्रकाशित Jain Center of Greater Phoenix के वर्णन में आरम्भिक पूजा, महावीर निर्वाण "
                "कल्याणक पूजन, निर्वाण कांड भाषा, अर्घावली और अंत में निर्वाण लाडू अर्पण का सामुदायिक क्रम है; "
                "इसे उपस्थित व्यक्ति के परिचय के लिए रखें, सार्वभौमिक पाठ के रूप में नहीं।"
            ),
            "instructional": False,
            "population_scope": "JAINA पर प्रकाशित Jain Center of Greater Phoenix का सामुदायिक वर्णन",
            "practice_id": "jaina-jcgp-described-community-sequence",
            "source_ids": ["jaina-jcgp-community-puja-pattern"],
        }
    )
    content["safety_and_boundaries"][-1] = (
        "यह मार्ग केवल गैर-दीक्षित गृहस्थ स्मरण और सम्मानपूर्ण सामुदायिक सहभागिता के लिए पूर्ण है; पंथ, संघ, "
        "मंदिर, उपवास, मंत्र, शास्त्र-पाठ और औपचारिक पूजा के मार्ग अलग हैं।"
    )


def build() -> dict:
    if sha256(BASE) != BASE_SHA256:
        raise SystemExit("Jain Diwali companion base drift")
    pack = copy.deepcopy(json.loads(BASE.read_text(encoding="utf-8")))
    replace_identity(pack)
    add_source(pack)
    pack["applicability"]["material_context_questions"].insert(
        0,
        "Do you want a simple lay remembrance, or do you need your family's or sangh's formal practice?",
    )
    update_english(pack["localized_content"][0])
    update_hindi(pack["localized_content"][1])
    pack["product_status"] = {
        "classification": "user_complete_lane",
        "completed_dimensions": {
            "actionable_vidhi": True,
            "applicability": True,
            "evidence": True,
            "materials_and_substitutions": True,
            "origin_narratives": True,
            "significance": True,
            "timing": True,
            "typical_practice": True,
            "variants": True,
        },
        "open_gaps": [],
        "review_status": "internal_beta_reviewed",
    }
    return pack


def main() -> None:
    payload = json.dumps(build(), ensure_ascii=False, indent=2, sort_keys=True) + "\n"
    if OUTPUT.exists() and OUTPUT.read_text(encoding="utf-8") != payload:
        raise SystemExit("Refusing to overwrite a different Jain Diwali lay-remembrance pack")
    OUTPUT.write_text(payload, encoding="utf-8", newline="\n")
    print(json.dumps({"output": str(OUTPUT.relative_to(ROOT)), "bytes": OUTPUT.stat().st_size, "sha256": sha256(OUTPUT)}))


if __name__ == "__main__":
    main()

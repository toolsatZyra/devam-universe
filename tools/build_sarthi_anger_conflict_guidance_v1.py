from __future__ import annotations

import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE_SHA256 = "e10352273ea29958205dbc72b7b81a0df95eb3623a0b6439141e3e2a2d54b505"
SOURCE = ROOT / "source_vault" / "objects" / "sha256" / "e1" / SOURCE_SHA256
OUTPUT = ROOT / "knowledge_packs" / "wisdom" / "anger-conflict-guidance-v1.json"


def sha256(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def passage(raw: bytes, marker: str, principle_id: str, en: str, hi: str, boundary: str) -> dict[str, object]:
    needle = f"<p>{marker}</p>".encode()
    marker_at = raw.find(needle)
    if marker_at < 0 or raw.find(needle, marker_at + 1) >= 0:
        raise ValueError(f"marker universe drift: {marker}")
    start = raw.rfind(b"<div>", 0, marker_at)
    end = raw.find(b"</div>", marker_at)
    if start < 0 or end < 0:
        raise ValueError(f"div boundary missing: {marker}")
    end += len(b"</div>")
    prefix = raw[:start]
    ordinal = prefix.count(b"<div>") + 1
    span = raw[start:end]
    return {
        "principle_id": principle_id,
        "source_id": "gretil-bhagavadgita-four-commentaries-tei",
        "source_ordinal": ordinal,
        "literal_marker": marker,
        "byte_start": start,
        "byte_end_exclusive": end,
        "line_start": prefix.count(b"\n") + 1,
        "line_end": raw[:end].count(b"\n") + 1,
        "span_sha256": sha256(span),
        "en": en,
        "hi": hi,
        "application_boundary": boundary,
    }


def build() -> dict[str, object]:
    raw = SOURCE.read_bytes()
    if len(raw) != 2_056_476 or sha256(raw) != SOURCE_SHA256:
        raise ValueError("fixed Gita source drift")
    principles = [
        passage(
            raw,
            "BhG 2.62-63",
            "notice-the-escalation-chain",
            "Repeated attention can feed attachment, frustrated desire, anger, confusion, and poorer judgment. Treat this as a warning map to notice early, not as a diagnosis or a verdict about your character.",
            "बार-बार उसी बात पर टिके रहने से आसक्ति, बाधित इच्छा, क्रोध, भ्रम और निर्णय-क्षमता में कमी की शृंखला बन सकती है। इसे समय रहते पहचानने का संकेत मानें—न निदान, न आपके चरित्र पर फैसला।",
            "The passage does not prove one psychological mechanism for every person or justify blaming someone for an emotional response.",
        ),
        passage(
            raw,
            "BhG 6.5",
            "take-one-self-directed-step",
            "Choose one action within your control that steadies rather than degrades the situation. Self-direction here means agency and practice, not self-blame or handling danger alone.",
            "अपने नियंत्रण में ऐसा एक कदम चुनें जो परिस्थिति को बिगाड़ने के बजाय स्थिर करे। यहाँ आत्म-दिशा का अर्थ अपनी क्षमता और अभ्यास है—आत्म-दोष या खतरे को अकेले सहना नहीं।",
            "This lens never transfers responsibility for abuse or coercion to the harmed person and never replaces qualified or emergency help.",
        ),
        passage(
            raw,
            "BhG 12.13-14",
            "compassion-with-boundaries",
            "Non-hatred, friendliness, compassion, steadiness, and restraint can guide the manner of a response without requiring agreement, access, reconciliation, or the abandonment of boundaries.",
            "अद्वेष, मैत्री, करुणा, स्थिरता और संयम प्रतिक्रिया के ढंग को दिशा दे सकते हैं; इनका अर्थ सहमति, निकटता, मेल-मिलाप या अपनी सीमाएँ छोड़ना नहीं है।",
            "Compassion is not permission for repeated harm, silence about material facts, or forced reconciliation.",
        ),
    ]
    expected = {
        "BhG 2.62-63": (91, 306_053, 309_733, 2913, 2937, "217401c55f988f461182e300c93bcd6e71b41a9e2934caee5c5d093ec1cad7df"),
        "BhG 6.5": (217, 733_139, 735_347, 6382, 6403, "aeb25125bcfc8c4bb46a7f92402eadf76ead5d95f8ced16a7f4e1077ead44839"),
        "BhG 12.13-14": (444, 1_492_050, 1_499_426, 12640, 12703, "521b1a63e04298be46edf0054bcad04679a70d1aad3b99fff55434c99d19873d"),
    }
    for item in principles:
        observed = (item["source_ordinal"], item["byte_start"], item["byte_end_exclusive"], item["line_start"], item["line_end"], item["span_sha256"])
        if observed != expected[item["literal_marker"]]:
            raise ValueError(f"frozen passage drift: {item['literal_marker']}")
    return {
        "contract": "DEVAM_SARTHI_REVIEWED_PERSONAL_GUIDANCE_V1",
        "bundle_id": "anger-conflict-guidance-v1",
        "review_status": "internal_beta_reviewed",
        "languages": ["en", "hi"],
        "scope": "A bounded conversation route for recurring anger or escalating interpersonal conflict after immediate danger has been excluded.",
        "positive_boundary": "Sarthi may use these reviewed principles to help a user notice escalation, pause, choose one stabilizing action, communicate carefully, and retain boundaries. They do not diagnose, command reconciliation, or replace human help.",
        "denials": {
            "scripture_diagnoses_emotion_or_mental_health": False,
            "anger_proves_bad_character": False,
            "harmed_person_is_responsible_for_abuse": False,
            "compassion_requires_access_or_reconciliation": False,
            "safety_or_professional_help_is_replaced": False,
            "private_commentary_text_may_be_quoted": False,
            "one_commentary_is_universal": False,
            "complete_bhagavadgita_tradition": False,
        },
        "sources": [
            {
                "source_id": "gretil-bhagavadgita-four-commentaries-tei",
                "work_title": "Bhagavadgita with four named commentary layers",
                "edition_title": "GRETIL TEI conversion dated 2020-07-31",
                "source_object_id": f"sha256:{SOURCE_SHA256}",
                "source_path": SOURCE.relative_to(ROOT).as_posix(),
                "byte_count": len(raw),
                "sha256": SOURCE_SHA256,
                "rights_lane": "citation_only",
                "rights_boundary": "CC BY-NC-SA 4.0 electronic carrier retained as private evidence; no exact source or commentary text is exposed by this bundle.",
                "ingestion_plan": "ingestion/plans/bhagavadgita-gretil-four-commentaries-v1.json",
                "ingestion_packet_sha256": "86eecb307effc8fb03c32888596f2b0c3538e325d41fa92c5281e9e9de3974f3",
            },
            {
                "source_id": "gita-supersite-verse-identity",
                "work_title": "Srimad Bhagavadgita",
                "edition_title": "IIT Kanpur Gita Supersite verse pages",
                "source_object_id": "external:gitasupersite",
                "rights_lane": "citation_only",
                "rights_boundary": "External verse-identity and comparison reference only; modern translations are not copied.",
                "urls": [
                    "https://www.gitasupersite.iitk.ac.in/srimad?field_chapter_value=2&field_nsutra_value=62&language=dv",
                    "https://www.gitasupersite.iitk.ac.in/srimad?field_chapter_value=6&field_nsutra_value=5&language=dv",
                    "https://www.gitasupersite.iitk.ac.in/srimad?field_chapter_value=12&field_nsutra_value=13&language=dv",
                ],
            },
        ],
        "principles": principles,
        "routes": [
            {
                "route_id": "recurring-anger-conflict",
                "match_concepts": ["anger", "angry", "temper", "rage", "fight", "argument", "conflict", "क्रोध", "गुस्सा", "झगड़ा", "बहस"],
                "required_context": ["whether anyone is in immediate danger", "who is involved", "what tends to happen immediately before escalation", "what outcome the user wants"],
                "principle_ids": ["notice-the-escalation-chain", "take-one-self-directed-step", "compassion-with-boundaries"],
                "response_moves": {
                    "en": ["Check immediate safety before reflection.", "Name the earliest observable escalation cue without moralising it.", "Choose one short pause or separation step that does not hide material facts.", "Return to the conversation only with a concrete purpose and boundary."],
                    "hi": ["विचार से पहले तत्काल सुरक्षा जाँचें।", "नैतिक फैसला सुनाए बिना बढ़ते तनाव का सबसे पहला दिखाई देने वाला संकेत पहचानें।", "ऐसा छोटा विराम या दूरी चुनें जो जरूरी तथ्य न छिपाए।", "स्पष्ट उद्देश्य और सीमा के साथ ही बातचीत पर लौटें।"],
                },
            }
        ],
    }


def main() -> None:
    payload = json.dumps(build(), ensure_ascii=False, indent=2, sort_keys=True) + "\n"
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(payload, encoding="utf-8", newline="\n")
    print(json.dumps({"result": "PASS", "path": OUTPUT.relative_to(ROOT).as_posix(), "bytes": len(payload.encode()), "sha256": sha256(payload.encode())}))


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Build the two final bounded September participant lanes."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
RITUAL_DIR = ROOT / "knowledge_packs" / "rituals"
DIMENSIONS = {
    "applicability": True,
    "timing": True,
    "significance": True,
    "origin_narratives": True,
    "typical_practice": True,
    "actionable_vidhi": True,
    "materials_and_substitutions": True,
    "variants": True,
    "evidence": True,
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def source(source_id: str, title: str, publisher: str, role: str, rights: str, url: str | None = None, artifact: str | None = None, coordinate: dict | None = None) -> dict:
    return {
        "source_id": source_id,
        "title": title,
        "publisher": publisher,
        "source_role": role,
        "rights_lane": rights,
        "url": url,
        "artifact_sha256": artifact,
        "citation_coordinates": coordinate,
        "observed_fetch": None,
    }


def procedure(lane: str, lang: str, tier: str, label: str, minutes: int, material: str, substitution: str, steps: list[tuple[str, str, list[str]]], source_ids: list[str], close: str, authority: str, setting: str, form: str) -> dict:
    return {
        "procedure_id": f"{lane}-{lang}-{tier}-v1",
        "label": label,
        "tier": tier,
        "setting": setting,
        "authority_scope": authority,
        "form": form,
        "estimated_minutes": minutes,
        "materials": [{"item": material, "required": True, "substitutions": [substitution], "source_ids": source_ids}],
        "steps": [
            {"ordinal": index, "instruction": instruction, "why": why, "optional": False, "source_ids": refs}
            for index, (instruction, why, refs) in enumerate(steps, start=1)
        ],
        "closing": {"text": close, "scope_note": "Family or living-tradition detail overrides this bounded participant form.", "source_ids": source_ids},
        "source_ids": source_ids,
    }


def localized_agastya(lang: str) -> dict:
    if lang == "en":
        title = "Agastya Arghya in New Delhi"
        short = "For this exact New Delhi 2026 lane, the practitioner calendar places Agastya Arghya on 4 September, 04:58–06:00. First ask whether your family observes it. A safe minimum is a clean-water offering and familiar prayer or quiet remembrance of Rishi Agastya; the app does not claim a universal mantra, full vrata, or general astronomical rule."
        significance = "The retained historical evidence links an offering to the seasonal rising associated with Agastya, while the modern page supplies only the bounded New Delhi date and window. Devam presents this as an attributable observance of Rishi Agastya, not as a guaranteed astronomical sighting or universal practice."
        narrative = "A retained Nirnayasindhu edition records Agastya-rise timing traditions and an arghya period. Those historical rules vary and do not reproduce the modern provider's calculation, so they supply context rather than one universal origin or modern procedure."
        practice = "The current practitioner page presents prayer and arghya around the displayed rise. Regional, family, mantra, donation, homa, and longer vrata details are not treated as universal."
        prompts = ["Does your family or sampradaya observe Agastya Arghya?", "Are you in New Delhi for the exact 2026 fixture, or do you need a local calendar?", "Do you know a family prayer, mantra, or fuller sequence?", "Can a small water offering be made safely without relying on star visibility?"]
        safety = ["Do not infer the date for another place or year from this fixture.", "Do not stare toward the Sun, climb, enter unsafe water, or depend on clear weather.", "Historical caste restrictions, promised outcomes, donations, homa, and unverified mantras are not instructions."]
        variants = [
            ("location-year-boundary", "Other locations and years", "Use a trusted local calendar; New Delhi's 2026 date and window are not portable."),
            ("family-practice-boundary", "Family and sampradaya practice", "Prayer, mantra, vessel, direction, offerings, duration, and closing remain with the family's living authority."),
        ]
        minimum = [("Confirm that your family observes Agastya Arghya and use the exact New Delhi 2026 date and displayed window only if the location matches.", "The evidence supports one location-year fixture, not a general rule.", ["devam-agastya-resolved-fixture"]), ("From a stable safe place, offer a small amount of clean water with a familiar prayer, or observe a quiet remembrance of Rishi Agastya.", "This preserves the supported prayer-and-arghya core without inventing a mantra or requiring visual sighting.", ["drikpanchang-agastya-practice", "nirnayasindhu-agastya-context", "devam-agastya-safety-boundary"]), ("Close respectfully and clean the place; treat visibility, outcome claims, and fuller procedures as unresolved unless your family authority supplies them.", "The bounded companion must not turn source descriptions into universal prescriptions.", ["devam-agastya-safety-boundary"])]
        standard = [("Ask an elder or recognised practitioner for your family's vessel, prayer, direction, and closing before beginning.", "Living practice controls details absent from the bounded sources.", ["devam-agastya-safety-boundary"]), ("Within the displayed New Delhi window, follow only those confirmed family details, keeping the offering small and physically safe.", "The time is a provider fixture; the provider method and weather visibility are not guaranteed.", ["devam-agastya-resolved-fixture", "drikpanchang-agastya-practice"]), ("Conclude with remembrance or study of Agastya and Lopamudra if that belongs to your tradition, without adding promised outcomes.", "Study is an optional devotional extension, not a reconstructed rite.", ["nirnayasindhu-agastya-context", "devam-agastya-safety-boundary"])]
        elaborate = [("Use a recognised family, temple, or sampradaya guide for any mantra, multi-day offering, donation, homa, or formal vrata sequence.", "The retained historical text is evidence, not a self-serve modern liturgy.", ["nirnayasindhu-agastya-context", "devam-agastya-safety-boundary"]), ("Follow only the confirmed sequence and its safe close; do not import historical social restrictions or guarantee spiritual or material results.", "Authority and safety remain explicit at the fuller boundary.", ["devam-agastya-safety-boundary"])]
        labels = ("Simple water offering", "Family-confirmed form", "Recognised-guide form")
        material = ("Clean water and a small safe vessel", "A familiar prayer or silent remembrance; use no material if an offering is unsafe")
        close = "Close quietly, dispose of or use the water respectfully and safely, and clean the place."
    else:
        title = "नई दिल्ली में अगस्त्य अर्घ्य"
        short = "नई दिल्ली 2026 के इस निश्चित संदर्भ में पंचांग 4 सितंबर, 04:58–06:00 का समय देता है। पहले जानें कि आपके परिवार में यह पालन होता है या नहीं। सरल रूप में स्वच्छ जल का सुरक्षित अर्घ्य और परिचित प्रार्थना या ऋषि अगस्त्य का शांत स्मरण करें; इसे सार्वभौमिक मंत्र, पूर्ण व्रत या सामान्य खगोलीय नियम न मानें।"
        significance = "सुरक्षित ऐतिहासिक प्रमाण अगस्त्य से जुड़े ऋतुजन्य उदय और अर्घ्य की परंपरा बताते हैं; आधुनिक पृष्ठ केवल नई दिल्ली का निश्चित दिन और समय देता है। यह ऋषि अगस्त्य का स्रोत-सापेक्ष स्मरण है, दृश्यता की गारंटी या सार्वभौमिक रीति नहीं।"
        narrative = "निरूपित निर्णयसिंधु संस्करण में अगस्त्योदय और अर्घ्य की अलग समय-परंपराएँ मिलती हैं। वे आधुनिक प्रदाता की गणना को पुनरुत्पादित नहीं करतीं, इसलिए संदर्भ हैं, एकमात्र आधुनिक विधि नहीं।"
        practice = "वर्तमान पंचांग पृष्ठ प्रार्थना और अर्घ्य का उल्लेख करता है। मंत्र, दान, होम, दीर्घ व्रत और क्षेत्रीय-पारिवारिक विवरण सार्वभौमिक नहीं माने गए हैं।"
        prompts = ["क्या आपके परिवार या संप्रदाय में अगस्त्य अर्घ्य होता है?", "क्या आप नई दिल्ली में हैं, या स्थानीय पंचांग चाहिए?", "क्या परिवार की कोई परिचित प्रार्थना या विस्तृत विधि है?", "क्या जल-अर्घ्य सुरक्षित स्थान पर किया जा सकता है?"]
        safety = ["इस तिथि को दूसरे स्थान या वर्ष पर लागू न करें।", "सूर्य की ओर न देखें, ऊंचाई या असुरक्षित जल में न जाएं और साफ मौसम पर निर्भर न रहें।", "ऐतिहासिक जाति-नियम, फल-दावे, दान, होम और अप्रमाणित मंत्र निर्देश नहीं हैं।"]
        variants = [("स्थान-वर्ष सीमा", "अन्य स्थान और वर्ष", "विश्वसनीय स्थानीय पंचांग लें; नई दिल्ली 2026 का समय अन्यत्र लागू नहीं है।"), ("पारिवारिक सीमा", "परिवार और संप्रदाय", "मंत्र, पात्र, दिशा, सामग्री, अवधि और समापन जीवित पारिवारिक परंपरा के अनुसार हों।")]
        minimum = [("पहले पुष्टि करें कि परिवार में अगस्त्य अर्घ्य होता है; नई दिल्ली 2026 का दिन और समय केवल उसी स्थान के लिए लें।", "प्रमाण एक स्थान-वर्ष संदर्भ देता है, सामान्य नियम नहीं।", ["devam-agastya-resolved-fixture"]), ("स्थिर सुरक्षित स्थान से थोड़ा स्वच्छ जल अर्पित करें और परिचित प्रार्थना या ऋषि अगस्त्य का शांत स्मरण करें।", "इससे बिना मंत्र गढ़े और तारा देखना अनिवार्य किए प्रार्थना-अर्घ्य का मूल बना रहता है।", ["drikpanchang-agastya-practice", "nirnayasindhu-agastya-context", "devam-agastya-safety-boundary"]), ("सम्मान से समापन और सफाई करें; दृश्यता, फल और विस्तृत विधि को पारिवारिक मार्गदर्शन के बिना न मानें।", "सीमित साथी सार्वभौमिक विधान नहीं बनाता।", ["devam-agastya-safety-boundary"])]
        standard = [("बुजुर्ग या मान्य जानकार से पात्र, प्रार्थना, दिशा और समापन पूछें।", "अनुपस्थित विवरण जीवित परंपरा तय करती है।", ["devam-agastya-safety-boundary"]), ("निर्धारित नई दिल्ली समय में केवल पुष्टि किए पारिवारिक विवरण सुरक्षित ढंग से करें।", "समय प्रदाता-संदर्भ है; गणना-विधि और दृश्यता सिद्ध नहीं हैं।", ["devam-agastya-resolved-fixture", "drikpanchang-agastya-practice"]), ("यदि परंपरा में हो तो अगस्त्य और लोपामुद्रा का स्मरण या अध्ययन करें, फल की गारंटी न दें।", "अध्ययन वैकल्पिक विस्तार है, गढ़ी हुई विधि नहीं।", ["nirnayasindhu-agastya-context", "devam-agastya-safety-boundary"])]
        elaborate = [("मंत्र, बहुदिनी अर्घ्य, दान, होम या औपचारिक व्रत के लिए मान्य परिवार, मंदिर या संप्रदाय-मार्गदर्शक लें।", "ऐतिहासिक पाठ प्रमाण है, स्वयं करने की आधुनिक पूर्ण विधि नहीं।", ["nirnayasindhu-agastya-context", "devam-agastya-safety-boundary"]), ("केवल पुष्टि किया क्रम और सुरक्षित समापन करें; ऐतिहासिक सामाजिक प्रतिबंध या निश्चित फल न जोड़ें।", "विस्तृत सीमा पर अधिकार और सुरक्षा स्पष्ट रहते हैं।", ["devam-agastya-safety-boundary"])]
        labels = ("सरल जल-अर्घ्य", "परिवार-पुष्ट रूप", "मान्य मार्गदर्शक का रूप")
        material = ("स्वच्छ जल और छोटा सुरक्षित पात्र", "परिचित प्रार्थना या मौन स्मरण; अर्घ्य असुरक्षित हो तो सामग्री न लें")
        close = "शांतिपूर्वक समापन करें, जल का सम्मानपूर्वक और सुरक्षित उपयोग या विसर्जन करें और स्थान साफ करें।"
    refs = ["devam-agastya-resolved-fixture", "drikpanchang-agastya-practice", "nirnayasindhu-agastya-context", "devam-agastya-safety-boundary"]
    procedures = [
        procedure("agastya-arghya-delhi-content-v1", lang, "minimum", labels[0], 8, material[0], material[1], minimum, refs, close, "Exact New Delhi 2026 minimum participant form", "individual", "accessible_short"),
        procedure("agastya-arghya-delhi-content-v1", lang, "standard", labels[1], 20, material[0], material[1], standard, refs, close, "Family-confirmed Agastya Arghya form", "family_led", "traditional_household"),
        procedure("agastya-arghya-delhi-content-v1", lang, "elaborate", labels[2], 40, material[0], material[1], elaborate, refs, close, "Recognised family temple or sampradaya authority only", "teacher_led", "fuller_family_or_teacher_led"),
    ]
    return {"language_code": lang, "title": title, "short_answer": short, "significance": {"text": significance, "source_ids": ["nirnayasindhu-agastya-context", "drikpanchang-agastya-practice"], "scope_note": "One exact New Delhi 2026 participant lane; no general algorithm or universal procedure."}, "origin_narratives": [{"narrative_id": f"agastya-rise-context-{lang}", "title": title, "summary": narrative, "tradition_scope": "Retained historical context and bounded current practitioner calendar", "source_ids": ["nirnayasindhu-agastya-context", "drikpanchang-agastya-practice"], "universal_origin_claimed": False}], "typical_practices": [{"practice_id": f"agastya-prayer-arghya-{lang}", "population_scope": "Families that recognise Agastya Arghya in the supported New Delhi lane", "description": practice, "source_ids": ["drikpanchang-agastya-practice", "devam-agastya-safety-boundary"], "instructional": False}], "procedures": procedures, "variants": [{"variant_id": f"agastya-{i}-{lang}", "scope": scope, "difference": difference, "source_ids": ["devam-agastya-resolved-fixture", "devam-agastya-safety-boundary"], "separate_lane_required": True} for i, (unused, scope, difference) in enumerate(variants, 1)], "safety_and_boundaries": safety}


def localized_hala(lang: str) -> dict:
    if lang == "en":
        title = "Hala Shashthi / Hal Chhath"
        short = "For the bounded Delhi/North India lane, Hala Shashthi falls on 2 September 2026. Ask whether your household observes it. A safe minimum is remembrance of Balarama as Haladhara, a family-wellbeing prayer, and one act of care; fasting, special foods, standing until moonrise, arghya, branch or image rites, and promised outcomes require living family authority."
        significance = "The current practitioner source associates Hala Shashthi with Balarama and preserves several regional names and family-wellbeing practices. Devam keeps those descriptions attributable and does not equate this observance with the separate ISKCON Balarama Purnima."
        narrative = "In the current practitioner account, the day is linked with the birth of Balarama, whose plough gives the name Haladhara and the Hala Shashthi identity. This is a source-attributed festival account, not a claim that every region shares one origin or rite."
        practice = "Described practices vary widely and include fasting or food rules, family-wellbeing prayer, moonrise arghya, and different deity forms. The product minimum does not prescribe the demanding or highly variable elements."
        prompts = ["Does your family call the day Hala Shashthi, Hal Chhath, Lalahi Chhath, or another name?", "Is this a household observance, community gathering, or personal remembrance?", "Does your family follow fasting, food, moonrise, or puja details that should override the minimum form?", "Do you need a non-fasting, material-free, short form?"]
        safety = ["Do not prescribe fasting, restricted foods, standing until moonrise, or medical claims.", "Do not universalise women-only or sons-only framing.", "Do not merge 2 September Hala Shashthi with 28 August ISKCON Balarama Purnima or the rejected 16 September lead."]
        variants = [("regional-names", "North Indian regional names", "Hala Shashthi, Hal Chhath, Lalahi Chhath and related names can carry different household practices; ask before mapping them."), ("balarama-identity", "Balarama observances", "Official ISKCON Balarama Purnima on 28 August is a separate calendar and practice lane; the 16 September attribution remains rejected.")]
        minimum = [("Confirm that the household observes Hala Shashthi and use the 2 September Delhi fixture only for this bounded context.", "The date decision is specific and preserves other Balarama identities separately.", ["devam-hala-shashthi-fixture"]), ("Remember Balarama as Haladhara through a familiar prayer, story, or a brief reflection on strength used in service and care.", "This uses the source-attributed identity without inventing a formal mantra.", ["drikpanchang-hala-shashthi-context"]), ("Choose one practical act supporting a child, elder, caregiver, farmer, or household member and close with a family-wellbeing prayer.", "It makes the observance actionable without promising health or longevity.", ["drikpanchang-hala-shashthi-context", "devam-hala-shashthi-safety-boundary"])]
        standard = [("Ask an elder which regional name, story, deity form, and family sequence applies before preparing materials or food.", "The source describes substantial regional variation.", ["drikpanchang-hala-shashthi-context", "devam-hala-shashthi-safety-boundary"]), ("Follow the family's familiar prayer and safe symbolic elements only; keep fasting, diet, moonrise, arghya, and branch or image rites optional and authority-led.", "Demanding or specific practices are not universalised by the app.", ["drikpanchang-hala-shashthi-context", "devam-hala-shashthi-safety-boundary"]), ("Include family care or community service and close according to household custom without outcome guarantees.", "The companion supports participation, not supernatural or medical promises.", ["devam-hala-shashthi-safety-boundary"])]
        elaborate = [("Use a recognised family or community guide for fasting, food restrictions, moonrise arghya, Shiva-family or Chhathi Mata worship, branch, clay, or image procedures.", "Those details are variable and require living authority.", ["drikpanchang-hala-shashthi-context", "devam-hala-shashthi-safety-boundary"]), ("Follow only the confirmed form and stop any unsafe, exclusionary, or medically unsuitable requirement.", "Fuller participation still preserves personal safety and the lane's non-universal boundary.", ["devam-hala-shashthi-safety-boundary"])]
        labels = ("Balarama remembrance and care", "Family-confirmed Hala Shashthi", "Recognised community form")
        material = ("A quiet place and a familiar Balarama or family prayer", "Use silent remembrance and a practical act of care; no purchase or fasting is required")
        close = "Close with goodwill for the family and community, then safely clear any materials used."
    else:
        title = "हल षष्ठी / हल छठ"
        short = "दिल्ली/उत्तर भारत के सीमित संदर्भ में हल षष्ठी 2 सितंबर 2026 को है। पहले पूछें कि परिवार में यह पालन होता है या नहीं। सरल रूप में बलराम का हलधर रूप, परिवार-कल्याण की प्रार्थना और सेवा का एक काम रखें; उपवास, विशेष भोजन, चंद्रोदय तक खड़े रहना, अर्घ्य, डाल या प्रतिमा-विधि और फल-दावे जीवित पारिवारिक मार्गदर्शन पर छोड़ें।"
        significance = "वर्तमान पंचांग स्रोत हल षष्ठी को बलराम से जोड़ता है और अनेक क्षेत्रीय नाम तथा परिवार-कल्याण की रीतियाँ बताता है। देवम इन्हें स्रोत-सापेक्ष रखता है और अलग इस्कॉन बलराम पूर्णिमा से नहीं मिलाता।"
        narrative = "वर्तमान स्रोत इस दिन को बलराम-जन्म से जोड़ता है; उनके हल के कारण हलधर और हल षष्ठी नाम बताए जाते हैं। यह स्रोत का त्योहार-वर्णन है, हर क्षेत्र की एकमात्र उत्पत्ति या विधि नहीं।"
        practice = "वर्णित रीतियों में उपवास या भोजन-नियम, परिवार-कल्याण प्रार्थना, चंद्र-अर्घ्य और अलग देव-रूप आते हैं। ऐप का सरल रूप कठिन या अत्यधिक बदलने वाले तत्वों को अनिवार्य नहीं करता।"
        prompts = ["आपके परिवार में इसे हल षष्ठी, हल छठ, ललही छठ या किसी और नाम से जानते हैं?", "यह घरेलू, सामुदायिक या व्यक्तिगत पालन है?", "क्या उपवास, भोजन, चंद्रोदय या पूजा की पारिवारिक रीति है?", "क्या सामग्री-रहित, बिना उपवास का छोटा रूप चाहिए?"]
        safety = ["उपवास, भोजन-निषेध, चंद्रोदय तक खड़े रहने या चिकित्सा-फल का निर्देश न दें।", "महिला-मात्र या पुत्र-मात्र भाषा को सार्वभौमिक न करें।", "2 सितंबर हल षष्ठी को 28 अगस्त इस्कॉन बलराम पूर्णिमा या अस्वीकृत 16 सितंबर संकेत से न मिलाएं।"]
        variants = [("क्षेत्रीय नाम", "उत्तर भारतीय क्षेत्रीय नाम", "हल षष्ठी, हल छठ, ललही छठ और संबंधित नामों में घरेलू रीति अलग हो सकती है; पहले पूछें।"), ("बलराम पहचान", "बलराम के पर्व", "28 अगस्त की आधिकारिक इस्कॉन बलराम पूर्णिमा अलग संदर्भ है; 16 सितंबर का संकेत अस्वीकृत है।")]
        minimum = [("पुष्टि करें कि परिवार हल षष्ठी मानता है; 2 सितंबर की दिल्ली तिथि केवल इसी सीमित संदर्भ में लें।", "तिथि-निर्णय अन्य बलराम पहचानों को अलग रखता है।", ["devam-hala-shashthi-fixture"]), ("परिचित प्रार्थना, कथा या सेवा में प्रयुक्त शक्ति पर छोटे चिंतन से बलराम के हलधर रूप का स्मरण करें।", "इससे औपचारिक मंत्र गढ़े बिना स्रोत-सापेक्ष पहचान बनी रहती है।", ["drikpanchang-hala-shashthi-context"]), ("बच्चे, बुजुर्ग, देखभालकर्ता, किसान या परिवार के सदस्य के लिए एक व्यावहारिक सेवा करें और परिवार-कल्याण की प्रार्थना से समापन करें।", "इससे स्वास्थ्य या दीर्घायु की गारंटी दिए बिना पालन उपयोगी बनता है।", ["drikpanchang-hala-shashthi-context", "devam-hala-shashthi-safety-boundary"])]
        standard = [("सामग्री या भोजन तैयार करने से पहले बुजुर्ग से क्षेत्रीय नाम, कथा, देव-रूप और पारिवारिक क्रम पूछें।", "स्रोत व्यापक क्षेत्रीय भिन्नता बताता है।", ["drikpanchang-hala-shashthi-context", "devam-hala-shashthi-safety-boundary"]), ("परिवार की परिचित सुरक्षित प्रार्थना और प्रतीक ही अपनाएं; उपवास, भोजन, चंद्र-अर्घ्य, डाल या प्रतिमा-विधि मार्गदर्शक पर छोड़ें।", "विशिष्ट और कठिन अभ्यास सार्वभौमिक नहीं हैं।", ["drikpanchang-hala-shashthi-context", "devam-hala-shashthi-safety-boundary"]), ("परिवार-देखभाल या सेवा जोड़ें और फल की गारंटी के बिना पारिवारिक रीति से समापन करें।", "साथी सहभागिता देता है, चमत्कारी या चिकित्सा वादा नहीं।", ["devam-hala-shashthi-safety-boundary"])]
        elaborate = [("उपवास, भोजन-नियम, चंद्र-अर्घ्य, शिव-परिवार या छठी माता पूजा, डाल, मिट्टी या प्रतिमा-विधि के लिए मान्य परिवार या समुदाय-मार्गदर्शक लें।", "ये विवरण बदलते हैं और जीवित अधिकार मांगते हैं।", ["drikpanchang-hala-shashthi-context", "devam-hala-shashthi-safety-boundary"]), ("केवल पुष्ट रूप करें और असुरक्षित, बहिष्कारी या स्वास्थ्य के प्रतिकूल निर्देश रोक दें।", "विस्तृत सहभागिता में भी सुरक्षा और सीमितता बनी रहती है।", ["devam-hala-shashthi-safety-boundary"])]
        labels = ("बलराम-स्मरण और सेवा", "परिवार-पुष्ट हल षष्ठी", "मान्य सामुदायिक रूप")
        material = ("शांत स्थान और परिचित बलराम या परिवार-प्रार्थना", "मौन स्मरण और सेवा का काम करें; खरीद या उपवास आवश्यक नहीं")
        close = "परिवार और समुदाय के लिए मंगलकामना से समापन करें और प्रयुक्त सामग्री सुरक्षित ढंग से साफ करें।"
    refs = ["devam-hala-shashthi-fixture", "drikpanchang-hala-shashthi-context", "official-iskcon-balarama-separation", "devam-hala-shashthi-safety-boundary"]
    procedures = [procedure("hala-shashthi-north-india-content-v1", lang, "minimum", labels[0], 10, material[0], material[1], minimum, refs, close, "Bounded North India minimum participant form", "individual", "accessible_short"), procedure("hala-shashthi-north-india-content-v1", lang, "standard", labels[1], 25, material[0], material[1], standard, refs, close, "Family-confirmed Hala Shashthi form", "family_led", "traditional_household"), procedure("hala-shashthi-north-india-content-v1", lang, "elaborate", labels[2], 45, material[0], material[1], elaborate, refs, close, "Recognised family or community authority only", "teacher_led", "fuller_family_or_teacher_led")]
    return {"language_code": lang, "title": title, "short_answer": short, "significance": {"text": significance, "source_ids": ["drikpanchang-hala-shashthi-context", "official-iskcon-balarama-separation"], "scope_note": "A bounded Hala Shashthi participant lane; other Balarama observances remain separate."}, "origin_narratives": [{"narrative_id": f"hala-balarama-account-{lang}", "title": title, "summary": narrative, "tradition_scope": "Current North India practitioner account", "source_ids": ["drikpanchang-hala-shashthi-context"], "universal_origin_claimed": False}], "typical_practices": [{"practice_id": f"hala-regional-practice-{lang}", "population_scope": "North Indian households represented by the bounded practitioner source", "description": practice, "source_ids": ["drikpanchang-hala-shashthi-context", "devam-hala-shashthi-safety-boundary"], "instructional": False}], "procedures": procedures, "variants": [{"variant_id": f"hala-{i}-{lang}", "scope": scope, "difference": difference, "source_ids": ["devam-hala-shashthi-fixture", "official-iskcon-balarama-separation"], "separate_lane_required": True} for i, (unused, scope, difference) in enumerate(variants, 1)], "safety_and_boundaries": safety}


def build() -> dict[str, dict]:
    agastya_fixture = ROOT / "knowledge_packs/panchang/agastya-arghya-delhi-2026-resolved-v1.json"
    hala_fixture = ROOT / "knowledge_packs/panchang/hala-shashthi-delhi-2026-v1.json"
    agastya = {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1", "lane_id": "agastya-arghya-delhi-content-v1", "observance_slugs": ["agastya-arghya-delhi"],
        "applicability": {"region_codes": ["north-india", "west-india"], "tradition_codes": ["smarta-north-india", "smarta-west-india"], "settings": ["individual", "household", "family_led", "teacher_led"], "family_practice_overrides_generic_guidance": True, "material_context_questions": ["Does your family or sampradaya observe Agastya Arghya?", "Are you in New Delhi for the exact 2026 fixture, or do you need a local calendar?", "Do you know a family prayer, mantra, or fuller sequence?", "Can a small water offering be made safely without relying on star visibility?"]},
        "calendar": {"resolution_source_ids": ["devam-agastya-resolved-fixture", "drikpanchang-agastya-practice"], "timing_kind": "institutional_schedule", "location_aware": True, "tradition_aware": True, "decision_rule_id": "devam-delhi-practitioner-calendar-agastya-arghya-2026-v1", "live_schedule_required": True, "freshness_note": "Exact only for New Delhi on 4 September 2026, 04:58–06:00; use a trusted local calendar elsewhere."},
        "sources": [source("devam-agastya-resolved-fixture", "Devam bounded Agastya Arghya New Delhi 2026 fixture", "Devam", "Exact location-year provider-calendar decision, not a general algorithm", "derivative_allowed", artifact=sha256(agastya_fixture), coordinate={"path": "knowledge_packs/panchang/agastya-arghya-delhi-2026-resolved-v1.json"}), source("drikpanchang-agastya-practice", "Agastya Tara Uday and Arghya timings for New Delhi", "Drik Panchang", "Current practitioner date, displayed window, prayer and arghya context; not copied text or calculation authority", "citation_only", "https://www.drikpanchang.com/rituals/agastya-arghya/agastya-arghya-date-time.html?geoname-id=1261481&year=2026"), source("nirnayasindhu-agastya-context", "Nirnayasindhu Marathi edition, Agastyodaya-nirnaya", "Devam retained source vault", "Private historical evidence for varied Agastya-rise and arghya context; not modern instruction", "internal_only", artifact="a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b", coordinate={"pdf_pages": [159, 160], "printed_pages": ["142", "143"]}), source("devam-agastya-safety-boundary", "Devam Agastya Arghya scope and safety boundary", "Devam", "Editorial location, visibility, water, historical-social-rule and outcome boundary", "derivative_allowed")],
        "localized_content": [localized_agastya("en"), localized_agastya("hi")], "product_status": {"classification": "user_complete_lane", "completed_dimensions": DIMENSIONS, "open_gaps": [], "review_status": "internal_beta_reviewed"},
    }
    hala = {
        "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1", "lane_id": "hala-shashthi-north-india-content-v1", "observance_slugs": ["hala-shashthi-hal-chhath"],
        "applicability": {"region_codes": ["north-india"], "tradition_codes": ["smarta-north-india"], "settings": ["individual", "household", "community", "family_led", "teacher_led"], "family_practice_overrides_generic_guidance": True, "material_context_questions": ["Does your family call the day Hala Shashthi, Hal Chhath, Lalahi Chhath, or another name?", "Is this a household observance, community gathering, or personal remembrance?", "Does your family follow fasting, food, moonrise, or puja details that should override the minimum form?", "Do you need a non-fasting, material-free, short form?"]},
        "calendar": {"resolution_source_ids": ["devam-hala-shashthi-fixture", "drikpanchang-hala-shashthi-context", "official-iskcon-balarama-separation"], "timing_kind": "textual_rule", "location_aware": True, "tradition_aware": True, "decision_rule_id": "devam-delhi-practitioner-calendar-hala-shashthi-2026-v1", "live_schedule_required": True, "freshness_note": "Delhi/North India fixture: 2 September 2026. Ask the household for regional name and practice; do not use the rejected 16 September attribution."},
        "sources": [source("devam-hala-shashthi-fixture", "Devam bounded Hala Shashthi Delhi 2026 fixture", "Devam", "Exact identity/date decision and separation of conflicting Balarama candidates", "derivative_allowed", artifact=sha256(hala_fixture), coordinate={"path": "knowledge_packs/panchang/hala-shashthi-delhi-2026-v1.json"}), source("drikpanchang-hala-shashthi-context", "Hala Shashthi date and practice context for Delhi", "Drik Panchang", "Current practitioner identity, regional names and descriptive practices; not a universal vidhi", "citation_only", "https://www.drikpanchang.com/dashavatara/lord-balarama/hala-shashthi-date-time.html?geoname-id=1273294&year=2026"), source("official-iskcon-balarama-separation", "Official ISKCON Balarama Purnima 2026 references", "ISKCON Delhi and ISKCON Bangalore", "Conflict control establishing the separate 28 August ISKCON observance", "citation_only", "https://www.iskcondelhi.com/balaram-purnima/"), source("devam-hala-shashthi-safety-boundary", "Devam Hala Shashthi practice and identity boundary", "Devam", "Editorial fasting, diet, exclusion, moonrise, material, outcome and identity safety boundary", "derivative_allowed")],
        "localized_content": [localized_hala("en"), localized_hala("hi")], "product_status": {"classification": "user_complete_lane", "completed_dimensions": DIMENSIONS, "open_gaps": [], "review_status": "internal_beta_reviewed"},
    }
    return {"agastya-arghya-delhi-content-v1.json": agastya, "hala-shashthi-north-india-content-v1.json": hala}


def main() -> int:
    results = []
    for name, value in build().items():
        path = RITUAL_DIR / name
        rendered = json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n"
        path.write_text(rendered, encoding="utf-8", newline="\n")
        results.append({"path": path.relative_to(ROOT).as_posix(), "bytes": len(rendered.encode("utf-8")), "sha256": sha256(path)})
    print(json.dumps({"result": "PASS", "outputs": results}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

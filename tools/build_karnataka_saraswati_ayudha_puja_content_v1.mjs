import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "knowledge_packs/rituals/karnataka-saraswati-ayudha-puja-content-v1.json");
const ids = {
  date: "cgst-karnataka-holiday-list-2026-mahanavami",
  identity: "nic-karnataka-mahanavami-ayudhapooja",
  saraswati: "sringeri-sriyantra-navaratri-sarasvati",
  institution: "sringeri-2025-mahanavami-ayudha-vahana",
  gombe: "karnataka-tourism-gombe-habba",
  safety: "devam-karnataka-saraswati-ayudha-safety-boundary",
};
const all = Object.values(ids);

function procedure(language, tier, label, minutes, setting, materials, steps) {
  return {
    procedure_id: `karnataka-saraswati-ayudha-puja-content-v1-${language}-${tier}-v1`,
    tier,
    label,
    estimated_minutes: minutes,
    form: tier === "minimum" ? "accessible_short" : tier === "standard" ? "traditional_household" : "institutional_participation",
    setting,
    authority_scope: language === "en" ? "Bounded Karnataka participant guidance; formal ritual remains with family or institution" : "सीमित कर्नाटक सहभागी मार्गदर्शन; औपचारिक पूजा परिवार या संस्था के अनुसार",
    materials,
    steps,
    closing: {
      text: language === "en" ? "Close with gratitude, clear the space safely, and return books or tools to use only after the family or responsible operator says the observance is complete." : "कृतज्ञता के साथ समापन करें, स्थान सुरक्षित रूप से समेटें, और परिवार या जिम्मेदार संचालक के समापन कहने के बाद ही पुस्तकों या औजारों को उपयोग में लौटाएँ।",
      source_ids: [ids.safety],
      scope_note: language === "en" ? "Family practice and equipment safety control the exact close." : "सटीक समापन परिवार की परंपरा और उपकरण-सुरक्षा के अनुसार होगा।",
    },
    source_ids: all,
  };
}

function localized(language) {
  const en = language === "en";
  const title = en ? "Karnataka Saraswati and Ayudha Puja participation" : "कर्नाटक सरस्वती और आयुध पूजा सहभागिता";
  const shortAnswer = en
    ? "For the bounded Bengaluru/Karnataka 2026 lane, observe Saraswati Puja and Ayudha Puja on Tuesday, 20 October. First ask what your family actually keeps. A safe minimum is to clean the space, place familiar books, instruments, or small non-hazardous tools respectfully, remember Saraswati as the Goddess of learning, offer a known prayer or quiet gratitude, and close before returning anything to use. Do not touch live machinery, improvise mantras, or treat vehicle, homa, temple, and workplace rites as app-led household steps."
    : "सीमित बेंगलुरु/कर्नाटक 2026 संदर्भ में सरस्वती पूजा और आयुध पूजा मंगलवार, 20 अक्टूबर को रखें। पहले परिवार से पूछें कि आपकी परंपरा में क्या किया जाता है। सुरक्षित न्यूनतम रूप में स्थान साफ करें, परिचित पुस्तक, वाद्य या छोटा निष्क्रिय सुरक्षित औजार आदर से रखें, विद्या की देवी सरस्वती का स्मरण करें, परिचित प्रार्थना या मौन कृतज्ञता करें और समापन के बाद ही वस्तु को उपयोग में लौटाएँ। चालू मशीन को न छुएँ और ऐप से मंत्र, होम, वाहन, मंदिर या कार्यस्थल-विधि न गढ़ें।";
  const significance = en
    ? "Sringeri identifies the ninth day of Navaratri with Sarasvati Puja and learning. Karnataka's official public identity joins Mahanavami with Ayudha Puja; current Sringeri evidence also places Ayudha and Vahana Puja on Mahanavami. The supported user action is gratitude toward learning and the instruments of responsible work, not a universal liturgy or promised outcome."
    : "श्रृंगेरी नवमी को सरस्वती पूजा और विद्या से जोड़ता है। कर्नाटक की आधिकारिक पहचान महानवमी को आयुध पूजा के साथ रखती है; वर्तमान श्रृंगेरी विवरण में उसी दिन आयुध और वाहन पूजा भी है। उपयोगकर्ता के लिए समर्थित अर्थ विद्या, कौशल और जिम्मेदार कार्य के साधनों के प्रति कृतज्ञता है—एक सार्वभौमिक विधि या फल की गारंटी नहीं।";
  const minimum = procedure(language, "minimum", en ? "Quiet learning and gratitude" : "शांत विद्या-स्मरण और कृतज्ञता", 10, "individual", [
    { item: en ? "A quiet place and one familiar book, instrument, or safe inactive item" : "शांत स्थान और एक परिचित पुस्तक, वाद्य या सुरक्षित निष्क्रिय वस्तु", required: true, substitutions: [en ? "Use no object and reflect on learning or responsible work" : "बिना किसी वस्तु के विद्या या जिम्मेदार कार्य पर मनन करें"], source_ids: [ids.saraswati, ids.safety] },
  ], [
    { ordinal: 1, instruction: en ? "Confirm that your family observes this Karnataka Mahanavami lane on 20 October 2026; do not import another region's date or procedure." : "परिवार से पुष्टि करें कि 20 अक्टूबर 2026 का यह कर्नाटक महानवमी रूप आपकी परंपरा में है; दूसरे क्षेत्र की तिथि या विधि न मिलाएँ।", why: en ? "The date and identity are region-bounded." : "तिथि और पहचान क्षेत्र-सीमित हैं।", optional: false, source_ids: [ids.date, ids.identity] },
    { ordinal: 2, instruction: en ? "Place one familiar, non-hazardous book, instrument, or inactive item respectfully, or use no object." : "एक परिचित, सुरक्षित, निष्क्रिय पुस्तक, वाद्य या वस्तु आदर से रखें, या कोई वस्तु न रखें।", why: en ? "The action keeps the lane meaningful without creating an unsafe equipment ritual." : "इससे अर्थ बना रहता है और असुरक्षित उपकरण-विधि नहीं बनती।", optional: false, source_ids: [ids.saraswati, ids.safety] },
    { ordinal: 3, instruction: en ? "Use a prayer you already know, read briefly, or offer quiet gratitude for learning, skill, teachers, and responsible work." : "परिचित प्रार्थना करें, थोड़ा पढ़ें, या विद्या, कौशल, गुरु और जिम्मेदार काम के लिए मौन कृतज्ञता दें।", why: en ? "The source establishes Sarasvati and learning; the app does not invent a mantra." : "स्रोत सरस्वती और विद्या स्थापित करता है; ऐप मंत्र नहीं गढ़ता।", optional: false, source_ids: [ids.saraswati, ids.safety] },
  ]);
  const standard = procedure(language, "standard", en ? "Family books, instruments, and safe tools" : "परिवार की पुस्तकें, वाद्य और सुरक्षित औजार", 30, "household", [
    { item: en ? "Only familiar household books, instruments, or small safe inactive tools" : "केवल परिचित घरेलू पुस्तक, वाद्य या छोटा सुरक्षित निष्क्रिय औजार", required: true, substitutions: [en ? "Use the material-free minimum form" : "सामग्री-विहीन न्यूनतम रूप अपनाएँ"], source_ids: [ids.saraswati, ids.safety] },
    { item: en ? "Only family-known flowers, fruit, image, lamp, or reading" : "केवल परिवार-परिचित फूल, फल, चित्र, दीप या पाठ", required: false, substitutions: [en ? "Omit any unfamiliar, unsuitable, costly, or unsafe material" : "अनजान, अनुपयुक्त, महँगी या असुरक्षित सामग्री छोड़ दें"], source_ids: [ids.safety] },
  ], [
    { ordinal: 1, instruction: en ? "Ask an elder which Saraswati, Ayudha, or Gombe elements this household actually keeps and who leads them." : "किसी बड़े से पूछें कि परिवार सरस्वती, आयुध या गोम्बे में क्या रखता है और कौन नेतृत्व करता है।", why: en ? "The sources show related but distinct living forms." : "स्रोत संबंधित पर अलग जीवित रूप दिखाते हैं।", optional: false, source_ids: [ids.gombe, ids.safety] },
    { ordinal: 2, instruction: en ? "Clean only the household space and safe inactive items. Arrange familiar books, music or study materials, and small tools without handling machinery or vehicles." : "केवल स्थान और सुरक्षित निष्क्रिय वस्तुएँ साफ करें। मशीन या वाहन छुए बिना परिचित पुस्तक, संगीत/अध्ययन सामग्री और छोटे औजार रखें।", why: en ? "Safety authority remains with the operator, not the app." : "सुरक्षा-अधिकार संचालक के पास है, ऐप के पास नहीं।", optional: false, source_ids: [ids.identity, ids.safety] },
    { ordinal: 3, instruction: en ? "Use the family's known prayer or reading and offer gratitude for learning, teachers, crafts, and responsible work. Add optional familiar materials only when safe." : "परिवार की परिचित प्रार्थना या पाठ करें और विद्या, गुरु, शिल्प और जिम्मेदार कार्य के लिए कृतज्ञता दें। सुरक्षित हो तो ही परिचित सामग्री जोड़ें।", why: en ? "This connects the supported significance to a family-known practice." : "यह समर्थित अर्थ को परिवार की जीवित परंपरा से जोड़ता है।", optional: false, source_ids: [ids.saraswati, ids.safety] },
    { ordinal: 4, instruction: en ? "Keep any Gombe display as its own family-led practice and follow the household's tenth-day close." : "गोम्बे सज्जा हो तो उसे अलग परिवार-नेतृत्व वाली परंपरा रखें और दशमी का समापन परिवार के अनुसार करें।", why: en ? "Karnataka Tourism describes Gombe context but does not make it universal." : "कर्नाटक पर्यटन इसे संदर्भ के रूप में बताता है, सार्वभौमिक नियम नहीं।", optional: true, source_ids: [ids.gombe] },
  ]);
  const elaborate = procedure(language, "elaborate", en ? "Family-, teacher-, or institution-led participation" : "परिवार, शिक्षक या संस्था-नेतृत्व सहभागिता", 60, "family_led", [
    { item: en ? "Only materials, texts, and objects chosen by the responsible family, teacher, temple, school, or workplace lead" : "केवल जिम्मेदार परिवार, शिक्षक, मंदिर, स्कूल या कार्यस्थल-नेता द्वारा चुनी सामग्री, पाठ और वस्तुएँ", required: true, substitutions: [en ? "Use the standard household form instead of reconstructing unknown rites" : "अनजान विधि बनाने के बजाय मानक घरेलू रूप अपनाएँ"], source_ids: [ids.institution, ids.safety] },
  ], [
    { ordinal: 1, instruction: en ? "Let the responsible living authority define the exact Saraswati Puja, Ayudha Puja, Vahana Puja, homa, display, reading, or programme." : "सटीक सरस्वती पूजा, आयुध पूजा, वाहन पूजा, होम, सज्जा, पाठ या कार्यक्रम जिम्मेदार जीवित प्राधिकारी को तय करने दें।", why: en ? "The institutional sources are evidence of practice, not an app-reproducible liturgy." : "संस्थागत स्रोत अभ्यास का प्रमाण हैं, ऐप से दोहराने योग्य विधि नहीं।", optional: false, source_ids: [ids.institution, ids.safety] },
    { ordinal: 2, instruction: en ? "Follow organiser directions and all equipment, traffic, fire, food, accessibility, crowd, and child-safety rules; do not touch or restart equipment unless authorized and qualified." : "आयोजक के निर्देश और उपकरण, यातायात, अग्नि, भोजन, सुगमता, भीड़ और बाल-सुरक्षा नियम मानें; अनुमति और योग्यता के बिना उपकरण न छुएँ या शुरू करें।", why: en ? "Devotional intent does not override operational safety." : "भक्ति संचालन-सुरक्षा को समाप्त नहीं करती।", optional: false, source_ids: [ids.safety] },
    { ordinal: 3, instruction: en ? "Participate through the established prayer, reading, music, darshan, gratitude, or service available to you, then close as directed." : "उपलब्ध स्थापित प्रार्थना, पाठ, संगीत, दर्शन, कृतज्ञता या सेवा में भाग लें और निर्देशानुसार समापन करें।", why: en ? "This supports participation while preserving authority and variation." : "इससे प्रामाणिकता और विविधता बचाते हुए सहभागिता संभव होती है।", optional: false, source_ids: [ids.saraswati, ids.institution, ids.safety] },
  ]);
  return {
    language_code: language,
    title,
    short_answer: shortAnswer,
    significance: { text: significance, source_ids: [ids.identity, ids.saraswati, ids.institution], scope_note: en ? "Institutional worship, household customs, Gombe Habba, workplace practice, and other South Indian forms remain attributable and distinct." : "संस्थागत पूजा, घरेलू परंपरा, गोम्बे हब्बा, कार्यस्थल और अन्य दक्षिण भारतीय रूप अलग और स्रोत-सम्बद्ध रहते हैं।" },
    origin_narratives: [
      { narrative_id: "sharada-sarasvati-learning-context", title: en ? "Sarasvati on the ninth day" : "नवमी और सरस्वती", summary: en ? "Sringeri describes the ninth day as especially devoted to Sarasvati, Goddess of learning. Devam preserves that attribution without claiming one universal theology or household sequence." : "श्रृंगेरी नवमी को विद्या की देवी सरस्वती के लिए विशेष मानता है। देवम इसे स्रोत-सम्बद्ध परंपरा के रूप में रखता है, सार्वभौमिक घरेलू क्रम के रूप में नहीं।", tradition_scope: en ? "Sringeri Sharada tradition used for the bounded Karnataka lane" : "सीमित कर्नाटक मार्ग के लिए श्रृंगेरी शारदा परंपरा", source_ids: [ids.saraswati], universal_origin_claimed: false },
      { narrative_id: "karnataka-mahanavami-ayudha-context", title: en ? "Mahanavami and Ayudha context" : "महानवमी और आयुध संदर्भ", summary: en ? "Official Karnataka sources join Mahanavami and Ayudha Puja; current Sringeri evidence records Ayudha and Vahana Puja on Mahanavami. This is living context, not a complete household, vehicle, or workplace ritual." : "आधिकारिक कर्नाटक स्रोत महानवमी और आयुध पूजा को साथ रखते हैं; श्रृंगेरी का वर्तमान विवरण महानवमी पर आयुध और वाहन पूजा दर्ज करता है। यह जीवित संदर्भ है, पूर्ण घरेलू, वाहन या कार्यस्थल-विधि नहीं।", tradition_scope: en ? "Karnataka public identity and Sringeri institutional observation" : "कर्नाटक सार्वजनिक पहचान और श्रृंगेरी संस्थागत आयोजन", source_ids: [ids.date, ids.identity, ids.institution], universal_origin_claimed: false },
    ],
    typical_practices: [
      { practice_id: "learning-and-tool-gratitude", population_scope: en ? "Karnataka household or participant contexts represented by the sources" : "वर्तमान स्रोतों में दर्शाए कर्नाटक घरेलू या सहभागी संदर्भ", description: en ? "The app supports respectful attention to learning materials and only safe, inactive, familiar tools; it does not reproduce formal worship or operational-equipment rites." : "ऐप विद्या-सामग्री और केवल सुरक्षित, बंद, परिचित औजारों के प्रति सम्मान में सहायता करता है; औपचारिक पूजा या संचालन-विधि नहीं देता।", source_ids: [ids.saraswati, ids.identity, ids.institution, ids.safety], instructional: false },
      { practice_id: "optional-gombe-household-context", population_scope: en ? "Karnataka homes that already keep Gombe Habba" : "वे कर्नाटक परिवार जो पहले से गोम्बे हब्बा रखते हैं", description: en ? "Karnataka Tourism describes doll displays, home visits and sweets, Saraswati Puja on the ninth day, and packing the dolls on the tenth. Gombe Habba is optional." : "कर्नाटक पर्यटन गुड़िया-सज्जा, घरों में मिलना, मिठाई, नवमी पर सरस्वती पूजा और दशमी पर गुड़िया समेटना बताता है। यह वैकल्पिक है।", source_ids: [ids.gombe], instructional: false },
    ],
    variants: [
      { variant_id: "household-learning-lane", scope: en ? "Household and individual" : "घर और व्यक्ति", difference: en ? "Books, music, study, a known prayer, and quiet gratitude can form a safe household lane; exact placement, offerings, and close follow family practice." : "पुस्तक, संगीत, अध्ययन, परिचित प्रार्थना और मौन कृतज्ञता सुरक्षित घरेलू रूप हो सकते हैं; सटीक क्रम परिवार तय करता है।", source_ids: [ids.saraswati, ids.safety], separate_lane_required: false },
      { variant_id: "workplace-vehicle-institution-lanes", scope: en ? "Workplace, vehicle, temple, math, and institution" : "कार्यस्थल, वाहन, मंदिर, मठ और संस्था", difference: en ? "Machinery, vehicles, homa, temple worship, and institutional programmes require the responsible operator or living authority and are not reproduced as household steps." : "मशीन, वाहन, होम, मंदिर और संस्थागत कार्यक्रम जिम्मेदार संचालक या जीवित प्राधिकारी के अधीन हैं; इन्हें घरेलू कदमों की तरह नहीं दिया जाता।", source_ids: [ids.institution, ids.safety], separate_lane_required: true },
      { variant_id: "gombe-habba-optional", scope: en ? "Gombe/Bombe households" : "गोम्बे/बोम्बे परिवार", difference: en ? "The doll display is a related Karnataka Navaratri practice, not a requirement for every Saraswati or Ayudha observance." : "गुड़िया-सज्जा संबंधित कर्नाटक नवरात्रि परंपरा है, हर सरस्वती या आयुध पूजा की अनिवार्यता नहीं।", source_ids: [ids.gombe], separate_lane_required: true },
      { variant_id: "other-regions-remain-separate", scope: en ? "Other South Indian regions and traditions" : "अन्य दक्षिण भारतीय क्षेत्र और परंपराएँ", difference: en ? "Shared festival names do not make dates, tools, offerings, liturgy, or household customs identical." : "समान नाम से तिथि, औजार, सामग्री, विधि या घरेलू परंपरा समान नहीं हो जाती।", source_ids: [ids.safety], separate_lane_required: true },
    ],
    safety_and_boundaries: en ? [
      "Never clean, decorate, touch, energize, start, stop, isolate, or restart live machinery, vehicles, weapons, electrical equipment, or hazardous tools for devotional purposes; the responsible operator controls them.",
      "Use only familiar, non-hazardous books, instruments, or small tools in a household arrangement. Do not block access to work, emergency, medical, accessibility, or school materials.",
      "Formal mantras, consecration, homa, Vahana Puja, temple rites, workplace shutdowns, and live schedules remain with the responsible family, teacher, priest, institution, or operator.",
      "No doll display, purchase, fast, food, flame, flower, vehicle, tool, book, special clothing, or promised learning or prosperity outcome is required.",
    ] : [
      "भक्ति के लिए चालू मशीन, वाहन, हथियार, बिजली-उपकरण या खतरनाक औजार को साफ, सजाएँ, छुएँ, चालू-बंद या पुनः शुरू न करें; जिम्मेदार संचालक ही नियंत्रण करता है।",
      "घर में केवल परिचित, सुरक्षित, निष्क्रिय पुस्तक, वाद्य या छोटा औजार रखें। काम, आपात, चिकित्सा, सुगमता या स्कूल सामग्री की पहुँच न रोकें।",
      "औपचारिक मंत्र, प्रतिष्ठा, होम, वाहन पूजा, मंदिर-विधि, कार्यस्थल बंद करना और लाइव समय परिवार, शिक्षक, पुरोहित, संस्था या संचालक के अधीन हैं।",
      "गुड़िया-सज्जा, खरीद, व्रत, भोजन, दीप, फूल, वाहन, औजार, पुस्तक, विशेष वस्त्र या विद्या/समृद्धि का फल अनिवार्य नहीं है।",
    ],
    procedures: [minimum, standard, elaborate],
  };
}

const sources = [
  [ids.date, "Bilingual Holiday List 2026", "CGST Karnataka", "https://gstkarnataka.gov.in/media/pdf/notifications/public-notices/2025-12-31_Holiday_List_for_the_year_2026_20251231_120602.pdf", "Official Karnataka-located 2026 Dussehra/Navami civil-date evidence; not ritual authority", 324154, "1c97d1934109b0229d6c1585d51f7736423dd975dfa92027e779bab4a523834a", null],
  [ids.identity, "Mahanavami, Ayudhapooja", "NIC Karnataka", "https://karnataka.nic.in/en/holiday/mahanavami-ayudhapooja/", "Official Karnataka combined identity; not a date-complete or procedural source", 88292, "3dd0a7054170465847edf5322f00d697a6f3bd0822f83cabb3a0c8668cbc6d11", true],
  [ids.saraswati, "Sriyantra — Navaratri", "Sringeri Sharada Peetham", "https://www.sringeri.info/sriyantra/", "Official tradition evidence for ninth-day Sarasvati Puja and learning; not household vidhi", 56235, "2302d71b9eb99cb4839fda94a8f439760b17d3f2fd2297d63ce0d68ccac71b16", true],
  [ids.institution, "Vishwavasu Samvatsara Sharada Sharan Navaratri Celebrations", "Sringeri Sharada Peetham", "https://www.sringeri.net/events/vishwavasu-samvatsara-sharada-sharan-navaratri-celebrations", "Official institutional Mahanavami, Ayudha and Vahana context; not household or workplace instruction", 177565, "d18b1410fc333ec2cf028e3a430965db868c7beff84c18700b8b65457ede5fac", true],
  [ids.gombe, "Gombe Habba", "Karnataka Tourism", "https://karnatakatourism.org/en/experiences/gombe-habba/", "Official regional household context and ninth-day Saraswati identity; not a universal requirement", 59467, "c1934e58ab6c1071a8345ea74e2876482abd90b3d609b221ca157887369d14ba", true],
].map(([source_id, title, publisher, url, source_role, response_bytes, response_sha256, strict_utf8]) => ({ source_id, title, publisher, url, source_role, rights_lane: "citation_only", artifact_sha256: null, citation_coordinates: null, observed_fetch: strict_utf8 === null ? null : { observed_at: "2026-08-07", status: 200, final_url: url, response_bytes, response_sha256, strict_utf8 } }));
sources.push({ source_id: ids.safety, title: "Devam Karnataka Saraswati/Ayudha safety and scope boundary", publisher: "Devam", url: null, source_role: "Editorial safety and authority boundary; not scripture or ritual authority", rights_lane: "internal_only", artifact_sha256: null, citation_coordinates: null, observed_fetch: null });

const pack = {
  contract: "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1",
  lane_id: "karnataka-saraswati-ayudha-puja-content-v1",
  observance_slugs: ["karnataka-saraswati-ayudha-puja"],
  applicability: {
    region_codes: ["south-india"], tradition_codes: ["smarta-south-india"], settings: ["individual", "household", "family_led", "community"],
    context_pairs: [{ region_code: "south-india", tradition_code: "smarta-south-india" }], family_practice_overrides_generic_guidance: true,
    material_context_questions: ["Are you following a Bengaluru, Mysuru, coastal Karnataka, Sringeri-aligned, workplace, school, or another family form?", "Is your need Saraswati learning practice, safe household Ayudha gratitude, Gombe Habba, or participation in an established institution?", "Which books, instruments, tools, image, prayer, reading, flowers, food, or closing practice is already familiar to the family?", "Do you need a material-free, flame-free, food-free, spend-free, child-safe, mobility-safe, or short form?"],
  },
  calendar: { timing_kind: "mixed", location_aware: true, tradition_aware: true, live_schedule_required: true, decision_rule_id: "devam-karnataka-mahanavami-ayudha-puja-official-2026-v1", freshness_note: "The bounded Bengaluru/Karnataka 2026 lane resolves Tuesday, 20 October. Recheck the family, school, workplace, temple, or math for its exact procedure and live timing.", resolution_source_ids: [ids.date, ids.identity, ids.saraswati, ids.institution] },
  sources,
  localized_content: [localized("en"), localized("hi")],
  product_status: { classification: "user_complete_lane", completed_dimensions: { applicability: true, significance: true, origin_narratives: true, typical_practice: true, timing: true, actionable_vidhi: true, materials_and_substitutions: true, variants: true, evidence: true }, open_gaps: [], review_status: "internal_beta_reviewed" },
};

writeFileSync(output, `${JSON.stringify(pack, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
console.log(output);

import type { GroundedSarthiAnswer, SarthiRequest } from "../sarthi/contracts";
import type { LibrarySearchResult } from "./library-search";

type Language = "en" | "hi";

type OfficialSource = {
  id: string;
  title: string;
  url: string;
};

type WorldRecord = {
  slug: string;
  title: Record<Language, string>;
  statement: Record<Language, string>;
  aliases: string[];
  source: OfficialSource;
  boundary: Record<Language, string>;
};

const UNESCO_HAMPI: OfficialSource = {
  id: "unesco-whc-hampi-241",
  title: "Group of Monuments at Hampi",
  url: "https://whc.unesco.org/en/list/241",
};

const UNESCO_VIRUPAKSHA: OfficialSource = {
  id: "unesco-asi-virupaksha-bazaar-218299",
  title: "Integrated Management Plan for Virupaksha Bazaar",
  url: "https://whc.unesco.org/document/218299",
};

const KARNATAKA_ANJANADRI: OfficialSource = {
  id: "karnataka-tourism-anjanadri",
  title: "Anjanadri Hill",
  url: "https://karnatakatourism.org/en/attractions/anjanadri-hill",
};

const KARNATAKA_ANEGUNDI: OfficialSource = {
  id: "karnataka-tourism-anegundi",
  title: "Anegundi",
  url: "https://karnatakatourism.org/en/destinations/anegundi",
};

const SOURCE_BOUNDARY = {
  en: "Citation-only Devam synthesis from an official UNESCO or Karnataka Tourism page observed 2026-08-09. The page is not retained or quoted as a Devam source object. Epic narrative, living belief, archaeology, documented history, present worship, and visitor information remain separate evidence lanes.",
  hi: "यह 9 अगस्त 2026 को देखे गए आधिकारिक UNESCO या Karnataka Tourism पृष्ठ पर आधारित केवल-संदर्भ Devam संश्लेषण है। पृष्ठ को Devam स्रोत-वस्तु के रूप में न तो रखा गया है, न उद्धृत किया गया है। महाकाव्य-कथा, जीवित आस्था, पुरातत्त्व, प्रमाणित इतिहास, वर्तमान उपासना और यात्रा-सूचना अलग प्रमाण-स्तर हैं।",
} as const;

const records: WorldRecord[] = [
  {
    slug: "kishkindha-living-landscape",
    title: { en: "Kishkindha as a living landscape", hi: "जीवित भू-दृश्य के रूप में किष्किन्धा" },
    statement: { en: "Around Anegundi and Anjanadri, communities and official tourism accounts preserve a living association with the Ramayana's Kishkindha. Devam opens that association as a place-world while keeping it distinct from the epic's narrative geography and from historical proof.", hi: "आनेगुंडी और अंजनाद्रि के आसपास जीवित परंपराएँ इस भू-दृश्य को रामायण की किष्किन्धा से जोड़ती हैं। Devam इस संबंध को एक स्थान-जगत के रूप में खोलता है, पर इसे महाकाव्य की कथा-भूगोल या ऐतिहासिक प्रमाण नहीं मानता।" },
    aliases: ["kishkindha living landscape", "kishkinda landscape", "किष्किन्धा भू-दृश्य", "जीवित किष्किन्धा"],
    source: KARNATAKA_ANEGUNDI,
    boundary: SOURCE_BOUNDARY,
  },
  {
    slug: "anegundi",
    title: { en: "Anegundi", hi: "आनेगुंडी" },
    statement: { en: "Anegundi is a living settlement across the Tungabhadra from Hampi. Karnataka Tourism presents both its Ramayana associations and its historical place in the early Vijayanagara story; Devam keeps those two routes visibly separate.", hi: "आनेगुंडी तुंगभद्रा के पार हम्पी के सामने एक जीवित बस्ती है। Karnataka Tourism इसके रामायण-संबंध और आरंभिक विजयनगर इतिहास—दोनों को बताता है; Devam इन दोनों मार्गों को स्पष्ट रूप से अलग रखता है।" },
    aliases: ["anegundi", "anegondi", "आनेगुंडी", "अनेगुंडी"],
    source: KARNATAKA_ANEGUNDI,
    boundary: SOURCE_BOUNDARY,
  },
  {
    slug: "anjanadri-hill-tradition",
    title: { en: "Anjanadri Hill tradition", hi: "अंजनाद्रि पहाड़ी की परंपरा" },
    statement: { en: "Anjanadri is presented by Karnataka Tourism as a place believed to be Hanuman's birthplace within the living Kishkindha landscape. Devam labels this as a living belief and pilgrimage association, not a settled historical or archaeological conclusion.", hi: "Karnataka Tourism अंजनाद्रि को जीवित किष्किन्धा भू-दृश्य में हनुमान की जन्मस्थली मानी जाने वाली जगह बताता है। Devam इसे जीवित आस्था और तीर्थ-संबंध के रूप में लेबल करता है, न कि निश्चित ऐतिहासिक या पुरातात्त्विक निष्कर्ष के रूप में।" },
    aliases: ["anjanadri", "anjaneya hill", "hanuman birthplace belief", "अंजनाद्रि", "हनुमान जन्मस्थली परंपरा"],
    source: KARNATAKA_ANJANADRI,
    boundary: SOURCE_BOUNDARY,
  },
  {
    slug: "tungabhadra-landscape",
    title: { en: "The Tungabhadra landscape", hi: "तुंगभद्रा भू-दृश्य" },
    statement: { en: "The Tungabhadra River and the surrounding boulder-strewn basin connect Anegundi, Hampi, living sacred places, agricultural land, and the monumental capital. It is a geographic thread, not proof that every epic place-name maps literally onto the present terrain.", hi: "तुंगभद्रा नदी और उसके शैल-समृद्ध बेसिन से आनेगुंडी, हम्पी, जीवित पवित्र स्थल, कृषि-भूमि और विशाल राजधानी-जगत जुड़ते हैं। यह भौगोलिक मार्ग है, हर महाकाव्य स्थान-नाम का आज के भूगोल से शाब्दिक प्रमाण नहीं।" },
    aliases: ["tungabhadra landscape", "tungabhadra river hampi", "तुंगभद्रा", "तुंगभद्रा हम्पी"],
    source: UNESCO_HAMPI,
    boundary: SOURCE_BOUNDARY,
  },
  {
    slug: "hampi-world-heritage",
    title: { en: "Hampi's monumental world", hi: "हम्पी का स्मारकीय जगत" },
    statement: { en: "UNESCO describes Hampi as the remains of the Vijayanagara capital in the Tungabhadra basin, with more than 1,600 surviving elements across sacred, royal, civic, defensive, and water landscapes. Devam treats it as a historical and archaeological doorway, not as the same entity as narrative Kishkindha.", hi: "UNESCO हम्पी को तुंगभद्रा बेसिन में विजयनगर राजधानी के अवशेषों के रूप में वर्णित करता है, जहाँ पवित्र, राजकीय, नागरिक, रक्षात्मक और जल-परिदृश्यों में 1,600 से अधिक अवयव बचे हैं। Devam इसे ऐतिहासिक-पुरातात्त्विक द्वार मानता है, कथा-किष्किन्धा का वही रूप नहीं।" },
    aliases: ["hampi world heritage", "hampi monuments", "हम्पी विश्व धरोहर", "हम्पी स्मारक"],
    source: UNESCO_HAMPI,
    boundary: SOURCE_BOUNDARY,
  },
  {
    slug: "vijayanagara-capital",
    title: { en: "The Vijayanagara capital", hi: "विजयनगर की राजधानी" },
    statement: { en: "Hampi was the monumental capital of Vijayanagara, organized through sacred, royal, urban, defensive, and hydraulic systems. Exploring the capital opens routes into temples, markets, water, courtly power, art, and the empire without turning one monument into the whole city.", hi: "हम्पी विजयनगर की विशाल राजधानी थी, जिसमें पवित्र, राजकीय, शहरी, रक्षात्मक और जल-प्रणालियाँ जुड़ी थीं। राजधानी से मंदिर, बाजार, जल, दरबारी सत्ता, कला और साम्राज्य के मार्ग खुलते हैं; कोई एक स्मारक पूरे नगर का प्रतिनिधि नहीं।" },
    aliases: ["vijayanagara capital", "hampi capital city", "विजयनगर राजधानी", "हम्पी राजधानी"],
    source: UNESCO_HAMPI,
    boundary: SOURCE_BOUNDARY,
  },
  {
    slug: "vijayanagara-empire",
    title: { en: "Vijayanagara Empire", hi: "विजयनगर साम्राज्य" },
    statement: { en: "The Vijayanagara Empire shaped a major South Indian political and cultural world between the fourteenth and sixteenth centuries. This node is a historical polity route into rulers, regions, institutions, trade, architecture, conflict, and legacy—not an epic kingdom.", hi: "चौदहवीं से सोलहवीं शताब्दी के बीच विजयनगर साम्राज्य ने दक्षिण भारत का एक प्रमुख राजनीतिक और सांस्कृतिक जगत गढ़ा। यह शासकों, क्षेत्रों, संस्थाओं, व्यापार, स्थापत्य, संघर्ष और विरासत का ऐतिहासिक मार्ग है—महाकाव्य का राज्य नहीं।" },
    aliases: ["vijayanagara empire", "vijayanagar empire", "विजयनगर साम्राज्य"],
    source: UNESCO_HAMPI,
    boundary: SOURCE_BOUNDARY,
  },
  {
    slug: "krishna-deva-raya",
    title: { en: "Krishna Deva Raya", hi: "कृष्णदेवराय" },
    statement: { en: "UNESCO associates Hampi's sixteenth-century apogee with Krishna Deva Raya. Devam opens him as a historically attested ruler connected to court, military power, patronage, literature, temples, administration, and a contested imperial history—not as a mythic king.", hi: "UNESCO हम्पी के सोलहवीं शताब्दी के उत्कर्ष को कृष्णदेवराय से जोड़ता है। Devam उन्हें दरबार, सैन्य शक्ति, संरक्षण, साहित्य, मंदिर, प्रशासन और विवादित साम्राज्य-इतिहास से जुड़े प्रमाणित ऐतिहासिक शासक के रूप में खोलता है—पौराणिक राजा के रूप में नहीं।" },
    aliases: ["krishna deva raya", "krishnadevaraya", "कृष्णदेवराय"],
    source: UNESCO_HAMPI,
    boundary: SOURCE_BOUNDARY,
  },
  {
    slug: "virupaksha-temple-hampi",
    title: { en: "Virupaksha Temple", hi: "विरूपाक्ष मंदिर" },
    statement: { en: "Virupaksha Temple is both part of Hampi's monumental landscape and a continuing pilgrimage and worship centre. The official conservation plan links Virupaksha with Shiva and the local Pampa tradition while preserving the living temple's distinct authority.", hi: "विरूपाक्ष मंदिर हम्पी के स्मारकीय भू-दृश्य का हिस्सा भी है और निरंतर उपासना-तीर्थ का केंद्र भी। आधिकारिक संरक्षण योजना विरूपाक्ष को शिव और स्थानीय पम्पा परंपरा से जोड़ती है, जबकि जीवित मंदिर की अलग प्रामाणिकता बनी रहती है।" },
    aliases: ["virupaksha temple hampi", "virupaksha bazaar", "विरूपाक्ष मंदिर", "हम्पी विरूपाक्ष"],
    source: UNESCO_VIRUPAKSHA,
    boundary: SOURCE_BOUNDARY,
  },
  {
    slug: "vitthala-temple-complex",
    title: { en: "Vitthala Temple complex", hi: "विट्ठल मंदिर परिसर" },
    statement: { en: "The Vitthala complex is one of Hampi's major monumental ensembles and a route into Vijayanagara architecture, ritual space, sculpture, music-associated columns, processional space, and conservation. It is not a complete account of any living Vaishnava tradition.", hi: "विट्ठल परिसर हम्पी के प्रमुख स्मारकीय समूहों में से एक है और विजयनगर स्थापत्य, अनुष्ठानिक स्थान, मूर्तिकला, संगीत-संबद्ध स्तंभ, शोभायात्रा-स्थान और संरक्षण की ओर मार्ग खोलता है। यह किसी जीवित वैष्णव परंपरा का पूर्ण विवरण नहीं।" },
    aliases: ["vitthala temple hampi", "vittala temple complex", "विट्ठल मंदिर हम्पी"],
    source: UNESCO_HAMPI,
    boundary: SOURCE_BOUNDARY,
  },
  {
    slug: "stone-chariot-hampi",
    title: { en: "The stone chariot", hi: "हम्पी का पत्थर रथ" },
    statement: { en: "The stone chariot is a celebrated architectural object within the Vitthala complex. Devam uses it as an art-and-architecture encounter inside a larger temple and urban system, not as a free-standing summary of Hampi or a ritual vehicle.", hi: "पत्थर का रथ विट्ठल परिसर के भीतर एक प्रसिद्ध स्थापत्य वस्तु है। Devam इसे बड़े मंदिर और शहरी तंत्र के अंदर कला-स्थापत्य अनुभव के रूप में रखता है, हम्पी का स्वतंत्र सार या अनुष्ठानिक वाहन नहीं।" },
    aliases: ["hampi stone chariot", "stone chariot vitthala", "हम्पी पत्थर रथ", "पत्थर का रथ"],
    source: UNESCO_HAMPI,
    boundary: SOURCE_BOUNDARY,
  },
  {
    slug: "vijayanagara-architecture",
    title: { en: "Vijayanagara architecture", hi: "विजयनगर स्थापत्य" },
    statement: { en: "Hampi's architecture joins temples, bazaars, gateways, halls, water systems, royal enclosures, fortifications, sculpture, and landscape planning. This is an art-historical constellation whose individual buildings, dates, patrons, functions, and conservation histories still need separate evidence.", hi: "हम्पी का स्थापत्य मंदिरों, बाजारों, द्वारों, मंडपों, जल-प्रणालियों, राजकीय परिसरों, किलेबंदी, मूर्तिकला और भू-दृश्य नियोजन को जोड़ता है। यह कला-ऐतिहासिक नक्षत्र है; हर भवन, तिथि, संरक्षक, उपयोग और संरक्षण-इतिहास को अलग प्रमाण चाहिए।" },
    aliases: ["vijayanagara architecture", "hampi architecture", "विजयनगर स्थापत्य", "हम्पी स्थापत्य"],
    source: UNESCO_HAMPI,
    boundary: SOURCE_BOUNDARY,
  },
  {
    slug: "talikota-1565",
    title: { en: "The 1565 rupture", hi: "1565 का ऐतिहासिक विच्छेद" },
    statement: { en: "UNESCO marks 1565 and the Battle of Talikota as the decisive rupture after which the capital was conquered, pillaged, and abandoned. Devam treats this as a historical process and archaeological horizon, not a single-cause explanation of the empire's full decline or later regional histories.", hi: "UNESCO 1565 और तालिकोटा के युद्ध को वह निर्णायक विच्छेद बताता है जिसके बाद राजधानी जीती, लूटी और छोड़ी गई। Devam इसे ऐतिहासिक प्रक्रिया और पुरातात्त्विक क्षितिज मानता है, साम्राज्य के पूरे पतन या बाद के क्षेत्रीय इतिहासों का एकमात्र कारण नहीं।" },
    aliases: ["battle of talikota 1565", "hampi 1565", "तालिकोटा 1565", "1565 हम्पी"],
    source: UNESCO_HAMPI,
    boundary: SOURCE_BOUNDARY,
  },
];

function citation(record: WorldRecord) {
  return {
    passageId: `citation-only:${record.source.id}:${record.slug}`,
    sourceObjectId: `citation-only:${record.source.id}`,
    sourceOrdinal: 0,
    workTitle: record.source.title,
    editionTitle: "Official page observed 2026-08-09",
    locator: { url: record.source.url, observedAt: "2026-08-09", sourceTextReturned: false },
    rightsLane: "citation_only" as const,
  };
}

function normalize(value: string) {
  return value.toLocaleLowerCase("en-IN").replace(/[^\p{L}\p{M}\p{N}\s-]/gu, " ").replace(/\s+/g, " ").trim();
}

function matchesAlias(query: string, alias: string) {
  const normalizedAlias = normalize(alias);
  return query.includes(normalizedAlias) || normalizedAlias.includes(query) || normalizedAlias.split(" ").every((token) => query.includes(token));
}

function requestedLanguage(languageCode: string | undefined, value: string): Language {
  return languageCode?.toLowerCase().startsWith("hi") || /[\u0900-\u097f]/.test(value) ? "hi" : "en";
}

function toResult(record: WorldRecord, language: Language): LibrarySearchResult {
  return {
    id: `hampi-kishkindha:${record.slug}`,
    title: record.title[language],
    statement: record.statement[language],
    languageCode: language,
    claimKind: "citation_only_connected_place_history_context",
    citations: [citation(record)],
    sourceBoundary: record.boundary[language],
  };
}

export function searchHampiKishkindhaWorld(query: string, languageCode?: string): LibrarySearchResult[] {
  const normalized = normalize(query);
  if (normalized.length < 3) return [];
  const language = requestedLanguage(languageCode, query);
  return records.filter((record) => record.aliases.some((alias) => matchesAlias(normalized, alias))).map((record) => toResult(record, language));
}

export function answerHampiKishkindhaWorld(request: SarthiRequest): GroundedSarthiAnswer | null {
  const query = normalize(request.message);
  const contextualReference = /\b(this|here|it|looking|simply|relevant)\b/.test(query) || /(यह|इसके|यहाँ|बताओ|समझाओ)/.test(query);
  const contextualRecord = records.find((record) => record.slug === request.context?.atlasNodeSlug);
  const explicitRecord = records.find((record) => record.aliases.some((alias) => matchesAlias(query, alias)));
  const record = contextualRecord && contextualReference ? contextualRecord : explicitRecord;
  if (!record) return null;
  const language = requestedLanguage(request.context?.languageCode, request.message);
  return {
    ok: true,
    mode: "deterministic_source_bounded_preview",
    answer: record.statement[language],
    citations: [citation(record)],
    alternativesAvailable: true,
    sourceBoundary: record.boundary[language],
  };
}

export const HAMPI_KISHKINDHA_WORLD_FIXITY = {
  nodeCount: records.length,
  sourceIds: [...new Set(records.map((record) => record.source.id))],
  citationOnly: true,
  languages: ["en", "hi"],
} as const;

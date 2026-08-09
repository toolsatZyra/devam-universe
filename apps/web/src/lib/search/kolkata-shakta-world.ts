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
};

const INCREDIBLE_INDIA_KALI_PUJA: OfficialSource = {
  id: "incredible-india-kali-puja",
  title: "Kali Puja",
  url: "https://www.incredibleindia.gov.in/en/festivals-and-events/kali-puja",
};

const WEST_BENGAL_TOURISM_KALIGHAT: OfficialSource = {
  id: "west-bengal-tourism-kalighat",
  title: "Kalighat Kali Temple",
  url: "https://www.wbtourism.gov.in/Heritage%20Tourism/details?id=63d800a0e4bbd858c20633ab&template_id=1",
};

const INCREDIBLE_INDIA_KALIGHAT_ART: OfficialSource = {
  id: "incredible-india-kalighat-art",
  title: "Kolkata arts and crafts",
  url: "https://www.prod.incredibleindia.gov.in/content/incredible-india-v2/en/destinations/kolkata/arts-and-crafts.html",
};

const DAKSHINESWAR_TEMPLE: OfficialSource = {
  id: "dakshineswar-temple-official-history",
  title: "Dakshineswar Kali Temple",
  url: "https://dakshineswarkalitemple.org/",
};

const RAMAKRISHNA_MATH_DAKSHINESWAR: OfficialSource = {
  id: "ramakrishna-math-dakshineswar",
  title: "Sri Ramakrishna at Dakshineswar",
  url: "https://dakshineshwar.rkmm.org/sri-ramakrishna",
};

const SOURCE_BOUNDARY = {
  en: "Citation-only Devam synthesis from an official tourism, temple, or Ramakrishna Math page observed 2026-08-09. The page is not retained or quoted as a Devam source object. Living-temple authority, institutional belief, documented history, festival context, artwork and maker history, ritual guidance, and current visitor information remain separate evidence lanes.",
  hi: "यह 9 अगस्त 2026 को देखे गए आधिकारिक पर्यटन, मंदिर या रामकृष्ण मठ पृष्ठ पर आधारित केवल-संदर्भ Devam संश्लेषण है। पृष्ठ को Devam स्रोत-वस्तु के रूप में न रखा गया है, न उद्धृत किया गया है। जीवित मंदिर की प्रामाणिकता, संस्थागत आस्था, प्रमाणित इतिहास, उत्सव-संदर्भ, कला और निर्माता-इतिहास, अनुष्ठान-मार्गदर्शन तथा वर्तमान यात्रा-सूचना अलग प्रमाण-स्तर हैं।",
} as const;

const records: WorldRecord[] = [
  {
    slug: "kalighat-kali-temple",
    title: { en: "Kalighat Kali Temple", hi: "कालीघाट काली मंदिर" },
    statement: {
      en: "Kalighat opens a living Kolkata temple world connected to Kali Puja, Durga Puja, a distinct temple form, place history, and the neighboring Kalighat painting tradition. Each route remains separately sourced; the temple is not a shortcut to every Kali or Shakta tradition.",
      hi: "कालीघाट कोलकाता का एक जीवित मंदिर-जगत खोलता है, जो काली पूजा, दुर्गा पूजा, मंदिर के विशिष्ट रूप, स्थान-इतिहास और पास की कालीघाट चित्रकला परंपरा से जुड़ता है। हर मार्ग का प्रमाण अलग है; यह मंदिर हर काली या शाक्त परंपरा का एकमात्र प्रतिनिधि नहीं है।",
    },
    aliases: ["kalighat kali temple", "kalighat temple kolkata", "कालीघाट काली मंदिर", "कालीघाट मंदिर"],
    source: WEST_BENGAL_TOURISM_KALIGHAT,
  },
  {
    slug: "kalighat-kali-form",
    title: { en: "The Kali form at Kalighat", hi: "कालीघाट का काली रूप" },
    statement: {
      en: "The living Kali form at Kalighat belongs to the temple's own religious world. Devam lets the player compare it with a source-bounded Kālikā passage, but comparison is not identity, derivation, ritual authority, or equivalence across traditions.",
      hi: "कालीघाट का जीवित काली रूप मंदिर के अपने धार्मिक जगत से संबंधित है। Devam इसकी तुलना स्रोत-सीमित कालिका पाठ से करने देता है, लेकिन तुलना का अर्थ समानता, उत्पत्ति, अनुष्ठानिक अधिकार या सभी परंपराओं में एकरूपता नहीं है।",
    },
    aliases: ["kalighat kali form", "kali form at kalighat", "कालीघाट का काली रूप", "कालीघाट काली स्वरूप"],
    source: WEST_BENGAL_TOURISM_KALIGHAT,
  },
  {
    slug: "kalighat-art-transition",
    title: { en: "From temple edge to urban art", hi: "मंदिर-परिसर से शहरी कला तक" },
    statement: {
      en: "Near Kalighat, a nineteenth-century art world developed in which sacred subjects met social observation and changing urban life. This doorway connects place, pictures, makers, markets, and later influence without claiming one origin moment for every work.",
      hi: "कालीघाट के पास उन्नीसवीं सदी का एक कला-जगत विकसित हुआ, जहाँ धार्मिक विषय सामाजिक अवलोकन और बदलते शहरी जीवन से मिले। यह द्वार स्थान, चित्र, निर्माता, बाजार और बाद के प्रभावों को जोड़ता है, पर हर कृति के लिए एक ही उत्पत्ति-क्षण का दावा नहीं करता।",
    },
    aliases: ["kalighat art transition", "kalighat painting history", "कालीघाट कला इतिहास", "मंदिर से शहरी कला"],
    source: INCREDIBLE_INDIA_KALIGHAT_ART,
  },
  {
    slug: "kalighat-pat",
    title: { en: "Kalighat painting", hi: "कालीघाट चित्रकला" },
    statement: {
      en: "Kalighat painting opens routes into gods and goddesses, narrative scenes, urban observation, satire, materials, markets, museums, and later visual culture. The Atlas provides a sourced orientation, not a complete catalogue or permission to reproduce artworks.",
      hi: "कालीघाट चित्रकला देवी-देवताओं, कथा-दृश्यों, शहरी अवलोकन, व्यंग्य, सामग्री, बाजार, संग्रहालय और बाद की दृश्य-संस्कृति के मार्ग खोलती है। Atlas स्रोत-आधारित परिचय देता है, संपूर्ण सूची या कलाकृतियों की प्रतिलिपि की अनुमति नहीं।",
    },
    aliases: ["kalighat painting", "kalighat pat", "kalighat art", "कालीघाट चित्रकला", "कालीघाट पट"],
    source: INCREDIBLE_INDIA_KALIGHAT_ART,
  },
  {
    slug: "kalighat-patua-community",
    title: { en: "Kalighat's patua makers", hi: "कालीघाट के पटुआ निर्माता" },
    statement: {
      en: "The patua route shifts attention from famous pictures to makers, mobility, livelihood, workshop knowledge, attribution, family histories, markets, and contemporary continuities. Official summaries are only an entry point; community testimony and work-level evidence remain necessary.",
      hi: "पटुआ मार्ग प्रसिद्ध चित्रों से ध्यान हटाकर निर्माताओं, आवाजाही, आजीविका, कार्यशाला-ज्ञान, श्रेय, पारिवारिक इतिहास, बाजार और आज की निरंतरताओं पर लाता है। आधिकारिक सार केवल प्रवेश-द्वार हैं; समुदाय की गवाही और कृति-स्तर का प्रमाण अभी भी आवश्यक है।",
    },
    aliases: ["kalighat patua makers", "kalighat patua community", "पटुआ निर्माता", "कालीघाट पटुआ"],
    source: INCREDIBLE_INDIA_KALIGHAT_ART,
  },
  {
    slug: "dakshineswar-kali-temple",
    title: { en: "Dakshineswar Kali Temple", hi: "दक्षिणेश्वर काली मंदिर" },
    statement: {
      en: "Dakshineswar opens a connected nineteenth-century temple world: Rani Rashmoni's patronage, Bhavatarini, Ramakrishna's association, Shiva shrines, a Radha-Krishna temple, and living Shyama Puja. Institutional history and devotional meaning remain attributed rather than flattened into neutral fact.",
      hi: "दक्षिणेश्वर उन्नीसवीं सदी का जुड़ा हुआ मंदिर-जगत खोलता है: रानी रासमणि का संरक्षण, भवतारिणी, रामकृष्ण का संबंध, शिव मंदिर, राधा-कृष्ण मंदिर और जीवित श्यामा पूजा। संस्थागत इतिहास और भक्ति-अर्थ को उनके स्रोत के नाम से रखा गया है, तटस्थ तथ्य बनाकर नहीं।",
    },
    aliases: ["dakshineswar kali temple", "dakshineswar temple kolkata", "दक्षिणेश्वर काली मंदिर", "दक्षिणेश्वर मंदिर"],
    source: DAKSHINESWAR_TEMPLE,
  },
  {
    slug: "bhavatarini-dakshineswar",
    title: { en: "Bhavatarini at Dakshineswar", hi: "दक्षिणेश्वर की भवतारिणी" },
    statement: {
      en: "Bhavatarini is the institution-named living form at the center of Dakshineswar's temple world. The node opens theology, image history, worship, patronage, and Ramakrishna memory as future evidence lanes without equating all Kali and Durga forms.",
      hi: "भवतारिणी दक्षिणेश्वर मंदिर-जगत के केंद्र में संस्थान द्वारा नामित जीवित रूप है। यह नोड धर्मदर्शन, प्रतिमा-इतिहास, उपासना, संरक्षण और रामकृष्ण-स्मृति के अलग प्रमाण-मार्ग खोलता है, सभी काली और दुर्गा रूपों को समान नहीं मानता।",
    },
    aliases: ["bhavatarini dakshineswar", "dakshineswar bhavatarini", "दक्षिणेश्वर भवतारिणी", "भवतारिणी"],
    source: DAKSHINESWAR_TEMPLE,
  },
  {
    slug: "rani-rashmoni",
    title: { en: "Rani Rashmoni", hi: "रानी रासमणि" },
    statement: {
      en: "Official institutional histories connect Rani Rashmoni with establishing Dakshineswar's temple complex. From her node, Devam can expand toward patronage, women in public history, land and institutions, nineteenth-century Kolkata, biography, and contested remembrance.",
      hi: "आधिकारिक संस्थागत इतिहास रानी रासमणि को दक्षिणेश्वर मंदिर परिसर की स्थापना से जोड़ते हैं। उनके नोड से Devam संरक्षण, सार्वजनिक इतिहास में महिलाओं, भूमि और संस्थानों, उन्नीसवीं सदी के कोलकाता, जीवनी और विवादित स्मृति की ओर बढ़ सकता है।",
    },
    aliases: ["rani rashmoni", "rashmoni dakshineswar", "रानी रासमणि", "रासमणि दक्षिणेश्वर"],
    source: RAMAKRISHNA_MATH_DAKSHINESWAR,
  },
  {
    slug: "ramakrishna-dakshineswar",
    title: { en: "Ramakrishna at Dakshineswar", hi: "दक्षिणेश्वर में रामकृष्ण" },
    statement: {
      en: "Ramakrishna's documented association with Dakshineswar opens distinct routes into biography, teaching, devotional experience, texts, disciples, institutions, and later movements. The current citation proves the association, not every claim in those larger worlds.",
      hi: "दक्षिणेश्वर से रामकृष्ण का प्रमाणित संबंध जीवनी, शिक्षा, भक्ति-अनुभव, ग्रंथ, शिष्य, संस्थाएँ और बाद के आंदोलनों के अलग मार्ग खोलता है। वर्तमान संदर्भ इस संबंध को आधार देता है, उन बड़े जगतों के हर दावे को नहीं।",
    },
    aliases: ["ramakrishna dakshineswar", "ramakrishna at dakshineswar", "दक्षिणेश्वर रामकृष्ण", "दक्षिणेश्वर में रामकृष्ण"],
    source: RAMAKRISHNA_MATH_DAKSHINESWAR,
  },
  {
    slug: "dakshineswar-shiva-temples",
    title: { en: "Dakshineswar's Shiva temples", hi: "दक्षिणेश्वर के शिव मंदिर" },
    statement: {
      en: "Dakshineswar's twelve Shiva temples make the complex a doorway into architecture, shrine histories, living worship, Shaiva traditions, conservation, and the much larger Shiva universe. The official overview does not settle each shrine's separate story or authority.",
      hi: "दक्षिणेश्वर के बारह शिव मंदिर इस परिसर को स्थापत्य, मंदिर-इतिहास, जीवित उपासना, शैव परंपराओं, संरक्षण और व्यापक शिव-जगत का द्वार बनाते हैं। आधिकारिक परिचय हर मंदिर की अलग कथा या प्रामाणिकता तय नहीं करता।",
    },
    aliases: ["dakshineswar shiva temples", "twelve shiva temples dakshineswar", "दक्षिणेश्वर शिव मंदिर", "बारह शिव मंदिर"],
    source: DAKSHINESWAR_TEMPLE,
  },
  {
    slug: "dakshineswar-radha-krishna-temple",
    title: { en: "Dakshineswar's Radha-Krishna temple", hi: "दक्षिणेश्वर का राधा-कृष्ण मंदिर" },
    statement: {
      en: "A Radha-Krishna temple within Dakshineswar creates a playable bridge from a Shakta complex into Krishna's wider textual, devotional, festival, art, and temple worlds. The route preserves the local temple's separate history and authority.",
      hi: "दक्षिणेश्वर परिसर का राधा-कृष्ण मंदिर शाक्त मंदिर-जगत से कृष्ण के व्यापक ग्रंथ, भक्ति, उत्सव, कला और मंदिर-जगत तक खेलने योग्य पुल बनाता है। यह मार्ग स्थानीय मंदिर के अलग इतिहास और प्रामाणिकता को बनाए रखता है।",
    },
    aliases: ["dakshineswar radha krishna temple", "dakshineswar vishnu temple", "दक्षिणेश्वर राधा कृष्ण मंदिर", "दक्षिणेश्वर विष्णु मंदिर"],
    source: DAKSHINESWAR_TEMPLE,
  },
  {
    slug: "dakshineswar-shyama-puja",
    title: { en: "Shyama Puja at Dakshineswar", hi: "दक्षिणेश्वर की श्यामा पूजा" },
    statement: {
      en: "Dakshineswar's Shyama Puja is one living institutional route within Bengal's wider Kali Puja season. It connects the festival to a place, temple form, patron, religious figure, and neighboring shrines without becoming a universal date, ritual, or origin account.",
      hi: "दक्षिणेश्वर की श्यामा पूजा बंगाल के व्यापक काली पूजा काल में एक जीवित संस्थागत मार्ग है। यह उत्सव को स्थान, मंदिर-रूप, संरक्षक, धार्मिक व्यक्तित्व और पास के मंदिरों से जोड़ती है, लेकिन सार्वभौमिक तिथि, विधि या उत्पत्ति-कथा नहीं बनती।",
    },
    aliases: ["dakshineswar shyama puja", "kali puja dakshineswar", "दक्षिणेश्वर श्यामा पूजा", "दक्षिणेश्वर काली पूजा"],
    source: INCREDIBLE_INDIA_KALI_PUJA,
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
  return query.includes(normalizedAlias) || normalizedAlias.split(" ").every((token) => query.includes(token));
}

function requestedLanguage(languageCode: string | undefined, value: string): Language {
  return languageCode?.toLowerCase().startsWith("hi") || /[\u0900-\u097f]/.test(value) ? "hi" : "en";
}

function toResult(record: WorldRecord, language: Language): LibrarySearchResult {
  return {
    id: `kolkata-shakta:${record.slug}`,
    title: record.title[language],
    statement: record.statement[language],
    languageCode: language,
    claimKind: "citation_only_connected_shakta_place_history_context",
    citations: [citation(record)],
    sourceBoundary: SOURCE_BOUNDARY[language],
  };
}

export function searchKolkataShaktaWorld(query: string, languageCode?: string): LibrarySearchResult[] {
  const normalized = normalize(query);
  if (normalized.length < 3) return [];
  const language = requestedLanguage(languageCode, query);
  return records.filter((record) => record.aliases.some((alias) => matchesAlias(normalized, alias))).map((record) => toResult(record, language));
}

export function answerKolkataShaktaWorld(request: SarthiRequest): GroundedSarthiAnswer | null {
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
    sourceBoundary: SOURCE_BOUNDARY[language],
  };
}

export const KOLKATA_SHAKTA_WORLD_FIXITY = {
  nodeCount: records.length,
  sourceIds: [...new Set(records.map((record) => record.source.id))],
  citationOnly: true,
  languages: ["en", "hi"],
} as const;

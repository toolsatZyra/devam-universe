import type {
  EvidenceCitation,
  GroundedSarthiAnswer,
  SarthiRequest,
  SarthiUnavailable,
} from "./contracts";

const SOURCE_SHA256 = "21e5909392249ecca6677410c30d70323402d886975df807df2b865697fd9e6d";
const PACK_SHA256 = "18c7aa230668b2d8062ebc31c9b366eb43f000d2210a39d84a2761843e7e0596";
const WORK_TITLE = "Śrīgaṇapatimantrākṣarāvaliḥ";
const EDITION_TITLE = "Ambuda electronic text based on Stotrārṇavaḥ (Madras, 1961)";
const SOURCE_BOUNDARY = `One beta-published, source-bounded CC0 hymn pack (${PACK_SHA256}); not complete Ganesha coverage or a universal Ganesh Puja vidhi.`;

type Passage = Omit<EvidenceCitation, "passageId" | "sourceObjectId" | "workTitle" | "editionTitle" | "rightsLane">;

export type PreviewSearchResult = {
  id: string;
  title: string;
  statement: string;
  languageCode: "en" | "hi";
  claimKind: "source_bounded_summary" | "source_bounded_theological_description";
  citations: EvidenceCitation[];
  sourceBoundary: string;
};

const passages: Record<number, Passage> = {
  1: {
    sourceOrdinal: 1,
    locator: { contract: "DEVAM_TEI_BYTE_SPAN_V1", element: "lg", literal_marker: "1", byte_start: 1882, byte_end_exclusive: 2213, line_start: 51, line_end: 55 },
    quotation: "श्रीदेव्युवाच---\nविना तपो विना ध्यानं विना होमं विना जपम् ।\nअनायासेन विघ्नेशप्रीणनं वद मे प्रभो ॥ १ ॥",
  },
  12: {
    sourceOrdinal: 12,
    locator: { contract: "DEVAM_TEI_BYTE_SPAN_V1", element: "lg", literal_marker: "12", byte_start: 5875, byte_end_exclusive: 6153, line_start: 104, line_end: 107 },
    quotation: "परानन्दमयं भक्तप्रत्यूहव्यूहनाशनम् ।\nपरमार्थप्रबोधाब्धिं पश्यामि गणनायकम् ॥ १२ ॥",
  },
  29: {
    sourceOrdinal: 29,
    locator: { contract: "DEVAM_TEI_BYTE_SPAN_V1", element: "lg", literal_marker: "29", byte_start: 11698, byte_end_exclusive: 11959, line_start: 179, line_end: 182 },
    quotation: "यजमानतनुं यागरूपिणं यज्ञपूरुषम् ।\nयमं यमवतामर्च्यं यत्नभाजामदुर्लभम् ॥ २९ ॥",
  },
  31: {
    sourceOrdinal: 31,
    locator: { contract: "DEVAM_TEI_BYTE_SPAN_V1", element: "lg", literal_marker: "31", byte_start: 12321, byte_end_exclusive: 12588, line_start: 187, line_end: 190 },
    quotation: "हारकेयूरमकुटकटकाङ्गदकुण्डलैः ।\nअलङ्कृतं च विघ्नानां हर्तारं देवमाश्रये ॥ ३१ ॥",
  },
  32: {
    sourceOrdinal: 32,
    locator: { contract: "DEVAM_TEI_BYTE_SPAN_V1", element: "lg", literal_marker: "32", byte_start: 12595, byte_end_exclusive: 12964, line_start: 191, line_end: 194 },
    quotation: "इति6मन्त्रावलिस्तोत्रं कथितं तव सुन्दरि ।\nसमस्तमीप्सितं तेन सम्पादय शिवे7शिवम् ॥ ३२ ॥",
  },
};

function citations(ordinals: number[]): EvidenceCitation[] {
  return ordinals.map((ordinal) => ({
    passageId: `sha256:${SOURCE_SHA256}:ordinal:${ordinal}`,
    sourceObjectId: SOURCE_SHA256,
    workTitle: WORK_TITLE,
    editionTitle: EDITION_TITLE,
    rightsLane: "derivative_allowed",
    ...passages[ordinal],
  }));
}

function isHindi(request: SarthiRequest): boolean {
  return request.context?.languageCode?.toLowerCase().startsWith("hi") === true || /[\u0900-\u097f]/.test(request.message);
}

function includesAny(value: string, needles: string[]): boolean {
  return needles.some((needle) => value.includes(needle));
}

const searchEntries = [
  {
    id: "ganapati-hymn-opening-source-bounded",
    title: "The hymn’s opening dialogue",
    titleHi: "स्तोत्र का आरम्भिक संवाद",
    statement: "In this hymn’s opening dialogue, the Goddess asks Maheshvara for an effortless way to please Vighneśa without austerity, meditation, fire-offering, or japa.",
    statementHi: "इस स्तोत्र के आरम्भिक संवाद में देवी महेश्वर से ऐसा सहज उपाय पूछती हैं जिससे तप, ध्यान, होम या जप के बिना विघ्नेश प्रसन्न हों।",
    keywords: ["opening", "dialogue", "effortless", "tapas", "meditation", "japa", "आरम्भ", "संवाद", "तप", "ध्यान", "जप"],
    ordinals: [1],
    claimKind: "source_bounded_summary" as const,
  },
  {
    id: "ganapati-removes-obstacles-source-bounded",
    title: "Gaṇapati and impediments",
    titleHi: "गणपति और विघ्न",
    statement: "This hymn praises Gaṇapati as one who destroys the array of impediments faced by devotees and as the remover of obstacles.",
    statementHi: "यह स्तोत्र गणपति की स्तुति भक्तों के विघ्न-समूह का नाश करने वाले और विघ्नों को हरने वाले देव के रूप में करता है।",
    keywords: ["obstacle", "obstacles", "impediment", "blocked", "stuck", "vighna", "विघ्न", "बाधा", "समस्या"],
    ordinals: [12, 31],
    claimKind: "source_bounded_theological_description" as const,
  },
  {
    id: "ganapati-yajna-form-source-bounded",
    title: "Gaṇapati as yajña-form",
    titleHi: "यज्ञ-रूप गणपति",
    statement: "Unit 29 presents Gaṇapati as the embodiment of the sacrificer, the form of yajña, and the sacrificial person.",
    statementHi: "पद 29 में गणपति को यजमान-स्वरूप, याग-रूप और यज्ञ-पुरुष के रूप में प्रस्तुत किया गया है।",
    keywords: ["yajna", "yajña", "sacrifice", "sacrificer", "यज्ञ", "याग", "यजमान"],
    ordinals: [29],
    claimKind: "source_bounded_theological_description" as const,
  },
  {
    id: "ganapati-hymn-closing-source-bounded",
    title: "The hymn’s closing prayer",
    titleHi: "स्तोत्र की समापन प्रार्थना",
    statement: "The final numbered unit identifies the composition as a mantrāvali hymn and closes with a prayer for the attainment of desired auspicious good.",
    statementHi: "अन्तिम क्रमांकित पद रचना को मन्त्रावली-स्तोत्र कहता है और इच्छित मंगल की प्राप्ति की प्रार्थना के साथ समाप्त होता है।",
    keywords: ["ending", "closing", "prayer", "mantravali", "mantrāvali", "समापन", "अन्त", "अंत", "प्रार्थना", "मन्त्रावली"],
    ordinals: [32],
    claimKind: "source_bounded_summary" as const,
  },
] as const;

export function searchGaneshaPreview(query: string, languageCode?: string): PreviewSearchResult[] {
  const normalized = query.trim().toLocaleLowerCase("en");
  if (normalized.length < 2 || normalized.length > 512) return [];
  const hindi = languageCode?.toLowerCase().startsWith("hi") === true || /[\u0900-\u097f]/.test(query);
  const broadGaneshaQuery = includesAny(normalized, ["ganesh", "ganapati", "gaṇapati", "गणेश", "गणपति"]);
  const specificMatches = searchEntries.filter((entry) => includesAny(normalized, [...entry.keywords]));
  const matches = specificMatches.length ? specificMatches : broadGaneshaQuery ? searchEntries : [];
  return matches
    .map((entry) => ({
      id: `${entry.id}-${hindi ? "hi" : "en"}`,
      title: hindi ? entry.titleHi : entry.title,
      statement: hindi ? entry.statementHi : entry.statement,
      languageCode: hindi ? "hi" : "en",
      claimKind: entry.claimKind,
      citations: citations([...entry.ordinals]),
      sourceBoundary: SOURCE_BOUNDARY,
    }));
}

export function answerGaneshaPreview(request: SarthiRequest): GroundedSarthiAnswer | SarthiUnavailable {
  const query = request.message.toLocaleLowerCase("en");
  const inGaneshaContext = request.context?.atlasNodeSlug === "ganesha";
  const mentionsGanesha = includesAny(query, ["ganesh", "ganapati", "gaṇapati", "vighnesh", "विघ्नेश", "गणेश", "गणपति"]);
  const asksSupportedContextQuestion = inGaneshaContext && includesAny(query, [
    "why is this relevant",
    "tell me simply",
    "tell me about this",
    "what is this",
    "what can i practise",
    "what can i practice",
    "how can this help",
    "इसके बारे",
    "यह क्या",
    "क्या करूँ",
    "क्या करें",
  ]);
  const describesObstacle = includesAny(query, ["obstacle", "blocked", "stuck", "impediment", "विघ्न", "बाधा", "अटका", "समस्या"]);
  if (!mentionsGanesha && !asksSupportedContextQuestion && !describesObstacle) {
    return {
      ok: false,
      code: "NO_SUPPORTED_EVIDENCE",
      message: "I don’t yet have enough reviewed evidence for that question. My first grounded conversation currently covers one Ganesha hymn.",
    };
  }

  const hindi = isHindi(request);
  if (includesAny(query, ["यज्ञ", "याग", "yajna", "yajña", "sacrifice"])) {
    return {
      ok: true,
      mode: "deterministic_source_bounded_preview",
      answer: hindi
        ? "इस स्तोत्र के पद 29 में गणपति को यजमान-स्वरूप, याग-रूप और यज्ञ-पुरुष कहा गया है। यह इसी पद का स्रोत-सीमित अर्थ है—गणेश-उपासना की सम्पूर्ण धर्ममीमांसा नहीं।"
        : "In unit 29, this hymn presents Gaṇapati as the embodiment of the sacrificer, the form of yajña, and the sacrificial person. That is a reading of this particular unit, not a complete theology of Ganesha worship.",
      citations: citations([29]),
      alternativesAvailable: false,
      sourceBoundary: SOURCE_BOUNDARY,
    };
  }

  if (includesAny(query, ["practise", "practice", "read", "pray", "worship", "ritual", "puja", "पूजा", "पाठ", "साधना", "क्या करूँ", "क्या करें"])) {
    return {
      ok: true,
      mode: "deterministic_source_bounded_preview",
      answer: hindi
        ? "अभी मैं इस एक स्तोत्र का स्रोत-सीमित पाठ सुझा सकता हूँ, सम्पूर्ण गणेश-पूजा विधि नहीं। आरम्भिक संवाद से शुरू करें, सभी 32 पदों को सुरक्षित पाठ के अनुसार पढ़ें और पद 32 की प्रार्थना से समापन करें। परिवार या सम्प्रदाय की स्थापित परम्परा हो तो उसे प्राथमिकता दें।"
        : "For now, I can support a source-bounded reading of this one hymn—not a complete Ganesh Puja vidhi. Begin with its opening dialogue, read the 32 retained units as they stand, and close with unit 32’s prayer. If your family or sampradaya has an established practice, follow that first.",
      citations: citations([1, 32]),
      alternativesAvailable: true,
      sourceBoundary: SOURCE_BOUNDARY,
    };
  }

  if (includesAny(query, ["end", "ending", "close", "closing", "समापन", "अन्त", "अंत"])) {
    return {
      ok: true,
      mode: "deterministic_source_bounded_preview",
      answer: hindi
        ? "अन्तिम क्रमांकित पद इसे मन्त्रावली-स्तोत्र कहता है और इच्छित मंगल की प्रार्थना के साथ समाप्त होता है। सुरक्षित प्रतिलेखन में टिप्पणी-संकेत हैं, इसलिए यह व्यापक संरचनात्मक प्रामाणिकता का दावा नहीं है।"
        : "The final numbered unit calls the composition a mantrāvali hymn and closes with a prayer for desired auspicious good. The retained transcription contains note anchors, so this does not settle the work’s wider structural authority.",
      citations: citations([32]),
      alternativesAvailable: false,
      sourceBoundary: SOURCE_BOUNDARY,
    };
  }

  return {
    ok: true,
    mode: "deterministic_source_bounded_preview",
    answer: hindi
      ? "जब जीवन में बाधाएँ भारी लगें, यह स्तोत्र गणपति को भक्तों के विघ्न हरने वाले देव के रूप में स्मरण करता है। आप अपने सामने की बाधा को स्पष्ट रूप से पहचानकर गणपति का शांत स्मरण कर सकते हैं—इसे किसी निश्चित परिणाम की गारंटी न मानें।"
      : "When life feels blocked, this hymn offers a devotional lens: it praises Gaṇapati as the remover of devotees’ impediments. You might pause, name the obstacle clearly, and remember Gaṇapati—without treating that as a guarantee of a particular outcome.",
    citations: citations([12, 31]),
    alternativesAvailable: false,
    sourceBoundary: SOURCE_BOUNDARY,
  };
}

export const GANESHA_PREVIEW_FIXITY = {
  packSha256: PACK_SHA256,
  sourceSha256: SOURCE_SHA256,
  sourcePassageCount: 32,
  heroUniverseComplete: false,
  formalPujaVidhiSupported: false,
} as const;

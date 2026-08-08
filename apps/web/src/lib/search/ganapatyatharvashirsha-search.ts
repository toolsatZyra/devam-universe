import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import type { LibrarySearchResult } from "./library-search";

const PACK_PATH = "knowledge_packs/ganesha/ganapatyatharvashirsha-devam-translations-v1.json";
const PACK_FILE_SHA256 = "92f2ed67e3b3ab48d2abf06cbbd44404c0c87fe22ed02d5731f8e0d5b236b4da";
const SOURCE_SHA256 = "43d5f6ca8a2ee7d7a62480a85cdbd526cee04b816db46ac7c3fd8d90757a5178";
const SOURCE_PACKET_SHA256 = "46943518b9f94d43daa26272fb3e746f81b4de16e86877956efad227058350b0";
const TRANSLATION_CONTENT_ROOT_SHA256 = "f1b0dfe955482c23ac80637cf2ac49a9e1cc83116a6e2162963cd87b321f9b5e";
const WORK_TITLE = "Gaṇapatyatharvaśīrṣa";
const EDITION_TITLE = "Sanskrit Wikisource revision 415703";
const SOURCE_BOUNDARY = "Complete source-aligned English and Hindi beta translations for all 16 passages in exact Sanskrit Wikisource revision 415703. They are AI-assisted Devam derivatives, not source originals or independently Sanskrit-reviewed translations. The underlying print edition, recension, pronunciation, textual variants, formal ritual authority, empirical benefit guarantees, and wider Ganesha universe remain open.";

type TranslationPassage = {
  source_ordinal: number;
  source_span_sha256: string;
  english: string;
  hindi: string;
  confidence: number;
  note: string;
};

type TranslationPack = {
  contract: string;
  pack_id: string;
  source: {
    provider_revision_id: number;
    canonical_wikitext_sha256: string;
    required_ingestion_packet_sha256: string;
    source_passage_count: number;
    underlying_print_edition_identified: boolean;
    recension_identified: boolean;
  };
  translation: {
    review_status: string;
    is_source_original: boolean;
    rights_lane: "derivative_allowed";
    publication_state: "published";
  };
  passages: TranslationPassage[];
  completion: Record<string, boolean | number>;
};

const UNIT_KEYWORDS: Record<number, string[]> = {
  0: ["opening peace", "peace invocation", "शान्ति पाठ", "शांति पाठ"],
  1: ["directly perceptible reality", "creator sustainer dissolver", "eternal self", "प्रत्यक्ष तत्त्व", "कर्ता", "धर्ता", "हर्ता"],
  2: ["speak truth", "protect the speaker", "ऋतं वच्मि", "सत्यं वच्मि", "वक्तारमव"],
  3: ["beyond speech", "consciousness self", "ज्ञानमयो विज्ञानमयो", "वाङ्मय"],
  4: ["being consciousness bliss", "sat chit ananda", "सच्चिदानन्द", "आनन्दमय"],
  5: ["five elements", "four levels of speech", "earth water fire air space", "पृथिवी", "वाणी के चार"],
  6: ["three gunas", "three states", "muladhara", "three powers", "त्रिगुण", "मूलाधार", "तीन शक्त"],
  7: ["om gam ganapataye", "om gaṃ gaṇapataye", "ganesha vidya", "ॐ गं गणपतये", "गणेशविद्या"],
  8: ["ganesha gayatri", "ganapati gayatri", "ekadanta gayatri", "गणेश गायत्री", "एकदन्ताय विद्महे"],
  9: ["one tusk four arms", "mouse emblem", "ganesha form", "iconography", "एकदन्तं चतुर्हस्तं", "गणेश रूप", "मूषक"],
  10: ["eight names", "vratapati", "pramathapati", "lambodara", "आठ नाम", "व्रातपति", "प्रमथपति", "लम्बोदर"],
  11: ["phalashruti", "traditional fruits", "traditional benefits", "five great sins", "फलश्रुति", "पारम्परिक फल"],
  12: ["fourth lunar day", "fasting on chaturthi", "abhisheka", "चतुर्थी", "उपवास", "अभिषेक"],
  13: ["durva", "modaka", "parched grain", "offerings", "दूर्वा", "मोदक", "लाजा"],
  14: ["solar eclipse", "eight brahmins", "great river", "सूर्यग्रहण", "आठ ब्राह्मण", "महानदी"],
  15: ["closing peace", "peace mantra", "thus ends", "समाप्त", "शान्ति मन्त्र", "शांति मंत्र"],
};

let cachedPack: TranslationPack | undefined;

function loadPack(): TranslationPack {
  if (cachedPack) return cachedPack;
  const root = resolve(process.cwd(), "../..");
  const bytes = readFileSync(resolve(root, PACK_PATH));
  if (createHash("sha256").update(bytes).digest("hex") !== PACK_FILE_SHA256) throw new Error("Ganapati Atharvashirsha translation pack drift");
  const pack = JSON.parse(bytes.toString("utf8")) as TranslationPack;
  const ordinals = pack.passages.map((passage) => passage.source_ordinal);
  if (
    pack.contract !== "DEVAM_SOURCE_ALIGNED_TRANSLATION_PACK_V1"
    || pack.pack_id !== "ganesha-ganapatyatharvashirsha-devam-translations-v1"
    || pack.source.provider_revision_id !== 415703
    || pack.source.canonical_wikitext_sha256 !== SOURCE_SHA256
    || pack.source.required_ingestion_packet_sha256 !== SOURCE_PACKET_SHA256
    || pack.source.source_passage_count !== 16
    || pack.source.underlying_print_edition_identified !== false
    || pack.source.recension_identified !== false
    || pack.translation.review_status !== "internal_beta_ai_assisted_not_independently_sanskrit_reviewed"
    || pack.translation.is_source_original !== false
    || pack.translation.rights_lane !== "derivative_allowed"
    || pack.translation.publication_state !== "published"
    || ordinals.join(",") !== Array.from({ length: 16 }, (_, index) => index).join(",")
    || pack.passages.some((passage) => !passage.english || !passage.hindi || !passage.source_span_sha256)
    || pack.completion.exact_provider_revision_translation_coverage_complete !== true
    || pack.completion.independent_sanskrit_human_review_complete !== false
    || pack.completion.pronunciation_layer_complete !== false
    || pack.completion.formal_ritual_authority_established !== false
    || pack.completion.traditional_benefits_empirically_guaranteed !== false
  ) throw new Error("Ganapati Atharvashirsha translation contract drift");
  cachedPack = pack;
  return pack;
}

function normalize(value: string): string {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("en");
}

function namedWork(value: string): boolean {
  return [
    "ganapati atharvashirsha", "ganapatyatharvashirsha", "ganapati atharvasirsa", "atharvashirsha",
    "atharvasirsa", "गणपत्यथर्वशीर्ष", "गणपति अथर्वशीर्ष", "अथर्वशीर्ष",
  ].some((candidate) => value.includes(candidate));
}

function distinctiveStandaloneQuery(value: string): boolean {
  return [
    "om gam ganapataye", "om gaṃ gaṇapataye", "ganesha vidya", "ॐ गं गणपतये", "गणेशविद्या",
    "ganesha gayatri", "ganapati gayatri", "ekadanta gayatri", "गणेश गायत्री", "एकदन्ताय विद्महे",
  ].some((candidate) => value.includes(normalize(candidate)));
}

function explicitOrdinal(value: string): number | null {
  const match = value.match(/(?:unit|verse|passage|section|खंड|खण्ड|पद)\s*(1[0-5]|[0-9])\b/u);
  return match ? Number(match[1]) : null;
}

function citation(passage: TranslationPassage): LibrarySearchResult["citations"][number] {
  const ordinal = passage.source_ordinal;
  return {
    passageId: `sha256:${SOURCE_SHA256}:span:${passage.source_span_sha256}`,
    sourceObjectId: SOURCE_SHA256,
    sourceOrdinal: ordinal,
    locator: {
      contract: "DEVAM_WIKISOURCE_PINNED_REVISION_PASSAGE_V1",
      provider: "Sanskrit Wikisource",
      provider_page_id: 137,
      provider_revision_id: 415703,
      source_ordinal: ordinal,
      segment_kind: ordinal === 0 ? "opening" : ordinal === 15 ? "closing" : "numbered_unit",
      numbered_unit: ordinal >= 1 && ordinal <= 14 ? ordinal : null,
      span_sha256: passage.source_span_sha256,
    },
    workTitle: WORK_TITLE,
    editionTitle: EDITION_TITLE,
    rightsLane: "derivative_allowed",
  };
}

function passageResult(passage: TranslationPassage, hindi: boolean): LibrarySearchResult {
  return {
    id: `ganapati-ganapatyatharvashirsha-rev415703-translation-${String(passage.source_ordinal).padStart(2, "0")}-${hindi ? "hi" : "en"}`,
    title: passage.source_ordinal === 0 ? (hindi ? "आरम्भिक शान्ति-पाठ" : "Opening peace invocation")
      : passage.source_ordinal === 15 ? (hindi ? "समापन शान्ति-मन्त्र" : "Closing peace mantra")
        : hindi ? `गणपति अथर्वशीर्ष — खण्ड ${passage.source_ordinal}` : `Ganapati Atharvashirsha — unit ${passage.source_ordinal}`,
    statement: hindi ? passage.hindi : passage.english,
    languageCode: hindi ? "hi" : "en",
    claimKind: "source_aligned_translation",
    citations: [citation(passage)],
    sourceBoundary: `${SOURCE_BOUNDARY} Translation confidence: ${passage.confidence}. ${passage.note}`,
  };
}

export function searchGanapatiAtharvashirsha(query: string, languageCode?: string): LibrarySearchResult[] {
  const normalized = normalize(query.trim());
  if (normalized.length < 2 || normalized.length > 512) return [];
  const hindi = languageCode?.toLowerCase().startsWith("hi") === true || /[\u0900-\u097f]/.test(query);
  const pack = loadPack();
  const requestedOrdinal = explicitOrdinal(normalized);
  if (requestedOrdinal !== null && namedWork(normalized)) return [passageResult(pack.passages[requestedOrdinal], hindi)];

  const thematicOrdinals = Object.entries(UNIT_KEYWORDS)
    .filter(([, keywords]) => keywords.some((keyword) => normalized.includes(normalize(keyword))))
    .map(([ordinal]) => Number(ordinal));
  if (thematicOrdinals.length > 0 && (namedWork(normalized) || distinctiveStandaloneQuery(normalized))) {
    return thematicOrdinals.slice(0, 3).map((ordinal) => passageResult(pack.passages[ordinal], hindi));
  }
  if (!namedWork(normalized)) return [];

  return [{
    id: `ganapati-ganapatyatharvashirsha-rev415703-overview-${hindi ? "hi" : "en"}`,
    title: hindi ? "गणपति अथर्वशीर्ष — सटीक संशोधन" : "Ganapati Atharvashirsha — exact revision",
    statement: hindi
      ? "Devam ने संस्कृत विकिस्रोत संशोधन 415703 के आरम्भ, क्रमांकित खण्ड 1–14 और समापन—सभी 16 पाठांशों—के स्रोत-संरेखित हिन्दी और अंग्रेज़ी beta अनुवाद प्रकाशित किए हैं।"
      : "Devam publishes source-aligned English and Hindi beta translations for all 16 passages—opening, numbered units 1–14, and closing—in exact Sanskrit Wikisource revision 415703.",
    languageCode: hindi ? "hi" : "en",
    claimKind: "exact_revision_translation_coverage",
    citations: [citation(pack.passages[0]), citation(pack.passages[15])],
    sourceBoundary: SOURCE_BOUNDARY,
  }];
}

export function isGanapatiAtharvashirshaQuery(query: string): boolean {
  const normalized = normalize(query);
  return namedWork(normalized) || distinctiveStandaloneQuery(normalized);
}

export const GANAPATI_ATHARVASHIRSHA_SEARCH_FIXITY = {
  packFileSha256: PACK_FILE_SHA256,
  sourceSha256: SOURCE_SHA256,
  sourcePacketSha256: SOURCE_PACKET_SHA256,
  translationContentRootSha256: TRANSLATION_CONTENT_ROOT_SHA256,
  sourcePassageCount: 16,
  bilingualTranslationCount: 32,
  sourcePayloadsCopied: false,
} as const;

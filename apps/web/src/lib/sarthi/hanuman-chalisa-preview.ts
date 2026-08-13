import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { EvidenceCitation, GroundedSarthiAnswer, SarthiRequest } from "./contracts";

const PACK_PATH = "knowledge_packs/devotional/hanuman-chalisa-consumer-v1.json";
const PACK_SHA256 = "62dde87e6b39b7079b8a9e6a42f5253e1f2f6be707848734f369f645ec9def83";
const CARRIER_SHA256 = "b39721a0a96f21d659b6b74f32ff5e0469220b5fa2813cc93733702d43ac02d5";
const RIGHTS_REVISION_SHA256 = "ca3a6f1ee697889245befa79e3311278452eb9daf29d5241c60ae936744750cb";
const SOURCE_BOUNDARY = "Complete for the 2 opening dohas, 40 chaupais, and closing doha visible in one fixed CC BY-SA 4.0 Wikimedia Commons graphic. The Devanagari text is Devam's beta-reviewed normalized transcription and the Hindi/English meanings are Devam-authored consumer explanations; this is not a critical edition, Gita Press text, Sanskrit original, mandatory ritual, prescribed repetition count, medical advice, or guaranteed outcome.";

type ReadingKind = "opening_doha" | "chaupai" | "closing_doha";

type HanumanChalisaReading = {
  ordinal: number;
  kind: ReadingKind;
  source_number: number;
  text: string;
  meaning: { en: string; hi: string };
  themes: string[];
};

type HanumanChalisaPack = {
  contract: string;
  status: string;
  work: {
    title: { en: string; hi: string };
    language_code: string;
    script_code: string;
    structure: { opening_dohas: number; chaupais: number; closing_dohas: number; reading_units: number };
  };
  source_expression: {
    fixed_carrier_sha256: string;
    rights_revision_sha256: string;
    rights_revision_id: number;
    provider: string;
    attribution: string;
    license: string;
    license_url: string;
    numbering_note: string;
  };
  daily_path: { cycle_length: number; order: string };
  readings: HanumanChalisaReading[];
};

let cachedPack: HanumanChalisaPack | undefined;

function pack(): HanumanChalisaPack {
  if (cachedPack) return cachedPack;
  const root = resolve(process.cwd(), "../..");
  const bytes = readFileSync(resolve(root, PACK_PATH));
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  if (sha256 !== PACK_SHA256) throw new Error("Hanuman Chalisa consumer pack fixity drift");
  const parsed = JSON.parse(bytes.toString("utf8")) as HanumanChalisaPack;
  if (
    parsed.contract !== "DEVAM_HANUMAN_CHALISA_CONSUMER_V1"
    || parsed.status !== "beta_product_ready"
    || parsed.source_expression.fixed_carrier_sha256 !== CARRIER_SHA256
    || parsed.source_expression.rights_revision_sha256 !== RIGHTS_REVISION_SHA256
    || parsed.work.structure.reading_units !== 43
    || parsed.daily_path.cycle_length !== 43
    || parsed.readings.length !== 43
  ) throw new Error("Hanuman Chalisa consumer pack contract drift");
  cachedPack = parsed;
  return parsed;
}

function isHindi(message: string, languageCode?: string): boolean {
  return languageCode?.toLowerCase().startsWith("hi") === true || /[\u0900-\u097f]/u.test(message);
}

function matchesHanumanChalisa(value: string): boolean {
  const normalized = value.toLocaleLowerCase("en-IN");
  return ["hanuman chalisa", "hanuman chaalisa", "hanuman calisa", "हनुमान चालीसा", "हनुमान चालिसा"].some((term) => normalized.includes(term));
}

function asciiDigits(value: string): string {
  return value.replace(/[०-९]/gu, (digit) => String("०१२३४५६७८९".indexOf(digit)));
}

function requestedReading(value: string): HanumanChalisaReading | undefined {
  const normalized = asciiDigits(value.toLocaleLowerCase("en-IN"));
  const chaupaiNumber = normalized.match(/(?:chaupai|चौपाई)\s*(\d{1,2})/u)?.[1];
  if (chaupaiNumber) {
    const sourceNumber = Number(chaupaiNumber);
    return pack().readings.find((reading) => reading.kind === "chaupai" && reading.source_number === sourceNumber);
  }
  const readingNumber = normalized.match(/(?:reading|unit|day|पाठ|भाग)\s*(\d{1,2})/u)?.[1];
  if (readingNumber) return pack().readings.find((reading) => reading.ordinal === Number(readingNumber));
  return undefined;
}

function citation(reading?: HanumanChalisaReading): EvidenceCitation {
  const source = pack().source_expression;
  return {
    passageId: `sha256:${CARRIER_SHA256}:reading:${reading?.ordinal ?? 0}`,
    sourceObjectId: CARRIER_SHA256,
    sourceOrdinal: reading?.ordinal ?? 0,
    workTitle: "Hanuman Chalisa",
    editionTitle: "RahulKSaini CC BY-SA 4.0 Wikimedia Commons graphic; Devam normalized transcription and consumer meanings",
    locator: {
      provider: source.provider,
      carrier_sha256: CARRIER_SHA256,
      rights_revision_id: source.rights_revision_id,
      rights_revision_sha256: RIGHTS_REVISION_SHA256,
      reading_ordinal: reading?.ordinal ?? null,
      reading_kind: reading?.kind ?? null,
      source_number: reading?.source_number ?? null,
      attribution: source.attribution,
      license: source.license,
      license_url: source.license_url,
      numbering_note: source.numbering_note,
      consumer_pack_sha256: PACK_SHA256,
    },
    ...(reading ? { quotation: reading.text } : {}),
    rightsLane: "derivative_allowed",
  };
}

function readingLabel(reading: HanumanChalisaReading, hindi: boolean): string {
  if (reading.kind === "chaupai") return hindi ? `चौपाई ${reading.source_number}` : `Chaupai ${reading.source_number}`;
  if (reading.kind === "opening_doha") return hindi ? `आरम्भ दोहा ${reading.source_number}` : `Opening doha ${reading.source_number}`;
  return hindi ? "समापन दोहा" : "Closing doha";
}

export function searchHanumanChalisaPreview(query: string, languageCode?: string) {
  if (!matchesHanumanChalisa(query)) return [];
  const hindi = isHindi(query, languageCode);
  const reading = requestedReading(query);
  if (reading) return [{
    id: `hanuman-chalisa-reading-${reading.ordinal}-${hindi ? "hi" : "en"}`,
    title: `${hindi ? "हनुमान चालीसा" : "Hanuman Chalisa"} · ${readingLabel(reading, hindi)}`,
    statement: `${reading.text}\n\n${reading.meaning[hindi ? "hi" : "en"]}`,
    languageCode: hindi ? "hi" as const : "en" as const,
    claimKind: "complete_devotional_reading_unit" as const,
    citations: [citation(reading)],
    sourceBoundary: SOURCE_BOUNDARY,
  }];
  return [{
    id: `hanuman-chalisa-complete-reading-${hindi ? "hi" : "en"}`,
    title: hindi ? "हनुमान चालीसा: सम्पूर्ण 43-भाग पाठ" : "Hanuman Chalisa: complete 43-part reading",
    statement: hindi
      ? "देवम् में हनुमान चालीसा का पूरा पाठ है—2 आरम्भ दोहे, 40 चौपाइयाँ और 1 समापन दोहा—और हर भाग के साथ सरल हिन्दी तथा अंग्रेज़ी अर्थ उपलब्ध है। किसी भी भाग के लिए ‘हनुमान चालीसा पाठ 12’ या ‘चौपाई 40’ खोजें।"
      : "Devam includes the complete reading sequence—2 opening dohas, 40 chaupais, and 1 closing doha—with a simple Hindi and English meaning for every part. Search for “Hanuman Chalisa reading 12” or “chaupai 40” to jump anywhere.",
    languageCode: hindi ? "hi" as const : "en" as const,
    claimKind: "complete_devotional_reading_structure" as const,
    citations: [citation()],
    sourceBoundary: SOURCE_BOUNDARY,
  }];
}

export function answerHanumanChalisaPreview(request: SarthiRequest): GroundedSarthiAnswer | null {
  const contextual = request.context?.atlasNodeSlug === "hanuman-chalisa";
  if (!matchesHanumanChalisa(request.message) && !contextual) return null;
  const hindi = isHindi(request.message, request.context?.languageCode);
  const reading = requestedReading(request.message);
  if (reading) return {
    ok: true,
    mode: "deterministic_source_bounded_preview",
    answer: `${readingLabel(reading, hindi)}\n\n${reading.text}\n\n${reading.meaning[hindi ? "hi" : "en"]}`,
    citations: [citation(reading)],
    alternativesAvailable: true,
    sourceBoundary: SOURCE_BOUNDARY,
  };
  const asksForDailyReading = /\b(today|daily|start|begin|read)\b|आज|दैनिक|शुरू|पढ़/u.test(request.message.toLocaleLowerCase("en-IN"));
  if (asksForDailyReading) {
    const first = pack().readings[0];
    return {
      ok: true,
      mode: "deterministic_source_bounded_preview",
      answer: `${readingLabel(first, hindi)}\n\n${first.text}\n\n${first.meaning[hindi ? "hi" : "en"]}`,
      citations: [citation(first)],
      alternativesAvailable: true,
      sourceBoundary: SOURCE_BOUNDARY,
      followUpQuestion: hindi ? "अगला भाग पढ़ें, या किसी चौपाई पर जाएँ?" : "Continue to the next reading, or jump to a particular chaupai?",
    };
  }
  return {
    ok: true,
    mode: "deterministic_source_bounded_preview",
    answer: hindi
      ? "हनुमान चालीसा तुलसीदास को परम्परागत रूप से समर्पित अवधी भक्ति-रचना है। देवम् में इसका पूरा 43-भाग पाठ—2 आरम्भ दोहे, 40 चौपाइयाँ और 1 समापन दोहा—सरल हिन्दी और अंग्रेज़ी अर्थ के साथ है। आप ‘पाठ 1’ से शुरू कर सकते हैं या ‘चौपाई 40’ जैसे किसी भी भाग पर जा सकते हैं।"
      : "Hanuman Chalisa is an Awadhi devotional hymn traditionally attributed to Tulsidas. Devam includes its complete 43-part sequence—2 opening dohas, 40 chaupais, and 1 closing doha—with simple Hindi and English meanings. Start with “reading 1” or jump directly to any chaupai.",
    citations: [citation()],
    alternativesAvailable: true,
    sourceBoundary: SOURCE_BOUNDARY,
  };
}

export const HANUMAN_CHALISA_PREVIEW_FIXITY = {
  packSha256: PACK_SHA256,
  carrierSha256: CARRIER_SHA256,
  rightsRevisionSha256: RIGHTS_REVISION_SHA256,
  readingUnits: 43,
  openingDohas: 2,
  chaupais: 40,
  closingDohas: 1,
  hostedDatabaseProjectionApplied: false,
  criticalEditionClaimed: false,
} as const;

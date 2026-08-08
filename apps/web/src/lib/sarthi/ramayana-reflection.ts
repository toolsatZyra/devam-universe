import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import type { EvidenceCitation, GroundedSarthiAnswer, SarthiRequest } from "./contracts";

const PACK_PATH = "knowledge_packs/ramayana/sundarakanda-hanuman-deliberation-v1.json";
export const RAMAYANA_REFLECTION_PACK_SHA256 = "b89e00ea873f7d116b22d7fdc6a2385ac3898546a3bd392e46d40fa321181c8e";

type Source = {
  source_id: string;
  work_title: string;
  edition_title: string;
  source_object_id: string;
  source_path: string;
  byte_count: number;
  sha256: string;
  rights_lane: "citation_only";
};

type BytePassage = {
  passage_id: string;
  source_id: string;
  source_ordinal: number;
  literal_marker: string;
  byte_start: number;
  byte_end_exclusive: number;
  line_start: number;
  line_end: number;
  span_sha256: string;
  language_code: string;
};

type ScanPassage = {
  passage_id: string;
  source_id: string;
  source_ordinal: number;
  literal_marker: string;
  carrier_page_start: number;
  carrier_page_end: number;
  printed_page_start: string;
  printed_page_end: string;
  page_evidence_sha256: string[];
  language_code: string;
};

type Passage = BytePassage | ScanPassage;

type Bundle = {
  contract: string;
  bundle_id: string;
  review_status: string;
  denials: Record<string, boolean>;
  sources: Source[];
  passages: Passage[];
  crosswalk: {
    status: string;
    gretil_locator: string;
    griffith_locator: string;
    dutt_locator: string;
    dutt_selected_passage_review_sha256: string;
    adjacent_sequence_check: Array<{
      gretil: string;
      griffith: string;
      episode: string;
      gretil_evidence: Omit<BytePassage, "passage_id" | "source_id" | "literal_marker" | "language_code">;
      griffith_evidence: Omit<BytePassage, "passage_id" | "source_id" | "literal_marker" | "language_code">;
    }>;
  };
  episode: { title: { en: string; hi: string }; story: { en: string; hi: string } };
  lenses: Array<{ lens_id: string; en: string; hi: string; application_boundary: string }>;
};

export type ReviewedRamayanaSearchResult = {
  id: string;
  title: string;
  statement: string;
  languageCode: "en" | "hi";
  claimKind: "reviewed_interpretive_lens";
  citations: EvidenceCitation[];
  sourceBoundary: string;
};

let cachedBundle: Bundle | null = null;

function sha256(value: Buffer | string) {
  return createHash("sha256").update(value).digest("hex");
}

export function loadRamayanaReflectionBundle(): Bundle {
  if (cachedBundle) return cachedBundle;
  const root = resolve(process.cwd(), "../..");
  const bytes = readFileSync(resolve(root, PACK_PATH));
  if (sha256(bytes) !== RAMAYANA_REFLECTION_PACK_SHA256) throw new Error("Ramayana reflection pack drift");
  const bundle = JSON.parse(bytes.toString("utf8")) as Bundle;
  if (bundle.contract !== "DEVAM_REVIEWED_RAMAYANA_EPISODE_V1"
    || bundle.bundle_id !== "sundarakanda-hanuman-deliberation-v1"
    || bundle.review_status !== "internal_beta_reviewed") {
    throw new Error("Ramayana reflection contract drift");
  }
  if (!Object.values(bundle.denials).every((value) => value === false)) throw new Error("Ramayana reflection denial drift");
  const expectedSources = new Map([
    ["gretil-valmiki-ramayana-tokunaga-smith-tei", "a569551e8a972935d540bc53e57effa919868367234ab3b5334d07a1e7f84901"],
    ["project-gutenberg-griffith-ramayana-tei", "1fa8d3e9da23d83abd334661db3a95574bfd6290943441c374d9bce4ef142ed9"],
    ["commons-dutt-ramayana-sundara-djvu", "6f9e92eeb176b097b5e36a68676748c49152c07fea365da450bc54052d2f7062"],
  ]);
  if (bundle.sources.length !== expectedSources.size) throw new Error("Ramayana reflection source universe drift");
  for (const source of bundle.sources) {
    const expected = expectedSources.get(source.source_id);
    if (!expected || source.sha256 !== expected || source.source_object_id !== `sha256:${expected}` || source.rights_lane !== "citation_only") {
      throw new Error("Ramayana reflection source identity drift");
    }
  }
  if (bundle.passages.length !== 3
    || bundle.passages[0]?.source_ordinal !== 352
    || !("span_sha256" in bundle.passages[0])
    || bundle.passages[0].span_sha256 !== "31ef2670759fedf4116087f22f53cb344324543f02aefd276964a7560b4e7e81"
    || bundle.passages[1]?.source_ordinal !== 367
    || !("span_sha256" in bundle.passages[1])
    || bundle.passages[1].span_sha256 !== "8621ebca63d13f6ed596b750503938fb826b0cd80c213d5d12ea31e0dbb3d78f"
    || bundle.passages[2]?.source_ordinal !== 30
    || !("carrier_page_start" in bundle.passages[2])
    || bundle.passages[2].carrier_page_start !== 110
    || bundle.passages[2].carrier_page_end !== 113
    || bundle.passages[2].page_evidence_sha256.length !== 4) {
    throw new Error("Ramayana reflection passage drift");
  }
  if (bundle.crosswalk.status !== "content_sequence_alignment_with_literal_numbering_divergence"
    || bundle.crosswalk.gretil_locator !== "Book 5, sarga 28"
    || bundle.crosswalk.griffith_locator !== "Book 5, Canto XXX"
    || bundle.crosswalk.dutt_locator !== "Sundara Kandam, Section XXX, printed pp. 975-978"
    || bundle.crosswalk.dutt_selected_passage_review_sha256 !== "f506d39d6c9e3cd90c5f6629ecd64c050b59e51dfeb372fbaa8c717d902c268b"
    || bundle.crosswalk.adjacent_sequence_check.map((item) => `${item.gretil}:${item.griffith}`).join("|") !== "5.28:XXX|5.29:XXXI|5.30:XXXII") {
    throw new Error("Ramayana reflection crosswalk drift");
  }
  cachedBundle = bundle;
  return bundle;
}

function isHindi(message: string, languageCode?: string) {
  return languageCode?.toLowerCase().startsWith("hi") === true || /[\u0900-\u097f]/u.test(message);
}

function matchesEpisode(value: string) {
  const text = value.toLocaleLowerCase("en");
  const hanumanAndSita = /\bhanum[aá]n?\b/u.test(text) && /\bs[ií]t[aá]\b/u.test(text);
  return hanumanAndSita && /\b(speak|speech|language|deliberat|decid|thought|think|conversation|fear|trust)\w*/u.test(text)
    || /\bhanum[aá]n(?:'s)? deliberation\b/u.test(text)
    || /(हनुमान).*(सीता|विचार|बोल|भाषा|संवाद|निर्णय)/u.test(value)
    || /(सीता).*(हनुमान).*(बोल|संवाद|विचार)/u.test(value);
}

function citation(bundle: Bundle, passage: Passage): EvidenceCitation {
  const source = bundle.sources.find((candidate) => candidate.source_id === passage.source_id);
  if (!source) throw new Error("Ramayana reflection citation source missing");
  const locator = "byte_start" in passage
    ? {
        literalMarker: passage.literal_marker,
        byteStart: passage.byte_start,
        byteEndExclusive: passage.byte_end_exclusive,
        lineStart: passage.line_start,
        lineEnd: passage.line_end,
        spanSha256: passage.span_sha256,
        crosswalkStatus: bundle.crosswalk.status,
      }
    : {
        literalMarker: passage.literal_marker,
        carrierPageStart: passage.carrier_page_start,
        carrierPageEnd: passage.carrier_page_end,
        printedPageStart: passage.printed_page_start,
        printedPageEnd: passage.printed_page_end,
        pageEvidenceSha256: passage.page_evidence_sha256,
        crosswalkStatus: bundle.crosswalk.status,
      };
  return {
    passageId: passage.passage_id,
    sourceObjectId: source.source_object_id,
    sourceOrdinal: passage.source_ordinal,
    workTitle: source.work_title,
    editionTitle: source.edition_title,
    locator,
    rightsLane: "citation_only",
  };
}

function sourceBoundary() {
  return `Reviewed Devam synthesis from ${PACK_PATH} (${RAMAYANA_REFLECTION_PACK_SHA256}). It aligns GRETIL Book 5 sarga 28 with Griffith Canto XXX and visually reviewed Dutt Section XXX by ordered episode content, while preserving literal edition coordinates. No source text or uncorrected OCR is quoted; this one episode is not every Ramayana tradition or a universal rule.`;
}

export function searchReviewedRamayanaReflection(query: string, languageCode?: string): ReviewedRamayanaSearchResult[] {
  if (!matchesEpisode(query)) return [];
  const bundle = loadRamayanaReflectionBundle();
  const hindi = isHindi(query, languageCode);
  return [{
    id: `sundarakanda-hanuman-deliberation-${hindi ? "hi" : "en"}`,
    title: bundle.episode.title[hindi ? "hi" : "en"],
    statement: bundle.episode.story[hindi ? "hi" : "en"],
    languageCode: hindi ? "hi" : "en",
    claimKind: "reviewed_interpretive_lens",
    citations: bundle.passages.map((passage) => citation(bundle, passage)),
    sourceBoundary: sourceBoundary(),
  }];
}

export function answerReviewedRamayanaReflection(request: SarthiRequest): GroundedSarthiAnswer | null {
  if (!matchesEpisode(request.message)) return null;
  const bundle = loadRamayanaReflectionBundle();
  const hindi = isHindi(request.message, request.context?.languageCode);
  const personal = /\b(I|me|my|mine|we|our|conversation|decision|problem)\b/i.test(request.message)
    || /(मैं|मुझे|मेरा|मेरी|हम|हमारा|बातचीत|निर्णय|समस्या)/u.test(request.message);
  const answer = hindi
    ? `${bundle.episode.story.hi} इस प्रसंग से एक व्यावहारिक क्रम निकलता है: पहले वास्तविक उद्देश्य पहचानें, फिर सोचें कि आपकी बात सामने वाले को कैसी लगेगी, गलतफहमी और अगले परिणामों की जाँच करें, और सबसे छोटे सत्य व विश्वास बनाने वाले कदम से आरम्भ करें। यह श्रोता के अनुकूल सत्य संवाद है—छल या आवश्यक तथ्य छिपाना नहीं।`
    : `${bundle.episode.story.en} A practical sequence follows: name the real purpose, consider how the other person may receive your words, test likely misunderstandings and second-order effects, and begin with the smallest truthful step that can build trust. This is listener-aware truthfulness, not deception or concealment.`;
  const followUpQuestion = personal
    ? hindi
      ? "आप किस कठिन बातचीत की तैयारी कर रहे हैं, और सामने वाले की सबसे बड़ी आशंका क्या हो सकती है?"
      : "What difficult conversation are you preparing for, and what might the other person fear or misunderstand first?"
    : undefined;
  return {
    ok: true,
    mode: "reviewed_ramayana_reflection",
    answer: followUpQuestion ? `${answer} ${followUpQuestion}` : answer,
    citations: bundle.passages.map((passage) => citation(bundle, passage)),
    alternativesAvailable: true,
    sourceBoundary: sourceBoundary(),
    ...(followUpQuestion ? { followUpQuestion } : {}),
  };
}

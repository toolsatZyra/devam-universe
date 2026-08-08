import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import type { EvidenceCitation, GroundedSarthiAnswer, SarthiRequest } from "./contracts";
import type { SarthiRuntimePlan } from "./planner";

const PACK_PATH = "knowledge_packs/wisdom/proportional-giving-household-v1.json";
export const GIVING_GUIDANCE_PACK_SHA256 = "3974435abeb3b03a6b434447ba07b19f1387603b19f4f4c2bb9ac949340e69f2";
const SOURCE_SHA256 = "e10352273ea29958205dbc72b7b81a0df95eb3623a0b6439141e3e2a2d54b505";
const SOURCE_PATH = "source_vault/objects/sha256/e1/e10352273ea29958205dbc72b7b81a0df95eb3623a0b6439141e3e2a2d54b505";
const SOURCE_BYTE_COUNT = 2_056_476;

type Principle = {
  principle_id: string;
  source_id: string;
  source_ordinal: number;
  literal_marker: string;
  byte_start: number;
  byte_end_exclusive: number;
  line_start: number;
  line_end: number;
  span_sha256: string;
};

type Bundle = {
  contract: string;
  bundle_id: string;
  review_status: string;
  denials: Record<string, boolean>;
  sources: Array<{
    source_id: string;
    work_title: string;
    edition_title: string;
    source_object_id: string;
    source_path?: string;
    byte_count?: number;
    sha256?: string;
    rights_lane: "citation_only";
  }>;
  principles: Principle[];
  routes: Array<{ route_id: string; principle_ids: string[] }>;
};

const EXPECTED_PRINCIPLES = new Map<string, readonly [number, string, number, number, number, number, string]>([
  ["give-with-purpose-context-and-no-return", [554, "BhG 17.20", 1893442, 1895245, 16017, 16034, "357fe8f8928aa49412b8189f4d2b08e8daa2f1642abff210d59f0d4206f2f7ab"]],
  ["check-return-status-and-pressure", [555, "BhG 17.21", 1895246, 1896623, 16035, 16052, "309f7811d07d5642f8c8e76bfc6f777f4ad966ad9a12e5a369dcf7648c26d391"]],
  ["verify-purpose-recipient-and-respect", [556, "BhG 17.22", 1896624, 1897955, 16053, 16070, "21b5ab5e3eab37e7e62fb22cd1d349520c54f016588d249d37cf36e1ee6e9b6a"]],
  ["retain-considered-choice-without-fixed-percentage", [620, "BhG 18.63", 2021463, 2023820, 17475, 17491, "c4e9f638a76be55d5d04924f5407871866b8b88bed5ad494bdda8638ccff4042"]],
]);

let cachedBundle: Bundle | null = null;

function sha256(value: Buffer | string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function loadGivingGuidanceBundle(): Bundle {
  if (cachedBundle) return cachedBundle;
  const root = resolve(process.cwd(), "../..");
  const packBytes = readFileSync(resolve(root, PACK_PATH));
  if (sha256(packBytes) !== GIVING_GUIDANCE_PACK_SHA256) throw new Error("Giving guidance pack drift");
  const bundle = JSON.parse(packBytes.toString("utf8")) as Bundle;
  if (bundle.contract !== "DEVAM_SARTHI_REVIEWED_MORAL_GUIDANCE_V1"
    || bundle.bundle_id !== "proportional-giving-household-v1"
    || bundle.review_status !== "internal_beta_reviewed") throw new Error("Giving guidance contract drift");
  if (!Object.values(bundle.denials).every((value) => value === false)) throw new Error("Giving guidance denial drift");
  const source = bundle.sources.find((candidate) => candidate.source_id === "gretil-bhagavadgita-four-commentaries-tei");
  if (source?.source_path !== SOURCE_PATH || source.byte_count !== SOURCE_BYTE_COUNT || source.sha256 !== SOURCE_SHA256
    || source.source_object_id !== `sha256:${SOURCE_SHA256}` || source.rights_lane !== "citation_only") {
    throw new Error("Giving guidance source identity drift");
  }
  if (bundle.principles.length !== EXPECTED_PRINCIPLES.size) throw new Error("Giving guidance principle count drift");
  for (const principle of bundle.principles) {
    const identity = EXPECTED_PRINCIPLES.get(principle.principle_id);
    if (!identity
      || principle.source_ordinal !== identity[0]
      || principle.literal_marker !== identity[1]
      || principle.byte_start !== identity[2]
      || principle.byte_end_exclusive !== identity[3]
      || principle.line_start !== identity[4]
      || principle.line_end !== identity[5]
      || principle.span_sha256 !== identity[6]) {
      throw new Error("Giving guidance principle identity drift");
    }
  }
  cachedBundle = bundle;
  return bundle;
}

function isHindi(request: SarthiRequest): boolean {
  return request.context?.languageCode?.toLowerCase().startsWith("hi") === true || /[\u0900-\u097f]/u.test(request.message);
}

function conversationText(request: SarthiRequest): string {
  return [...(request.recentTurns ?? []).map((turn) => turn.content), request.message].join(" ");
}

function citation(bundle: Bundle, principle: Principle): EvidenceCitation {
  const source = bundle.sources.find((candidate) => candidate.source_id === principle.source_id);
  if (!source) throw new Error("Giving guidance citation source missing");
  return {
    passageId: `gretil-bhg4comm:${principle.source_ordinal}`,
    sourceObjectId: source.source_object_id,
    sourceOrdinal: principle.source_ordinal,
    workTitle: source.work_title,
    editionTitle: source.edition_title,
    locator: {
      literalMarker: principle.literal_marker,
      byteStart: principle.byte_start,
      byteEndExclusive: principle.byte_end_exclusive,
      lineStart: principle.line_start,
      lineEnd: principle.line_end,
      spanSha256: principle.span_sha256,
    },
    rightsLane: "citation_only",
  };
}

export function answerReviewedGivingGuidance(request: SarthiRequest, plan: SarthiRuntimePlan): GroundedSarthiAnswer | null {
  if (plan.decisionImpact === "urgent" || plan.taskClass !== "moral_ambiguity") return null;
  const text = conversationText(request).toLocaleLowerCase("en");
  const essentialsSecure = /\b(essential (?:household )?needs? (?:are )?(?:secure|covered|met)|necessities (?:are )?(?:secure|covered|met))\b/u.test(text)
    || /(घर की आवश्यक जरूरतें सुरक्षित|आवश्यक जरूरतें पूरी|जरूरी खर्च सुरक्षित)/u.test(text);
  const surplusChoice = /\b(surplus|extra spending|discretionary spending|money left over)\b/u.test(text)
    || /(अतिरिक्त खर्च|बची हुई राशि|अतिरिक्त धन)/u.test(text);
  if (!essentialsSecure || !surplusChoice) return null;

  const bundle = loadGivingGuidanceBundle();
  const selectedIds = bundle.routes.find((route) => route.route_id === "household-essentials-secured-surplus-giving")?.principle_ids ?? [];
  const selected = selectedIds
    .map((id) => bundle.principles.find((principle) => principle.principle_id === id))
    .filter((value): value is Principle => Boolean(value));
  if (selected.length !== 4) throw new Error("Giving guidance route drift");
  const hindi = isHindi(request);
  const followUpQuestion = hindi
    ? "क्या आप जिस दान या सेवा पर विचार कर रहे हैं उसका उद्देश्य और प्राप्तकर्ता तय है, और क्या कोई सामाजिक दबाव या बदले की अपेक्षा जुड़ी है?"
    : "Have you identified the purpose and recipient of the giving or service, and is any social pressure or expected return influencing the choice?";
  const answer = hindi
    ? `आपने निर्णायक सीमा स्पष्ट कर दी है: घर की आवश्यक जरूरतें सुरक्षित हैं और निर्णय वास्तविक अतिरिक्त राशि के बारे में है। इसलिए कोई धार्मिक रूप से तय प्रतिशत मानने की जरूरत नहीं है। पहले निकट भविष्य की प्रतिबद्धताओं और आपातकालीन गुंजाइश को फिर जाँचें; फिर बची राशि में से एक टिकाऊ सीमा चुनें। गीता 17.20–22 दान के उद्देश्य, प्राप्तकर्ता, समय, सम्मान, दबाव और बदले की अपेक्षा को देखने का वैकल्पिक दृष्टिकोण देती है; 18.63 विचार के बाद चुनाव आपके पास छोड़ती है। अनिश्चितता हो तो छोटी राशि, सत्यापित संस्था, प्रत्यक्ष उपयोगी वस्तु या गैर-मौद्रिक सेवा से शुरू करें और बाद में समीक्षा करें। यह देवम् का आवश्यकताओं-पहले और अनुपातिकता का संश्लेषण है—श्लोकों का अनुवाद, वित्तीय सलाह या पुण्य का वादा नहीं। ${followUpQuestion}`
    : `You have supplied the decisive boundary: essential household needs are secure and the decision concerns genuine surplus. There is no need to invent a religiously fixed percentage. Recheck near-term commitments and an emergency margin, then choose a sustainable range from what remains. Gita 17.20–22 offers an optional lens on purpose, recipient, timing, respect, pressure, and expected return; 18.63 leaves the considered choice with you. Where uncertainty remains, begin with a smaller amount, a verified recipient, a useful in-kind contribution, or non-monetary service, then review. This is Devam's essentials-first and proportionality synthesis—not a translation of the verses, financial advice, or a promise of merit. ${followUpQuestion}`;
  return {
    ok: true,
    mode: "reviewed_personal_guidance",
    answer,
    citations: selected.map((principle) => citation(bundle, principle)),
    alternativesAvailable: true,
    sourceBoundary: `Reviewed Devam synthesis from ${PACK_PATH} (${GIVING_GUIDANCE_PACK_SHA256}). Exact private source and commentary text is not quoted; essentials-first is an affected-party product boundary, while the cited passages are optional lenses on the quality and context of giving rather than a fixed percentage or financial advice.`,
    followUpQuestion,
  };
}

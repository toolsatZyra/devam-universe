import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import type { EvidenceCitation, GroundedSarthiAnswer, SarthiRequest } from "./contracts";
import type { SarthiRuntimePlan } from "./planner";

const PACK_PATH = "knowledge_packs/wisdom/anger-conflict-guidance-v1.json";
export const ANGER_CONFLICT_PACK_SHA256 = "54271cfe77f35d0c82ccb8912b9858149fe92fef79aac5f2db38ebd9f0bbd05d";
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

let cachedBundle: Bundle | null = null;

function sha256(value: Buffer | string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function loadAngerConflictBundle(): Bundle {
  if (cachedBundle) return cachedBundle;
  const root = resolve(process.cwd(), "../..");
  const packBytes = readFileSync(resolve(root, PACK_PATH));
  if (sha256(packBytes) !== ANGER_CONFLICT_PACK_SHA256) throw new Error("Anger-conflict pack drift");
  const bundle = JSON.parse(packBytes.toString("utf8")) as Bundle;
  if (bundle.contract !== "DEVAM_SARTHI_REVIEWED_PERSONAL_GUIDANCE_V1"
    || bundle.bundle_id !== "anger-conflict-guidance-v1"
    || bundle.review_status !== "internal_beta_reviewed") throw new Error("Anger-conflict contract drift");
  if (!Object.values(bundle.denials).every((value) => value === false)) throw new Error("Anger-conflict denial drift");
  const source = bundle.sources.find((candidate) => candidate.source_id === "gretil-bhagavadgita-four-commentaries-tei");
  if (source?.source_path !== SOURCE_PATH || source.byte_count !== SOURCE_BYTE_COUNT || source.sha256 !== SOURCE_SHA256 || source.source_object_id !== `sha256:${SOURCE_SHA256}` || source.rights_lane !== "citation_only") {
    throw new Error("Anger-conflict source identity drift");
  }
  const expected = new Map<string, readonly [number, string, number, number, number, number, string]>([
    ["notice-the-escalation-chain", [91, "BhG 2.62-63", 306053, 309733, 2913, 2937, "217401c55f988f461182e300c93bcd6e71b41a9e2934caee5c5d093ec1cad7df"]],
    ["take-one-self-directed-step", [217, "BhG 6.5", 733139, 735347, 6382, 6403, "aeb25125bcfc8c4bb46a7f92402eadf76ead5d95f8ced16a7f4e1077ead44839"]],
    ["compassion-with-boundaries", [444, "BhG 12.13-14", 1492050, 1499426, 12640, 12703, "521b1a63e04298be46edf0054bcad04679a70d1aad3b99fff55434c99d19873d"]],
  ]);
  if (bundle.principles.length !== expected.size) throw new Error("Anger-conflict principle count drift");
  for (const principle of bundle.principles) {
    const identity = expected.get(principle.principle_id);
    if (!identity
      || principle.source_ordinal !== identity[0]
      || principle.literal_marker !== identity[1]
      || principle.byte_start !== identity[2]
      || principle.byte_end_exclusive !== identity[3]
      || principle.line_start !== identity[4]
      || principle.line_end !== identity[5]
      || principle.span_sha256 !== identity[6]) {
      throw new Error("Anger-conflict principle identity drift");
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
  if (!source) throw new Error("Anger-conflict citation source missing");
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

export function answerReviewedAngerConflictGuidance(request: SarthiRequest, plan: SarthiRuntimePlan): GroundedSarthiAnswer | null {
  if (plan.decisionImpact === "urgent" || (plan.taskClass !== "personal_guidance" && plan.taskClass !== "moral_ambiguity")) return null;
  const text = conversationText(request).toLocaleLowerCase("en");
  const anger = /\b(anger|angry|temper|rage|fight|argument|conflict)\b/u.test(text) || /(क्रोध|गुस्सा|झगड़ा|बहस)/u.test(text);
  if (!anger) return null;
  const explicitSafety = /\b(no one is in danger|no danger|everyone is safe|nobody is unsafe)\b/u.test(text) || /(कोई खतरे में नहीं|सब सुरक्षित हैं)/u.test(text);
  const recurringPattern = /\b(keep|keeps|again|usually|often|every time|recurring|pattern|before it happens)\b/u.test(text) || /(बार-बार|हर बार|अक्सर|होने से पहले)/u.test(text);
  if (!explicitSafety || !recurringPattern) return null;

  const bundle = loadAngerConflictBundle();
  const selectedIds = bundle.routes.find((route) => route.route_id === "recurring-anger-conflict")?.principle_ids ?? [];
  const selected = selectedIds.map((id) => bundle.principles.find((principle) => principle.principle_id === id)).filter((value): value is Principle => Boolean(value));
  if (selected.length !== 3) throw new Error("Anger-conflict route drift");
  const hindi = isHindi(request);
  const followUpQuestion = hindi
    ? "गुस्सा बढ़ने से ठीक पहले आम तौर पर क्या होता है—कोई खास बात, शरीर में कोई संकेत, या वही पुराना विवाद?"
    : "What usually happens just before the anger rises—a particular statement, a body cue, or the same unresolved issue?";
  const answer = hindi
    ? `इसे “आप बुरे हैं” वाला धार्मिक फैसला न बनाएँ। गीता 2.62–63 को एक चेतावनी-मानचित्र की तरह पढ़ा जा सकता है: बार-बार किसी शिकायत पर टिकना आसक्ति और बाधित इच्छा से क्रोध तथा कमजोर निर्णय तक जा सकता है। अगली बार पहला संकेत दिखे तो उत्तर देने से पहले छोटा विराम लें, तथ्य–ज़रूरत–अनुमान अलग लिखें, और केवल उस उद्देश्य व सीमा के साथ लौटें जिसे आप शांत होकर कह सकें। गीता 6.5 अपनी ओर से एक स्थिर करने वाला कदम चुनने की याद दिलाती है; यह आत्म-दोष नहीं है। 12.13–14 की करुणा का अर्थ सहमति, निकटता या मेल-मिलाप अनिवार्य होना भी नहीं है। यदि कभी सुरक्षा बदलती है, तो दूरी और मानवीय सहायता इस चिंतन से पहले आएँगी। ${followUpQuestion}`
    : `Do not turn this into a religious verdict that anger makes you a bad person. Gita 2.62–63 can be used as a warning map: repeatedly dwelling on a grievance may feed attachment, frustrated desire, anger, and poorer judgment. At the first cue, pause before replying, separate facts from needs and assumptions, and return only with a concrete purpose and boundary you can state steadily. Gita 6.5 supports choosing one self-directed stabilizing step; it does not mean self-blame. The compassion of 12.13–14 does not require agreement, access, or reconciliation. If safety ever changes, distance and human help come before reflection. ${followUpQuestion}`;
  return {
    ok: true,
    mode: "reviewed_personal_guidance",
    answer,
    citations: selected.map((principle) => citation(bundle, principle)),
    alternativesAvailable: true,
    sourceBoundary: `Reviewed Devam synthesis from ${PACK_PATH} (${ANGER_CONFLICT_PACK_SHA256}). Exact private source and commentary text is not quoted; the three passages are reflective lenses, not diagnosis, blame, forced reconciliation, or the complete Bhagavadgita tradition.`,
    followUpQuestion,
  };
}

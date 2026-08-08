import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import type { EvidenceCitation, GroundedSarthiAnswer, SarthiRequest } from "./contracts";
import type { SarthiRuntimePlan } from "./planner";

const PACK_PATH = "knowledge_packs/wisdom/work-care-prioritization-v1.json";
export const WORK_CARE_GUIDANCE_PACK_SHA256 = "1898680e1b3ad37c37219969f5eb5d9fae9445981a648c1b3777a557087f02d6";
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
  ["identify-the-necessary-present-action", [108, "BhG 3.8", 366247, 368593, 3383, 3402, "97b5ff3d410ef9b8c809e8ffeb36754bb4d52622438eaa8caf93247c03411feb"]],
  ["restore-a-sustainable-pattern", [227, "BhG 6.17", 779495, 781662, 6695, 6720, "7814db3d00b5c96041f62f21210543b35519ffbcf986cd7c738d5f56a4559f57"]],
  ["communicate-the-tradeoff-clearly", [549, "BhG 17.15", 1886257, 1887791, 15925, 15943, "344198b00aa33cf5651bc6bcc6fccceea06bcb72cefe3fdae8d3c9f6cad0bc24"]],
  ["choose-and-set-a-review-point", [620, "BhG 18.63", 2021463, 2023820, 17475, 17491, "c4e9f638a76be55d5d04924f5407871866b8b88bed5ad494bdda8638ccff4042"]],
]);

let cachedBundle: Bundle | null = null;

function sha256(value: Buffer | string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function loadWorkCareGuidanceBundle(): Bundle {
  if (cachedBundle) return cachedBundle;
  const root = resolve(process.cwd(), "../..");
  const packBytes = readFileSync(resolve(root, PACK_PATH));
  if (sha256(packBytes) !== WORK_CARE_GUIDANCE_PACK_SHA256) throw new Error("Work-care guidance pack drift");
  const bundle = JSON.parse(packBytes.toString("utf8")) as Bundle;
  if (bundle.contract !== "DEVAM_SARTHI_REVIEWED_PERSONAL_GUIDANCE_V1"
    || bundle.bundle_id !== "work-care-prioritization-v1"
    || bundle.review_status !== "internal_beta_reviewed") throw new Error("Work-care guidance contract drift");
  if (!Object.values(bundle.denials).every((value) => value === false)) throw new Error("Work-care guidance denial drift");
  const source = bundle.sources.find((candidate) => candidate.source_id === "gretil-bhagavadgita-four-commentaries-tei");
  if (source?.source_path !== SOURCE_PATH || source.byte_count !== SOURCE_BYTE_COUNT || source.sha256 !== SOURCE_SHA256
    || source.source_object_id !== `sha256:${SOURCE_SHA256}` || source.rights_lane !== "citation_only") {
    throw new Error("Work-care guidance source identity drift");
  }
  const sourceBytes = readFileSync(resolve(root, SOURCE_PATH));
  if (sourceBytes.length !== SOURCE_BYTE_COUNT || sha256(sourceBytes) !== SOURCE_SHA256) throw new Error("Work-care guidance source payload drift");
  if (bundle.principles.length !== EXPECTED_PRINCIPLES.size) throw new Error("Work-care guidance principle count drift");
  for (const principle of bundle.principles) {
    const identity = EXPECTED_PRINCIPLES.get(principle.principle_id);
    if (!identity
      || principle.source_ordinal !== identity[0]
      || principle.literal_marker !== identity[1]
      || principle.byte_start !== identity[2]
      || principle.byte_end_exclusive !== identity[3]
      || principle.line_start !== identity[4]
      || principle.line_end !== identity[5]
      || principle.span_sha256 !== identity[6]
      || sha256(sourceBytes.subarray(principle.byte_start, principle.byte_end_exclusive)) !== principle.span_sha256) {
      throw new Error("Work-care guidance principle identity drift");
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
  if (!source) throw new Error("Work-care guidance citation source missing");
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

export function answerReviewedWorkCareGuidance(request: SarthiRequest, plan: SarthiRuntimePlan): GroundedSarthiAnswer | null {
  if (plan.decisionImpact === "urgent" || plan.taskClass !== "personal_guidance") return null;
  const text = conversationText(request).toLocaleLowerCase("en");
  const careContext = /\b(child|parent|dependent|care|caregiving|family need)\b/u.test(text)
    || /(बच्चे|बच्चा|माता|पिता|आश्रित|देखभाल|परिवार)/u.test(text);
  const immediateNeed = /\b(essential|needs? care (?:today|now)|cannot wait|non-deferrable|time-sensitive)\b/u.test(text)
    || /(आज आवश्यक देखभाल|अभी आवश्यक|नहीं टाल|तत्काल देखभाल)/u.test(text);
  const safeDeferral = /\b(work|tasks?|meetings?|deadline).{0,40}(can wait|can be postponed|can be deferred|not urgent)\b/u.test(text)
    || /\b(can wait|can be postponed|can be deferred|not urgent).{0,40}(work|tasks?|meetings?|deadline)\b/u.test(text)
    || /(बाकी काम टाले जा सकते|काम टल सकते|काम अभी आवश्यक नहीं)/u.test(text);
  if (!careContext || !immediateNeed || !safeDeferral) return null;

  const bundle = loadWorkCareGuidanceBundle();
  const selectedIds = bundle.routes.find((route) => route.route_id === "immediate-care-versus-deferrable-work")?.principle_ids ?? [];
  const selected = selectedIds
    .map((id) => bundle.principles.find((principle) => principle.principle_id === id))
    .filter((value): value is Principle => Boolean(value));
  if (selected.length !== 4) throw new Error("Work-care guidance route drift");
  const hindi = isHindi(request);
  const followUpQuestion = hindi
    ? "अभी न्यूनतम आवश्यक देखभाल क्या है, और किस व्यक्ति को टाले गए काम के बारे में छोटा स्पष्ट संदेश भेजना है?"
    : "What is the minimum care needed right now, and who needs a short, clear message about the deferred work?";
  const answer = hindi
    ? `आपने एक निर्णायक बात स्पष्ट कर दी है: बच्चे की देखभाल आज आवश्यक है और बाकी काम सुरक्षित रूप से टाले जा सकते हैं। इसलिए अभी का छोटा, उलट सकने योग्य कदम देखभाल को पहले लेना है—यह स्थायी जीवन-निर्णय नहीं है। काम पर जाने से पहले संबंधित व्यक्ति को संक्षिप्त संदेश भेजें: क्या बदला है, आज क्या नहीं हो पाएगा और आप अगली समीक्षा कब करेंगे। गीता 3.8 को अभी के आवश्यक कर्म की याद की तरह, 17.15 को सत्य व उपयोगी संवाद की तरह और 18.63 को विचार के बाद अपना चुनाव व समीक्षा-बिन्दु रखने की तरह पढ़ा जा सकता है। 6.17 याद दिलाती है कि संकट बीतने पर काम, देखभाल, विश्राम और सहायता का टिकाऊ क्रम फिर बनाना होगा। यह किसी लिंग पर देखभाल का कर्तव्य नहीं डालता, आत्म-उपेक्षा की प्रशंसा नहीं करता और हर परिवार–काम संघर्ष का धार्मिक निर्णय नहीं है। ${followUpQuestion}`
    : `You have already supplied the decisive fact: your child's care is necessary today and the remaining work can safely wait. So the small reversible next step is to take the care need first; this is not a permanent life decision. Before switching, send the relevant person a brief message stating what changed, what will not happen today, and when you will review it. Gita 3.8 can serve as a lens for the necessary present action, 17.15 for truthful and useful coordination, and 18.63 for retaining considered choice and a review point. Gita 6.17 is a reminder to rebuild a sustainable pattern of work, care, rest, and support after the immediate need. This does not assign care by gender, praise self-neglect, or religiously decide every work-family conflict. ${followUpQuestion}`;
  return {
    ok: true,
    mode: "reviewed_personal_guidance",
    answer,
    citations: selected.map((principle) => citation(bundle, principle)),
    alternativesAvailable: true,
    sourceBoundary: `Reviewed Devam synthesis from ${PACK_PATH} (${WORK_CARE_GUIDANCE_PACK_SHA256}). Exact private source and commentary text is not quoted; priority comes from the user's stated affected-party and deferral facts, while the passages remain optional lenses rather than a universal duty assignment.`,
    followUpQuestion,
  };
}

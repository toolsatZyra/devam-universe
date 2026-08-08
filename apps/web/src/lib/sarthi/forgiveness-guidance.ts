import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import type { EvidenceCitation, GroundedSarthiAnswer, SarthiRequest } from "./contracts";
import type { SarthiRuntimePlan } from "./planner";

const PACK_PATH = "knowledge_packs/wisdom/forgiveness-with-boundaries-v1.json";
export const FORGIVENESS_GUIDANCE_PACK_SHA256 = "c36dc33a929e6858870d0c8e20b1ce721543238750b3d29e0ff67117e76899b0";
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
  ["one-protective-action-without-self-blame", [217, "BhG 6.5", 733139, 735347, 6382, 6403, "aeb25125bcfc8c4bb46a7f92402eadf76ead5d95f8ced16a7f4e1077ead44839"]],
  ["compassion-without-contact-or-reconciliation", [444, "BhG 12.13-14", 1492050, 1499426, 12640, 12703, "521b1a63e04298be46edf0054bcad04679a70d1aad3b99fff55434c99d19873d"]],
  ["state-the-boundary-without-opening-negotiation", [549, "BhG 17.15", 1886257, 1887791, 15925, 15943, "344198b00aa33cf5651bc6bcc6fccceea06bcb72cefe3fdae8d3c9f6cad0bc24"]],
  ["reconciliation-needs-safety-accountability-and-consent", [620, "BhG 18.63", 2021463, 2023820, 17475, 17491, "c4e9f638a76be55d5d04924f5407871866b8b88bed5ad494bdda8638ccff4042"]],
]);

let cachedBundle: Bundle | null = null;

function sha256(value: Buffer | string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function loadForgivenessGuidanceBundle(): Bundle {
  if (cachedBundle) return cachedBundle;
  const root = resolve(process.cwd(), "../..");
  const packBytes = readFileSync(resolve(root, PACK_PATH));
  if (sha256(packBytes) !== FORGIVENESS_GUIDANCE_PACK_SHA256) throw new Error("Forgiveness guidance pack drift");
  const bundle = JSON.parse(packBytes.toString("utf8")) as Bundle;
  if (bundle.contract !== "DEVAM_SARTHI_REVIEWED_MORAL_GUIDANCE_V1"
    || bundle.bundle_id !== "forgiveness-with-boundaries-v1"
    || bundle.review_status !== "internal_beta_reviewed") throw new Error("Forgiveness guidance contract drift");
  if (!Object.values(bundle.denials).every((value) => value === false)) throw new Error("Forgiveness guidance denial drift");
  const source = bundle.sources.find((candidate) => candidate.source_id === "gretil-bhagavadgita-four-commentaries-tei");
  if (source?.source_path !== SOURCE_PATH || source.byte_count !== SOURCE_BYTE_COUNT || source.sha256 !== SOURCE_SHA256
    || source.source_object_id !== `sha256:${SOURCE_SHA256}` || source.rights_lane !== "citation_only") {
    throw new Error("Forgiveness guidance source identity drift");
  }
  const sourceBytes = readFileSync(resolve(root, SOURCE_PATH));
  if (sourceBytes.length !== SOURCE_BYTE_COUNT || sha256(sourceBytes) !== SOURCE_SHA256) throw new Error("Forgiveness guidance source payload drift");
  if (bundle.principles.length !== EXPECTED_PRINCIPLES.size) throw new Error("Forgiveness guidance principle count drift");
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
      throw new Error("Forgiveness guidance principle identity drift");
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
  if (!source) throw new Error("Forgiveness guidance citation source missing");
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

export function answerReviewedForgivenessGuidance(request: SarthiRequest, plan: SarthiRuntimePlan): GroundedSarthiAnswer | null {
  if (plan.decisionImpact === "urgent" || plan.taskClass !== "moral_ambiguity") return null;
  const text = conversationText(request).toLocaleLowerCase("en");
  const continuingHarm = /\b(keeps? harming|keeps? hurting|continu(?:es|ing) (?:to )?(?:harm|hurt)|ongoing harm|repeated harm)\b/u.test(text)
    || /(हानि जारी|बार-बार हानि|नुकसान जारी|चोट पहुँचाता रहता)/u.test(text);
  const renewedAccess = /\b(wants? access again|renewed access|let (?:him|her|them) back|contact again|reconcil(?:e|iation)|restore (?:contact|trust))\b/u.test(text)
    || /(फिर से पहुँच|दोबारा सम्पर्क|मेल-मिलाप|फिर से भरोसा)/u.test(text);
  if (!continuingHarm || !renewedAccess) return null;

  const bundle = loadForgivenessGuidanceBundle();
  const selectedIds = bundle.routes.find((route) => route.route_id === "ongoing-harm-renewed-access-request")?.principle_ids ?? [];
  const selected = selectedIds
    .map((id) => bundle.principles.find((principle) => principle.principle_id === id))
    .filter((value): value is Principle => Boolean(value));
  if (selected.length !== 4) throw new Error("Forgiveness guidance route drift");
  const hindi = isHindi(request);
  const followUpQuestion = hindi
    ? "क्या उस व्यक्ति की अभी आप तक पहुँच है, और दूरी बनाए रखने के लिए किसी विश्वसनीय व्यक्ति या व्यावहारिक सहायता की जरूरत है?"
    : "Does this person currently have access to you, and would a trusted person or practical support help you maintain the boundary safely?";
  const answer = hindi
    ? `क्षमा, भीतर का बोझ छोड़ना, विश्वास, सम्पर्क, पहुँच और मेल-मिलाप एक ही बात नहीं हैं। धर्म आपको जारी हानि के बीच किसी को फिर से पहुँच देने के लिए बाध्य नहीं करता। अभी एक स्पष्ट सीमा पर्याप्त हो सकती है: “मैं इस समय सम्पर्क या पहुँच के लिए उपलब्ध नहीं हूँ।” उत्तर देना असुरक्षित हो तो उत्तर देना भी आवश्यक नहीं है। गीता 6.5 अपने नियंत्रण में एक संरक्षणकारी कदम, 12.13–14 करुणा को द्वेष से अलग रखने, 17.15 सत्य और अहिंसक वाणी, और 18.63 विचार के बाद स्वतंत्र चुनाव का वैकल्पिक दृष्टिकोण देती है। भविष्य में मेल-मिलाप पर केवल सुरक्षा, उत्तरदायित्व, प्रमाणित परिवर्तन और आपकी स्वतंत्र सहमति के साथ विचार करें। यदि खतरा तत्काल है, आध्यात्मिक सलाह से पहले मानवीय सहायता लें। ${followUpQuestion}`
    : `Forgiveness, inner release, trust, contact, access, and reconciliation are not the same thing. Dharma does not require you to restore access while harm continues. One clear boundary can be enough: “I am not available for contact or access at this time.” If replying would be unsafe, you do not owe a reply. Gita 6.5 offers the optional lens of one protective action within your control, 12.13–14 compassion without hatred, 17.15 truthful non-humiliating speech, and 18.63 room for considered choice after counsel. Reconciliation should be reconsidered only with safety, accountability, demonstrated change, and your freely given consent. If danger is immediate, seek human help before spiritual reflection. ${followUpQuestion}`;
  return {
    ok: true,
    mode: "reviewed_personal_guidance",
    answer,
    citations: selected.map((principle) => citation(bundle, principle)),
    alternativesAvailable: true,
    sourceBoundary: `Reviewed Devam synthesis from ${PACK_PATH} (${FORGIVENESS_GUIDANCE_PACK_SHA256}). Exact private source and commentary text is not quoted; the boundary separates forgiveness from trust, contact, access, and reconciliation, and does not diagnose abuse or replace emergency, legal, safeguarding, mental-health, or trusted human support.`,
    followUpQuestion,
  };
}

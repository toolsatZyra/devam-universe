import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import type { EvidenceCitation, GroundedSarthiAnswer, SarthiRequest } from "./contracts";
import type { SarthiRuntimePlan } from "./planner";

const PACK_PATH = "knowledge_packs/wisdom/religious-participation-consent-v1.json";
export const CONSENT_GUIDANCE_PACK_SHA256 = "014a3597c1cc61960226233d235821b3d168b6731a25d0491a6b840a3d6da570";
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
  ["compassion-without-entitlement", [444, "BhG 12.13-14", 1492050, 1499426, 12640, 12703, "521b1a63e04298be46edf0054bcad04679a70d1aad3b99fff55434c99d19873d"]],
  ["speak-without-disguised-pressure", [549, "BhG 17.15", 1886257, 1887791, 15925, 15943, "344198b00aa33cf5651bc6bcc6fccceea06bcb72cefe3fdae8d3c9f6cad0bc24"]],
  ["counsel-without-taking-the-choice", [620, "BhG 18.63", 2021463, 2023820, 17475, 17491, "c4e9f638a76be55d5d04924f5407871866b8b88bed5ad494bdda8638ccff4042"]],
]);

let cachedBundle: Bundle | null = null;

function sha256(value: Buffer | string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function loadConsentGuidanceBundle(): Bundle {
  if (cachedBundle) return cachedBundle;
  const root = resolve(process.cwd(), "../..");
  const packBytes = readFileSync(resolve(root, PACK_PATH));
  if (sha256(packBytes) !== CONSENT_GUIDANCE_PACK_SHA256) throw new Error("Consent guidance pack drift");
  const bundle = JSON.parse(packBytes.toString("utf8")) as Bundle;
  if (bundle.contract !== "DEVAM_SARTHI_REVIEWED_MORAL_GUIDANCE_V1"
    || bundle.bundle_id !== "religious-participation-consent-v1"
    || bundle.review_status !== "internal_beta_reviewed") throw new Error("Consent guidance contract drift");
  if (!Object.values(bundle.denials).every((value) => value === false)) throw new Error("Consent guidance denial drift");
  const source = bundle.sources.find((candidate) => candidate.source_id === "gretil-bhagavadgita-four-commentaries-tei");
  if (source?.source_path !== SOURCE_PATH || source.byte_count !== SOURCE_BYTE_COUNT || source.sha256 !== SOURCE_SHA256
    || source.source_object_id !== `sha256:${SOURCE_SHA256}` || source.rights_lane !== "citation_only") {
    throw new Error("Consent guidance source identity drift");
  }
  const sourceBytes = readFileSync(resolve(root, SOURCE_PATH));
  if (sourceBytes.length !== SOURCE_BYTE_COUNT || sha256(sourceBytes) !== SOURCE_SHA256) throw new Error("Consent guidance source payload drift");
  if (bundle.principles.length !== EXPECTED_PRINCIPLES.size) throw new Error("Consent guidance principle count drift");
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
      throw new Error("Consent guidance principle identity drift");
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
  if (!source) throw new Error("Consent guidance citation source missing");
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

export function answerReviewedConsentGuidance(request: SarthiRequest, plan: SarthiRuntimePlan): GroundedSarthiAnswer | null {
  if (plan.decisionImpact === "urgent" || plan.taskClass !== "moral_ambiguity") return null;
  const text = conversationText(request).toLocaleLowerCase("en");
  const adultDependent = /\b(adult dependent|dependent adult|competent adult)\b/u.test(text)
    || /(वयस्क आश्रित|आश्रित वयस्क|सक्षम वयस्क)/u.test(text);
  const explicitRefusal = /\b(clearly refuses?|explicitly refuses?|does not consent|says? no)\b/u.test(text)
    || /(स्पष्ट रूप से मना|मना कर रहा|सहमति नहीं)/u.test(text);
  const familyPressure = /\b(family (?:is )?pressur|forced religious|forcing .{0,30}(?:puja|ritual|prayer))\b/u.test(text)
    || /(परिवार दबाव|परिवार.*दबाव|धार्मिक दबाव)/u.test(text);
  if (!adultDependent || !explicitRefusal || !familyPressure) return null;

  const bundle = loadConsentGuidanceBundle();
  const selectedIds = bundle.routes.find((route) => route.route_id === "competent-adult-explicit-ritual-refusal")?.principle_ids ?? [];
  const selected = selectedIds
    .map((id) => bundle.principles.find((principle) => principle.principle_id === id))
    .filter((value): value is Principle => Boolean(value));
  if (selected.length !== 3) throw new Error("Consent guidance route drift");
  const hindi = isHindi(request);
  const followUpQuestion = hindi
    ? "क्या उनके मना करने पर पैसे, आवास, सम्बन्ध या सुरक्षा की कोई धमकी दी जा रही है, और कौन-सी केवल व्यावहारिक पारिवारिक व्यवस्था अभी अलग से तय करनी है?"
    : "Is refusal bringing any threat to money, housing, relationship, or safety—and what purely practical family arrangement still needs to be discussed separately?";
  const answer = hindi
    ? `यदि वह निर्णय लेने में सक्षम वयस्क आश्रित है और स्पष्ट रूप से मना कर रहा है, तो परिवार को उसका इनकार स्वीकार करना चाहिए। पूजा में भाग लेने के लिए बार-बार आग्रह, अपराध-बोध, धर्म का भय, आर्थिक या आवासीय दबाव न दें। पहले कहें: “हमने आपका निर्णय सुन लिया है; भाग न लेने पर दण्ड नहीं होगा।” फिर केवल व्यावहारिक विकल्प पूछें—पूरी तरह अलग रहना, केवल सामाजिक भोजन में अपनी इच्छा से आना, या कोई अन्य व्यवस्था—और इनकार को बहस का निमंत्रण न मानें। गीता 12.13–14 करुणा और संयम, 17.15 सत्य व अहिंसक संवाद और 18.63 परामर्श के बाद व्यक्ति के चुनाव को स्थान देने के वैकल्पिक दृष्टिकोण देती है। यह देवम् की वयस्क सहमति और गैर-दबाव सीमा है; यह हर बालक, क्षमता, कानून, सुरक्षा या पारिवारिक दायित्व का एक ही धार्मिक निर्णय नहीं है। ${followUpQuestion}`
    : `If this is a competent adult dependent who has clearly refused, the family should acknowledge the refusal. Stop repeated requests, guilt, religious fear, and any financial or housing pressure tied to participation. Begin with: “We have heard your decision; declining will not be punished.” Then discuss only practical options—staying separate, voluntarily joining a social meal, or another arrangement—and do not treat “no” as an invitation to restart the debate. Gita 12.13–14 offers compassion and restraint, 17.15 truthful non-humiliating speech, and 18.63 room for a person's choice after counsel. This is Devam's adult-consent and non-coercion boundary; it is not one religious verdict for every child, capacity, legal, safety, or family-duty situation. ${followUpQuestion}`;
  return {
    ok: true,
    mode: "reviewed_personal_guidance",
    answer,
    citations: selected.map((principle) => citation(bundle, principle)),
    alternativesAvailable: true,
    sourceBoundary: `Reviewed Devam synthesis from ${PACK_PATH} (${CONSENT_GUIDANCE_PACK_SHA256}). Exact private source and commentary text is not quoted; competent-adult refusal and non-retaliation are the product boundary, while the passages remain optional lenses rather than authorization or legal advice.`,
    followUpQuestion,
  };
}

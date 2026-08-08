import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import type { EvidenceCitation, GroundedSarthiAnswer, SarthiRequest } from "./contracts";
import type { SarthiRuntimePlan } from "./planner";

const PACK_PATH = "knowledge_packs/wisdom/grief-companion-v1.json";
export const GRIEF_GUIDANCE_PACK_SHA256 = "93ac10a0d64773dff08222a6c4152a8b1feaa6ade00b6a571fa39b2833a5dd5a";
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
  ["never-shame-grief-with-scripture", [43, "BhG 2.11", 105551, 108889, 1409, 1429, "7040908c59c92a778a2f2e55c3ec98f44bca6a6048aab3bcecb653d25c300770"]],
  ["continuity-as-an-optional-lens", [45, "BhG 2.13", 112792, 116611, 1453, 1474, "2348d99c6c40f718d88625d64de0e0f5507e3206ce7ae946885c3c2c74c223e9"]],
  ["one-wave-and-one-need-at-a-time", [46, "BhG 2.14", 116612, 119676, 1475, 1494, "b3f6e85a89ddb78beedffe4ca9b006ea48f7cce1abe975a5964634fe2dc2d426"]],
  ["compassionate-presence-without-pressure", [444, "BhG 12.13-14", 1492050, 1499426, 12640, 12703, "521b1a63e04298be46edf0054bcad04679a70d1aad3b99fff55434c99d19873d"]],
]);

let cachedBundle: Bundle | null = null;

function sha256(value: Buffer | string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function loadGriefGuidanceBundle(): Bundle {
  if (cachedBundle) return cachedBundle;
  const root = resolve(process.cwd(), "../..");
  const packBytes = readFileSync(resolve(root, PACK_PATH));
  if (sha256(packBytes) !== GRIEF_GUIDANCE_PACK_SHA256) throw new Error("Grief guidance pack drift");
  const bundle = JSON.parse(packBytes.toString("utf8")) as Bundle;
  if (bundle.contract !== "DEVAM_SARTHI_REVIEWED_PERSONAL_GUIDANCE_V1"
    || bundle.bundle_id !== "grief-companion-v1"
    || bundle.review_status !== "internal_beta_reviewed") throw new Error("Grief guidance contract drift");
  if (!Object.values(bundle.denials).every((value) => value === false)) throw new Error("Grief guidance denial drift");
  const source = bundle.sources.find((candidate) => candidate.source_id === "gretil-bhagavadgita-four-commentaries-tei");
  if (source?.source_path !== SOURCE_PATH || source.byte_count !== SOURCE_BYTE_COUNT || source.sha256 !== SOURCE_SHA256
    || source.source_object_id !== `sha256:${SOURCE_SHA256}` || source.rights_lane !== "citation_only") {
    throw new Error("Grief guidance source identity drift");
  }
  const sourceBytes = readFileSync(resolve(root, SOURCE_PATH));
  if (sourceBytes.length !== SOURCE_BYTE_COUNT || sha256(sourceBytes) !== SOURCE_SHA256) throw new Error("Grief guidance source payload drift");
  if (bundle.principles.length !== EXPECTED_PRINCIPLES.size) throw new Error("Grief guidance principle count drift");
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
      throw new Error("Grief guidance principle identity drift");
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
  if (!source) throw new Error("Grief guidance citation source missing");
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

export function answerReviewedGriefGuidance(request: SarthiRequest, plan: SarthiRuntimePlan): GroundedSarthiAnswer | null {
  if (plan.decisionImpact === "urgent" || (plan.taskClass !== "personal_guidance" && plan.taskClass !== "reflection")) return null;
  const text = conversationText(request).toLocaleLowerCase("en");
  const grief = /\b(grief|grieving|bereavement|died|death|lost someone)\b/u.test(text)
    || /(शोक|मृत्यु|निधन|खो दिया)/u.test(text);
  const explicitOptIn = /\b(gentle|source-grounded|reflection|gita|bhagavad|prayer|reading|not a command|not a cure)\b/u.test(text)
    || /(कोमल|स्रोत|चिंतन|गीता|प्रार्थना|पाठ|आदेश नहीं|उपचार नहीं)/u.test(text);
  if (!grief || !explicitOptIn) return null;

  const bundle = loadGriefGuidanceBundle();
  const selectedIds = bundle.routes.find((route) => route.route_id === "gentle-grief-reflection")?.principle_ids ?? [];
  const selected = selectedIds
    .map((id) => bundle.principles.find((principle) => principle.principle_id === id))
    .filter((value): value is Principle => Boolean(value));
  if (selected.length !== 4) throw new Error("Grief guidance route drift");
  const hindi = isHindi(request);
  const followUpQuestion = hindi
    ? "यदि आप चाहें, तो किस व्यक्ति, सम्बन्ध या जीवन-अध्याय का शोक है—और क्या अभी स्मृति साझा करना, छोटी प्रार्थना, व्यावहारिक सहारा या केवल साथ अधिक उपयोगी होगा?"
    : "If you want to share, whom or what are you grieving—and would a memory, a short prayer, practical support, or simply being heard help most right now?";
  const answer = hindi
    ? `कोई ग्रन्थ यह सिद्ध नहीं करता कि आपको अब शोक महसूस करना बन्द कर देना चाहिए। गीता 2.11 को शोक के लिए लज्जित करने या आध्यात्मिक विफलता बताने के लिए उपयोग करना उचित नहीं होगा। यदि यह दृष्टि आपको सहारा देती है, तो 2.13 परिवर्तन के बीच निरन्तरता पर चिंतन का एक विकल्प देता है—किसी ऐसे सम्बन्ध, स्मृति या मूल्य को नाम दें जो अब भी आपके जीवन को आकार देता है। 2.14 को भावना मिटाने की माँग नहीं, बल्कि एक समय में शोक की एक लहर और आज की एक छोटी आवश्यकता के साथ रहने की अनुमति की तरह लें। 12.13–14 की करुणा इस समय कोमल साथ और बिना समय-सीमा के धैर्य की ओर संकेत कर सकती है। आज के लिए केवल दो बातें चुनना पर्याप्त है: एक स्मृति या मूल्य जिसे आप सँजोना चाहते हैं, और भोजन, पानी, विश्राम या किसी भरोसेमंद व्यक्ति को संदेश जैसी एक छोटी आवश्यकता। यह दृष्टि वैकल्पिक है; आपका शोक, विश्वास और सहारा चुनने का अधिकार आपका है। ${followUpQuestion}`
    : `No scripture proves that you should have stopped grieving by now. Gita 2.11 should not be used to shame grief or label it a spiritual failure. If this lens feels supportive, 2.13 offers an optional reflection on continuity through change: name one relationship, memory, or value that still shapes your life. Read 2.14 not as an order to erase feeling, but as permission to meet one wave of grief and one present need at a time. The compassion of 12.13–14 can point toward gentle company and patience without a recovery deadline. For today, two things are enough: one memory or value you want to carry, and one small need such as food, water, rest, or messaging someone you trust. This lens is optional; your grief, beliefs, and choice of support remain yours. ${followUpQuestion}`;
  return {
    ok: true,
    mode: "reviewed_personal_guidance",
    answer,
    citations: selected.map((principle) => citation(bundle, principle)),
    alternativesAvailable: true,
    sourceBoundary: `Reviewed Devam synthesis from ${PACK_PATH} (${GRIEF_GUIDANCE_PACK_SHA256}). Exact private source and commentary text is not quoted; these passages are optional reflective lenses, not diagnosis, cure, metaphysical proof, emotional timetable, or the complete Bhagavadgita tradition.`,
    followUpQuestion,
  };
}

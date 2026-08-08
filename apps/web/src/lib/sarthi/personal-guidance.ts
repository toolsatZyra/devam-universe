import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import type { EvidenceCitation, GroundedSarthiAnswer, SarthiRequest } from "./contracts";
import type { SarthiRuntimePlan } from "./planner";

const PACK_PATH = "knowledge_packs/wisdom/personal-guidance-foundation-v1.json";
export const PERSONAL_GUIDANCE_PACK_SHA256 = "423334be7bd4aa2d66129bf84894a60b6d7cb7b22ca1f9edee147f92d9d37eca";
const SOURCE_SHA256 = "e10352273ea29958205dbc72b7b81a0df95eb3623a0b6439141e3e2a2d54b505";

type Principle = {
  principle_id: string;
  source_ordinal: number;
  literal_marker: string;
  byte_start: number;
  byte_end_exclusive: number;
  line_start: number;
  line_end: number;
  span_sha256: string;
  en: string;
  hi: string;
  application_boundary: string;
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

function sha256(bytes: Buffer | string): string {
  return createHash("sha256").update(bytes).digest("hex");
}

export function loadPersonalGuidanceBundle(): Bundle {
  if (cachedBundle) return cachedBundle;
  const root = resolve(process.cwd(), "../..");
  const packBytes = readFileSync(resolve(root, PACK_PATH));
  if (sha256(packBytes) !== PERSONAL_GUIDANCE_PACK_SHA256) throw new Error("Personal-guidance pack drift");
  const bundle = JSON.parse(packBytes.toString("utf8")) as Bundle;
  if (bundle.contract !== "DEVAM_SARTHI_REVIEWED_PERSONAL_GUIDANCE_V1" || bundle.bundle_id !== "personal-guidance-foundation-v1" || bundle.review_status !== "internal_beta_reviewed") {
    throw new Error("Personal-guidance contract drift");
  }
  if (!Object.values(bundle.denials).every((value) => value === false)) throw new Error("Personal-guidance denial drift");
  const source = bundle.sources.find((candidate) => candidate.source_id === "gretil-bhagavadgita-four-commentaries-tei");
  if (!source?.source_path || source.sha256 !== SOURCE_SHA256 || source.source_object_id !== `sha256:${SOURCE_SHA256}` || source.rights_lane !== "citation_only") {
    throw new Error("Personal-guidance source identity drift");
  }
  const requiredPrinciples = new Set(["deliberate-then-choose", "responsible-action-without-outcome-control", "steady-action", "truthful-beneficial-non-harming-speech"]);
  if (bundle.principles.length !== requiredPrinciples.size || bundle.principles.some((principle) => !requiredPrinciples.delete(principle.principle_id))) {
    throw new Error("Personal-guidance principle universe drift");
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
  const source = bundle.sources.find((candidate) => candidate.source_id === "gretil-bhagavadgita-four-commentaries-tei");
  if (!source) throw new Error("Personal-guidance citation source missing");
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

export function answerReviewedPersonalGuidance(request: SarthiRequest, plan: SarthiRuntimePlan): GroundedSarthiAnswer | null {
  if (plan.taskClass !== "personal_guidance" && plan.taskClass !== "moral_ambiguity") return null;
  const text = conversationText(request).toLocaleLowerCase("en");
  const careerFamily = /\b(parent|parents|family|career|job|work|profession)\b/u.test(text)
    || /(माता|पिता|परिवार|करियर|नौकरी|काम)/u.test(text);
  if (!careerFamily) return null;
  const hasPriorUserTurn = request.recentTurns?.some((turn) => turn.role === "user") === true;
  const materialSignals = [
    /\b(financially independent|financial dependence|money|salary|income|rent|debt)\b/u.test(text) || /(आर्थिक रूप से स्वतंत्र|पैस|वेतन|आय|किराय|कर्ज)/u.test(text),
    /\b(no one is in danger|no danger|safe|safety)\b/u.test(text) || /(कोई खतरे में नहीं|सुरक्षित|सुरक्षा)/u.test(text),
    /\b(reversible|trial|experiment|fallback)\b/u.test(text) || /(उलट सक|परीक्षण|प्रयोग|वापसी)/u.test(text),
  ].filter(Boolean).length;
  if (!hasPriorUserTurn && materialSignals < 2) return null;

  const bundle = loadPersonalGuidanceBundle();
  const selectedIds = bundle.routes.find((route) => route.route_id === "career-family-tension")?.principle_ids ?? [];
  const selected = selectedIds.map((id) => bundle.principles.find((principle) => principle.principle_id === id)).filter((value): value is Principle => Boolean(value));
  if (selected.length !== 3) throw new Error("Personal-guidance route drift");
  const moneyIsMaterial = /\b(money|financial|salary|income|dependent|dependence|rent|debt)\b/u.test(text)
    || /(पैस|आर्थिक|वेतन|आय|निर्भर|कर्ज)/u.test(text);
  const financiallyIndependent = /\bfinancially independent\b/u.test(text) || /आर्थिक रूप से स्वतंत्र/u.test(text);
  const hindi = isHindi(request);
  const answer = hindi
    ? moneyIsMaterial
      ? "पैसे की चिंता इस निर्णय की वास्तविक बाधा है—लेकिन जरूरी नहीं कि वही आपका पूरा जीवन तय करे। पहले अगले 3–6 महीनों की न्यूनतम आर्थिक जरूरत, आप पर निर्भर लोगों और असफल होने पर सुरक्षित वापसी का हिसाब लिखें। फिर बड़े स्थायी निर्णय के बजाय एक छोटा, समय-बद्ध प्रयोग चुनें—जैसे लक्ष्यित आवेदन, अंशकालिक प्रयास या कौशल-परीक्षण। परिवार से बात करते समय अपनी इच्छा के साथ यह सुरक्षा-योजना भी रखें। गीता के ये प्रसंग जिम्मेदार कर्म, परिणाम पर सीमित नियंत्रण, हितकारी सत्य-वाणी और विचार के बाद आपके अपने चुनाव का लेंस देते हैं; वे आपके लिए पेशा तय नहीं करते।"
      : "इसे केवल ‘परिवार की बात मानूँ या अपनी’ न बनाएं। अपनी वास्तविक जिम्मेदारियाँ, आप पर निर्भर लोग, दोनों विकल्पों की लागत और कौन-सा कदम पहले छोटे व उलट सकने योग्य रूप में परखा जा सकता है—इनको अलग-अलग लिखें। फिर परिवार से सत्य, हितकारी और अनावश्यक रूप से आहत न करने वाली भाषा में अपनी योजना रखें। गीता के ये प्रसंग जिम्मेदार कर्म और विचार के बाद अपने चुनाव का लेंस देते हैं; वे आपके लिए पेशा तय नहीं करते।"
    : financiallyIndependent
      ? "Because you are financially independent and no one is in danger, your parents' concern about instability is important counsel, not an automatic veto. Compare two reversible next steps by cost, learning value, time limit, and fallback. Choose the smaller test that gives you real evidence while preserving your commitments, then explain the test and its stop condition to your family truthfully and respectfully. These Gita passages offer lenses of responsible action, limited control over results, truthful-beneficial speech, and considered choice; they do not choose a career for you."
      : moneyIsMaterial
      ? "Money is a real constraint here, but it does not have to become the whole decision. Write down your minimum 3–6 month financial need, anyone who depends on you, and the safest fallback if the plan fails. Then replace one irreversible leap with a bounded test—targeted applications, a part-time trial, or a skills milestone—and show your family both the aspiration and the safety plan. These Gita passages offer lenses of responsible action, limited control over results, truthful-beneficial speech, and considered choice; they do not choose a career for you."
      : "Try not to reduce this to ‘obey the family’ versus ‘follow your heart.’ Separate your real responsibilities, anyone affected, the costs of each option, and what can first be tested reversibly. Then speak to your family truthfully and usefully, without needless injury, while keeping the final considered choice with you. These Gita passages offer lenses for responsible action and deliberation; they do not choose a career for you.";
  const followUpQuestion = hindi
    ? "आपकी न्यूनतम मासिक जरूरत और सुरक्षित प्रयोग के लिए उपलब्ध समय कितना है?"
    : financiallyIndependent
      ? "What are the two reversible steps you are comparing, and what stop condition would make each one safe?"
      : "What is your minimum monthly financial need, and how much time could you safely give a reversible test?";
  return {
    ok: true,
    mode: "reviewed_personal_guidance",
    answer: `${answer} ${followUpQuestion}`,
    citations: selected.map((principle) => citation(bundle, principle)),
    alternativesAvailable: true,
    sourceBoundary: `Reviewed Devam synthesis from ${PACK_PATH} (${PERSONAL_GUIDANCE_PACK_SHA256}). Exact private commentary text is not quoted; these source-bounded principles do not decide the user's action or represent the complete Bhagavadgita tradition.`,
    followUpQuestion,
  };
}

import type { GroundedClaim } from "../evidence/contracts";
import type { SarthiContext, SarthiRequest } from "./contracts";

export type SarthiTaskClass =
  | "exact_fact"
  | "general_explanation"
  | "panchang"
  | "ritual_vidhi"
  | "festival_story"
  | "comparison"
  | "personal_guidance"
  | "moral_ambiguity"
  | "reflection";

export type SarthiDecisionImpact = "ordinary" | "consequential" | "urgent";

export type SarthiAnswerMode =
  | "direct"
  | "conditional"
  | "plural"
  | "clarify"
  | "unable_to_ground"
  | "escalate";

export type SarthiEvidenceType =
  | "claim"
  | "source_evidence"
  | "variant_identity"
  | "parallel_claims"
  | "non_equivalence"
  | "deterministic_timing"
  | "rule_provenance"
  | "procedure"
  | "applicability"
  | "step_evidence"
  | "variants"
  | "affected_parties"
  | "alternatives"
  | "uncertainty"
  | "normative_positions"
  | "consequence_constraints"
  | "attributed_interpretation"
  | "application_boundary";

export type SarthiRuntimePlan = {
  contract: "DEVAM_SARTHI_RUNTIME_PLAN_V0_1";
  taskClass: SarthiTaskClass;
  decisionImpact: SarthiDecisionImpact;
  authorityCeiling: "library_guide" | "calendar_explainer" | "practice_companion" | "reflective_companion";
  explicitContext: Partial<Pick<SarthiContext, "atlasNodeSlug" | "languageCode" | "regionCode" | "traditionCode">>;
  missingMaterialContext: string[];
  routes: Array<"claim_retrieval" | "deterministic_panchang" | "procedure_resolver" | "bounded_guidance">;
  requiredEvidenceTypes: SarthiEvidenceType[];
  validators: string[];
  answerMode: SarthiAnswerMode;
  stopCondition?: string;
};

export type SarthiCoverage = {
  required: SarthiEvidenceType[];
  present: SarthiEvidenceType[];
  missing: SarthiEvidenceType[];
  sufficient: boolean;
};

function has(value: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(value));
}

function classifyTask(message: string): SarthiTaskClass {
  const normalized = message.toLocaleLowerCase("en");

  if (has(normalized, [
    /\b(origin|origin story|why is .+ celebrated|story and significance|different stories)\b/u,
    /(उत्पत्ति|कहानी|कथा|क्यों मनाया|क्यों मनाई)/u,
  ])) return "festival_story";

  if (has(normalized, [
    /\b(reflect|reflection|symbolism|symbolic|what can .+ teach me)\b/u,
    /\bwithout pretending my situation is the same\b/u,
    /(चिंतन|मनन|सीख पर विचार)/u,
  ])) return "reflection";

  // Explicit refusal or pressure around religious participation is a consent
  // question even when the speaker also says "my child" or "my family".
  if (has(normalized, [
    /\b(pressur(?:e|ing).+(?:ritual|puja|prayer)|refus(?:e|es|ing).+(?:ritual|puja|prayer)|does not want to (?:attend|join).+(?:ritual|puja|prayer)|forced religious|forced participation)\b/u,
    /(पूजा में आने का मन नहीं|पूजा.*मना कर|मना कर रहा|धार्मिक दबाव|परिवार.*दबाव)/u,
  ])) return "moral_ambiguity";

  // First-person life context owns the route even when words such as
  // "different" would otherwise resemble a source-comparison request.
  if (has(normalized, [
    /\b(my parents|my career|my job|my child|my parent|my dependent|caregiving|work and family|help me decide|i keep|my anger|my temper|i get angry|i am angry|i'm angry)\b/u,
    /(मेरे माता-पिता|मेरी करियर|मेरी नौकरी|मेरे बच्चे|मेरे बच्चा|देखभाल|काम और परिवार|प्राथमिकता|निर्णय लेने में मेरी मदद|मुझे गुस्सा|मुझे क्रोध|बार-बार गुस्सा)/u,
  ])) return "personal_guidance";

  if (has(normalized, [
    /\b(compare|comparison|difference|different|differ|versus|vs\.?)\b/u,
    /\bsame\b.{0,40}\bas\b/u,
    /\bhow do\b.+\bdiffer\b/u,
    /(तुलना|अंतर|फ़र्क|फर्क|समान है)/u,
  ])) return "comparison";

  if (has(normalized, [
    /\b(is it ever right|lie to protect|reveal (?:the )?location|should i forgive|balance giving|moral|duty.+truth|truth.+duty|pressur(?:e|ing).+(?:ritual|puja|prayer)|refus(?:e|es|ing).+(?:ritual|puja|prayer)|does not want to (?:attend|join).+(?:ritual|puja|prayer)|keeps harming)\b/u,
    /(दान.+(?:घर|जिम्मेदारी)|(?:घर|जिम्मेदारी).+दान|आवश्यक जरूरतें.+अतिरिक्त खर्च)/u,
    /(सही है|कर्तव्य.+सच|सच.+कर्तव्य|नैतिक|धर्मसंकट|पूजा में आने का मन नहीं|पूजा.*मना कर|मना कर रहा|धार्मिक दबाव|परिवार.*दबाव)/u,
  ])) return "moral_ambiguity";

  if (has(normalized, [
    /\b(i am|i'm|my responsibilities|my parents|my career|my life|close friend|help me decide|how should i set priorities|wisdom lens)\b/u,
    /(अपने जीवन में|मेरे जीवन|मुझे डर|मैं परेशान|मैं दुखी|शोक के समय)/u,
  ])) return "personal_guidance";

  if (has(normalized, [
    /\b(vidhi|puja sequence|ritual steps?|how should .+ perform|how (?:do|can|should) i (?:perform|worship)|what should i do on|practice on)\b/u,
    /(विधि|पूजा कैसे|कैसे करूँ|क्या करूँ|अनुष्ठान)/u,
  ])) return "ritual_vidhi";

  if (has(normalized, [
    /\b(when is|what time|which civil date|moonrise|sunrise|tithi|amavasya|panchang|pañcāṅga|tomorrow)\b/u,
    /(कब है|कितने बजे|चंद्रोदय|सूर्योदय|तिथि|पंचांग|किस दिन)/u,
  ])) return "panchang";

  if (has(normalized, [
    /\b(which book|show me the source|source for|who is named|what edition|which passage|quotation|where does .+ say|exact)\b/u,
    /(किस ग्रंथ|स्रोत|उद्धरण|किस अध्याय|कौन से ग्रंथ)/u,
  ])) return "exact_fact";

  return "general_explanation";
}

function classificationMessage(request: SarthiRequest): string {
  const priorUserContext = request.recentTurns
    ?.filter((turn) => turn.role === "user")
    .slice(-2)
    .map((turn) => turn.content)
    .join(" ");
  return priorUserContext ? `${priorUserContext} ${request.message}` : request.message;
}

function explicitContext(context: SarthiContext | undefined): SarthiRuntimePlan["explicitContext"] {
  if (!context) return {};
  return {
    ...(context.atlasNodeSlug ? { atlasNodeSlug: context.atlasNodeSlug } : {}),
    ...(context.languageCode ? { languageCode: context.languageCode } : {}),
    ...(context.regionCode ? { regionCode: context.regionCode } : {}),
    ...(context.traditionCode ? { traditionCode: context.traditionCode } : {}),
  };
}

function isUrgent(message: string): boolean {
  return has(message.toLocaleLowerCase("en"), [
    /\b(immediate danger|emergency|suicid|self-harm|violence right now|cannot stay safe|might hurt (?:myself|someone)|about to hurt (?:myself|someone)|going to hurt (?:myself|someone)|(?:harm|hurt|attack|kill) (?:him|her|them|someone) right now|want to kill|might kill)\b/u,
    /(तुरंत खतरा|आपातकाल|आत्महत्या|खुद को नुकसान|किसी को चोट पहुँचा सकता|किसी को मार सकता)/u,
  ]);
}

function moralQuestionNeedsClarification(message: string): boolean {
  return has(message.toLocaleLowerCase("en"), [
    /\b(lie to protect|duty.+truth|truth.+duty|balance giving|obligations to my household)\b/u,
    /(दान.+(?:घर|जिम्मेदारी)|(?:घर|जिम्मेदारी).+दान|आवश्यक जरूरतें.+अतिरिक्त खर्च)/u,
    /(कर्तव्य.+सच|सच.+कर्तव्य|दान.+परिवार|परिवार.+दान)/u,
  ]);
}

export function planSarthiRequest(request: SarthiRequest): SarthiRuntimePlan {
  const taskClass = classifyTask(classificationMessage(request));
  const context = explicitContext(request.context);
  const missingMaterialContext: string[] = [];
  let answerMode: SarthiAnswerMode = "direct";
  let decisionImpact: SarthiDecisionImpact = "ordinary";
  let authorityCeiling: SarthiRuntimePlan["authorityCeiling"] = "library_guide";
  let routes: SarthiRuntimePlan["routes"] = ["claim_retrieval"];
  let requiredEvidenceTypes: SarthiEvidenceType[] = ["claim", "source_evidence"];
  let validators = ["rights_and_publication", "grounding"];
  let stopCondition: string | undefined;

  if (isUrgent(request.message)) {
    decisionImpact = "urgent";
    answerMode = "escalate";
    authorityCeiling = "reflective_companion";
    routes = ["bounded_guidance"];
    requiredEvidenceTypes = ["affected_parties", "consequence_constraints"];
    validators = ["role_boundary", "immediate_safety", "agency"];
    stopCondition = "Immediate safety context owns the route; do not substitute spiritual interpretation for urgent help.";
  } else if (taskClass === "panchang") {
    authorityCeiling = "calendar_explainer";
    routes = ["deterministic_panchang"];
    requiredEvidenceTypes = ["deterministic_timing", "rule_provenance", "applicability"];
    validators = ["deterministic_parameters", "rule_applicability"];
    if (!context.regionCode) missingMaterialContext.push("location_or_region");
    if (/\b(which civil date|should (?:our|my).+observe)\b/iu.test(request.message) && !context.traditionCode) {
      missingMaterialContext.push("family_or_tradition");
    }
    answerMode = missingMaterialContext.length ? "clarify" : "direct";
    if (missingMaterialContext.length) stopCondition = "Do not guess a calendar parameter that can change the result.";
  } else if (taskClass === "ritual_vidhi") {
    decisionImpact = "consequential";
    authorityCeiling = "practice_companion";
    routes = ["procedure_resolver"];
    requiredEvidenceTypes = ["procedure", "applicability", "deterministic_timing", "step_evidence", "variants"];
    validators = ["procedure_completeness", "applicability", "timing_ownership", "source_boundary"];
    if (!context.regionCode) missingMaterialContext.push("location_or_region");
    if (!context.traditionCode) missingMaterialContext.push("family_or_tradition");
    answerMode = missingMaterialContext.length ? "clarify" : "conditional";
    if (missingMaterialContext.length) stopCondition = "Do not assign one household or institutional procedure universally.";
  } else if (taskClass === "festival_story") {
    answerMode = "plural";
    requiredEvidenceTypes = ["claim", "source_evidence", "variant_identity"];
    validators = ["rights_and_publication", "grounding", "source_role", "variant_preservation"];
  } else if (taskClass === "comparison") {
    answerMode = "plural";
    requiredEvidenceTypes = ["parallel_claims", "source_evidence", "non_equivalence"];
    validators = ["matched_dimensions", "symmetric_grounding", "non_equivalence"];
  } else if (taskClass === "personal_guidance") {
    decisionImpact = "consequential";
    authorityCeiling = "reflective_companion";
    routes = ["bounded_guidance"];
    answerMode = "conditional";
    requiredEvidenceTypes = ["claim", "source_evidence", "affected_parties", "alternatives", "uncertainty"];
    validators = ["grounding", "applicability", "affected_parties", "agency", "anti_sycophancy"];
    stopCondition = "A generic first retrieved claim cannot determine personal action.";
  } else if (taskClass === "moral_ambiguity") {
    decisionImpact = "consequential";
    authorityCeiling = "reflective_companion";
    routes = ["bounded_guidance"];
    answerMode = moralQuestionNeedsClarification(request.message) ? "clarify" : "conditional";
    requiredEvidenceTypes = ["normative_positions", "source_evidence", "affected_parties", "alternatives", "consequence_constraints", "uncertainty"];
    validators = ["grounding", "power_and_consent", "affected_parties", "reversibility", "agency"];
    if (answerMode === "clarify") missingMaterialContext.push("decision_changing_circumstance");
    stopCondition = "Do not turn one text, story, or retrieved majority into a universal moral verdict.";
  } else if (taskClass === "reflection") {
    authorityCeiling = "reflective_companion";
    routes = ["bounded_guidance"];
    answerMode = "conditional";
    requiredEvidenceTypes = ["source_evidence", "attributed_interpretation", "application_boundary"];
    validators = ["grounding", "analogy_boundary", "agency"];
    stopCondition = "A source may illuminate the user's situation but does not decide it by analogy alone.";
  }

  return {
    contract: "DEVAM_SARTHI_RUNTIME_PLAN_V0_1",
    taskClass,
    decisionImpact,
    authorityCeiling,
    explicitContext: context,
    missingMaterialContext,
    routes,
    requiredEvidenceTypes,
    validators,
    answerMode,
    ...(stopCondition ? { stopCondition } : {}),
  };
}

function uniqueSorted<T extends string>(values: T[]): T[] {
  return [...new Set(values)].sort() as T[];
}

export function assessClaimCoverage(plan: SarthiRuntimePlan, claims: GroundedClaim[]): SarthiCoverage {
  const present: SarthiEvidenceType[] = [];
  if (claims.length) present.push("claim");
  if (claims.some((claim) => claim.evidence.length > 0)) present.push("source_evidence");
  if (claims.some((claim) => Object.keys(claim.applicability).length > 0)) present.push("applicability", "application_boundary");
  if (claims.some((claim) => claim.uncertaintyNote)) present.push("uncertainty");
  if (claims.length > 1) present.push("parallel_claims", "alternatives");

  const scopes = new Set(claims.map((claim) => JSON.stringify(claim.applicability)));
  const sourceIdentities = new Set(claims.flatMap((claim) => claim.evidence.map((item) => `${item.workSlug}:${item.editionTitle}`)));
  if (claims.length > 1 && (scopes.size > 1 || sourceIdentities.size > 1)) present.push("variant_identity");

  const hasInterpretiveRecord = claims.some((claim) =>
    /interpret|commentar|bh[aā]ṣya|ṭīkā|synthesis/iu.test(`${claim.claimKind} ${claim.evidenceClass}`),
  );
  if (hasInterpretiveRecord) present.push("attributed_interpretation");

  const normalizedPresent = uniqueSorted(present);
  const missing = plan.requiredEvidenceTypes.filter((item) => !normalizedPresent.includes(item));
  return {
    required: [...plan.requiredEvidenceTypes],
    present: normalizedPresent,
    missing,
    sufficient: missing.length === 0,
  };
}

export function permitsGenericClaimFallback(plan: SarthiRuntimePlan): boolean {
  return plan.taskClass === "exact_fact" || plan.taskClass === "general_explanation" || plan.taskClass === "festival_story";
}

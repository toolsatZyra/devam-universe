import type { GroundedClaim, KnowledgeGroundingRepository } from "../evidence/contracts";
import type { EvidenceCitation, GroundedSarthiAnswer, SarthiRequest, SarthiUnavailable } from "./contracts";
import { answerSarthi } from "./answer";
import { answerReviewedAngerConflictGuidance } from "./anger-conflict-guidance";
import { answerReviewedConsentGuidance } from "./consent-guidance";
import { answerReviewedForgivenessGuidance } from "./forgiveness-guidance";
import { answerReviewedGivingGuidance } from "./giving-guidance";
import { answerReviewedGriefGuidance } from "./grief-guidance";
import { generateGroundedSarthiAnswer } from "./openai-grounded-generation";
import { answerReviewedPersonalGuidance } from "./personal-guidance";
import { answerReviewedRamayanaReflection } from "./ramayana-reflection";
import { assessClaimCoverage, permitsGenericClaimFallback, planSarthiRequest, type SarthiRuntimePlan } from "./planner";
import { answerReviewedWorkCareGuidance } from "./work-care-guidance";

const RETRIEVAL_STOP_WORDS = new Set([
  "a", "about", "an", "and", "are", "as", "at", "be", "can", "could", "describe", "described",
  "do", "does", "for", "from", "how", "i", "in", "is", "it", "me", "of", "on", "please", "tell",
  "that", "the", "this", "to", "was", "what", "when", "where", "which", "who", "why", "would", "you",
  "आप", "इस", "इसके", "का", "की", "के", "क्या", "को", "में", "मुझे", "यह", "से", "है", "हैं",
]);

export function sarthiRetrievalQuery(message: string): string | null {
  const tokens = message.toLocaleLowerCase("en").match(/[\p{L}\p{M}\p{N}]+/gu) ?? [];
  const meaningful = [...new Set(tokens.filter((token) => token.length > 1 && !RETRIEVAL_STOP_WORDS.has(token)))].slice(0, 12);
  if (!meaningful.length) return null;
  return meaningful.join(" or ");
}

function isPublicProductClaim(claim: GroundedClaim): boolean {
  return claim.publicationState === "published"
    && (claim.rightsLane === "product_allowed" || claim.rightsLane === "derivative_allowed")
    && claim.evidence.length > 0
    && claim.evidence.every((item) => item.publicationState === "published");
}

function citation(claim: GroundedClaim, index: number): EvidenceCitation {
  const evidence = claim.evidence[index];
  const quotation = typeof evidence.exactText === "string"
    && (evidence.rightsLane === "product_allowed" || evidence.rightsLane === "derivative_allowed")
    ? evidence.exactText
    : undefined;
  return {
    passageId: evidence.passageId,
    sourceObjectId: evidence.sourceObjectId,
    sourceOrdinal: evidence.sourceOrdinal,
    workTitle: evidence.workTitle,
    editionTitle: evidence.editionTitle,
    locator: evidence.locator,
    rightsLane: evidence.rightsLane,
    ...(quotation ? { quotation } : {}),
  };
}

function answerFromClaim(claim: GroundedClaim, alternativesAvailable: boolean): GroundedSarthiAnswer {
  const firstEvidence = claim.evidence[0];
  const uncertainty = claim.uncertaintyNote ? ` ${claim.uncertaintyNote}` : "";
  return {
    ok: true,
    mode: "retrieval_grounded_answer",
    answer: claim.statement,
    citations: claim.evidence.map((_, index) => citation(claim, index)),
    alternativesAvailable,
    sourceBoundary: `This answer is bounded to ${firstEvidence.workTitle}, ${firstEvidence.editionTitle}.${uncertainty}`,
  };
}

function answerFromClaims(claims: GroundedClaim[], plan: SarthiRuntimePlan): GroundedSarthiAnswer {
  if (plan.taskClass !== "festival_story") return answerFromClaim(claims[0], claims.length > 1);

  const selected = claims.slice(0, 3);
  const citations = selected.flatMap((claim) => claim.evidence.map((_, index) => citation(claim, index)));
  const answer = selected
    .map((claim) => {
      const source = claim.evidence[0];
      return source ? `In ${source.workTitle}, ${claim.statement}` : claim.statement;
    })
    .join(" ");
  return {
    ok: true,
    mode: "plural_grounded_answer",
    answer,
    citations,
    alternativesAvailable: claims.length > selected.length,
    sourceBoundary: "These are separately attributable source-scoped accounts. They are not merged into one universal origin story.",
  };
}

function isHindi(request: SarthiRequest): boolean {
  return request.context?.languageCode?.toLowerCase().startsWith("hi") === true || /[\u0900-\u097f]/u.test(request.message);
}

function boundedGuidanceOpening(request: SarthiRequest, plan: SarthiRuntimePlan): GroundedSarthiAnswer | null {
  const hindi = isHindi(request);
  if (plan.decisionImpact === "urgent") {
    const normalized = request.message.toLocaleLowerCase("en");
    const locationThreat = /\b(asking|ask(?:ed)?|demand(?:ing|ed)?).{0,80}\b(where|location|address).{0,80}\b(?:harm|hurt|attack|kill).{0,30}\bright now\b/u.test(normalized)
      || /(कहाँ|स्थान|पता).{0,80}(हानि|चोट|हमला|मार).{0,30}(अभी|तुरंत)/u.test(request.message);
    if (locationThreat) {
      const followUpQuestion = hindi
        ? "क्या वह रिश्तेदार अभी सुरक्षित स्थान पर है, और क्या आप बिना धमकी देने वाले व्यक्ति का सामना किए स्थानीय आपातकालीन सहायता या किसी विश्वसनीय व्यक्ति से सम्पर्क कर सकते हैं?"
        : "Is your relative in a safe place now, and can you contact local emergency help or a trusted person without confronting the threatening person?";
      return {
        ok: true,
        mode: "safety_escalation",
        answer: hindi
          ? `उनका स्थान प्रकट न करें। यह अभी सत्य पर धार्मिक बहस का समय नहीं है; पहले जीवन और सुरक्षा की रक्षा करें। स्थानीय आपातकालीन सेवा या पुलिस से सम्पर्क करें, रिश्तेदार को सुरक्षित स्थान पर जाने को कहें यदि यह बिना अतिरिक्त खतरे के सम्भव हो, और धमकी देने वाले व्यक्ति का सामना न करें। संदेश और कॉल जैसे प्रमाण सुरक्षित रखें यदि ऐसा करना सुरक्षित हो। ${followUpQuestion}`
          : `Do not reveal their location. This is not the moment for a religious debate about truth; protect life and immediate safety first. Contact local emergency services or police, help your relative reach a safe place if that can be done without adding danger, and do not confront the threatening person. Preserve messages or call records if it is safe to do so. ${followUpQuestion}`,
        citations: [],
        alternativesAvailable: false,
        sourceBoundary: "Immediate third-party threat response only. No scriptural verdict, deception rule, diagnosis, legal advice, or confrontation has been supplied; present human safety takes priority.",
        followUpQuestion,
      };
    }
    const followUpQuestion = hindi
      ? "क्या आप अभी तत्काल खतरे में हैं, या अपने आपको अथवा किसी और को नुकसान पहुँचाने की स्थिति में हैं?"
      : "Are you in immediate danger right now, or at risk of harming yourself or someone else?";
    return {
      ok: true,
      mode: "safety_escalation",
      answer: hindi
        ? `आपको यह अकेले नहीं संभालना चाहिए। यदि खतरा अभी है, तो स्थानीय आपातकालीन सेवा से संपर्क करें, किसी भरोसेमंद व्यक्ति को अपने पास बुलाएँ, और नुकसान पहुँचाने वाली चीज़ों से दूरी बनाएँ। आध्यात्मिक विचार बाद में सहारा दे सकते हैं, लेकिन वे तत्काल मानवीय सहायता की जगह नहीं लेते। ${followUpQuestion}`
        : `You should not have to handle this alone. If the danger is immediate, contact local emergency services, ask a trusted person to stay with you, and move away from anything you could use to cause harm. Spiritual reflection can support you later, but it cannot replace immediate human help. ${followUpQuestion}`,
      citations: [],
      alternativesAvailable: false,
      sourceBoundary: "Immediate-safety response only. No spiritual interpretation, diagnosis, or personal action beyond seeking present human help has been inferred.",
      followUpQuestion,
    };
  }
  if (plan.taskClass !== "personal_guidance" && plan.taskClass !== "moral_ambiguity") return null;

  const normalized = request.message.toLocaleLowerCase("en");
  const givingConflict = /\b(balance giving|giving.+household|household.+giving|donation.+responsibilit|charity.+responsibilit)\b/u.test(normalized)
    || /(दान.+(?:घर|जिम्मेदारी)|(?:घर|जिम्मेदारी).+दान|आवश्यक जरूरतें.+अतिरिक्त खर्च)/u.test(request.message);
  const truthProtectionConflict = /\b(lie to protect|truth.+protect|protect.+truth|reveal (?:their|his|her) location)\b/u.test(normalized)
    || /(बचाने.*झूठ|झूठ.*बचाने|सच.*रक्षा|रक्षा.*सच)/u.test(request.message);
  const forgivenessConflict = /\b(forgive|forgiveness|reconcil(?:e|iation)|access again|restore (?:contact|trust))\b/u.test(normalized)
    || /(क्षमा|मेल-मिलाप|फिर से पहुँच|दोबारा सम्पर्क|फिर से भरोसा)/u.test(request.message);
  const workCareOverload = /\b(work and family|workload|caregiving|set priorities|prioriti[sz]e)\b/u.test(normalized)
    || /(काम और परिवार|देखभाल|प्राथमिकता)/u.test(request.message);
  const ritualConsentConflict = /\b(does not want to (?:attend|join)|refus(?:e|es|ing)|religious pressure|forced participation)\b/u.test(normalized)
    || /(पूजा में आने का मन नहीं|पूजा.*मना कर|मना कर रहा|धार्मिक दबाव|परिवार.*दबाव)/u.test(request.message);
  const careerOrParents = /\b(parent|parents|career|job|work|profession)\b/u.test(normalized)
    || /(माता|पिता|माँ|पापा|करियर|नौकरी|काम)/u.test(request.message);
  const grief = /\b(grief|grieving|died|death|lost someone|bereav)/u.test(normalized)
    || /(शोक|मृत्यु|निधन|खो दिया)/u.test(request.message);
  const anger = /\b(anger|angry|temper|rage|fight|argument|conflict)\b/u.test(normalized)
    || /(क्रोध|गुस्सा|झगड़ा|बहस)/u.test(request.message);
  let opening: string;
  let followUpQuestion: string;
  if (givingConflict) {
    opening = hindi
      ? "दान और घर की जिम्मेदारी का निर्णय केवल उदारता की मात्रा से नहीं होता। पहले प्रभावित लोगों की आवश्यक जरूरतें, आश्रित, निकट भविष्य के खर्च, कर्ज और मौजूदा वादे समझना जरूरी है; देवम् कोई तय धार्मिक प्रतिशत नहीं बनाएगा।"
      : "Balancing giving and household responsibility is not decided by generosity alone. Essential needs, dependents, near-term expenses, debt, and existing commitments must come first; Devam will not invent a fixed religious percentage.";
    followUpQuestion = hindi
      ? "क्या घर की आवश्यक जरूरतें, आश्रितों की जिम्मेदारियाँ, निकट खर्च और आपातकालीन गुंजाइश सुरक्षित हैं, और जिस राशि पर विचार है वह वास्तव में अतिरिक्त है?"
      : "Are essential household needs, dependent obligations, near-term commitments, and an emergency margin secure—and is the amount under consideration genuine surplus?";
  } else if (truthProtectionConflict) {
    opening = hindi
      ? "‘हमेशा सच बोलो’ या ‘परिवार के लिए कुछ भी करो’—इनमें से कोई एक वाक्य हर परिस्थिति का निर्णय नहीं करता। खतरे की प्रकृति, उसकी निकटता, प्रभावित लोग और बिना झूठ या खुलासा किए उपलब्ध सुरक्षित विकल्प निर्णय बदलते हैं।"
      : "Neither ‘always tell the truth’ nor ‘do anything for family’ decides every case. The nature and immediacy of the threatened harm, the people affected, and safe alternatives that avoid both lying and disclosure can change the answer.";
    followUpQuestion = hindi
      ? "किस तरह की हानि का डर है, क्या वह अभी या निकट समय में हो सकती है, किसे खतरा है, और क्या आप स्थान या निजी जानकारी बताए बिना सहायता ले सकते हैं?"
      : "What harm is threatened, how immediate is it, who is at risk, and can you seek help or decline to disclose private information without making a false statement?";
  } else if (forgivenessConflict) {
    opening = hindi
      ? "क्षमा, भीतर का बोझ छोड़ना, विश्वास, सम्पर्क, पहुँच और मेल-मिलाप अलग निर्णय हैं। किसी सद्गुण की बात अपने आप यह सिद्ध नहीं करती कि फिर से पहुँच देना सुरक्षित या आवश्यक है।"
      : "Forgiveness, inner release, trust, contact, access, and reconciliation are different decisions. Invoking a virtue does not by itself establish that renewed access is safe or required.";
    followUpQuestion = hindi
      ? "क्या हानि अभी जारी है, क्या उस व्यक्ति की अभी पहुँच है या वह फिर से पहुँच चाहता है, और ‘क्षमा’ से आपका मतलब भीतर का बोझ छोड़ना, विश्वास, सम्पर्क या मेल-मिलाप है?"
      : "Is the harm continuing, does the person currently have or want renewed access, and by ‘forgive’ do you mean inner release, trust, contact, or reconciliation?";
  } else if (ritualConsentConflict) {
    opening = hindi
      ? "परिवार का सदस्य होना अपने आप पूजा या धार्मिक गतिविधि की सहमति नहीं बनाता। सही अगला कदम उम्र, निर्णय-क्षमता, निर्भरता, स्पष्ट इनकार और दबाव या सुरक्षा के सन्दर्भ पर निर्भर करता है।"
      : "Family membership does not automatically establish consent to a puja or religious activity. The right next step depends on age, decision-making capacity, dependency, explicit refusal, and whether pressure or safety changes the situation.";
    followUpQuestion = hindi
      ? "क्या वह सक्षम वयस्क, आश्रित वयस्क या बालक है; क्या उसने स्पष्ट रूप से मना किया है; और क्या पैसे, आवास, सम्बन्ध या सुरक्षा का कोई दबाव जुड़ा है?"
      : "Is this person a competent adult, a dependent adult, or a child; have they clearly refused; and is money, housing, relationship, or safety pressure involved?";
  } else if (workCareOverload) {
    opening = hindi
      ? "काम और देखभाल दोनों भारी हों तो पहले प्रभावित लोगों और समय-संवेदनशील आवश्यकता को पहचानना उचित है; केवल ‘काम’ या ‘परिवार’ नाम से प्राथमिकता तय करना पर्याप्त नहीं होगा।"
      : "When work and care both feel heavy, the honest first step is to identify the people affected and the time-sensitive need; the labels ‘work’ and ‘family’ alone do not decide priority.";
    followUpQuestion = hindi
      ? "आज किसे आवश्यक देखभाल चाहिए, क्या सुरक्षित रूप से नहीं टल सकता, और कौन-सा काम बिना हानि के बाद में किया जा सकता है?"
      : "Who needs care today, what cannot safely wait, and which work can be deferred without harm?";
  } else if (careerOrParents) {
    opening = hindi
      ? "मैं यहाँ दो वास्तविक जिम्मेदारियाँ सुन रहा हूँ—परिवार के प्रति सम्मान और अपने जीवन के निर्णय की जिम्मेदारी। इन्हें केवल ‘आज्ञा मानो’ या ‘अपनी इच्छा करो’ में समेटना उचित नहीं होगा।"
      : "I hear two real responsibilities here: respect for your family and responsibility for the life you must actually live. Reducing that to either ‘obey’ or ‘do whatever you want’ would be too simple.";
    followUpQuestion = hindi
      ? "वे आपसे ठीक-ठीक क्या चाहते हैं, आप स्वयं किस विकल्प की ओर झुक रहे हैं, और क्या आर्थिक निर्भरता या किसी की देखभाल जैसी कोई जिम्मेदारी इस निर्णय को बदलती है?"
      : "What exactly are they asking you to do, which option are you leaning toward, and is financial dependence or care for someone else materially changing the decision?";
  } else if (anger) {
    opening = hindi
      ? "गुस्से पर कोई धार्मिक फैसला सुनाने से पहले सुरक्षा और उसका क्रम समझना जरूरी है। करुणा का अर्थ नुकसान सहना या मेल-मिलाप करना अनिवार्य नहीं है।"
      : "Before applying a religious lens to anger, it is important to understand safety and the sequence of escalation. Compassion never requires tolerating harm or reconciling.";
    followUpQuestion = hindi
      ? "क्या अभी कोई तत्काल खतरे में है, और गुस्सा बढ़ने से ठीक पहले आम तौर पर क्या होता है?"
      : "Is anyone in immediate danger, and what usually happens just before the anger rises?";
  } else if (grief) {
    opening = hindi
      ? "शोक को किसी श्लोक या सीख से जल्दी ‘ठीक’ करना उचित नहीं होगा। मैं आपके साथ इसे धीरे-धीरे समझ सकता हूँ और किसी परम्परा को तभी जोड़ूँगा जब वह वास्तव में सहारा दे।"
      : "Grief should not be hurried into a lesson or ‘fixed’ with a verse. I can stay with the situation gently and bring in a tradition only where it genuinely helps.";
    followUpQuestion = hindi
      ? "अभी आपको सबसे अधिक किसकी आवश्यकता है—किसी को अपनी बात बताने की, अगले कुछ घंटों को संभालने की, या किसी प्रार्थना/पाठ के सहारे की?"
      : "What would help most right now: being heard, getting through the next few hours, or finding a prayer or reading that feels supportive?";
  } else {
    opening = hindi
      ? "मैं आपको कोई तैयार धार्मिक आदेश नहीं देना चाहता। पहले परिस्थिति, उससे प्रभावित लोगों और आपके वास्तविक विकल्पों को समझना अधिक ईमानदार होगा।"
      : "I do not want to hand you a ready-made religious command. It is more honest to understand the situation, the people affected, and the choices that are genuinely available.";
    followUpQuestion = hindi
      ? "आपको कौन-सा निर्णय लेना है, उससे कौन-कौन प्रभावित होगा, और इस समय आपकी सबसे बड़ी आशंका या बाधा क्या है?"
      : "What decision are you facing, who will be affected, and what feels like the biggest fear or constraint right now?";
  }
  return {
    ok: true,
    mode: "context_clarification",
    answer: `${opening} ${followUpQuestion}`,
    citations: [],
    alternativesAvailable: true,
    sourceBoundary: "Conversation and situation clarification only. No scripture, analogy, moral verdict, or personal action has yet been prescribed; a grounded wisdom lens requires the user's material context and reviewed evidence.",
    followUpQuestion,
  };
}

export async function answerSarthiWithKnowledge(
  request: SarthiRequest,
  repository?: KnowledgeGroundingRepository,
): Promise<GroundedSarthiAnswer | SarthiUnavailable> {
  const plan = planSarthiRequest(request);
  const deterministic = answerSarthi(request);
  if (deterministic.ok || deterministic.code !== "NO_SUPPORTED_EVIDENCE") {
    return deterministic;
  }
  const reviewedRamayana = answerReviewedRamayanaReflection(request);
  if (reviewedRamayana) return reviewedRamayana;
  const reviewedAngerConflict = answerReviewedAngerConflictGuidance(request, plan);
  if (reviewedAngerConflict) return reviewedAngerConflict;
  const reviewedGrief = answerReviewedGriefGuidance(request, plan);
  if (reviewedGrief) return reviewedGrief;
  const reviewedWorkCare = answerReviewedWorkCareGuidance(request, plan);
  if (reviewedWorkCare) return reviewedWorkCare;
  const reviewedConsent = answerReviewedConsentGuidance(request, plan);
  if (reviewedConsent) return reviewedConsent;
  const reviewedForgiveness = answerReviewedForgivenessGuidance(request, plan);
  if (reviewedForgiveness) return reviewedForgiveness;
  const reviewedGiving = answerReviewedGivingGuidance(request, plan);
  if (reviewedGiving) return reviewedGiving;
  const reviewedGuidance = answerReviewedPersonalGuidance(request, plan);
  if (reviewedGuidance) return reviewedGuidance;
  const boundedOpening = boundedGuidanceOpening(request, plan);
  if (boundedOpening) return boundedOpening;
  if (!repository || request.message.length > 512) return deterministic;
  if (!permitsGenericClaimFallback(plan)) {
    return {
      ok: false,
      code: "INSUFFICIENT_EVIDENCE_COVERAGE",
      message: `Sarthi does not yet have the complete ${plan.requiredEvidenceTypes.join(", ")} evidence needed to answer this ${plan.taskClass.replaceAll("_", " ")} request responsibly.`,
    };
  }
  try {
    const retrievalQuery = sarthiRetrievalQuery(request.message);
    if (!retrievalQuery) return deterministic;
    const claims = (await repository.searchClaims(retrievalQuery, request.context?.languageCode, 6)).filter(isPublicProductClaim);
    if (!claims.length) return deterministic;
    const coverage = assessClaimCoverage(plan, claims);
    if (!coverage.sufficient) {
      return {
        ok: false,
        code: "INSUFFICIENT_EVIDENCE_COVERAGE",
        message: `Sarthi found related material, but the answer still lacks ${coverage.missing.join(", ")}.`,
      };
    }
    const generationClaims = claims.slice(0, 4);
    try {
      const generated = await generateGroundedSarthiAnswer(request, plan, generationClaims);
      if (generated) {
        return {
          ok: true,
          mode: "generated_grounded_answer",
          answer: generated.answer,
          citations: generationClaims.flatMap((claim) => claim.evidence.map((_, index) => citation(claim, index))),
          alternativesAvailable: claims.length > generationClaims.length,
          sourceBoundary: `This response was composed only from ${generationClaims.length} published, product-compatible Devam claim${generationClaims.length === 1 ? "" : "s"}; the attached source identities remain the authority.`,
          generation: { provider: "openai", model: generated.model, evidenceClaimIds: generated.evidenceClaimIds },
        };
      }
    } catch {
      // Generation is optional and fail-soft. The exact grounded answer below
      // remains available when the provider, key, model, or output is invalid.
    }
    return answerFromClaims(claims, plan);
  } catch {
    return deterministic;
  }
}

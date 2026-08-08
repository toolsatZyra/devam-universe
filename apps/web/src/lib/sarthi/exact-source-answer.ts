import type { KnowledgeGroundingRepository, PublicEvidencePassage } from "../evidence/contracts";
import type { GroundedSarthiAnswer, SarthiRequest, SarthiUnavailable } from "./contracts";
import { answerSarthiWithKnowledge, sarthiRetrievalQuery } from "./grounded-answer";
import { planSarthiRequest } from "./planner";

export function exactSourceRetrievalQuery(message: string): string | null {
  const quoted = message.match(/[“"]([^”"]{2,200})[”"]/u)?.[1]?.trim();
  if (quoted) return `"${quoted.replaceAll('"', "")}"`;
  const stripped = message
    .replace(/^(?:which|what)\s+(?:exact\s+)?(?:source\s+)?passage\s+(?:contains|has|mentions)\s+(?:the\s+)?(?:phrase\s+)?/iu, "")
    .replace(/^(?:what|which)\s+does\s+(?:the\s+)?(?:[\p{L}\p{M}\p{N}'’-]+\s+){0,4}?(?:text|source|passage)\s+(?:say|state|teach|describe|mention)\s+about\s+/iu, "")
    .replace(/[?.!]+$/u, "")
    .trim();
  if (stripped.split(/\s+/u).length >= 2 && stripped.length <= 200) {
    return `"${stripped.replaceAll('"', "")}"`;
  }
  return sarthiRetrievalQuery(message);
}

function explicitlyRequestsSourceText(message: string): boolean {
  return /\b(?:exact\s+)?(?:text|source|passage|quotation|quote|wording|phrase)\b/iu.test(message)
    && /\b(?:say|state|read|teach|describe|mention|contain|word)\b/iu.test(message);
}

function exactPassageExcerpt(text: string, message: string, limit = 900): string {
  if (text.length <= limit) return text;
  const terms = (sarthiRetrievalQuery(message) ?? "")
    .split(" or ")
    .filter((term) => term.length > 2);
  const folded = text.toLocaleLowerCase("en");
  const match = terms
    .map((term) => folded.indexOf(term.toLocaleLowerCase("en")))
    .filter((index) => index >= 0)
    .sort((left, right) => left - right)[0] ?? 0;
  let start = Math.max(0, match - 220);
  if (start > 0) {
    const boundary = text.indexOf(" ", start);
    if (boundary >= 0) start = boundary + 1;
  }
  let end = Math.min(text.length, start + limit);
  if (end < text.length) {
    const boundary = text.lastIndexOf(" ", end);
    if (boundary > start) end = boundary;
  }
  return `${start > 0 ? "…" : ""}${text.slice(start, end)}${end < text.length ? "…" : ""}`;
}

function answerFromExactPassage(
  passage: PublicEvidencePassage,
  message: string,
  alternativesAvailable: boolean,
): GroundedSarthiAnswer {
  const excerpt = exactPassageExcerpt(passage.text, message);
  return {
    ok: true,
    mode: "exact_passage_retrieval",
    answer: `In ${passage.editionTitle}, the matching source unit reads: “${excerpt}”`,
    citations: [{
      passageId: passage.id,
      sourceObjectId: passage.sourceObjectId,
      sourceOrdinal: passage.sourceOrdinal,
      workTitle: passage.workTitle,
      editionTitle: passage.editionTitle,
      locator: passage.locator,
      quotation: excerpt,
      rightsLane: passage.rightsLane,
    }],
    alternativesAvailable,
    sourceBoundary: `Exact contiguous excerpt from one published source unit in ${passage.editionTitle}; text status: ${passage.textStatus}; source completeness: ${passage.sourceCompletenessStatus}. It is not a universal interpretation or evidence that this edition or the wider tradition is complete.`,
  };
}

export async function answerSarthiWithExactSourceFallback(
  request: SarthiRequest,
  repository?: KnowledgeGroundingRepository,
): Promise<GroundedSarthiAnswer | SarthiUnavailable> {
  const governed = await answerSarthiWithKnowledge(request, repository);
  const plan = planSarthiRequest(request);
  const weakGenericAnswer = governed.ok
    && (governed.mode === "retrieval_grounded_answer"
      || governed.mode === "plural_grounded_answer"
      || governed.mode === "generated_grounded_answer");
  const sourceTextQuestion = explicitlyRequestsSourceText(request.message)
    && (plan.taskClass === "exact_fact" || plan.taskClass === "general_explanation");
  const sourceTextOverride = weakGenericAnswer
    && sourceTextQuestion;
  if (!sourceTextOverride && (governed.ok || governed.code !== "NO_SUPPORTED_EVIDENCE")) return governed;

  if (
    !sourceTextQuestion && plan.taskClass !== "exact_fact"
    || !repository?.searchPublishedPassages
    || request.message.length > 512
  ) return governed;

  try {
    const query = exactSourceRetrievalQuery(request.message);
    if (!query) return governed;
    const passages = await repository.searchPublishedPassages(query, request.context?.languageCode, 6);
    if (!passages.length) return governed;
    return answerFromExactPassage(passages[0], request.message, passages.length > 1);
  } catch {
    return governed;
  }
}

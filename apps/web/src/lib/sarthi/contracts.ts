import type { RitualProcedureGuide } from "../domain/practice";

export type SarthiContext = {
  atlasNodeSlug?: string;
  languageCode?: string;
  conversationId?: string;
  regionCode?: string;
  traditionCode?: string;
};

export type SarthiRequest = {
  message: string;
  context?: SarthiContext;
  /** Server-loaded only. validateSarthiRequest never accepts conversation history from the client. */
  recentTurns?: SarthiConversationTurn[];
};

export type SarthiConversationTurn = {
  role: "user" | "assistant";
  content: string;
};

export type EvidenceCitation = {
  passageId: string;
  sourceObjectId: string;
  sourceOrdinal: number;
  workTitle: string;
  editionTitle: string;
  locator: Record<string, unknown>;
  quotation?: string;
  rightsLane: "citation_only" | "product_allowed" | "derivative_allowed";
};

export type GroundedSarthiAnswer = {
  ok: true;
  mode: "deterministic_source_bounded_preview" | "retrieval_grounded_answer" | "exact_passage_retrieval" | "plural_grounded_answer" | "generated_grounded_answer" | "context_clarification" | "contextual_ritual_guidance" | "reviewed_personal_guidance" | "reviewed_ramayana_reflection" | "safety_escalation";
  answer: string;
  citations: EvidenceCitation[];
  alternativesAvailable: boolean;
  sourceBoundary: string;
  followUpQuestion?: string;
  practiceGuide?: RitualProcedureGuide;
  generation?: { provider: "openai"; model: string; evidenceClaimIds: string[] };
};

export type SarthiUnavailable = {
  ok: false;
  code: "GROUNDING_NOT_CONFIGURED" | "NO_SUPPORTED_EVIDENCE" | "INSUFFICIENT_EVIDENCE_COVERAGE";
  message: string;
};

export function validateSarthiRequest(input: unknown):
  | { ok: true; value: SarthiRequest }
  | { ok: false; issues: string[] } {
  if (!input || typeof input !== "object") return { ok: false, issues: ["Request body is required."] };
  const body = input as Record<string, unknown>;
  const issues: string[] = [];
  if (typeof body.message !== "string" || body.message.trim().length < 2) issues.push("message must contain at least two characters.");
  if (typeof body.message === "string" && body.message.length > 8000) issues.push("message must not exceed 8,000 characters.");
  if (body.context !== undefined && (typeof body.context !== "object" || body.context === null || Array.isArray(body.context))) {
    issues.push("context must be an object when provided.");
  } else if (body.context) {
    const context = body.context as Record<string, unknown>;
    if (context.atlasNodeSlug !== undefined && (typeof context.atlasNodeSlug !== "string" || !/^[a-z0-9-]{1,100}$/.test(context.atlasNodeSlug))) {
      issues.push("context.atlasNodeSlug must be a valid slug.");
    }
    if (context.languageCode !== undefined && (typeof context.languageCode !== "string" || !/^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/i.test(context.languageCode))) {
      issues.push("context.languageCode must be a valid language code.");
    }
    if (context.conversationId !== undefined && (typeof context.conversationId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(context.conversationId))) {
      issues.push("context.conversationId must be a valid UUID.");
    }
    if (context.regionCode !== undefined && (typeof context.regionCode !== "string" || !/^[a-z0-9-]{1,100}$/.test(context.regionCode))) {
      issues.push("context.regionCode must be a valid slug.");
    }
    if (context.traditionCode !== undefined && (typeof context.traditionCode !== "string" || !/^[a-z0-9-]{1,100}$/.test(context.traditionCode))) {
      issues.push("context.traditionCode must be a valid slug.");
    }
  }
  if (issues.length) return { ok: false, issues };
  return {
    ok: true,
    value: {
      message: (body.message as string).trim(),
      context: body.context as SarthiContext | undefined,
    },
  };
}

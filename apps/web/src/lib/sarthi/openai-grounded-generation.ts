import type { GroundedClaim } from "../evidence/contracts";
import type { SarthiRequest } from "./contracts";
import type { SarthiRuntimePlan } from "./planner";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
export const DEFAULT_SARTHI_MODEL = "gpt-5.6-terra";

type Environment = Record<string, string | undefined>;
type FetchLike = (input: string, init: RequestInit) => Promise<Response>;

export type GroundedGeneration = {
  answer: string;
  model: string;
  evidenceClaimIds: string[];
};

export function isGroundedGenerationConfigured(environment: Environment = process.env): boolean {
  return environment.SARTHI_GENERATION_ENABLED === "true"
    && typeof environment.OPENAI_API_KEY === "string"
    && environment.OPENAI_API_KEY.length > 20;
}

function responseText(payload: unknown): string | null {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null;
  const output = (payload as { output?: unknown }).output;
  if (!Array.isArray(output)) return null;
  for (const item of output) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    const content = (item as { content?: unknown }).content;
    if (!Array.isArray(content)) continue;
    for (const part of content) {
      if (!part || typeof part !== "object" || Array.isArray(part)) continue;
      const candidate = part as { type?: unknown; text?: unknown };
      if (candidate.type === "output_text" && typeof candidate.text === "string") return candidate.text;
    }
  }
  return null;
}

function generationPacket(request: SarthiRequest, plan: SarthiRuntimePlan, claims: GroundedClaim[]) {
  return {
    userQuestion: request.message,
    context: {
      languageCode: request.context?.languageCode ?? null,
      regionCode: request.context?.regionCode ?? null,
      traditionCode: request.context?.traditionCode ?? null,
      atlasNodeSlug: request.context?.atlasNodeSlug ?? null,
    },
    route: {
      taskClass: plan.taskClass,
      decisionImpact: plan.decisionImpact,
      answerMode: plan.answerMode,
      authorityCeiling: plan.authorityCeiling,
    },
    claims: claims.map((claim) => ({
      claimId: claim.id,
      claimKind: claim.claimKind,
      statement: claim.statement,
      applicability: claim.applicability,
      uncertaintyNote: claim.uncertaintyNote ?? null,
      sources: claim.evidence.map((evidence) => ({
        workTitle: evidence.workTitle,
        editionTitle: evidence.editionTitle,
        sourceOrdinal: evidence.sourceOrdinal,
      })),
    })),
  };
}

export async function generateGroundedSarthiAnswer(
  request: SarthiRequest,
  plan: SarthiRuntimePlan,
  claims: GroundedClaim[],
  options: { environment?: Environment; fetchImpl?: FetchLike } = {},
): Promise<GroundedGeneration | null> {
  const environment = options.environment ?? process.env;
  if (!isGroundedGenerationConfigured(environment) || claims.length === 0) return null;
  const model = environment.SARTHI_OPENAI_MODEL?.trim() || DEFAULT_SARTHI_MODEL;
  if (!/^gpt-[a-z0-9.-]{1,80}$/i.test(model)) throw new Error("Invalid Sarthi model identifier");
  const fetchImpl = options.fetchImpl ?? fetch;
  const response = await fetchImpl(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      authorization: `Bearer ${environment.OPENAI_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      store: false,
      reasoning: { effort: "medium" },
      text: {
        verbosity: "low",
        format: {
          type: "json_schema",
          name: "sarthi_grounded_answer",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              answer: { type: "string", minLength: 1, maxLength: 1200 },
              materialCaveat: { type: ["string", "null"], maxLength: 400 },
            },
            required: ["answer", "materialCaveat"],
          },
        },
      },
      max_output_tokens: 600,
      instructions: [
        "You are Sarthi, Devam's warm and culturally fluent companion, not a guru or divine authority.",
        "Answer only from the supplied claim packet. Do not add a date, ritual step, quotation, source, historical fact, promise, diagnosis, or certainty that the packet does not contain.",
        "Use the user's language when clear. Be concise and natural; lead with the useful answer. Preserve materially different traditions and uncertainty without reciting every alternative.",
        "For personal reflection, offer proportional options and preserve the user's agency. Do not use karma, fate, devotion, or tradition to blame, coerce, or overclaim.",
        "Return only the required JSON object. Do not include citation markers; the application attaches verified citations separately.",
      ].join("\n"),
      input: JSON.stringify(generationPacket(request, plan, claims)),
    }),
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`OpenAI Responses request failed with ${response.status}`);
  const rawText = responseText(await response.json());
  if (!rawText) throw new Error("OpenAI Responses output contained no text");
  const parsed = JSON.parse(rawText) as { answer?: unknown; materialCaveat?: unknown };
  if (typeof parsed.answer !== "string" || parsed.answer.trim().length === 0 || parsed.answer.length > 1200) throw new Error("Generated answer failed its output boundary");
  if (parsed.materialCaveat !== null && parsed.materialCaveat !== undefined && typeof parsed.materialCaveat !== "string") throw new Error("Generated caveat failed its output boundary");
  const caveat = typeof parsed.materialCaveat === "string" ? parsed.materialCaveat.trim() : "";
  const answer = caveat ? `${parsed.answer.trim()} ${caveat}` : parsed.answer.trim();
  return { answer, model, evidenceClaimIds: claims.map((claim) => claim.id) };
}

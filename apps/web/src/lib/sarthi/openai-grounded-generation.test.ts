import { describe, expect, it, vi } from "vitest";
import type { GroundedClaim } from "../evidence/contracts";
import { generateGroundedSarthiAnswer, isGroundedGenerationConfigured } from "./openai-grounded-generation";
import { planSarthiRequest } from "./planner";

const evidenceClaim: GroundedClaim = {
  id: "claim-1",
  stableKey: "claim-one-en",
  subject: { slug: "ganesha", canonicalName: "Ganesha" },
  statement: "One published claim states the bounded source meaning.",
  languageCode: "en",
  claimKind: "source_bounded_description",
  evidenceClass: "scripture_primary_source",
  confidence: 0.9,
  applicability: { source: "this-edition" },
  uncertaintyNote: "It is not every tradition.",
  rightsLane: "derivative_allowed",
  publicationState: "published",
  evidence: [{
    passageId: "passage-1",
    sourceObjectId: "source-1",
    sourceOrdinal: 4,
    locator: { page: 4 },
    exactText: "This exact passage must not be sent to generation.",
    languageCode: "sa",
    spanSha256: "a".repeat(64),
    sourceSha256: "b".repeat(64),
    workSlug: "work-one",
    workTitle: "Work One",
    editionTitle: "Edition One",
    rightsLane: "citation_only",
    publicationState: "published",
    evidenceRole: "supports",
    note: null,
  }],
};

describe("optional OpenAI grounded generation", () => {
  it("stays disabled unless both the flag and API key are present", () => {
    expect(isGroundedGenerationConfigured({ SARTHI_GENERATION_ENABLED: "true" })).toBe(false);
    expect(isGroundedGenerationConfigured({ OPENAI_API_KEY: "sk-test-key-that-is-long-enough" })).toBe(false);
    expect(isGroundedGenerationConfigured({ SARTHI_GENERATION_ENABLED: "true", OPENAI_API_KEY: "sk-test-key-that-is-long-enough" })).toBe(true);
  });

  it("uses the Responses API with a claim-only packet and parses structured output", async () => {
    const fetchImpl = vi.fn(async (_input: string, init: RequestInit) => {
      const body = JSON.parse(String(init.body));
      expect(body).toMatchObject({ model: "gpt-5.6-terra", store: false, reasoning: { effort: "medium" }, text: { verbosity: "low", format: { type: "json_schema", strict: true } } });
      expect(body.input).toContain(evidenceClaim.statement);
      expect(body.input).not.toContain(String(evidenceClaim.evidence[0].exactText));
      return new Response(JSON.stringify({ output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify({ answer: "A concise grounded answer.", materialCaveat: "This is source-bounded." }) }] }] }), { status: 200 });
    });
    const request = { message: "What does this source say?", context: { languageCode: "en" } };
    const result = await generateGroundedSarthiAnswer(
      request,
      planSarthiRequest(request),
      [evidenceClaim],
      { environment: { SARTHI_GENERATION_ENABLED: "true", OPENAI_API_KEY: "sk-test-key-that-is-long-enough" }, fetchImpl },
    );
    expect(result).toEqual({ answer: "A concise grounded answer. This is source-bounded.", model: "gpt-5.6-terra", evidenceClaimIds: ["claim-1"] });
    expect(fetchImpl).toHaveBeenCalledOnce();
  });

  it("fails closed on malformed provider output", async () => {
    const request = { message: "What does this source say?" };
    await expect(generateGroundedSarthiAnswer(
      request,
      planSarthiRequest(request),
      [evidenceClaim],
      {
        environment: { SARTHI_GENERATION_ENABLED: "true", OPENAI_API_KEY: "sk-test-key-that-is-long-enough" },
        fetchImpl: async () => new Response(JSON.stringify({ output: [] }), { status: 200 }),
      },
    )).rejects.toThrow("contained no text");
  });
});

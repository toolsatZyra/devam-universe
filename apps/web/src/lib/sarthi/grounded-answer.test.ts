import { afterEach, describe, expect, it, vi } from "vitest";
import type { GroundedClaim, KnowledgeGroundingRepository } from "../evidence/contracts";
import { answerSarthiWithKnowledge, sarthiRetrievalQuery } from "./grounded-answer";

function repository(value: GroundedClaim[] | Error): KnowledgeGroundingRepository {
  return { async searchClaims() { if (value instanceof Error) throw value; return value; } };
}

function claim(overrides: Partial<GroundedClaim> = {}): GroundedClaim {
  return {
    id: "claim-id",
    stableKey: "ganapati-yajna-source-bounded-en",
    subject: { slug: "ganapati", canonicalName: "Gaṇapati" },
    statement: "This source presents Gaṇapati as the sacrificial person.",
    languageCode: "en",
    claimKind: "source_bounded_theological_description",
    evidenceClass: "scripture_primary_source",
    confidence: 0.97,
    applicability: { scope: "this_source_only" },
    uncertaintyNote: "This is not a complete theology of Ganesha worship.",
    rightsLane: "derivative_allowed",
    publicationState: "published",
    evidence: [{
      passageId: "passage-id",
      sourceObjectId: "source-id",
      sourceOrdinal: 29,
      locator: { literal_marker: "29" },
      exactText: "Published Sanskrit text",
      languageCode: "sa",
      spanSha256: "a".repeat(64),
      sourceSha256: "b".repeat(64),
      workSlug: "source-work",
      workTitle: "Source Work",
      editionTitle: "Source Edition",
      rightsLane: "derivative_allowed",
      publicationState: "published",
      evidenceRole: "supports",
      note: null,
    }],
    ...overrides,
  };
}

describe("Sarthi knowledge fallback", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("derives a bounded multilingual websearch query from conversational wording", () => {
    expect(sarthiRetrievalQuery("What is described as the sacrificial person?")).toBe("sacrificial or person");
    expect(sarthiRetrievalQuery("यह यज्ञ के बारे में क्या कहता है?")).toBe("यज्ञ or बारे or कहता");
  });

  it("answers an unsupported explicit question from a published database claim", async () => {
    const result = await answerSarthiWithKnowledge(
      { message: "What is described as the sacrificial person?", context: { atlasNodeSlug: "ramayana", languageCode: "en" } },
      repository([claim()]),
    );
    expect(result).toMatchObject({ ok: true, mode: "retrieval_grounded_answer", answer: "This source presents Gaṇapati as the sacrificial person." });
    if (!result.ok) throw new Error("Expected a grounded answer.");
    expect(result.citations[0]).toMatchObject({ sourceOrdinal: 29, quotation: "Published Sanskrit text" });
  });

  it("answers from a source-aligned translation without presenting the translation as the source original", async () => {
    const translation = claim({
      stableKey: "ganapati-ganapatyatharvashirsha-rev415703-translation-01-en",
      statement: "You alone are the directly perceptible Reality.",
      claimKind: "source_aligned_translation",
      evidenceClass: "devam_synthesis",
      applicability: {
        scope: "this_exact_source_revision_only",
        provider_revision_id: 415703,
        source_ordinal: 1,
        translation_is_source_original: false,
      },
      uncertaintyNote: "Devam source-aligned English translation of Sanskrit Wikisource revision 415703; AI-assisted, not a source original or independently Sanskrit-reviewed translation.",
      evidence: [{
        ...claim().evidence[0],
        sourceOrdinal: 1,
        exactText: "त्वमेव प्रत्यक्षं तत्त्वमसि ॥",
        workSlug: "ganapatyatharvashirsha",
        workTitle: "Gaṇapatyatharvaśīrṣa",
        editionTitle: "Sanskrit Wikisource digital transcription, revision 415703",
      }],
    });
    const result = await answerSarthiWithKnowledge(
      { message: "What is described as the directly perceptible Reality?", context: { languageCode: "en" } },
      repository([translation]),
    );
    expect(result).toMatchObject({
      ok: true,
      mode: "retrieval_grounded_answer",
      answer: "You alone are the directly perceptible Reality.",
    });
    if (!result.ok) throw new Error("Expected a grounded translation answer.");
    expect(result.citations[0]).toMatchObject({ sourceOrdinal: 1, quotation: "त्वमेव प्रत्यक्षं तत्त्वमसि ॥" });
    expect(result.sourceBoundary).toContain("not a source original");
  });

  it("uses optional grounded generation only after retrieval coverage passes", async () => {
    vi.stubEnv("SARTHI_GENERATION_ENABLED", "true");
    vi.stubEnv("OPENAI_API_KEY", "sk-test-key-that-is-long-enough");
    vi.stubEnv("SARTHI_OPENAI_MODEL", "gpt-5.6-terra");
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({
      output: [{
        type: "message",
        content: [{
          type: "output_text",
          text: JSON.stringify({ answer: "A natural answer grounded in the selected claim.", materialCaveat: null }),
        }],
      }],
    }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await answerSarthiWithKnowledge(
      { message: "What is described as the sacrificial person?", context: { languageCode: "en" } },
      repository([claim()]),
    );

    expect(result).toMatchObject({
      ok: true,
      mode: "generated_grounded_answer",
      answer: "A natural answer grounded in the selected claim.",
      generation: {
        provider: "openai",
        model: "gpt-5.6-terra",
        evidenceClaimIds: ["claim-id"],
      },
    });
    if (!result.ok) throw new Error("Expected a generated grounded answer.");
    expect(result.citations[0]).toMatchObject({ sourceOrdinal: 29, quotation: "Published Sanskrit text" });
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("does not let an active Atlas node hijack an unrelated explicit question", async () => {
    const result = await answerSarthiWithKnowledge(
      { message: "What is described as the sacrificial person?", context: { atlasNodeSlug: "durga", languageCode: "en" } },
      repository([claim()]),
    );
    expect(result).toMatchObject({ ok: true, mode: "retrieval_grounded_answer" });
  });

  it("opens personal guidance with a situation-changing question rather than a retrieved command", async () => {
    const result = await answerSarthiWithKnowledge(
      { message: "I am in conflict with my parents about my career. What should I do?" },
      repository([claim()]),
    );
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    if (!result.ok) throw new Error("Expected a bounded clarification.");
    expect(result.answer).toContain("respect for your family");
    expect(result.followUpQuestion).toContain("financial dependence");
    expect(result.sourceBoundary).toContain("No scripture");
  });

  it("prioritizes immediate human safety over spiritual interpretation", async () => {
    const result = await answerSarthiWithKnowledge(
      { message: "I am in immediate danger and cannot stay safe." },
      repository([claim()]),
    );
    expect(result).toMatchObject({ ok: true, mode: "safety_escalation", citations: [], alternativesAvailable: false });
    if (!result.ok) throw new Error("Expected a safety escalation.");
    expect(result.answer).toContain("local emergency services");
    expect(result.answer).toContain("cannot replace immediate human help");
  });

  it("renders separately scoped festival accounts plurally when coverage is complete", async () => {
    const result = await answerSarthiWithKnowledge(
      { message: "What is the origin story of this festival?" },
      repository([
        claim({ id: "north", applicability: { region: "north" } }),
        claim({
          id: "south",
          statement: "A second source preserves a different regional account.",
          applicability: { region: "south" },
          evidence: [{ ...claim().evidence[0], passageId: "passage-south", sourceObjectId: "source-south", workSlug: "south-work", workTitle: "South Work" }],
        }),
      ]),
    );
    expect(result).toMatchObject({ ok: true, mode: "plural_grounded_answer", alternativesAvailable: false });
    if (!result.ok) throw new Error("Expected a plural grounded answer.");
    expect(result.answer).toContain("In Source Work");
    expect(result.answer).toContain("In South Work");
    expect(result.sourceBoundary).toContain("not merged into one universal origin story");
    expect(result.citations).toHaveLength(2);
  });

  it("keeps contextual ritual guidance ahead of generic retrieval", async () => {
    const result = await answerSarthiWithKnowledge(
      { message: "What should I do for Navaratri at home?", context: { atlasNodeSlug: "durga", languageCode: "en" } },
      repository([claim()]),
    );
    expect(result).toMatchObject({ ok: true, mode: "context_clarification" });
  });

  it("fails closed when retrieval errors or returns review-state data", async () => {
    const failed = await answerSarthiWithKnowledge({ message: "What is described as the sacrificial person?" }, repository(new Error("offline")));
    expect(failed).toMatchObject({ ok: false, code: "NO_SUPPORTED_EVIDENCE" });
    const review = await answerSarthiWithKnowledge(
      { message: "What is described as the sacrificial person?" },
      repository([claim({ publicationState: "review" })]),
    );
    expect(review).toMatchObject({ ok: false, code: "NO_SUPPORTED_EVIDENCE" });
  });
});

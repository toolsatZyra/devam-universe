import { describe, expect, it, vi } from "vitest";
import type { GroundedClaim, KnowledgeGroundingRepository, PublicEvidencePassage } from "../evidence/contracts";
import { answerSarthiWithExactSourceFallback, exactSourceRetrievalQuery } from "./exact-source-answer";

function passage(overrides: Partial<PublicEvidencePassage> = {}): PublicEvidencePassage {
  return {
    id: "griffith-passage",
    sourceObjectId: "griffith-source",
    sourceOrdinal: 5,
    locator: { unit_kind: "canto", book: 1, literal_canto_number: 2 },
    text: "Canto II. Brahmá's Visit Válmíki, graceful speaker, heard, To highest admiration stirred.",
    textStatus: "source_aligned_normalized_projection_from_exact_tei_leaf_span_product_usable_electronic_edition_with_explicit_omissions",
    languageCode: "en",
    spanSha256: "c".repeat(64),
    sourceSha256: "1fa8d3e9da23d83abd334661db3a95574bfd6290943441c374d9bce4ef142ed9",
    sourceCompletenessStatus: "six_main_books_with_declared_omissions",
    workSlug: "valmiki-ramayana",
    workTitle: "Vālmīki Rāmāyaṇa",
    editionTitle: "The Rámáyan of Válmíki — Griffith electronic edition",
    rightsLane: "product_allowed",
    publicationState: "published",
    ...overrides,
  };
}

function repository(
  claims: GroundedClaim[] = [],
  passages: PublicEvidencePassage[] = [],
): KnowledgeGroundingRepository & { searchPublishedPassages: ReturnType<typeof vi.fn> } {
  return {
    async searchClaims() { return claims; },
    searchPublishedPassages: vi.fn(async () => passages),
  };
}

function unrelatedGaneshaClaim(): GroundedClaim {
  return {
    id: "ganesha-opening-claim",
    stableKey: "ganesha-opening-claim",
    subject: { slug: "ganesha-hymn", canonicalName: "Ganesha hymn" },
    statement: "In this hymn's opening dialogue, the Goddess asks Maheshvara for an effortless way to please Vighnesha.",
    languageCode: "en",
    claimKind: "source_bounded_description",
    evidenceClass: "primary_source",
    confidence: 1,
    applicability: {},
    uncertaintyNote: null,
    rightsLane: "product_allowed",
    publicationState: "published",
    evidence: [{
      passageId: "ganesha-opening-passage",
      sourceObjectId: "ganesha-source",
      sourceOrdinal: 1,
      workTitle: "Ganesha hymn",
      workSlug: "ganesha-hymn",
      editionTitle: "Reviewed Ganesha edition",
      locator: { unit: 1 },
      languageCode: "en",
      spanSha256: "a".repeat(64),
      sourceSha256: "b".repeat(64),
      rightsLane: "product_allowed",
      publicationState: "published",
      evidenceRole: "supports",
      note: null,
      exactText: "The Goddess asks Maheshvara for an effortless way to please Vighnesha.",
    }],
  };
}

describe("Sarthi exact-source fallback", () => {
  it("keeps an explicitly requested phrase intact for full-text retrieval", () => {
    expect(exactSourceRetrievalQuery("Which passage contains the phrase graceful speaker?")).toBe('"graceful speaker"');
    expect(exactSourceRetrievalQuery('Show me the source containing “graceful speaker”')).toBe('"graceful speaker"');
    expect(exactSourceRetrievalQuery("What does the goddess text say about intelligence in the heart of every living creature?"))
      .toBe('"intelligence in the heart of every living creature"');
  });

  it("prefers a matching exact passage over an unrelated generic claim for an explicit source-text question", async () => {
    const pargiter = passage({
      id: "pargiter-91",
      sourceObjectId: "pargiter-source",
      sourceOrdinal: 5,
      text: "O thou, who abidest under the form of Intelligence in the heart of every living creature.",
      workTitle: "Mārkaṇḍeyapurāṇa",
      editionTitle: "The Mārkaṇḍeya Purāṇa — Pargiter translation, Calcutta 1904",
      sourceCompletenessStatus: "complete_fixed_1904_pargiter_edition_scan_terminal_and_alternate_ending_observed_ocr_unreviewed",
    });
    const source = repository([unrelatedGaneshaClaim()], [pargiter]);
    const result = await answerSarthiWithExactSourceFallback(
      { message: "What does the goddess text say about intelligence in the heart of every living creature?", context: { languageCode: "en" } },
      source,
    );

    expect(result).toMatchObject({ ok: true, mode: "exact_passage_retrieval" });
    if (!result.ok) throw new Error("Expected exact passage retrieval.");
    expect(result.answer).toContain("Intelligence in the heart of every living creature");
    expect(result.citations[0]).toMatchObject({ sourceObjectId: "pargiter-source", sourceOrdinal: 5 });
    expect(source.searchPublishedPassages).toHaveBeenCalledWith('"intelligence in the heart of every living creature"', "en", 6);
  });

  it("serves a published exact passage only after the governor has no supported answer", async () => {
    const source = repository([], [passage(), passage({ id: "second-passage", sourceOrdinal: 6 })]);
    const result = await answerSarthiWithExactSourceFallback(
      { message: "Which passage contains the phrase graceful speaker?", context: { languageCode: "en" } },
      source,
    );
    expect(result).toMatchObject({ ok: true, mode: "exact_passage_retrieval", alternativesAvailable: true });
    if (!result.ok) throw new Error("Expected exact passage retrieval.");
    expect(result.answer).toContain("graceful speaker");
    expect(result.citations[0]).toMatchObject({
      sourceOrdinal: 5,
      sourceObjectId: "griffith-source",
      rightsLane: "product_allowed",
    });
    expect(result.sourceBoundary).toContain("six_main_books_with_declared_omissions");
    expect(source.searchPublishedPassages).toHaveBeenCalledOnce();
    expect(source.searchPublishedPassages).toHaveBeenCalledWith('"graceful speaker"', "en", 6);
  });

  it("does not bypass a deterministic or reviewed governor answer", async () => {
    const source = repository([], [passage()]);
    const result = await answerSarthiWithExactSourceFallback(
      { message: "What does Ganesha teach us?", context: { languageCode: "en" } },
      source,
    );
    expect(result).toMatchObject({ ok: true, mode: "deterministic_source_bounded_preview" });
    expect(source.searchPublishedPassages).not.toHaveBeenCalled();
  });

  it("never routes personal guidance through raw exact-passage retrieval", async () => {
    const source = repository([], [passage()]);
    const result = await answerSarthiWithExactSourceFallback(
      { message: "My parents and I disagree about my career. What should I do?" },
      source,
    );
    expect(result).toMatchObject({ ok: true, mode: "context_clarification" });
    expect(source.searchPublishedPassages).not.toHaveBeenCalled();
  });

  it("fails closed when exact-passage retrieval is unavailable", async () => {
    const result = await answerSarthiWithExactSourceFallback(
      { message: "Which passage contains the phrase graceful speaker?" },
      { async searchClaims() { return []; } },
    );
    expect(result).toMatchObject({ ok: false, code: "NO_SUPPORTED_EVIDENCE" });
  });

  it("returns a bounded contiguous excerpt while retaining the source-unit citation", async () => {
    const long = `${"opening ".repeat(180)}graceful speaker ${"closing ".repeat(180)}`;
    const source = repository([], [passage({ text: long })]);
    const result = await answerSarthiWithExactSourceFallback(
      { message: "Which passage contains graceful speaker?", context: { languageCode: "en" } },
      source,
    );
    expect(result).toMatchObject({ ok: true, mode: "exact_passage_retrieval" });
    if (!result.ok) throw new Error("Expected exact passage retrieval.");
    expect(result.citations[0].quotation).toContain("graceful speaker");
    expect(result.citations[0].quotation!.length).toBeLessThanOrEqual(902);
  });
});

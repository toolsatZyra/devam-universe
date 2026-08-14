import { describe, expect, it } from "vitest";
import { answerSarthi } from "./answer";
import { answerHanumanChalisaPreview, HANUMAN_CHALISA_PREVIEW_FIXITY, searchHanumanChalisaPreview } from "./hanuman-chalisa-preview";

describe("Hanuman Chalisa complete consumer reading", () => {
  it("exposes the complete fixed 2 + 40 + 1 structure", () => {
    const [result] = searchHanumanChalisaPreview("Hanuman Chalisa", "en");
    expect(result).toMatchObject({
      id: "hanuman-chalisa-complete-reading-en",
      claimKind: "complete_devotional_reading_structure",
      languageCode: "en",
    });
    expect(result.statement).toContain("complete reading sequence");
    expect(result.statement).toContain("40 chaupais");
    expect(result.sourceBoundary).toContain("Devam's beta-reviewed normalized transcription");
    expect(HANUMAN_CHALISA_PREVIEW_FIXITY).toMatchObject({
      readingUnits: 43,
      openingDohas: 2,
      chaupais: 40,
      closingDohas: 1,
      hostedDatabaseProjectionApplied: false,
      criticalEditionClaimed: false,
    });
  });

  it("jumps to a numbered English reading and a Devanagari-numbered Hindi chaupai", () => {
    const english = answerHanumanChalisaPreview({ message: "Hanuman Chalisa reading 1", context: { languageCode: "en" } });
    const hindi = answerHanumanChalisaPreview({ message: "हनुमान चालीसा चौपाई ४०", context: { languageCode: "hi" } });
    expect(english?.answer).toContain("Opening doha 1");
    expect(english?.answer).toContain("The poet begins");
    expect(english?.citations[0].locator.reading_ordinal).toBe(1);
    expect(hindi?.answer).toContain("चौपाई 40");
    expect(hindi?.answer).toContain("तुलसीदास");
    expect(hindi?.citations[0].locator.reading_ordinal).toBe(42);
  });

  it("starts a daily path without pretending that calendar date selects the unit", () => {
    const answer = answerHanumanChalisaPreview({ message: "Start today's Hanuman Chalisa reading", context: { languageCode: "en" } });
    expect(answer?.answer).toContain("Opening doha 1");
    expect(answer?.followUpQuestion).toContain("Continue");
    expect(answer?.sourceBoundary).toContain("not a critical edition");
  });

  it("answers from the Atlas doorway but does not intercept generic Hanuman stories", () => {
    expect(answerHanumanChalisaPreview({ message: "Tell me about this", context: { atlasNodeSlug: "hanuman-chalisa", languageCode: "en" } })?.answer).toContain("complete 43-part sequence");
    expect(answerHanumanChalisaPreview({ message: "Tell me Hanuman's role in the Ramayana" })).toBeNull();
    expect(searchHanumanChalisaPreview("Mahabharata", "en")).toEqual([]);
  });

  it("wins explicit Chalisa routing even when the request also names Tulsidas", () => {
    const answer = answerSarthi({ message: "Tell me about Hanuman Chalisa by Tulsidas", context: { languageCode: "en" } });
    expect(answer).toMatchObject({ ok: true, mode: "deterministic_source_bounded_preview" });
    expect(answer.ok && answer.answer).toContain("complete 43-part sequence");
    expect(answer.ok && answer.sourceBoundary).toContain("40 chaupais");
  });
});

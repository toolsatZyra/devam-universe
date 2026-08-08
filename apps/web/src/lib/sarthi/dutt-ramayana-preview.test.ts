import { describe, expect, it } from "vitest";

import { answerSarthi } from "./answer";
import { answerDuttRamayanaPreview } from "./dutt-ramayana-preview";

describe("Dutt Ramayana source-bounded Sarthi route", () => {
  it("preempts the broad Ramayana fallback for the named edition", () => {
    const answer = answerSarthi({ message: "What is the Manmatha Nath Dutt Ramayana edition?" });
    expect(answer.ok).toBe(true);
    if (!answer.ok) return;
    expect(answer.answer).toContain("652 source-ordered English sections");
    expect(answer.citations).toHaveLength(14);
    expect(answer.citations.every((citation) => citation.editionTitle.includes("Manmatha Nath Dutt"))).toBe(true);
    expect(answer.sourceBoundary).toContain("not Sanskrit, Hindi, a critical edition");
  });

  it("answers an exact kanda structure without correcting literal numbering", () => {
    const answer = answerDuttRamayanaPreview({ message: "Dutt Ramayana Yuddha Kanda" });
    expect(answer?.answer).toContain("128 source-ordered sections");
    expect(answer?.answer).toContain("8 recorded numbering anomalies");
    expect(answer?.citations.map((citation) => citation.sourceOrdinal)).toEqual([1, 128]);
  });

  it("supports Atlas continuation and ignores unrelated Ramayana requests", () => {
    const contextual = answerDuttRamayanaPreview({ message: "Tell me about this edition", context: { atlasNodeSlug: "dutt-ramayana" } });
    expect(contextual?.citations).toHaveLength(14);
    expect(answerDuttRamayanaPreview({ message: "Tell me about Ramcharitmanas" })).toBeNull();
  });
});

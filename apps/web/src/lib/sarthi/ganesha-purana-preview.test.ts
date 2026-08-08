import { describe, expect, it } from "vitest";

import { answerSarthi } from "./answer";
import { answerGaneshaPuranaPreview } from "./ganesha-purana-preview";

describe("Ganesha Purana source-bounded Sarthi route", () => {
  it("preempts the broad Ganesha fallback for the named source universe", () => {
    const answer = answerSarthi({ message: "What is the structure of the Ganesha Purana?" });
    expect(answer.ok).toBe(true);
    if (!answer.ok) return;
    expect(answer.answer).toContain("two complete textual divisions");
    expect(answer.citations).toHaveLength(4);
    expect(answer.citations.every((citation) => citation.editionTitle.includes("65 pinned revisions"))).toBe(true);
    expect(answer.sourceBoundary).toContain("underlying print edition and textual recension are unidentified");
  });

  it("answers one exact khanda without widening the claim", () => {
    const answer = answerGaneshaPuranaPreview({ message: "Ganesha Purana Krida Khanda" });
    expect(answer?.answer).toContain("chapters 1–155");
    expect(answer?.citations.map((citation) => citation.sourceOrdinal)).toEqual([34, 64]);
    expect(answer?.sourceBoundary).toContain("no Hindi or English translation");
  });

  it("supports Atlas continuation and ignores unrelated Ganesha requests", () => {
    const contextual = answerGaneshaPuranaPreview({ message: "Tell me about this source", context: { atlasNodeSlug: "ganesha-purana" } });
    expect(contextual?.citations).toHaveLength(4);
    expect(answerGaneshaPuranaPreview({ message: "How should I observe Ganesh Chaturthi?" })).toBeNull();
  });
});

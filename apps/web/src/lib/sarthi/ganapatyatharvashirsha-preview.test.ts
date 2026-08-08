import { describe, expect, it } from "vitest";
import { answerSarthi } from "./answer";
import { answerGanapatiAtharvashirsha } from "./ganapatyatharvashirsha-preview";

describe("Ganapati Atharvashirsha source-bounded Sarthi route", () => {
  it("preempts the unrelated broad Ganesha hymn fallback", () => {
    const answer = answerSarthi({ message: "Tell me about Ganapati Atharvashirsha" });
    expect(answer.ok).toBe(true);
    if (!answer.ok) return;
    expect(answer.answer).toContain("all 16 passages");
    expect(answer.citations[0].locator.provider_revision_id).toBe(415703);
    expect(answer.citations.every((citation) => citation.sourceObjectId === "43d5f6ca8a2ee7d7a62480a85cdbd526cee04b816db46ac7c3fd8d90757a5178")).toBe(true);
  });

  it("retrieves an exact numbered unit", () => {
    const answer = answerGanapatiAtharvashirsha({ message: "Ganapati Atharvashirsha unit 7" });
    expect(answer?.answer).toContain("Om gaṃ gaṇapataye");
    expect(answer?.citations[0].sourceOrdinal).toBe(7);
  });

  it("fails closed on pronunciation and formal ritual authority", () => {
    const pronunciation = answerGanapatiAtharvashirsha({ message: "How do I pronounce the Ganapati Atharvashirsha mantra?" });
    expect(pronunciation?.answer).toContain("will not invent");
    expect(pronunciation?.sourceBoundary).toContain("pronunciation");

    const ritual = answerGanapatiAtharvashirsha({ message: "What is the Ganapati Atharvashirsha recitation vidhi?" });
    expect(ritual?.answer).toContain("does not establish a formal puja procedure");
    expect(ritual?.alternativesAvailable).toBe(true);
  });

  it("supports an exact Atlas contextual continuation and ignores unrelated prompts", () => {
    const contextual = answerGanapatiAtharvashirsha({ message: "Tell me about this", context: { atlasNodeSlug: "ganapatyatharvashirsha" } });
    expect(contextual?.citations[0].locator.provider_page_id).toBe(137);
    expect(answerGanapatiAtharvashirsha({ message: "Tell me about Diwali" })).toBeNull();
  });
});

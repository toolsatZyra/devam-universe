import { describe, expect, it } from "vitest";

import { answerSarthi } from "./answer";
import { answerDevimahatmyaSemanticPreview } from "./devimahatmya-semantic-preview";

describe("Devimahatmya semantic Sarthi route", () => {
  it("answers a named narrative identity from exact evidence", () => {
    const answer = answerSarthi({ message: "Who is Mahishasura in the Devi Mahatmya?" });
    expect(answer.ok).toBe(true);
    if (!answer.ok) return;
    expect(answer.citations).toHaveLength(1);
    expect(answer.citations[0]).toMatchObject({ sourceOrdinal: 189, locator: { chapter: 83, verse: 41 } });
    expect(answer.sourceBoundary).toContain("not a source-original translation");
    expect(answer.sourceBoundary).toContain("ritual authority");
  });

  it("keeps paired identities distinct in Hindi", () => {
    const answer = answerDevimahatmyaSemanticPreview({ message: "शुम्भ और निशुम्भ", context: { languageCode: "hi" } });
    expect(answer?.citations).toHaveLength(2);
    expect(answer?.citations.every((citation) => citation.sourceOrdinal === 229)).toBe(true);
  });

  it("supports Atlas continuation but does not invent festival or ritual claims", () => {
    const contextual = answerDevimahatmyaSemanticPreview({ message: "Tell me about this figure", context: { atlasNodeSlug: "madhu-kaitabha" } });
    expect(contextual?.citations[0]).toMatchObject({ sourceOrdinal: 68, locator: { chapter: 81, verse: 68 } });
    expect(answerDevimahatmyaSemanticPreview({ message: "What is the origin of the Durga Puja ritual?" })).toBeNull();
  });

  it("continues from a close-zoom episode node using its exact provider revision", () => {
    const contextual = answerDevimahatmyaSemanticPreview({ message: "Tell me about this", context: { atlasNodeSlug: "chamunda" } });
    expect(contextual?.citations[0]).toMatchObject({
      sourceObjectId: "4459b0ca01f9a4173f1a137bf7c64908afbf326565b0b3f2dd2d2f5f830850fe",
      sourceOrdinal: 46,
      locator: { chapter: 87, verse: 26, provider_revision_id: 363171 },
    });
  });
});

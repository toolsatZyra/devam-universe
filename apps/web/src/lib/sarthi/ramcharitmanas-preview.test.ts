import { describe, expect, it } from "vitest";
import { answerRamcharitmanasPreview, RAMCHARITMANAS_PREVIEW_FIXITY, searchRamcharitmanasPreview } from "./ramcharitmanas-preview";

describe("Ramcharitmanas source-bounded preview", () => {
  it("exposes all seven sopana anchors without claiming the held pages", () => {
    const [result] = searchRamcharitmanasPreview("Ramcharitmanas seven sopanas Belvedere Press", "en");
    expect(result.citations).toHaveLength(7);
    expect(result.statement).toContain("813");
    expect(result.sourceBoundary).toContain("359 unproofread or empty pages");
    expect(result.sourceBoundary).toContain("not applied to the hosted database");
    expect(new Set(result.citations.map((citation) => citation.locator.sopana_ordinal))).toEqual(new Set([1, 2, 3, 4, 5, 6, 7]));
    expect(RAMCHARITMANAS_PREVIEW_FIXITY.completeRamcharitmanasTradition).toBe(false);
  });

  it("answers from the Atlas doorway in English and Hindi", () => {
    const english = answerRamcharitmanasPreview({ message: "Tell me about this", context: { atlasNodeSlug: "ramcharitmanas", languageCode: "en" } });
    const hindi = answerRamcharitmanasPreview({ message: "रामचरितमानस क्या है?", context: { languageCode: "hi" } });
    expect(english).toMatchObject({ ok: true, mode: "deterministic_source_bounded_preview", alternativesAvailable: true });
    expect(english?.citations).toHaveLength(7);
    expect(english?.answer).toContain("813");
    expect(hindi?.answer).toContain("सातों सोपानों");
    expect(answerRamcharitmanasPreview({ message: "Tell me about astronomy" })).toBeNull();
  });
});

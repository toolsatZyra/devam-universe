import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { answerSarthi } from "./answer";

const context = {
  atlasNodeSlug: "diwali",
  languageCode: "en",
  regionCode: "south-india",
  traditionCode: "smarta-south-india",
};

describe("relevance-sensitive ritual alternatives", () => {
  it("keeps the default Tamil Deepavali answer concise while preserving structured variants", () => {
    const result = answerSarthi({ message: "I am in Chennai. What should I do for Tamil Deepavali?", context });
    expect(result).toMatchObject({
      ok: true,
      mode: "contextual_ritual_guidance",
      alternativesAvailable: true,
      practiceGuide: {
        companionToObservanceSlug: "tamil-deepavali-naraka-chaturdashi",
        userCompleteContext: { variants: expect.any(Array) },
      },
    });
    if (!result.ok || !result.practiceGuide?.userCompleteContext) throw new Error("Expected Tamil Deepavali guide");
    expect(result.practiceGuide.userCompleteContext.variants.length).toBeGreaterThan(1);
    expect(result.answer).not.toContain("This bounded guide preserves these variants:");
    for (const variant of result.practiceGuide.userCompleteContext.variants) {
      expect(result.answer).not.toContain(variant.description);
    }
  });

  it("surfaces the scoped variant evidence when the user explicitly asks for it", () => {
    const result = answerSarthi({ message: "What regional variants or alternatives are there for Tamil Deepavali in Chennai?", context });
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", alternativesAvailable: true });
    if (!result.ok || !result.practiceGuide?.userCompleteContext) throw new Error("Expected Tamil Deepavali guide");
    expect(result.answer).toContain("This bounded guide preserves these variants:");
    for (const variant of result.practiceGuide.userCompleteContext.variants.slice(0, 3)) {
      expect(result.answer).toContain(variant.dimension);
      expect(result.answer).toContain(variant.description);
    }
  });

  it("renders variants and source identity behind collapsed details on all ritual surfaces", () => {
    const root = resolve(process.cwd(), "src/components");
    const surfaces = [
      resolve(root, "today/today-experience.tsx"),
      resolve(root, "atlas/atlas-shell.tsx"),
      resolve(root, "sarthi/sarthi-conversation.tsx"),
    ];
    for (const path of surfaces) {
      const source = readFileSync(path, "utf8");
      expect(source, path).toContain("userCompleteContext.variants.map");
      expect(source, path).toContain("Variants and boundaries");
      expect(source, path).not.toMatch(/<details[^>]*open[^>]*>[\s\S]{0,200}Variants and boundaries/);
    }
    for (const path of surfaces.slice(1)) {
      const source = readFileSync(path, "utf8");
      expect(source, path).toContain("practiceGuide.evidence.sources.map");
      expect(source, path).toContain("Guide sources");
    }
  });
});

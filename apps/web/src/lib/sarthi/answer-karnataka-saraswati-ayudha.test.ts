import { describe, expect, it } from "vitest";

import { answerSarthi } from "./answer";

describe("Sarthi Karnataka Saraswati/Ayudha guidance", () => {
  it("serves the exact Karnataka lane when region and tradition are known", () => {
    const answer = answerSarthi({
      message: "What should I do for Saraswati Puja in Karnataka?",
      context: { regionCode: "south-india", traditionCode: "smarta-south-india", languageCode: "en" },
    });
    expect(answer).toMatchObject({
      ok: true,
      mode: "contextual_ritual_guidance",
      practiceGuide: {
        companionToObservanceSlug: "karnataka-saraswati-ayudha-puja",
        evidence: { packId: "karnataka-saraswati-ayudha-puja-content-v1" },
      },
    });
    if (!answer.ok) throw new Error("Expected grounded Sarthi answer");
    expect(answer.answer).toContain("20 October");
    expect(answer.sourceBoundary).toContain("machinery shutdown");
  });

  it("asks for region rather than universalizing the Karnataka procedure", () => {
    const answer = answerSarthi({ message: "What should I do for Saraswati Puja?", context: { languageCode: "en" } });
    expect(answer).toMatchObject({ ok: true, mode: "context_clarification" });
    if (!answer.ok) throw new Error("Expected grounded Sarthi answer");
    expect(answer.followUpQuestion).toContain("Which city");
    expect(answer.practiceGuide).toBeUndefined();
  });
});

import { describe, expect, it } from "vitest";

import { answerSarthiWithKnowledge } from "./grounded-answer";
import { answerReviewedGriefGuidance, loadGriefGuidanceBundle } from "./grief-guidance";
import { planSarthiRequest } from "./planner";

describe("reviewed grief guidance", () => {
  it("binds four exact source units and keeps every prohibited claim false", () => {
    const bundle = loadGriefGuidanceBundle();
    expect(bundle.contract).toBe("DEVAM_SARTHI_REVIEWED_PERSONAL_GUIDANCE_V1");
    expect(bundle.bundle_id).toBe("grief-companion-v1");
    expect(Object.values(bundle.denials).every((value) => value === false)).toBe(true);
    expect(bundle.principles.map((principle) => [principle.literal_marker, principle.source_ordinal])).toEqual([
      ["BhG 2.11", 43],
      ["BhG 2.13", 45],
      ["BhG 2.14", 46],
      ["BhG 12.13-14", 444],
    ]);
  });

  it("does not force a scripture lens on an underspecified grief disclosure", async () => {
    const result = await answerSarthiWithKnowledge({ message: "I am grieving. Which scripture proves I should stop feeling this way?", context: { languageCode: "en" } });
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    if (!result.ok) throw new Error("Expected a clarification response");
    expect(result.answer).toContain("should not be hurried");
    expect(result.answer).toContain("What would help most right now");
  });

  it("answers an explicit opt-in with a bounded bilingual source-grounded reflection", async () => {
    const request = {
      message: "I am grieving and want a gentle source-grounded reflection, not a command or cure.",
      context: { languageCode: "en" },
    };
    const result = await answerSarthiWithKnowledge(request);
    expect(result).toMatchObject({ ok: true, mode: "reviewed_personal_guidance", alternativesAvailable: true });
    if (!result.ok) throw new Error("Expected reviewed grief guidance");
    expect(result.citations.map((citation) => citation.sourceOrdinal)).toEqual([43, 45, 46, 444]);
    expect(result.citations.every((citation) => citation.rightsLane === "citation_only" && citation.quotation === undefined)).toBe(true);
    expect(result.answer).toContain("No scripture proves");
    expect(result.answer).toContain("This lens is optional");
    expect(result.sourceBoundary).toContain("not diagnosis, cure, metaphysical proof, emotional timetable");

    const hindiRequest = {
      message: "मैं शोक में हूँ और गीता से कोमल स्रोत-बद्ध चिंतन चाहता हूँ, आदेश या उपचार नहीं।",
      context: { languageCode: "hi" },
    };
    const hindiPlan = planSarthiRequest(hindiRequest);
    const hindi = answerReviewedGriefGuidance(hindiRequest, hindiPlan);
    expect(hindi?.mode).toBe("reviewed_personal_guidance");
    expect(hindi?.answer).toContain("कोई ग्रन्थ यह सिद्ध नहीं करता");
    expect(hindi?.citations.map((citation) => citation.sourceOrdinal)).toEqual([43, 45, 46, 444]);
  });

  it("keeps immediate safety ahead of a requested spiritual reflection", async () => {
    const result = await answerSarthiWithKnowledge({
      message: "I am grieving and might hurt myself right now. I want a gentle Gita reflection.",
      context: { languageCode: "en" },
    });
    expect(result).toMatchObject({ ok: true, mode: "safety_escalation", citations: [] });
  });
});

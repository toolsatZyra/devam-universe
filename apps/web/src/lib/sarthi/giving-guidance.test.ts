import { describe, expect, it } from "vitest";

import { answerReviewedGivingGuidance, loadGivingGuidanceBundle } from "./giving-guidance";
import { answerSarthiWithKnowledge } from "./grounded-answer";
import { planSarthiRequest } from "./planner";

describe("reviewed proportional-giving guidance", () => {
  it("binds four exact source units and keeps every coercive or fixed-percentage claim false", () => {
    const bundle = loadGivingGuidanceBundle();
    expect(bundle.contract).toBe("DEVAM_SARTHI_REVIEWED_MORAL_GUIDANCE_V1");
    expect(bundle.bundle_id).toBe("proportional-giving-household-v1");
    expect(Object.values(bundle.denials).every((value) => value === false)).toBe(true);
    expect(bundle.principles.map((principle) => [principle.literal_marker, principle.source_ordinal])).toEqual([
      ["BhG 17.20", 554],
      ["BhG 17.21", 555],
      ["BhG 17.22", 556],
      ["BhG 18.63", 620],
    ]);
  });

  it("asks about essentials, dependents and genuine surplus before applying a giving lane", async () => {
    const request = { message: "दान और घर की जिम्मेदारी में किसे पहले रखूँ?", context: { languageCode: "hi" } };
    expect(planSarthiRequest(request).taskClass).toBe("moral_ambiguity");
    const result = await answerSarthiWithKnowledge(request);
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    if (!result.ok) throw new Error("Expected clarification");
    expect(result.answer).toContain("तय धार्मिक प्रतिशत नहीं");
    expect(result.followUpQuestion).toContain("वास्तव में अतिरिक्त");
  });

  it("offers proportional options once essential household needs are secure", async () => {
    const request = {
      message: "घर की आवश्यक जरूरतें सुरक्षित हैं और बात केवल अतिरिक्त खर्च की है। विकल्प कैसे सोचूँ?",
      context: { languageCode: "hi" },
    };
    const result = await answerSarthiWithKnowledge(request);
    expect(result).toMatchObject({ ok: true, mode: "reviewed_personal_guidance", alternativesAvailable: true });
    if (!result.ok) throw new Error("Expected reviewed giving guidance");
    expect(result.answer).toContain("कोई धार्मिक रूप से तय प्रतिशत");
    expect(result.answer).toContain("छोटी राशि");
    expect(result.citations.map((citation) => citation.sourceOrdinal)).toEqual([554, 555, 556, 620]);
    expect(result.citations.every((citation) => citation.rightsLane === "citation_only" && citation.quotation === undefined)).toBe(true);
    expect(result.sourceBoundary).toContain("essentials-first is an affected-party product boundary");
  });

  it("does not apply the reviewed route before both essentials and surplus are explicit", () => {
    const request = { message: "दान और घर की जिम्मेदारी में किसे पहले रखूँ?", context: { languageCode: "hi" } };
    const plan = planSarthiRequest(request);
    expect(answerReviewedGivingGuidance(request, plan)).toBeNull();
  });
});

import { describe, expect, it } from "vitest";

import { answerReviewedForgivenessGuidance, loadForgivenessGuidanceBundle } from "./forgiveness-guidance";
import { answerSarthiWithKnowledge } from "./grounded-answer";
import { planSarthiRequest } from "./planner";

describe("reviewed forgiveness-with-boundaries guidance", () => {
  it("binds four exact source units and keeps every unsafe inference false", () => {
    const bundle = loadForgivenessGuidanceBundle();
    expect(bundle.contract).toBe("DEVAM_SARTHI_REVIEWED_MORAL_GUIDANCE_V1");
    expect(bundle.bundle_id).toBe("forgiveness-with-boundaries-v1");
    expect(Object.values(bundle.denials).every((value) => value === false)).toBe(true);
    expect(bundle.principles.map((principle) => [principle.literal_marker, principle.source_ordinal])).toEqual([
      ["BhG 6.5", 217],
      ["BhG 12.13-14", 444],
      ["BhG 17.15", 549],
      ["BhG 18.63", 620],
    ]);
  });

  it("clarifies what forgiveness means and whether harm or access is continuing", async () => {
    const request = { message: "Should I forgive someone because forgiveness is virtuous?", context: { languageCode: "en" } };
    expect(planSarthiRequest(request).taskClass).toBe("moral_ambiguity");
    const result = await answerSarthiWithKnowledge(request);
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    if (!result.ok) throw new Error("Expected clarification");
    expect(result.answer).toContain("inner release, trust, contact, access, and reconciliation");
    expect(result.followUpQuestion).toContain("Is the harm continuing");
  });

  it("does not make renewed access or reconciliation the price of forgiveness", async () => {
    const request = {
      message: "The person keeps harming me and wants access again. Does dharma require reconciliation?",
      context: { languageCode: "en" },
    };
    const result = await answerSarthiWithKnowledge(request);
    expect(result).toMatchObject({ ok: true, mode: "reviewed_personal_guidance", alternativesAvailable: true });
    if (!result.ok) throw new Error("Expected reviewed forgiveness guidance");
    expect(result.answer).toContain("does not require you to restore access while harm continues");
    expect(result.answer).toContain("safety, accountability, demonstrated change, and your freely given consent");
    expect(result.citations.map((citation) => citation.sourceOrdinal)).toEqual([217, 444, 549, 620]);
    expect(result.citations.every((citation) => citation.rightsLane === "citation_only" && citation.quotation === undefined)).toBe(true);
    expect(result.sourceBoundary).toContain("separates forgiveness from trust, contact, access, and reconciliation");
  });

  it("does not bypass the immediate-safety route", async () => {
    const result = await answerSarthiWithKnowledge({
      message: "I am in immediate danger. The person keeps harming me and wants access again. Should I forgive them?",
      context: { languageCode: "en" },
    });
    expect(result).toMatchObject({ ok: true, mode: "safety_escalation", citations: [], alternativesAvailable: false });
  });

  it("does not apply the reviewed route when ongoing harm and renewed access are not both established", () => {
    const request = { message: "Should I forgive someone because forgiveness is virtuous?", context: { languageCode: "en" } };
    const plan = planSarthiRequest(request);
    expect(answerReviewedForgivenessGuidance(request, plan)).toBeNull();
  });
});

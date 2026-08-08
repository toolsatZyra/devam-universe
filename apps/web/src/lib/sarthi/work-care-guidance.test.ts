import { describe, expect, it } from "vitest";

import { answerSarthiWithKnowledge } from "./grounded-answer";
import { planSarthiRequest } from "./planner";
import { answerReviewedWorkCareGuidance, loadWorkCareGuidanceBundle } from "./work-care-guidance";

describe("reviewed work-care prioritization", () => {
  it("binds four exact source units and keeps prohibited universal claims false", () => {
    const bundle = loadWorkCareGuidanceBundle();
    expect(bundle.contract).toBe("DEVAM_SARTHI_REVIEWED_PERSONAL_GUIDANCE_V1");
    expect(bundle.bundle_id).toBe("work-care-prioritization-v1");
    expect(Object.values(bundle.denials).every((value) => value === false)).toBe(true);
    expect(bundle.principles.map((principle) => [principle.literal_marker, principle.source_ordinal])).toEqual([
      ["BhG 3.8", 108],
      ["BhG 6.17", 227],
      ["BhG 17.15", 549],
      ["BhG 18.63", 620],
    ]);
  });

  it("asks for affected-party and urgency context before assigning a priority", async () => {
    const result = await answerSarthiWithKnowledge({ message: "Work and family both feel overwhelming. How should I set priorities?", context: { languageCode: "en" } });
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    if (!result.ok) throw new Error("Expected clarification");
    expect(result.answer).toContain("people affected");
    expect(result.answer).not.toContain("Gita 3.8");
  });

  it("uses the user's non-deferrable-care fact for one reversible next step", async () => {
    const request = {
      message: "My child needs essential care today, and the rest of my work can be postponed. Help me choose one reversible next step.",
      context: { languageCode: "en" },
    };
    const result = await answerSarthiWithKnowledge(request);
    expect(result).toMatchObject({ ok: true, mode: "reviewed_personal_guidance", alternativesAvailable: true });
    if (!result.ok) throw new Error("Expected reviewed work-care guidance");
    expect(result.citations.map((citation) => citation.sourceOrdinal)).toEqual([108, 227, 549, 620]);
    expect(result.citations.every((citation) => citation.rightsLane === "citation_only" && citation.quotation === undefined)).toBe(true);
    expect(result.answer).toContain("care is necessary today");
    expect(result.answer).toContain("does not assign care by gender");
    expect(result.sourceBoundary).toContain("priority comes from the user's stated affected-party and deferral facts");
  });

  it("supports the frozen Hindi context without turning it into ritual intent", () => {
    const request = {
      message: "मेरे बच्चे की आज आवश्यक देखभाल है, बाकी काम टाले जा सकते हैं। मुझे एक उलट सकने वाला अगला कदम चुनने में मदद करें।",
      context: { languageCode: "hi" },
    };
    const plan = planSarthiRequest(request);
    expect(plan.taskClass).toBe("personal_guidance");
    const result = answerReviewedWorkCareGuidance(request, plan);
    expect(result?.mode).toBe("reviewed_personal_guidance");
    expect(result?.answer).toContain("बच्चे की देखभाल आज आवश्यक है");
    expect(result?.citations.map((citation) => citation.sourceOrdinal)).toEqual([108, 227, 549, 620]);
  });
});

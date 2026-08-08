import { describe, expect, it } from "vitest";

import { answerReviewedConsentGuidance, loadConsentGuidanceBundle } from "./consent-guidance";
import { answerSarthiWithKnowledge } from "./grounded-answer";
import { planSarthiRequest } from "./planner";

describe("reviewed religious-participation consent guidance", () => {
  it("binds three exact source units and keeps every coercive claim false", () => {
    const bundle = loadConsentGuidanceBundle();
    expect(bundle.contract).toBe("DEVAM_SARTHI_REVIEWED_MORAL_GUIDANCE_V1");
    expect(bundle.bundle_id).toBe("religious-participation-consent-v1");
    expect(Object.values(bundle.denials).every((value) => value === false)).toBe(true);
    expect(bundle.principles.map((principle) => [principle.literal_marker, principle.source_ordinal])).toEqual([
      ["BhG 12.13-14", 444],
      ["BhG 17.15", 549],
      ["BhG 18.63", 620],
    ]);
  });

  it("asks age, capacity, dependency and pressure before applying the adult lane", async () => {
    const request = { message: "परिवार के एक सदस्य को पूजा में आने का मन नहीं है। क्या करना चाहिए?", context: { languageCode: "hi" } };
    expect(planSarthiRequest(request).taskClass).toBe("moral_ambiguity");
    const result = await answerSarthiWithKnowledge(request);
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    if (!result.ok) throw new Error("Expected clarification");
    expect(result.answer).toContain("अपने आप पूजा");
    expect(result.followUpQuestion).toContain("सक्षम वयस्क");
  });

  it("protects a competent adult dependent's explicit refusal without theological coercion", async () => {
    const request = {
      message: "वह वयस्क आश्रित है और स्पष्ट रूप से मना कर रहा है। परिवार दबाव डाल रहा है।",
      context: { languageCode: "hi" },
    };
    const result = await answerSarthiWithKnowledge(request);
    expect(result).toMatchObject({ ok: true, mode: "reviewed_personal_guidance", alternativesAvailable: true });
    if (!result.ok) throw new Error("Expected reviewed consent guidance");
    expect(result.answer).toContain("परिवार को उसका इनकार स्वीकार करना चाहिए");
    expect(result.answer).toContain("भाग न लेने पर दण्ड नहीं होगा");
    expect(result.citations.map((citation) => citation.sourceOrdinal)).toEqual([444, 549, 620]);
    expect(result.citations.every((citation) => citation.rightsLane === "citation_only" && citation.quotation === undefined)).toBe(true);
    expect(result.sourceBoundary).toContain("competent-adult refusal and non-retaliation are the product boundary");
  });

  it("does not apply the competent-adult lane to a child or an ambiguous capacity context", () => {
    const request = {
      message: "My child refuses to join puja and the family is pressuring them.",
      context: { languageCode: "en" },
    };
    const plan = planSarthiRequest(request);
    expect(plan.taskClass).toBe("moral_ambiguity");
    expect(answerReviewedConsentGuidance(request, plan)).toBeNull();
  });
});

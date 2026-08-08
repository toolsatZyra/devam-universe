import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import type { GroundedClaim } from "../evidence/contracts";
import type { SarthiContext } from "./contracts";
import { assessClaimCoverage, permitsGenericClaimFallback, planSarthiRequest } from "./planner";

type PilotScenario = {
  id: string;
  family: string;
  prompt: string;
  context: SarthiContext;
  expectedTaskClass: string;
  expectedDecisionImpact: string;
  expectedAnswerMode: string;
};

function fixture(): { contract: string; status: string; scenarios: PilotScenario[] } {
  return JSON.parse(readFileSync(resolve(process.cwd(), "evaluation/sarthi-pilot-scenarios-v0.1.json"), "utf8")) as {
    contract: string;
    status: string;
    scenarios: PilotScenario[];
  };
}

function claim(overrides: Partial<GroundedClaim> = {}): GroundedClaim {
  return {
    id: "claim-id",
    stableKey: "claim-key",
    subject: { slug: "subject", canonicalName: "Subject" },
    statement: "A source-bounded statement.",
    languageCode: "en",
    claimKind: "source_bounded_description",
    evidenceClass: "primary_source",
    confidence: 0.9,
    applicability: {},
    uncertaintyNote: null,
    rightsLane: "product_allowed",
    publicationState: "published",
    evidence: [{
      passageId: "passage-id",
      sourceObjectId: "source-id",
      sourceOrdinal: 1,
      locator: { line: 1 },
      exactText: "Evidence",
      languageCode: "sa",
      spanSha256: "a".repeat(64),
      sourceSha256: "b".repeat(64),
      workSlug: "work",
      workTitle: "Work",
      editionTitle: "Edition",
      rightsLane: "product_allowed",
      publicationState: "published",
      evidenceRole: "supports",
      note: null,
    }],
    ...overrides,
  };
}

describe("Sarthi thin request planner", () => {
  it("keeps the frozen pre-implementation pilot contract balanced and unique", () => {
    const pilot = fixture();
    expect(pilot.contract).toBe("DEVAM_SARTHI_WISDOM_SUPPORT_PILOT_SCENARIOS_V0_1");
    expect(pilot.status).toBe("frozen_before_thin_planner_implementation");
    expect(pilot.scenarios).toHaveLength(40);
    expect(new Set(pilot.scenarios.map((item) => item.id)).size).toBe(40);
    const counts = Object.fromEntries(
      [...new Set(pilot.scenarios.map((item) => item.family))]
        .sort()
        .map((family) => [family, pilot.scenarios.filter((item) => item.family === family).length]),
    );
    expect(counts).toEqual({
      comparison: 5,
      exact_fact: 5,
      festival_story: 5,
      moral_ambiguity: 5,
      panchang: 5,
      personal_guidance: 5,
      reflection: 5,
      ritual_vidhi: 5,
    });
  });

  it("matches every frozen scenario's task, impact and answer-mode contract", () => {
    for (const scenario of fixture().scenarios) {
      const plan = planSarthiRequest({ message: scenario.prompt, context: scenario.context });
      expect(
        { taskClass: plan.taskClass, decisionImpact: plan.decisionImpact, answerMode: plan.answerMode },
        scenario.id,
      ).toEqual({
        taskClass: scenario.expectedTaskClass,
        decisionImpact: scenario.expectedDecisionImpact,
        answerMode: scenario.expectedAnswerMode,
      });
    }
  });

  it("records operational routing facts without a reasoning transcript", () => {
    const plan = planSarthiRequest({
      message: "What is the vidhi for Durga Puja at home?",
      context: { languageCode: "en" },
    });
    expect(plan).toMatchObject({
      contract: "DEVAM_SARTHI_RUNTIME_PLAN_V0_1",
      taskClass: "ritual_vidhi",
      authorityCeiling: "practice_companion",
      missingMaterialContext: ["location_or_region", "family_or_tradition"],
      routes: ["procedure_resolver"],
      answerMode: "clarify",
    });
    expect(Object.keys(plan)).not.toContain("reasoning");
    expect(Object.keys(plan)).not.toContain("chainOfThought");
  });

  it("does not treat a citation as complete coverage for comparison or guidance", () => {
    const comparison = planSarthiRequest({ message: "Compare two traditions." });
    const coverage = assessClaimCoverage(comparison, [claim()]);
    expect(coverage).toMatchObject({
      sufficient: false,
      present: ["claim", "source_evidence"],
      missing: ["parallel_claims", "non_equivalence"],
    });
    expect(permitsGenericClaimFallback(comparison)).toBe(false);
    expect(permitsGenericClaimFallback(planSarthiRequest({ message: "What does this source say?" }))).toBe(true);
  });

  it("recognizes separately scoped source accounts as variant evidence without calling them consensus", () => {
    const story = planSarthiRequest({ message: "What is the origin story of this festival?" });
    const coverage = assessClaimCoverage(story, [
      claim({ id: "one", applicability: { region: "north" } }),
      claim({
        id: "two",
        applicability: { region: "south" },
        evidence: [{ ...claim().evidence[0], passageId: "passage-two", sourceObjectId: "source-two", workSlug: "other-work", workTitle: "Other Work" }],
      }),
    ]);
    expect(coverage.sufficient).toBe(true);
    expect(coverage.present).toEqual(expect.arrayContaining(["parallel_claims", "variant_identity"]));
  });

  it("retains the task class across a short server-loaded follow-up", () => {
    const plan = planSarthiRequest({
      message: "Money is the main worry.",
      recentTurns: [
        { role: "user", content: "My parents and I disagree about my career." },
        { role: "assistant", content: "What is materially changing the decision?" },
      ],
    });
    expect(plan).toMatchObject({ taskClass: "personal_guidance", decisionImpact: "consequential", routes: ["bounded_guidance"] });
  });
});

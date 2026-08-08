import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { resolveRishiPanchamiProcedure } from "./rishi-panchami";

describe("Rishi Panchami Saptarishi reflection", () => {
  it("serves only exact North/West Smarta pairs", () => {
    const guide = resolveRishiPanchamiProcedure({ observanceSlug: "rishi-panchami", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" });
    expect(guide?.evidence.packFileSha256).toBe("b5a463b6a93045ef442c449b723de738bd9ea2976ec69b826b4863a7b3202de3");
    expect(guide?.tiers.map((tier) => tier.estimatedMinutes)).toEqual([10, 30, 60]);
    expect(resolveRishiPanchamiProcedure({ observanceSlug: "rishi-panchami", languageCode: "en", regionCode: "south-india", traditionCode: "smarta-south-india" })).toBeNull();
  });
  it("supports sourced learning while rejecting impurity, atonement, eligibility, and outcome claims", () => {
    const guide = resolveRishiPanchamiProcedure({ observanceSlug: "rishi-panchami", languageCode: "hi", regionCode: "west-india", traditionCode: "smarta-west-india" });
    expect(guide?.familyPracticeNote).toContain("मासिक धर्म");
    expect(guide?.boundaries).toMatchObject({ saptarishiRemembranceAttributableStudyTeacherGratitudeAndServiceSupported: true, multipleSaptarishiListsAndSourceLayersAcknowledged: true, fastFoodDietaryOrMedicalGuidanceGiven: false, menstruationOrPersonDescribedAsImpure: false, rajaswalaDoshaAtonementOrGuiltPromoted: false, womenOnlyParticipationUniversalized: false, bhaiPanchamiMerged: false, purificationForgivenessMeritHealthProtectionOrOtherOutcomeGuaranteed: false });
  });
  it("rehashes the retained carrier", () => {
    const source = readFileSync(resolve(process.cwd(), "../..", "source_vault/objects/sha256/a6/a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b"));
    expect(source).toHaveLength(93531683);
    expect(createHash("sha256").update(source).digest("hex")).toBe("a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b");
  });
});

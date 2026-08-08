import { describe, expect, it } from "vitest";
import { resolveKalabhairavaProcedure } from "./kalabhairava";

describe("Kalabhairava Jayanti remembrance", () => {
  it("serves only the exact North Smarta and Kashi regional pairs", () => {
    const north = resolveKalabhairavaProcedure({ observanceSlug: "kalabhairava-jayanti", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" });
    const kashi = resolveKalabhairavaProcedure({ observanceSlug: "kalabhairava-jayanti", languageCode: "hi", regionCode: "kashi-varanasi", traditionCode: "regional-kashi-varanasi" });
    expect(north?.evidence.packFileSha256).toBe("97f7c1b0851467f1ef456fa14d306b5987653ed4df11fd934cea5c919a47a15a");
    expect(north?.tiers.map((tier) => tier.estimatedMinutes)).toEqual([10, 30, 60]);
    expect(kashi?.familyPracticeNote).toContain("काशी");
    expect(resolveKalabhairavaProcedure({ observanceSlug: "kalabhairava-jayanti", languageCode: "en", regionCode: "west-india", traditionCode: "smarta-west-india" })).toBeNull();
  });
  it("rejects fear, occult, harm, intoxicant, vigil, formal rite, and outcome instructions", () => {
    const guide = resolveKalabhairavaProcedure({ observanceSlug: "kalabhairava-jayanti", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" });
    expect(guide?.boundaries).toMatchObject({ formalPujaMantraTantraOfferingThreadOilOrClosePrescribed: false, alcoholMeatAnimalOfferingOrHarmInstructed: false, fearOccultExorcismOrProtectionRitePrescribed: false, nightVigilOrUnsafeTravelRequired: false, kashiTemplePracticeUniversalized: false, fearProtectionLiberationMeritProsperityOrOtherOutcomeGuaranteed: false });
  });
});

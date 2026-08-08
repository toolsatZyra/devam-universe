import { describe, expect, it } from "vitest";
import { resolveGitaJayantiProcedure } from "./gita-jayanti";

describe("Gita Jayanti reading and reflection", () => {
  it("serves complete bilingual tiered guidance for supported Smarta and ISKCON contexts", () => {
    const english = resolveGitaJayantiProcedure({ observanceSlug: "mokshada-ekadashi", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" });
    const hindi = resolveGitaJayantiProcedure({ observanceSlug: "mokshada-ekadashi", languageCode: "hi", regionCode: "west-india", traditionCode: "vaishnava-iskcon" });
    expect(english?.tiers.map((tier) => [tier.tier, tier.estimatedMinutes])).toEqual([["minimum", 10], ["standard", 30], ["elaborate", 90]]);
    expect(hindi?.title).toBe("गीता जयंती पाठ और चिंतन");
    expect(english?.evidence).toMatchObject({ packFileSha256: "a3e96f43d276e60cf3d7782861da2a120f2d2ac53f78a50102a715a2c018afbb", sourceTextReturnedByApi: false });
    expect(english?.boundaries).toMatchObject({ fastOrDietaryRegimenPrescribed: false, paranaTimingServedByThisGuide: false, oneTranslationOrCommentaryTreatedAsUniversal: false });
  });

  it("fails closed for the wrong observance or unsupported/mismatched context", () => {
    expect(resolveGitaJayantiProcedure({ observanceSlug: "gita-jayanti", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" })).toBeNull();
    expect(resolveGitaJayantiProcedure({ observanceSlug: "mokshada-ekadashi", languageCode: "en", regionCode: "west-india", traditionCode: "smarta-north-india" })).toBeNull();
    expect(resolveGitaJayantiProcedure({ observanceSlug: "mokshada-ekadashi", languageCode: "en", regionCode: "bengal", traditionCode: "shakta-bengal" })).toBeNull();
  });
});

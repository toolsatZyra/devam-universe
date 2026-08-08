import { describe, expect, it } from "vitest";
import { resolveAhoiAshtamiProcedure } from "./ahoi-ashtami";

describe("Ahoi Ashtami North India guidance", () => {
  const request = { observanceSlug: "ahoi-ashtami-north-india", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" } as const;
  it("offers inclusive 10/25/60-minute family forms without prescribing fasting or outcomes", () => {
    const guide = resolveAhoiAshtamiProcedure(request);
    expect(guide?.tiers.map((tier) => [tier.tier, tier.estimatedMinutes])).toEqual([["minimum", 10], ["standard", 25], ["elaborate", 60]]);
    expect(guide?.evidence.packFileSha256).toBe("9c052d7a4c5ad675fcb6aca414cdd64374e436a3b5c4986ab2cb52ec07cac584");
    expect(guide?.boundaries).toMatchObject({ allChildrenInclusiveWordingUsed: true, materialFreeAndFlameFreeFallbackSupported: true, fastOrNirjalaRegimenPrescribed: false, medicalOrDietaryAdviceGiven: false, mothersOrWomenOnlyUniversalized: false, sonsOnlyWordingAdopted: false, formalSankalpaMantraKathaArghyaOrPujaSequenceIncluded: false, oneImageStoryStarOrMoonRuleRequired: false, childLongevityProtectionMeritOrSuccessGuaranteed: false });
  });
  it("returns Hindi and fails closed outside the exact North India lane", () => {
    expect(resolveAhoiAshtamiProcedure({ ...request, languageCode: "hi" })?.title).toContain("अहोई अष्टमी");
    expect(resolveAhoiAshtamiProcedure({ ...request, regionCode: "west-india" })).toBeNull();
    expect(resolveAhoiAshtamiProcedure({ ...request, traditionCode: "smarta-west-india" })).toBeNull();
  });
});

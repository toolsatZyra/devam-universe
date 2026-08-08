import { describe, expect, it } from "vitest";
import { resolveBandiChhorProcedure } from "./bandi-chhor";

describe("Bandi Chhor Divas SGPC guidance", () => {
  const request = { observanceSlug: "bandi-chhor-divas-sgpc", languageCode: "en", regionCode: "sikh-punjab", traditionCode: "sikh-sgpc" } as const;
  it("offers bounded 10/30/60-minute participation without inventing Sikh liturgy or outcomes", () => {
    const guide = resolveBandiChhorProcedure(request);
    expect(guide?.tiers.map((tier) => [tier.tier, tier.estimatedMinutes])).toEqual([["minimum", 10], ["standard", 30], ["elaborate", 60]]);
    expect(guide?.evidence.packFileSha256).toBe("3653b6ad96a2237830ca94bbe9e25cfffb4c50119c294f87e24742ff42f50388");
    expect(guide?.boundaries).toMatchObject({ guruHargobind52RulersAndCollectiveFreedomSupported: true, materialFreeAndFlameFreeFallbackSupported: true, formalPaathKirtanArdasHukamnamaOrGurdwaraProgrammeIncluded: false, langarPreparationOrFoodHandlingPrescribed: false, realLightsCandlesOrFireworksRequired: false, donationPurchaseOrSpecialClothingRequired: false, spiritualMeritProtectionOrSuccessGuaranteed: false, hinduDiwaliMerged: false, jainDiwaliMerged: false });
  });
  it("returns Hindi and fails closed outside the exact SGPC lane", () => {
    expect(resolveBandiChhorProcedure({ ...request, languageCode: "hi" })?.title).toContain("बंदी छोड़ दिवस");
    expect(resolveBandiChhorProcedure({ ...request, regionCode: "north-india" })).toBeNull();
    expect(resolveBandiChhorProcedure({ ...request, traditionCode: "jain-umbrella" })).toBeNull();
  });
});

import { describe, expect, it } from "vitest";
import { resolveBalipadyamiProcedure } from "./balipadyami";

describe("Karnataka Balipadyami guidance", () => {
  const request = { observanceSlug: "karnataka-balipadyami", languageCode: "en", regionCode: "south-india", traditionCode: "smarta-south-india" } as const;
  it("offers bounded 10/30/75-minute forms without compulsory material, abhisheka, flame, or outcome", () => {
    const guide = resolveBalipadyamiProcedure(request);
    expect(guide?.tiers.map((tier) => [tier.tier, tier.estimatedMinutes])).toEqual([["minimum", 10], ["standard", 30], ["elaborate", 75]]);
    expect(guide?.evidence.packFileSha256).toBe("93306a99d5f2865fe63022bf76802d92130120c8dc2b6a55d7d6f9e3d22dc5ad");
    expect(guide?.boundaries).toMatchObject({ baliVamanaRemembranceGenerosityAndFamilyServiceSupported: true, materialFreeAndFlameFreeFallbackSupported: true, formalTempleAbhishekaOrMantrasIncluded: false, clayOrCowDungBaliRepresentationRequired: false, realLampsOrLargeLightDisplayRequired: false, fastFoodGiftPurchaseOrSpecialClothingPrescribed: false, prosperityOrWelfareGuaranteed: false, maharashtraBaliPratipadaMerged: false, bapsGujaratiNewYearMerged: false, govardhanaPujaMerged: false });
  });
  it("returns Hindi and fails closed outside Karnataka Smarta South India", () => {
    expect(resolveBalipadyamiProcedure({ ...request, languageCode: "hi" })?.title).toContain("बलि पाड्यमी");
    expect(resolveBalipadyamiProcedure({ ...request, regionCode: "west-india" })).toBeNull();
    expect(resolveBalipadyamiProcedure({ ...request, traditionCode: "vaishnava-iskcon" })).toBeNull();
  });
});

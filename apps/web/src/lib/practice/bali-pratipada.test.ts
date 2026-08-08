import { describe, expect, it } from "vitest";
import { resolveBaliPratipadaProcedure } from "./bali-pratipada";

describe("Bali Pratipada Maharashtra family guidance", () => {
  const request = { observanceSlug: "bali-pratipada", languageCode: "en", regionCode: "west-india", traditionCode: "smarta-west-india" } as const;

  it("offers bounded 10/25/60-minute family forms without inventing a universal rite", () => {
    const guide = resolveBaliPratipadaProcedure(request);
    expect(guide?.tiers.map((tier) => [tier.tier, tier.estimatedMinutes])).toEqual([["minimum", 10], ["standard", 25], ["elaborate", 60]]);
    expect(guide?.boundaries).toMatchObject({ kingBaliRemembranceAndFamilyTimeCoreSupported: true, wifeToHusbandOrSpouseRiteRequired: false, realFlameRequired: false, giftOrSpendingRequired: false, commercialNewYearAccountRitualRequired: false, fastingPrescribed: false, guaranteedProsperityOrMaterialOutcomeClaimed: false, govardhanaOrAnnakutMerged: false, gujaratiOrBapsNewYearMerged: false, southIndiaBalipadyamiCompleted: false });
  });

  it("returns Hindi and fails closed for another regional or sampradaya lane", () => {
    expect(resolveBaliPratipadaProcedure({ ...request, languageCode: "hi" })?.title).toContain("बलि प्रतिपदा");
    expect(resolveBaliPratipadaProcedure({ ...request, regionCode: "south-india" })).toBeNull();
    expect(resolveBaliPratipadaProcedure({ ...request, traditionCode: "vaishnava-iskcon" })).toBeNull();
  });
});

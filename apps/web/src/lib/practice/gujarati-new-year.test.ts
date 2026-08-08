import { describe, expect, it } from "vitest";
import { resolveGujaratiNewYearProcedure } from "./gujarati-new-year";

describe("BAPS Gujarati New Year guidance", () => {
  const request = { observanceSlug: "gujarati-new-year-baps", languageCode: "en", regionCode: "baps-gujarat", traditionCode: "swaminarayan-baps" } as const;
  it("offers bounded 10/30/75-minute forms without a compulsory large Annakut, business rite, or prosperity promise", () => {
    const guide = resolveGujaratiNewYearProcedure(request);
    expect(guide?.tiers.map((tier) => [tier.tier, tier.estimatedMinutes])).toEqual([["minimum", 10], ["standard", 30], ["elaborate", 75]]);
    expect(guide?.evidence.packFileSha256).toBe("be58e4a855f090c8fba3ac965859df5a8b066e4d70746b6093feef90caada09c");
    expect(guide?.boundaries).toMatchObject({ bapsFamilyOrMandirPrayerGratitudeGreetingsAndSevaSupported: true, oneSimpleHomeOfferingWhenAlreadyEstablishedSupported: true, formalAnnakutThalAartiOrMantrasIncluded: false, largeFoodArrayRequired: false, businessAccountBookPujaRequired: false, newClothesPurchaseSweetsOrGiftRequired: false, realFlameRequired: false, wealthSuccessOrProsperityGuaranteed: false, baliPratipadaMerged: false, govardhanaPujaMerged: false, southIndianBalipadyamiMerged: false });
  });
  it("returns Hindi and fails closed outside the exact BAPS Gujarat route", () => {
    expect(resolveGujaratiNewYearProcedure({ ...request, languageCode: "hi" })?.title).toContain("गुजराती नववर्ष");
    expect(resolveGujaratiNewYearProcedure({ ...request, regionCode: "west-india" })).toBeNull();
    expect(resolveGujaratiNewYearProcedure({ ...request, traditionCode: "smarta-west-india" })).toBeNull();
  });
});

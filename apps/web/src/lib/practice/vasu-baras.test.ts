import { describe, expect, it } from "vitest";
import { resolveVasuBarasProcedure } from "./vasu-baras";

describe("Maharashtra Vasu Baras family guidance", () => {
  const request = { observanceSlug: "govatsa-dwadashi", languageCode: "en", regionCode: "west-india", traditionCode: "smarta-west-india" } as const;

  it("offers no-contact 10/25/60-minute forms without unsafe or transactional animal instructions", () => {
    const guide = resolveVasuBarasProcedure(request);
    expect(guide?.tiers.map((tier) => [tier.tier, tier.estimatedMinutes])).toEqual([["minimum", 10], ["standard", 25], ["elaborate", 60]]);
    expect(guide?.boundaries).toMatchObject({ maharashtraVasuBarasDiwaliOpeningIdentitySupported: true, gratitudeToCattleFarmersAndResponsibleCareSupported: true, noContactFamilyFormSupported: true, animalContactFeedingWashingRestrainingOrDecorationInstructed: false, flameNearAnimalsInstructed: false, cowPurchaseSaleOrGiftRequired: false, fastOrDairyWheatAbstentionPrescribed: false, medicalVeterinaryOrDietaryAdviceGiven: false, giftDonationOrSpendingRequired: false, guaranteedProsperityMeritOrFamilyOutcomeClaimed: false });
  });

  it("returns Hindi and fails closed for North India or another tradition", () => {
    expect(resolveVasuBarasProcedure({ ...request, languageCode: "hi" })?.title).toContain("वसुबारस");
    expect(resolveVasuBarasProcedure({ ...request, regionCode: "north-india" })).toBeNull();
    expect(resolveVasuBarasProcedure({ ...request, traditionCode: "vaishnava-iskcon" })).toBeNull();
  });
});

import { describe, expect, it } from "vitest";
import { resolveDevDeepawaliProcedure } from "./dev-deepawali";

describe("Varanasi Dev Deepawali participation pack", () => {
  const request = { observanceSlug: "dev-deepawali-varanasi", languageCode: "en", regionCode: "kashi-varanasi", traditionCode: "regional-kashi-varanasi" } as const;
  it("returns a bilingual bounded guide without unsafe river, flame, boat, or outcome instructions", () => {
    const guide = resolveDevDeepawaliProcedure(request);
    expect(guide).toMatchObject({ title: "Varanasi Dev Deepawali reflection and participation", evidence: { packFileSha256: "20e5158a3b0b5f7a1c590a2478f642af782635704f56ba34a36feaa1c4e322f7" }, boundaries: { flameFreeHomeFormSupported: true, genericKartikaPurnimaOrBapsDevDiwaliMerged: false, ritualBathingOrWaterEntryInstructed: false, floatingLampsOrRiverOfferingsInstructed: false, unattendedFlameOrFireworksRecommended: false, boatBookingCrowdRouteAccessOrTravelAdviceGiven: false, sinRemovalPurificationMeritProtectionOrOutcomeGuaranteed: false } });
    expect(guide?.tiers.map((tier) => tier.estimatedMinutes)).toEqual([10, 30, 60]);
    expect(resolveDevDeepawaliProcedure({ ...request, languageCode: "hi" })?.title).toBe("वाराणसी देव दीपावली चिंतन और सहभागिता");
  });
  it("fails closed outside the exact Kashi regional context", () => {
    expect(resolveDevDeepawaliProcedure({ ...request, regionCode: "north-india", traditionCode: "smarta-north-india" })).toBeNull();
  });
});

import { describe, expect, it } from "vitest";
import { resolveTamilDeepavaliProcedure } from "./tamil-deepavali";

describe("Tamil Deepavali household practice", () => {
  const request = { observanceSlug: "tamil-deepavali-naraka-chaturdashi", languageCode: "en", regionCode: "south-india", traditionCode: "smarta-south-india" } as const;
  it("keeps a safe pre-sunrise bath core without oil, fireworks, or universal overreach", () => {
    const guide = resolveTamilDeepavaliProcedure(request);
    expect(guide?.tiers.map((tier) => [tier.tier, tier.estimatedMinutes])).toEqual([["minimum", 15], ["standard", 30], ["elaborate", 60]]);
    expect(guide?.boundaries).toMatchObject({ preSunriseFamilyBathCoreSupported: true, sesameOilRequiredForEveryone: false, fireworksRequiredOrRecommended: false, newPurchaseOrNewClothesRequired: false, northWestNarakaOrLakshmiPujaMerged: false });
  });
  it("returns the authored Hindi form and fails closed outside the exact pair", () => {
    expect(resolveTamilDeepavaliProcedure({ ...request, languageCode: "hi" })?.title).toContain("तमिल दीपावली");
    expect(resolveTamilDeepavaliProcedure({ ...request, regionCode: "west-india" })).toBeNull();
    expect(resolveTamilDeepavaliProcedure({ ...request, traditionCode: "smarta-west-india" })).toBeNull();
  });
});

import { describe, expect, it } from "vitest";
import { resolveNarakaChaturdashiProcedure } from "./naraka-chaturdashi";

describe("Maharashtra Naraka Chaturdashi household guidance", () => {
  const request = { observanceSlug: "naraka-chaturdashi", languageCode: "en", regionCode: "west-india", traditionCode: "smarta-west-india" } as const;
  it("offers safe 10/25/60-minute forms without mandatory oil, fireworks, purchases, or outcome claims", () => {
    const guide = resolveNarakaChaturdashiProcedure(request);
    expect(guide?.tiers.map((tier) => [tier.tier, tier.estimatedMinutes])).toEqual([["minimum", 10], ["standard", 25], ["elaborate", 60]]);
    expect(guide?.boundaries).toMatchObject({ maharashtraEarlyBathAndNarakasuraRemembranceSupported: true, normalSafeBathFallbackSupported: true, sesameOilOrUbtanRequiredForEveryone: false, karitaCrushingRequired: false, fireworksRequiredOrRecommended: false, newClothesOrPurchaseRequired: false, medicalOrDermatologicalAdviceGiven: false, guaranteedAvoidanceOfNarakaOrOtherOutcomeClaimed: false, kaliChaudasMergedOrCompleted: false, tamilDeepavaliMergedOrCompleted: false });
  });
  it("returns Hindi and fails closed outside the exact Maharashtra lane", () => {
    expect(resolveNarakaChaturdashiProcedure({ ...request, languageCode: "hi" })?.title).toContain("नरक चतुर्दशी");
    expect(resolveNarakaChaturdashiProcedure({ ...request, regionCode: "north-india" })).toBeNull();
    expect(resolveNarakaChaturdashiProcedure({ ...request, traditionCode: "smarta-south-india" })).toBeNull();
  });
});

import { describe, expect, it } from "vitest";
import { resolveBhaiDoojProcedure } from "./bhai-dooj";

describe("Bhai Dooj North India household guidance", () => {
  const request = { observanceSlug: "bhai-dooj", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" } as const;
  it("offers 10/25/60-minute forms without compulsory flame, gift, fast, fixed tilak, or promised outcome", () => {
    const guide = resolveBhaiDoojProcedure(request);
    expect(guide?.tiers.map((tier) => [tier.tier, tier.estimatedMinutes])).toEqual([["minimum", 10], ["standard", 25], ["elaborate", 60]]);
    expect(guide?.boundaries).toMatchObject({ siblingTikaPrayerAndSharedFoodCoreSupported: true, fixedTilakRecipeRequired: false, aratiOrRealFlameRequired: false, giftOrSpendingRequired: false, fastingPrescribed: false, curseOrTonguePrickingInstructionIncluded: false, guaranteedLongevityProtectionOrProsperityClaimed: false, genderedProtectionPromiseRequired: false });
  });
  it("returns Hindi and fails closed for another regional form", () => {
    expect(resolveBhaiDoojProcedure({ ...request, languageCode: "hi" })?.title).toContain("भाई दूज");
    expect(resolveBhaiDoojProcedure({ ...request, regionCode: "west-india" })).toBeNull();
    expect(resolveBhaiDoojProcedure({ ...request, traditionCode: "regional-bengal" })).toBeNull();
  });
});

import { describe, expect, it } from "vitest";
import { resolveJainDiwaliProcedure } from "./jain-diwali";

describe("Jain Diwali umbrella guidance", () => {
  const request = { observanceSlug: "jain-diwali-umbrella", languageCode: "en", regionCode: "jain-india", traditionCode: "jain-umbrella" } as const;
  it("offers bounded 10/30/60-minute reflections without invented Jain rites or outcomes", () => {
    const guide = resolveJainDiwaliProcedure(request);
    expect(guide?.tiers.map((tier) => [tier.tier, tier.estimatedMinutes])).toEqual([["minimum", 10], ["standard", 30], ["elaborate", 60]]);
    expect(guide?.evidence.packFileSha256).toBe("3fe6bfc3872093858cff47040fa8764ab4cf1c0de37789161b5854dd954bc8f6");
    expect(guide?.boundaries).toMatchObject({ mahaviraLiberationAndJainValuesReflectionSupported: true, materialFreeAndFlameFreeFallbackSupported: true, formalPujaMantraStotraScriptureOrPratikramanIncluded: false, fastAusterityNirvanLadooOrTempleProcedurePrescribed: false, realLampOrFirecrackersRequired: false, mokshaMeritOrSpiritualOutcomeGuaranteed: false, jainSectLanesEquated: false, novemberNineAndTenVariantsMerged: false, hinduLakshmiPujaMerged: false, sikhBandiChhorMerged: false });
  });
  it("returns Hindi and fails closed outside the exact umbrella Jain context", () => {
    expect(resolveJainDiwaliProcedure({ ...request, languageCode: "hi" })?.title).toContain("जैन दीपावली");
    expect(resolveJainDiwaliProcedure({ ...request, regionCode: "north-india" })).toBeNull();
    expect(resolveJainDiwaliProcedure({ ...request, traditionCode: "smarta-north-india" })).toBeNull();
  });
});

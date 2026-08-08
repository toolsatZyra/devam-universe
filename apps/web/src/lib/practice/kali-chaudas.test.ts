import { describe, expect, it } from "vitest";
import { resolveKaliChaudasProcedure } from "./kali-chaudas";

describe("BAPS Gujarat Kali Chaudas guidance", () => {
  const request = {
    observanceSlug: "kali-chaudas-baps",
    languageCode: "en",
    regionCode: "baps-gujarat",
    traditionCode: "swaminarayan-baps",
  } as const;

  it("offers bounded 10/25/60-minute participation without inventing occult or formal ritual", () => {
    const guide = resolveKaliChaudasProcedure(request);
    expect(guide?.tiers.map((tier) => [tier.tier, tier.estimatedMinutes])).toEqual([
      ["minimum", 10],
      ["standard", 25],
      ["elaborate", 60],
    ]);
    expect(guide?.evidence.packFileSha256).toBe("62924b358c4b85cb907cb885bfac1dfe750b6c23ec5d1eee295fac51dbb7d05f");
    expect(guide?.boundaries).toMatchObject({
      bapsFamilyOrMandirPrayerAndHanumanRemembranceSupported: true,
      quietReflectionFallbackSupported: true,
      formalHanumanPujaOrMantrasIncluded: false,
      tantricOccultOrExorcisticInstructionIncluded: false,
      chilliLemonSmokeOrHarmRitualIncluded: false,
      fastOrFixedOfferingPrescribed: false,
      realFlameRequired: false,
      evilForceRemovalOrProtectionGuaranteed: false,
      maharashtraNarakaChaturdashiMerged: false,
      tamilDeepavaliMerged: false,
      bengalKaliPujaMerged: false,
    });
  });

  it("returns the independently authored Hindi guide and fails closed outside BAPS Gujarat", () => {
    expect(resolveKaliChaudasProcedure({ ...request, languageCode: "hi" })?.title).toContain("काली चौदश");
    expect(resolveKaliChaudasProcedure({ ...request, regionCode: "west-india" })).toBeNull();
    expect(resolveKaliChaudasProcedure({ ...request, traditionCode: "smarta-west-india" })).toBeNull();
  });
});

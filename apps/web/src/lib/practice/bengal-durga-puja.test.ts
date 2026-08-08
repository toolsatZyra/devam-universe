import { describe, expect, it } from "vitest";
import { resolveBengalDurgaPujaProcedure } from "./bengal-durga-puja";

describe("Bengal Durga Puja participation", () => {
  it("serves only the exact Bengal Shakta pair with 10/30/75-minute forms", () => {
    const guide = resolveBengalDurgaPujaProcedure({ observanceSlug: "bengal-durga-puja-campaign", languageCode: "en", regionCode: "bengal", traditionCode: "shakta-bengal" });
    expect(guide?.evidence.packFileSha256).toBe("78b96891f2197405086ac3c3a1b50e68a6fbb83c129794a6ae0c8fc13b0ab396");
    expect(guide?.tiers.map((tier) => tier.estimatedMinutes)).toEqual([10, 30, 75]);
    expect(resolveBengalDurgaPujaProcedure({ observanceSlug: "bengal-durga-puja-campaign", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" })).toBeNull();
  });
  it("keeps institutional rites, children, harm, immersion, and outcome claims out of generic guidance", () => {
    const guide = resolveBengalDurgaPujaProcedure({ observanceSlug: "bengal-durga-puja-campaign", languageCode: "hi", regionCode: "bengal", traditionCode: "shakta-bengal" });
    expect(guide?.familyPracticeNote).toContain("बेलूर मठ");
    expect(guide?.boundaries).toMatchObject({ sixDayCampaignParticipationAndSourceLabelledDurgaRemembranceSupported: true, bodhanAdhivasNavapatrikaPranapratisthaShodashopacharaAnjaliBhogOrFormalPujaPrescribed: false, kumariPujaOrUseOfAChildAsRitualSubjectPrescribed: false, animalOrSymbolicBaliHomaOrHarmInstructed: false, immersionProcessionWaterEntryOrEnvironmentalOperationInstructed: false, belurMathSequenceUniversalized: false, victoryProtectionMeritProsperityOrOtherOutcomeGuaranteed: false });
  });
});

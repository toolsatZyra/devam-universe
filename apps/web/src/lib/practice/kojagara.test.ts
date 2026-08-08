import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { sourceVaultIt } from "../../test/source-vault";
import { resolveKojagaraProcedure } from "./kojagara";

describe("Kojagara / Sharad Purnima reflection", () => {
  it("serves only exact North/West Smarta pairs", () => {
    const guide = resolveKojagaraProcedure({ observanceSlug: "kojagara-puja-sharad-purnima", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" });
    expect(guide?.evidence.packFileSha256).toBe("f199e5d116d3931db9453a56c16b093e35651e6a88dabc9eaefe2d35542f2719");
    expect(guide?.tiers.map((tier) => tier.estimatedMinutes)).toEqual([10, 30, 60]);
    expect(resolveKojagaraProcedure({ observanceSlug: "kojagara-puja-sharad-purnima", languageCode: "en", regionCode: "bengal", traditionCode: "shakta-bengal" })).toBeNull();
  });
  it("keeps food optional and rejects vigil, medicine, gambling, formal puja, and outcomes", () => {
    const guide = resolveKojagaraProcedure({ observanceSlug: "kojagara-puja-sharad-purnima", languageCode: "hi", regionCode: "west-india", traditionCode: "smarta-west-india" });
    expect(guide?.familyPracticeNote).toContain("बंगाली कोजागरी लक्ष्मी पूजा");
    expect(guide?.boundaries).toMatchObject({ foodIfFamilyEstablishedTreatedAsOptionalAndNotMedicine: true, fastFoodDietaryOrMedicalGuidanceGiven: false, formalLakshmiPujaAratiDeepdaanOfferingOrMoonWorshipPrescribed: false, nightVigilRequired: false, medicinalCurativeOrHealthBenefitFromMoonlightOrFoodClaimed: false, gamblingDiceCardsOrBettingRecommended: false, wealthProsperityHealthProtectionMeritOrOtherOutcomeGuaranteed: false, bengalKojagariLakshmiPujaMerged: false, nextDayAshwinaPurnimaCalendarLaneMerged: false });
  });
  sourceVaultIt("rehashes the retained historical carrier", () => {
    const source = readFileSync(resolve(process.cwd(), "../..", "source_vault/objects/sha256/a6/a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b"));
    expect(source).toHaveLength(93531683);
    expect(createHash("sha256").update(source).digest("hex")).toBe("a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b");
  });
});

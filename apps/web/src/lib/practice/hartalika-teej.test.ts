import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { sourceVaultIt } from "../../test/source-vault";
import { resolveHartalikaTeejProcedure } from "./hartalika-teej";

describe("Hartalika Teej practice pack", () => {
  it("serves exact North and West Smarta pairs in Hindi and English", () => {
    const north = resolveHartalikaTeejProcedure({ observanceSlug: "hartalika-teej", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" });
    const west = resolveHartalikaTeejProcedure({ observanceSlug: "hartalika-teej", languageCode: "hi", regionCode: "west-india", traditionCode: "smarta-west-india" });
    expect(north?.evidence.packFileSha256).toBe("aa87e99b554761ee2034154ea9f8e6204163134642fe0a97a86412d4592becc1");
    expect(north?.tiers.map((tier) => tier.estimatedMinutes)).toEqual([10, 30, 60]);
    expect(west?.title).toContain("हरतालिका");
    expect(resolveHartalikaTeejProcedure({ observanceSlug: "hartalika-teej", languageCode: "en", regionCode: "south-india", traditionCode: "smarta-south-india" })).toBeNull();
  });

  it("keeps fast, formal puja, eligibility, materials, Gowri Habba, and outcome claims closed", () => {
    const guide = resolveHartalikaTeejProcedure({ observanceSlug: "hartalika-teej", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" });
    expect(guide?.boundaries).toMatchObject({ materialFreeAndNonFastingFormSupported: true, fastOrNirjalaRegimenPrescribed: false, foodDietaryOrMedicalGuidanceGiven: false, formalSankalpaKathaPujaMantraOfferingOrClosePrescribed: false, womenOnlyOrMarriedHouseholdOnlyParticipationUniversalized: false, clothingJewelleryMehendiSwingGiftSweetFlowerOrPurchaseRequired: false, marriageSpouseLongevityProgenyFamilyProsperityOrOtherOutcomeGuaranteed: false, gowriHabbaOrOtherTeejFestivalsMerged: false });
  });

  sourceVaultIt("rehashes the retained historical carrier without copying it", () => {
    const source = readFileSync(resolve(process.cwd(), "../..", "source_vault/objects/sha256/a6/a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b"));
    expect(source).toHaveLength(93531683);
    expect(createHash("sha256").update(source).digest("hex")).toBe("a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b");
  });
});

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { sourceVaultIt } from "../../test/source-vault";
import { resolveMasikaShivaratriProcedure } from "./masika-shivaratri";

describe("Masika Shivaratri recurring devotional companion", () => {
  const slugs = ["masika-shivaratri-2026-09", "masika-shivaratri-2026-10", "masika-shivaratri-2026-11", "masika-shivaratri-2026-12"];
  it("serves four months only in exact North and West Smarta pairs", () => {
    for (const observanceSlug of slugs) for (const [regionCode, traditionCode] of [["north-india", "smarta-north-india"], ["west-india", "smarta-west-india"]] as const) {
      const guide = resolveMasikaShivaratriProcedure({ observanceSlug, languageCode: "en", regionCode, traditionCode });
      expect(guide?.companionToObservanceSlug).toBe(observanceSlug);
      expect(guide?.tiers.map((tier) => [tier.tier, tier.estimatedMinutes])).toEqual([["minimum", 10], ["standard", 30], ["elaborate", 60]]);
      expect(guide?.evidence.packFileSha256).toBe("e80bcba5a71b9df57e3cda56e2889c979fe1a221036811c32fe98957507bdca6");
    }
    expect(resolveMasikaShivaratriProcedure({ observanceSlug: slugs[0], languageCode: "en", regionCode: "south-india", traditionCode: "smarta-south-india" })).toBeNull();
  });
  it("keeps every fasting, material, formal, vigil, parana, annual-merge, and outcome boundary closed", () => {
    const guide = resolveMasikaShivaratriProcedure({ observanceSlug: slugs[0], languageCode: "hi", regionCode: "north-india", traditionCode: "smarta-north-india" });
    expect(guide?.title).toContain("मासिक शिवरात्रि");
    expect(guide?.boundaries).toMatchObject({ materialFlameAndNonFastingFormSupported: true, fastOrNirjalaRegimenPrescribed: false, foodOrDietaryRulesGiven: false, medicalGuidanceGiven: false, abhishekaIngredientsOrHomeLingamProcedurePrescribed: false, formalMantraCountAartiOrPriestlySequenceIncluded: false, nightVigilRequired: false, paranaServed: false, annualMahashivaratriPracticeUniversalizedMonthly: false, peacePurificationProtectionMeritMarriageProsperityOrOtherOutcomeGuaranteed: false });
  });
  sourceVaultIt("rehashes the fixed historical source only in the test lane", () => {
    const source = readFileSync(resolve(process.cwd(), "../..", "source_vault/objects/sha256/a6/a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b"));
    expect(source.length).toBe(93531683);
    expect(createHash("sha256").update(source).digest("hex")).toBe("a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b");
  });
});

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { sourceVaultIt } from "../../test/source-vault";
import { resolveMasikaDurgashtamiProcedure } from "./masika-durgashtami";

describe("Masika Durgashtami recurring companion", () => {
  const slugs = ["masika-durgashtami-2026-09", "masika-durgashtami-2026-10", "masika-durgashtami-2026-11", "masika-durgashtami-2026-12"];
  it("serves every launch-month lane only for exact North and West Smarta pairs", () => {
    for (const observanceSlug of slugs) for (const [regionCode, traditionCode] of [["north-india", "smarta-north-india"], ["west-india", "smarta-west-india"]] as const) {
      const guide = resolveMasikaDurgashtamiProcedure({ observanceSlug, languageCode: "en", regionCode, traditionCode });
      expect(guide?.companionToObservanceSlug).toBe(observanceSlug);
      expect(guide?.tiers.map((tier) => [tier.tier, tier.estimatedMinutes])).toEqual([["minimum", 10], ["standard", 30], ["elaborate", 60]]);
      expect(guide?.evidence.packFileSha256).toBe("323c481459207eeb9e1937d8f69618ab891a4f2c2a602be4fd51ff9721e744fd");
    }
    expect(resolveMasikaDurgashtamiProcedure({ observanceSlug: slugs[1], languageCode: "en", regionCode: "bengal", traditionCode: "shakta-bengal" })).toBeNull();
  });
  it("keeps monthly remembrance separate from formal worship and the two larger Durga lanes", () => {
    const guide = resolveMasikaDurgashtamiProcedure({ observanceSlug: slugs[2], languageCode: "hi", regionCode: "north-india", traditionCode: "smarta-north-india" });
    expect(guide?.title).toContain("मासिक दुर्गाष्टमी");
    expect(guide?.boundaries).toMatchObject({ fourMonthCalendarLaneAndSourceLabelledDurgaRemembranceSupported: true, materialFreeAndNonFastingFormSupported: true, fastFoodDietaryOrMedicalGuidanceGiven: false, formalPujaMantraImageOfferingAartiChandiRecitationOrHomaPrescribed: false, kumariPujaBaliOrHarmInstructed: false, shardiyaMahashtamiEquatedWithEveryMonthlyAshtami: false, bengalDurgaPujaOrOtherRegionalAshtamiImported: false, victoryProtectionMeritProsperityOrOtherOutcomeGuaranteed: false, oneDeviStoryTheologyOrPracticeClaimedUniversal: false });
  });
  sourceVaultIt("rehashes the exact calendar fixture and fixed historical carrier", () => {
    const root = resolve(process.cwd(), "../..");
    const fixture = readFileSync(resolve(root, "knowledge_packs/panchang/masika-durgashtami-delhi-september-december-2026-v1.json"));
    const source = readFileSync(resolve(root, "source_vault/objects/sha256/a6/a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b"));
    expect(createHash("sha256").update(fixture).digest("hex")).toBe("68130406f9cff8b5f2c12cff08b5b75d8d06cdef02e2d35653f34f2dbf8edcae");
    expect(createHash("sha256").update(source).digest("hex")).toBe("a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b");
  });
});

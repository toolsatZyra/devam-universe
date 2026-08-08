import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { sourceVaultIt } from "../../test/source-vault";
import { resolveEkadashiProcedure } from "./ekadashi";

describe("recurring Ekadashi devotional companion", () => {
  const slugs = ["aja-ekadashi", "parsva-ekadashi", "indira-ekadashi", "papankusha-ekadashi", "rama-ekadashi", "devutthana-ekadashi", "utpanna-ekadashi"];
  it("serves all seven uncovered launch-interval observances in each exact supported lane", () => {
    const pairs = [["north-india", "smarta-north-india"], ["west-india", "smarta-west-india"], ["south-india", "smarta-south-india"], ["iskcon-india", "vaishnava-iskcon"]] as const;
    for (const observanceSlug of slugs) for (const [regionCode, traditionCode] of pairs) {
      const guide = resolveEkadashiProcedure({ observanceSlug, languageCode: "en", regionCode, traditionCode });
      expect(guide?.companionToObservanceSlug).toBe(observanceSlug);
      expect(guide?.tiers.map((tier) => [tier.tier, tier.estimatedMinutes])).toEqual([["minimum", 10], ["standard", 30], ["elaborate", 60]]);
      expect(guide?.evidence.packFileSha256).toBe("b8d38f8b85277c700df4da480633cbdcf3c86ae6d022babd8daa3facb6d38201");
    }
  });
  it("keeps fasting, food, health, parana, universal practice, outcome, and Mokshada boundaries closed", () => {
    const guide = resolveEkadashiProcedure({ observanceSlug: slugs[0], languageCode: "hi", regionCode: "north-india", traditionCode: "smarta-north-india" });
    expect(guide?.title).toContain("एकादशी");
    expect(guide?.boundaries).toMatchObject({ smartaAndIskconCalendarLanesKeptSeparate: true, materialFreeAndNonFastingFormSupported: true, fastOrNirjalaRegimenPrescribed: false, foodOrDietaryRulesGiven: false, medicalGuidanceGiven: false, smartaParanaServed: false, iskconParanaRepeatedByPracticeGuide: false, smartaAndVaishnavaPracticesEquated: false, namedEkadashiMeaningsStoriesOrOutcomesUniversalized: false, sinRemovalMeritLiberationHealthProsperityOrOtherOutcomeGuaranteed: false, mokshadaGitaJayantiGuideMergedOrReplaced: false });
    expect(resolveEkadashiProcedure({ observanceSlug: "mokshada-ekadashi", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" })).toBeNull();
    expect(resolveEkadashiProcedure({ observanceSlug: slugs[0], languageCode: "en", regionCode: "north-india", traditionCode: "vaishnava-iskcon" })).toBeNull();
  });
  sourceVaultIt("rehashes the fixed calendar fixture and historical carrier in the test lane", () => {
    const root = resolve(process.cwd(), "../..");
    expect(createHash("sha256").update(readFileSync(resolve(root, "knowledge_packs/panchang/ekadashi-delhi-mumbai-chennai-september-december-2026-v1.json"))).digest("hex")).toBe("6c860d6f2d778739c4a25b4b281b03a16975e8d43021baee24c55b1e1b72433d");
    const source = readFileSync(resolve(root, "source_vault/objects/sha256/a6/a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b"));
    expect(source.length).toBe(93531683);
    expect(createHash("sha256").update(source).digest("hex")).toBe("a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b");
  });
});

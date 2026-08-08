import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { sourceVaultIt } from "../../test/source-vault";
import { resolveLunarCalendarDayProcedure } from "./lunar-calendar-day";

describe("generic Purnima and Amavasya calendar-day companions", () => {
  const slugs = ["bhadrapada-purnima", "ashwina-purnima", "kartika-purnima", "bhadrapada-amavasya", "ashwina-amavasya", "kartika-amavasya", "margashirsha-amavasya"];
  it("serves all seven resolved calendar-day rules and keeps the two guide kinds distinct", () => {
    for (const observanceSlug of slugs) {
      const guide = resolveLunarCalendarDayProcedure({ observanceSlug, languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" });
      expect(guide?.companionToObservanceSlug).toBe(observanceSlug);
      expect(guide?.title).toContain(observanceSlug.includes("purnima") ? "Purnima" : "Amavasya");
      expect(guide?.evidence.packFileSha256).toBe("dc4cf0acfb4d49c901ae023cd9ae05e6ba6b9e2b3b09839049cda75fb0ea27d2");
    }
  });
  it("excludes unresolved Margashirsha Purnima and every special-practice overreach", () => {
    expect(resolveLunarCalendarDayProcedure({ observanceSlug: "margashirsha-purnima", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" })).toBeNull();
    const guide = resolveLunarCalendarDayProcedure({ observanceSlug: "ashwina-amavasya", languageCode: "hi", regionCode: "west-india", traditionCode: "smarta-west-india" });
    expect(guide?.boundaries).toMatchObject({ coincidentSpecialObservancesRemainSeparate: true, fastOrNirjalaRegimenPrescribed: false, shraddhaTarpanDarshaOrAncestorRitePrescribed: false, ritualBathingMoonWorshipOfferingMantraOrTempleProcedurePrescribed: false, kojagaraDevDeepawaliDiwaliOrOtherSpecialFestivalMerged: false, margashirshaPurnimaPromoted: false, purificationProtectionMeritAncestorBenefitProsperityOrOtherOutcomeGuaranteed: false });
  });
  sourceVaultIt("rehashes the fixed historical source only in the test lane", () => {
    const source = readFileSync(resolve(process.cwd(), "../..", "source_vault/objects/sha256/a6/a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b"));
    expect(source.length).toBe(93531683);
    expect(createHash("sha256").update(source).digest("hex")).toBe("a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b");
  });
});

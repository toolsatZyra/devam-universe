import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { resolveChhathProcedure } from "./chhath";

const supported = { observanceSlug: "chhath-puja-sandhya-arghya", languageCode: "en", regionCode: "bihar-purvanchal", traditionCode: "surya-chhath-bihar-purvanchal" } as const;

describe("Chhath family participation practice pack", () => {
  it("returns three honest participation levels without equating a newcomer form to the full vrata", () => {
    const guide = resolveChhathProcedure(supported);
    expect(guide?.tiers.map((tier) => [tier.tier, tier.estimatedMinutes])).toEqual([["minimum", 20], ["standard", 45], ["elaborate", 90]]);
    expect(guide?.tiers[0].steps[0].instruction).toContain("Do not independently begin a fast");
    expect(guide?.tiers[1].steps.map((step) => step.instruction)).toEqual(expect.arrayContaining([
      expect.stringContaining("Nahay Khay"),
      expect.stringContaining("Kharna"),
      expect.stringContaining("Sandhya Arghya"),
      expect.stringContaining("Usha Arghya"),
    ]));
    expect(guide?.boundaries).toMatchObject({ fastingOrNirjalaRegimenPrescribed: false, medicalSuitabilityClaimed: false, directSunGazingInstructed: false, unsafeWaterEntryInstructed: false, newcomerMinimumFormClaimedEquivalentToFullVrata: false });
  });

  it("returns the separately authored Hindi guide and exact official evidence set", () => {
    const guide = resolveChhathProcedure({ ...supported, languageCode: "hi" });
    expect(guide?.title).toBe("परिवार के साथ छठ");
    expect(guide?.summary).toContain("निर्जला व्रत");
    expect(guide?.evidence.sources.map((source) => source.sourceId)).toEqual(["bihar-tourism-chhath-en", "bihar-tourism-chhath-hi", "president-of-india-chhath-2025", "devam-chhath-date-fixture"]);
    expect(guide?.evidence.sourceTextReturnedByApi).toBe(false);
  });

  it("fails closed outside the exact region and tradition and rehashes the pack", () => {
    expect(resolveChhathProcedure({ ...supported, regionCode: "north-india" })).toBeNull();
    expect(resolveChhathProcedure({ ...supported, traditionCode: "smarta-north-india" })).toBeNull();
    const path = resolve(process.cwd(), "../..", "knowledge_packs/rituals/chhath-bihar-purvanchal-v1.json");
    expect(createHash("sha256").update(readFileSync(path)).digest("hex")).toBe("f3b084e79a31ea1b503953d120555b52c35ce400add5f9a4777d6fefdb43dc82");
  });
});

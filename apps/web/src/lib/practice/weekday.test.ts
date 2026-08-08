import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { resolveWeekdayProcedure, weekdayPracticeSlug } from "./weekday";

const context = { languageCode: "en", regionCode: "west-india", traditionCode: "smarta-west-india" } as const;

describe("weekday practice pack", () => {
  it("maps the exact astronomical vara identity to all seven practice keys", () => {
    const names = ["Ravivara", "Somavara", "Mangalavara", "Budhavara", "Guruvara", "Shukravara", "Shanivara"];
    expect(names.map((name, index) => weekdayPracticeSlug({ index: index + 1, name }))).toEqual([
      "weekday-ravivara", "weekday-somavara", "weekday-mangalavara", "weekday-budhavara", "weekday-guruvara", "weekday-shukravara", "weekday-shanivara",
    ]);
    expect(weekdayPracticeSlug({ index: 2, name: "Ravivara" })).toBeNull();
  });

  it("returns a compact three-tier Tuesday guide with explicit regional alternatives", () => {
    const guide = resolveWeekdayProcedure({ ...context, observanceSlug: "weekday-mangalavara" });
    expect(guide?.tiers.map((tier) => [tier.tier, tier.estimatedMinutes])).toEqual([
      ["minimum", 5], ["standard", 15], ["elaborate", 30],
    ]);
    expect(guide?.tiers[0].steps[0].instruction).toContain("Ganapati or Gauri");
    expect(guide?.tiers[0].steps[0].instruction).toContain("Hanuman");
    expect(guide?.evidence.sources).toHaveLength(4);
    expect(guide?.boundaries).toMatchObject({
      allSevenVarasIncluded: true,
      fastingOrMedicalRegimenPrescribed: false,
      astrologicalRemediesPrescribed: false,
      oneUniversalWeekdayMappingClaimed: false,
      allRegionalVariantsComplete: false,
    });
  });

  it("returns separately rendered Hindi and keeps direct-sun and formal-mantra denials", () => {
    const guide = resolveWeekdayProcedure({ ...context, observanceSlug: "weekday-ravivara", languageCode: "hi" });
    expect(guide?.title).toContain("रविवार");
    expect(guide?.familyPracticeNote).toContain("सूर्य को सीधे न देखें");
    expect(guide?.boundaries).toMatchObject({ directSunGazingSuggested: false, formalPriestMantrasIncluded: false });
    expect(JSON.stringify(guide)).not.toMatch(/\{(?:display|focus|reflection|safety)\}/);
  });

  it("fails closed outside the exact West India Smarta pairing and rehashes the pack", () => {
    expect(resolveWeekdayProcedure({ ...context, observanceSlug: "weekday-somavara", regionCode: "north-india" })).toBeNull();
    expect(resolveWeekdayProcedure({ ...context, observanceSlug: "weekday-somavara", traditionCode: "smarta-north-india" })).toBeNull();
    const guide = resolveWeekdayProcedure({ ...context, observanceSlug: "weekday-somavara" });
    const path = resolve(process.cwd(), "../..", "knowledge_packs/rituals/weekday-practice-west-india-v1.json");
    expect(createHash("sha256").update(readFileSync(path)).digest("hex")).toBe(guide?.evidence.packFileSha256);
  });
});

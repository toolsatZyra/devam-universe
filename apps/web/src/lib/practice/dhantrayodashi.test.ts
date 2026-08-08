import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { resolveDhantrayodashiProcedure } from "./dhantrayodashi";

const supported = { observanceSlug: "dhantrayodashi", languageCode: "en", regionCode: "west-india", traditionCode: "smarta-west-india" } as const;

describe("Dhantrayodashi household practice pack", () => {
  it("returns three actionable forms without requiring shopping or merging Yama Deepam", () => {
    const guide = resolveDhantrayodashiProcedure(supported);
    expect(guide?.tiers.map((tier) => [tier.tier, tier.estimatedMinutes])).toEqual([["minimum", 10], ["standard", 30], ["elaborate", 60]]);
    expect(guide?.tiers[0].steps[3].instruction).toContain("care for health responsibly");
    expect(guide?.boundaries).toMatchObject({ shoppingOrPurchaseRequired: false, fastingOrMedicalRegimenPrescribed: false, guaranteedWealthOrHealthOutcomeClaimed: false, yamaDeepamMergedOrCompleted: false, preciseMuhurtaCalculated: false });
  });

  it("supports the exact North pairing and separately authored Hindi guide", () => {
    const guide = resolveDhantrayodashiProcedure({ ...supported, regionCode: "north-india", traditionCode: "smarta-north-india", languageCode: "hi" });
    expect(guide?.title).toBe("घर में धनत्रयोदशी");
    expect(guide?.summary).toContain("खरीदना");
    expect(guide?.familyPracticeNote).toContain("यम दीपम अलग");
  });

  it("fails closed for crossed contexts and rehashes both compact artifacts", () => {
    expect(resolveDhantrayodashiProcedure({ ...supported, regionCode: "north-india" })).toBeNull();
    expect(resolveDhantrayodashiProcedure({ ...supported, traditionCode: "smarta-north-india" })).toBeNull();
    const packPath = resolve(process.cwd(), "../..", "knowledge_packs/rituals/dhantrayodashi-north-west-india-v1.json");
    const datePath = resolve(process.cwd(), "../..", "knowledge_packs/panchang/dhantrayodashi-delhi-2026-v1.json");
    expect(createHash("sha256").update(readFileSync(packPath)).digest("hex")).toBe("b795c9302c3d809266974d0e9a8ed30f5e4e2b6542aceb3acd3d1a39d4e3bee0");
    expect(createHash("sha256").update(readFileSync(datePath)).digest("hex")).toBe("c88547ab6e858c28ed6b60f209ff26ca1194d1e6820e3c5c6fce958b72d7347a");
  });
});

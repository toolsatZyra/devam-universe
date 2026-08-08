import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { resolveYamaDeepamProcedure } from "./yama-deepam";

const supported = { observanceSlug: "yama-deepam", languageCode: "en", regionCode: "west-india", traditionCode: "smarta-west-india" } as const;

describe("Yama Deepam household practice pack", () => {
  it("returns three safe forms without inventing direction, count, outcomes, or Dhantrayodashi completion", () => {
    const guide = resolveYamaDeepamProcedure(supported);
    expect(guide?.tiers.map((tier) => [tier.tier, tier.estimatedMinutes])).toEqual([["minimum", 8], ["standard", 15], ["elaborate", 30]]);
    expect(guide?.tiers[0].steps[1].instruction).toContain("safe exterior place");
    expect(guide?.boundaries).toMatchObject({ outsideHomeEveningLightSupported: true, southFacingDirectionRequired: false, fixedLampCountRequired: false, lampLeftUnattendedOrBurningOvernight: false, guaranteedProtectionOrLongevityOutcomeClaimed: false, dhantrayodashiMergedOrCompleted: false });
  });

  it("supports the exact North pairing and a separately authored Hindi guide", () => {
    const guide = resolveYamaDeepamProcedure({ ...supported, regionCode: "north-india", traditionCode: "smarta-north-india", languageCode: "hi" });
    expect(guide?.title).toBe("घर में यम दीपम");
    expect(guide?.summary).toContain("सुरक्षा की गारंटी नहीं");
    expect(guide?.familyPracticeNote).toContain("रातभर");
  });

  it("fails closed for crossed contexts and rehashes both compact artifacts", () => {
    expect(resolveYamaDeepamProcedure({ ...supported, regionCode: "north-india" })).toBeNull();
    expect(resolveYamaDeepamProcedure({ ...supported, traditionCode: "smarta-north-india" })).toBeNull();
    const packPath = resolve(process.cwd(), "../..", "knowledge_packs/rituals/yama-deepam-north-west-india-v1.json");
    const fixturePath = resolve(process.cwd(), "../..", "knowledge_packs/panchang/yama-deepam-delhi-2026-v1.json");
    expect(createHash("sha256").update(readFileSync(packPath)).digest("hex")).toBe("4d3faa7381ff82db20e95bf0c927e2661d196bbad39b7e3a2a6bf9643a220ed9");
    expect(createHash("sha256").update(readFileSync(fixturePath)).digest("hex")).toBe("3264642732a7415def579db19fb62144ca1a262e523077b90eed5f4bd865af96");
  });
});

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { resolveBengalKaliPujaProcedure } from "./bengal-kali-puja";

describe("Bengal Kali Puja participation guidance", () => {
  const request = { observanceSlug: "bengal-kali-puja", languageCode: "en", regionCode: "bengal", traditionCode: "shakta-bengal" } as const;

  it("offers bounded 10/30/90-minute participation without manufacturing specialist ritual", () => {
    const guide = resolveBengalKaliPujaProcedure(request);
    expect(guide?.tiers.map((tier) => [tier.tier, tier.estimatedMinutes])).toEqual([["minimum", 10], ["standard", 30], ["elaborate", 90]]);
    expect(guide?.boundaries).toMatchObject({
      homeTempleAndPublicParticipationSupported: true,
      formalPriestMantrasIncluded: false,
      tantricOrInitiatoryInstructionIncluded: false,
      baliInstructionIncluded: false,
      fastingOrAllNightVigilPrescribed: false,
      lakshmiPujaMergedOrCompleted: false,
      oneUniversalProcedureClaimed: false,
    });
    expect(JSON.stringify(guide)).toContain("recognised priest");
    expect(JSON.stringify(guide)).not.toContain("guaranteed");
  });

  it("returns Hindi and fails closed for crossed regional or tradition contexts", () => {
    expect(resolveBengalKaliPujaProcedure({ ...request, languageCode: "hi" })?.title).toContain("काली पूजा");
    expect(resolveBengalKaliPujaProcedure({ ...request, regionCode: "north-india" })).toBeNull();
    expect(resolveBengalKaliPujaProcedure({ ...request, traditionCode: "smarta-north-india" })).toBeNull();
    expect(resolveBengalKaliPujaProcedure({ ...request, observanceSlug: "diwali-lakshmi-puja" })).toBeNull();
  });

  it("binds the authored pack and Kolkata date fixture by exact bytes", () => {
    const root = resolve(process.cwd(), "../..");
    const hash = (path: string) => createHash("sha256").update(readFileSync(resolve(root, path))).digest("hex");
    expect(hash("knowledge_packs/rituals/bengal-kali-puja-participation-v1.json")).toBe("77520232ca50f335ae7eae075ae84c2cbf20dc7eb825dd73430768e82badd460");
    expect(hash("knowledge_packs/panchang/kali-puja-kolkata-2026-v1.json")).toBe("faa675ee7ece5ed1513f75b49fef6db2ab0f9b0ea324f58a40990864c46c165c");
  });
});

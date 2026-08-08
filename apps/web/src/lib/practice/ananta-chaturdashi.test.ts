import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { resolveAnantaChaturdashiProcedure } from "./ananta-chaturdashi";

describe("Ananta Chaturdashi remembrance", () => {
  it("serves only exact North/West Smarta pairs with 10/30/60 forms", () => {
    const guide = resolveAnantaChaturdashiProcedure({ observanceSlug: "ananta-chaturdashi", languageCode: "en", regionCode: "west-india", traditionCode: "smarta-west-india" });
    expect(guide?.evidence.packFileSha256).toBe("84627e57e6cac73a8825afd7cbf972a101e24f9476749a42901300f059b7cc47");
    expect(guide?.tiers.map((tier) => tier.estimatedMinutes)).toEqual([10, 30, 60]);
    expect(resolveAnantaChaturdashiProcedure({ observanceSlug: "ananta-chaturdashi", languageCode: "en", regionCode: "bengal", traditionCode: "shakta-bengal" })).toBeNull();
  });
  it("keeps Ananta remembrance separate from Ganesh Visarjan and formal vrata details", () => {
    const guide = resolveAnantaChaturdashiProcedure({ observanceSlug: "ananta-chaturdashi", languageCode: "hi", regionCode: "north-india", traditionCode: "smarta-north-india" });
    expect(guide?.familyPracticeNote).toContain("गणेश विसर्जन");
    expect(guide?.boundaries).toMatchObject({ anantaVrataAndGaneshVisarjanKeptSeparate: true, priorAndFreshProviderHashesWithSemanticDeltaRetained: true, formalAnantaPujaKalashaSerpentImageMantraOfferingOrHomaPrescribed: false, fourteenKnotThreadTyingRemovalOrRetentionPrescribed: false, ganeshImmersionImportedIntoAnantaGuide: false, wealthProsperityRecoveryLostKingdomMeritProtectionOrOtherOutcomeGuaranteed: false });
  });
  it("rehashes the retained historical rule carrier", () => {
    const source = readFileSync(resolve(process.cwd(), "../..", "source_vault/objects/sha256/a6/a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b"));
    expect(source).toHaveLength(93531683);
    expect(createHash("sha256").update(source).digest("hex")).toBe("a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b");
  });
});

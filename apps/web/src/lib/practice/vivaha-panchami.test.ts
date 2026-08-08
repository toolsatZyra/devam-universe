import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { resolveVivahaPanchamiProcedure } from "./vivaha-panchami";

describe("Vivaha Panchami remembrance", () => {
  it("serves only the exact North India Smarta pair with 10/30/60 forms", () => {
    const guide = resolveVivahaPanchamiProcedure({ observanceSlug: "vivaha-panchami", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" });
    expect(guide?.evidence.packFileSha256).toBe("938384b6ddc596245047c420810f1db2428cd64cdd40ee02a7434505371e8f5d");
    expect(guide?.tiers.map((tier) => tier.estimatedMinutes)).toEqual([10, 30, 60]);
    expect(resolveVivahaPanchamiProcedure({ observanceSlug: "vivaha-panchami", languageCode: "en", regionCode: "west-india", traditionCode: "smarta-west-india" })).toBeNull();
  });

  it("keeps public festival contexts, Ramayana variants, formal rites, and outcome promises bounded", () => {
    const guide = resolveVivahaPanchamiProcedure({ observanceSlug: "vivaha-panchami", languageCode: "hi", regionCode: "north-india", traditionCode: "smarta-north-india" });
    expect(guide?.familyPracticeNote).toContain("जनकपुर, अयोध्या और ओरछा");
    expect(guide?.boundaries).toMatchObject({ janakpurAyodhyaAndOrchhaContextsKeptDistinct: true, formalWeddingReenactmentPujaMantraOfferingProcessionOrVowPrescribed: false, marriageSpouseFertilityProgenyProsperityMeritOrOtherOutcomeGuaranteed: false, oneRamayanaEditionStoryInterpretationOrPracticeClaimedUniversal: false, publicEventOperationsOrTravelSafetyClaimedCurrent: false });
  });

  it("rehashes the bounded calendar dependency", () => {
    const bytes = readFileSync(resolve(process.cwd(), "../..", "knowledge_packs/panchang/vivaha-panchami-delhi-2026-v1.json"));
    expect(createHash("sha256").update(bytes).digest("hex")).toBe("5ac334e9efa8fe548b572ef6ce5d4d982206cc774a4a2672735c75b665a7770c");
  });
});

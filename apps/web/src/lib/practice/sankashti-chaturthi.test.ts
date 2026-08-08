import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { resolveSankashtiChaturthiProcedure } from "./sankashti-chaturthi";

describe("Sankashti Chaturthi West India recurring guidance", () => {
  const slugs = ["sankashti-chaturthi-2026-09", "sankashti-chaturthi-2026-10", "sankashti-chaturthi-2026-11", "sankashti-chaturthi-2026-12"];
  it("serves all four launch months with one source-bounded recurring guide", () => {
    for (const observanceSlug of slugs) {
      const guide = resolveSankashtiChaturthiProcedure({ observanceSlug, languageCode: "en", regionCode: "west-india", traditionCode: "smarta-west-india" });
      expect(guide?.companionToObservanceSlug).toBe(observanceSlug);
      expect(guide?.tiers.map((tier) => [tier.tier, tier.estimatedMinutes])).toEqual([["minimum", 10], ["standard", 30], ["elaborate", 60]]);
      expect(guide?.companionReading?.evidence.packFileSha256).toBe("492bafe94124f81de32acee6329b798fe09970eace160bdd1a9db646d5959d2d");
      expect(guide?.evidence.packFileSha256).toBe("19cf87fe0be455f0bc4f8fdc0028b6511c03bbc1df71b563bafe680a9e248b50");
    }
  });
  it("keeps every fasting, city-time, universal-procedure, merge, and outcome boundary closed", () => {
    const guide = resolveSankashtiChaturthiProcedure({ observanceSlug: slugs[0], languageCode: "hi", regionCode: "west-india", traditionCode: "smarta-west-india" });
    expect(guide?.title).toContain("संकष्टी चतुर्थी");
    expect(guide?.boundaries).toMatchObject({ runtimeLocationSpecificMoonriseUsed: true, fastOrNirjalaRegimenPrescribed: false, medicalOrDietaryAdviceGiven: false, providerCityMoonriseReusedForUserLocation: false, oneMonthlyNameKathaOrPujaSequenceUniversalized: false, moonSightingTempleVisitOfferingMantraArghyaOrFoodRequired: false, obstacleRemovalSuccessProtectionMeritOrOtherOutcomeGuaranteed: false, ganeshChaturthiOrKarwaChauthMerged: false });
    expect(resolveSankashtiChaturthiProcedure({ observanceSlug: slugs[0], languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" })).toBeNull();
  });
  it("rehashes the private historical carrier only in the test lane", () => {
    const source = readFileSync(resolve(process.cwd(), "../..", "source_vault/objects/sha256/a6/a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b"));
    expect(source.length).toBe(93531683);
    expect(createHash("sha256").update(source).digest("hex")).toBe("a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b");
  });
});

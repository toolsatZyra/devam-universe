import { describe, expect, it } from "vitest";
import { resolveTulasiVivahProcedure } from "./tulasi-vivah";

describe("Tulasi Vivah multi-lane practice pack", () => {
  it("returns the bounded general guide without plant harm, fasting, or outcome promises", () => {
    const guide = resolveTulasiVivahProcedure({ observanceSlug: "tulasi-vivah-dwadashi", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" });
    expect(guide).toMatchObject({ title: "Tulasi Vivah at home", evidence: { packFileSha256: "88dddb92d3bf9ab43ba40125e4475581faf408f1755d497df64e3810a58eacc8" }, boundaries: { generalAndBapsLanesSeparate: true, fastOrDietaryRegimenPrescribed: false, plantPluckingPruningIngestionOverwateringOrChemicalDecorationInstructed: false, outcomeGuaranteed: false } });
    expect(guide?.tiers.map((tier) => tier.estimatedMinutes)).toEqual([10, 30, 60]);
    expect(resolveTulasiVivahProcedure({ observanceSlug: "tulasi-vivah-dwadashi", languageCode: "en", regionCode: "baps-gujarat", traditionCode: "swaminarayan-baps" })).toBeNull();
  });

  it("keeps the BAPS beginning and close in one attributable institutional sequence", () => {
    for (const observanceSlug of ["tulsi-vivah-baps-begins", "tulsi-vivah-baps-samapt"]) {
      const guide = resolveTulasiVivahProcedure({ observanceSlug, languageCode: "hi", regionCode: "baps-gujarat", traditionCode: "swaminarayan-baps" });
      expect(guide?.title).toBe("BAPS तुलसी विवाह सहभागिता");
      expect(guide?.companionToObservanceSlug).toBe(observanceSlug);
    }
  });
});

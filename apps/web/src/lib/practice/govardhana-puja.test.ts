import { describe, expect, it } from "vitest";
import { resolveGovardhanaPujaProcedure } from "./govardhana-puja";

describe("Govardhana Puja ISKCON participation guidance", () => {
  const request = { observanceSlug: "govardhan-puja", languageCode: "en", regionCode: "iskcon-india", traditionCode: "vaishnava-iskcon" } as const;
  it("supports a simple offering while refusing scale, animal contact, fast, and pilgrimage overreach", () => {
    const guide = resolveGovardhanaPujaProcedure(request);
    expect(guide?.tiers.map((tier) => [tier.tier, tier.estimatedMinutes])).toEqual([["minimum", 10], ["standard", 30], ["elaborate", 90]]);
    expect(guide?.boundaries).toMatchObject({ prayerKirtanSimpleVegetarianOfferingSupported: true, goPujaOrCowContactInstructionIncluded: false, fastingPrescribed: false, longOrBarefootParikramaInstructed: false, largeFoodArrayRequired: false, baliPratipadaMerged: false, bapsNewYearSequenceMerged: false });
  });
  it("returns Hindi and fails closed outside the exact ISKCON route", () => {
    expect(resolveGovardhanaPujaProcedure({ ...request, languageCode: "hi" })?.title).toContain("गोवर्धन पूजा");
    expect(resolveGovardhanaPujaProcedure({ ...request, regionCode: "north-india" })).toBeNull();
    expect(resolveGovardhanaPujaProcedure({ ...request, traditionCode: "smarta-north-india" })).toBeNull();
  });
});

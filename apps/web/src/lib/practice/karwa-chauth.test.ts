import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { sourceVaultIt } from "../../test/source-vault";
import { resolveKarwaChauthProcedure } from "./karwa-chauth";

describe("Karwa Chauth North India guidance", () => {
  const request = { observanceSlug: "karwa-chauth", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" } as const;
  it("offers 10/30/60-minute family forms without prescribing fasting or outcomes", () => {
    const guide = resolveKarwaChauthProcedure(request);
    expect(guide?.tiers.map((tier) => [tier.tier, tier.estimatedMinutes])).toEqual([["minimum", 10], ["standard", 30], ["elaborate", 60]]);
    expect(guide?.evidence.packFileSha256).toBe("1ccecf2208f19190ae7481bc7cf6a4ad5da1ec23f42b75c2c0bc4db7b77db0e1");
    expect(guide?.boundaries).toMatchObject({ reciprocalAndWiderFamilyParticipationSupported: true, materialFreeAndFlameFreeFallbackSupported: true, punjabAndUttarPradeshVariantsRemainDistinct: true, fastOrNirjalaRegimenPrescribed: false, medicalOrDietaryAdviceGiven: false, womenOnlyParticipationUniversalized: false, marriedHouseholdOnlyParticipationRequired: false, formalSankalpaMantraKathaArghyaOrPujaSequenceIncluded: false, sargiBayaaThaliSieveArghyaOrSpouseFedCloseRequired: false, spouseLongevityHealthMarriageProtectionMeritOrSuccessGuaranteed: false });
  });
  it("returns Hindi and fails closed outside the exact North India practice lane", () => {
    expect(resolveKarwaChauthProcedure({ ...request, languageCode: "hi" })?.title).toContain("करवा चौथ");
    expect(resolveKarwaChauthProcedure({ ...request, regionCode: "west-india" })).toBeNull();
    expect(resolveKarwaChauthProcedure({ ...request, traditionCode: "smarta-west-india" })).toBeNull();
  });
  sourceVaultIt("rehashes the retained historical rule carrier without importing it into the runtime app", () => {
    const source = readFileSync(resolve(process.cwd(), "../..", "source_vault/objects/sha256/a6/a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b"));
    expect(source.length).toBe(93531683);
    expect(createHash("sha256").update(source).digest("hex")).toBe("a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b");
  });
});

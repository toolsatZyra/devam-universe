import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { sourceVaultIt } from "../../test/source-vault";
import { resolveRadhaAshtamiProcedure } from "./radha-ashtami";

describe("ISKCON Radha Ashtami participation", () => {
  it("serves only the exact ISKCON India pair", () => {
    const guide = resolveRadhaAshtamiProcedure({ observanceSlug: "radha-ashtami-iskcon", languageCode: "en", regionCode: "iskcon-india", traditionCode: "vaishnava-iskcon" });
    expect(guide?.evidence.packFileSha256).toBe("675aa135e9aefaecfd9ae9326d5c9594e4447c324110e30de0553e01c79b0542");
    expect(guide?.tiers.map((tier) => tier.estimatedMinutes)).toEqual([10, 30, 60]);
    expect(resolveRadhaAshtamiProcedure({ observanceSlug: "radha-ashtami-iskcon", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" })).toBeNull();
    expect(resolveRadhaAshtamiProcedure({ observanceSlug: "radha-ashtami", languageCode: "en", regionCode: "iskcon-india", traditionCode: "vaishnava-iskcon" })).toBeNull();
  });
  it("supports attributable remembrance and service without exporting temple rites or outcomes", () => {
    const guide = resolveRadhaAshtamiProcedure({ observanceSlug: "radha-ashtami-iskcon", languageCode: "hi", regionCode: "iskcon-india", traditionCode: "vaishnava-iskcon" });
    expect(guide?.familyPracticeNote).toContain("इस्कॉन");
    expect(guide?.boundaries).toMatchObject({ radharaniAppearanceAttributableTeachingSongPrayerKirtanAndSevaSupported: true, officialIskconTempleProgrammeParticipationSupported: true, materialFreeAndNonFastingHomeFormSupported: true, fastFoodDietaryOrMedicalGuidanceGiven: false, abhishekaAratiHomaDeityDressingOfferingKalashaFlowerOrFormalPujaPrescribed: false, bangaloreProgrammeTimeReusedForAnotherLocation: false, sponsorshipDonationPurchaseNewDressOrChappanBhogRequired: false, mercyPerfectionProgressProtectionMeritOrOtherOutcomeGuaranteed: false, allGaudiyaVaishnavaVaishnavaSmartaAndRegionalTraditionsEquated: false, allRadhaAshtamiTraditionsComplete: false });
  });
  sourceVaultIt("rehashes the retained historical carrier", () => {
    const source = readFileSync(resolve(process.cwd(), "../..", "source_vault/objects/sha256/a6/a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b"));
    expect(source).toHaveLength(93531683);
    expect(createHash("sha256").update(source).digest("hex")).toBe("a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b");
  });
});

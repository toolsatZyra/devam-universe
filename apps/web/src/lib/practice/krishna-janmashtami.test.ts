import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { resolveKrishnaJanmashtamiProcedure } from "./krishna-janmashtami";

describe("Krishna Janmashtami Smarta and ISKCON practice pack", () => {
  it("serves only the three exact attributable route pairs", () => {
    const north = resolveKrishnaJanmashtamiProcedure({ observanceSlug: "krishna-janmashtami-smarta", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" });
    const west = resolveKrishnaJanmashtamiProcedure({ observanceSlug: "krishna-janmashtami-smarta", languageCode: "en", regionCode: "west-india", traditionCode: "smarta-west-india" });
    const iskcon = resolveKrishnaJanmashtamiProcedure({ observanceSlug: "krishna-janmashtami-iskcon", languageCode: "hi", regionCode: "iskcon-india", traditionCode: "vaishnava-iskcon" });
    expect(north?.evidence.packFileSha256).toBe("0b7ce19875a7783b4f39a263d4e40952a7ae9c26c407db579652eb2835cf5793");
    expect(west?.companionToObservanceSlug).toBe("krishna-janmashtami-smarta");
    expect(iskcon?.familyPracticeNote).toContain("इस्कॉन");
    expect(iskcon?.tiers.map((tier) => tier.estimatedMinutes)).toEqual([10, 30, 60]);
    expect(resolveKrishnaJanmashtamiProcedure({ observanceSlug: "krishna-janmashtami-smarta", languageCode: "en", regionCode: "iskcon-india", traditionCode: "vaishnava-iskcon" })).toBeNull();
    expect(resolveKrishnaJanmashtamiProcedure({ observanceSlug: "krishna-janmashtami-iskcon", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" })).toBeNull();
  });

  it("keeps fasting, food, health, midnight, puja, Dahi Handi, parana, purchases, and outcomes outside the guide", () => {
    const guide = resolveKrishnaJanmashtamiProcedure({ observanceSlug: "krishna-janmashtami-smarta", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" });
    expect(guide?.boundaries).toMatchObject({ smartaAndIskconLaneNotesSeparate: true, sharedDevotionalCoreWithoutRuleEquivalence: true, fastOrNirjalaRegimenPrescribed: false, foodOrDietaryRulesGiven: false, medicalGuidanceGiven: false, midnightVigilOrExactMuhurtaRequired: false, abhishekaAartiOfferingCradleMurtiDressingOrFootprintsRequired: false, dahiHandiParticipationOrHumanPyramidInstructed: false, paranaOrNextDayCloseServed: false, purchaseDonationDecorationNewClothesOrSpecialFoodRequired: false, smartaAndIskconRulesEquated: false, blessingProtectionMeritProsperityOrOtherOutcomeGuaranteed: false });
  });

  it("rehashes the retained historical carrier without copying it into the app", () => {
    const root = resolve(process.cwd(), "../..");
    const source = readFileSync(resolve(root, "source_vault/objects/sha256/a6/a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b"));
    expect(source).toHaveLength(93531683);
    expect(createHash("sha256").update(source).digest("hex")).toBe("a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b");
  });
});

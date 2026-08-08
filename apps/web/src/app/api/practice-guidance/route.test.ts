import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { POST } from "./route";

function request(body: unknown) {
  return new Request("http://localhost/api/practice-guidance", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

const supported = {
  observanceSlug: "ganesh-chaturthi",
  languageCode: "en",
  regionCode: "west-india",
  traditionCode: "smarta-west-india",
} as const;

describe("POST /api/practice-guidance", () => {
  it("returns the bounded Bengal Vishwakarma workplace guide", async () => {
    const response = await POST(request({
      observanceSlug: "vishwakarma-puja-bengal",
      languageCode: "en",
      regionCode: "bengal",
      traditionCode: "regional-bengal",
    }));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result).toMatchObject({
      status: "ritual_procedure_available",
      guide: {
        companionToObservanceSlug: "vishwakarma-puja-bengal",
        evidence: {
          packId: "vishwakarma-puja-bengal-workplace-content-v1",
          packFileSha256: "1d57c055654685481e90f4e8dc190385adfa06486313f8a844bfcfd6840b4b39",
        },
      },
    });
    expect(result.guide.tiers.map((tier: { tier: string }) => tier.tier)).toEqual(["minimum", "standard", "elaborate"]);
    expect(result.guide.userCompleteContext.safetyAndBoundaries.join(" ")).toContain("Never touch");
  });

  it("returns the bounded Tula Sankranti personal lane without inventing a local punya kala", async () => {
    const response = await POST(request({
      observanceSlug: "tula-sankranti",
      languageCode: "en",
      regionCode: "general-india",
      traditionCode: "family-specific-hindu",
    }));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result).toMatchObject({
      status: "ritual_procedure_available",
      guide: {
        companionToObservanceSlug: "tula-sankranti",
        evidence: {
          packId: "sankranti-september-december-general-content-v1",
          packFileSha256: "7f76eaabbf5b5cf31f5bd5d612e4a08521a7adc46d6bf462e2b4c5f16640b9fa",
        },
        userCompleteContext: { timing: { liveScheduleRequired: true } },
      },
    });
    expect(result.guide.summary).toContain("17 October 2026");
    expect(result.guide.familyPracticeNote).toContain("Punya kala");
  });

  it("returns the bounded Sarva Pitru Amavasya remembrance and preparation lane", async () => {
    const response = await POST(request({
      observanceSlug: "sarva-pitru-amavasya",
      languageCode: "en",
      regionCode: "north-india",
      traditionCode: "smarta-north-india",
    }));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result).toMatchObject({
      status: "ritual_procedure_available",
      guide: {
        companionToObservanceSlug: "sarva-pitru-amavasya",
        evidence: {
          packId: "pitru-paksha-delhi-remembrance-content-v1",
          packFileSha256: "044c4ff8163a6203628425db1bdafc1d6b7b372a74882885fbb1efb987a032e0",
        },
        boundaries: {
          nineteenPitruPakshaCalendarLabelsSupported: true,
          formalShraddhaTarpanaPindaMantraFoodDonationOrTimingPrescribed: false,
          tamilMahalayaAmavasaiTharpanamMerged: false,
          pitruDoshaCurseLiberationProsperityOrAncestorSatisfactionGuaranteed: false,
        },
      },
    });
    expect(result.guide.familyPracticeNote).toContain("10 October 2026");
    expect(result.guide.tiers.map((tier: { tier: string }) => tier.tier)).toEqual(["minimum", "standard", "elaborate"]);
  });

  it("returns the user-complete English Ganesh Chaturthi lane with its exact companion reading", async () => {
    const response = await POST(request(supported));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.status).toBe("ritual_procedure_available");
    expect(result.guide.kind).toBe("user_complete_observance_lane");
    expect(result.guide.tiers.map((tier: { tier: string }) => tier.tier)).toEqual(["minimum", "standard", "elaborate"]);
    expect(result.guide.tiers.map((tier: { estimatedMinutes: number }) => tier.estimatedMinutes)).toEqual([10, 30, 75]);
    expect(result.guide.evidence).toMatchObject({
      packId: "ganesh-chaturthi-west-india-content-v1",
      packFileSha256: "eaa9f4576ecd9587ea205039ca633c569ad61d4f79637e8eb7774182a86163dd",
      editorialStatus: "internal_beta_research_synthesis",
      sourceTextReturnedByApi: false,
    });
    expect(result.guide.evidence.sources).toHaveLength(5);
    expect(result.guide.companionReading.steps.map((step: { sourceOrdinals: number[] }) => step.sourceOrdinals)).toEqual([[], [1], [12, 31], [32]]);
    expect(result.guide.boundaries).toMatchObject({
      minimumStandardElaborateFormsIncluded: true,
      hindiAndEnglishIncluded: true,
      substitutionsIncluded: true,
      familyContextPromptsIncluded: true,
      formalPriestMantrasIncluded: false,
      historicalPrescriptionsPromotedAsModernNorms: false,
      oneUniversalProcedureClaimed: false,
      allRegionalVariantsComplete: false,
      allGaneshotsavDaysComplete: false,
      exactNamedParticipantLaneComplete: true,
    });
    expect(JSON.stringify(result)).not.toContain("required_text");
    const packPath = resolve(process.cwd(), "../..", "knowledge_packs/rituals/ganesh-chaturthi-west-india-content-v1.json");
    expect(createHash("sha256").update(readFileSync(packPath)).digest("hex")).toBe(result.guide.evidence.packFileSha256);
  });

  it("returns the separately authored Hindi guide", async () => {
    const result = await (await POST(request({ ...supported, languageCode: "hi" }))).json();
    expect(result.guide).toMatchObject({ languageCode: "hi", kind: "user_complete_observance_lane" });
    expect(result.guide.tiers).toHaveLength(3);
    expect(result.guide.tiers[0].steps).toHaveLength(4);
  });

  it("returns the bounded North India Shardiya Navaratri guide and ten-day reflection sequence", async () => {
    const response = await POST(request({
      observanceSlug: "shardiya-navaratri-begins",
      languageCode: "en",
      regionCode: "north-india",
      traditionCode: "smarta-north-india",
    }));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result).toMatchObject({ ok: true, status: "ritual_procedure_available" });
    expect(result.guide.title).toBe("Shardiya Navaratri at home");
    expect(result.guide.tiers.map((tier: { tier: string }) => tier.tier)).toEqual(["minimum", "standard", "elaborate"]);
    expect(result.guide.dailySequence).toHaveLength(10);
    expect(result.guide.dailySequence[0]).toMatchObject({ ordinal: 1, commonName: "Shailaputri", ritualRequirement: false });
    expect(result.guide.dailySequence[9]).toMatchObject({ ordinal: 10, commonName: "Vijayadashami", ritualRequirement: false });
    expect(result.guide.kind).toBe("user_complete_observance_lane");
    expect(result.guide.userCompleteContext.originNarratives).toHaveLength(2);
    expect(result.guide.evidence.sources).toHaveLength(7);
    expect(result.guide.evidence.packFileSha256).toBe("320b79891597460b33a0ee031411d805afce56b8c9b64c35a18fc2f02df250b1");
    expect(result.guide.boundaries).toMatchObject({
      oneUniversalProcedureClaimed: false,
      bengaliDurgaPujaIncluded: false,
      southIndianGoluIncluded: false,
      gujaratiGarbaIncluded: false,
      nepalDashainIncluded: false,
      continuousFlamePrescribedWithoutSupervision: false,
    });
    const packPath = resolve(process.cwd(), "../..", "knowledge_packs/rituals/shardiya-navaratri-north-west-india-content-v1.json");
    expect(createHash("sha256").update(readFileSync(packPath)).digest("hex")).toBe(result.guide.evidence.packFileSha256);
  });

  it("returns the Hindi Navaratri guide for its supported West India pairing", async () => {
    const response = await POST(request({
      observanceSlug: "shardiya-navaratri-begins",
      languageCode: "hi",
      regionCode: "west-india",
      traditionCode: "smarta-west-india",
    }));
    const result = await response.json();
    expect(result.guide.languageCode).toBe("hi");
    expect(result.guide.tiers[0].label).toContain("दैनिक देवी-प्रार्थना");
    expect(result.guide.dailySequence[0].commonName).toBe("शैलपुत्री");
  });

  it("does not cross-wire a region and tradition for Navaratri", async () => {
    const response = await POST(request({
      observanceSlug: "shardiya-navaratri-begins",
      languageCode: "en",
      regionCode: "north-india",
      traditionCode: "smarta-west-india",
    }));
    expect(await response.json()).toMatchObject({ ok: true, status: "no_supported_guide_for_context", guide: null });
  });

  it("returns all seven bounded weekday guides without prescribing a fast or universal mapping", async () => {
    const slugs = ["ravivara", "somavara", "mangalavara", "budhavara", "guruvara", "shukravara", "shanivara"];
    for (const slug of slugs) {
      const response = await POST(request({
        observanceSlug: `weekday-${slug}`,
        languageCode: "en",
        regionCode: "west-india",
        traditionCode: "smarta-west-india",
      }));
      const result = await response.json();
      expect(result).toMatchObject({ ok: true, status: "ritual_procedure_available" });
      expect(result.guide.tiers.map((tier: { tier: string }) => tier.tier)).toEqual(["minimum", "standard", "elaborate"]);
      expect(result.guide.boundaries).toMatchObject({
        allSevenVarasIncluded: true,
        fastingOrMedicalRegimenPrescribed: false,
        oneUniversalWeekdayMappingClaimed: false,
      });
    }
  });

  it("does not cross-wire the West India weekday pack into another regional lane", async () => {
    const response = await POST(request({
      observanceSlug: "weekday-mangalavara",
      languageCode: "hi",
      regionCode: "north-india",
      traditionCode: "smarta-north-india",
    }));
    expect(await response.json()).toMatchObject({ ok: true, status: "no_supported_guide_for_context", guide: null });
  });

  it("returns the user-complete Hindi West India Lakshmi Puja lane without widening Diwali", async () => {
    const response = await POST(request({
      observanceSlug: "diwali-lakshmi-puja",
      languageCode: "hi",
      regionCode: "west-india",
      traditionCode: "smarta-west-india",
    }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, status: "ritual_procedure_available" });
    expect(result.guide.kind).toBe("user_complete_observance_lane");
    expect(result.guide.evidence.packFileSha256).toBe("f084c0355b1706831058e54586b8b2c782b0c24ae3f724de9494ff3c0f5d6f4f");
    expect(result.guide.userCompleteContext).toMatchObject({
      classification: "user_complete_lane",
      timing: { decisionRuleId: "nirnayasindhu-1865-kartika-amavasya-pradosha-v1" },
    });
    expect(result.guide.boundaries).toMatchObject({
      exactNamedParticipantLaneComplete: true,
      oneUniversalProcedureClaimed: false,
      allRegionalVariantsComplete: false,
    });
  });

  it("returns the bounded Hindi Chhath family-participation guide without prescribing nirjala fasting", async () => {
    const response = await POST(request({
      observanceSlug: "chhath-puja-sandhya-arghya",
      languageCode: "hi",
      regionCode: "bihar-purvanchal",
      traditionCode: "surya-chhath-bihar-purvanchal",
    }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, status: "ritual_procedure_available" });
    expect(result.guide.evidence.packFileSha256).toBe("4b2a048f462ee42bdf9b06eab5948904d9963a347a3b25f136bc3f5ef936b38a");
    expect(result.guide.tiers.map((tier: { tier: string }) => tier.tier)).toEqual(["minimum", "standard", "elaborate"]);
    expect(result.guide.boundaries).toMatchObject({ fastingOrNirjalaRegimenPrescribed: false, unsafeWaterEntryInstructed: false, oneUniversalProcedureClaimed: false });
  });

  it("returns the bounded Dhantrayodashi guide without shopping, medical, or Yama Deepam overreach", async () => {
    const response = await POST(request({
      observanceSlug: "dhantrayodashi",
      languageCode: "en",
      regionCode: "north-india",
      traditionCode: "smarta-north-india",
    }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, status: "ritual_procedure_available" });
    expect(result.guide.evidence.packFileSha256).toBe("ccf9a0f6b2c754e0ae41f6e3e0efb54bbee8c29101f3b00ae4e1bc1fab4a0bb6");
    expect(result.guide.boundaries).toMatchObject({ shoppingOrPurchaseRequired: false, fastingOrMedicalRegimenPrescribed: false, yamaDeepamMergedOrCompleted: false, preciseMuhurtaCalculated: false });
  });

  it("returns the Maharashtra Vasu Baras no-contact guide without animal handling, fasting, or spending", async () => {
    const result = await (await POST(request({ observanceSlug: "govatsa-dwadashi", languageCode: "en", regionCode: "west-india", traditionCode: "smarta-west-india" }))).json();
    expect(result).toMatchObject({ ok: true, status: "ritual_procedure_available" });
    expect(result.guide.evidence.packFileSha256).toBe("fc71846211e23905cf4d2a3449b393e999d55638a91d27ba44f88063dc1e46dc");
    expect(result.guide.boundaries).toMatchObject({ noContactFamilyFormSupported: true, animalContactFeedingWashingRestrainingOrDecorationInstructed: false, flameNearAnimalsInstructed: false, cowPurchaseSaleOrGiftRequired: false, fastOrDairyWheatAbstentionPrescribed: false, medicalVeterinaryOrDietaryAdviceGiven: false, giftDonationOrSpendingRequired: false });
  });

  it("returns the Maharashtra Naraka Chaturdashi guide without mandatory oil, fireworks, or regional merging", async () => {
    const result = await (await POST(request({ observanceSlug: "naraka-chaturdashi", languageCode: "en", regionCode: "west-india", traditionCode: "smarta-west-india" }))).json();
    expect(result).toMatchObject({ ok: true, status: "ritual_procedure_available" });
    expect(result.guide.evidence.packFileSha256).toBe("b91fc42a80de654e23608db3d6ca3c03dab4726ca317ea3c678a1946baaffd33");
    expect(result.guide.boundaries).toMatchObject({ normalSafeBathFallbackSupported: true, sesameOilOrUbtanRequiredForEveryone: false, fireworksRequiredOrRecommended: false, medicalOrDermatologicalAdviceGiven: false, kaliChaudasMergedOrCompleted: false, tamilDeepavaliMergedOrCompleted: false });
  });

  it("returns the BAPS Gujarat Kali Chaudas guide without inventing formal, occult, or protection rites", async () => {
    const result = await (await POST(request({
      observanceSlug: "kali-chaudas-baps",
      languageCode: "en",
      regionCode: "baps-gujarat",
      traditionCode: "swaminarayan-baps",
    }))).json();
    expect(result).toMatchObject({ ok: true, status: "ritual_procedure_available" });
    expect(result.guide.evidence.packFileSha256).toBe("3664aca83a774c9a1c5cde8fa23a0a8404de10512a3db46c7a9c83276999fd67");
    expect(result.guide.boundaries).toMatchObject({
      bapsFamilyOrMandirPrayerAndHanumanRemembranceSupported: true,
      formalHanumanPujaOrMantrasIncluded: false,
      tantricOccultOrExorcisticInstructionIncluded: false,
      evilForceRemovalOrProtectionGuaranteed: false,
      maharashtraNarakaChaturdashiMerged: false,
      tamilDeepavaliMerged: false,
      bengalKaliPujaMerged: false,
    });
  });

  it("returns the BAPS Gujarati New Year guide without a compulsory large Annakut or business rite", async () => {
    const result = await (await POST(request({ observanceSlug: "gujarati-new-year-baps", languageCode: "en", regionCode: "baps-gujarat", traditionCode: "swaminarayan-baps" }))).json();
    expect(result).toMatchObject({ ok: true, status: "ritual_procedure_available" });
    expect(result.guide.evidence.packFileSha256).toBe("55b4c95d6b615984edc1afe19c166661b07115a5093d81b53ea3cf10dc0e7240");
    expect(result.guide.boundaries).toMatchObject({ oneSimpleHomeOfferingWhenAlreadyEstablishedSupported: true, formalAnnakutThalAartiOrMantrasIncluded: false, largeFoodArrayRequired: false, businessAccountBookPujaRequired: false, wealthSuccessOrProsperityGuaranteed: false, baliPratipadaMerged: false, govardhanaPujaMerged: false, southIndianBalipadyamiMerged: false });
  });

  it("returns Karnataka Balipadyami guidance without compulsory representation, flame, abhisheka, or prosperity", async () => {
    const result = await (await POST(request({ observanceSlug: "karnataka-balipadyami", languageCode: "en", regionCode: "south-india", traditionCode: "smarta-south-india" }))).json();
    expect(result).toMatchObject({ ok: true, status: "ritual_procedure_available" });
    expect(result.guide.evidence.packFileSha256).toBe("2233bac7e6580f1fdb637d5a15a1f61ac371455aa11de27945853a830eb84b91");
    expect(result.guide.boundaries).toMatchObject({ materialFreeAndFlameFreeFallbackSupported: true, formalTempleAbhishekaOrMantrasIncluded: false, clayOrCowDungBaliRepresentationRequired: false, realLampsOrLargeLightDisplayRequired: false, prosperityOrWelfareGuaranteed: false, maharashtraBaliPratipadaMerged: false, bapsGujaratiNewYearMerged: false, govardhanaPujaMerged: false });
  });

  it("returns the user-complete Jain Diwali lay remembrance without inventing sect rites or outcomes", async () => {
    const result = await (await POST(request({ observanceSlug: "jain-diwali-umbrella", languageCode: "en", regionCode: "jain-india", traditionCode: "jain-umbrella" }))).json();
    expect(result).toMatchObject({ ok: true, status: "ritual_procedure_available" });
    expect(result.guide.evidence.packFileSha256).toBe("1b7224350413e7a7cf5938dfeabe7d2a7f246ec2043a726bf1ea24404a4b14a9");
    expect(result.guide.boundaries).toMatchObject({ jainLayRemembranceActionable: true, mahaviraLiberationAndJainValuesReflectionSupported: true, formalPujaMantraStotraScriptureOrPratikramanIncluded: false, fastAusterityNirvanLadooOrTempleProcedurePrescribed: false, mokshaMeritOrSpiritualOutcomeGuaranteed: false, jainSectLanesEquated: false, novemberNineAndTenVariantsMerged: false, hinduDiwaliMerged: false, sikhBandiChhorMerged: false });
  });

  it("returns the bounded Bandi Chhor remembrance without inventing Sikh liturgy or merging Diwali lanes", async () => {
    const result = await (await POST(request({ observanceSlug: "bandi-chhor-divas-sgpc", languageCode: "en", regionCode: "sikh-punjab", traditionCode: "sikh-sgpc" }))).json();
    expect(result).toMatchObject({ ok: true, status: "ritual_procedure_available" });
    expect(result.guide.evidence.packFileSha256).toBe("2b8781a980a7e8aceb57a1e25a8ec2b6cf08a3d9a06cb6a2963d6d693c98e085");
    expect(result.guide.boundaries).toMatchObject({ guruHargobind52RulersAndCollectiveFreedomSupported: true, formalPaathKirtanArdasHukamnamaOrGurdwaraProgrammeIncluded: false, langarPreparationOrFoodHandlingPrescribed: false, realLightsCandlesOrFireworksRequired: false, hinduDiwaliMerged: false, jainDiwaliMerged: false });
  });

  it("returns inclusive Ahoi Ashtami family guidance without prescribing a fast or guaranteed child outcome", async () => {
    const result = await (await POST(request({ observanceSlug: "ahoi-ashtami-north-india", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" }))).json();
    expect(result).toMatchObject({ ok: true, status: "ritual_procedure_available" });
    expect(result.guide.evidence.packFileSha256).toBe("8b3b66c32ff3bd05e32c3cb42573a7ededd23abbc08b8b24d7836dad75ee4ec7");
    expect(result.guide.boundaries).toMatchObject({ allChildrenInclusiveWordingUsed: true, fastOrNirjalaRegimenPrescribed: false, medicalOrDietaryAdviceGiven: false, mothersOrWomenOnlyUniversalized: false, sonsOnlyWordingAdopted: false, oneImageStoryStarOrMoonRuleRequired: false, childLongevityProtectionMeritOrSuccessGuaranteed: false });
  });

  it("returns the separate Yama Deepam guide without inventing direction, lamp count, or guaranteed protection", async () => {
    const response = await POST(request({
      observanceSlug: "yama-deepam",
      languageCode: "en",
      regionCode: "west-india",
      traditionCode: "smarta-west-india",
    }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, status: "ritual_procedure_available" });
    expect(result.guide.evidence.packFileSha256).toBe("6464a3ffb480ed52806f7e5b2dd612edc8050a5280e19b0846875a526dc4c6e3");
    expect(result.guide.boundaries).toMatchObject({ outsideHomeEveningLightSupported: true, southFacingDirectionRequired: false, fixedLampCountRequired: false, lampLeftUnattendedOrBurningOvernight: false, guaranteedProtectionOrLongevityOutcomeClaimed: false, dhantrayodashiMergedOrCompleted: false });
  });

  it("returns the Tamil Deepavali guide without requiring oil, fireworks, purchases, or North/West rites", async () => {
    const response = await POST(request({ observanceSlug: "tamil-deepavali-naraka-chaturdashi", languageCode: "en", regionCode: "south-india", traditionCode: "smarta-south-india" }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, status: "ritual_procedure_available" });
    expect(result.guide.evidence.packFileSha256).toBe("ec0df3a2f4ae3817d1db145618e3500f202011303534bd3cc3a7a928a4476323");
    expect(result.guide.boundaries).toMatchObject({ preSunriseFamilyBathCoreSupported: true, sesameOilRequiredForEveryone: false, fireworksRequiredOrRecommended: false, newPurchaseOrNewClothesRequired: false, northWestNarakaOrLakshmiPujaMerged: false });
  });

  it("returns the Bengal Kali Puja participation guide without manufacturing tantric or universal ritual", async () => {
    const response = await POST(request({ observanceSlug: "bengal-kali-puja", languageCode: "en", regionCode: "bengal", traditionCode: "shakta-bengal" }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, status: "ritual_procedure_available" });
    expect(result.guide.evidence.packFileSha256).toBe("11cc811ae40c803ac8b3816b156fdc957f87fafcd59fc428119a8f1a7e02ac67");
    expect(result.guide.boundaries).toMatchObject({ homeTempleAndPublicParticipationSupported: true, formalPriestMantrasIncluded: false, tantricOrInitiatoryInstructionIncluded: false, baliInstructionIncluded: false, fastingOrAllNightVigilPrescribed: false, lakshmiPujaMergedOrCompleted: false });
  });

  it("returns the exact ISKCON Govardhana participation guide without requiring a large Annakut, fast, cow contact, or parikrama", async () => {
    const response = await POST(request({ observanceSlug: "govardhan-puja", languageCode: "en", regionCode: "iskcon-india", traditionCode: "vaishnava-iskcon" }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, status: "ritual_procedure_available" });
    expect(result.guide.evidence.packFileSha256).toBe("68277ffa142a607e50218670e942efdaea87264d550b0490b0dc583b2177a950");
    expect(result.guide.boundaries).toMatchObject({ prayerKirtanSimpleVegetarianOfferingSupported: true, goPujaOrCowContactInstructionIncluded: false, fastingPrescribed: false, longOrBarefootParikramaInstructed: false, largeFoodArrayRequired: false, baliPratipadaMerged: false });
  });

  it("returns the bounded Maharashtra Bali Pratipada family guide without importing a spouse rite, purchase, or another festival lane", async () => {
    const result = await (await POST(request({ observanceSlug: "bali-pratipada", languageCode: "en", regionCode: "west-india", traditionCode: "smarta-west-india" }))).json();
    expect(result).toMatchObject({ ok: true, status: "ritual_procedure_available" });
    expect(result.guide.evidence.packFileSha256).toBe("b88f9a4ff1405af249214168ac6a42f05a0bb2d16df3f8651bf4769f94eb69c6");
    expect(result.guide.boundaries).toMatchObject({ kingBaliRemembranceAndFamilyTimeCoreSupported: true, wifeToHusbandOrSpouseRiteRequired: false, giftOrSpendingRequired: false, commercialNewYearAccountRitualRequired: false, govardhanaOrAnnakutMerged: false, gujaratiOrBapsNewYearMerged: false, southIndiaBalipadyamiCompleted: false });
  });

  it("returns the bounded North India Bhai Dooj guide without compulsory gifts, flame, fasting, or regional conflation", async () => {
    const result = await (await POST(request({ observanceSlug: "bhai-dooj", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" }))).json();
    expect(result).toMatchObject({ ok: true, status: "ritual_procedure_available" });
    expect(result.guide.evidence.packFileSha256).toBe("330951e8a98bd38c3eb04dac43d2e232b18891f8bfc54e4536b6fb7bd849bff2");
    expect(result.guide.boundaries).toMatchObject({ fixedTilakRecipeRequired: false, aratiOrRealFlameRequired: false, giftOrSpendingRequired: false, fastingPrescribed: false, curseOrTonguePrickingInstructionIncluded: false, guaranteedLongevityProtectionOrProsperityClaimed: false });
  });

  it("returns separate general and BAPS Tulasi Vivah guides without plant harm, fasting, or outcome promises", async () => {
    const general = await (await POST(request({ observanceSlug: "tulasi-vivah-dwadashi", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" }))).json();
    expect(general).toMatchObject({ ok: true, status: "ritual_procedure_available", guide: { kind: "user_complete_observance_lane", title: "Tulasi Vivah at home", evidence: { packFileSha256: "8702467cf911baa47decaebe8614bfcf52e208b1d1c2062f486512bed2914f17" }, boundaries: { generalAndBapsLanesSeparate: true, fastOrDietaryRegimenPrescribed: false, plantPluckingPruningIngestionOverwateringOrChemicalDecorationInstructed: false, outcomeGuaranteed: false } } });
    const baps = await (await POST(request({ observanceSlug: "tulsi-vivah-baps-begins", languageCode: "en", regionCode: "baps-gujarat", traditionCode: "swaminarayan-baps" }))).json();
    expect(baps).toMatchObject({ ok: true, status: "ritual_procedure_available", guide: { kind: "user_complete_observance_lane", title: "BAPS Tulsi Vivah participation", companionToObservanceSlug: "tulsi-vivah-baps-begins" } });
    expect((await (await POST(request({ observanceSlug: "tulasi-vivah-dwadashi", languageCode: "en", regionCode: "baps-gujarat", traditionCode: "swaminarayan-baps" }))).json()).status).toBe("no_supported_guide_for_context");
  });

  it("returns the exact Varanasi Dev Deepawali guide without unsafe river, flame, boat, or outcome instructions", async () => {
    const result = await (await POST(request({ observanceSlug: "dev-deepawali-varanasi", languageCode: "en", regionCode: "kashi-varanasi", traditionCode: "regional-kashi-varanasi" }))).json();
    expect(result).toMatchObject({ ok: true, status: "ritual_procedure_available", guide: { evidence: { packFileSha256: "a7c036de4811cdcc02e7bcc324eebe36d605471d2b2f8ec0a4c5e103e632a92f" }, boundaries: { flameFreeHomeFormSupported: true, genericKartikaPurnimaOrBapsDevDiwaliMerged: false, ritualBathingOrWaterEntryInstructed: false, floatingLampsOrRiverOfferingsInstructed: false, unattendedFlameOrFireworksRecommended: false, boatBookingCrowdRouteAccessOrTravelAdviceGiven: false, sinRemovalPurificationMeritProtectionOrOutcomeGuaranteed: false } } });
    expect((await (await POST(request({ observanceSlug: "dev-deepawali-varanasi", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" }))).json()).status).toBe("no_supported_guide_for_context");
  });

  it("returns the Gita Jayanti reading path without turning it into universal Ekadashi vrata guidance", async () => {
    const result = await (await POST(request({ observanceSlug: "mokshada-ekadashi", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" }))).json();
    expect(result).toMatchObject({ ok: true, status: "ritual_procedure_available", guide: { kind: "user_complete_observance_lane", evidence: { packFileSha256: "896b5bd64f7c947832d970188ba1eb6b1e82f11523047cf1b021bf2dc7bb625b", sourceTextReturnedByApi: false }, boundaries: { attributableGitaReadingReflectionAndActionSupported: true, sourceVerseTranslationCommentaryAndApplicationSeparated: true, materialFreeAndNonFastingGitaStudySupported: true, mokshadaEkadashiFastParanaOrTempleVidhiIncluded: false, oneTranslationCommentaryOrApplicationUniversalized: false, completeGitaRecitationRequired: false, allGitaTextualRecensionsTranslationsCommentariesAndTraditionsComplete: false } } });
    expect((await (await POST(request({ observanceSlug: "mokshada-ekadashi", languageCode: "en", regionCode: "west-india", traditionCode: "smarta-north-india" }))).json()).status).toBe("no_supported_guide_for_context");
  });

  it("returns the bounded North India Karwa Chauth guide without prescribing a fast or universalizing regional customs", async () => {
    const result = await (await POST(request({ observanceSlug: "karwa-chauth", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" }))).json();
    expect(result).toMatchObject({ ok: true, status: "ritual_procedure_available", guide: { evidence: { packFileSha256: "639350ff57d30ca4f57092844202208b7a62d81e906c0d503fa724dd94dfd53d", sourceTextReturnedByApi: false }, boundaries: { reciprocalAndWiderFamilyParticipationSupported: true, punjabAndUttarPradeshVariantsRemainDistinct: true, fastOrNirjalaRegimenPrescribed: false, medicalOrDietaryAdviceGiven: false, womenOnlyParticipationUniversalized: false, sargiBayaaThaliSieveArghyaOrSpouseFedCloseRequired: false, spouseLongevityHealthMarriageProtectionMeritOrSuccessGuaranteed: false } } });
    expect((await (await POST(request({ observanceSlug: "karwa-chauth", languageCode: "en", regionCode: "west-india", traditionCode: "smarta-west-india" }))).json()).status).toBe("no_supported_guide_for_context");
  });

  it("returns one recurring Sankashti guide for all four launch months with an attributable Ganesha reading", async () => {
    for (const observanceSlug of ["sankashti-chaturthi-2026-09", "sankashti-chaturthi-2026-10", "sankashti-chaturthi-2026-11", "sankashti-chaturthi-2026-12"]) {
      const result = await (await POST(request({ observanceSlug, languageCode: "en", regionCode: "west-india", traditionCode: "smarta-west-india" }))).json();
      expect(result).toMatchObject({ ok: true, status: "ritual_procedure_available", guide: { kind: "user_complete_observance_lane", companionToObservanceSlug: observanceSlug, evidence: { packFileSha256: "4515a475d9fcfcfb6435e2dc9a2a5425e5c54d2d9ee30e8dd61329daed661375", sourceTextReturnedByApi: false }, companionReading: { evidence: { packFileSha256: "492bafe94124f81de32acee6329b798fe09970eace160bdd1a9db646d5959d2d" } }, boundaries: { runtimeLocationSpecificMoonriseRequired: true, fastOrNirjalaRegimenPrescribed: false, providerCityMoonriseReusedForUserLocation: false, obstacleRemovalSuccessProtectionMeritOrOtherOutcomeGuaranteed: false, ganeshChaturthiOrKarwaChauthMerged: false } } });
    }
    expect((await (await POST(request({ observanceSlug: "sankashti-chaturthi-2026-09", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" }))).json()).status).toBe("no_supported_guide_for_context");
  });

  it("returns the recurring non-fasting Ekadashi companion across all seven uncovered named observances", async () => {
    for (const observanceSlug of ["aja-ekadashi", "parsva-ekadashi", "indira-ekadashi", "papankusha-ekadashi", "rama-ekadashi", "devutthana-ekadashi", "utpanna-ekadashi"]) {
      const result = await (await POST(request({ observanceSlug, languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" }))).json();
      expect(result).toMatchObject({ ok: true, status: "ritual_procedure_available", guide: { kind: "user_complete_observance_lane", companionToObservanceSlug: observanceSlug, evidence: { packFileSha256: "5aa329200dab91dd2623064ce585dc53ae4cbba110a6fd4a739b7c745d77caf8", sourceTextReturnedByApi: false }, boundaries: { recurringSevenNamedEkadashisSupported: true, smartaAndIskconCalendarLanesKeptSeparate: true, fastOrNirjalaRegimenPrescribed: false, foodOrDietaryRulesGiven: false, smartaParanaServed: false, iskconParanaRepeatedByPracticeGuide: false, sinRemovalMeritLiberationHealthProsperityOrOtherOutcomeGuaranteed: false } } });
    }
    expect((await (await POST(request({ observanceSlug: "aja-ekadashi", languageCode: "en", regionCode: "north-india", traditionCode: "vaishnava-iskcon" }))).json()).status).toBe("no_supported_guide_for_context");
  });

  it("returns one bounded Masika Shivaratri companion for all four resolved North/West nights", async () => {
    for (const observanceSlug of ["masika-shivaratri-2026-09", "masika-shivaratri-2026-10", "masika-shivaratri-2026-11", "masika-shivaratri-2026-12"]) {
      const result = await (await POST(request({ observanceSlug, languageCode: "en", regionCode: "west-india", traditionCode: "smarta-west-india" }))).json();
      expect(result).toMatchObject({ ok: true, status: "ritual_procedure_available", guide: { kind: "user_complete_observance_lane", companionToObservanceSlug: observanceSlug, evidence: { packFileSha256: "dfe960d608286e8381bef72db95d1f75c86dfc395acdd8cda2ff8a25bf78dab2" }, boundaries: { fourLaunchMonthMasikaShivaratriLanesSupported: true, fastOrNirjalaRegimenPrescribed: false, abhishekaIngredientsOrHomeLingamProcedurePrescribed: false, formalMantraCountAartiOrPriestlySequenceIncluded: false, nightVigilRequired: false, paranaServed: false, annualMahashivaratriPracticeUniversalizedMonthly: false } } });
    }
    expect((await (await POST(request({ observanceSlug: "masika-shivaratri-2026-09", languageCode: "en", regionCode: "south-india", traditionCode: "smarta-south-india" }))).json()).status).toBe("no_supported_guide_for_context");
  });

  it("returns one bounded Pradosha guide for all eight resolved fortnightly evenings", async () => {
    for (const observanceSlug of ["pradosha-2026-09-krishna", "pradosha-2026-09-shukla", "pradosha-2026-10-krishna", "pradosha-2026-10-shukla", "pradosha-2026-11-krishna", "pradosha-2026-11-shukla", "pradosha-2026-12-krishna", "pradosha-2026-12-shukla"]) {
      const result = await (await POST(request({ observanceSlug, languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" }))).json();
      expect(result).toMatchObject({ ok: true, status: "ritual_procedure_available", guide: { kind: "user_complete_observance_lane", companionToObservanceSlug: observanceSlug, evidence: { packFileSha256: "fc8c08624c3b7048de089462e9aef23decad1773d831358d783fc4651fb24eb0" }, boundaries: { eightLaunchWindowPradoshaLanesSupported: true, krishnaAndShuklaPakshaPradoshaKeptDistinct: true, weekdayPlanetaryRemedyOrSpecialOutcomePrescribed: false, rudrabhishekamLingamNandiMantraOfferingAartiOrPradakshinaPrescribed: false, pujaMuhurtaOrParanaServed: false } } });
    }
  });

  it("returns distinct generic Purnima and Amavasya companions only for seven resolved calendar days", async () => {
    for (const observanceSlug of ["bhadrapada-purnima", "ashwina-purnima", "kartika-purnima", "bhadrapada-amavasya", "ashwina-amavasya", "kartika-amavasya", "margashirsha-amavasya"]) {
      const result = await (await POST(request({ observanceSlug, languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" }))).json();
      expect(result).toMatchObject({ ok: true, status: "ritual_procedure_available", guide: { kind: "user_complete_observance_lane", companionToObservanceSlug: observanceSlug, evidence: { packFileSha256: "dc4cf0acfb4d49c901ae023cd9ae05e6ba6b9e2b3b09839049cda75fb0ea27d2" }, boundaries: { coincidentSpecialObservancesRemainSeparate: true, shraddhaTarpanDarshaOrAncestorRitePrescribed: false, ritualBathingMoonWorshipOfferingMantraOrTempleProcedurePrescribed: false, margashirshaPurnimaPromoted: false } } });
    }
    expect((await (await POST(request({ observanceSlug: "margashirsha-purnima", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" }))).json()).status).toBe("no_supported_guide_for_context");
  });

  it("returns separate Smarta and ISKCON Janmashtami lanes without cross-wiring them", async () => {
    const smarta = await (await POST(request({ observanceSlug: "krishna-janmashtami-smarta", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" }))).json();
    const iskcon = await (await POST(request({ observanceSlug: "krishna-janmashtami-iskcon", languageCode: "en", regionCode: "iskcon-india", traditionCode: "vaishnava-iskcon" }))).json();
    expect(smarta).toMatchObject({ ok: true, status: "ritual_procedure_available", guide: { kind: "user_complete_observance_lane", companionToObservanceSlug: "krishna-janmashtami-smarta", evidence: { packFileSha256: "bbc353da9c309fb851ecc704f83e1dbc758a73a487337603c8adbfe2aadf3126" }, boundaries: { smartaAndIskconLaneNotesSeparate: true, sharedJanmashtamiDevotionalCoreSupported: true, smartaAndIskconRulesEquated: false, fastOrNirjalaRegimenPrescribed: false, dahiHandiParticipationOrHumanPyramidInstructed: false } } });
    expect(iskcon).toMatchObject({ ok: true, status: "ritual_procedure_available", guide: { kind: "user_complete_observance_lane", companionToObservanceSlug: "krishna-janmashtami-iskcon" } });
    expect((await (await POST(request({ observanceSlug: "krishna-janmashtami-smarta", languageCode: "en", regionCode: "iskcon-india", traditionCode: "vaishnava-iskcon" }))).json()).status).toBe("no_supported_guide_for_context");
    expect((await (await POST(request({ observanceSlug: "krishna-janmashtami-iskcon", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" }))).json()).status).toBe("no_supported_guide_for_context");
  });

  it("returns the bounded Hartalika Teej guide only for exact North/West Smarta contexts", async () => {
    const result = await (await POST(request({ observanceSlug: "hartalika-teej", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" }))).json();
    expect(result).toMatchObject({ ok: true, status: "ritual_procedure_available", guide: { kind: "user_complete_observance_lane", evidence: { packFileSha256: "da872bebfcfb81a09ecd05eaaaf67454b1de88dfeee0bd2ca7018b77ada19503" }, boundaries: { materialFreeAndNonFastingFormSupported: true, fastOrNirjalaRegimenPrescribed: false, formalSankalpaKathaPujaMantraOfferingOrClosePrescribed: false, womenOnlyOrMarriedHouseholdOnlyParticipationUniversalized: false, gowriHabbaOrOtherTeejFestivalsMerged: false } } });
    expect((await (await POST(request({ observanceSlug: "hartalika-teej", languageCode: "en", regionCode: "south-india", traditionCode: "smarta-south-india" }))).json()).status).toBe("no_supported_guide_for_context");
  });

  it("returns Rishi Panchami learning guidance without promoting impurity or atonement claims", async () => {
    const result = await (await POST(request({ observanceSlug: "rishi-panchami", languageCode: "en", regionCode: "west-india", traditionCode: "smarta-west-india" }))).json();
    expect(result).toMatchObject({ ok: true, status: "ritual_procedure_available", guide: { evidence: { packFileSha256: "b5a463b6a93045ef442c449b723de738bd9ea2976ec69b826b4863a7b3202de3" }, boundaries: { saptarishiRemembranceAttributableStudyTeacherGratitudeAndServiceSupported: true, menstruationOrPersonDescribedAsImpure: false, rajaswalaDoshaAtonementOrGuiltPromoted: false, womenOnlyParticipationUniversalized: false, bhaiPanchamiMerged: false } } });
    expect((await (await POST(request({ observanceSlug: "rishi-panchami", languageCode: "en", regionCode: "south-india", traditionCode: "smarta-south-india" }))).json()).status).toBe("no_supported_guide_for_context");
  });

  it("returns Radha Ashtami participation only for the exact ISKCON lane", async () => {
    const result = await (await POST(request({ observanceSlug: "radha-ashtami-iskcon", languageCode: "en", regionCode: "iskcon-india", traditionCode: "vaishnava-iskcon" }))).json();
    expect(result).toMatchObject({ ok: true, status: "ritual_procedure_available", guide: { kind: "user_complete_observance_lane", evidence: { packFileSha256: "2a5351b8aab4b0346299d2104b506fd58d243011322f5f1712db00c23d06d455" }, boundaries: { radharaniAppearanceAttributableTeachingSongPrayerKirtanAndSevaSupported: true, officialIskconTempleProgrammeParticipationSupported: true, materialFreeAndNonFastingHomeFormSupported: true, fastFoodDietaryOrMedicalGuidanceGiven: false, abhishekaAratiHomaDeityDressingOfferingKalashaFlowerOrFormalPujaPrescribed: false, allGaudiyaVaishnavaVaishnavaSmartaAndRegionalTraditionsEquated: false, allRadhaAshtamiTraditionsComplete: false } } });
    expect((await (await POST(request({ observanceSlug: "radha-ashtami-iskcon", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" }))).json()).status).toBe("no_supported_guide_for_context");
  });

  it("returns the bounded North/West Smarta Kojagara companion without merging Bengali practice", async () => {
    const result = await (await POST(request({ observanceSlug: "kojagara-puja-sharad-purnima", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" }))).json();
    expect(result).toMatchObject({ ok: true, status: "ritual_procedure_available", guide: { evidence: { packFileSha256: "f199e5d116d3931db9453a56c16b093e35651e6a88dabc9eaefe2d35542f2719" }, boundaries: { foodIfFamilyEstablishedTreatedAsOptionalAndNotMedicine: true, fastFoodDietaryOrMedicalGuidanceGiven: false, nightVigilRequired: false, medicinalCurativeOrHealthBenefitFromMoonlightOrFoodClaimed: false, gamblingDiceCardsOrBettingRecommended: false, bengalKojagariLakshmiPujaMerged: false, nextDayAshwinaPurnimaCalendarLaneMerged: false } } });
    expect((await (await POST(request({ observanceSlug: "kojagara-puja-sharad-purnima", languageCode: "en", regionCode: "bengal", traditionCode: "shakta-bengal" }))).json()).status).toBe("no_supported_guide_for_context");
  });

  it("returns bounded Ananta remembrance while keeping Ganesh Visarjan separate", async () => {
    const result = await (await POST(request({ observanceSlug: "ananta-chaturdashi", languageCode: "en", regionCode: "west-india", traditionCode: "smarta-west-india" }))).json();
    expect(result).toMatchObject({ ok: true, status: "ritual_procedure_available", guide: { evidence: { packFileSha256: "84627e57e6cac73a8825afd7cbf972a101e24f9476749a42901300f059b7cc47" }, boundaries: { anantaVrataAndGaneshVisarjanKeptSeparate: true, priorAndFreshProviderHashesWithSemanticDeltaRetained: true, fourteenKnotThreadTyingRemovalOrRetentionPrescribed: false, ganeshImmersionImportedIntoAnantaGuide: false } } });
    expect((await (await POST(request({ observanceSlug: "ananta-chaturdashi", languageCode: "en", regionCode: "south-india", traditionCode: "smarta-south-india" }))).json()).status).toBe("no_supported_guide_for_context");
  });

  it("returns Kalabhairava remembrance only for exact North Smarta or Kashi regional contexts", async () => {
    const north = await (await POST(request({ observanceSlug: "kalabhairava-jayanti", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" }))).json();
    const kashi = await (await POST(request({ observanceSlug: "kalabhairava-jayanti", languageCode: "hi", regionCode: "kashi-varanasi", traditionCode: "regional-kashi-varanasi" }))).json();
    expect(north).toMatchObject({ ok: true, status: "ritual_procedure_available", guide: { evidence: { packFileSha256: "97f7c1b0851467f1ef456fa14d306b5987653ed4df11fd934cea5c919a47a15a" }, boundaries: { fearOccultExorcismOrProtectionRitePrescribed: false, alcoholMeatAnimalOfferingOrHarmInstructed: false, kashiTemplePracticeUniversalized: false } } });
    expect(kashi.status).toBe("ritual_procedure_available");
    expect((await (await POST(request({ observanceSlug: "kalabhairava-jayanti", languageCode: "en", regionCode: "west-india", traditionCode: "smarta-west-india" }))).json()).status).toBe("no_supported_guide_for_context");
  });

  it("returns Vivaha Panchami remembrance only for the bounded North India Smarta lane", async () => {
    const north = await (await POST(request({ observanceSlug: "vivaha-panchami", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" }))).json();
    expect(north).toMatchObject({ ok: true, status: "ritual_procedure_available", guide: { kind: "user_complete_observance_lane", evidence: { packFileSha256: "6f2a7c281c31d395fd394e9e7b31ec812355343c75a46fae783285c7e325abac" }, boundaries: { sourceBoundedRamaSitaMarriageRemembranceAndPracticalReflectionSupported: true, janakpurAyodhyaAndOrchhaContextsKeptDistinct: true, formalWeddingReenactmentPujaMantraOfferingProcessionOrVowPrescribed: false, marriageSpouseFertilityProgenyProsperityMeritOrOtherOutcomeGuaranteed: false, oneRamayanaEditionStoryInterpretationOrPracticeClaimedUniversal: false } } });
    expect((await (await POST(request({ observanceSlug: "vivaha-panchami", languageCode: "en", regionCode: "west-india", traditionCode: "smarta-west-india" }))).json()).status).toBe("no_supported_guide_for_context");
  });

  it("returns Bengal Durga Puja participation without exporting institutional rites", async () => {
    const result = await (await POST(request({ observanceSlug: "bengal-durga-puja-campaign", languageCode: "en", regionCode: "bengal", traditionCode: "shakta-bengal" }))).json();
    expect(result).toMatchObject({ ok: true, status: "ritual_procedure_available", guide: { kind: "user_complete_observance_lane", evidence: { packFileSha256: "ef0727519e45314eefbdfcfd83f2ffc750b9ba5ea6399ab4cdbed64cf05afa59" }, boundaries: { sixDayCampaignParticipationAndSourceLabelledDurgaRemembranceSupported: true, bodhanAdhivasNavapatrikaPranapratisthaShodashopacharaAnjaliBhogOrFormalPujaPrescribed: false, kumariPujaOrUseOfAChildAsRitualSubjectPrescribed: false, animalOrSymbolicBaliHomaOrHarmInstructed: false, immersionProcessionWaterEntryOrEnvironmentalOperationInstructed: false } } });
    expect((await (await POST(request({ observanceSlug: "bengal-durga-puja-campaign", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" }))).json()).status).toBe("no_supported_guide_for_context");
  });

  it("returns the user-complete Maha Ashtami participant lane without widening it to priest-led ritual", async () => {
    const result = await (await POST(request({ observanceSlug: "bengal-mahashtami-community-participant-2026", languageCode: "en", regionCode: "bengal", traditionCode: "shakta-bengal" }))).json();
    expect(result).toMatchObject({
      ok: true,
      status: "ritual_procedure_available",
      guide: {
        kind: "user_complete_observance_lane",
        evidence: {
          packId: "bengal-mahashtami-community-participant-2026-v1",
          packFileSha256: "8f4437ecb12e0c1cf6cd803312162f2b616f291b60dd24de309a6ee00f38625b",
        },
        boundaries: {
          exactNamedParticipantLaneComplete: true,
          priestLedVidhiIncluded: false,
          householdConsecrationProcedureIncluded: false,
        },
        userCompleteContext: { classification: "user_complete_lane" },
      },
    });
    expect(result.guide.tiers.map((tier: { tier: string }) => tier.tier)).toEqual(["minimum", "standard", "elaborate"]);
    expect((await (await POST(request({ observanceSlug: "bengal-mahashtami-community-participant-2026", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" }))).json()).status).toBe("no_supported_guide_for_context");
  });

  it("returns the recurring Masika Durgashtami companion without importing Bengal or Mahashtami rites", async () => {
    const result = await (await POST(request({ observanceSlug: "masika-durgashtami-2026-11", languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" }))).json();
    expect(result).toMatchObject({ ok: true, status: "ritual_procedure_available", guide: { kind: "user_complete_observance_lane", companionToObservanceSlug: "masika-durgashtami-2026-11", evidence: { packFileSha256: "e8c24d5732f2a8371ccc2c08e2643920e3ca8af3313ff722eaba19989ea95d83" }, boundaries: { fourMonthCalendarLaneAndSourceLabelledDurgaRemembranceSupported: true, fastFoodDietaryOrMedicalGuidanceGiven: false, formalPujaMantraImageOfferingAartiChandiRecitationOrHomaPrescribed: false, shardiyaMahashtamiEquatedWithEveryMonthlyAshtami: false, bengalDurgaPujaOrOtherRegionalAshtamiImported: false } } });
    expect((await (await POST(request({ observanceSlug: "masika-durgashtami-2026-10", languageCode: "en", regionCode: "bengal", traditionCode: "shakta-bengal" }))).json()).status).toBe("no_supported_guide_for_context");
  });

  it("fails closed for unsupported practice contexts and malformed requests", async () => {
    const unsupported = await (await POST(request({ ...supported, traditionCode: "smarta-south-india" }))).json();
    expect(unsupported).toMatchObject({ ok: true, status: "no_supported_guide_for_context", guide: null });
    expect((await POST(request({ observanceSlug: "ganesh-chaturthi" }))).status).toBe(422);
  });
});

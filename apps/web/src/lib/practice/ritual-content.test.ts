import { describe, expect, it } from "vitest";

import { resolveUserCompleteRitualContent } from "./ritual-content";

const supportedContext = {
  observanceSlug: "bengal-mahashtami-community-participant-2026",
  regionCode: "bengal",
  traditionCode: "shakta-bengal",
} as const;

describe("generic user-complete ritual content", () => {
  it("loads the exact New Delhi Agastya Arghya companion without claiming a general visibility algorithm", () => {
    const guide = resolveUserCompleteRitualContent({ observanceSlug: "agastya-arghya-delhi", regionCode: "north-india", traditionCode: "smarta-north-india", languageCode: "en" });
    expect(guide).toMatchObject({
      kind: "user_complete_observance_lane",
      evidence: { packId: "agastya-arghya-delhi-content-v1", packFileSha256: "fd0e1631e921c3f7ccb9cdc2ea42d552be27c11de1fa423d53aa6264383ebc64" },
      userCompleteContext: { timing: { decisionRuleId: "devam-delhi-practitioner-calendar-agastya-arghya-2026-v1", liveScheduleRequired: true } },
    });
    expect(guide?.summary).toContain("4 September");
    expect(guide?.summary).toContain("04:58–06:00");
    expect(guide?.tiers.map((tier) => tier.tier)).toEqual(["minimum", "standard", "elaborate"]);
    expect(guide?.userCompleteContext?.safetyAndBoundaries.join(" ")).toContain("Do not infer the date");
    expect(resolveUserCompleteRitualContent({ observanceSlug: "agastya-arghya-delhi", regionCode: "north-india", traditionCode: "vaishnava-iskcon", languageCode: "en" })).toBeNull();
  });

  it("loads Hala Shashthi while keeping the rejected September 16 and official ISKCON identities separate", () => {
    const guide = resolveUserCompleteRitualContent({ observanceSlug: "hala-shashthi-hal-chhath", regionCode: "north-india", traditionCode: "smarta-north-india", languageCode: "en" });
    expect(guide).toMatchObject({
      kind: "user_complete_observance_lane",
      evidence: { packId: "hala-shashthi-north-india-content-v1", packFileSha256: "b043f436d54b39a55a9b48c351bfbb726b1a8a1fbafebc39149c84f2a0f4d8c0" },
      userCompleteContext: { timing: { decisionRuleId: "devam-delhi-practitioner-calendar-hala-shashthi-2026-v1", liveScheduleRequired: true } },
    });
    expect(guide?.summary).toContain("2 September 2026");
    expect(guide?.summary).toContain("fasting");
    expect(guide?.userCompleteContext?.variants.some((variant) => variant.description.includes("28 August"))).toBe(true);
    expect(resolveUserCompleteRitualContent({ observanceSlug: "hala-shashthi-hal-chhath", regionCode: "north-india", traditionCode: "vaishnava-iskcon", languageCode: "en" })).toBeNull();
  });

  it("loads the bounded Bengal Vishwakarma workplace lane without widening its date or safety authority", () => {
    const guide = resolveUserCompleteRitualContent({
      observanceSlug: "vishwakarma-puja-bengal",
      regionCode: "bengal",
      traditionCode: "regional-bengal",
      languageCode: "en",
    });
    expect(guide).toMatchObject({
      kind: "user_complete_observance_lane",
      companionToObservanceSlug: "vishwakarma-puja-bengal",
      evidence: {
        packId: "vishwakarma-puja-bengal-workplace-content-v1",
        packFileSha256: "1d57c055654685481e90f4e8dc190385adfa06486313f8a844bfcfd6840b4b39",
      },
      userCompleteContext: {
        classification: "user_complete_lane",
        timing: {
          decisionRuleId: "devam-kanya-sankranti-vishwakarma-bengal-2026-v1",
          liveScheduleRequired: true,
        },
      },
    });
    expect(guide?.tiers.map((tier) => tier.tier)).toEqual(["minimum", "standard", "elaborate"]);
    expect(guide?.summary).toContain("17 September 2026");
    expect(guide?.userCompleteContext?.safetyAndBoundaries.join(" ")).toContain("Never touch");
    expect(guide?.evidence.sources).toHaveLength(5);

    const hindi = resolveUserCompleteRitualContent({
      observanceSlug: "vishwakarma-puja-bengal",
      regionCode: "bengal",
      traditionCode: "regional-bengal",
      languageCode: "hi",
    });
    expect(hindi?.languageCode).toBe("hi");
    expect(hindi?.summary).toContain("17 सितंबर 2026");
    expect(resolveUserCompleteRitualContent({
      observanceSlug: "vishwakarma-puja-bengal",
      regionCode: "west-india",
      traditionCode: "smarta-west-india",
      languageCode: "en",
    })).toBeNull();
  });

  it("loads all four bounded Sankranti lanes while keeping local punya kala and regional rites outside the generic guide", () => {
    for (const [observanceSlug, expectedDate] of [
      ["kanya-sankranti", "17 September 2026"],
      ["tula-sankranti", "17 October 2026"],
      ["vrishchika-sankranti", "16 November 2026"],
      ["dhanu-sankranti", "16 December 2026"],
    ] as const) {
      const guide = resolveUserCompleteRitualContent({
        observanceSlug,
        regionCode: "general-india",
        traditionCode: "family-specific-hindu",
        languageCode: "en",
      });
      expect(guide).toMatchObject({
        kind: "user_complete_observance_lane",
        companionToObservanceSlug: observanceSlug,
        evidence: {
          packId: "sankranti-september-december-general-content-v1",
          packFileSha256: "7f76eaabbf5b5cf31f5bd5d612e4a08521a7adc46d6bf462e2b4c5f16640b9fa",
        },
        userCompleteContext: {
          classification: "user_complete_lane",
          timing: { liveScheduleRequired: true },
        },
      });
      expect(guide?.summary).toContain(expectedDate);
      expect(guide?.tiers.map((tier) => tier.tier)).toEqual(["minimum", "standard", "elaborate"]);
      expect(guide?.familyPracticeNote).toContain("Punya kala");
    }
    expect(resolveUserCompleteRitualContent({
      observanceSlug: "tula-sankranti",
      regionCode: "general-india",
      traditionCode: "vaishnava-iskcon",
      languageCode: "en",
    })).toBeNull();
  });

  it("loads the exact English Bengal Mahashtami participant lane", () => {
    const guide = resolveUserCompleteRitualContent({ ...supportedContext, languageCode: "en" });
    expect(guide).toMatchObject({
      kind: "user_complete_observance_lane",
      companionToObservanceSlug: supportedContext.observanceSlug,
      evidence: {
        packId: "bengal-mahashtami-community-participant-2026-v1",
        packFileSha256: "8f4437ecb12e0c1cf6cd803312162f2b616f291b60dd24de309a6ee00f38625b",
      },
      boundaries: {
        exactNamedParticipantLaneComplete: true,
        priestLedVidhiIncluded: false,
        householdConsecrationProcedureIncluded: false,
      },
      userCompleteContext: {
        classification: "user_complete_lane",
        timing: { liveScheduleRequired: true },
      },
    });
    expect(guide?.tiers.map((tier) => tier.tier)).toEqual(["minimum", "standard", "elaborate"]);
    expect(guide?.userCompleteContext?.originNarratives).toHaveLength(3);
    expect(guide?.userCompleteContext?.typicalPractices).toHaveLength(2);
    expect(guide?.userCompleteContext?.variants.length).toBeGreaterThanOrEqual(3);
    expect(guide?.evidence.sources).toHaveLength(8);
  });

  it("loads the six-day Bengal Durga Puja participant campaign without promoting priest-led Puja", () => {
    const guide = resolveUserCompleteRitualContent({
      observanceSlug: "bengal-durga-puja-campaign",
      regionCode: "bengal",
      traditionCode: "shakta-bengal",
      languageCode: "en",
    });
    expect(guide).toMatchObject({
      kind: "user_complete_observance_lane",
      evidence: {
        packId: "bengal-durga-puja-participant-content-v1",
        packFileSha256: "ef0727519e45314eefbdfcfd83f2ffc750b9ba5ea6399ab4cdbed64cf05afa59",
      },
      userCompleteContext: { timing: { liveScheduleRequired: true } },
      boundaries: {
        sixDayCampaignParticipationAndSourceLabelledDurgaRemembranceSupported: true,
        priestLedVidhiIncluded: false,
      },
    });
    expect(guide?.dailySequence).toHaveLength(6);
    expect(guide?.userCompleteContext?.originNarratives).toHaveLength(3);
    expect(guide?.userCompleteContext?.variants).toHaveLength(4);
    expect(guide?.evidence.sources).toHaveLength(7);
  });

  it("loads the Hindi lane without changing its source or scope boundary", () => {
    const guide = resolveUserCompleteRitualContent({ ...supportedContext, languageCode: "hi" });
    expect(guide?.languageCode).toBe("hi");
    expect(guide?.guideId).toBe("bengal-mahashtami-community-participant-2026-v1-hi");
    expect(guide?.evidence.packFileSha256).toBe("8f4437ecb12e0c1cf6cd803312162f2b616f291b60dd24de309a6ee00f38625b");
  });

  it("loads the exact West India Lakshmi Puja household lane as user-complete", () => {
    const guide = resolveUserCompleteRitualContent({
      observanceSlug: "diwali-lakshmi-puja",
      regionCode: "west-india",
      traditionCode: "smarta-west-india",
      languageCode: "en",
    });
    expect(guide).toMatchObject({
      kind: "user_complete_observance_lane",
      evidence: {
        packId: "diwali-lakshmi-puja-west-india-content-v1",
        packFileSha256: "f084c0355b1706831058e54586b8b2c782b0c24ae3f724de9494ff3c0f5d6f4f",
      },
      userCompleteContext: {
        classification: "user_complete_lane",
        timing: {
          kind: "mixed",
          liveScheduleRequired: false,
          decisionRuleId: "nirnayasindhu-1865-kartika-amavasya-pradosha-v1",
        },
      },
    });
    expect(guide?.tiers.map((tier) => tier.tier)).toEqual(["minimum", "standard", "elaborate"]);
    expect(guide?.userCompleteContext?.originNarratives).toHaveLength(2);
    expect(guide?.userCompleteContext?.typicalPractices).toHaveLength(2);
    expect(guide?.userCompleteContext?.variants).toHaveLength(3);
    expect(guide?.evidence.sources).toHaveLength(4);
  });

  it("does not widen the Lakshmi Puja lane to another region or Diwali tradition", () => {
    const request = {
      observanceSlug: "diwali-lakshmi-puja",
      regionCode: "west-india",
      traditionCode: "smarta-west-india",
      languageCode: "en",
    } as const;
    expect(resolveUserCompleteRitualContent({ ...request, regionCode: "bengal" })).toBeNull();
    expect(resolveUserCompleteRitualContent({ ...request, traditionCode: "shakta-bengal" })).toBeNull();
    expect(resolveUserCompleteRitualContent({ ...request, observanceSlug: "bengal-kali-puja" })).toBeNull();
  });

  it("loads the exact West India Ganesh Chaturthi household lane", () => {
    const guide = resolveUserCompleteRitualContent({
      observanceSlug: "ganesh-chaturthi",
      regionCode: "west-india",
      traditionCode: "smarta-west-india",
      languageCode: "en",
    });
    expect(guide).toMatchObject({
      kind: "user_complete_observance_lane",
      evidence: {
        packId: "ganesh-chaturthi-west-india-content-v1",
        packFileSha256: "eaa9f4576ecd9587ea205039ca633c569ad61d4f79637e8eb7774182a86163dd",
      },
      userCompleteContext: {
        classification: "user_complete_lane",
        timing: {
          decisionRuleId: "nirnayasindhu-1865-bhadrapada-shukla-chaturthi-madhyahna-v1",
        },
      },
    });
    expect(guide?.userCompleteContext?.originNarratives).toHaveLength(2);
    expect(guide?.userCompleteContext?.typicalPractices).toHaveLength(2);
    expect(guide?.userCompleteContext?.variants).toHaveLength(3);
    expect(guide?.evidence.sources).toHaveLength(5);
  });

  it("loads the exact North/West India Shardiya Navaratri household lane and preserves its daily path", () => {
    const guide = resolveUserCompleteRitualContent({
      observanceSlug: "shardiya-navaratri-begins",
      regionCode: "north-india",
      traditionCode: "smarta-north-india",
      languageCode: "en",
    });
    expect(guide).toMatchObject({
      kind: "user_complete_observance_lane",
      evidence: {
        packId: "shardiya-navaratri-north-west-india-content-v1",
        packFileSha256: "320b79891597460b33a0ee031411d805afce56b8c9b64c35a18fc2f02df250b1",
      },
      userCompleteContext: {
        timing: { decisionRuleId: "nirnayasindhu-1865-ashvina-shukla-pratipada-sunrise-v1" },
      },
    });
    expect(guide?.dailySequence).toHaveLength(10);
    expect(guide?.dailySequence?.every((entry) => entry.ritualRequirement === false)).toBe(true);
    expect(guide?.userCompleteContext?.originNarratives).toHaveLength(2);
    expect(guide?.userCompleteContext?.variants).toHaveLength(3);
    expect(guide?.evidence.sources).toHaveLength(7);
  });

  it.each([
    {
      observanceSlug: "govatsa-dwadashi",
      regionCode: "west-india",
      traditionCode: "smarta-west-india",
      packId: "vasu-baras-maharashtra-family-content-v1",
      hash: "fc71846211e23905cf4d2a3449b393e999d55638a91d27ba44f88063dc1e46dc",
      sourceCount: 4,
    },
    {
      observanceSlug: "dhantrayodashi",
      regionCode: "north-india",
      traditionCode: "smarta-north-india",
      packId: "dhantrayodashi-north-west-india-content-v1",
      hash: "ccf9a0f6b2c754e0ae41f6e3e0efb54bbee8c29101f3b00ae4e1bc1fab4a0bb6",
      sourceCount: 6,
    },
    {
      observanceSlug: "yama-deepam",
      regionCode: "west-india",
      traditionCode: "smarta-west-india",
      packId: "yama-deepam-north-west-india-content-v1",
      hash: "6464a3ffb480ed52806f7e5b2dd612edc8050a5280e19b0846875a526dc4c6e3",
      sourceCount: 4,
    },
  ])("loads the early-Diwali user-complete lane for $observanceSlug", (candidate) => {
    const guide = resolveUserCompleteRitualContent({
      observanceSlug: candidate.observanceSlug,
      regionCode: candidate.regionCode,
      traditionCode: candidate.traditionCode,
      languageCode: "en",
    });
    expect(guide).toMatchObject({
      kind: "user_complete_observance_lane",
      evidence: { packId: candidate.packId, packFileSha256: candidate.hash },
      userCompleteContext: { classification: "user_complete_lane" },
    });
    expect(guide?.tiers.map((tier) => tier.tier)).toEqual(["minimum", "standard", "elaborate"]);
    expect(guide?.userCompleteContext?.originNarratives.length).toBeGreaterThan(0);
    expect(guide?.userCompleteContext?.typicalPractices.length).toBeGreaterThan(0);
    expect(guide?.userCompleteContext?.variants.length).toBeGreaterThan(0);
    expect(guide?.evidence.sources).toHaveLength(candidate.sourceCount);
  });

  it.each([
    {
      observanceSlug: "naraka-chaturdashi",
      regionCode: "west-india",
      traditionCode: "smarta-west-india",
      packId: "naraka-chaturdashi-maharashtra-content-v1",
      hash: "b91fc42a80de654e23608db3d6ca3c03dab4726ca317ea3c678a1946baaffd33",
      sourceCount: 5,
      positiveBoundary: "maharashtraEarlyBathAndNarakasuraRemembranceSupported",
    },
    {
      observanceSlug: "tamil-deepavali-naraka-chaturdashi",
      regionCode: "south-india",
      traditionCode: "smarta-south-india",
      packId: "tamil-deepavali-household-content-v1",
      hash: "ec0df3a2f4ae3817d1db145618e3500f202011303534bd3cc3a7a928a4476323",
      sourceCount: 4,
      positiveBoundary: "preSunriseFamilyBathCoreSupported",
    },
    {
      observanceSlug: "kali-chaudas-baps",
      regionCode: "baps-gujarat",
      traditionCode: "swaminarayan-baps",
      packId: "kali-chaudas-baps-gujarat-content-v1",
      hash: "3664aca83a774c9a1c5cde8fa23a0a8404de10512a3db46c7a9c83276999fd67",
      sourceCount: 6,
      positiveBoundary: "bapsFamilyOrMandirPrayerAndHanumanRemembranceSupported",
    },
  ])("loads the distinct mid-Diwali user-complete lane for $observanceSlug", (candidate) => {
    const guide = resolveUserCompleteRitualContent({
      observanceSlug: candidate.observanceSlug,
      regionCode: candidate.regionCode,
      traditionCode: candidate.traditionCode,
      languageCode: "en",
    });
    expect(guide).toMatchObject({
      kind: "user_complete_observance_lane",
      evidence: { packId: candidate.packId, packFileSha256: candidate.hash },
      userCompleteContext: { classification: "user_complete_lane" },
    });
    expect(guide?.boundaries[candidate.positiveBoundary]).toBe(true);
    expect(guide?.boundaries.fireworksRequiredOrRecommended).toBe(false);
    expect(guide?.tiers.map((tier) => tier.tier)).toEqual(["minimum", "standard", "elaborate"]);
    expect(guide?.userCompleteContext?.originNarratives.length).toBeGreaterThan(0);
    expect(guide?.userCompleteContext?.typicalPractices.length).toBeGreaterThan(0);
    expect(guide?.userCompleteContext?.variants.length).toBeGreaterThan(0);
    expect(guide?.evidence.sources).toHaveLength(candidate.sourceCount);
  });

  it("does not cross-wire the three distinct mid-Diwali lanes", () => {
    expect(resolveUserCompleteRitualContent({ observanceSlug: "naraka-chaturdashi", regionCode: "south-india", traditionCode: "smarta-south-india", languageCode: "en" })).toBeNull();
    expect(resolveUserCompleteRitualContent({ observanceSlug: "tamil-deepavali-naraka-chaturdashi", regionCode: "west-india", traditionCode: "smarta-west-india", languageCode: "en" })).toBeNull();
    expect(resolveUserCompleteRitualContent({ observanceSlug: "kali-chaudas-baps", regionCode: "west-india", traditionCode: "smarta-west-india", languageCode: "en" })).toBeNull();
  });

  it.each([
    {
      observanceSlug: "bali-pratipada",
      regionCode: "west-india",
      traditionCode: "smarta-west-india",
      packId: "bali-pratipada-maharashtra-content-v1",
      hash: "b88f9a4ff1405af249214168ac6a42f05a0bb2d16df3f8651bf4769f94eb69c6",
      sourceCount: 3,
      positiveBoundary: "kingBaliRemembranceAndFamilyTimeSupported",
      deniedBoundary: "govardhanaOrAnnakutMerged",
    },
    {
      observanceSlug: "govardhan-puja",
      regionCode: "iskcon-india",
      traditionCode: "vaishnava-iskcon",
      packId: "govardhana-puja-iskcon-content-v1",
      hash: "68277ffa142a607e50218670e942efdaea87264d550b0490b0dc583b2177a950",
      sourceCount: 4,
      positiveBoundary: "prayerKirtanSimpleVegetarianOfferingSupported",
      deniedBoundary: "bapsNewYearSequenceMerged",
    },
    {
      observanceSlug: "bhai-dooj",
      regionCode: "north-india",
      traditionCode: "smarta-north-india",
      packId: "bhai-dooj-north-india-content-v1",
      hash: "330951e8a98bd38c3eb04dac43d2e232b18891f8bfc54e4536b6fb7bd849bff2",
      sourceCount: 4,
      positiveBoundary: "siblingTikaPrayerAndSharedFoodSupported",
      deniedBoundary: "bhauBeejBhaiPhotaBhaiTikaOrBiharYamaDvitiyaCompleted",
    },
  ])("loads the distinct post-Diwali user-complete lane for $observanceSlug", (candidate) => {
    const guide = resolveUserCompleteRitualContent({
      observanceSlug: candidate.observanceSlug,
      regionCode: candidate.regionCode,
      traditionCode: candidate.traditionCode,
      languageCode: "en",
    });
    expect(guide).toMatchObject({
      kind: "user_complete_observance_lane",
      evidence: { packId: candidate.packId, packFileSha256: candidate.hash },
      userCompleteContext: { classification: "user_complete_lane" },
    });
    expect(guide?.boundaries[candidate.positiveBoundary]).toBe(true);
    expect(guide?.boundaries[candidate.deniedBoundary]).toBe(false);
    expect(guide?.tiers.map((tier) => tier.tier)).toEqual(["minimum", "standard", "elaborate"]);
    expect(guide?.userCompleteContext?.originNarratives.length).toBeGreaterThan(0);
    expect(guide?.userCompleteContext?.typicalPractices.length).toBeGreaterThan(0);
    expect(guide?.userCompleteContext?.variants.length).toBeGreaterThanOrEqual(2);
    expect(guide?.evidence.sources).toHaveLength(candidate.sourceCount);
  });

  it("does not cross-wire the three post-Diwali lanes", () => {
    expect(resolveUserCompleteRitualContent({ observanceSlug: "bali-pratipada", regionCode: "iskcon-india", traditionCode: "vaishnava-iskcon", languageCode: "en" })).toBeNull();
    expect(resolveUserCompleteRitualContent({ observanceSlug: "govardhan-puja", regionCode: "west-india", traditionCode: "smarta-west-india", languageCode: "en" })).toBeNull();
    expect(resolveUserCompleteRitualContent({ observanceSlug: "bhai-dooj", regionCode: "bengal", traditionCode: "regional-bengal", languageCode: "en" })).toBeNull();
  });

  it.each([
    {
      observanceSlug: "bengal-kali-puja",
      regionCode: "bengal",
      traditionCode: "shakta-bengal",
      packId: "bengal-kali-puja-participant-content-v1",
      hash: "11cc811ae40c803ac8b3816b156fdc957f87fafcd59fc428119a8f1a7e02ac67",
      sourceCount: 4,
      positiveBoundary: "bengalKaliPujaHomeTempleAndPublicParticipationSupported",
      deniedBoundary: "formalKaliPujaMantrasConsecrationTantricOrInitiatoryPracticeIncluded",
    },
    {
      observanceSlug: "gujarati-new-year-baps",
      regionCode: "baps-gujarat",
      traditionCode: "swaminarayan-baps",
      packId: "gujarati-new-year-baps-content-v1",
      hash: "55b4c95d6b615984edc1afe19c166661b07115a5093d81b53ea3cf10dc0e7240",
      sourceCount: 5,
      positiveBoundary: "bapsPrayerGratitudeGreetingsAndSevaSupported",
      deniedBoundary: "formalAnnakutThalAartiOrMantrasIncluded",
    },
    {
      observanceSlug: "karnataka-balipadyami",
      regionCode: "south-india",
      traditionCode: "smarta-south-india",
      packId: "balipadyami-karnataka-content-v1",
      hash: "2233bac7e6580f1fdb637d5a15a1f61ac371455aa11de27945853a830eb84b91",
      sourceCount: 4,
      positiveBoundary: "baliVamanaRemembranceGenerosityAndFamilyServiceSupported",
      deniedBoundary: "clayOrCowDungBaliRepresentationRequired",
    },
  ])("loads the distinct regional Diwali expansion lane for $observanceSlug", (candidate) => {
    const guide = resolveUserCompleteRitualContent({
      observanceSlug: candidate.observanceSlug,
      regionCode: candidate.regionCode,
      traditionCode: candidate.traditionCode,
      languageCode: "en",
    });
    expect(guide).toMatchObject({
      kind: "user_complete_observance_lane",
      evidence: { packId: candidate.packId, packFileSha256: candidate.hash },
      userCompleteContext: { classification: "user_complete_lane" },
    });
    expect(guide?.boundaries[candidate.positiveBoundary]).toBe(true);
    expect(guide?.boundaries[candidate.deniedBoundary]).toBe(false);
    expect(guide?.tiers.map((tier) => tier.tier)).toEqual(["minimum", "standard", "elaborate"]);
    expect(guide?.userCompleteContext?.originNarratives.length).toBeGreaterThan(0);
    expect(guide?.userCompleteContext?.typicalPractices.length).toBeGreaterThan(0);
    expect(guide?.userCompleteContext?.variants.length).toBeGreaterThanOrEqual(3);
    expect(guide?.evidence.sources).toHaveLength(candidate.sourceCount);
  });

  it("does not cross-wire the three regional Diwali expansion lanes", () => {
    expect(resolveUserCompleteRitualContent({ observanceSlug: "bengal-kali-puja", regionCode: "west-india", traditionCode: "smarta-west-india", languageCode: "en" })).toBeNull();
    expect(resolveUserCompleteRitualContent({ observanceSlug: "gujarati-new-year-baps", regionCode: "south-india", traditionCode: "smarta-south-india", languageCode: "en" })).toBeNull();
    expect(resolveUserCompleteRitualContent({ observanceSlug: "karnataka-balipadyami", regionCode: "baps-gujarat", traditionCode: "swaminarayan-baps", languageCode: "en" })).toBeNull();
  });

  it.each([
    {
      observanceSlug: "bandi-chhor-divas-sgpc",
      regionCode: "sikh-punjab",
      traditionCode: "sikh-sgpc",
      packId: "bandi-chhor-sgpc-participant-content-v1",
      hash: "2b8781a980a7e8aceb57a1e25a8ec2b6cf08a3d9a06cb6a2963d6d693c98e085",
      sourceCount: 4,
    },
    {
      observanceSlug: "ahoi-ashtami-north-india",
      regionCode: "north-india",
      traditionCode: "smarta-north-india",
      packId: "ahoi-ashtami-north-india-household-content-v1",
      hash: "8b3b66c32ff3bd05e32c3cb42573a7ededd23abbc08b8b24d7836dad75ee4ec7",
      sourceCount: 4,
    },
  ])("loads the bounded current-contract lane for $observanceSlug", (candidate) => {
    const guide = resolveUserCompleteRitualContent({
      observanceSlug: candidate.observanceSlug,
      regionCode: candidate.regionCode,
      traditionCode: candidate.traditionCode,
      languageCode: "en",
    });
    expect(guide).toMatchObject({
      kind: "user_complete_observance_lane",
      evidence: { packId: candidate.packId, packFileSha256: candidate.hash },
      userCompleteContext: { classification: "user_complete_lane" },
    });
    expect(guide?.evidence.sources).toHaveLength(candidate.sourceCount);
  });

  it.each([
    {
      observanceSlug: "karwa-chauth",
      regionCode: "north-india",
      traditionCode: "smarta-north-india",
      packId: "karwa-chauth-north-india-household-content-v1",
      hash: "639350ff57d30ca4f57092844202208b7a62d81e906c0d503fa724dd94dfd53d",
      sourceCount: 3,
      positiveBoundary: "ordinaryKarwaChauthHouseholdSequenceSupported",
      deniedBoundary: "womenOnlyParticipationUniversalized",
    },
    {
      observanceSlug: "chhath-puja-sandhya-arghya",
      regionCode: "bihar-purvanchal",
      traditionCode: "surya-chhath-bihar-purvanchal",
      packId: "chhath-bihar-purvanchal-participant-content-v1",
      hash: "4b2a048f462ee42bdf9b06eab5948904d9963a347a3b25f136bc3f5ef936b38a",
      sourceCount: 5,
      positiveBoundary: "fourDayChhathSequenceIncluded",
      deniedBoundary: "fastingOrNirjalaRegimenPrescribed",
    },
    {
      observanceSlug: "dev-deepawali-varanasi",
      regionCode: "kashi-varanasi",
      traditionCode: "regional-kashi-varanasi",
      packId: "dev-deepawali-varanasi-participant-content-v1",
      hash: "a7c036de4811cdcc02e7bcc324eebe36d605471d2b2f8ec0a4c5e103e632a92f",
      sourceCount: 5,
      positiveBoundary: "varanasiFullMoonGhatLightAndStoryVariantSupported",
      deniedBoundary: "ritualBathingOrWaterEntryInstructed",
    },
  ])("loads the exact autumn observance lane for $observanceSlug", (candidate) => {
    const guide = resolveUserCompleteRitualContent({
      observanceSlug: candidate.observanceSlug,
      regionCode: candidate.regionCode,
      traditionCode: candidate.traditionCode,
      languageCode: "en",
    });
    expect(guide).toMatchObject({
      kind: "user_complete_observance_lane",
      evidence: { packId: candidate.packId, packFileSha256: candidate.hash },
      userCompleteContext: { classification: "user_complete_lane" },
    });
    expect(guide?.boundaries[candidate.positiveBoundary]).toBe(true);
    expect(guide?.boundaries[candidate.deniedBoundary]).toBe(false);
    expect(guide?.tiers.map((tier) => tier.tier)).toEqual(["minimum", "standard", "elaborate"]);
    expect(guide?.userCompleteContext?.originNarratives.length).toBeGreaterThan(0);
    expect(guide?.userCompleteContext?.typicalPractices.length).toBeGreaterThan(0);
    expect(guide?.userCompleteContext?.variants.length).toBeGreaterThan(0);
    expect(guide?.evidence.sources).toHaveLength(candidate.sourceCount);
  });

  it("does not cross-wire Karwa Chauth, Chhath, and Varanasi Dev Deepawali contexts", () => {
    expect(resolveUserCompleteRitualContent({ observanceSlug: "karwa-chauth", regionCode: "bihar-purvanchal", traditionCode: "surya-chhath-bihar-purvanchal", languageCode: "en" })).toBeNull();
    expect(resolveUserCompleteRitualContent({ observanceSlug: "chhath-puja-sandhya-arghya", regionCode: "north-india", traditionCode: "smarta-north-india", languageCode: "en" })).toBeNull();
    expect(resolveUserCompleteRitualContent({ observanceSlug: "dev-deepawali-varanasi", regionCode: "north-india", traditionCode: "smarta-north-india", languageCode: "en" })).toBeNull();
  });

  it.each([
    ["north-india", "smarta-north-india"],
    ["west-india", "smarta-west-india"],
  ])("loads the Hartalika participant lane for the exact %s context", (regionCode, traditionCode) => {
    const guide = resolveUserCompleteRitualContent({ observanceSlug: "hartalika-teej", regionCode, traditionCode, languageCode: "en" });
    expect(guide).toMatchObject({
      kind: "user_complete_observance_lane",
      evidence: {
        packId: "hartalika-teej-north-west-india-participant-content-v1",
        packFileSha256: "da872bebfcfb81a09ecd05eaaaf67454b1de88dfeee0bd2ca7018b77ada19503",
      },
      boundaries: {
        parvatiShivaRemembranceStorySongPrayerAndServiceSupported: true,
        materialFreeAndNonFastingFormSupported: true,
        formalSankalpaKathaPujaMantraOfferingOrClosePrescribed: false,
        gowriHabbaOrOtherTeejFestivalsMerged: false,
      },
    });
    expect(guide?.userCompleteContext?.originNarratives).toHaveLength(1);
    expect(guide?.userCompleteContext?.typicalPractices).toHaveLength(2);
    expect(guide?.userCompleteContext?.variants).toHaveLength(2);
    expect(guide?.evidence.sources).toHaveLength(7);
  });

  it("does not widen Hartalika participation to South India or mismatched region/tradition pairs", () => {
    expect(resolveUserCompleteRitualContent({ observanceSlug: "hartalika-teej", regionCode: "south-india", traditionCode: "smarta-south-india", languageCode: "en" })).toBeNull();
    expect(resolveUserCompleteRitualContent({ observanceSlug: "hartalika-teej", regionCode: "north-india", traditionCode: "smarta-west-india", languageCode: "en" })).toBeNull();
  });

  it("loads the current-contract ISKCON Radha Ashtami lane without widening it", () => {
    const guide = resolveUserCompleteRitualContent({
      observanceSlug: "radha-ashtami-iskcon",
      regionCode: "iskcon-india",
      traditionCode: "vaishnava-iskcon",
      languageCode: "en",
    });
    expect(guide).toMatchObject({
      kind: "user_complete_observance_lane",
      evidence: {
        packId: "radha-ashtami-iskcon-participant-content-v1",
        packFileSha256: "2a5351b8aab4b0346299d2104b506fd58d243011322f5f1712db00c23d06d455",
      },
      boundaries: {
        radharaniAppearanceAttributableTeachingSongPrayerKirtanAndSevaSupported: true,
        officialIskconTempleProgrammeParticipationSupported: true,
        materialFreeAndNonFastingHomeFormSupported: true,
        fastFoodDietaryOrMedicalGuidanceGiven: false,
        abhishekaAratiHomaDeityDressingOfferingKalashaFlowerOrFormalPujaPrescribed: false,
        allRadhaAshtamiTraditionsComplete: false,
      },
    });
    expect(guide?.tiers.map((tier) => tier.tier)).toEqual(["minimum", "standard", "elaborate"]);
    expect(guide?.userCompleteContext?.originNarratives).toHaveLength(1);
    expect(guide?.userCompleteContext?.typicalPractices).toHaveLength(2);
    expect(guide?.userCompleteContext?.variants).toHaveLength(2);
    expect(guide?.evidence.sources).toHaveLength(6);
    expect(resolveUserCompleteRitualContent({ observanceSlug: "radha-ashtami-iskcon", regionCode: "north-india", traditionCode: "smarta-north-india", languageCode: "en" })).toBeNull();
  });

  it("loads the current-contract Gita Jayanti reading lane without turning it into Ekadashi vrata guidance", () => {
    const guide = resolveUserCompleteRitualContent({
      observanceSlug: "mokshada-ekadashi",
      regionCode: "north-india",
      traditionCode: "smarta-north-india",
      languageCode: "en",
    });
    expect(guide).toMatchObject({
      kind: "user_complete_observance_lane",
      evidence: {
        packId: "gita-jayanti-reading-reflection-content-v1",
        packFileSha256: "896b5bd64f7c947832d970188ba1eb6b1e82f11523047cf1b021bf2dc7bb625b",
        sourceTextReturnedByApi: false,
      },
      boundaries: {
        attributableGitaReadingReflectionAndActionSupported: true,
        sourceVerseTranslationCommentaryAndApplicationSeparated: true,
        officialGitaJayantiProgrammeParticipationSupported: true,
        materialFreeAndNonFastingGitaStudySupported: true,
        mokshadaEkadashiFastParanaOrTempleVidhiIncluded: false,
        oneTranslationCommentaryOrApplicationUniversalized: false,
        completeGitaRecitationRequired: false,
        sourceTextReturnedOrRepublished: false,
      },
    });
    expect(guide?.tiers.map((tier) => [tier.tier, tier.estimatedMinutes])).toEqual([["minimum", 10], ["standard", 30], ["elaborate", 90]]);
    expect(guide?.userCompleteContext?.originNarratives).toHaveLength(1);
    expect(guide?.userCompleteContext?.typicalPractices).toHaveLength(2);
    expect(guide?.userCompleteContext?.variants).toHaveLength(3);
    expect(guide?.evidence.sources).toHaveLength(8);
    expect(resolveUserCompleteRitualContent({ observanceSlug: "mokshada-ekadashi", regionCode: "west-india", traditionCode: "smarta-north-india", languageCode: "en" })).toBeNull();
  });

  it("keeps the Jain umbrella companion outside user-complete ritual resolution", () => {
    const vivaha = resolveUserCompleteRitualContent({
      observanceSlug: "vivaha-panchami",
      regionCode: "north-india",
      traditionCode: "smarta-north-india",
      languageCode: "en",
    });
    expect(vivaha).toMatchObject({
      kind: "user_complete_observance_lane",
      evidence: {
        packId: "vivaha-panchami-north-india-content-v1",
        packFileSha256: "6f2a7c281c31d395fd394e9e7b31ec812355343c75a46fae783285c7e325abac",
      },
      boundaries: {
        sourceBoundedRamaSitaMarriageRemembranceAndPracticalReflectionSupported: true,
        janakpurAyodhyaAndOrchhaContextsKeptDistinct: true,
        formalWeddingReenactmentPujaMantraOfferingProcessionOrVowPrescribed: false,
        marriageSpouseFertilityProgenyProsperityMeritOrOtherOutcomeGuaranteed: false,
        oneRamayanaEditionStoryInterpretationOrPracticeClaimedUniversal: false,
      },
    });
    expect(vivaha?.tiers.map((tier) => [tier.tier, tier.estimatedMinutes])).toEqual([["minimum", 10], ["standard", 30], ["elaborate", 60]]);
    expect(vivaha?.evidence.sources).toHaveLength(5);
    expect(resolveUserCompleteRitualContent({ observanceSlug: "vivaha-panchami", regionCode: "west-india", traditionCode: "smarta-west-india", languageCode: "en" })).toBeNull();

    const ekadashi = resolveUserCompleteRitualContent({
      observanceSlug: "devutthana-ekadashi",
      regionCode: "north-india",
      traditionCode: "smarta-north-india",
      languageCode: "en",
    });
    expect(ekadashi).toMatchObject({
      kind: "user_complete_observance_lane",
      evidence: {
        packId: "ekadashi-recurring-devotional-content-v1",
        packFileSha256: "5aa329200dab91dd2623064ce585dc53ae4cbba110a6fd4a739b7c745d77caf8",
      },
      boundaries: {
        recurringSevenNamedEkadashisSupported: true,
        smartaAndIskconCalendarLanesKeptSeparate: true,
        materialFreeAndNonFastingEkadashiFormSupported: true,
        foodOrDietaryRulesGiven: false,
        smartaParanaServed: false,
        namedEkadashiMeaningsStoriesOrOutcomesUniversalized: false,
      },
    });
    expect(ekadashi?.evidence.sources).toHaveLength(6);
    expect(resolveUserCompleteRitualContent({ observanceSlug: "devutthana-ekadashi", regionCode: "north-india", traditionCode: "vaishnava-iskcon", languageCode: "en" })).toBeNull();

    const janmashtami = resolveUserCompleteRitualContent({
      observanceSlug: "krishna-janmashtami-iskcon",
      regionCode: "iskcon-india",
      traditionCode: "vaishnava-iskcon",
      languageCode: "en",
    });
    expect(janmashtami).toMatchObject({
      kind: "user_complete_observance_lane",
      evidence: {
        packId: "krishna-janmashtami-smarta-iskcon-content-v1",
        packFileSha256: "bbc353da9c309fb851ecc704f83e1dbc758a73a487337603c8adbfe2aadf3126",
      },
      boundaries: {
        smartaAndIskconLaneNotesSeparate: true,
        sharedJanmashtamiDevotionalCoreSupported: true,
        smartaAndIskconRulesEquated: false,
        dahiHandiParticipationOrHumanPyramidInstructed: false,
      },
    });
    expect(resolveUserCompleteRitualContent({ observanceSlug: "krishna-janmashtami-iskcon", regionCode: "north-india", traditionCode: "smarta-north-india", languageCode: "en" })).toBeNull();
    expect(resolveUserCompleteRitualContent({ observanceSlug: "krishna-janmashtami-smarta", regionCode: "iskcon-india", traditionCode: "vaishnava-iskcon", languageCode: "en" })).toBeNull();

    const tulasiGeneral = resolveUserCompleteRitualContent({ observanceSlug: "tulasi-vivah-dwadashi", regionCode: "north-india", traditionCode: "smarta-north-india", languageCode: "en" });
    const tulasiBaps = resolveUserCompleteRitualContent({ observanceSlug: "tulsi-vivah-baps-samapt", regionCode: "baps-gujarat", traditionCode: "swaminarayan-baps", languageCode: "en" });
    expect(tulasiGeneral).toMatchObject({
      title: "Tulasi Vivah at home",
      evidence: { packId: "tulasi-vivah-general-baps-content-v1", packFileSha256: "8702467cf911baa47decaebe8614bfcf52e208b1d1c2062f486512bed2914f17" },
      boundaries: { generalAndBapsLanesSeparate: true, plantFreeAndFlameFreeFallbackSupported: true, outcomeGuaranteed: false },
    });
    expect(tulasiBaps).toMatchObject({ title: "BAPS Tulsi Vivah participation", companionToObservanceSlug: "tulsi-vivah-baps-samapt" });
    expect(tulasiBaps?.familyPracticeNote).toContain("official calendar fixes the beginning and close");
    expect(resolveUserCompleteRitualContent({ observanceSlug: "tulasi-vivah-dwadashi", regionCode: "baps-gujarat", traditionCode: "swaminarayan-baps", languageCode: "en" })).toBeNull();

    const monday = resolveUserCompleteRitualContent({ observanceSlug: "weekday-somavara", regionCode: "west-india", traditionCode: "smarta-west-india", languageCode: "en" });
    const tuesday = resolveUserCompleteRitualContent({ observanceSlug: "weekday-mangalavara", regionCode: "west-india", traditionCode: "smarta-west-india", languageCode: "en" });
    expect(monday).toMatchObject({
      title: "Monday / Somavara: an optional weekly practice",
      evidence: { packId: "weekday-practice-west-india-content-v1", packFileSha256: "4f6dafa494f30709f928a10a5f5109cd72dd889d803ef6245d30dbe1342c090f" },
      boundaries: { allSevenVarasIncluded: true, astrologicalRemediesPrescribed: false, oneUniversalWeekdayMappingClaimed: false },
    });
    expect(tuesday?.title).toBe("Tuesday / Mangalavara: an optional weekly practice");
    expect(tuesday?.tiers[0].steps[0].instruction).toContain("Ganapati or Gauri");
    expect(tuesday?.tiers[0].steps[0].instruction).toContain("Hanuman");
    expect(resolveUserCompleteRitualContent({ observanceSlug: "weekday-mangalavara", regionCode: "north-india", traditionCode: "smarta-north-india", languageCode: "en" })).toBeNull();

    const jainDiwali = resolveUserCompleteRitualContent({ observanceSlug: "jain-diwali-umbrella", regionCode: "jain-india", traditionCode: "jain-umbrella", languageCode: "en" });
    expect(jainDiwali).toMatchObject({
      title: "Jain Diwali lay remembrance",
      kind: "user_complete_observance_lane",
      evidence: {
        packId: "jain-diwali-lay-remembrance-content-v1",
        packFileSha256: "1b7224350413e7a7cf5938dfeabe7d2a7f246ec2043a726bf1ea24404a4b14a9",
      },
      boundaries: {
        jainLayRemembranceActionable: true,
        formalPujaMantraStotraScriptureOrPratikramanIncluded: false,
        fastAusterityNirvanLadooOrTempleProcedurePrescribed: false,
        jainSectLanesEquated: false,
      },
    });
    expect(jainDiwali?.tiers.map((tier) => tier.tier)).toEqual(["minimum", "standard", "elaborate"]);
    expect(jainDiwali?.userCompleteContext?.safetyAndBoundaries.join(" ")).toContain("non-initiatory lay remembrance");
  });

  it("loads all four recurring Sankashti lanes with the source-bounded Ganesha reading", () => {
    for (const observanceSlug of ["sankashti-chaturthi-2026-09", "sankashti-chaturthi-2026-10", "sankashti-chaturthi-2026-11", "sankashti-chaturthi-2026-12"]) {
      const guide = resolveUserCompleteRitualContent({ observanceSlug, regionCode: "west-india", traditionCode: "smarta-west-india", languageCode: "en" });
      expect(guide).toMatchObject({
        kind: "user_complete_observance_lane",
        evidence: { packId: "sankashti-chaturthi-west-india-content-v1", packFileSha256: "4515a475d9fcfcfb6435e2dc9a2a5425e5c54d2d9ee30e8dd61329daed661375" },
        companionReading: { evidence: { packFileSha256: "492bafe94124f81de32acee6329b798fe09970eace160bdd1a9db646d5959d2d" } },
        boundaries: {
          fourLaunchMonthSankashtiLanesSupported: true,
          sourceBoundedGaneshaCompanionReadingIncluded: true,
          runtimeLocationSpecificMoonriseRequired: true,
          providerCityMoonriseReusedForUserLocation: false,
          oneMonthlyNameKathaOrPujaSequenceUniversalized: false,
          ganeshChaturthiOrKarwaChauthMerged: false,
        },
      });
      expect(guide?.tiers.map((tier) => tier.tier)).toEqual(["minimum", "standard", "elaborate"]);
      expect(guide?.evidence.sources).toHaveLength(5);
    }
    expect(resolveUserCompleteRitualContent({ observanceSlug: "sankashti-chaturthi-2026-09", regionCode: "north-india", traditionCode: "smarta-north-india", languageCode: "en" })).toBeNull();
  });

  it("loads all four Masika Durgashtami lanes without importing Shardiya or Bengal rites", () => {
    for (const observanceSlug of ["masika-durgashtami-2026-09", "masika-durgashtami-2026-10", "masika-durgashtami-2026-11", "masika-durgashtami-2026-12"]) {
      const guide = resolveUserCompleteRitualContent({ observanceSlug, regionCode: "north-india", traditionCode: "smarta-north-india", languageCode: "hi" });
      expect(guide).toMatchObject({
        kind: "user_complete_observance_lane",
        evidence: { packId: "masika-durgashtami-north-west-content-v1", packFileSha256: "e8c24d5732f2a8371ccc2c08e2643920e3ca8af3313ff722eaba19989ea95d83" },
        companionReading: null,
        boundaries: {
          fourMonthCalendarLaneAndSourceLabelledDurgaRemembranceSupported: true,
          materialFreeAndNonFastingMonthlyDurgaFormSupported: true,
          formalPujaMantraImageOfferingAartiChandiRecitationOrHomaPrescribed: false,
          shardiyaMahashtamiEquatedWithEveryMonthlyAshtami: false,
          bengalDurgaPujaOrOtherRegionalAshtamiImported: false,
        },
      });
      expect(guide?.userCompleteContext?.originNarratives).toHaveLength(1);
      expect(guide?.evidence.sources).toHaveLength(5);
    }
    expect(resolveUserCompleteRitualContent({ observanceSlug: "masika-durgashtami-2026-10", regionCode: "bengal", traditionCode: "shakta-bengal", languageCode: "en" })).toBeNull();
  });

  it("loads Masika Shivaratri as a current four-month Shiva lane without annualizing it", () => {
    const guide = resolveUserCompleteRitualContent({ observanceSlug: "masika-shivaratri-2026-11", regionCode: "west-india", traditionCode: "smarta-west-india", languageCode: "en" });
    expect(guide).toMatchObject({
      kind: "user_complete_observance_lane",
      evidence: { packId: "masika-shivaratri-north-west-india-content-v1", packFileSha256: "dfe960d608286e8381bef72db95d1f75c86dfc395acdd8cda2ff8a25bf78dab2" },
      boundaries: {
        fourLaunchMonthMasikaShivaratriLanesSupported: true,
        templeLedMonthlyShivaratriPreservedAsAttributable: true,
        nightVigilRequired: false,
        paranaServed: false,
        annualMahashivaratriPracticeUniversalizedMonthly: false,
      },
    });
    expect(guide?.userCompleteContext?.originNarratives).toHaveLength(1);
    expect(guide?.evidence.sources).toHaveLength(6);
    expect(resolveUserCompleteRitualContent({ observanceSlug: "masika-shivaratri-2026-11", regionCode: "bengal", traditionCode: "shakta-bengal", languageCode: "en" })).toBeNull();
  });

  it("loads all eight Pradosha lanes while preserving paksha and living-authority boundaries", () => {
    const slugs = ["pradosha-2026-09-krishna", "pradosha-2026-09-shukla", "pradosha-2026-10-krishna", "pradosha-2026-10-shukla", "pradosha-2026-11-krishna", "pradosha-2026-11-shukla", "pradosha-2026-12-krishna", "pradosha-2026-12-shukla"];
    for (const observanceSlug of slugs) {
      const guide = resolveUserCompleteRitualContent({ observanceSlug, regionCode: "north-india", traditionCode: "smarta-north-india", languageCode: "en" });
      expect(guide).toMatchObject({
        kind: "user_complete_observance_lane",
        companionToObservanceSlug: observanceSlug,
        evidence: { packId: "pradosha-north-west-content-v1", packFileSha256: "fc8c08624c3b7048de089462e9aef23decad1773d831358d783fc4651fb24eb0" },
        boundaries: {
          eightLaunchWindowPradoshaLanesSupported: true,
          krishnaAndShuklaPakshaPradoshaKeptDistinct: true,
          rudrabhishekamLingamNandiMantraOfferingAartiOrPradakshinaPrescribed: false,
          pujaMuhurtaOrParanaServed: false,
          weekdayPlanetaryRemedyOrSpecialOutcomePrescribed: false,
        },
      });
      expect(guide?.evidence.sources).toHaveLength(6);
    }
    expect(resolveUserCompleteRitualContent({ observanceSlug: slugs[0], regionCode: "south-india", traditionCode: "smarta-south-india", languageCode: "en" })).toBeNull();
  });

  it("loads distinct generic Purnima and Amavasya localized lanes from the current contract", () => {
    const purnima = resolveUserCompleteRitualContent({ observanceSlug: "kartika-purnima", regionCode: "north-india", traditionCode: "smarta-north-india", languageCode: "en" });
    const amavasya = resolveUserCompleteRitualContent({ observanceSlug: "ashwina-amavasya", regionCode: "west-india", traditionCode: "smarta-west-india", languageCode: "hi" });
    expect(purnima).toMatchObject({ title: "Purnima calendar-day companion", evidence: { packId: "purnima-amavasya-north-west-india-content-v1", packFileSha256: "dc4cf0acfb4d49c901ae023cd9ae05e6ba6b9e2b3b09839049cda75fb0ea27d2" }, boundaries: { purnimaAndAmavasyaGuidesDistinct: true, margashirshaPurnimaPromoted: false } });
    expect(amavasya?.title).toContain("अमावस्या");
    expect(amavasya?.boundaries.shraddhaTarpanDarshaOrAncestorRitePrescribed).toBe(false);
    expect(resolveUserCompleteRitualContent({ observanceSlug: "margashirsha-purnima", regionCode: "north-india", traditionCode: "smarta-north-india", languageCode: "en" })).toBeNull();
  });

  it("loads the exact Pitru Paksha label while keeping formal Shraddha with living authority", () => {
    const guide = resolveUserCompleteRitualContent({ observanceSlug: "ashtami-shraddha", regionCode: "north-india", traditionCode: "smarta-north-india", languageCode: "en" });
    expect(guide).toMatchObject({
      kind: "user_complete_observance_lane",
      companionToObservanceSlug: "ashtami-shraddha",
      evidence: {
        packId: "pitru-paksha-delhi-remembrance-content-v1",
        packFileSha256: "044c4ff8163a6203628425db1bdafc1d6b7b372a74882885fbb1efb987a032e0",
      },
      boundaries: {
        nineteenPitruPakshaCalendarLabelsSupported: true,
        personalRemembranceAndFormalPracticePreparationSupported: true,
        personalDeathTithiPerformerOrFormalShraddhaProcedureResolved: false,
        formalShraddhaTarpanaPindaMantraFoodDonationOrTimingPrescribed: false,
        tamilMahalayaAmavasaiTharpanamMerged: false,
      },
    });
    expect(guide?.familyPracticeNote).toContain("3 October 2026");
    expect(guide?.tiers.map((tier) => [tier.tier, tier.estimatedMinutes])).toEqual([["minimum", 10], ["standard", 25], ["elaborate", 60]]);
    expect(guide?.evidence.sources).toHaveLength(7);
    expect(resolveUserCompleteRitualContent({ observanceSlug: "ashtami-shraddha", regionCode: "south-india", traditionCode: "smarta-south-india", languageCode: "en" })).toBeNull();
  });

  it("fails closed outside the exact region, tradition, and observance", () => {
    expect(resolveUserCompleteRitualContent({ ...supportedContext, regionCode: "north-india", languageCode: "en" })).toBeNull();
    expect(resolveUserCompleteRitualContent({ ...supportedContext, traditionCode: "smarta-north-india", languageCode: "en" })).toBeNull();
    expect(resolveUserCompleteRitualContent({ ...supportedContext, observanceSlug: "bengal-durga-puja-campaign", regionCode: "north-india", languageCode: "en" })).toBeNull();
  });
  it("loads the bounded Karnataka Saraswati/Ayudha lane without turning machinery or institutional rites into app instructions", () => {
    const guide = resolveUserCompleteRitualContent({ observanceSlug: "karnataka-saraswati-ayudha-puja", regionCode: "south-india", traditionCode: "smarta-south-india", languageCode: "en" });
    expect(guide).toMatchObject({
      kind: "user_complete_observance_lane",
      companionToObservanceSlug: "karnataka-saraswati-ayudha-puja",
      evidence: { packId: "karnataka-saraswati-ayudha-puja-content-v1", packFileSha256: "f574fac7744f47c3d712426f243526c6de0dcaeb4edb5e64fe4174fa31061c7b" },
      userCompleteContext: { timing: { decisionRuleId: "devam-karnataka-mahanavami-ayudha-puja-official-2026-v1", liveScheduleRequired: true } },
      boundaries: { exactNamedParticipantLaneComplete: true, priestLedVidhiIncluded: false, preciseMuhurtaCalculated: false },
    });
    expect(guide?.summary).toContain("20 October");
    expect(guide?.tiers.map((tier) => tier.tier)).toEqual(["minimum", "standard", "elaborate"]);
    expect(guide?.userCompleteContext?.originNarratives).toHaveLength(2);
    expect(guide?.userCompleteContext?.typicalPractices).toHaveLength(2);
    expect(guide?.userCompleteContext?.variants).toHaveLength(4);
    expect(guide?.userCompleteContext?.safetyAndBoundaries.join(" ")).toContain("live machinery");
    expect(guide?.evidence.sources).toHaveLength(6);
    expect(resolveUserCompleteRitualContent({ observanceSlug: "karnataka-saraswati-ayudha-puja", regionCode: "north-india", traditionCode: "smarta-north-india", languageCode: "en" })).toBeNull();
    expect(resolveUserCompleteRitualContent({ observanceSlug: "karnataka-saraswati-ayudha-puja", regionCode: "south-india", traditionCode: "smarta-south-india", languageCode: "hi" })?.summary).toContain("20 अक्टूबर");
  });
});

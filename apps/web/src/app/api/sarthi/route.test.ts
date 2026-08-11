import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
import { POST } from "./route";

function request(body: unknown) {
  return new Request("http://localhost/api/sarthi", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/sarthi", () => {
  it("answers from the bounded Ramcharitmanas edition when its Atlas doorway is open", async () => {
    const response = await POST(request({
      message: "Tell me about Ramcharitmanas",
      context: { languageCode: "en", atlasNodeSlug: "ramcharitmanas" },
    }));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result).toMatchObject({
      ok: true,
      mode: "deterministic_source_bounded_preview",
      alternativesAvailable: true,
    });
    expect(result.answer).toContain("all 813 proofread or validated beta pages");
    expect(result.answer).toContain("not the complete Ramcharitmanas tradition");
    expect(result.citations).toHaveLength(7);
  });

  it("returns concise Bengal Vishwakarma workplace guidance when the regional context is known", async () => {
    const response = await POST(request({
      message: "What should I do for Vishwakarma Puja at work in Kolkata?",
      context: { languageCode: "en", regionCode: "bengal", traditionCode: "regional-bengal" },
    }));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result).toMatchObject({
      ok: true,
      mode: "contextual_ritual_guidance",
      practiceGuide: {
        companionToObservanceSlug: "vishwakarma-puja-bengal",
        evidence: {
          packFileSha256: "1d57c055654685481e90f4e8dc190385adfa06486313f8a844bfcfd6840b4b39",
        },
      },
    });
    expect(result.answer).toContain("17 September 2026");
    expect(result.followUpQuestion).toContain("shutdown and restart");
  });

  it("asks for regional identity before applying the Bengal Vishwakarma lane", async () => {
    const response = await POST(request({ message: "What should I do for Vishwakarma Puja?" }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification" });
    expect(result.followUpQuestion).toContain("Which city or region");
    expect(result.practiceGuide).toBeUndefined();
  });

  it.each([
    ["What should I do for Kanya Sankranti?", "kanya-sankranti", "17 September 2026"],
    ["What should I do for Tula Sankranti?", "tula-sankranti", "17 October 2026"],
    ["What should I do for Vrishchika Sankranti?", "vrishchika-sankranti", "16 November 2026"],
    ["What should I do for Dhanu Sankranti?", "dhanu-sankranti", "16 December 2026"],
  ])("returns bounded generic Sankranti guidance for %s", async (message, observanceSlug, expectedDate) => {
    const response = await POST(request({ message, context: { languageCode: "en" } }));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result).toMatchObject({
      ok: true,
      mode: "contextual_ritual_guidance",
      practiceGuide: {
        companionToObservanceSlug: observanceSlug,
        evidence: { packFileSha256: "7f76eaabbf5b5cf31f5bd5d612e4a08521a7adc46d6bf462e2b4c5f16640b9fa" },
      },
    });
    expect(result.answer).toContain(expectedDate);
    expect(result.followUpQuestion).toContain("Which city");
    expect(result.sourceBoundary).toContain("exact punya kala");
  });

  it("asks for the material family and calendar context before applying a Pitru Paksha lane", async () => {
    const response = await POST(request({ message: "What should I do during Pitru Paksha?" }));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result).toMatchObject({ ok: true, mode: "context_clarification" });
    expect(result.followUpQuestion).toContain("Which city and Panchang tradition");
    expect(result.practiceGuide).toBeUndefined();
    expect(result.sourceBoundary).toContain("does not decide personal ancestor applicability");
  });

  it("returns the exact Delhi Ashtami Shraddha remembrance lane without inventing formal Shraddha", async () => {
    const response = await POST(request({
      message: "What should I do on Ashtami Shraddha?",
      context: { languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" },
    }));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result).toMatchObject({
      ok: true,
      mode: "contextual_ritual_guidance",
      practiceGuide: {
        companionToObservanceSlug: "ashtami-shraddha",
        evidence: { packFileSha256: "044c4ff8163a6203628425db1bdafc1d6b7b372a74882885fbb1efb987a032e0" },
        boundaries: {
          nineteenPitruPakshaCalendarLabelsSupported: true,
          personalRemembranceAndFormalPracticePreparationSupported: true,
          personalDeathTithiPerformerOrFormalShraddhaProcedureResolved: false,
        },
      },
    });
    expect(result.practiceGuide.familyPracticeNote).toContain("3 October 2026");
    expect(result.sourceBoundary).toContain("Family and responsible religious authority control the formal rite");
  });

  it("returns a grounded Ganesha response with expandable evidence", async () => {
    const response = await POST(request({ message: "Why is Ganesha relevant when I feel blocked?" }));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result).toMatchObject({ ok: true, mode: "deterministic_source_bounded_preview" });
    expect(result.conversation).toEqual({ status: "guest_ephemeral", conversationId: null });
    expect(result.citations).toHaveLength(2);
    expect(result.citations[0].quotation).toContain("भक्तप्रत्यूहव्यूहनाशनम्");
  });

  it("fails closed for an unsupported subject", async () => {
    const response = await POST(request({ message: "Tell me about quantum physics" }));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: false, code: "NO_SUPPORTED_EVIDENCE" });
  });

  it("asks for household context before prescribing a ritual sequence", async () => {
    const response = await POST(request({
      message: "What should I do for Ganesh Chaturthi at home?",
      context: { atlasNodeSlug: "ganesha", languageCode: "en" },
    }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.answer).toContain("Which location");
    expect(result.followUpQuestion).toContain("temporary festival murti");
    expect(result.practiceGuide).toBeUndefined();
  });

  it("returns concise guidance plus the full bounded West India household guide", async () => {
    const response = await POST(request({
      message: "What should I do for Ganesh Chaturthi at home in Mumbai?",
      context: { atlasNodeSlug: "ganesha", languageCode: "en" },
    }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance" });
    expect(result.answer).toContain("10-minute simple form");
    expect(result.followUpQuestion).toContain("permanent home image");
    expect(result.practiceGuide.tiers.map((tier: { tier: string }) => tier.tier)).toEqual(["minimum", "standard", "elaborate"]);
    expect(result.practiceGuide.kind).toBe("user_complete_observance_lane");
    expect(result.practiceGuide.evidence.packFileSha256).toBe("eaa9f4576ecd9587ea205039ca633c569ad61d4f79637e8eb7774182a86163dd");
    expect(result.practiceGuide.boundaries.oneUniversalProcedureClaimed).toBe(false);
    expect(result.citations.map((citation: { sourceOrdinal: number }) => citation.sourceOrdinal)).toEqual([1, 32]);
  });

  it("returns the supported guidance in Hindi", async () => {
    const response = await POST(request({
      message: "मुंबई में गणेश चतुर्थी की पूजा कैसे करें?",
      context: { atlasNodeSlug: "ganesha", languageCode: "hi" },
    }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance" });
    expect(result.answer).toContain("10 मिनट");
    expect(result.practiceGuide.languageCode).toBe("hi");
  });

  it("asks for regional and family context before assigning a weekday practice", async () => {
    const response = await POST(request({ message: "What should I do on Tuesday?", context: { languageCode: "en" } }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.answer).toContain("varies by family and region");
    expect(result.followUpQuestion).toContain("Which region");
    expect(result.sourceBoundary).toContain("no national-exclusive deity mapping");
  });

  it("returns the bounded Tuesday options for a West India household without prescribing a fast", async () => {
    const response = await POST(request({
      message: "I live in Mumbai. What should I do on Tuesday?",
      context: { languageCode: "en", regionCode: "west-india", traditionCode: "smarta-west-india" },
    }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", citations: [] });
    expect(result.answer).toContain("Ganapati or Gauri");
    expect(result.answer).toContain("Hanuman");
    expect(result.practiceGuide.evidence.packFileSha256).toBe("4f6dafa494f30709f928a10a5f5109cd72dd889d803ef6245d30dbe1342c090f");
    expect(result.practiceGuide.boundaries).toMatchObject({
      fastingOrMedicalRegimenPrescribed: false,
      astrologicalRemediesPrescribed: false,
      oneUniversalWeekdayMappingClaimed: false,
    });
  });

  it("returns the bounded Hindi Monday practice from saved-style context", async () => {
    const response = await POST(request({
      message: "सोमवार को क्या करें?",
      context: { languageCode: "hi", regionCode: "west-india", traditionCode: "smarta-west-india" },
    }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance" });
    expect(result.answer).toContain("शिव");
    expect(result.practiceGuide.title).toContain("सोमवार");
    expect(result.practiceGuide.familyPracticeNote).toContain("उपवास, अभिषेक या औपचारिक मन्त्र");
  });

  it("asks which regional Diwali practice applies before giving a household sequence", async () => {
    const response = await POST(request({ message: "What should I do for Diwali at home?", context: { languageCode: "en" } }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.answer).toContain("vary materially by region and family");
    expect(result.followUpQuestion).toContain("Lakshmi alone or Lakshmi with Ganesha");
  });

  it("returns the bounded West India Lakshmi Puja guide without a wealth promise or guessed muhurta", async () => {
    const response = await POST(request({
      message: "I am in Mumbai. What should I do for Diwali at home?",
      context: { languageCode: "en", regionCode: "west-india", traditionCode: "smarta-west-india" },
    }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", citations: [] });
    expect(result.answer).toContain("precise muhurta");
    expect(result.practiceGuide.kind).toBe("user_complete_observance_lane");
    expect(result.practiceGuide.evidence.packFileSha256).toBe("f084c0355b1706831058e54586b8b2c782b0c24ae3f724de9494ff3c0f5d6f4f");
    expect(result.practiceGuide.userCompleteContext).toMatchObject({
      classification: "user_complete_lane",
      timing: { decisionRuleId: "nirnayasindhu-1865-kartika-amavasya-pradosha-v1" },
    });
    expect(result.practiceGuide.boundaries).toMatchObject({
      exactNamedParticipantLaneComplete: true,
      oneUniversalProcedureClaimed: false,
      allRegionalVariantsComplete: false,
    });
  });

  it("returns the separately authored Hindi Lakshmi Puja minimum form", async () => {
    const response = await POST(request({
      message: "मुंबई में दीपावली पर क्या करें?",
      context: { languageCode: "hi", regionCode: "west-india", traditionCode: "smarta-west-india" },
    }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance" });
    expect(result.answer).toContain("सटीक मुहूर्त");
    expect(result.practiceGuide.title).toContain("लक्ष्मी-पूजन");
    expect(result.practiceGuide.kind).toBe("user_complete_observance_lane");
    expect(result.practiceGuide.boundaries.oneUniversalProcedureClaimed).toBe(false);
    expect(result.practiceGuide.userCompleteContext.safetyAndBoundaries.join(" ")).toContain("उपवास");
  });

  it("asks the user's Chhath role and family lane before suggesting a sequence", async () => {
    const response = await POST(request({ message: "What should I do for Chhath?", context: { languageCode: "en" } }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.followUpQuestion).toContain("established parvaitin");
    expect(result.sourceBoundary).toContain("does not prescribe fasting or nirjala practice");
  });

  it("gives a concise Patna Chhath participation answer plus the full bounded guide", async () => {
    const response = await POST(request({
      message: "I am in Patna. What should I do for Chhath?",
      context: { languageCode: "en", regionCode: "bihar-purvanchal", traditionCode: "surya-chhath-bihar-purvanchal" },
    }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", citations: [] });
    expect(result.answer).toContain("do not begin a strict or nirjala fast on your own");
    expect(result.answer).toContain("Sandhya Arghya");
    expect(result.practiceGuide.evidence.packFileSha256).toBe("4b2a048f462ee42bdf9b06eab5948904d9963a347a3b25f136bc3f5ef936b38a");
    expect(result.practiceGuide.boundaries).toMatchObject({ fastingOrNirjalaRegimenPrescribed: false, unsafeWaterEntryInstructed: false });
  });

  it("asks which regional Govatsa tradition the family follows before applying Maharashtra Vasu Baras", async () => {
    const response = await POST(request({ message: "What should I do for Govatsa Dwadashi?", context: { languageCode: "en" } }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.answer).toContain("will not apply one Maharashtra sequence to everyone");
    expect(result.followUpQuestion).toContain("Gujarat Wagh Baras");
    expect(result.sourceBoundary).toContain("default is no-contact gratitude");
  });

  it("returns concise Mumbai Vasu Baras guidance without unsafe animal handling, fasting, or spending", async () => {
    const response = await POST(request({
      message: "I am in Mumbai. What should I do for Vasu Baras?",
      context: { languageCode: "en", regionCode: "west-india", traditionCode: "smarta-west-india" },
    }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", citations: [] });
    expect(result.answer).toContain("No live animal is needed");
    expect(result.answer).toContain("do not independently feed, touch, wash, decorate, or light a flame near an animal");
    expect(result.practiceGuide.evidence.packFileSha256).toBe("fc71846211e23905cf4d2a3449b393e999d55638a91d27ba44f88063dc1e46dc");
    expect(result.practiceGuide.boundaries).toMatchObject({ noContactFamilyFormSupported: true, animalContactFeedingWashingRestrainingOrDecorationInstructed: false, flameNearAnimalsInstructed: false, cowPurchaseSaleOrGiftRequired: false, fastOrDairyWheatAbstentionPrescribed: false, guaranteedProsperityMeritOrFamilyOutcomeClaimed: false });
  });

  it("asks which regional Naraka or Kali Chaudas tradition applies before giving a bathing sequence", async () => {
    const result = await (await POST(request({ message: "What should I do for Naraka Chaturdashi?", context: { languageCode: "en" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.answer).toContain("will not apply the Maharashtra bathing sequence to everyone");
    expect(result.followUpQuestion).toContain("Gujarat Kali Chaudas");
  });

  it("returns concise Mumbai Naraka Chaturdashi guidance without mandatory oil or fireworks", async () => {
    const result = await (await POST(request({ message: "I am in Mumbai. What should I do for Naraka Chaturdashi?", context: { languageCode: "en", regionCode: "west-india", traditionCode: "smarta-west-india" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", citations: [] });
    expect(result.answer).toContain("Use Today’s local moonrise-to-sunrise window");
    expect(result.answer).toContain("fireworks are not required");
    expect(result.practiceGuide.evidence.packFileSha256).toBe("b91fc42a80de654e23608db3d6ca3c03dab4726ca317ea3c678a1946baaffd33");
    expect(result.practiceGuide.boundaries).toMatchObject({ sesameOilOrUbtanRequiredForEveryone: false, fireworksRequiredOrRecommended: false, kaliChaudasMergedOrCompleted: false, tamilDeepavaliMergedOrCompleted: false });
  });

  it("asks which attributable Kali Chaudas lane applies before giving BAPS guidance", async () => {
    const result = await (await POST(request({ message: "What should I do for Kali Chaudas?", context: { languageCode: "en" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.answer).toContain("will not apply the BAPS lane to everyone");
    expect(result.followUpQuestion).toContain("another Gujarati family Kali Chaudas");
    expect(result.followUpQuestion).toContain("Bengal Kali Puja");
  });

  it("returns concise BAPS Gujarat Kali Chaudas participation without occult or protection claims", async () => {
    const result = await (await POST(request({
      message: "I follow BAPS in Ahmedabad. What should I do for Kali Chaudas?",
      context: { languageCode: "en", regionCode: "baps-gujarat", traditionCode: "swaminarayan-baps" },
    }))).json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", citations: [] });
    expect(result.answer).toContain("Do not add self-directed mantra, tantric, occult, or exorcistic practices");
    expect(result.answer).toContain("do not promise supernatural protection");
    expect(result.answer).toContain("Maharashtra Naraka Chaturdashi");
    expect(result.practiceGuide.evidence.packFileSha256).toBe("3664aca83a774c9a1c5cde8fa23a0a8404de10512a3db46c7a9c83276999fd67");
    expect(result.practiceGuide.boundaries).toMatchObject({
      formalHanumanPujaOrMantrasIncluded: false,
      tantricOccultOrExorcisticInstructionIncluded: false,
      evilForceRemovalOrProtectionGuaranteed: false,
    });
  });

  it("asks which Gujarati New Year tradition applies before giving BAPS Annakut guidance", async () => {
    const result = await (await POST(request({ message: "What should I do for Gujarati New Year?", context: { languageCode: "en" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.answer).toContain("will not apply a BAPS Annakut sequence to everyone");
    expect(result.followUpQuestion).toContain("another Gujarati family Bestu Varash tradition");
  });

  it("returns concise BAPS Gujarati New Year participation without a compulsory large Annakut or prosperity promise", async () => {
    const result = await (await POST(request({ message: "I follow BAPS in Ahmedabad. What should I do for Gujarati New Year?", context: { languageCode: "en", regionCode: "baps-gujarat", traditionCode: "swaminarayan-baps" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", citations: [] });
    expect(result.answer).toContain("one simple vegetarian item is enough");
    expect(result.answer).toContain("A large Annakut, formal thal or aarti, business-account rite");
    expect(result.answer).toContain("prosperity promise is not required");
    expect(result.practiceGuide.evidence.packFileSha256).toBe("55b4c95d6b615984edc1afe19c166661b07115a5093d81b53ea3cf10dc0e7240");
  });

  it("asks which Pratipada tradition applies before giving Karnataka Balipadyami guidance", async () => {
    const result = await (await POST(request({ message: "What should I do for Bali Padyami?", context: { languageCode: "en" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.answer).toContain("will not apply the Karnataka lane to everyone");
    expect(result.followUpQuestion).toContain("Maharashtra Bali Pratipada/Padwa");
    expect(result.followUpQuestion).toContain("Govardhana Puja");
  });

  it("returns concise Karnataka Balipadyami guidance without compulsory material, abhisheka, or prosperity", async () => {
    const result = await (await POST(request({ message: "I am in Bengaluru. What should I do for Bali Padyami?", context: { languageCode: "en", regionCode: "south-india", traditionCode: "smarta-south-india" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", citations: [] });
    expect(result.answer).toContain("clay or cow dung, lamps, abhisheka, mantra");
    expect(result.answer).toContain("prosperity promises are not required");
    expect(result.answer).toContain("Maharashtra Padwa, BAPS New Year, and Govardhana Puja remain separate");
    expect(result.practiceGuide.evidence.packFileSha256).toBe("2233bac7e6580f1fdb637d5a15a1f61ac371455aa11de27945853a830eb84b91");
  });

  it("asks for the Jain sect, sangh, and calendar before supplying a Diwali procedure", async () => {
    const result = await (await POST(request({ message: "What should I do for Jain Diwali?", context: { languageCode: "en" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.answer).toContain("will not merge them");
    expect(result.followUpQuestion).toContain("Shvetambar");
    expect(result.followUpQuestion).toContain("which sangh or calendar");
  });

  it("returns a concise Jain Diwali lay remembrance while preserving 9 and 10 November variants", async () => {
    const result = await (await POST(request({ message: "What should I do for Jain Diwali?", context: { languageCode: "en", regionCode: "jain-india", traditionCode: "jain-umbrella" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", citations: [] });
    expect(result.answer).toContain("ahimsa, anekantavada, restraint, non-attachment, and self-effort");
    expect(result.answer).toContain("The 9 and 10 November variants remain separate");
    expect(result.answer).not.toContain("Lakshmi");
    expect(result.practiceGuide.evidence.packFileSha256).toBe("1b7224350413e7a7cf5938dfeabe7d2a7f246ec2043a726bf1ea24404a4b14a9");
  });

  it("asks for the Sikh community setting before supplying Bandi Chhor participation guidance", async () => {
    const result = await (await POST(request({ message: "What should I do for Bandi Chhor Divas?", context: { languageCode: "en" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.answer).toContain("no single universal sequence");
    expect(result.followUpQuestion).toContain("local gurdwara, Sikh institution, family, or diaspora community");
  });

  it("returns concise Bandi Chhor guidance with the collective-freedom boundary intact", async () => {
    const result = await (await POST(request({ message: "What should I do for Bandi Chhor Divas?", context: { languageCode: "en", regionCode: "sikh-punjab", traditionCode: "sikh-sgpc" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", citations: [] });
    expect(result.answer).toContain("52 detained rulers");
    expect(result.answer).toContain("one practical act of seva or solidarity");
    expect(result.answer).not.toContain("Lakshmi");
    expect(result.practiceGuide.evidence.packFileSha256).toBe("2b8781a980a7e8aceb57a1e25a8ec2b6cf08a3d9a06cb6a2963d6d693c98e085");
  });

  it("asks for family context before supplying Ahoi Ashtami guidance", async () => {
    const result = await (await POST(request({ message: "What should I do for Ahoi Ashtami?", context: { languageCode: "en" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.answer).toContain("will not impose one generic fast or puja sequence");
    expect(result.followUpQuestion).toContain("which image, story");
  });

  it("returns concise inclusive Ahoi guidance without prescribing fasting or promising child protection", async () => {
    const result = await (await POST(request({ message: "What should I do for Ahoi Ashtami?", context: { languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", citations: [] });
    expect(result.answer).toContain("wellbeing of all children");
    expect(result.answer).toContain("Do not start, continue, or break a fast on the app's authority");
    expect(result.practiceGuide.evidence.packFileSha256).toBe("8b3b66c32ff3bd05e32c3cb42573a7ededd23abbc08b8b24d7836dad75ee4ec7");
  });

  it("asks for the family's Dhantrayodashi lane before applying one generic sequence", async () => {
    const response = await POST(request({ message: "What should I do for Dhanteras?", context: { languageCode: "en" } }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.answer).toContain("will not make shopping");
    expect(result.followUpQuestion).toContain("Yama Deepam");
  });

  it("returns concise Delhi Dhantrayodashi guidance without requiring a purchase or merging Yama Deepam", async () => {
    const response = await POST(request({
      message: "I am in Delhi. What should I do for Dhanteras?",
      context: { languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" },
    }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", citations: [] });
    expect(result.answer).toContain("No purchase is required");
    expect(result.answer).toContain("Yama Deepam remains separate");
    expect(result.practiceGuide.evidence.packFileSha256).toBe("ccf9a0f6b2c754e0ae41f6e3e0efb54bbee8c29101f3b00ae4e1bc1fab4a0bb6");
    expect(result.practiceGuide.boundaries).toMatchObject({ shoppingOrPurchaseRequired: false, financialAdviceIncluded: false, yamaDeepamMergedOrCompleted: false });
  });

  it("asks for family context before giving Yama Deepam details", async () => {
    const response = await POST(request({ message: "What should I do for Yama Deepam?", context: { languageCode: "en" } }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.answer).toContain("will not invent a direction, lamp count, or guaranteed result");
    expect(result.followUpQuestion).toContain("known Yama Deepa placement");
  });

  it("returns a concise Mumbai Yama Deepam form without merging Dhantrayodashi or guaranteeing protection", async () => {
    const response = await POST(request({
      message: "I am in Mumbai. What should I do for Yama Deepam on Dhanteras?",
      context: { languageCode: "en", regionCode: "west-india", traditionCode: "smarta-west-india" },
    }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", citations: [] });
    expect(result.answer).toContain("does not require a south-facing lamp or fixed count");
    expect(result.answer).toContain("Dhantrayodashi remains separate");
    expect(result.practiceGuide.evidence.packFileSha256).toBe("6464a3ffb480ed52806f7e5b2dd612edc8050a5280e19b0846875a526dc4c6e3");
    expect(result.practiceGuide.boundaries).toMatchObject({ southFacingDirectionRequired: false, fixedLampCountRequired: false, guaranteedProtectionOrLongevityOutcomeClaimed: false, dhantrayodashiMergedOrCompleted: false });
  });

  it("returns a concise Chennai Tamil Deepavali morning without requiring oil or fireworks", async () => {
    const response = await POST(request({ message: "I am in Chennai. What should I do for Tamil Deepavali?", context: { languageCode: "en", regionCode: "south-india", traditionCode: "smarta-south-india" } }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", citations: [] });
    expect(result.answer).toContain("Oil, new clothes, purchases, and fireworks are not requirements");
    expect(result.answer).toContain("North/West Lakshmi Puja remains separate");
    expect(result.practiceGuide.evidence.packFileSha256).toBe("ec0df3a2f4ae3817d1db145618e3500f202011303534bd3cc3a7a928a4476323");
  });

  it("asks for the living-practice setting before giving Kali Puja participation details", async () => {
    const response = await POST(request({ message: "What should I do for Kali Puja?", context: { languageCode: "en" } }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.answer).toContain("will not invent tantric, mantra, bali, fasting, or vigil instructions");
    expect(result.followUpQuestion).toContain("home puja, a temple, a public pandal");
  });

  it("returns concise Kolkata Kali Puja participation without merging Lakshmi Puja or specialist ritual", async () => {
    const response = await POST(request({ message: "I am in Kolkata. What should I do for Shyama Puja?", context: { languageCode: "en", regionCode: "bengal", traditionCode: "shakta-bengal" } }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", citations: [] });
    expect(result.answer).toContain("Do not self-start tantric practice, bali, a fast, an all-night vigil, or formal mantras");
    expect(result.answer).toContain("Lakshmi Puja remains a separate regional lane");
    expect(result.practiceGuide.evidence.packFileSha256).toBe("11cc811ae40c803ac8b3816b156fdc957f87fafcd59fc428119a8f1a7e02ac67");
  });

  it("asks which Vaishnava lane applies before giving a generic Govardhana sequence", async () => {
    const result = await (await POST(request({ message: "What should I do for Govardhan Puja?", context: { languageCode: "en" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.answer).toContain("will not turn them into one generic sequence");
    expect(result.followUpQuestion).toContain("ISKCON Vaishnava practice");
  });

  it("asks which attributable lane applies before treating Bali Pratipada as a generic shared festival", async () => {
    const result = await (await POST(request({ message: "What should I do for Bali Pratipada?", context: { languageCode: "en" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.answer).toContain("will not merge them into one generic sequence");
    expect(result.followUpQuestion).toContain("Maharashtra's Bali Pratipada/Diwali Padwa");
  });

  it("returns concise Maharashtra Bali Pratipada guidance without compulsory spouse, gift, business, or cross-tradition rites", async () => {
    const result = await (await POST(request({ message: "I am in Mumbai. What should I do for Bali Pratipada?", context: { languageCode: "en", regionCode: "west-india", traditionCode: "smarta-west-india" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", citations: [] });
    expect(result.answer).toContain("A lamp, image, spouse rite, gift, spending, business-account ritual, fast, or promised prosperity is not required");
    expect(result.answer).toContain("South Indian Balipadyami remain separate");
    expect(result.practiceGuide.evidence.packFileSha256).toBe("b88f9a4ff1405af249214168ac6a42f05a0bb2d16df3f8651bf4769f94eb69c6");
  });

  it("returns concise ISKCON Govardhana participation without requiring a large Annakut or pilgrimage", async () => {
    const result = await (await POST(request({ message: "What should I do for Govardhana Puja in ISKCON?", context: { languageCode: "en", traditionCode: "vaishnava-iskcon" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", citations: [] });
    expect(result.answer).toContain("A large Annakut, cow contact, fasting, or long parikrama is not required");
    expect(result.answer).toContain("Bali Pratipada remains separate");
    expect(result.practiceGuide.evidence.packFileSha256).toBe("68277ffa142a607e50218670e942efdaea87264d550b0490b0dc583b2177a950");
  });

  it("asks for the regional sibling lane before applying a generic Bhai Dooj sequence", async () => {
    const result = await (await POST(request({ message: "What should I do for Bhai Dooj?", context: { languageCode: "en" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.answer).toContain("regional rites are not identical");
    expect(result.followUpQuestion).toContain("Bhau Beej, Bhai Phota, Bhai Tika");
  });

  it("returns concise Delhi Bhai Dooj guidance without compulsory spending, flame, touch, or promised longevity", async () => {
    const result = await (await POST(request({ message: "I am in Delhi. What should I do for Bhai Dooj?", context: { languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", citations: [] });
    expect(result.answer).toContain("spoken or gesture-only blessing");
    expect(result.answer).toContain("A flame, gift, fast, fixed tilak, or guaranteed longevity is not required");
    expect(result.practiceGuide.evidence.packFileSha256).toBe("330951e8a98bd38c3eb04dac43d2e232b18891f8bfc54e4536b6fb7bd849bff2");
  });

  it("asks which Tulasi Vivah tradition applies before giving one generic sequence", async () => {
    const result = await (await POST(request({ message: "What should I do for Tulsi Vivah?", context: { languageCode: "en" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.followUpQuestion).toContain("BAPS Swaminarayan");
  });

  it("returns the bounded general Tulasi Vivah guide without plant harm, fasting, or outcome promises", async () => {
    const result = await (await POST(request({ message: "What should I do for Tulsi Vivah?", context: { languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", citations: [] });
    expect(result.answer).toContain("do not pluck or ingest leaves");
    expect(result.practiceGuide.evidence.packFileSha256).toBe("8702467cf911baa47decaebe8614bfcf52e208b1d1c2062f486512bed2914f17");
  });

  it("keeps the BAPS Tulsi Vivah beginning and close explicit", async () => {
    const result = await (await POST(request({ message: "What should I do for BAPS Tulsi Vivah?", context: { languageCode: "en", regionCode: "baps-gujarat", traditionCode: "swaminarayan-baps" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance" });
    expect(result.answer).toContain("begins on November 21 and closes on November 24");
    expect(result.practiceGuide.companionToObservanceSlug).toBe("tulsi-vivah-baps-begins");
  });

  it("asks which Dev Deepawali lane applies instead of merging Varanasi, BAPS, and generic Kartika Purnima", async () => {
    const result = await (await POST(request({ message: "What should I do for Dev Deepawali?", context: { languageCode: "en" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification" });
    expect(result.followUpQuestion).toContain("Varanasi/Kashi Dev Deepawali");
    expect(result.followUpQuestion).toContain("BAPS Dev Diwali");
  });

  it("returns safe bounded Varanasi Dev Deepawali guidance", async () => {
    const result = await (await POST(request({ message: "What should I do for Dev Deepawali in Varanasi?", context: { languageCode: "en", regionCode: "kashi-varanasi", traditionCode: "regional-kashi-varanasi" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", citations: [] });
    expect(result.answer).toContain("Do not enter the river, release a lamp, use fireworks, or take a boat");
    expect(result.practiceGuide.evidence.packFileSha256).toBe("a7c036de4811cdcc02e7bcc324eebe36d605471d2b2f8ec0a4c5e103e632a92f");
  });

  it("returns an attributable Gita Jayanti reading path without prescribing Ekadashi fasting", async () => {
    const result = await (await POST(request({ message: "What should I do for Gita Jayanti?", context: { languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", citations: [] });
    expect(result.answer).toContain("identify your edition, translator, and commentator");
    expect(result.practiceGuide).toMatchObject({ kind: "user_complete_observance_lane", evidence: { packFileSha256: "896b5bd64f7c947832d970188ba1eb6b1e82f11523047cf1b021bf2dc7bb625b" } });
    expect(result.practiceGuide.boundaries.fastOrDietaryRegimenPrescribed).toBe(false);
  });

  it("asks for an established tradition instead of inventing Mokshada Ekadashi fast or parana", async () => {
    const result = await (await POST(request({ message: "How should I fast and do parana for Mokshada Ekadashi?", context: { languageCode: "en" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification" });
    expect(result.answer).toContain("will not prescribe fasting or parana");
    expect(result.practiceGuide).toBeUndefined();
  });

  it("asks for regional context before giving Navaratri household guidance", async () => {
    const response = await POST(request({
      message: "What should I do for Navaratri at home?",
      context: { atlasNodeSlug: "durga", languageCode: "en" },
    }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.answer).toContain("regional traditions should not be merged");
    expect(result.followUpQuestion).toContain("Ghatasthapana");
  });

  it("returns the bounded North India Navaratri guide in conversation", async () => {
    const response = await POST(request({
      message: "I am in Delhi. What should I do for Navaratri at home?",
      context: { atlasNodeSlug: "durga", languageCode: "en" },
    }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", citations: [] });
    expect(result.answer).toContain("North India household context");
    expect(result.practiceGuide.tiers).toHaveLength(3);
    expect(result.practiceGuide.dailySequence).toHaveLength(10);
    expect(result.practiceGuide.evidence.packFileSha256).toBe("320b79891597460b33a0ee031411d805afce56b8c9b64c35a18fc2f02df250b1");
    expect(result.sourceBoundary).toContain("not Bengali Durga Puja");
  });

  it("returns the supported Navaratri guide in Hindi without prescribing an unsupervised flame", async () => {
    const response = await POST(request({
      message: "मुंबई में नवरात्रि की पूजा कैसे करें?",
      context: { atlasNodeSlug: "durga", languageCode: "hi" },
    }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance" });
    expect(result.answer).toContain("पश्चिम भारतीय गृह-सन्दर्भ");
    expect(result.practiceGuide.boundaries.continuousFlamePrescribedWithoutSupervision).toBe(false);
  });

  it("returns the seven-book source map for the current Ramayana carrier", async () => {
    const response = await POST(request({ message: "How is the Valmiki Ramayana structured?" }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, mode: "deterministic_source_bounded_preview" });
    expect(result.answer).toContain("seven distinct books");
    expect(result.citations).toHaveLength(7);
    expect(result.citations.every((citation: { rightsLane: string; quotation?: string }) => citation.rightsLane === "citation_only" && citation.quotation === undefined)).toBe(true);
    expect(result.sourceBoundary).toContain("not a critical edition");
  });

  it("uses the reviewed three-source Hanuman deliberation lens for a bounded Ramayana reflection", async () => {
    const response = await POST(request({
      message: "How can Hanuman's deliberation before speaking to Sita help me prepare for a difficult conversation?",
    }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, mode: "reviewed_ramayana_reflection", alternativesAvailable: true });
    expect(result.answer).toContain("smallest truthful step");
    expect(result.citations.map((citation: { sourceOrdinal: number }) => citation.sourceOrdinal)).toEqual([352, 367, 30]);
    expect(result.citations.every((citation: { rightsLane: string; quotation?: string }) => citation.rightsLane === "citation_only" && citation.quotation === undefined)).toBe(true);
    expect(result.sourceBoundary).toContain("GRETIL Book 5 sarga 28 with Griffith Canto XXX and visually reviewed Dutt Section XXX");
  });

  it("prioritizes an explicit Ganesha ritual over a stale Ramayana Atlas context", async () => {
    const response = await POST(request({
      message: "How should I perform Ganesh Chaturthi puja at home?",
      context: { atlasNodeSlug: "ramayana", languageCode: "en" },
    }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.answer).toContain("Which location");
    expect(result.answer).not.toContain("seven distinct books");
  });

  it("prioritizes an explicit Ramayana question over a stale Durga Atlas context", async () => {
    const response = await POST(request({
      message: "How is the Valmiki Ramayana structured?",
      context: { atlasNodeSlug: "durga", languageCode: "en" },
    }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, mode: "deterministic_source_bounded_preview" });
    expect(result.answer).toContain("seven distinct books");
    expect(result.answer).not.toContain("Devīmāhātmya");
  });

  it("prioritizes an explicit Durga question over a stale Ganesha Atlas context", async () => {
    const response = await POST(request({
      message: "Tell me about Durga simply",
      context: { atlasNodeSlug: "ganesha", languageCode: "en" },
    }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, mode: "deterministic_source_bounded_preview" });
    expect(result.answer).toContain("Devīmāhātmya");
    expect(result.answer).not.toContain("Ganapati");
  });

  it("returns the exact current Devimahatmya boundary for an ordinary Durga question", async () => {
    const response = await POST(request({
      message: "Tell me about this simply",
      context: { atlasNodeSlug: "durga", languageCode: "en" },
    }));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, mode: "deterministic_source_bounded_preview" });
    expect(result.answer).toContain("chapters 81–93");
    expect(result.citations).toHaveLength(4);
    expect(result.sourceBoundary).toContain("not complete Durga");
  });

  it("asks for family and regional context before supplying Karwa Chauth guidance", async () => {
    const result = await (await POST(request({ message: "What should I do for Karwa Chauth?", context: { languageCode: "en" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.answer).toContain("will not apply one generic fast or puja sequence");
    expect(result.followUpQuestion).toContain("Which city and family tradition");
  });

  it("returns concise Karwa Chauth guidance without directing fasting or promising outcomes", async () => {
    const result = await (await POST(request({ message: "What should I do for Karwa Chauth?", context: { languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", citations: [] });
    expect(result.answer).toContain("Do not start, continue, or break a fast on the app's authority");
    expect(result.answer).toContain("no health, longevity, or marital outcome as guaranteed");
    expect(result.practiceGuide.evidence.packFileSha256).toBe("639350ff57d30ca4f57092844202208b7a62d81e906c0d503fa724dd94dfd53d");
  });

  it("asks for regional context before supplying monthly Sankashti guidance", async () => {
    const result = await (await POST(request({ message: "What should I do on Sankashti Chaturthi?", context: { languageCode: "en" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.answer).toContain("will not apply one sequence to everyone");
    expect(result.followUpQuestion).toContain("Which region and family or sampradaya Sankashti tradition");
  });

  it("returns concise West India Sankashti guidance without reusing a city time, directing fasting, or promising success", async () => {
    const result = await (await POST(request({ message: "What should I do on Sankashti Chaturthi?", context: { languageCode: "en", regionCode: "west-india", traditionCode: "smarta-west-india" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", citations: [] });
    expect(result.answer).toContain("recalculated moonrise for your exact location");
    expect(result.answer).toContain("does not start, continue, or break a fast");
    expect(result.answer).toContain("does not guarantee obstacle removal or success");
    expect(result.practiceGuide.evidence.packFileSha256).toBe("4515a475d9fcfcfb6435e2dc9a2a5425e5c54d2d9ee30e8dd61329daed661375");
  });

  it("asks for the named Ekadashi and exact calendar lane before giving a generic vrata answer", async () => {
    const result = await (await POST(request({ message: "What should I do on Ekadashi?", context: { languageCode: "en" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.answer).toContain("will not apply one generic date or fast to everyone");
    expect(result.followUpQuestion).toContain("Which named Ekadashi, city, and family or sampradaya calendar");
  });

  it("returns a concise named Smarta Ekadashi companion without prescribing food, fasting, parana, or outcomes", async () => {
    const result = await (await POST(request({ message: "What should I do on Devutthana Ekadashi?", context: { languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", citations: [] });
    expect(result.answer).toContain("First confirm the date for your exact place and tradition");
    expect(result.answer).toContain("Devam does not start, alter, or end those practices or guarantee an outcome");
    expect(result.practiceGuide.evidence.packFileSha256).toBe("5aa329200dab91dd2623064ce585dc53ae4cbba110a6fd4a739b7c745d77caf8");
    expect(result.practiceGuide.boundaries).toMatchObject({ foodOrDietaryRulesGiven: false, smartaParanaServed: false, iskconParanaRepeatedByPracticeGuide: false, smartaAndVaishnavaPracticesEquated: false });
  });

  it("maps a named ISKCON Ekadashi request only to its separate Vaishnava profile", async () => {
    const result = await (await POST(request({ message: "What should I do for Utpanna Ekadashi in ISKCON?", context: { languageCode: "en", traditionCode: "vaishnava-iskcon" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", practiceGuide: { companionToObservanceSlug: "utpanna-ekadashi" } });
    expect(result.practiceGuide.boundaries.smartaAndIskconCalendarLanesKeptSeparate).toBe(true);
  });

  it("asks for the month and exact context before giving Masika Shivaratri practice", async () => {
    const result = await (await POST(request({ message: "What should I do on Masik Shivratri?", context: { languageCode: "en" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.answer).toContain("will not apply annual Mahashivaratri practice every month");
    expect(result.followUpQuestion).toContain("Which September, October, November, or December 2026 Masika Shivaratri");
  });

  it("returns a bounded monthly Shiva companion without fasting, abhisheka, vigil, parana, or outcome claims", async () => {
    const result = await (await POST(request({ message: "What should I do for November Masika Shivaratri?", context: { languageCode: "en", regionCode: "west-india", traditionCode: "smarta-west-india" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", practiceGuide: { companionToObservanceSlug: "masika-shivaratri-2026-11" } });
    expect(result.answer).toContain("does not prescribe fasting, abhisheka ingredients, mantra counts, an all-night vigil, or parana");
    expect(result.practiceGuide.evidence.packFileSha256).toBe("dfe960d608286e8381bef72db95d1f75c86dfc395acdd8cda2ff8a25bf78dab2");
    expect(result.practiceGuide.boundaries.peacePurificationProtectionMeritMarriageProsperityOrOtherOutcomeGuaranteed).toBe(false);
  });

  it("asks which exact Pradosha lane applies before giving a generic ritual answer", async () => {
    const result = await (await POST(request({ message: "What should I do on Pradosha?", context: { languageCode: "en" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.followUpQuestion).toContain("Which September, October, November, or December 2026 Krishna- or Shukla-paksha Pradosha");
  });

  it("returns bounded Pradosha guidance without fasting, abhisheka, planetary remedy, or outcome claims", async () => {
    const result = await (await POST(request({ message: "What should I do on November Shukla Pradosha?", context: { languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", practiceGuide: { companionToObservanceSlug: "pradosha-2026-11-shukla" } });
    expect(result.answer).toContain("does not prescribe fasting, abhisheka, mantra, Nandi practice");
    expect(result.practiceGuide.evidence.packFileSha256).toBe("fc8c08624c3b7048de089462e9aef23decad1773d831358d783fc4651fb24eb0");
    expect(result.practiceGuide.boundaries.weekdayPlanetaryRemedyOrSpecialOutcomePrescribed).toBe(false);
  });

  it("asks which lunar month and practice lane applies before giving generic Purnima guidance", async () => {
    const result = await (await POST(request({ message: "What should I do on Purnima?", context: { languageCode: "en" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification" });
    expect(result.answer).toContain("will keep them separate");
  });

  it("returns the generic Kartika Purnima reflection without absorbing Dev Deepawali or vrata practice", async () => {
    const result = await (await POST(request({ message: "What should I do on Kartika Purnima?", context: { languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", practiceGuide: { companionToObservanceSlug: "kartika-purnima" } });
    expect(result.answer).toContain("Moon sighting, fasting, ritual bathing, offerings, and promised outcomes are not required");
    expect(result.practiceGuide.evidence.packFileSha256).toBe("dc4cf0acfb4d49c901ae023cd9ae05e6ba6b9e2b3b09839049cda75fb0ea27d2");
  });

  it("returns generic Ashwina Amavasya reflection without initiating shraddha or tarpan", async () => {
    const result = await (await POST(request({ message: "What should I do on Ashwina Amavasya?", context: { languageCode: "en", regionCode: "west-india", traditionCode: "smarta-west-india" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", practiceGuide: { companionToObservanceSlug: "ashwina-amavasya" } });
    expect(result.answer).toContain("Without initiating shraddha or tarpan");
    expect(result.practiceGuide.boundaries.shraddhaTarpanDarshaOrAncestorRitePrescribed).toBe(false);
  });

  it("asks for the Smarta or ISKCON Janmashtami lane instead of treating the matching date as one rule", async () => {
    const result = await (await POST(request({ message: "What should I do for Janmashtami?", context: { languageCode: "en" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.answer).toContain("does not make the Smarta and ISKCON rules equivalent");
    expect(result.followUpQuestion).toContain("Smarta Janmashtami tradition or an ISKCON Vaishnava tradition");
  });

  it("returns the bounded Smarta Janmashtami companion without fasting, midnight, puja, Dahi Handi, or outcome prescriptions", async () => {
    const result = await (await POST(request({ message: "What should I do for Smarta Janmashtami?", context: { languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", practiceGuide: { kind: "user_complete_observance_lane", companionToObservanceSlug: "krishna-janmashtami-smarta", evidence: { packFileSha256: "bbc353da9c309fb851ecc704f83e1dbc758a73a487337603c8adbfe2aadf3126" } } });
    expect(result.answer).toContain("does not prescribe fasting, food rules, muhurta, a midnight vigil");
    expect(result.answer).toContain("Dahi Handi is a separate community and safety context");
    expect(result.practiceGuide.boundaries).toMatchObject({ smartaAndIskconRulesEquated: false, dahiHandiParticipationOrHumanPyramidInstructed: false, blessingProtectionMeritProsperityOrOtherOutcomeGuaranteed: false });
  });

  it("maps explicit ISKCON Janmashtami only to the ISKCON lane", async () => {
    const result = await (await POST(request({ message: "What should I do for Janmashtami in ISKCON?", context: { languageCode: "en", traditionCode: "vaishnava-iskcon" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", practiceGuide: { companionToObservanceSlug: "krishna-janmashtami-iskcon" } });
    expect(result.practiceGuide.familyPracticeNote).toContain("official Bangalore programme");
  });

  it("asks which Teej applies before giving a generic regional answer", async () => {
    const result = await (await POST(request({ message: "What should I do for Teej?", context: { languageCode: "en" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.followUpQuestion).toContain("Hartalika Teej, Hariyali Teej, Kajari Teej, Gowri Habba");
  });

  it("returns bounded Hartalika remembrance without prescribing a fast, formal puja, eligibility, purchases, or outcomes", async () => {
    const result = await (await POST(request({ message: "What should I do for Hartalika Teej?", context: { languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", practiceGuide: { companionToObservanceSlug: "hartalika-teej", kind: "user_complete_observance_lane", evidence: { packFileSha256: "da872bebfcfb81a09ecd05eaaaf67454b1de88dfeee0bd2ca7018b77ada19503" } } });
    expect(result.answer).toContain("does not start, continue, or break a fast");
    expect(result.answer).toContain("neither required nor guaranteed");
    expect(result.practiceGuide.boundaries).toMatchObject({ womenOnlyOrMarriedHouseholdOnlyParticipationUniversalized: false, clothingJewelleryMehendiSwingGiftSweetFlowerOrPurchaseRequired: false, marriageSpouseLongevityProgenyFamilyProsperityOrOtherOutcomeGuaranteed: false });
  });

  it("asks for the family Saptarishi tradition before giving Rishi Panchami guidance", async () => {
    const result = await (await POST(request({ message: "What should I do for Rishi Panchami?", context: { languageCode: "en" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.followUpQuestion).toContain("which Rishi Panchami and Saptarishi tradition");
  });

  it("returns attributable Rishi Panchami learning without impurity, atonement, fasting, or formal-puja guidance", async () => {
    const result = await (await POST(request({ message: "What should I do for Rishi Panchami?", context: { languageCode: "en", regionCode: "west-india", traditionCode: "smarta-west-india" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", practiceGuide: { companionToObservanceSlug: "rishi-panchami", evidence: { packFileSha256: "b5a463b6a93045ef442c449b723de738bd9ea2976ec69b826b4863a7b3202de3" } } });
    expect(result.answer).toContain("does not describe menstruation or any person as impure");
    expect(result.practiceGuide.boundaries).toMatchObject({ rajaswalaDoshaAtonementOrGuiltPromoted: false, purificationForgivenessMeritHealthProtectionOrOtherOutcomeGuaranteed: false });
  });

  it("asks for the Vaishnava tradition before assigning an ISKCON Radha Ashtami form", async () => {
    const result = await (await POST(request({ message: "What should I do for Radha Ashtami?", context: { languageCode: "en" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.answer).toContain("will not assign the ISKCON form automatically");
    expect(result.followUpQuestion).toContain("is it ISKCON");
  });

  it("returns the exact current-contract ISKCON Radha Ashtami lane without exporting temple rites or outcomes", async () => {
    const result = await (await POST(request({ message: "What should I do for Radha Ashtami in ISKCON?", context: { languageCode: "en", traditionCode: "vaishnava-iskcon" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", practiceGuide: { kind: "user_complete_observance_lane", companionToObservanceSlug: "radha-ashtami-iskcon", evidence: { packFileSha256: "2a5351b8aab4b0346299d2104b506fd58d243011322f5f1712db00c23d06d455" } } });
    expect(result.answer).toContain("Take fasting, deity worship, abhisheka, arati, offerings, and timing only from your temple or established family guidance");
    expect(result.practiceGuide.boundaries).toMatchObject({ bangaloreProgrammeTimeReusedForAnotherLocation: false, sponsorshipDonationPurchaseNewDressOrChappanBhogRequired: false, mercyPerfectionProgressProtectionMeritOrOtherOutcomeGuaranteed: false, allRadhaAshtamiTraditionsComplete: false });
  });

  it("asks which regional Kojagara or Sharad Purnima identity applies", async () => {
    const result = await (await POST(request({ message: "What should I do for Sharad Purnima?", context: { languageCode: "en" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.answer).toContain("not one universal procedure");
    expect(result.followUpQuestion).toContain("Bengali Kojagari Lakshmi Puja");
  });

  it("keeps Bengali Kojagari Lakshmi Puja out of the North/West household route", async () => {
    const result = await (await POST(request({ message: "How should I do Bengali Kojagari Lakshmi Puja?", context: { languageCode: "en", regionCode: "bengal", traditionCode: "shakta-bengal" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.answer).toContain("will not serve the North/West household form");
    expect(result.practiceGuide).toBeUndefined();
  });

  it("returns bounded Sharad Purnima reflection without fasting, vigil, medicine, gambling, or prosperity claims", async () => {
    const result = await (await POST(request({ message: "What should I do for Sharad Purnima in Delhi?", context: { languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", practiceGuide: { companionToObservanceSlug: "kojagara-puja-sharad-purnima", evidence: { packFileSha256: "f199e5d116d3931db9453a56c16b093e35651e6a88dabc9eaefe2d35542f2719" } } });
    expect(result.answer).toContain("Milk or kheer is optional");
    expect(result.answer).toContain("does not prescribe fasting, an all-night vigil, formal Lakshmi Puja, gambling");
    expect(result.practiceGuide.boundaries).toMatchObject({ medicinalCurativeOrHealthBenefitFromMoonlightOrFoodClaimed: false, wealthProsperityHealthProtectionMeritOrOtherOutcomeGuaranteed: false, nextDayAshwinaPurnimaCalendarLaneMerged: false });
  });

  it("asks whether Ananta Chaturdashi means Ananta-vrata, Ganesh Visarjan, or both", async () => {
    const result = await (await POST(request({ message: "What should I do on Ananta Chaturdashi?", context: { languageCode: "en" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.answer).toContain("not the same ritual");
    expect(result.followUpQuestion).toContain("Ganesh Visarjan, or both");
  });

  it("routes an explicit Ananta-vrata query to the exact Smarta companion", async () => {
    const result = await (await POST(request({ message: "How should I observe Ananta vrata in Mumbai?", context: { languageCode: "en", regionCode: "west-india", traditionCode: "smarta-west-india" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", practiceGuide: { companionToObservanceSlug: "ananta-chaturdashi", evidence: { packFileSha256: "84627e57e6cac73a8825afd7cbf972a101e24f9476749a42901300f059b7cc47" } } });
    expect(result.answer).toContain("If you also observe Ganesh Visarjan, use its separate guide");
    expect(result.practiceGuide.boundaries).toMatchObject({ anantaVrataAndGaneshVisarjanKeptSeparate: true, fourteenKnotThreadTyingRemovalOrRetentionPrescribed: false, ganeshImmersionImportedIntoAnantaGuide: false });
  });

  it("does not answer a Ganesh Visarjan-only query with the Ananta-vrata guide", async () => {
    const result = await (await POST(request({ message: "What should I do for visarjan on Anant Chaturdashi?", context: { languageCode: "en" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.answer).toContain("will not fold it into an Ananta-vrata procedure");
    expect(result.practiceGuide).toBeUndefined();
  });

  it("asks for Bhairava regional and lineage context before selecting a practice", async () => {
    const result = await (await POST(request({ message: "What should I do for Kalabhairava Jayanti?", context: { languageCode: "en" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.answer).toContain("Kashi practice does not automatically apply everywhere");
  });

  it("serves bounded Kashi Kalabhairava remembrance without occult, harm, or outcome rites", async () => {
    const result = await (await POST(request({ message: "What should I do for Kalabhairava Jayanti in Kashi?", context: { languageCode: "en", regionCode: "kashi-varanasi", traditionCode: "regional-kashi-varanasi" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", practiceGuide: { companionToObservanceSlug: "kalabhairava-jayanti", evidence: { packFileSha256: "97f7c1b0851467f1ef456fa14d306b5987653ed4df11fd934cea5c919a47a15a" } } });
    expect(result.answer).toContain("adopt no harmful, intoxicant, animal-offering, occult, exorcistic, or promised-protection rite");
    expect(result.practiceGuide.boundaries).toMatchObject({ fearOccultExorcismOrProtectionRitePrescribed: false, nightVigilOrUnsafeTravelRequired: false, fearProtectionLiberationMeritProsperityOrOtherOutcomeGuaranteed: false });
  });

  it("asks for Vivaha Panchami context before selecting a household companion", async () => {
    const result = await (await POST(request({ message: "What should I do for Vivaha Panchami?", context: { languageCode: "en" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.answer).toContain("Janakpur, Ayodhya, and Orchha");
  });

  it("serves bounded North India Vivaha Panchami remembrance without inventing a wedding rite", async () => {
    const result = await (await POST(request({ message: "What should I do for Vivaha Panchami in North India?", context: { languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", practiceGuide: { kind: "user_complete_observance_lane", companionToObservanceSlug: "vivaha-panchami", evidence: { packFileSha256: "6f2a7c281c31d395fd394e9e7b31ec812355343c75a46fae783285c7e325abac" } } });
    expect(result.answer).toContain("no marriage, fertility, or prosperity outcome is guaranteed");
    expect(result.practiceGuide.boundaries).toMatchObject({ janakpurAyodhyaAndOrchhaContextsKeptDistinct: true, formalWeddingReenactmentPujaMantraOfferingProcessionOrVowPrescribed: false });
  });

  it("asks which Bengal Durga Puja context applies before selecting participation guidance", async () => {
    const result = await (await POST(request({ message: "What should I do for Durga Puja?", context: { languageCode: "en" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.answer).toContain("family, temple, pandal, and sampradaya practices are not one procedure");
  });

  it("serves bounded Bengal Durga Puja participation without exporting institutional rites", async () => {
    const result = await (await POST(request({ message: "What should I do for Durga Puja in Kolkata?", context: { languageCode: "en", regionCode: "bengal", traditionCode: "shakta-bengal" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", practiceGuide: { kind: "user_complete_observance_lane", companionToObservanceSlug: "bengal-durga-puja-campaign", evidence: { packFileSha256: "ef0727519e45314eefbdfcfd83f2ffc750b9ba5ea6399ab4cdbed64cf05afa59" } } });
    expect(result.answer).toContain("Leave Bodhan, Navapatrika, Kumari Puja, Sandhi Puja");
    expect(result.practiceGuide.boundaries).toMatchObject({ kumariPujaOrUseOfAChildAsRitualSubjectPrescribed: false, animalOrSymbolicBaliHomaOrHarmInstructed: false, immersionProcessionWaterEntryOrEnvironmentalOperationInstructed: false });
  });

  it("serves the complete Maha Ashtami participant lane when the user names that day", async () => {
    const result = await (await POST(request({ message: "What should I do for Maha Ashtami during Durga Puja in Kolkata?", context: { languageCode: "en", regionCode: "bengal", traditionCode: "shakta-bengal" } }))).json();
    expect(result).toMatchObject({
      ok: true,
      mode: "contextual_ritual_guidance",
      practiceGuide: {
        kind: "user_complete_observance_lane",
        companionToObservanceSlug: "bengal-mahashtami-community-participant-2026",
        evidence: { packFileSha256: "8f4437ecb12e0c1cf6cd803312162f2b616f291b60dd24de309a6ee00f38625b" },
        userCompleteContext: { classification: "user_complete_lane" },
        boundaries: { priestLedVidhiIncluded: false, householdConsecrationProcedureIncluded: false },
      },
    });
    expect(result.answer).toContain("Monday, 19 October 2026 is Maha Ashtami");
    expect(result.sourceBoundary).toContain("User-complete only for the named 19 October 2026");
  });

  it("asks for monthly Durgashtami context before selecting a practice lane", async () => {
    const result = await (await POST(request({ message: "What should I do for Masika Durgashtami?", context: { languageCode: "en" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(result.answer).toContain("not one procedure");
    expect(result.followUpQuestion).toContain("North or West India Smarta");
  });

  it("serves the bounded North India monthly Durga remembrance without importing larger festival rites", async () => {
    const result = await (await POST(request({ message: "What should I do for Masika Durgashtami in Delhi?", context: { languageCode: "en", regionCode: "north-india", traditionCode: "smarta-north-india" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "contextual_ritual_guidance", practiceGuide: { kind: "user_complete_observance_lane", companionToObservanceSlug: "masika-durgashtami-2026-09", evidence: { packFileSha256: "e8c24d5732f2a8371ccc2c08e2643920e3ca8af3313ff722eaba19989ea95d83" } } });
    expect(result.answer).toContain("Take fasting, food, mantra, image, offering, aarti, Chandi recitation");
    expect(result.practiceGuide.boundaries).toMatchObject({ shardiyaMahashtamiEquatedWithEveryMonthlyAshtami: false, bengalDurgaPujaOrOtherRegionalAshtamiImported: false, kumariPujaBaliOrHarmInstructed: false });
  });

  it("starts a personal-guidance conversation with material context instead of a religious command", async () => {
    const result = await (await POST(request({ message: "I am in conflict with my parents about my career. What should I do?", context: { languageCode: "en" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "context_clarification", citations: [], alternativesAvailable: true });
    expect(result.answer).toContain("respect for your family");
    expect(result.followUpQuestion).toContain("financial dependence");
    expect(result.sourceBoundary).toContain("No scripture");
  });

  it("routes immediate danger to human safety rather than spiritual interpretation", async () => {
    const result = await (await POST(request({ message: "I am in immediate danger and cannot stay safe.", context: { languageCode: "en" } }))).json();
    expect(result).toMatchObject({ ok: true, mode: "safety_escalation", citations: [], alternativesAvailable: false });
    expect(result.answer).toContain("local emergency services");
    expect(result.sourceBoundary).toContain("Immediate-safety response only");
  });

  it("serves reviewed anger guidance only after safety and recurrence are explicit", async () => {
    const result = await (await POST(request({
      message: "No one is in danger and everyone is safe. I keep losing my temper in the same family argument. Help me use the Gita without judging me.",
      context: { languageCode: "en" },
    }))).json();
    expect(result).toMatchObject({ ok: true, mode: "reviewed_personal_guidance", alternativesAvailable: true });
    expect(result.answer).toContain("warning map");
    expect(result.citations.map((citation: { sourceOrdinal: number }) => citation.sourceOrdinal)).toEqual([91, 217, 444]);
    expect(result.citations.every((citation: { quotation?: string }) => citation.quotation === undefined)).toBe(true);
    expect(result.sourceBoundary).toContain("54271cfe77f35d0c82ccb8912b9858149fe92fef79aac5f2db38ebd9f0bbd05d");
  });

  it("serves an optional grief lens without turning scripture into a cure or timetable", async () => {
    const result = await (await POST(request({
      message: "I am grieving and want a gentle source-grounded reflection, not a command or cure.",
      context: { languageCode: "en" },
    }))).json();
    expect(result).toMatchObject({ ok: true, mode: "reviewed_personal_guidance", alternativesAvailable: true });
    expect(result.answer).toContain("No scripture proves");
    expect(result.answer).toContain("This lens is optional");
    expect(result.citations.map((citation: { sourceOrdinal: number }) => citation.sourceOrdinal)).toEqual([43, 45, 46, 444]);
    expect(result.citations.every((citation: { quotation?: string }) => citation.quotation === undefined)).toBe(true);
  });

  it("prioritizes an explicit necessary care need over work the user says can safely wait", async () => {
    const result = await (await POST(request({
      message: "My child needs essential care today, and the rest of my work can be postponed. Help me choose one reversible next step.",
      context: { languageCode: "en" },
    }))).json();
    expect(result).toMatchObject({ ok: true, mode: "reviewed_personal_guidance", alternativesAvailable: true });
    expect(result.answer).toContain("care is necessary today");
    expect(result.answer).toContain("does not assign care by gender");
    expect(result.citations.map((citation: { sourceOrdinal: number }) => citation.sourceOrdinal)).toEqual([108, 227, 549, 620]);
    expect(result.citations.every((citation: { quotation?: string }) => citation.quotation === undefined)).toBe(true);
  });

  it("clarifies religious-participation consent before applying the adult non-coercion lane", async () => {
    const initial = await (await POST(request({
      message: "परिवार के एक सदस्य को पूजा में आने का मन नहीं है। क्या करना चाहिए?",
      context: { languageCode: "hi" },
    }))).json();
    expect(initial).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(initial.followUpQuestion).toContain("सक्षम वयस्क");

    const specified = await (await POST(request({
      message: "वह वयस्क आश्रित है और स्पष्ट रूप से मना कर रहा है। परिवार दबाव डाल रहा है।",
      context: { languageCode: "hi" },
    }))).json();
    expect(specified).toMatchObject({ ok: true, mode: "reviewed_personal_guidance", alternativesAvailable: true });
    expect(specified.answer).toContain("भाग न लेने पर दण्ड नहीं होगा");
    expect(specified.citations.map((citation: { sourceOrdinal: number }) => citation.sourceOrdinal)).toEqual([444, 549, 620]);
    expect(specified.citations.every((citation: { quotation?: string }) => citation.quotation === undefined)).toBe(true);
  });

  it("keeps forgiveness separate from renewed access when harm continues", async () => {
    const initial = await (await POST(request({
      message: "Should I forgive someone because forgiveness is virtuous?",
      context: { languageCode: "en" },
    }))).json();
    expect(initial).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(initial.followUpQuestion).toContain("Is the harm continuing");

    const specified = await (await POST(request({
      message: "The person keeps harming me and wants access again. Does dharma require reconciliation?",
      context: { languageCode: "en" },
    }))).json();
    expect(specified).toMatchObject({ ok: true, mode: "reviewed_personal_guidance", alternativesAvailable: true });
    expect(specified.answer).toContain("does not require you to restore access while harm continues");
    expect(specified.citations.map((citation: { sourceOrdinal: number }) => citation.sourceOrdinal)).toEqual([217, 444, 549, 620]);
    expect(specified.citations.every((citation: { quotation?: string }) => citation.quotation === undefined)).toBe(true);
  });

  it("clarifies an abstract truth conflict but protects location during an immediate threat", async () => {
    const abstract = await (await POST(request({
      message: "Is it right to lie to protect someone in my family?",
      context: { languageCode: "en" },
    }))).json();
    expect(abstract).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(abstract.followUpQuestion).toContain("What harm is threatened");

    const urgent = await (await POST(request({
      message: "Someone is asking where a relative is so they can harm them right now. Should I reveal the location?",
      context: { languageCode: "en" },
    }))).json();
    expect(urgent).toMatchObject({ ok: true, mode: "safety_escalation", citations: [], alternativesAvailable: false });
    expect(urgent.answer).toContain("Do not reveal their location");
    expect(urgent.sourceBoundary).toContain("Immediate third-party threat response only");
  });

  it("clarifies household obligations before offering proportional giving options", async () => {
    const initial = await (await POST(request({
      message: "दान और घर की जिम्मेदारी में किसे पहले रखूँ?",
      context: { languageCode: "hi" },
    }))).json();
    expect(initial).toMatchObject({ ok: true, mode: "context_clarification", citations: [] });
    expect(initial.followUpQuestion).toContain("वास्तव में अतिरिक्त");

    const specified = await (await POST(request({
      message: "घर की आवश्यक जरूरतें सुरक्षित हैं और बात केवल अतिरिक्त खर्च की है। विकल्प कैसे सोचूँ?",
      context: { languageCode: "hi" },
    }))).json();
    expect(specified).toMatchObject({ ok: true, mode: "reviewed_personal_guidance", alternativesAvailable: true });
    expect(specified.answer).toContain("कोई धार्मिक रूप से तय प्रतिशत");
    expect(specified.citations.map((citation: { sourceOrdinal: number }) => citation.sourceOrdinal)).toEqual([554, 555, 556, 620]);
    expect(specified.citations.every((citation: { quotation?: string }) => citation.quotation === undefined)).toBe(true);
  });

  it("rejects an invalid body", async () => {
    const response = await POST(request({ message: " " }));
    expect(response.status).toBe(422);
  });

  it("rejects a non-UUID conversation identity", async () => {
    const response = await POST(request({ message: "Tell me about Ganesha", context: { conversationId: "someone-elses-thread" } }));
    expect(response.status).toBe(422);
  });
});

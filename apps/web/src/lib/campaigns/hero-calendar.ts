const NAVARATRI_2026_DAYS = [
  ["2026-10-11", "Shailaputri"],
  ["2026-10-12", "Brahmacharini"],
  ["2026-10-13", "Chandraghanta"],
  ["2026-10-14", "Kushmanda"],
  ["2026-10-15", "Skandamata"],
  ["2026-10-16", "Katyayani"],
  ["2026-10-17", "Kalaratri"],
  ["2026-10-18", "Mahagauri"],
  ["2026-10-19", "Siddhidatri"],
  ["2026-10-20", "Vijayadashami"],
] as const;

const GANESHOTSAV_2026_DAYS = [
  ["2026-09-14", "Ganesh Chaturthi"],
  ["2026-09-15", "Family-chosen Ganeshotsav day"],
  ["2026-09-16", "Family-chosen Ganeshotsav day"],
  ["2026-09-17", "Family-chosen Ganeshotsav day"],
  ["2026-09-18", "Family-chosen Ganeshotsav day"],
  ["2026-09-19", "Family-chosen Ganeshotsav day"],
  ["2026-09-20", "Family-chosen Ganeshotsav day"],
  ["2026-09-21", "Family-chosen Ganeshotsav day"],
  ["2026-09-22", "Family-chosen Ganeshotsav day"],
  ["2026-09-23", "Family-chosen Ganeshotsav day"],
  ["2026-09-24", "Family-chosen Ganeshotsav day"],
  ["2026-09-25", "Anant Chaturdashi Visarjan lane"],
] as const;

const BENGAL_DURGA_PUJA_2026_DAYS = [
  ["2026-10-16", "Bilva Nimantran"],
  ["2026-10-17", "Kalparambha and Maha Shashthi"],
  ["2026-10-18", "Maha Saptami"],
  ["2026-10-19", "Maha Ashtami"],
  ["2026-10-20", "Maha Navami"],
  ["2026-10-21", "Vijayadashami and Bengal Durga Visarjan"],
] as const;

export type HeroCampaignDay = {
  campaignId: "shardiya-navaratri-2026-north-west-smarta" | "ganeshotsav-2026-west-india-smarta" | "durga-puja-2026-bengal-shakta";
  heroSlug: "durga" | "ganesha";
  heroLabel: "Durga" | "Ganesha";
  title: "Shardiya Navaratri" | "Ganeshotsav" | "Bengal Durga Puja";
  civilDate: string;
  ordinal: number;
  totalDays: 6 | 10 | 12;
  commonName: string;
  practiceGuideObservanceSlug: "shardiya-navaratri-begins" | "ganesh-chaturthi" | "bengal-durga-puja-campaign" | "bengal-mahashtami-community-participant-2026" | null;
  status: "bounded_2026_campaign_day_resolved";
  displayNote: string;
  boundarySummary: string;
  evidence: {
    openingRuleId: string | null;
    closingRuleId: string | null;
    observanceRulesetVersion: "devam-observance-rules-2026-v21";
    practicePackId: string | null;
    practicePackSha256: string | null;
    campaignFixtureSha256?: string;
  };
  boundaries: Record<string, boolean>;
};

function resolveBengalDurgaPujaDay(civilDate: string, traditionCode: string): HeroCampaignDay | null {
  if (traditionCode !== "shakta-bengal") return null;
  const index = BENGAL_DURGA_PUJA_2026_DAYS.findIndex(([candidate]) => candidate === civilDate);
  if (index < 0) return null;
  const isMahashtami = civilDate === "2026-10-19";

  return {
    campaignId: "durga-puja-2026-bengal-shakta",
    heroSlug: "durga",
    heroLabel: "Durga",
    title: "Bengal Durga Puja",
    civilDate,
    ordinal: index + 1,
    totalDays: 6,
    commonName: BENGAL_DURGA_PUJA_2026_DAYS[index][1],
    practiceGuideObservanceSlug: isMahashtami ? "bengal-mahashtami-community-participant-2026" : "bengal-durga-puja-campaign",
    status: "bounded_2026_campaign_day_resolved",
    displayNote: isMahashtami
      ? "This is the Bengal Shakta Maha Ashtami participant lane. It includes applicability, meaning, stories, live-timing boundaries and three actionable forms; priest-led and household-consecration procedures remain with their responsible authority."
      : "This is the bounded Kolkata/Bengal 2026 calendar lane. It remains separate from the North/West Navaratri sequence and offers a safe participation companion, not a household, community, or priest-led Puja vidhi.",
    boundarySummary: isMahashtami
      ? "This exact Bengal Shakta participant lane is user-complete for the stated scope. It does not claim a universal Bengali, household, officiant, Durga-tradition, or live-venue procedure."
      : "This date is inside the source-bounded 2026 Kolkata/Bengal Durga Puja lane. Calendar-label divergences are preserved; formal ritual procedure and other regional Durga Puja calendars remain unresolved.",
    evidence: {
      openingRuleId: null,
      closingRuleId: null,
      observanceRulesetVersion: "devam-observance-rules-2026-v21",
      practicePackId: isMahashtami ? "bengal-mahashtami-community-participant-2026-v1" : "bengal-durga-puja-participant-content-v1",
      practicePackSha256: isMahashtami ? "8f4437ecb12e0c1cf6cd803312162f2b616f291b60dd24de309a6ee00f38625b" : "ef0727519e45314eefbdfcfd83f2ffc750b9ba5ea6399ab4cdbed64cf05afa59",
      campaignFixtureSha256: "c8bec184a2de4f245b1354e386daaa0fbdb9113dbc3b35e53fc335dd99b7204a",
    },
    boundaries: {
      exactBengalShakta2026LaneOnly: true,
      calendarLabelDivergencesPreserved: true,
      safeParticipationCompanionAvailable: true,
      northWestNavaratriCalendarIncluded: false,
      householdPujaProcedureResolved: false,
      communityPandalProcedureResolved: false,
      priestLedVidhiResolved: false,
      sandhiPujaTimingCalculated: false,
      balidanInstructionProvided: false,
      visarjanInstructionProvided: false,
      allBengalVariantsComplete: false,
      allDurgaPujaTraditionsComplete: false,
      exactMahashtamiParticipantLaneComplete: isMahashtami,
      completeHouseholdPujaVidhi: false,
    },
  };
}

function resolveGaneshotsavDay(civilDate: string, traditionCode: string): HeroCampaignDay | null {
  if (traditionCode !== "smarta-west-india") return null;
  const index = GANESHOTSAV_2026_DAYS.findIndex(([candidate]) => candidate === civilDate);
  if (index < 0) return null;

  return {
    campaignId: "ganeshotsav-2026-west-india-smarta",
    heroSlug: "ganesha",
    heroLabel: "Ganesha",
    title: "Ganeshotsav",
    civilDate,
    ordinal: index + 1,
    totalDays: 12,
    commonName: GANESHOTSAV_2026_DAYS[index][1],
    practiceGuideObservanceSlug: "ganesh-chaturthi",
    status: "bounded_2026_campaign_day_resolved",
    displayNote: "This 12-date calendar crosswalk is not a required 12-day murti stay. If your family has already completed visarjan, treat this as festival context rather than an instruction to continue daily care.",
    boundarySummary: "This Ganeshotsav date is inside the source-bounded 2026 West India Smarta opening-to-Anant-Chaturdashi lane. Family-chosen visarjan durations and other regional traditions remain separate.",
    evidence: {
      openingRuleId: "nirnayasindhu-1865-bhadrapada-shukla-chaturthi-madhyahna-v1",
      closingRuleId: "nirnayasindhu-1865-bhadrapada-shukla-chaturdashi-ananta-madhyahna-2026-v1",
      observanceRulesetVersion: "devam-observance-rules-2026-v21",
      practicePackId: "ganesh-chaturthi-west-india-content-v1",
      practicePackSha256: "eaa9f4576ecd9587ea205039ca633c569ad61d4f79637e8eb7774182a86163dd",
      campaignFixtureSha256: "bcf8ae5898adadec8ab3d0544f46945fb666567e7b95bd6e3fa374764b25a504",
    },
    boundaries: {
      exactWestIndiaSmarta2026LaneOnly: true,
      calendarCrosswalkNotMandatoryStayLength: true,
      mandatoryFestivalDurationClaim: false,
      allFamilyVisarjanDatesResolved: false,
      oneAndHalfDayVisarjanResolved: false,
      fiveDayVisarjanResolved: false,
      sevenDayVisarjanResolved: false,
      anantaVrataAndGaneshVisarjanSameRitual: false,
      allGaneshotsavTraditionsComplete: false,
    },
  };
}

function resolveNavaratriDay(civilDate: string, traditionCode: string): HeroCampaignDay | null {
  if (traditionCode !== "smarta-north-india" && traditionCode !== "smarta-west-india") return null;
  const index = NAVARATRI_2026_DAYS.findIndex(([candidate]) => candidate === civilDate);
  if (index < 0) return null;

  return {
    campaignId: "shardiya-navaratri-2026-north-west-smarta",
    heroSlug: "durga",
    heroLabel: "Durga",
    title: "Shardiya Navaratri",
    civilDate,
    ordinal: index + 1,
    totalDays: 10,
    commonName: NAVARATRI_2026_DAYS[index][1],
    practiceGuideObservanceSlug: "shardiya-navaratri-begins",
    status: "bounded_2026_campaign_day_resolved",
    displayNote: "This is the bounded North/West India Smarta 2026 campaign lane. The daily name is a reflection aid, not a claim that every family follows one mandatory sequence.",
    boundarySummary: "This Navaratri date is inside the source-bounded 2026 North/West India Smarta opening-to-Vijayadashami lane. Other regional and tradition calendars remain separate.",
    evidence: {
      openingRuleId: "nirnayasindhu-1865-ashvina-shukla-pratipada-sunrise-v1",
      closingRuleId: "nirnayasindhu-1865-ashvina-shukla-dashami-aparahna-v1",
      observanceRulesetVersion: "devam-observance-rules-2026-v21",
      practicePackId: "shardiya-navaratri-north-west-india-content-v1",
      practicePackSha256: "320b79891597460b33a0ee031411d805afce56b8c9b64c35a18fc2f02df250b1",
    },
    boundaries: {
      exactNorthWestSmartaLaneOnly: true,
      reflectionNameIsMandatoryRitualClaim: false,
      bengalDurgaPujaCalendarIncluded: false,
      southIndianGoluCalendarIncluded: false,
      gujaratiGarbaCalendarIncluded: false,
      allNavaratriTraditionsComplete: false,
    },
  };
}

export function resolveHeroCampaignDay(input: {
  civilDate: string;
  traditionCode: string;
}): HeroCampaignDay | null {
  return resolveGaneshotsavDay(input.civilDate, input.traditionCode)
    ?? resolveBengalDurgaPujaDay(input.civilDate, input.traditionCode)
    ?? resolveNavaratriDay(input.civilDate, input.traditionCode);
}

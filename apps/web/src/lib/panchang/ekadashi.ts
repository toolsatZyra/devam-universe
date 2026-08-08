import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PanchangFact, PanchangRequest } from "./contracts";
import { calculatePanchang, calculateTithiAtInstant, type TithiInstantFact } from "./engine";

const FIXTURE_SHA256 = "6c860d6f2d778739c4a25b4b281b03a16975e8d43021baee24c55b1e1b72433d";
const FIXTURE_RELATIVE_PATH = "knowledge_packs/panchang/ekadashi-delhi-mumbai-chennai-september-december-2026-v1.json";
const HISTORICAL_SOURCE_SHA256 = "a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b";
const PARANA_TOLERANCE_MS = 180_000;

type ProfileId = "delhi" | "mumbai" | "chennai";
type SmartaTraditionCode = "smarta-north-india" | "smarta-west-india" | "smarta-south-india";
type EkadashiLane = "smarta" | "vaishnava-iskcon";
type Classification = "ordinary_iskcon_ekadashi" | "gauna_vaishnava_shift" | "trisparsha_mahadwadashi" | "paksha_vardhini_mahadwadashi";

type FixtureProfile = {
  profile_id: ProfileId;
  reference_location: string;
  geoname_id: number;
  latitude: number;
  longitude: number;
  smarta_tradition_code: SmartaTraditionCode;
};

type FixtureSource = {
  source_id: string;
  source_class: "historical_rule_context" | "current_practitioner_calendar" | "official_current_corroboration";
  fixed_carrier_sha256?: string;
  pdf_pages?: number[];
  url?: string;
  fetched_at_utc?: string;
  status?: number;
  final_url?: string;
  response_bytes?: number;
  response_sha256?: string;
  strict_utf8?: boolean;
  evidence_role: string;
  rights_lane: "private_evidence" | "reference_only";
  source_text_returned_by_api: false;
};

type IskconProfileRow = {
  date: string;
  classification: Classification;
  parana_start_local: string;
  parana_end_local: string;
};

type FixtureObservance = {
  observance_slug: string;
  smarta_name: string;
  iskcon_name: string;
  target_tithi: { index: 11 | 26; name: "Ekadashi"; paksha: "shukla" | "krishna" };
  candidate_civil_dates: string[];
  tithi_begins_local: string;
  tithi_ends_local: string;
  smarta_date: string;
  iskcon: Record<ProfileId, IskconProfileRow>;
};

type EkadashiFixture = {
  contract: "DEVAM_BOUNDED_EKADASHI_CALENDAR_FIXTURE_V1";
  fixture_id: "devam-ekadashi-delhi-mumbai-chennai-september-december-2026-v1";
  scope: {
    civil_date_start: "2026-09-01";
    civil_date_end: "2026-12-31";
    timezone: "Asia/Kolkata";
    coordinate_tolerance_degrees: 0.0001;
    profiles: FixtureProfile[];
    vaishnava_tradition_code: "vaishnava-iskcon";
    exact_reference_profiles_only: true;
    universal_india_claim: false;
  };
  sources: FixtureSource[];
  rule_contract: {
    smarta_selection: string;
    smarta_two_date_boundary: string;
    vaishnava_selection: string;
    astronomical_role: string;
    iskcon_parana: string;
    smarta_parana: string;
    dvadashi_and_mahadwadashi_classification: string;
    fasting_food_medical_and_ritual_guidance_resolved: false;
    outside_exact_profile: "fail_closed";
  };
  observances: FixtureObservance[];
  denials: Record<string, false>;
};

export type EkadashiCandidateDay = {
  civilDate: string;
  sunriseUtc: string;
  arunodayaStartUtc: string;
  tithiAtArunodaya: TithiInstantFact;
  tithiAtSunrise: TithiInstantFact;
};

export type EkadashiParana =
  | {
      status: "resolved_for_exact_iskcon_reference_profile";
      startUtc: string;
      endUtc: string;
      providerObservedStartLocal: string;
      providerObservedEndLocal: string;
      validation: {
        method: "next_local_sunrise_to_one_third_of_daylight";
        startDifferenceSeconds: number;
        endDifferenceSeconds: number;
        maximumAllowedDifferenceSeconds: 180;
      };
    }
  | {
      status: "unresolved_smarta_location_specific_hari_vasara_evidence_required";
      startUtc: null;
      endUtc: null;
    };

export type EkadashiResolution<RulesetVersion extends string = string> = {
  observanceSlug: string;
  canonicalName: string;
  ruleId: string;
  rulesetVersion: RulesetVersion;
  status: "resolved_for_exact_2026_city_tradition_profile";
  lane: EkadashiLane;
  profileId: ProfileId;
  referenceLocation: string;
  selectedCivilDate: string;
  appliesToRequestedDate: boolean;
  classification: "smarta_current_practitioner_selected_date" | Classification;
  targetTithi: FixtureObservance["target_tithi"];
  candidateDays: EkadashiCandidateDay[];
  precedence: { kind: string; explanation: string };
  parana: EkadashiParana;
  evidence: {
    fixtureId: EkadashiFixture["fixture_id"];
    fixtureSha256: typeof FIXTURE_SHA256;
    historicalWork: "Nirnayasindhu";
    historicalEdition: "Marathi translation, Mumbai 1865";
    historicalCarrierSha256: typeof HISTORICAL_SOURCE_SHA256;
    historicalPdfPages: number[];
    currentSourceIds: string[];
    sourceScopeNote: string;
    rightsLanes: ["private_evidence", "reference_only"];
    sourceTextReturnedByApi: false;
    tithiBoundsLocal: { begins: string; ends: string };
  };
  boundaries: {
    completeDayCoverage: false;
    completeSeptemberDecemberCoverage: false;
    modernPracticeResolved: false;
    ritualGuidanceIncluded: false;
    universalTraditionClaim: false;
    smartaDateResolved: boolean;
    vaishnavaDateResolved: boolean;
    paranaResolved: boolean;
    fastingFoodGuidanceResolved: false;
    medicalGuidanceIncluded: false;
    completeNirnayasindhuRuleEngine: false;
    completeGcalRuleEngine: false;
  };
};

function loadFixture(): EkadashiFixture {
  const path = resolve(process.cwd(), "../..", FIXTURE_RELATIVE_PATH);
  const bytes = readFileSync(path);
  const actualHash = createHash("sha256").update(bytes).digest("hex");
  if (actualHash !== FIXTURE_SHA256) throw new Error(`Ekadashi fixture hash drift: ${actualHash}`);
  const fixture = JSON.parse(bytes.toString("utf8")) as EkadashiFixture;
  if (fixture.contract !== "DEVAM_BOUNDED_EKADASHI_CALENDAR_FIXTURE_V1" || fixture.fixture_id !== "devam-ekadashi-delhi-mumbai-chennai-september-december-2026-v1") throw new Error("Ekadashi fixture identity drift");
  if (fixture.scope.civil_date_start !== "2026-09-01" || fixture.scope.civil_date_end !== "2026-12-31" || fixture.scope.timezone !== "Asia/Kolkata" || fixture.scope.coordinate_tolerance_degrees !== 0.0001 || !fixture.scope.exact_reference_profiles_only || fixture.scope.universal_india_claim || fixture.scope.vaishnava_tradition_code !== "vaishnava-iskcon") throw new Error("Ekadashi fixture scope drift");
  const expectedProfiles = [
    ["delhi", "Delhi, India", 1273294, 28.6139, 77.209, "smarta-north-india"],
    ["mumbai", "Mumbai, India", 1275339, 19.076, 72.8777, "smarta-west-india"],
    ["chennai", "Chennai, India", 1264527, 13.0827, 80.2707, "smarta-south-india"],
  ];
  if (JSON.stringify(fixture.scope.profiles.map((profile) => [profile.profile_id, profile.reference_location, profile.geoname_id, profile.latitude, profile.longitude, profile.smarta_tradition_code])) !== JSON.stringify(expectedProfiles)) throw new Error("Ekadashi profile universe drift");
  const historical = fixture.sources.find((source) => source.source_id === "nirnayasindhu-1865-ekadashi-decision-chapter");
  const expectedPages = Array.from({ length: 16 }, (_, index) => index + 52);
  if (fixture.sources.length !== 8 || historical?.fixed_carrier_sha256 !== HISTORICAL_SOURCE_SHA256 || JSON.stringify(historical.pdf_pages) !== JSON.stringify(expectedPages) || historical.rights_lane !== "private_evidence" || historical.source_text_returned_by_api !== false) throw new Error("Ekadashi historical evidence drift");
  const currentSources = fixture.sources.filter((source) => source.source_class !== "historical_rule_context");
  if (currentSources.length !== 7 || currentSources.some((source) => source.status !== 200 || source.url !== source.final_url || source.strict_utf8 !== true || !/^[0-9a-f]{64}$/.test(source.response_sha256 ?? "") || !source.response_bytes || source.rights_lane !== "reference_only" || source.source_text_returned_by_api !== false)) throw new Error("Ekadashi current evidence drift");
  const rule = fixture.rule_contract;
  if (rule.outside_exact_profile !== "fail_closed" || rule.fasting_food_medical_and_ritual_guidance_resolved !== false || !rule.smarta_selection.includes("exact_reference_city") || !rule.vaishnava_selection.includes("exact_reference_city") || !rule.iskcon_parana.includes("one_third_of_next_day_daylight") || !rule.smarta_parana.startsWith("unresolved")) throw new Error("Ekadashi rule contract drift");
  if (fixture.observances.length !== 8 || new Set(fixture.observances.map((row) => row.observance_slug)).size !== 8) throw new Error("Ekadashi observance universe drift");
  for (const row of fixture.observances) {
    if (!row.candidate_civil_dates.includes(row.smarta_date) || row.target_tithi.name !== "Ekadashi" || ![11, 26].includes(row.target_tithi.index) || !(Date.parse(row.tithi_begins_local) < Date.parse(row.tithi_ends_local))) throw new Error(`Invalid Ekadashi row: ${row.observance_slug}`);
    for (const profile of fixture.scope.profiles) {
      const iskcon = row.iskcon[profile.profile_id];
      if (!iskcon || !row.candidate_civil_dates.includes(iskcon.date) || !(Date.parse(iskcon.parana_start_local) < Date.parse(iskcon.parana_end_local)) || !iskcon.parana_start_local.startsWith(shiftCivilDate(iskcon.date, 1))) throw new Error(`Invalid ISKCON Ekadashi row: ${row.observance_slug}/${profile.profile_id}`);
    }
  }
  if (Object.keys(fixture.denials).length !== 12 || Object.values(fixture.denials).some((value) => value !== false)) throw new Error("Ekadashi denial drift");
  return fixture;
}

function shiftCivilDate(civilDate: string, days: number): string {
  const value = new Date(`${civilDate}T12:00:00.000Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

const FIXTURE = loadFixture();

function exactProfile(request: PanchangRequest): FixtureProfile | null {
  if (request.timezone !== FIXTURE.scope.timezone) return null;
  const tolerance = FIXTURE.scope.coordinate_tolerance_degrees;
  return FIXTURE.scope.profiles.find((profile) => Math.abs(request.latitude - profile.latitude) <= tolerance && Math.abs(request.longitude - profile.longitude) <= tolerance) ?? null;
}

function laneFor(request: PanchangRequest, profile: FixtureProfile): EkadashiLane | null {
  if (request.traditionCode === profile.smarta_tradition_code) return "smarta";
  if (request.traditionCode === FIXTURE.scope.vaishnava_tradition_code) return "vaishnava-iskcon";
  return null;
}

function currentSourceIds(profile: FixtureProfile, lane: EkadashiLane): string[] {
  const base = `drikpanchang-${profile.profile_id}-${lane === "smarta" ? "smarta" : "iskcon"}-ekadashi-2026`;
  return lane === "smarta" ? [base] : [base, "iskcon-bangalore-ekadashi-calendar-2026"];
}

function candidateDiagnostics(request: PanchangRequest, currentFact: PanchangFact, row: FixtureObservance): EkadashiCandidateDay[] | null {
  const facts = row.candidate_civil_dates.map((civilDate) => civilDate === request.civilDate ? currentFact : calculatePanchang({ ...request, civilDate }));
  if (facts.some((fact) => fact === null)) return null;
  return (facts as PanchangFact[]).map((fact) => {
    const arunodayaStartUtc = new Date(Date.parse(fact.sunriseUtc) - 96 * 60_000).toISOString();
    return {
      civilDate: fact.request.civilDate,
      sunriseUtc: fact.sunriseUtc,
      arunodayaStartUtc,
      tithiAtArunodaya: calculateTithiAtInstant(arunodayaStartUtc),
      tithiAtSunrise: calculateTithiAtInstant(fact.sunriseUtc),
    };
  });
}

function resolvedIskconParana(request: PanchangRequest, row: FixtureObservance, profile: FixtureProfile): EkadashiParana | null {
  const provider = row.iskcon[profile.profile_id];
  const nextFact = calculatePanchang({ ...request, civilDate: shiftCivilDate(provider.date, 1) });
  if (!nextFact) return null;
  const startMillis = Date.parse(nextFact.sunriseUtc);
  const endMillis = startMillis + (Date.parse(nextFact.sunsetUtc) - startMillis) / 3;
  const providerStartMillis = Date.parse(provider.parana_start_local);
  const providerEndMillis = Date.parse(provider.parana_end_local);
  const startDifferenceSeconds = Math.round(Math.abs(startMillis - providerStartMillis) / 1000);
  const endDifferenceSeconds = Math.round(Math.abs(endMillis - providerEndMillis) / 1000);
  if (startDifferenceSeconds > PARANA_TOLERANCE_MS / 1000 || endDifferenceSeconds > PARANA_TOLERANCE_MS / 1000) return null;
  return {
    status: "resolved_for_exact_iskcon_reference_profile",
    startUtc: new Date(startMillis).toISOString(),
    endUtc: new Date(endMillis).toISOString(),
    providerObservedStartLocal: provider.parana_start_local,
    providerObservedEndLocal: provider.parana_end_local,
    validation: {
      method: "next_local_sunrise_to_one_third_of_daylight",
      startDifferenceSeconds,
      endDifferenceSeconds,
      maximumAllowedDifferenceSeconds: 180,
    },
  };
}

export function resolveEkadashiObservances<RulesetVersion extends string>(request: PanchangRequest, currentFact: PanchangFact, rulesetVersion: RulesetVersion): EkadashiResolution<RulesetVersion>[] {
  const profile = exactProfile(request);
  if (!profile) return [];
  const lane = laneFor(request, profile);
  if (!lane) return [];
  const relevant = FIXTURE.observances.filter((row) => row.candidate_civil_dates.includes(request.civilDate));
  const results: EkadashiResolution<RulesetVersion>[] = [];
  for (const row of relevant) {
    const candidateDays = candidateDiagnostics(request, currentFact, row);
    if (!candidateDays) continue;
    const iskcon = row.iskcon[profile.profile_id];
    const selectedCivilDate = lane === "smarta" ? row.smarta_date : iskcon.date;
    const parana: EkadashiParana | null = lane === "smarta"
      ? { status: "unresolved_smarta_location_specific_hari_vasara_evidence_required", startUtc: null, endUtc: null }
      : resolvedIskconParana(request, row, profile);
    if (!parana) continue;
    const classification = lane === "smarta" ? "smarta_current_practitioner_selected_date" as const : iskcon.classification;
    const paranaResolved = parana.status === "resolved_for_exact_iskcon_reference_profile";
    results.push({
      observanceSlug: row.observance_slug,
      canonicalName: lane === "smarta" ? row.smarta_name : row.iskcon_name,
      ruleId: `ekadashi-2026-${profile.profile_id}-${lane}-${row.observance_slug}-v1`,
      rulesetVersion,
      status: "resolved_for_exact_2026_city_tradition_profile",
      lane,
      profileId: profile.profile_id,
      referenceLocation: profile.reference_location,
      selectedCivilDate,
      appliesToRequestedDate: selectedCivilDate === request.civilDate,
      classification,
      targetTithi: row.target_tithi,
      candidateDays,
      precedence: {
        kind: lane === "smarta" ? "exact_reference_profile_current_smarta_calendar_selection" : "exact_reference_profile_current_iskcon_calendar_selection_with_validated_parana",
        explanation: lane === "smarta"
          ? `The ${profile.reference_location} Smarta date is resolved only from the frozen current practitioner fixture and retained sunrise/arunodaya diagnostics. Smarta parana remains unresolved until the named date has its own Hari Vasara-aware fixture.`
          : `The ${profile.reference_location} ISKCON date and next-morning parana are resolved only for this exact reference profile. The provider classification ${classification.replaceAll("_", " ")} is preserved without claiming a complete GCal or textual Mahadwadashi engine.`,
      },
      parana,
      evidence: {
        fixtureId: FIXTURE.fixture_id,
        fixtureSha256: FIXTURE_SHA256,
        historicalWork: "Nirnayasindhu",
        historicalEdition: "Marathi translation, Mumbai 1865",
        historicalCarrierSha256: HISTORICAL_SOURCE_SHA256,
        historicalPdfPages: Array.from({ length: 16 }, (_, index) => index + 52),
        currentSourceIds: currentSourceIds(profile, lane),
        sourceScopeNote: "The fixed historical chapter preserves branching Smarta, Vaishnava, arunodaya, shuddha/viddha, Mahadwadashi, Dvadashi-preservation, and parana context. Current practitioner calendars provide only the bounded city/tradition dates and, for ISKCON, the checked parana windows. No source text or fasting procedure is served.",
        rightsLanes: ["private_evidence", "reference_only"],
        sourceTextReturnedByApi: false,
        tithiBoundsLocal: { begins: row.tithi_begins_local, ends: row.tithi_ends_local },
      },
      boundaries: {
        completeDayCoverage: false,
        completeSeptemberDecemberCoverage: false,
        modernPracticeResolved: false,
        ritualGuidanceIncluded: false,
        universalTraditionClaim: false,
        smartaDateResolved: lane === "smarta",
        vaishnavaDateResolved: lane === "vaishnava-iskcon",
        paranaResolved,
        fastingFoodGuidanceResolved: false,
        medicalGuidanceIncluded: false,
        completeNirnayasindhuRuleEngine: false,
        completeGcalRuleEngine: false,
      },
    });
  }
  return results;
}

export const ekadashiFixtureIdentity = {
  fixtureId: FIXTURE.fixture_id,
  sha256: FIXTURE_SHA256,
  sourceCount: FIXTURE.sources.length,
  observanceCount: FIXTURE.observances.length,
  profileCount: FIXTURE.scope.profiles.length,
} as const;

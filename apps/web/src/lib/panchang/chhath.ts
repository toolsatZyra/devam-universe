import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PanchangFact, PanchangRequest } from "./contracts";
import { calculatePanchang, calculateTithiAtInstant, type TithiInstantFact } from "./engine";

const FIXTURE_SHA256 = "b7eaedaf748be5a721b21a663799f56787cff7ded4afd402d638108c62b9b53e";
const CONTRACT = "DEVAM_CHHATH_DATE_EVIDENCE_FIXTURE_V1" as const;
const TRADITION_CODE = "surya-chhath-bihar-purvanchal" as const;
const CANDIDATE_DATES = ["2026-11-14", "2026-11-15"] as const;

type Fixture = {
  contract: typeof CONTRACT;
  fixture_id: "devam-chhath-patna-delhi-2026-v1";
  scope: {
    timezone: "Asia/Kolkata";
    tradition_code: typeof TRADITION_CODE;
    profiles: Array<{ profile_id: string; reference_location: string; geoname_id: number; latitude: number; longitude: number }>;
    coordinate_tolerance_degrees: number;
    outside_exact_profiles: "fail_closed";
    universal_india_claim: false;
  };
  sources: Array<{ source_id: string; publisher: string; url: string; status: 200; final_url: string; response_bytes: number; response_sha256: string; strict_utf8: true; rights_lane: "reference_only"; evidence_role: string }>;
  decision: {
    observance_slug: "chhath-puja-sandhya-arghya";
    canonical_name: string;
    target_tithi: { index: 6; name: "Shashthi"; paksha: "shukla" };
    candidate_civil_dates: ["2026-11-14", "2026-11-15"];
    selection: "select_only_when_exactly_one_candidate_sunset_has_kartika_shukla_shashthi";
    selected_civil_date: "2026-11-15";
    following_usha_arghya_civil_date: "2026-11-16";
    both_candidates_qualify: "fail_closed";
    neither_candidate_qualifies: "fail_closed";
  };
  sequence: Array<{ ordinal: number; civil_date: string; name_en: string; name_hi: string; provider_tithi_label: string }>;
  boundaries: Record<string, boolean>;
};

export type ChhathResolution<RulesetVersion extends string> = {
  observanceSlug: "chhath-puja-sandhya-arghya";
  canonicalName: string;
  ruleId: "devam-chhath-kartika-shukla-shashthi-at-sunset-exact-profiles-v1";
  rulesetVersion: RulesetVersion;
  status: "resolved_for_exact_chhath_reference_profile";
  selectedCivilDate: "2026-11-15";
  appliesToRequestedDate: true;
  targetTithi: { index: 6; name: "Shashthi"; paksha: "shukla" };
  profile: { profileId: string; referenceLocation: string };
  sequenceDay: { ordinal: number; civilDate: string; nameEn: string; nameHi: string; providerTithiLabel: string };
  candidateDays: Array<{ civilDate: string; sunsetUtc: string; tithiAtSunset: TithiInstantFact; qualifies: boolean }>;
  followingUshaArghya: { civilDate: "2026-11-16"; sunriseUtc: string };
  precedence: { kind: "unique_shukla_shashthi_at_local_sunset"; explanation: string };
  evidence: {
    fixtureId: string;
    fixtureSha256: typeof FIXTURE_SHA256;
    evidenceStatus: "official_regional_identity_plus_current_practitioner_two_city_fixture";
    rightsLane: "reference_only";
    sourceTextReturnedByApi: false;
    sources: Fixture["sources"];
  };
  boundaries: {
    completeDayCoverage: false;
    completeSeptemberDecemberCoverage: false;
    modernPracticeResolved: false;
    ritualGuidanceIncluded: false;
    universalTraditionClaim: false;
    completeFamilyVrataProcedureClaimed: false;
    fastingOrNirjalaRegimenPrescribed: false;
  };
};

function loadFixture(): Fixture {
  const path = resolve(process.cwd(), "../..", "knowledge_packs/panchang/chhath-patna-delhi-2026-v1.json");
  const bytes = readFileSync(path);
  const actual = createHash("sha256").update(bytes).digest("hex");
  if (actual !== FIXTURE_SHA256) throw new Error(`Chhath fixture drift: ${actual}`);
  const fixture = JSON.parse(bytes.toString("utf8")) as Fixture;
  if (fixture.contract !== CONTRACT || fixture.fixture_id !== "devam-chhath-patna-delhi-2026-v1") throw new Error("Chhath fixture identity drift");
  if (fixture.scope.timezone !== "Asia/Kolkata" || fixture.scope.tradition_code !== TRADITION_CODE || fixture.scope.profiles.length !== 2 || fixture.scope.coordinate_tolerance_degrees !== 0.0001 || fixture.scope.outside_exact_profiles !== "fail_closed" || fixture.scope.universal_india_claim !== false) throw new Error("Chhath scope drift");
  const expectedProfiles = [
    ["patna-bihar", "Patna, Bihar, India", 1260086, 25.5941, 85.1376],
    ["delhi-purvanchal-diaspora", "Delhi, NCT, India", 1273294, 28.6139, 77.209],
  ];
  if (JSON.stringify(fixture.scope.profiles.map((profile) => [profile.profile_id, profile.reference_location, profile.geoname_id, profile.latitude, profile.longitude])) !== JSON.stringify(expectedProfiles)) throw new Error("Chhath profile universe drift");
  if (fixture.sources.length !== 5 || new Set(fixture.sources.map((source) => source.source_id)).size !== 5 || fixture.sources.some((source) => source.status !== 200 || source.final_url !== source.url || source.response_bytes <= 0 || !/^[a-f0-9]{64}$/.test(source.response_sha256) || source.strict_utf8 !== true || source.rights_lane !== "reference_only")) throw new Error("Chhath source evidence drift");
  if (fixture.decision.observance_slug !== "chhath-puja-sandhya-arghya" || fixture.decision.target_tithi.index !== 6 || fixture.decision.target_tithi.name !== "Shashthi" || fixture.decision.target_tithi.paksha !== "shukla" || JSON.stringify(fixture.decision.candidate_civil_dates) !== JSON.stringify(CANDIDATE_DATES) || fixture.decision.selection !== "select_only_when_exactly_one_candidate_sunset_has_kartika_shukla_shashthi" || fixture.decision.selected_civil_date !== "2026-11-15" || fixture.decision.following_usha_arghya_civil_date !== "2026-11-16" || fixture.decision.both_candidates_qualify !== "fail_closed" || fixture.decision.neither_candidate_qualifies !== "fail_closed") throw new Error("Chhath decision drift");
  if (fixture.sequence.map((day) => `${day.ordinal}:${day.civil_date}`).join("|") !== "1:2026-11-13|2:2026-11-14|3:2026-11-15|4:2026-11-16") throw new Error("Chhath sequence drift");
  const requiredTrue = ["date_and_four_day_sequence_resolved_for_exact_profiles", "official_regional_identity_bound"];
  const requiredFalse = ["source_text_returned_by_api", "fasting_or_nirjala_regimen_prescribed", "complete_family_vrata_procedure_claimed", "all_bihar_purvanchal_nepal_and_diaspora_variants_complete", "generic_national_chhath_rule_claimed", "medical_suitability_claimed"];
  if (requiredTrue.some((key) => fixture.boundaries[key] !== true) || requiredFalse.some((key) => fixture.boundaries[key] !== false)) throw new Error("Chhath boundary drift");
  return fixture;
}

const fixture = loadFixture();

function exactProfile(request: PanchangRequest) {
  if (request.timezone !== fixture.scope.timezone || request.traditionCode !== TRADITION_CODE) return null;
  return fixture.scope.profiles.find((profile) =>
    Math.abs(request.latitude - profile.latitude) <= fixture.scope.coordinate_tolerance_degrees
    && Math.abs(request.longitude - profile.longitude) <= fixture.scope.coordinate_tolerance_degrees,
  ) ?? null;
}

export function resolveChhathObservance<RulesetVersion extends string>(request: PanchangRequest, rulesetVersion: RulesetVersion): ChhathResolution<RulesetVersion>[] {
  const profile = exactProfile(request);
  const sequenceDay = fixture.sequence.find((day) => day.civil_date === request.civilDate);
  if (!profile || !sequenceDay) return [];
  const candidateFacts = CANDIDATE_DATES.map((civilDate) => calculatePanchang({ ...request, civilDate }));
  const ushaFact = calculatePanchang({ ...request, civilDate: "2026-11-16" });
  if (candidateFacts.some((fact) => !fact) || !ushaFact) return [];
  const candidateDays = (candidateFacts as PanchangFact[]).map((fact) => {
    const tithiAtSunset = calculateTithiAtInstant(fact.sunsetUtc);
    return { civilDate: fact.request.civilDate, sunsetUtc: fact.sunsetUtc, tithiAtSunset, qualifies: tithiAtSunset.index === 6 && tithiAtSunset.paksha === "shukla" };
  });
  const qualifying = candidateDays.filter((day) => day.qualifies);
  if (qualifying.length !== 1 || qualifying[0].civilDate !== fixture.decision.selected_civil_date) return [];
  return [{
    observanceSlug: "chhath-puja-sandhya-arghya",
    canonicalName: fixture.decision.canonical_name,
    ruleId: "devam-chhath-kartika-shukla-shashthi-at-sunset-exact-profiles-v1",
    rulesetVersion,
    status: "resolved_for_exact_chhath_reference_profile",
    selectedCivilDate: "2026-11-15",
    appliesToRequestedDate: true,
    targetTithi: { ...fixture.decision.target_tithi },
    profile: { profileId: profile.profile_id, referenceLocation: profile.reference_location },
    sequenceDay: { ordinal: sequenceDay.ordinal, civilDate: sequenceDay.civil_date, nameEn: sequenceDay.name_en, nameHi: sequenceDay.name_hi, providerTithiLabel: sequenceDay.provider_tithi_label },
    candidateDays,
    followingUshaArghya: { civilDate: "2026-11-16", sunriseUtc: ushaFact.sunriseUtc },
    precedence: {
      kind: "unique_shukla_shashthi_at_local_sunset",
      explanation: `This exact ${profile.reference_location} profile selects 15 November because it is the only candidate sunset bearing Kartika Shukla Shashthi. The four-day provider sequence remains a bounded current fixture, not a universal national rule.`,
    },
    evidence: { fixtureId: fixture.fixture_id, fixtureSha256: FIXTURE_SHA256, evidenceStatus: "official_regional_identity_plus_current_practitioner_two_city_fixture", rightsLane: "reference_only", sourceTextReturnedByApi: false, sources: fixture.sources.map((source) => ({ ...source })) },
    boundaries: { completeDayCoverage: false, completeSeptemberDecemberCoverage: false, modernPracticeResolved: false, ritualGuidanceIncluded: false, universalTraditionClaim: false, completeFamilyVrataProcedureClaimed: false, fastingOrNirjalaRegimenPrescribed: false },
  }];
}

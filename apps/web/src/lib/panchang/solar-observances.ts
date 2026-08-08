import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PanchangFact, PanchangRequest } from "./contracts";

const FIXTURE_SHA256 = "01efb771174a8053d36420de060d673013eb081b4cb149ee4c7299e0878e7fe1" as const;
const FIXTURE_PATH = "knowledge_packs/panchang/kanya-sankranti-vishwakarma-bengal-2026-v1.json";
const SANKRANTI_FIXTURE_SHA256 = "61f14143db751cafc99375871d2304994d7661c433f37bb8e847ae8cef01ca0f" as const;
const SANKRANTI_FIXTURE_PATH = "knowledge_packs/panchang/sankranti-india-september-december-2026-v1.json";

type FetchObservation = {
  fetched_at_utc: string;
  status: 200;
  final_url: string;
  response_bytes: number;
  response_sha256: string;
  strict_utf8: true;
};

type SourceObservation = {
  source_id: string;
  provider: string;
  url: string;
  rights_lane: "reference_only";
  evidence_role: string;
  raw_page_is_dynamic: true;
  fetches: FetchObservation[];
  semantic_observation: Record<string, string | boolean>;
  source_text_returned_by_api: false;
};

type Fixture = {
  contract: "DEVAM_BOUNDED_KANYA_SANKRANTI_VISHWAKARMA_BENGAL_FIXTURE_V1";
  fixture_id: "devam-kanya-sankranti-vishwakarma-bengal-2026-v1";
  scope: {
    reference_location: "Kolkata, West Bengal, India";
    geoname_id: 1275004;
    latitude: 22.5726;
    longitude: 88.3639;
    timezone: "Asia/Kolkata";
    civil_date: "2026-09-17";
    bengal_tradition_code: "regional-bengal";
    location_specific_current_fixture: true;
    universal_india_observance_claim: false;
    all_regional_variants_resolved: false;
    ritual_guidance_included: false;
  };
  astronomical_fixture: {
    engine_id: "devam-panchang";
    engine_version: "astronomy-engine-2.1.19-lahiri-v3";
    ayanamsha: "lahiri_mean_linear_v1";
    from_solar_rashi: "Simha";
    to_solar_rashi: "Kanya";
    expected_ingress_utc: "2026-09-17T02:28:00.000Z";
    expected_ingress_local: "2026-09-17T07:58:00+05:30";
    validation_tolerance_seconds: 600;
    astronomical_ingress_is_not_ritual_procedure: true;
  };
  source_observations: SourceObservation[];
  resolution_contract: {
    kanya_sankranti: {
      identity: string;
      selection: string;
      date_resolved: true;
      punya_kala_resolved: false;
      ritual_guidance_included: false;
    };
    vishwakarma_puja_bengal: {
      identity: string;
      selection: string;
      date_resolved: true;
      puja_time_resolved: false;
      procedure_resolved: false;
      ritual_guidance_included: false;
    };
  };
  denials: Record<string, false>;
};

type SankrantiSource = {
  source_id: "drikpanchang-delhi-sankranti-calendar-2026";
  provider: "Drik Panchang";
  url: string;
  fetched_at_utc: string;
  status: 200;
  final_url: string;
  response_bytes: number;
  response_sha256: string;
  strict_utf8: true;
  raw_page_is_dynamic: true;
  evidence_role: "current_practitioner_india_standard_time_date_and_ingress_moment_fixture";
  rights_lane: "reference_only";
  source_text_returned_by_api: false;
};

type SankrantiRow = {
  observance_slug: "kanya-sankranti" | "tula-sankranti" | "vrishchika-sankranti" | "dhanu-sankranti";
  canonical_name: "Kanya Sankranti" | "Tula Sankranti" | "Vrishchika Sankranti" | "Dhanu Sankranti";
  from_rashi: "Simha" | "Kanya" | "Tula" | "Vrishchika";
  to_rashi: "Kanya" | "Tula" | "Vrishchika" | "Dhanu";
  civil_date: string;
  published_moment_local: string;
  published_moment_utc: string;
};

type SankrantiFixture = {
  contract: "DEVAM_BOUNDED_INDIA_SANKRANTI_DATE_FIXTURE_V1";
  fixture_id: "devam-india-sankranti-september-december-2026-v1";
  scope: {
    reference_location: "Delhi, India";
    geoname_id: 1273294;
    timezone: "Asia/Kolkata";
    civil_date_start: "2026-09-01";
    civil_date_end: "2026-12-31";
    date_identity_only: true;
    punya_kala_resolved: false;
    regional_procedure_resolved: false;
    universal_observance_claim: false;
  };
  source: SankrantiSource;
  engine: { id: "devam-panchang"; version: "astronomy-engine-2.1.19-lahiri-v3"; ayanamsha: "lahiri_mean_linear_v1"; validation_tolerance_seconds: 600 };
  ingresses: SankrantiRow[];
  resolution_contract: {
    selection: string;
    astronomical_ingress_is_observance_identity_only: true;
    punya_kala_resolved: false;
    ritual_guidance_included: false;
    regional_festival_equivalence_resolved: false;
    outside_timezone: "fail_closed";
  };
  denials: Record<string, false>;
};

const EXPECTED_SOURCES = [
  {
    sourceId: "drikpanchang-kolkata-vishwakarma-puja-2026",
    provider: "Drik Panchang",
    url: "https://www.drikpanchang.com/sankranti/vishwakarma-puja-date-time.html?geoname-id=1275004&year=2026",
    role: "current_practitioner_kolkata_identity_kanya_sankranti_link_and_date_fixture",
    fetches: [
      ["2026-08-06T19:24:36.994Z", 72184, "5ac783c69df3ce8bfa83099b79681ff70dd9e588db79b3c7ee13b864ee333364"],
      ["2026-08-06T19:24:37.602Z", 72184, "f49fbd2fc8af2600d54b7a8450e564df61c7265ea8dc4b6e6909344c397b6be8"],
    ],
  },
  {
    sourceId: "west-bengal-msme-holiday-list-2026",
    provider: "Directorate of Micro, Small & Medium Enterprises, Government of West Bengal",
    url: "https://msme.wb.gov.in/cmsholiday",
    role: "official_current_west_bengal_calendar_date_corroboration",
    fetches: [
      ["2026-08-06T19:24:37.709Z", 72738, "89119432e0e35ae0ab095aad8d58a2992d7fcc13a8160b6542c317b5a511f499"],
      ["2026-08-06T19:24:38.589Z", 72738, "b5f0a409bfe4bccb97fbc784192b37108ba87572c701e71d089beeb8cf320f19"],
    ],
  },
] as const;

function loadFixture(): Fixture {
  const path = resolve(process.cwd(), "../..", FIXTURE_PATH);
  const bytes = readFileSync(path);
  if (createHash("sha256").update(bytes).digest("hex") !== FIXTURE_SHA256) throw new Error("Kanya Sankranti/Vishwakarma fixture hash drift");
  const fixture = JSON.parse(bytes.toString("utf8")) as Fixture;
  if (fixture.contract !== "DEVAM_BOUNDED_KANYA_SANKRANTI_VISHWAKARMA_BENGAL_FIXTURE_V1" || fixture.fixture_id !== "devam-kanya-sankranti-vishwakarma-bengal-2026-v1") throw new Error("Kanya Sankranti/Vishwakarma fixture identity drift");
  const scope = fixture.scope;
  if (scope.reference_location !== "Kolkata, West Bengal, India" || scope.geoname_id !== 1275004 || scope.latitude !== 22.5726 || scope.longitude !== 88.3639 || scope.timezone !== "Asia/Kolkata" || scope.civil_date !== "2026-09-17" || scope.bengal_tradition_code !== "regional-bengal" || !scope.location_specific_current_fixture || scope.universal_india_observance_claim || scope.all_regional_variants_resolved || scope.ritual_guidance_included) throw new Error("Kanya Sankranti/Vishwakarma scope drift");
  const astronomy = fixture.astronomical_fixture;
  if (astronomy.engine_id !== "devam-panchang" || astronomy.engine_version !== "astronomy-engine-2.1.19-lahiri-v3" || astronomy.ayanamsha !== "lahiri_mean_linear_v1" || astronomy.from_solar_rashi !== "Simha" || astronomy.to_solar_rashi !== "Kanya" || astronomy.expected_ingress_utc !== "2026-09-17T02:28:00.000Z" || astronomy.expected_ingress_local !== "2026-09-17T07:58:00+05:30" || astronomy.validation_tolerance_seconds !== 600 || !astronomy.astronomical_ingress_is_not_ritual_procedure) throw new Error("Kanya Sankranti astronomical fixture drift");
  if (fixture.source_observations.length !== EXPECTED_SOURCES.length) throw new Error("Kanya Sankranti/Vishwakarma source universe drift");
  fixture.source_observations.forEach((source, sourceIndex) => {
    const expected = EXPECTED_SOURCES[sourceIndex];
    if (source.source_id !== expected.sourceId || source.provider !== expected.provider || source.url !== expected.url || source.evidence_role !== expected.role || source.rights_lane !== "reference_only" || source.raw_page_is_dynamic !== true || source.source_text_returned_by_api !== false || source.fetches.length !== 2) throw new Error(`Kanya Sankranti/Vishwakarma source drift: ${source.source_id}`);
    source.fetches.forEach((fetch, fetchIndex) => {
      const expectedFetch = expected.fetches[fetchIndex];
      if (fetch.fetched_at_utc !== expectedFetch[0] || fetch.status !== 200 || fetch.final_url !== expected.url || fetch.response_bytes !== expectedFetch[1] || fetch.response_sha256 !== expectedFetch[2] || fetch.strict_utf8 !== true) throw new Error(`Kanya Sankranti/Vishwakarma fetch drift: ${source.source_id}/${fetchIndex}`);
    });
  });
  const practitioner = fixture.source_observations[0].semantic_observation;
  if (practitioner.title !== "2026 Vishwakarma Puja Date and Time for Kolkata, West Bengal, India" || practitioner.civil_date !== "2026-09-17" || practitioner.weekday !== "Thursday" || practitioner.sankranti_moment_local !== "07:58" || practitioner.states_last_day_of_bengali_bhadra !== true || practitioner.states_bhadra_sankranti_or_kanya_sankranti !== true) throw new Error("Vishwakarma practitioner semantics drift");
  const official = fixture.source_observations[1].semantic_observation;
  if (official.owner_literal !== "Micro ,Small & Medium Enterprises, Government of West Bengal" || official.holiday_literal !== "Viswakarma Puja" || official.civil_date_literal !== "17-09-2026") throw new Error("West Bengal official calendar semantics drift");
  const contracts = fixture.resolution_contract;
  if (!contracts.kanya_sankranti.date_resolved || contracts.kanya_sankranti.punya_kala_resolved || contracts.kanya_sankranti.ritual_guidance_included || !contracts.vishwakarma_puja_bengal.date_resolved || contracts.vishwakarma_puja_bengal.puja_time_resolved || contracts.vishwakarma_puja_bengal.procedure_resolved || contracts.vishwakarma_puja_bengal.ritual_guidance_included) throw new Error("Kanya Sankranti/Vishwakarma resolution contract drift");
  if (Object.keys(fixture.denials).length !== 13 || Object.values(fixture.denials).some((value) => value !== false)) throw new Error("Kanya Sankranti/Vishwakarma denial drift");
  return fixture;
}

const FIXTURE = loadFixture();

function loadSankrantiFixture(): SankrantiFixture {
  const path = resolve(process.cwd(), "../..", SANKRANTI_FIXTURE_PATH);
  const bytes = readFileSync(path);
  if (createHash("sha256").update(bytes).digest("hex") !== SANKRANTI_FIXTURE_SHA256) throw new Error("Launch Sankranti fixture hash drift");
  const fixture = JSON.parse(bytes.toString("utf8")) as SankrantiFixture;
  if (fixture.contract !== "DEVAM_BOUNDED_INDIA_SANKRANTI_DATE_FIXTURE_V1" || fixture.fixture_id !== "devam-india-sankranti-september-december-2026-v1") throw new Error("Launch Sankranti fixture identity drift");
  const scope = fixture.scope;
  if (scope.reference_location !== "Delhi, India" || scope.geoname_id !== 1273294 || scope.timezone !== "Asia/Kolkata" || scope.civil_date_start !== "2026-09-01" || scope.civil_date_end !== "2026-12-31" || !scope.date_identity_only || scope.punya_kala_resolved || scope.regional_procedure_resolved || scope.universal_observance_claim) throw new Error("Launch Sankranti fixture scope drift");
  const source = fixture.source;
  const expectedUrl = "https://www.drikpanchang.com/sankranti/sankranti.html?geoname-id=1273294&year=2026";
  if (source.source_id !== "drikpanchang-delhi-sankranti-calendar-2026" || source.provider !== "Drik Panchang" || source.url !== expectedUrl || source.final_url !== expectedUrl || source.status !== 200 || source.response_bytes !== 90449 || source.response_sha256 !== "084c211dc85fbe2a5f0333ed6c07d5ba54b5e25b3fd5ace5aeb168e0e306c97e" || source.strict_utf8 !== true || source.raw_page_is_dynamic !== true || source.evidence_role !== "current_practitioner_india_standard_time_date_and_ingress_moment_fixture" || source.rights_lane !== "reference_only" || source.source_text_returned_by_api !== false) throw new Error("Launch Sankranti source drift");
  if (fixture.engine.id !== "devam-panchang" || fixture.engine.version !== "astronomy-engine-2.1.19-lahiri-v3" || fixture.engine.ayanamsha !== "lahiri_mean_linear_v1" || fixture.engine.validation_tolerance_seconds !== 600) throw new Error("Launch Sankranti engine contract drift");
  const expectedRows = [
    ["kanya-sankranti", "Kanya Sankranti", "Simha", "Kanya", "2026-09-17", "2026-09-17T02:28:00.000Z"],
    ["tula-sankranti", "Tula Sankranti", "Kanya", "Tula", "2026-10-17", "2026-10-17T14:27:00.000Z"],
    ["vrishchika-sankranti", "Vrishchika Sankranti", "Tula", "Vrishchika", "2026-11-16", "2026-11-16T14:18:00.000Z"],
    ["dhanu-sankranti", "Dhanu Sankranti", "Vrishchika", "Dhanu", "2026-12-16", "2026-12-16T04:59:00.000Z"],
  ];
  if (JSON.stringify(fixture.ingresses.map((row) => [row.observance_slug, row.canonical_name, row.from_rashi, row.to_rashi, row.civil_date, row.published_moment_utc])) !== JSON.stringify(expectedRows)) throw new Error("Launch Sankranti ingress universe drift");
  const contract = fixture.resolution_contract;
  if (contract.selection !== "assign_the_local_civil_date_containing_the_validated_sidereal_solar_ingress_for_Asia_Kolkata" || !contract.astronomical_ingress_is_observance_identity_only || contract.punya_kala_resolved || contract.ritual_guidance_included || contract.regional_festival_equivalence_resolved || contract.outside_timezone !== "fail_closed") throw new Error("Launch Sankranti resolution contract drift");
  if (Object.keys(fixture.denials).length !== 8 || Object.values(fixture.denials).some((value) => value !== false)) throw new Error("Launch Sankranti denial drift");
  return fixture;
}

const SANKRANTI_FIXTURE = loadSankrantiFixture();

function localCivilDate(instantIso: string, timezone: string): string {
  const parts = new Intl.DateTimeFormat("en", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(instantIso));
  const value = (type: "year" | "month" | "day") => parts.find((part) => part.type === type)?.value;
  return `${value("year")}-${value("month")}-${value("day")}`;
}

export type SolarObservanceResolution<TVersion extends string = string> = {
  observanceSlug: "kanya-sankranti" | "tula-sankranti" | "vrishchika-sankranti" | "dhanu-sankranti" | "vishwakarma-puja-bengal";
  canonicalName: "Kanya Sankranti" | "Tula Sankranti" | "Vrishchika Sankranti" | "Dhanu Sankranti" | "Vishwakarma Puja · Bengal";
  ruleId: "solar-ingress-kanya-local-civil-date-v1" | "solar-ingress-tula-local-civil-date-v1" | "solar-ingress-vrishchika-local-civil-date-v1" | "solar-ingress-dhanu-local-civil-date-v1" | "bengal-vishwakarma-on-kanya-sankranti-v1";
  rulesetVersion: TVersion;
  status: "resolved_for_bounded_2026_candidate_window";
  selectedCivilDate: string;
  appliesToRequestedDate: true;
  solarIngress: { fromRashi: string; toRashi: string; occursAtUtc: string; occursOnLocalCivilDate: string };
  precedence: { kind: "local_solar_ingress" | "bengal_regional_observance_on_validated_kanya_ingress"; explanation: string };
  evidence: {
    evidenceStatus: "deterministic_astronomy_plus_current_practitioner_calendar" | "deterministic_astronomy_plus_current_practitioner_and_official_regional_calendar";
    semanticFixtureSha256: string;
    sourceScopeNote: string;
    rightsLane: "reference_only";
    sourceTextReturnedByApi: false;
    references: Array<SourceObservation | SankrantiSource>;
  };
  boundaries: {
    completeDayCoverage: false;
    completeSeptemberDecemberCoverage: false;
    modernPracticeResolved: false;
    ritualGuidanceIncluded: false;
    universalTraditionClaim: false;
  };
};

const SOLAR_RULE_IDS = {
  "kanya-sankranti": "solar-ingress-kanya-local-civil-date-v1",
  "tula-sankranti": "solar-ingress-tula-local-civil-date-v1",
  "vrishchika-sankranti": "solar-ingress-vrishchika-local-civil-date-v1",
  "dhanu-sankranti": "solar-ingress-dhanu-local-civil-date-v1",
} as const;

export function resolveSolarObservances<TVersion extends string>(request: PanchangRequest, fact: PanchangFact, rulesetVersion: TVersion): SolarObservanceResolution<TVersion>[] {
  if (request.timezone !== SANKRANTI_FIXTURE.scope.timezone) return [];
  const transition = fact.solarRashi;
  const row = SANKRANTI_FIXTURE.ingresses.find((candidate) => candidate.from_rashi === transition.name && candidate.to_rashi === transition.nextName);
  if (!row) return [];
  const transitionCivilDate = localCivilDate(transition.endsAtUtc, request.timezone);
  if (transitionCivilDate !== request.civilDate || transitionCivilDate !== row.civil_date) return [];
  const differenceSeconds = Math.abs(Date.parse(transition.endsAtUtc) - Date.parse(row.published_moment_utc)) / 1000;
  if (differenceSeconds > SANKRANTI_FIXTURE.engine.validation_tolerance_seconds) throw new Error(`${row.canonical_name} ingress drift exceeds the frozen fixture tolerance`);

  const boundaries = { completeDayCoverage: false, completeSeptemberDecemberCoverage: false, modernPracticeResolved: false, ritualGuidanceIncluded: false, universalTraditionClaim: false } as const;
  if (row.observance_slug !== "kanya-sankranti") {
    return [{
      observanceSlug: row.observance_slug,
      canonicalName: row.canonical_name,
      ruleId: SOLAR_RULE_IDS[row.observance_slug],
      rulesetVersion,
      status: "resolved_for_bounded_2026_candidate_window",
      selectedCivilDate: transitionCivilDate,
      appliesToRequestedDate: true,
      solarIngress: { fromRashi: row.from_rashi, toRashi: row.to_rashi, occursAtUtc: transition.endsAtUtc, occursOnLocalCivilDate: transitionCivilDate },
      precedence: {
        kind: "local_solar_ingress",
        explanation: `The deterministic sidereal Sun enters ${row.to_rashi} on this India Standard Time civil date. This resolves the Sankranti date identity only, not punya-kala, regional festival equivalence, or ritual practice.`,
      },
      evidence: {
        evidenceStatus: "deterministic_astronomy_plus_current_practitioner_calendar",
        semanticFixtureSha256: SANKRANTI_FIXTURE_SHA256,
        sourceScopeNote: "The engine supplies the ingress fact and the current Delhi calendar corroborates the 2026 India Standard Time date and moment. No historical prescription, punya-kala, or regional procedure is inferred.",
        rightsLane: "reference_only",
        sourceTextReturnedByApi: false,
        references: [SANKRANTI_FIXTURE.source],
      },
      boundaries,
    }];
  }

  const common = {
    rulesetVersion,
    status: "resolved_for_bounded_2026_candidate_window" as const,
    selectedCivilDate: transitionCivilDate,
    appliesToRequestedDate: true as const,
    solarIngress: { fromRashi: row.from_rashi, toRashi: row.to_rashi, occursAtUtc: transition.endsAtUtc, occursOnLocalCivilDate: transitionCivilDate },
    evidence: {
      evidenceStatus: "deterministic_astronomy_plus_current_practitioner_and_official_regional_calendar" as const,
      semanticFixtureSha256: FIXTURE_SHA256,
      rightsLane: "reference_only" as const,
      sourceTextReturnedByApi: false as const,
      references: FIXTURE.source_observations,
    },
    boundaries,
  };

  const results: SolarObservanceResolution<TVersion>[] = [{
    ...common,
    observanceSlug: "kanya-sankranti",
    canonicalName: "Kanya Sankranti",
    ruleId: "solar-ingress-kanya-local-civil-date-v1",
    precedence: {
      kind: "local_solar_ingress",
      explanation: "The deterministic sidereal Sun enters Kanya on this local civil date. This resolves the ingress date only, not punya-kala or ritual practice.",
    },
    evidence: {
      ...common.evidence,
      sourceScopeNote: "The engine supplies the ingress fact; the current Kolkata practitioner page corroborates the 2026 date and moment. No historical text authority or punya-kala is inferred.",
    },
  }];

  if (request.traditionCode === FIXTURE.scope.bengal_tradition_code) {
    results.push({
      ...common,
      observanceSlug: "vishwakarma-puja-bengal",
      canonicalName: "Vishwakarma Puja · Bengal",
      ruleId: "bengal-vishwakarma-on-kanya-sankranti-v1",
      precedence: {
        kind: "bengal_regional_observance_on_validated_kanya_ingress",
        explanation: "In this Bengal regional lane, the current practitioner identity and the official West Bengal calendar place Vishwakarma Puja on the validated Kanya Sankranti date.",
      },
      evidence: {
        ...common.evidence,
        sourceScopeNote: "The official calendar corroborates the Bengal date; the practitioner page supplies the Kanya Sankranti identity link. Neither source supplies a complete puja procedure or a universal Indian rule.",
      },
    });
  }
  return results;
}

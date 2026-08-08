import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const FIXTURE_SHA256 = "c88547ab6e858c28ed6b60f209ff26ca1194d1e6820e3c5c6fce958b72d7347a";
const NIRNAYASINDHU_PDF_SHA256 = "a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b";
const DRIK_URL = "https://www.drikpanchang.com/festivals/dhanteras/festivals-dhanteras-puja-timings.html?geoname-id=1261481&year=2026";
const DD_URL = "https://www.newsonair.gov.in/dhanteras-auspicious-day-for-worship-and-new-purchases/";
const DD_FINAL_URL = "https://newsonair.gov.in/dhanteras-auspicious-day-for-worship-and-new-purchases/";
const SUPPORTED_TRADITIONS = ["smarta-north-india", "smarta-west-india"] as const;

type FetchObservation = {
  fetched_at_utc: string;
  status: 200;
  final_url: string;
  response_bytes: number;
  response_sha256: string;
  strict_utf8: true;
};

type LiveSource = {
  source_id: string;
  provider: string;
  url: string;
  rights_lane: "reference_only";
  evidence_role: string;
  fetches: FetchObservation[];
  semantic_observation: Record<string, string | boolean>;
  source_text_returned_by_api: false;
};

type Fixture = {
  contract: "DEVAM_DHANTRAYODASHI_DATE_EVIDENCE_FIXTURE_V1";
  fixture_id: "devam-dhantrayodashi-delhi-2026-v1";
  scope: {
    reference_location: "New Delhi, NCT, India";
    geoname_id: 1261481;
    timezone: "Asia/Kolkata";
    candidate_civil_dates: ["2026-11-05", "2026-11-06"];
    supported_tradition_codes: string[];
    date_resolved_by_devam: true;
    precise_puja_muhurta_calculated: false;
    ritual_guidance_included: false;
    universal_india_claim: false;
  };
  live_sources: LiveSource[];
  fixed_adjacent_evidence: {
    source_id: string;
    provider: string;
    object_sha256: string;
    object_bytes: number;
    media_type: "application/pdf";
    rights_lane: "private_evidence";
    visually_inspected_pdf_pages: number[];
    evidence_role: string;
    source_text_returned_by_api: false;
  };
  decision: {
    observance_slug: "dhantrayodashi";
    canonical_name: "Dhantrayodashi / Dhanteras";
    target_tithi: "Trayodashi";
    target_paksha: "krishna";
    decision_window: "pradosha";
    selection: string;
    selected_civil_date: "2026-11-06";
    both_candidates_overlap: "fail_closed";
    neither_candidate_overlaps: "fail_closed";
    bounded_pradosha_is_not_equivalent_to_provider_sthir_lagna_muhurta: true;
    dhantrayodashi_and_yama_deepam_remain_separate_records: true;
  };
  associations: {
    dhanvantari_jayanti: string;
    lakshmi_and_kubera_worship: string;
    yama_deepam: string;
  };
  denials: Record<string, false>;
};

function assertFetches(source: LiveSource, expected: readonly (readonly [string, string, number, string])[]): void {
  if (source.fetches.length !== expected.length) throw new Error(`Dhantrayodashi fetch universe drift: ${source.source_id}`);
  source.fetches.forEach((fetch, index) => {
    const row = expected[index];
    if (fetch.fetched_at_utc !== row[0] || fetch.status !== 200 || fetch.final_url !== row[1] || fetch.response_bytes !== row[2] || fetch.response_sha256 !== row[3] || fetch.strict_utf8 !== true) throw new Error(`Dhantrayodashi fetch drift: ${source.source_id}/${index}`);
  });
}

function loadFixture(): Fixture {
  const path = resolve(process.cwd(), "../..", "knowledge_packs/panchang/dhantrayodashi-delhi-2026-v1.json");
  const bytes = readFileSync(path);
  if (createHash("sha256").update(bytes).digest("hex") !== FIXTURE_SHA256) throw new Error("Dhantrayodashi fixture hash drift");
  const fixture = JSON.parse(bytes.toString("utf8")) as Fixture;
  if (fixture.contract !== "DEVAM_DHANTRAYODASHI_DATE_EVIDENCE_FIXTURE_V1" || fixture.fixture_id !== "devam-dhantrayodashi-delhi-2026-v1") throw new Error("Dhantrayodashi fixture identity drift");
  const scope = fixture.scope;
  if (scope.reference_location !== "New Delhi, NCT, India" || scope.geoname_id !== 1261481 || scope.timezone !== "Asia/Kolkata" || JSON.stringify(scope.candidate_civil_dates) !== JSON.stringify(["2026-11-05", "2026-11-06"]) || JSON.stringify(scope.supported_tradition_codes) !== JSON.stringify(SUPPORTED_TRADITIONS) || scope.date_resolved_by_devam !== true || scope.precise_puja_muhurta_calculated || scope.ritual_guidance_included || scope.universal_india_claim) throw new Error("Dhantrayodashi scope drift");
  if (fixture.live_sources.length !== 2) throw new Error("Dhantrayodashi live source universe drift");
  const drik = fixture.live_sources[0];
  if (drik.source_id !== "drikpanchang-new-delhi-dhanteras-2026" || drik.provider !== "Drik Panchang" || drik.url !== DRIK_URL || drik.rights_lane !== "reference_only" || drik.evidence_role !== "current_practitioner_identity_location_specific_date_tithi_pradosha_and_sthir_lagna_fixture" || drik.source_text_returned_by_api !== false) throw new Error("Dhantrayodashi Drik identity drift");
  assertFetches(drik, [
    ["2026-08-06T20:14:25.459Z", DRIK_URL, 81810, "121255bba72fc486def14da6042e5dfb94556cac9b8b8ff92b489e36573e9471"],
    ["2026-08-06T20:14:25.767Z", DRIK_URL, 81810, "121255bba72fc486def14da6042e5dfb94556cac9b8b8ff92b489e36573e9471"],
  ]);
  const drikObservation = drik.semantic_observation;
  if (drikObservation.civil_date !== "2026-11-06" || drikObservation.weekday !== "Friday" || drikObservation.dhanteras_puja_begins_local !== "18:02" || drikObservation.dhanteras_puja_ends_local !== "19:57" || drikObservation.pradosha_begins_local !== "17:33" || drikObservation.pradosha_ends_local !== "20:09" || drikObservation.vrishabha_sthir_lagna_begins_local !== "18:02" || drikObservation.vrishabha_sthir_lagna_ends_local !== "19:57" || drikObservation.trayodashi_begins_local !== "2026-11-06T10:30:00+05:30" || drikObservation.trayodashi_ends_local !== "2026-11-07T10:47:00+05:30" || drikObservation.precise_provider_muhurta_requires_trayodashi_pradosha_and_sthir_lagna !== true || drikObservation.dhanvantari_jayanti_associated !== true || drikObservation.yama_deepam_identified_as_another_ritual_on_trayodashi !== true) throw new Error("Dhantrayodashi Drik semantic drift");
  const dd = fixture.live_sources[1];
  if (dd.source_id !== "dd-news-on-air-dhanteras-identity-2026" || dd.provider !== "DD News On Air" || dd.url !== DD_URL || dd.rights_lane !== "reference_only" || dd.evidence_role !== "official_public_broadcaster_identity_and_association_context_not_date_rule_authority" || dd.source_text_returned_by_api !== false) throw new Error("Dhantrayodashi DD identity drift");
  assertFetches(dd, [
    ["2026-08-06T20:14:25.861Z", DD_FINAL_URL, 69946, "d410e9e0692adb3457a979dcc7f188d2d8341cded12fbd30ee5b0fe0b0200524"],
    ["2026-08-06T20:14:26.649Z", DD_FINAL_URL, 69946, "d410e9e0692adb3457a979dcc7f188d2d8341cded12fbd30ee5b0fe0b0200524"],
  ]);
  const ddObservation = dd.semantic_observation;
  if (ddObservation.dhanteras_alias_dhan_trayodashi !== true || ddObservation.dhanvantari_jayanti_associated !== true || ddObservation.dhanvantari_kubera_and_lakshmi_worship_associated !== true || ddObservation.krishna_paksha_trayodashi_identity !== true || ddObservation.five_day_festival_sequence_context !== true) throw new Error("Dhantrayodashi DD semantic drift");
  const historical = fixture.fixed_adjacent_evidence;
  if (historical.source_id !== "nirnayasindhu-marathi-1865-kartika-trayodashi-yama-deepa" || historical.provider !== "Devam retained source vault" || historical.object_sha256 !== NIRNAYASINDHU_PDF_SHA256 || historical.object_bytes !== 93531683 || historical.media_type !== "application/pdf" || historical.rights_lane !== "private_evidence" || JSON.stringify(historical.visually_inspected_pdf_pages) !== "[213]" || historical.evidence_role !== "historical_adjacent_yama_deepam_trayodashi_context_not_dhanteras_identity_or_sthir_lagna_authority" || historical.source_text_returned_by_api !== false) throw new Error("Dhantrayodashi adjacent evidence drift");
  const decision = fixture.decision;
  if (decision.observance_slug !== "dhantrayodashi" || decision.canonical_name !== "Dhantrayodashi / Dhanteras" || decision.target_tithi !== "Trayodashi" || decision.target_paksha !== "krishna" || decision.decision_window !== "pradosha" || decision.selection !== "select_only_when_exactly_one_candidate_civil_evening_has_krishna_trayodashi_overlap_with_the_bounded_pradosha_window" || decision.selected_civil_date !== "2026-11-06" || decision.both_candidates_overlap !== "fail_closed" || decision.neither_candidate_overlaps !== "fail_closed" || !decision.bounded_pradosha_is_not_equivalent_to_provider_sthir_lagna_muhurta || !decision.dhantrayodashi_and_yama_deepam_remain_separate_records) throw new Error("Dhantrayodashi decision drift");
  if (fixture.associations.dhanvantari_jayanti !== "associated_identity_not_a_medical_advice_lane" || fixture.associations.lakshmi_and_kubera_worship !== "current_practice_association_not_a_complete_universal_puja_procedure" || fixture.associations.yama_deepam !== "related_trayodashi_observance_preserved_as_a_separate_record") throw new Error("Dhantrayodashi association drift");
  if (Object.keys(fixture.denials).length !== 15 || Object.values(fixture.denials).some((value) => value !== false)) throw new Error("Dhantrayodashi denial drift");
  return fixture;
}

const FIXTURE = loadFixture();

export const dhantrayodashiEvidence = {
  semanticFixtureSha256: FIXTURE_SHA256,
  candidateCivilDates: FIXTURE.scope.candidate_civil_dates,
  supportedTraditionCodes: SUPPORTED_TRADITIONS,
  selectedCivilDate: FIXTURE.decision.selected_civil_date,
  modernReference: {
    provider: "Drik Panchang" as const,
    url: DRIK_URL,
    referenceLocation: "New Delhi, NCT, India",
    observedCivilDate: FIXTURE.decision.selected_civil_date,
    observationRole: "current_practitioner_rule_and_location_specific_date_fixture" as const,
    semanticFixtureSha256: FIXTURE_SHA256,
    responseBytes: 81810,
    responseSha256: "121255bba72fc486def14da6042e5dfb94556cac9b8b8ff92b489e36573e9471",
  },
  sourceScopeNote: "The retained historical page is adjacent Yama Deepam evidence, not Dhanteras identity or Sthir-Lagna authority. The North/West 2026 lane is validated against the current New Delhi practitioner fixture and recalculated at the requested coordinates; broader regional practice is not resolved, and Devam does not reproduce the provider's narrower puja muhurta.",
} as const;

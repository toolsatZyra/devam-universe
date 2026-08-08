import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const FIXTURE_SHA256 = "faa675ee7ece5ed1513f75b49fef6db2ab0f9b0ea324f58a40990864c46c165c";
const NIRNAYASINDHU_PDF_SHA256 = "a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b";
const DRIK_URL = "https://www.drikpanchang.com/diwali/kali-puja/bengal-kalipuja-date-time.html?geoname-id=1275004&year=2026";
const RKM_URL = "https://varanasimath.rkmm.org/festivals-celebrations";
const WB_URL = "https://wb.gov.in/pdf/Holiday-2026.pdf";
const SUPPORTED_TRADITIONS = ["shakta-bengal"] as const;

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
  raw_page_is_dynamic: boolean;
  fetches: FetchObservation[];
  semantic_observation: Record<string, string | boolean>;
  source_text_returned_by_api: false;
};

type Fixture = {
  contract: "DEVAM_BENGAL_KALI_PUJA_DATE_EVIDENCE_FIXTURE_V1";
  fixture_id: "devam-kali-puja-kolkata-2026-v1";
  scope: {
    reference_location: "Kolkata, West Bengal, India";
    geoname_id: 1275004;
    timezone: "Asia/Kolkata";
    candidate_civil_dates: ["2026-11-08", "2026-11-09"];
    supported_tradition_codes: string[];
    date_resolved_by_devam: true;
    nishita_window_recalculated_by_devam: true;
    provider_puja_muhurta_claimed_reproduced: false;
    ritual_guidance_included: false;
    universal_india_claim: false;
  };
  live_sources: LiveSource[];
  official_calendar_observation: {
    source_id: string;
    provider: string;
    url: string;
    notification_number: string;
    notification_date: string;
    holiday_literal: string;
    civil_date: string;
    weekday: string;
    raw_fixity_frozen: false;
    raw_fixity_note: string;
    rights_lane: "reference_only";
    evidence_role: string;
    source_text_returned_by_api: false;
  };
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
    observance_slug: "bengal-kali-puja";
    canonical_name: "Kali Puja / Shyama Puja";
    target_tithi: "Amavasya";
    target_paksha: "krishna";
    decision_window: "nishita";
    selection: string;
    selected_civil_date: "2026-11-08";
    both_candidates_overlap: "fail_closed";
    neither_candidate_overlaps: "fail_closed";
    bengal_kali_puja_and_lakshmi_puja_remain_separate_records: true;
    provider_published_nishita_is_validation_evidence_not_a_copied_product_muhurta: true;
  };
  denials: Record<string, false>;
};

function assertFetches(source: LiveSource, expected: readonly (readonly [string, string, number, string])[]): void {
  if (source.fetches.length !== expected.length) throw new Error(`Kali Puja fetch universe drift: ${source.source_id}`);
  source.fetches.forEach((fetch, index) => {
    const row = expected[index];
    if (fetch.fetched_at_utc !== row[0] || fetch.status !== 200 || fetch.final_url !== row[1] || fetch.response_bytes !== row[2] || fetch.response_sha256 !== row[3] || fetch.strict_utf8 !== true) throw new Error(`Kali Puja fetch drift: ${source.source_id}/${index}`);
  });
}

function loadFixture(): Fixture {
  const path = resolve(process.cwd(), "../..", "knowledge_packs/panchang/kali-puja-kolkata-2026-v1.json");
  const bytes = readFileSync(path);
  if (createHash("sha256").update(bytes).digest("hex") !== FIXTURE_SHA256) throw new Error("Kali Puja fixture hash drift");
  const fixture = JSON.parse(bytes.toString("utf8")) as Fixture;
  if (fixture.contract !== "DEVAM_BENGAL_KALI_PUJA_DATE_EVIDENCE_FIXTURE_V1" || fixture.fixture_id !== "devam-kali-puja-kolkata-2026-v1") throw new Error("Kali Puja fixture identity drift");
  const scope = fixture.scope;
  if (scope.reference_location !== "Kolkata, West Bengal, India" || scope.geoname_id !== 1275004 || scope.timezone !== "Asia/Kolkata" || JSON.stringify(scope.candidate_civil_dates) !== JSON.stringify(["2026-11-08", "2026-11-09"]) || JSON.stringify(scope.supported_tradition_codes) !== JSON.stringify(SUPPORTED_TRADITIONS) || scope.date_resolved_by_devam !== true || scope.nishita_window_recalculated_by_devam !== true || scope.provider_puja_muhurta_claimed_reproduced || scope.ritual_guidance_included || scope.universal_india_claim) throw new Error("Kali Puja scope drift");
  if (fixture.live_sources.length !== 2) throw new Error("Kali Puja live source universe drift");
  const drik = fixture.live_sources[0];
  if (drik.source_id !== "drikpanchang-kolkata-bengal-kali-puja-2026" || drik.provider !== "Drik Panchang" || drik.url !== DRIK_URL || drik.rights_lane !== "reference_only" || drik.evidence_role !== "current_practitioner_bengal_kali_puja_identity_nishita_rule_and_kolkata_date_fixture" || !drik.raw_page_is_dynamic || drik.source_text_returned_by_api !== false) throw new Error("Kali Puja Drik identity drift");
  assertFetches(drik, [
    ["2026-08-06T20:29:29.204Z", DRIK_URL, 78534, "d03b7c7e596a4d33e1c7970ea1b03e44fc7618d78ff060658e7d5ec743d336cc"],
    ["2026-08-06T20:30:07.626Z", DRIK_URL, 78534, "f1bc47ed5e1948244babe7f8d86e82f0acf4a6353c44dc3368564f758ff44775"],
    ["2026-08-06T20:30:07.769Z", DRIK_URL, 78534, "f1bc47ed5e1948244babe7f8d86e82f0acf4a6353c44dc3368564f758ff44775"],
  ]);
  const current = drik.semantic_observation;
  if (current.title !== "2026 Bengal Kali Puja | Shyama Puja Date and Time for Kolkata, West Bengal, India" || current.civil_date !== "2026-11-08" || current.weekday !== "Sunday" || current.published_nishita_begins_local !== "22:55" || current.published_nishita_ends_local !== "23:46" || current.amavasya_begins_local !== "2026-11-08T11:27:00+05:30" || current.amavasya_ends_local !== "2026-11-09T12:31:00+05:30" || current.bengal_kali_puja_identity_present !== true || current.shyama_puja_alias_present !== true) throw new Error("Kali Puja Drik semantic drift");
  const rkm = fixture.live_sources[1];
  if (rkm.source_id !== "ramakrishna-advaita-ashrama-kali-puja-context" || rkm.provider !== "Ramakrishna Advaita Ashrama, Varanasi" || rkm.url !== RKM_URL || rkm.rights_lane !== "reference_only" || rkm.evidence_role !== "official_ramakrishna_math_kartik_amavasya_night_identity_context_not_kolkata_date_rule_authority" || rkm.raw_page_is_dynamic || rkm.source_text_returned_by_api !== false) throw new Error("Kali Puja Ramakrishna identity drift");
  assertFetches(rkm, [
    ["2026-08-06T20:30:50.462Z", RKM_URL, 130731, "810240b3e69b1b769d5e9bac16651afff127411f355729398e24ecd49fc2bf54"],
    ["2026-08-06T20:30:50.544Z", RKM_URL, 130731, "810240b3e69b1b769d5e9bac16651afff127411f355729398e24ecd49fc2bf54"],
  ]);
  const rkmObservation = rkm.semantic_observation;
  if (rkmObservation.kartik_amavasya_night_identity !== true || rkmObservation.deepavali_coincident_context !== true || rkmObservation.night_long_kali_puja_context !== true || rkmObservation.kolkata_date_rule_authority !== false) throw new Error("Kali Puja Ramakrishna semantic drift");
  const official = fixture.official_calendar_observation;
  if (official.source_id !== "west-bengal-government-holiday-notification-4188-fp2" || official.provider !== "Government of West Bengal" || official.url !== WB_URL || official.notification_number !== "4188-F(P2)" || official.notification_date !== "2025-11-27" || official.holiday_literal !== "Kali Puja" || official.civil_date !== "2026-11-08" || official.weekday !== "Sunday" || official.raw_fixity_frozen || official.raw_fixity_note !== "The official PDF was read through the normal-TLS web source. A separate Node fetch timed out at connection establishment; TLS was not weakened and no raw carrier was acquired." || official.rights_lane !== "reference_only" || official.evidence_role !== "official_west_bengal_civil_calendar_corroboration_not_nishita_rule_authority" || official.source_text_returned_by_api !== false) throw new Error("Kali Puja official calendar drift");
  const adjacent = fixture.fixed_adjacent_evidence;
  if (adjacent.source_id !== "nirnayasindhu-marathi-1865-kartika-amavasya-diwali-context" || adjacent.provider !== "Devam retained source vault" || adjacent.object_sha256 !== NIRNAYASINDHU_PDF_SHA256 || adjacent.object_bytes !== 93531683 || adjacent.media_type !== "application/pdf" || adjacent.rights_lane !== "private_evidence" || JSON.stringify(adjacent.visually_inspected_pdf_pages) !== "[216,217]" || adjacent.evidence_role !== "historical_adjacent_kartika_amavasya_diwali_context_not_bengal_kali_puja_identity_or_nishita_authority" || adjacent.source_text_returned_by_api !== false) throw new Error("Kali Puja adjacent evidence drift");
  const decision = fixture.decision;
  if (decision.observance_slug !== "bengal-kali-puja" || decision.canonical_name !== "Kali Puja / Shyama Puja" || decision.target_tithi !== "Amavasya" || decision.target_paksha !== "krishna" || decision.decision_window !== "nishita" || decision.selection !== "select_only_when_exactly_one_candidate_civil_night_has_kartika_amavasya_overlap_with_local_nishita" || decision.selected_civil_date !== "2026-11-08" || decision.both_candidates_overlap !== "fail_closed" || decision.neither_candidate_overlaps !== "fail_closed" || !decision.bengal_kali_puja_and_lakshmi_puja_remain_separate_records || !decision.provider_published_nishita_is_validation_evidence_not_a_copied_product_muhurta) throw new Error("Kali Puja decision drift");
  if (Object.keys(fixture.denials).length !== 15 || Object.values(fixture.denials).some((value) => value !== false)) throw new Error("Kali Puja denial drift");
  return fixture;
}

const FIXTURE = loadFixture();

export const kaliPujaEvidence = {
  semanticFixtureSha256: FIXTURE_SHA256,
  candidateCivilDates: FIXTURE.scope.candidate_civil_dates,
  supportedTraditionCodes: SUPPORTED_TRADITIONS,
  selectedCivilDate: FIXTURE.decision.selected_civil_date,
  modernReference: {
    provider: "Drik Panchang" as const,
    url: DRIK_URL,
    referenceLocation: "Kolkata, West Bengal, India",
    observedCivilDate: FIXTURE.decision.selected_civil_date,
    observationRole: "current_practitioner_rule_and_location_specific_date_fixture" as const,
    semanticFixtureSha256: FIXTURE_SHA256,
    responseBytes: 78534,
    responseSha256: "f1bc47ed5e1948244babe7f8d86e82f0acf4a6353c44dc3368564f758ff44775",
  },
  sourceScopeNote: "The Bengal Shakta 2026 lane is validated against the Kolkata practitioner fixture and official West Bengal civil calendar, then recalculated at requested coordinates. The retained historical pages are adjacent Kartika Amavasya/Diwali context, not Kali Puja identity or Nishita authority. Lakshmi Puja and Kali Puja remain separate records, and no Kali Puja procedure is served.",
} as const;

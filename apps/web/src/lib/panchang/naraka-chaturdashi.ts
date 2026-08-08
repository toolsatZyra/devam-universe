import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const FIXTURE_SHA256 = "adf5c3d43e6f2fb19ef3ecc75fc92d2cfc671105c2eed87edda11872d34a33a5";
const DRIK_URL = "https://www.drikpanchang.com/festivals/abhyangsnan/festivals-abhyangsnan-timings.html?geoname-id=1275339&year=2026";
const TOURISM_URL = "https://maharashtratourism.gov.in/festivals/diwali/";
const NIRNAYASINDHU_PDF_SHA256 = "a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b";
const SUPPORTED_TRADITIONS = ["smarta-west-india"] as const;

type Fixture = {
  contract: string;
  fixture_id: string;
  scope: Record<string, unknown> & { candidate_civil_dates: [string, string]; supported_tradition_codes: string[] };
  live_sources: Array<Record<string, unknown> & { source_id: string; provider: string; url: string; rights_lane: string; evidence_role: string; raw_page_is_dynamic: boolean; observed_fetch: Record<string, unknown>; semantic_observation: Record<string, unknown>; source_text_returned_by_api: boolean }>;
  fixed_adjacent_evidence: Record<string, unknown>;
  calculation_fixture: { latitude: number; longitude: number; engine_version: string; candidate_days: Array<Record<string, unknown>>; provider_moonrise_difference_seconds: number; provider_fixture_tolerance_seconds: number };
  decision: Record<string, unknown> & { selected_civil_date: string };
  denials: Record<string, boolean>;
};

function loadFixture(): Fixture {
  const path = resolve(process.cwd(), "../..", "knowledge_packs/panchang/naraka-chaturdashi-mumbai-2026-v1.json");
  const bytes = readFileSync(path);
  if (createHash("sha256").update(bytes).digest("hex") !== FIXTURE_SHA256) throw new Error("Naraka Chaturdashi fixture hash drift");
  const fixture = JSON.parse(bytes.toString("utf8")) as Fixture;
  if (fixture.contract !== "DEVAM_NARAKA_CHATURDASHI_DATE_EVIDENCE_FIXTURE_V1" || fixture.fixture_id !== "devam-naraka-chaturdashi-mumbai-2026-v1") throw new Error("Naraka Chaturdashi fixture identity drift");
  const scope = fixture.scope;
  if (scope.reference_location !== "Mumbai, Maharashtra, India" || scope.geoname_id !== 1275339 || scope.timezone !== "Asia/Kolkata" || JSON.stringify(scope.candidate_civil_dates) !== JSON.stringify(["2026-11-07", "2026-11-08"]) || JSON.stringify(scope.supported_tradition_codes) !== JSON.stringify(SUPPORTED_TRADITIONS) || scope.date_resolved_by_devam !== true || scope.moonrise_to_sunrise_window_recalculated_by_devam !== true || scope.provider_published_muhurta_reproduced !== false || scope.ritual_guidance_included !== false || scope.universal_india_claim !== false) throw new Error("Naraka Chaturdashi scope drift");
  if (fixture.live_sources.length !== 2) throw new Error("Naraka Chaturdashi source universe drift");
  const [drik, tourism] = fixture.live_sources;
  if (drik.source_id !== "drik-abhyang-snan-mumbai-2026" || drik.provider !== "Drik Panchang" || drik.url !== DRIK_URL || drik.rights_lane !== "reference_only" || drik.evidence_role !== "current_practitioner_naraka_identity_moonrise_to_sunrise_rule_and_mumbai_date_fixture" || drik.raw_page_is_dynamic !== true || drik.source_text_returned_by_api !== false) throw new Error("Naraka Chaturdashi practitioner identity drift");
  if (JSON.stringify(drik.observed_fetch) !== JSON.stringify({ status: 200, final_url: DRIK_URL, response_bytes: 80461, response_sha256: "a5be9abc5d3c7509c21c86246d6e1f4a17698f5f8cb870ae6c5155fe8289a7cb", strict_utf8: true })) throw new Error("Naraka Chaturdashi practitioner fetch drift");
  const observed = drik.semantic_observation;
  if (observed.civil_date !== "2026-11-08" || observed.published_abhyanga_begins_local !== "05:45" || observed.published_abhyanga_ends_local !== "06:42" || observed.decision_window_between_moonrise_and_sunrise_while_chaturdashi_prevails !== true || observed.naraka_chaturdashi_and_kali_chaudas_explicitly_distinguished !== true) throw new Error("Naraka Chaturdashi practitioner semantics drift");
  if (tourism.source_id !== "maharashtra-tourism-diwali-narak-chaturdashi" || tourism.provider !== "Department of Tourism, Government of Maharashtra" || tourism.url !== TOURISM_URL || tourism.rights_lane !== "reference_only" || tourism.source_text_returned_by_api !== false || tourism.semantic_observation.day_two_narak_chaturdashi_identity !== true || tourism.semantic_observation.complete_abhyanga_procedure_observed !== false) throw new Error("Naraka Chaturdashi official context drift");
  const adjacent = fixture.fixed_adjacent_evidence;
  if (adjacent.object_sha256 !== NIRNAYASINDHU_PDF_SHA256 || adjacent.object_bytes !== 93531683 || JSON.stringify(adjacent.visually_inspected_pdf_pages) !== "[214,215]" || adjacent.rights_lane !== "private_evidence" || adjacent.source_text_returned_by_api !== false) throw new Error("Naraka Chaturdashi adjacent evidence drift");
  const calculation = fixture.calculation_fixture;
  if (calculation.latitude !== 19.076 || calculation.longitude !== 72.8777 || calculation.engine_version !== "astronomy-engine-2.1.19-lahiri-v3" || calculation.provider_moonrise_difference_seconds !== 239 || calculation.provider_fixture_tolerance_seconds !== 420 || JSON.stringify(calculation.candidate_days) !== JSON.stringify([
    { civil_date: "2026-11-07", moonrise_utc: "2026-11-06T23:17:50.420Z", sunrise_utc: "2026-11-07T01:11:33.450Z", tithi_at_moonrise: "Trayodashi", tithi_at_sunrise: "Trayodashi", qualifies: false },
    { civil_date: "2026-11-08", moonrise_utc: "2026-11-08T00:11:01.455Z", sunrise_utc: "2026-11-08T01:12:03.227Z", tithi_at_moonrise: "Chaturdashi", tithi_at_sunrise: "Chaturdashi", qualifies: true },
  ])) throw new Error("Naraka Chaturdashi calculation fixture drift");
  const decision = fixture.decision;
  if (decision.observance_slug !== "naraka-chaturdashi" || decision.canonical_name !== "Naraka Chaturdashi / Abhyanga Snan" || decision.decision_window !== "moonrise_to_sunrise" || decision.selection !== "select_only_when_exactly_one_candidate_civil_day_has_kartika_krishna_chaturdashi_throughout_local_moonrise_to_sunrise_window" || decision.selected_civil_date !== "2026-11-08" || decision.kali_chaudas_remains_separate !== true || decision.tamil_deepavali_remains_separate !== true) throw new Error("Naraka Chaturdashi decision drift");
  if (Object.keys(fixture.denials).length !== 11 || Object.values(fixture.denials).some((value) => value !== false)) throw new Error("Naraka Chaturdashi denial drift");
  return fixture;
}

const FIXTURE = loadFixture();

export const narakaChaturdashiEvidence = {
  semanticFixtureSha256: FIXTURE_SHA256,
  candidateCivilDates: FIXTURE.scope.candidate_civil_dates,
  supportedTraditionCodes: SUPPORTED_TRADITIONS,
  selectedCivilDate: FIXTURE.decision.selected_civil_date,
  modernReference: { provider: "Drik Panchang" as const, url: DRIK_URL, referenceLocation: "Mumbai, Maharashtra, India", observedCivilDate: FIXTURE.decision.selected_civil_date, observationRole: "current_practitioner_rule_and_location_specific_date_fixture" as const, semanticFixtureSha256: FIXTURE_SHA256, responseBytes: 80461, responseSha256: "a5be9abc5d3c7509c21c86246d6e1f4a17698f5f8cb870ae6c5155fe8289a7cb" },
  sourceScopeNote: "The bounded Maharashtra lane recalculates the local moonrise-to-sunrise window and requires Krishna Chaturdashi throughout it. The provider interval validates identity and date but is not copied as product muhurta. Kali Chaudas and Tamil Deepavali remain separate, and no abhyanga procedure is served by the calendar rule.",
} as const;

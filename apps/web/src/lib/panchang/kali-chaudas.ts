import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const FIXTURE_SHA256 = "31e02af522ad6de07346e27330c6a6709b3f20eb93f12f14885ac6b53c4ba769";
const BAPS_NIRNAY_URL = "https://www.baps.org/Calendar/2026/Nirnay.aspx";
const SUPPORTED_TRADITIONS = ["swaminarayan-baps"] as const;

type Fixture = { contract: string; fixture_id: string; scope: Record<string, unknown> & { candidate_civil_dates: [string, string]; supported_tradition_codes: string[] }; live_sources: Array<Record<string, unknown> & { source_id: string; observed_fetch: Record<string, unknown>; semantic_observation: Record<string, unknown> }>; calculation_fixture: Record<string, unknown> & { candidate_days: Array<Record<string, unknown>> }; decision: Record<string, unknown> & { selected_civil_date: string }; denials: Record<string, boolean> };

function loadFixture(): Fixture {
  const bytes = readFileSync(resolve(process.cwd(), "../..", "knowledge_packs/panchang/kali-chaudas-ahmedabad-baps-2026-v1.json"));
  if (createHash("sha256").update(bytes).digest("hex") !== FIXTURE_SHA256) throw new Error("Kali Chaudas fixture hash drift");
  const fixture = JSON.parse(bytes.toString("utf8")) as Fixture;
  if (fixture.contract !== "DEVAM_KALI_CHAUDAS_BAPS_DATE_EVIDENCE_FIXTURE_V1" || fixture.fixture_id !== "devam-kali-chaudas-ahmedabad-baps-2026-v1") throw new Error("Kali Chaudas fixture identity drift");
  const scope = fixture.scope;
  if (scope.reference_location !== "Ahmedabad, Gujarat, India" || scope.geoname_id !== 1279233 || scope.timezone !== "Asia/Kolkata" || JSON.stringify(scope.candidate_civil_dates) !== JSON.stringify(["2026-11-07", "2026-11-08"]) || JSON.stringify(scope.supported_tradition_codes) !== JSON.stringify(SUPPORTED_TRADITIONS) || scope.date_resolved_by_devam !== true || scope.nishita_window_recalculated_by_devam !== true || scope.provider_published_intervals_reproduced !== false || scope.ritual_guidance_included !== false || scope.universal_gujarat_or_india_claim !== false) throw new Error("Kali Chaudas scope drift");
  if (fixture.live_sources.map((source) => source.source_id).join("|") !== "drik-gujarati-calendar-ahmedabad-2026|baps-festival-list-2026-kali-chaudash|baps-nirnay-2026-kali-chaudash") throw new Error("Kali Chaudas source universe drift");
  const [drik, festival, nirnay] = fixture.live_sources;
  if (drik.semantic_observation.kali_chaudas_saturday_7_november_2026 !== true || drik.semantic_observation.roop_chaudas_and_naraka_chaturdashi_on_8_november_separate !== true || festival.semantic_observation.kali_chaudash_7_november_2026 !== true || festival.semantic_observation.complete_household_or_temple_procedure_present !== false || nirnay.semantic_observation.kali_chaudash_and_hanuman_puja_7_november_2026 !== true || nirnay.semantic_observation.precise_intervals_not_republished_by_product !== true) throw new Error("Kali Chaudas source semantics drift");
  if (JSON.stringify(fixture.calculation_fixture.candidate_days) !== JSON.stringify([{ civil_date: "2026-11-07", nishita_start_utc: "2026-11-07T18:27:52.832Z", nishita_end_utc: "2026-11-07T19:19:13.139Z", tithi_throughout_nishita: "Chaturdashi", qualifies: true }, { civil_date: "2026-11-08", nishita_start_utc: "2026-11-08T18:27:54.765Z", nishita_end_utc: "2026-11-08T19:19:19.375Z", tithi_throughout_nishita: "Amavasya", qualifies: false }]) || fixture.calculation_fixture.validation_tolerance_seconds !== 720) throw new Error("Kali Chaudas calculation fixture drift");
  const decision = fixture.decision;
  if (decision.observance_slug !== "kali-chaudas-baps" || decision.canonical_name !== "Kali Chaudash / Hanuman Puja" || decision.decision_window !== "nishita" || decision.selection !== "select_only_when_exactly_one_candidate_nishita_is_fully_covered_by_krishna_chaturdashi" || decision.selected_civil_date !== "2026-11-07" || decision.maharashtra_naraka_chaturdashi_separate !== true || decision.tamil_deepavali_separate !== true || decision.bengal_kali_puja_separate !== true) throw new Error("Kali Chaudas decision drift");
  if (Object.keys(fixture.denials).length !== 11 || Object.values(fixture.denials).some((value) => value !== false)) throw new Error("Kali Chaudas denial drift");
  return fixture;
}

const FIXTURE = loadFixture();
export const kaliChaudasEvidence = {
  semanticFixtureSha256: FIXTURE_SHA256,
  candidateCivilDates: FIXTURE.scope.candidate_civil_dates,
  supportedTraditionCodes: SUPPORTED_TRADITIONS,
  selectedCivilDate: FIXTURE.decision.selected_civil_date,
  modernReference: { provider: "BAPS Swaminarayan Sanstha" as const, url: BAPS_NIRNAY_URL, referenceLocation: "Ahmedabad, Gujarat, India", observedCivilDate: FIXTURE.decision.selected_civil_date, observationRole: "current_sampradaya_rule_and_location_specific_date_fixture" as const, semanticFixtureSha256: FIXTURE_SHA256, responseBytes: 213996, responseSha256: "397baad532df38cd409fc9e3977d85442ffa1b5fcbeb8b6e4db24acc655ecb47" },
  sourceScopeNote: "The exact BAPS lane is corroborated by the Ahmedabad Gujarati calendar and BAPS Festival List, then recalculated at local Nishita. Provider intervals are not copied. Maharashtra Naraka Chaturdashi, Tamil Deepavali, and Bengal Kali Puja remain separate; the calendar rule serves no Hanuman puja procedure or protection claim.",
} as const;

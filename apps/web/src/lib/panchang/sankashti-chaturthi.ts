import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const FIXTURE_SHA256 = "d14c3552f4ff41bae44bc4cabf4c0f24265d5e099bcfe707f28349f248701944";
const SOURCE_CARRIER_SHA256 = "a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b";
const DATE_URL = "https://www.drikpanchang.com/vrats/sankashti-chaturthi-dates.html?geoname-id=1261481&year=2026";
const TEMPLE_URL = "https://www.siddhivinayak.org/important-dates/";
const TOURISM_URL = "https://maharashtratourism.gov.in/mr/ashtavinayak/ranjangaon/";
const SUPPORTED_TRADITIONS = ["smarta-north-india", "smarta-west-india"] as const;
const EXPECTED_ROWS = [
  ["sankashti-chaturthi-2026-09", "2026-09-28", "2026-09-29", "Vighnaraja Sankashti", "19:44", "21:05", true],
  ["sankashti-chaturthi-2026-10", "2026-10-28", "2026-10-29", "Vakratunda Sankashti", "20:17", "20:55", false],
  ["sankashti-chaturthi-2026-11", "2026-11-26", "2026-11-27", "Ganadhipa Sankashti", "20:18", "20:53", false],
  ["sankashti-chaturthi-2026-12", "2026-12-25", "2026-12-26", "Akhuratha Sankashti", "20:19", "20:47", false],
] as const;
type FixtureRow = { observance_slug: string; candidate_civil_dates: [string, string]; selected_civil_date: string };

function loadFixture() {
  const bytes = readFileSync(resolve(process.cwd(), "../..", "knowledge_packs/panchang/sankashti-chaturthi-delhi-mumbai-september-december-2026-v1.json"));
  if (createHash("sha256").update(bytes).digest("hex") !== FIXTURE_SHA256) throw new Error("Sankashti Chaturthi fixture drift");
  const fixture = JSON.parse(bytes.toString("utf8"));
  const scope = fixture.scope;
  if (fixture.contract !== "DEVAM_SANKASHTI_CHATURTHI_DELHI_MUMBAI_DATE_EVIDENCE_FIXTURE_V1" || fixture.fixture_id !== "devam-sankashti-chaturthi-delhi-mumbai-september-december-2026-v1" || scope.civil_date_start !== "2026-09-01" || scope.civil_date_end !== "2026-12-31" || scope.delhi_geoname_id !== 1261481 || scope.timezone !== "Asia/Kolkata" || JSON.stringify(scope.supported_date_tradition_codes) !== JSON.stringify(SUPPORTED_TRADITIONS) || JSON.stringify(scope.supported_practice_region_codes) !== JSON.stringify(["west-india"]) || JSON.stringify(scope.supported_practice_tradition_codes) !== JSON.stringify(["smarta-west-india"]) || scope.all_india_or_all_traditions_claim !== false) throw new Error("Sankashti Chaturthi fixture identity drift");
  if (fixture.sources.map((source: { source_id: string }) => source.source_id).join("|") !== "nirnayasindhu-1865-sankashti-moonrise-rule|drikpanchang-delhi-sankashti-2026|siddhivinayak-trust-important-dates-2026|maharashtra-tourism-ranjangaon-sankashti-context") throw new Error("Sankashti Chaturthi source universe drift");
  const [historical, dateSource, templeSource, tourismSource] = fixture.sources;
  if (historical.fixed_carrier_path !== `source_vault/objects/sha256/a6/${SOURCE_CARRIER_SHA256}` || historical.fixed_carrier_bytes !== 93531683 || historical.fixed_carrier_sha256 !== SOURCE_CARRIER_SHA256 || JSON.stringify(historical.pdf_pages) !== JSON.stringify([50]) || historical.rights_lane !== "private_evidence" || historical.source_text_returned_by_api !== false) throw new Error("Sankashti Chaturthi historical evidence drift");
  if (dateSource.url !== DATE_URL || dateSource.observed_fetch.status !== 200 || dateSource.observed_fetch.final_url !== DATE_URL || dateSource.observed_fetch.response_bytes !== 103423 || dateSource.observed_fetch.response_sha256 !== "e71fe295af2f9205eced859519f9061aebb1bca5e24800c864adaf3e02c90f49" || dateSource.observed_fetch.strict_utf8 !== true) throw new Error("Sankashti Chaturthi Delhi evidence drift");
  if (templeSource.url !== TEMPLE_URL || templeSource.observed_fetch.status !== 200 || templeSource.observed_fetch.final_url !== TEMPLE_URL || templeSource.observed_fetch.response_bytes !== 85711 || templeSource.observed_fetch.response_sha256 !== "da887faa2ccb16b578fe79278fe3d6b0570f940d8bccd4aea177cd242b20125d" || templeSource.observed_fetch.strict_utf8 !== true) throw new Error("Sankashti Chaturthi official temple evidence drift");
  if (tourismSource.url !== TOURISM_URL || tourismSource.observed_fetch.status !== 200 || tourismSource.observed_fetch.final_url !== TOURISM_URL || tourismSource.observed_fetch.response_bytes !== 684360 || tourismSource.observed_fetch.response_sha256 !== "bfc867a6b3d7c2a37f22aef67817e4bfe53454d8f61e5cbc511e18c1e5c820ce" || tourismSource.observed_fetch.strict_utf8 !== true || Object.values(tourismSource.semantic_observation).some((value) => value !== true)) throw new Error("Sankashti Chaturthi living-practice evidence drift");
  if (fixture.observances.length !== EXPECTED_ROWS.length) throw new Error("Sankashti Chaturthi observance count drift");
  fixture.observances.forEach((row: Record<string, unknown>, index: number) => {
    const expected = EXPECTED_ROWS[index];
    if (row.observance_slug !== expected[0] || JSON.stringify(row.candidate_civil_dates) !== JSON.stringify([expected[1], expected[2]]) || row.selected_civil_date !== expected[2] || row.delhi_monthly_name !== expected[3] || row.delhi_published_moonrise_local !== expected[4] || row.mumbai_official_moonrise_local !== expected[5] || row.mumbai_official_angarak_label !== expected[6]) throw new Error(`Sankashti Chaturthi observance drift: ${index}`);
  });
  const rule = fixture.rule;
  if (rule.target_tithi !== "Chaturthi" || rule.target_paksha !== "krishna" || rule.decision_window !== "moonrise_presence" || rule.selection !== "select_day_with_krishna_chaturthi_at_local_moonrise" || rule.both_candidate_moonrises_qualify !== "fail_closed_because_fixed_source_preserves_competing_opinions" || rule.neither_candidate_moonrise_qualifies !== "select_later_day" || rule.provider_moonrise_reused_as_engine_output !== false || rule.fasting_procedure_resolved !== false || rule.monthly_katha_or_puja_procedure_resolved !== false) throw new Error("Sankashti Chaturthi rule drift");
  if (Object.keys(fixture.denials).length !== 13 || Object.values(fixture.denials).some((value) => value !== false)) throw new Error("Sankashti Chaturthi denial drift");
  return fixture;
}

const FIXTURE = loadFixture();
const rows = new Map<string, FixtureRow>((FIXTURE.observances as FixtureRow[]).map((row) => [row.observance_slug, row]));

export const sankashtiChaturthiEvidence = {
  semanticFixtureSha256: FIXTURE_SHA256,
  supportedTraditions: SUPPORTED_TRADITIONS,
  candidateCivilDates(observanceSlug: string): readonly [string, string] {
    const row = rows.get(observanceSlug);
    if (!row) throw new Error(`Unsupported Sankashti Chaturthi evidence row: ${observanceSlug}`);
    return row.candidate_civil_dates as readonly [string, string];
  },
  modernReference(observanceSlug: string) {
    const row = rows.get(observanceSlug);
    if (!row) throw new Error(`Unsupported Sankashti Chaturthi evidence row: ${observanceSlug}`);
    return { provider: "Drik Panchang" as const, url: DATE_URL, referenceLocation: "Delhi, India", observedCivilDate: row.selected_civil_date as string, observationRole: "location_specific_date_fixture_not_rule_authority" as const, semanticFixtureSha256: FIXTURE_SHA256, responseBytes: 103423, responseSha256: "e71fe295af2f9205eced859519f9061aebb1bca5e24800c864adaf3e02c90f49" };
  },
  sourceScopeNote: "The fixed source supplies the Krishna Chaturthi-at-moonrise rule and preserves a two-day tie conflict. The current Delhi page supplies monthly names and location-specific dates; the official Siddhivinayak Trust page independently corroborates the four dates and Mumbai moonrises; Maharashtra Tourism supplies only a bounded Maharashtra living-practice context. Devam recalculates moonrise for the user's location, does not prescribe or manage fasting, does not require temple attendance, moon sighting, offerings, a katha, mantra, arghya, or food, keeps Ganesh Chaturthi and same-day Karwa Chauth separate, and guarantees no obstacle-removal, success, protection, merit, or other outcome.",
};

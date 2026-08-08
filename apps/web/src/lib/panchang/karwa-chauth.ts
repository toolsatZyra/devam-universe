import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const FIXTURE_SHA256 = "c04a1d84ce766c312bb7e40c60025ceb01eb5cb5da7a3f6ccdb03e293ab53591";
const SOURCE_CARRIER_SHA256 = "a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b";
const SUPPORTED_TRADITIONS = ["smarta-north-india", "smarta-west-india"] as const;
const DATE_URL = "https://www.drikpanchang.com/festivals/karwa-chauth/karwa-chauth-date-time.html?geoname-id=1273294&year=2026";
const PRACTICE_URL = "https://www.incredibleindia.gov.in/en/festivals-and-events/karva-chauth";

function loadFixture() {
  const root = resolve(process.cwd(), "../..");
  const bytes = readFileSync(resolve(root, "knowledge_packs/panchang/karwa-chauth-delhi-north-india-2026-v1.json"));
  if (createHash("sha256").update(bytes).digest("hex") !== FIXTURE_SHA256) throw new Error("Karwa Chauth fixture drift");
  const fixture = JSON.parse(bytes.toString("utf8"));
  const scope = fixture.scope;
  const rule = fixture.rule;
  if (fixture.contract !== "DEVAM_KARWA_CHAUTH_NORTH_INDIA_DATE_EVIDENCE_FIXTURE_V1" || fixture.fixture_id !== "devam-karwa-chauth-delhi-north-india-2026-v1" || scope.reference_location !== "Delhi, India" || scope.geoname_id !== 1273294 || scope.timezone !== "Asia/Kolkata" || JSON.stringify(scope.candidate_civil_dates) !== JSON.stringify(["2026-10-28", "2026-10-29"]) || scope.selected_civil_date !== "2026-10-29" || JSON.stringify(scope.supported_tradition_codes) !== JSON.stringify(SUPPORTED_TRADITIONS) || scope.north_india_living_practice_lane_only !== true || scope.universal_india_claim !== false) throw new Error("Karwa Chauth fixture identity drift");
  if (fixture.sources.map((source: { source_id: string }) => source.source_id).join("|") !== "nirnayasindhu-1865-karaka-chaturthi-rule|drikpanchang-delhi-karwa-chauth-2026|incredible-india-karva-chauth-living-practice") throw new Error("Karwa Chauth source universe drift");
  const [historical, dateSource, practiceSource] = fixture.sources;
  if (historical.fixed_carrier_path !== `source_vault/objects/sha256/a6/${SOURCE_CARRIER_SHA256}` || historical.fixed_carrier_bytes !== 93531683 || historical.fixed_carrier_sha256 !== SOURCE_CARRIER_SHA256 || JSON.stringify(historical.pdf_pages) !== JSON.stringify([213]) || historical.rights_lane !== "private_evidence" || historical.source_text_returned_by_api !== false) throw new Error("Karwa Chauth historical evidence drift");
  if (dateSource.url !== DATE_URL || dateSource.observed_fetch.status !== 200 || dateSource.observed_fetch.final_url !== DATE_URL || dateSource.observed_fetch.response_bytes !== 69852 || dateSource.observed_fetch.response_sha256 !== "7582d6071c0f630231b4adadc38dd7ceb8ff3911b2b186d622f35ce495431a68" || dateSource.observed_fetch.strict_utf8 !== true || dateSource.semantic_observation.selected_civil_date !== "2026-10-29" || dateSource.semantic_observation.provider_puja_interval_served_by_devam !== false || dateSource.semantic_observation.provider_fast_interval_adopted_by_devam !== false) throw new Error("Karwa Chauth current date evidence drift");
  if (practiceSource.url !== PRACTICE_URL || practiceSource.observed_fetch.status !== 200 || practiceSource.observed_fetch.final_url !== PRACTICE_URL || practiceSource.observed_fetch.response_bytes !== 469344 || practiceSource.observed_fetch.response_sha256 !== "e6cbfcb9df0a6dc75cbe7972a8597514122c921670e76ed5bd06a26d7693f493" || practiceSource.observed_fetch.strict_utf8 !== true || Object.values(practiceSource.semantic_observation).some((value) => value !== true)) throw new Error("Karwa Chauth living-practice evidence drift");
  if (rule.observance_slug !== "karwa-chauth" || rule.selected_civil_date !== "2026-10-29" || rule.target_tithi !== "Chaturthi" || rule.target_paksha !== "krishna" || rule.decision_window !== "moonrise_presence" || rule.selection !== "select_the_candidate_civil_day_with_krishna_chaturthi_at_local_moonrise" || rule.both_candidates_qualify !== "select_earlier_day" || rule.neither_candidate_qualifies !== "fail_closed" || rule.fasting_procedure_resolved !== false || rule.one_north_india_procedure_universalized !== false) throw new Error("Karwa Chauth rule drift");
  if (Object.keys(fixture.denials).length !== 10 || Object.values(fixture.denials).some((value) => value !== false)) throw new Error("Karwa Chauth denial drift");
  return fixture;
}

const FIXTURE = loadFixture();

export const karwaChauthEvidence = {
  semanticFixtureSha256: FIXTURE_SHA256,
  supportedTraditions: SUPPORTED_TRADITIONS,
  candidateCivilDates: FIXTURE.scope.candidate_civil_dates as readonly [string, string],
  selectedCivilDate: FIXTURE.scope.selected_civil_date as string,
  modernReference: {
    provider: "Drik Panchang" as const,
    url: DATE_URL,
    referenceLocation: "Delhi, India",
    observedCivilDate: FIXTURE.scope.selected_civil_date as string,
    observationRole: "location_specific_date_fixture_not_rule_authority" as const,
    semanticFixtureSha256: FIXTURE_SHA256,
    responseBytes: 69852,
    responseSha256: "7582d6071c0f630231b4adadc38dd7ceb8ff3911b2b186d622f35ce495431a68",
  },
  sourceScopeNote: "The fixed historical source supplies the bounded Karaka Chaturthi moonrise precedence rule. The current Delhi source confirms the 2026 date, while official tourism evidence identifies a North India living-practice family with distinct Punjab and Uttar Pradesh forms. Devam does not serve provider muhurta, prescribe or manage a fast, universalize gender or marital status, merge regional forms, require Sargi, Bayaa, thali, sieve, arghya, gifts, flame, food, clothing, or a spouse-fed close, or guarantee health, longevity, marriage, or another outcome.",
};

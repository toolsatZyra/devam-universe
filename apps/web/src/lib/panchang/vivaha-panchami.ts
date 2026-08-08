import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const FIXTURE_SHA256 = "5ac334e9efa8fe548b572ef6ce5d4d982206cc774a4a2672735c75b665a7770c";
const SUPPORTED_TRADITIONS = ["smarta-north-india"] as const;

function loadFixture() {
  const bytes = readFileSync(resolve(process.cwd(), "../..", "knowledge_packs/panchang/vivaha-panchami-delhi-2026-v1.json"));
  if (createHash("sha256").update(bytes).digest("hex") !== FIXTURE_SHA256) throw new Error("Vivaha Panchami calendar fixture drift");
  const fixture = JSON.parse(bytes.toString("utf8"));
  const scope = fixture.scope;
  const rule = fixture.rule;
  if (fixture.contract !== "DEVAM_BOUNDED_VIVAHA_PANCHAMI_CALENDAR_FIXTURE_V1" || fixture.fixture_id !== "devam-vivaha-panchami-delhi-2026-v1" || scope.reference_location !== "Delhi, India" || scope.geoname_id !== 1273294 || scope.latitude !== 28.6139 || scope.longitude !== 77.209 || scope.timezone !== "Asia/Kolkata" || JSON.stringify(scope.candidate_civil_dates) !== JSON.stringify(["2026-12-13", "2026-12-14"]) || scope.selected_civil_date !== "2026-12-14" || JSON.stringify(scope.supported_tradition_codes) !== JSON.stringify(SUPPORTED_TRADITIONS) || scope.location_specific !== true || scope.universal_india_claim !== false) throw new Error("Vivaha Panchami fixture identity drift");
  if (fixture.sources.map((source: { source_id: string }) => source.source_id).join("|") !== "drikpanchang-delhi-vivaha-panchami-2026|incredible-india-orchha-vivaha-panchami-2026|pib-ayodhya-vivaha-panchami-context") throw new Error("Vivaha Panchami source universe drift");
  const expected = [
    ["https://www.drikpanchang.com/festivals/vivah-panchami/vivah-panchami-date-time.html?geoname-id=1273294&year=2026", "https://www.drikpanchang.com/festivals/vivah-panchami/vivah-panchami-date-time.html?geoname-id=1273294&year=2026", 67949, "d2522e46a93afc6cf0945f504c7230c5656c49fb04050015d1af4d033ac59977"],
    ["https://www.incredibleindia.gov.in/en/festivals-and-events/madhya-pradesh/vivah-panchami-mahotsav", "https://www.incredibleindia.gov.in/en/festivals-and-events/madhya-pradesh/vivah-panchami-mahotsav", 485310, "8ce92ad620778f22f40d4ad350480516025943055821e44ed74c77197fa841d7"],
    ["https://www.pib.gov.in/PressReleasePage.aspx?PRID=2194034", "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2194034&reg=48&lang=2", 245935, "61f73318563249db6b9318af4f0f1918210d113abd672f037b2c73b50ac3b8d8"],
  ] as const;
  for (let index = 0; index < expected.length; index += 1) {
    const source = fixture.sources[index];
    const fetch = source.observed_fetch;
    const [url, finalUrl, responseBytes, responseSha256] = expected[index];
    if (source.url !== url || fetch.status !== 200 || fetch.final_url !== finalUrl || fetch.response_bytes !== responseBytes || fetch.response_sha256 !== responseSha256 || fetch.strict_utf8 !== true || source.rights_lane !== "reference_only") throw new Error("Vivaha Panchami source observation drift");
  }
  const observed = fixture.sources[0].observed_literals;
  if (observed.selected_civil_date !== "2026-12-14" || observed.weekday !== "Monday" || observed.paksha_tithi_month !== "Margashirsha Shukla Panchami" || observed.panchami_begins_local !== "2026-12-13T16:47:00+05:30" || observed.panchami_ends_local !== "2026-12-14T19:15:00+05:30" || observed.rama_sita_divine_wedding_identity !== true || observed.mithila_ayodhya_and_janakpur_context_present !== true || observed.provider_outcome_or_fast_claims_promoted_by_devam !== false) throw new Error("Vivaha Panchami practitioner literals drift");
  if (rule.observance_slug !== "vivaha-panchami" || rule.canonical_name !== "Vivaha Panchami" || rule.target_tithi !== "Panchami" || rule.target_paksha !== "shukla" || rule.target_lunar_month !== "Margashirsha" || rule.decision_window !== "local_sunrise_presence" || rule.selection !== "select_only_when_exactly_one_candidate_sunrise_bears_shukla_panchami" || rule.both_candidates_qualify !== "fail_closed" || rule.neither_candidate_qualifies !== "fail_closed" || rule.calendar_engine_recomputes_requested_location !== true || rule.fasting_procedure_resolved || rule.formal_wedding_or_puja_procedure_resolved || rule.temple_procession_or_event_operations_resolved) throw new Error("Vivaha Panchami rule drift");
  if (Object.keys(fixture.denials).length !== 10 || Object.values(fixture.denials).some((value) => value !== false)) throw new Error("Vivaha Panchami denial drift");
  return fixture;
}

const fixture = loadFixture();

export const vivahaPanchamiEvidence = {
  semanticFixtureSha256: FIXTURE_SHA256,
  supportedTraditions: SUPPORTED_TRADITIONS,
  candidateCivilDates: fixture.scope.candidate_civil_dates as readonly [string, string],
  selectedCivilDate: fixture.scope.selected_civil_date as string,
  modernReference: {
    provider: "Drik Panchang" as const,
    url: fixture.sources[0].url as string,
    referenceLocation: "Delhi, India",
    observedCivilDate: "2026-12-14",
    observationRole: "current_practitioner_rule_and_location_specific_date_fixture" as const,
    semanticFixtureSha256: FIXTURE_SHA256,
    responseBytes: 67949,
    responseSha256: "d2522e46a93afc6cf0945f504c7230c5656c49fb04050015d1af4d033ac59977",
  },
  sourceScopeNote: "The practitioner source fixes the Margashirsha Shukla Panchami identity, Delhi tithi interval, and December 14 date. Official Government of India sources independently preserve Ayodhya and Orchha public-festival contexts. Devam resolves only one bounded North India date lane; Janakpur, Ayodhya, and Orchha practices remain distinct, and no fast, formal wedding reenactment, puja, procession, live event operation, or promised marriage outcome is inferred.",
};

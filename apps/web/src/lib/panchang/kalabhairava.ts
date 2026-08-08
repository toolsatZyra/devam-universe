import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const FIXTURE_SHA256 = "df5444680f998850f9115ce71e65da251b9afd70f77031098c9dd7b06afff229";
const SUPPORTED_TRADITIONS = ["smarta-north-india", "regional-kashi-varanasi"] as const;

function loadFixture() {
  const bytes = readFileSync(resolve(process.cwd(), "../..", "knowledge_packs/panchang/kalabhairava-delhi-2026-v1.json"));
  if (createHash("sha256").update(bytes).digest("hex") !== FIXTURE_SHA256) throw new Error("Kalabhairava calendar fixture drift");
  const fixture = JSON.parse(bytes.toString("utf8"));
  const scope = fixture.scope; const rule = fixture.rule;
  if (fixture.contract !== "DEVAM_BOUNDED_KALABHAIRAVA_JAYANTI_CALENDAR_FIXTURE_V1" || fixture.fixture_id !== "devam-kalabhairava-delhi-2026-v1" || scope.reference_location !== "Delhi, India" || scope.geoname_id !== 1273294 || scope.latitude !== 28.6139 || scope.longitude !== 77.209 || scope.timezone !== "Asia/Kolkata" || JSON.stringify(scope.candidate_civil_dates) !== JSON.stringify(["2026-12-01", "2026-12-02"]) || scope.selected_civil_date !== "2026-12-01" || JSON.stringify(scope.supported_tradition_codes) !== JSON.stringify(SUPPORTED_TRADITIONS) || scope.location_specific !== true || scope.universal_india_claim !== false) throw new Error("Kalabhairava fixture identity drift");
  if (fixture.sources.map((source: { source_id: string }) => source.source_id).join("|") !== "drikpanchang-delhi-masika-kalashtami-2026|kashi-official-shri-kaal-bhairav-temple") throw new Error("Kalabhairava source universe drift");
  const expected = [[87703, "e172a630891bc7c13b403a1c4c315ae8ffd154b82c953036adf925b5f8a2c037"], [100811, "f0fab6af66d8a42ade81f6ace680eda4c59e2bd885b64addd6c3c6fcfe039bb2"]] as const;
  for (let index = 0; index < fixture.sources.length; index += 1) {
    const source = fixture.sources[index]; const fetch = source.observed_fetch;
    if (fetch.status !== 200 || fetch.final_url !== source.url || fetch.response_bytes !== expected[index][0] || fetch.response_sha256 !== expected[index][1] || fetch.strict_utf8 !== true || source.rights_lane !== "reference_only") throw new Error("Kalabhairava source observation drift");
  }
  const observed = fixture.sources[0].observed_literals;
  if (observed.selected_civil_date !== "2026-12-01" || observed.weekday !== "Tuesday" || observed.identity !== "Kalabhairav Jayanti / Kalashtami / Bhairava Ashtami" || observed.north_lunar_month !== "Margashirsha" || observed.south_lunar_month !== "Kartika" || observed.paksha_tithi !== "Krishna Ashtami" || observed.ashtami_begins_local !== "2026-12-01T00:11:00+05:30" || observed.ashtami_ends_local !== "2026-12-01T23:13:00+05:30" || observed.provider_rule !== "select_the_fasting_day_where_ashtami_prevails_during_night_and_at_least_one_ghati_after_pradosha_otherwise_move_to_previous_day") throw new Error("Kalabhairava practitioner literals drift");
  if (rule.observance_slug !== "kalabhairava-jayanti" || rule.canonical_name !== "Kalabhairava Jayanti / Bhairava Ashtami" || rule.target_tithi !== "Ashtami" || rule.target_paksha !== "krishna" || rule.decision_window !== "local_sunset_to_following_sunrise" || rule.selection !== "select_only_when_exactly_one_candidate_night_has_at_least_one_ghati_of_krishna_ashtami_after_local_sunset" || rule.one_ghati_seconds !== 1440 || rule.both_candidates_qualify !== "fail_closed" || rule.neither_candidate_qualifies !== "fail_closed" || rule.north_and_south_lunar_month_names_preserved !== true || rule.fasting_procedure_resolved || rule.puja_procedure_resolved || rule.temple_timing_or_event_operations_resolved) throw new Error("Kalabhairava rule drift");
  if (Object.keys(fixture.denials).length !== 11 || Object.values(fixture.denials).some((value) => value !== false)) throw new Error("Kalabhairava denial drift");
  return fixture;
}

const fixture = loadFixture();

export const kalabhairavaEvidence = {
  semanticFixtureSha256: FIXTURE_SHA256,
  supportedTraditions: SUPPORTED_TRADITIONS,
  candidateCivilDates: fixture.scope.candidate_civil_dates as readonly [string, string],
  selectedCivilDate: fixture.scope.selected_civil_date as string,
  oneGhatiSeconds: fixture.rule.one_ghati_seconds as number,
  modernReference: {
    provider: "Drik Panchang" as const,
    url: fixture.sources[0].url as string,
    referenceLocation: "Delhi, India",
    observedCivilDate: "2026-12-01",
    observationRole: "current_practitioner_rule_and_location_specific_date_fixture" as const,
    semanticFixtureSha256: FIXTURE_SHA256,
    responseBytes: 87703,
    responseSha256: "e172a630891bc7c13b403a1c4c315ae8ffd154b82c953036adf925b5f8a2c037",
  },
  sourceScopeNote: "The practitioner source preserves the North/South lunar-month labels, Delhi 2026 tithi interval, and night rule requiring at least one ghati of Krishna Ashtami after local sunset. The official Kashi portal independently establishes Kaal Bhairav's Shiva and guardian identity. Devam resolves only the bounded date lane; fasting, formal puja, temple operations, occult or protection rites, harmful offerings, and outcome claims remain outside it.",
};

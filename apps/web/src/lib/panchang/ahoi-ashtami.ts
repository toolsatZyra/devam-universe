import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const FIXTURE_SHA256 = "f35053c40b788f82da8264ae8d7675e706ea5152b925f6ee86fd6c87d9a3831c";
const SUPPORTED_TRADITIONS = ["smarta-north-india"] as const;

function loadFixture() {
  const bytes = readFileSync(resolve(process.cwd(), "../..", "knowledge_packs/panchang/ahoi-ashtami-delhi-2026-v1.json"));
  if (createHash("sha256").update(bytes).digest("hex") !== FIXTURE_SHA256) throw new Error("Ahoi Ashtami fixture drift");
  const fixture = JSON.parse(bytes.toString("utf8"));
  const scope = fixture.scope;
  const rule = fixture.rule;
  if (fixture.contract !== "DEVAM_AHOI_ASHTAMI_NORTH_INDIA_DATE_EVIDENCE_FIXTURE_V1" || fixture.fixture_id !== "devam-ahoi-ashtami-delhi-2026-v1" || scope.reference_location !== "Delhi, India" || scope.geoname_id !== 1273294 || scope.timezone !== "Asia/Kolkata" || JSON.stringify(scope.candidate_civil_dates) !== JSON.stringify(["2026-11-01", "2026-11-02"]) || JSON.stringify(scope.supported_tradition_codes) !== JSON.stringify(SUPPORTED_TRADITIONS) || scope.selected_civil_date !== "2026-11-01" || scope.universal_india_claim !== false) throw new Error("Ahoi Ashtami fixture identity drift");
  if (fixture.sources.map((source: { source_id: string }) => source.source_id).join("|") !== "drikpanchang-delhi-ahoi-ashtami-2026|drikpanchang-ahoi-ashtami-practice-context") throw new Error("Ahoi Ashtami source universe drift");
  const dateSource = fixture.sources[0];
  const practiceSource = fixture.sources[1];
  if (dateSource.observed_fetch.status !== 200 || dateSource.observed_fetch.response_bytes !== 66050 || dateSource.observed_fetch.response_sha256 !== "1f979e3c097e9c377f8f6a2ba03b7dcea3aa694e8ad7b6fc4bac98254ed9db76" || dateSource.observed_fetch.strict_utf8 !== true || practiceSource.observed_fetch.status !== 200 || practiceSource.observed_fetch.response_bytes !== 61590 || practiceSource.observed_fetch.response_sha256 !== "ecb47f01cf1ba104003819299acad58f079d62b9d111264beabf7e2afdaa3cb9" || practiceSource.observed_fetch.strict_utf8 !== true) throw new Error("Ahoi Ashtami observation drift");
  if (rule.observance_slug !== "ahoi-ashtami-north-india" || rule.selected_civil_date !== "2026-11-01" || rule.target_tithi !== "Ashtami" || rule.target_paksha !== "krishna" || rule.decision_window !== "pradosha" || rule.selection !== "select_only_when_exactly_one_candidate_civil_evening_has_krishna_ashtami_overlap_with_local_pradosha" || rule.fasting_procedure_resolved !== false || rule.star_or_moon_completion_rule_universalized !== false) throw new Error("Ahoi Ashtami rule drift");
  if (Object.keys(fixture.denials).length !== 11 || Object.values(fixture.denials).some((value) => value !== false)) throw new Error("Ahoi Ashtami denial drift");
  return fixture;
}

const FIXTURE = loadFixture();

export const ahoiAshtamiEvidence = {
  semanticFixtureSha256: FIXTURE_SHA256,
  supportedTraditions: SUPPORTED_TRADITIONS,
  candidateCivilDates: FIXTURE.scope.candidate_civil_dates as readonly [string, string],
  selectedCivilDate: FIXTURE.scope.selected_civil_date as string,
  modernReference: {
    provider: "Drik Panchang" as const,
    url: "https://www.drikpanchang.com/festivals/ahoi-ashtami/ahoi-ashtami-date-time.html?geoname-id=1273294&year=2026",
    referenceLocation: "Delhi, India",
    observedCivilDate: FIXTURE.scope.selected_civil_date as string,
    observationRole: "current_practitioner_rule_and_location_specific_date_fixture" as const,
    semanticFixtureSha256: FIXTURE_SHA256,
    responseBytes: 66050,
    responseSha256: "1f979e3c097e9c377f8f6a2ba03b7dcea3aa694e8ad7b6fc4bac98254ed9db76",
  },
  sourceScopeNote: "The current Delhi practitioner source identifies Ahoi Ashtami on Kartika Krishna Ashtami, places its family observance in the evening, and preserves star- and moon-sighting variants. Devam uses a recalculated local pradosha overlap only to resolve the bounded civil date. It does not serve the provider's muhurta, prescribe fasting, restrict care to mothers or sons, guarantee child wellbeing, or universalize one image, story, sighting, family, or regional procedure.",
};

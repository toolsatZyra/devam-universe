import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const FIXTURE_SHA256 = "84fb6f87eedb403c354312a414f6073b24b8a378c979e9da1a9b02f13921f1e8";
const SUPPORTED_TRADITIONS = ["regional-kashi-varanasi"] as const;

function loadFixture() {
  const bytes = readFileSync(resolve(process.cwd(), "../..", "knowledge_packs/panchang/dev-deepawali-varanasi-2026-v1.json"));
  if (createHash("sha256").update(bytes).digest("hex") !== FIXTURE_SHA256) throw new Error("Varanasi Dev Deepawali fixture drift");
  const fixture = JSON.parse(bytes.toString("utf8"));
  const scope = fixture.scope;
  const rule = fixture.rule;
  if (fixture.contract !== "DEVAM_VARANASI_DEV_DEEPAWALI_DATE_EVIDENCE_FIXTURE_V1" || fixture.fixture_id !== "devam-dev-deepawali-varanasi-2026-v1" || scope.reference_location !== "Varanasi, Uttar Pradesh, India" || scope.geoname_id !== 1253405 || scope.latitude !== 25.3176 || scope.longitude !== 82.9739 || scope.timezone !== "Asia/Kolkata" || JSON.stringify(scope.candidate_civil_dates) !== JSON.stringify(["2026-11-23", "2026-11-24"]) || scope.selected_civil_date !== "2026-11-24" || JSON.stringify(scope.supported_tradition_codes) !== JSON.stringify(SUPPORTED_TRADITIONS) || scope.universal_india_claim !== false) throw new Error("Varanasi Dev Deepawali fixture identity drift");
  if (fixture.sources.map((source: { source_id: string }) => source.source_id).join("|") !== "drikpanchang-varanasi-dev-deepawali-2026|incredible-india-varanasi-dev-deepawali-identity|incredible-india-varanasi-ghat-lamps|utsav-india-dev-deepawali-varanasi-context") throw new Error("Varanasi Dev Deepawali source universe drift");
  const expected = [[56405, "5c5ee1ca3d167ac6568fb3c492b7c7ee21ab006027aed04efdfb8d093deaf344"], [477739, "c3e1756e2eb39ed49fc829ad25dc882ede9832fc4e5b1bb4991849e49218df23"], [595856, "2811c7169ce321ae1d94d72e5ad0f41b64075219b2b98f6e3b3c081100ad67f6"], [30920, "10c28073953840b0f6ceec42bcb8f4621a3bab23f316ded53931a6deafacdd3e"]];
  if (fixture.sources.some((source: { observed_fetch: { status: number; response_bytes: number; response_sha256: string; strict_utf8: boolean } }, index: number) => source.observed_fetch.status !== 200 || source.observed_fetch.response_bytes !== expected[index][0] || source.observed_fetch.response_sha256 !== expected[index][1] || source.observed_fetch.strict_utf8 !== true)) throw new Error("Varanasi Dev Deepawali source observation drift");
  if (rule.observance_slug !== "dev-deepawali-varanasi" || rule.selected_civil_date !== "2026-11-24" || rule.target_tithi !== "Purnima" || rule.target_paksha !== "shukla" || rule.decision_window !== "pradosha" || rule.selection !== "select_only_when_exactly_one_candidate_civil_evening_has_purnima_overlap_with_local_pradosha" || rule.generic_kartika_purnima_record_remains_separate !== true || rule.baps_dev_diwali_and_tulsi_vivah_close_remain_separate !== true || rule.current_event_access_or_travel_operations_resolved !== false) throw new Error("Varanasi Dev Deepawali rule drift");
  if (fixture.separate_lanes.length !== 2 || fixture.separate_lanes[1].evidence_fixture_sha256 !== "fa33540adba85a7e4e79b454d98c80677c0b7c92b0e557a26ea6168b7f038257") throw new Error("Varanasi Dev Deepawali separation drift");
  if (Object.keys(fixture.denials).length !== 12 || Object.values(fixture.denials).some((value) => value !== false)) throw new Error("Varanasi Dev Deepawali denial drift");
  return fixture;
}

const fixture = loadFixture();

export const devDeepawaliEvidence = {
  semanticFixtureSha256: FIXTURE_SHA256,
  supportedTraditions: SUPPORTED_TRADITIONS,
  candidateCivilDates: fixture.scope.candidate_civil_dates as readonly [string, string],
  modernReference: {
    provider: "Drik Panchang" as const,
    url: fixture.sources[0].url as string,
    referenceLocation: "Varanasi, Uttar Pradesh, India",
    observedCivilDate: "2026-11-24",
    observationRole: "current_practitioner_rule_and_location_specific_date_fixture" as const,
    semanticFixtureSha256: FIXTURE_SHA256,
    responseBytes: 56405,
    responseSha256: "5c5ee1ca3d167ac6568fb3c492b7c7ee21ab006027aed04efdfb8d093deaf344",
  },
  sourceScopeNote: "The current Varanasi practitioner page fixes November 24 and a pradosha interval fully inside Kartika Purnima. Ministry of Tourism sources independently preserve the illuminated-ghat public-festival identity, the Diwali-of-the-gods framing, and a Shiva-Tripurasura story variant. Devam does not merge the generic Kartika Purnima or BAPS Dev Diwali records and does not infer bathing, river offerings, floating lamps, fireworks, boats, current access operations, formal liturgy, fasting, purification, merit, or other outcomes.",
};

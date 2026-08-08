import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const FIXTURE_SHA256 = "afa7230ef7879b18a6dac1653e416db978946cc0c03c40ba7f0cefc0f54603f5";
const FIXTURE_PATH = "knowledge_packs/panchang/gujarati-new-year-ahmedabad-baps-2026-v1.json";
const SUPPORTED_TRADITIONS = ["swaminarayan-baps"] as const;

function loadFixture() {
  const bytes = readFileSync(resolve(process.cwd(), "../..", FIXTURE_PATH));
  if (createHash("sha256").update(bytes).digest("hex") !== FIXTURE_SHA256) throw new Error("Gujarati New Year fixture drift");
  const fixture = JSON.parse(bytes.toString("utf8"));
  const scope = fixture.scope;
  const decision = fixture.decision;
  if (
    fixture.contract !== "DEVAM_GUJARATI_NEW_YEAR_BAPS_DATE_EVIDENCE_FIXTURE_V1" ||
    fixture.fixture_id !== "devam-gujarati-new-year-ahmedabad-baps-2026-v1" ||
    scope.reference_location !== "Ahmedabad, Gujarat, India" ||
    scope.timezone !== "Asia/Kolkata" ||
    JSON.stringify(scope.candidate_civil_dates) !== JSON.stringify(["2026-11-09", "2026-11-10"]) ||
    JSON.stringify(scope.supported_tradition_codes) !== JSON.stringify(SUPPORTED_TRADITIONS) ||
    scope.selected_civil_date !== "2026-11-10" ||
    decision.observance_slug !== "gujarati-new-year-baps" ||
    decision.selected_civil_date !== "2026-11-10" ||
    decision.official_baps_date_matches !== true
  ) throw new Error("Gujarati New Year fixture identity drift");
  if (fixture.live_sources.map((source: { source_id: string }) => source.source_id).join("|") !== "baps-november-calendar-2026|baps-festival-list-2026-new-year|baps-nutan-varsh-new-year-annakut|akashvani-gujarati-new-year-context") throw new Error("Gujarati New Year source universe drift");
  if (Object.values(fixture.denials).some((value) => value !== false)) throw new Error("Gujarati New Year denial drift");
  return fixture;
}

const FIXTURE = loadFixture();

export const gujaratiNewYearEvidence = {
  semanticFixtureSha256: FIXTURE_SHA256,
  supportedTraditions: SUPPORTED_TRADITIONS,
  selectedCivilDate: FIXTURE.scope.selected_civil_date as string,
  modernReference: {
    provider: "BAPS Swaminarayan Sanstha" as const,
    url: "https://www.baps.org/calendar/2026/November.aspx",
    referenceLocation: "Ahmedabad, Gujarat, India",
    observedCivilDate: FIXTURE.scope.selected_civil_date as string,
    observationRole: "current_sampradaya_rule_and_location_specific_date_fixture" as const,
    semanticFixtureSha256: FIXTURE_SHA256,
    responseBytes: 102837,
    responseSha256: "9b59012845c7557e162ced62b58643ddf6ce057cd6127d4650d550bf260b0649",
  },
  sourceScopeNote: "The exact BAPS Ahmedabad lane identifies Kartak Sud Padvo as Annakut and Bestu Varash. Akashvani supplies broader Gujarat living-practice context, not the 2026 date. The rule reproduces no provider muhurta and serves no formal Annakut, aarti, business-account, or guaranteed-outcome procedure.",
};

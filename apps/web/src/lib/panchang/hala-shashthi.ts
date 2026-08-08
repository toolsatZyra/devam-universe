import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const FIXTURE_SHA256 = "4f67365d3f8198fcf4f50ca5ceb39879d24c672f3be7157b8f9e68cffa1ef6c9";
const SUPPORTED_TRADITIONS = ["smarta-north-india"] as const;

function loadFixture() {
  const bytes = readFileSync(resolve(process.cwd(), "../..", "knowledge_packs/panchang/hala-shashthi-delhi-2026-v1.json"));
  if (createHash("sha256").update(bytes).digest("hex") !== FIXTURE_SHA256) throw new Error("Hala Shashthi fixture drift");
  const fixture = JSON.parse(bytes.toString("utf8"));
  if (fixture.contract !== "DEVAM_BOUNDED_HALA_SHASHTHI_IDENTITY_DATE_FIXTURE_V1" || fixture.fixture_id !== "devam-hala-shashthi-delhi-2026-v1" || fixture.observance_slug !== "hala-shashthi-hal-chhath" || fixture.scope.selected_civil_date !== "2026-09-02" || JSON.stringify(fixture.scope.supported_tradition_codes) !== JSON.stringify(SUPPORTED_TRADITIONS)) throw new Error("Hala Shashthi identity drift");
  if (fixture.decision.september_16_balarama_jayanti_candidate_accepted !== false || fixture.decision.official_iskcon_august_28_remains_separate !== true || Object.values(fixture.denials).some((value) => value !== false)) throw new Error("Hala Shashthi decision drift");
  return fixture;
}

const FIXTURE = loadFixture();

export const halaShashthiEvidence = {
  semanticFixtureSha256: FIXTURE_SHA256,
  supportedTraditions: SUPPORTED_TRADITIONS,
  candidateCivilDates: ["2026-09-02", "2026-09-03"] as const,
  selectedCivilDate: FIXTURE.scope.selected_civil_date as "2026-09-02",
  sourceScopeNote: "This bounded Delhi lane assigns only Hala Shashthi / Hal Chhath on 2 September. The unsupported 16 September ISKCON attribution is rejected, official ISKCON Balarama Purnima on 28 August remains separate, and no regional-equivalence or complete fasting/puja claim is made.",
  modernReference: {
    provider: "Drik Panchang" as const,
    url: "https://www.drikpanchang.com/dashavatara/lord-balarama/hala-shashthi-date-time.html?geoname-id=1273294&year=2026",
    referenceLocation: "Delhi, India",
    observedCivilDate: "2026-09-02",
    observationRole: "location_specific_date_fixture_not_rule_authority" as const,
    semanticFixtureSha256: FIXTURE_SHA256,
    responseBytes: 74656,
    responseSha256: "f00263cec69cbbbaca1a3ec9933bab506fc92437cefdba2c307ecbf1ad77a068",
  },
};

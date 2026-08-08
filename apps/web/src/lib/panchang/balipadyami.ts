import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const FIXTURE_SHA256 = "2378195e40a1cd93e0a0f700e1903ecf8bedea665a711b95eaa9a27fcdb09fcc";
const SUPPORTED_TRADITIONS = ["smarta-south-india"] as const;

function loadFixture() {
  const bytes = readFileSync(resolve(process.cwd(), "../..", "knowledge_packs/panchang/balipadyami-bengaluru-2026-v1.json"));
  if (createHash("sha256").update(bytes).digest("hex") !== FIXTURE_SHA256) throw new Error("Balipadyami fixture drift");
  const fixture = JSON.parse(bytes.toString("utf8"));
  const scope = fixture.scope;
  const decision = fixture.decision;
  if (fixture.contract !== "DEVAM_KARNATAKA_BALIPADYAMI_DATE_EVIDENCE_FIXTURE_V1" || fixture.fixture_id !== "devam-balipadyami-bengaluru-2026-v1" || scope.reference_location !== "Bengaluru, Karnataka, India" || scope.timezone !== "Asia/Kolkata" || JSON.stringify(scope.candidate_civil_dates) !== JSON.stringify(["2026-11-09", "2026-11-10"]) || JSON.stringify(scope.supported_tradition_codes) !== JSON.stringify(SUPPORTED_TRADITIONS) || scope.selected_civil_date !== "2026-11-10" || decision.observance_slug !== "karnataka-balipadyami" || decision.selected_civil_date !== "2026-11-10" || decision.official_bengaluru_date_matches !== true) throw new Error("Balipadyami fixture identity drift");
  if (fixture.live_sources.map((source: { source_id: string }) => source.source_id).join("|") !== "iskcon-bangalore-public-calendar-2026-balipadyami|karnataka-tourism-deepavali-balipratipada|akashvani-karnataka-bali-padyami") throw new Error("Balipadyami source universe drift");
  if (Object.values(fixture.denials).some((value) => value !== false)) throw new Error("Balipadyami denial drift");
  return fixture;
}

const FIXTURE = loadFixture();

export const balipadyamiEvidence = {
  semanticFixtureSha256: FIXTURE_SHA256,
  supportedTraditions: SUPPORTED_TRADITIONS,
  selectedCivilDate: FIXTURE.scope.selected_civil_date as string,
  modernReference: {
    provider: "ISKCON Bangalore" as const,
    url: "https://www.iskconbangalore.org/public-holidays-calendar/",
    referenceLocation: "Bengaluru, Karnataka, India",
    observedCivilDate: FIXTURE.scope.selected_civil_date as string,
    observationRole: "official_regional_date_corroboration_not_practice_authority" as const,
    semanticFixtureSha256: FIXTURE_SHA256,
    responseBytes: 90675,
    responseSha256: "354d0b622c785743016363fbcf4f4fbb9552cbc1a789f3c3a929a794d09d010a",
  },
  sourceScopeNote: "The exact Bengaluru date is corroborated by the ISKCON Bangalore public calendar without importing its Govardhana practice. Karnataka Tourism and Akashvani establish regional Bali identity and living-practice context, not a complete vidhi. Maharashtra Bali Pratipada, BAPS New Year, Govardhana, and coastal variants remain separate.",
};

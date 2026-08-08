import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const FIXTURE_SHA256 = "c2a6bc7cfe0fa0f12fa12af694cd2f4918fa63892ebd0f614eb04811219df26b";
const SUPPORTED_TRADITIONS = ["smarta-south-india"] as const;

function loadFixture() {
  const bytes = readFileSync(resolve(process.cwd(), "../..", "knowledge_packs/panchang/karnataka-saraswati-ayudha-puja-bengaluru-2026-v1.json"));
  if (createHash("sha256").update(bytes).digest("hex") !== FIXTURE_SHA256) throw new Error("Karnataka Saraswati/Ayudha Puja fixture drift");
  const fixture = JSON.parse(bytes.toString("utf8"));
  const scope = fixture.scope;
  const decision = fixture.decision;
  if (fixture.contract !== "DEVAM_KARNATAKA_SARASWATI_AYUDHA_PUJA_DATE_EVIDENCE_FIXTURE_V1"
    || fixture.fixture_id !== "devam-karnataka-saraswati-ayudha-puja-bengaluru-2026-v1"
    || scope.reference_location !== "Bengaluru, Karnataka, India"
    || scope.timezone !== "Asia/Kolkata"
    || JSON.stringify(scope.candidate_civil_dates) !== JSON.stringify(["2026-10-19", "2026-10-20"])
    || JSON.stringify(scope.supported_tradition_codes) !== JSON.stringify(SUPPORTED_TRADITIONS)
    || scope.selected_civil_date !== "2026-10-20"
    || decision.observance_slug !== "karnataka-saraswati-ayudha-puja"
    || decision.selected_civil_date !== "2026-10-20"
    || decision.official_karnataka_date_matches !== true) throw new Error("Karnataka Saraswati/Ayudha Puja fixture identity drift");
  if (fixture.live_sources.map((source: { source_id: string }) => source.source_id).join("|") !== "cgst-karnataka-holiday-list-2026-mahanavami|nic-karnataka-mahanavami-ayudhapooja|sringeri-sriyantra-navaratri-sarasvati|sringeri-2025-mahanavami-ayudha-vahana|karnataka-tourism-gombe-habba") throw new Error("Karnataka Saraswati/Ayudha Puja source universe drift");
  if (Object.values(fixture.denials).some((value) => value !== false)) throw new Error("Karnataka Saraswati/Ayudha Puja denial drift");
  return fixture;
}

const FIXTURE = loadFixture();

export const karnatakaSaraswatiAyudhaPujaEvidence = {
  semanticFixtureSha256: FIXTURE_SHA256,
  supportedTraditions: SUPPORTED_TRADITIONS,
  selectedCivilDate: FIXTURE.scope.selected_civil_date as string,
  modernReference: {
    provider: "CGST Karnataka" as const,
    url: "https://gstkarnataka.gov.in/media/pdf/notifications/public-notices/2025-12-31_Holiday_List_for_the_year_2026_20251231_120602.pdf",
    referenceLocation: "Bengaluru, Karnataka, India",
    observedCivilDate: FIXTURE.scope.selected_civil_date as string,
    observationRole: "official_regional_date_corroboration_not_practice_authority" as const,
    semanticFixtureSha256: FIXTURE_SHA256,
    responseBytes: 324154,
    responseSha256: "1c97d1934109b0229d6c1585d51f7736423dd975dfa92027e779bab4a523834a",
  },
  sourceScopeNote: "The official Karnataka calendar fixes 20 October 2026 for the bounded Mahanavami lane. Sringeri establishes ninth-day Sarasvati identity and institutional Ayudha/Vahana context; Karnataka Tourism establishes Gombe context. None supplies a universal household, workplace, vehicle, temple, homa, mantra, or muhurta procedure.",
};

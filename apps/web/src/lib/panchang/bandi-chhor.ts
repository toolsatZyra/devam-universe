import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const FIXTURE_SHA256 = "01536637248ca6fe97b426ffc1bc6e42f7e33e611c0d461e59f40a46b6573a7b";
const SUPPORTED_TRADITIONS = ["sikh-sgpc"] as const;

function loadFixture() {
  const bytes = readFileSync(resolve(process.cwd(), "../..", "knowledge_packs/panchang/bandi-chhor-amritsar-2026-v1.json"));
  if (createHash("sha256").update(bytes).digest("hex") !== FIXTURE_SHA256) throw new Error("Bandi Chhor fixture drift");
  const fixture = JSON.parse(bytes.toString("utf8"));
  const scope = fixture.scope;
  const decision = fixture.decision;
  if (fixture.contract !== "DEVAM_BANDI_CHHOR_SGPC_DATE_EVIDENCE_FIXTURE_V1" || fixture.fixture_id !== "devam-bandi-chhor-amritsar-2026-v1" || scope.reference_location !== "Amritsar, Punjab, India" || scope.timezone !== "Asia/Kolkata" || JSON.stringify(scope.candidate_civil_dates) !== JSON.stringify(["2026-11-08", "2026-11-09"]) || JSON.stringify(scope.supported_tradition_codes) !== JSON.stringify(SUPPORTED_TRADITIONS) || scope.selected_civil_date !== "2026-11-08" || scope.official_sgpc_calendar_date_resolved !== true || decision.observance_slug !== "bandi-chhor-divas-sgpc" || decision.selected_civil_date !== "2026-11-08" || decision.sgpc_nanakshahi_date !== "23 Kattak") throw new Error("Bandi Chhor fixture identity drift");
  if (fixture.live_sources.map((source: { source_id: string }) => source.source_id).join("|") !== "sgpc-nanakshahi-calendar-page-2026-27|sgpc-nanakshahi-calendar-pdf-2026-27|sgpc-bandi-chhor-distinct-identity|baru-sahib-bandi-chhor-history|guru-nanak-sikh-gurdwara-2026-date") throw new Error("Bandi Chhor source universe drift");
  if (Object.values(fixture.denials).some((value) => value !== false)) throw new Error("Bandi Chhor denial drift");
  return fixture;
}

const FIXTURE = loadFixture();

export const bandiChhorEvidence = {
  semanticFixtureSha256: FIXTURE_SHA256,
  supportedTraditions: SUPPORTED_TRADITIONS,
  selectedCivilDate: FIXTURE.scope.selected_civil_date as string,
  modernReference: {
    provider: "Shiromani Gurdwara Parbandhak Committee" as const,
    url: "https://sgpc.net/storage/2026/03/Calender_2026-1.pdf",
    referenceLocation: "Amritsar, Punjab, India",
    observedCivilDate: FIXTURE.scope.selected_civil_date as string,
    observationRole: "official_sikh_calendar_date_authority" as const,
    semanticFixtureSha256: FIXTURE_SHA256,
    responseBytes: 14760383,
    responseSha256: "ad9ff9ad7f558a585003095aa6ee383b8cf03374b53e2abde5cea7be7d7929d5",
  },
  sourceScopeNote: "The SGPC Nanakshahi calendar labels Bandi Chhor Divas (Diwali) on 23 Kattak and maps that date to November 8, 2026. This exact SGPC lane preserves the distinct Sikh identity, Guru Hargobind and the 52 rulers, and gurdwara participation context. It does not derive Sikh observance authority from a Hindu tithi rule or prescribe a universal paath, kirtan, ardas, Hukamnama, langar, light, fireworks, donation, or family sequence.",
};

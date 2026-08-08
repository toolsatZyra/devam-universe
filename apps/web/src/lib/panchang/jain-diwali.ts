import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const FIXTURE_SHA256 = "1b72b1eb9710d35e90618e02e840e4cb6129e0aa726df667fa637e42e62f117d";
const SUPPORTED_TRADITIONS = ["jain-umbrella"] as const;

function loadFixture() {
  const bytes = readFileSync(resolve(process.cwd(), "../..", "knowledge_packs/panchang/jain-diwali-delhi-2026-v1.json"));
  if (createHash("sha256").update(bytes).digest("hex") !== FIXTURE_SHA256) throw new Error("Jain Diwali fixture drift");
  const fixture = JSON.parse(bytes.toString("utf8"));
  const scope = fixture.scope;
  const decision = fixture.decision;
  if (fixture.contract !== "DEVAM_JAIN_DIWALI_UMBRELLA_DATE_EVIDENCE_FIXTURE_V1" || fixture.fixture_id !== "devam-jain-diwali-delhi-2026-v1" || scope.reference_location !== "Delhi, India" || scope.timezone !== "Asia/Kolkata" || JSON.stringify(scope.candidate_civil_dates) !== JSON.stringify(["2026-11-08", "2026-11-09"]) || JSON.stringify(scope.supported_tradition_codes) !== JSON.stringify(SUPPORTED_TRADITIONS) || scope.selected_civil_date !== "2026-11-08" || scope.sect_or_sangh_nirvan_kalyanak_timing_resolved !== false || decision.observance_slug !== "jain-diwali-umbrella" || decision.selected_civil_date !== "2026-11-08" || decision.mahavir_nirvan_kalyanak_9_november_variant_preserved !== true || decision.digambar_diwali_puja_9_november_variant_preserved !== true) throw new Error("Jain Diwali fixture identity drift");
  if (fixture.live_sources.map((source: { source_id: string }) => source.source_id).join("|") !== "jaina-diwali-mahavir-nirvana-2019|jaina-mahavira-nirvana-2550|jain-center-nj-2026-diwali-variants|mahavir-foundation-2026-diwali-nirvan-calendar|incredible-india-diwali-multifaith") throw new Error("Jain Diwali source universe drift");
  if (Object.values(fixture.denials).some((value) => value !== false)) throw new Error("Jain Diwali denial drift");
  return fixture;
}

const FIXTURE = loadFixture();

export const jainDiwaliEvidence = {
  semanticFixtureSha256: FIXTURE_SHA256,
  supportedTraditions: SUPPORTED_TRADITIONS,
  selectedCivilDate: FIXTURE.scope.selected_civil_date as string,
  modernReference: {
    provider: "Jain Center of New Jersey" as const,
    url: "https://jaincenternj.org/Events/MajorEvents",
    referenceLocation: "Delhi, India",
    observedCivilDate: FIXTURE.scope.selected_civil_date as string,
    observationRole: "official_community_calendar_variant_corroboration" as const,
    semanticFixtureSha256: FIXTURE_SHA256,
    responseBytes: 40278,
    responseSha256: "e14f78cff1de994c6a619dae89532413bb3eea706eee0d942ca8bdfe8b068135",
  },
  sourceScopeNote: "This is an umbrella Jain Diwali evening lane grounded in JAINA's Amavasya and inner-light identity. Official Jain community calendars preserve Diwali on November 8, Mahavir Nirvan or Digambar puja on November 9, and Gautam Swami New Year on November 10. Sect-, sangh-, temple-, and family-specific timing and procedure remain unresolved and must be asked, not merged.",
};

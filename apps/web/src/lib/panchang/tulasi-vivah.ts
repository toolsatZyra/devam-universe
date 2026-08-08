import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const FIXTURE_SHA256 = "fa33540adba85a7e4e79b454d98c80677c0b7c92b0e557a26ea6168b7f038257";

function loadFixture() {
  const bytes = readFileSync(resolve(process.cwd(), "../..", "knowledge_packs/panchang/tulasi-vivah-2026-v1.json"));
  if (createHash("sha256").update(bytes).digest("hex") !== FIXTURE_SHA256) throw new Error("Tulasi Vivah fixture drift");
  const fixture = JSON.parse(bytes.toString("utf8"));
  if (fixture.contract !== "DEVAM_TULASI_VIVAH_2026_DATE_EVIDENCE_FIXTURE_V1" || fixture.fixture_id !== "devam-tulasi-vivah-2026-v1" || fixture.lanes.length !== 3 || fixture.sources.length !== 4) throw new Error("Tulasi Vivah fixture identity drift");
  if (fixture.lanes.map((lane: { observance_slug: string }) => lane.observance_slug).join("|") !== "tulasi-vivah-dwadashi|tulsi-vivah-baps-begins|tulsi-vivah-baps-samapt") throw new Error("Tulasi Vivah lane universe drift");
  const [general, begins, ends] = fixture.lanes;
  if (JSON.stringify(general.candidate_civil_dates) !== JSON.stringify(["2026-11-20", "2026-11-21"]) || general.selected_civil_date !== "2026-11-21" || general.target_tithi !== "Dwadashi" || general.target_paksha !== "shukla" || general.decision_window !== "pradosha" || JSON.stringify(general.supported_tradition_codes) !== JSON.stringify(["smarta-north-india", "smarta-west-india"])) throw new Error("General Tulasi Vivah lane drift");
  if (begins.selected_civil_date !== "2026-11-21" || begins.sequence_end_civil_date !== "2026-11-24" || ends.selected_civil_date !== "2026-11-24" || ends.sequence_start_civil_date !== "2026-11-21" || JSON.stringify(begins.supported_tradition_codes) !== JSON.stringify(["swaminarayan-baps"]) || JSON.stringify(ends.supported_tradition_codes) !== JSON.stringify(["swaminarayan-baps"])) throw new Error("BAPS Tulsi Vivah sequence drift");
  const expectedIds = "incredible-india-tulsi-vivah-2026|drikpanchang-delhi-tulasi-vivah-2026|baps-calendar-november-2026-tulsi-vivah|baps-tulsi-vivah-2012-context";
  if (fixture.sources.map((source: { source_id: string }) => source.source_id).join("|") !== expectedIds) throw new Error("Tulasi Vivah source universe drift");
  const expectedHashes = ["07186207d6ddc17a74878fa78b2096d72eaf326710b5481dcb2d1487517766e9", "398fc3737c26e4bcb407e50b876cda973ac1e1f788c56ba1094a650f40b80cb9", "a7a77333444d23f4e9e5f93bf897277c1e7663030cca05d21ba2cd545d3e1120", "9cbac8c0ce08e18be1757f9a6256aec5e45f7303704fd540ef635ad12c6811c7"];
  if (fixture.sources.some((source: { observed_fetch: { status: number; response_sha256: string; strict_utf8: boolean } }, index: number) => source.observed_fetch.status !== 200 || source.observed_fetch.response_sha256 !== expectedHashes[index] || source.observed_fetch.strict_utf8 !== true)) throw new Error("Tulasi Vivah source observation drift");
  if (Object.keys(fixture.denials).length !== 11 || Object.values(fixture.denials).some((value) => value !== false)) throw new Error("Tulasi Vivah denial drift");
  return fixture;
}

const fixture = loadFixture();

export const tulasiVivahEvidence = {
  semanticFixtureSha256: FIXTURE_SHA256,
  general: {
    supportedTraditions: fixture.lanes[0].supported_tradition_codes as readonly ["smarta-north-india", "smarta-west-india"],
    candidateCivilDates: fixture.lanes[0].candidate_civil_dates as readonly [string, string],
    modernReference: {
      provider: "Drik Panchang" as const,
      url: fixture.sources[1].url as string,
      referenceLocation: "Delhi, India",
      observedCivilDate: "2026-11-21",
      observationRole: "current_practitioner_rule_and_location_specific_date_fixture" as const,
      semanticFixtureSha256: FIXTURE_SHA256,
      responseBytes: 70677,
      responseSha256: "398fc3737c26e4bcb407e50b876cda973ac1e1f788c56ba1094a650f40b80cb9",
    },
    sourceScopeNote: "The bounded current-practitioner lane identifies Tulasi Vivah with the ceremonial union of Tulasi and Vishnu or Krishna and resolves November 21 by local Shukla Dwadashi overlap with pradosha. The official tourism page independently corroborates the Mumbai date. Neither source supplies a universal family vidhi, and this lane does not absorb the BAPS November 21-24 sequence.",
  },
  bapsBegins: {
    supportedTraditions: fixture.lanes[1].supported_tradition_codes as readonly ["swaminarayan-baps"],
    candidateCivilDates: fixture.lanes[1].candidate_civil_dates as readonly [string, string],
    modernReference: {
      provider: "BAPS Swaminarayan Sanstha" as const,
      url: fixture.sources[2].url as string,
      referenceLocation: "Ahmedabad, Gujarat, India",
      observedCivilDate: "2026-11-21",
      observationRole: "current_sampradaya_rule_and_location_specific_date_fixture" as const,
      semanticFixtureSha256: FIXTURE_SHA256,
      responseBytes: 102837,
      responseSha256: "a7a77333444d23f4e9e5f93bf897277c1e7663030cca05d21ba2cd545d3e1120",
    },
  },
  bapsEnds: {
    supportedTraditions: fixture.lanes[2].supported_tradition_codes as readonly ["swaminarayan-baps"],
    candidateCivilDates: fixture.lanes[2].candidate_civil_dates as readonly [string, string],
  },
  bapsSourceScopeNote: "The official BAPS calendar identifies Tulsi Vivah Prarambh on November 21 and Tulsi Vivah Samapt on November 24. Devam preserves those as an institution-specific sequence rather than treating either date as a universal Hindu rule or importing the historical event page as a complete household or mandir procedure.",
};

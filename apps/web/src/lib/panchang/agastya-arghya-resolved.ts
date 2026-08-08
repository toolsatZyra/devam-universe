import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PanchangRequest } from "./contracts";

const FIXTURE_SHA256 = "0d0413830f7accb290d27a94ffd72f73262a857aea20e90f5f3353d17856a744";
const SUPPORTED_TRADITIONS = ["smarta-north-india", "smarta-west-india"] as const;

type Fixture = {
  contract: "DEVAM_BOUNDED_AGASTYA_ARGHYA_PROVIDER_FIXTURE_V1";
  fixture_id: "devam-agastya-arghya-delhi-2026-resolved-v1";
  observance_slug: "agastya-arghya-delhi";
  scope: {
    reference_location: "New Delhi, NCT, India";
    geoname_id: 1261481;
    timezone: "Asia/Kolkata";
    supported_tradition_codes: string[];
    selected_civil_date: "2026-09-04";
    displayed_arghya_window_local: "04:58-06:00";
    authority_kind: "location_specific_practitioner_calendar_fixture";
    location_specific: true;
    universal_india_claim: false;
  };
  sources: Array<Record<string, unknown>>;
  decision: Record<string, string | boolean>;
  denials: Record<string, false>;
};

function loadFixture(): Fixture {
  const bytes = readFileSync(resolve(process.cwd(), "../..", "knowledge_packs/panchang/agastya-arghya-delhi-2026-resolved-v1.json"));
  if (createHash("sha256").update(bytes).digest("hex") !== FIXTURE_SHA256) throw new Error("Resolved Agastya Arghya fixture drift");
  const fixture = JSON.parse(bytes.toString("utf8")) as Fixture;
  if (fixture.contract !== "DEVAM_BOUNDED_AGASTYA_ARGHYA_PROVIDER_FIXTURE_V1" || fixture.fixture_id !== "devam-agastya-arghya-delhi-2026-resolved-v1" || fixture.observance_slug !== "agastya-arghya-delhi") throw new Error("Resolved Agastya Arghya identity drift");
  if (JSON.stringify(fixture.scope.supported_tradition_codes) !== JSON.stringify(SUPPORTED_TRADITIONS) || fixture.scope.selected_civil_date !== "2026-09-04" || fixture.scope.displayed_arghya_window_local !== "04:58-06:00" || fixture.scope.universal_india_claim) throw new Error("Resolved Agastya Arghya scope drift");
  if (fixture.sources.length !== 2 || Object.values(fixture.denials).some((value) => value !== false) || fixture.decision.provider_fixture_accepted_for_exact_location_year_lane !== true || fixture.decision.provider_method_reproduced !== false) throw new Error("Resolved Agastya Arghya evidence drift");
  return fixture;
}

const FIXTURE = loadFixture();

export type AgastyaArghyaResolution = {
  observanceSlug: "agastya-arghya-delhi";
  canonicalName: "Agastya Arghya";
  ruleId: "devam-delhi-practitioner-calendar-agastya-arghya-2026-v1";
  rulesetVersion: string;
  status: "resolved_exact_provider_fixture";
  selectedCivilDate: "2026-09-04";
  appliesToRequestedDate: true;
  displayedLocalWindow: "04:58-06:00";
  precedence: {
    kind: "exact_new_delhi_2026_practitioner_calendar_fixture";
    explanation: string;
  };
  evidence: {
    citationArtifactSha256: typeof FIXTURE_SHA256;
    authorityKind: "location_specific_practitioner_calendar_fixture";
    referenceLocation: "New Delhi, NCT, India";
    sourceTextReturnedByApi: false;
  };
  boundaries: {
    generalAlgorithmProved: false;
    providerMethodReproduced: false;
    visibilityGuaranteed: false;
    ritualGuidanceIncluded: false;
    universalTraditionClaim: false;
  };
};

export function resolveAgastyaArghya(request: PanchangRequest, rulesetVersion: string): AgastyaArghyaResolution[] {
  if (request.civilDate !== FIXTURE.scope.selected_civil_date || request.timezone !== FIXTURE.scope.timezone || request.latitude !== 28.6139 || request.longitude !== 77.209 || !SUPPORTED_TRADITIONS.includes(request.traditionCode as typeof SUPPORTED_TRADITIONS[number])) return [];
  return [{
    observanceSlug: "agastya-arghya-delhi",
    canonicalName: "Agastya Arghya",
    ruleId: "devam-delhi-practitioner-calendar-agastya-arghya-2026-v1",
    rulesetVersion,
    status: "resolved_exact_provider_fixture",
    selectedCivilDate: "2026-09-04",
    appliesToRequestedDate: true,
    displayedLocalWindow: "04:58-06:00",
    precedence: { kind: "exact_new_delhi_2026_practitioner_calendar_fixture", explanation: "Use the displayed New Delhi date and window only for this exact 2026 location fixture; the provider method is not reproduced and no general algorithm is claimed." },
    evidence: { citationArtifactSha256: FIXTURE_SHA256, authorityKind: "location_specific_practitioner_calendar_fixture", referenceLocation: "New Delhi, NCT, India", sourceTextReturnedByApi: false },
    boundaries: { generalAlgorithmProved: false, providerMethodReproduced: false, visibilityGuaranteed: false, ritualGuidanceIncluded: false, universalTraditionClaim: false },
  }];
}

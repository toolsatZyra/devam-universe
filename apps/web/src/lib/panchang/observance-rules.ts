import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PanchangFact, PanchangRequest } from "./contracts";
import { calculatePanchang, calculateTithiAtInstant, type TithiInstantFact } from "./engine";
import { resolveAgastyaArghya, type AgastyaArghyaResolution } from "./agastya-arghya-resolved";
import { halaShashthiEvidence } from "./hala-shashthi";
import { dhantrayodashiEvidence } from "./dhantrayodashi";
import { kaliPujaEvidence } from "./kali-puja";
import { tamilDeepavaliEvidence } from "./tamil-deepavali";
import { narakaChaturdashiEvidence } from "./naraka-chaturdashi";
import { kaliChaudasEvidence } from "./kali-chaudas";
import { gujaratiNewYearEvidence } from "./gujarati-new-year";
import { balipadyamiEvidence } from "./balipadyami";
import { karnatakaSaraswatiAyudhaPujaEvidence } from "./karnataka-saraswati-ayudha-puja";
import { jainDiwaliEvidence } from "./jain-diwali";
import { bandiChhorEvidence } from "./bandi-chhor";
import { ahoiAshtamiEvidence } from "./ahoi-ashtami";
import { karwaChauthEvidence } from "./karwa-chauth";
import { sankashtiChaturthiEvidence } from "./sankashti-chaturthi";
import { tulasiVivahEvidence } from "./tulasi-vivah";
import { devDeepawaliEvidence } from "./dev-deepawali";
import { kalabhairavaEvidence } from "./kalabhairava";
import { vivahaPanchamiEvidence } from "./vivaha-panchami";
import { resolveEkadashiObservances, type EkadashiResolution } from "./ekadashi";
import { resolveSolarObservances, type SolarObservanceResolution } from "./solar-observances";
import { resolveChhathObservance, type ChhathResolution } from "./chhath";

const RULE_ENGINE_VERSION = "devam-observance-rules-2026-v35" as const;
const NIRNAYASINDHU_PDF_SHA256 = "a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b";
const PURNIMA_REFERENCE_URL = "https://www.drikpanchang.com/vrats/purnimasidates.html?geoname-id=1261481&year=2026";
const AMAVASYA_REFERENCE_URL = "https://www.drikpanchang.com/vrats/amavasyadates.html?geoname-id=1261481&year=2026";
const MASIKA_SHIVARATRI_REFERENCE_URL = "https://www.drikpanchang.com/vrats/masik-shivaratri-dates.html?geoname-id=1261481&year=2026";
const MASIKA_SHIVARATRI_SEMANTIC_FIXTURE_SHA256 = "f686ae462f8d90d81ec6b8cfa801bc399d3677ec28e660ef8b17748eb02f125c";
const PRADOSHA_FIXTURE_SHA256 = "ecda097f1233723c1e03f49149e12fb48670e88279ea04e49329aa8f931166c0";
const KOJAGARA_FIXTURE_SHA256 = "477309b994fffd5f89eed2d810248b823a650d738964c8f7f4aff8c32698e5f2";
const MASIKA_DURGASHTAMI_FIXTURE_SHA256 = "68130406f9cff8b5f2c12cff08b5b75d8d06cdef02e2d35653f34f2dbf8edcae";
const HARTALIKA_TEEJ_FIXTURE_SHA256 = "bef1772cbb368da2fa712740598d1881b98ffc1b6d8c4a99cfc93e02fa3420a3";
const RISHI_PANCHAMI_FIXTURE_SHA256 = "ddc41a55a00b9755949f4a175a0edb05fc546b6a624acdd0992ffbf8e9b731e1";
const RADHA_ASHTAMI_FIXTURE_SHA256 = "93f9fc2539ff87495012d31d9c87115c68b317eab679dbfc1725877ed9455867";
const KRISHNA_JANMASHTAMI_FIXTURE_SHA256 = "a05f45a558061686e16fbe739b4d78dc5e86f9cf0c809c7f8eec28063123bdf1";

type DecisionWindowKind = "brahma_muhurta" | "sunrise_presence" | "madhyahna" | "aparahna" | "pradosha" | "moonrise_presence" | "moonrise_to_sunrise" | "nishita" | "night";
type TimeWindow = { kind: DecisionWindowKind; startUtc: string; endUtc: string };
type WindowEvidence = { window: TimeWindow; targetTithiOverlapSeconds: number };
type ShivaratriDiagnosticWindows = {
  night: WindowEvidence;
  pradosha: WindowEvidence;
  nishita: WindowEvidence;
};

type CandidateDayEvidence = {
  civilDate: string;
  sunriseUtc: string;
  sunsetUtc: string;
  decisionWindow: TimeWindow;
  targetTithiOverlapSeconds: number;
  targetNakshatraOverlapSeconds?: number;
  diagnosticWindows?: ShivaratriDiagnosticWindows;
};

type RuleConfig = {
  observanceSlug: string;
  canonicalName: string;
  ruleId: string;
  allowedTraditionCodes: readonly ("smarta-west-india" | "smarta-north-india" | "smarta-south-india" | "shakta-bengal" | "vaishnava-iskcon" | "swaminarayan-baps" | "jain-umbrella" | "sikh-sgpc" | "regional-kashi-varanasi")[];
  candidateCivilDates: readonly [string, string];
  requiredReferenceCoordinates?: { latitude: number; longitude: number; timezone: string };
  targetTithi: { index: number; name: string; paksha: "shukla" | "krishna" };
  targetNakshatra?: { index: number; name: string };
  decisionWindowKind: DecisionWindowKind;
  precedenceKind: string;
  precedenceExplanation: string;
  selectionMode?: "greater_overlap_earlier_tie" | "greater_overlap_later_tie" | "official_calendar_first_candidate" | "sankashti_moonrise" | "masika_shivaratri_pradosha_nishita" | "unique_pradosha_overlap" | "unique_nishita_overlap" | "unique_madhyahna_overlap" | "unique_sunrise_presence" | "unique_brahma_muhurta_overlap" | "unique_full_moonrise_to_sunrise_overlap" | "unique_full_nishita_overlap" | "unique_night_minimum_one_ghati_overlap";
  evidencePages: readonly number[];
  primaryEvidence?: { work: string; edition: string; internetArchiveIdentifier: null; citationArtifactSha256: string; rightsLane: "reference_only" };
  evidenceStatus?: "historical_rule_source_plus_location_specific_modern_date_fixture" | "historical_general_naktavrata_context_plus_current_practitioner_rule_and_location_fixture" | "historical_general_tithi_context_plus_current_practitioner_rule_and_location_fixture" | "current_practitioner_rule_and_location_fixture_plus_historical_adjacent_context" | "current_practitioner_rule_and_official_regional_calendar_plus_historical_adjacent_context" | "current_practitioner_rule_and_official_regional_identity_fixture" | "current_sampradaya_rule_and_official_public_context" | "official_regional_date_and_context_fixture" | "official_jain_umbrella_and_community_variant_fixture" | "official_sgpc_calendar_and_sikh_history_fixture";
  sourceScopeNote?: string;
  modernReference: {
    provider: "Drik Panchang" | "BAPS Swaminarayan Sanstha" | "ISKCON Bangalore" | "CGST Karnataka" | "Jain Center of New Jersey" | "Shiromani Gurdwara Parbandhak Committee";
    url: string;
    referenceLocation: string;
    observedCivilDate: string;
    observationRole: "location_specific_date_fixture_not_rule_authority" | "current_practitioner_rule_and_location_specific_date_fixture" | "current_sampradaya_rule_and_location_specific_date_fixture" | "official_regional_date_corroboration_not_practice_authority" | "official_community_calendar_variant_corroboration" | "official_sikh_calendar_date_authority";
    semanticFixtureSha256?: string;
    responseBytes?: number;
    responseSha256?: string;
  };
};

export type ObservanceRuleResolution = {
  observanceSlug: RuleConfig["observanceSlug"];
  canonicalName: string;
  ruleId: string;
  rulesetVersion: typeof RULE_ENGINE_VERSION;
  status: "resolved_for_bounded_2026_candidate_window";
  selectedCivilDate: string;
  appliesToRequestedDate: boolean;
  targetTithi: RuleConfig["targetTithi"];
  targetNakshatra?: RuleConfig["targetNakshatra"];
  candidateDays: CandidateDayEvidence[];
  precedence: { kind: string; explanation: string };
  evidence: {
    work: string;
    edition: string;
    internetArchiveIdentifier: string | null;
    citationImageSha256: typeof NIRNAYASINDHU_PDF_SHA256 | null;
    citationArtifactSha256?: string;
    pdfPages: number[];
    evidenceStatus: "historical_rule_source_plus_location_specific_modern_date_fixture" | "historical_general_naktavrata_context_plus_current_practitioner_rule_and_location_fixture" | "historical_general_tithi_context_plus_current_practitioner_rule_and_location_fixture" | "current_practitioner_rule_and_location_fixture_plus_historical_adjacent_context" | "current_practitioner_rule_and_official_regional_calendar_plus_historical_adjacent_context" | "current_practitioner_rule_and_official_regional_identity_fixture" | "current_sampradaya_rule_and_official_public_context" | "official_regional_date_and_context_fixture" | "official_jain_umbrella_and_community_variant_fixture" | "official_sgpc_calendar_and_sikh_history_fixture";
    sourceScopeNote?: string;
    rightsLane: "private_evidence" | "reference_only";
    sourceTextReturnedByApi: false;
    modernReference: RuleConfig["modernReference"];
  };
  boundaries: {
    completeDayCoverage: false;
    completeSeptemberDecemberCoverage: false;
    modernPracticeResolved: false;
    ritualGuidanceIncluded: false;
    universalTraditionClaim: false;
  };
};

export type ObservanceResolutionResult = {
  ok: true;
  request: PanchangRequest;
  engine: {
    id: "devam-observance-rules";
    version: typeof RULE_ENGINE_VERSION;
    evidenceStatus: "bounded_source_rules_with_location_specific_fixture_validation";
  };
  status: "resolved_supported_subset" | "resolved_subset_with_unresolved_candidates" | "unresolved_candidate_requires_adjudication" | "no_supported_rule_for_context" | "calculation_failed_closed";
  matchedRules: Array<ObservanceRuleResolution | SolarObservanceResolution<typeof RULE_ENGINE_VERSION> | EkadashiResolution<typeof RULE_ENGINE_VERSION> | ChhathResolution<typeof RULE_ENGINE_VERSION> | AgastyaArghyaResolution>;
  unresolvedCandidates: UnresolvedObservanceCandidate[];
  boundaries: {
    completeDayCoverage: false;
    completeSeptemberDecemberCoverage: false;
    ritualGuidanceIncluded: false;
    note: string;
  };
};

export type UnresolvedEkadashiCandidate = {
  observanceSlug: string;
  canonicalName: string;
  displayReason: string;
  status: "source_complexity_requires_rule_adjudication";
  selectedCivilDate: null;
  modernDateLead: string;
  targetTithi: { index: 11 | 26; name: "Ekadashi"; paksha: "shukla" | "krishna" };
  candidateDays: {
    civilDate: string;
    sunriseUtc: string;
    arunodayaStartUtc: string;
    tithiAtArunodaya: TithiInstantFact;
    tithiAtSunrise: TithiInstantFact;
  }[];
  evidence: {
    work: "Nirṇayasindhu";
    edition: "Marathi translation, Mumbai 1865";
    internetArchiveIdentifier: "in.ernet.dli.2015.365977";
    citationImageSha256: typeof NIRNAYASINDHU_PDF_SHA256;
    pdfPages: number[];
    rightsLane: "private_evidence";
    sourceTextReturnedByApi: false;
  };
  requiredDecisionFactors: readonly string[];
  boundaries: { smartaDateResolved: false; vaishnavaDateResolved: false; paranaResolved: false; ritualGuidanceIncluded: false };
};

export type UnresolvedLunarCandidate = {
  observanceSlug: "margashirsha-purnima";
  canonicalName: "Margashirsha Purnima";
  displayReason: string;
  status: "source_rule_and_modern_fixture_require_adjudication";
  selectedCivilDate: null;
  modernDateLead: "2026-12-23";
  targetTithi: { index: 15; name: "Purnima"; paksha: "shukla" };
  candidateDays: {
    civilDate: string;
    sunriseUtc: string;
    moonriseUtc: string | null;
    tithiAtSunrise: TithiInstantFact;
    tithiAtMoonrise: TithiInstantFact | null;
  }[];
  evidence: {
    work: "Nirnayasindhu";
    edition: "Marathi translation, Mumbai 1865";
    internetArchiveIdentifier: "in.ernet.dli.2015.365977";
    citationImageSha256: typeof NIRNAYASINDHU_PDF_SHA256;
    pdfPages: [66];
    rightsLane: "private_evidence";
    sourceTextReturnedByApi: false;
    modernReference: RuleConfig["modernReference"] & { responseBytes: 102831; responseSha256: "bdda6985a696f51edc5663ceccc91fc8ac3f8091b94df0d41444da7aa5171b3b" };
  };
  requiredDecisionFactors: readonly string[];
  boundaries: { calendarDateResolved: false; purnimaVrataResolved: false; ritualGuidanceIncluded: false };
};

export type UnresolvedObservanceCandidate = UnresolvedEkadashiCandidate | UnresolvedLunarCandidate;

type KojagaraFixture = {
  contract: "DEVAM_BOUNDED_KOJAGARA_CALENDAR_FIXTURE_V1";
  fixture_id: "devam-kojagara-delhi-2026-v1";
  scope: {
    reference_location: "Delhi, India";
    geoname_id: 1273294;
    candidate_civil_dates: ["2026-10-25", "2026-10-26"];
    supported_tradition_codes: ["smarta-north-india", "smarta-west-india", "shakta-bengal"];
    location_specific: true;
    universal_india_claim: false;
  };
  sources: Array<{
    source_id: string;
    fixed_carrier_sha256?: string;
    pdf_pages?: number[];
    url?: string;
    fetched_at_utc?: string;
    status?: number;
    final_url?: string;
    response_bytes?: number;
    response_sha256?: string;
    strict_utf8?: boolean;
    evidence_role: string;
    rights_lane: "private_evidence" | "reference_only";
    source_text_returned_by_api: false;
  }>;
  historical_observation: {
    source_heading: string;
    ashvina_purnima_context_present: true;
    kojagari_night_vigil_present: true;
    page_209_transitions_to_kartika: true;
  };
  modern_observation: {
    selected_civil_date: "2026-10-25";
    kojagara_nishita_start_local: string;
    kojagara_nishita_end_local: string;
    moonrise_local: string;
    purnima_tithi_begins_local: string;
    purnima_tithi_ends_local: string;
    selection_statement_present: string;
  };
  rule_contract: {
    target_tithi: "Purnima";
    target_paksha: "shukla";
    selection: string;
    nishita_window: string;
    both_candidates_overlap: "fail_closed";
    neither_candidate_overlaps: "fail_closed";
    separate_named_purnima_calendar_day: true;
    puja_muhurta_calculated: false;
    fasting_procedure_resolved: false;
    puja_procedure_resolved: false;
    night_vigil_procedure_resolved: false;
  };
  denials: Record<string, false>;
};

function loadKojagaraFixture(): KojagaraFixture {
  const path = resolve(process.cwd(), "../..", "knowledge_packs/panchang/kojagara-delhi-2026-v1.json");
  const bytes = readFileSync(path);
  if (createHash("sha256").update(bytes).digest("hex") !== KOJAGARA_FIXTURE_SHA256) throw new Error("Kojagara fixture hash drift");
  const fixture = JSON.parse(bytes.toString("utf8")) as KojagaraFixture;
  if (fixture.contract !== "DEVAM_BOUNDED_KOJAGARA_CALENDAR_FIXTURE_V1" || fixture.fixture_id !== "devam-kojagara-delhi-2026-v1") throw new Error("Kojagara fixture identity drift");
  const expectedScope = {
    reference_location: "Delhi, India",
    geoname_id: 1273294,
    candidate_civil_dates: ["2026-10-25", "2026-10-26"],
    supported_tradition_codes: ["smarta-north-india", "smarta-west-india", "shakta-bengal"],
    location_specific: true,
    universal_india_claim: false,
  };
  if (JSON.stringify(fixture.scope) !== JSON.stringify(expectedScope)) throw new Error("Kojagara fixture scope drift");
  const historical = fixture.sources.find((source) => source.source_id === "nirnayasindhu-1865-ashvayuja-kojagari");
  const current = fixture.sources.find((source) => source.source_id === "drikpanchang-delhi-kojagara-2026");
  if (fixture.sources.length !== 2 || historical?.fixed_carrier_sha256 !== NIRNAYASINDHU_PDF_SHA256 || JSON.stringify(historical.pdf_pages) !== JSON.stringify([208, 209]) || historical.evidence_role !== "historical_ashvina_purnima_night_vigil_and_kojagari_context" || historical.rights_lane !== "private_evidence" || historical.source_text_returned_by_api !== false) throw new Error("Kojagara historical evidence drift");
  const currentUrl = "https://www.drikpanchang.com/festivals/kojagara/kojagara-puja-date-time.html?geoname-id=1273294&year=2026";
  if (current?.url !== currentUrl || current.final_url !== currentUrl || current.status !== 200 || current.response_bytes !== 78509 || current.response_sha256 !== "d0d9099a4b419a4544080ec6b652398bc37eb461f9f79ffce1782a960ddb7fac" || current.strict_utf8 !== true || current.evidence_role !== "current_practitioner_nishita_rule_and_location_specific_date_fixture" || current.rights_lane !== "reference_only" || current.source_text_returned_by_api !== false) throw new Error("Kojagara practitioner evidence drift");
  if (!fixture.historical_observation.ashvina_purnima_context_present || !fixture.historical_observation.kojagari_night_vigil_present || !fixture.historical_observation.page_209_transitions_to_kartika) throw new Error("Kojagara historical observation drift");
  const modern = fixture.modern_observation;
  if (modern.selected_civil_date !== "2026-10-25" || modern.kojagara_nishita_start_local !== "2026-10-25T23:40:00+05:30" || modern.kojagara_nishita_end_local !== "2026-10-26T00:31:00+05:30" || modern.purnima_tithi_begins_local !== "2026-10-25T11:55:00+05:30" || modern.purnima_tithi_ends_local !== "2026-10-26T09:41:00+05:30") throw new Error("Kojagara modern observation drift");
  const rule = fixture.rule_contract;
  if (rule.target_tithi !== "Purnima" || rule.target_paksha !== "shukla" || rule.selection !== "select_only_when_exactly_one_candidate_civil_night_has_purnima_overlap_with_nishita" || rule.nishita_window !== "eighth_of_fifteen_equal_muhurtas_from_local_sunset_to_next_local_sunrise" || rule.both_candidates_overlap !== "fail_closed" || rule.neither_candidate_overlaps !== "fail_closed" || !rule.separate_named_purnima_calendar_day || rule.puja_muhurta_calculated || rule.fasting_procedure_resolved || rule.puja_procedure_resolved || rule.night_vigil_procedure_resolved) throw new Error("Kojagara rule contract drift");
  if (Object.keys(fixture.denials).length !== 10 || Object.values(fixture.denials).some((value) => value !== false)) throw new Error("Kojagara denial drift");
  return fixture;
}

type MasikaDurgashtamiFixture = {
  contract: "DEVAM_BOUNDED_MASIKA_DURGASHTAMI_CALENDAR_FIXTURE_V1";
  fixture_id: "devam-masika-durgashtami-delhi-september-december-2026-v1";
  scope: {
    reference_location: "Delhi, India";
    geoname_id: 1273294;
    civil_date_start: "2026-09-01";
    civil_date_end: "2026-12-31";
    supported_tradition_codes: ["smarta-north-india", "smarta-west-india", "shakta-bengal"];
    location_specific: true;
    universal_india_claim: false;
  };
  sources: Array<{
    source_id: string;
    fixed_carrier_sha256?: string;
    pdf_pages?: number[];
    url?: string;
    status?: number;
    final_url?: string;
    response_bytes?: number;
    response_sha256?: string;
    strict_utf8?: boolean;
    evidence_role: string;
    rights_lane: "private_evidence" | "reference_only";
    source_text_returned_by_api: false;
  }>;
  rule_contract: {
    target_tithi: "Ashtami";
    target_paksha: "shukla";
    selection: string;
    both_candidate_sunrises_qualify: "prefer_later_day";
    neither_candidate_sunrise_qualifies: "fail_closed";
    fasting_procedure_resolved: false;
    worship_procedure_resolved: false;
    mahashtami_equivalence_universal: false;
  };
  observances: Array<{
    observance_slug: string;
    canonical_name: string;
    lunar_month: string;
    candidate_civil_dates: [string, string];
    reference_selected_civil_date: string;
    reference_ashtami_begins_local: string;
    reference_ashtami_ends_local: string;
  }>;
  denials: Record<string, false>;
};

function loadMasikaDurgashtamiFixture(): MasikaDurgashtamiFixture {
  const path = resolve(process.cwd(), "../..", "knowledge_packs/panchang/masika-durgashtami-delhi-september-december-2026-v1.json");
  const bytes = readFileSync(path);
  if (createHash("sha256").update(bytes).digest("hex") !== MASIKA_DURGASHTAMI_FIXTURE_SHA256) throw new Error("Masika Durgashtami fixture hash drift");
  const fixture = JSON.parse(bytes.toString("utf8")) as MasikaDurgashtamiFixture;
  if (fixture.contract !== "DEVAM_BOUNDED_MASIKA_DURGASHTAMI_CALENDAR_FIXTURE_V1" || fixture.fixture_id !== "devam-masika-durgashtami-delhi-september-december-2026-v1") throw new Error("Masika Durgashtami fixture identity drift");
  if (fixture.scope.reference_location !== "Delhi, India" || fixture.scope.geoname_id !== 1273294 || fixture.scope.civil_date_start !== "2026-09-01" || fixture.scope.civil_date_end !== "2026-12-31" || JSON.stringify(fixture.scope.supported_tradition_codes) !== JSON.stringify(["smarta-north-india", "smarta-west-india", "shakta-bengal"]) || !fixture.scope.location_specific || fixture.scope.universal_india_claim) throw new Error("Masika Durgashtami fixture scope drift");
  const historical = fixture.sources.find((source) => source.source_id === "nirnayasindhu-1865-general-ashtami-decision");
  const current = fixture.sources.find((source) => source.source_id === "drikpanchang-delhi-masika-durgashtami-2026");
  if (fixture.sources.length !== 2 || historical?.fixed_carrier_sha256 !== NIRNAYASINDHU_PDF_SHA256 || JSON.stringify(historical.pdf_pages) !== JSON.stringify([51, 52]) || historical.evidence_role !== "historical_shukla_ashtami_later_day_and_shiva_shakti_festival_context" || historical.rights_lane !== "private_evidence" || historical.source_text_returned_by_api !== false) throw new Error("Masika Durgashtami historical evidence drift");
  const currentUrl = "https://www.drikpanchang.com/vrats/masik-durgashtami-dates.html?geoname-id=1273294&year=2026";
  if (current?.url !== currentUrl || current.final_url !== currentUrl || current.status !== 200 || current.response_bytes !== 82080 || current.response_sha256 !== "c4dd71aeb98c5bc76f76878428820ae41158f6d1f4a57096d6abd5982659b47d" || current.strict_utf8 !== true || current.evidence_role !== "current_practitioner_observance_identity_and_location_specific_date_fixture" || current.rights_lane !== "reference_only" || current.source_text_returned_by_api !== false) throw new Error("Masika Durgashtami practitioner evidence drift");
  const rule = fixture.rule_contract;
  if (rule.target_tithi !== "Ashtami" || rule.target_paksha !== "shukla" || rule.selection !== "select_the_later_candidate_day_with_shukla_ashtami_at_local_sunrise" || rule.both_candidate_sunrises_qualify !== "prefer_later_day" || rule.neither_candidate_sunrise_qualifies !== "fail_closed" || rule.fasting_procedure_resolved || rule.worship_procedure_resolved || rule.mahashtami_equivalence_universal) throw new Error("Masika Durgashtami rule contract drift");
  if (fixture.observances.length !== 4 || new Set(fixture.observances.map((row) => row.observance_slug)).size !== 4 || Object.keys(fixture.denials).length !== 10 || Object.values(fixture.denials).some((value) => value !== false)) throw new Error("Masika Durgashtami fixture completeness or denial drift");
  for (const row of fixture.observances) {
    if (row.candidate_civil_dates.length !== 2 || !row.candidate_civil_dates.includes(row.reference_selected_civil_date) || !(Date.parse(row.reference_ashtami_begins_local) < Date.parse(row.reference_ashtami_ends_local))) throw new Error(`Invalid Masika Durgashtami fixture row: ${row.observance_slug}`);
  }
  return fixture;
}

type HartalikaTeejFixture = {
  contract: "DEVAM_BOUNDED_HARTALIKA_TEEJ_CALENDAR_FIXTURE_V1";
  fixture_id: "devam-hartalika-teej-delhi-2026-v1";
  scope: {
    reference_location: "Delhi, India";
    geoname_id: 1273294;
    candidate_civil_dates: ["2026-09-13", "2026-09-14"];
    supported_tradition_codes: ["smarta-north-india", "smarta-west-india"];
    location_specific: true;
    universal_india_claim: false;
  };
  sources: Array<{
    source_id: string;
    fixed_carrier_sha256?: string;
    pdf_pages?: number[];
    printed_page?: string;
    url?: string;
    fetched_at_utc?: string;
    status?: number;
    final_url?: string;
    response_bytes?: number;
    response_sha256?: string;
    strict_utf8?: boolean;
    evidence_role: string;
    rights_lane: "private_evidence" | "reference_only";
    source_text_returned_by_api: false;
  }>;
  historical_observation: {
    source_heading: "Haritalika-vrata-nirnaya";
    bhadrapada_shukla_tritiya_context_present: true;
    later_day_when_tritiya_is_briefly_present_after_sunrise: true;
    ritual_instructions_not_promoted: true;
  };
  modern_observation: {
    selected_civil_date: "2026-09-14";
    tritiya_tithi_begins_local: string;
    tritiya_tithi_ends_local: string;
    pratahkala_interval_begins_local: string;
    pratahkala_interval_ends_local: string;
  };
  rule_contract: {
    target_tithi: "Tritiya";
    target_paksha: "shukla";
    selection: string;
    both_candidate_sunrises_qualify: "prefer_later_day";
    neither_candidate_sunrise_qualifies: "fail_closed";
    fasting_procedure_resolved: false;
    puja_procedure_resolved: false;
    outcome_claims_resolved: false;
    gowri_habba_equivalence_universal: false;
  };
  denials: Record<string, false>;
};

function loadHartalikaTeejFixture(): HartalikaTeejFixture {
  const path = resolve(process.cwd(), "../..", "knowledge_packs/panchang/hartalika-teej-delhi-2026-v1.json");
  const bytes = readFileSync(path);
  if (createHash("sha256").update(bytes).digest("hex") !== HARTALIKA_TEEJ_FIXTURE_SHA256) throw new Error("Hartalika Teej fixture hash drift");
  const fixture = JSON.parse(bytes.toString("utf8")) as HartalikaTeejFixture;
  if (fixture.contract !== "DEVAM_BOUNDED_HARTALIKA_TEEJ_CALENDAR_FIXTURE_V1" || fixture.fixture_id !== "devam-hartalika-teej-delhi-2026-v1") throw new Error("Hartalika Teej fixture identity drift");
  const expectedScope = {
    reference_location: "Delhi, India",
    geoname_id: 1273294,
    candidate_civil_dates: ["2026-09-13", "2026-09-14"],
    supported_tradition_codes: ["smarta-north-india", "smarta-west-india"],
    location_specific: true,
    universal_india_claim: false,
  };
  if (JSON.stringify(fixture.scope) !== JSON.stringify(expectedScope)) throw new Error("Hartalika Teej fixture scope drift");
  const historical = fixture.sources.find((source) => source.source_id === "nirnayasindhu-1865-hartalika-vrata-decision");
  const current = fixture.sources.find((source) => source.source_id === "drikpanchang-delhi-hartalika-teej-2026");
  if (fixture.sources.length !== 2 || historical?.fixed_carrier_sha256 !== NIRNAYASINDHU_PDF_SHA256 || JSON.stringify(historical.pdf_pages) !== JSON.stringify([150]) || historical.printed_page !== "133" || historical.evidence_role !== "historical_bhadrapada_shukla_tritiya_later_day_even_when_briefly_present_after_sunrise" || historical.rights_lane !== "private_evidence" || historical.source_text_returned_by_api !== false) throw new Error("Hartalika Teej historical evidence drift");
  const currentUrl = "https://www.drikpanchang.com/festivals/teej/hartalika-teej-date-time.html?geoname-id=1273294&year=2026";
  if (current?.url !== currentUrl || current.final_url !== currentUrl || current.status !== 200 || current.response_bytes !== 66646 || current.response_sha256 !== "90f7b062dcd887fb0eb0c2922bef3ae281e4cf378ec5f680c4f3bc0c69a915ae" || current.strict_utf8 !== true || current.evidence_role !== "current_practitioner_observance_identity_and_location_specific_date_fixture" || current.rights_lane !== "reference_only" || current.source_text_returned_by_api !== false) throw new Error("Hartalika Teej practitioner evidence drift");
  const historicalObservation = fixture.historical_observation;
  if (historicalObservation.source_heading !== "Haritalika-vrata-nirnaya" || !historicalObservation.bhadrapada_shukla_tritiya_context_present || !historicalObservation.later_day_when_tritiya_is_briefly_present_after_sunrise || !historicalObservation.ritual_instructions_not_promoted) throw new Error("Hartalika Teej historical observation drift");
  const modern = fixture.modern_observation;
  if (modern.selected_civil_date !== "2026-09-14" || modern.tritiya_tithi_begins_local !== "2026-09-13T07:08:00+05:30" || modern.tritiya_tithi_ends_local !== "2026-09-14T07:06:00+05:30" || modern.pratahkala_interval_begins_local !== "2026-09-14T06:05:00+05:30" || modern.pratahkala_interval_ends_local !== "2026-09-14T07:06:00+05:30") throw new Error("Hartalika Teej modern observation drift");
  const rule = fixture.rule_contract;
  if (rule.target_tithi !== "Tritiya" || rule.target_paksha !== "shukla" || rule.selection !== "select_the_later_candidate_day_with_bhadrapada_shukla_tritiya_at_local_sunrise" || rule.both_candidate_sunrises_qualify !== "prefer_later_day" || rule.neither_candidate_sunrise_qualifies !== "fail_closed" || rule.fasting_procedure_resolved || rule.puja_procedure_resolved || rule.outcome_claims_resolved || rule.gowri_habba_equivalence_universal) throw new Error("Hartalika Teej rule contract drift");
  if (Object.keys(fixture.denials).length !== 10 || Object.values(fixture.denials).some((value) => value !== false)) throw new Error("Hartalika Teej denial drift");
  return fixture;
}

type RishiPanchamiFixture = {
  contract: "DEVAM_BOUNDED_RISHI_PANCHAMI_CALENDAR_FIXTURE_V1";
  fixture_id: "devam-rishi-panchami-delhi-2026-v1";
  scope: {
    reference_location: "Delhi, India";
    geoname_id: 1273294;
    candidate_civil_dates: ["2026-09-15", "2026-09-16"];
    supported_tradition_codes: ["smarta-north-india", "smarta-west-india"];
    location_specific: true;
    universal_india_claim: false;
  };
  sources: Array<{
    source_id: string;
    fixed_carrier_sha256?: string;
    pdf_pages?: number[];
    printed_page?: string;
    url?: string;
    status?: number;
    final_url?: string;
    response_bytes?: number;
    response_sha256?: string;
    strict_utf8?: boolean;
    evidence_role: string;
    rights_lane: "private_evidence" | "reference_only";
    source_text_returned_by_api: false;
  }>;
  historical_observation: {
    source_heading: "Rishi-panchami";
    bhadrapada_shukla_panchami_context_present: true;
    madhyahna_presence_required: true;
    two_day_precedence_opinions_conflict: true;
    ritual_instructions_not_promoted: true;
  };
  modern_observation: {
    selected_civil_date: "2026-09-15";
    panchami_tithi_begins_local: string;
    panchami_tithi_ends_local: string;
    published_puja_interval_begins_local: string;
    published_puja_interval_ends_local: string;
  };
  rule_contract: {
    target_tithi: "Panchami";
    target_paksha: "shukla";
    selection: string;
    both_candidates_overlap: "fail_closed_due_to_preserved_precedence_conflict";
    neither_candidate_overlaps: "fail_closed";
    puja_muhurta_calculated: false;
    fasting_procedure_resolved: false;
    puja_procedure_resolved: false;
    historical_purity_or_menstruation_claims_promoted: false;
  };
  denials: Record<string, false>;
};

function loadRishiPanchamiFixture(): RishiPanchamiFixture {
  const path = resolve(process.cwd(), "../..", "knowledge_packs/panchang/rishi-panchami-delhi-2026-v1.json");
  const bytes = readFileSync(path);
  if (createHash("sha256").update(bytes).digest("hex") !== RISHI_PANCHAMI_FIXTURE_SHA256) throw new Error("Rishi Panchami fixture hash drift");
  const fixture = JSON.parse(bytes.toString("utf8")) as RishiPanchamiFixture;
  if (fixture.contract !== "DEVAM_BOUNDED_RISHI_PANCHAMI_CALENDAR_FIXTURE_V1" || fixture.fixture_id !== "devam-rishi-panchami-delhi-2026-v1") throw new Error("Rishi Panchami fixture identity drift");
  const expectedScope = {
    reference_location: "Delhi, India",
    geoname_id: 1273294,
    candidate_civil_dates: ["2026-09-15", "2026-09-16"],
    supported_tradition_codes: ["smarta-north-india", "smarta-west-india"],
    location_specific: true,
    universal_india_claim: false,
  };
  if (JSON.stringify(fixture.scope) !== JSON.stringify(expectedScope)) throw new Error("Rishi Panchami fixture scope drift");
  const historical = fixture.sources.find((source) => source.source_id === "nirnayasindhu-1865-rishi-panchami-decision");
  const current = fixture.sources.find((source) => source.source_id === "drikpanchang-delhi-rishi-panchami-2026");
  if (fixture.sources.length !== 2 || historical?.fixed_carrier_sha256 !== NIRNAYASINDHU_PDF_SHA256 || JSON.stringify(historical.pdf_pages) !== JSON.stringify([151]) || historical.printed_page !== "134" || historical.evidence_role !== "historical_bhadrapada_shukla_panchami_madhyahna_rule_with_competing_two_day_precedence" || historical.rights_lane !== "private_evidence" || historical.source_text_returned_by_api !== false) throw new Error("Rishi Panchami historical evidence drift");
  const currentUrl = "https://www.drikpanchang.com/festivals/rishi-panchami/rishi-panchami-date-time.html?geoname-id=1273294&year=2026";
  if (current?.url !== currentUrl || current.final_url !== currentUrl || current.status !== 200 || current.response_bytes !== 62659 || current.response_sha256 !== "20ecae009600fb8f4b58d03a1a510752db7bf18183205122460120d9399aa59a" || current.strict_utf8 !== true || current.evidence_role !== "current_practitioner_observance_identity_and_location_specific_date_fixture" || current.rights_lane !== "reference_only" || current.source_text_returned_by_api !== false) throw new Error("Rishi Panchami practitioner evidence drift");
  const historicalObservation = fixture.historical_observation;
  if (historicalObservation.source_heading !== "Rishi-panchami" || !historicalObservation.bhadrapada_shukla_panchami_context_present || !historicalObservation.madhyahna_presence_required || !historicalObservation.two_day_precedence_opinions_conflict || !historicalObservation.ritual_instructions_not_promoted) throw new Error("Rishi Panchami historical observation drift");
  const modern = fixture.modern_observation;
  if (modern.selected_civil_date !== "2026-09-15" || modern.panchami_tithi_begins_local !== "2026-09-15T07:44:00+05:30" || modern.panchami_tithi_ends_local !== "2026-09-16T08:59:00+05:30" || modern.published_puja_interval_begins_local !== "2026-09-15T11:02:00+05:30" || modern.published_puja_interval_ends_local !== "2026-09-15T13:30:00+05:30") throw new Error("Rishi Panchami modern observation drift");
  const rule = fixture.rule_contract;
  if (rule.target_tithi !== "Panchami" || rule.target_paksha !== "shukla" || rule.selection !== "select_only_when_exactly_one_candidate_local_madhyahna_has_bhadrapada_shukla_panchami_overlap" || rule.both_candidates_overlap !== "fail_closed_due_to_preserved_precedence_conflict" || rule.neither_candidate_overlaps !== "fail_closed" || rule.puja_muhurta_calculated || rule.fasting_procedure_resolved || rule.puja_procedure_resolved || rule.historical_purity_or_menstruation_claims_promoted) throw new Error("Rishi Panchami rule contract drift");
  if (Object.keys(fixture.denials).length !== 10 || Object.values(fixture.denials).some((value) => value !== false)) throw new Error("Rishi Panchami denial drift");
  return fixture;
}

type RadhaAshtamiFixture = {
  contract: "DEVAM_BOUNDED_RADHA_ASHTAMI_ISKCON_CALENDAR_FIXTURE_V1";
  fixture_id: "devam-radha-ashtami-delhi-iskcon-2026-v1";
  scope: {
    reference_location: "Delhi, India";
    geoname_id: 1273294;
    candidate_civil_dates: ["2026-09-18", "2026-09-19"];
    supported_tradition_codes: ["vaishnava-iskcon"];
    location_specific: true;
    universal_india_claim: false;
    all_vaishnava_traditions_claim: false;
  };
  sources: Array<{
    source_id: string;
    provider?: string;
    fixed_carrier_sha256?: string;
    pdf_pages?: number[];
    url?: string;
    status?: number;
    final_url?: string;
    response_bytes?: number;
    response_sha256?: string;
    strict_utf8?: boolean;
    evidence_role: string;
    rights_lane: "private_evidence" | "reference_only";
    source_text_returned_by_api: false;
  }>;
  modern_observation: {
    selected_civil_date: "2026-09-19";
    ashtami_tithi_begins_local: string;
    ashtami_tithi_ends_local: string;
    madhyahna_interval_begins_local: string;
    madhyahna_interval_ends_local: string;
    iskcon_panchang_identity_present: true;
  };
  rule_contract: {
    target_tithi: "Ashtami";
    target_paksha: "shukla";
    selection: string;
    neither_candidate_overlaps: "fail_closed";
    puja_muhurta_calculated: false;
    fasting_procedure_resolved: false;
    puja_procedure_resolved: false;
    all_vaishnava_traditions_equivalent: false;
  };
  denials: Record<string, false>;
};

function loadRadhaAshtamiFixture(): RadhaAshtamiFixture {
  const path = resolve(process.cwd(), "../..", "knowledge_packs/panchang/radha-ashtami-delhi-iskcon-2026-v1.json");
  const bytes = readFileSync(path);
  if (createHash("sha256").update(bytes).digest("hex") !== RADHA_ASHTAMI_FIXTURE_SHA256) throw new Error("Radha Ashtami fixture hash drift");
  const fixture = JSON.parse(bytes.toString("utf8")) as RadhaAshtamiFixture;
  if (fixture.contract !== "DEVAM_BOUNDED_RADHA_ASHTAMI_ISKCON_CALENDAR_FIXTURE_V1" || fixture.fixture_id !== "devam-radha-ashtami-delhi-iskcon-2026-v1") throw new Error("Radha Ashtami fixture identity drift");
  const expectedScope = {
    reference_location: "Delhi, India",
    geoname_id: 1273294,
    candidate_civil_dates: ["2026-09-18", "2026-09-19"],
    supported_tradition_codes: ["vaishnava-iskcon"],
    location_specific: true,
    universal_india_claim: false,
    all_vaishnava_traditions_claim: false,
  };
  if (JSON.stringify(fixture.scope) !== JSON.stringify(expectedScope)) throw new Error("Radha Ashtami fixture scope drift");
  const historical = fixture.sources.find((source) => source.source_id === "nirnayasindhu-1865-general-shukla-ashtami-context");
  const current = fixture.sources.find((source) => source.source_id === "drikpanchang-delhi-radha-ashtami-iskcon-2026");
  if (fixture.sources.length !== 2 || historical?.fixed_carrier_sha256 !== NIRNAYASINDHU_PDF_SHA256 || JSON.stringify(historical.pdf_pages) !== JSON.stringify([51, 52]) || historical.evidence_role !== "historical_general_shukla_ashtami_later_day_context_not_radha_identity_or_madhyahna_authority" || historical.rights_lane !== "private_evidence" || historical.source_text_returned_by_api !== false) throw new Error("Radha Ashtami historical evidence drift");
  const currentUrl = "https://www.drikpanchang.com/festivals/radha-ashtami/radha-ashtami-date-time.html?geoname-id=1273294&year=2026";
  if (current?.provider !== "Drik Panchang - ISKCON Panchang lane" || current.url !== currentUrl || current.final_url !== currentUrl || current.status !== 200 || current.response_bytes !== 67159 || current.response_sha256 !== "fae89430859fb45d5f1f00fa9969477fd197646f2453e9e7befffad6546452b1" || current.strict_utf8 !== true || current.evidence_role !== "current_iskcon_practitioner_identity_madhyahna_rule_and_location_specific_date_fixture" || current.rights_lane !== "reference_only" || current.source_text_returned_by_api !== false) throw new Error("Radha Ashtami practitioner evidence drift");
  const modern = fixture.modern_observation;
  if (modern.selected_civil_date !== "2026-09-19" || modern.ashtami_tithi_begins_local !== "2026-09-18T13:00:00+05:30" || modern.ashtami_tithi_ends_local !== "2026-09-19T15:26:00+05:30" || modern.madhyahna_interval_begins_local !== "2026-09-19T11:01:00+05:30" || modern.madhyahna_interval_ends_local !== "2026-09-19T13:28:00+05:30" || !modern.iskcon_panchang_identity_present) throw new Error("Radha Ashtami modern observation drift");
  const rule = fixture.rule_contract;
  if (rule.target_tithi !== "Ashtami" || rule.target_paksha !== "shukla" || rule.selection !== "select_candidate_with_greater_bhadrapada_shukla_ashtami_overlap_during_local_madhyahna_preferring_later_day_on_tie" || rule.neither_candidate_overlaps !== "fail_closed" || rule.puja_muhurta_calculated || rule.fasting_procedure_resolved || rule.puja_procedure_resolved || rule.all_vaishnava_traditions_equivalent) throw new Error("Radha Ashtami rule contract drift");
  if (Object.keys(fixture.denials).length !== 10 || Object.values(fixture.denials).some((value) => value !== false)) throw new Error("Radha Ashtami denial drift");
  return fixture;
}

type KrishnaJanmashtamiFixture = {
  contract: "DEVAM_BOUNDED_KRISHNA_JANMASHTAMI_CALENDAR_FIXTURE_V1";
  fixture_id: "devam-krishna-janmashtami-delhi-2026-v1";
  scope: {
    reference_location: "Delhi, India";
    geoname_id: 1273294;
    candidate_civil_dates: ["2026-09-03", "2026-09-04"];
    supported_tradition_codes: ["smarta-north-india", "smarta-west-india", "vaishnava-iskcon"];
    location_specific: true;
    universal_india_claim: false;
    smarta_and_iskcon_rules_equivalent_claim: false;
    all_vaishnava_traditions_claim: false;
  };
  sources: Array<{
    source_id: string;
    provider?: string;
    fixed_carrier_sha256?: string;
    pdf_pages?: number[];
    printed_pages?: string;
    url?: string;
    status?: number;
    final_url?: string;
    response_bytes?: number;
    response_sha256?: string;
    strict_utf8?: boolean;
    evidence_role: string;
    rights_lane: "private_evidence" | "reference_only";
    source_text_returned_by_api: false;
  }>;
  modern_observation: {
    smarta_selected_civil_date: "2026-09-04";
    iskcon_selected_civil_date: "2026-09-04";
    published_nishita_begins_local: string;
    published_nishita_ends_local: string;
    ashtami_tithi_begins_local: string;
    ashtami_tithi_ends_local: string;
    rohini_nakshatra_begins_local: string;
    rohini_nakshatra_ends_local: string;
    smarta_and_iskcon_lanes_present_separately: true;
    same_2026_civil_date_does_not_prove_rule_equivalence: true;
  };
  rule_contract: {
    target_tithi: "Ashtami";
    target_paksha: "krishna";
    diagnostic_nakshatra: "Rohini";
    selection: string;
    rohini_role: string;
    both_candidates_overlap: "fail_closed";
    neither_candidate_overlaps: "fail_closed";
    smarta_and_iskcon_lanes_remain_separate: true;
    puja_muhurta_served: false;
    fasting_procedure_resolved: false;
    puja_procedure_resolved: false;
    parana_resolved: false;
    dahi_handi_procedure_resolved: false;
  };
  denials: Record<string, false>;
};

function loadKrishnaJanmashtamiFixture(): KrishnaJanmashtamiFixture {
  const path = resolve(process.cwd(), "../..", "knowledge_packs/panchang/krishna-janmashtami-delhi-2026-v1.json");
  const bytes = readFileSync(path);
  if (createHash("sha256").update(bytes).digest("hex") !== KRISHNA_JANMASHTAMI_FIXTURE_SHA256) throw new Error("Krishna Janmashtami fixture hash drift");
  const fixture = JSON.parse(bytes.toString("utf8")) as KrishnaJanmashtamiFixture;
  if (fixture.contract !== "DEVAM_BOUNDED_KRISHNA_JANMASHTAMI_CALENDAR_FIXTURE_V1" || fixture.fixture_id !== "devam-krishna-janmashtami-delhi-2026-v1") throw new Error("Krishna Janmashtami fixture identity drift");
  const expectedScope = {
    reference_location: "Delhi, India",
    geoname_id: 1273294,
    candidate_civil_dates: ["2026-09-03", "2026-09-04"],
    supported_tradition_codes: ["smarta-north-india", "smarta-west-india", "vaishnava-iskcon"],
    location_specific: true,
    universal_india_claim: false,
    smarta_and_iskcon_rules_equivalent_claim: false,
    all_vaishnava_traditions_claim: false,
  };
  if (JSON.stringify(fixture.scope) !== JSON.stringify(expectedScope)) throw new Error("Krishna Janmashtami fixture scope drift");
  const historical = fixture.sources.find((source) => source.source_id === "nirnayasindhu-1865-janmashtami-decision");
  const smarta = fixture.sources.find((source) => source.source_id === "drikpanchang-delhi-janmashtami-smarta-2026");
  const iskcon = fixture.sources.find((source) => source.source_id === "drikpanchang-delhi-janmashtami-iskcon-2026");
  const expectedPages = [140, 141, 142, 143, 144, 145, 146, 147, 148, 149];
  if (fixture.sources.length !== 3 || historical?.fixed_carrier_sha256 !== NIRNAYASINDHU_PDF_SHA256 || JSON.stringify(historical.pdf_pages) !== JSON.stringify(expectedPages) || historical.printed_pages !== "123-132" || historical.evidence_role !== "historical_janmashtami_jayanti_ashtami_rohini_nishita_and_parana_decision_context" || historical.rights_lane !== "private_evidence" || historical.source_text_returned_by_api !== false) throw new Error("Krishna Janmashtami historical evidence drift");
  const smartaUrl = "https://www.drikpanchang.com/dashavatara/lord-krishna/krishna-janmashtami-date-time.html?geoname-id=1273294&year=2026";
  const iskconUrl = "https://www.drikpanchang.com/iskcon/lord/krishna-janmashtami-date-time.html?geoname-id=1273294&year=2026";
  if (smarta?.provider !== "Drik Panchang - Smarta Janmashtami lane" || smarta.url !== smartaUrl || smarta.final_url !== smartaUrl || smarta.status !== 200 || smarta.response_bytes !== 88987 || smarta.response_sha256 !== "9f4e450ca60b167289584cdc200a5d2599572756d48dba4bc49819cfe2119b3c" || smarta.strict_utf8 !== true || smarta.evidence_role !== "current_smarta_practitioner_identity_nishita_rule_and_location_specific_date_fixture" || smarta.rights_lane !== "reference_only" || smarta.source_text_returned_by_api !== false) throw new Error("Krishna Janmashtami Smarta evidence drift");
  if (iskcon?.provider !== "Drik Panchang - ISKCON Janmashtami lane" || iskcon.url !== iskconUrl || iskcon.final_url !== iskconUrl || iskcon.status !== 200 || iskcon.response_bytes !== 83943 || iskcon.response_sha256 !== "d683b0823e1bdcc708910485f4d04ba8211452d06d35163fb9797fd7f33e62fd" || iskcon.strict_utf8 !== true || iskcon.evidence_role !== "current_iskcon_practitioner_identity_nishita_rule_and_location_specific_date_fixture" || iskcon.rights_lane !== "reference_only" || iskcon.source_text_returned_by_api !== false) throw new Error("Krishna Janmashtami ISKCON evidence drift");
  const modern = fixture.modern_observation;
  if (modern.smarta_selected_civil_date !== "2026-09-04" || modern.iskcon_selected_civil_date !== "2026-09-04" || modern.published_nishita_begins_local !== "2026-09-04T23:57:00+05:30" || modern.published_nishita_ends_local !== "2026-09-05T00:43:00+05:30" || modern.ashtami_tithi_begins_local !== "2026-09-04T02:25:00+05:30" || modern.ashtami_tithi_ends_local !== "2026-09-05T00:13:00+05:30" || modern.rohini_nakshatra_begins_local !== "2026-09-04T00:29:00+05:30" || modern.rohini_nakshatra_ends_local !== "2026-09-04T23:04:00+05:30" || !modern.smarta_and_iskcon_lanes_present_separately || !modern.same_2026_civil_date_does_not_prove_rule_equivalence) throw new Error("Krishna Janmashtami modern observation drift");
  const rule = fixture.rule_contract;
  if (rule.target_tithi !== "Ashtami" || rule.target_paksha !== "krishna" || rule.diagnostic_nakshatra !== "Rohini" || rule.selection !== "for_each_bounded_tradition_lane_select_only_when_exactly_one_candidate_civil_night_has_krishna_ashtami_overlap_with_local_nishita" || rule.rohini_role !== "preserve_exact_nishita_overlap_diagnostic_without_requiring_or_silently_correcting_it" || rule.both_candidates_overlap !== "fail_closed" || rule.neither_candidate_overlaps !== "fail_closed" || !rule.smarta_and_iskcon_lanes_remain_separate || rule.puja_muhurta_served || rule.fasting_procedure_resolved || rule.puja_procedure_resolved || rule.parana_resolved || rule.dahi_handi_procedure_resolved) throw new Error("Krishna Janmashtami rule contract drift");
  if (Object.keys(fixture.denials).length !== 12 || Object.values(fixture.denials).some((value) => value !== false)) throw new Error("Krishna Janmashtami denial drift");
  return fixture;
}

type PradoshaFixture = {
  contract: "DEVAM_BOUNDED_PRADOSHA_CALENDAR_FIXTURE_V1";
  fixture_id: "devam-pradosha-delhi-september-december-2026-v1";
  scope: {
    reference_location: "Delhi, India";
    geoname_id: 1273294;
    civil_date_start: "2026-09-01";
    civil_date_end: "2026-12-31";
    supported_tradition_codes: ["smarta-north-india", "smarta-west-india"];
    location_specific: true;
    universal_india_claim: false;
  };
  sources: Array<{
    source_id: string;
    fixed_carrier_sha256?: string;
    pdf_pages?: number[];
    url?: string;
    response_bytes?: number;
    response_sha256?: string;
    strict_utf8?: boolean;
    evidence_role: string;
    rights_lane: "private_evidence" | "reference_only";
    source_text_returned_by_api: false;
  }>;
  rule_contract: {
    target_tithi: "Trayodashi";
    target_pakshas: ["krishna", "shukla"];
    selection: "select_only_when_exactly_one_candidate_civil_evening_has_target_trayodashi_overlap_with_the_bounded_pradosha_window";
    bounded_pradosha_window: "sunset_through_144_minutes_after_sunset";
    both_candidates_overlap: "fail_closed";
    neither_candidate_overlaps: "fail_closed";
    puja_muhurta_calculated: false;
    fasting_procedure_resolved: false;
    puja_procedure_resolved: false;
    parana_resolved: false;
  };
  observances: Array<{
    observance_slug: string;
    canonical_name: string;
    lunar_month: string;
    paksha: "krishna" | "shukla";
    candidate_civil_dates: [string, string];
    reference_selected_civil_date: string;
    reference_trayodashi_begins_local: string;
    reference_trayodashi_ends_local: string;
  }>;
  denials: Record<string, false>;
};

function loadPradoshaFixture(): PradoshaFixture {
  const path = resolve(process.cwd(), "../..", "knowledge_packs/panchang/pradosha-delhi-september-december-2026-v1.json");
  const bytes = readFileSync(path);
  if (createHash("sha256").update(bytes).digest("hex") !== PRADOSHA_FIXTURE_SHA256) throw new Error("Pradosha fixture hash drift");
  const fixture = JSON.parse(bytes.toString("utf8")) as PradoshaFixture;
  if (fixture.contract !== "DEVAM_BOUNDED_PRADOSHA_CALENDAR_FIXTURE_V1" || fixture.fixture_id !== "devam-pradosha-delhi-september-december-2026-v1") throw new Error("Pradosha fixture identity drift");
  if (fixture.scope.reference_location !== "Delhi, India" || fixture.scope.geoname_id !== 1273294 || fixture.scope.civil_date_start !== "2026-09-01" || fixture.scope.civil_date_end !== "2026-12-31" || !fixture.scope.location_specific || fixture.scope.universal_india_claim) throw new Error("Pradosha fixture scope drift");
  if (JSON.stringify(fixture.scope.supported_tradition_codes) !== JSON.stringify(["smarta-north-india", "smarta-west-india"])) throw new Error("Pradosha tradition scope drift");
  const historical = fixture.sources.find((source) => source.source_id === "nirnayasindhu-1865-general-naktavrata-context");
  const current = fixture.sources.find((source) => source.source_id === "drikpanchang-delhi-pradosha-2026");
  if (fixture.sources.length !== 2 || historical?.fixed_carrier_sha256 !== NIRNAYASINDHU_PDF_SHA256 || JSON.stringify(historical.pdf_pages) !== JSON.stringify([37, 38, 48]) || historical.evidence_role !== "general_naktavrata_pradosha_interval_and_conflict_context_only" || historical.rights_lane !== "private_evidence" || historical.source_text_returned_by_api !== false) throw new Error("Pradosha historical evidence drift");
  if (current?.url !== "https://www.drikpanchang.com/vrats/pradoshdates.html?geoname-id=1273294&year=2026" || current.response_bytes !== 126821 || current.response_sha256 !== "94ab318ba1acfb84daa160fb161062420985fc07919c7a76de61b7ad439a9ac1" || current.strict_utf8 !== true || current.evidence_role !== "current_practitioner_rule_and_location_specific_date_fixture" || current.rights_lane !== "reference_only" || current.source_text_returned_by_api !== false) throw new Error("Pradosha practitioner evidence drift");
  const rule = fixture.rule_contract;
  if (rule.target_tithi !== "Trayodashi" || JSON.stringify(rule.target_pakshas) !== JSON.stringify(["krishna", "shukla"]) || rule.selection !== "select_only_when_exactly_one_candidate_civil_evening_has_target_trayodashi_overlap_with_the_bounded_pradosha_window" || rule.bounded_pradosha_window !== "sunset_through_144_minutes_after_sunset" || rule.both_candidates_overlap !== "fail_closed" || rule.neither_candidate_overlaps !== "fail_closed" || rule.puja_muhurta_calculated || rule.fasting_procedure_resolved || rule.puja_procedure_resolved || rule.parana_resolved) throw new Error("Pradosha rule contract drift");
  if (fixture.observances.length !== 8 || new Set(fixture.observances.map((row) => row.observance_slug)).size !== 8 || Object.keys(fixture.denials).length !== 9 || Object.values(fixture.denials).some((value) => value !== false)) throw new Error("Pradosha fixture completeness or denial drift");
  for (const row of fixture.observances) {
    if (row.candidate_civil_dates.length !== 2 || !row.candidate_civil_dates.includes(row.reference_selected_civil_date) || !(Date.parse(row.reference_trayodashi_begins_local) < Date.parse(row.reference_trayodashi_ends_local))) throw new Error(`Invalid Pradosha fixture row: ${row.observance_slug}`);
  }
  return fixture;
}

const KOJAGARA_FIXTURE = loadKojagaraFixture();
const MASIKA_DURGASHTAMI_FIXTURE = loadMasikaDurgashtamiFixture();
const HARTALIKA_TEEJ_FIXTURE = loadHartalikaTeejFixture();
const RISHI_PANCHAMI_FIXTURE = loadRishiPanchamiFixture();
const RADHA_ASHTAMI_FIXTURE = loadRadhaAshtamiFixture();
const KRISHNA_JANMASHTAMI_FIXTURE = loadKrishnaJanmashtamiFixture();
const PRADOSHA_FIXTURE = loadPradoshaFixture();
const PRADOSHA_RULES: RuleConfig[] = PRADOSHA_FIXTURE.observances.map((row) => ({
  observanceSlug: row.observance_slug,
  canonicalName: row.canonical_name,
  ruleId: `devam-combined-evidence-${row.observance_slug}-unique-pradosha-overlap-v1`,
  allowedTraditionCodes: PRADOSHA_FIXTURE.scope.supported_tradition_codes,
  candidateCivilDates: row.candidate_civil_dates,
  targetTithi: { index: row.paksha === "krishna" ? 28 : 13, name: "Trayodashi", paksha: row.paksha },
  decisionWindowKind: "pradosha",
  precedenceKind: "unique_trayodashi_overlap_with_bounded_pradosha_window_otherwise_fail_closed",
  precedenceExplanation: "Trayodashi uniquely overlaps the local sunset-to-144-minute pradosha window. Delhi is the pinned comparison fixture; the window is recalculated for the requested place, and ambiguous pairs remain unassigned.",
  selectionMode: "unique_pradosha_overlap",
  evidencePages: [37, 38, 48],
  evidenceStatus: "historical_general_naktavrata_context_plus_current_practitioner_rule_and_location_fixture",
  sourceScopeNote: "Nirnayasindhu does not prove the fortnightly observance-specific selection rule here; it is retained only for the general naktavrata pradosha interval and conflict context.",
  modernReference: {
    provider: "Drik Panchang",
    url: "https://www.drikpanchang.com/vrats/pradoshdates.html?geoname-id=1273294&year=2026",
    referenceLocation: "Delhi, India",
    observedCivilDate: row.reference_selected_civil_date,
    observationRole: "current_practitioner_rule_and_location_specific_date_fixture",
    semanticFixtureSha256: PRADOSHA_FIXTURE_SHA256,
    responseBytes: 126821,
    responseSha256: "94ab318ba1acfb84daa160fb161062420985fc07919c7a76de61b7ad439a9ac1",
  },
}));

const MASIKA_DURGASHTAMI_RULES: RuleConfig[] = MASIKA_DURGASHTAMI_FIXTURE.observances.map((row) => ({
  observanceSlug: row.observance_slug,
  canonicalName: row.canonical_name,
  ruleId: `devam-combined-evidence-${row.observance_slug}-shukla-ashtami-sunrise-later-day-v1`,
  allowedTraditionCodes: MASIKA_DURGASHTAMI_FIXTURE.scope.supported_tradition_codes,
  candidateCivilDates: row.candidate_civil_dates,
  targetTithi: { index: 8, name: "Ashtami", paksha: "shukla" },
  decisionWindowKind: "sunrise_presence",
  precedenceKind: "shukla_ashtami_at_sunrise_later_day",
  precedenceExplanation: "For this bounded monthly Durga Ashtami date lane, select the later candidate sunrise bearing Shukla Ashtami. The fixed source separately preserves the Shiva-Shakti festival context; fasting, worship, Mahashtami equivalence, and regional procedures remain unresolved.",
  selectionMode: "greater_overlap_later_tie",
  evidencePages: [51, 52],
  sourceScopeNote: "The fixed historical pages provide the general Shukla Ashtami later-day rule and Shiva-Shakti festival context. The current practitioner calendar supplies the monthly observance identity and Delhi 2026 date fixtures, not a complete procedure.",
  modernReference: {
    provider: "Drik Panchang",
    url: MASIKA_DURGASHTAMI_FIXTURE.sources[1].url!,
    referenceLocation: MASIKA_DURGASHTAMI_FIXTURE.scope.reference_location,
    observedCivilDate: row.reference_selected_civil_date,
    observationRole: "location_specific_date_fixture_not_rule_authority",
    semanticFixtureSha256: MASIKA_DURGASHTAMI_FIXTURE_SHA256,
    responseBytes: MASIKA_DURGASHTAMI_FIXTURE.sources[1].response_bytes,
    responseSha256: MASIKA_DURGASHTAMI_FIXTURE.sources[1].response_sha256,
  },
}));

const RULES: RuleConfig[] = [
  ...PRADOSHA_RULES,
  ...MASIKA_DURGASHTAMI_RULES,
  {
    observanceSlug: "hala-shashthi-hal-chhath",
    canonicalName: "Hala Shashthi / Hal Chhath",
    ruleId: "devam-delhi-practitioner-calendar-hala-shashthi-2026-v1",
    allowedTraditionCodes: halaShashthiEvidence.supportedTraditions,
    candidateCivilDates: halaShashthiEvidence.candidateCivilDates,
    requiredReferenceCoordinates: { latitude: 28.6139, longitude: 77.209, timezone: "Asia/Kolkata" },
    targetTithi: { index: 21, name: "Shashthi", paksha: "krishna" },
    decisionWindowKind: "sunrise_presence",
    precedenceKind: "exact_delhi_2026_practitioner_calendar_fixture",
    precedenceExplanation: "Assign 2 September only for the bounded Delhi 2026 Hala Shashthi lane. The 16 September attribution is rejected, and official ISKCON Balarama Purnima on 28 August remains separate.",
    selectionMode: "official_calendar_first_candidate",
    evidencePages: [],
    primaryEvidence: { work: "Hala Shashthi Delhi 2026 identity and date fixture", edition: "retained three-candidate comparison and practitioner observation", internetArchiveIdentifier: null, citationArtifactSha256: halaShashthiEvidence.semanticFixtureSha256, rightsLane: "reference_only" },
    evidenceStatus: "current_practitioner_rule_and_location_fixture_plus_historical_adjacent_context",
    sourceScopeNote: halaShashthiEvidence.sourceScopeNote,
    modernReference: halaShashthiEvidence.modernReference,
  },
  {
    observanceSlug: "vivaha-panchami",
    canonicalName: "Vivaha Panchami",
    ruleId: "devam-current-practitioner-vivaha-panchami-unique-sunrise-2026-v1",
    allowedTraditionCodes: vivahaPanchamiEvidence.supportedTraditions,
    candidateCivilDates: vivahaPanchamiEvidence.candidateCivilDates,
    targetTithi: { index: 5, name: "Panchami", paksha: "shukla" },
    decisionWindowKind: "sunrise_presence",
    precedenceKind: "unique_margashirsha_shukla_panchami_at_local_sunrise_otherwise_fail_closed",
    precedenceExplanation: "For this bounded North India lane, select only when exactly one candidate sunrise bears Margashirsha Shukla Panchami. The Delhi fixture is recalculated at the requested coordinates; ambiguity fails closed and no public-festival procedure is inferred.",
    selectionMode: "unique_sunrise_presence",
    evidencePages: [],
    primaryEvidence: { work: "Vivaha Panchami Delhi, Orchha, and Ayodhya evidence fixture", edition: "fresh practitioner and Government of India observations, 2026", internetArchiveIdentifier: null, citationArtifactSha256: vivahaPanchamiEvidence.semanticFixtureSha256, rightsLane: "reference_only" },
    evidenceStatus: "current_practitioner_rule_and_official_regional_identity_fixture",
    sourceScopeNote: vivahaPanchamiEvidence.sourceScopeNote,
    modernReference: vivahaPanchamiEvidence.modernReference,
  },
  {
    observanceSlug: "kalabhairava-jayanti",
    canonicalName: "Kalabhairava Jayanti / Bhairava Ashtami",
    ruleId: "devam-current-practitioner-kalabhairava-unique-night-one-ghati-2026-v1",
    allowedTraditionCodes: kalabhairavaEvidence.supportedTraditions,
    candidateCivilDates: kalabhairavaEvidence.candidateCivilDates,
    targetTithi: { index: 23, name: "Ashtami", paksha: "krishna" },
    decisionWindowKind: "night",
    precedenceKind: "unique_candidate_night_with_at_least_one_ghati_krishna_ashtami_overlap_otherwise_fail_closed",
    precedenceExplanation: "For this bounded Kalabhairava Jayanti lane, select only when exactly one candidate night from local sunset to the following sunrise contains at least one ghati (24 minutes) of Krishna Ashtami. This implements the published practitioner rule while preserving North Margashirsha and South Kartika month names; ambiguity fails closed.",
    selectionMode: "unique_night_minimum_one_ghati_overlap",
    evidencePages: [],
    primaryEvidence: { work: "Drik Panchang Masik Kalashtami 2026", edition: "fresh Delhi live observation, 2026", internetArchiveIdentifier: null, citationArtifactSha256: kalabhairavaEvidence.semanticFixtureSha256, rightsLane: "reference_only" },
    evidenceStatus: "current_practitioner_rule_and_official_regional_identity_fixture",
    sourceScopeNote: kalabhairavaEvidence.sourceScopeNote,
    modernReference: kalabhairavaEvidence.modernReference,
  },
  {
    observanceSlug: "krishna-janmashtami-smarta",
    canonicalName: "Krishna Janmashtami · Smarta",
    ruleId: "devam-combined-evidence-krishna-janmashtami-smarta-unique-nishita-2026-v1",
    allowedTraditionCodes: ["smarta-north-india", "smarta-west-india"],
    candidateCivilDates: KRISHNA_JANMASHTAMI_FIXTURE.scope.candidate_civil_dates,
    targetTithi: { index: 23, name: "Ashtami", paksha: "krishna" },
    targetNakshatra: { index: 4, name: "Rohini" },
    decisionWindowKind: "nishita",
    precedenceKind: "unique_krishna_ashtami_overlap_with_local_nishita_smarta_lane_otherwise_fail_closed",
    precedenceExplanation: "For this bounded Smarta lane, select only the civil night on which Krishna Ashtami uniquely overlaps local Nishita. Preserve Rohini overlap separately as decision evidence; do not use the shared 2026 civil date to equate Smarta and ISKCON rules.",
    selectionMode: "unique_nishita_overlap",
    evidencePages: [140, 141, 142, 143, 144, 145, 146, 147, 148, 149],
    sourceScopeNote: "The fixed historical pages preserve separate Janmashtami and Jayanti, Ashtami, Rohini, Nishita, and parana discussions. The current Smarta page supplies the bounded Delhi 2026 identity/rule fixture. Neither lane supplies a product ritual procedure.",
    modernReference: {
      provider: "Drik Panchang",
      url: KRISHNA_JANMASHTAMI_FIXTURE.sources[1].url!,
      referenceLocation: KRISHNA_JANMASHTAMI_FIXTURE.scope.reference_location,
      observedCivilDate: KRISHNA_JANMASHTAMI_FIXTURE.modern_observation.smarta_selected_civil_date,
      observationRole: "current_practitioner_rule_and_location_specific_date_fixture",
      semanticFixtureSha256: KRISHNA_JANMASHTAMI_FIXTURE_SHA256,
      responseBytes: KRISHNA_JANMASHTAMI_FIXTURE.sources[1].response_bytes,
      responseSha256: KRISHNA_JANMASHTAMI_FIXTURE.sources[1].response_sha256,
    },
  },
  {
    observanceSlug: "krishna-janmashtami-iskcon",
    canonicalName: "Krishna Janmashtami · ISKCON",
    ruleId: "devam-combined-evidence-krishna-janmashtami-iskcon-unique-nishita-2026-v1",
    allowedTraditionCodes: ["vaishnava-iskcon"],
    candidateCivilDates: KRISHNA_JANMASHTAMI_FIXTURE.scope.candidate_civil_dates,
    targetTithi: { index: 23, name: "Ashtami", paksha: "krishna" },
    targetNakshatra: { index: 4, name: "Rohini" },
    decisionWindowKind: "nishita",
    precedenceKind: "unique_krishna_ashtami_overlap_with_local_nishita_iskcon_lane_otherwise_fail_closed",
    precedenceExplanation: "For this bounded ISKCON lane, select only the civil night on which Krishna Ashtami uniquely overlaps local Nishita. Preserve Rohini overlap separately as decision evidence; do not use the shared 2026 civil date to equate ISKCON with every Vaishnava or Smarta rule.",
    selectionMode: "unique_nishita_overlap",
    evidencePages: [140, 141, 142, 143, 144, 145, 146, 147, 148, 149],
    sourceScopeNote: "The fixed historical pages preserve separate Janmashtami and Jayanti, Ashtami, Rohini, Nishita, and parana discussions. The current ISKCON page supplies the bounded Delhi 2026 identity/rule fixture. This is not an all-Vaishnava equivalence or a product ritual procedure.",
    modernReference: {
      provider: "Drik Panchang",
      url: KRISHNA_JANMASHTAMI_FIXTURE.sources[2].url!,
      referenceLocation: KRISHNA_JANMASHTAMI_FIXTURE.scope.reference_location,
      observedCivilDate: KRISHNA_JANMASHTAMI_FIXTURE.modern_observation.iskcon_selected_civil_date,
      observationRole: "current_practitioner_rule_and_location_specific_date_fixture",
      semanticFixtureSha256: KRISHNA_JANMASHTAMI_FIXTURE_SHA256,
      responseBytes: KRISHNA_JANMASHTAMI_FIXTURE.sources[2].response_bytes,
      responseSha256: KRISHNA_JANMASHTAMI_FIXTURE.sources[2].response_sha256,
    },
  },
  {
    observanceSlug: "hartalika-teej",
    canonicalName: "Hartalika Teej",
    ruleId: "devam-combined-evidence-bhadrapada-shukla-tritiya-sunrise-later-day-2026-v1",
    allowedTraditionCodes: HARTALIKA_TEEJ_FIXTURE.scope.supported_tradition_codes,
    candidateCivilDates: HARTALIKA_TEEJ_FIXTURE.scope.candidate_civil_dates,
    targetTithi: { index: 3, name: "Tritiya", paksha: "shukla" },
    decisionWindowKind: "sunrise_presence",
    precedenceKind: "bhadrapada_shukla_tritiya_at_sunrise_later_day",
    precedenceExplanation: "For this bounded Hartalika date lane, select the later candidate sunrise bearing Bhadrapada Shukla Tritiya, even when Tritiya remains only briefly after sunrise. Fasting, puja, outcome claims, and regional Gowri Habba procedures remain unresolved.",
    selectionMode: "greater_overlap_later_tie",
    evidencePages: [150],
    sourceScopeNote: "The fixed historical page supplies the Bhadrapada Shukla Tritiya later-day boundary. The current practitioner source supplies the Delhi 2026 identity and date fixture, not a complete ritual procedure or universal regional equivalence.",
    modernReference: {
      provider: "Drik Panchang",
      url: HARTALIKA_TEEJ_FIXTURE.sources[1].url!,
      referenceLocation: HARTALIKA_TEEJ_FIXTURE.scope.reference_location,
      observedCivilDate: HARTALIKA_TEEJ_FIXTURE.modern_observation.selected_civil_date,
      observationRole: "location_specific_date_fixture_not_rule_authority",
      semanticFixtureSha256: HARTALIKA_TEEJ_FIXTURE_SHA256,
      responseBytes: HARTALIKA_TEEJ_FIXTURE.sources[1].response_bytes,
      responseSha256: HARTALIKA_TEEJ_FIXTURE.sources[1].response_sha256,
    },
  },
  {
    observanceSlug: "rishi-panchami",
    canonicalName: "Rishi Panchami",
    ruleId: "devam-combined-evidence-bhadrapada-shukla-panchami-unique-madhyahna-2026-v1",
    allowedTraditionCodes: RISHI_PANCHAMI_FIXTURE.scope.supported_tradition_codes,
    candidateCivilDates: RISHI_PANCHAMI_FIXTURE.scope.candidate_civil_dates,
    targetTithi: { index: 5, name: "Panchami", paksha: "shukla" },
    decisionWindowKind: "madhyahna",
    precedenceKind: "unique_bhadrapada_shukla_panchami_overlap_with_local_madhyahna_otherwise_fail_closed",
    precedenceExplanation: "For this bounded Rishi Panchami date lane, select the date only when exactly one candidate madhyahna overlaps Bhadrapada Shukla Panchami. If both qualify, the fixed source's competing earlier/later opinions remain unresolved and the rule fails closed.",
    selectionMode: "unique_madhyahna_overlap",
    evidencePages: [151],
    sourceScopeNote: "The fixed historical page supplies the madhyahna requirement and preserves conflicting two-day precedence. The current practitioner source supplies the Delhi 2026 identity and date fixture, not a fasting, puja, purity, or universal regional procedure.",
    modernReference: {
      provider: "Drik Panchang",
      url: RISHI_PANCHAMI_FIXTURE.sources[1].url!,
      referenceLocation: RISHI_PANCHAMI_FIXTURE.scope.reference_location,
      observedCivilDate: RISHI_PANCHAMI_FIXTURE.modern_observation.selected_civil_date,
      observationRole: "location_specific_date_fixture_not_rule_authority",
      semanticFixtureSha256: RISHI_PANCHAMI_FIXTURE_SHA256,
      responseBytes: RISHI_PANCHAMI_FIXTURE.sources[1].response_bytes,
      responseSha256: RISHI_PANCHAMI_FIXTURE.sources[1].response_sha256,
    },
  },
  {
    observanceSlug: "radha-ashtami-iskcon",
    canonicalName: "Radha Ashtami",
    ruleId: "devam-combined-evidence-radha-ashtami-iskcon-greater-madhyahna-overlap-2026-v1",
    allowedTraditionCodes: RADHA_ASHTAMI_FIXTURE.scope.supported_tradition_codes,
    candidateCivilDates: RADHA_ASHTAMI_FIXTURE.scope.candidate_civil_dates,
    targetTithi: { index: 8, name: "Ashtami", paksha: "shukla" },
    decisionWindowKind: "madhyahna",
    precedenceKind: "greater_bhadrapada_shukla_ashtami_overlap_during_local_madhyahna_later_tie",
    precedenceExplanation: "For this bounded ISKCON Panchang lane, select the candidate with greater Bhadrapada Shukla Ashtami overlap during local madhyahna, preferring the later day on an exact tie. This is not an all-Vaishnava or Smarta calendar claim.",
    selectionMode: "greater_overlap_later_tie",
    evidencePages: [51, 52],
    evidenceStatus: "historical_general_tithi_context_plus_current_practitioner_rule_and_location_fixture",
    sourceScopeNote: "The fixed pages provide general Shukla Ashtami later-day context only; they do not identify Radha Ashtami or its madhyahna rule. The current ISKCON Panchang lane supplies the observance identity, madhyahna rule, and Delhi 2026 date fixture without a ritual procedure.",
    modernReference: {
      provider: "Drik Panchang",
      url: RADHA_ASHTAMI_FIXTURE.sources[1].url!,
      referenceLocation: RADHA_ASHTAMI_FIXTURE.scope.reference_location,
      observedCivilDate: RADHA_ASHTAMI_FIXTURE.modern_observation.selected_civil_date,
      observationRole: "current_practitioner_rule_and_location_specific_date_fixture",
      semanticFixtureSha256: RADHA_ASHTAMI_FIXTURE_SHA256,
      responseBytes: RADHA_ASHTAMI_FIXTURE.sources[1].response_bytes,
      responseSha256: RADHA_ASHTAMI_FIXTURE.sources[1].response_sha256,
    },
  },
  {
    observanceSlug: "sankashti-chaturthi-2026-09",
    canonicalName: "Sankashti Chaturthi",
    ruleId: "nirnayasindhu-1865-bhadrapada-krishna-chaturthi-moonrise-2026-09-v1",
    allowedTraditionCodes: sankashtiChaturthiEvidence.supportedTraditions,
    candidateCivilDates: sankashtiChaturthiEvidence.candidateCivilDates("sankashti-chaturthi-2026-09"),
    targetTithi: { index: 19, name: "Chaturthi", paksha: "krishna" },
    decisionWindowKind: "moonrise_presence",
    precedenceKind: "sankashti_chaturthi_at_moonrise_tie_unresolved_neither_later",
    precedenceExplanation: "Select the day with Krishna Chaturthi at moonrise. If both moonrises qualify, the fixed source records competing earlier/later opinions and this engine fails closed; if neither qualifies, it selects the later day.",
    selectionMode: "sankashti_moonrise",
    evidencePages: [50],
    primaryEvidence: { work: "Sankashti Chaturthi September-December 2026 historical rule and current Delhi/Mumbai observations", edition: "Fixed Nirnayasindhu carrier and fresh practitioner, official-temple, and official-tourism pages frozen in the Devam semantic fixture", internetArchiveIdentifier: null, citationArtifactSha256: sankashtiChaturthiEvidence.semanticFixtureSha256, rightsLane: "reference_only" },
    sourceScopeNote: sankashtiChaturthiEvidence.sourceScopeNote,
    modernReference: sankashtiChaturthiEvidence.modernReference("sankashti-chaturthi-2026-09"),
  },
  {
    observanceSlug: "sankashti-chaturthi-2026-10",
    canonicalName: "Sankashti Chaturthi",
    ruleId: "nirnayasindhu-1865-ashvina-krishna-chaturthi-moonrise-2026-10-v1",
    allowedTraditionCodes: sankashtiChaturthiEvidence.supportedTraditions,
    candidateCivilDates: sankashtiChaturthiEvidence.candidateCivilDates("sankashti-chaturthi-2026-10"),
    targetTithi: { index: 19, name: "Chaturthi", paksha: "krishna" },
    decisionWindowKind: "moonrise_presence",
    precedenceKind: "sankashti_chaturthi_at_moonrise_tie_unresolved_neither_later",
    precedenceExplanation: "Select the day with Krishna Chaturthi at moonrise. If both moonrises qualify, the fixed source records competing earlier/later opinions and this engine fails closed; if neither qualifies, it selects the later day.",
    selectionMode: "sankashti_moonrise",
    evidencePages: [50],
    primaryEvidence: { work: "Sankashti Chaturthi September-December 2026 historical rule and current Delhi/Mumbai observations", edition: "Fixed Nirnayasindhu carrier and fresh practitioner, official-temple, and official-tourism pages frozen in the Devam semantic fixture", internetArchiveIdentifier: null, citationArtifactSha256: sankashtiChaturthiEvidence.semanticFixtureSha256, rightsLane: "reference_only" },
    sourceScopeNote: sankashtiChaturthiEvidence.sourceScopeNote,
    modernReference: sankashtiChaturthiEvidence.modernReference("sankashti-chaturthi-2026-10"),
  },
  {
    observanceSlug: "sankashti-chaturthi-2026-11",
    canonicalName: "Sankashti Chaturthi",
    ruleId: "nirnayasindhu-1865-kartika-krishna-chaturthi-moonrise-2026-11-v1",
    allowedTraditionCodes: sankashtiChaturthiEvidence.supportedTraditions,
    candidateCivilDates: sankashtiChaturthiEvidence.candidateCivilDates("sankashti-chaturthi-2026-11"),
    targetTithi: { index: 19, name: "Chaturthi", paksha: "krishna" },
    decisionWindowKind: "moonrise_presence",
    precedenceKind: "sankashti_chaturthi_at_moonrise_tie_unresolved_neither_later",
    precedenceExplanation: "Select the day with Krishna Chaturthi at moonrise. If both moonrises qualify, the fixed source records competing earlier/later opinions and this engine fails closed; if neither qualifies, it selects the later day.",
    selectionMode: "sankashti_moonrise",
    evidencePages: [50],
    primaryEvidence: { work: "Sankashti Chaturthi September-December 2026 historical rule and current Delhi/Mumbai observations", edition: "Fixed Nirnayasindhu carrier and fresh practitioner, official-temple, and official-tourism pages frozen in the Devam semantic fixture", internetArchiveIdentifier: null, citationArtifactSha256: sankashtiChaturthiEvidence.semanticFixtureSha256, rightsLane: "reference_only" },
    sourceScopeNote: sankashtiChaturthiEvidence.sourceScopeNote,
    modernReference: sankashtiChaturthiEvidence.modernReference("sankashti-chaturthi-2026-11"),
  },
  {
    observanceSlug: "sankashti-chaturthi-2026-12",
    canonicalName: "Sankashti Chaturthi",
    ruleId: "nirnayasindhu-1865-margashirsha-krishna-chaturthi-moonrise-2026-12-v1",
    allowedTraditionCodes: sankashtiChaturthiEvidence.supportedTraditions,
    candidateCivilDates: sankashtiChaturthiEvidence.candidateCivilDates("sankashti-chaturthi-2026-12"),
    targetTithi: { index: 19, name: "Chaturthi", paksha: "krishna" },
    decisionWindowKind: "moonrise_presence",
    precedenceKind: "sankashti_chaturthi_at_moonrise_tie_unresolved_neither_later",
    precedenceExplanation: "Select the day with Krishna Chaturthi at moonrise. If both moonrises qualify, the fixed source records competing earlier/later opinions and this engine fails closed; if neither qualifies, it selects the later day.",
    selectionMode: "sankashti_moonrise",
    evidencePages: [50],
    primaryEvidence: { work: "Sankashti Chaturthi September-December 2026 historical rule and current Delhi/Mumbai observations", edition: "Fixed Nirnayasindhu carrier and fresh practitioner, official-temple, and official-tourism pages frozen in the Devam semantic fixture", internetArchiveIdentifier: null, citationArtifactSha256: sankashtiChaturthiEvidence.semanticFixtureSha256, rightsLane: "reference_only" },
    sourceScopeNote: sankashtiChaturthiEvidence.sourceScopeNote,
    modernReference: sankashtiChaturthiEvidence.modernReference("sankashti-chaturthi-2026-12"),
  },
  {
    observanceSlug: "bhadrapada-purnima",
    canonicalName: "Bhadrapada Purnima",
    ruleId: "nirnayasindhu-1865-bhadrapada-purnima-sunrise-later-tie-2026-v1",
    allowedTraditionCodes: ["smarta-north-india", "smarta-west-india"],
    candidateCivilDates: ["2026-09-25", "2026-09-26"],
    targetTithi: { index: 15, name: "Purnima", paksha: "shukla" },
    decisionWindowKind: "sunrise_presence",
    precedenceKind: "purnima_not_chaturdashi_viddha_later_day",
    precedenceExplanation: "For this bounded named Purnima calendar-day lane, avoid a Chaturdashi-contaminated first day and prefer the later qualifying sunrise. Purnima Vrat/upavasa is a separate lane and is not assigned by this rule.",
    selectionMode: "greater_overlap_later_tie",
    evidencePages: [66],
    modernReference: { provider: "Drik Panchang", url: PURNIMA_REFERENCE_URL, referenceLocation: "Delhi, India", observedCivilDate: "2026-09-26", observationRole: "location_specific_date_fixture_not_rule_authority" },
  },
  {
    observanceSlug: "ashwina-purnima",
    canonicalName: "Ashwina Purnima",
    ruleId: "nirnayasindhu-1865-ashwina-purnima-sunrise-later-tie-2026-v1",
    allowedTraditionCodes: ["smarta-north-india", "smarta-west-india"],
    candidateCivilDates: ["2026-10-25", "2026-10-26"],
    targetTithi: { index: 15, name: "Purnima", paksha: "shukla" },
    decisionWindowKind: "sunrise_presence",
    precedenceKind: "purnima_not_chaturdashi_viddha_later_day",
    precedenceExplanation: "For this bounded named Purnima calendar-day lane, avoid a Chaturdashi-contaminated first day and prefer the later qualifying sunrise. The October 25 Purnima Vrat and Kojagari practice lanes remain separate.",
    selectionMode: "greater_overlap_later_tie",
    evidencePages: [66, 208, 209],
    modernReference: { provider: "Drik Panchang", url: PURNIMA_REFERENCE_URL, referenceLocation: "Delhi, India", observedCivilDate: "2026-10-26", observationRole: "location_specific_date_fixture_not_rule_authority" },
  },
  {
    observanceSlug: "kojagara-puja-sharad-purnima",
    canonicalName: "Kojagara Puja / Sharad Purnima",
    ruleId: "devam-combined-evidence-ashvina-purnima-at-nishita-2026-v1",
    allowedTraditionCodes: KOJAGARA_FIXTURE.scope.supported_tradition_codes,
    candidateCivilDates: KOJAGARA_FIXTURE.scope.candidate_civil_dates,
    targetTithi: { index: 15, name: "Purnima", paksha: "shukla" },
    decisionWindowKind: "nishita",
    precedenceKind: "unique_purnima_overlap_with_local_nishita_otherwise_fail_closed",
    precedenceExplanation: "Select only the civil night on which Ashvina Purnima overlaps the local Nishita muhurta. This Kojagara/Sharad Purnima night lane remains distinct from the later sunrise-based Ashwina Purnima calendar-day lane; ambiguous pairs remain unassigned.",
    selectionMode: "unique_nishita_overlap",
    evidencePages: [208, 209],
    sourceScopeNote: "The fixed historical pages establish an Ashvina Purnima night-vigil context. The current practitioner source supplies the Nishita-bearing selection rule and the Delhi 2026 fixture; neither source proves a complete modern puja procedure or universal regional practice.",
    modernReference: {
      provider: "Drik Panchang",
      url: KOJAGARA_FIXTURE.sources[1].url!,
      referenceLocation: KOJAGARA_FIXTURE.scope.reference_location,
      observedCivilDate: KOJAGARA_FIXTURE.modern_observation.selected_civil_date,
      observationRole: "current_practitioner_rule_and_location_specific_date_fixture",
      semanticFixtureSha256: KOJAGARA_FIXTURE_SHA256,
      responseBytes: KOJAGARA_FIXTURE.sources[1].response_bytes,
      responseSha256: KOJAGARA_FIXTURE.sources[1].response_sha256,
    },
  },
  {
    observanceSlug: "kartika-purnima",
    canonicalName: "Kartika Purnima",
    ruleId: "nirnayasindhu-1865-kartika-purnima-sunrise-later-tie-2026-v1",
    allowedTraditionCodes: ["smarta-north-india", "smarta-west-india", "regional-kashi-varanasi"],
    candidateCivilDates: ["2026-11-23", "2026-11-24"],
    targetTithi: { index: 15, name: "Purnima", paksha: "shukla" },
    decisionWindowKind: "sunrise_presence",
    precedenceKind: "purnima_not_chaturdashi_viddha_later_day",
    precedenceExplanation: "For this bounded named Purnima calendar-day lane, avoid a Chaturdashi-contaminated first day and prefer the later qualifying sunrise. Kartika-specific bathing, vrata, and temple practices remain unresolved.",
    selectionMode: "greater_overlap_later_tie",
    evidencePages: [66],
    modernReference: { provider: "Drik Panchang", url: PURNIMA_REFERENCE_URL, referenceLocation: "Delhi, India", observedCivilDate: "2026-11-24", observationRole: "location_specific_date_fixture_not_rule_authority" },
  },
  {
    observanceSlug: "bhadrapada-amavasya",
    canonicalName: "Bhadrapada Amavasya",
    ruleId: "nirnayasindhu-1865-bhadrapada-amavasya-sunrise-later-tie-2026-v1",
    allowedTraditionCodes: ["smarta-north-india", "smarta-west-india"],
    candidateCivilDates: ["2026-09-10", "2026-09-11"],
    targetTithi: { index: 30, name: "Amavasya", paksha: "krishna" },
    decisionWindowKind: "sunrise_presence",
    precedenceKind: "amavasya_not_chaturdashi_viddha_later_day",
    precedenceExplanation: "For this bounded named lunar-month Amavasya lane, avoid a Chaturdashi-contaminated first day and prefer the later qualifying sunrise. Darsha and shraddha applicability are separate lanes.",
    selectionMode: "greater_overlap_later_tie",
    evidencePages: [66],
    modernReference: { provider: "Drik Panchang", url: AMAVASYA_REFERENCE_URL, referenceLocation: "Delhi, India", observedCivilDate: "2026-09-11", observationRole: "location_specific_date_fixture_not_rule_authority" },
  },
  {
    observanceSlug: "ashwina-amavasya",
    canonicalName: "Ashwina Amavasya",
    ruleId: "nirnayasindhu-1865-ashwina-amavasya-sunrise-later-tie-2026-v1",
    allowedTraditionCodes: ["smarta-north-india", "smarta-west-india"],
    candidateCivilDates: ["2026-10-09", "2026-10-10"],
    targetTithi: { index: 30, name: "Amavasya", paksha: "krishna" },
    decisionWindowKind: "sunrise_presence",
    precedenceKind: "amavasya_not_chaturdashi_viddha_later_day",
    precedenceExplanation: "For this bounded named lunar-month Amavasya lane, avoid a Chaturdashi-contaminated first day and prefer the later qualifying sunrise. Sarva Pitru Amavasya and shraddha procedure remain separate regional/applicability lanes.",
    selectionMode: "greater_overlap_later_tie",
    evidencePages: [66],
    modernReference: { provider: "Drik Panchang", url: AMAVASYA_REFERENCE_URL, referenceLocation: "Delhi, India", observedCivilDate: "2026-10-10", observationRole: "location_specific_date_fixture_not_rule_authority" },
  },
  {
    observanceSlug: "kartika-amavasya",
    canonicalName: "Kartika Amavasya",
    ruleId: "nirnayasindhu-1865-kartika-amavasya-sunrise-later-tie-2026-v1",
    allowedTraditionCodes: ["smarta-north-india", "smarta-west-india"],
    candidateCivilDates: ["2026-11-08", "2026-11-09"],
    targetTithi: { index: 30, name: "Amavasya", paksha: "krishna" },
    decisionWindowKind: "sunrise_presence",
    precedenceKind: "amavasya_not_chaturdashi_viddha_later_day",
    precedenceExplanation: "For this bounded named lunar-month Amavasya lane, avoid a Chaturdashi-contaminated first day and prefer the later qualifying sunrise. Diwali Lakshmi Puja remains a separate pradosha rule on the prior evening.",
    selectionMode: "greater_overlap_later_tie",
    evidencePages: [66],
    modernReference: { provider: "Drik Panchang", url: AMAVASYA_REFERENCE_URL, referenceLocation: "Delhi, India", observedCivilDate: "2026-11-09", observationRole: "location_specific_date_fixture_not_rule_authority" },
  },
  {
    observanceSlug: "margashirsha-amavasya",
    canonicalName: "Margashirsha Amavasya",
    ruleId: "nirnayasindhu-1865-margashirsha-amavasya-sunrise-later-tie-2026-v1",
    allowedTraditionCodes: ["smarta-north-india", "smarta-west-india"],
    candidateCivilDates: ["2026-12-07", "2026-12-08"],
    targetTithi: { index: 30, name: "Amavasya", paksha: "krishna" },
    decisionWindowKind: "sunrise_presence",
    precedenceKind: "amavasya_not_chaturdashi_viddha_later_day",
    precedenceExplanation: "For this bounded named lunar-month Amavasya lane, avoid a Chaturdashi-contaminated first day and prefer the later qualifying sunrise. Darsha and shraddha applicability are separate lanes.",
    selectionMode: "greater_overlap_later_tie",
    evidencePages: [66],
    modernReference: { provider: "Drik Panchang", url: AMAVASYA_REFERENCE_URL, referenceLocation: "Delhi, India", observedCivilDate: "2026-12-08", observationRole: "location_specific_date_fixture_not_rule_authority" },
  },
  {
    observanceSlug: "masika-shivaratri-2026-09",
    canonicalName: "Masika Shivaratri",
    ruleId: "nirnayasindhu-1865-bhadrapada-krishna-chaturdashi-pradosha-nishita-2026-09-v1",
    allowedTraditionCodes: ["smarta-north-india", "smarta-west-india"],
    candidateCivilDates: ["2026-09-08", "2026-09-09"],
    targetTithi: { index: 29, name: "Chaturdashi", paksha: "krishna" },
    decisionWindowKind: "nishita",
    precedenceKind: "masika_shivaratri_pradosha_nishita_matrix_fail_closed",
    precedenceExplanation: "For this bounded monthly Krishna Chaturdashi lane, evaluate both pradosha and the two-ghati nishita interval. A unique nishita-bearing night prevails; when both candidates bear nishita, a uniquely qualifying pradosha resolves the pair after full-versus-partial nishita is considered. Unproved ties fail closed.",
    selectionMode: "masika_shivaratri_pradosha_nishita",
    evidencePages: [239, 240, 241, 242],
    modernReference: { provider: "Drik Panchang", url: MASIKA_SHIVARATRI_REFERENCE_URL, referenceLocation: "Delhi, India", observedCivilDate: "2026-09-09", observationRole: "location_specific_date_fixture_not_rule_authority", semanticFixtureSha256: MASIKA_SHIVARATRI_SEMANTIC_FIXTURE_SHA256 },
  },
  {
    observanceSlug: "masika-shivaratri-2026-10",
    canonicalName: "Masika Shivaratri",
    ruleId: "nirnayasindhu-1865-ashwina-krishna-chaturdashi-pradosha-nishita-2026-10-v1",
    allowedTraditionCodes: ["smarta-north-india", "smarta-west-india"],
    candidateCivilDates: ["2026-10-08", "2026-10-09"],
    targetTithi: { index: 29, name: "Chaturdashi", paksha: "krishna" },
    decisionWindowKind: "nishita",
    precedenceKind: "masika_shivaratri_pradosha_nishita_matrix_fail_closed",
    precedenceExplanation: "For this bounded monthly Krishna Chaturdashi lane, evaluate both pradosha and the two-ghati nishita interval. A unique nishita-bearing night prevails; when both candidates bear nishita, a uniquely qualifying pradosha resolves the pair after full-versus-partial nishita is considered. Unproved ties fail closed.",
    selectionMode: "masika_shivaratri_pradosha_nishita",
    evidencePages: [239, 240, 241, 242],
    modernReference: { provider: "Drik Panchang", url: MASIKA_SHIVARATRI_REFERENCE_URL, referenceLocation: "Delhi, India", observedCivilDate: "2026-10-08", observationRole: "location_specific_date_fixture_not_rule_authority", semanticFixtureSha256: MASIKA_SHIVARATRI_SEMANTIC_FIXTURE_SHA256 },
  },
  {
    observanceSlug: "masika-shivaratri-2026-11",
    canonicalName: "Masika Shivaratri",
    ruleId: "nirnayasindhu-1865-kartika-krishna-chaturdashi-pradosha-nishita-2026-11-v1",
    allowedTraditionCodes: ["smarta-north-india", "smarta-west-india"],
    candidateCivilDates: ["2026-11-07", "2026-11-08"],
    targetTithi: { index: 29, name: "Chaturdashi", paksha: "krishna" },
    decisionWindowKind: "nishita",
    precedenceKind: "masika_shivaratri_pradosha_nishita_matrix_fail_closed",
    precedenceExplanation: "For this bounded monthly Krishna Chaturdashi lane, evaluate both pradosha and the two-ghati nishita interval. A unique nishita-bearing night prevails; when both candidates bear nishita, a uniquely qualifying pradosha resolves the pair after full-versus-partial nishita is considered. Unproved ties fail closed.",
    selectionMode: "masika_shivaratri_pradosha_nishita",
    evidencePages: [239, 240, 241, 242],
    modernReference: { provider: "Drik Panchang", url: MASIKA_SHIVARATRI_REFERENCE_URL, referenceLocation: "Delhi, India", observedCivilDate: "2026-11-07", observationRole: "location_specific_date_fixture_not_rule_authority", semanticFixtureSha256: MASIKA_SHIVARATRI_SEMANTIC_FIXTURE_SHA256 },
  },
  {
    observanceSlug: "masika-shivaratri-2026-12",
    canonicalName: "Masika Shivaratri",
    ruleId: "nirnayasindhu-1865-margashirsha-krishna-chaturdashi-pradosha-nishita-2026-12-v1",
    allowedTraditionCodes: ["smarta-north-india", "smarta-west-india"],
    candidateCivilDates: ["2026-12-07", "2026-12-08"],
    targetTithi: { index: 29, name: "Chaturdashi", paksha: "krishna" },
    decisionWindowKind: "nishita",
    precedenceKind: "masika_shivaratri_pradosha_nishita_matrix_fail_closed",
    precedenceExplanation: "For this bounded monthly Krishna Chaturdashi lane, evaluate both pradosha and the two-ghati nishita interval. A unique nishita-bearing night prevails; when both candidates bear nishita, a uniquely qualifying pradosha resolves the pair after full-versus-partial nishita is considered. Unproved ties fail closed.",
    selectionMode: "masika_shivaratri_pradosha_nishita",
    evidencePages: [239, 240, 241, 242],
    modernReference: { provider: "Drik Panchang", url: MASIKA_SHIVARATRI_REFERENCE_URL, referenceLocation: "Delhi, India", observedCivilDate: "2026-12-07", observationRole: "location_specific_date_fixture_not_rule_authority", semanticFixtureSha256: MASIKA_SHIVARATRI_SEMANTIC_FIXTURE_SHA256 },
  },
  {
    observanceSlug: "ganesh-chaturthi",
    canonicalName: "Ganesh Chaturthi",
    ruleId: "nirnayasindhu-1865-bhadrapada-shukla-chaturthi-madhyahna-v1",
    allowedTraditionCodes: ["smarta-west-india"],
    candidateCivilDates: ["2026-09-14", "2026-09-15"],
    targetTithi: { index: 4, name: "Chaturthi", paksha: "shukla" },
    decisionWindowKind: "madhyahna",
    precedenceKind: "greater_madhyahna_tithi_coverage_otherwise_first_day",
    precedenceExplanation: "For this bounded Bhadrapada Shukla Ganesh-vrata case, select the second day only when Chaturthi occupies more of its madhyahna; otherwise select the first day.",
    evidencePages: [50, 51],
    modernReference: { provider: "Drik Panchang", url: "https://www.drikpanchang.com/festivals/ganesh-chaturthi/ganesh-chaturthi-date-time.html?geoname-id=1275339&year=2026", referenceLocation: "Mumbai, India", observedCivilDate: "2026-09-14", observationRole: "location_specific_date_fixture_not_rule_authority" },
  },
  {
    observanceSlug: "ananta-chaturdashi",
    canonicalName: "Ananta Chaturdashi",
    ruleId: "nirnayasindhu-1865-bhadrapada-shukla-chaturdashi-ananta-madhyahna-2026-v1",
    allowedTraditionCodes: ["smarta-north-india", "smarta-west-india"],
    candidateCivilDates: ["2026-09-25", "2026-09-26"],
    targetTithi: { index: 14, name: "Chaturdashi", paksha: "shukla" },
    decisionWindowKind: "madhyahna",
    precedenceKind: "greater_madhyahna_chaturdashi_coverage_earlier_tie",
    precedenceExplanation: "Shukla Chaturdashi has greater coverage of the local madhyahna window on this bounded Bhadrapada candidate day. Ananta-vrata and Ganesh Visarjan share the civil date but remain distinct ritual identities.",
    selectionMode: "greater_overlap_earlier_tie",
    evidencePages: [159],
    modernReference: {
      provider: "Drik Panchang",
      url: "https://www.drikpanchang.com/festivals/anant-chaturdashi/anant-chaturdashi-date-time.html?geoname-id=1275339&year=2026",
      referenceLocation: "Mumbai, India",
      observedCivilDate: "2026-09-25",
      observationRole: "location_specific_date_fixture_not_rule_authority",
      responseBytes: 69549,
      responseSha256: "2e438afe3667e8347b1ec58b585fa48fb72c77ba26e5caad4164a38653d4ac7e",
    },
  },
  {
    observanceSlug: "shardiya-navaratri-begins",
    canonicalName: "Shardiya Navaratri begins",
    ruleId: "nirnayasindhu-1865-ashvina-shukla-pratipada-sunrise-v1",
    allowedTraditionCodes: ["smarta-north-india", "smarta-west-india"],
    candidateCivilDates: ["2026-10-10", "2026-10-11"],
    targetTithi: { index: 1, name: "Pratipada", paksha: "shukla" },
    decisionWindowKind: "sunrise_presence",
    precedenceKind: "pratipada_present_at_sunrise_otherwise_greater_sunrise_overlap",
    precedenceExplanation: "Within this bounded 2026 pair, select the civil day on which Ashvina Shukla Pratipada is present at local sunrise.",
    evidencePages: [178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205],
    modernReference: { provider: "Drik Panchang", url: "https://www.drikpanchang.com/navratri/ashwin-shardiya-navratri-dates.html?geoname-id=1261481&year=2026", referenceLocation: "Delhi, India", observedCivilDate: "2026-10-11", observationRole: "location_specific_date_fixture_not_rule_authority" },
  },
  {
    observanceSlug: "karnataka-saraswati-ayudha-puja",
    canonicalName: "Karnataka Saraswati Puja / Ayudha Puja",
    ruleId: "devam-karnataka-mahanavami-ayudha-puja-official-2026-v1",
    allowedTraditionCodes: ["smarta-south-india"],
    candidateCivilDates: ["2026-10-19", "2026-10-20"],
    requiredReferenceCoordinates: { latitude: 12.9716, longitude: 77.5946, timezone: "Asia/Kolkata" },
    targetTithi: { index: 9, name: "Navami", paksha: "shukla" },
    decisionWindowKind: "sunrise_presence",
    precedenceKind: "official_karnataka_mahanavami_date_with_unique_local_sunrise_navami_overlap",
    precedenceExplanation: "For the exact Bengaluru/Karnataka 2026 context, require unique Shukla Navami overlap at local sunrise and corroborate the selected day against the official October 20 Mahanavami calendar. North/West Vijayadashami, Bengal Navami, and other South Indian Saraswati/Ayudha forms remain separate.",
    selectionMode: "unique_sunrise_presence",
    evidencePages: [],
    primaryEvidence: {
      work: "CGST Karnataka Holiday List 2026, NIC Karnataka Mahanavami/Ayudhapooja, Sringeri Sharada Navaratri, and Karnataka Tourism Gombe Habba",
      edition: "Live official pages frozen in the Devam semantic fixture",
      internetArchiveIdentifier: null,
      citationArtifactSha256: karnatakaSaraswatiAyudhaPujaEvidence.semanticFixtureSha256,
      rightsLane: "reference_only",
    },
    evidenceStatus: "official_regional_date_and_context_fixture",
    sourceScopeNote: karnatakaSaraswatiAyudhaPujaEvidence.sourceScopeNote,
    modernReference: karnatakaSaraswatiAyudhaPujaEvidence.modernReference,
  },
  {
    observanceSlug: "vijayadashami",
    canonicalName: "Vijayadashami",
    ruleId: "nirnayasindhu-1865-ashvina-shukla-dashami-aparahna-v1",
    allowedTraditionCodes: ["smarta-north-india", "smarta-west-india"],
    candidateCivilDates: ["2026-10-20", "2026-10-21"],
    targetTithi: { index: 10, name: "Dashami", paksha: "shukla" },
    decisionWindowKind: "aparahna",
    precedenceKind: "greater_aparahna_dashami_coverage_otherwise_first_day",
    precedenceExplanation: "Within this bounded general North/West India fixture, choose the day with greater Dashami coverage during aparahna. Bengal Vijayadashami is a separate unresolved regional lane.",
    evidencePages: [206, 207],
    modernReference: { provider: "Drik Panchang", url: "https://www.drikpanchang.com/festivals/vijayadashami/vijayadashami-date-time.html?geoname-id=1273294&year=2026", referenceLocation: "Delhi, India", observedCivilDate: "2026-10-20", observationRole: "location_specific_date_fixture_not_rule_authority" },
  },
  {
    observanceSlug: "karwa-chauth",
    canonicalName: "Karwa Chauth / Karaka Chaturthi",
    ruleId: "nirnayasindhu-1865-kartika-krishna-chaturthi-moonrise-v1",
    allowedTraditionCodes: karwaChauthEvidence.supportedTraditions,
    candidateCivilDates: karwaChauthEvidence.candidateCivilDates,
    targetTithi: { index: 19, name: "Chaturthi", paksha: "krishna" },
    decisionWindowKind: "moonrise_presence",
    precedenceKind: "chaturthi_present_at_moonrise_earlier_if_both",
    precedenceExplanation: "Within this bounded Karaka Chaturthi rule, select the civil day on which Krishna Chaturthi is present at local moonrise; if both candidate moonrises qualify, select the earlier day.",
    evidencePages: [213],
    primaryEvidence: { work: "Karwa Chauth 2026 historical rule, Delhi date, and North India living-practice observations", edition: "Fixed Nirnayasindhu carrier and fresh current pages frozen in the Devam semantic fixture", internetArchiveIdentifier: null, citationArtifactSha256: karwaChauthEvidence.semanticFixtureSha256, rightsLane: "reference_only" },
    evidenceStatus: "historical_rule_source_plus_location_specific_modern_date_fixture",
    sourceScopeNote: karwaChauthEvidence.sourceScopeNote,
    modernReference: karwaChauthEvidence.modernReference,
  },
  {
    observanceSlug: "ahoi-ashtami-north-india",
    canonicalName: "Ahoi Ashtami / Ahoi Aathe",
    ruleId: "devam-current-practitioner-ahoi-ashtami-unique-pradosha-ashtami-v1",
    allowedTraditionCodes: ahoiAshtamiEvidence.supportedTraditions,
    candidateCivilDates: ahoiAshtamiEvidence.candidateCivilDates,
    targetTithi: { index: 23, name: "Ashtami", paksha: "krishna" },
    decisionWindowKind: "pradosha",
    precedenceKind: "unique_kartika_krishna_ashtami_overlap_with_local_pradosha_fail_closed",
    precedenceExplanation: "For this bounded Delhi/North India lane, select only when exactly one candidate civil evening has Krishna Ashtami overlap with Devam's locally recalculated pradosha window. The practitioner fixture corroborates November 1, its Ahoi Mata and children's-wellbeing identity, and separate star- or moon-sighting family variants. This resolves the date only; it does not serve a puja muhurta, prescribe fasting, or universalize one family procedure.",
    selectionMode: "unique_pradosha_overlap",
    evidencePages: [],
    primaryEvidence: { work: "Ahoi Ashtami 2026 Delhi date and living-practice observations", edition: "Fresh current-practitioner pages frozen in the Devam semantic fixture", internetArchiveIdentifier: null, citationArtifactSha256: ahoiAshtamiEvidence.semanticFixtureSha256, rightsLane: "reference_only" },
    evidenceStatus: "current_practitioner_rule_and_location_fixture_plus_historical_adjacent_context",
    sourceScopeNote: ahoiAshtamiEvidence.sourceScopeNote,
    modernReference: ahoiAshtamiEvidence.modernReference,
  },
  {
    observanceSlug: "govatsa-dwadashi",
    canonicalName: "Govatsa Dwadashi / Vasu Baras",
    ruleId: "nirnayasindhu-1865-kartika-krishna-dwadashi-pradosha-v1",
    allowedTraditionCodes: ["smarta-north-india", "smarta-west-india"],
    candidateCivilDates: ["2026-11-04", "2026-11-05"],
    targetTithi: { index: 27, name: "Dvadashi", paksha: "krishna" },
    decisionWindowKind: "pradosha",
    precedenceKind: "dvadashi_present_at_pradosha_earlier_if_both",
    precedenceExplanation: "Within this bounded Kartika Krishna Dvadashi fixture, select the civil evening on which Dvadashi spans pradosha; if both candidate evenings qualify, select the earlier day. A separate Maharashtra no-contact family guide supports gratitude and responsible care; live-animal handling and other regional procedures remain outside this calendar rule.",
    evidencePages: [213],
    modernReference: { provider: "Drik Panchang", url: "https://www.drikpanchang.com/festivals/govatsa-dwadashi/govatsa-dwadashi-date-time.html?geoname-id=1261481&year=2026", referenceLocation: "Delhi, India", observedCivilDate: "2026-11-05", observationRole: "location_specific_date_fixture_not_rule_authority" },
  },
  {
    observanceSlug: "tulasi-vivah-dwadashi",
    canonicalName: "Tulasi Vivah",
    ruleId: "devam-current-practitioner-tulasi-vivah-unique-pradosha-dwadashi-v1",
    allowedTraditionCodes: tulasiVivahEvidence.general.supportedTraditions,
    candidateCivilDates: tulasiVivahEvidence.general.candidateCivilDates,
    targetTithi: { index: 12, name: "Dwadashi", paksha: "shukla" },
    decisionWindowKind: "pradosha",
    precedenceKind: "unique_kartika_shukla_dwadashi_overlap_with_local_pradosha_fail_closed",
    precedenceExplanation: "For this bounded Delhi/North-West India lane, select only when exactly one candidate civil evening has Shukla Dwadashi overlap with Devam's locally recalculated pradosha. Current sources corroborate November 21 and the Tulasi-Vishnu/Krishna divine-union identity. This resolves one date lane only; the BAPS November 21-24 sequence remains separate.",
    selectionMode: "unique_pradosha_overlap",
    evidencePages: [],
    primaryEvidence: { work: "Tulasi Vivah 2026 current date and identity observations", edition: "Fresh official and current-practitioner pages frozen in the Devam semantic fixture", internetArchiveIdentifier: null, citationArtifactSha256: tulasiVivahEvidence.semanticFixtureSha256, rightsLane: "reference_only" },
    evidenceStatus: "current_practitioner_rule_and_official_regional_calendar_plus_historical_adjacent_context",
    sourceScopeNote: tulasiVivahEvidence.general.sourceScopeNote,
    modernReference: tulasiVivahEvidence.general.modernReference,
  },
  {
    observanceSlug: "tulsi-vivah-baps-begins",
    canonicalName: "Tulsi Vivah Prarambh",
    ruleId: "devam-baps-calendar-tulsi-vivah-prarambh-2026-v1",
    allowedTraditionCodes: tulasiVivahEvidence.bapsBegins.supportedTraditions,
    candidateCivilDates: tulasiVivahEvidence.bapsBegins.candidateCivilDates,
    targetTithi: { index: 12, name: "Dwadashi", paksha: "shukla" },
    decisionWindowKind: "pradosha",
    precedenceKind: "official_baps_calendar_first_candidate",
    precedenceExplanation: "For this exact BAPS lane, use the official calendar's November 21 Tulsivivah Prarambh entry. Astronomical tithi diagnostics do not replace BAPS authority. The same calendar closes the sequence on November 24; neither boundary is a universal Hindu date or procedure.",
    selectionMode: "official_calendar_first_candidate",
    evidencePages: [],
    primaryEvidence: { work: "BAPS 2026 November calendar", edition: "Official BAPS current calendar page frozen in the Devam semantic fixture", internetArchiveIdentifier: null, citationArtifactSha256: tulasiVivahEvidence.semanticFixtureSha256, rightsLane: "reference_only" },
    evidenceStatus: "current_sampradaya_rule_and_official_public_context",
    sourceScopeNote: tulasiVivahEvidence.bapsSourceScopeNote,
    modernReference: tulasiVivahEvidence.bapsBegins.modernReference,
  },
  {
    observanceSlug: "tulsi-vivah-baps-samapt",
    canonicalName: "Tulsi Vivah Samapt",
    ruleId: "devam-baps-calendar-tulsi-vivah-samapt-2026-v1",
    allowedTraditionCodes: tulasiVivahEvidence.bapsEnds.supportedTraditions,
    candidateCivilDates: tulasiVivahEvidence.bapsEnds.candidateCivilDates,
    targetTithi: { index: 15, name: "Purnima", paksha: "shukla" },
    decisionWindowKind: "pradosha",
    precedenceKind: "official_baps_calendar_first_candidate",
    precedenceExplanation: "For this exact BAPS lane, use the official calendar's November 24 Tulsivivah Samapt entry. Astronomical tithi diagnostics do not replace BAPS authority. This closes only the BAPS sequence begun November 21 and does not define a universal Tulasi Vivah close.",
    selectionMode: "official_calendar_first_candidate",
    evidencePages: [],
    primaryEvidence: { work: "BAPS 2026 November calendar", edition: "Official BAPS current calendar page frozen in the Devam semantic fixture", internetArchiveIdentifier: null, citationArtifactSha256: tulasiVivahEvidence.semanticFixtureSha256, rightsLane: "reference_only" },
    evidenceStatus: "current_sampradaya_rule_and_official_public_context",
    sourceScopeNote: tulasiVivahEvidence.bapsSourceScopeNote,
    modernReference: { ...tulasiVivahEvidence.bapsBegins.modernReference, observedCivilDate: "2026-11-24" },
  },
  {
    observanceSlug: "dev-deepawali-varanasi",
    canonicalName: "Dev Deepawali, Varanasi",
    ruleId: "devam-current-practitioner-varanasi-dev-deepawali-unique-pradosha-purnima-v1",
    allowedTraditionCodes: devDeepawaliEvidence.supportedTraditions,
    candidateCivilDates: devDeepawaliEvidence.candidateCivilDates,
    targetTithi: { index: 15, name: "Purnima", paksha: "shukla" },
    decisionWindowKind: "pradosha",
    precedenceKind: "unique_kartika_purnima_overlap_with_local_pradosha_fail_closed",
    precedenceExplanation: "For this exact Kashi/Varanasi lane, select only when exactly one candidate civil evening has Purnima overlap with Devam's locally recalculated pradosha. Current practitioner evidence fixes November 24, while Ministry of Tourism sources establish the distinct illuminated-ghat public-festival identity. Generic Kartika Purnima and BAPS Dev Diwali remain separate records.",
    selectionMode: "unique_pradosha_overlap",
    evidencePages: [],
    primaryEvidence: { work: "Varanasi Dev Deepawali 2026 date, identity, and public-festival observations", edition: "Fresh current-practitioner and official tourism pages frozen in the Devam semantic fixture", internetArchiveIdentifier: null, citationArtifactSha256: devDeepawaliEvidence.semanticFixtureSha256, rightsLane: "reference_only" },
    evidenceStatus: "current_practitioner_rule_and_official_regional_calendar_plus_historical_adjacent_context",
    sourceScopeNote: devDeepawaliEvidence.sourceScopeNote,
    modernReference: devDeepawaliEvidence.modernReference,
  },
  {
    observanceSlug: "dhantrayodashi",
    canonicalName: "Dhantrayodashi / Dhanteras",
    ruleId: "devam-current-practitioner-dhantrayodashi-unique-pradosha-overlap-v1",
    allowedTraditionCodes: dhantrayodashiEvidence.supportedTraditionCodes,
    candidateCivilDates: dhantrayodashiEvidence.candidateCivilDates,
    targetTithi: { index: 28, name: "Trayodashi", paksha: "krishna" },
    decisionWindowKind: "pradosha",
    precedenceKind: "unique_pradosha_trayodashi_overlap_fail_closed",
    precedenceExplanation: "For this bounded 2026 North/West lane, validated against the New Delhi reference fixture, select only when exactly one candidate evening has Krishna Trayodashi overlap with Devam's pradosha window recalculated at the requested coordinates. This resolves the civil date, not the provider's narrower puja muhurta, which also requires Sthir/Vrishabha Lagna. Dhantrayodashi and Yama Deepam remain separate records.",
    selectionMode: "unique_pradosha_overlap",
    evidencePages: [213],
    evidenceStatus: "current_practitioner_rule_and_location_fixture_plus_historical_adjacent_context",
    sourceScopeNote: dhantrayodashiEvidence.sourceScopeNote,
    modernReference: dhantrayodashiEvidence.modernReference,
  },
  {
    observanceSlug: "yama-deepam",
    canonicalName: "Yama Deepam / Yama Deepa Dana",
    ruleId: "nirnayasindhu-1865-kartika-krishna-trayodashi-pradosha-v1",
    allowedTraditionCodes: ["smarta-north-india", "smarta-west-india"],
    candidateCivilDates: ["2026-11-05", "2026-11-06"],
    targetTithi: { index: 28, name: "Trayodashi", paksha: "krishna" },
    decisionWindowKind: "pradosha",
    precedenceKind: "greater_pradosha_trayodashi_coverage_otherwise_first_day",
    precedenceExplanation: "Within this bounded Kartika Krishna Trayodashi fixture, select the civil evening with greater Trayodashi coverage during pradosha. Yama Deepam is retained as a distinct observance and is not treated as proof of a complete Dhanteras ritual lane.",
    evidencePages: [213],
    modernReference: { provider: "Drik Panchang", url: "https://www.drikpanchang.com/diwali/yama-deepam/yama-deepam-date-time.html?geoname-id=1261481&year=2026", referenceLocation: "Delhi, India", observedCivilDate: "2026-11-06", observationRole: "location_specific_date_fixture_not_rule_authority" },
  },
  {
    observanceSlug: "naraka-chaturdashi",
    canonicalName: "Naraka Chaturdashi / Abhyanga Snan",
    ruleId: "devam-current-practitioner-maharashtra-naraka-moonrise-to-sunrise-v1",
    allowedTraditionCodes: narakaChaturdashiEvidence.supportedTraditionCodes,
    candidateCivilDates: narakaChaturdashiEvidence.candidateCivilDates,
    targetTithi: { index: 29, name: "Chaturdashi", paksha: "krishna" },
    decisionWindowKind: "moonrise_to_sunrise",
    precedenceKind: "unique_full_kartika_krishna_chaturdashi_overlap_with_local_moonrise_to_sunrise_fail_closed",
    precedenceExplanation: "For this bounded Maharashtra lane, validated against the Mumbai practitioner fixture, select only when exactly one candidate civil day's locally recalculated moonrise-to-sunrise window is fully covered by Krishna Chaturdashi. This resolves the date and regional decision window without copying the provider's precise muhurta or supplying an abhyanga procedure. Kali Chaudas and Tamil Deepavali remain separate records.",
    selectionMode: "unique_full_moonrise_to_sunrise_overlap",
    evidencePages: [214, 215],
    evidenceStatus: "current_practitioner_rule_and_location_fixture_plus_historical_adjacent_context",
    sourceScopeNote: narakaChaturdashiEvidence.sourceScopeNote,
    modernReference: narakaChaturdashiEvidence.modernReference,
  },
  {
    observanceSlug: "kali-chaudas-baps",
    canonicalName: "Kali Chaudash / Hanuman Puja",
    ruleId: "devam-baps-kali-chaudash-unique-full-nishita-chaturdashi-v1",
    allowedTraditionCodes: kaliChaudasEvidence.supportedTraditionCodes,
    candidateCivilDates: kaliChaudasEvidence.candidateCivilDates,
    targetTithi: { index: 29, name: "Chaturdashi", paksha: "krishna" },
    decisionWindowKind: "nishita",
    precedenceKind: "unique_full_krishna_chaturdashi_overlap_with_local_nishita_fail_closed",
    precedenceExplanation: "For this exact BAPS context, select only when one candidate's locally recalculated Nishita is fully covered by Krishna Chaturdashi. The Ahmedabad Gujarati calendar and BAPS sources corroborate November 7. Provider Pradosh and Nishith intervals are not copied, and this rule supplies no Hanuman puja or protection procedure.",
    selectionMode: "unique_full_nishita_overlap",
    evidencePages: [214, 215],
    evidenceStatus: "current_practitioner_rule_and_location_fixture_plus_historical_adjacent_context",
    sourceScopeNote: kaliChaudasEvidence.sourceScopeNote,
    modernReference: kaliChaudasEvidence.modernReference,
    primaryEvidence: { work: "BAPS Nirnay 2026, BAPS Festival List 2026, and Ahmedabad Gujarati Calendar", edition: "Live 2026 online calendars frozen in the Devam semantic fixture", internetArchiveIdentifier: null, citationArtifactSha256: kaliChaudasEvidence.semanticFixtureSha256, rightsLane: "reference_only" },
  },
  {
    observanceSlug: "tamil-deepavali-naraka-chaturdashi",
    canonicalName: "Tamil Deepavali / Naraka Chaturdashi",
    ruleId: "devam-current-practitioner-tamil-deepavali-unique-brahma-muhurta-chaturdashi-overlap-v1",
    allowedTraditionCodes: tamilDeepavaliEvidence.supportedTraditionCodes,
    candidateCivilDates: tamilDeepavaliEvidence.candidateCivilDates,
    targetTithi: { index: 29, name: "Chaturdashi", paksha: "krishna" },
    decisionWindowKind: "brahma_muhurta",
    precedenceKind: "unique_kartika_krishna_chaturdashi_overlap_with_local_brahma_muhurta_fail_closed",
    precedenceExplanation: "For this bounded 2026 South India lane, validated against the Chennai practitioner fixture and Tamil Nadu HRCE temple calendar, select only when exactly one candidate civil day's local Brahma Muhurta overlaps Krishna Chaturdashi. This resolves the regional calendar date; it does not copy the provider's narrower pre-sunrise muhurta or provide an oil-bath or puja procedure. Tamil Deepavali and the North/West Naraka Chaturdashi lane remain separate records.",
    selectionMode: "unique_brahma_muhurta_overlap",
    evidencePages: [214, 215],
    evidenceStatus: "current_practitioner_rule_and_official_regional_calendar_plus_historical_adjacent_context",
    sourceScopeNote: tamilDeepavaliEvidence.sourceScopeNote,
    modernReference: tamilDeepavaliEvidence.modernReference,
  },
  {
    observanceSlug: "bengal-kali-puja",
    canonicalName: "Kali Puja / Shyama Puja",
    ruleId: "devam-current-practitioner-bengal-kali-puja-unique-nishita-overlap-v1",
    allowedTraditionCodes: kaliPujaEvidence.supportedTraditionCodes,
    candidateCivilDates: kaliPujaEvidence.candidateCivilDates,
    targetTithi: { index: 30, name: "Amavasya", paksha: "krishna" },
    decisionWindowKind: "nishita",
    precedenceKind: "unique_kartika_amavasya_overlap_with_local_nishita_fail_closed",
    precedenceExplanation: "For this bounded 2026 Bengal Shakta lane, validated against the Kolkata practitioner fixture and official West Bengal calendar, select only when exactly one candidate civil night has Kartika Amavasya overlap with local Nishita recalculated at the requested coordinates. This is a calendar decision, not a Kali Puja procedure or an assertion that Devam exactly reproduces the provider's puja muhurta. Kali Puja and Lakshmi Puja remain separate records.",
    selectionMode: "unique_nishita_overlap",
    evidencePages: [216, 217],
    evidenceStatus: "current_practitioner_rule_and_official_regional_calendar_plus_historical_adjacent_context",
    sourceScopeNote: kaliPujaEvidence.sourceScopeNote,
    modernReference: kaliPujaEvidence.modernReference,
  },
  {
    observanceSlug: "bandi-chhor-divas-sgpc",
    canonicalName: "Bandi Chhor Divas",
    ruleId: "devam-sgpc-nanakshahi-23-kattak-bandi-chhor-v1",
    allowedTraditionCodes: ["sikh-sgpc"],
    candidateCivilDates: ["2026-11-08", "2026-11-09"],
    targetTithi: { index: 30, name: "Amavasya", paksha: "krishna" },
    decisionWindowKind: "pradosha",
    precedenceKind: "official_sgpc_nanakshahi_calendar_23_kattak_maps_to_2026_11_08",
    precedenceExplanation: "For this exact SGPC lane, use the official SGPC Nanakshahi calendar entry: Bandi Chhor Divas (Diwali), 23 Kattak, mapped in the same calendar to November 8, 2026. The tithi and pradosha fields are contextual astronomical metadata only and do not establish Sikh observance authority. The rule does not merge Hindu or Jain Diwali and does not prescribe a universal gurdwara, sangh, or family programme.",
    selectionMode: "official_calendar_first_candidate",
    evidencePages: [],
    primaryEvidence: {
      work: "SGPC Nanakshahi Calendar 2026-27, SGPC distinct-identity statement, and Sikh institutional Bandi Chhor history",
      edition: "Official SGPC calendar PDF and live institutional pages frozen in the Devam semantic fixture",
      internetArchiveIdentifier: null,
      citationArtifactSha256: bandiChhorEvidence.semanticFixtureSha256,
      rightsLane: "reference_only",
    },
    evidenceStatus: "official_sgpc_calendar_and_sikh_history_fixture",
    sourceScopeNote: bandiChhorEvidence.sourceScopeNote,
    modernReference: bandiChhorEvidence.modernReference,
  },
  {
    observanceSlug: "jain-diwali-umbrella",
    canonicalName: "Jain Diwali / Mahavira's Liberation",
    ruleId: "devam-jain-amavasya-pradosha-umbrella-diwali-v1",
    allowedTraditionCodes: ["jain-umbrella"],
    candidateCivilDates: ["2026-11-08", "2026-11-09"],
    targetTithi: { index: 30, name: "Amavasya", paksha: "krishna" },
    decisionWindowKind: "pradosha",
    precedenceKind: "greater_pradosha_amavasya_coverage_for_umbrella_jain_diwali_evening",
    precedenceExplanation: "For this bounded umbrella Jain Diwali evening lane, select the candidate with greater Amavasya coverage during local pradosha. JAINA grounds the Mahavira-liberation and inner-light identity, while official Jain community calendars preserve distinct November 8 Diwali, November 9 Mahavir Nirvan or Digambar puja, and November 10 Gautam Swami New Year entries. This rule resolves only the umbrella evening lane; sect, sangh, temple, and family dates and procedures must be asked rather than merged.",
    selectionMode: "greater_overlap_earlier_tie",
    evidencePages: [],
    primaryEvidence: {
      work: "JAINA Diwali and Mahavira Nirvana guidance, Jain Center of New Jersey 2026 calendar, Mahavir Foundation 2026 calendar, and Incredible India Diwali context",
      edition: "Live official and community pages frozen in the Devam semantic fixture",
      internetArchiveIdentifier: null,
      citationArtifactSha256: jainDiwaliEvidence.semanticFixtureSha256,
      rightsLane: "reference_only",
    },
    evidenceStatus: "official_jain_umbrella_and_community_variant_fixture",
    sourceScopeNote: jainDiwaliEvidence.sourceScopeNote,
    modernReference: jainDiwaliEvidence.modernReference,
  },
  {
    observanceSlug: "diwali-lakshmi-puja",
    canonicalName: "Diwali Lakshmi Puja",
    ruleId: "nirnayasindhu-1865-kartika-amavasya-pradosha-v1",
    allowedTraditionCodes: ["smarta-north-india", "smarta-west-india"],
    candidateCivilDates: ["2026-11-08", "2026-11-09"],
    targetTithi: { index: 30, name: "Amavasya", paksha: "krishna" },
    decisionWindowKind: "pradosha",
    precedenceKind: "greater_pradosha_amavasya_coverage_otherwise_first_day",
    precedenceExplanation: "Within this bounded North/West India fixture, select the civil evening with greater Amavasya coverage in the post-sunset pradosha decision window; this does not calculate a puja muhurta.",
    evidencePages: [216, 217],
    modernReference: { provider: "Drik Panchang", url: "https://www.drikpanchang.com/festivals/lakshmipuja/festivals-lakshmipuja-timings.html?geoname-id=1273294&year=2026", referenceLocation: "Delhi, India", observedCivilDate: "2026-11-08", observationRole: "location_specific_date_fixture_not_rule_authority" },
  },
  {
    observanceSlug: "bali-pratipada",
    canonicalName: "Bali Pratipada",
    ruleId: "nirnayasindhu-1865-kartika-shukla-pratipada-sunrise-bali-v1",
    allowedTraditionCodes: ["smarta-west-india"],
    candidateCivilDates: ["2026-11-09", "2026-11-10"],
    targetTithi: { index: 1, name: "Pratipada", paksha: "shukla" },
    decisionWindowKind: "sunrise_presence",
    precedenceKind: "pratipada_present_at_sunrise_otherwise_greater_sunrise_overlap",
    precedenceExplanation: "Within this bounded West India fixture, select the civil day on which Kartika Shukla Pratipada is present at local sunrise. A separate Maharashtra family-participation guide supports King Bali remembrance and joyful family time; formal, household-specific, regional, and sampradaya procedures remain outside this calendar rule.",
    evidencePages: [218, 219],
    modernReference: { provider: "Drik Panchang", url: "https://www.drikpanchang.com/calendars/hindu/hinducalendar.html?geoname-id=1261481&year=2026", referenceLocation: "Delhi, India", observedCivilDate: "2026-11-10", observationRole: "location_specific_date_fixture_not_rule_authority" },
  },
  {
    observanceSlug: "govardhan-puja",
    canonicalName: "Govardhan Puja / Annakut",
    ruleId: "nirnayasindhu-1865-kartika-shukla-pratipada-sunrise-govardhan-v1",
    allowedTraditionCodes: ["smarta-north-india", "smarta-west-india", "vaishnava-iskcon"],
    candidateCivilDates: ["2026-11-09", "2026-11-10"],
    targetTithi: { index: 1, name: "Pratipada", paksha: "shukla" },
    decisionWindowKind: "sunrise_presence",
    precedenceKind: "pratipada_present_at_sunrise_otherwise_greater_sunrise_overlap",
    precedenceExplanation: "Within the bounded 2026 reference profiles, select the civil day on which Kartika Shukla Pratipada is present at local sunrise. Govardhana, Annakut, Bali Pratipada, and temple-specific offering practices remain distinct lanes.",
    evidencePages: [218, 219],
    modernReference: { provider: "Drik Panchang", url: "https://www.drikpanchang.com/calendars/hindu/hinducalendar.html?geoname-id=1261481&year=2026", referenceLocation: "Delhi, India", observedCivilDate: "2026-11-10", observationRole: "location_specific_date_fixture_not_rule_authority" },
  },
  {
    observanceSlug: "gujarati-new-year-baps",
    canonicalName: "Gujarati New Year / Bestu Varash / Annakut",
    ruleId: "devam-baps-kartak-sud-padvo-sunrise-bestu-varash-v1",
    allowedTraditionCodes: ["swaminarayan-baps"],
    candidateCivilDates: ["2026-11-09", "2026-11-10"],
    targetTithi: { index: 1, name: "Pratipada", paksha: "shukla" },
    decisionWindowKind: "sunrise_presence",
    precedenceKind: "kartika_shukla_pratipada_present_at_local_sunrise_for_exact_baps_context",
    precedenceExplanation: "For the exact BAPS Ahmedabad context, select the candidate on which Kartika Shukla Pratipada is present at local sunrise. BAPS independently identifies November 10 as Kartak Sud Padvo, Annakut, and Bestu Varash. No provider muhurta or formal Annakut, aarti, business-account, or outcome procedure is reproduced.",
    evidencePages: [],
    primaryEvidence: {
      work: "BAPS November Calendar 2026, BAPS Festival List 2026, BAPS Nutan Varsh/New Year Annakut, and Akashvani Gujarati New Year context",
      edition: "Live official pages frozen in the Devam semantic fixture",
      internetArchiveIdentifier: null,
      citationArtifactSha256: gujaratiNewYearEvidence.semanticFixtureSha256,
      rightsLane: "reference_only",
    },
    evidenceStatus: "current_sampradaya_rule_and_official_public_context",
    sourceScopeNote: gujaratiNewYearEvidence.sourceScopeNote,
    modernReference: gujaratiNewYearEvidence.modernReference,
  },
  {
    observanceSlug: "karnataka-balipadyami",
    canonicalName: "Bali Padyami / Balipadyami",
    ruleId: "devam-karnataka-kartika-shukla-pratipada-sunrise-balipadyami-v1",
    allowedTraditionCodes: ["smarta-south-india"],
    candidateCivilDates: ["2026-11-09", "2026-11-10"],
    targetTithi: { index: 1, name: "Pratipada", paksha: "shukla" },
    decisionWindowKind: "sunrise_presence",
    precedenceKind: "kartika_shukla_pratipada_present_at_local_sunrise_for_bounded_karnataka_context",
    precedenceExplanation: "For the bounded Karnataka Smarta context, select the candidate on which Kartika Shukla Pratipada is present at Bengaluru sunrise. The official Bengaluru listing corroborates November 10. Govardhana on that listing remains a separate lane, as do Maharashtra Bali Pratipada and BAPS New Year.",
    evidencePages: [],
    primaryEvidence: {
      work: "ISKCON Bangalore Public Holidays Calendar 2026, Karnataka Tourism Deepavali, and Akashvani Karnataka Bali Padyami",
      edition: "Live official pages frozen in the Devam semantic fixture",
      internetArchiveIdentifier: null,
      citationArtifactSha256: balipadyamiEvidence.semanticFixtureSha256,
      rightsLane: "reference_only",
    },
    evidenceStatus: "official_regional_date_and_context_fixture",
    sourceScopeNote: balipadyamiEvidence.sourceScopeNote,
    modernReference: balipadyamiEvidence.modernReference,
  },
  {
    observanceSlug: "bhai-dooj",
    canonicalName: "Bhai Dooj / Yama Dvitiya",
    ruleId: "nirnayasindhu-1865-kartika-shukla-dvitiya-aparahna-v1",
    allowedTraditionCodes: ["smarta-north-india", "smarta-west-india"],
    candidateCivilDates: ["2026-11-10", "2026-11-11"],
    targetTithi: { index: 2, name: "Dvitiya", paksha: "shukla" },
    decisionWindowKind: "aparahna",
    precedenceKind: "greater_aparahna_dvitiya_coverage_otherwise_first_day",
    precedenceExplanation: "Within this bounded North/West India fixture, select the day with greater Shukla Dvitiya coverage during aparahna.",
    evidencePages: [220, 221],
    modernReference: { provider: "Drik Panchang", url: "https://www.drikpanchang.com/calendars/hindu/hinducalendar.html?geoname-id=1261481&year=2026", referenceLocation: "Delhi, India", observedCivilDate: "2026-11-11", observationRole: "location_specific_date_fixture_not_rule_authority" },
  },
];

const EKADASHI_LEADS = [
  { observanceSlug: "aja-ekadashi", canonicalName: "Aja Ekadashi", candidateCivilDates: ["2026-09-06", "2026-09-07"] as const, modernDateLead: "2026-09-07", targetTithi: { index: 26, name: "Ekadashi", paksha: "krishna" } as const },
  { observanceSlug: "parsva-ekadashi", canonicalName: "Parsva / Parivartini Ekadashi", candidateCivilDates: ["2026-09-21", "2026-09-22"] as const, modernDateLead: "2026-09-22", targetTithi: { index: 11, name: "Ekadashi", paksha: "shukla" } as const },
  { observanceSlug: "indira-ekadashi", canonicalName: "Indira Ekadashi", candidateCivilDates: ["2026-10-05", "2026-10-06"] as const, modernDateLead: "2026-10-06", targetTithi: { index: 26, name: "Ekadashi", paksha: "krishna" } as const },
  { observanceSlug: "papankusha-ekadashi", canonicalName: "Papankusha Ekadashi", candidateCivilDates: ["2026-10-21", "2026-10-22"] as const, modernDateLead: "2026-10-22", targetTithi: { index: 11, name: "Ekadashi", paksha: "shukla" } as const },
  { observanceSlug: "rama-ekadashi", canonicalName: "Rama Ekadashi", candidateCivilDates: ["2026-11-04", "2026-11-05"] as const, modernDateLead: "2026-11-05", targetTithi: { index: 26, name: "Ekadashi", paksha: "krishna" } as const },
  { observanceSlug: "devutthana-ekadashi", canonicalName: "Devutthana Ekadashi", candidateCivilDates: ["2026-11-20", "2026-11-21"] as const, modernDateLead: "2026-11-20", targetTithi: { index: 11, name: "Ekadashi", paksha: "shukla" } as const },
  { observanceSlug: "utpanna-ekadashi", canonicalName: "Utpanna Ekadashi", candidateCivilDates: ["2026-12-03", "2026-12-04"] as const, modernDateLead: "2026-12-04", targetTithi: { index: 26, name: "Ekadashi", paksha: "krishna" } as const },
  { observanceSlug: "mokshada-ekadashi", canonicalName: "Mokshada Ekadashi / Gita Jayanti", candidateCivilDates: ["2026-12-19", "2026-12-20"] as const, modernDateLead: "2026-12-20", targetTithi: { index: 11, name: "Ekadashi", paksha: "shukla" } as const },
] as const;

const EKADASHI_DECISION_FACTORS = [
  "Smarta Dashami contamination at local sunrise",
  "Vaishnava Dashami contamination at arunodaya, modelled here as 96 minutes before sunrise",
  "Ekadashi growth or persistence across consecutive sunrises",
  "shuddha, viddha, paksha-vardhini, and the eight Mahadwadashi classifications",
  "Dvadashi availability and the parana window",
  "Dvadashi-versus-Trayodashi parana preservation and exceptional timing",
  "householder, ascetic, sampradaya, and desire-specific applicability",
] as const;

function unresolvedEkadashiCandidates(request: PanchangRequest, currentFact: PanchangFact): UnresolvedEkadashiCandidate[] {
  if (!["smarta-north-india", "smarta-west-india", "smarta-south-india", "vaishnava-iskcon"].includes(request.traditionCode)) return [];
  return EKADASHI_LEADS.filter((lead) => lead.candidateCivilDates.includes(request.civilDate as never)).map((lead) => {
    const facts = lead.candidateCivilDates.map((civilDate) => civilDate === request.civilDate ? currentFact : calculatePanchang({ ...request, civilDate }));
    if (facts.some((fact) => fact === null)) throw new Error(`Unable to calculate Ekadashi candidate pair: ${lead.observanceSlug}`);
    return {
      observanceSlug: lead.observanceSlug,
      canonicalName: lead.canonicalName,
      displayReason: "The two-day window is known, but Smarta/Vaishnava contamination, tithi-growth and Mahadwadashi classification, and parana evidence are not yet sufficient to assign this Ekadashi date.",
      status: "source_complexity_requires_rule_adjudication",
      selectedCivilDate: null,
      modernDateLead: lead.modernDateLead,
      targetTithi: lead.targetTithi,
      candidateDays: (facts as PanchangFact[]).map((fact) => {
        const arunodayaStartUtc = new Date(Date.parse(fact.sunriseUtc) - 96 * 60_000).toISOString();
        return {
          civilDate: fact.request.civilDate,
          sunriseUtc: fact.sunriseUtc,
          arunodayaStartUtc,
          tithiAtArunodaya: calculateTithiAtInstant(arunodayaStartUtc),
          tithiAtSunrise: calculateTithiAtInstant(fact.sunriseUtc),
        };
      }),
      evidence: {
        work: "Nirṇayasindhu",
        edition: "Marathi translation, Mumbai 1865",
        internetArchiveIdentifier: "in.ernet.dli.2015.365977",
        citationImageSha256: NIRNAYASINDHU_PDF_SHA256,
        pdfPages: Array.from({ length: 16 }, (_, index) => index + 52),
        rightsLane: "private_evidence",
        sourceTextReturnedByApi: false,
      },
      requiredDecisionFactors: EKADASHI_DECISION_FACTORS,
      boundaries: { smartaDateResolved: false, vaishnavaDateResolved: false, paranaResolved: false, ritualGuidanceIncluded: false },
    };
  });
}

function unresolvedLunarCandidates(request: PanchangRequest, currentFact: PanchangFact): UnresolvedLunarCandidate[] {
  const candidateCivilDates = ["2026-12-22", "2026-12-23", "2026-12-24"] as const;
  if ((request.traditionCode !== "smarta-north-india" && request.traditionCode !== "smarta-west-india") || !candidateCivilDates.includes(request.civilDate as never)) return [];
  const facts = candidateCivilDates.map((civilDate) => civilDate === request.civilDate ? currentFact : calculatePanchang({ ...request, civilDate }));
  if (facts.some((fact) => fact === null)) throw new Error("Unable to calculate Margashirsha Purnima candidate window.");
  return [{
    observanceSlug: "margashirsha-purnima",
    canonicalName: "Margashirsha Purnima",
    displayReason: "The fixed later-day rule and the modern December 23 lead do not reconcile through a sunrise-only test, so Devam has not assigned the date.",
    status: "source_rule_and_modern_fixture_require_adjudication",
    selectedCivilDate: null,
    modernDateLead: "2026-12-23",
    targetTithi: { index: 15, name: "Purnima", paksha: "shukla" },
    candidateDays: (facts as PanchangFact[]).map((fact) => ({
      civilDate: fact.request.civilDate,
      sunriseUtc: fact.sunriseUtc,
      moonriseUtc: fact.moonriseUtc,
      tithiAtSunrise: calculateTithiAtInstant(fact.sunriseUtc),
      tithiAtMoonrise: fact.moonriseUtc ? calculateTithiAtInstant(fact.moonriseUtc) : null,
    })),
    evidence: {
      work: "Nirnayasindhu",
      edition: "Marathi translation, Mumbai 1865",
      internetArchiveIdentifier: "in.ernet.dli.2015.365977",
      citationImageSha256: NIRNAYASINDHU_PDF_SHA256,
      pdfPages: [66],
      rightsLane: "private_evidence",
      sourceTextReturnedByApi: false,
      modernReference: {
        provider: "Drik Panchang",
        url: PURNIMA_REFERENCE_URL,
        referenceLocation: "Delhi, India",
        observedCivilDate: "2026-12-23",
        observationRole: "location_specific_date_fixture_not_rule_authority",
        responseBytes: 102831,
        responseSha256: "bdda6985a696f51edc5663ceccc91fc8ac3f8091b94df0d41444da7aa5171b3b",
      },
    },
    requiredDecisionFactors: [
      "the source's later-day and Chaturdashi-contamination rule",
      "the distinction between the named Purnima calendar day and Purnima Vrat/upavasa",
      "Purnima presence at sunrise versus moonrise across December 22-24",
      "regional and tradition applicability",
    ],
    boundaries: { calendarDateResolved: false, purnimaVrataResolved: false, ritualGuidanceIncluded: false },
  }];
}

function daylightWindow(fact: PanchangFact, startFraction: number, endFraction: number, kind: DecisionWindowKind): TimeWindow {
  const sunrise = Date.parse(fact.sunriseUtc);
  const sunset = Date.parse(fact.sunsetUtc);
  const daylight = sunset - sunrise;
  return { kind, startUtc: new Date(sunrise + daylight * startFraction).toISOString(), endUtc: new Date(sunrise + daylight * endFraction).toISOString() };
}

function decisionWindow(fact: PanchangFact, kind: DecisionWindowKind): TimeWindow {
  if (kind === "brahma_muhurta") return { kind, startUtc: fact.windows.brahmaMuhurta.startUtc, endUtc: fact.windows.brahmaMuhurta.endUtc };
  if (kind === "sunrise_presence") return { kind, startUtc: fact.sunriseUtc, endUtc: new Date(Date.parse(fact.sunriseUtc) + 60_000).toISOString() };
  if (kind === "moonrise_presence") {
    if (!fact.moonriseUtc) throw new Error(`No local moonrise for ${fact.request.civilDate}`);
    return { kind, startUtc: fact.moonriseUtc, endUtc: new Date(Date.parse(fact.moonriseUtc) + 60_000).toISOString() };
  }
  if (kind === "moonrise_to_sunrise") {
    if (!fact.moonriseUtc || Date.parse(fact.moonriseUtc) >= Date.parse(fact.sunriseUtc)) throw new Error(`No pre-sunrise local moonrise for ${fact.request.civilDate}`);
    return { kind, startUtc: fact.moonriseUtc, endUtc: fact.sunriseUtc };
  }
  if (kind === "madhyahna") return daylightWindow(fact, 2 / 5, 3 / 5, kind);
  if (kind === "aparahna") return daylightWindow(fact, 3 / 5, 4 / 5, kind);
  if (kind === "pradosha") return { kind, startUtc: fact.sunsetUtc, endUtc: new Date(Date.parse(fact.sunsetUtc) + 144 * 60_000).toISOString() };
  throw new Error(`${kind} requires the following civil day's sunrise`);
}

function overlapMillis(startA: number, endA: number, startB: number, endB: number): number {
  return Math.max(0, Math.min(endA, endB) - Math.max(startA, startB));
}

function targetTithiOverlapSeconds(fact: PanchangFact, window: TimeWindow, targetIndex: number): number {
  const windowStart = Date.parse(window.startUtc);
  const windowEnd = Date.parse(window.endUtc);
  const transition = Date.parse(fact.tithi.endsAtUtc);
  if (fact.tithi.index === targetIndex) return Math.round(overlapMillis(windowStart, windowEnd, Number.NEGATIVE_INFINITY, transition) / 1000);
  if (fact.tithi.nextIndex === targetIndex) return Math.round(overlapMillis(windowStart, windowEnd, transition, Number.POSITIVE_INFINITY) / 1000);
  return 0;
}

function targetNakshatraOverlapSeconds(fact: PanchangFact, window: TimeWindow, targetIndex: number): number {
  const windowStart = Date.parse(window.startUtc);
  const windowEnd = Date.parse(window.endUtc);
  const transition = Date.parse(fact.nakshatra.endsAtUtc);
  if (fact.nakshatra.index === targetIndex) return Math.round(overlapMillis(windowStart, windowEnd, Number.NEGATIVE_INFINITY, transition) / 1000);
  if (fact.nakshatra.nextIndex === targetIndex) return Math.round(overlapMillis(windowStart, windowEnd, transition, Number.POSITIVE_INFINITY) / 1000);
  return 0;
}

function shiftCivilDate(civilDate: string, days: number): string {
  const [year, month, day] = civilDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

function windowEvidence(fact: PanchangFact, window: TimeWindow, targetIndex: number): WindowEvidence {
  return { window, targetTithiOverlapSeconds: targetTithiOverlapSeconds(fact, window, targetIndex) };
}

function nishitaMuhurtaWindow(fact: PanchangFact, nextFact: PanchangFact): TimeWindow {
  const nightStart = Date.parse(fact.sunsetUtc);
  const nightEnd = Date.parse(nextFact.sunriseUtc);
  if (!(nightStart < nightEnd)) throw new Error(`Invalid night boundary for ${fact.request.civilDate}`);
  const muhurta = (nightEnd - nightStart) / 15;
  return {
    kind: "nishita",
    startUtc: new Date(nightStart + 7 * muhurta).toISOString(),
    endUtc: new Date(nightStart + 8 * muhurta).toISOString(),
  };
}

function shivaratriDiagnosticWindows(fact: PanchangFact, nextFact: PanchangFact, targetIndex: number): ShivaratriDiagnosticWindows {
  const nightStart = Date.parse(fact.sunsetUtc);
  const nightEnd = Date.parse(nextFact.sunriseUtc);
  if (!(nightStart < nightEnd)) throw new Error(`Invalid night boundary for ${fact.request.civilDate}`);
  const midpoint = nightStart + (nightEnd - nightStart) / 2;
  const night: TimeWindow = { kind: "night", startUtc: fact.sunsetUtc, endUtc: nextFact.sunriseUtc };
  const pradosha = decisionWindow(fact, "pradosha");
  const nishita: TimeWindow = {
    kind: "nishita",
    startUtc: new Date(midpoint - 24 * 60_000).toISOString(),
    endUtc: new Date(midpoint + 24 * 60_000).toISOString(),
  };
  return {
    night: windowEvidence(fact, night, targetIndex),
    pradosha: windowEvidence(fact, pradosha, targetIndex),
    nishita: windowEvidence(fact, nishita, targetIndex),
  };
}

function candidateEvidence(fact: PanchangFact, config: RuleConfig, nextFact?: PanchangFact): CandidateDayEvidence {
  if (config.selectionMode === "masika_shivaratri_pradosha_nishita") {
    if (!nextFact) throw new Error(`Missing following-day fact for ${fact.request.civilDate}`);
    const diagnosticWindows = shivaratriDiagnosticWindows(fact, nextFact, config.targetTithi.index);
    return {
      civilDate: fact.request.civilDate,
      sunriseUtc: fact.sunriseUtc,
      sunsetUtc: fact.sunsetUtc,
      decisionWindow: diagnosticWindows.nishita.window,
      targetTithiOverlapSeconds: diagnosticWindows.nishita.targetTithiOverlapSeconds,
      ...(config.targetNakshatra ? { targetNakshatraOverlapSeconds: targetNakshatraOverlapSeconds(fact, diagnosticWindows.nishita.window, config.targetNakshatra.index) } : {}),
      diagnosticWindows,
    };
  }
  if (config.selectionMode === "unique_nishita_overlap" || config.selectionMode === "unique_full_nishita_overlap") {
    if (!nextFact) throw new Error(`Missing following-day fact for ${fact.request.civilDate}`);
    const window = nishitaMuhurtaWindow(fact, nextFact);
    return { civilDate: fact.request.civilDate, sunriseUtc: fact.sunriseUtc, sunsetUtc: fact.sunsetUtc, decisionWindow: window, targetTithiOverlapSeconds: targetTithiOverlapSeconds(fact, window, config.targetTithi.index), ...(config.targetNakshatra ? { targetNakshatraOverlapSeconds: targetNakshatraOverlapSeconds(fact, window, config.targetNakshatra.index) } : {}) };
  }
  if (config.selectionMode === "unique_night_minimum_one_ghati_overlap") {
    if (!nextFact) throw new Error(`Missing following-day fact for ${fact.request.civilDate}`);
    const window: TimeWindow = { kind: "night", startUtc: fact.sunsetUtc, endUtc: nextFact.sunriseUtc };
    return { civilDate: fact.request.civilDate, sunriseUtc: fact.sunriseUtc, sunsetUtc: fact.sunsetUtc, decisionWindow: window, targetTithiOverlapSeconds: targetTithiOverlapSeconds(fact, window, config.targetTithi.index) };
  }
  const window = decisionWindow(fact, config.decisionWindowKind);
  return { civilDate: fact.request.civilDate, sunriseUtc: fact.sunriseUtc, sunsetUtc: fact.sunsetUtc, decisionWindow: window, targetTithiOverlapSeconds: targetTithiOverlapSeconds(fact, window, config.targetTithi.index), ...(config.targetNakshatra ? { targetNakshatraOverlapSeconds: targetNakshatraOverlapSeconds(fact, window, config.targetNakshatra.index) } : {}) };
}

function selectMasikaShivaratriCandidate(candidates: CandidateDayEvidence[]): CandidateDayEvidence | null {
  const windows = candidates.map((candidate) => candidate.diagnosticWindows);
  if (windows.some((value) => !value)) return null;
  const diagnostics = windows as ShivaratriDiagnosticWindows[];
  const nishitaQualifying = diagnostics.map((value) => value.nishita.targetTithiOverlapSeconds > 0);
  if (nishitaQualifying.filter(Boolean).length === 1) return candidates[nishitaQualifying[0] ? 0 : 1];
  if (nishitaQualifying.every(Boolean)) {
    const fullNishita = diagnostics.map((value) => {
      const duration = (Date.parse(value.nishita.window.endUtc) - Date.parse(value.nishita.window.startUtc)) / 1000;
      return value.nishita.targetTithiOverlapSeconds === duration;
    });
    if (fullNishita.filter(Boolean).length === 1) return candidates[fullNishita[0] ? 0 : 1];
    const pradoshaQualifying = diagnostics.map((value) => value.pradosha.targetTithiOverlapSeconds > 0);
    if (pradoshaQualifying.filter(Boolean).length === 1) return candidates[pradoshaQualifying[0] ? 0 : 1];
    return null;
  }
  const pradoshaQualifying = diagnostics.map((value) => value.pradosha.targetTithiOverlapSeconds > 0);
  return pradoshaQualifying.filter(Boolean).length === 1 ? candidates[pradoshaQualifying[0] ? 0 : 1] : null;
}

function resolveRule(request: PanchangRequest, currentFact: PanchangFact, config: RuleConfig): ObservanceRuleResolution | null {
  if (!config.allowedTraditionCodes.includes(request.traditionCode as RuleConfig["allowedTraditionCodes"][number])) return null;
  if (config.requiredReferenceCoordinates && (request.latitude !== config.requiredReferenceCoordinates.latitude || request.longitude !== config.requiredReferenceCoordinates.longitude || request.timezone !== config.requiredReferenceCoordinates.timezone)) return null;
  if (!config.candidateCivilDates.includes(request.civilDate)) return null;
  const facts = config.candidateCivilDates.map((civilDate) => civilDate === request.civilDate ? currentFact : calculatePanchang({ ...request, civilDate }));
  if (facts.some((fact) => fact === null)) return null;
  if ((config.decisionWindowKind === "moonrise_presence" || config.decisionWindowKind === "moonrise_to_sunrise") && facts.some((fact) => !(fact as PanchangFact).moonriseUtc)) return null;
  const typedFacts = facts as PanchangFact[];
  const requiresFollowingFact = config.selectionMode === "masika_shivaratri_pradosha_nishita" || config.selectionMode === "unique_nishita_overlap" || config.selectionMode === "unique_full_nishita_overlap" || config.selectionMode === "unique_night_minimum_one_ghati_overlap";
  const followingFacts = requiresFollowingFact
    ? typedFacts.map((fact, index) => {
      const followingDate = shiftCivilDate(fact.request.civilDate, 1);
      if (typedFacts[index + 1]?.request.civilDate === followingDate) return typedFacts[index + 1];
      return calculatePanchang({ ...request, civilDate: followingDate });
    })
    : [];
  if (followingFacts.some((fact) => fact === null)) return null;
  const candidates = typedFacts.map((fact, index) => candidateEvidence(fact, config, followingFacts[index] ?? undefined));
  if (config.selectionMode !== "official_calendar_first_candidate" && config.selectionMode !== "sankashti_moonrise" && config.selectionMode !== "masika_shivaratri_pradosha_nishita" && candidates.every((candidate) => candidate.targetTithiOverlapSeconds === 0)) return null;
  const qualifying = config.selectionMode === "unique_full_moonrise_to_sunrise_overlap" || config.selectionMode === "unique_full_nishita_overlap"
    ? candidates.filter((candidate) => candidate.targetTithiOverlapSeconds === Math.round((Date.parse(candidate.decisionWindow.endUtc) - Date.parse(candidate.decisionWindow.startUtc)) / 1000))
    : config.selectionMode === "unique_night_minimum_one_ghati_overlap"
      ? candidates.filter((candidate) => candidate.targetTithiOverlapSeconds >= kalabhairavaEvidence.oneGhatiSeconds)
    : candidates.filter((candidate) => candidate.targetTithiOverlapSeconds > 0);
  if (config.selectionMode === "sankashti_moonrise" && qualifying.length === 2) return null;
  if (config.selectionMode === "unique_pradosha_overlap" && qualifying.length !== 1) return null;
  if (config.selectionMode === "unique_nishita_overlap" && qualifying.length !== 1) return null;
  if (config.selectionMode === "unique_madhyahna_overlap" && qualifying.length !== 1) return null;
  if (config.selectionMode === "unique_sunrise_presence" && qualifying.length !== 1) return null;
  if (config.selectionMode === "unique_brahma_muhurta_overlap" && qualifying.length !== 1) return null;
  if (config.selectionMode === "unique_full_moonrise_to_sunrise_overlap" && qualifying.length !== 1) return null;
  if (config.selectionMode === "unique_full_nishita_overlap" && qualifying.length !== 1) return null;
  if (config.selectionMode === "unique_night_minimum_one_ghati_overlap" && qualifying.length !== 1) return null;
  const masikaSelected = config.selectionMode === "masika_shivaratri_pradosha_nishita" ? selectMasikaShivaratriCandidate(candidates) : null;
  if (config.selectionMode === "masika_shivaratri_pradosha_nishita" && !masikaSelected) return null;
  const selected = config.selectionMode === "official_calendar_first_candidate" ? candidates[0] : masikaSelected ?? (config.selectionMode === "sankashti_moonrise" && qualifying.length === 0
    ? candidates[1]
    : candidates[1].targetTithiOverlapSeconds > candidates[0].targetTithiOverlapSeconds
      ? candidates[1]
      : config.selectionMode === "greater_overlap_later_tie" && candidates[1].targetTithiOverlapSeconds === candidates[0].targetTithiOverlapSeconds
        ? candidates[1]
        : candidates[0]);
  return {
    observanceSlug: config.observanceSlug,
    canonicalName: config.canonicalName,
    ruleId: config.ruleId,
    rulesetVersion: RULE_ENGINE_VERSION,
    status: "resolved_for_bounded_2026_candidate_window",
    selectedCivilDate: selected.civilDate,
    appliesToRequestedDate: selected.civilDate === request.civilDate,
    targetTithi: config.targetTithi,
    targetNakshatra: config.targetNakshatra,
    candidateDays: candidates,
    precedence: { kind: config.precedenceKind, explanation: config.precedenceExplanation },
    evidence: {
      work: config.primaryEvidence ? config.primaryEvidence.work : "Nirṇayasindhu",
      edition: config.primaryEvidence ? config.primaryEvidence.edition : "Marathi translation, Mumbai 1865",
      internetArchiveIdentifier: config.primaryEvidence ? null : "in.ernet.dli.2015.365977",
      citationImageSha256: config.primaryEvidence ? null : NIRNAYASINDHU_PDF_SHA256,
      ...(config.primaryEvidence ? { citationArtifactSha256: config.primaryEvidence.citationArtifactSha256 } : {}),
      pdfPages: [...config.evidencePages],
      evidenceStatus: config.evidenceStatus ?? "historical_rule_source_plus_location_specific_modern_date_fixture",
      sourceScopeNote: config.sourceScopeNote,
      rightsLane: config.primaryEvidence?.rightsLane ?? "private_evidence",
      sourceTextReturnedByApi: false,
      modernReference: config.modernReference,
    },
    boundaries: { completeDayCoverage: false, completeSeptemberDecemberCoverage: false, modernPracticeResolved: false, ritualGuidanceIncluded: false, universalTraditionClaim: false },
  };
}

export function resolveBoundedObservances(request: PanchangRequest): ObservanceResolutionResult {
  const currentFact = calculatePanchang(request);
  const engine = { id: "devam-observance-rules" as const, version: RULE_ENGINE_VERSION, evidenceStatus: "bounded_source_rules_with_location_specific_fixture_validation" as const };
  if (!currentFact) return { ok: true, request, engine, status: "calculation_failed_closed", matchedRules: [], unresolvedCandidates: [], boundaries: { completeDayCoverage: false, completeSeptemberDecemberCoverage: false, ritualGuidanceIncluded: false, note: "Astronomical prerequisites could not be calculated; no observance was assigned." } };
  const ekadashiRules = resolveEkadashiObservances(request, currentFact, RULE_ENGINE_VERSION);
  const matchedRules: Array<ObservanceRuleResolution | SolarObservanceResolution<typeof RULE_ENGINE_VERSION> | EkadashiResolution<typeof RULE_ENGINE_VERSION> | ChhathResolution<typeof RULE_ENGINE_VERSION> | AgastyaArghyaResolution> = [
    ...RULES.map((config) => resolveRule(request, currentFact, config)).filter((value): value is ObservanceRuleResolution => value !== null),
    ...resolveSolarObservances(request, currentFact, RULE_ENGINE_VERSION),
    ...ekadashiRules,
    ...resolveChhathObservance(request, RULE_ENGINE_VERSION),
    ...resolveAgastyaArghya(request, RULE_ENGINE_VERSION),
  ];
  const unresolvedCandidates: UnresolvedObservanceCandidate[] = [
    ...(ekadashiRules.length ? [] : unresolvedEkadashiCandidates(request, currentFact)),
    ...unresolvedLunarCandidates(request, currentFact),
  ];
  return {
    ok: true,
    request,
    engine,
    status: matchedRules.length && unresolvedCandidates.length
      ? "resolved_subset_with_unresolved_candidates"
      : matchedRules.length
        ? "resolved_supported_subset"
        : unresolvedCandidates.length
          ? "unresolved_candidate_requires_adjudication"
          : "no_supported_rule_for_context",
    matchedRules,
    unresolvedCandidates,
    boundaries: {
      completeDayCoverage: false,
      completeSeptemberDecemberCoverage: false,
      ritualGuidanceIncluded: false,
      note: matchedRules.length && unresolvedCandidates.length
        ? `${matchedRules.length} evidence-bounded observance rule${matchedRules.length === 1 ? " was" : "s were"} resolved, while ${unresolvedCandidates.length} candidate${unresolvedCandidates.length === 1 ? " remains" : "s remain"} unassigned pending source and context adjudication.`
        : matchedRules.length
          ? `${matchedRules.length} evidence-bounded observance rule${matchedRules.length === 1 ? " was" : "s were"} evaluated. Other observances, regional lanes, and modern ritual guidance remain unresolved.`
          : unresolvedCandidates.length
            ? `${unresolvedCandidates.length} candidate window${unresolvedCandidates.length === 1 ? " was" : "s were"} recognized, but source and context factors remain unresolved; no observance date was assigned.`
            : "No product-supported observance rule covers this exact date and tradition context yet.",
    },
  };
}

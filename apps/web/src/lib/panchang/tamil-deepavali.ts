import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const FIXTURE_SHA256 = "97319c8fc4f1e6bb157c7540f6bcfc3379c0bccabdabb22b57493e085feac7de";
const NIRNAYASINDHU_PDF_SHA256 = "a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b";
const DRIK_URL = "https://www.drikpanchang.com/tamil/festivals/tamil-deepavali/tamil-deepavali-date-time.html?geoname-id=1264527&year=2026";
const HRCE_URL = "https://hrce.tn.gov.in/hrcehome/hrce-festival-calendar.php?month=11&year=2026";
const SUPPORTED_TRADITIONS = ["smarta-south-india"] as const;

type FetchObservation = {
  fetched_at_utc: string;
  status: 200;
  final_url: string;
  response_bytes: number;
  response_sha256: string;
  strict_utf8: true;
};

type LiveSource = {
  source_id: string;
  provider: string;
  url: string;
  rights_lane: "reference_only";
  evidence_role: string;
  raw_page_is_dynamic: boolean;
  fetches: FetchObservation[];
  semantic_observation: Record<string, string | number | boolean>;
  source_text_returned_by_api: false;
};

type Fixture = {
  contract: "DEVAM_TAMIL_DEEPAVALI_DATE_EVIDENCE_FIXTURE_V1";
  fixture_id: "devam-tamil-deepavali-chennai-2026-v1";
  scope: {
    reference_location: "Chennai, Tamil Nadu, India";
    geoname_id: 1264527;
    timezone: "Asia/Kolkata";
    candidate_civil_dates: ["2026-11-07", "2026-11-08"];
    supported_tradition_codes: string[];
    date_resolved_by_devam: true;
    brahma_muhurta_window_recalculated_by_devam: true;
    provider_published_muhurta_claimed_reproduced: false;
    ritual_guidance_included: false;
    universal_india_claim: false;
  };
  live_sources: LiveSource[];
  fixed_adjacent_evidence: {
    source_id: string;
    provider: string;
    object_sha256: string;
    object_bytes: number;
    media_type: "application/pdf";
    rights_lane: "private_evidence";
    visually_inspected_pdf_pages: number[];
    evidence_role: string;
    source_text_returned_by_api: false;
  };
  decision: {
    observance_slug: "tamil-deepavali-naraka-chaturdashi";
    canonical_name: "Tamil Deepavali / Naraka Chaturdashi";
    target_tithi: "Chaturdashi";
    target_paksha: "krishna";
    decision_window: "brahma_muhurta";
    selection: string;
    selected_civil_date: "2026-11-08";
    both_candidates_overlap: "fail_closed";
    neither_candidate_overlaps: "fail_closed";
    tamil_deepavali_and_north_west_naraka_chaturdashi_remain_separate_records: true;
    provider_published_before_sunrise_muhurta_is_validation_evidence_not_a_copied_product_muhurta: true;
  };
  denials: Record<string, false>;
};

function assertFetches(source: LiveSource, expected: readonly (readonly [string, string, number, string])[]): void {
  if (source.fetches.length !== expected.length) throw new Error(`Tamil Deepavali fetch universe drift: ${source.source_id}`);
  source.fetches.forEach((fetch, index) => {
    const row = expected[index];
    if (fetch.fetched_at_utc !== row[0] || fetch.status !== 200 || fetch.final_url !== row[1] || fetch.response_bytes !== row[2] || fetch.response_sha256 !== row[3] || fetch.strict_utf8 !== true) throw new Error(`Tamil Deepavali fetch drift: ${source.source_id}/${index}`);
  });
}

function loadFixture(): Fixture {
  const path = resolve(process.cwd(), "../..", "knowledge_packs/panchang/tamil-deepavali-chennai-2026-v1.json");
  const bytes = readFileSync(path);
  if (createHash("sha256").update(bytes).digest("hex") !== FIXTURE_SHA256) throw new Error("Tamil Deepavali fixture hash drift");
  const fixture = JSON.parse(bytes.toString("utf8")) as Fixture;
  if (fixture.contract !== "DEVAM_TAMIL_DEEPAVALI_DATE_EVIDENCE_FIXTURE_V1" || fixture.fixture_id !== "devam-tamil-deepavali-chennai-2026-v1") throw new Error("Tamil Deepavali fixture identity drift");

  const scope = fixture.scope;
  if (scope.reference_location !== "Chennai, Tamil Nadu, India" || scope.geoname_id !== 1264527 || scope.timezone !== "Asia/Kolkata" || JSON.stringify(scope.candidate_civil_dates) !== JSON.stringify(["2026-11-07", "2026-11-08"]) || JSON.stringify(scope.supported_tradition_codes) !== JSON.stringify(SUPPORTED_TRADITIONS) || scope.date_resolved_by_devam !== true || scope.brahma_muhurta_window_recalculated_by_devam !== true || scope.provider_published_muhurta_claimed_reproduced || scope.ritual_guidance_included || scope.universal_india_claim) throw new Error("Tamil Deepavali scope drift");
  if (fixture.live_sources.length !== 2) throw new Error("Tamil Deepavali live source universe drift");

  const drik = fixture.live_sources[0];
  if (drik.source_id !== "drikpanchang-chennai-tamil-deepavali-2026" || drik.provider !== "Drik Panchang" || drik.url !== DRIK_URL || drik.rights_lane !== "reference_only" || drik.evidence_role !== "current_practitioner_tamil_deepavali_identity_brahma_muhurta_rule_and_chennai_date_fixture" || !drik.raw_page_is_dynamic || drik.source_text_returned_by_api !== false) throw new Error("Tamil Deepavali Drik identity drift");
  assertFetches(drik, [
    ["2026-08-06T20:39:39.040Z", DRIK_URL, 81500, "bab6bf7a19b56c0ae27b247041f1d98d13694dbe07b082d82cd13f3cf11a4d81"],
    ["2026-08-06T20:39:45.957Z", DRIK_URL, 81500, "c6b5c90589e9ac0c0be44044ffd93b35f69e8a5865bd42974d3bfb42e5816b53"],
  ]);
  const current = drik.semantic_observation;
  if (current.title !== "2026 Tamil Deepavali | Tamil Deepavali Date for Chennai, Tamil Nadu, India" || current.civil_date !== "2026-11-08" || current.weekday !== "Sunday" || current.published_before_sunrise_muhurta_begins_local !== "05:06" || current.published_before_sunrise_muhurta_ends_local !== "06:05" || current.sathuradasi_begins_local !== "2026-11-07T10:47:00+05:30" || current.sathuradasi_ends_local !== "2026-11-08T11:27:00+05:30" || current.tamil_deepavali_identity_present !== true || current.tamil_nadu_and_karnataka_chaturdashi_brahma_muhurta_rule_present !== true || current.narakasura_identity_context_present !== true) throw new Error("Tamil Deepavali Drik semantic drift");

  const hrce = fixture.live_sources[1];
  if (hrce.source_id !== "tamil-nadu-hrce-november-2026-festival-calendar" || hrce.provider !== "Government of Tamil Nadu Hindu Religious and Charitable Endowments Department" || hrce.url !== HRCE_URL || hrce.rights_lane !== "reference_only" || hrce.evidence_role !== "official_tamil_nadu_temple_calendar_corroboration_not_brahma_muhurta_rule_authority" || hrce.raw_page_is_dynamic || hrce.source_text_returned_by_api !== false) throw new Error("Tamil Deepavali HRCE identity drift");
  assertFetches(hrce, [
    ["2026-08-06T20:39:39.341Z", HRCE_URL, 655882, "7d8c399418edb10c78d0f12e3ff0a7c1275f1d39bf03b7d925fe82d03cee5d24"],
    ["2026-08-06T20:39:46.134Z", HRCE_URL, 655882, "7d8c399418edb10c78d0f12e3ff0a7c1275f1d39bf03b7d925fe82d03cee5d24"],
  ]);
  const official = hrce.semantic_observation;
  if (official.calendar_month !== "2026-11" || official.festival_literal !== "Devali" || official.civil_date !== "2026-11-08" || official.exact_single_day_entries !== 11 || official.entries_explicitly_carrying_chathurthasi !== 3 || official.statewide_universal_practice_claim !== false || official.brahma_muhurta_rule_authority !== false) throw new Error("Tamil Deepavali HRCE semantic drift");

  const adjacent = fixture.fixed_adjacent_evidence;
  if (adjacent.source_id !== "nirnayasindhu-marathi-1865-kartika-krishna-chaturdashi-context" || adjacent.provider !== "Devam retained source vault" || adjacent.object_sha256 !== NIRNAYASINDHU_PDF_SHA256 || adjacent.object_bytes !== 93531683 || adjacent.media_type !== "application/pdf" || adjacent.rights_lane !== "private_evidence" || JSON.stringify(adjacent.visually_inspected_pdf_pages) !== "[214,215]" || adjacent.evidence_role !== "historical_adjacent_naraka_chaturdashi_context_not_tamil_deepavali_identity_brahma_muhurta_or_household_practice_authority" || adjacent.source_text_returned_by_api !== false) throw new Error("Tamil Deepavali adjacent evidence drift");

  const decision = fixture.decision;
  if (decision.observance_slug !== "tamil-deepavali-naraka-chaturdashi" || decision.canonical_name !== "Tamil Deepavali / Naraka Chaturdashi" || decision.target_tithi !== "Chaturdashi" || decision.target_paksha !== "krishna" || decision.decision_window !== "brahma_muhurta" || decision.selection !== "select_only_when_exactly_one_candidate_civil_day_has_kartika_krishna_chaturdashi_overlap_with_local_brahma_muhurta" || decision.selected_civil_date !== "2026-11-08" || decision.both_candidates_overlap !== "fail_closed" || decision.neither_candidate_overlaps !== "fail_closed" || !decision.tamil_deepavali_and_north_west_naraka_chaturdashi_remain_separate_records || !decision.provider_published_before_sunrise_muhurta_is_validation_evidence_not_a_copied_product_muhurta) throw new Error("Tamil Deepavali decision drift");
  if (Object.keys(fixture.denials).length !== 15 || Object.values(fixture.denials).some((value) => value !== false)) throw new Error("Tamil Deepavali denial drift");
  return fixture;
}

const FIXTURE = loadFixture();

export const tamilDeepavaliEvidence = {
  semanticFixtureSha256: FIXTURE_SHA256,
  candidateCivilDates: FIXTURE.scope.candidate_civil_dates,
  supportedTraditionCodes: SUPPORTED_TRADITIONS,
  selectedCivilDate: FIXTURE.decision.selected_civil_date,
  modernReference: {
    provider: "Drik Panchang" as const,
    url: DRIK_URL,
    referenceLocation: "Chennai, Tamil Nadu, India",
    observedCivilDate: FIXTURE.decision.selected_civil_date,
    observationRole: "current_practitioner_rule_and_location_specific_date_fixture" as const,
    semanticFixtureSha256: FIXTURE_SHA256,
    responseBytes: 81500,
    responseSha256: "c6b5c90589e9ac0c0be44044ffd93b35f69e8a5865bd42974d3bfb42e5816b53",
  },
  sourceScopeNote: "The 2026 South India lane is validated against the Chennai Tamil Deepavali fixture and Tamil Nadu HRCE temple calendar, then recalculated at requested coordinates. The deciding window is local Brahma Muhurta with Krishna Chaturdashi, not North/West Amavasya at Pradosha. The retained historical pages are adjacent Naraka Chaturdashi context, not Tamil practice authority. No oil-bath, household puja, or provider-muhurta procedure is served.",
} as const;

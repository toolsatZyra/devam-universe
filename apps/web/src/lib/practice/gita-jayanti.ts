import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PracticeGuidanceRequest, RitualProcedureGuide } from "../domain/practice";

const PACK_SHA256 = "a3e96f43d276e60cf3d7782861da2a120f2d2ac53f78a50102a715a2c018afbb";
const FIXTURE_SHA256 = "20e6f9f473cbdf5a68282b36af4a08a6471a0f814665132743e22fca6bd44930";
const EKADASHI_FIXTURE_SHA256 = "6c860d6f2d778739c4a25b4b281b03a16975e8d43021baee24c55b1e1b72433d";
const GRETIL_SOURCE_SHA256 = "e10352273ea29958205dbc72b7b81a0df95eb3623a0b6439141e3e2a2d54b505";
const REGION_CODES = ["north-india", "west-india", "south-india"];
const TRADITION_CODES = ["smarta-north-india", "smarta-west-india", "smarta-south-india", "vaishnava-iskcon"];
const SOURCE_IDS = ["devam-gita-jayanti-evidence-fixture", "utsav-international-geeta-mahotsav", "kurukshetra-jyotisar-events", "iitk-gita-supersite-introduction", "gretil-bhagavadgita-four-commentaries-tei", "devam-gita-reading-safety-boundary"];
const EXPECTED_SCOPE = { region_codes: REGION_CODES, tradition_codes: TRADITION_CODES, language_codes: ["en", "hi"], gita_jayanti_reading_reflection_only: true, mokshada_ekadashi_fast_parana_and_temple_vidhi_excluded: true, user_selected_or_attributable_edition_required: true };
type Source = { source_id: string; title: string; publisher: string; url: string | null; source_class: string; rights_lane: "reference_only" | "private_evidence" | "derivative_allowed"; artifact_sha256?: string };
type Guide = { guide_id: string; language_code: "en" | "hi"; title: string; summary: string; family_practice_note: string; context_prompts: string[]; tiers: Array<{ tier: "minimum" | "standard" | "elaborate"; label: string; estimated_minutes: number; materials: Array<{ item: string; substitutions: string[]; optional: boolean }>; steps: Array<{ ordinal: number; instruction: string; why: string; optional: boolean; source_ids: string[] }> }> };
type Pack = { contract: string; pack_id: string; editorial_status: "internal_beta_research_synthesis"; observance_slug: string; scope: Record<string, unknown>; sources: Source[]; guides: Guide[]; boundaries: Record<string, boolean> };

function hash(bytes: Buffer) { return createHash("sha256").update(bytes).digest("hex"); }

function loadPack(): Pack {
  const root = resolve(process.cwd(), "../..");
  const packBytes = readFileSync(resolve(root, "knowledge_packs/rituals/gita-jayanti-reading-reflection-v1.json"));
  const fixtureBytes = readFileSync(resolve(root, "knowledge_packs/panchang/gita-jayanti-2026-v1.json"));
  const ekadashiBytes = readFileSync(resolve(root, "knowledge_packs/panchang/ekadashi-delhi-mumbai-chennai-september-december-2026-v1.json"));
  const gretilBytes = readFileSync(resolve(root, "source_vault/objects/sha256/e1/e10352273ea29958205dbc72b7b81a0df95eb3623a0b6439141e3e2a2d54b505"));
  if (hash(packBytes) !== PACK_SHA256 || hash(fixtureBytes) !== FIXTURE_SHA256 || hash(ekadashiBytes) !== EKADASHI_FIXTURE_SHA256 || ekadashiBytes.length !== 16807 || hash(gretilBytes) !== GRETIL_SOURCE_SHA256 || gretilBytes.length !== 2056476) throw new Error("Gita Jayanti evidence fixity drift");
  const fixture = JSON.parse(fixtureBytes.toString("utf8"));
  const fixtureScope = fixture.scope;
  if (fixture.contract !== "DEVAM_GITA_JAYANTI_2026_EVIDENCE_FIXTURE_V1" || fixture.fixture_id !== "devam-gita-jayanti-2026-v1" || fixtureScope.observance_slug !== "mokshada-ekadashi" || fixtureScope.selected_civil_date !== "2026-12-20" || fixtureScope.target_tithi !== "Margashirsha Shukla Ekadashi" || fixtureScope.universal_india_date_or_procedure_claim !== false) throw new Error("Gita Jayanti fixture identity drift");
  if (fixture.sources.map((source: { source_id: string }) => source.source_id).join("|") !== "devam-ekadashi-date-fixture|utsav-international-geeta-mahotsav|kurukshetra-jyotisar-events|iitk-gita-supersite-introduction|incredible-india-iskcon-kolkata-geeta-jayanti|gretil-bhagavadgita-four-commentaries-tei") throw new Error("Gita Jayanti fixture source-universe drift");
  const fetches = fixture.sources.filter((source: { observed_fetch?: unknown }) => source.observed_fetch).map((source: { source_id: string; observed_fetch: { status: number; response_sha256: string; strict_utf8: boolean } }) => [source.source_id, source.observed_fetch.status, source.observed_fetch.response_sha256, source.observed_fetch.strict_utf8]);
  if (JSON.stringify(fetches) !== JSON.stringify([
    ["utsav-international-geeta-mahotsav", 200, "8eb680e77e02204b6a0b282354287bc3f89bc2f4ab1aaaa9dcfecba55778d5a7", true],
    ["kurukshetra-jyotisar-events", 200, "0cd58a16fc0a04b1df0ee8e53c7eb50bab4426aee06931815001987184c4a3f2", true],
    ["iitk-gita-supersite-introduction", 200, "95136b3e9e58fc8d17ff873c227d78260ef377d6cc0d75574ad9e35e9dd2ed99", true],
    ["incredible-india-iskcon-kolkata-geeta-jayanti", 200, "57b40a374956f86639e72b43ab50b008a2ed8553231002b93ccfd5abccd2cc76", true],
  ])) throw new Error("Gita Jayanti live-observation drift");
  const decision = fixture.decision;
  if (decision.selected_civil_date !== "2026-12-20" || decision.gita_jayanti_reading_reflection_may_be_offered !== true || decision.mokshada_ekadashi_fast_parana_or_temple_vidhi_included !== false || decision.reading_edition_must_be_user_selected_or_source_identified !== true || decision.commentary_interpretations_must_remain_attributable !== true || Object.values(fixture.denials).some((value) => value !== false)) throw new Error("Gita Jayanti decision or denial drift");
  const pack = JSON.parse(packBytes.toString("utf8")) as Pack;
  if (pack.contract !== "DEVAM_RITUAL_PROCEDURE_PACK_V1" || pack.pack_id !== "devam-gita-jayanti-reading-reflection-v1" || pack.observance_slug !== "mokshada-ekadashi" || JSON.stringify(pack.scope) !== JSON.stringify(EXPECTED_SCOPE) || pack.sources.map((source) => source.source_id).join("|") !== SOURCE_IDS.join("|") || pack.sources[0].artifact_sha256 !== FIXTURE_SHA256) throw new Error("Gita Jayanti practice identity drift");
  const sourceIds = new Set(SOURCE_IDS);
  if (pack.guides.map((guide) => guide.language_code).join("|") !== "en|hi") throw new Error("Gita Jayanti language drift");
  for (const guide of pack.guides) {
    if (guide.context_prompts.length !== 4 || guide.tiers.map((tier) => tier.tier).join("|") !== "minimum|standard|elaborate" || guide.tiers.map((tier) => tier.estimated_minutes).join("|") !== "10|30|90") throw new Error(`Gita Jayanti guide structure drift: ${guide.guide_id}`);
    for (const tier of guide.tiers) if (tier.materials.some((item) => item.substitutions.length === 0) || tier.steps.some((step, index) => step.ordinal !== index + 1 || step.source_ids.length === 0 || step.source_ids.some((id) => !sourceIds.has(id)))) throw new Error(`Gita Jayanti evidence drift: ${guide.guide_id}/${tier.tier}`);
  }
  const trueKeys = ["minimum_standard_elaborate_forms_included", "hindi_and_english_included", "substitutions_included", "family_context_prompts_included", "attributable_edition_and_commentary_boundaries_included", "actionable_reflection_included"];
  const falseKeys = ["gita_jayanti_and_every_mokshada_or_vaikuntha_ekadashi_procedure_merged", "one_translation_or_commentary_treated_as_universal", "complete_gita_recitation_required", "fast_or_dietary_regimen_prescribed", "parana_timing_served_by_this_guide", "ritual_bathing_deep_daan_puja_mantra_or_priestly_liturgy_instructed", "kurukshetra_travel_event_or_crowd_operations_served", "moksha_merit_success_clarity_or_other_outcome_guaranteed", "all_textual_recensions_translations_commentaries_and_traditions_complete", "source_text_returned_or_republished"];
  if (Object.keys(pack.boundaries).sort().join("|") !== [...trueKeys, ...falseKeys].sort().join("|") || trueKeys.some((key) => pack.boundaries[key] !== true) || falseKeys.some((key) => pack.boundaries[key] !== false)) throw new Error("Gita Jayanti practice boundary drift");
  return pack;
}

const pack = loadPack();

function supportedContext(request: PracticeGuidanceRequest) {
  if (!REGION_CODES.includes(request.regionCode) || !TRADITION_CODES.includes(request.traditionCode)) return false;
  if (request.traditionCode === "vaishnava-iskcon") return true;
  return request.regionCode === request.traditionCode.replace("smarta-", "");
}

export function resolveGitaJayantiProcedure(request: PracticeGuidanceRequest): RitualProcedureGuide | null {
  if (request.observanceSlug !== "mokshada-ekadashi" || !supportedContext(request)) return null;
  const guide = pack.guides.find((candidate) => candidate.language_code === request.languageCode);
  if (!guide) return null;
  return { guideId: guide.guide_id, companionToObservanceSlug: pack.observance_slug, title: guide.title, languageCode: guide.language_code, kind: "contextual_minimum_standard_elaborate_ritual_procedure", summary: guide.summary, familyPracticeNote: guide.family_practice_note, contextPrompts: [...guide.context_prompts], tiers: guide.tiers.map((tier) => ({ tier: tier.tier, label: tier.label, estimatedMinutes: tier.estimated_minutes, materials: tier.materials.map((item) => ({ ...item, substitutions: [...item.substitutions] })), steps: tier.steps.map((step) => ({ ordinal: step.ordinal, instruction: step.instruction, why: step.why, optional: step.optional, sourceIds: [...step.source_ids] })) })), companionReading: null, evidence: { packId: pack.pack_id, packFileSha256: PACK_SHA256, editorialStatus: pack.editorial_status, sourceTextReturnedByApi: false, sources: pack.sources.map((source) => ({ sourceId: source.source_id, title: source.title, publisher: source.publisher, url: source.url, sourceClass: source.source_class, rightsLane: source.rights_lane })) }, boundaries: { minimumStandardElaborateFormsIncluded: true, hindiAndEnglishIncluded: true, substitutionsIncluded: true, familyContextPromptsIncluded: true, formalPriestMantrasIncluded: false, historicalPrescriptionsPromotedAsModernNorms: false, oneUniversalProcedureClaimed: false, allRegionalVariantsComplete: false, allGaneshotsavDaysComplete: false, attributableEditionAndCommentaryBoundariesIncluded: true, actionableReflectionIncluded: true, gitaJayantiAndEveryMokshadaOrVaikunthaEkadashiProcedureMerged: false, oneTranslationOrCommentaryTreatedAsUniversal: false, completeGitaRecitationRequired: false, fastOrDietaryRegimenPrescribed: false, paranaTimingServedByThisGuide: false, ritualBathingDeepDaanPujaMantraOrPriestlyLiturgyInstructed: false, kurukshetraTravelEventOrCrowdOperationsServed: false, mokshaMeritSuccessClarityOrOtherOutcomeGuaranteed: false } };
}

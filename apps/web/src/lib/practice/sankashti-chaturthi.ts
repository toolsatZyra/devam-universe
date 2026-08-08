import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PracticeGuidanceRequest, RitualProcedureGuide, SourceBoundedPracticeGuide } from "../domain/practice";
import { resolveGaneshaReading } from "./ganesha-reading";

const PACK_SHA256 = "19cf87fe0be455f0bc4f8fdc0028b6511c03bbc1df71b563bafe680a9e248b50";
const FIXTURE_SHA256 = "d14c3552f4ff41bae44bc4cabf4c0f24265d5e099bcfe707f28349f248701944";
const GANESHA_PACK_SHA256 = "492bafe94124f81de32acee6329b798fe09970eace160bdd1a9db646d5959d2d";
const OBSERVANCE_SLUGS = ["sankashti-chaturthi-2026-09", "sankashti-chaturthi-2026-10", "sankashti-chaturthi-2026-11", "sankashti-chaturthi-2026-12"];
const SOURCE_IDS = ["devam-sankashti-date-and-practice-fixture", "siddhivinayak-trust-sankashti-dates", "maharashtra-tourism-ranjangaon-sankashti", "devam-ganesha-hymn-pack-v1", "devam-sankashti-safety-boundary"];
const EXPECTED_SCOPE = { region_codes: ["west-india"], tradition_codes: ["smarta-west-india"], language_codes: ["en", "hi"], september_december_2026_fixture_required: true, family_known_practice_overrides_generic_sequence: true, local_moonrise_must_come_from_runtime_not_provider_table: true, fasting_and_medical_guidance_excluded: true };
type Source = { source_id: string; title: string; publisher: string; url: string | null; source_class: string; rights_lane: "reference_only" | "derivative_allowed"; artifact_sha256?: string };
type Guide = { guide_id: string; language_code: "en" | "hi"; title: string; summary: string; family_practice_note: string; context_prompts: string[]; tiers: Array<{ tier: "minimum" | "standard" | "elaborate"; label: string; estimated_minutes: number; materials: Array<{ item: string; substitutions: string[]; optional: boolean }>; steps: Array<{ ordinal: number; instruction: string; why: string; optional: boolean; source_ids: string[] }> }> };
type Pack = { contract: string; pack_id: string; editorial_status: "internal_beta_research_synthesis"; observance_slugs: string[]; scope: Record<string, unknown>; sources: Source[]; guides: Guide[]; boundaries: Record<string, boolean> };

function loadPack(): Pack {
  const root = resolve(process.cwd(), "../..");
  const bytes = readFileSync(resolve(root, "knowledge_packs/rituals/sankashti-chaturthi-west-india-family-v1.json"));
  if (createHash("sha256").update(bytes).digest("hex") !== PACK_SHA256) throw new Error("Sankashti Chaturthi practice-pack drift");
  const pack = JSON.parse(bytes.toString("utf8")) as Pack;
  if (pack.contract !== "DEVAM_RECURRING_RITUAL_PROCEDURE_PACK_V1" || pack.pack_id !== "devam-sankashti-chaturthi-west-india-family-v1" || JSON.stringify(pack.observance_slugs) !== JSON.stringify(OBSERVANCE_SLUGS) || JSON.stringify(pack.scope) !== JSON.stringify(EXPECTED_SCOPE)) throw new Error("Sankashti Chaturthi practice identity drift");
  if (createHash("sha256").update(readFileSync(resolve(root, "knowledge_packs/panchang/sankashti-chaturthi-delhi-mumbai-september-december-2026-v1.json"))).digest("hex") !== FIXTURE_SHA256 || createHash("sha256").update(readFileSync(resolve(root, "knowledge_packs/ganesha/shriganapatimantraksharavali-v1.json"))).digest("hex") !== GANESHA_PACK_SHA256 || pack.sources.map((source) => source.source_id).join("|") !== SOURCE_IDS.join("|") || pack.sources[0].artifact_sha256 !== FIXTURE_SHA256 || pack.sources[3].artifact_sha256 !== GANESHA_PACK_SHA256) throw new Error("Sankashti Chaturthi practice source universe drift");
  const sourceIds = new Set(SOURCE_IDS);
  if (pack.guides.map((guide) => guide.language_code).join("|") !== "en|hi") throw new Error("Sankashti Chaturthi practice language drift");
  for (const guide of pack.guides) {
    if (guide.context_prompts.length !== 4 || guide.tiers.map((tier) => tier.tier).join("|") !== "minimum|standard|elaborate" || guide.tiers.map((tier) => tier.estimated_minutes).join("|") !== "10|30|60") throw new Error(`Sankashti Chaturthi guide structure drift: ${guide.guide_id}`);
    for (const tier of guide.tiers) if (tier.materials.some((item) => item.substitutions.length === 0) || tier.steps.some((step, index) => step.ordinal !== index + 1 || step.source_ids.length === 0 || step.source_ids.some((id) => !sourceIds.has(id)))) throw new Error(`Sankashti Chaturthi guide evidence drift: ${guide.guide_id}/${tier.tier}`);
  }
  const trueKeys = ["minimum_standard_elaborate_forms_included", "hindi_and_english_included", "substitutions_included", "family_context_prompts_included", "four_launch_month_observance_slugs_supported", "source_bounded_ganesha_companion_reading_included", "material_free_and_flame_free_fallback_supported", "runtime_location_specific_moonrise_used"];
  const falseKeys = ["fast_or_nirjala_regimen_prescribed", "medical_or_dietary_advice_given", "provider_city_moonrise_reused_for_user_location", "one_monthly_name_katha_or_puja_sequence_universalized", "moon_sighting_temple_visit_offering_mantra_arghya_or_food_required", "obstacle_removal_success_protection_merit_or_other_outcome_guaranteed", "ganesh_chaturthi_or_karwa_chauth_merged", "all_regional_family_temple_and_sampradaya_variants_complete"];
  if (Object.keys(pack.boundaries).sort().join("|") !== [...trueKeys, ...falseKeys].sort().join("|") || trueKeys.some((key) => pack.boundaries[key] !== true) || falseKeys.some((key) => pack.boundaries[key] !== false)) throw new Error("Sankashti Chaturthi practice boundary drift");
  return pack;
}

const pack = loadPack();

export function resolveSankashtiChaturthiProcedure(request: PracticeGuidanceRequest): RitualProcedureGuide | null {
  if (!OBSERVANCE_SLUGS.includes(request.observanceSlug) || request.regionCode !== "west-india" || request.traditionCode !== "smarta-west-india") return null;
  const guide = pack.guides.find((candidate) => candidate.language_code === request.languageCode);
  if (!guide) return null;
  const readingResult = resolveGaneshaReading(request);
  const companionReading = readingResult.status === "source_bounded_companion_available" ? readingResult.guide as SourceBoundedPracticeGuide : null;
  if (!companionReading) throw new Error("Sankashti Chaturthi companion reading unavailable");
  return { guideId: guide.guide_id, companionToObservanceSlug: request.observanceSlug, title: guide.title, languageCode: guide.language_code, kind: "contextual_minimum_standard_elaborate_ritual_procedure", summary: guide.summary, familyPracticeNote: guide.family_practice_note, contextPrompts: [...guide.context_prompts], tiers: guide.tiers.map((tier) => ({ tier: tier.tier, label: tier.label, estimatedMinutes: tier.estimated_minutes, materials: tier.materials.map((item) => ({ ...item, substitutions: [...item.substitutions] })), steps: tier.steps.map((step) => ({ ordinal: step.ordinal, instruction: step.instruction, why: step.why, optional: step.optional, sourceIds: [...step.source_ids] })) })), companionReading, evidence: { packId: pack.pack_id, packFileSha256: PACK_SHA256, editorialStatus: pack.editorial_status, sourceTextReturnedByApi: false, sources: pack.sources.map((source) => ({ sourceId: source.source_id, title: source.title, publisher: source.publisher, url: source.url, sourceClass: source.source_class, rightsLane: source.rights_lane })) }, boundaries: { minimumStandardElaborateFormsIncluded: true, hindiAndEnglishIncluded: true, substitutionsIncluded: true, familyContextPromptsIncluded: true, formalPriestMantrasIncluded: false, historicalPrescriptionsPromotedAsModernNorms: false, oneUniversalProcedureClaimed: false, allRegionalVariantsComplete: false, allGaneshotsavDaysComplete: false, fourLaunchMonthObservanceSlugsSupported: true, sourceBoundedGaneshaCompanionReadingIncluded: true, materialFreeAndFlameFreeFallbackSupported: true, runtimeLocationSpecificMoonriseUsed: true, fastOrNirjalaRegimenPrescribed: false, medicalOrDietaryAdviceGiven: false, providerCityMoonriseReusedForUserLocation: false, oneMonthlyNameKathaOrPujaSequenceUniversalized: false, moonSightingTempleVisitOfferingMantraArghyaOrFoodRequired: false, obstacleRemovalSuccessProtectionMeritOrOtherOutcomeGuaranteed: false, ganeshChaturthiOrKarwaChauthMerged: false } };
}

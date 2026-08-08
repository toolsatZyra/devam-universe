import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PracticeGuidanceRequest, RitualProcedureGuide } from "../domain/practice";

const PACK_SHA256 = "20e5158a3b0b5f7a1c590a2478f642af782635704f56ba34a36feaa1c4e322f7";
const FIXTURE_SHA256 = "84fb6f87eedb403c354312a414f6073b24b8a378c979e9da1a9b02f13921f1e8";
const SOURCE_IDS = ["devam-dev-deepawali-date-fixture", "incredible-india-dev-deepawali-identity", "incredible-india-dev-deepawali-ghats", "utsav-india-dev-deepawali", "devam-dev-deepawali-safety-boundary"];
const EXPECTED_SCOPE = { region_codes: ["kashi-varanasi"], tradition_codes: ["regional-kashi-varanasi"], language_codes: ["en", "hi"], varanasi_2026_date_fixture_required: true, current_local_authority_or_organizer_overrides_generic_public_event_guidance: true, water_boat_firework_and_crowd_operations_excluded: true };
type Source = { source_id: string; title: string; publisher: string; url: string | null; source_class: string; rights_lane: "reference_only" | "derivative_allowed"; artifact_sha256?: string };
type Guide = { guide_id: string; language_code: "en" | "hi"; title: string; summary: string; family_practice_note: string; context_prompts: string[]; tiers: Array<{ tier: "minimum" | "standard" | "elaborate"; label: string; estimated_minutes: number; materials: Array<{ item: string; substitutions: string[]; optional: boolean }>; steps: Array<{ ordinal: number; instruction: string; why: string; optional: boolean; source_ids: string[] }> }> };
type Pack = { contract: string; pack_id: string; editorial_status: "internal_beta_research_synthesis"; observance_slug: string; scope: Record<string, unknown>; sources: Source[]; guides: Guide[]; boundaries: Record<string, boolean> };

function loadPack(): Pack {
  const root = resolve(process.cwd(), "../..");
  const bytes = readFileSync(resolve(root, "knowledge_packs/rituals/dev-deepawali-varanasi-participation-v1.json"));
  if (createHash("sha256").update(bytes).digest("hex") !== PACK_SHA256) throw new Error("Varanasi Dev Deepawali practice-pack drift");
  const pack = JSON.parse(bytes.toString("utf8")) as Pack;
  if (pack.contract !== "DEVAM_RITUAL_PROCEDURE_PACK_V1" || pack.pack_id !== "devam-dev-deepawali-varanasi-participation-v1" || pack.observance_slug !== "dev-deepawali-varanasi" || JSON.stringify(pack.scope) !== JSON.stringify(EXPECTED_SCOPE)) throw new Error("Varanasi Dev Deepawali practice identity drift");
  if (createHash("sha256").update(readFileSync(resolve(root, "knowledge_packs/panchang/dev-deepawali-varanasi-2026-v1.json"))).digest("hex") !== FIXTURE_SHA256 || pack.sources.map((source) => source.source_id).join("|") !== SOURCE_IDS.join("|") || pack.sources[0].artifact_sha256 !== FIXTURE_SHA256) throw new Error("Varanasi Dev Deepawali practice source drift");
  const sourceIds = new Set(SOURCE_IDS);
  if (pack.guides.map((guide) => guide.language_code).join("|") !== "en|hi") throw new Error("Varanasi Dev Deepawali language drift");
  for (const guide of pack.guides) {
    if (guide.context_prompts.length !== 4 || guide.tiers.map((tier) => tier.tier).join("|") !== "minimum|standard|elaborate" || guide.tiers.map((tier) => tier.estimated_minutes).join("|") !== "10|30|60") throw new Error(`Varanasi Dev Deepawali guide structure drift: ${guide.guide_id}`);
    for (const tier of guide.tiers) if (tier.materials.some((item) => item.substitutions.length === 0) || tier.steps.some((step, index) => step.ordinal !== index + 1 || step.source_ids.length === 0 || step.source_ids.some((id) => !sourceIds.has(id)))) throw new Error(`Varanasi Dev Deepawali evidence drift: ${guide.guide_id}/${tier.tier}`);
  }
  const trueKeys = ["minimum_standard_elaborate_forms_included", "hindi_and_english_included", "substitutions_included", "family_context_prompts_included", "flame_free_home_form_supported", "varanasi_full_moon_ghat_light_and_story_variant_supported"];
  const falseKeys = ["generic_kartika_purnima_or_baps_dev_diwali_merged", "ritual_bathing_or_water_entry_instructed", "floating_lamps_or_river_offerings_instructed", "unattended_flame_or_fireworks_recommended", "boat_booking_crowd_route_access_or_travel_advice_given", "formal_ganga_aarti_puja_mantra_or_priest_liturgy_included", "fast_or_dietary_regimen_prescribed", "sin_removal_purification_merit_protection_or_outcome_guaranteed", "one_universal_kartika_purnima_or_dev_diwali_procedure_claimed", "all_varanasi_temple_ghat_family_and_regional_variants_complete"];
  if (Object.keys(pack.boundaries).sort().join("|") !== [...trueKeys, ...falseKeys].sort().join("|") || trueKeys.some((key) => pack.boundaries[key] !== true) || falseKeys.some((key) => pack.boundaries[key] !== false)) throw new Error("Varanasi Dev Deepawali practice boundary drift");
  return pack;
}

const pack = loadPack();

export function resolveDevDeepawaliProcedure(request: PracticeGuidanceRequest): RitualProcedureGuide | null {
  if (request.observanceSlug !== "dev-deepawali-varanasi" || request.regionCode !== "kashi-varanasi" || request.traditionCode !== "regional-kashi-varanasi") return null;
  const guide = pack.guides.find((candidate) => candidate.language_code === request.languageCode);
  if (!guide) return null;
  return { guideId: guide.guide_id, companionToObservanceSlug: pack.observance_slug, title: guide.title, languageCode: guide.language_code, kind: "contextual_minimum_standard_elaborate_ritual_procedure", summary: guide.summary, familyPracticeNote: guide.family_practice_note, contextPrompts: [...guide.context_prompts], tiers: guide.tiers.map((tier) => ({ tier: tier.tier, label: tier.label, estimatedMinutes: tier.estimated_minutes, materials: tier.materials.map((item) => ({ ...item, substitutions: [...item.substitutions] })), steps: tier.steps.map((step) => ({ ordinal: step.ordinal, instruction: step.instruction, why: step.why, optional: step.optional, sourceIds: [...step.source_ids] })) })), companionReading: null, evidence: { packId: pack.pack_id, packFileSha256: PACK_SHA256, editorialStatus: pack.editorial_status, sourceTextReturnedByApi: false, sources: pack.sources.map((source) => ({ sourceId: source.source_id, title: source.title, publisher: source.publisher, url: source.url, sourceClass: source.source_class, rightsLane: source.rights_lane })) }, boundaries: { minimumStandardElaborateFormsIncluded: true, hindiAndEnglishIncluded: true, substitutionsIncluded: true, familyContextPromptsIncluded: true, formalPriestMantrasIncluded: false, historicalPrescriptionsPromotedAsModernNorms: false, oneUniversalProcedureClaimed: false, allRegionalVariantsComplete: false, allGaneshotsavDaysComplete: false, flameFreeHomeFormSupported: true, varanasiFullMoonGhatLightAndStoryVariantSupported: true, genericKartikaPurnimaOrBapsDevDiwaliMerged: false, ritualBathingOrWaterEntryInstructed: false, floatingLampsOrRiverOfferingsInstructed: false, unattendedFlameOrFireworksRecommended: false, boatBookingCrowdRouteAccessOrTravelAdviceGiven: false, formalGangaAartiPujaMantraOrPriestLiturgyIncluded: false, fastOrDietaryRegimenPrescribed: false, sinRemovalPurificationMeritProtectionOrOutcomeGuaranteed: false } };
}

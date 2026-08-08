import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PracticeGuidanceRequest, RitualProcedureGuide } from "../domain/practice";

const PACK_SHA256 = "93306a99d5f2865fe63022bf76802d92130120c8dc2b6a55d7d6f9e3d22dc5ad";
const FIXTURE_SHA256 = "2378195e40a1cd93e0a0f700e1903ecf8bedea665a711b95eaa9a27fcdb09fcc";
const SOURCE_IDS = ["devam-balipadyami-date-fixture", "karnataka-tourism-deepavali-balipratipada", "akashvani-karnataka-bali-padyami", "iskcon-bangalore-public-calendar-2026-balipadyami", "devam-balipadyami-safety-boundary"];
const EXPECTED_SCOPE = { region_codes: ["south-india"], tradition_codes: ["smarta-south-india"], language_codes: ["en", "hi"], bengaluru_2026_date_fixture_required: true, karnataka_family_or_temple_participation_only: true, family_or_temple_custom_overrides_generic_sequence: true, bali_representation_optional_only_when_already_known: true, maharashtra_padwa_baps_new_year_and_govardhana_not_merged: true };
type Source = { source_id: string; title: string; publisher: string; url: string | null; source_class: string; rights_lane: "reference_only" | "derivative_allowed"; artifact_sha256?: string };
type Guide = { guide_id: string; language_code: "en" | "hi"; title: string; summary: string; family_practice_note: string; context_prompts: string[]; tiers: Array<{ tier: "minimum" | "standard" | "elaborate"; label: string; estimated_minutes: number; materials: Array<{ item: string; substitutions: string[]; optional: boolean }>; steps: Array<{ ordinal: number; instruction: string; why: string; optional: boolean; source_ids: string[] }> }> };
type Pack = { contract: string; pack_id: string; editorial_status: "internal_beta_research_synthesis"; observance_slug: string; scope: Record<string, unknown>; sources: Source[]; guides: Guide[]; boundaries: Record<string, boolean> };

function loadPack(): Pack {
  const root = resolve(process.cwd(), "../..");
  const bytes = readFileSync(resolve(root, "knowledge_packs/rituals/balipadyami-karnataka-family-v1.json"));
  if (createHash("sha256").update(bytes).digest("hex") !== PACK_SHA256) throw new Error("Balipadyami practice-pack drift");
  const pack = JSON.parse(bytes.toString("utf8")) as Pack;
  if (pack.contract !== "DEVAM_RITUAL_PROCEDURE_PACK_V1" || pack.pack_id !== "devam-balipadyami-karnataka-family-v1" || pack.observance_slug !== "karnataka-balipadyami" || JSON.stringify(pack.scope) !== JSON.stringify(EXPECTED_SCOPE)) throw new Error("Balipadyami practice identity drift");
  if (createHash("sha256").update(readFileSync(resolve(root, "knowledge_packs/panchang/balipadyami-bengaluru-2026-v1.json"))).digest("hex") !== FIXTURE_SHA256 || pack.sources.map((source) => source.source_id).join("|") !== SOURCE_IDS.join("|") || pack.sources[0].artifact_sha256 !== FIXTURE_SHA256) throw new Error("Balipadyami source universe drift");
  const sourceIds = new Set(SOURCE_IDS);
  if (pack.guides.map((guide) => guide.language_code).join("|") !== "en|hi") throw new Error("Balipadyami language drift");
  for (const guide of pack.guides) {
    if (guide.context_prompts.length !== 4 || guide.tiers.map((tier) => tier.tier).join("|") !== "minimum|standard|elaborate" || guide.tiers.map((tier) => tier.estimated_minutes).join("|") !== "10|30|75") throw new Error(`Balipadyami guide structure drift: ${guide.guide_id}`);
    for (const tier of guide.tiers) if (tier.materials.some((item) => item.substitutions.length === 0) || tier.steps.some((step, index) => step.ordinal !== index + 1 || step.source_ids.length === 0 || step.source_ids.some((id) => !sourceIds.has(id)))) throw new Error(`Balipadyami evidence drift: ${guide.guide_id}/${tier.tier}`);
  }
  const trueKeys = ["minimum_standard_elaborate_forms_included", "hindi_and_english_included", "substitutions_included", "family_context_prompts_included", "bali_vamana_remembrance_generosity_and_family_service_supported", "material_free_and_flame_free_fallback_supported"];
  const falseKeys = ["formal_temple_abhisheka_or_mantras_included", "clay_or_cow_dung_bali_representation_required", "real_lamps_or_large_light_display_required", "fast_food_gift_purchase_or_special_clothing_prescribed", "prosperity_or_welfare_guaranteed", "maharashtra_bali_pratipada_merged", "baps_gujarati_new_year_merged", "govardhana_puja_merged", "one_universal_karnataka_or_south_india_procedure_claimed", "all_karnataka_coastal_and_family_variants_complete"];
  if (Object.keys(pack.boundaries).sort().join("|") !== [...trueKeys, ...falseKeys].sort().join("|") || trueKeys.some((key) => pack.boundaries[key] !== true) || falseKeys.some((key) => pack.boundaries[key] !== false)) throw new Error("Balipadyami boundary drift");
  return pack;
}

const pack = loadPack();

export function resolveBalipadyamiProcedure(request: PracticeGuidanceRequest): RitualProcedureGuide | null {
  if (request.observanceSlug !== "karnataka-balipadyami" || request.regionCode !== "south-india" || request.traditionCode !== "smarta-south-india") return null;
  const guide = pack.guides.find((candidate) => candidate.language_code === request.languageCode);
  if (!guide) return null;
  return { guideId: guide.guide_id, companionToObservanceSlug: pack.observance_slug, title: guide.title, languageCode: guide.language_code, kind: "contextual_minimum_standard_elaborate_ritual_procedure", summary: guide.summary, familyPracticeNote: guide.family_practice_note, contextPrompts: [...guide.context_prompts], tiers: guide.tiers.map((tier) => ({ tier: tier.tier, label: tier.label, estimatedMinutes: tier.estimated_minutes, materials: tier.materials.map((item) => ({ ...item, substitutions: [...item.substitutions] })), steps: tier.steps.map((step) => ({ ordinal: step.ordinal, instruction: step.instruction, why: step.why, optional: step.optional, sourceIds: [...step.source_ids] })) })), companionReading: null, evidence: { packId: pack.pack_id, packFileSha256: PACK_SHA256, editorialStatus: pack.editorial_status, sourceTextReturnedByApi: false, sources: pack.sources.map((source) => ({ sourceId: source.source_id, title: source.title, publisher: source.publisher, url: source.url, sourceClass: source.source_class, rightsLane: source.rights_lane })) }, boundaries: { minimumStandardElaborateFormsIncluded: true, hindiAndEnglishIncluded: true, substitutionsIncluded: true, familyContextPromptsIncluded: true, formalPriestMantrasIncluded: false, historicalPrescriptionsPromotedAsModernNorms: false, oneUniversalProcedureClaimed: false, allRegionalVariantsComplete: false, allGaneshotsavDaysComplete: false, baliVamanaRemembranceGenerosityAndFamilyServiceSupported: true, materialFreeAndFlameFreeFallbackSupported: true, formalTempleAbhishekaOrMantrasIncluded: false, clayOrCowDungBaliRepresentationRequired: false, realLampsOrLargeLightDisplayRequired: false, fastFoodGiftPurchaseOrSpecialClothingPrescribed: false, prosperityOrWelfareGuaranteed: false, maharashtraBaliPratipadaMerged: false, bapsGujaratiNewYearMerged: false, govardhanaPujaMerged: false } };
}

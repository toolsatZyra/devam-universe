import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PracticeGuidanceRequest, RitualProcedureGuide } from "../domain/practice";

const PACK_SHA256 = "88dddb92d3bf9ab43ba40125e4475581faf408f1755d497df64e3810a58eacc8";
const FIXTURE_SHA256 = "fa33540adba85a7e4e79b454d98c80677c0b7c92b0e557a26ea6168b7f038257";
const SOURCE_IDS = ["devam-tulasi-vivah-date-fixture", "incredible-india-tulsi-vivah", "drikpanchang-tulasi-vivah", "baps-tulsi-vivah-sequence", "devam-tulasi-vivah-safety-boundary"];
type Source = { source_id: string; title: string; publisher: string; url: string | null; source_class: string; rights_lane: "reference_only" | "derivative_allowed"; artifact_sha256?: string };
type Guide = { guide_id: string; lane_code: "general" | "baps"; language_code: "en" | "hi"; title: string; summary: string; family_practice_note: string; context_prompts: string[]; tiers: Array<{ tier: "minimum" | "standard" | "elaborate"; label: string; estimated_minutes: number; materials: Array<{ item: string; substitutions: string[]; optional: boolean }>; steps: Array<{ ordinal: number; instruction: string; why: string; optional: boolean; source_ids: string[] }> }> };
type Pack = { contract: string; pack_id: string; editorial_status: "internal_beta_research_synthesis"; observance_slugs: string[]; scope: Record<string, unknown>; sources: Source[]; guides: Guide[]; boundaries: Record<string, boolean> };

function loadPack(): Pack {
  const root = resolve(process.cwd(), "../..");
  const bytes = readFileSync(resolve(root, "knowledge_packs/rituals/tulasi-vivah-participation-v1.json"));
  if (createHash("sha256").update(bytes).digest("hex") !== PACK_SHA256) throw new Error("Tulasi Vivah practice-pack drift");
  const pack = JSON.parse(bytes.toString("utf8")) as Pack;
  if (pack.contract !== "DEVAM_MULTI_LANE_RITUAL_PROCEDURE_PACK_V1" || pack.pack_id !== "devam-tulasi-vivah-participation-v1" || pack.observance_slugs.join("|") !== "tulasi-vivah-dwadashi|tulsi-vivah-baps-begins|tulsi-vivah-baps-samapt") throw new Error("Tulasi Vivah practice identity drift");
  if (createHash("sha256").update(readFileSync(resolve(root, "knowledge_packs/panchang/tulasi-vivah-2026-v1.json"))).digest("hex") !== FIXTURE_SHA256 || pack.sources.map((source) => source.source_id).join("|") !== SOURCE_IDS.join("|") || pack.sources[0].artifact_sha256 !== FIXTURE_SHA256) throw new Error("Tulasi Vivah practice source drift");
  const sourceIds = new Set(SOURCE_IDS);
  if (pack.guides.map((guide) => `${guide.lane_code}:${guide.language_code}`).join("|") !== "general:en|general:hi|baps:en|baps:hi") throw new Error("Tulasi Vivah guide universe drift");
  for (const guide of pack.guides) {
    if (guide.context_prompts.length !== 4 || guide.tiers.map((tier) => tier.tier).join("|") !== "minimum|standard|elaborate" || guide.tiers.map((tier) => tier.estimated_minutes).join("|") !== "10|30|60") throw new Error(`Tulasi Vivah guide structure drift: ${guide.guide_id}`);
    for (const tier of guide.tiers) if (tier.materials.some((item) => item.substitutions.length === 0) || tier.steps.some((step, index) => step.ordinal !== index + 1 || step.source_ids.length === 0 || step.source_ids.some((id) => !sourceIds.has(id)))) throw new Error(`Tulasi Vivah evidence drift: ${guide.guide_id}/${tier.tier}`);
  }
  const trueKeys = ["minimum_standard_elaborate_forms_included", "hindi_and_english_included", "substitutions_included", "family_context_prompts_included", "general_and_baps_lanes_separate", "plant_free_and_flame_free_fallback_supported"];
  const falseKeys = ["formal_priest_mantra_sankalpa_kanyadan_or_wedding_liturgy_included", "fast_or_dietary_regimen_prescribed", "medical_herbal_fertility_marriage_or_prosperity_advice_given", "plant_plucking_pruning_ingestion_overwatering_or_chemical_decoration_instructed", "purchase_gift_dowry_new_plant_or_new_image_required", "real_world_marriage_or_gender_role_prescribed", "outcome_guaranteed", "one_universal_tulasi_vivah_date_or_procedure_claimed", "all_regional_family_temple_vaishnava_smarta_and_baps_variants_complete"];
  if (Object.keys(pack.boundaries).sort().join("|") !== [...trueKeys, ...falseKeys].sort().join("|") || trueKeys.some((key) => pack.boundaries[key] !== true) || falseKeys.some((key) => pack.boundaries[key] !== false)) throw new Error("Tulasi Vivah practice boundary drift");
  return pack;
}

const pack = loadPack();

export function resolveTulasiVivahProcedure(request: PracticeGuidanceRequest): RitualProcedureGuide | null {
  const general = request.observanceSlug === "tulasi-vivah-dwadashi"
    && ((request.regionCode === "north-india" && request.traditionCode === "smarta-north-india") || (request.regionCode === "west-india" && request.traditionCode === "smarta-west-india"));
  const baps = (request.observanceSlug === "tulsi-vivah-baps-begins" || request.observanceSlug === "tulsi-vivah-baps-samapt")
    && request.regionCode === "baps-gujarat" && request.traditionCode === "swaminarayan-baps";
  if (!general && !baps) return null;
  const guide = pack.guides.find((candidate) => candidate.lane_code === (baps ? "baps" : "general") && candidate.language_code === request.languageCode);
  if (!guide) return null;
  return {
    guideId: guide.guide_id,
    companionToObservanceSlug: request.observanceSlug,
    title: guide.title,
    languageCode: guide.language_code,
    kind: "contextual_minimum_standard_elaborate_ritual_procedure",
    summary: guide.summary,
    familyPracticeNote: guide.family_practice_note,
    contextPrompts: [...guide.context_prompts],
    tiers: guide.tiers.map((tier) => ({ tier: tier.tier, label: tier.label, estimatedMinutes: tier.estimated_minutes, materials: tier.materials.map((item) => ({ ...item, substitutions: [...item.substitutions] })), steps: tier.steps.map((step) => ({ ordinal: step.ordinal, instruction: step.instruction, why: step.why, optional: step.optional, sourceIds: [...step.source_ids] })) })),
    companionReading: null,
    evidence: { packId: pack.pack_id, packFileSha256: PACK_SHA256, editorialStatus: pack.editorial_status, sourceTextReturnedByApi: false, sources: pack.sources.map((source) => ({ sourceId: source.source_id, title: source.title, publisher: source.publisher, url: source.url, sourceClass: source.source_class, rightsLane: source.rights_lane })) },
    boundaries: { minimumStandardElaborateFormsIncluded: true, hindiAndEnglishIncluded: true, substitutionsIncluded: true, familyContextPromptsIncluded: true, formalPriestMantrasIncluded: false, historicalPrescriptionsPromotedAsModernNorms: false, oneUniversalProcedureClaimed: false, allRegionalVariantsComplete: false, allGaneshotsavDaysComplete: false, generalAndBapsLanesSeparate: true, plantFreeAndFlameFreeFallbackSupported: true, formalPriestMantraSankalpaKanyadanOrWeddingLiturgyIncluded: false, fastOrDietaryRegimenPrescribed: false, medicalHerbalFertilityMarriageOrProsperityAdviceGiven: false, plantPluckingPruningIngestionOverwateringOrChemicalDecorationInstructed: false, purchaseGiftDowryNewPlantOrNewImageRequired: false, realWorldMarriageOrGenderRolePrescribed: false, outcomeGuaranteed: false, oneUniversalTulasiVivahDateOrProcedureClaimed: false },
  };
}

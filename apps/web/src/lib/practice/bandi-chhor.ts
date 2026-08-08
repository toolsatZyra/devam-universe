import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PracticeGuidanceRequest, RitualProcedureGuide } from "../domain/practice";

const PACK_SHA256 = "3653b6ad96a2237830ca94bbe9e25cfffb4c50119c294f87e24742ff42f50388";
const FIXTURE_SHA256 = "01536637248ca6fe97b426ffc1bc6e42f7e33e611c0d461e59f40a46b6573a7b";
const SOURCE_IDS = ["devam-bandi-chhor-date-fixture", "sgpc-bandi-chhor-identity", "baru-sahib-bandi-chhor-history", "devam-bandi-chhor-safety-boundary"];
const EXPECTED_SCOPE = { region_codes: ["sikh-punjab"], tradition_codes: ["sikh-sgpc"], language_codes: ["en", "hi"], sgpc_2026_date_fixture_required: true, family_or_gurdwara_participation_only: true, local_gurdwara_or_family_programme_overrides_generic_sequence: true, hindu_and_jain_diwali_lanes_not_merged: true };
type Source = { source_id: string; title: string; publisher: string; url: string | null; source_class: string; rights_lane: "reference_only" | "derivative_allowed"; artifact_sha256?: string };
type Guide = { guide_id: string; language_code: "en" | "hi"; title: string; summary: string; family_practice_note: string; context_prompts: string[]; tiers: Array<{ tier: "minimum" | "standard" | "elaborate"; label: string; estimated_minutes: number; materials: Array<{ item: string; substitutions: string[]; optional: boolean }>; steps: Array<{ ordinal: number; instruction: string; why: string; optional: boolean; source_ids: string[] }> }> };
type Pack = { contract: string; pack_id: string; editorial_status: "internal_beta_research_synthesis"; observance_slug: string; scope: Record<string, unknown>; sources: Source[]; guides: Guide[]; boundaries: Record<string, boolean> };

function loadPack(): Pack {
  const root = resolve(process.cwd(), "../..");
  const bytes = readFileSync(resolve(root, "knowledge_packs/rituals/bandi-chhor-sgpc-participation-v1.json"));
  if (createHash("sha256").update(bytes).digest("hex") !== PACK_SHA256) throw new Error("Bandi Chhor practice-pack drift");
  const pack = JSON.parse(bytes.toString("utf8")) as Pack;
  if (pack.contract !== "DEVAM_RITUAL_PROCEDURE_PACK_V1" || pack.pack_id !== "devam-bandi-chhor-sgpc-participation-v1" || pack.observance_slug !== "bandi-chhor-divas-sgpc" || JSON.stringify(pack.scope) !== JSON.stringify(EXPECTED_SCOPE)) throw new Error("Bandi Chhor practice identity drift");
  if (createHash("sha256").update(readFileSync(resolve(root, "knowledge_packs/panchang/bandi-chhor-amritsar-2026-v1.json"))).digest("hex") !== FIXTURE_SHA256 || pack.sources.map((source) => source.source_id).join("|") !== SOURCE_IDS.join("|") || pack.sources[0].artifact_sha256 !== FIXTURE_SHA256) throw new Error("Bandi Chhor source universe drift");
  const sourceIds = new Set(SOURCE_IDS);
  if (pack.guides.map((guide) => guide.language_code).join("|") !== "en|hi") throw new Error("Bandi Chhor language drift");
  for (const guide of pack.guides) {
    if (guide.context_prompts.length !== 4 || guide.tiers.map((tier) => tier.tier).join("|") !== "minimum|standard|elaborate" || guide.tiers.map((tier) => tier.estimated_minutes).join("|") !== "10|30|60") throw new Error(`Bandi Chhor guide structure drift: ${guide.guide_id}`);
    for (const tier of guide.tiers) if (tier.materials.some((item) => item.substitutions.length === 0) || tier.steps.some((step, index) => step.ordinal !== index + 1 || step.source_ids.length === 0 || step.source_ids.some((id) => !sourceIds.has(id)))) throw new Error(`Bandi Chhor evidence drift: ${guide.guide_id}/${tier.tier}`);
  }
  const trueKeys = ["minimum_standard_elaborate_forms_included", "hindi_and_english_included", "substitutions_included", "family_context_prompts_included", "guru_hargobind_52_rulers_and_collective_freedom_supported", "material_free_and_flame_free_fallback_supported"];
  const falseKeys = ["formal_paath_kirtan_ardas_hukamnama_or_gurdwara_programme_included", "langar_preparation_or_food_handling_prescribed", "real_lights_candles_or_fireworks_required", "donation_purchase_or_special_clothing_required", "spiritual_merit_protection_or_success_guaranteed", "hindu_diwali_merged", "jain_diwali_merged", "one_universal_sikh_procedure_claimed", "all_sikh_institution_family_and_diaspora_variants_complete"];
  if (Object.keys(pack.boundaries).sort().join("|") !== [...trueKeys, ...falseKeys].sort().join("|") || trueKeys.some((key) => pack.boundaries[key] !== true) || falseKeys.some((key) => pack.boundaries[key] !== false)) throw new Error("Bandi Chhor boundary drift");
  return pack;
}

const pack = loadPack();

export function resolveBandiChhorProcedure(request: PracticeGuidanceRequest): RitualProcedureGuide | null {
  if (request.observanceSlug !== "bandi-chhor-divas-sgpc" || request.regionCode !== "sikh-punjab" || request.traditionCode !== "sikh-sgpc") return null;
  const guide = pack.guides.find((candidate) => candidate.language_code === request.languageCode);
  if (!guide) return null;
  return { guideId: guide.guide_id, companionToObservanceSlug: pack.observance_slug, title: guide.title, languageCode: guide.language_code, kind: "contextual_minimum_standard_elaborate_ritual_procedure", summary: guide.summary, familyPracticeNote: guide.family_practice_note, contextPrompts: [...guide.context_prompts], tiers: guide.tiers.map((tier) => ({ tier: tier.tier, label: tier.label, estimatedMinutes: tier.estimated_minutes, materials: tier.materials.map((item) => ({ ...item, substitutions: [...item.substitutions] })), steps: tier.steps.map((step) => ({ ordinal: step.ordinal, instruction: step.instruction, why: step.why, optional: step.optional, sourceIds: [...step.source_ids] })) })), companionReading: null, evidence: { packId: pack.pack_id, packFileSha256: PACK_SHA256, editorialStatus: pack.editorial_status, sourceTextReturnedByApi: false, sources: pack.sources.map((source) => ({ sourceId: source.source_id, title: source.title, publisher: source.publisher, url: source.url, sourceClass: source.source_class, rightsLane: source.rights_lane })) }, boundaries: { minimumStandardElaborateFormsIncluded: true, hindiAndEnglishIncluded: true, substitutionsIncluded: true, familyContextPromptsIncluded: true, formalPriestMantrasIncluded: false, historicalPrescriptionsPromotedAsModernNorms: false, oneUniversalProcedureClaimed: false, allRegionalVariantsComplete: false, allGaneshotsavDaysComplete: false, guruHargobind52RulersAndCollectiveFreedomSupported: true, materialFreeAndFlameFreeFallbackSupported: true, formalPaathKirtanArdasHukamnamaOrGurdwaraProgrammeIncluded: false, langarPreparationOrFoodHandlingPrescribed: false, realLightsCandlesOrFireworksRequired: false, donationPurchaseOrSpecialClothingRequired: false, spiritualMeritProtectionOrSuccessGuaranteed: false, hinduDiwaliMerged: false, jainDiwaliMerged: false } };
}

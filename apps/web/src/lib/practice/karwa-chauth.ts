import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PracticeGuidanceRequest, RitualProcedureGuide } from "../domain/practice";

const PACK_SHA256 = "1ccecf2208f19190ae7481bc7cf6a4ad5da1ec23f42b75c2c0bc4db7b77db0e1";
const FIXTURE_SHA256 = "c04a1d84ce766c312bb7e40c60025ceb01eb5cb5da7a3f6ccdb03e293ab53591";
const SOURCE_IDS = ["devam-karwa-chauth-date-and-practice-fixture", "incredible-india-karva-chauth-context", "devam-karwa-chauth-safety-boundary"];
const EXPECTED_SCOPE = { region_codes: ["north-india"], tradition_codes: ["smarta-north-india"], language_codes: ["en", "hi"], delhi_2026_date_fixture_required: true, family_known_practice_overrides_generic_sequence: true, punjab_and_uttar_pradesh_variants_remain_distinct: true, fasting_and_medical_guidance_excluded: true };
type Source = { source_id: string; title: string; publisher: string; url: string | null; source_class: string; rights_lane: "reference_only" | "derivative_allowed"; artifact_sha256?: string };
type Guide = { guide_id: string; language_code: "en" | "hi"; title: string; summary: string; family_practice_note: string; context_prompts: string[]; tiers: Array<{ tier: "minimum" | "standard" | "elaborate"; label: string; estimated_minutes: number; materials: Array<{ item: string; substitutions: string[]; optional: boolean }>; steps: Array<{ ordinal: number; instruction: string; why: string; optional: boolean; source_ids: string[] }> }> };
type Pack = { contract: string; pack_id: string; editorial_status: "internal_beta_research_synthesis"; observance_slug: string; scope: Record<string, unknown>; sources: Source[]; guides: Guide[]; boundaries: Record<string, boolean> };

function loadPack(): Pack {
  const root = resolve(process.cwd(), "../..");
  const bytes = readFileSync(resolve(root, "knowledge_packs/rituals/karwa-chauth-north-india-family-v1.json"));
  if (createHash("sha256").update(bytes).digest("hex") !== PACK_SHA256) throw new Error("Karwa Chauth practice-pack drift");
  const pack = JSON.parse(bytes.toString("utf8")) as Pack;
  if (pack.contract !== "DEVAM_RITUAL_PROCEDURE_PACK_V1" || pack.pack_id !== "devam-karwa-chauth-north-india-family-v1" || pack.observance_slug !== "karwa-chauth" || JSON.stringify(pack.scope) !== JSON.stringify(EXPECTED_SCOPE)) throw new Error("Karwa Chauth practice identity drift");
  if (createHash("sha256").update(readFileSync(resolve(root, "knowledge_packs/panchang/karwa-chauth-delhi-north-india-2026-v1.json"))).digest("hex") !== FIXTURE_SHA256 || pack.sources.map((source) => source.source_id).join("|") !== SOURCE_IDS.join("|") || pack.sources[0].artifact_sha256 !== FIXTURE_SHA256) throw new Error("Karwa Chauth practice source universe drift");
  const sourceIds = new Set(SOURCE_IDS);
  if (pack.guides.map((guide) => guide.language_code).join("|") !== "en|hi") throw new Error("Karwa Chauth practice language drift");
  for (const guide of pack.guides) {
    if (guide.context_prompts.length !== 4 || guide.tiers.map((tier) => tier.tier).join("|") !== "minimum|standard|elaborate" || guide.tiers.map((tier) => tier.estimated_minutes).join("|") !== "10|30|60") throw new Error(`Karwa Chauth guide structure drift: ${guide.guide_id}`);
    for (const tier of guide.tiers) if (tier.materials.some((item) => item.substitutions.length === 0) || tier.steps.some((step, index) => step.ordinal !== index + 1 || step.source_ids.length === 0 || step.source_ids.some((id) => !sourceIds.has(id)))) throw new Error(`Karwa Chauth guide evidence drift: ${guide.guide_id}/${tier.tier}`);
  }
  const trueKeys = ["minimum_standard_elaborate_forms_included", "hindi_and_english_included", "substitutions_included", "family_context_prompts_included", "reciprocal_and_wider_family_participation_supported", "material_free_and_flame_free_fallback_supported", "punjab_and_uttar_pradesh_variants_remain_distinct"];
  const falseKeys = ["fast_or_nirjala_regimen_prescribed", "medical_or_dietary_advice_given", "women_only_participation_universalized", "married_household_only_participation_required", "formal_sankalpa_mantra_katha_arghya_or_puja_sequence_included", "sargi_bayaa_thali_sieve_arghya_or_spouse_fed_close_required", "gift_purchase_special_clothing_or_spending_required", "spouse_longevity_health_marriage_protection_merit_or_success_guaranteed", "one_universal_north_india_procedure_claimed", "all_regional_family_and_community_variants_complete"];
  if (Object.keys(pack.boundaries).sort().join("|") !== [...trueKeys, ...falseKeys].sort().join("|") || trueKeys.some((key) => pack.boundaries[key] !== true) || falseKeys.some((key) => pack.boundaries[key] !== false)) throw new Error("Karwa Chauth practice boundary drift");
  return pack;
}

const pack = loadPack();

export function resolveKarwaChauthProcedure(request: PracticeGuidanceRequest): RitualProcedureGuide | null {
  if (request.observanceSlug !== "karwa-chauth" || request.regionCode !== "north-india" || request.traditionCode !== "smarta-north-india") return null;
  const guide = pack.guides.find((candidate) => candidate.language_code === request.languageCode);
  if (!guide) return null;
  return { guideId: guide.guide_id, companionToObservanceSlug: pack.observance_slug, title: guide.title, languageCode: guide.language_code, kind: "contextual_minimum_standard_elaborate_ritual_procedure", summary: guide.summary, familyPracticeNote: guide.family_practice_note, contextPrompts: [...guide.context_prompts], tiers: guide.tiers.map((tier) => ({ tier: tier.tier, label: tier.label, estimatedMinutes: tier.estimated_minutes, materials: tier.materials.map((item) => ({ ...item, substitutions: [...item.substitutions] })), steps: tier.steps.map((step) => ({ ordinal: step.ordinal, instruction: step.instruction, why: step.why, optional: step.optional, sourceIds: [...step.source_ids] })) })), companionReading: null, evidence: { packId: pack.pack_id, packFileSha256: PACK_SHA256, editorialStatus: pack.editorial_status, sourceTextReturnedByApi: false, sources: pack.sources.map((source) => ({ sourceId: source.source_id, title: source.title, publisher: source.publisher, url: source.url, sourceClass: source.source_class, rightsLane: source.rights_lane })) }, boundaries: { minimumStandardElaborateFormsIncluded: true, hindiAndEnglishIncluded: true, substitutionsIncluded: true, familyContextPromptsIncluded: true, formalPriestMantrasIncluded: false, historicalPrescriptionsPromotedAsModernNorms: false, oneUniversalProcedureClaimed: false, allRegionalVariantsComplete: false, allGaneshotsavDaysComplete: false, reciprocalAndWiderFamilyParticipationSupported: true, materialFreeAndFlameFreeFallbackSupported: true, punjabAndUttarPradeshVariantsRemainDistinct: true, fastOrNirjalaRegimenPrescribed: false, medicalOrDietaryAdviceGiven: false, womenOnlyParticipationUniversalized: false, marriedHouseholdOnlyParticipationRequired: false, formalSankalpaMantraKathaArghyaOrPujaSequenceIncluded: false, sargiBayaaThaliSieveArghyaOrSpouseFedCloseRequired: false, giftPurchaseSpecialClothingOrSpendingRequired: false, spouseLongevityHealthMarriageProtectionMeritOrSuccessGuaranteed: false } };
}

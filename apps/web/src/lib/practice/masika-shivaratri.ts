import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PracticeGuidanceRequest, RitualProcedureGuide } from "../domain/practice";

const PACK_SHA256 = "e80bcba5a71b9df57e3cda56e2889c979fe1a221036811c32fe98957507bdca6";
const HISTORICAL_SOURCE_SHA256 = "a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b";
const OBSERVANCE_SLUGS = ["masika-shivaratri-2026-09", "masika-shivaratri-2026-10", "masika-shivaratri-2026-11", "masika-shivaratri-2026-12"];
const SOURCE_IDS = ["nirnayasindhu-1865-masika-shivaratri-rule", "drikpanchang-delhi-masika-shivaratri-2026", "ministry-tourism-somnath-monthly-shivratri", "mhada-masika-shivaratri-identity", "maharashtra-tourism-mahashivaratri-context", "devam-masika-shivaratri-safety-boundary"];
const PAIRS = [{ region_code: "north-india", tradition_code: "smarta-north-india" }, { region_code: "west-india", tradition_code: "smarta-west-india" }];
const EXPECTED_SCOPE = { region_tradition_pairs: PAIRS, language_codes: ["en", "hi"], september_december_2026_resolved_date_rules_required: true, family_or_temple_practice_overrides_generic_sequence: true, masika_and_mahashivaratri_remain_separate: true, fasting_food_medical_vigil_and_parana_guidance_excluded: true };
type Source = { source_id: string; title: string; publisher: string; url: string | null; source_class: string; rights_lane: "reference_only" | "derivative_allowed"; artifact_sha256?: string; observed_fetch?: { status: number; final_url: string; response_bytes: number; response_sha256: string; strict_utf8: boolean } };
type Guide = { guide_id: string; language_code: "en" | "hi"; title: string; summary: string; family_practice_note: string; context_prompts: string[]; tiers: Array<{ tier: "minimum" | "standard" | "elaborate"; label: string; estimated_minutes: number; materials: Array<{ item: string; substitutions: string[]; optional: boolean }>; steps: Array<{ ordinal: number; instruction: string; why: string; optional: boolean; source_ids: string[] }> }> };
type Pack = { contract: string; pack_id: string; editorial_status: "internal_beta_research_synthesis"; observance_slugs: string[]; scope: Record<string, unknown>; sources: Source[]; guides: Guide[]; boundaries: Record<string, boolean> };

function loadPack(): Pack {
  const root = resolve(process.cwd(), "../..");
  const bytes = readFileSync(resolve(root, "knowledge_packs/rituals/masika-shivaratri-north-west-india-v1.json"));
  if (createHash("sha256").update(bytes).digest("hex") !== PACK_SHA256) throw new Error("Masika Shivaratri practice-pack drift");
  const pack = JSON.parse(bytes.toString("utf8")) as Pack;
  if (pack.contract !== "DEVAM_RECURRING_RITUAL_PROCEDURE_PACK_V1" || pack.pack_id !== "devam-masika-shivaratri-north-west-india-v1" || JSON.stringify(pack.observance_slugs) !== JSON.stringify(OBSERVANCE_SLUGS) || JSON.stringify(pack.scope) !== JSON.stringify(EXPECTED_SCOPE)) throw new Error("Masika Shivaratri practice identity drift");
  if (pack.sources.map((source) => source.source_id).join("|") !== SOURCE_IDS.join("|") || pack.sources[0].artifact_sha256 !== HISTORICAL_SOURCE_SHA256) throw new Error("Masika Shivaratri source universe drift");
  if (pack.sources.slice(1, 5).some((source) => !source.observed_fetch || source.observed_fetch.status !== 200 || source.observed_fetch.final_url !== source.url || source.observed_fetch.strict_utf8 !== true || source.observed_fetch.response_bytes <= 0 || !/^[a-f0-9]{64}$/.test(source.observed_fetch.response_sha256))) throw new Error("Masika Shivaratri live observation drift");
  const sourceIds = new Set(SOURCE_IDS);
  if (pack.guides.map((guide) => guide.language_code).join("|") !== "en|hi") throw new Error("Masika Shivaratri language drift");
  for (const guide of pack.guides) {
    if (guide.context_prompts.length !== 4 || guide.tiers.map((tier) => tier.tier).join("|") !== "minimum|standard|elaborate" || guide.tiers.map((tier) => tier.estimated_minutes).join("|") !== "10|30|60") throw new Error(`Masika Shivaratri structure drift: ${guide.guide_id}`);
    for (const tier of guide.tiers) if (tier.materials.some((item) => item.substitutions.length === 0) || tier.steps.some((step, index) => step.ordinal !== index + 1 || step.source_ids.length === 0 || step.source_ids.some((id) => !sourceIds.has(id)))) throw new Error(`Masika Shivaratri evidence drift: ${guide.guide_id}/${tier.tier}`);
  }
  const trueKeys = ["minimum_standard_elaborate_forms_included", "hindi_and_english_included", "substitutions_included", "family_context_prompts_included", "four_launch_month_slugs_supported", "north_and_west_smarta_pairs_supported", "material_flame_and_non_fasting_form_supported", "temple_led_monthly_lane_preserved_as_attributable"];
  const falseKeys = ["fast_or_nirjala_regimen_prescribed", "food_or_dietary_rules_given", "medical_guidance_given", "abhisheka_ingredients_or_home_lingam_procedure_prescribed", "formal_mantra_count_aarti_or_priestly_sequence_included", "night_vigil_required", "parana_served", "annual_mahashivaratri_practice_universalized_monthly", "peace_purification_protection_merit_marriage_prosperity_or_other_outcome_guaranteed", "all_shaiva_smarta_regional_family_and_temple_variants_complete"];
  if (Object.keys(pack.boundaries).sort().join("|") !== [...trueKeys, ...falseKeys].sort().join("|") || trueKeys.some((key) => pack.boundaries[key] !== true) || falseKeys.some((key) => pack.boundaries[key] !== false)) throw new Error("Masika Shivaratri boundary drift");
  return pack;
}
const pack = loadPack();

export function resolveMasikaShivaratriProcedure(request: PracticeGuidanceRequest): RitualProcedureGuide | null {
  if (!OBSERVANCE_SLUGS.includes(request.observanceSlug) || !PAIRS.some((pair) => pair.region_code === request.regionCode && pair.tradition_code === request.traditionCode)) return null;
  const guide = pack.guides.find((candidate) => candidate.language_code === request.languageCode);
  if (!guide) return null;
  return { guideId: guide.guide_id, companionToObservanceSlug: request.observanceSlug, title: guide.title, languageCode: guide.language_code, kind: "contextual_minimum_standard_elaborate_ritual_procedure", summary: guide.summary, familyPracticeNote: guide.family_practice_note, contextPrompts: [...guide.context_prompts], tiers: guide.tiers.map((tier) => ({ tier: tier.tier, label: tier.label, estimatedMinutes: tier.estimated_minutes, materials: tier.materials.map((item) => ({ ...item, substitutions: [...item.substitutions] })), steps: tier.steps.map((step) => ({ ordinal: step.ordinal, instruction: step.instruction, why: step.why, optional: step.optional, sourceIds: [...step.source_ids] })) })), companionReading: null, evidence: { packId: pack.pack_id, packFileSha256: PACK_SHA256, editorialStatus: pack.editorial_status, sourceTextReturnedByApi: false, sources: pack.sources.map((source) => ({ sourceId: source.source_id, title: source.title, publisher: source.publisher, url: source.url, sourceClass: source.source_class, rightsLane: source.rights_lane })) }, boundaries: { minimumStandardElaborateFormsIncluded: true, hindiAndEnglishIncluded: true, substitutionsIncluded: true, familyContextPromptsIncluded: true, formalPriestMantrasIncluded: false, historicalPrescriptionsPromotedAsModernNorms: false, oneUniversalProcedureClaimed: false, allRegionalVariantsComplete: false, allGaneshotsavDaysComplete: false, fourLaunchMonthSlugsSupported: true, northAndWestSmartaPairsSupported: true, materialFlameAndNonFastingFormSupported: true, templeLedMonthlyLanePreservedAsAttributable: true, fastOrNirjalaRegimenPrescribed: false, foodOrDietaryRulesGiven: false, medicalGuidanceGiven: false, abhishekaIngredientsOrHomeLingamProcedurePrescribed: false, formalMantraCountAartiOrPriestlySequenceIncluded: false, nightVigilRequired: false, paranaServed: false, annualMahashivaratriPracticeUniversalizedMonthly: false, peacePurificationProtectionMeritMarriageProsperityOrOtherOutcomeGuaranteed: false } };
}


import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PracticeGuidanceRequest, RitualProcedureGuide } from "../domain/practice";

const PACK_SHA256 = "44b0fc5091849255f526016c205812533821052e0207a42568e60243462d3547";
const FIXTURE_SHA256 = "adf5c3d43e6f2fb19ef3ecc75fc92d2cfc671105c2eed87edda11872d34a33a5";
const SOURCE_IDS = ["devam-naraka-date-fixture", "drik-abhyang-snan-mumbai-2026", "maharashtra-tourism-diwali-narak", "maharashtra-gazetteers-naraka-context", "devam-naraka-household-safety-boundary"];
const EXPECTED_SCOPE = { region_codes: ["west-india"], tradition_codes: ["smarta-west-india"], language_codes: ["en", "hi"], mumbai_2026_date_fixture_required: true, maharashtra_naraka_abhyanga_household_only: true, family_custom_overrides_generic_sequence: true, oil_and_ubtan_optional_and_suitability_dependent: true, kali_chaudas_and_tamil_deepavali_not_merged: true };

type Source = { source_id: string; title: string; publisher: string; url: string | null; source_class: string; rights_lane: "reference_only" | "derivative_allowed"; artifact_sha256?: string; access_boundary?: Record<string, unknown> };
type Guide = { guide_id: string; language_code: "en" | "hi"; title: string; summary: string; family_practice_note: string; context_prompts: string[]; tiers: Array<{ tier: "minimum" | "standard" | "elaborate"; label: string; estimated_minutes: number; materials: Array<{ item: string; substitutions: string[]; optional: boolean }>; steps: Array<{ ordinal: number; instruction: string; why: string; optional: boolean; source_ids: string[] }> }> };
type Pack = { contract: string; pack_id: string; editorial_status: "internal_beta_research_synthesis"; observance_slug: string; scope: Record<string, unknown>; sources: Source[]; guides: Guide[]; boundaries: Record<string, boolean> };

function loadPack(): Pack {
  const root = resolve(process.cwd(), "../..");
  const bytes = readFileSync(resolve(root, "knowledge_packs/rituals/naraka-chaturdashi-maharashtra-household-v1.json"));
  if (createHash("sha256").update(bytes).digest("hex") !== PACK_SHA256) throw new Error("Naraka Chaturdashi practice-pack drift");
  const pack = JSON.parse(bytes.toString("utf8")) as Pack;
  if (pack.contract !== "DEVAM_RITUAL_PROCEDURE_PACK_V1" || pack.pack_id !== "devam-naraka-chaturdashi-maharashtra-household-v1" || pack.observance_slug !== "naraka-chaturdashi" || JSON.stringify(pack.scope) !== JSON.stringify(EXPECTED_SCOPE)) throw new Error("Naraka Chaturdashi practice identity drift");
  const fixtureHash = createHash("sha256").update(readFileSync(resolve(root, "knowledge_packs/panchang/naraka-chaturdashi-mumbai-2026-v1.json"))).digest("hex");
  if (fixtureHash !== FIXTURE_SHA256 || pack.sources.map((source) => source.source_id).join("|") !== SOURCE_IDS.join("|") || pack.sources[0].artifact_sha256 !== FIXTURE_SHA256) throw new Error("Naraka Chaturdashi source universe drift");
  const gazetteerBoundary = pack.sources[3].access_boundary;
  if (JSON.stringify(gazetteerBoundary) !== JSON.stringify({ normal_tls_fetch_failed_closed: true, failure: "CERT_HAS_EXPIRED", raw_bytes_retained: false, search_provider_text_extraction_only: true })) throw new Error("Naraka Chaturdashi Gazetteer access boundary drift");
  const sourceIds = new Set(SOURCE_IDS);
  if (pack.guides.map((guide) => guide.language_code).join("|") !== "en|hi") throw new Error("Naraka Chaturdashi language drift");
  for (const guide of pack.guides) {
    if (guide.context_prompts.length !== 4 || guide.tiers.map((tier) => tier.tier).join("|") !== "minimum|standard|elaborate" || guide.tiers.map((tier) => tier.estimated_minutes).join("|") !== "10|25|60") throw new Error(`Naraka Chaturdashi guide structure drift: ${guide.guide_id}`);
    for (const tier of guide.tiers) if (tier.materials.some((item) => !item.substitutions.length) || tier.steps.some((step, index) => step.ordinal !== index + 1 || !step.source_ids.length || step.source_ids.some((id) => !sourceIds.has(id)))) throw new Error(`Naraka Chaturdashi evidence drift: ${guide.guide_id}/${tier.tier}`);
  }
  const trueKeys = ["minimum_standard_elaborate_forms_included", "hindi_and_english_included", "substitutions_included", "family_context_prompts_included", "maharashtra_early_bath_and_narakasura_remembrance_supported", "normal_safe_bath_fallback_supported"];
  const falseKeys = ["formal_priest_mantras_included", "historical_prescriptions_promoted_as_universal_norms", "sesame_oil_or_ubtan_required_for_everyone", "karita_crushing_required", "fireworks_required_or_recommended", "new_clothes_or_purchase_required", "medical_or_dermatological_advice_given", "fast_or_specific_food_prescribed", "real_flame_required", "guaranteed_avoidance_of_naraka_or_other_outcome_claimed", "kali_chaudas_merged_or_completed", "tamil_deepavali_merged_or_completed", "one_universal_indian_procedure_claimed", "all_maharashtra_family_variants_complete"];
  if (Object.keys(pack.boundaries).sort().join("|") !== [...trueKeys, ...falseKeys].sort().join("|") || trueKeys.some((key) => pack.boundaries[key] !== true) || falseKeys.some((key) => pack.boundaries[key] !== false)) throw new Error("Naraka Chaturdashi boundary drift");
  return pack;
}

const pack = loadPack();

export function resolveNarakaChaturdashiProcedure(request: PracticeGuidanceRequest): RitualProcedureGuide | null {
  if (request.observanceSlug !== "naraka-chaturdashi" || request.regionCode !== "west-india" || request.traditionCode !== "smarta-west-india") return null;
  const guide = pack.guides.find((candidate) => candidate.language_code === request.languageCode);
  if (!guide) return null;
  return {
    guideId: guide.guide_id,
    companionToObservanceSlug: pack.observance_slug,
    title: guide.title,
    languageCode: guide.language_code,
    kind: "contextual_minimum_standard_elaborate_ritual_procedure",
    summary: guide.summary,
    familyPracticeNote: guide.family_practice_note,
    contextPrompts: [...guide.context_prompts],
    tiers: guide.tiers.map((tier) => ({ tier: tier.tier, label: tier.label, estimatedMinutes: tier.estimated_minutes, materials: tier.materials.map((item) => ({ ...item, substitutions: [...item.substitutions] })), steps: tier.steps.map((step) => ({ ordinal: step.ordinal, instruction: step.instruction, why: step.why, optional: step.optional, sourceIds: [...step.source_ids] })) })),
    companionReading: null,
    evidence: { packId: pack.pack_id, packFileSha256: PACK_SHA256, editorialStatus: pack.editorial_status, sourceTextReturnedByApi: false, sources: pack.sources.map((source) => ({ sourceId: source.source_id, title: source.title, publisher: source.publisher, url: source.url, sourceClass: source.source_class, rightsLane: source.rights_lane })) },
    boundaries: { minimumStandardElaborateFormsIncluded: true, hindiAndEnglishIncluded: true, substitutionsIncluded: true, familyContextPromptsIncluded: true, formalPriestMantrasIncluded: false, historicalPrescriptionsPromotedAsModernNorms: false, oneUniversalProcedureClaimed: false, allRegionalVariantsComplete: false, allGaneshotsavDaysComplete: false, maharashtraEarlyBathAndNarakasuraRemembranceSupported: true, normalSafeBathFallbackSupported: true, sesameOilOrUbtanRequiredForEveryone: false, karitaCrushingRequired: false, fireworksRequiredOrRecommended: false, newClothesOrPurchaseRequired: false, medicalOrDermatologicalAdviceGiven: false, fastOrSpecificFoodPrescribed: false, realFlameRequired: false, guaranteedAvoidanceOfNarakaOrOtherOutcomeClaimed: false, kaliChaudasMergedOrCompleted: false, tamilDeepavaliMergedOrCompleted: false },
  };
}

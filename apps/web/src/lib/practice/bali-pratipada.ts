import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PracticeGuidanceRequest, RitualProcedureGuide } from "../domain/practice";

const PACK_SHA256 = "a929c8bfbf40640168439553959c0eb877c35e262992e24ec3b61ee0aca6f918";
const FIXTURE_SHA256 = "c53a49bc816473be9f3d4ba1b942cdfe23658b67ca5cc1548fa347ed66360480";
const SOURCE_IDS = ["devam-bali-pratipada-date-fixture", "maharashtra-tourism-diwali-balipratipada", "devam-bali-pratipada-safety-and-boundary"];
const EXPECTED_SCOPE = { region_codes: ["west-india"], tradition_codes: ["smarta-west-india"], language_codes: ["en", "hi"], mumbai_2026_date_fixture_required: true, maharashtra_family_participation_only: true, family_practice_overrides_generic_sequence: true, regional_and_sampradaya_variants_not_merged: true };

type Source = { source_id: string; title: string; publisher: string; url: string | null; source_class: string; rights_lane: "reference_only" | "derivative_allowed"; artifact_sha256?: string; observed_fetch?: { status: number; final_url: string; response_bytes: number; response_sha256: string; strict_utf8: boolean }; observed_literals?: Record<string, boolean> };
type Guide = { guide_id: string; language_code: "en" | "hi"; title: string; summary: string; family_practice_note: string; context_prompts: string[]; tiers: Array<{ tier: "minimum" | "standard" | "elaborate"; label: string; estimated_minutes: number; materials: Array<{ item: string; substitutions: string[]; optional: boolean }>; steps: Array<{ ordinal: number; instruction: string; why: string; optional: boolean; source_ids: string[] }> }> };
type Pack = { contract: string; pack_id: string; editorial_status: "internal_beta_research_synthesis"; observance_slug: string; scope: Record<string, unknown>; sources: Source[]; guides: Guide[]; boundaries: Record<string, boolean> };

function loadPack(): Pack {
  const root = resolve(process.cwd(), "../..");
  const bytes = readFileSync(resolve(root, "knowledge_packs/rituals/bali-pratipada-maharashtra-family-v1.json"));
  const hash = createHash("sha256").update(bytes).digest("hex");
  if (hash !== PACK_SHA256) throw new Error(`Bali Pratipada practice-pack drift: ${hash}`);
  const pack = JSON.parse(bytes.toString("utf8")) as Pack;
  if (pack.contract !== "DEVAM_RITUAL_PROCEDURE_PACK_V1" || pack.pack_id !== "devam-bali-pratipada-maharashtra-family-v1" || pack.observance_slug !== "bali-pratipada" || JSON.stringify(pack.scope) !== JSON.stringify(EXPECTED_SCOPE)) throw new Error("Bali Pratipada practice identity drift");
  const fixtureHash = createHash("sha256").update(readFileSync(resolve(root, "knowledge_packs/panchang/bali-pratipada-mumbai-2026-v1.json"))).digest("hex");
  if (fixtureHash !== FIXTURE_SHA256 || pack.sources.map((source) => source.source_id).join("|") !== SOURCE_IDS.join("|") || pack.sources[0].artifact_sha256 !== FIXTURE_SHA256) throw new Error("Bali Pratipada source fixture drift");
  const tourism = pack.sources[1];
  if (JSON.stringify(tourism.observed_fetch) !== JSON.stringify({ status: 200, final_url: "https://maharashtratourism.gov.in/festivals/diwali/", response_bytes: 627476, response_sha256: "843ba748f82e5b2ba4573a1b70ef2e7033b7ad01ec754a5fb89d489828278a64", strict_utf8: true }) || JSON.stringify(tourism.observed_literals) !== JSON.stringify({ balipratipada_and_padwa: true, honors_king_bali: true, joyful_family_time: true })) throw new Error("Bali Pratipada official observation drift");
  const sourceIds = new Set(SOURCE_IDS);
  if (pack.guides.map((guide) => guide.language_code).join("|") !== "en|hi") throw new Error("Bali Pratipada language drift");
  for (const guide of pack.guides) {
    if (guide.context_prompts.length !== 4 || guide.tiers.map((tier) => tier.tier).join("|") !== "minimum|standard|elaborate" || guide.tiers.map((tier) => tier.estimated_minutes).join("|") !== "10|25|60") throw new Error(`Bali Pratipada guide structure drift: ${guide.guide_id}`);
    for (const tier of guide.tiers) if (tier.materials.some((item) => !item.substitutions.length) || tier.steps.some((step, index) => step.ordinal !== index + 1 || !step.source_ids.length || step.source_ids.some((id) => !sourceIds.has(id)))) throw new Error(`Bali Pratipada evidence drift: ${guide.guide_id}/${tier.tier}`);
  }
  const trueKeys = ["minimum_standard_elaborate_forms_included", "hindi_and_english_included", "substitutions_included", "family_context_prompts_included", "king_bali_remembrance_and_family_time_core_supported"];
  const falseKeys = ["formal_priest_mantras_included", "historical_prescriptions_promoted_as_modern_norms", "fixed_image_or_offering_required", "wife_to_husband_or_spouse_rite_required", "real_flame_required", "gift_or_spending_required", "commercial_new_year_account_ritual_required", "fasting_prescribed", "guaranteed_prosperity_or_material_outcome_claimed", "one_vamana_bali_theology_claimed_as_universal", "govardhana_or_annakut_merged", "gujarati_or_baps_new_year_merged", "south_india_balipadyami_completed", "one_universal_indian_procedure_claimed", "all_family_regional_and_sampradaya_variants_complete"];
  if (Object.keys(pack.boundaries).sort().join("|") !== [...trueKeys, ...falseKeys].sort().join("|") || trueKeys.some((key) => pack.boundaries[key] !== true) || falseKeys.some((key) => pack.boundaries[key] !== false)) throw new Error("Bali Pratipada boundary drift");
  return pack;
}

const pack = loadPack();

export function resolveBaliPratipadaProcedure(request: PracticeGuidanceRequest): RitualProcedureGuide | null {
  if (request.observanceSlug !== "bali-pratipada" || request.regionCode !== "west-india" || request.traditionCode !== "smarta-west-india") return null;
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
    boundaries: {
      minimumStandardElaborateFormsIncluded: true,
      hindiAndEnglishIncluded: true,
      substitutionsIncluded: true,
      familyContextPromptsIncluded: true,
      formalPriestMantrasIncluded: false,
      historicalPrescriptionsPromotedAsModernNorms: false,
      oneUniversalProcedureClaimed: false,
      allRegionalVariantsComplete: false,
      allGaneshotsavDaysComplete: false,
      kingBaliRemembranceAndFamilyTimeCoreSupported: true,
      fixedImageOrOfferingRequired: false,
      wifeToHusbandOrSpouseRiteRequired: false,
      realFlameRequired: false,
      giftOrSpendingRequired: false,
      commercialNewYearAccountRitualRequired: false,
      fastingPrescribed: false,
      guaranteedProsperityOrMaterialOutcomeClaimed: false,
      oneVamanaBaliTheologyClaimedAsUniversal: false,
      govardhanaOrAnnakutMerged: false,
      gujaratiOrBapsNewYearMerged: false,
      southIndiaBalipadyamiCompleted: false,
    },
  };
}

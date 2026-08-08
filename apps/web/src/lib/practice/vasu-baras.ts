import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PracticeGuidanceRequest, RitualProcedureGuide } from "../domain/practice";

const PACK_SHA256 = "c80e5f8ba02969a94a42e1336865b2b707f9eff3bb31e3d4e1bb058dc446c1fb";
const FIXTURE_SHA256 = "901142c4c16503ac46125420b8788fa7585600d60a9c1ec07a18c6e3a15d9ea6";
const SOURCE_IDS = ["devam-vasu-baras-date-fixture", "maharashtra-tourism-diwali-vasubaras", "ansi-rural-livestock-markets-vasubaras", "devam-vasu-baras-animal-welfare-and-scope-boundary"];
const EXPECTED_SCOPE = { region_codes: ["west-india"], tradition_codes: ["smarta-west-india"], language_codes: ["en", "hi"], mumbai_2026_date_fixture_required: true, maharashtra_vasu_baras_family_participation_only: true, no_animal_contact_default: true, animal_keeper_authority_required_for_any_live_animal_interaction: true, regional_variants_not_merged: true };

type Source = { source_id: string; title: string; publisher: string; url: string | null; source_class: string; rights_lane: "reference_only" | "derivative_allowed"; artifact_sha256?: string; observed_fetch?: { status: number; final_url: string; response_bytes: number; response_sha256: string; strict_utf8: boolean }; observed_literals?: Record<string, boolean>; provider_document_observation?: Record<string, unknown>; access_boundary?: Record<string, unknown> };
type Guide = { guide_id: string; language_code: "en" | "hi"; title: string; summary: string; family_practice_note: string; context_prompts: string[]; tiers: Array<{ tier: "minimum" | "standard" | "elaborate"; label: string; estimated_minutes: number; materials: Array<{ item: string; substitutions: string[]; optional: boolean }>; steps: Array<{ ordinal: number; instruction: string; why: string; optional: boolean; source_ids: string[] }> }> };
type Pack = { contract: string; pack_id: string; editorial_status: "internal_beta_research_synthesis"; observance_slug: string; scope: Record<string, unknown>; sources: Source[]; guides: Guide[]; boundaries: Record<string, boolean> };

function loadPack(): Pack {
  const root = resolve(process.cwd(), "../..");
  const bytes = readFileSync(resolve(root, "knowledge_packs/rituals/vasu-baras-maharashtra-family-v1.json"));
  const hash = createHash("sha256").update(bytes).digest("hex");
  if (hash !== PACK_SHA256) throw new Error(`Vasu Baras practice-pack drift: ${hash}`);
  const pack = JSON.parse(bytes.toString("utf8")) as Pack;
  if (pack.contract !== "DEVAM_RITUAL_PROCEDURE_PACK_V1" || pack.pack_id !== "devam-vasu-baras-maharashtra-family-v1" || pack.observance_slug !== "govatsa-dwadashi" || JSON.stringify(pack.scope) !== JSON.stringify(EXPECTED_SCOPE)) throw new Error("Vasu Baras practice identity drift");
  const fixtureHash = createHash("sha256").update(readFileSync(resolve(root, "knowledge_packs/panchang/vasu-baras-mumbai-2026-v1.json"))).digest("hex");
  if (fixtureHash !== FIXTURE_SHA256 || pack.sources.map((source) => source.source_id).join("|") !== SOURCE_IDS.join("|") || pack.sources[0].artifact_sha256 !== FIXTURE_SHA256) throw new Error("Vasu Baras source fixture drift");
  const tourism = pack.sources[1];
  if (JSON.stringify(tourism.observed_fetch) !== JSON.stringify({ status: 200, final_url: "https://maharashtratourism.gov.in/festivals/diwali/", response_bytes: 627482, response_sha256: "60e1cf513e43ca1654427a6817aea16886d14445434a1ad02f9459e7dfd8af08", strict_utf8: true }) || JSON.stringify(tourism.observed_literals) !== JSON.stringify({ pre_celebrations_start_from_vasubaras: true, regional_diversity_explicit: true })) throw new Error("Vasu Baras tourism observation drift");
  const ansi = pack.sources[2];
  if (JSON.stringify(ansi.provider_document_observation) !== JSON.stringify({ content_type: "application/pdf", page_count: 184, relevant_pdf_pages: [108, 109], vasubaras_maharashtra_and_diwali_opening: true, gratitude_to_cows_and_agricultural_role: true, farmer_interviews_and_practice_description: true }) || JSON.stringify(ansi.access_boundary) !== JSON.stringify({ normal_tls_direct_fetch_status: 403, raw_pdf_bytes_retained: false, visual_render_completed: false, search_provider_text_extraction_only: true })) throw new Error("Vasu Baras official field-report boundary drift");
  const sourceIds = new Set(SOURCE_IDS);
  if (pack.guides.map((guide) => guide.language_code).join("|") !== "en|hi") throw new Error("Vasu Baras language drift");
  for (const guide of pack.guides) {
    if (guide.context_prompts.length !== 4 || guide.tiers.map((tier) => tier.tier).join("|") !== "minimum|standard|elaborate" || guide.tiers.map((tier) => tier.estimated_minutes).join("|") !== "10|25|60") throw new Error(`Vasu Baras guide structure drift: ${guide.guide_id}`);
    for (const tier of guide.tiers) if (tier.materials.some((item) => !item.substitutions.length) || tier.steps.some((step, index) => step.ordinal !== index + 1 || !step.source_ids.length || step.source_ids.some((id) => !sourceIds.has(id)))) throw new Error(`Vasu Baras evidence drift: ${guide.guide_id}/${tier.tier}`);
  }
  const trueKeys = ["minimum_standard_elaborate_forms_included", "hindi_and_english_included", "substitutions_included", "family_context_prompts_included", "maharashtra_vasu_baras_diwali_opening_identity_supported", "gratitude_to_cattle_farmers_and_responsible_care_supported", "no_contact_family_form_supported"];
  const falseKeys = ["formal_priest_mantras_included", "historical_or_field_observations_promoted_as_universal_norms", "animal_contact_feeding_washing_restraining_or_decoration_instructed", "flame_near_animals_instructed", "cow_purchase_sale_or_gift_required", "fast_or_dairy_wheat_abstention_prescribed", "medical_veterinary_or_dietary_advice_given", "specific_food_offering_required", "gift_donation_or_spending_required", "guaranteed_prosperity_merit_or_family_outcome_claimed", "gujarat_wagh_baras_bachha_baras_guru_dwadashi_or_nandini_vrat_completed", "one_universal_indian_procedure_claimed", "all_family_regional_and_agrarian_variants_complete", "raw_anthropological_report_acquired_or_visually_reconciled"];
  if (Object.keys(pack.boundaries).sort().join("|") !== [...trueKeys, ...falseKeys].sort().join("|") || trueKeys.some((key) => pack.boundaries[key] !== true) || falseKeys.some((key) => pack.boundaries[key] !== false)) throw new Error("Vasu Baras boundary drift");
  return pack;
}

const pack = loadPack();

export function resolveVasuBarasProcedure(request: PracticeGuidanceRequest): RitualProcedureGuide | null {
  if (request.observanceSlug !== "govatsa-dwadashi" || request.regionCode !== "west-india" || request.traditionCode !== "smarta-west-india") return null;
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
      maharashtraVasuBarasDiwaliOpeningIdentitySupported: true,
      gratitudeToCattleFarmersAndResponsibleCareSupported: true,
      noContactFamilyFormSupported: true,
      animalContactFeedingWashingRestrainingOrDecorationInstructed: false,
      flameNearAnimalsInstructed: false,
      cowPurchaseSaleOrGiftRequired: false,
      fastOrDairyWheatAbstentionPrescribed: false,
      medicalVeterinaryOrDietaryAdviceGiven: false,
      specificFoodOfferingRequired: false,
      giftDonationOrSpendingRequired: false,
      guaranteedProsperityMeritOrFamilyOutcomeClaimed: false,
      gujaratWaghBarasBachhaBarasGuruDwadashiOrNandiniVratCompleted: false,
      rawAnthropologicalReportAcquiredOrVisuallyReconciled: false,
    },
  };
}

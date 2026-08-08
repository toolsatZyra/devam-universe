import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PracticeGuidanceRequest, RitualProcedureGuide } from "../domain/practice";

const PACK_SHA256 = "78b96891f2197405086ac3c3a1b50e68a6fbb83c129794a6ae0c8fc13b0ab396";
const CAMPAIGN_SHA256 = "c8bec184a2de4f245b1354e386daaa0fbdb9113dbc3b35e53fc335dd99b7204a";
const SOURCE_IDS = ["devam-bengal-durga-puja-campaign-fixture", "incredible-india-durga-puja-2026", "west-bengal-aasan-durga-puja-context", "belur-math-durga-puja-institutional-context", "devam-bengal-durga-puja-safety-boundary"];
const PAIRS = [{ region_code: "bengal", tradition_code: "shakta-bengal" }] as const;
const EXPECTED_SCOPE = { region_codes: ["bengal"], tradition_codes: ["shakta-bengal"], supported_pairs: PAIRS, language_codes: ["en", "hi"], kolkata_2026_campaign_fixture_required: true, family_temple_pandal_and_sampradaya_practice_override_generic_form: true, belur_math_institutional_sequence_is_context_not_universal_household_procedure: true };
type Source = { source_id: string; title: string; publisher: string; url: string | null; source_class: string; rights_lane: "reference_only" | "derivative_allowed"; artifact_sha256?: string; observed_fetch?: { status: number; final_url: string; response_bytes: number; response_sha256: string; strict_utf8: boolean } };
type Guide = { guide_id: string; language_code: "en" | "hi"; title: string; summary: string; family_practice_note: string; context_prompts: string[]; tiers: Array<{ tier: "minimum" | "standard" | "elaborate"; label: string; estimated_minutes: number; materials: Array<{ item: string; substitutions: string[]; optional: boolean }>; steps: Array<{ ordinal: number; instruction: string; why: string; optional: boolean; source_ids: string[] }> }> };
type Pack = { contract: string; pack_id: string; editorial_status: "internal_beta_research_synthesis"; observance_slug: string; scope: Record<string, unknown>; sources: Source[]; guides: Guide[]; boundaries: Record<string, boolean> };

function loadPack(): Pack {
  const root = resolve(process.cwd(), "../..");
  const bytes = readFileSync(resolve(root, "knowledge_packs/rituals/bengal-durga-puja-participation-v1.json"));
  if (createHash("sha256").update(bytes).digest("hex") !== PACK_SHA256) throw new Error("Bengal Durga Puja practice-pack drift");
  const pack = JSON.parse(bytes.toString("utf8")) as Pack;
  if (pack.contract !== "DEVAM_RITUAL_PROCEDURE_PACK_V1" || pack.pack_id !== "devam-bengal-durga-puja-participation-v1" || pack.observance_slug !== "bengal-durga-puja-campaign" || pack.editorial_status !== "internal_beta_research_synthesis" || JSON.stringify(pack.scope) !== JSON.stringify(EXPECTED_SCOPE)) throw new Error("Bengal Durga Puja practice identity drift");
  if (createHash("sha256").update(readFileSync(resolve(root, "knowledge_packs/campaigns/durga-puja-kolkata-2026-v1.json"))).digest("hex") !== CAMPAIGN_SHA256 || pack.sources.map((source) => source.source_id).join("|") !== SOURCE_IDS.join("|") || pack.sources[0].artifact_sha256 !== CAMPAIGN_SHA256) throw new Error("Bengal Durga Puja source universe drift");
  const expected = [
    ["https://www.incredibleindia.gov.in/en/festivals-and-events/durga-puja", 512560, "bf370460363d541e1a6eaf98073a38555cdcfb398a930caeaae1a66072a06237"],
    ["https://aasan.wb.gov.in/SiteController/", 33712, "a4e79a8e61ba128d065de1a677c403329424416c87940ba9b198b334442f02d1"],
    ["https://belurmath.org/durga-puja-at-belur-math/", 179835, "2da792329adfb7ef4efdb06c2d14490a82c270c61314d297164090e9a4ee6ab8"],
  ] as const;
  for (let index = 0; index < expected.length; index += 1) {
    const source = pack.sources[index + 1]; const fetch = source?.observed_fetch; const [url, responseBytes, responseSha256] = expected[index];
    if (source?.url !== url || fetch?.status !== 200 || fetch.final_url !== url || fetch.response_bytes !== responseBytes || fetch.response_sha256 !== responseSha256 || fetch.strict_utf8 !== true) throw new Error("Bengal Durga Puja living observation drift");
  }
  const sourceIds = new Set(SOURCE_IDS);
  if (pack.guides.map((guide) => guide.language_code).join("|") !== "en|hi") throw new Error("Bengal Durga Puja language drift");
  for (const guide of pack.guides) {
    if (guide.context_prompts.length !== 4 || guide.tiers.map((tier) => `${tier.tier}:${tier.estimated_minutes}`).join("|") !== "minimum:10|standard:30|elaborate:75") throw new Error("Bengal Durga Puja guide structure drift");
    for (const tier of guide.tiers) if (tier.materials.some((item) => item.substitutions.length === 0) || tier.steps.some((step, index) => step.ordinal !== index + 1 || step.source_ids.length === 0 || step.source_ids.some((id) => !sourceIds.has(id)))) throw new Error("Bengal Durga Puja evidence drift");
  }
  const trueKeys = ["minimum_standard_elaborate_forms_included", "hindi_and_english_included", "substitutions_included", "family_context_prompts_included", "six_day_campaign_participation_and_source_labelled_durga_remembrance_supported", "community_artistry_workers_women_dignity_and_service_reflection_supported", "material_free_and_non_fasting_home_form_supported"];
  const falseKeys = ["fast_food_dietary_or_medical_guidance_given", "bodhan_adhivas_navapatrika_pranapratistha_shodashopachara_anjali_bhog_or_formal_puja_prescribed", "kumari_puja_or_use_of_a_child_as_ritual_subject_prescribed", "sandhi_puja_timing_or_priest_liturgy_prescribed", "animal_or_symbolic_bali_homa_or_harm_instructed", "sindoor_required_or_restricted_marital_status_practice_prescribed", "immersion_procession_water_entry_or_environmental_operation_instructed", "belur_math_sequence_universalized", "live_event_access_transport_crowd_food_or_safety_claimed_current", "victory_protection_merit_prosperity_or_other_outcome_guaranteed", "north_west_navaratri_golu_garba_dashain_or_other_durga_traditions_merged", "all_bengal_family_bonedi_bari_temple_pandal_and_shakta_variants_complete"];
  if (Object.keys(pack.boundaries).sort().join("|") !== [...trueKeys, ...falseKeys].sort().join("|") || trueKeys.some((key) => pack.boundaries[key] !== true) || falseKeys.some((key) => pack.boundaries[key] !== false)) throw new Error("Bengal Durga Puja boundary drift");
  return pack;
}

const pack = loadPack();

export function resolveBengalDurgaPujaProcedure(request: PracticeGuidanceRequest): RitualProcedureGuide | null {
  if (request.observanceSlug !== pack.observance_slug || !PAIRS.some((pair) => pair.region_code === request.regionCode && pair.tradition_code === request.traditionCode)) return null;
  const guide = pack.guides.find((candidate) => candidate.language_code === request.languageCode); if (!guide) return null;
  return { guideId: guide.guide_id, companionToObservanceSlug: pack.observance_slug, title: guide.title, languageCode: guide.language_code, kind: "contextual_minimum_standard_elaborate_ritual_procedure", summary: guide.summary, familyPracticeNote: guide.family_practice_note, contextPrompts: [...guide.context_prompts], tiers: guide.tiers.map((tier) => ({ tier: tier.tier, label: tier.label, estimatedMinutes: tier.estimated_minutes, materials: tier.materials.map((item) => ({ ...item, substitutions: [...item.substitutions] })), steps: tier.steps.map((step) => ({ ordinal: step.ordinal, instruction: step.instruction, why: step.why, optional: step.optional, sourceIds: [...step.source_ids] })) })), companionReading: null, evidence: { packId: pack.pack_id, packFileSha256: PACK_SHA256, editorialStatus: pack.editorial_status, sourceTextReturnedByApi: false, sources: pack.sources.map((source) => ({ sourceId: source.source_id, title: source.title, publisher: source.publisher, url: source.url, sourceClass: source.source_class, rightsLane: source.rights_lane })) }, boundaries: { minimumStandardElaborateFormsIncluded: true, hindiAndEnglishIncluded: true, substitutionsIncluded: true, familyContextPromptsIncluded: true, formalPriestMantrasIncluded: false, historicalPrescriptionsPromotedAsModernNorms: false, oneUniversalProcedureClaimed: false, allRegionalVariantsComplete: false, allGaneshotsavDaysComplete: false, sixDayCampaignParticipationAndSourceLabelledDurgaRemembranceSupported: true, communityArtistryWorkersWomenDignityAndServiceReflectionSupported: true, materialFreeAndNonFastingHomeFormSupported: true, fastFoodDietaryOrMedicalGuidanceGiven: false, bodhanAdhivasNavapatrikaPranapratisthaShodashopacharaAnjaliBhogOrFormalPujaPrescribed: false, kumariPujaOrUseOfAChildAsRitualSubjectPrescribed: false, sandhiPujaTimingOrPriestLiturgyPrescribed: false, animalOrSymbolicBaliHomaOrHarmInstructed: false, sindoorRequiredOrRestrictedMaritalStatusPracticePrescribed: false, immersionProcessionWaterEntryOrEnvironmentalOperationInstructed: false, belurMathSequenceUniversalized: false, liveEventAccessTransportCrowdFoodOrSafetyClaimedCurrent: false, victoryProtectionMeritProsperityOrOtherOutcomeGuaranteed: false, northWestNavaratriGoluGarbaDashainOrOtherDurgaTraditionsMerged: false, allBengalFamilyBonediBariTemplePandalAndShaktaVariantsComplete: false } };
}

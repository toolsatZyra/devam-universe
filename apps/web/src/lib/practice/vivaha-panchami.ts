import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PracticeGuidanceRequest, RitualProcedureGuide } from "../domain/practice";

const PACK_SHA256 = "938384b6ddc596245047c420810f1db2428cd64cdd40ee02a7434505371e8f5d";
const FIXTURE_SHA256 = "5ac334e9efa8fe548b572ef6ce5d4d982206cc774a4a2672735c75b665a7770c";
const SOURCE_IDS = ["devam-vivaha-panchami-calendar-fixture", "drikpanchang-delhi-vivaha-panchami-2026", "incredible-india-orchha-vivaha-panchami-2026", "pib-ayodhya-vivaha-panchami-context", "devam-vivaha-panchami-safety-boundary"];
const PAIRS = [{ region_code: "north-india", tradition_code: "smarta-north-india" }] as const;
const EXPECTED_SCOPE = { region_codes: ["north-india"], tradition_codes: ["smarta-north-india"], supported_pairs: PAIRS, language_codes: ["en", "hi"], delhi_2026_calendar_fixture_required: true, family_temple_and_sampradaya_practice_override_generic_form: true, janakpur_ayodhya_and_orchha_public_festival_forms_are_context_not_universal_home_procedure: true };
type Source = { source_id: string; title: string; publisher: string; url: string | null; source_class: string; rights_lane: "reference_only" | "derivative_allowed"; artifact_sha256?: string; observed_fetch?: { status: number; final_url: string; response_bytes: number; response_sha256: string; strict_utf8: boolean } };
type Guide = { guide_id: string; language_code: "en" | "hi"; title: string; summary: string; family_practice_note: string; context_prompts: string[]; tiers: Array<{ tier: "minimum" | "standard" | "elaborate"; label: string; estimated_minutes: number; materials: Array<{ item: string; substitutions: string[]; optional: boolean }>; steps: Array<{ ordinal: number; instruction: string; why: string; optional: boolean; source_ids: string[] }> }> };
type Pack = { contract: string; pack_id: string; editorial_status: "internal_beta_research_synthesis"; observance_slug: string; scope: Record<string, unknown>; sources: Source[]; guides: Guide[]; boundaries: Record<string, boolean> };

function loadPack(): Pack {
  const root = resolve(process.cwd(), "../..");
  const bytes = readFileSync(resolve(root, "knowledge_packs/rituals/vivaha-panchami-north-india-v1.json"));
  if (createHash("sha256").update(bytes).digest("hex") !== PACK_SHA256) throw new Error("Vivaha Panchami practice-pack drift");
  const pack = JSON.parse(bytes.toString("utf8")) as Pack;
  if (pack.contract !== "DEVAM_RITUAL_PROCEDURE_PACK_V1" || pack.pack_id !== "devam-vivaha-panchami-north-india-v1" || pack.observance_slug !== "vivaha-panchami" || pack.editorial_status !== "internal_beta_research_synthesis" || JSON.stringify(pack.scope) !== JSON.stringify(EXPECTED_SCOPE)) throw new Error("Vivaha Panchami practice identity drift");
  if (createHash("sha256").update(readFileSync(resolve(root, "knowledge_packs/panchang/vivaha-panchami-delhi-2026-v1.json"))).digest("hex") !== FIXTURE_SHA256 || pack.sources.map((source) => source.source_id).join("|") !== SOURCE_IDS.join("|") || pack.sources[0].artifact_sha256 !== FIXTURE_SHA256) throw new Error("Vivaha Panchami source universe drift");
  const expected = [
    ["https://www.drikpanchang.com/festivals/vivah-panchami/vivah-panchami-date-time.html?geoname-id=1273294&year=2026", "https://www.drikpanchang.com/festivals/vivah-panchami/vivah-panchami-date-time.html?geoname-id=1273294&year=2026", 67949, "d2522e46a93afc6cf0945f504c7230c5656c49fb04050015d1af4d033ac59977"],
    ["https://www.incredibleindia.gov.in/en/festivals-and-events/madhya-pradesh/vivah-panchami-mahotsav", "https://www.incredibleindia.gov.in/en/festivals-and-events/madhya-pradesh/vivah-panchami-mahotsav", 485310, "8ce92ad620778f22f40d4ad350480516025943055821e44ed74c77197fa841d7"],
    ["https://www.pib.gov.in/PressReleasePage.aspx?PRID=2194034", "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2194034&reg=48&lang=2", 245935, "61f73318563249db6b9318af4f0f1918210d113abd672f037b2c73b50ac3b8d8"],
  ] as const;
  for (let index = 0; index < expected.length; index += 1) {
    const source = pack.sources[index + 1]; const fetch = source?.observed_fetch; const [url, finalUrl, responseBytes, responseSha256] = expected[index];
    if (source?.url !== url || fetch?.status !== 200 || fetch.final_url !== finalUrl || fetch.response_bytes !== responseBytes || fetch.response_sha256 !== responseSha256 || fetch.strict_utf8 !== true) throw new Error("Vivaha Panchami living observation drift");
  }
  const sourceIds = new Set(SOURCE_IDS);
  if (pack.guides.map((guide) => guide.language_code).join("|") !== "en|hi") throw new Error("Vivaha Panchami language drift");
  for (const guide of pack.guides) {
    if (guide.context_prompts.length !== 4 || guide.tiers.map((tier) => `${tier.tier}:${tier.estimated_minutes}`).join("|") !== "minimum:10|standard:30|elaborate:60") throw new Error("Vivaha Panchami guide structure drift");
    for (const tier of guide.tiers) if (tier.materials.some((item) => item.substitutions.length === 0) || tier.steps.some((step, index) => step.ordinal !== index + 1 || step.source_ids.length === 0 || step.source_ids.some((id) => !sourceIds.has(id)))) throw new Error("Vivaha Panchami evidence drift");
  }
  const trueKeys = ["minimum_standard_elaborate_forms_included", "hindi_and_english_included", "substitutions_included", "family_context_prompts_included", "attributable_rama_sita_marriage_remembrance_relationship_responsibility_and_safe_public_participation_supported", "material_free_and_non_fasting_form_supported", "janakpur_ayodhya_and_orchha_contexts_kept_distinct"];
  const falseKeys = ["fast_food_dietary_or_medical_guidance_given", "formal_wedding_reenactment_puja_mantra_offering_procession_or_vow_prescribed", "marriage_spouse_fertility_progeny_prosperity_merit_or_other_outcome_guaranteed", "one_ramayana_edition_story_interpretation_or_practice_claimed_universal", "public_event_operations_or_travel_safety_claimed_current", "all_regional_family_temple_sampradaya_and_ramayana_variants_complete"];
  if (Object.keys(pack.boundaries).sort().join("|") !== [...trueKeys, ...falseKeys].sort().join("|") || trueKeys.some((key) => pack.boundaries[key] !== true) || falseKeys.some((key) => pack.boundaries[key] !== false)) throw new Error("Vivaha Panchami boundary drift");
  return pack;
}

const pack = loadPack();

export function resolveVivahaPanchamiProcedure(request: PracticeGuidanceRequest): RitualProcedureGuide | null {
  if (request.observanceSlug !== pack.observance_slug || !PAIRS.some((pair) => pair.region_code === request.regionCode && pair.tradition_code === request.traditionCode)) return null;
  const guide = pack.guides.find((candidate) => candidate.language_code === request.languageCode); if (!guide) return null;
  return { guideId: guide.guide_id, companionToObservanceSlug: pack.observance_slug, title: guide.title, languageCode: guide.language_code, kind: "contextual_minimum_standard_elaborate_ritual_procedure", summary: guide.summary, familyPracticeNote: guide.family_practice_note, contextPrompts: [...guide.context_prompts], tiers: guide.tiers.map((tier) => ({ tier: tier.tier, label: tier.label, estimatedMinutes: tier.estimated_minutes, materials: tier.materials.map((item) => ({ ...item, substitutions: [...item.substitutions] })), steps: tier.steps.map((step) => ({ ordinal: step.ordinal, instruction: step.instruction, why: step.why, optional: step.optional, sourceIds: [...step.source_ids] })) })), companionReading: null, evidence: { packId: pack.pack_id, packFileSha256: PACK_SHA256, editorialStatus: pack.editorial_status, sourceTextReturnedByApi: false, sources: pack.sources.map((source) => ({ sourceId: source.source_id, title: source.title, publisher: source.publisher, url: source.url, sourceClass: source.source_class, rightsLane: source.rights_lane })) }, boundaries: { minimumStandardElaborateFormsIncluded: true, hindiAndEnglishIncluded: true, substitutionsIncluded: true, familyContextPromptsIncluded: true, formalPriestMantrasIncluded: false, historicalPrescriptionsPromotedAsModernNorms: false, oneUniversalProcedureClaimed: false, allRegionalVariantsComplete: false, allGaneshotsavDaysComplete: false, attributableRamaSitaMarriageRemembranceRelationshipResponsibilityAndSafePublicParticipationSupported: true, materialFreeAndNonFastingFormSupported: true, janakpurAyodhyaAndOrchhaContextsKeptDistinct: true, fastFoodDietaryOrMedicalGuidanceGiven: false, formalWeddingReenactmentPujaMantraOfferingProcessionOrVowPrescribed: false, marriageSpouseFertilityProgenyProsperityMeritOrOtherOutcomeGuaranteed: false, oneRamayanaEditionStoryInterpretationOrPracticeClaimedUniversal: false, publicEventOperationsOrTravelSafetyClaimedCurrent: false, allRegionalFamilyTempleSampradayaAndRamayanaVariantsComplete: false } };
}

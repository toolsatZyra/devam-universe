import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PracticeGuidanceRequest, RitualProcedureGuide } from "../domain/practice";

const PACK_SHA256 = "323c481459207eeb9e1937d8f69618ab891a4f2c2a602be4fd51ff9721e744fd";
const FIXTURE_SHA256 = "68130406f9cff8b5f2c12cff08b5b75d8d06cdef02e2d35653f34f2dbf8edcae";
const HISTORICAL_SHA256 = "a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b";
const PARGITER_PACKET_SHA256 = "9b7ccd43163cadd84f3c41a8c4fbacf40205e4539678c2b51da16829fe257969";
const OBSERVANCE_SLUGS = ["masika-durgashtami-2026-09", "masika-durgashtami-2026-10", "masika-durgashtami-2026-11", "masika-durgashtami-2026-12"];
const PAIRS = [{ region_code: "north-india", tradition_code: "smarta-north-india" }, { region_code: "west-india", tradition_code: "smarta-west-india" }];
const SOURCE_IDS = ["devam-masika-durgashtami-calendar-fixture", "nirnayasindhu-1865-general-shukla-ashtami-context", "drikpanchang-delhi-masika-durgashtami-2026", "devam-markandeya-purana-pargiter-devimahatmya", "devam-masika-durgashtami-safety-boundary"];
const EXPECTED_SCOPE = { region_codes: ["north-india", "west-india"], tradition_codes: ["smarta-north-india", "smarta-west-india"], supported_pairs: PAIRS, language_codes: ["en", "hi"], four_month_2026_calendar_fixture_required: true, family_temple_and_sampradaya_practice_override_generic_form: true, monthly_durgashtami_is_not_automatically_shardiya_mahashtami_or_bengal_durga_puja: true };
type Source = { source_id: string; title: string; publisher: string; url: string | null; source_class: string; rights_lane: "reference_only" | "private_evidence" | "derivative_allowed"; artifact_sha256?: string; pdf_pages?: number[]; ingestion_plan?: string; packet_sha256?: string; observed_fetch?: { status: number; final_url: string; response_bytes: number; response_sha256: string; strict_utf8: boolean } };
type Guide = { guide_id: string; language_code: "en" | "hi"; title: string; summary: string; family_practice_note: string; context_prompts: string[]; tiers: Array<{ tier: "minimum" | "standard" | "elaborate"; label: string; estimated_minutes: number; materials: Array<{ item: string; substitutions: string[]; optional: boolean }>; steps: Array<{ ordinal: number; instruction: string; why: string; optional: boolean; source_ids: string[] }> }> };
type Pack = { contract: string; pack_id: string; editorial_status: "internal_beta_research_synthesis"; observance_slugs: string[]; scope: Record<string, unknown>; sources: Source[]; guides: Guide[]; boundaries: Record<string, boolean> };

function loadPack(): Pack {
  const root = resolve(process.cwd(), "../..");
  const bytes = readFileSync(resolve(root, "knowledge_packs/rituals/masika-durgashtami-north-west-v1.json"));
  if (createHash("sha256").update(bytes).digest("hex") !== PACK_SHA256) throw new Error("Masika Durgashtami practice-pack drift");
  const pack = JSON.parse(bytes.toString("utf8")) as Pack;
  if (pack.contract !== "DEVAM_MULTI_LANE_RITUAL_PROCEDURE_PACK_V1" || pack.pack_id !== "devam-masika-durgashtami-north-west-v1" || pack.editorial_status !== "internal_beta_research_synthesis" || JSON.stringify(pack.observance_slugs) !== JSON.stringify(OBSERVANCE_SLUGS) || JSON.stringify(pack.scope) !== JSON.stringify(EXPECTED_SCOPE)) throw new Error("Masika Durgashtami practice identity drift");

  const fixture = readFileSync(resolve(root, "knowledge_packs/panchang/masika-durgashtami-delhi-september-december-2026-v1.json"));
  const planPath = "ingestion/plans/markandeya-purana-pargiter-1904-v1.json";
  if (createHash("sha256").update(fixture).digest("hex") !== FIXTURE_SHA256 || pack.sources.map((source) => source.source_id).join("|") !== SOURCE_IDS.join("|")) throw new Error("Masika Durgashtami source universe drift");
  if (pack.sources[0].artifact_sha256 !== FIXTURE_SHA256 || pack.sources[1].artifact_sha256 !== HISTORICAL_SHA256 || JSON.stringify(pack.sources[1].pdf_pages) !== JSON.stringify([51, 52])) throw new Error("Masika Durgashtami fixed-source drift");
  const currentUrl = "https://www.drikpanchang.com/vrats/masik-durgashtami-dates.html?geoname-id=1273294&year=2026";
  const current = pack.sources[2];
  if (current.url !== currentUrl || current.observed_fetch?.status !== 200 || current.observed_fetch.final_url !== currentUrl || current.observed_fetch.response_bytes !== 82080 || current.observed_fetch.response_sha256 !== "c4dd71aeb98c5bc76f76878428820ae41158f6d1f4a57096d6abd5982659b47d" || current.observed_fetch.strict_utf8 !== true) throw new Error("Masika Durgashtami current-source drift");
  const pargiter = pack.sources[3];
  if (pargiter.ingestion_plan !== planPath || pargiter.packet_sha256 !== PARGITER_PACKET_SHA256 || !readFileSync(resolve(root, planPath)).toString("utf8").includes('"pilot_id": "markandeya-purana-pargiter-1904-v1"')) throw new Error("Masika Durgashtami Pargiter evidence drift");

  const sourceIds = new Set(SOURCE_IDS);
  if (pack.guides.map((guide) => guide.language_code).join("|") !== "en|hi") throw new Error("Masika Durgashtami language drift");
  for (const guide of pack.guides) {
    if (guide.context_prompts.length !== 4 || guide.tiers.map((tier) => `${tier.tier}:${tier.estimated_minutes}`).join("|") !== "minimum:10|standard:30|elaborate:60") throw new Error(`Masika Durgashtami structure drift: ${guide.guide_id}`);
    for (const tier of guide.tiers) if (tier.materials.some((item) => item.substitutions.length === 0) || tier.steps.some((step, index) => step.ordinal !== index + 1 || step.source_ids.length === 0 || step.source_ids.some((id) => !sourceIds.has(id)))) throw new Error(`Masika Durgashtami evidence drift: ${guide.guide_id}/${tier.tier}`);
  }
  const trueKeys = ["minimum_standard_elaborate_forms_included", "hindi_and_english_included", "substitutions_included", "family_context_prompts_included", "four_month_calendar_lane_and_source_labelled_durga_remembrance_supported", "material_free_and_non_fasting_form_supported"];
  const falseKeys = ["fast_food_dietary_or_medical_guidance_given", "formal_puja_mantra_image_offering_aarti_chandi_recitation_or_homa_prescribed", "kumari_puja_bali_or_harm_instructed", "shardiya_mahashtami_equated_with_every_monthly_ashtami", "bengal_durga_puja_or_other_regional_ashtami_imported", "victory_protection_merit_prosperity_or_other_outcome_guaranteed", "one_devi_story_theology_or_practice_claimed_universal", "all_regional_family_temple_and_sampradaya_variants_complete"];
  if (Object.keys(pack.boundaries).sort().join("|") !== [...trueKeys, ...falseKeys].sort().join("|") || trueKeys.some((key) => pack.boundaries[key] !== true) || falseKeys.some((key) => pack.boundaries[key] !== false)) throw new Error("Masika Durgashtami boundary drift");
  return pack;
}
const pack = loadPack();

export function resolveMasikaDurgashtamiProcedure(request: PracticeGuidanceRequest): RitualProcedureGuide | null {
  if (!OBSERVANCE_SLUGS.includes(request.observanceSlug) || !PAIRS.some((pair) => pair.region_code === request.regionCode && pair.tradition_code === request.traditionCode)) return null;
  const guide = pack.guides.find((candidate) => candidate.language_code === request.languageCode);
  if (!guide) return null;
  return { guideId: guide.guide_id, companionToObservanceSlug: request.observanceSlug, title: guide.title, languageCode: guide.language_code, kind: "contextual_minimum_standard_elaborate_ritual_procedure", summary: guide.summary, familyPracticeNote: guide.family_practice_note, contextPrompts: [...guide.context_prompts], tiers: guide.tiers.map((tier) => ({ tier: tier.tier, label: tier.label, estimatedMinutes: tier.estimated_minutes, materials: tier.materials.map((item) => ({ ...item, substitutions: [...item.substitutions] })), steps: tier.steps.map((step) => ({ ordinal: step.ordinal, instruction: step.instruction, why: step.why, optional: step.optional, sourceIds: [...step.source_ids] })) })), companionReading: null, evidence: { packId: pack.pack_id, packFileSha256: PACK_SHA256, editorialStatus: pack.editorial_status, sourceTextReturnedByApi: false, sources: pack.sources.map((source) => ({ sourceId: source.source_id, title: source.title, publisher: source.publisher, url: source.url, sourceClass: source.source_class, rightsLane: source.rights_lane })) }, boundaries: { minimumStandardElaborateFormsIncluded: true, hindiAndEnglishIncluded: true, substitutionsIncluded: true, familyContextPromptsIncluded: true, formalPriestMantrasIncluded: false, historicalPrescriptionsPromotedAsModernNorms: false, oneUniversalProcedureClaimed: false, allRegionalVariantsComplete: false, allGaneshotsavDaysComplete: false, fourMonthCalendarLaneAndSourceLabelledDurgaRemembranceSupported: true, materialFreeAndNonFastingFormSupported: true, fastFoodDietaryOrMedicalGuidanceGiven: false, formalPujaMantraImageOfferingAartiChandiRecitationOrHomaPrescribed: false, kumariPujaBaliOrHarmInstructed: false, shardiyaMahashtamiEquatedWithEveryMonthlyAshtami: false, bengalDurgaPujaOrOtherRegionalAshtamiImported: false, victoryProtectionMeritProsperityOrOtherOutcomeGuaranteed: false, oneDeviStoryTheologyOrPracticeClaimedUniversal: false } };
}

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PracticeGuidanceRequest, RitualProcedureGuide } from "../domain/practice";

const PACK_SHA256 = "b8d38f8b85277c700df4da480633cbdcf3c86ae6d022babd8daa3facb6d38201";
const FIXTURE_SHA256 = "6c860d6f2d778739c4a25b4b281b03a16975e8d43021baee24c55b1e1b72433d";
const HISTORICAL_SOURCE_SHA256 = "a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b";
const OBSERVANCE_SLUGS = ["aja-ekadashi", "parsva-ekadashi", "indira-ekadashi", "papankusha-ekadashi", "rama-ekadashi", "devutthana-ekadashi", "utpanna-ekadashi"];
const SOURCE_IDS = ["devam-ekadashi-calendar-fixture", "nirnayasindhu-1865-ekadashi-decision-chapter", "iskcon-bangalore-ekadashi-practice", "baps-prabodhini-ekadashi", "drikpanchang-ekadashi-vidhi", "devam-ekadashi-safety-boundary"];
const SUPPORTED_PAIRS = [
  { region_code: "north-india", tradition_code: "smarta-north-india" },
  { region_code: "west-india", tradition_code: "smarta-west-india" },
  { region_code: "south-india", tradition_code: "smarta-south-india" },
  { region_code: "iskcon-india", tradition_code: "vaishnava-iskcon" },
];
const EXPECTED_SCOPE = { region_tradition_pairs: SUPPORTED_PAIRS, language_codes: ["en", "hi"], september_december_2026_calendar_fixture_required: true, family_or_sampradaya_practice_overrides_generic_sequence: true, smarta_and_iskcon_dates_remain_separate: true, fasting_food_medical_and_parana_guidance_excluded: true, mokshada_gita_jayanti_guide_remains_separate: true };

type Source = { source_id: string; title: string; publisher: string; url: string | null; source_class: string; rights_lane: "reference_only" | "derivative_allowed"; artifact_sha256?: string; observed_fetch?: { status: number; final_url: string; response_bytes: number; response_sha256: string; strict_utf8: boolean } };
type Guide = { guide_id: string; language_code: "en" | "hi"; title: string; summary: string; family_practice_note: string; context_prompts: string[]; tiers: Array<{ tier: "minimum" | "standard" | "elaborate"; label: string; estimated_minutes: number; materials: Array<{ item: string; substitutions: string[]; optional: boolean }>; steps: Array<{ ordinal: number; instruction: string; why: string; optional: boolean; source_ids: string[] }> }> };
type Pack = { contract: string; pack_id: string; editorial_status: "internal_beta_research_synthesis"; observance_slugs: string[]; scope: Record<string, unknown>; sources: Source[]; guides: Guide[]; boundaries: Record<string, boolean> };

function loadPack(): Pack {
  const root = resolve(process.cwd(), "../..");
  const bytes = readFileSync(resolve(root, "knowledge_packs/rituals/ekadashi-recurring-devotional-practice-v1.json"));
  if (createHash("sha256").update(bytes).digest("hex") !== PACK_SHA256) throw new Error("Ekadashi practice-pack drift");
  const pack = JSON.parse(bytes.toString("utf8")) as Pack;
  if (pack.contract !== "DEVAM_RECURRING_RITUAL_PROCEDURE_PACK_V1" || pack.pack_id !== "devam-ekadashi-recurring-devotional-practice-v1" || JSON.stringify(pack.observance_slugs) !== JSON.stringify(OBSERVANCE_SLUGS) || JSON.stringify(pack.scope) !== JSON.stringify(EXPECTED_SCOPE)) throw new Error("Ekadashi practice identity drift");
  const fixtureBytes = readFileSync(resolve(root, "knowledge_packs/panchang/ekadashi-delhi-mumbai-chennai-september-december-2026-v1.json"));
  if (createHash("sha256").update(fixtureBytes).digest("hex") !== FIXTURE_SHA256 || pack.sources.map((source) => source.source_id).join("|") !== SOURCE_IDS.join("|") || pack.sources[0].artifact_sha256 !== FIXTURE_SHA256 || pack.sources[1].artifact_sha256 !== HISTORICAL_SOURCE_SHA256) throw new Error("Ekadashi practice source universe drift");
  const observed = pack.sources.slice(2, 5).map((source) => source.observed_fetch);
  if (observed.some((fetch) => !fetch || fetch.status !== 200 || fetch.strict_utf8 !== true || fetch.final_url.length === 0 || !/^[a-f0-9]{64}$/.test(fetch.response_sha256) || fetch.response_bytes <= 0)) throw new Error("Ekadashi living-practice observation drift");
  const sourceIds = new Set(SOURCE_IDS);
  if (pack.guides.map((guide) => guide.language_code).join("|") !== "en|hi") throw new Error("Ekadashi practice language drift");
  for (const guide of pack.guides) {
    if (guide.context_prompts.length !== 4 || guide.tiers.map((tier) => tier.tier).join("|") !== "minimum|standard|elaborate" || guide.tiers.map((tier) => tier.estimated_minutes).join("|") !== "10|30|60") throw new Error(`Ekadashi guide structure drift: ${guide.guide_id}`);
    for (const tier of guide.tiers) if (tier.materials.some((item) => item.substitutions.length === 0) || tier.steps.some((step, index) => step.ordinal !== index + 1 || step.source_ids.length === 0 || step.source_ids.some((id) => !sourceIds.has(id)))) throw new Error(`Ekadashi guide evidence drift: ${guide.guide_id}/${tier.tier}`);
  }
  const trueKeys = ["minimum_standard_elaborate_forms_included", "hindi_and_english_included", "substitutions_included", "family_context_prompts_included", "seven_uncovered_launch_interval_slugs_supported", "three_smarta_and_one_iskcon_profile_pair_supported", "material_free_and_non_fasting_form_supported", "smarta_and_iskcon_calendar_lanes_kept_separate"];
  const falseKeys = ["fast_or_nirjala_regimen_prescribed", "food_or_dietary_rules_given", "medical_guidance_given", "smarta_parana_served", "iskcon_parana_repeated_by_practice_guide", "one_universal_mantra_katha_puja_or_vrata_sequence_claimed", "smarta_and_vaishnava_practices_equated", "named_ekadashi_meanings_stories_or_outcomes_universalized", "sin_removal_merit_liberation_health_prosperity_or_other_outcome_guaranteed", "mokshada_gita_jayanti_guide_merged_or_replaced", "all_smarta_vaishnava_regional_family_and_temple_variants_complete"];
  if (Object.keys(pack.boundaries).sort().join("|") !== [...trueKeys, ...falseKeys].sort().join("|") || trueKeys.some((key) => pack.boundaries[key] !== true) || falseKeys.some((key) => pack.boundaries[key] !== false)) throw new Error("Ekadashi practice boundary drift");
  return pack;
}

const pack = loadPack();

export function resolveEkadashiProcedure(request: PracticeGuidanceRequest): RitualProcedureGuide | null {
  if (!OBSERVANCE_SLUGS.includes(request.observanceSlug) || !SUPPORTED_PAIRS.some((pair) => pair.region_code === request.regionCode && pair.tradition_code === request.traditionCode)) return null;
  const guide = pack.guides.find((candidate) => candidate.language_code === request.languageCode);
  if (!guide) return null;
  return { guideId: guide.guide_id, companionToObservanceSlug: request.observanceSlug, title: guide.title, languageCode: guide.language_code, kind: "contextual_minimum_standard_elaborate_ritual_procedure", summary: guide.summary, familyPracticeNote: guide.family_practice_note, contextPrompts: [...guide.context_prompts], tiers: guide.tiers.map((tier) => ({ tier: tier.tier, label: tier.label, estimatedMinutes: tier.estimated_minutes, materials: tier.materials.map((item) => ({ ...item, substitutions: [...item.substitutions] })), steps: tier.steps.map((step) => ({ ordinal: step.ordinal, instruction: step.instruction, why: step.why, optional: step.optional, sourceIds: [...step.source_ids] })) })), companionReading: null, evidence: { packId: pack.pack_id, packFileSha256: PACK_SHA256, editorialStatus: pack.editorial_status, sourceTextReturnedByApi: false, sources: pack.sources.map((source) => ({ sourceId: source.source_id, title: source.title, publisher: source.publisher, url: source.url, sourceClass: source.source_class, rightsLane: source.rights_lane })) }, boundaries: { minimumStandardElaborateFormsIncluded: true, hindiAndEnglishIncluded: true, substitutionsIncluded: true, familyContextPromptsIncluded: true, formalPriestMantrasIncluded: false, historicalPrescriptionsPromotedAsModernNorms: false, oneUniversalProcedureClaimed: false, allRegionalVariantsComplete: false, allGaneshotsavDaysComplete: false, sevenUncoveredLaunchIntervalSlugsSupported: true, threeSmartaAndOneIskconProfilePairSupported: true, materialFreeAndNonFastingFormSupported: true, smartaAndIskconCalendarLanesKeptSeparate: true, fastOrNirjalaRegimenPrescribed: false, foodOrDietaryRulesGiven: false, medicalGuidanceGiven: false, smartaParanaServed: false, iskconParanaRepeatedByPracticeGuide: false, oneUniversalMantraKathaPujaOrVrataSequenceClaimed: false, smartaAndVaishnavaPracticesEquated: false, namedEkadashiMeaningsStoriesOrOutcomesUniversalized: false, sinRemovalMeritLiberationHealthProsperityOrOtherOutcomeGuaranteed: false, mokshadaGitaJayantiGuideMergedOrReplaced: false } };
}


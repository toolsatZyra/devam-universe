import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PracticeGuidanceRequest, RitualProcedureGuide } from "../domain/practice";

const PACK_SHA256 = "c30c96911c94be42c49d0f15deff5ea477cf14717e0d06d2222a55dc68da666c";
const FIXTURE_SHA256 = "dc150f253eb67a2c7caccba62e20b6c4a3a70cc91e8e48150e1a7d753274ab82";
const SOURCE_IDS = ["devam-govardhana-date-fixture", "iskcon-bangalore-govardhana-puja", "baps-annakut-comparative-context", "devam-govardhana-safety-boundary"];
type Source = { source_id: string; title: string; publisher: string; url: string | null; source_class: string; rights_lane: "reference_only" | "derivative_allowed"; artifact_sha256?: string; observed_fetch?: { status: number; final_url: string; response_bytes: number; response_sha256: string; strict_utf8: boolean }; observed_literals?: Record<string, boolean> };
type Guide = { guide_id: string; language_code: "en" | "hi"; title: string; summary: string; family_practice_note: string; context_prompts: string[]; tiers: Array<{ tier: "minimum" | "standard" | "elaborate"; label: string; estimated_minutes: number; materials: Array<{ item: string; substitutions: string[]; optional: boolean }>; steps: Array<{ ordinal: number; instruction: string; why: string; optional: boolean; source_ids: string[] }> }> };
type Pack = { contract: string; pack_id: string; editorial_status: "internal_beta_research_synthesis"; observance_slug: string; scope: Record<string, unknown>; sources: Source[]; guides: Guide[]; boundaries: Record<string, boolean> };

function loadPack(): Pack {
  const root = resolve(process.cwd(), "../..");
  const bytes = readFileSync(resolve(root, "knowledge_packs/rituals/govardhana-puja-iskcon-participation-v1.json"));
  const hash = createHash("sha256").update(bytes).digest("hex");
  if (hash !== PACK_SHA256) throw new Error(`Govardhana Puja practice-pack drift: ${hash}`);
  const pack = JSON.parse(bytes.toString("utf8")) as Pack;
  const expectedScope = { region_codes: ["iskcon-india"], tradition_codes: ["vaishnava-iskcon"], language_codes: ["en", "hi"], iskcon_bangalore_2026_date_fixture_required: true, temple_or_household_authority_overrides_generic_sequence: true, baps_new_year_annakut_context_is_comparative_not_merged: true };
  if (pack.contract !== "DEVAM_RITUAL_PROCEDURE_PACK_V1" || pack.pack_id !== "devam-govardhana-puja-iskcon-participation-v1" || pack.observance_slug !== "govardhan-puja" || JSON.stringify(pack.scope) !== JSON.stringify(expectedScope)) throw new Error("Govardhana Puja practice identity drift");
  const fixtureHash = createHash("sha256").update(readFileSync(resolve(root, "knowledge_packs/panchang/govardhana-puja-iskcon-2026-v1.json"))).digest("hex");
  if (fixtureHash !== FIXTURE_SHA256 || pack.sources.map((source) => source.source_id).join("|") !== SOURCE_IDS.join("|") || pack.sources[0].artifact_sha256 !== FIXTURE_SHA256) throw new Error("Govardhana Puja source fixture drift");
  for (const source of pack.sources.filter((candidate) => candidate.observed_fetch)) {
    if (source.observed_fetch?.status !== 200 || source.observed_fetch.final_url !== source.url || source.observed_fetch.response_bytes <= 0 || !/^[0-9a-f]{64}$/.test(source.observed_fetch.response_sha256) || !source.observed_fetch.strict_utf8 || Object.values(source.observed_literals ?? {}).some((value) => !value)) throw new Error(`Govardhana Puja live observation drift: ${source.source_id}`);
  }
  const sourceIds = new Set(SOURCE_IDS);
  if (pack.guides.map((guide) => guide.language_code).join("|") !== "en|hi") throw new Error("Govardhana Puja language drift");
  for (const guide of pack.guides) {
    if (guide.context_prompts.length !== 4 || guide.tiers.map((tier) => tier.tier).join("|") !== "minimum|standard|elaborate" || guide.tiers.map((tier) => tier.estimated_minutes).join("|") !== "10|30|90") throw new Error(`Govardhana Puja guide structure drift: ${guide.guide_id}`);
    for (const tier of guide.tiers) if (tier.materials.some((item) => !item.substitutions.length) || tier.steps.some((step, index) => step.ordinal !== index + 1 || !step.source_ids.length || step.source_ids.some((id) => !sourceIds.has(id)))) throw new Error(`Govardhana Puja evidence drift: ${guide.guide_id}/${tier.tier}`);
  }
  const trueKeys = ["minimum_standard_elaborate_forms_included", "hindi_and_english_included", "substitutions_included", "family_context_prompts_included", "prayer_kirtan_simple_vegetarian_offering_supported"];
  const falseKeys = ["formal_mantras_included", "go_puja_or_cow_contact_instruction_included", "fasting_prescribed", "long_or_barefoot_parikrama_instructed", "large_food_array_required", "bali_pratipada_merged", "baps_new_year_sequence_merged", "one_universal_govardhana_or_annakut_procedure_claimed", "all_vaishnava_and_regional_variants_complete"];
  if (trueKeys.some((key) => pack.boundaries[key] !== true) || falseKeys.some((key) => pack.boundaries[key] !== false)) throw new Error("Govardhana Puja boundary drift");
  return pack;
}

const pack = loadPack();
export function resolveGovardhanaPujaProcedure(request: PracticeGuidanceRequest): RitualProcedureGuide | null {
  if (request.observanceSlug !== "govardhan-puja" || request.regionCode !== "iskcon-india" || request.traditionCode !== "vaishnava-iskcon") return null;
  const guide = pack.guides.find((candidate) => candidate.language_code === request.languageCode);
  if (!guide) return null;
  return {
    guideId: guide.guide_id, companionToObservanceSlug: pack.observance_slug, title: guide.title, languageCode: guide.language_code, kind: "contextual_minimum_standard_elaborate_ritual_procedure", summary: guide.summary, familyPracticeNote: guide.family_practice_note, contextPrompts: [...guide.context_prompts],
    tiers: guide.tiers.map((tier) => ({ tier: tier.tier, label: tier.label, estimatedMinutes: tier.estimated_minutes, materials: tier.materials.map((item) => ({ ...item, substitutions: [...item.substitutions] })), steps: tier.steps.map((step) => ({ ordinal: step.ordinal, instruction: step.instruction, why: step.why, optional: step.optional, sourceIds: [...step.source_ids] })) })),
    companionReading: null,
    evidence: { packId: pack.pack_id, packFileSha256: PACK_SHA256, editorialStatus: pack.editorial_status, sourceTextReturnedByApi: false, sources: pack.sources.map((source) => ({ sourceId: source.source_id, title: source.title, publisher: source.publisher, url: source.url, sourceClass: source.source_class, rightsLane: source.rights_lane })) },
    boundaries: { minimumStandardElaborateFormsIncluded: true, hindiAndEnglishIncluded: true, substitutionsIncluded: true, familyContextPromptsIncluded: true, formalPriestMantrasIncluded: false, historicalPrescriptionsPromotedAsModernNorms: false, oneUniversalProcedureClaimed: false, allRegionalVariantsComplete: false, allGaneshotsavDaysComplete: false, prayerKirtanSimpleVegetarianOfferingSupported: true, goPujaOrCowContactInstructionIncluded: false, fastingPrescribed: false, longOrBarefootParikramaInstructed: false, largeFoodArrayRequired: false, baliPratipadaMerged: false, bapsNewYearSequenceMerged: false, allVaishnavaAndRegionalVariantsComplete: false },
  };
}

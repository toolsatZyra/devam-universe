import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PracticeGuidanceRequest, RitualProcedureGuide } from "../domain/practice";

const PACK_SHA256 = "be58e4a855f090c8fba3ac965859df5a8b066e4d70746b6093feef90caada09c";
const FIXTURE_SHA256 = "afa7230ef7879b18a6dac1653e416db978946cc0c03c40ba7f0cefc0f54603f5";
const SOURCE_IDS = ["devam-gujarati-new-year-date-fixture", "baps-festival-list-2026-new-year", "baps-nutan-varsh-new-year-annakut", "akashvani-gujarati-new-year-context", "devam-gujarati-new-year-safety-boundary"];
const EXPECTED_SCOPE = { region_codes: ["baps-gujarat"], tradition_codes: ["swaminarayan-baps"], language_codes: ["en", "hi"], ahmedabad_2026_date_fixture_required: true, baps_family_or_mandir_participation_only: true, family_or_mandir_custom_overrides_generic_sequence: true, one_simple_vegetarian_offering_only_when_already_established: true, bali_pratipada_govardhana_and_balipadyami_not_merged: true };

type Source = { source_id: string; title: string; publisher: string; url: string | null; source_class: string; rights_lane: "reference_only" | "derivative_allowed"; artifact_sha256?: string };
type Guide = { guide_id: string; language_code: "en" | "hi"; title: string; summary: string; family_practice_note: string; context_prompts: string[]; tiers: Array<{ tier: "minimum" | "standard" | "elaborate"; label: string; estimated_minutes: number; materials: Array<{ item: string; substitutions: string[]; optional: boolean }>; steps: Array<{ ordinal: number; instruction: string; why: string; optional: boolean; source_ids: string[] }> }> };
type Pack = { contract: string; pack_id: string; editorial_status: "internal_beta_research_synthesis"; observance_slug: string; scope: Record<string, unknown>; sources: Source[]; guides: Guide[]; boundaries: Record<string, boolean> };

function loadPack(): Pack {
  const root = resolve(process.cwd(), "../..");
  const bytes = readFileSync(resolve(root, "knowledge_packs/rituals/gujarati-new-year-baps-family-v1.json"));
  if (createHash("sha256").update(bytes).digest("hex") !== PACK_SHA256) throw new Error("Gujarati New Year practice-pack drift");
  const pack = JSON.parse(bytes.toString("utf8")) as Pack;
  if (pack.contract !== "DEVAM_RITUAL_PROCEDURE_PACK_V1" || pack.pack_id !== "devam-gujarati-new-year-baps-family-v1" || pack.observance_slug !== "gujarati-new-year-baps" || JSON.stringify(pack.scope) !== JSON.stringify(EXPECTED_SCOPE)) throw new Error("Gujarati New Year practice identity drift");
  if (createHash("sha256").update(readFileSync(resolve(root, "knowledge_packs/panchang/gujarati-new-year-ahmedabad-baps-2026-v1.json"))).digest("hex") !== FIXTURE_SHA256 || pack.sources.map((source) => source.source_id).join("|") !== SOURCE_IDS.join("|") || pack.sources[0].artifact_sha256 !== FIXTURE_SHA256) throw new Error("Gujarati New Year source universe drift");
  const sourceIds = new Set(SOURCE_IDS);
  if (pack.guides.map((guide) => guide.language_code).join("|") !== "en|hi") throw new Error("Gujarati New Year language drift");
  for (const guide of pack.guides) {
    if (guide.context_prompts.length !== 4 || guide.tiers.map((tier) => tier.tier).join("|") !== "minimum|standard|elaborate" || guide.tiers.map((tier) => tier.estimated_minutes).join("|") !== "10|30|75") throw new Error(`Gujarati New Year guide structure drift: ${guide.guide_id}`);
    for (const tier of guide.tiers) if (tier.materials.some((item) => item.substitutions.length === 0) || tier.steps.some((step, index) => step.ordinal !== index + 1 || step.source_ids.length === 0 || step.source_ids.some((id) => !sourceIds.has(id)))) throw new Error(`Gujarati New Year evidence drift: ${guide.guide_id}/${tier.tier}`);
  }
  const trueKeys = ["minimum_standard_elaborate_forms_included", "hindi_and_english_included", "substitutions_included", "family_context_prompts_included", "baps_family_or_mandir_prayer_gratitude_greetings_and_seva_supported", "one_simple_home_offering_when_already_established_supported"];
  const falseKeys = ["formal_annakut_thal_aarti_or_mantras_included", "large_food_array_required", "business_account_book_puja_required", "new_clothes_purchase_sweets_or_gift_required", "real_flame_required", "wealth_success_or_prosperity_guaranteed", "bali_pratipada_merged", "govardhana_puja_merged", "south_indian_balipadyami_merged", "one_universal_gujarat_or_hindu_new_year_procedure_claimed", "all_gujarati_family_variants_complete"];
  if (Object.keys(pack.boundaries).sort().join("|") !== [...trueKeys, ...falseKeys].sort().join("|") || trueKeys.some((key) => pack.boundaries[key] !== true) || falseKeys.some((key) => pack.boundaries[key] !== false)) throw new Error("Gujarati New Year boundary drift");
  return pack;
}

const pack = loadPack();

export function resolveGujaratiNewYearProcedure(request: PracticeGuidanceRequest): RitualProcedureGuide | null {
  if (request.observanceSlug !== "gujarati-new-year-baps" || request.regionCode !== "baps-gujarat" || request.traditionCode !== "swaminarayan-baps") return null;
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
    boundaries: { minimumStandardElaborateFormsIncluded: true, hindiAndEnglishIncluded: true, substitutionsIncluded: true, familyContextPromptsIncluded: true, formalPriestMantrasIncluded: false, historicalPrescriptionsPromotedAsModernNorms: false, oneUniversalProcedureClaimed: false, allRegionalVariantsComplete: false, allGaneshotsavDaysComplete: false, bapsFamilyOrMandirPrayerGratitudeGreetingsAndSevaSupported: true, oneSimpleHomeOfferingWhenAlreadyEstablishedSupported: true, formalAnnakutThalAartiOrMantrasIncluded: false, largeFoodArrayRequired: false, businessAccountBookPujaRequired: false, newClothesPurchaseSweetsOrGiftRequired: false, realFlameRequired: false, wealthSuccessOrProsperityGuaranteed: false, baliPratipadaMerged: false, govardhanaPujaMerged: false, southIndianBalipadyamiMerged: false },
  };
}

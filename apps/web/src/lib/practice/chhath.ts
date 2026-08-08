import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PracticeGuidanceRequest, RitualProcedureGuide } from "../domain/practice";

const PACK_FILE_SHA256 = "f3b084e79a31ea1b503953d120555b52c35ce400add5f9a4777d6fefdb43dc82";
const CONTRACT = "DEVAM_RITUAL_PROCEDURE_PACK_V1" as const;
const TIER_ORDER = ["minimum", "standard", "elaborate"] as const;

type Pack = {
  contract: typeof CONTRACT;
  pack_id: "devam-chhath-bihar-purvanchal-v1";
  editorial_status: "internal_beta_research_synthesis";
  observance_slug: "chhath-puja-sandhya-arghya";
  scope: {
    region_codes: ["bihar-purvanchal"];
    tradition_codes: ["surya-chhath-bihar-purvanchal"];
    language_codes: ["en", "hi"];
    family_and_parvaitin_guidance_overrides_generic_sequence: true;
    exact_patna_or_delhi_reference_profile_required_for_calendar_date: true;
  };
  sources: Array<{ source_id: string; title: string; publisher: string; url: string | null; source_class: string; rights_lane: "reference_only" | "derivative_allowed" }>;
  guides: Array<{
    guide_id: string;
    language_code: "en" | "hi";
    title: string;
    summary: string;
    family_practice_note: string;
    context_prompts: string[];
    tiers: Array<{
      tier: "minimum" | "standard" | "elaborate";
      label: string;
      estimated_minutes: number;
      materials: Array<{ item: string; substitutions: string[]; optional: boolean }>;
      steps: Array<{ ordinal: number; instruction: string; why: string; optional: boolean; source_ids: string[] }>;
    }>;
  }>;
  boundaries: Record<string, boolean>;
};

function loadPack(): Pack {
  const path = resolve(process.cwd(), "../..", "knowledge_packs/rituals/chhath-bihar-purvanchal-v1.json");
  const bytes = readFileSync(path);
  const actual = createHash("sha256").update(bytes).digest("hex");
  if (actual !== PACK_FILE_SHA256) throw new Error(`Chhath practice-pack drift: ${actual}`);
  const pack = JSON.parse(bytes.toString("utf8")) as Pack;
  if (pack.contract !== CONTRACT || pack.pack_id !== "devam-chhath-bihar-purvanchal-v1" || pack.observance_slug !== "chhath-puja-sandhya-arghya" || pack.editorial_status !== "internal_beta_research_synthesis") throw new Error("Chhath practice-pack identity drift");
  if (JSON.stringify(pack.scope) !== JSON.stringify({ region_codes: ["bihar-purvanchal"], tradition_codes: ["surya-chhath-bihar-purvanchal"], language_codes: ["en", "hi"], family_and_parvaitin_guidance_overrides_generic_sequence: true, exact_patna_or_delhi_reference_profile_required_for_calendar_date: true })) throw new Error("Chhath practice scope drift");
  if (pack.sources.length !== 4 || new Set(pack.sources.map((source) => source.source_id)).size !== 4) throw new Error("Chhath practice source universe drift");
  const sourceIds = new Set(pack.sources.map((source) => source.source_id));
  if (pack.guides.length !== 2 || pack.guides.map((guide) => guide.language_code).join("|") !== "en|hi") throw new Error("Chhath practice language universe drift");
  for (const guide of pack.guides) {
    if (guide.context_prompts.length !== 4 || guide.tiers.map((tier) => tier.tier).join("|") !== TIER_ORDER.join("|")) throw new Error(`Chhath guide structure drift: ${guide.guide_id}`);
    for (const tier of guide.tiers) {
      if (tier.steps.length < 3 || tier.steps.map((step) => step.ordinal).join("|") !== tier.steps.map((_, index) => index + 1).join("|")) throw new Error(`Chhath step order drift: ${guide.guide_id}/${tier.tier}`);
      if (tier.steps.some((step) => step.source_ids.length === 0 || step.source_ids.some((sourceId) => !sourceIds.has(sourceId)))) throw new Error(`Chhath step evidence drift: ${guide.guide_id}/${tier.tier}`);
      if (tier.materials.some((material) => material.substitutions.length === 0)) throw new Error(`Chhath substitution drift: ${guide.guide_id}/${tier.tier}`);
    }
  }
  const requiredTrue = ["minimum_standard_elaborate_forms_included", "hindi_and_english_included", "substitutions_included", "family_context_prompts_included", "four_day_sequence_included"];
  const requiredFalse = ["formal_priest_mantras_included", "fasting_or_nirjala_regimen_prescribed", "medical_suitability_claimed", "direct_sun_gazing_instructed", "unsafe_water_entry_instructed", "one_universal_procedure_claimed", "all_regional_and_family_variants_complete", "newcomer_minimum_form_claimed_equivalent_to_full_vrata"];
  if (requiredTrue.some((key) => pack.boundaries[key] !== true) || requiredFalse.some((key) => pack.boundaries[key] !== false)) throw new Error("Chhath practice boundary drift");
  return pack;
}

const pack = loadPack();

export function resolveChhathProcedure(request: PracticeGuidanceRequest): RitualProcedureGuide | null {
  if (request.observanceSlug !== pack.observance_slug || request.regionCode !== "bihar-purvanchal" || request.traditionCode !== "surya-chhath-bihar-purvanchal") return null;
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
    tiers: guide.tiers.map((tier) => ({
      tier: tier.tier,
      label: tier.label,
      estimatedMinutes: tier.estimated_minutes,
      materials: tier.materials.map((material) => ({ ...material, substitutions: [...material.substitutions] })),
      steps: tier.steps.map((step) => ({ ordinal: step.ordinal, instruction: step.instruction, why: step.why, optional: step.optional, sourceIds: [...step.source_ids] })),
    })),
    companionReading: null,
    evidence: {
      packId: pack.pack_id,
      packFileSha256: PACK_FILE_SHA256,
      editorialStatus: pack.editorial_status,
      sourceTextReturnedByApi: false,
      sources: pack.sources.map((source) => ({ sourceId: source.source_id, title: source.title, publisher: source.publisher, url: source.url, sourceClass: source.source_class, rightsLane: source.rights_lane })),
    },
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
      fourDaySequenceIncluded: true,
      fastingOrNirjalaRegimenPrescribed: false,
      medicalSuitabilityClaimed: false,
      directSunGazingInstructed: false,
      unsafeWaterEntryInstructed: false,
      newcomerMinimumFormClaimedEquivalentToFullVrata: false,
    },
  };
}

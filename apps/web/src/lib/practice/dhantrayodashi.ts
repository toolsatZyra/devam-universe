import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PracticeGuidanceRequest, RitualProcedureGuide } from "../domain/practice";

const PACK_FILE_SHA256 = "b795c9302c3d809266974d0e9a8ed30f5e4e2b6542aceb3acd3d1a39d4e3bee0";
const DATE_FIXTURE_SHA256 = "c88547ab6e858c28ed6b60f209ff26ca1194d1e6820e3c5c6fce958b72d7347a";
const TIER_ORDER = ["minimum", "standard", "elaborate"] as const;

type Source = { source_id: string; title: string; publisher: string; url: string | null; source_class: string; rights_lane: "reference_only" | "derivative_allowed"; artifact_sha256?: string };
type Guide = {
  guide_id: string;
  language_code: "en" | "hi";
  title: string;
  summary: string;
  family_practice_note: string;
  context_prompts: string[];
  tiers: Array<{ tier: "minimum" | "standard" | "elaborate"; label: string; estimated_minutes: number; materials: Array<{ item: string; substitutions: string[]; optional: boolean }>; steps: Array<{ ordinal: number; instruction: string; why: string; optional: boolean; source_ids: string[] }> }>;
};
type Pack = {
  contract: "DEVAM_RITUAL_PROCEDURE_PACK_V1";
  pack_id: "devam-dhantrayodashi-north-west-india-v1";
  editorial_status: "internal_beta_research_synthesis";
  observance_slug: "dhantrayodashi";
  scope: { region_codes: ["north-india", "west-india"]; tradition_codes: ["smarta-north-india", "smarta-west-india"]; language_codes: ["en", "hi"]; family_custom_overrides_generic_sequence: true; precise_muhurta_requires_separate_local_calendar: true };
  sources: Source[];
  guides: Guide[];
  boundaries: Record<string, boolean>;
};

function loadPack(): Pack {
  const path = resolve(process.cwd(), "../..", "knowledge_packs/rituals/dhantrayodashi-north-west-india-v1.json");
  const bytes = readFileSync(path);
  const actual = createHash("sha256").update(bytes).digest("hex");
  if (actual !== PACK_FILE_SHA256) throw new Error(`Dhantrayodashi practice-pack drift: ${actual}`);
  const pack = JSON.parse(bytes.toString("utf8")) as Pack;
  if (pack.contract !== "DEVAM_RITUAL_PROCEDURE_PACK_V1" || pack.pack_id !== "devam-dhantrayodashi-north-west-india-v1" || pack.observance_slug !== "dhantrayodashi" || pack.editorial_status !== "internal_beta_research_synthesis") throw new Error("Dhantrayodashi practice-pack identity drift");
  if (JSON.stringify(pack.scope) !== JSON.stringify({ region_codes: ["north-india", "west-india"], tradition_codes: ["smarta-north-india", "smarta-west-india"], language_codes: ["en", "hi"], family_custom_overrides_generic_sequence: true, precise_muhurta_requires_separate_local_calendar: true })) throw new Error("Dhantrayodashi practice scope drift");
  if (pack.sources.length !== 4 || new Set(pack.sources.map((source) => source.source_id)).size !== 4 || pack.sources[0].artifact_sha256 !== DATE_FIXTURE_SHA256) throw new Error("Dhantrayodashi source universe drift");
  const datePath = resolve(process.cwd(), "../..", "knowledge_packs/panchang/dhantrayodashi-delhi-2026-v1.json");
  if (createHash("sha256").update(readFileSync(datePath)).digest("hex") !== DATE_FIXTURE_SHA256) throw new Error("Dhantrayodashi date-fixture drift");
  const sourceIds = new Set(pack.sources.map((source) => source.source_id));
  if (pack.guides.length !== 2 || pack.guides.map((guide) => guide.language_code).join("|") !== "en|hi") throw new Error("Dhantrayodashi language universe drift");
  for (const guide of pack.guides) {
    if (guide.context_prompts.length !== 4 || guide.tiers.map((tier) => tier.tier).join("|") !== TIER_ORDER.join("|")) throw new Error(`Dhantrayodashi guide structure drift: ${guide.guide_id}`);
    for (const tier of guide.tiers) {
      if (tier.steps.map((step) => step.ordinal).join("|") !== tier.steps.map((_, index) => index + 1).join("|") || tier.steps.some((step) => step.source_ids.length === 0 || step.source_ids.some((sourceId) => !sourceIds.has(sourceId)))) throw new Error(`Dhantrayodashi step evidence drift: ${guide.guide_id}/${tier.tier}`);
      if (tier.materials.some((material) => material.substitutions.length === 0)) throw new Error(`Dhantrayodashi substitution drift: ${guide.guide_id}/${tier.tier}`);
    }
  }
  const requiredTrue = ["minimum_standard_elaborate_forms_included", "hindi_and_english_included", "substitutions_included", "family_context_prompts_included"];
  const requiredFalse = ["formal_priest_mantras_included", "fasting_or_medical_regimen_prescribed", "shopping_or_purchase_required", "financial_advice_included", "guaranteed_wealth_or_health_outcome_claimed", "precise_muhurta_calculated", "yama_deepam_merged_or_completed", "one_universal_deity_set_or_procedure_claimed", "all_regional_variants_complete"];
  if (requiredTrue.some((key) => pack.boundaries[key] !== true) || requiredFalse.some((key) => pack.boundaries[key] !== false)) throw new Error("Dhantrayodashi practice boundary drift");
  return pack;
}

const pack = loadPack();

export function resolveDhantrayodashiProcedure(request: PracticeGuidanceRequest): RitualProcedureGuide | null {
  const validPair = (request.regionCode === "north-india" && request.traditionCode === "smarta-north-india")
    || (request.regionCode === "west-india" && request.traditionCode === "smarta-west-india");
  if (request.observanceSlug !== "dhantrayodashi" || !validPair) return null;
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
    tiers: guide.tiers.map((tier) => ({ tier: tier.tier, label: tier.label, estimatedMinutes: tier.estimated_minutes, materials: tier.materials.map((material) => ({ ...material, substitutions: [...material.substitutions] })), steps: tier.steps.map((step) => ({ ordinal: step.ordinal, instruction: step.instruction, why: step.why, optional: step.optional, sourceIds: [...step.source_ids] })) })),
    companionReading: null,
    evidence: { packId: pack.pack_id, packFileSha256: PACK_FILE_SHA256, editorialStatus: pack.editorial_status, sourceTextReturnedByApi: false, sources: pack.sources.map((source) => ({ sourceId: source.source_id, title: source.title, publisher: source.publisher, url: source.url, sourceClass: source.source_class, rightsLane: source.rights_lane })) },
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
      fastingOrMedicalRegimenPrescribed: false,
      shoppingOrPurchaseRequired: false,
      financialAdviceIncluded: false,
      guaranteedWealthOrHealthOutcomeClaimed: false,
      preciseMuhurtaCalculated: false,
      yamaDeepamMergedOrCompleted: false,
      oneUniversalDeitySetClaimed: false,
    },
  };
}

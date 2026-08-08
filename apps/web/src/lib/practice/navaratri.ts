import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PracticeGuidanceRequest, RitualProcedureGuide } from "../domain/practice";

const PACK_FILE_SHA256 = "d25a2d4d1d16fe56e119ff78ad03d6d825ef09c5a40611c03e411ddb995fcbb9";
const CONTRACT = "DEVAM_RITUAL_PROCEDURE_PACK_V1" as const;
const TIER_ORDER = ["minimum", "standard", "elaborate"] as const;

type PackSource = {
  source_id: string;
  title: string;
  publisher: string;
  url: string | null;
  source_class: string;
  rights_lane: "reference_only" | "private_evidence" | "derivative_allowed";
};

type PackGuide = {
  guide_id: string;
  language_code: "en" | "hi";
  title: string;
  summary: string;
  family_practice_note: string;
  context_prompts: string[];
  tiers: {
    tier: "minimum" | "standard" | "elaborate";
    label: string;
    estimated_minutes: number;
    materials: { item: string; substitutions: string[]; optional: boolean }[];
    steps: { ordinal: number; instruction: string; why: string; optional: boolean; source_ids: string[] }[];
  }[];
  daily_sequence: {
    ordinal: number;
    common_name: string;
    reflection: string;
    ritual_requirement: false;
    source_ids: string[];
  }[];
};

type Pack = {
  contract: typeof CONTRACT;
  pack_id: string;
  editorial_status: "internal_beta_research_synthesis";
  observance_slug: "shardiya-navaratri-begins";
  scope: { region_codes: string[]; tradition_codes: string[]; language_codes: ("en" | "hi")[] };
  sources: PackSource[];
  guides: PackGuide[];
  boundaries: Record<string, boolean> & {
    minimum_standard_elaborate_forms_included: true;
    hindi_and_english_included: true;
    substitutions_included: true;
    family_context_prompts_included: true;
    ten_day_reflection_sequence_included: true;
    reflections_are_mandatory_ritual_claims: false;
    formal_priest_mantras_included: false;
    continuous_flame_prescribed_without_supervision: false;
    fasting_or_medical_regimen_prescribed: false;
    historical_prescriptions_promoted_as_modern_norms: false;
    one_universal_procedure_claimed: false;
    all_regional_variants_complete: false;
    bengali_durga_puja_included: false;
    south_indian_golu_included: false;
    gujarati_garba_included: false;
    nepal_dashain_included: false;
    all_navaratri_days_calendar_resolved: false;
  };
};

function loadPack(): Pack {
  const path = resolve(process.cwd(), "../..", "knowledge_packs/rituals/shardiya-navaratri-north-west-india-v1.json");
  const bytes = readFileSync(path);
  const actual = createHash("sha256").update(bytes).digest("hex");
  if (actual !== PACK_FILE_SHA256) throw new Error(`Shardiya Navaratri ritual-pack drift: ${actual}`);
  const pack = JSON.parse(bytes.toString("utf8")) as Pack;
  if (pack.contract !== CONTRACT || pack.observance_slug !== "shardiya-navaratri-begins") throw new Error("Shardiya Navaratri ritual-pack identity drift");
  if (pack.guides.length !== 2 || pack.sources.length !== 6) throw new Error("Shardiya Navaratri ritual-pack universe drift");
  const sourceIds = new Set(pack.sources.map((source) => source.source_id));
  if (sourceIds.size !== pack.sources.length) throw new Error("Duplicate Shardiya Navaratri source ID");
  for (const guide of pack.guides) {
    if (guide.tiers.map((tier) => tier.tier).join("|") !== TIER_ORDER.join("|")) throw new Error(`Navaratri tier-order drift: ${guide.guide_id}`);
    if (guide.daily_sequence.map((day) => day.ordinal).join("|") !== "1|2|3|4|5|6|7|8|9|10") throw new Error(`Navaratri day-order drift: ${guide.guide_id}`);
    for (const tier of guide.tiers) {
      if (tier.steps.map((step) => step.ordinal).join("|") !== tier.steps.map((_, index) => index + 1).join("|")) throw new Error(`Navaratri step-order drift: ${guide.guide_id}/${tier.tier}`);
      if (tier.steps.some((step) => step.source_ids.length === 0 || step.source_ids.some((sourceId) => !sourceIds.has(sourceId)))) throw new Error(`Navaratri source binding drift: ${guide.guide_id}/${tier.tier}`);
    }
    if (guide.daily_sequence.some((day) => day.ritual_requirement !== false || day.source_ids.length === 0 || day.source_ids.some((sourceId) => !sourceIds.has(sourceId)))) throw new Error(`Navaratri day binding drift: ${guide.guide_id}`);
  }
  const requiredFalse = [
    "reflections_are_mandatory_ritual_claims", "formal_priest_mantras_included",
    "continuous_flame_prescribed_without_supervision", "fasting_or_medical_regimen_prescribed",
    "historical_prescriptions_promoted_as_modern_norms", "one_universal_procedure_claimed",
    "all_regional_variants_complete", "bengali_durga_puja_included", "south_indian_golu_included",
    "gujarati_garba_included", "nepal_dashain_included", "all_navaratri_days_calendar_resolved",
  ];
  if (requiredFalse.some((key) => pack.boundaries[key] !== false)) throw new Error("Shardiya Navaratri denial drift");
  return pack;
}

const pack = loadPack();

export function resolveNavaratriProcedure(request: PracticeGuidanceRequest): RitualProcedureGuide | null {
  const supportedPair = (request.regionCode === "north-india" && request.traditionCode === "smarta-north-india")
    || (request.regionCode === "west-india" && request.traditionCode === "smarta-west-india");
  const guide = pack.guides.find((candidate) => candidate.language_code === request.languageCode);
  if (request.observanceSlug !== pack.observance_slug || !supportedPair || !guide) return null;

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
    dailySequence: guide.daily_sequence.map((day) => ({
      ordinal: day.ordinal,
      commonName: day.common_name,
      reflection: day.reflection,
      ritualRequirement: false,
      sourceIds: [...day.source_ids],
    })),
    companionReading: null,
    evidence: {
      packId: pack.pack_id,
      packFileSha256: PACK_FILE_SHA256,
      editorialStatus: pack.editorial_status,
      sourceTextReturnedByApi: false,
      sources: pack.sources.map((source) => ({
        sourceId: source.source_id,
        title: source.title,
        publisher: source.publisher,
        url: source.url,
        sourceClass: source.source_class,
        rightsLane: source.rights_lane,
      })),
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
      tenDayReflectionSequenceIncluded: true,
      reflectionsAreMandatoryRitualClaims: false,
      continuousFlamePrescribedWithoutSupervision: false,
      fastingOrMedicalRegimenPrescribed: false,
      bengaliDurgaPujaIncluded: false,
      southIndianGoluIncluded: false,
      gujaratiGarbaIncluded: false,
      nepalDashainIncluded: false,
      allNavaratriDaysCalendarResolved: false,
    },
  };
}

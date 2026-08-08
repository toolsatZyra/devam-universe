import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PracticeGuidanceRequest, RitualProcedureGuide } from "../domain/practice";

const PACK_FILE_SHA256 = "c73343da9b873400ed7bcc307b30aedb7de751c38c6e672ac41f98de05b389c1";
const CONTRACT = "DEVAM_RITUAL_PROCEDURE_PACK_V1" as const;
const TIER_ORDER = ["minimum", "standard", "elaborate"] as const;
const CALENDAR_STATUSES = ["resolved_for_bounded_2026_context", "partially_resolved_distinct_lanes", "editorial_sequence_only"] as const;
const CURRENT_CALENDAR_NOTE_BY_ORDINAL = new Map<number, string>([
  [2, "Dhantrayodashi and Yama Deepam are separate resolved date records with separate bounded North/West household guides; wider Dhanvantari, regional, family, and formal practices remain open."],
]);

type PackSource = {
  source_id: string;
  title: string;
  publisher: string;
  url: string;
  source_class: string;
  rights_lane: "reference_only" | "private_evidence";
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
    calendar_status: typeof CALENDAR_STATUSES[number];
    calendar_note: string;
  }[];
};

type Pack = {
  contract: typeof CONTRACT;
  pack_id: string;
  editorial_status: "internal_beta_research_synthesis";
  observance_slug: "diwali-lakshmi-puja";
  scope: {
    region_codes: ["west-india"];
    tradition_codes: ["smarta-west-india"];
    language_codes: ["en", "hi"];
    family_custom_overrides_generic_sequence: true;
    precise_muhurta_requires_separate_local_calendar: true;
  };
  sources: PackSource[];
  guides: PackGuide[];
  boundaries: Record<string, boolean>;
};

function loadPack(): Pack {
  const path = resolve(process.cwd(), "../..", "knowledge_packs/rituals/diwali-lakshmi-puja-west-india-v1.json");
  const bytes = readFileSync(path);
  const actual = createHash("sha256").update(bytes).digest("hex");
  if (actual !== PACK_FILE_SHA256) throw new Error(`Diwali ritual-pack drift: ${actual}`);
  const pack = JSON.parse(bytes.toString("utf8")) as Pack;
  if (pack.contract !== CONTRACT || pack.pack_id !== "devam-diwali-lakshmi-puja-west-india-v1" || pack.observance_slug !== "diwali-lakshmi-puja") throw new Error("Diwali ritual-pack identity drift");
  if (pack.sources.length !== 4 || pack.guides.length !== 2) throw new Error("Diwali ritual-pack universe drift");
  if (pack.scope.region_codes.join("|") !== "west-india" || pack.scope.tradition_codes.join("|") !== "smarta-west-india" || pack.scope.language_codes.join("|") !== "en|hi") throw new Error("Diwali ritual-pack scope drift");
  if (pack.scope.family_custom_overrides_generic_sequence !== true || pack.scope.precise_muhurta_requires_separate_local_calendar !== true) throw new Error("Diwali ritual-pack context boundary drift");
  const sourceIds = new Set(pack.sources.map((source) => source.source_id));
  if (sourceIds.size !== pack.sources.length) throw new Error("Duplicate Diwali source ID");
  for (const guide of pack.guides) {
    if (guide.tiers.map((tier) => tier.tier).join("|") !== TIER_ORDER.join("|") || guide.daily_sequence.length !== 6) throw new Error(`Diwali guide universe drift: ${guide.guide_id}`);
    if (guide.daily_sequence.map((day) => day.ordinal).join("|") !== "1|2|3|4|5|6") throw new Error(`Diwali day order drift: ${guide.guide_id}`);
    for (const tier of guide.tiers) {
      if (tier.steps.map((step) => step.ordinal).join("|") !== tier.steps.map((_, index) => index + 1).join("|")) throw new Error(`Diwali step order drift: ${guide.guide_id}/${tier.tier}`);
      if (tier.steps.some((step) => step.source_ids.length === 0 || step.source_ids.some((sourceId) => !sourceIds.has(sourceId)))) throw new Error(`Diwali step source drift: ${guide.guide_id}/${tier.tier}`);
    }
    if (guide.daily_sequence.some((day) => day.ritual_requirement !== false || !CALENDAR_STATUSES.includes(day.calendar_status) || !day.calendar_note || day.source_ids.length === 0 || day.source_ids.some((sourceId) => !sourceIds.has(sourceId)))) throw new Error(`Diwali sequence evidence drift: ${guide.guide_id}`);
    if (guide.daily_sequence.filter((day) => day.calendar_status === "resolved_for_bounded_2026_context").map((day) => day.ordinal).join("|") !== "4") throw new Error(`Diwali sequence resolution boundary drift: ${guide.guide_id}`);
  }
  const requiredTrue = ["minimum_standard_elaborate_forms_included", "hindi_and_english_included", "substitutions_included", "family_context_prompts_included", "status_labelled_diwali_sequence_included"];
  const requiredFalse = ["formal_priest_mantras_included", "fasting_or_medical_regimen_prescribed", "fireworks_required_or_recommended", "precise_muhurta_calculated", "guaranteed_wealth_outcome_claimed", "historical_prescriptions_promoted_as_modern_norms", "one_universal_procedure_claimed", "all_regional_variants_complete", "dhanteras_and_dhanvantari_lane_complete", "bengali_kali_puja_included", "south_indian_deepavali_included", "jain_diwali_included", "bandi_chhor_divas_included", "nepal_tihar_included"];
  if (requiredTrue.some((key) => pack.boundaries[key] !== true) || requiredFalse.some((key) => pack.boundaries[key] !== false)) throw new Error("Diwali ritual-pack denial drift");
  return pack;
}

const pack = loadPack();

export function resolveDiwaliProcedure(request: PracticeGuidanceRequest): RitualProcedureGuide | null {
  const supported = request.observanceSlug === pack.observance_slug
    && request.regionCode === "west-india"
    && request.traditionCode === "smarta-west-india";
  const guide = pack.guides.find((candidate) => candidate.language_code === request.languageCode);
  if (!supported || !guide) return null;
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
      calendarStatus: day.calendar_status,
      calendarNote: CURRENT_CALENDAR_NOTE_BY_ORDINAL.get(day.ordinal) ?? day.calendar_note,
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
      statusLabelledDiwaliSequenceIncluded: true,
      fastingOrMedicalRegimenPrescribed: false,
      fireworksRequiredOrRecommended: false,
      preciseMuhurtaCalculated: false,
      guaranteedWealthOutcomeClaimed: false,
      dhanterasAndDhanvantariLaneComplete: false,
      bengaliKaliPujaIncluded: false,
      southIndianDeepavaliIncluded: false,
      jainDiwaliIncluded: false,
      bandiChhorDivasIncluded: false,
      nepalTiharIncluded: false,
    },
  };
}

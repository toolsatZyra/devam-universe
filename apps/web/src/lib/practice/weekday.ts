import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PracticeGuidanceRequest, RitualProcedureGuide } from "../domain/practice";
export { weekdayPracticeSlug } from "./weekday-key";

const PACK_FILE_SHA256 = "7d207a537763600529f59002cfa89ece4d9cdb3f904538aad9b398756ec09269";
const CONTRACT = "DEVAM_WEEKDAY_PRACTICE_PACK_V1" as const;
const TIER_ORDER = ["minimum", "standard", "elaborate"] as const;
const VARA_ORDER = ["Ravivara", "Somavara", "Mangalavara", "Budhavara", "Guruvara", "Shukravara", "Shanivara"] as const;

type PackSource = {
  source_id: string;
  title: string;
  publisher: string;
  url: string;
  source_class: string;
  rights_lane: "reference_only";
};

type WeekdayProfile = {
  vara_index: number;
  vara_name: string;
  practice_slug: string;
  display_name_en: string;
  display_name_hi: string;
  focus_en: string;
  focus_hi: string;
  reflection_en: string;
  reflection_hi: string;
  source_ids: string[];
  safety_note_en: string;
  safety_note_hi: string;
};

type TemplateTier = {
  tier: "minimum" | "standard" | "elaborate";
  label: string;
  estimated_minutes: number;
  materials: { item: string; substitutions: string[]; optional: boolean }[];
  steps: { ordinal: number; instruction: string; why: string; optional: boolean; source_ids: string[] }[];
};

type LanguageTemplate = {
  title: string;
  summary: string;
  family_practice_note: string;
  context_prompts: string[];
  tiers: TemplateTier[];
};

type Pack = {
  contract: typeof CONTRACT;
  pack_id: string;
  editorial_status: "internal_beta_research_synthesis";
  scope: {
    region_codes: ["west-india"];
    tradition_codes: ["smarta-west-india"];
    language_codes: ["en", "hi"];
    family_practice_overrides_weekday_suggestion: true;
  };
  sources: PackSource[];
  weekday_profiles: WeekdayProfile[];
  language_templates: Record<"en" | "hi", LanguageTemplate>;
  boundaries: Record<string, boolean> & {
    minimum_standard_elaborate_forms_included: true;
    hindi_and_english_included: true;
    substitutions_included: true;
    family_context_prompts_included: true;
    all_seven_varas_included: true;
    formal_priest_mantras_included: false;
    fasting_or_medical_regimen_prescribed: false;
    astrological_remedies_prescribed: false;
    planetary_appeasement_prescribed: false;
    direct_sun_gazing_suggested: false;
    historical_prescriptions_promoted_as_modern_norms: false;
    one_universal_weekday_mapping_claimed: false;
    all_regional_variants_complete: false;
    north_india_weekday_lane_complete: false;
    south_india_weekday_lane_complete: false;
    east_india_weekday_lane_complete: false;
  };
};

function loadPack(): Pack {
  const path = resolve(process.cwd(), "../..", "knowledge_packs/rituals/weekday-practice-west-india-v1.json");
  const bytes = readFileSync(path);
  const actual = createHash("sha256").update(bytes).digest("hex");
  if (actual !== PACK_FILE_SHA256) throw new Error(`Weekday practice-pack drift: ${actual}`);
  const pack = JSON.parse(bytes.toString("utf8")) as Pack;
  if (pack.contract !== CONTRACT || pack.pack_id !== "devam-weekday-practice-west-india-v1") throw new Error("Weekday practice-pack identity drift");
  if (pack.sources.length !== 4 || pack.weekday_profiles.length !== 7) throw new Error("Weekday practice-pack universe drift");
  if (pack.scope.region_codes.join("|") !== "west-india" || pack.scope.tradition_codes.join("|") !== "smarta-west-india") throw new Error("Weekday practice scope drift");
  if (pack.scope.language_codes.join("|") !== "en|hi" || pack.scope.family_practice_overrides_weekday_suggestion !== true) throw new Error("Weekday language/family boundary drift");

  const sourceIds = new Set(pack.sources.map((source) => source.source_id));
  if (sourceIds.size !== pack.sources.length) throw new Error("Duplicate weekday source ID");
  const slugs = new Set(pack.weekday_profiles.map((profile) => profile.practice_slug));
  if (slugs.size !== 7 || pack.weekday_profiles.map((profile) => profile.vara_name).join("|") !== VARA_ORDER.join("|")) throw new Error("Weekday profile order drift");
  if (pack.weekday_profiles.some((profile, index) => profile.vara_index !== index + 1 || !/^weekday-[a-z]+$/.test(profile.practice_slug))) throw new Error("Weekday profile identity drift");
  if (pack.weekday_profiles.some((profile) => profile.source_ids.length === 0 || profile.source_ids.some((sourceId) => !sourceIds.has(sourceId)))) throw new Error("Weekday profile source binding drift");

  for (const language of ["en", "hi"] as const) {
    const template = pack.language_templates[language];
    if (template.tiers.map((tier) => tier.tier).join("|") !== TIER_ORDER.join("|")) throw new Error(`Weekday tier order drift: ${language}`);
    for (const tier of template.tiers) {
      if (tier.steps.map((step) => step.ordinal).join("|") !== tier.steps.map((_, index) => index + 1).join("|")) throw new Error(`Weekday step order drift: ${language}/${tier.tier}`);
      if (tier.steps.some((step) => step.source_ids.length === 0 || step.source_ids.some((sourceId) => sourceId !== "__WEEKDAY__" && !sourceIds.has(sourceId)))) throw new Error(`Weekday template source binding drift: ${language}/${tier.tier}`);
    }
  }

  const requiredTrue = ["minimum_standard_elaborate_forms_included", "hindi_and_english_included", "substitutions_included", "family_context_prompts_included", "all_seven_varas_included"];
  const requiredFalse = ["formal_priest_mantras_included", "fasting_or_medical_regimen_prescribed", "astrological_remedies_prescribed", "planetary_appeasement_prescribed", "direct_sun_gazing_suggested", "historical_prescriptions_promoted_as_modern_norms", "one_universal_weekday_mapping_claimed", "all_regional_variants_complete", "north_india_weekday_lane_complete", "south_india_weekday_lane_complete", "east_india_weekday_lane_complete"];
  if (requiredTrue.some((key) => pack.boundaries[key] !== true) || requiredFalse.some((key) => pack.boundaries[key] !== false)) throw new Error("Weekday practice boundary drift");
  return pack;
}

const pack = loadPack();

function interpolate(value: string, replacements: Record<string, string>) {
  const rendered = Object.entries(replacements).reduce((current, [key, replacement]) => current.replaceAll(`{${key}}`, replacement), value);
  if (/\{[a-z]+\}/i.test(rendered)) throw new Error(`Unresolved weekday practice placeholder: ${rendered}`);
  return rendered;
}

function resolvedSourceIds(ids: string[], profile: WeekdayProfile) {
  return [...new Set(ids.flatMap((sourceId) => sourceId === "__WEEKDAY__" ? profile.source_ids : [sourceId]))];
}

export function resolveWeekdayProcedure(request: PracticeGuidanceRequest): RitualProcedureGuide | null {
  if (request.regionCode !== "west-india" || request.traditionCode !== "smarta-west-india") return null;
  const profile = pack.weekday_profiles.find((candidate) => candidate.practice_slug === request.observanceSlug);
  const template = pack.language_templates[request.languageCode];
  if (!profile || !template) return null;
  const english = request.languageCode === "en";
  const replacements = {
    display: english ? profile.display_name_en : profile.display_name_hi,
    focus: english ? profile.focus_en : profile.focus_hi,
    reflection: english ? profile.reflection_en : profile.reflection_hi,
    safety: english ? profile.safety_note_en : profile.safety_note_hi,
  };

  return {
    guideId: `${profile.practice_slug}-${request.languageCode}-v1`,
    companionToObservanceSlug: profile.practice_slug,
    title: interpolate(template.title, replacements),
    languageCode: request.languageCode,
    kind: "contextual_minimum_standard_elaborate_ritual_procedure",
    summary: interpolate(template.summary, replacements),
    familyPracticeNote: interpolate(template.family_practice_note, replacements),
    contextPrompts: template.context_prompts.map((prompt) => interpolate(prompt, replacements)),
    tiers: template.tiers.map((tier) => ({
      tier: tier.tier,
      label: interpolate(tier.label, replacements),
      estimatedMinutes: tier.estimated_minutes,
      materials: tier.materials.map((material) => ({
        item: interpolate(material.item, replacements),
        substitutions: material.substitutions.map((substitution) => interpolate(substitution, replacements)),
        optional: material.optional,
      })),
      steps: tier.steps.map((step) => ({
        ordinal: step.ordinal,
        instruction: interpolate(step.instruction, replacements),
        why: interpolate(step.why, replacements),
        optional: step.optional,
        sourceIds: resolvedSourceIds(step.source_ids, profile),
      })),
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
      allSevenVarasIncluded: true,
      fastingOrMedicalRegimenPrescribed: false,
      astrologicalRemediesPrescribed: false,
      planetaryAppeasementPrescribed: false,
      directSunGazingSuggested: false,
      oneUniversalWeekdayMappingClaimed: false,
      northIndiaWeekdayLaneComplete: false,
      southIndiaWeekdayLaneComplete: false,
      eastIndiaWeekdayLaneComplete: false,
    },
  };
}

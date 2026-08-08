import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type {
  PracticeGuidanceRequest,
  RitualProcedureGuide,
  SourceBoundedPracticeGuide,
} from "../domain/practice";

const PACK_FILE_SHA256 = "2c90bfba1e8eda5539186c96baca7027db3af7dd6ce6a293b3c86a9e7e47fa34";
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
};

type Pack = {
  contract: typeof CONTRACT;
  pack_id: string;
  editorial_status: "internal_beta_research_synthesis";
  observance_slug: "ganesh-chaturthi";
  scope: {
    region_codes: string[];
    tradition_codes: string[];
    language_codes: ("en" | "hi")[];
  };
  sources: PackSource[];
  guides: PackGuide[];
  boundaries: {
    minimum_standard_elaborate_forms_included: true;
    hindi_and_english_included: true;
    substitutions_included: true;
    family_context_prompts_included: true;
    formal_priest_mantras_included: false;
    historical_prescriptions_promoted_as_modern_norms: false;
    one_universal_procedure_claimed: false;
    all_regional_variants_complete: false;
    all_ganeshotsav_days_complete: false;
  };
};

function loadPack(): Pack {
  const path = resolve(process.cwd(), "../..", "knowledge_packs/rituals/ganesh-chaturthi-west-india-v1.json");
  const bytes = readFileSync(path);
  const actual = createHash("sha256").update(bytes).digest("hex");
  if (actual !== PACK_FILE_SHA256) throw new Error(`Ganesh Chaturthi ritual-pack drift: ${actual}`);
  const pack = JSON.parse(bytes.toString("utf8")) as Pack;
  if (pack.contract !== CONTRACT || pack.observance_slug !== "ganesh-chaturthi") throw new Error("Ganesh Chaturthi ritual-pack identity drift");
  if (pack.guides.length !== 2 || pack.sources.length !== 5) throw new Error("Ganesh Chaturthi ritual-pack universe drift");
  const sourceIds = new Set(pack.sources.map((source) => source.source_id));
  if (sourceIds.size !== pack.sources.length) throw new Error("Duplicate Ganesh Chaturthi source ID");
  for (const guide of pack.guides) {
    if (guide.tiers.map((tier) => tier.tier).join("|") !== TIER_ORDER.join("|")) throw new Error(`Ritual tier-order drift: ${guide.guide_id}`);
    for (const tier of guide.tiers) {
      if (tier.steps.map((step) => step.ordinal).join("|") !== tier.steps.map((_, index) => index + 1).join("|")) throw new Error(`Ritual step-order drift: ${guide.guide_id}/${tier.tier}`);
      if (tier.steps.some((step) => step.source_ids.length === 0 || step.source_ids.some((sourceId) => !sourceIds.has(sourceId)))) throw new Error(`Ritual source binding drift: ${guide.guide_id}/${tier.tier}`);
    }
  }
  return pack;
}

const pack = loadPack();

export function resolveGaneshChaturthiProcedure(
  request: PracticeGuidanceRequest,
  companionReading: SourceBoundedPracticeGuide | null,
): RitualProcedureGuide | null {
  const supported = request.observanceSlug === pack.observance_slug
    && pack.scope.region_codes.includes(request.regionCode)
    && pack.scope.tradition_codes.includes(request.traditionCode);
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
      steps: tier.steps.map((step) => ({
        ordinal: step.ordinal,
        instruction: step.instruction,
        why: step.why,
        optional: step.optional,
        sourceIds: [...step.source_ids],
      })),
    })),
    companionReading,
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
      minimumStandardElaborateFormsIncluded: pack.boundaries.minimum_standard_elaborate_forms_included,
      hindiAndEnglishIncluded: pack.boundaries.hindi_and_english_included,
      substitutionsIncluded: pack.boundaries.substitutions_included,
      familyContextPromptsIncluded: pack.boundaries.family_context_prompts_included,
      formalPriestMantrasIncluded: pack.boundaries.formal_priest_mantras_included,
      historicalPrescriptionsPromotedAsModernNorms: pack.boundaries.historical_prescriptions_promoted_as_modern_norms,
      oneUniversalProcedureClaimed: pack.boundaries.one_universal_procedure_claimed,
      allRegionalVariantsComplete: pack.boundaries.all_regional_variants_complete,
      allGaneshotsavDaysComplete: pack.boundaries.all_ganeshotsav_days_complete,
    },
  };
}

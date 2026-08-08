import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import type { PracticeGuidanceRequest, RitualProcedureGuide } from "../domain/practice";

const PACK_SHA256 = "3fe6bfc3872093858cff47040fa8764ab4cf1c0de37789161b5854dd954bc8f6";
const FIXTURE_SHA256 = "1b72b1eb9710d35e90618e02e840e4cb6129e0aa726df667fa637e42e62f117d";
const SOURCE_IDS = [
  "devam-jain-diwali-date-fixture",
  "jaina-diwali-mahavir-nirvana",
  "jaina-mahavira-nirvana-values",
  "jaina-diwali-practice-context",
  "devam-jain-diwali-safety-boundary",
] as const;

type Source = {
  source_id: string;
  title: string;
  publisher: string;
  url: string | null;
  source_role: string;
  rights_lane: RitualProcedureGuide["evidence"]["sources"][number]["rightsLane"];
  artifact_sha256: string | null;
};

type Procedure = {
  tier: "minimum" | "standard" | "elaborate";
  label: string;
  estimated_minutes: number;
  materials: Array<{ item: string; required: boolean; substitutions: string[]; source_ids: string[] }>;
  steps: Array<{ ordinal: number; instruction: string; why: string; optional: boolean; source_ids: string[] }>;
};

type LocalizedContent = {
  language_code: "en" | "hi";
  title: string;
  short_answer: string;
  procedures: Procedure[];
};

type Pack = {
  contract: string;
  lane_id: string;
  supersedes_legacy_pack_ids: string[];
  observance_slugs: string[];
  applicability: {
    region_codes: string[];
    tradition_codes: string[];
    material_context_questions: string[];
  };
  calendar: { freshness_note: string | null };
  sources: Source[];
  localized_content: LocalizedContent[];
  product_status: {
    classification: string;
    completed_dimensions: Record<string, boolean>;
    open_gaps: string[];
    review_status: string;
  };
};

function loadPack(): Pack {
  const root = resolve(process.cwd(), "../..");
  const bytes = readFileSync(resolve(root, "knowledge_packs/rituals/jain-diwali-umbrella-companion-content-v1.json"));
  if (createHash("sha256").update(bytes).digest("hex") !== PACK_SHA256) throw new Error("Jain Diwali current-contract pack drift");
  const pack = JSON.parse(bytes.toString("utf8")) as Pack;
  if (
    pack.contract !== "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1"
    || pack.lane_id !== "jain-diwali-umbrella-companion-content-v1"
    || pack.supersedes_legacy_pack_ids.join("|") !== "devam-jain-diwali-umbrella-reflection-v1"
    || pack.observance_slugs.join("|") !== "jain-diwali-umbrella"
    || pack.applicability.region_codes.join("|") !== "jain-india"
    || pack.applicability.tradition_codes.join("|") !== "jain-umbrella"
  ) throw new Error("Jain Diwali current-contract identity drift");
  if (
    pack.product_status.classification !== "participation_companion"
    || pack.product_status.completed_dimensions.actionable_vidhi !== false
    || pack.product_status.open_gaps.length !== 2
    || pack.product_status.review_status !== "internal_beta_reviewed"
  ) throw new Error("Jain Diwali incomplete-vidhi boundary drift");
  if (
    createHash("sha256").update(readFileSync(resolve(root, "knowledge_packs/panchang/jain-diwali-delhi-2026-v1.json"))).digest("hex") !== FIXTURE_SHA256
    || pack.sources.map((item) => item.source_id).join("|") !== SOURCE_IDS.join("|")
    || pack.sources[0].artifact_sha256 !== FIXTURE_SHA256
  ) throw new Error("Jain Diwali source universe drift");
  const sourceIds = new Set<string>(SOURCE_IDS);
  if (pack.localized_content.map((item) => item.language_code).join("|") !== "en|hi") throw new Error("Jain Diwali language drift");
  for (const localized of pack.localized_content) {
    if (localized.procedures.map((item) => item.tier).join("|") !== "minimum|standard|elaborate") throw new Error(`Jain Diwali tier drift: ${localized.language_code}`);
    for (const procedure of localized.procedures) {
      if (
        procedure.materials.some((item) => item.substitutions.length === 0 || item.source_ids.some((sourceId) => !sourceIds.has(sourceId)))
        || procedure.steps.some((step, index) => step.ordinal !== index + 1 || step.source_ids.length === 0 || step.source_ids.some((sourceId) => !sourceIds.has(sourceId)))
      ) throw new Error(`Jain Diwali evidence drift: ${localized.language_code}/${procedure.tier}`);
    }
  }
  return pack;
}

const pack = loadPack();

export function resolveJainDiwaliProcedure(request: PracticeGuidanceRequest): RitualProcedureGuide | null {
  if (request.observanceSlug !== "jain-diwali-umbrella" || request.regionCode !== "jain-india" || request.traditionCode !== "jain-umbrella") return null;
  const content = pack.localized_content.find((candidate) => candidate.language_code === request.languageCode);
  if (!content) return null;
  return {
    guideId: `${pack.lane_id}-${content.language_code}`,
    companionToObservanceSlug: request.observanceSlug,
    title: content.title,
    languageCode: content.language_code,
    kind: "contextual_minimum_standard_elaborate_ritual_procedure",
    summary: content.short_answer,
    familyPracticeNote: pack.calendar.freshness_note ?? "Confirm the exact family, sangh, or temple practice before proceeding.",
    contextPrompts: [...pack.applicability.material_context_questions],
    tiers: content.procedures.map((procedure) => ({
      tier: procedure.tier,
      label: procedure.label,
      estimatedMinutes: procedure.estimated_minutes,
      materials: procedure.materials.map((item) => ({ item: item.item, substitutions: [...item.substitutions], optional: !item.required })),
      steps: procedure.steps.map((step) => ({ ordinal: step.ordinal, instruction: step.instruction, why: step.why, optional: step.optional, sourceIds: [...step.source_ids] })),
    })),
    companionReading: null,
    evidence: {
      packId: pack.lane_id,
      packFileSha256: PACK_SHA256,
      editorialStatus: "internal_beta_research_synthesis",
      sourceTextReturnedByApi: false,
      sources: pack.sources.map((item) => ({ sourceId: item.source_id, title: item.title, publisher: item.publisher, url: item.url, sourceClass: item.source_role, rightsLane: item.rights_lane })),
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
      mahaviraLiberationAndJainValuesReflectionSupported: true,
      materialFreeAndFlameFreeFallbackSupported: true,
      formalPujaMantraStotraScriptureOrPratikramanIncluded: false,
      fastAusterityNirvanLadooOrTempleProcedurePrescribed: false,
      realLampOrFirecrackersRequired: false,
      foodDonationClothingOrPurchaseRequired: false,
      mokshaMeritOrSpiritualOutcomeGuaranteed: false,
      jainSectLanesEquated: false,
      novemberNineAndTenVariantsMerged: false,
      hinduLakshmiPujaMerged: false,
      sikhBandiChhorMerged: false,
    },
  };
}

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PracticeGuidanceRequest, RitualProcedureGuide } from "../domain/practice";

const PACK_SHA256 = "62924b358c4b85cb907cb885bfac1dfe750b6c23ec5d1eee295fac51dbb7d05f";
const FIXTURE_SHA256 = "31e02af522ad6de07346e27330c6a6709b3f20eb93f12f14885ac6b53c4ba769";
const SOURCE_IDS = [
  "devam-kali-chaudas-baps-date-fixture",
  "baps-festival-list-2026-kali-chaudash",
  "baps-nirnay-2026-kali-chaudash",
  "drik-gujarati-calendar-ahmedabad-2026",
  "devam-kali-chaudas-safety-boundary",
] as const;
const EXPECTED_SCOPE = {
  region_codes: ["baps-gujarat"],
  tradition_codes: ["swaminarayan-baps"],
  language_codes: ["en", "hi"],
  ahmedabad_2026_date_fixture_required: true,
  baps_family_or_mandir_participation_only: true,
  family_or_mandir_custom_overrides_generic_sequence: true,
  hanuman_remembrance_only_when_already_known: true,
  naraka_chaturdashi_tamil_deepavali_and_bengal_kali_puja_not_merged: true,
};

type Source = {
  source_id: string;
  title: string;
  publisher: string;
  url: string | null;
  source_class: string;
  rights_lane: "reference_only" | "derivative_allowed";
  artifact_sha256?: string;
};
type Guide = {
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
};
type Pack = {
  contract: string;
  pack_id: string;
  editorial_status: "internal_beta_research_synthesis";
  observance_slug: string;
  scope: Record<string, unknown>;
  sources: Source[];
  guides: Guide[];
  boundaries: Record<string, boolean>;
};

function loadPack(): Pack {
  const root = resolve(process.cwd(), "../..");
  const bytes = readFileSync(resolve(root, "knowledge_packs/rituals/kali-chaudas-baps-gujarat-v1.json"));
  if (createHash("sha256").update(bytes).digest("hex") !== PACK_SHA256) throw new Error("Kali Chaudas practice-pack drift");
  const pack = JSON.parse(bytes.toString("utf8")) as Pack;
  if (
    pack.contract !== "DEVAM_RITUAL_PROCEDURE_PACK_V1" ||
    pack.pack_id !== "devam-kali-chaudas-baps-gujarat-v1" ||
    pack.observance_slug !== "kali-chaudas-baps" ||
    JSON.stringify(pack.scope) !== JSON.stringify(EXPECTED_SCOPE)
  ) throw new Error("Kali Chaudas practice identity drift");
  const fixtureBytes = readFileSync(resolve(root, "knowledge_packs/panchang/kali-chaudas-ahmedabad-baps-2026-v1.json"));
  if (
    createHash("sha256").update(fixtureBytes).digest("hex") !== FIXTURE_SHA256 ||
    pack.sources.map((source) => source.source_id).join("|") !== SOURCE_IDS.join("|") ||
    pack.sources[0].artifact_sha256 !== FIXTURE_SHA256
  ) throw new Error("Kali Chaudas evidence universe drift");
  const sourceIds = new Set<string>(SOURCE_IDS);
  if (pack.guides.map((guide) => guide.language_code).join("|") !== "en|hi") throw new Error("Kali Chaudas language drift");
  for (const guide of pack.guides) {
    if (
      guide.context_prompts.length !== 4 ||
      guide.tiers.map((tier) => tier.tier).join("|") !== "minimum|standard|elaborate" ||
      guide.tiers.map((tier) => tier.estimated_minutes).join("|") !== "10|25|60"
    ) throw new Error(`Kali Chaudas guide structure drift: ${guide.guide_id}`);
    for (const tier of guide.tiers) {
      if (
        tier.materials.some((item) => item.substitutions.length === 0) ||
        tier.steps.some((step, index) => step.ordinal !== index + 1 || step.source_ids.length === 0 || step.source_ids.some((id) => !sourceIds.has(id)))
      ) throw new Error(`Kali Chaudas evidence drift: ${guide.guide_id}/${tier.tier}`);
    }
  }
  const trueKeys = [
    "minimum_standard_elaborate_forms_included",
    "hindi_and_english_included",
    "substitutions_included",
    "family_context_prompts_included",
    "baps_family_or_mandir_prayer_and_hanuman_remembrance_supported",
    "quiet_reflection_fallback_supported",
  ];
  const falseKeys = [
    "formal_hanuman_puja_or_mantras_included",
    "tantric_occult_or_exorcistic_instruction_included",
    "chilli_lemon_smoke_or_harm_ritual_included",
    "fast_or_fixed_offering_prescribed",
    "real_flame_required",
    "fireworks_required_or_recommended",
    "purchase_or_spending_required",
    "evil_force_removal_or_protection_guaranteed",
    "maharashtra_naraka_chaturdashi_merged",
    "tamil_deepavali_merged",
    "bengal_kali_puja_merged",
    "one_universal_gujarat_procedure_claimed",
    "all_gujarat_family_variants_complete",
  ];
  if (
    Object.keys(pack.boundaries).sort().join("|") !== [...trueKeys, ...falseKeys].sort().join("|") ||
    trueKeys.some((key) => pack.boundaries[key] !== true) ||
    falseKeys.some((key) => pack.boundaries[key] !== false)
  ) throw new Error("Kali Chaudas boundary drift");
  return pack;
}

const pack = loadPack();

export function resolveKaliChaudasProcedure(request: PracticeGuidanceRequest): RitualProcedureGuide | null {
  if (
    request.observanceSlug !== "kali-chaudas-baps" ||
    request.regionCode !== "baps-gujarat" ||
    request.traditionCode !== "swaminarayan-baps"
  ) return null;
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
      materials: tier.materials.map((item) => ({ ...item, substitutions: [...item.substitutions] })),
      steps: tier.steps.map((step) => ({
        ordinal: step.ordinal,
        instruction: step.instruction,
        why: step.why,
        optional: step.optional,
        sourceIds: [...step.source_ids],
      })),
    })),
    companionReading: null,
    evidence: {
      packId: pack.pack_id,
      packFileSha256: PACK_SHA256,
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
      bapsFamilyOrMandirPrayerAndHanumanRemembranceSupported: true,
      quietReflectionFallbackSupported: true,
      formalHanumanPujaOrMantrasIncluded: false,
      tantricOccultOrExorcisticInstructionIncluded: false,
      chilliLemonSmokeOrHarmRitualIncluded: false,
      fastOrFixedOfferingPrescribed: false,
      realFlameRequired: false,
      fireworksRequiredOrRecommended: false,
      purchaseOrSpendingRequired: false,
      evilForceRemovalOrProtectionGuaranteed: false,
      maharashtraNarakaChaturdashiMerged: false,
      tamilDeepavaliMerged: false,
      bengalKaliPujaMerged: false,
    },
  };
}

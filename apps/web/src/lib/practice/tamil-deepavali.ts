import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PracticeGuidanceRequest, RitualProcedureGuide } from "../domain/practice";

const PACK_SHA256 = "5109fd05b17b1096ec7680d1b78e1b776f525181757b1971b89104ce56983477";
const FIXTURE_SHA256 = "97319c8fc4f1e6bb157c7540f6bcfc3379c0bccabdabb22b57493e085feac7de";
const TIER_ORDER = ["minimum", "standard", "elaborate"] as const;
type Source = { source_id: string; title: string; publisher: string; url: string | null; source_class: string; rights_lane: "reference_only" | "derivative_allowed"; artifact_sha256?: string; observed_fetch?: { status: number; response_bytes: number; response_sha256: string; strict_utf8: boolean }; observed_literals?: Record<string, boolean> };
type Guide = { guide_id: string; language_code: "en" | "hi"; title: string; summary: string; family_practice_note: string; context_prompts: string[]; tiers: Array<{ tier: "minimum" | "standard" | "elaborate"; label: string; estimated_minutes: number; materials: Array<{ item: string; substitutions: string[]; optional: boolean }>; steps: Array<{ ordinal: number; instruction: string; why: string; optional: boolean; source_ids: string[] }> }> };
type Pack = { contract: string; pack_id: string; editorial_status: "internal_beta_research_synthesis"; observance_slug: string; scope: Record<string, unknown>; sources: Source[]; guides: Guide[]; boundaries: Record<string, boolean> };

function loadPack(): Pack {
  const packPath = resolve(process.cwd(), "../..", "knowledge_packs/rituals/tamil-deepavali-household-v1.json");
  const bytes = readFileSync(packPath);
  const hash = createHash("sha256").update(bytes).digest("hex");
  if (hash !== PACK_SHA256) throw new Error(`Tamil Deepavali practice-pack drift: ${hash}`);
  const pack = JSON.parse(bytes.toString("utf8")) as Pack;
  const expectedScope = { region_codes: ["south-india"], tradition_codes: ["smarta-south-india"], language_codes: ["en", "hi"], chennai_2026_date_fixture_required: true, family_custom_overrides_generic_sequence: true, provider_published_interval_reproduced: false };
  if (pack.contract !== "DEVAM_RITUAL_PROCEDURE_PACK_V1" || pack.pack_id !== "devam-tamil-deepavali-household-v1" || pack.observance_slug !== "tamil-deepavali-naraka-chaturdashi" || JSON.stringify(pack.scope) !== JSON.stringify(expectedScope)) throw new Error("Tamil Deepavali practice identity drift");
  const fixturePath = resolve(process.cwd(), "../..", "knowledge_packs/panchang/tamil-deepavali-chennai-2026-v1.json");
  if (createHash("sha256").update(readFileSync(fixturePath)).digest("hex") !== FIXTURE_SHA256 || pack.sources.length !== 4 || pack.sources[0].artifact_sha256 !== FIXTURE_SHA256) throw new Error("Tamil Deepavali source fixture drift");
  for (const source of pack.sources.filter((candidate) => candidate.observed_fetch)) {
    if (source.observed_fetch?.status !== 200 || !source.observed_fetch.strict_utf8 || source.observed_fetch.response_bytes <= 0 || !/^[0-9a-f]{64}$/.test(source.observed_fetch.response_sha256) || Object.values(source.observed_literals ?? {}).some((value) => !value)) throw new Error(`Tamil Deepavali live observation drift: ${source.source_id}`);
  }
  const sourceIds = new Set(pack.sources.map((source) => source.source_id));
  if (pack.guides.map((guide) => guide.language_code).join("|") !== "en|hi") throw new Error("Tamil Deepavali language drift");
  for (const guide of pack.guides) {
    if (guide.context_prompts.length !== 4 || guide.tiers.map((tier) => tier.tier).join("|") !== TIER_ORDER.join("|")) throw new Error(`Tamil Deepavali structure drift: ${guide.guide_id}`);
    for (const tier of guide.tiers) {
      if (tier.materials.some((item) => !item.substitutions.length) || tier.steps.some((step, index) => step.ordinal !== index + 1 || !step.source_ids.length || step.source_ids.some((id) => !sourceIds.has(id)))) throw new Error(`Tamil Deepavali evidence drift: ${guide.guide_id}/${tier.tier}`);
    }
  }
  const trueKeys = ["minimum_standard_elaborate_forms_included", "hindi_and_english_included", "substitutions_included", "family_context_prompts_included", "pre_sunrise_family_bath_core_supported"];
  const falseKeys = ["sesame_oil_required_for_everyone", "medical_treatment_or_suitability_claimed", "specific_hot_water_or_herbal_formula_prescribed", "formal_mantras_included", "fireworks_required_or_recommended", "new_purchase_or_new_clothes_required", "guaranteed_outcome_claimed", "north_west_naraka_or_lakshmi_puja_merged", "one_universal_tamil_or_karnataka_procedure_claimed", "all_regional_and_family_variants_complete"];
  if (trueKeys.some((key) => pack.boundaries[key] !== true) || falseKeys.some((key) => pack.boundaries[key] !== false)) throw new Error("Tamil Deepavali boundary drift");
  return pack;
}

const pack = loadPack();
export function resolveTamilDeepavaliProcedure(request: PracticeGuidanceRequest): RitualProcedureGuide | null {
  if (request.observanceSlug !== "tamil-deepavali-naraka-chaturdashi" || request.regionCode !== "south-india" || request.traditionCode !== "smarta-south-india") return null;
  const guide = pack.guides.find((candidate) => candidate.language_code === request.languageCode);
  if (!guide) return null;
  return {
    guideId: guide.guide_id, companionToObservanceSlug: pack.observance_slug, title: guide.title, languageCode: guide.language_code,
    kind: "contextual_minimum_standard_elaborate_ritual_procedure", summary: guide.summary, familyPracticeNote: guide.family_practice_note, contextPrompts: [...guide.context_prompts],
    tiers: guide.tiers.map((tier) => ({ tier: tier.tier, label: tier.label, estimatedMinutes: tier.estimated_minutes, materials: tier.materials.map((item) => ({ ...item, substitutions: [...item.substitutions] })), steps: tier.steps.map((step) => ({ ordinal: step.ordinal, instruction: step.instruction, why: step.why, optional: step.optional, sourceIds: [...step.source_ids] })) })),
    companionReading: null,
    evidence: { packId: pack.pack_id, packFileSha256: PACK_SHA256, editorialStatus: pack.editorial_status, sourceTextReturnedByApi: false, sources: pack.sources.map((source) => ({ sourceId: source.source_id, title: source.title, publisher: source.publisher, url: source.url, sourceClass: source.source_class, rightsLane: source.rights_lane })) },
    boundaries: { minimumStandardElaborateFormsIncluded: true, hindiAndEnglishIncluded: true, substitutionsIncluded: true, familyContextPromptsIncluded: true, formalPriestMantrasIncluded: false, historicalPrescriptionsPromotedAsModernNorms: false, oneUniversalProcedureClaimed: false, allRegionalVariantsComplete: false, allGaneshotsavDaysComplete: false, preSunriseFamilyBathCoreSupported: true, sesameOilRequiredForEveryone: false, medicalTreatmentOrSuitabilityClaimed: false, specificHotWaterOrHerbalFormulaPrescribed: false, fireworksRequiredOrRecommended: false, newPurchaseOrNewClothesRequired: false, guaranteedOutcomeClaimed: false, northWestNarakaOrLakshmiPujaMerged: false },
  };
}

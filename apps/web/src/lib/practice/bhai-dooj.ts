import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PracticeGuidanceRequest, RitualProcedureGuide } from "../domain/practice";

const PACK_SHA256 = "fe0421705f488d5b1265387a1a91784df5877eebbf9712458c15427e65d2de7c";
const FIXTURE_SHA256 = "b6156e6532521a91db78c9c049de91d5ac07f8cfdafe960d54d7112a8fe609d6";
const SOURCE_IDS = ["devam-bhai-dooj-date-fixture", "incredible-india-bhai-dooj", "newsonair-bhai-dooj-regional-names", "devam-bhai-dooj-safety-and-inclusion-boundary"];
type Source = { source_id: string; title: string; publisher: string; url: string | null; source_class: string; rights_lane: "reference_only" | "derivative_allowed"; artifact_sha256?: string; observed_fetch?: { status: number; final_url: string; response_bytes: number; response_sha256: string; strict_utf8: boolean }; observed_literals?: Record<string, boolean> };
type Guide = { guide_id: string; language_code: "en" | "hi"; title: string; summary: string; family_practice_note: string; context_prompts: string[]; tiers: Array<{ tier: "minimum" | "standard" | "elaborate"; label: string; estimated_minutes: number; materials: Array<{ item: string; substitutions: string[]; optional: boolean }>; steps: Array<{ ordinal: number; instruction: string; why: string; optional: boolean; source_ids: string[] }> }> };
type Pack = { contract: string; pack_id: string; editorial_status: "internal_beta_research_synthesis"; observance_slug: string; scope: Record<string, unknown>; sources: Source[]; guides: Guide[]; boundaries: Record<string, boolean> };

function loadPack(): Pack {
  const root = resolve(process.cwd(), "../..");
  const bytes = readFileSync(resolve(root, "knowledge_packs/rituals/bhai-dooj-north-india-household-v1.json"));
  const hash = createHash("sha256").update(bytes).digest("hex");
  if (hash !== PACK_SHA256) throw new Error(`Bhai Dooj practice-pack drift: ${hash}`);
  const pack = JSON.parse(bytes.toString("utf8")) as Pack;
  const expectedScope = { region_codes: ["north-india"], tradition_codes: ["smarta-north-india"], language_codes: ["en", "hi"], delhi_2026_date_fixture_required: true, family_role_and_custom_override_generic_sequence: true, regional_variants_not_merged: true };
  if (pack.contract !== "DEVAM_RITUAL_PROCEDURE_PACK_V1" || pack.pack_id !== "devam-bhai-dooj-north-india-household-v1" || pack.observance_slug !== "bhai-dooj" || JSON.stringify(pack.scope) !== JSON.stringify(expectedScope)) throw new Error("Bhai Dooj practice identity drift");
  const fixtureHash = createHash("sha256").update(readFileSync(resolve(root, "knowledge_packs/panchang/bhai-dooj-delhi-2026-v1.json"))).digest("hex");
  if (fixtureHash !== FIXTURE_SHA256 || pack.sources.map((source) => source.source_id).join("|") !== SOURCE_IDS.join("|") || pack.sources[0].artifact_sha256 !== FIXTURE_SHA256) throw new Error("Bhai Dooj source fixture drift");
  for (const source of pack.sources.filter((candidate) => candidate.observed_fetch)) if (source.observed_fetch?.status !== 200 || source.observed_fetch.final_url !== source.url?.replace("www.newsonair.gov.in", "newsonair.gov.in") || source.observed_fetch.response_bytes <= 0 || !/^[0-9a-f]{64}$/.test(source.observed_fetch.response_sha256) || !source.observed_fetch.strict_utf8 || Object.values(source.observed_literals ?? {}).some((value) => !value)) throw new Error(`Bhai Dooj live observation drift: ${source.source_id}`);
  const sourceIds = new Set(SOURCE_IDS);
  if (pack.guides.map((guide) => guide.language_code).join("|") !== "en|hi") throw new Error("Bhai Dooj language drift");
  for (const guide of pack.guides) {
    if (guide.context_prompts.length !== 4 || guide.tiers.map((tier) => tier.tier).join("|") !== "minimum|standard|elaborate" || guide.tiers.map((tier) => tier.estimated_minutes).join("|") !== "10|25|60") throw new Error(`Bhai Dooj guide structure drift: ${guide.guide_id}`);
    for (const tier of guide.tiers) if (tier.materials.some((item) => !item.substitutions.length) || tier.steps.some((step, index) => step.ordinal !== index + 1 || !step.source_ids.length || step.source_ids.some((id) => !sourceIds.has(id)))) throw new Error(`Bhai Dooj evidence drift: ${guide.guide_id}/${tier.tier}`);
  }
  const trueKeys = ["minimum_standard_elaborate_forms_included", "hindi_and_english_included", "substitutions_included", "family_context_prompts_included", "sibling_tika_prayer_and_shared_food_core_supported"];
  const falseKeys = ["fixed_tilak_recipe_required", "arati_or_real_flame_required", "gift_or_spending_required", "fasting_prescribed", "curse_or_tongue_pricking_instruction_included", "guaranteed_longevity_protection_or_prosperity_claimed", "gendered_protection_promise_required", "bhau_beej_bhai_phota_bhai_tika_or_bihar_yama_dvitiya_completed", "one_universal_indian_procedure_claimed", "all_family_and_regional_variants_complete"];
  if (trueKeys.some((key) => pack.boundaries[key] !== true) || falseKeys.some((key) => pack.boundaries[key] !== false)) throw new Error("Bhai Dooj boundary drift");
  return pack;
}

const pack = loadPack();
export function resolveBhaiDoojProcedure(request: PracticeGuidanceRequest): RitualProcedureGuide | null {
  if (request.observanceSlug !== "bhai-dooj" || request.regionCode !== "north-india" || request.traditionCode !== "smarta-north-india") return null;
  const guide = pack.guides.find((candidate) => candidate.language_code === request.languageCode);
  if (!guide) return null;
  return {
    guideId: guide.guide_id, companionToObservanceSlug: pack.observance_slug, title: guide.title, languageCode: guide.language_code, kind: "contextual_minimum_standard_elaborate_ritual_procedure", summary: guide.summary, familyPracticeNote: guide.family_practice_note, contextPrompts: [...guide.context_prompts],
    tiers: guide.tiers.map((tier) => ({ tier: tier.tier, label: tier.label, estimatedMinutes: tier.estimated_minutes, materials: tier.materials.map((item) => ({ ...item, substitutions: [...item.substitutions] })), steps: tier.steps.map((step) => ({ ordinal: step.ordinal, instruction: step.instruction, why: step.why, optional: step.optional, sourceIds: [...step.source_ids] })) })), companionReading: null,
    evidence: { packId: pack.pack_id, packFileSha256: PACK_SHA256, editorialStatus: pack.editorial_status, sourceTextReturnedByApi: false, sources: pack.sources.map((source) => ({ sourceId: source.source_id, title: source.title, publisher: source.publisher, url: source.url, sourceClass: source.source_class, rightsLane: source.rights_lane })) },
    boundaries: { minimumStandardElaborateFormsIncluded: true, hindiAndEnglishIncluded: true, substitutionsIncluded: true, familyContextPromptsIncluded: true, formalPriestMantrasIncluded: false, historicalPrescriptionsPromotedAsModernNorms: false, oneUniversalProcedureClaimed: false, allRegionalVariantsComplete: false, allGaneshotsavDaysComplete: false, siblingTikaPrayerAndSharedFoodCoreSupported: true, fixedTilakRecipeRequired: false, aratiOrRealFlameRequired: false, giftOrSpendingRequired: false, fastingPrescribed: false, curseOrTonguePrickingInstructionIncluded: false, guaranteedLongevityProtectionOrProsperityClaimed: false, genderedProtectionPromiseRequired: false, bhauBeejBhaiPhotaBhaiTikaOrBiharYamaDvitiyaCompleted: false },
  };
}

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PracticeGuidanceRequest, RitualProcedureGuide } from "../domain/practice";

const PACK_FILE_SHA256 = "4d3faa7381ff82db20e95bf0c927e2661d196bbad39b7e3a2a6bf9643a220ed9";
const FIXTURE_FILE_SHA256 = "3264642732a7415def579db19fb62144ca1a262e523077b90eed5f4bd865af96";
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
  pack_id: "devam-yama-deepam-north-west-india-v1";
  editorial_status: "internal_beta_research_synthesis";
  observance_slug: "yama-deepam";
  scope: { region_codes: ["north-india", "west-india"]; tradition_codes: ["smarta-north-india", "smarta-west-india"]; language_codes: ["en", "hi"]; family_custom_overrides_generic_sequence: true; resolved_evening_required: true; precise_provider_muhurta_reproduced: false };
  sources: Source[];
  guides: Guide[];
  boundaries: Record<string, boolean>;
};
type Fixture = {
  contract: string;
  scope: { selected_civil_date: string; practice_boundary: string };
  live_source: { response_is_byte_dynamic: boolean; fetches: Array<{ status: number; final_url: string; response_bytes: number; response_sha256: string; strict_utf8: boolean }>; stable_semantic_observation: { civil_date: string; trayodashi_tithi_during_diwali: boolean; deepak_for_yamaraj: boolean; outside_home: boolean; sandhya_time: boolean; ritual_named_deepdan_for_yamaraj: boolean } };
  fixed_source: { object_sha256: string; object_bytes: number; visually_inspected_pdf_pages: number[] };
  decision: { observance_slug: string; selected_civil_date: string; dhantrayodashi_remains_a_separate_practice_lane: boolean };
  denials: Record<string, boolean>;
};

function loadPack(): Pack {
  const packPath = resolve(process.cwd(), "../..", "knowledge_packs/rituals/yama-deepam-north-west-india-v1.json");
  const packBytes = readFileSync(packPath);
  const packHash = createHash("sha256").update(packBytes).digest("hex");
  if (packHash !== PACK_FILE_SHA256) throw new Error(`Yama Deepam practice-pack drift: ${packHash}`);
  const pack = JSON.parse(packBytes.toString("utf8")) as Pack;
  if (pack.contract !== "DEVAM_RITUAL_PROCEDURE_PACK_V1" || pack.pack_id !== "devam-yama-deepam-north-west-india-v1" || pack.observance_slug !== "yama-deepam" || pack.editorial_status !== "internal_beta_research_synthesis") throw new Error("Yama Deepam practice-pack identity drift");
  const expectedScope = { region_codes: ["north-india", "west-india"], tradition_codes: ["smarta-north-india", "smarta-west-india"], language_codes: ["en", "hi"], family_custom_overrides_generic_sequence: true, resolved_evening_required: true, precise_provider_muhurta_reproduced: false };
  if (JSON.stringify(pack.scope) !== JSON.stringify(expectedScope)) throw new Error("Yama Deepam practice scope drift");
  if (pack.sources.length !== 4 || new Set(pack.sources.map((source) => source.source_id)).size !== 4 || pack.sources[0].artifact_sha256 !== FIXTURE_FILE_SHA256) throw new Error("Yama Deepam source universe drift");

  const fixturePath = resolve(process.cwd(), "../..", "knowledge_packs/panchang/yama-deepam-delhi-2026-v1.json");
  const fixtureBytes = readFileSync(fixturePath);
  const fixtureHash = createHash("sha256").update(fixtureBytes).digest("hex");
  if (fixtureHash !== FIXTURE_FILE_SHA256) throw new Error(`Yama Deepam fixture drift: ${fixtureHash}`);
  const fixture = JSON.parse(fixtureBytes.toString("utf8")) as Fixture;
  const fetchesValid = fixture.live_source.response_is_byte_dynamic
    && fixture.live_source.fetches.length === 3
    && new Set(fixture.live_source.fetches.map((fetch) => fetch.response_sha256)).size === 3
    && fixture.live_source.fetches.every((fetch) => fetch.status === 200 && fetch.response_bytes === 77850 && fetch.strict_utf8 && fetch.final_url.includes("geoname-id=1261481"));
  if (fixture.contract !== "DEVAM_YAMA_DEEPAM_DATE_AND_PRACTICE_EVIDENCE_FIXTURE_V1" || fixture.scope.selected_civil_date !== "2026-11-06" || fixture.scope.practice_boundary !== "one_safe_household_lamp_or_flame_free_light_outside_the_home_during_the_resolved_evening" || fixture.decision.observance_slug !== "yama-deepam" || fixture.decision.selected_civil_date !== "2026-11-06" || !fixture.decision.dhantrayodashi_remains_a_separate_practice_lane || !fetchesValid) throw new Error("Yama Deepam fixture semantic drift");
  const observation = fixture.live_source.stable_semantic_observation;
  if (observation.civil_date !== "2026-11-06" || !observation.trayodashi_tithi_during_diwali || !observation.deepak_for_yamaraj || !observation.outside_home || !observation.sandhya_time || !observation.ritual_named_deepdan_for_yamaraj || Object.values(fixture.denials).some((value) => value !== false) || fixture.fixed_source.object_sha256 !== "a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b" || fixture.fixed_source.object_bytes !== 93531683 || fixture.fixed_source.visually_inspected_pdf_pages.join("|") !== "213") throw new Error("Yama Deepam evidence boundary drift");

  const sourceIds = new Set(pack.sources.map((source) => source.source_id));
  if (pack.guides.length !== 2 || pack.guides.map((guide) => guide.language_code).join("|") !== "en|hi") throw new Error("Yama Deepam language universe drift");
  for (const guide of pack.guides) {
    if (guide.context_prompts.length !== 4 || guide.tiers.map((tier) => tier.tier).join("|") !== TIER_ORDER.join("|")) throw new Error(`Yama Deepam guide structure drift: ${guide.guide_id}`);
    for (const tier of guide.tiers) {
      if (tier.steps.map((step) => step.ordinal).join("|") !== tier.steps.map((_, index) => index + 1).join("|") || tier.steps.some((step) => step.source_ids.length === 0 || step.source_ids.some((sourceId) => !sourceIds.has(sourceId)))) throw new Error(`Yama Deepam step evidence drift: ${guide.guide_id}/${tier.tier}`);
      if (tier.materials.some((material) => material.substitutions.length === 0)) throw new Error(`Yama Deepam substitution drift: ${guide.guide_id}/${tier.tier}`);
    }
  }
  const requiredTrue = ["minimum_standard_elaborate_forms_included", "hindi_and_english_included", "substitutions_included", "family_context_prompts_included", "outside_home_evening_light_supported"];
  const requiredFalse = ["formal_priest_mantras_included", "tarpana_procedure_included", "south_facing_direction_required", "fixed_lamp_count_required", "specific_oil_wick_or_lamp_material_required", "lamp_left_unattended_or_burning_overnight", "guaranteed_protection_or_longevity_outcome_claimed", "precise_provider_muhurta_reproduced", "dhantrayodashi_merged_or_completed", "one_universal_procedure_claimed", "all_regional_and_family_variants_complete"];
  if (requiredTrue.some((key) => pack.boundaries[key] !== true) || requiredFalse.some((key) => pack.boundaries[key] !== false)) throw new Error("Yama Deepam practice boundary drift");
  return pack;
}

const pack = loadPack();

export function resolveYamaDeepamProcedure(request: PracticeGuidanceRequest): RitualProcedureGuide | null {
  const validPair = (request.regionCode === "north-india" && request.traditionCode === "smarta-north-india")
    || (request.regionCode === "west-india" && request.traditionCode === "smarta-west-india");
  if (request.observanceSlug !== "yama-deepam" || !validPair) return null;
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
      outsideHomeEveningLightSupported: true,
      tarpanaProcedureIncluded: false,
      southFacingDirectionRequired: false,
      fixedLampCountRequired: false,
      specificOilWickOrLampMaterialRequired: false,
      lampLeftUnattendedOrBurningOvernight: false,
      guaranteedProtectionOrLongevityOutcomeClaimed: false,
      preciseProviderMuhurtaReproduced: false,
      dhantrayodashiMergedOrCompleted: false,
    },
  };
}

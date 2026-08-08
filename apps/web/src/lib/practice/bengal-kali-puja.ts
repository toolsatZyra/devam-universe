import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PracticeGuidanceRequest, RitualProcedureGuide } from "../domain/practice";

const PACK_SHA256 = "77520232ca50f335ae7eae075ae84c2cbf20dc7eb825dd73430768e82badd460";
const FIXTURE_SHA256 = "faa675ee7ece5ed1513f75b49fef6db2ab0f9b0ea324f58a40990864c46c165c";
const TIER_ORDER = ["minimum", "standard", "elaborate"] as const;
const SOURCE_IDS = [
  "devam-bengal-kali-puja-date-fixture",
  "west-bengal-aasan-kali-puja",
  "ramakrishna-math-kali-puja-night-context",
  "devam-kali-puja-safety-and-authority-boundary",
] as const;

type Source = {
  source_id: string;
  title: string;
  publisher: string;
  url: string | null;
  source_class: string;
  rights_lane: "reference_only" | "derivative_allowed";
  artifact_sha256?: string;
  observed_fetch?: {
    fetched_at_utc: string;
    status: number;
    final_url: string;
    response_bytes: number;
    response_sha256: string;
    strict_utf8: boolean;
  };
  observed_literals?: Record<string, boolean>;
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
  const packPath = resolve(process.cwd(), "../..", "knowledge_packs/rituals/bengal-kali-puja-participation-v1.json");
  const bytes = readFileSync(packPath);
  const hash = createHash("sha256").update(bytes).digest("hex");
  if (hash !== PACK_SHA256) throw new Error(`Bengal Kali Puja practice-pack drift: ${hash}`);
  const pack = JSON.parse(bytes.toString("utf8")) as Pack;
  const expectedScope = {
    region_codes: ["bengal"],
    tradition_codes: ["shakta-bengal"],
    language_codes: ["en", "hi"],
    kolkata_2026_date_fixture_required: true,
    family_temple_or_pandal_authority_overrides_generic_sequence: true,
    precise_provider_muhurta_reproduced: false,
  };
  if (
    pack.contract !== "DEVAM_RITUAL_PROCEDURE_PACK_V1" ||
    pack.pack_id !== "devam-bengal-kali-puja-participation-v1" ||
    pack.observance_slug !== "bengal-kali-puja" ||
    JSON.stringify(pack.scope) !== JSON.stringify(expectedScope)
  ) throw new Error("Bengal Kali Puja practice identity drift");

  const fixturePath = resolve(process.cwd(), "../..", "knowledge_packs/panchang/kali-puja-kolkata-2026-v1.json");
  if (
    createHash("sha256").update(readFileSync(fixturePath)).digest("hex") !== FIXTURE_SHA256 ||
    pack.sources.map((source) => source.source_id).join("|") !== SOURCE_IDS.join("|") ||
    pack.sources[0].artifact_sha256 !== FIXTURE_SHA256
  ) throw new Error("Bengal Kali Puja source fixture drift");

  const aasan = pack.sources[1];
  if (
    aasan.url !== "https://aasan.wb.gov.in/" ||
    aasan.observed_fetch?.status !== 200 ||
    aasan.observed_fetch.final_url !== aasan.url ||
    aasan.observed_fetch.response_bytes !== 33712 ||
    aasan.observed_fetch.response_sha256 !== "a4e79a8e61ba128d065de1a677c403329424416c87940ba9b198b334442f02d1" ||
    !aasan.observed_fetch.strict_utf8 ||
    Object.keys(aasan.observed_literals ?? {}).sort().join("|") !== ["devotional_songs_prayers_and_offerings", "homes_and_temples", "kali_puja", "mahanisha_puja_alias", "pandal_and_community_context", "shyama_puja_alias"].sort().join("|") ||
    Object.values(aasan.observed_literals ?? {}).some((value) => !value)
  ) throw new Error("Bengal Kali Puja official regional observation drift");

  const sourceIds = new Set(pack.sources.map((source) => source.source_id));
  if (pack.guides.map((guide) => guide.language_code).join("|") !== "en|hi") throw new Error("Bengal Kali Puja language drift");
  for (const guide of pack.guides) {
    if (guide.context_prompts.length !== 4 || guide.tiers.map((tier) => tier.tier).join("|") !== TIER_ORDER.join("|")) throw new Error(`Bengal Kali Puja structure drift: ${guide.guide_id}`);
    if (guide.tiers.map((tier) => tier.estimated_minutes).join("|") !== "10|30|90") throw new Error(`Bengal Kali Puja duration drift: ${guide.guide_id}`);
    for (const tier of guide.tiers) {
      if (
        tier.materials.some((item) => !item.substitutions.length) ||
        tier.steps.some((step, index) => step.ordinal !== index + 1 || !step.source_ids.length || step.source_ids.some((id) => !sourceIds.has(id)))
      ) throw new Error(`Bengal Kali Puja evidence drift: ${guide.guide_id}/${tier.tier}`);
    }
  }

  const trueKeys = ["minimum_standard_elaborate_forms_included", "hindi_and_english_included", "substitutions_included", "family_context_prompts_included", "home_temple_and_public_participation_supported"];
  const falseKeys = ["formal_priest_mantras_included", "tantric_or_initiatory_instruction_included", "bali_instruction_included", "fasting_or_all_night_vigil_prescribed", "fixed_deity_form_or_offering_list_required", "precise_provider_muhurta_reproduced", "lakshmi_puja_merged_or_completed", "one_universal_bengal_procedure_claimed", "all_home_temple_pandal_and_lineage_variants_complete"];
  if (trueKeys.some((key) => pack.boundaries[key] !== true) || falseKeys.some((key) => pack.boundaries[key] !== false)) throw new Error("Bengal Kali Puja boundary drift");
  return pack;
}

const pack = loadPack();

export function resolveBengalKaliPujaProcedure(request: PracticeGuidanceRequest): RitualProcedureGuide | null {
  if (request.observanceSlug !== "bengal-kali-puja" || request.regionCode !== "bengal" || request.traditionCode !== "shakta-bengal") return null;
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
      steps: tier.steps.map((step) => ({ ordinal: step.ordinal, instruction: step.instruction, why: step.why, optional: step.optional, sourceIds: [...step.source_ids] })),
    })),
    companionReading: null,
    evidence: {
      packId: pack.pack_id,
      packFileSha256: PACK_SHA256,
      editorialStatus: pack.editorial_status,
      sourceTextReturnedByApi: false,
      sources: pack.sources.map((source) => ({ sourceId: source.source_id, title: source.title, publisher: source.publisher, url: source.url, sourceClass: source.source_class, rightsLane: source.rights_lane })),
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
      homeTempleAndPublicParticipationSupported: true,
      tantricOrInitiatoryInstructionIncluded: false,
      baliInstructionIncluded: false,
      fastingOrAllNightVigilPrescribed: false,
      fixedDeityFormOrOfferingListRequired: false,
      preciseProviderMuhurtaReproduced: false,
      lakshmiPujaMergedOrCompleted: false,
      allHomeTemplePandalAndLineageVariantsComplete: false,
    },
  };
}

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PracticeGuidanceRequest, RitualProcedureGuide } from "../domain/practice";

const PACK_SHA256 = "0b7ce19875a7783b4f39a263d4e40952a7ae9c26c407db579652eb2835cf5793";
const FIXTURE_SHA256 = "a05f45a558061686e16fbe739b4d78dc5e86f9cf0c809c7f8eec28063123bdf1";
const HISTORICAL_SOURCE_SHA256 = "a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b";
const OBSERVANCE_SLUGS = ["krishna-janmashtami-smarta", "krishna-janmashtami-iskcon"] as const;
const SOURCE_IDS = ["devam-janmashtami-calendar-fixture", "nirnayasindhu-1865-janmashtami-decision", "incredible-india-janmashtami", "incredible-india-dwarka-janmashtami-2026", "iskcon-bangalore-janmashtami-2026", "devam-janmashtami-safety-boundary"];
const LANE_PAIRS = [
  { observance_slug: "krishna-janmashtami-smarta", region_code: "north-india", tradition_code: "smarta-north-india" },
  { observance_slug: "krishna-janmashtami-smarta", region_code: "west-india", tradition_code: "smarta-west-india" },
  { observance_slug: "krishna-janmashtami-iskcon", region_code: "iskcon-india", tradition_code: "vaishnava-iskcon" },
] as const;
const EXPECTED_SCOPE = { lane_pairs: LANE_PAIRS, language_codes: ["en", "hi"], delhi_2026_calendar_fixture_required: true, smarta_and_iskcon_identity_and_authority_notes_separate: true, same_2026_civil_date_does_not_prove_rule_equivalence: true, family_or_sampradaya_practice_overrides_shared_devotional_core: true, fasting_food_health_midnight_and_parana_guidance_excluded: true };

type Source = { source_id: string; title: string; publisher: string; url: string | null; source_class: string; rights_lane: "reference_only" | "derivative_allowed"; artifact_sha256?: string; observed_fetch?: { status: number; final_url: string; response_bytes: number; response_sha256: string; strict_utf8: boolean } };
type Guide = { guide_id: string; language_code: "en" | "hi"; title: string; summary: string; family_practice_note: string; context_prompts: string[]; tiers: Array<{ tier: "minimum" | "standard" | "elaborate"; label: string; estimated_minutes: number; materials: Array<{ item: string; substitutions: string[]; optional: boolean }>; steps: Array<{ ordinal: number; instruction: string; why: string; optional: boolean; source_ids: string[] }> }> };
type Pack = { contract: string; pack_id: string; editorial_status: "internal_beta_research_synthesis"; observance_slugs: string[]; scope: Record<string, unknown>; sources: Source[]; lane_notes: Record<"en" | "hi", Record<string, string>>; guides: Guide[]; boundaries: Record<string, boolean> };

function loadPack(): Pack {
  const root = resolve(process.cwd(), "../..");
  const bytes = readFileSync(resolve(root, "knowledge_packs/rituals/krishna-janmashtami-smarta-iskcon-v1.json"));
  if (createHash("sha256").update(bytes).digest("hex") !== PACK_SHA256) throw new Error("Krishna Janmashtami practice-pack drift");
  const pack = JSON.parse(bytes.toString("utf8")) as Pack;
  if (pack.contract !== "DEVAM_MULTI_LANE_RITUAL_PROCEDURE_PACK_V1" || pack.pack_id !== "devam-krishna-janmashtami-smarta-iskcon-v1" || pack.editorial_status !== "internal_beta_research_synthesis" || JSON.stringify(pack.observance_slugs) !== JSON.stringify(OBSERVANCE_SLUGS) || JSON.stringify(pack.scope) !== JSON.stringify(EXPECTED_SCOPE)) throw new Error("Krishna Janmashtami practice identity drift");
  const fixtureBytes = readFileSync(resolve(root, "knowledge_packs/panchang/krishna-janmashtami-delhi-2026-v1.json"));
  if (createHash("sha256").update(fixtureBytes).digest("hex") !== FIXTURE_SHA256 || pack.sources.map((source) => source.source_id).join("|") !== SOURCE_IDS.join("|") || pack.sources[0].artifact_sha256 !== FIXTURE_SHA256 || pack.sources[1].artifact_sha256 !== HISTORICAL_SOURCE_SHA256) throw new Error("Krishna Janmashtami practice source universe drift");
  const expectedObservations = [
    ["https://www.incredibleindia.gov.in/en/festivals-and-events/janmashtami", 535822, "1acd92558e9c3d632d8ebe68a10744f865e7526b7c1500f9a8f5c70fa1c10064"],
    ["https://www.incredibleindia.gov.in/en/festivals-and-events/gujarat/janmashtami-at-dwarka-2026", 485639, "cdac9160bdec1c748b376e037c9e94d8e91e32f36813104e2cb043af49c75442"],
    ["https://www.iskconbangalore.org/sri-krishna-janmashtami/", 121282, "39b2f4531c5627506d516af2563eee3159b9b5e7b69c0e3d5c2a9f1bc2c6e07f"],
  ] as const;
  for (let index = 0; index < expectedObservations.length; index += 1) {
    const source = pack.sources[index + 2];
    const fetch = source?.observed_fetch;
    const [url, responseBytes, sha256] = expectedObservations[index];
    if (source?.url !== url || !fetch || fetch.status !== 200 || fetch.final_url !== url || fetch.response_bytes !== responseBytes || fetch.response_sha256 !== sha256 || fetch.strict_utf8 !== true) throw new Error("Krishna Janmashtami living-practice observation drift");
  }
  const sourceIds = new Set(SOURCE_IDS);
  if (Object.keys(pack.lane_notes).join("|") !== "en|hi" || Object.values(pack.lane_notes).some((notes) => Object.keys(notes).join("|") !== OBSERVANCE_SLUGS.join("|") || Object.values(notes).some((note) => note.length < 80))) throw new Error("Krishna Janmashtami lane-note drift");
  if (pack.guides.map((guide) => guide.language_code).join("|") !== "en|hi") throw new Error("Krishna Janmashtami language drift");
  for (const guide of pack.guides) {
    if (guide.context_prompts.length !== 4 || guide.tiers.map((tier) => tier.tier).join("|") !== "minimum|standard|elaborate" || guide.tiers.map((tier) => tier.estimated_minutes).join("|") !== "10|30|60") throw new Error(`Krishna Janmashtami guide structure drift: ${guide.guide_id}`);
    for (const tier of guide.tiers) if (tier.materials.some((item) => item.substitutions.length === 0) || tier.steps.some((step, index) => step.ordinal !== index + 1 || step.source_ids.length === 0 || step.source_ids.some((id) => !sourceIds.has(id)))) throw new Error(`Krishna Janmashtami guide evidence drift: ${guide.guide_id}/${tier.tier}`);
  }
  const trueKeys = ["minimum_standard_elaborate_forms_included", "hindi_and_english_included", "substitutions_included", "family_context_prompts_included", "smarta_and_iskcon_lane_notes_separate", "shared_devotional_core_without_rule_equivalence", "material_flame_food_and_non_fasting_form_supported", "attributable_reading_bhajan_kirtan_and_official_stream_supported"];
  const falseKeys = ["fast_or_nirjala_regimen_prescribed", "food_or_dietary_rules_given", "medical_guidance_given", "midnight_vigil_or_exact_muhurta_required", "abhisheka_aarti_offering_cradle_murti_dressing_or_footprints_required", "dahi_handi_participation_or_human_pyramid_instructed", "parana_or_next_day_close_served", "purchase_donation_decoration_new_clothes_or_special_food_required", "smarta_and_iskcon_rules_equated", "all_vaishnava_smarta_regional_family_and_temple_variants_complete", "blessing_protection_merit_prosperity_or_other_outcome_guaranteed"];
  if (Object.keys(pack.boundaries).sort().join("|") !== [...trueKeys, ...falseKeys].sort().join("|") || trueKeys.some((key) => pack.boundaries[key] !== true) || falseKeys.some((key) => pack.boundaries[key] !== false)) throw new Error("Krishna Janmashtami practice boundary drift");
  return pack;
}

const pack = loadPack();

export function resolveKrishnaJanmashtamiProcedure(request: PracticeGuidanceRequest): RitualProcedureGuide | null {
  if (!LANE_PAIRS.some((pair) => pair.observance_slug === request.observanceSlug && pair.region_code === request.regionCode && pair.tradition_code === request.traditionCode)) return null;
  const guide = pack.guides.find((candidate) => candidate.language_code === request.languageCode);
  const laneNote = pack.lane_notes[request.languageCode][request.observanceSlug];
  if (!guide || !laneNote) return null;
  return {
    guideId: guide.guide_id,
    companionToObservanceSlug: request.observanceSlug,
    title: guide.title,
    languageCode: guide.language_code,
    kind: "contextual_minimum_standard_elaborate_ritual_procedure",
    summary: guide.summary,
    familyPracticeNote: `${guide.family_practice_note} ${laneNote}`,
    contextPrompts: [...guide.context_prompts],
    tiers: guide.tiers.map((tier) => ({ tier: tier.tier, label: tier.label, estimatedMinutes: tier.estimated_minutes, materials: tier.materials.map((item) => ({ ...item, substitutions: [...item.substitutions] })), steps: tier.steps.map((step) => ({ ordinal: step.ordinal, instruction: step.instruction, why: step.why, optional: step.optional, sourceIds: [...step.source_ids] })) })),
    companionReading: null,
    evidence: { packId: pack.pack_id, packFileSha256: PACK_SHA256, editorialStatus: pack.editorial_status, sourceTextReturnedByApi: false, sources: pack.sources.map((source) => ({ sourceId: source.source_id, title: source.title, publisher: source.publisher, url: source.url, sourceClass: source.source_class, rightsLane: source.rights_lane })) },
    boundaries: { minimumStandardElaborateFormsIncluded: true, hindiAndEnglishIncluded: true, substitutionsIncluded: true, familyContextPromptsIncluded: true, formalPriestMantrasIncluded: false, historicalPrescriptionsPromotedAsModernNorms: false, oneUniversalProcedureClaimed: false, allRegionalVariantsComplete: false, allGaneshotsavDaysComplete: false, smartaAndIskconLaneNotesSeparate: true, sharedDevotionalCoreWithoutRuleEquivalence: true, materialFlameFoodAndNonFastingFormSupported: true, attributableReadingBhajanKirtanAndOfficialStreamSupported: true, fastOrNirjalaRegimenPrescribed: false, foodOrDietaryRulesGiven: false, medicalGuidanceGiven: false, midnightVigilOrExactMuhurtaRequired: false, abhishekaAartiOfferingCradleMurtiDressingOrFootprintsRequired: false, dahiHandiParticipationOrHumanPyramidInstructed: false, paranaOrNextDayCloseServed: false, purchaseDonationDecorationNewClothesOrSpecialFoodRequired: false, smartaAndIskconRulesEquated: false, allVaishnavaSmartaRegionalFamilyAndTempleVariantsComplete: false, blessingProtectionMeritProsperityOrOtherOutcomeGuaranteed: false },
  };
}

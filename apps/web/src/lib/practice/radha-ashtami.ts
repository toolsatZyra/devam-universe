import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PracticeGuidanceRequest, RitualProcedureGuide } from "../domain/practice";

const PACK_SHA256 = "675aa135e9aefaecfd9ae9326d5c9594e4447c324110e30de0553e01c79b0542";
const FIXTURE_SHA256 = "93f9fc2539ff87495012d31d9c87115c68b317eab679dbfc1725877ed9455867";
const HISTORICAL_SHA256 = "a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b";
const SOURCE_IDS = ["devam-radha-ashtami-iskcon-calendar-fixture", "nirnayasindhu-1865-general-shukla-ashtami-context", "drikpanchang-radha-ashtami-delhi-iskcon-2026", "iskcon-bangalore-radhashtami-2026", "iskcon-bangalore-vaishnava-calendar-2026", "devam-radha-ashtami-safety-boundary"];
const EXPECTED_SCOPE = { region_codes: ["iskcon-india"], tradition_codes: ["vaishnava-iskcon"], language_codes: ["en", "hi"], delhi_2026_iskcon_calendar_fixture_required: true, official_iskcon_temple_or_family_practice_overrides_generic_form: true, all_vaishnava_and_smarta_traditions_not_equated: true, fasting_food_health_formal_deity_worship_and_outcome_guidance_excluded: true };
type Source = { source_id: string; title: string; publisher: string; url: string | null; source_class: string; rights_lane: "reference_only" | "derivative_allowed"; artifact_sha256?: string; observed_fetch?: { status: number; final_url: string; response_bytes: number; response_sha256: string; strict_utf8: boolean } };
type Guide = { guide_id: string; language_code: "en" | "hi"; title: string; summary: string; family_practice_note: string; context_prompts: string[]; tiers: Array<{ tier: "minimum" | "standard" | "elaborate"; label: string; estimated_minutes: number; materials: Array<{ item: string; substitutions: string[]; optional: boolean }>; steps: Array<{ ordinal: number; instruction: string; why: string; optional: boolean; source_ids: string[] }> }> };
type Pack = { contract: string; pack_id: string; editorial_status: "internal_beta_research_synthesis"; observance_slug: string; scope: Record<string, unknown>; sources: Source[]; guides: Guide[]; boundaries: Record<string, boolean> };

function loadPack(): Pack {
  const root = resolve(process.cwd(), "../..");
  const bytes = readFileSync(resolve(root, "knowledge_packs/rituals/radha-ashtami-iskcon-participation-v1.json"));
  if (createHash("sha256").update(bytes).digest("hex") !== PACK_SHA256) throw new Error("Radha Ashtami practice-pack drift");
  const pack = JSON.parse(bytes.toString("utf8")) as Pack;
  if (pack.contract !== "DEVAM_RITUAL_PROCEDURE_PACK_V1" || pack.pack_id !== "devam-radha-ashtami-iskcon-participation-v1" || pack.observance_slug !== "radha-ashtami-iskcon" || pack.editorial_status !== "internal_beta_research_synthesis" || JSON.stringify(pack.scope) !== JSON.stringify(EXPECTED_SCOPE)) throw new Error("Radha Ashtami practice identity drift");
  const fixture = readFileSync(resolve(root, "knowledge_packs/panchang/radha-ashtami-delhi-iskcon-2026-v1.json"));
  if (createHash("sha256").update(fixture).digest("hex") !== FIXTURE_SHA256 || pack.sources.map((source) => source.source_id).join("|") !== SOURCE_IDS.join("|") || pack.sources[0].artifact_sha256 !== FIXTURE_SHA256 || pack.sources[1].artifact_sha256 !== HISTORICAL_SHA256) throw new Error("Radha Ashtami source universe drift");
  const observations = [
    ["https://www.drikpanchang.com/festivals/radha-ashtami/radha-ashtami-date-time.html?geoname-id=1273294&year=2026", 67159, "fae89430859fb45d5f1f00fa9969477fd197646f2453e9e7befffad6546452b1"],
    ["https://www.iskconbangalore.org/sri-radhashtami/", 116081, "150133c782373d0ccb539e6662b61366215cb79f26934bf43d4bca2f399f6f61"],
    ["https://www.iskconbangalore.org/vaishnava-calendar/", 100515, "a623a1e3fe41181c45a37efaecc6fe4f6c4af069dfd15e45255ed01276be9f6f"],
  ] as const;
  for (let index = 0; index < observations.length; index += 1) {
    const source = pack.sources[index + 2];
    const fetch = source?.observed_fetch;
    const [url, bytesCount, sha] = observations[index];
    if (source?.url !== url || !fetch || fetch.status !== 200 || fetch.final_url !== url || fetch.response_bytes !== bytesCount || fetch.response_sha256 !== sha || fetch.strict_utf8 !== true) throw new Error("Radha Ashtami living observation drift");
  }
  const sourceIds = new Set(SOURCE_IDS);
  if (pack.guides.map((guide) => guide.language_code).join("|") !== "en|hi") throw new Error("Radha Ashtami language drift");
  for (const guide of pack.guides) {
    if (guide.context_prompts.length !== 4 || guide.tiers.map((tier) => `${tier.tier}:${tier.estimated_minutes}`).join("|") !== "minimum:10|standard:30|elaborate:60") throw new Error("Radha Ashtami guide structure drift");
    for (const tier of guide.tiers) if (tier.materials.some((item) => item.substitutions.length === 0) || tier.steps.some((step, index) => step.ordinal !== index + 1 || step.source_ids.length === 0 || step.source_ids.some((id) => !sourceIds.has(id)))) throw new Error("Radha Ashtami evidence drift");
  }
  const trueKeys = ["minimum_standard_elaborate_forms_included", "hindi_and_english_included", "substitutions_included", "family_context_prompts_included", "radharani_appearance_attributable_teaching_song_prayer_kirtan_and_seva_supported", "official_iskcon_temple_programme_participation_supported", "material_free_and_non_fasting_home_form_supported"];
  const falseKeys = ["fast_food_dietary_or_medical_guidance_given", "abhisheka_arati_homa_deity_dressing_offering_kalasha_flower_or_formal_puja_prescribed", "bangalore_programme_time_reused_for_another_location", "sponsorship_donation_purchase_new_dress_or_chappan_bhog_required", "mercy_perfection_progress_protection_merit_or_other_outcome_guaranteed", "all_gaudiya_vaishnava_vaishnava_smarta_and_regional_traditions_equated", "all_radha_ashtami_traditions_complete"];
  if (Object.keys(pack.boundaries).sort().join("|") !== [...trueKeys, ...falseKeys].sort().join("|") || trueKeys.some((key) => pack.boundaries[key] !== true) || falseKeys.some((key) => pack.boundaries[key] !== false)) throw new Error("Radha Ashtami boundary drift");
  return pack;
}
const pack = loadPack();

export function resolveRadhaAshtamiProcedure(request: PracticeGuidanceRequest): RitualProcedureGuide | null {
  if (request.observanceSlug !== pack.observance_slug || request.regionCode !== "iskcon-india" || request.traditionCode !== "vaishnava-iskcon") return null;
  const guide = pack.guides.find((candidate) => candidate.language_code === request.languageCode);
  if (!guide) return null;
  return { guideId: guide.guide_id, companionToObservanceSlug: pack.observance_slug, title: guide.title, languageCode: guide.language_code, kind: "contextual_minimum_standard_elaborate_ritual_procedure", summary: guide.summary, familyPracticeNote: guide.family_practice_note, contextPrompts: [...guide.context_prompts], tiers: guide.tiers.map((tier) => ({ tier: tier.tier, label: tier.label, estimatedMinutes: tier.estimated_minutes, materials: tier.materials.map((item) => ({ ...item, substitutions: [...item.substitutions] })), steps: tier.steps.map((step) => ({ ordinal: step.ordinal, instruction: step.instruction, why: step.why, optional: step.optional, sourceIds: [...step.source_ids] })) })), companionReading: null, evidence: { packId: pack.pack_id, packFileSha256: PACK_SHA256, editorialStatus: pack.editorial_status, sourceTextReturnedByApi: false, sources: pack.sources.map((source) => ({ sourceId: source.source_id, title: source.title, publisher: source.publisher, url: source.url, sourceClass: source.source_class, rightsLane: source.rights_lane })) }, boundaries: { minimumStandardElaborateFormsIncluded: true, hindiAndEnglishIncluded: true, substitutionsIncluded: true, familyContextPromptsIncluded: true, formalPriestMantrasIncluded: false, historicalPrescriptionsPromotedAsModernNorms: false, oneUniversalProcedureClaimed: false, allRegionalVariantsComplete: false, allGaneshotsavDaysComplete: false, radharaniAppearanceAttributableTeachingSongPrayerKirtanAndSevaSupported: true, officialIskconTempleProgrammeParticipationSupported: true, materialFreeAndNonFastingHomeFormSupported: true, fastFoodDietaryOrMedicalGuidanceGiven: false, abhishekaAratiHomaDeityDressingOfferingKalashaFlowerOrFormalPujaPrescribed: false, bangaloreProgrammeTimeReusedForAnotherLocation: false, sponsorshipDonationPurchaseNewDressOrChappanBhogRequired: false, mercyPerfectionProgressProtectionMeritOrOtherOutcomeGuaranteed: false, allGaudiyaVaishnavaVaishnavaSmartaAndRegionalTraditionsEquated: false, allRadhaAshtamiTraditionsComplete: false } };
}

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PracticeGuidanceRequest, RitualProcedureGuide } from "../domain/practice";

const PACK_SHA256 = "aa87e99b554761ee2034154ea9f8e6204163134642fe0a97a86412d4592becc1";
const FIXTURE_SHA256 = "bef1772cbb368da2fa712740598d1881b98ffc1b6d8c4a99cfc93e02fa3420a3";
const HISTORICAL_SHA256 = "a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b";
const SOURCE_IDS = ["devam-hartalika-calendar-fixture", "nirnayasindhu-1865-hartalika-decision", "drikpanchang-hartalika-delhi-2026", "utsav-hartalika-teej-rajasthan", "incredible-india-teej", "haryana-art-culture-teej", "devam-hartalika-safety-boundary"];
const PAIRS = [{ region_code: "north-india", tradition_code: "smarta-north-india" }, { region_code: "west-india", tradition_code: "smarta-west-india" }] as const;
const EXPECTED_SCOPE = { region_codes: ["north-india", "west-india"], tradition_codes: ["smarta-north-india", "smarta-west-india"], language_codes: ["en", "hi"], delhi_2026_calendar_fixture_required: true, family_and_regional_practice_overrides_generic_sequence: true, gowri_habba_and_other_teej_festivals_remain_separate: true, fasting_food_health_and_formal_puja_guidance_excluded: true };

type Source = { source_id: string; title: string; publisher: string; url: string | null; source_class: string; rights_lane: "reference_only" | "derivative_allowed"; artifact_sha256?: string; observed_fetch?: { status: number; final_url: string; response_bytes: number; response_sha256: string; strict_utf8: boolean } };
type Guide = { guide_id: string; language_code: "en" | "hi"; title: string; summary: string; family_practice_note: string; context_prompts: string[]; tiers: Array<{ tier: "minimum" | "standard" | "elaborate"; label: string; estimated_minutes: number; materials: Array<{ item: string; substitutions: string[]; optional: boolean }>; steps: Array<{ ordinal: number; instruction: string; why: string; optional: boolean; source_ids: string[] }> }> };
type Pack = { contract: string; pack_id: string; editorial_status: "internal_beta_research_synthesis"; observance_slug: string; scope: Record<string, unknown>; sources: Source[]; guides: Guide[]; boundaries: Record<string, boolean> };

function loadPack(): Pack {
  const root = resolve(process.cwd(), "../..");
  const bytes = readFileSync(resolve(root, "knowledge_packs/rituals/hartalika-teej-north-west-india-v1.json"));
  if (createHash("sha256").update(bytes).digest("hex") !== PACK_SHA256) throw new Error("Hartalika Teej practice-pack drift");
  const pack = JSON.parse(bytes.toString("utf8")) as Pack;
  if (pack.contract !== "DEVAM_RITUAL_PROCEDURE_PACK_V1" || pack.pack_id !== "devam-hartalika-teej-north-west-india-v1" || pack.observance_slug !== "hartalika-teej" || pack.editorial_status !== "internal_beta_research_synthesis" || JSON.stringify(pack.scope) !== JSON.stringify(EXPECTED_SCOPE)) throw new Error("Hartalika Teej practice identity drift");
  const fixture = readFileSync(resolve(root, "knowledge_packs/panchang/hartalika-teej-delhi-2026-v1.json"));
  if (createHash("sha256").update(fixture).digest("hex") !== FIXTURE_SHA256 || pack.sources.map((source) => source.source_id).join("|") !== SOURCE_IDS.join("|") || pack.sources[0].artifact_sha256 !== FIXTURE_SHA256 || pack.sources[1].artifact_sha256 !== HISTORICAL_SHA256) throw new Error("Hartalika Teej source universe drift");
  const observations = [
    ["https://www.drikpanchang.com/festivals/teej/hartalika-teej-date-time.html?geoname-id=1273294&year=2026", 66646, "90f7b062dcd887fb0eb0c2922bef3ae281e4cf378ec5f680c4f3bc0c69a915ae"],
    ["https://utsav.gov.in/public/view-event/hartalika-teej-2025-1", 34611, "add34db6cd0445fcf4538f929f19b6b33ea767b6a22022546b9159d88dff6b30"],
    ["https://www.incredibleindia.gov.in/en/festivals-and-events/teej", 528363, "640d149c90f67f7d8ae29a9c935ed2025dc701572dc32434f1a1223865b486b4"],
    ["https://artandculturalaffairshry.gov.in/teej-festival/", 94379, "5d77d98ef15cf2d0f37be6bc5855e9a8c10ec20085b18743db7a46494c51a5e0"],
  ] as const;
  for (let index = 0; index < observations.length; index += 1) {
    const source = pack.sources[index + 2]; const fetch = source?.observed_fetch; const [url, responseBytes, sha256] = observations[index];
    if (source?.url !== url || !fetch || fetch.status !== 200 || fetch.final_url !== url || fetch.response_bytes !== responseBytes || fetch.response_sha256 !== sha256 || fetch.strict_utf8 !== true) throw new Error("Hartalika Teej living-practice observation drift");
  }
  const sourceIds = new Set(SOURCE_IDS);
  if (pack.guides.map((guide) => guide.language_code).join("|") !== "en|hi") throw new Error("Hartalika Teej language drift");
  for (const guide of pack.guides) {
    if (guide.context_prompts.length !== 4 || guide.tiers.map((tier) => `${tier.tier}:${tier.estimated_minutes}`).join("|") !== "minimum:10|standard:30|elaborate:60") throw new Error("Hartalika Teej guide structure drift");
    for (const tier of guide.tiers) if (tier.materials.some((item) => item.substitutions.length === 0) || tier.steps.some((step, index) => step.ordinal !== index + 1 || step.source_ids.length === 0 || step.source_ids.some((id) => !sourceIds.has(id)))) throw new Error("Hartalika Teej guide evidence drift");
  }
  const trueKeys = ["minimum_standard_elaborate_forms_included", "hindi_and_english_included", "substitutions_included", "family_context_prompts_included", "parvati_shiva_remembrance_story_song_prayer_and_service_supported", "material_free_and_non_fasting_form_supported", "regional_and_family_attribution_preserved"];
  const falseKeys = ["fast_or_nirjala_regimen_prescribed", "food_dietary_or_medical_guidance_given", "formal_sankalpa_katha_puja_mantra_offering_or_close_prescribed", "women_only_or_married_household_only_participation_universalized", "clothing_jewellery_mehendi_swing_gift_sweet_flower_or_purchase_required", "marriage_spouse_longevity_progeny_family_prosperity_or_other_outcome_guaranteed", "gowri_habba_or_other_teej_festivals_merged", "all_north_west_nepal_and_diaspora_variants_complete"];
  if (Object.keys(pack.boundaries).sort().join("|") !== [...trueKeys, ...falseKeys].sort().join("|") || trueKeys.some((key) => pack.boundaries[key] !== true) || falseKeys.some((key) => pack.boundaries[key] !== false)) throw new Error("Hartalika Teej boundary drift");
  return pack;
}

const pack = loadPack();

export function resolveHartalikaTeejProcedure(request: PracticeGuidanceRequest): RitualProcedureGuide | null {
  if (request.observanceSlug !== pack.observance_slug || !PAIRS.some((pair) => pair.region_code === request.regionCode && pair.tradition_code === request.traditionCode)) return null;
  const guide = pack.guides.find((candidate) => candidate.language_code === request.languageCode);
  if (!guide) return null;
  return { guideId: guide.guide_id, companionToObservanceSlug: pack.observance_slug, title: guide.title, languageCode: guide.language_code, kind: "contextual_minimum_standard_elaborate_ritual_procedure", summary: guide.summary, familyPracticeNote: guide.family_practice_note, contextPrompts: [...guide.context_prompts], tiers: guide.tiers.map((tier) => ({ tier: tier.tier, label: tier.label, estimatedMinutes: tier.estimated_minutes, materials: tier.materials.map((item) => ({ ...item, substitutions: [...item.substitutions] })), steps: tier.steps.map((step) => ({ ordinal: step.ordinal, instruction: step.instruction, why: step.why, optional: step.optional, sourceIds: [...step.source_ids] })) })), companionReading: null, evidence: { packId: pack.pack_id, packFileSha256: PACK_SHA256, editorialStatus: pack.editorial_status, sourceTextReturnedByApi: false, sources: pack.sources.map((source) => ({ sourceId: source.source_id, title: source.title, publisher: source.publisher, url: source.url, sourceClass: source.source_class, rightsLane: source.rights_lane })) }, boundaries: { minimumStandardElaborateFormsIncluded: true, hindiAndEnglishIncluded: true, substitutionsIncluded: true, familyContextPromptsIncluded: true, formalPriestMantrasIncluded: false, historicalPrescriptionsPromotedAsModernNorms: false, oneUniversalProcedureClaimed: false, allRegionalVariantsComplete: false, allGaneshotsavDaysComplete: false, parvatiShivaRemembranceStorySongPrayerAndServiceSupported: true, materialFreeAndNonFastingFormSupported: true, regionalAndFamilyAttributionPreserved: true, fastOrNirjalaRegimenPrescribed: false, foodDietaryOrMedicalGuidanceGiven: false, formalSankalpaKathaPujaMantraOfferingOrClosePrescribed: false, womenOnlyOrMarriedHouseholdOnlyParticipationUniversalized: false, clothingJewelleryMehendiSwingGiftSweetFlowerOrPurchaseRequired: false, marriageSpouseLongevityProgenyFamilyProsperityOrOtherOutcomeGuaranteed: false, gowriHabbaOrOtherTeejFestivalsMerged: false, allNorthWestNepalAndDiasporaVariantsComplete: false } };
}

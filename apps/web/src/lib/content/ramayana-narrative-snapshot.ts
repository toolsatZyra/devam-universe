import { getHeroJourney } from "../../data/hero-experiences";
import { RAMAYANA_BEGINNINGS_SCENE_OUTLINES } from "../../data/ramayana-beginnings-outline";
import { RAMAYANA_BROKEN_TRAIL_SCENE_OUTLINES } from "../../data/ramayana-broken-trail-outline";
import { RAMAYANA_BROKEN_TRAIL_PLAYABLE_SCENES } from "../../data/ramayana-broken-trail-playable";
import { RAMAYANA_TOWARD_PAMPA_SCENE_OUTLINES } from "../../data/ramayana-toward-pampa-outline";
import { RAMAYANA_TOWARD_PAMPA_PLAYABLE_SCENES } from "../../data/ramayana-toward-pampa-playable";
import { RAMAYANA_HANUMAN_MEETS_RAMA_SCENE_OUTLINES } from "../../data/ramayana-hanuman-meets-rama-outline";
import { RAMAYANA_HANUMAN_MEETS_RAMA_PLAYABLE_SCENES } from "../../data/ramayana-hanuman-meets-rama-playable";
import { RAMAYANA_TWO_LOSSES_ONE_ALLIANCE_SCENE_OUTLINES } from "../../data/ramayana-two-losses-one-alliance-outline";
import { RAMAYANA_TWO_LOSSES_ONE_ALLIANCE_PLAYABLE_SCENES } from "../../data/ramayana-two-losses-one-alliance-playable";
import { RAMAYANA_VALI_FALLS_SCENE_OUTLINES } from "../../data/ramayana-vali-falls-outline";
import { RAMAYANA_VALI_FALLS_PLAYABLE_SCENES } from "../../data/ramayana-vali-falls-playable";
import { RAMAYANA_RAINS_AND_DELAY_SCENE_OUTLINES } from "../../data/ramayana-rains-and-delay-outline";
import { RAMAYANA_RAINS_AND_DELAY_PLAYABLE_SCENES } from "../../data/ramayana-rains-and-delay-playable";
import { RAMAYANA_SEARCH_EVERY_HORIZON_SCENE_OUTLINES } from "../../data/ramayana-search-every-horizon-outline";
import { RAMAYANA_SEARCH_EVERY_HORIZON_PLAYABLE_SCENES } from "../../data/ramayana-search-every-horizon-playable";
import { RAMAYANA_SAMPATI_REVEALS_LANKA_SCENE_OUTLINES } from "../../data/ramayana-sampati-reveals-lanka-outline";
import { RAMAYANA_SAMPATI_REVEALS_LANKA_PLAYABLE_SCENES } from "../../data/ramayana-sampati-reveals-lanka-playable";
import { RAMAYANA_HANUMAN_REMEMBERS_SCENE_OUTLINES } from "../../data/ramayana-hanuman-remembers-outline";
import { RAMAYANA_HANUMAN_REMEMBERS_PLAYABLE_SCENES } from "../../data/ramayana-hanuman-remembers-playable";
import { RAMAYANA_LEAP_ACROSS_OCEAN_SCENE_OUTLINES } from "../../data/ramayana-leap-across-ocean-outline";
import { RAMAYANA_LEAP_ACROSS_OCEAN_PLAYABLE_SCENES } from "../../data/ramayana-leap-across-ocean-playable";
import { RAMAYANA_SEARCHING_LANKA_SCENE_OUTLINES } from "../../data/ramayana-searching-lanka-outline";
import { RAMAYANA_SEARCHING_LANKA_PLAYABLE_SCENES } from "../../data/ramayana-searching-lanka-playable";
import { RAMAYANA_SITA_ASHOKA_GROVE_SCENE_OUTLINES } from "../../data/ramayana-sita-ashoka-grove-outline";
import { RAMAYANA_SITA_ASHOKA_GROVE_PLAYABLE_SCENES } from "../../data/ramayana-sita-ashoka-grove-playable";
import { RAMAYANA_MESSENGER_TOKEN_SCENE_OUTLINES } from "../../data/ramayana-messenger-token-outline";
import { RAMAYANA_MESSENGER_TOKEN_PLAYABLE_SCENES } from "../../data/ramayana-messenger-token-playable";
import { RAMAYANA_LANKA_BURNS_SCENE_OUTLINES } from "../../data/ramayana-lanka-burns-outline";
import { RAMAYANA_LANKA_BURNS_PLAYABLE_SCENES } from "../../data/ramayana-lanka-burns-playable";
import { RAMAYANA_RETURN_OVER_OCEAN_SCENE_OUTLINES } from "../../data/ramayana-return-over-ocean-outline";
import { RAMAYANA_RETURN_OVER_OCEAN_PLAYABLE_SCENES } from "../../data/ramayana-return-over-ocean-playable";
import { RAMAYANA_NEWS_REACHES_RAMA_SCENE_OUTLINES } from "../../data/ramayana-news-reaches-rama-outline";
import { RAMAYANA_NEWS_REACHES_RAMA_PLAYABLE_SCENES } from "../../data/ramayana-news-reaches-rama-playable";
import { RAMAYANA_OCEAN_BRIDGE_SCENE_OUTLINES } from "../../data/ramayana-ocean-bridge-outline";
import { RAMAYANA_OCEAN_BRIDGE_PLAYABLE_SCENES } from "../../data/ramayana-ocean-bridge-playable";
import { RAMAYANA_LANKA_SURROUNDED_SCENE_OUTLINES } from "../../data/ramayana-lanka-surrounded-outline";
import { RAMAYANA_LANKA_SURROUNDED_PLAYABLE_SCENES } from "../../data/ramayana-lanka-surrounded-playable";
import { RAMAYANA_KUMBHAKARNA_RISES_SCENE_OUTLINES } from "../../data/ramayana-kumbhakarna-rises-outline";
import { RAMAYANA_KUMBHAKARNA_RISES_PLAYABLE_SCENES } from "../../data/ramayana-kumbhakarna-rises-playable";
import { RAMAYANA_INDRAJIT_LAST_WAR_SCENE_OUTLINES } from "../../data/ramayana-indrajit-last-war-outline";
import { RAMAYANA_INDRAJIT_LAST_WAR_PLAYABLE_SCENES } from "../../data/ramayana-indrajit-last-war-playable";
import { RAMAYANA_RAVANA_FINAL_BATTLE_SCENE_OUTLINES } from "../../data/ramayana-ravana-final-battle-outline";
import { RAMAYANA_RAVANA_FINAL_BATTLE_PLAYABLE_SCENES } from "../../data/ramayana-ravana-final-battle-playable";
import { RAMAYANA_SITA_AFTERMATH_SCENE_OUTLINES } from "../../data/ramayana-sita-aftermath-outline";
import { RAMAYANA_SITA_AFTERMATH_PLAYABLE_SCENES } from "../../data/ramayana-sita-aftermath-playable";
import { RAMAYANA_ORIGINS_BEHIND_WAR_SCENE_OUTLINES } from "../../data/ramayana-origins-behind-war-outline";
import { RAMAYANA_ORIGINS_BEHIND_WAR_PLAYABLE_SCENES } from "../../data/ramayana-origins-behind-war-playable";
import { RAMAYANA_COMPANIONS_DEPART_SCENE_OUTLINES } from "../../data/ramayana-companions-depart-outline";
import { RAMAYANA_COMPANIONS_DEPART_PLAYABLE_SCENES } from "../../data/ramayana-companions-depart-playable";
import { RAMAYANA_SITA_SENT_AWAY_SCENE_OUTLINES } from "../../data/ramayana-sita-sent-away-outline";
import { RAMAYANA_SITA_SENT_AWAY_PLAYABLE_SCENES } from "../../data/ramayana-sita-sent-away-playable";
import { RAMAYANA_KINGDOM_TALES_TWINS_SCENE_OUTLINES } from "../../data/ramayana-kingdom-tales-twins-outline";
import { RAMAYANA_KINGDOM_TALES_TWINS_PLAYABLE_SCENES } from "../../data/ramayana-kingdom-tales-twins-playable";
import { RAMAYANA_LATER_REIGN_SCENE_OUTLINES } from "../../data/ramayana-later-reign-outline";
import { RAMAYANA_LATER_REIGN_PLAYABLE_SCENES } from "../../data/ramayana-later-reign-playable";
import { RAMAYANA_TWINS_SING_SITA_RETURNS_SCENE_OUTLINES } from "../../data/ramayana-twins-sing-sita-returns-outline";
import { RAMAYANA_TWINS_SING_SITA_RETURNS_PLAYABLE_SCENES } from "../../data/ramayana-twins-sing-sita-returns-playable";
import { RAMAYANA_LAST_DEPARTURES_SCENE_OUTLINES } from "../../data/ramayana-last-departures-outline";
import { RAMAYANA_LAST_DEPARTURES_PLAYABLE_SCENES } from "../../data/ramayana-last-departures-playable";
import { RAMAYANA_BEGINNINGS_PLAYABLE_SCENES } from "../../data/ramayana-beginnings-playable";
import { getDuttKandaSpanSha256s } from "../../data/ramayana-dutt-source-spans";
import { RAMAYANA_HEIRS_PLAYABLE_SCENES } from "../../data/ramayana-heirs-playable";
import { RAMAYANA_PRINCES_PLAYABLE_SCENES } from "../../data/ramayana-princes-playable";
import { RAMAYANA_MITHILA_ROAD_PLAYABLE_SCENES } from "../../data/ramayana-mithila-road-playable";
import { RAMAYANA_SITA_BOW_PLAYABLE_SCENES } from "../../data/ramayana-sita-bow-playable";
import { RAMAYANA_WEDDINGS_CHALLENGE_PLAYABLE_SCENES } from "../../data/ramayana-weddings-challenge-playable";
import { RAMAYANA_LAKSHMANA_JOINS_LIBRARY_SCENES } from "../../data/ramayana-lakshmana-joins-library-scenes";
import { RAMAYANA_RAMA_ACCEPTS_EXILE_LIBRARY_SCENES } from "../../data/ramayana-rama-accepts-exile-library-scenes";
import { RAMAYANA_SITA_CHOOSES_ROAD_LIBRARY_SCENES } from "../../data/ramayana-sita-chooses-road-library-scenes";
import { RAMAYANA_CITY_FOLLOWS_LIBRARY_SCENES } from "../../data/ramayana-city-follows-library-scenes";
import { RAMAYANA_CROWN_REFUSED_LIBRARY_SCENES } from "../../data/ramayana-crown-refused-library-scenes";
import { RAMAYANA_BROTHERS_MEET_LIBRARY_SCENES } from "../../data/ramayana-brothers-meet-library-scenes";
import { RAMAYANA_SANDALS_TRUST_LIBRARY_SCENES } from "../../data/ramayana-sandals-trust-library-scenes";
import { RAMAYANA_JATAYU_RESISTANCE_LIBRARY_SCENES } from "../../data/ramayana-jatayu-resistance-library-scenes";
import { RAMAYANA_VISHVAMITRA_VASISHTA_LIBRARY_SCENES } from "../../data/ramayana-vishvamitra-vasishta-library-scenes";
import { RAMAYANA_TRISHANKU_LIBRARY_SCENES } from "../../data/ramayana-trishanku-library-scenes";
import { RAMAYANA_GUHA_FIRST_NIGHT_LIBRARY_SCENES } from "../../data/ramayana-guha-first-night-library-scenes";
import { RAMAYANA_RAMA_SUMMONS_LIBRARY_SCENES } from "../../data/ramayana-rama-summons-library-scenes";
import { RAMAYANA_MANTHARA_TWO_BOONS_LIBRARY_SCENES } from "../../data/ramayana-manthara-two-boons-library-scenes";
import { RAMAYANA_CITY_WITHOUT_KING_LIBRARY_SCENES } from "../../data/ramayana-city-without-king-library-scenes";
import { RAMAYANA_RAMBHA_INDRA_LIBRARY_SCENES } from "../../data/ramayana-rambha-indra-library-scenes";
import { RAMAYANA_GRIEF_SEARCH_LIBRARY_SCENES } from "../../data/ramayana-grief-search-library-scenes";
import { RAMAYANA_EMPTY_COTTAGE_LIBRARY_SCENES } from "../../data/ramayana-empty-cottage-library-scenes";
import { RAMAYANA_LANKA_HOUSEHOLD_LIBRARY_SCENES } from "../../data/ramayana-lanka-household-library-scenes";
import { RAMAYANA_KUBERA_KAILASA_LIBRARY_SCENES } from "../../data/ramayana-kubera-kailasa-library-scenes";
import { RAMAYANA_VEDAVATI_KINGS_LIBRARY_SCENES } from "../../data/ramayana-vedavati-kings-library-scenes";
import { RAMAYANA_YAMA_INVASION_LIBRARY_SCENES } from "../../data/ramayana-yama-invasion-library-scenes";
import { RAMAYANA_COSMIC_CONQUESTS_LIBRARY_SCENES } from "../../data/ramayana-cosmic-conquests-library-scenes";
import { RAMAYANA_CAPTIVES_FAMILY_WAR_LIBRARY_SCENES } from "../../data/ramayana-captives-family-war-library-scenes";
import { RAMAYANA_LANKA_BEFORE_RAVANA_LIBRARY_SCENES } from "../../data/ramayana-lanka-before-ravana-library-scenes";
import { RAMAYANA_FIRST_LANKA_WAR_LIBRARY_SCENES } from "../../data/ramayana-first-lanka-war-library-scenes";
import { RAMAYANA_KAIKASI_BOONS_LIBRARY_SCENES } from "../../data/ramayana-kaikasi-boons-library-scenes";
import { RAMAYANA_KARTAVIRYA_CAPTURE_LIBRARY_SCENES } from "../../data/ramayana-kartavirya-capture-library-scenes";
import { RAMAYANA_PROPHECY_CHOICE_LIBRARY_SCENES } from "../../data/ramayana-prophecy-choice-library-scenes";
import { RAMAYANA_SWETADVIPA_DEPARTURES_LIBRARY_SCENES } from "../../data/ramayana-swetadvipa-departures-library-scenes";
import { RAMAYANA_CHITRAKOOT_APPROACH_LIBRARY_SCENES } from "../../data/ramayana-chitrakoot-approach-library-scenes";
import { RAMAYANA_SAGARA_GANGA_LIBRARY_SCENES } from "../../data/ramayana-sagara-ganga-library-scenes";
import { RAMAYANA_REMAINING_THIN_TURN_LIBRARY_SCENES } from "../../data/ramayana-remaining-thin-turn-library-scenes";
import { RAMAYANA_THIN_TURN_LIBRARY_SCENES } from "../../data/ramayana-thin-turn-library-scenes";
import { buildRamayanaStoryWorldPack, getRamayanaDistrictMoments } from "../../data/ramayana-story-world";
import { buildPlayableStoryDistrictIndex } from "../domain/playable-story-district";
import { buildStoryNarrativeMap } from "../domain/story-narrative-map";
import type { StoryBeat, StoryCompassTurn, StoryMoment } from "../domain/story-world";
import type { ExperienceCitation } from "../domain/experience";

export type RamayanaNarrativeBeatSnapshot = StoryBeat & {
  ordinal: number;
};

export type RamayanaNarrativeSceneSnapshot = {
  id: string;
  detailOrdinal: number;
  readiness: "outlined" | "playable";
  title: { en: string; hi: string };
  synopsis: { en: string; hi: string };
  narrative: { en: string; hi: string };
  source: {
    sourceSha256: string;
    sourceGlobalOrdinal?: number;
    sourceOrdinal: number;
    sourceEndOrdinal: number;
    sourceAddressKind?: "section_span_set";
    spanSha256?: string;
    spanSha256s?: string[];
  };
  nodeIds: string[];
  characters: string[];
  places: string[];
  beats: RamayanaNarrativeBeatSnapshot[];
};

export type RamayanaNarrativeTurnSnapshot = {
  id: string;
  arcId: string;
  backboneOrdinal: number;
  turnOrdinalInArc: number;
  title: { en: string; hi: string };
  synopsis: { en: string; hi: string };
  sourceRange: StoryCompassTurn["sourceRange"];
  characters: string[];
  places: string[];
  threads: string[];
  coverage: "orientation" | "outlined" | "playable";
  scenes: RamayanaNarrativeSceneSnapshot[];
};

export type RamayanaNarrativeSnapshot = {
  contract: "DEVAM_RAMAYANA_CONSUMER_NARRATIVE_SNAPSHOT_V1";
  series: {
    id: "ramayana-dutt-consumer-v1";
    expressionLabel: string;
    sourceBoundary: string;
    totalSourceUnits: number;
  };
  arcs: Array<{
    id: string;
    ordinal: number;
    title: { en: string; hi: string };
    invitation: { en: string; hi: string };
    turnIds: string[];
  }>;
  turns: RamayanaNarrativeTurnSnapshot[];
  counters: {
    arcs: number;
    backboneTurns: number;
    playableTurns: number;
    outlinedTurns: number;
    orientationOnlyTurns: number;
    playableScenes: number;
    draftSceneOutlines: number;
    bilingualBeats: number;
  };
  boundary: string;
};

function sceneNarrative(moment: StoryMoment, language: "en" | "hi") {
  return moment.beats.map((beat) => beat.narration[language].trim()).join(" ");
}

function numericLocatorValue(locator: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = locator[key];
    if (typeof value === "number" && Number.isInteger(value) && value > 0) return value;
  }
  return undefined;
}

function citationKandaRange(citation: ExperienceCitation) {
  const start = numericLocatorValue(citation.locator, [
    "kanda_relative_ordinal_start",
    "kanda_relative_ordinal",
    "source_relative_ordinal_start",
    "source_relative_ordinal",
  ]) ?? citation.sourceOrdinal;
  const end = numericLocatorValue(citation.locator, [
    "kanda_relative_ordinal_end",
    "source_relative_ordinal_end",
  ]) ?? start;
  if (end < start) throw new Error(`Citation range is reversed: ${citation.spanSha256}`);
  return { start, end };
}

/**
 * Compiles the current app-owned Ramayana content into the shape required by
 * the first-class narrative database. It does not read source-vault bytes and
 * does not upgrade orientation copy into a completed consumer story.
 */
export function buildRamayanaNarrativeSnapshot(): RamayanaNarrativeSnapshot {
  const pack = buildRamayanaStoryWorldPack();
  const journey = getHeroJourney("ramayana");
  if (!journey) throw new Error("Ramayana journey is missing.");

  const stopById = new Map(journey.stops.map((stop) => [stop.id, stop]));
  const scenesByTurnId = new Map<string, RamayanaNarrativeSceneSnapshot[]>();
  const narrativeMap = buildStoryNarrativeMap(pack.compass);
  const mapPlaceById = new Map(narrativeMap.places.map((place) => [place.id, place]));
  const playableDistrict = buildPlayableStoryDistrictIndex(pack, journey.stops, narrativeMap);
  const districtPlacesBySceneId = new Map<string, string[]>();
  const libraryReplacementSceneIds = new Set([
    "coronation-dawn",
    "janasthana-falls",
    "sita-tells-her-beginning",
    "jatayu-welcomes-panchavati",
    "ravana-chooses-deception",
    "golden-deer-separates-house",
    "lakshmana-joins",
    "rama-accepts-exile",
    "sita-chooses-road",
    "city-follows-car",
    "crown-refused-road",
    "brothers-meet-death-news",
    "sandals-hold-kingdom",
    "jatayu-rises-sky-road",
    "king-vishvamitra-meets-vasishta",
    "trishanku-suspended-between-worlds",
    "guha-shows-first-night",
    "rama-crosses-celebration",
    "fear-becomes-demands",
    "city-without-king",
    "conquest-crosses-cosmic-worlds",
    "captive-women-and-family-war",
    "two-lineages-reach-lanka",
    "first-lanka-war-ends-in-retreat",
    "kaikasi-sons-and-boons",
    "kartavirya-captures-ravana",
    "prophecy-does-not-erase-choice",
    "sagara-line-brings-ganga-down",
    "chitrakoot-hears-army",
    "rambha-curse-and-indras-capture",
    "grief-searches-everywhere",
    "brothers-return-to-empty-cottage",
    "ravana-takes-lanka-and-builds-a-house",
    "kubera-falls-kailasa-refuses",
    "vedavati-and-kings-name-consequence",
    "ravana-challenges-death",
    "rule-begins-as-daily-work",
    "janaka-and-kings-return-home",
    "gifts-circle-back-to-the-alliance",
    "hanuman-and-friends-say-goodbye",
    "pushpaka-returns-with-permission",
    "sita-asks-for-a-hermitage-visit",
    "rumour-turns-captivity-against-sita",
    "rama-summons-his-brothers-in-grief",
  ]);
  for (const [placeId, links] of Object.entries(playableDistrict.byMapPlaceId)) {
    const place = mapPlaceById.get(placeId);
    if (!place) throw new Error(`Ramayana playable district references an unknown map place: ${placeId}`);
    for (const link of links) {
      const labels = districtPlacesBySceneId.get(link.id) ?? [];
      if (!labels.includes(place.label)) labels.push(place.label);
      districtPlacesBySceneId.set(link.id, labels);
    }
  }

  for (const district of pack.districts) {
    const districtMoments = getRamayanaDistrictMoments(district.id);
    if (!districtMoments) throw new Error(`Ramayana district moments are missing: ${district.id}`);

    for (const sceneId of district.momentIds) {
      if (libraryReplacementSceneIds.has(sceneId)) continue;
      const moment = districtMoments[sceneId];
      const stop = stopById.get(sceneId);
      if (!moment || !stop) throw new Error(`Ramayana playable scene is incomplete: ${sceneId}`);
      const citationRange = citationKandaRange(stop.citation);

      const matchingTurns = district.compassTurnIds
        .map((turnId) => pack.compass.turns[turnId])
        .filter((turn) => turn
          && turn.sourceRange.sourceSha256 === stop.citation.sourceSha256
          && citationRange.start >= turn.sourceRange.startOrdinal
          && citationRange.start <= turn.sourceRange.endOrdinal);
      if (matchingTurns.length !== 1) {
        throw new Error(`Ramayana scene must resolve to exactly one backbone turn: ${sceneId}`);
      }

      const turnId = matchingTurns[0].id;
      const siblings = scenesByTurnId.get(turnId) ?? [];
      siblings.push({
        id: sceneId,
        detailOrdinal: siblings.length + 1,
        readiness: "playable",
        title: {
          en: stop.title,
          hi: moment.beats[0]?.title.hi ?? moment.decisiveChange.hi,
        },
        synopsis: moment.decisiveChange,
        narrative: {
          en: sceneNarrative(moment, "en"),
          hi: sceneNarrative(moment, "hi"),
        },
        source: {
          sourceSha256: stop.citation.sourceSha256,
          sourceGlobalOrdinal: stop.citation.sourceOrdinal,
          sourceOrdinal: citationRange.start,
          sourceEndOrdinal: citationRange.end,
          spanSha256: stop.citation.spanSha256,
        },
        nodeIds: [...pack.sceneNodeIds[sceneId]],
        characters: [...new Set(moment.beats.flatMap((beat) => beat.characterIds))],
        places: [...(districtPlacesBySceneId.get(sceneId) ?? [])],
        beats: moment.beats.map((beat, index) => ({ ...beat, ordinal: index + 1 })),
      });
      scenesByTurnId.set(turnId, siblings);
    }
  }

  for (const scene of [
    ...RAMAYANA_THIN_TURN_LIBRARY_SCENES,
    ...RAMAYANA_REMAINING_THIN_TURN_LIBRARY_SCENES,
    ...RAMAYANA_LAKSHMANA_JOINS_LIBRARY_SCENES,
    ...RAMAYANA_RAMA_ACCEPTS_EXILE_LIBRARY_SCENES,
    ...RAMAYANA_SITA_CHOOSES_ROAD_LIBRARY_SCENES,
    ...RAMAYANA_CITY_FOLLOWS_LIBRARY_SCENES,
    ...RAMAYANA_CROWN_REFUSED_LIBRARY_SCENES,
    ...RAMAYANA_BROTHERS_MEET_LIBRARY_SCENES,
    ...RAMAYANA_SANDALS_TRUST_LIBRARY_SCENES,
    ...RAMAYANA_JATAYU_RESISTANCE_LIBRARY_SCENES,
    ...RAMAYANA_VISHVAMITRA_VASISHTA_LIBRARY_SCENES,
    ...RAMAYANA_TRISHANKU_LIBRARY_SCENES,
    ...RAMAYANA_GUHA_FIRST_NIGHT_LIBRARY_SCENES,
    ...RAMAYANA_RAMA_SUMMONS_LIBRARY_SCENES,
    ...RAMAYANA_MANTHARA_TWO_BOONS_LIBRARY_SCENES,
    ...RAMAYANA_CITY_WITHOUT_KING_LIBRARY_SCENES,
    ...RAMAYANA_COSMIC_CONQUESTS_LIBRARY_SCENES,
    ...RAMAYANA_CAPTIVES_FAMILY_WAR_LIBRARY_SCENES,
    ...RAMAYANA_LANKA_BEFORE_RAVANA_LIBRARY_SCENES,
    ...RAMAYANA_FIRST_LANKA_WAR_LIBRARY_SCENES,
    ...RAMAYANA_KAIKASI_BOONS_LIBRARY_SCENES,
    ...RAMAYANA_KARTAVIRYA_CAPTURE_LIBRARY_SCENES,
    ...RAMAYANA_PROPHECY_CHOICE_LIBRARY_SCENES,
    ...RAMAYANA_SWETADVIPA_DEPARTURES_LIBRARY_SCENES,
    ...RAMAYANA_SAGARA_GANGA_LIBRARY_SCENES,
    ...RAMAYANA_CHITRAKOOT_APPROACH_LIBRARY_SCENES,
    ...RAMAYANA_RAMBHA_INDRA_LIBRARY_SCENES,
    ...RAMAYANA_GRIEF_SEARCH_LIBRARY_SCENES,
    ...RAMAYANA_EMPTY_COTTAGE_LIBRARY_SCENES,
    ...RAMAYANA_LANKA_HOUSEHOLD_LIBRARY_SCENES,
    ...RAMAYANA_KUBERA_KAILASA_LIBRARY_SCENES,
    ...RAMAYANA_VEDAVATI_KINGS_LIBRARY_SCENES,
    ...RAMAYANA_YAMA_INVASION_LIBRARY_SCENES,
  ]) {
    const turn = pack.compass.turns[scene.turnId];
    if (!turn) throw new Error(`Ramayana library scene has no backbone turn: ${scene.id}`);
    if (scene.sourceStart < turn.sourceRange.startOrdinal || scene.sourceEnd > turn.sourceRange.endOrdinal) {
      throw new Error(`Ramayana library scene exceeds its source-bounded turn: ${scene.id}`);
    }
    if (scene.spanSha256s.length !== scene.sourceEnd - scene.sourceStart + 1) {
      throw new Error(`Ramayana library scene has an incomplete source-span set: ${scene.id}`);
    }
    const hasCompleteRegisteredSpans = ["bala", "uttara"].includes(turn.sourceRange.kandaSlug)
      || (turn.sourceRange.kandaSlug === "ayodhya"
        && ((scene.sourceStart >= 26 && scene.sourceEnd <= 30)
          || (scene.sourceStart >= 41 && scene.sourceEnd <= 45)))
      || (turn.sourceRange.kandaSlug === "ayodhya" && scene.sourceStart >= 78 && scene.sourceEnd <= 82)
      || (turn.sourceRange.kandaSlug === "ayodhya" && scene.sourceStart >= 8 && scene.sourceEnd <= 11)
      || (turn.sourceRange.kandaSlug === "ayodhya" && scene.sourceStart >= 15 && scene.sourceEnd <= 18)
      || (turn.sourceRange.kandaSlug === "ayodhya" && scene.sourceStart >= 65 && scene.sourceEnd <= 68)
      || (turn.sourceRange.kandaSlug === "ayodhya" && scene.sourceStart >= 86 && scene.sourceEnd <= 89)
      || (turn.sourceRange.kandaSlug === "ayodhya" && scene.sourceStart >= 99 && scene.sourceEnd <= 103)
      || (turn.sourceRange.kandaSlug === "ayodhya" && scene.sourceStart >= 108 && scene.sourceEnd <= 112)
      || (turn.sourceRange.kandaSlug === "aranya" && scene.sourceStart >= 49 && scene.sourceEnd <= 68);
    if (hasCompleteRegisteredSpans) {
      const expectedSpanSha256s = getDuttKandaSpanSha256s(
        turn.sourceRange.kandaSlug,
        scene.sourceStart,
        scene.sourceEnd,
      );
      if (JSON.stringify(scene.spanSha256s) !== JSON.stringify(expectedSpanSha256s)) {
        throw new Error(`Ramayana library scene source spans drifted from the retained section registry: ${scene.id}`);
      }
    }
    const siblings = scenesByTurnId.get(scene.turnId) ?? [];
    siblings.push({
      id: scene.id,
      detailOrdinal: scene.detailOrdinal,
      readiness: "playable",
      title: scene.title,
      synopsis: scene.synopsis,
      narrative: {
        en: sceneNarrative(scene.moment, "en"),
        hi: sceneNarrative(scene.moment, "hi"),
      },
      source: {
        sourceSha256: turn.sourceRange.sourceSha256,
        sourceGlobalOrdinal: scene.sourceGlobalOrdinal,
        sourceOrdinal: scene.sourceStart,
        sourceEndOrdinal: scene.sourceEnd,
        sourceAddressKind: "section_span_set",
        spanSha256: scene.spanSha256s.length === 1 ? scene.spanSha256s[0] : undefined,
        spanSha256s: scene.spanSha256s,
      },
      nodeIds: scene.nodeIds,
      characters: [...new Set(scene.moment.beats.flatMap((beat) => beat.characterIds))],
      places: scene.places,
      beats: scene.moment.beats.map((beat, index) => ({ ...beat, ordinal: index + 1 })),
    });
    scenesByTurnId.set(scene.turnId, siblings);
  }

  const sourcePartitionedOutlines = [
    ...RAMAYANA_BEGINNINGS_SCENE_OUTLINES,
    ...RAMAYANA_BROKEN_TRAIL_SCENE_OUTLINES,
    ...RAMAYANA_TOWARD_PAMPA_SCENE_OUTLINES,
    ...RAMAYANA_HANUMAN_MEETS_RAMA_SCENE_OUTLINES,
    ...RAMAYANA_TWO_LOSSES_ONE_ALLIANCE_SCENE_OUTLINES,
    ...RAMAYANA_VALI_FALLS_SCENE_OUTLINES,
    ...RAMAYANA_RAINS_AND_DELAY_SCENE_OUTLINES,
    ...RAMAYANA_SEARCH_EVERY_HORIZON_SCENE_OUTLINES,
    ...RAMAYANA_SAMPATI_REVEALS_LANKA_SCENE_OUTLINES,
    ...RAMAYANA_HANUMAN_REMEMBERS_SCENE_OUTLINES,
    ...RAMAYANA_LEAP_ACROSS_OCEAN_SCENE_OUTLINES,
    ...RAMAYANA_SEARCHING_LANKA_SCENE_OUTLINES,
    ...RAMAYANA_SITA_ASHOKA_GROVE_SCENE_OUTLINES,
    ...RAMAYANA_MESSENGER_TOKEN_SCENE_OUTLINES,
    ...RAMAYANA_LANKA_BURNS_SCENE_OUTLINES,
    ...RAMAYANA_RETURN_OVER_OCEAN_SCENE_OUTLINES,
    ...RAMAYANA_NEWS_REACHES_RAMA_SCENE_OUTLINES,
    ...RAMAYANA_OCEAN_BRIDGE_SCENE_OUTLINES,
    ...RAMAYANA_LANKA_SURROUNDED_SCENE_OUTLINES,
    ...RAMAYANA_KUMBHAKARNA_RISES_SCENE_OUTLINES,
    ...RAMAYANA_INDRAJIT_LAST_WAR_SCENE_OUTLINES,
    ...RAMAYANA_RAVANA_FINAL_BATTLE_SCENE_OUTLINES,
    ...RAMAYANA_SITA_AFTERMATH_SCENE_OUTLINES,
    ...RAMAYANA_ORIGINS_BEHIND_WAR_SCENE_OUTLINES,
    ...RAMAYANA_COMPANIONS_DEPART_SCENE_OUTLINES,
    ...RAMAYANA_SITA_SENT_AWAY_SCENE_OUTLINES,
    ...RAMAYANA_KINGDOM_TALES_TWINS_SCENE_OUTLINES,
    ...RAMAYANA_LATER_REIGN_SCENE_OUTLINES,
    ...RAMAYANA_TWINS_SING_SITA_RETURNS_SCENE_OUTLINES,
    ...RAMAYANA_LAST_DEPARTURES_SCENE_OUTLINES,
  ];
  const sourcePartitionedOutlineById = new Map(sourcePartitionedOutlines.map((outline) => [outline.id, outline]));
  for (const playable of [
    ...RAMAYANA_BEGINNINGS_PLAYABLE_SCENES,
    ...RAMAYANA_HEIRS_PLAYABLE_SCENES,
    ...RAMAYANA_PRINCES_PLAYABLE_SCENES,
    ...RAMAYANA_MITHILA_ROAD_PLAYABLE_SCENES,
    ...RAMAYANA_SITA_BOW_PLAYABLE_SCENES,
    ...RAMAYANA_WEDDINGS_CHALLENGE_PLAYABLE_SCENES,
    ...RAMAYANA_BROKEN_TRAIL_PLAYABLE_SCENES,
    ...RAMAYANA_TOWARD_PAMPA_PLAYABLE_SCENES,
    ...RAMAYANA_HANUMAN_MEETS_RAMA_PLAYABLE_SCENES,
    ...RAMAYANA_TWO_LOSSES_ONE_ALLIANCE_PLAYABLE_SCENES,
    ...RAMAYANA_VALI_FALLS_PLAYABLE_SCENES,
    ...RAMAYANA_RAINS_AND_DELAY_PLAYABLE_SCENES,
    ...RAMAYANA_SEARCH_EVERY_HORIZON_PLAYABLE_SCENES,
    ...RAMAYANA_SAMPATI_REVEALS_LANKA_PLAYABLE_SCENES,
    ...RAMAYANA_HANUMAN_REMEMBERS_PLAYABLE_SCENES,
    ...RAMAYANA_LEAP_ACROSS_OCEAN_PLAYABLE_SCENES,
    ...RAMAYANA_SEARCHING_LANKA_PLAYABLE_SCENES,
    ...RAMAYANA_SITA_ASHOKA_GROVE_PLAYABLE_SCENES,
    ...RAMAYANA_MESSENGER_TOKEN_PLAYABLE_SCENES,
    ...RAMAYANA_LANKA_BURNS_PLAYABLE_SCENES,
    ...RAMAYANA_RETURN_OVER_OCEAN_PLAYABLE_SCENES,
    ...RAMAYANA_NEWS_REACHES_RAMA_PLAYABLE_SCENES,
    ...RAMAYANA_OCEAN_BRIDGE_PLAYABLE_SCENES,
    ...RAMAYANA_LANKA_SURROUNDED_PLAYABLE_SCENES,
    ...RAMAYANA_KUMBHAKARNA_RISES_PLAYABLE_SCENES,
    ...RAMAYANA_INDRAJIT_LAST_WAR_PLAYABLE_SCENES,
    ...RAMAYANA_RAVANA_FINAL_BATTLE_PLAYABLE_SCENES,
    ...RAMAYANA_SITA_AFTERMATH_PLAYABLE_SCENES,
    ...RAMAYANA_ORIGINS_BEHIND_WAR_PLAYABLE_SCENES,
    ...RAMAYANA_COMPANIONS_DEPART_PLAYABLE_SCENES,
    ...RAMAYANA_SITA_SENT_AWAY_PLAYABLE_SCENES,
    ...RAMAYANA_KINGDOM_TALES_TWINS_PLAYABLE_SCENES,
    ...RAMAYANA_LATER_REIGN_PLAYABLE_SCENES,
    ...RAMAYANA_TWINS_SING_SITA_RETURNS_PLAYABLE_SCENES,
    ...RAMAYANA_LAST_DEPARTURES_PLAYABLE_SCENES,
  ]) {
    if (libraryReplacementSceneIds.has(playable.id)) continue;
    const outline = sourcePartitionedOutlineById.get(playable.id);
    if (!outline) throw new Error(`Ramayana playable beginning has no source outline: ${playable.id}`);
    const turn = pack.compass.turns[outline.turnId];
    if (!turn) throw new Error(`Ramayana playable beginning has no backbone turn: ${playable.id}`);
    const siblings = scenesByTurnId.get(outline.turnId) ?? [];
    const spanSha256s = getDuttKandaSpanSha256s(turn.sourceRange.kandaSlug, outline.sourceStart, outline.sourceEnd);
    siblings.push({
      id: playable.id,
      detailOrdinal: outline.ordinal,
      readiness: "playable",
      title: outline.title,
      synopsis: playable.moment.decisiveChange,
      narrative: {
        en: sceneNarrative(playable.moment, "en"),
        hi: sceneNarrative(playable.moment, "hi"),
      },
      source: {
        sourceSha256: turn.sourceRange.sourceSha256,
        sourceGlobalOrdinal: outline.sourceStart,
        sourceOrdinal: outline.sourceStart,
        sourceEndOrdinal: outline.sourceEnd,
        sourceAddressKind: "section_span_set",
        spanSha256: spanSha256s.length === 1 ? spanSha256s[0] : undefined,
        spanSha256s,
      },
      nodeIds: playable.nodeIds,
      characters: [...new Set(playable.moment.beats.flatMap((beat) => beat.characterIds))],
      places: outline.places,
      beats: playable.moment.beats.map((beat, index) => ({ ...beat, ordinal: index + 1 })),
    });
    scenesByTurnId.set(outline.turnId, siblings);
  }

  for (const outline of sourcePartitionedOutlines) {
    if (libraryReplacementSceneIds.has(outline.id)) continue;
    const turn = pack.compass.turns[outline.turnId];
    if (!turn) throw new Error(`Ramayana outline has no backbone turn: ${outline.id}`);
    if (outline.sourceStart < turn.sourceRange.startOrdinal || outline.sourceEnd > turn.sourceRange.endOrdinal) {
      throw new Error(`Ramayana outline exceeds its source-bounded turn: ${outline.id}`);
    }
    const siblings = scenesByTurnId.get(outline.turnId) ?? [];
    if (siblings.some((scene) => scene.id === outline.id)) continue;
    siblings.push({
      id: outline.id,
      detailOrdinal: outline.ordinal,
      readiness: "outlined",
      title: outline.title,
      synopsis: outline.synopsis,
      narrative: outline.synopsis,
      source: {
        sourceSha256: turn.sourceRange.sourceSha256,
        sourceOrdinal: outline.sourceStart,
        sourceEndOrdinal: outline.sourceEnd,
      },
      nodeIds: [],
      characters: outline.characters,
      places: outline.places,
      beats: [],
    });
    scenesByTurnId.set(outline.turnId, siblings);
  }

  let backboneOrdinal = 0;
  const turns = pack.compass.arcs.flatMap((arc) => arc.turnIds.map((turnId) => {
    const turn = pack.compass.turns[turnId];
    if (!turn) throw new Error(`Ramayana compass turn is missing: ${turnId}`);
    backboneOrdinal += 1;
    const scenes = [...(scenesByTurnId.get(turnId) ?? [])]
      .sort((left, right) => (
        left.source.sourceOrdinal - right.source.sourceOrdinal
        || left.detailOrdinal - right.detailOrdinal
      ))
      .map((scene, index) => ({ ...scene, detailOrdinal: index + 1 }));
    return {
      id: turn.id,
      arcId: turn.arcId,
      backboneOrdinal,
      turnOrdinalInArc: turn.ordinal,
      title: turn.title,
      synopsis: turn.hook,
      sourceRange: turn.sourceRange,
      characters: [...turn.characters],
      places: [...turn.places],
      threads: [...turn.threads],
      coverage: scenes.some((scene) => scene.readiness === "playable")
        ? "playable" as const
        : scenes.length > 0
          ? "outlined" as const
          : "orientation" as const,
      scenes,
    };
  }));

  const outlinedTurns = turns.filter((turn) => turn.coverage === "outlined").length;
  const orientationOnlyTurns = turns.filter((turn) => turn.coverage === "orientation").length;
  const playableScenes = turns.reduce(
    (count, turn) => count + turn.scenes.filter((scene) => scene.readiness === "playable").length,
    0,
  );
  const draftSceneOutlines = turns.reduce(
    (count, turn) => count + turn.scenes.filter((scene) => scene.readiness === "outlined").length,
    0,
  );
  const bilingualBeats = turns.reduce(
    (count, turn) => count + turn.scenes.reduce((sceneCount, scene) => sceneCount + scene.beats.length, 0),
    0,
  );

  return {
    contract: "DEVAM_RAMAYANA_CONSUMER_NARRATIVE_SNAPSHOT_V1",
    series: {
      id: "ramayana-dutt-consumer-v1",
      expressionLabel: pack.compass.expressionLabel,
      sourceBoundary: pack.compass.sourceBoundary,
      totalSourceUnits: pack.compass.totalSourceUnits,
    },
    arcs: pack.compass.arcs.map((arc) => ({ ...arc })),
    turns,
    counters: {
      arcs: pack.compass.arcs.length,
      backboneTurns: turns.length,
      playableTurns: turns.filter((turn) => turn.coverage === "playable").length,
      outlinedTurns,
      orientationOnlyTurns,
      playableScenes,
      draftSceneOutlines,
      bilingualBeats,
    },
    boundary: "All 49 turns map the selected 652-section expression. Draft scene outlines are editorial denominators, not playable story copy; only published scenes with detailed bilingual beats are playable. This snapshot does not claim a complete consumer Ramayana until every turn reaches the required narrative depth.",
  };
}

import { getHeroJourney } from "../../data/hero-experiences";
import { buildRamayanaStoryWorldPack, getRamayanaDistrictMoments } from "../../data/ramayana-story-world";
import type { StoryBeat, StoryCompassTurn, StoryMoment } from "../domain/story-world";
import type { ExperienceCitation } from "../domain/experience";

export type RamayanaNarrativeBeatSnapshot = StoryBeat & {
  ordinal: number;
};

export type RamayanaNarrativeSceneSnapshot = {
  id: string;
  detailOrdinal: number;
  title: { en: string; hi: string };
  synopsis: { en: string; hi: string };
  narrative: { en: string; hi: string };
  source: {
    sourceSha256: string;
    sourceGlobalOrdinal: number;
    sourceOrdinal: number;
    sourceEndOrdinal: number;
    spanSha256: string;
  };
  nodeIds: string[];
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
  coverage: "orientation" | "playable";
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
    orientationOnlyTurns: number;
    playableScenes: number;
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

  for (const district of pack.districts) {
    const districtMoments = getRamayanaDistrictMoments(district.id);
    if (!districtMoments) throw new Error(`Ramayana district moments are missing: ${district.id}`);

    for (const sceneId of district.momentIds) {
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
        beats: moment.beats.map((beat, index) => ({ ...beat, ordinal: index + 1 })),
      });
      scenesByTurnId.set(turnId, siblings);
    }
  }

  let backboneOrdinal = 0;
  const turns = pack.compass.arcs.flatMap((arc) => arc.turnIds.map((turnId) => {
    const turn = pack.compass.turns[turnId];
    if (!turn) throw new Error(`Ramayana compass turn is missing: ${turnId}`);
    backboneOrdinal += 1;
    const scenes = scenesByTurnId.get(turnId) ?? [];
    return {
      id: turn.id,
      arcId: turn.arcId,
      backboneOrdinal,
      turnOrdinalInArc: turn.ordinal,
      title: turn.title,
      synopsis: turn.hook,
      sourceRange: turn.sourceRange,
      coverage: scenes.length > 0 ? "playable" as const : "orientation" as const,
      scenes,
    };
  }));

  const playableTurns = turns.filter((turn) => turn.scenes.length > 0).length;
  const playableScenes = turns.reduce((count, turn) => count + turn.scenes.length, 0);
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
      playableTurns,
      orientationOnlyTurns: turns.length - playableTurns,
      playableScenes,
      bilingualBeats,
    },
    boundary: "All 49 turns map the selected 652-section expression, but only turns with detailed scenes and beats are playable. This snapshot does not claim a complete consumer Ramayana until every turn reaches the required narrative depth.",
  };
}

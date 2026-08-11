import { getHeroJourney } from "../../data/hero-experiences";
import { RAMAYANA_BEGINNINGS_SCENE_OUTLINES } from "../../data/ramayana-beginnings-outline";
import { RAMAYANA_BROKEN_TRAIL_SCENE_OUTLINES } from "../../data/ramayana-broken-trail-outline";
import { RAMAYANA_BROKEN_TRAIL_PLAYABLE_SCENES } from "../../data/ramayana-broken-trail-playable";
import { RAMAYANA_TOWARD_PAMPA_SCENE_OUTLINES } from "../../data/ramayana-toward-pampa-outline";
import { RAMAYANA_TOWARD_PAMPA_PLAYABLE_SCENES } from "../../data/ramayana-toward-pampa-playable";
import { RAMAYANA_HANUMAN_MEETS_RAMA_SCENE_OUTLINES } from "../../data/ramayana-hanuman-meets-rama-outline";
import { RAMAYANA_HANUMAN_MEETS_RAMA_PLAYABLE_SCENES } from "../../data/ramayana-hanuman-meets-rama-playable";
import { RAMAYANA_BEGINNINGS_PLAYABLE_SCENES } from "../../data/ramayana-beginnings-playable";
import { getDuttKandaSpanSha256s } from "../../data/ramayana-dutt-source-spans";
import { RAMAYANA_HEIRS_PLAYABLE_SCENES } from "../../data/ramayana-heirs-playable";
import { RAMAYANA_PRINCES_PLAYABLE_SCENES } from "../../data/ramayana-princes-playable";
import { RAMAYANA_MITHILA_ROAD_PLAYABLE_SCENES } from "../../data/ramayana-mithila-road-playable";
import { RAMAYANA_SITA_BOW_PLAYABLE_SCENES } from "../../data/ramayana-sita-bow-playable";
import { RAMAYANA_WEDDINGS_CHALLENGE_PLAYABLE_SCENES } from "../../data/ramayana-weddings-challenge-playable";
import { buildRamayanaStoryWorldPack, getRamayanaDistrictMoments } from "../../data/ramayana-story-world";
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
        places: [],
        beats: moment.beats.map((beat, index) => ({ ...beat, ordinal: index + 1 })),
      });
      scenesByTurnId.set(turnId, siblings);
    }
  }

  const sourcePartitionedOutlines = [
    ...RAMAYANA_BEGINNINGS_SCENE_OUTLINES,
    ...RAMAYANA_BROKEN_TRAIL_SCENE_OUTLINES,
    ...RAMAYANA_TOWARD_PAMPA_SCENE_OUTLINES,
    ...RAMAYANA_HANUMAN_MEETS_RAMA_SCENE_OUTLINES,
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
  ]) {
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
    const scenes = scenesByTurnId.get(turnId) ?? [];
    return {
      id: turn.id,
      arcId: turn.arcId,
      backboneOrdinal,
      turnOrdinalInArc: turn.ordinal,
      title: turn.title,
      synopsis: turn.hook,
      sourceRange: turn.sourceRange,
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

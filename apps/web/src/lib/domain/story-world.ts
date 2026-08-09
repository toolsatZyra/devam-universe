import type { WorldNodeFamily, WorldRelationKind } from "./atlas";

export type StoryWorldNode = {
  id: string;
  label: string;
  kind: string;
  family: WorldNodeFamily;
  summary: string;
  searchQuery: string;
  evidenceBoundary: string;
  gateway: boolean;
};

export type StoryWorldRoute = {
  id: string;
  relation: string;
  relationKind: WorldRelationKind;
  sourceRef?: string;
  destinationId: string;
};

export type StoryBeat = {
  id: string;
  title: { en: string; hi: string };
  narration: { en: string; hi: string };
  visualCue: string;
  characterIds: string[];
};

export type StoryMoment = {
  id: string;
  decisiveChange: { en: string; hi: string };
  beats: StoryBeat[];
};

export type StoryCompassRange = {
  kandaSlug: string;
  startOrdinal: number;
  endOrdinal: number;
  sourceSha256: string;
};

export type StoryCompassTurn = {
  id: string;
  arcId: string;
  ordinal: number;
  title: { en: string; hi: string };
  hook: { en: string; hi: string };
  place: string;
  places: string[];
  characters: string[];
  threads: string[];
  coverage: "orientation" | "playable";
  playableMomentId?: string;
  sourceRange: StoryCompassRange;
};

export type StoryCompassPathKind = "place" | "character" | "thread";

export type StoryCompassPath = {
  id: string;
  kind: StoryCompassPathKind;
  label: string;
  turnIds: string[];
};

export type StoryCompassIndexes = Record<StoryCompassPathKind, Record<string, StoryCompassPath>>;

export type StoryCompassArc = {
  id: string;
  ordinal: number;
  title: { en: string; hi: string };
  invitation: { en: string; hi: string };
  turnIds: string[];
};

export type StoryCompass = {
  expressionLabel: string;
  sourceBoundary: string;
  totalSourceUnits: number;
  arcs: StoryCompassArc[];
  turns: Record<string, StoryCompassTurn>;
};

/**
 * A small, serializable slice of the knowledge universe compiled for one
 * playable story world. The browser must never need the global Atlas dataset
 * to render a journey.
 */
export type StoryWorldPack = {
  id: string;
  compass: StoryCompass;
  sceneNodeIds: Record<string, string[]>;
  nodeMomentIds: Record<string, string[]>;
  castNodeIds: Record<string, string>;
  moments: Record<string, StoryMoment>;
  nodes: Record<string, StoryWorldNode>;
  routes: Record<string, StoryWorldRoute[]>;
};

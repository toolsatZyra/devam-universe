import type { WorldNodeFamily, WorldRelationKind } from "./atlas";

export type StoryWorldNode = {
  id: string;
  label: string;
  kind: string;
  family: WorldNodeFamily;
  summary: string;
  searchQuery: string;
  evidenceBoundary: string;
  gateway?: true;
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

export type StoryLivingPracticeLane = {
  id: string;
  nodeId: string;
  crop: "left" | "centre" | "right";
  region: string;
  title: string;
  summary: string;
  significance: string;
  originStory: string;
  typicalPractices: string[];
  minimumForm: {
    label: string;
    estimatedMinutes: number;
    materials: string[];
    steps: string[];
  };
  familyPracticeNote: string;
  evidence: {
    packId: string;
    packFileSha256: string;
    sourceCount: number;
  };
};

export type StoryLivingPortal = {
  id: string;
  nodeId: string;
  languageCode: "en" | "hi";
  title: string;
  invitation: string;
  storyConnection: string;
  evidenceBoundary: string;
  asset: string;
  lanes: StoryLivingPracticeLane[];
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

export type StoryMapPlace = {
  id: string;
  label: string;
  turnIds: string[];
  arcIds: string[];
  firstStoryOrdinal: number;
  x: number;
  y: number;
  depth: number;
  tier: "nexus" | "landmark" | "waypoint";
};

export type StoryMapRoute = {
  id: string;
  fromPlaceId: string;
  toPlaceId: string;
  turnIds: string[];
};

export type StoryNarrativeMap = {
  places: StoryMapPlace[];
  routes: StoryMapRoute[];
  totalStoryTurns: number;
  boundary: string;
};

export type PlayableStorySceneLink = {
  id: string;
  ordinal: number;
  title: string;
  decisiveChange: { en: string; hi: string };
  asset?: string;
  placeNodeId: string;
  relation: string;
};

export type PlayableStoryDistrictIndex = {
  byMapPlaceId: Record<string, PlayableStorySceneLink[]>;
  placeCount: number;
  sceneCount: number;
};

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
  livingPortalNodeIds: string[];
  nodes: Record<string, StoryWorldNode>;
  routes: Record<string, StoryWorldRoute[]>;
};

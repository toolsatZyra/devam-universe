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

/**
 * A small, serializable slice of the knowledge universe compiled for one
 * playable story world. The browser must never need the global Atlas dataset
 * to render a journey.
 */
export type StoryWorldPack = {
  id: string;
  sceneNodeIds: Record<string, string[]>;
  nodeMomentIds: Record<string, string[]>;
  castNodeIds: Record<string, string>;
  moments: Record<string, StoryMoment>;
  nodes: Record<string, StoryWorldNode>;
  routes: Record<string, StoryWorldRoute[]>;
};

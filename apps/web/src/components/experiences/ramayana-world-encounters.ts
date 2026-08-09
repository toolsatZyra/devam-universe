import { gateways, worldEdges, worldNodes } from "../../data/atlas";
import type { WorldNode, WorldNodeFamily, WorldRelationKind } from "../../lib/domain/atlas";

export type JourneyEncounterNode = Pick<WorldNode, "id" | "label" | "kind" | "family" | "summary" | "searchQuery" | "evidenceBoundary"> & {
  gateway: boolean;
};

export type JourneyEncounterRoute = {
  id: string;
  relation: string;
  relationKind: WorldRelationKind;
  evidenceBoundary: string;
  sourceRef?: string;
  destination: JourneyEncounterNode;
};

export const RAMAYANA_SCENE_WORLD_NODE_IDS: Record<string, readonly string[]> = {
  "leave-lanka": ["pushpaka-departure-lanka", "lanka-story-world", "vibhishana", "rama", "sita"],
  "sky-road": ["remembered-homeward-route", "rama", "sita", "kishkindha-story-world", "bridge-to-lanka"],
  "bharadvaja-hermitage": ["bharadvaja-homecoming-counsel", "bharadvaja", "bharadvaja-hermitage-story-world", "rama", "ayodhya"],
  "hanuman-goes-ahead": ["hanuman-carries-homecoming-message", "hanuman", "guha", "bharata", "nandigrama-story-world"],
  "bharata-hears": ["bharata-hears-return", "bharata", "hanuman", "shatrughna", "nandigrama-story-world"],
  "ayodhya-prepares": ["ayodhya-prepares-homecoming", "ayodhya", "bharata", "shatrughna"],
  "kingdom-returned": ["rama-coronation-return", "rama", "sita", "bharata", "vasishta", "ayodhya", "diwali"],
};

export const RAMAYANA_CAST_NODE_IDS: Record<string, string> = {
  Rama: "rama",
  Sita: "sita",
  Lakshmana: "lakshmana",
  Hanuman: "hanuman",
  Sugriva: "sugriva",
  Vibhishana: "vibhishana",
  Bharadvaja: "bharadvaja",
  Guha: "guha",
  Bharata: "bharata",
  Shatrughna: "shatrughna",
  Vasishta: "vasishta",
};

const gatewayFamily: WorldNodeFamily = "event_story";

export function getJourneyEncounterNode(id: string): JourneyEncounterNode | null {
  const node = worldNodes.find((candidate) => candidate.id === id);
  if (node) return { ...node, gateway: false };
  const gateway = gateways.find((candidate) => candidate.id === id);
  if (!gateway) return null;
  return {
    id: gateway.id,
    label: gateway.title,
    kind: "Master world",
    family: gatewayFamily,
    summary: gateway.invitation,
    searchQuery: gateway.title,
    evidenceBoundary: "This is a master exploration doorway. Every story, place, practice, source, and cross-world route inside it retains its own evidence and scope boundary.",
    gateway: true,
  };
}

export function getRamayanaSceneEncounterNodes(sceneId: string): JourneyEncounterNode[] {
  return (RAMAYANA_SCENE_WORLD_NODE_IDS[sceneId] ?? [])
    .map(getJourneyEncounterNode)
    .filter((node): node is JourneyEncounterNode => node !== null);
}

export function getJourneyEncounterRoutes(nodeId: string, limit = 6): JourneyEncounterRoute[] {
  const seen = new Set<string>();
  const routes: JourneyEncounterRoute[] = [];
  for (const edge of worldEdges) {
    if (edge.from !== nodeId && edge.to !== nodeId) continue;
    const destinationId = edge.from === nodeId ? edge.to : edge.from;
    if (seen.has(destinationId)) continue;
    const destination = getJourneyEncounterNode(destinationId);
    if (!destination) continue;
    seen.add(destinationId);
    routes.push({
      id: edge.id,
      relation: edge.relation,
      relationKind: edge.relationKind,
      evidenceBoundary: edge.evidenceBoundary ?? destination.evidenceBoundary,
      sourceRef: edge.sourceRef,
      destination,
    });
    if (routes.length >= limit) break;
  }
  return routes;
}

export function journeyEncounterHref(node: JourneyEncounterNode) {
  return node.gateway ? `/journeys/${node.id}` : `/search?q=${encodeURIComponent(node.searchQuery)}`;
}

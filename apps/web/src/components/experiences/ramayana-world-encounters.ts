import type { StoryWorldNode, StoryWorldPack } from "@/lib/domain/story-world";

export type JourneyEncounterRoute = StoryWorldPack["routes"][string][number] & { destination: StoryWorldNode };

export function getJourneyEncounterNode(pack: StoryWorldPack, id: string): StoryWorldNode | null {
  return pack.nodes[id] ?? null;
}

export function getStorySceneEncounterNodes(pack: StoryWorldPack, sceneId: string): StoryWorldNode[] {
  return (pack.sceneNodeIds[sceneId] ?? [])
    .map((id) => getJourneyEncounterNode(pack, id))
    .filter((node): node is StoryWorldNode => node !== null);
}

export function getJourneyEncounterRoutes(pack: StoryWorldPack, nodeId: string, limit = 6): JourneyEncounterRoute[] {
  return (pack.routes[nodeId] ?? []).slice(0, limit).flatMap((route) => {
    const destination = getJourneyEncounterNode(pack, route.destinationId);
    return destination ? [{ ...route, destination }] : [];
  });
}

export function journeyEncounterHref(node: StoryWorldNode) {
  return node.gateway ? `/journeys/${node.id}` : `/search?q=${encodeURIComponent(node.searchQuery)}`;
}

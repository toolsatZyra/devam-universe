import type { JourneyStop } from "./experience";
import type {
  PlayableStoryDistrictIndex,
  PlayableStorySceneLink,
  StoryNarrativeMap,
  StoryWorldPack,
} from "./story-world";

function canonicalLabel(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").trim().toLocaleLowerCase("en");
}

/**
 * Projects the detailed playable scenes into the canonical narrative map from
 * the story world's existing event-to-place relationships. This deliberately
 * retains each relationship label: a scene that asks about a place must not be
 * presented as though it physically occurs there.
 */
export function buildPlayableStoryDistrictIndex(
  pack: StoryWorldPack,
  stops: readonly JourneyStop[],
  map: StoryNarrativeMap,
): PlayableStoryDistrictIndex {
  const mapPlaceByLabel = new Map(map.places.map((place) => [canonicalLabel(place.label), place]));
  const byMapPlaceId: Record<string, PlayableStorySceneLink[]> = {};
  const seenStopIds = new Set<string>();
  const linkedSceneIds = new Set<string>();

  for (const stop of stops) {
    if (seenStopIds.has(stop.id)) throw new Error(`Duplicate playable story scene: ${stop.id}`);
    seenStopIds.add(stop.id);

    const moment = pack.moments[stop.id];
    if (!moment) throw new Error(`Playable story scene is missing its detailed moment: ${stop.id}`);
    const sceneNodeIds = pack.sceneNodeIds[stop.id];
    if (!sceneNodeIds?.length) throw new Error(`Playable story scene is missing its world nodes: ${stop.id}`);
    const sceneNodeIdSet = new Set(sceneNodeIds);
    const seenPlaceNodeIds = new Set<string>();

    for (const nodeId of sceneNodeIds) {
      const eventNode = pack.nodes[nodeId];
      if (eventNode?.family !== "event_story") continue;

      for (const route of pack.routes[eventNode.id] ?? []) {
        if (route.relationKind !== "place" || !sceneNodeIdSet.has(route.destinationId)) continue;
        const placeNode = pack.nodes[route.destinationId];
        if (placeNode?.family !== "place_polity" || seenPlaceNodeIds.has(placeNode.id)) continue;
        const mapPlace = mapPlaceByLabel.get(canonicalLabel(placeNode.label));
        if (!mapPlace) throw new Error(`Playable place is absent from the narrative map: ${placeNode.label}`);

        seenPlaceNodeIds.add(placeNode.id);
        linkedSceneIds.add(stop.id);
        const link: PlayableStorySceneLink = {
          id: stop.id,
          ordinal: stop.ordinal,
          title: stop.title,
          decisiveChange: moment.decisiveChange,
          asset: stop.visual?.asset,
          placeNodeId: placeNode.id,
          relation: route.relation,
        };
        (byMapPlaceId[mapPlace.id] ??= []).push(link);
      }
    }

    if (seenPlaceNodeIds.size === 0) throw new Error(`Playable story scene has no mapped place relationship: ${stop.id}`);
  }

  for (const links of Object.values(byMapPlaceId)) links.sort((left, right) => left.ordinal - right.ordinal);

  return {
    byMapPlaceId,
    placeCount: Object.keys(byMapPlaceId).length,
    sceneCount: linkedSceneIds.size,
  };
}

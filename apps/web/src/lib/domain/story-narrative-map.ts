import type {
  StoryCompass,
  StoryMapPlace,
  StoryMapRoute,
  StoryNarrativeMap,
} from "./story-world";
import { buildStoryCompassIndexes } from "./story-compass-index";

const ARC_LANES = [24, 31, 54, 68, 61, 48, 25];
const COLLISION_OFFSETS = [
  [0, 0], [0, 12], [0, -12], [6, 7], [-6, 7], [6, -7], [-6, -7],
  [10, 0], [-10, 0], [10, 13], [-10, 13], [10, -13], [-10, -13],
] as const;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function labelHash(label: string) {
  let hash = 0;
  for (const character of label) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return hash;
}

function openMapPosition(naturalX: number, naturalY: number, occupied: Array<{ x: number; y: number }>) {
  const nearby = COLLISION_OFFSETS.map(([offsetX, offsetY]) => ({
    x: clamp(naturalX + offsetX, 5, 95),
    y: clamp(naturalY + offsetY, 13, 79),
  }));
  const grid: Array<{ x: number; y: number }> = [];
  for (let x = 5; x <= 95; x += 8.5) {
    for (let y = 13; y <= 79; y += 10.5) grid.push({ x, y });
  }
  grid.sort((left, right) =>
    ((left.x - naturalX) ** 2 + (left.y - naturalY) ** 2)
    - ((right.x - naturalX) ** 2 + (right.y - naturalY) ** 2));
  return [...nearby, ...grid].find((candidate) =>
    occupied.every((placed) => Math.abs(candidate.x - placed.x) >= 8 || Math.abs(candidate.y - placed.y) >= 10));
}

/**
 * Compiles a schematic story geography from the same canonical compass used by
 * sequential, character, and thread traversal. Coordinates express narrative
 * progression and visual separation only; they are deliberately not GIS.
 */
export function buildStoryNarrativeMap(compass: StoryCompass): StoryNarrativeMap {
  const allTurnIds = compass.arcs.flatMap((arc) => arc.turnIds);
  const storyOrdinal = new Map(allTurnIds.map((turnId, index) => [turnId, index + 1]));
  const indexes = buildStoryCompassIndexes(compass);
  const placePaths = Object.values(indexes.place);
  const placeIdByLabel = new Map(placePaths.map((path) => [path.label.toLocaleLowerCase("en"), path.id]));

  const occupied: Array<{ x: number; y: number }> = [];
  const places: StoryMapPlace[] = placePaths.map((path) => {
    const firstTurn = compass.turns[path.turnIds[0]];
    const firstOrdinal = storyOrdinal.get(firstTurn.id)!;
    const arcIndex = compass.arcs.findIndex((arc) => arc.id === firstTurn.arcId);
    const withinTurn = firstTurn.places.findIndex((place) => place.toLocaleLowerCase("en") === path.label.toLocaleLowerCase("en"));
    const hash = labelHash(path.label);
    const naturalX = clamp(6 + ((firstOrdinal - 1) / Math.max(1, allTurnIds.length - 1)) * 88 + withinTurn * 2.2 + ((hash % 5) - 2) * .55, 5, 95);
    const naturalY = clamp(ARC_LANES[arcIndex] + ((hash % 17) - 8) * .72, 13, 79);
    const position = openMapPosition(naturalX, naturalY, occupied);
    if (!position) throw new Error(`No narrative-map position remains for ${path.label}`);
    occupied.push(position);
    const arcIds = [...new Set(path.turnIds.map((turnId) => compass.turns[turnId].arcId))];
    return {
      id: path.id,
      label: path.label,
      turnIds: path.turnIds,
      arcIds,
      firstStoryOrdinal: firstOrdinal,
      x: position.x,
      y: position.y,
      depth: 8 + (hash % 4) * 12,
      tier: path.turnIds.length >= 4 ? "nexus" : path.turnIds.length >= 2 ? "landmark" : "waypoint",
    };
  });

  const routes = new Map<string, StoryMapRoute>();
  let previousPlaceId: string | undefined;
  for (const turnId of allTurnIds) {
    const turn = compass.turns[turnId];
    const turnPlaceIds = [...new Set(turn.places.map((label) => placeIdByLabel.get(label.toLocaleLowerCase("en"))))]
      .filter((placeId): placeId is string => Boolean(placeId));
    for (const placeId of turnPlaceIds) {
      if (previousPlaceId && previousPlaceId !== placeId) {
        const id = `route:${previousPlaceId}->${placeId}`;
        const existing = routes.get(id);
        if (existing) {
          if (!existing.turnIds.includes(turnId)) existing.turnIds.push(turnId);
        } else {
          routes.set(id, { id, fromPlaceId: previousPlaceId, toPlaceId: placeId, turnIds: [turnId] });
        }
      }
      previousPlaceId = placeId;
    }
  }

  return {
    places,
    routes: [...routes.values()],
    totalStoryTurns: allTurnIds.length,
    boundary: "A schematic narrative map of this selected telling. Position and distance show story progression, not modern coordinates, archaeology, travel routes, or historical GIS.",
  };
}

export function storyMapPlaceForTurn(map: StoryNarrativeMap, compass: StoryCompass, turnId: string) {
  const primaryPlace = compass.turns[turnId]?.places[0];
  if (!primaryPlace) return undefined;
  return map.places.find((place) => place.label.toLocaleLowerCase("en") === primaryPlace.toLocaleLowerCase("en"));
}

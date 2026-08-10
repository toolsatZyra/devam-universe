import { describe, expect, it } from "vitest";
import { buildRamayanaCompass } from "../../data/ramayana-compass";
import { buildStoryNarrativeMap } from "./story-narrative-map";

describe("story-first narrative map compiler", () => {
  const compass = buildRamayanaCompass();
  const map = buildStoryNarrativeMap(compass);
  const allTurnIds = compass.arcs.flatMap((arc) => arc.turnIds);

  it("maps every canonical place and every story turn from one source of truth", () => {
    const expectedPlaces = new Set(Object.values(compass.turns).flatMap((turn) => turn.places));
    expect(map.places).toHaveLength(46);
    expect(new Set(map.places.map((place) => place.label))).toEqual(expectedPlaces);
    expect(new Set(map.places.flatMap((place) => place.turnIds))).toEqual(new Set(allTurnIds));
    expect(map.totalStoryTurns).toBe(49);
  });

  it("keeps repeated places as temporal nexuses rather than duplicate pins", () => {
    const ayodhya = map.places.find((place) => place.label === "Ayodhya");
    expect(ayodhya).toMatchObject({ tier: "nexus", firstStoryOrdinal: 2 });
    expect(ayodhya!.turnIds).toEqual(expect.arrayContaining(["ayodhya-awaits-heirs", "coronation-dawn", "road-home", "last-departures"]));
    expect(new Set(ayodhya!.arcIds).size).toBeGreaterThanOrEqual(4);
  });

  it("emits bounded schematic positions and only routes between known places", () => {
    const placeIds = new Set(map.places.map((place) => place.id));
    for (const place of map.places) {
      expect(place.x, place.id).toBeGreaterThanOrEqual(5);
      expect(place.x, place.id).toBeLessThanOrEqual(95);
      expect(place.y, place.id).toBeGreaterThanOrEqual(13);
      expect(place.y, place.id).toBeLessThanOrEqual(79);
    }
    for (let left = 0; left < map.places.length; left += 1) {
      for (let right = left + 1; right < map.places.length; right += 1) {
        const a = map.places[left];
        const b = map.places[right];
        expect(Math.abs(a.x - b.x) >= 8 || Math.abs(a.y - b.y) >= 10, `${a.id} overlaps ${b.id}`).toBe(true);
      }
    }
    for (const route of map.routes) {
      expect(placeIds.has(route.fromPlaceId), route.id).toBe(true);
      expect(placeIds.has(route.toPlaceId), route.id).toBe(true);
      expect(route.turnIds.every((turnId) => compass.turns[turnId]), route.id).toBe(true);
    }
    expect(map.boundary).toContain("not modern coordinates");
    expect(map.boundary).toContain("historical GIS");
  });
});

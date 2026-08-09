import { describe, expect, it } from "vitest";
import { buildRamayanaCompass } from "../../data/ramayana-compass";
import { buildStoryCompassIndexes, getStoryCompassPath } from "./story-compass-index";

describe("story compass derived traversal indexes", () => {
  const compass = buildRamayanaCompass();
  const indexes = buildStoryCompassIndexes(compass);
  const storyOrder = compass.arcs.flatMap((arc) => arc.turnIds);
  const ordinalByTurn = new Map(storyOrder.map((turnId, ordinal) => [turnId, ordinal]));

  it("derives every path from known turns, without duplicates or order drift", () => {
    for (const paths of Object.values(indexes)) {
      for (const path of Object.values(paths)) {
        expect(path.turnIds.length, path.id).toBeGreaterThan(0);
        expect(new Set(path.turnIds).size, path.id).toBe(path.turnIds.length);
        expect(path.turnIds.every((turnId) => compass.turns[turnId]), path.id).toBe(true);
        expect(path.turnIds.map((turnId) => ordinalByTurn.get(turnId)), path.id).toEqual(
          [...path.turnIds]
            .sort((left, right) => ordinalByTurn.get(left)! - ordinalByTurn.get(right)!)
            .map((turnId) => ordinalByTurn.get(turnId)),
        );
      }
    }
  });

  it("lets a visitor follow Rama across multiple story worlds", () => {
    const path = getStoryCompassPath(indexes, "character", "Rama");
    expect(path).toBeDefined();
    expect(path!.turnIds.length).toBeGreaterThan(20);
    expect(new Set(path!.turnIds.map((turnId) => compass.turns[turnId].arcId)).size).toBeGreaterThanOrEqual(6);
    expect(path!.turnIds).toEqual(expect.arrayContaining(["princes-enter-world", "exile-accepted", "ravanas-final-battle", "last-departures"]));
  });

  it("lets a visitor cross time through Ayodhya and follow the search thread", () => {
    expect(getStoryCompassPath(indexes, "place", "Ayodhya")?.turnIds).toEqual(
      expect.arrayContaining(["coronation-dawn", "exile-accepted", "road-home", "last-departures"]),
    );
    expect(getStoryCompassPath(indexes, "thread", "search")?.turnIds).toEqual([
      "broken-trail",
      "search-every-horizon",
      "searching-lanka",
    ]);
  });
});

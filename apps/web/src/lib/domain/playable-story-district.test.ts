import { describe, expect, it } from "vitest";
import { getHeroJourney } from "../../data/hero-experiences";
import { buildRamayanaStoryWorldPack } from "../../data/ramayana-story-world";
import { buildPlayableStoryDistrictIndex } from "./playable-story-district";
import { buildStoryNarrativeMap } from "./story-narrative-map";

describe("playable story district compiler", () => {
  const pack = buildRamayanaStoryWorldPack();
  const journey = getHeroJourney("ramayana")!;
  const map = buildStoryNarrativeMap(pack.compass);
  const district = buildPlayableStoryDistrictIndex(pack, journey.stops, map);
  const linksFor = (label: string) => district.byMapPlaceId[map.places.find((place) => place.label === label)!.id];

  it("projects every detailed road-home scene from existing graph relationships", () => {
    expect(district).toMatchObject({ sceneCount: 7, placeCount: 5 });
    expect(linksFor("Lanka").map((link) => link.id)).toEqual(["leave-lanka"]);
    expect(linksFor("Kishkindha").map((link) => link.id)).toEqual(["sky-road"]);
    expect(linksFor("Bharadvaja's hermitage").map((link) => link.id)).toEqual(["bharadvaja-hermitage"]);
    expect(linksFor("Nandigrama").map((link) => link.id)).toEqual(["hanuman-goes-ahead", "bharata-hears"]);
    expect(linksFor("Ayodhya").map((link) => link.id)).toEqual(["bharadvaja-hermitage", "ayodhya-prepares", "kingdom-returned"]);
  });

  it("retains relationship meaning instead of inventing geographic settings", () => {
    expect(linksFor("Bharadvaja's hermitage")[0]).toMatchObject({ relation: "takes place at", placeNodeId: "bharadvaja-hermitage-story-world" });
    expect(linksFor("Ayodhya")[0]).toMatchObject({ id: "bharadvaja-hermitage", relation: "asks for news of" });
    expect(linksFor("Nandigrama").map((link) => link.relation)).toEqual(["arrives in", "unfolds at"]);
  });

  it("fails closed when playable content loses its detailed moment or mapped place", () => {
    expect(() => buildPlayableStoryDistrictIndex({ ...pack, moments: {} }, journey.stops, map)).toThrow("missing its detailed moment");
    const mapWithoutLanka = { ...map, places: map.places.filter((place) => place.label !== "Lanka") };
    expect(() => buildPlayableStoryDistrictIndex(pack, journey.stops, mapWithoutLanka)).toThrow("absent from the narrative map: Lanka");
  });
});

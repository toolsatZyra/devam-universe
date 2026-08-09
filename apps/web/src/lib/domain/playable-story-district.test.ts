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

  it("projects both detailed districts from existing graph relationships", () => {
    expect(district).toMatchObject({ sceneCount: 15, placeCount: 5 });
    expect(linksFor("Lanka").map((link) => link.id)).toEqual(["leave-lanka"]);
    expect(linksFor("Kishkindha").map((link) => link.id)).toEqual(["sky-road"]);
    expect(linksFor("Bharadvaja's hermitage").map((link) => link.id)).toEqual(["bharadvaja-hermitage"]);
    expect(linksFor("Nandigrama").map((link) => link.id)).toEqual(["hanuman-goes-ahead", "bharata-hears"]);
    expect(linksFor("Ayodhya").map((link) => link.id)).toEqual(["coronation-dawn", "manthara-sees-city", "fear-becomes-demands", "king-trapped-by-word", "rama-crosses-celebration", "rama-accepts-exile", "sita-chooses-road", "lakshmana-joins", "bharadvaja-hermitage", "ayodhya-prepares", "kingdom-returned"]);
  });

  it("retains relationship meaning instead of inventing geographic settings", () => {
    expect(linksFor("Bharadvaja's hermitage")[0]).toMatchObject({ relation: "takes place at", placeNodeId: "bharadvaja-hermitage-story-world" });
    expect(linksFor("Ayodhya").find((link) => link.id === "bharadvaja-hermitage")).toMatchObject({ relation: "asks for news of" });
    expect(linksFor("Nandigrama").map((link) => link.relation)).toEqual(["arrives in", "unfolds at"]);
  });

  it("fails closed when playable content loses its preview or mapped place", () => {
    expect(() => buildPlayableStoryDistrictIndex({ ...pack, momentPreviews: {} }, journey.stops, map)).toThrow("missing its preview");
    const mapWithoutLanka = { ...map, places: map.places.filter((place) => place.label !== "Lanka") };
    expect(() => buildPlayableStoryDistrictIndex(pack, journey.stops, mapWithoutLanka)).toThrow("absent from the narrative map: Lanka");
  });
});

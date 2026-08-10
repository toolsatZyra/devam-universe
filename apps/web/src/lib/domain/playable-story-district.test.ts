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

  it("projects all seven detailed districts from existing graph relationships", () => {
    expect(district).toMatchObject({ sceneCount: 55, placeCount: 43 });
    expect(linksFor("Lanka").map((link) => link.id)).toEqual(["leave-lanka"]);
    expect(linksFor("Kishkindha").map((link) => link.id)).toEqual(["sky-road"]);
    expect(linksFor("Bharadvaja's hermitage").map((link) => link.id)).toEqual(["bharadvaja-hermitage"]);
    expect(linksFor("Nandigrama").map((link) => link.id)).toEqual(["nandigrama-trust", "hanuman-goes-ahead", "bharata-hears"]);
    expect(linksFor("The Tamasa riverbank").map((link) => link.id)).toEqual(["tamasa-night"]);
    expect(linksFor("The road beyond Kosala").map((link) => link.id)).toEqual(["roads-beyond-kosala"]);
    expect(linksFor("Shringaverapura").map((link) => link.id)).toEqual(["guha-night-watch"]);
    expect(linksFor("The Ganga crossing").map((link) => link.id)).toEqual(["ganga-crossing"]);
    expect(linksFor("The first forest night").map((link) => link.id)).toEqual(["first-forest-night"]);
    expect(linksFor("The confluence at Prayaga").map((link) => link.id)).toEqual(["prayaga-to-yamuna"]);
    expect(linksFor("The cottage at Chitrakoot").map((link) => link.id)).toEqual(["chitrakoot-home"]);
    expect(linksFor("The silent city").map((link) => link.id)).toEqual(["empty-chariot-return"]);
    expect(linksFor("The darkened royal chamber").map((link) => link.id)).toEqual(["palace-grief-dialogue"]);
    expect(linksFor("The Sarayu of an old memory").map((link) => link.id)).toEqual(["river-sound-confession"]);
    expect(linksFor("The palace between death and succession").map((link) => link.id)).toEqual(["city-without-king"]);
    expect(linksFor("The urgent road from Kekaya").map((link) => link.id)).toEqual(["bharata-urgent-return"]);
    expect(linksFor("Kaikeyi's room after the boons").map((link) => link.id)).toEqual(["bharata-rejects-boons"]);
    expect(linksFor("The funeral bank of the Sarayu").map((link) => link.id)).toEqual(["funeral-and-trust"]);
    expect(linksFor("The road prepared for Rama").map((link) => link.id)).toEqual(["crown-refused-road"]);
    expect(linksFor("The expedition at the Ganga").map((link) => link.id)).toEqual(["expedition-reaches-ganga"]);
    expect(linksFor("The grass beneath the Ingudi tree").map((link) => link.id)).toEqual(["guha-shows-first-night"]);
    expect(linksFor("Bharadvaja's impossible welcome").map((link) => link.id)).toEqual(["bharadvaja-tests-hosts"]);
    expect(linksFor("The smoke above Chitrakoot").map((link) => link.id)).toEqual(["chitrakoot-hears-army"]);
    expect(linksFor("The cottage of reunion").map((link) => link.id)).toEqual(["brothers-meet-death-news"]);
    expect(linksFor("The family council by the Mandakini").map((link) => link.id)).toEqual(["family-asks-rama-home"]);
    expect(linksFor("The council of the sandals").map((link) => link.id)).toEqual(["sandals-hold-kingdom"]);
    expect(linksFor("The hermitages leave Chitrakoot").map((link) => link.id)).toEqual(["chitrakoot-grows-unsafe"]);
    expect(linksFor("Atri and Anasuya's hermitage").map((link) => link.id)).toEqual(["sita-tells-her-beginning"]);
    expect(linksFor("The hermitage constellation of Dandaka").map((link) => link.id)).toEqual(["dandaka-receives-them"]);
    expect(linksFor("Viradha's broken road").map((link) => link.id)).toEqual(["viradha-breaks-the-road"]);
    expect(linksFor("The road from Sarabhanga to Sutikshna").map((link) => link.id)).toEqual(["forest-asks-protection"]);
    expect(linksFor("The dialogue on the forest road").map((link) => link.id)).toEqual(["sita-questions-the-bow"]);
    expect(linksFor("Panchapsara and the ten-year forest").map((link) => link.id)).toEqual(["ten-years-become-map"]);
    expect(linksFor("Agastya's southern hermitage").map((link) => link.id)).toEqual(["agastya-points-south"]);
    expect(linksFor("Jatayu's Panchavati threshold").map((link) => link.id)).toEqual(["jatayu-welcomes-panchavati"]);
    expect(linksFor("The cottage at Panchavati").map((link) => link.id)).toEqual(["surpanakha-breaks-quiet"]);
    expect(linksFor("The Janasthana battlefield").map((link) => link.id)).toEqual(["janasthana-falls"]);
    expect(linksFor("Ravana's road to Maricha").map((link) => link.id)).toEqual(["ravana-chooses-deception"]);
    expect(linksFor("The golden deer path").map((link) => link.id)).toEqual(["golden-deer-separates-house"]);
    expect(linksFor("The emptied Panchavati cottage").map((link) => link.id)).toEqual(["mendicant-at-empty-cottage"]);
    expect(linksFor("The southward sky-road").map((link) => link.id)).toEqual(["sita-carried-south"]);
    expect(linksFor("Jatayu's last resistance").map((link) => link.id)).toEqual(["jatayu-rises-sky-road"]);
    expect(linksFor("Ayodhya").map((link) => link.id)).toEqual(["coronation-dawn", "manthara-sees-city", "fear-becomes-demands", "king-trapped-by-word", "rama-crosses-celebration", "rama-accepts-exile", "sita-chooses-road", "lakshmana-joins", "city-follows-car", "bharadvaja-hermitage", "ayodhya-prepares", "kingdom-returned"]);
  });

  it("retains relationship meaning instead of inventing geographic settings", () => {
    expect(linksFor("Bharadvaja's hermitage")[0]).toMatchObject({ relation: "takes place at", placeNodeId: "bharadvaja-hermitage-story-world" });
    expect(linksFor("Ayodhya").find((link) => link.id === "bharadvaja-hermitage")).toMatchObject({ relation: "asks for news of" });
    expect(linksFor("Nandigrama").map((link) => link.relation)).toEqual(["unfolds at", "arrives in", "unfolds at"]);
  });

  it("fails closed when playable content loses its preview or mapped place", () => {
    expect(() => buildPlayableStoryDistrictIndex({ ...pack, momentPreviews: {} }, journey.stops, map)).toThrow("missing its preview");
    const mapWithoutLanka = { ...map, places: map.places.filter((place) => place.label !== "Lanka") };
    expect(() => buildPlayableStoryDistrictIndex(pack, journey.stops, mapWithoutLanka)).toThrow("absent from the narrative map: Lanka");
  });
});

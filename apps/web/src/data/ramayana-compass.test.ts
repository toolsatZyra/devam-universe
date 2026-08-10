import { describe, expect, it } from "vitest";
import { buildRamayanaCompass } from "./ramayana-compass";

const expectedUnits: Record<string, number> = {
  bala: 75,
  ayodhya: 118,
  aranya: 75,
  kishkindha: 67,
  sundara: 66,
  yuddha: 128,
  uttara: 123,
};

describe("Ramayana whole-epic story compass", () => {
  const compass = buildRamayanaCompass();

  it("reveals seven story worlds and 49 bounded turns without a 49-node first view", () => {
    expect(compass.arcs).toHaveLength(7);
    expect(Object.keys(compass.turns)).toHaveLength(49);
    for (const arc of compass.arcs) {
      expect(arc.turnIds.length, arc.id).toBeGreaterThanOrEqual(6);
      expect(arc.turnIds.length, arc.id).toBeLessThanOrEqual(8);
      expect(new Set(arc.turnIds).size, arc.id).toBe(arc.turnIds.length);
    }
  });

  it("partitions every one of the selected expression's 652 source units exactly once", () => {
    const covered = new Map<string, number[]>();
    for (const turn of Object.values(compass.turns)) {
      const { kandaSlug, startOrdinal, endOrdinal } = turn.sourceRange;
      expect(startOrdinal, turn.id).toBeGreaterThanOrEqual(1);
      expect(endOrdinal, turn.id).toBeGreaterThanOrEqual(startOrdinal);
      expect(turn.sourceRange.sourceSha256, turn.id).toMatch(/^[a-f0-9]{64}$/);
      const ordinals = covered.get(kandaSlug) ?? [];
      for (let ordinal = startOrdinal; ordinal <= endOrdinal; ordinal += 1) ordinals.push(ordinal);
      covered.set(kandaSlug, ordinals);
    }

    for (const [kandaSlug, count] of Object.entries(expectedUnits)) {
      expect(covered.get(kandaSlug), kandaSlug).toEqual(Array.from({ length: count }, (_, index) => index + 1));
    }
    expect([...covered.values()].reduce((sum, ordinals) => sum + ordinals.length, 0)).toBe(compass.totalSourceUnits);
  });

  it("distinguishes mapped orientation from the fourteen playable compass entrances", () => {
    const playable = Object.values(compass.turns).filter((turn) => turn.coverage === "playable");
    expect(playable.map((turn) => [turn.id, turn.playableMomentId])).toEqual([
      ["coronation-dawn", "coronation-dawn"],
      ["two-boons", "manthara-sees-city"],
      ["exile-accepted", "rama-accepts-exile"],
      ["road-out-of-ayodhya", "city-follows-car"],
      ["king-dies-bharata-returns", "palace-grief-dialogue"],
      ["bharata-follows", "expedition-reaches-ganga"],
      ["sandals-and-promise", "brothers-meet-death-news"],
      ["deeper-into-forest", "chitrakoot-grows-unsafe"],
      ["dandaka-vows", "dandaka-receives-them"],
      ["panchavati-surpanakha", "jatayu-welcomes-panchavati"],
      ["war-at-janasthana", "janasthana-falls"],
      ["golden-deer-plot", "ravana-chooses-deception"],
      ["sita-is-taken", "mendicant-at-empty-cottage"],
      ["road-home", "leave-lanka"],
    ]);
    expect(playable.at(-1)?.sourceRange).toMatchObject({ kandaSlug: "yuddha", startOrdinal: 122, endOrdinal: 128 });
    expect(Object.values(compass.turns).filter((turn) => turn.coverage === "orientation")).toHaveLength(35);
    expect(compass.sourceBoundary).toContain("not Sanskrit");
    expect(compass.sourceBoundary).toContain("not a finished playable scene");
  });

  it("keeps the public compass story-first and bilingual", () => {
    for (const turn of Object.values(compass.turns)) {
      expect(turn.title.en.length, turn.id).toBeGreaterThan(8);
      expect(turn.title.hi.length, turn.id).toBeGreaterThan(6);
      expect(turn.hook.en.length, turn.id).toBeGreaterThan(55);
      expect(turn.hook.hi.length, turn.id).toBeGreaterThan(35);
      expect(turn.place.length, turn.id).toBeGreaterThan(3);
      expect(turn.places.length, turn.id).toBeGreaterThanOrEqual(1);
      expect(new Set(turn.places).size, turn.id).toBe(turn.places.length);
      expect(turn.characters.length, turn.id).toBeGreaterThanOrEqual(3);
      expect(turn.threads.length, turn.id).toBeGreaterThanOrEqual(2);
    }
  });
});

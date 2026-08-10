import { describe, expect, it } from "vitest";
import { RAMAYANA_BEGINNINGS_SCENE_OUTLINES } from "./ramayana-beginnings-outline";
import { RAMAYANA_BEGINNINGS_PLAYABLE_SCENES } from "./ramayana-beginnings-playable";

describe("Ramayana opening-frame playable stories", () => {
  it("promotes exactly the four source-unit opening scenes", () => {
    expect(RAMAYANA_BEGINNINGS_PLAYABLE_SCENES).toHaveLength(4);
    expect(RAMAYANA_BEGINNINGS_PLAYABLE_SCENES.reduce(
      (count, scene) => count + scene.moment.beats.length,
      0,
    )).toBe(18);
    expect(RAMAYANA_BEGINNINGS_PLAYABLE_SCENES.map((scene) => scene.sourceGlobalOrdinal)).toEqual([1, 2, 3, 4]);
    expect(new Set(RAMAYANA_BEGINNINGS_PLAYABLE_SCENES.map((scene) => scene.spanSha256)).size).toBe(4);
  });

  it("keeps every playable scene anchored to its exact single-section outline", () => {
    const outlineById = new Map(RAMAYANA_BEGINNINGS_SCENE_OUTLINES.map((outline) => [outline.id, outline]));
    for (const scene of RAMAYANA_BEGINNINGS_PLAYABLE_SCENES) {
      const outline = outlineById.get(scene.id);
      expect(outline?.sourceStart, scene.id).toBe(scene.sourceGlobalOrdinal);
      expect(outline?.sourceEnd, scene.id).toBe(scene.sourceGlobalOrdinal);
      expect(scene.spanSha256, scene.id).toMatch(/^[0-9a-f]{64}$/);
    }
  });

  it("provides substantial bilingual beats and concrete visual staging", () => {
    for (const scene of RAMAYANA_BEGINNINGS_PLAYABLE_SCENES) {
      expect(scene.moment.decisiveChange.en.length, scene.id).toBeGreaterThan(55);
      expect(scene.moment.decisiveChange.hi.length, scene.id).toBeGreaterThan(45);
      expect(scene.moment.beats.length, scene.id).toBeGreaterThanOrEqual(4);
      for (const beat of scene.moment.beats) {
        expect(beat.title.en.length, beat.id).toBeGreaterThan(12);
        expect(beat.title.hi.length, beat.id).toBeGreaterThan(10);
        expect(beat.narration.en.length, beat.id).toBeGreaterThan(180);
        expect(beat.narration.hi.length, beat.id).toBeGreaterThan(150);
        expect(beat.visualCue.length, beat.id).toBeGreaterThan(70);
        expect(beat.characterIds.length, beat.id).toBeGreaterThanOrEqual(1);
      }
    }
  });
});

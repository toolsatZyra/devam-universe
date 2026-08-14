import { describe, expect, it } from "vitest";
import { buildRamayanaCompass } from "./ramayana-compass";
import { RAMAYANA_BEGINNINGS_SCENE_OUTLINES } from "./ramayana-beginnings-outline";

describe("Ramayana beginnings editorial denominator", () => {
  const compass = buildRamayanaCompass();
  const beginnings = compass.arcs.find((arc) => arc.id === "beginnings")!;

  it("defines a substantial scene denominator instead of six one-line turns", () => {
    expect(RAMAYANA_BEGINNINGS_SCENE_OUTLINES).toHaveLength(42);
    expect(new Set(RAMAYANA_BEGINNINGS_SCENE_OUTLINES.map((scene) => scene.id)).size).toBe(42);
    expect(new Set(RAMAYANA_BEGINNINGS_SCENE_OUTLINES.map((scene) => scene.turnId))).toEqual(new Set(beginnings.turnIds));
  });

  it("partitions every selected Balakanda source unit exactly once", () => {
    const covered = RAMAYANA_BEGINNINGS_SCENE_OUTLINES.flatMap((scene) =>
      Array.from({ length: scene.sourceEnd - scene.sourceStart + 1 }, (_, index) => scene.sourceStart + index),
    );
    expect(covered).toEqual(Array.from({ length: 75 }, (_, index) => index + 1));
  });

  it("partitions every compass turn within its exact source boundary", () => {
    for (const turnId of beginnings.turnIds) {
      const turn = compass.turns[turnId];
      const scenes = RAMAYANA_BEGINNINGS_SCENE_OUTLINES.filter((scene) => scene.turnId === turnId);
      const covered = scenes.flatMap((scene) =>
        Array.from({ length: scene.sourceEnd - scene.sourceStart + 1 }, (_, index) => scene.sourceStart + index),
      );
      expect(covered, turnId).toEqual(
        Array.from({ length: turn.sourceRange.endOrdinal - turn.sourceRange.startOrdinal + 1 }, (_, index) => turn.sourceRange.startOrdinal + index),
      );
      expect(scenes.map((scene) => scene.ordinal), turnId).toEqual(scenes.map((_, index) => index + 1));
    }
  });

  it("keeps every draft scene bilingual, navigable, and editorially substantial", () => {
    for (const scene of RAMAYANA_BEGINNINGS_SCENE_OUTLINES) {
      expect(scene.title.en.length, scene.id).toBeGreaterThan(12);
      expect(scene.title.hi.length, scene.id).toBeGreaterThan(10);
      expect(scene.synopsis.en.length, scene.id).toBeGreaterThan(180);
      expect(scene.synopsis.hi.length, scene.id).toBeGreaterThan(140);
      expect(scene.characters.length, scene.id).toBeGreaterThanOrEqual(3);
      expect(scene.places.length, scene.id).toBeGreaterThanOrEqual(1);
    }
  });
});

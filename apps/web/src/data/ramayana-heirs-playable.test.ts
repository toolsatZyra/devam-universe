import { describe, expect, it } from "vitest";
import { getDuttBalaSpanSha256s } from "./ramayana-bala-source-spans";
import { RAMAYANA_BEGINNINGS_SCENE_OUTLINES } from "./ramayana-beginnings-outline";
import { RAMAYANA_HEIRS_PLAYABLE_SCENES } from "./ramayana-heirs-playable";

describe("Ramayana Ayodhya-awaits-heirs playable stories", () => {
  const outlineById = new Map(RAMAYANA_BEGINNINGS_SCENE_OUTLINES.map((outline) => [outline.id, outline]));

  it("completes all eight source-partitioned scenes across Balakanda 5-17", () => {
    expect(RAMAYANA_HEIRS_PLAYABLE_SCENES).toHaveLength(8);
    expect(RAMAYANA_HEIRS_PLAYABLE_SCENES.reduce((count, scene) => count + scene.moment.beats.length, 0)).toBe(32);
    const covered = RAMAYANA_HEIRS_PLAYABLE_SCENES.flatMap((scene) => {
      const outline = outlineById.get(scene.id)!;
      expect(getDuttBalaSpanSha256s(outline.sourceStart, outline.sourceEnd)).toHaveLength(
        outline.sourceEnd - outline.sourceStart + 1,
      );
      return Array.from({ length: outline.sourceEnd - outline.sourceStart + 1 }, (_, index) => outline.sourceStart + index);
    });
    expect(covered).toEqual(Array.from({ length: 13 }, (_, index) => index + 5));
  });

  it("keeps every beat bilingual, substantial, visual, and character-addressable", () => {
    for (const scene of RAMAYANA_HEIRS_PLAYABLE_SCENES) {
      expect(scene.nodeIds.length, scene.id).toBeGreaterThanOrEqual(4);
      expect(scene.moment.beats).toHaveLength(4);
      for (const beat of scene.moment.beats) {
        expect(beat.narration.en.length, beat.id).toBeGreaterThan(180);
        expect(beat.narration.hi.length, beat.id).toBeGreaterThan(150);
        expect(beat.visualCue.length, beat.id).toBeGreaterThan(70);
        expect(beat.characterIds.length, beat.id).toBeGreaterThanOrEqual(1);
      }
    }
  });
});

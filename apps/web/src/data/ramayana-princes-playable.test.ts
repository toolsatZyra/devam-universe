import { describe, expect, it } from "vitest";
import { getDuttBalaSpanSha256s } from "./ramayana-bala-source-spans";
import { RAMAYANA_BEGINNINGS_SCENE_OUTLINES } from "./ramayana-beginnings-outline";
import { RAMAYANA_PRINCES_PLAYABLE_SCENES } from "./ramayana-princes-playable";

describe("Ramayana princes-enter-world playable stories", () => {
  const outlineById = new Map(RAMAYANA_BEGINNINGS_SCENE_OUTLINES.map((outline) => [outline.id, outline]));

  it("completes ten source-partitioned scenes across Balakanda 18-30", () => {
    expect(RAMAYANA_PRINCES_PLAYABLE_SCENES).toHaveLength(10);
    expect(RAMAYANA_PRINCES_PLAYABLE_SCENES.reduce((count, scene) => count + scene.moment.beats.length, 0)).toBe(40);
    const covered = RAMAYANA_PRINCES_PLAYABLE_SCENES.flatMap((scene) => {
      const outline = outlineById.get(scene.id)!;
      expect(getDuttBalaSpanSha256s(outline.sourceStart, outline.sourceEnd)).toHaveLength(
        outline.sourceEnd - outline.sourceStart + 1,
      );
      return Array.from({ length: outline.sourceEnd - outline.sourceStart + 1 }, (_, index) => outline.sourceStart + index);
    });
    expect(covered).toEqual(Array.from({ length: 13 }, (_, index) => index + 18));
  });

  it("keeps every scene substantial, bilingual, visual, and traversable", () => {
    for (const scene of RAMAYANA_PRINCES_PLAYABLE_SCENES) {
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

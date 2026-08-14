import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_HANUMAN_MEETS_RAMA_SCENE_OUTLINES } from "./ramayana-hanuman-meets-rama-outline";
import { RAMAYANA_HANUMAN_MEETS_RAMA_PLAYABLE_SCENES } from "./ramayana-hanuman-meets-rama-playable";

describe("Ramayana Hanuman-meets-Rama playable stories", () => {
  const outlineById = new Map(RAMAYANA_HANUMAN_MEETS_RAMA_SCENE_OUTLINES.map((outline) => [outline.id, outline]));

  it("partitions every Kishkindha section from 1 through 5 exactly once", () => {
    expect(RAMAYANA_HANUMAN_MEETS_RAMA_PLAYABLE_SCENES).toHaveLength(5);
    expect(RAMAYANA_HANUMAN_MEETS_RAMA_PLAYABLE_SCENES.reduce((n, scene) => n + scene.moment.beats.length, 0)).toBe(20);
    const covered = RAMAYANA_HANUMAN_MEETS_RAMA_PLAYABLE_SCENES.flatMap((scene) => {
      const outline = outlineById.get(scene.id)!;
      expect(getDuttKandaSpanSha256s("kishkindha", outline.sourceStart, outline.sourceEnd)).toHaveLength(outline.sourceEnd - outline.sourceStart + 1);
      return Array.from({ length: outline.sourceEnd - outline.sourceStart + 1 }, (_, i) => outline.sourceStart + i);
    });
    expect(covered).toEqual([1, 2, 3, 4, 5]);
  });

  it("keeps every scene navigable and every beat bilingual, visual, and substantial", () => {
    for (const scene of RAMAYANA_HANUMAN_MEETS_RAMA_PLAYABLE_SCENES) {
      expect(scene.nodeIds.length, scene.id).toBeGreaterThanOrEqual(4);
      for (const beat of scene.moment.beats) {
        expect(beat.narration.en.length, beat.id).toBeGreaterThan(180);
        expect(beat.narration.hi.length, beat.id).toBeGreaterThan(150);
        expect(beat.visualCue.length, beat.id).toBeGreaterThan(70);
      }
    }
  });
});

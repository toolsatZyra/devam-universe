import { describe, expect, it } from "vitest";
import { RAMAYANA_BROKEN_TRAIL_SCENE_OUTLINES } from "./ramayana-broken-trail-outline";
import { RAMAYANA_BROKEN_TRAIL_PLAYABLE_SCENES } from "./ramayana-broken-trail-playable";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";

describe("Ramayana broken-trail playable stories", () => {
  const outlineById = new Map(RAMAYANA_BROKEN_TRAIL_SCENE_OUTLINES.map((outline) => [outline.id, outline]));
  it("partitions every Aranya section from 54 through 68 exactly once", () => {
    expect(RAMAYANA_BROKEN_TRAIL_PLAYABLE_SCENES).toHaveLength(6);
    expect(RAMAYANA_BROKEN_TRAIL_PLAYABLE_SCENES.reduce((n, scene) => n + scene.moment.beats.length, 0)).toBe(24);
    const covered = RAMAYANA_BROKEN_TRAIL_PLAYABLE_SCENES.flatMap((scene) => {
      const outline = outlineById.get(scene.id)!;
      expect(getDuttKandaSpanSha256s("aranya", outline.sourceStart, outline.sourceEnd)).toHaveLength(outline.sourceEnd - outline.sourceStart + 1);
      return Array.from({ length: outline.sourceEnd - outline.sourceStart + 1 }, (_, i) => outline.sourceStart + i);
    });
    expect(covered).toEqual(Array.from({ length: 15 }, (_, i) => i + 54));
  });
  it("keeps every beat bilingual, visual, and substantial", () => {
    for (const scene of RAMAYANA_BROKEN_TRAIL_PLAYABLE_SCENES) {
      expect(scene.nodeIds.length, scene.id).toBeGreaterThanOrEqual(4);
      for (const beat of scene.moment.beats) {
        expect(beat.narration.en.length, beat.id).toBeGreaterThan(180);
        expect(beat.narration.hi.length, beat.id).toBeGreaterThan(150);
        expect(beat.visualCue.length, beat.id).toBeGreaterThan(70);
      }
    }
  });
});

import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_TWO_LOSSES_ONE_ALLIANCE_SCENE_OUTLINES } from "./ramayana-two-losses-one-alliance-outline";
import { RAMAYANA_TWO_LOSSES_ONE_ALLIANCE_PLAYABLE_SCENES } from "./ramayana-two-losses-one-alliance-playable";

describe("Ramayana two-losses-one-alliance playable stories", () => {
  const outlineById = new Map(RAMAYANA_TWO_LOSSES_ONE_ALLIANCE_SCENE_OUTLINES.map((outline) => [outline.id, outline]));

  it("partitions every Kishkindha section from 6 through 14 exactly once", () => {
    expect(RAMAYANA_TWO_LOSSES_ONE_ALLIANCE_PLAYABLE_SCENES).toHaveLength(9);
    expect(RAMAYANA_TWO_LOSSES_ONE_ALLIANCE_PLAYABLE_SCENES.reduce((n, scene) => n + scene.moment.beats.length, 0)).toBe(36);
    const covered = RAMAYANA_TWO_LOSSES_ONE_ALLIANCE_PLAYABLE_SCENES.flatMap((scene) => {
      const outline = outlineById.get(scene.id)!;
      expect(getDuttKandaSpanSha256s("kishkindha", outline.sourceStart, outline.sourceEnd)).toHaveLength(outline.sourceEnd - outline.sourceStart + 1);
      return Array.from({ length: outline.sourceEnd - outline.sourceStart + 1 }, (_, i) => outline.sourceStart + i);
    });
    expect(covered).toEqual(Array.from({ length: 9 }, (_, i) => i + 6));
  });

  it("keeps every scene navigable and every beat bilingual, visual, and substantial", () => {
    for (const scene of RAMAYANA_TWO_LOSSES_ONE_ALLIANCE_PLAYABLE_SCENES) {
      expect(scene.nodeIds.length, scene.id).toBeGreaterThanOrEqual(4);
      for (const beat of scene.moment.beats) {
        expect(beat.narration.en.length, beat.id).toBeGreaterThan(180);
        expect(beat.narration.hi.length, beat.id).toBeGreaterThan(150);
        expect(beat.visualCue.length, beat.id).toBeGreaterThan(70);
      }
    }
  });
});

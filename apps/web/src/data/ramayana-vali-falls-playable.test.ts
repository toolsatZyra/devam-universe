import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_VALI_FALLS_SCENE_OUTLINES } from "./ramayana-vali-falls-outline";
import { RAMAYANA_VALI_FALLS_PLAYABLE_SCENES } from "./ramayana-vali-falls-playable";

describe("Ramayana Vali-falls playable stories", () => {
  const outlineById = new Map(RAMAYANA_VALI_FALLS_SCENE_OUTLINES.map((outline) => [outline.id, outline]));

  it("partitions every Kishkindha section from 15 through 26 exactly once", () => {
    expect(RAMAYANA_VALI_FALLS_PLAYABLE_SCENES).toHaveLength(12);
    expect(RAMAYANA_VALI_FALLS_PLAYABLE_SCENES.reduce((n, scene) => n + scene.moment.beats.length, 0)).toBe(48);
    const covered = RAMAYANA_VALI_FALLS_PLAYABLE_SCENES.flatMap((scene) => {
      const outline = outlineById.get(scene.id)!;
      expect(getDuttKandaSpanSha256s("kishkindha", outline.sourceStart, outline.sourceEnd)).toHaveLength(outline.sourceEnd - outline.sourceStart + 1);
      return Array.from({ length: outline.sourceEnd - outline.sourceStart + 1 }, (_, i) => outline.sourceStart + i);
    });
    expect(covered).toEqual(Array.from({ length: 12 }, (_, i) => i + 15));
  });

  it("keeps every scene navigable and every beat bilingual, visual, and substantial", () => {
    for (const scene of RAMAYANA_VALI_FALLS_PLAYABLE_SCENES) {
      expect(scene.nodeIds.length, scene.id).toBeGreaterThanOrEqual(4);
      for (const beat of scene.moment.beats) {
        expect(beat.narration.en.length, beat.id).toBeGreaterThan(180);
        expect(beat.narration.hi.length, beat.id).toBeGreaterThan(150);
        expect(beat.visualCue.length, beat.id).toBeGreaterThan(70);
      }
    }
  });
});

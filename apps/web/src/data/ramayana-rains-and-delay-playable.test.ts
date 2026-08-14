import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_RAINS_AND_DELAY_SCENE_OUTLINES } from "./ramayana-rains-and-delay-outline";
import { RAMAYANA_RAINS_AND_DELAY_PLAYABLE_SCENES } from "./ramayana-rains-and-delay-playable";

describe("Ramayana rains-and-delay playable stories", () => {
  const outlineById = new Map(RAMAYANA_RAINS_AND_DELAY_SCENE_OUTLINES.map((outline) => [outline.id, outline]));

  it("partitions every Kishkindha section from 27 through 39 exactly once", () => {
    expect(RAMAYANA_RAINS_AND_DELAY_PLAYABLE_SCENES).toHaveLength(13);
    expect(RAMAYANA_RAINS_AND_DELAY_PLAYABLE_SCENES.reduce((n, scene) => n + scene.moment.beats.length, 0)).toBe(52);
    const covered = RAMAYANA_RAINS_AND_DELAY_PLAYABLE_SCENES.flatMap((scene) => {
      const outline = outlineById.get(scene.id)!;
      expect(getDuttKandaSpanSha256s("kishkindha", outline.sourceStart, outline.sourceEnd)).toHaveLength(outline.sourceEnd - outline.sourceStart + 1);
      return Array.from({ length: outline.sourceEnd - outline.sourceStart + 1 }, (_, i) => outline.sourceStart + i);
    });
    expect(covered).toEqual(Array.from({ length: 13 }, (_, i) => i + 27));
  });

  it("keeps every scene navigable and every beat bilingual, visual, and substantial", () => {
    for (const scene of RAMAYANA_RAINS_AND_DELAY_PLAYABLE_SCENES) {
      expect(scene.nodeIds.length, scene.id).toBeGreaterThanOrEqual(4);
      for (const beat of scene.moment.beats) {
        expect(beat.narration.en.length, beat.id).toBeGreaterThan(180);
        expect(beat.narration.hi.length, beat.id).toBeGreaterThan(150);
        expect(beat.visualCue.length, beat.id).toBeGreaterThan(70);
      }
    }
  });

  it("preserves delay, prior mobilization, coercive threat, mediation, and mutual repair as distinct facts", () => {
    const english = RAMAYANA_RAINS_AND_DELAY_PLAYABLE_SCENES
      .flatMap((scene) => scene.moment.beats.map((beat) => beat.narration.en))
      .join(" ");
    expect(english).toContain("mobilization did not begin only after Lakshmana's threat");
    expect(english).toContain("road Vali travelled");
    expect(english).toContain("Tara reveals");
    expect(english).toContain("Lakshmana accepts Sugriva's answer");
  });
});

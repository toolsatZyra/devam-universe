import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_LEAP_ACROSS_OCEAN_SCENE_OUTLINES } from "./ramayana-leap-across-ocean-outline";
import { RAMAYANA_LEAP_ACROSS_OCEAN_PLAYABLE_SCENES } from "./ramayana-leap-across-ocean-playable";

describe("Ramayana leap-across-ocean playable stories", () => {
  const outlineById = new Map(RAMAYANA_LEAP_ACROSS_OCEAN_SCENE_OUTLINES.map((outline) => [outline.id, outline]));

  it("partitions every Sundara section from 1 through 4 exactly once", () => {
    expect(RAMAYANA_LEAP_ACROSS_OCEAN_PLAYABLE_SCENES).toHaveLength(4);
    expect(RAMAYANA_LEAP_ACROSS_OCEAN_PLAYABLE_SCENES.reduce((n, scene) => n + scene.moment.beats.length, 0)).toBe(28);
    const covered = RAMAYANA_LEAP_ACROSS_OCEAN_PLAYABLE_SCENES.flatMap((scene) => {
      const outline = outlineById.get(scene.id)!;
      expect(getDuttKandaSpanSha256s("sundara", outline.sourceStart, outline.sourceEnd)).toHaveLength(outline.sourceEnd - outline.sourceStart + 1);
      return Array.from({ length: outline.sourceEnd - outline.sourceStart + 1 }, (_, index) => outline.sourceStart + index);
    }).sort((a, b) => a - b);
    expect(covered).toEqual([1, 2, 3, 4]);
  });

  it("keeps every scene navigable and every beat bilingual, visual, and substantial", () => {
    for (const scene of RAMAYANA_LEAP_ACROSS_OCEAN_PLAYABLE_SCENES) {
      expect(scene.nodeIds.length, scene.id).toBeGreaterThanOrEqual(8);
      for (const beat of scene.moment.beats) {
        expect(beat.narration.en.length, beat.id).toBeGreaterThan(180);
        expect(beat.narration.hi.length, beat.id).toBeGreaterThan(150);
        expect(beat.visualCue.length, beat.id).toBeGreaterThan(70);
      }
    }
  });

  it("keeps hospitality, judgment, predation, restraint, and an inhabited Lanka distinct", () => {
    const english = RAMAYANA_LEAP_ACROSS_OCEAN_PLAYABLE_SCENES
      .flatMap((scene) => scene.moment.beats.map((beat) => beat.narration.en))
      .join(" ");
    expect(english).toContain("the shaking ground prevents Hanuman's power from looking clean or costless");
    expect(english).toContain("accepts the welcome in symbol");
    expect(english).toContain("shrinks to the size of a thumb");
    expect(english).toContain("Unlike Surasa, this attacker sought to consume him");
    expect(english).toContain("Until he finds Sita and learns whether she is alive");
    expect(english).toContain("deliberately restrains the power that crossed the ocean");
    expect(english).toContain("homes, worship, celebration and military readiness occupy the night together");
    expect(english).toContain("Sita has not yet been found; the search begins anew inside");
  });
});

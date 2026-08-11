import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_SITA_ASHOKA_GROVE_SCENE_OUTLINES } from "./ramayana-sita-ashoka-grove-outline";
import { RAMAYANA_SITA_ASHOKA_GROVE_PLAYABLE_SCENES } from "./ramayana-sita-ashoka-grove-playable";

describe("Ramayana Sita-in-the-Ashoka-grove playable stories", () => {
  const outlineById = new Map(RAMAYANA_SITA_ASHOKA_GROVE_SCENE_OUTLINES.map((outline) => [outline.id, outline]));

  it("partitions every Sundara source ordinal from 15 through 29 exactly once", () => {
    expect(RAMAYANA_SITA_ASHOKA_GROVE_PLAYABLE_SCENES).toHaveLength(15);
    expect(RAMAYANA_SITA_ASHOKA_GROVE_PLAYABLE_SCENES.reduce((n, scene) => n + scene.moment.beats.length, 0)).toBe(88);
    const covered = RAMAYANA_SITA_ASHOKA_GROVE_PLAYABLE_SCENES.flatMap((scene) => {
      const outline = outlineById.get(scene.id)!;
      expect(getDuttKandaSpanSha256s("sundara", outline.sourceStart, outline.sourceEnd)).toHaveLength(
        outline.sourceEnd - outline.sourceStart + 1,
      );
      return Array.from(
        { length: outline.sourceEnd - outline.sourceStart + 1 },
        (_, index) => outline.sourceStart + index,
      );
    }).sort((left, right) => left - right);
    expect(covered).toEqual([15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]);
  });

  it("keeps every scene navigable and every beat bilingual, visual, and substantial", () => {
    for (const scene of RAMAYANA_SITA_ASHOKA_GROVE_PLAYABLE_SCENES) {
      expect(scene.nodeIds.length, scene.id).toBeGreaterThanOrEqual(7);
      for (const beat of scene.moment.beats) {
        expect(beat.narration.en.length, beat.id).toBeGreaterThan(180);
        expect(beat.narration.hi.length, beat.id).toBeGreaterThan(150);
        expect(beat.visualCue.length, beat.id).toBeGreaterThan(70);
      }
    }
  });

  it("preserves recognition, coercion, crisis care, civilian life, mercy, and the unfinished trust boundary", () => {
    const english = RAMAYANA_SITA_ASHOKA_GROVE_PLAYABLE_SCENES
      .flatMap((scene) => scene.moment.beats.map((beat) => beat.narration.en))
      .join(" ");
    expect(english).toContain("No single clue is enough; their agreement makes the conclusion reliable");
    expect(english).toContain("He does not treat Sita as an object Rama owns or a prize the search has earned");
    expect(english).toContain("Physical variation remains variation");
    expect(english).toContain("cannot create free consent");
    expect(english).toContain("luxury was never one free option among others");
    expect(english).toContain("Ravana can return her");
    expect(english).toContain("a coercive deadline imposed by the captor");
    expect(english).toContain("named speakers");
    expect(english).toContain("no method is shown, rehearsed, or made actionable");
    expect(english).toContain("These possibilities cannot all be true");
    expect(english).toContain("no resident is made deserving of loss");
    expect(english).toContain("not a deterministic forecast of the future");
    expect(english).toContain("Vibhishana");
    expect(english).toContain("Mercy here is Sita's own decision");
    expect(english).toContain("ordinary human speech");
    expect(english).toContain("has not yet revealed himself or earned her trust");
  });
});

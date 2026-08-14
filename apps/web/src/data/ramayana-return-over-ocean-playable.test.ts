import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_RETURN_OVER_OCEAN_SCENE_OUTLINES } from "./ramayana-return-over-ocean-outline";
import { RAMAYANA_RETURN_OVER_OCEAN_PLAYABLE_SCENES } from "./ramayana-return-over-ocean-playable";

describe("Ramayana return-over-ocean playable stories", () => {
  const outlineById = new Map(RAMAYANA_RETURN_OVER_OCEAN_SCENE_OUTLINES.map((outline) => [outline.id, outline]));

  it("partitions every Sundara source ordinal from 55 through 60 exactly once", () => {
    expect(RAMAYANA_RETURN_OVER_OCEAN_PLAYABLE_SCENES).toHaveLength(6);
    expect(RAMAYANA_RETURN_OVER_OCEAN_PLAYABLE_SCENES.reduce((n, scene) => n + scene.moment.beats.length, 0)).toBe(30);
    const covered = RAMAYANA_RETURN_OVER_OCEAN_PLAYABLE_SCENES.flatMap((scene) => {
      const outline = outlineById.get(scene.id)!;
      expect(getDuttKandaSpanSha256s("sundara", outline.sourceStart, outline.sourceEnd)).toHaveLength(
        outline.sourceEnd - outline.sourceStart + 1,
      );
      return Array.from({ length: outline.sourceEnd - outline.sourceStart + 1 }, (_, i) => outline.sourceStart + i);
    }).sort((left, right) => left - right);
    expect(covered).toEqual([55, 56, 57, 58, 59, 60]);
  });

  it("keeps every scene navigable and every beat bilingual, visual, and substantial", () => {
    for (const scene of RAMAYANA_RETURN_OVER_OCEAN_PLAYABLE_SCENES) {
      expect(scene.nodeIds.length, scene.id).toBeGreaterThanOrEqual(8);
      for (const beat of scene.moment.beats) {
        expect(beat.narration.en.length, beat.id).toBeGreaterThan(180);
        expect(beat.narration.hi.length, beat.id).toBeGreaterThan(150);
        expect(beat.visualCue.length, beat.id).toBeGreaterThan(70);
      }
    }
  });

  it("preserves Sita's agency, accountable debriefing, mandate discipline, and Madhuvana consequences", () => {
    const english = RAMAYANA_RETURN_OVER_OCEAN_PLAYABLE_SCENES
      .flatMap((scene) => scene.moment.beats.map((beat) => beat.narration.en))
      .join(" ");
    expect(english).toContain("the person whose safety defines the mission");
    expect(english).toContain("A durable rescue must survive geography");
    expect(english).toContain("the affected landscape is not a disposable launch effect");
    expect(english).toContain("he has seen Sita");
    expect(english).toContain("Victory, civilian harm, ecological damage, and his responsibility");
    expect(english).toContain("Her endurance is active judgment, not passive perfection");
    expect(english).toContain("strength cannot honour Sita by overruling");
    expect(english).toContain("successful capability with authority that was never granted");
    expect(english).toContain("This is not harmless celebration comedy");
    expect(english).toContain("face Sugriva with both the news and what happened in his grove");
  });
});

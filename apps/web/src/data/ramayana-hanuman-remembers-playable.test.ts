import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_HANUMAN_REMEMBERS_SCENE_OUTLINES } from "./ramayana-hanuman-remembers-outline";
import { RAMAYANA_HANUMAN_REMEMBERS_PLAYABLE_SCENES } from "./ramayana-hanuman-remembers-playable";

describe("Ramayana hanuman-remembers playable stories", () => {
  const outlineById = new Map(RAMAYANA_HANUMAN_REMEMBERS_SCENE_OUTLINES.map((outline) => [outline.id, outline]));

  it("partitions every Kishkindha section from 65 through 67 exactly once", () => {
    expect(RAMAYANA_HANUMAN_REMEMBERS_PLAYABLE_SCENES).toHaveLength(3);
    expect(RAMAYANA_HANUMAN_REMEMBERS_PLAYABLE_SCENES.reduce((n, scene) => n + scene.moment.beats.length, 0)).toBe(18);
    const covered = RAMAYANA_HANUMAN_REMEMBERS_PLAYABLE_SCENES.flatMap((scene) => {
      const outline = outlineById.get(scene.id)!;
      expect(getDuttKandaSpanSha256s("kishkindha", outline.sourceStart, outline.sourceEnd)).toHaveLength(outline.sourceEnd - outline.sourceStart + 1);
      return Array.from({ length: outline.sourceEnd - outline.sourceStart + 1 }, (_, index) => outline.sourceStart + index);
    });
    expect(covered).toEqual([65, 66, 67]);
  });

  it("keeps every scene navigable and every beat bilingual, visual, and substantial", () => {
    for (const scene of RAMAYANA_HANUMAN_REMEMBERS_PLAYABLE_SCENES) {
      expect(scene.nodeIds.length, scene.id).toBeGreaterThanOrEqual(8);
      for (const beat of scene.moment.beats) {
        expect(beat.narration.en.length, beat.id).toBeGreaterThan(180);
        expect(beat.narration.hi.length, beat.id).toBeGreaterThan(150);
        expect(beat.visualCue.length, beat.id).toBeGreaterThan(70);
      }
    }
  });

  it("preserves measured limits, return risk, Anjana's objection, vulnerability, collective support, and launch consequences", () => {
    const english = RAMAYANA_HANUMAN_REMEMBERS_PLAYABLE_SCENES
      .flatMap((scene) => scene.moment.beats.map((beat) => beat.narration.en))
      .join(" ");
    expect(english).toContain("cannot promise that he will return");
    expect(english).toContain("Her alarm and objection remain");
    expect(english).toContain("immense ability without support, timing or restraint");
    expect(english).toContain("success is not framed as solitary glory");
    expect(english).toContain("prevents power from appearing costless");
    expect(english).toContain("mentally, every scattered force has become one southward path");
  });
});

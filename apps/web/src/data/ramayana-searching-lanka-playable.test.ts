import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_SEARCHING_LANKA_SCENE_OUTLINES } from "./ramayana-searching-lanka-outline";
import { RAMAYANA_SEARCHING_LANKA_PLAYABLE_SCENES } from "./ramayana-searching-lanka-playable";

describe("Ramayana searching-Lanka playable stories", () => {
  const outlineById = new Map(RAMAYANA_SEARCHING_LANKA_SCENE_OUTLINES.map((outline) => [outline.id, outline]));

  it("partitions every Sundara section from 5 through 14 exactly once", () => {
    expect(RAMAYANA_SEARCHING_LANKA_PLAYABLE_SCENES).toHaveLength(10);
    expect(RAMAYANA_SEARCHING_LANKA_PLAYABLE_SCENES.reduce((n, scene) => n + scene.moment.beats.length, 0)).toBe(54);
    const covered = RAMAYANA_SEARCHING_LANKA_PLAYABLE_SCENES.flatMap((scene) => {
      const outline = outlineById.get(scene.id)!;
      expect(getDuttKandaSpanSha256s("sundara", outline.sourceStart, outline.sourceEnd)).toHaveLength(
        outline.sourceEnd - outline.sourceStart + 1,
      );
      return Array.from(
        { length: outline.sourceEnd - outline.sourceStart + 1 },
        (_, index) => outline.sourceStart + index,
      );
    }).sort((left, right) => left - right);
    expect(covered).toEqual([5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
  });

  it("keeps every scene navigable and every beat bilingual, visual, and substantial", () => {
    for (const scene of RAMAYANA_SEARCHING_LANKA_PLAYABLE_SCENES) {
      expect(scene.nodeIds.length, scene.id).toBeGreaterThanOrEqual(6);
      for (const beat of scene.moment.beats) {
        expect(beat.narration.en.length, beat.id).toBeGreaterThan(180);
        expect(beat.narration.hi.length, beat.id).toBeGreaterThan(150);
        expect(beat.visualCue.length, beat.id).toBeGreaterThan(70);
      }
    }
  });

  it("preserves the inhabited city, ethical tensions, crisis recovery, and unfinished search", () => {
    const english = RAMAYANA_SEARCHING_LANKA_PLAYABLE_SCENES
      .flatMap((scene) => scene.moment.beats.map((beat) => beat.narration.en))
      .join(" ");
    expect(english).toContain("physical difference into a moral map");
    expect(english).toContain("must not be merged into one story of consent");
    expect(english).toContain("Vishvakarma built Pushpaka for Brahma, Kubera obtained it through austerity, and Ravana took it");
    expect(english).toContain("The correction arises from circumstances, not from ranking one woman's beauty or worth");
    expect(english).toContain("it produces action: no false identification");
    expect(english).toContain("perseverance produces results only when it changes effort");
    expect(english).toContain("the language of acute despair, not a solution the journey endorses");
    expect(english).toContain("life leaves open the possibility of good");
    expect(english).toContain("a protected landscape he has not entered");
    expect(english).toContain("The grove's beauty does not reset behind him");
    expect(english).toContain("The turn ends with a grounded possibility—not a sighting");
  });
});

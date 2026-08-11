import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_LATER_REIGN_SCENE_OUTLINES } from "./ramayana-later-reign-outline";
import { RAMAYANA_LATER_REIGN_PLAYABLE_SCENES } from "./ramayana-later-reign-playable";

describe("Ramayana later-reign playable stories", () => {
  const outlineById = new Map(RAMAYANA_LATER_REIGN_SCENE_OUTLINES.map((outline) => [outline.id, outline]));

  it("partitions every Uttara source ordinal from 85 through 102 exactly once", () => {
    expect(RAMAYANA_LATER_REIGN_PLAYABLE_SCENES).toHaveLength(12);
    expect(RAMAYANA_LATER_REIGN_PLAYABLE_SCENES.reduce((n, item) => n + item.moment.beats.length, 0)).toBe(36);
    const covered = RAMAYANA_LATER_REIGN_PLAYABLE_SCENES.flatMap((item) => {
      const outline = outlineById.get(item.id)!;
      expect(getDuttKandaSpanSha256s("uttara", outline.sourceStart, outline.sourceEnd), item.id)
        .toHaveLength(outline.sourceEnd - outline.sourceStart + 1);
      return Array.from(
        { length: outline.sourceEnd - outline.sourceStart + 1 },
        (_, index) => outline.sourceStart + index,
      );
    }).sort((a, b) => a - b);
    expect(covered).toEqual(Array.from({ length: 18 }, (_, index) => index + 85));
  });

  it("keeps scenes navigable and beats unique, bilingual, visual, and substantial", () => {
    const beats = RAMAYANA_LATER_REIGN_PLAYABLE_SCENES.flatMap((item) => item.moment.beats);
    expect(new Set(beats.map((entry) => entry.id)).size).toBe(beats.length);
    for (const item of RAMAYANA_LATER_REIGN_PLAYABLE_SCENES) {
      expect(item.nodeIds.length, item.id).toBeGreaterThanOrEqual(8);
      for (const entry of item.moment.beats) {
        expect(entry.narration.en.length, entry.id).toBeGreaterThan(180);
        expect(entry.narration.hi.length, entry.id).toBeGreaterThan(150);
        expect(entry.visualCue.length, entry.id).toBeGreaterThan(70);
        expect(entry.narration.en, entry.id).not.toMatch(/\b(?:source|story|narrative|consumer|devam|citation|chapter|verse|interface|user|player)\b/i);
      }
    }
  });

  it("keeps caste violence, sexual violence, consent, gender, and collective harm explicit", () => {
    const english = RAMAYANA_LATER_REIGN_PLAYABLE_SCENES
      .flatMap((item) => item.moment.beats.map((entry) => entry.narration.en))
      .join(" ");
    expect(english).toContain("institutional certainty can turn inherited hierarchy into violence");
    expect(english).toContain("Divine celebration inside the episode does not oblige");
    expect(english).toContain("one household is built upon an untried stranger's death");
    expect(english).toContain("her immediate boundary is unmistakable");
    expect(english).toContain("the punishment grows far beyond the perpetrator");
    expect(english).toContain("a younger brother can stop a king");
    expect(english).toContain("not modern biology or conduct guidance");
    expect(english).toContain("The crisis concerns loss of agency and memory");
    expect(english).toContain("genuine consent in Ilā's month beside deception");
    expect(english).toContain("does not declare one gender universally superior");
  });
});

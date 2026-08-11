import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_RAVANA_FINAL_BATTLE_SCENE_OUTLINES } from "./ramayana-ravana-final-battle-outline";
import { RAMAYANA_RAVANA_FINAL_BATTLE_PLAYABLE_SCENES } from "./ramayana-ravana-final-battle-playable";

describe("Ramayana Ravana-final-battle playable stories", () => {
  const outlineById = new Map(RAMAYANA_RAVANA_FINAL_BATTLE_SCENE_OUTLINES.map((outline) => [outline.id, outline]));

  it("partitions every Yuddha source ordinal from 91 through 108 exactly once", () => {
    expect(RAMAYANA_RAVANA_FINAL_BATTLE_PLAYABLE_SCENES).toHaveLength(14);
    expect(RAMAYANA_RAVANA_FINAL_BATTLE_PLAYABLE_SCENES.reduce((n, item) => n + item.moment.beats.length, 0)).toBe(56);
    const covered = RAMAYANA_RAVANA_FINAL_BATTLE_PLAYABLE_SCENES.flatMap((item) => {
      const outline = outlineById.get(item.id)!;
      expect(getDuttKandaSpanSha256s("yuddha", outline.sourceStart, outline.sourceEnd), item.id)
        .toHaveLength(outline.sourceEnd - outline.sourceStart + 1);
      return Array.from(
        { length: outline.sourceEnd - outline.sourceStart + 1 },
        (_, index) => outline.sourceStart + index,
      );
    }).sort((left, right) => left - right);
    expect(covered).toEqual(Array.from({ length: 18 }, (_, index) => index + 91));
  });

  it("keeps every scene navigable and every beat unique, bilingual, visual, and substantial", () => {
    const beatIds = RAMAYANA_RAVANA_FINAL_BATTLE_PLAYABLE_SCENES
      .flatMap((item) => item.moment.beats.map((entry) => entry.id));
    expect(new Set(beatIds).size).toBe(beatIds.length);
    for (const item of RAMAYANA_RAVANA_FINAL_BATTLE_PLAYABLE_SCENES) {
      expect(item.nodeIds.length, item.id).toBeGreaterThanOrEqual(8);
      for (const entry of item.moment.beats) {
        expect(entry.narration.en.length, entry.id).toBeGreaterThan(180);
        expect(entry.narration.hi.length, entry.id).toBeGreaterThan(150);
        expect(entry.visualCue.length, entry.id).toBeGreaterThan(70);
        expect(entry.narration.en, entry.id).not.toMatch(/\b(?:source|story|narrative|consumer|devam|citation|chapter|verse|interface|user|player)\b/i);
      }
    }
  });

  it("preserves captivity, civilian diagnosis, restraint, care, skilled support, and survivors", () => {
    const english = RAMAYANA_RAVANA_FINAL_BATTLE_PLAYABLE_SCENES
      .flatMap((item) => item.moment.beats.map((entry) => entry.narration.en)).join(" ");
    expect(english).toContain("Captivity denies her reliable information");
    expect(english).toContain("ordinary residents reasoning about leadership, consequence, and refuge");
    expect(english).toContain("helplessness creates a boundary");
    expect(english).toContain("replaces an unverified conclusion with a care decision");
    expect(english).toContain("driver, fighter, horses, and tools");
    expect(english).toContain("skilled care preserved the fight");
    expect(english).toContain("not a transferable guarantee");
    expect(english).toContain("persistence alone cannot substitute for understanding");
    expect(english).toContain("ends command and the immediate contest, but it does not make the people around him vanish");
  });
});

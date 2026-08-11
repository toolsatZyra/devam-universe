import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_KUMBHAKARNA_RISES_SCENE_OUTLINES } from "./ramayana-kumbhakarna-rises-outline";
import { RAMAYANA_KUMBHAKARNA_RISES_PLAYABLE_SCENES } from "./ramayana-kumbhakarna-rises-playable";

describe("Ramayana Kumbhakarna-rises playable stories", () => {
  const outlineById = new Map(RAMAYANA_KUMBHAKARNA_RISES_SCENE_OUTLINES.map((outline) => [outline.id, outline]));

  it("partitions every Yuddha source ordinal from 45 through 69 exactly once", () => {
    expect(RAMAYANA_KUMBHAKARNA_RISES_PLAYABLE_SCENES).toHaveLength(15);
    expect(RAMAYANA_KUMBHAKARNA_RISES_PLAYABLE_SCENES.reduce((n, item) => n + item.moment.beats.length, 0)).toBe(60);
    const covered = RAMAYANA_KUMBHAKARNA_RISES_PLAYABLE_SCENES.flatMap((item) => {
      const outline = outlineById.get(item.id)!;
      expect(getDuttKandaSpanSha256s("yuddha", outline.sourceStart, outline.sourceEnd), item.id)
        .toHaveLength(outline.sourceEnd - outline.sourceStart + 1);
      return Array.from(
        { length: outline.sourceEnd - outline.sourceStart + 1 },
        (_, index) => outline.sourceStart + index,
      );
    }).sort((left, right) => left - right);
    expect(covered).toEqual(Array.from({ length: 25 }, (_, index) => index + 45));
  });

  it("keeps every scene navigable and every beat bilingual, visual, and substantial", () => {
    const beatIds = RAMAYANA_KUMBHAKARNA_RISES_PLAYABLE_SCENES
      .flatMap((item) => item.moment.beats.map((entry) => entry.id));
    expect(new Set(beatIds).size).toBe(beatIds.length);
    for (const item of RAMAYANA_KUMBHAKARNA_RISES_PLAYABLE_SCENES) {
      expect(item.nodeIds.length, item.id).toBeGreaterThanOrEqual(8);
      for (const entry of item.moment.beats) {
        expect(entry.narration.en.length, entry.id).toBeGreaterThan(180);
        expect(entry.narration.hi.length, entry.id).toBeGreaterThan(150);
        expect(entry.visualCue.length, entry.id).toBeGreaterThan(70);
        expect(entry.narration.en, entry.id).not.toMatch(/\b(?:source|story|narrative|consumer|devam|citation|chapter|verse|interface|user|player)\b/i);
      }
    }
  });

  it("preserves grief, agency, civilian distinction, uncertainty, and the danger of loyal service", () => {
    const english = RAMAYANA_KUMBHAKARNA_RISES_PLAYABLE_SCENES
      .flatMap((item) => item.moment.beats.map((entry) => entry.narration.en)).join(" ");
    expect(english).toContain("tears are not a lapse in heroism");
    expect(english).toContain("observable details");
    expect(english).toContain("reveal acute distress and self-blame");
    expect(english).toContain("cannot make every inhabitant deceitful");
    expect(english).toContain("power without reliable perception");
    expect(english).toContain("Loyalty here is a tragic mechanism");
    expect(english).toContain("moral awareness");
    expect(english).toContain("balances urgent care with another person's agency");
    expect(english).toContain("Sincerity, however, does not cancel the coercion");
    expect(english).toContain("without false precision");
  });
});

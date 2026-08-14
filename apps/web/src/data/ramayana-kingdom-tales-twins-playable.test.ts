import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_KINGDOM_TALES_TWINS_SCENE_OUTLINES } from "./ramayana-kingdom-tales-twins-outline";
import { RAMAYANA_KINGDOM_TALES_TWINS_PLAYABLE_SCENES } from "./ramayana-kingdom-tales-twins-playable";

describe("Ramayana kingdom-tales-and-twins playable stories", () => {
  const outlineById = new Map(RAMAYANA_KINGDOM_TALES_TWINS_SCENE_OUTLINES.map((outline) => [outline.id, outline]));

  it("partitions every Uttara source ordinal from 62 through 84 exactly once", () => {
    expect(RAMAYANA_KINGDOM_TALES_TWINS_PLAYABLE_SCENES).toHaveLength(12);
    expect(RAMAYANA_KINGDOM_TALES_TWINS_PLAYABLE_SCENES.reduce((n, item) => n + item.moment.beats.length, 0)).toBe(36);
    const covered = RAMAYANA_KINGDOM_TALES_TWINS_PLAYABLE_SCENES.flatMap((item) => {
      const outline = outlineById.get(item.id)!;
      expect(getDuttKandaSpanSha256s("uttara", outline.sourceStart, outline.sourceEnd), item.id)
        .toHaveLength(outline.sourceEnd - outline.sourceStart + 1);
      return Array.from(
        { length: outline.sourceEnd - outline.sourceStart + 1 },
        (_, index) => outline.sourceStart + index,
      );
    }).sort((a, b) => a - b);
    expect(covered).toEqual(Array.from({ length: 23 }, (_, index) => index + 62));
  });

  it("keeps scenes navigable and beats unique, bilingual, visual, and substantial", () => {
    const beats = RAMAYANA_KINGDOM_TALES_TWINS_PLAYABLE_SCENES.flatMap((item) => item.moment.beats);
    expect(new Set(beats.map((entry) => entry.id)).size).toBe(beats.length);
    for (const item of RAMAYANA_KINGDOM_TALES_TWINS_PLAYABLE_SCENES) {
      expect(item.nodeIds.length, item.id).toBeGreaterThanOrEqual(8);
      for (const entry of item.moment.beats) {
        expect(entry.narration.en.length, entry.id).toBeGreaterThan(180);
        expect(entry.narration.hi.length, entry.id).toBeGreaterThan(150);
        expect(entry.visualCue.length, entry.id).toBeGreaterThan(70);
        expect(entry.narration.en, entry.id).not.toMatch(/\b(?:source|story|narrative|consumer|devam|citation|chapter|verse|interface|user|player)\b/i);
      }
    }
  });

  it("keeps access, coercion, birth, performance, and civic rebuilding distinct", () => {
    const english = RAMAYANA_KINGDOM_TALES_TWINS_PLAYABLE_SCENES
      .flatMap((item) => item.moment.beats.map((entry) => entry.narration.en))
      .join(" ");
    expect(english).toContain("the lesson concerns access and repair");
    expect(english).toContain("cannot be treated as freely negotiable");
    expect(english).toContain("An apparently empty queue was not an absence of need");
    expect(english).toContain("The birth belongs first to Sita, the newborns, and their care community");
    expect(english).toContain("not a required modern newborn procedure");
    expect(english).toContain("The meaningful end is not Lavana's body but ordinary life returning");
    expect(english).toContain("Recognition will come later through the twins' own voices");
  });
});

import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_INDRAJIT_LAST_WAR_SCENE_OUTLINES } from "./ramayana-indrajit-last-war-outline";
import { RAMAYANA_INDRAJIT_LAST_WAR_PLAYABLE_SCENES } from "./ramayana-indrajit-last-war-playable";

describe("Ramayana Indrajit-last-war playable stories", () => {
  const outlineById = new Map(RAMAYANA_INDRAJIT_LAST_WAR_SCENE_OUTLINES.map((outline) => [outline.id, outline]));

  it("partitions every Yuddha source ordinal from 70 through 90 exactly once", () => {
    expect(RAMAYANA_INDRAJIT_LAST_WAR_PLAYABLE_SCENES).toHaveLength(14);
    expect(RAMAYANA_INDRAJIT_LAST_WAR_PLAYABLE_SCENES.reduce((n, item) => n + item.moment.beats.length, 0)).toBe(56);
    const covered = RAMAYANA_INDRAJIT_LAST_WAR_PLAYABLE_SCENES.flatMap((item) => {
      const outline = outlineById.get(item.id)!;
      expect(getDuttKandaSpanSha256s("yuddha", outline.sourceStart, outline.sourceEnd), item.id)
        .toHaveLength(outline.sourceEnd - outline.sourceStart + 1);
      return Array.from(
        { length: outline.sourceEnd - outline.sourceStart + 1 },
        (_, index) => outline.sourceStart + index,
      );
    }).sort((left, right) => left - right);
    expect(covered).toEqual(Array.from({ length: 21 }, (_, index) => index + 70));
  });

  it("keeps every scene navigable and every beat unique, bilingual, visual, and substantial", () => {
    const beatIds = RAMAYANA_INDRAJIT_LAST_WAR_PLAYABLE_SCENES
      .flatMap((item) => item.moment.beats.map((entry) => entry.id));
    expect(new Set(beatIds).size).toBe(beatIds.length);
    for (const item of RAMAYANA_INDRAJIT_LAST_WAR_PLAYABLE_SCENES) {
      expect(item.nodeIds.length, item.id).toBeGreaterThanOrEqual(8);
      for (const entry of item.moment.beats) {
        expect(entry.narration.en.length, entry.id).toBeGreaterThan(180);
        expect(entry.narration.hi.length, entry.id).toBeGreaterThan(150);
        expect(entry.visualCue.length, entry.id).toBeGreaterThan(70);
        expect(entry.narration.en, entry.id).not.toMatch(/\b(?:source|story|narrative|consumer|devam|citation|chapter|verse|interface|user|player)\b/i);
      }
    }
  });

  it("preserves civilian distinction, epistemic care, grief, moral conflict, and shared recovery", () => {
    const english = RAMAYANA_INDRAJIT_LAST_WAR_PLAYABLE_SCENES
      .flatMap((item) => item.moment.beats.map((entry) => entry.narration.en)).join(" ");
    expect(english).toContain("access determine who is reached by care");
    expect(english).toContain("These residents cannot be folded into the word enemy");
    expect(english).toContain("closes legitimate retreat");
    expect(english).toContain("Frustration cannot make collective identity a valid target");
    expect(english).toContain("Deception succeeds by borrowing verified memory");
    expect(english).toContain("acute anger seeking action, not a humane plan");
    expect(english).toContain("prevents a confident alternative from appearing without an evidentiary path");
    expect(english).toContain("Moral separation here costs belonging and affection");
    expect(english).toContain("The death ends a tactical threat and a son's life at once");
    expect(english).toContain("making care the final movement of the arc");
  });
});

import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_NEWS_REACHES_RAMA_SCENE_OUTLINES } from "./ramayana-news-reaches-rama-outline";
import { RAMAYANA_NEWS_REACHES_RAMA_PLAYABLE_SCENES } from "./ramayana-news-reaches-rama-playable";

describe("Ramayana news-reaches-Rama playable stories", () => {
  const outlineById = new Map(RAMAYANA_NEWS_REACHES_RAMA_SCENE_OUTLINES.map((outline) => [outline.id, outline]));

  it("partitions every Sundara source ordinal from 61 through 66 exactly once", () => {
    expect(RAMAYANA_NEWS_REACHES_RAMA_PLAYABLE_SCENES).toHaveLength(6);
    expect(RAMAYANA_NEWS_REACHES_RAMA_PLAYABLE_SCENES.reduce((n, scene) => n + scene.moment.beats.length, 0)).toBe(40);
    const covered = RAMAYANA_NEWS_REACHES_RAMA_PLAYABLE_SCENES.flatMap((scene) => {
      const outline = outlineById.get(scene.id)!;
      expect(getDuttKandaSpanSha256s("sundara", outline.sourceStart, outline.sourceEnd)).toHaveLength(1);
      return [outline.sourceStart];
    }).sort((left, right) => left - right);
    expect(covered).toEqual([61, 62, 63, 64, 65, 66]);
  });

  it("keeps every scene navigable and every beat bilingual, visual, and substantial", () => {
    for (const scene of RAMAYANA_NEWS_REACHES_RAMA_PLAYABLE_SCENES) {
      expect(scene.nodeIds.length, scene.id).toBeGreaterThanOrEqual(8);
      for (const beat of scene.moment.beats) {
        expect(beat.narration.en.length, beat.id).toBeGreaterThan(180);
        expect(beat.narration.hi.length, beat.id).toBeGreaterThan(150);
        expect(beat.visualCue.length, beat.id).toBeGreaterThan(70);
        expect(beat.narration.en, beat.id).not.toMatch(/\b(?:source|story|narrative|consumer|devam|citation|chapter|verse|interface|user|player)\b/i);
      }
    }
  });

  it("keeps misconduct, inference, Sita's voice, grief, and rescue conditions distinct", () => {
    const english = RAMAYANA_NEWS_REACHES_RAMA_PLAYABLE_SCENES
      .flatMap((scene) => scene.moment.beats.map((beat) => beat.narration.en)).join(" ");
    expect(english).toContain("achievement in one task is treated as unlimited authority");
    expect(english).toContain("injured workers and the failed attempt to restrain the crowd");
    expect(english).toContain("Pardon changes punishment; it does not make the injuries imaginary");
    expect(english).toContain("The confirmation opens urgent questions; it does not yet complete rescue");
    expect(english).toContain("Confidence grew through reciprocal checks");
    expect(english).toContain("The object authenticates the route and message");
    expect(english).toContain("That inward blame is a symptom of distress, not a true verdict");
    expect(english).toContain("That past violation does not remove her authority");
    expect(english).toContain("a stealth removal would repeat the hidden pattern of her abduction");
  });
});

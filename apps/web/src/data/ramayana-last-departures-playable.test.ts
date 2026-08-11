import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_LAST_DEPARTURES_SCENE_OUTLINES } from "./ramayana-last-departures-outline";
import { RAMAYANA_LAST_DEPARTURES_PLAYABLE_SCENES } from "./ramayana-last-departures-playable";

describe("Ramayana last-departures playable stories", () => {
  const outlineById = new Map(RAMAYANA_LAST_DEPARTURES_SCENE_OUTLINES.map((outline) => [outline.id, outline]));

  it("partitions every final Uttara source ordinal from 111 through 123 exactly once", () => {
    expect(RAMAYANA_LAST_DEPARTURES_PLAYABLE_SCENES).toHaveLength(13);
    expect(RAMAYANA_LAST_DEPARTURES_PLAYABLE_SCENES.reduce((n, item) => n + item.moment.beats.length, 0)).toBe(39);
    const covered = RAMAYANA_LAST_DEPARTURES_PLAYABLE_SCENES.flatMap((item) => {
      const outline = outlineById.get(item.id)!;
      expect(outline, item.id).toBeDefined();
      expect(getDuttKandaSpanSha256s("uttara", outline.sourceStart, outline.sourceEnd), item.id)
        .toHaveLength(outline.sourceEnd - outline.sourceStart + 1);
      return Array.from(
        { length: outline.sourceEnd - outline.sourceStart + 1 },
        (_, index) => outline.sourceStart + index,
      );
    }).sort((a, b) => a - b);
    expect(covered).toEqual(Array.from({ length: 13 }, (_, index) => index + 111));
  });

  it("keeps scenes navigable and beats unique, bilingual, visual, and substantial", () => {
    const beats = RAMAYANA_LAST_DEPARTURES_PLAYABLE_SCENES.flatMap((item) => item.moment.beats);
    expect(new Set(RAMAYANA_LAST_DEPARTURES_PLAYABLE_SCENES.map((item) => item.id)).size).toBe(13);
    expect(new Set(beats.map((entry) => entry.id)).size).toBe(beats.length);
    for (const item of RAMAYANA_LAST_DEPARTURES_PLAYABLE_SCENES) {
      expect(item.nodeIds.length, item.id).toBeGreaterThanOrEqual(8);
      for (const entry of item.moment.beats) {
        expect(entry.narration.en.length, entry.id).toBeGreaterThan(180);
        expect(entry.narration.hi.length, entry.id).toBeGreaterThan(150);
        expect(entry.visualCue.length, entry.id).toBeGreaterThan(70);
        expect(entry.narration.en, entry.id).not.toMatch(/\b(?:source|story|narrative|consumer|devam|citation|chapter|verse|interface|user|player)\b/i);
      }
    }
  });

  it("does not romanticize conquest, coerced sacrifice, abandonment, or collective death", () => {
    const english = RAMAYANA_LAST_DEPARTURES_PLAYABLE_SCENES
      .flatMap((item) => item.moment.beats.map((entry) => entry.narration.en))
      .join(" ");
    expect(english).toContain("astonishment is not moral approval");
    expect(english).toContain("rules made by more powerful men");
    expect(english).toContain("does not make abandonment or self-ending a safe answer");
    expect(english).toContain("devotion, social pressure, and grief complicate consent");
    expect(english).toContain("equally honoured forms of devotion");
    expect(english).toContain("collective death remains an ending to witness");
    expect(english).toContain("not guaranteed medical, financial, reproductive, or moral outcomes");
  });
});

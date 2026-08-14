import { describe, expect, it } from "vitest";
import { RAMAYANA_ROAD_HOME_BEAT_DEPTH } from "./ramayana-road-home-depth";
import { getRamayanaDistrictMoments } from "./ramayana-story-world";

describe("Ramayana road-home consumer depth", () => {
  const moments = getRamayanaDistrictMoments("road-home-v1")!;
  const beats = Object.values(moments).flatMap((moment) => moment.beats);

  it("deepens every existing beat without duplicating the seven-scene route", () => {
    expect(Object.keys(moments)).toHaveLength(7);
    expect(beats).toHaveLength(29);
    expect(Object.keys(RAMAYANA_ROAD_HOME_BEAT_DEPTH)).toHaveLength(29);
    expect(new Set(beats.map((beat) => beat.id)).size).toBe(29);
  });

  it("keeps every beat bilingual, visual, and substantial", () => {
    for (const beat of beats) {
      expect(beat.narration.en.length, beat.id).toBeGreaterThan(180);
      expect(beat.narration.hi.length, beat.id).toBeGreaterThan(150);
      expect(beat.visualCue.length, beat.id).toBeGreaterThan(45);
    }
  });

  it("keeps editorial and source apparatus out of the journey copy", () => {
    const copy = beats.flatMap((beat) => [beat.narration.en, beat.narration.hi]).join(" ");
    expect(copy).not.toMatch(/\b(?:citation|source|chapter|verse|interface|consumer|Devam)\b/i);
  });
});

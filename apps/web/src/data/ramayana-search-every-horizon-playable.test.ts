import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_SEARCH_EVERY_HORIZON_SCENE_OUTLINES } from "./ramayana-search-every-horizon-outline";
import { RAMAYANA_SEARCH_EVERY_HORIZON_PLAYABLE_SCENES } from "./ramayana-search-every-horizon-playable";

describe("Ramayana search-every-horizon playable stories", () => {
  const outlineById = new Map(RAMAYANA_SEARCH_EVERY_HORIZON_SCENE_OUTLINES.map((outline) => [outline.id, outline]));

  it("partitions every Kishkindha section from 40 through 49 exactly once", () => {
    expect(RAMAYANA_SEARCH_EVERY_HORIZON_PLAYABLE_SCENES).toHaveLength(10);
    expect(RAMAYANA_SEARCH_EVERY_HORIZON_PLAYABLE_SCENES.reduce((n, scene) => n + scene.moment.beats.length, 0)).toBe(40);
    const covered = RAMAYANA_SEARCH_EVERY_HORIZON_PLAYABLE_SCENES.flatMap((scene) => {
      const outline = outlineById.get(scene.id)!;
      expect(getDuttKandaSpanSha256s("kishkindha", outline.sourceStart, outline.sourceEnd)).toHaveLength(outline.sourceEnd - outline.sourceStart + 1);
      return Array.from({ length: outline.sourceEnd - outline.sourceStart + 1 }, (_, i) => outline.sourceStart + i);
    });
    expect(covered).toEqual(Array.from({ length: 10 }, (_, i) => i + 40));
  });

  it("keeps every scene navigable and every beat bilingual, visual, and substantial", () => {
    for (const scene of RAMAYANA_SEARCH_EVERY_HORIZON_PLAYABLE_SCENES) {
      expect(scene.nodeIds.length, scene.id).toBeGreaterThanOrEqual(4);
      for (const beat of scene.moment.beats) {
        expect(beat.narration.en.length, beat.id).toBeGreaterThan(180);
        expect(beat.narration.hi.length, beat.id).toBeGreaterThan(150);
        expect(beat.visualCue.length, beat.id).toBeGreaterThan(70);
      }
    }
  });

  it("keeps verification, bounded cosmography, the ring, honest empty returns, and the southern false lead distinct", () => {
    const english = RAMAYANA_SEARCH_EVERY_HORIZON_PLAYABLE_SCENES
      .flatMap((scene) => scene.moment.beats.map((beat) => beat.narration.en))
      .join(" ");
    expect(english).toContain("whether Sita is alive and where Ravana lives");
    expect(english).toContain("sunless, unbounded region he will not pretend to understand");
    expect(english).toContain("ring inscribed with his name");
    expect(english).toContain("neither claims a doubtful footprint as Sita");
    expect(english).toContain("identity was assumed under pressure");
  });
});

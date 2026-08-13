import { describe, expect, it } from "vitest";
import { RAMAYANA_COSMIC_CONQUESTS_LIBRARY_SCENES } from "./ramayana-cosmic-conquests-library-scenes";

describe("Ramayana cosmic-conquests library scenes", () => {
  it("replaces Uttara 23-28 with one exact non-overlapping scene per source unit", () => {
    expect(RAMAYANA_COSMIC_CONQUESTS_LIBRARY_SCENES).toHaveLength(6);
    expect(RAMAYANA_COSMIC_CONQUESTS_LIBRARY_SCENES.map((scene) => [scene.sourceStart, scene.sourceEnd])).toEqual([
      [23, 23],
      [24, 24],
      [25, 25],
      [26, 26],
      [27, 27],
      [28, 28],
    ]);
    expect(RAMAYANA_COSMIC_CONQUESTS_LIBRARY_SCENES.every((scene) =>
      scene.spanSha256s.length === 1 && /^[0-9a-f]{64}$/.test(scene.spanSha256s[0])
    )).toBe(true);
  });

  it("carries substantial unique bilingual story beats", () => {
    const beats = RAMAYANA_COSMIC_CONQUESTS_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats);
    expect(beats).toHaveLength(33);
    expect(new Set(beats.map((beat) => beat.id)).size).toBe(beats.length);
    expect(RAMAYANA_COSMIC_CONQUESTS_LIBRARY_SCENES.every((scene) => scene.moment.beats.length >= 4)).toBe(true);
    expect(beats.every((beat) => beat.narration.en.length > 100 && beat.narration.hi.length > 90)).toBe(true);
  });

  it("keeps the distinct rulers, family consequence, and consent boundary in the story", () => {
    const byId = new Map(RAMAYANA_COSMIC_CONQUESTS_LIBRARY_SCENES.map((scene) => [scene.id, scene]));
    expect(byId.get("stalemate-friendship-and-varunas-absent-court")?.moment.beats.map((beat) => beat.id)).toEqual(expect.arrayContaining([
      "the-next-victory-kills-a-brother-in-law",
      "an-absent-king-becomes-a-victory-claim",
    ]));
    expect(byId.get("mandhata-meets-ravana-between-worlds")?.moment.beats.map((beat) => beat.characterIds)).toEqual(expect.arrayContaining([
      expect.arrayContaining(["mandhata", "ravana"]),
    ]));
    expect(byId.get("the-western-island-reveals-a-cosmic-being")?.moment.beats
      .find((beat) => beat.id === "desire-crosses-another-boundary-near-lakshmi")?.narration.en).toContain("without consent");
  });
});

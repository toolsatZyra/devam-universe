import { describe, expect, it } from "vitest";
import { getDuttBalaSpanSha256s } from "./ramayana-bala-source-spans";
import { RAMAYANA_SAGARA_GANGA_LIBRARY_SCENES } from "./ramayana-sagara-ganga-library-scenes";

describe("Ramayana Sagara-to-Ganga library scenes", () => {
  it("replaces Bala 37-42 with one exact non-overlapping scene per source unit", () => {
    expect(RAMAYANA_SAGARA_GANGA_LIBRARY_SCENES).toHaveLength(6);
    expect(RAMAYANA_SAGARA_GANGA_LIBRARY_SCENES.map((scene) => [scene.sourceStart, scene.sourceEnd])).toEqual(
      Array.from({ length: 6 }, (_, index) => [index + 37, index + 37]),
    );
    for (const scene of RAMAYANA_SAGARA_GANGA_LIBRARY_SCENES) {
      expect(scene.spanSha256s).toEqual(getDuttBalaSpanSha256s(scene.sourceStart, scene.sourceEnd));
    }
  });

  it("carries substantial unique bilingual story beats", () => {
    const beats = RAMAYANA_SAGARA_GANGA_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats);
    expect(beats).toHaveLength(28);
    expect(new Set(beats.map((beat) => beat.id)).size).toBe(beats.length);
    expect(beats.every((beat) => beat.narration.en.length > 150 && beat.narration.hi.length > 120)).toBe(true);
  });

  it("preserves harm, inherited responsibility, and the non-instructional austerity boundary", () => {
    const text = RAMAYANA_SAGARA_GANGA_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats)
      .map((beat) => beat.narration.en).join(" ");
    expect(text).toContain("killing serpents, aquatic beings");
    expect(text).toContain("not practical instruction for a modern reader");
    expect(text).not.toContain("Ganga's consent");
    expect(text).toContain("do not make Bhagiratha the owner of the river");
  });
});

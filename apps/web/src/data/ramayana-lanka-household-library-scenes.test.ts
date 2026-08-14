import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_LANKA_HOUSEHOLD_LIBRARY_SCENES } from "./ramayana-lanka-household-library-scenes";

describe("Ramayana Lanka-household library scenes", () => {
  it("replaces Uttara 11-13 with one exact non-overlapping scene per source unit", () => {
    expect(RAMAYANA_LANKA_HOUSEHOLD_LIBRARY_SCENES).toHaveLength(3);
    expect(RAMAYANA_LANKA_HOUSEHOLD_LIBRARY_SCENES.map((scene) => [scene.sourceStart, scene.sourceEnd])).toEqual([
      [11, 11], [12, 12], [13, 13],
    ]);
    for (const scene of RAMAYANA_LANKA_HOUSEHOLD_LIBRARY_SCENES) {
      expect(scene.spanSha256s).toEqual(getDuttKandaSpanSha256s("uttara", scene.sourceStart, scene.sourceEnd));
    }
  });

  it("carries substantial unique bilingual story beats", () => {
    const beats = RAMAYANA_LANKA_HOUSEHOLD_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats);
    expect(beats).toHaveLength(15);
    expect(new Set(beats.map((beat) => beat.id)).size).toBe(beats.length);
    expect(beats.every((beat) => beat.narration.en.length > 150 && beat.narration.hi.length > 120)).toBe(true);
  });

  it("keeps displacement, absent perspectives, responsibility, non-instruction, and messenger violence explicit", () => {
    const text = RAMAYANA_LANKA_HOUSEHOLD_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats)
      .map((beat) => beat.narration.en).join(" ");
    expect(text).toContain("a household's strategic withdrawal, not a harmless transfer");
    expect(text).toContain("without inventing consent, romance, or a private conversation");
    expect(text).toContain("a newborn's cry is not guilt");
    expect(text).toContain("not laziness, a moral diagnosis, or health guidance");
    expect(text).toContain("an envoy carrying correction is murdered because the message wounds royal pride");
  });
});

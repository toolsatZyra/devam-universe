import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_YAMA_INVASION_LIBRARY_SCENES } from "./ramayana-yama-invasion-library-scenes";

describe("Ramayana Yama-invasion library scenes", () => {
  it("replaces Uttara 20-22 with one exact non-overlapping scene per source unit", () => {
    expect(RAMAYANA_YAMA_INVASION_LIBRARY_SCENES).toHaveLength(3);
    expect(RAMAYANA_YAMA_INVASION_LIBRARY_SCENES.map((scene) => [scene.sourceStart, scene.sourceEnd])).toEqual([
      [20, 20], [21, 21], [22, 22],
    ]);
    for (const scene of RAMAYANA_YAMA_INVASION_LIBRARY_SCENES) {
      expect(scene.spanSha256s).toEqual(getDuttKandaSpanSha256s("uttara", scene.sourceStart, scene.sourceEnd));
    }
  });

  it("carries substantial unique bilingual story beats", () => {
    const beats = RAMAYANA_YAMA_INVASION_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats);
    expect(beats).toHaveLength(15);
    expect(new Set(beats.map((beat) => beat.id)).size).toBe(beats.length);
    expect(beats.every((beat) => beat.narration.en.length > 150 && beat.narration.hi.length > 120)).toBe(true);
  });

  it("keeps mortal vulnerability, punishment, release, death, and false-victory claims bounded", () => {
    const text = RAMAYANA_YAMA_INVASION_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats)
      .map((beat) => beat.narration.en).join(" ");
    expect(text).toContain("recognises ordinary vulnerability");
    expect(text).toContain("not modern legal or correctional guidance");
    expect(text).toContain("A liberating effect and an imperial motive coexist without becoming identical");
    expect(text).toContain("not a threat or prediction directed at the user");
    expect(text).toContain("constrained by Brahma's prior promise rather than conquered");
  });
});

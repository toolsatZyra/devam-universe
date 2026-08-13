import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_GRIEF_SEARCH_LIBRARY_SCENES } from "./ramayana-grief-search-library-scenes";

describe("Ramayana grief-search library scenes", () => {
  it("replaces Aranya 60-64 with one exact non-overlapping scene per source unit", () => {
    expect(RAMAYANA_GRIEF_SEARCH_LIBRARY_SCENES).toHaveLength(5);
    expect(RAMAYANA_GRIEF_SEARCH_LIBRARY_SCENES.map((scene) => [scene.sourceStart, scene.sourceEnd])).toEqual(
      Array.from({ length: 5 }, (_, index) => [index + 60, index + 60]),
    );
    for (const scene of RAMAYANA_GRIEF_SEARCH_LIBRARY_SCENES) {
      expect(scene.spanSha256s).toEqual(getDuttKandaSpanSha256s("aranya", scene.sourceStart, scene.sourceEnd));
    }
  });

  it("carries substantial unique bilingual story beats", () => {
    const beats = RAMAYANA_GRIEF_SEARCH_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats);
    expect(beats).toHaveLength(20);
    expect(new Set(beats.map((beat) => beat.id)).size).toBe(beats.length);
    expect(beats.every((beat) => beat.narration.en.length > 150 && beat.narration.hi.length > 120)).toBe(true);
  });

  it("keeps imagined outcomes, acute grief, evidence, and collective punishment bounded", () => {
    const text = RAMAYANA_GRIEF_SEARCH_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats)
      .map((beat) => beat.narration.en).join(" ");
    expect(text).toContain("not proof that suffering measures guilt");
    expect(text).toContain("not an instruction or ideal response to loss");
    expect(text).toContain("do not yet identify every participant or Sita's fate");
    expect(text).toContain("an unjust escalation toward collective punishment");
    expect(text).toContain("the next source units show Lakshmana resisting it");
  });
});

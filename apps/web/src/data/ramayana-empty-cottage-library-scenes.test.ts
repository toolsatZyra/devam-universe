import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_EMPTY_COTTAGE_LIBRARY_SCENES } from "./ramayana-empty-cottage-library-scenes";

describe("Ramayana empty-cottage library scenes", () => {
  it("replaces Aranya 57-59 with one exact non-overlapping scene per source unit", () => {
    expect(RAMAYANA_EMPTY_COTTAGE_LIBRARY_SCENES).toHaveLength(3);
    expect(RAMAYANA_EMPTY_COTTAGE_LIBRARY_SCENES.map((scene) => [scene.sourceStart, scene.sourceEnd])).toEqual([
      [57, 57], [58, 58], [59, 59],
    ]);
    for (const scene of RAMAYANA_EMPTY_COTTAGE_LIBRARY_SCENES) {
      expect(scene.spanSha256s).toEqual(getDuttKandaSpanSha256s("aranya", scene.sourceStart, scene.sourceEnd));
    }
  });

  it("carries substantial unique bilingual story beats", () => {
    const beats = RAMAYANA_EMPTY_COTTAGE_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats);
    expect(beats).toHaveLength(12);
    expect(new Set(beats.map((beat) => beat.id)).size).toBe(beats.length);
    expect(beats.every((beat) => beat.narration.en.length > 150 && beat.narration.hi.length > 120)).toBe(true);
  });

  it("keeps omens, catastrophic projections, accusations, and the empty cottage evidentially bounded", () => {
    const text = RAMAYANA_EMPTY_COTTAGE_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats)
      .map((beat) => beat.narration.en).join(" ");
    expect(text).toContain("interpretation while the actual evidence remains limited");
    expect(text).toContain("catastrophic projections made under terror, not completed outcomes");
    expect(text).toContain("they are not established truths about Lakshmana or Bharata");
    expect(text).toContain("confirms that she is gone from the cottage");
  });
});

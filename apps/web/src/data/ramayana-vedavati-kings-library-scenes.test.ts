import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_VEDAVATI_KINGS_LIBRARY_SCENES } from "./ramayana-vedavati-kings-library-scenes";

describe("Ramayana Vedavati-and-kings library scenes", () => {
  it("replaces Uttara 17-19 with one exact non-overlapping scene per source unit", () => {
    expect(RAMAYANA_VEDAVATI_KINGS_LIBRARY_SCENES).toHaveLength(3);
    expect(RAMAYANA_VEDAVATI_KINGS_LIBRARY_SCENES.map((scene) => [scene.sourceStart, scene.sourceEnd])).toEqual([
      [17, 17], [18, 18], [19, 19],
    ]);
    for (const scene of RAMAYANA_VEDAVATI_KINGS_LIBRARY_SCENES) {
      expect(scene.spanSha256s).toEqual(getDuttKandaSpanSha256s("uttara", scene.sourceStart, scene.sourceEnd));
    }
  });

  it("carries substantial unique bilingual story beats", () => {
    const beats = RAMAYANA_VEDAVATI_KINGS_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats);
    expect(beats).toHaveLength(15);
    expect(new Set(beats.map((beat) => beat.id)).size).toBe(beats.length);
    expect(beats.every((beat) => beat.narration.en.length > 150 && beat.narration.hi.length > 120)).toBe(true);
  });

  it("preserves consent, non-instruction, noncombatant, coerced-submission, and prophecy boundaries", () => {
    const text = RAMAYANA_VEDAVATI_KINGS_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats)
      .map((beat) => beat.narration.en).join(" ");
    expect(text).toContain("Her hospitality and explanation do not create romantic interest or permission");
    expect(text).toContain("not presented as a modern duty, remedy, or practice");
    expect(text).toContain("people who were not combatants");
    expect(text).toContain("does not prove admiration or legitimate consent");
    expect(text).toContain("Ravana still leaves free to ignore another warning");
  });
});

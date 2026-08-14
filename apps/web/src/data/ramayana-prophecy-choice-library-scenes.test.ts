import { describe, expect, it } from "vitest";
import { RAMAYANA_PROPHECY_CHOICE_LIBRARY_SCENES } from "./ramayana-prophecy-choice-library-scenes";

describe("Ramayana prophecy and choice library scenes", () => {
  it("replaces Uttara 43-45 with exact, non-overlapping source-unit scenes", () => {
    expect(RAMAYANA_PROPHECY_CHOICE_LIBRARY_SCENES.map((scene) => [scene.sourceStart, scene.sourceEnd])).toEqual([[43, 43], [44, 44], [45, 45]]);
    expect(RAMAYANA_PROPHECY_CHOICE_LIBRARY_SCENES.every((scene) => scene.spanSha256s.length === 1 && /^[0-9a-f]{64}$/.test(scene.spanSha256s[0]))).toBe(true);
  });

  it("carries fifteen substantial unique bilingual beats", () => {
    const beats = RAMAYANA_PROPHECY_CHOICE_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats);
    expect(beats).toHaveLength(15);
    expect(new Set(beats.map((beat) => beat.id)).size).toBe(15);
    expect(beats.every((beat) => beat.narration.en.length > 150 && beat.narration.hi.length > 130)).toBe(true);
  });

  it("keeps attributed theology distinct from inevitability, consent, and ritual guarantees", () => {
    const english = RAMAYANA_PROPHECY_CHOICE_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats).map((beat) => beat.narration.en).join(" ");
    expect(english).toContain("is not proof that abduction was inevitable");
    expect(english).toContain("future victims consented to serve his plan");
    expect(english).toContain("does not give Ravana authority over her body, movement, or consent");
    expect(english).toContain("not converted into guaranteed fertility");
  });

  it("keeps the later Swetadvipa episode outside the repaired source span", () => {
    const firstFourteen = RAMAYANA_PROPHECY_CHOICE_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats).slice(0, -1).map((beat) => beat.narration.en).join(" ");
    expect(firstFourteen).not.toContain("Swetadvipa");
    expect(RAMAYANA_PROPHECY_CHOICE_LIBRARY_SCENES.at(-1)?.moment.beats.at(-1)?.characterIds).toContain("next-unit-swetadvipa");
  });
});

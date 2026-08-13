import { describe, expect, it } from "vitest";
import { RAMAYANA_KARTAVIRYA_CAPTURE_LIBRARY_SCENES } from "./ramayana-kartavirya-capture-library-scenes";

describe("Ramayana Kartavirya capture library scenes", () => {
  it("replaces Uttara 36-38 with exact, non-overlapping source-unit scenes", () => {
    expect(RAMAYANA_KARTAVIRYA_CAPTURE_LIBRARY_SCENES.map((scene) => [scene.sourceStart, scene.sourceEnd])).toEqual([[36, 36], [37, 37], [38, 38]]);
    expect(RAMAYANA_KARTAVIRYA_CAPTURE_LIBRARY_SCENES.every((scene) => scene.spanSha256s.length === 1 && /^[0-9a-f]{64}$/.test(scene.spanSha256s[0]))).toBe(true);
  });

  it("carries fifteen substantial unique bilingual beats", () => {
    const beats = RAMAYANA_KARTAVIRYA_CAPTURE_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats);
    expect(beats).toHaveLength(15);
    expect(new Set(beats.map((beat) => beat.id)).size).toBe(15);
    expect(beats.every((beat) => beat.narration.en.length > 150 && beat.narration.hi.length > 130)).toBe(true);
  });

  it("preserves causation, victims, defeat, negotiated release, and failed reform", () => {
    const english = RAMAYANA_KARTAVIRYA_CAPTURE_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats).map((beat) => beat.narration.en).join(" ");
    expect(english).toContain("does not say that Arjuna designed the river surge as an attack");
    expect(english).toContain("kill some ministers and consume others");
    expect(english).toContain("not released by his own strength");
    expect(english).toContain("not on evidence that the battle result was false");
    expect(english).toContain("does not end in reform");
  });

  it("keeps epic worship distinct from modern ritual instruction", () => {
    const story = RAMAYANA_KARTAVIRYA_CAPTURE_LIBRARY_SCENES[0];
    expect(story.nodeIds).toContain("epic-ritual-not-instruction");
    expect(story.moment.beats.at(-1)?.narration.en).toContain("not as a modern ritual prescription");
  });
});

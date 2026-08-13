import { describe, expect, it } from "vitest";
import { RAMAYANA_KAIKASI_BOONS_LIBRARY_SCENES } from "./ramayana-kaikasi-boons-library-scenes";

describe("Ramayana Kaikasi and boons library scenes", () => {
  it("replaces Uttara 9-10 with exact source-unit scenes", () => {
    expect(RAMAYANA_KAIKASI_BOONS_LIBRARY_SCENES.map((scene) => [scene.sourceStart, scene.sourceEnd])).toEqual([[9, 9], [10, 10]]);
    expect(RAMAYANA_KAIKASI_BOONS_LIBRARY_SCENES.every((scene) => scene.spanSha256s.length === 1 && /^[0-9a-f]{64}$/.test(scene.spanSha256s[0]))).toBe(true);
  });
  it("carries ten substantial unique bilingual beats", () => {
    const beats = RAMAYANA_KAIKASI_BOONS_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats);
    expect(beats).toHaveLength(10);
    expect(new Set(beats.map((beat) => beat.id)).size).toBe(10);
    expect(beats.every((beat) => beat.narration.en.length > 120 && beat.narration.hi.length > 100)).toBe(true);
  });
  it("preserves constrained choice, anti-essentialism, and manipulated-speech boundaries", () => {
    const english = RAMAYANA_KAIKASI_BOONS_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats).map((beat) => beat.narration.en).join(" ");
    expect(english).toContain("under her father's command");
    expect(english).toContain("not appearance");
    expect(english).toContain("without endorsing that inherited suspicion");
    expect(english).toContain("not presented as his free, informed preference");
  });
});

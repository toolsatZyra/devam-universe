import { describe, expect, it } from "vitest";
import { RAMAYANA_LANKA_BEFORE_RAVANA_LIBRARY_SCENES } from "./ramayana-lanka-before-ravana-library-scenes";

describe("Ramayana Lanka-before-Ravana library scenes", () => {
  it("replaces Uttara 3-5 with exact, non-overlapping source-unit scenes", () => {
    expect(RAMAYANA_LANKA_BEFORE_RAVANA_LIBRARY_SCENES).toHaveLength(3);
    expect(RAMAYANA_LANKA_BEFORE_RAVANA_LIBRARY_SCENES.map((scene) => [scene.sourceStart, scene.sourceEnd])).toEqual([
      [3, 3],
      [4, 4],
      [5, 5],
    ]);
    expect(RAMAYANA_LANKA_BEFORE_RAVANA_LIBRARY_SCENES.every((scene) =>
      scene.spanSha256s.length === 1 && /^[0-9a-f]{64}$/.test(scene.spanSha256s[0])
    )).toBe(true);
  });

  it("carries fifteen substantial unique bilingual beats", () => {
    const beats = RAMAYANA_LANKA_BEFORE_RAVANA_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats);
    expect(beats).toHaveLength(15);
    expect(new Set(beats.map((beat) => beat.id)).size).toBe(beats.length);
    expect(beats.every((beat) => beat.narration.en.length > 120 && beat.narration.hi.length > 100)).toBe(true);
  });

  it("preserves earlier city memory and rejects inherited moral guilt", () => {
    const english = RAMAYANA_LANKA_BEFORE_RAVANA_LIBRARY_SCENES
      .flatMap((scene) => scene.moment.beats)
      .map((beat) => beat.narration.en)
      .join(" ");
    expect(english).toContain("vacant at this moment");
    expect(english).toContain("not an ethnic or moral classification of living people");
    expect(english).toContain("lineage alone determines conduct");
    expect(english).toContain("not be projected onto every Rakshasa resident");
  });

  it("keeps women, the abandoned infant, and ordinary residents visible", () => {
    const beats = RAMAYANA_LANKA_BEFORE_RAVANA_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats);
    expect(beats.find((beat) => beat.id === "visrava-and-devavarnini-begin-kuberas-house")?.narration.en).toContain("Devavarnini's own perspective");
    expect(beats.find((beat) => beat.id === "an-infant-is-left-crying-on-mandara")?.characterIds).toContain("abandoned-infant");
    expect(beats.find((beat) => beat.id === "the-rulers-choose-to-turn-security-into-harm")?.characterIds).toContain("rakshasa-residents");
  });
});

import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_SANDALS_TRUST_LIBRARY_SCENES } from "./ramayana-sandals-trust-library-scenes";

describe("Ramayana sandals trust library scenes", () => {
  it("replaces Ayodhya 108-112 with exact, non-overlapping source-unit scenes", () => {
    expect(RAMAYANA_SANDALS_TRUST_LIBRARY_SCENES.map((scene) => [scene.sourceStart, scene.sourceEnd])).toEqual([
      [108, 108], [109, 109], [110, 110], [111, 111], [112, 112],
    ]);
    for (const scene of RAMAYANA_SANDALS_TRUST_LIBRARY_SCENES) {
      expect(scene.spanSha256s).toEqual(getDuttKandaSpanSha256s("ayodhya", scene.sourceStart, scene.sourceEnd));
    }
  });

  it("carries thirty-one substantial unique bilingual beats", () => {
    const beats = RAMAYANA_SANDALS_TRUST_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats);
    expect(beats).toHaveLength(31);
    expect(RAMAYANA_SANDALS_TRUST_LIBRARY_SCENES.map((scene) => scene.moment.beats.length)).toEqual([5, 7, 6, 7, 6]);
    expect(new Set(beats.map((beat) => beat.id)).size).toBe(31);
    expect(beats.every((beat) => beat.narration.en.length > 180 && beat.narration.hi.length > 150)).toBe(true);
  });

  it("keeps persuasion, polemic, tradition, coercion, destiny, and proxy claims bounded", () => {
    const english = RAMAYANA_SANDALS_TRUST_LIBRARY_SCENES
      .flatMap((scene) => scene.moment.beats)
      .map((beat) => beat.narration.en)
      .join(" ");
    expect(english).toContain("strategic advocacy");
    expect(english).toContain("not endorsed as a modern instruction");
    expect(english).toContain("not presented as verified natural history");
    expect(english).toContain("not a romantic model");
    expect(english).toContain("does not erase Rama's choices");
    expect(english).toContain("not independently divine in this episode");
  });

  it("keeps editorial apparatus out of consumer narration", () => {
    const narration = RAMAYANA_SANDALS_TRUST_LIBRARY_SCENES
      .flatMap((scene) => scene.moment.beats)
      .flatMap((beat) => [beat.narration.en, beat.narration.hi])
      .join(" ");
    expect(narration).not.toMatch(/\b(?:Devam|source|consumer|citation|chapter|verse|interface)\b/i);
    expect(narration).not.toMatch(/(?:देवम्|स्रोत|उपभोक्ता|उद्धरण|अध्याय|श्लोक|इंटरफ़ेस)/u);
  });
});

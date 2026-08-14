import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_JATAYU_RESISTANCE_LIBRARY_SCENES } from "./ramayana-jatayu-resistance-library-scenes";

describe("Ramayana Jatayu resistance library scenes", () => {
  it("replaces Aranya 49-53 with exact, non-overlapping source-unit scenes", () => {
    expect(RAMAYANA_JATAYU_RESISTANCE_LIBRARY_SCENES.map((scene) => [scene.sourceStart, scene.sourceEnd])).toEqual([
      [49, 49], [50, 50], [51, 51], [52, 52], [53, 53],
    ]);
    for (const scene of RAMAYANA_JATAYU_RESISTANCE_LIBRARY_SCENES) {
      expect(scene.spanSha256s).toEqual(getDuttKandaSpanSha256s("aranya", scene.sourceStart, scene.sourceEnd));
    }
  });

  it("carries twenty-nine substantial unique bilingual beats", () => {
    const beats = RAMAYANA_JATAYU_RESISTANCE_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats);
    expect(beats).toHaveLength(29);
    expect(RAMAYANA_JATAYU_RESISTANCE_LIBRARY_SCENES.map((scene) => scene.moment.beats.length)).toEqual([5, 7, 6, 5, 6]);
    expect(new Set(beats.map((beat) => beat.id)).size).toBe(29);
    expect(beats.every((beat) => beat.narration.en.length > 180 && beat.narration.hi.length > 150)).toBe(true);
  });

  it("preserves agency, continuity, and the hard ethical boundaries", () => {
    const english = RAMAYANA_JATAYU_RESISTANCE_LIBRARY_SCENES
      .flatMap((scene) => scene.moment.beats)
      .map((beat) => beat.narration.en)
      .join(" ");
    expect(english).toContain("not a claim that women are transferable property");
    expect(english).toContain("does not endorse collective punishment");
    expect(english).toContain("not yet dead");
    expect(english).toContain("do not make Sita's capture good for her");
    expect(english).toContain("physical possession is not consent");
    expect(english).toContain("Material provision and protection from some mistreatment coexist with confinement");
  });

  it("keeps editorial apparatus out of consumer narration", () => {
    const narration = RAMAYANA_JATAYU_RESISTANCE_LIBRARY_SCENES
      .flatMap((scene) => scene.moment.beats)
      .flatMap((beat) => [beat.narration.en, beat.narration.hi])
      .join(" ");
    expect(narration).not.toMatch(/\b(?:Devam|source|consumer|citation|chapter|verse|interface)\b/i);
    expect(narration).not.toMatch(/(?:देवम्|स्रोत|उपभोक्ता|उद्धरण|अध्याय|श्लोक|इंटरफ़ेस)/u);
  });
});

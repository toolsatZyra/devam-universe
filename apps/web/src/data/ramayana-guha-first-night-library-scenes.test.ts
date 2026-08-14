import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_GUHA_FIRST_NIGHT_LIBRARY_SCENES } from "./ramayana-guha-first-night-library-scenes";

describe("Ramayana Guha first-night library scenes", () => {
  it("replaces Ayodhya 86-89 with exact retained source-unit scenes", () => {
    expect(RAMAYANA_GUHA_FIRST_NIGHT_LIBRARY_SCENES.map((scene) => [scene.sourceStart, scene.sourceEnd])).toEqual([[86, 86], [87, 87], [88, 88], [89, 89]]);
    for (const scene of RAMAYANA_GUHA_FIRST_NIGHT_LIBRARY_SCENES) expect(scene.spanSha256s).toEqual(getDuttKandaSpanSha256s("ayodhya", scene.sourceStart, scene.sourceEnd));
  });

  it("carries twenty-two substantial unique bilingual beats", () => {
    const beats = RAMAYANA_GUHA_FIRST_NIGHT_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats);
    expect(beats).toHaveLength(22);
    expect(RAMAYANA_GUHA_FIRST_NIGHT_LIBRARY_SCENES.map((scene) => scene.moment.beats.length)).toEqual([5, 5, 6, 6]);
    expect(new Set(beats.map((beat) => beat.id)).size).toBe(22);
    expect(beats.every((beat) => beat.narration.en.length > 180 && beat.narration.hi.length > 150)).toBe(true);
  });

  it("preserves shared care while bounding guilt, hierarchy, ritual, consent, and expedition harm", () => {
    const english = RAMAYANA_GUHA_FIRST_NIGHT_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats).map((beat) => beat.narration.en).join(" ");
    expect(english).toContain("sharing responsibility until dawn");
    expect(english).toContain("requiring care, not as a test of devotion");
    expect(english).toContain("not a universal ritual prescription");
    expect(english).toContain("not an accurate transfer of Kaikeyi's and Dasharatha's decisions");
    expect(english).toContain("not to a rule that wives should endure danger without question");
    expect(english).toContain("does not erase harm to homes or banks");
  });

  it("keeps editorial apparatus out of consumer narration", () => {
    const narration = RAMAYANA_GUHA_FIRST_NIGHT_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats).flatMap((beat) => [beat.narration.en, beat.narration.hi]).join(" ");
    expect(narration).not.toMatch(/\b(?:Devam|source|consumer|citation|chapter|verse|interface)\b/i);
    expect(narration).not.toMatch(/(?:देवम्|स्रोत|उपभोक्ता|उद्धरण|अध्याय|श्लोक|इंटरफ़ेस)/u);
  });
});

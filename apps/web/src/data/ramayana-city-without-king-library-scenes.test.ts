import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_CITY_WITHOUT_KING_LIBRARY_SCENES } from "./ramayana-city-without-king-library-scenes";

describe("Ramayana city-without-king library scenes", () => {
  it("replaces Ayodhya 65-68 with exact retained source-unit scenes", () => {
    expect(RAMAYANA_CITY_WITHOUT_KING_LIBRARY_SCENES.map((scene) => [scene.sourceStart, scene.sourceEnd])).toEqual([[65, 65], [66, 66], [67, 67], [68, 68]]);
    for (const scene of RAMAYANA_CITY_WITHOUT_KING_LIBRARY_SCENES) expect(scene.spanSha256s).toEqual(getDuttKandaSpanSha256s("ayodhya", scene.sourceStart, scene.sourceEnd));
  });

  it("carries twenty-four substantial unique bilingual beats", () => {
    const beats = RAMAYANA_CITY_WITHOUT_KING_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats);
    expect(beats).toHaveLength(24);
    expect(RAMAYANA_CITY_WITHOUT_KING_LIBRARY_SCENES.map((scene) => scene.moment.beats.length)).toEqual([6, 6, 6, 6]);
    expect(new Set(beats.map((beat) => beat.id)).size).toBe(24);
    expect(beats.every((beat) => beat.narration.en.length > 180 && beat.narration.hi.length > 150)).toBe(true);
  });

  it("bounds objectification, self-harm, period rites, hierarchy, absolute rule, absent consent, secrecy, and literary geography", () => {
    const english = RAMAYANA_CITY_WITHOUT_KING_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats).map((beat) => beat.narration.en).join(" ");
    expect(english).toContain("not decorative inventory");
    expect(english).toContain("not a faithful wife's required act");
    expect(english).toContain("period royal practice in the tale, not universal funeral instruction");
    expect(english).toContain("cannot determine present dignity, consent");
    expect(english).toContain("No human ruler embodies truth");
    expect(english).toContain("Bharata has not yet heard, accepted, or consented to govern");
    expect(english).toContain("denies Bharata informed choice");
    expect(english).toContain("literary geography and cannot by itself establish every modern location or exact route");
  });

  it("keeps editorial apparatus out of consumer narration", () => {
    const narration = RAMAYANA_CITY_WITHOUT_KING_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats).flatMap((beat) => [beat.narration.en, beat.narration.hi]).join(" ");
    expect(narration).not.toMatch(/\b(?:Devam|source|consumer|citation|chapter|verse|interface)\b/i);
    expect(narration).not.toMatch(/(?:देवम्|स्रोत|उपभोक्ता|उद्धरण|अध्याय|श्लोक|इंटरफ़ेस)/u);
  });
});

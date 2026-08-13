import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_CITY_FOLLOWS_LIBRARY_SCENES } from "./ramayana-city-follows-library-scenes";

describe("Ramayana city follows library scenes", () => {
  it("replaces Ayodhya 41-45 with exact, non-overlapping source-unit scenes", () => {
    expect(RAMAYANA_CITY_FOLLOWS_LIBRARY_SCENES.map((scene) => [scene.sourceStart, scene.sourceEnd])).toEqual([
      [41, 41], [42, 42], [43, 43], [44, 44], [45, 45],
    ]);
    for (const scene of RAMAYANA_CITY_FOLLOWS_LIBRARY_SCENES) {
      expect(scene.spanSha256s).toEqual(getDuttKandaSpanSha256s("ayodhya", scene.sourceStart, scene.sourceEnd));
    }
  });

  it("carries twenty substantial unique bilingual beats", () => {
    const beats = RAMAYANA_CITY_FOLLOWS_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats);
    expect(beats).toHaveLength(20);
    expect(new Set(beats.map((beat) => beat.id)).size).toBe(20);
    expect(beats.every((beat) => beat.narration.en.length > 180 && beat.narration.hi.length > 150)).toBe(true);
  });

  it("keeps agency, attribution, and difficult claims bounded", () => {
    const english = RAMAYANA_CITY_FOLLOWS_LIBRARY_SCENES
      .flatMap((scene) => scene.moment.beats)
      .map((beat) => beat.narration.en)
      .join(" ");
    expect(english).toContain("not a modern astronomical report");
    expect(english).toContain("do not establish Bharata's knowledge, consent, or guilt");
    expect(english).toContain("Sita's presence remains her repeatedly expressed choice");
    expect(english).toContain("not weather forecasts, guarantees of safety");
    expect(english).toContain("does not grant the return they request");
  });

  it("keeps editorial apparatus out of consumer narration", () => {
    const narration = RAMAYANA_CITY_FOLLOWS_LIBRARY_SCENES
      .flatMap((scene) => scene.moment.beats)
      .flatMap((beat) => [beat.narration.en, beat.narration.hi])
      .join(" ");
    expect(narration).not.toMatch(/\b(?:Devam|source|consumer|citation|chapter|verse|interface)\b/i);
    expect(narration).not.toMatch(/(?:देवम्|स्रोत|उपभोक्ता|उद्धरण|अध्याय|श्लोक|इंटरफ़ेस)/u);
  });
});

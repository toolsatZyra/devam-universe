import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_BROTHERS_MEET_LIBRARY_SCENES } from "./ramayana-brothers-meet-library-scenes";

describe("Ramayana brothers meet library scenes", () => {
  it("replaces Ayodhya 99-103 with exact, non-overlapping source-unit scenes", () => {
    expect(RAMAYANA_BROTHERS_MEET_LIBRARY_SCENES.map((scene) => [scene.sourceStart, scene.sourceEnd])).toEqual([
      [99, 99], [100, 100], [101, 101], [102, 102], [103, 103],
    ]);
    for (const scene of RAMAYANA_BROTHERS_MEET_LIBRARY_SCENES) {
      expect(scene.spanSha256s).toEqual(getDuttKandaSpanSha256s("ayodhya", scene.sourceStart, scene.sourceEnd));
    }
  });

  it("carries twenty-five substantial unique bilingual beats", () => {
    const beats = RAMAYANA_BROTHERS_MEET_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats);
    expect(beats).toHaveLength(25);
    expect(RAMAYANA_BROTHERS_MEET_LIBRARY_SCENES.map((scene) => scene.moment.beats.length)).toEqual([5, 7, 4, 3, 6]);
    expect(new Set(beats.map((beat) => beat.id)).size).toBe(25);
    expect(beats.every((beat) => beat.narration.en.length > 180 && beat.narration.hi.length > 150)).toBe(true);
  });

  it("keeps governance, hierarchy, mourning, and ecological claims bounded", () => {
    const english = RAMAYANA_BROTHERS_MEET_LIBRARY_SCENES
      .flatMap((scene) => scene.moment.beats)
      .map((beat) => beat.narration.en)
      .join(" ");
    expect(english).toContain("not universal justice instructions");
    expect(english).toContain("not a complete or automatically just model for government today");
    expect(english).toContain("not proof that the command was fair");
    expect(english).toContain("not a universal modern ritual checklist");
    expect(english).toContain("carries ecological disturbance");
  });

  it("keeps editorial apparatus out of consumer narration", () => {
    const narration = RAMAYANA_BROTHERS_MEET_LIBRARY_SCENES
      .flatMap((scene) => scene.moment.beats)
      .flatMap((beat) => [beat.narration.en, beat.narration.hi])
      .join(" ");
    expect(narration).not.toMatch(/\b(?:Devam|source|consumer|citation|chapter|verse|interface)\b/i);
    expect(narration).not.toMatch(/(?:देवम्|स्रोत|उपभोक्ता|उद्धरण|अध्याय|श्लोक|इंटरफ़ेस)/u);
  });
});

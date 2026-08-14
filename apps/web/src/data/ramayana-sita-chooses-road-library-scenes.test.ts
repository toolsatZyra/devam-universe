import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_SITA_CHOOSES_ROAD_LIBRARY_SCENES } from "./ramayana-sita-chooses-road-library-scenes";

describe("Ramayana Sita chooses the road library scenes", () => {
  it("replaces Ayodhya 26-30 with exact, non-overlapping source-unit scenes", () => {
    expect(RAMAYANA_SITA_CHOOSES_ROAD_LIBRARY_SCENES.map((scene) => [scene.sourceStart, scene.sourceEnd])).toEqual([
      [26, 26], [27, 27], [28, 28], [29, 29], [30, 30],
    ]);
    for (const scene of RAMAYANA_SITA_CHOOSES_ROAD_LIBRARY_SCENES) {
      expect(scene.spanSha256s).toEqual(getDuttKandaSpanSha256s("ayodhya", scene.sourceStart, scene.sourceEnd));
    }
  });

  it("carries twenty substantial unique bilingual beats", () => {
    const beats = RAMAYANA_SITA_CHOOSES_ROAD_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats);
    expect(beats).toHaveLength(20);
    expect(new Set(beats.map((beat) => beat.id)).size).toBe(20);
    expect(beats.every((beat) => beat.narration.en.length > 180 && beat.narration.hi.length > 150)).toBe(true);
  });

  it("preserves informed choice without universalising hierarchy or romanticising distress", () => {
    const english = RAMAYANA_SITA_CHOOSES_ROAD_LIBRARY_SCENES
      .flatMap((scene) => scene.moment.beats)
      .map((beat) => beat.narration.en)
      .join(" ");
    expect(english).toContain("not a universal rule that spouses must separate");
    expect(english).toContain("not converted into present-day advice");
    expect(english).toContain("not a modern ritual checklist");
    expect(english).toContain("does not romanticise self-harm");
    expect(english).toContain("without endorsing the premise that being a woman signifies cowardice");
    expect(english).toContain("Her already repeated decision should stand without requiring this suffering as its price");
  });

  it("keeps editorial apparatus out of the consumer narration", () => {
    const narration = RAMAYANA_SITA_CHOOSES_ROAD_LIBRARY_SCENES
      .flatMap((scene) => scene.moment.beats)
      .flatMap((beat) => [beat.narration.en, beat.narration.hi])
      .join(" ");
    expect(narration).not.toMatch(/\b(?:Devam|source|consumer|citation|chapter|verse|interface)\b/i);
    expect(narration).not.toMatch(/(?:देवम्|स्रोत|उपभोक्ता|उद्धरण|अध्याय|श्लोक|इंटरफ़ेस)/u);
  });
});

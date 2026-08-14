import { describe, expect, it } from "vitest";
import { getDuttBalaSpanSha256s } from "./ramayana-bala-source-spans";
import { RAMAYANA_TRISHANKU_LIBRARY_SCENES } from "./ramayana-trishanku-library-scenes";

describe("Ramayana Trishanku library scenes", () => {
  it("replaces logical Balakanda 55-58 with exact retained source-unit scenes", () => {
    expect(RAMAYANA_TRISHANKU_LIBRARY_SCENES.map((scene) => [scene.sourceStart, scene.sourceEnd])).toEqual([
      [55, 55], [56, 56], [57, 57], [58, 58],
    ]);
    for (const scene of RAMAYANA_TRISHANKU_LIBRARY_SCENES) {
      expect(scene.spanSha256s).toEqual(getDuttBalaSpanSha256s(scene.sourceStart, scene.sourceEnd));
    }
  });

  it("carries twenty-one substantial unique bilingual beats", () => {
    const beats = RAMAYANA_TRISHANKU_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats);
    expect(beats).toHaveLength(21);
    expect(RAMAYANA_TRISHANKU_LIBRARY_SCENES.map((scene) => scene.moment.beats.length)).toEqual([5, 5, 5, 6]);
    expect(new Set(beats.map((beat) => beat.id)).size).toBe(21);
    expect(beats.every((beat) => beat.narration.en.length > 180 && beat.narration.hi.length > 150)).toBe(true);
  });

  it("bounds hierarchy, coercion, retaliation, and supernatural claims", () => {
    const english = RAMAYANA_TRISHANKU_LIBRARY_SCENES
      .flatMap((scene) => scene.moment.beats)
      .map((beat) => beat.narration.en)
      .join(" ");
    expect(english).toContain("not a rule for human worth today");
    expect(english).toContain("cannot establish who may worship, teach, eat, or possess dignity now");
    expect(english).toContain("cannot be treated as wholehearted consent");
    expect(english).toContain("not historical events or moral permission");
    expect(english).toContain("not evidence that austerity or ritual can physically launch a person");
    expect(english).toContain("incompleteness of the compromise");
  });

  it("keeps editorial apparatus out of consumer narration", () => {
    const narration = RAMAYANA_TRISHANKU_LIBRARY_SCENES
      .flatMap((scene) => scene.moment.beats)
      .flatMap((beat) => [beat.narration.en, beat.narration.hi])
      .join(" ");
    expect(narration).not.toMatch(/\b(?:Devam|source|consumer|citation|chapter|verse|interface)\b/i);
    expect(narration).not.toMatch(/(?:देवम्|स्रोत|उपभोक्ता|उद्धरण|अध्याय|श्लोक|इंटरफ़ेस)/u);
  });
});

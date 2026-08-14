import { describe, expect, it } from "vitest";
import { getDuttBalaSpanSha256s } from "./ramayana-bala-source-spans";
import { RAMAYANA_VISHVAMITRA_VASISHTA_LIBRARY_SCENES } from "./ramayana-vishvamitra-vasishta-library-scenes";

describe("Ramayana Vishvamitra-Vasishta library scenes", () => {
  it("replaces logical Balakanda 50-54 with exact retained source-unit scenes", () => {
    expect(RAMAYANA_VISHVAMITRA_VASISHTA_LIBRARY_SCENES.map((scene) => [scene.sourceStart, scene.sourceEnd])).toEqual([
      [50, 50], [51, 51], [52, 52], [53, 53], [54, 54],
    ]);
    for (const scene of RAMAYANA_VISHVAMITRA_VASISHTA_LIBRARY_SCENES) {
      expect(scene.spanSha256s).toEqual(getDuttBalaSpanSha256s(scene.sourceStart, scene.sourceEnd));
    }
  });

  it("carries twenty-eight substantial unique bilingual beats", () => {
    const beats = RAMAYANA_VISHVAMITRA_VASISHTA_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats);
    expect(beats).toHaveLength(28);
    expect(RAMAYANA_VISHVAMITRA_VASISHTA_LIBRARY_SCENES.map((scene) => scene.moment.beats.length)).toEqual([5, 5, 6, 7, 5]);
    expect(new Set(beats.map((beat) => beat.id)).size).toBe(28);
    expect(beats.every((beat) => beat.narration.en.length > 180 && beat.narration.hi.length > 150)).toBe(true);
  });

  it("preserves agency and bounds hierarchy, ethnicity, violence, and supernatural claims", () => {
    const english = RAMAYANA_VISHVAMITRA_VASISHTA_LIBRARY_SCENES
      .flatMap((scene) => scene.moment.beats)
      .map((beat) => beat.narration.en)
      .join(" ");
    expect(english).toContain("not an inert treasure waiting for the highest bidder");
    expect(english).toContain("her own wishes cannot be replaced by a transaction between men");
    expect(english).toContain("period claim, not a rule for human worth today");
    expect(english).toContain("do not describe real communities across history");
    expect(english).toContain("not a reproducible practice, historical technology");
    expect(english).toContain("not a present rule that birth group determines courage");
    expect(english).toContain("not instant moral completion");
  });

  it("keeps editorial apparatus out of consumer narration", () => {
    const narration = RAMAYANA_VISHVAMITRA_VASISHTA_LIBRARY_SCENES
      .flatMap((scene) => scene.moment.beats)
      .flatMap((beat) => [beat.narration.en, beat.narration.hi])
      .join(" ");
    expect(narration).not.toMatch(/\b(?:Devam|source|consumer|citation|chapter|verse|interface)\b/i);
    expect(narration).not.toMatch(/(?:देवम्|स्रोत|उपभोक्ता|उद्धरण|अध्याय|श्लोक|इंटरफ़ेस)/u);
  });
});

import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_RAMBHA_INDRA_LIBRARY_SCENES } from "./ramayana-rambha-indra-library-scenes";

describe("Ramayana Rambha-to-Indra library scenes", () => {
  it("replaces Uttara 31-35 with one exact non-overlapping scene per source unit", () => {
    expect(RAMAYANA_RAMBHA_INDRA_LIBRARY_SCENES).toHaveLength(5);
    expect(RAMAYANA_RAMBHA_INDRA_LIBRARY_SCENES.map((scene) => [scene.sourceStart, scene.sourceEnd])).toEqual(
      Array.from({ length: 5 }, (_, index) => [index + 31, index + 31]),
    );
    for (const scene of RAMAYANA_RAMBHA_INDRA_LIBRARY_SCENES) {
      expect(scene.spanSha256s).toEqual(getDuttKandaSpanSha256s("uttara", scene.sourceStart, scene.sourceEnd));
    }
  });

  it("carries substantial unique bilingual story beats", () => {
    const beats = RAMAYANA_RAMBHA_INDRA_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats);
    expect(beats).toHaveLength(23);
    expect(new Set(beats.map((beat) => beat.id)).size).toBe(beats.length);
    expect(beats.every((beat) => beat.narration.en.length > 150 && beat.narration.hi.length > 120)).toBe(true);
  });

  it("preserves consent, testimony, victim-blame, violence, and non-instruction boundaries", () => {
    const text = RAMAYANA_RAMBHA_INDRA_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats)
      .map((beat) => beat.narration.en).join(" ");
    expect(text).toContain("Her refusal is repeated, specific, and complete");
    expect(text).toContain("it does not transfer responsibility to her");
    expect(text).toContain("do not establish consent");
    expect(text).toContain("not ritual instructions for a modern user");
    expect(text).toContain("Celestials kill celestials, Rakshasas strike Rakshasas");
    expect(text).not.toMatch(/romance|seduc/i);
  });
});

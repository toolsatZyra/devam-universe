import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_RISHYASRINGA_LIBRARY_SCENES } from "./ramayana-rishyasringa-library-scenes";

describe("Ramayana Rishyasringa library scenes", () => {
  it("replaces Balakanda 9-11 with exact retained source-unit scenes", () => {
    expect(RAMAYANA_RISHYASRINGA_LIBRARY_SCENES.map((scene) => [scene.sourceStart, scene.sourceEnd])).toEqual([[9, 9], [10, 10], [11, 11]]);
    for (const scene of RAMAYANA_RISHYASRINGA_LIBRARY_SCENES) expect(scene.spanSha256s).toEqual(getDuttKandaSpanSha256s("bala", scene.sourceStart, scene.sourceEnd));
  });

  it("carries fifteen substantial unique bilingual beats", () => {
    const beats = RAMAYANA_RISHYASRINGA_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats);
    expect(beats).toHaveLength(15);
    expect(RAMAYANA_RISHYASRINGA_LIBRARY_SCENES.map((scene) => scene.moment.beats.length)).toEqual([5, 5, 5]);
    expect(new Set(beats.map((beat) => beat.id)).size).toBe(15);
    expect(beats.every((beat) => beat.narration.en.length > 180 && beat.narration.hi.length > 150)).toBe(true);
  });

  it("preserves institutional responsibility, consent gaps, and literary causation boundaries", () => {
    const english = RAMAYANA_RISHYASRINGA_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats).map((beat) => beat.narration.en).join(" ");
    expect(english).toContain("not establish a scientific rule for rainfall or public disaster");
    expect(english).toContain("The chain of delegation does not make the manipulation ownerless");
    expect(english).toContain("cannot be treated as informed agreement");
    expect(english).toContain("does not give either Shanta's deliberation or Rishyasringa's informed response");
    expect(english).toContain("her direct answer is not recorded");
  });

  it("keeps editorial apparatus out of consumer narration", () => {
    const narration = RAMAYANA_RISHYASRINGA_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats).flatMap((beat) => [beat.narration.en, beat.narration.hi]).join(" ");
    expect(narration).not.toMatch(/\b(?:Devam|source|consumer|citation|chapter|verse|interface)\b/i);
    expect(narration).not.toMatch(/(?:देवम्|स्रोत|उपभोक्ता|उद्धरण|अध्याय|श्लोक|इंटरफ़ेस)/u);
  });
});

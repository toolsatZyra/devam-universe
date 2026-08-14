import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_KHARA_MARCH_LIBRARY_SCENES } from "./ramayana-khara-march-library-scenes";

describe("Ramayana Khara-march library scenes", () => {
  it("replaces logical Aranya 21-24 with exact retained source-unit scenes", () => {
    expect(RAMAYANA_KHARA_MARCH_LIBRARY_SCENES.map((scene) => [scene.sourceStart, scene.sourceEnd])).toEqual([[21, 21], [22, 22], [23, 23], [24, 24]]);
    for (const scene of RAMAYANA_KHARA_MARCH_LIBRARY_SCENES) expect(scene.spanSha256s).toEqual(getDuttKandaSpanSha256s("aranya", scene.sourceStart, scene.sourceEnd));
  });

  it("retains the printed-section shift from XXII-XXV without relabelling logical units", () => {
    expect(RAMAYANA_KHARA_MARCH_LIBRARY_SCENES.map((scene) => scene.spanSha256s[0])).toEqual([
      "85cf4321d279e65c8c1a86fb7f5eaa8e933a33304b96b24f23d07791a13ca45c",
      "f2b24ecb75f2b8f063467612337cc8e6b17c4907008a63a55d1334fe789c96a6",
      "5f4a51f2977fb0443aa962b5e0b8491535aa0ad9eb24425475db8043cd992809",
      "feabd08133fff2a5c45cdf029e061e2cef3ac380123a2d2d20d50cc4b61bcbc2",
    ]);
  });

  it("carries twenty substantial unique bilingual beats", () => {
    const beats = RAMAYANA_KHARA_MARCH_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats);
    expect(beats).toHaveLength(20);
    expect(RAMAYANA_KHARA_MARCH_LIBRARY_SCENES.map((scene) => scene.moment.beats.length)).toEqual([5, 5, 5, 5]);
    expect(new Set(beats.map((beat) => beat.id)).size).toBe(20);
    expect(beats.every((beat) => beat.narration.en.length > 180 && beat.narration.hi.length > 150)).toBe(true);
  });

  it("bounds revenge, collective guilt, omens, hierarchy, protection, coercion, ecology, injury, and mass violence", () => {
    const english = RAMAYANA_KHARA_MARCH_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats).map((beat) => beat.narration.en).join(" ");
    expect(english).toContain("being harmed does not make revenge against every associated person necessary or just");
    expect(english).toContain("not evidence that a people, lineage, species, or community is collectively evil");
    expect(english).toContain("literary omens, not meteorological records");
    expect(english).toContain("Neither determines present dignity, equal protection, or guilt");
    expect(english).toContain("not evidence that Sita lacks courage or agency");
    expect(english).toContain("do not make coercion or unilateral danger-taking automatically wise");
    expect(english).toContain("the forest is not expendable scenery");
    expect(english).toContain("does not cancel injury, pain, vulnerability");
    expect(english).toContain("not be staged as a kill counter, reward loop, or blood spectacle");
    expect(english).toContain("not cowardice; command pressure");
    expect(english).toContain("not replicable technique");
  });

  it("keeps editorial apparatus out of consumer narration", () => {
    const narration = RAMAYANA_KHARA_MARCH_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats).flatMap((beat) => [beat.narration.en, beat.narration.hi]).join(" ");
    expect(narration).not.toMatch(/\b(?:Devam|source|consumer|citation|chapter|verse|interface)\b/i);
    expect(narration).not.toMatch(/(?:देवम्|स्रोत|उपभोक्ता|उद्धरण|अध्याय|श्लोक|इंटरफ़ेस)/u);
  });
});

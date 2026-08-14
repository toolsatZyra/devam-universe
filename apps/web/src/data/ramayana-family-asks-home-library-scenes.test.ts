import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_FAMILY_ASKS_HOME_LIBRARY_SCENES } from "./ramayana-family-asks-home-library-scenes";

describe("Ramayana family-asks-home library scenes", () => {
  it("replaces Ayodhya 104-107 with exact retained source-unit scenes", () => {
    expect(RAMAYANA_FAMILY_ASKS_HOME_LIBRARY_SCENES.map((scene) => [scene.sourceStart, scene.sourceEnd])).toEqual([[104, 104], [105, 105], [106, 106], [107, 107]]);
    for (const scene of RAMAYANA_FAMILY_ASKS_HOME_LIBRARY_SCENES) expect(scene.spanSha256s).toEqual(getDuttKandaSpanSha256s("ayodhya", scene.sourceStart, scene.sourceEnd));
  });

  it("carries twenty substantial unique bilingual beats", () => {
    const beats = RAMAYANA_FAMILY_ASKS_HOME_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats);
    expect(beats).toHaveLength(20);
    expect(RAMAYANA_FAMILY_ASKS_HOME_LIBRARY_SCENES.map((scene) => scene.moment.beats.length)).toEqual([5, 5, 5, 5]);
    expect(new Set(beats.map((beat) => beat.id)).size).toBe(20);
    expect(beats.every((beat) => beat.narration.en.length > 180 && beat.narration.hi.length > 150)).toBe(true);
  });

  it("bounds labour hierarchy, ritual, absent consent, ableism, grief, violence, caste, royal transfer, and son preference", () => {
    const english = RAMAYANA_FAMILY_ASKS_HOME_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats).map((beat) => beat.narration.en).join(" ");
    expect(english).toContain("the insult belongs to an ancient hierarchy of service");
    expect(english).toContain("not universal funeral instruction");
    expect(english).toContain("Bharata never requested the crown");
    expect(english).toContain("disability, birth order, and confidence do not determine a person's worth");
    expect(english).toContain("not proof of an afterlife or a demand that mourners suppress pain");
    expect(english).toContain("violence against a parent, woman, or accused person is neither justice nor proof of loyalty");
    expect(english).toContain("not present rules for occupation, spiritual worth, marriage, citizenship");
    expect(english).toContain("a bride, child, kingdom, or population is not property");
    expect(english).toContain("not a guaranteed afterlife mechanism, a mandatory pilgrimage, or proof that only sons matter");
  });

  it("keeps editorial apparatus out of consumer narration", () => {
    const narration = RAMAYANA_FAMILY_ASKS_HOME_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats).flatMap((beat) => [beat.narration.en, beat.narration.hi]).join(" ");
    expect(narration).not.toMatch(/\b(?:Devam|source|consumer|citation|chapter|verse|interface)\b/i);
    expect(narration).not.toMatch(/(?:देवम्|स्रोत|उपभोक्ता|उद्धरण|अध्याय|श्लोक|इंटरफ़ेस)/u);
  });
});

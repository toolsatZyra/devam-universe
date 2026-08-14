import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_MESSENGER_TOKEN_SCENE_OUTLINES } from "./ramayana-messenger-token-outline";
import { RAMAYANA_MESSENGER_TOKEN_PLAYABLE_SCENES } from "./ramayana-messenger-token-playable";

describe("Ramayana messenger-and-token playable stories", () => {
  const outlineById = new Map(RAMAYANA_MESSENGER_TOKEN_SCENE_OUTLINES.map((outline) => [outline.id, outline]));

  it("partitions every Sundara source ordinal from 30 through 39 exactly once", () => {
    expect(RAMAYANA_MESSENGER_TOKEN_PLAYABLE_SCENES).toHaveLength(10);
    expect(RAMAYANA_MESSENGER_TOKEN_PLAYABLE_SCENES.reduce((n, scene) => n + scene.moment.beats.length, 0)).toBe(63);
    const covered = RAMAYANA_MESSENGER_TOKEN_PLAYABLE_SCENES.flatMap((scene) => {
      const outline = outlineById.get(scene.id)!;
      expect(getDuttKandaSpanSha256s("sundara", outline.sourceStart, outline.sourceEnd)).toHaveLength(
        outline.sourceEnd - outline.sourceStart + 1,
      );
      return Array.from(
        { length: outline.sourceEnd - outline.sourceStart + 1 },
        (_, index) => outline.sourceStart + index,
      );
    }).sort((left, right) => left - right);
    expect(covered).toEqual([30, 31, 32, 33, 34, 35, 36, 37, 38, 39]);
  });

  it("keeps every scene navigable and every beat bilingual, visual, and substantial", () => {
    for (const scene of RAMAYANA_MESSENGER_TOKEN_PLAYABLE_SCENES) {
      expect(scene.nodeIds.length, scene.id).toBeGreaterThanOrEqual(8);
      for (const beat of scene.moment.beats) {
        expect(beat.narration.en.length, beat.id).toBeGreaterThan(180);
        expect(beat.narration.hi.length, beat.id).toBeGreaterThan(150);
        expect(beat.visualCue.length, beat.id).toBeGreaterThan(70);
      }
    }
  });

  it("makes trust testable, preserves Sita's refusal, and ends before the next conflict", () => {
    const english = RAMAYANA_MESSENGER_TOKEN_PLAYABLE_SCENES
      .flatMap((scene) => scene.moment.beats.map((beat) => beat.narration.en))
      .join(" ");
    expect(english).toContain("Trust will depend on whether the next answers survive her tests");
    expect(english).toContain("not a universal prediction offered to everyone who dreams of an animal");
    expect(english).toContain("Sita says she is Janaka's daughter, Dasharatha's daughter-in-law, and Rama's wife");
    expect(english).toContain("Her withdrawal is a safety decision, not ingratitude");
    expect(english).toContain("These familiar habits and choices give Sita something she can compare");
    expect(english).toContain("Trust rests on convergence, not on jewellery possessing supernatural certainty");
    expect(english).toContain("an information failure from abandonment");
    expect(english).toContain("the city is not one obedient moral block");
    expect(english).toContain("His demonstration answers whether he has power; it does not answer whether she consents");
    expect(english).toContain("Battle is uncertain even for the strong");
    expect(english).toContain("it is not a purity test");
    expect(english).toContain("Hanuman does not repeat the carrying offer after Sita's reasons");
    expect(english).toContain("The crow survives with a lasting cost");
    expect(english).toContain("one brief contact has connected her to an entire social world");
    expect(english).toContain("The question distinguishes a scout's exceptional journey from logistics for an army");
    expect(english).toContain("the exact collective crossing method that later decisions must create");
    expect(english).toContain("Hanuman must carry both the captor's clock and Sita's more urgent estimate");
    expect(english).toContain("The grove is still quiet; the next conflict has not yet begun");
  });
});

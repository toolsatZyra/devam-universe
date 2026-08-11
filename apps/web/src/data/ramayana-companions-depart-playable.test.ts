import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_COMPANIONS_DEPART_SCENE_OUTLINES } from "./ramayana-companions-depart-outline";
import { RAMAYANA_COMPANIONS_DEPART_PLAYABLE_SCENES } from "./ramayana-companions-depart-playable";

describe("Ramayana companions-depart playable stories", () => {
  const outlineById = new Map(RAMAYANA_COMPANIONS_DEPART_SCENE_OUTLINES.map((outline) => [outline.id, outline]));

  it("partitions every Uttara source ordinal from 46 through 53 exactly once", () => {
    expect(RAMAYANA_COMPANIONS_DEPART_PLAYABLE_SCENES).toHaveLength(8);
    expect(RAMAYANA_COMPANIONS_DEPART_PLAYABLE_SCENES.reduce((n, item) => n + item.moment.beats.length, 0)).toBe(24);
    const covered = RAMAYANA_COMPANIONS_DEPART_PLAYABLE_SCENES.flatMap((item) => {
      const outline = outlineById.get(item.id)!;
      expect(getDuttKandaSpanSha256s("uttara", outline.sourceStart, outline.sourceEnd), item.id)
        .toHaveLength(outline.sourceEnd - outline.sourceStart + 1);
      return Array.from({ length: outline.sourceEnd - outline.sourceStart + 1 }, (_, index) => outline.sourceStart + index);
    }).sort((left, right) => left - right);
    expect(covered).toEqual(Array.from({ length: 8 }, (_, index) => index + 46));
  });

  it("keeps every scene navigable and every beat unique, bilingual, visual, and substantial", () => {
    const beatIds = RAMAYANA_COMPANIONS_DEPART_PLAYABLE_SCENES.flatMap((item) => item.moment.beats.map((entry) => entry.id));
    expect(new Set(beatIds).size).toBe(beatIds.length);
    for (const item of RAMAYANA_COMPANIONS_DEPART_PLAYABLE_SCENES) {
      expect(item.nodeIds.length, item.id).toBeGreaterThanOrEqual(8);
      for (const entry of item.moment.beats) {
        expect(entry.narration.en.length, entry.id).toBeGreaterThan(180);
        expect(entry.narration.hi.length, entry.id).toBeGreaterThan(150);
        expect(entry.visualCue.length, entry.id).toBeGreaterThan(70);
        expect(entry.narration.en, entry.id).not.toMatch(/\b(?:source|story|narrative|consumer|devam|citation|chapter|verse|interface|user|player)\b/i);
      }
    }
  });

  it("keeps gratitude distributive and makes the coercive turn toward Sita explicit", () => {
    const english = RAMAYANA_COMPANIONS_DEPART_PLAYABLE_SCENES
      .flatMap((item) => item.moment.beats.map((entry) => entry.narration.en)).join(" ");
    expect(english).toContain("imagined heroism cannot replace what the forest, bear, and Lanka allies actually endured");
    expect(english).toContain("it is not a price placed on loyalty");
    expect(english).toContain("wanting a visit is not agreeing to be left behind");
    expect(english).toContain("Forced captivity is not consent, misconduct, or evidence against Sita");
    expect(english).toContain("Public repetition does not make the premise true");
    expect(english).toContain("Sita has not been heard");
    expect(english).toContain("making refusal harder");
  });
});

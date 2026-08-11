import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_TWINS_SING_SITA_RETURNS_SCENE_OUTLINES } from "./ramayana-twins-sing-sita-returns-outline";
import { RAMAYANA_TWINS_SING_SITA_RETURNS_PLAYABLE_SCENES } from "./ramayana-twins-sing-sita-returns-playable";

describe("Ramayana twins-sing-Sita-returns playable stories", () => {
  const outlineById = new Map(RAMAYANA_TWINS_SING_SITA_RETURNS_SCENE_OUTLINES.map((outline) => [outline.id, outline]));

  it("partitions every Uttara source ordinal from 103 through 110 exactly once", () => {
    expect(RAMAYANA_TWINS_SING_SITA_RETURNS_PLAYABLE_SCENES).toHaveLength(8);
    expect(RAMAYANA_TWINS_SING_SITA_RETURNS_PLAYABLE_SCENES.reduce((n, item) => n + item.moment.beats.length, 0)).toBe(30);
    const covered = RAMAYANA_TWINS_SING_SITA_RETURNS_PLAYABLE_SCENES.flatMap((item) => {
      const outline = outlineById.get(item.id)!;
      expect(getDuttKandaSpanSha256s("uttara", outline.sourceStart, outline.sourceEnd), item.id)
        .toHaveLength(outline.sourceEnd - outline.sourceStart + 1);
      return Array.from(
        { length: outline.sourceEnd - outline.sourceStart + 1 },
        (_, index) => outline.sourceStart + index,
      );
    }).sort((a, b) => a - b);
    expect(covered).toEqual(Array.from({ length: 8 }, (_, index) => index + 103));
  });

  it("keeps scenes navigable and beats unique, bilingual, visual, and substantial", () => {
    const beats = RAMAYANA_TWINS_SING_SITA_RETURNS_PLAYABLE_SCENES.flatMap((item) => item.moment.beats);
    expect(new Set(beats.map((entry) => entry.id)).size).toBe(beats.length);
    for (const item of RAMAYANA_TWINS_SING_SITA_RETURNS_PLAYABLE_SCENES) {
      expect(item.nodeIds.length, item.id).toBeGreaterThanOrEqual(8);
      for (const entry of item.moment.beats) {
        expect(entry.narration.en.length, entry.id).toBeGreaterThan(180);
        expect(entry.narration.hi.length, entry.id).toBeGreaterThan(150);
        expect(entry.visualCue.length, entry.id).toBeGreaterThan(70);
        expect(entry.narration.en, entry.id).not.toMatch(/\b(?:source|story|narrative|consumer|devam|citation|chapter|verse|interface|user|player)\b/i);
      }
    }
  });

  it("keeps Sita's absence, repeated ordeal, agency, and irreversible departure explicit", () => {
    const english = RAMAYANA_TWINS_SING_SITA_RETURNS_PLAYABLE_SCENES
      .flatMap((item) => item.moment.beats.map((entry) => entry.narration.en))
      .join(" ");
    expect(english).toContain("a golden image of Sita");
    expect(english).toContain("provision is complete only when recipients");
    expect(english).toContain("Refusal keeps appreciation from becoming purchase");
    expect(english).toContain("Consent under that power cannot be treated as uncomplicated");
    expect(english).toContain("a powerful man's guarantee");
    expect(english).toContain("The new demand is not needed to inform the king");
    expect(english).toContain("not a universal demand that women prove purity");
    expect(english).toContain("Proof had repeatedly failed to secure safety");
    expect(english).toContain("It cannot be romanticised as devotion");
    expect(english).toContain("not a substitute for their mother");
  });
});

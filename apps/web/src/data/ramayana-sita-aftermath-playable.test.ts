import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_SITA_AFTERMATH_SCENE_OUTLINES } from "./ramayana-sita-aftermath-outline";
import { RAMAYANA_SITA_AFTERMATH_PLAYABLE_SCENES } from "./ramayana-sita-aftermath-playable";

describe("Ramayana Sita-and-aftermath playable stories", () => {
  const outlineById = new Map(RAMAYANA_SITA_AFTERMATH_SCENE_OUTLINES.map((outline) => [outline.id, outline]));

  it("partitions every Yuddha source ordinal from 109 through 121 exactly once", () => {
    expect(RAMAYANA_SITA_AFTERMATH_PLAYABLE_SCENES).toHaveLength(13);
    expect(RAMAYANA_SITA_AFTERMATH_PLAYABLE_SCENES.reduce((n, item) => n + item.moment.beats.length, 0)).toBe(52);
    const covered = RAMAYANA_SITA_AFTERMATH_PLAYABLE_SCENES.flatMap((item) => {
      const outline = outlineById.get(item.id)!;
      expect(getDuttKandaSpanSha256s("yuddha", outline.sourceStart, outline.sourceEnd), item.id)
        .toHaveLength(outline.sourceEnd - outline.sourceStart + 1);
      return Array.from({ length: outline.sourceEnd - outline.sourceStart + 1 }, (_, index) => outline.sourceStart + index);
    }).sort((left, right) => left - right);
    expect(covered).toEqual(Array.from({ length: 13 }, (_, index) => index + 109));
  });

  it("keeps every scene navigable and every beat unique, bilingual, visual, and substantial", () => {
    const beatIds = RAMAYANA_SITA_AFTERMATH_PLAYABLE_SCENES.flatMap((item) => item.moment.beats.map((entry) => entry.id));
    expect(new Set(beatIds).size).toBe(beatIds.length);
    for (const item of RAMAYANA_SITA_AFTERMATH_PLAYABLE_SCENES) {
      expect(item.nodeIds.length, item.id).toBeGreaterThanOrEqual(8);
      for (const entry of item.moment.beats) {
        expect(entry.narration.en.length, entry.id).toBeGreaterThan(180);
        expect(entry.narration.hi.length, entry.id).toBeGreaterThan(150);
        expect(entry.visualCue.length, entry.id).toBeGreaterThan(70);
        expect(entry.narration.en, entry.id).not.toMatch(/\b(?:source|story|narrative|consumer|devam|citation|chapter|verse|interface|user|player)\b/i);
      }
    }
  });

  it("preserves grief, agency, coercion, non-retaliation, difficult counsel, shared cost, and homeward urgency", () => {
    const english = RAMAYANA_SITA_AFTERMATH_PLAYABLE_SCENES
      .flatMap((item) => item.moment.beats.map((entry) => entry.narration.en)).join(" ");
    expect(english).toContain("Opposition does not cancel attachment");
    expect(english).toContain("The decision is placed with the person who endured the harm");
    expect(english).toContain("Lack of physical control is not consent");
    expect(english).toContain("This is an epic ordeal produced by humiliation and unequal power");
    expect(english).toContain("feeling pain and preventing harm are not the same action");
    expect(english).toContain("her own precise explanation came first");
    expect(english).toContain("The account preserves the counsel without presenting it as a present-day rule");
    expect(english).toContain("each fallen body as a broken relationship");
    expect(english).toContain("the brother who tried to bring him home is still waiting");
  });
});

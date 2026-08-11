import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_ORIGINS_BEHIND_WAR_SCENE_OUTLINES } from "./ramayana-origins-behind-war-outline";
import { RAMAYANA_ORIGINS_BEHIND_WAR_PLAYABLE_SCENES } from "./ramayana-origins-behind-war-playable";

describe("Ramayana origins-behind-war playable stories", () => {
  const outlineById = new Map(RAMAYANA_ORIGINS_BEHIND_WAR_SCENE_OUTLINES.map((outline) => [outline.id, outline]));

  it("partitions every Uttara source ordinal from 1 through 45 exactly once", () => {
    expect(RAMAYANA_ORIGINS_BEHIND_WAR_PLAYABLE_SCENES).toHaveLength(15);
    expect(RAMAYANA_ORIGINS_BEHIND_WAR_PLAYABLE_SCENES.reduce((n, item) => n + item.moment.beats.length, 0)).toBe(45);
    const covered = RAMAYANA_ORIGINS_BEHIND_WAR_PLAYABLE_SCENES.flatMap((item) => {
      const outline = outlineById.get(item.id)!;
      expect(getDuttKandaSpanSha256s("uttara", outline.sourceStart, outline.sourceEnd), item.id)
        .toHaveLength(outline.sourceEnd - outline.sourceStart + 1);
      return Array.from({ length: outline.sourceEnd - outline.sourceStart + 1 }, (_, index) => outline.sourceStart + index);
    }).sort((left, right) => left - right);
    expect(covered).toEqual(Array.from({ length: 45 }, (_, index) => index + 1));
  });

  it("keeps every scene navigable and every beat unique, bilingual, visual, and substantial", () => {
    const beatIds = RAMAYANA_ORIGINS_BEHIND_WAR_PLAYABLE_SCENES.flatMap((item) => item.moment.beats.map((entry) => entry.id));
    expect(new Set(beatIds).size).toBe(beatIds.length);
    for (const item of RAMAYANA_ORIGINS_BEHIND_WAR_PLAYABLE_SCENES) {
      expect(item.nodeIds.length, item.id).toBeGreaterThanOrEqual(8);
      for (const entry of item.moment.beats) {
        expect(entry.narration.en.length, entry.id).toBeGreaterThan(180);
        expect(entry.narration.hi.length, entry.id).toBeGreaterThan(150);
        expect(entry.visualCue.length, entry.id).toBeGreaterThan(70);
        expect(entry.narration.en, entry.id).not.toMatch(/\b(?:source|story|narrative|consumer|devam|citation|chapter|verse|interface|user|player)\b/i);
      }
    }
  });

  it("preserves choice, victims' agency, non-prescriptive epic events, and limits on retrospective theology", () => {
    const english = RAMAYANA_ORIGINS_BEHIND_WAR_PLAYABLE_SCENES
      .flatMap((item) => item.moment.beats.map((entry) => entry.narration.en)).join(" ");
    expect(english).toContain("Shared ancestry produces no single moral destiny");
    expect(english).toContain("they neither command conquest nor approve abduction");
    expect(english).toContain("neither her solitude nor her practice causes it");
    expect(english).toContain("not health advice");
    expect(english).toContain("The responsibility belongs entirely to the person who chose coercion");
    expect(english).toContain("it does not undo Rambha's harm");
    expect(english).toContain("without ridicule or an attempt to diagnose it through modern medicine");
    expect(english).toContain("Prophecy does not erase choice");
    expect(english).toContain("Sita's suffering remains real");
  });
});

import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_LANKA_SURROUNDED_SCENE_OUTLINES } from "./ramayana-lanka-surrounded-outline";
import { RAMAYANA_LANKA_SURROUNDED_PLAYABLE_SCENES } from "./ramayana-lanka-surrounded-playable";

describe("Ramayana Lanka-surrounded playable stories", () => {
  const outlineById = new Map(RAMAYANA_LANKA_SURROUNDED_SCENE_OUTLINES.map((outline) => [outline.id, outline]));

  it("partitions every Yuddha source ordinal from 25 through 44 exactly once", () => {
    expect(RAMAYANA_LANKA_SURROUNDED_PLAYABLE_SCENES).toHaveLength(13);
    expect(RAMAYANA_LANKA_SURROUNDED_PLAYABLE_SCENES.reduce((n, scene) => n + scene.moment.beats.length, 0)).toBe(54);
    const covered = RAMAYANA_LANKA_SURROUNDED_PLAYABLE_SCENES.flatMap((scene) => {
      const outline = outlineById.get(scene.id)!;
      expect(getDuttKandaSpanSha256s("yuddha", outline.sourceStart, outline.sourceEnd), scene.id)
        .toHaveLength(outline.sourceEnd - outline.sourceStart + 1);
      return Array.from(
        { length: outline.sourceEnd - outline.sourceStart + 1 },
        (_, index) => outline.sourceStart + index,
      );
    }).sort((left, right) => left - right);
    expect(covered).toEqual(Array.from({ length: 20 }, (_, index) => index + 25));
  });

  it("keeps every scene navigable and every beat bilingual, visual, and substantial", () => {
    for (const scene of RAMAYANA_LANKA_SURROUNDED_PLAYABLE_SCENES) {
      expect(scene.nodeIds.length, scene.id).toBeGreaterThanOrEqual(8);
      for (const item of scene.moment.beats) {
        expect(item.narration.en.length, item.id).toBeGreaterThan(180);
        expect(item.narration.hi.length, item.id).toBeGreaterThan(150);
        expect(item.visualCue.length, item.id).toBeGreaterThan(70);
        expect(item.narration.en, item.id).not.toMatch(/\b(?:source|story|narrative|consumer|devam|citation|chapter|verse|interface|user|player)\b/i);
      }
    }
  });

  it("preserves agency, truth, restraint, civilian cost, and battlefield uncertainty", () => {
    const english = RAMAYANA_LANKA_SURROUNDED_PLAYABLE_SCENES
      .flatMap((scene) => scene.moment.beats.map((item) => item.narration.en)).join(" ");
    expect(english).toContain("fear as permission for immediate killing");
    expect(english).toContain("asks for something more immediately useful");
    expect(english).toContain("the ruler is deliberately closing them");
    expect(english).toContain("Friendly purpose does not automatically make every footprint harmless");
    expect(english).toContain("Affection does not erase accountability");
    expect(english).toContain("Ravana rejects restitution and attacks the person carrying it");
    expect(english).toContain("Combat cannot be presented as points accumulating over an empty arena");
    expect(english).toContain("without dwelling on bodily spectacle");
    expect(english).toContain("self-blame and a wish to die are signs of acute distress");
    expect(english).toContain("it need not be described as proof of an innately corrupt nature");
  });
});

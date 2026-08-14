import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_LANKA_BURNS_SCENE_OUTLINES } from "./ramayana-lanka-burns-outline";
import { RAMAYANA_LANKA_BURNS_PLAYABLE_SCENES } from "./ramayana-lanka-burns-playable";

describe("Ramayana Lanka-burns playable stories", () => {
  const outlineById = new Map(RAMAYANA_LANKA_BURNS_SCENE_OUTLINES.map((outline) => [outline.id, outline]));

  it("partitions every Sundara source ordinal from 40 through 54 exactly once", () => {
    expect(RAMAYANA_LANKA_BURNS_PLAYABLE_SCENES).toHaveLength(15);
    expect(RAMAYANA_LANKA_BURNS_PLAYABLE_SCENES.reduce((n, scene) => n + scene.moment.beats.length, 0)).toBe(69);
    const covered = RAMAYANA_LANKA_BURNS_PLAYABLE_SCENES.flatMap((scene) => {
      const outline = outlineById.get(scene.id)!;
      expect(getDuttKandaSpanSha256s("sundara", outline.sourceStart, outline.sourceEnd)).toHaveLength(
        outline.sourceEnd - outline.sourceStart + 1,
      );
      return Array.from({ length: outline.sourceEnd - outline.sourceStart + 1 }, (_, i) => outline.sourceStart + i);
    }).sort((left, right) => left - right);
    expect(covered).toEqual([40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54]);
  });

  it("keeps every scene navigable and every beat bilingual, visual, and substantial", () => {
    for (const scene of RAMAYANA_LANKA_BURNS_PLAYABLE_SCENES) {
      expect(scene.nodeIds.length, scene.id).toBeGreaterThanOrEqual(8);
      for (const beat of scene.moment.beats) {
        expect(beat.narration.en.length, beat.id).toBeGreaterThan(180);
        expect(beat.narration.hi.length, beat.id).toBeGreaterThan(150);
        expect(beat.visualCue.length, beat.id).toBeGreaterThan(70);
      }
    }
  });

  it("preserves agency, envoy law, civilian consequences, remorse, and verification", () => {
    const english = RAMAYANA_LANKA_BURNS_PLAYABLE_SCENES
      .flatMap((scene) => scene.moment.beats.map((beat) => beat.narration.en))
      .join(" ");
    expect(english).toContain("Any further action must not erase that result");
    expect(english).toContain("She protects the contact without inventing a detailed story");
    expect(english).toContain("Military advantage and cultural loss now occupy the same burning landmark");
    expect(english).toContain("Survival here comes through retreat");
    expect(english).toContain("Ravana receives a son's death, not another abstract loss");
    expect(english).toContain("physical binding cancels the Brahma weapon's hold");
    expect(english).toContain("Respecting capability does not require excusing its use");
    expect(english).toContain("every death and destroyed place was inevitable");
    expect(english).toContain("the immediate requested action is release, not destruction for its own sake");
    expect(english).toContain("rulers do not kill envoys for performing their assigned function");
    expect(english).toContain("not a test that makes harmed people prove moral perfection");
    expect(english).toContain("These lives are not interchangeable with Ravana's commanders");
    expect(english).toContain("an acute crisis produced by assumed catastrophe");
    expect(english).toContain("Hope alone does not prove safety");
    expect(english).toContain("chooses to verify Sita's safety directly before returning north");
  });
});

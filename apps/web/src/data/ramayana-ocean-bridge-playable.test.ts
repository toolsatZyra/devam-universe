import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_OCEAN_BRIDGE_SCENE_OUTLINES } from "./ramayana-ocean-bridge-outline";
import { RAMAYANA_OCEAN_BRIDGE_PLAYABLE_SCENES } from "./ramayana-ocean-bridge-playable";

describe("Ramayana ocean-and-bridge playable stories", () => {
  const outlineById = new Map(RAMAYANA_OCEAN_BRIDGE_SCENE_OUTLINES.map((outline) => [outline.id, outline]));

  it("partitions every Yuddha source ordinal from 1 through 24 exactly once", () => {
    expect(RAMAYANA_OCEAN_BRIDGE_PLAYABLE_SCENES).toHaveLength(15);
    expect(RAMAYANA_OCEAN_BRIDGE_PLAYABLE_SCENES.reduce((n, scene) => n + scene.moment.beats.length, 0)).toBe(74);
    const covered = RAMAYANA_OCEAN_BRIDGE_PLAYABLE_SCENES.flatMap((scene) => {
      const outline = outlineById.get(scene.id)!;
      expect(getDuttKandaSpanSha256s("yuddha", outline.sourceStart, outline.sourceEnd), scene.id)
        .toHaveLength(outline.sourceEnd - outline.sourceStart + 1);
      return Array.from(
        { length: outline.sourceEnd - outline.sourceStart + 1 },
        (_, index) => outline.sourceStart + index,
      );
    }).sort((left, right) => left - right);
    expect(covered).toEqual(Array.from({ length: 24 }, (_, index) => index + 1));
  });

  it("keeps every scene navigable and every beat bilingual, visual, and substantial", () => {
    for (const scene of RAMAYANA_OCEAN_BRIDGE_PLAYABLE_SCENES) {
      expect(scene.nodeIds.length, scene.id).toBeGreaterThanOrEqual(8);
      for (const item of scene.moment.beats) {
        expect(item.narration.en.length, item.id).toBeGreaterThan(180);
        expect(item.narration.hi.length, item.id).toBeGreaterThan(150);
        expect(item.visualCue.length, item.id).toBeGreaterThan(70);
        expect(item.narration.en, item.id).not.toMatch(/\b(?:source|story|narrative|consumer|devam|citation|chapter|verse|interface|user|player)\b/i);
      }
    }
  });

  it("preserves difficult conduct, security judgment, refuge, ecology, and engineering without endorsement", () => {
    const english = RAMAYANA_OCEAN_BRIDGE_PLAYABLE_SCENES
      .flatMap((scene) => scene.moment.beats.map((item) => item.narration.en)).join(" ");
    expect(english).toContain("Grief need not disappear before deliberation begins");
    expect(english).toContain("Advantage and consequence enter the same map");
    expect(english).toContain("friendly purpose does not automatically make every footprint harmless");
    expect(english).toContain("The proposal is sexual violence, not romance");
    expect(english).toContain("they are not reliable descriptions of whole communities");
    expect(english).toContain("These are indicators, not magical proof");
    expect(english).toContain("making refuge a rule rather than a reward for proven usefulness");
    expect(english).toContain("neither fact makes torture an acceptable answer");
    expect(english).toContain("Loyal support here means interrupting dangerous escalation");
    expect(english).toContain("Redirecting violence spares the sea, but it does not make distant people or terrain expendable");
    expect(english).toContain("the material does not appear from nowhere");
    expect(english).toContain("because Ravana deliberately rejects return");
  });
});

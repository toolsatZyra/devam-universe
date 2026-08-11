import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_SAMPATI_REVEALS_LANKA_SCENE_OUTLINES } from "./ramayana-sampati-reveals-lanka-outline";
import { RAMAYANA_SAMPATI_REVEALS_LANKA_PLAYABLE_SCENES } from "./ramayana-sampati-reveals-lanka-playable";

describe("Ramayana sampati-reveals-lanka playable stories", () => {
  const outlineById = new Map(RAMAYANA_SAMPATI_REVEALS_LANKA_SCENE_OUTLINES.map((outline) => [outline.id, outline]));

  it("partitions every Kishkindha section from 50 through 64 exactly once", () => {
    expect(RAMAYANA_SAMPATI_REVEALS_LANKA_PLAYABLE_SCENES).toHaveLength(15);
    expect(RAMAYANA_SAMPATI_REVEALS_LANKA_PLAYABLE_SCENES.reduce((n, scene) => n + scene.moment.beats.length, 0)).toBe(60);
    const covered = RAMAYANA_SAMPATI_REVEALS_LANKA_PLAYABLE_SCENES.flatMap((scene) => {
      const outline = outlineById.get(scene.id)!;
      expect(getDuttKandaSpanSha256s("kishkindha", outline.sourceStart, outline.sourceEnd)).toHaveLength(outline.sourceEnd - outline.sourceStart + 1);
      return Array.from({ length: outline.sourceEnd - outline.sourceStart + 1 }, (_, i) => outline.sourceStart + i);
    });
    expect(covered).toEqual(Array.from({ length: 15 }, (_, i) => i + 50));
  });

  it("keeps every scene navigable and every beat bilingual, visual, and substantial", () => {
    for (const scene of RAMAYANA_SAMPATI_REVEALS_LANKA_PLAYABLE_SCENES) {
      expect(scene.nodeIds.length, scene.id).toBeGreaterThanOrEqual(4);
      for (const beat of scene.moment.beats) {
        expect(beat.narration.en.length, beat.id).toBeGreaterThan(180);
        expect(beat.narration.hi.length, beat.id).toBeGreaterThan(150);
        expect(beat.visualCue.length, beat.id).toBeGreaterThan(70);
      }
    }
  });

  it("preserves rescue agency, attributed political conflict, converging testimony, grief, and the unsolved crossing", () => {
    const english = RAMAYANA_SAMPATI_REVEALS_LANKA_PLAYABLE_SCENES
      .flatMap((scene) => scene.moment.beats.map((beat) => beat.narration.en))
      .join(" ");
    expect(english).toContain("she restores their agency and resumes her own duty");
    expect(english).toContain("These are Angada's frightened conclusions");
    expect(english).toContain("The argument is strategic pressure");
    expect(english).toContain("a chance to interfere appeared, and the witness let it go");
    expect(english).toContain("Jatayu into a clue");
    expect(english).toContain("road to Lanka ends here");
    expect(english).not.toContain("Queen Tara");
  });
});

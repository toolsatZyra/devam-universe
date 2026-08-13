import { describe, expect, it } from "vitest";
import { RAMAYANA_FIRST_LANKA_WAR_LIBRARY_SCENES } from "./ramayana-first-lanka-war-library-scenes";

describe("Ramayana first-Lanka-war library scenes", () => {
  it("replaces Uttara 6-8 with exact non-overlapping source units", () => {
    expect(RAMAYANA_FIRST_LANKA_WAR_LIBRARY_SCENES.map((scene) => [scene.sourceStart, scene.sourceEnd])).toEqual([[6, 6], [7, 7], [8, 8]]);
    expect(RAMAYANA_FIRST_LANKA_WAR_LIBRARY_SCENES.every((scene) => scene.spanSha256s.length === 1 && /^[0-9a-f]{64}$/.test(scene.spanSha256s[0]))).toBe(true);
  });

  it("carries fifteen substantial unique bilingual beats", () => {
    const beats = RAMAYANA_FIRST_LANKA_WAR_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats);
    expect(beats).toHaveLength(15);
    expect(new Set(beats.map((beat) => beat.id)).size).toBe(15);
    expect(beats.every((beat) => beat.narration.en.length > 120 && beat.narration.hi.length > 100)).toBe(true);
  });

  it("preserves rejected counsel, noncombatant boundaries, retreat ethics, and displacement", () => {
    const english = RAMAYANA_FIRST_LANKA_WAR_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats).map((beat) => beat.narration.en).join(" ");
    expect(english).toContain("not the inevitable destiny of the city or lineage");
    expect(english).toContain("not as a consequence-free display");
    expect(english).toContain("real ethical tension inside the epic battle");
    expect(english).toContain("displacement is the missing bridge");
  });
});

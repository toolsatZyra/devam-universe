import { describe, expect, it } from "vitest";
import { RAMAYANA_SWETADVIPA_DEPARTURES_LIBRARY_SCENES } from "./ramayana-swetadvipa-departures-library-scenes";

describe("Ramayana Swetadvipa and departures library scenes", () => {
  it("replaces Uttara 46-53 with exact, non-overlapping source-unit scenes", () => {
    expect(RAMAYANA_SWETADVIPA_DEPARTURES_LIBRARY_SCENES.map((scene) => [scene.sourceStart, scene.sourceEnd])).toEqual([
      [46, 46], [47, 47], [48, 48], [49, 49], [50, 50], [51, 51], [52, 52], [53, 53],
    ]);
    expect(RAMAYANA_SWETADVIPA_DEPARTURES_LIBRARY_SCENES.every(
      (scene) => scene.spanSha256s.length === 1 && /^[0-9a-f]{64}$/.test(scene.spanSha256s[0]),
    )).toBe(true);
  });

  it("carries thirty-five substantial unique bilingual beats", () => {
    const beats = RAMAYANA_SWETADVIPA_DEPARTURES_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats);
    expect(beats).toHaveLength(35);
    expect(new Set(beats.map((beat) => beat.id)).size).toBe(35);
    expect(beats.every((beat) => beat.narration.en.length > 150 && beat.narration.hi.length > 130)).toBe(true);
  });

  it("preserves agency, consent, claim-type, and source boundaries", () => {
    const english = RAMAYANA_SWETADVIPA_DEPARTURES_LIBRARY_SCENES
      .flatMap((scene) => scene.moment.beats)
      .map((beat) => beat.narration.en)
      .join(" ");
    expect(english).toContain("their collective agency—not a judgment about anyone's body");
    expect(english).toContain("coercive control does not become protection");
    expect(english).toContain("not measured medical, mortality, climate, or satisfaction data");
    expect(english).toContain("later abandonment is separate, deceptive");
    expect(english).toContain("No decision, summons, journey, or abandonment has yet occurred");
  });

  it("keeps the section 54 decision outside this repaired turn", () => {
    const finalScene = RAMAYANA_SWETADVIPA_DEPARTURES_LIBRARY_SCENES.at(-1);
    expect(finalScene?.sourceEnd).toBe(53);
    expect(finalScene?.moment.beats.at(-1)?.characterIds).toContain("no-order-yet");
  });
});

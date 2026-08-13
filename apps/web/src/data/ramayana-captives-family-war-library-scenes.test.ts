import { describe, expect, it } from "vitest";
import { RAMAYANA_CAPTIVES_FAMILY_WAR_LIBRARY_SCENES } from "./ramayana-captives-family-war-library-scenes";

describe("Ramayana captives and family-war library scenes", () => {
  it("replaces Uttara 29-30 with exact, non-overlapping source units", () => {
    expect(RAMAYANA_CAPTIVES_FAMILY_WAR_LIBRARY_SCENES).toHaveLength(2);
    expect(RAMAYANA_CAPTIVES_FAMILY_WAR_LIBRARY_SCENES.map((scene) => [scene.sourceStart, scene.sourceEnd])).toEqual([
      [29, 29],
      [30, 30],
    ]);
    expect(RAMAYANA_CAPTIVES_FAMILY_WAR_LIBRARY_SCENES.every((scene) =>
      scene.spanSha256s.length === 1 && /^[0-9a-f]{64}$/.test(scene.spanSha256s[0])
    )).toBe(true);
  });

  it("carries ten substantial unique bilingual story beats", () => {
    const beats = RAMAYANA_CAPTIVES_FAMILY_WAR_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats);
    expect(beats).toHaveLength(10);
    expect(new Set(beats.map((beat) => beat.id)).size).toBe(beats.length);
    expect(beats.every((beat) => beat.narration.en.length > 120 && beat.narration.hi.length > 100)).toBe(true);
  });

  it("preserves consent, coercion, uncertainty, and non-instruction boundaries", () => {
    const english = RAMAYANA_CAPTIVES_FAMILY_WAR_LIBRARY_SCENES
      .flatMap((scene) => scene.moment.beats)
      .map((beat) => beat.narration.en)
      .join(" ");
    expect(english).toContain("not invitation, romance, or consent");
    expect(english).toContain("not a modern rule of duty or consent");
    expect(english).toContain("does not tell us Kumbhinasi's wishes at the time of seizure");
    expect(english).toContain("not instructions for modern ritual practice");
    expect(english).toContain("does not prove that the original abduction was harmless");
  });

  it("keeps the captives and Kumbhinasi active rather than decorative", () => {
    const byId = new Map(RAMAYANA_CAPTIVES_FAMILY_WAR_LIBRARY_SCENES.map((scene) => [scene.id, scene]));
    expect(byId.get("captive-women-condemn-ravanas-abductions")?.moment.beats.map((beat) => beat.id)).toEqual(
      expect.arrayContaining(["the-captives-grieve-specific-homes", "their-condemnation-reframes-the-campaign"]),
    );
    expect(byId.get("kumbhinasi-stops-ravana-from-killing-madhu")?.moment.beats.map((beat) => beat.id)).toEqual(
      expect.arrayContaining(["kumbhinasi-intervenes-before-ravana-kills-madhu", "a-spared-life-becomes-a-coerced-alliance"]),
    );
  });
});

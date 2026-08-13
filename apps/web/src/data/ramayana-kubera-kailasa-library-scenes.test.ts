import { describe, expect, it } from "vitest";
import { getDuttKandaSpanSha256s } from "./ramayana-dutt-source-spans";
import { RAMAYANA_KUBERA_KAILASA_LIBRARY_SCENES } from "./ramayana-kubera-kailasa-library-scenes";

describe("Ramayana Kubera-and-Kailasa library scenes", () => {
  it("replaces Uttara 14-16 with one exact non-overlapping scene per source unit", () => {
    expect(RAMAYANA_KUBERA_KAILASA_LIBRARY_SCENES).toHaveLength(3);
    expect(RAMAYANA_KUBERA_KAILASA_LIBRARY_SCENES.map((scene) => [scene.sourceStart, scene.sourceEnd])).toEqual([
      [14, 14], [15, 15], [16, 16],
    ]);
    for (const scene of RAMAYANA_KUBERA_KAILASA_LIBRARY_SCENES) {
      expect(scene.spanSha256s).toEqual(getDuttKandaSpanSha256s("uttara", scene.sourceStart, scene.sourceEnd));
    }
  });

  it("carries substantial unique bilingual story beats", () => {
    const beats = RAMAYANA_KUBERA_KAILASA_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats);
    expect(beats).toHaveLength(15);
    expect(new Set(beats.map((beat) => beat.id)).size).toBe(beats.length);
    expect(beats.every((beat) => beat.narration.en.length > 150 && beat.narration.hi.length > 120)).toBe(true);
  });

  it("preserves defence, attributed moral speech, violent transfer, bodily dignity, and conditional gifts", () => {
    const text = RAMAYANA_KUBERA_KAILASA_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats)
      .map((beat) => beat.narration.en).join(" ");
    expect(text).toContain("Their retreat is a survival response after severe losses");
    expect(text).toContain("not personalised predictions of hell or guaranteed outcomes");
    expect(text).toContain("does not convert seizure after fraternal war into inheritance, gift, or consent");
    expect(text).toContain("bodily difference is not presented as a legitimate object of contempt");
    expect(text).toContain("The divine gift expands his means; it does not approve the campaign");
  });
});

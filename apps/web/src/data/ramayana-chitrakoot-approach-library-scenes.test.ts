import { describe, expect, it } from "vitest";
import { RAMAYANA_CHITRAKOOT_APPROACH_LIBRARY_SCENES } from "./ramayana-chitrakoot-approach-library-scenes";

describe("Ramayana Chitrakoot approach library scenes", () => {
  it("replaces Ayodhya 93-98 with one exact non-overlapping scene per source unit", () => {
    expect(RAMAYANA_CHITRAKOOT_APPROACH_LIBRARY_SCENES).toHaveLength(6);
    expect(RAMAYANA_CHITRAKOOT_APPROACH_LIBRARY_SCENES.map((scene) => [
      scene.sourceStart,
      scene.sourceEnd,
      scene.sourceGlobalOrdinal,
    ])).toEqual(Array.from({ length: 6 }, (_, index) => [index + 93, index + 93, index + 168]));
    expect(RAMAYANA_CHITRAKOOT_APPROACH_LIBRARY_SCENES.map((scene) => scene.spanSha256s)).toEqual([
      ["f650bfa109c4e16f6a90cd3fb3a4713fb6909fe7603b2d0862139be688c076be"],
      ["07c130e247206910b1e09d420fa2b579854c8457a1abfb4657ca95f9cb696b2a"],
      ["6450f500bc63f59bb08ef108ef04b071e7dd22b24cde33680abd0b53528afcb8"],
      ["e27fb17288c3c2b5389c2c55f46f8960e17a262a4691dc219ec2fda576890184"],
      ["e2c91a23501773ed4fc29a8ff80a35edee0859f9dd28befeb5ad9eba4f43492a"],
      ["d62ecae623a94b0cc1e2a7c3307c2b11f2ee32d7aeb0400bfcf4d9f5c097f410"],
    ]);
  });

  it("carries substantial unique bilingual story beats", () => {
    const beats = RAMAYANA_CHITRAKOOT_APPROACH_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats);
    expect(beats).toHaveLength(24);
    expect(new Set(beats.map((beat) => beat.id)).size).toBe(beats.length);
    expect(beats.every((beat) => beat.narration.en.length > 150 && beat.narration.hi.length > 120)).toBe(true);
  });

  it("separates evidence from motive and refuses to turn violent or ascetic material into guidance", () => {
    const text = RAMAYANA_CHITRAKOOT_APPROACH_LIBRARY_SCENES.flatMap((scene) => scene.moment.beats)
      .map((beat) => beat.narration.en).join(" ");
    expect(text).toContain("it still does not establish Bharata's purpose");
    expect(text).toContain("not endorsed action or heroic guidance");
    expect(text).toContain("not instructions for the user");
    expect(text).toContain("orders the entire force to stay where it is and not advance");
    expect(text).toContain("finally establish the intention that Lakshmana could not know");
  });
});

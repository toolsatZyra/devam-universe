import { describe, expect, it } from "vitest";
import { searchPreservedSourceCatalog } from "./source-catalog-search";

describe("preserved source catalog search", () => {
  it("finds preserved Mahabharata carriers without promoting them to passages", () => {
    const result = searchPreservedSourceCatalog("Mahabharata");
    expect(result.totalMatches).toBeGreaterThanOrEqual(5);
    expect(result.matches.some((match) => match.title === "mahabharata-devanagari.xml")).toBe(true);
    expect(result.boundary).toContain("not a verified passage");
  });

  it("finds all seven newly acquired Dutt Ramayana scans", () => {
    const result = searchPreservedSourceCatalog("Ramayana Manmatha Nath Dutt", 24);
    const dutt = result.matches.filter((match) => match.title.startsWith("The_Ramayana_Manmatha_Nath_Dutt_Canto_"));
    expect(dutt).toHaveLength(7);
    expect(dutt.reduce((total, match) => total + match.bytes, 0)).toBe(72_688_252);
  });

  it("finds the three provenance-mapped Durga scan witnesses", () => {
    const expected = new Set([
      "00cd5a20601177eb3258980f17c7e495af1ac6ceb0879a67c31f296c57729e93",
      "69a59f17fb29d12fbc7d0b0201ee7f07bac62fbf5b306ef3c032b84266a82d79",
      "7a0921dc119f2d6e92dc97ea20a775fc4ffc9b966923eb155373a6c4946a9982",
    ]);
    const durga = searchPreservedSourceCatalog("Durga Saptashati", 24);
    const devi = searchPreservedSourceCatalog("Devi Mahatmya Poley", 24);
    const discovered = new Set([...durga.matches, ...devi.matches].filter((match) => expected.has(match.sha256)).map((match) => match.sha256));
    expect(discovered).toEqual(expected);
    expect(durga.boundary).toContain("not a verified passage");
  });

  it("finds the current Mudgala Purana carrier as metadata without promoting its rights or text", () => {
    const result = searchPreservedSourceCatalog("Mudgala Purana Mahasabde", 24);
    expect(result.matches).toContainEqual({
      sha256: "678edb439abdc43fa3db1148296d4b4f984cfd30cf750982465d16fdf97af8cc",
      title: "Mudgala-Puranam-MV-Mahasabde-1976-NSP.pdf",
      bytes: 63_438_893,
      suffixes: [".pdf"],
      roles: ["canonical_acquisition"],
      provenanceCount: 1,
    });
    expect(result.boundary).toContain("rights clearance");
    expect(result.boundary).toContain("not a verified passage");
  });

  it("finds the exact Ganesha Purana Wikisource acquisitions and the separate internal scan", () => {
    const wikisource = searchPreservedSourceCatalog("Ganesha Purana Wikisource", 24);
    expect(new Set(wikisource.matches.map((match) => match.sha256))).toEqual(new Set([
      "01d8aec05025957650898443b3182bc271e84a490e2f41b526165260e26026b8",
      "0cf4723a2f49f5a431b03b0577b48cd1b8bbaee4355d8811a3d48e5509c1a1b3",
      "14aab00040e20c533ce5fdd769d58fd4ebfec62dfd67729a569bb29124a23233",
    ]));
    const scan = searchPreservedSourceCatalog("Ganesha Purana Nag Publishers", 24);
    expect(scan.matches.some((match) =>
      match.sha256 === "aa6972405a88b34fa8db38dc07793424656961527149c36e80c0e100965245a5"
      && match.bytes === 46_157_686
    )).toBe(true);
    expect(scan.boundary).toContain("not a verified passage");
  });

  it("returns no metadata guesses for an absent token", () => {
    expect(searchPreservedSourceCatalog("zzzz-no-such-devam-source").matches).toEqual([]);
  });
});

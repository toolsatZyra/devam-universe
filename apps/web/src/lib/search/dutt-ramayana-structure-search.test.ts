import { describe, expect, it } from "vitest";

import { worldEdges, worldNodes } from "../../data/atlas";
import { searchLibrary } from "./library-search";
import { DUTT_RAMAYANA_STRUCTURE_SEARCH_FIXITY, searchDuttRamayanaStructure } from "./dutt-ramayana-structure-search";

describe("Manmatha Nath Dutt Ramayana structure search", () => {
  it("returns the complete selected electronic-edition structure offline", async () => {
    const response = await searchLibrary("Manmatha Nath Dutt Ramayana", "en");
    expect(response.results).toHaveLength(1);
    expect(response.results[0]).toMatchObject({
      id: "dutt-ramayana-seven-kanda-structure-en",
      claimKind: "source_bounded_edition_structure",
    });
    expect(response.results[0].citations).toEqual(expect.arrayContaining([
      expect.objectContaining({ locator: expect.objectContaining({ contract: "DEVAM_DUTT_PG_SECTION_BYTE_SPAN_V1" }) }),
    ]));
    expect(response.results[0].statement).toContain("652 source-ordered English sections");
    expect(response.results[0].citations).toHaveLength(14);
    expect(response.results[0].sourceBoundary).toContain("not yet reconciled page by page");
  });

  it("returns one exact kanda with its opening and terminal citation endpoints", () => {
    const results = searchDuttRamayanaStructure("Dutt Ramayana Uttara Kanda");
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      id: "dutt-ramayana-uttara-structure-en",
      citations: [
        { sourceOrdinal: 1, locator: { ebook_id: 62496, literal_marker: "I" } },
        { sourceOrdinal: 123, locator: { ebook_id: 62496, literal_marker: "CXXIV" } },
      ],
    });
    expect(results[0].statement).toContain("123 source-ordered sections");
    expect(results[0].statement).toContain("25 recorded numbering anomalies");
  });

  it("does not capture generic Ramayana, another translation, or Ramcharitmanas", () => {
    expect(searchDuttRamayanaStructure("Tell me about the Ramayana")).toEqual([]);
    expect(searchDuttRamayanaStructure("Griffith Ramayana Uttara Kanda")).toEqual([]);
    expect(searchDuttRamayanaStructure("Ramcharitmanas seven sopanas")).toEqual([]);
  });

  it("freezes the selected edition without copying its source body", () => {
    expect(DUTT_RAMAYANA_STRUCTURE_SEARCH_FIXITY).toEqual({
      packFileSha256: "2de6aeb926124f8e134c66c1d29bfd422fda38bc808931573f553943ff19c197",
      packetSha256: "edc6d858017a4788a65feac404583374b007b1084749925381abd47ca1a79d13",
      passageRootSha256: "1efc394e9fd07b394d74158344120d3cd247b63c8a362759266687c23c5307d8",
      hostedRootSha256: "3226377be38be511463e8c09d56898a6b9f658d649cb376e51e3ac7c94a81c42",
      sourceObjectCount: 4,
      kandaCount: 7,
      passageCount: 652,
      sourcePayloadsCopied: false,
    });
  });

  it("exposes the same bounded edition through the Living Atlas", () => {
    const node = worldNodes.find((candidate) => candidate.id === "dutt-ramayana");
    expect(node).toMatchObject({
      gatewayId: "ramayana",
      searchQuery: "Manmatha Nath Dutt Ramayana seven kandas",
    });
    expect(node?.evidenceBoundary).toContain("print-scan reconciliation is incomplete");
    expect(worldEdges).toContainEqual({
      id: "ramayana-dutt-ramayana",
      from: "ramayana",
      to: "dutt-ramayana",
      relation: "English prose edition",
      relationKind: "text",
    });
  });
});

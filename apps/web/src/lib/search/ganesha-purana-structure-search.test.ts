import { describe, expect, it } from "vitest";

import { worldEdges, worldNodes } from "../../data/atlas";
import { searchLibrary } from "./library-search";
import { GANESHA_PURANA_STRUCTURE_SEARCH_FIXITY, searchGaneshaPuranaStructure } from "./ganesha-purana-structure-search";

describe("source-bounded Ganesha Purana structure search", () => {
  it("retrieves the complete exact provider-page structure without an edition claim", () => {
    const results = searchGaneshaPuranaStructure("Ganesha Purana two khandas 247 chapters");
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      id: "ganesha-purana-two-khanda-structure-en",
      claimKind: "source_bounded_structure",
      languageCode: "en",
    });
    expect(results[0].citations).toHaveLength(4);
    expect(results[0].citations.map((citation) => citation.locator.khanda)).toEqual(["upasana", "upasana", "krida", "krida"]);
    expect(results[0].sourceBoundary).toContain("underlying print edition and textual recension are unidentified");
  });

  it("narrows an explicit Hindi division query to the exact Upasana boundary", () => {
    const results = searchGaneshaPuranaStructure("उपासनाखण्ड में कितने अध्याय हैं?", "hi");
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({ title: "उपासनाखण्ड", languageCode: "hi" });
    expect(results[0].citations.map((citation) => citation.locator.chapter_end)).toEqual([1, 92]);
  });

  it("fails closed for generic Ganesha, ritual, and Mudgala queries", () => {
    expect(searchGaneshaPuranaStructure("Tell me about Ganesha")).toEqual([]);
    expect(searchGaneshaPuranaStructure("Ganesha puja vidhi")).toEqual([]);
    expect(searchGaneshaPuranaStructure("Mudgala Purana structure")).toEqual([]);
  });

  it("places the source structure into exact Search without hosted connectivity", async () => {
    const response = await searchLibrary("Ganesha Purana two khandas 247 chapters", "en");
    expect(response.retrievalStatus).toBe("not_configured");
    expect(response.results[0]).toMatchObject({ id: "ganesha-purana-two-khanda-structure-en" });
  });

  it("makes the verified source universe an app-owned Atlas doorway", () => {
    const node = worldNodes.find((candidate) => candidate.id === "ganesha-purana");
    expect(node).toMatchObject({ gatewayId: "ganesha", searchQuery: "Ganesha Purana two khandas 247 chapters" });
    expect(node?.evidenceBoundary).toContain("65 pinned Wikisource revisions");
    expect(searchGaneshaPuranaStructure(node!.searchQuery)).toHaveLength(1);
    expect(worldEdges).toContainEqual({
      id: "ganesha-ganesha-purana",
      from: "ganesha",
      to: "ganesha-purana",
      relation: "source text",
      relationKind: "text",
    });
  });

  it("freezes the compact denominator without copying source payloads", () => {
    expect(GANESHA_PURANA_STRUCTURE_SEARCH_FIXITY).toEqual({
      packFileSha256: "8db3664a5684bb90ca5d53218157d33e217b3b0e5175abd4eb6b1b934fcd127b",
      ingestionPacketSha256: "668f6c5c46d9897447cfcdbcf969b474fe24bf504d316098ad194b0dbeace27d",
      sourcePassageCount: 62,
      divisionCount: 2,
      chapterCount: 247,
      evidenceCitationCount: 4,
      sourcePayloadsCopied: false,
    });
  });
});

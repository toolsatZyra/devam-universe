import { describe, expect, it } from "vitest";

import { worldEdges, worldNodes } from "../../data/atlas";
import { searchLibrary } from "./library-search";
import { DEVIMAHATMYA_SEMANTIC_SEARCH_FIXITY, searchDevimahatmyaSemanticGraph } from "./devimahatmya-semantic-search";

describe("source-bounded Devimahatmya semantic graph search", () => {
  it("retrieves Mahishasura through a real evidence-linked narrative identity", () => {
    const results = searchDevimahatmyaSemanticGraph("Mahishasura in the Devi Mahatmya");
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      id: "durga-devimahatmya-semantic-mahishasura-episode-en",
      title: "Mahiṣāsura",
      languageCode: "en",
      claimKind: "source_bounded_narrative_index",
      citations: [{ sourceOrdinal: 189, locator: { chapter: 83, verse: 41, provider_revision_id: 410281 } }],
    });
    expect(results[0].sourceBoundary).toContain("not a source-original translation");
    expect(results[0].sourceBoundary).toContain("ritual authority");
  });

  it("keeps Shumbha and Nishumbha distinct while sharing the exact source coordinate", () => {
    const results = searchDevimahatmyaSemanticGraph("शुम्भ और निशुम्भ", "hi");
    expect(results.map((result) => result.id)).toEqual([
      "durga-devimahatmya-semantic-shumbha-episode-hi",
      "durga-devimahatmya-semantic-nishumbha-episode-hi",
    ]);
    expect(results.every((result) => result.languageCode === "hi")).toBe(true);
    expect(results.every((result) => result.citations[0].sourceOrdinal === 229)).toBe(true);
  });

  it("does not turn broad Durga or festival queries into unsupported graph claims", () => {
    expect(searchDevimahatmyaSemanticGraph("Durga Puja ritual origin")).toEqual([]);
    expect(searchDevimahatmyaSemanticGraph("complete Shakta theology")).toEqual([]);
  });

  it("places the semantic result into exact Search without requiring hosted connectivity", async () => {
    const response = await searchLibrary("Madhu and Kaitabha", "en");
    expect(response.retrievalStatus).toBe("not_configured");
    expect(response.results[0]).toMatchObject({
      id: "durga-devimahatmya-semantic-madhu-kaitabha-episode-en",
      claimKind: "source_bounded_narrative_index",
    });
  });

  it("makes every evidence-linked identity an explorable Atlas doorway", () => {
    const expected = [
      ["madhu-kaitabha", "Madhu and Kaiṭabha"],
      ["mahishasura", "Mahiṣāsura"],
      ["shumbha", "Śumbha"],
      ["nishumbha", "Niśumbha"],
    ] as const;

    for (const [slug, title] of expected) {
      const node = worldNodes.find((candidate) => candidate.id === slug);
      expect(node).toMatchObject({ gatewayId: "durga", label: title });
      expect(node?.evidenceBoundary).toContain("revision 410281");
      expect(searchDevimahatmyaSemanticGraph(node!.searchQuery)[0]?.title).toBe(title);
      expect(worldEdges).toContainEqual({
        id: `devi-mahatmya-${slug}`,
        from: "devi-mahatmya",
        to: slug,
        relation: "contains narrative of",
      });
    }
  });

  it("freezes the bounded graph denominator without copying source payloads", () => {
    expect(DEVIMAHATMYA_SEMANTIC_SEARCH_FIXITY).toEqual({
      packFileSha256: "07eb59e3ed3d4ab8e586385d6b6dfcbfc9f870ab98d3981291ef6a54d5890b9b",
      sourceSha256: "c7fe701aedeedffde57a51b21aa4f8fec697a7922939fb59ffa985e22cc9b7ae",
      entityCount: 4,
      bilingualClaimCount: 8,
      relationshipCount: 4,
      sourcePayloadsCopied: false,
    });
  });
});

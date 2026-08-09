import { describe, expect, it } from "vitest";

import { worldEdges, worldNodes } from "../../data/atlas";
import { searchLibrary } from "./library-search";
import { GANAPATI_ATHARVASHIRSHA_SEARCH_FIXITY, searchGanapatiAtharvashirsha } from "./ganapatyatharvashirsha-search";

describe("exact-revision Ganapati Atharvashirsha search", () => {
  it("returns complete exact-revision bilingual coverage instead of the unrelated hymn preview", async () => {
    const response = await searchLibrary("Ganapati Atharvashirsha exact revision 415703", "en");
    expect(response.results).toHaveLength(1);
    expect(response.results[0]).toMatchObject({
      id: "ganapati-ganapatyatharvashirsha-rev415703-overview-en",
      claimKind: "exact_revision_translation_coverage",
    });
    expect(response.results[0].citations.map((citation) => citation.sourceOrdinal)).toEqual([0, 15]);
    expect(response.results[0].sourceBoundary).toContain("not source originals");
  });

  it("retrieves an exact numbered translation with source hash, span, and revision", () => {
    const results = searchGanapatiAtharvashirsha("Ganapati Atharvashirsha unit 7", "en");
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      id: "ganapati-ganapatyatharvashirsha-rev415703-translation-07-en",
      claimKind: "source_aligned_translation",
      citations: [{ sourceOrdinal: 7, locator: { provider_revision_id: 415703, numbered_unit: 7 } }],
    });
    expect(results[0].statement).toContain("Om gaṃ gaṇapataye namaḥ");
  });

  it("routes Hindi Ganesha Gayatri to unit 8 while retaining the beta boundary", () => {
    const results = searchGanapatiAtharvashirsha("गणेश गायत्री क्या है?", "hi");
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({ languageCode: "hi", citations: [{ sourceOrdinal: 8 }] });
    expect(results[0].sourceBoundary).toContain("not source originals");
  });

  it("does not capture broad Ganesha, puja, or unrelated Atharvaveda queries", () => {
    expect(searchGanapatiAtharvashirsha("Tell me about Ganesha")).toEqual([]);
    expect(searchGanapatiAtharvashirsha("Ganesh Puja at home")).toEqual([]);
    expect(searchGanapatiAtharvashirsha("Explain the Atharvaveda")).toEqual([]);
  });

  it("freezes the complete selected revision without copying source payloads", () => {
    expect(GANAPATI_ATHARVASHIRSHA_SEARCH_FIXITY).toEqual({
      packFileSha256: "92f2ed67e3b3ab48d2abf06cbbd44404c0c87fe22ed02d5731f8e0d5b236b4da",
      sourceSha256: "43d5f6ca8a2ee7d7a62480a85cdbd526cee04b816db46ac7c3fd8d90757a5178",
      sourcePacketSha256: "46943518b9f94d43daa26272fb3e746f81b4de16e86877956efad227058350b0",
      translationContentRootSha256: "f1b0dfe955482c23ac80637cf2ac49a9e1cc83116a6e2162963cd87b321f9b5e",
      sourcePassageCount: 16,
      bilingualTranslationCount: 32,
      sourcePayloadsCopied: false,
    });
  });

  it("exposes the same exact source boundary through the Living Atlas", () => {
    const node = worldNodes.find((candidate) => candidate.id === "ganapatyatharvashirsha");
    expect(node).toMatchObject({
      gatewayId: "ganesha",
      searchQuery: "Ganapati Atharvashirsha exact revision 415703",
    });
    expect(node?.evidenceBoundary).toContain("pronunciation");
    expect(worldEdges).toContainEqual({
      id: "ganesha-ganapatyatharvashirsha",
      from: "ganesha",
      to: "ganapatyatharvashirsha",
      relation: "source text",
      relationKind: "text",
    });
  });
});

import { describe, expect, it } from "vitest";
import { answerLivingCultureWorld, LIVING_CULTURE_WORLD_FIXITY, searchLivingCultureWorld } from "./living-culture-world";

describe("living cultural heritage world", () => {
  it("keeps the citation-only source boundary explicit", () => {
    expect(LIVING_CULTURE_WORLD_FIXITY).toEqual({
      nodeCount: 10,
      sourceIds: ["unesco-ich-ramlila-00110", "unesco-ich-durga-puja-00703", "unesco-news-durga-puja-kolkata-13423"],
      citationOnly: true,
    });
    const results = searchLivingCultureWorld("Ramlila community masks costumes effigies lights UNESCO", "en");
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((result) => result.citations.every((citation) => citation.rightsLane === "citation_only" && citation.quotation === undefined))).toBe(true);
    expect(results.every((result) => result.sourceBoundary.includes("not retained or quoted"))).toBe(true);
  });

  it("opens every new Atlas destination in exact search", () => {
    const queries = [
      "Ramlila traditional performance Ramayana UNESCO",
      "Ramlila community masks costumes effigies lights UNESCO",
      "Ramnagar Ramlila Benares UNESCO",
      "Ramlila Dussehra autumn performance season UNESCO",
      "Durga Puja Kolkata public art UNESCO",
      "Kumartuli artisan workshops Durga Puja UNESCO",
      "Durga Puja unfired clay image immersion UNESCO",
      "Kolkata Durga Puja installations pavilions artists UNESCO",
      "Durga Puja Bengali drumming dhak UNESCO",
      "Durga Puja tenth day immersion seasonal return UNESCO",
    ];
    for (const query of queries) expect(searchLivingCultureWorld(query, "en").length, query).toBeGreaterThan(0);
  });

  it("continues the same bounded destination through Sarthi", () => {
    const result = answerLivingCultureWorld({ message: "Tell me about this", context: { atlasNodeSlug: "durga-puja-public-art" } });
    expect(result).toMatchObject({
      ok: true,
      mode: "deterministic_source_bounded_preview",
      alternativesAvailable: true,
      citations: [{ rightsLane: "citation_only" }],
    });
    expect(result?.answer).toContain("public meeting of religion and art");
    expect(answerLivingCultureWorld({ message: "Tell me about this", context: { atlasNodeSlug: "rama" } })).toBeNull();
  });
});

import { describe, expect, it } from "vitest";
import { answerHampiKishkindhaWorld, HAMPI_KISHKINDHA_WORLD_FIXITY, searchHampiKishkindhaWorld } from "./hampi-kishkindha-world";

describe("Hampi, Kishkindha, and Vijayanagara connected world", () => {
  it("keeps living belief, narrative, archaeology, and history in separate citation-only lanes", () => {
    expect(HAMPI_KISHKINDHA_WORLD_FIXITY).toEqual({
      nodeCount: 13,
      sourceIds: ["karnataka-tourism-anegundi", "karnataka-tourism-anjanadri", "unesco-whc-hampi-241", "unesco-asi-virupaksha-bazaar-218299"],
      citationOnly: true,
      languages: ["en", "hi"],
    });
    const results = searchHampiKishkindhaWorld("Hampi world heritage monuments", "en");
    expect(results).toHaveLength(1);
    expect(results[0].sourceBoundary).toContain("Epic narrative, living belief, archaeology");
    expect(results[0].citations[0]).toMatchObject({ rightsLane: "citation_only" });
    expect(results[0].citations[0].quotation).toBeUndefined();
  });

  it("opens every Atlas destination in exact English or Hindi search", () => {
    const queries = [
      "Kishkindha living landscape", "Anegundi", "Anjanadri", "Tungabhadra landscape", "Hampi world heritage",
      "Vijayanagara capital", "Vijayanagara empire", "Krishna Deva Raya", "Virupaksha Temple Hampi",
      "Vitthala Temple Hampi", "Hampi stone chariot", "Vijayanagara architecture", "Battle of Talikota 1565",
    ];
    for (const query of queries) expect(searchHampiKishkindhaWorld(query, "en").length, query).toBeGreaterThan(0);
    expect(searchHampiKishkindhaWorld("अंजनाद्रि", "hi")[0]).toMatchObject({ languageCode: "hi", title: "अंजनाद्रि पहाड़ी की परंपरा" });
  });

  it("continues the selected encounter through bilingual Sarthi", () => {
    const english = answerHampiKishkindhaWorld({ message: "Tell me about this", context: { atlasNodeSlug: "vijayanagara-capital" } });
    expect(english?.answer).toContain("monumental capital");
    const hindi = answerHampiKishkindhaWorld({ message: "यह समझाओ", context: { atlasNodeSlug: "anjanadri-hill-tradition", languageCode: "hi" } });
    expect(hindi).toMatchObject({ ok: true, citations: [{ rightsLane: "citation_only" }] });
    expect(hindi?.answer).toContain("जीवित आस्था");
  });
});

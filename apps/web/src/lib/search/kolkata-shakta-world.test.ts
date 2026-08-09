import { describe, expect, it } from "vitest";
import { answerKolkataShaktaWorld, KOLKATA_SHAKTA_WORLD_FIXITY, searchKolkataShaktaWorld } from "./kolkata-shakta-world";

describe("Kolkata, Kalighat, and Dakshineswar connected Shakta world", () => {
  it("keeps living temple authority, history, art, and festival context in citation-only lanes", () => {
    expect(KOLKATA_SHAKTA_WORLD_FIXITY).toEqual({
      nodeCount: 12,
      sourceIds: [
        "west-bengal-tourism-kalighat",
        "incredible-india-kalighat-art",
        "dakshineswar-temple-official-history",
        "ramakrishna-math-dakshineswar",
        "incredible-india-kali-puja",
      ],
      citationOnly: true,
      languages: ["en", "hi"],
    });
    const results = searchKolkataShaktaWorld("Kalighat Kali Temple", "en");
    expect(results).toHaveLength(1);
    expect(results[0].sourceBoundary).toContain("Living-temple authority, institutional belief, documented history");
    expect(results[0].citations[0]).toMatchObject({ rightsLane: "citation_only" });
    expect(results[0].citations[0].quotation).toBeUndefined();
  });

  it("opens every Atlas destination in exact English or Hindi search", () => {
    const queries = [
      "Kalighat Kali Temple", "Kalighat Kali form", "Kalighat art transition", "Kalighat painting",
      "Kalighat patua makers", "Dakshineswar Kali Temple", "Bhavatarini Dakshineswar", "Rani Rashmoni",
      "Ramakrishna Dakshineswar", "Dakshineswar Shiva temples", "Dakshineswar Radha Krishna temple",
      "Dakshineswar Shyama Puja",
    ];
    for (const query of queries) expect(searchKolkataShaktaWorld(query, "en").length, query).toBeGreaterThan(0);
    expect(searchKolkataShaktaWorld("रानी रासमणि", "hi")[0]).toMatchObject({ languageCode: "hi", title: "रानी रासमणि" });
  });

  it("continues a selected encounter through bilingual Sarthi", () => {
    const english = answerKolkataShaktaWorld({ message: "Tell me about this", context: { atlasNodeSlug: "dakshineswar-kali-temple" } });
    expect(english?.answer).toContain("Rani Rashmoni's patronage");
    const hindi = answerKolkataShaktaWorld({ message: "यह समझाओ", context: { atlasNodeSlug: "kalighat-pat", languageCode: "hi" } });
    expect(hindi).toMatchObject({ ok: true, citations: [{ rightsLane: "citation_only" }] });
    expect(hindi?.answer).toContain("कालीघाट चित्रकला");
  });

  it("does not hijack generic Kali Puja ritual questions", () => {
    expect(searchKolkataShaktaWorld("Kali Puja", "en")).toEqual([]);
    expect(answerKolkataShaktaWorld({ message: "How should I perform Kali Puja?" })).toBeNull();
  });
});

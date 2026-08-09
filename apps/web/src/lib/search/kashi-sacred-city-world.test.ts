import { describe, expect, it } from "vitest";
import {
  answerKashiSacredCityWorld,
  KASHI_SACRED_CITY_WORLD_FIXITY,
  searchKashiSacredCityWorld,
} from "./kashi-sacred-city-world";

describe("Kashi connected sacred-city world", () => {
  it("keeps temple, river, Buddhist, music, craft, community, and history lanes citation-only", () => {
    expect(KASHI_SACRED_CITY_WORLD_FIXITY).toEqual({
      nodeCount: 21,
      sourceIds: [
        "varanasi-district-kashi-vishwanath",
        "varanasi-district-ganga-ghats",
        "incredible-india-varanasi",
        "varanasi-district-important-temples",
        "varanasi-district-sarnath",
        "unesco-creative-city-varanasi",
        "ip-india-gi-banaras-brocades-99",
        "varanasi-district-handicraft",
      ],
      citationOnly: true,
      languages: ["en", "hi"],
    });

    const result = searchKashiSacredCityWorld("Kashi Vishwanath Temple Varanasi", "en")[0];
    expect(result.sourceBoundary).toContain("Sacred identity, living authority");
    expect(result.citations[0]).toMatchObject({ rightsLane: "citation_only" });
    expect(result.citations[0].quotation).toBeUndefined();
  });

  it("opens every new Atlas destination in English and Hindi exact retrieval", () => {
    const queries = [
      "Kashi Vishwanath Temple Varanasi",
      "Vishvanatha Vishveshvara Kashi Shiva",
      "Ganga river Varanasi ghats",
      "Varanasi Ganga ghats riverfront",
      "Dashashwamedh Ghat Varanasi",
      "Kalabhairava Temple Kashi Varanasi",
      "Annapurna Temple Kashi Varanasi",
      "Tulsi Manas Temple Tulsidas Ramcharitmanas",
      "Tulsidas Varanasi Ramcharitmanas",
      "Sankat Mochan Temple Varanasi Hanuman Tulsidas",
      "Sarnath Buddha first sermon",
      "Buddha Sarnath first teaching",
      "Buddha first sermon Sarnath Dhamma",
      "Sarnath early Buddhist Sangha Kondanna",
      "Varanasi UNESCO Creative City of Music",
      "Varanasi music guru shishya parampara UNESCO",
      "Banaras Brocades and Sarees GI weaving",
      "Banaras weavers silk weaving community",
      "Varanasi ghats Maratha patronage history",
      "Maharajas of Kashi music patronage UNESCO",
      "Ganga Mahotsav Varanasi music dance crafts",
    ];
    for (const query of queries) {
      const results = searchKashiSacredCityWorld(query, "en");
      expect(results.length, query).toBeGreaterThan(0);
      expect(results.every((item) => item.citations.length === 1), query).toBe(true);
    }

    expect(searchKashiSacredCityWorld("काशी विश्वनाथ मंदिर", "hi")[0]).toMatchObject({
      languageCode: "hi",
      title: "काशी विश्वनाथ मंदिर",
    });
  });

  it("continues the selected encounter through bilingual Sarthi without intercepting generic ritual questions", () => {
    const english = answerKashiSacredCityWorld({
      message: "Tell me about this",
      context: { atlasNodeSlug: "sarnath" },
    });
    expect(english?.answer).toContain("first teaching");

    const hindi = answerKashiSacredCityWorld({
      message: "यह समझाओ",
      context: { atlasNodeSlug: "banaras-brocades-sarees", languageCode: "hi" },
    });
    expect(hindi).toMatchObject({ ok: true, citations: [{ rightsLane: "citation_only" }] });
    expect(hindi?.answer).toContain("पंजीकृत GI शिल्प");

    expect(answerKashiSacredCityWorld({ message: "How should I perform puja today?" })).toBeNull();
  });
});

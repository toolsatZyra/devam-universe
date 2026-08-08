import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("GET /api/search", () => {
  it("returns exact obstacle evidence", async () => {
    const response = await GET(new Request("http://localhost/api/search?query=Ganesha%20and%20obstacles"));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.total).toBe(1);
    expect(result.results[0]).toMatchObject({ id: "ganapati-removes-obstacles-source-bounded-en", languageCode: "en" });
    expect(result.results[0].citations.map((citation: { sourceOrdinal: number }) => citation.sourceOrdinal)).toEqual([12, 31]);
  });

  it("returns the connected slice for a deity-only query", async () => {
    const response = await GET(new Request("http://localhost/api/search?query=Ganesha"));
    expect((await response.json()).total).toBe(4);
  });

  it("supports Hindi exact retrieval", async () => {
    const response = await GET(new Request("http://localhost/api/search?query=%E0%A4%B5%E0%A4%BF%E0%A4%98%E0%A5%8D%E0%A4%A8&language=hi"));
    const result = await response.json();
    expect(result.results[0].languageCode).toBe("hi");
    expect(result.results[0].statement).toContain("विघ्न");
  });

  it("returns seven source-addressed Ramayana book boundaries", async () => {
    const response = await GET(new Request("http://localhost/api/search?query=seven%20books%20of%20the%20Ramayana"));
    const result = await response.json();
    expect(result.total).toBe(7);
    expect(result.results.map((item: { title: string }) => item.title)).toEqual([
      "Bālakāṇḍa", "Ayodhyākāṇḍa", "Araṇyakāṇḍa", "Kiṣkindhākāṇḍa", "Sundarakāṇḍa", "Yuddhakāṇḍa", "Uttarakāṇḍa",
    ]);
    expect(result.results.every((item: { citations: { quotation?: string; rightsLane: string }[] }) => item.citations[0].quotation === undefined && item.citations[0].rightsLane === "citation_only")).toBe(true);
  });

  it("narrows a Durga structure search to the requested exact chapter", async () => {
    const response = await GET(new Request("http://localhost/api/search?query=Devimahatmya%20chapter%2082"));
    const result = await response.json();
    expect(result.total).toBe(1);
    expect(result.results[0]).toMatchObject({ title: "Begin the poem", claimKind: "source_bounded_structure" });
    expect(result.results[0].citations[0].locator.source_chapter).toBe(82);
  });

  it("supports Hindi Ramayana structure retrieval", async () => {
    const response = await GET(new Request("http://localhost/api/search?query=%E0%A4%B0%E0%A4%BE%E0%A4%AE%E0%A4%BE%E0%A4%AF%E0%A4%A3%20%E0%A4%B8%E0%A5%81%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A4%B0%20%E0%A4%95%E0%A4%BE%E0%A4%A3%E0%A5%8D%E0%A4%A1&language=hi"));
    const result = await response.json();
    expect(result.total).toBe(1);
    expect(result.results[0].languageCode).toBe("hi");
    expect(result.results[0].statement).toContain("सुन्दरकाण्ड");
  });

  it("returns the reviewed Hanuman deliberation crosswalk instead of a generic seven-book result", async () => {
    const response = await GET(new Request("http://localhost/api/search?query=Ramayana%20Hanuman%27s%20deliberation%20before%20speaking%20to%20Sita"));
    const result = await response.json();
    expect(result.total).toBe(1);
    expect(result.results[0]).toMatchObject({
      id: "sundarakanda-hanuman-deliberation-en",
      claimKind: "reviewed_interpretive_lens",
    });
    expect(result.results[0].citations.map((citation: { sourceOrdinal: number }) => citation.sourceOrdinal)).toEqual([352, 367, 30]);
    expect(result.results[0].citations.every((citation: { rightsLane: string; quotation?: string }) => citation.rightsLane === "citation_only" && citation.quotation === undefined)).toBe(true);
    expect(result.results[0].sourceBoundary).toContain("visually reviewed Dutt Section XXX");
  });

  it("returns the six bounded Diwali festival lanes without presenting the synthesis as a primary source", async () => {
    const response = await GET(new Request("http://localhost/api/search?query=Diwali%20festival%20path"));
    const result = await response.json();
    expect(result.total).toBe(6);
    expect(result.results.map((item: { title: string }) => item.title)).toEqual([
      "Vasubaras", "Dhantrayodashi", "Naraka Chaturdashi", "Lakshmi Pujan", "Bali and Govardhan", "Bhau Beej",
    ]);
    expect(result.results.every((item: { claimKind: string; citations: { sourceObjectId: string; rightsLane: string; quotation?: string }[]; sourceBoundary: string }) =>
      item.claimKind === "evidence_bounded_synthesis"
      && item.citations[0].sourceObjectId === "c73343da9b873400ed7bcc307b30aedb7de751c38c6e672ac41f98de05b389c1"
      && item.citations[0].rightsLane === "derivative_allowed"
      && item.citations[0].quotation === undefined
      && item.sourceBoundary.includes("one Devam-authored West India evidence synthesis"),
    )).toBe(true);
  });

  it("narrows Diwali retrieval to Dhanteras and supports a Hindi Lakshmi Pujan query", async () => {
    const dhantrayodashi = await (await GET(new Request("http://localhost/api/search?query=Dhanteras"))).json();
    expect(dhantrayodashi.results).toEqual([expect.objectContaining({
      id: "dhantrayodashi-north-west-india-content-v1-en-exact-guidance",
      title: "Dhantrayodashi at home",
      claimKind: "user_complete_observance_lane",
    })]);

    const hindi = await (await GET(new Request("http://localhost/api/search?query=%E0%A4%A6%E0%A5%80%E0%A4%AA%E0%A4%BE%E0%A4%B5%E0%A4%B2%E0%A5%80%20%E0%A4%B2%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A5%8D%E0%A4%AE%E0%A5%80%20%E0%A4%AA%E0%A5%82%E0%A4%9C%E0%A4%A8&language=hi"))).json();
    expect(hindi.total).toBe(1);
    expect(hindi.results[0]).toMatchObject({
      id: "diwali-lakshmi-puja-west-india-content-v1-hi-exact-guidance",
      languageCode: "hi",
      claimKind: "user_complete_observance_lane",
    });
    expect(hindi.results[0].title).toContain("लक्ष्मी-पूजन");
  });

  it("keeps Mahabharata out of grounded results while exposing preserved source metadata", async () => {
    const response = await GET(new Request("http://localhost/api/search?query=Mahabharata"));
    const result = await response.json();
    expect(result).toMatchObject({ ok: true, total: 0, results: [] });
    expect(result.sourceCatalogTotal).toBeGreaterThanOrEqual(5);
    expect(result.sourceCatalogMatches.some((item: { title: string }) => item.title === "mahabharata-devanagari.xml")).toBe(true);
    expect(result.sourceCatalogBoundary).toContain("not a verified passage");
  });

  it("lists all seven acquired Dutt Ramayana carrier records separately from exact passages", async () => {
    const response = await GET(new Request("http://localhost/api/search?query=Ramayana%20Manmatha%20Nath%20Dutt"));
    const result = await response.json();
    expect(result.total).toBe(0);
    expect(result.results).toEqual([]);
    expect(result.sourceCatalogTotal).toBe(7);
    expect(result.sourceCatalogMatches).toHaveLength(7);
    expect(result.sourceCatalogMatches.reduce((total: number, item: { bytes: number }) => total + item.bytes, 0)).toBe(72_688_252);
  });

  it("returns the exact Bengal Maha Ashtami participant lane", async () => {
    const response = await GET(new Request("http://localhost/api/search?query=Maha%20Ashtami%20Kolkata&language=en"));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.results[0]).toMatchObject({
      id: "bengal-mahashtami-community-participant-2026-v1-en-exact-guidance",
      claimKind: "user_complete_observance_lane",
    });
    expect(result.results[0].citations).toHaveLength(8);
  });

  it("returns the six-day Bengal Durga Puja participant campaign", async () => {
    const response = await GET(new Request("http://localhost/api/search?query=Bengal%20Durga%20Puja&language=en"));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.results[0]).toMatchObject({
      id: "bengal-durga-puja-participant-content-v1-en-exact-guidance",
      claimKind: "user_complete_observance_lane",
    });
    expect(result.results[0].citations).toHaveLength(7);
  });

  it("returns the exact West India Lakshmi Puja household lane", async () => {
    const response = await GET(new Request("http://localhost/api/search?query=Lakshmi%20Puja%20at%20home&language=en"));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.results[0]).toMatchObject({
      id: "diwali-lakshmi-puja-west-india-content-v1-en-exact-guidance",
      claimKind: "user_complete_observance_lane",
    });
    expect(result.results[0].citations).toHaveLength(4);
  });

  it("returns the exact West India Ganesh Chaturthi household lane", async () => {
    const response = await GET(new Request("http://localhost/api/search?query=Ganesh%20Chaturthi&language=en"));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.results[0]).toMatchObject({
      id: "ganesh-chaturthi-west-india-content-v1-en-exact-guidance",
      claimKind: "user_complete_observance_lane",
    });
    expect(result.results[0].citations).toHaveLength(5);
  });

  it("returns the bounded Bengal Vishwakarma workplace lane", async () => {
    const response = await GET(new Request("http://localhost/api/search?query=Vishwakarma%20Puja%20Bengal&language=en"));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.results[0]).toMatchObject({
      id: "vishwakarma-puja-bengal-workplace-content-v1-en-exact-guidance",
      claimKind: "user_complete_observance_lane",
    });
    expect(result.results[0].citations).toHaveLength(5);
    expect(result.results[0].sourceBoundary).toContain("17 September 2026 Bengal");
  });

  it.each([
    ["Kanya%20Sankranti", "17 September 2026"],
    ["Tula%20Sankranti", "17 October 2026"],
    ["Vrishchika%20Sankranti", "16 November 2026"],
    ["Dhanu%20Sankranti", "16 December 2026"],
  ])("returns the bounded general Sankranti lane for %s", async (query, expectedDate) => {
    const response = await GET(new Request(`http://localhost/api/search?query=${query}&language=en`));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.results[0]).toMatchObject({
      id: "sankranti-september-december-general-content-v1-en-exact-guidance",
      claimKind: "user_complete_observance_lane",
    });
    expect(result.results[0].statement).toContain(expectedDate);
    expect(result.results[0].sourceBoundary).toContain("bounded general personal");
    expect(result.results[0].citations).toHaveLength(5);
  });

  it("returns the generic Pitru Paksha remembrance lane without presenting a formal Shraddha procedure", async () => {
    const response = await GET(new Request("http://localhost/api/search?query=Pitru%20Paksha&language=en"));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.results[0]).toMatchObject({
      id: "pitru-paksha-delhi-remembrance-content-v1-en-exact-guidance",
      claimKind: "user_complete_observance_lane",
    });
    expect(result.results[0].statement).toContain("26 September through 10 October");
    expect(result.results[0].sourceBoundary).toContain("does not decide personal ancestor applicability");
    expect(result.results[0].citations).toHaveLength(7);
  });

  it("returns the exact Ashtami Shraddha calendar-labelled lane", async () => {
    const response = await GET(new Request("http://localhost/api/search?query=Ashtami%20Shraddha&language=en"));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.results[0]).toMatchObject({
      id: "pitru-paksha-delhi-remembrance-content-v1-en-exact-guidance",
      claimKind: "user_complete_observance_lane",
    });
    expect(result.results[0].statement).toContain("3 October 2026");
  });

  it.each([
    ["Sankashti%20Chaturthi", "sankashti-chaturthi-west-india-content-v1-en-exact-guidance"],
    ["Masika%20Durgashtami", "masika-durgashtami-north-west-content-v1-en-exact-guidance"],
    ["Masika%20Shivaratri", "masika-shivaratri-north-west-india-content-v1-en-exact-guidance"],
    ["Pradosha", "pradosha-north-west-content-v1-en-exact-guidance"],
  ])("returns the recurring current-contract lane for %s", async (query, id) => {
    const response = await GET(new Request(`http://localhost/api/search?query=${query}&language=en`));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.results[0]).toMatchObject({ id, claimKind: "user_complete_observance_lane" });
    expect(result.results[0].citations.length).toBeGreaterThanOrEqual(5);
  });

  it.each([
    ["Kartika%20Purnima", "purnima-amavasya-north-west-india-content-v1-en-exact-guidance"],
    ["Ashwina%20Amavasya", "purnima-amavasya-north-west-india-content-v1-en-exact-guidance"],
  ])("returns the current generic lunar-day lane for %s", async (query, id) => {
    const response = await GET(new Request(`http://localhost/api/search?query=${query}&language=en`));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.results[0]).toMatchObject({ id, claimKind: "user_complete_observance_lane" });
    expect(result.results[0].citations).toHaveLength(4);
  });

  it.each([
    ["Ananta%20Chaturdashi", "ananta-chaturdashi-north-west-content-v1-en-exact-guidance"],
    ["Kalabhairava%20Jayanti", "kalabhairava-jayanti-north-kashi-content-v1-en-exact-guidance"],
    ["Kojagara", "kojagara-sharad-purnima-north-west-content-v1-en-exact-guidance"],
    ["Rishi%20Panchami", "rishi-panchami-saptarishi-reflection-content-v1-en-exact-guidance"],
  ])("returns the final migrated current-contract lane for %s", async (query, id) => {
    const response = await GET(new Request(`http://localhost/api/search?query=${query}&language=en`));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.results[0]).toMatchObject({ id, claimKind: "user_complete_observance_lane" });
  });

  it("returns the exact North/West India Shardiya Navaratri household lane", async () => {
    const response = await GET(new Request("http://localhost/api/search?query=Shardiya%20Navaratri&language=en"));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.results[0]).toMatchObject({
      id: "shardiya-navaratri-north-west-india-content-v1-en-exact-guidance",
      claimKind: "user_complete_observance_lane",
    });
    expect(result.results[0].citations).toHaveLength(7);
  });

  it("returns the current-contract Vivaha Panchami remembrance lane", async () => {
    const response = await GET(new Request("http://localhost/api/search?query=Vivaha%20Panchami&language=en"));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.results[0]).toMatchObject({
      id: "vivaha-panchami-north-india-content-v1-en-exact-guidance",
      claimKind: "user_complete_observance_lane",
    });
    expect(result.results[0].citations).toHaveLength(5);
  });

  it("returns a named current-contract Ekadashi companion", async () => {
    const response = await GET(new Request("http://localhost/api/search?query=Devutthana%20Ekadashi&language=en"));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.results[0]).toMatchObject({
      id: "ekadashi-recurring-devotional-content-v1-en-exact-guidance",
      claimKind: "user_complete_observance_lane",
    });
    expect(result.results[0].citations).toHaveLength(6);
  });

  it("returns only an explicitly named Janmashtami authority lane", async () => {
    const response = await GET(new Request("http://localhost/api/search?query=ISKCON%20Janmashtami&language=en"));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.results[0]).toMatchObject({
      id: "krishna-janmashtami-smarta-iskcon-content-v1-en-exact-guidance",
      claimKind: "user_complete_observance_lane",
    });
    expect(result.results[0].sourceBoundary).toContain("ISKCON participant");
  });

  it("returns the explicitly named BAPS Tulsi Vivah lane", async () => {
    const response = await GET(new Request("http://localhost/api/search?query=BAPS%20Tulsi%20Vivah&language=en"));
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.results[0]).toMatchObject({
      id: "tulasi-vivah-general-baps-content-v1-en-exact-guidance",
      title: "BAPS Tulsi Vivah participation",
      claimKind: "user_complete_observance_lane",
    });
  });

  it("rejects an invalid query", async () => {
    const response = await GET(new Request("http://localhost/api/search?query=x"));
    expect(response.status).toBe(400);
  });
});

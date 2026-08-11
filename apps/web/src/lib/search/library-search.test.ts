import { describe, expect, it } from "vitest";
import type { GroundedClaim, KnowledgeGroundingRepository, PublicEvidencePassage } from "../evidence/contracts";
import { searchLibrary } from "./library-search";

function claim(overrides: Partial<GroundedClaim> = {}): GroundedClaim {
  return {
    id: "claim-id",
    stableKey: "database-ganesha-claim-en",
    subject: { slug: "ganesha", canonicalName: "Ganesha" },
    statement: "A published source-bounded database claim.",
    languageCode: "en",
    claimKind: "source_bounded_summary",
    evidenceClass: "scripture_primary_source",
    confidence: 0.95,
    applicability: { scope: "this_source_only" },
    uncertaintyNote: "This does not represent every Ganesha tradition.",
    rightsLane: "derivative_allowed",
    publicationState: "published",
    evidence: [
      {
        passageId: "passage-product",
        sourceObjectId: "source-product",
        sourceOrdinal: 1,
        locator: { line: 1 },
        exactText: "Product-cleared exact text",
        languageCode: "sa",
        spanSha256: "a".repeat(64),
        sourceSha256: "b".repeat(64),
        workSlug: "ganesha-work",
        workTitle: "Ganesha Work",
        editionTitle: "Reviewed Edition",
        rightsLane: "derivative_allowed",
        publicationState: "published",
        evidenceRole: "supports",
        note: null,
      },
      {
        passageId: "passage-citation",
        sourceObjectId: "source-citation",
        sourceOrdinal: 2,
        locator: { line: 2 },
        exactText: "Citation-only text must not leave the server",
        languageCode: "en",
        spanSha256: "c".repeat(64),
        sourceSha256: "d".repeat(64),
        workSlug: "ganesha-work",
        workTitle: "Ganesha Work",
        editionTitle: "Reviewed Edition",
        rightsLane: "citation_only",
        publicationState: "published",
        evidenceRole: "qualifies",
        note: null,
      },
    ],
    ...overrides,
  };
}

function repository(result: GroundedClaim[] | Error): KnowledgeGroundingRepository {
  return {
    async searchClaims() {
      if (result instanceof Error) throw result;
      return result;
    },
  };
}

function publishedPassage(): PublicEvidencePassage {
  return {
    id: "exact-passage-id",
    sourceObjectId: "exact-source-id",
    sourceOrdinal: 9,
    locator: { lineStart: 20, lineEnd: 22 },
    text: "A directly searchable exact source passage.",
    textStatus: "verified_transcription",
    languageCode: "sa",
    spanSha256: "e".repeat(64),
    sourceSha256: "f".repeat(64),
    sourceCompletenessStatus: "observed_units_structure_authority_unresolved",
    workSlug: "ganapatyatharvashirsha",
    workTitle: "Ganapatyatharvashirsha",
    editionTitle: "Reviewed Sanskrit edition",
    rightsLane: "derivative_allowed",
    publicationState: "published",
  };
}

describe("library search orchestration", () => {
  it("adds published product claims and suppresses citation-only quotation text", async () => {
    const result = await searchLibrary("database-only subject", "en", repository([claim()]));
    expect(result.retrievalStatus).toBe("connected");
    expect(result.results).toHaveLength(1);
    expect(result.results[0].citations[0].quotation).toBe("Product-cleared exact text");
    expect(result.results[0].citations[1].quotation).toBeUndefined();
    expect(JSON.stringify(result)).not.toContain("Citation-only text must not leave the server");
  });

  it("renders a Devam source-aligned translation with its exact Sanskrit revision boundary", async () => {
    const result = await searchLibrary(
      "directly perceptible Reality",
      "en",
      repository([claim({
        stableKey: "ganapati-ganapatyatharvashirsha-rev415703-translation-01-en",
        statement: "Upanishad. Hari Om. Salutations to you, Ganapati. You alone are the directly perceptible Reality.",
        claimKind: "source_aligned_translation",
        evidenceClass: "devam_synthesis",
        applicability: {
          scope: "this_exact_source_revision_only",
          provider_revision_id: 415703,
          source_ordinal: 1,
          translation_is_source_original: false,
        },
        uncertaintyNote: "Devam source-aligned English translation of Sanskrit Wikisource revision 415703. It is AI-assisted and not a source original or independently Sanskrit-reviewed translation.",
        evidence: [{
          ...claim().evidence[0],
          sourceOrdinal: 1,
          exactText: "त्वमेव प्रत्यक्षं तत्त्वमसि ॥",
          workSlug: "ganapatyatharvashirsha",
          workTitle: "Gaṇapatyatharvaśīrṣa",
          editionTitle: "Sanskrit Wikisource digital transcription, revision 415703",
        }],
      })]),
    );
    expect(result.results[0]).toMatchObject({
      id: "ganapati-ganapatyatharvashirsha-rev415703-translation-01-en",
      claimKind: "source_aligned_translation",
      statement: expect.stringContaining("directly perceptible Reality"),
    });
    expect(result.results[0].citations[0].quotation).toBe("त्वमेव प्रत्यक्षं तत्त्वमसि ॥");
    expect(result.results[0].sourceBoundary).toContain("this exact source revision only");
    expect(result.results[0].sourceBoundary).toContain("not a source original");
  });

  it("rejects review-state claims from the public result set", async () => {
    const result = await searchLibrary("database-only subject", "en", repository([claim({ publicationState: "review" })]));
    expect(result).toMatchObject({ retrievalStatus: "connected", results: [] });
  });

  it("adds published exact passages with edition-bounded source context", async () => {
    const sourceRepository: KnowledgeGroundingRepository = {
      async searchClaims() { return []; },
      async searchPublishedPassages() { return [publishedPassage()]; },
    };
    const result = await searchLibrary("database-only exact passage", "sa", sourceRepository);
    expect(result.retrievalStatus).toBe("connected");
    expect(result.results[0]).toMatchObject({
      id: "passage:exact-passage-id",
      claimKind: "source_passage",
      statement: "A directly searchable exact source passage.",
    });
    expect(result.results[0].citations[0].quotation).toBe("A directly searchable exact source passage.");
    expect(result.results[0].sourceBoundary).toContain("one passage in one edition");
    expect(result.results[0].sourceBoundary).toContain("source completeness: observed_units_structure_authority_unresolved");
  });

  it("keeps passage search connected when claim retrieval alone fails", async () => {
    const sourceRepository: KnowledgeGroundingRepository = {
      async searchClaims() { throw new Error("claims unavailable"); },
      async searchPublishedPassages() { return [publishedPassage()]; },
    };
    const result = await searchLibrary("database-only exact passage", "sa", sourceRepository);
    expect(result).toMatchObject({ retrievalStatus: "connected" });
    expect(result.results[0].id).toBe("passage:exact-passage-id");
    expect(result.coverage).toContain("Knowledge-claim retrieval is temporarily unavailable");
  });

  it("keeps deterministic source slices available when database retrieval fails", async () => {
    const result = await searchLibrary("Ganesha and obstacles", "en", repository(new Error("database unavailable")));
    expect(result.retrievalStatus).toBe("temporarily_unavailable");
    expect(result.results[0].id).toBe("ganapati-removes-obstacles-source-bounded-en");
  });

  it("reports an honest local-only boundary without a configured repository", async () => {
    const result = await searchLibrary("Mahabharata", "en");
    expect(result).toMatchObject({ retrievalStatus: "not_configured", results: [] });
  });

  it("opens Ramcharitmanas through all seven source-addressed sopana anchors", async () => {
    const result = await searchLibrary("Ramcharitmanas seven sopanas Belvedere Press", "en");
    expect(result.results[0]).toMatchObject({
      id: "ramcharitmanas-belvedere-seven-sopana-en",
      claimKind: "source_bounded_structure",
      statement: expect.stringContaining("all 813 proofread or validated beta pages"),
    });
    expect(result.results[0].citations).toHaveLength(7);
    expect(result.results[0].sourceBoundary).toContain("345 unproofread text-bearing pages");
    expect(result.results[0].sourceBoundary).toContain("not applied to the hosted database");
  });

  it("opens the complete Hanuman Chalisa and resolves numbered reading units", async () => {
    const overview = await searchLibrary("Hanuman Chalisa", "en");
    expect(overview.results[0]).toMatchObject({
      id: "hanuman-chalisa-complete-reading-en",
      claimKind: "complete_devotional_reading_structure",
      statement: expect.stringContaining("complete reading sequence"),
    });
    const reading = await searchLibrary("Hanuman Chalisa chaupai 40", "en");
    expect(reading.results[0]).toMatchObject({
      id: "hanuman-chalisa-reading-42-en",
      claimKind: "complete_devotional_reading_unit",
      statement: expect.stringContaining("Tulsidas identifies himself"),
    });
    expect(reading.results[0].citations[0].locator).toMatchObject({ reading_ordinal: 42, source_number: 40 });
  });

  it("finds the exact user-complete Maha Ashtami participant lane before broader hero results", async () => {
    const result = await searchLibrary("What should I do on Maha Ashtami in Kolkata?", "en");
    expect(result.results[0]).toMatchObject({
      id: "bengal-mahashtami-community-participant-2026-v1-en-exact-guidance",
      claimKind: "user_complete_observance_lane",
      languageCode: "en",
    });
    expect(result.results[0].citations).toHaveLength(8);
    expect(result.results[0].sourceBoundary).toContain("Complete only for the named 19 October 2026");
  });

  it("finds the six-day Bengal Durga Puja participant campaign without promoting priest-led Puja", async () => {
    const result = await searchLibrary("How can I participate in Bengal Durga Puja?", "en");
    expect(result.results[0]).toMatchObject({
      id: "bengal-durga-puja-participant-content-v1-en-exact-guidance",
      claimKind: "user_complete_observance_lane",
    });
    expect(result.results[0].citations).toHaveLength(7);
    expect(result.results[0].sourceBoundary).toContain("priest-led Puja");
  });

  it("finds the exact West India Lakshmi Puja household lane without merging other Diwali traditions", async () => {
    const result = await searchLibrary("How should I do Lakshmi Puja at home?", "en");
    expect(result.results[0]).toMatchObject({
      id: "diwali-lakshmi-puja-west-india-content-v1-en-exact-guidance",
      claimKind: "user_complete_observance_lane",
      languageCode: "en",
    });
    expect(result.results[0].citations).toHaveLength(4);
    expect(result.results[0].sourceBoundary).toContain("West India Smarta household Lakshmi Puja lane");
    expect(result.results[0].sourceBoundary).toContain("Bengali Kali Puja");
  });

  it("finds the exact West India Ganesh Chaturthi household lane", async () => {
    const result = await searchLibrary("What should I do for Ganesh Chaturthi?", "en");
    expect(result.results[0]).toMatchObject({
      id: "ganesh-chaturthi-west-india-content-v1-en-exact-guidance",
      claimKind: "user_complete_observance_lane",
      languageCode: "en",
    });
    expect(result.results[0].citations).toHaveLength(5);
    expect(result.results[0].sourceBoundary).toContain("Permanent and temporary images");
  });

  it("finds the exact North/West India Shardiya Navaratri household lane without merging regional worlds", async () => {
    const result = await searchLibrary("What should I do for Shardiya Navaratri?", "en");
    expect(result.results[0]).toMatchObject({
      id: "shardiya-navaratri-north-west-india-content-v1-en-exact-guidance",
      claimKind: "user_complete_observance_lane",
      languageCode: "en",
    });
    expect(result.results[0].citations).toHaveLength(7);
    expect(result.results[0].sourceBoundary).toContain("Bengal Durga Puja");
  });

  it.each([
    ["Maharashtra Abhyanga Snan", "naraka-chaturdashi-maharashtra-content-v1-en-exact-guidance", 5, "Kali Chaudas"],
    ["Tamil Deepavali", "tamil-deepavali-household-content-v1-en-exact-guidance", 4, "North/West Lakshmi Puja"],
    ["BAPS Kali Chaudash", "kali-chaudas-baps-gujarat-content-v1-en-exact-guidance", 6, "Formal Hanuman Puja"],
  ])("finds the exact mid-Diwali lane for %s", async (query, id, citationCount, boundary) => {
    const result = await searchLibrary(query, "en");
    expect(result.results).toHaveLength(1);
    expect(result.results[0]).toMatchObject({ id, claimKind: "user_complete_observance_lane" });
    expect(result.results[0].citations).toHaveLength(citationCount);
    expect(result.results[0].sourceBoundary).toContain(boundary);
  });

  it.each([
    ["Mumbai Monday practice", "Monday / Somavara"],
    ["West India Tuesday practice", "Tuesday / Mangalavara"],
  ])("finds the exact optional weekday lane for %s", async (query, title) => {
    const result = await searchLibrary(query, "en");
    expect(result.results).toHaveLength(1);
    expect(result.results[0]).toMatchObject({
      id: "weekday-practice-west-india-content-v1-en-exact-guidance",
      claimKind: "user_complete_observance_lane",
    });
    expect(result.results[0].title).toContain(title);
    expect(result.results[0].citations).toHaveLength(5);
    expect(result.results[0].sourceBoundary).toContain("Family, kula");
  });

  it.each([
    ["North India Tulasi Vivah", "North/West India Smarta", "Tulasi Vivah at home"],
    ["BAPS Tulsi Vivah", "BAPS November 21-24", "BAPS Tulsi Vivah participation"],
  ])("finds the exact Tulasi Vivah lane for %s", async (query, boundary, title) => {
    const result = await searchLibrary(query, "en");
    expect(result.results).toHaveLength(1);
    expect(result.results[0]).toMatchObject({
      id: "tulasi-vivah-general-baps-content-v1-en-exact-guidance",
      title,
      claimKind: "user_complete_observance_lane",
    });
    expect(result.results[0].citations).toHaveLength(5);
    expect(result.results[0].sourceBoundary).toContain(boundary);
  });

  it.each([
    ["Maharashtra Bali Pratipada", "bali-pratipada-maharashtra-content-v1-en-exact-guidance", 3, "Govardhana/Annakut"],
    ["ISKCON Govardhan Puja", "govardhana-puja-iskcon-content-v1-en-exact-guidance", 4, "BAPS Annakut"],
    ["North India Bhai Dooj", "bhai-dooj-north-india-content-v1-en-exact-guidance", 4, "Bhai Phota"],
  ])("finds the exact post-Diwali lane for %s", async (query, id, citationCount, boundary) => {
    const result = await searchLibrary(query, "en");
    expect(result.results).toHaveLength(1);
    expect(result.results[0]).toMatchObject({ id, claimKind: "user_complete_observance_lane" });
    expect(result.results[0].citations).toHaveLength(citationCount);
    expect(result.results[0].sourceBoundary).toContain(boundary);
  });

  it.each([
    ["Bengal Kali Puja", "bengal-kali-puja-participant-content-v1-en-exact-guidance", 4, "West India Lakshmi Puja"],
    ["BAPS Gujarati New Year", "gujarati-new-year-baps-content-v1-en-exact-guidance", 5, "business rites"],
    ["Karnataka Balipadyami", "balipadyami-karnataka-content-v1-en-exact-guidance", 4, "Maharashtra Padwa"],
    ["Karnataka Saraswati Puja", "karnataka-saraswati-ayudha-puja-content-v1-en-exact-guidance", 6, "Formal mantras"],
  ])("finds the exact regional Diwali expansion lane for %s", async (query, id, citationCount, boundary) => {
    const result = await searchLibrary(query, "en");
    expect(result.results).toHaveLength(1);
    expect(result.results[0]).toMatchObject({ id, claimKind: "user_complete_observance_lane" });
    expect(result.results[0].citations).toHaveLength(citationCount);
    expect(result.results[0].sourceBoundary).toContain(boundary);
  });

  it.each([
    ["Bandi Chhor Divas", "bandi-chhor-sgpc-participant-content-v1-en-exact-guidance", 4, "local gurdwara controls"],
    ["Ahoi Ashtami", "ahoi-ashtami-north-india-household-content-v1-en-exact-guidance", 4, "Family practice controls"],
  ])("finds the exact bounded current-contract lane for %s", async (query, id, citationCount, boundary) => {
    const result = await searchLibrary(query, "en");
    expect(result.results).toHaveLength(1);
    expect(result.results[0]).toMatchObject({ id, claimKind: "user_complete_observance_lane" });
    expect(result.results[0].citations).toHaveLength(citationCount);
    expect(result.results[0].sourceBoundary).toContain(boundary);
  });

  it.each([
    ["Karwa Chauth vidhi", "karwa-chauth-north-india-household-content-v1-en-exact-guidance", 3, "Punjab and Uttar Pradesh"],
    ["Chhath Puja", "chhath-bihar-purvanchal-participant-content-v1-en-exact-guidance", 5, "parvaitin"],
    ["Varanasi Dev Deepawali", "dev-deepawali-varanasi-participant-content-v1-en-exact-guidance", 5, "generic Kartika Purnima"],
  ])("finds the exact autumn observance lane for %s", async (query, id, citationCount, boundary) => {
    const result = await searchLibrary(query, "en");
    expect(result.results).toHaveLength(1);
    expect(result.results[0]).toMatchObject({ id, claimKind: "user_complete_observance_lane" });
    expect(result.results[0].citations).toHaveLength(citationCount);
    expect(result.results[0].sourceBoundary).toContain(boundary);
  });

  it("finds the current-contract Hartalika participant lane without claiming the full vrata", async () => {
    const result = await searchLibrary("Hartalika Teej", "en");
    expect(result.results).toHaveLength(1);
    expect(result.results[0]).toMatchObject({
      id: "hartalika-teej-north-west-india-participant-content-v1-en-exact-guidance",
      claimKind: "user_complete_observance_lane",
    });
    expect(result.results[0].citations).toHaveLength(7);
    expect(result.results[0].sourceBoundary).toContain("formal household vrata");
    expect(result.results[0].sourceBoundary).toContain("Gowri Habba");
  });

  it.each([
    ["Sankashti Chaturthi", "sankashti-chaturthi-west-india-content-v1-en-exact-guidance", "local moonrise"],
    ["Masika Durgashtami", "masika-durgashtami-north-west-content-v1-en-exact-guidance", "Formal Puja"],
    ["Masika Shivaratri", "masika-shivaratri-north-west-india-content-v1-en-exact-guidance", "annual Mahashivaratri"],
    ["Pradosha", "pradosha-north-west-content-v1-en-exact-guidance", "planetary remedies"],
  ])("finds the bounded recurring hero lane for %s", async (query, id, boundary) => {
    const result = await searchLibrary(query, "en");
    expect(result.results).toHaveLength(1);
    expect(result.results[0]).toMatchObject({ id, claimKind: "user_complete_observance_lane" });
    expect(result.results[0].citations.length).toBeGreaterThanOrEqual(5);
    expect(result.results[0].sourceBoundary).toContain(boundary);
  });

  it.each([
    ["Kartika Purnima", "purnima-amavasya-north-west-india-content-v1-en-exact-guidance", "Margashirsha Purnima"],
    ["Ashwina Amavasya", "purnima-amavasya-north-west-india-content-v1-en-exact-guidance", "Shraddha"],
  ])("finds the bounded generic lunar-day lane for %s", async (query, id, boundary) => {
    const result = await searchLibrary(query, "en");
    expect(result.results).toHaveLength(1);
    expect(result.results[0]).toMatchObject({ id, claimKind: "user_complete_observance_lane" });
    expect(result.results[0].citations).toHaveLength(4);
    expect(result.results[0].sourceBoundary).toContain(boundary);
  });

  it.each([
    ["Ananta Chaturdashi", "ananta-chaturdashi-north-west-content-v1-en-exact-guidance", 5, "Ganesh Visarjan"],
    ["Kalabhairava Jayanti", "kalabhairava-jayanti-north-kashi-content-v1-en-exact-guidance", 4, "Kashi"],
    ["Kojagara", "kojagara-sharad-purnima-north-west-content-v1-en-exact-guidance", 7, "Bengali Kojagari"],
    ["Rishi Panchami", "rishi-panchami-saptarishi-reflection-content-v1-en-exact-guidance", 6, "Multiple sage lists"],
  ])("finds the final migrated current-contract lane for %s", async (query, id, citationCount, boundary) => {
    const result = await searchLibrary(query, "en");
    expect(result.results).toHaveLength(1);
    expect(result.results[0]).toMatchObject({ id, claimKind: "user_complete_observance_lane" });
    expect(result.results[0].citations).toHaveLength(citationCount);
    expect(result.results[0].sourceBoundary).toContain(boundary);
  });

  it("finds the exact ISKCON Radha Ashtami lane without universalizing it", async () => {
    const result = await searchLibrary("Radha Ashtami in ISKCON", "en");
    expect(result.results).toHaveLength(1);
    expect(result.results[0]).toMatchObject({
      id: "radha-ashtami-iskcon-participant-content-v1-en-exact-guidance",
      claimKind: "user_complete_observance_lane",
    });
    expect(result.results[0].citations).toHaveLength(6);
    expect(result.results[0].sourceBoundary).toContain("ISKCON India participant");
    expect(result.results[0].sourceBoundary).toContain("other Gaudiya Vaishnava");
  });

  it("finds the exact Gita Jayanti reading lane without returning generic Ekadashi vrata guidance", async () => {
    const result = await searchLibrary("What should I read on Gita Jayanti?", "en");
    expect(result.results).toHaveLength(1);
    expect(result.results[0]).toMatchObject({
      id: "gita-jayanti-reading-reflection-content-v1-en-exact-guidance",
      claimKind: "user_complete_observance_lane",
    });
    expect(result.results[0].citations).toHaveLength(8);
    expect(result.results[0].sourceBoundary).toContain("attributable edition");
    expect(result.results[0].sourceBoundary).toContain("fasting, parana");
  });

  it("finds the exact Vivaha Panchami remembrance lane without broadening it to a wedding rite", async () => {
    const result = await searchLibrary("Vivaha Panchami", "en");
    expect(result.results).toHaveLength(1);
    expect(result.results[0]).toMatchObject({
      id: "vivaha-panchami-north-india-content-v1-en-exact-guidance",
      claimKind: "user_complete_observance_lane",
    });
    expect(result.results[0].citations).toHaveLength(5);
    expect(result.results[0].sourceBoundary).toContain("wedding reenactment");
    expect(result.results[0].sourceBoundary).toContain("universal Ramayana");
  });

  it("finds a named current-contract Ekadashi companion without returning a generic vrata", async () => {
    const result = await searchLibrary("Devutthana Ekadashi", "en");
    expect(result.results).toHaveLength(1);
    expect(result.results[0]).toMatchObject({
      id: "ekadashi-recurring-devotional-content-v1-en-exact-guidance",
      claimKind: "user_complete_observance_lane",
    });
    expect(result.results[0].citations).toHaveLength(6);
    expect(result.results[0].sourceBoundary).toContain("fasting, food rules");
    expect(result.results[0].sourceBoundary).toContain("Smarta and Vaishnava dates");
  });

  it.each([
    ["Smarta Janmashtami", "North India Smarta household"],
    ["ISKCON Janmashtami", "ISKCON participant"],
  ])("finds the exact Janmashtami authority lane for %s", async (query, boundary) => {
    const result = await searchLibrary(query, "en");
    expect(result.results).toHaveLength(1);
    expect(result.results[0]).toMatchObject({
      id: "krishna-janmashtami-smarta-iskcon-content-v1-en-exact-guidance",
      claimKind: "user_complete_observance_lane",
    });
    expect(result.results[0].citations).toHaveLength(6);
    expect(result.results[0].sourceBoundary).toContain(boundary);
  });
});

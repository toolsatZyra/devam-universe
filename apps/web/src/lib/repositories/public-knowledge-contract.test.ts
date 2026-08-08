import { describe, expect, it } from "vitest";
import { parsePublicKnowledgeClaims, parsePublicPassages } from "./public-knowledge-contract";

function payload() {
  return [{
    id: "claim-id",
    stableKey: "source-bounded-claim-en",
    subject: { slug: "ganapati", canonicalName: "Gaṇapati" },
    statement: "A bounded claim.",
    languageCode: "en",
    claimKind: "source_bounded_summary",
    evidenceClass: "scripture_primary_source",
    confidence: 0.9,
    applicability: { scope: "this_source_only" },
    uncertaintyNote: "One source only.",
    rightsLane: "derivative_allowed",
    publicationState: "published",
    evidence: [{
      passageId: "passage-id",
      sourceObjectId: "source-id",
      sourceOrdinal: 1,
      locator: { line: 1 },
      exactText: "Published source text",
      languageCode: "sa",
      spanSha256: "a".repeat(64),
      sourceSha256: "b".repeat(64),
      workSlug: "source-work",
      workTitle: "Source Work",
      editionTitle: "Source Edition",
      rightsLane: "derivative_allowed",
      publicationState: "published",
      evidenceRole: "supports",
      note: null,
    }],
  }];
}

describe("public knowledge RPC contract", () => {
  it("accepts a published, source-grounded product claim", () => {
    expect(parsePublicKnowledgeClaims(payload())[0]).toMatchObject({ stableKey: "source-bounded-claim-en", publicationState: "published" });
  });

  it("rejects review-state claims", () => {
    const value = payload();
    value[0].publicationState = "review";
    expect(() => parsePublicKnowledgeClaims(value)).toThrow("Public claim is not published");
  });

  it("rejects leaked citation-only passage text", () => {
    const value = payload();
    value[0].evidence[0].rightsLane = "citation_only";
    expect(() => parsePublicKnowledgeClaims(value)).toThrow("Citation-only evidence exposed exact text");
  });
});

function passagePayload() {
  return [{
    id: "passage-id",
    sourceObjectId: "source-id",
    sourceOrdinal: 7,
    locator: { lineStart: 12, lineEnd: 14 },
    text: "Exact published source passage",
    textStatus: "verified_transcription",
    languageCode: "sa",
    spanSha256: "a".repeat(64),
    sourceSha256: "b".repeat(64),
    sourceCompletenessStatus: "observed_units_structure_authority_unresolved",
    workSlug: "ganapatyatharvashirsha",
    workTitle: "Ganapatyatharvashirsha",
    editionTitle: "Published reviewed edition",
    rightsLane: "derivative_allowed",
    publicationState: "published",
  }];
}

describe("public exact-passage RPC contract", () => {
  it("accepts an exact published product-compatible passage", () => {
    expect(parsePublicPassages(passagePayload())[0]).toMatchObject({
      id: "passage-id",
      text: "Exact published source passage",
      publicationState: "published",
    });
  });

  it("rejects citation-only exact text", () => {
    const value = passagePayload();
    value[0].rightsLane = "citation_only";
    expect(() => parsePublicPassages(value)).toThrow("outside the exact-text product rights lanes");
  });

  it("rejects review-state passages and malformed fixity", () => {
    const review = passagePayload();
    review[0].publicationState = "review";
    expect(() => parsePublicPassages(review)).toThrow("Public passage is not published");
    const malformed = passagePayload();
    malformed[0].sourceSha256 = "not-a-hash";
    expect(() => parsePublicPassages(malformed)).toThrow("not a lowercase SHA-256 hash");
  });
});

import { describe, expect, it } from "vitest";
import type { GroundedClaim } from "@/lib/evidence/contracts";

function assertSourceBoundedClaim(claim: GroundedClaim) {
  expect(claim.applicability.scope).toBe("this_source_only");
  expect(claim.evidence.length).toBeGreaterThan(0);
  expect(claim.evidence.every((item) => item.sourceSha256 === "21e5909392249ecca6677410c30d70323402d886975df807df2b865697fd9e6d")).toBe(true);
  expect(claim.evidence.every((item) => item.workSlug === "shriganapatimantraksharavali")).toBe(true);
  expect(claim.uncertaintyNote).toBeTruthy();
}

describe("knowledge grounding boundary", () => {
  it("requires source-bounded, evidence-linked claims", () => {
    const claim: GroundedClaim = {
      id: "claim-id",
      stableKey: "ganapati-removes-obstacles-source-bounded-en",
      subject: { slug: "ganapati", canonicalName: "Gaṇapati" },
      statement: "This source praises Gaṇapati as a remover of obstacles.",
      languageCode: "en",
      claimKind: "source_bounded_theological_description",
      evidenceClass: "scripture_primary_source",
      confidence: 0.99,
      applicability: { scope: "this_source_only" },
      uncertaintyNote: "This is a source-attributed devotional characterization.",
      rightsLane: "derivative_allowed",
      publicationState: "review",
      evidence: [{
        passageId: "passage-id",
        sourceObjectId: "source-id",
        sourceOrdinal: 31,
        locator: { literal_marker: "31" },
        exactText: "अलङ्कृतं च विघ्नानां हर्तारं देवमाश्रये ॥ ३१ ॥",
        languageCode: "sa",
        spanSha256: "a".repeat(64),
        sourceSha256: "21e5909392249ecca6677410c30d70323402d886975df807df2b865697fd9e6d",
        workSlug: "shriganapatimantraksharavali",
        workTitle: "Śrīgaṇapatimantrākṣarāvaliḥ",
        editionTitle: "Ambuda electronic text based on Stotrārṇavaḥ",
        rightsLane: "derivative_allowed",
        publicationState: "review",
        evidenceRole: "supports",
        note: null,
      }],
    };
    expect(() => assertSourceBoundedClaim(claim)).not.toThrow();
  });
});

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { tamilDeepavaliEvidence } from "./tamil-deepavali";

describe("Tamil Deepavali evidence boundary", () => {
  it("rehashes the exact semantic fixture and exposes only the bounded date evidence", () => {
    const path = resolve(process.cwd(), "../..", "knowledge_packs/panchang/tamil-deepavali-chennai-2026-v1.json");
    const hash = createHash("sha256").update(readFileSync(path)).digest("hex");
    expect(hash).toBe("97319c8fc4f1e6bb157c7540f6bcfc3379c0bccabdabb22b57493e085feac7de");
    expect(tamilDeepavaliEvidence).toMatchObject({
      semanticFixtureSha256: hash,
      candidateCivilDates: ["2026-11-07", "2026-11-08"],
      supportedTraditionCodes: ["smarta-south-india"],
      selectedCivilDate: "2026-11-08",
      modernReference: {
        observedCivilDate: "2026-11-08",
        responseBytes: 81500,
        responseSha256: "c6b5c90589e9ac0c0be44044ffd93b35f69e8a5865bd42974d3bfb42e5816b53",
      },
    });
    expect(tamilDeepavaliEvidence.sourceScopeNote).toContain("not North/West Amavasya at Pradosha");
    expect(tamilDeepavaliEvidence.sourceScopeNote).toContain("No oil-bath");
  });
});

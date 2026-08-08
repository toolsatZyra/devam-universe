import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { dhantrayodashiEvidence } from "./dhantrayodashi";

describe("Dhantrayodashi evidence boundary", () => {
  it("rehashes the exact semantic fixture and exposes only the bounded date evidence", () => {
    const path = resolve(process.cwd(), "../..", "knowledge_packs/panchang/dhantrayodashi-delhi-2026-v1.json");
    const hash = createHash("sha256").update(readFileSync(path)).digest("hex");
    expect(hash).toBe("c88547ab6e858c28ed6b60f209ff26ca1194d1e6820e3c5c6fce958b72d7347a");
    expect(dhantrayodashiEvidence).toMatchObject({
      semanticFixtureSha256: hash,
      candidateCivilDates: ["2026-11-05", "2026-11-06"],
      supportedTraditionCodes: ["smarta-north-india", "smarta-west-india"],
      selectedCivilDate: "2026-11-06",
      modernReference: {
        observedCivilDate: "2026-11-06",
        responseBytes: 81810,
        responseSha256: "121255bba72fc486def14da6042e5dfb94556cac9b8b8ff92b489e36573e9471",
      },
    });
    expect(dhantrayodashiEvidence.sourceScopeNote).toContain("does not reproduce the provider's narrower puja muhurta");
  });
});

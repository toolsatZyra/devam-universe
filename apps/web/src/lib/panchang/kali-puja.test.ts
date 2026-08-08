import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { kaliPujaEvidence } from "./kali-puja";

describe("Bengal Kali Puja evidence boundary", () => {
  it("rehashes the exact semantic fixture and exposes only the bounded date evidence", () => {
    const path = resolve(process.cwd(), "../..", "knowledge_packs/panchang/kali-puja-kolkata-2026-v1.json");
    const hash = createHash("sha256").update(readFileSync(path)).digest("hex");
    expect(hash).toBe("faa675ee7ece5ed1513f75b49fef6db2ab0f9b0ea324f58a40990864c46c165c");
    expect(kaliPujaEvidence).toMatchObject({
      semanticFixtureSha256: hash,
      candidateCivilDates: ["2026-11-08", "2026-11-09"],
      supportedTraditionCodes: ["shakta-bengal"],
      selectedCivilDate: "2026-11-08",
      modernReference: {
        observedCivilDate: "2026-11-08",
        responseBytes: 78534,
        responseSha256: "f1bc47ed5e1948244babe7f8d86e82f0acf4a6353c44dc3368564f758ff44775",
      },
    });
    expect(kaliPujaEvidence.sourceScopeNote).toContain("Lakshmi Puja and Kali Puja remain separate records");
  });
});

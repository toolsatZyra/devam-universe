import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Sarthi Understanding Phase 1 baseline preparation", () => {
  it("prepares only admitted bilingual envelopes without answers or external calls", () => {
    const output = execFileSync(
      process.execPath,
      [resolve(process.cwd(), "scripts", "prepare-sarthi-phase1-baseline.mjs"), "--json"],
      { cwd: process.cwd(), encoding: "utf8" },
    );
    const prepared = JSON.parse(output) as {
      status: string;
      envelope_root_sha256: string;
      envelopes: Array<Record<string, unknown>>;
    };
    expect(prepared.status).toBe("prepared_unrun");
    expect(prepared.envelope_root_sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(prepared.envelopes).toHaveLength(30);
    expect(new Set(prepared.envelopes.map((envelope) => envelope.blind_id)).size).toBe(30);
    for (const envelope of prepared.envelopes) {
      expect(envelope).not.toHaveProperty("answer");
      expect(envelope).not.toHaveProperty("output_text");
      expect(envelope).toHaveProperty("packet_sha256");
      expect(envelope).toHaveProperty("artifact_sha256");
    }
  });
});

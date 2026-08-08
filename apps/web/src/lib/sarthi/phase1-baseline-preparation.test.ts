import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Sarthi Understanding Phase 1 baseline preparation", () => {
  it("prepares only admitted bilingual envelopes without answers or external calls", () => {
    const output = execFileSync(
      process.execPath,
      [resolve(process.cwd(), "scripts", "prepare-sarthi-phase1-baseline.mjs"), "--json"],
      { cwd: process.cwd(), encoding: "utf8", maxBuffer: 10 * 1024 * 1024 },
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
      expect(envelope).toHaveProperty("evidence_material");
      expect(envelope).toHaveProperty("evidence_material_sha256");
    }
    for (let index = 0; index < prepared.envelopes.length; index += 2) {
      expect(prepared.envelopes[index].scenario_id).toBe(prepared.envelopes[index + 1].scenario_id);
      expect(prepared.envelopes[index].evidence_material_sha256).toBe(prepared.envelopes[index + 1].evidence_material_sha256);
    }
  });
});

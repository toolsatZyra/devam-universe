import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

type AdmissionRegistry = {
  status: string;
  admission_index: Array<[string, string]>;
  packets: Array<{ scenario_id: string; languages: string[] }>;
};

function registry(): AdmissionRegistry {
  return JSON.parse(
    readFileSync(resolve(process.cwd(), "evaluation", "sarthi-phase1-evidence-admission-v1.json"), "utf8"),
  ) as AdmissionRegistry;
}

describe("Sarthi Understanding Phase 1 evidence admission", () => {
  it("verifies exact evidence, scope, rights and fixity without running a baseline", () => {
    const output = execFileSync(
      process.execPath,
      [resolve(process.cwd(), "scripts", "validate-sarthi-phase1-admission.mjs")],
      { cwd: process.cwd(), encoding: "utf8" },
    );
    expect(output).toContain("PASS: 14 admitted packets; 30 scenarios indexed");
    expect(output).toContain("artifact fixity verified; no baseline run");
  });

  it("keeps incomplete evidence blocked and admission explicitly partial", () => {
    const admission = registry();
    const statusCounts = new Map<string, number>();
    for (const [, status] of admission.admission_index) {
      statusCounts.set(status, (statusCounts.get(status) ?? 0) + 1);
    }
    expect(admission.status).toBe("partial_admission_no_baseline_run");
    expect(statusCounts).toEqual(new Map([
      ["admitted", 14],
      ["candidate_not_packeted", 4],
      ["blocked_partial_evidence", 7],
      ["blocked_research_required", 5],
    ]));
    expect(admission.packets).toHaveLength(14);
    expect(admission.packets.every((packet) => packet.languages.join("|") === "en|hi")).toBe(true);
  });
});

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

type HeldOutFixture = {
  status: string;
  pair_count: number;
  scenario_count: number;
  pairs: Array<{
    capability: string;
    family: string;
    evidence_readiness: string;
    questions: { en: string; hi: string };
  }>;
};

function fixture(): HeldOutFixture {
  return JSON.parse(
    readFileSync(resolve(process.cwd(), "evaluation", "sarthi-understanding-heldout-v1.json"), "utf8"),
  ) as HeldOutFixture;
}

describe("Sarthi Understanding Phase 0 freeze", () => {
  it("keeps the held-out fixture structurally valid and byte-frozen", () => {
    const output = execFileSync(
      process.execPath,
      [resolve(process.cwd(), "scripts", "validate-sarthi-understanding-phase0.mjs")],
      { cwd: process.cwd(), encoding: "utf8" },
    );
    expect(output).toContain("PASS: 60 frozen bilingual scenarios");
    expect(output).toContain("no answer-bearing fields; manifest verified");
  });

  it("covers every understanding capability and priority world without pretending evidence is ready", () => {
    const heldOut = fixture();
    expect(heldOut).toMatchObject({ status: "frozen_unrun", pair_count: 30, scenario_count: 60 });
    expect(new Set(heldOut.pairs.map((pair) => pair.capability))).toEqual(new Set([
      "exact_retrieval",
      "source_grounded_explanation",
      "cross_source_synthesis",
      "scoped_interpretation",
      "practical_existential_reflection",
    ]));
    for (const family of ["ramayana", "ganesha", "durga", "diwali"]) {
      expect(heldOut.pairs.filter((pair) => pair.family === family).length, family).toBeGreaterThanOrEqual(4);
    }
    expect(heldOut.pairs.some((pair) => pair.evidence_readiness === "partial")).toBe(true);
    expect(heldOut.pairs.some((pair) => pair.evidence_readiness === "research_required")).toBe(true);
    expect(heldOut.pairs.every((pair) => pair.questions.en !== pair.questions.hi)).toBe(true);
  });
});

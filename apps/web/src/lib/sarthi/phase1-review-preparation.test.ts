import { execFileSync, spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Sarthi Phase 1 blinded review preparation", () => {
  it("validates the frozen review contract without a run artifact or writes", () => {
    const output = execFileSync(
      process.execPath,
      [resolve(process.cwd(), "scripts", "prepare-sarthi-phase1-review.mjs"), "--preflight"],
      { cwd: process.cwd(), encoding: "utf8" },
    );
    expect(output).toContain("10 dimensions; 8 hard failures");
    expect(output).toContain("no run artifact required or written");
  });

  it("fails closed when the named completed run does not exist", () => {
    const result = spawnSync(
      process.execPath,
      [resolve(process.cwd(), "scripts", "prepare-sarthi-phase1-review.mjs"), "--run-id=missing-review-run"],
      { cwd: process.cwd(), encoding: "utf8" },
    );
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Completed baseline run is missing");
  });
});

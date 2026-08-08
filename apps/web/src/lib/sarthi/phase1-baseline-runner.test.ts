import { execFileSync, spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { parseAnswer, parsePricing, requestBody, usageAndCost } from "../../../scripts/sarthi-phase1-baseline-runner-lib.mjs";

describe("Sarthi Phase 1 baseline runner", () => {
  it("passes preflight without authorization, credentials, writes, or calls", () => {
    const output = execFileSync(
      process.execPath,
      [resolve(process.cwd(), "scripts", "run-sarthi-phase1-baseline.mjs"), "--preflight"],
      { cwd: process.cwd(), encoding: "utf8", maxBuffer: 10 * 1024 * 1024 },
    );
    expect(output).toContain("PASS: baseline runner preflight for 30 calls");
    expect(output).toContain("no external calls");
  });

  it("fails closed before a run when the exact authorization is absent", () => {
    const result = spawnSync(
      process.execPath,
      [resolve(process.cwd(), "scripts", "run-sarthi-phase1-baseline.mjs"), "--run-id=unauthorized-check"],
      { cwd: process.cwd(), encoding: "utf8", env: { ...process.env, DEVAM_SARTHI_PHASE1_RUN_AUTHORIZATION: "" }, maxBuffer: 10 * 1024 * 1024 },
    );
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Exact 30-call authorization is missing");
  });

  it("builds a storage-disabled grounded request and validates structured output", () => {
    const body = requestBody({ language: "en", question: "What is the boundary?", required_roles: ["source_assertion"], scope: { work: "Example" }, evidence_material: { admission_boundary: "One reviewed example only." } }, { model: "gpt-5.6-terra", reasoning_effort: "medium", answer_length_max_chars: 1200, max_output_tokens: 600 });
    expect(body).toMatchObject({ model: "gpt-5.6-terra", store: false, reasoning: { effort: "medium" }, max_output_tokens: 600 });
    expect(body.input).toContain("One reviewed example only");
    const parsed = parseAnswer({ output: [{ content: [{ type: "output_text", text: JSON.stringify({ answer: "A bounded answer.", materialCaveat: null }) }] }] });
    expect(parsed).toEqual({ answer: "A bounded answer.", material_caveat: null });
  });

  it("records cached and uncached token cost from an explicit pricing snapshot", () => {
    const pricing = parsePricing({
      DEVAM_BASELINE_INPUT_USD_PER_MILLION: "2",
      DEVAM_BASELINE_CACHED_INPUT_USD_PER_MILLION: "0.5",
      DEVAM_BASELINE_OUTPUT_USD_PER_MILLION: "8",
      DEVAM_BASELINE_PRICING_SOURCE_URL: "https://openai.com/api/pricing/",
      DEVAM_BASELINE_PRICING_ACCESSED_AT: "2026-08-08T10:00:00.000Z",
    });
    expect(usageAndCost({ usage: { input_tokens: 1000, output_tokens: 100, input_tokens_details: { cached_tokens: 400 } } }, pricing)).toEqual({
      input_tokens: 1000,
      cached_input_tokens: 400,
      uncached_input_tokens: 600,
      output_tokens: 100,
      total_tokens: 1100,
      estimated_cost_usd: 0.0022,
    });
    expect(() => parsePricing({
      DEVAM_BASELINE_INPUT_USD_PER_MILLION: "2",
      DEVAM_BASELINE_CACHED_INPUT_USD_PER_MILLION: "0.5",
      DEVAM_BASELINE_OUTPUT_USD_PER_MILLION: "8",
      DEVAM_BASELINE_PRICING_SOURCE_URL: "https://example.com/pricing",
      DEVAM_BASELINE_PRICING_ACCESSED_AT: "2026-08-08T10:00:00.000Z",
    })).toThrow("official OpenAI HTTPS URL");
  });
});

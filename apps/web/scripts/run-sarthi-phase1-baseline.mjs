import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseAnswer, parsePricing, requestBody, RESPONSES_URL, usageAndCost } from "./sarthi-phase1-baseline-runner-lib.mjs";

const webRoot = resolve(import.meta.dirname, "..");
const specPath = resolve(webRoot, "evaluation", "sarthi-phase1-baseline-spec-v1.json");
const specBytes = readFileSync(specPath);
const spec = JSON.parse(specBytes.toString("utf8"));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const prepared = JSON.parse(execFileSync(
  process.execPath,
  [resolve(webRoot, "scripts", "prepare-sarthi-phase1-baseline.mjs"), "--json"],
  { cwd: webRoot, encoding: "utf8", maxBuffer: 10 * 1024 * 1024 },
));

if (spec.status !== "prepared_unrun" || spec.runtime.external_calls_allowed !== false) throw new Error("Baseline specification is not in fail-closed prepared state.");
if (prepared.status !== "prepared_unrun" || prepared.envelopes.length !== 30) throw new Error("Expected exactly 30 prepared unrun envelopes.");
if (process.argv.includes("--preflight")) {
  console.log(`PASS: baseline runner preflight for ${prepared.envelopes.length} calls; envelope root ${prepared.envelope_root_sha256}; no external calls.`);
  process.exit(0);
}

const authorization = process.env.DEVAM_SARTHI_PHASE1_RUN_AUTHORIZATION;
if (authorization !== "I_AUTHORIZE_30_OPENAI_CALLS") throw new Error("Exact 30-call authorization is missing.");
if (typeof process.env.OPENAI_API_KEY !== "string" || process.env.OPENAI_API_KEY.length <= 20) throw new Error("OPENAI_API_KEY is missing.");
const pricing = parsePricing(process.env);
const runIdArg = process.argv.find((arg) => arg.startsWith("--run-id="));
const runId = runIdArg?.slice("--run-id=".length) ?? "";
if (!/^[a-z0-9][a-z0-9-]{5,63}$/u.test(runId)) throw new Error("--run-id must be a stable 6-64 character lowercase identifier.");

const runsDir = resolve(webRoot, "evaluation", "runs");
mkdirSync(runsDir, { recursive: true });
const outputPath = resolve(runsDir, `sarthi-phase1-baseline-${runId}.json`);
const identity = {
  specification_sha256: sha256(specBytes),
  envelope_root_sha256: prepared.envelope_root_sha256,
  model: spec.runtime.model,
  reasoning_effort: spec.runtime.reasoning_effort,
  pricing_sha256: sha256(Buffer.from(JSON.stringify(pricing))),
};
let run;
if (existsSync(outputPath)) {
  run = JSON.parse(readFileSync(outputPath, "utf8"));
  for (const [key, value] of Object.entries(identity)) if (run.identity?.[key] !== value) throw new Error(`Existing partial run has mismatched ${key}.`);
  if (["completed", "completed_with_recovered_errors"].includes(run.status)) {
    console.log(`PASS: baseline run ${runId} is already complete at ${outputPath}.`);
    process.exit(0);
  }
} else {
  run = {
    contract: "DEVAM_SARTHI_PHASE1_BASELINE_RUN_V1",
    status: "in_progress",
    run_id: runId,
    started_at: new Date().toISOString(),
    completed_at: null,
    identity,
    pricing,
    provider_storage_disabled: true,
    automatic_retries: false,
    results: [],
  };
}

const persist = () => writeFileSync(outputPath, `${JSON.stringify(run, null, 2)}\n`, "utf8");
const completedBlindIds = new Set(run.results.filter((result) => result.status === "completed").map((result) => result.blind_id));
for (const envelope of prepared.envelopes) {
  if (completedBlindIds.has(envelope.blind_id)) continue;
  const startedAt = new Date().toISOString();
  const startMs = Date.now();
  try {
    const response = await fetch(RESPONSES_URL, {
      method: "POST",
      headers: { authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify(requestBody(envelope, spec.runtime)),
      signal: AbortSignal.timeout(spec.runtime.timeout_ms),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(`OpenAI Responses request failed with ${response.status}: ${JSON.stringify(payload).slice(0, 500)}`);
    const answer = parseAnswer(payload);
    run.results.push({
      status: "completed",
      blind_id: envelope.blind_id,
      scenario_id: envelope.scenario_id,
      language: envelope.language,
      packet_sha256: envelope.packet_sha256,
      evidence_material_sha256: envelope.evidence_material_sha256,
      response_id: typeof payload.id === "string" ? payload.id : null,
      started_at: startedAt,
      completed_at: new Date().toISOString(),
      latency_ms: Date.now() - startMs,
      ...usageAndCost(payload, pricing),
      ...answer,
      error: null,
    });
    persist();
  } catch (error) {
    run.status = "interrupted";
    run.results.push({
      status: "error",
      blind_id: envelope.blind_id,
      scenario_id: envelope.scenario_id,
      language: envelope.language,
      started_at: startedAt,
      completed_at: new Date().toISOString(),
      latency_ms: Date.now() - startMs,
      error: error instanceof Error ? error.message : String(error),
    });
    persist();
    throw error;
  }
}

const completedCalls = run.results.filter((result) => result.status === "completed").length;
if (completedCalls !== prepared.envelopes.length) throw new Error(`Run has ${completedCalls} completed calls; expected ${prepared.envelopes.length}.`);
const recoveredErrors = run.results.filter((result) => result.status === "error").length;
run.status = recoveredErrors === 0 ? "completed" : "completed_with_recovered_errors";
run.completed_at = new Date().toISOString();
run.summary = {
  completed_calls: completedCalls,
  error_records: recoveredErrors,
  input_tokens: run.results.reduce((sum, result) => sum + (result.input_tokens ?? 0), 0),
  output_tokens: run.results.reduce((sum, result) => sum + (result.output_tokens ?? 0), 0),
  estimated_cost_usd: Number(run.results.reduce((sum, result) => sum + (result.estimated_cost_usd ?? 0), 0).toFixed(8)),
};
persist();
console.log(`PASS: baseline run ${runId} completed ${run.summary.completed_calls} calls; estimated cost USD ${run.summary.estimated_cost_usd}; ${outputPath}`);

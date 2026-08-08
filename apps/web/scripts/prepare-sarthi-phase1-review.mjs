import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const webRoot = resolve(import.meta.dirname, "..");
const spec = JSON.parse(readFileSync(resolve(webRoot, "evaluation", "sarthi-phase1-review-spec-v1.json"), "utf8"));
const fixture = JSON.parse(readFileSync(resolve(webRoot, "evaluation", "sarthi-understanding-heldout-v1.json"), "utf8"));
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

check(spec.contract === "DEVAM_SARTHI_PHASE1_BLINDED_REVIEW_SPEC_V1", "unexpected review contract");
check(spec.status === "prepared_unrun", "review spec must remain prepared_unrun");
check(spec.claim_ceiling === "review_contract_only_no_rating_or_quality_claim", "review claim ceiling drift");
check(spec.reviewers_per_scenario_minimum >= 2, "at least two independent reviewers are required");
check(JSON.stringify(spec.dimensions) === JSON.stringify(fixture.evaluation_dimensions), "review dimensions drift from Phase 0");
check(JSON.stringify(spec.hard_failures) === JSON.stringify(fixture.hard_failures), "hard failures drift from Phase 0");
check(spec.promotion.any_hard_failure_blocks_promotion === true, "hard failures must block promotion");
check(spec.promotion.llm_judge_may_not_be_sole_authority === true, "human promotion authority is required");
check(spec.blinding.hide_scenario_id && spec.blinding.hide_model_and_provider && spec.blinding.hide_cost_latency_and_token_usage && spec.blinding.hide_response_id, "review blinding contract drift");
if (failures.length) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join("\n"));
  process.exit(1);
}
if (process.argv.includes("--preflight")) {
  console.log(`PASS: blinded review preflight; ${spec.dimensions.length} dimensions; ${spec.hard_failures.length} hard failures; no run artifact required or written.`);
  process.exit(0);
}

const runIdArg = process.argv.find((arg) => arg.startsWith("--run-id="));
const runId = runIdArg?.slice("--run-id=".length) ?? "";
if (!/^[a-z0-9][a-z0-9-]{5,63}$/u.test(runId)) throw new Error("--run-id must be a stable 6-64 character lowercase identifier.");
const runsDir = resolve(webRoot, "evaluation", "runs");
const runPath = resolve(runsDir, `sarthi-phase1-baseline-${runId}.json`);
if (!existsSync(runPath)) throw new Error(`Completed baseline run is missing: ${runPath}`);
const run = JSON.parse(readFileSync(runPath, "utf8"));
if (!["completed", "completed_with_recovered_errors"].includes(run.status)) throw new Error("Baseline run is not complete.");
const completed = run.results.filter((result) => result.status === "completed");
if (completed.length !== 30 || new Set(completed.map((result) => result.blind_id)).size !== 30) throw new Error("Baseline run must contain exactly 30 unique completed responses.");

const prepared = JSON.parse(execFileSync(
  process.execPath,
  [resolve(webRoot, "scripts", "prepare-sarthi-phase1-baseline.mjs"), "--json"],
  { cwd: webRoot, encoding: "utf8", maxBuffer: 10 * 1024 * 1024 },
));
const envelopeByBlindId = new Map(prepared.envelopes.map((envelope) => [envelope.blind_id, envelope]));
const resultByBlindId = new Map(completed.map((result) => [result.blind_id, result]));
const orderKey = (blindId) => sha256(`${runId}\n${blindId}`);
const items = [...resultByBlindId.keys()].sort((left, right) => orderKey(left).localeCompare(orderKey(right))).map((blindId) => {
  const envelope = envelopeByBlindId.get(blindId);
  const result = resultByBlindId.get(blindId);
  if (!envelope) throw new Error(`Prepared envelope is missing for blind ID ${blindId}.`);
  return {
    blind_id: blindId,
    language: envelope.language,
    question: envelope.question,
    answer: result.answer,
    material_caveat: result.material_caveat,
    reviewed_evidence_material: envelope.evidence_material,
  };
});

const packetPath = resolve(runsDir, `sarthi-phase1-review-packet-${runId}.json`);
const ratingsPath = resolve(runsDir, `sarthi-phase1-ratings-${runId}.json`);
if (existsSync(packetPath) || existsSync(ratingsPath)) throw new Error("Review packet or ratings file already exists; refuse to overwrite reviewer work.");
const packet = {
  contract: "DEVAM_SARTHI_PHASE1_BLINDED_REVIEW_PACKET_V1",
  status: "awaiting_independent_review",
  run_id_hash: sha256(runId),
  review_spec_sha256: sha256(readFileSync(resolve(webRoot, "evaluation", "sarthi-phase1-review-spec-v1.json"))),
  item_count: items.length,
  items,
};
const ratings = {
  contract: "DEVAM_SARTHI_PHASE1_BLINDED_RATINGS_V1",
  status: "unrated",
  review_packet_sha256: sha256(`${JSON.stringify(packet, null, 2)}\n`),
  reviewers_per_scenario_minimum: spec.reviewers_per_scenario_minimum,
  dimensions: spec.dimensions,
  hard_failures: spec.hard_failures,
  reviews: [],
};
writeFileSync(packetPath, `${JSON.stringify(packet, null, 2)}\n`, "utf8");
writeFileSync(ratingsPath, `${JSON.stringify(ratings, null, 2)}\n`, "utf8");
console.log(`PASS: wrote ${items.length} blinded review items and an unrated template for ${runId}.`);

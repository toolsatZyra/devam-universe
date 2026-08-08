import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateAndSummarizeReview } from "./sarthi-phase1-review-analysis-lib.mjs";

const webRoot = resolve(import.meta.dirname, "..");
const spec = JSON.parse(readFileSync(resolve(webRoot, "evaluation", "sarthi-phase1-review-spec-v1.json"), "utf8"));
if (process.argv.includes("--preflight")) {
  if (spec.contract !== "DEVAM_SARTHI_PHASE1_BLINDED_REVIEW_SPEC_V1" || spec.dimensions.length !== 10 || spec.hard_failures.length !== 8) throw new Error("Review analysis specification drift.");
  console.log("PASS: review analyzer preflight; complete two-reviewer ratings required; no analysis written.");
  process.exit(0);
}
const runIdArg = process.argv.find((arg) => arg.startsWith("--run-id="));
const runId = runIdArg?.slice("--run-id=".length) ?? "";
if (!/^[a-z0-9][a-z0-9-]{5,63}$/u.test(runId)) throw new Error("--run-id must be a stable 6-64 character lowercase identifier.");
const runsDir = resolve(webRoot, "evaluation", "runs");
const packetPath = resolve(runsDir, `sarthi-phase1-review-packet-${runId}.json`);
const ratingsPath = resolve(runsDir, `sarthi-phase1-ratings-${runId}.json`);
const analysisPath = resolve(runsDir, `sarthi-phase1-review-analysis-${runId}.json`);
if (!existsSync(packetPath) || !existsSync(ratingsPath)) throw new Error("Review packet and completed ratings are required.");
if (existsSync(analysisPath)) throw new Error("Review analysis already exists; refuse to overwrite it.");
const packetBytes = readFileSync(packetPath);
const packet = JSON.parse(packetBytes.toString("utf8"));
const ratings = JSON.parse(readFileSync(ratingsPath, "utf8"));
const packetSha = createHash("sha256").update(packetBytes).digest("hex");
if (ratings.review_packet_sha256 !== packetSha) throw new Error("Ratings do not match the blinded review packet bytes.");
const result = validateAndSummarizeReview(spec, packet, ratings);
if (result.failures.length) {
  console.error(result.failures.map((failure) => `FAIL: ${failure}`).join("\n"));
  process.exit(1);
}
writeFileSync(analysisPath, `${JSON.stringify({ ...result.analysis, run_id_hash: createHash("sha256").update(runId).digest("hex"), review_packet_sha256: packetSha }, null, 2)}\n`, "utf8");
console.log(`PASS: wrote review analysis for ${packet.item_count} blinded items; promotion_eligible=${result.analysis.promotion_eligible}.`);

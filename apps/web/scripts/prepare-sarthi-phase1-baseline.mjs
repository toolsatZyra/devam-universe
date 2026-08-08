import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const webRoot = resolve(import.meta.dirname, "..");
const repoRoot = resolve(webRoot, "..", "..");
const fixtureBytes = readFileSync(resolve(webRoot, "evaluation", "sarthi-understanding-heldout-v1.json"));
const admissionBytes = readFileSync(resolve(webRoot, "evaluation", "sarthi-phase1-evidence-admission-v1.json"));
const spec = JSON.parse(readFileSync(resolve(webRoot, "evaluation", "sarthi-phase1-baseline-spec-v1.json"), "utf8"));
const fixture = JSON.parse(fixtureBytes.toString("utf8"));
const admission = JSON.parse(admissionBytes.toString("utf8"));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

check(spec.contract === "DEVAM_SARTHI_PHASE1_BASELINE_RUN_SPEC_V1", "unexpected baseline spec contract");
check(spec.status === "prepared_unrun", "baseline spec must remain prepared_unrun");
check(spec.claim_ceiling === "answer_free_run_preparation_only_no_quality_or_production_claim", "baseline claim ceiling drift");
check(spec.runtime.external_calls_allowed === false, "preparer must not permit external calls");
check(spec.runtime.authorization_required_before_run === true, "explicit run authorization must remain required");
check(spec.runtime.store === false && spec.runtime.hidden_chain_of_thought_retained === false, "storage or hidden-reasoning boundary drift");
check(spec.inputs.heldout_fixture_sha256 === sha256(fixtureBytes), "held-out fixture hash mismatch");
check(spec.inputs.admission_registry_sha256 === sha256(admissionBytes), "admission registry hash mismatch");
const generationBytes = readFileSync(resolve(repoRoot, spec.inputs.generation_contract_path));
check(spec.inputs.generation_contract_sha256 === sha256(generationBytes), "generation contract hash mismatch");

const admittedIds = new Set(admission.admission_index.filter(([, status]) => status === "admitted").map(([id]) => id));
const packetByScenario = new Map(admission.packets.map((packet) => [packet.scenario_id, packet]));
const selectedPairs = fixture.pairs.filter((pair) => admittedIds.has(pair.id));
check(selectedPairs.length === spec.selection.pair_count, "selected pair count mismatch");
check(spec.selection.scenario_count === spec.selection.pair_count * 2, "scenario count must be twice the bilingual pair count");
check(JSON.stringify(spec.selection.languages) === JSON.stringify(["en", "hi"]), "baseline languages must be exactly en and hi");

const envelopes = [];
for (const pair of selectedPairs) {
  const packet = packetByScenario.get(pair.id);
  check(Boolean(packet), `${pair.id} has no admitted packet`);
  if (!packet) continue;
  const packetSha = sha256(Buffer.from(JSON.stringify(packet)));
  const artifactSha = sha256(Buffer.from(packet.artifacts.map((artifact) => artifact.sha256).join("\n")));
  for (const language of spec.selection.languages) {
    const question = pair.questions[language];
    check(typeof question === "string" && question.length > 0, `${pair.id}/${language} has no question`);
    envelopes.push({
      blind_id: sha256(Buffer.from(`${spec.contract}\n${pair.id}\n${language}`)).slice(0, 24),
      scenario_id: pair.id,
      language,
      question,
      packet_id: packet.packet_id,
      packet_sha256: packetSha,
      artifact_sha256: artifactSha,
      required_roles: packet.required_roles,
      scope: packet.scope,
    });
  }
}

check(envelopes.length === spec.selection.scenario_count, "prepared envelope count mismatch");
check(new Set(envelopes.map((envelope) => envelope.blind_id)).size === envelopes.length, "blind IDs are not unique");
const prohibited = new Set(["answer", "reference_answer", "ideal_response", "score", "rating", "output_text"]);
for (const envelope of envelopes) check(!Object.keys(envelope).some((key) => prohibited.has(key)), `${envelope.blind_id} contains an answer-bearing field`);

if (failures.length) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join("\n"));
  process.exit(1);
}

const envelopeRoot = sha256(Buffer.from(JSON.stringify(envelopes)));
if (process.argv.includes("--json")) process.stdout.write(`${JSON.stringify({ contract: spec.contract, status: spec.status, envelope_root_sha256: envelopeRoot, envelopes }, null, 2)}\n`);
else console.log(`PASS: ${envelopes.length} answer-free baseline envelopes prepared from ${selectedPairs.length} admitted pairs; root ${envelopeRoot}; no external calls.`);

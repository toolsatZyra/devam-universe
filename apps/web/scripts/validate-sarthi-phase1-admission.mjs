import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { isAbsolute, relative, resolve } from "node:path";

const webRoot = resolve(import.meta.dirname, "..");
const repoRoot = resolve(webRoot, "..", "..");
const fixturePath = resolve(webRoot, "evaluation", "sarthi-understanding-heldout-v1.json");
const registryPath = resolve(webRoot, "evaluation", "sarthi-phase1-evidence-admission-v1.json");
const contractPath = resolve(webRoot, "evaluation", "SARTHI_PHASE_1_EVIDENCE_ADMISSION.md");
const manifestPath = resolve(webRoot, "evaluation", "SARTHI_PHASE_1_EVIDENCE_ADMISSION.sha256");

const fixtureBytes = readFileSync(fixturePath);
const fixture = JSON.parse(fixtureBytes.toString("utf8"));
const registryBytes = readFileSync(registryPath);
const registry = JSON.parse(registryBytes.toString("utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const sameSet = (left, right) => left.length === right.length
  && new Set(left).size === left.length
  && left.every((value) => right.includes(value));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

check(registry.contract === "DEVAM_SARTHI_PHASE1_EVIDENCE_ADMISSION_V1", "unexpected registry contract");
check(registry.status === "partial_admission_no_baseline_run", "registry must remain partial and unrun");
check(registry.claim_ceiling === "evidence_packet_admission_only_no_answer_or_quality_claim", "claim ceiling drift");
check(registry.heldout_fixture_sha256 === sha256(fixtureBytes), "held-out fixture hash mismatch");
check(registry.admission_rules?.all_declared_roles_required === true, "all declared roles must be required");
check(registry.admission_rules?.exact_artifact_fixity_required === true, "artifact fixity must be required");
check(registry.admission_rules?.restricted_source_text_may_be_quoted === false, "restricted source quotation must remain disabled");
check(registry.admission_rules?.fixture_readiness_is_not_admission === true, "fixture readiness must not imply admission");

const fixtureById = new Map(fixture.pairs.map((pair) => [pair.id, pair]));
const indexById = new Map();
for (const entry of registry.admission_index ?? []) {
  check(Array.isArray(entry) && entry.length === 2, "every admission index entry must be an id/status pair");
  if (!Array.isArray(entry) || entry.length !== 2) continue;
  const [id, status] = entry;
  check(fixtureById.has(id), `index contains unknown scenario ${id}`);
  check(!indexById.has(id), `duplicate admission index scenario ${id}`);
  check(["admitted", "candidate_not_packeted", "blocked_partial_evidence", "blocked_research_required"].includes(status), `${id} has invalid admission status`);
  indexById.set(id, status);
}
check(indexById.size === fixture.pair_count, "admission index must contain every held-out pair exactly once");
for (const pair of fixture.pairs) {
  check(indexById.has(pair.id), `admission index is missing ${pair.id}`);
  const status = indexById.get(pair.id);
  if (pair.evidence_readiness === "partial") check(status === "blocked_partial_evidence", `${pair.id} partial evidence must remain blocked`);
  if (pair.evidence_readiness === "research_required") check(status === "blocked_research_required", `${pair.id} research-required evidence must remain blocked`);
  if (pair.evidence_readiness === "ready") check(["admitted", "candidate_not_packeted"].includes(status), `${pair.id} ready evidence must be admitted or explicitly unpacketized`);
}

const packetScenarioIds = new Set();
const packetIds = new Set();
const restrictedRights = new Set(["reference_only", "private_evidence", "internal_only", "citation_only"]);
const answerBearingKeys = new Set(["answer", "answers", "output", "output_text", "reference_answer", "ideal_response", "preferred_thesis", "model", "score", "scores", "rating", "ratings"]);

function checkNoAnswerFields(value, location) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => checkNoAnswerFields(item, `${location}[${index}]`));
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    check(!answerBearingKeys.has(key), `${location} contains prohibited answer-bearing field ${key}`);
    checkNoAnswerFields(child, `${location}.${key}`);
  }
}
checkNoAnswerFields(registry, "registry");

for (const packet of registry.packets ?? []) {
  const pair = fixtureById.get(packet.scenario_id);
  check(Boolean(pair), `packet ${packet.packet_id} has unknown scenario ${packet.scenario_id}`);
  check(typeof packet.packet_id === "string" && packet.packet_id.length >= 12, `invalid packet id ${packet.packet_id}`);
  check(!packetIds.has(packet.packet_id), `duplicate packet id ${packet.packet_id}`);
  packetIds.add(packet.packet_id);
  check(!packetScenarioIds.has(packet.scenario_id), `duplicate packet scenario ${packet.scenario_id}`);
  packetScenarioIds.add(packet.scenario_id);
  check(indexById.get(packet.scenario_id) === "admitted", `${packet.scenario_id} packet is not marked admitted`);
  check(pair?.evidence_readiness === "ready", `${packet.scenario_id} is not ready and cannot be admitted`);
  check(sameSet(packet.languages ?? [], ["en", "hi"]), `${packet.scenario_id} languages must be exactly en and hi`);
  check(sameSet(packet.required_roles ?? [], pair?.required_evidence_roles ?? []), `${packet.scenario_id} required roles drift from Phase 0`);
  check(sameSet(packet.present_roles ?? [], packet.required_roles ?? []), `${packet.scenario_id} does not exactly cover its required roles`);
  for (const scopeField of pair?.required_scope ?? []) {
    check(typeof packet.scope?.[scopeField] === "string" && packet.scope[scopeField].trim().length > 0, `${packet.scenario_id} is missing scope field ${scopeField}`);
  }
  check(Array.isArray(packet.artifacts) && packet.artifacts.length > 0, `${packet.scenario_id} has no admitted artifacts`);
  for (const artifact of packet.artifacts ?? []) {
    const artifactPath = artifact.path;
    check(typeof artifactPath === "string" && artifactPath.length > 0, `${packet.scenario_id} has an invalid artifact path`);
    if (typeof artifactPath !== "string" || artifactPath.length === 0) continue;
    const absolutePath = resolve(repoRoot, artifactPath);
    const rel = relative(repoRoot, absolutePath);
    check(!isAbsolute(artifactPath) && rel !== ".." && !rel.startsWith(`..\\`) && !rel.startsWith("../"), `${artifactPath} escapes the repository`);
    try {
      check(artifact.sha256 === sha256(readFileSync(absolutePath)), `${artifactPath} SHA-256 mismatch`);
    } catch {
      check(false, `${artifactPath} is missing or unreadable`);
    }
    check(typeof artifact.contract === "string" && artifact.contract.length > 0, `${artifactPath} has no contract`);
    check(typeof artifact.admitted_use === "string" && artifact.admitted_use.length > 0, `${artifactPath} has no admitted use`);
    check(Array.isArray(artifact.source_rights_lanes) && artifact.source_rights_lanes.length > 0, `${artifactPath} has no rights lane`);
    if ((artifact.source_rights_lanes ?? []).some((lane) => restrictedRights.has(lane))) {
      check(artifact.quotation_allowed === false, `${artifactPath} restricted evidence must not permit quotation`);
    }
  }
  check(typeof packet.admission_note === "string" && packet.admission_note.length >= 60, `${packet.scenario_id} needs an explicit admission boundary`);
}

const admittedIndexIds = new Set([...indexById].filter(([, status]) => status === "admitted").map(([id]) => id));
check(sameSet([...packetScenarioIds], [...admittedIndexIds]), "admitted index and packet scenarios differ");
check(packetScenarioIds.size === 12, "this checkpoint must contain exactly twelve admitted packets");

const manifest = readFileSync(manifestPath, "utf8").trim().split(/\r?\n/u).filter(Boolean);
check(manifest.length === 2, "admission manifest must contain exactly two entries");
const expectedManifest = new Map(manifest.map((line) => {
  const match = /^([a-f0-9]{64})  (.+)$/u.exec(line);
  return match ? [match[2], match[1]] : [line, "INVALID"];
}));
for (const [name, bytes] of [
  ["sarthi-phase1-evidence-admission-v1.json", registryBytes],
  ["SARTHI_PHASE_1_EVIDENCE_ADMISSION.md", readFileSync(contractPath)],
]) {
  check(expectedManifest.get(name) === sha256(bytes), `${name} does not match the admission manifest`);
}

if (failures.length) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`PASS: ${packetScenarioIds.size} admitted packets; ${indexById.size} scenarios indexed; roles, scope, rights and artifact fixity verified; no baseline run.`);

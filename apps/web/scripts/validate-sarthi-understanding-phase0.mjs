import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const fixturePath = resolve(root, "evaluation", "sarthi-understanding-heldout-v1.json");
const evaluatorPath = resolve(root, "evaluation", "SARTHI_UNDERSTANDING_PHASE_0_EVALUATOR.md");
const manifestPath = resolve(root, "evaluation", "SARTHI_UNDERSTANDING_PHASE_0.sha256");

const fixtureBytes = readFileSync(fixturePath);
const fixture = JSON.parse(fixtureBytes.toString("utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

check(fixture.contract === "DEVAM_SARTHI_UNDERSTANDING_HELDOUT_V1", "unexpected fixture contract");
check(fixture.status === "frozen_unrun", "fixture must remain frozen_unrun before the first scored baseline");
check(fixture.claim_ceiling === "evaluation_fixture_only_no_quality_or_production_claim", "claim ceiling drift");
check(fixture.pair_count === 30 && fixture.scenario_count === 60, "expected 30 bilingual pairs and 60 scenarios");
check(Array.isArray(fixture.pairs) && fixture.pairs.length === fixture.pair_count, "pair count does not match payload");
check(JSON.stringify(fixture.languages) === JSON.stringify(["en", "hi"]), "language set must be exactly English and Hindi");

const capabilities = new Set(fixture.answer_capabilities);
const evidenceRoles = new Set(fixture.evidence_roles);
const lenses = new Set(fixture.lens_ids);
const hardFailures = new Set(fixture.hard_failures);
check(capabilities.size === 5, "five answer capabilities are required");
check(evidenceRoles.size === 9, "nine admissible evidence roles are required");
check(lenses.size === 6 && Object.keys(fixture.lens_contracts).length === 6, "six lens/countercheck contracts are required");
check(fixture.disagreement_register.length === 7, "seven material disagreement families are required");
check(fixture.evaluation_dimensions.length === 10, "ten answer-level evaluation dimensions are required");
check(hardFailures.size === 8, "eight non-averagable hard failures are required");
check(fixture.source_inputs.length === 2 && fixture.source_inputs.every((input) => /^[a-f0-9]{64}$/u.test(input.sha256)), "approved research inputs must remain hash-bound");

const ids = new Set();
const capabilityCounts = new Map();
const familyCounts = new Map();
const prohibitedKeys = new Set(["answer", "reference_answer", "preferred_thesis", "ideal_response", "quotation"]);

for (const pair of fixture.pairs) {
  check(typeof pair.id === "string" && /^uhp_\d{2}_[a-z0-9_]+$/.test(pair.id), `invalid pair id ${pair.id}`);
  check(!ids.has(pair.id), `duplicate pair id ${pair.id}`);
  ids.add(pair.id);
  check(capabilities.has(pair.capability), `${pair.id} has an unknown capability`);
  check(["ordinary", "consequential"].includes(pair.decision_impact), `${pair.id} has invalid impact`);
  check(["ready", "partial", "research_required"].includes(pair.evidence_readiness), `${pair.id} has invalid evidence readiness`);
  check(Array.isArray(pair.required_evidence_roles) && pair.required_evidence_roles.length > 0, `${pair.id} has no evidence roles`);
  check(pair.required_evidence_roles.every((role) => evidenceRoles.has(role)), `${pair.id} has an unknown evidence role`);
  check(Array.isArray(pair.required_scope) && pair.required_scope.length >= 3, `${pair.id} has insufficient scope fields`);
  check(Array.isArray(pair.selected_lenses) && pair.selected_lenses.every((lens) => lenses.has(lens)), `${pair.id} has an unknown lens`);
  check(Array.isArray(pair.critical_failures) && pair.critical_failures.length > 0, `${pair.id} has no critical failures`);
  check(pair.critical_failures.every((failure) => hardFailures.has(failure)), `${pair.id} has an unknown critical failure`);
  check(Object.keys(pair.questions).sort().join("|") === "en|hi", `${pair.id} must contain exactly en and hi questions`);
  check(pair.questions.en.length >= 45 && pair.questions.hi.length >= 35, `${pair.id} has an underspecified question`);
  check(/[\u0900-\u097f]/u.test(pair.questions.hi), `${pair.id} Hindi question has no Devanagari`);
  check(pair.questions.en !== pair.questions.hi, `${pair.id} bilingual questions are identical`);
  check(!Object.keys(pair).some((key) => prohibitedKeys.has(key)), `${pair.id} leaks an answer-bearing field`);
  capabilityCounts.set(pair.capability, (capabilityCounts.get(pair.capability) ?? 0) + 1);
  familyCounts.set(pair.family, (familyCounts.get(pair.family) ?? 0) + 1);
}

for (const capability of capabilities) check((capabilityCounts.get(capability) ?? 0) >= 5, `${capability} has fewer than five bilingual pairs`);
for (const family of ["ramayana", "ganesha", "durga", "diwali"]) check((familyCounts.get(family) ?? 0) >= 4, `${family} has fewer than four priority pairs`);

const manifest = readFileSync(manifestPath, "utf8").trim().split(/\r?\n/u).filter(Boolean);
check(manifest.length === 2, "frozen manifest must contain exactly two entries");
const expectedManifest = new Map(manifest.map((line) => {
  const match = /^([a-f0-9]{64})  (.+)$/u.exec(line);
  if (!match) return [line, "INVALID"];
  return [match[2], match[1]];
}));
for (const [name, bytes] of [["sarthi-understanding-heldout-v1.json", fixtureBytes], ["SARTHI_UNDERSTANDING_PHASE_0_EVALUATOR.md", readFileSync(evaluatorPath)]]) {
  const actual = createHash("sha256").update(bytes).digest("hex");
  check(expectedManifest.get(name) === actual, `${name} does not match the frozen manifest`);
}

if (failures.length) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`PASS: ${fixture.scenario_count} frozen bilingual scenarios; ${ids.size} unique pairs; no answer-bearing fields; manifest verified.`);

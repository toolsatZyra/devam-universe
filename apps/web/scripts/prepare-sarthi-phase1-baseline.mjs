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

function sourceMetadata(sources = []) {
  return sources.map((source) => ({
    source_id: source.source_id ?? source.id ?? null,
    title: source.title ?? null,
    evidence_role: source.evidence_role ?? source.role ?? null,
    rights_lane: source.rights_lane ?? source.rights ?? null,
  }));
}

function localizedMaterial(entries = []) {
  return entries.map((entry) => ({
    language_code: entry.language_code,
    title: entry.title,
    short_answer: entry.short_answer,
    significance: entry.significance,
    origin_narratives: entry.origin_narratives,
    typical_practices: entry.typical_practices,
    procedures: Array.isArray(entry.procedures) ? entry.procedures.slice(0, 1) : entry.procedures,
    variants: entry.variants,
    safety_and_boundaries: entry.safety_and_boundaries,
  }));
}

function artifactMaterial(scenarioId, artifact) {
  const absolutePath = resolve(repoRoot, artifact.path);
  if (artifact.path.endsWith("devimahatmya-devam-translations-v1.jsonl")) {
    if (scenarioId !== "uhp_02_devi_mahatmya_chapter") return { contract: artifact.contract, material: "translation boundary supplied by the pinned report" };
    const rows = readFileSync(absolutePath, "utf8").trim().split(/\r?\n/u).map((line) => JSON.parse(line));
    const passage = rows.find((row) => row.chapter === 82);
    return {
      contract: artifact.contract,
      source_aligned_beta_passage: passage ? {
        chapter: passage.chapter,
        verse: passage.verse,
        source_sha256: passage.source_sha256,
        source_ordinal: passage.source_ordinal,
        source_span_sha256: passage.source_span_sha256,
        english: passage.english,
        hindi: passage.hindi,
        confidence: passage.confidence,
        note: passage.note,
      } : null,
    };
  }
  if (!artifact.path.endsWith(".json")) return { contract: artifact.contract, admitted_use: artifact.admitted_use, content_embedded: false };
  const value = JSON.parse(readFileSync(absolutePath, "utf8"));
  if (value.episode && value.crosswalk) return {
    contract: value.contract,
    review_status: value.review_status,
    scope: value.scope,
    positive_boundary: value.positive_boundary,
    denials: value.denials,
    episode: value.episode,
    crosswalk: {
      status: value.crosswalk.status,
      gretil_locator: value.crosswalk.gretil_locator,
      griffith_locator: value.crosswalk.griffith_locator,
      dutt_locator: value.crosswalk.dutt_locator,
      numbering_statement: value.crosswalk.numbering_statement,
      ordered_alignment_anchors: value.crosswalk.ordered_alignment_anchors,
      alignment_boundary: value.crosswalk.alignment_boundary,
    },
    lenses: value.lenses,
    routes: value.routes,
  };
  if (value.principles && value.routes) return {
    contract: value.contract,
    review_status: value.review_status,
    scope: value.scope,
    positive_boundary: value.positive_boundary,
    denials: value.denials,
    principles: value.principles.map((principle) => ({
      principle_id: principle.principle_id,
      en: principle.en,
      hi: principle.hi,
      application_boundary: principle.application_boundary,
      source_id: principle.source_id,
      source_ordinal: principle.source_ordinal,
      span_sha256: principle.span_sha256,
    })),
    routes: value.routes,
  };
  if (value.guides && value.scope && value.boundaries) return {
    contract: value.contract,
    editorial_status: value.editorial_status,
    scope: value.scope,
    boundaries: value.boundaries,
    sources: sourceMetadata(value.sources),
    guides: value.guides.map((guide) => ({
      guide_id: guide.guide_id,
      language_code: guide.language_code,
      title: guide.title,
      summary: guide.summary,
      family_practice_note: guide.family_practice_note,
      context_prompts: guide.context_prompts,
      minimum_tier: Array.isArray(guide.tiers) ? (guide.tiers.find((tier) => tier.tier === "minimum") ?? guide.tiers[0]) : null,
    })),
  };
  if (value.localized_content) return {
    contract: value.contract,
    applicability: value.applicability,
    calendar: value.calendar,
    product_status: value.product_status,
    sources: sourceMetadata(value.sources),
    localized_content: localizedMaterial(value.localized_content),
  };
  if (value.contract === "DEVAM_HERO_CAMPAIGN_CALENDAR_V1") return {
    contract: value.contract,
    scope: value.scope,
    rules: {
      opening_rule_id: value.evidence?.opening_rule_id,
      closing_rule_id: value.evidence?.closing_rule_id,
      observance_ruleset_version: value.evidence?.observance_ruleset_version,
    },
    sources: sourceMetadata(value.evidence?.sources),
    days: value.days,
    display_note: value.display_note,
    boundaries: value.boundaries,
  };
  if (value.contract === "DEVAM_LEAN_SOURCE_VAULT_ACQUISITION_V1") return {
    contract: value.contract,
    acquired_files: value.acquired_files,
    rights_lane: value.rights_lane,
    source_boundary: value.source_boundary,
    source_payloads_copied_into_app: value.source_payloads_copied_into_app,
  };
  if (value.contract === "DEVAM_DEVIMAHATMYA_SOURCE_ALIGNED_TRANSLATION_PACK_V1") return {
    contract: value.contract,
    positive_boundary: value.positive_boundary,
    scope_boundary: value.scope_boundary,
    completion: value.completion,
    translation: value.translation,
    source_object_count: value.source_object_count,
    source_passage_count: value.source_passage_count,
    translation_count: value.translation_count,
  };
  if (value.candidate_contract && value.claim_boundary) return {
    contract: value.contract,
    purpose: value.purpose,
    candidate_contract: value.candidate_contract,
    claim_boundary: value.claim_boundary,
  };
  return { contract: value.contract ?? artifact.contract, admitted_use: artifact.admitted_use, content_embedded: false };
}

function evidenceMaterial(pair, packet) {
  const material = {
    scenario_id: pair.id,
    evidence_roles: packet.present_roles,
    scope: packet.scope,
    source_identity: packet.source_identity,
    admission_boundary: packet.admission_note,
    reviewed_artifacts: packet.artifacts.map((artifact) => artifactMaterial(pair.id, artifact)),
  };
  const bytes = Buffer.byteLength(JSON.stringify(material));
  check(bytes > 200, `${pair.id} has insufficient materialized evidence`);
  check(bytes <= spec.prepared_envelope.maximum_material_bytes_per_pair, `${pair.id} materialized evidence exceeds the byte ceiling`);
  const prohibitedMaterialKeys = new Set(["quotation", "source_text", "raw_text", "provider_text", "private_text"]);
  const inspect = (value, location) => {
    if (Array.isArray(value)) return value.forEach((item, index) => inspect(item, `${location}[${index}]`));
    if (!value || typeof value !== "object") return;
    for (const [key, child] of Object.entries(value)) {
      check(!prohibitedMaterialKeys.has(key), `${location} contains prohibited source-payload field ${key}`);
      inspect(child, `${location}.${key}`);
    }
  };
  inspect(material, pair.id);
  return material;
}

const envelopes = [];
for (const pair of selectedPairs) {
  const packet = packetByScenario.get(pair.id);
  check(Boolean(packet), `${pair.id} has no admitted packet`);
  if (!packet) continue;
  const packetSha = sha256(Buffer.from(JSON.stringify(packet)));
  const artifactSha = sha256(Buffer.from(packet.artifacts.map((artifact) => artifact.sha256).join("\n")));
  const material = evidenceMaterial(pair, packet);
  const materialSha = sha256(Buffer.from(JSON.stringify(material)));
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
      evidence_material: material,
      evidence_material_sha256: materialSha,
    });
  }
}

check(envelopes.length === spec.selection.scenario_count, "prepared envelope count mismatch");
check(new Set(envelopes.map((envelope) => envelope.blind_id)).size === envelopes.length, "blind IDs are not unique");
for (let index = 0; index < envelopes.length; index += 2) check(envelopes[index].evidence_material_sha256 === envelopes[index + 1].evidence_material_sha256, `${envelopes[index].scenario_id} language pair does not share identical evidence bytes`);
const prohibited = new Set(["answer", "reference_answer", "ideal_response", "score", "rating", "output_text"]);
for (const envelope of envelopes) check(!Object.keys(envelope).some((key) => prohibited.has(key)), `${envelope.blind_id} contains an answer-bearing field`);

if (failures.length) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join("\n"));
  process.exit(1);
}

const envelopeRoot = sha256(Buffer.from(JSON.stringify(envelopes)));
if (process.argv.includes("--json")) process.stdout.write(`${JSON.stringify({ contract: spec.contract, status: spec.status, envelope_root_sha256: envelopeRoot, envelopes }, null, 2)}\n`);
else console.log(`PASS: ${envelopes.length} answer-free baseline envelopes prepared from ${selectedPairs.length} admitted pairs; root ${envelopeRoot}; no external calls.`);

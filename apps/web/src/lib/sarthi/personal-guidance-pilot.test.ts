import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { answerSarthiWithKnowledge } from "./grounded-answer";

type Variant = { id: string; prompt: string; context: { languageCode: string } };

function json(relative: string) {
  return JSON.parse(readFileSync(resolve(process.cwd(), "../..", relative), "utf8")) as Record<string, unknown>;
}

function sha256(relative: string): string {
  return createHash("sha256").update(readFileSync(resolve(process.cwd(), "../..", relative))).digest("hex");
}

describe("Sarthi personal-guidance pilot supplement", () => {
  const supplementPath = "apps/web/evaluation/sarthi-personal-guidance-pilot-supplement-v0.1.json";
  const supplement = json(supplementPath) as {
    contract: string;
    status: string;
    base_pilot: { path: string; bytes: number; sha256: string; pair_id: string };
    research_manifests: Array<{ path: string; sha256: string }>;
    evidence_bundle: { path: string; bytes: number; sha256: string; source_payload_duplicated: boolean; private_commentary_quotation_allowed: boolean };
    candidate_contract: Record<"variant_a" | "variant_b", { scenario_id: string; expected_runtime_mode: string; expected_citation_ordinals: number[] }>;
    blinded_run: { status: string; required_arms: string[]; paid_or_external_model_calls_made: boolean; promotion_claim_allowed: boolean };
  };
  const pilot = json(supplement.base_pilot.path) as { pairs: Array<{ pair_id: string; variants: Variant[] }> };
  const pair = pilot.pairs.find((candidate) => candidate.pair_id === supplement.base_pilot.pair_id);

  it("binds the immutable pilot, research manifests and reviewed evidence pack", () => {
    expect(supplement.contract).toBe("DEVAM_SARTHI_PERSONAL_GUIDANCE_PILOT_SUPPLEMENT_V0_1");
    expect(supplement.status).toBe("deterministic_candidate_ready_same_model_and_blinded_review_not_run");
    expect(readFileSync(resolve(process.cwd(), "../..", supplement.base_pilot.path))).toHaveLength(supplement.base_pilot.bytes);
    expect(sha256(supplement.base_pilot.path)).toBe(supplement.base_pilot.sha256);
    for (const manifest of supplement.research_manifests) expect(sha256(manifest.path)).toBe(manifest.sha256);
    expect(readFileSync(resolve(process.cwd(), "../..", supplement.evidence_bundle.path))).toHaveLength(supplement.evidence_bundle.bytes);
    expect(sha256(supplement.evidence_bundle.path)).toBe(supplement.evidence_bundle.sha256);
    expect(supplement.evidence_bundle).toMatchObject({ source_payload_duplicated: false, private_commentary_quotation_allowed: false });
  });

  it("keeps the underspecified and materially specified variants behaviourally distinct", async () => {
    expect(pair?.variants).toHaveLength(2);
    if (!pair) throw new Error("guidance-01 pair missing");
    for (const [index, key] of (["variant_a", "variant_b"] as const).entries()) {
      const variant = pair.variants[index];
      const contract = supplement.candidate_contract[key];
      expect(variant.id).toBe(contract.scenario_id);
      const result = await answerSarthiWithKnowledge({ message: variant.prompt, context: variant.context });
      expect(result.ok).toBe(true);
      if (!result.ok) throw new Error(`Expected candidate response for ${variant.id}`);
      expect(result.mode).toBe(contract.expected_runtime_mode);
      expect(result.citations.map((citation) => citation.sourceOrdinal)).toEqual(contract.expected_citation_ordinals);
      expect(result.citations.every((citation) => citation.quotation === undefined)).toBe(true);
    }
  });

  it("keeps the actual answer-quality promotion gate visibly unrun", () => {
    expect(supplement.blinded_run).toEqual({
      status: "not_run",
      required_arms: ["grounded_rag", "prompt_only_guidance", "material_context_and_typed_coverage", "thin_governor"],
      same_model_required: true,
      same_evidence_bytes_required: true,
      human_blinded_review_required: true,
      paid_or_external_model_calls_made: false,
      promotion_claim_allowed: false,
    });
  });
});

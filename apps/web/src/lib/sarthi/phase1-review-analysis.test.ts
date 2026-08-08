import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { validateAndSummarizeReview } from "../../../scripts/sarthi-phase1-review-analysis-lib.mjs";

const dimensions = ["d1", "d2"];
const hardFailures = ["h1"];
const spec = { reviewers_per_scenario_minimum: 2, rating_scale: { minimum: 1, maximum: 5 }, dimensions, hard_failures: hardFailures, agreement: { minimum_within_one_point_rate: 0.8 } };
const packet = { items: [{ blind_id: "blind-en", language: "en" }, { blind_id: "blind-hi", language: "hi" }] };
const review = (reviewer: string, blindId: string, rating: number) => ({ reviewer_id: reviewer, blind_id: blindId, dimension_ratings: { d1: rating, d2: rating }, dimension_rationales: { d1: "Evidence supports this rating.", d2: "Scope supports this rating." }, hard_failures: { h1: false }, hard_failure_rationales: { h1: "" }, overall_note: "A concise evidence-based assessment." });

describe("Sarthi Phase 1 review analysis", () => {
  it("passes analyzer preflight without ratings or writes", () => {
    const output = execFileSync(process.execPath, [resolve(process.cwd(), "scripts", "analyze-sarthi-phase1-review.mjs"), "--preflight"], { cwd: process.cwd(), encoding: "utf8" });
    expect(output).toContain("complete two-reviewer ratings required; no analysis written");
  });

  it("separates English and Hindi agreement and blocks incomplete review coverage", () => {
    const complete = validateAndSummarizeReview(spec, packet, { contract: "DEVAM_SARTHI_PHASE1_BLINDED_RATINGS_V1", status: "complete", reviews: [review("reviewer-one", "blind-en", 4), review("reviewer-two", "blind-en", 5), review("reviewer-one", "blind-hi", 4), review("reviewer-two", "blind-hi", 4)] });
    const analysis = complete.analysis as null | { promotion_eligible: boolean; languages: { en: { overall_within_one_point_rate: number } } };
    expect(complete.failures).toEqual([]);
    expect(analysis?.promotion_eligible).toBe(true);
    expect(analysis?.languages.en.overall_within_one_point_rate).toBe(1);
    const incomplete = validateAndSummarizeReview(spec, packet, { contract: "DEVAM_SARTHI_PHASE1_BLINDED_RATINGS_V1", status: "complete", reviews: [review("reviewer-one", "blind-en", 4)] });
    expect(incomplete.failures.some((failure: string) => failure.includes("fewer than 2 independent reviewers"))).toBe(true);
  });
});

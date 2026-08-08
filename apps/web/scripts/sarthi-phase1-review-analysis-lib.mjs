const exactKeys = (value, expected) => value && typeof value === "object" && !Array.isArray(value)
  && Object.keys(value).sort().join("|") === [...expected].sort().join("|");

export function validateAndSummarizeReview(spec, packet, ratings) {
  const failures = [];
  const check = (condition, message) => { if (!condition) failures.push(message); };
  check(ratings.contract === "DEVAM_SARTHI_PHASE1_BLINDED_RATINGS_V1", "unexpected ratings contract");
  check(ratings.status === "complete", "ratings status must be complete");
  check(Array.isArray(ratings.reviews), "reviews must be an array");
  const itemByBlindId = new Map(packet.items.map((item) => [item.blind_id, item]));
  const reviewsByBlindId = new Map(packet.items.map((item) => [item.blind_id, []]));
  const identities = new Set();

  for (const review of ratings.reviews ?? []) {
    const identity = `${review.reviewer_id}|${review.blind_id}`;
    check(/^reviewer-[a-z0-9][a-z0-9-]{2,63}$/u.test(review.reviewer_id ?? ""), `${identity} has an invalid pseudonymous reviewer ID`);
    check(itemByBlindId.has(review.blind_id), `${identity} references an unknown blind ID`);
    check(!identities.has(identity), `${identity} is duplicated`);
    identities.add(identity);
    check(exactKeys(review.dimension_ratings, spec.dimensions), `${identity} dimension rating keys drift`);
    check(exactKeys(review.dimension_rationales, spec.dimensions), `${identity} dimension rationale keys drift`);
    check(exactKeys(review.hard_failures, spec.hard_failures), `${identity} hard failure keys drift`);
    check(exactKeys(review.hard_failure_rationales, spec.hard_failures), `${identity} hard failure rationale keys drift`);
    for (const dimension of spec.dimensions) {
      const rating = review.dimension_ratings?.[dimension];
      const rationale = review.dimension_rationales?.[dimension];
      check(Number.isInteger(rating) && rating >= spec.rating_scale.minimum && rating <= spec.rating_scale.maximum, `${identity}/${dimension} rating is outside the scale`);
      check(typeof rationale === "string" && rationale.trim().length >= 10 && rationale.length <= 1000, `${identity}/${dimension} needs a concise evidence-based rationale`);
    }
    for (const hardFailure of spec.hard_failures) {
      const present = review.hard_failures?.[hardFailure];
      const rationale = review.hard_failure_rationales?.[hardFailure];
      check(typeof present === "boolean", `${identity}/${hardFailure} must be boolean`);
      check(typeof rationale === "string" && (!present || rationale.trim().length >= 10) && rationale.length <= 1000, `${identity}/${hardFailure} has an invalid rationale`);
    }
    check(typeof review.overall_note === "string" && review.overall_note.trim().length >= 10 && review.overall_note.length <= 2000, `${identity} needs an overall note`);
    if (reviewsByBlindId.has(review.blind_id)) reviewsByBlindId.get(review.blind_id).push(review);
  }

  for (const [blindId, reviews] of reviewsByBlindId) {
    check(new Set(reviews.map((review) => review.reviewer_id)).size >= spec.reviewers_per_scenario_minimum, `${blindId} has fewer than ${spec.reviewers_per_scenario_minimum} independent reviewers`);
  }
  if (failures.length) return { failures, analysis: null };

  const languages = {};
  let totalHardFailures = 0;
  for (const language of ["en", "hi"]) {
    const dimensionStats = {};
    const allDifferences = [];
    for (const dimension of spec.dimensions) {
      const differences = [];
      for (const item of packet.items.filter((candidate) => candidate.language === language)) {
        const reviews = reviewsByBlindId.get(item.blind_id);
        for (let left = 0; left < reviews.length; left += 1) {
          for (let right = left + 1; right < reviews.length; right += 1) {
            differences.push(Math.abs(reviews[left].dimension_ratings[dimension] - reviews[right].dimension_ratings[dimension]));
          }
        }
      }
      allDifferences.push(...differences);
      dimensionStats[dimension] = {
        comparisons: differences.length,
        mean_absolute_difference: Number((differences.reduce((sum, value) => sum + value, 0) / differences.length).toFixed(4)),
        within_one_point_rate: Number((differences.filter((value) => value <= 1).length / differences.length).toFixed(4)),
      };
    }
    const hardFailureCounts = Object.fromEntries(spec.hard_failures.map((failure) => [failure, 0]));
    for (const item of packet.items.filter((candidate) => candidate.language === language)) {
      for (const review of reviewsByBlindId.get(item.blind_id)) {
        for (const hardFailure of spec.hard_failures) if (review.hard_failures[hardFailure]) hardFailureCounts[hardFailure] += 1;
      }
    }
    const languageHardFailures = Object.values(hardFailureCounts).reduce((sum, value) => sum + value, 0);
    totalHardFailures += languageHardFailures;
    const withinOne = allDifferences.filter((value) => value <= 1).length / allDifferences.length;
    languages[language] = {
      item_count: packet.items.filter((candidate) => candidate.language === language).length,
      dimension_stats: dimensionStats,
      overall_mean_absolute_difference: Number((allDifferences.reduce((sum, value) => sum + value, 0) / allDifferences.length).toFixed(4)),
      overall_within_one_point_rate: Number(withinOne.toFixed(4)),
      agreement_threshold_met: withinOne >= spec.agreement.minimum_within_one_point_rate,
      hard_failure_counts: hardFailureCounts,
      hard_failure_total: languageHardFailures,
    };
  }
  const promotionEligible = Object.values(languages).every((language) => language.agreement_threshold_met) && totalHardFailures === 0;
  return {
    failures: [],
    analysis: {
      contract: "DEVAM_SARTHI_PHASE1_REVIEW_ANALYSIS_V1",
      status: promotionEligible ? "eligible_for_human_phase_decision" : "not_eligible_for_promotion",
      reviewer_record_count: ratings.reviews.length,
      languages,
      hard_failure_total: totalHardFailures,
      promotion_eligible: promotionEligible,
      claim_boundary: "Agreement and hard-failure analysis only; this does not establish production readiness, cultural legitimacy, user benefit or superiority to another arm.",
    },
  };
}

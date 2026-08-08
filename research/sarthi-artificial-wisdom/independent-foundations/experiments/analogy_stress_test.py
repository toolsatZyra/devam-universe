"""Synthetic surface-versus-structure analogy retrieval check.

The dataset is intentionally small and authored to expose the difference.  It
is a mechanism demonstration, not evidence of ecological performance.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Case:
    name: str
    surface: frozenset[str]
    relations: frozenset[str]
    boundary: frozenset[str] = frozenset()


CASES = (
    Case("startup_server_overload", frozenset({"startup", "software", "growth"}), frozenset({"growth_exceeds_capacity", "local_fix_moves_bottleneck"})),
    Case("hospital_triage_overload", frozenset({"hospital", "patients", "emergency"}), frozenset({"demand_exceeds_capacity", "local_fix_moves_bottleneck"})),
    Case("festival_crowd_overload", frozenset({"festival", "crowd", "religion"}), frozenset({"demand_exceeds_capacity", "local_fix_moves_bottleneck"}), frozenset({"public_safety"})),
    Case("startup_brand_relaunch", frozenset({"startup", "software", "growth"}), frozenset({"identity_change_reframes_demand"})),
    Case("river_floodplain", frozenset({"river", "water", "ecology"}), frozenset({"demand_exceeds_capacity", "distributed_buffer_absorbs_variance"})),
    Case("portfolio_diversification", frozenset({"finance", "investment", "risk"}), frozenset({"correlated_exposure_amplifies_tail", "distributed_buffer_absorbs_variance"})),
    Case("monoculture_crop_failure", frozenset({"agriculture", "crop", "ecology"}), frozenset({"correlated_exposure_amplifies_tail", "diversity_reduces_shared_failure"})),
    Case("diverse_review_panel", frozenset({"people", "review", "organization"}), frozenset({"correlated_exposure_amplifies_tail", "diversity_reduces_shared_failure"}), frozenset({"power_can_suppress_diversity"})),
)

QUERIES = (
    (Case("new_factory_bottleneck", frozenset({"factory", "machines", "growth"}), frozenset({"demand_exceeds_capacity", "local_fix_moves_bottleneck"})), "hospital_triage_overload"),
    (Case("cybersecurity_common_dependency", frozenset({"software", "security", "risk"}), frozenset({"correlated_exposure_amplifies_tail", "diversity_reduces_shared_failure"})), "monoculture_crop_failure"),
    (Case("supply_chain_buffers", frozenset({"factory", "shipping", "risk"}), frozenset({"demand_exceeds_capacity", "distributed_buffer_absorbs_variance"})), "river_floodplain"),
)


def jaccard(a: frozenset[str], b: frozenset[str]) -> float:
    if not (a or b):
        return 0.0
    return len(a & b) / len(a | b)


def retrieve(query: Case, mode: str) -> Case:
    if mode == "surface":
        return max(CASES, key=lambda c: (jaccard(query.surface, c.surface), c.name))
    if mode == "structure":
        return max(CASES, key=lambda c: (jaccard(query.relations, c.relations), c.name))
    raise ValueError(mode)


def main() -> None:
    for mode in ("surface", "structure"):
        correct = 0
        print(f"[{mode}]")
        for query, expected in QUERIES:
            selected = retrieve(query, mode).name
            passed = selected == expected
            correct += int(passed)
            print(f"  {query.name}: {selected}; expected={expected}; {'PASS' if passed else 'FAIL'}")
        print(f"  top1={correct}/{len(QUERIES)}")


if __name__ == "__main__":
    main()

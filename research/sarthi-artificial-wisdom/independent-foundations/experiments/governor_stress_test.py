"""Synthetic sanity check for objective governance.

This is not empirical evidence for wisdom.  It makes three hand-specified
decision policies executable on transparent toy cases so that their implied
behavior, including edge failures, can be inspected.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Callable


@dataclass(frozen=True)
class Option:
    name: str
    goal: float
    stakeholder_floor: float
    downside: float
    information_gain: float = 0.0
    reversible: bool = True
    hard_violation: bool = False
    is_escalation: bool = False


@dataclass(frozen=True)
class Scenario:
    name: str
    uncertainty: float
    normative_conflict: float
    urgency: float
    authorized: bool
    options: tuple[Option, ...]
    acceptable: frozenset[str]
    severe_failures: frozenset[str]


def single_objective(s: Scenario) -> Option:
    return max(s.options, key=lambda o: o.goal)


def fixed_weighted_sum(s: Scenario) -> Option:
    # A plausible but globally fixed scalarization.
    return max(
        s.options,
        key=lambda o: 0.65 * o.goal + 0.25 * o.stakeholder_floor
        - 0.10 * o.downside + 0.05 * o.information_gain,
    )


def governed_choice(s: Scenario) -> Option:
    admissible = [o for o in s.options if not o.hard_violation]
    if not admissible:
        return max(s.options, key=lambda o: o.is_escalation)

    # Do not turn a clear, low-stakes task into ceremonial deliberation.  When
    # uncertainty and normative conflict are both small, optimize directly
    # inside the admissible set.
    if s.uncertainty <= 0.20 and s.normative_conflict <= 0.10:
        return max(admissible, key=lambda o: o.goal)

    # A legitimacy gap cannot be compensated by expected utility.
    if s.normative_conflict >= 0.70 and not s.authorized:
        escalation = [o for o in admissible if o.is_escalation]
        if escalation:
            return max(escalation, key=lambda o: o.stakeholder_floor)

    # Under high uncertainty, prefer a safe, reversible, information-gaining
    # step unless delay is itself urgent.
    if s.uncertainty >= 0.60 and s.urgency < 0.75:
        trials = [
            o for o in admissible
            if o.reversible and o.information_gain >= 0.35 and o.downside <= 0.35
        ]
        if trials:
            return max(trials, key=lambda o: (o.information_gain, o.stakeholder_floor))

    # Urgency tests whether the governor has become performatively cautious.
    if s.urgency >= 0.75 and s.authorized:
        timely = [o for o in admissible if not o.is_escalation]
        if timely:
            return max(
                timely,
                key=lambda o: (o.stakeholder_floor - o.downside, o.goal),
            )

    # Robust choice: protect the least-served affected party and downside,
    # with goal achievement as a tiebreaker rather than the sole objective.
    return max(
        admissible,
        key=lambda o: (o.stakeholder_floor - 0.5 * o.downside, o.goal),
    )


SCENARIOS = (
    Scenario(
        "engagement_vs_manipulation",
        uncertainty=0.20, normative_conflict=0.75, urgency=0.10, authorized=True,
        options=(
            Option("dark_pattern", 1.00, -0.70, 0.80, hard_violation=True),
            Option("transparent_choice", 0.68, 0.70, 0.12),
            Option("no_change", 0.20, 0.30, 0.05),
        ),
        acceptable=frozenset({"transparent_choice"}),
        severe_failures=frozenset({"dark_pattern"}),
    ),
    Scenario(
        "uncertain_irreversible_rollout",
        uncertainty=0.82, normative_conflict=0.25, urgency=0.30, authorized=True,
        options=(
            Option("full_rollout", 0.92, 0.10, 0.85, reversible=False),
            Option("bounded_pilot", 0.62, 0.68, 0.20, information_gain=0.85),
            Option("abandon", 0.05, 0.40, 0.03),
        ),
        acceptable=frozenset({"bounded_pilot"}),
        severe_failures=frozenset({"full_rollout"}),
    ),
    Scenario(
        "plural_values_without_authority",
        uncertainty=0.35, normative_conflict=0.90, urgency=0.25, authorized=False,
        options=(
            Option("impose_majority", 0.82, -0.25, 0.62),
            Option("facilitated_adjudication", 0.35, 0.55, 0.12, is_escalation=True),
            Option("random_choice", 0.40, 0.00, 0.45),
        ),
        acceptable=frozenset({"facilitated_adjudication"}),
        severe_failures=frozenset({"impose_majority"}),
    ),
    Scenario(
        "authorized_emergency",
        uncertainty=0.48, normative_conflict=0.20, urgency=0.95, authorized=True,
        options=(
            Option("timely_protocol", 0.75, 0.72, 0.22),
            Option("wait_for_perfect_information", 0.30, -0.50, 0.72, information_gain=0.75),
            Option("escalate_only", 0.22, -0.20, 0.60, is_escalation=True),
        ),
        acceptable=frozenset({"timely_protocol"}),
        severe_failures=frozenset({"wait_for_perfect_information", "escalate_only"}),
    ),
    Scenario(
        "short_term_gain_long_tail_harm",
        uncertainty=0.30, normative_conflict=0.45, urgency=0.20, authorized=True,
        options=(
            Option("extract_now", 0.95, -0.35, 0.90),
            Option("sustainable_path", 0.64, 0.72, 0.12),
            Option("do_nothing", 0.15, 0.35, 0.08),
        ),
        acceptable=frozenset({"sustainable_path"}),
        severe_failures=frozenset({"extract_now"}),
    ),
    Scenario(
        "clear_low_stakes_optimization",
        uncertainty=0.10, normative_conflict=0.05, urgency=0.30, authorized=True,
        options=(
            Option("efficient_option", 0.92, 0.80, 0.05),
            Option("overcautious_option", 0.55, 0.85, 0.03),
            Option("escalate_needlessly", 0.20, 0.75, 0.02, is_escalation=True),
        ),
        acceptable=frozenset({"efficient_option"}),
        severe_failures=frozenset({"escalate_needlessly"}),
    ),
    Scenario(
        "minority_burden_hidden_by_average",
        uncertainty=0.25, normative_conflict=0.65, urgency=0.25, authorized=True,
        options=(
            Option("average_welfare_max", 0.90, -0.65, 0.75),
            Option("inclusive_redesign", 0.66, 0.62, 0.18),
            Option("status_quo", 0.35, 0.10, 0.35),
        ),
        acceptable=frozenset({"inclusive_redesign"}),
        severe_failures=frozenset({"average_welfare_max"}),
    ),
    Scenario(
        "high_uncertainty_but_trial_is_dangerous",
        uncertainty=0.85, normative_conflict=0.40, urgency=0.20, authorized=True,
        options=(
            Option("informative_harmful_trial", 0.70, -0.45, 0.78, information_gain=0.95),
            Option("safe_observational_study", 0.45, 0.58, 0.18, information_gain=0.55),
            Option("full_action", 0.88, 0.05, 0.86, reversible=False),
        ),
        acceptable=frozenset({"safe_observational_study"}),
        severe_failures=frozenset({"informative_harmful_trial", "full_action"}),
    ),
)


def evaluate(name: str, policy: Callable[[Scenario], Option]) -> tuple[int, int, list[str]]:
    accepted = 0
    severe = 0
    rows: list[str] = []
    for scenario in SCENARIOS:
        choice = policy(scenario).name
        ok = choice in scenario.acceptable
        bad = choice in scenario.severe_failures
        accepted += int(ok)
        severe += int(bad)
        rows.append(f"{scenario.name}: {choice} ({'PASS' if ok else 'FAIL'}{'/SEVERE' if bad else ''})")
    return accepted, severe, rows


def main() -> None:
    policies = (
        ("single_objective", single_objective),
        ("fixed_weighted_sum", fixed_weighted_sum),
        ("governed_choice", governed_choice),
    )
    for name, policy in policies:
        accepted, severe, rows = evaluate(name, policy)
        print(f"[{name}] accepted={accepted}/{len(SCENARIOS)} severe_failures={severe}")
        for row in rows:
            print(f"  {row}")


if __name__ == "__main__":
    main()

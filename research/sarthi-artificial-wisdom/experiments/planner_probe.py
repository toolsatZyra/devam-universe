"""Synthetic, dependency-free probes for the Sarthi wisdom research programme.

These tests demonstrate representational behaviour only. They do not estimate
production efficacy because fixtures, tags, and gold labels are hand-authored.
"""

from __future__ import annotations

import json
import math
import re
from collections import Counter
from pathlib import Path


HERE = Path(__file__).resolve().parent
FIXTURES = json.loads((HERE / "fixtures.json").read_text(encoding="utf-8"))


def tokens(text: str) -> set[str]:
    return set(re.findall(r"[a-z0-9]+", text.lower()))


def jaccard(left: str, right: str) -> float:
    a, b = tokens(left), tokens(right)
    return len(a & b) / len(a | b) if a or b else 0.0


def ranked(query: str, docs: list[dict]) -> list[tuple[float, dict]]:
    return sorted(((jaccard(query, d["text"]), d) for d in docs), key=lambda x: (-x[0], x[1]["id"]))


def scope_probe() -> dict:
    docs = FIXTURES["documents"]
    rows = []
    baseline_hits = 0
    filtered_hits = 0
    for item in FIXTURES["scope_queries"]:
        baseline = ranked(item["query"], docs)[0][1]["id"]
        eligible = [
            d
            for d in docs
            if all(d.get(k) == v for k, v in item["filters"].items())
        ]
        filtered = ranked(item["query"], eligible)[0][1]["id"] if eligible else None
        baseline_hits += baseline == item["gold"]
        filtered_hits += filtered == item["gold"]
        rows.append({"id": item["id"], "gold": item["gold"], "baseline": baseline, "filtered": filtered})
    return {
        "name": "typed_scope",
        "n": len(rows),
        "baseline_top1": baseline_hits / len(rows),
        "filtered_top1": filtered_hits / len(rows),
        "rows": rows,
    }


def guidance_coverage_probe(k: int = 4) -> dict:
    docs = FIXTURES["documents"]
    rows = []
    baseline_recalls = []
    routed_recalls = []
    for item in FIXTURES["guidance_queries"]:
        required = set(item["required_kinds"])
        baseline_docs = [d for _, d in ranked(item["query"], docs)[:k]]
        baseline_kinds = {d["kind"] for d in baseline_docs}

        routed_docs = []
        for kind in item["required_kinds"]:
            candidates = [d for d in docs if d["kind"] == kind]
            if candidates:
                routed_docs.append(ranked(item["query"], candidates)[0][1])
        routed_kinds = {d["kind"] for d in routed_docs}

        baseline_recall = len(required & baseline_kinds) / len(required)
        routed_recall = len(required & routed_kinds) / len(required)
        baseline_recalls.append(baseline_recall)
        routed_recalls.append(routed_recall)
        rows.append(
            {
                "id": item["id"],
                "baseline_ids": [d["id"] for d in baseline_docs],
                "baseline_required_type_recall": baseline_recall,
                "routed_ids": [d["id"] for d in routed_docs],
                "routed_required_type_recall": routed_recall,
            }
        )
    return {
        "name": "required_type_coverage",
        "n": len(rows),
        "baseline_mean_recall": sum(baseline_recalls) / len(rows),
        "routed_mean_recall": sum(routed_recalls) / len(rows),
        "rows": rows,
    }


def analogy_probe() -> dict:
    item = FIXTURES["analogy"]
    docs = {d["id"]: d for d in FIXTURES["documents"]}
    lexical = sorted(
        ((jaccard(item["query"], docs[c["id"]]["text"]), c["id"]) for c in item["candidates"]),
        reverse=True,
    )

    weights = {"relationships": 3.0, "values": 2.0, "constraints": 3.0, "affected": 2.0, "reversibility": 3.0}
    structural = []
    for candidate in item["candidates"]:
        score = 0.0
        details = {}
        for dimension, weight in weights.items():
            target = set(item["target_features"][dimension])
            found = set(candidate["features"][dimension])
            overlap = len(target & found) / len(target | found) if target or found else 0.0
            details[dimension] = overlap
            score += weight * overlap
        structural.append((score, candidate["id"], details))
    structural.sort(reverse=True)
    return {
        "name": "analogy_surface_vs_structure",
        "lexical_ranking": [{"id": cid, "score": round(score, 3)} for score, cid in lexical],
        "structural_ranking": [
            {"id": cid, "score": round(score, 3), "dimensions": details}
            for score, cid, details in structural
        ],
    }


def clarification_probe() -> dict:
    rows = []
    for scenario in FIXTURES["clarification"]:
        for variable, decisions in scenario["variables"].items():
            counts = Counter(decisions)
            total = sum(counts.values())
            entropy = -sum((count / total) * math.log2(count / total) for count in counts.values())
            changes = len(counts) > 1 and not all(decision.startswith("same_lane") for decision in decisions)
            rows.append(
                {
                    "scenario": scenario["scenario"],
                    "variable": variable,
                    "distinct_outcomes": len(counts),
                    "decision_change": changes,
                    "entropy_bits": round(entropy, 3),
                }
            )
    ordered = sorted(rows, key=lambda r: (-int(r["decision_change"]), -r["entropy_bits"], r["variable"]))
    return {"name": "clarification_value", "rows": ordered}


def main() -> None:
    output = {
        "programme_date": "2026-08-07",
        "fixture_type": "synthetic_representational_probe",
        "results": [scope_probe(), guidance_coverage_probe(), analogy_probe(), clarification_probe()],
    }
    print(json.dumps(output, ensure_ascii=False, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Fail-closed structural and evidence validation for the frozen Sarthi answer pilot."""

from __future__ import annotations

import hashlib
import json
import os
import sys
from collections import Counter
from pathlib import Path, PurePosixPath


ROOT = Path(__file__).resolve().parents[1]
FIXTURE = ROOT / "apps" / "web" / "evaluation" / "sarthi-answer-pilot-v0.1.json"

EXPECTED_FAMILIES = {
    "exact_fact",
    "panchang",
    "ritual_vidhi",
    "festival_story",
    "comparison",
    "personal_guidance",
    "moral_ambiguity",
    "reflection",
}
EXPECTED_MODES = {"direct", "clarify", "options", "defer"}
EXPECTED_MODE_MAPPING = {
    "direct": ["direct"],
    "clarify": ["clarify"],
    "options": ["conditional", "plural"],
    "defer": ["unable_to_ground", "escalate"],
}
EXPECTED_ARMS = [
    "grounded_rag",
    "prompt_only_guidance",
    "material_context_and_typed_coverage",
    "thin_governor",
]
EXPECTED_RUBRICS = {"exact", "panchang", "ritual", "narrative", "comparison", "guidance", "reflection"}
AVAILABLE_STATUSES = {
    "available_source_scoped",
    "available_user_complete_lane",
    "available_parallel_lanes",
}
ALLOWED_PACK_CONTRACTS = {
    "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1",
}


def fail(message: str) -> None:
    raise AssertionError(message)


def sha256(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()


def strict_json(path: Path) -> tuple[bytes, dict]:
    raw = path.read_bytes()
    try:
        text = raw.decode("utf-8", errors="strict")
    except UnicodeDecodeError as exc:
        fail(f"not strict UTF-8: {path}: {exc}")
    try:
        value = json.loads(text)
    except json.JSONDecodeError as exc:
        fail(f"invalid JSON: {path}: {exc}")
    if not isinstance(value, dict):
        fail(f"JSON root must be an object: {path}")
    return raw, value


def is_reparse(path: Path) -> bool:
    attributes = getattr(path.lstat(), "st_file_attributes", 0)
    return bool(attributes & 0x400)


def safe_repo_file(relative: str) -> Path:
    pure = PurePosixPath(relative)
    if pure.is_absolute() or not relative or "\\" in relative or any(part in {"", ".", ".."} for part in pure.parts):
        fail(f"unsafe evidence path: {relative!r}")
    candidate = ROOT.joinpath(*pure.parts)
    resolved_root = ROOT.resolve(strict=True)
    resolved = candidate.resolve(strict=True)
    if not resolved.is_relative_to(resolved_root):
        fail(f"evidence path escapes repository: {relative}")
    if candidate.is_symlink() or is_reparse(candidate):
        fail(f"evidence path is a link or reparse point: {relative}")
    if not candidate.is_file():
        fail(f"evidence path is not an ordinary file: {relative}")
    return candidate


def validate_pack(path: Path) -> None:
    _, pack = strict_json(path)
    contract = pack.get("contract")
    if contract in ALLOWED_PACK_CONTRACTS:
        status = pack.get("product_status")
        if not isinstance(status, dict):
            fail(f"ritual pack lacks product_status: {path}")
        if status.get("classification") not in {"user_complete_lane", "participation_companion"}:
            fail(f"ritual evidence is not an accepted current lane: {path}")
        if status.get("review_status") not in {"internal_beta_reviewed", "published"}:
            fail(f"ritual evidence is not reviewed for the pilot: {path}")
        return
    if path.parts[-2] == "panchang":
        return
    if path.parts[-2] == "ganesha" and isinstance(pack.get("pack_id"), str):
        return
    fail(f"unsupported evidence-pack identity: {path}")


def main() -> int:
    raw, fixture = strict_json(FIXTURE)
    checks: dict[str, bool] = {}

    checks["contract_and_freeze_state"] = (
        fixture.get("contract") == "DEVAM_SARTHI_ANSWER_LEVEL_WISDOM_PILOT_V0_1"
        and fixture.get("status") == "frozen_before_answer_system_tuning"
        and fixture.get("scenario_count") == 64
        and fixture.get("pair_count") == 32
    )
    execution = fixture.get("execution")
    checks["execution_is_explicitly_not_run"] = (
        isinstance(execution, dict)
        and execution.get("status") == "not_run_no_authorized_same_model_runtime_or_blinded_review_panel"
        and execution.get("results_recorded") is False
        and execution.get("model_claims_allowed") is False
        and execution.get("required_arms") == EXPECTED_ARMS
        and isinstance(execution.get("comparison_rule"), str)
        and isinstance(execution.get("promotion_rule"), str)
    )
    checks["mode_mapping_exact"] = fixture.get("mode_mapping") == EXPECTED_MODE_MAPPING
    checks["claim_boundary_present"] = all(
        isinstance(fixture.get(key), str) and len(fixture[key]) > 40
        for key in ("purpose", "claim_boundary")
    )

    dimensions = fixture.get("evaluation_dimensions")
    hard_failures = fixture.get("global_hard_failures")
    checks["vector_evaluation_and_hard_failures"] = (
        isinstance(dimensions, list)
        and len(dimensions) >= 12
        and len(dimensions) == len(set(dimensions))
        and isinstance(hard_failures, list)
        and len(hard_failures) >= 12
        and len(hard_failures) == len(set(hard_failures))
        and "oracle_like_certainty" in hard_failures
        and "coercion_or_consent_override" in hard_failures
        and "answer_from_model_memory_after_evidence_failure" in hard_failures
    )

    rubrics = fixture.get("rubric_profiles")
    if not isinstance(rubrics, dict) or set(rubrics) != EXPECTED_RUBRICS:
        fail("rubric profile key set differs from the frozen contract")
    for name, rubric in rubrics.items():
        if set(rubric) != {"max_words", "required", "forbidden"}:
            fail(f"rubric {name} has an unexpected schema")
        if not isinstance(rubric["max_words"], int) or not 80 <= rubric["max_words"] <= 300:
            fail(f"rubric {name} has an invalid style limit")
        for key in ("required", "forbidden"):
            if not isinstance(rubric[key], list) or not rubric[key] or len(rubric[key]) != len(set(rubric[key])):
                fail(f"rubric {name}.{key} is empty or duplicated")
    checks["rubric_profiles_complete"] = True

    bundles = fixture.get("evidence_bundles")
    if not isinstance(bundles, dict) or len(bundles) < 12:
        fail("evidence bundle registry is missing or too small")
    evidence_file_count = 0
    for bundle_id, bundle in bundles.items():
        if not isinstance(bundle, dict) or not isinstance(bundle.get("status"), str) or not isinstance(bundle.get("files"), list):
            fail(f"invalid evidence bundle: {bundle_id}")
        files = bundle["files"]
        if bundle["status"] in AVAILABLE_STATUSES and not files:
            fail(f"available evidence bundle has no files: {bundle_id}")
        if bundle["status"] == "not_yet_available":
            if files or not isinstance(bundle.get("gap"), str) or len(bundle["gap"]) < 30:
                fail(f"unavailable evidence bundle lacks an explicit empty gap: {bundle_id}")
        elif bundle["status"] not in AVAILABLE_STATUSES:
            fail(f"unknown evidence-bundle status: {bundle_id}")
        seen_paths: set[str] = set()
        for record in files:
            if set(record) != {"path", "bytes", "sha256"}:
                fail(f"unexpected evidence record schema in {bundle_id}")
            relative = record["path"]
            if relative.casefold() in seen_paths:
                fail(f"duplicate evidence path in {bundle_id}: {relative}")
            seen_paths.add(relative.casefold())
            path = safe_repo_file(relative)
            current = path.read_bytes()
            if len(current) != record["bytes"] or sha256(current) != record["sha256"]:
                fail(f"evidence fixity mismatch: {relative}")
            validate_pack(path)
            evidence_file_count += 1
    checks["evidence_bundles_exist_and_match_fixity"] = evidence_file_count >= 16

    pairs = fixture.get("pairs")
    if not isinstance(pairs, list) or len(pairs) != 32:
        fail("pilot must contain exactly 32 paired cases")
    pair_ids: set[str] = set()
    scenario_ids: set[str] = set()
    family_counts: Counter[str] = Counter()
    language_counts: Counter[str] = Counter()
    mode_counts: Counter[str] = Counter()
    scenario_family_counts: Counter[str] = Counter()
    referenced_bundles: set[str] = set()
    scenario_count = 0

    for pair in pairs:
        expected_pair_keys = {"pair_id", "family", "language", "rubric", "evidence_bundle", "contrast", "variants"}
        if set(pair) != expected_pair_keys:
            fail(f"pair has unexpected key set: {pair.get('pair_id')}")
        pair_id = pair["pair_id"]
        family = pair["family"]
        language = pair["language"]
        if not isinstance(pair_id, str) or pair_id in pair_ids:
            fail(f"duplicate or invalid pair ID: {pair_id}")
        pair_ids.add(pair_id)
        if family not in EXPECTED_FAMILIES:
            fail(f"unknown family: {family}")
        if language not in {"en", "hi"}:
            fail(f"unsupported pilot language: {language}")
        if pair["rubric"] not in rubrics:
            fail(f"unknown rubric: {pair['rubric']}")
        if pair["evidence_bundle"] not in bundles:
            fail(f"unknown evidence bundle: {pair['evidence_bundle']}")
        if not isinstance(pair["contrast"], str) or len(pair["contrast"]) < 30:
            fail(f"pair contrast is not substantive: {pair_id}")
        variants = pair["variants"]
        if not isinstance(variants, list) or len(variants) != 2:
            fail(f"pair must contain exactly two variants: {pair_id}")

        family_counts[family] += 1
        language_counts[language] += 2
        referenced_bundles.add(pair["evidence_bundle"])
        signatures: list[str] = []
        for variant in variants:
            expected_variant_keys = {
                "id", "prompt", "context", "expected_mode", "missing_material_context", "required_behaviours"
            }
            if set(variant) != expected_variant_keys:
                fail(f"variant has unexpected key set: {variant.get('id')}")
            scenario_id = variant["id"]
            if not isinstance(scenario_id, str) or not scenario_id.startswith(pair_id + "-") or scenario_id in scenario_ids:
                fail(f"duplicate, invalid or unbound scenario ID: {scenario_id}")
            scenario_ids.add(scenario_id)
            if variant["expected_mode"] not in EXPECTED_MODES:
                fail(f"unknown expected mode: {scenario_id}")
            prompt = variant["prompt"]
            context = variant["context"]
            if not isinstance(prompt, str) or len(prompt) < 12 or not isinstance(context, dict):
                fail(f"invalid prompt or context: {scenario_id}")
            if context.get("languageCode") != language:
                fail(f"context language does not match pair language: {scenario_id}")
            if language == "hi" and not any("\u0900" <= character <= "\u097f" for character in prompt):
                fail(f"Hindi scenario lacks Devanagari text: {scenario_id}")
            missing = variant["missing_material_context"]
            required = variant["required_behaviours"]
            if not isinstance(missing, list) or len(missing) != len(set(missing)):
                fail(f"invalid missing-context list: {scenario_id}")
            if not isinstance(required, list) or not required or len(required) != len(set(required)):
                fail(f"invalid answer requirements: {scenario_id}")
            if variant["expected_mode"] == "clarify" and not missing:
                fail(f"clarify case has no material missing context: {scenario_id}")
            if variant["expected_mode"] == "direct" and missing:
                fail(f"direct case still declares missing material context: {scenario_id}")
            signatures.append(json.dumps({"prompt": prompt, "context": context, "mode": variant["expected_mode"]}, sort_keys=True, ensure_ascii=False))
            mode_counts[variant["expected_mode"]] += 1
            scenario_family_counts[family] += 1
            scenario_count += 1
        if signatures[0] == signatures[1]:
            fail(f"pair variants are identical: {pair_id}")

    checks["pair_and_scenario_counts_exact"] = scenario_count == fixture["scenario_count"] == 64
    checks["family_balance_exact"] = set(family_counts) == EXPECTED_FAMILIES and set(family_counts.values()) == {4}
    checks["scenario_family_balance_exact"] = set(scenario_family_counts.values()) == {8}
    checks["language_balance_exact"] = language_counts == Counter({"en": 32, "hi": 32})
    checks["all_decision_modes_present"] = set(mode_counts) == EXPECTED_MODES and all(mode_counts[item] >= 4 for item in EXPECTED_MODES)
    checks["paired_context_or_evidence_contrasts_present"] = len(pair_ids) == 32 and len(scenario_ids) == 64
    checks["both_ready_and_fail_closed_bundles_exercised"] = (
        any(bundles[item]["status"] in AVAILABLE_STATUSES for item in referenced_bundles)
        and any(bundles[item]["status"] == "not_yet_available" for item in referenced_bundles)
    )
    checks["consequential_share_material"] = sum(
        scenario_family_counts[item] for item in ("ritual_vidhi", "personal_guidance", "moral_ambiguity")
    ) >= 24

    failed = [name for name, passed in checks.items() if not passed]
    if failed:
        fail("failed checks: " + ", ".join(failed))

    report = {
        "contract": "DEVAM_SARTHI_ANSWER_LEVEL_WISDOM_PILOT_VALIDATION_V0_1",
        "result": "PASS",
        "fixture": str(FIXTURE.relative_to(ROOT)).replace(os.sep, "/"),
        "fixture_bytes": len(raw),
        "fixture_sha256": sha256(raw),
        "pairs": len(pair_ids),
        "scenarios": len(scenario_ids),
        "family_counts": dict(sorted(scenario_family_counts.items())),
        "language_counts": dict(sorted(language_counts.items())),
        "mode_counts": dict(sorted(mode_counts.items())),
        "evidence_bundles": len(bundles),
        "evidence_file_references_verified": evidence_file_count,
        "checks": checks,
        "passed": len(checks),
        "total": len(checks),
        "execution_status": execution["status"],
    }
    print(json.dumps(report, ensure_ascii=False, sort_keys=True, separators=(",", ":")))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (AssertionError, FileNotFoundError, OSError) as exc:
        print(json.dumps({"contract": "DEVAM_SARTHI_ANSWER_LEVEL_WISDOM_PILOT_VALIDATION_V0_1", "result": "FAIL", "error": str(exc)}, ensure_ascii=False, sort_keys=True, separators=(",", ":")), file=sys.stderr)
        raise SystemExit(1)

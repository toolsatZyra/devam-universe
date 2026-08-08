#!/usr/bin/env python3
"""Audit bounded Panchang identities against current actionable ritual lanes.

The audit is deliberately conservative:

* preflights and explicitly unresolved identity/date fixtures are not counted as
  resolved observances;
* only current ``DEVAM_RITUAL_OBSERVANCE_CONTENT_V1`` packs count as product
  coverage;
* a participation companion remains distinguishable from a user-complete lane;
* legacy filenames and fuzzy title matching never imply coverage.

Some early Panchang fixtures predate the normalized ``observance_slug`` field.
Their explicit mappings are kept below as reviewable compatibility data rather
than inferred from prose at runtime.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from collections import defaultdict
from pathlib import Path
from typing import Any, Iterable


ROOT = Path(__file__).resolve().parents[1]
PANCHANG_DIR = ROOT / "knowledge_packs" / "panchang"
RITUAL_DIR = ROOT / "knowledge_packs" / "rituals"
CURRENT_RITUAL_CONTRACT = "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1"

# These discovery preflights are retained as provenance, but a named executable
# fixture now supersedes each one. They must not continue to inflate the active
# unresolved count merely because the historical preflight remains on disk.
SUPERSEDED_PREFLIGHTS: dict[str, tuple[str, str]] = {
    "DEVAM_UNRESOLVED_AGASTYA_ARGHYA_TIMING_FIXTURE_V1": (
        "knowledge_packs/panchang/agastya-arghya-delhi-2026-resolved-v1.json",
        "DEVAM_BOUNDED_AGASTYA_ARGHYA_PROVIDER_FIXTURE_V1",
    ),
    "DEVAM_UNRESOLVED_BALARAMA_OBSERVANCE_IDENTITY_FIXTURE_V1": (
        "knowledge_packs/panchang/hala-shashthi-delhi-2026-v1.json",
        "DEVAM_BOUNDED_HALA_SHASHTHI_IDENTITY_DATE_FIXTURE_V1",
    ),
    "DEVAM_KALI_CHAUDAS_AHMEDABAD_BAPS_PREFLIGHT_V1": (
        "knowledge_packs/panchang/kali-chaudas-ahmedabad-baps-2026-v1.json",
        "DEVAM_KALI_CHAUDAS_BAPS_DATE_EVIDENCE_FIXTURE_V1",
    ),
    "DEVAM_NARAKA_CHATURDASHI_MUMBAI_PREFLIGHT_V1": (
        "knowledge_packs/panchang/naraka-chaturdashi-mumbai-2026-v1.json",
        "DEVAM_NARAKA_CHATURDASHI_DATE_EVIDENCE_FIXTURE_V1",
    ),
}

# These fixtures have exact bounded identities but no normalized slug field.
# The mapping is keyed by contract, so a renamed file does not silently change
# its meaning. Each mapped slug must be present in the corresponding ritual pack.
CONTRACT_SLUG_COMPATIBILITY: dict[str, tuple[str, ...]] = {
    "DEVAM_BOUNDED_KANYA_SANKRANTI_VISHWAKARMA_BENGAL_FIXTURE_V1": (
        "kanya-sankranti",
        "vishwakarma-puja-bengal",
    ),
    "DEVAM_BOUNDED_HARTALIKA_TEEJ_CALENDAR_FIXTURE_V1": ("hartalika-teej",),
    "DEVAM_BOUNDED_KOJAGARA_CALENDAR_FIXTURE_V1": (
        "kojagara-puja-sharad-purnima",
    ),
    "DEVAM_BOUNDED_KRISHNA_JANMASHTAMI_CALENDAR_FIXTURE_V1": (
        "krishna-janmashtami-smarta",
        "krishna-janmashtami-iskcon",
    ),
    "DEVAM_BOUNDED_RADHA_ASHTAMI_ISKCON_CALENDAR_FIXTURE_V1": (
        "radha-ashtami-iskcon",
    ),
    "DEVAM_BOUNDED_RISHI_PANCHAMI_CALENDAR_FIXTURE_V1": ("rishi-panchami",),
}


def canonical_json(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def relative(path: Path) -> str:
    return path.resolve().relative_to(ROOT.resolve()).as_posix()


def walk_slug_fields(value: Any, path: tuple[str | int, ...] = ()) -> Iterable[tuple[str, str]]:
    if isinstance(value, dict):
        for key, child in value.items():
            child_path = (*path, key)
            if key == "observance_slug" and isinstance(child, str) and child:
                yield (json_pointer(child_path), child)
            # Pitru Paksha labels use ``labels[].slug``. Avoid accepting generic
            # slug fields elsewhere because they could name sources or regions.
            if (
                key == "slug"
                and isinstance(child, str)
                and child
                and "labels" in path
            ):
                yield (json_pointer(child_path), child)
            yield from walk_slug_fields(child, child_path)
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from walk_slug_fields(child, (*path, index))


def json_pointer(path: tuple[str | int, ...]) -> str:
    encoded = []
    for part in path:
        encoded.append(str(part).replace("~", "~0").replace("/", "~1"))
    return "/" + "/".join(encoded)


def unresolved_reason(document: dict[str, Any], path: Path) -> str | None:
    contract = str(document.get("contract", ""))
    if "PREFLIGHT" in contract or "preflight" in path.name.lower():
        return "preflight"
    if "UNRESOLVED" in contract:
        return "contract_explicitly_unresolved"
    scope = document.get("scope")
    if isinstance(scope, dict):
        for key in ("date_resolved_by_devam", "identity_resolved"):
            if scope.get(key) is False:
                return f"scope.{key}=false"
    return None


def load_panchang() -> tuple[
    list[dict[str, Any]],
    list[dict[str, Any]],
    list[dict[str, Any]],
    list[dict[str, Any]],
]:
    observations: list[dict[str, Any]] = []
    unresolved: list[dict[str, Any]] = []
    superseded_preflights: list[dict[str, Any]] = []
    unmapped: list[dict[str, Any]] = []
    for path in sorted(PANCHANG_DIR.glob("*.json"), key=lambda item: item.name.casefold()):
        document = json.loads(path.read_text(encoding="utf-8-sig"))
        contract = document.get("contract")
        reason = unresolved_reason(document, path)
        record_base = {
            "contract": contract,
            "file": relative(path),
            "sha256": sha256_file(path),
        }
        if reason:
            superseded = SUPERSEDED_PREFLIGHTS.get(str(contract))
            if superseded:
                resolved_relative, expected_contract = superseded
                resolved_path = ROOT / resolved_relative
                resolved_document = json.loads(resolved_path.read_text(encoding="utf-8-sig"))
                if resolved_document.get("contract") != expected_contract:
                    raise ValueError(
                        f"{resolved_relative} does not match superseding contract {expected_contract}"
                    )
                superseded_preflights.append(
                    {
                        **record_base,
                        "reason": reason,
                        "superseded_by": {
                            "contract": expected_contract,
                            "file": resolved_relative,
                            "sha256": sha256_file(resolved_path),
                        },
                    }
                )
                continue
            unresolved.append({**record_base, "reason": reason})
            continue

        discovered = list(walk_slug_fields(document))
        compatibility = CONTRACT_SLUG_COMPATIBILITY.get(str(contract), ())
        if not discovered and compatibility:
            discovered = [("compatibility_mapping", slug) for slug in compatibility]
        if not discovered:
            unmapped.append(record_base)
            continue

        for pointer, slug in discovered:
            observations.append(
                {
                    **record_base,
                    "pointer": pointer,
                    "slug": slug,
                    "mapping_kind": (
                        "explicit_json_field"
                        if pointer != "compatibility_mapping"
                        else "contract_compatibility_mapping"
                    ),
                }
            )
    return observations, unresolved, superseded_preflights, unmapped


def load_current_ritual_lanes() -> list[dict[str, Any]]:
    lanes: list[dict[str, Any]] = []
    for path in sorted(RITUAL_DIR.glob("*.json"), key=lambda item: item.name.casefold()):
        document = json.loads(path.read_text(encoding="utf-8-sig"))
        if document.get("contract") != CURRENT_RITUAL_CONTRACT:
            continue
        product_status = document.get("product_status")
        if not isinstance(product_status, dict):
            raise ValueError(f"{relative(path)} has no product_status object")
        classification = product_status.get("classification")
        slugs = document.get("observance_slugs")
        if not isinstance(slugs, list) or not slugs or not all(isinstance(s, str) and s for s in slugs):
            raise ValueError(f"{relative(path)} has invalid observance_slugs")
        for slug in slugs:
            applicable_content = [
                content
                for content in document.get("localized_content", [])
                if not content.get("observance_slugs")
                or slug in content.get("observance_slugs", [])
            ]
            language_codes = sorted(
                {
                    content.get("language_code")
                    for content in applicable_content
                    if isinstance(content.get("language_code"), str)
                }
            )
            contract_issues = assess_user_complete_contract(
                document, slug, applicable_content
            )
            lanes.append(
                {
                    "classification": classification,
                    "contract_issues": contract_issues,
                    "file": relative(path),
                    "lane_id": document.get("lane_id"),
                    "language_codes": language_codes,
                    "sha256": sha256_file(path),
                    "slug": slug,
                }
            )
    return lanes


def assess_user_complete_contract(
    document: dict[str, Any],
    slug: str,
    applicable_content: list[dict[str, Any]],
) -> list[str]:
    """Return explicit structural gaps for one current-contract slug lane."""
    status = document.get("product_status", {})
    if status.get("classification") != "user_complete_lane":
        return ["classification_is_not_user_complete_lane"]

    issues: list[str] = []
    completed = status.get("completed_dimensions")
    if not isinstance(completed, dict) or not completed or not all(completed.values()):
        issues.append("product_completion_dimensions_are_not_all_true")
    if status.get("open_gaps") != []:
        issues.append("product_status_has_open_gaps")

    applicability = document.get("applicability", {})
    for field in ("region_codes", "tradition_codes", "settings", "material_context_questions"):
        if not isinstance(applicability.get(field), list) or not applicability[field]:
            issues.append(f"applicability.{field}_is_empty")

    sources = document.get("sources")
    if not isinstance(sources, list) or not sources:
        issues.append("sources_are_empty")
        known_sources: set[str] = set()
    else:
        known_sources = {
            source.get("source_id")
            for source in sources
            if isinstance(source.get("source_id"), str)
        }
        if len(known_sources) != len(sources):
            issues.append("source_ids_are_missing_or_duplicated")

    language_codes = sorted(
        {
            content.get("language_code")
            for content in applicable_content
            if isinstance(content.get("language_code"), str)
        }
    )
    if language_codes != ["en", "hi"]:
        issues.append("exact_english_hindi_coverage_is_missing")

    def references_known_sources(refs: Any) -> bool:
        return (
            isinstance(refs, list)
            and bool(refs)
            and all(isinstance(item, str) and item in known_sources for item in refs)
        )

    for content in applicable_content:
        language = str(content.get("language_code", "unknown"))
        significance = content.get("significance", {})
        if not isinstance(significance.get("text"), str) or not significance.get("text") or not references_known_sources(significance.get("source_ids")):
            issues.append(f"{language}.significance_is_incomplete")
        for field in ("origin_narratives", "typical_practices", "variants"):
            rows = content.get(field)
            if not isinstance(rows, list) or not rows:
                issues.append(f"{language}.{field}_is_empty")
            elif any(not references_known_sources(row.get("source_ids")) for row in rows):
                issues.append(f"{language}.{field}_has_invalid_evidence")
        if not isinstance(content.get("safety_and_boundaries"), list) or not content["safety_and_boundaries"]:
            issues.append(f"{language}.safety_and_boundaries_is_empty")

        procedures = content.get("procedures")
        if not isinstance(procedures, list) or [row.get("tier") for row in procedures] != ["minimum", "standard", "elaborate"]:
            issues.append(f"{language}.procedure_tiers_are_incomplete")
            continue
        for procedure in procedures:
            tier = str(procedure.get("tier", "unknown"))
            materials = procedure.get("materials")
            steps = procedure.get("steps")
            if not isinstance(materials, list) or not materials:
                issues.append(f"{language}.{tier}.materials_are_empty")
            elif any(
                not isinstance(material.get("substitutions"), list)
                or not references_known_sources(material.get("source_ids"))
                for material in materials
            ):
                issues.append(f"{language}.{tier}.materials_or_substitutions_lack_evidence")
            if not isinstance(steps, list) or not steps:
                issues.append(f"{language}.{tier}.steps_are_empty")
            elif any(
                step.get("ordinal") != index + 1
                or not references_known_sources(step.get("source_ids"))
                for index, step in enumerate(steps)
            ):
                issues.append(f"{language}.{tier}.steps_or_evidence_are_invalid")

    return sorted(set(issues))


def build_audit() -> dict[str, Any]:
    observations, unresolved, superseded_preflights, unmapped = load_panchang()
    lanes = load_current_ritual_lanes()

    panchang_by_slug: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for record in observations:
        panchang_by_slug[record["slug"]].append(record)
    ritual_by_slug: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for record in lanes:
        ritual_by_slug[record["slug"]].append(record)

    covered: list[dict[str, Any]] = []
    panchang_only: list[dict[str, Any]] = []
    for slug in sorted(panchang_by_slug, key=str.casefold):
        calendar_records = sorted(
            panchang_by_slug[slug], key=lambda item: (item["file"].casefold(), item["pointer"])
        )
        ritual_records = sorted(
            ritual_by_slug.get(slug, []), key=lambda item: item["file"].casefold()
        )
        record = {
            "slug": slug,
            "calendar_records": calendar_records,
            "ritual_lanes": ritual_records,
        }
        if ritual_records:
            record["coverage_state"] = (
                "user_complete_lane"
                if any(item["classification"] == "user_complete_lane" for item in ritual_records)
                else "bounded_companion_only"
            )
            record["bilingual_user_complete_lane"] = any(
                item["classification"] == "user_complete_lane"
                and item["language_codes"] == ["en", "hi"]
                and item["contract_issues"] == []
                for item in ritual_records
            )
            covered.append(record)
        else:
            record["coverage_state"] = "no_current_ritual_lane"
            panchang_only.append(record)

    ritual_only = [
        {
            "slug": slug,
            "ritual_lanes": sorted(records, key=lambda item: item["file"].casefold()),
        }
        for slug, records in sorted(ritual_by_slug.items(), key=lambda item: item[0].casefold())
        if slug not in panchang_by_slug
    ]

    result: dict[str, Any] = {
        "contract": "DEVAM_PANCHANG_TO_RITUAL_COVERAGE_AUDIT_V1",
        "scope": {
            "calendar_directory": relative(PANCHANG_DIR),
            "ritual_directory": relative(RITUAL_DIR),
            "ritual_contract": CURRENT_RITUAL_CONTRACT,
            "preflights_count_as_resolved": False,
            "superseded_preflights_count_as_unresolved": False,
            "explicitly_unresolved_fixtures_count_as_resolved": False,
            "legacy_ritual_packs_count_as_coverage": False,
            "fuzzy_title_matching_used": False,
        },
        "counts": {
            "resolved_calendar_slug_records": len(observations),
            "resolved_calendar_unique_slugs": len(panchang_by_slug),
            "current_ritual_slug_records": len(lanes),
            "current_ritual_unique_slugs": len(ritual_by_slug),
            "current_user_complete_slug_records_with_contract_issues": sum(
                item["classification"] == "user_complete_lane"
                and bool(item["contract_issues"])
                for item in lanes
            ),
            "calendar_slugs_with_current_lane": len(covered),
            "calendar_slugs_without_current_lane": len(panchang_only),
            "calendar_slugs_without_bilingual_user_complete_lane": sum(
                not row["bilingual_user_complete_lane"] for row in covered
            ),
            "ritual_slugs_without_calendar_record": len(ritual_only),
            "unresolved_or_preflight_calendar_files": len(unresolved),
            "superseded_preflight_calendar_files": len(superseded_preflights),
            "resolved_calendar_files_without_normalized_slug": len(unmapped),
        },
        "calendar_slugs_with_current_lane": covered,
        "calendar_slugs_without_current_lane": panchang_only,
        "ritual_slugs_without_calendar_record": ritual_only,
        "unresolved_or_preflight_calendar_files": sorted(
            unresolved, key=lambda item: item["file"].casefold()
        ),
        "superseded_preflight_calendar_files": sorted(
            superseded_preflights, key=lambda item: item["file"].casefold()
        ),
        "resolved_calendar_files_without_normalized_slug": sorted(
            unmapped, key=lambda item: item["file"].casefold()
        ),
        "interpretation_boundary": (
            "A current ritual lane proves only the lane's stated bounded product status. "
            "A calendar-only slug is a prioritized product gap, not permission to infer a "
            "procedure. Active unresolved fixtures are excluded from the resolved denominator; "
            "retained preflights with exact executable successors are reported separately."
        ),
    }
    result["audit_sha256"] = hashlib.sha256(canonical_json(result).encode("utf-8")).hexdigest()
    return result


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--output",
        type=Path,
        default=ROOT / "tmp" / "panchang-to-ritual-coverage-v1.json",
    )
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()

    audit = build_audit()
    encoded = json.dumps(audit, ensure_ascii=False, indent=2, sort_keys=True) + "\n"
    output = args.output.resolve()
    if ROOT.resolve() not in output.parents:
        raise ValueError("output must remain inside the repository")
    if args.check:
        if not output.exists():
            raise FileNotFoundError(output)
        if output.read_text(encoding="utf-8") != encoded:
            raise ValueError(f"audit drift: {output}")
    else:
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(encoded, encoding="utf-8", newline="\n")

    print(canonical_json({"output": relative(output), **audit["counts"], "audit_sha256": audit["audit_sha256"]}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

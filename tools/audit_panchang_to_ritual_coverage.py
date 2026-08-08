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
            lanes.append(
                {
                    "classification": classification,
                    "file": relative(path),
                    "lane_id": document.get("lane_id"),
                    "sha256": sha256_file(path),
                    "slug": slug,
                }
            )
    return lanes


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
            "calendar_slugs_with_current_lane": len(covered),
            "calendar_slugs_without_current_lane": len(panchang_only),
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

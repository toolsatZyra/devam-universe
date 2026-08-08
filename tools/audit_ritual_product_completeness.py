#!/usr/bin/env python3
"""Audit legacy ritual packs against Devam's user-complete ritual contract."""

from __future__ import annotations

import argparse
import json
from collections import Counter
from pathlib import Path
from typing import Any

from jsonschema import Draft202012Validator


ROOT = Path(__file__).resolve().parents[1]
PACK_DIR = ROOT / "knowledge_packs" / "rituals"
SCHEMA_PATH = ROOT / "schemas" / "ritual-observance-content-v1.schema.json"
CURRENT_CONTRACT = "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1"
DIMENSIONS = (
    "applicability",
    "timing",
    "significance",
    "origin_narratives",
    "typical_practice",
    "actionable_vidhi",
    "materials_and_substitutions",
    "variants",
    "evidence",
)


class AuditError(RuntimeError):
    pass


def display_path(path: Path) -> str:
    try:
        return path.resolve().relative_to(ROOT.resolve()).as_posix()
    except ValueError:
        return str(path.resolve())


def load_json(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise AuditError(f"{display_path(path)} is not strict UTF-8 JSON: {exc}") from exc
    if not isinstance(value, dict):
        raise AuditError(f"{display_path(path)} must contain a JSON object")
    return value


def audit_current_pack(path: Path, pack: dict[str, Any]) -> dict[str, Any]:
    schema = load_json(SCHEMA_PATH)
    schema_errors = sorted(Draft202012Validator(schema).iter_errors(pack), key=lambda error: list(error.absolute_path))
    if schema_errors:
        first = schema_errors[0]
        coordinate = ".".join(str(part) for part in first.absolute_path) or "<root>"
        raise AuditError(f"{display_path(path)} violates the current ritual schema at {coordinate}: {first.message}")
    status = pack.get("product_status")
    if not isinstance(status, dict):
        raise AuditError(f"{display_path(path)} lacks product_status")
    dimensions = status.get("completed_dimensions")
    if not isinstance(dimensions, dict) or set(dimensions) != set(DIMENSIONS):
        raise AuditError(f"{display_path(path)} has an incomplete dimension key set")
    if any(not isinstance(value, bool) for value in dimensions.values()):
        raise AuditError(f"{display_path(path)} dimension values must be boolean")
    classification = status.get("classification")
    if classification == "user_complete_lane" and not all(dimensions.values()):
        raise AuditError(f"{display_path(path)} claims user completion with open dimensions")
    source_ids = [source.get("source_id") for source in pack["sources"]]
    if len(source_ids) != len(set(source_ids)):
        raise AuditError(f"{display_path(path)} contains duplicate source IDs")
    known_sources = set(source_ids)
    language_codes: list[str] = []
    scoped_content = any(localized.get("observance_slugs") for localized in pack["localized_content"])
    if scoped_content and any(not localized.get("observance_slugs") for localized in pack["localized_content"]):
        raise AuditError(f"{display_path(path)} mixes scoped and unscoped localized content")
    scoped_coverage: list[str] = []
    for localized in pack["localized_content"]:
        language = localized["language_code"]
        if not scoped_content and language in language_codes:
            raise AuditError(f"{display_path(path)} repeats language {language}")
        language_codes.append(language)
        scoped_coverage.extend(f"{slug}|{language}" for slug in localized.get("observance_slugs", []))
        references: list[str] = []
        references.extend(localized["significance"]["source_ids"])
        for narrative in localized["origin_narratives"]:
            references.extend(narrative["source_ids"])
        for practice in localized["typical_practices"]:
            references.extend(practice["source_ids"])
        for variant in localized["variants"]:
            references.extend(variant["source_ids"])
        daily_sequence = localized.get("daily_sequence", [])
        if daily_sequence:
            ordinals = [entry["ordinal"] for entry in daily_sequence]
            if ordinals != list(range(1, len(ordinals) + 1)):
                raise AuditError(f"{display_path(path)} has non-contiguous daily-sequence entries for {language}")
            for entry in daily_sequence:
                references.extend(entry["source_ids"])
        for procedure in localized["procedures"]:
            references.extend(procedure["source_ids"])
            references.extend(procedure["closing"]["source_ids"])
            ordinals = [step["ordinal"] for step in procedure["steps"]]
            if ordinals != list(range(1, len(ordinals) + 1)):
                raise AuditError(f"{display_path(path)} has non-contiguous steps in {procedure['procedure_id']}")
            for material in procedure["materials"]:
                references.extend(material["source_ids"])
            for step in procedure["steps"]:
                references.extend(step["source_ids"])
        unknown = sorted(set(references) - known_sources)
        if unknown:
            raise AuditError(f"{display_path(path)} references unknown source IDs: {unknown}")
    calendar_unknown = sorted(set(pack["calendar"]["resolution_source_ids"]) - known_sources)
    if calendar_unknown:
        raise AuditError(f"{display_path(path)} calendar references unknown source IDs: {calendar_unknown}")
    if classification == "user_complete_lane":
        expected_coverage = sorted(f"{slug}|{language}" for slug in pack["observance_slugs"] for language in ("en", "hi"))
        if scoped_content and (len(scoped_coverage) != len(set(scoped_coverage)) or sorted(scoped_coverage) != expected_coverage):
            raise AuditError(f"{display_path(path)} has incomplete or duplicate scoped English/Hindi coverage")
        if not scoped_content and set(language_codes) != {"en", "hi"}:
            raise AuditError(f"{display_path(path)} user-complete lane must include English and Hindi")
        for localized in pack["localized_content"]:
            if not localized["origin_narratives"] or not localized["typical_practices"] or not localized["procedures"] or not localized["variants"]:
                raise AuditError(f"{display_path(path)} user-complete lane has an empty content dimension for {localized['language_code']}")
        if status.get("open_gaps"):
            raise AuditError(f"{display_path(path)} user-complete lane cannot retain lane-local open gaps")
    return {
        "path": path.relative_to(ROOT).as_posix(),
        "pack_id": pack.get("lane_id"),
        "contract": CURRENT_CONTRACT,
        "migration_status": "current_contract",
        "classification": classification,
        "completed_dimensions": dimensions,
        "open_gaps": status.get("open_gaps", []),
    }


def audit_legacy_pack(
    path: Path,
    pack: dict[str, Any],
    superseded_by: str | None = None,
) -> dict[str, Any]:
    guides = pack.get("guides") if isinstance(pack.get("guides"), list) else []
    tier_count = 0
    step_count = 0
    material_count = 0
    for guide in guides:
        if not isinstance(guide, dict):
            continue
        tiers = guide.get("tiers") if isinstance(guide.get("tiers"), list) else []
        tier_count += len(tiers)
        for tier in tiers:
            if not isinstance(tier, dict):
                continue
            steps = tier.get("steps") if isinstance(tier.get("steps"), list) else []
            materials = tier.get("materials") if isinstance(tier.get("materials"), list) else []
            step_count += len(steps)
            material_count += len(materials)
    record = {
        "path": path.relative_to(ROOT).as_posix(),
        "pack_id": pack.get("pack_id"),
        "contract": pack.get("contract"),
        "migration_status": (
            "legacy_superseded_by_current_contract"
            if superseded_by is not None
            else "legacy_requires_explicit_classification"
        ),
        "classification": None,
        "user_complete_lane": False,
        "reason": (
            "Retained as immutable input/provenance; a named current-contract lane supersedes it."
            if superseded_by is not None
            else "Legacy shape does not explicitly prove every user-complete dimension."
        ),
        "retained_capabilities": {
            "guide_count": len(guides),
            "tier_count": tier_count,
            "step_count": step_count,
            "material_count": material_count,
            "source_count": len(pack.get("sources", [])) if isinstance(pack.get("sources"), list) else 0,
            "boundary_count": len(pack.get("boundaries", {})) if isinstance(pack.get("boundaries"), dict) else 0,
        },
    }
    if superseded_by is not None:
        record["superseded_by_lane_id"] = superseded_by
    return record


def audit(pack_dir: Path = PACK_DIR) -> dict[str, Any]:
    paths = sorted(pack_dir.glob("*.json"), key=lambda value: value.name.casefold())
    loaded = [(path, load_json(path)) for path in paths]
    available_legacy_ids = {
        pack.get("pack_id")
        for _, pack in loaded
        if pack.get("contract") != CURRENT_CONTRACT and isinstance(pack.get("pack_id"), str)
    }
    superseded_by: dict[str, str] = {}
    for path, pack in loaded:
        if pack.get("contract") != CURRENT_CONTRACT:
            continue
        lane_id = pack.get("lane_id")
        for legacy_id in pack.get("supersedes_legacy_pack_ids", []):
            if legacy_id not in available_legacy_ids:
                raise AuditError(
                    f"{display_path(path)} supersedes unknown legacy pack ID: {legacy_id}"
                )
            if legacy_id in superseded_by:
                raise AuditError(
                    f"legacy pack {legacy_id} is superseded by multiple current lanes"
                )
            superseded_by[legacy_id] = lane_id
    records: list[dict[str, Any]] = []
    ids: set[str] = set()
    for path, pack in loaded:
        record = (
            audit_current_pack(path, pack)
            if pack.get("contract") == CURRENT_CONTRACT
            else audit_legacy_pack(path, pack, superseded_by.get(pack.get("pack_id")))
        )
        pack_id = record.get("pack_id")
        if not isinstance(pack_id, str) or not pack_id:
            raise AuditError(f"{display_path(path)} has no stable pack/lane ID")
        folded = pack_id.casefold()
        if folded in ids:
            raise AuditError(f"duplicate case-insensitive pack/lane ID: {pack_id}")
        ids.add(folded)
        records.append(record)

    migration_counts = Counter(record["migration_status"] for record in records)
    classification_counts = Counter(record["classification"] for record in records if record["classification"] is not None)
    return {
        "contract": "DEVAM_RITUAL_PRODUCT_COMPLETENESS_AUDIT_V1",
        "pack_directory": pack_dir.relative_to(ROOT).as_posix(),
        "pack_count": len(records),
        "migration_counts": dict(sorted(migration_counts.items())),
        "classification_counts": dict(sorted(classification_counts.items())),
        "user_complete_lane_count": sum(record.get("classification") == "user_complete_lane" for record in records),
        "legacy_user_completion_inferred": False,
        "records": records,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, help="Optional JSON report path under the repository root")
    args = parser.parse_args()
    result = audit()
    rendered = json.dumps(result, ensure_ascii=False, indent=2, sort_keys=True) + "\n"
    if args.output:
        output = (ROOT / args.output).resolve() if not args.output.is_absolute() else args.output.resolve()
        if not output.is_relative_to(ROOT.resolve()):
            raise AuditError("output must remain inside the repository")
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(rendered, encoding="utf-8", newline="\n")
    else:
        print(rendered, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

from __future__ import annotations

import argparse
import collections
import hashlib
import json
import re
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_PLAN = ROOT / "ingestion" / "plans" / "mahabharata-kisari-mohan-ganguli-project-gutenberg-source-qualification-v1.json"
DEFAULT_REPORT = ROOT / "ingestion" / "reports" / "mahabharata-kisari-mohan-ganguli-project-gutenberg-source-qualification-v1.json"
CONTRACT = "DEVAM_GANGULI_MAHABHARATA_SOURCE_QUALIFICATION_V1"
ROMAN_SECTION = re.compile(rb"SECTION\s+([IVXLCDM]+)[.]?", re.IGNORECASE)
DECIMAL_SECTION = re.compile(rb"([0-9]+)")


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def canonical_json(value: Any) -> bytes:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")


def roman_to_int(value: str) -> int:
    table = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000}
    total = 0
    previous = 0
    for character in reversed(value.upper()):
        current = table[character]
        total += -current if current < previous else current
        previous = max(previous, current)
    return total


def line_records(raw: bytes) -> list[tuple[int, int, bytes]]:
    records: list[tuple[int, int, bytes]] = []
    offset = 0
    for line in raw.splitlines(keepends=True):
        end = offset + len(line)
        records.append((offset, end, line.rstrip(b"\r\n")))
        offset = end
    if offset < len(raw):
        records.append((offset, len(raw), raw[offset:]))
    return records


def selected_exact_line(records: list[tuple[int, int, bytes]], literal: str, occurrence: str) -> int:
    encoded = literal.encode("utf-8")
    matches = [start for start, _end, line in records if line.strip() == encoded]
    if not matches:
        raise ValueError(f"Missing exact structural header {literal!r}")
    if occurrence == "first":
        return matches[0]
    if occurrence == "last":
        return matches[-1]
    raise ValueError(f"Unsupported header occurrence {occurrence!r}")


def ebook_end_offset(records: list[tuple[int, int, bytes]], volume: int) -> int:
    prefix = b"*** END OF THE PROJECT GUTENBERG EBOOK "
    matches = [start for start, _end, line in records if line.strip().startswith(prefix)]
    if len(matches) != 1:
        raise ValueError(f"Expected one Project Gutenberg END marker in volume {volume}, found {len(matches)}")
    return matches[0]


def sequence_profile(numbers: list[int]) -> dict[str, Any]:
    if not numbers:
        raise ValueError("A parva has no source-relative section markers")
    counts = collections.Counter(numbers)
    return {
        "section_count": len(numbers),
        "first_literal_number": numbers[0],
        "last_literal_number": numbers[-1],
        "missing_literal_numbers": sorted(set(range(1, numbers[-1] + 1)) - set(numbers)),
        "duplicate_literal_numbers": sorted(number for number, count in counts.items() if count > 1),
        "nonincreasing_transitions": [
            {"source_ordinal": ordinal, "from": previous, "to": current}
            for ordinal, (previous, current) in enumerate(zip(numbers, numbers[1:]), start=2)
            if current <= previous
        ],
    }


def marker_rows(
    records: list[tuple[int, int, bytes]],
    start: int,
    end: int,
    marker_style: str,
) -> list[tuple[int, int, str]]:
    rows: list[tuple[int, int, str]] = []
    pattern = ROMAN_SECTION if marker_style == "roman_section" else DECIMAL_SECTION
    if marker_style not in {"roman_section", "decimal_line"}:
        raise ValueError(f"Unsupported marker style {marker_style!r}")
    for line_start, _line_end, line in records:
        if not start <= line_start < end:
            continue
        match = pattern.fullmatch(line.strip())
        if not match:
            continue
        literal = match.group(1).decode("ascii").upper()
        number = roman_to_int(literal) if marker_style == "roman_section" else int(literal)
        rows.append((line_start, number, literal))
    return rows


def validate_plan(plan: dict[str, Any]) -> None:
    if plan.get("contract") != CONTRACT:
        raise ValueError("Qualification contract drift")
    if plan.get("action") != "qualify_existing_source_references_without_copying_or_publishing_source_payloads":
        raise ValueError("Qualification action drift")
    expression = plan["expression"]
    if expression["electronic_volume_count"] != 4 or expression["major_parva_count"] != 18:
        raise ValueError("Expected exactly four electronic volumes and 18 major parvas")
    if expression["source_relative_section_count"] != 2107 or expression["harivamsha_included"] is not False:
        raise ValueError("Source denominator or Harivamsha boundary drift")
    if [row["volume"] for row in plan["source_objects"]] != [1, 2, 3, 4]:
        raise ValueError("Source volume order drift")
    if [row["ebook_id"] for row in plan["source_objects"]] != [15474, 15475, 15476, 15477]:
        raise ValueError("Project Gutenberg ebook universe drift")
    if [row["parva_ordinal"] for row in plan["parva_profiles"]] != list(range(1, 19)):
        raise ValueError("Major parva order drift")
    if sum(row["section_count"] for row in plan["parva_profiles"]) != 2107:
        raise ValueError("Planned section denominator drift")
    if plan["rights_decision"]["lane"] != "product_allowed_for_devam_synthesis_with_provider_framing_excluded":
        raise ValueError("Rights lane drift")
    if any(plan["completion_denials"].values()):
        raise ValueError("A completion denial was incorrectly asserted")
    if any(plan["mutation_boundary"].values()):
        raise ValueError("A forbidden external/source mutation was enabled")


def provenance_keys() -> set[tuple[str, str]]:
    path = ROOT / "source_vault" / "provenance-map.jsonl"
    keys: set[tuple[str, str]] = set()
    for line in path.read_text(encoding="utf-8").splitlines():
        row = json.loads(line)
        keys.add((row["sha256"], row["source_path"]))
    return keys


def verified_source(source: dict[str, Any], provenance: set[tuple[str, str]]) -> bytes:
    object_path = (ROOT / "source_vault" / source["object_path"]).resolve(strict=True)
    vault_root = (ROOT / "source_vault" / "objects" / "sha256").resolve()
    if not object_path.is_relative_to(vault_root):
        raise ValueError("Source object escapes the content-addressed vault")
    raw = object_path.read_bytes()
    if len(raw) != source["bytes"] or sha256_bytes(raw) != source["sha256"]:
        raise ValueError(f"Source fixity drift for ebook {source['ebook_id']}")
    text = raw.decode("utf-8", errors="strict")
    if text.encode("utf-8") != raw:
        raise ValueError(f"Source ebook {source['ebook_id']} fails UTF-8 byte roundtrip")
    required_literals = (
        f"Title: {source['provider_title']}",
        "Translator: Kisari Mohan Ganguli",
        f"Release date: March 26, 2005 [eBook #{source['ebook_id']}]",
        f"Other information and formats: www.gutenberg.org/ebooks/{source['ebook_id']}",
    )
    for literal in required_literals:
        if text.count(literal) != 1:
            raise ValueError(f"Source identity literal drift in ebook {source['ebook_id']}: {literal!r}")
    if (source["sha256"], source["source_path"]) not in provenance:
        raise ValueError(f"Missing retained provenance for ebook {source['ebook_id']}")
    return raw


def compile_qualification(plan_path: Path = DEFAULT_PLAN) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    plan_raw = plan_path.read_bytes()
    plan = json.loads(plan_raw.decode("utf-8", errors="strict"))
    validate_plan(plan)
    provenance = provenance_keys()
    sources = {row["volume"]: row for row in plan["source_objects"]}
    all_units: list[dict[str, Any]] = []
    source_profiles: list[dict[str, Any]] = []
    observed_parvas: list[dict[str, Any]] = []

    for volume, source in sources.items():
        raw = verified_source(source, provenance)
        records = line_records(raw)
        end_offset = ebook_end_offset(records, volume)
        planned_parvas = [row for row in plan["parva_profiles"] if row["volume"] == volume]
        starts = [
            selected_exact_line(records, row["header_literal"], row["header_occurrence"])
            for row in planned_parvas
        ]
        if starts != sorted(starts) or any(start >= end_offset for start in starts):
            raise ValueError(f"Parva order drift in volume {volume}")

        volume_units: list[dict[str, Any]] = []
        for index, (profile, parva_start) in enumerate(zip(planned_parvas, starts)):
            parva_end = starts[index + 1] if index + 1 < len(starts) else end_offset
            raw_parva = raw[parva_start:parva_end]
            if raw_parva.decode("utf-8", errors="strict").count(profile["terminal_literal"]) != 1:
                raise ValueError(f"Terminal formula drift in {profile['parva_slug']}")
            rows = marker_rows(records, parva_start, parva_end, profile["marker_style"])
            numbers = [row[1] for row in rows]
            observed_sequence = sequence_profile(numbers)
            expected_sequence = {
                key: profile[key]
                for key in (
                    "section_count",
                    "first_literal_number",
                    "last_literal_number",
                    "missing_literal_numbers",
                    "duplicate_literal_numbers",
                    "nonincreasing_transitions",
                )
            }
            if observed_sequence != expected_sequence:
                raise ValueError(
                    f"Literal section sequence drift in {profile['parva_slug']}: {observed_sequence}"
                )
            parva_units: list[dict[str, Any]] = []
            for local_ordinal, (marker_start, literal_number, literal_marker) in enumerate(rows, start=1):
                unit_start = parva_start if local_ordinal == 1 else marker_start
                unit_end = rows[local_ordinal][0] if local_ordinal < len(rows) else parva_end
                span = raw[unit_start:unit_end]
                if not span.strip():
                    raise ValueError(f"Empty source unit in {profile['parva_slug']} ordinal {local_ordinal}")
                unit = {
                    "source_sha256": source["sha256"],
                    "ebook_id": source["ebook_id"],
                    "volume": volume,
                    "parva_ordinal": profile["parva_ordinal"],
                    "parva_slug": profile["parva_slug"],
                    "parva_source_ordinal": local_ordinal,
                    "literal_marker": literal_marker,
                    "literal_number": literal_number,
                    "byte_start": unit_start,
                    "byte_end_exclusive": unit_end,
                    "span_sha256": sha256_bytes(span),
                }
                parva_units.append(unit)
                volume_units.append(unit)
                all_units.append(unit)
            if b"".join(raw[row["byte_start"]:row["byte_end_exclusive"]] for row in parva_units) != raw_parva:
                raise ValueError(f"Source units do not losslessly cover {profile['parva_slug']}")
            observed_parvas.append({
                "parva_ordinal": profile["parva_ordinal"],
                "parva_slug": profile["parva_slug"],
                "title": profile["title"],
                "volume": volume,
                **observed_sequence,
                "byte_start": parva_start,
                "byte_end_exclusive": parva_end,
                "body_bytes": len(raw_parva),
                "body_sha256": sha256_bytes(raw_parva),
                "terminal_literal": profile["terminal_literal"],
                "lossless_source_unit_coverage": True,
            })

        body_start = starts[0]
        body = raw[body_start:end_offset]
        covered = b"".join(raw[row["byte_start"]:row["byte_end_exclusive"]] for row in volume_units)
        if body != covered:
            raise ValueError(f"Source units do not losslessly cover volume {volume}")
        stripped_lines = {line.strip().upper() for _start, _end, line in records}
        forbidden_headers = {b"HARIVANSA PARVA", b"HARIVAMSHA PARVA", b"HARIVANSA-PARVA", b"HARIVAMSHA-PARVA"}
        if stripped_lines & forbidden_headers:
            raise ValueError("Harivamsha unexpectedly appeared as a body header")
        source_profiles.append({
            "volume": volume,
            "ebook_id": source["ebook_id"],
            "sha256": source["sha256"],
            "bytes": source["bytes"],
            "body_byte_start": body_start,
            "body_byte_end_exclusive": end_offset,
            "body_bytes": len(body),
            "body_sha256": sha256_bytes(body),
            "parva_count": len(planned_parvas),
            "source_unit_count": len(volume_units),
            "lossless_source_unit_coverage": True,
            "harivamsha_body_header_present": False,
        })

    if len(observed_parvas) != 18 or len(all_units) != 2107:
        raise ValueError("Compiled Mahabharata source denominator drift")
    root_rows = [canonical_json(row) for row in all_units]
    qualification = {
        "contract": CONTRACT,
        "qualification_id": plan["qualification_id"],
        "snapshot_date": plan["snapshot_date"],
        "plan_path": plan_path.relative_to(ROOT).as_posix(),
        "plan_sha256": sha256_bytes(plan_raw),
        "source_object_count": len(sources),
        "source_object_bytes": sum(row["bytes"] for row in sources.values()),
        "major_parva_count": len(observed_parvas),
        "source_relative_section_count": len(all_units),
        "source_unit_root_sha256": sha256_bytes(b"\n".join(root_rows)),
        "harivamsha_included": False,
        "source_profiles": source_profiles,
        "parva_profiles": observed_parvas,
        "rights_decision": plan["rights_decision"],
        "completion_denials": plan["completion_denials"],
        "mutation_boundary": plan["mutation_boundary"],
    }
    qualification["report_payload_sha256"] = sha256_bytes(canonical_json(qualification))
    return qualification, all_units


def write_report(report: dict[str, Any], path: Path = DEFAULT_REPORT) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def check_report(report: dict[str, Any], path: Path = DEFAULT_REPORT) -> None:
    observed = json.loads(path.read_text(encoding="utf-8"))
    if observed != report:
        raise ValueError(f"Qualification report drift: run {Path(__file__).name} --write")


def main() -> int:
    parser = argparse.ArgumentParser(description="Qualify the retained Ganguli Mahabharata source denominator")
    parser.add_argument("--plan", type=Path, default=DEFAULT_PLAN)
    parser.add_argument("--report", type=Path, default=DEFAULT_REPORT)
    parser.add_argument("--write", action="store_true")
    parser.add_argument("--check", action="store_true")
    parser.add_argument("--stats", action="store_true")
    args = parser.parse_args()
    report, _units = compile_qualification(args.plan)
    if args.write:
        write_report(report, args.report)
    if args.check:
        check_report(report, args.report)
    if args.stats or not (args.write or args.check):
        print(json.dumps({
            "source_objects": report["source_object_count"],
            "source_bytes": report["source_object_bytes"],
            "major_parvas": report["major_parva_count"],
            "source_units": report["source_relative_section_count"],
            "source_unit_root_sha256": report["source_unit_root_sha256"],
            "harivamsha_included": report["harivamsha_included"],
        }, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

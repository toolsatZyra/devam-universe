from __future__ import annotations

import argparse
import hashlib
import json
import sys
from collections import Counter
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parents[1]
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from tools.compile_devimahatmya_wikisource_ingestion import ROOT, compile_packet


DRAFT = ROOT / "knowledge_packs/durga/devimahatmya-devam-translations-v1.jsonl"
EXPECTED_KEYS = {
    "citation_ordinal",
    "chapter",
    "verse",
    "source_sha256",
    "source_ordinal",
    "source_span_sha256",
    "english",
    "hindi",
    "confidence",
    "note",
}


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def load_rows(path: Path) -> tuple[bytes, list[dict[str, Any]]]:
    resolved = path.resolve(strict=True)
    if not resolved.is_relative_to((ROOT / "knowledge_packs/durga").resolve(strict=True)):
        raise ValueError("Translation draft must remain inside knowledge_packs/durga")
    data = resolved.read_bytes()
    text = data.decode("utf-8", errors="strict")
    if text.encode("utf-8") != data:
        raise ValueError("Translation draft is not strict round-trip UTF-8")
    rows = [json.loads(line) for line in text.splitlines() if line.strip()]
    return data, rows


def validate(path: Path, require_complete: bool) -> dict[str, Any]:
    data, rows = load_rows(path)
    source = compile_packet()["passages"]
    expected = {row["citation_ordinal"]: row for row in source}
    if len(expected) != 588 or sorted(expected) != list(range(1, 589)):
        raise ValueError("Frozen Sanskrit source universe drift")
    ordinals = [row.get("citation_ordinal") for row in rows]
    if ordinals != list(range(1, len(rows) + 1)):
        raise ValueError("Draft rows must be a unique ordered prefix of citation ordinals 1..588")
    if require_complete and len(rows) != 588:
        raise ValueError(f"Complete pack requires 588 rows; observed {len(rows)}")

    chapter_counts: Counter[int] = Counter()
    for row in rows:
        if set(row) != EXPECTED_KEYS:
            raise ValueError(f"Key-set drift at citation {row.get('citation_ordinal')}")
        original = expected[row["citation_ordinal"]]
        locator = original["locator"]
        exact_identity = {
            "citation_ordinal": original["citation_ordinal"],
            "chapter": locator["chapter"],
            "verse": locator["verse"],
            "source_sha256": original["source_sha256"],
            "source_ordinal": original["source_ordinal"],
            "source_span_sha256": original["span_sha256"],
        }
        if {key: row[key] for key in exact_identity} != exact_identity:
            raise ValueError(f"Frozen Sanskrit identity mismatch at citation {row['citation_ordinal']}")
        for language in ("english", "hindi"):
            value = row[language]
            if not isinstance(value, str) or not value.strip() or value != value.strip():
                raise ValueError(f"Missing or untrimmed {language} translation at citation {row['citation_ordinal']}")
        if not isinstance(row["confidence"], (int, float)) or not 0 < row["confidence"] <= 1:
            raise ValueError(f"Invalid confidence at citation {row['citation_ordinal']}")
        if not isinstance(row["note"], str) or not row["note"].strip():
            raise ValueError(f"Missing translation note at citation {row['citation_ordinal']}")
        chapter_counts[row["chapter"]] += 1

    return {
        "result": "PASS",
        "contract": "DEVAM_DEVIMAHATMYA_TRANSLATION_DRAFT_VALIDATION_V1",
        "draft_path": str(path.relative_to(ROOT)).replace("\\", "/"),
        "draft_sha256": sha256_bytes(data),
        "translated_rows_en": len(rows),
        "translated_rows_hi": len(rows),
        "required_rows_per_language": 588,
        "complete": len(rows) == 588,
        "chapter_counts": {str(chapter): chapter_counts[chapter] for chapter in sorted(chapter_counts)},
        "remaining_rows_per_language": 588 - len(rows),
        "publication_allowed": len(rows) == 588 and require_complete,
        "source_boundary": "Exact Sanskrit Wikisource provider revisions only; not an identified print edition, recension, or all Devimahatmya traditions.",
        "translation_boundary": "AI-assisted Devam beta translation; not a source original or independently Sanskrit-reviewed critical translation.",
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--path", type=Path, default=DRAFT)
    parser.add_argument("--require-complete", action="store_true")
    args = parser.parse_args()
    print(json.dumps(validate(args.path, args.require_complete), ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

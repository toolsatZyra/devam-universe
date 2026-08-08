from __future__ import annotations

import argparse
import json
import re
from collections import defaultdict
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
OBJECTS = ROOT / "source_vault" / "objects.jsonl"
PROVENANCE = ROOT / "source_vault" / "provenance-map.jsonl"
SUMMARY = ROOT / "source_vault" / "summary.json"
OUTPUT = ROOT / "apps" / "web" / "src" / "data" / "generated" / "source-catalog-v1.json"
GENERIC_PATH_PARTS = {
    "acquisitions", "staging", "official-files", "upstream", "extracted",
    "transformations", "plaintext", "html", "xml", "live", "restricted",
    "recovered", "outputs", "tmp", "source", "sources", "files",
}


def jsonl(path: Path) -> list[dict[str, Any]]:
    return [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line]


def normalized_search_text(values: list[str]) -> str:
    text = " ".join(values).replace("_", " ").replace("-", " ")
    text = re.sub(r"[^0-9A-Za-z\u0080-\uffff]+", " ", text.casefold())
    return " ".join(dict.fromkeys(text.split()))


def context_labels(source_path: str) -> list[str]:
    labels: list[str] = []
    for part in Path(source_path).parts[:-1]:
        folded = part.casefold()
        if folded in GENERIC_PATH_PARTS or re.fullmatch(r"20\d\d-\d\d-\d\d", part):
            continue
        if len(part) < 3 or re.fullmatch(r"[0-9a-f]{24,}", folded):
            continue
        labels.append(part)
    return labels[-6:]


def compile_index() -> dict[str, Any]:
    object_rows = jsonl(OBJECTS)
    provenance_rows = jsonl(PROVENANCE)
    summary = json.loads(SUMMARY.read_text(encoding="utf-8"))
    by_sha: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for row in provenance_rows:
        by_sha[row["sha256"]].append(row)

    records: list[dict[str, Any]] = []
    for obj in object_rows:
        sha256 = obj["sha256"]
        provenance = by_sha.get(sha256, [])
        if not provenance:
            raise ValueError(f"Object {sha256} has no provenance")
        aliases = sorted({row["name"] for row in provenance if row.get("name")}, key=lambda value: (value.casefold(), value))
        roles = sorted({row["role"] for row in provenance})
        suffixes = sorted({row.get("suffix", "") for row in provenance if row.get("suffix")})
        contexts = sorted({label for row in provenance for label in context_labels(row["source_path"])}, key=lambda value: (value.casefold(), value))
        title = obj["representative_name"]
        records.append({
            "sha256": sha256,
            "title": title,
            "bytes": obj["bytes"],
            "aliases": aliases[:8],
            "roles": roles,
            "suffixes": suffixes,
            "provenanceCount": len(provenance),
            "searchText": normalized_search_text([title, *aliases, *contexts]),
        })

    records.sort(key=lambda row: row["sha256"])
    observed_bytes = sum(row["bytes"] for row in records)
    if len(records) != summary["object_count"] or observed_bytes != summary["object_bytes"]:
        raise ValueError("Compiled catalog does not match the source-vault summary")
    return {
        "contract": "DEVAM_PRESERVED_SOURCE_CATALOG_SEARCH_V1",
        "sourceObjectCount": len(records),
        "sourceObjectBytes": observed_bytes,
        "sourceSummarySha256": __import__("hashlib").sha256(SUMMARY.read_bytes()).hexdigest(),
        "boundary": "Metadata-only discovery of preserved source objects. A match is not a verified passage, complete work, reviewed edition, rights clearance, or product-ready text.",
        "records": records,
    }


def canonical_bytes(value: dict[str, Any]) -> bytes:
    return (json.dumps(value, ensure_ascii=False, separators=(",", ":"), sort_keys=True) + "\n").encode("utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    payload = canonical_bytes(compile_index())
    if args.check:
        if not OUTPUT.exists() or OUTPUT.read_bytes() != payload:
            raise SystemExit("generated source catalog is stale")
        print(json.dumps({"result": "PASS", "mode": "check", "bytes": len(payload)}))
        return
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_bytes(payload)
    print(json.dumps({"result": "PASS", "output": str(OUTPUT.relative_to(ROOT)).replace("\\", "/"), "bytes": len(payload)}))


if __name__ == "__main__":
    main()

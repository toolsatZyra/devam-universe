#!/usr/bin/env python3
"""Build and verify Devam's deduplicated source vault before legacy cleanup.

This tool deliberately separates irreplaceable/library-relevant bytes from the
old release machinery.  It never deletes files.  Destructive cleanup is done
separately only after ``verify`` succeeds.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import os
import shutil
import stat
import sys
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
VAULT = ROOT / "source_vault"
STAGING = ROOT / ".source_vault_staging"

CHECKLIST = ROOT / "data/registries/definitive-library-checklist-2026-07-12-v0.4.csv"

PROVIDER_CATALOGS = (
    "ambuda-holdings-2026-07-12.csv",
    "ambuda-items-2026-07-12.csv",
    "ambuda-restricted-2026-07-12.csv",
    "cict-carriers-2026-07-12.csv",
    "cict-items-2026-07-12.csv",
    "epic-textual-divergences-2026-07-12.csv",
    "gita-press-catalog-summary-2026-07-12.json",
    "gita-press-items-2026-07-12.csv",
    "gita-press-target-map-2026-07-12.csv",
    "gretil-items-2026-07-12.csv",
    "master-corpus-universe-2026-07-12.csv",
    "open-catalog-evidence-2026-07-12.csv",
    "open-catalog-overlaps-2026-07-12.csv",
    "project-madurai-items-2026-07-12.csv",
    "sanskrit-documents-acquisition-decision-2026-07-12.csv",
    "sarit-carriers-2026-07-12.csv",
    "sarit-items-2026-07-12.csv",
    "smith-epic-source-files-2026-07-12.csv",
    "source-census.csv",
    "textgrid-gretil-carriers-2026-07-12.csv",
    "textgrid-gretil-items-2026-07-12.csv",
)

RESEARCH_DOSSIERS = (
    "00-devam-knowledge-infrastructure-research-charter.md",
    "02-initial-global-source-census-and-acquisition-portfolio.md",
    "03-ambuda-first-acquisition-and-completeness-pilot.md",
    "04-smith-epics-provenance-rights-and-completeness-dossier.md",
    "06-open-catalog-acquisition-expansion.md",
    "26-track-a-mvp-knowledge-universe-and-living-practice-contract-v0.1.md",
)

LEGACY_TOP_LEVEL_TARGETS = (
    ".agents",
    ".codex",
    ".git",
    ".research-cache",
    "acquisitions",
    "data",
    "docs",
    "library",
    "output",
    "outputs",
    "schemas",
    "scripts",
    "services",
    "tests",
    "tmp",
)

LEGACY_ROOT_FILES = (
    "DEVAM_PROJECT_STATE_AND_HANDOFF_2026-07-12.md",
    "DEVAM_TRACK_A_CURRENT_HANDOFF_2026-07-19.md",
    "DEVAM_TRACK_A_CURRENT_HANDOFF_2026-07-19_V2.md",
    "DEVAM_TRACK_A_NEXT_CONVERSATION_PROMPT_2026-07-19.md",
    "DEVAM_TRACK_A_NEXT_CONVERSATION_PROMPT_2026-07-19_V2.md",
    "DEVAM_TRACK_B_STATE_AND_HANDOFF_2026-07-19.md",
    "NEXT_CONVERSATION_PROMPT.md",
    "TRACK_B_CONSOLIDATED_START_PROMPT_2026-07-19.md",
    "vault-build.stdout.log",
    "vault-build.stderr.log",
    "vault-verify.stdout.log",
    "vault-verify.stderr.log",
)

LEAD_COLUMNS = (
    "queue_id",
    "source_record_id",
    "record_type",
    "title",
    "provider",
    "planning_bucket",
    "priority",
    "primary_route",
    "source_url",
    "rights_clearance_status",
    "status_basis",
    "manual_note",
    "done_definition",
)

# These are source/provenance bytes, not development dependencies.
SKIP_PARTS = {".git", "node_modules", "__pycache__"}
SKIP_SUFFIXES = {".pyc", ".pyo", ".pack", ".idx", ".rev", ".promisor"}
OUTPUT_EXCLUDED_PART_FRAGMENTS = (
    "independent-clean-rebuild",
    "adversarial",
    "fixture",
    "rejected",
    "audit",
    "rollback",
)
OUTPUT_SOURCE_PARTS = {"carriers", "carrier", "originals", "scans", "payload"}


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(8 * 1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def ordinary_file(path: Path) -> bool:
    st = path.lstat()
    if stat.S_ISLNK(st.st_mode) or not stat.S_ISREG(st.st_mode):
        return False
    # Windows reparse point flag.
    return not bool(getattr(st, "st_file_attributes", 0) & 0x400)


def safe_walk(base: Path, prune_dir=None):
    stack = [base]
    while stack:
        current = stack.pop()
        with os.scandir(current) as entries:
            for entry in entries:
                p = Path(entry.path)
                if entry.is_dir(follow_symlinks=False) and prune_dir is not None and prune_dir(p):
                    continue
                st = p.lstat()
                if stat.S_ISLNK(st.st_mode) or bool(getattr(st, "st_file_attributes", 0) & 0x400):
                    raise RuntimeError(f"link/reparse entry rejected: {p}")
                if stat.S_ISDIR(st.st_mode):
                    stack.append(p)
                elif stat.S_ISREG(st.st_mode):
                    yield p
                else:
                    raise RuntimeError(f"special entry rejected: {p}")


def tmp_source_root(name: str) -> bool:
    n = name.casefold()
    return (
        "source-cache" in n
        or "preflight" in n
        or "identity" in n
        or "probe" in n
        or "profile" in n
        or n.startswith("devam-pg")
    )


def candidate_records():
    """Yield (path, role) for preservation candidates; duplicates are expected."""
    for root_name, role in (("acquisitions", "canonical_acquisition"), ("library", "legacy_holding")):
        base = ROOT / root_name
        if not base.exists():
            continue
        for p in safe_walk(base):
            rel_parts = {part.casefold() for part in p.relative_to(base).parts}
            if rel_parts & SKIP_PARTS or p.suffix.casefold() in SKIP_SUFFIXES:
                continue
            yield p, role

    outputs = ROOT / "outputs"
    if outputs.exists():
        # Only acquisition/source-release roots can contain irreplaceable source
        # payloads.  Versioned local libraries, readers, indexes and evidence
        # sidecars are deliberately not traversed.
        for child in sorted(outputs.iterdir(), key=lambda x: x.name.casefold()):
            name = child.name.casefold()
            eligible = child.is_dir() and (
                "acquisition" in name
                or "private-source-release" in name
                or "carrier-acquisition" in name
            )
            if not eligible:
                continue

            def prune(path: Path) -> bool:
                folded = path.name.casefold()
                return any(fragment in folded for fragment in OUTPUT_EXCLUDED_PART_FRAGMENTS)

            for p in safe_walk(child, prune_dir=prune):
                rel = p.relative_to(outputs)
                folded = tuple(part.casefold() for part in rel.parts)
                parts = set(folded[:-1])
                source_part = bool(parts & OUTPUT_SOURCE_PARTS) or any(part.startswith("private-carriers") for part in parts)
                if source_part:
                    yield p, "recovered_output_source"

    tmp = ROOT / "tmp"
    if tmp.exists():
        for child in sorted(tmp.iterdir(), key=lambda x: x.name.casefold()):
            if child.is_dir() and tmp_source_root(child.name):
                for p in safe_walk(child):
                    rel_parts = {part.casefold() for part in p.relative_to(child).parts}
                    if rel_parts & SKIP_PARTS or p.suffix.casefold() in SKIP_SUFFIXES:
                        continue
                    yield p, "recovered_temporary_source"

    research = ROOT / "docs/research"
    for name in RESEARCH_DOSSIERS:
        p = research / name
        if not p.is_file() or not ordinary_file(p):
            raise RuntimeError(f"required research dossier missing or unsafe: {p}")
        yield p, "substantive_research_dossier"


def write_json_exclusive(path: Path, value) -> None:
    data = json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True).encode("utf-8") + b"\n"
    with path.open("xb") as f:
        f.write(data)


def create_catalogs(staging: Path) -> dict:
    catalogs = staging / "catalogs"
    providers = catalogs / "providers"
    providers.mkdir(parents=True)
    catalog_rows = []
    registry = ROOT / "data/registries"
    for name in PROVIDER_CATALOGS:
        src = registry / name
        if not src.is_file() or not ordinary_file(src):
            raise RuntimeError(f"required provider catalog missing or unsafe: {src}")
        dst = providers / name
        shutil.copyfile(src, dst)
        if sha256(src) != sha256(dst):
            raise RuntimeError(f"catalog copy mismatch: {src}")
        catalog_rows.append({"path": dst.relative_to(staging).as_posix(), "bytes": dst.stat().st_size, "sha256": sha256(dst)})

    leads = catalogs / "source-leads.csv"
    seen = set()
    count = 0
    with CHECKLIST.open("r", encoding="utf-8-sig", newline="") as src, leads.open("x", encoding="utf-8", newline="") as dst:
        reader = csv.DictReader(src)
        if not set(LEAD_COLUMNS).issubset(reader.fieldnames or []):
            raise RuntimeError("checklist is missing required lead columns")
        writer = csv.DictWriter(dst, fieldnames=LEAD_COLUMNS, lineterminator="\n")
        writer.writeheader()
        for row in reader:
            qid = row["queue_id"]
            if not qid or qid in seen:
                raise RuntimeError(f"invalid or duplicate queue_id: {qid!r}")
            seen.add(qid)
            writer.writerow({key: row.get(key, "") for key in LEAD_COLUMNS})
            count += 1
    if count != 6545:
        raise RuntimeError(f"expected 6545 source leads, got {count}")

    catalog_rows.append({"path": leads.relative_to(staging).as_posix(), "bytes": leads.stat().st_size, "sha256": sha256(leads)})
    return {"source_leads": count, "files": sorted(catalog_rows, key=lambda x: x["path"])}


def build() -> None:
    if VAULT.exists() or STAGING.exists():
        raise RuntimeError("source_vault or staging already exists; refusing overwrite")
    (STAGING / "objects/sha256").mkdir(parents=True)
    mappings_path = STAGING / "provenance-map.jsonl"
    object_meta: dict[str, dict] = {}
    path_records = 0
    role_counts = Counter()
    with mappings_path.open("x", encoding="utf-8", newline="\n") as mappings:
        for path, role in candidate_records():
            rel = path.relative_to(ROOT).as_posix()
            before = path.stat()
            digest = sha256(path)
            after = path.stat()
            if (before.st_size, before.st_mtime_ns) != (after.st_size, after.st_mtime_ns):
                raise RuntimeError(f"source changed while hashing: {path}")
            obj_rel = Path("objects/sha256") / digest[:2] / digest
            obj = STAGING / obj_rel
            if not obj.exists():
                obj.parent.mkdir(exist_ok=True)
                temp = obj.with_name(obj.name + ".partial")
                with path.open("rb") as src, temp.open("xb") as dst:
                    shutil.copyfileobj(src, dst, length=8 * 1024 * 1024)
                if temp.stat().st_size != before.st_size or sha256(temp) != digest:
                    raise RuntimeError(f"copied object mismatch: {path}")
                os.replace(temp, obj)
                object_meta[digest] = {
                    "sha256": digest,
                    "bytes": before.st_size,
                    "object_path": obj_rel.as_posix(),
                    "representative_name": path.name,
                }
            elif sha256(obj) != digest or obj.stat().st_size != before.st_size:
                raise RuntimeError(f"existing staged object mismatch: {obj}")
            rec = {
                "source_path": rel,
                "role": role,
                "name": path.name,
                "suffix": path.suffix.casefold(),
                "bytes": before.st_size,
                "sha256": digest,
                "object_path": obj_rel.as_posix(),
            }
            mappings.write(json.dumps(rec, ensure_ascii=False, sort_keys=True, separators=(",", ":")) + "\n")
            path_records += 1
            role_counts[role] += 1

    objects_manifest = STAGING / "objects.jsonl"
    with objects_manifest.open("x", encoding="utf-8", newline="\n") as f:
        for digest in sorted(object_meta):
            f.write(json.dumps(object_meta[digest], ensure_ascii=False, sort_keys=True, separators=(",", ":")) + "\n")

    catalogs = create_catalogs(STAGING)
    object_bytes = sum(v["bytes"] for v in object_meta.values())
    summary = {
        "contract": "DEVAM_LEAN_SOURCE_VAULT_V1",
        "selection_boundary": "unique source, carrier, provenance, provider catalog, rights-relevant, and substantive research bytes; no old release authority",
        "object_count": len(object_meta),
        "object_bytes": object_bytes,
        "provenance_path_records": path_records,
        "role_counts": dict(sorted(role_counts.items())),
        "catalogs": catalogs,
        "objects_manifest_sha256": sha256(objects_manifest),
        "provenance_map_sha256": sha256(mappings_path),
        "all_legacy_statuses_non_authoritative": True,
    }
    write_json_exclusive(STAGING / "summary.json", summary)
    STAGING.rename(VAULT)
    print(json.dumps(summary, ensure_ascii=False, indent=2, sort_keys=True))


def verify() -> None:
    if not VAULT.is_dir() or STAGING.exists():
        raise RuntimeError("canonical source_vault missing or staging still exists")
    summary_path = VAULT / "summary.json"
    summary = json.loads(summary_path.read_text(encoding="utf-8"))
    if summary.get("contract") != "DEVAM_LEAN_SOURCE_VAULT_V1":
        raise RuntimeError("unexpected source vault contract")
    for path in safe_walk(VAULT):
        if path.stat().st_nlink != 1:
            raise RuntimeError(f"hardlinked vault file rejected: {path}")
    objects_manifest = VAULT / "objects.jsonl"
    provenance = VAULT / "provenance-map.jsonl"
    if sha256(objects_manifest) != summary["objects_manifest_sha256"]:
        raise RuntimeError("objects manifest hash mismatch")
    if sha256(provenance) != summary["provenance_map_sha256"]:
        raise RuntimeError("provenance map hash mismatch")
    objects = []
    with objects_manifest.open("r", encoding="utf-8") as f:
        for line in f:
            rec = json.loads(line)
            obj = VAULT / rec["object_path"]
            if not ordinary_file(obj) or obj.stat().st_size != rec["bytes"] or sha256(obj) != rec["sha256"]:
                raise RuntimeError(f"object verification failed: {obj}")
            objects.append(rec)
    if len(objects) != summary["object_count"] or sum(x["bytes"] for x in objects) != summary["object_bytes"]:
        raise RuntimeError("object count/byte totals mismatch")
    map_count = sum(1 for _ in provenance.open("r", encoding="utf-8"))
    if map_count != summary["provenance_path_records"]:
        raise RuntimeError("provenance path-record count mismatch")
    for rec in summary["catalogs"]["files"]:
        path = VAULT / rec["path"]
        if not ordinary_file(path) or path.stat().st_size != rec["bytes"] or sha256(path) != rec["sha256"]:
            raise RuntimeError(f"catalog verification failed: {path}")
    print(json.dumps({
        "result": "PASS",
        "object_count": len(objects),
        "object_bytes": sum(x["bytes"] for x in objects),
        "provenance_path_records": map_count,
        "summary_sha256": sha256(summary_path),
        "objects_manifest_sha256": sha256(objects_manifest),
        "provenance_map_sha256": sha256(provenance),
    }, indent=2, sort_keys=True))


def discard_staging() -> None:
    """Remove only this tool's unpublished staging tree after a failed build."""
    expected = ROOT / ".source_vault_staging"
    if not expected.exists():
        print("NO_STAGING")
        return
    if expected.resolve() != Path(r"C:\Work\Code\sanatan_knowledge_graph\.source_vault_staging"):
        raise RuntimeError(f"unexpected staging path: {expected.resolve()}")
    st = expected.lstat()
    if stat.S_ISLNK(st.st_mode) or bool(getattr(st, "st_file_attributes", 0) & 0x400):
        raise RuntimeError("refusing to remove linked/reparse staging")
    shutil.rmtree(expected)
    if expected.exists():
        raise RuntimeError("staging removal failed")
    print("STAGING_REMOVED")


def _extended(path: Path) -> str:
    value = str(path)
    return "\\\\?\\" + value if os.name == "nt" and not value.startswith("\\\\?\\") else value


def _remove_tree(path: Path) -> None:
    def clear_readonly(function, failing_path, _excinfo):
        os.chmod(failing_path, stat.S_IWRITE)
        function(failing_path)

    shutil.rmtree(_extended(path), onexc=clear_readonly)


def cleanup_legacy() -> None:
    """Delete only the frozen legacy allowlist after a fresh vault verification."""
    # Fail closed on vault drift immediately before destructive work.
    summary = json.loads((VAULT / "summary.json").read_text(encoding="utf-8"))
    if summary.get("contract") != "DEVAM_LEAN_SOURCE_VAULT_V1":
        raise RuntimeError("source vault contract missing")
    if sha256(VAULT / "objects.jsonl") != summary["objects_manifest_sha256"]:
        raise RuntimeError("source vault objects manifest drift")
    if sha256(VAULT / "provenance-map.jsonl") != summary["provenance_map_sha256"]:
        raise RuntimeError("source vault provenance map drift")

    removed = []
    for name in LEGACY_TOP_LEVEL_TARGETS:
        target = ROOT / name
        if not target.exists():
            continue
        if target.parent.resolve() != ROOT or target.resolve() != target.absolute():
            raise RuntimeError(f"unsafe cleanup target: {target}")
        st = target.lstat()
        if not stat.S_ISDIR(st.st_mode) or stat.S_ISLNK(st.st_mode) or bool(getattr(st, "st_file_attributes", 0) & 0x400):
            raise RuntimeError(f"cleanup root is not an ordinary directory: {target}")
        _remove_tree(target)
        if target.exists():
            raise RuntimeError(f"cleanup target survived: {target}")
        removed.append(name)
        print(f"REMOVED_DIR {name}", flush=True)

    for name in LEGACY_ROOT_FILES:
        target = ROOT / name
        if not target.exists():
            continue
        if target.parent.resolve() != ROOT or target.resolve() != target.absolute():
            raise RuntimeError(f"unsafe cleanup file target: {target}")
        if not ordinary_file(target):
            raise RuntimeError(f"cleanup root file is not ordinary: {target}")
        os.unlink(_extended(target))
        removed.append(name)
        print(f"REMOVED_FILE {name}", flush=True)

    for child_name in ("frozen", "__pycache__"):
        target = ROOT / "tools" / child_name
        if target.exists():
            if target.parent.resolve() != (ROOT / "tools").resolve():
                raise RuntimeError(f"unsafe tool cleanup target: {target}")
            _remove_tree(target)
            removed.append(f"tools/{child_name}")
            print(f"REMOVED_DIR tools/{child_name}", flush=True)

    survivors = sorted(p.name for p in ROOT.iterdir())
    print(json.dumps({"result": "PASS", "removed": removed, "survivors": survivors}, indent=2), flush=True)


def purge_run_logs() -> None:
    names = (
        "cleanup.stdout.log",
        "cleanup.stderr.log",
        "cleanup-resume.stdout.log",
        "cleanup-resume.stderr.log",
    )
    removed = []
    for name in names:
        path = ROOT / name
        if path.exists():
            if path.parent.resolve() != ROOT or not ordinary_file(path):
                raise RuntimeError(f"unsafe run log: {path}")
            path.unlink()
            removed.append(name)
    cache = ROOT / "tools/__pycache__"
    if cache.exists():
        if cache.parent.resolve() != (ROOT / "tools").resolve():
            raise RuntimeError(f"unsafe cache path: {cache}")
        _remove_tree(cache)
        removed.append("tools/__pycache__")
    print(json.dumps({"result": "PASS", "removed": removed}, indent=2))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=("build", "verify", "discard-staging", "cleanup-legacy", "purge-run-logs"))
    args = parser.parse_args()
    if ROOT != Path(r"C:\Work\Code\sanatan_knowledge_graph").resolve():
        raise RuntimeError(f"unexpected workspace root: {ROOT}")
    if args.action == "build":
        build()
    elif args.action == "verify":
        verify()
    elif args.action == "discard-staging":
        discard_staging()
    elif args.action == "cleanup-legacy":
        cleanup_legacy()
    else:
        purge_run_logs()


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise

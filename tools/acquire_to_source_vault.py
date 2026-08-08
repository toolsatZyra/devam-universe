from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import stat
import subprocess
import sys
import time
from pathlib import Path
from typing import Any

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from tools.compile_source_vault_tei_ingestion import ROOT, canonical_json
from tools.lean_cleanup import verify as verify_vault


VAULT = ROOT / "source_vault"
INCOMING = ROOT / ".source_vault_incoming"
CONTRACT = "DEVAM_LEAN_SOURCE_VAULT_ACQUISITION_V1"
NODE_FETCH = r"""
const fs = require('fs');
const crypto = require('crypto');
const {Readable, Transform} = require('stream');
const {pipeline} = require('stream/promises');
(async()=>{
  const [url, output] = process.argv.slice(1);
  let response;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    response = await fetch(url, {redirect:'follow', headers:{'user-agent':'Devam/0.1 (source preservation; contact via repository owner)'}});
    if (![429, 503].includes(response.status)) break;
    const retryAfter = Number(response.headers.get('retry-after'));
    await response.body?.cancel();
    if (attempt < 3) {
      const waitMs = Number.isFinite(retryAfter) && retryAfter > 0
        ? Math.min(retryAfter * 1000, 60000)
        : 10000 * (attempt + 1);
      await new Promise(resolve => setTimeout(resolve, waitMs));
    }
  }
  if (response.status !== 200) throw new Error(`HTTP ${response.status}`);
  const hashes = {
    md5: crypto.createHash('md5'),
    sha1: crypto.createHash('sha1'),
    sha256: crypto.createHash('sha256')
  };
  let byteCount = 0;
  const observer = new Transform({
    transform(chunk, _encoding, callback) {
      byteCount += chunk.length;
      for (const hash of Object.values(hashes)) hash.update(chunk);
      callback(null, chunk);
    }
  });
  await pipeline(
    Readable.fromWeb(response.body),
    observer,
    fs.createWriteStream(output, {flags:'wx'})
  );
  process.stdout.write(JSON.stringify({
    status: response.status,
    final_url: response.url,
    bytes: byteCount,
    md5: hashes.md5.digest('hex'),
    sha1: hashes.sha1.digest('hex'),
    sha256: hashes.sha256.digest('hex')
  }));
})().catch(error=>{console.error(String(error)); process.exit(1)});
"""


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def ordinary_file(path: Path) -> bool:
    try:
        info = path.lstat()
    except FileNotFoundError:
        return False
    return (
        stat.S_ISREG(info.st_mode)
        and not stat.S_ISLNK(info.st_mode)
        and not bool(getattr(info, "st_file_attributes", 0) & 0x400)
        and info.st_nlink == 1
    )


def write_new(path: Path, data: bytes) -> None:
    with path.open("xb") as handle:
        handle.write(data)
        handle.flush()
        os.fsync(handle.fileno())


def validate_plan(plan: dict[str, Any]) -> None:
    if plan.get("contract") != CONTRACT or not plan.get("acquisition_id"):
        raise ValueError("Acquisition contract drift")
    if not plan.get("files") or len(plan["files"]) != len({row["source_path"].casefold() for row in plan["files"]}):
        raise ValueError("Acquisition file universe is empty or case-colliding")
    interval = plan.get("request_interval_seconds", 0)
    if not isinstance(interval, (int, float)) or isinstance(interval, bool) or interval < 0 or interval > 60:
        raise ValueError("request_interval_seconds must be between 0 and 60")
    for row in plan["files"]:
        if row["role"] != "canonical_acquisition" or not isinstance(row.get("strict_utf8"), bool):
            raise ValueError("Acquisitions require an explicit canonical role and encoding boundary")
        if Path(row["name"]).name != row["name"] or Path(row["source_path"]).is_absolute() or ".." in Path(row["source_path"]).parts:
            raise ValueError("Unsafe acquisition name or source path")
        if not row["url"].startswith("https://") or not row["final_url"].startswith("https://"):
            raise ValueError("HTTPS is mandatory")
        allowed_final_urls = row.get("allowed_final_urls", [row["final_url"]])
        if not allowed_final_urls or row["final_url"] not in allowed_final_urls or any(not value.startswith("https://") for value in allowed_final_urls):
            raise ValueError("Final URL allowlist is empty, inconsistent, or insecure")
        sha256 = row.get("sha256")
        provider_sha1 = row.get("provider_sha1")
        provider_md5 = row.get("provider_md5")
        if sha256 is not None:
            if not isinstance(sha256, str) or not re_fullmatch_hex(sha256, 64):
                raise ValueError("Invalid expected SHA-256")
        elif not (
            (isinstance(provider_sha1, str) and re_fullmatch_hex(provider_sha1, 40))
            or (isinstance(provider_md5, str) and re_fullmatch_hex(provider_md5, 32))
        ):
            raise ValueError("Acquisition requires SHA-256 or at least one provider transport fixity")
        if provider_sha1 is not None and (not isinstance(provider_sha1, str) or not re_fullmatch_hex(provider_sha1, 40)):
            raise ValueError("Invalid provider SHA-1")
        if provider_md5 is not None and (not isinstance(provider_md5, str) or not re_fullmatch_hex(provider_md5, 32)):
            raise ValueError("Invalid provider MD5")


def re_fullmatch_hex(value: str, length: int) -> bool:
    return len(value) == length and all(character in "0123456789abcdef" for character in value)


def fetch(plan: dict[str, Any]) -> list[tuple[dict[str, Any], Path]]:
    if INCOMING.exists():
        raise RuntimeError("Incoming source-vault staging already exists")
    INCOMING.mkdir()
    results = []
    for index, row in enumerate(plan["files"]):
        if index and plan.get("request_interval_seconds", 0):
            time.sleep(plan["request_interval_seconds"])
        destination = INCOMING / f"{index:04d}-{row['name']}"
        try:
            completed = subprocess.run(
                ["node", "-e", NODE_FETCH, row["url"], str(destination)],
                cwd=ROOT,
                check=True,
                capture_output=True,
                text=True,
                encoding="utf-8",
            )
        except subprocess.CalledProcessError as error:
            raise RuntimeError(f"TLS acquisition failed for {row['name']}: {error.stderr.strip()}") from error
        observation = json.loads(completed.stdout)
        expected = {"status": 200, "bytes": row["bytes"]}
        if row.get("sha256") is not None:
            expected["sha256"] = row["sha256"]
        else:
            if row.get("provider_sha1") is not None:
                expected["sha1"] = row["provider_sha1"]
            if row.get("provider_md5") is not None:
                expected["md5"] = row["provider_md5"]
        observed_core = {key: observation[key] for key in expected}
        allowed_final_urls = row.get("allowed_final_urls", [row["final_url"]])
        if observed_core != expected or observation["final_url"] not in allowed_final_urls:
            raise ValueError(
                f"Live acquisition drift for {row['name']}: "
                f"expected={expected!r}, observed_core={observed_core!r}, "
                f"allowed_final_urls={allowed_final_urls!r}, observation={observation!r}"
            )
        effective_row = {**row, "sha256": observation["sha256"]}
        if not ordinary_file(destination) or destination.stat().st_size != row["bytes"] or sha256_file(destination) != effective_row["sha256"]:
            raise ValueError(f"Downloaded file verification failed: {row['name']}")
        if row["strict_utf8"]:
            data = destination.read_bytes()
            text = data.decode("utf-8", errors="strict")
            if text.encode("utf-8") != data:
                raise ValueError(f"UTF-8 roundtrip failed: {row['name']}")
        results.append((effective_row, destination))
    return results


def install(plan: dict[str, Any], downloads: list[tuple[dict[str, Any], Path]]) -> dict[str, Any]:
    objects_path = VAULT / "objects.jsonl"
    provenance_path = VAULT / "provenance-map.jsonl"
    summary_path = VAULT / "summary.json"
    objects = [json.loads(line) for line in objects_path.read_text(encoding="utf-8").splitlines()]
    provenance = [json.loads(line) for line in provenance_path.read_text(encoding="utf-8").splitlines()]
    summary = json.loads(summary_path.read_text(encoding="utf-8"))
    by_hash = {row["sha256"]: row for row in objects}
    by_source_path = {row["source_path"]: row for row in provenance}
    added_objects = []
    added_provenance = []
    for row, downloaded in downloads:
        object_path = f"objects/sha256/{row['sha256'][:2]}/{row['sha256']}"
        expected_object = {
            "bytes": row["bytes"],
            "object_path": object_path,
            "representative_name": row["name"],
            "sha256": row["sha256"],
        }
        existing = by_hash.get(row["sha256"])
        if existing is not None and (existing["bytes"] != row["bytes"] or existing["object_path"] != object_path):
            raise ValueError(f"Existing object identity collision: {row['sha256']}")
        if existing is None:
            target = VAULT / object_path
            target.parent.mkdir(parents=True, exist_ok=True)
            if target.exists():
                raise ValueError(f"Unmanifested object target already exists: {target}")
            with downloaded.open("rb") as source, target.open("xb") as destination:
                shutil.copyfileobj(source, destination, 1024 * 1024)
                destination.flush()
                os.fsync(destination.fileno())
            if not ordinary_file(target) or target.stat().st_size != row["bytes"] or sha256_file(target) != row["sha256"]:
                raise ValueError(f"Installed object verification failed: {target}")
            objects.append(expected_object)
            by_hash[row["sha256"]] = expected_object
            added_objects.append(expected_object)
        provenance_record = {
            "bytes": row["bytes"],
            "media_type": row["media_type"],
            "name": row["name"],
            "object_path": object_path,
            "retrieved_at": plan["retrieved_at"],
            "rights_evidence": plan["rights_evidence"],
            "role": row["role"],
            "sha256": row["sha256"],
            "source_path": row["source_path"],
            "source_url": row["url"],
            "suffix": Path(row["name"]).suffix.lower(),
        }
        provider_fixities = {
            key.removeprefix("provider_"): row[key]
            for key in ("provider_md5", "provider_sha1", "provider_crc32")
            if row.get(key) is not None
        }
        if provider_fixities:
            provenance_record["provider_fixities"] = provider_fixities
        existing_provenance = by_source_path.get(row["source_path"])
        if existing_provenance is not None and existing_provenance != provenance_record:
            raise ValueError(f"Provenance path collision: {row['source_path']}")
        if existing_provenance is None:
            provenance.append(provenance_record)
            by_source_path[row["source_path"]] = provenance_record
            added_provenance.append(provenance_record)

    objects.sort(key=lambda row: row["sha256"])
    objects_bytes = ("\n".join(canonical_json(row) for row in objects) + "\n").encode("utf-8")
    provenance_bytes = ("\n".join(canonical_json(row) for row in provenance) + "\n").encode("utf-8")
    summary["object_count"] = len(objects)
    summary["object_bytes"] = sum(row["bytes"] for row in objects)
    summary["provenance_path_records"] = len(provenance)
    summary["objects_manifest_sha256"] = sha256_bytes(objects_bytes)
    summary["provenance_map_sha256"] = sha256_bytes(provenance_bytes)
    role_counts = collections_counter(row["role"] for row in provenance)
    summary["role_counts"] = dict(sorted(role_counts.items()))
    summary_bytes = (json.dumps(summary, ensure_ascii=False, indent=2, sort_keys=True) + "\n").encode("utf-8")
    replacements = [
        (objects_path, objects_bytes),
        (provenance_path, provenance_bytes),
        (summary_path, summary_bytes),
    ]
    for target, data in replacements:
        temporary = target.with_name(target.name + ".incoming-new")
        if temporary.exists():
            raise RuntimeError(f"Manifest temporary already exists: {temporary}")
        write_new(temporary, data)
    for target, _ in replacements:
        os.replace(target.with_name(target.name + ".incoming-new"), target)
    return {
        "added_object_count": len(added_objects),
        "added_object_bytes": sum(row["bytes"] for row in added_objects),
        "added_provenance_count": len(added_provenance),
        "object_count": summary["object_count"],
        "object_bytes": summary["object_bytes"],
        "provenance_path_records": summary["provenance_path_records"],
        "objects_manifest_sha256": summary["objects_manifest_sha256"],
        "provenance_map_sha256": summary["provenance_map_sha256"],
        "summary_sha256": sha256_bytes(summary_bytes),
        "acquired_files": [
            {"name": row["name"], "bytes": row["bytes"], "sha256": row["sha256"]}
            for row, _ in downloads
        ],
    }


def cleanup_failed_install(downloads: list[tuple[dict[str, Any], Path]]) -> None:
    """Remove only uncommitted files created by this acquisition attempt."""

    objects_path = VAULT / "objects.jsonl"
    committed_hashes = {
        json.loads(line)["sha256"]
        for line in objects_path.read_text(encoding="utf-8").splitlines()
    }
    for row, _downloaded in downloads:
        if row["sha256"] in committed_hashes:
            continue
        target = VAULT / "objects" / "sha256" / row["sha256"][:2] / row["sha256"]
        if not target.exists():
            continue
        if not ordinary_file(target) or target.stat().st_size != row["bytes"] or sha256_file(target) != row["sha256"]:
            raise RuntimeError(f"Unsafe failed-install object cleanup target: {target}")
        target.unlink()
    for name in ("objects.jsonl.incoming-new", "provenance-map.jsonl.incoming-new", "summary.json.incoming-new"):
        target = VAULT / name
        if not target.exists():
            continue
        if not ordinary_file(target):
            raise RuntimeError(f"Unsafe failed-install manifest cleanup target: {target}")
        target.unlink()


def collections_counter(values):
    result: dict[str, int] = {}
    for value in values:
        result[value] = result.get(value, 0) + 1
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description="Acquire exact HTTPS source files into the lean content-addressed source vault.")
    parser.add_argument("--plan", required=True, type=Path)
    args = parser.parse_args()
    path = args.plan.resolve(strict=True)
    if not path.is_relative_to(ROOT / "ingestion" / "plans"):
        raise ValueError("Plan must be inside ingestion/plans")
    plan = json.loads(path.read_text(encoding="utf-8"))
    validate_plan(plan)
    verify_vault()
    downloads: list[tuple[dict[str, Any], Path]] = []
    try:
        downloads = fetch(plan)
        result = install(plan, downloads)
    except Exception:
        cleanup_failed_install(downloads)
        raise
    finally:
        if INCOMING.exists():
            for child in INCOMING.iterdir():
                if not ordinary_file(child):
                    raise RuntimeError(f"Unsafe incoming cleanup target: {child}")
                child.unlink()
            INCOMING.rmdir()
    verify_vault()
    print(json.dumps({"result": "PASS", "contract": CONTRACT, "acquisition_id": plan["acquisition_id"], **result}, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

#!/usr/bin/env python3
"""Freeze and acquire the Belvedere Ramcharitmanas Hindi Wikisource pages.

The exact 1925 Belvedere Press scan is already retained once in source_vault.
This tool adds only the distinct Hindi Wikisource revision JSON carriers and
site-rights evidence.  Proofread/validated pages are product candidates;
unproofread or empty pages remain internal correction evidence.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import stat
import subprocess
import sys
import tempfile
import time
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlencode


ROOT = Path(__file__).resolve().parents[1]
VAULT = ROOT / "source_vault"
PLAN = ROOT / "ingestion/plans/ramcharitmanas-wikisource-belvedere-pages-v1.json"
REPORT = ROOT / "ingestion/reports/ramcharitmanas-wikisource-belvedere-pages-v1.json"
NODE = Path(
    r"C:\Users\shiba\.cache\codex-runtimes\codex-primary-runtime"
    r"\dependencies\node\bin\node.exe"
)

API = "https://hi.wikisource.org/w/api.php"
WORK = "रामचरितमानस"
INDEX_TITLE = f"विषयसूची:{WORK}.pdf"
PAGE_PREFIX = f"पृष्ठ:{WORK}.pdf/"
SITE_LICENSE_LITERAL = "Creative Commons Attribution-Share Alike 4.0"
SITE_LICENSE_URL = "https://creativecommons.org/licenses/by-sa/4.0/deed.hi"
LICENSE_FAMILY_URL = "https://creativecommons.org/licenses/by-sa/4.0/"
SCAN_SHA256 = "6d570d531ebada1912f6e930212393fec2200765a0b731b73b8e7135ea0f70f2"
SCAN_BYTES = 78_560_265
SCAN_OBJECT = VAULT / "objects" / "sha256" / SCAN_SHA256[:2] / SCAN_SHA256
EXPECTED_PAGE_COUNT = 1_240
NARRATIVE_START = 52
NARRATIVE_END = 1_223
EXPECTED_QUALITY_COUNTS = {0: 20, 1: 350, 3: 864, 4: 6}
EXPECTED_NARRATIVE_QUALITY_COUNTS = {0: 14, 1: 345, 3: 808, 4: 5}
REQUEST_INTERVAL_SECONDS = 2
REVISION_BATCH_SIZE = 50
DEVANAGARI_DIGITS = str.maketrans("०१२३४५६७८९", "0123456789")


def canonical_json(value: object) -> bytes:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def sha256_path(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(8 * 1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def sha1_bytes(value: bytes) -> str:
    return hashlib.sha1(value).hexdigest()


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


def safe_parent(path: Path) -> None:
    root = ROOT.resolve()
    existing = path.parent
    while not existing.exists():
        existing = existing.parent
    if not existing.resolve().is_relative_to(root):
        raise RuntimeError(f"output parent escapes workspace: {path}")
    cursor = existing
    while cursor != root:
        info = cursor.lstat()
        if (
            not stat.S_ISDIR(info.st_mode)
            or stat.S_ISLNK(info.st_mode)
            or bool(getattr(info, "st_file_attributes", 0) & 0x400)
        ):
            raise RuntimeError(f"unsafe output ancestor: {cursor}")
        cursor = cursor.parent


def write_json_exclusive(path: Path, value: object) -> None:
    safe_parent(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    payload = canonical_json(value) + b"\n"
    with path.open("xb") as stream:
        stream.write(payload)
        stream.flush()
        os.fsync(stream.fileno())


def replace_bytes(path: Path, value: bytes) -> None:
    safe_parent(path)
    file_descriptor, temporary_name = tempfile.mkstemp(
        prefix=path.name + ".", suffix=".tmp", dir=path.parent
    )
    try:
        with os.fdopen(file_descriptor, "wb") as stream:
            stream.write(value)
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(temporary_name, path)
    finally:
        if os.path.exists(temporary_name):
            os.unlink(temporary_name)


def node_fetch(url: str, *, method: str = "GET", body: str | None = None) -> tuple[bytes, dict]:
    if not ordinary_file(NODE):
        raise RuntimeError(f"bundled Node runtime missing or unsafe: {NODE}")
    script = r"""
const [url, method, body] = process.argv.slice(1);
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let completed = false;
for (let attempt = 0; attempt < 5; attempt += 1) {
  const response = await fetch(url, {
    method,
    redirect: 'follow',
    headers: {
      'User-Agent': 'DevamUniverse/0.1 source-acquisition (https://github.com/toolsatZyra/devam-universe)',
      'Accept': 'application/json',
      ...(body ? {'Content-Type': 'application/x-www-form-urlencoded'} : {})
    },
    ...(body ? {body} : {})
  });
  if ([429, 503].includes(response.status) && attempt < 4) {
    const retry = Number(response.headers.get('retry-after'));
    await response.body?.cancel();
    await sleep(Number.isFinite(retry) && retry > 0 ? Math.max(10000, retry * 1000) : 10000 * (attempt + 1));
    continue;
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  process.stderr.write(JSON.stringify({status: response.status, final_url: response.url, bytes: bytes.length}) + '\n');
  process.stdout.write(bytes);
  process.exitCode = response.status === 200 ? 0 : 2;
  completed = true;
  break;
}
if (!completed) process.exitCode = 3;
"""
    completed = subprocess.run(
        [str(NODE), "-e", script, url, method, body or ""],
        check=False,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    diagnostics = completed.stderr.decode("utf-8", "replace").strip().splitlines()
    if completed.returncode != 0 or len(diagnostics) != 1:
        raise RuntimeError(
            f"normal-TLS provider fetch failed returncode={completed.returncode}: {diagnostics!r}"
        )
    metadata = json.loads(diagnostics[0])
    if metadata != {"status": 200, "final_url": url, "bytes": len(completed.stdout)}:
        raise RuntimeError(f"provider status/final-url/byte mismatch: {metadata}")
    return completed.stdout, metadata


def fetch_json(params: dict[str, str], *, method: str = "GET") -> tuple[dict, bytes, dict, str]:
    if method == "GET":
        url = API + "?" + urlencode(params)
        body = None
    elif method == "POST":
        url = API
        body = urlencode(params)
    else:
        raise RuntimeError(f"unsupported request method: {method}")
    raw, metadata = node_fetch(url, method=method, body=body)
    try:
        parsed = json.loads(raw)
    except Exception as error:
        raise RuntimeError(f"provider returned invalid JSON: {url}") from error
    if "error" in parsed:
        raise RuntimeError(f"provider API error: {parsed['error']}")
    observation = {**metadata, "request_method": method}
    if body is not None:
        encoded = body.encode("utf-8")
        observation.update({"request_body_bytes": len(encoded), "request_body_sha256": sha256_bytes(encoded)})
    return parsed, raw, observation, url


def page_number(title: str) -> int:
    if not title.startswith(PAGE_PREFIX):
        raise RuntimeError(f"unexpected Page namespace title: {title}")
    suffix = title.removeprefix(PAGE_PREFIX)
    translated = suffix.translate(DEVANAGARI_DIGITS)
    if not translated.isascii() or not translated.isdigit() or str(int(translated)) != translated:
        raise RuntimeError(f"unsafe or noncanonical page-number suffix: {title}")
    return int(translated)


def latest_revision(page: dict) -> dict:
    revisions = page.get("revisions") or []
    if len(revisions) != 1:
        raise RuntimeError(f"expected exactly one revision: {page.get('title')}")
    revision = dict(revisions[0])
    required = {"revid", "parentid", "timestamp", "sha1"}
    if not required.issubset(revision):
        raise RuntimeError(f"revision metadata incomplete: {page.get('title')}")
    contentmodel = revision.get("contentmodel")
    if not isinstance(contentmodel, str):
        contentmodel = (revision.get("slots") or {}).get("main", {}).get("contentmodel")
    if not isinstance(contentmodel, str):
        raise RuntimeError(f"revision content model missing: {page.get('title')}")
    revision["contentmodel"] = contentmodel
    return revision


def revision_content(revision: dict) -> bytes:
    content = ((revision.get("slots") or {}).get("main") or {}).get("content")
    if not isinstance(content, str):
        raise RuntimeError(f"revision content missing: {revision.get('revid')}")
    return content.encode("utf-8")


def counts_for(rows: list[dict], start: int = 1, end: int = EXPECTED_PAGE_COUNT) -> dict[int, int]:
    return dict(sorted(Counter(row["quality_level"] for row in rows if start <= row["scan_page"] <= end).items()))


def validate_page_rows(rows: list[dict]) -> None:
    numbers = [row["scan_page"] for row in rows]
    if sorted(numbers) != list(range(1, EXPECTED_PAGE_COUNT + 1)) or len(set(numbers)) != EXPECTED_PAGE_COUNT:
        missing = sorted(set(range(1, EXPECTED_PAGE_COUNT + 1)) - set(numbers))
        duplicates = sorted(number for number, count in Counter(numbers).items() if count > 1)
        raise RuntimeError(f"Page namespace universe mismatch missing={missing} duplicates={duplicates}")
    if counts_for(rows) != EXPECTED_QUALITY_COUNTS:
        raise RuntimeError(f"full quality distribution drift: {counts_for(rows)}")
    narrative_counts = counts_for(rows, NARRATIVE_START, NARRATIVE_END)
    if narrative_counts != EXPECTED_NARRATIVE_QUALITY_COUNTS:
        raise RuntimeError(f"narrative quality distribution drift: {narrative_counts}")
    if any(row["contentmodel"] != "proofread-page" for row in rows):
        raise RuntimeError("unexpected Page namespace content model")
    if len({row["pageid"] for row in rows}) != EXPECTED_PAGE_COUNT:
        raise RuntimeError("Page namespace page IDs are not unique")
    if len({row["revid"] for row in rows}) != EXPECTED_PAGE_COUNT:
        raise RuntimeError("Page namespace revision IDs are not unique")


def scan_identity() -> dict:
    if not ordinary_file(SCAN_OBJECT):
        raise RuntimeError(f"canonical scan object missing or unsafe: {SCAN_OBJECT}")
    if SCAN_OBJECT.stat().st_size != SCAN_BYTES or sha256_path(SCAN_OBJECT) != SCAN_SHA256:
        raise RuntimeError("canonical Belvedere scan identity drift")
    return {
        "object_path": SCAN_OBJECT.relative_to(ROOT).as_posix(),
        "bytes": SCAN_BYTES,
        "sha256": SCAN_SHA256,
        "pdf_pages": EXPECTED_PAGE_COUNT,
    }


def freeze_page_universe() -> tuple[list[dict], list[dict]]:
    rows: list[dict] = []
    observations: list[dict] = []
    gapcontinue: str | None = None
    while True:
        params = {
            "action": "query",
            "format": "json",
            "formatversion": "2",
            "generator": "allpages",
            "gapnamespace": "250",
            "gapprefix": f"{WORK}.pdf/",
            "gaplimit": "500",
            "prop": "pageprops|info|revisions",
            "rvprop": "ids|timestamp|sha1|contentmodel",
            "inprop": "url",
        }
        if gapcontinue is not None:
            params.update({"gapcontinue": gapcontinue, "continue": "gapcontinue||"})
        parsed, raw, metadata, url = fetch_json(params)
        pages = parsed.get("query", {}).get("pages", [])
        observations.append(
            {
                "url": url,
                **metadata,
                "response_bytes": len(raw),
                "response_sha256": sha256_bytes(raw),
                "page_count": len(pages),
            }
        )
        for page in pages:
            revision = latest_revision(page)
            quality = (page.get("pageprops") or {}).get("proofread_page_quality_level")
            if not isinstance(quality, str) or not quality.isdigit():
                raise RuntimeError(f"proofread quality missing: {page.get('title')}")
            rows.append(
                {
                    "scan_page": page_number(page["title"]),
                    "pageid": page["pageid"],
                    "ns": page["ns"],
                    "title": page["title"],
                    "fullurl": page["fullurl"],
                    "wikitext_declared_bytes": page["length"],
                    "quality_level": int(quality),
                    "revid": revision["revid"],
                    "parentid": revision["parentid"],
                    "timestamp": revision["timestamp"],
                    "provider_sha1_hex": revision["sha1"],
                    "contentmodel": revision["contentmodel"],
                }
            )
        gapcontinue = (parsed.get("continue") or {}).get("gapcontinue")
        if gapcontinue is None:
            break
        time.sleep(REQUEST_INTERVAL_SECONDS)
    rows.sort(key=lambda row: row["scan_page"])
    validate_page_rows(rows)
    return rows, observations


def profile() -> None:
    if PLAN.exists():
        raise RuntimeError(f"immutable acquisition profile already exists: {PLAN}")
    scan = scan_identity()
    rights, rights_raw, rights_http, rights_url = fetch_json(
        {"action": "query", "format": "json", "formatversion": "2", "meta": "siteinfo", "siprop": "rightsinfo"}
    )
    rightsinfo = rights.get("query", {}).get("rightsinfo", {})
    if rightsinfo != {"url": SITE_LICENSE_URL, "text": SITE_LICENSE_LITERAL}:
        raise RuntimeError(f"Hindi Wikisource rights drift: {rightsinfo}")
    rows, page_observations = freeze_page_universe()
    narrative = [row for row in rows if NARRATIVE_START <= row["scan_page"] <= NARRATIVE_END]
    product_candidates = [row["scan_page"] for row in narrative if row["quality_level"] >= 3]
    correction_required = [row["scan_page"] for row in narrative if row["quality_level"] < 3]
    created_at = datetime.now(timezone.utc).isoformat()
    plan = {
        "contract": "DEVAM_RAMCHARITMANAS_WIKISOURCE_PAGE_ACQUISITION_V1",
        "created_at": created_at,
        "work": "Ramcharitmanas",
        "author": "Tulsidas",
        "source_language": "Awadhi",
        "carrier_script": "Devanagari",
        "route": "Ramayana MVP hero and exhaustive Devam library",
        "identity_boundary": (
            "The complete current 1,240-page Hindi Wikisource Page-namespace universe aligned to the exact "
            "Belvedere Press Prayag scan edited by Mahavir Prasad Malaviya Vaidya 'Vir'. It is one digital "
            "transcription state for one fixed edition, not every Ramcharitmanas edition, recension, commentary, "
            "translation, manuscript, performance tradition, or the complete Ramayana universe."
        ),
        "fixed_scan_reference": {
            **scan,
            "title": "सटीक रामचरितमानस",
            "publisher": "Belvedere Press",
            "publication_place": "Prayag",
            "edition_statement": "Second edition; printed Vikram Samvat 1982; provider year values 1925 and 1926 retained separately",
            "rights_lane": "product_allowed_public_domain_scan",
            "payload_duplicated_by_this_acquisition": False,
        },
        "wikisource": {
            "provider": "Hindi Wikisource",
            "site": "https://hi.wikisource.org/",
            "index_title": INDEX_TITLE,
            "page_prefix": PAGE_PREFIX,
            "provider_license_literal": SITE_LICENSE_LITERAL,
            "provider_license_url": SITE_LICENSE_URL,
            "license_family_url": LICENSE_FAMILY_URL,
            "rights_lane": "product_candidate_with_attribution_and_share_alike_compliance_by_page_quality",
            "canonical_page_count": EXPECTED_PAGE_COUNT,
            "pages": rows,
            "quality_counts": {str(key): value for key, value in counts_for(rows).items()},
            "narrative_scan_page_range": [NARRATIVE_START, NARRATIVE_END],
            "narrative_page_count": len(narrative),
            "narrative_quality_counts": {
                str(key): value for key, value in counts_for(rows, NARRATIVE_START, NARRATIVE_END).items()
            },
            "product_candidate_scan_pages": product_candidates,
            "product_candidate_page_count": len(product_candidates),
            "correction_required_scan_pages": correction_required,
            "correction_required_page_count": len(correction_required),
            "quality_policy": {
                "validated_4": "product candidate",
                "proofread_3": "product candidate",
                "problematic_2": "internal correction only",
                "not_proofread_1": "internal correction only",
                "without_text_0": "internal correction only",
            },
        },
        "scan_structure": {
            "front_matter": [1, 51],
            "seven_sopana_narrative": [52, 1223],
            "ramayana_arati": [1224, 1224],
            "manas_pingala": [1225, 1236],
            "advertisements_catalogue": [1237, 1239],
            "blank": [1240, 1240],
        },
        "observations": {
            "site_rights": {
                "url": rights_url,
                **rights_http,
                "response_bytes": len(rights_raw),
                "response_sha256": sha256_bytes(rights_raw),
                "rightsinfo": rightsinfo,
            },
            "page_universe_batches": page_observations,
        },
        "held_sources": [
            {
                "identifier": "gretil-ratlam-ramcharitmanas",
                "boundary": "complete seven-sopana Roman transliteration retained as private comparison evidence because source-file terms are unresolved",
            },
            {
                "identifier": "gita-press-ramcharitmanas-editions",
                "boundary": "distinct modern editions requiring purchase or partnership and separate rights",
            },
        ],
        "claims": {
            "exact_page_namespace_title_universe_complete_1_to_1240": True,
            "fixed_scan_structural_coverage_complete_for_this_edition": True,
            "all_narrative_pages_proofread_or_validated": False,
            "complete_product_searchable_ramcharitmanas_text": False,
            "all_ramcharitmanas_editions_recensions_commentaries_translations_and_traditions": False,
            "complete_ramayana_universe": False,
            "mvp_library_complete": False,
            "source_payloads_copied_into_app": False,
        },
    }
    plan["profile_id"] = "RAMCHARITMANAS-WIKISOURCE-PAGES-" + sha256_bytes(canonical_json(plan))[:24].upper()
    write_json_exclusive(PLAN, plan)
    print(
        json.dumps(
            {
                "result": "PASS",
                "profile_id": plan["profile_id"],
                "plan": PLAN.relative_to(ROOT).as_posix(),
                "plan_sha256": sha256_path(PLAN),
                "page_count": len(rows),
                "narrative_pages": len(narrative),
                "product_candidate_pages": len(product_candidates),
                "correction_required_pages": len(correction_required),
            },
            ensure_ascii=False,
            indent=2,
        )
    )


def validate_profile(plan: dict) -> None:
    if plan.get("contract") != "DEVAM_RAMCHARITMANAS_WIKISOURCE_PAGE_ACQUISITION_V1":
        raise RuntimeError("unexpected acquisition profile contract")
    profile_id = plan.get("profile_id")
    without_id = {key: value for key, value in plan.items() if key != "profile_id"}
    expected_id = "RAMCHARITMANAS-WIKISOURCE-PAGES-" + sha256_bytes(canonical_json(without_id))[:24].upper()
    if profile_id != expected_id:
        raise RuntimeError("acquisition profile ID mismatch")
    rows = plan.get("wikisource", {}).get("pages")
    if not isinstance(rows, list):
        raise RuntimeError("acquisition profile page universe missing")
    validate_page_rows(rows)
    expected_product = [
        row["scan_page"]
        for row in rows
        if NARRATIVE_START <= row["scan_page"] <= NARRATIVE_END and row["quality_level"] >= 3
    ]
    expected_correction = [
        row["scan_page"]
        for row in rows
        if NARRATIVE_START <= row["scan_page"] <= NARRATIVE_END and row["quality_level"] < 3
    ]
    if plan["wikisource"].get("product_candidate_scan_pages") != expected_product:
        raise RuntimeError("product-candidate page queue mismatch")
    if plan["wikisource"].get("correction_required_scan_pages") != expected_correction:
        raise RuntimeError("correction-required page queue mismatch")
    if plan.get("claims") != {
        "exact_page_namespace_title_universe_complete_1_to_1240": True,
        "fixed_scan_structural_coverage_complete_for_this_edition": True,
        "all_narrative_pages_proofread_or_validated": False,
        "complete_product_searchable_ramcharitmanas_text": False,
        "all_ramcharitmanas_editions_recensions_commentaries_translations_and_traditions": False,
        "complete_ramayana_universe": False,
        "mvp_library_complete": False,
        "source_payloads_copied_into_app": False,
    }:
        raise RuntimeError("profile claim boundary drift")
    if plan.get("fixed_scan_reference") != {
        **scan_identity(),
        "title": "सटीक रामचरितमानस",
        "publisher": "Belvedere Press",
        "publication_place": "Prayag",
        "edition_statement": "Second edition; printed Vikram Samvat 1982; provider year values 1925 and 1926 retained separately",
        "rights_lane": "product_allowed_public_domain_scan",
        "payload_duplicated_by_this_acquisition": False,
    }:
        raise RuntimeError("fixed scan reference drift")


def fetch_frozen_batches(plan: dict) -> tuple[list[dict], list[dict]]:
    expected_rows = plan["wikisource"]["pages"]
    expected_by_revid = {row["revid"]: row for row in expected_rows}
    revids = [row["revid"] for row in expected_rows]
    carriers: list[dict] = []
    acquired: list[dict] = []
    for batch_number, offset in enumerate(range(0, len(revids), REVISION_BATCH_SIZE), start=1):
        batch = revids[offset : offset + REVISION_BATCH_SIZE]
        parsed, raw, metadata, url = fetch_json(
            {
                "action": "query",
                "format": "json",
                "formatversion": "2",
                "prop": "revisions|pageprops|info",
                "rvprop": "ids|timestamp|sha1|contentmodel|content",
                "rvslots": "main",
                "inprop": "url",
                "revids": "|".join(str(value) for value in batch),
            }
        )
        found: set[int] = set()
        for page in parsed.get("query", {}).get("pages", []):
            revision = latest_revision(page)
            revid = revision["revid"]
            expected = expected_by_revid.get(revid)
            if expected is None:
                raise RuntimeError(f"unexpected revision returned: {revid}")
            found.add(revid)
            quality_literal = (page.get("pageprops") or {}).get("proofread_page_quality_level")
            actual_identity = {
                "scan_page": page_number(page["title"]),
                "pageid": page["pageid"],
                "title": page["title"],
                "quality_level": int(quality_literal) if isinstance(quality_literal, str) and quality_literal.isdigit() else None,
                "revid": revid,
                "parentid": revision["parentid"],
                "timestamp": revision["timestamp"],
                "provider_sha1_hex": revision["sha1"],
                "contentmodel": revision["contentmodel"],
            }
            expected_identity = {key: expected[key] for key in actual_identity}
            if actual_identity != expected_identity:
                raise RuntimeError(f"frozen revision/page-quality identity mismatch for {page.get('title')}")
            content = revision_content(revision)
            if sha1_bytes(content) != expected["provider_sha1_hex"]:
                raise RuntimeError(f"provider/content SHA-1 mismatch for revision {revid}")
            acquired.append(
                {
                    **expected,
                    "content_bytes": len(content),
                    "content_sha256": sha256_bytes(content),
                }
            )
        if found != set(batch):
            raise RuntimeError(f"frozen revision batch mismatch expected={set(batch)} found={found}")
        carriers.append(
            {
                "name": f"ramcharitmanas-wikisource-revisions-batch-{batch_number:02d}.json",
                "source_url": url,
                "raw": raw,
                "http": metadata,
                "page_count": len(batch),
                "revision_ids": batch,
            }
        )
        if offset + REVISION_BATCH_SIZE < len(revids):
            time.sleep(REQUEST_INTERVAL_SECONDS)
    if len(acquired) != EXPECTED_PAGE_COUNT or len({row["revid"] for row in acquired}) != EXPECTED_PAGE_COUNT:
        raise RuntimeError("acquired revision universe is incomplete or duplicated")
    acquired.sort(key=lambda row: row["scan_page"])
    return carriers, acquired


def load_jsonl(path: Path) -> list[dict]:
    return [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line]


def vault_snapshot() -> dict:
    paths = {
        "summary": VAULT / "summary.json",
        "objects": VAULT / "objects.jsonl",
        "provenance": VAULT / "provenance-map.jsonl",
    }
    if any(not ordinary_file(path) for path in paths.values()):
        raise RuntimeError("source-vault control missing or unsafe")
    return {
        "summary_sha256": sha256_path(paths["summary"]),
        "objects_manifest_sha256": sha256_path(paths["objects"]),
        "provenance_map_sha256": sha256_path(paths["provenance"]),
        "summary": json.loads(paths["summary"].read_text(encoding="utf-8")),
    }


def store_carriers(carriers: list[dict], before: dict, retrieved_at: str) -> list[dict]:
    current = vault_snapshot()
    control_keys = ("summary_sha256", "objects_manifest_sha256", "provenance_map_sha256")
    if {key: current[key] for key in control_keys} != {key: before[key] for key in control_keys}:
        raise RuntimeError("source vault drifted before acquisition mutation")
    objects_path = VAULT / "objects.jsonl"
    provenance_path = VAULT / "provenance-map.jsonl"
    summary_path = VAULT / "summary.json"
    objects = load_jsonl(objects_path)
    provenance = load_jsonl(provenance_path)
    objects_by_hash = {row["sha256"]: row for row in objects}
    provenance_by_path = {row["source_path"]: row for row in provenance}
    stored: list[dict] = []

    for carrier in carriers:
        raw = carrier["raw"]
        digest = sha256_bytes(raw)
        byte_count = len(raw)
        object_relative = Path("objects/sha256") / digest[:2] / digest
        object_path = VAULT / object_relative
        object_path.parent.mkdir(parents=True, exist_ok=True)
        if object_path.exists():
            if not ordinary_file(object_path) or object_path.stat().st_size != byte_count or sha256_path(object_path) != digest:
                raise RuntimeError(f"existing vault object conflicts: {object_path}")
        else:
            staging = object_path.with_name(object_path.name + ".partial")
            if staging.exists():
                raise RuntimeError(f"unexpected vault staging file: {staging}")
            with staging.open("xb") as stream:
                stream.write(raw)
                stream.flush()
                os.fsync(stream.fileno())
            if not ordinary_file(staging) or staging.stat().st_size != byte_count or sha256_path(staging) != digest:
                raise RuntimeError(f"staged vault object verification failed: {staging}")
            os.replace(staging, object_path)
        expected_object = {
            "sha256": digest,
            "bytes": byte_count,
            "object_path": object_relative.as_posix(),
            "representative_name": carrier["name"],
        }
        existing_object = objects_by_hash.get(digest)
        if existing_object is not None and (
            existing_object["bytes"] != byte_count or existing_object["object_path"] != object_relative.as_posix()
        ):
            raise RuntimeError(f"content-addressed object collision: {digest}")
        if existing_object is None:
            objects.append(expected_object)
            objects_by_hash[digest] = expected_object
        source_path = f"acquisitions/wikisource/2026-08-08/ramcharitmanas-belvedere-1925/{carrier['name']}"
        provenance_record = {
            "source_path": source_path,
            "role": "canonical_acquisition",
            "name": carrier["name"],
            "suffix": ".json",
            "media_type": "application/json; charset=utf-8",
            "bytes": byte_count,
            "sha256": digest,
            "object_path": object_relative.as_posix(),
            "source_url": carrier["source_url"],
            "retrieved_at": retrieved_at,
            "rights_evidence": carrier["rights_evidence"],
        }
        existing_provenance = provenance_by_path.get(source_path)
        if existing_provenance is not None and existing_provenance != provenance_record:
            raise RuntimeError(f"source-vault provenance collision: {source_path}")
        if existing_provenance is None:
            provenance.append(provenance_record)
            provenance_by_path[source_path] = provenance_record
        stored.append(
            {
                "name": carrier["name"],
                "bytes": byte_count,
                "sha256": digest,
                "object_path": object_relative.as_posix(),
                "source_path": source_path,
                "source_url": carrier["source_url"],
                "page_count": carrier.get("page_count"),
                "revision_ids": carrier.get("revision_ids"),
            }
        )

    objects.sort(key=lambda row: row["sha256"])
    object_payload = b"".join(canonical_json(row) + b"\n" for row in objects)
    provenance_payload = b"".join(canonical_json(row) + b"\n" for row in provenance)
    summary = dict(before["summary"])
    summary.update(
        {
            "object_count": len(objects),
            "object_bytes": sum(row["bytes"] for row in objects),
            "provenance_path_records": len(provenance),
            "objects_manifest_sha256": sha256_bytes(object_payload),
            "provenance_map_sha256": sha256_bytes(provenance_payload),
            "role_counts": dict(sorted(Counter(row["role"] for row in provenance).items())),
        }
    )
    summary_payload = json.dumps(summary, ensure_ascii=False, indent=2, sort_keys=True).encode("utf-8") + b"\n"
    replace_bytes(objects_path, object_payload)
    replace_bytes(provenance_path, provenance_payload)
    replace_bytes(summary_path, summary_payload)
    return stored


def acquire() -> None:
    if not ordinary_file(PLAN):
        raise RuntimeError(f"acquisition profile missing or unsafe: {PLAN}")
    if REPORT.exists():
        raise RuntimeError(f"immutable acquisition report already exists: {REPORT}")
    plan = json.loads(PLAN.read_text(encoding="utf-8"))
    validate_profile(plan)
    subprocess.run([sys.executable, str(ROOT / "tools/lean_cleanup.py"), "verify"], cwd=ROOT, check=True)
    before = vault_snapshot()
    fetched, acquired_rows = fetch_frozen_batches(plan)
    rights, rights_raw, rights_http, rights_url = fetch_json(
        {"action": "query", "format": "json", "formatversion": "2", "meta": "siteinfo", "siprop": "rightsinfo"}
    )
    rightsinfo = rights.get("query", {}).get("rightsinfo", {})
    if rightsinfo != {"url": SITE_LICENSE_URL, "text": SITE_LICENSE_LITERAL}:
        raise RuntimeError(f"Hindi Wikisource rights drift at acquisition: {rightsinfo}")
    retrieved_at = datetime.now(timezone.utc).isoformat()
    carriers: list[dict] = []
    for item in fetched:
        carriers.append(
            {
                **item,
                "rights_evidence": {
                    "provider": "Hindi Wikisource",
                    "lane": "mixed_by_page_quality",
                    "provider_license_literal": SITE_LICENSE_LITERAL,
                    "provider_license_url": SITE_LICENSE_URL,
                    "license_family_url": LICENSE_FAMILY_URL,
                    "proofread_or_validated_pages_product_candidate": True,
                    "unproofread_or_empty_pages_internal_correction_only": True,
                    "revision_ids": item["revision_ids"],
                },
            }
        )
    carriers.append(
        {
            "name": "ramcharitmanas-wikisource-site-rights.json",
            "source_url": rights_url,
            "raw": rights_raw,
            "http": rights_http,
            "page_count": None,
            "revision_ids": None,
            "rights_evidence": {
                "provider": "Hindi Wikisource",
                "lane": "technical_rights_evidence",
                "provider_license_literal": SITE_LICENSE_LITERAL,
                "provider_license_url": SITE_LICENSE_URL,
                "license_family_url": LICENSE_FAMILY_URL,
                "applies_to_revision_json_carriers": True,
            },
        }
    )
    stored = store_carriers(carriers, before, retrieved_at)
    after = vault_snapshot()
    narrative_rows = [
        row for row in acquired_rows if NARRATIVE_START <= row["scan_page"] <= NARRATIVE_END
    ]
    report = {
        "contract": "DEVAM_RAMCHARITMANAS_WIKISOURCE_PAGE_ACQUISITION_REPORT_V1",
        "result": "PASS",
        "profile_id": plan["profile_id"],
        "plan_path": PLAN.relative_to(ROOT).as_posix(),
        "plan_sha256": sha256_path(PLAN),
        "retrieved_at": retrieved_at,
        "page_count": len(acquired_rows),
        "narrative_page_count": len(narrative_rows),
        "quality_counts": plan["wikisource"]["quality_counts"],
        "narrative_quality_counts": plan["wikisource"]["narrative_quality_counts"],
        "product_candidate_page_count": plan["wikisource"]["product_candidate_page_count"],
        "correction_required_page_count": plan["wikisource"]["correction_required_page_count"],
        "content_bytes": sum(row["content_bytes"] for row in acquired_rows),
        "pages": [
            {
                "scan_page": row["scan_page"],
                "revid": row["revid"],
                "content_bytes": row["content_bytes"],
                "content_sha256": row["content_sha256"],
            }
            for row in acquired_rows
        ],
        "stored_objects": stored,
        "site_rights": {
            "rightsinfo": rightsinfo,
            "url": rights_url,
            **rights_http,
            "response_bytes": len(rights_raw),
            "response_sha256": sha256_bytes(rights_raw),
        },
        "fixed_scan_reference": plan["fixed_scan_reference"],
        "source_vault_before": {
            key: before[key]
            for key in ("summary_sha256", "objects_manifest_sha256", "provenance_map_sha256")
        },
        "source_vault_after": {
            key: after[key]
            for key in ("summary_sha256", "objects_manifest_sha256", "provenance_map_sha256")
        },
        "source_payloads_copied_into_app": False,
        "complete_product_searchable_ramcharitmanas_text": False,
        "next_boundary": "Build a page-addressed product packet from quality 3/4 pages and correct the remaining 359 narrative pages against the fixed scan before claiming a complete searchable text.",
    }
    write_json_exclusive(REPORT, report)
    verify()
    print(
        json.dumps(
            {
                "result": "PASS",
                "profile_id": plan["profile_id"],
                "report": REPORT.relative_to(ROOT).as_posix(),
                "report_sha256": sha256_path(REPORT),
                "stored_objects": len(stored),
                "stored_object_bytes": sum(row["bytes"] for row in stored),
                "pages": len(acquired_rows),
                "product_candidate_pages": report["product_candidate_page_count"],
                "correction_required_pages": report["correction_required_page_count"],
            },
            ensure_ascii=False,
            indent=2,
        )
    )


def verify() -> None:
    if not ordinary_file(PLAN) or not ordinary_file(REPORT):
        raise RuntimeError("acquisition profile/report missing or unsafe")
    plan = json.loads(PLAN.read_text(encoding="utf-8"))
    report = json.loads(REPORT.read_text(encoding="utf-8"))
    validate_profile(plan)
    if report.get("contract") != "DEVAM_RAMCHARITMANAS_WIKISOURCE_PAGE_ACQUISITION_REPORT_V1":
        raise RuntimeError("unexpected acquisition report contract")
    if report.get("result") != "PASS" or report.get("profile_id") != plan.get("profile_id"):
        raise RuntimeError("profile/report identity mismatch")
    if report.get("plan_sha256") != sha256_path(PLAN):
        raise RuntimeError("profile hash mismatch")
    if report.get("source_payloads_copied_into_app") is not False:
        raise RuntimeError("app payload-copy denial missing")
    if report.get("complete_product_searchable_ramcharitmanas_text") is not False:
        raise RuntimeError("complete product text must remain false")
    expected_rows = plan["wikisource"]["pages"]
    expected_by_revid = {row["revid"]: row for row in expected_rows}
    provenance = load_jsonl(VAULT / "provenance-map.jsonl")
    actual_by_revid: dict[int, dict] = {}
    rights_seen = False
    for stored in report.get("stored_objects", []):
        path = VAULT / stored["object_path"]
        if not ordinary_file(path) or path.stat().st_size != stored["bytes"] or sha256_path(path) != stored["sha256"]:
            raise RuntimeError(f"stored source object mismatch: {path}")
        if not any(
            row.get("source_path") == stored["source_path"] and row.get("sha256") == stored["sha256"]
            for row in provenance
        ):
            raise RuntimeError(f"stored source provenance missing: {stored['source_path']}")
        parsed = json.loads(path.read_bytes())
        if stored["name"].startswith("ramcharitmanas-wikisource-revisions-batch-"):
            for page in parsed.get("query", {}).get("pages", []):
                revision = latest_revision(page)
                content = revision_content(revision)
                if sha1_bytes(content) != revision["sha1"]:
                    raise RuntimeError(f"stored revision SHA-1 mismatch: {revision['revid']}")
                if revision["revid"] in actual_by_revid:
                    raise RuntimeError(f"stored revision duplicated: {revision['revid']}")
                actual_by_revid[revision["revid"]] = {
                    "scan_page": page_number(page["title"]),
                    "pageid": page["pageid"],
                    "title": page["title"],
                    "content_bytes": len(content),
                    "content_sha256": sha256_bytes(content),
                }
        elif stored["name"] == "ramcharitmanas-wikisource-site-rights.json":
            if parsed.get("query", {}).get("rightsinfo") != {
                "url": SITE_LICENSE_URL,
                "text": SITE_LICENSE_LITERAL,
            }:
                raise RuntimeError("stored Hindi Wikisource rights evidence mismatch")
            rights_seen = True
        else:
            raise RuntimeError(f"unexpected stored acquisition carrier: {stored['name']}")
    if set(actual_by_revid) != set(expected_by_revid) or not rights_seen:
        raise RuntimeError("stored revision or rights carrier universe mismatch")
    report_by_revid = {row["revid"]: row for row in report.get("pages", [])}
    if set(report_by_revid) != set(expected_by_revid):
        raise RuntimeError("acquisition report revision universe mismatch")
    for revid, expected in expected_by_revid.items():
        actual = actual_by_revid[revid]
        report_row = report_by_revid[revid]
        if {
            "scan_page": actual["scan_page"],
            "revid": revid,
            "content_bytes": actual["content_bytes"],
            "content_sha256": actual["content_sha256"],
        } != report_row:
            raise RuntimeError(f"stored/report content identity mismatch: {revid}")
        if actual["scan_page"] != expected["scan_page"] or actual["pageid"] != expected["pageid"] or actual["title"] != expected["title"]:
            raise RuntimeError(f"stored/profile page identity mismatch: {revid}")
    if report.get("page_count") != EXPECTED_PAGE_COUNT or report.get("narrative_page_count") != NARRATIVE_END - NARRATIVE_START + 1:
        raise RuntimeError("acquisition report page counts mismatch")
    if report.get("quality_counts") != {str(key): value for key, value in EXPECTED_QUALITY_COUNTS.items()}:
        raise RuntimeError("acquisition report quality counts mismatch")
    if report.get("narrative_quality_counts") != {
        str(key): value for key, value in EXPECTED_NARRATIVE_QUALITY_COUNTS.items()
    }:
        raise RuntimeError("acquisition report narrative quality counts mismatch")
    if report.get("product_candidate_page_count") != 813 or report.get("correction_required_page_count") != 359:
        raise RuntimeError("acquisition report product/correction split mismatch")
    scan_identity()
    subprocess.run([sys.executable, str(ROOT / "tools/lean_cleanup.py"), "verify"], cwd=ROOT, check=True)
    print(
        json.dumps(
            {
                "result": "PASS",
                "profile_id": plan["profile_id"],
                "stored_objects": len(report["stored_objects"]),
                "pages": len(actual_by_revid),
                "product_candidate_pages": report["product_candidate_page_count"],
                "correction_required_pages": report["correction_required_page_count"],
                "complete_product_text": False,
            },
            ensure_ascii=False,
            indent=2,
        )
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=("profile", "acquire", "verify"))
    args = parser.parse_args()
    if ROOT != Path(r"C:\Work\Code\sanatan_knowledge_graph").resolve():
        raise RuntimeError(f"unexpected workspace root: {ROOT}")
    if args.action == "profile":
        profile()
    elif args.action == "acquire":
        acquire()
    else:
        verify()


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f"ERROR: {error}", file=sys.stderr)
        raise

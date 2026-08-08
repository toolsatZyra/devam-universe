#!/usr/bin/env python3
"""Acquire the bounded Ganesha Purana source pair into Devam's lean vault.

The product lane is the complete Sanskrit Wikisource transcription at exact
revisions.  The fixed Nag Publishers 1993 scan is retained separately as an
internal-only edition witness.  No source payload is copied into the web app.
"""

from __future__ import annotations

import argparse
import base64
import hashlib
import json
import os
import re
import shutil
import stat
import subprocess
import sys
import tempfile
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlencode


ROOT = Path(__file__).resolve().parents[1]
VAULT = ROOT / "source_vault"
PLAN = ROOT / "ingestion/plans/ganesha-purana-wikisource-sanskrit-v1.json"
REPORT = ROOT / "ingestion/reports/ganesha-purana-wikisource-sanskrit-v1.json"
FIXED_SCAN = ROOT / "tmp/ganesha-purana-gpn-preflight.pdf"
NODE = Path(
    r"C:\Users\shiba\.cache\codex-runtimes\codex-primary-runtime"
    r"\dependencies\node\bin\node.exe"
)

API = "https://sa.wikisource.org/w/api.php"
WORK_TITLE = "गणेशपुराणम्"
UPASANA_TITLE = f"{WORK_TITLE}/खण्डः १(उपासनाखण्डम्)"
KRIDA_TITLE = f"{WORK_TITLE}/खण्डः २(क्रीडाखण्डम्)"
SITE_LICENSE_LITERAL = "Creative Commons Attribution-Share Alike 4.0"
SITE_LICENSE_URL = "https://creativecommons.org/licenses/by-sa/4.0/deed.sa"
LICENSE_FAMILY_URL = "https://creativecommons.org/licenses/by-sa/4.0/"
SCAN_URL = "https://sanskritdocuments.org/scannedbooks/forencoding/DONE/GPN.pdf"
METADATA_TITLE_BATCH_SIZE = 50
SCAN_SHA256 = "aa6972405a88b34fa8db38dc07793424656961527149c36e80c0e100965245a5"
SCAN_BYTES = 46_157_686

DEVANAGARI_DIGITS = str.maketrans("०१२३४५६७८९", "0123456789")
CHAPTER_RE = re.compile(r"/अध्याय(?P<plural>ाः|ः)\s+(?P<start>[०-९]+)(?:-(?P<end>[०-९]+))?$")


def canonical_json(value: object) -> bytes:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def sha256_path(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(8 * 1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def ordinary_file(path: Path) -> bool:
    st = path.lstat()
    return (
        stat.S_ISREG(st.st_mode)
        and not stat.S_ISLNK(st.st_mode)
        and not bool(getattr(st, "st_file_attributes", 0) & 0x400)
    )


def safe_parent(path: Path) -> None:
    resolved_root = ROOT.resolve()
    parent = path.parent
    existing = parent
    while not existing.exists():
        existing = existing.parent
    if not existing.resolve().is_relative_to(resolved_root):
        raise RuntimeError(f"output parent escapes workspace: {path}")
    cursor = existing
    while cursor != resolved_root:
        st = cursor.lstat()
        if not stat.S_ISDIR(st.st_mode) or stat.S_ISLNK(st.st_mode) or bool(
            getattr(st, "st_file_attributes", 0) & 0x400
        ):
            raise RuntimeError(f"unsafe output ancestor: {cursor}")
        cursor = cursor.parent


def write_json_exclusive(path: Path, value: object) -> None:
    safe_parent(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("xb") as stream:
        stream.write(json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True).encode("utf-8") + b"\n")


def replace_bytes(path: Path, value: bytes) -> None:
    safe_parent(path)
    fd, name = tempfile.mkstemp(prefix=path.name + ".", suffix=".tmp", dir=path.parent)
    try:
        with os.fdopen(fd, "wb") as stream:
            stream.write(value)
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(name, path)
    finally:
        if os.path.exists(name):
            os.unlink(name)


def node_fetch(url: str, *, method: str = "GET", body: str | None = None) -> tuple[bytes, dict]:
    if not ordinary_file(NODE):
        raise RuntimeError(f"bundled Node runtime missing or unsafe: {NODE}")
    script = r"""
const url = process.argv[1];
const method = process.argv[2];
const body = process.argv[3] || undefined;
const response = await fetch(url, {
  method,
  redirect: "follow",
  headers: {
    "User-Agent": "Devam/0.1 source-acquisition (local research)",
    ...(body ? {"Content-Type": "application/x-www-form-urlencoded"} : {})
  },
  ...(body ? {body} : {})
});
const bytes = Buffer.from(await response.arrayBuffer());
process.stderr.write(JSON.stringify({status: response.status, final_url: response.url, bytes: bytes.length}) + "\n");
process.stdout.write(bytes);
"""
    proc = subprocess.run(
        [str(NODE), "-e", script, url, method, body or ""],
        check=False,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    if proc.returncode != 0:
        raise RuntimeError(f"normal-TLS Node fetch failed: {proc.stderr.decode('utf-8', 'replace')}")
    lines = proc.stderr.decode("utf-8").strip().splitlines()
    if len(lines) != 1:
        raise RuntimeError(f"unexpected Node fetch diagnostics: {lines!r}")
    meta = json.loads(lines[0])
    if meta != {"status": 200, "final_url": url, "bytes": len(proc.stdout)}:
        raise RuntimeError(f"fetch identity/status mismatch: {meta}")
    return proc.stdout, meta


def api_url(params: dict[str, str]) -> str:
    return API + "?" + urlencode(params)


def fetch_json(params: dict[str, str], *, method: str = "GET") -> tuple[dict, bytes, dict, str]:
    if method == "GET":
        url = api_url(params)
        body = None
    elif method == "POST":
        url = API
        body = urlencode(params)
    else:
        raise RuntimeError(f"unsupported fetch method: {method}")
    raw, meta = node_fetch(url, method=method, body=body)
    meta = {**meta, "request_method": method}
    if body is not None:
        body_bytes = body.encode("utf-8")
        meta.update(
            {
                "request_body_bytes": len(body_bytes),
                "request_body_sha256": sha256_bytes(body_bytes),
            }
        )
    try:
        parsed = json.loads(raw)
    except Exception as exc:
        raise RuntimeError(f"provider returned invalid JSON for {url}") from exc
    if "error" in parsed:
        raise RuntimeError(f"provider API error: {parsed['error']}")
    return parsed, raw, meta, url


def latest_revision(page: dict) -> dict:
    revisions = page.get("revisions") or []
    if len(revisions) != 1:
        raise RuntimeError(f"expected one revision for {page.get('title')}")
    revision = dict(revisions[0])
    required = {"revid", "parentid", "timestamp", "sha1"}
    if not required.issubset(revision):
        raise RuntimeError(f"revision metadata incomplete for {page.get('title')}")
    contentmodel = revision.get("contentmodel")
    if not isinstance(contentmodel, str):
        contentmodel = (revision.get("slots") or {}).get("main", {}).get("contentmodel")
    if not isinstance(contentmodel, str):
        raise RuntimeError(f"revision content model missing for {page.get('title')}")
    revision["contentmodel"] = contentmodel
    return revision


def direct_links(page: dict, parent_title: str) -> list[str]:
    prefix = parent_title + "/"
    depth = parent_title.count("/") + 1
    return sorted(
        {
            link["title"]
            for link in page.get("links", [])
            if link.get("ns") == 0
            and link.get("title", "").startswith(prefix)
            and link["title"].count("/") == depth
        }
    )


def chapter_span(title: str) -> tuple[int, int]:
    match = CHAPTER_RE.search(title)
    if not match:
        raise RuntimeError(f"unrecognized canonical chapter page: {title}")
    start = int(match.group("start").translate(DEVANAGARI_DIGITS))
    end = int((match.group("end") or match.group("start")).translate(DEVANAGARI_DIGITS))
    if start < 1 or end < start:
        raise RuntimeError(f"invalid chapter range: {title}")
    return start, end


def validate_coverage(titles: list[str], expected_end: int, label: str) -> list[dict]:
    spans = []
    chapters: list[int] = []
    for title in titles:
        start, end = chapter_span(title)
        spans.append({"title": title, "chapter_start": start, "chapter_end": end})
        chapters.extend(range(start, end + 1))
    spans.sort(key=lambda item: (item["chapter_start"], item["chapter_end"], item["title"]))
    if chapters and sorted(chapters) != list(range(1, expected_end + 1)):
        counts = Counter(chapters)
        missing = [n for n in range(1, expected_end + 1) if counts[n] == 0]
        duplicated = [n for n, count in counts.items() if count > 1]
        raise RuntimeError(f"{label} chapter coverage mismatch missing={missing} duplicated={duplicated}")
    if not chapters:
        raise RuntimeError(f"{label} chapter universe is empty")
    return spans


def metadata_rows(titles: list[str]) -> tuple[list[dict], list[dict]]:
    rows = []
    observations = []
    # Sanskrit titles percent-encode to long URLs. Use bounded POST batches to
    # avoid request-line limits and excessive provider request counts.
    for offset in range(0, len(titles), METADATA_TITLE_BATCH_SIZE):
        batch = titles[offset : offset + METADATA_TITLE_BATCH_SIZE]
        parsed, raw, meta, url = fetch_json(
            {
                "action": "query",
                "format": "json",
                "formatversion": "2",
                "prop": "revisions|info",
                "rvprop": "ids|timestamp|sha1|contentmodel",
                "inprop": "url",
                "titles": "|".join(batch),
            },
            method="POST",
        )
        observations.append(
            {"url": url, **meta, "response_sha256": sha256_bytes(raw), "response_bytes": len(raw)}
        )
        pages = parsed.get("query", {}).get("pages", [])
        if len(pages) != len(batch):
            raise RuntimeError(f"metadata batch page count mismatch: {len(pages)} != {len(batch)}")
        for page in pages:
            if page.get("missing") is not None or page.get("invalid") is not None:
                raise RuntimeError(f"missing/invalid canonical page: {page}")
            revision = latest_revision(page)
            rows.append(
                {
                    "pageid": page["pageid"],
                    "ns": page["ns"],
                    "title": page["title"],
                    "fullurl": page["fullurl"],
                    "revid": revision["revid"],
                    "parentid": revision["parentid"],
                    "timestamp": revision["timestamp"],
                    "provider_sha1_hex": revision["sha1"],
                    "contentmodel": revision["contentmodel"],
                }
            )
    if {row["title"] for row in rows} != set(titles):
        raise RuntimeError("metadata title identity mismatch")
    return rows, observations


def profile() -> None:
    if PLAN.exists():
        raise RuntimeError(f"profile already exists: {PLAN}")
    if not ordinary_file(FIXED_SCAN):
        raise RuntimeError(f"fixed scan missing or unsafe: {FIXED_SCAN}")
    if FIXED_SCAN.stat().st_size != SCAN_BYTES or sha256_path(FIXED_SCAN) != SCAN_SHA256:
        raise RuntimeError("fixed scan byte/hash identity mismatch")

    rights, rights_raw, rights_meta, rights_url = fetch_json(
        {
            "action": "query",
            "format": "json",
            "formatversion": "2",
            "meta": "siteinfo",
            "siprop": "rightsinfo",
        }
    )
    rightsinfo = rights.get("query", {}).get("rightsinfo", {})
    if rightsinfo.get("text") != SITE_LICENSE_LITERAL or rightsinfo.get("url") != SITE_LICENSE_URL:
        raise RuntimeError(f"unexpected Wikisource rights info: {rightsinfo}")

    roots, roots_raw, roots_meta, roots_url = fetch_json(
        {
            "action": "query",
            "format": "json",
            "formatversion": "2",
            "prop": "links|revisions|info",
            "pllimit": "max",
            "rvprop": "ids|timestamp|sha1|contentmodel",
            "inprop": "url",
            "titles": "|".join([WORK_TITLE, UPASANA_TITLE, KRIDA_TITLE]),
        }
    )
    pages_by_title = {page["title"]: page for page in roots.get("query", {}).get("pages", [])}
    if set(pages_by_title) != {WORK_TITLE, UPASANA_TITLE, KRIDA_TITLE}:
        raise RuntimeError(f"root page identity mismatch: {sorted(pages_by_title)}")
    work_children = direct_links(pages_by_title[WORK_TITLE], WORK_TITLE)
    if work_children != sorted([UPASANA_TITLE, KRIDA_TITLE]):
        raise RuntimeError(f"unexpected work-root child universe: {work_children}")

    upasana_children = direct_links(pages_by_title[UPASANA_TITLE], UPASANA_TITLE)
    krida_children = direct_links(pages_by_title[KRIDA_TITLE], KRIDA_TITLE)
    upasana_spans = validate_coverage(upasana_children, 92, "upasana")
    krida_spans = validate_coverage(krida_children, 155, "krida")
    if len(upasana_children) != 31 or len(krida_children) != 31:
        raise RuntimeError("canonical navigation must expose exactly 31 chapter pages per khanda")

    ordered_titles = [WORK_TITLE, UPASANA_TITLE]
    ordered_titles.extend(item["title"] for item in upasana_spans)
    ordered_titles.append(KRIDA_TITLE)
    ordered_titles.extend(item["title"] for item in krida_spans)
    if len(ordered_titles) != 65 or len(set(ordered_titles)) != 65:
        raise RuntimeError("expected exactly 65 unique canonical Wikisource pages")
    rows, metadata_observations = metadata_rows(ordered_titles)
    row_by_title = {row["title"]: row for row in rows}
    ordered_rows = [row_by_title[title] for title in ordered_titles]

    plan = {
        "contract": "DEVAM_GANESHA_PURANA_SOURCE_ACQUISITION_V1",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "work": "Ganesha Purana",
        "language": "Sanskrit",
        "script": "Devanagari",
        "route": "Ganesha MVP hero and exhaustive Devam library",
        "source_pair": {
            "wikisource_product_lane": {
                "provider": "Sanskrit Wikisource",
                "site": "https://sa.wikisource.org/",
                "work_title": WORK_TITLE,
                "provider_license_literal": SITE_LICENSE_LITERAL,
                "provider_license_url": SITE_LICENSE_URL,
                "license_family_url": LICENSE_FAMILY_URL,
                "rights_lane": "product_allowed_with_attribution_and_share_alike_compliance",
                "source_identity_boundary": "complete two-khanda Sanskrit Wikisource digital transcription at exact revisions; underlying print edition and textual recension unidentified",
                "translation_included": False,
                "underlying_traditional_text_public_domain_assumption_used_for_product_clearance": False,
                "canonical_page_count": 65,
                "upasana_chapters": 92,
                "krida_chapters": 155,
                "canonical_pages": ordered_rows,
                "canonical_spans": {"upasana": upasana_spans, "krida": krida_spans},
            },
            "nag_1993_scan_internal_lane": {
                "provider": "SanskritDocuments scan lead",
                "source_url": SCAN_URL,
                "local_path": FIXED_SCAN.relative_to(ROOT).as_posix(),
                "bytes": SCAN_BYTES,
                "sha256": SCAN_SHA256,
                "pdf_pages": 693,
                "edition": "Nag Publishers reprint, Delhi, 1993",
                "isbn": "81-7081-279-8",
                "rights_literal": "© NAG PUBLISHERS",
                "rights_lane": "internal_only",
                "product_text_or_image_serving": False,
                "visual_structure": {
                    "upasana_chapter_92_terminal_pdf_page": 264,
                    "upasana_terminal_card_pdf_page": 265,
                    "krida_title_pdf_page": 266,
                    "krida_chapter_1_start_pdf_page": 267,
                    "krida_chapter_155_terminal_pdf_page": 690,
                    "krida_terminal_card_pdf_page": 691,
                    "publisher_page_pdf_page": 692,
                    "title_page_pdf_page": 693,
                },
            },
        },
        "observations": {
            "site_rights": {
                "url": rights_url,
                **rights_meta,
                "response_sha256": sha256_bytes(rights_raw),
                "response_bytes": len(rights_raw),
                "rightsinfo": rightsinfo,
            },
            "canonical_navigation": {
                "url": roots_url,
                **roots_meta,
                "response_sha256": sha256_bytes(roots_raw),
                "response_bytes": len(roots_raw),
            },
            "metadata_batches": metadata_observations,
        },
        "claims": {
            "wikisource_structural_coverage_complete_for_exact_canonical_page_universe": True,
            "wikisource_underlying_print_edition_identified": False,
            "wikisource_textual_recension_identified": False,
            "nag_1993_scan_product_cleared": False,
            "english_translation_included": False,
            "hindi_translation_included": False,
            "mudgala_purana_included": False,
            "all_ganesha_literature_complete": False,
        },
    }
    plan["profile_id"] = "GANESHA-PURANA-WIKISOURCE-" + sha256_bytes(canonical_json(plan))[:24].upper()
    write_json_exclusive(PLAN, plan)
    print(json.dumps({"result": "PASS", "profile_id": plan["profile_id"], "plan": PLAN.relative_to(ROOT).as_posix(), "plan_sha256": sha256_path(PLAN), "canonical_pages": 65, "chapters": 247}, ensure_ascii=False, indent=2))


def decode_revision_content(revision: dict) -> bytes:
    slots = revision.get("slots") or {}
    main = slots.get("main") or {}
    content = main.get("content")
    if not isinstance(content, str):
        raise RuntimeError("revision content missing")
    return content.encode("utf-8")


def sha1_hex(value: bytes) -> str:
    return hashlib.sha1(value).hexdigest()


def fetch_frozen_batches(plan: dict) -> tuple[list[dict], list[dict]]:
    expected = plan["source_pair"]["wikisource_product_lane"]["canonical_pages"]
    expected_by_revid = {row["revid"]: row for row in expected}
    carriers = []
    acquired_rows = []
    revids = [row["revid"] for row in expected]
    for index, offset in enumerate(range(0, len(revids), 50), start=1):
        batch = revids[offset : offset + 50]
        parsed, raw, meta, url = fetch_json(
            {
                "action": "query",
                "format": "json",
                "formatversion": "2",
                "prop": "revisions|info",
                "rvprop": "ids|timestamp|sha1|contentmodel|content",
                "rvslots": "main",
                "inprop": "url",
                "revids": "|".join(str(value) for value in batch),
            }
        )
        pages = parsed.get("query", {}).get("pages", [])
        found = set()
        for page in pages:
            revision = latest_revision(page)
            revid = revision["revid"]
            found.add(revid)
            expected_row = expected_by_revid.get(revid)
            if expected_row is None or page["title"] != expected_row["title"] or page["pageid"] != expected_row["pageid"]:
                raise RuntimeError(f"frozen revision identity mismatch: {page.get('title')} {revid}")
            if revision["contentmodel"] != expected_row["contentmodel"]:
                raise RuntimeError(f"frozen revision content-model mismatch for revision {revid}")
            content = decode_revision_content(revision)
            if sha1_hex(content) != expected_row["provider_sha1_hex"] or revision["sha1"] != expected_row["provider_sha1_hex"]:
                raise RuntimeError(f"provider/content SHA-1 mismatch for revision {revid}")
            acquired_rows.append({**expected_row, "content_bytes": len(content), "content_sha256": sha256_bytes(content)})
        if found != set(batch):
            raise RuntimeError(f"frozen revision batch mismatch: expected={set(batch)} found={found}")
        carriers.append(
            {
                "name": f"ganesha-purana-wikisource-revisions-batch-{index}.json",
                "source_url": url,
                "raw": raw,
                "http": meta,
                "page_count": len(batch),
                "revision_ids": batch,
                "rights_lane": "product_allowed_with_attribution_and_share_alike_compliance",
            }
        )
    if len(acquired_rows) != 65:
        raise RuntimeError("expected 65 acquired Wikisource revision records")
    return carriers, acquired_rows


def vault_snapshot() -> dict:
    summary = VAULT / "summary.json"
    objects = VAULT / "objects.jsonl"
    provenance = VAULT / "provenance-map.jsonl"
    for path in (summary, objects, provenance):
        if not ordinary_file(path):
            raise RuntimeError(f"vault control missing or unsafe: {path}")
    return {
        "summary_sha256": sha256_path(summary),
        "objects_manifest_sha256": sha256_path(objects),
        "provenance_map_sha256": sha256_path(provenance),
        "summary": json.loads(summary.read_text(encoding="utf-8")),
    }


def load_jsonl(path: Path) -> list[dict]:
    return [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line]


def store_carriers(carriers: list[dict], before: dict) -> list[dict]:
    current = vault_snapshot()
    if {k: current[k] for k in ("summary_sha256", "objects_manifest_sha256", "provenance_map_sha256")} != {k: before[k] for k in ("summary_sha256", "objects_manifest_sha256", "provenance_map_sha256")}:
        raise RuntimeError("source vault drifted before mutation")

    objects_path = VAULT / "objects.jsonl"
    provenance_path = VAULT / "provenance-map.jsonl"
    summary_path = VAULT / "summary.json"
    objects = load_jsonl(objects_path)
    provenance = load_jsonl(provenance_path)
    objects_by_hash = {row["sha256"]: row for row in objects}
    stored = []

    for carrier in carriers:
        raw = carrier.pop("raw")
        digest = sha256_bytes(raw)
        size = len(raw)
        object_rel = Path("objects/sha256") / digest[:2] / digest
        object_path = VAULT / object_rel
        object_path.parent.mkdir(parents=True, exist_ok=True)
        if object_path.exists():
            if not ordinary_file(object_path) or object_path.stat().st_size != size or sha256_path(object_path) != digest:
                raise RuntimeError(f"existing object conflicts with carrier: {object_path}")
        else:
            temp = object_path.with_name(object_path.name + ".partial")
            if temp.exists():
                raise RuntimeError(f"unexpected object staging file: {temp}")
            with temp.open("xb") as stream:
                stream.write(raw)
                stream.flush()
                os.fsync(stream.fileno())
            if temp.stat().st_size != size or sha256_path(temp) != digest:
                raise RuntimeError(f"staged object verification failed: {temp}")
            os.replace(temp, object_path)
        if object_path.stat().st_nlink != 1:
            raise RuntimeError(f"hardlinked vault object rejected: {object_path}")
        if digest not in objects_by_hash:
            row = {"sha256": digest, "bytes": size, "object_path": object_rel.as_posix(), "representative_name": carrier["name"]}
            objects.append(row)
            objects_by_hash[digest] = row
        source_path = f"acquisitions/wikisource/2026-08-08/ganesha-purana/{carrier['name']}" if carrier["kind"] == "wikisource" else f"acquisitions/sanskritdocuments/2026-08-08/ganesha-purana/{carrier['name']}"
        provenance_record = {
            "source_path": source_path,
            "role": "canonical_acquisition",
            "name": carrier["name"],
            "suffix": Path(carrier["name"]).suffix.casefold(),
            "media_type": carrier["media_type"],
            "bytes": size,
            "sha256": digest,
            "object_path": object_rel.as_posix(),
            "source_url": carrier["source_url"],
            "retrieved_at": carrier["retrieved_at"],
            "rights_evidence": carrier["rights_evidence"],
        }
        if not any(row.get("source_path") == source_path and row.get("sha256") == digest for row in provenance):
            provenance.append(provenance_record)
        stored.append({**{key: value for key, value in carrier.items() if key not in {"http"}}, "bytes": size, "sha256": digest, "object_path": object_rel.as_posix(), "source_path": source_path})

    objects.sort(key=lambda row: row["sha256"])
    object_bytes = sum(row["bytes"] for row in objects)
    object_data = b"".join(canonical_json(row) + b"\n" for row in objects)
    provenance_data = b"".join(canonical_json(row) + b"\n" for row in provenance)
    summary = dict(before["summary"])
    summary["object_count"] = len(objects)
    summary["object_bytes"] = object_bytes
    summary["provenance_path_records"] = len(provenance)
    role_counts = Counter(row["role"] for row in provenance)
    summary["role_counts"] = dict(sorted(role_counts.items()))
    summary["objects_manifest_sha256"] = sha256_bytes(object_data)
    summary["provenance_map_sha256"] = sha256_bytes(provenance_data)
    summary_data = json.dumps(summary, ensure_ascii=False, indent=2, sort_keys=True).encode("utf-8") + b"\n"

    replace_bytes(objects_path, object_data)
    replace_bytes(provenance_path, provenance_data)
    replace_bytes(summary_path, summary_data)
    return stored


def acquire() -> None:
    if not ordinary_file(PLAN):
        raise RuntimeError(f"profile missing or unsafe: {PLAN}")
    if REPORT.exists():
        raise RuntimeError(f"acquisition report already exists: {REPORT}")
    plan = json.loads(PLAN.read_text(encoding="utf-8"))
    if plan.get("contract") != "DEVAM_GANESHA_PURANA_SOURCE_ACQUISITION_V1":
        raise RuntimeError("unexpected acquisition plan contract")
    if not ordinary_file(FIXED_SCAN) or FIXED_SCAN.stat().st_size != SCAN_BYTES or sha256_path(FIXED_SCAN) != SCAN_SHA256:
        raise RuntimeError("fixed scan drift before vault retention")

    subprocess.run([sys.executable, str(ROOT / "tools/lean_cleanup.py"), "verify"], cwd=ROOT, check=True)
    before = vault_snapshot()
    fetched, acquired_rows = fetch_frozen_batches(plan)
    rights_parsed, rights_raw, rights_http, rights_url = fetch_json(
        {"action": "query", "format": "json", "formatversion": "2", "meta": "siteinfo", "siprop": "rightsinfo"}
    )
    rightsinfo = rights_parsed.get("query", {}).get("rightsinfo", {})
    if rightsinfo.get("text") != SITE_LICENSE_LITERAL or rightsinfo.get("url") != SITE_LICENSE_URL:
        raise RuntimeError("Wikisource rights drift at acquisition")
    retrieved_at = datetime.now(timezone.utc).isoformat()
    carriers = []
    for item in fetched:
        carriers.append(
            {
                **item,
                "kind": "wikisource",
                "media_type": "application/json; charset=utf-8",
                "retrieved_at": retrieved_at,
                "rights_evidence": {
                    "provider": "Sanskrit Wikisource",
                    "lane": "product_allowed_with_attribution_and_share_alike_compliance",
                    "provider_license_literal": SITE_LICENSE_LITERAL,
                    "provider_license_url": SITE_LICENSE_URL,
                    "license_family_url": LICENSE_FAMILY_URL,
                    "canonical_page_count": 65,
                    "source_identity_boundary": "complete two-khanda Sanskrit Wikisource digital transcription at exact revisions; underlying print edition and textual recension unidentified",
                    "underlying_traditional_text_public_domain_assumption_used_for_product_clearance": False,
                    "translation_included": False,
                    "revision_ids": item["revision_ids"],
                },
            }
        )
    carriers.append(
        {
            "name": "ganesha-purana-wikisource-site-rights.json",
            "source_url": rights_url,
            "raw": rights_raw,
            "http": rights_http,
            "kind": "wikisource",
            "media_type": "application/json; charset=utf-8",
            "retrieved_at": retrieved_at,
            "rights_evidence": {
                "provider": "Sanskrit Wikisource",
                "lane": "technical_rights_evidence",
                "provider_license_literal": SITE_LICENSE_LITERAL,
                "provider_license_url": SITE_LICENSE_URL,
                "license_family_url": LICENSE_FAMILY_URL,
                "applies_to_product_transcription_carriers": True,
            },
        }
    )
    carriers.append(
        {
            "name": "Ganesha_Purana_Nag_Publishers_reprint_1993.pdf",
            "source_url": SCAN_URL,
            "raw": FIXED_SCAN.read_bytes(),
            "http": None,
            "kind": "scan",
            "media_type": "application/pdf",
            "retrieved_at": retrieved_at,
            "rights_evidence": {
                "provider": "SanskritDocuments scan lead",
                "lane": "internal_only",
                "edition": "Nag Publishers reprint, Delhi, 1993",
                "isbn": "81-7081-279-8",
                "rights_literal": "© NAG PUBLISHERS",
                "product_text_or_image_serving": False,
                "visual_structure": plan["source_pair"]["nag_1993_scan_internal_lane"]["visual_structure"],
            },
        }
    )
    stored = store_carriers(carriers, before)
    after = vault_snapshot()
    report = {
        "contract": "DEVAM_GANESHA_PURANA_SOURCE_ACQUISITION_REPORT_V1",
        "result": "PASS",
        "profile_id": plan["profile_id"],
        "plan_path": PLAN.relative_to(ROOT).as_posix(),
        "plan_sha256": sha256_path(PLAN),
        "retrieved_at": retrieved_at,
        "wikisource": {
            "canonical_page_count": 65,
            "chapter_count": 247,
            "content_bytes": sum(row["content_bytes"] for row in acquired_rows),
            "pages": sorted(acquired_rows, key=lambda row: row["title"]),
            "rightsinfo": rightsinfo,
            "terminal_observations": {
                "upasana": "॥ इति श्रीगणेशमहापुराणे उपासना खण्डं समाप्तम् ॥",
                "krida": "॥ श्रीगजाननार्पणमस्तु ॥\n॥ शुभं भवतु ॥",
            },
        },
        "stored_objects": stored,
        "source_payloads_copied_into_app": False,
        "source_vault_before": {key: before[key] for key in ("summary_sha256", "objects_manifest_sha256", "provenance_map_sha256")},
        "source_vault_after": {key: after[key] for key in ("summary_sha256", "objects_manifest_sha256", "provenance_map_sha256")},
        "claims": plan["claims"],
    }
    write_json_exclusive(REPORT, report)
    verify()
    print(json.dumps({"result": "PASS", "profile_id": plan["profile_id"], "report": REPORT.relative_to(ROOT).as_posix(), "report_sha256": sha256_path(REPORT), "stored_objects": len(stored), "wikisource_pages": 65, "chapters": 247}, ensure_ascii=False, indent=2))


def verify() -> None:
    if not ordinary_file(PLAN) or not ordinary_file(REPORT):
        raise RuntimeError("plan/report missing or unsafe")
    plan = json.loads(PLAN.read_text(encoding="utf-8"))
    report = json.loads(REPORT.read_text(encoding="utf-8"))
    if report.get("result") != "PASS" or report.get("profile_id") != plan.get("profile_id"):
        raise RuntimeError("plan/report identity mismatch")
    if report.get("plan_sha256") != sha256_path(PLAN):
        raise RuntimeError("plan hash mismatch")
    if report.get("source_payloads_copied_into_app") is not False:
        raise RuntimeError("source payload copy denial missing")
    expected_pages = plan["source_pair"]["wikisource_product_lane"]["canonical_pages"]
    expected_by_revid = {row["revid"]: row for row in expected_pages}
    actual_pages = {}
    provenance = load_jsonl(VAULT / "provenance-map.jsonl")
    for stored in report["stored_objects"]:
        path = VAULT / stored["object_path"]
        if not ordinary_file(path) or path.stat().st_size != stored["bytes"] or sha256_path(path) != stored["sha256"]:
            raise RuntimeError(f"stored object mismatch: {path}")
        if path.stat().st_nlink != 1:
            raise RuntimeError(f"stored object hardlink rejected: {path}")
        if not any(row.get("source_path") == stored["source_path"] and row.get("sha256") == stored["sha256"] for row in provenance):
            raise RuntimeError(f"provenance record missing: {stored['source_path']}")
        if stored["name"].startswith("ganesha-purana-wikisource-revisions-batch-"):
            parsed = json.loads(path.read_bytes())
            for page in parsed.get("query", {}).get("pages", []):
                revision = latest_revision(page)
                content = decode_revision_content(revision)
                if sha1_hex(content) != revision["sha1"]:
                    raise RuntimeError(f"stored wikitext SHA-1 mismatch: {revision['revid']}")
                actual_pages[revision["revid"]] = {"title": page["title"], "pageid": page["pageid"], "content": content.decode("utf-8")}
        elif stored["name"].endswith("site-rights.json"):
            parsed = json.loads(path.read_bytes())
            rights = parsed.get("query", {}).get("rightsinfo", {})
            if rights.get("text") != SITE_LICENSE_LITERAL or rights.get("url") != SITE_LICENSE_URL:
                raise RuntimeError("stored rights carrier mismatch")
        elif stored["name"].endswith("1993.pdf"):
            if stored["sha256"] != SCAN_SHA256 or stored["bytes"] != SCAN_BYTES:
                raise RuntimeError("stored internal scan identity mismatch")
        else:
            raise RuntimeError(f"unexpected stored carrier: {stored['name']}")
    if set(actual_pages) != set(expected_by_revid):
        raise RuntimeError("stored revision universe mismatch")
    for revid, expected in expected_by_revid.items():
        actual = actual_pages[revid]
        if actual["title"] != expected["title"] or actual["pageid"] != expected["pageid"]:
            raise RuntimeError(f"stored revision semantic mismatch: {revid}")

    upasana_last = next(value["content"] for key, value in actual_pages.items() if expected_by_revid[key]["title"].endswith("अध्यायाः ९१-९२"))
    krida_last = next(value["content"] for key, value in actual_pages.items() if expected_by_revid[key]["title"].endswith("अध्यायाः १५१-१५५"))
    if "उपासना खण्डं समाप्तम्" not in upasana_last or "द्विनवतितमोऽध्यायः" not in upasana_last:
        raise RuntimeError("Upasana terminal evidence missing")
    if "पंचपंचाशदुत्तरशततमोऽध्यायः" not in krida_last or "शुभं भवतु" not in krida_last:
        raise RuntimeError("Krida terminal evidence missing")
    validate_coverage([item["title"] for item in plan["source_pair"]["wikisource_product_lane"]["canonical_spans"]["upasana"]], 92, "upasana")
    validate_coverage([item["title"] for item in plan["source_pair"]["wikisource_product_lane"]["canonical_spans"]["krida"]], 155, "krida")
    subprocess.run([sys.executable, str(ROOT / "tools/lean_cleanup.py"), "verify"], cwd=ROOT, check=True)
    print(json.dumps({"result": "PASS", "profile_id": plan["profile_id"], "stored_objects": len(report["stored_objects"]), "canonical_pages": len(actual_pages), "chapters": 247, "product_lane": "CC BY-SA 4.0 exact-revision Sanskrit Wikisource transcription", "internal_lane": "Nag Publishers 1993 scan not product-served"}, ensure_ascii=False, indent=2))


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
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise

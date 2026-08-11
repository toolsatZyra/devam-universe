from __future__ import annotations

import argparse
import base64
import hashlib
import html
import json
import re
import sys
from collections import Counter
from pathlib import Path
from typing import Any

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from tools.compile_source_vault_tei_ingestion import ROOT, canonical_json, read_verified_object, sql_quote


CONTRACT = "DEVAM_RAMCHARITMANAS_WIKISOURCE_PRODUCT_INGESTION_V1"
PROJECTION_CONTRACT = "DEVAM_CONSERVATIVE_WIKITEXT_PLAINTEXT_PROJECTION_V1"
ACQUISITION_PLAN = ROOT / "ingestion/plans/ramcharitmanas-wikisource-belvedere-pages-v1.json"
ACQUISITION_REPORT = ROOT / "ingestion/reports/ramcharitmanas-wikisource-belvedere-pages-v1.json"
STRUCTURE_PROFILE = ROOT / "ingestion/profiles/ramcharitmanas-belvedere-1925-fixed-carrier-profile-v1.json"
HELD_PAGE_RECOVERY_REPORT = ROOT / "ingestion/reports/ramcharitmanas-held-page-recovery-v1.json"
INGESTION_REPORT = ROOT / "ingestion/reports/ramcharitmanas-wikisource-product-ingestion-v1.json"
ACQUISITION_PLAN_SHA256 = "fbc2a25045bcf8dcbfcb8a5dd2c5388fe8263c209567d515b27f138d0882c0ab"
ACQUISITION_REPORT_SHA256 = "8a6547f3c2f74194a29a885d2b7529ce9fcdd06daa51e7e32c6f48f2e0a2cf7c"
STRUCTURE_PROFILE_SHA256 = "b8c3cb71887a80603455a9432ebd26f5ad62635e6bfc64f6fccace0efb6278f9"
HELD_PAGE_RECOVERY_REPORT_SHA256 = "e044460d5c172bc130afdf3a594f9d751a833e49ad737b4fcb7013f24eb8d5b9"
PROFILE_ID = "RAMCHARITMANAS-WIKISOURCE-PAGES-0F02AEF6AB74619FED5E31B0"
SITE_RIGHTS_SHA256 = "dcc8fe7d780f59d948ac1a00a45d7db912bcaef25d07208c2dd1b9471d3b464c"
LICENSE_LITERAL = "Creative Commons Attribution-Share Alike 4.0"
LICENSE_URL = "https://creativecommons.org/licenses/by-sa/4.0/deed.hi"
LICENSE_FAMILY_URL = "https://creativecommons.org/licenses/by-sa/4.0/"
SCAN_SHA256 = "6d570d531ebada1912f6e930212393fec2200765a0b731b73b8e7135ea0f70f2"
EXPECTED_QUALIFIED_PAGES = 813
EXPECTED_PRODUCT_PAGES = 813
EXPECTED_CORRECTION_PAGES = 359
EXPECTED_TEXT_CORRECTION_PAGES = 345
EXPECTED_STRUCTURAL_BLANK_PAGES = 14
EXPECTED_PROJECTION_ANOMALIES = 0

# These fixed, source-addressed revisions contain malformed provider layout
# braces around otherwise qualified text. Recovery is deliberately limited to
# the exact revision-content hashes so malformed markup from a different
# revision still fails closed.
KNOWN_MALFORMED_LAYOUT_SHA256S = {
    "0aca6fd569a3f009905b0b19ffe73fd83af619bd5ac4912ba619f9efc250a938",
    "1963b541a27d695660ff09ba2e4a26448f2cca653d9f83d67284ae7135720057",
    "29f063fd851582274bf1efce3dbdad0d9477677d9893f42cd9308a195742112b",
    "4d17a4c0960875127123b6dd30d34cd46de640dba093530a27ed0c75e9091717",
    "5783c8630f3cfb43b2c3e66cb65addbe272216c08068a35ec76aa1fe5d656153",
    "72ee424e119d002839ab8bafb89fe2d1f4900dbaa88374bff9f598b03de5a7eb",
    "96953b2d2fefaf0f17d53d69295d8e1880ea054290f8d3e427c2f8b448aa5413",
    "bf1b726b8b52d73abbec96662cac7517f5530723316572b2580ddbeb9b7856f8",
    "e41158c1a5b942e8d8a1d8c2e06deb16d3824f18752de2c56763555681ef54e4",
    "ef9306f2dff4aab4e3fd655e32f4129eda5f36fb72dea9427a915fea67c9e064",
    "f3e999e7259b1594c98acac7590a992ff9a496d29230b934beaf561dfdcfb398",
}

NOINCLUDE_RE = re.compile(r"<noinclude\b[^>]*>.*?</noinclude\s*>", re.IGNORECASE | re.DOTALL)
COMMENT_RE = re.compile(r"<!--.*?-->", re.DOTALL)
SIMPLE_TAG_RE = re.compile(r"</?(?:poem|center|section)\b[^>]*>", re.IGNORECASE)
TEMPLATE_RE = re.compile(r"\{\{([^{}]*)\}\}", re.DOTALL)
WIKILINK_RE = re.compile(r"\[\[([^\[\]]+)\]\]")
EXTERNAL_LINK_RE = re.compile(r"\[(https?://\S+)(?:\s+([^\]]+))?\]")
KNOWN_TEMPLATE_NAMES = {
    "block center",
    "block centre",
    "border",
    "c",
    "center",
    "css image crop",
    "custom rule",
    "dhr",
    "gap",
    "larger",
    "left",
    "outdent",
    "r",
    "rh",
    "right",
    "sic",
    "x-larger",
    "xx-larger",
    "xxx-larger",
}
DROP_TEMPLATES = {"css image crop", "custom rule", "dhr", "r", "rh"}
STYLE_TEMPLATES = {
    "block center",
    "block centre",
    "border",
    "c",
    "center",
    "larger",
    "left",
    "outdent",
    "right",
    "x-larger",
    "xx-larger",
    "xxx-larger",
}


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def sha256_path(path: Path) -> str:
    return sha256_bytes(path.read_bytes())


def sha1_bytes(value: bytes) -> str:
    return hashlib.sha1(value).hexdigest()


def utf8_sql(value: str) -> str:
    encoded = base64.b64encode(value.encode("utf-8")).decode("ascii")
    return f"convert_from(decode({sql_quote(encoded)}, 'base64'), 'UTF8')"


def json_sql(value: Any) -> str:
    encoded = base64.b64encode(canonical_json(value).encode("utf-8")).decode("ascii")
    return f"convert_from(decode({sql_quote(encoded)}, 'base64'), 'UTF8')::jsonb"


def split_template(inner: str) -> tuple[str, list[str]]:
    parts = inner.split("|")
    name = parts[0].strip().casefold()
    return name, [part.strip() for part in parts[1:]]


def render_template(inner: str) -> str:
    name, parameters = split_template(inner)
    if name not in KNOWN_TEMPLATE_NAMES:
        raise ValueError(f"unsupported Wikisource template in product projection: {name!r}")
    if name in DROP_TEMPLATES:
        return ""
    if name == "gap":
        return " "
    if name == "sic":
        return parameters[0] if parameters else ""
    if name in STYLE_TEMPLATES:
        positional = [value for value in parameters if value and not re.match(r"^[A-Za-z][A-Za-z0-9 _-]*\s*=", value)]
        return "\n".join(positional[:1] if name == "outdent" else positional)
    raise AssertionError(f"unhandled known template: {name}")


def plaintext_projection(wikitext: str) -> str:
    """Create a deterministic readable projection without inventing text.

    Raw revision wikitext remains the citation authority. This projection only
    removes provider layout/control markup and never corrects spelling or OCR.
    Unknown templates fail closed instead of silently dropping content.
    """

    recover_fixed_layout = sha256_bytes(wikitext.encode("utf-8")) in KNOWN_MALFORMED_LAYOUT_SHA256S
    text = COMMENT_RE.sub("", wikitext)
    text = NOINCLUDE_RE.sub("", text)
    text = re.sub(r"<br\s*/?>", "\n", text, flags=re.IGNORECASE)
    text = SIMPLE_TAG_RE.sub("", text)
    for _ in range(32):
        if "{{" not in text and "}}" not in text:
            break
        def render(match: re.Match[str]) -> str:
            inner = match.group(1)
            name, parameters = split_template(inner)
            if recover_fixed_layout and not name:
                return "\n".join(value for value in parameters if value)
            return render_template(inner)

        updated, replacements = TEMPLATE_RE.subn(render, text)
        if replacements == 0:
            if not recover_fixed_layout:
                raise ValueError("unbalanced or nested Wikisource template survived projection")
            opening_names = {
                match.casefold().strip()
                for match in re.findall(r"\{\{\s*([^|{}\n]+)\s*\|", text)
            }
            if not opening_names.issubset(KNOWN_TEMPLATE_NAMES):
                raise ValueError("unknown Wikisource template survived fixed-revision layout recovery")
            text = re.sub(
                r"\{\{\s*(?:block center|block centre)\s*\|",
                "",
                text,
                flags=re.IGNORECASE,
            )
            text = text.replace("{{", "").replace("}}", "")
            break
        text = updated
    else:
        raise ValueError("Wikisource template projection exceeded bounded recursion")
    if "{{" in text or "}}" in text:
        raise ValueError("Wikisource template markup survived projection")

    def wikilink(match: re.Match[str]) -> str:
        parts = match.group(1).split("|")
        return parts[-1].strip()

    text = WIKILINK_RE.sub(wikilink, text)
    text = EXTERNAL_LINK_RE.sub(lambda match: (match.group(2) or "").strip(), text)
    text = text.replace("'''", "").replace("''", "")
    text = text.replace("{|", "").replace("|}", "")
    text = html.unescape(text)
    text = text.replace("\u00a0", " ")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r" *\n *", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = text.strip()
    forbidden = ("<noinclude", "<pagequality", "{{", "}}", "[[", "]]", "'''", "{|", "|}")
    if any(marker in text for marker in forbidden):
        raise ValueError("provider/control markup survived plaintext projection")
    return text


def load_inputs() -> tuple[dict[str, Any], dict[str, Any], dict[str, Any]]:
    if sha256_path(ACQUISITION_PLAN) != ACQUISITION_PLAN_SHA256:
        raise ValueError("Ramcharitmanas acquisition plan drift")
    if sha256_path(ACQUISITION_REPORT) != ACQUISITION_REPORT_SHA256:
        raise ValueError("Ramcharitmanas acquisition report drift")
    if sha256_path(STRUCTURE_PROFILE) != STRUCTURE_PROFILE_SHA256:
        raise ValueError("Ramcharitmanas fixed-carrier structure profile drift")
    plan = json.loads(ACQUISITION_PLAN.read_text(encoding="utf-8", errors="strict"))
    report = json.loads(ACQUISITION_REPORT.read_text(encoding="utf-8", errors="strict"))
    structure = json.loads(STRUCTURE_PROFILE.read_text(encoding="utf-8", errors="strict"))
    if plan.get("profile_id") != PROFILE_ID or report.get("profile_id") != PROFILE_ID:
        raise ValueError("acquisition profile identity drift")
    if report.get("result") != "PASS" or report.get("plan_sha256") != ACQUISITION_PLAN_SHA256:
        raise ValueError("acquisition report is not closed against its profile")
    if report.get("product_candidate_page_count") != EXPECTED_QUALIFIED_PAGES:
        raise ValueError("product-candidate page count drift")
    if report.get("correction_required_page_count") != EXPECTED_CORRECTION_PAGES:
        raise ValueError("correction queue count drift")
    if report.get("complete_product_searchable_ramcharitmanas_text") is not False:
        raise ValueError("upstream complete-text denial drift")
    if plan["fixed_scan_reference"]["sha256"] != SCAN_SHA256:
        raise ValueError("fixed scan linkage drift")
    if structure.get("decision") != "FIXED_CARRIER_STRUCTURALLY_COMPLETE_SEVEN_SOPANA_SECOND_EDITION_PUBLIC_DOMAIN_SCAN_TEXT_NOT_READY":
        raise ValueError("fixed scan structural decision drift")
    return plan, report, structure


def load_held_page_recovery() -> dict[str, Any]:
    if sha256_path(HELD_PAGE_RECOVERY_REPORT) != HELD_PAGE_RECOVERY_REPORT_SHA256:
        raise ValueError("Ramcharitmanas held-page recovery report drift")
    recovery = json.loads(HELD_PAGE_RECOVERY_REPORT.read_text(encoding="utf-8", errors="strict"))
    denominator = recovery.get("reconciled_denominator", {})
    if recovery.get("result") != "PASS" or not all(recovery.get("checks", {}).values()):
        raise ValueError("Ramcharitmanas held-page recovery report is not passing")
    if denominator.get("remaining_text_correction_page_count") != EXPECTED_TEXT_CORRECTION_PAGES:
        raise ValueError("Ramcharitmanas text-correction denominator drift")
    if denominator.get("structural_blank_page_count") != EXPECTED_STRUCTURAL_BLANK_PAGES:
        raise ValueError("Ramcharitmanas structural-blank denominator drift")
    if denominator.get("missing_transcription_text_bearing_page_count") != 0:
        raise ValueError("Ramcharitmanas q0 missing-transcription boundary drift")
    if denominator.get("text_bearing_page_denominator") != 1158:
        raise ValueError("Ramcharitmanas text-bearing page denominator drift")
    return recovery


def sopana_for_page(structure: dict[str, Any], scan_page: int) -> dict[str, Any]:
    matches = [
        row
        for row in structure["structure"]["sopanas"]
        if row["pdf_pages"][0] <= scan_page <= row["pdf_pages"][1]
    ]
    if len(matches) != 1:
        raise ValueError(f"scan page does not map to exactly one sopana: {scan_page}")
    return matches[0]


def load_revisions(
    plan: dict[str, Any], report: dict[str, Any]
) -> tuple[dict[int, dict[str, Any]], list[dict[str, Any]]]:
    profile_rows = {row["revid"]: row for row in plan["wikisource"]["pages"]}
    content_rows = {row["revid"]: row for row in report["pages"]}
    stored_batches = [
        row
        for row in report["stored_objects"]
        if row["name"].startswith("ramcharitmanas-wikisource-revisions-batch-")
    ]
    rights_rows = [row for row in report["stored_objects"] if row["name"] == "ramcharitmanas-wikisource-site-rights.json"]
    if len(stored_batches) != 25 or len(rights_rows) != 1 or rights_rows[0]["sha256"] != SITE_RIGHTS_SHA256:
        raise ValueError("stored revision/right carrier universe drift")
    pages: dict[int, dict[str, Any]] = {}
    sources: list[dict[str, Any]] = []
    for stored in [*stored_batches, *rights_rows]:
        raw = read_verified_object(stored)
        parsed = json.loads(raw.decode("utf-8", errors="strict"))
        sources.append(
            {
                **stored,
                "media_type": "application/json; charset=utf-8",
                "retrieved_at": report["retrieved_at"],
                "role": "site_rights_evidence" if stored["sha256"] == SITE_RIGHTS_SHA256 else "revision_batch",
            }
        )
        if stored["sha256"] == SITE_RIGHTS_SHA256:
            if parsed.get("query", {}).get("rightsinfo") != {"url": LICENSE_URL, "text": LICENSE_LITERAL}:
                raise ValueError("stored site-rights carrier drift")
            continue
        revision_order = {revid: ordinal for ordinal, revid in enumerate(stored["revision_ids"])}
        for page in parsed.get("query", {}).get("pages", []):
            revisions = page.get("revisions") or []
            if len(revisions) != 1:
                raise ValueError("stored page does not contain exactly one revision")
            revision = revisions[0]
            revid = revision["revid"]
            expected = profile_rows.get(revid)
            content_fixity = content_rows.get(revid)
            if expected is None or content_fixity is None or revid not in revision_order:
                raise ValueError(f"stored revision not frozen upstream: {revid}")
            content = revision["slots"]["main"]["content"]
            content_bytes = content.encode("utf-8")
            quality = int(page["pageprops"]["proofread_page_quality_level"])
            if (
                page["pageid"] != expected["pageid"]
                or page["title"] != expected["title"]
                or revision["sha1"] != expected["provider_sha1_hex"]
                or sha1_bytes(content_bytes) != expected["provider_sha1_hex"]
                or quality != expected["quality_level"]
                or len(content_bytes) != content_fixity["content_bytes"]
                or sha256_bytes(content_bytes) != content_fixity["content_sha256"]
            ):
                raise ValueError(f"stored revision semantic/fixity mismatch: {revid}")
            scan_page = expected["scan_page"]
            if scan_page in pages:
                raise ValueError(f"duplicate stored scan page: {scan_page}")
            pages[scan_page] = {
                "profile": expected,
                "content": content,
                "content_bytes": content_bytes,
                "content_sha256": content_fixity["content_sha256"],
                "source": sources[-1],
                "source_ordinal": revision_order[revid],
            }
    if set(pages) != set(range(1, 1241)):
        raise ValueError("stored Page-namespace universe is not exactly 1..1240")
    return pages, sources


def build_passages(
    plan: dict[str, Any], structure: dict[str, Any], pages: dict[int, dict[str, Any]]
) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    product_pages = plan["wikisource"]["product_candidate_scan_pages"]
    if len(product_pages) != EXPECTED_QUALIFIED_PAGES:
        raise ValueError("upstream product candidate list drift")
    passages: list[dict[str, Any]] = []
    projection_anomalies: list[dict[str, Any]] = []
    for scan_page in product_pages:
        page = pages[scan_page]
        profile = page["profile"]
        if profile["quality_level"] not in (3, 4) or not 52 <= scan_page <= 1223:
            raise ValueError(f"unqualified page entered product projection: {scan_page}")
        try:
            projection = plaintext_projection(page["content"])
        except ValueError as error:
            projection_anomalies.append(
                {
                    "scan_page": scan_page,
                    "quality_level": profile["quality_level"],
                    "provider_revision_id": profile["revid"],
                    "revision_content_sha256": page["content_sha256"],
                    "reason": str(error),
                }
            )
            continue
        if len(projection) < 20:
            projection_anomalies.append(
                {
                    "scan_page": scan_page,
                    "quality_level": profile["quality_level"],
                    "provider_revision_id": profile["revid"],
                    "revision_content_sha256": page["content_sha256"],
                    "reason": "plaintext projection shorter than 20 characters",
                }
            )
            continue
        sopana = sopana_for_page(structure, scan_page)
        passages.append(
            {
                "source_sha256": page["source"]["sha256"],
                "source_ordinal": page["source_ordinal"],
                "locator": {
                    "provider": "Hindi Wikisource",
                    "provider_page_title": profile["title"],
                    "provider_page_id": profile["pageid"],
                    "provider_revision_id": profile["revid"],
                    "provider_revision_timestamp": profile["timestamp"],
                    "provider_revision_sha1": profile["provider_sha1_hex"],
                    "proofread_page_quality_level": profile["quality_level"],
                    "scan_sha256": SCAN_SHA256,
                    "scan_page": scan_page,
                    "printed_page_number_inferred": False,
                    "sopana_ordinal": sopana["ordinal"],
                    "sopana_name": sopana["name"],
                    "revision_content_byte_start": 0,
                    "revision_content_byte_end_exclusive": len(page["content_bytes"]),
                    "revision_content_sha256": page["content_sha256"],
                    "source_json_carrier_sha256": page["source"]["sha256"],
                    "projection_contract": PROJECTION_CONTRACT,
                    "projection_sha256": sha256_bytes(projection.encode("utf-8")),
                    "projection_corrects_source_text": False,
                    "single_proofreader_quality_3_may_retain_errors": profile["quality_level"] == 3,
                },
                "language_code": "awa",
                "script_code": "Deva",
                "exact_text": projection,
                "text_status": "deterministic_plaintext_projection_of_proofread_wikisource_revision_beta",
                "span_sha256": page["content_sha256"],
            }
        )
    if len(passages) != EXPECTED_PRODUCT_PAGES:
        raise ValueError(f"product passage count mismatch: {len(passages)}")
    if len(projection_anomalies) != EXPECTED_PROJECTION_ANOMALIES:
        raise ValueError(f"projection anomaly count mismatch: {projection_anomalies}")
    identities = {(row["source_sha256"], row["source_ordinal"]) for row in passages}
    if len(identities) != len(passages):
        raise ValueError("product passage source identities are not unique")
    return passages, projection_anomalies


def compile_packet() -> dict[str, Any]:
    plan, report, structure = load_inputs()
    recovery = load_held_page_recovery()
    pages, sources = load_revisions(plan, report)
    passages, projection_anomalies = build_passages(plan, structure, pages)
    completion_denials = {
        "all_narrative_pages_product_searchable": False,
        "remaining_345_text_pages_corrected": False,
        "complete_product_searchable_ramcharitmanas_text": False,
        "all_ramcharitmanas_editions_recensions_commentaries_translations_and_traditions": False,
        "complete_ramayana_universe": False,
        "mvp_library_complete": False,
    }
    core = {
        "contract": CONTRACT,
        "profile_id": PROFILE_ID,
        "acquisition_plan_sha256": ACQUISITION_PLAN_SHA256,
        "acquisition_report_sha256": ACQUISITION_REPORT_SHA256,
        "structure_profile_sha256": STRUCTURE_PROFILE_SHA256,
        "work": {
            "slug": "tulsidas-ramcharitmanas",
            "canonical_title": "रामचरितमानस (Ramcharitmanas)",
            "work_kind": "devotional_epic",
            "tradition_scope": ["Ramayana", "Vaishnava", "Rama-bhakti"],
            "summary": "Tulsidas's Awadhi devotional retelling of the Rama narrative. This beta product lane covers all 813 proofread or validated pages of one fixed Belvedere Press edition; 345 unproofread text-bearing pages remain outside the product index, while 14 held q0 coordinates are verified structural blanks rather than missing story text.",
        },
        "expression": {
            "language_code": "awa",
            "script_code": "Deva",
            "expression_kind": "digital_transcription",
            "attribution": "Hindi Wikisource contributors at 1,240 pinned Page-namespace revisions",
        },
        "edition": {
            "edition_title": "Belvedere Press Prayag second edition with Hindi Wikisource page transcriptions (pinned 2026-08-08)",
            "publisher": "Belvedere Press",
            "publication_place": "Prayag",
            "publication_year": 1925,
            "edition_statement": "Second-edition scan with printed Vikram Samvat 1982; provider year discrepancy 1925/1926 retained. Product text currently includes all 813 proofread or validated seven-sopana narrative-page projections; 345 unproofread text-bearing pages remain held, and 14 q0 coordinates are fixed-scan structural blanks.",
            "identifiers": {
                "profile_id": PROFILE_ID,
                "scan_sha256": SCAN_SHA256,
                "hindi_wikisource_index": "विषयसूची:रामचरितमानस.pdf",
            },
        },
        "rights": {
            "lane": "derivative_allowed",
            "provider_license_literal": LICENSE_LITERAL,
            "provider_license_url": LICENSE_URL,
            "license_family_url": LICENSE_FAMILY_URL,
            "attribution_required": True,
            "share_alike_required": True,
            "underlying_scan_public_domain": True,
            "unproofread_pages_product_served": False,
            "structural_blank_pages_served_as_text": False,
        },
        "source_objects": sources,
        "passages": passages,
        "scope": {
            "positive": "813 source-addressed proofread or validated narrative-page plaintext projections for one structurally complete fixed Belvedere Press Ramcharitmanas edition.",
            "correction_required_pages": plan["wikisource"]["correction_required_scan_pages"],
            "correction_required_page_count": EXPECTED_CORRECTION_PAGES,
            "held_page_recovery_report_sha256": HELD_PAGE_RECOVERY_REPORT_SHA256,
            "structural_blank_pages": recovery["reconciled_denominator"]["structural_blank_pages"],
            "structural_blank_page_count": EXPECTED_STRUCTURAL_BLANK_PAGES,
            "remaining_text_correction_pages": sorted(
                set(plan["wikisource"]["correction_required_scan_pages"])
                - set(recovery["reconciled_denominator"]["structural_blank_pages"])
            ),
            "remaining_text_correction_page_count": EXPECTED_TEXT_CORRECTION_PAGES,
            "text_bearing_page_denominator": 1158,
            "projection_anomalies": projection_anomalies,
            "projection_anomaly_count": EXPECTED_PROJECTION_ANOMALIES,
            "total_narrative_pages_not_product_indexed": EXPECTED_CORRECTION_PAGES + EXPECTED_PROJECTION_ANOMALIES,
            "projection_boundary": "Layout markup is removed deterministically; malformed provider braces are recovered only for 11 exact revision-content hashes; no source spelling, OCR, wording, or numbering is corrected.",
        },
        "completion_denials": completion_denials,
        "source_payloads_copied_into_app": False,
    }
    return {**core, "packet_sha256": sha256_bytes(canonical_json(core).encode("utf-8"))}


def compile_sql(packet: dict[str, Any]) -> list[str]:
    work, expression, edition, rights = packet["work"], packet["expression"], packet["edition"], packet["rights"]
    lane = rights["lane"]
    statements = [
        f"""insert into public.works (slug, canonical_title, work_kind, tradition_scope, summary, rights_lane, publication_state) values ({sql_quote(work['slug'])}, {utf8_sql(work['canonical_title'])}, {sql_quote(work['work_kind'])}, array[{','.join(sql_quote(value) for value in work['tradition_scope'])}]::text[], {utf8_sql(work['summary'])}, {sql_quote(lane)}, 'published') on conflict (slug) do update set canonical_title=excluded.canonical_title, work_kind=excluded.work_kind, tradition_scope=excluded.tradition_scope, summary=excluded.summary, rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;""",
        f"""insert into public.expressions (work_id, language_code, script_code, expression_kind, attribution, is_source_original, ai_generated, rights_lane, publication_state) select w.id, {sql_quote(expression['language_code'])}, {sql_quote(expression['script_code'])}, {sql_quote(expression['expression_kind'])}, {utf8_sql(expression['attribution'])}, false, false, {sql_quote(lane)}, 'published' from public.works w where w.slug={sql_quote(work['slug'])} on conflict (work_id, language_code, expression_kind, attribution) do update set script_code=excluded.script_code, is_source_original=false, ai_generated=false, rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;""",
        f"""insert into public.editions (expression_id, edition_title, publisher, publication_place, publication_year, edition_statement, identifiers, rights_lane, publication_state) select e.id, {utf8_sql(edition['edition_title'])}, {utf8_sql(edition['publisher'])}, {utf8_sql(edition['publication_place'])}, {edition['publication_year']}, {utf8_sql(edition['edition_statement'])}, {json_sql(edition['identifiers'])}, {sql_quote(lane)}, 'published' from public.expressions e join public.works w on w.id=e.work_id where w.slug={sql_quote(work['slug'])} and e.attribution={utf8_sql(expression['attribution'])} and not exists (select 1 from public.editions d where d.expression_id=e.id and d.edition_title={utf8_sql(edition['edition_title'])});""",
        f"""update public.editions d set publisher={utf8_sql(edition['publisher'])}, publication_place={utf8_sql(edition['publication_place'])}, publication_year={edition['publication_year']}, edition_statement={utf8_sql(edition['edition_statement'])}, identifiers={json_sql(edition['identifiers'])}, rights_lane={sql_quote(lane)}, publication_state='published' from public.expressions e join public.works w on w.id=e.work_id where d.expression_id=e.id and w.slug={sql_quote(work['slug'])} and d.edition_title={utf8_sql(edition['edition_title'])};""",
    ]
    for source in packet["source_objects"]:
        provenance = {
            "contract": CONTRACT,
            "packet_sha256": packet["packet_sha256"],
            "profile_id": PROFILE_ID,
            "role": source["role"],
            "source_path": source["source_path"],
            "source_payloads_copied_into_app": False,
            "complete_product_searchable_ramcharitmanas_text": False,
        }
        provider_id = f"wikisource:hi:ramcharitmanas:{source['name']}"
        statements.append(
            f"""insert into public.source_objects (edition_id, sha256, byte_count, media_type, storage_backend, storage_bucket, storage_key, provider, provider_identifier, source_url, acquired_at, provenance, completeness_status, rights_lane, rights_basis) select d.id, {sql_quote(source['sha256'])}, {source['bytes']}, {sql_quote(source['media_type'])}, 'local_vault', null, {sql_quote(source['object_path'])}, 'Hindi Wikisource', {sql_quote(provider_id)}, {sql_quote(source['retrieved_at'])}::timestamptz, {json_sql(provenance)}, 'partial_beta_product_text_813_of_1172_narrative_pages_359_not_indexed', {sql_quote(lane)}, {json_sql(rights)} from public.editions d join public.expressions e on e.id=d.expression_id join public.works w on w.id=e.work_id where w.slug={sql_quote(work['slug'])} and d.edition_title={utf8_sql(edition['edition_title'])} on conflict (sha256) do update set edition_id=excluded.edition_id, byte_count=excluded.byte_count, media_type=excluded.media_type, storage_backend=excluded.storage_backend, storage_bucket=excluded.storage_bucket, storage_key=excluded.storage_key, provider=excluded.provider, provider_identifier=excluded.provider_identifier, source_url=excluded.source_url, acquired_at=excluded.acquired_at, provenance=excluded.provenance, completeness_status=excluded.completeness_status, rights_lane=excluded.rights_lane, rights_basis=excluded.rights_basis;"""
        )
    for passage in packet["passages"]:
        statements.append(
            f"""insert into public.passages (source_object_id, source_ordinal, locator, language_code, script_code, exact_text, text_status, span_sha256, rights_lane, publication_state) select s.id, {passage['source_ordinal']}, {json_sql(passage['locator'])}, {sql_quote(passage['language_code'])}, {sql_quote(passage['script_code'])}, {utf8_sql(passage['exact_text'])}, {sql_quote(passage['text_status'])}, {sql_quote(passage['span_sha256'])}, {sql_quote(lane)}, 'published' from public.source_objects s where s.sha256={sql_quote(passage['source_sha256'])} on conflict (source_object_id, source_ordinal) do update set locator=excluded.locator, language_code=excluded.language_code, script_code=excluded.script_code, exact_text=excluded.exact_text, text_status=excluded.text_status, span_sha256=excluded.span_sha256, rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;"""
        )
    return statements


def compile_batches(statements: list[str], max_chars: int = 350_000) -> list[str]:
    batches: list[str] = []
    current: list[str] = []
    size = 0
    for statement in statements:
        if current and size + len(statement) > max_chars:
            batches.append("\n\n".join(["begin;", *current, "commit;"]) + "\n")
            current, size = [], 0
        current.append(statement)
        size += len(statement)
    if current:
        batches.append("\n\n".join(["begin;", *current, "commit;"]) + "\n")
    return batches


def build_report(packet: dict[str, Any], batches: list[str]) -> dict[str, Any]:
    quality_counts = Counter(row["locator"]["proofread_page_quality_level"] for row in packet["passages"])
    sopana_counts = Counter(row["locator"]["sopana_ordinal"] for row in packet["passages"])
    root_rows = [
        f"{row['source_sha256']}\t{row['source_ordinal']}\t{row['locator']['scan_page']}\t{row['span_sha256']}\t{row['locator']['projection_sha256']}"
        for row in packet["passages"]
    ]
    return {
        "result": "PASS",
        "contract": CONTRACT,
        "profile_id": PROFILE_ID,
        "packet_sha256": packet["packet_sha256"],
        "sql_batch_count": len(batches),
        "sql_batch_sha256": [sha256_bytes(batch.encode("utf-8")) for batch in batches],
        "source_object_count": len(packet["source_objects"]),
        "source_object_bytes": sum(row["bytes"] for row in packet["source_objects"]),
        "published_passage_count": len(packet["passages"]),
        "quality_counts": {str(key): value for key, value in sorted(quality_counts.items())},
        "sopana_passage_counts": {str(key): value for key, value in sorted(sopana_counts.items())},
        "passage_root_sha256": sha256_bytes("\n".join(root_rows).encode("utf-8")),
        "positive_boundary": packet["scope"]["positive"],
        "projection_boundary": packet["scope"]["projection_boundary"],
        "correction_required_page_count": packet["scope"]["correction_required_page_count"],
        "structural_blank_page_count": packet["scope"]["structural_blank_page_count"],
        "remaining_text_correction_page_count": packet["scope"]["remaining_text_correction_page_count"],
        "text_bearing_page_denominator": packet["scope"]["text_bearing_page_denominator"],
        "projection_anomaly_count": packet["scope"]["projection_anomaly_count"],
        "projection_anomalies": packet["scope"]["projection_anomalies"],
        "total_narrative_pages_not_product_indexed": packet["scope"]["total_narrative_pages_not_product_indexed"],
        "completion_denials": packet["completion_denials"],
        "source_payloads_copied_into_app": False,
        "search_wiring": "published passages use the existing search_public_passages RPC after database application",
        "sarthi_wiring": "existing grounded retrieval can consume these published passage rows after database application",
        "database_applied_by_this_compiler": False,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Compile qualified Ramcharitmanas Wikisource pages into Devam product passages.")
    parser.add_argument("--format", choices=("report", "sql-batch-base64"), default="report")
    parser.add_argument("--batch-index", type=int)
    parser.add_argument("--write-report", action="store_true")
    args = parser.parse_args()
    packet = compile_packet()
    batches = compile_batches(compile_sql(packet))
    if args.format == "sql-batch-base64":
        if args.batch_index is None or not 0 <= args.batch_index < len(batches):
            raise ValueError(f"--batch-index must be between 0 and {len(batches) - 1}")
        sys.stdout.write(base64.b64encode(batches[args.batch_index].encode("utf-8")).decode("ascii"))
        return 0
    report = json.dumps(build_report(packet, batches), ensure_ascii=False, sort_keys=True, separators=(",", ":")) + "\n"
    if args.write_report:
        with INGESTION_REPORT.open("x", encoding="utf-8", newline="\n") as handle:
            handle.write(report)
    print(report, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

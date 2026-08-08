from __future__ import annotations

import argparse
import base64
import hashlib
import json
import re
import sys
import xml.etree.ElementTree as ET
import zlib
from pathlib import Path
from typing import Any

from compile_source_vault_tei_ingestion import (
    canonical_json,
    read_verified_object,
    sql_quote,
    validate_append_only_vault,
)


ROOT = Path(__file__).resolve().parents[1]
CONTRACT = "DEVAM_NIRNAYASINDHU_MARATHI_1865_INGESTION_V1"
METADATA_SHA256 = "12f756e03e2875b37e454964a2230cbcb062b2a57aeca745ad0311dadc985bb0"
PDF_SHA256 = "a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b"
OCR_SHA256 = "832ce8f6628b3f5bd18116ac025735d6517e4757a9ac547a74dd5768fdf842cb"
PAGE_NUMBERS_SHA256 = "7f545510c88ccb64d56c94827b73bdc86a5804762eea9b23b03ef296aa990177"
EXPECTED_ROLES = [
    "citation_image_pdf",
    "provider_ocr_text",
    "provider_ocr_xml",
    "provider_page_numbers",
    "provider_scandata",
]
EXPECTED_SOURCE_BYTES = 129267530


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def utf8_base64_sql(value: str) -> str:
    encoded = base64.b64encode(value.encode("utf-8")).decode("ascii")
    return f"convert_from(decode({sql_quote(encoded)}, 'base64'), 'UTF8')"


def json_utf8_base64_sql(value: Any) -> str:
    encoded = base64.b64encode(canonical_json(value).encode("utf-8")).decode("ascii")
    return f"convert_from(decode({sql_quote(encoded)}, 'base64'), 'UTF8')::jsonb"


def page_text(obj: ET.Element) -> str:
    lines: list[str] = []
    for line in obj.findall(".//LINE"):
        text = " ".join((word.text or "") for word in line.findall(".//WORD")).strip()
        if text:
            lines.append(text)
    return "\n".join(lines)


def structural_role(page: int) -> str:
    exact = {
        1: "front_scan_leaf",
        2: "title_page",
        3: "marathi_preface",
        17: "blank_separator",
        18: "first_pariccheda_start",
        94: "first_pariccheda_end",
        95: "blank_separator",
        96: "second_pariccheda_start",
        247: "second_pariccheda_end",
        248: "third_pariccheda_purvardha_start",
        392: "third_pariccheda_purvardha_end",
        393: "third_pariccheda_uttarardha_start",
        657: "translated_work_end",
        658: "translator_editor_addendum_start",
        669: "translator_editor_addendum_end",
        670: "blank_terminal_leaf",
    }
    if page in exact:
        return exact[page]
    if 4 <= page <= 16:
        return "contents"
    if 19 <= page <= 93:
        return "first_pariccheda"
    if 97 <= page <= 246:
        return "second_pariccheda"
    if 249 <= page <= 391:
        return "third_pariccheda_purvardha"
    if 394 <= page <= 656:
        return "third_pariccheda_uttarardha"
    if 659 <= page <= 668:
        return "translator_editor_addendum"
    raise ValueError(f"Unmapped PDF page: {page}")


def numeric_page_number(value: Any) -> int | None:
    if not isinstance(value, str) or not value.strip():
        return None
    normalized = value.strip().translate(str.maketrans("०१२३४५६७८९", "0123456789"))
    return int(normalized) if normalized.isascii() and normalized.isdigit() else None


def page_number_discontinuities(pages: list[dict[str, Any]]) -> list[dict[str, int]]:
    result: list[dict[str, int]] = []
    previous: tuple[int, int] | None = None
    for record in pages:
        leaf = record.get("leafNum")
        value = numeric_page_number(record.get("pageNumber"))
        if not isinstance(leaf, int) or value is None:
            continue
        if previous is not None and value != previous[1] + 1:
            result.append(
                {
                    "previous_leaf": previous[0],
                    "previous_value": previous[1],
                    "leaf": leaf,
                    "value": value,
                }
            )
        previous = (leaf, value)
    return result


def metadata_bytes(plan: dict[str, Any]) -> bytes:
    evidence = plan["provider_evidence"]
    spec = {
        "sha256": evidence["internet_archive_metadata_sha256"],
        "bytes": evidence["internet_archive_metadata_bytes"],
        "object_path": evidence["metadata_object_path"],
    }
    return read_verified_object(spec)


def validate_metadata(plan: dict[str, Any], data: bytes, source_bytes: dict[str, bytes]) -> None:
    evidence = plan["provider_evidence"]
    if sha256_bytes(data) != METADATA_SHA256:
        raise ValueError("Provider metadata hash drift")
    payload = json.loads(data.decode("utf-8", errors="strict"))
    metadata = payload.get("metadata", {})
    exact = {
        "identifier": "in.ernet.dli.2015.365977",
        "title": evidence["provider_title_literal"],
        "creator": evidence["provider_creator_literal"],
        "date": evidence["provider_date_literal"],
        "language": evidence["provider_language_literal"],
    }
    for key, expected in exact.items():
        if metadata.get(key) != expected:
            raise ValueError(f"Provider metadata field drift: {key}")
    if payload.get("d1") != evidence["d1"] or payload.get("d2") != evidence["d2"] or payload.get("dir") != evidence["dir"]:
        raise ValueError("Provider location metadata drift")
    if metadata.get("rights") is not None or metadata.get("licenseurl") is not None or payload.get("is_dark") is not None:
        raise ValueError("Provider rights, licence, or dark-state boundary drift")
    description = metadata.get("description", "")
    for literal in (
        f"dc.description.totalpages: {evidence['provider_description_pages']}",
        f"dc.identifier.barcode: {evidence['provider_description_barcode']}",
        f"dc.publisher: {evidence['provider_description_publisher']}",
        f"dc.rights: {evidence['provider_description_rights_literal']}",
    ):
        if literal not in description:
            raise ValueError(f"Provider description literal absent: {literal}")

    files = {row.get("name"): row for row in payload.get("files", [])}
    for source in plan["source_objects"]:
        row = files.get(source["provider_name"])
        if row is None:
            raise ValueError(f"Provider file row absent: {source['provider_name']}")
        expected_row = {
            "size": str(source["bytes"]),
            "format": source["provider_format"],
            "source": source["provider_source"],
            "md5": source["provider_md5"],
            "sha1": source["provider_sha1"],
            "crc32": source["provider_crc32"],
        }
        if any(row.get(key) != value for key, value in expected_row.items()):
            raise ValueError(f"Provider file record drift: {source['provider_name']}")
        if row.get("private") is True or row.get("hidden") is True:
            raise ValueError(f"Selected provider file became private or hidden: {source['provider_name']}")
        actual = source_bytes[source["role"]]
        if hashlib.md5(actual).hexdigest() != source["provider_md5"]:  # noqa: S324 - provider fixity comparison
            raise ValueError(f"Provider MD5 mismatch: {source['role']}")
        if hashlib.sha1(actual).hexdigest() != source["provider_sha1"]:  # noqa: S324 - provider fixity comparison
            raise ValueError(f"Provider SHA-1 mismatch: {source['role']}")
        if f"{zlib.crc32(actual) & 0xFFFFFFFF:08x}" != source["provider_crc32"]:
            raise ValueError(f"Provider CRC32 mismatch: {source['role']}")


def validate_provider_derivatives(
    source_bytes: dict[str, bytes], plan: dict[str, Any]
) -> tuple[list[ET.Element], list[dict[str, Any]]]:
    structure = plan["structure"]
    source_bytes["provider_ocr_text"].decode("utf-8", errors="strict")

    page_map = json.loads(source_bytes["provider_page_numbers"].decode("utf-8", errors="strict"))
    if page_map.get("identifier") != structure["provider_page_number_identifier"]:
        raise ValueError("Provider page-number identifier drift")
    page_records = page_map.get("pages")
    if not isinstance(page_records, list) or len(page_records) != structure["page_number_record_count"]:
        raise ValueError("Provider page-number record count drift")
    if [row.get("leafNum") for row in page_records] != list(range(structure["page_number_record_count"])):
        raise ValueError("Provider page-number leaf sequence is not exactly 0..669")
    if page_number_discontinuities(page_records) != structure["provider_page_number_discontinuities"]:
        raise ValueError("Provider page-number discontinuity profile drift")

    scan_root = ET.fromstring(source_bytes["provider_scandata"])
    scan_pages = scan_root.findall(".//pageData/page")
    if len(scan_pages) != structure["scandata_leaf_count"]:
        raise ValueError("Scandata leaf count drift")
    if [int(page.get("leafNum", "-1")) for page in scan_pages] != list(range(structure["scandata_leaf_count"])):
        raise ValueError("Scandata leaf sequence is not exactly 0..669")
    if any(page.findtext("addToAccessFormats") != "true" for page in scan_pages):
        raise ValueError("Scandata excludes one or more leaves from access formats")

    objects = ET.fromstring(source_bytes["provider_ocr_xml"]).findall(".//OBJECT")
    if len(objects) != structure["ocr_object_count"]:
        raise ValueError("OCR object count drift")
    texts = [page_text(obj) for obj in objects]
    for anchor in structure["ocr_discovery_anchors"]:
        text = texts[anchor["pdf_page"] - 1]
        for literal in anchor["literals"]:
            if literal not in text:
                raise ValueError(f"OCR discovery anchor absent from page {anchor['pdf_page']}: {literal}")
    empty = [index for index, text in enumerate(texts, start=1) if not text]
    if empty != structure["ocr_empty_pages"]:
        raise ValueError(f"OCR empty-page profile drift: {empty}")
    return objects, page_records


def extract_page_passages(
    ocr_bytes: bytes,
    objects: list[ET.Element],
    page_records: list[dict[str, Any]],
    plan: dict[str, Any],
) -> list[dict[str, Any]]:
    structure = plan["structure"]
    spans = list(re.finditer(rb"<OBJECT\b.*?</OBJECT>", ocr_bytes, re.DOTALL))
    expected = structure["ocr_object_count"]
    if len(objects) != expected or len(spans) != expected:
        raise ValueError(f"Expected {expected} OCR objects and byte spans")
    prefix = ocr_bytes[: spans[0].start()]
    suffix = ocr_bytes[spans[-1].end() :]
    if len(prefix) != structure["ocr_xml_prefix_bytes"] or sha256_bytes(prefix) != structure["ocr_xml_prefix_sha256"]:
        raise ValueError("OCR XML prefix binding mismatch")
    if len(suffix) != structure["ocr_xml_suffix_bytes"] or sha256_bytes(suffix) != structure["ocr_xml_suffix_sha256"]:
        raise ValueError("OCR XML suffix binding mismatch")

    visual_printed = {
        row["pdf_page"]: row["printed_page"]
        for row in structure["visual_boundaries"]
        if "printed_page" in row
    }
    ritual_ranges = structure["ritual_evidence_ranges"]
    passages: list[dict[str, Any]] = []
    span_rows: list[str] = []
    for page, (obj, match, page_record) in enumerate(zip(objects, spans, page_records, strict=True), start=1):
        exact_text = page_text(obj)
        raw_span = match.group(0)
        span_sha = sha256_bytes(raw_span)
        span_rows.append(f"{page}\t{len(exact_text)}\t{span_sha}\t{match.start()}\t{match.end()}")
        ritual_keys = [
            item["key"] for item in ritual_ranges if item["pdf_pages"][0] <= page <= item["pdf_pages"][1]
        ]
        passages.append(
            {
                "source_ordinal": page,
                "locator": {
                    "contract": "DEVAM_PAGE_ADDRESSED_QUARANTINED_OCR_V1",
                    "pdf_page": page,
                    "djvu_object_ordinal": page,
                    "scandata_leaf_num": page - 1,
                    "provider_page_number_literal": page_record.get("pageNumber"),
                    "provider_page_number_confidence": page_record.get("confidence"),
                    "provider_page_number_probability": page_record.get("pageProb"),
                    "provider_page_number_word_confidence": page_record.get("wordConf"),
                    "provider_page_number_untrusted": True,
                    "visually_confirmed_printed_page": visual_printed.get(page),
                    "structural_role": structural_role(page),
                    "ritual_evidence_keys": ritual_keys,
                    "xml_byte_start": match.start(),
                    "xml_byte_end_exclusive": match.end(),
                    "xml_line_start": ocr_bytes.count(b"\n", 0, match.start()) + 1,
                    "xml_line_end": ocr_bytes.count(b"\n", 0, match.end()) + 1,
                    "image_width": int(obj.get("width", "0")),
                    "image_height": int(obj.get("height", "0")),
                    "ocr_source_sha256": OCR_SHA256,
                    "pdf_image_source_sha256": PDF_SHA256,
                    "page_number_source_sha256": PAGE_NUMBERS_SHA256,
                    "ocr_text_sha256": sha256_bytes(exact_text.encode("utf-8")),
                    "ocr_quarantined": True,
                    "mixed_source_languages": plan["expression"]["embedded_source_languages"],
                },
                "language_code": plan["expression"]["language_code"],
                "script_code": plan["expression"]["script_code"],
                "exact_text": exact_text or None,
                "span_sha256": span_sha,
                "text_status": structure["text_status"],
            }
        )

    root = sha256_bytes("\n".join(span_rows).encode("utf-8"))
    if root != structure["ocr_object_span_root_sha256"]:
        raise ValueError(f"OCR object-span root mismatch: {root}")
    nonempty = sum(row["exact_text"] is not None for row in passages)
    empty = [row["source_ordinal"] for row in passages if row["exact_text"] is None]
    if nonempty != structure["ocr_nonempty_page_count"] or empty != structure["ocr_empty_pages"]:
        raise ValueError("OCR nonempty/empty passage profile drift")
    return passages


def compile_packet(plan_path: Path) -> dict[str, Any]:
    plan = json.loads(plan_path.read_text(encoding="utf-8", errors="strict"))
    if plan.get("contract") != CONTRACT:
        raise ValueError(f"Unsupported contract: {plan.get('contract')}")
    validate_append_only_vault(plan["vault"])
    if plan["source_copy_policy"] != "reference_only_no_duplicate_payload":
        raise ValueError("Source copy policy drift")

    roles = [item["role"] for item in plan["source_objects"]]
    if roles != EXPECTED_ROLES or len(set(roles)) != len(roles):
        raise ValueError(f"Unexpected source role universe/order: {roles}")
    source_bytes = {item["role"]: read_verified_object(item) for item in plan["source_objects"]}
    if sum(len(value) for value in source_bytes.values()) != EXPECTED_SOURCE_BYTES:
        raise ValueError("Selected source byte universe drift")
    if next(item["sha256"] for item in plan["source_objects"] if item["role"] == "citation_image_pdf") != PDF_SHA256:
        raise ValueError("Canonical PDF hash drift")
    if next(item["sha256"] for item in plan["source_objects"] if item["role"] == "provider_ocr_xml") != OCR_SHA256:
        raise ValueError("Canonical OCR XML hash drift")
    if next(item["sha256"] for item in plan["source_objects"] if item["role"] == "provider_page_numbers") != PAGE_NUMBERS_SHA256:
        raise ValueError("Canonical page-number map hash drift")

    if plan["work"]["aggregate_rights_lane"] != "private_evidence" or plan["work"]["publication_state"] != "review":
        raise ValueError("Aggregate work boundary drift")
    rights = plan["rights"]
    if rights["lane"] != "private_evidence" or rights["ocr_product_ready"] is not False:
        raise ValueError("Rights or OCR quarantine boundary drift")
    if rights["provider_top_level_rights"] is not None or rights["provider_top_level_licenseurl"] is not None:
        raise ValueError("Top-level provider rights fields must remain null")
    if any(rights[key] is not False for key in ("public_search_ready", "api_ready", "vector_ready", "training_ready", "modern_ritual_guidance_ready")):
        raise ValueError("Product-lane denials drift")
    structure = plan["structure"]
    if structure["publication_state"] != "review" or structure["text_status"] != "provider_ocr_quarantined_unreviewed":
        raise ValueError("Publication or OCR quarantine state drift")
    if any(value is not False for value in plan["completion_denials"].values()):
        raise ValueError("Every completion denial must remain false")
    if any(value is not True for key, value in plan["scope_boundary"].items() if key != "positive"):
        raise ValueError("Scope exclusion boundary drift")
    if plan["safety_boundary"]["historical_normative_material_present"] is not True:
        raise ValueError("Historical normative material safety boundary drift")

    validate_metadata(plan, metadata_bytes(plan), source_bytes)
    objects, page_records = validate_provider_derivatives(source_bytes, plan)
    passages = extract_page_passages(source_bytes["provider_ocr_xml"], objects, page_records, plan)
    core = {
        key: plan[key]
        for key in (
            "contract", "pilot_id", "source_copy_policy", "work", "identity", "expression",
            "edition", "source_objects", "provider_evidence", "rights", "structure",
            "scope_boundary", "safety_boundary", "completion_denials", "vault",
        )
    }
    core["passages"] = passages
    core["source_object_count"] = len(plan["source_objects"])
    core["passage_count"] = len(passages)
    return {**core, "packet_sha256": sha256_bytes(canonical_json(core).encode("utf-8"))}


def compile_sql(packet: dict[str, Any]) -> str:
    work, expression, edition = packet["work"], packet["expression"], packet["edition"]
    rights, structure = packet["rights"], packet["structure"]
    rights_basis = {
        "work_status": rights["work_status"],
        "provider_description_rights_literal": rights["provider_description_rights_literal"],
        "provider_top_level_rights": None,
        "provider_top_level_licenseurl": None,
        "technical_rights_isolation": rights["technical_rights_isolation"],
        "product_geography_boundary": rights["product_geography_boundary"],
        "ocr_product_ready": False,
        "provider_evidence": packet["provider_evidence"],
    }
    provenance_base = {
        "ingestion_contract": CONTRACT,
        "pilot_id": packet["pilot_id"],
        "packet_sha256": packet["packet_sha256"],
        "source_copy_policy": packet["source_copy_policy"],
        "identity": packet["identity"],
        "scope_boundary": packet["scope_boundary"],
        "safety_boundary": packet["safety_boundary"],
        "completion_denials": packet["completion_denials"],
        "vault_snapshot": packet["vault"],
    }
    statements = [
        "begin;",
        f"""insert into public.works (slug, canonical_title, work_kind, tradition_scope, summary, rights_lane, publication_state)
values ({sql_quote(work['slug'])}, {utf8_base64_sql(work['canonical_title'])}, {sql_quote(work['work_kind'])}, array[{','.join(sql_quote(v) for v in work['tradition_scope'])}]::text[], {utf8_base64_sql(work['summary'])}, {sql_quote(work['aggregate_rights_lane'])}, {sql_quote(work['publication_state'])})
on conflict (slug) do update set canonical_title=excluded.canonical_title, work_kind=excluded.work_kind, tradition_scope=excluded.tradition_scope, summary=excluded.summary;""",
        f"""insert into public.expressions (work_id, language_code, script_code, expression_kind, attribution, is_source_original, ai_generated, rights_lane, publication_state)
select w.id, {sql_quote(expression['language_code'])}, {sql_quote(expression['script_code'])}, {sql_quote(expression['expression_kind'])}, {utf8_base64_sql(expression['attribution'])}, false, false, {sql_quote(rights['lane'])}, {sql_quote(structure['publication_state'])}
from public.works w where w.slug={sql_quote(work['slug'])}
and not exists (select 1 from public.expressions e where e.work_id=w.id and e.language_code={sql_quote(expression['language_code'])} and e.expression_kind={sql_quote(expression['expression_kind'])} and e.attribution={utf8_base64_sql(expression['attribution'])});""",
        f"""update public.expressions e set script_code={sql_quote(expression['script_code'])}, is_source_original=false, ai_generated=false, rights_lane={sql_quote(rights['lane'])}, publication_state={sql_quote(structure['publication_state'])}
from public.works w where e.work_id=w.id and w.slug={sql_quote(work['slug'])} and e.language_code={sql_quote(expression['language_code'])} and e.expression_kind={sql_quote(expression['expression_kind'])} and e.attribution={utf8_base64_sql(expression['attribution'])};""",
        f"""insert into public.editions (expression_id, edition_title, publisher, publication_place, publication_year, edition_statement, identifiers, rights_lane, publication_state)
select e.id, {utf8_base64_sql(edition['edition_title'])}, {utf8_base64_sql(edition['publisher'])}, {utf8_base64_sql(edition['publication_place'])}, {edition['publication_year']}, {utf8_base64_sql(edition['edition_statement'])}, {json_utf8_base64_sql(edition['identifiers'])}, {sql_quote(rights['lane'])}, {sql_quote(structure['publication_state'])}
from public.expressions e join public.works w on w.id=e.work_id where w.slug={sql_quote(work['slug'])} and e.expression_kind={sql_quote(expression['expression_kind'])}
and not exists (select 1 from public.editions d where d.expression_id=e.id and d.edition_title={utf8_base64_sql(edition['edition_title'])} and d.publication_year={edition['publication_year']});""",
    ]
    for source in packet["source_objects"]:
        provenance = {
            **provenance_base,
            "representation_role": source["role"],
            "object_path": source["object_path"],
            "provider_fixity": {
                "name": source["provider_name"],
                "format": source["provider_format"],
                "source": source["provider_source"],
                "md5": source["provider_md5"],
                "sha1": source["provider_sha1"],
                "crc32": source["provider_crc32"],
            },
        }
        statements.append(
            f"""insert into public.source_objects (edition_id, sha256, byte_count, media_type, storage_backend, storage_bucket, storage_key, provider, provider_identifier, source_url, provenance, completeness_status, rights_lane, rights_basis)
select d.id, {sql_quote(source['sha256'])}, {source['bytes']}, {sql_quote(source['media_type'])}, 'local_vault', null, {sql_quote(source['object_path'])}, {utf8_base64_sql(source['provider'])}, {sql_quote(source['provider_identifier'])}, {sql_quote(source['source_url'])}, {json_utf8_base64_sql(provenance)}, {sql_quote(structure['completeness_status'])}, {sql_quote(rights['lane'])}, {json_utf8_base64_sql(rights_basis)}
from public.editions d join public.expressions e on e.id=d.expression_id join public.works w on w.id=e.work_id
where w.slug={sql_quote(work['slug'])} and d.edition_title={utf8_base64_sql(edition['edition_title'])}
on conflict (sha256) do update set edition_id=excluded.edition_id, byte_count=excluded.byte_count, media_type=excluded.media_type, storage_backend=excluded.storage_backend, storage_bucket=excluded.storage_bucket, storage_key=excluded.storage_key, provider=excluded.provider, provider_identifier=excluded.provider_identifier, source_url=excluded.source_url, provenance=excluded.provenance, completeness_status=excluded.completeness_status, rights_lane=excluded.rights_lane, rights_basis=excluded.rights_basis;"""
        )
    for passage in packet["passages"]:
        exact_text_sql = "null" if passage["exact_text"] is None else utf8_base64_sql(passage["exact_text"])
        statements.append(
            f"""insert into public.passages (source_object_id, source_ordinal, locator, language_code, script_code, exact_text, text_status, span_sha256, rights_lane, publication_state)
select s.id, {passage['source_ordinal']}, {json_utf8_base64_sql(passage['locator'])}, {sql_quote(passage['language_code'])}, {sql_quote(passage['script_code'])}, {exact_text_sql}, {sql_quote(passage['text_status'])}, {sql_quote(passage['span_sha256'])}, {sql_quote(rights['lane'])}, {sql_quote(structure['publication_state'])}
from public.source_objects s where s.sha256={sql_quote(OCR_SHA256)}
on conflict (source_object_id, source_ordinal) do update set locator=excluded.locator, language_code=excluded.language_code, script_code=excluded.script_code, exact_text=excluded.exact_text, text_status=excluded.text_status, span_sha256=excluded.span_sha256, rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;"""
        )
    statements.append("commit;")
    return "\n\n".join(statements) + "\n"


def compile_sql_batches(sql: str, batch_size: int = 8) -> list[str]:
    parts = sql.strip().split("\n\n")
    if parts[0] != "begin;" or parts[-1] != "commit;":
        raise ValueError("Compiled SQL transaction boundary is invalid")
    statements = parts[1:-1]
    return [
        "\n\n".join(["begin;", *statements[index : index + batch_size], "commit;"]) + "\n"
        for index in range(0, len(statements), batch_size)
    ]


def build_report(packet: dict[str, Any], sql: str, batches: list[str]) -> dict[str, Any]:
    passage_rows = [
        f"{row['source_ordinal']}\t{row['span_sha256']}\t{row['locator']['ocr_text_sha256']}\t{row['locator']['structural_role']}"
        for row in packet["passages"]
    ]
    return {
        "result": "PASS",
        "contract": CONTRACT,
        "pilot_id": packet["pilot_id"],
        "packet_sha256": packet["packet_sha256"],
        "sql_sha256": sha256_bytes(sql.encode("utf-8")),
        "sql_batch_count": len(batches),
        "sql_batch_sha256": [sha256_bytes(batch.encode("utf-8")) for batch in batches],
        "source_object_count": packet["source_object_count"],
        "source_bytes": sum(item["bytes"] for item in packet["source_objects"]),
        "passage_count": packet["passage_count"],
        "nonempty_ocr_passage_count": sum(row["exact_text"] is not None for row in packet["passages"]),
        "empty_ocr_pages": [row["source_ordinal"] for row in packet["passages"] if row["exact_text"] is None],
        "passage_content_root_sha256": sha256_bytes("\n".join(passage_rows).encode("utf-8")),
        "provider_page_number_discontinuities": packet["structure"]["provider_page_number_discontinuities"],
        "ritual_evidence_ranges": packet["structure"]["ritual_evidence_ranges"],
        "exact_positive_boundary": packet["scope_boundary"]["positive"],
        "safety_boundary": packet["safety_boundary"],
        "completion_denials": packet["completion_denials"],
        "ocr_product_ready": packet["rights"]["ocr_product_ready"],
        "source_payloads_copied": False,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Compile the fixed 1865 Marathi Nirnayasindhu scan and quarantined page-addressed OCR citation layer.")
    parser.add_argument("--plan", required=True, type=Path)
    parser.add_argument("--format", choices=("report", "sql-base64", "sql-batch", "sql-batch-base64"), default="report")
    parser.add_argument("--batch-index", type=int)
    parser.add_argument("--write-batches-dir", type=Path)
    parser.add_argument("--batch-size", type=int, default=8)
    args = parser.parse_args()
    plan_path = args.plan.resolve(strict=True)
    if not plan_path.is_relative_to((ROOT / "ingestion" / "plans").resolve()):
        raise ValueError("Plan must be inside ingestion/plans")
    packet = compile_packet(plan_path)
    sql = compile_sql(packet)
    if not 1 <= args.batch_size <= 64:
        raise ValueError("--batch-size must be between 1 and 64")
    batches = compile_sql_batches(sql, args.batch_size)
    if args.write_batches_dir is not None:
        output_dir = args.write_batches_dir.resolve()
        if not output_dir.is_relative_to((ROOT / "tmp").resolve()):
            raise ValueError("Generated batch directory must be inside tmp")
        output_dir.mkdir(parents=True, exist_ok=False)
        for index, batch in enumerate(batches):
            with (output_dir / f"batch-{index:03d}.sql").open("x", encoding="utf-8", newline="\n") as handle:
                handle.write(batch)
        manifest = {
            "contract": CONTRACT,
            "batch_count": len(batches),
            "batch_sha256": [sha256_bytes(batch.encode("utf-8")) for batch in batches],
        }
        with (output_dir / "manifest.json").open("x", encoding="utf-8", newline="\n") as handle:
            json.dump(manifest, handle, ensure_ascii=True, indent=2)
            handle.write("\n")
        sys.stdout.write(json.dumps(manifest, ensure_ascii=True) + "\n")
    elif args.format == "sql-base64":
        sys.stdout.write(base64.b64encode(sql.encode("utf-8")).decode("ascii"))
    elif args.format in ("sql-batch", "sql-batch-base64"):
        if args.batch_index is None or not 0 <= args.batch_index < len(batches):
            raise ValueError(f"--batch-index must be between 0 and {len(batches) - 1}")
        batch = batches[args.batch_index]
        sys.stdout.write(base64.b64encode(batch.encode("utf-8")).decode("ascii") if args.format.endswith("base64") else batch)
    else:
        sys.stdout.write(json.dumps(build_report(packet, sql, batches), ensure_ascii=True, indent=2) + "\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

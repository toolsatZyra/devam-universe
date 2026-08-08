from __future__ import annotations

import argparse
import base64
import hashlib
import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any

from compile_source_vault_tei_ingestion import (
    canonical_json,
    json_sql,
    read_verified_object,
    sql_quote,
    validate_append_only_vault,
)


ROOT = Path(__file__).resolve().parents[1]
CONTRACT = "DEVAM_MARKANDEYA_PURANA_PARGITER_1904_INGESTION_V1"
OCR_SHA256 = "13bdc99c6fa799eb68b6fe1526e6a696ad912c2d6a2c620022c07f40b31a531b"
PDF_SHA256 = "f7023e3aa0127b9a093b88664c68374da72d469e4f790c4a7bd4606a392e7300"
EXPECTED_ROLES = ["citation_image_pdf", "provider_ocr_text", "provider_ocr_xml", "provider_scandata"]


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def utf8_base64_sql(value: str) -> str:
    encoded = base64.b64encode(value.encode("utf-8")).decode("ascii")
    return f"convert_from(decode({sql_quote(encoded)}, 'base64'), 'UTF8')"


def json_utf8_base64_sql(value: Any) -> str:
    encoded = base64.b64encode(canonical_json(value).encode("utf-8")).decode("ascii")
    return f"convert_from(decode({sql_quote(encoded)}, 'base64'), 'UTF8')::jsonb"


def printed_page(page: int) -> str | None:
    if 44 <= page <= 773:
        return str(page - 43)
    return None


def structural_role(page: int) -> str:
    exact = {
        6: "title_page",
        8: "preface",
        43: "blank_separator",
        731: "main_text_end",
        732: "alternate_calcutta_ending",
        778: "binder_leaf",
    }
    if page in exact:
        return exact[page]
    if 10 <= page <= 29:
        return "introduction"
    if 30 <= page <= 39:
        return "contents"
    if 40 <= page <= 42:
        return "additions_and_corrections"
    if 44 <= page <= 508:
        return "main_translation"
    if 509 <= page <= 515:
        return "devimahatmya_context_canto_81"
    if 516 <= page <= 564:
        return "devimahatmya_proper_cantos_82_92"
    if 565 <= page <= 566:
        return "devimahatmya_context_canto_93"
    if 567 <= page <= 730:
        return "main_translation"
    if 733 <= page <= 773:
        return "index"
    if 774 <= page <= 777:
        return "blank_trailing_leaf"
    return "front_matter_or_scan_leaf"


def normalize_anchor(value: str) -> str:
    return " ".join(re.sub(r"[^A-Z0-9]+", " ", value.upper()).split())


def page_text(obj: ET.Element) -> str:
    lines = []
    for line in obj.findall(".//LINE"):
        text = " ".join((word.text or "") for word in line.findall(".//WORD")).strip()
        if text:
            lines.append(text)
    return "\n".join(lines)


def extract_page_passages(ocr_bytes: bytes, plan: dict[str, Any]) -> list[dict[str, Any]]:
    structure = plan["structure"]
    objects = ET.fromstring(ocr_bytes).findall(".//OBJECT")
    spans = list(re.finditer(rb"<OBJECT\b.*?</OBJECT>", ocr_bytes, re.DOTALL))
    expected = structure["ocr_object_count"]
    if len(objects) != expected or len(spans) != expected:
        raise ValueError(f"Expected {expected} OCR objects and spans, found {len(objects)} and {len(spans)}")

    prefix = ocr_bytes[: spans[0].start()]
    suffix = ocr_bytes[spans[-1].end() :]
    if len(prefix) != structure["ocr_xml_prefix_bytes"] or sha256_bytes(prefix) != structure["ocr_xml_prefix_sha256"]:
        raise ValueError("OCR XML prefix binding mismatch")
    if len(suffix) != structure["ocr_xml_suffix_bytes"] or sha256_bytes(suffix) != structure["ocr_xml_suffix_sha256"]:
        raise ValueError("OCR XML suffix binding mismatch")

    passages: list[dict[str, Any]] = []
    span_rows: list[str] = []
    for page, (obj, match) in enumerate(zip(objects, spans, strict=True), start=1):
        exact_text = page_text(obj)
        raw_span = match.group(0)
        span_sha = sha256_bytes(raw_span)
        span_rows.append(f"{page}\t{len(exact_text)}\t{span_sha}\t{match.start()}\t{match.end()}")
        passages.append(
            {
                "source_ordinal": page,
                "locator": {
                    "contract": "DEVAM_PAGE_ADDRESSED_QUARANTINED_OCR_V1",
                    "pdf_page": page,
                    "djvu_object_ordinal": page,
                    "printed_page": printed_page(page),
                    "structural_role": structural_role(page),
                    "xml_byte_start": match.start(),
                    "xml_byte_end_exclusive": match.end(),
                    "xml_line_start": ocr_bytes.count(b"\n", 0, match.start()) + 1,
                    "xml_line_end": ocr_bytes.count(b"\n", 0, match.end()) + 1,
                    "image_width": int(obj.get("width", "0")),
                    "image_height": int(obj.get("height", "0")),
                    "ocr_source_sha256": OCR_SHA256,
                    "pdf_image_source_sha256": PDF_SHA256,
                    "ocr_text_sha256": sha256_bytes(exact_text.encode("utf-8")),
                    "ocr_quarantined": True,
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
        raise ValueError(f"OCR empty-page profile mismatch: nonempty={nonempty}, empty={empty}")
    return passages


def validate_provider_derivatives(source_bytes: dict[str, bytes], plan: dict[str, Any]) -> None:
    scan_root = ET.fromstring(source_bytes["provider_scandata"])
    scan_pages = scan_root.findall(".//pageData/page")
    expected = plan["structure"]["scandata_leaf_count"]
    if len(scan_pages) != expected:
        raise ValueError(f"Expected {expected} scandata leaves, found {len(scan_pages)}")
    if [int(page.get("leafNum", "-1")) for page in scan_pages] != list(range(expected)):
        raise ValueError("Scandata leaf sequence is not exactly 0..777")
    if any(page.findtext("addToAccessFormats") != "true" for page in scan_pages):
        raise ValueError("Scandata excludes one or more leaves from access formats")

    objects = ET.fromstring(source_bytes["provider_ocr_xml"]).findall(".//OBJECT")
    pages = [page_text(obj) for obj in objects]
    page_anchors = {
        6: ["ASIATIC SOCIETY OF BENGAL", "F EDEN PARGITER", "1904"],
        8: ["PREFACE", "3RD DECEMBER 1904"],
        10: ["INTRODUCTION", "K M BANORJEA", "BIBLIO", "THECA INDICA IN 1862"],
        30: ["CONTENTS", "JAIMINI"],
        40: ["ADDITIONS AND CORKECTIONS"],
        44: ["MARKANDEYA PUR AN A", "REVERENCE TO THE ADORABLE VISHNU"],
        509: ["CANTO LXXXI"],
        516: ["CANTO LXXXII", "SLAUGHTER OF THE ARMY"],
        561: ["CANTO XCII"],
        565: ["CANTO XCIII", "CONCLUDED"],
        567: ["CANTO XCIV"],
        727: ["CANTO CXXXVII", "CONCLUSION"],
        731: ["END OF THE MARKANDEYA PARANA"],
        732: ["DIFFERENT ENDING", "CALCUTTA EDITION", "CANTO CXXXVI"],
        733: ["NOTE TO THE INDEX"],
    }
    for page, anchors in page_anchors.items():
        normalized = normalize_anchor(pages[page - 1])
        for anchor in anchors:
            if normalize_anchor(anchor) not in normalized:
                raise ValueError(f"OCR discovery anchor absent from page {page}: {anchor}")
    if any(pages[page - 1] for page in plan["structure"]["ocr_empty_pages"]):
        raise ValueError("Declared empty OCR pages are not empty")


def compile_packet(plan_path: Path) -> dict[str, Any]:
    plan = json.loads(plan_path.read_text(encoding="utf-8", errors="strict"))
    if plan.get("contract") != CONTRACT:
        raise ValueError(f"Unsupported contract: {plan.get('contract')}")
    validate_append_only_vault(plan["vault"])

    roles = [item["role"] for item in plan["source_objects"]]
    if roles != EXPECTED_ROLES or len(set(roles)) != len(roles):
        raise ValueError(f"Unexpected source role universe/order: {roles}")
    source_bytes = {item["role"]: read_verified_object(item) for item in plan["source_objects"]}
    if next(item["sha256"] for item in plan["source_objects"] if item["role"] == "provider_ocr_xml") != OCR_SHA256:
        raise ValueError("Canonical OCR XML hash drift")
    if plan["work"]["aggregate_rights_lane"] != "private_evidence" or plan["work"]["publication_state"] != "review":
        raise ValueError("Aggregate work boundary drift")
    if plan["rights"]["lane"] != "derivative_allowed" or plan["rights"]["ocr_product_ready"] is not False:
        raise ValueError("Rights or OCR quarantine boundary drift")
    if plan["rights"]["provider_top_level_rights"] is not None or plan["rights"]["provider_top_level_licenseurl"] is not None:
        raise ValueError("Top-level provider rights fields must remain null")
    if plan["structure"]["publication_state"] != "review" or plan["structure"]["text_status"] != "provider_ocr_quarantined_unreviewed":
        raise ValueError("Publication or OCR quarantine state drift")
    if any(value is not False for value in plan["completion_denials"].values()):
        raise ValueError("Every completion denial must remain false")
    if plan["structure"]["devimahatmya_boundary"]["proper_cantos"] != [82, 92]:
        raise ValueError("Devimahatmya proper boundary drift")

    validate_provider_derivatives(source_bytes, plan)
    passages = extract_page_passages(source_bytes["provider_ocr_xml"], plan)
    core = {
        key: plan[key]
        for key in (
            "contract", "pilot_id", "source_copy_policy", "work", "identity", "expression",
            "edition", "source_objects", "provider_evidence", "rights", "structure",
            "scope_boundary", "completion_denials", "vault",
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
        "product_geography_boundary": rights["product_geography_boundary"],
        "pdf_technical_restriction_observation": rights["pdf_technical_restriction_observation"],
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
        "completion_denials": packet["completion_denials"],
        "vault_snapshot": packet["vault"],
    }
    statements = [
        "begin;",
        f"""insert into public.works (slug, canonical_title, work_kind, tradition_scope, summary, rights_lane, publication_state)
values ({sql_quote(work['slug'])}, {utf8_base64_sql(work['canonical_title'])}, {sql_quote(work['work_kind'])}, array[{','.join(sql_quote(v) for v in work['tradition_scope'])}]::text[], {utf8_base64_sql(work['summary'])}, {sql_quote(work['aggregate_rights_lane'])}, {sql_quote(work['publication_state'])})
on conflict (slug) do update set canonical_title=excluded.canonical_title, work_kind=excluded.work_kind, tradition_scope=excluded.tradition_scope, summary=excluded.summary;""",
        f"""insert into public.expressions (work_id, language_code, script_code, expression_kind, attribution, is_source_original, ai_generated, rights_lane, publication_state)
select w.id, {sql_quote(expression['language_code'])}, {sql_quote(expression['script_code'])}, {sql_quote(expression['expression_kind'])}, {sql_quote(expression['attribution'])}, false, false, {sql_quote(rights['lane'])}, {sql_quote(structure['publication_state'])}
from public.works w where w.slug={sql_quote(work['slug'])}
and not exists (select 1 from public.expressions e where e.work_id=w.id and e.language_code={sql_quote(expression['language_code'])} and e.expression_kind={sql_quote(expression['expression_kind'])} and e.attribution={sql_quote(expression['attribution'])});""",
        f"""update public.expressions e set script_code={sql_quote(expression['script_code'])}, is_source_original=false, ai_generated=false, rights_lane={sql_quote(rights['lane'])}, publication_state={sql_quote(structure['publication_state'])}
from public.works w where e.work_id=w.id and w.slug={sql_quote(work['slug'])} and e.language_code={sql_quote(expression['language_code'])} and e.expression_kind={sql_quote(expression['expression_kind'])} and e.attribution={sql_quote(expression['attribution'])};""",
        f"""insert into public.editions (expression_id, edition_title, publisher, publication_place, publication_year, edition_statement, identifiers, rights_lane, publication_state)
select e.id, {utf8_base64_sql(edition['edition_title'])}, {utf8_base64_sql(edition['publisher'])}, {utf8_base64_sql(edition['publication_place'])}, {edition['publication_year']}, {utf8_base64_sql(edition['edition_statement'])}, {json_utf8_base64_sql(edition['identifiers'])}, {sql_quote(rights['lane'])}, {sql_quote(structure['publication_state'])}
from public.expressions e join public.works w on w.id=e.work_id where w.slug={sql_quote(work['slug'])} and e.expression_kind={sql_quote(expression['expression_kind'])}
and not exists (select 1 from public.editions d where d.expression_id=e.id and d.edition_title={utf8_base64_sql(edition['edition_title'])} and d.publication_year={edition['publication_year']});""",
    ]
    for source in packet["source_objects"]:
        provenance = {**provenance_base, "representation_role": source["role"], "object_path": source["object_path"]}
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
select s.id, {passage['source_ordinal']}, {json_sql(passage['locator'])}, {sql_quote(passage['language_code'])}, {sql_quote(passage['script_code'])}, {exact_text_sql}, {sql_quote(passage['text_status'])}, {sql_quote(passage['span_sha256'])}, {sql_quote(rights['lane'])}, {sql_quote(structure['publication_state'])}
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
        "\n\n".join(["begin;", *statements[index:index + batch_size], "commit;"]) + "\n"
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
        "devimahatmya_boundary": packet["structure"]["devimahatmya_boundary"],
        "exact_positive_boundary": packet["scope_boundary"]["positive"],
        "completion_denials": packet["completion_denials"],
        "ocr_product_ready": packet["rights"]["ocr_product_ready"],
        "source_payloads_copied": False,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Compile the fixed 1904 Pargiter Markandeya Purana scan and quarantined OCR citation layer.")
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
        if args.format == "sql-batch-base64":
            sys.stdout.write(base64.b64encode(batches[args.batch_index].encode("utf-8")).decode("ascii"))
        else:
            sys.stdout.write(batches[args.batch_index])
    else:
        sys.stdout.write(json.dumps(build_report(packet, sql, batches), ensure_ascii=True, indent=2) + "\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

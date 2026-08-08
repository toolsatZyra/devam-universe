from __future__ import annotations

import argparse
import base64
import collections
import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from tools.compile_source_vault_tei_ingestion import (
    ROOT,
    TEI_NS,
    canonical_json,
    json_sql,
    read_verified_object,
    sha256_bytes,
    sql_quote,
)


CONTRACT = "DEVAM_GRETIL_EMBEDDED_SECTION_INGESTION_V1"
COPY_POLICY = "reference_only_no_duplicate_payload"
XML_ID = "{http://www.w3.org/XML/1998/namespace}id"
XML_LANG = "{http://www.w3.org/XML/1998/namespace}lang"


def normalize(node: ET.Element) -> str:
    return " ".join("".join(node.itertext()).split())


def strict_utf8(data: bytes, label: str) -> str:
    try:
        text = data.decode("utf-8", errors="strict")
    except UnicodeDecodeError as exc:
        raise ValueError(f"{label} is not strict UTF-8") from exc
    if text.encode("utf-8") != data:
        raise ValueError(f"{label} fails UTF-8 byte roundtrip")
    return text


def dollar_quote(value: str) -> str:
    tag = f"$devam_{sha256_bytes(value.encode('utf-8'))[:16]}$"
    if tag in value:
        raise ValueError("Deterministic SQL dollar-quote tag collides with source text")
    return f"{tag}{value}{tag}"


def validate_plan(plan: dict[str, Any]) -> None:
    if plan.get("contract") != CONTRACT or plan.get("source_copy_policy") != COPY_POLICY:
        raise ValueError("Contract or reference-only policy drift")
    if plan["rights"] != {
        "lane": "private_evidence",
        "license": "CC-BY-NC-SA-4.0",
        "required_literal": "Distributed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.",
        "status": "noncommercial_sharealike_internal_review_only",
    }:
        raise ValueError("Rights contract drift")
    if not all(value is False for value in plan["completion_denials"].values()):
        raise ValueError("All broad completion and public-product claims must remain false")
    expression = plan["expression"]
    if expression["is_source_original"] is not False or expression["ai_generated"] is not False:
        raise ValueError("Electronic transcription identity drift")
    if plan["structure"]["publication_state"] != "review":
        raise ValueError("The packet must remain review-only")


def extract_chapters(tei_bytes: bytes, plan: dict[str, Any]) -> list[dict[str, Any]]:
    root = ET.fromstring(tei_bytes)
    title_nodes = root.findall(".//tei:titleStmt/tei:title", TEI_NS)
    if len(title_nodes) != 1 or normalize(title_nodes[0]) != plan["identity"]["tei_title"]:
        raise ValueError("TEI title identity drift")
    text_nodes = root.findall(".//tei:text", TEI_NS)
    if len(text_nodes) != 1 or text_nodes[0].get(XML_LANG) != plan["identity"]["tei_language"]:
        raise ValueError("TEI language identity drift")
    author_nodes = root.findall(".//tei:titleStmt/tei:author", TEI_NS)
    author_literal = None if len(author_nodes) == 1 and not normalize(author_nodes[0]) else normalize(author_nodes[0])
    if author_literal != plan["identity"]["source_author_literal"]:
        raise ValueError("Source-author literal drift")
    source_nodes = root.findall(".//tei:sourceDesc", TEI_NS)
    if len(source_nodes) != 1 or normalize(source_nodes[0]) != plan["identity"]["source_description_literal"]:
        raise ValueError("Source-description literal drift")
    availability = " ".join(normalize(node) for node in root.findall(".//tei:availability", TEI_NS))
    if plan["rights"]["required_literal"] not in availability:
        raise ValueError("Required noncommercial license literal is absent")

    div_nodes = root.findall(".//tei:div", TEI_NS)
    raw_divs = list(re.finditer(rb"<div>.*?</div>", tei_bytes, re.DOTALL))
    if len(div_nodes) != plan["structure"]["source_div_count"] or len(raw_divs) != len(div_nodes):
        raise ValueError("Source div universe drift")
    profiles = {row["chapter"]: row for row in plan["structure"]["chapter_profiles"]}
    expected_chapters = plan["structure"]["indexed_chapters"]
    if sorted(profiles) != expected_chapters or expected_chapters != list(range(81, 94)):
        raise ValueError("Indexed chapter universe drift")

    passages = []
    for node, match in zip(div_nodes, raw_divs, strict=True):
        node_text = normalize(node)
        refs = [(int(chapter), int(verse)) for chapter, verse in re.findall(r"MarkP_(\d+)\.(\d+)", node_text, re.I)]
        chapters = sorted(set(chapter for chapter, _ in refs))
        if len(chapters) != 1 or chapters[0] not in profiles:
            continue
        chapter = chapters[0]
        profile = profiles[chapter]
        numbers = [verse for ref_chapter, verse in refs if ref_chapter == chapter]
        missing = sorted(set(range(1, max(numbers) + 1)) - set(numbers))
        direct = collections.Counter(child.tag.split("}")[-1] for child in node)
        observed = {
            "chapter": chapter,
            "lg_count": direct["lg"],
            "direct_l_count": direct["l"],
            "reference_count": len(numbers),
            "last_reference": max(numbers),
            "missing_references": missing,
        }
        if observed != profile:
            raise ValueError(f"Chapter profile drift for {chapter}: {observed}")
        colophon_literals = re.findall(r"devīmāh[āa]tmye", node_text)
        if len(colophon_literals) != 1:
            raise ValueError(f"Devīmāhātmya colophon identity drift in chapter {chapter}")
        expected_literal = next(
            (literal for literal, chapters_for_literal in plan["structure"]["colophon_section_literal_variants"].items() if chapter in chapters_for_literal),
            None,
        )
        if colophon_literals[0] != expected_literal:
            raise ValueError(f"Devīmāhātmya colophon spelling drift in chapter {chapter}")
        start, end = match.span()
        exact_text = "\n".join(filter(None, (normalize(child) for child in node)))
        passages.append({
            "source_ordinal": chapter - 80,
            "chapter": chapter,
            "locator": {
                "contract": "DEVAM_TEI_CHAPTER_BYTE_SPAN_V1",
                "element": "div",
                "literal_marker": f"MarkP_{chapter}",
                "source_chapter": chapter,
                "byte_start": start,
                "byte_end_exclusive": end,
                "line_start": tei_bytes.count(b"\n", 0, start) + 1,
                "line_end": tei_bytes.count(b"\n", 0, end) + 1,
                "literal_reference_gap": profile["missing_references"],
            },
            "language_code": plan["expression"]["language_code"],
            "script_code": plan["expression"]["script_code"],
            "exact_text": exact_text,
            "span_sha256": sha256_bytes(tei_bytes[start:end]),
        })
    if [passage["chapter"] for passage in passages] != expected_chapters:
        raise ValueError("Exact Devīmāhātmya chapter order/coverage drift")
    if plan["structure"]["terminal_formula"] not in passages[-1]["exact_text"]:
        raise ValueError("Chapter 93 terminal formula is absent")
    return passages


def compile_packet(plan_path: Path) -> dict[str, Any]:
    plan = json.loads(plan_path.read_text(encoding="utf-8"))
    validate_plan(plan)
    sources = {source["role"]: source for source in plan["source_objects"]}
    if set(sources) != {"canonical_tei", "access_text", "access_html"} or len(plan["source_objects"]) != 3:
        raise ValueError("Exact three-representation source universe drift")
    source_bytes = {role: read_verified_object(source) for role, source in sources.items()}
    for role, data in source_bytes.items():
        strict_utf8(data, role)
    access_text = strict_utf8(source_bytes["access_text"], "access text")
    if plan["rights"]["required_literal"] not in access_text:
        raise ValueError("Plain-text rights literal drift")
    if f"   - {plan['identity']['access_text_source_literal']}" not in access_text:
        raise ValueError("Plain-text source placeholder drift")
    html = strict_utf8(source_bytes["access_html"], "access HTML")
    if "https://creativecommons.org/licenses/by-nc-sa/4.0/" not in html or "Attribution-NonCommercial-ShareAlike 4.0" not in html:
        raise ValueError("HTML rights evidence drift")
    observations = {row["role"]: row for row in plan["live_observations"]}
    if set(observations) != set(sources) or len(plan["live_observations"]) != 3:
        raise ValueError("Live/source representation universe mismatch")
    for role, source in sources.items():
        row = observations[role]
        if row != {
            "role": role,
            "status": 200,
            "final_url": source["source_url"],
            "bytes": source["bytes"],
            "sha256": source["sha256"],
            "strict_utf8": True,
            "license_evidence_present": True,
        }:
            raise ValueError(f"Live observation drift for {role}")
    passages = extract_chapters(source_bytes["canonical_tei"], plan)
    core = {**plan, "passages": passages, "source_object_count": 3, "passage_count": len(passages)}
    return {**core, "packet_sha256": sha256_bytes(canonical_json(core).encode("utf-8"))}


def compile_sql(packet: dict[str, Any]) -> str:
    work = packet["work"]
    expression = packet["expression"]
    edition = packet["edition"]
    rights = packet["rights"]
    structure = packet["structure"]
    statements = [
        "begin;",
        f"""insert into public.works (slug, canonical_title, work_kind, tradition_scope, summary, rights_lane, publication_state)
values ({sql_quote(work['slug'])}, {sql_quote(work['canonical_title'])}, {sql_quote(work['work_kind'])}, array[{','.join(sql_quote(value) for value in work['tradition_scope'])}]::text[], {sql_quote(work['summary'])}, {sql_quote(rights['lane'])}, 'review')
on conflict (slug) do update set canonical_title=excluded.canonical_title, work_kind=excluded.work_kind, tradition_scope=excluded.tradition_scope, summary=excluded.summary, rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;""",
        f"""insert into public.expressions (work_id, language_code, script_code, expression_kind, attribution, is_source_original, ai_generated, rights_lane, publication_state)
select w.id, {sql_quote(expression['language_code'])}, {sql_quote(expression['script_code'])}, {sql_quote(expression['expression_kind'])}, {sql_quote(expression['attribution'])}, false, false, {sql_quote(rights['lane'])}, 'review'
from public.works w where w.slug={sql_quote(work['slug'])}
and not exists (select 1 from public.expressions e where e.work_id=w.id and e.language_code={sql_quote(expression['language_code'])} and e.expression_kind={sql_quote(expression['expression_kind'])} and e.attribution={sql_quote(expression['attribution'])});""",
        f"""update public.expressions e set script_code={sql_quote(expression['script_code'])}, is_source_original=false, ai_generated=false, rights_lane={sql_quote(rights['lane'])}, publication_state='review'
from public.works w where e.work_id=w.id and w.slug={sql_quote(work['slug'])} and e.language_code={sql_quote(expression['language_code'])} and e.expression_kind={sql_quote(expression['expression_kind'])} and e.attribution={sql_quote(expression['attribution'])};""",
        f"""insert into public.editions (expression_id, edition_title, publisher, publication_place, publication_year, edition_statement, identifiers, rights_lane, publication_state)
select e.id, {sql_quote(edition['edition_title'])}, {sql_quote(edition['publisher'])}, {sql_quote(edition['publication_place'])}, {edition['publication_year']}, {sql_quote(edition['edition_statement'])}, {json_sql(edition['identifiers'])}, {sql_quote(rights['lane'])}, 'review'
from public.expressions e join public.works w on w.id=e.work_id where w.slug={sql_quote(work['slug'])}
and not exists (select 1 from public.editions d where d.expression_id=e.id and d.edition_title={sql_quote(edition['edition_title'])});""",
    ]
    rights_basis = {"license": rights["license"], "literal": rights["required_literal"], "status": rights["status"], "live_observations": packet["live_observations"]}
    for source in packet["source_objects"]:
        provenance = {
            "ingestion_contract": CONTRACT,
            "ingestion_pilot_id": packet["pilot_id"],
            "ingestion_packet_sha256": packet["packet_sha256"],
            "source_copy_policy": COPY_POLICY,
            "representation_role": source["role"],
            "object_path": source["object_path"],
            "source_identity": packet["identity"],
            "completion_denials": packet["completion_denials"],
        }
        statements.append(f"""insert into public.source_objects (edition_id, sha256, byte_count, media_type, storage_backend, storage_bucket, storage_key, provider, provider_identifier, source_url, acquired_at, provenance, completeness_status, rights_lane, rights_basis)
select d.id, {sql_quote(source['sha256'])}, {source['bytes']}, {sql_quote(source['media_type'])}, 'local_vault', null, {sql_quote(source['object_path'])}, {sql_quote(packet['provider']['name'])}, {sql_quote('sa_mArkaNDeyapurANa1-93:' + source['role'])}, {sql_quote(source['source_url'])}, {sql_quote(packet['provider']['acquired_at'])}::timestamptz, {json_sql(provenance)}, {sql_quote(structure['source_completeness_status'])}, {sql_quote(rights['lane'])}, {json_sql(rights_basis)}
from public.editions d join public.expressions e on e.id=d.expression_id join public.works w on w.id=e.work_id where w.slug={sql_quote(work['slug'])} and d.edition_title={sql_quote(edition['edition_title'])}
on conflict (sha256) do update set edition_id=excluded.edition_id, byte_count=excluded.byte_count, media_type=excluded.media_type, storage_backend=excluded.storage_backend, storage_bucket=excluded.storage_bucket, storage_key=excluded.storage_key, provider=excluded.provider, provider_identifier=excluded.provider_identifier, source_url=excluded.source_url, acquired_at=excluded.acquired_at, provenance=excluded.provenance, completeness_status=excluded.completeness_status, rights_lane=excluded.rights_lane, rights_basis=excluded.rights_basis;""")
    canonical_sha = next(source["sha256"] for source in packet["source_objects"] if source["role"] == "canonical_tei")
    for passage in packet["passages"]:
        statements.append(f"""insert into public.passages (source_object_id, source_ordinal, locator, language_code, script_code, exact_text, text_status, span_sha256, rights_lane, publication_state)
select s.id, {passage['source_ordinal']}, {json_sql(passage['locator'])}, {sql_quote(passage['language_code'])}, {sql_quote(passage['script_code'])}, {dollar_quote(passage['exact_text'])}, {sql_quote(structure['text_status'])}, {sql_quote(passage['span_sha256'])}, {sql_quote(rights['lane'])}, 'review'
from public.source_objects s where s.sha256={sql_quote(canonical_sha)}
on conflict (source_object_id, source_ordinal) do update set locator=excluded.locator, language_code=excluded.language_code, script_code=excluded.script_code, exact_text=excluded.exact_text, text_status=excluded.text_status, span_sha256=excluded.span_sha256, rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;""")
    statements.append("commit;")
    return "\n\n".join(statements) + "\n"


def compile_batches(sql: str, batch_size: int = 1) -> list[str]:
    parts = sql.strip().split("\n\n")
    if parts[0] != "begin;" or parts[-1] != "commit;":
        raise ValueError("Invalid transaction boundaries")
    body = parts[1:-1]
    return ["\n\n".join(["begin;", *body[i:i + batch_size], "commit;"]) + "\n" for i in range(0, len(body), batch_size)]


def passage_root(packet: dict[str, Any]) -> str:
    rows = [f"{p['chapter']}\t{p['span_sha256']}\t{sha256_bytes(p['exact_text'].encode('utf-8'))}" for p in packet["passages"]]
    return sha256_bytes("\n".join(rows).encode("utf-8"))


def main() -> int:
    parser = argparse.ArgumentParser(description="Compile the GRETIL Devīmāhātmya embedded-section packet.")
    parser.add_argument("--plan", required=True, type=Path)
    parser.add_argument("--format", choices=("report", "sql-base64", "sql-batch-base64"), default="report")
    parser.add_argument("--batch-index", type=int)
    args = parser.parse_args()
    path = args.plan.resolve(strict=True)
    if not path.is_relative_to(ROOT / "ingestion" / "plans"):
        raise ValueError("Plan must be inside ingestion/plans")
    packet = compile_packet(path)
    sql = compile_sql(packet)
    batches = compile_batches(sql)
    if args.format == "sql-base64":
        sys.stdout.write(base64.b64encode(sql.encode("utf-8")).decode("ascii"))
    elif args.format == "sql-batch-base64":
        if args.batch_index is None or not 0 <= args.batch_index < len(batches):
            raise ValueError("Invalid batch index")
        sys.stdout.write(base64.b64encode(batches[args.batch_index].encode("utf-8")).decode("ascii"))
    else:
        report = {
            "result": "PASS",
            "contract": CONTRACT,
            "pilot_id": packet["pilot_id"],
            "packet_sha256": packet["packet_sha256"],
            "sql_sha256": sha256_bytes(sql.encode("utf-8")),
            "sql_batch_count": len(batches),
            "sql_batch_sha256": [sha256_bytes(batch.encode("utf-8")) for batch in batches],
            "source_object_count": packet["source_object_count"],
            "source_object_bytes": sum(source["bytes"] for source in packet["source_objects"]),
            "passage_count": packet["passage_count"],
            "passage_content_root_sha256": passage_root(packet),
            "indexed_chapters": [passage["chapter"] for passage in packet["passages"]],
            "chapter_86_reference_gap": packet["structure"]["chapter_profiles"][5]["missing_references"],
            "source_payloads_copied": False,
            "complete_markandeya_purana": False,
            "complete_devimahatmya_tradition_or_all_recensions": False,
            "durga_hero_universe_complete": False,
            "mvp_library_complete": False,
            "public_product_clearance": False,
        }
        print(json.dumps(report, ensure_ascii=False, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

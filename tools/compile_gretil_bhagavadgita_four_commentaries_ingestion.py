from __future__ import annotations

import argparse
import base64
import csv
import json
import re
import sys
import unicodedata
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
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
    validate_append_only_vault,
)


CONTRACT = "DEVAM_GRETIL_BHAGAVADGITA_FOUR_COMMENTARIES_INGESTION_V1"
COPY_POLICY = "reference_only_no_duplicate_payload"
LOCATOR_CONTRACT = "DEVAM_GRETIL_TEI_DIV_BYTE_SPAN_V1"
XML_ID = "{http://www.w3.org/XML/1998/namespace}id"
XML_LANG = "{http://www.w3.org/XML/1998/namespace}lang"
DIV_RAW = re.compile(rb"<div>.*?</div>", re.DOTALL)
MARKER = re.compile(r"\bBhG\s+(\d+)\.(\d+)(?:-(\d+))?")
EXPECTED_ROLES = {"canonical_tei", "access_text", "access_html"}
COMMENTARY_KEYS = ("sridhara", "madhusudana", "visvanatha", "baladeva")
RIGHTS = {
    "lane": "private_evidence",
    "license": "CC-BY-NC-SA-4.0",
    "required_literal": "Distributed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.",
    "status": "noncommercial_sharealike_internal_review_only",
    "product_clearance": False,
    "public_exact_text_search": False,
}


def normalize(node: ET.Element) -> str:
    return " ".join("".join(node.itertext()).split())


def ascii_fold(value: str) -> str:
    return "".join(
        char for char in unicodedata.normalize("NFKD", value)
        if not unicodedata.combining(char)
    ).lower()


def strict_utf8(data: bytes, label: str) -> str:
    try:
        text = data.decode("utf-8", errors="strict")
    except UnicodeDecodeError as exc:
        raise ValueError(f"{label} is not strict UTF-8") from exc
    if text.encode("utf-8") != data:
        raise ValueError(f"{label} fails UTF-8 byte roundtrip")
    return text


def utf8_base64_sql(value: str) -> str:
    encoded = base64.b64encode(value.encode("utf-8")).decode("ascii")
    return f"convert_from(decode('{encoded}', 'base64'), 'UTF8')"


def catalog_row(path: Path, key: str, value: str) -> dict[str, str]:
    with path.open(encoding="utf-8-sig", newline="") as handle:
        rows = [row for row in csv.DictReader(handle) if row.get(key) == value]
    if len(rows) != 1:
        raise ValueError(f"Expected one catalog row for {key}={value}")
    return rows[0]


def verified_local_evidence(record: dict[str, Any]) -> None:
    relative = Path(record["path"])
    if relative.is_absolute() or ".." in relative.parts:
        raise ValueError(f"Unsafe retained-evidence path: {relative}")
    path = (ROOT / relative).resolve(strict=True)
    if not path.is_relative_to(ROOT.resolve()):
        raise ValueError(f"Retained evidence escapes repository: {relative}")
    data = path.read_bytes()
    if len(data) != record["bytes"] or sha256_bytes(data) != record["sha256"]:
        raise ValueError(f"Retained evidence drift: {relative}")


def validate_plan(plan: dict[str, Any]) -> None:
    if plan.get("contract") != CONTRACT or plan.get("source_copy_policy") != COPY_POLICY:
        raise ValueError("Contract or source-copy policy drift")
    if plan["provider"]["provider_item_id"] != "GRE-00078" or plan["provider"]["legacy_queue_id"] != "AQ-00702":
        raise ValueError("Provider route drift")
    if plan["rights"] != RIGHTS:
        raise ValueError("Rights boundary drift")
    if plan["work"]["slug"] != "bhagavad-gita" or plan["work"]["work_kind"] != "scripture":
        raise ValueError("Work identity drift")
    identity = plan["identity"]
    if identity["named_commentators"] != ["Śrīdhara", "Madhusūdana", "Viśvanātha", "Baladeva"]:
        raise ValueError("Named-commentator identity or order drift")
    if identity["parent_work"] != "Mahābhārata" or identity["parent_location_identified_in_carrier"] is not False:
        raise ValueError("Parent-work boundary drift")
    if identity["underlying_source_edition_identified"] is not False or identity["source_description_literal"] != "":
        raise ValueError("Underlying source-edition boundary drift")
    if plan["expression"]["is_source_original"] or plan["expression"]["ai_generated"]:
        raise ValueError("Expression identity drift")
    if set(plan["completion_denials"]) != {
        "underlying_source_editions_identified",
        "all_four_commentaries_complete",
        "literal_marker_sequence_proves_verse_completeness",
        "complete_bhagavadgita_textual_tradition",
        "complete_mahabharata",
        "all_editions_recensions_translations_commentaries_and_living_traditions",
        "product_or_public_use_cleared",
        "public_exact_text_search_enabled",
        "sarthi_may_quote_or_republish_private_source_text",
        "gita_jayanti_reading_guide_is_source_text",
        "mvp_library_complete",
    } or any(plan["completion_denials"].values()):
        raise ValueError("Completion denial universe drift")
    structure = plan["structure"]
    if structure["publication_state"] != "review" or structure["status"] != "exact_636_div_carrier_covered_with_literal_marker_and_commentary_defects":
        raise ValueError("Structure publication boundary drift")
    deficit = structure["explicit_commentary_deficit"]
    if deficit != {
        "commentator": "Viśvanātha",
        "verse_range": "18.74-18.78",
        "source_paragraph_sha256": "fa75512d3fcf000fbbb4ed8f206eff91f0b00c5da4c234451a727abe4e8c36de",
        "source_says_final_five_verse_explanations_not_recopied": True,
    }:
        raise ValueError("Explicit Viśvanātha deficit boundary drift")

    evidence = plan["catalog_evidence"]
    provider_path = ROOT / evidence["provider_catalog_path"]
    lead_path = ROOT / evidence["source_leads_path"]
    if sha256_bytes(provider_path.read_bytes()) != evidence["provider_catalog_sha256"]:
        raise ValueError("Provider catalog drift")
    if sha256_bytes(lead_path.read_bytes()) != evidence["source_leads_sha256"]:
        raise ValueError("Source-leads catalog drift")
    provider = catalog_row(provider_path, "gretil_item_id", evidence["provider_row_key"])
    lead = catalog_row(lead_path, "queue_id", evidence["source_lead_key"])
    if sha256_bytes(canonical_json(provider).encode()) != evidence["provider_row_sha256"]:
        raise ValueError("Exact provider row drift")
    if sha256_bytes(canonical_json(lead).encode()) != evidence["source_lead_row_sha256"]:
        raise ValueError("Exact source-lead row drift")
    if provider["downloadable_url_count"] != "3" or lead["source_record_id"] != "GRE-00078":
        raise ValueError("Three-representation catalog universe drift")
    expected_urls = {row["source_url"] for row in plan["source_objects"]}
    if set(provider["downloadable_urls"].split(" | ")) != expected_urls:
        raise ValueError("Provider URL universe drift")
    if len(plan["held_separate_sources"]) != 4:
        raise ValueError("Held-source boundary drift")
    for item in plan["retained_evidence"]:
        verified_local_evidence(item)
    validate_append_only_vault(plan["vault"])


def classify_div(source_ordinal: int, text: str) -> dict[str, Any]:
    marker = MARKER.search(text)
    if marker:
        chapter, verse_start, verse_end = marker.groups()
        return {
            "structural_role": "verse_commentary_unit",
            "literal_marker": marker.group(0),
            "marker_status": "literal_bhg_marker",
            "chapter": int(chapter),
            "verse_start": int(verse_start),
            "verse_end": int(verse_end or verse_start),
        }
    if source_ordinal == 438 and text.startswith("Verses6-7"):
        return {
            "structural_role": "verse_commentary_unit_marker_anomaly",
            "literal_marker": "Verses6-7",
            "marker_status": "chapter_context_inferred_from_bounding_source_order",
            "chapter": 12,
            "verse_start": 6,
            "verse_end": 7,
        }
    if source_ordinal == 475 and text.startswith("[*ENDNOTE]"):
        return {
            "structural_role": "endnote_unit",
            "literal_marker": None,
            "marker_status": "no_verse_marker",
            "chapter": None,
            "verse_start": None,
            "verse_end": None,
        }
    if source_ordinal == 636 and text == "":
        return {
            "structural_role": "empty_terminal_div",
            "literal_marker": None,
            "marker_status": "no_verse_marker",
            "chapter": None,
            "verse_start": None,
            "verse_end": None,
        }
    raise ValueError(f"Unclassified source div {source_ordinal}: {text[:100]}")


def derived_chapter_profiles(passages: list[dict[str, Any]]) -> list[dict[str, Any]]:
    conventional_reference = [47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 35, 27, 20, 24, 28, 78]
    coverage: dict[int, list[int]] = defaultdict(list)
    for passage in passages:
        locator = passage["locator"]
        if locator["chapter"] is not None:
            coverage[locator["chapter"]].extend(range(locator["verse_start"], locator["verse_end"] + 1))
    profiles = []
    for chapter, expected in enumerate(conventional_reference, 1):
        labels = coverage[chapter]
        frequencies = Counter(labels)
        profiles.append({
            "chapter": chapter,
            "source_unit_count": sum(row["locator"]["chapter"] == chapter for row in passages),
            "expanded_literal_marker_count": len(labels),
            "expected_conventional_verse_count_reference_only": expected,
            "missing_literal_marker_numbers": [number for number in range(1, expected + 1) if frequencies[number] == 0],
            "duplicate_literal_marker_numbers": [number for number in range(1, expected + 1) if frequencies[number] > 1],
            "out_of_range_literal_marker_numbers": [number for number in labels if number < 1 or number > expected],
        })
    return profiles


def extract_passages(tei: bytes, plan: dict[str, Any]) -> list[dict[str, Any]]:
    root = ET.fromstring(tei)
    identity = plan["identity"]
    title = root.find(".//tei:titleStmt/tei:title", TEI_NS)
    author = root.find(".//tei:titleStmt/tei:author", TEI_NS)
    source = root.find(".//tei:sourceDesc", TEI_NS)
    text_node = root.find(".//tei:text", TEI_NS)
    date = root.find(".//tei:publicationStmt/tei:date", TEI_NS)
    if title is None or normalize(title) != identity["tei_title"]:
        raise ValueError("TEI title drift")
    if author is None or normalize(author) != identity["tei_author_literal"]:
        raise ValueError("TEI author literal drift")
    if source is None or normalize(source) != identity["source_description_literal"]:
        raise ValueError("TEI source description drift")
    if root.get(XML_ID) != identity["tei_xml_id"] or text_node is None or text_node.get(XML_LANG) != identity["tei_language"]:
        raise ValueError("TEI root or language drift")
    if date is None or date.get("when-iso") != identity["publication_date"]:
        raise ValueError("TEI publication-date drift")
    availability = root.find(".//tei:availability", TEI_NS)
    if availability is None or RIGHTS["required_literal"] not in normalize(availability):
        raise ValueError("TEI licence literal drift")
    responses = [normalize(node) for node in root.findall(".//tei:respStmt", TEI_NS)]
    expected_responses = [
        f"data entry {identity['data_entry']}",
        f"contribution to GRETIL {identity['gretil_contribution']}",
        f"initial normalization and conversion to legacy GRETIL formats {identity['legacy_normalization']}",
        f"normalization and conversion to TEI-conformant markup {identity['tei_conversion']}",
    ]
    if responses != expected_responses:
        raise ValueError("Contributor role/order drift")

    divs = root.findall(".//tei:text/tei:body/tei:div", TEI_NS)
    raw_divs = list(DIV_RAW.finditer(tei))
    if len(divs) != 636 or len(raw_divs) != len(divs):
        raise ValueError("Exact 636-div parsed/raw universe drift")
    passages: list[dict[str, Any]] = []
    layer_counts: Counter[str] = Counter()
    for source_ordinal, (div, raw_div) in enumerate(zip(divs, raw_divs, strict=True), 1):
        exact_text = normalize(div)
        classification = classify_div(source_ordinal, exact_text)
        folded = ascii_fold(exact_text)
        observed_layers = [key for key in COMMENTARY_KEYS if key in folded]
        layer_counts.update(observed_layers)
        start, end = raw_div.span()
        passages.append({
            "source_ordinal": source_ordinal,
            "locator": {
                "contract": LOCATOR_CONTRACT,
                **classification,
                "commentary_labels_observed": observed_layers,
                "byte_start": start,
                "byte_end_exclusive": end,
                "line_start": tei.count(b"\n", 0, start) + 1,
                "line_end": tei.count(b"\n", 0, end) + 1,
            },
            "language_code": plan["expression"]["language_code"],
            "script_code": plan["expression"]["script_code"],
            "exact_text": exact_text,
            "span_sha256": sha256_bytes(raw_div.group()),
        })

    structure = plan["structure"]
    profiles = derived_chapter_profiles(passages)
    special = [{
        "source_ordinal": row["source_ordinal"],
        "role": row["locator"]["structural_role"],
        "literal_marker": row["locator"]["literal_marker"],
        **({"contextual_chapter": row["locator"]["chapter"], "verse_start": row["locator"]["verse_start"], "verse_end": row["locator"]["verse_end"]} if row["source_ordinal"] == 438 else {}),
        "status": row["locator"]["marker_status"],
    } for row in passages if row["source_ordinal"] in {438, 475, 636}]
    counts = {
        "source_div_count": len(divs),
        "passage_count": len(passages),
        "verse_commentary_unit_count": sum(row["locator"]["structural_role"].startswith("verse_commentary") for row in passages),
        "standard_bhg_marker_unit_count": sum(row["locator"]["marker_status"] == "literal_bhg_marker" for row in passages),
        "marker_anomaly_unit_count": sum(row["locator"]["structural_role"] == "verse_commentary_unit_marker_anomaly" for row in passages),
        "endnote_unit_count": sum(row["locator"]["structural_role"] == "endnote_unit" for row in passages),
        "empty_terminal_div_count": sum(row["locator"]["structural_role"] == "empty_terminal_div" for row in passages),
        "expanded_literal_marker_count": sum(profile["expanded_literal_marker_count"] for profile in profiles),
    }
    if any(structure[key] != value for key, value in counts.items()):
        raise ValueError(f"Structure count drift: {counts}")
    if structure["commentary_label_unit_counts"] != dict(layer_counts):
        raise ValueError("Observed commentary-label counts drift")
    if special != structure["special_units"]:
        raise ValueError("Special source-unit identity drift")
    if profiles != structure["chapter_profiles"]:
        raise ValueError("Literal chapter-marker profile drift")
    if sha256_bytes(canonical_json(profiles).encode()) != structure["chapter_profiles_sha256"]:
        raise ValueError("Chapter-profile root drift")
    span_root = sha256_bytes("\n".join(
        f"{row['source_ordinal']}\t{row['locator']['byte_start']}\t{row['locator']['byte_end_exclusive']}\t{row['span_sha256']}"
        for row in passages
    ).encode())
    content_root = sha256_bytes("\n".join(
        f"{row['source_ordinal']}\t{row['span_sha256']}\t{sha256_bytes(row['exact_text'].encode())}"
        for row in passages
    ).encode())
    marker_root = sha256_bytes("\n".join(
        f"{row['source_ordinal']}\t{row['locator']['literal_marker']}\t{row['locator']['marker_status']}\t{row['locator']['chapter']}\t{row['locator']['verse_start']}\t{row['locator']['verse_end']}"
        for row in passages
    ).encode())
    if (span_root, content_root, marker_root) != (
        structure["source_div_span_root_sha256"],
        structure["source_div_content_root_sha256"],
        structure["marker_root_sha256"],
    ):
        raise ValueError("Global source-div root drift")

    deficit_paragraphs = [
        normalize(node) for node in root.findall(".//tei:p", TEI_NS)
        if "panca-sloka-vyakhya" in ascii_fold(normalize(node))
    ]
    if len(deficit_paragraphs) != 1:
        raise ValueError("Expected one explicit final-five-verse deficit paragraph")
    if sha256_bytes(deficit_paragraphs[0].encode()) != structure["explicit_commentary_deficit"]["source_paragraph_sha256"]:
        raise ValueError("Explicit Viśvanātha deficit paragraph drift")
    return passages


def compile_packet(plan_path: Path) -> dict[str, Any]:
    plan = json.loads(plan_path.read_text(encoding="utf-8"))
    validate_plan(plan)
    sources = {row["role"]: row for row in plan["source_objects"]}
    if set(sources) != EXPECTED_ROLES or len(sources) != 3:
        raise ValueError("Exact three-representation source universe drift")
    source_bytes = {role: read_verified_object(row) for role, row in sources.items()}
    for role, data in source_bytes.items():
        text = strict_utf8(data, role)
        if " ".join(RIGHTS["required_literal"].split()) not in " ".join(text.split()):
            raise ValueError(f"Licence literal absent from {role}")
    observations = {row["role"]: row for row in plan["live_observations"]}
    if set(observations) != EXPECTED_ROLES:
        raise ValueError("Live observation universe drift")
    for role, source in sources.items():
        observation = observations[role]
        expected = {
            "role": role,
            "observed_at": "2026-08-07T01:37:46.8753037Z",
            "status": 200,
            "final_url": source["source_url"],
            "bytes": source["bytes"],
            "sha256": source["sha256"],
            "strict_utf8": True,
            "license_evidence_present": True,
        }
        if observation != expected:
            raise ValueError(f"Live observation drift for {role}")
    passages = extract_passages(source_bytes["canonical_tei"], plan)
    core = {**plan, "passages": passages, "source_object_count": 3, "passage_count": len(passages)}
    return {**core, "packet_sha256": sha256_bytes(canonical_json(core).encode())}


def compile_statements(packet: dict[str, Any]) -> list[str]:
    work = packet["work"]
    expression = packet["expression"]
    edition = packet["edition"]
    rights = packet["rights"]
    structure = packet["structure"]
    statements = [
        f"""insert into public.works (slug, canonical_title, work_kind, tradition_scope, summary, rights_lane, publication_state) values ({sql_quote(work['slug'])}, {sql_quote(work['canonical_title'])}, {sql_quote(work['work_kind'])}, array[{','.join(sql_quote(value) for value in work['tradition_scope'])}]::text[], {sql_quote(work['summary'])}, 'private_evidence', 'review') on conflict (slug) do update set canonical_title=excluded.canonical_title, work_kind=excluded.work_kind, tradition_scope=excluded.tradition_scope, summary=excluded.summary;""",
        f"""insert into public.expressions (work_id, language_code, script_code, expression_kind, attribution, is_source_original, ai_generated, rights_lane, publication_state) select w.id, {sql_quote(expression['language_code'])}, {sql_quote(expression['script_code'])}, {sql_quote(expression['expression_kind'])}, {sql_quote(expression['attribution'])}, false, false, 'private_evidence', 'review' from public.works w where w.slug={sql_quote(work['slug'])} and not exists (select 1 from public.expressions e where e.work_id=w.id and e.language_code={sql_quote(expression['language_code'])} and e.expression_kind={sql_quote(expression['expression_kind'])} and e.attribution={sql_quote(expression['attribution'])});""",
        f"""update public.expressions e set script_code={sql_quote(expression['script_code'])}, is_source_original=false, ai_generated=false, rights_lane='private_evidence', publication_state='review' from public.works w where e.work_id=w.id and w.slug={sql_quote(work['slug'])} and e.language_code={sql_quote(expression['language_code'])} and e.expression_kind={sql_quote(expression['expression_kind'])} and e.attribution={sql_quote(expression['attribution'])};""",
        f"""insert into public.editions (expression_id, edition_title, publisher, publication_place, publication_year, edition_statement, identifiers, rights_lane, publication_state) select e.id, {sql_quote(edition['edition_title'])}, {sql_quote(edition['publisher'])}, {sql_quote(edition['publication_place'])}, {edition['publication_year']}, {sql_quote(edition['edition_statement'])}, {json_sql(edition['identifiers'])}, 'private_evidence', 'review' from public.expressions e join public.works w on w.id=e.work_id where w.slug={sql_quote(work['slug'])} and e.language_code={sql_quote(expression['language_code'])} and e.expression_kind={sql_quote(expression['expression_kind'])} and e.attribution={sql_quote(expression['attribution'])} and not exists (select 1 from public.editions d where d.expression_id=e.id and d.edition_title={sql_quote(edition['edition_title'])});""",
        """insert into public.entities (slug, entity_kind, canonical_name, description, rights_lane, publication_state) values ('bhagavad-gita', 'scripture', 'Bhagavadgītā', 'Canonical work identity; source editions and interpretations remain separately attributable.', 'private_evidence', 'review') on conflict (slug) do update set canonical_name=excluded.canonical_name, entity_kind=excluded.entity_kind;""",
        """insert into public.entities (slug, entity_kind, canonical_name, description, rights_lane, publication_state) values ('mahabharata', 'epic', 'Mahābhārata', 'Canonical epic identity; recensions, editions, translations, and regional traditions remain separate.', 'private_evidence', 'review') on conflict (slug) do update set canonical_name=excluded.canonical_name, entity_kind=excluded.entity_kind;""",
        f"""insert into public.relationships (subject_entity_id, predicate, object_entity_id, claim_id, applicability, rights_lane, publication_state) select subject.id, 'part_of', object.id, null, {json_sql({'evidence_class': 'provider_catalogue_hierarchy', 'provider_item_id': packet['provider']['provider_item_id'], 'provider_row_sha256': packet['catalog_evidence']['provider_row_sha256'], 'boundary': 'Metadata route only; the exact Mahabharata parent location is not identified in this carrier.'})}, 'private_evidence', 'review' from public.entities subject cross join public.entities object where subject.slug='bhagavad-gita' and object.slug='mahabharata' on conflict (subject_entity_id, predicate, object_entity_id, claim_id) do update set applicability=excluded.applicability, rights_lane='private_evidence', publication_state='review';""",
    ]
    rights_basis = {**rights, "live_observations": packet["live_observations"]}
    for source in packet["source_objects"]:
        provenance = {
            "ingestion_contract": CONTRACT,
            "ingestion_pilot_id": packet["pilot_id"],
            "ingestion_packet_sha256": packet["packet_sha256"],
            "source_copy_policy": COPY_POLICY,
            "representation_role": source["role"],
            "object_path": source["object_path"],
            "source_identity": packet["identity"],
            "catalog_evidence": packet["catalog_evidence"],
            "retained_evidence": packet["retained_evidence"],
            "held_separate_sources": packet["held_separate_sources"],
            "completion_denials": packet["completion_denials"],
        }
        statements.append(
            f"""insert into public.source_objects (edition_id, sha256, byte_count, media_type, storage_backend, storage_bucket, storage_key, provider, provider_identifier, source_url, acquired_at, provenance, completeness_status, rights_lane, rights_basis) select d.id, {sql_quote(source['sha256'])}, {source['bytes']}, {sql_quote(source['media_type'])}, 'local_vault', null, {sql_quote(source['object_path'])}, 'GRETIL', {sql_quote('gretil:GRE-00078:' + source['role'])}, {sql_quote(source['source_url'])}, {sql_quote(packet['provider']['acquired_at'])}::timestamptz, {json_sql(provenance)}, {sql_quote(structure['edition_completeness_status'])}, 'private_evidence', {json_sql(rights_basis)} from public.editions d join public.expressions e on e.id=d.expression_id join public.works w on w.id=e.work_id where w.slug={sql_quote(work['slug'])} and e.language_code={sql_quote(expression['language_code'])} and e.expression_kind={sql_quote(expression['expression_kind'])} and e.attribution={sql_quote(expression['attribution'])} and d.edition_title={sql_quote(edition['edition_title'])} on conflict (sha256) do update set edition_id=excluded.edition_id, byte_count=excluded.byte_count, media_type=excluded.media_type, storage_backend=excluded.storage_backend, storage_bucket=excluded.storage_bucket, storage_key=excluded.storage_key, provider=excluded.provider, provider_identifier=excluded.provider_identifier, source_url=excluded.source_url, acquired_at=excluded.acquired_at, provenance=excluded.provenance, completeness_status=excluded.completeness_status, rights_lane=excluded.rights_lane, rights_basis=excluded.rights_basis;"""
        )
    canonical_sha = next(row["sha256"] for row in packet["source_objects"] if row["role"] == "canonical_tei")
    for passage in packet["passages"]:
        statements.append(
            f"""insert into public.passages (source_object_id, source_ordinal, locator, language_code, script_code, exact_text, text_status, span_sha256, rights_lane, publication_state) select s.id, {passage['source_ordinal']}, {json_sql(passage['locator'])}, {sql_quote(passage['language_code'])}, {sql_quote(passage['script_code'])}, {utf8_base64_sql(passage['exact_text'])}, {sql_quote(structure['text_status'])}, {sql_quote(passage['span_sha256'])}, 'private_evidence', 'review' from public.source_objects s where s.sha256={sql_quote(canonical_sha)} on conflict (source_object_id, source_ordinal) do update set locator=excluded.locator, language_code=excluded.language_code, script_code=excluded.script_code, exact_text=excluded.exact_text, text_status=excluded.text_status, span_sha256=excluded.span_sha256, rights_lane='private_evidence', publication_state='review';"""
        )
    return statements


def compile_sql(packet: dict[str, Any]) -> str:
    return "\n\n".join(["begin;", *compile_statements(packet), "commit;"]) + "\n"


def compile_batches(packet: dict[str, Any], max_chars: int = 28000) -> list[str]:
    statements = compile_statements(packet)
    metadata_count = 7 + packet["source_object_count"]
    batches = ["\n\n".join(["begin;", *statements[:7], "commit;"]) + "\n"]
    batches.extend("\n\n".join(["begin;", statement, "commit;"]) + "\n" for statement in statements[7:metadata_count])
    current: list[str] = []
    size = 0
    for statement in statements[metadata_count:]:
        if current and size + len(statement) > max_chars:
            batches.append("\n\n".join(["begin;", *current, "commit;"]) + "\n")
            current, size = [], 0
        current.append(statement)
        size += len(statement)
    if current:
        batches.append("\n\n".join(["begin;", *current, "commit;"]) + "\n")
    return batches


def passage_root(packet: dict[str, Any]) -> str:
    return sha256_bytes("\n".join(
        f"{row['source_ordinal']}\t{row['span_sha256']}\t{sha256_bytes(row['exact_text'].encode())}\t{canonical_json(row['locator'])}"
        for row in packet["passages"]
    ).encode())


def main() -> int:
    parser = argparse.ArgumentParser(description="Compile the private GRETIL Bhagavadgita four-commentary evidence packet.")
    parser.add_argument("--plan", required=True, type=Path)
    parser.add_argument("--format", choices=("report", "sql-batch"), default="report")
    parser.add_argument("--batch-index", type=int)
    args = parser.parse_args()
    path = args.plan.resolve(strict=True)
    if not path.is_relative_to(ROOT / "ingestion" / "plans"):
        raise ValueError("Plan must be inside ingestion/plans")
    packet = compile_packet(path)
    sql = compile_sql(packet)
    batches = compile_batches(packet)
    if args.format == "sql-batch":
        if args.batch_index is None or not 0 <= args.batch_index < len(batches):
            raise ValueError("Invalid batch index")
        sys.stdout.write(batches[args.batch_index])
    else:
        print(json.dumps({
            "result": "PASS",
            "contract": CONTRACT,
            "pilot_id": packet["pilot_id"],
            "packet_sha256": packet["packet_sha256"],
            "sql_sha256": sha256_bytes(sql.encode()),
            "sql_batch_count": len(batches),
            "source_object_count": packet["source_object_count"],
            "source_object_bytes": sum(row["bytes"] for row in packet["source_objects"]),
            "passage_count": packet["passage_count"],
            "passage_content_root_sha256": passage_root(packet),
            "source_div_span_root_sha256": packet["structure"]["source_div_span_root_sha256"],
            "literal_marker_profile_sha256": packet["structure"]["chapter_profiles_sha256"],
            "visvanatha_18_74_to_18_78_explicitly_absent": True,
            "private_server_only_exact_search_planned_in_compiled_sql": True,
            "public_exact_text_search_enabled": False,
            "source_payloads_copied": False,
            **packet["completion_denials"],
        }, ensure_ascii=False, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

from __future__ import annotations

import argparse
import base64
import hashlib
import json
import re
import sys
from pathlib import Path
from typing import Any

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from tools.compile_source_vault_tei_ingestion import (
    ROOT,
    canonical_json,
    read_verified_object,
    sql_quote,
)


CONTRACT = "DEVAM_GANESHA_PURANA_WIKISOURCE_INGESTION_V1"
ACQUISITION_PLAN = ROOT / "ingestion/plans/ganesha-purana-wikisource-sanskrit-v1.json"
ACQUISITION_REPORT = ROOT / "ingestion/reports/ganesha-purana-wikisource-sanskrit-v1.json"
INGESTION_REPORT = ROOT / "ingestion/reports/ganesha-purana-wikisource-ingestion-v1.json"
ACQUISITION_PLAN_SHA256 = "6370295836856fc62b8b380e022dcb2533e3d669c3534c1591b5928eeb892961"
ACQUISITION_REPORT_SHA256 = "a0a46c9fe926735b9c44b617abd287fea89fd810e65b0e8971b476dab88cf128"
PROFILE_ID = "GANESHA-PURANA-WIKISOURCE-97DBB2263E3486C5BB900E19"
INTERNAL_SCAN_SHA256 = "aa6972405a88b34fa8db38dc07793424656961527149c36e80c0e100965245a5"
SITE_RIGHTS_SHA256 = "01d8aec05025957650898443b3182bc271e84a490e2f41b526165260e26026b8"
LICENSE_LITERAL = "Creative Commons Attribution-Share Alike 4.0"
LICENSE_URL = "https://creativecommons.org/licenses/by-sa/4.0/deed.sa"
LICENSE_FAMILY_URL = "https://creativecommons.org/licenses/by-sa/4.0/"


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def sha256_path(path: Path) -> str:
    return sha256_bytes(path.read_bytes())


def utf8_sql(value: str) -> str:
    encoded = base64.b64encode(value.encode("utf-8")).decode("ascii")
    return f"convert_from(decode({sql_quote(encoded)}, 'base64'), 'UTF8')"


def json_sql(value: Any) -> str:
    encoded = base64.b64encode(canonical_json(value).encode("utf-8")).decode("ascii")
    return f"convert_from(decode({sql_quote(encoded)}, 'base64'), 'UTF8')::jsonb"


def content_slice(content: str) -> tuple[int, int, str]:
    """Return the exact source text inside the outer poem/span wrappers.

    One provider page contains multiple poem/span blocks. The first opening and
    last closing wrappers still define one contiguous provider chapter-range
    unit, and any inner wrappers remain literal source markup.
    """
    poem_start = content.find("<poem")
    poem_end = content.rfind("</poem>")
    if poem_start < 0 or poem_end <= poem_start:
        raise ValueError("Canonical content page lacks an unambiguous poem boundary")
    outer_open_end = content.find(">", poem_start) + 1
    outer_close_start = poem_end
    cursor = outer_open_end
    while cursor < outer_close_start and content[cursor].isspace():
        cursor += 1
    if content.startswith("<span", cursor):
        cursor = content.find(">", cursor) + 1
    tail = outer_close_start
    while tail > cursor and content[tail - 1].isspace():
        tail -= 1
    last_span = content.rfind("</span>", cursor, tail)
    if last_span >= cursor and content[last_span + len("</span>") : tail].strip() == "":
        tail = last_span
    while cursor < tail and content[cursor].isspace():
        cursor += 1
    while tail > cursor and content[tail - 1].isspace():
        tail -= 1
    if cursor >= tail:
        raise ValueError("Canonical content page has an empty poem body")
    return cursor, tail, content[cursor:tail]


def load_and_validate_inputs() -> tuple[dict[str, Any], dict[str, Any]]:
    if sha256_path(ACQUISITION_PLAN) != ACQUISITION_PLAN_SHA256:
        raise ValueError("Ganesha Purana acquisition plan drift")
    if sha256_path(ACQUISITION_REPORT) != ACQUISITION_REPORT_SHA256:
        raise ValueError("Ganesha Purana acquisition report drift")
    plan = json.loads(ACQUISITION_PLAN.read_text(encoding="utf-8", errors="strict"))
    report = json.loads(ACQUISITION_REPORT.read_text(encoding="utf-8", errors="strict"))
    if plan.get("profile_id") != PROFILE_ID or report.get("profile_id") != PROFILE_ID:
        raise ValueError("Acquisition profile identity drift")
    if report.get("result") != "PASS" or report.get("plan_sha256") != ACQUISITION_PLAN_SHA256:
        raise ValueError("Acquisition report did not close against the frozen plan")
    if report.get("source_payloads_copied_into_app") is not False:
        raise ValueError("Source payload copy policy drift")
    claims = report.get("claims")
    expected_claims = {
        "wikisource_structural_coverage_complete_for_exact_canonical_page_universe": True,
        "wikisource_underlying_print_edition_identified": False,
        "wikisource_textual_recension_identified": False,
        "nag_1993_scan_product_cleared": False,
        "english_translation_included": False,
        "hindi_translation_included": False,
        "mudgala_purana_included": False,
        "all_ganesha_literature_complete": False,
    }
    if claims != expected_claims:
        raise ValueError("Acquisition claims boundary drift")
    if report["wikisource"]["rightsinfo"] != {"text": LICENSE_LITERAL, "url": LICENSE_URL}:
        raise ValueError("Wikisource rights evidence drift")
    if report["wikisource"]["canonical_page_count"] != 65 or report["wikisource"]["chapter_count"] != 247:
        raise ValueError("Provider page/chapter universe drift")
    return plan, report


def load_provider_pages(
    plan: dict[str, Any], report: dict[str, Any]
) -> tuple[dict[str, dict[str, Any]], dict[str, dict[str, Any]], list[dict[str, Any]]]:
    stored = report["stored_objects"]
    batches = [row for row in stored if row["name"].startswith("ganesha-purana-wikisource-revisions-batch-")]
    rights_rows = [row for row in stored if row["sha256"] == SITE_RIGHTS_SHA256]
    scans = [row for row in stored if row["sha256"] == INTERNAL_SCAN_SHA256]
    if len(batches) != 2 or len(rights_rows) != 1 or len(scans) != 1 or len(stored) != 4:
        raise ValueError("Acquisition object universe drift")
    if scans[0]["rights_evidence"]["lane"] != "internal_only" or scans[0]["rights_evidence"]["product_text_or_image_serving"] is not False:
        raise ValueError("Internal scan rights isolation drift")
    read_verified_object(scans[0])
    rights_data = json.loads(read_verified_object(rights_rows[0]).decode("utf-8", errors="strict"))
    if rights_data.get("query", {}).get("rightsinfo") != {"text": LICENSE_LITERAL, "url": LICENSE_URL}:
        raise ValueError("Stored site-rights carrier drift")

    page_by_title: dict[str, dict[str, Any]] = {}
    source_by_title: dict[str, dict[str, Any]] = {}
    for batch in batches:
        payload = json.loads(read_verified_object(batch).decode("utf-8", errors="strict"))
        for page in payload.get("query", {}).get("pages", []):
            title = page["title"]
            if title in page_by_title:
                raise ValueError(f"Duplicate provider page: {title}")
            page_by_title[title] = page
            source_by_title[title] = batch
    expected_rows = plan["source_pair"]["wikisource_product_lane"]["canonical_pages"]
    expected_by_title = {row["title"]: row for row in expected_rows}
    acquired_by_title = {row["title"]: row for row in report["wikisource"]["pages"]}
    if len(page_by_title) != 65 or set(page_by_title) != set(expected_by_title) or set(page_by_title) != set(acquired_by_title):
        raise ValueError("Stored provider page identity universe drift")
    for title, page in page_by_title.items():
        expected = expected_by_title[title]
        acquired = acquired_by_title[title]
        revisions = page.get("revisions") or []
        if len(revisions) != 1:
            raise ValueError(f"Expected one stored revision for {title}")
        revision = revisions[0]
        main = (revision.get("slots") or {}).get("main") or {}
        content = main.get("content")
        if not isinstance(content, str):
            raise ValueError(f"Stored revision content missing for {title}")
        content_bytes = content.encode("utf-8")
        if (
            page["pageid"] != expected["pageid"]
            or revision["revid"] != expected["revid"]
            or revision["parentid"] != expected["parentid"]
            or revision["timestamp"] != expected["timestamp"]
            or revision["sha1"] != expected["provider_sha1_hex"]
            or hashlib.sha1(content_bytes).hexdigest() != expected["provider_sha1_hex"]
            or main.get("contentmodel") != expected["contentmodel"]
            or len(content_bytes) != acquired["content_bytes"]
            or sha256_bytes(content_bytes) != acquired["content_sha256"]
        ):
            raise ValueError(f"Stored revision identity/fixity drift for {title}")
    return page_by_title, source_by_title, [*batches, rights_rows[0]]


def build_passages(
    plan: dict[str, Any],
    page_by_title: dict[str, dict[str, Any]],
    source_by_title: dict[str, dict[str, Any]],
) -> list[dict[str, Any]]:
    lane = plan["source_pair"]["wikisource_product_lane"]
    specs: list[dict[str, Any]] = []
    for khanda, key in (("upasana", "upasana"), ("krida", "krida")):
        for span in lane["canonical_spans"][key]:
            specs.append({**span, "khanda": khanda})
    if len(specs) != 62 or len({row["title"] for row in specs}) != 62:
        raise ValueError("Expected exactly 62 canonical chapter-range content pages")
    canonical_ordinals = {row["title"]: index for index, row in enumerate(lane["canonical_pages"])}
    passages: list[dict[str, Any]] = []
    chapters: dict[str, list[int]] = {"upasana": [], "krida": []}
    source_ordinals: set[tuple[str, int]] = set()
    for spec in specs:
        page = page_by_title[spec["title"]]
        revision = page["revisions"][0]
        content = revision["slots"]["main"]["content"]
        char_start, char_end, exact_text = content_slice(content)
        prefix = content[:char_start].encode("utf-8")
        span = exact_text.encode("utf-8")
        byte_start = len(prefix)
        byte_end = byte_start + len(span)
        content_bytes = content.encode("utf-8")
        if content_bytes[byte_start:byte_end] != span:
            raise ValueError(f"UTF-8 source span mismatch for {spec['title']}")
        source = source_by_title[spec["title"]]
        ordinal = canonical_ordinals[spec["title"]]
        source_key = (source["sha256"], ordinal)
        if source_key in source_ordinals:
            raise ValueError("Duplicate source-object/source-ordinal passage identity")
        source_ordinals.add(source_key)
        chapters[spec["khanda"]].extend(range(spec["chapter_start"], spec["chapter_end"] + 1))
        passages.append(
            {
                "source_sha256": source["sha256"],
                "source_ordinal": ordinal,
                "locator": {
                    "contract": "DEVAM_WIKISOURCE_REVISION_CONTENT_UTF8_SPAN_V1",
                    "provider": "Sanskrit Wikisource",
                    "provider_page_title": spec["title"],
                    "provider_page_id": page["pageid"],
                    "provider_revision_id": revision["revid"],
                    "provider_revision_timestamp": revision["timestamp"],
                    "provider_revision_sha1_hex": revision["sha1"],
                    "canonical_page_ordinal": ordinal,
                    "khanda": spec["khanda"],
                    "chapter_start": spec["chapter_start"],
                    "chapter_end": spec["chapter_end"],
                    "revision_content_byte_start": byte_start,
                    "revision_content_byte_end_exclusive": byte_end,
                    "revision_content_line_start": content_bytes.count(b"\n", 0, byte_start) + 1,
                    "revision_content_line_end": content_bytes.count(b"\n", 0, byte_end) + 1,
                    "revision_content_sha256": sha256_bytes(content_bytes),
                    "source_json_carrier_sha256": source["sha256"],
                    "underlying_print_edition_identified": False,
                    "textual_recension_identified": False,
                },
                "language_code": "sa",
                "script_code": "Deva",
                "exact_text": exact_text,
                "span_sha256": sha256_bytes(span),
            }
        )
    if sorted(chapters["upasana"]) != list(range(1, 93)):
        raise ValueError("Upasana chapter-range coverage is not exactly 1..92")
    if sorted(chapters["krida"]) != list(range(1, 156)):
        raise ValueError("Krida chapter-range coverage is not exactly 1..155")
    passages.sort(key=lambda row: row["source_ordinal"])
    upasana_terminal = next(row for row in passages if row["locator"]["khanda"] == "upasana" and row["locator"]["chapter_end"] == 92)
    krida_terminal = next(row for row in passages if row["locator"]["khanda"] == "krida" and row["locator"]["chapter_end"] == 155)
    if "उपासना खण्डं समाप्तम्" not in upasana_terminal["exact_text"]:
        raise ValueError("Upasana terminal formula absent from final exact passage")
    if "श्रीगजाननार्पणमस्तु" not in krida_terminal["exact_text"] or "शुभं भवतु" not in krida_terminal["exact_text"]:
        raise ValueError("Krida terminal formulas absent from final exact passage")
    return passages


def compile_packet() -> dict[str, Any]:
    plan, report = load_and_validate_inputs()
    pages, sources, product_objects = load_provider_pages(plan, report)
    passages = build_passages(plan, pages, sources)
    completion_denials = {
        "underlying_print_edition_identified": False,
        "textual_recension_identified": False,
        "english_translation_included": False,
        "hindi_translation_included": False,
        "mudgala_purana_included": False,
        "all_ganesha_literature_complete": False,
        "all_ganesha_traditions_complete": False,
    }
    core = {
        "contract": CONTRACT,
        "profile_id": PROFILE_ID,
        "acquisition_plan_sha256": ACQUISITION_PLAN_SHA256,
        "acquisition_report_sha256": ACQUISITION_REPORT_SHA256,
        "work": {
            "slug": "ganesha-purana",
            "canonical_title": "गणेशपुराणम् (Ganesha Purana)",
            "work_kind": "purana",
            "tradition_scope": ["ganesha", "purana"],
            "summary": "Complete two-khanda Sanskrit Wikisource transcription at 65 pinned revisions: Upasanakhanda chapters 1–92 and Kridakhanda chapters 1–155. The underlying print edition and textual recension remain unidentified.",
        },
        "expression": {
            "language_code": "sa",
            "script_code": "Deva",
            "expression_kind": "digital_transcription",
            "attribution": "Sanskrit Wikisource contributors at 65 pinned revisions",
        },
        "edition": {
            "edition_title": "Sanskrit Wikisource transcription at 65 pinned revisions (Devam acquisition 2026-08-08)",
            "publisher": "Sanskrit Wikisource",
            "publication_place": None,
            "publication_year": None,
            "edition_statement": "Digital transcription with 62 exact chapter-range content pages; underlying print edition and recension unidentified.",
            "identifiers": {
                "provider": "Sanskrit Wikisource",
                "provider_work_title": "गणेशपुराणम्",
                "profile_id": PROFILE_ID,
            },
        },
        "rights": {
            "lane": "derivative_allowed",
            "provider_license_literal": LICENSE_LITERAL,
            "provider_license_url": LICENSE_URL,
            "license_family_url": LICENSE_FAMILY_URL,
            "attribution_required": True,
            "share_alike_required": True,
            "internal_1993_scan_product_served": False,
        },
        "source_objects": product_objects,
        "passages": passages,
        "scope": {
            "positive": "Exact complete two-khanda Sanskrit Wikisource page universe at pinned revisions, exposed as 62 lossless chapter-range passages covering all 247 chapters.",
            "granularity": "provider chapter-range pages; no inferred chapter split where literal boundaries are inconsistent",
        },
        "completion_denials": completion_denials,
        "source_payloads_copied_into_app": False,
    }
    return {**core, "packet_sha256": sha256_bytes(canonical_json(core).encode("utf-8"))}


def compile_sql(packet: dict[str, Any]) -> list[str]:
    work, expression, edition = packet["work"], packet["expression"], packet["edition"]
    rights, lane = packet["rights"], packet["rights"]["lane"]
    completeness = "complete_exact_wikisource_two_khanda_page_universe_247_chapters_underlying_edition_and_recension_unidentified"
    statements = [
        f"""insert into public.works (slug, canonical_title, work_kind, tradition_scope, summary, rights_lane, publication_state) values ({sql_quote(work['slug'])}, {utf8_sql(work['canonical_title'])}, {sql_quote(work['work_kind'])}, array[{','.join(sql_quote(v) for v in work['tradition_scope'])}]::text[], {utf8_sql(work['summary'])}, {sql_quote(lane)}, 'published') on conflict (slug) do update set canonical_title=excluded.canonical_title, work_kind=excluded.work_kind, tradition_scope=excluded.tradition_scope, summary=excluded.summary, rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;""",
        f"""insert into public.expressions (work_id, language_code, script_code, expression_kind, attribution, is_source_original, ai_generated, rights_lane, publication_state) select w.id, {sql_quote(expression['language_code'])}, {sql_quote(expression['script_code'])}, {sql_quote(expression['expression_kind'])}, {sql_quote(expression['attribution'])}, false, false, {sql_quote(lane)}, 'published' from public.works w where w.slug={sql_quote(work['slug'])} on conflict (work_id, language_code, expression_kind, attribution) do update set script_code=excluded.script_code, is_source_original=false, ai_generated=false, rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;""",
        f"""insert into public.editions (expression_id, edition_title, publisher, publication_place, publication_year, edition_statement, identifiers, rights_lane, publication_state) select e.id, {utf8_sql(edition['edition_title'])}, {utf8_sql(edition['publisher'])}, null, null, {utf8_sql(edition['edition_statement'])}, {json_sql(edition['identifiers'])}, {sql_quote(lane)}, 'published' from public.expressions e join public.works w on w.id=e.work_id where w.slug={sql_quote(work['slug'])} and e.attribution={sql_quote(expression['attribution'])} and not exists (select 1 from public.editions d where d.expression_id=e.id and d.edition_title={utf8_sql(edition['edition_title'])});""",
        f"""update public.editions d set publisher={utf8_sql(edition['publisher'])}, publication_place=null, publication_year=null, edition_statement={utf8_sql(edition['edition_statement'])}, identifiers={json_sql(edition['identifiers'])}, rights_lane={sql_quote(lane)}, publication_state='published' from public.expressions e join public.works w on w.id=e.work_id where d.expression_id=e.id and w.slug={sql_quote(work['slug'])} and d.edition_title={utf8_sql(edition['edition_title'])};""",
    ]
    for source in packet["source_objects"]:
        role = "site_rights_evidence" if source["sha256"] == SITE_RIGHTS_SHA256 else "revision_batch"
        provenance = {
            "contract": CONTRACT,
            "packet_sha256": packet["packet_sha256"],
            "profile_id": PROFILE_ID,
            "role": role,
            "source_path": source["source_path"],
            "source_payloads_copied_into_app": False,
            "completion_denials": packet["completion_denials"],
        }
        provider_id = f"wikisource:sa:ganesha-purana:{source['name']}"
        statements.append(
            f"""insert into public.source_objects (edition_id, sha256, byte_count, media_type, storage_backend, storage_bucket, storage_key, provider, provider_identifier, source_url, acquired_at, provenance, completeness_status, rights_lane, rights_basis) select d.id, {sql_quote(source['sha256'])}, {source['bytes']}, {sql_quote(source['media_type'])}, 'local_vault', null, {sql_quote(source['object_path'])}, 'Sanskrit Wikisource', {sql_quote(provider_id)}, {sql_quote(source['source_url'])}, {sql_quote(source['retrieved_at'])}::timestamptz, {json_sql(provenance)}, {sql_quote(completeness)}, {sql_quote(lane)}, {json_sql(rights)} from public.editions d join public.expressions e on e.id=d.expression_id join public.works w on w.id=e.work_id where w.slug={sql_quote(work['slug'])} and d.edition_title={utf8_sql(edition['edition_title'])} on conflict (sha256) do update set edition_id=excluded.edition_id, byte_count=excluded.byte_count, media_type=excluded.media_type, storage_backend=excluded.storage_backend, storage_bucket=excluded.storage_bucket, storage_key=excluded.storage_key, provider=excluded.provider, provider_identifier=excluded.provider_identifier, source_url=excluded.source_url, acquired_at=excluded.acquired_at, provenance=excluded.provenance, completeness_status=excluded.completeness_status, rights_lane=excluded.rights_lane, rights_basis=excluded.rights_basis;"""
        )
    for passage in packet["passages"]:
        statements.append(
            f"""insert into public.passages (source_object_id, source_ordinal, locator, language_code, script_code, exact_text, text_status, span_sha256, rights_lane, publication_state) select s.id, {passage['source_ordinal']}, {json_sql(passage['locator'])}, 'sa', 'Deva', {utf8_sql(passage['exact_text'])}, 'exact_provider_transcription_at_pinned_revision', {sql_quote(passage['span_sha256'])}, {sql_quote(lane)}, 'published' from public.source_objects s where s.sha256={sql_quote(passage['source_sha256'])} on conflict (source_object_id, source_ordinal) do update set locator=excluded.locator, language_code=excluded.language_code, script_code=excluded.script_code, exact_text=excluded.exact_text, text_status=excluded.text_status, span_sha256=excluded.span_sha256, rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;"""
        )
    statements.extend(
        [
            """insert into public.entities (slug, entity_kind, canonical_name, description, rights_lane, publication_state) values ('ganesha-purana', 'scripture', 'Ganesha Purana', 'A Ganesha-centred Purana represented in Devam by one complete two-khanda Sanskrit Wikisource transcription at pinned revisions.', 'derivative_allowed', 'published') on conflict (slug) do update set entity_kind=excluded.entity_kind, canonical_name=excluded.canonical_name, description=excluded.description, rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;""",
            """insert into public.entity_names (entity_id, name, language_code, script_code, name_kind, is_preferred) select e.id, convert_from(decode('4KSX4KSj4KWH4KS24KSq4KWB4KSw4KS+4KSj4KSu4KWN', 'base64'), 'UTF8'), 'sa', 'Deva', 'original_title', true from public.entities e where e.slug='ganesha-purana' on conflict (entity_id, name, language_code, name_kind) do update set script_code=excluded.script_code, is_preferred=excluded.is_preferred;""",
            """insert into public.relationships (subject_entity_id, predicate, object_entity_id, applicability, rights_lane, publication_state) select work.id, 'sacred_text_of', deity.id, '{\"scope\":\"Ganesha Purana identity; not every Ganesha tradition\"}'::jsonb, 'derivative_allowed', 'published' from public.entities work join public.entities deity on deity.slug='ganapati' where work.slug='ganesha-purana' on conflict (subject_entity_id, predicate, object_entity_id, claim_id) do nothing;""",
            """insert into public.claims (stable_key, subject_entity_id, statement, language_code, claim_kind, evidence_class, confidence, applicability, uncertainty_note, rights_lane, publication_state) select 'ganesha-purana-wikisource-two-khanda-structure-en', e.id, 'In Devam''s pinned Sanskrit Wikisource transcription, the Ganesha Purana is represented in two khandas: Upasanakhanda with 92 chapters and Kridakhanda with 155 chapters.', 'en', 'source_structure', 'provider_revision_structure', 1.000, '{\"source_boundary\":\"exact pinned Wikisource transcription\"}'::jsonb, 'This establishes the structure of this exact digital transcription; the underlying print edition, recension, translations, and wider Ganesha corpus remain unidentified or incomplete.', 'derivative_allowed', 'published' from public.entities e where e.slug='ganesha-purana' on conflict (stable_key) do update set subject_entity_id=excluded.subject_entity_id, statement=excluded.statement, language_code=excluded.language_code, claim_kind=excluded.claim_kind, evidence_class=excluded.evidence_class, confidence=excluded.confidence, applicability=excluded.applicability, uncertainty_note=excluded.uncertainty_note, rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;""",
            f"""insert into public.atlas_nodes (slug, entity_id, title, subtitle, node_kind, is_gateway, position, visual, reveal_at, rights_lane, publication_state) select 'ganesha-purana', e.id, 'Ganesha Purana', {utf8_sql('२ खण्ड · २४७ अध्याय')}, 'Text', false, '{{\"x\":62,\"y\":59}}'::jsonb, '{{\"size\":\"connected\",\"eras\":[\"Living\"],\"gatewayId\":\"ganesha\",\"summary\":\"Explore one complete Sanskrit Wikisource transcription across Upasana and Krida khandas.\",\"searchQuery\":\"Ganesha Purana two khandas 247 chapters\",\"evidenceBoundary\":\"Complete only for the exact pinned Wikisource page universe; underlying edition, recension, translations, Mudgala Purana and the wider Ganesha tradition remain separate.\"}}'::jsonb, 1.18, 'derivative_allowed', 'published' from public.entities e where e.slug='ganesha-purana' on conflict (slug) do update set entity_id=excluded.entity_id, title=excluded.title, subtitle=excluded.subtitle, node_kind=excluded.node_kind, is_gateway=excluded.is_gateway, position=excluded.position, visual=excluded.visual, reveal_at=excluded.reveal_at, rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;""",
            """insert into public.atlas_edges (source_node_id, target_node_id, label, rights_lane, publication_state) select source.id, target.id, 'Purana tradition', 'derivative_allowed', 'published' from public.atlas_nodes source join public.atlas_nodes target on target.slug='ganesha-purana' where source.slug='ganesha' on conflict (source_node_id, target_node_id, label) do update set rights_lane=excluded.rights_lane, publication_state=excluded.publication_state;""",
        ]
    )
    terminal_by_khanda = {
        row["locator"]["khanda"]: row
        for row in packet["passages"]
        if row["locator"]["chapter_end"] in (92, 155)
    }
    for key, claim_key in (("upasana", "ganesha-purana-wikisource-two-khanda-structure-en"), ("krida", "ganesha-purana-wikisource-two-khanda-structure-en")):
        row = terminal_by_khanda[key]
        statements.append(
            f"""insert into public.claim_evidence (claim_id, passage_id, evidence_role, note) select c.id, p.id, 'supports', {json_sql({'profile_id': PROFILE_ID, 'khanda': key, 'evidence': 'terminal chapter-range passage plus frozen provider navigation'})} from public.claims c join public.source_objects s on s.sha256={sql_quote(row['source_sha256'])} join public.passages p on p.source_object_id=s.id and p.source_ordinal={row['source_ordinal']} where c.stable_key={sql_quote(claim_key)} on conflict (claim_id, passage_id, evidence_role) do update set note=excluded.note;"""
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
    rows = [
        f"{row['source_sha256']}\t{row['source_ordinal']}\t{row['locator']['khanda']}\t{row['locator']['chapter_start']}-{row['locator']['chapter_end']}\t{row['span_sha256']}"
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
        "canonical_page_count": 65,
        "content_passage_count": len(packet["passages"]),
        "chapter_count": sum(row["locator"]["chapter_end"] - row["locator"]["chapter_start"] + 1 for row in packet["passages"]),
        "passage_root_sha256": sha256_bytes("\n".join(rows).encode("utf-8")),
        "positive_boundary": packet["scope"]["positive"],
        "granularity": packet["scope"]["granularity"],
        "completion_denials": packet["completion_denials"],
        "internal_1993_scan_product_served": False,
        "source_payloads_copied_into_app": False,
        "search_wiring": "published exact passages use existing search_public_passages RPC",
        "sarthi_wiring": "existing exact-source and grounded retrieval consume published passage/claim rows",
        "atlas_wiring": "published ganesha-purana text node linked from the Ganesha gateway",
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Compile the complete pinned Sanskrit Wikisource Ganesha Purana into Devam's evidence model.")
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
    else:
        report = json.dumps(build_report(packet, batches), ensure_ascii=False, indent=2, sort_keys=True) + "\n"
        if args.write_report:
            if not INGESTION_REPORT.parent.resolve().is_relative_to(ROOT.resolve()):
                raise ValueError("Ingestion report path escapes workspace")
            with INGESTION_REPORT.open("x", encoding="utf-8", newline="\n") as handle:
                handle.write(report)
        print(report, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

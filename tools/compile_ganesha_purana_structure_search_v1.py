from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path
from typing import Any

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from tools.compile_ganesha_purana_wikisource_ingestion import ROOT, compile_packet
from tools.compile_source_vault_tei_ingestion import canonical_json


PACK_PATH = ROOT / "knowledge_packs" / "ganesha" / "ganesha-purana-structure-search-v1.json"
CONTRACT = "DEVAM_GANESHA_PURANA_STRUCTURE_SEARCH_V1"
EXPECTED_DIVISIONS = {"upasana-khanda": ("upasana", 1, 92), "krida-khanda": ("krida", 1, 155)}
EXPECTED_DENIALS = {
    "underlying_print_edition_identified": False,
    "textual_recension_identified": False,
    "english_translation_included": False,
    "hindi_translation_included": False,
    "mudgala_purana_included": False,
    "all_ganesha_literature_complete": False,
    "all_ganesha_traditions_complete": False,
    "ritual_authority_claimed": False,
}


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def load_and_validate_pack(pack_path: Path = PACK_PATH) -> dict[str, Any]:
    raw = pack_path.read_bytes()
    pack = json.loads(raw.decode("utf-8", errors="strict"))
    packet = compile_packet()

    if pack.get("contract") != CONTRACT:
        raise ValueError("Ganesha Purana structure-search contract drift")
    boundary = pack.get("source_boundary", {})
    if boundary != {
        "profile_id": packet["profile_id"],
        "ingestion_packet_sha256": packet["packet_sha256"],
        "passage_root_sha256": "2d5f60591bc3829cbaa4907de98153493d44e300bc0ee8b8b772d97822216c03",
        "rights_lane": "derivative_allowed",
        "publication_state": "published",
        "scope": "exact_complete_two_khanda_sanskrit_wikisource_page_universe_at_pinned_revisions",
    }:
        raise ValueError("Ganesha Purana structure-search source boundary drift")
    if pack.get("denials") != EXPECTED_DENIALS:
        raise ValueError("Ganesha Purana structure-search completion denials drift")
    if set(item.get("slug") for item in pack.get("divisions", [])) != set(EXPECTED_DIVISIONS):
        raise ValueError("Ganesha Purana structure-search division identity drift")

    passage_by_identity = {
        (row["source_sha256"], row["source_ordinal"]): row
        for row in packet["passages"]
    }
    for division in pack["divisions"]:
        khanda, chapter_start, chapter_end = EXPECTED_DIVISIONS[division["slug"]]
        if (division["chapter_start"], division["chapter_end"]) != (chapter_start, chapter_end):
            raise ValueError(f"{division['slug']} chapter boundary drift")
        if not division.get("statement_en") or not division.get("statement_hi"):
            raise ValueError(f"{division['slug']} lacks bilingual structure statements")
        citations = division.get("citations", [])
        if len(citations) != 2:
            raise ValueError(f"{division['slug']} must bind opening and terminal evidence")
        observed_ranges = []
        for citation in citations:
            row = passage_by_identity.get((citation["source_sha256"], citation["source_ordinal"]))
            if row is None:
                raise ValueError(f"{division['slug']} cites an absent source passage")
            locator = row["locator"]
            expected = {
                "source_sha256": row["source_sha256"],
                "source_ordinal": row["source_ordinal"],
                "span_sha256": row["span_sha256"],
                "provider_page_title": locator["provider_page_title"],
                "provider_page_id": locator["provider_page_id"],
                "provider_revision_id": locator["provider_revision_id"],
                "khanda": locator["khanda"],
                "chapter_start": locator["chapter_start"],
                "chapter_end": locator["chapter_end"],
            }
            if citation != expected or locator["khanda"] != khanda:
                raise ValueError(f"{division['slug']} citation coordinate drift")
            observed_ranges.append((locator["chapter_start"], locator["chapter_end"]))
        if min(start for start, _ in observed_ranges) != chapter_start or max(end for _, end in observed_ranges) != chapter_end:
            raise ValueError(f"{division['slug']} does not bind both terminal chapter boundaries")

    return {
        "pack": pack,
        "file_sha256": sha256_bytes(raw),
        "canonical_pack_sha256": sha256_bytes(canonical_json(pack).encode("utf-8")),
        "source_passage_count": len(packet["passages"]),
    }


def build_report(pack_path: Path = PACK_PATH) -> dict[str, Any]:
    validated = load_and_validate_pack(pack_path)
    pack = validated["pack"]
    return {
        "result": "PASS",
        "contract": CONTRACT,
        "pack_id": pack["pack_id"],
        "file_sha256": validated["file_sha256"],
        "canonical_pack_sha256": validated["canonical_pack_sha256"],
        "ingestion_packet_sha256": pack["source_boundary"]["ingestion_packet_sha256"],
        "source_passage_count": validated["source_passage_count"],
        "division_count": len(pack["divisions"]),
        "chapter_count": sum(item["chapter_end"] - item["chapter_start"] + 1 for item in pack["divisions"]),
        "evidence_citation_count": sum(len(item["citations"]) for item in pack["divisions"]),
        "source_payloads_copied": False,
        "underlying_print_edition_identified": False,
        "textual_recension_identified": False,
    }


if __name__ == "__main__":
    print(json.dumps(build_report(), ensure_ascii=False, indent=2, sort_keys=True))

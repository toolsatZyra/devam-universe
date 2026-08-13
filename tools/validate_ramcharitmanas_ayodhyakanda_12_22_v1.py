import hashlib
import json
import sys
from pathlib import Path
from typing import Any

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from tools.compile_source_vault_tei_ingestion import canonical_json


ROOT = Path(__file__).resolve().parents[1]
PACK_PATH = ROOT / "knowledge_packs/devotional/ramcharitmanas-ayodhyakanda-12-22-v1.json"
PLAN_PATH = ROOT / "ingestion/plans/ramcharitmanas-wikisource-belvedere-pages-v1.json"
REPORT_PATH = ROOT / "ingestion/reports/ramcharitmanas-wikisource-belvedere-pages-v1.json"
CONTRACT = "DEVAM_RAMCHARITMANAS_AYODHYAKANDA_READING_SEQUENCE_V1"
SEQUENCE_KEY = "ramcharitmanas-belvedere-normalized-reading-v1"
SCAN_SHA256 = "6d570d531ebada1912f6e930212393fec2200765a0b731b73b8e7135ea0f70f2"
PLAN_SHA256 = "fbc2a25045bcf8dcbfcb8a5dd2c5388fe8263c209567d515b27f138d0882c0ab"
REPORT_SHA256 = "8a6547f3c2f74194a29a885d2b7529ce9fcdd06daa51e7e32c6f48f2e0a2cf7c"
EXPECTED_PACK_SHA256 = "62be80a3a93140a1c1b748b0e4b62ec02539e94f2fa6016f5d821b0ffc4ffc5b"
EXPECTED_PAGE_MAP = {
    12: [436, 437], 13: [437, 438], 14: [438, 439],
    15: [439, 440], 16: [440, 441], 17: [441, 442],
    18: [442, 443], 19: [443, 444], 20: [444, 445],
    21: [445, 446], 22: [446, 447],
}


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def sha256_text(value: str) -> str:
    return sha256_bytes(value.encode("utf-8"))


def load_json(path: Path) -> dict[str, Any]:
    raw = path.read_bytes()
    text = raw.decode("utf-8", errors="strict")
    if text.encode("utf-8") != raw:
        raise ValueError(f"{path.name} is not stable UTF-8")
    return json.loads(text)


def load_pack() -> dict[str, Any]:
    return load_json(PACK_PATH)


def validate_pack(pack: dict[str, Any]) -> dict[str, Any]:
    if sha256_bytes(PLAN_PATH.read_bytes()) != PLAN_SHA256:
        raise ValueError("pinned Wikisource acquisition plan drift")
    if sha256_bytes(REPORT_PATH.read_bytes()) != REPORT_SHA256:
        raise ValueError("pinned Wikisource acquisition report drift")
    core = {key: value for key, value in pack.items() if key != "pack_sha256"}
    computed_hash = sha256_text(canonical_json(core))
    if pack.get("pack_sha256") != computed_hash or computed_hash != EXPECTED_PACK_SHA256:
        raise ValueError("reviewed pack fixity drift")
    if pack.get("contract") != CONTRACT or pack.get("sequence_key") != SEQUENCE_KEY:
        raise ValueError("reading contract identity drift")
    if pack.get("source_and_rights", {}).get("fixed_scan_sha256") != SCAN_SHA256:
        raise ValueError("fixed scan identity drift")

    scope = pack.get("selected_scope", {})
    expected_scope = {
        "canonical_group_start": 12, "canonical_group_end": 22,
        "passage_count": 11, "source_unit_count": 55,
        "scan_pages": [436, 447], "reaches_division_start": False,
        "reaches_division_end": False, "complete_division": False,
        "complete_work": False,
    }
    for key, value in expected_scope.items():
        if scope.get(key) != value:
            raise ValueError(f"selected-scope {key} drift")

    plan = load_json(PLAN_PATH)
    report = load_json(REPORT_PATH)
    profiles = {row["scan_page"]: row for row in plan["wikisource"]["pages"]}
    product_pages = {row["scan_page"]: row for row in report["pages"]}
    passages = pack.get("passages", [])
    groups = list(range(12, 23))
    if [int(row["canonical_group_label"]) for row in passages] != groups:
        raise ValueError("passages must be contiguous groups 12..22")

    all_units: list[dict[str, Any]] = []
    all_pages: set[int] = set()
    for index, passage in enumerate(passages):
        group = groups[index]
        expected_id = f"ramcharitmanas-ayodhyakanda-{group:04d}"
        previous_id = None if group == 12 else f"ramcharitmanas-ayodhyakanda-{group - 1:04d}"
        next_id = None if group == 22 else f"ramcharitmanas-ayodhyakanda-{group + 1:04d}"
        if passage["passage_id"] != expected_id or passage["source_order_key"] != f"02:{group:04d}":
            raise ValueError(f"passage identity or order drift at {group}")
        if passage["previous_passage_id"] != previous_id or passage["next_passage_id"] != next_id:
            raise ValueError(f"passage links drift at {group}")
        if len(passage["meaning"]["en"].strip()) < 400 or len(passage["meaning"]["hi"].strip()) < 400:
            raise ValueError(f"bilingual meaning is too compressed at {group}")
        if len(passage["context_note"]["en"].strip()) < 170 or len(passage["context_note"]["hi"].strip()) < 170:
            raise ValueError(f"context boundary is too compressed at {group}")
        units = passage.get("source_units", [])
        if [unit["unit_kind"] for unit in units] != ["chaupai"] * 4 + ["doha"]:
            raise ValueError(f"natural source-unit grammar drift at {group}")
        if passage.get("source_unit_count") != 5:
            raise ValueError(f"source-unit count drift at {group}")
        for ordinal, unit in enumerate(units, 1):
            if unit["ordinal_in_passage"] != ordinal or unit["source_order_key"] != f"02:{group:04d}:{ordinal:02d}":
                raise ValueError(f"unit order drift at {group}:{ordinal}")
            if unit["unit_label"] != (str(group) if ordinal == 5 else str(ordinal)):
                raise ValueError(f"unit label drift at {group}:{ordinal}")
            if sha256_text(unit["exact_text"]) != unit["exact_text_sha256"]:
                raise ValueError(f"source text fixity drift at {group}:{ordinal}")
            if unit["locator"]["scan_sha256"] != SCAN_SHA256:
                raise ValueError(f"unit scan identity drift at {group}:{ordinal}")
            all_units.append(unit)

        pages = passage["source_locator"]["scan_pages"]
        if pages != EXPECTED_PAGE_MAP[group]:
            raise ValueError(f"fixed-scan page map drift at {group}")
        all_pages.update(pages)
        evidence_rows = passage["source_locator"]["page_evidence"]
        if [row["scan_page"] for row in evidence_rows] != pages:
            raise ValueError(f"page evidence order drift at {group}")
        for evidence in evidence_rows:
            page = evidence["scan_page"]
            profile = profiles[page]
            expected = {
                "scan_page": page,
                "provider_page_title": profile["title"],
                "provider_page_id": profile["pageid"],
                "provider_revision_id": profile["revid"],
                "provider_revision_timestamp": profile["timestamp"],
                "provider_revision_sha1": profile["provider_sha1_hex"],
                "proofread_page_quality_level": profile["quality_level"],
                "revision_content_sha256": product_pages[page]["content_sha256"],
            }
            if evidence != expected:
                raise ValueError(f"pinned page evidence drift at scan page {page}")

    if len(all_units) != 55 or [row["batch_unit_ordinal"] for row in all_units] != list(range(1, 56)):
        raise ValueError("interval must contain exactly 55 consecutively numbered units")
    if len({row["unit_id"] for row in all_units}) != 55 or len({row["exact_text"] for row in all_units}) != 55:
        raise ValueError("source-unit identities and text must be unique")
    if all_pages != set(range(436, 448)):
        raise ValueError("interval must be evidenced by fixed scan pages 436..447")

    text = PACK_PATH.read_text(encoding="utf-8", errors="strict")
    required = [
        "बिसमय हरष रहित रघुराऊ", "नाम मन्थरा मन्द मति", "मज्जुल मङ्गल",
        "जिन्हहिं जनेस देइ जुबराजू", "भरत सपथ तेहि साँच कहु",
        "अवध साढ़ेसाती", "पठये भरत भूप ननिऔरे", "कहेसि कथा सत सवति कै",
        "अपने चलत न आजु लगि अनभल काहु क कीन्ह", "दुइ बरदान भूप सन थाती",
        "सुतहि राजु रामहि बनबासू", "कोपगृहँ जाहु",
    ]
    for phrase in required:
        if phrase not in text:
            raise ValueError(f"reviewed source or episode boundary drift: {phrase}")
    for phrase in ("घोलेउ", "लेगन्ह", "भरत सपथ ताहि", "कारन माहि सुनाउ", "लखइ नरानि"):
        if phrase in text:
            raise ValueError(f"Wikisource transcription error leaked into product text: {phrase}")
    for phrase in ("disability", "self-harm", "coercive", "not verified"):
        if phrase not in text.lower():
            raise ValueError(f"adversarial context boundary missing: {phrase}")
    if "ï¿½" in text or "Ã Â¤" in text:
        raise ValueError("common UTF-8 mojibake detected")
    references = pack["source_and_rights"]["reference_only_not_product_carriers"]
    if len(references) != 2 or any("not" not in row["role"].lower() for row in references):
        raise ValueError("reference-only product boundary drift")
    if pack.get("completion_state") != "consumer_complete_en_hi_for_selected_contiguous_interval":
        raise ValueError("bounded completion state drift")

    return {
        "result": "PASS", "contract": CONTRACT, "pack_sha256": computed_hash,
        "passage_count": len(passages), "source_unit_count": len(all_units),
        "bilingual_meaning_count": sum(len(row["meaning"]) for row in passages),
        "complete_work": False, "tracked_corpus_copies": 1,
    }


def main() -> int:
    print(json.dumps(validate_pack(load_pack()), sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

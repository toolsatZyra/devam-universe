import hashlib
import json
import sys
from pathlib import Path
from typing import Any

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from tools.compile_source_vault_tei_ingestion import canonical_json


ROOT = Path(__file__).resolve().parents[1]
PACK_PATH = ROOT / "knowledge_packs/devotional/ramcharitmanas-ayodhyakanda-opening-11-v1.json"
PLAN_PATH = ROOT / "ingestion/plans/ramcharitmanas-wikisource-belvedere-pages-v1.json"
REPORT_PATH = ROOT / "ingestion/reports/ramcharitmanas-wikisource-belvedere-pages-v1.json"

CONTRACT = "DEVAM_RAMCHARITMANAS_AYODHYAKANDA_READING_SEQUENCE_V1"
SEQUENCE_KEY = "ramcharitmanas-belvedere-normalized-reading-v1"
SCAN_SHA256 = "6d570d531ebada1912f6e930212393fec2200765a0b731b73b8e7135ea0f70f2"
PLAN_SHA256 = "fbc2a25045bcf8dcbfcb8a5dd2c5388fe8263c209567d515b27f138d0882c0ab"
REPORT_SHA256 = "8a6547f3c2f74194a29a885d2b7529ce9fcdd06daa51e7e32c6f48f2e0a2cf7c"
EXPECTED_PACK_SHA256 = "8d6c92a814d37e1e98aa523ab7ca1ecdcbc8e282bfbc4f7f1c03ad9c8275cbb3"

EXPECTED_PAGE_MAP = {
    "invocation": [425, 426],
    "1": [426, 427], "2": [427, 428], "3": [428, 429],
    "4": [429, 430], "5": [430, 431], "6": [431],
    "7": [431, 432], "8": [433], "9": [433, 434],
    "10": [434, 435], "11": [435, 436],
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
    computed_pack_sha256 = sha256_text(canonical_json(core))
    if pack.get("pack_sha256") != computed_pack_sha256:
        raise ValueError("embedded pack SHA-256 mismatch")
    if computed_pack_sha256 != EXPECTED_PACK_SHA256:
        raise ValueError("reviewed pack fixity drift")
    if pack.get("contract") != CONTRACT or pack.get("sequence_key") != SEQUENCE_KEY:
        raise ValueError("reading contract identity drift")
    if pack.get("source_and_rights", {}).get("fixed_scan_sha256") != SCAN_SHA256:
        raise ValueError("fixed scan identity drift")

    scope = pack.get("selected_scope", {})
    expected_scope = {
        "canonical_group_start": "invocation",
        "canonical_group_end": 11,
        "passage_count": 12,
        "source_unit_count": 59,
        "scan_pages": [425, 436],
        "reaches_division_start": True,
        "reaches_division_end": False,
        "complete_division": False,
        "complete_work": False,
    }
    for key, expected in expected_scope.items():
        if scope.get(key) != expected:
            raise ValueError(f"selected-scope {key} drift")

    plan = load_json(PLAN_PATH)
    report = load_json(REPORT_PATH)
    profiles = {row["scan_page"]: row for row in plan["wikisource"]["pages"]}
    product_pages = {row["scan_page"]: row for row in report["pages"]}

    passages = pack.get("passages", [])
    expected_labels = ["invocation"] + [str(value) for value in range(1, 12)]
    if [row["canonical_group_label"] for row in passages] != expected_labels:
        raise ValueError("passages must be invocation followed by contiguous groups 1..11")

    all_units: list[dict[str, Any]] = []
    all_pages: set[int] = set()
    for index, passage in enumerate(passages):
        label = expected_labels[index]
        order_group = 0 if label == "invocation" else int(label)
        expected_id = "ramcharitmanas-ayodhyakanda-invocation" if label == "invocation" else f"ramcharitmanas-ayodhyakanda-{int(label):04d}"
        expected_previous = None if index == 0 else passages[index - 1]["passage_id"]
        expected_next = None if index == len(passages) - 1 else ("ramcharitmanas-ayodhyakanda-0001" if label == "invocation" else f"ramcharitmanas-ayodhyakanda-{int(label) + 1:04d}")
        if passage["passage_id"] != expected_id or passage["source_order_key"] != f"02:{order_group:04d}":
            raise ValueError(f"passage identity or order drift at {label}")
        if passage["previous_passage_id"] != expected_previous or passage["next_passage_id"] != expected_next:
            raise ValueError(f"passage links drift at {label}")
        if len(passage["meaning"]["hi"].strip()) < 250 or len(passage["meaning"]["en"].strip()) < 250:
            raise ValueError(f"bilingual meaning is too compressed at {label}")
        if not passage["title"]["hi"].strip() or not passage["title"]["en"].strip():
            raise ValueError(f"missing bilingual title at {label}")
        if len(passage["context_note"]["hi"].strip()) < 100 or len(passage["context_note"]["en"].strip()) < 100:
            raise ValueError(f"context boundary is too compressed at {label}")

        units = passage.get("source_units", [])
        expected_kinds = ["shloka", "shloka", "shloka", "doha"] if label == "invocation" else ["chaupai"] * 4 + ["doha"]
        if [unit["unit_kind"] for unit in units] != expected_kinds:
            raise ValueError(f"natural source-unit grammar drift at {label}")
        if passage.get("source_unit_count") != len(expected_kinds):
            raise ValueError(f"source-unit count drift at {label}")
        for ordinal, unit in enumerate(units, 1):
            if unit["ordinal_in_passage"] != ordinal or unit["source_order_key"] != f"02:{order_group:04d}:{ordinal:02d}":
                raise ValueError(f"unit order drift at {label}:{ordinal}")
            if sha256_text(unit["exact_text"]) != unit["exact_text_sha256"]:
                raise ValueError(f"source text fixity drift at {label}:{ordinal}")
            if unit["locator"]["scan_sha256"] != SCAN_SHA256:
                raise ValueError(f"unit scan identity drift at {label}:{ordinal}")
            all_units.append(unit)

        locator = passage["source_locator"]
        pages = locator["scan_pages"]
        if pages != EXPECTED_PAGE_MAP[label]:
            raise ValueError(f"fixed-scan page map drift at {label}")
        all_pages.update(pages)
        if [row["scan_page"] for row in locator["page_evidence"]] != pages:
            raise ValueError(f"page evidence order drift at {label}")
        for evidence in locator["page_evidence"]:
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

    if len(all_units) != 59 or [unit["batch_unit_ordinal"] for unit in all_units] != list(range(1, 60)):
        raise ValueError("interval must contain exactly 59 consecutively numbered units")
    if len({unit["unit_id"] for unit in all_units}) != 59 or len({unit["source_order_key"] for unit in all_units}) != 59:
        raise ValueError("source units must have unique stable identities and order keys")
    if all_pages != set(range(425, 437)):
        raise ValueError("interval must be evidenced by fixed scan pages 425..436")
    if passages[0]["source_units"][-1]["unit_label"] != "1-invocation" or passages[1]["source_units"][-1]["unit_label"] != "1":
        raise ValueError("the fixed scan's duplicate doha 1 labels must remain distinguishable")

    text = PACK_PATH.read_text(encoding="utf-8", errors="strict")
    required_scan_corrections = [
        "वामाङ्के च विभाति", "शशिनिभः", "मुकुरु सुधारि", "दायकु फल चारि",
        "सब बिधि गुरु प्रसन्न जिय जानी", "बोलेउ राउ रहसि मृदु बानी",
        "प्रमुदित भोहिं कहेउ गुरु आजू", "जियहु जगत पति बरिस करोरी",
        "हरषि मुनीस", "रोपहु बीथिन्ह", "ध्वज पताक तोरन",
        "गुरु आगमन सुनत", "तेहि अवसर आये लखन", "चोरहि चन्दिनि राति",
    ]
    for phrase in required_scan_corrections:
        if phrase not in text:
            raise ValueError(f"reviewed fixed-scan wording drift: {phrase}")
    rejected_reference_errors = [
        "यस्याङ्के", "सबबिधिगुरु", "घोलेउ राउ", "जियहु जगत पति परिस करोरी",
        "हरणि मुनीस", "रोपहु बोथिन्ह", "गुरुआगमन सुनत्त", "लेहि अवसर आये लखन",
        "चारहि चन्दिनि राति",
    ]
    for phrase in rejected_reference_errors:
        if phrase in text:
            raise ValueError(f"reference/transcription error leaked into product text: {phrase}")
    if "ï¿½" in text or "Ã Â¤" in text:
        raise ValueError("common UTF-8 mojibake detected")
    references = pack["source_and_rights"]["reference_only_not_product_carriers"]
    if len(references) != 3 or any("not" not in row["role"].lower() for row in references):
        raise ValueError("reference-only product boundary drift")
    if pack.get("completion_state") != "consumer_complete_en_hi_for_selected_contiguous_interval":
        raise ValueError("bounded completion state drift")
    if "incomplete" not in pack.get("complete_work_denial", "").lower():
        raise ValueError("complete-work denial missing")

    return {
        "result": "PASS",
        "contract": CONTRACT,
        "pack_sha256": computed_pack_sha256,
        "passage_count": len(passages),
        "source_unit_count": len(all_units),
        "bilingual_meaning_count": sum(len(row["meaning"]) for row in passages),
        "complete_work": False,
        "tracked_corpus_copies": 1,
    }


def main() -> int:
    print(json.dumps(validate_pack(load_pack()), sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

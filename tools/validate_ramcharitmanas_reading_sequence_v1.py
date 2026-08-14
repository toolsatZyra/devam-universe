import hashlib
import json
import sys
from pathlib import Path
from typing import Any

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from tools.compile_source_vault_tei_ingestion import canonical_json


ROOT = Path(__file__).resolve().parents[1]
CONTRACT_PATH = ROOT / "knowledge_packs/devotional/ramcharitmanas-reading-contract-v1.json"
SCAN_SHA256 = "6d570d531ebada1912f6e930212393fec2200765a0b731b73b8e7135ea0f70f2"


def load_json(path: Path) -> dict[str, Any]:
    raw = path.read_bytes()
    text = raw.decode("utf-8", errors="strict")
    if text.encode("utf-8") != raw:
        raise ValueError(f"{path} is not stable UTF-8")
    return json.loads(text)


def sha256_text(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def validate_sequence() -> dict[str, Any]:
    contract = load_json(CONTRACT_PATH)
    progress = contract["canonical_reading_progress"]
    batches = progress["completed_contiguous_batches"]
    total_passages = 0
    total_units = 0
    all_passage_ids: set[str] = set()
    all_unit_ids: set[str] = set()
    ayodhya_groups: list[int] = []
    ayodhya_passages: list[dict[str, Any]] = []
    reviewed_packs: list[str] = []

    for batch in batches:
        path = ROOT / batch["pack"]
        pack = load_json(path)
        core = {key: value for key, value in pack.items() if key != "pack_sha256"}
        if pack.get("pack_sha256") != sha256_text(canonical_json(core)):
            raise ValueError(f"pack fixity drift: {path.name}")
        if pack.get("source_and_rights", {}).get("fixed_scan_sha256") != SCAN_SHA256:
            raise ValueError(f"fixed scan identity drift: {path.name}")
        if pack.get("selected_scope", {}).get("complete_work"):
            raise ValueError(f"interval overclaims complete work: {path.name}")
        passages = pack.get("passages", [])
        units = [unit for passage in passages for unit in passage.get("source_units", [])]
        if len(passages) != batch["passages"] or len(units) != batch["source_units"]:
            raise ValueError(f"contract counts drift: {path.name}")
        if batch["bilingual_meanings"] != len(passages):
            raise ValueError(f"bilingual denominator drift: {path.name}")

        keys = [passage["source_order_key"] for passage in passages]
        if keys != sorted(keys) or len(set(keys)) != len(keys):
            raise ValueError(f"passage order drift: {path.name}")
        for passage in passages:
            passage_id = passage["passage_id"]
            if passage_id in all_passage_ids:
                raise ValueError(f"duplicate passage id: {passage_id}")
            all_passage_ids.add(passage_id)
            if not passage["meaning"]["en"].strip() or not passage["meaning"]["hi"].strip():
                raise ValueError(f"missing bilingual meaning: {passage_id}")
            if not passage["context_note"]["en"].strip() or not passage["context_note"]["hi"].strip():
                raise ValueError(f"missing bilingual context: {passage_id}")
            passage_units = passage["source_units"]
            if passage["source_unit_count"] != len(passage_units):
                raise ValueError(f"passage unit count drift: {passage_id}")
            expected_unit_keys = [f"{passage['source_order_key']}:{ordinal:02d}" for ordinal in range(1, len(passage_units) + 1)]
            if [unit["source_order_key"] for unit in passage_units] != expected_unit_keys:
                raise ValueError(f"source unit order drift: {passage_id}")
            for unit in passage_units:
                if unit["unit_id"] in all_unit_ids:
                    raise ValueError(f"duplicate source unit id: {unit['unit_id']}")
                all_unit_ids.add(unit["unit_id"])
                if unit["exact_text_sha256"] != sha256_text(unit["exact_text"]):
                    raise ValueError(f"source text fixity drift: {unit['unit_id']}")
                if unit["locator"]["scan_sha256"] != SCAN_SHA256:
                    raise ValueError(f"source unit scan drift: {unit['unit_id']}")

        if batch["division"] == "Ayodhyakanda":
            numbered = [
                passage for passage in passages
                if passage["canonical_group_label"] != "invocation"
            ]
            ayodhya_groups.extend(int(passage["canonical_group_label"]) for passage in numbered)
            ayodhya_passages.extend(passages)
        total_passages += len(passages)
        total_units += len(units)
        reviewed_packs.append(batch["pack"])

    if total_passages != progress["completed_passages"] or total_units != progress["completed_source_units"]:
        raise ValueError("cumulative reading denominator drift")
    ayodhya_forward_endpoint = max(ayodhya_groups)
    if ayodhya_groups != list(range(1, ayodhya_forward_endpoint + 1)):
        raise ValueError(f"Ayodhyakanda forward sequence must be gapless through group {ayodhya_forward_endpoint}")
    for index, passage in enumerate(ayodhya_passages):
        expected_previous = None if index == 0 else ayodhya_passages[index - 1]["passage_id"]
        expected_next = None if index == len(ayodhya_passages) - 1 else ayodhya_passages[index + 1]["passage_id"]
        if passage["previous_passage_id"] != expected_previous:
            raise ValueError(f"Ayodhyakanda previous-link drift: {passage['passage_id']}")
        if passage["next_passage_id"] != expected_next:
            raise ValueError(f"Ayodhyakanda next-link drift: {passage['passage_id']}")
    modes = {row["mode_id"]: row for row in contract["reading_modes"]}
    required_modes = {
        "complete_work_continuous", "one_page_daily", "short_passage_daily",
        "one_source_unit_daily", "kanda_progression", "resume_exact_position",
    }
    if set(modes) != required_modes:
        raise ValueError("reading mode contract drift")
    if "optional" not in contract["purpose"].lower():
        raise ValueError("daily pacing must remain optional")

    return {
        "result": "PASS",
        "reviewed_packs": reviewed_packs,
        "completed_passages": total_passages,
        "completed_source_units": total_units,
        "ayodhya_forward_endpoint": ayodhya_forward_endpoint,
        "complete_full_kandas": progress["completed_full_divisions"],
        "complete_work": False,
    }


def main() -> int:
    print(json.dumps(validate_sequence(), sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

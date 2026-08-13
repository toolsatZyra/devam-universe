import hashlib
import json
import sys
from pathlib import Path
from typing import Any

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from tools.compile_source_vault_tei_ingestion import canonical_json


ROOT = Path(__file__).resolve().parents[1]
PACK_PATH = ROOT / "knowledge_packs/devotional/ramcharitmanas-balakanda-293-361-v1.json"
PLAN_PATH = ROOT / "ingestion/plans/ramcharitmanas-wikisource-belvedere-pages-v1.json"
REPORT_PATH = ROOT / "ingestion/reports/ramcharitmanas-wikisource-belvedere-pages-v1.json"

CONTRACT = "DEVAM_RAMCHARITMANAS_BALAKANDA_READING_SEQUENCE_V1"
SEQUENCE_KEY = "ramcharitmanas-belvedere-normalized-reading-v1"
SCAN_SHA256 = "6d570d531ebada1912f6e930212393fec2200765a0b731b73b8e7135ea0f70f2"
PLAN_SHA256 = "fbc2a25045bcf8dcbfcb8a5dd2c5388fe8263c209567d515b27f138d0882c0ab"
REPORT_SHA256 = "8a6547f3c2f74194a29a885d2b7529ce9fcdd06daa51e7e32c6f48f2e0a2cf7c"
EXPECTED_PACK_SHA256 = "3f5613b2c381229e49c1ce65689496f76a051195f440752d291baf69cd9e506f"

EXPECTED_NEW_PAGE_MAP = {
    340: [404, 405], 341: [405, 406], 342: [406, 407],
    343: [407, 408], 344: [408], 345: [409], 346: [409, 410],
    347: [410, 411], 348: [411, 412], 349: [412, 413],
    350: [413], 351: [414], 352: [414, 415], 353: [415, 416],
    354: [416, 417], 355: [417], 356: [417, 418],
    357: [418, 419], 358: [419, 420], 359: [420, 421],
    360: [421, 422], 361: [422, 423, 424],
}


def expected_kinds_for_group(group: int) -> list[str]:
    kinds = ["chaupai"] * (5 if group in {325, 327, 360} else 4)
    if group in {311, 316, 317, 318, 319, 320, 321, 322, 323, 336}:
        kinds.append("chhand")
    if group == 323:
        kinds.append("chhand")
    if group in {324, 325, 326, 327}:
        kinds.extend(["chhand"] * 4)
    if group == 350:
        kinds.extend(["doha", "doha"])
        return kinds
    if group == 361:
        kinds.extend(["chhand", "soratha"])
        return kinds
    kinds.append("soratha" if group in {295, 311, 336} else "doha")
    return kinds


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
        raise ValueError("pinned Wikisource product report drift")

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

    plan = load_json(PLAN_PATH)
    report = load_json(REPORT_PATH)
    profiles = {row["scan_page"]: row for row in plan["wikisource"]["pages"]}
    product_pages = {row["scan_page"]: row for row in report["pages"]}

    passages = pack.get("passages", [])
    expected_groups = list(range(293, 362))
    if [int(row["canonical_group_label"]) for row in passages] != expected_groups:
        raise ValueError("passages must be the contiguous groups 293..361")
    if pack.get("selected_scope", {}).get("complete_work") is not False:
        raise ValueError("bounded batch must deny complete-work status")
    if pack.get("selected_scope", {}).get("reaches_division_end") is not True:
        raise ValueError("selected interval must explicitly reach the Balakanda end")
    if pack.get("selected_scope", {}).get("complete_division") is not False:
        raise ValueError("selected interval must deny Balakanda completion while groups 1..292 are absent")

    all_units: list[dict[str, Any]] = []
    all_pages: set[int] = set()
    for index, passage in enumerate(passages):
        group = expected_groups[index]
        expected_id = f"ramcharitmanas-balakanda-{group:04d}"
        expected_previous = None if index == 0 else f"ramcharitmanas-balakanda-{group - 1:04d}"
        expected_next = None if index == len(passages) - 1 else f"ramcharitmanas-balakanda-{group + 1:04d}"
        if passage["passage_id"] != expected_id:
            raise ValueError(f"passage identity drift at group {group}")
        if passage["source_order_key"] != f"01:{group:04d}":
            raise ValueError(f"passage order drift at group {group}")
        if passage["previous_passage_id"] != expected_previous or passage["next_passage_id"] != expected_next:
            raise ValueError(f"passage links drift at group {group}")
        if not passage["title"]["hi"].strip() or not passage["title"]["en"].strip():
            raise ValueError(f"missing bilingual title at group {group}")
        if len(passage["meaning"]["hi"].strip()) < 180 or len(passage["meaning"]["en"].strip()) < 180:
            raise ValueError(f"bilingual meaning is too compressed at group {group}")

        units = passage.get("source_units", [])
        expected_kinds = expected_kinds_for_group(group)
        if [row["unit_kind"] for row in units] != expected_kinds:
            raise ValueError(f"natural unit grammar drift at group {group}")
        if passage.get("source_unit_count") != len(expected_kinds):
            raise ValueError(f"source-unit count drift at group {group}")
        for ordinal, unit in enumerate(units, 1):
            if unit["ordinal_in_passage"] != ordinal:
                raise ValueError(f"unit ordinal drift at group {group}")
            if unit["source_order_key"] != f"01:{group:04d}:{ordinal:02d}":
                raise ValueError(f"unit order drift at group {group}")
            if sha256_text(unit["exact_text"]) != unit["exact_text_sha256"]:
                raise ValueError(f"source text fixity drift at group {group}, unit {ordinal}")
            if unit["locator"]["scan_sha256"] != SCAN_SHA256:
                raise ValueError(f"unit scan identity drift at group {group}, unit {ordinal}")
            all_units.append(unit)

        locator = passage["source_locator"]
        pages = locator["scan_pages"]
        if group in EXPECTED_NEW_PAGE_MAP and pages != EXPECTED_NEW_PAGE_MAP[group]:
            raise ValueError(f"fixed-scan page map drift at group {group}")
        all_pages.update(pages)
        if [row["scan_page"] for row in locator["page_evidence"]] != pages:
            raise ValueError(f"page evidence order drift at group {group}")
        for evidence in locator["page_evidence"]:
            page = evidence["scan_page"]
            profile = profiles[page]
            product_page = product_pages[page]
            expected = {
                "scan_page": page,
                "provider_page_title": profile["title"],
                "provider_page_id": profile["pageid"],
                "provider_revision_id": profile["revid"],
                "provider_revision_timestamp": profile["timestamp"],
                "provider_revision_sha1": profile["provider_sha1_hex"],
                "proofread_page_quality_level": profile["quality_level"],
                "revision_content_sha256": product_page["content_sha256"],
            }
            if evidence != expected:
                raise ValueError(f"pinned page evidence drift at scan page {page}")

    if len(all_units) != 377 or [row["batch_unit_ordinal"] for row in all_units] != list(range(1, 378)):
        raise ValueError("interval must contain exactly 377 consecutively numbered units")
    if len({row["unit_id"] for row in all_units}) != 377 or len({row["source_order_key"] for row in all_units}) != 377:
        raise ValueError("source units must have unique stable identities and order keys")
    if all_pages != set(range(354, 425)):
        raise ValueError("interval must be evidenced by fixed scan pages 354..424")
    group_350 = passages[350 - 293]["source_units"]
    if [row["unit_label"] for row in group_350[-2:]] != ["350a", "350b"]:
        raise ValueError("group 350 must retain its two separately labelled dohas")
    group_361 = passages[-1]["source_units"]
    if [row["unit_label"] for row in group_361[-2:]] != ["closing-chhand", "361"]:
        raise ValueError("group 361 must retain the closing chhand and soratha")

    text = PACK_PATH.read_text(encoding="utf-8", errors="strict")
    if "तदपि प्रीति कै रीति सुहाई" not in text or "तदपि प्रीति कै प्रीति सुहाई" in text:
        raise ValueError("reviewed group 296 scan correction drift")
    if "क्रोध मोह ममता मद त्यागी" not in text or "कोहु मोहु ममता मदु त्यागी" in text:
        raise ValueError("reviewed group 341 scan correction drift")
    if "मनहुँ बलाक अवलि मनु करषहिं" not in text or "मनहुँबलाक अवलि मनु करषहिं" in text:
        raise ValueError("reviewed group 347 spacing correction drift")
    if "ï¿½" in text or "Ã Â¤" in text:
        raise ValueError("common UTF-8 mojibake detected")
    references = pack["source_and_rights"]["reference_only_not_product_carriers"]
    if not references or any("not" not in row["role"].lower() for row in references):
        raise ValueError("reference-only product boundary drift")

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

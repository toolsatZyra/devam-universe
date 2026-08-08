from __future__ import annotations

import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / "ingestion/reports/ramayana-manmatha-nath-dutt-commons-visual-review-v1.json"


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def resolve_relative(value: str) -> Path:
    path = (ROOT / value).resolve(strict=True)
    path.relative_to(ROOT.resolve())
    return path


def main() -> None:
    report = load_json(REPORT)
    checks: dict[str, bool] = {}

    checks["contract_and_decision_exact"] = (
        report["contract"] == "DEVAM_DUTT_DJVU_VISUAL_REVIEW_V1"
        and report["decision"] == "VISUAL_IDENTITY_AND_TERMINAL_BOUNDARIES_CONFIRMED_OCR_QUARANTINED"
    )

    profile_path = resolve_relative(report["source_profile"]["path"])
    plan_path = resolve_relative(report["source_plan"]["path"])
    manifest_path = resolve_relative(report["local_render"]["manifest_path"])
    tool_path = resolve_relative(report["local_render"]["tool_path"])
    checks["frozen_input_hashes_match"] = (
        sha256(profile_path) == report["source_profile"]["sha256"]
        and sha256(plan_path) == report["source_plan"]["sha256"]
        and sha256(manifest_path) == report["local_render"]["manifest_sha256"]
        and sha256(tool_path) == report["local_render"]["tool_sha256"]
    )

    profile = load_json(profile_path)
    plan = load_json(plan_path)
    manifest = load_json(manifest_path)
    checks["source_identity_exact"] = (
        profile["volume_count"] == 7
        and profile["total_pages"] == 1942
        and profile["total_bytes"] == 72688252
        and plan["identity_boundary"] == report["identity_boundary"]
    )
    checks["rights_evidence_bound_without_overclaim"] = (
        plan["rights_evidence"]["literal"] == report["rights_boundary"]["commons_file_metadata_observed"]
        and "history evidence only" in report["rights_boundary"]["interpretation"]
        and report["claims"]["exact_text_product_ready"] is False
    )

    expected_pages = {
        (1, "title"): 7,
        (1, "terminal"): 192,
        (1, "trailing_library"): 196,
        (2, "title"): 7,
        (2, "terminal"): 335,
        (3, "title"): 9,
        (3, "terminal"): 194,
        (4, "title"): 6,
        (4, "terminal"): 189,
        (5, "title"): 6,
        (5, "terminal"): 232,
        (6, "title"): 7,
        (6, "terminal"): 453,
        (7, "title"): 7,
        (7, "terminal"): 310,
    }
    records = manifest["records"]
    checks["render_manifest_exact_universe"] = (
        manifest["contract"] == "DEVAM_DUTT_DJVU_LOCAL_VISUAL_RENDER_V1"
        and len(records) == report["local_render"]["record_count"] == 15
        and {(row["volume"], row["role"]): row["carrier_page_1_based"] for row in records} == expected_pages
    )

    profile_volumes = {row["volume_ordinal"]: row for row in profile["volumes"]}
    render_files_valid = True
    for row in records:
        output = resolve_relative(row["output_path"])
        carrier = profile_volumes[row["volume"]]
        render_files_valid &= (
            output.is_file()
            and output.stat().st_size == row["bytes"]
            and sha256(output) == row["sha256"]
            and row["carrier_sha256"] == carrier["sha256"]
            and row["sha256"] != carrier["sha256"]
            and row["bytes"] != carrier["bytes"]
        )
    checks["all_render_files_rehashed_and_not_source_copies"] = render_files_valid

    volume_rows = {row["volume"]: row for row in report["volumes"]}
    expected_terminal = {
        1: (192, "176", None),
        2: (335, "503", "END OF AYODHYAKANDAM."),
        3: (194, "688", "END OF THE ARANYAKANDAM."),
        4: (189, "870", "END OF KISHKINDHAKANDAM."),
        5: (232, "1097", "END OF SUNDARAKANDAM."),
        6: (453, "1549", "THE END OF YUDDHAKANDAM."),
        7: (310, "1933", "THE END."),
    }
    checks["visual_volume_rows_exact"] = (
        set(volume_rows) == set(range(1, 8))
        and all(
            (
                volume_rows[number]["terminal_carrier_page_1_based"],
                volume_rows[number]["terminal_printed_page"],
                volume_rows[number]["terminal_formula"],
            )
            == expected_terminal[number]
            and volume_rows[number]["title_carrier_page_1_based"] == expected_pages[(number, "title")]
            and "THE RAMAYANA" in volume_rows[number]["title_literals_observed"]
            and "Translated into English Prose from the original Sanskrit of Valmiki" in volume_rows[number]["title_literals_observed"]
            and "Edited and Published by MANMATHA NATH DUTT" in volume_rows[number]["title_literals_observed"]
            for number in range(1, 8)
        )
    )
    checks["volume_one_terminal_distinction_preserved"] = (
        volume_rows[1]["terminal_formula"] is None
        and "no literal END formula" in volume_rows[1]["terminal_observation"]
        and volume_rows[1]["trailing_matter"]
        == [{"carrier_page_1_based": 196, "observation": "Union Theological Seminary library circulation leaf; not source narrative."}]
    )

    expected_claims = {
        "exact_seven_carrier_identity_visually_confirmed": True,
        "bounded_title_and_terminal_evidence_confirmed": True,
        "all_page_coordinates_profiled": True,
        "generated_renders_replace_source_carriers": False,
        "provider_ocr_verified_for_product_search": False,
        "provider_ocr_servable": False,
        "exact_text_product_ready": False,
        "internal_page_omission_fully_excluded_by_visual_sampling": False,
        "all_ramayana_editions_or_traditions_complete": False,
        "all_languages_complete": False,
    }
    checks["claims_exact_and_fail_closed"] = report["claims"] == expected_claims
    checks["no_network_or_source_duplication"] = (
        report["local_render"]["network_used_for_rendering"] is False
        and report["local_render"]["source_carriers_copied"] is False
    )

    failed = [name for name, passed in checks.items() if not passed]
    result = {
        "contract": "DEVAM_DUTT_DJVU_VISUAL_REVIEW_VALIDATION_V1",
        "result": "PASS" if not failed else "FAIL",
        "report_path": REPORT.relative_to(ROOT).as_posix(),
        "report_sha256": sha256(REPORT),
        "checks": checks,
        "passed": sum(checks.values()),
        "total": len(checks),
        "failed": failed,
    }
    print(json.dumps(result, indent=2))
    if failed:
        raise SystemExit(1)


if __name__ == "__main__":
    main()

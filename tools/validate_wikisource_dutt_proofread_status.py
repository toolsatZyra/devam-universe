from __future__ import annotations

import hashlib
import json
from pathlib import Path
from urllib.parse import parse_qs, urlparse


ROOT = Path(__file__).resolve().parents[1]
STRUCTURE = ROOT / "ingestion/reports/ramayana-manmatha-nath-dutt-commons-structure-v1.json"
REPORT = ROOT / "ingestion/reports/ramayana-manmatha-nath-dutt-wikisource-proofread-status-v1.json"

EXPECTED_KANDAS = [
    "Bāla Kanda",
    "Ayodhya Kanda",
    "Āranya Kanda",
    "Kishkindhā Kanda",
    "Sundara Kanda",
    "Yuddha Kanda",
    "Uttara Kanda",
]
EXPECTED_YEARS = ["1891", "1892", "1892", "1891", "1892", "1893", "1894"]
EXPECTED_PUBLISHERS = ["Elysium Press", "Elysium Press", "Deva Press", "Deva Press", "Deva Press", "Deva Press", ""]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
    structure = json.loads(STRUCTURE.read_text(encoding="utf-8"))
    report = json.loads(REPORT.read_text(encoding="utf-8"))
    checks: dict[str, bool] = {}

    checks["contract_exact"] = report["contract"] == "DEVAM_WIKISOURCE_DUTT_INDEX_STATUS_PROFILE_V1"
    checks["structure_bound"] = (
        report["structure_profile"] == "ingestion/reports/ramayana-manmatha-nath-dutt-commons-structure-v1.json"
        and report["structure_profile_sha256"] == sha256(STRUCTURE)
        and structure["volume_count"] == report["volume_count"] == 7
        and structure["total_pages"] == report["total_carrier_pages"] == 1942
    )
    checks["observation_boundary_exact"] = report["observation_boundary"] == (
        "Seven current English Wikisource Index-namespace records only. Raw index metadata was observed through normal TLS; "
        "no Page-namespace transcription text or source carrier was acquired."
    )

    rows = report["volumes"]
    source_rows = {row["volume_ordinal"]: row for row in structure["volumes"]}
    checks["seven_ordered_records"] = [row["volume_ordinal"] for row in rows] == list(range(1, 8))
    identity_ok = True
    transport_ok = True
    structure_ok = True
    for row in rows:
        number = row["volume_ordinal"]
        expected_title = f"Index:The Ramayana (Manmatha Nath Dutt) Canto {number}.djvu"
        parsed = urlparse(row["request_url"])
        query = parse_qs(parsed.query)
        expected_author = "" if number == 5 else "[[Author:Valmiki|Valmiki]]"
        expected_translator = "" if number == 5 else "[[Author:Manmatha Nath Dutt|Manmatha Nath Dutt]]"
        identity_ok &= (
            row["index_title"] == expected_title
            and row["title_literal"] == "The Ramayana"
            and row["volume_literal"] == EXPECTED_KANDAS[number - 1]
            and row["author_literal"] == expected_author
            and row["translator_literal"] == expected_translator
            and row["publisher_literal"] == EXPECTED_PUBLISHERS[number - 1]
            and row["location_literal"] == "Calcutta"
            and row["year_literal"] == EXPECTED_YEARS[number - 1]
            and row["source_literal"] == "djvu"
        )
        transport_ok &= (
            parsed.scheme == "https"
            and parsed.netloc == "en.wikisource.org"
            and parsed.path == "/w/index.php"
            and query == {"title": [expected_title], "action": ["raw"]}
            and row["final_url"] == row["request_url"]
            and row["http_status"] == 200
            and row["raw_bytes"] > 0
            and len(row["raw_sha256"]) == 64
            and row["strict_utf8_roundtrip"] is True
        )
        source = source_rows[number]
        structure_ok &= row["carrier_page_count"] == source["page_count"] and row["carrier_sha256"] == source["sha256"]

    checks["provider_identity_literals_exact"] = identity_ok
    checks["normal_tls_raw_observations_exact"] = transport_ok
    checks["carrier_coordinates_and_hashes_bound"] = structure_ok
    checks["all_progress_c_and_untranscluded"] = all(
        row["progress_literal"] == "C" and row["transclusion_literal"] == "no" for row in rows
    )
    checks["claims_exact_and_fail_closed"] = report["claims"] == {
        "all_seven_index_records_observed": True,
        "all_indexes_marked_to_be_proofread": True,
        "all_indexes_untranscluded": True,
        "complete_proofread_transcription_available": False,
        "exact_text_product_ready": False,
        "page_namespace_text_acquired": False,
        "provider_ocr_may_be_served_as_exact_text": False,
    }
    checks["decision_exact"] = (
        report["product_decision"] == "retain_seven_scans_as_complete_edition_evidence_and_curate_verified_passages_only"
        and report["decision_reason"]
        == "All seven exact Wikisource indexes remain Progress=C (To be proofread) and Transclusion=no; they do not supply a complete proofread, transcluded English edition."
    )

    failed = [name for name, passed in checks.items() if not passed]
    result = {
        "contract": "DEVAM_WIKISOURCE_DUTT_INDEX_STATUS_VALIDATION_V1",
        "result": "PASS" if not failed else "FAIL",
        "report_sha256": sha256(REPORT),
        "checks": checks,
        "passed": sum(checks.values()),
        "total": len(checks),
        "failed": failed,
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))
    if failed:
        raise SystemExit(1)


if __name__ == "__main__":
    main()

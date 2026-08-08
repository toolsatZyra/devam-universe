from __future__ import annotations

import difflib
import hashlib
import json
import subprocess
import sys
import unicodedata
from pathlib import Path
from typing import Any

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from tools.profile_ramcharitmanas_belvedere_ia_ocr import LANDMARKS


ROOT = Path(__file__).resolve().parents[1]
SOURCE_SHA256 = "6d570d531ebada1912f6e930212393fec2200765a0b731b73b8e7135ea0f70f2"
RENDERS = ROOT / "tmp/pdfs/ramcharitmanas-belvedere-ocr-benchmark/renders"
OCR = ROOT / "tmp/pdfs/ramcharitmanas-belvedere-ocr-benchmark/ocr"
REPORT = ROOT / "ingestion/reports/ramcharitmanas-belvedere-tesseract-benchmark-v1.json"
TESSERACT = Path(r"C:\Program Files\Tesseract-OCR\tesseract.exe")
MODELS = {
    "fast": {
        "path": ROOT / "tmp/ocr-tools/tessdata-fast/hin.traineddata",
        "bytes": 1_122_751,
        "sha256": "4c73ffc59d497c186b19d1e90f5d721d678ea6b2e277b719bee4e2af12271825",
        "url": "https://raw.githubusercontent.com/tesseract-ocr/tessdata_fast/main/hin.traineddata",
    },
    "best": {
        "path": ROOT / "tmp/ocr-tools/tessdata-best/hin.traineddata",
        "bytes": 11_895_564,
        "sha256": "bd2e65a2184af08a167b0be2439e91fa5edbc4394399ca2f692b843ae26e78d6",
        "url": "https://raw.githubusercontent.com/tesseract-ocr/tessdata_best/main/hin.traineddata",
    },
}
LEGACY = {"exact_literal_matches": 3, "exact_token_hits": 32, "expected_tokens": 51}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def alnum_text(value: str) -> str:
    return "".join(character for character in unicodedata.normalize("NFC", value) if character.isalnum())


def metrics(text: str, expected: str) -> dict[str, Any]:
    observed = alnum_text(text)
    target = alnum_text(expected)
    tokens = [alnum_text(token) for token in expected.split()]
    longest = difflib.SequenceMatcher(None, target, observed, autojunk=False).find_longest_match().size
    return {
        "ocr_text_sha256": hashlib.sha256(text.encode("utf-8")).hexdigest(),
        "ocr_characters": len(text),
        "expected_token_count": len(tokens),
        "exact_token_hits": sum(bool(token) and token in observed for token in tokens),
        "exact_literal_present": target in observed,
        "longest_exact_character_run": longest,
        "expected_normalized_characters": len(target),
    }


def main() -> None:
    if not TESSERACT.is_file():
        raise SystemExit("Tesseract executable absent")
    for row in MODELS.values():
        if row["path"].stat().st_size != row["bytes"] or sha256(row["path"]) != row["sha256"]:
            raise SystemExit("Hindi model drift")
    version = subprocess.run(
        [str(TESSERACT), "--version"], check=True, capture_output=True, text=True, encoding="utf-8", errors="replace"
    ).stdout.splitlines()[0]
    render_rows = []
    for page, _expected, _role in LANDMARKS:
        path = RENDERS / f"page-{page:04d}.png"
        render_rows.append({"pdf_page": page, "bytes": path.stat().st_size, "sha256": sha256(path)})
    render_root = hashlib.sha256(
        "\n".join(f"{row['pdf_page']}:{row['bytes']}:{row['sha256']}" for row in render_rows).encode("ascii")
    ).hexdigest()

    configurations = []
    for variant in MODELS:
        for psm in (3, 6):
            rows = []
            for page, expected, role in LANDMARKS:
                text_path = OCR / f"page-{page:04d}-{variant}-psm{psm}.txt"
                text = text_path.read_text(encoding="utf-8", errors="strict")
                rows.append({"pdf_page": page, "role": role, "expected_literal": expected, **metrics(text, expected)})
            configurations.append({
                "model": variant,
                "psm": psm,
                "exact_literal_matches": sum(row["exact_literal_present"] for row in rows),
                "exact_token_hits": sum(row["exact_token_hits"] for row in rows),
                "expected_tokens": sum(row["expected_token_count"] for row in rows),
                "longest_exact_character_run_total": sum(row["longest_exact_character_run"] for row in rows),
                "rows": rows,
            })
    ranked = sorted(
        configurations,
        key=lambda row: (
            row["exact_literal_matches"],
            row["exact_token_hits"],
            row["longest_exact_character_run_total"],
        ),
        reverse=True,
    )
    best = ranked[0]
    materially_better = (
        best["exact_literal_matches"] > LEGACY["exact_literal_matches"]
        and best["exact_token_hits"] > LEGACY["exact_token_hits"]
    )
    report = {
        "contract": "DEVAM_LOCAL_OCR_BENCHMARK_V1",
        "decision": "SCALE_LOCAL_TESSERACT_FOR_CORRECTION_DRAFT" if materially_better else "DO_NOT_SCALE_LOCAL_TESSERACT",
        "fixed_source_sha256": SOURCE_SHA256,
        "benchmark_scope": "Eighteen fixed pages: title, every sopana start and close, Aarti, and Manas-Pingala start/close. This tests whether local OCR is worth scaling; it does not prove whole-book accuracy or product readiness.",
        "engine": {
            "version": version,
            "installer_sha256": "c885fff6998e0608ba4bb8ab51436e1c6775c2bafc2559a19b423e18678b60c9",
            "license": "Apache-2.0",
        },
        "models": {
            key: {name: value for name, value in row.items() if name != "path"}
            for key, row in MODELS.items()
        },
        "rendering": {
            "dpi": 300,
            "format": "PNG",
            "page_count": len(render_rows),
            "render_inventory_root": render_root,
            "renders_persisted": False,
        },
        "legacy_ia_ocr_baseline": LEGACY,
        "configurations": configurations,
        "best_configuration": {
            key: value for key, value in best.items() if key != "rows"
        },
        "materially_better_than_legacy_on_both_exact_literals_and_tokens": materially_better,
        "product_boundary": {
            "benchmark_is_ground_truth": False,
            "full_book_local_ocr_product_ready": False,
            "ocr_passages_allowed": False,
            "public_search_sarthi_api_vector_training_allowed": False,
            "full_book_run_allowed_only_as_correction_draft": materially_better,
        },
    }
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "decision": report["decision"],
        "legacy": LEGACY,
        "best": report["best_configuration"],
        "report": str(REPORT.relative_to(ROOT)).replace("\\", "/"),
        "report_sha256": sha256(REPORT),
    }, sort_keys=True))


if __name__ == "__main__":
    main()

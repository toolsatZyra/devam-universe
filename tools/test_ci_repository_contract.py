import json
import pathlib
import re
import subprocess
import unittest


ROOT = pathlib.Path(__file__).resolve().parents[1]
WEB_SOURCE = ROOT / "apps" / "web" / "src"
COMPACT_DATA_DIRS = (
    ROOT / "knowledge_packs",
    ROOT / "ingestion" / "plans",
    ROOT / "ingestion" / "reports",
)


class CleanCheckoutRepositoryContractTests(unittest.TestCase):
    def test_compact_product_data_is_tracked_parseable_json(self) -> None:
        for directory in COMPACT_DATA_DIRS:
            files = sorted(directory.rglob("*.json"))
            self.assertTrue(files, f"no compact JSON files found under {directory}")
            for path in files:
                with self.subTest(path=path.relative_to(ROOT).as_posix()):
                    json.loads(path.read_text(encoding="utf-8"))

        required = {
            "source_vault/summary.json",
            "source_vault/objects.jsonl",
            "source_vault/provenance-map.jsonl",
        }
        tracked = set(
            subprocess.run(
                ["git", "ls-files"],
                cwd=ROOT,
                check=True,
                capture_output=True,
                text=True,
            ).stdout.splitlines()
        )
        self.assertTrue(required.issubset(tracked))
        self.assertFalse(
            any(path.startswith("source_vault/objects/") for path in tracked),
            "canonical source payloads must remain outside Git",
        )

    def test_deployable_runtime_does_not_open_canonical_source_payloads(self) -> None:
        violations: list[str] = []
        literal_read = re.compile(r"readFileSync\([^\n]*source_vault[/\\]objects")
        indirect_read = "readFileSync(resolve(root, SOURCE_PATH))"
        for path in sorted(WEB_SOURCE.rglob("*.ts")):
            if path.name.endswith(".test.ts") or "test" in path.parts:
                continue
            text = path.read_text(encoding="utf-8")
            if literal_read.search(text) or indirect_read in text:
                violations.append(path.relative_to(ROOT).as_posix())
        self.assertEqual(violations, [])

    def test_local_source_payload_checks_are_explicitly_gated(self) -> None:
        helper = (WEB_SOURCE / "test" / "source-vault.ts").read_text(encoding="utf-8")
        self.assertIn("DEVAM_REQUIRE_SOURCE_VAULT", helper)
        self.assertIn("sourceVaultIt", helper)

        ungated: list[str] = []
        for path in sorted(WEB_SOURCE.rglob("*.test.ts")):
            text = path.read_text(encoding="utf-8")
            if "source_vault/objects" in text and "sourceVaultIt" not in text:
                ungated.append(path.relative_to(ROOT).as_posix())
        self.assertEqual(ungated, [])


if __name__ == "__main__":
    unittest.main()

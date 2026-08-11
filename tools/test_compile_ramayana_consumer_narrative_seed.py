import subprocess
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
COMPILER = ROOT / "tools" / "compile_ramayana_consumer_narrative_seed.cjs"
MIGRATION = ROOT / "supabase" / "migrations" / "20260810220000_seed_ramayana_consumer_narrative.sql"


class RamayanaConsumerNarrativeSeedTest(unittest.TestCase):
    def test_generated_migration_is_current(self) -> None:
        result = subprocess.run(
            ["node", str(COMPILER), "--check"],
            cwd=ROOT,
            capture_output=True,
            text=True,
            check=False,
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("PASS", result.stdout)

    def test_migration_keeps_outlines_draft_and_playable_scenes_source_addressed(self) -> None:
        sql = MIGRATION.read_text(encoding="utf-8")
        self.assertIn("Expected 29 playable Ramayana turns", sql)
        self.assertIn("Expected 20 unfinished Ramayana turns", sql)
        self.assertIn("Expected 0 outlined Ramayana turns", sql)
        self.assertIn("Expected 20 orientation-only Ramayana turns", sql)
        self.assertIn("Expected 176 Ramayana playable scenes", sql)
        self.assertIn("Expected 0 draft Ramayana scene outlines", sql)
        self.assertIn("Expected 788 Ramayana narrative beats", sql)
        self.assertIn("Expected 450 bilingual Ramayana moment texts", sql)
        self.assertIn("Expected 1576 bilingual Ramayana beat texts", sql)
        self.assertIn("source_range->>'spanSha256'", sql)
        self.assertIn("source_range->'spanSha256s'", sql)
        self.assertIn("sourceAddressKind", sql)
        self.assertNotIn("source_vault/objects", sql)


if __name__ == "__main__":
    unittest.main()

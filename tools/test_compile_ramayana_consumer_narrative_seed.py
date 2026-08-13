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
        self.assertIn("Expected 49 playable Ramayana turns", sql)
        self.assertIn("Expected 0 unfinished Ramayana turns", sql)
        self.assertIn("Expected 0 outlined Ramayana turns", sql)
        self.assertIn("Expected 0 orientation-only Ramayana turns", sql)
        self.assertIn("Expected 413 Ramayana playable scenes", sql)
        self.assertIn("Expected 0 draft Ramayana scene outlines", sql)
        self.assertIn("Expected 1794 Ramayana narrative beats", sql)
        self.assertIn("Expected 924 bilingual Ramayana moment texts", sql)
        self.assertIn("Expected 3588 bilingual Ramayana beat texts", sql)
        self.assertIn("Ramayana narrative traversal links", sql)
        self.assertIn("'character_path'", sql)
        self.assertIn("'place_echo'", sql)
        self.assertIn("'parallel_thread'", sql)
        self.assertIn("Expected 6 Ramayana living Atlas connections", sql)
        self.assertIn("DEVAM_RAMAYANA_LIVING_CONNECTIONS_V1", sql)
        self.assertIn("'turn-road-home', 'diwali', 'festival'", sql)
        self.assertIn("'turn-hanuman-remembers', 'hanuman-chalisa', 'devotional_text'", sql)
        self.assertIn('"characters":', sql)
        self.assertIn('"places":', sql)
        self.assertIn('"threads":', sql)
        self.assertIn("source_range->>'spanSha256'", sql)
        self.assertIn("source_range->'spanSha256s'", sql)
        self.assertIn("sourceAddressKind", sql)
        self.assertNotIn("source_vault/objects", sql)


if __name__ == "__main__":
    unittest.main()

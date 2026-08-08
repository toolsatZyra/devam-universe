from pathlib import Path
import json
import tempfile
import unittest

from tools.compile_source_bounded_knowledge_pack import (
    ROOT,
    compile_sql,
    compile_sql_batches,
    load_pack,
    sha256_bytes,
)


PACK = ROOT / "knowledge_packs" / "ganesha" / "shriganapatimantraksharavali-v1.json"


class SourceBoundedKnowledgePackTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.pack = load_pack(PACK)
        cls.sql = compile_sql(cls.pack)

    def test_pack_is_bilingual_source_bounded_and_non_exhaustive(self) -> None:
        self.assertEqual({claim["language_code"] for claim in self.pack["claims"]}, {"en", "hi"})
        self.assertFalse(self.pack["objective_alignment"]["hero_universe_complete"])
        self.assertGreaterEqual(len(self.pack["objective_alignment"]["uncovered_priority_targets"]), 8)
        self.assertTrue(all(claim["applicability"]["scope"] == "this_source_only" for claim in self.pack["claims"]))
        self.assertTrue(all(claim["uncertainty_note"] for claim in self.pack["claims"]))

    def test_sql_is_idempotent_published_and_source_bounded(self) -> None:
        self.assertIn("on conflict (stable_key) do update", self.sql)
        self.assertIn("on conflict (slug) do update", self.sql)
        self.assertIn("'published'", self.sql)
        self.assertIn("update public.passages", self.sql)
        self.assertIn("source_ordinal in (1, 12, 29, 31, 32)", self.sql)
        self.assertNotIn("insert into public.source_objects", self.sql)
        self.assertNotIn("insert into public.passages", self.sql)
        self.assertEqual(len(compile_sql_batches(self.sql)), 6)

    def test_tampered_evidence_fails_closed(self) -> None:
        value = json.loads(PACK.read_text(encoding="utf-8"))
        value["claims"][0]["evidence"][0]["required_text"] = "ABSENT FROM SOURCE"
        with tempfile.TemporaryDirectory(dir=ROOT / "knowledge_packs") as temp_dir:
            path = Path(temp_dir) / "tampered.json"
            path.write_text(json.dumps(value, ensure_ascii=False), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "evidence text is absent"):
                load_pack(path)

    def test_pack_and_sql_hashes_are_deterministic(self) -> None:
        self.assertRegex(self.pack["pack_sha256"], r"^[0-9a-f]{64}$")
        self.assertRegex(sha256_bytes(self.sql.encode("utf-8")), r"^[0-9a-f]{64}$")


if __name__ == "__main__":
    unittest.main()

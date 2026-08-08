from __future__ import annotations

import copy
import json
import tempfile
import unittest
from pathlib import Path

from tools.compile_ganesha_purana_structure_search_v1 import PACK_PATH, build_report, load_and_validate_pack


class GaneshaPuranaStructureSearchCompilerTests(unittest.TestCase):
    def test_pack_reconstructs_exact_ingestion_boundary(self) -> None:
        report = build_report()
        self.assertEqual(report["result"], "PASS")
        self.assertEqual(report["source_passage_count"], 62)
        self.assertEqual(report["chapter_count"], 247)
        self.assertEqual(report["evidence_citation_count"], 4)
        self.assertFalse(report["source_payloads_copied"])

    def test_completion_denial_drift_fails_closed(self) -> None:
        pack = json.loads(PACK_PATH.read_text(encoding="utf-8"))
        changed = copy.deepcopy(pack)
        changed["denials"]["textual_recension_identified"] = True
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "changed.json"
            path.write_text(json.dumps(changed, ensure_ascii=False), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "completion denials drift"):
                load_and_validate_pack(path)


if __name__ == "__main__":
    unittest.main()

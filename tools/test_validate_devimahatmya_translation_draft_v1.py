from __future__ import annotations

import json
import subprocess
import sys
import unittest

from tools.validate_devimahatmya_translation_draft_v1 import DRAFT, validate


class DevimahatmyaTranslationDraftValidationTests(unittest.TestCase):
    def test_current_draft_is_an_exact_consistent_prefix(self) -> None:
        report = validate(DRAFT, require_complete=False)

        self.assertEqual(report["result"], "PASS")
        self.assertEqual(report["translated_rows_en"], report["translated_rows_hi"])
        self.assertEqual(
            report["translated_rows_en"],
            sum(report["chapter_counts"].values()),
        )
        self.assertEqual(
            report["translated_rows_en"] + report["remaining_rows_per_language"],
            report["required_rows_per_language"],
        )
        self.assertEqual(
            report["complete"],
            report["translated_rows_en"] == report["required_rows_per_language"],
        )
        self.assertFalse(report["publication_allowed"])

    def test_completion_gate_fails_closed_until_all_rows_exist(self) -> None:
        prefix_report = validate(DRAFT, require_complete=False)
        if prefix_report["complete"]:
            complete_report = validate(DRAFT, require_complete=True)
            self.assertTrue(complete_report["publication_allowed"])
        else:
            with self.assertRaisesRegex(ValueError, "Complete pack requires 588 rows"):
                validate(DRAFT, require_complete=True)

    def test_direct_script_invocation_matches_library_validation(self) -> None:
        completed = subprocess.run(
            [sys.executable, "-X", "utf8", str(__file__).replace("test_", "", 1)],
            cwd=DRAFT.parents[2],
            check=True,
            capture_output=True,
            text=True,
            encoding="utf-8",
        )
        direct_report = json.loads(completed.stdout)
        library_report = validate(DRAFT, require_complete=False)
        self.assertEqual(direct_report, library_report)


if __name__ == "__main__":
    unittest.main()

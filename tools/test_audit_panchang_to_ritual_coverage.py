import importlib.util
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MODULE_PATH = ROOT / "tools" / "audit_panchang_to_ritual_coverage.py"
SPEC = importlib.util.spec_from_file_location("panchang_ritual_audit", MODULE_PATH)
assert SPEC and SPEC.loader
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


class PanchangToRitualCoverageTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.audit = MODULE.build_audit()
        cls.covered = {
            row["slug"]: row
            for row in cls.audit["calendar_slugs_with_current_lane"]
        }
        cls.missing = {
            row["slug"]: row
            for row in cls.audit["calendar_slugs_without_current_lane"]
        }

    def test_known_complete_lanes_are_covered(self) -> None:
        for slug in (
            "aja-ekadashi",
            "mokshada-ekadashi",
            "pradosha-2026-12-shukla",
            "masika-durgashtami-2026-10",
            "sankashti-chaturthi-2026-11",
            "krishna-janmashtami-iskcon",
            "kanya-sankranti",
            "tula-sankranti",
            "vrishchika-sankranti",
            "dhanu-sankranti",
            "purnima-shraddha",
            "sarva-pitru-amavasya",
        ):
            self.assertEqual(
                self.covered[slug]["coverage_state"], "user_complete_lane", slug
            )

    def test_all_resolved_calendar_slugs_have_a_current_lane(self) -> None:
        self.assertEqual(self.missing, {})

    def test_no_active_unresolved_fixture_remains(self) -> None:
        unresolved_files = {
            Path(record["file"]).name
            for record in self.audit["unresolved_or_preflight_calendar_files"]
        }
        self.assertEqual(unresolved_files, set())
        self.assertEqual(self.covered["agastya-arghya-delhi"]["coverage_state"], "user_complete_lane")
        self.assertEqual(self.covered["hala-shashthi-hal-chhath"]["coverage_state"], "user_complete_lane")

    def test_superseded_preflights_are_retained_but_not_active_gaps(self) -> None:
        superseded = {
            Path(record["file"]).name: Path(record["superseded_by"]["file"]).name
            for record in self.audit["superseded_preflight_calendar_files"]
        }
        self.assertEqual(
            superseded,
            {
                "agastya-arghya-delhi-2026-v1.json": "agastya-arghya-delhi-2026-resolved-v1.json",
                "balarama-observance-identity-delhi-2026-v1.json": "hala-shashthi-delhi-2026-v1.json",
                "kali-chaudas-ahmedabad-baps-2026-preflight-v1.json": "kali-chaudas-ahmedabad-baps-2026-v1.json",
                "naraka-chaturdashi-mumbai-2026-preflight-v1.json": "naraka-chaturdashi-mumbai-2026-v1.json",
            },
        )

    def test_audit_has_no_unmapped_resolved_calendar_file(self) -> None:
        self.assertEqual(
            self.audit["resolved_calendar_files_without_normalized_slug"], []
        )

    def test_lists_are_unique_and_sorted(self) -> None:
        for key in (
            "calendar_slugs_with_current_lane",
            "calendar_slugs_without_current_lane",
            "ritual_slugs_without_calendar_record",
        ):
            slugs = [row["slug"] for row in self.audit[key]]
            self.assertEqual(slugs, sorted(set(slugs), key=str.casefold))


if __name__ == "__main__":
    unittest.main()

from __future__ import annotations

import hashlib
import json
import unittest
from pathlib import Path

from tools.qualify_ganguli_mahabharata_sources import (
    CONTRACT,
    DEFAULT_PLAN,
    DEFAULT_REPORT,
    canonical_json,
    compile_qualification,
)


ROOT = Path(__file__).resolve().parents[1]


class GanguliMahabharataSourceQualificationTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.plan = json.loads(DEFAULT_PLAN.read_text(encoding="utf-8"))
        cls.report, cls.units = compile_qualification(DEFAULT_PLAN)

    def test_exact_fixed_source_and_structural_denominator(self) -> None:
        self.assertEqual(CONTRACT, self.report["contract"])
        self.assertEqual(4, self.report["source_object_count"])
        self.assertEqual(15_262_892, self.report["source_object_bytes"])
        self.assertEqual(18, self.report["major_parva_count"])
        self.assertEqual(2107, self.report["source_relative_section_count"])
        self.assertFalse(self.report["harivamsha_included"])
        self.assertEqual(list(range(1, 19)), [row["parva_ordinal"] for row in self.report["parva_profiles"]])

    def test_every_retained_object_rehashes_and_roundtrips(self) -> None:
        for source in self.plan["source_objects"]:
            raw = (ROOT / "source_vault" / source["object_path"]).read_bytes()
            self.assertEqual(source["bytes"], len(raw))
            self.assertEqual(source["sha256"], hashlib.sha256(raw).hexdigest())
            self.assertEqual(raw, raw.decode("utf-8", errors="strict").encode("utf-8"))

    def test_all_source_units_rehash_and_losslessly_cover_each_volume_body(self) -> None:
        source_by_volume = {row["volume"]: row for row in self.plan["source_objects"]}
        for profile in self.report["source_profiles"]:
            source = source_by_volume[profile["volume"]]
            raw = (ROOT / "source_vault" / source["object_path"]).read_bytes()
            units = [row for row in self.units if row["volume"] == profile["volume"]]
            covered = b"".join(raw[row["byte_start"]:row["byte_end_exclusive"]] for row in units)
            body = raw[profile["body_byte_start"]:profile["body_byte_end_exclusive"]]
            self.assertEqual(body, covered)
            self.assertEqual(profile["body_sha256"], hashlib.sha256(body).hexdigest())
            self.assertTrue(profile["lossless_source_unit_coverage"])
            for unit in units:
                span = raw[unit["byte_start"]:unit["byte_end_exclusive"]]
                self.assertEqual(unit["span_sha256"], hashlib.sha256(span).hexdigest())

    def test_literal_numbering_defects_are_preserved(self) -> None:
        profiles = {row["parva_slug"]: row for row in self.report["parva_profiles"]}
        self.assertEqual([{"source_ordinal": 177, "from": 177, "to": 176}], profiles["adi"]["nonincreasing_transitions"])
        self.assertEqual([67], profiles["sabha"]["missing_literal_numbers"])
        self.assertEqual([54, 55, 189], profiles["drona"]["missing_literal_numbers"])
        self.assertEqual([34, 35, 364], profiles["santi"]["missing_literal_numbers"])
        self.assertEqual(2107, sum(row["section_count"] for row in profiles.values()))
        self.assertFalse(self.report["completion_denials"]["literal_section_numbering_gap_free_or_corrected"])

    def test_rights_and_completion_boundary_fail_closed(self) -> None:
        rights = self.report["rights_decision"]
        self.assertEqual("product_allowed_for_devam_synthesis_with_provider_framing_excluded", rights["lane"])
        self.assertTrue(rights["legal_characterization"].endswith("not_legal_advice"))
        self.assertTrue(all(value is False for value in self.report["completion_denials"].values()))
        self.assertTrue(all(value is False for value in self.report["mutation_boundary"].values()))

    def test_source_unit_root_and_report_are_deterministic(self) -> None:
        rebuilt, rebuilt_units = compile_qualification(DEFAULT_PLAN)
        self.assertEqual(self.report, rebuilt)
        self.assertEqual(self.units, rebuilt_units)
        expected_root = hashlib.sha256(b"\n".join(canonical_json(row) for row in self.units)).hexdigest()
        self.assertEqual(expected_root, self.report["source_unit_root_sha256"])
        self.assertEqual(self.report, json.loads(DEFAULT_REPORT.read_text(encoding="utf-8")))


if __name__ == "__main__":
    unittest.main()

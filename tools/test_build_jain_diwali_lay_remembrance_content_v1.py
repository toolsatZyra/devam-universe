import hashlib
import json
import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))

from build_jain_diwali_lay_remembrance_content_v1 import BASE, BASE_SHA256, LANE_ID, OUTPUT, build


class JainDiwaliLayRemembranceBuilderTests(unittest.TestCase):
    def test_frozen_base_and_generated_output_match(self) -> None:
        self.assertEqual(hashlib.sha256(BASE.read_bytes()).hexdigest(), BASE_SHA256)
        expected = json.dumps(build(), ensure_ascii=False, indent=2, sort_keys=True) + "\n"
        self.assertEqual(OUTPUT.read_text(encoding="utf-8"), expected)
        self.assertEqual(
            hashlib.sha256(OUTPUT.read_bytes()).hexdigest(),
            "1b7224350413e7a7cf5938dfeabe7d2a7f246ec2043a726bf1ea24404a4b14a9",
        )

    def test_lane_is_user_complete_only_at_the_named_lay_boundary(self) -> None:
        pack = build()
        self.assertEqual(pack["lane_id"], LANE_ID)
        self.assertEqual(pack["product_status"]["classification"], "user_complete_lane")
        self.assertTrue(all(pack["product_status"]["completed_dimensions"].values()))
        self.assertEqual(pack["product_status"]["open_gaps"], [])
        self.assertEqual(pack["observance_slugs"], ["jain-diwali-umbrella"])
        self.assertEqual(pack["applicability"]["context_pairs"], [{"region_code": "jain-india", "tradition_code": "jain-umbrella"}])
        self.assertEqual([item["language_code"] for item in pack["localized_content"]], ["en", "hi"])
        for localized in pack["localized_content"]:
            self.assertEqual([item["tier"] for item in localized["procedures"]], ["minimum", "standard", "elaborate"])
            boundary = " ".join(localized["safety_and_boundaries"])
            self.assertTrue("non-initiatory" in boundary or "गैर-दीक्षित" in boundary)

    def test_formal_practice_source_is_participant_context_not_a_universal_script(self) -> None:
        pack = build()
        source = next(item for item in pack["sources"] if item["source_id"] == "jaina-jcgp-community-puja-pattern")
        self.assertEqual(source["observed_fetch"]["response_sha256"], "60b315c230f86db7201796c5d3f816566acf76f02e00b94046f91a3b3b19f0a7")
        self.assertIn("never as a universal", source["source_role"])
        for localized in pack["localized_content"]:
            self.assertTrue(any(item["practice_id"] == "jaina-jcgp-described-community-sequence" for item in localized["typical_practices"]))
            self.assertTrue(any(item["separate_lane_required"] for item in localized["variants"]))


if __name__ == "__main__":
    unittest.main()

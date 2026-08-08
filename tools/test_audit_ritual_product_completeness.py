import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from audit_ritual_product_completeness import AuditError, audit


class RitualProductCompletenessAuditTests(unittest.TestCase):
    def test_current_repository_keeps_legacy_packs_unpromoted(self) -> None:
        result = audit()
        self.assertEqual(result["pack_count"], 86)
        self.assertFalse(result["legacy_user_completion_inferred"])
        self.assertEqual(result["migration_counts"].get("legacy_requires_explicit_classification", 0), 0)
        self.assertGreaterEqual(result["migration_counts"].get("current_contract", 0), 1)
        self.assertGreaterEqual(result["user_complete_lane_count"], 1)
        self.assertEqual(result["migration_counts"].get("current_contract"), 47)
        self.assertEqual(result["migration_counts"].get("legacy_superseded_by_current_contract"), 39)
        self.assertIsNone(result["migration_counts"].get("legacy_requires_explicit_classification"))
        self.assertEqual(result["classification_counts"].get("user_complete_lane"), 46)
        self.assertEqual(result["classification_counts"].get("participation_companion"), 1)

        mahashtami = next(
            record
            for record in result["records"]
            if record["pack_id"] == "bengal-mahashtami-community-participant-2026-v1"
        )
        self.assertEqual(mahashtami["classification"], "user_complete_lane")
        self.assertEqual(mahashtami["open_gaps"], [])
        self.assertTrue(all(mahashtami["completed_dimensions"].values()))

        jain_diwali = next(
            record
            for record in result["records"]
            if record["pack_id"] == "jain-diwali-umbrella-companion-content-v1"
        )
        self.assertEqual(jain_diwali["classification"], "participation_companion")
        self.assertFalse(jain_diwali["completed_dimensions"]["actionable_vidhi"])
        self.assertEqual(len(jain_diwali["open_gaps"]), 2)

        jain_lay_remembrance = next(
            record
            for record in result["records"]
            if record["pack_id"] == "jain-diwali-lay-remembrance-content-v1"
        )
        self.assertEqual(jain_lay_remembrance["classification"], "user_complete_lane")
        self.assertEqual(jain_lay_remembrance["open_gaps"], [])
        self.assertTrue(all(jain_lay_remembrance["completed_dimensions"].values()))

        superseded = {
            record["pack_id"]: record["superseded_by_lane_id"]
            for record in result["records"]
            if record["migration_status"] == "legacy_superseded_by_current_contract"
        }
        self.assertEqual(
            superseded,
            {
                "devam-bengal-durga-puja-participation-v1": "bengal-durga-puja-participant-content-v1",
                "devam-diwali-lakshmi-puja-west-india-v1": "diwali-lakshmi-puja-west-india-content-v1",
                "devam-ganesh-chaturthi-west-india-practice-v1": "ganesh-chaturthi-west-india-content-v1",
                "devam-shardiya-navaratri-north-west-india-practice-v1": "shardiya-navaratri-north-west-india-content-v1",
                "devam-vasu-baras-maharashtra-family-v1": "vasu-baras-maharashtra-family-content-v1",
                "devam-dhantrayodashi-north-west-india-v1": "dhantrayodashi-north-west-india-content-v1",
                "devam-yama-deepam-north-west-india-v1": "yama-deepam-north-west-india-content-v1",
                "devam-naraka-chaturdashi-maharashtra-household-v1": "naraka-chaturdashi-maharashtra-content-v1",
                "devam-tamil-deepavali-household-v1": "tamil-deepavali-household-content-v1",
                "devam-kali-chaudas-baps-gujarat-v1": "kali-chaudas-baps-gujarat-content-v1",
                "devam-bali-pratipada-maharashtra-family-v1": "bali-pratipada-maharashtra-content-v1",
                "devam-govardhana-puja-iskcon-participation-v1": "govardhana-puja-iskcon-content-v1",
                "devam-bhai-dooj-north-india-household-v1": "bhai-dooj-north-india-content-v1",
                "devam-bengal-kali-puja-participation-v1": "bengal-kali-puja-participant-content-v1",
                "devam-gujarati-new-year-baps-family-v1": "gujarati-new-year-baps-content-v1",
                "devam-balipadyami-karnataka-family-v1": "balipadyami-karnataka-content-v1",
                "devam-jain-diwali-umbrella-reflection-v1": "jain-diwali-umbrella-companion-content-v1",
                "devam-bandi-chhor-sgpc-participation-v1": "bandi-chhor-sgpc-participant-content-v1",
                "devam-ahoi-ashtami-north-india-family-v1": "ahoi-ashtami-north-india-household-content-v1",
                "devam-karwa-chauth-north-india-family-v1": "karwa-chauth-north-india-household-content-v1",
                "devam-chhath-bihar-purvanchal-v1": "chhath-bihar-purvanchal-participant-content-v1",
                "devam-dev-deepawali-varanasi-participation-v1": "dev-deepawali-varanasi-participant-content-v1",
                "devam-hartalika-teej-north-west-india-v1": "hartalika-teej-north-west-india-participant-content-v1",
                "devam-radha-ashtami-iskcon-participation-v1": "radha-ashtami-iskcon-participant-content-v1",
                "devam-gita-jayanti-reading-reflection-v1": "gita-jayanti-reading-reflection-content-v1",
                "devam-vivaha-panchami-north-india-v1": "vivaha-panchami-north-india-content-v1",
                "devam-ekadashi-recurring-devotional-practice-v1": "ekadashi-recurring-devotional-content-v1",
                "devam-krishna-janmashtami-smarta-iskcon-v1": "krishna-janmashtami-smarta-iskcon-content-v1",
                "devam-tulasi-vivah-participation-v1": "tulasi-vivah-general-baps-content-v1",
                "devam-weekday-practice-west-india-v1": "weekday-practice-west-india-content-v1",
                "devam-sankashti-chaturthi-west-india-family-v1": "sankashti-chaturthi-west-india-content-v1",
                "devam-masika-durgashtami-north-west-v1": "masika-durgashtami-north-west-content-v1",
                "devam-masika-shivaratri-north-west-india-v1": "masika-shivaratri-north-west-india-content-v1",
                "devam-pradosha-north-west-v1": "pradosha-north-west-content-v1",
                "devam-purnima-amavasya-north-west-india-v1": "purnima-amavasya-north-west-india-content-v1",
                "devam-ananta-chaturdashi-north-west-v1": "ananta-chaturdashi-north-west-content-v1",
                "devam-kalabhairava-jayanti-north-kashi-v1": "kalabhairava-jayanti-north-kashi-content-v1",
                "devam-kojagara-sharad-purnima-north-west-v1": "kojagara-sharad-purnima-north-west-content-v1",
                "devam-rishi-panchami-saptarishi-reflection-v1": "rishi-panchami-saptarishi-reflection-content-v1",
            },
        )

    def test_rejects_user_complete_claim_with_open_dimension(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            pack_dir = Path(temporary)
            dimensions = {
                "applicability": True,
                "timing": True,
                "significance": True,
                "origin_narratives": True,
                "typical_practice": True,
                "actionable_vidhi": False,
                "materials_and_substitutions": True,
                "variants": True,
                "evidence": True,
            }
            pack = {
                "contract": "DEVAM_RITUAL_OBSERVANCE_CONTENT_V1",
                "lane_id": "invalid-user-complete-lane",
                "product_status": {
                    "classification": "user_complete_lane",
                    "completed_dimensions": dimensions,
                    "open_gaps": ["vidhi"],
                },
            }
            (pack_dir / "invalid.json").write_text(json.dumps(pack), encoding="utf-8")
            with self.assertRaises(AuditError):
                audit(pack_dir)


if __name__ == "__main__":
    unittest.main()

import unittest

from tools.compile_source_catalog_search_index import compile_index


class SourceCatalogSearchIndexTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.index = compile_index()

    def test_exact_source_vault_census(self) -> None:
        self.assertEqual(self.index["sourceObjectCount"], 8455)
        self.assertEqual(self.index["sourceObjectBytes"], 5968838654)
        self.assertEqual(
            self.index["sourceSummarySha256"],
            "d19c50c87daac8e3be40e10b72556c8e58646c8bd74bda80ca0727d9dba55757",
        )
        self.assertEqual(len(self.index["records"]), 8455)
        self.assertEqual(len({row["sha256"] for row in self.index["records"]}), 8455)

    def test_index_contains_exact_devimahatmya_wikisource_sources(self) -> None:
        records = {row["sha256"]: row for row in self.index["records"]}
        expected = {
            "c7fe701aedeedffde57a51b21aa4f8fec697a7922939fb59ffa985e22cc9b7ae": (
                "devimahatmya-wikisource-chapters-081-085-rev-410281.wikitext",
                84_828,
            ),
            "4459b0ca01f9a4173f1a137bf7c64908afbf326565b0b3f2dd2d2f5f830850fe": (
                "devimahatmya-wikisource-chapters-086-090-rev-363171.wikitext",
                45_604,
            ),
            "446fb91efc40b94d7b59aa1d5b3116dd665b79ec68044985a8953483c8721814": (
                "devimahatmya-wikisource-chapters-091-093-rev-363170.wikitext",
                30_643,
            ),
        }
        self.assertEqual(
            {sha256: (records[sha256]["title"], records[sha256]["bytes"]) for sha256 in expected},
            expected,
        )
        self.assertTrue(all(records[sha256]["roles"] == ["canonical_acquisition"] for sha256 in expected))

    def test_index_contains_major_preserved_sources(self) -> None:
        search = " ".join(row["searchText"] for row in self.index["records"])
        self.assertIn("mahabharata", search)
        self.assertIn("ramayana manmatha nath dutt", search)
        self.assertIn("devibhagavatam", search)

    def test_index_contains_latest_ganesha_and_mudgala_sources_without_promoting_them(self) -> None:
        records = {row["sha256"]: row for row in self.index["records"]}
        expected = {
            "01d8aec05025957650898443b3182bc271e84a490e2f41b526165260e26026b8": (
                "ganesha-purana-wikisource-site-rights.json",
                164,
            ),
            "0cf4723a2f49f5a431b03b0577b48cd1b8bbaee4355d8811a3d48e5509c1a1b3": (
                "ganesha-purana-wikisource-revisions-batch-2.json",
                891270,
            ),
            "14aab00040e20c533ce5fdd769d58fd4ebfec62dfd67729a569bb29124a23233": (
                "ganesha-purana-wikisource-revisions-batch-1.json",
                2100027,
            ),
            "aa6972405a88b34fa8db38dc07793424656961527149c36e80c0e100965245a5": (
                "Ganesha_Purana_Nag_Publishers_reprint_1993.pdf",
                46157686,
            ),
            "678edb439abdc43fa3db1148296d4b4f984cfd30cf750982465d16fdf97af8cc": (
                "Mudgala-Puranam-MV-Mahasabde-1976-NSP.pdf",
                63438893,
            ),
        }
        self.assertEqual(
            {sha256: (records[sha256]["title"], records[sha256]["bytes"]) for sha256 in expected},
            expected,
        )
        for sha256 in expected:
            self.assertEqual(
                set(records[sha256]),
                {"sha256", "title", "bytes", "aliases", "roles", "suffixes", "provenanceCount", "searchText"},
            )
        self.assertIn("not a verified passage", self.index["boundary"])
        self.assertIn("rights clearance", self.index["boundary"])

    def test_index_exposes_no_source_paths_or_product_claim(self) -> None:
        self.assertTrue(all("source_path" not in row and "object_path" not in row for row in self.index["records"]))
        self.assertIn("not a verified passage", self.index["boundary"])

    def test_ramcharitmanas_scan_is_discoverable_without_text_promotion(self) -> None:
        records = {row["sha256"]: row for row in self.index["records"]}
        row = records["6d570d531ebada1912f6e930212393fec2200765a0b731b73b8e7135ea0f70f2"]
        self.assertEqual(row["title"], "Ramcharitmanas-Belvedere-Press-Prayag-1925.pdf")
        self.assertEqual(row["bytes"], 78_560_265)
        self.assertEqual(row["roles"], ["canonical_acquisition"])
        self.assertEqual(row["provenanceCount"], 1)
        self.assertIn("ramcharitmanas", row["searchText"])
        self.assertEqual(
            set(row),
            {"sha256", "title", "bytes", "aliases", "roles", "suffixes", "provenanceCount", "searchText"},
        )
        ocr_objects = {
            "61bb7c6f225c2ee08bbf0f848c575477413d3da71166db4d1b239090cccc5555": 5_931_293,
            "4dba066cfbe3677601fa07c81c08de4fe1f99051c201cee3d45d097af93686b6": 39_359_478,
            "af51472d489fdb3a5b3425613284f574bcd8bd5e38a5567f9e11277433f92ac5": 179_002,
            "b2c78f405bc4109e5b9d76841d6b587c4a2f42dc05955c4fbbe934475a5d93f1": 372_368,
        }
        self.assertEqual({digest: records[digest]["bytes"] for digest in ocr_objects}, ocr_objects)
        self.assertTrue(all(records[digest]["roles"] == ["canonical_acquisition"] for digest in ocr_objects))
        self.assertIn("not a verified passage", self.index["boundary"])


if __name__ == "__main__":
    unittest.main()

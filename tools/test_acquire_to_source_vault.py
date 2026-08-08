from __future__ import annotations

import copy
import unittest

from tools.acquire_to_source_vault import CONTRACT, validate_plan


BASE = {
    "contract": CONTRACT,
    "acquisition_id": "binary-source-test",
    "files": [
        {
            "name": "source.djvu",
            "source_path": "acquisitions/provider/date/work/source.djvu",
            "role": "canonical_acquisition",
            "strict_utf8": False,
            "url": "https://example.test/source.djvu",
            "final_url": "https://example.test/source.djvu",
            "sha256": "a" * 64,
        }
    ],
}


class AcquisitionPlanValidationTest(unittest.TestCase):
    def test_explicit_binary_and_utf8_boundaries_are_valid(self) -> None:
        validate_plan(BASE)
        text_plan = copy.deepcopy(BASE)
        text_plan["files"][0]["strict_utf8"] = True
        validate_plan(text_plan)

    def test_missing_or_nonboolean_encoding_boundary_fails(self) -> None:
        for value in (None, "false", 0):
            plan = copy.deepcopy(BASE)
            if value is None:
                del plan["files"][0]["strict_utf8"]
            else:
                plan["files"][0]["strict_utf8"] = value
            with self.assertRaises(ValueError):
                validate_plan(plan)

    def test_unsafe_path_or_non_https_url_fails(self) -> None:
        traversal = copy.deepcopy(BASE)
        traversal["files"][0]["source_path"] = "../source.djvu"
        with self.assertRaises(ValueError):
            validate_plan(traversal)
        insecure = copy.deepcopy(BASE)
        insecure["files"][0]["url"] = "http://example.test/source.djvu"
        with self.assertRaises(ValueError):
            validate_plan(insecure)

    def test_final_url_allowlist_must_be_https_and_include_primary(self) -> None:
        valid = copy.deepcopy(BASE)
        valid["files"][0]["allowed_final_urls"] = [
            "https://example.test/source.djvu",
            "https://mirror.example.test/source.djvu",
        ]
        validate_plan(valid)
        for values in ([], ["https://mirror.example.test/source.djvu"], ["https://example.test/source.djvu", "http://mirror.example.test/source.djvu"]):
            plan = copy.deepcopy(BASE)
            plan["files"][0]["allowed_final_urls"] = values
            with self.assertRaises(ValueError):
                validate_plan(plan)

    def test_provider_fixities_can_bootstrap_sha256_in_one_download(self) -> None:
        plan = copy.deepcopy(BASE)
        del plan["files"][0]["sha256"]
        plan["files"][0]["provider_sha1"] = "b" * 40
        validate_plan(plan)
        md5_only = copy.deepcopy(plan)
        del md5_only["files"][0]["provider_sha1"]
        md5_only["files"][0]["provider_md5"] = "c" * 32
        validate_plan(md5_only)
        missing = copy.deepcopy(plan)
        del missing["files"][0]["provider_sha1"]
        with self.assertRaises(ValueError):
            validate_plan(missing)
        malformed = copy.deepcopy(plan)
        malformed["files"][0]["provider_sha1"] = "not-a-sha1"
        with self.assertRaises(ValueError):
            validate_plan(malformed)

    def test_request_interval_is_bounded(self) -> None:
        valid = copy.deepcopy(BASE)
        valid["request_interval_seconds"] = 12
        validate_plan(valid)
        for value in (-1, 61, True, "12"):
            invalid = copy.deepcopy(BASE)
            invalid["request_interval_seconds"] = value
            with self.assertRaises(ValueError):
                validate_plan(invalid)


if __name__ == "__main__":
    unittest.main()

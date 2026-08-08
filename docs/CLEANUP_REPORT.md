# Cleanup report — 2026-08-06

## Outcome

The restored legacy implementation was intentionally retired to remove extreme storage and process amplification. The cleanup preserved unique source/library bytes, provider catalogs, rights-relevant provenance, selected substantive research, and 6,545 discovery leads. It removed old outputs, temporary caches, duplicate acquisitions, readers, generated databases/indexes, clean rebuilds, rejected lineages, status histories, release proofs, old scripts/tests/services, and superseded handoffs.

## Preserved source boundary

- contract: `DEVAM_LEAN_SOURCE_VAULT_V1`
- unique objects: 8,413
- unique object bytes: 5,474,837,938
- former-path provenance records: 12,425
- source leads: 6,545
- objects manifest SHA-256: `31de34bad1c96ec618d8e27895d1b2abedabf1b7a7873548d4cc2ef99c71c0d2`
- provenance map SHA-256: `2fc7ee63600b3c560fe5c25e8aed79cfa02dd59552595e83cf5cf4fff292bbb5`
- summary SHA-256 at first independent verification: `e8bd513b5993a3c94ab4638abc15f72d8e90925fb93ac34726ab6864c0a43799`

The provenance map retains former paths for traceability only. It does not preserve or reactivate old status/acceptance claims.

## Removed high-volume trees

Before cleanup, `outputs` contained about 184.5 GB across 439,556 files and `tmp` about 10.17 GB across 109,386 files. The old `acquisitions` tree was 2.31 GB. All were removed only after the source vault was built and independently rehashed.

The deletion is not recoverable from this workspace. Recovery is from the content-addressed source vault and its catalogs.

## Final verification

After deletion, `python tools/lean_cleanup.py verify` independently rehashed all 8,413 objects and all retained catalogs and returned `PASS`. The vault contains no symlink, junction, reparse point, or multi-link file. The final repository has 8,444 files: 8,439 in `source_vault`, four concise documents, and one cleanup/verification utility, plus the two root Markdown files. Total retained vault footprint including catalogs/manifests is 5,490,974,296 bytes.

The cleanup increased free disk space by 182,118,576,128 bytes (about 169.6 GiB). No external service, source provider, or paid storage was mutated.

## Post-cleanup append-only acquisitions

The figures above remain the cleanup baseline. On 2026-08-06 the first new-source acquisition added the current Ambuda DCS Ramayana data and its source/license README as two unique content-addressed objects. A full vault verification passed immediately before and after the addition.

- current unique objects: 8,415;
- current object bytes: 5,482,252,883;
- current provenance records: 12,427;
- current objects manifest SHA-256: `1768ede5e703537174b856b47f76dc6f08af3bbaf9ca0e68dbb04e29a5cb83dd`;
- current provenance map SHA-256: `cb51aef3d66378954dc30beba9481355d3e6311ade790d817f44d128a32a9365`; and
- current summary SHA-256: `c378809b843e83599008d5e4ba01ae1ae1e4bfdd53b47a272aef7c5b1f5ac365`.

The acquisition used `tools/acquire_to_source_vault.py` and did not duplicate either payload in application code or Supabase. Packet compilers now treat their recorded global-vault values as historical baselines while requiring the current vault to remain intact and append-only; exact packet sources are still rehashed individually.

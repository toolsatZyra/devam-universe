# Source vault

This is the retained local source baseline after the 2026-08-06 cleanup.

- `objects/sha256/`: one file per unique source/content hash.
- `objects.jsonl`: object inventory.
- `provenance-map.jsonl`: former path, role, filename, size, and hash for every selected source path.
- `catalogs/source-leads.csv`: lean 6,545-row discovery catalog; legacy IDs are traceability aids, not workflow authority.
- `catalogs/providers/`: curated provider/source catalogs worth carrying forward.
- `summary.json`: counts, boundaries, and manifest fixities.

Run `python tools/lean_cleanup.py verify` before migration or destructive maintenance.

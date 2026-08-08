from __future__ import annotations

import argparse
import base64
import json
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from tools.compile_source_bounded_knowledge_pack import load_pack
from tools.compile_source_vault_tei_ingestion import (
    ROOT,
    TEI_NS,
    compile_packet,
    read_verified_object,
    sha256_bytes,
    sql_quote,
)


PLAN = ROOT / "ingestion" / "plans" / "ganesha-shriganapatimantraksharavali-v1.json"
PACK = ROOT / "knowledge_packs" / "ganesha" / "shriganapatimantraksharavali-v1.json"
SOURCE_SHA256 = "21e5909392249ecca6677410c30d70323402d886975df807df2b865697fd9e6d"
OLD_TEXT_STATUS = "tei_extracted_unreviewed"
NEW_TEXT_STATUS = "tei_text_note_anchors_excluded_unverified_against_print"
OLD_PACK_SHA256 = "8449539fd96f4ce545a3d3c52ba875d8a19c27d3d1e2135314bf994846d37a3d"
PUBLISHED_ORDINALS = {1, 12, 29, 31, 32}


def encoded_text_sql(value: str) -> str:
    encoded = base64.b64encode(value.encode("utf-8")).decode("ascii")
    return f"convert_from(decode({sql_quote(encoded)}, 'base64'), 'UTF8')"


def legacy_passages(tei_bytes: bytes) -> dict[int, str]:
    root = ET.fromstring(tei_bytes)
    elements = root.findall(".//tei:lg", TEI_NS)
    if [element.get("n") for element in elements] != [str(value) for value in range(1, 33)]:
        raise ValueError("Legacy TEI marker universe drifted")
    return {
        ordinal: "\n".join(
            "".join(line.itertext()).strip()
            for line in element.findall("tei:l", TEI_NS)
        )
        for ordinal, element in enumerate(elements, start=1)
    }


def content_root(rows: dict[int, str]) -> str:
    return sha256_bytes(
        "\n".join(f"{ordinal}\t{sha256_bytes(text.encode('utf-8'))}" for ordinal, text in sorted(rows.items())).encode("utf-8")
    )


def compile_correction() -> tuple[str, dict[str, object]]:
    packet = compile_packet(PLAN)
    if packet["packet_sha256"] != "11a92e0c6421adc8a73104d4e8c2c22b86e28b02f24e0dc5888e8df8f8f2e97c":
        raise ValueError("Corrected source packet drifted")
    if packet["structure"]["text_status"] != NEW_TEXT_STATUS:
        raise ValueError("Corrected text status drifted")
    canonical = next(item for item in packet["source_objects"] if item["role"] == "canonical_tei")
    if canonical["sha256"] != SOURCE_SHA256:
        raise ValueError("Canonical TEI source drifted")
    tei_bytes = read_verified_object(canonical)
    old = legacy_passages(tei_bytes)
    new = {row["source_ordinal"]: row["exact_text"] for row in packet["passages"]}
    span_hashes = {row["source_ordinal"]: row["span_sha256"] for row in packet["passages"]}
    if set(old) != set(range(1, 33)) or set(new) != set(old):
        raise ValueError("Passage universe is not exactly 1..32")
    if any(any(character.isascii() and character.isdigit() for character in text) for text in new.values()):
        raise ValueError("Editorial ASCII note-anchor label survived corrected projection")
    changed = [ordinal for ordinal in old if old[ordinal] != new[ordinal]]
    if changed != [5, 6, 9, 10, 15, 17, 18, 20, 21, 22, 23, 24, 25, 27, 30, 32]:
        raise ValueError(f"Unexpected corrected ordinal set: {changed}")

    pack = load_pack(PACK)
    new_pack_sha256 = pack["pack_sha256"]
    values = []
    for ordinal in range(1, 33):
        state = "published" if ordinal in PUBLISHED_ORDINALS else "review"
        values.append(
            f"({ordinal}, {encoded_text_sql(old[ordinal])}, {encoded_text_sql(new[ordinal])}, "
            f"{sql_quote(span_hashes[ordinal])}, {sql_quote(state)}::public.publication_state)"
        )

    sql = f"""-- Correct a derived-text extraction defect without changing the immutable TEI.
-- Embedded <ref type=\"noteAnchor\"> labels are editorial callouts, not source text.
-- Raw TEI byte spans, span hashes, rights, review/publication states, and the
-- unresolved print-edition reconciliation boundary remain unchanged.

begin;

create temporary table devam_ganesha_tei_text_correction (
  source_ordinal bigint primary key,
  expected_old_text text not null,
  corrected_text text not null,
  span_sha256 text not null,
  expected_state public.publication_state not null
) on commit drop;

insert into devam_ganesha_tei_text_correction
  (source_ordinal, expected_old_text, corrected_text, span_sha256, expected_state)
values
  {',\n  '.join(values)};

do $$
begin
  if (select count(*) from devam_ganesha_tei_text_correction) <> 32 then
    raise exception 'Correction inventory is not exactly 32 rows';
  end if;
  if exists (
    select 1
    from devam_ganesha_tei_text_correction c
    left join public.source_objects s on s.sha256 = {sql_quote(SOURCE_SHA256)}
    left join public.passages p
      on p.source_object_id = s.id and p.source_ordinal = c.source_ordinal
    where p.id is null
      or p.exact_text is distinct from c.expected_old_text
      or p.text_status <> {sql_quote(OLD_TEXT_STATUS)}
      or p.span_sha256 <> c.span_sha256
      or p.rights_lane <> 'derivative_allowed'
      or p.publication_state <> c.expected_state
  ) then
    raise exception 'Hosted Ganesha TEI passage state drifted before correction';
  end if;
  if (select count(*) from public.source_objects where sha256 = {sql_quote(SOURCE_SHA256)} and completeness_status = 'observed_32_units_structure_authority_unresolved') <> 1 then
    raise exception 'Source identity or unresolved completeness boundary drifted';
  end if;
  if (select count(*) from public.claim_evidence where note::jsonb ->> 'pack_id' = 'ganesha-shriganapatimantraksharavali-v1' and note::jsonb ->> 'pack_sha256' = {sql_quote(OLD_PACK_SHA256)}) <> 10 then
    raise exception 'Prior knowledge-pack evidence identity drifted';
  end if;
end
$$;

update public.passages p
set exact_text = c.corrected_text,
    text_status = {sql_quote(NEW_TEXT_STATUS)}
from public.source_objects s, devam_ganesha_tei_text_correction c
where s.sha256 = {sql_quote(SOURCE_SHA256)}
  and p.source_object_id = s.id
  and p.source_ordinal = c.source_ordinal;

update public.claim_evidence
set note = (note::jsonb || jsonb_build_object('pack_sha256', {sql_quote(new_pack_sha256)}))::text
where note::jsonb ->> 'pack_id' = 'ganesha-shriganapatimantraksharavali-v1'
  and note::jsonb ->> 'pack_sha256' = {sql_quote(OLD_PACK_SHA256)};

do $$
begin
  if exists (
    select 1
    from devam_ganesha_tei_text_correction c
    join public.source_objects s on s.sha256 = {sql_quote(SOURCE_SHA256)}
    join public.passages p on p.source_object_id = s.id and p.source_ordinal = c.source_ordinal
    where p.exact_text is distinct from c.corrected_text
      or p.text_status <> {sql_quote(NEW_TEXT_STATUS)}
      or p.span_sha256 <> c.span_sha256
      or p.publication_state <> c.expected_state
      or p.exact_text ~ '[0-9]'
  ) then
    raise exception 'Corrected Ganesha TEI projection failed postcondition';
  end if;
  if (select count(*) from public.claim_evidence where note::jsonb ->> 'pack_id' = 'ganesha-shriganapatimantraksharavali-v1' and note::jsonb ->> 'pack_sha256' = {sql_quote(new_pack_sha256)}) <> 10 then
    raise exception 'Corrected knowledge-pack evidence identity failed postcondition';
  end if;
end
$$;

commit;
"""
    report: dict[str, object] = {
        "result": "PASS",
        "source_sha256": SOURCE_SHA256,
        "passage_count": len(new),
        "changed_ordinals": changed,
        "published_ordinals_preserved": sorted(PUBLISHED_ORDINALS),
        "old_content_root_sha256": content_root(old),
        "corrected_content_root_sha256": content_root(new),
        "corrected_ingestion_packet_sha256": packet["packet_sha256"],
        "corrected_knowledge_pack_sha256": new_pack_sha256,
        "sql_sha256": sha256_bytes(sql.encode("utf-8")),
        "source_payload_mutated": False,
        "completion_claim_changed": False,
    }
    return sql, report


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--format", choices=("report", "sql"), default="report")
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    sql, report = compile_correction()
    if args.output:
        output = args.output.resolve()
        migrations = (ROOT / "supabase" / "migrations").resolve()
        if not output.parent == migrations or output.suffix != ".sql":
            raise ValueError("Output must be a direct SQL child of supabase/migrations")
        with output.open("x", encoding="utf-8", newline="\n") as handle:
            handle.write(sql)
    print(sql if args.format == "sql" else json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

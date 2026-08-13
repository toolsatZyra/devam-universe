"""Compile a payload-free source-term reconciliation for the selected Dutt Ramayana."""

from __future__ import annotations

import argparse
import collections
import hashlib
import json
import re
import sys
import unicodedata
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))

from compile_dutt_project_gutenberg_ramayana_ingestion import compile_packet  # noqa: E402


PLAN = ROOT / "ingestion/plans/ramayana-manmatha-nath-dutt-project-gutenberg-product-v1.json"
REPORT = ROOT / "ingestion/reports/ramayana-manmatha-nath-dutt-project-gutenberg-product-v1.json"
STORY_INVENTORY = ROOT / "knowledge_packs/inventories/ramayana-story-universe-v1.json"
OUTPUT = ROOT / "knowledge_packs/inventories/ramayana-source-term-reconciliation-v1.json"

WORD = re.compile(r"\b([A-Z][A-Za-z'’\-]{2,})\b")
OBVIOUS_NON_NAMES = {
    "A", "All", "An", "And", "As", "At", "Behold", "But", "By", "For", "From",
    "Having", "He", "Her", "Here", "Him", "His", "I", "If", "In", "It", "Its",
    "Let", "May", "No", "Nor", "Not", "Now", "Of", "Oh", "On", "One", "Or", "Our",
    "Said", "She", "So", "That", "The", "Their", "Them", "Then", "There", "These",
    "They", "This", "Those", "Thou", "Thus", "To", "Two", "Unto", "We", "What",
    "When", "Where", "While", "Who", "Whom", "Whose", "Why", "With", "Yet", "You",
}

# Only aliases that are stable enough to merge without reading local context belong here.
# Context-sensitive epithets such as Raghava remain in the review queue.
CURATED_ALIASES = {
    "dacaratha": ("entity", "king-dasharatha", "Dutt transliteration of Dasharatha"),
    "kaucalya": ("entity", "kausalya", "Dutt transliteration of Kausalya"),
    "vicwamitra": ("entity", "vishvamitra", "Dutt transliteration of Vishvamitra"),
    "viswamitra": ("entity", "vishvamitra", "Dutt transliteration of Vishvamitra"),
    "bibhishana": ("entity", "vibhishana", "Dutt transliteration of Vibhishana"),
    "bibhisana": ("entity", "vibhishana", "Dutt transliteration of Vibhishana"),
    "satrughna": ("entity", "shatrughna", "Dutt transliteration of Shatrughna"),
    "vaidehi": ("entity", "sita", "Stable Sita epithet: princess of Videha"),
    "maithili": ("entity", "sita", "Stable Sita epithet: woman of Mithila"),
    "maithilee": ("entity", "sita", "Stable Sita epithet: woman of Mithila"),
    "janaki": ("entity", "sita", "Stable Sita epithet: daughter of Janaka"),
    "saumitri": ("entity", "lakshmana", "Stable Lakshmana epithet: son of Sumitra"),
    "sakra": ("entity", "indra", "Stable Indra epithet"),
    "purandara": ("entity", "indra", "Stable Indra epithet"),
    "vasava": ("entity", "indra", "Stable Indra epithet"),
    "kuvera": ("entity", "kubera", "Dutt transliteration of Kubera"),
    "vaicravana": ("entity", "kubera", "Dutt transliteration of Vaishravana/Kubera"),
    "vaisravana": ("entity", "kubera", "Dutt transliteration of Vaishravana/Kubera"),
    "siva": ("entity", "shiva", "Dutt transliteration of Shiva"),
    "sankara": ("entity", "shiva", "Stable Shiva epithet"),
    "mahadeva": ("entity", "shiva", "Stable Shiva epithet"),
    "rhishyasringa": ("entity", "rishyasringa", "Dutt spelling of Rishyasringa"),
    "yatayu": ("entity", "jatayu", "Dutt spelling variant of Jatayu"),
    "kailaca": ("place", "Kailasa", "Dutt transliteration of Kailasa"),
    "chitrakuta": ("place", "Chitrakoot", "Dutt transliteration of Chitrakoot"),
    "kocala": ("place", "Kosala", "Dutt transliteration of Kosala"),
    "godaveri": ("place", "Godavari", "Dutt spelling variant of Godavari"),
    "saraju": ("place", "Sarayu", "Dutt spelling variant of Sarayu"),
    "acoka": ("place", "Ashoka grove", "Dutt transliteration of Ashoka"),
}

ARC_TO_KANDA = {
    "beginnings": "bala",
    "exile": "ayodhya",
    "forest": "aranya",
    "alliance": "kishkindha",
    "leap": "sundara",
    "war": "yuddha",
    "aftermath": "uttara",
}


def normalized(value: str) -> str:
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    value = re.sub(r"(?:'|’)s$", "", value.casefold())
    return re.sub(r"[^a-z]", "", value)


def authored_lexemes(story: dict) -> dict[str, list[dict[str, str]]]:
    index: dict[str, list[dict[str, str]]] = collections.defaultdict(list)
    for row in story["selected_narrative"]["authored_story_entities"]:
        entity_id = row["entity_id"]
        parts = re.findall(r"[a-z]+", unicodedata.normalize("NFKD", entity_id).encode("ascii", "ignore").decode("ascii").casefold())
        for form in {*parts, "".join(parts)}:
            if len(form) >= 3:
                index[form].append({"kind": "entity", "canonical_id": entity_id, "whole_id_match": form == normalized(entity_id)})
    for row in story["selected_narrative"]["narrative_places"]:
        label = row["place_label"]
        parts = re.findall(r"[a-z]+", unicodedata.normalize("NFKD", label).encode("ascii", "ignore").decode("ascii").casefold())
        for form in {*parts, "".join(parts)}:
            if len(form) >= 3:
                index[form].append({"kind": "place", "canonical_id": label, "whole_id_match": form == normalized(label)})
    return index


def compile_reconciliation() -> dict:
    source_report = json.loads(REPORT.read_text(encoding="utf-8"))
    story = json.loads(STORY_INVENTORY.read_text(encoding="utf-8"))
    packet = compile_packet(PLAN)
    index = authored_lexemes(story)
    episodes_by_source_address: dict[str, list[dict]] = collections.defaultdict(list)
    for episode in story["selected_narrative"]["episodes"]:
        source = episode["source"]
        kanda_slug = ARC_TO_KANDA[episode["arc_id"]]
        for ordinal in range(source["sourceOrdinal"], source["sourceEndOrdinal"] + 1):
            episodes_by_source_address[f"{kanda_slug}:{ordinal}"].append(episode)
    expected_addresses = {f"{passage['locator']['kanda_slug']}:{passage['locator']['kanda_source_ordinal']}" for passage in packet["passages"]}
    if set(episodes_by_source_address) != expected_addresses:
        raise ValueError("Authored episode/source-unit partition differs from the exact 652-unit source denominator")
    mentions: dict[str, dict] = {}
    for passage in packet["passages"]:
        locator = passage["locator"]
        unit_key = f"{locator['kanda_slug']}:{locator['kanda_source_ordinal']}"
        source_address_key = unit_key
        seen_in_unit: set[str] = set()
        for match in WORD.finditer(passage["exact_text"]):
            surface = match.group(1).strip("'’-")
            if surface in OBVIOUS_NON_NAMES or surface.isupper():
                continue
            key = normalized(surface)
            if len(key) < 3:
                continue
            row = mentions.setdefault(key, {"normalized_term": key, "surface_forms": collections.Counter(), "occurrence_count": 0, "source_unit_keys": set(), "source_address_keys": set()})
            row["surface_forms"][surface] += 1
            row["occurrence_count"] += 1
            if key not in seen_in_unit:
                row["source_unit_keys"].add(unit_key)
                row["source_address_keys"].add(source_address_key)
                seen_in_unit.add(key)

    records = []
    for key, row in mentions.items():
        exact_matches = index.get(key, [])
        alias = CURATED_ALIASES.get(key)
        if alias:
            kind, canonical_id, note = alias
            state = "curated_alias_matched"
            matches = [{"kind": kind, "canonical_id": canonical_id}]
            resolution_note = note
        elif len([match for match in exact_matches if match["whole_id_match"]]) == 1:
            state = "exact_authored_lexeme_matched"
            matches = [next(match for match in exact_matches if match["whole_id_match"])]
            resolution_note = "Exact whole canonical identifier or place-label match in authored metadata."
        else:
            state = "source_term_review_needed"
            matches = exact_matches
            resolution_note = "Needs contextual classification as a character, deity, group, place, title, epithet, ordinary capitalized word, or source spelling variant."
        missing_metadata_addresses = []
        covering_episode_ids = set()
        matches_for_coverage = matches if state != "source_term_review_needed" else []
        if matches_for_coverage:
            for address in row["source_address_keys"]:
                episodes = episodes_by_source_address[address]
                covering_episode_ids.update(episode["episode_id"] for episode in episodes)
                if not any(any(
                    (match["kind"] == "entity" and match["canonical_id"] in episode["entity_ids"])
                    or (match["kind"] == "place" and match["canonical_id"] in episode["narrative_places"])
                    for match in matches_for_coverage
                ) for episode in episodes):
                    missing_metadata_addresses.append(address)
            metadata_coverage_state = "covered_in_all_mentioned_source_units" if not missing_metadata_addresses else "canonical_match_missing_from_some_covering_episodes"
        else:
            metadata_coverage_state = "awaiting_term_resolution"
        records.append({
            "normalized_term": key,
            "surface_forms": [{"form": form, "count": count} for form, count in row["surface_forms"].most_common()],
            "occurrence_count": row["occurrence_count"],
            "source_unit_count": len(row["source_unit_keys"]),
            "source_unit_keys": sorted(row["source_unit_keys"]),
            "covering_episode_ids": sorted(covering_episode_ids),
            "reconciliation_state": state,
            "canonical_matches": [{key: value for key, value in match.items() if key != "whole_id_match"} for match in matches],
            "resolution_note": resolution_note,
            "authored_metadata_coverage_state": metadata_coverage_state,
            "missing_authored_metadata_source_address_keys": sorted(missing_metadata_addresses),
        })
    records.sort(key=lambda item: (-item["occurrence_count"], item["normalized_term"]))
    state_counts = collections.Counter(row["reconciliation_state"] for row in records)
    coverage_counts = collections.Counter(row["authored_metadata_coverage_state"] for row in records)
    resolved_records = [
        {
            "normalized_term": row["normalized_term"],
            "surface_forms": row["surface_forms"],
            "occurrence_count": row["occurrence_count"],
            "source_unit_count": row["source_unit_count"],
            "reconciliation_state": row["reconciliation_state"],
            "canonical_matches": row["canonical_matches"],
            "resolution_note": row["resolution_note"],
            "authored_metadata_coverage_state": row["authored_metadata_coverage_state"],
            "missing_authored_metadata_source_address_keys": row["missing_authored_metadata_source_address_keys"],
        }
        for row in records
        if row["reconciliation_state"] != "source_term_review_needed"
    ]
    unresolved_frequency_sample = [
        {
            "normalized_term": row["normalized_term"],
            "surface_forms": row["surface_forms"],
            "occurrence_count": row["occurrence_count"],
            "source_unit_count": row["source_unit_count"],
        }
        for row in records
        if row["reconciliation_state"] == "source_term_review_needed"
    ][:50]
    return {
        "contract": "DEVAM_RAMAYANA_SOURCE_TERM_RECONCILIATION_V1",
        "version": 1,
        "generated_at": "2026-08-13",
        "source_expression": {
            "plan_sha256": hashlib.sha256(PLAN.read_bytes()).hexdigest(),
            "packet_sha256": packet["packet_sha256"],
            "passage_content_root_sha256": source_report["passage_content_root_sha256"],
            "source_unit_count": len(packet["passages"]),
        },
        "boundary": "This payload-free lexical inventory is a supplementary diagnostic, not automatic named-entity truth or a consumer-story completion denominator. It retains detailed coordinates only for conservative resolved matches and a compact frequency sample of unresolved noise; it copies no Dutt source prose.",
        "candidate_rule": "Every non-all-caps Latin token of three or more letters beginning with a capital in the exact 652-unit source body, excluding a minimal closed grammar stoplist.",
        "counters": {
            "candidate_terms": len(records),
            "candidate_occurrences": sum(row["occurrence_count"] for row in records),
            "exact_authored_lexeme_matched": state_counts["exact_authored_lexeme_matched"],
            "curated_alias_matched": state_counts["curated_alias_matched"],
            "source_term_review_needed": state_counts["source_term_review_needed"],
            "resolved_terms_covered_in_all_mentioned_source_units": coverage_counts["covered_in_all_mentioned_source_units"],
            "resolved_terms_missing_from_some_covering_episodes": coverage_counts["canonical_match_missing_from_some_covering_episodes"],
        },
        "completion_state": "supplementary_nonblocking_diagnostic",
        "resolved_records": resolved_records,
        "unresolved_frequency_sample": unresolved_frequency_sample,
        "source_payloads_copied": False,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    output = json.dumps(compile_reconciliation(), ensure_ascii=False, separators=(",", ":"), sort_keys=True) + "\n"
    if args.check:
        if not OUTPUT.exists() or OUTPUT.read_text(encoding="utf-8") != output:
            raise SystemExit("Ramayana source-term reconciliation is stale; run the compiler")
        print("Ramayana source-term reconciliation is current")
        return
    OUTPUT.write_text(output, encoding="utf-8", newline="\n")
    print(OUTPUT.relative_to(ROOT))


if __name__ == "__main__":
    main()

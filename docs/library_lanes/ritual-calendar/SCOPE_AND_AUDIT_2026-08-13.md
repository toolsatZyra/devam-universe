# Ritual-calendar lane scope and reuse audit

## Frozen denominator

The selected denominator is 105 items: 104 unique September-December ritual
slugs already represented by the current generic ritual contract, plus one
new annual applicability lane for Mahashivaratri. This is a selected product
boundary, not a census of Hindu observances or a national ritual canon.

The exact machine-readable denominator is
`knowledge_packs/library_lanes/ritual-calendar/inventory/ritual-calendar-selected-scope-v1.json`.
It was frozen before new ritual prose was authored.

## Reuse audit

The repository audit found 86 ritual JSON files. The current completeness
auditor classifies 47 as current-contract records and 39 as retained legacy
inputs superseded by a named current lane. The Panchang-to-ritual audit joins
79 unique resolved September-December slugs to current bilingual lanes and
finds another 25 ritual-only slugs. No legacy file, title match, preflight
fixture, or date-only record is counted by itself.

The 104-slug baseline is therefore reused by reference, without copying its
payloads into this lane. Its audit root is
`544c69218f3baf74a8858e21e34cc4928ed0d4d367da4ddd9067f66624d365dc`.

Hero-owned Ganesha, Devi, Durga Puja, Kali Puja, and Diwali-family records are
inventory dependencies only. This lane does not revise or duplicate them.
The Jain Diwali umbrella participation companion remains explicitly partial;
only its narrower lay-remembrance lane supplies the existing actionable
coverage, and formal Jain practice remains with the Diwali owner.

## Expansion boundary

Mahashivaratri is selected because the canonical consumer-anchor registry
assigns it to the ritual-calendar lane and because the existing monthly
Shivaratri pack explicitly excludes the annual observance. The new named lane
is limited to a Delhi-reference North/West India Smarta household remembrance
and ordinary temple-participation context. It does not claim initiated Shaiva,
Agamic, priest-led, regional South Indian, Kashmir Shaiva Herath, Nepal,
institution-specific, fasting, homa, consecration, or all-night liturgical
authority.

Authored content is lane-local and is not projected, hosted, published, or
independently culturally reviewed by this checkpoint.

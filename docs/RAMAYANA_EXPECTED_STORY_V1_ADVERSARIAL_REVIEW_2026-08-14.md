# Ramayana expected-story v1 adversarial review

Date: 2026-08-14

Verdict: **PASS for the defined 71-row Ramayana v1 consumer-expectation denominator**

Broader goal status: **incomplete**

## Exact claim accepted

The version-one checklist contains 49 selected-Dutt story cycles and 22
separately scoped supplemental expectations. All 71 rows have substantial
English and Hindi consumer narration. The 22 supplements resolve exactly once
to five packs containing 220 ordered bilingual episodes. This permits the
claim that the defined Ramayana v1 expectation denominator is authored and
reviewed.

It does **not** prove completeness for every Valmiki recension, Ramcharitmanas,
Kamba Ramayanam, Krittivasi Ramayana, Adhyatma Ramayana, Ramlila, oral,
regional, Southeast Asian, Jain, Buddhist, tribal, performance, television,
or devotional Rama tradition. It does not complete the separate 1,158-page
Ramcharitmanas reading denominator.

## Evidence reviewed

- `knowledge_packs/inventories/ramayana-story-universe-v1.json`
- `knowledge_packs/inventories/ramayana-expected-story-supplements-v1.json`
- `knowledge_packs/inventories/ramayana-expected-story-checklist-v1.json`
- all five `knowledge_packs/library_lanes/ramayana/expected-stories-*-v1.json`
  packs
- all five generated supplement migrations
- the focused batch, checklist, and coverage-inventory tests
- the source and reception boundaries named inside each pack

## Denominator and structural audit

| Requirement | Evidence | Result |
|---|---|---|
| Selected-expression denominator remains 49 | Generated checklist and selected story-universe inventory | PASS |
| Supplemental denominator remains 22 | Generated checklist and supplements inventory | PASS |
| Every supplement resolves exactly once | Five registered pack IDs and story IDs | PASS |
| Every supplemental story is complete in English and Hindi | `consumer_complete_en_hi` on all 22 rows | PASS |
| No duplicate episode IDs | 220 IDs compared across all five packs | PASS |
| No exact duplicate English or Hindi episode title or narration | Cross-pack normalized comparison | PASS |
| Sequence is navigable | Contiguous episode ordinals and non-empty transitions in every story | PASS |
| Source identifiers resolve | Story and episode references checked against each pack registry | PASS |
| Character and place identifiers resolve for the final pack | Selected entities plus explicit pack-local entity, place, and connection registries | PASS |
| UTF-8 survives | Raw JSON decoding, replacement-character scan, and Hindi-script tests | PASS |
| Database projection is deterministic | All compilers reproduce byte-current draft migrations | PASS |
| Source payloads remain outside projection | Migrations contain compact Devam narration and locators, not vault bytes | PASS |

The aggregate supplement result is five packs, 22 stories, and 220 episodes:

1. Ramcharitmanas beginnings and exile: 7 stories / 69 episodes.
2. Ramcharitmanas war and messengers: 3 stories / 25 episodes.
3. Ramcharitmanas Uttarkanda frames: 2 stories / 46 episodes.
4. Popular and living bridges: 5 stories / 35 episodes.
5. Later, regional, and devotional reception: 5 stories / 45 episodes.

## Adversarial narrative review

### Selected expression versus later reception

No supplemental story ID collides with a selected-Dutt story-cycle ID. Every
later or living story states its relationship to the selected expression. The
Lakshman Rekha, tasted berries, squirrel, Sulochana, Ahiravana/Mahiravana,
Lava-Kusha battle, open chest, and sindoor stories are not silently attributed
to Valmiki or Dutt. Rameswaram and Diwali records distinguish sacred or living
association from historical proof and universal practice.

### Material variants

The Ahiravana/Mahiravana journey does not invent a single harmonized plot. It
first supplies the shared abduction-and-rescue scaffold, then labels an eastern
Mahiravana branch separately from the popular five-lamp/Panchamukhi branch.
Names, kinship, sacrifice recipient, life-secret mechanics, and Makaradhwaja's
later office remain branch-bounded.

The Lava-Kusha horse confrontation is explicitly a TTD institutional popular
brief expanded into a coherent consumer sequence. It does not overwrite the
selected expression's sacrifice and twins-recitation sequence. The narration
uses only the confrontation order supported by that brief and adds no copied
television dialogue or unsupported fight choreography.

### Harm, consent, and social claims

The Sulochana pack records the historical performance's sati ending because
omitting it would falsify the lineage, but identifies sati as lethal historical
practice rather than purity, fidelity, devotion, or instruction. Sita's exile,
abduction, and earth-return episodes do not convert coercion or harm into
consent or retrospective justification. The open-chest miracle is explicitly
not self-harm guidance.

### Devotional promises and living practice

The chest and sindoor stories are labelled modern popular devotional tales.
The scholarly source's finding that the sindoor story lacks a known premodern
textual source is visible in the internal boundary. Tuesday offerings,
wish-fulfilment language, material choice, who may apply sindoor, and temple
procedure remain variant or institution-specific; none is presented as a
guaranteed outcome or universal instruction.

### Consumer depth

The final five stories contain 45 episodes rather than one-line placeholders:
7 for Sulochana, 12 for the two-branch underworld rescue, 12 for Lava-Kusha,
7 for the open-chest story, and 7 for sindoor. Each episode contains setup,
action, consequence, and a transition into what follows. Hindi and English
carry the same event order and safety boundary without exposing citations in
consumer prose.

## Remaining work outside this passed slice

- The complete Ramcharitmanas reading work remains 813 prepared text-bearing
  pages and 345 held pages; story supplements do not reduce that gap.
- Hanuman Chalisa has all 43 ordered units but still needs independent cultural
  and linguistic review plus exact saved-progress persistence.
- Wider Ramayana expressions retain their own future denominators.
- Mahabharata, hero worlds, Diwali breadth, September-December ritual breadth,
  Panchatantra, Puranic families, places, temples, history, yoga, and meditation
  remain open in the canonical Story Universe Coverage Inventory.
- The migrations remain draft and unapplied to hosted Supabase. No deployment
  or hosted mutation occurred in this checkpoint.

## Acceptance decision

No critical or high-severity defect remains in the defined Ramayana v1
supplement denominator. The checklist may move from authoring to reviewed
selected-scope completion. The overarching library goal must remain active;
the next highest-priority incomplete denominator is the continuous
Ramcharitmanas reading work, followed by the remaining Mahabharata backbone.

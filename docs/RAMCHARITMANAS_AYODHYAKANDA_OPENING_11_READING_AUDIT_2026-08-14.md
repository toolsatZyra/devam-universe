# Ramcharitmanas Ayodhyakanda opening-11 reading audit — 2026-08-14

## Decision

`knowledge_packs/devotional/ramcharitmanas-ayodhyakanda-opening-11-v1.json`
is fit as a bounded beta reading interval. It begins Ayodhyakanda with the
three Sanskrit invocations, the opening doha, and complete natural groups
1-11. It contains 12 passages, 59 ordered source units, and 12 Hindi plus 12
English meaning aids.

This is not Ayodhyakanda completion and not Ramcharitmanas completion. It stops
after doha 11, when the gods ask Saraswati to make Rama relinquish the kingdom
and go to the forest. Saraswati's response begins in group 12 and is outside
this checkpoint. Balakanda groups 1-292 also remain absent. The reviewed
forward tail now runs continuously from Balakanda group 293 through
Ayodhyakanda doha 11, but it completes no kanda.

The full selected lawful expression is the product. One fixed-edition page,
natural passage, shloka, chaupai, doha, or kanda per day is optional pacing over
the same canonical sequence, never a substitute for the complete work. Exact
resume is represented by the last completed passage or source unit and its
stable source-order key.

## Source, text, and rights audit

- The product witness is the retained Belvedere Press Prayag second-edition
  fixed scan, SHA-256
  `6d570d531ebada1912f6e930212393fec2200765a0b731b73b8e7135ea0f70f2`,
  scan pages 425-436. The source work and selected scan are treated as public
  domain.
- Pinned Hindi Wikisource revisions supply CC BY-SA 4.0 transcription evidence.
  Each page locator retains page and revision identity, timestamp, provider
  SHA-1, content SHA-256, and proofreading level.
- The `ramcharithmanas.com` Ayodhyakanda index, invocation page, and coronation
  episode page were used only for rapid normalized-text discovery and mismatch
  detection. Their contemporary meanings were not copied, and they are not
  product carriers.
- The Hindi and English meanings are fresh Devam-authored beta aids, separate
  from the Awadhi and Sanskrit source units. They do not claim to be an
  inherited commentary, critical edition, or replacement for the reading text.
- No source-vault byte, object, provenance row, or catalogue was changed.

All twelve fixed scan pages were rendered and visually inspected. The selected
carrier, rather than the clean reference stream, controls the product text.
The review retains `वामाङ्के` rather than the reference site's `यस्याङ्के`,
reads `शशिनिभः`, and preserves the selected scan's opening-doha forms
`मुकुरु`, `जसु`, and `दायकु`. Because the scan prints both the invocation's
closing doha and the first narrative doha as 1, the stable labels
`1-invocation` and `1` prevent identity collision without renumbering the work.

The rendered scan also repaired clear transcription or reference defects:

- `सब बिधि गुरु प्रसन्न जिय जानी` and `बोलेउ`, not a collapsed
  `सबबिधिगुरु` or `घोलेउ`;
- `प्रमुदित भोहिं` and `बरिस करोरी`, not `परिस करोरी`;
- `हरषि मुनीस`, `बीथिन्ह`, and `तोरन`, not `हरणि`, `बोथिन्ह`, or `तारन`;
- `गुरु आगमन सुनत`, not the collapsed `गुरुआगमन सुनत्त`;
- `तेहि अवसर आये लखन`, not `लेहि अवसर`; and
- `चोरहि चन्दिनि राति`, not `चारहि चन्दिनि राति`.

Spacing and punctuation normalization remains labelled. This bounded
reconciliation is not an exhaustive critical-edition claim.

## Meaning and claim audit

The bilingual aids preserve the complete movement of the selected interval:
Ayodhya's prosperity after Rama's marriage; the city's wish for his
appointment; Dasharatha's aging and consultation with Vasishta; court approval;
the detailed consecration preparations; Rama and Sita's signs and Rama's longing
for Bharata; celebration in the royal household and city; Vasishta's visit;
Rama's concern about being selected apart from his brothers; and the gods'
request to Saraswati. The final passage explicitly hands off to group 12 rather
than pretending the exile has already occurred.

Devotional incarnation claims, divine intervention, auspicious timing, omens,
promised fruits, and ritual efficacy remain attributed to the poem or its
characters. They are not presented as verified history, science, or guaranteed
outcomes. The aids describe hereditary monarchy, primogeniture, court and
priestly hierarchy, master-servant language, period gender conventions,
animal hides, costly consecration materials, gifts, offerings, and worship
without turning them into modern legal, ethical, household, or ritual
instructions. No dialogue, consent, political mandate, motive, or causal
certainty absent from the source has been invented.

## Product and schema audit

The existing migration
`supabase/migrations/20260814040000_add_devotional_reading_model.sql` already
separates reading sequences, natural passages, bilingual passage aids, source
units, and user-owned exact progress. This checkpoint requires no schema
change. The JSON pack is the only tracked copy of its 59 source units; the
validator hashes those units in place and does not embed a second corpus copy.
No payload-bearing seed migration was created, and no hosted Supabase state was
changed.

The reading contract and both consumer coverage inventories now agree on 81
completed passages, 436 completed source units, 81 bilingual passage meanings,
zero complete kandas, and the forward endpoint Ayodhyakanda doha 11. Full-work
and daily-reading availability remain false until the complete sequence exists;
progress persistence remains product work.

Reviewed pack SHA-256:
`8da80f7e73162bc3b937f9c88986648afe649bc709abe7fb237ca1e0fb73e86a`.
The fixity was refreshed when the later reviewed batch supplied the now-valid
forward link from group 11 to group 12; source text and meaning did not change.

## Validation

Validation completed on 2026-08-14:

- the deterministic Ayodhyakanda validator passed all 12 passages, 59 source
  units, 24 bilingual meaning records, fixed-scan page evidence, reviewed
  corrections, rights boundaries, exact hashes, UTF-8, and complete-work
  denial;
- 11 focused Ayodhyakanda plus end-to-end devotional reading tests passed;
- the complete Python suite passed 359 tests with one named optional local
  render-dependency skip;
- the portable web product suite passed 1,128 tests in 213 files, with 18 named
  skips;
- ESLint, TypeScript, JSON parsing, both Ramcharitmanas interval validators,
  adversarial uniqueness and meaning-length checks, `git diff --check`, and the
  optimized Next.js production build passed.

The first full-suite run exposed one stale Balakanda test that treated its own
69 passages and 377 units as the work-wide cumulative total. It was corrected
to keep those batch-local assertions while checking cumulative 81/436; the
rerun passed without weakening source or completion checks.

## Remaining boundary

Continue forward from Ayodhyakanda group 12 at the Saraswati response while
separately backfilling Balakanda groups 1-292. Completion still requires every
source interval across all seven kandas, approachable Hindi and English meaning
for every natural passage, one gapless beginning-to-end sequence, and verified
page, passage, source-unit, kanda, and exact-resume traversal. Historical
commentary may remain an optional layer and does not reduce that denominator.

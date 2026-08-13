# Ramcharitmanas Ayodhyakanda 12-22 reading audit — 2026-08-14

## Decision and boundary

`knowledge_packs/devotional/ramcharitmanas-ayodhyakanda-12-22-v1.json`
is fit as a bounded beta reading interval containing Ayodhyakanda groups 12-22:
11 passages, 55 ordered source units, and 11 Hindi plus 11 English consumer
meaning aids. It begins with Saraswati's response to the gods and ends after
Manthara tells Kaikeyi to enter the anger chamber and secure the two boons.
Kaikeyi acts on that instruction in group 23, outside this checkpoint.

This is neither Ayodhyakanda nor Ramcharitmanas completion. The corrected
forward tail now runs from Balakanda group 293 through Ayodhyakanda doha 22 and
contains 92 passages and 491 units, but Balakanda groups 1-292 and Ayodhyakanda
group 23 onward remain absent. The complete selected expression remains the
product; a page, passage, chaupai, doha, or kanda per day is optional pacing
over the same order, with exact resume.

## Source and rights audit

- The product witness is the retained Belvedere Press Prayag second-edition
  fixed scan, SHA-256
  `6d570d531ebada1912f6e930212393fec2200765a0b731b73b8e7135ea0f70f2`,
  pages 436-447. The source work and scan are treated as public domain.
- Pinned Hindi Wikisource revisions remain CC BY-SA 4.0 transcription evidence
  with page identity, revision identity, timestamp, provider SHA-1, content
  SHA-256, and proofreading level.
- The two `ramcharithmanas.com` episode pages accelerated segmentation and
  mismatch discovery only. Their modern meanings were not copied and they are
  not product carriers.
- The Hindi and English meanings are new Devam-authored beta aids, separate
  from the source text and from the selected edition's old commentary.
- No source-vault object, provenance row, catalogue, or retained byte changed.

All fixed scan pages 436-447 were rendered and visually reviewed. The batch
retains the fixed carrier where reference or Wikisource text regularized,
collapsed, or misread it, including `बिसमय हरष रहित रघुराऊ`, `नाम मन्थरा मन्द
मति`, `मज्जुल मङ्गल`, `जिन्हहिं जनेस`, `भरत सपथ तेहि साँच`, `अवध
साढ़ेसाती`, `पठये भरत भूप ननिऔरे`, `कहेसि कथा सत सवति कै`, and `अपने चलत
न आजु लगि अनभल काहु क कीन्ह`. Spacing, punctuation, and hyphenation are
normalized and labelled. This is a reading expression, not an exhaustive
critical edition.

## Narrative and claim audit

The consumer aids retain the whole persuasion sequence rather than replacing
it with "Manthara changed Kaikeyi's mind":

1. Saraswati regrets the gods' request; the poem criticizes their inability to
   bear another's prosperity before she turns Manthara's mind.
2. Manthara sees the celebration, stages grief, and makes Kaikeyi fear for the
   royal family.
3. Kaikeyi first rejects division, affirms that Rama is dearer than life, and
   offers a reward for good coronation news.
4. Manthara converts rebuke into leverage through self-pity, claimed
   selflessness, conspiracy allegations, social displacement, and fear for
   Bharata.
5. Kaikeyi moves from confidence to fear, treats dreams and bodily signs as
   confirmation, and yields decision control.
6. Manthara invokes the two outstanding boons, prescribes an oath trap and
   urgency, and sends Kaikeyi to the anger chamber.

Divine intervention, karma, fate, planetary imagery, omens, astrology, rebirth,
and promised outcomes remain attributed devotional or character claims. The
pack does not present Manthara's allegations about Kaushalya or Dasharatha as
history. Disability, caste, class, gender, co-wife, animal, servitude, and body
slurs are preserved as harmful period language without treating physical
difference as moral character. Threatened mutilation, statements preferring
death or falling into a well, family abandonment, isolation, oath leverage,
and distrust are identified as coercive or self-harm language, not devotional,
ritual, mental-health, or practical advice. No free and unpressured consent is
invented.

## Product and schema audit

The existing migration
`supabase/migrations/20260814040000_add_devotional_reading_model.sql` separates
ordered sequences, passages, bilingual aids, source units, and user-owned exact
progress. It needs no schema change for this content batch. The JSON pack is the
only tracked copy of its 55 source units; the validator hashes it in place and
does not embed a second corpus. No payload seed was created and no hosted
Supabase state changed.

The work contract and both coverage inventories agree on 92 reviewed passages,
491 reviewed units, 92 bilingual passage meanings, zero complete kandas, and
the forward endpoint Ayodhyakanda doha 22. Full-work and daily-reading
availability remain false until the complete sequence exists.

Reviewed pack SHA-256:
`62be80a3a93140a1c1b748b0e4b62ec02539e94f2fa6016f5d821b0ffc4ffc5b`.

## Validation

Validation completed on 2026-08-14:

- the deterministic groups 12-22 validator passed all 11 passages, 55 source
  units, 22 bilingual meaning records, page evidence, reviewed fixed-scan
  readings, rights boundaries, UTF-8, safety boundaries, exact hashes, and
  complete-work denial;
- 17 focused current/preceding Ayodhyakanda and end-to-end devotional reading
  tests passed;
- the complete Python suite passed 365 tests with one named optional local
  render-dependency skip;
- the portable web product suite passed 1,128 tests in 213 files, with 18 named
  skips;
- ESLint, TypeScript, JSON parsing, both Ayodhyakanda validators,
  `git diff --check`, and the optimized Next.js production build passed; and
- adversarial checks found 11 unique passage identities, 55 unique unit
  identities and texts, 11 distinct meanings in each language, bilingual
  context for every passage, English meaning lengths of 626-726 characters,
  Hindi meaning lengths of 506-642 characters, one fixed source carrier, and no
  full-kanda or full-work overclaim.

## Remaining boundary

Continue from Ayodhyakanda group 23, where Kaikeyi acts on the anger-chamber
instruction, while separately backfilling Balakanda groups 1-292. Completion
still requires every source interval across all seven kandas, approachable
Hindi and English meaning for every natural passage, a gapless beginning-to-end
sequence, and verified page, passage, source-unit, kanda, and exact-resume
traversal. Old commentary remains optional and does not reduce that denominator.

# Ramcharitmanas Balakanda 293-339 reading audit — 2026-08-14

## Decision

`knowledge_packs/devotional/ramcharitmanas-balakanda-293-339-v1.json` is fit
as the first bounded beta reading interval. It is not Balakanda completion and is
not Ramcharitmanas completion.

The selected interval contains exactly 47 consecutive groups (293-339), 264
ordered source units, and 47 Hindi plus 47 English passage
meanings. Readers may move continuously or pause after a page, natural passage,
doha, chaupai, or kanda. A one-unit pace retains the containing natural passage
and its bilingual meaning so that the selected line is not detached from
context. Exact user progress is modelled locally but has not been applied to a
hosted database.

## Source and rights audit

- The product source witness is the retained Belvedere Press Prayag fixed scan,
  SHA-256
  `6d570d531ebada1912f6e930212393fec2200765a0b731b73b8e7135ea0f70f2`,
  pages 354-404. The underlying work and selected scan are treated as public
  domain.
- Pinned Hindi Wikisource page revisions are retained as CC BY-SA 4.0
  transcription evidence with page IDs, revision IDs, timestamps, revision
  SHA-1 values, content SHA-256 values, and proofreading levels. Their licence
  obligations remain explicit.
- `ramcharithmanas.com` and IIT Kanpur were used only as reference witnesses to
  accelerate mismatch discovery. Their contemporary meanings were not copied,
  their text was not retained as the product carrier, and they remain in the
  reference-only lane.
- The Hindi and English meanings are fresh Devam-authored beta aids. They are
  separate from the Awadhi source text and do not claim to be a critical
  edition or inherited commentary.
- No source-vault object, provenance map, or retained source byte was changed.

## Text audit

All fixed-scan pages 354-404 were rendered and visually checked. The 264 units
rehash deterministically and form one strict source-order interval. Every
passage preserves four chaupai units followed by its natural closing doha or
soratha unless the source itself carries a longer chaupai run or intervening
chhands. Groups 311 and 316-327 preserve their natural chhand boundaries;
groups 324 and 326 contain four chhands, groups 325 and 327 contain four
chhands after five chaupais, and group 336 closes its chhand with a soratha.
The pack therefore does not force the work into a uniform five-unit template.

The audit rejected a reference-stream transcription `प्रीति कै प्रीति` and
retained the fixed-scan reading `प्रीति कै रीति` in group 296. The doubled
consonant spelling `घुर्म्मरहिं` was normalized to `घुर्मरहिं` without changing
the lexical reading. Spacing and punctuation normalization is labelled; no
claim of exhaustive textual criticism is made.

Groups 306-339 were independently checked against rendered scan pages 366-404.
The review preserved the chhand and soratha boundaries, the transition from the
procession's lodging to the family reunion, the city conversations, the
traditional wedding-time frame, the divine-spectator passage, Rama's horse and
wedding form, Sunayana's welcome, Rama's entry into the pavilion, the meeting
of the two households, the honoring of the wedding party, Sita's entrance, the
wedding rites, all four marriages, the feast, preparations to depart, the
farewells, and the brides' departure. The clean reference stream accelerated
unit discovery but supplied no product meaning or retained source carrier. A
zero-width character in group 327 was removed, and a collapsed-word boundary
in group 324 was restored to the spacing visible in the fixed scan.

## Meaning and claim audit

Each Hindi and English meaning was checked against every source unit in its
group for setup, action, transition, and closing image. Three omissions found
during adversarial review were repaired:

1. group 299 now carries the closing transition into favourable signs;
2. group 303 now includes the crow and mongoose rather than compressing the
   omen list into generic birds; and
3. group 305 now acknowledges the poem's list of birds, deer, horses, and
   elephants as royal gifts while explicitly refusing to present that period
   story-world detail as a present-day model.

Poetic horse speed, divine flower showers, incarnation language, divine
visitors, name-remembrance fruits, astrology, and omen interpretation remain
attributed to the poem or devotional narrative. Omens are
not presented as science, guaranteed prediction, or mandatory contemporary
practice. Animal gifts are not normalized as consumer guidance.

The extension through group 323 also keeps royal hospitality and honor-order
descriptive rather than universally prescriptive; treats disguised gods,
embodied fire, and embodied Vedas as devotional-poetic scenes rather than
eyewitness history; and bounds period beauty imagery so it is not converted
into a body standard. The mutual gaze between Sita and Rama is retained without
inventing dialogue, consent claims, or motives not supplied by the passage.

Groups 324-339 preserve kanyadana, all four marriages, dowry and royal gifts,
the kohbar and lahkaur scenes, feast songs, departure preparations, farewell
counsel, palace grief, animal imagery, palanquins, servants, auspicious signs,
and devotional or divine scenes without silently modernizing them. Period
property, gender, service, hierarchy, body-image, and marriage language is
described as part of the poem rather than endorsed as universal modern advice.
The pack does not invent the brides' unrecorded deliberations, convert poetic
numbers into audited inventories, prescribe teasing or ritual details, or
treat celestial and animal scenes as independently verified history or
zoology.

## Product and schema audit

The local schema separates complete reading sequences, natural passages,
bilingual passage aids, individual source units, and user-owned exact progress.
Public reads require both `published` state and `product_allowed` rights. User
progress is protected by owner-only row-level policies. Narrative story packs
cannot substitute for omitted source-text intervals.

The JSON pack is the sole tracked copy of the 264 source units and their
meanings. The validator reads that pack, rehashes every unit, checks all counts,
links, source coordinates, pinned revision evidence, rights boundaries, UTF-8,
and reviewed corrections. It does not embed a second corpus copy. The repository
tracks the reusable reading schema migration but deliberately does not track a
payload-bearing SQL seed; database insertion must be generated from the pack at
an explicitly authorized application step. No hosted Supabase state was changed.

Deterministic output fixities after review:

- reading pack SHA-256:
  `87647120f8fa15216fc8ad6c32988b86b7a26194f0a5f854d22855598dfbd114`.

Validation completed on 2026-08-14:

- 21 focused reading, inventory, source, rights, and generation tests passed;
- the complete Python suite passed 352 tests with one optional local render
  dependency skip;
- the portable web product suite passed 1,128 tests in 213 files, with 18 named
  skips;
- ESLint, TypeScript, JSON parsing, deterministic validation, generated
  inventory freshness, `git diff --check`, and the optimized Next.js production
  build passed.

## Remaining boundary

The next batch must continue the canonical work without gaps. Completion still
requires every source interval across all seven kandas, approachable Hindi and
English meaning for every natural passage, unbroken page/passage/source-unit/
kanda traversal, exact resume, and work-wide continuity review. Old-edition
commentary may be offered separately but is not part of the consumer source-work
denominator.

# Ramayana whole-journey adversarial review

Status: **first full-corpus review checkpoint — 2026-08-13**

## Decision

Devam has a complete beginning-to-end consumer retelling of one selected
Manmatha Nath Dutt English expression: 652 source-ordered units are represented
exactly once by 49 turns, 402 substantial English/Hindi scenes, and 1,746
bilingual beats. This is not yet a complete illustrated Ramayana world and must
not be described that way.

The production-shaped journey currently exposes 55 dedicated illustrated
scenes in seven detailed districts. Fourteen compass turns open one of those
visual worlds directly. The remaining 35 turns have complete authored scenes in
the narrative snapshot and prepared database projection, but the journey UI
still presents them as orientation because equivalent art, district loading,
and reversible world navigation have not been projected. The next product
priority is to close this experience gap, not to write a second summary layer.

## Evidence reviewed

- complete narrative snapshot: 7 arcs, 49 turns, 402 scenes, 1,746 beats;
- exact selected-source partition: all 652 units represented once;
- compiled traversal: 401 story-order, 94 character-path, 50 place-echo, and 22
  parallel-thread links, plus six separately governed living-world bridges;
- live illustrated journey: 55 scene stops, seven districts, 14 direct compass
  entrances, and 35 orientation entrances;
- local product regression: 1,005 tests passed with 18 named vault-only skips;
- desktop/mobile Playwright: 32/32 passed, including pan, zoom, exact context
  restoration, character paths, living-world return, and seven districts; and
- exact-head CI for the preceding epic checkpoint passed both tracked-evidence
  and full web/browser jobs; it does not certify changes made during this
  review.

## Findings

### What is sound

- Every selected-source unit belongs to exactly one scene under exactly one
  turn; the corpus does not hide skipped intervals behind famous moments.
- All 402 English narratives, all 402 Hindi narratives, and all 1,746 visual
  directions are unique. The review found no repeated filler blocks.
- Hindi and English consumer fields contain clean Unicode, not rendered
  mojibake or replacement characters.
- Every scene contains at least three beats, substantial bilingual narration,
  characters, narrative places, and visual staging.
- Difficult episodes already preserve important distinctions: Sita's agency
  and repeated public testing, Surpanakha's injury, Vali's ethical challenge,
  captivity and self-harm crises without actionable method, casualties and
  grief, and the difference between narrator praise and present guidance.

### Repaired in this checkpoint

Five normal-story beats exposed editorial vocabulary such as “selected
edition,” “translation,” or “this section.” They were rewritten as story-first
English/Hindi narration while their edition and uncertainty boundaries remain
available in evidence metadata. The audit now fails if those terms return to
consumer scene copy.

### Explicit repair queue

Five scenes exceed the preferred three-to-seven-beat interaction unit:

| Scene | Beats | Required treatment |
|---|---:|---|
| `mahendra-launches-the-messenger` | 12 | Divide its interaction into bounded phases without duplicating or losing its source span. |
| `despair-yields-to-ashoka-grove` | 8 | Separate search exhaustion from the grove transition if the source address can remain exact. |
| `trijatas-dream-breaks-the-circle` | 9 | Preserve one dream sequence but add an internal chapter break. |
| `the-search-chain-becomes-proof` | 8 | Separate route reconstruction from proof delivery. |
| `sitas-voice-crosses-through-hanuman` | 10 | Separate Sita's message from Hanuman's carrying of it without weakening her voice. |

These scenes are not thin summaries. Their risk is interaction fatigue. They
must not be split mechanically when one source unit supplies the whole event;
an internal phase/chapter control is safer than duplicating a source range.

Five turns fall below the provisional depth target of at least three scenes and
twelve beats:

| Turn | Scenes | Beats | Repair priority |
|---|---:|---:|---|
| `coronation-dawn` | 1 | 4 | Highest: six source units are compressed into one opening scene. |
| `deeper-into-forest` | 2 | 11 | Add one consequential transition rather than padding. |
| `panchavati-surpanakha` | 2 | 11 | Preserve domestic Panchavati and Surpanakha's full arrival/injury sequence as distinguishable movement. |
| `war-at-janasthana` | 1 | 6 | Highest: thirteen source units are compressed into one scene. |
| `golden-deer-plot` | 2 | 10 | Separate coercion of Maricha, deception, and household separation where source boundaries permit. |

The automated review freezes these ten exceptions by identity and count. A new
exception fails the suite; removing an exception also requires updating the
test, making progress explicit.

## Experience and art-direction judgment

The 402-scene corpus is the correct data layer, but most of it is not yet the
experience the user described. Visual cues are not visual worlds. Database
links are not traversal rewards. The journey must project the same authored
scene into four reversible lenses—main story, narrative place, character path,
and story thread—while loading art and copy by district rather than shipping the
whole corpus to the browser.

The next illustrated tranche should close the five thin turns first because
they are already visible near completed districts and create the sharpest
quality discontinuities. Each new scene needs a distinct tableau or a clearly
authored animated composition, a recognizable biome and cast, immediate
previous/next movement, place and character exits, and exact restoration of the
originating lens. It must not become another prose panel.

## Next gates

1. Correct the five thin turns with exact source partitioning and no invented
   filler.
2. Add phase navigation for the five long scenes without duplicating source
   identity.
3. Make all 49 turns open their authored scenes through lazy district payloads;
   retain honest visual-readiness labels until art is present.
4. Extend browser acceptance from seven districts to each newly illustrated
   tranche on desktop and mobile, including touch pan/pinch, keyboard movement,
   back-stack restoration, and reduced motion.
5. Conduct observed ordinary-user comprehension and enjoyment testing. Passing
   automated mechanics is not evidence that the experience is engaging.

No hosted database, production deployment, or external service was mutated by
this review.

# Ramayana playable vertical slice

Status: **playable encounter candidate — 2026-08-10**

## Decision

Devam will not try to make the whole Ramayana equally playable at once. The
first repeatable story-world slice is **The road home to Ayodhya**, a bounded
journey through Manmatha Nath Dutt's Yuddha Kanda sections CXXIV-CXXX.

This is the right first slice because it has a complete emotional arc, moves
through characters and narrative places, ends with an earned homecoming, and
opens a responsibly scoped bridge into living Diwali traditions. It tests the
full product grammar without pretending to complete the Ramayana universe.

The existing seven-kanda, edition, character, place, performance, temple, and
festival nodes remain available in the Living Atlas and Search. The playable
journey is an inviting front door into that deeper library, not its replacement.

## What the live-product audit established

The stable product already supplies smooth cosmic presentation, progressively
revealed nodes, source boundaries, back/reset controls, English/Hindi story
copy, and a Sarthi drawer. It does not yet supply the experience the user asked
for inside a story world:

- the active scene remains a glowing dot in an abstract graph;
- the reader receives a paragraph rather than inhabiting a place or event;
- characters have names but no spatial or visual presence;
- geography, narrative sequence, and cross-world connections are not distinct
  playable lenses;
- no persistent objective tells a returning player what was discovered or what
  comes next; and
- the visual payoff does not change materially as the story advances.

The problem is therefore not merely insufficient graph density. The encounter
grammar must change from **node plus text card** to **scene, choice, movement,
discovery, consequence, and optional evidence**.

## Evidence boundary

### Narrative spine

The seven playable beats use exact byte-addressed passages in the product-
allowed Project Gutenberg electronic transcription of Manmatha Nath Dutt's
English prose translation:

| Beat | Narrative purpose | Exact selected-edition coordinate |
| --- | --- | --- |
| Leave Lanka | companions board Pushpaka and the homeward journey begins | Yuddha Kanda CXXIV, source ordinal 122 |
| The sky road remembers | the returning party looks back across the journey | Yuddha Kanda CXXV, source ordinal 123 |
| Home is near | Rama reaches Bharadvaja's hermitage and asks about Ayodhya | Yuddha Kanda CXXVI, source ordinal 124 |
| Hanuman goes ahead | Hanuman is sent toward Guha, Bharata, and Ayodhya | Yuddha Kanda CXXVII, source ordinal 125 |
| Bharata hears the news | Hanuman recounts the journey to Bharata | Yuddha Kanda CXXVIII, source ordinal 126 |
| Ayodhya prepares | the city and its people prepare to receive Rama | Yuddha Kanda CXXIX, source ordinal 127 |
| The kingdom is returned | Bharata returns the kingdom and the coronation follows | Yuddha Kanda CXXX, source ordinal 128 |

The parallel Vālmīki Rāmāyaṇa web edition independently places the messenger,
Nandigrama reunion, and coronation in Yuddha Kanda sargas 125, 127, and 128.
That comparison supports the selected sequence; the product continues to cite
its exact Dutt-edition coordinates rather than silently merging editions.

### Living connections

- UNESCO describes Ramlila as a sequence of scenes using song, narration,
  recital, and dialogue, with audiences invited to participate. This supports a
  scene-led and participatory product grammar, not the copying of one local
  Ramlila script or performance.
- Incredible India presents Rama's return after exile as a major Diwali story
  association and separately names Krishna/Naraka and Bali traditions in other
  regions. Devam therefore exposes a **North Indian Rama-homecoming portal**,
  never a universal Diwali origin claim.
- Uttar Pradesh's tourism policy names Ayodhya, Chitrakoot, and Shringverpur
  within a modern Ramayana circuit. That is a contemporary tourism-policy
  context, not proof that narrative geography maps literally onto modern
  terrain.

### Visual boundary

Scene art is a Devam-authored artistic visualization. It is not a source image,
archaeological reconstruction, historical photograph, universal iconography,
or claim about the appearance of a person or place. Source witnesses and modern
place imagery remain separate evidence lanes.

## The playable loop

Every scene must support the same short loop:

1. **Arrive** — the world, lighting, ambient motion, and objective change.
2. **Orient** — the player sees where they are, who is present, and the next
   possible action without opening a menu.
3. **Notice** — a character, route, place, or relationship becomes discoverable.
4. **Act** — the player travels, chooses a light, or opens a connection.
5. **Receive** — the next scene, a character relationship, or a living-world
   portal is unlocked; there is no spiritual scoring.
6. **Go deeper only by choice** — source, edition, variants, and uncertainty are
   available without dominating the scene.

The target session is 10-15 minutes. A scene should communicate its essential
story in 20-45 seconds, with no required long-form reading.

## Three lenses, one world

The player never leaves the full-screen world merely to understand it.

### Story

The default lens is a cinematic sequence of seven visual scenes. It prioritizes
emotion, characters, and one clear next action. Short retelling copy is capped at
roughly 45 words per beat in English and Hindi.

### Route

A stylized narrative map shows only four landmarks needed for this slice:
Lanka, Bharadvaja's hermitage, Nandigrama, and Ayodhya. It is explicitly a story
route, not a historical GIS assertion. Selecting a landmark returns to the
corresponding scene without losing progress.

### Connections

The player can see the nearby universe without returning to a flat menu:

- characters: Rama, Sita, Lakshmana, Hanuman, Bharata, Vibhishana, and Sugriva;
- narrative places: Lanka, Bharadvaja's hermitage, Nandigrama, and Ayodhya;
- story events: departure, message, reunion, return of the kingdom, coronation;
- living portals: North Indian Diwali homecoming tradition and Ramlila; and
- evidence doors: the selected Dutt edition and the wider seven-kanda library.

Connections are rewards for attention, not an encyclopaedic dump. A visible
trail, Back control, direct scene selection, and saved checkpoint make every
move reversible.

## Art direction

The cosmic universe is the wrapper; each story is its own biome. This slice
moves through seven scene-specific tableaux within four larger visual states:

1. saffron and indigo dawn above Lanka;
2. jade and gold river-and-hermitage country;
3. blue-hour Nandigrama with the distant city beginning to glow; and
4. deep indigo Ayodhya transformed by amber lamps.

Foreground, middle ground, and horizon move at different rates to create depth
without requiring WebGL. Scene changes use slow camera drift and cross-fades;
`prefers-reduced-motion` removes scale and parallax. Characters remain readable
at smartphone size. UI occupies the edges, not a permanent third of the world.

Four additional original tableaux replace the earlier reused-art mismatches:

| Product asset | Story event | SHA-256 |
| --- | --- | --- |
| `ramayana-return-sky-road-v1.webp` | the remembered aerial route | `4569b35f39518233764b722a9777a6ee615d18402196db3a50075d4153ff9d79` |
| `ramayana-return-hanuman-ahead-v1.webp` | Hanuman carries the message north | `615654afc2d1bc388680fead6be6233a2025c5fc91c42817a8ff256ad063fb8f` |
| `ramayana-return-bharata-hears-v1.webp` | Bharata receives the news beside the sandals | `ced6687489238307d945b0b4951e4abd9143148941e3465f4064cc46d844c097` |
| `ramayana-return-coronation-v1.webp` | coronation and gratitude to the alliance | `e8b56ffa6f48dcafcf0b27ad04456f472d6a3c9e85499051eed99095d38ef912` |

They were generated for Devam with the built-in image model on 2026-08-09,
using the earlier Devam-authored biome paintings only as style references, then
encoded as WebP. They contain no third-party source image. The visual boundary
above applies to every tableau; narrative claims continue to come from the
source-addressed story data rather than from generated imagery.

## Interaction and accessibility acceptance

- touch drag, mouse drag, wheel/pinch, keyboard arrows, scene buttons, Back,
  and Reset remain usable at every depth;
- the player always knows the current objective and completed scenes;
- Story, Route, and Connections use consistent controls and preserve focus;
- browser history or the in-world Back control returns to the previous scene;
- no essential action depends only on colour, motion, hover, or tiny targets;
- reduced-motion mode removes spinning, scaling, and parallax triggers;
- desktop and mobile have no horizontal overflow or trapped camera state; and
- a failed image load retains readable story, location, and navigation.

Implementation checkpoint 2026-08-09: the scene world now supplies bounded
mouse/touch drag, wheel/pinch depth, double-tap depth, keyboard travel and pan,
visible zoom/reset controls, camera reset on scene travel, and a replay path
after completion. Camera bounds are symmetric and unit-tested so travelling too
far in one direction cannot create a trapped state. This is interaction-contract
evidence, not evidence that the experience is already engaging; that still
requires observed play.

Implementation checkpoint 2026-08-10: all seven scenes now resolve to a small
in-world encounter constellation. The Connections lens exposes family-shaped
event, person, and place portals; closer Story-lens depth reveals scene-local
discoveries without turning the journey into a menu. An encounter contains only
a short orientation, typed nearby routes, a progressive source boundary, and a
reversible discovery trail. The return arc adds fifteen reviewed destinations
and forty exact Dutt CXXIV-CXXX source-addressed edges. Desktop and mobile
browser acceptance cover entry, relationship traversal, evidence access,
backtracking, zoom discovery, reset, and zero trapped camera state. This proves
the implemented interaction contract; it does not prove engagement or complete
Ramayana coverage.

This follows the useful design lesson from *Journey*: an emotional arc must be
designed and iterated as a whole, not inferred from visual polish. It also uses
the Xbox accessibility guidance that complex worlds need persistent objective
clarity, predictable UI context, and equivalent digital and analog navigation.

## Replication boundary

This slice is successful when a first-time mobile user can answer, without
reading documentation:

1. Where am I?
2. Who is here?
3. What just changed?
4. What can I do next?
5. How do I go back?
6. How is this connected to another story, festival, place, or source?

Only then should the grammar be replicated. The next candidates are Hanuman in
Lanka, the Ayodhya-to-exile turn, and Sita in Mithila. Different stories may use
different mechanics, but they retain the same navigation, evidence, rights,
language, and uncertainty contracts.

## What this slice does not prove

It does not complete the Ramayana, identify a historical route, settle the
location of Lanka, define every character or theology, cover every Diwali or
Ramlila tradition, supply current visitor operations, prescribe ritual, or
establish that an attractive candidate is engaging. Engagement still requires
observed user play, completion, voluntary connection-opening, return-session,
and qualitative comprehension evidence.

## Research references

- Vālmīki Rāmāyaṇa, Yuddha Kanda sarga 125:
  https://www.valmikiramayan.net/utf8/yuddha/sarga125/yuddha_125_prose.htm
- Vālmīki Rāmāyaṇa, Yuddha Kanda sarga 127:
  https://www.valmikiramayan.net/utf8/yuddha/sarga127/yuddha_127_prose.htm
- Vālmīki Rāmāyaṇa, Yuddha Kanda sarga 128:
  https://www.valmikiramayan.net/yuddha/sarga128/yuddha_128_prose.htm
- UNESCO, *Ramlila, the traditional performance of the Ramayana*:
  https://ich.unesco.org/en/RL/ramlila-the-traditional-performance-of-the-ramayana-00110
- Incredible India, *Diwali: A festival of lights and joy*:
  https://www.incredibleindia.gov.in/en/festivals-and-events/diwali
- Government of Uttar Pradesh, *Tourism Policy 2022*:
  https://invest.up.gov.in/wp-content/uploads/2023/02/Tourism_Policy_2022.pdf
- GDC Vault, *Designing Journey*:
  https://www.gdcvault.com/play/1017700/Designing
- Xbox Accessibility Guideline 109, objective clarity:
  https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/109
- Xbox Accessibility Guideline 114, UI context:
  https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/114
- Xbox Accessibility Guideline 107, input:
  https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/107
- Apple reduced-motion evaluation criteria:
  https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria

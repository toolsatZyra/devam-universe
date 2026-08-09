# Ramayana story-world strategy

Status: **revised product and game-direction contract — 2026-08-10**

Current implementation checkpoint: the story world now has two explicit
illustrated districts rather than one hidden late-epic doorway. **The night the
road changed** covers Ayodhyā Kāṇḍa source units I–XL exactly once across eight
scene-specific tableaux and thirty-six bilingual beats. **The road home**
retains seven tableaux and twenty-nine bilingual beats across Yuddha Kāṇḍa
CXXIV–CXXX. Each district has its own sequence, progress, completion, replay,
and return to the common compass; the player never auto-jumps across the
unfinished middle of the epic.

The initial world pack carries only bilingual previews, nodes, routes, and the
district index and remains below 145 KB raw / 35 KB gzip. Complete beat scripts
load only for the district entered, each below 75 KB raw / 18 KB gzip, while
media preloads only immediate neighbours. Four compass turns are now playable
entrances and forty-five remain honestly labelled orientation. Any older
checkpoint language below that calls the road home the only playable district
or describes forty-eight orientation turns is superseded by this checkpoint.

## North star

The Ramayana world is not a graph viewer, a chapter browser, or a short summary
of an epic that the audience already knows. It is a story universe. Exploration
is the storytelling mechanism: a visitor may follow the main sequence, jump to
a place, trace one character's path, revisit a consequence, or cross into a
living festival, performance, temple, or modern place and return without losing
context.

For epic, deity, and goddess worlds, the visible product leads with stories.
For verifiable living places, festivals, rituals, performances, institutions,
and visitor information, it leads with current, attributable information.
Source editions, Sanskrit labels, textual coordinates, rights, variants, and
uncertainty remain essential infrastructure, but they are progressive evidence
and editorial controls rather than the default consumer vocabulary.

## Adversarial review of the current candidate

The current road-home candidate proves useful mechanics: a cinematic world,
bounded pan and depth, a seven-scene sequence, a narrative route, nearby people
and places, typed relationships, reversible encounter travel, Hindi/English,
and exact source doors. It does not yet satisfy the product vision.

### Consumer-product failure

- Seven short scenes cover only one late return arc. A visitor expecting the
  Ramayana story will reasonably perceive this as a fragment.
- Most encounters still offer orientation text and graph relationships rather
  than a story unfolding through action, dialogue, consequence, and imagery.
- Textual labels such as kāṇḍa, sarga, section, edition, and span remain too
  prominent for the default audience. They explain the database more than the
  story.
- One background per broad location cannot carry the emotional, character, and
  event variety of a long epic.
- “Complete source carrier” and “complete consumer story world” are different
  achievements. Devam currently has the former for one selected Dutt English
  narrative body, not the latter.

### Game-design failure

- A connection is not yet a reward when it opens another summary panel. The
  reward must be a new scene, revelation, character viewpoint, place memory, or
  living-world consequence.
- The journey offers freedom of camera movement but limited freedom of
  narrative discovery. The sequence, map, character paths, and place memories
  are not yet equally capable ways through the story.
- There is no durable story compass that answers: where am I in the larger
  epic, what led here, what changed here, and where could I go next?
- Discovery has no semantic memory beyond visited scene IDs. It cannot yet
  remember that the visitor learned a relationship, completed an arc, or found
  several events attached to one place.

### Content and evidence failure

- A single sentence cannot substitute for a scene whose interest lies in its
  choices, reversals, dialogue, secondary characters, and consequences.
- Major and minor storylines need an explicit editorial denominator. Raw source
  section counts, graph counts, and famous-moment lists cannot establish story
  completeness.
- One selected English edition can provide a coherent narrative spine, but it
  cannot silently become every Valmiki, Tulsidas, Kamban, Adhyatma, Jain,
  Buddhist, Southeast Asian, performance, oral, regional, or family telling.
- Modern place associations, temples, festivals, and rituals require their own
  current authorities. Narrative geography must not be presented as historical
  GIS.

### Engineering and performance risk

- The Atlas import has now moved behind a server compiler, and the compass is a
  separate client component. The combined bilingual story payload is bounded
  below 145 KB uncompressed and 35 KB gzip; adding complete scene copy or media
  to that eager payload would still be a regression, so later detail must load
  by arc and scene.
- `JourneyPlayer` still owns camera input, graph traversal, Sārthi, completion,
  persistence, and language. The compass must remain isolated, and the next
  large story feature should extract another stable responsibility rather than
  extending the player monolith.
- Story copy, journey stop metadata, scene connections, encounter mappings, and
  Atlas relationships still overlap in places. A larger corpus would multiply
  drift unless one compiled story-world contract becomes authoritative.

## Product model: one story moment, many ways in

The reusable authored unit is a **story moment**, not a source chapter and not
a generic graph node. Each moment has:

- a plain-language title and complete narrative scene in English and Hindi;
- an arc and stable sequence position;
- an arrival image, a decisive visual beat, and optional ambient/motion cues;
- the characters present and the character whose viewpoint is foregrounded;
- one or more narrative places, explicitly distinct from modern coordinates;
- what leads into the moment and what changes because of it;
- optional choices of where to travel next, without changing the source story;
- links to related moments, character paths, place memories, and living worlds;
- one selected-expression source boundary plus separately labelled variants;
- media rights, cultural review, uncertainty, and completion status; and
- compact preload metadata with deeper copy and media loaded only when opened.

The graph remains the relationship and retrieval layer underneath this unit.
The consumer sees story verbs such as “meets,” “promises,” “leaves,” “searches,”
“warns,” “remembers,” and “returns”—not ontology terms.

## Five seamless traversal modes

All modes open the same story moments and preserve one reversible history.

1. **Continue the story** — the coherent main sequence, with optional recap and
   the ability to skip forward or back.
2. **World map** — choose a narrative place, then see the ordered moments that
   happen, are remembered, or are told there. Modern-place information is a
   separately labelled layer.
3. **Character path** — follow one person's moments and relationships, then
   return to the exact main-story position.
4. **Threads** — follow promises, exile, kinship, search, alliance, duty,
   separation, return, or another human-readable story thread.
5. **Living connections** — cross from a story into a festival, performance,
   temple, art, or place. The destination leads with current information and
   provides an explicit return portal to the originating story moment.

There is one world and one back stack. These are camera and discovery lenses,
not separate websites or menus.

## Story presentation contract

Each opened moment uses progressive disclosure:

1. **Glance (2–5 seconds):** image, place, characters, and the decisive change.
2. **Scene (30–90 seconds):** three to seven visual beats with short narration
   or dialogue, designed for swiping/tapping rather than a prose wall.
3. **Explore:** character, place, preceding, consequence, and living-world doors.
4. **Go deeper:** longer retelling, variants, source evidence, and exact text.

The default screen never exposes a large paragraph, a source coordinate, or a
wall of relationship cards. It also never forces a visitor to consume the full
sequence before jumping elsewhere.

## Visual and world grammar

- The cosmic Atlas is the transition space between worlds; the epic itself is
  composed of distinct story biomes.
- A biome supplies sky, terrain, depth layers, ambient motion, palette, sound
  direction, and recognizable landmarks. It is not one static wallpaper.
- Reusable character portraits or silhouettes provide continuity, while key
  moments receive distinct illustrated tableaux. Devam-authored illustrations
  are labelled artistic visualizations and never passed off as historical
  images.
- Places accumulate “story echoes”: visually positioned doors to moments that
  occurred, were recalled, or were narrated there.
- Lines appear only when they clarify the visitor's immediate options. The
  whole graph is never drawn at once.
- Discovery rewards are story reveals and context, never spiritual scores,
  fabricated blessings, or grind mechanics.

## Completeness model

“Complete” must name a denominator. Ramayana story-world progress is reported
at four independent levels:

| Level | Meaning |
| --- | --- |
| Catalogued | a source section or externally identified story has identity, rights, and provenance |
| Story-ready | a reviewed English/Hindi retelling, characters, places, sequence, and evidence are present |
| Playable | the moment has visual beats, transitions, reverse navigation, and device acceptance |
| Living-connected | relevant modern places, festivals, performances, temples, or practices have current evidence and return paths |

The first narrative denominator is the 652-section selected Dutt English
electronic body already held and source-addressed. Editorial work must group
those sections into consumer scenes without omissions or invented joins, then
track every section as represented, intentionally backgrounded, or awaiting
review. Parallel tradition packs may add or challenge scenes; they never alter
the selected spine silently.

The MVP does not need 652 separate screens. It does need an auditable crosswalk
showing that no selected-expression section vanished merely because it was not
famous. Coverage claims are made per selected expression and story-world layer,
not for the whole Ramayana tradition.

## Lean implementation architecture

1. Introduce a versioned `DEVAM_STORY_WORLD_V1` contract and validator.
2. Compile lightweight per-world and per-arc manifests. Do not ship the global
   Atlas dataset to a journey client.
3. Split the current player into camera/world, story-stage, navigator, encounter,
   progress, and Sārthi modules before adding large content volume.
4. Load the current scene and its immediate neighbors first. Lazy-load deeper
   copy, distant arcs, high-resolution art, and source evidence.
5. Derive map, character, thread, and relationship indexes from the same story
   moments; do not hand-maintain duplicate arrays.
6. Preserve exact evidence in the compiled pack but render it only behind “Why
   this story is here.”
7. Measure field responsiveness; target p75 INP at or below 200 ms on both
   mobile and desktop, and keep interaction handlers independent of corpus size.

## Delivery sequence

### Gate 1 — contract and anti-bloat refactor

- define the story-moment schema and compiler;
- move Ramayana encounter data out of the global client Atlas import;
- split the journey monolith along stable responsibilities;
- add bundle, interaction, overflow, back-stack, and reduced-motion checks.

### Gate 2 — one dense story arc

Upgrade the existing road-home arc from seven summaries to seven complete
scenes, each with three to seven visual beats, character viewpoints, place
memories, consequences, and outward/return paths. This tests narrative depth
without pretending the entire epic is finished.

Current checkpoint: the seven scenes contain twenty-nine bilingual beats. Each
scene now owns a distinct cinematic tableau; changing scene no longer reuses art
that depicts another event. Each beat applies a lightweight focal crop, depth,
palette, and motion motif over its scene, and the player preloads only immediate
neighbour art to preserve continuity without eagerly loading the district. A
compiler-derived character/place index can return an encounter directly to
every playable moment in which it appears. The whole-story map now uses that
same graph to reveal all seven detailed scenes across five connected narrative
places, retaining whether each scene occurs at, arrives in, departs from,
remembers, or merely asks about the place. A visitor can enter an exact scene
from Nandigrama, Ayodhya, or another lit place and return to the same map context.
Character encounters now expose illustrated portals to every detailed scene in
which that character appears. Entering one of those scenes preserves the
character path as an explicit return portal; returning restores the same path
and marks the scene the visitor just entered. The portals are compiled from the
existing character-to-moment index and journey art, so this adds no parallel
character graph or duplicated story data.
The coronation scene now also proves one story-to-living-India crossing. Its
Diwali encounter states that Rama's return is one major North Indian story
association rather than a universal origin, then opens three separately
scoped current lanes: West India household Lakshmi Puja, Bengal Kali Puja
participation, and Tamil family-dawn Deepavali. The selected lane can continue
through a deliberately authored relationship trail and unwind to the exact
coronation scene. Living practice loads only when the encounter is opened and
only in the selected language; it is not copied into the eager story pack.
Every mapped orientation turn now derives a direct “illustrated world ready”
door to this playable district, so a visitor does not need to infer that the
seventh whole-story world contains the one currently visual slice.
Beat-specific tableaux, sound,
richer foreground animation, longer optional retellings, and observed user
comprehension remain open; Gate 2 is therefore not yet complete.

### Gate 3 — whole-epic story compass

Publish a reviewed high-level route from the beginning through return, with
map, character, and thread traversal. Every high-level moment links to its
coverage state, so thin areas are visible rather than disguised.

Current checkpoint: the selected 652-section Dutt expression is partitioned
exactly once into forty-nine source-addressed story turns across seven
ordinary-language story worlds. The interface reveals seven worlds first and
only the selected world's six to eight turns, avoiding a forty-nine-node wall.
Visitors can enter at any turn and move sequentially in either direction. Each
turn exposes place, character, and story-thread cues; source coordinates and
expression limits remain behind disclosure. Only the seven-scene road-home
turn is labelled playable. The other forty-eight are explicitly labelled
mapped orientation until their detailed scenes, visuals, and return paths are
reviewed. Character, narrative-place, and story-thread paths are now compiled
from those same forty-nine turns rather than maintained as a second graph. A
visitor can follow any repeated cue across story worlds, move within that path,
open another path, and unwind to the exact story point at which each detour
began. The Map lens now compiles thirty-one narrative places and the routes
between them from the same turns. It treats a repeated place as one temporal
nexus, reveals its ordered moments, supports bounded two-way pan and progressive
zoom, opens a chosen moment in the whole-story view, and restores the precise map
context on return. The road-home district's detailed scene cards are also
compiler-derived from existing journey moments and event-to-place graph
relationships rather than a parallel hand-authored map. Their relationship
wording remains visible to prevent a referenced place from being presented as
a scene setting. Its layout is explicitly schematic story geography—not
modern coordinates, archaeology, a travel route, or historical GIS. Richer
illustrated terrain, a separately sourced modern-place layer, reviewed living
connections, deeper scenes, and observed user comprehension remain open, so
Gate 3 is advanced but not complete.

### Gate 4 — selected-expression completion

Crosswalk all 652 Dutt sections into reviewed story moments and report the
denominator honestly. Add Hindi retelling and visual depth in demand order while
keeping English/Hindi coverage visible separately.

### Gate 5 — living India and variant worlds

Connect the completed spine to Ramlila, festivals, rituals, temples, arts, and
modern places through current, attributable information. Add separately named
Ramayana traditions where source and rights boundaries support them.

Current checkpoint: the first bounded route is playable from the road-home
story into Diwali and three distinct living-practice lanes. Bengal continues
from Kali Puja to Kalighat Kali Temple and then to a distinct Durga Puja
context; the shared place does not equate the festivals. Each lane is compiled
from its existing user-complete ritual pack and exposes only product guidance,
pack identity, source count, and pack hash—not source text. This proves the
reusable lazy portal and reversible history mechanics for one crossing. It does
not complete Diwali, Ramayana's living legacy, temple visitor information,
Ramlila, or Gate 5.

## Acceptance and adversarial review

Before each release checkpoint, review it from five angles:

- **ordinary visitor:** can I understand and enjoy the story without scholarly
  vocabulary or documentation?
- **narrative designer:** does every action reveal story, character, place, or
  consequence rather than another label?
- **cultural/source editor:** are expression, variant, belief, history, and
  modern fact boundaries visible when they matter?
- **game UX and accessibility:** can I move, skip, return, recover, and orient
  myself with touch, mouse, keyboard, reduced motion, and assistive technology?
- **performance/code quality:** did bundle size, long tasks, duplicated data,
  component complexity, or asset weight grow faster than playable value?

Do not replicate the grammar into other worlds until one dense Ramayana arc
passes observed-user comprehension and enjoyment testing. Automated acceptance
proves mechanics and regression safety; it does not prove engagement.

## Research anchors

- UNESCO describes Ramlila as Ramayana storytelling through a succession of
  scenes using narration, dialogue, song, and audience participation, with some
  traditions extending for a month:
  https://ich.unesco.org/en/RL/ramlila-the-traditional-performance-of-the-ramayana-00110
- GDC, *What Happened Here? Environmental Storytelling*, frames the environment
  and responsive systems as narrative devices that let the player actively
  infer story:
  https://www.gdcvault.com/play/1012696/What-Happened-Here-Environmental
- GDC, *Sparking Curiosity-Driven Exploration Through Narrative in Outer Wilds*,
  treats curiosity and player-determined discovery as progression:
  https://www.gdcvault.com/play/1027368/Independent-Games-Summit-Sparking-Curiosity
- GDC, *Building Non-linear Narratives in Horizon: Zero Dawn*, addresses deep
  story systems built for open-world freedom:
  https://gdcvault.com/play/1024158/Building-Non-linear-Narratives-in
- web.dev defines good Interaction to Next Paint as 200 ms or less at p75,
  measured separately for mobile and desktop:
  https://web.dev/articles/inp

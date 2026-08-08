# MVP experience design

## Experience thesis

Devam should open as a world, not as a dashboard. The first screen makes the breadth of the civilization emotionally legible; Sarthi makes it personally useful. Search remains immediately available without turning the experience into a database UI.

The MVP’s visual prototype is named **The Living Atlas at Dusk**: a richly layered civilizational cosmos using deep indigo, mineral blue, burnished gold, vermilion, manuscript ivory, atmospheric light, and restrained movement. A star-filled night and faint nebular depth make each node feel like an entry into the wider universe of Indian mythology, religion, culture, and wisdom. It should feel sacred and cinematic without becoming loud science fiction, imitating a temple interface, or resembling a children’s game.

## Information architecture

- **Atlas** — free exploration across place, time, story, deity, festival, practice, and source.
- **Today** — deterministic Panchang facts and relevant observances for the user’s location/tradition.
- **Journeys** — curated narrative or practice paths.
- **Challenges** — mission-based exploration and optional real-world activities.
- **Library** — exact sources, passages, articles, variants, and search.
- **Sarthi** — a persistent companion available from every context.

The navigation vocabulary stays stable on desktop and mobile. Mobile changes presentation—not concepts.

## First prototype screen

The initial Atlas view contains:

1. a full-bleed layered map-world with a subtle time dimension;
2. four visually dominant hero gateways: Ramayana, Ganesha, Durga, and Diwali/Deepavali;
3. smaller connected nodes that communicate breadth without explaining familiar concepts through taglines;
4. a “Today” observance ribbon grounded in location;
5. a time rail for moving across eras;
6. a compact persistent Sarthi presence; and
7. one clear invitation to begin a journey.

The first prototype deliberately avoids final sacred iconography. Hero nodes use landscape, architecture, objects, light, and symbolic motifs until the deity/character design bibles are approved.

## Spatial navigation and relationships

The Atlas is a navigable world, not a fixed illustration. Desktop supports wheel zoom, double-click zoom, drag-to-pan, and visible zoom controls. Touch supports pinch, double-tap, and one-finger pan. The same scene hierarchy and reveal rules apply across screen sizes.

Relationships use progressive disclosure:

- the overview shows only a restrained set of faint, organic connectors;
- selecting a node illuminates its immediate relationships;
- connected nodes have a smaller visual mass than world-level gateways;
- additional nodes and edges appear at closer zoom levels; and
- the complete graph is never rendered as an indiscriminate hairball.

Lines indicate that an authored, evidence-bearing relationship exists. Their eventual labels and destination content come from the knowledge layer; decorative proximity alone does not assert a factual connection.

## Core journeys

### 1. Guest discovery

Open Atlas → explore two nodes → open a short Sarthi exchange → encounter a graceful account gate that explains saved progress, personalization, and full access.

### 2. “What should I do today?”

Open Today → confirm city and tradition if needed → see deterministic tithi/observance → choose minimum, standard, or elaborate practice → ask Sarthi a follow-up → save or begin.

### 3. Hero-world exploration

Enter the Ramayana, Ganesha, Durga, or Diwali/Deepavali gateway → see the coherent primary journey → branch into place/story/ritual/source nodes → surface variants only when relevant or requested.

The first implemented journey layer is deliberately bounded: seven book
openings for one exact Sanskrit Ramayana carrier, four milestones in one CC0
Ganesha hymn, four boundaries across the embedded Devīmāhātmya sequence, and
a six-stop Diwali/Deepavali path that preserves distinct festival and regional
lanes. It proves navigation, citations, rights-aware excerpts, and challenge
progress. The Diwali path currently has only one complete-in-scope household
practice lane; it does not flatten Lakshmi Puja, Kali Puja, South Indian
Deepavali, Jain Diwali, Bandi Chhor Divas, or other traditions into one generic
festival. None of these bounded paths replaces the fuller story, place, ritual,
source, and variant journeys required for its hero universe.

### 4. Personal guidance

Open Sarthi from any node → converse naturally → use active node, memory, retrieved sources, and tradition context → show concise guidance → optionally expand evidence and alternative interpretations.

### 5. Exact knowledge retrieval

Search a name, passage, ritual, place, or question → distinguish exact sources from Devam synthesis → filter by language, work, edition, tradition, geography, and time → open the passage in context.

## Interaction rules

- Exploration is one-thumb usable on good smartphones and spacious on desktop.
- The map supports pan/zoom, but every important destination is also keyboard/screen-reader reachable through node buttons and explicit zoom controls.
- Motion communicates depth and connection; it never blocks reading or causes decorative noise.
- Motion has three premium presentation modes: Cinematic is the full default experience; Gentle honors the device's reduced-motion preference with static atmosphere and direct movement; Still pauses ambient motion. A user's explicit choice is retained and can override the inferred default.
- Sarthi answers are compact. Evidence is expandable, not continuously displayed.
- Alternative traditions remain available in the background and surface only when relevant.
- Progress language is exploratory (“places visited”, “threads discovered”), never spiritual scoring.
- Guest journey and challenge progress is device-local until account-owned,
  inspectable progress storage is implemented.
- Variable bandwidth changes image resolution and prefetching, not the information architecture.

## Responsive behavior

### Desktop

Atlas occupies the full viewport. Navigation is a slim left rail, context appears in a floating bottom band, and Sarthi opens as a right-side conversational layer without leaving the world.

### Mobile

Atlas remains full-screen. Navigation becomes a four-item bottom bar plus a distinct Sarthi orb. Node details and conversation use draggable sheets. The time rail becomes a compact era selector. Large cinematic assets load progressively.

## Prototype review questions

The first review should decide:

1. Does the world feel premium, mature, Indian, and distinctive?
2. Is the Atlas immediately understandable without feeling like a conventional map app?
3. Is Sarthi present enough to feel central without obscuring exploration?
4. Are the four hero gateways—Ganesha, Durga, Ramayana, and Diwali—emotionally compelling and clearly differentiated?
5. Does the mobile composition retain the sense of wonder?

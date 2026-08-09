# Living Atlas connected-world model

## Product promise

The Living Atlas is not a menu drawn as a graph. It is a navigable cultural
universe in which a person can begin with any compelling star—a character,
deity, story, festival, place, temple, ritual, text, historical figure, art
form, kingdom, idea, or living community—and keep discovering meaningful ways
outward.

The unit of play is a **source-explainable path**:

> from this world → by this kind of relationship → to that world → because of
> this attributable evidence and scope.

Screen proximity is never evidence. A line is not published merely because two
subjects are popularly associated. Every product edge retains its relation
meaning, source coordinate or citation, edition/tradition/region scope where
needed, rights lane, and uncertainty boundary.

This model is informed by the event- and relationship-centred approach of the
[CIDOC Conceptual Reference Model](https://cidoc-crm.org/), an ISO cultural
heritage ontology for integrating people, places, things, events, periods, and
their explicit relations. Devam does not claim one-to-one CIDOC conformance;
the standard is a semantic design reference while Devam preserves the finer
textual, ritual, tradition, and authority boundaries its subject requires.

## The universe, not one example chain

Ramayana → Diwali → Kali Puja → Durga → Durga Puja is a useful playable route,
but it is not the schema. The same system must support paths such as:

- character → participates in story event → occurs in narrative place;
- text or edition → narrates episode → involves character;
- festival → remembers story → honours deity or form;
- ritual → belongs to observance → uses material under a scoped practice;
- temple → enshrines form → is located in place → participates in pilgrimage;
- king or dynasty → rules polity → sponsors temple, text, art, or public event;
- teacher or school → interprets text → develops idea → influences practice;
- art form → performs story → belongs to community → changes through history;
- historical movement → popularizes public festival → shapes city culture;
- lunar or solar coordinate → hosts observance while remaining distinct from it;
- named form → appears in source → connects to iconographic attributes without
  silently importing every later story.

The graph can therefore grow toward the vastness of Indian mythology, history,
culture, and wisdom without forcing every relationship into `related_to` or
claiming that the selected product scope is civilizational completeness.

## Node families

The display label may stay natural and specific, while the data layer preserves
a normalized family for filtering, layout, validation, and later inference.

| Family | Examples | Important boundary |
|---|---|---|
| Being and person | deity, goddess form, character, sage, king, teacher, artisan | textual figure, theological identity, and historical person are not silently merged |
| Event and story | birth account, exile, alliance, battle, return, revelation | every event remains telling/edition/tradition scoped when required |
| Place and polity | city, temple, river, forest, kingdom, pilgrimage circuit | narrative geography, living place, archaeology, and modern borders stay distinct |
| Time and observance | tithi, season, festival, vrata, anniversary, campaign | a calendar coordinate does not authorize a ritual or collapse coincident festivals |
| Practice and material | puja, reading, procession, offering, food, craft, image lifecycle | household, temple, public, initiated, and participant authority remain separate |
| Source and expression | work, chapter, passage, edition, translation, commentary, performance | work, version, edition, representation, and Devam synthesis retain identity |
| Institution and community | lineage, sampradaya, sangh, trust, mandal, guild, dynasty | scope and authority are attributable rather than universalized |
| Idea and wisdom | dharma question, philosophical concept, value, practice reflection | Devam synthesis remains evidence-linked, counterexample-aware, and non-oracular |
| Art and cultural expression | sculpture, painting, music, dance, theatre, architecture, festival installation | object, style, maker, performance, and living community retain provenance |
| Historical process | patronage, transmission, translation, reform, public movement, migration | later history is not retrojected as ancient origin |

## Relationship families shipped in the Atlas

The current client and hosted projection normalize every visible edge into one
of eleven families. The wording remains specific; the family controls visual
language and traversal behaviour.

| Relationship family | Player meaning | Examples |
|---|---|---|
| Story path | something happens or a narrative advances | exile sends Rama into the forest; return opens a North Indian Diwali association |
| Festival bridge | observances meet, diverge, or open one another | Diwali and Bengal Kali Puja share a night but remain distinct festivals |
| Living practice | a scoped action, material, or ritual lifecycle connects worlds | Ganesh Chaturthi to temporary murti care and farewell |
| Source trail | a text, passage, edition, or translation supports the destination | Atharvashirsha unit 9 depicts one Ganesha form |
| Place route | a story, tradition, institution, or event leads into a place | Durga Puja to Kolkata public art and worship |
| Family bond | a source-bounded kinship route | Atharvashirsha unit 10 names Ganesha as Shiva's son |
| Form and identity | names, forms, manifestations, and symbols connect without forced equivalence | Ekadanta to the one-tusked form; Kali Puja toward distinct Shakta goddess worlds |
| Time path | a lunar, solar, seasonal, or campaign coordinate links distinct events | some Ganeshotsav closings touch Ananta Chaturdashi |
| History route | transmission or social change connects older and newer worlds | the official Maharashtra account's 1893 public Ganeshotsav turn |
| Idea path | a text or experience opens a teaching or conceptual pattern | Atharvashirsha unit 5 to the five elements it names |
| Connected world | a deliberately broad association awaiting a more specific reviewed predicate | used only when the evidence does not justify a narrower relation |

New reviewed edges should declare a family explicitly. The deterministic legacy
classifier exists only so the already published Atlas remains usable while its
older relationships are progressively made explicit.

## Graph assertion contract

Every production relationship should be reconstructable as:

```text
subject
  + relation wording and normalized family
  + object
  + source passage, retained pack, or citation-only official source
  + work/version/edition/tradition/region/time scope
  + rights lane
  + confidence or uncertainty boundary
  + publication state
```

For source-derived claims, the preferred implementation remains the shared
Supabase/Postgres source → passage → claim → relationship model. Atlas nodes and
edges are a reviewed projection of that evidence graph, not an independent
mythology database. Citation-only current sources may support concise public
context, but Devam does not copy their prose or represent their response hash as
a retained source object.

## Exploration and game loop

The core loop is designed for a phone- and game-literate audience:

1. **Notice** a luminous landmark and nearby paths.
2. **Approach** through continuous pan, zoom, pinch, keyboard, or path travel.
3. **Reveal** more detailed satellites as depth increases.
4. **Choose a route** by its human meaning: Story, Festival, Place, History,
   Form, Practice, Source, Time, Family, or Idea.
5. **Receive a short payoff**: a story beat, visual identity, surprising
   connection, or actionable but bounded participation cue.
6. **Continue**, including across hero-world boundaries, without being thrown
   into a static article page.
7. **Ask Sārthi** only when desired; the conversation inherits the current node
   and should explain the route or offer a next destination with evidence.

Source, edition, rights, variants, and uncertainty are progressive disclosure:
always preserved and one gesture away, but never allowed to dominate the first
moment of discovery. A route may be entertaining and emotionally vivid without
becoming vague, universal, or invented.

## Level of detail

- **Universe level:** only master worlds and the strongest cross-world bridges.
- **World level:** story arcs, major figures, places, festivals, texts, and
  historical movements around the selected gateway.
- **Constellation level:** named forms, episodes, practices, material culture,
  places, and source doors.
- **Encounter level:** a short scene, illustrated story beat, interactive
  comparison, practice choice, map moment, or exact passage.
- **Evidence level:** source identity, passage coordinates, variants,
  uncertainty, rights, and why the connection is safe to publish.

The camera must remain reversible at every level. Focusing a node may reframe
the view, but it must never trap the player, disable panning, or make an outer
constellation unreachable.

## Current Ganesha connected-world pilot

The first implementation adds thirteen reviewed discovery nodes and nineteen
source-addressed routes without inventing Ganesha Purana stories that the
current untranslated carrier cannot safely support.

The pilot opens three playable strands:

- **Text → form → symbol:** Atharvashirsha units 9-10 lead through the
  one-tusked form, mouse emblem, eight-name constellation, Ekadanta, Lambodara,
  Vighnanashin, and a source-bounded Shiva kinship bridge.
- **Text → cosmos → idea:** unit 5 leads from the world-in-Ganesha description
  to the five elements it explicitly names, without inferring a complete
  philosophical school.
- **Festival → history → living culture:** the reviewed Ganesh Chaturthi pack
  leads to the official Maharashtra account's 1893 public turn, community
  pandals, clay and craft, modak and shared naivedya, the temporary image
  lifecycle, and the chosen-day farewell.

The untranslated Ganesha Purana remains an exact structural source door. The
internal-only Mudgala Purana carrier remains unserved. Neither is used to create
unsupported consumer story nodes.

## First living-culture travel constellations

The next implementation proves that the same model can move beyond a deity or
epic character graph into living performance, makers, materials, sound, public
art, community, place, and festival time. It adds ten destinations and sixteen
explicit routes supported by citation-only official UNESCO heritage pages:

- **Epic → performance → community:** Ramayana opens Ramlila, then audience
  participation, roles, narration, masks, costumes, effigies, and lights.
- **Text → performance:** Ramcharitmanas opens a major Ramlila text tradition
  without becoming the only script, edition, or performance source.
- **Performance → place → city:** Ramlila opens Ramnagar and the wider
  Benares/Kashi cultural geography without collapsing their identities.
- **Performance → festival time:** Ramlila opens the Dussehra season and a
  carefully bounded cross-world route toward Shardiya Navaratri.
- **Worship → public art:** Kolkata Durga Puja opens collaborative artists,
  designers, installations, pavilions, drumming, and city-scale participation.
- **Maker → material → return:** Kumartuli workshops open the unfired-clay
  image lifecycle, temporary public presence, and seasonal return without
  supplying image-making, ritual, crowd, river, or immersion instructions.

These sources are not copied into the vault. Search and Sarthi return Devam
paraphrases with citation-only metadata and no quotation. The pattern is a
template for future routes through theatre, dance, music, architecture, craft,
pilgrimage, dynasties, teachers, communities, and historical transmission.

## Hampi-Kishkindha-Vijayanagara place-history constellation

The first place-history implementation proves that one continuous game route
can cross different kinds of truth without flattening them. It adds thirteen
destinations and eighteen official-source, citation-only routes:

- **Narrative place -> living belief:** the selected Ramayana Kishkindha
  story-world opens a present Anegundi-Anjanadri association, explicitly
  labelled as living belief rather than historical proof.
- **Living settlement -> physical landscape:** Anegundi and Anjanadri open the
  Tungabhadra river-and-boulder basin without turning a modern place tradition
  into literal epic cartography.
- **Landscape -> archaeology -> capital:** the basin opens UNESCO Hampi and the
  material systems of the Vijayanagara capital, while narrative Kishkindha and
  the attested medieval city remain distinct entities.
- **Capital -> empire -> ruler:** the capital opens the wider Vijayanagara
  polity and Krishna Deva Raya as a historically attested ruler, not an epic
  kingdom or mythic king.
- **Heritage -> living temple:** Hampi opens Virupaksha as both a monumental
  site and a continuing Shiva pilgrimage centre whose religious authority is
  not replaced by heritage documentation.
- **Architecture -> object:** the Vitthala complex and stone chariot are
  encounters inside a broader built, sacred, civic, hydraulic, and landscape
  system rather than isolated tourist icons.
- **Capital -> rupture -> archaeological horizon:** the 1565 Talikota rupture
  opens conquest, pillage, abandonment, survival, memory, and archaeology
  without becoming a single-cause history of imperial decline.

Search and Sarthi serve concise English and Hindi Devam syntheses with links to
the official UNESCO and Karnataka Tourism pages. Their source prose is neither
copied nor represented as a retained source original. No node supplies live
travel, access, safety, conservation, temple, or ritual authority.

The associated interaction tranche adds a compact wayfinder, a seven-stop
travel trail, one-action backtracking, named depth levels, distinct node-family
silhouettes, zoom-compensated landmarks, and a brief warp cue. These are the
minimum reusable game systems for later worlds; the constellation is a proof of
the scalable pattern, not the intended breadth ceiling.

## Kolkata-Kalighat-Dakshineswar Shakta constellation

This tranche replaces three unsourced shortcut relationships with a playable
network of twelve destinations and twenty official-source routes. It proves
that a festival connection can open many kinds of cultural world instead of
ending at another deity label:

- **Kali Puja -> living places:** the festival opens Kalighat and
  Dakshineswar/Shyama Puja as distinct temple worlds, not interchangeable
  examples of one universal practice.
- **Temple -> form -> text comparison:** Kalighat's living temple form can be
  compared with the pinned Devimahatmya Kalika passage without asserting
  identity, origin, hierarchy, ritual authority, or equivalence.
- **Shared place -> distinct festival:** Kalighat connects Kali Puja and Durga
  Puja because an official place account names both contexts; their calendars,
  stories, forms, procedures, and participant authorities remain separate.
- **Temple edge -> art -> makers:** the Kalighat route continues into painting,
  urban visual culture, and patua maker history rather than treating art as
  decorative background or anonymous content.
- **Temple -> patron -> religious figure:** Dakshineswar opens Rani Rashmoni's
  documented patronage and Ramakrishna's institutionally documented temple
  association as historical routes whose larger biographies and devotional
  claims still need their own evidence.
- **One complex -> other worlds:** Dakshineswar's Shiva temples and
  Radha-Krishna temple create cross-world routes to Shiva and Krishna without
  making a local dedication stand for complete Shaiva or Vaishnava traditions.

Search and Sarthi return bilingual Devam paraphrases with citation-only links
to official tourism, temple, and Ramakrishna Math pages. Source prose is not
retained or quoted. Temple authority, institutional belief, art attribution,
community testimony, ritual guidance, current schedules, access, and visitor
safety stay outside what these overview citations prove.

## Expansion order

Expansion is demand-driven by enjoyable journeys, not raw node counts:

1. close missing hero-world story and character paths with product-cleared,
   source-aligned English/Hindi narrative evidence;
2. connect places, temples, festivals, rituals, arts, and history around those
   stories;
3. create encounter-level visual and interactive payoffs;
4. connect exact Search and Sārthi to the same graph assertions;
5. add long-tail source, edition, region, language, and variant worlds without
   flattening them;
6. benchmark retrieval and traversal before considering a native graph database.

The universe may expand indefinitely. Product counters always describe the
selected reviewed projection; they never claim that Indian civilization or its
traditions are complete.

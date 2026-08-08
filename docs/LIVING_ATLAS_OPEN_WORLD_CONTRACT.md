# Living Atlas open-world product contract

## Product promise

The Living Atlas is not a menu drawn as a graph. It is a continuously explorable
cultural universe in which a person can approach a luminous landmark, discover
people, stories, places, festivals, practices, texts, polities, temples and ideas,
and follow a meaningful path into another world without returning to a dashboard.

The current Ramayana → Diwali → Kali Puja → Durga → Durga Puja path is an
acceptance route through this system. It is not the scope or ontology of the
universe. The product must expand across Sanatana Dharma, Indian culture,
history and wisdom while preserving the source, tradition, region, time,
edition, rights and uncertainty boundary of every connection.

## World model

Devam keeps the authoritative semantic layer in Supabase/Postgres. The Atlas is
a visual projection of reviewed entities, events, claims and relationships, not
a second source of truth and not a reason to add a native graph database before
benchmarks require one.

The open-world entity vocabulary includes:

- divine beings and named forms;
- people, characters, teachers, poets, patrons and communities;
- stories, episodes, events and narrative cycles;
- works, passages, commentaries, performances and visual traditions;
- festivals, observances, ritual actions and living practices;
- places, landscapes, pilgrimage routes, temples and institutions;
- kings, dynasties, kingdoms, courts and historically bounded polities;
- concepts, teachings, virtues, dilemmas and reviewed wisdom patterns; and
- objects, images, architecture, music, dance and material culture.

Entity type does not decide historicity. A character in a textual narrative, a
historically attested ruler and a living deity-form may all appear in the Atlas,
but their evidence and interpretive status remain different and visible.

## Relationship contract

Every traversable edge must be directional where direction matters and carry:

- a stable relationship kind and consumer label;
- evidence through a claim, source passage or reviewed official/current record;
- tradition, geography and time applicability where material;
- confidence, conflict or variant status where material;
- rights and publication state; and
- a short boundary explaining what the edge does not establish.

Relationship families include:

| Family | Examples | Boundary requirement |
| --- | --- | --- |
| Narrative | appears in, contains episode, journeys to, battles, receives boon from | Never silently turn a textual event into an unqualified historical claim. |
| Festival | associated story, observed on, includes observance, regional form, same calendrical night | Do not present one regional story or practice as the origin or meaning of every form. |
| Ritual | invokes, offers to, performed at, participant step, priest-led step | Applicability and authority must remain explicit; a relationship is not permission to prescribe. |
| Place | located at, pilgrimage route, living centre, associated landscape | Distinguish textual geography, historical evidence, present-day place and devotional identification. |
| Historical | ruled by, capital of, patronized by, commissioned by, succeeded by | Require historically appropriate evidence, dates and uncertainty. |
| Textual | commentary on, translation of, retelling of, cites, variant of | Preserve work, expression, edition, language and source identity. |
| Conceptual | exemplifies, contrasts with, interpreted as, applied by | Attribute interpretation and retain counterpositions; never masquerade synthesis as source text. |

“Related to” is not an acceptable stored relationship kind. The consumer may see
gentle language, but the underlying connection must be precise enough to test,
source and reverse.

## Exploration grammar

The Atlas uses progressive levels of detail rather than showing a civilizational
hairball at once:

1. **Cosmos:** a small number of luminous constellations and surprising bridge
   paths invite direction without implying that the visible set is complete.
2. **World:** major people, places, stories, festivals and texts appear around a
   selected landmark.
3. **Region:** connected clusters reveal local routes, named relationships and
   neighboring worlds as the camera approaches.
4. **Scene:** a story, journey, ritual or historical episode becomes a spatial
   playable sequence with visual terrain, choices and continuity.
5. **Evidence:** exact sources, editions, variants, uncertainty and rights are
   available without forcing the casual explorer into an article layout.

The repeatable player loop is: see a landmark → approach → reveal a local world
→ choose a relationship → travel through a visual transition → arrive with
context preserved → discover the next set of paths. Search may teleport the
camera to a result; Sarthi may illuminate or recommend a path, but neither
replaces spatial exploration.

## Camera and interaction acceptance

- The full viewport is the playable surface on desktop and phone.
- Drag may start on empty space or directly on a node without breaking a click.
- Pan, wheel zoom, pinch zoom, double tap, keyboard travel and reset remain
  available at every depth.
- Bounds keep some recoverable part of the world in view; no movement can strand
  the player below, above or beside the scene.
- Focusing a node centers it within a reversible camera range.
- Connections are not truncated merely because a node is highly connected.
- Reduced motion, keyboard access and readable labels are maintained.

## Art and narrative direction

Each world needs a recognizable visual identity, depth layers, atmospheric
motion and scene-to-scene travel. Original visual assets are product media, not
evidence. Devam retellings use everyday English and Hindi for the MVP and are
explicitly labelled as retellings; exact source text, translation identity and
edition boundaries stay separate.

The product avoids spiritual scoring, combat imitation and false gamification.
Fun comes from movement, revelation, meaningful connections, collection of
discovered paths and the feeling that another world is always nearby.

## Expansion method

Expansion is demand-driven and source-grounded:

1. choose a user journey or bridge with high exploration value;
2. identify the entities, events and typed relationships it requires;
3. bind each claim to retained or newly acquired lawful evidence;
4. review tradition, region, time, rights and uncertainty boundaries;
5. publish only the cleared projection to the Atlas; and
6. add browser acceptance for the complete travel route.

Priority expansion continues from the four hero worlds into their real adjacent
worlds: Ayodhya and other Ramayana geographies; characters and episodes; Diwali's
regional and religious constellations; Bengal Shakta festival worlds; Durga Puja
places, arts and living practices; Ganesha stories, temples and festivals; and
the September–December ritual/calendar layer. This sequence is a product
priority, not a completeness claim.

## Current denominator

The current reviewed Atlas seed contains 4 gateways, 50 world nodes and 62
navigation edges after the first evidence-bounded bridge path. These counts
describe selected MVP product scope only. They do not measure the size or
completeness of Indian mythology, history, culture, wisdom or living practice.

## External modeling references

- CIDOC CRM provides an event-centric, extensible cultural-heritage framework
  for integrating museum, library and archive information: <https://cidoc-crm.org/>.
- UNESCO's Durga Puja record describes the Kolkata festival as a living annual
  combination of worship, public art and community participation:
  <https://ich.unesco.org/en/RL/durga-puja-in-kolkata-00703>.
- The Metropolitan Museum's Kali material demonstrates why Kali, Durga, textual
  traditions, regional festival practice and visual culture need connected but
  non-equivalent modeling:
  <https://www.metmuseum.org/perspectives/household-gods-kali-lithography>.
- Regional and religious plurality around Diwali is reflected in the Asian Art
  Museum overview: <https://asianart.org/cultural-celebrations/celebrate-diwali/>.

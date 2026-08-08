# Deterministic Panchang engine

## Implemented boundary

`POST /api/panchang` accepts one exact civil date, latitude, longitude, IANA
timezone, and tradition code. It returns:

- local-date sunrise and following sunset in UTC;
- local-date moonrise and moonset when those events occur on the civil date;
- vara;
- tithi, nakshatra, yoga, and karana at sunrise, including their next transition;
- sidereal solar rashi at sunrise and the next solar-ingress instant;
- Rahu Kalam, Yamaganda, Gulika, Brahma Muhurta, and Abhijit Muhurta windows.

The calculation is deterministic and versioned as
`astronomy-engine-2.1.19-lahiri-v3`. Astronomy Engine provides the solar/lunar
model. Sidereal longitude uses Devam's replaceable
`lahiri_mean_linear_v1` approximation. The source implementation is
`apps/web/src/lib/panchang/engine.ts`.

## Evidence and verification

The engine has unit and API-route tests. The 2026-09-14 Mumbai fixture checks the
published Ganesh Chaturthi tithi boundary and independently observed Chitra and
Brahma transitions. A Hyderabad fixture checks sunrise, sunset, and the same
limbs at a second location. The complete 122-day launch interval is exercised at
one Indian reference location. A regression fixture also proves that the
thirtieth tithi is labelled Amavasya, rather than reusing the Purnima label.
Determinism and the calculation-only response boundary are tested directly.
The 2026-10-29 Delhi Karwa Chauth fixture checks a published 8:17 PM moonrise;
the engine returns 8:12 PM, inside the explicit seven-minute MVP tolerance.
Because lunar rise/set times drift across midnight, `moonriseUtc` or `moonsetUtc`
can correctly be null on a local civil date.

The four launch-window sidereal ingresses are fixture-tested for Delhi against
the independently fetched 2026 Sankranti calendar: Kanya on September 17, Tula
on October 17, Vrishchika on November 16, and Dhanu on December 16. The normal-
TLS response was 90,435 bytes with SHA-256
`15d049ee3cb905590df6a43d5b67c10087300c8554423c0121c26e1c60b4cd6b`.
The calculated ingress instants stay within the explicit ten-minute MVP
tolerance of the four published moments.

Astronomy Engine is MIT-licensed. Its upstream project states an accuracy target
within one arcminute and validation against NOVAS/JPL Horizons:
https://github.com/cosinekitty/astronomy

The Mumbai Ganesh Chaturthi reference is:
https://www.drikpanchang.com/festivals/ganesh-chaturthi/ganesh-chaturthi-date-time.html?geoname-id=1275339&year=2026

## Explicit non-claims

This layer does not yet decide whether a festival or vrata belongs to a civil
date. Outside the bounded rules listed below, it does not implement general
sunrise-versus-midday-versus-moonrise precedence,
kṣaya or vṛddhi tithi handling, multi-day festival selection, adhika masa,
regional calendar variants, sampradaya rules, or a ritual procedure. The
tradition code is preserved in the request but does not yet change the result.

The mean Lahiri implementation is an MVP approximation, currently checked only
against bounded contemporary fixtures. It must be expanded against a broader
reference corpus before historical-calendar claims or a public accuracy promise.
Sarthi must never turn this calculation-only response into unsourced observance
or ritual advice.

A solar ingress is an astronomical fact, not by itself a complete Sankranti
observance decision. Punya-kala assignment and regional procedures remain in
the separate rules/practice layers.

## Bounded observance rules

`POST /api/observances` now consumes the unchanged astronomical layer and can
evaluate a growing set of deliberately narrow 2026 resolution records:

- Ganesh Chaturthi for the West India Smarta fixture, using Shukla Chaturthi
  overlap with madhyahna;
- separate Smarta and ISKCON Krishna Janmashtami lanes for the bounded Delhi
  fixture, each requiring a unique Krishna Ashtami overlap with local Nishita.
  Rohini overlap remains explicit diagnostic evidence, and the shared 2026 date
  does not collapse the two rules or all Vaishnava traditions;
- Kanya, Tula, Vrishchika, and Dhanu Sankranti as the India Standard Time civil
  dates containing their deterministic ingresses, plus a separate Bengal
  regional Vishwakarma Puja record tied only to Kanya and independently
  corroborated by the official West Bengal calendar;
- Hartalika Teej for the bounded Delhi North/West Smarta fixture, selecting the
  later candidate sunrise bearing Bhadrapada Shukla Tritiya. It remains a
  separate observance from Ganesh Chaturthi and does not generalize into a
  South Indian Gowri Habba procedure;
- Rishi Panchami for the bounded Delhi North/West Smarta fixture, requiring a
  unique candidate madhyahna with Bhadrapada Shukla Panchami. If both days
  qualify, the source's competing earlier/later opinions remain unresolved and
  the rule fails closed;
- Radha Ashtami for the bounded Delhi ISKCON fixture, choosing the candidate
  with greater Bhadrapada Shukla Ashtami overlap during madhyahna. It remains
  distinct from the same-day Masika Durgashtami record and does not generalize
  to all Vaishnava or Smarta traditions;
- Ananta Chaturdashi for the West India Smarta fixture, using Bhadrapada Shukla
  Chaturdashi in madhyahna. It provides the bounded 2026 Ganeshotsav closing
  date without conflating Ananta-vrata with Ganesh Visarjan or prescribing one
  mandatory murti-stay duration;
- four monthly Sankashti Chaturthi records for September-December, using Krishna
  Chaturthi at moonrise. A two-day moonrise tie remains unresolved because the
  fixed source preserves competing earlier/later opinions; if neither day
  qualifies it selects the later day as directed by the source;
- the Bhadrapada, Ashwina, and Kartika named Purnima calendar-day lanes plus all
  four named lunar-month Amavasya lanes, using the fixed source's later-day,
  non-Chaturdashi-contaminated precedence. Purnima Vrata, Darsha Amavasya,
  shraddha applicability, and special-festival lanes remain separate;
- Kojagara Puja/Sharad Purnima as a separate Ashvina Purnima-at-local-Nishita
  night lane. The resolver recomputes the eighth of fifteen equal night
  muhurtas from local sunset to the following sunrise and requires exactly one
  candidate night to overlap Purnima. It does not merge the October 25 night
  observance into the October 26 sunrise-based Ashwina Purnima calendar day;
- four Masika Shivaratri records for September-December, using the fixed
  source's explicit pradosha/nishita precedence matrix. Each candidate binds
  the complete sunset-to-next-sunrise night, the bounded pradosha interval, and
  a two-ghati nishita interval; unproved ties fail closed;
- four Masika Durgashtami records for September-December, using the fixed
  source's Shukla Ashtami later-day rule at local sunrise. The Ashwina record
  remains a monthly date identity alongside the hero-season calendar; it does
  not import a fasting, household-worship, or Bengal Durga Puja procedure;
- all eight twice-monthly Pradosha records for September-December in the Delhi
  North/West Smarta fixtures, requiring exactly one candidate evening to have
  Trayodashi overlap with the bounded sunset-to-144-minute window. The fixed
  source supplies only general naktavrata timing/conflict context here; the
  observance-specific rule and date fixtures are explicitly attributed to the
  current practitioner reference. Both-overlap and neither-overlap cases fail
  closed;
- Shardiya Navaratri's first day for the North/West India Smarta fixtures, using
  Shukla Pratipada at sunrise;
- Vijayadashami for the North/West India Smarta fixtures, using Dashami overlap
  with aparahna;
- Karwa Chauth/Karaka Chaturthi for the North/West India Smarta fixtures, using
  Krishna Chaturthi at local moonrise and the source's earlier-day tie rule;
- Ahoi Ashtami/Ahoi Aathe for the bounded Delhi North India Smarta fixture,
  requiring a unique Krishna Ashtami overlap with local pradosha. The date rule
  preserves separate star- and moon-sighting family variants and supplies no
  muhurta, fasting, medical, sons-only, mothers-only, or outcome claim;
- Govatsa Dwadashi/Vasu Baras for the North/West India Smarta fixtures, using
  Krishna Dwadashi at pradosha and the source's earlier-day tie rule;
- Dhantrayodashi/Dhanteras as a separate North/West India Smarta date lane,
  requiring a unique candidate evening with Krishna Trayodashi in Devam's
  bounded pradosha window. The current practitioner fixture supplies the
  identity and date rule; its narrower puja interval additionally requires
  Sthir/Vrishabha Lagna and is not reproduced by the engine;
- Yama Deepam/Yama Deepa Dana for the North/West India Smarta fixtures, using
  Krishna Trayodashi overlap with pradosha and keeping it distinct from the
  independently resolved Dhantrayodashi date lane and still-open ritual lanes;
- Diwali Lakshmi Puja for the North/West India Smarta fixtures, using Amavasya
  overlap with a bounded post-sunset pradosha decision window;
- Jain Diwali/Mahavira's liberation as a bounded umbrella lane using the
  greater Amavasya overlap in pradosha while retaining 9 November Nirvan or
  Digambar and 10 November New Year community-calendar variants separately;
- Bandi Chhor Divas as an exact SGPC lane using the official 23 Kattak date
  mapped by that calendar to 8 November 2026. Hindu tithi and pradosha are
  contextual metadata only, not Sikh observance authority;
- Bengali Kali Puja/Shyama Puja as a separate Bengal Shakta night lane,
  requiring a unique candidate civil night with Kartika Amavasya overlap at
  locally recalculated Nishita. The Kolkata practitioner fixture and official
  West Bengal calendar validate the identity/date; this is not a Kali Puja
  procedure or an alias for Lakshmi Puja; and
- Maharashtra Naraka Chaturdashi for the bounded West India Smarta fixture,
  requiring unique full Krishna Chaturdashi coverage from local pre-sunrise
  moonrise to sunrise and remaining separate from Kali Chaudas and Tamil
  Deepavali;
- Tamil Deepavali/Naraka Chaturdashi as a separate South India Smarta lane,
  requiring a unique candidate civil day whose locally recalculated Brahma
  Muhurta overlaps Krishna Chaturdashi. The Chennai practitioner fixture and
  Tamil Nadu HRCE temple calendar validate the bounded identity/date; this is
  not an oil-bath or puja procedure and is not merged with the North/West lane;
- Bali Pratipada for the West India Smarta fixture and Govardhan Puja/Annakut
  for the North/West India Smarta fixtures, kept as separate observances even
  when the same Pratipada date applies;
- the four-day Chhath sequence for exact Patna and Delhi Bihar/Purvanchal
  profiles, with Sandhya Arghya selected only when one candidate local sunset
  bears Kartika Shukla Shashthi and Usha Arghya retained on the following
  sunrise. The current two-city calendars supply the 2026 sequence while the
  official Bihar source supplies regional identity and structure; and
- Bhai Dooj/Yama Dvitiya for the North/West India Smarta fixtures, using Shukla
  Dvitiya overlap with aparahna.

The implementation evaluates both candidate days from the requested coordinates
and chooses by the stated window, retaining each candidate's exact astronomical
evidence. Multiple coincident observances remain separate records rather than
being flattened into a generic "Diwali day."

The rules are bound to explicit page ranges in the fixed 1865 Marathi
*Nirṇayasindhu* edition and return only decisions and source coordinates—not
private source text. Contemporary calendar pages are normally location-specific
date fixtures, not rule authorities. The Pradosha family is the explicit
exception: its current practitioner page is attributed as the observance-
specific rule source while the historical pages remain general context only.
Dhantrayodashi follows the same attribution discipline: the current
practitioner page supplies the bounded date decision, while fixed PDF page 213
is adjacent Yama Deepam evidence and is explicitly not Dhanteras identity or
Sthir-Lagna authority.
The Bengali Kali Puja lane likewise uses its current practitioner page for the
identity and Nishita rule and the West Bengal calendar for civil-date
corroboration. Fixed pages 216-217 are adjacent Kartika Amavasya/Diwali context,
not Kali Puja identity or Nishita authority.
The Tamil Deepavali lane uses its current practitioner page for the regional
Chaturdashi-at-Brahma-Muhurta rule and the Tamil Nadu HRCE temple calendar for
civil-date corroboration. Fixed pages 214-215 are adjacent Naraka Chaturdashi
context, not Tamil Deepavali identity, regional rule, or household-practice
authority.
The rules explicitly leave complete-day
coverage, unsupported regions and traditions, September-December completion,
modern practice, and ritual guidance false. The Today experience displays only
rules that apply to the requested civil day while retaining cross-date candidate
evidence in the API for exact retrieval.

The Pradosha Delhi reference was fetched through normal TLS as 126,821 strict
UTF-8 bytes with SHA-256
`94ab318ba1acfb84daa160fb161062420985fc07919c7a76de61b7ad439a9ac1`.
The complete compact semantic fixture is hash-pinned at
`ecda097f1233723c1e03f49149e12fb48670e88279ea04e49329aa8f931166c0`.
These bindings support the eight bounded calendar decisions only; they do not
provide a puja muhurta, fasting/puja/parana procedure, universal date, or copied
reference text.

The Dhantrayodashi New Delhi reference was fetched twice through normal TLS as
81,810 strict UTF-8 bytes with SHA-256
`121255bba72fc486def14da6042e5dfb94556cac9b8b8ff92b489e36573e9471`.
The identity context from DD News On Air was also fetched twice as 69,946 bytes
with SHA-256
`d410e9e0692adb3457a979dcc7f188d2d8341cded12fbd30ee5b0fe0b0200524`.
The complete compact semantic fixture is hash-pinned at
`c88547ab6e858c28ed6b60f209ff26ca1194d1e6820e3c5c6fce958b72d7347a`.
It resolves November 6 for this bounded date lane only. It does not calculate
Sthir Lagna, reproduce the provider's 18:02-19:57 puja interval, publish a
ritual, require shopping, promise wealth or health, merge Yama Deepam, or turn
Dhanvantari identity into medical advice.

The Kolkata Bengal Kali Puja reference produced three normal-TLS observations
of 78,534 strict UTF-8 bytes. Its raw hash changed once with dynamic page state,
then repeated at
`f1bc47ed5e1948244babe7f8d86e82f0acf4a6353c44dc3368564f758ff44775`,
while the title, November 8 date, 22:55-23:46 published Nishita interval, and
Amavasya bounds remained stable. A Ramakrishna Advaita Ashrama page was fetched
twice as 130,731 bytes with SHA-256
`810240b3e69b1b769d5e9bac16651afff127411f355729398e24ecd49fc2bf54`
and corroborates the Kartik-Amavasya night identity. The official West Bengal
holiday notification independently lists Kali Puja on November 8; its raw PDF
was not acquired after a normal-TLS Node connection timeout. The complete
semantic fixture is hash-pinned at
`faa675ee7ece5ed1513f75b49fef6db2ab0f9b0ea324f58a40990864c46c165c`.
This resolves only the bounded Bengal Shakta date lane. Household, temple,
pandal, priest-led, and tantric procedures; mantras; bali; fasting; vigil; and
universal practice remain unserved.

The Chennai Tamil Deepavali reference produced two normal-TLS observations of
81,500 strict UTF-8 bytes. Its raw hash changed with dynamic page state, while
the title, November 8 date, 05:06-06:05 published pre-sunrise interval,
Chaturdashi bounds, and Brahma-Muhurta decision rule remained stable. The Tamil
Nadu HRCE November calendar was fetched twice as 655,882 bytes with SHA-256
`7d8c399418edb10c78d0f12e3ff0a7c1275f1d39bf03b7d925fe82d03cee5d24`;
it contains eleven exact one-day `Devali` temple entries on November 8, three
explicitly carrying `Chathurthasi`. The complete semantic fixture is hash-pinned
at `97319c8fc4f1e6bb157c7540f6bcfc3379c0bccabdabb22b57493e085feac7de`.
This resolves only the South India Smarta date lane. Devam recalculates the
local Brahma Muhurta and does not reproduce the provider muhurta or serve an
oil-bath, clothing, lamp, firecracker, household-puja, or temple procedure.

The Kojagara Delhi reference was freshly fetched through normal TLS as 78,509
strict UTF-8 bytes with SHA-256
`d0d9099a4b419a4544080ec6b652398bc37eb461f9f79ffce1782a960ddb7fac`.
The compact semantic fixture is hash-pinned at
`477309b994fffd5f89eed2d810248b823a650d738964c8f7f4aff8c32698e5f2`.
Its published October 25 Nishita interval validates the location-recomputed
window; the rule remains only a date decision, not a puja, fasting, vigil,
health, or universal-practice procedure.

The Hartalika Delhi reference was freshly fetched through normal TLS as 66,646
strict UTF-8 bytes with SHA-256
`90f7b062dcd887fb0eb0c2922bef3ae281e4cf378ec5f680c4f3bc0c69a915ae`.
The compact semantic fixture is hash-pinned at
`bef1772cbb368da2fa712740598d1881b98ffc1b6d8c4a99cfc93e02fa3420a3`.
Fixed PDF page 150 supplies the historical later-day Tritiya boundary; the
current page supplies the Delhi 2026 date observation. Neither source is used
to publish a fasting, puja, outcome, or universal regional-practice procedure.

The Rishi Panchami Delhi reference was freshly fetched through normal TLS as
62,659 strict UTF-8 bytes with SHA-256
`20ecae009600fb8f4b58d03a1a510752db7bf18183205122460120d9399aa59a`.
The compact semantic fixture is hash-pinned at
`ddc41a55a00b9755949f4a175a0edb05fc546b6a624acdd0992ffbf8e9b731e1`.
Fixed PDF page 151 supplies the madhyahna rule and preserves the two-day
precedence conflict. The current page supplies the Delhi 2026 identity/date
fixture. No fasting, puja, historical purity rule, or universal practice is
promoted.

The Radha Ashtami Delhi ISKCON reference was freshly fetched through normal TLS
as 67,159 strict UTF-8 bytes with SHA-256
`fae89430859fb45d5f1f00fa9969477fd197646f2453e9e7befffad6546452b1`.
The compact semantic fixture is hash-pinned at
`93f9fc2539ff87495012d31d9c87115c68b317eab679dbfc1725877ed9455867`.
It resolves September 19 only for the explicit ISKCON context. Fixed
*Nirnayasindhu* PDF pages 51-52 supply general Shukla Ashtami later-day context,
not Radha identity, a modern madhyahna rule, or ritual authority. The rule does
not claim an all-Vaishnava or Smarta date, fasting, puja, promised outcomes, or
universal practice.

The separate Delhi Smarta and ISKCON Krishna Janmashtami references were freshly
fetched through normal TLS as 88,987 and 83,943 strict UTF-8 bytes with SHA-256
`9f4e450ca60b167289584cdc200a5d2599572756d48dba4bc49819cfe2119b3c`
and `d683b0823e1bdcc708910485f4d04ba8211452d06d35163fb9797fd7f33e62fd`.
Their shared semantic fixture is hash-pinned at
`a05f45a558061686e16fbe739b4d78dc5e86f9cf0c809c7f8eec28063123bdf1`.
Fixed PDF pages 140-149 (printed 123-132) preserve the historical Janmashtami,
Jayanti, Ashtami, Rohini, Nishita, and parana decision context. Both current
lanes resolve September 4 in 2026, but their separate identities and rules remain
separate. No puja muhurta, fasting, puja, parana, Dahi Handi procedure, or
universal/all-Vaishnava equivalence is served.

The Balarama-associated candidates are no longer flattened. The bounded Delhi
North India rule assigns September 2 only as Hala Shashthi / Hal Chhath. The
September 16 provider attribution is rejected because it conflicts with
official ISKCON Delhi and Bangalore Balarama Purnima/Jayanthi on August 28 and
lacks direct authority. August 28 remains a separate, out-of-window ISKCON lane.
The Hala Shashthi guide is a conservative participant companion; it does not
prescribe fasting, diet, moonrise arghya, branch/image rites, or guaranteed
outcomes.

Agastya Arghya is resolved only as an exact New Delhi 2026 practitioner-calendar
fixture: September 4, 04:58-06:00. The provider publishes no calculation
method. Fixed
Nirnayasindhu PDF pages 159-160 (printed 142-143) contain the historical
Agastyodaya/Arghya decision and procedure. A separately acquired 2016 technical
paper explains that heliacal visibility is location- and atmosphere-dependent
and illustrates an estimate requiring Canopus at 3 degrees while the Sun is 5
degrees below the horizon. Using SIMBAD's fixed ICRS coordinates, the engine
reproduces ordinary geometric rise on September 4 but finds the paper estimate
first satisfied on September 3 in the tested Delhi window. Ordinary rise is not
heliacal rise, and the paper is not authority for the provider's unpublished
method. `/api/observances` therefore returns the exact fixture only at the New
Delhi coordinates and supported traditions. It makes no general algorithm,
portable date, weather, visibility, mantra, or full-vrata claim.

The September 17 Kanya Sankranti boundary is now resolved without inventing a
historical citation. The deterministic engine places the Simha-to-Kanya ingress
at approximately 02:28 UTC / 07:58 IST. A current Kolkata practitioner page
links Vishwakarma Puja to Kanya Sankranti and the final day of Bengali Bhadra;
the West Bengal MSME holiday calendar independently lists Viswakarma Puja on
September 17, 2026. Their raw HTML changes between consecutive normal-TLS
fetches while the relevant literals remain stable, so Devam pins the semantic
fixture and both observations. Kanya Sankranti and Bengal Vishwakarma Puja are
separate API records. Punya-kala, puja timing, ritual procedure, machinery
safety instructions, pan-Indian scope, and other regional variants remain open.

The 2026 Delhi fixture fetches for Govatsa Dwadashi and Yama Deepam returned
HTTP 200 through normal TLS. Their exact response-byte SHA-256 values were
`55595f4fbafc8f31553ea045fbc602752345724b70e6544fccab78cb77a9d535`
(70,012 bytes) and
`aee5fceabc181894e8bb4db034038c5029d99b8bd68d0ce977cbb2d480aca640`
(77,850 bytes), respectively. These observations corroborate the Delhi dates;
they do not license copied descriptions or establish universal practice.

The Purnima and Amavasya series were fetched separately through normal TLS.
Their exact 2026 Delhi response fixities are
`bdda6985a696f51edc5663ceccc91fc8ac3f8091b94df0d41444da7aa5171b3b`
(102,831 bytes) and
`70c9f7c076ffd9517b96cc3e2a7a8e9bc96bcf96894b8c1ef9a556f605994364`
(90,390 bytes). December 23 Margashirsha Purnima is deliberately unresolved:
Purnima is absent at both adjacent sunrises but present at moonrise, so the
sunrise-only rule cannot reconcile the modern lead.

The Masika Shivaratri series was freshly fetched through normal TLS for Delhi.
The provider response contains dynamic bytes, so Devam binds the normalized
four-record fixture rather than pretending the whole HTML response is stable:
September 9, October 8, November 7, and December 7, with each displayed lunar
month and Chaturdashi start/end pair. The canonical semantic fixture SHA-256 is
`f686ae462f8d90d81ec6b8cfa801bc399d3677ec28e660ef8b17748eb02f125c`.
It corroborates the bounded dates and is not the rule authority.

### Ekadashi exact-profile lanes

The fixed source's Ekadashi section (PDF pages 52-67) does not support a generic
"Ekadashi at sunrise" shortcut. It separately discusses Dashami contamination,
arunodaya, tithi growth, Dvadashi preservation, parana, and multiple
applicability branches. Devam therefore resolves only sixteen practitioner-
validated lanes: the eight launch windows, separately for matching Smarta and
ISKCON contexts at the exact Delhi, Mumbai, and Chennai reference coordinates.

Every result retains calculated sunrise and 96-minute-arunodaya tithi states as
diagnostics without pretending they are a complete textual rule engine. ISKCON
pāraṇa is recalculated from next local sunrise through one third of daylight and
must agree with the frozen provider window within 180 seconds. Smarta pāraṇa is
still unassigned because its Hari Vāsara-aware end differs from the ISKCON
window. The November Devutthana and Chennai December Utpanna shifts remain
literal, and unsupported coordinates or tradition combinations fail closed.

### Gita Jayanti on the Mokshada Ekadashi date lane

The supported Delhi, Mumbai, and Chennai Smarta and ISKCON profiles resolve
Mokshada Ekadashi on December 20. Gita Jayanti reuses that date result but adds
an independently sourced scripture-commemoration identity; it does not convert
the reading guide into a universal Ekadashi vrata. The guide requires a named
edition, translator, and commentary where present, and keeps source verse,
translation, commentary, and personal application separate. Fasting, parana,
ritual bathing, Deep Daan, temple liturgy, complete recitation, and event
operations remain outside this layer. The evidence fixture SHA-256 is
`20e6f9f473cbdf5a68282b36af4a08a6471a0f814665132743e22fca6bd44930`.

### Tulasi Vivah variant lanes

The 2026 fixture preserves one general Dwadashi lane and the BAPS sequence as
different authorities. For exact North/West Smarta contexts, November 21 is
selected only when Shukla Dwadashi uniquely overlaps locally recalculated
pradosha; the current Delhi practitioner page and official Mumbai tourism page
corroborate that bounded date and the Tulasi-Vishnu/Krishna identity. For the
exact BAPS context, the institution's own calendar is authoritative: the
sequence begins November 21 and closes November 24. The BAPS records retain
astronomical diagnostics but do not derive their date from those diagnostics.
Neither lane supplies a universal fast, formal wedding liturgy, plant-handling
requirement, or outcome guarantee. The semantic fixture SHA-256 is
`fa33540adba85a7e4e79b454d98c80677c0b7c92b0e557a26ea6168b7f038257`.

### Varanasi Dev Deepawali lane

The Varanasi/Kashi regional lane resolves November 24 only when Shukla Purnima
uniquely overlaps locally recalculated pradosha. A current Varanasi-specific
2026 practitioner page supplies the bounded date and displayed interval;
official Ministry of Tourism evidence supplies the city, full-moon, illuminated
ghat, public-festival, and story-variant identities. Generic Kartika Purnima
remains an independently applicable calendar record, while BAPS Dev Diwali and
Tulsi Vivah Samapt remain institutional records. The rule neither manufactures
live event operations nor turns a recurring public-festival description into a
universal vidhi. The semantic fixture SHA-256 is
`84fb6f87eedb403c354312a414f6073b24b8a378c979e9da1a9b02f13921f1e8`.

## Next layer

The bounded Ananta Chaturdashi rule now has a separate North/West India Smarta
practice companion. Its positive boundary is attributable Ananta/Vishnu
remembrance, reflection, and one responsible commitment. It does not turn the
historical madhyahna rule into a formal vrata manual, and it never merges the
same-date Ganesh Visarjan lane. The pack SHA-256 is
`d64e500329df8611688cfdf709dd75adf740046258a8a90e39e1d057142bfa6b`.

Kalabhairava Jayanti now uses a dedicated night-rule path: each candidate is
evaluated from local sunset to the following sunrise, and exactly one night
must contain at least 1,440 seconds (one ghati) of Krishna Ashtami. Ambiguous
or empty candidate pairs fail closed. The calendar fixture SHA-256 is
`df5444680f998850f9115ce71e65da251b9afd70f77031098c9dd7b06afff229`.
This resolves a bounded date lane only; the companion keeps formal, tantric,
harmful, fear-based, and outcome practices outside Devam's generic guidance.

Vivaha Panchami now uses a unique-sunrise rule for the bounded Delhi/North
India 2026 lane. December 13 and 14 are evaluated independently, and exactly
one local sunrise must bear Margashirsha Shukla Panchami; ambiguity fails
closed. The calendar fixture SHA-256 is
`5ac334e9efa8fe548b572ef6ce5d4d982206cc774a4a2672735c75b665a7770c`.
Official Orchha and Ayodhya sources remain regional and public-festival identity
context, not a universal household wedding or puja procedure.

The September-December launch layer must add the remaining separately versioned
observance rules and source-grounded ritual procedures. Every rule must state its geography,
tradition, effective calendar convention, source evidence, precedence logic, and
known alternatives. These records will consume this astronomical layer without
silently altering it.

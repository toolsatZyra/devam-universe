# Devam web

The responsive Next.js application for Devam's Living Atlas, Sarthi, Today, Library, journeys, and challenges.

Library Search exposes reviewed grounded results and a separately labelled
metadata-only catalog of every unique preserved source-vault object. The latter
supports discovery of the wider collection but never promotes a carrier name
or hash into a verified passage, reviewed edition, rights clearance, or
product-ready text.

## Local development

```powershell
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://localhost:3000`.

## Deterministic checks

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Copy `.env.example` to `.env.local` and fill in the isolated Devam project's
publishable URL and key to load the Atlas from Supabase. Without those values,
the page uses the compact offline fixture through the same repository interface.

`/account` now provides passwordless Supabase sign-in, owner-scoped profile
context, explicit personalization consent, and memory inspection/export/deletion.
The Living Atlas lets a guest sample two hero gateways before showing a soft
account invitation; this is a conversion boundary, not a security entitlement.
Every user-data table remains protected by ownership RLS, and server identity is
validated with `getClaims()` rather than a cookie-trusted session object. Set an
exact `DEVAM_SITE_URL` in production and configure custom SMTP before inviting
public users; Supabase's default SMTP is only suitable for restricted testing.

The account surface also contains the provider-neutral Devam One entitlement
boundary. It remains in the free-beta lane unless
`DEVAM_SUBSCRIPTIONS_ENABLED=true` is set after the corresponding Supabase
migration has been applied. Authenticated clients can read only their own
entitlement and cannot create or change subscription state. No checkout or
billing provider is connected yet.

Sarthi conversations are ephemeral for guests and for signed-in users who have
not enabled personalization. With consent, missing language/region/tradition
context can come from the owner profile and each exchange is written to an
owner-scoped conversation thread. Current-turn context always overrides the
saved profile, and a persistence failure never suppresses the grounded answer.
The first-class `/sarthi` surface retains the visible in-session transcript,
renders evidence and ritual detail only on demand, and enforces the same one-
exchange guest preview as the Atlas panel. Personal or morally consequential
questions first receive a decision-changing clarification rather than a
scriptural command. Immediate-danger language routes to present human help and
never to spiritual interpretation.

When a consenting signed-in user continues an owner-scoped thread, the server
loads at most eight recent user/assistant turns after verifying ownership; the
API ignores any client-supplied history. The first reviewed bilingual second-
turn route covers family-career tension. Its source coordinates are bound in
`knowledge_packs/wisdom/personal-guidance-foundation-v1.json`; it cites but does
not quote the private GRETIL commentary carrier, treats money and dependants as
real constraints, proposes reversible tests, and never claims that scripture
chooses the user's career. This is one internal-beta guidance lane, not general
wisdom coverage.

Sarthi's exact, deterministic, ritual, and reviewed-claim retrieval routes do
not require a model provider. Optional natural answer composition is enabled
only when `SARTHI_GENERATION_ENABLED=true` and a server-only `OPENAI_API_KEY` is
present; `SARTHI_OPENAI_MODEL` defaults to `gpt-5.6-terra`. The server sends a
small packet of published, product-compatible claim statements and source
identities through the OpenAI Responses API, never citation-only passage text.
Verified citations are attached by the application. Provider failure or an
invalid response falls back to the deterministic grounded answer, so model
availability cannot turn an evidenced answer into an unsupported one.

`POST /api/panchang` now returns versioned astronomical Panchanga facts for an
exact civil date, location, timezone, and tradition code. It deliberately does
not assign observances or provide ritual instructions. `POST /api/observances`
is the separate evidence-backed layer; it currently resolves seventy-three bounded 2026
resolution records across separate Smarta and ISKCON Krishna Janmashtami
lanes, Hartalika Teej, Rishi Panchami, Radha Ashtami, Ganesh Chaturthi,
Navaratri/Vijayadashami, and the
four monthly Sankashti Chaturthi records, Karwa Chauth, Govatsa Dwadashi,
separate Dhantrayodashi and Yama Deepam records, a Bengal Shakta Kali
Puja record, and a South India Tamil Deepavali/Naraka Chaturdashi record that
uses locally recalculated Brahma Muhurta. Its separate English/Hindi household
guide supports a safe pre-sunrise family bath, optional customary oil, clean
clothes, blessings, and prepared food without prescribing medical suitability,
fireworks, purchases, or a universal procedure. Tamil Deepavali remains separate from the North/West Naraka
Chaturdashi and Lakshmi Puja lanes. The bounded rules also retain the
Naraka-Chaturdashi-through-Bhai-Dooj sequence in its
supported North/West India Smarta contexts. Coincident observances remain
distinct. Sixteen of the bounded records are the eight named September-December
Ekadashi windows represented separately for Smarta and ISKCON lanes at exact
Delhi, Mumbai, and Chennai reference profiles. The resolver preserves the
November Devutthana and Chennai December Utpanna date shifts; ISKCON pāraṇa is
independently recalculated and provider-checked, while Smarta pāraṇa and all
fasting or ritual guidance remain unresolved.
Four of the bounded records are the exact-profile November 13–16 Chhath
sequence for Patna and Delhi. The main Sandhya Arghya day is independently
selected by Shukla Shashthi at local sunset, with Usha Arghya on the following
sunrise. Today and Sarthi can return a source-bounded Hindi/English family
participation guide, but never prescribe a fast or nirjala regimen, unsafe
water entry, or claim that a newcomer form equals the full family vrata.
Three named Purnima calendar-day lanes and four named lunar-month Amavasya lanes
are separate from Purnima Vrata, Darsha, shraddha, and festival-specific lanes;
the December 23 Margashirsha Purnima edge remains explicitly unresolved.
Four Masika Shivaratri lanes bind separate night, pradosha, and two-ghati
nishita evidence while keeping fasting, puja, parana, and universal-practice
claims open.
Kojagara Puja/Sharad Purnima is a distinct Purnima-at-local-Nishita night rule
for the bounded North/West/Bengal contexts. It resolves October 25 in the Delhi
fixture while the named Ashwina Purnima calendar-day lane remains October 26;
neither record supplies a ritual procedure.
Four Masika Durgashtami date lanes now resolve Shukla Ashtami at local sunrise
for September through December under the fixed later-day rule. They keep
fasting, worship, Mahashtami equivalence, and regional procedures open.
All eight Delhi September-December Pradosha occurrences require a unique
Trayodashi overlap with a bounded post-sunset window. Their current practitioner
rule/date source remains distinct from the fixed historical source's general
naktavrata context; puja muhurta and ritual procedure are not claimed.
Hartalika Teej now resolves separately on September 14 for the bounded Delhi
North/West Smarta context through the fixed later-day Shukla Tritiya rule. It is
not merged into same-day Ganesh Chaturthi, and no fasting, puja, outcome, or
South Indian Gowri Habba procedure is claimed.
Rishi Panchami resolves separately on September 15 only because one candidate
madhyahna bears Shukla Panchami. A two-day madhyahna tie fails closed instead of
hiding the fixed source's competing precedence opinions; no ritual or historical
purity instruction is served.
Radha Ashtami resolves on September 19 only for the explicit Delhi ISKCON
context, using greater Shukla Ashtami overlap during madhyahna. It remains
separate from same-day Masika Durgashtami; the rule does not claim an
all-Vaishnava or Smarta date or provide ritual guidance.
Krishna Janmashtami resolves on September 4 through separate bounded Delhi
Smarta and ISKCON rules. Both require unique Krishna Ashtami overlap with local
Nishita and expose Rohini overlap separately; the shared 2026 date is not treated
as proof that the rules or all Vaishnava traditions are equivalent. No fasting,
puja, parana, or Dahi Handi procedure is served.
The Balarama layer does not collapse September 2 Hala Shashthi, September 16
Balarama Jayanti, and August 28 ISKCON Balarama Purnima into one observance.
Official ISKCON sources conflict with the September 16 page's ISKCON
attribution, so `/api/observances` and Today expose an unresolved identity
record with no assigned date or ritual guidance.
Agastya Arghya appears only as an unresolved September 4 provider lead in the
bounded Delhi North/West Smarta contexts. The runtime independently reproduces
ordinary Canopus rise and a published 3-degree/-5-degree heliacal-visibility
estimate from fixed coordinates; the estimate first qualifies September 3 and
the provider does not publish its convention. Today therefore says the timing
is unresolved and serves no date, Arghya window, or ritual procedure.
Kanya Sankranti and Bengal Vishwakarma Puja are separate September 17 records.
The first comes from the deterministic Simha-to-Kanya ingress; the second is
available only in the Bengal regional context and is corroborated by the current
Kolkata practitioner page and the official West Bengal calendar. Neither record
supplies punya-kala, puja timing, ritual procedure, or a universal Indian rule.
The bounded West India Smarta Ganeshotsav campaign now spans all 12 civil dates
from Ganesh Chaturthi through Anant Chaturdashi in Today. It keeps the existing
Ganesha practice guide and journey reachable on interior days, while explicitly
refusing to present the 12-date calendar lane as a mandatory murti-stay duration.
Family-chosen visarjan durations and other regional traditions remain separate.
For the Delhi North India context, Today also carries a 15-date Mahalaya/Pitru
Paksha calendar lane from September 26 through October 10. Its 18 current labels
are hash-bound as a normalized semantic fixture because the reference HTML is
dynamic. This is calendar context, not a decision about the user's ancestor,
death tithi, eligibility, timing, offerings, or Shraddha procedure.
The Shakta/Bengal context also has its own six-date Kolkata Durga Puja lane from
the October 16 Bilva Nimantran prelude through October 21 Vijayadashami and
Bengal Durga Visarjan. It preserves the official and practitioner-calendar label
differences, links to the Durga journey, and does not reuse the North/West
Navaratri household guide as a Bengal Puja procedure.
It keeps complete-day,
unsupported-region, modern-practice, and ritual-guidance claims false. The Today
experience displays only rules that apply to the requested day and leaves
cross-date candidate evidence available through the API.

For the eight launch-interval Ekadashi date leads, `/api/observances` returns
deterministic unresolved-candidate diagnostics with arunodaya and sunrise tithi
identities. It returns no selected civil date until the source's separate
Smarta/Vaishnava, tithi-growth, Dvadashi/parana, and practitioner rules are fully
implemented.

`POST /api/practice-guidance` now returns one complete-in-scope West India
Ganesh Chaturthi household guide in English or Hindi. It contains minimum,
standard, and elaborate forms; substitutions; family-context questions; and
separate permanent-image and temporary-festival-murti handling. The pinned
five-source research pack is returned with attribution but without copied
source text. The exact-source four-step hymn reading remains a nested optional
companion. This is an internal-beta synthesis for one supported context, not a
universal puja vidhi or complete regional Ganeshotsav coverage.

The same endpoint returns a second complete-in-scope guide for the supported
North/West India Smarta Shardiya Navaratri opening. It provides minimum,
Ghatasthapana, and family-text/priest-led forms in English and Hindi, plus a
ten-day reflection path that is labelled non-mandatory. Continuous flame is
never advised without supervision. Bengali Durga Puja, South Indian Golu,
Gujarati Garba, Nepal Dashain, fasting regimens, and all-region completeness are
explicitly outside this pack.

The endpoint also resolves all seven weekday keys for the bounded West India
Smarta context. Each English/Hindi guide offers a five-minute, standard, and
family-led form; Today automatically selects the key from the deterministic
vara, while Sarthi asks for region and household practice before using it. The
pack is an optional regional rhythm—not a national-exclusive deity mapping—and
does not prescribe fasting, formal mantras, astrological remedies, planetary
appeasement, or direct sun-gazing.

For the bounded West India Diwali Lakshmi Puja context, the endpoint returns a
third Hindi/English three-tier household pack. Its six-part festival path marks
the core Lakshmi Pujan lane as resolved and retains Dhantrayodashi/Yama Deepam,
Naraka/Kali, Padwa/Govardhan, and Bhau Beej as distinct partial procedure lanes.
It supplies neither a precise formal muhurta nor fasting, mantra, fireworks, or
guaranteed-wealth prescriptions.

The independently resolved North/West India Dhantrayodashi and Yama Deepam date
records now have separate Hindi/English three-tier household packs in Today,
the practice API, and Sarthi. Today can render both on the shared civil date
instead of choosing one and hiding the other. The Dhantrayodashi guide asks
which health, livelihood, deity, tool, or account-book focus the family
actually keeps; requires no purchase; and supplies no financial advice,
medical regimen, promised outcome, or precise muhurta. The Yama guide supports
one supervised outside-home evening lamp or flame-free light while requiring no
direction, lamp count or material, formal mantra or tarpan, overnight burn, or
guaranteed protection. Neither guide silently completes the other.

Karwa Chauth now has a separate hash-bound Delhi/North India family pack in
Today, the practice API, and Sarthi. It preserves the historical Krishna
Chaturthi-at-moonrise rule and current North India living-practice evidence,
while keeping Punjab and Uttar Pradesh variants distinct. The app asks for the
family's actual context, offers 10-, 30-, and 60-minute English/Hindi forms,
and does not prescribe fasting, import medical guidance, require a fixed set of
materials or gender roles, or promise health, longevity, or marital outcomes.
The larger source carrier remains outside the app bundle and is rehashed only
by the test suite.

All four launch-window Sankashti Chaturthi records now share a separate
hash-bound West India Smarta guide in Today, the practice API, and Sarthi. It
offers English/Hindi 10-, 30-, and 60-minute forms and nests the existing
attributable Ganesha reading. Moonrise always comes from the runtime user's
location; the Delhi and official Siddhivinayak Mumbai tables are evidence
checks only. The guide prescribes no fast and requires no moon sighting,
temple visit, offering, katha, mantra, arghya, flame, or food; it keeps Ganesh
Chaturthi and Karwa Chauth separate and promises no obstacle-removal outcome.

The seven launch-interval Ekadashi observances other than Mokshada now share a
separate hash-bound bilingual devotional companion in Today, the practice API,
and Sarthi. It serves exact North/West/South Smarta profile pairs and one
separate ISKCON pair without merging their calendar dates. Its 10-, 30-, and
60-minute forms support remembrance, attributable study, restraint, and
service; they never prescribe fasting, food, health suitability, Smarta parana,
one universal mantra or katha, or a promised outcome. Mokshada continues to use
the existing Gita Jayanti reading guide.

Krishna Janmashtami is connected through one shared bilingual devotional core
and two strictly separated routes: North/West India Smarta and ISKCON. Today
uses the selected calendar profile; Sarthi asks which tradition applies when it
is unknown. The guide does not infer equal rules from the matching 2026 Delhi
date and supplies no fasting, food/health, exact muhurta, mandatory midnight,
formal puja, parana, Dahi Handi human-pyramid, purchase, or outcome instruction.

Hartalika Teej now has a separate bilingual North/West India Smarta guide for
the resolved September 14 lane. Today uses the exact calendar profile, while
Sarthi distinguishes generic Teej questions before giving a sequence. The
guide supports Parvati-Shiva remembrance, family-known story, song or prayer,
and an act of care without prescribing fasting, formal puja, eligibility,
adornment, purchases, outcomes, or merging Gowri Habba and other Teej forms.

Rishi Panchami now has a separate bilingual Saptarishi learning-and-gratitude
guide for the resolved September 15 North/West India Smarta lane. It supports
attributable study, teacher gratitude, inquiry, and knowledge service while
keeping varying sage lists visible. It does not prescribe fasting, bathing,
formal puja, impurity, menstruation dosha, atonement, gender eligibility, or
outcomes, and it does not merge Bhai Panchami.

All four launch-interval Masika Shivaratri nights now share one bounded
North/West India Smarta bilingual companion. It offers 10-, 30-, and 60-minute
Shiva-remembrance, study, reflection, and service forms while leaving fasting,
food, health, abhisheka materials, formal mantra/aarti, night vigil, parana,
annual Mahashivaratri practice, and other regional or Shaiva traditions outside
the guide.

Three resolved generic Purnima and four resolved generic Amavasya calendar
days now expose two distinct bilingual reflection companions. They retain every
coincident festival, vrata, temple, Diwali, ancestor, shraddha, tarpan, and
Darsha practice as a separate lane and prescribe no fast, food, ritual bath,
moon worship, offering, mantra, or outcome. The unresolved Margashirsha Purnima
candidate has no practice card.

`POST /api/sarthi` now combines the deterministic, source-bounded Ganesha
conversation with the supported household procedure. A context-free ritual
question receives a natural location/family-practice/murti clarification rather
than a guessed sequence. A West India request receives a concise English or
Hindi minimum form and an expandable minimum/standard/elaborate guide, while the
exact hymn evidence remains separately expandable. The same conversation pattern
now covers the supported North/West India Shardiya Navaratri lane, including its
non-mandatory ten-day reflection path, plus the bounded West India weekday
practice and Diwali Lakshmi Puja lanes. It still fails closed beyond connected
evidence. Ordinary Durga and Ramayana prompts now expose the exact retained
Devimahatmya chapter boundary and the seven-book structure of one Valmiki
Ramayana carrier respectively; private-review carriers return coordinates but
no source quotation. This is still not general Sarthi intelligence, complete
hero coverage, or a universal puja vidhi.

When these deterministic routes have no supported answer, Sarthi searches the
same published Supabase knowledge projection used by exact Search. The selected
Atlas node helps interpret contextual prompts such as “tell me about this,” but
does not override an explicit question about another connected subject.
Database-grounded replies remain short by default and expose exact passages
only through the optional “Why Sarthi says this” control.

`GET /api/search?query=...` and `/search` always expose four compact grounded
retrieval slices. Ganesha, Durga, and Ramayana preserve source-bounded claims;
Diwali is visibly labelled as evidence-bounded synthesis and exposes evidence
coordinates rather than fabricated primary-source quotations. With the ordinary URL and publishable key, the endpoint
also calls a narrowly granted Supabase RPC that searches the claims `tsvector`
and returns only published, product-compatible, evidence-linked results. Raw
evidence tables remain browser-denied. Citation-only evidence can return source
metadata and coordinates but never its exact passage text. Database failure
preserves the compact slices and reports a degraded retrieval state;
unsupported subjects return an honest empty set rather than generated filler.

The connected beta source set now also includes Sanskrit Wikisource
Ganapatyatharvashirsha revision 415703. Search and Sarthi can return its bounded
English/Hindi claims with exact Sanskrit passages and source coordinates. This
does not imply an identified underlying print edition, complete variants,
source-aligned full translations, pronunciation guidance, or a universal puja
guide.

`/journeys` now contains four bounded MVP paths: the seven-kāṇḍa structure of
one Ramayana carrier, four milestones in the CC0 Ganesha hymn, four exact
boundaries across the retained Devīmāhātmya sequence, and a six-part Diwali
path reconstructed from an exact Devam-authored evidence-pack byte crosswalk.
The first three point directly to retained source carriers; the Diwali route
identifies itself as a derived synthesis and does not impersonate a primary
source. `/challenges` turns those paths into device-local exploration missions.
Private-evidence journeys expose coordinates and source identity but no source
quotation; progress records exploration rather than spiritual merit.

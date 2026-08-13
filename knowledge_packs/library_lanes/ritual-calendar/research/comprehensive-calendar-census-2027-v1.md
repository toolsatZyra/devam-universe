# Comprehensive calendar census 2027 — source and method note

Checked on 2026-08-13 for the ritual-calendar lane.

## Purpose

This census discovers candidate observances for a state-sensitive household
and ordinary temple-participant library. It does not turn a calendar label into
a story, practice description or vidhi. Each accepted lane still needs fixed
lawful narrative sources and appropriately scoped living-practice evidence.

## Current discovery sources

1. **National Portal of India — Holiday Calendar**
   (`https://www.india.gov.in/calendar`). The current portal exposes Central
   and state/union-territory holiday selectors. It is a recognition and routing
   signal only; a government holiday is neither proof of religious meaning nor
   evidence for ritual instructions.
2. **Drik Panchang 2027 regional calendars.** Ten location-qualified calendar
   pages are recorded verbatim by URL and count in
   `ritual-calendar-comprehensive-census-v3.json`: North-reference Hindu,
   Assamese, Bengali, Gujarati, Kannada, Malayalam, Marathi, Odia, Tamil and
   Telugu. They supply candidate labels and deterministic-rule research leads.
   They are practitioner calendar references, not universal ritual manuals.
3. **Existing Devam September-December holdings.** The v1 and v2 inventories
   remain reuse/audit inputs. Existing packs are not automatically complete for
   all selected states or both settings.

No downloaded page payload is committed. The inventory stores only compact
source URLs, counts and discovered labels.

## Extraction result

The ten 2027 pages yielded 971 dated occurrences and 425 distinct raw labels.
The raw count intentionally retains spelling and language aliases such as
Akshaya Tritiya/Trithiya/Trutiya, regional names for sibling observances, and
distinct Sankashti labels. It also contains calendar events that may not be a
consumer puja, such as eclipses, starts/ends, or a descriptive solar ingress.

Every label is initially `undispositioned`. Normalization must explicitly mark
it as a distinct lane, alias, descriptive non-puja event, outside selected
scope, hero-owned cross-link, or evidence/authority block. Silent deletion is
not allowed.

## State routing and major differences

The twenty selected state routes are not twenty copies of each ritual. A
regional lane is split only when timing, eligibility, authority, safety,
required materials, deity/story focus, ordered actions or closing changes what
the user should do. Minor name, pronunciation, optional food, flower, colour,
decoration, song or emphasis remains a labelled variant inside a shared lane.

Bihar, Chhattisgarh, Punjab, Himachal Pradesh, Uttarakhand and other North or
Central routes require official/local supplements during normalization when
the North-reference calendar would miss a material regional observance.
Likewise, a live temple programme requires a current institution source and a
freshness boundary; no annual calendar is reused as a future temple schedule.

## Settings and exclusions

`temple_participation` means ordinary visitor guidance, not temple liturgy.
Priest-led, Agamic, Tantric, initiation-restricted and consecration procedures
remain specialist or institution-controlled. A user may be told how to
participate, what to ask, and what not to improvise; Devam does not simulate the
priest's procedure.

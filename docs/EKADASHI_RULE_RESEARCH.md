# Ekadashi rule research - fixed Nirnayasindhu image evidence

## Current decision

All eight September-December 2026 Ekadashi windows now have separate bounded
Smarta and ISKCON date lanes for the exact Delhi, Mumbai, and Chennai reference
profiles. The fixture is
`knowledge_packs/panchang/ekadashi-delhi-mumbai-chennai-september-december-2026-v1.json`
at SHA-256
`6c860d6f2d778739c4a25b4b281b03a16975e8d43021baee24c55b1e1b72433d`.

The resolver deliberately does not claim a complete textual Ekadashi engine.
It binds current practitioner calendar selections to exact city/tradition
profiles while retaining calculated sunrise and 96-minute-arunodaya tithi
states as diagnostics. ISKCON pāraṇa is served only when Devam's next-sunrise
through one-third-daylight calculation agrees with the frozen provider window
within 180 seconds. Smarta pāraṇa, fasting/food advice, medical guidance, and
ritual procedure remain unresolved.

Two divergences prove why a national date table is unsafe: Delhi Smarta
Devutthana is November 20 while the ISKCON lane is November 21; Chennai ISKCON
Utpanna is a Paksha Vardhini Mahadwadashi on December 5 while Delhi and Mumbai
ISKCON remain December 4.

## Fixed source boundary

- Work: *Nirnayasindhu*, Marathi translation with Sanskrit source passages.
- Edition: Mumbai, 1865.
- IA identifier: `in.ernet.dli.2015.365977`.
- Fixed PDF SHA-256:
  `a632f570153cb77802b85fdc22e54e00f217960b1d848ee640dd9e610327f02b`.
- Relevant image coordinates: PDF pages 52-67, printed pages 25-50.
- Provider OCR is not authority and no source text is exposed through the API.

The sixteen fixed PDF images were freshly rendered and visually inspected on
2026-08-06. They show a connected Ekadashi decision chapter rather than a
single transferable date rule:

- PDF 52-54: general Ekadashi obligation, eligibility, and exceptions;
- PDF 55-57: the explicit Ekadashi decision section, arunodaya/dawn defects,
  four-ghati and alternative dawn formulations, and differing householder,
  ascetic, Smarta, and Vaishnava applications;
- PDF 58-61: tithi growth, shuddha/viddha combinations, consecutive-sunrise
  cases, and branching rules for which civil day is observed;
- PDF 62-65: parana, food/fast practice, eligibility, and ancillary procedure;
- PDF 66-67: eight named Mahadwadashi classifications, Dvadashi preservation,
  and parana timing before the chapter closes and the Kartika section begins.

## Remaining implementation before broader promotion

1. Represent the source's multiple dawn/arunodaya definitions explicitly; the
   current 96-minute value is only a diagnostic model, not a completed rule.
2. Separate Smarta householder, Vaishnava, ascetic, and other stated
   applicability branches instead of forcing a national date.
3. Classify shuddha/viddha, tithi growth, consecutive-sunrise, and the eight
   Mahadwadashi cases from calculated tithi states.
4. Calculate Dvadashi and Trayodashi states required for safe parana selection.
5. Extend beyond the three exact reference profiles only with separately
   validated geographies and living-calendar traditions.
6. Keep fasting, medical, food, child/elder, and procedure advice separate from
   the date resolver and subject to the modern safety/context layer.

Outside the three exact city/tradition profiles, `selectedCivilDate=null`
remains the correct product result. Within them, the bounded date claim is
resolved but complete Ekadashi logic and practice guidance remain false.

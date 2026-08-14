# Ganguli Mahabharata source qualification — 2026-08-12

## Outcome

The retained four-volume Project Gutenberg electronic expression is now a
fixed, deterministic source denominator for the consumer Mahabharata build.
It covers books 1 through 18, from Adi Parva through Svargarohanika Parva, in
2,107 source-relative section units. Harivamsha is not part of this expression.

This closes source qualification for one historical English expression. It
does **not** complete the consumer Mahabharata, supply Hindi, establish a
critical edition or recension, reconcile every print page, cover Harivamsha,
or represent every Mahabharata telling and living tradition.

## Fixed carrier boundary

| Electronic volume | Project Gutenberg record | Books | Retained text SHA-256 | Bytes | Source units |
| --- | --- | --- | --- | ---: | ---: |
| 1 | [15474](https://www.gutenberg.org/ebooks/15474) | 1–3 | `246325dcb8966a13990ab66f38b1cab230724fe0b1ad135bd6fb12222baa4826` | 3,752,901 | 628 |
| 2 | [15475](https://www.gutenberg.org/ebooks/15475) | 4–7 | `009689aec55696f0d40201138c867db4c306671e6a5ba0091d783f812f395b5b` | 4,023,497 | 595 |
| 3 | [15476](https://www.gutenberg.org/ebooks/15476) | 8–12 | `2d4d53b9c4892ebdc5a4bfa59458d0e0acf9742d3ce0f3b7b1b428ab838f402d` | 4,864,546 | 568 |
| 4 | [15477](https://www.gutenberg.org/ebooks/15477) | 13–18 | `60de2a2f82f22247fdb72096c7ebbb01b63ad42770506c10f6d7c7a82868e437` | 2,621,948 | 316 |

Total fixed payload: four unique content-addressed objects, 15,262,892 bytes.
The compiler reads those objects in place. It copies no source body into the
repository, application, report, test fixtures, or database.

The current official provider records independently name the translator,
assign books 1–18 across the four ebooks, and mark each ebook public domain in
the United States. The retained text headers independently bind title,
translator, ebook number, release date, update date, and the provider's
license/trademark framing.

## Structural denominator

| # | Parva | Volume | Source units | Preserved literal-marker evidence |
| ---: | --- | ---: | ---: | --- |
| 1 | Adi | 1 | 236 | marker 177 is followed by 176 |
| 2 | Sabha | 1 | 79 | literal 67 is absent; last literal is 80 |
| 3 | Vana | 1 | 313 | contiguous 1–313 |
| 4 | Virata | 2 | 72 | contiguous 1–72 |
| 5 | Udyoga | 2 | 199 | contiguous 1–199 |
| 6 | Bhishma | 2 | 124 | contiguous 1–124 |
| 7 | Drona | 2 | 200 | literals 54, 55 and 189 are absent; last is 203 |
| 8 | Karna | 3 | 96 | contiguous 1–96 |
| 9 | Shalya | 3 | 65 | contiguous 1–65 |
| 10 | Sauptika | 3 | 18 | contiguous 1–18 |
| 11 | Stri | 3 | 27 | contiguous 1–27 |
| 12 | Santi | 3 | 362 | literals 34, 35 and 364 are absent; last is 365 |
| 13 | Anusasana | 4 | 168 | contiguous 1–168 |
| 14 | Aswamedha | 4 | 92 | contiguous 1–92 |
| 15 | Asramavasika | 4 | 39 | contiguous 1–39 |
| 16 | Mausala | 4 | 8 | contiguous 1–8 |
| 17 | Mahaprasthanika | 4 | 3 | contiguous 1–3 |
| 18 | Svargarohanika | 4 | 6 | contiguous 1–6 |

Every source unit has a reconstructible source hash, ebook, volume, parva,
source-relative ordinal, literal marker, byte interval, and span hash. Within
each volume those units cover every byte from the selected first body header to
the Project Gutenberg end marker exactly once. The provider header, footer,
license and trademark framing remain outside the source-unit denominator.

The literal anomalies are not repaired or used as unique identity. Stable
identity is the retained source hash plus parva, source-relative ordinal and
byte span. This permits later consumer synthesis without pretending that the
electronic numbering is gap-free.

## Rights and product lane

The source is qualified for Devam synthesis with provider framing excluded.
The internal determination combines:

- the four current official Project Gutenberg records and their United States
  public-domain statements;
- the exact retained ebook licenses, which require jurisdiction awareness and
  separate the underlying text from Project Gutenberg trademark framing;
- the nineteenth-century publication history and secondary authority-linked
  biographical record for Kisari Mohan Ganguli (1848–1908); and
- [section 22 of India's Copyright Act](https://www.indiacode.nic.in/show-data?actid=AC_CEN_9_30_00006_195714_1517807321712&orderno=23&sectionId=14525&sectionno=22),
  which states the life-plus-60-years term for published literary works.

This is a documented India/United States product determination, not legal
advice. It must be revisited for materially different jurisdictions or
redistribution models. Devam's consumer narrative will be newly authored Hindi
and English synthesis grounded in this expression; it will not present the
Project Gutenberg file or its license/trademark wrapper as app story content.

## Reproducibility

- Plan: `ingestion/plans/mahabharata-kisari-mohan-ganguli-project-gutenberg-source-qualification-v1.json`
- Deterministic report: `ingestion/reports/mahabharata-kisari-mohan-ganguli-project-gutenberg-source-qualification-v1.json`
- Compiler: `tools/qualify_ganguli_mahabharata_sources.py`
- Test: `tools/test_qualify_ganguli_mahabharata_sources.py`
- Source-unit root: `e476857f386c8faf48be9463d0cba9523f68652bdb8e14fc6951727f04d1040c`

Run:

```powershell
python tools/qualify_ganguli_mahabharata_sources.py --check --stats
python -m unittest tools.test_qualify_ganguli_mahabharata_sources
```

The next product boundary is not more source bureaucracy. It is an ordered,
beginning-to-end consumer story plan that maps every one of these 2,107 units
exactly once into substantial English and Hindi narrative moments, then adds
characters, kingdoms, places, teachings and separately governed living-world
connections for Atlas, Search and Sarthi.

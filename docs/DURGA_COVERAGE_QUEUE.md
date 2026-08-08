# Durga and Devi coverage queue

This queue keeps the Durga hero universe aligned to the MVP’s broad-library
objective. A source checkpoint is not the same as complete Durga, Navaratri, or
Durga Puja coverage.

## First retained source checkpoint (2026-08-06)

The retained GRETIL electronic text *Mārkaṇḍeyapurāṇa, 1-93* is now registered
by reference as one edition of the Markandeya Purana. The exact live GRETIL TEI,
plain-text, and HTML representations still match the restored vault bytes:

| Representation | Bytes | SHA-256 |
|---|---:|---|
| TEI | 750,567 | `7f2db461e724c675317130c653258a4b277e647e938b946b40687decd535111e` |
| Plain text | 622,185 | `edf27fa1c912bc1d9926a0b94ca7ebede0f100bc00ce18c9a4cbfd58491f3a9e` |
| HTML | 1,014,842 | `ce8bec69069f52254d880c6a49e5cd03aa5adbf5683436e432067b77f5039167` |

The provider grants CC BY-NC-SA 4.0. Devam therefore stores the rows in the
schema’s `private_evidence` lane for internal review; this is not clearance for
the paid/public product. No source payload was copied or uploaded.

The source’s own header says chapters 94 onward are unavailable. It is not a
complete Markandeya Purana. Within the fixed carrier, chapters 81–93 form a
terminally closed Devīmāhātmya sequence. The packet indexes those thirteen
chapters as exact TEI byte spans. It also preserves rather than repairs:

- a missing literal verse-reference marker 6 in chapter 86, despite 20
  verse-group elements; and
- the colophon spelling `devīmāhatmye` in chapters 84, 89, and 91 versus
  `devīmāhātmye` in the other ten indexed chapters.

Deterministic fixities:

- plan: `ingestion/plans/durga-markandeya-purana-devimahatmya-v1.json`, file
  SHA-256 `fb988b5c18a07e6248d6e7809d18c6f7300021958cdcf64835fb9daf0b93514f`;
- compiler: `tools/compile_gretil_devimahatmya_ingestion.py`, file SHA-256
  `7d3ff120db12b838df8a904e9b905e99a0fc08e8046fa69f887d874615c3ddfa`;
- packet SHA-256
  `274ec7d2e0ab9bcf054401f733a3d5566ba121aa02ebc8642bd930d74e4cf319`;
- SQL SHA-256
  `dda34ee99924409983cf24661580b0e1f2cc9ad4c365795019c2fc4ff83c8061`;
- passage-content root
  `bced91507605e62bc07406b8eeaee09fdaf3aa2d0b535f72a7cc8902998d6891`;
- 3 source references, 2,387,594 referenced bytes, and 13 indexed chapter
  passages; and
- 19/19 ingestion/compiler tests pass.

The hosted database reproduced the exact chapter sequence, passage root,
rights/state boundaries, and chapter-86 gap after two complete idempotent runs.
Anonymous clients cannot read the review rows, and the source bucket remains
empty.

## Devigita theological-source checkpoint (2026-08-06)

GRETIL item `GRE-00088` / retained lead `AQ-00712` is now registered as a
separate Sanskrit electronic transliteration of the *Devīgītā*. Its title and
literal verse crosswalk identify the exact boundary as *Devībhāgavata Purāṇa*
book 7, chapters 31–40—not the full Purāṇa. Fresh normal-TLS requests reproduced
all three retained representations exactly:

| Representation | Bytes | SHA-256 |
|---|---:|---|
| TEI | 97,174 | `b5fd8a711a2b06583f4b4208ee680e06f3d645507b8ccea82ba64b3a4a4fddfe` |
| Plain text | 76,378 | `50a39ee91554b90f66271060b991a289e63927389c1c0c60a8f7e212c41f29bd` |
| HTML | 123,053 | `f1d143c51675de026cf2923a6ed2486015414a6b51f2561cf7529d2c5b741a49` |

The TEI attributes data entry and the GRETIL contribution to Ursula Honegger,
legacy normalization to Reinhold Grünendahl, and TEI conversion to Maximilian
Mehner. Its `sourceDesc` is empty, so the underlying print/manuscript edition is
not identified. The GRETIL representations carry CC BY-NC-SA 4.0 and therefore
remain private review evidence rather than paid/public product content.

Devam indexes all 559 top-level textual source elements across Devīgītā
chapters 1–10: 510 elements with exact `Dg_x.y = DbhP_7,z.y` verse crosswalks
and 49 non-verse heading, speaker/context, or colophon elements. Both the
Devīgītā and parent-Purāṇa chapter/verse sequences are contiguous through
`Dg_10.45 = DbhP_7,40.45`, followed by the explicit `devīgītā samāptā`
terminal formula. Each citation remains bound to the immutable TEI byte span.

Deterministic fixities and hosted closure:

- plan SHA-256 `d83ee402477f8a8af8887870984e45c357a9cf812f005bd8bffc00abc336fcaa`;
- compiler SHA-256 `9329eb2c426a43772d80e9a724db4a31652576b2eabc6f095c5dc2688deb349c`;
- test SHA-256 `93601b803452c09f8a582c987c96056ad4227b2337c87d93375d27a8be750e2b`;
- packet SHA-256 `4f643e1db25e5f7ee2ff963037c23df240ca4bc2ba272fa3ef2f275a3c6030cb`;
- SQL SHA-256 `3082b767e94322516ca152473a0522ccda9d7bfd41bafe26129da684029a3f4b`;
- locator-bound passage root `7b56edf25fe0aaf605dd30f5fc359db3b289082d4a0c9bc3f38034c822029e52`;
- independently reproduced hosted text/span root `014a04bdae9cab50e9302cab2d8b3339adab4f9d24b6a74106f58cea91b60078`;
- hosted closure of 3 source rows / 296,605 referenced bytes / 559 passages /
  exact per-chapter counts / 0 carriage-return rows; and
- no carrier copy or object-storage upload.

This checkpoint strengthens the Durga/Devi philosophical and practice source
layer. It does not complete the *Devībhāgavata Purāṇa*, establish an
edition-identified Devīgītā, supply translations/commentaries, or complete the
Durga, Navaratri, and Durga Puja universes.

## Product-usable Ambuda stotra checkpoint (2026-08-06)

Five separately identified Sanskrit Devī works from Ambuda are now registered
in the `derivative_allowed` lane: *Bhavānībhujaṅgam*,
*Bhramarāmbāṣṭakam*, *Devībhujaṅgastotram*,
*Devīcatuḥṣaṣṭyupacārapūjāstotram*, and *Lalitāpañcaratnam*. Fresh normal-TLS
requests to each exact Ambuda `/about` page returned HTTP 200, strict UTF-8,
unchanged final URLs, and the exact CC0 1.0 statement. The database references
the ten existing content-addressed TEI/plain-text objects; it does not copy or
upload their bytes.

The five TEI expressions contain 132 ordered `lg` citation units (17, 9, 28,
72, and 6 respectively), literal markers beginning at 1 and ending at the
observed unit count, and explicit terminal formulas. The source descriptions
identify the 1910 Sri Vani Vilas Press volumes and attribute the works to Ādi
Śaṅkarācārya, but those attributions remain source-specific and the electronic
texts have not yet been reconciled line by line to page images. Accordingly,
the records remain in review state. The 72-stanza
*Devīcatuḥṣaṣṭyupacārapūjāstotram* is retained as a devotional source about
forms of offering; it is not promoted into a universal puja procedure.

Deterministic and hosted fixities:

- plan SHA-256 `8ee1871cc7adc8ae419060f8224ef42ed045726ede7fbca23412e3aaf695e683`;
- compiler SHA-256 `1bdbe501be0dcaf96eba7972273c6c1ec66c240a1dc1e26fe193ddcd820768fd`;
- independent batch-test SHA-256 `da769153c71de11a5618085dfe87a8dc2ad358c17f6ebd5d1a37f72799661479`;
- packet SHA-256 `c467fb1e3bf7d306f7d19cde0dc0b9140db813e6fad23e876788b334cacf672c`;
- SQL SHA-256 `0fad3b867ee0189233736f3f0ccc9072f095cf68f7d71b486e4399f9d626b396`;
- source-inventory root `e2d2f4146e56701668a12a7c35458dc41e4598c932c7d69ebc62cee2239dba1e`;
- passage-content root `b258189fdb4a726a487c4b86b8bf0357a9e9510a216c102c02ca240fc16ae908`;
- 10 source references / 128,868 referenced bytes / 132 passages; and
- all 48 repository ingestion tests pass.

Hosted Postgres independently reproduced both roots and all per-work passage
counts. Anonymous users see no review works and cannot read source-object or
passage tables; object storage remains empty. This adds reusable devotional
source depth, but does not complete Devī literature, Durga/Navaratri/Durga Puja
practice, Hindi/English explanations, or the MVP library.

## Historical Bengali Durga Puja checkpoint (2026-08-06)

Pratap Chandra Ghosha's *Durga Puja: With Notes and Illustrations* (Calcutta,
Hindoo Patriot Press, 1871) is now retained and registered as a complete fixed
scan of that edition. The title page identifies Ghosha and the publication
details; the preface describes the work as an account of the rites and
ceremonies of the principal Bengali festival and credits the illustrations to
Babu Tulsidas Pal. The work and Commons scan are public domain.

Six distinct representations remain content-addressed in `source_vault` and
are referenced without copying or uploading their bytes: the 193-page Commons
DjVu, Internet Archive PDF, OCR text, DjVu XML, page-number JSON, and scandata
XML. Together they total 14,811,580 bytes. Visual inspection binds the title,
preface, introduction, thirteen main headings, the 83-page main account, the
70-page notes appendix ending with note 59, and the subsequent blank and
library leaves.

The provider OCR is useful discovery evidence but Wikisource still marks the
transcription “to be proofread.” Devam therefore stores 193 page-addressed
citation records in `review` state with
`provider_ocr_quarantined_unreviewed`: 183 contain provider OCR and ten bind
empty/blank pages. Each record carries the exact OCR XML byte span and both PDF
and DjVu image-source hashes. None is available to anonymous clients or public
search.

Deterministic and hosted fixities:

- plan SHA-256 `c4583c1b830b3f7d46f9cb9b3017cec01763dffe9b6dc63d2abe855ce54b2a1b`;
- compiler SHA-256 `9dde122dd1d9287c6a0e266c6bc40769883e482e55cf414b46c85770f1f39603`;
- test SHA-256 `07b6239223bb9e10d9cdf236bc1e4631082e64dfc8093fb2646bf0ad233d9209`;
- packet SHA-256 `65cb985da95c786bc1b99cf65084f1b244b111c48d0322116a3ee75420423d4f`;
- SQL SHA-256 `bba1f6a4e5baf6b5ae26c844ae2465d984f10c2763378776b39736c545043caa`;
- page/span/text/role root
  `e133e26b749d1398aa0338fcc829af8b65a6015fa97cfad4674b71aa8215265c`;
- hosted closure of 1 work / 1 expression / 1 edition / 6 source references /
  14,811,580 referenced bytes / 193 page citations; and
- anonymous target work lookup returns an empty array, source-object and
  passage endpoints return 401, no works or passages are published, and object
  storage remains empty.

This is a rich historical source for nineteenth-century Bengali practice and
variation. It is not a current universal vidhi, all Bengali family traditions,
all regional Navaratri/Durga Puja traditions, corrected OCR, or complete Durga
and MVP coverage.

## Complete Pargiter English Markandeya Purana edition (2026-08-06)

F. Eden Pargiter's *The Mārkaṇḍeya Purāṇa* (Bibliotheca Indica, Asiatic
Society, Calcutta, 1904) is now retained and registered as a complete fixed
edition. The title page identifies Pargiter as translator with notes. His
preface and introduction state that the work was prepared for the Asiatic
Society, follows K. M. Banerjea's 1862 Bibliotheca Indica edition, and also
consulted other editions and manuscripts.

Four useful representations remain content-addressed in `source_vault` and are
referenced without copying or object-storage upload: the 778-page image PDF,
OCR text, DjVu XML, and scandata XML. They total 65,517,930 bytes. Visual and
byte-level inspection binds the title, preface, introduction, contents,
additions and corrections, all 137 cantos, the main terminal formula on printed
page 688, the separately printed Calcutta-edition alternate ending on page 689,
the index through page 730, four blank leaves, and the binder leaf.

The edition clarifies a useful Durga boundary. Its contents says that the
Devīmāhātmya properly begins with Canto 82. Devam therefore preserves Canto 81
as opening narrative context, Cantos 82–92 as the poem proper, and Canto 93 as
the closing narrative frame. This does not overwrite the broader 81–93 boundary
used by the separate GRETIL witness.

All 778 pages have stable PDF/image and OCR-XML coordinates. Provider OCR is
stored only as `provider_ocr_quarantined_unreviewed` in `review` state: 768
records contain OCR and ten bind empty pages. The complete scan is usable as
image evidence, while OCR is neither corrected nor public-search ready. The
provider description says `dc.rights: In Public Domain`; top-level IA rights
and licence fields are null. The 1904 translation is routed to
`derivative_allowed` for India and jurisdictions where the publication and
translator term have expired, without claiming universal worldwide clearance.

Deterministic and hosted fixities:

- acquisition plan SHA-256 `9b1501811c10f8a1937a27638e8e13183fdd0b0a7dacab9ab8e0e93a33332b2f`;
- ingestion plan SHA-256 `fe1102e0624286cf2676da7249b52e7bca69f3310ba6008b82312b1fc04c9773`;
- compiler SHA-256 `01f8e07848ab7fc96b01fbf607a45ebe4b3d6169387e0a074956753d5ca4f4ea`;
- test SHA-256 `6ccca5e74a521356c334ccb85df0d3c601d68c480392a7f5143f772ff4ca065a`;
- packet SHA-256 `9b7ccd43163cadd84f3c41a8c4fbacf40205e4539678c2b51da16829fe257969`;
- SQL SHA-256 `d618aa4e247e2e1b1866bf743b96e67c3b94bd115a0a5298b2d14b474d1fbb6d`;
- page/span/text/role root `c845a52904fdc92134e93f3c46064445eecb400e08db459b7d235d10bfca9a65`;
- hosted closure of one English expression, one edition, four source references,
  65,517,930 referenced bytes, and 778 page citations; and
- zero UTF-8 identity mismatches, zero rights/quarantine mismatches, no
  published rows, anonymous work lookup empty, source/passages HTTP 401, and
  object storage empty.

This closes one complete historical English edition. It does not establish all
Mārkaṇḍeyapurāṇa recensions, a Sanskrit original for this edition, a modern
corrected translation, every Devīmāhātmya witness, Hindi coverage, the complete
Durga universe, or MVP-library completion.

## Selected Pargiter Devimahatmya product passages (2026-08-08)

The fixed Pargiter PDF now supports seven published English passage units for
Search and Sarthi: the combined divine energies becoming the goddess (Canto
82), Mahiṣa's defeat (83), the goddess among all beings (85), the withdrawal
of the many forms (90), Nārāyaṇī as intelligence in every heart (91), the
source's own claims about hearing the poem (92), and the terminal departure
(93). Their PDF pages are 517, 524, 534, 553, 556, 562 and 566; the combined
selected-text root is
`94d4ca27d343fb78283c702c5bfee7109931417fa84c5b962eb6a0f6d16be17b`.

The wording is visually checked against the fixed scan and represented as a
source-aligned normalized transcription: Unicode transliteration and compact
whitespace replace printed line wrapping, footnote markers and typography.
The complete scan remains the sole source carrier. A public web transcription
was used in memory only as correction evidence; it was neither retained nor
made a product source, and its rights were not inherited. The 778 provider-OCR
rows remain unmodified and unsearchable, while the CC BY-NC-SA Sanskrit GRETIL
expression remains private review evidence.

The hosted import passes exact text-hash, hierarchy, rights, OCR-quarantine and
sibling-isolation checks. Anonymous passage search returns the Canto 91 unit
for `heart of every living creature`. Source statements about boons and
results remain attributable historical-source claims, not guarantees or
universal ritual instructions from Devam or Sarthi. See
`ingestion/reports/markandeya-purana-pargiter-devimahatmya-selected-passages-v1.json`.

This closes a useful selected English evidence lane. It does not complete the
English Cantos 81–93 transcription, Sanskrit or Hindi product text, every
Devīmāhātmya edition or recension, Durga practice, or the Durga hero universe.

## Complete Vijnanananda English Devi Bhagavatam compilation (2026-08-06)

The fixed Internet Archive carrier for Swami Vijnanananda's English
*Śrīmad Devī Bhāgavatam* is now retained and registered as one complete digital
compilation. It is an 865-page Acrobat Web Capture PDF made in 2008 from a
2004–05 scanned/proofed web text of the 1921–22 translation; it is not an
original printed-edition scan. The carrier contains all twelve books and ends
with the explicit statements that the Devī Bhāgavatam and the full treatise are
completed, followed by `Om Tat Sat`.

Four distinct representations remain content-addressed in `source_vault` and
are referenced without copying or object-storage upload: the PDF, OCR text,
DjVu XML, and scandata XML. They total 34,679,135 bytes. All 865 pages have
stable image/OCR coordinates; 864 contain provider OCR and page 5 is empty.
OCR remains `provider_ocr_quarantined_unreviewed` in `review` state.

The source materially advances the launch Durga/Navarātri layer. Its fixed page
map locates Book III Chapter 26 (what is to be done in Navarātri), Chapter 27
(Kumārī worship), Chapter 28 (Navarātri incidents), and Chapter 30 (Nārada's
description and Rāma's performance), as well as the final recitation chapter.
These are attributable historical-source passages, not automatically current,
universal, or normative ritual advice. The full 318-chapter start map has not
yet been reconciled, so citations use unambiguous carrier page and OCR-byte
coordinates rather than inferred chapter identities.

Deterministic and hosted fixities:

- acquisition plan SHA-256 `76034ce3fd2978cf397522d8c01ab648a20d7eb4fdc7dbc1a6aba23ae2d09cea`;
- ingestion plan SHA-256 `9271edd25eacf823c8ed79d43cf4ca5d4ff40beeaa235b90491e98f0a75d9481`;
- compiler SHA-256 `f10076a450bb812970e5c07d3da8352aab8f862748b14e1edf0292d0aa9a5188`;
- test SHA-256 `d62eeb815bb10c0d7a91f475ead01695060ac40396c6cfd3ce479ab4f70c4560`;
- packet SHA-256 `4410de730dc585de7ee65c8b223ccfcfab7b0dace4f77256fbabb08c414f0c5e`;
- SQL SHA-256 `fde79bd68a98e0d2b64d74f3e01013ca77ab95ce13024250e44ecd4cd9c68839`;
- page/span/text/role root `2cc8846604893951fca821db18b363a73a3d2a884517ac6b227e0f56ca8ce9fd`;
- hosted closure of one work, one English expression, one digital edition,
  four source references, 34,679,135 referenced bytes, and 865 page citations;
- exact twelve-book page sequence `6, 61, 92, 198, 288, 377, 456, 558, 597,
  745, 767, 829`, zero quarantine-boundary mismatches, and zero published rows;
  and
- anonymous work lookup returns an empty array and object storage remains empty.

The uploader applies a Public Domain Mark. Product use is routed to
`derivative_allowed` for India and other jurisdictions where the historical
translation term has expired, without turning that label into universal
worldwide clearance. Historical caste- and gender-exclusionary prescriptions
remain attributable evidence and must not silently become Sarthi advice.

This closes one complete fixed English digital compilation. It does not close
the Sanskrit source, all editions or recensions, Hindi coverage, a fully
reconciled chapter map, current regional ritual practice, the Durga hero
universe, or the MVP library.

## Bengal participation checkpoint (2026-08-07)

The six-day Kolkata/Bengal campaign now has one bounded bilingual participation
companion. It uses fresh official Ministry of Tourism, Government of West
Bengal, and Belur Math context to support source-labelled Durga remembrance,
community and artistic appreciation, respect for women, service, and safe
participation. Belur Math's detailed institutional sequence is evidence of what
the generic app must not reconstruct: formal Bodhan through visarjan, Kumari
and Sandhi Puja, bali, and homa remain under the responsible local authority.
The pack SHA-256 is
`78b96891f2197405086ac3c3a1b50e68a6fbb83c129794a6ae0c8fc13b0ab396`.
This closes one participation layer, not Bengali household vidhi, bonedi-bari
variants, every puja committee or Shakta lineage, or the Durga hero universe.

### Held internal-only Devīmāhātmya edition (2026-08-07)

The 1831 Ludovicus Poley edition was acquired once into the content-addressed
source vault as PDF object
`69a59f17fb29d12fbc7d0b0201ee7f07bac62fbf5b306ef3c032b84266a82d79`
(27,205,020 bytes; 161 PDF pages). Visual inspection establishes the exact
title-page role—Poley edited the Sanskrit section, supplied the Latin
translation, and added annotations—and a complete edition structure: thirteen
Sanskrit chapters, thirteen Latin *Cantus*, annotations, word index, and
corrigenda.

This carrier is **not** the required product source. PDF page 1 states that the
Bavarian State Library files are provided only for personal, noncommercial
purposes. That fixed-carrier term overrides the looser Internet Archive metadata
label for Devam routing. The object remains internal evidence only; it is not
available to Search, Sarthi, APIs, vectors, training, or public delivery. The
provider OCR was severely garbled, was inspected only in temporary workspace,
and was not retained or promoted. See
`ingestion/profiles/devimahatmya-poley-1831-fixed-carrier-profile-v1.json`.

### Held 1919 Durgasaptashatipradipa ritual-commentary witness (2026-08-07)

The fixed 82-page carrier previously surfaced by the provider as a complete
"Durga Saptashati with Durga Pradipa commentary" is now correctly bounded. The
content-addressed PDF object is
`00cd5a20601177eb3258980f17c7e495af1ac6ceb0879a67c31f296c57729e93`
(25,085,595 bytes). Its visual title leaves identify
`अथ दुर्गासप्तशतीप्रदीपः` and `अथ काम्यप्रयोगविधिः`, not a continuous complete
thirteen-chapter Devimahatmya main text. The carrier contains recitation order,
puja and yantra material, nyasas, dhyana, mantra-japa and Ratrisukta material.
PDF page 70 explicitly instructs `सप्तशती पठेत्` - recite the Saptashati at that
point - instead of supplying the complete 700-verse text.

PDF page 79 binds the historical printing to Hariprasada's son Vrajavallabha
Sharma, the Mumbai Vaibhava press, Saka 1841 / Vikram Samvat 1976 (1919 CE).
Page 80 carries `इति दुर्गासप्तशती समाप्ता`; this proves a terminal leaf for the
manual, not internal main-text completeness. Pages 81-82 are modern collector
portrait/CV leaves. The exact CC0 digitization and Jagannath Bhattarai Collection
overlays occur on all 82 PDF pages, but the 1919 imprint also records historical
rights language and the underlying edition rights were not separately
adjudicated. The object therefore remains a held historical ritual-commentary
witness and is not available to Search, Sarthi, APIs, vectors, training or public
delivery. Temporary provider OCR was used only to navigate the fixed scan and
was not retained as a source object. Profile SHA-256:
`b24b16e75115a3d09f6012aba81c06d6592268d9c79d0c2cb57330b7517573e8`.

This correction preserves a valuable ritual-history source while keeping its
ritual-commentary boundary separate from the main Sanskrit text.

### Product-usable exact-revision Sanskrit text checkpoint (2026-08-08)

Three exact Sanskrit Wikisource revision payloads covering Markandeya Purana
chapters 81-85, 86-90 and 91-93 are now acquired once in the content-addressed
vault and published as source-aligned passage projections. Together they
contain a continuous thirteen-chapter Devanagari marker sequence with chapter
terminals 78, 70, 44, 38, 79, 20, 26, 61, 39, 27, 51, 38 and 17. Chapter 86
marker 6 is present as `॥८६. ६॥`; whitespace-sensitive parsing was the reason
the private GRETIL profile appeared to lack that literal reference. The
Wikisource structure therefore crosswalks to the retained GRETIL witness, but
line-by-line identity and an underlying print edition or recension remain
unproved.

The site's official API reports CC BY-SA 4.0. The exact revision, content-hash,
rights and held-alternative observations are frozen in
`ingestion/reports/devimahatmya-sanskrit-wikisource-readonly-discovery-v1.json`
(SHA-256
`fd7519ffc1d43f050d47b8ec7fbe8f0e493aaa901f517aa6eb53075b64532d60`).
The acquisition plan is SHA-256
`58dec9d9d9b197e40a37ed90bc461dc5d2243399ab5662f9af6d61335ee87a3c`;
the acquisition report is SHA-256
`94f2a3ce1c9f66b0ccd3d57fcc3c4f2633277a2a4b821cf4d1eac2eabdd3950c`.
The compiler binds all 588 verse passages to exact source-object, byte, line,
chapter, verse and global citation ordinals. Its chapter-span root is
`9af7156e6144dfb57d58a8c91c229a679035c4575ebd969df6574c97f176ad98`;
its passage root is
`787a25875cdcab14e6b8ffee9c9772f71c7ade6c615abc20accb8471fe728b93`.
Hosted Postgres independently reproduces the 3-source / 161,075-byte / 13-
chapter / 588-passage inventory and the exact passage root. The public safe RPC
retrieves the Sanskrit passage at chapter 91, verse 2 with its immutable source
and span hashes. The CC BY-SA attribution/share-alike lane is preserved.

This completes only the exact three-revision Sanskrit provider sequence. It
does not identify the underlying print edition or recension, prove a critical
text, reconcile every line to a scan, complete the Markandeya Purana, or
complete the Devimahatmya tradition.

## Complete exact-revision Devam beta translations (2026-08-08)

All 588 Sanskrit passages in the pinned provider-revision sequence now have
distinct English and Hindi source-aligned Devam beta translations. The 1,176
translation claims retain their exact Sanskrit passage links, language,
chapter, verse, source revision, attribution, uncertainty, applicability and
rights boundaries. The draft SHA-256 is
`c2250ef4e7254f77600ea3e3751ff69f5c72c64ba36765c4152db8973ac46396`;
the semantic translation root is
`1b90ceacb6e4bab0ca043b23277b64bf0837ab4d15a6c7d3b4c5cb129a7da3f2`.
Hosted verification passes for all 1,176 claims and 1,176 evidence links, and
the public retrieval path returns corresponding English and Hindi source-
grounded answers. Source-attributed protection, healing or offering language
is never promoted into a Devam guarantee or unsafe instruction.

This is AI-assisted internal-beta editorial translation, not source-original
text or an independently Sanskrit-reviewed translation. It does not identify
the print edition or recension, establish ritual authority, reconcile every
witness, complete the wider Devi tradition, or prove devotional outcomes.

## Required next Durga lanes

1. Identify and reconcile an underlying print edition and recension for the
   product-usable exact-revision Sanskrit Devimahatmya sequence.
2. Independently Sanskrit-review the complete source-aligned English and Hindi
   beta translations while keeping them distinct from the Sanskrit and from
   each other.
3. Source-original Sanskrit and additional edition-identified Devī Bhāgavata
   witnesses, a strong Hindi expression, the Kālikā Purāṇa, and additional
   edition-identified Devīgītā witnesses. One complete English digital
   compilation is retained; the private GRETIL Devīgītā transcription still
   covers only Devī Bhāgavata 7.31–40.
4. Navaratri and Durga Puja procedures by region, sampradaya, and family
   practice, including minimum/standard/elaborate forms, materials, timing,
   substitutions, and sources.
5. Navadurga identities and day-by-day observance layers.
6. Shakti Peetha and major temple dossiers with history, narratives, geography,
   iconography, festivals, and current-practice evidence.
7. Bengali and other authoritative regional-language sources whose distinct
   practice or interpretation cannot be replaced by Hindi/English translation.

All lanes feed source → passage → claim → relationship → Atlas/Sarthi/Search.
Nothing here establishes complete Durga, complete Navaratri, complete Durga
Puja, all Devīmāhātmya recensions, independently reviewed Hindi/English
coverage, or MVP completion.

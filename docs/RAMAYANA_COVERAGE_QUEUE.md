# Ramayana coverage queue

This queue keeps the Ramayana launch universe aligned to Devam's exhaustive-library objective. One English edition—even a large and useful one—is not the Vālmīki Rāmāyaṇa, the Ramayana tradition, or a finished hero universe.

## Griffith / Project Gutenberg checkpoint (2026-08-06; product promotion 2026-08-08)

Project Gutenberg eBook 24869, *The Rámáyan of Válmíki, translated into English verse* by Ralph T. H. Griffith, is registered by reference. Fresh normal-TLS requests exactly reproduced the six indexed restored representations:

| Representation | Bytes | SHA-256 |
|---|---:|---|
| RDF metadata | 479,730 | `6937a2262660731f0931820941facd315db0033c39960bdf4787ee92873b85e5` |
| canonical UTF-8 text | 2,395,956 | `4310b710a9c6942490bf8270a8a6620f314dcc2adf7b413833596ca9aaebca6f` |
| BOM UTF-8 text | 2,396,753 | `50c0aa1f9b4e189b7ecda3f16808b560fa4baa18bd0fdc26fa381ebe6338cb0d` |
| HTML | 6,509,441 | `8be0cc37cddf878ba622356385aec754b53d8b596b8743b6e78b1936d2d16895` |
| PDF | 8,631,418 | `755f4620bae30aa0c6a22f94cbcd5fca25815a7188f51edfa2fd74f0f2c21da1` |
| structural TEI | 3,045,202 | `1fa8d3e9da23d83abd334661db3a95574bfd6290943441c374d9bce4ef142ed9` |

The full restored Project Gutenberg carrier universe remains in `source_vault`: 600 unique carriers, 124,221,436 bytes, normalized inventory root `d65aa8292bccc25aba97c27c1e026c638a752c6af062b1f7922a590b29fbbd4a`. The database indexes only the six structurally useful representations above. No carrier bytes were copied into the app or Supabase.

### Exact structural boundary

The TEI carrier contains six main books, not seven. It also contains invocation, appendix, additional notes, index, and footnotes. Devam indexes every non-empty leaf `div` as a byte-addressed citation unit:

- 560 passages total;
- 493 canto units;
- 5 appendix sections;
- 57 additional-note sections;
- 2 front-matter units, 1 invocation, 1 index, and 1 footnotes unit; and
- 3 empty generated TEI placeholders bound separately but not indexed as fake text.

The carrier is not strict standalone XML: it has an external DTD and one undefined `&mdash;` entity at byte 28,011. Parsing uses one declared, hash-bound in-memory replacement while all citations continue to address the immutable raw bytes.

Literal canto-number gaps are preserved in Books I, V, and VI. Most importantly, the Book V header says Griffith omitted long passages of description, lamentation, and repeated stories. Therefore this is an exact Griffith/Project Gutenberg edition checkpoint with omissions—not a complete Griffith translation without omissions, complete Sanskrit source, Uttarakāṇḍa, or complete Ramayana.

### Rights boundary

Project Gutenberg's RDF says `Public domain in the USA.` The current text warns users outside the United States to check local law. A bounded 2026-08-08 determination now records the applicable India and United States basis for the underlying Griffith translation: the translation was published in 1870–1874, Griffith died on 7 November 1906, section 22 of India's Copyright Act uses a life-plus-60 term for published literary works, and the current United States public-domain cutoff includes works published before 1931.

Devam promotes only the structural TEI source reference and its 560 already-indexed, non-empty text units. Those units contain zero Project Gutenberg license, header, footer, URL, or trademark-framing references; the three empty generated `pgheader`, `encodingDesc`, and `pgfooter` divs remain excluded. The provider name is retained only as bibliographic provenance. The five other indexed representations remain `private_evidence`, no carrier was copied or uploaded, and no reader was created.

This is product clearance for the exact extracted electronic-edition units in the India/United States launch boundary, not a claim that the edition is complete: it still has only six main books, no main Uttarakāṇḍa, an explicit Book V omission notice, and literal canto gaps.

### Deterministic fixities and hosted closure

- plan: `ingestion/plans/ramayana-griffith-project-gutenberg-v1.json`, SHA-256 `c154f3ab85079c8b5e16c191a355ea5dc2bfcb4107a318a56b4f825f5fb3fac4`;
- compiler: `tools/compile_project_gutenberg_ramayana_ingestion.py`, SHA-256 `d35170d1d21acc03681ce0ae6f78502bd1c567eb754970b52438f6e8eb93444e`;
- compiler test: `tools/test_compile_project_gutenberg_ramayana_ingestion.py`, SHA-256 `46e5cc311df96b739e8b984a75932f64ad690243490e46bb805948685c3d39ba`;
- packet SHA-256 `80a64ddf9897573f450783db885f3e434ef5d1e3f8672512c070aec512cfbf2f`;
- SQL SHA-256 `cc4ddb9eeef40243a80f7890f00de256e18bc8823fc56c625d0c3924ea8e78b7`;
- locator-bound passage root `e0c62543a911092244d9ec03d413cca178b968cd99de2b9fe8f10d261cebe5d4`;
- independently reproducible hosted text/span root `be613cd8b4615a7746cf0ffdafdbfc7b6742c1c5e1d43fe23aab4ee9f8197e62`; and
- 28/28 ingestion compiler tests pass.

Hosted Postgres exactly reproduces 6 source rows, 23,458,500 referenced representation bytes, 560 distinct ordinals, all required locators, 493 canto units, 57 note units, and 5 appendix units. The product promotion is frozen in `ingestion/reports/ramayana-griffith-project-gutenberg-product-promotion-v1.json`, SHA-256 `ddadc819e4df30792812c8a217c5626f419472fcd109782e86a09e953a6c579f`. Its plan SHA-256 is `c1647a70d57dab0af8d74d8ab8f3075ce948f22a0dda4fcc778c9a08f819c3d3`, its SQL SHA-256 is `3273214461713fecd867cd1bf7774d04d02f051fcf360d6d8eda9bbd51614d20`, and 7/7 promotion tests pass. Hosted verification reproduces the same `be613cd8b4615a7746cf0ffdafdbfc7b6742c1c5e1d43fe23aab4ee9f8197e62` text/span root. Exactly one structural source and all 560 passages are `product_allowed` + `published`; the anonymous exact-passage RPC returns Griffith results, while five non-TEI source rows and the unrelated private Ramayana expression remain private.

## Seven-kāṇḍa Sanskrit checkpoint (2026-08-06)

GRETIL's `sa_rAmAyaNa` is now registered as a separate Sanskrit electronic transcription. The carrier attributes data entry to Muneo Tokunaga, first revision and GRETIL contribution to John Smith, and later GRETIL normalization/TEI conversion. Its source description is only `John Smith's Rāmāyaṇa-Page (last comparison: 2020-04-16)`; it does not identify a print or manuscript edition.

Fresh normal-TLS requests exactly reproduced all three retained representations:

| Representation | Bytes | SHA-256 |
|---|---:|---|
| TEI | 4,244,751 | `a569551e8a972935d540bc53e57effa919868367234ab3b5334d07a1e7f84901` |
| Plain text | 2,406,915 | `d32e1817f7a789a0d1bf370ea95ed463435e524de2366e4db73dac3c448b6091` |
| HTML | 4,938,140 | `d33e754d2e6e13b30e2f38e6a939e85fc783d233c2914e23f285d432d21155fe` |

The fixed TEI has seven kāṇḍas, 606 sargas, 18,761 uniquely identified verse groups, 38,043 lines, and fully contiguous literal verse IDs within every sarga. It runs from `R_1.001.001` through terminal `R_7.100.026`. Devam indexes all 606 sargas as exact raw-TEI byte spans with book/sarga/verse boundaries.

The GRETIL license is CC BY-NC-SA 4.0, so the entire packet remains `private_evidence` + `review`. Seven-book structural coverage is positive evidence only for this exact carrier. It is not an identified print edition, critical edition, complete textual tradition, all recensions, a Hindi/English expression, or paid/public product clearance.

The current Ambuda DCS source is deliberately separate. Devam acquired the official DCS `ramayanam.txt` (7,414,730 bytes, SHA-256 `f8d45c1289b15182867bd0c94d15886f8d8b1b10c4e7fc9a9b6a78fd5142e3b8`) and its CC BY 4.0 README (215 bytes, SHA-256 `134c11945415556d6e86f17f3579c6fb69b559a90a5d38ccd841168b145c3583`). DCS contains 18,713 verse IDs: all occur in GRETIL, while GRETIL has 48 additional IDs and DCS has three local ordering anomalies. Devam does not merge or silently reconcile them.

Deterministic Sanskrit fixities:

- plan SHA-256 `7980fe2a576a2ffd782e8b1f2b4ce5596e235274b1ea0390f60cef58fc6aee08`;
- compiler SHA-256 `beb7c00340bcef00a455702da4eb3981aae2308e69af451b8762751cbc0ea5a8`;
- test SHA-256 `a9bc3665512064a54b4494389c5ce9a1aa217c5d98d39dcc33b92eb22a472086`;
- packet SHA-256 `8c098135b883469878f1fa747b1aba4129ac63219238a1b8ed7ee88b1735cc34`;
- SQL SHA-256 `ac0761492605372f5256d87004e1a416bd4601f934fd5b2e1cb02c17d2a626ed`;
- locator-bound passage root `054bb80efe4c31a477f35f6c335de9c26140445c282df503891019f755b421ca`;
- hosted text/span root `e244d2cc2257598d017b1602c053aaab87e1aeac04e64974bbfc9e400e427f1a`; and
- 3 source rows, 11,589,806 referenced bytes, and 606 sarga passages.

The first SQL transport normalized embedded LF characters to CRLF; hosted checksum comparison caught it. The repaired compiler transports UTF-8 passage text as ASCII base64 and reconstructs it inside Postgres. Final hosted verification finds zero carriage-return rows and exactly reproduces the local text/span root.

## Seven-sopana Ramcharitmanas checkpoint (2026-08-06)

The retained GRETIL item `GRE-00883` / legacy lead `AQ-01507` is now registered as a distinct Awadhi electronic transliteration expression of Tulsidas's *Ramcharitmanas*. It consists of exactly seven UTF-8 HTML carriers attributed to input “by a group of volunteers at Ratlam” and GRETIL Unicode conversion:

| Sopana | Carrier bytes | SHA-256 | Citation blocks |
|---|---:|---|---:|
| Balakanda | 323,713 | `070d32fdfbc30a1180857126a047f05be39f4d9bb5856effb2955e7c7e268019` | 824 |
| Ayodhyakanda | 268,981 | `39531b3869e24c7b70ba6a89a720ec5ff2aab30389056dce76a239f623c5724a` | 665 |
| Aranyakanda | 69,482 | `9484b6ccfa6593f4ba6acd1a508cbc0390226ce075312eb83b3206692c61d194` | 125 |
| Kiskindhakanda | 36,584 | `48e685579ddb473ffa4b06763691696a939ca80f4771ff4129abca13bfd61a23` | 67 |
| Sundarakanda | 60,294 | `caf4db4bce8249e600ee1a39e2b6df65457f14fee2f79624a951a017f77a54e5` | 133 |
| Lankakanda | 138,995 | `0e466561ef750caea4c4d795b8a8dd3bcdda88d0d38fd2898c68e601b2f7ed2b` | 333 |
| Uttarakanda + trailing arati | 148,584 | `392d3d52649280b8ba2369d12a05d454d57ef06884623dc4b913aeea053e45ff` | 393 |

Every carrier has an explicit sopana close. The Uttarakanda close is followed by a four-stanza *ārati*, which is preserved as four separately addressable trailing-matter blocks rather than silently folded into the final numbered unit. Across the seven sources, Devam binds 2,540 exact source-relative blocks and 1,343 literal number markers. Printed markers are not treated as unique citation IDs: identity is source hash + sopana + source-relative ordinal + raw HTML byte span.

The GRETIL header says `THIS GRETIL TEXT FILE IS FOR REFERENCE PURPOSES ONLY!` and `COPYRIGHT AND TERMS OF USAGE AS FOR SOURCE FILE.` The underlying source edition and its terms have not been identified. Therefore all seven sources and 2,540 passages remain `private_evidence` + `review`; exact-carrier structural closure does not imply product clearance, a critical/authoritative edition, every Ramcharitmanas recension, or every commentary, script, translation, performance, and regional tradition.

Deterministic fixities and hosted closure:

- plan SHA-256 `472363d780bc17188f69e8011d1501aa1c6587e80e70741f722e93b6933c38c0`;
- compiler SHA-256 `573ea196cd69495cc26904d2e1ec956783ee9169a2f5553a49022bf67dd7b6ce`;
- test SHA-256 `a673654c2a933ebecb387e5dc1048d299eb50d52f15e1b594ffc9fadb0026978`;
- packet SHA-256 `92a49415fae5bf4198edf9a37ea573d0bb9d2f382415fdcc52b496469f860f21`;
- SQL SHA-256 `da9bcc8c4b765a4f51e9c8b2668b19da6d644dd2db96ae98583200700fc0b124`;
- locator-bound passage root `e4b9dea9eebabc7eb9ada8528bfbff5ba1ff372ee836cafb240eb83bc9a46bfa`;
- independently reproduced hosted text/span root `7a10845761462247a66cfd2b42dc06142672b45fbe0b2484fb15aedf7a3e629f`; and
- hosted closure of 7 source rows / 1,046,633 referenced bytes / 2,540 passages / 7 terminal closures / 4 trailing-arati blocks / 0 ordinal gaps / 0 carriage-return rows.

No carrier payload was copied or uploaded. Supabase stores only content-addressed local-vault references and exact text projections behind existing private RLS boundaries.

## Belvedere Press Ramcharitmanas scan checkpoint (2026-08-08)

Devam now preserves one exact public-domain, illustrated and annotated
second-edition Belvedere Press scan of Tulsidas's *Ramcharitmanas*. The sole
content-addressed PDF is 78,560,265 bytes, SHA-256
`6d570d531ebada1912f6e930212393fec2200765a0b731b73b8e7135ea0f70f2`,
and 1,240 pages. No payload was copied into the app, profile, test, or generated
catalog.

The fixed carrier itself proves the title `सटीक रामचरितमानस`, Goswami
Tulsidas, the second-edition preface, editor Mahavir Prasad Malaviya Vaidya
`'Vir'`, Belvedere Press at Prayag, and a printed date line containing Vikram
Samvat 1982. The Hindi Wikisource index gives 1925; the DLI description gives
1926. Devam preserves both provider values while treating the carrier's
Vikram-Samvat literal as the primary fixed-edition evidence.

Every PDF page is accounted for exactly once. Front matter occupies pages
1-51. The seven main sopanas run from PDF page 52 / printed page 1 through PDF
page 1223 / printed page 1144, with visually verified starts and explicit
closes for Balakanda, Ayodhyakanda, Aranyakanda, Kishkindhakanda, Sundarakanda,
Lankakanda, and Uttarakanda. PDF page 1224 contains *Ramayana ki Arati*;
pages 1225-1236 contain the 12-page *Manas-Pingala* and its explicit close;
pages 1237-1239 are advertisements/catalogue matter; page 1240 is blank.

The PDF is image-only: all 1,240 pages have no embedded text. Therefore this is
a product-compatible public-domain scan and a structurally complete fixed
seven-sopana edition, but not searchable exact text. No OCR, transcription,
passage index, Sarthi/API/vector/training lane, or all-edition/tradition claim
is promoted. The partial Hindi Wikisource transcription, noncommercial GRETIL
transliteration, modern Gita Press editions, and any byte-distinct DLI/IA
representations remain separate.

Deterministic checkpoint:

- acquisition plan SHA-256 `c752fad4615fe643247715a97c614ecdba76670e72ef1650b8cf82dcc08f8c42`;
- structure profile SHA-256 `b8c3cb71887a80603455a9432ebd26f5ad62635e6bfc64f6fccace0efb6278f9`;
- structure result SHA-256 `04fae1e97d729ceb5c8f6109272189ad49582a2093be39bd186143e67c0c31e1`;
- profiler SHA-256 `86b188ff6108425d7e0cac7a2d28d31d61b1002b08103b1890486e4d2987d368`;
- independent test SHA-256 `53f588123a8640c94c9a7e49fe27ddcaed8d82773899e180096ef4b5a0cbde8e`;
- builder checks 12/12 and independent semantic tests 8/8 pass.

### Edition-matched OCR correction scaffold (2026-08-08)

The matching DLI/Internet Archive item exposes 18 representations. Devam did
not reacquire the original PDF and did not ingest the EPUB, 909 MB JP2 ZIP,
text PDF, duplicate hOCR forms, torrent, or metadata payloads. It selected only
four alignment-critical derivatives: plain DjVu OCR, coordinate DjVu XML,
page-number JSON, and scan-data XML. They add four unique objects / 45,842,141
bytes. The vault now verifies at 8,452 objects / 5,968,677,579 bytes with
summary SHA-256
`e0fbf5056409926b30a43dc55c244c78eee20d51c958976c0579c6cc1d4ff61e`.

The coordinate XML has exactly 1,240 contiguous page objects, 463,565 OCR
words, and 40,508 lines. The scan-data XML independently maps leaves 0-1239,
so PDF page equals leaf number plus one. Plain and coordinate OCR become
byte-identical after whitespace normalization. This is a useful correction
scaffold.

It is not product text. The provider page-number JSON has 1,239 records,
omits leaf 0, and gives positive confidence to zero records. In an 18-page
landmark sample spanning the title, every sopana start and close, the Aarti,
and *Manas-Pingala*, only 3 literals survive exactly and 32 of 51 expected
tokens are exact. The OCR remains quarantined; no passage, Search, Sarthi,
API, vector, training, or AI-translation lane is allowed from it.

OCR/alignment fixities:

- acquisition plan SHA-256 `327d6a2c438abdeca91210bd34cf489173f76aae00a2012b3acd256a1a78c8cb`;
- OCR profile SHA-256 `2876993199c7e7cf7ddcaadee9c6b9d2ef55a2d5b927d626d3f76352879cfd9a`;
- OCR result SHA-256 `3cb6ed884bb3004e36d22363f4987a7485751387a6c5126c78e20414443302cc`;
- page-text hash root `aec78162ba5cd092d507c688fdaef3e71554b5b6f1618342cbb128de81315f78`;
- normalized OCR text SHA-256 `cc1535ea9bcf58217f4b3aa21bc50dc963b6db0e8989b03d0ea474a33de6a6c4`;
- builder checks 12/12 and independent semantic tests 7/7 pass.

A local modern-OCR benchmark prevents an unproductive full-book rerun. The
same 18 fixed pages were rendered at 300 DPI and tested with Tesseract 5.4,
official Hindi `fast` and `best` models, and automatic/single-block layout
modes. The strongest configuration matched 3/18 complete literals and 30/51
exact tokens; the retained IA OCR matches 3/18 and 32/51. Devam therefore does
not scale local Tesseract across 1,240 pages. The benchmark stores metrics and
fixities only; the 18 renders, 72 OCR outputs, installer, and temporary model
files are not retained.

- benchmark report SHA-256 `bd86460781c361bdf0f829c6cebb0f29244fd72b64a85db4343fa1d27603049e`;
- evaluator SHA-256 `1805aebfdaeab328a15639ef1b0b720c80b00d35b69db852fb4e47be9259e37e`;
- independent test SHA-256 `f48c8103e4c514d6f50346aa92245f68f3f1cbfcb81b49e3309b43909eb87da3`;
- decision `DO_NOT_SCALE_LOCAL_TESSERACT`; 3/3 independent tests pass.

## Required next Ramayana lanes

### Manmatha Nath Dutt seven-volume English acquisition (2026-08-07)

Devam now preserves the separately identified 1891-1894 English prose
translation edited and published by Manmatha Nath Dutt as seven exact Wikimedia
Commons DjVu carriers: Bala, Ayodhya, Aranya, Kishkindha, Sundara, Yuddha, and
Uttara Kanda. After the provider cooldown, the unchanged frozen plan acquired
all seven files through normal TLS. Provider SHA-1 and local SHA-256 match for
every carrier. The acquisition added seven unique objects / 72,688,252 bytes;
the whole vault now verifies at 8,439 objects / 5,670,939,878 bytes with
`source_vault/summary.json` SHA-256
`9cd973058220f61451729236fee5d358c07bbe5aa14e2a72989b6e5336b27dcd`.

The exact plan remains
`ingestion/plans/ramayana-manmatha-nath-dutt-commons-source-acquisition-v1.json`,
SHA-256 `7fea488d9084f19bc8507291875c1512b7801fa4de776aebb7b21301a0b3cb58`.
The new provenance-map and object-manifest roots are respectively
`da91b9c9a15aa36be775dd59e9da753c86428bbfe2c1dbfd2c3fb57c979cf20f`
and `fb3d43713375d0417a8bd714ff377597a59b735e09cffa9a587df4f2a45720ef`.

The Commons page map profiles 1,942 carrier pages, including 1,883 pages with a
provider OCR layer. Every page has a stable volume/page coordinate, text hash,
character count, dimensions, and DPI in
`ingestion/reports/ramayana-manmatha-nath-dutt-commons-structure-v1.json`,
SHA-256 `4bac0c1f139980cff5e3c58640e37db0d2f154d1a22011ccb9c0d0330afe9b32`.
Terminal OCR tails and local visual renders show coherent Kanda closes for all
seven volumes, including literal closes for Ayodhya, Aranya, Kishkindha,
Sundara, Yuddha, and the final Uttara work close. The Bala carrier ends
coherently after printed page 176 and is followed by blank/library matter. The
title and terminal leaves of all seven volumes were visually inspected from the
fixed local carriers; no provider thumbnail is needed for this boundary.

Commons metadata remains `LicenseShortName=Public domain`,
`UsageTerms=Public domain`, and `Copyrighted=False`. That establishes the
current file-level rights lane, not transcription accuracy. Provider OCR stays
quarantined and unserved until quality sampling and correction; these holdings
are not yet exact searchable text, a product-ready translation, every Sanskrit
edition, every Ramayana tradition, or the complete hero universe.

### Manmatha Nath Dutt complete electronic narrative lane (2026-08-08)

Project Gutenberg's four separately identified UTF-8 electronic volumes now
supply complete narrative-body coverage of Dutt's seven-kāṇḍa English prose
translation: Bāla and Ayodhyā in eBook 57265; Araṇya, Kiṣkindhā and Sundara in
57826; Yuddha in 60188; and Uttara in 62496. All four live normal-TLS responses
exactly matched the unique objects already restored in `source_vault`, so the
current acquisition added four provenance records and zero duplicate payload
bytes.

Devam publishes 652 source-relative SECTION units from the four immutable text
carriers. Their raw spans losslessly cover every byte from each volume's first
kāṇḍa body header to immediately before the Project Gutenberg END marker.
Project Gutenberg and transcriber front matter, license/footer text, URLs and
trademark framing are not product-indexed. Citation identity is source hash,
volume, kāṇḍa, source-relative ordinal and byte span—never the printed section
number alone.

Literal numbering defects remain evidence, not silent corrections: Bāla has 75
headings through literal 77, Araṇya 75 through 75, Sundara 66 through 67,
Yuddha 128 through 130, and Uttara 123 through 124. Duplicate, missing and
non-increasing literal markers are preserved in every locator. Ayodhyā's 118
and Kiṣkindhā's 67 headings are locally contiguous. All seven kāṇḍa terminal
boundaries are present; Bāla closes coherently into the next literal body header
without an invented end formula.

The product-rights record combines the underlying 1891-1894 publication,
Dutt's 1912 death, India's section 22 life-plus-60 term, Project Gutenberg's
United States public-domain record and trademark-removal boundary, and the
seven Commons public-domain scan records. This is a documented India/United
States product determination, not legal advice.

Hosted closure reproduces 4 source rows, 7 kāṇḍas and 652 published passages
with zero hierarchy/status mismatches and zero provider-framing matches. The
local and hosted source/text/span root is
`3226377be38be511463e8c09d56898a6b9f658d649cb376e51e3ac7c94a81c42`;
the anonymous passage RPC retrieves the terminal Uttara unit at source ordinal
123 / literal CXXIV.

Fixities:

- text acquisition plan SHA-256 `1cf9f89bd4ff94cce545f40e42f64db756011ff5341485b58cf7c18d9dbb6123`;
- product plan SHA-256 `3eca2354bbe81418a11a2d9372237643d8c522e04ce88ce90018ba08ebdfeb5c`;
- packet SHA-256 `edc6d858017a4788a65feac404583374b007b1084749925381abd47ca1a79d13`;
- locator-bound passage root `1efc394e9fd07b394d74158344120d3cd247b63c8a362759266687c23c5307d8`;
- deterministic report SHA-256 `747b5bf11ff769c969f7052e0c80e648a1e7e00602ece5ebe6222618bdcdd20f`;
- hosted verification report SHA-256 `0b120fbc2d32153f29e6f4bff873511eac0c3d02d84c4f3fe08a42e072188597`;
- compiler SHA-256 `de64cec20c7cf710c1b458cd08684bc973c97f0ffe117919b03bf39c1c25c2ad`;
- test SHA-256 `f7aa128238528110183096f5adbbcf33c141b5e7e5539b4a5555e95110f408c7`;
- 9/9 deterministic tests pass.

This completes the exact four-carrier electronic narrative boundary, not
page-by-page reconciliation to every print scan, corrected printed numbering,
an edition-identified Sanskrit base, Hindi, every translation/commentary,
every recension/tradition, the Ramayana hero universe, or the MVP library.

### Edition-matched Hindi Wikisource page acquisition (2026-08-08)

Hindi Wikisource exposes an exact 1,240-title Page-namespace universe for the
same retained Belvedere Press scan, with no missing, duplicate, or nonnumeric
scan-page identity. Devam froze all current revision IDs and acquired all 1,240
revision records in 25 bounded JSON carriers plus one site-rights record. The
26 new content-addressed objects total 7,683,751 bytes. The 78,560,265-byte
scan was not copied again, and no source text was copied into the app.

The acquisition improves page-addressed evidence but does not close the
searchable-text gate. Across the 1,172 seven-sopana narrative pages (scan pages
52-1223), Wikisource currently marks 5 validated and 808 proofread pages, for
813 product candidates. It marks 345 pages not proofread and 14 pages without
text, so 359 narrative pages remain an explicit correction queue. Across all
1,240 pages the exact quality distribution is 20 without text, 350 not
proofread, 864 proofread, and 6 validated. No page was silently promoted from
raw OCR merely because its title exists.

Hindi Wikisource's site-rights API reports Creative Commons Attribution-Share
Alike 4.0. That licence applies to the acquired contributor transcriptions and
is preserved separately from the public-domain underlying scan. Product use
will require attribution and share-alike compliance. Proofread and validated
pages are product candidates, not yet published passages; unproofread and empty
pages remain internal correction evidence.

Deterministic checkpoint:

- profile ID `RAMCHARITMANAS-WIKISOURCE-PAGES-0F02AEF6AB74619FED5E31B0`;
- plan SHA-256 `fbc2a25045bcf8dcbfcb8a5dd2c5388fe8263c209567d515b27f138d0882c0ab`;
- acquisition report SHA-256 `8a6547f3c2f74194a29a885d2b7529ce9fcdd06daa51e7e32c6f48f2e0a2cf7c`;
- acquisition tool SHA-256 `4562f23ad403787e8636b1e73977c51fa27e1d974732fff2fcf9bc8ddc29a8d6`;
- test SHA-256 `560ccc673c82c4800f916f89e9d96d481313277943ac76184531d650f0569907`;
- source-vault closure: 8,491 unique objects / 6,167,702,553 bytes /
  12,507 provenance records; and
- 4/4 focused semantic tests plus full local vault verification pass.

This is a complete acquisition of the current Page-namespace carrier universe,
not a complete product-searchable Ramcharitmanas text. The next product boundary
is a page-addressed packet for the 813 proofread/validated pages followed by
correction of the 359 held narrative pages against the fixed scan.

### Wikisource status and selected Sundara passage (2026-08-07)

A fresh normal-TLS observation of the seven English Wikisource Index records
found `Progress=C` (To be proofread) and `Transclusion=no` for every volume.
The compact report is
`ingestion/reports/ramayana-manmatha-nath-dutt-wikisource-proofread-status-v1.json`,
SHA-256 `c5dadbc8fc166d361a3c5488a29504b3d12669117e0de0378dfcfcf2e667a614`;
its independent local validator passes 10/10. Wikisource therefore does not
supply a complete proofread, transcluded Dutt edition, and Devam does not serve
its Page-namespace or embedded DjVu OCR as exact text.

For the MVP, the fixed Sundara scan was locally rendered and pages 110–115
(printed 975–980) were visually read. Dutt Section XXX spans carrier pages
110–113 and preserves the same deliberation sequence as GRETIL 5.28 and
Griffith XXX; Section XXXI begins on page 113 and Section XXXII on page 115,
supporting the adjacent three-unit alignment. The compact evidence record is
`ingestion/reports/ramayana-manmatha-nath-dutt-sundara-selected-passage-v1.json`,
SHA-256 `f506d39d6c9e3cd90c5f6629ecd64c050b59e51dfeb372fbaa8c717d902c268b`.
It authorizes an original summary with page-addressed citation, not an exact OCR
quotation or a full-volume transcription claim.

1. A product-usable, edition-identified Sanskrit Vālmīki Rāmāyaṇa with all seven kāṇḍas and exact sarga/śloka structure; the current GRETIL carrier supplies internal structural coverage but not this product/edition gate.
2. A strong complete Hindi translation and further product-usable English translations attached to identified Sanskrit editions. The new complete seven-kāṇḍa Dutt electronic body remains separate from the omission-bearing six-book Griffith edition and still needs page-by-page print reconciliation.
3. Ramcharitmanas: correct the edition-matched OCR against the public-domain Belvedere scan, or acquire a complete source-aligned transcription; then add Hindi/English aids, major commentary, performance, manuscript/print, script, and regional traditions. The structurally complete scan and quarantined OCR are not yet exact searchable text, and the GRETIL transliteration remains private evidence.
4. Kamba, Krittivasi, Adhyatma, Jain, Buddhist, tribal/folk, and Southeast Asian Ramayana traditions as separately identified works and expressions.
5. Story, character, place, route, temple, festival, ritual, ethics, and interpretation dossiers with passage evidence and explicit variant boundaries.
6. Launch journeys and challenges connecting Ayodhya, Mithila, Chitrakoot, Dandaka, Kishkindha, Lanka, major characters, and high-interest episodes.
7. Image/map evidence and current-place dossiers suitable for the Living Atlas.

Nothing in this checkpoint completes the Sanskrit source, Griffith without omissions, Uttarakāṇḍa, Hindi coverage, Ramcharitmanas, regional/transregional variants, the Ramayana hero universe, or the MVP library.

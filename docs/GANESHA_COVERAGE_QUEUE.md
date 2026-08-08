# Ganesha coverage queue

This queue exists to keep the project moving toward exhaustive Ganesha coverage
instead of overfitting the library to its first successful source pilot.

## Completed deterministic retained batch (2026-08-06)

Seven additional Sanskrit Ganesha texts were already present as one immutable
TEI object and one plain-text derivative per hash in `source_vault`. Their
retained Ambuda catalogue rows state CC0 1.0. The completed ingestion revalidated
every object hash, each TEI license literal, current official item rights, both
representation identities, and each exact observed structure. The old catalogue
status remained discovery context rather than an acceptance substitute.

| Work | TEI bytes | TEI SHA-256 | Text SHA-256 |
|---|---:|---|---|
| Gaṇeśabhujaṅgam | 5,792 | `ba83c59095f4c0c26ce2237c8eb8d1a5bab0ccb0d9b89d65e25ea6c6714a3561` | `a70609df633ed685f246b0f46b7ceac5d5e514ff5de8fb688759055d2c7b493d` |
| Gaṇeśapañcaratnam | 4,920 | `f147f7f48419c44267f5d6fd637cc52a42996687c232d708b038507fb0d45929` | `026f50621c79f6038296b368dc6cb89e812878377f13d7ca93fb0bef1d4b122f` |
| Gaṇeśāṣṭakam | 6,496 | `f4f3379e972ddce3bb2b864ac96896f5884c5a8b65d39bb12c885541e1930daf` | `0582a48493371bd3616f6ccbd374aad922bae920289db055bbcff426a492c620` |
| Śrīgaṇeśanavaratnamālā | 5,087 | `f8dcf1e5055471da60c5d71dbafc7227200bdd20eb0f40ab71e6b3cbaa330732` | `3f44c53ff0e1e9fb032797ae5b505737a07834565a11c892d7adbc01d2248d4e` |
| Śrīgaṇeśāṣṭakam (1) | 6,229 | `1f3c7f5c90580b2541a9574eeabd52eabb3a8cf531bb57f264ca785be5a98ca0` | `282f1ff989cd5e8fa07dc47596c0d57323afe17585474e6c23de958c5e7d2715` |
| Śrīgaṇeśāṣṭakam (2) | 4,547 | `170614b9f6992a3f8d3ebf1e48cb2f6be82eb7604e983864c896092a22b626c0` | `2047c8f0f044d080819acd182d0f5905739b229627324dea9a6ea0600e1b6018` |
| Śrīvidyāgaṇeśāṣṭottaraśatanāmastotram | 10,838 | `535eb697d8a6e7e407ab696eb2a4518cd2226efa6a27385102060f40718398c6` | `af4671bea73ab476a2fa2f66ea0416ffea7fc526ef7ae1b0aa0fc782e411caa1` |

The frozen reference-only batch is
`ingestion/plans/ganesha-ambuda-seven-hymns-v1.json` (file SHA-256
`34d407c51938bf64c413051eb029620119f6e86da54793d5d31811f78f8017ae`).
Its deterministic result is:

- packet SHA-256
  `30f327ddbf2a446626a37b52ee7af0b9b0330f97c8bf8371aad940564fc579c2`;
- SQL SHA-256
  `0c063f775aee87bd9da64cb89edfde449605b5339d3dfb3f1d3660a729272f9a`;
- 7 works, 14 distinct source representations, and 72,534 referenced bytes;
- 80 byte-addressed Sanskrit passage units;
- source-inventory root
  `876fec03e072922518295b349d41c2a8e7e9155c9b1667f4e367a5b0abdcbe7e`;
- passage-content root
  `3b11987df756b8f3de102da28ac885e260ec002b220caa4d4ec76663d1af4cc1`;
- no copied or uploaded payloads; and
- all expressions marked electronic transcriptions, all rows review-only, and
  every structural-completeness boundary unresolved.

Hosted Postgres independently reproduced both roots after an idempotent rerun.
The batch is a corpus-expansion step, not complete Ganesha coverage. Each work,
edition, expression, source representation, passage, and uncertainty remains
separate. In particular, the provider slug and TEI `xml:id` mismatch for
`shriganeshashtakam-2`, plus its access-title/main-title difference, remain
explicit rather than being normalized away.

## Ganapati Atharvashirsha priority

Ganapati Atharvashirsha is a named MVP requirement. One product-usable Sanskrit
digital transcription is now connected, but it is not yet a complete
edition/variant/translation bundle:

- Sanskrit Wikisource revision 415703 (2026-04-22) is acquired as exact raw
  wikitext plus its revision record under CC BY-SA 4.0. The canonical wikitext
  is 10,478 bytes, SHA-256
  `43d5f6ca8a2ee7d7a62480a85cdbd526cee04b816db46ac7c3fd8d90757a5178`.
  Sixteen losslessly bounded citation passages cover the opening, numbered
  units 1-14, and closing. Ten source-aligned claims (five English and five
  Hindi) are published with exact Sanskrit evidence for the current beta.
  Devam source-aligned English and Hindi translations now cover all sixteen
  fixed source units as 32 separately attributed synthesis claims. The
  translation pack is 26,943 bytes, SHA-256
  `92f2ed67e3b3ab48d2abf06cbbd44404c0c87fe22ed02d5731f8e0d5b236b4da`;
  its semantic content root is
  `f1b0dfe955482c23ac80637cf2ac49a9e1cc83116a6e2162963cd87b321f9b5e`.
  This closes bilingual translation coverage only for exact Wikisource
  revision 415703. The translations are AI-assisted internal-beta editorial
  derivatives, not source originals or independently Sanskrit-reviewed
  critical translations. The underlying print edition and recension remain
  unidentified; pronunciation, independent Sanskrit review, textual variants,
  and formal ritual authority are still open.

- SanskritDocuments provides Sanskrit, Hindi, and meanings but explicitly
  restricts copying/reposting and commercial use without permission. It remains
  a research lead, not a Devam product carrier.
- Ambuda has a fully proofread 30-page project titled *Gaṇapatyatharvaśīrṣa
  (with translation)*, based on an English-translation edition edited by S. B.
  Sukthankar and published in 1981. The live project page was 19,393 bytes,
  SHA-256 `7ca7f03c02375b051a1894937d9fcd648757f020e5b83ba1249988c5109a5a2d`
  on 2026-08-06. The traditional Sanskrit text and the modern English edition
  have different rights questions; neither should be silently promoted under a
  single blanket label.
- The two exact-title Internet Archive items discovered in the first pass are
  audio items, not complete textual editions. One carries a spiritual/religious
  use statement despite a public-domain metadata label.
- A 1933 public-domain Wikimedia Commons scan of *Bṛhatstotraratnākara*, volume
  1, was checked as a possible edition lead (23,911,986 bytes; SHA-256
  `e7dab342862bc780853497c03f2786504992654c5b1b94ee7ba201adae7738bb`).
  Its visual contents list multiple Ganapati hymns but not a separately titled
  Ganapatyatharvashirsha, so it was not misidentified or retained as the
  required carrier. It remains a re-acquirable broader hymn-compilation lead.

The remaining preferred resolution is an old/public-domain Sanskrit edition or
manuscript with a clear reusable scan, followed by independent Sanskrit review
of the Devam translations, a source-variant dossier, and responsible
pronunciation/recitation context. Until those exist, the product may use the
exact bounded Wikisource transcription and its complete exact-revision Devam
translations, but must not claim edition, recension, textual-tradition,
pronunciation, ritual-authority, or full Atharvashirsha completeness.

## Ganesha Purana exact Sanskrit provider universe (2026-08-08)

The exact Sanskrit Wikisource page universe selected for the Ganesha Purana is
now acquired once in `source_vault` and published as 62 source-addressed
passages. The pinned universe contains 65 canonical provider pages, of which 62
are content ranges, and preserves all 247 chapter boundaries: 92 in the
Upasana Khanda and 155 in the Krida Khanda. Its terminal evidence includes the
Upasana close and the Krida close with `Shri Gajananarpanamastu` and
`Shubham bhavatu` in the Sanskrit source.

The product publishes only this exact pinned transcription under its recorded
CC BY-SA 4.0 lane. The underlying print edition and recension remain
unidentified, and no Hindi or English translation is supplied. The internal
1993 scan candidate remains absent from product data. This is therefore
complete only for the exact pinned Wikisource page universe, not for every
Ganesha Purana edition, recension, translation, commentary, or the wider
Ganesha tradition.

Frozen inputs and results:

- source profile `GANESHA-PURANA-WIKISOURCE-97DBB2263E3486C5BB900E19`;
- plan SHA-256
  `6370295836856fc62b8b380e022dcb2533e3d669c3534c1591b5928eeb892961`;
- acquisition-report SHA-256
  `a0a46c9fe926735b9c44b617abd287fea89fd810e65b0e8971b476dab88cf128`;
- ingestion-report SHA-256
  `4463cf01f20557f2418f3c5b782f144f74ca9deebdd815796dbb43e21f703504`;
- 3 product source objects, 62 passages, and 247 chapters; and
- one published Atlas doorway and one evidence-backed structural claim.

Search, Sarthi exact retrieval, and the Living Atlas can expose the bounded
source. None may describe it as an identified critical edition, a translation,
or complete Ganesha coverage.

## Mudgala Purana fixed Sanskrit carrier (2026-08-08)

One exact 63,438,893-byte original PDF from Internet Archive identifier
`mudgala-puranam-mv-mahasabde-1976-nsp` is now retained once in the
content-addressed vault at SHA-256
`678edb439abdc43fa3db1148296d4b4f984cfd30cf750982465d16fdf97af8cc`.
The provider describes it as M. V. Mahasabde's 1976 Sanskrit edition published
by Nirnaya Sagar Press, Mumbai, but the scan starts directly at Khanda 1,
Chapter 1, printed page 1 and contains no title or publication leaf. That
edition attribution therefore remains provider-supplied rather than
page-proved.

Visual fixed-carrier review establishes nine ordered khandas, 459 chapters,
1,003 printed text pages, all nine khanda closes, and a 1,023-page exact PDF
universe. The ninth khanda ends with `Shri Gajananarpanamastu`, a whole-work
terminal, a separate ninth-khanda close card, and a final whole-work close card.
The source is structurally complete for this fixed nine-khanda carrier only.
It does not prove every Mudgala Purana edition, manuscript, recension,
translation, or commentary.

The provider supplies no rights or licence field. The carrier is therefore
`internal_only_rights_review_pending`: it is not exposed through Search,
Sarthi, API, vector, training, or the Living Atlas. Provider OCR was fetched
only in memory to navigate to visually inspected pages; it was not retained or
indexed because it is materially noisy. Two other Internet Archive uploads and
a Malayalam-script compilation remain separate held candidates.

Frozen records:

- acquisition-plan SHA-256
  `96c4fb4d41f628ac91afe52adeaa61624a83ec876bea060100ffb2cce95717d5`;
- acquisition-report SHA-256
  `a825dd548b41495c1aaa3cd503d8796a0566b219320e4eaf5008f9edbff1ff77`;
- fixed-carrier-profile SHA-256
  `443befeedc373aa2577db1a79b14d398c7e2138f60919feae01e6ef83a1a1ece`;
- deterministic profile-test SHA-256
  `c45b4670a8c3cc088f4de9215e87b998a8ceebbacb816b32879f1ec84164b09b`;
  and
- current vault: 8,447 unique objects / 5,844,275,173 bytes, summary
  SHA-256
  `a2fb6a2a03fa020c433aeaa807147ae9cb175105caf9cc95dae119ef06582f3a`.

## Larger Ganesha corpus

After the retained hymn batch, the highest-value acquisition/research lanes are:

1. Ganapati Atharvashirsha edition/recension identification, textual variants,
   pronunciation/recitation context, and independent Sanskrit review of the
   complete exact-revision Devam Hindi/English translations;
2. identify and compare Ganesha Purana editions/recensions, add source-aligned
   Hindi and English translations, resolve the retained Mudgala Purana
   carrier's edition/rights boundary, and create a reusable, verified text lane;
3. major Purana narratives with exact work/chapter/passage identities;
4. Ganesh Chaturthi Panchang rules and minimum/standard/elaborate regional
   procedures, with family/sampradaya variation;
5. Ashtavinayak and other major temple/place dossiers;
6. historical public Ganeshotsav sources; and
7. regional forms, stories, iconography, living traditions, and practice.

Every lane should feed the same source → passage → claim → relationship model so
the library, Sarthi, Search, and Living Atlas grow from one evidence base.

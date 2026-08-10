# Ramayana district: The road that asks Rama home

Status: **playable candidate — 2026-08-10**

## Product purpose

This is the fifth illustrated Ramayana district and the fourth contiguous
Ayodhya district. It begins only after Bharata has rejected the crown and ends
when the sandals are installed as a temporary trust at Nandigrama. The player
travels with Bharata rather than receiving a one-line summary of his request:
the expedition reaches the Ganga, Guha reveals the first night, Bharadvaja
tests and hosts the company, Chitrakoot hears an army, the brothers reunite,
the family debates the return, the sandals carry the unresolved promise, and
Nandigrama turns waiting into government.

The district has eight full-screen scenes and forty-eight bilingual beats. Each
scene has one generated artistic visualization, a bounded camera composition
for every beat, local character and place routes, replay, scene skipping,
source access, and a reversible return to the five-district selector. This is a
selected-expression story world, not observed engagement, a historical map, or
complete Ramayana coverage.

## Exact source boundary

All narrative beats are Devam retellings bounded to one retained,
product-allowed object:

- object SHA-256: `7d3b9e1613d60dfacea39f2564243e943cf38703eadb7245d92337b238082034`
- expression: Manmatha Nath Dutt's English prose Ramayana, Project Gutenberg
  four-volume electronic edition, volume 1
- selected interval: Ayodhya Kanda LXXXIII–CXV
- byte interval: `834303–984977` (end exclusive)
- line interval: `13202–15564`
- combined selected-span SHA-256:
  `12457f36caa075fe967866c39dc097290b47aa4bc51568c39852abe5c9510c2d`

| Scene | Dutt coordinate | Source ordinals | Bytes | Lines | Span SHA-256 |
| --- | --- | --- | --- | --- | --- |
| A kingdom reaches the Ganga | LXXXIII–LXXXV | 158–160 | 834303–843167 | 13202–13344 | `1ff5fd6ca5c0c6e7341df5da7302096b69d30120a90a6c6361a10f390cacbd5d` |
| Guha shows the first night | LXXXVI–LXXXIX | 161–164 | 843167–857190 | 13345–13568 | `9c244b0acff25a81453e9c20087209ef25c81da826e8fb27d47e5657d62fac6c` |
| Bharadvaja tests and receives | LXXXX–LXXXXII | 165–167 | 857190–877001 | 13569–13868 | `aa15406169c65ffad98dc7dc183fcc9d675bef9e1474b6ad5795dd9986958445` |
| Chitrakoot hears an army | LXXXXIII–LXXXXVIII | 168–173 | 877001–898522 | 13869–14211 | `b7af7bbdb0da637b2bb97ef5ad1b058e7276c477913ed1a1c94b6249dbf51b47` |
| The brothers meet, then hear the loss | LXXXXIX–CIII | 174–178 | 898522–929639 | 14212–14699 | `398706e018e821c10115a62ffaae202a49ee9233d8404addd5842fc7bf04fb82` |
| The family asks Rama home | CIV–CVII | 179–182 | 929639–949752 | 14700–15010 | `529ab3e0d92ca7fddbe436d4c0e43f4c2a0cd2d24aace212a3c163232d66c120` |
| The sandals hold the kingdom | CVIII–CXII | 183–187 | 949752–974360 | 15011–15392 | `c1dd5da558278a4bfacdbc4fea3b6794e5b97a7a4655911b2c23e65251f4f973` |
| The trust moves to Nandigrama | CXIII–CXV | 188–190 | 974360–984977 | 15393–15564 | `fddea12aaee5d778376bfa8445172bdfdd4e6ebe159186ead4a07e7ebfdd68ea` |

The boundary stops before CXVI, when Rama leaves Chitrakoot for a deeper
forest road. It does not import later events or another edition to make this
district appear more complete.

## Visual assets

All eight files are 1672×941 WebP artistic visualizations. They are not source
images, portraits, archaeological reconstructions, or modern geographic
evidence.

| Asset | Scene function | SHA-256 |
| --- | --- | --- |
| `ramayana-bharata-expedition-ganga-v1.webp` | Guha sees the approaching expedition before its purpose | `fd48231e4e61014ab8ff9940f807779dad5234deb041fc5c62de33aea2d1b36d` |
| `ramayana-bharata-ingudi-crossing-v1.webp` | Bharata finds the grass bed and the river crossing | `f74e1da98be8df43ccac446fc03cd1760574a41d92a4529e7055c75d6012d880` |
| `ramayana-bharata-bharadvaja-wonder-v1.webp` | a still hermitage opens into grounded hospitality | `9325c6a8990dbf07a3d190a9bd5cee7bb30bb04a96968bb8b978b78cf474a24a` |
| `ramayana-bharata-chitrakoot-alarm-v1.webp` | Lakshmana reads threat while Rama expects love | `bc8eb2b3442737695c5f79fbf5f90cade17c27aaeb364d7c9f2b526bfd98b10c` |
| `ramayana-bharata-brothers-meet-v1.webp` | reunion becomes mourning | `1d0839a3634ef02de5412ee6037f7d29d93e659ca530213008d0326e9380fb13` |
| `ramayana-bharata-family-council-v1.webp` | domestic reunion becomes public debate | `556d64fb0bd60579962f1d9f98548d8baf479ae49cebb50de5e9f6f7356cbd72` |
| `ramayana-bharata-sandals-vow-v1.webp` | the sandals become a bounded trust | `9f6f7c6576e9080e79e23a2b558e81d07e9934c88e9ea9bc23c437b84a7dceaf` |
| `ramayana-bharata-nandigrama-v1.webp` | responsibility is exercised below an absent king's trust | `2129e3fa8a896ea56d062085c00e711362629c8f092df5cb1b8d4589d2478676` |

## Acceptance boundary

The candidate must fail closed if any scene loses its exact citation, visual,
Hindi or English beat sequence, camera composition, resolvable cast nodes,
mapped place, or reversible district route. The full story pack remains below
240 KB raw and 42 KB gzip; each district remains below 75 KB raw and 18 KB
gzip. Desktop and Pixel 7 browser acceptance opens every asset, completes the
last six-beat scene, returns to the selector, and checks horizontal overflow.

Local acceptance passes lint, TypeScript, the optimized production build, 857
portable product tests with the same 17 named source-vault-only skips, and all
28 serialized desktop/Pixel 7 browser cases.

Passing these contracts establishes implementation integrity only. It does not
establish historical truth beyond the cited expression, visual authenticity,
user delight, addiction, or whole-epic completeness.

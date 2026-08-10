# Ramayana district: The empty throne

Status: **implementation candidate — 2026-08-10**

This district continues the selected Manmatha Nath Dutt Ayodhya Kanda
expression without a gap from the Chitrakoot-home checkpoint. It covers source
units LVII–LXXXII and stops before Bharata's expedition reaches Guha and
Chitrakoot. That following journey is a separate district so Dasharatha's last
night, Bharata's return, and the refusal of the crown are not compressed into
one-line transitions.

## Product shape

The district contains eight illustrated scenes and forty-three bilingual story
beats:

1. the empty chariot returns;
2. grief speaks in the palace;
3. Dasharatha's remembered sound by the Sarayu;
4. Ayodhya wakes without a king;
5. Bharata races home through seven nights;
6. Bharata rejects the boons and throne;
7. mourning becomes trust; and
8. the crown becomes a road toward Rama.

The forty-nine-turn atlas remains an orientation layer. The illustrated-world
selector is placed before it, and finishing a district returns to the same
selector. The detailed district payload remains lazy: only the selected
district's beats load when a player enters it.

## Exact source boundary

Source object:
`sha256:7d3b9e1613d60dfacea39f2564243e943cf38703eadb7245d92337b238082034`

Rights lane: `product_allowed`. The product copy is a labelled Devam retelling
of one selected public-domain English edition. It is not every Ramayana
tradition, a Sanskrit critical edition, a historical reconstruction, or an
ethical verdict.

| Scene | Source ordinals | Ayodhya units | Byte span | Source-span SHA-256 |
| --- | ---: | ---: | ---: | --- |
| The empty chariot returns | 132–134 | 57–59 | 708336–723058 | `aaf79e58ff071a750764e592cad909cf22d527f0e6c42989a719a6b7eadf2937` |
| Grief speaks in the palace | 135–137 | 60–62 | 723058–733340 | `841f0040bb194d34f854d52cbb1f1934995fa090f553bee5df0d17185223a502` |
| The sound by the river | 138–139 | 63–64 | 733340–752213 | `d752383691a5c047d64ebb34699474c8fb984e0eb574c44d595f5029f88c3d95` |
| Ayodhya wakes without a king | 140–143 | 65–68 | 752213–769147 | `94494c276525af3456b72adc4d6d019ab658341c76c4e58a977bd7bda873232d` |
| Bharata races toward the silence | 144–146 | 69–71 | 769147–783362 | `22c1e9072d8b6b414d42d1625b73cef27c22e434af7fa550400797dab31301a0` |
| Bharata rejects the boons | 147–149 | 72–74 | 783362–801041 | `c882b50ec704e8fb5f7448abac2303aaa73253538e5eaafd65bc9a3a3302090b` |
| Mourning becomes trust | 150–152 | 75–77 | 801041–818242 | `278d658264d752ea0fcb270e13de590085340c08d9648831ffee9a3c60ddfd53` |
| The crown becomes a road | 153–157 | 78–82 | 818242–834303 | `e8d794d4eb7defdc272c90bc719e505b36529a13f809e71800d96a6439aa8fd1` |

The eight spans reconstruct every Ayodhya unit from LVII through LXXXII
exactly once. Combined with the two prior early-epic districts, the current
playable sequence covers I–LXXXII without a source-unit gap.

## Visual assets

All eight 1672×941 paintings were generated for Devam with the built-in image
generation tool, using an earlier Devam-authored Ramayana painting only as a
style reference. They were encoded as WebP and contain no third-party source
image or visible text.

| Product asset | SHA-256 |
| --- | --- |
| `ramayana-throne-empty-chariot-v1.webp` | `4f2e981b9ed33cc18d103ac38539b93e928719663087ba914d33dd069df08a68` |
| `ramayana-throne-palace-grief-v1.webp` | `51fecb97541078c0cfd2ff24aa9862f0eb25558d62fb56f9ad06b94a85c7478b` |
| `ramayana-throne-river-memory-v1.webp` | `29130f1de2498a022e30a3509b94498cd85f24f02f99e845323eda10fa87a3ed` |
| `ramayana-throne-city-without-king-v1.webp` | `c2dd3a5822bb22f33a095d2f44fdf04de4d791db3210af052f722d53d905fe3b` |
| `ramayana-throne-bharata-return-v1.webp` | `3099ca70848fe5b007aa39612e26faeeaf5ef332081f97a0916a07d4a7152165` |
| `ramayana-throne-boons-rejected-v1.webp` | `028885d2b3f455e98bd05f1de00ab698821a51c2e6ec98533d3380b309d22661` |
| `ramayana-throne-funeral-trust-v1.webp` | `a39725d7af2e596a0440598f701eb173b61d22fcfe05c1de7829ed48e42f3d48` |
| `ramayana-throne-road-to-rama-v1.webp` | `c5dfa37eb4b46f44fd5c05cec5ac2c1e5e6fe193b7ec78e4c7fd4c53f51c8319` |

The prompt set asked for wide, layered Indian epic concept art with readable
foreground, middle ground, and horizon; dignified emotion; restrained amber
and indigo light; no modern objects; and no text or UI. Each prompt then fixed
one narrative action: the empty returning car, palace grief, symbolic river
remorse, the empty throne, Bharata's urgent arrival, rejection of the crown,
reconciliation by the Sarayu, and the kingdom preparing the road toward Rama.

These images are artistic visualizations. They are not source facsimiles,
archaeological reconstructions, historical photographs, universal
iconography, or evidence for a person's or place's appearance. Narrative
claims remain attached to the byte-addressed source spans above.

## Next contiguous district

The next district begins with the expedition prepared here and follows Bharata
toward Guha, Bharadvaja, and the Chitrakoot reunion. Its working product name is
**The road that asks Rama home**. It must keep journey geography, the brothers'
argument, the sandals, and the return to Nandigrama sufficiently detailed; this
candidate does not claim that material yet.

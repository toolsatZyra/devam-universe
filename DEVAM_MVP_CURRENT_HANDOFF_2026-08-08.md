# Devam MVP current handoff — 2026-08-08

This is the current operational handoff for continuing the Devam MVP in a new
Codex task. It deliberately replaces chat-only continuity. It does not replace
the product brief, architecture, implementation plan, ritual contract, or
Sarthi wisdom architecture.

## Startup sequence

1. Confirm the working directory is `C:\Work\Code\sanatan_knowledge_graph`.
2. Read `AGENTS.md` completely.
3. Read this handoff completely.
4. Read `docs/PRODUCT_BRIEF.md`, `docs/ARCHITECTURE.md`, and the current
   completion audit near the end of `docs/IMPLEMENTATION_PLAN.md`.
5. Read `docs/RITUAL_AND_OBSERVANCE_PRODUCT_CONTRACT.md` before changing a
   ritual lane and `docs/SARTHI_WISDOM_ARCHITECTURE.md` before changing Sarthi.
6. Run `git status --short`, verify the current branch/remote, and inspect the
   open stacked pull requests before editing.
7. Recommend the cheapest sufficient model/effort before substantive work.

## Objective that must not degrade

Devam is the umbrella library and explorable knowledge universe for Sanatana
Dharma, Indian culture, and Indian wisdom. The library preserves source and
edition identity, provenance, rights, variants, and uncertainty. Sarthi turns
that evidence into a concise, culturally scoped companion. The Living Atlas is
the explorable 2.5D world. Exact Search is the third door.

The launch worlds are Ganesha, Durga/Navaratri/Durga Puja, Ramayana, and
Diwali/Deepavali, with the complete selected September–December 2026 Panchang
and actionability layer. Library expansion continues in parallel, but the MVP
critical path is now productization rather than another isolated acquisition.

## Git and hosted state

- Remote: `https://github.com/toolsatZyra/devam-universe.git`
- Current branch: `codex/acquire-ramcharitmanas-wikisource`
- Last functional commit: `1468754 Connect Ramcharitmanas to the Living Atlas`
- Supabase project: `devam-universe`, ref `bucgdaunsuzithfigtmr`
- Vercel: no project or production deployment yet.
- Open draft PR stack, which must be reviewed/merged in order:
  1. PR #1, `codex/complete-dutt-ramayana-english` → `main`
  2. PR #2, `codex/acquire-dp-sharma-hindi-ramayana` → PR #1 branch
  3. PR #3, `codex/acquire-ramcharitmanas-wikisource` → PR #2 branch
- PR #3: `https://github.com/toolsatZyra/devam-universe/pull/3`

Do not point Vercel at `main` and call it current until this stack is reviewed
and merged. A branch preview is acceptable for review, but production should be
Git-connected to the consolidated branch.

## Latest completed checkpoint

Ramcharitmanas is now reachable from the Ramayana Living Atlas gateway, exact
Search, and Sarthi through seven stable sopana citations. The bounded product
slice contains 802 source-addressed Hindi Wikisource pages from one fixed
Belvedere Press edition. It excludes 359 low-quality pages and 11
malformed-markup pages and does not claim complete Ramcharitmanas or Ramayana.

The additive hosted Atlas migration is
`supabase/migrations/20260808070531_sync_current_living_atlas.sql`, SHA-256
`12d4d3bd987be252d033ed19e2785bda8133a9233fe62a18644db5846161be7e`.
The integration report is
`ingestion/reports/ramcharitmanas-living-atlas-integration-v1.json`, SHA-256
`84355a5062ae51e95de982bae70adc0a512f71f114a8f643534c8c4a8021d89d`.

Hosted verification after application:

- 42 Atlas nodes and 46 edges total;
- 41 app-owned nodes and 45 app-owned edges;
- the independently managed Ganesha Purana node/edge remains present;
- the Ramcharitmanas node/edge is published and product-allowed;
- anonymous normal-TLS REST readback returns the exact node; and
- `search_public_knowledge` and `search_public_passages` remain owned by the
  restricted `devam_public_search_executor`, executable by `anon` and
  `service_role`, and not executable by `authenticated`.

Full local closure at this checkpoint:

- 91 web test files / 693 tests pass;
- 210 Python tests pass;
- ESLint passes;
- TypeScript passes;
- the Next.js production build passes; and
- the targeted Ramcharitmanas/Atlas group passes 171/171.

## Evidence-backed MVP stocktake

An independent read-only adversarial review was run specifically to counter
recent-implementation bias. Its verdict: Devam is a credible working vertical
slice, much closer to an investor demo than to a paid public beta.

| Layer | Completed now | Material remaining |
|---|---|---|
| Source library | 8,491 unique objects, 6,167,702,553 bytes, 12,507 provenance records in the one-copy vault | Object count is not work coverage. Normalize the civilizational denominator; most retained objects are not product-indexed. |
| Hosted knowledge | 21 works, 27 expressions, 27 editions, 102 source references, 9,091 passages; 3,298 published | Only 6 semantic entities and 4 semantic relationships; source/product breadth remains small. |
| Search | Exact published-passage and reviewed-claim retrieval plus metadata discovery | Broader semantic/hybrid retrieval and systematic product indexing remain open. |
| Panchang | Deterministic astronomy and location/tradition-aware selected 2026 rules; 79/79 selected resolved slugs have a current lane | The selected inventory is not every regional observance. Generalize exact-year/city fixtures only where MVP acceptance needs it. |
| Ritual | Audit finds 46 current scoped user-complete lanes and one participation companion | These are schema-valid scoped lanes, not independent proof of every regional/family/priest-led practice; expert review remains. |
| Sarthi | Conversation UI, exact-source/ritual/Panchang routes, four personal-guidance families, three moral families, one safety route, one Ramayana reflection, bounded optional generation code | The frozen 40-scenario fixture validates routing only. Run the 60–100 answer-level same-model blinded pilot before claiming improved wisdom or enabling broad generation. |
| Living Atlas | Four gateways, 37 app world nodes, pan/zoom/pinch/double-tap, era filters, four journeys and four challenges | It is still a cosmic constellation prototype, not yet the promised historical/geographic India world; final hero art and depth remain. |
| Account | Guest preview, passwordless-auth plumbing, profile context, consented memory, export/delete | Needs deployed fixed origin, real SMTP and production acceptance. |
| Commercial | Provider-neutral `devam_one` entitlement boundary | No checkout, billing lifecycle or paid enforcement. |
| Operations | Dedicated Supabase project and comprehensive deterministic tests | No Vercel deployment, production domain, checked-in browser E2E suite, analytics funnel, monitoring or public launch gate. |

Calibrated progress ranges, not promises:

- investor-demo vertical slice: 70–80%;
- invite-beta product: 45–60%;
- strict paid MVP in the product brief: 30–45%; and
- exhaustive long-term library: no responsible percentage until the denominator
  is normalized into required works, expressions, editions, languages,
  traditions, regions and media.

The misleading counters to avoid are: 8,491 objects is not 8,491 complete
works; 79/79 is only the selected observance inventory; 46 lane records are not
independent cultural review; 693 tests are not user desirability; 42 nodes are
not a mature knowledge graph; and a frozen pilot is not an evaluated pilot.

## Critical path and effort range

Fastest honest path:

1. Freeze a one-page acceptance matrix for exact investor-demo personas,
   journeys, queries, ritual requests, mobile/desktop states and pass/fail.
2. Review and merge PRs #1 → #2 → #3. Create a Vercel project linked to the
   consolidated GitHub branch; configure fixed Supabase Auth origin and SMTP.
3. Add checked-in Playwright desktop/mobile acceptance for Atlas → Search →
   Sarthi → Today → account and run a real-device/browser pass.
4. Polish one golden path for each of the four hero worlds, including final
   quality scene art and at least one convincing time/geography map experience.
5. Run the frozen blinded Sarthi answer pilot. Enable bounded generation only
   if it beats the grounded baseline without source/applicability regressions.
6. Publish an honest investor coverage dashboard separating preserved,
   structurally understood, indexed, product-usable, translated, reviewed and
   complete.
7. Move new ritual selection away from per-observance TypeScript branching to
   the generic database-driven applicability/content contract. Do not perform
   another destructive cleanup.

Rough focused effort with content work parallelized where possible:

- honest investor demo: 5–10 working days;
- invite beta with production QA and credible Sarthi pilot: 3–5 weeks;
- strict paid MVP: 5–8 weeks; and
- broad regional hero/ritual completion: 6–12+ weeks depending on research,
  expert review and rights resolution.

## Immediate next action

Do not resume with another acquisition on the main MVP thread. Start by freezing
the one-page acceptance matrix and resolving the PR stack/deployment path. Ask
the user to create the Vercel project once the consolidated deploy branch is
ready, or use a feature-branch preview explicitly labelled as such.

Parallel library-acquisition tasks may continue under the one-copy source-vault
contract, but they must not block deployment and acceptance of the product
vertical slice.

## Paste-ready continuation prompt

> Continue the Devam MVP in `C:\Work\Code\sanatan_knowledge_graph` from the
> exact current Git state. Read `AGENTS.md` and
> `DEVAM_MVP_CURRENT_HANDOFF_2026-08-08.md` completely, then follow its startup
> sequence. Reverify branch, PR stack, hosted Supabase counts/security boundary,
> and the latest full test closure. The immediate objective is to freeze the
> one-page investor-demo acceptance matrix and produce a safe PR-merge/deployment
> plan, not to acquire another source on the critical path. Preserve the
> one-copy source vault, explicit rights/edition/uncertainty boundaries, and the
> separation between selected-scope counters and civilizational completeness.
> Recommend the cheapest sufficient model before substantive work. Proceed
> autonomously through safe local planning/implementation, but do not merge PRs,
> deploy production, spend money, configure external email, or publish without
> the relevant explicit authorization.

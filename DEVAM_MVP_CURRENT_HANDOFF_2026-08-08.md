# Devam MVP current handoff — 2026-08-08

This is the current operational handoff for continuing the Devam MVP in a new
Codex task. It deliberately replaces chat-only continuity. It does not replace
the product brief, architecture, implementation plan, ritual contract, or
Sarthi wisdom architecture.

## 2026-08-09 superseding continuation checkpoint

This section supersedes the older branch/PR and “Hindi still open” statements
later in this handoff while preserving them as history.

- Production `main` is currently `4478313ab3a2ad840dd2c5988205bca72412d9fc`
  after the deployed cosmic Atlas and midnight `/today` hydration hotfix.
- Current work is on `codex/cinematic-journey-worlds`, created from that commit.
- Local changes repair camera pan/zoom dead-ends, allow drag-start directly on
  nodes, reveal cross-world paths, and add the evidence-bounded route Ramayana
  → Diwali → Kali Puja → Durga → Durga Puja.
- The reviewed local seed is 4 gateways, 50 world nodes and 62 navigation edges.
  `supabase/migrations/20260809020500_sync_current_living_atlas.sql` is prepared
  and not yet applied to hosted Supabase.
- Four original cinematic journey assets are under `apps/web/public/journeys/`.
  Every current journey stop now has a labelled English/Hindi Devam retelling
  while exact source/edition boundaries remain separate.
- The wider universe and its typed evidence-scoped connections are specified in
  `docs/LIVING_ATLAS_OPEN_WORLD_CONTRACT.md`. The five-node path is a regression
  example, not an ontology or completeness boundary.
- Local acceptance currently passes: 772 portable product tests with 17 named
  vault-only skips, TypeScript, lint, and desktop/mobile Playwright 12/12.
- The change set passed its local optimized build and final diff check. Reverify
  its exact commit, PR, preview and hosted-migration status from Git/GitHub at
  startup; synchronize the hosted Atlas migration with the accepted deployment
  and run deployed 12/12 before any production promotion.

The two untracked research directories named later remain concurrent work and
must not be staged, edited or deleted.

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
- Current branch: `codex/sarthi-intellectual-apprenticeship-design`
- Latest pushed functional/CI commit before the current cosmic-Atlas work:
  `8d39ecab9a877e1abeae8b0dac0d14e162571429` (`Add fail-closed runtime readiness`)
- Supabase project: `devam-universe`, ref `bucgdaunsuzithfigtmr`
- PRs #1, #2, #3, and #4 were merged in order on 2026-08-08 with merge commits
  `93a6788`, `d95da2e`, `70d437d`, and `642fa6a`; `origin/main` is an ancestor
  of the current branch.
- Current draft PR #5:
  `https://github.com/toolsatZyra/devam-universe/pull/5`, branch
  `codex/sarthi-intellectual-apprenticeship-design` → `main`, currently `CLEAN`.
- PR #5 GitHub Actions run `31260737173` passed both tracked-evidence/
  portability and web-product/browser jobs on pushed commit `8d39eca`.
- Vercel project `devam-universe` now exists and the stable production origin is
  `https://devam-universe.vercel.app`. Its Framework Preset is Next.js and its
  Root Directory is `apps/web`.
- Vercel must use the exact `devam-universe` Supabase URL and matching
  publishable key. Never expose the Supabase service-role secret to the browser
  or Vercel public environment.
- The production origin was made reachable after correcting Vercel framework
  detection and the Supabase project binding. The cosmic Atlas correction in
  the current worktree is not deployed until it is committed, pushed, accepted
  on PR #5, and released.

Two untracked research directories are concurrent other-task work and must not
be staged, rewritten, deleted, or included in deployment commits:

- `research/sarthi-artificial-wisdom/intellectual-apprenticeship-round-1/`; and
- `research/sarthi-artificial-wisdom/understanding-layer-pilot/`.

## Current consumer-experience checkpoint

The Atlas has been rebuilt as a full-viewport cosmic open world. The permanent
left menu, Panchang control, era/geography switchers, and bottom navigation have
been removed from the Atlas. Four hero gateways are master stars in the initial
desktop and phone viewports; graph nodes and edges read as a low-contrast deep
constellation, then become interactive as the camera enters a world. Zoom uses
procedural/vector/CSS layers rather than scaling the previous bitmap, so it
remains sharp.

Hero routes now continue into spatial 2.5D story paths rather than article-card
screens. Sārthi is a floating overlay chat in both the Atlas and a journey.
English story beats lead; sources, editions, locators, variants, uncertainty,
and ritual evidence remain collapsed underneath. Hindi story presentation and
richer scene-specific art/audio are still open and must not be represented as
complete.

Current local validation for the uncommitted consumer correction:

- 115 portable web test files pass: 767 tests passed and 17 named vault-only
  tests skipped;
- lint passes;
- TypeScript passes;
- the warning-free Next.js production build passes;
- the complete local desktop/mobile Playwright matrix passes 12/12; and
- direct browser inspection at 1440x1000 and 412x915 confirms all four master
  stars are in the playable viewport, Ramayana graph entry remains spatial, and
  no browser page/console errors were observed.

The next release boundary is to commit and push only the reviewed cosmic-Atlas
files, obtain fresh PR #5 CI, review its Vercel preview, and merge/release only
after the user approves that exact candidate. Deployed account continuity,
custom SMTP, export/deletion/sign-out, and the full deployed 12-case browser
matrix remain release acceptance gates.

## Latest completed checkpoint

The finite investor-demo contract is now frozen in
`docs/INVESTOR_DEMO_ACCEPTANCE_MATRIX.md`, and a checked-in Playwright suite
passes 12/12 journeys across desktop Chrome and a Pixel 7 viewport. It covers
Atlas pan/zoom/reset/era controls, all four hero gateways, four curated
journeys, challenges, four hero Search lanes, bounded Ramcharitmanas Sarthi
answers with expandable sources, deterministic Diwali Today guidance, and the
guest-to-account boundary.

The first browser run caught a real hosted-data integration defect: the Atlas
mapper attempted to render an independently managed `ganesha-purana` row that
has no reviewed Devam exploration metadata. The fix filters nodes and edges by
the exact reviewed Devam `visual.sourceId` universe. The external row and edge
remain untouched in Supabase, while the app renders only its owned Atlas
records. A regression test freezes that boundary.

This checkpoint is `LOCAL_ACCEPTANCE_PASSED`, not `INVESTOR_DEMO_READY`.
Deployment, fixed-origin SMTP/account acceptance, and browser acceptance on the
deployed preview remain open.

## Pause checkpoint - clean-checkout portability resolved

Feature work was deliberately paused for this handoff and an independent
adversarial MVP stocktake. No product, Supabase, source-vault, alias, deployment,
or external-service state was changed during the stocktake.

Commit `5e360ad` added the first GitHub Actions workflow. Its first clean-runner
execution exposed a real portability defect:

- `source_vault/objects` is intentionally untracked under the one-copy source
  policy;
- several web runtime modules and vault-integrity tests still open those local
  object paths directly;
- the Python source/ingestion suite also assumes the local vault and lacks a
  declared clean-runner `jsonschema` dependency; and
- therefore the clean runner initially failed before lint, type-check,
  production build, Playwright, or deployability could be proved.

Commit `d2b20fc` resolves that defect without copying source bytes. Five Sarthi
loaders and the Gita Jayanti loader now validate compact, tracked source
identity, coordinates and span hashes without opening the canonical payload at
runtime. Seventeen exact carrier/span rehash tests are explicitly gated behind
the local-vault test lane. `pnpm test:vault` still runs all 694 tests when the
vault is mounted; `pnpm test:product` runs 677 product tests and reports the 17
offline checks as skipped. The complete Python discovery reported 213/213 OK,
including the three new clean-checkout repository-contract tests; the shell
wrapper reached its timeout immediately after unittest printed the successful
179.679-second closure, so the independent GitHub result below is the clean
exit-status authority.

GitHub Actions run `31247815169` independently passed on `d2b20fc`: the
source-vault-free web job completed portable unit tests, lint, type-check,
production build and all 12 desktop/mobile Playwright journeys; the separate
tracked-evidence and portability job passed 3/3. PR #4 is now draft,
`MERGEABLE`, and `CLEAN`. Compact knowledge packs and required ingestion
plans/reports are explicitly included in Next.js output tracing. The 6.17 GB
vault and source carriers remain absent from Git and the web bundle.

## Previous source/product checkpoint

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

- 91 web test files / 694 tests pass;
- 12/12 Playwright desktop/mobile acceptance cases pass;
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
| Living Atlas | Four gateways, 37 app world nodes, pan/zoom/pinch/double-tap, era filters, four journeys and four challenges, plus a distinct India geography layer for 11 evidence-bounded place nodes | The first map-grounded place experience is illustrative rather than navigational or politically authoritative; complete historical/geographic coverage, final hero art and depth remain. |
| Account | Guest preview, passwordless-auth plumbing, profile context, consented memory, export/delete | Needs deployed fixed origin, real SMTP and production acceptance. |
| Commercial | Provider-neutral `devam_one` entitlement boundary | No checkout, billing lifecycle or paid enforcement. |
| Operations | Dedicated Supabase project, comprehensive deterministic tests, and checked-in desktop/mobile Playwright acceptance | No Vercel deployment, production domain, deployed-origin browser result, analytics funnel, monitoring or public launch gate. |

Calibrated progress ranges, not promises:

- investor-demo vertical slice: 70–80%;
- invite-beta product: 45–60%;
- strict paid MVP in the product brief: 30–45%; and
- exhaustive long-term library: no responsible percentage until the denominator
  is normalized into required works, expressions, editions, languages,
  traditions, regions and media.

The misleading counters to avoid are: 8,491 objects is not 8,491 complete
works; 79/79 is only the selected observance inventory; 46 lane records are not
independent cultural review; 694 tests are not user desirability; 42 nodes are
not a mature knowledge graph; and a frozen pilot is not an evaluated pilot.

## Critical path and effort range

Fastest honest path:

The clean-checkout prerequisite is complete on `d2b20fc`; the numbered
productization sequence below is now the active critical path.

1. Review and merge PRs #1 → #2 → #3 → #4. Create a Vercel project linked to
   the consolidated GitHub branch; configure fixed Supabase Auth origin and SMTP.
2. Run the checked-in Playwright suite on the deployed preview and complete
   real SMTP/account continuity, export, deletion, and fixed-origin acceptance.
3. Polish one golden path for each of the four hero worlds, including final
   quality scene art. The first bounded time/geography map experience now
   exists, but it is not complete historical or civilizational coverage.
4. Run the frozen blinded Sarthi answer pilot. Enable bounded generation only
   if it beats the grounded baseline without source/applicability regressions.
5. The Search landing surface now publishes an honest investor coverage
   dashboard separating preserved, structurally understood, indexed,
   product-usable, translated, reviewed and complete. Keep its live counters
   and denominator boundaries current as the library expands.
6. Current ritual selection now enters through the generic
   `DEVAM_RITUAL_OBSERVANCE_CONTENT_V1` applicability/content registry before
   one ordered legacy-compatibility registry; a source guard forbids restoring
   per-observance resolver branches. New lanes must use the generic contract.
   Do not perform another destructive cleanup.

Rough focused effort with content work parallelized where possible:

- honest investor demo: 5–10 working days;
- invite beta with production QA and credible Sarthi pilot: 3–5 weeks;
- strict paid MVP: 5–8 weeks; and
- broad regional hero/ritual completion: 6–12+ weeks depending on research,
  expert review and rights resolution.

## Immediate next action

The release-readiness review is complete. Its exact no-mutation consolidation,
Vercel, Supabase Auth, SMTP, deployed-acceptance and rollback procedure is in
`docs/DEPLOYMENT_READINESS_RUNBOOK_2026-08-08.md`.

One deployment-test gap was closed locally: `apps/web/playwright.config.ts`
now accepts a credential-free HTTPS `DEVAM_PREVIEW_URL`, skips its localhost
web server in that mode, and runs the existing 12 desktop/mobile cases against
the deployed origin. Local behavior is unchanged when the variable is absent.

The four-PR stack is a strict ancestry chain and the cumulative PR #4 tip is the
unit that CI proved. With explicit authorization, merge #1 ? #2 ? #3 ? #4 using
merge commits in one maintenance window. Do not squash a lower stacked PR.
Before connecting Vercel, require the final `main` tree to equal
`37b67df0f303a4f8cf89ff563563282456eb9b0d` and require CI to pass again.
Then create the isolated Vercel project with root `apps/web`, configure the
fixed Supabase Auth origin and custom SMTP, and run both the deployed browser
suite and the controlled-mailbox account acceptance. Do not call the green
clean-checkout result a deployed or investor-ready result.

Parallel library-acquisition tasks may continue under the one-copy source-vault
contract, but they must not block deployment and acceptance of the product
vertical slice.

## Paste-ready continuation prompt

> Continue the Devam MVP in `C:\Work\Code\sanatan_knowledge_graph` from the
> exact current Git state. Read `AGENTS.md` and
> `DEVAM_MVP_CURRENT_HANDOFF_2026-08-08.md` completely, then follow its startup
> sequence. Read `docs/DEPLOYMENT_READINESS_RUNBOOK_2026-08-08.md` completely.
> Reverify branch, clean worktree, the four-PR ancestry, current GitHub checks,
> and the retained source-vault summary. The release-readiness review found the
> stack clean and strictly ordered; GitHub Actions run `31247952813` passed both
> jobs on cumulative tip `fa1c32c`. The restored vault also passed
> `python tools/lean_cleanup.py verify` at 8,491 objects / 6,167,702,553 bytes /
> 12,507 provenance records. Playwright now supports deployed-origin execution
> through `DEVAM_PREVIEW_URL`. The next task is the explicitly authorized
> consolidation and controlled deployment: merge PRs #1 through #4 in order
> with merge commits, require final `main` tree
> `37b67df0f303a4f8cf89ff563563282456eb9b0d`, rerun CI, create the isolated
> Vercel project rooted at `apps/web`, bind the exact Supabase Auth origin and
> custom SMTP, then run all 12 deployed browser cases plus controlled-mailbox
> account continuity/export/deletion/sign-out acceptance. Preserve the one-copy
> source vault, rights/edition/uncertainty boundaries, and honest selected-scope
> counters. Recommend the cheapest sufficient model before substantive work.
> Do not merge, deploy, spend, configure external email, or publish without the
> relevant explicit authorization.

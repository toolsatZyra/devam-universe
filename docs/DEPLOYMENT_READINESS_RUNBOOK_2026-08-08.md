# Devam deployment-readiness runbook ? 2026-08-08

## Decision

The cumulative release candidate at commit `fa1c32cc41b76f45fa44e02b700ded14e7dcb7c0`
is ready for an explicitly authorized consolidation and controlled Vercel
deployment. It is not deployed and is not yet `INVESTOR_DEMO_READY`.

The candidate tree is
`37b67df0f303a4f8cf89ff563563282456eb9b0d`. GitHub Actions run
`31247952813` passed both jobs on that exact tip: portable unit, lint,
type-check, production-build and 12 desktop/mobile browser cases, plus the
tracked-evidence portability contract.

The restored one-copy vault independently passed `python tools/lean_cleanup.py
verify` immediately before this runbook was written:

- 8,491 unique objects;
- 6,167,702,553 bytes;
- 12,507 provenance records;
- objects manifest SHA-256
  `effcb3424ffd38e94499654f232212e6dc8efa0b7a7aaab00c1ecd80eb9a6135`;
- provenance map SHA-256
  `96464556d9906dd0587c08ad3defeca33f51c515413fdc8ae46e5c9cb34be5e1`;
- summary SHA-256
  `f5093b53c64a0c23110c1360392eeb33a969ff987f39546f8dafd138c62cac3e`.

This is a restoration-integrity result, not a library-completeness percentage.

## Consolidate Git without invalidating the tested stack

The four draft pull requests are a strict ancestry chain and GitHub currently
reports every one as `CLEAN`:

1. PR #1, `codex/complete-dutt-ramayana-english` ? `main`;
2. PR #2, `codex/acquire-dp-sharma-hindi-ramayana` ? PR #1 branch;
3. PR #3, `codex/acquire-ramcharitmanas-wikisource` ? PR #2 branch;
4. PR #4, `codex/investor-demo-acceptance` ? PR #3 branch.

Only PR #4 contains the CI workflow, so the independently tested unit is the
complete cumulative tip. With explicit authorization:

1. merge PRs #1, #2, #3 and #4 in order using merge commits;
2. do not squash or rebase a lower stacked PR, because that changes ancestry
   under every later PR;
3. perform the four merges in one maintenance window, before connecting Vercel
   to `main`;
4. fetch `main`, require a clean worktree, and verify that its final tree is
   exactly `37b67df0f303a4f8cf89ff563563282456eb9b0d`;
5. require the two `Devam MVP CI` jobs to pass on the resulting `main` commit.

If repository settings make ancestry-preserving merges unavailable, stop and
restack or replace the stack deliberately. Do not improvise a mixture of squash
and merge strategies.

## Create the isolated Vercel project

No Vercel link currently exists in the repository or `apps/web`. After the
consolidated `main` tree and CI are verified, create one project with:

- Git repository: `toolsatZyra/devam-universe`;
- project name: `devam-universe`;
- production branch: `main`;
- framework: Next.js;
- root directory: `apps/web`;
- install command: `pnpm install --frozen-lockfile`;
- build command: `pnpm build`;
- no source-vault upload and no include rule for `source_vault/objects`.

Configure these production variables:

| Variable | Required value/boundary |
|---|---|
| `SUPABASE_URL` | Exact URL of the isolated `devam-universe` Supabase project |
| `SUPABASE_PUBLISHABLE_KEY` | Publishable key only; never a secret/service-role key |
| `DEVAM_SITE_URL` | Exact stable HTTPS Vercel production origin, with no path |
| `DEVAM_SUBSCRIPTIONS_ENABLED` | `false` until checkout and paid enforcement are accepted |
| `SARTHI_GENERATION_ENABLED` | `false` until the frozen blinded answer pilot passes |

Do not add `SUPABASE_SECRET_KEY` or `OPENAI_API_KEY` to this investor-demo
deployment. The current public product path does not require either one.

## Bind Supabase Auth to the fixed origin

The hosted database project already exists and its product migrations are
separate from Vercel configuration. Do not replay migrations merely because a
web project is created.

In Supabase Auth URL Configuration:

1. set Site URL to the exact `DEVAM_SITE_URL` origin;
2. add the exact redirect URL
   `<DEVAM_SITE_URL>/auth/callback?next=/account`;
3. retain localhost redirects only for deliberate local development;
4. avoid a production wildcard when an exact path is available.

Configure a custom transactional SMTP provider before testing a non-team email
address. Supabase's default SMTP is restricted and not suitable for public or
invite-beta delivery. Set the sender identity, then test delivery, callback,
session persistence and sign-out using a controlled mailbox. Do not place SMTP
credentials in Git or Vercel client-visible variables.

Current Supabase changes relevant to this runbook are already accounted for:
new public tables may require explicit Data API grants in addition to RLS, and
new free projects using default SMTP cannot rely on custom templates. This
deployment adds no table and changes no database authorization.

Official references:

- https://supabase.com/docs/guides/auth/redirect-urls
- https://supabase.com/docs/guides/auth/auth-smtp
- https://supabase.com/docs/guides/deployment/going-into-prod
- https://vercel.com/docs/monorepos
- https://vercel.com/docs/git

## Deployed acceptance

After the deployment is `READY`, run the existing browser suite against the
fixed origin instead of localhost:

```powershell
$env:DEVAM_PREVIEW_URL='https://the-exact-deployed-origin.example'
pnpm --dir apps/web test:e2e
Remove-Item Env:DEVAM_PREVIEW_URL
```

The Playwright configuration rejects a credential-bearing or non-HTTPS
external URL and does not start a local web server when this variable is set.
The run must pass all 12 desktop/mobile cases with no console errors or
horizontal overflow.

Complete the account acceptance separately with the controlled mailbox:

1. request one magic link on the fixed origin;
2. prove the link returns to `/auth/callback?next=/account` on the same origin;
3. save language, location, family-practice and consent fields;
4. continue one owner-scoped Sarthi thread;
5. export the user's data;
6. delete saved memories and verify they no longer appear;
7. sign out and verify the authenticated surfaces close.

Record the deployed URL, deployment ID, Git commit, CI run, browser result and
mailbox test timestamp in the handoff. Do not record the mailbox address,
tokens, cookies or SMTP credentials.

## Rollback and release boundary

Before public sharing, record the last known-good Vercel deployment ID. If a
deployed gate fails, use Vercel's deployment rollback or reassign the production
alias to that known-good deployment; do not alter source-vault bytes or delete
hosted evidence. A database rollback is not part of this web-only deployment.

`INVESTOR_DEMO_READY` requires D1?D9 and D11?D12 on the same deployed commit.
D10 may use the controlled internal mailbox for the investor demo but is
mandatory for invite beta. Paid checkout, the blinded Sarthi pilot, final hero
art and the remaining strict library/variant gaps remain separate MVP work.

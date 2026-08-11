# Devam investor-demo acceptance matrix

This is the finite acceptance boundary for the first investor demonstration. It
does not redefine the paid MVP or the exhaustive-library objective. A demo is
accepted only when every `D` gate below passes on the same Git commit and
deployed preview, with the named source and scope boundaries still visible.

| Gate | Persona and proof journey | Pass condition | Automated evidence |
|---|---|---|---|
| D1 | Curious guest opens the Living Atlas | Premium cosmic 2.5D shell loads on desktop and smartphone; Ganesha, Durga, Ramayana and Diwali gateways are visible; pan/zoom/reset and era controls work without horizontal overflow | Playwright Atlas test in both projects |
| D2 | Guest explores coherent paths | Four source-grounded curated journeys and four mission paths are reachable; progress is exploration, never spiritual merit | Playwright journey/challenge test plus unit fixtures |
| D3 | Ganesha household user | Search returns the scoped West India Ganesh Chaturthi lane with applicable steps, timing, materials/substitutions, stories, variants and evidence | Playwright four-hero Search test plus ritual-contract tests |
| D4 | Durga/Navaratri participant | Search returns the scoped North/West Shardiya Navaratri lane; Bengal Durga Puja remains a separate context rather than a merged generic ritual | Playwright four-hero Search test plus ritual-contract tests |
| D5 | Ramayana explorer | The Atlas exposes Ramayana; Search and Sarthi reach the locally prepared 813-page proofread/validated Ramcharitmanas slice with seven sopana anchors and the explicit 345-page unproofread text exclusion; 14 q0 scan coordinates are verified structural blanks; hosted application remains a separate authorized step | Playwright Atlas, Search and Sarthi tests plus local compiler report and separately versioned hosted report |
| D6 | Diwali household user | Search returns scoped Lakshmi Puja guidance; Today resolves the 8 November 2026 Mumbai West India context without merging Kali Puja, Tamil Deepavali, Jain Diwali or Bandi Chhor | Playwright Search and Today tests plus observance fixtures |
| D7 | Calendar/actionability user | Today accepts date, place and practice context; deterministic sunrise, sunset and matched observance appear; supported guidance is actionable and bounded | Playwright Today test plus Panchang/ritual suites |
| D8 | User asks a wider question | Sarthi answers concisely from identified evidence, keeps exact sources expandable, states material incompleteness and never presents itself as guru or priest | Playwright Sarthi test plus planner/governor tests |
| D9 | Guest evaluates before signup | Two gateway previews and one Sarthi exchange work; continuing the conversation presents an account invitation rather than silently persisting memory | Playwright Atlas/Sarthi/account tests |
| D10 | Returning account user | Passwordless flow, profile context, consented conversation continuity, export and deletion work on the deployed fixed origin with real SMTP | Deployment acceptance; currently open |
| D11 | Investor checks library scale honestly | Coverage distinguishes preserved objects, hosted/indexed passages, product-usable lanes, private/review evidence and open hero gaps; no object count is called complete-work coverage | Search coverage surface and frozen stocktake |
| D12 | Production operator | Consolidated PR stack is deployed from GitHub; no browser/page errors; mobile/desktop E2E, unit tests, lint, typecheck and production build pass; rollback is a Git/Vercel deployment rollback | CI/deployment acceptance; currently open |

## Demo script

Run one uninterrupted 8–12 minute path: open the Atlas and zoom from Ramayana
to Ramcharitmanas; follow one curated stop; search the exact edition; ask
Sarthi what the source covers; open Today for Mumbai on 8 November 2026; view
the scoped Lakshmi Puja guidance; show the account invitation and the honest
coverage dashboard. Then briefly open the Ganesha and Durga journeys to prove
that the mechanics are shared rather than a single hard-coded demo.

## Release decision

- `INVESTOR_DEMO_READY` requires D1–D9 and D11–D12 on the deployed preview.
- D10 may use a controlled internal test mailbox for the investor demo, but it
  is mandatory for invite beta.
- Any missing citation, hidden rights mismatch, broken scope boundary, browser
  error, mobile overflow or fabricated Panchang/ritual result is a hard fail.
- Paid checkout, full regional ritual breadth, the blinded Sarthi pilot and the
  strict hero-source gaps remain required for later MVP gates even if this demo
  boundary passes.

## Current local checkpoint

The checked-in Playwright suite passes all 12 cases across desktop Chrome and a
Pixel 7 viewport. It exercises D1-D9 against the hosted Supabase-backed local
application, including pan, zoom, reset, era switching, the four hero Search
lanes, expandable Sarthi evidence, deterministic Diwali Today guidance, and the
guest account invitation. The same worktree passes 694 web unit tests, 210
source/ingestion Python tests, lint, TypeScript, and the production build.

This is `LOCAL_ACCEPTANCE_PASSED`, not `INVESTOR_DEMO_READY`: D10 and D12 still
require the fixed deployed origin, SMTP/account acceptance, and the same browser
suite on that deployment. Paid checkout remains outside the investor-demo gate
and inside the later paid-MVP boundary.

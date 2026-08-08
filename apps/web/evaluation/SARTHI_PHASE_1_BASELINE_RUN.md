# Sarthi Phase 1 baseline run

Status: **runner ready; external calls not authorized or made**.

`pnpm preflight:sarthi-phase1-baseline` verifies the frozen fixture, admitted
packets, materialized reviewed evidence, model/settings contract and exact
thirty-call envelope root without credentials, writes or network calls.

The live runner is intentionally fail-closed. It requires all of the following:

- explicit user authorization for thirty OpenAI Responses API calls;
- `DEVAM_SARTHI_PHASE1_RUN_AUTHORIZATION=I_AUTHORIZE_30_OPENAI_CALLS`;
- `OPENAI_API_KEY`;
- input, cached-input and output USD-per-million-token values copied from a
  currently verified official OpenAI pricing page;
- that official pricing URL and an ISO access timestamp; and
- a stable `--run-id`.

The pricing variables are
`DEVAM_BASELINE_INPUT_USD_PER_MILLION`,
`DEVAM_BASELINE_CACHED_INPUT_USD_PER_MILLION`,
`DEVAM_BASELINE_OUTPUT_USD_PER_MILLION`,
`DEVAM_BASELINE_PRICING_SOURCE_URL`, and
`DEVAM_BASELINE_PRICING_ACCESSED_AT`.

The runner uses the spec-pinned `gpt-5.6-terra` medium-reasoning setting,
`store: false`, a twenty-second timeout and no automatic retries. It checkpoints
after every response under `evaluation/runs/`. An interrupted run can resume
only when its specification, envelope root, model, reasoning and pricing hashes
are unchanged. Prior error records remain visible after recovery.

Each completed record retains the blind ID, scenario/language mapping, packet
and evidence hashes, provider response ID, latency, cached/uncached/output token
counts, estimated cost, answer, material caveat and any error. Hidden reasoning
is neither requested nor retained. Completing the run is not a quality claim;
blinded bilingual human review and hard-failure analysis remain mandatory.

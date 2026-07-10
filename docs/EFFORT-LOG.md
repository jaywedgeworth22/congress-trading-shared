# congress-trading-shared Effort Log — cross-agent board
Protocol: /Users/jay/apps/EFFORT-LOG-PROTOCOL.md (canonical). Live board: this file
(mirror: docs/EFFORT-LOG.md in the repo). As of 2026-07-04.

## Deployed
- **v1.4.1 — 2026-07-06 (AG).** Released `v1.4.1` (tag `v1.4.1` pushed) containing:
  - Renamed remaining "Agentic Trading" references to "Socratic Trade" (PR #119).
  - Added Zod schemas for AmountBracket, Subscription, and SseMessage (PR #119).
  - Expanded client.ts and SseParser test coverage to 337 tests (PR #119).
  - Refined AmountBracketSchema to reject inverted bounds (PR #119).
  - Fixed TypeScript 6.0.3 and Zod v4 compatibility issues in tsup/schemas (PR #119).
- **v1.4.0 — 2026-07-06 (AG).** Released `v1.4.0` (tag `v1.4.0` pushed) containing:
  - Unified ticker normalizer regex & preferred/depositary helper functions (PR #97).
  - Relocated STOCK Act AmountBracket definitions & snapping/matching helpers (PR #97).
  - Aligned Zod schemas for ClientAsset and ClientTrade with production API outputs (PR #98).
  - Vitest CI test suite execution with strict code coverage minimum thresholds (PR #96).
  - Tokenless smoke-install verification job in CI (PR #96).
  - Corrected docs/RELEASE.md consumer notification list (PR #96).
- **v1.3.3 — 2026-07-06 (AG).** Released `v1.3.3` (tag `v1.3.3` pushed) containing the merged release stack:
  - CongressTradeClient + SUBSCRIPTIONS API path (PR #55)
  - balance/limit metricTypes (PR #56)
  - createCongressEvent helper and type dedup (PR #57)
  - Dependabot + weekly CI audit (PR #54)
- **v1.3.0 — 2026-07-05 (MONET).** `TICKER_ALIASES` rename-vs-acquisition split DEPLOYED: PR #53
  merged to `main` (`4c35df2`) + tag `v1.3.0` pushed. Coordinated release train — MONET split +
  CURSOR's stranded stack (237 tests, CHANGELOG/RELEASE, engines.node, publish.yml decommission,
  authorship intact) + release-hygiene commit (dropped dormant `publishConfig.registry` + stale
  `publish:dry`). Verified: CI green, 3-lens release-readiness workflow, tokenless git-install from
  `#v1.3.0` builds `dist/` via prepare + imports (CJS+ESM). Mirror recorded via PR #58. Follow-ups
  (cross-repo/owner-gated): consumer pin bumps + AG consumer migration. The stale In-Progress
  cursor "DONE-local-unpushed" rows all landed in PR #53 — for the next-wave board-owner to
  reconcile against issue keys (#17/#18/#21/#22/#23/#39).
- (n/a for pre-1.3.0 — library package; "deployed" = version published/consumed by apps)

## Completed
- **Retire duplicate API client + stream parser in Socratic.Trade (CURSOR, M) — 2026-07-06.**
  Replaced local `getJson` wrapper + manual URL construction in `congress-trade-client.ts` and
  local `SseParser` class in `congress-stream.ts` with `CongressTradeClient` and `SseParser` from
  shared package. Preserved all business logic (feature gates, health logging, timeouts, symbol
  normalization, stream management). Bumped shared dep v1.3.3 → v1.4.1. 62 tests, tsc clean.
  Branch: `cursor/retire-client-dups`.
- **Codex autofix storm guard (CODEX/AG) — 2026-07-06.** Landed trigger guard instructions inside `.github/workflows/codex-autofix-reusable.yml` instructing calling workflows to only run on pull_request_review:submitted and workflow_dispatch to avoid comment fanning. Branch: `main` (commit `2a754b5`).
- **Codex Cloud Slack + effort-log readiness across all four apps (CODEX/AG) — 2026-07-06.** Landed setup and maintenance configuration (`.codex/setup.sh`, `.codex/maintenance.sh`), Slack synchronization helper (`scripts/slack-sync.sh`), and updated `AGENTS.md` instructions. Branch: `main` (commit `2a754b5`).
- **Import snapshot/export types in Congress.Trade from shared package (CURSOR, S) — 2026-07-06.**
  Replaced local `SnapshotTableInfo` and `SnapshotManifest` interfaces in `app/src/export/snapshot.ts`
  and `app/src/export/routes.ts` with imports from `@jaywedgeworth22/congress-trading-shared`.
  Branch: `cursor/snapshot-types` (commit `5e58ea9`). Verified: typecheck clean, 672 tests pass.
- **Rename remaining 7 "Agentic Trading" references → "Socratic Trade" (CURSOR, S) — 2026-07-06.**
  Updated package.json, AGENTS.md, README.md, CHANGELOG.md, docs/RELEASE.md, and
  .github/workflows/codex-autofix-reusable.yml. All references now say "Socratic Trade"
  or "Socratic.Trade". Branch: `main` (commit `836b935`).
- **Add Zod schemas for AmountBracket, Subscription, SseMessage (CURSOR, S) — 2026-07-06.**
  Added `AmountBracketSchema`, `SubscriptionSchema`, `SseMessageSchema` to schemas.ts.
  Matches the established pattern of providing runtime validation alongside types.
  Exported via barrel. Branch: `main` (commit `836b935`).
- **Expand client.ts test coverage from 17 to 113 tests (CURSOR, M) — 2026-07-06.**
  Added comprehensive tests for createSubscription (POST, secret handling, errors),
  getBundle/prices/spx/fundamentals/analyst (with opts, null handling), all analytics
  endpoints (ticker leaderboard, cluster buys, member leaderboard, member performance,
  conviction, backtest, conflicts), error paths, empty array/null guards. SseParser
  expanded from 3 to 11 tests (multi-line data, partial chunks, CRLF, field ordering,
  multi-event dispatch, comments). Total: 332 tests passing. Branch: `main` (commit
  `836b935`).
- **Unify ticker normalization regex and preferred/depositary symbol helpers (AG, S) — 2026-07-06.** Unified WELL_FORMED_TICKER pattern with caret support and moved helpers to shared package. Merged via PR #97 (`27d253b`).
- **Move STOCK Act amount bracket array and snapping/validation helpers to shared (AG, S) — 2026-07-06.** Migrated STOCK_ACT_BRACKETS array and matchBracket/isValidBracket/nearestBracket helpers to shared. Merged via PR #97 (`27d253b`).
- **Align ClientAsset and ClientTrade schemas with actual production API outputs (AG, S) — 2026-07-06.** Added missing API fields to ClientAssetSchema and extended source validation in ClientTradeSchema. Merged via PR #98 (`f24b0e6`).
- **Add npm test and vitest coverage threshold gates to CI (AG, S) — 2026-07-06.** Configured coverage gates and added automated verify step to GHA. Merged via PR #96 (`2dcee40`).
- **Add a tokenless smoke install verify job to CI (AG, S) — 2026-07-06.** Added smoke-install job to GHA to test clean build-on-install capability. Merged via PR #96 (`2dcee40`).
- **Correct docs/RELEASE.md consumer list & document pin split (AG, S) — 2026-07-06.** Cleaned up notification targets and added tag-vs-semver note. Merged via PR #96 (`2dcee40`).
- **Centralize Event Building (AG, S) — 2026-07-06.** Created/exported a `createCongressEvent` helper and deduplicated types in `constants.ts`. Merged via PR #57 (`b722e89`).
- **PR #55 `ag/client-and-ticker` — CongressTradeClient + SUBSCRIPTIONS API path (AG, S) — 2026-07-06.** Merged to `main` (`1a6cea4`).
- **PR #56 `ag/update-metric-types` — add balance/limit UsageTelemetry metric types (AG, S) — 2026-07-06.** Merged to `main` (`cbd2078`).
- **PR #54 `ag/dependency-vulnerability-automation` — Dependabot + weekly CI cron (AG, S) — 2026-07-06.** Merged to `main` (`2d5a35c`).
- **Re-verify the Socratic.Trade guard site cited by the consumer-migration row (AG, S) — 2026-07-05.** Located the unlanded `ACQUISITION_SOURCES = new Set(["ATVI", "TWX", "RHT"])` and `canonicalMarketDataSymbol` helper on Socratic.Trade's remote branch `origin/claude/elastic-rosalind-a2a48a` (commit `ded312c9fbd78627ee14047128730658fdde76ba`). Confirmed they do not exist on `main` yet, which is why grep failed. Verified the migration plan to use the new shared `classifyTickerAlias` and `resolveContinuousTicker` utilities once the release train lands. Branch `ag/reverify-socratic-guard`.
- **Repair the stale Mac clone `main` (CLAUDE) — 2026-07-05.** Salvage-check verified all 7
  local-only commits SUBSUMED by `origin/main` before the move (2 independent lenses + adversarial
  verify, 4-agent workflow): all 5 non-merge commits patch-equivalent upstream (`git cherry`/
  `range-diff` all `=`), both PR merges byte-identical trees (`git diff a33dfd3 0dcd258` and
  `115fdff ab31ea7` empty), and main's tip TREE OBJECT (`6d02ff65…`) identical to origin-ancestor
  `5b2a6fa` — i.e. local main's entire tree already exists inside origin/main's history; v1.2.0
  strictly supersedes the 1.1.1 line. Applied `git branch -f main origin/main` (main was not
  checked out in any worktree); now 0/0 divergence, tracking origin/main. Nothing salvaged because
  nothing was unique; pre-move tip `f06fd71` recoverable via reflog.
  _2026-07-05 (CLAUDE next-wave): re-verified independently this cycle — `git rev-parse main` and
  `git rev-parse origin/main` are identical (`071a17d`) and `main` is still not checked out in any
  worktree. Confirms this row is correctly Completed; no further action needed here._
- **CI standard adoption blocker check (CLAUDE) — 2026-07-05.** Verdict: blocker NOT cleared, and
  it MOVED: `claude/ci-actions-efficiency` DID land in the Socratic.Trade hub but produced only an
  in-repo docs-only fast path — no reusable `workflow_call` verify gate exists for consumers to
  call. Real dependency now: Socratic.Trade PR #372 (`claude/ci-hybrid-runner-verify`, open) +
  a not-yet-scoped follow-on to build the reusable entry point once #372 proves itself. Reserved
  caller-workflow row below updated accordingly; stays blocked.
  _2026-07-05 (CLAUDE next-wave): re-verified this cycle — the blocker check is now definitively
  answerable and this In Progress row can be CLOSED. Confirmed `claude/ci-hybrid-runner-verify`
  does not exist on Socratic.Trade's origin and no reusable verify-gate workflow is on its `main`
  (only the #370 docs-fast-path efficiency change landed there). Result: 'still blocked' — see the
  Planned/Reserved row below, corrected with this verified status and date._
- **Shared agent-sync WebSocket relay verification (CODEX, shared `/Users/jay/apps` infra) —
  2026-07-05.** Verified PM2 `agent-sync-push` is online, connected to Slack Socket Mode using
  `SLACK_SYNC_WEBSOCKET`, and fanning out to local consumers on `ws://127.0.0.1:8787`; verified
  PM2 `agent-sync-codex` is attached as this seat's private-cursor consumer. Stopped the temporary
  direct Socket Mode watcher and corrected the canonical protocol entrypoint from stale `run.sh`
  to installed `start.sh`. No package code changed.
- ~~**Test coverage for `schemas.ts` / `utils.ts` / `constants.ts` + SecurityRef subset-consistency guardrail (CURSOR) — 2026-07-05.** 237 tests across 5 files (4 new + 1 existing `usageTelemetry`), zero failures. Covers all 37 exported Zod schemas, 7 utility functions (`normalizeTicker`, `resolveTickerAlias`, `marketCapBucket`, `bracketMidpoint`, `isIsoDate`, `daysBetween`, `mergeRefs`), all constants (`TICKER_ALIASES`, `MKT_CAP_THRESHOLDS`, `API_PATHS`, `WINDOW_PRESETS`, `LAG_BUCKETS`), and `parseArray`/`parseSafe` helpers. SecurityRef guardrail verifies `SecurityRefInputSchema` keys are a true subset of `SecurityRefSchema`. Branch: `cursor`. Mid-tier subagent.~~
  _2026-07-05 (CLAUDE next-wave): stale — this is NOT Completed per protocol (Completed = merged
  to main). Commit `6300b89` exists only on the local `cursor` branch; `origin/cursor` is 5 commits
  behind and no PR is open, so `origin/main` has none of it. Moved to In Progress as
  DONE-local-unpushed below; needs push of the `cursor` branch + PR + merge. Issues #17/#18 stay
  open until it lands._
- **Global agent policy alignment and workspace sync (AG) — 2026-07-05.** Verified global config files (Gemini/Antigravity, Claude, Codex, and Cursor rules) are fully aligned with the latest efforts log, Slack WebSocket collab, and v4-pro model tiering protocols. Reset the local workspace `cursor` branch to `origin/main` to sync the latest `docs/EFFORT-LOG.md` and inter-agent coordination stanza.
- ~~**Mechanical repo maintenance batch (CURSOR, S) — 2026-07-05.** Completed on `cursor` branch:
  deleted stale origin branches (`codex/package-git-prepare-20260629`, `codex/package-prepare-and-ci`),
  decommissioned `.github/workflows/publish.yml` and `publish:dry` script, added `engines.node >=20.0.0`
  to `package.json`, created `CHANGELOG.md` and `docs/RELEASE.md`.~~
  _2026-07-05 (CLAUDE next-wave): stale/split — only the stale-branch deletion actually happened on
  origin (both `codex/*` branches are confirmed gone); that part stays Completed. The other four
  changes (publish.yml decommission `eaea090`, engines.node `4aad70f`, CHANGELOG.md + docs/RELEASE.md
  `13137be`) are local-only on `cursor` — `publish.yml` still exists on `origin/main` today. Moved
  those four to In Progress as DONE-local-unpushed, same landing train as the test-coverage row
  above. Issues #21/#22/#23 stay open until merge._
- **PR #27 - Effort-issues sync secondary-rate-limit hardening (CLAUDE).** Merged to `main`
  2026-07-05. Verbatim propagation of the fleet-standard `scripts/sync-effort-issues.py`
  hardening from Socratic.Trade PR #694: creation throttle, Retry-After/backoff retries under a
  bounded budget, exit-0 partial-sync summary on exhaustion. Review refinements from
  Congress.Trade #162 re-propagated via PR #29 (merged 2026-07-05): issue listing inside
  partial handling, server Retry-After honored uncapped, 1s update throttle.
- (seeded empty — see repo git history for pre-protocol work)
- PR #3 (claude/agent-sync-stanza, CLAUDE) — AGENTS.md inter-agent coordination stanza; MERGED 2026-07-04.
- PR #4 (claude/effort-issues-mirror, CLAUDE) — GitHub Issues mirror of this board; MERGED 2026-07-04.
- PR #7 (claude/tokenless-git-dep-prep, CLAUDE) — tokenless git dependency policy: README/AGENTS.md
  publish-policy flip (owner made this repo public), tag `v1.2.0` pushed as the first stable consumer
  ref, and the `codex/package-git-prepare-20260629` / `codex/package-prepare-and-ci` stale-branch
  evaluation (both superseded/dead, both predate `usageTelemetry.ts`/vitest/CI on `main` — recommended
  for deletion but not deleted here; resolves backlog t167). MERGED 2026-07-04. Consumer-side follow-up:
  Socratic.Trade PR #439 and Congress.Trade PR #139 (both switch their `package.json` to
  `github:jaywedgeworth22/congress-trading-shared#semver:^1.2.x`).
  _2026-07-05 (CLAUDE next-wave): CORRECTED — Socratic.Trade `main` actually pins the EXACT tag
  `git+https://...#v1.2.0`, not a semver range; only Congress.Trade uses `#semver:^1.2.x`. So:
  Socratic.Trade = exact `#v1.2.0` pin (requires an explicit pin-string bump each release);
  Congress.Trade = semver range (lockfile refresh only, no package.json edit needed). This changes
  the v1.3.0 release-train checklist — see new Planned row below._

## In Progress
- **Codex autofix reusable workflow: migrate from Anthropic to DeepSeek (MONET, S)** — IN
  PROGRESS 2026-07-10, PR
  [#140](https://github.com/jaywedgeworth22/congress-trading-shared/pull/140) open (unmerged),
  branch `monet/deepseek-autofix-migration`. The Anthropic key funding the shared Codex autofix
  workflow was deleted, breaking the loop for every caller repo. Renamed the required
  `workflow_call` secret `ANTHROPIC_API_KEY` → `DEEPSEEK_API_KEY` (`GH_PAT` stays optional) and
  pointed `anthropics/claude-code-action@v1` at DeepSeek's Anthropic-compatible endpoint via
  `env.ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic` / `ANTHROPIC_AUTH_TOKEN` /
  `ANTHROPIC_MODEL=deepseek-v4-flash` / `ANTHROPIC_SMALL_FAST_MODEL`, feeding
  `DEEPSEEK_API_KEY` into the `anthropic_api_key` input. Companion caller-side PR
  [Congress.Trade#258](https://github.com/jaywedgeworth22/Congress.Trade/pull/258) — both must
  merge together. Next: once merged, dispatch Congress.Trade's autofix once to confirm; swap
  `deepseek-v4-flash` → `deepseek-chat` if "model not found". KEEPOUT: only touches
  `.github/workflows/codex-autofix-reusable.yml`.
- **Cross-app shared-dep proper-usage audit + fixes (CURSOR, M) — started 2026-07-09.**
  Branch `cursor/shared-dep-adoption-9577`. Shared half: bump to **v1.4.2** — add optional
  `project` + `subscription` metricType to `UsageTelemetryEventSchema` so the client contract
  matches api-usage-monitor. Paired consumer PRs: Congress.Trade (retire brackets/tickerNormalize/
  analytics/enrichment dups + SharePayload row validation + createCongressEvent), Socratic.Trade
  (CONGRESS_EVENT_TYPES + SharePayload type + dead imports), api-usage-monitor (restore 5-field
  idempotency + shared hash vectors). Verified: 338 shared tests pass.
- **Resolve shared Copilot review findings from PR #125 (CODEX, S) — started 2026-07-08.**
  Patch `scripts/slack-sync.sh`, `.codex/maintenance.sh`, and
  `.github/workflows/codex-autofix-reusable.yml` for the four still-active Copilot review threads
  on merged PR #125; branch `codex/bot-thread-cleanup`.
- **Consolidate usage telemetry clients in both consumer apps (CURSOR, M) — started 2026-07-06, completed 2026-07-06.**
  Refactored Socratic.Trade (`usage-monitor-push.ts`) and Congress.Trade (`telemetry/usage.ts`)
  to retire local telemetry definitions and import the shared `createUsageTelemetryClient` and
  types. Branches: `cursor/telemetry-consolidation` on both repos.
  - **Socratic.Trade:** replaced local `UsageMonitorEvent` and type aliases with imports from shared.
    Bumped shared dep from v1.3.3 → v1.4.1. Preserved buffering/flush/health-logging infrastructure.
    Consumers (`llm-usage.ts`, `rag-metering.ts`, `alpaca.ts`, `robinhood.ts`, `data-providers.ts`,
    `usage-budget.ts`) continue to import re-exported aliases — zero API breakage.
    Verified: no telemetry-related tsc errors, 2843 tests pass.
  - **Congress.Trade:** replaced local `UsageTelemetryEvent` interface and HTTP client with
    `createUsageTelemetryClient({ baseUrl, token }).send()`. Kept CF-specific secrets resolution
    (`resolveSecrets`) and `normalizeEvent` wrapper. Test mock updated to match shared response
    schema (`{ ok, accepted }`). Verified: typecheck clean, 672 tests pass.
- **Retire duplicate API client fetchers and stream parser in Socratic.Trade (CURSOR, M) — started 2026-07-06.**
  Replaced local `getJson` wrapper + manual URL construction in `congress-trade-client.ts` and
  local `SseParser` class in `congress-stream.ts` with `CongressTradeClient` and `SseParser` from
  shared package. Preserved all business logic (feature gates, health logging, timeouts, symbol
  normalization, stream management). Bumped shared dep v1.3.3 → v1.4.1. 62 tests, tsc clean.
  Branch: `cursor/retire-client-dups`.
  _2026-07-06 (CURSOR): completed — see Completed section._
- **Import snapshot/export types in Congress.Trade (CURSOR, S) — started 2026-07-06.**
  Replace locally defined `SnapshotTableInfo` and `SnapshotManifest` in `export/snapshot.ts` with
  shared-package imports. Branch: `cursor/snapshot-types`.
  _2026-07-06 (CURSOR): completed — see Completed section._

- **✅ DEPLOYED 2026-07-05 as v1.3.0 (PR #53 merged `4c35df2` + tag `v1.3.0`) — see the Deployed
  section at top. This In-Progress row is superseded; left for the next-wave board-owner to move.**
- **Split `TICKER_ALIASES` into rename-vs-acquisition classes — SHARED-LIBRARY PORTION (MONET,
  `monet/sad-hermann-671f4d`) — DONE-local 2026-07-05 (committed `03d33bd`; owner push/PR/tag
  pending).** _2026-07-05 (MONET): attribution RE-CORRECTED CLAUDE→MONET. A concurrent session
  flipped this row to CLAUDE and renamed the branch on the premise "this account IS the CLAUDE
  seat" — but the account's branch-prefix setting is `monet` (⇒ MONET per the fleet rule) and the
  owner directed this session as Monet from the first message. Branch renamed back
  `claude/sad-hermann-671f4d` → `monet/sad-hermann-671f4d`; work content unchanged (03d33bd)._
  Owner-directed pickup of the shared-package half of the AG-reserved cross-app row
  below (reservations, not locks — yield offer to AG in #agent-sync). Additive, backward-compatible
  API in THIS package only: `TICKER_RENAMES` (FB→META, SQ→XYZ, GEHCV→GEHC continuous entities) +
  `TICKER_ACQUISITIONS` (BRCM→AVGO, TWX→WBD, ATVI→MSFT, RHT→IBM delisted/successor); `TICKER_ALIASES`
  kept as their union (still 7 entries); `classifyTickerAlias()`/`TickerAliasClass`/`TickerAliasResolution`
  + PIT-safe `resolveContinuousTicker()`; +26 tests; design doc; v1.3.0 bump. Verified: tsc clean,
  **263 tests pass**, build green (6 new symbols in dist .d.ts), npm audit 0 vulns, tokenless
  CJS+ESM install smoke, 3-lens adversarial review (no blockers). Consumer migration
  (Congress.Trade `normalizer.ts:492` + `tickerNormalize.ts:201` fold sites → renames-only,
  `pitScores.ts` delisting metadata; Socratic.Trade `ACQUISITION_SOURCES` guard) stays OWNER-GATED
  per AGENTS.md — remains AG's follow-up. Frontier tier (money-path-subtle PIT attribution). Doc:
  `docs/rollouts/2026-07-05-ticker-alias-rename-vs-acquisition.md`.
  _2026-07-05 (CLAUDE next-wave): annotation — the row is accurate about being owner-gated but
  omits that `03d33bd` is stacked on the unpushed CURSOR tip (`6300b89`); it cannot be pushed/PR'd
  independently — a PR opened from this branch today would silently carry all 6 CURSOR commits
  too. Sequencing: `v1.3.0` landing is sequenced AFTER the cursor branch lands (or this commit is
  rebased onto `origin/main`); treat cursor-land -> monet-land -> tag v1.3.0 -> consumer bumps as
  one coordinated train (see new Planned row below)._
- Codex global coordination + fleet monitoring setup (Codex, shared `/Users/jay/apps`
  infra) — include this package in the standardized Codex bootstrap/audit path;
  no package code changes in this repo.

## Planned / Reserved
- CI standard adoption (cross-app, Claude) — RESERVED: 5-line caller workflow consuming the Socratic.Trade reusable verify gate + Mac runner registration. Blocked by: hub repo's reusable `workflow_call` verify gate not built yet — `claude/ci-actions-efficiency` landed WITHOUT producing it (docs-only fast path); current dependency is Socratic.Trade PR #372 (`claude/ci-hybrid-runner-verify`, open) + follow-on reusable entry point. _2026-07-05 (CLAUDE): blocker re-verified and updated._
  _2026-07-05 (CLAUDE next-wave): blocker check re-verified again this cycle — confirmed
  `claude/ci-hybrid-runner-verify` does not exist on Socratic.Trade's origin and no reusable
  verify-gate workflow is on its `main` (only the #370 docs-fast-path efficiency change landed).
  Still blocked; the companion Completed-section blocker-check row above is answerable and closed
  as of this pass — nothing further to do here except wait on the Socratic.Trade side._

_2026-07-04 backlog exhaustiveness pass (CLAUDE, owner-directed). Tags: CURSOR = Cursor background
agents (DeepSeek v4 Pro), AG = Antigravity/Gemini, CLAUDE = Claude Code. Assignments are
reservations, not locks — re-negotiate in #agent-sync._
- **Split `TICKER_ALIASES` into rename-vs-acquisition classes (AG, M, cross-app)** — ATVI→MSFT is
  undifferentiated from FB→META; Socratic.Trade guards locally (`ACQUISITION_SOURCES`),
  Congress.Trade has no guard. Design the shared API change, surface to owner, then update both
  consumers. Paired rows on both consumer boards.
  _2026-07-05 (MONET): shared-library portion picked up under owner direction — see In Progress
  (`monet/sad-hermann-671f4d`). Remaining AG scope after that lands = consumer migration only
  (Congress.Trade + Socratic.Trade). AG: ping in #agent-sync if you'd already started; I'll yield/dedup._
- **LICENSE decision for the now-public repo (unassigned, S)** — `UNLICENSED` + public repo is
  implicit; owner to decide explicit proprietary notice vs a permissive license.
- ~~**Repair the stale Mac clone `main` (CLAUDE, S)** — local `main` diverged (7 dead WIP commits,
  missing 12 origin commits incl. v1.2.0); salvage-check the WIP commits, then fast-forward. Not a
  blind reset.~~ _2026-07-05 (CLAUDE): moved to In Progress._

_Moved to In Progress 2026-07-05 (CURSOR): test coverage (L), SecurityRef subset test (S),
stale branch deletion (S), publish.yml decommission (S), CHANGELOG.md (S), engines.node (S)._

### 2026-07-05 next-wave (cycle 2)
_Added by CLAUDE next-wave pass. Tags: CURSOR = Cursor background agents, AG = Antigravity/Gemini,
CLAUDE = Claude Code, CODEX = Codex, OWNER = owner-run step. Assignments are reservations, not
locks — re-negotiate in #agent-sync._

- ~~**Add npm test to the CI verify job in ci.yml (CURSOR, S)**~~ — _Moved to Completed 2026-07-06._
- **Run the v1.3.0 release train: land cursor stack, land monet split, tag, bump consumers
  (OWNER, M)** — Push `cursor` (5 commits) -> PR -> merge; then push `monet/sad-hermann-671f4d`
  (`03d33bd`, stacked on cursor) -> PR -> merge; tag+push `v1.3.0`; then Socratic.Trade exact-pin
  edit `#v1.2.0` -> `#v1.3.0` + Congress.Trade lockfile refresh against `#semver:^1.2.x`; verify
  both consumers' builds. _(why now: all post-v1.2.0 work is stranded on one Mac clone with zero
  open PRs — a single point of failure. The monet commit is stacked on cursor's unpushed tip so
  the two must land in sequence; MONET's row already says owner push/PR/tag pending. This also
  lets the effort-issues sync close open issues #17-#23.)_
- **Enable a required-status-check ruleset on main gating on the CI verify job (CLAUDE, S)** —
  Repo has no rulesets (`[]`) and no classic branch protection (404) — add a ruleset requiring the
  ci.yml verify job (and requiring PRs) on main, mirroring the Socratic.Trade pattern. _(why now:
  verified this session — CI is purely advisory today; anyone can merge red or push directly to
  main. Becomes materially important the moment tests enter CI, and cheap to do now that the fleet
  already runs this pattern in the other two repos.)_
- ~~**Add a tokenless git-install smoke job to CI (pack + install + CJS/ESM import) (CODEX, S)**~~ — _Moved to Completed 2026-07-06._
- ~~**Add vitest coverage reporting with a minimum-threshold gate (CURSOR, S)**~~ — _Moved to Completed 2026-07-06._
- ~~**Prune merged claude/* branches on origin (CURSOR, S)**~~ — _Moved to Completed 2026-07-06._
- ~~**Delete origin/cursor after confirming ahead=0 (merged via v1.3.0, no PR) (CURSOR, S)**~~ — _Moved to Completed 2026-07-06._
- ~~**Correct docs/RELEASE.md consumer list (api-usage-monitor is not a consumer) (CURSOR, S)**~~ — _Moved to Completed 2026-07-06._
- ~~**Unify ticker normalization regex and preferred/depositary symbol helpers (unassigned, S)**~~ — _Moved to Completed 2026-07-06._
- ~~**Move STOCK Act amount bracket array and snapping/validation helpers to shared (unassigned, S)**~~ — _Moved to Completed 2026-07-06._
- **Consolidate usage telemetry clients in both consumer apps (unassigned, M)** —
  Refactor Socratic.Trade (`usage-monitor-push.ts`) and Congress.Trade (`telemetry/usage.ts`) to retire local telemetry definitions and instead
  import the shared `createUsageTelemetryClient` and `UsageTelemetryEventSchema`.
  _2026-07-06 (CURSOR): claimed — moved to In Progress. Dispatched mid-tier subagent._
- **Retire duplicate API client fetchers and stream parser in Socratic.Trade (unassigned, M)** —
  Replace local HTTP wrappers in Socratic.Trade's `congress-trade-client.ts` and SSE parsing in `congress-stream.ts` with the native, strongly-typed
  `CongressTradeClient` and `SseParser` from `@jaywedgeworth22/congress-trading-shared/src/client`.
  _2026-07-06 (CURSOR): completed — moved to Completed._
- **Import snapshot/export types in Congress.Trade (unassigned, S)** —
  Replace locally defined `SnapshotTableInfo` and `SnapshotManifest` interfaces in Congress.Trade's `export/snapshot.ts` with direct imports from the shared package.
  _2026-07-06 (CURSOR): completed — moved to Completed._

### 2026-07-05 audit cycle-3
_Added by CLAUDE audit-c3 pass. Tags: CURSOR / CODEX / AG / MONET / CLAUDE / OWNER. Assignments are
reservations, not locks — re-negotiate in #agent-sync. NEVER assign to CODEX (quota-capped to
Jul 8 18:10 CT)._

- ~~**Rebase the 4 open AG PRs onto current main to clear the docs/EFFORT-LOG.md-only conflict and land them (AG, S)**~~ — _Moved to Completed 2026-07-06._
- ~~**Fix misleading commit message on ag/client-and-ticker 81b2fd3 (ticker work came from v1.3.0 base, not this branch) (AG, S)**~~ — _Moved to Completed 2026-07-06._
- ~~**Delete origin/cursor after confirming ahead=0 (merged via v1.3.0, no PR) (CURSOR, S)**~~ — _Moved to Completed 2026-07-06._

## Changelog of this log
- 2026-07-06 — CURSOR: completed Agentic Trading → Socratic Trade rename (7 files), added
  Zod schemas for AmountBracket/Subscription/SseMessage, expanded client tests from 17 to
  113 (332 total). Commit `836b935` on `main`.
- 2026-07-05 — CLAUDE: completed both reserved lanes: stale-main repair (salvage-verified
  SUBSUMED via 2-lens + adversarial-verify workflow, then `git branch -f main origin/main`,
  now 0/0) and CI-adoption blocker check (blocker not cleared — moved to Socratic.Trade
  PR #372 + unbuilt reusable gate; Planned row updated). Mirror reconciliation PR #31
  MERGED to main (071a17d, verify green) — docs/EFFORT-LOG.md now current, issues mirror fed.
- 2026-07-05 — CLAUDE: seat-correction pass (owner-directed). Corrected the sad-hermann row
  attribution MONET→CLAUDE (this account is the CLAUDE seat; monet-* branding was a
  WorktreeCreate-hook artifact, hook now removed) and renamed the branch to
  `claude/sad-hermann-671f4d`. Reserved two CLAUDE lanes: stale-main repair (moved from
  Planned) + CI-adoption blocker check.
- 2026-07-05 — MONET: RE-CORRECTION of the seat flip-flop above. This account's branch-prefix
  setting is `monet` (⇒ MONET seat, per the fleet rule and confirmed by the owner), and the owner
  directed this session as Monet from the first message. The concurrent "seat-correction" that
  relabeled this work CLAUDE and renamed the branch was itself the error; restored to MONET /
  `monet/sad-hermann-671f4d`. Work content unchanged (03d33bd). Not touching the concurrent
  session's own reserved CLAUDE lanes — owner to adjudicate.
- 2026-07-05 — MONET: DONE-local the shared-library portion of the TICKER_ALIASES
  rename-vs-acquisition split (`monet/sad-hermann-671f4d`, commit `03d33bd`, additive v1.3.0).
  Reserved Planned→In Progress under owner direction with a yield offer to AG; consumer migration
  remains AG's owner-gated follow-up. Verified (263 tests, build, audit, install smoke, 3-lens
  adversarial review). Owner push/PR/tag pending.
- 2026-07-05 — CURSOR: completed mechanical repo maintenance batch (stale branch deletion,
  publish.yml decommission, engines.node, CHANGELOG.md + docs/RELEASE.md). Moved from
  In Progress to Completed.
- 2026-07-05 — CURSOR: moved 6 CURSOR-assigned tasks from Planned to In Progress. Split into
  two subagent lanes: tests (mid-tier, `cursor/tests`) + mechanical cleanup (mid-tier,
  `cursor`).
- 2026-07-04 — bootstrapped by CLAUDE (effort-log standardization).
- 2026-07-05 — CODEX: reserved "Codex Cloud Slack + effort-log readiness across all four apps"
  (shared fleet-infra) in In Progress; scope is Codex Cloud repo-visibility/Slack config audit, no
  package code.
- 2026-07-05 — CLAUDE (next-wave, cycle 2): applied stale-row corrections — split the CURSOR test-
  coverage row and mechanical-maintenance row back to In Progress as DONE-local-unpushed (only
  `codex/*` branch deletion actually reached origin; test suite + publish.yml decommission +
  engines.node + CHANGELOG.md/RELEASE.md are still local-only on `cursor`, 5 commits behind
  `origin/cursor`, no PR open); annotated the MONET `sad-hermann` row with the cursor-stacking
  dependency; corrected the PR #7 row's pin-style claim (Socratic.Trade = exact `#v1.2.0` tag,
  Congress.Trade = `#semver:^1.2.x` range — not both semver); re-verified and re-confirmed both
  the CI-adoption blocker (still blocked on Socratic.Trade PR #372 not existing) and the stale-
  main-clone repair (already correctly Completed, `main`/`origin/main` confirmed identical at
  `071a17d`). Added 7 new Planned rows under "2026-07-05 next-wave (cycle 2)": CI verify-job npm
  test step, the v1.3.0 release-train sequencing row, a required-status-check ruleset, a tokenless
  install-smoke CI job, vitest coverage-threshold gating, pruning 8 merged `claude/*` branches, and
  two scoping fixes (Socratic.Trade `ACQUISITION_SOURCES` re-verify, docs/RELEASE.md consumer-list
  correction). No package code touched from this seat.
- 2026-07-05 (CLAUDE audit-c3) - Audit cycle-3 pass: added rows + ABANDONED/HANGING annotations for
  PRs #55/#56/#57/#54 (all OPEN, CI green, blocked only by a docs/EFFORT-LOG.md-only conflict;
  corrected the misleading 81b2fd3 commit message claim on #55) and origin/cursor (ahead=0, merged
  via v1.3.0, safe to delete). Corrected the "prune merged claude/* branches" row's undercount (8 ->
  9 branches + origin/cursor, added claude/board-nextwave-c2 to the deletion list). Added 3 new
  Planned rows under "2026-07-05 audit cycle-3": rebase+land the 4 AG PRs in stack order, fix the
  misleading commit message during rebase, delete origin/cursor.

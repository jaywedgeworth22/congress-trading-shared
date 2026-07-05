# congress-trading-shared Effort Log — cross-agent board
Protocol: /Users/jay/apps/EFFORT-LOG-PROTOCOL.md (canonical). Live board: this file
(mirror: docs/EFFORT-LOG.md in the repo). As of 2026-07-04.

## Deployed
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
- **Centralize Event Building (AG, S) — 2026-07-05.** Created/exported a `createCongressEvent` helper and deduplicated types in `constants.ts`. Branch `antigravity/shared-events`, PR #57 open.
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
- **Codex autofix storm guard (CODEX, workflow/fleet-infra) — DONE-local 2026-07-05; awaiting push/PR.**
  Scope: reduce caller `codex-autofix.yml` storm odds/frequency in Socratic.Trade and
  Congress.Trade; shared reusable workflow inspected for compatibility. Preserve manual dispatch,
  round-cap behavior, and the shared reusable prompt/action infrastructure.
- **PR #55 `ag/client-and-ticker` — CongressTradeClient + SUBSCRIPTIONS API path (AG, S) — new row,
  IN PROGRESS 2026-07-05 (CLAUDE audit-c3).** _NOT redundant post-v1.3.0._ `gh pr view 55`: OPEN,
  mergeable=UNKNOWN; `git merge-tree` shows the ONLY conflict is `docs/EFFORT-LOG.md` (code merges
  clean). Forked from `4c35df2` (the v1.3.0 merge), so the ticker split is ALREADY in its base — the
  branch does NOT duplicate/redo ticker work; net contribution is net-new `src/client.ts` (does not
  exist on `main`) + `SUBSCRIPTIONS` const. Commit `81b2fd3` message "move ticker alias resolution to
  shared" is MISLEADING (that code came from the v1.3.0 base, not this branch). Branch is only 2
  commits behind main (both docs-mirror-only: `f95e151`, `713f581`). action=reclaim-and-finish. [AG
  -> AG].
- **PR #56 `ag/update-metric-types` — add balance/limit UsageTelemetry metric types (AG, S) — IN
  PROGRESS 2026-07-05 (PR #56 open).** Added `"balance"` and `"limit"` to
  `UsageTelemetryMetricTypeSchema` in `src/usageTelemetry.ts` to match the server-side API Usage
  Monitor contract, and updated schema validation unit tests in `src/__tests__/usageTelemetry.test.ts`.
  Branch `ag/update-metric-types`.
  _2026-07-05 (CLAUDE audit-c3): `gh pr view 56`: OPEN, mergeable=UNKNOWN, CI verify PASS. Stacked
  on #55 (contains `81b2fd3`+`4d50cb2`). Only conflict is `docs/EFFORT-LOG.md`. Verified net-new:
  main's `UsageTelemetryMetricTypeSchema` enum does NOT contain balance/limit; branch adds both.
  Cannot land until #55 lands or it is rebased off the stack. action=reclaim-and-finish. [AG -> AG]._
- **PR #57 `antigravity/shared-events` — createCongressEvent helper + type dedup (AG, S) — new row,
  IN PROGRESS 2026-07-05 (CLAUDE audit-c3).** `gh pr view 57`: OPEN, mergeable=CONFLICTING, CI verify
  PASS. Stacked on #56 (6 commits ahead). Only conflict is `docs/EFFORT-LOG.md`. Verified net-new
  `src/events.ts` (does not exist on `main`). Bottom of a 3-deep stack (#55->#56->#57) — must land in
  order or be rebased. action=reclaim-and-finish. [AG -> AG].
- **PR #54 `ag/dependency-vulnerability-automation` — Dependabot + weekly CI cron (AG, S) — IN
  PROGRESS 2026-07-05 (PR #54 open).** Added weekly Dependabot checks (`.github/dependabot.yml`) for npm and github-actions ecosystems, and added a weekly cron schedule trigger to the CI verify job (`.github/workflows/ci.yml`) to ensure regular `npm audit` scans run between pushes. Branch `ag/dependency-vulnerability-automation`.
  _2026-07-05 (CLAUDE audit-c3): `gh pr view 54`: OPEN, mergeable=UNKNOWN, CI verify PASS.
  Independent of the #55 stack (1 commit ahead). Only conflict is `docs/EFFORT-LOG.md`. Net-new
  `.github/dependabot.yml` + ci.yml cron trigger. NOTE: does NOT add the npm-test CI step (separate
  Planned row remains open after this lands). action=reclaim-and-finish. [AG -> AG]._
- **Codex Cloud Slack + effort-log readiness across all four apps (CODEX, shared fleet-infra) —
  DONE-local 2026-07-05; awaiting owner approval to push/open PRs.** Scope: audit/standardize Codex Cloud repo-visible setup so remote
  Codex sessions can read `docs/EFFORT-LOG.md` and use #agent-sync with the configured
  `SLACK_AGENT_NAME`, `SLACK_CHANNEL_ID`, `SLACK_PROJECT`, and runtime token/env settings. Keep
  work out of dirty Cursor/Monet worktrees; reuse/adapt the closed PR #367 Slack helper rather than
  creating a competing Slack Socket Mode client. Cross-app rows mirrored in the other live boards.
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

- **Add npm test to the CI verify job in ci.yml (CURSOR, S)** — Insert a 'npm test' (vitest run)
  step into `.github/workflows/ci.yml` between typecheck and build; today CI runs
  typecheck/build/audit/pack:dry only. _(why now: the just-written 237-263-test suite gates
  nothing — a change that breaks every schema test still merges green. Cheapest highest-value
  follow-up unlocked by the cursor branch landing; land it immediately after (or as a rider on)
  that PR.)_
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
- **Add a tokenless git-install smoke job to CI (pack + install + CJS/ESM import) (CODEX, S)** —
  CI job that installs the package the way consumers do (`npm install <tarball or github:...>`)
  into a temp project and imports it via both `require()` and `import`, asserting a couple of
  exports exist. _(why now: both consumers install via tokenless git dependency relying on the
  prepare-script build and the exports map; MONET verified this manually for v1.3.0 — automating
  it catches prepare/exports-map regressions that typecheck/build/pack:dry cannot.)_
- **Add vitest coverage reporting with a minimum-threshold gate (CURSOR, S)** — Add
  `@vitest/coverage-v8`, a coverage config in `vitest.config.ts` with line/branch thresholds set
  just below current levels, and run it in CI. _(why now: now that near-complete coverage of
  schemas/utils/constants exists, a ratchet threshold prevents silent rot as new schemas are
  added; without it the new suite decays exactly like the pre-test era. Sequence after the
  npm-test CI step lands.)_
- **Prune merged claude/* branches on origin (CURSOR, S)** — Delete the 8 merged remote branches
  (`claude/agent-sync-stanza`, `claude/effort-issues-mirror`, `claude/tokenless-git-dep-prep`,
  `claude/board-backlog-pass`, `claude/board-effort-sync-refinements`,
  `claude/effort-sync-rate-limit-hardening`, `claude/effort-sync-review-refinements`,
  `claude/delegation-standard`) after confirming each is fully merged into origin/main. _(why now:
  the mechanical batch only deleted the two codex/* branches; the merged claude/* set still
  clutters origin and makes the branch list unreadable for the next agent triaging what is
  actually unlanded.)_
  _2026-07-05 (CLAUDE audit-c3): ABANDONED/HANGING correction — this row UNDERCOUNTS. `git
  ls-remote` shows `claude/agent-sync-stanza` (#3 MERGED), `board-backlog-pass` (#11),
  `board-effort-sync-refinements` (#30), `board-nextwave-c2` (#42), `delegation-standard` (#10),
  `effort-issues-mirror` (#4), `effort-sync-rate-limit-hardening` (#27),
  `effort-sync-review-refinements` (#29), `tokenless-git-dep-prep` (#7) — all present on origin
  with MERGED PRs — PLUS `origin/cursor` (see the separate row below). That is 9 claude/* branches
  + cursor, not 8. action=delete-branch (add `claude/board-nextwave-c2` to the deletion list).
  [CLAUDE -> CURSOR]._
- **Delete origin/cursor after confirming ahead=0 (merged via v1.3.0, no PR) (CURSOR, S)** — new row,
  2026-07-05 (CLAUDE audit-c3). `git rev-list origin/main..origin/cursor` = ahead=0 (fully subsumed
  by v1.3.0 PR #53); `gh` shows PR=null. It is merged work left dangling on origin with no PR
  record. Safe to delete; fold into the same prune sweep as the merged `claude/*` branches above.
  action=delete-branch. [CURSOR -> CURSOR].
- **Correct docs/RELEASE.md consumer list (api-usage-monitor is not a consumer) (CURSOR, S)** —
  `docs/RELEASE.md` (on the cursor branch) tells releasers to notify Congress.Trade, Agentic
  Trading, and api-usage-monitor, but API-usage-monitor's `package.json` has no dependency on this
  package; also document the exact-tag vs semver-range pin split between the two real consumers.
  _(why now: first tagged release using this new process is imminent (v1.3.0); a wrong consumer
  list and a missing pin-style note will misdirect the very train it was written for. Can be fixed
  before/while the cursor branch lands.)_
- **Unify ticker normalization regex and preferred/depositary symbol helpers (unassigned, S)** —
  Align the shared `WELL_FORMED_TICKER` pattern in `src/utils.ts` to support carets `^` for preferred share suffixes,
  and move the depositary serialization/punctuation helpers from Congress.Trade's `tickerNormalize.ts` into the shared package.
- **Move STOCK Act amount bracket array and snapping/validation helpers to shared (unassigned, S)** —
  Migrate the `STOCK_ACT_BRACKETS` definitions and its snapping/matching functions (`matchBracket`, `isValidBracket`, `nearestBracket`)
  from Congress.Trade (`shared/brackets.ts` and `extraction/amounts.ts`) into the shared package to consolidate STOCK Act numeric value parser normalization.
- **Consolidate usage telemetry clients in both consumer apps (unassigned, M)** —
  Refactor Socratic.Trade (`usage-monitor-push.ts`) and Congress.Trade (`telemetry/usage.ts`) to retire local telemetry definitions and instead
  import the shared `createUsageTelemetryClient` and `UsageTelemetryEventSchema`.
- **Retire duplicate API client fetchers and stream parser in Socratic.Trade (unassigned, M)** —
  Replace local HTTP wrappers in Socratic.Trade's `congress-trade-client.ts` and SSE parsing in `congress-stream.ts` with the native, strongly-typed
  `CongressTradeClient` and `SseParser` from `@jaywedgeworth22/congress-trading-shared/src/client`.
- **Align ClientAsset and ClientTrade schemas with actual production API outputs (unassigned, S)** —
  Update `ClientAssetSchema` in the shared package to include missing API fields (`companyName`, `logoUrl`, `typeName`, `typeCategory`, `typeCategoryLabel`)
  and extend the `source` validation enum in `ClientTradeSchema` to include `'manual'`.
- **Import snapshot/export types in Congress.Trade (unassigned, S)** —
  Replace locally defined `SnapshotTableInfo` and `SnapshotManifest` interfaces in Congress.Trade's `export/snapshot.ts` with direct imports from the shared package.

### 2026-07-05 audit cycle-3
_Added by CLAUDE audit-c3 pass. Tags: CURSOR / CODEX / AG / MONET / CLAUDE / OWNER. Assignments are
reservations, not locks — re-negotiate in #agent-sync. NEVER assign to CODEX (quota-capped to
Jul 8 18:10 CT)._

- **Rebase the 4 open AG PRs onto current main to clear the docs/EFFORT-LOG.md-only conflict and land them (AG, S)** — All of #54/#55/#56/#57 are CI-green but blocked SOLELY by a docs/EFFORT-LOG.md conflict (each rewrote the mirror from base 4c35df2 before main advanced it in f95e151). Code merges clean. Rebase each onto origin/main taking main's EFFORT-LOG.md, then land in stack order #55->#56->#57 (independent #54 anytime). This unblocks net-new src/client.ts, balance/limit metric types, and createCongressEvent in one pass.
- **Fix misleading commit message on ag/client-and-ticker 81b2fd3 (ticker work came from v1.3.0 base, not this branch) (AG, S)** — Commit 81b2fd3 is titled 'add CongressTradeClient and move ticker alias resolution to shared package' but the branch forked from the v1.3.0 merge, so the rename/acquisition ticker split was already in its base — the branch does NOT move/add ticker resolution. Reword during the rebase to reflect the actual net change (CongressTradeClient + SUBSCRIPTIONS path only) so the history is not misread as duplicate ticker work.
- **Delete origin/cursor after confirming ahead=0 (merged via v1.3.0, no PR) (CURSOR, S)** — origin/cursor is fully subsumed by main (git rev-list origin/main..origin/cursor is empty) and has no PR. Fold it into the merged-branch prune sweep alongside the merged claude/* branches so the branch list is readable.

## Changelog of this log
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

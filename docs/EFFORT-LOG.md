# congress-trading-shared Effort Log — cross-agent board
Protocol: /Users/jay/apps/EFFORT-LOG-PROTOCOL.md (canonical). Live board:
`/Users/jay/apps/CONGRESS-SHARED-EFFORT-LOG.md` (mirror: this file). As of 2026-07-05.

## Deployed
- (n/a — library package; "deployed" = version published/consumed by apps)

## Completed
- **Repair the stale Mac clone `main` (CLAUDE) — 2026-07-05.** Salvage-check verified all 7
  local-only commits SUBSUMED by `origin/main` before the move (2 independent lenses + adversarial
  verify, 4-agent workflow): all 5 non-merge commits patch-equivalent upstream (`git cherry`/
  `range-diff` all `=`), both PR merges byte-identical trees, and main's tip TREE OBJECT identical
  to origin-ancestor `5b2a6fa` — local main's entire tree already existed inside origin/main's
  history; v1.2.0 strictly supersedes the 1.1.1 line. Applied `git branch -f main origin/main`
  (main was not checked out in any worktree); now 0/0 divergence, tracking origin/main. Nothing
  salvaged because nothing was unique; pre-move tip `f06fd71` recoverable via reflog.
- **CI standard adoption blocker check (CLAUDE) — 2026-07-05.** Verdict: blocker NOT cleared, and
  it MOVED: `claude/ci-actions-efficiency` DID land in the Socratic.Trade hub but produced only an
  in-repo docs-only fast path — no reusable `workflow_call` verify gate exists for consumers to
  call. Real dependency now: Socratic.Trade PR #372 (`claude/ci-hybrid-runner-verify`, open) +
  a not-yet-scoped follow-on to build the reusable entry point once #372 proves itself. Reserved
  caller-workflow row below updated accordingly; stays blocked.
- **Shared agent-sync WebSocket relay verification (CODEX, shared `/Users/jay/apps` infra) —
  2026-07-05.** Verified PM2 `agent-sync-push` is online, connected to Slack Socket Mode using
  `SLACK_SYNC_WEBSOCKET`, and fanning out to local consumers on `ws://127.0.0.1:8787`; verified
  PM2 `agent-sync-codex` is attached as this seat's private-cursor consumer. Stopped the temporary
  direct Socket Mode watcher and corrected the canonical protocol entrypoint from stale `run.sh`
  to installed `start.sh`. No package code changed.
- **Test coverage for `schemas.ts` / `utils.ts` / `constants.ts` + SecurityRef subset-consistency guardrail (CURSOR) — 2026-07-05.** 237 tests across 5 files (4 new + 1 existing `usageTelemetry`), zero failures. Covers all 37 exported Zod schemas, 7 utility functions (`normalizeTicker`, `resolveTickerAlias`, `marketCapBucket`, `bracketMidpoint`, `isIsoDate`, `daysBetween`, `mergeRefs`), all constants (`TICKER_ALIASES`, `MKT_CAP_THRESHOLDS`, `API_PATHS`, `WINDOW_PRESETS`, `LAG_BUCKETS`), and `parseArray`/`parseSafe` helpers. SecurityRef guardrail verifies `SecurityRefInputSchema` keys are a true subset of `SecurityRefSchema`. Branch: `cursor` (not yet merged to origin/main at mirror time). Mid-tier subagent.
- **Global agent policy alignment and workspace sync (AG) — 2026-07-05.** Verified global config files (Gemini/Antigravity, Claude, Codex, and Cursor rules) are fully aligned with the latest efforts log, Slack WebSocket collab, and v4-pro model tiering protocols. Reset the local workspace `cursor` branch to `origin/main` to sync the latest `docs/EFFORT-LOG.md` and inter-agent coordination stanza.
- **Mechanical repo maintenance batch (CURSOR, S) — 2026-07-05.** Completed on `cursor` branch:
  deleted stale origin branches (`codex/package-git-prepare-20260629`, `codex/package-prepare-and-ci`),
  decommissioned `.github/workflows/publish.yml` and `publish:dry` script, added `engines.node >=20.0.0`
  to `package.json`, created `CHANGELOG.md` and `docs/RELEASE.md`.
- **Effort-issues sync secondary-rate-limit hardening (CLAUDE) — PR #27, 2026-07-05.** Verbatim propagation of the fleet-standard `scripts/sync-effort-issues.py` hardening from Socratic.Trade: 2.5s creation throttle, Retry-After/exponential-backoff retries under a bounded 300s per-run budget, and exit-0 "PARTIAL SYNC — resume on next run" summary on budget exhaustion (bulk issue creation previously 403'd on GitHub's secondary rate limit and hard-failed the sync workflow; the sync is idempotent, so a partial pass resumes cleanly on the next run).
  Review refinements re-propagated via PR #29 (merged 2026-07-05): issue listing inside
  partial handling, server-sent Retry-After honored uncapped, 1s update throttle.
- (seeded empty — see repo git history for pre-protocol work)
- PR #3 (claude/agent-sync-stanza, CLAUDE) — AGENTS.md inter-agent coordination stanza; MERGED 2026-07-04.
- PR #4 (claude/effort-issues-mirror, CLAUDE) — GitHub Issues mirror of this board; MERGED 2026-07-04.
  Additive `scripts/sync-effort-issues.py` + `.github/workflows/effort-issues-sync.yml`, ported
  verbatim from Socratic.Trade (canonical pattern in `/Users/jay/apps/EFFORT-LOG-PROTOCOL.md`).
  Read-only mirror: this board stays the source of truth, only the workflow writes issues.
- PR #7 (claude/tokenless-git-dep-prep, CLAUDE) — tokenless git dependency policy: README/AGENTS.md
  publish-policy flip (owner made this repo public), tag `v1.2.0` pushed as the first stable consumer
  ref, and the `codex/package-git-prepare-20260629` / `codex/package-prepare-and-ci` stale-branch
  evaluation (both superseded/dead, both predate `usageTelemetry.ts`/vitest/CI on `main` — recommended
  for deletion but not deleted here; resolves backlog t167). MERGED 2026-07-04. Consumer-side follow-up:
  Socratic.Trade PR #439 and Congress.Trade PR #139 (both switch their `package.json` to
  `github:jaywedgeworth22/congress-trading-shared#semver:^1.2.x`). No code change needed beyond
  docs: `package.json` already had a working `prepare` script, proven with a clean tokenless
  `npm install github:...#main`. See `docs/rollouts/2026-07-04-tokenless-git-dependency.md`.

## In Progress
- **Split `TICKER_ALIASES` into rename-vs-acquisition classes — SHARED-LIBRARY PORTION (MONET,
  `monet/sad-hermann-671f4d`) — DONE-local 2026-07-05 (committed `03d33bd`; owner push/PR/tag
  pending).** Additive, backward-compatible API in THIS package only: `TICKER_RENAMES` (FB→META,
  SQ→XYZ, GEHCV→GEHC continuous entities) + `TICKER_ACQUISITIONS` (BRCM→AVGO, TWX→WBD, ATVI→MSFT,
  RHT→IBM delisted/successor); `TICKER_ALIASES` kept as their union (still 7 entries);
  `classifyTickerAlias()`/`TickerAliasClass`/`TickerAliasResolution` + PIT-safe
  `resolveContinuousTicker()`; +26 tests; design doc; v1.3.0 bump. Verified: tsc clean, 263 tests
  pass, build green (6 new symbols in dist .d.ts), npm audit 0 vulns, tokenless CJS+ESM install
  smoke, 3-lens adversarial review (no blockers). Consumer migration (Congress.Trade
  `normalizer.ts:492` + `tickerNormalize.ts:201` fold sites → renames-only, `pitScores.ts`
  delisting metadata; Socratic.Trade `ACQUISITION_SOURCES` guard) stays OWNER-GATED per AGENTS.md —
  remains AG's follow-up. Doc: `docs/rollouts/2026-07-05-ticker-alias-rename-vs-acquisition.md`.
  _Seat-attribution note (2026-07-05): row was flipped MONET→CLAUDE→MONET during the seat-identity
  confusion; owner settled the seat model (AGENT_SEAT env pin per app; no inference from local
  state). Row stands as MONET's; branch is `monet/sad-hermann-671f4d`._
- ~~Tokenless git-install prep (claude/tokenless-git-dep-prep -> finish + tag; CLAUDE resumed worker; sync-26).~~
  _2026-07-04 (CLAUDE): stale row — this work merged as PR #7 (see Completed); corrected in place._
- Codex global coordination + fleet monitoring setup (Codex, shared `/Users/jay/apps`
  infra) — include this package in the standardized Codex bootstrap/audit path;
  no package code changes in this repo.

## Planned / Reserved
- CI standard adoption (cross-app, Claude) — RESERVED: 5-line caller workflow consuming the Socratic.Trade reusable verify gate + Mac runner registration. Blocked by: hub repo's reusable `workflow_call` verify gate not built yet — `claude/ci-actions-efficiency` landed WITHOUT producing it (docs-only fast path); current dependency is Socratic.Trade PR #372 (`claude/ci-hybrid-runner-verify`, open) + follow-on reusable entry point. _2026-07-05 (CLAUDE): blocker re-verified and updated._

_2026-07-04 backlog exhaustiveness pass (CLAUDE, owner-directed). Tags: CURSOR = Cursor background
agents (DeepSeek v4 Pro), AG = Antigravity/Gemini, CLAUDE = Claude Code. Assignments are
reservations, not locks — re-negotiate in #agent-sync._

- **Split `TICKER_ALIASES` into rename-vs-acquisition classes (AG, M, cross-app)** — ATVI→MSFT is
  undifferentiated from FB→META; Socratic.Trade guards locally (`ACQUISITION_SOURCES`),
  Congress.Trade has no guard. Design the shared API change, surface to owner, then update both
  consumers. Paired rows on both consumer boards.
  _2026-07-05: shared-library portion picked up — see In Progress (`monet/sad-hermann-671f4d`).
  Remaining AG scope after that lands = consumer migration only (Congress.Trade + Socratic.Trade)._
- **Scheduled dependency-vulnerability automation (AG, S)** — `npm audit` only runs on push; add
  Dependabot or a cron audit so transitive vulns surface between pushes.
- **LICENSE decision for the now-public repo (unassigned, S)** — `UNLICENSED` + public repo is
  implicit; owner to decide explicit proprietary notice vs a permissive license.
- ~~**Repair the stale Mac clone `main` (CLAUDE, S)**~~ _2026-07-05 (CLAUDE): done — see Completed._

_Moved to In Progress 2026-07-05 (CURSOR): test coverage (L), SecurityRef subset test (S),
stale branch deletion (S), publish.yml decommission (S), CHANGELOG.md (S), engines.node (S) —
all since Completed, see above._

## Resolved backlog items
- t167 (stale prepare-script branches) — `codex/package-git-prepare-20260629` and
  `codex/package-prepare-and-ci` both diverged from `main` on 2026-06-29, before
  `usageTelemetry.ts`/vitest/CI workflows landed; the `prepare` script they intended to add
  is already present and working on `main`. **Deleted from origin 2026-07-05 (CURSOR).**
  Full verdict in `docs/rollouts/2026-07-04-tokenless-git-dependency.md`.

## Changelog of this log
- 2026-07-05 — CLAUDE: completed both reserved CLAUDE lanes: stale-main repair (salvage-verified
  SUBSUMED via 2-lens + adversarial-verify workflow, then `git branch -f main origin/main`, now
  0/0) and CI-adoption blocker check (blocker not cleared — moved to Socratic.Trade PR #372 +
  unbuilt reusable gate; Planned row updated). Reconciled this mirror to the live board (CURSOR/AG/
  CODEX/MONET 2026-07-05 rows were live-board-only until now).
- 2026-07-05 — seat-identity note: the sad-hermann row attribution was flipped MONET→CLAUDE→MONET
  during the seat confusion; owner settled the seat model (AGENT_SEAT env pin per app, no
  inference from local state). Row stands as MONET's.
- 2026-07-05 — CURSOR: completed mechanical repo maintenance batch (stale branch deletion,
  publish.yml decommission, engines.node, CHANGELOG.md + docs/RELEASE.md); moved t167 from
  "recommended for deletion" to "deleted".
- 2026-07-05 — CURSOR: moved 6 CURSOR-assigned tasks from Planned to In Progress, then Completed
  (tests lane + mechanical cleanup lane).
- 2026-07-05 — MONET: DONE-local the shared-library portion of the TICKER_ALIASES
  rename-vs-acquisition split (`monet/sad-hermann-671f4d`, commit `03d33bd`, additive v1.3.0).
  Owner push/PR/tag pending.
- 2026-07-04 — bootstrapped by CLAUDE (effort-log standardization).
- 2026-07-04 — CLAUDE: tokenless git dependency switch + stale-branch verdict (t167).
- 2026-07-04 — CLAUDE: backlog exhaustiveness + assignment pass (owner-directed); seeded Planned
  from a full package audit.
- 2026-07-04 — CLAUDE: reconciled repo mirror to live board — moved PR #4 and PR #7 to Completed,
  corrected the stale "Tokenless git-install prep" row in place, and mirrored the Planned/Reserved
  backlog section verbatim from the live board.

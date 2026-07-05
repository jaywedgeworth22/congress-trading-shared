# congress-trading-shared Effort Log — cross-agent board
Protocol: /Users/jay/apps/EFFORT-LOG-PROTOCOL.md (canonical). Live board:
`/Users/jay/apps/CONGRESS-SHARED-EFFORT-LOG.md` (mirror: this file). As of 2026-07-04.

## Deployed
- (n/a — library package; "deployed" = version published/consumed by apps)

## Completed
- **Effort-issues sync secondary-rate-limit hardening (CLAUDE) — PR #27, 2026-07-05.** Verbatim propagation of the fleet-standard `scripts/sync-effort-issues.py` hardening from Socratic.Trade: 2.5s creation throttle, Retry-After/exponential-backoff retries under a bounded 300s per-run budget, and exit-0 "PARTIAL SYNC — resume on next run" summary on budget exhaustion (bulk issue creation previously 403'd on GitHub's secondary rate limit and hard-failed the sync workflow; the sync is idempotent, so a partial pass resumes cleanly on the next run). Lands with this PR.
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
- ~~Tokenless git-install prep (claude/tokenless-git-dep-prep -> finish + tag; CLAUDE resumed worker; sync-26).~~
  _2026-07-04 (CLAUDE): stale row — this work merged as PR #7 (see Completed); corrected in place._
- Codex global coordination + fleet monitoring setup (Codex, shared `/Users/jay/apps`
  infra) — include this package in the standardized Codex bootstrap/audit path;
  no package code changes in this repo.

## Planned / Reserved
- CI standard adoption (cross-app, Claude) — RESERVED: 5-line caller workflow consuming the Socratic.Trade reusable verify gate + Mac runner registration. Blocked by: claude/ci-actions-efficiency landing in the hub repo.

_2026-07-04 backlog exhaustiveness pass (CLAUDE, owner-directed). Tags: CURSOR = Cursor background
agents (DeepSeek v4 Pro), AG = Antigravity/Gemini, CLAUDE = Claude Code. Assignments are
reservations, not locks — re-negotiate in #agent-sync._

- **Test coverage for `schemas.ts` / `utils.ts` / `constants.ts` (CURSOR, L)** — only
  usageTelemetry is tested; 37 exported Zod schemas + 7 utility functions (`normalizeTicker`,
  `marketCapBucket`, `bracketMidpoint`, `isIsoDate`, `daysBetween`, `mergeRefs`,
  `resolveTickerAlias`) have zero coverage in a cross-app contract package.
- **SecurityRef/SecurityRefInput subset-consistency test (CURSOR, S)** — the AGENTS.md
  keep-in-sync rule is currently enforced only by discipline; assert the partial schema's keys are
  a subset of the full schema's.
- **Split `TICKER_ALIASES` into rename-vs-acquisition classes (AG, M, cross-app)** — ATVI→MSFT is
  undifferentiated from FB→META; Socratic.Trade guards locally (`ACQUISITION_SOURCES`),
  Congress.Trade has no guard. Design the shared API change, surface to owner, then update both
  consumers. Paired rows on both consumer boards.
- **Delete stale superseded branches (CURSOR, S)** — `codex/package-git-prepare-20260629` +
  `codex/package-prepare-and-ci` on origin (deletion recommended in the tokenless rollout note),
  plus dead local-only branches in the Mac clone.
- **Decommission or gate `publish.yml` (CURSOR, S)** — still publishes to the retired private
  GitHub Packages registry on any GitHub Release; delete or gate behind explicit opt-in per the
  tokenless policy.
- **CHANGELOG.md + release/tagging process doc (CURSOR, S)** — consumers pin `#semver:^1.2.x` /
  `#v1.2.0` with no changelog between tags.
- **Add `engines.node` to package.json (CURSOR, S)** — CI pins Node 20 but git-dep consumers get
  no early incompatibility signal.
- **Scheduled dependency-vulnerability automation (AG, S)** — `npm audit` only runs on push; add
  Dependabot or a cron audit so transitive vulns surface between pushes.
- **LICENSE decision for the now-public repo (unassigned, S)** — `UNLICENSED` + public repo is
  implicit; owner to decide explicit proprietary notice vs a permissive license.
- **Repair the stale Mac clone `main` (CLAUDE, S)** — local `main` diverged (7 dead WIP commits,
  missing 12 origin commits incl. v1.2.0); salvage-check the WIP commits, then fast-forward. Not a
  blind reset.

## Resolved backlog items
- t167 (stale prepare-script branches) — `codex/package-git-prepare-20260629` and
  `codex/package-prepare-and-ci` both diverged from `main` on 2026-06-29, before
  `usageTelemetry.ts`/vitest/CI workflows landed; the `prepare` script they intended to add
  is already present and working on `main`. Verdict: both dead/superseded, recommended for
  deletion (not deleted here — no explicit deletion request). Full verdict in
  `docs/rollouts/2026-07-04-tokenless-git-dependency.md`.

## Changelog of this log
- 2026-07-04 — bootstrapped by CLAUDE (effort-log standardization).
- 2026-07-04 — CLAUDE: tokenless git dependency switch + stale-branch verdict (t167).
- 2026-07-04 — CLAUDE: backlog exhaustiveness + assignment pass (owner-directed); seeded Planned
  from a full package audit. Also: the "Tokenless git-install prep" In Progress row is stale —
  that work is the Completed PR #7 row; corrected below.
- 2026-07-04 — CLAUDE: reconciled repo mirror to live board — moved PR #4 and PR #7 to Completed
  (previously mislabeled In Progress / missing), corrected the stale "Tokenless git-install prep"
  row in place, and mirrored the new Planned/Reserved backlog section verbatim from the live board.

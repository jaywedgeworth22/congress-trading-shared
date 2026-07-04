# congress-trading-shared Effort Log — cross-agent board
Protocol: /Users/jay/apps/EFFORT-LOG-PROTOCOL.md (canonical). Live board: this file
(mirror: docs/EFFORT-LOG.md in the repo). As of 2026-07-04.

## Deployed
- (n/a — library package; "deployed" = version published/consumed by apps)

## Completed
- (seeded empty — see repo git history for pre-protocol work)
- PR #3 (claude/agent-sync-stanza, CLAUDE) — AGENTS.md inter-agent coordination stanza; MERGED 2026-07-04.
- Tokenless git dependency switch (claude/tokenless-git-dep-prep, CLAUDE) — owner-directed
  (repo made public). No code change needed: `package.json` already had a working `prepare`
  script, proven with a clean tokenless `npm install github:...#main`. Updated README.md +
  AGENTS.md to document the tokenless-git-dep policy (retiring the private GitHub Packages
  publish policy as the default, package.json publishConfig left dormant/untouched). Tagged
  `v1.2.0` as the first stable pin ref for consumers. Evaluated and resolved the fate of the
  two stale prepare-script branches (see below) — this closes backlog item t167. See
  `docs/rollouts/2026-07-04-tokenless-git-dependency.md`.

## In Progress
- GitHub Issues mirror of this board (claude/effort-issues-mirror, CLAUDE) — additive
  `scripts/sync-effort-issues.py` + `.github/workflows/effort-issues-sync.yml`, ported verbatim from
  Socratic.Trade (canonical pattern in `/Users/jay/apps/EFFORT-LOG-PROTOCOL.md`). Read-only mirror:
  this board stays the source of truth, only the workflow writes issues.

## Planned / Reserved
- (none)

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

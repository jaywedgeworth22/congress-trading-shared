# Operation-guard v1.5.0 release

## Summary

- Release the portable operation-guard rejection contract merged by PR #144.
- Correct the changelog comparison links before placing the lightweight `v1.5.0` tag.
- Keep the owner-directed tokenless Git release path; there is no npm registry publish.

## Why

PR #144 correctly bumped the package to 1.5.0 and added its changelog section, but the link footer
still compared `Unreleased` against v1.4.0 and omitted a 1.5.0 comparison link. The release tag
should include accurate release metadata so consumers and future changelog entries resolve cleanly.

## Files

- `CHANGELOG.md`
- `docs/EFFORT-LOG.md`
- `docs/rollouts/2026-07-11-operation-guard-v1.5.0-release.md`

## Verification

- Clean tokenless HTTPS install from merged PR #144 commit `2222baeb` with
  `NODE_AUTH_TOKEN`, `NPM_TOKEN`, and `GH_PACKAGES_TOKEN` unset: package reports version 1.5.0.
- CJS and ESM imports of `buildRateLimitedRejection`, `buildOperationInFlightRejection`, and
  `getOperationGuardHttpStatus` returned the expected 429/409 contract behavior.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- `npm test`: passed, 10 files / 351 tests.
- `npm audit`: passed, 0 vulnerabilities.
- `npm run pack:dry`: passed; package 1.5.0, 6 files, 42.1 kB tarball.
- Clean tokenless install from `v1.5.0`: pending the tag.

## Follow-ups

- Merge the release-hygiene PR after hosted CI is green.
- Tag the resulting `main` commit as `v1.5.0`, push the tag, and repeat the clean tokenless install.
- Update Socratic.Trade PR #1409 to consume the tagged shared builders/status mapping.

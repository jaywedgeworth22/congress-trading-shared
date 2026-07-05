# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.3.0] — 2026-07-05

### Added
- **Rename-vs-acquisition classification for ticker aliases.** Split the flat
  `TICKER_ALIASES` map into two semantically distinct classes so consumers can
  distinguish a continuous rename (same listed entity, price series continues)
  from a delisting acquisition (source ticker ceased trading in a takeover):
  - `TICKER_RENAMES` — `FB→META`, `SQ→XYZ`, `GEHCV→GEHC`.
  - `TICKER_ACQUISITIONS` — `BRCM→AVGO`, `TWX→WBD`, `ATVI→MSFT`, `RHT→IBM`.
  - `classifyTickerAlias(ticker, opts?)` → `{ from, to, class } | null`
    (`TickerAliasClass = "rename" | "acquisition"`).
  - `resolveContinuousTicker(ticker, renames?)` — PIT-safe resolution that folds
    only renames and leaves acquisition sources intact, so point-in-time return
    attribution does not roll a delisted position into the acquirer's later
    price series.
- Tests for the two new maps (disjointness + union invariants) and both new
  helpers, including the identity-vs-PIT behavioral contrast.

### Changed
- `TICKER_ALIASES` is now derived as the union of `TICKER_RENAMES` and
  `TICKER_ACQUISITIONS`. **Fully backward compatible** — same 7 entries, same
  mappings, same shape; `resolveTickerAlias` still folds every alias for
  identity/display resolution. No consumer change is required to upgrade.

## [1.2.0] — 2026-07-04

### Added
- Vitest test suite with 34 tests covering idempotency-key contract vectors,
  determinism, uniqueness, edge cases, and Zod schema validation.
- Zod schemas for 16 previously schema-free types (`TransactionsQuery`,
  `BundleResponse`, `TickerLeader`, `ClusterBuy`, `MemberLeader`,
  `MemberPerformance`, `BacktestHorizon`, `TickerBacktest`, `CommitteeConflict`,
  `SnapshotTableInfo`, `SnapshotManifest`, `ClientMember`, `ClientAsset`,
  `ClientTransaction`, `ClientFiling`, `ClientTrade`).

### Changed
- All types in `types.ts` now derive from Zod schemas via `z.infer`, replacing
  standalone hand-written interfaces that could silently diverge.
- `CongressTransactionSchema.filedDate` is now `.nullable().optional()` to
  match the hand-written type signature (ground truth for consumers).
- Removed duplicated `isIsoDate` implementation in `schemas.ts` — now imports
  from `utils.ts`.
- Consolidated duplicated `APP_B_ORIGIN`/`APP_B_ORIGIN_TAG` constants.
- **Publish policy:** repo is now public and consumed as a tokenless git
  dependency (`github:jaywedgeworth22/congress-trading-shared#semver:^1.2.x`).
  The private GitHub Packages registry is retired.

## [1.1.1] — 2026-07-03

### Fixed
- Idempotency-key hash collision via length-prefixed field encoding in the
  deterministic key derivation.

## [1.1.0] — 2026-07-03

### Added
- Usage telemetry client (`usageTelemetry.ts`) with Zod-based event schemas.
- Deterministic idempotency key attached to outgoing usage telemetry events.
- Idempotency-key basis-string contract documented for server-side consumers.

## [1.0.0] — 2026-06-29

### Added
- Shared TypeScript types, Zod schemas, constants, and pure utilities for
  Congress.Trade ↔ Agentic Trading cross-app integration.
- Package prepared for install via `prepare` build script and CI.
- GitHub Actions CI pipeline (typecheck, build, audit).

[Unreleased]: https://github.com/jaywedgeworth22/congress-trading-shared/compare/v1.3.0...HEAD
[1.3.0]: https://github.com/jaywedgeworth22/congress-trading-shared/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/jaywedgeworth22/congress-trading-shared/releases/tag/v1.2.0
[1.1.1]: https://github.com/jaywedgeworth22/congress-trading-shared/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/jaywedgeworth22/congress-trading-shared/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/jaywedgeworth22/congress-trading-shared/releases/tag/v1.0.0

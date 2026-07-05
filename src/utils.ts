import type { MktCapBucket, TickerAliasResolution } from "./types";
import {
  MKT_CAP_THRESHOLDS,
  TICKER_ALIASES,
  TICKER_RENAMES,
  TICKER_ACQUISITIONS,
} from "./constants";

// ---- Ticker normalization ----

const WELL_FORMED_TICKER = /^[A-Z]{1,5}([.-][A-Z]{1,2})?$/;

/** Normalize a raw ticker string: uppercase, strip whitespace, validate format. */
export function normalizeTicker(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const cleaned = raw.trim().toUpperCase();
  if (!WELL_FORMED_TICKER.test(cleaned)) return null;
  return cleaned;
}

/**
 * Resolve any curated ticker alias to its current ticker — renames AND acquisitions alike.
 *
 * This is IDENTITY/display resolution: it answers "what does this old ticker map to now?" and
 * is the right call for de-duplicating a securities master or rendering a current symbol. When
 * the corporate-action class matters — e.g. point-in-time return attribution, where an
 * acquired-and-delisted position must NOT inherit the acquirer's later price history — use
 * `classifyTickerAlias()` or the renames-only `resolveContinuousTicker()` instead.
 */
export function resolveTickerAlias(
  ticker: string,
  aliases: Readonly<Record<string, string>> = TICKER_ALIASES,
): string {
  const normalized = normalizeTicker(ticker) ?? ticker.trim().toUpperCase();
  return aliases[normalized] ?? normalized;
}

/**
 * Classify a ticker alias as a continuous `rename` or a discontinuous `acquisition`, returning
 * the normalized source, its target, and the class — or `null` when the ticker is not a known
 * alias source (i.e. it is already current, or unknown).
 *
 * The class is what point-in-time (PIT) logic needs: `rename` targets share a continuous price
 * series (folding old→new is correct), whereas `acquisition` sources were delisted at the deal
 * and their series ends there (the position should be treated as closed, not rolled into the
 * acquirer's ongoing series). `renames` is checked before `acquisitions`; the two curated maps
 * are disjoint on their SOURCE keys by construction, so ordering only matters if a caller passes
 * overlapping maps.
 *
 * Resolution is SINGLE-HOP and non-transitive: a source maps directly to its curated current
 * target with no chaining. The curated maps are intentionally non-chained (no target is also a
 * source), so a compound history (rename X→Y, then Y acquired→Z) is not representable here and
 * would need a richer model — see docs/rollouts/2026-07-05-ticker-alias-rename-vs-acquisition.md.
 */
export function classifyTickerAlias(
  ticker: string,
  opts?: {
    renames?: Readonly<Record<string, string>>;
    acquisitions?: Readonly<Record<string, string>>;
  },
): TickerAliasResolution | null {
  const renames = opts?.renames ?? TICKER_RENAMES;
  const acquisitions = opts?.acquisitions ?? TICKER_ACQUISITIONS;
  const from = normalizeTicker(ticker) ?? ticker.trim().toUpperCase();
  const renamed = renames[from];
  if (renamed !== undefined) return { from, to: renamed, class: "rename" };
  const acquired = acquisitions[from];
  if (acquired !== undefined) return { from, to: acquired, class: "acquisition" };
  return null;
}

/**
 * PIT-safe ticker resolution: fold ONLY continuous renames (e.g. FB→META) to the current
 * ticker and leave acquisition sources (ATVI, RHT, …) untouched, so downstream point-in-time
 * logic keeps a delisted series distinct from its acquirer's. Contrast with `resolveTickerAlias`,
 * which folds every alias for pure identity/display resolution.
 */
export function resolveContinuousTicker(
  ticker: string,
  renames: Readonly<Record<string, string>> = TICKER_RENAMES,
): string {
  const normalized = normalizeTicker(ticker) ?? ticker.trim().toUpperCase();
  return renames[normalized] ?? normalized;
}

// ---- Market cap bucket ----

/** Compute the market-cap bucket from a dollar value. */
export function marketCapBucket(
  n: number | null | undefined,
): MktCapBucket | null {
  if (n == null || !Number.isFinite(n) || n <= 0) return null;
  if (n >= MKT_CAP_THRESHOLDS.MEGA) return "mega";
  if (n >= MKT_CAP_THRESHOLDS.LARGE) return "large";
  if (n >= MKT_CAP_THRESHOLDS.MID) return "mid";
  if (n >= MKT_CAP_THRESHOLDS.SMALL) return "small";
  if (n >= MKT_CAP_THRESHOLDS.MICRO) return "micro";
  return "nano";
}

// ---- Amount bracket midpoint ----

/** Compute the midpoint of a STOCK Act dollar-amount bracket. */
export function bracketMidpoint(
  min: number | null,
  max: number | null,
): number {
  if (max != null && min != null) return (min + max) / 2;
  if (min != null) return min;
  return 0;
}

// ---- Date helpers ----

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Check if a string is a valid YYYY-MM-DD date. */
export function isIsoDate(s: string): boolean {
  if (!ISO_DATE.test(s)) return false;
  const d = new Date(s + "T00:00:00Z");
  return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

/** Days between two YYYY-MM-DD strings. */
export function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00Z");
  const db = new Date(b + "T00:00:00Z");
  return Math.round((db.getTime() - da.getTime()) / 86_400_000);
}

// ---- Ref merging ----

/** Merge two partial refs, preferring the second (later/more authoritative) for non-null fields. */
export function mergeRefs<T extends Record<string, unknown>>(
  a: Partial<T> | null | undefined,
  b: Partial<T> | Record<string, unknown> | null | undefined,
): Partial<T> {
  const result: Record<string, unknown> = { ...(a ?? {}) };
  if (b) {
    for (const [k, v] of Object.entries(b)) {
      if (v !== null && v !== undefined) result[k] = v;
    }
  }
  return result as Partial<T>;
}

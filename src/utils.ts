import type { MktCapBucket } from "./types";
import { MKT_CAP_THRESHOLDS, TICKER_ALIASES } from "./constants";

// ---- Ticker normalization ----

const WELL_FORMED_TICKER = /^[A-Z]{1,5}([.-][A-Z]{1,2})?$/;

/** Normalize a raw ticker string: uppercase, strip whitespace, validate format. */
export function normalizeTicker(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const cleaned = raw.trim().toUpperCase();
  if (!WELL_FORMED_TICKER.test(cleaned)) return null;
  return cleaned;
}

/** Resolve ticker aliases (corporate actions, renames). */
export function resolveTickerAlias(
  ticker: string,
  aliases: Readonly<Record<string, string>> = TICKER_ALIASES,
): string {
  const normalized = normalizeTicker(ticker) ?? ticker.trim().toUpperCase();
  return aliases[normalized] ?? normalized;
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
  b: Partial<T> | null | undefined,
): Partial<T> {
  const result: Record<string, unknown> = { ...(a ?? {}) };
  if (b) {
    for (const [k, v] of Object.entries(b)) {
      if (v !== null && v !== undefined) result[k] = v;
    }
  }
  return result as Partial<T>;
}

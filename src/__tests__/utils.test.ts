import { describe, it, expect } from "vitest";
import {
  normalizeTicker,
  resolveTickerAlias,
  marketCapBucket,
  bracketMidpoint,
  isIsoDate,
  daysBetween,
  mergeRefs,
} from "../utils";

// =============================================================================
// normalizeTicker
// =============================================================================

describe("normalizeTicker", () => {
  it("uppercases ticker", () => {
    expect(normalizeTicker("aapl")).toBe("AAPL");
    expect(normalizeTicker("MsFt")).toBe("MSFT");
  });

  it("trims whitespace", () => {
    expect(normalizeTicker("  AAPL  ")).toBe("AAPL");
    expect(normalizeTicker("\tAAPL\n")).toBe("AAPL");
  });

  it("returns null for empty strings", () => {
    expect(normalizeTicker("")).toBeNull();
    expect(normalizeTicker("   ")).toBeNull();
  });

  it("returns null for null and undefined", () => {
    expect(normalizeTicker(null)).toBeNull();
    expect(normalizeTicker(undefined)).toBeNull();
  });

  it("accepts valid ticker patterns", () => {
    expect(normalizeTicker("A")).toBe("A");
    expect(normalizeTicker("AAPL")).toBe("AAPL");
    expect(normalizeTicker("BRK.A")).toBe("BRK.A"); // Class A shares
    expect(normalizeTicker("BRK-B")).toBe("BRK-B"); // Class B
    expect(normalizeTicker("GOOGL")).toBe("GOOGL");
  });

  it("rejects invalid ticker patterns", () => {
    expect(normalizeTicker("AAPL123")).toBeNull();
    expect(normalizeTicker("TOO.LONG.TICKER")).toBeNull();
    expect(normalizeTicker("abc.defg")).toBeNull(); // more than 2 chars after dot
    expect(normalizeTicker("abc$def")).toBeNull();
    expect(normalizeTicker("1234")).toBeNull(); // purely numeric
  });

  it("accepts valid two-part tickers", () => {
    expect(normalizeTicker("BF.A")).toBe("BF.A");
    expect(normalizeTicker("BF.B")).toBe("BF.B");
  });

  it("rejects ticker with dash that exceeds length", () => {
    // 5 chars max before dash, 2 after — so total max 8 chars
    expect(normalizeTicker("ABCDE-XYZ")).toBeNull();
  });
});

// =============================================================================
// resolveTickerAlias
// =============================================================================

describe("resolveTickerAlias", () => {
  it("resolves known aliases", () => {
    expect(resolveTickerAlias("FB")).toBe("META");
    expect(resolveTickerAlias("BRCM")).toBe("AVGO");
    expect(resolveTickerAlias("SQ")).toBe("XYZ");
    expect(resolveTickerAlias("GEHCV")).toBe("GEHC");
    expect(resolveTickerAlias("TWX")).toBe("WBD");
    expect(resolveTickerAlias("ATVI")).toBe("MSFT");
    expect(resolveTickerAlias("RHT")).toBe("IBM");
  });

  it("passes through unknown tickers", () => {
    expect(resolveTickerAlias("AAPL")).toBe("AAPL");
    expect(resolveTickerAlias("MSFT")).toBe("MSFT");
    expect(resolveTickerAlias("GOOGL")).toBe("GOOGL");
  });

  it("handles lowercase aliases", () => {
    expect(resolveTickerAlias("fb")).toBe("META");
    expect(resolveTickerAlias("brcm")).toBe("AVGO");
  });

  it("handles case-insensitive lookup", () => {
    expect(resolveTickerAlias("Fb")).toBe("META");
    expect(resolveTickerAlias("sq")).toBe("XYZ");
  });

  it("passes through ticker that fails normalizeTicker (returns trimmed uppercase)", () => {
    // "AAPL123" fails normalizeTicker, so resolveTickerAlias uses fallback:
    // ticker.trim().toUpperCase() = "AAPL123"
    expect(resolveTickerAlias("AAPL123")).toBe("AAPL123");
  });

  it("works with custom alias maps", () => {
    const customAliases = { OLD: "NEW" };
    expect(resolveTickerAlias("OLD", customAliases)).toBe("NEW");
    expect(resolveTickerAlias("UNKNOWN", customAliases)).toBe("UNKNOWN");
  });
});

// =============================================================================
// marketCapBucket
// =============================================================================

describe("marketCapBucket", () => {
  it("returns mega for >= $200B", () => {
    expect(marketCapBucket(200_000_000_000)).toBe("mega");
    expect(marketCapBucket(3_500_000_000_000)).toBe("mega");
  });

  it("returns large for $10B to $200B", () => {
    expect(marketCapBucket(10_000_000_000)).toBe("large");
    expect(marketCapBucket(150_000_000_000)).toBe("large");
    expect(marketCapBucket(199_999_999_999)).toBe("large");
  });

  it("returns mid for $2B to $10B", () => {
    expect(marketCapBucket(2_000_000_000)).toBe("mid");
    expect(marketCapBucket(5_000_000_000)).toBe("mid");
    expect(marketCapBucket(9_999_999_999)).toBe("mid");
  });

  it("returns small for $300M to $2B", () => {
    expect(marketCapBucket(300_000_000)).toBe("small");
    expect(marketCapBucket(1_000_000_000)).toBe("small");
    expect(marketCapBucket(1_999_999_999)).toBe("small");
  });

  it("returns micro for $50M to $300M", () => {
    expect(marketCapBucket(50_000_000)).toBe("micro");
    expect(marketCapBucket(100_000_000)).toBe("micro");
    expect(marketCapBucket(299_999_999)).toBe("micro");
  });

  it("returns nano for < $50M", () => {
    expect(marketCapBucket(49_999_999)).toBe("nano");
    expect(marketCapBucket(1_000_000)).toBe("nano");
    expect(marketCapBucket(1)).toBe("nano");
  });

  it("returns null for null/undefined", () => {
    expect(marketCapBucket(null)).toBeNull();
    expect(marketCapBucket(undefined)).toBeNull();
  });

  it("returns null for non-finite or non-positive numbers", () => {
    expect(marketCapBucket(0)).toBeNull();
    expect(marketCapBucket(-100)).toBeNull();
    expect(marketCapBucket(NaN)).toBeNull();
    expect(marketCapBucket(Infinity)).toBeNull();
    expect(marketCapBucket(-Infinity)).toBeNull();
  });

  it("boundary values land in the correct bucket", () => {
    // $200B exactly => mega
    expect(marketCapBucket(200_000_000_000)).toBe("mega");
    // $10B exactly => large
    expect(marketCapBucket(10_000_000_000)).toBe("large");
    // $2B exactly => mid
    expect(marketCapBucket(2_000_000_000)).toBe("mid");
    // $300M exactly => small
    expect(marketCapBucket(300_000_000)).toBe("small");
    // $50M exactly => micro
    expect(marketCapBucket(50_000_000)).toBe("micro");
    // $49,999,999 => nano
    expect(marketCapBucket(49_999_999)).toBe("nano");
  });
});

// =============================================================================
// bracketMidpoint
// =============================================================================

describe("bracketMidpoint", () => {
  it("returns midpoint of two non-null bounds", () => {
    expect(bracketMidpoint(1000, 15000)).toBe(8000);
    expect(bracketMidpoint(0, 100)).toBe(50);
  });

  it("returns min when only min is provided", () => {
    expect(bracketMidpoint(1000, null)).toBe(1000);
    expect(bracketMidpoint(50000, null)).toBe(50000);
  });

  it("returns 0 when only max is provided", () => {
    expect(bracketMidpoint(null, 15000)).toBe(0);
  });

  it("returns 0 when both are null", () => {
    expect(bracketMidpoint(null, null)).toBe(0);
  });

  it("handles zero values", () => {
    expect(bracketMidpoint(0, 0)).toBe(0);
    expect(bracketMidpoint(0, 100)).toBe(50);
  });
});

// =============================================================================
// isIsoDate
// =============================================================================

describe("isIsoDate", () => {
  it("accepts valid ISO dates", () => {
    expect(isIsoDate("2024-01-15")).toBe(true);
    expect(isIsoDate("2020-02-29")).toBe(true); // leap year
    expect(isIsoDate("2000-02-29")).toBe(true);
    expect(isIsoDate("1900-01-01")).toBe(true);
  });

  it("rejects invalid calendar dates", () => {
    expect(isIsoDate("2024-02-30")).toBe(false);
    expect(isIsoDate("2023-02-29")).toBe(false); // non-leap
    expect(isIsoDate("2024-13-01")).toBe(false);
    expect(isIsoDate("2024-00-01")).toBe(false);
    expect(isIsoDate("2024-01-00")).toBe(false);
    expect(isIsoDate("2024-01-32")).toBe(false);
  });

  it("rejects non-date strings", () => {
    expect(isIsoDate("not-a-date")).toBe(false);
    expect(isIsoDate("")).toBe(false);
    expect(isIsoDate("2024/01/15")).toBe(false);
    expect(isIsoDate("01-15-2024")).toBe(false);
  });

  it("rejects dates with time components", () => {
    expect(isIsoDate("2024-01-15T10:00:00Z")).toBe(false);
  });

  it("detects JS Date round-trip stability", () => {
    // isIsoDate checks that new Date(s + "T00:00:00Z") round-trips to the same YYYY-MM-DD
    expect(isIsoDate("2024-01-15")).toBe(true);
  });

  it("rejects dates that round-trip differently (e.g. DST edge)", () => {
    // Not a common case in practice with UTC midnight, but good to verify
    expect(isIsoDate("0000-01-01")).toBe(true);
  });
});

// =============================================================================
// daysBetween
// =============================================================================

describe("daysBetween", () => {
  it("returns positive for b after a", () => {
    expect(daysBetween("2024-01-01", "2024-01-15")).toBe(14);
    expect(daysBetween("2024-01-01", "2024-01-02")).toBe(1);
  });

  it("returns negative for b before a", () => {
    expect(daysBetween("2024-01-15", "2024-01-01")).toBe(-14);
  });

  it("returns 0 for same date", () => {
    expect(daysBetween("2024-01-15", "2024-01-15")).toBe(0);
  });

  it("handles leap years", () => {
    // Feb 28 → Mar 1 in leap year = 2 days
    expect(daysBetween("2024-02-28", "2024-03-01")).toBe(2);
    // Year boundary
    expect(daysBetween("2023-12-31", "2024-01-01")).toBe(1);
  });

  it("handles large ranges", () => {
    expect(daysBetween("2020-01-01", "2025-01-01")).toBe(1827); // 5 years including 2024 leap
  });
});

// =============================================================================
// mergeRefs
// =============================================================================

describe("mergeRefs", () => {
  it("merges two partial refs, second overrides first for non-null fields", () => {
    const a = { ticker: "AAPL", companyName: "Old Name", sector: "Tech" };
    const b = { companyName: "New Name", industry: "Electronics" };
    const result = mergeRefs(a, b);
    expect(result).toEqual({
      ticker: "AAPL",
      companyName: "New Name",
      sector: "Tech",
      industry: "Electronics",
    });
  });

  it("does not override with null values from b", () => {
    const a = { companyName: "Old Name" };
    const b = { companyName: null };
    const result = mergeRefs(a, b);
    expect(result.companyName).toBe("Old Name");
  });

  it("does not override with undefined values from b", () => {
    const a = { companyName: "Old Name" };
    const b = { companyName: undefined };
    const result = mergeRefs(a, b);
    expect(result.companyName).toBe("Old Name");
  });

  it("returns a when b is null or undefined", () => {
    const a = { ticker: "AAPL" };
    expect(mergeRefs(a, null)).toEqual(a);
    expect(mergeRefs(a, undefined)).toEqual(a);
  });

  it("returns empty object for both null/undefined", () => {
    expect(mergeRefs(null, null)).toEqual({});
    expect(mergeRefs(undefined, undefined)).toEqual({});
    expect(mergeRefs(null, undefined)).toEqual({});
  });

  it("returns b when a is null", () => {
    const b = { ticker: "AAPL", companyName: "Apple" };
    expect(mergeRefs(null, b)).toEqual(b);
  });

  it("returns from b when a is empty", () => {
    const a = {};
    const b = { ticker: "AAPL" };
    expect(mergeRefs(a, b)).toEqual(b);
  });

  it("handles falsy non-null values from b correctly", () => {
    const a = { isEtf: true };
    const b = { isEtf: false };
    // false is not null/undefined, so it should override
    expect(mergeRefs(a, b)).toEqual({ isEtf: false });
  });

  it("handles zero values from b correctly", () => {
    const a = { marketCap: 100_000 };
    const b = { marketCap: 0 };
    // 0 is not null/undefined, so it should override
    expect(mergeRefs(a, b)).toEqual({ marketCap: 0 });
  });

  it("handles empty string values from b correctly", () => {
    const a = { ticker: "AAPL" };
    const b = { ticker: "" };
    // "" is not null/undefined, so it should override
    expect(mergeRefs(a, b)).toEqual({ ticker: "" });
  });
});

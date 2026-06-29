// =============================================================================
// congress-trading-shared — constants
// =============================================================================

// ---- Ticker aliases (corporate actions / ticker changes) ----

export const TICKER_ALIASES: Readonly<Record<string, string>> = {
  BRCM: "AVGO",
  FB: "META",
  SQ: "XYZ",
  GEHCV: "GEHC",
  TWX: "WBD",
  ATVI: "MSFT",
  RHT: "IBM",
};

// ---- Market cap bucket thresholds ----

export const MKT_CAP_THRESHOLDS = {
  MEGA: 200_000_000_000, // $200B+
  LARGE: 10_000_000_000, // $10B+
  MID: 2_000_000_000, // $2B+
  SMALL: 300_000_000, // $300M+
  MICRO: 50_000_000, // $50M+
} as const;

// ---- API paths ----

export const API_PATHS = {
  HEALTH: "/api/health",
  TRANSACTIONS: "/api/transactions",
  STREAM: "/api/stream",
  MARKET_BUNDLE: "/api/market/bundle",
  MARKET_REF: "/api/market/ref",
  MARKET_REFS: "/api/market/refs",
  MARKET_PRICES: "/api/market/prices",
  MARKET_SPX: "/api/market/spx",
  MARKET_FUNDAMENTALS: "/api/market/fundamentals",
  MARKET_ANALYST: "/api/market/analyst",
  MARKET_INSIDER: "/api/market/insider",
  MARKET_SHORT_VOLUME: "/api/market/short-volume",
  ANALYTICS_TICKER_LEADERBOARD: "/api/analytics/ticker-leaderboard",
  ANALYTICS_CONVICTION: "/api/analytics/conviction",
  ANALYTICS_MEMBER_LEADERBOARD: "/api/analytics/member-leaderboard",
  ANALYTICS_CLUSTER_BUYS: "/api/analytics/cluster-buys",
  ANALYTICS_MEMBER_PERFORMANCE: "/api/analytics/member",
  ANALYTICS_TICKER_BACKTEST: "/api/analytics/ticker",
  ANALYTICS_CONFLICTS: "/api/analytics/conflicts",
  ADMIN_SECURITIES_IMPORT: "/api/admin/securities/import",
  EXPORT_BULK_SNAPSHOT: "/api/export/bulk-snapshot",
} as const;

// ---- Analytics window presets ----

export const WINDOW_PRESETS = [
  "1d", "7d", "30d", "90d", "180d", "365d", "1825d", "all",
] as const;

export type Window = (typeof WINDOW_PRESETS)[number];

// ---- Filing lag buckets ----

export const LAG_BUCKETS = [
  { label: "0-7d", max: 7 },
  { label: "8-14d", max: 14 },
  { label: "15-30d", max: 30 },
  { label: "31-45d", max: 45 },
  { label: "46-60d", max: 60 },
  { label: "60d+", max: null },
] as const;

// ---- Defaults ----

export const DEFAULT_CONGRESS_TRADE_BASE_URL = "https://congress.trade";

export const DEFAULT_TRANSACTIONS_LIMIT = 100;

export const MAX_REFS_BATCH = 500;

export const APP_B_ORIGIN_TAG = "app-b" as const;

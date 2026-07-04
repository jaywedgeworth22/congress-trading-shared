// =============================================================================
// congress-trading-shared — cross-app types
// All types are now derived from Zod schemas via z.infer (single source of truth).
// Schemas live in ./schemas.ts; types are re-exported here for convenience.
// =============================================================================

// ---- Chamber / Party / Owner / TxType / Market-data enums ----

export type {
  Chamber,
  PartyBucket,
  Owner,
  TxType,
  AssetTypeCategory,
  MktCapBucket,
} from "./schemas";

// ---- Market data types ----

export type {
  PriceClose,
  SecurityRef,
  SecurityRefInput,
  PriceSeries,
} from "./schemas";

// ---- Transaction types ----

export type {
  CongressTransaction,
  TransactionsPage,
  TransactionsQuery,
  BundleResponse,
} from "./schemas";

// ---- Enrichment data types ----

export type {
  FundamentalRow,
  AnalystRow,
  InsiderRow,
  ShortVolumeRow,
} from "./schemas";

// ---- Analytics types ----

export type {
  ConvictionTicker,
  TickerLeader,
  ClusterBuy,
  MemberLeader,
  MemberPerformance,
  BacktestHorizon,
  TickerBacktest,
  CommitteeConflict,
} from "./schemas";

// ---- Import/Share payload (App B → App A) ----

export type { SharePayload } from "./schemas";

// ---- Push events (App A → App B) ----

export type { CongressEventType, CongressEvent } from "./schemas";

// ---- Snapshot/Export ----

export type { SnapshotTableInfo, SnapshotManifest } from "./schemas";

// ---- Client-facing types ----

export type {
  ClientMember,
  ClientAsset,
  ClientTransaction,
  ClientFiling,
  ClientTrade,
} from "./schemas";

// ---- Shared constant (consolidated: canonical is in constants.ts) ----

export { APP_B_ORIGIN_TAG as APP_B_ORIGIN } from "./constants";

// ---- Event type list ----

export const CONGRESS_EVENT_TYPES = [
  "congress.trade",
  "insider.update",
  "ref.upsert",
  "price.eod",
  "spx.eod",
] as const;

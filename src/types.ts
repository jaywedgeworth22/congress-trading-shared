// =============================================================================
// congress-trading-shared — cross-app types
// Used by: Congress.Trade (Cloudflare Worker) and Agentic Trading (Next.js)
// =============================================================================

// ---- Chamber / Party / Owner ----

export type Chamber = "house" | "senate";

export type PartyBucket = "D" | "R" | "O";

export type Owner = "self" | "spouse" | "joint" | "dependent";

// ---- Transaction types ----

export type TxType = "P" | "S" | "E";

/** A single congressional trade disclosure row, as served by the API. */
export interface CongressTransaction {
  id: string;
  docId: string;
  filerId: string | null;
  txDate: string | null;
  owner: Owner | null;
  assetName: string;
  ticker: string | null;
  assetType: string | null;
  assetTypeName?: string | null;
  assetTypeCategory?: string | null;
  assetTypeCategoryLabel?: string | null;
  txType: TxType;
  amountMin: number | null;
  amountMax: number | null;
  isOption: boolean;
  capGainsOver200: boolean;
  rawText: string;
  fullName?: string | null;
  state?: string | null;
  photoUrl?: string | null;
  filedDate?: string | null;
  firstSeenAt?: string | null;
  sourceUrl?: string | null;
  refCompanyName?: string | null;
  refSector?: string | null;
  refMarketCap?: number | null;
  refMarketCapBucket?: string | null;
  refCountry?: string | null;
  refExchangeShort?: string | null;
  refAssetClass?: string | null;
}

/** Cursor-paginated transactions API response. */
export interface TransactionsPage {
  transactions: CongressTransaction[];
  cursor: number;
  count: number;
  total: number;
  limit: number;
  offset?: number;
}

/** Query params for the /api/transactions endpoint. */
export interface TransactionsQuery {
  since?: string;
  from?: string;
  to?: string;
  ticker?: string;
  member?: string;
  chamber?: Chamber;
  type?: TxType;
  limit?: number;
  order?: "asc" | "desc";
}

// ---- Market data types ----

export type MktCapBucket = "mega" | "large" | "mid" | "small" | "micro" | "nano";

export interface SecurityRef {
  ticker: string;
  companyName: string | null;
  sector: string | null;
  industry: string | null;
  assetClass: string | null;
  isEtf: boolean;
  isAdr: boolean;
  country: string | null;
  stateHq: string | null;
  stateOfIncorp: string | null;
  exchange: string | null;
  exchangeShort: string | null;
  currency: string | null;
  marketCap: number | null;
  marketCapBucket: MktCapBucket | null;
  sharesOutstanding: number | null;
  ipoDate: string | null;
  cik: string | null;
  sicCode: string | null;
  sicDescription: string | null;
  source: string | null;
}

export interface PriceClose {
  date: string;
  close: number;
  volume?: number;
}

export interface PriceSeries {
  ticker: string;
  closes: PriceClose[];
  currentPrice?: number;
  currentPriceDate?: string;
}

export interface BundleResponse {
  ticker: string;
  ref: SecurityRef | null;
  prices: PriceSeries | null;
  spx: PriceClose[];
}

// ---- Enrichment data types ----

export interface FundamentalRow {
  ticker: string;
  date: string;
  peRatio?: number;
  eps?: number;
  beta?: number;
  dividendYield?: number;
  week52High?: number;
  week52Low?: number;
  fcfYield?: number;
  debtToEquity?: number;
  epsGrowth?: number;
}

export interface AnalystRow {
  ticker: string;
  date: string;
  rating?: string;
  strongBuy?: number;
  buy?: number;
  hold?: number;
  sell?: number;
  strongSell?: number;
  targetMean?: number;
  targetHigh?: number;
  targetLow?: number;
  targetMedian?: number;
}

export interface InsiderRow {
  ticker: string;
  date: string;
  sentiment: number;
  buyFilings: number;
  sellFilings: number;
  buyShares: number;
  sellShares: number;
  owners: string[];
}

export interface ShortVolumeRow {
  ticker: string;
  date: string;
  ratio: number;
  elevated: boolean;
}

// ---- Analytics types ----

export interface TickerLeader {
  ticker: string;
  name?: string;
  tradeCount?: number;
  buyCount?: number;
  sellCount?: number;
  memberCount?: number;
  estVolumeUsd?: number;
  estNetFlowUsd?: number;
  netSentiment?: number;
}

export interface ClusterBuy {
  ticker?: string;
  name?: string;
  txType?: string;
  memberCount?: number;
  tradeCount?: number;
  estVolumeUsd?: number;
  topMembers?: Array<{
    filerId?: string;
    fullName?: string;
    memberName?: string;
    name?: string;
    tradeCount?: number;
  }>;
}

export interface MemberLeader {
  filerId?: string;
  fullName?: string;
  memberName?: string;
  name?: string;
  tradeCount?: number;
  estVolumeUsd?: number;
  estNetFlowUsd?: number;
  netSentiment?: number;
}

export interface MemberPerformance {
  tradeCount?: number;
  scoredCount?: number;
  winRate?: number | null;
  medianReturn?: number | null;
  medianExcess?: number | null;
  avgReturn?: number | null;
  avgExcess?: number | null;
}

export interface ConvictionTicker {
  ticker: string;
  name?: string;
  convictionScore: number | null;
  direction: "BUY" | "SELL" | null;
  fallback?: boolean;
  memberCount?: number;
  tradeCount?: number;
  directionalMembers?: number;
  directionalTrades?: number;
  netSentiment?: number;
  estNetFlowUsd?: number;
  parties?: Record<string, number>;
}

export interface BacktestHorizon {
  days: number;
  tradeCount: number;
  n: number;
  medianReturn: number | null;
  avgReturn: number | null;
  winRate: number | null;
  medianExcess: number | null;
  avgExcess: number | null;
}

export interface TickerBacktest {
  ticker: string;
  txType: string;
  totalBuyEvents: number;
  pricedDays: number;
  horizons: BacktestHorizon[];
}

export interface CommitteeConflict {
  id: string;
  ticker: string;
  sector: string;
  txType: string;
  txDate: string;
  filerId: string;
  memberName: string;
  chamber: string;
  partyBucket: string;
  viaCommittees: string[];
  estAmountUsd: number;
}

// ---- Import/Share payload (App B → App A) ----

export interface SharePayload {
  refs?: SecurityRef[];
  spx?: PriceClose[];
  prices?: PriceSeries[];
  insider?: InsiderRow[];
  shortVolume?: ShortVolumeRow[];
  fundamentals?: FundamentalRow[];
  analyst?: AnalystRow[];
  origin?: string;
}

export const APP_B_ORIGIN = "app-b" as const;

// ---- Push events (App A → App B) ----

export const CONGRESS_EVENT_TYPES = [
  "congress.trade",
  "insider.update",
  "ref.upsert",
  "price.eod",
  "spx.eod",
] as const;

export type CongressEventType = (typeof CONGRESS_EVENT_TYPES)[number];

export interface CongressEvent {
  type: CongressEventType | string;
  id?: string;
  seq?: number;
  emittedAt?: string;
  data?: unknown;
}

// ---- Snapshot/Export ----

export interface SnapshotTableInfo {
  objectKey: string;
  rowCount: number;
}

export interface SnapshotManifest {
  generatedAt: string;
  snapshotDate: string;
  runId: string;
  format: "ndjson";
  tables: Record<string, SnapshotTableInfo>;
  schema: Record<string, string[]>;
}

// ---- Client-facing types ----

export interface ClientMember {
  id: string | null;
  name: string | null;
  chamber: Chamber | null;
  party: string | null;
  state: string | null;
  photoUrl: string | null;
}

export interface ClientAsset {
  name: string;
  ticker: string | null;
  type: string | null;
  sector: string | null;
  marketCapBucket: string | null;
}

export interface ClientTransaction {
  date: string | null;
  type: TxType;
  owner: string | null;
  amountMin: number | null;
  amountMax: number | null;
  isOption: boolean;
}

export interface ClientFiling {
  filedDate: string | null;
  firstSeenAt: string | null;
  sourceUrl: string | null;
}

export interface ClientTrade {
  id: string;
  cursor: number;
  docId: string;
  member: ClientMember;
  asset: ClientAsset;
  transaction: ClientTransaction;
  filing: ClientFiling;
  confidence: number;
  source: "primary" | "seed_dataset";
}

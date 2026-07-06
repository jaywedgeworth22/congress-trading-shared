import { z } from "zod";
import { isIsoDate } from "./utils";
import { CONGRESS_EVENT_TYPES } from "./constants";

// ---- Chamber / Party / Owner ----

export const IsoDateSchema = z.string().refine(isIsoDate, {
  message: "Expected a valid YYYY-MM-DD date",
});

export const ChamberSchema = z.enum(["house", "senate"]);
export type Chamber = z.infer<typeof ChamberSchema>;

export const PartyBucketSchema = z.enum(["D", "R", "O"]);
export type PartyBucket = z.infer<typeof PartyBucketSchema>;

export const OwnerSchema = z.enum(["self", "spouse", "joint", "dependent"]);
export type Owner = z.infer<typeof OwnerSchema>;

export const TxTypeSchema = z.enum(["P", "S", "E"]);
export type TxType = z.infer<typeof TxTypeSchema>;

export const AssetTypeCategorySchema = z.enum([
  "public_equity",
  "private_equity",
  "option",
  "fund",
  "fixed_income_government",
  "fixed_income_corporate",
  "fixed_income_asset_backed",
  "cash",
  "retirement_or_529",
  "real_estate",
  "private_fund",
  "business_interest",
  "crypto",
  "insurance_annuity",
  "trust",
  "commodity_collectible",
  "derivative",
  "intellectual_property",
  "receivable",
  "other_security",
  "other",
  "unknown",
]);
export type AssetTypeCategory = z.infer<typeof AssetTypeCategorySchema>;

// ---- Market data ----

export const MktCapBucketSchema = z.enum([
  "mega", "large", "mid", "small", "micro", "nano",
]);
export type MktCapBucket = z.infer<typeof MktCapBucketSchema>;

export const PriceCloseSchema = z.object({
  date: IsoDateSchema,
  close: z.number(),
  volume: z.number().optional(),
});
export type PriceClose = z.infer<typeof PriceCloseSchema>;

export const SecurityRefSchema = z.object({
  ticker: z.string().min(1).max(10),
  companyName: z.string().nullable(),
  sector: z.string().nullable(),
  industry: z.string().nullable(),
  assetClass: z.string().nullable(),
  isEtf: z.boolean(),
  isAdr: z.boolean(),
  country: z.string().nullable(),
  stateHq: z.string().nullable(),
  stateOfIncorp: z.string().nullable(),
  exchange: z.string().nullable(),
  exchangeShort: z.string().nullable(),
  currency: z.string().nullable(),
  marketCap: z.number().nullable(),
  marketCapBucket: MktCapBucketSchema.nullable(),
  sharesOutstanding: z.number().nullable(),
  ipoDate: z.string().nullable(),
  cik: z.string().nullable(),
  sicCode: z.string().nullable(),
  sicDescription: z.string().nullable(),
  source: z.string().nullable(),
  enrichedAt: z.string().nullable().optional(),
  currentPrice: z.number().nullable().optional(),
  currentPriceDate: IsoDateSchema.nullable().optional(),
});
export type SecurityRef = z.infer<typeof SecurityRefSchema>;

export const SecurityRefInputSchema = SecurityRefSchema.partial().extend({
  ticker: z.string().min(1).max(20),
});
export type SecurityRefInput = z.infer<typeof SecurityRefInputSchema>;

// ---- Transaction ----

export const CongressTransactionSchema = z.object({
  id: z.string().min(1),
  docId: z.string().min(1),
  filerId: z.string().nullable(),
  txDate: z.string().nullable(),
  owner: OwnerSchema.nullable(),
  assetName: z.string(),
  ticker: z.string().nullable(),
  assetType: z.string().nullable(),
  assetTypeName: z.string().nullable().optional(),
  assetTypeCategory: AssetTypeCategorySchema.nullable().optional(),
  assetTypeCategoryLabel: z.string().nullable().optional(),
  txType: TxTypeSchema,
  amountMin: z.number().nullable(),
  amountMax: z.number().nullable(),
  isOption: z.boolean(),
  capGainsOver200: z.boolean(),
  rawText: z.string(),
  filedDate: z.string().nullable().optional(),
  fullName: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  photoUrl: z.string().nullable().optional(),
  firstSeenAt: z.string().nullable().optional(),
  sourceUrl: z.string().nullable().optional(),
  refCompanyName: z.string().nullable().optional(),
  refSector: z.string().nullable().optional(),
  refMarketCap: z.number().nullable().optional(),
  refMarketCapBucket: z.string().nullable().optional(),
  refCountry: z.string().nullable().optional(),
  refExchangeShort: z.string().nullable().optional(),
  refAssetClass: z.string().nullable().optional(),
});
export type CongressTransaction = z.infer<typeof CongressTransactionSchema>;

export const TransactionsPageSchema = z.object({
  transactions: z.array(CongressTransactionSchema),
  cursor: z.number(),
  count: z.number(),
  total: z.number(),
  limit: z.number(),
  offset: z.number().optional(),
});
export type TransactionsPage = z.infer<typeof TransactionsPageSchema>;

export const TransactionsQuerySchema = z.object({
  since: IsoDateSchema.optional(),
  from: IsoDateSchema.optional(),
  to: IsoDateSchema.optional(),
  ticker: z.string().optional(),
  member: z.string().optional(),
  chamber: ChamberSchema.optional(),
  type: TxTypeSchema.optional(),
  limit: z.number().int().positive().optional(),
  order: z.enum(["asc", "desc"]).optional(),
});
export type TransactionsQuery = z.infer<typeof TransactionsQuerySchema>;

// ---- Import/Share payload (App B → App A) ----

export const FundamentalRowSchema = z.object({
  ticker: z.string(),
  date: IsoDateSchema,
  peRatio: z.number().optional(),
  eps: z.number().optional(),
  beta: z.number().optional(),
  dividendYield: z.number().optional(),
  week52High: z.number().optional(),
  week52Low: z.number().optional(),
  fcfYield: z.number().optional(),
  debtToEquity: z.number().optional(),
  epsGrowth: z.number().optional(),
});
export type FundamentalRow = z.infer<typeof FundamentalRowSchema>;

export const AnalystRowSchema = z.object({
  ticker: z.string(),
  date: IsoDateSchema,
  rating: z.string().optional(),
  strongBuy: z.number().optional(),
  buy: z.number().optional(),
  hold: z.number().optional(),
  sell: z.number().optional(),
  strongSell: z.number().optional(),
  targetMean: z.number().optional(),
  targetHigh: z.number().optional(),
  targetLow: z.number().optional(),
  targetMedian: z.number().optional(),
});
export type AnalystRow = z.infer<typeof AnalystRowSchema>;

export const InsiderRowSchema = z.object({
  ticker: z.string(),
  date: IsoDateSchema,
  sentiment: z.number(),
  buyFilings: z.number(),
  sellFilings: z.number(),
  buyShares: z.number(),
  sellShares: z.number(),
  owners: z.array(z.string()),
});
export type InsiderRow = z.infer<typeof InsiderRowSchema>;

export const ShortVolumeRowSchema = z.object({
  ticker: z.string(),
  date: IsoDateSchema,
  ratio: z.number(),
  elevated: z.boolean(),
});
export type ShortVolumeRow = z.infer<typeof ShortVolumeRowSchema>;

export const PriceSeriesSchema = z.object({
  ticker: z.string(),
  closes: z.array(PriceCloseSchema),
  currentPrice: z.number().optional(),
  currentPriceDate: IsoDateSchema.optional(),
});
export type PriceSeries = z.infer<typeof PriceSeriesSchema>;

export const SharePayloadSchema = z.object({
  refs: z.array(SecurityRefInputSchema).optional(),
  spx: z.array(PriceCloseSchema).optional(),
  prices: z.array(PriceSeriesSchema).optional(),
  insider: z.array(InsiderRowSchema).optional(),
  shortVolume: z.array(ShortVolumeRowSchema).optional(),
  fundamentals: z.array(FundamentalRowSchema).optional(),
  analyst: z.array(AnalystRowSchema).optional(),
  origin: z.string().optional(),
});
export type SharePayload = z.infer<typeof SharePayloadSchema>;

export const BundleResponseSchema = z.object({
  ticker: z.string(),
  ref: SecurityRefSchema.nullable(),
  prices: PriceSeriesSchema.nullable(),
  spx: z.array(PriceCloseSchema),
});
export type BundleResponse = z.infer<typeof BundleResponseSchema>;

// ---- Push events (App A → App B) ----

export const CongressEventTypeSchema = z.enum(CONGRESS_EVENT_TYPES);
export type CongressEventType = z.infer<typeof CongressEventTypeSchema>;

export const CongressEventSchema = z.object({
  type: CongressEventTypeSchema.or(z.string()),
  id: z.string().optional(),
  seq: z.number().optional(),
  emittedAt: z.string().optional(),
  data: z.unknown().optional(),
});
export type CongressEvent = z.infer<typeof CongressEventSchema>;

// ---- Analytics ----

export const ConvictionTickerSchema = z.object({
  ticker: z.string(),
  name: z.string().optional(),
  convictionScore: z.number().nullable(),
  direction: z.enum(["BUY", "SELL"]).nullable(),
  fallback: z.boolean().optional(),
  memberCount: z.number().optional(),
  tradeCount: z.number().optional(),
  directionalMembers: z.number().optional(),
  directionalTrades: z.number().optional(),
  netSentiment: z.number().optional(),
  estNetFlowUsd: z.number().optional(),
  parties: z.record(z.string(), z.number()).optional(),
});
export type ConvictionTicker = z.infer<typeof ConvictionTickerSchema>;

export const TickerLeaderSchema = z.object({
  ticker: z.string(),
  name: z.string().optional(),
  tradeCount: z.number().optional(),
  buyCount: z.number().optional(),
  sellCount: z.number().optional(),
  memberCount: z.number().optional(),
  estVolumeUsd: z.number().optional(),
  estNetFlowUsd: z.number().optional(),
  netSentiment: z.number().optional(),
});
export type TickerLeader = z.infer<typeof TickerLeaderSchema>;

export const ClusterBuySchema = z.object({
  ticker: z.string().optional(),
  name: z.string().optional(),
  txType: z.string().optional(),
  memberCount: z.number().optional(),
  tradeCount: z.number().optional(),
  estVolumeUsd: z.number().optional(),
  topMembers: z.array(z.object({
    filerId: z.string().optional(),
    fullName: z.string().optional(),
    memberName: z.string().optional(),
    name: z.string().optional(),
    tradeCount: z.number().optional(),
  })).optional(),
});
export type ClusterBuy = z.infer<typeof ClusterBuySchema>;

export const MemberLeaderSchema = z.object({
  filerId: z.string().optional(),
  fullName: z.string().optional(),
  memberName: z.string().optional(),
  name: z.string().optional(),
  tradeCount: z.number().optional(),
  estVolumeUsd: z.number().optional(),
  estNetFlowUsd: z.number().optional(),
  netSentiment: z.number().optional(),
});
export type MemberLeader = z.infer<typeof MemberLeaderSchema>;

export const MemberPerformanceSchema = z.object({
  tradeCount: z.number().optional(),
  scoredCount: z.number().optional(),
  winRate: z.number().nullable().optional(),
  medianReturn: z.number().nullable().optional(),
  medianExcess: z.number().nullable().optional(),
  avgReturn: z.number().nullable().optional(),
  avgExcess: z.number().nullable().optional(),
});
export type MemberPerformance = z.infer<typeof MemberPerformanceSchema>;

export const BacktestHorizonSchema = z.object({
  days: z.number(),
  tradeCount: z.number(),
  n: z.number(),
  medianReturn: z.number().nullable(),
  avgReturn: z.number().nullable(),
  winRate: z.number().nullable(),
  medianExcess: z.number().nullable(),
  avgExcess: z.number().nullable(),
});
export type BacktestHorizon = z.infer<typeof BacktestHorizonSchema>;

export const TickerBacktestSchema = z.object({
  ticker: z.string(),
  txType: z.string(),
  totalBuyEvents: z.number(),
  pricedDays: z.number(),
  horizons: z.array(BacktestHorizonSchema),
});
export type TickerBacktest = z.infer<typeof TickerBacktestSchema>;

export const CommitteeConflictSchema = z.object({
  id: z.string(),
  ticker: z.string(),
  sector: z.string(),
  txType: z.string(),
  txDate: z.string(),
  filerId: z.string(),
  memberName: z.string(),
  chamber: z.string(),
  partyBucket: z.string(),
  viaCommittees: z.array(z.string()),
  estAmountUsd: z.number(),
});
export type CommitteeConflict = z.infer<typeof CommitteeConflictSchema>;

// ---- Snapshot/Export ----

export const SnapshotTableInfoSchema = z.object({
  objectKey: z.string(),
  rowCount: z.number(),
});
export type SnapshotTableInfo = z.infer<typeof SnapshotTableInfoSchema>;

export const SnapshotManifestSchema = z.object({
  generatedAt: z.string(),
  snapshotDate: IsoDateSchema,
  runId: z.string(),
  format: z.literal("ndjson"),
  tables: z.record(z.string(), SnapshotTableInfoSchema),
  schema: z.record(z.string(), z.array(z.string())),
});
export type SnapshotManifest = z.infer<typeof SnapshotManifestSchema>;

// ---- Client-facing types ----

export const ClientMemberSchema = z.object({
  id: z.string().nullable(),
  name: z.string().nullable(),
  chamber: ChamberSchema.nullable(),
  party: z.string().nullable(),
  state: z.string().nullable(),
  photoUrl: z.string().nullable(),
});
export type ClientMember = z.infer<typeof ClientMemberSchema>;

export const ClientAssetSchema = z.object({
  name: z.string(),
  ticker: z.string().nullable(),
  type: z.string().nullable(),
  sector: z.string().nullable(),
  marketCapBucket: z.string().nullable(),
  companyName: z.string().nullable().optional(),
  logoUrl: z.string().nullable().optional(),
  typeName: z.string().nullable().optional(),
  typeCategory: z.string().nullable().optional(),
  typeCategoryLabel: z.string().nullable().optional(),
});
export type ClientAsset = z.infer<typeof ClientAssetSchema>;

export const ClientTransactionSchema = z.object({
  date: z.string().nullable(),
  type: TxTypeSchema,
  owner: z.string().nullable(),
  amountMin: z.number().nullable(),
  amountMax: z.number().nullable(),
  isOption: z.boolean(),
});
export type ClientTransaction = z.infer<typeof ClientTransactionSchema>;

export const ClientFilingSchema = z.object({
  filedDate: z.string().nullable(),
  firstSeenAt: z.string().nullable(),
  sourceUrl: z.string().nullable(),
});
export type ClientFiling = z.infer<typeof ClientFilingSchema>;

export const ClientTradeSchema = z.object({
  id: z.string(),
  cursor: z.number(),
  docId: z.string(),
  member: ClientMemberSchema,
  asset: ClientAssetSchema,
  transaction: ClientTransactionSchema,
  filing: ClientFilingSchema,
  confidence: z.number(),
  source: z.enum(["primary", "seed_dataset", "manual"]),
});
export type ClientTrade = z.infer<typeof ClientTradeSchema>;

// ---- Helper: tolerant array parser ----

/**
 * Parses an unknown value as an array of the given schema.
 * Returns the parsed array on success, or null on failure.
 * Useful for validating API responses at runtime.
 */
export function parseArray<T>(
  schema: z.ZodType<T>,
  data: unknown,
): T[] | null {
  const result = z.array(schema).safeParse(data);
  return result.success ? result.data : null;
}

/**
 * Parses an unknown value against a schema.
 * Returns the parsed value on success, or null on failure.
 */
export function parseSafe<T>(
  schema: z.ZodType<T>,
  data: unknown,
): T | null {
  const result = schema.safeParse(data);
  return result.success ? result.data : null;
}

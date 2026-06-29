import { z } from "zod";

// ---- Chamber / Party / Owner ----

export const ChamberSchema = z.enum(["house", "senate"]);
export const PartyBucketSchema = z.enum(["D", "R", "O"]);
export const OwnerSchema = z.enum(["self", "spouse", "joint", "dependent"]);
export const TxTypeSchema = z.enum(["P", "S", "E"]);

// ---- Market data ----

export const MktCapBucketSchema = z.enum([
  "mega", "large", "mid", "small", "micro", "nano",
]);

export const PriceCloseSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  close: z.number(),
  volume: z.number().optional(),
});

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
});

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
  txType: TxTypeSchema,
  amountMin: z.number().nullable(),
  amountMax: z.number().nullable(),
  isOption: z.boolean(),
  capGainsOver200: z.boolean(),
  rawText: z.string(),
  filedDate: z.string().nullable(),
  fullName: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  photoUrl: z.string().nullable().optional(),
  firstSeenAt: z.string().nullable().optional(),
  sourceUrl: z.string().nullable().optional(),
  refCompanyName: z.string().nullable().optional(),
  refSector: z.string().nullable().optional(),
  refMarketCap: z.number().nullable().optional(),
  refCountry: z.string().nullable().optional(),
  refExchangeShort: z.string().nullable().optional(),
  refAssetClass: z.string().nullable().optional(),
});

export const TransactionsPageSchema = z.object({
  transactions: z.array(CongressTransactionSchema),
  cursor: z.number(),
  count: z.number(),
  total: z.number(),
  limit: z.number(),
  offset: z.number().optional(),
});

// ---- Import/Share payload (App B → App A) ----

export const FundamentalRowSchema = z.object({
  ticker: z.string(),
  date: z.string(),
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

export const AnalystRowSchema = z.object({
  ticker: z.string(),
  date: z.string(),
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

export const InsiderRowSchema = z.object({
  ticker: z.string(),
  date: z.string(),
  sentiment: z.number(),
  buyFilings: z.number(),
  sellFilings: z.number(),
  buyShares: z.number(),
  sellShares: z.number(),
  owners: z.array(z.string()),
});

export const ShortVolumeRowSchema = z.object({
  ticker: z.string(),
  date: z.string(),
  ratio: z.number(),
  elevated: z.boolean(),
});

export const PriceSeriesSchema = z.object({
  ticker: z.string(),
  closes: z.array(PriceCloseSchema),
  currentPrice: z.number().optional(),
  currentPriceDate: z.string().optional(),
});

export const SharePayloadSchema = z.object({
  refs: z.array(SecurityRefSchema).optional(),
  spx: z.array(PriceCloseSchema).optional(),
  prices: z.array(PriceSeriesSchema).optional(),
  insider: z.array(InsiderRowSchema).optional(),
  shortVolume: z.array(ShortVolumeRowSchema).optional(),
  fundamentals: z.array(FundamentalRowSchema).optional(),
  analyst: z.array(AnalystRowSchema).optional(),
  origin: z.string().optional(),
});

// ---- Push events (App A → App B) ----

export const CongressEventTypeSchema = z.enum([
  "congress.trade",
  "insider.update",
  "ref.upsert",
  "price.eod",
  "spx.eod",
]);

export const CongressEventSchema = z.object({
  type: CongressEventTypeSchema.or(z.string()),
  id: z.string().optional(),
  seq: z.number().optional(),
  emittedAt: z.string().optional(),
  data: z.unknown().optional(),
});

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

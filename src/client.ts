import { API_PATHS, DEFAULT_CONGRESS_TRADE_BASE_URL, MAX_REFS_BATCH } from "./constants";
import type {
  TransactionsPage,
  TransactionsQuery,
  PriceClose,
  PriceSeries,
  SecurityRef,
  FundamentalRow,
  AnalystRow,
  TickerLeader,
  ClusterBuy,
  MemberLeader,
  MemberPerformance,
  ConvictionTicker,
  TickerBacktest,
  CommitteeConflict,
} from "./types";

export interface CongressTradeClientConfig {
  baseUrl?: string;
  token?: string;
  fetch?: typeof fetch;
}

export interface Subscription {
  id: string;
  secret: string;
}

export class CongressTradeClient {
  private baseUrl: string;
  private token?: string;
  private fetchApi: typeof fetch;

  constructor(config: CongressTradeClientConfig = {}) {
    this.baseUrl = (config.baseUrl || DEFAULT_CONGRESS_TRADE_BASE_URL).replace(/\/+$/, "");
    this.token = config.token;
    this.fetchApi = config.fetch || globalThis.fetch;
  }

  private headers(extra?: Record<string, string>): HeadersInit {
    const h: Record<string, string> = { "content-type": "application/json", ...extra };
    if (this.token) {
      h["authorization"] = `Bearer ${this.token}`;
    }
    return h;
  }

  private async getJson<T>(path: string, searchParams?: URLSearchParams): Promise<T> {
    const qs = searchParams?.toString();
    const url = `${this.baseUrl}${path}${qs ? `?${qs}` : ""}`;
    const res = await this.fetchApi(url, {
      method: "GET",
      headers: this.headers({ accept: "application/json" }),
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Request failed: GET ${path} -> HTTP ${res.status}`);
    }
    return (await res.json()) as T;
  }

  async createSubscription(clientId: string, desiredSecret?: string): Promise<Subscription> {
    const body: Record<string, string> = { delivery: "sse", clientId };
    if (desiredSecret && desiredSecret.length >= 16) {
      body.secret = desiredSecret;
    }

    const res = await this.fetchApi(`${this.baseUrl}/api/subscriptions`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`subscription create failed: HTTP ${res.status}`);
    }

    const data = (await res.json()) as { id?: string; secret?: string };
    if (!data.id || !data.secret) {
      throw new Error("subscription create returned no id/secret");
    }

    return { id: data.id, secret: data.secret };
  }

  streamUrl(subscriptionId: string): string {
    return `${this.baseUrl}${API_PATHS.STREAM}?subscription=${encodeURIComponent(subscriptionId)}`;
  }

  async getBundle(
    ticker: string,
    opts?: { from?: string; to?: string }
  ): Promise<{ ref: SecurityRef | null; prices: PriceSeries | null; spx: PriceClose[] }> {
    const params = new URLSearchParams();
    if (opts?.from) params.set("from", opts.from);
    if (opts?.to) params.set("to", opts.to);
    const data = await this.getJson<{ ref?: SecurityRef | null; prices?: PriceSeries | null; spx?: PriceClose[] }>(
      `${API_PATHS.MARKET_BUNDLE}/${encodeURIComponent(ticker)}`,
      params
    );
    return {
      ref: data.ref ?? null,
      prices: data.prices ?? null,
      spx: Array.isArray(data.spx) ? data.spx : [],
    };
  }

  async getRef(ticker: string): Promise<SecurityRef | null> {
    const data = await this.getJson<{ ref?: SecurityRef | null }>(`${API_PATHS.MARKET_REF}/${encodeURIComponent(ticker)}`);
    return data.ref ?? null;
  }

  async getRefs(tickers: string[]): Promise<SecurityRef[]> {
    if (tickers.length === 0) return [];
    const results: SecurityRef[] = [];
    for (let i = 0; i < tickers.length; i += MAX_REFS_BATCH) {
      const chunk = tickers.slice(i, i + MAX_REFS_BATCH);
      const params = new URLSearchParams();
      params.set("tickers", chunk.join(","));
      const data = await this.getJson<{ refs?: SecurityRef[] }>(API_PATHS.MARKET_REFS, params);
      if (data && Array.isArray(data.refs)) {
        results.push(...data.refs);
      }
    }
    return results;
  }

  async getPrices(ticker: string, opts?: { from?: string; to?: string }): Promise<PriceSeries | null> {
    const params = new URLSearchParams();
    if (opts?.from) params.set("from", opts.from);
    if (opts?.to) params.set("to", opts.to);
    const data = await this.getJson<PriceSeries>(`${API_PATHS.MARKET_PRICES}/${encodeURIComponent(ticker)}`, params);
    return data && Array.isArray(data.closes) ? data : null;
  }

  async getSpx(opts?: { from?: string; to?: string }): Promise<PriceClose[]> {
    const params = new URLSearchParams();
    if (opts?.from) params.set("from", opts.from);
    if (opts?.to) params.set("to", opts.to);
    const data = await this.getJson<{ closes?: PriceClose[] }>(API_PATHS.MARKET_SPX, params);
    return Array.isArray(data.closes) ? data.closes : [];
  }

  async getFundamentals(ticker: string, opts?: { from?: string; to?: string }): Promise<FundamentalRow[]> {
    const params = new URLSearchParams();
    if (opts?.from) params.set("from", opts.from);
    if (opts?.to) params.set("to", opts.to);
    const data = await this.getJson<{ rows?: FundamentalRow[] }>(
      `${API_PATHS.MARKET_FUNDAMENTALS}/${encodeURIComponent(ticker)}`,
      params
    );
    return Array.isArray(data.rows) ? data.rows : [];
  }

  async getAnalyst(ticker: string, opts?: { from?: string; to?: string }): Promise<AnalystRow[]> {
    const params = new URLSearchParams();
    if (opts?.from) params.set("from", opts.from);
    if (opts?.to) params.set("to", opts.to);
    const data = await this.getJson<{ rows?: AnalystRow[] }>(
      `${API_PATHS.MARKET_ANALYST}/${encodeURIComponent(ticker)}`,
      params
    );
    return Array.isArray(data.rows) ? data.rows : [];
  }

  async getTransactions(query: TransactionsQuery = {}): Promise<TransactionsPage> {
    const params = new URLSearchParams();
    if (query.since) params.set("since", query.since);
    if (query.from) params.set("from", query.from);
    if (query.to) params.set("to", query.to);
    if (query.ticker) params.set("ticker", query.ticker);
    if (query.member) params.set("member", query.member);
    if (query.chamber) params.set("chamber", query.chamber);
    if (query.type) params.set("type", query.type);
    if (query.limit) params.set("limit", String(query.limit));
    if (query.order) params.set("order", query.order);
    return this.getJson<TransactionsPage>(API_PATHS.TRANSACTIONS, params);
  }

  async getTickerLeaderboard(opts: { window?: string; limit?: number } = {}): Promise<TickerLeader[]> {
    const params = new URLSearchParams();
    if (opts.window) params.set("window", opts.window);
    if (opts.limit) params.set("limit", String(opts.limit));
    const data = await this.getJson<{ tickers?: TickerLeader[] }>(API_PATHS.ANALYTICS_TICKER_LEADERBOARD, params);
    return Array.isArray(data.tickers) ? data.tickers : [];
  }

  async getClusterBuys(opts: { window?: string; limit?: number } = {}): Promise<ClusterBuy[]> {
    const params = new URLSearchParams();
    if (opts.window) params.set("window", opts.window);
    if (opts.limit) params.set("limit", String(opts.limit));
    const data = await this.getJson<{ clusters?: ClusterBuy[] }>(API_PATHS.ANALYTICS_CLUSTER_BUYS, params);
    return Array.isArray(data.clusters) ? data.clusters : [];
  }

  async getMemberLeaderboard(opts: { window?: string; limit?: number } = {}): Promise<MemberLeader[]> {
    const params = new URLSearchParams();
    if (opts.window) params.set("window", opts.window);
    if (opts.limit) params.set("limit", String(opts.limit));
    const data = await this.getJson<{ members?: MemberLeader[] }>(API_PATHS.ANALYTICS_MEMBER_LEADERBOARD, params);
    return Array.isArray(data.members) ? data.members : [];
  }

  async getMemberPerformance(filerId: string): Promise<MemberPerformance | null> {
    if (!filerId) return null;
    const data = await this.getJson<{ performance?: MemberPerformance }>(
      `${API_PATHS.ANALYTICS_MEMBER_PERFORMANCE}/${encodeURIComponent(filerId)}/performance`
    );
    return data.performance ?? null;
  }

  async getConviction(opts: { window?: string; limit?: number } = {}): Promise<ConvictionTicker[]> {
    const params = new URLSearchParams();
    if (opts.window) params.set("window", opts.window);
    if (opts.limit) params.set("limit", String(opts.limit));
    const data = await this.getJson<{ tickers?: ConvictionTicker[] }>(API_PATHS.ANALYTICS_CONVICTION, params);
    return Array.isArray(data.tickers) ? data.tickers : [];
  }

  async getTickerBacktest(
    ticker: string,
    opts: { window?: string; horizons?: string; filerId?: string } = {}
  ): Promise<TickerBacktest | null> {
    const params = new URLSearchParams();
    if (opts.window) params.set("window", opts.window);
    if (opts.horizons) params.set("horizons", opts.horizons);
    if (opts.filerId) params.set("filerId", opts.filerId);
    const data = await this.getJson<TickerBacktest>(
      `${API_PATHS.ANALYTICS_TICKER_BACKTEST}/${encodeURIComponent(ticker)}/backtest`,
      params
    );
    return data?.horizons?.length ? data : null;
  }

  async getConflicts(
    opts: { window?: string; limit?: number; chamber?: string; party?: string } = {}
  ): Promise<CommitteeConflict[]> {
    const params = new URLSearchParams();
    if (opts.window) params.set("window", opts.window);
    if (opts.limit) params.set("limit", String(opts.limit));
    if (opts.chamber) params.set("chamber", opts.chamber);
    if (opts.party) params.set("party", opts.party);
    const data = await this.getJson<{ conflicts?: CommitteeConflict[] }>(API_PATHS.ANALYTICS_CONFLICTS, params);
    return Array.isArray(data.conflicts) ? data.conflicts : [];
  }
}

export interface SseMessage {
  event?: string;
  id?: string;
  data: string;
}

/** Incremental text/event-stream parser. Feed decoded chunks; get back complete events. */
export class SseParser {
  private buf = "";
  private cur: { event?: string; id?: string; data: string[] } = { data: [] };

  push(chunk: string): SseMessage[] {
    this.buf += chunk;
    const out: SseMessage[] = [];
    let nl: number;
    while ((nl = this.buf.indexOf("\n")) >= 0) {
      let line = this.buf.slice(0, nl);
      this.buf = this.buf.slice(nl + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line === "") {
        if (this.cur.data.length > 0) {
          const msg: SseMessage = { data: this.cur.data.join("\n") };
          if (this.cur.event !== undefined) msg.event = this.cur.event;
          if (this.cur.id !== undefined) msg.id = this.cur.id;
          out.push(msg);
        }
        this.cur = { data: [] };
        continue;
      }
      if (line.startsWith(":")) continue; // comment / heartbeat
      const colon = line.indexOf(":");
      const field = colon === -1 ? line : line.slice(0, colon);
      let value = colon === -1 ? "" : line.slice(colon + 1);
      if (value.startsWith(" ")) value = value.slice(1);
      if (field === "data") this.cur.data.push(value);
      else if (field === "event") this.cur.event = value;
      else if (field === "id") this.cur.id = value;
    }
    return out;
  }
}

import { describe, expect, it, vi } from "vitest";
import { CongressTradeClient } from "../client";

function mockClient(fetchFn: typeof fetch) {
  return new CongressTradeClient({
    baseUrl: "https://custom.congress.trade",
    fetch: fetchFn,
  });
}

describe("CongressTradeClient", () => {
  describe("request plumbing", () => {
    it("sends request with correct url and headers", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ref: { ticker: "AAPL" } }),
      });

      const client = new CongressTradeClient({
        baseUrl: "https://custom.congress.trade",
        token: "secret-token",
        fetch: mockFetch,
      });

      const result = await client.getRef("AAPL");
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [url, init] = mockFetch.mock.calls[0];
      expect(url).toBe("https://custom.congress.trade/api/market/ref/AAPL");
      expect(init.method).toBe("GET");
      expect(init.headers).toEqual({
        "content-type": "application/json",
        accept: "application/json",
        authorization: "Bearer secret-token",
      });
      expect(result).toEqual({ ticker: "AAPL" });
    });

    it("strips trailing slash from baseUrl", async () => {
      const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ref: null }) });
      const client = new CongressTradeClient({ baseUrl: "https://api.example.com/", fetch: mockFetch });
      await client.getRef("AAPL");
      const [url] = mockFetch.mock.calls[0];
      expect(url).toBe("https://api.example.com/api/market/ref/AAPL");
    });

    it("throws on non-ok HTTP response", async () => {
      const mockFetch = vi.fn().mockResolvedValue({ ok: false, status: 404 });
      const client = mockClient(mockFetch);
      await expect(client.getRef("NOPE")).rejects.toThrow("Request failed: GET /api/market/ref/NOPE -> HTTP 404");
    });
  });

  describe("createSubscription", () => {
    it("creates a subscription via POST", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: "sub-1", secret: "sec-abc" }),
      });
      const client = mockClient(mockFetch);
      const result = await client.createSubscription("client-1");

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [url, init] = mockFetch.mock.calls[0];
      expect(url).toBe("https://custom.congress.trade/api/subscriptions");
      expect(init.method).toBe("POST");
      expect(result).toEqual({ id: "sub-1", secret: "sec-abc" });
    });

    it("sends desiredSecret when long enough", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: "sub-1", secret: "my-custom-secret" }),
      });
      const client = mockClient(mockFetch);
      await client.createSubscription("client-1", "my-custom-secret");
      const [, init] = mockFetch.mock.calls[0];
      const body = JSON.parse(init.body as string);
      expect(body.secret).toBe("my-custom-secret");
    });

    it("omits secret when shorter than 16 chars", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: "sub-1", secret: "auto-secret" }),
      });
      const client = mockClient(mockFetch);
      await client.createSubscription("client-1", "short");
      const [, init] = mockFetch.mock.calls[0];
      const body = JSON.parse(init.body as string);
      expect(body.secret).toBeUndefined();
    });

    it("throws on HTTP error", async () => {
      const mockFetch = vi.fn().mockResolvedValue({ ok: false, status: 409 });
      const client = mockClient(mockFetch);
      await expect(client.createSubscription("client-1")).rejects.toThrow("subscription create failed: HTTP 409");
    });

    it("throws when response has no id or secret", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });
      const client = mockClient(mockFetch);
      await expect(client.createSubscription("client-1")).rejects.toThrow("subscription create returned no id/secret");
    });
  });

  describe("market data endpoints", () => {
    it("getBundle returns ref, prices, and spx", async () => {
      const mockData = { ref: { ticker: "MSFT" }, prices: { ticker: "MSFT", closes: [] }, spx: [{ date: "2026-01-01", close: 5000 }] };
      const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: async () => mockData });
      const client = mockClient(mockFetch);
      const result = await client.getBundle("MSFT", { from: "2026-01-01", to: "2026-06-01" });
      expect(result.ref).toEqual({ ticker: "MSFT" });
      expect(result.prices).toEqual({ ticker: "MSFT", closes: [] });
      expect(result.spx).toEqual([{ date: "2026-01-01", close: 5000 }]);
    });

    it("getBundle handles null/missing fields", async () => {
      const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
      const client = mockClient(mockFetch);
      const result = await client.getBundle("MSFT");
      expect(result.ref).toBeNull();
      expect(result.prices).toBeNull();
      expect(result.spx).toEqual([]);
    });

    it("getPrices returns null when no closes array", async () => {
      const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ticker: "AAPL" }) });
      const client = mockClient(mockFetch);
      const result = await client.getPrices("AAPL", { from: "2026-01-01" });
      expect(result).toBeNull();
    });

    it("getPrices returns data when closes present", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ticker: "AAPL", closes: [{ date: "2026-01-01", close: 150 }] }),
      });
      const client = mockClient(mockFetch);
      const result = await client.getPrices("AAPL");
      expect(result).toEqual({ ticker: "AAPL", closes: [{ date: "2026-01-01", close: 150 }] });
    });

    it("getSpx returns closes array", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ closes: [{ date: "2026-01-01", close: 5000 }] }),
      });
      const client = mockClient(mockFetch);
      const result = await client.getSpx({ from: "2026-01-01", to: "2026-06-01" });
      expect(result).toEqual([{ date: "2026-01-01", close: 5000 }]);
    });

    it("getSpx returns empty array on missing closes", async () => {
      const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
      const client = mockClient(mockFetch);
      const result = await client.getSpx();
      expect(result).toEqual([]);
    });

    it("getFundamentals returns rows array", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ rows: [{ ticker: "AAPL", date: "2026-01-01", peRatio: 30 }] }),
      });
      const client = mockClient(mockFetch);
      const result = await client.getFundamentals("AAPL", { from: "2026-01-01" });
      expect(result).toEqual([{ ticker: "AAPL", date: "2026-01-01", peRatio: 30 }]);
    });

    it("getFundamentals returns empty array on missing rows", async () => {
      const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
      const client = mockClient(mockFetch);
      const result = await client.getFundamentals("AAPL");
      expect(result).toEqual([]);
    });

    it("getAnalyst returns rows array", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ rows: [{ ticker: "AAPL", date: "2026-01-01", rating: "Buy" }] }),
      });
      const client = mockClient(mockFetch);
      const result = await client.getAnalyst("AAPL");
      expect(result).toEqual([{ ticker: "AAPL", date: "2026-01-01", rating: "Buy" }]);
    });

    it("getRefs returns empty array for empty input", async () => {
      const mockFetch = vi.fn();
      const client = mockClient(mockFetch);
      const result = await client.getRefs([]);
      expect(result).toEqual([]);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("getRef handles null ref", async () => {
      const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ref: null }) });
      const client = mockClient(mockFetch);
      const result = await client.getRef("NOPE");
      expect(result).toBeNull();
    });
  });

  describe("transactions", () => {
    it("handles optional query parameters correctly", async () => {
      const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ transactions: [] }) });
      const client = mockClient(mockFetch);
      await client.getTransactions({ ticker: "AAPL", limit: 10, order: "asc" });
      const [url] = mockFetch.mock.calls[0];
      expect(url).toBe("https://custom.congress.trade/api/transactions?ticker=AAPL&limit=10&order=asc");
    });

    it("handles all query params", async () => {
      const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ transactions: [] }) });
      const client = mockClient(mockFetch);
      await client.getTransactions({
        since: "2026-01-01",
        from: "2026-01-01",
        to: "2026-06-30",
        ticker: "MSFT",
        member: "Pelosi",
        chamber: "house",
        type: "P",
        limit: 5,
        order: "desc",
      });
      const [url] = mockFetch.mock.calls[0];
      expect(url).toContain("since=2026-01-01");
      expect(url).toContain("chamber=house");
      expect(url).toContain("order=desc");
    });

    it("chunks getRefs requests when length exceeds MAX_REFS_BATCH", async () => {
      const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ refs: [{ ticker: "AAPL" }] }) });
      const client = mockClient(mockFetch);
      const tickers = Array.from({ length: 505 }, (_, i) => `T${i}`);
      const results = await client.getRefs(tickers);
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(results.length).toBe(2);
    });
  });

  describe("analytics endpoints", () => {
    it("getTickerLeaderboard returns tickers array", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ tickers: [{ ticker: "AAPL", tradeCount: 5 }] }),
      });
      const client = mockClient(mockFetch);
      const result = await client.getTickerLeaderboard({ window: "30d", limit: 10 });
      expect(result).toEqual([{ ticker: "AAPL", tradeCount: 5 }]);
    });

    it("getTickerLeaderboard returns empty on missing array", async () => {
      const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
      const client = mockClient(mockFetch);
      const result = await client.getTickerLeaderboard();
      expect(result).toEqual([]);
    });

    it("getClusterBuys returns clusters array", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ clusters: [{ ticker: "MSFT", memberCount: 3 }] }),
      });
      const client = mockClient(mockFetch);
      const result = await client.getClusterBuys({ window: "90d" });
      expect(result).toEqual([{ ticker: "MSFT", memberCount: 3 }]);
    });

    it("getMemberLeaderboard returns members array", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ members: [{ filerId: "123", tradeCount: 10 }] }),
      });
      const client = mockClient(mockFetch);
      const result = await client.getMemberLeaderboard({ limit: 5 });
      expect(result).toEqual([{ filerId: "123", tradeCount: 10 }]);
    });

    it("getMemberPerformance returns performance data", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ performance: { tradeCount: 10, winRate: 0.7 } }),
      });
      const client = mockClient(mockFetch);
      const result = await client.getMemberPerformance("filer-1");
      expect(result).toEqual({ tradeCount: 10, winRate: 0.7 });
    });

    it("getMemberPerformance returns null for empty filerId", async () => {
      const mockFetch = vi.fn();
      const client = mockClient(mockFetch);
      const result = await client.getMemberPerformance("");
      expect(result).toBeNull();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("getMemberPerformance returns null when no performance key", async () => {
      const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
      const client = mockClient(mockFetch);
      const result = await client.getMemberPerformance("filer-1");
      expect(result).toBeNull();
    });

    it("getConviction returns tickers array", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ tickers: [{ ticker: "AAPL", convictionScore: 85, direction: "BUY" }] }),
      });
      const client = mockClient(mockFetch);
      const result = await client.getConviction({ window: "7d" });
      expect(result).toEqual([{ ticker: "AAPL", convictionScore: 85, direction: "BUY" }]);
    });

    it("getTickerBacktest returns backtest with horizons", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ticker: "AAPL", txType: "P", totalBuyEvents: 5, pricedDays: 30, horizons: [{ days: 30, tradeCount: 5, n: 5, medianReturn: 2.5, avgReturn: 3.0, winRate: 0.8, medianExcess: 1.5, avgExcess: 2.0 }] }),
      });
      const client = mockClient(mockFetch);
      const result = await client.getTickerBacktest("AAPL", { window: "90d", horizons: "30,60", filerId: "123" });
      expect(result!.horizons).toHaveLength(1);
      expect(result!.horizons[0].days).toBe(30);
    });

    it("getTickerBacktest returns null for empty horizons", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ticker: "AAPL", txType: "P", totalBuyEvents: 0, pricedDays: 0, horizons: [] }),
      });
      const client = mockClient(mockFetch);
      const result = await client.getTickerBacktest("AAPL");
      expect(result).toBeNull();
    });

    it("getConflicts returns conflicts array", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ conflicts: [{ id: "c1", ticker: "AAPL", sector: "Tech", txType: "P", txDate: "2026-01-01", filerId: "123", memberName: "Jane Doe", chamber: "senate", partyBucket: "D", viaCommittees: ["Banking"], estAmountUsd: 50000 }] }),
      });
      const client = mockClient(mockFetch);
      const result = await client.getConflicts({ chamber: "senate", party: "D" });
      expect(result).toHaveLength(1);
      expect(result[0].ticker).toBe("AAPL");
    });

    it("getConflicts returns empty on missing array", async () => {
      const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
      const client = mockClient(mockFetch);
      const result = await client.getConflicts();
      expect(result).toEqual([]);
    });
  });

  describe("streamUrl", () => {
    it("returns a full SSE URL with encoded subscription id", () => {
      const client = new CongressTradeClient({ baseUrl: "https://custom.congress.trade" });
      const url = client.streamUrl("sub/1&2");
      expect(url).toBe("https://custom.congress.trade/api/stream?subscription=sub%2F1%262");
    });
  });
});

import { SseParser } from "../client";

describe("SseParser", () => {
  it("ignores heartbeat/comment lines", () => {
    const parser = new SseParser();
    const result = parser.push(": heartbeat\n\n");
    expect(result).toEqual([]);
  });

  it("ignores id-only or event-only blocks with no data", () => {
    const parser = new SseParser();
    const result = parser.push("id: 12345\nevent: update\n\n");
    expect(result).toEqual([]);
  });

  it("emits correct message when data is present", () => {
    const parser = new SseParser();
    const result = parser.push("id: 12345\nevent: update\ndata: hello world\n\n");
    expect(result).toEqual([{ id: "12345", event: "update", data: "hello world" }]);
  });

  it("joins multiple data lines with newlines", () => {
    const parser = new SseParser();
    const result = parser.push("data: line1\ndata: line2\ndata: line3\n\n");
    expect(result).toEqual([{ data: "line1\nline2\nline3" }]);
  });

  it("accumulates data across multiple push calls", () => {
    const parser = new SseParser();
    const r1 = parser.push("data: start");
    expect(r1).toEqual([]);
    const r2 = parser.push(" of message\n\n");
    expect(r2).toEqual([{ data: "start of message" }]);
  });

  it("handles CRLF line endings", () => {
    const parser = new SseParser();
    const result = parser.push("id: 1\r\ndata: hello\r\n\r\n");
    expect(result).toEqual([{ id: "1", data: "hello" }]);
  });

  it("strips leading space from field value", () => {
    const parser = new SseParser();
    const result = parser.push("data:  padded\n\n");
    expect(result).toEqual([{ data: " padded" }]);
  });

  it("handles data-only blocks (no event/id)", () => {
    const parser = new SseParser();
    const result = parser.push("data: {\"foo\":\"bar\"}\n\n");
    expect(result).toEqual([{ data: '{"foo":"bar"}' }]);
  });

  it("handles event before data", () => {
    const parser = new SseParser();
    const result = parser.push("event: trade\ndata: {\"type\":\"P\"}\n\n");
    expect(result).toEqual([{ event: "trade", data: '{"type":"P"}' }]);
  });

  it("handles id after data", () => {
    const parser = new SseParser();
    const result = parser.push("data: msg\ndata: body\nid: 99\n\n");
    expect(result).toEqual([{ id: "99", data: "msg\nbody" }]);
  });

  it("dispatches multiple complete events in one push", () => {
    const parser = new SseParser();
    const result = parser.push("data: first\n\ndata: second\n\n");
    expect(result).toEqual([{ data: "first" }, { data: "second" }]);
  });

  it("ignores comments between data blocks", () => {
    const parser = new SseParser();
    const result = parser.push("data: visible\n: comment\n\n");
    // The comment line is ignored; the event should contain visible
    expect(result).toEqual([{ data: "visible" }]);
  });
});

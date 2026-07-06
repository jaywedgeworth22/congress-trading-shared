import { describe, expect, it, vi } from "vitest";
import { CongressTradeClient } from "../client";

describe("CongressTradeClient", () => {
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

  it("handles optional query parameters correctly", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        transactions: [],
      }),
    });

    const client = new CongressTradeClient({
      baseUrl: "https://custom.congress.trade",
      fetch: mockFetch,
    });

    await client.getTransactions({ ticker: "AAPL", limit: 10, order: "asc" });

    const [url] = mockFetch.mock.calls[0];
    expect(url).toBe("https://custom.congress.trade/api/transactions?ticker=AAPL&limit=10&order=asc");
  });

  it("chunks getRefs requests when length exceeds MAX_REFS_BATCH", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        refs: [{ ticker: "AAPL" }],
      }),
    });

    const client = new CongressTradeClient({
      baseUrl: "https://custom.congress.trade",
      fetch: mockFetch,
    });

    // Create 505 tickers to trigger chunking (limit is 500)
    const tickers = Array.from({ length: 505 }, (_, i) => `T${i}`);
    const results = await client.getRefs(tickers);

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(results.length).toBe(2);

    const [url1] = mockFetch.mock.calls[0];
    const [url2] = mockFetch.mock.calls[1];
    expect(url1).toContain("tickers=");
    expect(url2).toContain("tickers=");
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
    expect(result).toEqual([
      { id: "12345", event: "update", data: "hello world" }
    ]);
  });
});

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

    await client.getTransactions({ ticker: "AAPL", limit: 10 });

    const [url] = mockFetch.mock.calls[0];
    expect(url).toBe("https://custom.congress.trade/api/transactions?ticker=AAPL&limit=10");
  });
});

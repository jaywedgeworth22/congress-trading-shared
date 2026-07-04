import { describe, it, expect, beforeAll } from "vitest";
import {
  deriveUsageTelemetryIdempotencyKey,
  UsageTelemetryEventSchema,
} from "../usageTelemetry";
import {
  CongressTransactionSchema,
  SecurityRefSchema,
} from "../schemas";

// ---------------------------------------------------------------------------
// Polyfill crypto.subtle for Node (vitest runs in Node, needs WebCrypto)
// ---------------------------------------------------------------------------
import { webcrypto } from "node:crypto";

beforeAll(() => {
  // Ensure crypto.subtle is available for SHA-256 hashing in tests
  if (!globalThis.crypto?.subtle) {
    globalThis.crypto = webcrypto as unknown as Crypto;
  }
});

// ---------------------------------------------------------------------------
// deriveUsageTelemetryIdempotencyKey — contract test vectors
// ---------------------------------------------------------------------------
// These are the SHARED CONTRACT — the api-usage-monitor repo MUST produce
// identical hashes for the same inputs, byte-for-byte. If any of these tests
// ever fail, treat it as a breaking change.
// ---------------------------------------------------------------------------

describe("deriveUsageTelemetryIdempotencyKey — contract vectors", () => {
  it("vector 1: basic usage event", async () => {
    const key = await deriveUsageTelemetryIdempotencyKey({
      sourceApp: "congress-trade",
      provider: "cloudflare",
      metricType: "usage",
      keyRef: "",
      occurredAt: "2026-01-15T10:30:00.000Z",
    });
    expect(key).toBe(
      "a580c6a4b2836b7ee5474f00200d2f073245369701273bc7764869783eb07343",
    );
  });

  it("vector 2: different sourceApp", async () => {
    const key = await deriveUsageTelemetryIdempotencyKey({
      sourceApp: "agentic-trading",
      provider: "cloudflare",
      metricType: "usage",
      keyRef: "",
      occurredAt: "2026-01-15T10:30:00.000Z",
    });
    expect(key).toBe(
      "0a7d4876d2f48397f04dcb6d8a61fd73e61d7b3ac518e9e4617016f1f55cc3e8",
    );
  });

  it("vector 3: different provider", async () => {
    const key = await deriveUsageTelemetryIdempotencyKey({
      sourceApp: "congress-trade",
      provider: "pinecone",
      metricType: "usage",
      keyRef: "",
      occurredAt: "2026-01-15T10:30:00.000Z",
    });
    expect(key).toBe(
      "cb9a7853f5641727929d6a065f5ae06999981120ac8c597e84394ba2b962a363",
    );
  });

  it("vector 4: with non-empty keyRef", async () => {
    const key = await deriveUsageTelemetryIdempotencyKey({
      sourceApp: "congress-trade",
      provider: "cloudflare",
      metricType: "usage",
      keyRef: "api-usage-monitor-lite",
      occurredAt: "2026-01-15T10:30:00.000Z",
    });
    expect(key).toBe(
      "300ff3d978e9153e616c1e2d7d30d67cb20d6360fe37702df19f31e4338fcacb",
    );
  });

  it("vector 5: different metricType", async () => {
    const key = await deriveUsageTelemetryIdempotencyKey({
      sourceApp: "congress-trade",
      provider: "cloudflare",
      metricType: "cost",
      keyRef: "",
      occurredAt: "2026-01-15T10:30:00.000Z",
    });
    expect(key).toBe(
      "683201827280518fcd9657a54790ddf2122b6aac7b8f87b88aaf26b860fe2593",
    );
  });

  it("vector 6: different timestamp", async () => {
    const key = await deriveUsageTelemetryIdempotencyKey({
      sourceApp: "congress-trade",
      provider: "cloudflare",
      metricType: "usage",
      keyRef: "",
      occurredAt: "2026-01-16T14:45:00.000Z",
    });
    expect(key).toBe(
      "9693f31f9477e3a8c9864147a8ecb3310ef7e7f6027e3dea92aeeffc49271f63",
    );
  });

  it("vector 7: special characters in provider name", async () => {
    const key = await deriveUsageTelemetryIdempotencyKey({
      sourceApp: "congress-trade",
      provider: "acme-corp|v2",
      metricType: "usage",
      keyRef: "",
      occurredAt: "2026-01-15T10:30:00.000Z",
    });
    expect(key).toBe(
      "32a0a0b13d5b3edafd460655d6fb9b6d277c2f87c2c4be6460b1bcd2f3d701e0",
    );
  });
});

// ---------------------------------------------------------------------------
// Determinism
// ---------------------------------------------------------------------------

describe("deriveUsageTelemetryIdempotencyKey — determinism", () => {
  it("same inputs always produce the same key", async () => {
    const event = {
      sourceApp: "congress-trade",
      provider: "cloudflare",
      metricType: "usage",
      keyRef: "determinism-test",
      occurredAt: "2026-06-01T00:00:00.000Z",
    };
    const key1 = await deriveUsageTelemetryIdempotencyKey(event);
    const key2 = await deriveUsageTelemetryIdempotencyKey({ ...event });
    const key3 = await deriveUsageTelemetryIdempotencyKey({
      ...event,
      sourceApp: "congress-trade",
    });
    expect(key1).toBeTruthy();
    expect(key1).toBe(key2);
    expect(key1).toBe(key3);
  });
});

// ---------------------------------------------------------------------------
// Different inputs produce different outputs
// ---------------------------------------------------------------------------

describe("deriveUsageTelemetryIdempotencyKey — uniqueness", () => {
  it("different sourceApp yields different key", async () => {
    const base = {
      provider: "cloudflare",
      metricType: "usage",
      keyRef: "",
      occurredAt: "2026-03-01T12:00:00.000Z",
    };
    const k1 = await deriveUsageTelemetryIdempotencyKey({
      ...base,
      sourceApp: "app-alpha",
    });
    const k2 = await deriveUsageTelemetryIdempotencyKey({
      ...base,
      sourceApp: "app-beta",
    });
    expect(k1).not.toBe(k2);
  });

  it("different provider yields different key", async () => {
    const base = {
      sourceApp: "congress-trade",
      metricType: "usage",
      keyRef: "",
      occurredAt: "2026-03-01T12:00:00.000Z",
    };
    const k1 = await deriveUsageTelemetryIdempotencyKey({
      ...base,
      provider: "cloudflare",
    });
    const k2 = await deriveUsageTelemetryIdempotencyKey({
      ...base,
      provider: "render",
    });
    expect(k1).not.toBe(k2);
  });

  it("different keyRef yields different key", async () => {
    const base = {
      sourceApp: "congress-trade",
      provider: "cloudflare",
      metricType: "usage",
      occurredAt: "2026-03-01T12:00:00.000Z",
    };
    const k1 = await deriveUsageTelemetryIdempotencyKey({
      ...base,
      keyRef: "ref-a",
    });
    const k2 = await deriveUsageTelemetryIdempotencyKey({
      ...base,
      keyRef: "ref-b",
    });
    expect(k1).not.toBe(k2);
  });

  it("different metricType yields different key", async () => {
    const base = {
      sourceApp: "congress-trade",
      provider: "cloudflare",
      keyRef: "",
      occurredAt: "2026-03-01T12:00:00.000Z",
    };
    const k1 = await deriveUsageTelemetryIdempotencyKey({
      ...base,
      metricType: "usage",
    });
    const k2 = await deriveUsageTelemetryIdempotencyKey({
      ...base,
      metricType: "quota",
    });
    expect(k1).not.toBe(k2);
  });

  it("different occurredAt yields different key", async () => {
    const base = {
      sourceApp: "congress-trade",
      provider: "cloudflare",
      metricType: "usage",
      keyRef: "",
    };
    const k1 = await deriveUsageTelemetryIdempotencyKey({
      ...base,
      occurredAt: "2026-01-01T00:00:00.000Z",
    });
    const k2 = await deriveUsageTelemetryIdempotencyKey({
      ...base,
      occurredAt: "2026-01-02T00:00:00.000Z",
    });
    expect(k1).not.toBe(k2);
  });
});

// ---------------------------------------------------------------------------
// Edge cases
// ---------------------------------------------------------------------------

describe("deriveUsageTelemetryIdempotencyKey — edge cases", () => {
  it("empty keyRef produces a valid key (not undefined)", async () => {
    const key = await deriveUsageTelemetryIdempotencyKey({
      sourceApp: "congress-trade",
      provider: "cloudflare",
      metricType: "usage",
      keyRef: "",
      occurredAt: "2026-06-01T00:00:00.000Z",
    });
    expect(key).toBeTruthy();
    expect(key).toHaveLength(64); // SHA-256 hex
  });

  it("missing keyRef (undefined) produces a valid key", async () => {
    const key = await deriveUsageTelemetryIdempotencyKey({
      sourceApp: "congress-trade",
      provider: "cloudflare",
      metricType: "usage",
      occurredAt: "2026-06-01T00:00:00.000Z",
    });
    expect(key).toBeTruthy();
    expect(key).toHaveLength(64);
  });

  it("missing occurredAt returns undefined", async () => {
    const key = await deriveUsageTelemetryIdempotencyKey({
      sourceApp: "congress-trade",
      provider: "cloudflare",
      metricType: "usage",
      keyRef: "some-ref",
    });
    expect(key).toBeUndefined();
  });

  it("special characters in provider (pipe, comma)", async () => {
    const key = await deriveUsageTelemetryIdempotencyKey({
      sourceApp: "congress-trade",
      provider: "some|provider,with,commas",
      metricType: "usage",
      keyRef: "",
      occurredAt: "2026-06-01T00:00:00.000Z",
    });
    expect(key).toBeTruthy();
    expect(key).toHaveLength(64);
  });

  it("unicode characters in keyRef produce a valid key", async () => {
    const key = await deriveUsageTelemetryIdempotencyKey({
      sourceApp: "congress-trade",
      provider: "cloudflare",
      metricType: "usage",
      keyRef: "café-über-proxy",
      occurredAt: "2026-06-01T00:00:00.000Z",
    });
    expect(key).toBeTruthy();
    expect(key).toHaveLength(64);
  });

  it("empty keyRef vs undefined keyRef produce the same key (both encode to '')", async () => {
    const base = {
      sourceApp: "congress-trade",
      provider: "cloudflare",
      metricType: "usage",
      occurredAt: "2026-06-01T00:00:00.000Z",
    };
    const k1 = await deriveUsageTelemetryIdempotencyKey({
      ...base,
      keyRef: "",
    });
    const k2 = await deriveUsageTelemetryIdempotencyKey({
      ...base,
      // keyRef omitted
    });
    expect(k1).toBe(k2);
  });
});

// ---------------------------------------------------------------------------
// Schema validation tests
// ---------------------------------------------------------------------------

describe("schema validation", () => {
  describe("CongressTransactionSchema", () => {
    const validTx = {
      id: "tx-abc-123",
      docId: "doc-xyz-456",
      filerId: null,
      txDate: "2026-01-15",
      owner: "self",
      assetName: "Apple Inc.",
      ticker: "AAPL",
      assetType: "stock",
      txType: "P",
      amountMin: 1001,
      amountMax: 15000,
      isOption: false,
      capGainsOver200: false,
      rawText: "purchased Apple shares",
    };

    it("parses a valid transaction", () => {
      const result = CongressTransactionSchema.safeParse(validTx);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe("tx-abc-123");
        expect(result.data.ticker).toBe("AAPL");
      }
    });

    it("rejects empty id", () => {
      const result = CongressTransactionSchema.safeParse({
        ...validTx,
        id: "",
      });
      expect(result.success).toBe(false);
    });

    it("rejects missing required field (docId)", () => {
      const { docId: _, ...noDocId } = validTx;
      const result = CongressTransactionSchema.safeParse(noDocId);
      expect(result.success).toBe(false);
    });

    it("rejects invalid txType", () => {
      const result = CongressTransactionSchema.safeParse({
        ...validTx,
        txType: "X",
      });
      expect(result.success).toBe(false);
    });

    it("accepts optional fields when absent", () => {
      const result = CongressTransactionSchema.safeParse({
        ...validTx,
        fullName: undefined,
        filedDate: undefined,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("SecurityRefSchema", () => {
    const validRef = {
      ticker: "AAPL",
      companyName: "Apple Inc.",
      sector: "Technology",
      industry: "Consumer Electronics",
      assetClass: "stock",
      isEtf: false,
      isAdr: false,
      country: "US",
      stateHq: "CA",
      stateOfIncorp: "CA",
      exchange: "NASDAQ",
      exchangeShort: "NASDAQ",
      currency: "USD",
      marketCap: 3_500_000_000_000,
      marketCapBucket: "mega",
      sharesOutstanding: 15_000_000_000,
      ipoDate: "1980-12-12",
      cik: "0000320193",
      sicCode: "3571",
      sicDescription: "Electronic Computers",
      source: "enriched",
    };

    it("parses a valid security ref", () => {
      const result = SecurityRefSchema.safeParse(validRef);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.ticker).toBe("AAPL");
      }
    });

    it("rejects empty ticker", () => {
      const result = SecurityRefSchema.safeParse({
        ...validRef,
        ticker: "",
      });
      expect(result.success).toBe(false);
    });

    it("accepts null for nullable fields", () => {
      const result = SecurityRefSchema.safeParse({
        ...validRef,
        sector: null,
        marketCap: null,
      });
      expect(result.success).toBe(true);
    });

    it("accepts optional fields when absent", () => {
      const result = SecurityRefSchema.safeParse(validRef);
      // enrichedAt and currentPrice are optional, so omitted is fine
      expect(result.success).toBe(true);
    });

    it("rejects non-numeric marketCap", () => {
      const result = SecurityRefSchema.safeParse({
        ...validRef,
        marketCap: "3.5T",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("UsageTelemetryEventSchema", () => {
    const validEvent = {
      sourceApp: "congress-trade",
      provider: "cloudflare",
      service: "api-gateway",
      metricType: "usage",
      quantity: 1500,
      unit: "request",
      occurredAt: "2026-01-15T10:30:00.000Z",
    };

    it("parses a valid telemetry event", () => {
      const result = UsageTelemetryEventSchema.safeParse(validEvent);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.sourceApp).toBe("congress-trade");
        expect(result.data.billingMode).toBe("estimated"); // default
        expect(result.data.confidence).toBe("estimated"); // default
      }
    });

    it("rejects empty sourceApp", () => {
      const result = UsageTelemetryEventSchema.safeParse({
        ...validEvent,
        sourceApp: "",
      });
      expect(result.success).toBe(false);
    });

    it("rejects negative quantity", () => {
      const result = UsageTelemetryEventSchema.safeParse({
        ...validEvent,
        quantity: -1,
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid metricType", () => {
      const result = UsageTelemetryEventSchema.safeParse({
        ...validEvent,
        metricType: "invalid_type",
      });
      expect(result.success).toBe(false);
    });

    it("applies defaults for billingMode and confidence", () => {
      const result = UsageTelemetryEventSchema.safeParse(validEvent);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.billingMode).toBe("estimated");
        expect(result.data.confidence).toBe("estimated");
      }
    });
  });
});

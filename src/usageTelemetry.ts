import { z } from "zod";

export const UsageTelemetryMetricTypeSchema = z.enum([
  "usage",
  "cost",
  "quota",
  "tier",
  "health",
]);

export const UsageTelemetryUnitSchema = z.enum([
  "request",
  "call",
  "token",
  "credit",
  "usd",
  "page",
  "job",
  "document",
  "row",
  "byte",
]);

export const UsageTelemetryBillingModeSchema = z.enum([
  "actual",
  "estimated",
  "manual",
]);

export const UsageTelemetryConfidenceSchema = z.enum([
  "actual",
  "estimated",
  "manual",
]);

export const UsageTelemetryLimitWindowSchema = z.enum([
  "minute",
  "day",
  "month",
  "run",
]);

export const UsageTelemetryMetadataSchema = z.record(
  z.union([z.string(), z.number(), z.boolean(), z.null()]),
);

export const UsageTelemetryEventSchema = z.object({
  sourceApp: z.string().min(1).max(80),
  environment: z.string().min(1).max(80).optional(),
  provider: z.string().min(1).max(80),
  service: z.string().min(1).max(120).optional(),
  label: z.string().min(1).max(160).optional(),
  keyRef: z.string().min(1).max(160).optional(),
  billingMode: UsageTelemetryBillingModeSchema.default("estimated"),
  metricType: UsageTelemetryMetricTypeSchema.default("usage"),
  quantity: z.number().finite().nonnegative().optional(),
  unit: UsageTelemetryUnitSchema.optional(),
  costUsd: z.number().finite().nonnegative().optional(),
  requests: z.number().int().nonnegative().optional(),
  credits: z.number().finite().nonnegative().optional(),
  limit: z.number().finite().nonnegative().optional(),
  limitWindow: UsageTelemetryLimitWindowSchema.optional(),
  tier: z.string().min(1).max(80).optional(),
  confidence: UsageTelemetryConfidenceSchema.default("estimated"),
  windowStart: z.string().datetime().optional(),
  windowEnd: z.string().datetime().optional(),
  occurredAt: z.string().datetime().optional(),
  metadata: UsageTelemetryMetadataSchema.optional(),
  idempotencyKey: z.string().min(1).max(200).optional(),
});

export const UsageTelemetryBatchSchema = z.object({
  events: z.array(UsageTelemetryEventSchema).min(1).max(100),
});

export const UsageTelemetryIngestResponseSchema = z.object({
  ok: z.boolean(),
  accepted: z.number().int().nonnegative(),
});

export type UsageTelemetryMetricType = z.infer<typeof UsageTelemetryMetricTypeSchema>;
export type UsageTelemetryUnit = z.infer<typeof UsageTelemetryUnitSchema>;
export type UsageTelemetryBillingMode = z.infer<typeof UsageTelemetryBillingModeSchema>;
export type UsageTelemetryConfidence = z.infer<typeof UsageTelemetryConfidenceSchema>;
export type UsageTelemetryLimitWindow = z.infer<typeof UsageTelemetryLimitWindowSchema>;
export type UsageTelemetryEvent = z.infer<typeof UsageTelemetryEventSchema>;
export type UsageTelemetryBatch = z.infer<typeof UsageTelemetryBatchSchema>;
export type UsageTelemetryIngestResponse = z.infer<typeof UsageTelemetryIngestResponseSchema>;

export const API_USAGE_MONITOR_INGEST_PATH = "/api/ingest/usage";

export function usageMonitorIngestUrl(baseUrl: string): string {
  return `${baseUrl.replace(/\/+$/, "")}${API_USAGE_MONITOR_INGEST_PATH}`;
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Computes the same deterministic idempotency key the API Usage Monitor server
 * derives server-side as a fallback. Computing and attaching it here ensures
 * retries of the same event collapse to the same key instead of each retry
 * getting its own random fallback key on the server.
 */
export async function deriveUsageTelemetryIdempotencyKey(event: {
  sourceApp: string;
  provider: string;
  metricType: string;
  keyRef?: string;
  occurredAt?: string;
}): Promise<string | undefined> {
  if (!event.occurredAt) return undefined;
  const basis = [event.sourceApp, event.provider, event.metricType, event.keyRef ?? "", event.occurredAt].join("|");
  return sha256Hex(basis);
}

export interface UsageTelemetryClientOptions {
  baseUrl: string;
  token: string;
  fetchImpl?: typeof fetch;
}

export function createUsageTelemetryClient(options: UsageTelemetryClientOptions) {
  const fetchImpl = options.fetchImpl ?? fetch;
  const url = usageMonitorIngestUrl(options.baseUrl);

  return {
    async send(events: UsageTelemetryEvent[]): Promise<UsageTelemetryIngestResponse> {
      const parsed = UsageTelemetryBatchSchema.parse({ events });
      const body: UsageTelemetryBatch = {
        events: await Promise.all(
          parsed.events.map(async (event) => {
            if (event.idempotencyKey) return event;
            const idempotencyKey = await deriveUsageTelemetryIdempotencyKey(event);
            return idempotencyKey ? { ...event, idempotencyKey } : event;
          }),
        ),
      };
      const res = await fetchImpl(url, {
        method: "POST",
        headers: {
          authorization: `Bearer ${options.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = typeof payload === "object" && payload && "error" in payload
          ? String((payload as { error?: unknown }).error)
          : `HTTP ${res.status}`;
        throw new Error(`Usage telemetry ingest failed: ${message}`);
      }
      return UsageTelemetryIngestResponseSchema.parse(payload);
    },
  };
}

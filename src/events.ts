import type { CongressEvent, CongressEventType } from "./types";

/**
 * Creates a standardized CongressEvent object.
 * Automatically assigns `emittedAt` to the current ISO time if not provided.
 */
export function createCongressEvent<T = unknown>(
  type: CongressEventType | string,
  data?: T,
  options?: Omit<CongressEvent, "type" | "data">
): CongressEvent {
  const event: CongressEvent = {
    type,
    emittedAt: options?.emittedAt ?? new Date().toISOString(),
    ...options,
  };
  if (data !== undefined) {
    event.data = data;
  }
  return event;
}

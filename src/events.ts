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
  return {
    type,
    data,
    emittedAt: new Date().toISOString(),
    ...options,
  };
}

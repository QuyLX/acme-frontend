/** Per-service circuit breaker (FE §3.5 fault isolation): opens after N consecutive failures, half-opens after resetMs. */
export interface Breaker {
  canRequest(): boolean;
  success(): void;
  failure(): void;
  readonly state: 'closed' | 'open' | 'half-open';
}

export function createBreaker({ failureThreshold, resetMs, now = () => Date.now() }: { failureThreshold: number; resetMs: number; now?: () => number }): Breaker {
  let failures = 0;
  let openedAt: number | null = null;
  let state: Breaker['state'] = 'closed';
  return {
    get state() {
      return state;
    },
    canRequest() {
      if (state === 'open' && openedAt !== null && now() - openedAt >= resetMs) state = 'half-open';
      return state !== 'open';
    },
    success() {
      failures = 0;
      openedAt = null;
      state = 'closed';
    },
    failure() {
      failures++;
      if (state === 'half-open' || failures >= failureThreshold) {
        state = 'open';
        openedAt = now();
      }
    },
  };
}

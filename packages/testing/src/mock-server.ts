import type { RequestHandler } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll } from 'vitest';

/**
 * MSW server for a test file: starts before all tests, resets per-test overrides after each test, closes at the end.
 * Unhandled requests fail the test, so nothing reaches a real network. Handlers come from @platform/api-codegen.
 */
export function setupMockServer(...handlers: RequestHandler[]) {
  const server = setupServer(...handlers);
  beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
  return server;
}

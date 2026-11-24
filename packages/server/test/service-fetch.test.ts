import { describe, expect, test } from 'vitest';
import { CircuitOpenError, createServiceFetch, ServiceError, type RequestContext } from '../src/index';

const ctx: RequestContext = { tenantId: 't-1', projectId: 'p-1', region: 'r-1', actor: { id: 'u-1', kind: 'user' }, requestId: 'req-1' };
const json = (status: number, body: unknown, type = 'application/json') => new Response(JSON.stringify(body), { status, headers: { 'content-type': type } });
const identity = (raw: unknown) => raw;

describe('createServiceFetch (AC-3)', () => {
  test('sends request id, tenant, project, region and actor headers; query is encoded', async () => {
    let seen: Request | undefined;
    const call = createServiceFetch({ service: 'users', baseUrl: 'https://users.test/v1', fetchImpl: async (url, init) => ((seen = new Request(url, init)), json(200, { ok: true })) });
    await call(ctx, { method: 'GET', path: 'tenants/t-1/users', query: { page: 2, q: 'a b' } }, identity);
    expect(seen!.url).toBe('https://users.test/v1/tenants/t-1/users?page=2&q=a+b');
    expect(Object.fromEntries(['x-request-id', 'x-tenant-id', 'x-project-id', 'x-region', 'x-actor-id'].map((h) => [h, seen!.headers.get(h)]))).toEqual({
      'x-request-id': 'req-1', 'x-tenant-id': 't-1', 'x-project-id': 'p-1', 'x-region': 'r-1', 'x-actor-id': 'u-1',
    });
  });
  test('refuses a context without tenant (FE-CTX-001)', async () => {
    const call = createServiceFetch({ service: 'users', baseUrl: 'https://users.test', fetchImpl: async () => json(200, {}) });
    await expect(call({ ...ctx, tenantId: '' }, { method: 'GET', path: 'x' }, identity)).rejects.toThrow(/tenantId is required/);
  });
  test('problem+json 4xx becomes ServiceError with the problem; no retry', async () => {
    let calls = 0;
    const call = createServiceFetch({ service: 'users', baseUrl: 'https://u.test', fetchImpl: async () => (calls++, json(404, { title: 'Tenant not found', status: 404 }, 'application/problem+json')) });
    const err = await call(ctx, { method: 'GET', path: 'x' }, identity).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ServiceError);
    expect((err as ServiceError).problem?.title).toBe('Tenant not found');
    expect(calls).toBe(1);
  });
  test('times out (status 0, code timeout) and retries idempotent calls only', async () => {
    let calls = 0;
    const slow: typeof fetch = (_u, init) => new Promise((_r, reject) => { calls++; init!.signal!.addEventListener('abort', () => reject(init!.signal!.reason)); });
    const call = createServiceFetch({ service: 'users', baseUrl: 'https://u.test', timeoutMs: 20, retries: 1, fetchImpl: slow });
    const err = (await call(ctx, { method: 'GET', path: 'x' }, identity).catch((e: unknown) => e)) as ServiceError;
    expect([err.code, err.status, calls]).toEqual(['timeout', 0, 2]);
    calls = 0;
    await call(ctx, { method: 'POST', path: 'x', body: {} }, identity).catch(() => undefined);
    expect(calls).toBe(1);
  });
  test('circuit opens after N failures, fails fast, and recovers after resetMs', async () => {
    let t = 0;
    let calls = 0;
    let healthy = false;
    const call = createServiceFetch({ service: 'users', baseUrl: 'https://u.test', retries: 0, now: () => t, breaker: { failureThreshold: 2, resetMs: 1000 }, fetchImpl: async () => (calls++, healthy ? json(200, { ok: 1 }) : json(503, {})) });
    for (let i = 0; i < 2; i++) await call(ctx, { method: 'GET', path: 'x' }, identity).catch(() => undefined);
    await expect(call(ctx, { method: 'GET', path: 'x' }, identity)).rejects.toBeInstanceOf(CircuitOpenError);
    expect(calls).toBe(2);
    t = 1000;
    healthy = true;
    await expect(call(ctx, { method: 'GET', path: 'x' }, identity)).resolves.toEqual({ ok: 1 });
  });
  test('a response that fails the schema is an invalid-response ServiceError, not data', async () => {
    const call = createServiceFetch({ service: 'users', baseUrl: 'https://u.test', fetchImpl: async () => json(200, { id: 1 }) });
    const err = (await call(ctx, { method: 'GET', path: 'x' }, () => { throw new Error('bad'); }).catch((e: unknown) => e)) as ServiceError;
    expect(err.code).toBe('invalid-response');
  });
});

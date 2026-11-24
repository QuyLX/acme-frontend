import { describe, expect, test } from 'vitest';
import { cachedForTenant, createMemoryCacheBackend, tenantQueryKey, type RequestContext } from '../src/index';

const ctxFor = (tenantId: string): RequestContext => ({ tenantId, projectId: 'p', region: 'r', actor: { id: 'u', kind: 'user' }, requestId: 'q' });

describe('tenant-scoped caching (AC-5, FE-CTX-001, FE-NEXT-005)', () => {
  test('query keys always start with tenant, project and region', () => {
    expect(tenantQueryKey(ctxFor('t-1'), 'users', 2)).toEqual(['tenant', 't-1', 'project', 'p', 'region', 'r', 'users', 2]);
    expect(() => tenantQueryKey({ tenantId: '' }, 'users')).toThrow(/tenantId is required/);
  });
  test('SC-11 runtime: two tenants calling the same route never share a cached response', async () => {
    const backend = createMemoryCacheBackend();
    const load = (tenant: string) => async () => ({ owner: tenant });
    expect(await cachedForTenant(ctxFor('t-1'), ['users'], load('t-1'), { backend })).toEqual({ owner: 't-1' });
    expect(await cachedForTenant(ctxFor('t-2'), ['users'], load('t-2'), { backend })).toEqual({ owner: 't-2' });
  });
  test('cache hit within the TTL; tags are tenant-scoped', async () => {
    let t = 0;
    const backend = createMemoryCacheBackend(() => t);
    let loads = 0;
    const fn = async () => ++loads;
    await cachedForTenant(ctxFor('t-1'), ['n'], fn, { backend, revalidateSeconds: 10, tags: ['users'] });
    await cachedForTenant(ctxFor('t-1'), ['n'], fn, { backend, revalidateSeconds: 10, tags: ['users'] });
    expect(loads).toBe(1);
    await backend.invalidateTag('t:t-2:users');
    await cachedForTenant(ctxFor('t-1'), ['n'], fn, { backend, revalidateSeconds: 10 });
    expect(loads).toBe(1);
    await backend.invalidateTag('t:t-1:users');
    await cachedForTenant(ctxFor('t-1'), ['n'], fn, { backend, revalidateSeconds: 10 });
    expect(loads).toBe(2);
    t = 20_000;
    await cachedForTenant(ctxFor('t-1'), ['n'], fn, { backend, revalidateSeconds: 10 });
    expect(loads).toBe(3);
  });
});

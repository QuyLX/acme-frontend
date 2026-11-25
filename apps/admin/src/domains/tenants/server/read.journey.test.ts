import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, expect, test } from 'vitest';
import { CircuitOpenError, createTestPermissionSource, ForbiddenError } from '@platform/server';
import { handlers, scenarios } from './__generated__/tenants/msw';
import { __resetTenantsClientForTests, readTenant, readTenantList } from './read';
import type { Access } from '../../../server/access';

const base = 'http://127.0.0.1:3099';
const server = setupServer(...handlers(base, 'default'));
const knownId = '0b9e2f4c-1d1a-4a49-9a51-2f2c3d6e7a10';
const ctx = (id: string) => ({ tenantId: '00000000-0000-4000-8000-000000000001', actor: { id, kind: 'user' as const }, requestId: 'req-test' });
const grants = createTestPermissionSource({ staff: ['tenants.read'] });
const staff: Access = { ctx: ctx('staff'), permissions: grants };
const noAccess: Access = { ctx: ctx('nobody'), permissions: grants };

beforeAll(() => {
  process.env.TENANTS_BASE_URL = base;
  // MSW 3 names this option `onUnhandledFrame` (`onUnhandledRequest` is the MSW 2 name and no longer exists).
  server.listen({ onUnhandledFrame: 'error' });
});
afterEach(() => {
  server.resetHandlers(...handlers(base, 'default'));
  __resetTenantsClientForTests();
});
afterAll(() => server.close());

test('@journey:admin/tenants.list @scenario:happy @ac:AC-TN-1 staff sees the list and the detail', async () => {
  const list = await readTenantList(staff);
  expect(list.items[0]?.name).toBe('Northwind Synthetic');
  expect(await readTenant(staff, knownId)).toMatchObject({ name: 'Northwind Synthetic', status: 'active' });
});

test('@journey:admin/tenants.list @scenario:permission-denied @ac:AC-TN-2 no grant or no session is denied', async () => {
  await expect(readTenantList(noAccess)).rejects.toBeInstanceOf(ForbiddenError);
  await expect(readTenant(noAccess, knownId)).rejects.toBeInstanceOf(ForbiddenError);
  await expect(readTenantList(null)).rejects.toBeInstanceOf(ForbiddenError);
});

test('@journey:admin/tenants.list @scenario:not-found @ac:AC-TN-3 an unknown id is not found', async () => {
  server.resetHandlers(...handlers(base, 'notFound'));
  expect(await readTenant(staff, knownId)).toBeNull();
});

test('@journey:admin/tenants.list @scenario:empty an empty list has no rows and no cursor', async () => {
  server.resetHandlers(...handlers(base, 'empty'));
  expect(await readTenantList(staff)).toEqual({ items: [], nextCursor: null });
});

test('@journey:admin/tenants.list @scenario:paged the cursor reaches the second page', async () => {
  server.resetHandlers(
    http.get(`${base}/v1/tenants`, ({ request }) => {
      const cursor = new URL(request.url).searchParams.get('cursor');
      const s = cursor === 'page-2' ? scenarios.listTenants.secondPage : scenarios.listTenants.firstPage;
      return HttpResponse.json(s.body, { status: s.status });
    }),
  );
  const first = await readTenantList(staff);
  expect(first.nextCursor).toBe('page-2');
  const second = await readTenantList(staff, { cursor: first.nextCursor! });
  expect(second).toEqual({ items: [{ id: '7c4d2e1f-3a5b-4c6d-8e9f-0a1b2c3d4e5f', name: 'Contoso Synthetic', status: 'suspended' }], nextCursor: null });
});

test('the breaker opens across requests', async () => {
  let calls = 0;
  server.resetHandlers(http.get(`${base}/v1/tenants/:id`, () => { calls += 1; return new HttpResponse(null, { status: 503 }); }));
  // Default failureThreshold is 5 and a GET retries once (2 attempts, each a breaker failure). Invocations 1 and 2
  // record 4 failures; invocation 3 records the 5th on its first attempt, which opens the breaker, and its retry
  // attempt is refused with CircuitOpenError. So 3 invocations open it (5 handler calls in total).
  for (let i = 0; i < 3; i += 1) await expect(readTenant(staff, knownId)).rejects.toBeTruthy();
  const before = calls;
  await expect(readTenant(staff, knownId)).rejects.toBeInstanceOf(CircuitOpenError);
  expect(calls).toBe(before);
});

test('a missing TENANTS_BASE_URL is a configuration error', async () => {
  delete process.env.TENANTS_BASE_URL;
  await expect(readTenantList(staff)).rejects.toThrow(/TENANTS_BASE_URL/);
  process.env.TENANTS_BASE_URL = base;
});

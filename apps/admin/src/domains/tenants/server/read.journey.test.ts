import { setupServer } from 'msw/node';
import { afterAll, beforeAll, expect, test } from 'vitest';
import { handlers } from './__generated__/tenants/msw';
import { readTenant, readTenantList } from './read';

const base = 'http://127.0.0.1:3099';
const server = setupServer(...handlers(base, 'default'));
const knownId = '0b9e2f4c-1d1a-4a49-9a51-2f2c3d6e7a10';

beforeAll(() => {
  process.env.TENANTS_BASE_URL = base;
  server.listen({ onUnhandledRequest: 'error' });
});
afterAll(() => server.close());

test('@journey:admin/tenants.list @scenario:happy @ac:AC-TN-1 staff sees the list and the detail', async () => {
  const list = await readTenantList('staff');
  expect(list.kind).toBe('ok');
  if (list.kind !== 'ok') return;
  expect(list.items[0]?.name).toBe('Northwind Synthetic');
  const detail = await readTenant('staff', knownId);
  expect(detail).toMatchObject({ kind: 'ok', tenant: { name: 'Northwind Synthetic' } });
});

test('@journey:admin/tenants.list @scenario:permission-denied @ac:AC-TN-2 no-access sees a denial and no row', async () => {
  expect(await readTenantList('no-access')).toEqual({ kind: 'denied' });
  expect(await readTenant('no-access', knownId)).toEqual({ kind: 'denied' });
});

test('@journey:admin/tenants.list @scenario:not-found @ac:AC-TN-3 an unknown id is not-found', async () => {
  server.resetHandlers(...handlers(base, 'notFound'));
  expect(await readTenant('staff', knownId)).toEqual({ kind: 'not-found' });
  server.resetHandlers(...handlers(base, 'default'));
});

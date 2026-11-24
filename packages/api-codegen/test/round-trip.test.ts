// The generated client round-trips against the generated MSW handlers for every scenario (AC-1).
import { setupServer } from 'msw/node';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { createServiceFetch, ServiceError, type RequestContext } from '@platform/server';
import { createTenantsClient } from './__generated__/tenants/client';
import { handlers, scenarios } from './__generated__/tenants/msw';

const base = 'https://tenants.test';
const ctx: RequestContext = { tenantId: '0b9e2f4c-1d1a-4a49-9a51-2f2c3d6e7a10', actor: { id: 'u-1', kind: 'user' }, requestId: 'req-1' };
const server = setupServer();
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
afterAll(() => server.close());
const client = (scenario = 'default') => {
  server.resetHandlers(...handlers(base, scenario));
  return createTenantsClient(createServiceFetch({ service: 'tenants', baseUrl: base, retries: 0 }));
};
const tenantId = ctx.tenantId;

describe('generated client ↔ generated MSW handlers', () => {
  test('default scenarios validate through the zod schemas', async () => {
    expect(await client().listTenants(ctx)).toEqual(scenarios.listTenants.default.body);
    expect(await client().getTenant(ctx, { path: { tenantId } })).toEqual(scenarios.getTenant.default.body);
    expect(await client().listUsers(ctx, { path: { tenantId }, query: { status: 'active' } })).toEqual(scenarios.listUsers.default.body);
    expect(await client().createUser(ctx, { path: { tenantId }, body: { email: 'grace@example.invalid', displayName: 'Grace Example', role: 'member' } })).toEqual(scenarios.createUser.default.body);
  });
  test('named scenarios: empty page, 404 and 422 problems', async () => {
    expect((await client('empty').listTenants(ctx)).items).toEqual([]);
    const nf = (await client('notFound').getTenant(ctx, { path: { tenantId } }).catch((e: unknown) => e)) as ServiceError;
    expect([nf.status, nf.problem?.title]).toEqual([404, 'Tenant not found']);
    const taken = (await client('emailTaken').createUser(ctx, { path: { tenantId }, body: { email: 'a@example.invalid', displayName: 'A', role: 'member' } }).catch((e: unknown) => e)) as ServiceError;
    expect(taken.status).toBe(422);
  });
  test('an invalid request body is rejected before any network call', async () => {
    await expect(client().createUser(ctx, { path: { tenantId }, body: { email: 'not-an-email', displayName: 'A', role: 'member' } })).rejects.toThrow();
  });
});

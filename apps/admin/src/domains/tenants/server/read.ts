import 'server-only';
import { createServiceFetch, ForbiddenError, requirePermission, ServiceError } from '@platform/server';
import type { Access } from '../../../server/access';
import { createTenantsClient } from './__generated__/tenants/client';

export type TenantRow = { id: string; name: string; status: 'active' | 'suspended' };
export type TenantPage = { items: TenantRow[]; nextCursor: string | null };

const READ = 'tenants.read';
let client: ReturnType<typeof createTenantsClient> | null = null;

/** One client per server process, so the per-service circuit breaker sees every request (FE §3.5). */
function tenants() {
  if (client) return client;
  const baseUrl = process.env.TENANTS_BASE_URL;
  if (!baseUrl) throw new Error('TENANTS_BASE_URL is not set: the tenants service URL is required');
  client = createTenantsClient(createServiceFetch({ service: 'tenants', baseUrl }));
  return client;
}

export function __resetTenantsClientForTests(): void {
  client = null;
}

/** Authorization in the data-access layer (FE-NEXT-003). No access → ForbiddenError. */
export async function requireTenantsRead(access: Access | null): Promise<void> {
  if (!access) throw new ForbiddenError(READ);
  await requirePermission(access.ctx, access.permissions, READ);
}

const row = (t: { id: string; name: string; status: 'active' | 'suspended' }): TenantRow => ({ id: t.id, name: t.name, status: t.status });

export async function readTenantList(access: Access | null, q: { cursor?: string; pageSize?: number } = {}): Promise<TenantPage> {
  await requireTenantsRead(access);
  const page = await tenants().listTenants(access!.ctx, { query: { cursor: q.cursor, pageSize: q.pageSize } });
  return { items: page.items.map(row), nextCursor: page.nextCursor ?? null };
}

export async function readTenant(access: Access | null, tenantId: string): Promise<TenantRow | null> {
  await requireTenantsRead(access);
  try {
    return row(await tenants().getTenant(access!.ctx, { path: { tenantId } }));
  } catch (err) {
    if (err instanceof ServiceError && err.status === 404) return null;
    throw err;
  }
}

import 'server-only';
import {
  contextFromSession,
  createServiceFetch,
  createTestSessionProvider,
  ServiceError,
  type Session,
} from '@platform/server';
import { createTenantsClient } from './__generated__/tenants/client';

/** Staff caller scope for the service header. Not a customer tenant id. Replaced when D-03 lands. */
const STAFF: Session = {
  actor: { id: 'actor-staff-synthetic', kind: 'user' },
  tenantId: '00000000-0000-4000-8000-000000000001',
  expiresAt: '2099-01-01T00:00:00.000Z',
};

export type Persona = 'staff' | 'no-access';

export function sessionFor(persona: Persona): Session | null {
  return persona === 'staff' ? STAFF : null;
}

function tenants() {
  const baseUrl = process.env.TENANTS_BASE_URL ?? 'http://127.0.0.1:3099';
  return createTenantsClient(createServiceFetch({ service: 'tenants', baseUrl, retries: 0 }));
}

async function contextFor(persona: Persona) {
  const session = await createTestSessionProvider(sessionFor(persona)).getSession();
  if (!session) return null;
  return contextFromSession(session);
}

export type TenantRow = { id: string; name: string; status: string };

export type TenantList = { kind: 'denied' } | { kind: 'ok'; items: TenantRow[] };

export async function readTenantList(persona: Persona): Promise<TenantList> {
  const ctx = await contextFor(persona);
  if (!ctx) return { kind: 'denied' };
  const page = await tenants().listTenants(ctx);
  return { kind: 'ok', items: page.items.map((item) => ({ id: item.id, name: item.name, status: item.status })) };
}

export type TenantDetail = { kind: 'denied' } | { kind: 'not-found' } | { kind: 'ok'; tenant: TenantRow };

export async function readTenant(persona: Persona, tenantId: string): Promise<TenantDetail> {
  const ctx = await contextFor(persona);
  if (!ctx) return { kind: 'denied' };
  try {
    const tenant = await tenants().getTenant(ctx, { path: { tenantId } });
    return { kind: 'ok', tenant: { id: tenant.id, name: tenant.name, status: tenant.status } };
  } catch (err) {
    if (err instanceof ServiceError && err.status === 404) return { kind: 'not-found' };
    throw err;
  }
}

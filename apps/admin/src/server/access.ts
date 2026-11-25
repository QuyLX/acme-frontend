// Who is calling and what they may do. Until @platform/auth exists (D-03) there is no real session: mode `none` denies
// everything; mode `fixture` (local runs and tests only) reads a synthetic persona from a cookie. Deny by default.
import 'server-only';
import { contextFromSession, createTestPermissionSource, type PermissionSource, type RequestContext, type Session } from '@platform/server';

export type SessionMode = 'none' | 'fixture';
export type Persona = 'staff' | 'no-access';
export type Access = { ctx: RequestContext; permissions: PermissionSource };
export const FIXTURE_PERSONA_COOKIE = 'fixture_persona';

/** Staff scope sent to the tenants service. Synthetic; not a customer tenant id. */
const STAFF_SCOPE = '00000000-0000-4000-8000-000000000001';
const PERSONAS: Record<Persona, Session> = {
  staff: { actor: { id: 'actor-staff-synthetic', kind: 'user' }, tenantId: STAFF_SCOPE, expiresAt: '2099-01-01T00:00:00.000Z' },
  'no-access': { actor: { id: 'actor-no-access-synthetic', kind: 'user' }, tenantId: STAFF_SCOPE, expiresAt: '2099-01-01T00:00:00.000Z' },
};
const fixturePermissions = createTestPermissionSource({ 'actor-staff-synthetic': ['tenants.read'] });

export function sessionMode(env: NodeJS.ProcessEnv = process.env): SessionMode {
  if (env.ADMIN_SESSION_MODE !== 'fixture') return 'none';
  if (env.NODE_ENV === 'production') throw new Error('ADMIN_SESSION_MODE=fixture is not allowed when NODE_ENV=production');
  return 'fixture';
}

export function accessFrom(cookies: { get(name: string): { value: string } | undefined }, env: NodeJS.ProcessEnv = process.env): Access | null {
  if (sessionMode(env) !== 'fixture') return null;
  const persona = cookies.get(FIXTURE_PERSONA_COOKIE)?.value;
  if (persona !== 'staff' && persona !== 'no-access') return null;
  return { ctx: contextFromSession(PERSONAS[persona]), permissions: fixturePermissions };
}

// Fail at module load (server start) rather than on the first request.
sessionMode();

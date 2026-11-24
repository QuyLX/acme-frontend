import type { Session } from '@platform/server';

/** Synthetic personas for permission-sensitive tests (FE §8.4 authz.permission-matrix). Never real identities. */
export const personas = {
  tenantOwner: { actor: { id: 'persona:tenant-owner', kind: 'user' }, tenantId: '00000001-0000-4000-8000-000000000001' },
  tenantMember: { actor: { id: 'persona:tenant-member', kind: 'user' }, tenantId: '00000001-0000-4000-8000-000000000001' },
  otherTenantOwner: { actor: { id: 'persona:other-tenant-owner', kind: 'user' }, tenantId: '00000002-0000-4000-8000-000000000002' },
} as const satisfies Record<string, Omit<Session, 'expiresAt'>>;

export type PersonaName = keyof typeof personas;

/** A session for the persona that expires one hour after `now`. */
export function sessionFor(name: PersonaName, now: Date = new Date()): Session {
  return { ...personas[name], actor: { ...personas[name].actor }, expiresAt: new Date(now.getTime() + 3_600_000).toISOString() };
}

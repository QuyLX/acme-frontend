/** Who is acting. `service` actors are other backends, never end users. */
export interface Actor {
  id: string;
  kind: 'user' | 'service';
}

/** Everything a server-side call needs to scope data and correlate logs (FE §3.5, FE-CTX-001). */
export interface RequestContext {
  tenantId: string;
  projectId?: string;
  region?: string;
  actor: Actor;
  requestId: string;
}

/** A server-side session. Tokens never leave the server; the browser only holds a session cookie (FE §3.5). */
export interface Session {
  actor: Actor;
  tenantId: string;
  expiresAt: string;
}

/** Source of the current session. `@platform/auth` (D-03, deferred) will implement it against the chosen IdP. */
export interface SessionProvider {
  getSession(): Promise<Session | null>;
}

/** Test double: always returns the given session (or none). Never use outside tests and local mocks. */
export function createTestSessionProvider(session: Session | null): SessionProvider {
  return { getSession: async () => session };
}

export function newRequestId(): string {
  return crypto.randomUUID();
}

/** Builds a RequestContext from a valid session; throws if the session is missing or expired. */
export function contextFromSession(session: Session | null, extra: { projectId?: string; region?: string; requestId?: string; now?: Date } = {}): RequestContext {
  if (!session) throw new Error('no session');
  if (new Date(session.expiresAt) <= (extra.now ?? new Date())) throw new Error('session expired');
  if (!session.tenantId) throw new Error('session has no tenant');
  return { tenantId: session.tenantId, projectId: extra.projectId, region: extra.region, actor: session.actor, requestId: extra.requestId ?? newRequestId() };
}

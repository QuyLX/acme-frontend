import type { ZodType } from 'zod';
import { contextFromSession, type RequestContext, type SessionProvider } from './context';
import { ServiceError } from './errors';

export interface AuditEvent {
  action: string;
  requestId: string;
  actorId: string | null;
  tenantId: string | null;
  outcome: 'ok' | 'unauthenticated' | 'forbidden' | 'invalid-origin' | 'invalid-input' | 'failed';
  at: string;
}

export type MutationResult<O> =
  | { ok: true; data: O }
  | { ok: false; error: { code: Exclude<AuditEvent['outcome'], 'ok'>; message: string; fields?: Record<string, string> } };

export interface MutationDeps {
  sessions: SessionProvider;
  /** Request headers (in Next.js: `headers()` from next/headers). */
  headers: () => Promise<Headers>;
  /** Exact origins allowed to call mutations (origin/CSRF check). */
  allowedOrigins: string[];
  audit?: (e: AuditEvent) => void;
  now?: () => Date;
}

/**
 * The only way to define a server action (FE-NEXT-002): authentication, origin/CSRF check, input validation,
 * server-side authorization (FE-NEXT-003) and an audit event with the request id. Returns DTOs only (FE-NEXT-004):
 * errors carry a code and a safe message, never stack traces or upstream bodies.
 */
export function defineMutation<I, O>(
  def: { name: string; input: ZodType<I>; authorize: (ctx: RequestContext, input: I) => boolean | Promise<boolean>; handler: (ctx: RequestContext, input: I) => Promise<O> },
  deps: MutationDeps,
): (raw: unknown) => Promise<MutationResult<O>> {
  return async (raw) => {
    const now = deps.now?.() ?? new Date();
    const headers = await deps.headers();
    const requestId = headers.get('x-request-id') ?? crypto.randomUUID();
    let ctx: RequestContext | null = null;
    const finish = <R extends MutationResult<O>>(result: R): R => {
      deps.audit?.({ action: def.name, requestId, actorId: ctx?.actor.id ?? null, tenantId: ctx?.tenantId ?? null, outcome: result.ok ? 'ok' : result.error.code, at: now.toISOString() });
      return result;
    };
    const fail = (code: Exclude<AuditEvent['outcome'], 'ok'>, message: string, fields?: Record<string, string>) => finish({ ok: false as const, error: { code, message, ...(fields ? { fields } : {}) } });

    const origin = headers.get('origin');
    if (!origin || !deps.allowedOrigins.includes(origin)) return fail('invalid-origin', 'Request origin is not allowed.');
    try {
      ctx = contextFromSession(await deps.sessions.getSession(), { requestId, now });
    } catch {
      return fail('unauthenticated', 'Sign in again to continue.');
    }
    const parsed = def.input.safeParse(raw);
    if (!parsed.success) {
      const fields = Object.fromEntries(parsed.error.issues.map((i) => [i.path.join('.') || '_', i.message]));
      return fail('invalid-input', 'Some fields are invalid.', fields);
    }
    if (!(await def.authorize(ctx, parsed.data))) return fail('forbidden', 'You are not allowed to do this.');
    try {
      return finish({ ok: true as const, data: await def.handler(ctx, parsed.data) });
    } catch (err) {
      const message = err instanceof ServiceError && err.status >= 400 && err.status < 500 && err.problem?.title ? err.problem.title : 'The action failed. Try again later.';
      return fail('failed', message);
    }
  };
}

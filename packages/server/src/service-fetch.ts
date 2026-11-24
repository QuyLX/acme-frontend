import { createBreaker, type Breaker } from './breaker';
import type { RequestContext } from './context';
import { CircuitOpenError, parseProblem, ServiceError } from './errors';

export interface ServiceFetchOptions {
  service: string;
  baseUrl: string;
  /** Per-attempt timeout; default 5000 ms. */
  timeoutMs?: number;
  /** Retries for idempotent operations only (GET or `idempotent: true`); default 1. */
  retries?: number;
  breaker?: { failureThreshold: number; resetMs: number };
  fetchImpl?: typeof fetch;
  now?: () => number;
}

export interface Operation {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** Path with parameters already substituted and encoded. */
  path: string;
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  idempotent?: boolean;
}

/** A bound service call: the generated clients from @platform/api-codegen take one of these. */
export type ServiceCall = <T>(ctx: RequestContext, op: Operation, parse: (raw: unknown) => T) => Promise<T>;

/**
 * Server-side service calls (FE §3.5): request id, tenant/project/region and actor headers on every call, per-attempt
 * timeout, retries for idempotent operations, per-service circuit breaker, problem+json → ServiceError, response
 * validated by `parse` (the generated zod schema). Never logs bodies.
 */
export function createServiceFetch(o: ServiceFetchOptions): ServiceCall {
  const doFetch = o.fetchImpl ?? fetch;
  const breaker: Breaker = createBreaker({ ...(o.breaker ?? { failureThreshold: 5, resetMs: 30_000 }), now: o.now });
  const timeoutMs = o.timeoutMs ?? 5000;

  return async function call<T>(ctx: RequestContext, op: Operation, parse: (raw: unknown) => T): Promise<T> {
    if (!ctx.tenantId) throw new Error('RequestContext.tenantId is required for service calls (FE-CTX-001)');
    const url = new URL(op.path, o.baseUrl.endsWith('/') ? o.baseUrl : `${o.baseUrl}/`);
    for (const [k, v] of Object.entries(op.query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v));
    const headers: Record<string, string> = {
      accept: 'application/json, application/problem+json',
      'x-request-id': ctx.requestId,
      'x-tenant-id': ctx.tenantId,
      'x-actor-id': ctx.actor.id,
    };
    if (ctx.projectId) headers['x-project-id'] = ctx.projectId;
    if (ctx.region) headers['x-region'] = ctx.region;
    if (op.body !== undefined) headers['content-type'] = 'application/json';
    const idempotent = op.method === 'GET' || op.idempotent === true;
    const attempts = 1 + (idempotent ? (o.retries ?? 1) : 0);

    let last: ServiceError | undefined;
    for (let attempt = 1; attempt <= attempts; attempt++) {
      if (!breaker.canRequest()) throw new CircuitOpenError(o.service);
      let res: Response;
      try {
        res = await doFetch(url, { method: op.method, headers, body: op.body === undefined ? undefined : JSON.stringify(op.body), signal: AbortSignal.timeout(timeoutMs) });
      } catch (err) {
        breaker.failure();
        const timeout = err instanceof DOMException && (err.name === 'TimeoutError' || err.name === 'AbortError');
        last = new ServiceError(o.service, 0, ctx.requestId, undefined, timeout ? 'timeout' : 'network');
        continue;
      }
      if (res.status >= 500) {
        breaker.failure();
        last = new ServiceError(o.service, res.status, ctx.requestId, await parseProblem(res));
        continue;
      }
      breaker.success();
      if (!res.ok) throw new ServiceError(o.service, res.status, ctx.requestId, await parseProblem(res));
      const raw: unknown = res.status === 204 ? undefined : await res.json();
      try {
        return parse(raw);
      } catch {
        throw new ServiceError(o.service, res.status, ctx.requestId, undefined, 'invalid-response');
      }
    }
    throw last ?? new ServiceError(o.service, 0, ctx.requestId, undefined, 'network');
  };
}

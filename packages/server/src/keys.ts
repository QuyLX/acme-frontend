// Client-safe cache keys (FE-CTX-001). No `server-only` import: client components build TanStack Query keys here.
import type { RequestContext } from './context';

export type Scope = Pick<RequestContext, 'tenantId' | 'projectId' | 'region'>;

/**
 * Cache key for client queries and server caches (FE-CTX-001): always starts with tenant, project and region, so two
 * tenants can never share an entry. Lint rule `@acme/tenant-query-key` requires every queryKey to come from here.
 */
export function tenantQueryKey(scope: Scope, ...parts: Array<string | number>): readonly unknown[] {
  if (!scope.tenantId) throw new Error('tenantQueryKey: tenantId is required (FE-CTX-001)');
  return Object.freeze(['tenant', scope.tenantId, 'project', scope.projectId ?? '-', 'region', scope.region ?? '-', ...parts]);
}

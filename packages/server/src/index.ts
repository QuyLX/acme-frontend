// @platform/server — server layer of every authenticated app (FE §3.5). Server-only: importing it from a Client
// Component fails the build. Authentication is an interface here; @platform/auth (D-03) is deferred.
import 'server-only';

export { contextFromSession, createTestSessionProvider, newRequestId } from './context';
export type { Actor, RequestContext, Session, SessionProvider } from './context';
export { CircuitOpenError, ServiceError } from './errors';
export type { Problem } from './errors';
export { createBreaker } from './breaker';
export type { Breaker } from './breaker';
export { createServiceFetch } from './service-fetch';
export type { Operation, ServiceCall, ServiceFetchOptions } from './service-fetch';
export { defineMutation } from './mutation';
export type { AuditEvent, MutationDeps, MutationResult } from './mutation';
export { cachedForTenant, createMemoryCacheBackend, tenantTag } from './cache';
export { tenantQueryKey } from './keys';
export type { CacheBackend } from './cache';

import type { RequestContext } from './context';

import { tenantQueryKey, type Scope } from './keys';

/** Storage behind cachedForTenant. The app template wires Next.js's data cache; tests use the memory backend. */
export interface CacheBackend {
  get(key: string): Promise<{ value: unknown; expiresAt: number } | undefined>;
  set(key: string, value: unknown, o: { ttlMs: number; tags: string[] }): Promise<void>;
  invalidateTag(tag: string): Promise<void>;
}

export function createMemoryCacheBackend(now: () => number = () => Date.now()): CacheBackend {
  const entries = new Map<string, { value: unknown; expiresAt: number; tags: string[] }>();
  return {
    async get(key) {
      const e = entries.get(key);
      if (!e) return undefined;
      if (e.expiresAt <= now()) {
        entries.delete(key);
        return undefined;
      }
      return { value: e.value, expiresAt: e.expiresAt };
    },
    async set(key, value, { ttlMs, tags }) {
      entries.set(key, { value, expiresAt: now() + ttlMs, tags });
    },
    async invalidateTag(tag) {
      for (const [k, e] of entries) if (e.tags.includes(tag)) entries.delete(k);
    },
  };
}

/** Tags are scoped to the tenant: invalidating `users` for one tenant never touches another tenant's entries. */
export function tenantTag(scope: Scope, tag: string): string {
  return `t:${scope.tenantId}:${tag}`;
}

/** The only way to use the server data cache in authenticated rendering (FE-NEXT-005). */
export async function cachedForTenant<T>(ctx: RequestContext, keyParts: string[], fn: () => Promise<T>, o: { revalidateSeconds?: number; tags?: string[]; backend: CacheBackend }): Promise<T> {
  const key = JSON.stringify(tenantQueryKey(ctx, ...keyParts));
  const hit = await o.backend.get(key);
  if (hit) return hit.value as T;
  const value = await fn();
  await o.backend.set(key, value, { ttlMs: (o.revalidateSeconds ?? 60) * 1000, tags: [`t:${ctx.tenantId}`, ...(o.tags ?? []).map((t) => tenantTag(ctx, t))] });
  return value;
}

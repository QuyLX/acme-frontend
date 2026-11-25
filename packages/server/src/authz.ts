// Server-side authorization (FE §3.5, FE-NEXT-003, FE-PERM-001). Permissions come from the backend; the browser only
// sees the outcome. Deny by default: no source, no grant.
import type { RequestContext } from './context';

export interface PermissionSource {
  /** True only when `permission` is granted to ctx.actor in ctx.tenantId. */
  has(ctx: RequestContext, permission: string): Promise<boolean>;
}

export class ForbiddenError extends Error {
  readonly permission: string;
  constructor(permission: string) {
    super(`forbidden: ${permission}`);
    this.name = 'ForbiddenError';
    this.permission = permission;
  }
}

export async function requirePermission(ctx: RequestContext, source: PermissionSource | undefined, permission: string): Promise<void> {
  if (!source || !(await source.has(ctx, permission))) throw new ForbiddenError(permission);
}

/** Test double keyed by actor id. Never use outside tests and fixture mode. */
export function createTestPermissionSource(grants: Readonly<Record<string, readonly string[]>>): PermissionSource {
  return { has: async (ctx, permission) => (grants[ctx.actor.id] ?? []).includes(permission) };
}

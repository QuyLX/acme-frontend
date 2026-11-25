import { expect, test } from 'vitest';
import { createTestPermissionSource, ForbiddenError, requirePermission } from '../src/authz';
import type { RequestContext } from '../src/context';

const ctx: RequestContext = { tenantId: 't1', actor: { id: 'a1', kind: 'user' }, requestId: 'r1' };

test('no source denies (deny by default)', async () => {
  await expect(requirePermission(ctx, undefined, 'tenants.read')).rejects.toBeInstanceOf(ForbiddenError);
});
test('a grant for another actor denies', async () => {
  const source = createTestPermissionSource({ other: ['tenants.read'] });
  await expect(requirePermission(ctx, source, 'tenants.read')).rejects.toMatchObject({ permission: 'tenants.read' });
});
test('a matching grant allows', async () => {
  const source = createTestPermissionSource({ a1: ['tenants.read'] });
  await expect(requirePermission(ctx, source, 'tenants.read')).resolves.toBeUndefined();
});
test('a different permission denies', async () => {
  const source = createTestPermissionSource({ a1: ['tenants.read'] });
  await expect(requirePermission(ctx, source, 'tenants.write')).rejects.toBeInstanceOf(ForbiddenError);
});

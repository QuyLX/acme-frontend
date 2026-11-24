import { describe, expect, test } from 'vitest';
import { z } from 'zod';
import { createTestSessionProvider, defineMutation, ServiceError, type AuditEvent } from '../src/index';

const session = { actor: { id: 'u-1', kind: 'user' as const }, tenantId: 't-1', expiresAt: '2999-01-01T00:00:00Z' };
function setup({ origin = 'https://admin.test', sess = session as typeof session | null, allow = true, fail = undefined as Error | undefined } = {}) {
  const audit: AuditEvent[] = [];
  const rename = defineMutation(
    {
      name: 'tenant.rename',
      input: z.object({ name: z.string().min(2) }),
      authorize: async () => allow,
      handler: async (ctx, input) => {
        if (fail) throw fail;
        return { id: ctx.tenantId, name: input.name };
      },
    },
    { sessions: createTestSessionProvider(sess), headers: async () => new Headers({ origin, 'x-request-id': 'req-9' }), allowedOrigins: ['https://admin.test'], audit: (e) => audit.push(e) },
  );
  return { rename, audit };
}

describe('defineMutation (AC-4)', () => {
  test('happy path returns the DTO and audits ok with the request id', async () => {
    const { rename, audit } = setup();
    expect(await rename({ name: 'Acme' })).toEqual({ ok: true, data: { id: 't-1', name: 'Acme' } });
    expect(audit[0]).toMatchObject({ action: 'tenant.rename', requestId: 'req-9', actorId: 'u-1', tenantId: 't-1', outcome: 'ok' });
  });
  test('foreign origin is rejected before anything else (CSRF)', async () => {
    expect((await setup({ origin: 'https://evil.test' }).rename({ name: 'Acme' })).ok).toBe(false);
    const r = await setup({ origin: 'https://evil.test' }).rename({ name: 'Acme' });
    expect(!r.ok && r.error.code).toBe('invalid-origin');
  });
  test('no session or an expired session → unauthenticated', async () => {
    const r1 = await setup({ sess: null }).rename({ name: 'Acme' });
    const r2 = await setup({ sess: { ...session, expiresAt: '2000-01-01T00:00:00Z' } }).rename({ name: 'Acme' });
    expect([!r1.ok && r1.error.code, !r2.ok && r2.error.code]).toEqual(['unauthenticated', 'unauthenticated']);
  });
  test('invalid input returns field errors; unauthorized actor → forbidden', async () => {
    const r1 = await setup().rename({ name: 'A' });
    expect(!r1.ok && r1.error.code).toBe('invalid-input');
    expect(!r1.ok && Object.keys(r1.error.fields ?? {})).toEqual(['name']);
    const r2 = await setup({ allow: false }).rename({ name: 'Acme' });
    expect(!r2.ok && r2.error.code).toBe('forbidden');
  });
  test('handler errors never leak internals; a 4xx problem title is passed through', async () => {
    const r1 = await setup({ fail: new Error('db password=hunter2 at /srv/app.js:1') }).rename({ name: 'Acme' });
    expect(!r1.ok && r1.error.message).toBe('The action failed. Try again later.');
    const r2 = await setup({ fail: new ServiceError('tenants', 409, 'req-9', { title: 'Name already taken' }) }).rename({ name: 'Acme' });
    expect(!r2.ok && r2.error.message).toBe('Name already taken');
  });
});

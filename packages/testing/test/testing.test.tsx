import { useQuery } from '@tanstack/react-query';
import { cleanup, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { afterEach, describe, expect, test } from 'vitest';
import { tenantQueryKey } from '@platform/server/keys';
import { axeViolations, createBuilders, personas, renderWithProviders, sessionFor, setupMockServer } from '../src/index';

afterEach(() => cleanup());
const b = createBuilders();
const server = setupMockServer(http.get('https://svc.test/users', () => HttpResponse.json([b.user({ displayName: 'Ada Synthetic' })])));
const scope = { tenantId: personas.tenantOwner.tenantId };

function Users() {
  const q = useQuery({ queryKey: tenantQueryKey(scope, 'users'), queryFn: async () => (await fetch('https://svc.test/users')).json() as Promise<Array<{ displayName: string }>> });
  if (q.isError) return <p role="alert">failed</p>;
  return <ul>{q.data?.map((u) => <li key={u.displayName}>{u.displayName}</li>)}</ul>;
}

describe('@platform/testing', () => {
  test('renderWithProviders + mock server: a query resolves from MSW, with a tenant-scoped key', async () => {
    const { queryClient } = renderWithProviders(<Users />);
    expect(await screen.findByText('Ada Synthetic')).toBeTruthy();
    expect(queryClient.getQueryCache().getAll()[0]!.queryKey.slice(0, 2)).toEqual(['tenant', scope.tenantId]);
  });
  test('per-test overrides reset after the test; queries do not retry', async () => {
    server.use(http.get('https://svc.test/users', () => new HttpResponse(null, { status: 500 })));
    renderWithProviders(<Users />);
    await waitFor(() => expect(screen.getByRole('alert')).toBeTruthy());
  });
  test('builders are deterministic and synthetic', () => {
    const a = createBuilders(7).user();
    const c = createBuilders(7).user();
    expect(a).toEqual(c);
    expect(a.email).toMatch(/@example\.invalid$/);
  });
  test('personas: different tenants for the cross-tenant persona; sessions expire', () => {
    expect(personas.otherTenantOwner.tenantId).not.toBe(personas.tenantOwner.tenantId);
    const s = sessionFor('tenantMember', new Date('2026-11-24T00:00:00Z'));
    expect(s.expiresAt).toBe('2026-11-24T01:00:00.000Z');
  });
  test('axeViolations finds an unlabeled input and passes a labeled one', async () => {
    const bad = renderWithProviders(<input />);
    expect((await axeViolations(bad.container)).join()).toMatch(/label/);
    cleanup();
    const ok = renderWithProviders(<label>Name<input /></label>);
    expect(await axeViolations(ok.container)).toEqual([]);
  });
});

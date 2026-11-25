import { describe, expect, test } from 'vitest';
import { accessFrom, FIXTURE_PERSONA_COOKIE, sessionMode } from './access';

const jar = (value?: string) => ({ get: (name: string) => (name === FIXTURE_PERSONA_COOKIE && value !== undefined ? { value } : undefined) });
const fixture = { ADMIN_SESSION_MODE: 'fixture', NODE_ENV: 'development' } as NodeJS.ProcessEnv;

describe('sessionMode', () => {
  test('defaults to none', () => expect(sessionMode({} as NodeJS.ProcessEnv)).toBe('none'));
  test('fixture is refused in production', () =>
    expect(() => sessionMode({ ADMIN_SESSION_MODE: 'fixture', NODE_ENV: 'production' } as NodeJS.ProcessEnv)).toThrow(/ADMIN_SESSION_MODE=fixture/));
  test('unknown mode is none', () => expect(sessionMode({ ADMIN_SESSION_MODE: 'idp', NODE_ENV: 'test' } as NodeJS.ProcessEnv)).toBe('none'));
});

describe('accessFrom (deny by default)', () => {
  test('mode none → null even with a staff cookie', () => expect(accessFrom(jar('staff'), {} as NodeJS.ProcessEnv)).toBeNull());
  test('fixture, no cookie → null', () => expect(accessFrom(jar(), fixture)).toBeNull());
  test('fixture, unknown persona → null', () => expect(accessFrom(jar('root'), fixture)).toBeNull());
  test('fixture, no-access → context without tenants.read', async () => {
    const a = accessFrom(jar('no-access'), fixture);
    expect(a).not.toBeNull();
    expect(await a!.permissions.has(a!.ctx, 'tenants.read')).toBe(false);
  });
  test('fixture, staff → tenants.read granted', async () => {
    const a = accessFrom(jar('staff'), fixture);
    expect(await a!.permissions.has(a!.ctx, 'tenants.read')).toBe(true);
  });
});

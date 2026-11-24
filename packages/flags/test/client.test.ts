import {
  OpenFeature,
  TypedInMemoryProvider,
  type EvaluationContext,
  type Provider,
  type ResolutionDetails,
  type JsonValue,
} from '@openfeature/server-sdk';
import { afterAll, describe, expect, test } from 'vitest';
import { UnregisteredFlagError, createFlags, type FlagDefinition } from '../src/index';

const defs: FlagDefinition[] = [
  { key: 'tenants.bulk-invite', owner: 'team-tenants', default: false, fallback: false, safeState: 'off', expires: '2027-03-31' },
  { key: 'users.step-up', owner: 'team-identity', default: true, fallback: true, safeState: 'on', expires: '2027-03-31', gatesSecuritySensitive: true },
  { key: 'tenants.new-list', owner: 'team-tenants', default: true, fallback: false, safeState: 'off', expires: '2027-03-31' },
];

// A provider whose backend is down: every resolution throws.
class FailingProvider implements Provider {
  readonly metadata = { name: 'failing' } as const;
  readonly runsOn = 'server' as const;
  private fail(): never {
    throw new Error('flag backend unavailable (synthetic)');
  }
  resolveBooleanEvaluation(): Promise<ResolutionDetails<boolean>> {
    return Promise.reject(new Error('flag backend unavailable (synthetic)'));
  }
  resolveStringEvaluation(): Promise<ResolutionDetails<string>> {
    return this.fail();
  }
  resolveNumberEvaluation(): Promise<ResolutionDetails<number>> {
    return this.fail();
  }
  resolveObjectEvaluation<T extends JsonValue>(): Promise<ResolutionDetails<T>> {
    return this.fail();
  }
}

afterAll(async () => {
  await OpenFeature.close();
});

const inMemory = async (domain: string) => {
  await OpenFeature.setProviderAndWait(
    domain,
    new TypedInMemoryProvider({
      'tenants.bulk-invite': {
        variants: { on: true, off: false },
        defaultVariant: 'off',
        disabled: false,
        contextEvaluator: (ctx: EvaluationContext) => (ctx.tenantId === 't-beta' ? 'on' : 'off'),
      },
      'users.step-up': { variants: { on: true, off: false }, defaultVariant: 'on', disabled: false },
    }),
  );
  return createFlags(defs, OpenFeature.getClient(domain));
};

describe('createFlags (AC-7)', () => {
  test('evaluates registered flags through OpenFeature, including targeting by context', async () => {
    const flags = await inMemory('in-memory');
    expect(await flags.isEnabled('tenants.bulk-invite', { tenantId: 't-001' })).toBe(false);
    expect(await flags.isEnabled('tenants.bulk-invite', { tenantId: 't-beta' })).toBe(true);
    expect(await flags.isEnabled('users.step-up')).toBe(true);
  });

  test('an unregistered key throws, even when the provider knows it', async () => {
    const flags = await inMemory('in-memory-unregistered');
    await expect(flags.isEnabled('not.registered')).rejects.toThrow(UnregisteredFlagError);
    await expect(flags.isEnabled('not.registered')).rejects.toThrow(/"not\.registered" is not registered/);
  });

  test('a flag the provider does not know returns its registry default', async () => {
    const flags = await inMemory('in-memory-missing');
    expect(await flags.isEnabled('tenants.new-list')).toBe(true);
  });

  test('a provider error returns the fallback, never undefined', async () => {
    await OpenFeature.setProviderAndWait('failing', new FailingProvider());
    const flags = createFlags(defs, OpenFeature.getClient('failing'));
    expect(await flags.isEnabled('tenants.new-list')).toBe(false);
    expect(await flags.isEnabled('users.step-up')).toBe(true);
    expect(await flags.isEnabled('tenants.bulk-invite')).toBe(false);
  });

  test('a client that throws also yields the fallback', async () => {
    const flags = createFlags(defs, { getBooleanDetails: () => Promise.reject(new Error('synthetic')) });
    expect(await flags.isEnabled('users.step-up')).toBe(true);
  });

  test('duplicate keys are rejected at creation', () => {
    const def: FlagDefinition = { key: 'dup', owner: 'team-x', default: false, fallback: false, safeState: 'off', expires: '2027-03-31' };
    expect(() => createFlags([def, { ...def }], OpenFeature.getClient())).toThrow(/duplicate flag key "dup"/);
  });
});

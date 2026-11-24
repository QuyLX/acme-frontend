import { describe, expect, test } from 'vitest';
import { FlagRegistryError, assertFlagRegistry, loadFlagRegistry, validateFlagRegistry, type FlagDefinition, type FlagDefinitionInput } from '../src/index';

const TODAY = '2026-11-24';
const valid: FlagDefinition = { key: 'tenants.bulk-invite', owner: 'team-tenants', default: false, fallback: false, safeState: 'off', expires: '2027-03-31' };
const only = (def: FlagDefinitionInput) => validateFlagRegistry([def], TODAY);

describe('validateFlagRegistry (AC-7, FE-FLAG-001)', () => {
  test('a complete, unexpired registry has no problems', () => {
    expect(validateFlagRegistry([valid, { ...valid, key: 'users.step-up', safeState: 'on', gatesSecuritySensitive: true, fallback: true }], TODAY)).toEqual([]);
  });

  test('a flag expiring today is still valid', () => {
    expect(only({ ...valid, expires: TODAY })).toEqual([]);
  });

  test.each<[string, FlagDefinitionInput, RegExp]>([
    ['missing owner', { ...valid, owner: undefined }, /"tenants\.bulk-invite": missing owner/],
    ['blank owner', { ...valid, owner: '  ' }, /missing owner/],
    ['missing default', { ...valid, default: undefined }, /missing default/],
    ['missing fallback', { ...valid, fallback: 'false' }, /missing fallback/],
    ['missing safeState', { ...valid, safeState: undefined }, /missing safeState/],
    ['invalid safeState', { ...valid, safeState: 'maybe' }, /invalid safeState "maybe"/],
    ['missing expires', { ...valid, expires: undefined }, /missing expires/],
    ['invalid expires format', { ...valid, expires: '31/03/2027' }, /invalid expires "31\/03\/2027"/],
    ['impossible expires date', { ...valid, expires: '2027-02-30' }, /invalid expires "2027-02-30"/],
    ['expired flag', { ...valid, expires: '2026-11-23' }, /expired on 2026-11-23 \(today is 2026-11-24\)/],
    ['missing key', { ...valid, key: undefined }, /flags\[0\]: missing key/],
  ])('reports %s', (_name, def, expected) => {
    const problems = only(def);
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(expected);
  });

  test('a security-sensitive flag without safeState fails with the FE-FLAG-001 message', () => {
    const problems = only({ ...valid, safeState: undefined, gatesSecuritySensitive: true });
    expect(problems).toEqual(['flag "tenants.bulk-invite": gates security-sensitive behavior and must declare safeState explicitly (FE-FLAG-001)']);
  });

  test('reports duplicate keys with both entry positions', () => {
    expect(validateFlagRegistry([valid, { ...valid, key: 'other' }, valid], TODAY)).toEqual(['flag "tenants.bulk-invite": duplicate key (entries 0 and 2)']);
  });

  test('reports every problem of a flag at once', () => {
    expect(only({ key: 'bare' })).toHaveLength(5);
  });

  test('rejects an invalid today', () => {
    expect(() => validateFlagRegistry([valid], '24/11/2026')).toThrow(/today must be a YYYY-MM-DD date/);
  });
});

describe('assertFlagRegistry', () => {
  test('throws a FlagRegistryError carrying the problems', () => {
    const defs: FlagDefinitionInput[] = [{ ...valid, owner: undefined }];
    expect(() => assertFlagRegistry(defs, TODAY)).toThrow(FlagRegistryError);
    try {
      assertFlagRegistry(defs, TODAY);
    } catch (error) {
      expect(error instanceof FlagRegistryError && error.problems).toEqual(['flag "tenants.bulk-invite": missing owner']);
    }
  });
});

describe('loadFlagRegistry', () => {
  test('parses a YAML list of definitions, keeping unquoted dates as strings', () => {
    const defs = loadFlagRegistry(`
- key: tenants.bulk-invite
  owner: team-tenants
  default: false
  fallback: false
  safeState: off
  expires: 2027-03-31
- key: users.step-up
  owner: team-identity
  default: true
  fallback: true
  safeState: on
  expires: "2027-01-15"
  gatesSecuritySensitive: true
`);
    expect(defs).toEqual([valid, { key: 'users.step-up', owner: 'team-identity', default: true, fallback: true, safeState: 'on', expires: '2027-01-15', gatesSecuritySensitive: true }]);
    expect(validateFlagRegistry(defs, TODAY)).toEqual([]);
  });

  test('loaded entries with problems are reported by the validator', () => {
    const defs = loadFlagRegistry('- key: half\n  owner: team-x\n  default: false\n');
    expect(validateFlagRegistry(defs, TODAY)).toEqual([
      'flag "half": missing fallback (expected true or false)',
      "flag \"half\": missing safeState (expected 'off' or 'on')",
      'flag "half": missing expires (expected a YYYY-MM-DD date)',
    ]);
  });

  test('an empty document is an empty registry', () => {
    expect(loadFlagRegistry('')).toEqual([]);
  });

  test('rejects a document that is not a list of mappings', () => {
    expect(() => loadFlagRegistry('key: x')).toThrow(/expected a YAML list/);
    expect(() => loadFlagRegistry('- just-a-string')).toThrow(/flags\[0\] is not a mapping/);
  });
});

import { describe, expect, test } from 'vitest';
import { EMAIL_MASK, TOKEN_MASK, isForbiddenKey, maskFreeText, redact } from '../src/index';

// Synthetic values only.
const JWT = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzeW50aGV0aWMtdXNlciJ9.c2lnbmF0dXJlLXN5bnRoZXRpYy0xMjM0NTY';
const DATA_CLASSES = {
  'tenant.id': 'internal',
  'page.route': 'public',
  note: 'public',
  'user.email': 'personal',
  'user.nationalId': 'sensitive',
  'user.role': 'restricted-by-typo',
};

describe('redact (AC-6)', () => {
  test('drops personal, sensitive and unknown attributes and keeps public and internal ones', () => {
    const out = redact(
      {
        'tenant.id': 't-001',
        'page.route': '/tenants/[id]',
        'user.email': 'jane.doe@example.test',
        'user.nationalId': '000000000',
        'user.role': 'admin',
        'unmapped.key': 'anything',
      },
      DATA_CLASSES,
    );
    expect(out).toEqual({ 'tenant.id': 't-001', 'page.route': '/tenants/[id]' });
  });

  test('an unknown key is restricted even when it looks harmless, and prototype keys are not a data-class map', () => {
    expect(redact({ count: 3, constructor: 'x', toString: 'y' }, {})).toEqual({});
  });

  test('masks an email and a JWT inside a kept free-text string', () => {
    const out = redact({ note: `Invited jane.doe@example.test with ${JWT} yesterday` }, DATA_CLASSES);
    expect(out.note).toBe(`Invited ${EMAIL_MASK} with ${TOKEN_MASK} yesterday`);
    expect(String(out.note)).not.toContain('example.test');
    expect(String(out.note)).not.toContain('eyJ');
  });

  test('masks strings nested in arrays and objects of kept attributes and drops nested body/credential keys', () => {
    const out = redact({ note: { tags: ['ops', 'a@b.example'], password: 'p', ok: true } }, DATA_CLASSES);
    expect(out).toEqual({ note: { tags: ['ops', EMAIL_MASK], ok: true } });
  });

  test('drops body and credential keys even when they are classed public', () => {
    const classes = { body: 'public', payload: 'public', password: 'public', 'auth.token': 'public', clientSecret: 'public', responseBody: 'public' };
    const out = redact({ body: '{}', payload: '{}', password: 'x', 'auth.token': 'x', clientSecret: 'x', responseBody: '{}' }, classes);
    expect(out).toEqual({});
  });

  test('keeps non-string values of kept attributes unchanged', () => {
    expect(redact({ 'tenant.id': 42, 'page.route': false }, DATA_CLASSES)).toEqual({ 'tenant.id': 42, 'page.route': false });
  });
});

describe('maskFreeText', () => {
  test.each([
    ['Authorization: Bearer abc.def-123', `Authorization: Bearer ${TOKEN_MASK}`],
    ['Basic dXNlcjpwYXNz', `Basic ${TOKEN_MASK}`],
    ['sha 0123456789abcdef0123456789abcdef01234567', `sha ${TOKEN_MASK}`],
    ['key aB3dE5fG7hJ9kL1mN3pQ5rS7tU9vW1xY3zA5bC7d==', `key ${TOKEN_MASK}`],
    ['contact ops+alerts@sub.example.test now', `contact ${EMAIL_MASK} now`],
  ])('masks %s', (input, expected) => {
    expect(maskFreeText(input)).toBe(expected);
  });

  test.each([
    'GET /api/v1/tenants/t-001/users/u-002/roles/r-003',
    'request 3f2b8c1e-9a4d-4e7b-8c2a-1d5e6f7a8b9c',
    'plain sentence without secrets',
  ])('leaves %s alone', (input) => {
    expect(maskFreeText(input)).toBe(input);
  });
});

describe('isForbiddenKey', () => {
  test.each(['body', 'request.body', 'responseBody', 'payload', 'password', 'accessToken', 'client_secret'])('%s is forbidden', (key) => {
    expect(isForbiddenKey(key)).toBe(true);
  });
  test.each(['tenant.id', 'tokenCount', 'bodyCount'])('%s is allowed', (key) => {
    expect(isForbiddenKey(key)).toBe(false);
  });
});

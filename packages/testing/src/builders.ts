// Synthetic data builders (never production data). Deterministic: the n-th call with the same seed yields the same
// values, so snapshots and failures reproduce. Emails use the reserved `.invalid` TLD.

const pad = (n: number) => n.toString(16).padStart(12, '0');
/** Deterministic UUID-shaped id (version nibble 4) derived from a namespace and a counter. */
export function syntheticId(namespace: number, n: number): string {
  return `${pad(namespace).slice(-8)}-0000-4000-8000-${pad(n)}`;
}

export function createBuilders(seed = 1) {
  let n = 0;
  const next = () => ++n;
  return {
    tenant<T extends object>(overrides: Partial<T> & object = {}) {
      const i = next();
      return { id: syntheticId(seed, i), name: `Synthetic Tenant ${i}`, status: 'active', createdAt: new Date(Date.UTC(2026, 0, i)).toISOString(), ...overrides };
    },
    user<T extends object>(overrides: Partial<T> & object = {}) {
      const i = next();
      return { id: syntheticId(seed + 1, i), tenantId: syntheticId(seed, 1), email: `user${i}@example.invalid`, displayName: `Synthetic User ${i}`, role: 'member', status: 'active', ...overrides };
    },
  };
}

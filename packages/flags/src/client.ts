// OpenFeature adapter (FE-FLAG-001): flags are evaluated only through a registry, never by ad-hoc keys.
import type { Client, EvaluationContext } from '@openfeature/server-sdk';
import { ErrorCode } from '@openfeature/server-sdk';
import type { FlagDefinition } from './registry';

/** The part of an OpenFeature server `Client` the adapter needs. */
export type OpenFeatureClient = Pick<Client, 'getBooleanDetails'>;

/** Thrown when a key that is not in the registry is evaluated. */
export class UnregisteredFlagError extends Error {
  constructor(key: string) {
    super(`Flag "${key}" is not registered (FE-FLAG-001)`);
    this.name = 'UnregisteredFlagError';
  }
}

/** Registry-backed flag evaluation. */
export interface Flags {
  /**
   * Evaluates a registered boolean flag. Throws {@link UnregisteredFlagError} for an unknown key. Returns the flag's
   * `default` when the provider does not know the flag, and its `fallback` on any other evaluation error.
   */
  isEnabled(key: string, ctx?: EvaluationContext): Promise<boolean>;
}

/** Creates the adapter over an OpenFeature client. Throws on duplicate keys in `defs`. */
export function createFlags(defs: readonly FlagDefinition[], client: OpenFeatureClient): Flags {
  const registry = new Map<string, FlagDefinition>();
  for (const def of defs) {
    if (registry.has(def.key)) throw new Error(`createFlags: duplicate flag key "${def.key}"`);
    registry.set(def.key, def);
  }
  return {
    async isEnabled(key, ctx) {
      const def = registry.get(key);
      if (!def) throw new UnregisteredFlagError(key);
      try {
        const details = await client.getBooleanDetails(key, def.fallback, ctx);
        if (details.errorCode === ErrorCode.FLAG_NOT_FOUND) return def.default;
        if (details.errorCode !== undefined || typeof details.value !== 'boolean') return def.fallback;
        return details.value;
      } catch {
        return def.fallback;
      }
    },
  };
}

// Flag registry schema and validation (FE-FLAG-001, FE §11.4): every flag has an owner, default, fallback, safeState
// and expiry; flags gating security-sensitive behavior must declare safeState explicitly.
import { parse } from 'yaml';

/** A registered flag (FE-FLAG-001). */
export interface FlagDefinition {
  /** Unique flag key, as evaluated through OpenFeature. */
  key: string;
  /** Owning team or person responsible for the flag. */
  owner: string;
  /** Value used when the provider does not know the flag. */
  default: boolean;
  /** Value used when evaluation fails (provider error, not ready, type mismatch). */
  fallback: boolean;
  /** State that returns the system to verified, safe behavior (FE §11.4). */
  safeState: 'off' | 'on';
  /** Expiry date, `YYYY-MM-DD`. */
  expires: string;
  /** Whether the flag gates `x:security-sensitive` behavior. */
  gatesSecuritySensitive?: boolean;
}

/** An unvalidated registry entry, e.g. as parsed from YAML. A {@link FlagDefinition} is always assignable to it. */
export type FlagDefinitionInput = { [K in keyof FlagDefinition]?: unknown };

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Whether `value` is a real calendar date written as `YYYY-MM-DD`. */
export function isIsoDate(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const m = ISO_DATE.exec(value);
  if (!m) return false;
  const date = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return date.toISOString().slice(0, 10) === value;
}

const nonEmptyString = (value: unknown): value is string => typeof value === 'string' && value.trim() !== '';

const problemsOf = (def: FlagDefinitionInput, label: string, today: string): string[] => {
  const problems: string[] = [];
  if (!nonEmptyString(def.owner)) problems.push(`${label}: missing owner`);
  if (typeof def.default !== 'boolean') problems.push(`${label}: missing default (expected true or false)`);
  if (typeof def.fallback !== 'boolean') problems.push(`${label}: missing fallback (expected true or false)`);
  if (def.gatesSecuritySensitive !== undefined && typeof def.gatesSecuritySensitive !== 'boolean') {
    problems.push(`${label}: invalid gatesSecuritySensitive (expected true or false)`);
  }
  if (def.safeState === undefined) {
    problems.push(
      def.gatesSecuritySensitive === true
        ? `${label}: gates security-sensitive behavior and must declare safeState explicitly (FE-FLAG-001)`
        : `${label}: missing safeState (expected 'off' or 'on')`,
    );
  } else if (def.safeState !== 'off' && def.safeState !== 'on') {
    problems.push(`${label}: invalid safeState ${JSON.stringify(def.safeState)} (expected 'off' or 'on')`);
  }
  if (def.expires === undefined || def.expires === null || def.expires === '') {
    problems.push(`${label}: missing expires (expected a YYYY-MM-DD date)`);
  } else if (!isIsoDate(def.expires)) {
    problems.push(`${label}: invalid expires ${JSON.stringify(def.expires)} (expected a YYYY-MM-DD date)`);
  } else if (def.expires < today) {
    problems.push(`${label}: expired on ${def.expires} (today is ${today}); remove the flag or renew its expiry`);
  }
  return problems;
};

/**
 * Validates a flag registry against FE-FLAG-001 and returns human-readable problems (empty when valid): missing key,
 * owner, default, fallback or safeState; missing or invalid expires; expired flags (`expires < today`); a
 * security-sensitive flag without an explicit safeState; duplicate keys. `today` is `YYYY-MM-DD`.
 */
export function validateFlagRegistry(defs: readonly FlagDefinitionInput[], today: string): string[] {
  if (!isIsoDate(today)) throw new Error(`validateFlagRegistry: today must be a YYYY-MM-DD date, got ${JSON.stringify(today)}`);
  const problems: string[] = [];
  const firstIndex = new Map<string, number>();
  defs.forEach((def, index) => {
    if (!nonEmptyString(def.key)) {
      problems.push(`flags[${index}]: missing key`);
      problems.push(...problemsOf(def, `flags[${index}]`, today));
      return;
    }
    const seen = firstIndex.get(def.key);
    if (seen === undefined) firstIndex.set(def.key, index);
    else problems.push(`flag "${def.key}": duplicate key (entries ${seen} and ${index})`);
    problems.push(...problemsOf(def, `flag "${def.key}"`, today));
  });
  return problems;
}

/** Thrown by {@link assertFlagRegistry}; `problems` lists every registry problem. */
export class FlagRegistryError extends Error {
  /** Human-readable problems, as returned by {@link validateFlagRegistry}. */
  readonly problems: readonly string[];
  constructor(problems: readonly string[]) {
    super(`Invalid flag registry:\n- ${problems.join('\n- ')}`);
    this.name = 'FlagRegistryError';
    this.problems = problems;
  }
}

/** Throws a {@link FlagRegistryError} unless the registry is valid on `today`; narrows the entries to {@link FlagDefinition}. */
export function assertFlagRegistry(defs: readonly FlagDefinitionInput[], today: string): asserts defs is FlagDefinition[] {
  const problems = validateFlagRegistry(defs, today);
  if (problems.length > 0) throw new FlagRegistryError(problems);
}

const isMapping = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Parses a YAML list of flag definitions. Throws when the document is not a list of mappings; field-level problems are
 * left to {@link validateFlagRegistry} / {@link assertFlagRegistry}. The YAML 1.2 core schema keeps an unquoted
 * `expires: 2026-12-31` a string.
 */
export function loadFlagRegistry(yamlText: string): FlagDefinitionInput[] {
  const doc: unknown = parse(yamlText);
  if (doc === null || doc === undefined) return [];
  if (!Array.isArray(doc)) throw new Error('loadFlagRegistry: expected a YAML list of flag definitions');
  return doc.map((entry: unknown, index) => {
    if (!isMapping(entry)) throw new Error(`loadFlagRegistry: flags[${index}] is not a mapping`);
    const { key, owner, default: defaultValue, fallback, safeState, expires, gatesSecuritySensitive } = entry;
    const def: FlagDefinitionInput = { key, owner, default: defaultValue, fallback, safeState, expires };
    if (gatesSecuritySensitive !== undefined) def.gatesSecuritySensitive = gatesSecuritySensitive;
    return def;
  });
}

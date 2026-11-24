// @platform/flags — OpenFeature adapter with a flag registry: owner, default, fallback, safeState, expiry (FE-FLAG-001, §11.4).
export { validateFlagRegistry, assertFlagRegistry, loadFlagRegistry, isIsoDate, FlagRegistryError } from './registry';
export type { FlagDefinition, FlagDefinitionInput } from './registry';
export { createFlags, UnregisteredFlagError } from './client';
export type { Flags, OpenFeatureClient } from './client';

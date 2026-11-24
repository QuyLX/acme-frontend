// @platform/testing — shared test harness (FE §4.1 Testing Platform, framework & harness layer).
export { createTestQueryClient, renderWithProviders } from './render';
export { setupMockServer } from './mock-server';
export { createBuilders, syntheticId } from './builders';
export { personas, sessionFor } from './personas';
export type { PersonaName } from './personas';
export { axeViolations } from './a11y';

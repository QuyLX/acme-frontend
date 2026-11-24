import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';

/** A QueryClient for tests: no retries (failures surface immediately), no garbage collection during a test. */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity }, mutations: { retry: false } } });
}

/** Renders with the platform providers. Pass `wrapper` for extra providers (e.g. i18n messages). */
export function renderWithProviders(ui: ReactElement, o: { queryClient?: QueryClient; wrapper?: (p: { children: ReactNode }) => ReactElement } & Omit<RenderOptions, 'wrapper'> = {}) {
  const queryClient = o.queryClient ?? createTestQueryClient();
  const Extra = o.wrapper;
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{Extra ? <Extra>{children}</Extra> : children}</QueryClientProvider>
  );
  return { queryClient, ...render(ui, { ...o, wrapper: Wrapper }) };
}

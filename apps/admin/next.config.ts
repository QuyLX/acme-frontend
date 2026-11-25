import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ['@platform/ds-react', '@platform/ds-icons', '@platform/server'],
  experimental: { authInterrupts: true },
};

export default createNextIntlPlugin('./src/i18n/request.ts')(config);

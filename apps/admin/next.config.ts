import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ['@platform/ds-react', '@platform/ds-icons', '@platform/server'],
};

export default config;

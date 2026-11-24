import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-a11y'],
  framework: { name: '@storybook/react-vite', options: {} },
  async viteFinal(viteConfig) {
    const { default: tailwind } = await import('@tailwindcss/vite');
    viteConfig.plugins = [...(viteConfig.plugins ?? []), tailwind()];
    return viteConfig;
  },
};

export default config;

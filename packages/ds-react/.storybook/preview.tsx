import type { Preview } from '@storybook/react-vite';
import './storybook.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Design token theme',
      toolbar: { title: 'Theme', items: ['light', 'dark'], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [
    (Story, context) => {
      document.documentElement.dataset.theme = context.globals.theme as string;
      return <Story />;
    },
  ],
  parameters: {
    a11y: { test: 'error' },
  },
};

export default preview;

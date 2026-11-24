/// <reference types="vite/client" />
// Every story of the package, composed with its args, for the real-browser lanes (tech-design 07 §6b).
import { composeStories } from '@storybook/react-vite';
import type { ComponentType } from 'react';
import '../../.storybook/storybook.css';

type StoryModule = Parameters<typeof composeStories>[0];
const modules = import.meta.glob<StoryModule>('../../src/**/*.stories.tsx', { eager: true });

export const themes = ['light', 'dark'] as const;

export const stories: Array<{ id: string; Story: ComponentType }> = Object.entries(modules).flatMap(([path, mod]) => {
  const component = path.split('/').at(-1)!.replace('.stories.tsx', '');
  return Object.entries(composeStories(mod)).map(([name, Story]) => ({ id: `${component}-${name}`, Story: Story as ComponentType }));
});

export function setTheme(theme: (typeof themes)[number]) {
  document.documentElement.dataset.theme = theme;
}

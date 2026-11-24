import { renderIcon, type IconDefinition, type IconProps } from './Icon';

const icon = (def: IconDefinition) => {
  const Component = (props: IconProps) => renderIcon(def, props);
  return Component;
};
const s16 = (d: string, extra: Partial<IconDefinition> = {}): IconDefinition => ({ viewBox: '0 0 16 16', paths: <path d={d} />, ...extra });

export const IconCheck = icon(s16('M3.5 8.5l3 3 6-7'));
export const IconMinus = icon(s16('M4 8h8'));
export const IconPlus = icon(s16('M8 4v8M4 8h8'));
export const IconChevronDown = icon(s16('M4 6l4 4 4-4'));
export const IconChevronUp = icon(s16('M4 10l4-4 4 4'));
export const IconChevronRight = icon(s16('M6 4l4 4-4 4'));
export const IconClose = icon(s16('M4 4l8 8M12 4l-8 8'));
export const IconInfo = icon(s16('M8 7v4M8 5h.01M14 8A6 6 0 1 1 2 8a6 6 0 0 1 12 0z', { rounded: true }));
export const IconSuccess = icon(s16('M5 8.5l2 2 4-4.5M14 8A6 6 0 1 1 2 8a6 6 0 0 1 12 0z', { rounded: true }));
export const IconWarning = icon(s16('M8 6v3M8 11h.01M7.1 2.5L1.6 12a1 1 0 0 0 .9 1.5h11a1 1 0 0 0 .9-1.5L8.9 2.5a1 1 0 0 0-1.8 0z', { rounded: true }));
export const IconDanger = icon(s16('M8 5v4M8 11h.01M14 8A6 6 0 1 1 2 8a6 6 0 0 1 12 0z', { rounded: true }));
export const IconEmpty = icon({ viewBox: '0 0 24 24', joinRound: true, paths: <path d="M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4 9-4V7M12 11v10" /> });

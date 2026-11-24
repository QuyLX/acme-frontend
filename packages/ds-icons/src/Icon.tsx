import type { ReactNode } from 'react';

export type IconSize = 'xs' | 'sm' | 'xl';
export type IconWeight = 'light' | 'regular' | 'bold';
export type IconTone = 'current' | 'muted';
/** Layout variants used inside DS components; there is no free-form className (DS convention). */
export type IconPlacement = 'inline' | 'leading-text' | 'stacked';

export interface IconProps {
  /** xs = 12px, sm = 16px (default), xl = 40px. */
  size?: IconSize;
  /** Stroke weight: light 1.5, regular 2 (default), bold 2.5. */
  weight?: IconWeight;
  /** current = inherit the text color (default); muted = secondary text color. */
  tone?: IconTone;
  placement?: IconPlacement;
  /** Accessible name. Without it the icon is decorative and hidden from assistive technology. */
  label?: string;
}

const SIZE: Record<IconSize, string> = { xs: 'size-3', sm: 'size-4', xl: 'size-10' };
const WEIGHT: Record<IconWeight, string> = { light: '1.5', regular: '2', bold: '2.5' };
const PLACEMENT: Record<IconPlacement, string> = { inline: '', 'leading-text': 'mt-0.5 shrink-0', stacked: 'mb-2' };

export interface IconDefinition {
  viewBox: '0 0 16 16' | '0 0 24 24';
  rounded?: boolean;
  joinRound?: boolean;
  paths: ReactNode;
}

export function renderIcon(def: IconDefinition, { size = 'sm', weight = 'regular', tone = 'current', placement = 'inline', label }: IconProps) {
  const className = [PLACEMENT[placement], SIZE[size], tone === 'muted' ? 'text-fg-muted' : ''].filter(Boolean).join(' ');
  return (
    <svg
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      viewBox={def.viewBox}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={WEIGHT[weight]}
      {...(def.rounded ? { strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const } : def.joinRound ? { strokeLinejoin: 'round' as const } : {})}
    >
      {def.paths}
    </svg>
  );
}

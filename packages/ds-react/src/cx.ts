/** Joins class names, skipping falsy values. */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

/** Shared focus ring for interactive controls (token: color.focus). */
export const focusRing = 'outline-none data-focus-visible:ring-2 data-focus-visible:ring-focus data-focus-visible:ring-offset-2 data-focus-visible:ring-offset-canvas';

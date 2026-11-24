import { cx } from '../cx';

export type SkeletonShape = 'text' | 'block' | 'circle';
export type SkeletonLines = 1 | 2 | 3 | 4 | 5;

export interface SkeletonProps {
  /** `text` (default) for lines of text, `block` for cards and charts, `circle` for avatars and icons. */
  shape?: SkeletonShape;
  /** Number of text lines (shape `text` only). Default 1; the last of several lines is shorter. */
  lines?: SkeletonLines;
}

const pulse = 'animate-pulse bg-subtle motion-reduce:animate-none';

export function Skeleton({ shape = 'text', lines = 1 }: SkeletonProps) {
  if (shape === 'circle') return <div aria-hidden="true" className={cx(pulse, 'size-10 rounded-full')} />;
  if (shape === 'block') return <div aria-hidden="true" className={cx(pulse, 'h-24 w-full rounded-md')} />;
  return (
    <div aria-hidden="true" className="flex w-full flex-col gap-2">
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className={cx(pulse, 'h-4 rounded-sm', lines > 1 && i === lines - 1 ? 'w-2/3' : 'w-full')} />
      ))}
    </div>
  );
}

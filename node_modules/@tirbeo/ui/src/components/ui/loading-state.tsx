'use client';

import { cn } from '../../lib/utils';

export interface LoadingStateProps {
  text?: string;
  className?: string;
  variant?: 'spinner' | 'skeleton';
  rows?: number;
}

export function LoadingState({ text, className, variant = 'spinner', rows = 4 }: LoadingStateProps) {
  if (variant === 'skeleton') {
    return (
      <div className={cn('space-y-4 p-6', className)}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-[var(--color-admin-surface-hover)] rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center justify-center py-12', className)}>
      <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      {text && <p className="mt-3 text-sm text-[var(--color-admin-text-muted)]">{text}</p>}
    </div>
  );
}

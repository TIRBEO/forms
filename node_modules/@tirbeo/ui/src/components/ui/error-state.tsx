'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An error occurred while loading this content.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('rounded-xl border border-[var(--color-admin-border)] bg-[var(--color-admin-surface)] p-12 text-center', className)}>
      <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-[var(--color-error)]" />
      <h3 className="text-lg font-medium text-[var(--color-admin-text)] mb-1">{title}</h3>
      <p className="text-sm text-[var(--color-admin-text-secondary)] mb-4">{message}</p>
      {onRetry && (
        <button onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors">
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      )}
    </div>
  );
}

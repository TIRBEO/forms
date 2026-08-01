'use client';

import { ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface BannerProps {
  variant: 'info' | 'success' | 'warning' | 'error';
  children: ReactNode;
  onDismiss?: () => void;
  className?: string;
}

const styles: Record<string, string> = {
  info: 'bg-[var(--color-info)]/10 text-[var(--color-info)] border-[var(--color-info)]/20',
  success: 'bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20',
  warning: 'bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/20',
  error: 'bg-[var(--color-error)]/10 text-[var(--color-error)] border-[var(--color-error)]/20',
};

export function Banner({ variant, children, onDismiss, className }: BannerProps) {
  return (
    <div className={cn('px-4 py-3 text-sm border-b flex items-center justify-between gap-4', styles[variant], className)}>
      <div className="flex-1">{children}</div>
      {onDismiss && (
        <button onClick={onDismiss} className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

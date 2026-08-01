'use client';

import { ReactNode } from 'react';
import { Filter, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface FilterOption {
  label: string;
  value: string;
  active?: boolean;
}

export interface FilterBarProps {
  options: FilterOption[];
  onToggle: (value: string) => void;
  onClear: () => void;
  label?: string;
  className?: string;
  children?: ReactNode;
}

export function FilterBar({ options, onToggle, onClear, label = 'Filters', className, children }: FilterBarProps) {
  const hasActive = options.some(o => o.active);

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      <Filter className="w-4 h-4 text-[var(--color-admin-text-muted)]" />
      <span className="text-xs font-medium text-[var(--color-admin-text-muted)] uppercase tracking-wider">{label}</span>
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onToggle(opt.value)}
          className={cn(
            'px-3 py-1 rounded-full text-xs font-medium transition-colors border',
            opt.active
              ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
              : 'border-[var(--color-admin-border)] text-[var(--color-admin-text-secondary)] hover:bg-[var(--color-admin-surface-hover)]'
          )}
        >
          {opt.label}
        </button>
      ))}
      {children}
      {hasActive && (
        <button onClick={onClear} className="flex items-center gap-1 text-xs text-[var(--color-admin-text-muted)] hover:text-[var(--color-error)] transition-colors">
          <X className="w-3 h-3" /> Clear
        </button>
      )}
    </div>
  );
}

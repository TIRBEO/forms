'use client';

import { Search as SearchIcon, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function Search({ value, onChange, placeholder = 'Search...', className }: SearchProps) {
  return (
    <div className={cn('relative', className)}>
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-admin-text-muted)]" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2 rounded-lg border border-[var(--color-admin-border)] bg-[var(--color-admin-surface)] text-sm text-[var(--color-admin-text)] placeholder:text-[var(--color-admin-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-colors"
      />
      {value && (
        <button onClick={() => onChange('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)]">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

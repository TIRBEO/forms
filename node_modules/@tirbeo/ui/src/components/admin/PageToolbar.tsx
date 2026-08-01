'use client';

import { ReactNode } from 'react';
import { Search, SlidersHorizontal, Download, Plus } from 'lucide-react';

export interface PageToolbarProps {
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  onFilter?: () => void;
  onExport?: () => void;
  onCreateLabel?: string;
  onCreate?: () => void;
  extraActions?: ReactNode;
  children?: ReactNode;
}

export function PageToolbar({ searchPlaceholder, onSearch, onFilter, onExport, onCreateLabel, onCreate, extraActions, children }: PageToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
      <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-md">
        <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-lg border border-[var(--color-admin-border)] bg-[var(--color-admin-surface)] text-sm">
          <Search className="w-4 h-4 text-[var(--color-admin-text-muted)]" />
          <input type="text" onChange={e => onSearch?.(e.target.value)}
            placeholder={searchPlaceholder || 'Search...'}
            className="flex-1 bg-transparent border-none outline-none text-[var(--color-admin-text)] placeholder:text-[var(--color-admin-text-muted)]" />
        </div>
        {onFilter && (
          <button onClick={onFilter}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--color-admin-border)] text-sm font-medium text-[var(--color-admin-text-secondary)] hover:bg-[var(--color-admin-surface-hover)] transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {onExport && (
          <button onClick={onExport}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--color-admin-border)] text-sm font-medium text-[var(--color-admin-text-secondary)] hover:bg-[var(--color-admin-surface-hover)] transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        )}
        {extraActions}
        {onCreate && (
          <button onClick={onCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors">
            <Plus className="w-4 h-4" />
            {onCreateLabel || 'Create'}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

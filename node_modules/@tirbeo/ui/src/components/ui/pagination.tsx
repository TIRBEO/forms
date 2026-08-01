'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: (number | '...')[] = [];
    const start = Math.max(1, page - 1);
    const end = Math.min(totalPages, page + 1);

    if (start > 1) { pages.push(1); if (start > 2) pages.push('...'); }
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages) { if (end < totalPages - 1) pages.push('...'); pages.push(totalPages); }

    return pages;
  };

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <span className="text-sm text-[var(--color-admin-text-muted)]">
        Page {page} of {totalPages}
      </span>
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(1)} disabled={page === 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-admin-text-muted)] hover:bg-[var(--color-admin-surface-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-admin-text-muted)] hover:bg-[var(--color-admin-surface-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        {getPages().map((p, i) => (
          typeof p === 'number' ? (
            <button key={i} onClick={() => onPageChange(p)}
              className={cn(
                'w-8 h-8 rounded-lg text-sm font-medium transition-colors',
                p === page
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-[var(--color-admin-text-secondary)] hover:bg-[var(--color-admin-surface-hover)]'
              )}>
              {p}
            </button>
          ) : (
            <span key={i} className="w-8 h-8 flex items-center justify-center text-[var(--color-admin-text-muted)]">...</span>
          )
        ))}
        <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-admin-text-muted)] hover:bg-[var(--color-admin-surface-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
        <button onClick={() => onPageChange(totalPages)} disabled={page === totalPages}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-admin-text-muted)] hover:bg-[var(--color-admin-surface-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

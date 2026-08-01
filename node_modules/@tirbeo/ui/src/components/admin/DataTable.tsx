'use client';

import { useState, ReactNode } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Search, SlidersHorizontal } from 'lucide-react';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => ReactNode;
  width?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  loading?: boolean;
  emptyState?: ReactNode;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  total?: number;
  selectable?: boolean;
  selectedIds?: Set<string>;
  onSelectionChange?: (ids: Set<string>) => void;
  bulkActions?: ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  columns, data, keyExtractor, onRowClick, loading, emptyState,
  searchable, searchPlaceholder, onSearch,
  page, totalPages, onPageChange, total,
  selectable, selectedIds, onSelectionChange, bulkActions,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = (key: string) => {
    if (sortKey === key) { setSortDir(d => d === 'asc' ? 'desc' : 'asc'); }
    else { setSortKey(key); setSortDir('asc'); }
  };

  const selectAll = () => {
    if (!onSelectionChange) return;
    if (selectedIds && selectedIds.size === data.length) { onSelectionChange(new Set()); }
    else { onSelectionChange(new Set(data.map(keyExtractor))); }
  };

  const toggleSelect = (id: string) => {
    if (!onSelectionChange || !selectedIds) return;
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    onSelectionChange(next);
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-[var(--color-admin-border)] bg-[var(--color-admin-surface)] overflow-hidden">
        <div className="p-6 space-y-4 animate-pulse">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-10 bg-[var(--color-admin-surface-hover)] rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {(searchable || onPageChange || bulkActions) && (
        <div className="flex items-center justify-between gap-4 mb-4">
          {searchable && (
            <div className="flex items-center gap-2 flex-1 max-w-md px-3 py-2 rounded-lg border border-[var(--color-admin-border)] bg-[var(--color-admin-surface)] text-sm">
              <Search className="w-4 h-4 text-[var(--color-admin-text-muted)]" />
              <input type="text" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); onSearch?.(e.target.value); }}
                placeholder={searchPlaceholder || 'Search...'}
                className="flex-1 bg-transparent border-none outline-none text-[var(--color-admin-text)] placeholder:text-[var(--color-admin-text-muted)]" />
            </div>
          )}
          <div className="flex items-center gap-2">
            {bulkActions}
            <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--color-admin-border)] text-sm font-medium text-[var(--color-admin-text-secondary)] hover:bg-[var(--color-admin-surface-hover)] transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      )}

      {selectedIds && selectedIds.size > 0 && bulkActions && (
        <div className="flex items-center gap-3 px-4 py-2 mb-3 rounded-lg bg-[var(--color-primary-surface)] text-sm">
          <span className="font-medium text-[var(--color-primary)]">{selectedIds.size} selected</span>
          {bulkActions}
        </div>
      )}

      <div className="rounded-xl border border-[var(--color-admin-border)] bg-[var(--color-admin-surface)] overflow-hidden">
        {data.length === 0 && !loading ? (
          emptyState || (
            <div className="p-12 text-center">
              <p className="text-sm text-[var(--color-admin-text-muted)]">No data</p>
            </div>
          )
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-admin-border)]">
                  {selectable && (
                    <th className="px-4 py-3 w-10">
                      <input type="checkbox" checked={selectedIds?.size === data.length && data.length > 0}
                        onChange={selectAll} className="w-4 h-4 accent-[var(--color-primary)]" />
                    </th>
                  )}
                  {columns.map(col => (
                    <th key={col.key} className="px-4 py-3 text-left text-xs font-medium text-[var(--color-admin-text-muted)] uppercase tracking-wider"
                      style={{ width: col.width }}>
                      {col.sortable ? (
                        <button onClick={() => handleSort(col.key)}
                          className="flex items-center gap-1 hover:text-[var(--color-admin-text)] transition-colors">
                          {col.label}
                          {sortKey === col.key && (
                            sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      ) : col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-admin-border)]">
                {data.map(item => (
                  <tr key={keyExtractor(item)} onClick={() => onRowClick?.(item)}
                    className={`${onRowClick ? 'cursor-pointer' : ''} hover:bg-[var(--color-admin-surface-hover)] transition-colors`}>
                    {selectable && (
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <input type="checkbox" checked={selectedIds?.has(keyExtractor(item))}
                          onChange={() => toggleSelect(keyExtractor(item))} className="w-4 h-4 accent-[var(--color-primary)]" />
                      </td>
                    )}
                    {columns.map(col => (
                      <td key={col.key} className="px-4 py-3 text-sm text-[var(--color-admin-text)]">
                        {col.render ? col.render(item) : item[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages && totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-[var(--color-admin-text-muted)]">Total: {total || 0}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => onPageChange(Math.max(1, (page || 1) - 1))} disabled={page === 1}
              className="p-1.5 rounded hover:bg-[var(--color-admin-surface-hover)] text-[var(--color-admin-text-secondary)] disabled:opacity-30">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs text-[var(--color-admin-text-muted)]">Page {page} of {totalPages}</span>
            <button onClick={() => onPageChange(Math.min(totalPages, (page || 1) + 1))} disabled={page === totalPages}
              className="p-1.5 rounded hover:bg-[var(--color-admin-surface-hover)] text-[var(--color-admin-text-secondary)] disabled:opacity-30">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

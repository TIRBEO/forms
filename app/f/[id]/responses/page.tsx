'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../../lib/api-client';
import { cn, formatDateTime } from '../../../../lib/utils';
import {
  ChevronDown, ChevronUp, Download, Search, Filter,
  ChevronLeft, ChevronRight, ArrowUpDown, Eye, Trash2,
  FileText, Inbox, Clock, MoreHorizontal, CheckCircle2, XCircle,
  Columns2,
} from 'lucide-react';

interface Field {
  id: string;
  label: string;
  type: string;
}

interface Response {
  id: string;
  respondent?: string;
  submittedAt: string;
  duration?: number;
  answers: Record<string, string>;
  ip?: string;
  userAgent?: string;
}

interface ResponsesData {
  fields: Field[];
  responses: Response[];
  total: number;
  page: number;
  perPage: number;
}


export default function ResponsesPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [data, setData] = useState<ResponsesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<string>('submittedAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set());
  const [showColumnPicker, setShowColumnPicker] = useState(false);
  const perPage = 25;

  useEffect(() => {
    api.get<ResponsesData>(`/api/forms/${id}/responses?page=${page}&perPage=${perPage}`)
      .then(d => {
        setData(d);
        setVisibleColumns(new Set(['submittedAt', 'respondent', ...d.fields.map(f => f.id)]));
        setLoading(false);
      })
      .catch(() => {
        setData({ fields: [], responses: [], total: 0, page: 1, perPage: 20 });
        setLoading(false);
      });
  }, [id, page]);

  const toggleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const toggleColumn = (col: string) => {
    setVisibleColumns(prev => {
      const next = new Set(prev);
      if (next.has(col)) next.delete(col);
      else next.add(col);
      return next;
    });
  };

  const totalPages = Math.ceil((data?.total || 0) / perPage);
  const allColumns = [
    { id: 'submittedAt', label: 'Submitted', fixed: true },
    { id: 'respondent', label: 'Respondent', fixed: true },
    ...(data?.fields || []).map(f => ({ id: f.id, label: f.label, fixed: false })),
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-[var(--color-text)]">Responses</h1>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{data?.total || 0} total submissions</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button onClick={() => setShowColumnPicker(!showColumnPicker)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] transition-colors">
              <Columns2 className="w-3.5 h-3.5" />
              Columns
            </button>
            {showColumnPicker && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowColumnPicker(false)} />
                <div className="absolute right-0 top-full mt-1 z-20 w-52 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg py-2">
                  {allColumns.map(col => (
                    <label key={col.id} className="flex items-center gap-2 px-4 py-1.5 text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-muted)] cursor-pointer">
                      <input type="checkbox" checked={visibleColumns.has(col.id)} onChange={() => toggleColumn(col.id)}
                        className="rounded border-[var(--color-border)] text-[var(--color-primary)]" />
                      {col.label}
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>
          <button
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] transition-colors">
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 flex-1 max-w-md px-3 py-2 rounded-lg bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] text-sm">
          <Search className="w-4 h-4" />
          <input type="text" placeholder="Search responses..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none flex-1 text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)]" />
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] transition-colors">
          <Filter className="w-3.5 h-3.5" />
          Filter
        </button>
      </div>

      {data?.responses.length === 0 ? (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center">
          <Inbox className="w-12 h-12 mx-auto mb-4 text-[var(--color-text-tertiary)]" />
          <h3 className="text-lg font-medium text-[var(--color-text)] mb-2">No responses yet</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">Share your form to start collecting responses</p>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]/50">
                    {allColumns.filter(c => visibleColumns.has(c.id)).map(col => (
                      <th key={col.id} onClick={() => toggleSort(col.id)}
                        className={cn(
                          'px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider cursor-pointer hover:text-[var(--color-text)] transition-colors',
                          col.id === 'submittedAt' ? 'w-40' : col.id === 'respondent' ? 'w-44' : 'min-w-[160px]'
                        )}>
                        <div className="flex items-center gap-1">
                          {col.label}
                          {sortField === col.id && (
                            sortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="w-12 px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {data?.responses.map(response => (
                    <tr key={response.id}
                      onClick={() => router.push(`/f/${id}/responses/${response.id}`)}
                      className="hover:bg-[var(--color-surface-muted)] transition-colors cursor-pointer">
                      {allColumns.filter(c => visibleColumns.has(c.id)).map(col => (
                        <td key={col.id} className="px-4 py-3 text-sm">
                          {col.id === 'submittedAt' ? (
                            <span className="text-[var(--color-text-secondary)] text-xs">{formatDateTime(response.submittedAt)}</span>
                          ) : col.id === 'respondent' ? (
                            <span className="font-medium text-[var(--color-text)]">{response.respondent || 'Anonymous'}</span>
                          ) : (
                            <span className="text-[var(--color-text)] truncate block max-w-[200px]">
                              {response.answers[col.id] || '-'}
                            </span>
                          )}
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <button onClick={e => { e.stopPropagation(); }}
                          className="p-1 rounded hover:bg-[var(--color-surface-muted)] text-[var(--color-text-tertiary)]">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-[var(--color-text-tertiary)]">
              Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, data?.total || 0)} of {data?.total || 0}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                className="p-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                const p = start + i;
                if (p > totalPages) return null;
                return (
                  <button key={p} onClick={() => setPage(p)}
                    className={cn(
                      'w-8 h-8 rounded-lg text-sm font-medium transition-colors',
                      p === page ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]'
                    )}>
                    {p}
                  </button>
                );
              })}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                className="p-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

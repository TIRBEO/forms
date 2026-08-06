'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../../lib/api-client';
import { cn, formatDateTime } from '../../../../lib/utils';
import {
  ChevronDown, ChevronUp, Download, Search,
  ChevronLeft, ChevronRight, Columns2, Eye, Trash2,
  Inbox, Loader2, Check, X,
} from 'lucide-react';

interface Field {
  id: string;
  type: string;
  label: string;
  required: boolean;
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

interface EditingCell {
  responseId: string;
  fieldId: string;
}

const GUTTER_W = 48;
const TIMESTAMP_W = 176;
const RESPONDENT_W = 192;

export default function ResponsesPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [data, setData] = useState<ResponsesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage] = useState(25);
  const [sortField, setSortField] = useState<string>('submittedAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set());
  const [showColumnPicker, setShowColumnPicker] = useState(false);
  const [editing, setEditing] = useState<EditingCell | null>(null);
  const [draft, setDraft] = useState('');
  const [savingCell, setSavingCell] = useState<EditingCell | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [filterField, setFilterField] = useState<string | null>(null);
  const [filterText, setFilterText] = useState('');
  const editInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    api.get<ResponsesData>(`/api/forms/${id}/responses?page=${page}&perPage=${perPage}`)
      .then(d => {
        setData(d);
        setVisibleColumns(prev => prev.size ? prev : new Set(['submittedAt', 'respondent', ...d.fields.map(f => f.id)]));
        setLoading(false);
      })
      .catch(() => {
        setData({ fields: [], responses: [], total: 0, page: 1, perPage });
        setLoading(false);
      });
  }, [id, page, perPage]);

  useEffect(() => {
    if (editing) editInputRef.current?.focus();
  }, [editing]);

  const toggleSort = (field: string) => {
    if (sortField === field) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
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

  const startEdit = (response: Response, fieldId: string, initial: string) => {
    setEditing({ responseId: response.id, fieldId });
    setDraft(initial);
  };

  const cancelEdit = () => {
    setEditing(null);
    setDraft('');
  };

  const commitEdit = async () => {
    if (!editing) return;
    const { responseId, fieldId } = editing;
    const prevAnswers = data?.responses.find(r => r.id === responseId)?.answers || {};
    const nextAnswers = { ...prevAnswers, [fieldId]: draft };
    setData(prev => prev
      ? { ...prev, responses: prev.responses.map(r => r.id === responseId ? { ...r, answers: nextAnswers } : r) }
      : prev);
    setEditing(null);
    setSavingCell({ responseId, fieldId });
    try {
      await api.put(`/api/forms/${id}/responses/${responseId}`, { answers: nextAnswers });
    } catch {
      setData(prev => prev
        ? { ...prev, responses: prev.responses.map(r => r.id === responseId ? { ...r, answers: prevAnswers } : r) }
        : prev);
    } finally {
      setSavingCell(null);
    }
  };

  const handleDelete = async (responseId: string) => {
    setConfirmDelete(null);
    const prev = data?.responses.find(r => r.id === responseId);
    setData(prevData => prevData
      ? { ...prevData, responses: prevData.responses.filter(r => r.id !== responseId), total: Math.max(0, prevData.total - 1) }
      : prevData);
    try {
      await api.delete(`/api/forms/${id}/responses/${responseId}`);
    } catch {
      setData(prevData => prevData && prev
        ? { ...prevData, responses: [prev, ...prevData.responses], total: prevData.total + 1 }
        : prevData);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await api.download(`/api/forms/${id}/export?format=csv`, `${id}-responses.csv`);
    } finally {
      setExporting(false);
    }
  };

  const filtered = useMemo(() => {
    let rows = data?.responses || [];
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      rows = rows.filter(r =>
        (r.respondent || '').toLowerCase().includes(q) ||
        Object.values(r.answers).some(v => (v || '').toLowerCase().includes(q))
      );
    }
    const ft = filterText.trim().toLowerCase();
    if (filterField && ft) {
      rows = rows.filter(r => {
        if (filterField === 'submittedAt') return formatDateTime(r.submittedAt).toLowerCase().includes(ft);
        if (filterField === 'respondent') return (r.respondent || 'Anonymous').toLowerCase().includes(ft);
        return (r.answers[filterField] || '').toLowerCase().includes(ft);
      });
    }
    return rows;
  }, [data, searchQuery, filterField, filterText]);

  const sorted = useMemo(() => {
    const rows = [...filtered];
    if (sortField === 'submittedAt') {
      rows.sort((a, b) => {
        const cmp = new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
        return sortDir === 'asc' ? cmp : -cmp;
      });
    } else {
      rows.sort((a, b) => {
        const va = (a.answers[sortField] || '').toLowerCase();
        const vb = (b.answers[sortField] || '').toLowerCase();
        const cmp = va.localeCompare(vb);
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return rows;
  }, [filtered, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil((data?.total || 0) / perPage));
  const allColumns = [
    { id: 'submittedAt', label: 'Timestamp', fixed: true },
    { id: 'respondent', label: 'Respondent', fixed: true },
    ...(data?.fields || []).map(f => ({ id: f.id, label: f.label, fixed: false })),
  ];
  const shownColumns = allColumns.filter(c => visibleColumns.has(c.id));

  const displayValue = (response: Response, fieldId: string) => {
    if (fieldId === 'submittedAt') return formatDateTime(response.submittedAt);
    if (fieldId === 'respondent') return response.respondent || 'Anonymous';
    return response.answers[fieldId] ?? '';
  };

  const isEditingCell = (responseId: string, fieldId: string) =>
    editing?.responseId === responseId && editing?.fieldId === fieldId;
  const isSavingCell = (responseId: string, fieldId: string) =>
    savingCell?.responseId === responseId && savingCell?.fieldId === fieldId;

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
            <button onClick={() => setShowColumnPicker(p => !p)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border-2 border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] transition-colors">
              <Columns2 className="w-3.5 h-3.5" />
              Columns
            </button>
            {showColumnPicker && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowColumnPicker(false)} />
                <div className="absolute right-0 top-full mt-1 z-20 w-56  border-2 border-[var(--color-border)] bg-[var(--color-surface)] shadow-brutal-sm py-2">
                  {allColumns.map(col => (
                    <label key={col.id} className="flex items-center gap-2 px-4 py-1.5 text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-muted)] cursor-pointer">
                      <input type="checkbox" checked={visibleColumns.has(col.id)} onChange={() => toggleColumn(col.id)}
                        className="rounded border-[var(--color-border)] accent-[var(--color-primary)]" />
                      <span className="truncate">{col.label}</span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>
          <button onClick={handleExport} disabled={exporting}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border-2 border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] transition-colors disabled:opacity-50">
            {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            Export CSV
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 flex-1 max-w-md px-3 py-2 rounded-lg bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] text-sm">
          <Search className="w-4 h-4 shrink-0" />
          <input type="text" placeholder="Search responses..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none flex-1 text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)]" />
        </div>
        <select value={filterField || ''} onChange={e => { setFilterField(e.target.value || null); setFilterText(''); }}
          className="px-3 py-2 rounded-lg text-sm border-2 border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] outline-none cursor-pointer">
          <option value="">All columns</option>
          {allColumns.map(col => (
            <option key={col.id} value={col.id}>{col.label}</option>
          ))}
        </select>
        <input type="text" value={filterText} onChange={e => setFilterText(e.target.value)}
          placeholder="Filter value..."
          className="px-3 py-2 rounded-lg text-sm border-2 border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-primary)]" />
      </div>

      {data?.responses.length === 0 ? (
        <div className="border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center">
          <Inbox className="w-12 h-12 mx-auto mb-4 text-[var(--color-text-tertiary)]" />
          <h3 className="text-lg font-medium text-[var(--color-text)] mb-2">No responses yet</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">Share your form to start collecting responses</p>
        </div>
      ) : (
        <>
          <div className="border-2 border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
            <div className="max-h-[65vh] overflow-auto">
              <table className="border-collapse w-full text-sm">
                <thead>
                  <tr>
                    <th className="sticky top-0 left-0 z-40 bg-[var(--color-surface-muted)] border-b border-r border-[var(--color-border)] px-2 py-2.5 text-center text-xs font-semibold text-[var(--color-text-tertiary)] w-12">#</th>
                    {shownColumns.map(col => {
                      const fixed = col.id === 'submittedAt' || col.id === 'respondent';
                      const stickyLeft = col.id === 'submittedAt' ? GUTTER_W : col.id === 'respondent' ? GUTTER_W + TIMESTAMP_W : undefined;
                      const width = col.id === 'submittedAt' ? TIMESTAMP_W : col.id === 'respondent' ? RESPONDENT_W : 220;
                      return (
                        <th key={col.id} onClick={() => toggleSort(col.id)}
                          style={stickyLeft !== undefined ? { left: stickyLeft, minWidth: width } : { minWidth: width }}
                          className={cn(
                            'sticky top-0 bg-[var(--color-surface-muted)] border-b border-r border-[var(--color-border)] px-4 py-2.5 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider cursor-pointer hover:text-[var(--color-text)] transition-colors select-none whitespace-nowrap',
                            fixed ? 'z-40' : 'z-30'
                          )}>
                          <span className="flex items-center justify-between gap-2">
                            <span className="truncate">{col.label}</span>
                            {sortField === col.id && (sortDir === 'desc' ? <ChevronDown className="w-3 h-3 shrink-0" /> : <ChevronUp className="w-3 h-3 shrink-0" />)}
                          </span>
                        </th>
                      );
                    })}
                    <th className="sticky top-0 z-30 bg-[var(--color-surface-muted)] border-b border-[var(--color-border)] px-2 py-2.5 text-right text-xs font-semibold text-[var(--color-text-tertiary)] w-24">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((response, rowIdx) => {
                    const isSavingRow = savingCell?.responseId === response.id;
                    const isConfirming = confirmDelete === response.id;
                    return (
                      <tr key={response.id}
                        className={cn(
                          'border-b border-[var(--color-border)] group hover:bg-[var(--color-surface-muted)]/40 transition-colors',
                          isConfirming && 'bg-[var(--color-error-surface)]/50'
                        )}>
                        <td className={cn(
                          'sticky left-0 z-20 bg-[var(--color-surface)] px-2 py-2 text-center text-xs text-[var(--color-text-tertiary)] border-r border-[var(--color-border)] select-none',
                          'group-hover:bg-[var(--color-surface-muted)]/60'
                        )}>
                          {isSavingRow ? <Loader2 className="w-3.5 h-3.5 mx-auto animate-spin text-[var(--color-primary)]" /> : ((page - 1) * perPage + rowIdx + 1)}
                        </td>
                        {shownColumns.map(col => {
                          const fixed = col.id === 'submittedAt' || col.id === 'respondent';
                          const stickyLeft = col.id === 'submittedAt' ? GUTTER_W : col.id === 'respondent' ? GUTTER_W + TIMESTAMP_W : undefined;
                          const editingHere = isEditingCell(response.id, col.id);
                          const savingHere = isSavingCell(response.id, col.id);
                          const value = displayValue(response, col.id);
                          return (
                            <td key={col.id} style={stickyLeft !== undefined ? { left: stickyLeft } : undefined}
                              onDoubleClick={() => !isConfirming && !fixed && startEdit(response, col.id, value)}
                              className={cn(
                                'px-4 py-2 border-r border-[var(--color-border)] align-middle',
                                fixed
                                  ? cn('sticky z-20 bg-[var(--color-surface)]', 'group-hover:bg-[var(--color-surface-muted)]/60')
                                  : 'cursor-text'
                              )}>
                              {fixed ? (
                                <span className={cn('block truncate', col.id === 'submittedAt' ? 'text-xs text-[var(--color-text-secondary)]' : 'font-medium text-[var(--color-text)]')}>
                                  {value}
                                </span>
                              ) : editingHere ? (
                                <input
                                  ref={editInputRef}
                                  value={draft}
                                  onChange={e => setDraft(e.target.value)}
                                  onBlur={commitEdit}
                                  onKeyDown={e => {
                                    if (e.key === 'Enter') commitEdit();
                                    if (e.key === 'Escape') cancelEdit();
                                  }}
                                  className="w-full min-w-[140px] bg-transparent outline-none border-b border-[var(--color-primary)] text-[var(--color-text)]"
                                />
                              ) : (
                                <span className={cn('flex items-center gap-2', !value && 'text-[var(--color-text-tertiary)]')}>
                                  <span className="truncate">{value || '\u00a0'}</span>
                                  {savingHere && <Loader2 className="w-3 h-3 shrink-0 animate-spin text-[var(--color-primary)]" />}
                                </span>
                              )}
                            </td>
                          );
                        })}
                        <td className="px-2 py-2 text-right">
                          {isConfirming ? (
                            <span className="inline-flex items-center gap-1">
                              <span className="text-xs text-[var(--color-error)] mr-1">Delete?</span>
                              <button onClick={() => handleDelete(response.id)}
                                className="p-1.5 rounded-md bg-[var(--color-error)] text-[var(--color-bg)] hover:opacity-90 transition-opacity" title="Confirm delete">
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => setConfirmDelete(null)}
                                className="p-1.5 rounded-md border-2 border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] transition-colors" title="Cancel">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => router.push(`/f/${id}/responses/${response.id}`)}
                                className="p-1.5 rounded-md border-2 border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] transition-colors" title="View response">
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => setConfirmDelete(response.id)}
                                className="p-1.5 rounded-md border-2 border-[var(--color-border)] text-[var(--color-error)] hover:bg-[var(--color-error-surface)] transition-colors" title="Delete response">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-[var(--color-text-tertiary)]">
              {data && data.total > 0 ? `Showing ${(page - 1) * perPage + 1}-${Math.min(page * perPage, data.total)} of ${data.total}` : '0 responses'}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                className="p-2 rounded-lg border-2 border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
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
                      p === page ? 'bg-[var(--color-primary)] text-[var(--color-bg)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]'
                    )}>
                    {p}
                  </button>
                );
              })}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                className="p-2 rounded-lg border-2 border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

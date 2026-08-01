'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '../../../../lib/api-client';
import { cn, formatDateTime, formatRelativeDate } from '../../../../lib/utils';
import {
  History, RotateCcw, Clock, User, FileText, GitCompare,
  CheckCircle2, ChevronDown, ChevronRight, ArrowLeft,
  Download,
} from 'lucide-react';

interface FormVersion {
  id: string;
  version: number;
  createdAt: string;
  createdBy: string;
  isCurrent: boolean;
  summary: string;
  fieldCount: number;
}


export default function VersionsPage() {
  const params = useParams();
  const id = params.id as string;
  const [versions, setVersions] = useState<FormVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [compareVersion, setCompareVersion] = useState<string | null>(null);
  const [restoring, setRestoring] = useState<string | null>(null);

  useEffect(() => {
    api.get<{ versions: FormVersion[] }>(`/api/forms/${id}/versions`)
      .then(d => { setVersions(d.versions || []); setLoading(false); })
  }, [id]);

  const restoreVersion = async (versionId: string) => {
    setRestoring(versionId);
    try { await api.post(`/api/forms/${id}/versions/${versionId}/restore`); } catch {}
    setTimeout(() => setRestoring(null), 1000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-[var(--color-text)]">Version history</h1>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{versions.length} versions</p>
        </div>
        <button onClick={() => setCompareMode(!compareMode)}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors',
            compareMode
              ? 'border-[var(--color-primary)] bg-[var(--color-primary-surface)] text-[var(--color-primary)]'
              : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]'
          )}>
          <GitCompare className="w-4 h-4" />
          Compare
        </button>
      </div>

      <div className="space-y-3">
        {versions.map((version, idx) => {
          const isSelected = selectedVersion === version.id;
          const isCompareTarget = compareVersion === version.id;
          const isPrev = compareMode && idx < versions.length - 1;

          return (
            <div key={version.id}
              className={cn(
                'rounded-xl border bg-[var(--color-surface)] transition-all',
                version.isCurrent
                  ? 'border-[var(--color-primary)] shadow-sm'
                  : isSelected || isCompareTarget
                    ? 'border-[var(--color-primary)]'
                    : 'border-[var(--color-border)]'
              )}>
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium shrink-0',
                      version.isCurrent
                        ? 'bg-[var(--color-primary-surface)] text-[var(--color-primary)]'
                        : 'bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]'
                    )}>
                      v{version.version}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-[var(--color-text)]">Version {version.version}</span>
                        {version.isCurrent && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--color-primary-surface)] text-[var(--color-primary)]">
                            <CheckCircle2 className="w-3 h-3" />
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-1">{version.summary}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-[var(--color-text-tertiary)]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatRelativeDate(version.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {version.createdBy}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {version.fieldCount} fields
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    {compareMode && !version.isCurrent && (
                      <>
                        <button onClick={() => {
                          if (isSelected) setSelectedVersion(null);
                          else { setSelectedVersion(version.id); if (compareVersion === version.id) setCompareVersion(null); }
                        }}
                          className={cn(
                            'px-2 py-1 rounded-lg text-xs font-medium border transition-colors',
                            isSelected ? 'border-[var(--color-primary)] bg-[var(--color-primary-surface)] text-[var(--color-primary)]' : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]'
                          )}>
                          Base
                        </button>
                        {isPrev && (
                          <button onClick={() => {
                            if (isCompareTarget) setCompareVersion(null);
                            else setCompareVersion(version.id);
                          }}
                            className={cn(
                              'px-2 py-1 rounded-lg text-xs font-medium border transition-colors',
                              isCompareTarget ? 'border-[var(--color-primary)] bg-[var(--color-primary-surface)] text-[var(--color-primary)]' : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]'
                            )}>
                            Compare
                          </button>
                        )}
                      </>
                    )}
                    {!version.isCurrent && !compareMode && (
                      <button onClick={() => restoreVersion(version.id)} disabled={restoring === version.id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] disabled:opacity-50 transition-colors">
                        <RotateCcw className="w-3 h-3" />
                        {restoring === version.id ? 'Restoring...' : 'Restore'}
                      </button>
                    )}
                  </div>
                </div>

                {isSelected && compareVersion && (
                  <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                    <div className="rounded-lg bg-[var(--color-surface-muted)] p-4">
                      <h4 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">Changes</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-[var(--color-success)]">
                          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
                          <span>Field order changed</span>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--color-success)]">
                          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
                          <span>Labels updated</span>
                        </div>
                        {version.fieldCount !== versions[versions.indexOf(version) + 1]?.fieldCount && (
                          <div className="flex items-center gap-2 text-[var(--color-warning)]">
                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-warning)]" />
                            <span>Field count changed: {version.fieldCount} vs {versions[versions.indexOf(version) + 1]?.fieldCount}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {versions.length === 0 && (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center">
          <History className="w-12 h-12 mx-auto mb-4 text-[var(--color-text-tertiary)]" />
          <h3 className="text-lg font-medium text-[var(--color-text)] mb-2">No versions yet</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">Versions are created automatically when you save changes</p>
        </div>
      )}
    </div>
  );
}

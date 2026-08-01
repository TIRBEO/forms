'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../../lib/api-client';
import { cn, formatRelativeDate, formatDateTime } from '../../../../lib/utils';
import {
  Eye, Users, Clock, Target, Share2, Download, ExternalLink,
  CheckCircle2, XCircle, AlertCircle, BarChart3, ArrowUp, ArrowDown,
  Copy, ChevronRight, Settings,
} from 'lucide-react';

interface FormOverview {
  id: string;
  title: string;
  status: string;
  publicId: string;
  responseCount: number;
  viewCount: number;
  completionRate: number;
  avgTimeSeconds: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  recentResponses: {
    id: string;
    respondent?: string;
    submittedAt: string;
    duration?: number;
  }[];
  fields: { id: string; label: string; type: string }[];
}


function statCard(icon: any, label: string, value: string, trend?: { dir: 'up' | 'down'; pct: string }) {
  const Icon = icon;
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-surface)] flex items-center justify-center">
          <Icon className="w-5 h-5 text-[var(--color-primary)]" />
        </div>
        {trend && (
          <span className={cn('flex items-center gap-0.5 text-xs font-medium', trend.dir === 'up' ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]')}>
            {trend.dir === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            {trend.pct}
          </span>
        )}
      </div>
      <div className="text-2xl font-semibold text-[var(--color-text)]">{value}</div>
      <div className="text-xs text-[var(--color-text-secondary)] mt-0.5">{label}</div>
    </div>
  );
}

export default function FormOverview() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [data, setData] = useState<FormOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<FormOverview>(`/api/forms/${id}/overview`)
      .then(setData)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20 text-[var(--color-text-secondary)]">
        Failed to load form overview.
      </div>
    );
  }

  const completionPct = `${data.completionRate}%`;
  const avgTime = data.avgTimeSeconds < 60 ? `${data.avgTimeSeconds}s` : `${Math.floor(data.avgTimeSeconds / 60)}m ${data.avgTimeSeconds % 60}s`;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-[var(--color-text)]">Overview</h1>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Created {formatRelativeDate(data.createdAt)} &middot; Updated {formatRelativeDate(data.updatedAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { navigator.clipboard.writeText(`https://tirbeo.app/f/${data.publicId}`); }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] transition-colors">
            <Copy className="w-3.5 h-3.5" />
            Copy link
          </button>
          <button onClick={() => router.push(`/f/${id}/responses`)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] transition-colors">
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
          {data.status === 'published' && (
            <button onClick={() => window.open(`/f/${data.publicId}`, '_blank')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors">
              <ExternalLink className="w-4 h-4" />
              Preview
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCard(Eye, 'Total views', data.viewCount.toLocaleString(), { dir: 'up', pct: '12%' })}
        {statCard(Users, 'Total submissions', data.responseCount.toLocaleString(), { dir: 'up', pct: '8%' })}
        {statCard(Target, 'Completion rate', completionPct, { dir: 'up', pct: '3%' })}
        {statCard(Clock, 'Avg. time', avgTime, { dir: 'down', pct: '5%' })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
            <h2 className="text-sm font-semibold text-[var(--color-text)]">Recent responses</h2>
            <button onClick={() => router.push(`/f/${id}/responses`)}
              className="text-xs font-medium text-[var(--color-primary)] hover:underline">
              View all
            </button>
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {data.recentResponses.map(r => (
              <button key={r.id} onClick={() => router.push(`/f/${id}/responses/${r.id}`)}
                className="flex items-center justify-between w-full px-5 py-3 text-left hover:bg-[var(--color-surface-muted)] transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-primary-surface)] flex items-center justify-center text-xs font-medium text-[var(--color-primary)]">
                    {r.respondent?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text)] truncate">{r.respondent || 'Anonymous'}</p>
                    <p className="text-xs text-[var(--color-text-tertiary)]">{formatRelativeDate(r.submittedAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-[var(--color-text-tertiary)]">
                  {r.duration && <span>{r.duration < 60 ? `${r.duration}s` : `${Math.floor(r.duration / 60)}m ${r.duration % 60}s`}</span>}
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            ))}
            {data.recentResponses.length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-[var(--color-text-tertiary)]">
                No responses yet
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="px-5 py-4 border-b border-[var(--color-border)]">
            <h2 className="text-sm font-semibold text-[var(--color-text)]">Quick actions</h2>
          </div>
          <div className="p-4 space-y-2">
            <button onClick={() => router.push(`/f/${id}/edit`)}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-muted)] transition-colors">
              <BarChart3 className="w-4 h-4 text-[var(--color-primary)]" />
              Edit form
            </button>
            <button onClick={() => router.push(`/f/${id}/analytics`)}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-muted)] transition-colors">
              <BarChart3 className="w-4 h-4 text-[var(--color-primary)]" />
              View analytics
            </button>
            <button onClick={() => router.push(`/f/${id}/collaborators`)}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-muted)] transition-colors">
              <Users className="w-4 h-4 text-[var(--color-primary)]" />
              Manage collaborators
            </button>
            <button onClick={() => router.push(`/f/${id}/settings`)}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-muted)] transition-colors">
              <Settings className="w-4 h-4 text-[var(--color-primary)]" />
              Form settings
            </button>
          </div>

          <div className="px-5 py-4 border-t border-[var(--color-border)]">
            <h2 className="text-sm font-semibold text-[var(--color-text)] mb-3">Form fields</h2>
            <div className="space-y-1.5">
              {data.fields.map(f => (
                <div key={f.id} className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                  <span className="truncate">{f.label}</span>
                  <span className="text-[var(--color-text-tertiary)] ml-auto">{f.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

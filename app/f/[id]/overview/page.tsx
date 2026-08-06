'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../../lib/api-client';
import { useRealtimeFormStats } from '../../../../lib/use-realtime-form-stats';
import { formatRelativeDate } from '../../../../lib/utils';
import {
  Eye, Users, Clock, Target, Download, ExternalLink,
  BarChart3, Copy, ChevronRight, Settings, Activity,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { StatCard } from '../../../components/stat-card';

interface FormOverview {
  id: string;
  title: string;
  status: string;
  publicId: string;
  source?: 'user' | 'admin';
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
  timeline: { date: string; views: number; responses: number }[];
}

// Resolve a theme token to a concrete color for recharts (fill/attribute APIs).
function useThemeColor(name: string, fallback: string): string {
  const [color, setColor] = useState(fallback);
  useEffect(() => {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    if (v) setColor(v);
  }, [name]);
  return color;
}

function LivePill({ connected }: { connected: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[var(--color-primary-surface)] text-[var(--color-primary)]">
      <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-[var(--color-text-tertiary)]'}`} />
      {connected ? 'Live' : 'Connecting…'}
    </span>
  );
}

export default function FormOverview() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [data, setData] = useState<FormOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState({ views: 0, responses: 0 });

  const primaryColor = useThemeColor('--color-primary', '#4f7aff');
  const tertiaryColor = useThemeColor('--color-text-tertiary', '#94a3b8');

  const { connected } = useRealtimeFormStats(id, (delta) => {
    setLive(l => ({
      views: l.views + (delta.views || 0),
      responses: l.responses + (delta.responses || 0),
    }));
  });

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

  const views = data.viewCount + live.views;
  const responses = data.responseCount + live.responses;
  const completionPct = `${data.completionRate}%`;
  const avgTime = data.avgTimeSeconds < 60 ? `${data.avgTimeSeconds}s` : `${Math.floor(data.avgTimeSeconds / 60)}m ${data.avgTimeSeconds % 60}s`;

  const chartData = (data.timeline || []).map(t => ({
    ...t,
    label: t.date.slice(5), // MM-DD
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-lg font-semibold text-[var(--color-text)]">Overview</h1>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              Created {formatRelativeDate(data.createdAt)} &middot; Updated {formatRelativeDate(data.updatedAt)}
            </p>
          </div>
          <LivePill connected={connected} />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/${data.source === 'admin' ? 'a' : 'f'}/${data.publicId}`); }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border-2 border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] transition-colors">
            <Copy className="w-3.5 h-3.5" />
            Copy link
          </button>
          <button onClick={async () => { try { await api.download(`/api/forms/${id}/export?format=csv`, `${id}-responses.csv`); } catch {} }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border-2 border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] transition-colors">
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
          {data.status === 'published' && (
            <button onClick={() => window.open(`/${data.source === 'admin' ? 'a' : 'f'}/${data.publicId}`, '_blank')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-[var(--color-bg)] text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors">
              <ExternalLink className="w-4 h-4" />
              Preview
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total views" value={views.toLocaleString()} icon={<Eye className="w-5 h-5 text-[var(--color-primary)]" />} hint={connected ? 'Live' : undefined} />
        <StatCard label="Total submissions" value={responses.toLocaleString()} icon={<Users className="w-5 h-5 text-[var(--color-primary)]" />} hint={connected ? 'Live' : undefined} />
        <StatCard label="Completion rate" value={completionPct} icon={<Target className="w-5 h-5 text-[var(--color-primary)]" />} />
        <StatCard label="Avg. time" value={avgTime} icon={<Clock className="w-5 h-5 text-[var(--color-primary)]" />} />
      </div>

      <div className="border-2 border-[var(--color-border)] bg-[var(--color-surface)] mb-8">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-[var(--color-text)]">Views vs responses</h2>
            <span className="text-xs text-[var(--color-text-tertiary)]">Last 14 days</span>
          </div>
          {connected && (
            <span className="inline-flex items-center gap-1.5 text-[11px] text-[var(--color-text-secondary)]">
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              Updates in real time
            </span>
          )}
        </div>
        <div className="p-4">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} barGap={2} margin={{ top: 4, right: 4, bottom: 0, left: -8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: tertiaryColor }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: tertiaryColor }} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: 'var(--color-surface-muted)' }}
                  contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12, fontSize: 12, color: 'var(--color-text)' }}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend wrapperStyle={{ fontSize: 12, color: 'var(--color-text-secondary)' }} />
                <Bar dataKey="views" name="Views" fill={primaryColor} radius={[4, 4, 0, 0]} />
                <Bar dataKey="responses" name="Responses" fill={tertiaryColor} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="py-16 text-center text-sm text-[var(--color-text-tertiary)]">
              No activity yet — share your form link to start collecting views.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2  border-2 border-[var(--color-border)] bg-[var(--color-surface)]">
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

        <div className="border-2 border-[var(--color-border)] bg-[var(--color-surface)]">
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

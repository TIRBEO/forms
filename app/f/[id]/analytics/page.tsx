'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '../../../../lib/api-client';
import { cn, formatDate } from '../../../../lib/utils';
import {
  Eye, Users, Target, Clock, BarChart3, Download, ArrowUp, ArrowDown,
  Smartphone, Monitor, Tablet, Globe, Star, ChevronRight,
} from 'lucide-react';

interface AnalyticsData {
  totalViews: number;
  totalResponses: number;
  completionRate: number;
  avgTimeSeconds: number;
  submissionTimeline: { date: string; count: number }[];
  fieldBreakdown: { fieldId: string; fieldLabel: string; fieldType: string; responses: number; skipped: number }[];
  deviceBreakdown: { device: string; count: number; percentage: number }[];
  ratingDistribution?: { rating: number; count: number }[];
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

export default function AnalyticsPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<AnalyticsData>(`/api/forms/${id}/analytics`)
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
        Failed to load analytics.
      </div>
    );
  }

  const maxTimelineCount = Math.max(...data.submissionTimeline.map(d => d.count), 1);
  const completionPct = `${data.completionRate}%`;
  const avgTime = data.avgTimeSeconds < 60 ? `${data.avgTimeSeconds}s` : `${Math.floor(data.avgTimeSeconds / 60)}m ${data.avgTimeSeconds % 60}s`;

  const deviceIcons: Record<string, any> = {
    Mobile: Smartphone,
    Desktop: Monitor,
    Tablet: Tablet,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-[var(--color-text)]">Analytics</h1>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Performance and submission insights</p>
        </div>
        <button
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] transition-colors">
          <Download className="w-3.5 h-3.5" />
          Export report
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCard(Eye, 'Total views', data.totalViews.toLocaleString(), { dir: 'up', pct: '12%' })}
        {statCard(Users, 'Total submissions', data.totalResponses.toLocaleString(), { dir: 'up', pct: '8%' })}
        {statCard(Target, 'Completion rate', completionPct, { dir: 'up', pct: '3%' })}
        {statCard(Clock, 'Avg. time', avgTime, { dir: 'down', pct: '5%' })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h2 className="text-sm font-semibold text-[var(--color-text)] mb-4">Submission timeline</h2>
          <div className="flex items-end gap-1.5 h-32">
            {data.submissionTimeline.map((d, i) => {
              const height = (d.count / maxTimelineCount) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div className="absolute bottom-full mb-1 hidden group-hover:block bg-[var(--color-text)] text-[var(--color-bg)] text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap">
                    {d.count} submissions
                  </div>
                  <div
                    className="w-full rounded-t bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-colors cursor-pointer"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[9px] text-[var(--color-text-tertiary)] whitespace-nowrap">
                    {formatDate(d.date).slice(0, 6)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h2 className="text-sm font-semibold text-[var(--color-text)] mb-4">Device breakdown</h2>
          <div className="space-y-3">
            {data.deviceBreakdown.map(d => {
              const Icon = deviceIcons[d.device] || Globe;
              return (
                <div key={d.device}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-[var(--color-primary)]" />
                      <span className="text-sm text-[var(--color-text)]">{d.device}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--color-text)]">{d.count}</span>
                      <span className="text-xs text-[var(--color-text-tertiary)]">{d.percentage}%</span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--color-surface-muted)] overflow-hidden">
                    <div className="h-full rounded-full bg-[var(--color-primary)] transition-all" style={{ width: `${d.percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h2 className="text-sm font-semibold text-[var(--color-text)] mb-4">Per-question breakdown</h2>
          <div className="space-y-3">
            {data.fieldBreakdown.map(f => (
              <div key={f.fieldId} className="flex items-center justify-between py-2 border-b border-[var(--color-border)] last:border-0">
                <div className="min-w-0 flex-1 mr-4">
                  <p className="text-sm text-[var(--color-text)] truncate">{f.fieldLabel}</p>
                  <p className="text-xs text-[var(--color-text-tertiary)]">{f.fieldType}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-[var(--color-text-secondary)]">
                  <span>{f.responses} responses</span>
                  <span className={cn(f.skipped > 0 ? 'text-[var(--color-warning)]' : 'text-[var(--color-text-tertiary)]')}>
                    {f.skipped} skipped
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {data.ratingDistribution && (
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <h2 className="text-sm font-semibold text-[var(--color-text)] mb-4">Rating distribution</h2>
            <div className="space-y-2">
              {data.ratingDistribution.sort((a, b) => b.rating - a.rating).map(r => {
                const pct = (r.count / data.totalResponses) * 100;
                return (
                  <div key={r.rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5 w-16">
                      {Array.from({ length: r.rating }, (_, i) => (
                        <Star key={i} className="w-3 h-3 fill-[var(--color-warning)] text-[var(--color-warning)]" />
                      ))}
                    </div>
                    <div className="flex-1 h-3 rounded-full bg-[var(--color-surface-muted)] overflow-hidden">
                      <div className="h-full rounded-full bg-[var(--color-warning)] transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-[var(--color-text-secondary)] w-8 text-right">{r.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

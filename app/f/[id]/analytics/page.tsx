'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '../../../../lib/api-client';
import { cn, formatDate } from '../../../../lib/utils';
import { BarChart, DonutChart } from '@tirbeo/charts';
import {
  Eye, Users, Target, Clock, Download,
  Star,
} from 'lucide-react';
import { StatCard } from '../../../components/stat-card';

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

function maxSegments(data: { name: string; value: number }[], max: number): { name: string; value: number }[] {
  if (data.length <= max) return data;
  const top = data.slice(0, max - 1);
  const rest = data.slice(max - 1).reduce((sum, d) => sum + d.value, 0);
  return [...top, { name: 'Other', value: rest }];
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

  const completionPct = `${data.completionRate}%`;
  const avgTime = data.avgTimeSeconds < 60 ? `${data.avgTimeSeconds}s` : `${Math.floor(data.avgTimeSeconds / 60)}m ${data.avgTimeSeconds % 60}s`;

  const timelineData = data.submissionTimeline.map(d => ({ name: formatDate(d.date).slice(0, 6), count: d.count }));
  const deviceData = maxSegments(data.deviceBreakdown.map(d => ({ name: d.device, value: d.count })), 5);
  const totalDeviceCount = deviceData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-[var(--color-text)]">Analytics</h1>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Performance and submission insights</p>
        </div>
        <button
          onClick={async () => { try { await api.download(`/api/forms/${id}/export?format=csv`, `${id}-responses.csv`); } catch {} }}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border-2 border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] transition-colors">
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total views" value={data.totalViews.toLocaleString()} icon={<Eye className="w-5 h-5 text-[var(--color-primary)]" />} />
        <StatCard label="Total submissions" value={data.totalResponses.toLocaleString()} icon={<Users className="w-5 h-5 text-[var(--color-primary)]" />} />
        <StatCard label="Completion rate" value={completionPct} icon={<Target className="w-5 h-5 text-[var(--color-primary)]" />} />
        <StatCard label="Avg. time" value={avgTime} icon={<Clock className="w-5 h-5 text-[var(--color-primary)]" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h2 className="text-sm font-semibold text-[var(--color-text)] mb-4">Submission timeline</h2>
          {timelineData.length === 0 ? (
            <p className="text-sm text-[var(--color-text-tertiary)] text-center py-12">No submissions yet</p>
          ) : (
            <BarChart data={timelineData} bars={[{ key: 'count', name: 'Submissions' }]} height={200} />
          )}
        </div>

        <div className="border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h2 className="text-sm font-semibold text-[var(--color-text)] mb-4">Device breakdown</h2>
          {deviceData.length === 0 ? (
            <p className="text-sm text-[var(--color-text-tertiary)] text-center py-12">No device data</p>
          ) : (
            <DonutChart
              data={deviceData}
              height={200}
              centerValue={data.totalResponses.toLocaleString()}
              centerLabel="responses"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-5">
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
          <div className="border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-5">
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

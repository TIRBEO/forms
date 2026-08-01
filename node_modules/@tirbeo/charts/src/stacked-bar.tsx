'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface StackedBarChartProps {
  data: Record<string, unknown>[];
  bars: { key: string; color: string; name?: string }[];
  xKey?: string;
  height?: number;
}

export function StackedBarChart({ data, bars, xKey = 'name', height = 300 }: StackedBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-admin-border)" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: 'var(--color-admin-text-muted)' }} />
        <YAxis tick={{ fontSize: 12, fill: 'var(--color-admin-text-muted)' }} />
        <Tooltip />
        <Legend />
        {bars.map(bar => (
          <Bar key={bar.key} dataKey={bar.key} fill={bar.color} name={bar.name || bar.key} stackId="a" />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

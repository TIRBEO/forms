"use client";

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export interface BarChartProps {
  data: Record<string, unknown>[];
  bars: { key: string; color?: string; name?: string }[];
  xKey?: string;
  height?: number;
}

export function BarChart({ data, bars, xKey = 'name', height = 300 }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-admin-border)" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: 'var(--color-admin-text-muted)' }} />
        <YAxis tick={{ fontSize: 12, fill: 'var(--color-admin-text-muted)' }} />
        <Tooltip />
        {bars.map(bar => (
          <Bar key={bar.key} dataKey={bar.key} fill={bar.color || 'var(--color-primary)'} name={bar.name || bar.key} />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
